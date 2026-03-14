# Decision Draft

## Status
Approved

## Decision ID
decision_006

## Title
Contour history layer replaces archived duplicate governance copies

## Scope
Замена duplicate archived full copies governance docs на explicit contour snapshot/history layer.

## Problem
После перехода active approved docs на stable semantic paths historical recovery все еще зависел от duplicate full copies в `docs/outdated/`.

Это смешивало:
- lifecycle semantics;
- storage model;
- contour-level recovery;
- revision history.

Без отдельного contour history layer repo продолжал хранить governance history как pile of archived copies.

## Decision
Принято следующее operating rule.

1. Active approved governance docs живут только на stable semantic paths.
2. Duplicate archived full copies не являются canonical history model.
3. Historical recovery выполняется через:
   - Git history;
   - `docs/indexes/approved_contour_history.md`;
   - `docs/history/approved_contours/`.
4. Contour snapshots должны фиксировать:
   - snapshot id;
   - status;
   - effective date;
   - approved contour commit SHA или recovery commit SHA;
   - source decision / change package;
   - stable paths;
   - approved revisions.
5. `approved_contour_commit_sha` и `approved_contour_paths` в `run_manifest.json` должны соответствовать contour snapshot из canonical history layer.

## Rationale
Эта модель отделяет:
- identity текущего governance doc;
- history его ревизий;
- recovery конкретного approved contour.

Она нужна, чтобы history не зависела от duplicate copies и при этом не терялась traceability approved states.

## Consequences
### Governance consequences
- `spec_governance` должен зафиксировать contour history layer как canonical.
- `decision_log` должен зафиксировать replacement archived duplicate copies.
- `project_brief` и `README_upload_to_projects` должны описывать history recovery через snapshot/history model.

### Documentation consequences
- `spec_governance`: v0.4 -> v0.5
- `decision_log`: v0.8 -> v0.9
- `project_brief`: v0.6 -> v0.7
- `README_upload_to_projects`: v0.3 -> v0.4
- `output_contract`: v0.3 -> v0.4

### Storage consequences
- archived duplicate full copies governance docs подлежат удалению после backfill history layer;
- numbered artifacts в `docs/patch_plans/` и `docs/decision_drafts/` сохраняются.

## Affected Documents
- docs/approved/spec_governance.md
- docs/approved/decision_log.md
- docs/approved/project_brief.md
- docs/approved/README_upload_to_projects.md
- docs/approved/output_contract.md
- docs/indexes/version_registry.md
- docs/indexes/change_log.md
- docs/indexes/current_handoff.md
- docs/indexes/approved_contour_history.md
- docs/history/approved_contours/

## Version Impact
- spec_governance: v0.4 -> v0.5
- decision_log: v0.8 -> v0.9
- project_brief: v0.6 -> v0.7
- README_upload_to_projects: v0.3 -> v0.4
- output_contract: v0.3 -> v0.4
- master_instruction: v0.5 -> v0.5
- experiment_charter_stage_a: v0.6 -> v0.6
- test_set: v0.2 -> v0.2

## History / Snapshot Impact
- current_snapshot_id: `approved_contour_2026-03-15_decision_006`
- superseded_snapshot_ids: `approved_contour_2026-03-15_decision_005` and earlier
- recovery_model_change: yes
- historical refs requiring normalization: live canonical/current layer only

## Boundary
Это решение:
- меняет storage/history model governance contour;
- не меняет numbering/id-based artifacts;
- не меняет semantic signal model;
- не перестраивает run artifact schema beyond existing contour grounding fields.

## Approval
Approved
