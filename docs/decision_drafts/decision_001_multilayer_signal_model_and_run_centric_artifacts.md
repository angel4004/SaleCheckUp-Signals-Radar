# Decision Draft

## Status
Draft

## Decision ID
decision_001

## Title
Multi-layer signal record and run-centric artifact model

## Scope
Разрешение двух системных противоречий:
1. конфликт вокруг hold;
2. конфликт между un как unit of account и daily_synthesis_ru.md как обязательным human-readable артефактом.

## Problem
Текущая модель записи сигнала смешивает в один слой разные смысловые оси:
- тип сигнала;
- состояние решения по записи;
- силу основания.

Из-за этого:
- hold появляется в 	est_set_v0.1 как допустимый исход;
- но не имеет корректного места в общей модели и output_contract_v0.1.

Параллельно текущая модель артефактов смешивает:
- un как единицу исполнения и учета;
- daily как способ человекочитаемого представления результата.

Из-за этого:
- declared unit of account = un;
- обязательный markdown-артефакт именован как day-level объект.

## Decision

### 1. Signal record becomes multi-layer
Запись сигнала должна быть представлена тремя независимыми полями:

#### signal_type
Что это по содержанию:
- confirmed_case
- monetizable_pain_signal
- 	echnology_shift_signal
- 
one

#### esolution_status
В каком состоянии находится запись после текущего прохода:
- ccepted
- ejected
- hold

#### evidence_strength
Насколько сильны основания:
- low
- medium
- high

### 2. hold is a valid resolution state
hold признается валидным состоянием записи.

hold используется только тогда, когда запись нельзя корректно закрыть в ccepted или ejected в рамках текущего прохода без потери качества решения.

hold не является:
- типом сигнала;
- финальным классом;
- корзиной сомнений.

hold является состоянием незавершенного корректного решения.

### 3. Artifact model remains run-centric
Система остается un-centric.

un сохраняется как:
- unit of execution;
- unit of account;
- unit of traceability;
- source of truth для артефактов результата.

day не вводится как отдельный обязательный artifact layer.

day используется только как:
- date attribute;
- navigation dimension;
- filter;
- grouping field;
- dashboard/read-model dimension.

### 4. Human-readable layer is not day-bound
Обязательное human-readable представление должно быть привязано к un или к другому объекту уровня source of truth, но не к day как обязательной единице документации.

## Rationale
Это решение разводит разные оси модели и устраняет смешение:
- semantic type;
- record resolution state;
- evidence strength.

Это решение также отделяет:
- source-of-truth execution/accounting layer;
- human-readable reading layer.

За счет этого система становится:
- более точной;
- масштабируемой;
- пригодной для follow-up loops;
- пригодной для versioned documentation without hidden overrides.

## Consequences

### Model consequences
- однослойная классификация становится outdated;
- eject больше не должен рассматриваться как semantic signal type;
- hold получает системное место в модели;
- day-level mandatory artifact model отвергается.

### Workflow consequences
Если hold сохраняется в системе, позже потребуется явно определить:
- hold_reason;
- 
ext_action;
- правило вывода записи из hold.

Это следствие фиксируется, но не вводится автоматически этим решением.

### Documentation consequences
Почти наверняка потребуется синхронизация:
- output_contract_v0.1
- 	est_set_v0.1
- decision_log_v0.2

Вероятно потребуется синхронизация:
- master_instruction_v0.1

Условно могут быть затронуты:
- project_brief_v0.2
- experiment_charter_stage_a_v0.2

Только если в них явно зафиксирована старая плоская модель или day-based artifact logic.

## Affected Documents
- project_brief_v0.2
- experiment_charter_stage_a_v0.2
- decision_log_v0.2
- master_instruction_v0.1
- output_contract_v0.1
- test_set_v0.1

## Version Impact
TBD after patch planning.

## Boundary
Это решение:
- фиксирует архитектурную модель;
- не обновляет approved docs автоматически;
- не переписывает test set автоматически;
- не определяет финальную contract schema автоматически;
- не создает скрытых обратносуместимых костылей.

## Approval
Pending
