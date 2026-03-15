# Decision Draft

## Status
Approved

## Decision ID
decision_007

## Title
Canonical approved handoff contract for repo work between GPT Project and VS Code/Codex

## Scope
Введение отдельного approved handoff contract doc и точечная синхронизация live governance contour.

## Problem
Правила handoff для repo work уже существуют, но сейчас они распределены между:
- `master_instruction`;
- `spec_governance`;
- decision layer;
- рабочей памятью и устными соглашениями.

Из-за этого отсутствует один canonical approved doc, который задает standard operational interface между reasoning layer и execution layer.

Это создает:
- drift между обсуждением и исполнением;
- менее воспроизводимый handoff;
- более слабую auditability completeness;
- ambiguity вокруг default vs exception для short handoff.

## Decision
Принято следующее operating rule.

1. `docs/approved/vscode_codex_handoff_contract.md` становится canonical approved handoff interface для repo work между `GPT Project` и `VS Code/Codex`.
2. Repo work по умолчанию идет через этот handoff contract.
3. `full_handoff` является default mode.
4. `short_handoff` допустим только для clearly mechanical local edits при выполнении всех contract conditions.
5. `docs/patch_plans/`, `docs/decision_drafts/` и `docs/indexes/current_handoff.md` остаются versioned carriers / instantiations of the contract, а не его определением.

## Rationale
Эта модель:
- не создает новый competing workflow;
- собирает уже существующие правила в один approved interface;
- делает default rule и exception rule auditably explicit;
- уменьшает зависимость handoff от устных договоренностей и chat memory.

## Consequences
### Governance consequences
- `master_instruction` должен ссылаться на contract как на canonical format.
- `spec_governance` должен считать contract required operational interface между reasoning layer и execution layer.
- `decision_log` должен зафиксировать default contract rule и short-handoff exception.

### Documentation consequences
- `vscode_codex_handoff_contract`: new `v0.1`
- `master_instruction`: `v0.5 -> v0.6`
- `spec_governance`: `v0.5 -> v0.6`
- `decision_log`: `v0.9 -> v0.10`
- `project_brief`: `v0.7 -> v0.8`
- `README_upload_to_projects`: `v0.4 -> v0.5`
- `experiment_charter_stage_a`: `v0.6 -> v0.7`

### Control / history consequences
- stale `decision_006` commit-pointer state must be repaired;
- `decision_006` becomes the actual committed contour at `33fa8ecbc066025bbdbc2b6e1b94a9fb50b817ea`;
- `decision_007` becomes the new working snapshot for this wave.

## Affected Documents
- docs/approved/vscode_codex_handoff_contract.md
- docs/approved/master_instruction.md
- docs/approved/spec_governance.md
- docs/approved/decision_log.md
- docs/approved/project_brief.md
- docs/approved/README_upload_to_projects.md
- docs/approved/experiment_charter_stage_a.md
- docs/indexes/version_registry.md
- docs/indexes/change_log.md
- docs/indexes/current_handoff.md
- docs/indexes/approved_contour_history.md
- docs/history/approved_contours/approved_contour_2026-03-15_decision_006.md
- docs/history/approved_contours/approved_contour_2026-03-15_decision_007.md

## Version Impact
- vscode_codex_handoff_contract: new `v0.1`
- master_instruction: `v0.5 -> v0.6`
- spec_governance: `v0.5 -> v0.6`
- decision_log: `v0.9 -> v0.10`
- project_brief: `v0.7 -> v0.8`
- README_upload_to_projects: `v0.4 -> v0.5`
- experiment_charter_stage_a: `v0.6 -> v0.7`

## History / Snapshot Impact
- current_snapshot_id: `approved_contour_2026-03-15_decision_007`
- superseded_snapshot_ids: `approved_contour_2026-03-15_decision_006`
- recovery_model_change: no
- historical refs requiring normalization: live handoff-related docs and current contour lists

## Boundary
Это решение:
- вводит canonical approved handoff contract;
- не меняет numbering/id-based artifacts;
- не меняет signal taxonomy, evidence model, run logic или search rules;
- не расширяет scope в broader research-system redesign.

## Approval
Approved
