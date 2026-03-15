# Patch Plan

## Status
Approved

## Related Decision
decision_007 hardening patch

## Document Path
docs/approved/vscode_codex_handoff_contract.md

## Current Version
`vscode_codex_handoff_contract` at `v0.1`

Control / history layer:
- `decision_007` is already committed in Git at `3d3c5945ed7b338025712f94282dfd43ca1e9d3f`
- live pointers still treat `decision_006` as the committed contour

## Target Version
`vscode_codex_handoff_contract` at `v0.2`

Control / history layer:
- `decision_007` repaired as the committed baseline at `3d3c5945ed7b338025712f94282dfd43ca1e9d3f`
- new working snapshot `approved_contour_2026-03-15_patch_011_handoff_contract_rendering_hardening`

## Base Commit SHA
`3d3c5945ed7b338025712f94282dfd43ca1e9d3f`

## Base Approved Contour Snapshot ID
`approved_contour_2026-03-15_decision_007`

## Why This Patch Exists
Canonical handoff contract already defines the package structure, but it does not yet define execution-ready rendering rules for Codex IDE prompts.

This patch hardens the existing contract so executable prompts become reproducible and auditable on:
- language split;
- `@file` rendering in `Source Docs`;
- preflight validation before execution.

## Exact Changes
1. Add prompt rendering rules to `docs/approved/vscode_codex_handoff_contract.md`.
2. Add preflight validation checklist and rendering-related interface failure cases.
3. Update full and short handoff templates so `Source Docs` examples use `@file` references.
4. Update `docs/indexes/current_handoff.md` so the live handoff artifact is structurally compliant with the hardened contract.
5. Repair stale committed pointers and add the new working snapshot in the control/history layer.

## Explicit Non-Changes
- Do not change `master_instruction.md` unless a direct contradiction is found.
- Do not change `spec_governance.md` unless a direct contradiction is found.
- Do not change `decision_log.md` unless a direct contradiction is found.
- Do not change `output_contract.md`.
- Do not change `test_set.md`.
- Do not retrofit historical patch plans or decision drafts.
- Do not expand this patch into broader governance redesign.

## Cross-Doc Sync Required
- `docs/indexes/version_registry.md`
- `docs/indexes/change_log.md`
- `docs/indexes/current_handoff.md`
- `docs/indexes/approved_contour_history.md`
- `docs/history/approved_contours/approved_contour_2026-03-15_decision_007.md`
- `docs/history/approved_contours/approved_contour_2026-03-15_patch_011_handoff_contract_rendering_hardening.md`

## Risks
- If rendering rules remain implicit, structurally valid handoff packages can still be execution-invalid in Codex IDE.
- If `current_handoff.md` is not updated, the live repo-resident example becomes misleading immediately after the contract hardening.
- If committed pointers are not repaired first, control/history metadata remains internally dishonest.

## Approval
Approved
