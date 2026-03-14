# Decision Log v0.9

## Назначение документа
Этот документ фиксирует уже принятые решения по проекту SaleCheckUp Signals Radar, чтобы не обсуждать их заново и не терять контекст между итерациями.

## Уже принятые решения
1. Сначала идем по **варианту A**, а не строим production contour сразу.
2. Для этапа A **VS Code не обязателен**.
3. Используем разделение на **spec loop** и **run loop**.
4. **Git** выступает как source of truth для approved documentation и version history.
5. **ChatGPT Project** выступает как thinking / feedback / governance layer.
6. **Manus** выступает как research execution layer.
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
22. Изменение вступает в силу только после фиксации новой approved revision на stable path в Git и обновления version registry / change log.
23. Handoff для repo/spec changes между ChatGPT Project и VS Code/Codex идет через versioned repo artifact, а не через ручной перенос длинных сообщений между окнами.
24. Для каждой нетривиальной задачи должен быть явный handoff artifact с change scope, do-not-change scope, document status и sync-impact.
25. Все repo changes должны исполняться через **VS Code/Codex**, а не через web chat.
26. В scope repo changes входят document edits, version registry, change log, lifecycle/status updates и другие логически затронутые файлы.
27. Active approved docs используют stable semantic filenames без version suffix; active filename не является revision marker.
28. Run должен быть grounded через stable approved paths и полный Git commit SHA, а не через ручной список versioned approved filenames.
29. Historical recovery approved governance contour must rely on Git + explicit contour snapshot/history artifacts, а не на duplicate archived full copies.

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

## Новая запись решения v0.5

### Decision ID
`decision_003`

### Title
Repo artifact handoff contour for ChatGPT Project and VS Code/Codex

### Status
Approved

### Date
2026-03-15

### Problem
В approved contour уже зафиксировано, что Git является source of truth для approved docs, но не был зафиксирован явный execution interface между:
- thinking/spec work в ChatGPT Project;
- versioned repo artifacts;
- исполнением repo changes в VS Code/Codex.

Из-за этого ручной перенос длинных инструкций между окнами мог становиться фактическим основным контуром работы, хотя такой способ:
- плохо версионируется;
- не фиксирует change boundary;
- не делает document status явным;
- скрывает sync-impact на связанные документы.

### Decision
Принято следующее operating rule для repo/spec changes.

#### 1. Canonical handoff contour
Canonical flow фиксируется так:
- ChatGPT Project = thinking / spec layer;
- repo markdown artifact = handoff layer;
- VS Code/Codex = execution layer.

#### 2. Handoff artifacts become explicit
Handoff между ChatGPT Project и VS Code/Codex должен выполняться через versioned repo artifacts, а не через ручной перенос длинных сообщений между окнами.

Для нетривиальной задачи artifact должен явно фиксировать:
- что менять;
- что не менять;
- какие документы затронуты;
- какой у документов статус: `approved`, `outdated`, `draft`;
- какой есть sync-impact на смежные документы.

Canonical artifact roles фиксируются так:
- `docs/patch_plans/` — patch-level execution artifacts for explicit document changes;
- `docs/decision_drafts/` — draft decisions that are not yet approved;
- `docs/indexes/current_handoff.md` — optional single entry file for the currently active execution task.

#### 3. Execution rule
- Codex исполняет задачу, опираясь на artifact и approved docs;
- ручной copy-paste длинных инструкций между ChatGPT и VS Code не является canonical workflow;
- ручное создание, перемещение и versioning project files через shell допустимо только как fallback.

#### 4. Boundary
Это правило описывает handoff contour для repo/spec changes.

Оно не переписывает автоматически Manus-centric research execution model в:
- `output_contract`
- `test_set`
- `experiment_charter_stage_a`

### Rationale
Это решение добавляет недостающий handoff layer между discussion и execution без замены source-of-truth model.

Оно нужно, чтобы:
- change scope был versioned;
- sync-impact не терялся;
- approved docs не подменялись длинной историей чата;
- execution в VS Code/Codex опиралось на repo artifacts, а не на ручную пересборку контекста.

### Consequences

#### Documentation consequences
Должны быть синхронизированы:
- `master_instruction` → `v0.3`
- `spec_governance` → `v0.2`
- `decision_log` → `v0.5`
- `version_registry`
- `change_log`
- `docs/indexes/current_handoff.md`

