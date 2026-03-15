# Version Registry

Active approved docs use stable semantic paths in `docs/approved/`.
`current_version` remains the canonical revision marker for the active approved contour.
The table below reflects the current working contour prepared in the workspace.
The last committed source-of-truth contour remains pinned through `current_committed_snapshot_id` until the next Git commit.

## Contour Snapshots

- `current_working_snapshot_id`: `approved_contour_2026-03-15_decision_007`
- `current_committed_snapshot_id`: `approved_contour_2026-03-15_decision_006`
- `history_index`: `docs/indexes/approved_contour_history.md`
- `last_committed_approved_contour_sha`: `33fa8ecbc066025bbdbc2b6e1b94a9fb50b817ea`

## Approved Documents

| document | current_version | status | location | notes |
|---|---|---|---|---|
| project_brief | v0.8 | approved | docs/approved/project_brief.md | aligned with decision_007 and contract-default repo/spec handoff wording |
| experiment_charter_stage_a | v0.7 | approved | docs/approved/experiment_charter_stage_a.md | aligned with decision_007 and canonical handoff contract boundary |
| decision_log | v0.10 | approved | docs/approved/decision_log.md | canonical decision layer aligned with decision_007 handoff contract rule |
| master_instruction | v0.6 | approved | docs/approved/master_instruction.md | aligned with decision_007 and canonical handoff contract default rule |
| output_contract | v0.4 | approved | docs/approved/output_contract.md | run grounding must match canonical approved contour history layer |
| test_set | v0.2 | approved | docs/approved/test_set.md | path-only migration to stable approved path under decision_005; semantic model unchanged |
| spec_governance | v0.6 | approved | docs/approved/spec_governance.md | governance model with required handoff contract as reasoning-to-execution interface |
| README_upload_to_projects | v0.5 | approved | docs/approved/README_upload_to_projects.md | operational upload guide aligned with decision_007 and canonical handoff contract |
| vscode_codex_handoff_contract | v0.1 | approved | docs/approved/vscode_codex_handoff_contract.md | canonical approved repo-work handoff interface between GPT Project and VS Code/Codex |
