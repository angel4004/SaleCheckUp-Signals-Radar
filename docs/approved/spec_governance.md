# Spec Governance v0.5

## Назначение документа
Этот документ фиксирует governance-модель проекта SaleCheckUp Signals Radar:
- где разрабатывается спецификация;
- где хранится утвержденная версия документов;
- какая система считается source of truth;
- по какой версии документов должны работать execution layers;
- когда изменение считается вступившим в силу.

## Роли систем

### 1. Git
Git является:
- **source of truth для approved documentation**;
- **source of truth для version history**;
- местом, где хранятся:
  - approved docs;
  - approved contour history artifacts;
  - drafts;
  - decision drafts;
  - patch plans;
  - version registry;
  - change log.

Только версия документа, зафиксированная в Git, считается актуальной approved-версией для исполнения.

### 2. ChatGPT Project
ChatGPT Project является:
- **thinking / feedback / governance layer**;
- **spec development environment**;
- местом, где происходят:
  - сбор и структурирование feedback;
  - обсуждение;
  - выявление противоречий;
  - reasoning;
  - decision drafting;
  - patch planning;
  - определение change scope;
  - определение sync impact;
  - review loop;
  - разбор результатов run.

ChatGPT Project не является финальным source of truth для approved documentation.

Документ не считается approved только потому, что его формулировка была согласована внутри ChatGPT Project.  
Чтобы решение вступило в силу, оно должно быть оформлено в approved docs на stable paths, иметь явную current_version в `version_registry` и быть зафиксировано в Git.

### 3. Manus
Manus является:
- **research execution layer**;
- системой, которая исполняет текущую approved-версию спецификации.

Manus должен работать не по обсуждению в ChatGPT Project и не по промежуточным draft-формулировкам, а только по approved documents, зафиксированным в Git.

### 4. VS Code/Codex
VS Code/Codex является:
- **implementation / repo execution layer**;
- системой, через которую должны исполняться все изменения внутри repo.

Все repo changes должны исполняться через VS Code/Codex.

Это включает:
- document edits;
- version registry;
- change log;
- lifecycle/status updates;
- other logically affected files.

Repo changes не должны исполняться напрямую в web chat.

## Правило source of truth
В проекте используются четыре разных слоя:

### 1. Thinking / governance layer
Где рождаются и обсуждаются изменения:
- ChatGPT Project

### 2. Documentation layer
Где хранится утвержденная версия спецификации:
- Git

### 3. Research execution layer
Где approved-спецификация используется для research runs:
- Manus

### 4. Repo execution layer
Где исполняются все repo changes:
- VS Code/Codex

## Правило вступления изменений в силу
Изменение считается вступившим в силу только если одновременно выполнены следующие условия:

1. Решение сформулировано и согласовано.
2. Изменение отражено в соответствующих approved docs на stable paths.
3. Новая approved revision документа зафиксирована в Git на stable path.
4. Version registry и change log обновлены.
5. Superseded approved state зафиксирован в approved contour history artifacts и Git, если это требуется.

До этого момента изменение считается:
- draft;
- discussion result;
- pending update;
но не approved source of truth.

## Правило работы с approved docs
1. Approved docs не редактируются молча по месту.
2. Существенное изменение должно выпускаться как новая approved revision, а не через правку active файла без lifecycle sync.
3. Active approved docs в `docs/approved/` используют stable semantic filenames без version suffix.
4. Superseded approved state не должен храниться как duplicate full copy только ради history recovery.
5. Если правка затрагивает несколько документов, это должно быть явно отражено через:
   - decision draft;
   - patch plan;
   - approved revision updates;
   - approved contour history update;
   - change log.

## Правило именования active approved docs
1. Canonical approved identifiers задаются через stable paths в `docs/approved/`, а не через version suffix в active filename.
2. История ревизий active approved docs хранится в Git, `version_registry` и `change_log`.
3. `current_version` в `version_registry` остается canonical revision marker для active approved docs.
4. Duplicate archived full copies governance docs не являются canonical history model.
5. Version suffix допустим для versioned handoff artifacts в `docs/patch_plans/` и `docs/decision_drafts/`.
6. Historical recovery для approved contour должна опираться на Git и explicit contour snapshot/history artifacts, а не на pile of archived duplicate files.
7. Run-level grounding должен ссылаться на stable approved paths и полный Git commit SHA, а не на ручной список versioned approved filenames.

## Правило historical recovery
1. Canonical contour history layer задается через:
   - `docs/indexes/approved_contour_history.md`;
   - `docs/history/approved_contours/`.
2. Approved contour snapshot должен позволять определить:
   - какой contour действовал;
   - какой stable path входил в contour;
   - какая approved revision действовала;
   - к какому Git commit SHA относится recovery.
