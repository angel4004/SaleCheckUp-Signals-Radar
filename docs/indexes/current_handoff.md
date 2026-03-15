# Current handoff

Status: draft

## Contour grounding
- Base approved contour snapshot ID: `approved_contour_2026-03-15_decision_006`
- Current working snapshot ID: `approved_contour_2026-03-15_decision_007`
- Base `HEAD` commit SHA: `33fa8ecbc066025bbdbc2b6e1b94a9fb50b817ea`
- Workspace state at execution start: clean working tree

## Task
- Introduce the canonical approved handoff contract for repo work between GPT Project and VS Code/Codex and wire it into the live governance contour.

## Source docs
- `docs/approved/spec_governance.md`
- `docs/approved/decision_log.md`
- `docs/approved/master_instruction.md`
- `docs/approved/vscode_codex_handoff_contract.md`
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
- Create the new approved handoff contract doc for repo work.
- Update handoff-related sections in `master_instruction` and `spec_governance`.
- Sync `decision_log` and direct contour-reference docs with the new contract.
- Repair stale `decision_006` committed pointers and add working snapshot `decision_007`.
- Update canonical `version_registry` and `change_log`.

### Do not change
- `output_contract.md`
- `test_set.md`
- patch-plan and decision-draft templates
- research logic, signal taxonomy, evidence model and search rules

## Sync impact
- Live approved contour lists must include the new contract where they enumerate repo/spec governance docs.
- Decision and history layer must stay honest about the actual committed baseline for `decision_006`.
- Handoff semantics must move from weak threshold framing to the contract-default rule.

## Document status
- approved: `spec_governance.md`, `project_brief.md`, `experiment_charter_stage_a.md`, `decision_log.md`, `master_instruction.md`, `vscode_codex_handoff_contract.md`, `output_contract.md`, `test_set.md`, `README_upload_to_projects.md`
- outdated: none
- draft: `docs/indexes/current_handoff.md`, `docs/patch_plans/patch_plan_010_canonical_vscode_codex_handoff_contract.md`, `docs/decision_drafts/decision_007_canonical_vscode_codex_handoff_contract.md`, `docs/indexes/approved_contour_history.md`, `docs/history/approved_contours/approved_contour_2026-03-15_decision_007.md`
