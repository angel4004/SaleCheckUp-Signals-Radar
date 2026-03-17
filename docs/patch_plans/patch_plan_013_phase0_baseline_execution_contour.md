# Patch Plan

## Status
Draft

## Related Decision
decision_009

## Document Path
`docs/drafts/phase0_baseline_execution_contour/`

## Current Version
Current approved contour remains:
- snapshot `approved_contour_2026-03-15_decision_008`
- committed SHA `5fc8f3201f07ab210caab949584416090a60bfb5`

There is no repo-resident `Phase 0 baseline execution contour` package yet.

## Target Version
Repo contains a documentation-first pre-cutover package for `Phase 0 baseline execution contour`, while the current approved contour remains unchanged and active.

## Base Commit SHA
`afcd409a74dccbed97a95ea065fdeaddba6cff9c`

## Base Approved Contour Snapshot ID
`approved_contour_2026-03-15_decision_008`

## Why This Patch Exists
Нужен minimal baseline execution package, который можно обсуждать, тестировать и later cut over without prematurely rewriting the active approved contour.

## Exact Changes
1. Create `docs/drafts/phase0_baseline_execution_contour/` with architecture, contract, flow, orchestration, boundary, parity, cutover and secret-policy docs.
2. Add minimal bundle templates for:
   - `run_input_package`
   - `run_state`
   - `run_manifest`
   - `evidence_index`
   - `candidate_signals`
   - `run_synthesis_ru`
   - `project_update_block_ru`
3. Add root hygiene files:
   - `.gitignore`
   - `env.example`
4. Add repo-resident governance carriers:
   - `docs/decision_drafts/decision_009_phase0_baseline_execution_contour.md`
   - `docs/patch_plans/patch_plan_013_phase0_baseline_execution_contour.md`
5. Update `docs/indexes/current_handoff.md` so it explicitly preserves:
   - current approved contour remains active;
   - `phase0_baseline_execution_contour` is pre-cutover draft only;
   - no active contour replacement is claimed.

## Explicit Non-Changes
- Do not change any file in `docs/approved/`.
- Do not change `docs/indexes/version_registry.md`.
- Do not change `docs/indexes/change_log.md`.
- Do not change `docs/indexes/approved_contour_history.md`.
- Do not add runtime code or a new production-like folder.
- Do not simulate cutover from `Manus` to `OpenRouter`.

## Cross-Doc Sync Required
- `docs/indexes/current_handoff.md`
- `.gitignore`
- `env.example`
- new draft package docs and templates

## Risks
- If the package wording implies active replacement, governance drift will appear immediately.
- If contradictions with the current approved contour are not listed explicitly, future cutover scope will become ambiguous.
- If candidate typing looks final rather than provisional, `Phase 0` will overclaim validator maturity.

## Approval
Pending
