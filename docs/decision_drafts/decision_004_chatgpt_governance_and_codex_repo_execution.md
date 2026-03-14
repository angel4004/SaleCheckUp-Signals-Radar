# Decision Draft

## Status
Approved

## Decision ID
decision_004

## Title
ChatGPT Project as governance layer and VS Code/Codex as exclusive repo execution layer

## Scope
Фиксация boundary между:
- `ChatGPT Project` как thinking / feedback / governance layer;
- `Manus` как research execution layer;
- `VS Code/Codex` как implementation / repo execution layer.

## Problem
Текущий contour уже фиксирует artifact-based handoff и boundary между Manus и VS Code/Codex, но не формулирует до конца одно важное operating rule:
- ChatGPT Project используется для feedback, contradictions, reasoning и structuring;
- все изменения repo должны исполняться только в VS Code/Codex;
- web chat не должен быть execution surface для repo changes.

Из-за этого сохраняется риск, что:
- web chat будет восприниматься как место прямого исполнения repo changes;
- `ChatGPT Project` и `VS Code/Codex` будут смешиваться как две interchangeable execution surfaces;
- version/control updates будут выпадать из scope как "неосновные" изменения.

## Decision
Принято следующее operating rule.

1. `ChatGPT Project` является thinking / feedback / governance layer для проекта.
2. В `ChatGPT Project` должны происходить:
   - сбор и структурирование feedback;
   - выявление противоречий;
   - reasoning;
   - формулирование решений;
   - определение change scope;
   - определение sync impact.
3. `VS Code/Codex` является implementation / repo execution layer.
4. Все repo changes должны исполняться через `VS Code/Codex`.
5. Это включает:
   - document edits;
   - version registry;
   - change log;
   - lifecycle/status updates;
   - other logically affected files.
6. Repo changes не должны исполняться напрямую в web chat.

## Rationale
Это решение не отменяет предыдущий artifact-based handoff contour, а замыкает его.

Оно нужно, чтобы:
- discussion surface не подменялась execution surface;
- repo changes не выпадали из governance cycle;
- document edits и control-layer sync не расщеплялись между chat reasoning и repo implementation;
- boundary между `ChatGPT Project`, `Manus` и `VS Code/Codex` была выражена симметрично.

## Consequences
### Governance consequences
- `spec_governance` должен явно фиксировать `VS Code/Codex` как repo execution layer.
- `master_instruction` должен быть приведен к той же формулировке boundary.
- `decision_log` должен зафиксировать новый approved decision.

### Documentation consequences
Должны быть синхронизированы:
- `master_instruction_v0.3` -> `v0.4`
- `spec_governance_v0.2` -> `v0.3`
- `decision_log_v0.6` -> `v0.7`

Вероятно должны быть синхронизированы как support docs:
- `project_brief_v0.4` -> `v0.5`
- `experiment_charter_stage_a_v0.4` -> `v0.5`
- `README_upload_to_projects_v0.1` -> `v0.2`

## Affected Documents
- docs/approved/master_instruction_v0.3.md
- docs/approved/spec_governance_v0.2.md
- docs/approved/decision_log_v0.6.md
- docs/approved/project_brief_v0.4.md
- docs/approved/experiment_charter_stage_a_v0.4.md
- docs/approved/README_upload_to_projects_v0.1.md
- docs/indexes/version_registry.md
- docs/indexes/change_log.md

## Version Impact
- master_instruction: v0.3 -> v0.4
- spec_governance: v0.2 -> v0.3
- decision_log: v0.6 -> v0.7
- project_brief: v0.4 -> v0.5
- experiment_charter_stage_a: v0.4 -> v0.5
- README_upload_to_projects: v0.1 -> v0.2

## Boundary
Это решение:
- не меняет research logic в `Manus`;
- не меняет output schema;
- не меняет semantic model;
- не отменяет artifact-based handoff, а уточняет execution boundary.

## Approval
Approved