#### Residual sync-impact at decision time
Требовали отдельной проверки и отдельного scope:
- `project_brief_v0.3`
- `experiment_charter_stage_a_v0.3`
- `README_upload_to_projects.md`

#### Sync completion status
Subsequent alignment package closed this residual sync-impact through:
- `project_brief` → `v0.4`
- `experiment_charter_stage_a` → `v0.4`
- `README_upload_to_projects` → `v0.1`
- `decision_log` → `v0.6`

### Affected documents
- `master_instruction_v0.2`
- `spec_governance_v0.1`
- `decision_log_v0.4`
- `version_registry`
- `change_log`
- `docs/indexes/current_handoff.md`

### Approval
Approved

## Новая запись решения v0.7

### Decision ID
`decision_004`

### Title
ChatGPT Project as governance layer and VS Code/Codex as exclusive repo execution layer

### Status
Approved

### Date
2026-03-15

### Problem
Текущий contour уже фиксирует:
- artifact-based handoff между ChatGPT Project и VS Code/Codex;
- boundary между Manus и VS Code/Codex;
- repo/spec execution loop в approved contour.

Но до этого прохода не было зафиксировано полностью симметричное operating rule:
- ChatGPT Project используется как thinking / feedback / governance layer;
- все repo changes исполняются только через VS Code/Codex;
- web chat не является execution surface для repo changes.

Из-за этого сохранялся риск частичного overlap между:
- reasoning layer;
- repo execution layer;
- manual web chat execution.

### Decision
Принято следующее operating rule.

#### 1. ChatGPT Project
ChatGPT Project используется как thinking / feedback / governance layer.

В нем происходят:
- сбор и структурирование feedback;
- выявление противоречий;
- reasoning;
- формулирование решений;
- определение change scope;
- определение sync impact.

#### 2. VS Code/Codex
VS Code/Codex используется как implementation / repo execution layer.

Через VS Code/Codex должны исполняться все repo changes, включая:
- document edits;
- version registry;
- change log;
- lifecycle/status updates;
- other logically affected files.

#### 3. Web chat boundary
Repo changes не должны исполняться напрямую в web chat.

Web chat допустим как discussion interface, но не как execution layer для repo changes.

### Rationale
Это решение не дублирует decision_003, а завершает его.

Decision_003 зафиксировал artifact-based handoff contour.

Decision_004 фиксирует:
- что ChatGPT Project является governance layer;
- что VS Code/Codex является единственным repo execution layer;
- что web chat не должен подменять implementation surface.

### Consequences

#### Documentation consequences
Должны быть синхронизированы:
- `master_instruction` → `v0.4`
- `spec_governance` → `v0.3`
- `decision_log` → `v0.7`
- `project_brief` → `v0.5`
- `experiment_charter_stage_a` → `v0.5`
- `README_upload_to_projects` → `v0.2`

#### Boundary consequences
- `Manus` сохраняется как research execution layer;
- `VS Code/Codex` фиксируется как repo execution layer;
- web chat исключается как repo execution surface.

### Affected documents
- `master_instruction_v0.3`
- `spec_governance_v0.2`
- `decision_log_v0.6`
- `project_brief_v0.4`
- `experiment_charter_stage_a_v0.4`
- `README_upload_to_projects_v0.1`
- `version_registry`
- `change_log`

### Approval
Approved

## Новая запись решения v0.8

### Decision ID
`decision_005`

### Title
Stable approved paths and commit-grounded runs

### Status
Approved

### Date
2026-03-15

### Problem
После предыдущих governance sync-pass active approved contour оставался выражен через version suffix в filenames.

Это создавало несколько видов ambiguity:
- run-level truth мог ссылаться на один набор versioned filenames;
- approved contour мог считать canonical другой набор;
- manual summary или handoff artifact могли ссылаться на третий;
- из active path было неочевидно, где заканчивается document identity и где начинается revision history.

Из-за этого version suffix в active approved filename становился частью operating model, хотя для жизнеспособного contour он должен быть только частью history layer.

### Decision
Принята следующая naming и grounding model.

#### 1. Active approved paths become stable
Active approved docs в `docs/approved/` должны использовать stable semantic filenames без version suffix.

Canonical identity active approved doc определяется через stable path.

#### 2. Revision history leaves the active filename
История ревизий active approved docs должна выражаться через:
- Git history;
- `version_registry`;
- `change_log`.

`current_version` в `version_registry` остается canonical revision marker для active approved contour.

