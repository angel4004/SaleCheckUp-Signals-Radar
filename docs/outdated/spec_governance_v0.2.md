# Spec Governance v0.2

## Назначение документа
Этот документ фиксирует governance-модель проекта SaleCheckUp Signals Radar:
- где разрабатывается спецификация;
- где хранится утвержденная версия документов;
- какая система считается source of truth;
- по какой версии документов должен работать Manus;
- когда изменение считается вступившим в силу.

## Роли систем

### 1. Git
Git является:
- **source of truth для approved documentation**;
- **source of truth для version history**;
- местом, где хранятся:
  - approved docs;
  - outdated docs;
  - drafts;
  - decision drafts;
  - patch plans;
  - version registry;
  - change log.

Только версия документа, зафиксированная в Git, считается актуальной approved-версией для исполнения.

### 2. ChatGPT Project
ChatGPT Project является:
- **spec development environment**;
- местом, где происходят:
  - обсуждение;
  - выявление противоречий;
  - decision drafting;
  - patch planning;
  - review loop;
  - разбор результатов run.

ChatGPT Project не является финальным source of truth для approved documentation.

Документ не считается approved только потому, что его формулировка была согласована внутри ChatGPT Project.  
Чтобы решение вступило в силу, оно должно быть оформлено в versioned documentation и зафиксировано в Git.

### 3. Manus
Manus является:
- **execution layer**;
- системой, которая исполняет текущую approved-версию спецификации.

Manus должен работать не по обсуждению в ChatGPT Project и не по промежуточным draft-формулировкам, а только по approved documents, зафиксированным в Git.

## Правило source of truth
В проекте используются три разных слоя:

### 1. Development layer
Где рождаются и обсуждаются изменения:
- ChatGPT Project

### 2. Documentation layer
Где хранится утвержденная версия спецификации:
- Git

### 3. Execution layer
Где утвержденная версия спецификации исполняется:
- Manus

## Правило вступления изменений в силу
Изменение считается вступившим в силу только если одновременно выполнены следующие условия:

1. Решение сформулировано и согласовано.
2. Изменение отражено в соответствующих versioned documents.
3. Новая версия документа зафиксирована в Git.
4. Version registry и change log обновлены.
5. Предыдущая approved-версия переведена в outdated, если это требуется.

До этого момента изменение считается:
- draft;
- discussion result;
- pending update;
но не approved source of truth.

## Правило работы с approved docs
1. Approved docs не редактируются молча по месту.
2. Существенное изменение должно выпускаться как новая версия файла.
3. Предыдущая approved-версия не удаляется, а переводится в outdated.
4. Если правка затрагивает несколько документов, это должно быть явно отражено через:
   - decision draft;
   - patch plan;
   - version bumps;
   - change log.

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

## Правило для ChatGPT
ChatGPT используется для:
- анализа противоречий;
- формулирования решений;
- подготовки новых версий документов;
- синхронизации spec loop.

ChatGPT не должен считать обсужденную, но не зафиксированную в Git формулировку уже действующей approved-версией.

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
4. Готовятся новые versioned files.
5. Новые версии проверяются и апрувятся.
6. Новые версии коммитятся и пушатся в Git.
7. Version registry и change log обновляются.
8. Только после этого Manus работает по новой версии.

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
- approved docs меняются без version bump;
- старые approved docs исчезают вместо перевода в outdated;
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
- **ChatGPT Project** = spec development environment
- **Manus** = execution layer using approved docs from Git

## Approval
Approved
