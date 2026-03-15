# Current handoff

Status: draft
Mode: full_handoff

## Contour Grounding
- Base Approved Contour Snapshot ID: `approved_contour_2026-03-15_decision_007`
- Current Working Snapshot ID: `approved_contour_2026-03-15_patch_011_handoff_contract_rendering_hardening`
- Base HEAD Commit SHA: `3d3c5945ed7b338025712f94282dfd43ca1e9d3f`
- Workspace state at execution start: clean working tree

## Task
- Harden the canonical VS Code/Codex handoff contract so it explicitly defines executable prompt rendering rules and a preflight validation checklist.

## Source Docs
- @docs/approved/vscode_codex_handoff_contract.md
- @docs/approved/master_instruction.md
- @docs/approved/spec_governance.md
- @docs/approved/decision_log.md
- @docs/indexes/version_registry.md
- @docs/indexes/change_log.md
- @docs/indexes/current_handoff.md
- @docs/indexes/approved_contour_history.md

## Change Scope
- Update `docs/approved/vscode_codex_handoff_contract.md` with prompt rendering rules, preflight validation checklist and rendering-related interface failure cases.
- Update the contract templates so `Source Docs` examples use `@file` references.
- Repair stale committed pointers so `approved_contour_2026-03-15_decision_007` becomes the committed baseline at `3d3c5945ed7b338025712f94282dfd43ca1e9d3f`.
- Add working snapshot `approved_contour_2026-03-15_patch_011_handoff_contract_rendering_hardening`.
- Update `docs/indexes/current_handoff.md` so the live repo-resident handoff artifact is structurally compliant with the hardened contract.
- Update canonical `version_registry`, `change_log` and `approved_contour_history`.

## Do Not Change
- @docs/approved/master_instruction.md unless a direct contradiction is found
- @docs/approved/spec_governance.md unless a direct contradiction is found
- @docs/approved/decision_log.md unless a direct contradiction is found
- @docs/approved/output_contract.md
- @docs/approved/test_set.md
- historical patch plans and decision drafts
- research logic, signal taxonomy, evidence model and search rules

## Affected Docs / Files
- @docs/approved/vscode_codex_handoff_contract.md
- @docs/indexes/version_registry.md
- @docs/indexes/change_log.md
- @docs/indexes/current_handoff.md
- @docs/indexes/approved_contour_history.md
- @docs/history/approved_contours/approved_contour_2026-03-15_decision_007.md
- @docs/history/approved_contours/approved_contour_2026-03-15_patch_011_handoff_contract_rendering_hardening.md
- @docs/patch_plans/patch_plan_011_handoff_contract_rendering_hardening.md

## Document Status
- approved: @docs/approved/vscode_codex_handoff_contract.md, @docs/approved/master_instruction.md, @docs/approved/spec_governance.md, @docs/approved/decision_log.md
- outdated: none
- draft: @docs/indexes/current_handoff.md, @docs/patch_plans/patch_plan_011_handoff_contract_rendering_hardening.md, @docs/history/approved_contours/approved_contour_2026-03-15_patch_011_handoff_contract_rendering_hardening.md

## Sync Impact
- Future executable Codex IDE prompts must render `Source Docs` through `@file` references.
- Current live handoff artifact must match the hardened contract so it does not remain a misleading example.
- Control/history pointers must distinguish the committed `decision_007` baseline from the new working patch_011 snapshot.
- Historical artifacts with plain repo paths remain audit trail and are not retrofitted in this patch.

## Constraints / Assumptions
- Use current `main` workspace state as source of truth.
- Keep section headers and machine-facing field names in English.
- Keep human-facing explanatory wording in Russian.
- Treat this patch as contract hardening under existing `decision_007`, not as a new decision-layer entity, unless a direct contradiction is discovered.
- Do not leave control/history pointers in a stale state after the contract bump.

## Expected Execution Report
- Changed Files
- Created Files
- Unchanged Reviewed Files
- Version / Control Sync
- Sync Impact
- Unresolved Contradictions
- Completion Check
- Short Russian Implementation Summary
