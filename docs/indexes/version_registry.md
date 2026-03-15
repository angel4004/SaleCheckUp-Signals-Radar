# Version Registry

Active approved docs use stable semantic paths in `docs/approved/`.
`current_version` remains the canonical revision marker for the active approved contour.
The table below reflects the current working contour prepared in the workspace.
The last committed source-of-truth contour remains pinned through `current_committed_snapshot_id` until the next Git commit.

## Contour Snapshots

- `current_working_snapshot_id`: `approved_contour_2026-03-15_decision_008`
- `current_committed_snapshot_id`: `approved_contour_2026-03-15_patch_011_handoff_contract_rendering_hardening`
- `history_index`: `docs/indexes/approved_contour_history.md`
- `last_committed_approved_contour_sha`: `e30164588f005064a072bf222419926ff8eb49aa`

## Approved Documents

| document | current_version | status | location | notes |
|---|---|---|---|---|
| project_brief | v0.9 | approved | docs/approved/project_brief.md | research machine is now explicitly uncertainty-reducing and coverage-aware under decision_008 |
| experiment_charter_stage_a | v0.8 | approved | docs/approved/experiment_charter_stage_a.md | Stage A now tests search governance, completeness reporting and next-lane logic under decision_008 |
| decision_log | v0.11 | approved | docs/approved/decision_log.md | canonical decision layer now includes decision_008 Search Operating System |
| master_instruction | v0.7 | approved | docs/approved/master_instruction.md | Manus search behavior now includes Search Operating System rules under decision_008 |
| output_contract | v0.5 | approved | docs/approved/output_contract.md | run contract now requires nested `search_governance` and Search Governance reporting sections |
| test_set | v0.2 | approved | docs/approved/test_set.md | path-only migration to stable approved path under decision_005; semantic model unchanged |
| spec_governance | v0.6 | approved | docs/approved/spec_governance.md | governance model with required handoff contract as reasoning-to-execution interface |
| README_upload_to_projects | v0.5 | approved | docs/approved/README_upload_to_projects.md | operational upload guide aligned with decision_007 and canonical handoff contract |
| vscode_codex_handoff_contract | v0.2 | approved | docs/approved/vscode_codex_handoff_contract.md | canonical approved repo-work handoff interface with explicit prompt rendering rules, `@file` source-doc standard and preflight validation checklist |
