import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

from openai import OpenAI


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT_PATH = ROOT / "input" / "run_input_package.json"
RUNS_DIR = ROOT / "runs"


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def write_json(path: Path, payload: dict) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def write_text(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def resolve_input_path() -> Path:
    if len(sys.argv) > 2:
        raise SystemExit("Usage: python .\\runner\\smoke_test.py [path_to_input_json]")

    if len(sys.argv) == 2:
        return Path(sys.argv[1]).resolve()

    return DEFAULT_INPUT_PATH


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
    constraints = run_input.get("constraints", [])
    requested_outputs = run_input.get("requested_outputs", [])
    model_id = run_input.get("model_id", "openai/gpt-4.1-mini")

    provider_policy = run_input.get(
        "provider_policy",
        {
            "order": [],
            "allow_fallbacks": False,
            "require_parameters": True,
        },
    )

    provider_policy_for_call = {
        k: v for k, v in provider_policy.items()
        if v not in (None, "", [])
    }

    run_dir = RUNS_DIR / run_id
    run_dir.mkdir(parents=True, exist_ok=True)

    started_at = utc_now_iso()

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )

    messages = [
        {
            "role": "system",
            "content": (
                "You are a baseline research runner for SaleCheckUp Signals Radar. "
                "Return a concise response with: what was checked, what seems potentially important, "
                "known gaps, and the recommended next step."
            ),
        },
        {
            "role": "user",
            "content": json.dumps(
                {
                    "run_goal": run_goal,
                    "current_hypothesis": current_hypothesis,
                    "constraints": constraints,
                    "requested_outputs": requested_outputs,
                },
                ensure_ascii=False,
                indent=2,
            ),
        },
    ]

    request_payload = {
        "model": model_id,
        "messages": messages,
    }

    if provider_policy_for_call:
        request_payload["extra_body"] = {"provider": provider_policy_for_call}

    response = client.chat.completions.create(**request_payload)

    completed_at = utc_now_iso()
    request_id = getattr(response, "id", None)

    assistant_text = ""
    if response.choices and response.choices[0].message:
        assistant_text = response.choices[0].message.content or ""

    run_manifest = {
        "run_id": run_id,
        "run_goal": run_goal,
        "input_package_path": str(input_path),
        "approved_context_snapshot": run_input.get("approved_context_snapshot", {}),
        "execution_gateway": "openrouter",
        "model_family": "openai",
        "model_id": model_id,
        "provider_policy": provider_policy,
        "project_sync_status": "pending_manual_sync",
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
        "bundle_files": [
            "run_manifest.json",
            "candidate_signals.jsonl",
            "evidence_index.jsonl",
            "run_synthesis_ru.md",
            "project_update_block_ru.md",
        ],
        "summary": "Smoke/parity run completed successfully.",
    }

    write_json(run_dir / "run_manifest.json", run_manifest)
    write_text(run_dir / "candidate_signals.jsonl", "")
    write_text(run_dir / "evidence_index.jsonl", "")

    run_synthesis_ru = f"""# Run Synthesis

## Run Goal
{run_goal}

## Current Hypothesis
{current_hypothesis}

## What Was Checked
Проверен baseline contour: local runner -> OpenRouter -> pinned openai model -> run bundle.

## Provider Policy Used
{json.dumps(provider_policy, ensure_ascii=False, indent=2)}

## Candidate Signals
This pass checks contour mechanics, not real extraction logic.

## Evidence Coverage
This pass checks bundle assembly, not real evidence indexing.

## Known Gaps
- Нет validator layer
- Нет dashboard layer
- Нет auto_sync
- Нет real extraction logic
- Нет web retrieval layer

## Recommended Next Step
Если output корректный, перейти к следующему parity run или к добавлению retrieval boundary.

## Raw Assistant Output
{assistant_text}
"""
    write_text(run_dir / "run_synthesis_ru.md", run_synthesis_ru)

    project_update_block_ru = f"""# Project Update Block

## Что проверяли
Baseline runner на OpenRouter с pinned openai model.

## Что нашли
Runner успешно выполнил вызов и собрал minimal run bundle для {run_id}.

## Что осталось неясным
Нужно отдельно проверить repeatability и parity между несколькими run.

## Что делать следующим run
Запустить следующий parity run из отдельного input package.
"""
    write_text(run_dir / "project_update_block_ru.md", project_update_block_ru)

    print(f"Run completed: {run_id}")
    print(f"Input file: {input_path}")
    print(f"Run directory: {run_dir}")
    print(f"Request ID: {request_id}")


if __name__ == "__main__":
    main()