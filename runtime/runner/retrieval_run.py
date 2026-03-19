import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

from openai import OpenAI


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT_PATH = ROOT / "input" / "phase0-retrieval-run-001.json"
RUNS_DIR = ROOT / "runs"


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def write_json(path: Path, payload: dict) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def write_text(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def resolve_input_path() -> Path:
    if len(sys.argv) > 2:
        raise SystemExit("Usage: python .\\runner\\retrieval_run.py [path_to_input_json]")
    if len(sys.argv) == 2:
        return Path(sys.argv[1]).resolve()
    return DEFAULT_INPUT_PATH


def build_query_block(search_queries: list[str]) -> str:
    return "\n".join(f"- {q}" for q in search_queries)


def parse_response(response) -> tuple[str, list[dict]]:
    response_dict = response.model_dump() if hasattr(response, "model_dump") else {}
    choices = response_dict.get("choices", [])
    if not choices:
        return "", []

    message = choices[0].get("message", {})
    content = message.get("content", "") or ""
    annotations = message.get("annotations", []) or []
    return content, annotations


def normalize_text(*parts: str) -> str:
    return " ".join(p for p in parts if p).lower()


def contains_any(text: str, needles: list[str]) -> bool:
    return any(n in text for n in needles)


def classify_source(title: str, url: str, excerpt: str) -> tuple[str, str, bool]:
    domain = urlparse(url).netloc.lower()
    text = normalize_text(title, url, excerpt)

    technical_domains = [
        "github.com",
        "docs.",
        "developers.",
        "developer.",
        "api.",
    ]
    technical_keywords = [
        "pull request",
        "api",
        "sdk",
        "integration",
        "developer",
        "repository",
        "github",
        "docs",
        "documentation",
        "openrouter access",
        "code example",
    ]

    landing_keywords = [
        "pricing",
        "book a demo",
        "request a demo",
        "contact us",
        "contact",
        "become a partner",
        "partner",
        "careers",
        "support",
        "status page",
    ]

    hotel_keywords = [
        "hotel",
        "hotelier",
        "hospitality",
        "booking",
        "reservation",
        "direct booking",
        "occupancy",
        "adr",
        "revpar",
        "missed call",
        "call abandonment",
        "voice assistant",
        "voice agent",
        "booking funnel",
        "reservation calls",
    ]

    outcome_keywords = [
        "case study",
        "revenue",
        "uplift",
        "conversion",
        "roi",
        "lost bookings",
        "bookings",
        "missed calls",
        "abandonment",
        "increased",
        "reduced",
        "improved",
        "boosted",
        "results",
        "kpi",
    ]

    vendor_marketing_markers = [
        "request a demo",
        "book a demo",
        "contact us",
        "pricing",
        "learn more",
        "start your journey",
        "ready to see the same results",
    ]

    if any(d in domain for d in technical_domains) or contains_any(text, technical_keywords):
        return "technical_irrelevant", "low", True

    if contains_any(text, landing_keywords) and not contains_any(text, hotel_keywords):
        return "vendor_marketing", "low", True

    hotel_context = contains_any(text, hotel_keywords)
    outcome_context = contains_any(text, outcome_keywords)
    has_numbers = bool(re.search(r"\b\d+[%x]?\b", text))

    if hotel_context and "case study" in text and (outcome_context or has_numbers):
        source_class = "case_study"
        relevance = "high"
        drop = False
    elif hotel_context and outcome_context:
        source_class = "industry_article"
        relevance = "medium"
        drop = False
    elif hotel_context:
        source_class = "other"
        relevance = "medium"
        drop = False
    else:
        source_class = "other"
        relevance = "low"
        drop = True

    if contains_any(text, vendor_marketing_markers):
        if source_class == "case_study":
            source_class = "vendor_marketing"
            relevance = "medium"
            drop = False
        elif source_class == "industry_article":
            source_class = "vendor_marketing"
            relevance = "medium"
            drop = False

    return source_class, relevance, drop


def build_evidence_records(run_id: str, annotations: list[dict]) -> tuple[list[dict], int]:
    records: list[dict] = []
    skipped = 0
    seen_urls: set[str] = set()

    for ann in annotations:
        if ann.get("type") != "url_citation":
            continue

        citation = ann.get("url_citation", {})
        url = citation.get("url")
        title = citation.get("title") or "Untitled source"
        content = citation.get("content") or ""

        if not url or url in seen_urls:
            continue

        source_class, source_relevance, drop = classify_source(title, url, content)
        if drop:
            skipped += 1
            continue

        seen_urls.add(url)

        record = {
            "evidence_id": f"evidence-{len(records) + 1:03d}",
            "run_id": run_id,
            "source_title": title,
            "source_url": url,
            "source_type": "web",
            "source_class": source_class,
            "source_relevance": source_relevance,
            "captured_at": utc_now_iso(),
            "relevance_note_ru": "Источник получен через OpenRouter web plugin во время retrieval run.",
            "linked_candidate_ids": [],
        }

        if content:
            record["source_content_excerpt"] = content

        records.append(record)

    return records, skipped


def build_top_sources_block(records: list[dict], limit: int = 5) -> str:
    if not records:
        return "- none"

    lines = []
    for rec in records[:limit]:
        lines.append(
            f"- [{rec['source_relevance']}] {rec['source_class']} | {rec['source_title']} | {rec['source_url']}"
        )
    return "\n".join(lines)


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
    model_id = run_input.get("model_id", "openai/gpt-4o-mini-search-preview")
    search_queries = run_input.get("search_queries", [])

    if not search_queries:
        raise SystemExit("search_queries is required for retrieval_run.py")

    provider_policy = run_input.get(
        "provider_policy",
        {
            "order": [],
            "allow_fallbacks": False,
            "require_parameters": True,
        },
    )

    web_plugin = run_input.get(
        "web_plugin",
        {
            "id": "web",
            "engine": "exa",
            "max_results": 5,
        },
    )

    extra_body = {
        "provider": provider_policy,
        "plugins": [web_plugin],
    }

    run_dir = RUNS_DIR / run_id
    run_dir.mkdir(parents=True, exist_ok=True)

    started_at = utc_now_iso()

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )

    user_payload = {
        "run_goal": run_goal,
        "current_hypothesis": current_hypothesis,
        "constraints": constraints,
        "requested_outputs": requested_outputs,
        "search_queries": search_queries,
    }

    messages = [
        {
            "role": "system",
            "content": (
                "You are a retrieval runner for SaleCheckUp Signals Radar. "
                "Use web search results to ground your answer. "
                "Prefer hotel/operator case studies and sources with quantified outcomes. "
                "Prefer missed calls, booking abandonment, direct booking recovery, reservation calls, ADR, RevPAR, occupancy, revenue impact. "
                "Avoid technical integration pages, API/docs pages, GitHub/repository pages, pricing/demo/contact pages, and generic AI tooling pages. "
                "Do not invent citations. Rely only on retrieved web results."
            ),
        },
        {
            "role": "user",
            "content": json.dumps(user_payload, ensure_ascii=False, indent=2),
        },
    ]

    response = client.chat.completions.create(
        model=model_id,
        messages=messages,
        extra_body=extra_body,
    )

    completed_at = utc_now_iso()
    request_id = getattr(response, "id", None)

    assistant_text, annotations = parse_response(response)
    evidence_records, skipped_count = build_evidence_records(run_id, annotations)

    run_manifest = {
        "run_id": run_id,
        "run_goal": run_goal,
        "input_package_path": str(input_path),
        "approved_context_snapshot": run_input.get("approved_context_snapshot", {}),
        "execution_gateway": "openrouter",
        "model_family": "openai",
        "model_id": model_id,
        "provider_policy": provider_policy,
        "web_plugin": web_plugin,
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
        "evidence_count": len(evidence_records),
        "skipped_evidence_count": skipped_count,
        "summary": "Retrieval run completed successfully.",
    }

    write_json(run_dir / "run_manifest.json", run_manifest)
    write_text(run_dir / "candidate_signals.jsonl", "")

    evidence_index_content = ""
    if evidence_records:
        evidence_index_content = "\n".join(
            json.dumps(record, ensure_ascii=False) for record in evidence_records
        ) + "\n"
    write_text(run_dir / "evidence_index.jsonl", evidence_index_content)

    run_synthesis_ru = f"""# Run Synthesis

## Run Goal
{run_goal}

## Current Hypothesis
{current_hypothesis}

## What Was Checked
Проверен retrieval boundary: local runner -> OpenRouter -> web plugin -> pinned openai search-specialized model -> filtered evidence bundle.

## Search Queries
{build_query_block(search_queries)}

## Provider Policy Used
{json.dumps(provider_policy, ensure_ascii=False, indent=2)}

## Web Plugin Used
{json.dumps(web_plugin, ensure_ascii=False, indent=2)}

## Evidence Coverage
Получено evidence entries: {len(evidence_records)}
Отфильтровано как нерелевантное: {skipped_count}

## Top Sources
{build_top_sources_block(evidence_records)}

## Candidate Signals
Phase 0 retrieval boundary only. Candidate extraction remains intentionally minimal.

## Known Gaps
- Нет validator layer
- Нет dashboard layer
- Нет auto_sync
- Нет mature candidate extraction logic
- Нужен review качества внешнего evidence

## Recommended Next Step
Если evidence выглядит чище и ближе к hospitality revenue context, можно переходить к retrieval review и решать, готов ли контур к validator_gate.

## Raw Assistant Output
{assistant_text}
"""
    write_text(run_dir / "run_synthesis_ru.md", run_synthesis_ru)

    project_update_block_ru = f"""# Project Update Block

## Что проверяли
Retrieval boundary с фильтрацией нерелевантного evidence на OpenRouter search-specialized model.

## Что нашли
Runner выполнил retrieval run и собрал filtered evidence bundle. Сохранено источников: {len(evidence_records)}. Отфильтровано: {skipped_count}.

## Что осталось неясным
Нужно проверить, достаточно ли очищенный evidence полезен для decision-making и нужен ли ещё один retrieval refinement pass.

## Что делать следующим run
Провести retrieval review и решить, переходить ли к validator_gate.
"""
    write_text(run_dir / "project_update_block_ru.md", project_update_block_ru)

    print(f"Retrieval run completed: {run_id}")
    print(f"Input file: {input_path}")
    print(f"Run directory: {run_dir}")
    print(f"Request ID: {request_id}")
    print(f"Evidence count: {len(evidence_records)}")
    print(f"Skipped evidence count: {skipped_count}")


if __name__ == "__main__":
    main()