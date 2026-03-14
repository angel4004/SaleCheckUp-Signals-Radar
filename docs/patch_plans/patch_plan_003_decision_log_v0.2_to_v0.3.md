# Patch Plan

## Status
Draft

## Related Decision
decision_001

## Document
decision_log

## Current Version
v0.2

## Target Version
v0.3

## Why This Patch Exists
Decision `decision_001` фиксирует два архитектурных изменения:
1. переход от однослойной модели сигнала к многослойной;
2. сохранение run-centric artifact model без обязательного day-level artifact layer.

Текущий `decision_log_v0.2` должен быть синхронизирован с этим решением, чтобы новая модель была зафиксирована в source-of-truth governance layer, а не существовала только как draft.

## Exact Changes
1. Добавить новую decision entry, которая явно фиксирует:
   - переход к многослойной модели signal record;
   - состав новой модели:
     - `signal_type`
     - `resolution_status`
     - `evidence_strength`

2. В этой же decision entry явно зафиксировать:
   - `hold` не является semantic class;
   - `hold` допустим только как `resolution_status = hold`

3. В этой же decision entry явно зафиксировать:
   - `reject` не должен жить в semantic signal-type layer;
   - смысл reject отражается через:
     - `signal_type = none`
     - `resolution_status = rejected`

4. Добавить отдельную фиксацию artifact model decision:
   - `run` сохраняется как unit of execution, unit of account, unit of traceability и source of truth для artifact layer;
   - `day` не вводится как mandatory artifact unit;
   - `day` допустим только как date / grouping / filter / navigation dimension

5. Если в `decision_log_v0.2` уже есть записи, которые неявно поддерживают старую однослойную модель или day-bound artifact naming:
   - не удалять их молча;
   - отметить, что они superseded или outdated в пределах новой версии decision log

6. В новой записи явно перечислить affected docs:
   - `output_contract`
   - `test_set`
   - `master_instruction` (conditional check)
   - `project_brief` (conditional check)
   - `experiment_charter_stage_a` (conditional check)

7. В decision entry зафиксировать, что follow-up specification later may define:
   - `hold_reason`
   - `next_action`
   - exit rule for hold-state records

8. Явно указать, что эти follow-up fields:
   - не вводятся автоматически этим решением;
   - требуют отдельного specification step

## Explicit Non-Changes
- Не переписывать весь decision log целиком.
- Не переписывать старые решения, если достаточно пометить их как superseded/outdated in effect.
- Не вводить новые contract fields прямо в decision log beyond architectural statement.

## Cross-Doc Sync Required
- `output_contract_v0.1` -> `v0.2`
- `test_set_v0.1` -> `v0.2`
- `master_instruction_v0.1` -> review for alignment
- `project_brief_v0.2` -> conditional review
- `experiment_charter_stage_a_v0.2` -> conditional review

## Risks
- Если decision log не будет обновлен, новая модель останется только в draft layer и patch plans, но не в approved governance layer.
- Если старые однослойные формулировки останутся без явного superseded-status, позже может возникнуть ambiguity about which model governs execution.

## Approval
Pending