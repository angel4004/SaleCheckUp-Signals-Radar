# VS Code/Codex Handoff Contract v0.1

## Назначение документа
Этот документ задает canonical approved operational interface для repo work между:
- `GPT Project` как reasoning / feedback / governance layer;
- `VS Code/Codex` как execution layer.

Документ не заменяет approved docs, decision layer или version/control layer.

Он фиксирует:
- по какому контракту repo work должен передаваться из reasoning layer в execution layer;
- какие секции handoff package обязательны;
- когда допустим `full_handoff`;
- когда допустим `short_handoff`;
- какой execution report должен быть возвращен по итогам работы.

## Role split

### GPT Project
`GPT Project` используется для:
- сбора и структурирования feedback;
- выявления contradictions;
- reasoning;
- формулирования решений;
- определения change scope;
- определения sync impact;
- подготовки handoff package.

`GPT Project` не является execution layer для repo changes.

### VS Code/Codex
`VS Code/Codex` используется для:
- исполнения repo work;
- document edits;
- version/control updates;
- lifecycle/status updates;
- sync затронутых файлов;
- возврата structured execution report.

`VS Code/Codex` не должен получать основной execution context через ручной перенос длинных chat messages.

## Default rule
Repo work между `GPT Project` и `VS Code/Codex` по умолчанию идет через этот handoff contract.

Это означает:
- reasoning layer формирует handoff package в repo-resident artifacts;
- execution layer исполняет задачу по этому package и approved docs;
- manual long-form chat transfer не является canonical interface для repo work.

## Handoff modes

### `full_handoff`
`full_handoff` является default mode для repo work.

`full_handoff` обязателен, если есть хотя бы один из факторов:
- change scope не является локальным и механическим;
- требуется wording choice или policy choice;
- создается новый approved doc;
- меняется version/control/history layer;
- затрагивается несколько документов;
- есть cross-doc sync;
- есть ambiguity в expected result.

### `short_handoff`
`short_handoff` является narrow exception.

`short_handoff` допустим только если одновременно выполнены все условия:
- scope локальный и механический;
- target files заранее известны;
- нет policy choice или wording-design choice;
- не создается новый approved doc;
- не меняется version/control/history layer;
- нет cross-doc sync beyond explicit `none`;
- expected result однозначен и не требует interpretation.

Если хотя бы одно условие не выполнено, требуется `full_handoff`.

## Required sections of a handoff package
Любой handoff package должен содержать следующие секции.

### `Contour Grounding`
Должно быть явно указано:
- `Base Approved Contour Snapshot ID`;
- `Base HEAD Commit SHA`;
- `Workspace State at Execution Start`, если это важно для исполнения.

### `Task`
Короткая формулировка того, что нужно сделать.

### `Source Docs`
Список approved docs и indexes, которые являются source of truth для этого handoff.

### `Change Scope`
Явное перечисление того, что нужно изменить.

### `Do Not Change`
Явное перечисление того, что не входит в scope.

### `Affected Docs / Files`
Явный список файлов, которые:
- изменяются;
- создаются;
- должны быть синхронизированы как version/control/history layer.

### `Document Status`
Явное перечисление статусов затронутых документов:
- `approved`
- `outdated`
- `draft`

### `Sync Impact`
Явное перечисление cross-doc и cross-layer impact.

### `Constraints / Assumptions`
Явное перечисление ограничений, default assumptions и boundary.

### `Expected Execution Report`
Явное требование к формату финального execution report.

## Interface invariants
Для любого handoff package обязательны следующие invariants:
- approved docs на stable paths остаются source of truth;
- execution не должен опираться на manual long-form chat transfer как primary interface;
- repo changes не должны исполняться напрямую в web chat;
- cross-doc sync не может происходить молча;
- handoff contract может инстанцироваться через один или несколько repo artifacts, но все required sections должны присутствовать;
- если change затрагивает version/control/history layer, это должно быть отражено явно;
- `short_handoff` не может использоваться для masking substantive change.

## Structured execution report
По итогам repo work execution layer должен вернуть structured execution report со следующими секциями:
- `Changed Files`
- `Created Files`
- `Unchanged Reviewed Files`
- `Version / Control Sync`
- `Sync Impact`
- `Unresolved Contradictions`
- `Completion Check`
- `Short Russian Implementation Summary`

## Full handoff template
```md
# Handoff Package

Status: draft
Mode: full_handoff

## Contour Grounding
- Base Approved Contour Snapshot ID:
- Base HEAD Commit SHA:
- Workspace State at Execution Start:

## Task
-

## Source Docs
- 

## Change Scope
- 

## Do Not Change
- 

## Affected Docs / Files
- 

## Document Status
- approved:
- outdated:
- draft:

## Sync Impact
- 

## Constraints / Assumptions
- 

## Expected Execution Report
- Changed Files
- Created Files
- Unchanged Reviewed Files
- Version / Control Sync
- Sync Impact
- Unresolved Contradictions
- Completion Check
- Short Russian Implementation Summary
```

## Short handoff template
```md
# Handoff Package

Status: draft
Mode: short_handoff

## Contour Grounding
- Base Approved Contour Snapshot ID:
- Base HEAD Commit SHA:

## Task
-

## Source Docs
- 

## Change Scope
- 

## Do Not Change
- none

## Affected Docs / Files
- 

## Document Status
- approved:
- outdated: none
- draft:

## Sync Impact
- none

## Constraints / Assumptions
- clearly mechanical local edit
- no version/control/history-layer change
- no policy or wording-design choice

## Expected Execution Report
- Changed Files
- Created Files
- Unchanged Reviewed Files
- Version / Control Sync
- Sync Impact
- Unresolved Contradictions
- Completion Check
- Short Russian Implementation Summary
```

## Связь с другими документами
Этот документ не заменяет:
- `docs/approved/spec_governance.md`
- `docs/approved/master_instruction.md`
- `docs/approved/decision_log.md`
- `docs/indexes/version_registry.md`
- `docs/indexes/change_log.md`

Он задает canonical handoff interface, по которому repo work передается из reasoning layer в execution layer.

## Approval
Approved
