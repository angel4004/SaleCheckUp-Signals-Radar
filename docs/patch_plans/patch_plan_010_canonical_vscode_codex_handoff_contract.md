# Patch Plan

## Status
Approved

## Related Decision
decision_007

## Document Path
Multi-document governance sync for canonical VS Code/Codex handoff contract

## Current Version
Multi-document approved contour:
- `master_instruction` at `v0.5`
- `spec_governance` at `v0.5`
- `decision_log` at `v0.9`
- `project_brief` at `v0.7`
- `README_upload_to_projects` at `v0.4`
- `experiment_charter_stage_a` at `v0.6`

Control / history layer:
- `decision_006` is already committed in Git but still marked as `pending_commit` in live indexes and snapshot layer

## Target Version
Multi-document sync package:
- new `vscode_codex_handoff_contract` at `v0.1`
- `master_instruction` at `v0.6`
- `spec_governance` at `v0.6`
- `decision_log` at `v0.10`
- `project_brief` at `v0.8`
- `README_upload_to_projects` at `v0.5`
- `experiment_charter_stage_a` at `v0.7`

Control / history layer:
- `decision_006` repaired as the committed baseline at `33fa8ecbc066025bbdbc2b6e1b94a9fb50b817ea`
- `decision_007` added as current working snapshot

## Base Commit SHA
`33fa8ecbc066025bbdbc2b6e1b94a9fb50b817ea`

## Base Approved Contour Snapshot ID
`approved_contour_2026-03-15_decision_006`

## Why This Patch Exists
Handoff rules for repo work already exist but are distributed across multiple docs and oral memory.

This patch creates one canonical approved handoff interface without broad rewrites and repairs the stale commit-pointer inconsistency that would otherwise make this wave non-canonical.

## Exact Changes
1. Create a new approved handoff contract doc for repo work between `GPT Project` and `VS Code/Codex`.
2. Update only the handoff-related sections of `master_instruction` and `spec_governance`.
3. Sync `decision_log` and direct contour-reference docs so the new contract becomes part of the live approved contour.
4. Repair `decision_006` committed-pointer state in `version_registry`, `change_log`, `approved_contour_history` and snapshot `decision_006`.
5. Add working snapshot `decision_007` and update `current_handoff`.

## Explicit Non-Changes
- Do not change `output_contract.md`.
- Do not change `test_set.md`.
- Do not change patch-plan or decision-draft templates.
- Do not change signal taxonomy, evidence model, run logic or search rules.
- Do not perform broader contour cleanup beyond files directly required for this wave.

## Cross-Doc Sync Required
- `docs/indexes/version_registry.md`
- `docs/indexes/change_log.md`
- `docs/indexes/current_handoff.md`
- `docs/indexes/approved_contour_history.md`
- `docs/history/approved_contours/approved_contour_2026-03-15_decision_006.md`
- `docs/history/approved_contours/approved_contour_2026-03-15_decision_007.md`

## Risks
- If the new contract is added without decision/control sync, the wave remains non-canonical.
- If direct contour-reference docs are not updated, the approved contour list becomes stale immediately.
- If `decision_006` pointers are not repaired first, the history layer remains internally inconsistent.

## Approval
Approved
