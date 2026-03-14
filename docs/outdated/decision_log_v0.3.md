# Decision Log v0.3

## Назначение документа
Этот документ фиксирует уже принятые решения по проекту SaleCheckUp Signals Radar, чтобы не обсуждать их заново и не терять контекст между итерациями.

## Уже принятые решения
1. Сначала идем по **варианту A**, а не строим production contour сразу.
2. Для этапа A **VS Code не обязателен**.
3. Используем разделение на **spec loop** и **run loop**.
4. **ChatGPT Project** выступает как источник правды для спецификации.
5. **Manus** выступает как execution layer.
6. На выходе нужен двойной формат:
   - JSON layer;
   - human-readable layer.
7. Используем **3 типа сигналов**:
   - confirmed case;
   - monetizable pain signal;
   - technology shift signal.
8. Для шума используем **resolution_status = rejected**.  
   `reject` не считается отдельным semantic signal type.
9. Единица учета — **run**, а не день.
10. География поиска — глобальная, при отдельной фиксации российских и глобальных кейсов.
11. Поля структуры данных держим по следующему правилу:
   - машинные ключи и enums — на английском;
   - аналитические объяснения и human layer — на русском.
12. Результаты Manus не считаются автоматически новой истиной; они проходят через цикл разбора и обновления спецификации.
13. Важно понимать не только **за что платят**, но и **сколько платят**.
14. Субъект инициативы — **Илья Суворов через SaleCheckUp**, а не TravelLine как абстрактная компания.
15. Модель оценки записи является **многослойной**, а не однослойной.
16. Каждая запись должна интерпретироваться через:
   - `signal_type`
   - `resolution_status`
   - `evidence_strength`
17. `hold` сохраняется в системе, но только как `resolution_status = hold`, а не как semantic class.
18. `day` не является обязательной единицей документации для primary artifact layer.
19. Обязательный human-readable artifact должен быть привязан к **run**, а не к **day**.

## Новая запись решения v0.3

### Decision ID
`decision_001`

### Title
Multi-layer signal record and run-centric artifact model

### Status
Approved

### Date
2026-03-14

### Problem
В проекте были выявлены два системных противоречия:

1. Модель сигнала была фактически однослойной и смешивала:
   - semantic type;
   - resolution state;
   - evidence quality.

   Это проявилось в конфликте вокруг `hold`:  
   `hold` использовался в test set как допустимый исход, но не имел корректного места в общей модели и output contract.

2. Artifact model смешивала:
   - `run` как unit of execution and account;
   - `day` как обязательную единицу human-readable documentation.

   Это проявилось в конфликте между declared unit of account = `run` и обязательным артефактом `daily_synthesis_ru.md`.

### Decision
Принято решение перейти к многослойной модели signal record и сохранить run-centric artifact model.

#### 1. Signal record becomes multi-layer
Каждая рассмотренная запись должна интерпретироваться через три независимых слоя.

##### `signal_type`
- `confirmed_case`
- `monetizable_pain_signal`
- `technology_shift_signal`
- `none`

##### `resolution_status`
- `accepted`
- `rejected`
- `hold`

##### `evidence_strength`
- `low`
- `medium`
- `high`

#### 2. `hold` remains in the system
`hold` признается валидным состоянием записи.

`hold`:
- не является semantic class;
- не является финальным типом сигнала;
- не является корзиной сомнений.

`hold` означает, что запись нельзя корректно закрыть в `accepted` или `rejected` в рамках текущего прохода без потери качества решения.

#### 3. `reject` leaves the semantic layer
`reject` больше не трактуется как semantic signal type.

Смысл reject выражается через:
- `signal_type = none`
- `resolution_status = rejected`

#### 4. Artifact model remains run-centric
Система сохраняет `run` как:
- unit of execution;
- unit of account;
- unit of traceability;
- source of truth для artifact layer.

`day` не вводится как mandatory artifact unit.

`day` допустим только как:
- date attribute;
- grouping field;
- filter;
- navigation dimension;
- read-model dimension.

#### 5. Human-readable artifact is run-bound
Обязательный human-readable artifact должен быть привязан к `run`, а не к `day` как обязательной единице документации.

### Rationale
Это решение устраняет смешение разных осей модели и делает систему пригодной для:
- корректной классификации;
- работы с пограничными случаями;
- явного представления uncertainty;
- versioned documentation without hidden overrides;
- follow-up loops по записям, которые временно находятся в `hold`.

### Consequences

#### Model consequences
- однослойная модель сигнала становится outdated;
- `hold` получает корректное место в системе;
- `reject` уходит из semantic layer;
- model evaluation становится многослойной.

#### Artifact consequences
- day-bound mandatory artifact model отвергается;
- human-readable layer становится run-bound;
- artifact package должен явно поддерживать `hold`.

#### Documentation consequences
Должны быть синхронизированы:
- `output_contract` → `v0.2`
- `test_set` → `v0.2`

Должен быть выполнен governance sync:
- `decision_log` → `v0.3`

Должна быть выполнена alignment check:
- `master_instruction_v0.1`

Conditional review:
- `project_brief_v0.2`
- `experiment_charter_stage_a_v0.2`

### Follow-up implications
Позднее может потребоваться отдельная спецификация для:
- `hold_reason`
- `next_action`
- explicit exit rule for hold-state records

Эти поля и правила не вводятся автоматически данным решением и требуют отдельного specification step.

### Superseded / outdated logic
Этим решением superseded становятся любые формулировки, в которых:
- сигнал описывается одним итоговым class label;
- `reject` трактуется как semantic class;
- `hold` трактуется как semantic class;
- `day` трактуется как mandatory artifact unit для primary documentation layer.

### Affected documents
- `output_contract_v0.1`
- `test_set_v0.1`
- `decision_log_v0.2`
- `master_instruction_v0.1` (alignment check)
- `project_brief_v0.2` (conditional review)
- `experiment_charter_stage_a_v0.2` (conditional review)

### Approval
Approved

## Что считаем шумом
Шумом считаются материалы, где отсутствует связка:
**payer → JTBD → outcome → money-link**

Типичные шумовые материалы:
- AI-news;
- product launch;
- feature release;
- vague trend article;
- vague marketing page;
- обещание без клиента и результата.

## Что считаем ценным сигналом
Материал считается ценным, если он помогает понять:
- за что платят;
- сколько платят;
- какую работу нанимают сделать;
- какой результат получают;
- насколько результат близок к деньгам;
- можно ли достичь того же результата новой технологией лучше.

## Операционная модель

### Spec loop
Живет в ChatGPT Project.

Там происходят:
- мышление;
- формализация;
- фиксация решений;
- версия артефактов;
- обновление документов после run'ов.

### Run loop
Живет в Manus.

Там происходят:
- исполнение зафиксированной версии инструкции;
- поиск;
- сбор материалов;
- нормализация;
- определение:
  - `signal_type`
  - `resolution_status`
  - `evidence_strength`
- генерация артефактов run'а.

### Рабочая петля
1. Формализуем текущую версию в ChatGPT Project.
2. Передаем утвержденную версию в Manus.
3. Выполняем run.
4. Разбираем output.
5. Возвращаем обратную связь в спецификацию.
6. Обновляем документы до следующей версии.
7. Запускаем следующий run по новой версии.

## Текущий следующий шаг
1. Зафиксировать `decision_log_v0.3` как approved governance layer.
2. Выполнить alignment check для `master_instruction_v0.1`.
3. Выполнить conditional review:
   - `project_brief_v0.2`
   - `experiment_charter_stage_a_v0.2`
4. После этого перейти к следующему run по уже синхронизированному набору документов.