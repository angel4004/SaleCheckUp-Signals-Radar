# Decision Draft

## Status
Approved

## Decision ID
decision_005

## Title
Stable approved paths and commit-grounded runs

## Scope
Миграция active approved contour с versioned filenames на stable semantic paths и фиксация run grounding через commit SHA.

## Problem
Active approved contour частично идентифицируется через version suffix в filenames.

Это создает ambiguity между:
- document identity;
- revision history;
- run-level grounding;
- manual execution context.

В результате active path начинает неявно нести revision semantics, а runs и handoff artifacts могут ссылаться на разные наборы versioned filenames.

## Decision
Принято следующее operating rule.

1. Active approved docs в `docs/approved/` используют stable semantic filenames без version suffix.
2. Canonical identity active approved doc определяется через stable path.
3. `current_version` для active approved contour фиксируется в `docs/indexes/version_registry.md`.
4. Revision history фиксируется через Git и `docs/indexes/change_log.md`, а не через version suffix в active path.
5. Version suffix сохраняется для superseded docs в `docs/outdated/` и для numbered handoff artifacts.
6. Каждый run должен быть grounded через:
   - `approved_contour_commit_sha`
   - `approved_contour_paths`
7. Manual list of versioned approved filenames не является canonical run grounding.

## Rationale
Эта модель разделяет:
- stable identity текущего approved doc;
- историю его ревизий;
- traceability конкретного run.

Она нужна, чтобы current contour не зависел от filename-versioning, а run truth мог быть привязан к конкретному snapshot через commit.

## Consequences
### Governance consequences
- `spec_governance` должен зафиксировать stable approved path policy.
- `decision_log` должен зафиксировать новый approved decision.
- `master_instruction`, `project_brief`, `experiment_charter_stage_a` и `README_upload_to_projects` должны перестать перечислять current approved contour через versioned active filenames.

### Documentation consequences
- `spec_governance`: v0.3 -> v0.4
- `decision_log`: v0.7 -> v0.8
- `master_instruction`: v0.4 -> v0.5
- `project_brief`: v0.5 -> v0.6
- `experiment_charter_stage_a`: v0.5 -> v0.6
- `README_upload_to_projects`: v0.2 -> v0.3
- `output_contract`: v0.2 -> v0.3
- `test_set`: version unchanged, stable path migration only

### Run consequences
- `output_contract` должен потребовать commit SHA и stable approved path list в `run_manifest.json`.

## Affected Documents
- docs/approved/spec_governance.md
- docs/approved/decision_log.md
- docs/approved/master_instruction.md
- docs/approved/project_brief.md
- docs/approved/experiment_charter_stage_a.md
- docs/approved/README_upload_to_projects.md
- docs/approved/output_contract.md
- docs/approved/test_set.md
- docs/indexes/version_registry.md
- docs/indexes/change_log.md
- docs/indexes/current_handoff.md

## Version Impact
- spec_governance: v0.3 -> v0.4
- decision_log: v0.7 -> v0.8
- master_instruction: v0.4 -> v0.5
- project_brief: v0.5 -> v0.6
- experiment_charter_stage_a: v0.5 -> v0.6
- README_upload_to_projects: v0.2 -> v0.3
- output_contract: v0.2 -> v0.3
- test_set: v0.2 -> v0.2, stable path only

## Boundary
Это решение:
- меняет naming model active approved contour;
- меняет run grounding model;
- не перестраивает archival model в `docs/outdated/`;
- не отменяет numbered handoff artifacts;
- не меняет semantic signal model.

## Approval
Approved
