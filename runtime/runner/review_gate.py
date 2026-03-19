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
from typing import Any, Dict, Iterable, List, Optional

try:
    from openai import OpenAI
except Exception:
    OpenAI = None


ALLOWED_REVIEW_STATUSES = {"accept", "hold", "reject"}
ALLOWED_GAP_TYPES = {
    "missing_source",
    "missing_validation",
    "unresolved_contradiction",
    "insufficient_specificity",
}
ALLOWED_RESOLUTION_STATES = {"unresolved", "partially_resolved", "resolved_for_now"}
ALLOWED_OWNER_STAGES = {"retrieval", "validator"}
POSITIVE_VALIDATOR_SIGNAL_TYPES = {
    "confirmed_case",
    "monetizable_pain_signal",
    "technology_shift_signal",
}
EXPLICIT_DIVERGENCE_PREFIX = "Explicit divergence from validator"
REVIEW_SCHEMA_VERSION = "quality_change_package_A1"


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


def unique_strings(values: Iterable[Any]) -> List[str]:
    seen = set()
    result: List[str] = []
    for value in values:
        text = str(value).strip()
        if not text or text in seen:
            continue
        seen.add(text)
        result.append(text)
    return result


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


def get_source_items(item: Dict[str, Any]) -> List[Dict[str, Any]]:
    grouped = item.get("grouped_validated_signals")
    if isinstance(grouped, list):
        normalized = [entry for entry in grouped if isinstance(entry, dict)]
        if normalized:
            return normalized
    return [item]


def collect_evidence_ids(item: Dict[str, Any]) -> List[str]:
    evidence_ids: List[str] = []
    for source_item in get_source_items(item):
        evidence_id = str(source_item.get("evidence_id", "")).strip()
        if evidence_id:
            evidence_ids.append(evidence_id)
    return unique_strings(evidence_ids)


def build_flag_scope(item: Dict[str, Any]) -> Dict[str, Any]:
    non_source_keys = {
        "validator_handoff",
        "review_stage",
        "review_schema_version",
        "source_run_id",
        "reviewed_at_utc",
        "review_model",
        "status",
        "why_this_status",
        "missing_evidence_or_gap",
        "contradictions",
        "next_step",
        "evidence_trace",
        "source_item_count",
    }
    return {
        "source_items": [
            {
                key: value
                for key, value in source_item.items()
                if key not in non_source_keys
            }
            for source_item in get_source_items(item)
            if isinstance(source_item, dict)
        ]
    }


def infer_text_blob(obj: Any) -> str:
    try:
        return json.dumps(obj, ensure_ascii=False, sort_keys=True).lower()
    except Exception:
        return str(obj).lower()


def infer_flags(item: Dict[str, Any]) -> Dict[str, bool]:
    blob = infer_text_blob(build_flag_scope(item))

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
        "customer story",
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

    if len(collect_evidence_ids(item)) >= 2:
        independent_evidence = True

    return {
        "vendor_or_self_reported": vendor_or_self_reported,
        "weak_or_ambiguous": weak_or_ambiguous,
        "noise": noise,
        "independent_evidence": independent_evidence,
        "confirmed_case": confirmed_case,
    }


def derive_validator_handoff(candidate_id: str, items: List[Dict[str, Any]]) -> Dict[str, Any]:
    signal_types = unique_strings(
        str(item.get("signal_type", "")).strip().lower() for item in items if str(item.get("signal_type", "")).strip()
    )
    confidence_levels = unique_strings(
        str(item.get("confidence", "")).strip().lower() for item in items if str(item.get("confidence", "")).strip()
    )
    evidence_ids = unique_strings(
        str(item.get("evidence_id", "")).strip() for item in items if str(item.get("evidence_id", "")).strip()
    )

    unique_signal_types = set(signal_types)
    if unique_signal_types == {"noise"}:
        implied_status = "reject"
        candidate_viability = "not_viable"
        notes_ru = "Validator не дал viable support: весь входной материал помечен как noise."
    elif "hold" in unique_signal_types:
        implied_status = "hold"
        candidate_viability = "viable_with_blocker"
        notes_ru = "Validator считает candidate потенциально интересным, но уже заблокированным неполнотой или неоднозначностью."
    elif unique_signal_types == {"confirmed_case"}:
        implied_status = "accept"
        candidate_viability = "viable"
        notes_ru = "Validator передаёт candidate как confirmed_case без смешения с hold/noise."
    elif unique_signal_types & POSITIVE_VALIDATOR_SIGNAL_TYPES:
        implied_status = "hold"
        candidate_viability = "viable_with_blocker"
        notes_ru = "Validator видит viable support, но не уровень безусловного accept для review layer."
    else:
        implied_status = "reject"
        candidate_viability = "not_viable"
        notes_ru = "Validator output не даёт viable support для текущего contour."

    return {
        "candidate_id": candidate_id,
        "source_item_count": len(items),
        "signal_types": signal_types,
        "confidence_levels": confidence_levels,
        "evidence_ids": evidence_ids,
        "implied_status": implied_status,
        "candidate_viability": candidate_viability,
        "notes_ru": notes_ru,
    }


