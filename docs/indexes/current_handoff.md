# Current handoff

Status: draft
Mode: full_handoff

## Contour Grounding
- Base Approved Contour Snapshot ID: `approved_contour_2026-03-15_patch_011_handoff_contract_rendering_hardening`
- Current Working Snapshot ID: `approved_contour_2026-03-15_decision_008`
- Base HEAD Commit SHA: `e30164588f005064a072bf222419926ff8eb49aa`
- Workspace state at execution start: clean working tree

## Task
- Implement Wave 1 Search Operating System so research runs become decision-driven, coverage-aware and explicit about completeness, blind spots, stopping reason and next search lane.

## Source Docs
- @docs/approved/project_brief.md
- @docs/approved/experiment_charter_stage_a.md
- @docs/approved/decision_log.md
- @docs/approved/master_instruction.md
- @docs/approved/output_contract.md
- @docs/approved/spec_governance.md
- @docs/approved/vscode_codex_handoff_contract.md
- @docs/approved/test_set.md
- @docs/approved/README_upload_to_projects.md
- @docs/indexes/version_registry.md
- @docs/indexes/change_log.md
- @docs/indexes/current_handoff.md
- @docs/indexes/approved_contour_history.md

## Change Scope
- Repair stale control/history pointers so committed contour honestly becomes `approved_contour_2026-03-15_patch_011_handoff_contract_rendering_hardening` at `e30164588f005064a072bf222419926ff8eb49aa`.
- Add `decision_008` as project-level Search Operating System rule in the approved decision layer.
- Update `project_brief`, `experiment_charter_stage_a`, `master_instruction` and `output_contract` for decision-driven, coverage-aware search runs.
- Add nested `search_governance` requirements to `run_manifest.json`.
- Add Search Governance block requirements to `run_synthesis_ru.md`.
- Add working snapshot `approved_contour_2026-03-15_decision_008`.
- Update canonical `version_registry`, `change_log`, `approved_contour_history` and this handoff artifact.

## Do Not Change
- do not introduce Evidence and Classification System in this wave
- do not introduce core-vs-adjacent taxonomy changes in this wave
- do not introduce pricing confidence model, buyer map, denominator/prevalence model or full market segmentation model
- do not introduce research memory / cross-run memory system
- do not rewrite @docs/approved/spec_governance.md, @docs/approved/vscode_codex_handoff_contract.md, @docs/approved/test_set.md or @docs/approved/README_upload_to_projects.md unless a direct contradiction is found
- do not perform full contour-wide cleanup beyond what is required for internal consistency

## Affected Docs / Files
- @docs/approved/project_brief.md
- @docs/approved/experiment_charter_stage_a.md
- @docs/approved/decision_log.md
- @docs/approved/master_instruction.md
- @docs/approved/output_contract.md
- @docs/indexes/version_registry.md
- @docs/indexes/change_log.md
- @docs/indexes/current_handoff.md
- @docs/indexes/approved_contour_history.md
- @docs/decision_drafts/decision_008_search_operating_system.md
- @docs/patch_plans/patch_plan_012_search_operating_system.md
- @docs/history/approved_contours/approved_contour_2026-03-15_patch_011_handoff_contract_rendering_hardening.md
- @docs/history/approved_contours/approved_contour_2026-03-15_decision_008.md

## Document Status
- approved: @docs/approved/project_brief.md, @docs/approved/experiment_charter_stage_a.md, @docs/approved/decision_log.md, @docs/approved/master_instruction.md, @docs/approved/output_contract.md, @docs/approved/spec_governance.md, @docs/approved/vscode_codex_handoff_contract.md, @docs/approved/test_set.md, @docs/approved/README_upload_to_projects.md
- outdated: none
- draft: @docs/indexes/current_handoff.md, @docs/decision_drafts/decision_008_search_operating_system.md, @docs/patch_plans/patch_plan_012_search_operating_system.md, @docs/history/approved_contours/approved_contour_2026-03-15_decision_008.md

## Sync Impact
- `run_manifest.json` must expand from simple contour grounding to explicit search-governance layer.
- `run_synthesis_ru.md` must explain question, uncertainty, time window, geographies, source coverage, covered / uncovered areas, stopping reason and next lane.
- If review-only docs stay unchanged, the execution report must explain why no direct contradiction was found.
- Control/history pointers must distinguish committed `patch_011` from working `decision_008` honestly.

## Constraints / Assumptions
- Use current `main` workspace state as source of truth.
- Keep section headers and machine-facing field names in English.
- Keep human-facing explanatory wording in Russian.
- Keep `Source Docs` in `@file` format for executable IDE prompts.
- Treat this wave as a new decision-layer rule for research runs.
- Do not smooth over the pre-existing control/history inconsistency silently.

## Expected Execution Report
- Changed Files
- Created Files
- Unchanged Reviewed Files
- Version / Control Sync
- Sync Impact
- Unresolved Contradictions
- Completion Check
- Short Russian Implementation Summary
