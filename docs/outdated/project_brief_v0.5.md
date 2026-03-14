# Project Brief v0.5

## Название проекта
**SaleCheckUp Signals Radar**

## Контекст
Илья Суворов, CPO и фаундер бизнес-гипотезы, которая реализуется через продукт SaleCheckUp, ищет новые источники выручки для компании TravelLine.

Илья работает в R&D-отделе TravelLine. Целевой ориентир — в идеале довести этот продукт до одного миллиарда рублей выручки.

SaleCheckUp рассматривается как продуктовый контур, связанный с продажами, бронированием, звонками, обработкой обращений, качеством работы отдела продаж и отдела бронирования, а также влиянием этих процессов на денежный результат.

## Проблема
Рынок производит слишком много шума: новости, анонсы AI-функций, product updates, общие тренды и маркетинговые обещания. Это не помогает системно находить новые продуктовые гипотезы.

Нужна исследовательская машина, которая умеет находить не просто интересное, а именно **монетизируемые сигналы**.

## Цель проекта
Построить исследовательский контур, который помогает находить новые гипотезы роста SaleCheckUp через системный поиск и накопление:
- подтвержденных кейсов;
- near-money болей;
- технологических сдвигов.

## Рабочее определение ценного сигнала
Ценным считается материал, который помогает понять:
1. за что клиент платит;
2. сколько клиент платит или может платить;
3. какую JTBD-задачу он решает;
4. какой результат получает;
5. насколько результат близок к деньгам;
6. можно ли достичь того же результата новой технологией лучше, быстрее, дешевле или проще.

## Рынок и рамка поиска

### Основной фокус
- hotel
- travel
- hospitality
- отделы бронирования
- отделы продаж
- reservation desk / call-related workflows / guest communication / revenue-related workflows

### Дополнительный фокус
- смежные B2B-кейсы, если они переносимы в контекст SaleCheckUp.

## География
- искать сигналы по всему миру;
- отдельно фиксировать российские кейсы и глобальные кейсы;
- отдельно оценивать применимость кейса к российскому контексту.

## Целевой результат проекта
На выходе должен появиться двойной слой:
1. **машинный слой** — структурированные JSON/JSONL-артефакты;
2. **человеческий слой** — человекочитаемая аналитика и dashboard-логика.

## Governance-модель проекта
В проекте используются четыре базовых governance слоя.

### 1. Thinking / feedback / governance layer
- `ChatGPT Project`

Здесь происходят:
- сбор и структурирование feedback;
- обсуждение;
- выявление противоречий;
- reasoning;
- decision drafting;
- patch planning;
- определение change scope;
- определение sync impact;
- review loop;
- подготовка новых версий документов.

### 2. Source of truth and handoff layer
- `Git`

Git является:
- source of truth для approved documentation;
- source of truth для version history;
- местом, где хранятся approved, outdated и draft-версии документов;
- местом, где хранятся versioned handoff artifacts для repo/spec changes.

Внутри repo handoff layer выражается через:
- `docs/patch_plans/`;
- `docs/decision_drafts/`;
- `docs/indexes/current_handoff.md`.

### 3. Research execution layer
- `Manus`

Manus должен работать только по approved docs, зафиксированным в Git, и использоваться для research runs.

### 4. Repo execution layer
- `VS Code/Codex`

VS Code/Codex используется как implementation / repo execution layer для исполнения явного change scope внутри repo.

VS Code/Codex:
- не заменяет Manus как research execution layer;
- работает по approved docs и versioned handoff artifacts из repo;
- должен исполнять все repo changes, включая document edits, version registry, change log, lifecycle/status updates и другие логически затронутые файлы;
- не должен получать основной контур задачи через ручной перенос длинных сообщений между окнами;
- не должен подменяться прямым исполнением repo changes в web chat.

## Operating principle
Новая формулировка или решение не считаются действующей спецификацией только потому, что они обсуждены или согласованы в ChatGPT Project.

Изменение вступает в силу только после того, как:
1. оформлены новые versioned documents;
2. для нетривиальной repo/spec задачи зафиксирован explicit handoff artifact;
3. они зафиксированы в Git;
4. обновлены version registry и change log;
5. `Manus` и `VS Code/Codex` используют актуальный contour в пределах своей boundary.

## Следующий шаг
Использовать уже синхронизированный approved contour:
- `docs/approved/spec_governance_v0.3.md`
- `docs/approved/project_brief_v0.5.md`
- `docs/approved/experiment_charter_stage_a_v0.5.md`
- `docs/approved/decision_log_v0.7.md`
- `docs/approved/master_instruction_v0.4.md`
- `docs/approved/output_contract_v0.2.md`
- `docs/approved/test_set_v0.2.md`

Operational support doc:
- `docs/approved/README_upload_to_projects_v0.2.md`

После этого:
1. выполнять research runs в Manus по актуальному approved contour из Git;
2. для repo/spec changes использовать versioned handoff artifact и выполнять задачу в VS Code/Codex;
3. обновлять спецификацию только через явный review loop и versioned sync в Git.
