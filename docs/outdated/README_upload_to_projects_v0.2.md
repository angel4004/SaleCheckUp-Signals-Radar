# README — upload to Projects v0.2

## Назначение файла
Этот файл описывает, какие документы загружать в ChatGPT Project и как не смешивать Project layer с source of truth для approved docs.

## Что загружать в ChatGPT Project
Для базового project context загрузи текущий approved contour:
- `docs/approved/spec_governance_v0.3.md`
- `docs/approved/project_brief_v0.5.md`
- `docs/approved/experiment_charter_stage_a_v0.5.md`
- `docs/approved/decision_log_v0.7.md`
- `docs/approved/master_instruction_v0.4.md`
- `docs/approved/output_contract_v0.2.md`
- `docs/approved/test_set_v0.2.md`

## Что загружать для активной repo/spec задачи
Если в работе есть нетривиальная задача по изменению repo, дополнительно загрузи релевантные handoff artifacts:
- нужный файл из `docs/patch_plans/`;
- нужный файл из `docs/decision_drafts/`, если он требуется для контекста решения;
- `docs/indexes/current_handoff.md`, если он используется как single-entry task artifact.

## Что считать источником правды
- source of truth для approved docs остается Git;
- upload в ChatGPT Project не делает текст approved автоматически;
- ChatGPT Project используется как thinking / feedback / governance layer;
- handoff к VS Code/Codex должен идти через versioned repo artifact, а не через ручной copy-paste длинных сообщений между окнами.

## Что делать дальше
1. Создай или открой Project.
2. Загрузи текущий approved contour.
3. Для нетривиальной repo/spec задачи загрузи релевантный handoff artifact вместо ручной пересборки длинной инструкции.
4. После согласования решения зафиксируй patch scope в versioned repo files до исполнения задачи в VS Code/Codex.
5. Не исполняй repo changes напрямую в web chat.
6. Research runs продолжай выполнять в Manus по актуальному approved contour из Git.

## Что считать устаревшим
Не используй как source of truth:
- outdated docs;
- legacy unversioned upload README;
- старые approved versions, которые уже superseded в `version_registry`.
