# Patch Plan

## Status
Approved

## Related Decision
decision_008

## Document Path
Multi-document sync for Wave 1 Search Operating System

## Current Version
Multi-document approved contour:
- `decision_log` at `v0.10`
- `master_instruction` at `v0.6`
- `experiment_charter_stage_a` at `v0.7`
- `output_contract` at `v0.4`
- `project_brief` at `v0.8`

Control / history layer:
- `patch_011` is already committed in Git at `e30164588f005064a072bf222419926ff8eb49aa`
- live pointers still treat `decision_007` as committed baseline and `patch_011` as working snapshot

## Target Version
Multi-document sync package:
- `decision_log` at `v0.11`
- `master_instruction` at `v0.7`
- `experiment_charter_stage_a` at `v0.8`
- `output_contract` at `v0.5`
- `project_brief` at `v0.9`

Control / history layer:
- `patch_011` repaired as committed baseline at `e30164588f005064a072bf222419926ff8eb49aa`
- `decision_008` added as current working snapshot

## Base Commit SHA
`e30164588f005064a072bf222419926ff8eb49aa`

## Base Approved Contour Snapshot ID
`approved_contour_2026-03-15_patch_011_handoff_contract_rendering_hardening`

## Why This Patch Exists
Current research contour can already produce run artifacts, but it still lacks a governed search layer.

This patch introduces Search Operating System rules so each run becomes:
- decision-driven;
- coverage-aware;
- explicit about completeness and blind spots;
- explicit about stopping and next lane.

## Exact Changes
1. Add `decision_008` to the approved decision layer.
2. Update `master_instruction` with Search Operating System rules for Manus search behavior.
3. Update `experiment_charter_stage_a` so Stage A evaluates search governance and completeness reporting.
4. Update `output_contract` so each run includes nested `search_governance` in `run_manifest.json` and Search Governance sections in `run_synthesis_ru.md`.
5. Update `project_brief` so the research machine is explicitly uncertainty-reducing and coverage-aware.
6. Repair the stale committed/working snapshot pointers before introducing the new working contour.

## Explicit Non-Changes
- Do not change `spec_governance.md` unless a direct conflict is found.
- Do not change `vscode_codex_handoff_contract.md` unless a direct conflict is found.
- Do not change `test_set.md` unless run-level Search Operating System creates a direct inconsistency.
- Do not change `README_upload_to_projects.md` unless the active upload guidance becomes directly incomplete.
- Do not introduce Evidence and Classification System, pricing confidence model or research memory system.

## Cross-Doc Sync Required
- `docs/indexes/version_registry.md`
- `docs/indexes/change_log.md`
- `docs/indexes/current_handoff.md`
- `docs/indexes/approved_contour_history.md`
- `docs/history/approved_contours/approved_contour_2026-03-15_patch_011_handoff_contract_rendering_hardening.md`
- `docs/history/approved_contours/approved_contour_2026-03-15_decision_008.md`

## Risks
- If Search Operating System is added only to `output_contract`, Manus behavior remains under-specified.
- If committed pointers are not repaired first, Wave 1 grounding remains internally dishonest.
- If run reporting requires coverage and stopping explanations but the manifest does not require search-governance fields, the wave stays incomplete.

## Approval
Approved
