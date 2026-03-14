# Version Registry

Active approved docs use stable semantic paths in `docs/approved/`.
`current_version` remains the canonical revision marker for the active approved contour.
The table below reflects the current working contour prepared in the workspace.
The last committed source-of-truth contour remains pinned through `current_committed_snapshot_id` until the next Git commit.

## Contour Snapshots

- `current_working_snapshot_id`: `approved_contour_2026-03-15_decision_006`
- `current_committed_snapshot_id`: `approved_contour_2026-03-15_decision_005`
- `history_index`: `docs/indexes/approved_contour_history.md`
- `last_committed_approved_contour_sha`: `e1f5c9b7a248baad0b8de1e466af4ca16eef52bf`

## Approved Documents

| document | current_version | status | location | notes |
|---|---|---|---|---|
| project_brief | v0.7 | approved | docs/approved/project_brief.md | aligned with decision_006 and contour-history replacement for archived duplicate copies |
| experiment_charter_stage_a | v0.6 | approved | docs/approved/experiment_charter_stage_a.md | aligned with decision_005, Stage A execution boundary and run grounding |
| decision_log | v0.9 | approved | docs/approved/decision_log.md | canonical decision layer aligned with decision_006 and contour history model |
| master_instruction | v0.5 | approved | docs/approved/master_instruction.md | aligned with decision_005 and stable approved path usage in repo execution |
| output_contract | v0.4 | approved | docs/approved/output_contract.md | run grounding must match canonical approved contour history layer |
| test_set | v0.2 | approved | docs/approved/test_set.md | path-only migration to stable approved path under decision_005; semantic model unchanged |
| spec_governance | v0.5 | approved | docs/approved/spec_governance.md | governance model with contour history artifacts instead of archived duplicate full copies |
| README_upload_to_projects | v0.4 | approved | docs/approved/README_upload_to_projects.md | operational upload guide aligned with contour history layer and decision_006 |
