from __future__ import annotations

import argparse
import json
import os
import re
import sys
from collections import Counter, defaultdict
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

try:
    from openai import OpenAI
except Exception:
    OpenAI = None


ALLOWED_REVIEW_DECISIONS = {"accept", "hold", "reject"}
ALLOWED_PRIORITY_HINTS = {"high", "medium", "low"}


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def load_json(path: Path) -> Dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def write_json(path: Path, payload: Dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)


def load_jsonl(path: Path) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as f:
        for line_no, raw_line in enumerate(f, start=1):
            line = raw_line.strip()
            if not line:
                continue
            try:
                value = json.loads(line)
            except json.JSONDecodeError as e:
                raise ValueError(f"Invalid JSONL at {path} line {line_no}: {e}") from e
            if not isinstance(value, dict):
                raise ValueError(f"JSONL item at {path} line {line_no} must be an object")
            items.append(value)
    return items


def write_jsonl(path: Path, items: Iterable[Dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as f:
        for item in items:
            f.write(json.dumps(item, ensure_ascii=False))
            f.write("\n")


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as f:
        f.write(text)


def resolve_path(base_dir: Path, path_value: str) -> Path:
    path = Path(path_value)
    if path.is_absolute():
        return path
    return (base_dir / path).resolve()


def safe_slug(value: str) -> str:
    return re.sub(r"[^a-zA-Z0-9._-]+", "_", value).strip("_")


def recursive_find_first(obj: Any, candidate_keys: List[str]) -> Optional[Any]:
    lowered = {k.lower() for k in candidate_keys}

    def _walk(value: Any) -> Optional[Any]:
        if isinstance(value, dict):
            for k, v in value.items():
                if str(k).lower() in lowered:
                    return v
            for v in value.values():
                found = _walk(v)
                if found is not None:
                    return found
        elif isinstance(value, list):
            for item in value:
                found = _walk(item)
                if found is not None:
                    return found
        return None

    return _walk(obj)


def get_candidate_id(item: Dict[str, Any]) -> str:
    candidate_id = recursive_find_first(
        item,
        [
            "candidate_id",
            "candidateId",
            "signal_candidate_id",
            "signalCandidateId",
        ],
    )
    if candidate_id is None:
        raise ValueError("validated_signals item is missing candidate_id")
    candidate_id = str(candidate_id).strip()
    if not candidate_id:
        raise ValueError("validated_signals item has empty candidate_id")
    return candidate_id


def infer_text_blob(obj: Any) -> str:
    try:
        return json.dumps(obj, ensure_ascii=False, sort_keys=True).lower()
    except Exception:
        return str(obj).lower()


def infer_flags(item: Dict[str, Any]) -> Dict[str, bool]:
    blob = infer_text_blob(item)

    vendor_or_self_reported_terms = [
        "vendor",
        "self-reported",
        "self reported",
        "self_reported",
        "marketing material",
        "marketing claim",
        "sales deck",
        "landing page",
        "press release",
        "case study",
        "testimonials",
        "testimonial",
        "website copy",
        "vendor material",
        "vendor-provided",
        "first-party claim",
        "first party claim",
        "founder statement",
        "company statement",
    ]

    weak_or_ambiguous_terms = [
        "weak",
        "ambiguous",
        "unclear",
        "uncertain",
        "tentative",
        "speculative",
        "possible",
        "potential",
        "could",
        "may",
        "incomplete",
        "insufficient",
        "low confidence",
        "limited evidence",
        "mixed evidence",
        "needs verification",
        "unverified",
    ]

    noise_terms = [
        "noise",
        "irrelevant",
        "unrelated",
        "spam",
        "duplicate",
        "duplicated",
        "boilerplate",
        "template only",
        "not actionable",
        "no monetization",
        "no money-link",
        "no money link",
        "out of scope",
    ]

    independent_evidence_terms = [
        "independent source",
        "third-party",
        "third party",
        "customer quote",
        "customer interview",
        "forum discussion",
        "review site",
        "community post",
        "public filing",
        "marketplace review",
        "multiple sources",
        "cross-source",
        "independent validation",
    ]

    confirmed_case_terms = [
        "confirmed_case",
        '"signal_type":"confirmed_case"',
        '"signal_type": "confirmed_case"',
        '"validated_signal_type":"confirmed_case"',
        '"validated_signal_type": "confirmed_case"',
    ]

    vendor_or_self_reported = any(term in blob for term in vendor_or_self_reported_terms)
    weak_or_ambiguous = any(term in blob for term in weak_or_ambiguous_terms)
    noise = any(term in blob for term in noise_terms)
    independent_evidence = any(term in blob for term in independent_evidence_terms)
    confirmed_case = any(term in blob for term in confirmed_case_terms)

    if isinstance(item.get("evidence"), list) and len(item["evidence"]) >= 2:
        independent_evidence = independent_evidence or True

    return {
        "vendor_or_self_reported": vendor_or_self_reported,
        "weak_or_ambiguous": weak_or_ambiguous,
        "noise": noise,
        "independent_evidence": independent_evidence,
        "confirmed_case": confirmed_case,
    }


def derive_default_next_step(flags: Dict[str, bool], decision: str) -> str:
    if decision == "accept":
        return "move_to_stage1_research_brief"
    if decision == "reject":
        return "drop_from_queue"
    if flags["noise"]:
        return "drop_from_queue"
    if flags["vendor_or_self_reported"] or flags["confirmed_case"]:
        return "seek_independent_confirmation"
    if flags["weak_or_ambiguous"]:
        return "collect_more_evidence"
    return "manual_review"


def fallback_review(item: Dict[str, Any]) -> Dict[str, Any]:
    flags = infer_flags(item)

    if flags["noise"]:
        decision = "reject"
        priority = "low"
        rationale = "Сигнал классифицирован как шум или нерелевантный материал. На текущем этапе в decision/review слой не проходит."
    elif flags["vendor_or_self_reported"] and flags["confirmed_case"]:
        decision = "hold"
        priority = "medium"
        rationale = "Это confirmed_case, но он опирается на vendor/self-reported material. По консервативному правилу такой кейс не принимается автоматически без независимого подтверждения."
    elif flags["weak_or_ambiguous"]:
        decision = "hold"
        priority = "medium"
        rationale = "Сигнал выглядит слабым или неоднозначным. Для консервативного review gate требуется дополнительная верификация."
    elif flags["independent_evidence"] and not flags["vendor_or_self_reported"]:
        decision = "accept"
        priority = "high"
        rationale = "Есть признаки независимого подтверждения без опоры только на vendor/self-reported material. Сигнал можно пропускать дальше как рабочую гипотезу."
    else:
        decision = "hold"
        priority = "medium"
        rationale = "Недостаточно оснований для accept, но и оснований для reject тоже недостаточно. Консервативное решение — hold."

    return {
        "review_decision": decision,
        "priority_hint": priority,
        "required_next_step": derive_default_next_step(flags, decision),
        "decision_rationale_ru": rationale,
        "decision_basis": [
            key for key, value in flags.items() if value
        ] or ["conservative_default"],
        "review_confidence": "medium",
    }


def extract_json_object(text: str) -> Dict[str, Any]:
    text = text.strip()
    if not text:
        raise ValueError("Empty model response")

    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            return parsed
    except json.JSONDecodeError:
        pass

    match = re.search(r"\{.*\}", text, flags=re.DOTALL)
    if not match:
        raise ValueError("No JSON object found in model response")

    parsed = json.loads(match.group(0))
    if not isinstance(parsed, dict):
        raise ValueError("Parsed model response is not an object")
    return parsed


def build_review_messages(item: Dict[str, Any]) -> List[Dict[str, str]]:
    system_prompt = """
You are the conservative review gate for SaleCheckUp Signals Radar.

Your job:
- take one validated candidate payload
- return exactly one review object for that candidate_id
- be conservative
- allowed review_decision: accept | hold | reject
- allowed priority_hint: high | medium | low
- always include required_next_step
- confirmed_case based on vendor/self-reported material must NOT be auto-accepted
- weak or ambiguous signals should go to hold
- noise should go to reject

Return JSON only. No markdown. No prose outside JSON.

Required JSON shape:
{
  "review_decision": "accept|hold|reject",
  "priority_hint": "high|medium|low",
  "required_next_step": "machine_readable_english_step",
  "decision_rationale_ru": "short Russian rationale",
  "decision_basis": ["short_machine_flags"],
  "review_confidence": "high|medium|low"
}
""".strip()

    user_prompt = f"""
Review this validated signal candidate conservatively.

Candidate payload:
{json.dumps(item, ensure_ascii=False, indent=2)}
""".strip()

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]


def call_review_model(
    client: Any,
    model_name: str,
    item: Dict[str, Any],
) -> Dict[str, Any]:
    messages = build_review_messages(item)
    response = client.chat.completions.create(
        model=model_name,
        messages=messages,
        temperature=0,
    )
    content = response.choices[0].message.content or ""
    return extract_json_object(content)


def normalize_review(
    item: Dict[str, Any],
    review_raw: Dict[str, Any],
) -> Dict[str, Any]:
    flags = infer_flags(item)
    fallback = fallback_review(item)

    decision = str(review_raw.get("review_decision", "")).strip().lower()
    if decision not in ALLOWED_REVIEW_DECISIONS:
        decision = fallback["review_decision"]

    priority = str(review_raw.get("priority_hint", "")).strip().lower()
    if priority not in ALLOWED_PRIORITY_HINTS:
        priority = fallback["priority_hint"]

    required_next_step = str(review_raw.get("required_next_step", "")).strip()
    if not required_next_step:
        required_next_step = derive_default_next_step(flags, decision)

    decision_basis = review_raw.get("decision_basis")
    if isinstance(decision_basis, list):
        normalized_basis = [str(x).strip() for x in decision_basis if str(x).strip()]
    else:
        normalized_basis = []
    if not normalized_basis:
        normalized_basis = fallback["decision_basis"]

    decision_rationale_ru = str(review_raw.get("decision_rationale_ru", "")).strip()
    if not decision_rationale_ru:
        decision_rationale_ru = fallback["decision_rationale_ru"]

    review_confidence = str(review_raw.get("review_confidence", "")).strip().lower()
    if review_confidence not in {"high", "medium", "low"}:
        review_confidence = fallback["review_confidence"]

    if flags["noise"]:
        decision = "reject"
        priority = "low"
        required_next_step = "drop_from_queue"

    if flags["weak_or_ambiguous"] and decision == "accept":
        decision = "hold"
        if priority == "high":
            priority = "medium"
        required_next_step = "collect_more_evidence"

    if flags["confirmed_case"] and flags["vendor_or_self_reported"] and decision == "accept":
        decision = "hold"
        if priority == "high":
            priority = "medium"
        required_next_step = "seek_independent_confirmation"

    return {
        "review_decision": decision,
        "priority_hint": priority,
        "required_next_step": required_next_step,
        "decision_rationale_ru": decision_rationale_ru,
        "decision_basis": normalized_basis,
        "review_confidence": review_confidence,
        "review_policy_flags": flags,
    }


def group_by_candidate_id(items: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    grouped: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
    for item in items:
        candidate_id = get_candidate_id(item)
        grouped[candidate_id].append(item)
    return grouped


def make_group_payload(candidate_id: str, items: List[Dict[str, Any]]) -> Dict[str, Any]:
    if len(items) == 1:
        payload = deepcopy(items[0])
        payload["candidate_id"] = candidate_id
        payload["source_item_count"] = 1
        return payload

    return {
        "candidate_id": candidate_id,
        "source_item_count": len(items),
        "grouped_validated_signals": items,
    }


def build_reviewed_item(
    candidate_payload: Dict[str, Any],
    normalized_review: Dict[str, Any],
    source_run_id: str,
    review_model: str,
) -> Dict[str, Any]:
    result = deepcopy(candidate_payload)
    result["candidate_id"] = get_candidate_id(candidate_payload)
    result["review_stage"] = "phase0_review_gate"
    result["source_run_id"] = source_run_id
    result["reviewed_at_utc"] = utc_now_iso()
    result["review_model"] = review_model
    result["review_decision"] = normalized_review["review_decision"]
    result["required_next_step"] = normalized_review["required_next_step"]
    result["priority_hint"] = normalized_review["priority_hint"]
    result["decision_rationale_ru"] = normalized_review["decision_rationale_ru"]
    result["decision_basis"] = normalized_review["decision_basis"]
    result["review_confidence"] = normalized_review["review_confidence"]
    result["review_policy_flags"] = normalized_review["review_policy_flags"]
    return result


def build_decision_summary_ru(
    run_id: str,
    source_run_id: str,
    reviewed_items: List[Dict[str, Any]],
    decision_counts: Counter,
) -> str:
    lines: List[str] = []
    lines.append(f"# Decision Summary — {run_id}")
    lines.append("")
    lines.append(f"- source_run_id: `{source_run_id}`")
    lines.append(f"- reviewed_candidates: `{len(reviewed_items)}`")
    lines.append(f"- accept: `{decision_counts.get('accept', 0)}`")
    lines.append(f"- hold: `{decision_counts.get('hold', 0)}`")
    lines.append(f"- reject: `{decision_counts.get('reject', 0)}`")
    lines.append("")
    lines.append("## Принцип review gate")
    lines.append("")
    lines.append("- Слой работает консервативно.")
    lines.append("- confirmed_case из vendor/self-reported material не принимается автоматически.")
    lines.append("- weak/ambiguous сигналы переводятся в `hold`.")
    lines.append("- noise переводится в `reject`.")
    lines.append("- На каждый `candidate_id` создается ровно один reviewed item.")
    lines.append("")
    lines.append("## Решения по кандидатам")
    lines.append("")
    lines.append("| candidate_id | review_decision | priority_hint | required_next_step |")
    lines.append("|---|---|---|---|")
    for item in reviewed_items:
        candidate_id = str(item.get("candidate_id", ""))
        decision = str(item.get("review_decision", ""))
        priority = str(item.get("priority_hint", ""))
        next_step = str(item.get("required_next_step", ""))
        lines.append(f"| {candidate_id} | {decision} | {priority} | {next_step} |")
    lines.append("")
    lines.append("## Короткие основания")
    lines.append("")
    for item in reviewed_items:
        lines.append(f"### {item.get('candidate_id', '')}")
        lines.append("")
        lines.append(f"- decision: `{item.get('review_decision', '')}`")
        lines.append(f"- rationale: {item.get('decision_rationale_ru', '')}")
        lines.append("")
    return "\n".join(lines).strip() + "\n"


def build_project_update_block_ru(
    run_id: str,
    source_run_id: str,
    reviewed_items: List[Dict[str, Any]],
    decision_counts: Counter,
) -> str:
    accept_ids = [str(x["candidate_id"]) for x in reviewed_items if x["review_decision"] == "accept"]
    hold_ids = [str(x["candidate_id"]) for x in reviewed_items if x["review_decision"] == "hold"]
    reject_ids = [str(x["candidate_id"]) for x in reviewed_items if x["review_decision"] == "reject"]

    lines: List[str] = []
    lines.append(f"Run `{run_id}` завершен.")
    lines.append("")
    lines.append(f"Источник: `{source_run_id}/validated_signals.jsonl`.")
    lines.append(f"Review layer обработал `{len(reviewed_items)}` уникальных candidate_id.")
    lines.append("")
    lines.append("Итог распределения:")
    lines.append(f"- accept: `{decision_counts.get('accept', 0)}`")
    lines.append(f"- hold: `{decision_counts.get('hold', 0)}`")
    lines.append(f"- reject: `{decision_counts.get('reject', 0)}`")
    lines.append("")
    lines.append("Управленческий смысл:")
    lines.append("- Слой оставлен консервативным, чтобы не пропускать ложноположительные сигналы в следующий контур.")
    lines.append("- confirmed_case из vendor/self-reported material не авто-принимается и требует независимого подтверждения.")
    lines.append("- Слабые и неоднозначные сигналы удерживаются в hold вместо искусственного accept.")
    lines.append("")
    lines.append(f"Accepted candidate_id: {', '.join(accept_ids) if accept_ids else '—'}")
    lines.append(f"Hold candidate_id: {', '.join(hold_ids) if hold_ids else '—'}")
    lines.append(f"Reject candidate_id: {', '.join(reject_ids) if reject_ids else '—'}")
    lines.append("")
    lines.append("Следующее действие:")
    lines.append("- Использовать `reviewed_signals.jsonl` как вход в следующий decision/research слой без размножения записей по одному candidate_id.")
    return "\n".join(lines).strip() + "\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("input_config_path", help="Path to review input JSON config")
    args = parser.parse_args()

    input_config_path = Path(args.input_config_path).resolve()
    workspace_root = input_config_path.parent.parent.resolve()
    config = load_json(input_config_path)

    run_id = str(config["run_id"])
    source_run_id = str(config["source_run_id"])
    source_validated_signals_path = resolve_path(workspace_root, str(config["source_validated_signals_path"]))
    output_run_dir = resolve_path(workspace_root, str(config["output_run_dir"]))

    models = config.get("models", {})
    review_model = str(models.get("review", "openai/gpt-5.4-mini"))
    retrieval_model = str(models.get("retrieval", "openai/gpt-4o-mini-search-preview"))

    validated_items = load_jsonl(source_validated_signals_path)
    grouped_items = group_by_candidate_id(validated_items)

    output_run_dir.mkdir(parents=True, exist_ok=True)

    client = None
    review_mode = "rules_only"
    review_errors: List[Dict[str, Any]] = []

    api_key = os.getenv("OPENROUTER_API_KEY")
    base_url = "https://openrouter.ai/api/v1"

    if OpenAI is not None and api_key:
        try:
            client = OpenAI(api_key=api_key, base_url=base_url)
            review_mode = "model_plus_rules_guardrails"
        except Exception as e:
            review_errors.append(
                {
                    "stage": "client_init",
                    "error": f"{type(e).__name__}: {e}",
                }
            )
            raise RuntimeError(f"Failed to initialize OpenRouter review client: {type(e).__name__}: {e}") from e

    reviewed_items: List[Dict[str, Any]] = []

    for candidate_id in sorted(grouped_items.keys()):
        source_items = grouped_items[candidate_id]
        candidate_payload = make_group_payload(candidate_id, source_items)

        raw_review: Dict[str, Any]
        if client is not None:
            try:
                raw_review = call_review_model(client, review_model, candidate_payload)
            except Exception as e:
                review_errors.append(
                    {
                        "candidate_id": candidate_id,
                        "stage": "review_call",
                        "error": f"{type(e).__name__}: {e}",
                    }
                )
                raise RuntimeError(
                    f"Review model call failed for {candidate_id}: {type(e).__name__}: {e}"
                ) from e
        else:
            raw_review = fallback_review(candidate_payload)

        normalized_review = normalize_review(candidate_payload, raw_review)
        reviewed_item = build_reviewed_item(
            candidate_payload=candidate_payload,
            normalized_review=normalized_review,
            source_run_id=source_run_id,
            review_model=review_model if client is not None else "rules_only_fallback",
        )
        reviewed_items.append(reviewed_item)

    reviewed_items.sort(key=lambda x: str(x.get("candidate_id", "")))

    unique_candidate_count = len(grouped_items)
    output_item_count = len(reviewed_items)
    if unique_candidate_count != output_item_count:
        raise RuntimeError(
            f"reviewed_signals cardinality mismatch: unique_candidate_count={unique_candidate_count}, output_item_count={output_item_count}"
        )

    decision_counts = Counter(item["review_decision"] for item in reviewed_items)

    review_manifest = {
        "run_id": run_id,
        "stage": "phase0_review_gate",
        "status": "completed",
        "created_at_utc": utc_now_iso(),
        "source_run_id": source_run_id,
        "source_validated_signals_path": str(source_validated_signals_path),
        "output_run_dir": str(output_run_dir),
        "models": {
            "retrieval": retrieval_model,
            "review": review_model,
        },
        "review_mode": review_mode,
        "strict_cardinality_rule": "exactly_one_reviewed_item_per_candidate_id",
        "input_item_count": len(validated_items),
        "unique_candidate_count": unique_candidate_count,
        "output_item_count": output_item_count,
        "decision_counts": {
            "accept": decision_counts.get("accept", 0),
            "hold": decision_counts.get("hold", 0),
            "reject": decision_counts.get("reject", 0),
        },
        "review_policy": {
            "conservative": True,
            "confirmed_case_vendor_or_self_reported_not_auto_accept": True,
            "weak_or_ambiguous_to_hold": True,
            "noise_to_reject": True,
            "allowed_review_decision": sorted(ALLOWED_REVIEW_DECISIONS),
            "allowed_priority_hint": sorted(ALLOWED_PRIORITY_HINTS),
        },
        "errors": review_errors,
    }

    decision_summary_ru = build_decision_summary_ru(
        run_id=run_id,
        source_run_id=source_run_id,
        reviewed_items=reviewed_items,
        decision_counts=decision_counts,
    )

    project_update_block_ru = build_project_update_block_ru(
        run_id=run_id,
        source_run_id=source_run_id,
        reviewed_items=reviewed_items,
        decision_counts=decision_counts,
    )

    write_json(output_run_dir / "review_manifest.json", review_manifest)
    write_jsonl(output_run_dir / "reviewed_signals.jsonl", reviewed_items)
    write_text(output_run_dir / "decision_summary_ru.md", decision_summary_ru)
    write_text(output_run_dir / "project_update_block_ru.md", project_update_block_ru)

    return 0


if __name__ == "__main__":
    sys.exit(main())