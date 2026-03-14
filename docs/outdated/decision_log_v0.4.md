# Decision Log v0.4

## Назначение документа
Этот документ фиксирует уже принятые решения по проекту SaleCheckUp Signals Radar, чтобы не обсуждать их заново и не терять контекст между итерациями.

## Уже принятые решения
1. Сначала идем по **варианту A**, а не строим production contour сразу.
2. Для этапа A **VS Code не обязателен**.
3. Используем разделение на **spec loop** и **run loop**.
4. **Git** выступает как source of truth для approved documentation и version history.
5. **ChatGPT Project** выступает как spec development environment.
6. **Manus** выступает как execution layer.
7. На выходе нужен двойной формат:
   - JSON layer;
   - human-readable layer.
8. Используем **3 semantic типа сигналов**:
   - confirmed case;
   - monetizable pain signal;
   - technology shift signal.
9. Для шума используем **resolution_status = rejected**.  
   `reject` не считается отдельным semantic signal type.
10. Единица учета — **run**, а не день.
11. География поиска — глобальная, при отдельной фиксации российских и глобальных кейсов.
12. Поля структуры данных держим по следующему правилу:
   - машинные ключи и enums — на английском;
   - аналитические объяснения и human layer — на русском.
13. Результаты Manus не считаются автоматически новой истиной; они проходят через цикл разбора и обновления спецификации.
14. Важно понимать не только **за что платят**, но и **сколько платят**.
15. Субъект инициативы — **Илья Суворов через SaleCheckUp**, а не TravelLine как абстрактная компания.
16. Модель оценки записи является **многослойной**, а не однослойной.
17. Каждая запись должна интерпретироваться через:
   - `signal_type`
   - `resolution_status`
   - `evidence_strength`
18. `hold` сохраняется в системе, но только как `resolution_status = hold`, а не как semantic class.
19. `day` не является обязательной единицей документации для primary artifact layer.
20. Обязательный human-readable artifact должен быть привязан к **run**, а не к **day**.
21. Новая формулировка или решение не считаются действующей спецификацией только потому, что они обсуждены в ChatGPT Project.
22. Изменение вступает в силу только после фиксации новых versioned documents в Git и обновления version registry / change log.

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

## Новая запись решения v0.4

### Decision ID
`decision_002`

### Title
Governance model for specification, documentation and execution

### Status
Approved

### Date
2026-03-14

### Problem
В проекте сложилось governance-напряжение между фактическим процессом работы и ранее зафиксированной формулировкой source of truth.

С одной стороны:
- спецификация обсуждается, проектируется и уточняется в ChatGPT Project;
- версии документов выпускаются, хранятся и обновляются в Git;
- Manus должен исполнять только актуальные approved docs.

С другой стороны, в предыдущем decision log сохранялась формулировка, что ChatGPT Project выступает как источник правды для спецификации.

Это создавало риск расщепления между:
- discussion layer;
- documentation layer;
- execution layer.

### Decision
Принята следующая governance-модель:

#### 1. Git
Git является:
- source of truth для approved documentation;
- source of truth для version history;
- местом хранения approved docs, outdated docs, drafts, decision drafts, patch plans, version registry и change log.

#### 2. ChatGPT Project
ChatGPT Project является:
- spec development environment;
- местом, где происходят:
  - обсуждение;
  - выявление противоречий;
  - decision drafting;
  - patch planning;
  - review loop;
  - разбор результатов run.

ChatGPT Project не является финальным source of truth для approved documentation.

#### 3. Manus
Manus является:
- execution layer;
- системой, которая должна работать только по approved documents, зафиксированным в Git.

### Rule of effect
Изменение считается вступившим в силу только если:
1. решение согласовано;
2. изменение отражено в versioned documents;
3. новая версия документа зафиксирована в Git;
4. version registry и change log обновлены;
5. предыдущая approved-версия переведена в outdated, если это требуется.

До этого момента изменение считается draft/discussion result, но не approved source of truth.

### Consequences
1. Формулировка `ChatGPT Project = source of truth for specification` считается superseded.
2. Фактический operating model проекта фиксируется как:
   - Git = source of truth for approved documentation
   - ChatGPT Project = spec development environment
   - Manus = execution layer using approved docs from Git
3. Новые изменения спецификации должны проходить через explicit sync step между discussion layer и documentation layer.

### Affected documents
- `decision_log_v0.3`
- `project_brief_v0.2`

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
Живет в ChatGPT Project как в spec development environment.

Там происходят:
- мышление;
- формализация;
- фиксация противоречий;
- подготовка решений;
- версия артефактов до апрува;
- обновление документов после run'ов.

### Documentation layer
Живет в Git.

Там происходят:
- хранение approved docs;
- хранение outdated docs;
- хранение draft docs;
- versioning;
- change log;
- version registry;
- фиксация новых approved versions.

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
1. В ChatGPT Project выявляется противоречие, gap или новая гипотеза.
2. Формируется decision draft.
3. Формируются patch plans по затронутым документам.
4. Готовятся новые versioned files.
5. Новые версии проверяются и апрувятся.
6. Новые версии коммитятся и пушатся в Git.
7. Version registry и change log обновляются.
8. Только после этого Manus работает по новой версии.

## Текущий следующий шаг
Использовать в качестве актуального approved contour:
- `docs/approved/spec_governance_v0.1.md`
- `docs/approved/project_brief_v0.3.md`
- `docs/approved/experiment_charter_stage_a_v0.3.md`
- `docs/approved/decision_log_v0.4.md`
- `docs/approved/master_instruction_v0.2.md`
- `docs/approved/output_contract_v0.2.md`
- `docs/approved/test_set_v0.2.md`

После этого:
1. выполнить следующий run в Manus по актуальному набору документов из Git;
2. разобрать результаты;
3. обновлять спецификацию только через явный review loop и versioned sync в Git.