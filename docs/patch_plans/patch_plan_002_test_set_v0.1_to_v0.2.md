# Patch Plan

## Status
Draft

## Related Decision
decision_001

## Document
test_set

## Current Version
v0.1

## Target Version
v0.2

## Why This Patch Exists
Decision `decision_001` переводит модель сигнала из однослойной в многослойную.

Текущий `test_set_v0.1` больше не соответствует целевой архитектуре, потому что:
1. использует старую однослойную модель ожидаемого результата;
2. допускает `hold` как фактически отдельный класс, хотя в новой модели `hold` должен жить в `resolution_status`, а не в `signal_type`;
3. не различает semantic signal type, resolution state и evidence strength.

## Exact Changes
1. В section, где описывается expected output / expected class:
   - убрать однослойную схему ожиданий, если она выражена одним enum;
   - ввести многослойную схему expected result со следующими полями:
     - `signal_type`
     - `resolution_status`
     - `evidence_strength`

2. Во всех test cases:
   - заменить ожидание в виде одного класса на ожидание в виде трехполейной структуры;
   - сохранить исходный смысл кейсов, если он не противоречит новой модели.

3. В cases, где раньше использовался `reject` как класс:
   - перевести это в:
     - `signal_type = none`, если запись не содержит валидного сигнала;
     - `resolution_status = rejected`
   - `evidence_strength` задать по смыслу кейса.

4. В cases, где раньше фигурировал `hold` или допускался `hold`:
   - убрать `hold` из signal-type ожидания;
   - отражать `hold` только через:
     - `resolution_status = hold`

5. Для example 10 и любых аналогичных кейсов:
   - явно устранить допуск `hold` как отдельного класса;
   - переписать expected result в многослойной форме.

6. В section, где описаны допустимые expected values:
   - зафиксировать:
     - `signal_type`:
       - `confirmed_case`
       - `monetizable_pain_signal`
       - `technology_shift_signal`
       - `none`
     - `resolution_status`:
       - `accepted`
       - `rejected`
       - `hold`
     - `evidence_strength`:
       - `low`
       - `medium`
       - `high`

7. Если test set содержит текст, который описывает старую таксономию как единственный допустимый output:
   - заменить это на описание многослойной модели.

## Explicit Non-Changes
- Не менять сами тексты test inputs без необходимости.
- Не менять смысл кейсов, если он может быть сохранен при переходе к новой модели.
- Не добавлять новые кейсы автоматически в рамках этого patch plan.
- Не переписывать документ целиком.

## Cross-Doc Sync Required
- `output_contract_v0.1` -> должен быть синхронизирован с новой моделью.
- `decision_log_v0.2` -> должен зафиксировать решение и version bump.
- `master_instruction_v0.1` -> должен быть проверен на старую однослойную логику и старые class expectations.

## Risks
- Если test set будет обновлен без output contract, появится конфликт между expected evaluation schema и declared output schema.
- Если `none` не будет явно зафиксирован как допустимое значение `signal_type`, часть старых reject-cases останется семантически неоднозначной.

## Approval
Pending