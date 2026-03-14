# Patch Plan

## Status
Draft

## Related Decision
decision_001

## Document
master_instruction

## Current Version
v0.1

## Target Version
TBD after alignment check
Potential target: v0.2 if changes are required.

## Why This Patch Exists
master_instruction_v0.1 должен быть проверен на совместимость с decision_001.

Пока не доказано, что документ требует version bump, но есть высокий риск, что в нем могут быть зафиксированы:
1. старая однослойная модель сигнала;
2. старая логика, где eject трактуется как semantic class;
3. отсутствие явного различения между signal_type, esolution_status и evidence_strength;
4. day-bound artifact logic, конфликтующая с run-centric model.

## Exact Changes
1. Проверить, содержит ли master_instruction_v0.1 явное или неявное описание output/result model как одного класса.
   - Если да, заменить это на многослойную модель:
     - signal_type
     - esolution_status
     - evidence_strength

2. Проверить, фигурирует ли eject как semantic signal class.
   - Если да, убрать это и привести к модели:
     - signal_type = none
     - esolution_status = rejected

3. Проверить, фигурирует ли hold как класс или как неформальный побочный исход.
   - Если да, зафиксировать, что hold допустим только как:
     - esolution_status = hold

4. Проверить, содержит ли инструкция day-bound naming или day-bound artifact logic как обязательную primary model.
   - Если да, заменить это на run-centric artifact logic:
     - un = unit of execution
     - un = unit of account
     - un = source of truth artifact unit
     - day = only date / grouping / navigation dimension

5. Проверить, есть ли в инструкции ожидание, что модель должна вернуть один итоговый class label.
   - Если да, привести это к многослойному expected output model.

6. Если в инструкции таких конфликтов нет:
   - version bump не делать;
   - зафиксировать, что master_instruction_v0.1 remains aligned.

## Explicit Non-Changes
- Не поднимать версию автоматически без найденного конфликта.
- Не переписывать весь документ целиком.
- Не добавлять новые workflow fields типа hold_reason и 
ext_action без отдельного решения.

## Cross-Doc Sync Required
- decision_log_v0.3
- output_contract_v0.2
- 	est_set_v0.2

## Risks
- Если master_instruction останется со старой логикой, execution layer может продолжать работать по old model, even if contract and test set are updated.
- Если version bump сделать без реального конфликта, появится лишняя версия без смысловой нагрузки.

## Approval
Pending
