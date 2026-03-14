# Current handoff

Status: draft

## Contour grounding
- Base `HEAD` commit SHA: `796229e179df6b3660e3d4f49cfd3146c629f86b`
- Workspace state at execution start: dirty working tree

## Task
- Migrate active approved contour from versioned filenames to stable approved paths and ground runs through stable paths plus full Git commit SHA.

## Source docs
- `docs/approved/spec_governance.md`
- `docs/approved/decision_log.md`
- `docs/approved/master_instruction.md`
- `docs/approved/project_brief.md`
- `docs/approved/experiment_charter_stage_a.md`
- `docs/approved/README_upload_to_projects.md`
- `docs/approved/output_contract.md`
- `docs/approved/test_set.md`
- `docs/indexes/version_registry.md`
- `docs/indexes/change_log.md`

## Change scope
### Change
- Release stable approved paths for the active contour and record new approved revisions where the policy/schema changed.
- Move superseded versioned approved files to `docs/outdated/` and keep archival filenames versioned.
- Update canonical `version_registry`, `change_log`, templates and run grounding policy.
- Require `run_manifest.json` to capture stable approved paths and base commit SHA.

### Do not change
- historical patch plans and decision drafts unrelated to this sync-pass
- archival naming model in `docs/outdated/`
- semantic classification model in `test_set`

## Sync impact
- All current approved contour lists and registry locations must stop depending on version suffix in active approved filenames.
- `output_contract` must carry commit-grounded run linkage.
- Live templates must stop teaching versioned active filenames as canonical identifiers.

## Document status
- approved: `spec_governance.md`, `project_brief.md`, `experiment_charter_stage_a.md`, `decision_log.md`, `master_instruction.md`, `output_contract.md`, `test_set.md`, `README_upload_to_projects.md`
- outdated: `spec_governance_v0.3`, `project_brief_v0.5`, `experiment_charter_stage_a_v0.5`, `decision_log_v0.7`, `master_instruction_v0.4`, `README_upload_to_projects_v0.2`, `output_contract_v0.2`
- draft: `docs/indexes/current_handoff.md`, `docs/patch_plans/patch_plan_008_stable_approved_paths_and_commit_grounding.md`, `docs/decision_drafts/decision_005_stable_approved_paths_and_commit_grounding.md`
