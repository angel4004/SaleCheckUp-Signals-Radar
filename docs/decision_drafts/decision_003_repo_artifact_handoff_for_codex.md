# Decision Draft

## Status
Approved

## Decision ID
decision_003

## Title
Repo artifact handoff contour for ChatGPT Project and VS Code/Codex

## Scope
Фиксация нового operating rule для spec/governance changes:
- ChatGPT Project остается thinking/spec layer;
- repo markdown artifact становится canonical handoff layer;
- VS Code/Codex используется как execution layer для изменений в repo.

## Problem
Текущий approved contour уже фиксирует Git как source of truth для approved docs, но не задает явный operational handoff contour между:
- обсуждением и планированием в ChatGPT Project;
- repo-артефактами с versioned scope;
- исполнением задачи в VS Code/Codex.

Из-за этого ручной перенос длинных сообщений между окнами может стать основным способом работы, хотя такой способ:
- плохо версионируется;
- не фиксирует boundary изменения;
- не делает document status явным;
- не оставляет нормальный trace для sync-impact.

## Decision
Принимается следующее метаправило:

1. Handoff между ChatGPT Project и VS Code/Codex должен идти через versioned repo artifact, а не через ручной перенос длинных chat messages.
2. Canonical flow фиксируется так:
   - ChatGPT Project = thinking / spec layer;
   - repo markdown artifact = handoff layer;
   - VS Code/Codex = execution layer.
3. Для нетривиальной задачи change scope должен быть зафиксирован в явном repo artifact до исполнения.
4. Artifact должен явно фиксировать:
   - что менять;
   - что не менять;
   - какие документы затронуты;
   - какой у документов статус: `approved`, `outdated`, `draft`;
   - какой есть sync-impact на смежные документы.
5. Ручной copy-paste длинных инструкций между окнами не считается canonical workflow.
6. Ручное создание, перемещение и versioning project files через shell допустимо только как fallback, а не как стандартный способ работы.

## Rationale
Это решение не заменяет approved docs и не меняет source-of-truth model.

Оно добавляет недостающий execution interface между discussion layer и repo execution, чтобы:
- change scope был versioned;
- sync-impact не терялся;
- approved docs не подменялись длинной историей чата;
- работа в VS Code/Codex опиралась на repo artifacts, а не на ручную пересборку контекста.

## Consequences
### Governance consequences
- `master_instruction` должен получить явное handoff rule.
- `spec_governance` должен получить canonical section про handoff artifacts.
- `decision_log` должен зафиксировать новое approved decision.
- `current_handoff.md` может использоваться как optional single-entry artifact for active task.

### Documentation consequences
Должны быть синхронизированы:
- `master_instruction_v0.2` -> `v0.3`
- `spec_governance_v0.1` -> `v0.2`
- `decision_log_v0.4` -> `v0.5`
- `version_registry`
- `change_log`

Должны быть отдельно проверены на residual sync-impact:
- `project_brief_v0.3`
- `experiment_charter_stage_a_v0.3`
- `README_upload_to_projects.md`

## Affected Documents
- docs/approved/master_instruction_v0.2.md
- docs/approved/spec_governance_v0.1.md
- docs/approved/decision_log_v0.4.md
- docs/indexes/version_registry.md
- docs/indexes/change_log.md
- docs/indexes/current_handoff.md

## Version Impact
- master_instruction: v0.2 -> v0.3
- spec_governance: v0.1 -> v0.2
- decision_log: v0.4 -> v0.5

## Boundary
Это решение:
- вводит canonical handoff contour для repo work;
- не заменяет existing research execution model в `output_contract`, `test_set` и `experiment_charter_stage_a`;
- не переписывает автоматически все approved docs, где есть pre-existing stale references;
- не отменяет requirement на явный governance sync.

## Approval
Approved
