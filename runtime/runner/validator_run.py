import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib import response

from openai import OpenAI


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT_PATH = ROOT / "input" / "phase0-validator-run-001.json"
RUNS_DIR = ROOT / "runs"

ALLOWED_SIGNAL_TYPES = {
    "confirmed_case",
    "monetizable_pain_signal",
    "technology_shift_signal",
    "hold",
    "noise",
}

ALLOWED_CONFIDENCE = {"high", "medium", "low"}


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def write_json(path: Path, payload: dict) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def write_text(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def write_jsonl(path: Path, records: list[dict]) -> None:
    content = ""
    if records:
        content = "\n".join(json.dumps(r, ensure_ascii=False) for r in records) + "\n"
    path.write_text(content, encoding="utf-8")


def resolve_input_path() -> Path:
    if len(sys.argv) > 2:
        raise SystemExit("Usage: python .\\runner\\validator_run.py [path_to_input_json]")
    if len(sys.argv) == 2:
        return Path(sys.argv[1]).resolve()
    return DEFAULT_INPUT_PATH


def load_jsonl(path: Path) -> list[dict]:
    if not path.exists():
        raise SystemExit(f"Missing JSONL file: {path}")

    records = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.strip():
            records.append(json.loads(line))
    return records


def strip_code_fences(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


def count_by_signal_type(records: list[dict]) -> dict:
    counts: dict[str, int] = {}
    for rec in records:
        key = rec.get("signal_type", "unknown")
        counts[key] = counts.get(key, 0) + 1
    return counts


def looks_like_url(text: str) -> bool:
    if not isinstance(text, str):
        return False
    text = text.strip().lower()
    return text.startswith("http://") or text.startswith("https://")


def validate_and_adjust_signals(validated_signals: list[dict], evidence_records: list[dict]) -> list[dict]:
    if len(validated_signals) != len(evidence_records):
        raise SystemExit(
            f"Validator returned {len(validated_signals)} items, but {len(evidence_records)} evidence items were provided."
        )

    input_ids = {rec["evidence_id"] for rec in evidence_records}
    output_ids = [rec.get("evidence_id") for rec in validated_signals]

    if set(output_ids) != input_ids:
        raise SystemExit(
            f"Validator evidence_id mismatch. Expected {sorted(input_ids)}, got {sorted(set(output_ids))}."
        )

    if len(output_ids) != len(set(output_ids)):
        raise SystemExit("Validator returned duplicate evidence_id values.")

    evidence_map = {rec["evidence_id"]: rec for rec in evidence_records}

    for rec in validated_signals:
        signal_type = rec.get("signal_type")
        confidence = rec.get("confidence")
        evidence_id = rec.get("evidence_id")
        money_link_ru = rec.get("money_link_ru", "")

        if signal_type not in ALLOWED_SIGNAL_TYPES:
            raise SystemExit(f"Invalid signal_type: {signal_type}")

        if confidence not in ALLOWED_CONFIDENCE:
            raise SystemExit(f"Invalid confidence: {confidence}")

        if looks_like_url(money_link_ru):
            raise SystemExit(
                f"money_link_ru must be economic explanation text, not URL. evidence_id={evidence_id}"
            )

        source_class = evidence_map[evidence_id].get("source_class")
        if source_class in {"vendor_marketing", "industry_article"} and signal_type == "confirmed_case":
            rec["signal_type"] = "monetizable_pain_signal"
            signal_type = "monetizable_pain_signal"
            
        if source_class in {"vendor_marketing", "industry_article"} and confidence == "high":
            rec["confidence"] = "medium"
        
        rec["source_class"] = evidence_map[evidence_id].get("source_class")
        rec["source_relevance"] = evidence_map[evidence_id].get("source_relevance")

    ordered = []
    for evidence in evidence_records:
        evidence_id = evidence["evidence_id"]
        ordered.append(next(rec for rec in validated_signals if rec.get("evidence_id") == evidence_id))
    return ordered


def main() -> None:
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise SystemExit("OPENROUTER_API_KEY is missing in environment.")

    input_path = resolve_input_path()
    if not input_path.exists():
        raise SystemExit(f"Missing input file: {input_path}")

    with input_path.open("r", encoding="utf-8") as f:
        run_input = json.load(f)

    run_id = run_input["run_id"]
    run_goal = run_input["run_goal"]
    current_hypothesis = run_input["current_hypothesis"]
    source_run_id = run_input["source_run_id"]
    source_run_dir = Path(run_input["source_run_dir"]).resolve()
    model_id = run_input.get("model_id", "openai/gpt-4o-mini-search-preview")

    provider_policy = run_input.get(
        "provider_policy",
        {
            "order": [],
            "allow_fallbacks": False,
            "require_parameters": True,
        },
    )

    evidence_path = source_run_dir / "evidence_index.jsonl"
    evidence_records = load_jsonl(evidence_path)

    if not evidence_records:
        raise SystemExit(f"No evidence records found in: {evidence_path}")

    run_dir = RUNS_DIR / run_id
    run_dir.mkdir(parents=True, exist_ok=True)

    started_at = utc_now_iso()

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )

    validation_rules = {
        "confirmed_case": "Use only when there is concrete operator/use case/result with clear payer, JTBD, outcome, and money-link.",
        "monetizable_pain_signal": "Use when the pain is economically relevant, but not fully proven as a confirmed case.",
        "technology_shift_signal": "Use when new technology materially changes how an old workflow or outcome can be achieved.",
        "hold": "Use when interesting but incomplete, ambiguous, too vendor/self-reported, or insufficiently grounded.",
        "noise": "Use when not materially relevant to payer-JTBD-outcome-money-link logic."
    }

    compact_evidence = []
    for rec in evidence_records:
        compact_evidence.append(
            {
                "evidence_id": rec.get("evidence_id"),
                "source_title": rec.get("source_title"),
                "source_url": rec.get("source_url"),
                "source_class": rec.get("source_class"),
                "source_relevance": rec.get("source_relevance"),
                "source_content_excerpt": rec.get("source_content_excerpt", "")[:2500],
            }
        )

    messages = [
        {
            "role": "system",
            "content": (
                "You are the validator gate for SaleCheckUp Signals Radar. "
                "Use ONLY the evidence fields provided. "
                "Do NOT invent URLs, facts, metrics, payers, JTBD, outcomes, or money links. "
                "If evidence is insufficient, classify it as hold or noise. "
                "Return EXACTLY one validated_signals item per input evidence record. "
                "Preserve evidence_id one-to-one. "
                "Vendor case study or customer story without independent corroboration must NOT be classified as confirmed_case. "
                "Such evidence may be classified at most as monetizable_pain_signal or hold. "
                "money_link_ru must be a short Russian explanation of why this matters economically. "
                "money_link_ru must NOT be a URL, citation, or raw link. "
                "Return ONLY valid JSON with this exact top-level shape: "
                "{"
                "\"validated_signals\":["
                "{"
                "\"candidate_id\":\"signal-001\","
                "\"evidence_id\":\"evidence-001\","
                "\"signal_type\":\"confirmed_case|monetizable_pain_signal|technology_shift_signal|hold|noise\","
                "\"confidence\":\"high|medium|low\","
                "\"payer_ru\":\"...\","
                "\"jtbd_ru\":\"...\","
                "\"outcome_ru\":\"...\","
                "\"money_link_ru\":\"...\","
                "\"rationale_ru\":\"...\","
                "\"weaknesses_ru\":\"...\","
                "\"source_class\":\"...\","
                "\"source_relevance\":\"...\""
                "}"
                "],"
                "\"validation_summary_ru\":\"...\""
                "}."
            ),
        },
        {
            "role": "user",
            "content": json.dumps(
                {
                    "run_goal": run_goal,
                    "current_hypothesis": current_hypothesis,
                    "source_run_id": source_run_id,
                    "validation_rules": validation_rules,
                    "evidence": compact_evidence,
                },
                ensure_ascii=False,
                indent=2,
            ),
        },
    ]

    extra_body = {"provider": provider_policy}

    response = client.chat.completions.create(
        model=model_id,
        messages=messages,
        extra_body=extra_body,
    )

    completed_at = utc_now_iso()
    request_id = getattr(response, "id", None)

    assistant_text = ""
    if response.choices and response.choices[0].message:
        assistant_text = response.choices[0].message.content or ""
        
    write_text(run_dir / "raw_validator_output.txt", assistant_text)
    
    raw_json = strip_code_fences(assistant_text)

    try:
        parsed = json.loads(raw_json)
    except json.JSONDecodeError:
        write_text(run_dir / "raw_validator_output.txt", assistant_text)
        raise SystemExit(
            "Validator model did not return valid JSON. "
            f"Raw output saved to: {run_dir / 'raw_validator_output.txt'}"
        )

    validated_signals = parsed.get("validated_signals", [])
    validation_summary_ru = parsed.get("validation_summary_ru", "")

    if not isinstance(validated_signals, list):
        raise SystemExit("validated_signals is not a list.")

    validated_signals = validate_and_adjust_signals(validated_signals, evidence_records)
    signal_type_counts = count_by_signal_type(validated_signals)

    validation_manifest = {
        "run_id": run_id,
        "source_run_id": source_run_id,
        "source_run_dir": str(source_run_dir),
        "input_package_path": str(input_path),
        "evidence_path": str(evidence_path),
        "model_id": model_id,
        "provider_policy": provider_policy,
        "request_refs": [
            {
                "request_id": request_id,
                "provider": "openrouter",
                "model_id": model_id,
                "requested_at": started_at,
                "response_status": "completed",
            }
        ],
        "run_status": "completed",
        "started_at": started_at,
        "completed_at": completed_at,
        "validated_signal_count": len(validated_signals),
        "signal_type_counts": signal_type_counts,
        "bundle_files": [
            "validation_manifest.json",
            "validated_signals.jsonl",
            "validation_summary_ru.md",
            "project_update_block_ru.md",
        ],
    }

    write_json(run_dir / "validation_manifest.json", validation_manifest)
    write_jsonl(run_dir / "validated_signals.jsonl", validated_signals)

    validation_summary_md = f"""# Validation Summary

## Run Goal
{run_goal}

## Current Hypothesis
{current_hypothesis}

## Source Run
{source_run_id}

## Evidence Count
{len(evidence_records)}

## Validated Signal Count
{len(validated_signals)}

## Signal Type Counts
{json.dumps(signal_type_counts, ensure_ascii=False, indent=2)}

## Summary
{validation_summary_ru}
"""
    write_text(run_dir / "validation_summary_ru.md", validation_summary_md)

    project_update_block_ru = f"""# Project Update Block

## Что проверяли
Validator gate на evidence из {source_run_id}.

## Что нашли
Провалидировано сигналов: {len(validated_signals)}.
Распределение по типам: {json.dumps(signal_type_counts, ensure_ascii=False)}

## Что осталось неясным
Нужно посмотреть, не остаётся ли validator слишком мягким к vendor/self-reported evidence.

## Что делать следующим run
Провести review validated_signals и решить, достаточно ли quality для следующего этапа.
"""
    write_text(run_dir / "project_update_block_ru.md", project_update_block_ru)

    print(f"Validator run completed: {run_id}")
    print(f"Source run: {source_run_id}")
    print(f"Run directory: {run_dir}")
    print(f"Request ID: {request_id}")
    print(f"Validated signal count: {len(validated_signals)}")
    print(f"Signal type counts: {signal_type_counts}")


if __name__ == "__main__":
    main()