#### 3. Versioned numbering remains limited
Versioned / numbered naming остается допустимым для handoff artifacts:
- `docs/patch_plans/`
- `docs/decision_drafts/`

#### 4. Run grounding becomes commit-based
Research run должен ссылаться не на ручной список versioned approved filenames, а на:
- stable approved paths;
- полный Git commit SHA approved contour.

Минимальный run grounding фиксируется через:
- `approved_contour_paths`
- `approved_contour_commit_sha`

#### 5. Migration rule
Migration с versioned active approved filenames на stable paths не считается rename-only patch.

Она должна включать:
- policy sync;
- decision layer sync;
- ref sync;
- version/control layer sync;
- lifecycle handling для superseded approved docs.

### Rationale
Это решение устраняет смешение между:
- document identity;
- revision history;
- run grounding.

Оно нужно, чтобы:
- active approved contour был определен однозначно;
- run мог ссылаться на contour snapshot через commit, а не через ручное перечисление версий;
- approved filenames не становились скрытым source of truth для revision identity;
- history продолжала сохраняться без потери audit trail.

### Consequences

#### Governance consequences
- Active approved docs должны перейти на stable semantic paths.
- `version_registry` должен стать явным носителем `current_version` для active contour.
- `change_log` должен фиксировать revision history без зависимости от active filename.

#### Run consequences
- `output_contract` должен потребовать `approved_contour_commit_sha` и `approved_contour_paths` в `run_manifest.json`.
- Manual versioned-filename list перестает быть canonical run grounding.

#### Documentation consequences
Должны быть синхронизированы:
- `spec_governance` → `v0.4`
- `decision_log` → `v0.8`
- `master_instruction` → `v0.5`
- `project_brief` → `v0.6`
- `experiment_charter_stage_a` → `v0.6`
- `README_upload_to_projects` → `v0.3`
- `output_contract` → `v0.3`

Path-only migration:
- `test_set` остается `v0.2`, но переходит на stable active path.

### Affected Documents
- `spec_governance` previous approved revision `v0.3`
- `decision_log` previous approved revision `v0.7`
- `master_instruction` previous approved revision `v0.4`
- `project_brief` previous approved revision `v0.5`
- `experiment_charter_stage_a` previous approved revision `v0.5`
- `README_upload_to_projects` previous approved revision `v0.2`
- `output_contract` previous approved revision `v0.2`
- `docs/approved/test_set.md`
- `docs/indexes/version_registry.md`
- `docs/indexes/change_log.md`
- `docs/indexes/current_handoff.md`
- `docs/patch_plans/_template_patch_plan.md`
- `docs/decision_drafts/_template_decision_draft.md`

### Approval
Approved

## Новая запись решения v0.9

### Decision ID
`decision_006`

### Title
Contour history layer replaces archived duplicate governance copies

### Status
Approved

### Date
2026-03-15

### Problem
После перехода active approved contour на stable semantic paths project still retained a second architectural problem:
- superseded governance states хранились как full duplicate copies в archival storage;
- contour-level historical recovery зависел от pile of archived files;
- explicit approved contour history layer отсутствовал;
- run grounding был commit-based, но history layer не позволял быстро понять, какой contour действовал на каком snapshot without opening archived duplicates.

Это создавало смешение между:
- revision history;
- lifecycle semantics;
- contour-level recovery;
- file storage model.

### Decision
Принята следующая storage и history model.

#### 1. Stable paths remain canonical
Один semantic governance doc должен жить на одном stable path в `docs/approved/`.

Version не живет в active governance filename.

#### 2. Duplicate archived full copies stop being canonical history model
History approved governance docs не должна опираться на duplicate archived full copies.

Status `outdated` остается lifecycle semantics для superseded states, но не требует хранения полного duplicate file per revision.

#### 3. Explicit contour history layer becomes canonical
Canonical history layer фиксируется через:
- `docs/indexes/approved_contour_history.md`
- `docs/history/approved_contours/`

Эти artifacts должны позволять восстановить:
- какой approved contour действовал;
- на каком Git commit SHA его можно recover;
- какие stable paths входили в contour;
- какие approved revisions действовали.

#### 4. Recovery model
Full text recovery historical docs выполняется через Git history.

Contour-level recovery выполняется через explicit snapshot/history artifacts, а не через pile of archived duplicates.