def get_validator_handoff(item: Dict[str, Any]) -> Dict[str, Any]:
    candidate_id = get_candidate_id(item)
    handoff = item.get("validator_handoff")
    if isinstance(handoff, dict):
        return handoff
    return derive_validator_handoff(candidate_id, get_source_items(item))


def build_gap(gap_id: str, gap_type: str, description: str) -> Dict[str, str]:
    return {
        "gap_id": safe_slug(gap_id),
        "gap_type": gap_type,
        "description": description.strip(),
    }


def build_next_step(
    action: str,
    owner_stage: str,
    target_gap_or_contradiction_id: str,
    expected_decision_effect: str,
) -> Dict[str, str]:
    return {
        "action": action.strip(),
        "owner_stage": owner_stage,
        "target_gap_or_contradiction_id": target_gap_or_contradiction_id.strip(),
        "expected_decision_effect": expected_decision_effect.strip(),
    }


def build_trace(
    trace_id: str,
    decision_claim: str,
    supports: List[str],
    gaps: List[str],
) -> Dict[str, Any]:
    return {
        "trace_id": safe_slug(trace_id),
        "decision_claim": decision_claim.strip(),
        "supports": unique_strings(supports),
        "gaps": unique_strings(gaps),
    }


def get_unresolved_contradictions(contradictions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [
        contradiction
        for contradiction in contradictions
        if contradiction.get("current_resolution_state") in {"unresolved", "partially_resolved"}
    ]


def describe_primary_blocker(
    gaps: List[Dict[str, Any]],
    contradictions: List[Dict[str, Any]],
) -> str:
    unresolved = get_unresolved_contradictions(contradictions)
    if unresolved:
        first = unresolved[0]
        topic = str(first.get("topic", "")).strip() or str(first.get("contradiction_id", "")).strip()
        return f"неразрешённое материальное противоречие по теме `{topic}`"
    if gaps:
        return str(gaps[0].get("description", "")).strip()
    return "материально достаточная поддержка для текущего contour пока не реконструируется"


def build_status_reason(
    item: Dict[str, Any],
    status: str,
    gaps: List[Dict[str, Any]],
    contradictions: List[Dict[str, Any]],
) -> str:
    handoff = get_validator_handoff(item)
    blocker_text = describe_primary_blocker(gaps, contradictions)

    if status == "accept":
        return (
            "Есть materially sufficient support, unresolved material contradiction не осталось, "
            "а decision можно восстановить по evidence_trace и validator state."
        )
    if status == "hold":
        return f"Candidate остаётся viable, но решение блокируется: {blocker_text}."
    if handoff.get("candidate_viability") == "not_viable":
        return (
            "Текущий candidate не проходит under current contour and current hypothesis shape; "
            "validator handoff не показывает viable support."
        )
    return (
        "Текущий candidate не проходит under current contour and current hypothesis shape; "
        "small incremental evidence не выглядит decision-moving, потребуется materially different support или reshaped hypothesis."
    )


def ensure_explicit_divergence_prefix(why_this_status: str, implied_status: str, status: str) -> str:
    if status == implied_status:
        return why_this_status
    prefix = f"{EXPLICIT_DIVERGENCE_PREFIX} ({implied_status} -> {status}): "
    if why_this_status.startswith(prefix):
        return why_this_status
    return prefix + why_this_status


def default_hold_gap(item: Dict[str, Any]) -> Dict[str, str]:
    flags = infer_flags(item)
    if flags["confirmed_case"] and flags["vendor_or_self_reported"] and not flags["independent_evidence"]:
        return build_gap(
            "gap_independent_confirmation",
            "missing_validation",
            "Нужно независимое подтверждение vendor/self-reported кейса, иначе accept недопустим.",
        )
    if flags["weak_or_ambiguous"]:
        return build_gap(
            "gap_material_support_specificity",
            "insufficient_specificity",
            "Текущая поддержка остаётся слишком слабой или неоднозначной для accept в текущем contour.",
        )
    return build_gap(
        "gap_material_support_missing",
        "missing_validation",
        "Остаётся material evidence gap, который блокирует решение в review layer.",
    )


def default_reject_gap(item: Dict[str, Any]) -> Dict[str, str]:
    flags = infer_flags(item)
    if flags["noise"]:
        return build_gap(
            "gap_current_candidate_out_of_scope",
            "insufficient_specificity",
            "Материал не проходит текущий contour как decision-useful support для этой гипотезы.",
        )
    return build_gap(
        "gap_material_support_not_recoverable",
        "missing_validation",
        "Текущий contour не получает materially sufficient support; small incremental evidence не должно менять решение.",
    )


def derive_default_next_step(
    status: str,
    gaps: List[Dict[str, Any]],
    contradictions: List[Dict[str, Any]],
) -> Dict[str, str]:
    unresolved = get_unresolved_contradictions(contradictions)
    if status == "accept":
        return build_next_step(
            "promote_to_stage1_research_brief",
            "validator",
            "",
            "Передаёт candidate дальше без дополнительного blocking step в review layer.",
        )

    if status == "hold":
        if unresolved:
            first = unresolved[0]
            return build_next_step(
                "resolve_material_contradiction",
                "validator",
                str(first.get("contradiction_id", "")).strip(),
                "Снятие этого противоречия может изменить status, why_this_status и итоговый route кандидата.",
            )
        if gaps:
            first = gaps[0]
            gap_type = str(first.get("gap_type", "")).strip()
            gap_id = str(first.get("gap_id", "")).strip()
            if gap_type == "missing_source":
                return build_next_step(
                    "collect_independent_source",
                    "retrieval",
                    gap_id,
                    "Закрытие source gap может materially move decision from hold toward accept.",
                )
            if gap_type == "missing_validation":
                return build_next_step(
                    "run_independent_validation",
                    "validator",
                    gap_id,
                    "Независимая валидация может снять blocker и изменить status.",
                )
            return build_next_step(
                "clarify_claim_specificity",
                "validator",
                gap_id,
                "Уточнение baseline, scope или attribution может materially move decision.",
            )

    target_id = str(gaps[0].get("gap_id", "")).strip() if gaps else ""
    return build_next_step(
        "reshape_hypothesis_and_collect_materially_different_support",
        "retrieval",
        target_id,
        "Повторный review имеет смысл только после materially different support, а не после small incremental evidence.",
    )


def synthesize_evidence_trace(
    item: Dict[str, Any],
    status: str,
    gaps: List[Dict[str, Any]],
    contradictions: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    evidence_ids = collect_evidence_ids(item)
    gap_ids = [str(gap.get("gap_id", "")).strip() for gap in gaps if str(gap.get("gap_id", "")).strip()]
    unresolved = get_unresolved_contradictions(contradictions)

    if status == "accept":
        decision_claim = "Материальная поддержка кандидата достаточна для accept under current contour."
        return [build_trace("trace_accept_support", decision_claim, evidence_ids, [])] if evidence_ids else []

    if status == "hold":
        if unresolved:
            decision_claim = "Candidate остаётся viable, но material contradiction ещё не разрешено, поэтому решение удерживается в hold."
        else:
            decision_claim = "Candidate остаётся viable, но named gap блокирует переход в accept."
        return [build_trace("trace_hold_blocker", decision_claim, evidence_ids, gap_ids[:1])]

    decision_claim = "Current contour не пропускает candidate без materially different support."
    return [build_trace("trace_reject_current_contour", decision_claim, evidence_ids, gap_ids[:1])]


def build_review_for_status(
    item: Dict[str, Any],
    status: str,
    why_this_status: str,
    gaps: Optional[List[Dict[str, Any]]] = None,
    contradictions: Optional[List[Dict[str, Any]]] = None,
    next_step: Optional[Dict[str, str]] = None,
    evidence_trace: Optional[List[Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    normalized_gaps = deepcopy(gaps or [])
    normalized_contradictions = deepcopy(contradictions or [])
    normalized_next_step = deepcopy(next_step) if isinstance(next_step, dict) else derive_default_next_step(
        status,
        normalized_gaps,
        normalized_contradictions,
    )
    normalized_trace = deepcopy(evidence_trace or [])
    if not normalized_trace:
        normalized_trace = synthesize_evidence_trace(item, status, normalized_gaps, normalized_contradictions)

    final_why = why_this_status.strip() if why_this_status.strip() else build_status_reason(
        item,
        status,
        normalized_gaps,
        normalized_contradictions,
    )
    final_why = ensure_explicit_divergence_prefix(
        final_why,
        get_validator_handoff(item).get("implied_status", ""),
        status,
    )

    return {
        "status": status,
        "why_this_status": final_why,
        "missing_evidence_or_gap": normalized_gaps,
        "contradictions": normalized_contradictions,
        "next_step": normalized_next_step,
        "evidence_trace": normalized_trace,
    }


def build_hold_review(
    item: Dict[str, Any],
    reason_override: Optional[str] = None,
    gaps: Optional[List[Dict[str, Any]]] = None,
    contradictions: Optional[List[Dict[str, Any]]] = None,
    next_step: Optional[Dict[str, str]] = None,
    evidence_trace: Optional[List[Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    normalized_gaps = deepcopy(gaps or [])
    if not normalized_gaps and not contradictions:
        normalized_gaps = [default_hold_gap(item)]
    reason = reason_override or build_status_reason(item, "hold", normalized_gaps, contradictions or [])
    return build_review_for_status(item, "hold", reason, normalized_gaps, contradictions, next_step, evidence_trace)


def build_reject_review(
    item: Dict[str, Any],
    reason_override: Optional[str] = None,
    gaps: Optional[List[Dict[str, Any]]] = None,
    contradictions: Optional[List[Dict[str, Any]]] = None,
    next_step: Optional[Dict[str, str]] = None,
    evidence_trace: Optional[List[Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    normalized_gaps = deepcopy(gaps or [])
    if not normalized_gaps and not contradictions:
        normalized_gaps = [default_reject_gap(item)]
    reason = reason_override or build_status_reason(item, "reject", normalized_gaps, contradictions or [])
    return build_review_for_status(item, "reject", reason, normalized_gaps, contradictions, next_step, evidence_trace)


def fallback_review(item: Dict[str, Any]) -> Dict[str, Any]:
    flags = infer_flags(item)
    handoff = get_validator_handoff(item)

    if flags["noise"] or handoff["candidate_viability"] == "not_viable":
        return build_reject_review(
            item,
            "Текущий candidate не проходит under current contour; имеющийся материал не даёт viable support и small incremental evidence не выглядит достаточным для смены решения.",
        )

    if flags["confirmed_case"] and flags["vendor_or_self_reported"] and not flags["independent_evidence"]:
        return build_hold_review(
            item,
            "Candidate выглядит viable, но confirmed_case опирается на vendor/self-reported material без независимой верификации, поэтому accept заблокирован.",
        )

    if flags["weak_or_ambiguous"] or handoff["implied_status"] == "hold":
        return build_hold_review(
            item,
            "Candidate остаётся viable, но текущая поддержка слишком слабая, неоднозначная или неполная для accept under current contour.",
        )

    if flags["independent_evidence"] and not flags["vendor_or_self_reported"]:
        return build_review_for_status(
            item,
            "accept",
            "Есть materially sufficient support из независимого evidence, не видно unresolved material contradiction, и decision реконструируется по trace.",
        )

    return build_hold_review(
        item,
        "Недостаточно оснований для accept, но candidate пока остаётся viable; нужен конкретный decision-moving шаг перед финальным решением.",
    )


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
- use Russian for explanatory text fields
- keep field names, enums, ids, statuses, owner_stage values, gap_type values, and resolution states in English
- return JSON only

A1 status semantics:
- accept is allowed only if the candidate has materially sufficient support, no unresolved material contradiction exists, why_this_status is reconstructable from evidence and/or explicit validation state, and evidence_trace is meaningful rather than decorative
- hold is allowed only if the candidate remains viable, there is a named blocker in missing_evidence_or_gap and/or contradictions, and there is a concrete decision-moving next_step
- if a concrete decision-moving next_step cannot be named, do NOT use hold; use reject
- reject means rejected for the current contour and current hypothesis shape, not forever

Material contradiction rule:
- a contradiction is material only if resolving it could change status, why_this_status, or next_step

Traceability rule:
- evidence_trace is invalid if it only lists evidence ids without linking them to a decision_claim and/or named gaps

Validator handoff rule:
- the payload includes validator_handoff with implied_status
- if your review status differs from validator_handoff.implied_status, begin why_this_status exactly with:
  "Explicit divergence from validator (<implied_status> -> <status>): ..."
- silent override is invalid

Reference integrity:
- conflicting_items may only use evidence ids from the payload
- evidence_trace.supports may only use evidence ids from the payload
- evidence_trace.gaps may only use gap ids declared in missing_evidence_or_gap
- for hold, next_step.target_gap_or_contradiction_id must point to a declared gap_id or contradiction_id

Return this exact JSON shape:
{
  "status": "accept|hold|reject",
  "why_this_status": "string",
  "missing_evidence_or_gap": [
    {
      "gap_id": "string",
      "gap_type": "missing_source|missing_validation|unresolved_contradiction|insufficient_specificity",
      "description": "string"
    }
  ],
  "contradictions": [
    {
      "contradiction_id": "string",
      "topic": "string",
      "conflicting_items": ["evidence_id_1", "evidence_id_2"],
      "why_it_matters": "string",
      "current_resolution_state": "unresolved|partially_resolved|resolved_for_now"
    }
  ],
  "next_step": {
    "action": "string",
    "owner_stage": "retrieval|validator",
    "target_gap_or_contradiction_id": "string",
    "expected_decision_effect": "string"
  },
  "evidence_trace": [
    {
      "trace_id": "string",
      "decision_claim": "string",
      "supports": ["evidence_id_1", "evidence_id_2"],
      "gaps": ["gap_id_1"]
    }
  ]
}
""".strip()

    user_prompt = f"""
Review this validated signal candidate conservatively under quality_change_package_A1.

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


def normalize_gap_list(value: Any, candidate_id: str) -> List[Dict[str, str]]:
    if not isinstance(value, list):
        return []

    normalized: List[Dict[str, str]] = []
    seen_ids = set()
    for index, entry in enumerate(value, start=1):
        if not isinstance(entry, dict):
            continue
        gap_type = str(entry.get("gap_type", "")).strip().lower()
        description = str(entry.get("description", "")).strip()
        if gap_type not in ALLOWED_GAP_TYPES or not description:
            continue
        raw_gap_id = str(entry.get("gap_id", "")).strip() or f"gap_{candidate_id}_{index}"
        gap_id = safe_slug(raw_gap_id) or f"gap_{candidate_id}_{index}"
        if gap_id in seen_ids:
            continue
        normalized.append(
            {
                "gap_id": gap_id,
                "gap_type": gap_type,
                "description": description,
            }
        )
        seen_ids.add(gap_id)
    return normalized


def normalize_contradictions(
    value: Any,
    candidate_id: str,
    valid_evidence_ids: List[str],
) -> List[Dict[str, Any]]:
    if not isinstance(value, list):
        return []

    valid_evidence_id_set = set(valid_evidence_ids)
    normalized: List[Dict[str, Any]] = []
    seen_ids = set()
    for index, entry in enumerate(value, start=1):
        if not isinstance(entry, dict):
            continue

        topic = str(entry.get("topic", "")).strip()
        why_it_matters = str(entry.get("why_it_matters", "")).strip()
        resolution_state = str(entry.get("current_resolution_state", "")).strip().lower()
        raw_conflicting_items = entry.get("conflicting_items")
        if not topic or not why_it_matters or resolution_state not in ALLOWED_RESOLUTION_STATES:
            continue
        if not isinstance(raw_conflicting_items, list):
            continue

        conflicting_items = [
            evidence_id
            for evidence_id in unique_strings(raw_conflicting_items)
            if evidence_id in valid_evidence_id_set
        ]
        if len(conflicting_items) < 2:
            continue

        raw_id = str(entry.get("contradiction_id", "")).strip() or f"contradiction_{candidate_id}_{index}"
        contradiction_id = safe_slug(raw_id) or f"contradiction_{candidate_id}_{index}"
        if contradiction_id in seen_ids:
            continue

        normalized.append(
            {
                "contradiction_id": contradiction_id,
                "topic": topic,
                "conflicting_items": conflicting_items,
                "why_it_matters": why_it_matters,
                "current_resolution_state": resolution_state,
            }
        )
        seen_ids.add(contradiction_id)
    return normalized


def normalize_next_step(
    value: Any,
    status: str,
    gaps: List[Dict[str, Any]],
    contradictions: List[Dict[str, Any]],
) -> Dict[str, str]:
    default_next_step = derive_default_next_step(status, gaps, contradictions)
    valid_targets = {
        str(gap.get("gap_id", "")).strip()
        for gap in gaps
        if str(gap.get("gap_id", "")).strip()
    }
    valid_targets.update(
        str(contradiction.get("contradiction_id", "")).strip()
        for contradiction in contradictions
        if str(contradiction.get("contradiction_id", "")).strip()
    )

    if not isinstance(value, dict):
        if status == "hold":
            return {
                "action": "",
                "owner_stage": "",
                "target_gap_or_contradiction_id": "",
                "expected_decision_effect": "",
            }
        return default_next_step

    if status == "hold":
        action = str(value.get("action", "")).strip()
        owner_stage = str(value.get("owner_stage", "")).strip().lower()
        target_id = str(value.get("target_gap_or_contradiction_id", "")).strip()
        expected_decision_effect = str(value.get("expected_decision_effect", "")).strip()
        if owner_stage not in ALLOWED_OWNER_STAGES:
            owner_stage = ""
        if target_id not in valid_targets:
            target_id = ""
    else:
        action = str(value.get("action", "")).strip() or default_next_step["action"]
        owner_stage = str(value.get("owner_stage", "")).strip().lower()
        if owner_stage not in ALLOWED_OWNER_STAGES:
            owner_stage = default_next_step["owner_stage"]
        target_id = str(value.get("target_gap_or_contradiction_id", "")).strip()
        if target_id and target_id not in valid_targets:
            target_id = default_next_step["target_gap_or_contradiction_id"]
        expected_decision_effect = (
            str(value.get("expected_decision_effect", "")).strip() or default_next_step["expected_decision_effect"]
        )

    return {
        "action": action,
        "owner_stage": owner_stage,
        "target_gap_or_contradiction_id": target_id,
        "expected_decision_effect": expected_decision_effect,
    }


def normalize_evidence_trace(
    value: Any,
    candidate_id: str,
    valid_evidence_ids: List[str],
    valid_gap_ids: List[str],
) -> List[Dict[str, Any]]:
    if not isinstance(value, list):
        return []

    valid_evidence_id_set = set(valid_evidence_ids)
    valid_gap_id_set = set(valid_gap_ids)
    normalized: List[Dict[str, Any]] = []
    seen_ids = set()
    for index, entry in enumerate(value, start=1):
        if not isinstance(entry, dict):
            continue

        decision_claim = str(entry.get("decision_claim", "")).strip()
        if not decision_claim:
            continue

        raw_supports = entry.get("supports")
        raw_gaps = entry.get("gaps")
        if not isinstance(raw_supports, list):
            raw_supports = []
        if not isinstance(raw_gaps, list):
            raw_gaps = []

        supports = [
            evidence_id
            for evidence_id in unique_strings(raw_supports)
            if evidence_id in valid_evidence_id_set
        ]
        gaps = [gap_id for gap_id in unique_strings(raw_gaps) if gap_id in valid_gap_id_set]
        if not supports and not gaps:
            continue

        raw_trace_id = str(entry.get("trace_id", "")).strip() or f"trace_{candidate_id}_{index}"
        trace_id = safe_slug(raw_trace_id) or f"trace_{candidate_id}_{index}"
        if trace_id in seen_ids:
            continue

        normalized.append(
            {
                "trace_id": trace_id,
                "decision_claim": decision_claim,
                "supports": supports,
                "gaps": gaps,
            }
        )
        seen_ids.add(trace_id)
    return normalized


def has_meaningful_evidence_trace(
    evidence_trace: List[Dict[str, Any]],
    require_support: bool = False,
) -> bool:
    if not evidence_trace:
        return False
    if require_support and not any(trace.get("supports") for trace in evidence_trace):
        return False
    return all(
        str(trace.get("decision_claim", "")).strip()
        and (trace.get("supports") or trace.get("gaps"))
        for trace in evidence_trace
    )


def has_named_blocker(
    gaps: List[Dict[str, Any]],
    contradictions: List[Dict[str, Any]],
) -> bool:
    return bool(gaps) or bool(get_unresolved_contradictions(contradictions))


def has_concrete_hold_next_step(
    next_step: Dict[str, str],
    gaps: List[Dict[str, Any]],
    contradictions: List[Dict[str, Any]],
) -> bool:
    if not isinstance(next_step, dict):
        return False

    action = str(next_step.get("action", "")).strip()
    owner_stage = str(next_step.get("owner_stage", "")).strip().lower()
    target_id = str(next_step.get("target_gap_or_contradiction_id", "")).strip()
    expected_effect = str(next_step.get("expected_decision_effect", "")).strip()
    if not action or owner_stage not in ALLOWED_OWNER_STAGES or not expected_effect:
        return False

    valid_targets = {
        str(gap.get("gap_id", "")).strip()
        for gap in gaps
        if str(gap.get("gap_id", "")).strip()
    }
    valid_targets.update(
        str(contradiction.get("contradiction_id", "")).strip()
        for contradiction in get_unresolved_contradictions(contradictions)
        if str(contradiction.get("contradiction_id", "")).strip()
    )
    return bool(target_id) and target_id in valid_targets


def normalize_review(
    item: Dict[str, Any],
    review_raw: Dict[str, Any],
) -> Dict[str, Any]:
    candidate_id = get_candidate_id(item)
    fallback = fallback_review(item)
    evidence_ids = collect_evidence_ids(item)

    status = str(review_raw.get("status", "")).strip().lower()
    if status not in ALLOWED_REVIEW_STATUSES:
        status = fallback["status"]

    gaps = normalize_gap_list(review_raw.get("missing_evidence_or_gap"), candidate_id)
    contradictions = normalize_contradictions(review_raw.get("contradictions"), candidate_id, evidence_ids)
    next_step = normalize_next_step(review_raw.get("next_step"), status, gaps, contradictions)
    evidence_trace = normalize_evidence_trace(
        review_raw.get("evidence_trace"),
        candidate_id,
        evidence_ids,
        [gap["gap_id"] for gap in gaps],
    )
    if not evidence_trace:
        evidence_trace = synthesize_evidence_trace(item, status, gaps, contradictions)

    why_this_status = str(review_raw.get("why_this_status", "")).strip()
    if not why_this_status:
        why_this_status = build_status_reason(item, status, gaps, contradictions)

    review = build_review_for_status(item, status, why_this_status, gaps, contradictions, next_step, evidence_trace)

    flags = infer_flags(item)
    handoff = get_validator_handoff(item)
    viable = handoff.get("candidate_viability") != "not_viable" and not flags["noise"]

    if flags["noise"]:
        return build_reject_review(
            item,
            "A1 guardrail: материал выглядит noise/irrelevant для текущего contour, поэтому candidate отклонён для текущей гипотезы.",
            review["missing_evidence_or_gap"],
            review["contradictions"],
        )

    if review["status"] == "accept" and flags["weak_or_ambiguous"]:
        return build_hold_review(
            item,
            "A1 guardrail: accept запрещён, потому что support остаётся weak/ambiguous и требует decision-moving следующего шага.",
            review["missing_evidence_or_gap"] or [default_hold_gap(item)],
            review["contradictions"],
            evidence_trace=review["evidence_trace"],
        )

    if review["status"] == "accept" and flags["confirmed_case"] and flags["vendor_or_self_reported"] and not flags["independent_evidence"]:
        return build_hold_review(
            item,
            "A1 guardrail: accept запрещён, потому что confirmed_case опирается на vendor/self-reported material без независимой верификации.",
            review["missing_evidence_or_gap"] or [default_hold_gap(item)],
            review["contradictions"],
            evidence_trace=review["evidence_trace"],
        )

    if review["status"] == "accept":
        if review["missing_evidence_or_gap"] or get_unresolved_contradictions(review["contradictions"]):
            if viable:
                return build_hold_review(
                    item,
                    "A1 guardrail: accept downgraded to hold, потому что named blocker или unresolved material contradiction ещё не сняты.",
                    review["missing_evidence_or_gap"] or [default_hold_gap(item)],
                    review["contradictions"],
                    derive_default_next_step("hold", review["missing_evidence_or_gap"], review["contradictions"]),
                    review["evidence_trace"],
                )
            return build_reject_review(
                item,
                "A1 guardrail: accept invalid, а viable support under current contour не реконструируется.",
                review["missing_evidence_or_gap"] or [default_reject_gap(item)],
                review["contradictions"],
                evidence_trace=review["evidence_trace"],
            )

        if not has_meaningful_evidence_trace(review["evidence_trace"], require_support=True):
            if viable:
                return build_hold_review(
                    item,
                    "A1 guardrail: accept downgraded to hold, потому что evidence_trace не даёт осмысленной реконструкции решения.",
                    review["missing_evidence_or_gap"] or [default_hold_gap(item)],
                    review["contradictions"],
                )
            return build_reject_review(
                item,
                "A1 guardrail: accept invalid, а traceability не подтверждает viable support.",
                review["missing_evidence_or_gap"] or [default_reject_gap(item)],
                review["contradictions"],
            )

    if review["status"] == "hold":
        if not viable:
            return build_reject_review(
                item,
                "A1 guardrail: hold invalid, потому что candidate уже не выглядит viable under current contour.",
                review["missing_evidence_or_gap"] or [default_reject_gap(item)],
                review["contradictions"],
                evidence_trace=review["evidence_trace"],
            )
        if not has_named_blocker(review["missing_evidence_or_gap"], review["contradictions"]):
            return build_reject_review(
                item,
                "A1 guardrail: hold invalid, потому что не назван blocker, который реально удерживает решение.",
                [default_reject_gap(item)],
                evidence_trace=review["evidence_trace"],
            )
        if not has_concrete_hold_next_step(review["next_step"], review["missing_evidence_or_gap"], review["contradictions"]):
            return build_reject_review(
                item,
                "A1 guardrail: hold invalid, потому что отсутствует concrete decision-moving next_step; для текущего contour нужен reject.",
                review["missing_evidence_or_gap"] or [default_reject_gap(item)],
                review["contradictions"],
                evidence_trace=review["evidence_trace"],
            )
        if not has_meaningful_evidence_trace(review["evidence_trace"]):
            review["evidence_trace"] = synthesize_evidence_trace(
                item,
                review["status"],
                review["missing_evidence_or_gap"],
                review["contradictions"],
            )

    if review["status"] == "reject":
        if not review["missing_evidence_or_gap"] and not review["contradictions"]:
            review["missing_evidence_or_gap"] = [default_reject_gap(item)]
            review["next_step"] = derive_default_next_step(
                review["status"],
                review["missing_evidence_or_gap"],
                review["contradictions"],
            )
        if not has_meaningful_evidence_trace(review["evidence_trace"]):
            review["evidence_trace"] = synthesize_evidence_trace(
                item,
                review["status"],
                review["missing_evidence_or_gap"],
                review["contradictions"],
            )

    review["why_this_status"] = build_status_reason(
        item,
        review["status"],
        review["missing_evidence_or_gap"],
        review["contradictions"],
    ) if not str(review.get("why_this_status", "")).strip() else str(review["why_this_status"]).strip()
    review["why_this_status"] = ensure_explicit_divergence_prefix(
        review["why_this_status"],
        handoff.get("implied_status", ""),
        review["status"],
    )
    return review


def group_by_candidate_id(items: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    grouped: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
    for item in items:
        candidate_id = get_candidate_id(item)
        grouped[candidate_id].append(item)
    return grouped


def make_group_payload(candidate_id: str, items: List[Dict[str, Any]]) -> Dict[str, Any]:
    validator_handoff = derive_validator_handoff(candidate_id, items)
    if len(items) == 1:
        payload = deepcopy(items[0])
        payload["candidate_id"] = candidate_id
        payload["source_item_count"] = 1
        payload["validator_handoff"] = validator_handoff
        return payload

    return {
        "candidate_id": candidate_id,
        "source_item_count": len(items),
        "grouped_validated_signals": items,
        "validator_handoff": validator_handoff,
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
    result["review_schema_version"] = REVIEW_SCHEMA_VERSION
    result["source_run_id"] = source_run_id
    result["reviewed_at_utc"] = utc_now_iso()
    result["review_model"] = review_model
    result["status"] = normalized_review["status"]
    result["why_this_status"] = normalized_review["why_this_status"]
    result["missing_evidence_or_gap"] = normalized_review["missing_evidence_or_gap"]
    result["contradictions"] = normalized_review["contradictions"]
    result["next_step"] = normalized_review["next_step"]
    result["evidence_trace"] = normalized_review["evidence_trace"]
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
    lines.append("- Слой работает консервативно в рамках `quality_change_package_A1`.")
    lines.append("- `accept` разрешён только при materially sufficient support и без unresolved material contradiction.")
    lines.append("- `hold` разрешён только при named blocker и concrete decision-moving next step.")
    lines.append("- Если concrete next step отсутствует, решение переводится в `reject` для текущего contour.")
    lines.append("- На каждый `candidate_id` создается ровно один reviewed item.")
    lines.append("")
    lines.append("## Решения по кандидатам")
    lines.append("")
    lines.append("| candidate_id | status | next_step.action | next_step.target |")
    lines.append("|---|---|---|---|")
    for item in reviewed_items:
        candidate_id = str(item.get("candidate_id", ""))
        status = str(item.get("status", ""))
        next_step = item.get("next_step", {})
        action = str(next_step.get("action", "")) if isinstance(next_step, dict) else ""
        target = str(next_step.get("target_gap_or_contradiction_id", "")) if isinstance(next_step, dict) else ""
        lines.append(f"| {candidate_id} | {status} | {action} | {target} |")
    lines.append("")
    lines.append("## Короткие основания")
    lines.append("")
    for item in reviewed_items:
        next_step = item.get("next_step", {})
        lines.append(f"### {item.get('candidate_id', '')}")
        lines.append("")
        lines.append(f"- status: `{item.get('status', '')}`")
        lines.append(f"- why: {item.get('why_this_status', '')}")
        lines.append(f"- next_step: `{next_step.get('action', '')}` -> `{next_step.get('target_gap_or_contradiction_id', '')}`")
        lines.append("")
    return "\n".join(lines).strip() + "\n"


def build_project_update_block_ru(
    run_id: str,
    source_run_id: str,
    reviewed_items: List[Dict[str, Any]],
    decision_counts: Counter,
) -> str:
    accept_ids = [str(x["candidate_id"]) for x in reviewed_items if x["status"] == "accept"]
    hold_ids = [str(x["candidate_id"]) for x in reviewed_items if x["status"] == "hold"]
    reject_ids = [str(x["candidate_id"]) for x in reviewed_items if x["status"] == "reject"]

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
    lines.append("- Review layer ужесточён без redesign всего runtime contour.")
    lines.append("- Silent override от validator implication запрещён: divergence теперь должен быть явным.")
    lines.append("- `hold` больше не допускается без named blocker и concrete decision-moving next step.")
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

    decision_counts = Counter(item["status"] for item in reviewed_items)

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
        "review_schema_version": REVIEW_SCHEMA_VERSION,
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
            "validator_handoff_required": True,
            "accept_requires_material_support": True,
            "accept_forbids_unresolved_material_contradiction": True,
            "hold_requires_named_blocker": True,
            "hold_requires_decision_moving_next_step": True,
            "reject_is_for_current_contour_only": True,
            "allowed_status": sorted(ALLOWED_REVIEW_STATUSES),
            "allowed_gap_type": sorted(ALLOWED_GAP_TYPES),
            "allowed_contradiction_resolution_state": sorted(ALLOWED_RESOLUTION_STATES),
            "allowed_owner_stage": sorted(ALLOWED_OWNER_STAGES),
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
