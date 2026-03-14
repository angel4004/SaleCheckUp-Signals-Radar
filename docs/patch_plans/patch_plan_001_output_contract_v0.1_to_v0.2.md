# Patch Plan

## Status
Draft

## Related Decision
decision_001

## Document
output_contract

## Current Version
v0.1

## Target Version
v0.2

## Why This Patch Exists
Decision decision_001 переводит модель сигнала из однослойной в многослойную и сохран€ет run-centric artifact model.

“екущий output_contract_v0.1 больше не соответствует целевой архитектуре по двум причинам:
1. не различает signal_type, esolution_status и evidence_strength;
2. содержит конфликт между un как unit of account и daily-bound human-readable artifact naming.

## Exact Changes
1. ¬ section, где описываетс€ classification/result schema:
   - убрать однослойное представление результата как одного класса;
   - ввести многослойную структуру записи с пол€ми:
     - signal_type
     - esolution_status
     - evidence_strength

2. ¬ allowed values дл€ signal_type:
   - зафиксировать:
     - confirmed_case
     - monetizable_pain_signal
     - 	echnology_shift_signal
     - 
one

3. ¬ allowed values дл€ esolution_status:
   - зафиксировать:
     - ccepted
     - ejected
     - hold

4. ¬ allowed values дл€ evidence_strength:
   - зафиксировать:
     - low
     - medium
     - high

5. ¬ section, где описываетс€ human-readable artifact:
   - убрать day-bound naming как об€зательный первичный артефакт;
   - зафиксировать, что об€зательный human-readable artifact прив€зан к un или другому source-of-truth object run-level сло€;
   - day оставить только как navigation / filtering / grouping dimension, но не как mandatory artifact unit.

6. ≈сли в контракте есть упоминание eject как semantic class:
   - убрать его из semantic classification layer;
   - отразить его смысл через esolution_status = rejected.

7. ≈сли в контракте есть упоминание hold как класса:
   - не вводить его в signal_type;
   - отразить его только через esolution_status = hold.

## Explicit Non-Changes
- Ќе мен€ть другие части output contract, не св€занные с classification schema и artifact model.
- Ќе добавл€ть автоматически hold_reason и 
ext_action в v0.2, если это не будет отдельно согласовано.
- Ќе переписывать весь документ целиком.

## Cross-Doc Sync Required
- 	est_set_v0.1 -> должен быть синхронизирован с новой многослойной моделью.
- decision_log_v0.2 -> должен зафиксировать архитектурное решение.
- master_instruction_v0.1 -> должен быть проверен на старую однослойную логику.
- ¬озможно project_brief_v0.2 и experiment_charter_stage_a_v0.2, если там есть стара€ модель.

## Risks
- ≈сли обновить только output_contract, а 	est_set и master_instruction оставить старыми, по€витс€ новый cross-doc conflict.
- ≈сли не зафиксировать run-level artifact logic €вно, day/run напр€жение сохранитс€ под новым именем.

## Approval
Pending
