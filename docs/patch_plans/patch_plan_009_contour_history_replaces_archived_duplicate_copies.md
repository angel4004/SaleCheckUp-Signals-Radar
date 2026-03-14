# Patch Plan

## Status
Approved

## Related Decision
decision_006

## Document Path
Multi-document governance history layer and control layer

## Current Version
Multi-document approved contour:
- `spec_governance` at `v0.4`
- `decision_log` at `v0.8`
- `project_brief` at `v0.6`
- `README_upload_to_projects` at `v0.3`
- `output_contract` at `v0.3`

History model:
- duplicate archived governance copies in `docs/outdated/`
- no explicit approved contour history index

## Target Version
Multi-document sync package:
- `spec_governance` at `v0.5`
- `decision_log` at `v0.9`
- `project_brief` at `v0.7`
- `README_upload_to_projects` at `v0.4`
- `output_contract` at `v0.4`

History model:
- canonical contour history index
- snapshot files for coherent approved states
- no duplicate archived full copies for governance contour docs

## Base Commit SHA
`e1f5c9b7a248baad0b8de1e466af4ca16eef52bf`

## Base Approved Contour Snapshot ID
`approved_contour_2026-03-15_decision_005`

## Why This Patch Exists
После stable-path migration history recovery governance contour продолжала зависеть от duplicate full copies в `docs/outdated/`.

Это не соответствует целевой модели:
- один semantic governance doc = один stable path;
- Git = revision history;
- contour snapshots = approved state history.

## Exact Changes
1. Зафиксировать новую storage/history policy в canonical approved docs и decision layer.
2. Ввести canonical history index и approved contour snapshot files.
3. Обновить `version_registry`, `change_log`, `current_handoff`, templates и run/history wording.
4. Удалить duplicate archived governance copies после backfill history artifacts.
5. Нормализовать live refs, которые иначе будут зависеть от deleted duplicate copies.

## Explicit Non-Changes
- Не менять numbering/id-based artifacts как модель.
- Не переписывать целиком numbered historical artifacts, которые остаются audit trail.
- Не добавлять новые `run_manifest.json` fields beyond existing contour grounding fields.
- Не менять semantic classification model.

## Cross-Doc Sync Required
- `docs/indexes/version_registry.md`
- `docs/indexes/change_log.md`
- `docs/indexes/current_handoff.md`
- `docs/indexes/approved_contour_history.md`
- `docs/history/approved_contours/`
- `docs/patch_plans/_template_patch_plan.md`
- `docs/decision_drafts/_template_decision_draft.md`

## Risks
- Если удалить archived duplicates без snapshot layer, потеряется repo-resident contour-level recovery.
- Если не обновить live refs, current layer сохранит скрытую зависимость от deleted files.
- Если не разделить committed snapshot и current working snapshot, commit-grounding станет недостоверным.

## Approval
Approved
