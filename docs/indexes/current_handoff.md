# Current handoff

Status: draft

## Contour grounding
- Base approved contour snapshot ID: `approved_contour_2026-03-15_decision_005`
- Current working snapshot ID: `approved_contour_2026-03-15_decision_006`
- Base `HEAD` commit SHA: `e1f5c9b7a248baad0b8de1e466af4ca16eef52bf`
- Workspace state at execution start: clean working tree

## Task
- Replace archived duplicate governance copies with explicit approved contour history artifacts and keep run grounding aligned with committed contour snapshots.

## Source docs
- `docs/approved/spec_governance.md`
- `docs/approved/decision_log.md`
- `docs/approved/master_instruction.md`
- `docs/approved/project_brief.md`
- `docs/approved/experiment_charter_stage_a.md`
- `docs/approved/README_upload_to_projects.md`
- `docs/approved/output_contract.md`
- `docs/approved/test_set.md`
- `docs/indexes/version_registry.md`
- `docs/indexes/change_log.md`
- `docs/indexes/approved_contour_history.md`

## Change scope
### Change
- Release new approved revisions where storage/history policy changes.
- Add canonical contour history index and approved contour snapshot artifacts.
- Remove duplicate archived governance copies after historical backfill is in place.
- Update canonical `version_registry`, `change_log`, templates and run/history grounding policy.

### Do not change
- historical patch plans and decision drafts unrelated to this sync-pass
- semantic classification model in `test_set`
- numbering/id-based artifact model for patch plans and decision drafts

## Sync impact
- History recovery must stop depending on archived duplicate full copies.
- `output_contract` must point run grounding to canonical contour history artifacts.
- Live templates must carry snapshot-aware grounding fields.

## Document status
- approved: `spec_governance.md`, `project_brief.md`, `experiment_charter_stage_a.md`, `decision_log.md`, `master_instruction.md`, `output_contract.md`, `test_set.md`, `README_upload_to_projects.md`
- outdated: semantic previous revisions are represented in `approved_contour_history`, not as duplicate full-copy files
- draft: `docs/indexes/current_handoff.md`, `docs/patch_plans/patch_plan_009_contour_history_replaces_archived_duplicate_copies.md`, `docs/decision_drafts/decision_006_contour_history_replaces_archived_duplicate_copies.md`, `docs/indexes/approved_contour_history.md`
