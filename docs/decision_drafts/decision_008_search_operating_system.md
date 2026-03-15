# Decision Draft

## Status
Approved

## Decision ID
decision_008

## Title
Search Operating System for decision-driven and coverage-aware research runs

## Scope
Введение governed search layer для Manus research runs без изменения evidence/classification system и без broader research-system redesign.

## Problem
Текущий research contour умеет находить сигналы и возвращать run artifacts, но не фиксирует search behavior как управляемую систему.

Из-за этого не видно:
- какой decision question решал run;
- какую неопределенность он снижал;
- почему выбраны именно эти годы / месяцы, географии и типы источников;
- что реально покрыто;
- где blind spots;
- почему поиск остановлен;
- какой next lane нужен дальше.

## Decision
Принято следующее operating rule.

1. Каждый research run начинается с явного `decision_question` и `uncertainty_to_reduce`.
2. Каждый run должен явно задавать search space через:
   - `search_space_map`
   - `time_window_primary`
   - `time_window_secondary`
   - `older_evidence_rule`
   - `required_geographies`
   - `optional_geographies`
   - `reason_for_geography_selection`
   - `source_coverage_plan`
   - `revisit_targets`
   - `new_exploration_targets`
   - `revisit_reason`
3. Каждый run обязан возвращать:
   - `coverage_summary`
   - `covered_areas`
   - `uncovered_areas`
   - `main_blind_spots`
   - `coverage_confidence`
   - `stopping_rule`
   - `stopping_reason`
   - `recommended_next_search_lane`
   - `next_run_rationale`
4. `output_contract` должен требовать обязательный nested object `search_governance` в `run_manifest.json` и Search Governance block в `run_synthesis_ru.md`.

## Rationale
Эта модель делает run:
- decision-driven;
- coverage-aware;
- explicit about completeness;
- explicit about blind spots;
- explicit about next lane.

Она нужна, чтобы следующий run выбирался по снижению неопределенности, а не неявно.

## Consequences
### Documentation consequences
- `decision_log`: `v0.10 -> v0.11`
- `master_instruction`: `v0.6 -> v0.7`
- `experiment_charter_stage_a`: `v0.7 -> v0.8`
- `output_contract`: `v0.4 -> v0.5`
- `project_brief`: `v0.8 -> v0.9`

### Review-only documents
- `spec_governance`: no change by default
- `vscode_codex_handoff_contract`: no change by default
- `test_set`: no change by default
- `README_upload_to_projects`: no change by default

### Control / history consequences
- committed baseline must be repaired from stale `decision_007` pointer to committed `patch_011` at `e30164588f005064a072bf222419926ff8eb49aa`
- new working snapshot becomes `approved_contour_2026-03-15_decision_008`

## Affected Documents
- docs/approved/project_brief.md
- docs/approved/experiment_charter_stage_a.md
- docs/approved/decision_log.md
- docs/approved/master_instruction.md
- docs/approved/output_contract.md
- docs/indexes/version_registry.md
- docs/indexes/change_log.md
- docs/indexes/current_handoff.md
- docs/indexes/approved_contour_history.md
- docs/history/approved_contours/approved_contour_2026-03-15_patch_011_handoff_contract_rendering_hardening.md
- docs/history/approved_contours/approved_contour_2026-03-15_decision_008.md

## Version Impact
- decision_log: `v0.10 -> v0.11`
- master_instruction: `v0.6 -> v0.7`
- experiment_charter_stage_a: `v0.7 -> v0.8`
- output_contract: `v0.4 -> v0.5`
- project_brief: `v0.8 -> v0.9`

## History / Snapshot Impact
- current_committed_snapshot_id: `approved_contour_2026-03-15_patch_011_handoff_contract_rendering_hardening`
- current_working_snapshot_id: `approved_contour_2026-03-15_decision_008`
- recovery_model_change: no
- new snapshot required: yes

## Boundary
Это решение:
- не вводит Evidence and Classification System;
- не меняет core-vs-adjacent taxonomy;
- не вводит pricing confidence model;
- не вводит buyer map, denominator/prevalence model или полноценную segmentation model;
- не вводит research memory / cross-run memory system.

## Approval
Approved
