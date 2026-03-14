# Patch Plan

## Status
Approved

## Related Decision
decision_005

## Document Path
Multi-document approved contour and control layer

## Current Version
Multi-document approved contour:
- `spec_governance_v0.3`
- `decision_log_v0.7`
- `master_instruction_v0.4`
- `project_brief_v0.5`
- `experiment_charter_stage_a_v0.5`
- `README_upload_to_projects_v0.2`
- `output_contract_v0.2`
- `test_set_v0.2`

## Target Version
Multi-document sync package:
- `spec_governance` at `v0.4`
- `decision_log` at `v0.8`
- `master_instruction` at `v0.5`
- `project_brief` at `v0.6`
- `experiment_charter_stage_a` at `v0.6`
- `README_upload_to_projects` at `v0.3`
- `output_contract` at `v0.3`
- `test_set` at `v0.2` on stable path

## Base Commit SHA
`796229e179df6b3660e3d4f49cfd3146c629f86b`

## Why This Patch Exists
Текущий active approved contour зависит от version suffix в filenames.

Это создает ambiguity между:
- active document identity;
- revision history;
- run-level grounding;
- handoff context.

Без системной migration active approved contour останется зависимым от versioned filenames как от скрытого source of truth.

## Exact Changes
1. Выпустить stable approved paths в `docs/approved/` для всего active contour.
2. Выпустить новые approved revisions там, где меняется policy, lifecycle или schema, и оставить `test_set` на `v0.2` как path-only migration.
3. Зафиксировать stable approved path policy и commit-grounded runs в canonical governance docs и decision layer.
4. Перевести superseded approved versions в `docs/outdated/` с сохранением versioned archival filenames.
5. Обновить `version_registry`, `change_log`, `current_handoff` и live templates.
6. Устранить live refs на versioned approved filenames вне historical context.

## Explicit Non-Changes
- Не перестраивать historical archive model за пределами `docs/outdated/`.
- Не переписывать старые patch plans и decision drafts, которые остаются audit trail.
- Не вводить отдельный snapshot artifact сверх commit-grounded run model.
- Не менять semantic classification model.

## Cross-Doc Sync Required
- `docs/indexes/version_registry.md`
- `docs/indexes/change_log.md`
- `docs/indexes/current_handoff.md`
- `docs/patch_plans/_template_patch_plan.md`
- `docs/decision_drafts/_template_decision_draft.md`

## Risks
- Если обновить только filenames, contour останется логически version-suffixed через policy text и registry.
- Если не обновить `output_contract`, run grounding останется ambiguous.
- Если не обновить templates, live execution artifacts продолжат воспроизводить старую naming logic.

## Approval
Approved