3. Full text recovery historical docs должен выполняться через Git history.
4. Contour-level recovery не должен зависеть от duplicate archived full copies одного и того же governance doc.

## Правило работы с draft layer
Draft-документы могут появляться:
- в decision drafts;
- в patch plans;
- в обсуждении внутри ChatGPT Project.

Draft не считается approved documentation до фиксации в Git.

## Правило для Manus
Manus должен получать в работу:
- только approved docs;
- только актуальные версии, зафиксированные в Git;
- только после явного sync step между discussion layer и documentation layer.

Результаты Manus:
- не считаются новой истиной автоматически;
- не переписывают спецификацию автоматически;
- всегда проходят через review loop перед изменением approved docs.

## Правило для VS Code/Codex
VS Code/Codex должен получать в работу:
- approved docs;
- актуальные versioned handoff artifacts;
- полный change scope, включая version/control layer.

Через VS Code/Codex должны исполняться:
- document edits;
- version registry;
- change log;
- lifecycle/status updates;
- other logically affected files.

Web chat не является execution layer для repo changes.

## Правило для ChatGPT
ChatGPT используется для:
- сбора и структурирования feedback;
- анализа противоречий;
- reasoning;
- формулирования решений;
- определения change scope;
- определения sync impact;
- подготовки новых версий документов;
- синхронизации spec loop.

ChatGPT не должен считать обсужденную, но не зафиксированную в Git формулировку уже действующей approved-версией.

## Правило grounding для run
Каждый research run должен быть привязан к конкретному approved contour из Git.

Минимальный grounding для run:
- stable approved paths;
- полный Git commit SHA approved contour.

Manual listing of versioned approved filenames не является canonical run grounding.

## Canonical handoff artifacts

Handoff between ChatGPT Project and VS Code/Codex must be performed through versioned repo artifacts, not through manual transfer of long-form chat messages.

Artifact roles:
- `docs/patch_plans/` — patch-level execution artifacts for explicit document changes;
- `docs/decision_drafts/` — draft decisions that are not yet approved;
- `docs/indexes/current_handoff.md` — optional single entry file for the currently active execution task.

Governance rules:
- approved docs remain the source of truth;
- handoff artifacts are execution interfaces, not replacements for approved docs;
- if a patch changes one document but creates logical impact on others, sync-impact must be listed explicitly;
- document status must always be explicit: `approved`, `outdated`, or `draft`.

## Минимальный governance cycle
Нормальный цикл изменения спецификации выглядит так:

1. В ChatGPT Project выявляется противоречие, gap или новая гипотеза.
2. Формируется decision draft.
3. Формируются patch plans по затронутым документам.
4. Готовятся новые approved revisions на stable paths и, при необходимости, versioned handoff artifacts.
5. Обновляются approved contour history artifacts.
6. Новые версии проверяются и апрувятся.
7. Новые версии коммитятся и пушатся в Git.
8. Version registry и change log обновляются.
9. Только после этого Manus работает по новой версии.

## Правило разрешения противоречий
Если:
- обсуждение в ChatGPT Project,
- локальные черновики,
- и версия документа в Git

расходятся между собой, то authoritative version определяется так:

### Приоритет
1. approved version в Git
2. явно апрувнутый, но еще не зафиксированный change package
3. draft discussion в ChatGPT Project

Если изменение еще не попало в Git, оно не считается окончательно вступившим в силу.

## Что считается governance-ошибкой
Governance-ошибкой считаются ситуации, когда:
- Manus работает по устаревшему набору документов;
- ChatGPT считает действующей версией то, что не зафиксировано в Git;
- repo changes исполняются напрямую в web chat;
- repo changes исполняются вне VS Code/Codex;
- active approved docs продолжают зависеть от version suffix как от canonical identifier;
- substantive approved changes вносятся без новой approved revision и без sync в `version_registry` / `change_log`;
- superseded approved states исчезают без capture в contour history artifacts и Git;
- historical recovery зависит от duplicate archived full copies как от основного механизма;
- patch затрагивает несколько документов, но синхронизация не отражена явно.

## Связь с другими документами
Этот документ не заменяет:
- `decision_log`
- `project_brief`
- `experiment_charter_stage_a`
- `master_instruction`
- `output_contract`
- `test_set`

Он задает governance-рамку, внутри которой эти документы создаются, апрувятся, обновляются и исполняются.

## Текущее правило проекта
Для проекта SaleCheckUp Signals Radar принимается следующая operating model:

- **Git** = source of truth for approved documentation
- **Stable approved paths** = canonical identifiers for active approved docs
- **ChatGPT Project** = thinking / feedback / governance layer
- **Manus** = research execution layer using approved docs from Git
- **VS Code/Codex** = implementation / repo execution layer for all repo changes

## Approval
Approved