#### 5. Run grounding consistency
`approved_contour_commit_sha` и `approved_contour_paths` в `run_manifest.json` должны соответствовать contour snapshot, зафиксированному в canonical history layer.

### Rationale
Это решение разделяет:
- current document identity;
- revision history;
- contour snapshot history;
- lifecycle semantics.

Оно нужно, чтобы:
- historical recovery был repo-resident и явным;
- duplicate archived full copies перестали быть основным способом восстановления history;
- runs и governance layer ссылались на один и тот же contour model;
- storage model перестала скрыто подменять lifecycle semantics.

### Consequences

#### Governance consequences
- `spec_governance` должен зафиксировать history artifacts как canonical history layer.
- `decision_log` должен зафиксировать replacement of archived duplicate copies.
- `project_brief` и `README_upload_to_projects` должны перестать описывать history recovery через outdated full-copy storage.

#### History layer consequences
- должен появиться canonical history index;
- должны появиться contour snapshot files для coherent approved states;
- archived duplicate governance copies должны быть удалены после backfill snapshot layer.

#### Documentation consequences
Должны быть синхронизированы:
- `spec_governance` → `v0.5`
- `decision_log` → `v0.9`
- `project_brief` → `v0.7`
- `README_upload_to_projects` → `v0.4`
- `output_contract` → `v0.4`

Без новой revision:
- `master_instruction` → `v0.5`
- `experiment_charter_stage_a` → `v0.6`
- `test_set` → `v0.2`

### Affected Documents
- `docs/approved/spec_governance.md`
- `docs/approved/decision_log.md`
- `docs/approved/project_brief.md`
- `docs/approved/README_upload_to_projects.md`
- `docs/approved/output_contract.md`
- `docs/indexes/version_registry.md`
- `docs/indexes/change_log.md`
- `docs/indexes/current_handoff.md`
- `docs/indexes/approved_contour_history.md`
- `docs/history/approved_contours/`
- `docs/patch_plans/_template_patch_plan.md`
- `docs/decision_drafts/_template_decision_draft.md`

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
Живет в ChatGPT Project как в thinking / feedback / governance layer.

Там происходят:
- сбор и структурирование feedback;
- мышление;
- формализация;
- фиксация противоречий;
- подготовка решений;
- определение change scope;
- определение sync impact;
- версия артефактов до апрува;
- обновление документов после run'ов.

### Documentation layer
Живет в Git.

Там происходят:
- хранение approved docs;
- хранение approved contour history artifacts;
- хранение draft docs;
- хранение active approved docs на stable semantic paths;
- versioning через Git, `version_registry` и `change_log`;
- contour-level recovery через `approved_contour_history`;
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

### Repo/spec execution loop
Живет в VS Code/Codex.

Там происходят:
- исполнение явного change scope внутри repo;
- обновление approved revisions на stable paths;
- document edits;
- version registry;
- change log;
- lifecycle/status updates;
- other logically affected files;
- работа по approved docs и handoff artifacts;
- sync изменений в version/control layer;
- исключение прямого исполнения repo changes в web chat.

### Рабочая петля
1. В ChatGPT Project выявляется противоречие, gap или новая гипотеза.
2. Формируется decision draft.
3. Формируются patch plans по затронутым документам.
4. Готовятся новые approved revisions на stable paths и, при необходимости, versioned handoff artifacts.
5. Обновляются approved contour history artifacts.
6. Новые версии проверяются и апрувятся.
7. Новые версии коммитятся и пушатся в Git.
8. Version registry и change log обновляются.
9. Только после этого Manus работает по новой версии.

## Текущий следующий шаг
Использовать в качестве актуального approved contour:
- `docs/approved/spec_governance.md`
- `docs/approved/project_brief.md`
- `docs/approved/experiment_charter_stage_a.md`
- `docs/approved/decision_log.md`
- `docs/approved/master_instruction.md`
- `docs/approved/output_contract.md`
- `docs/approved/test_set.md`

Operational support doc:
- `docs/approved/README_upload_to_projects.md`

После этого:
1. выполнять research runs в Manus по актуальному approved contour из Git и фиксировать stable approved paths + commit SHA в `run_manifest.json`;
2. выполнять repo/spec changes в VS Code/Codex только по versioned handoff artifact и не исполнять их напрямую в web chat;
3. использовать `approved_contour_history` для contour-level historical recovery;
4. обновлять спецификацию только через явный review loop и approved revision sync в Git.
