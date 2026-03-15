# README — upload to Projects v0.5

## Назначение файла
Этот файл описывает, какие документы загружать в ChatGPT Project и как не смешивать Project layer с source of truth для approved docs.

## Что загружать в ChatGPT Project
Для базового project context загрузи текущий approved contour:
- `docs/approved/spec_governance.md`
- `docs/approved/project_brief.md`
- `docs/approved/experiment_charter_stage_a.md`
- `docs/approved/decision_log.md`
- `docs/approved/master_instruction.md`
- `docs/approved/vscode_codex_handoff_contract.md`
- `docs/approved/output_contract.md`
- `docs/approved/test_set.md`

## Что загружать для активной repo/spec задачи
Если в работе есть repo work, по умолчанию используй canonical handoff contract и дополнительно загрузи релевантные handoff artifacts, которые его инстанцируют:
- нужный файл из `docs/patch_plans/`;
- нужный файл из `docs/decision_drafts/`, если он требуется для контекста решения;
- `docs/indexes/current_handoff.md`, если он используется как single-entry task artifact.

`short_handoff` допустим только для clearly mechanical local edits по правилам `docs/approved/vscode_codex_handoff_contract.md`.

## Что считать источником правды
- source of truth для approved docs остается Git;
- active approved docs идентифицируются через stable paths, а их текущая revision фиксируется в `version_registry` и `change_log`;
- contour-level historical recovery выполняется через `docs/indexes/approved_contour_history.md`, а не через archived duplicate full copies;
- upload в ChatGPT Project не делает текст approved автоматически;
- ChatGPT Project используется как thinking / feedback / governance layer;
- handoff к VS Code/Codex по умолчанию должен идти через canonical approved handoff contract `docs/approved/vscode_codex_handoff_contract.md`.

## Что делать дальше
1. Создай или открой Project.
2. Загрузи текущий approved contour.
3. Для repo/spec задачи по умолчанию загрузи canonical handoff contract и релевантные handoff artifacts вместо ручной пересборки длинной инструкции.
4. Если `short_handoff` не проходит по contract conditions, используй `full_handoff`.
5. После согласования решения зафиксируй patch scope в versioned handoff artifacts и, при необходимости, выпусти новую approved revision на stable path до исполнения задачи в VS Code/Codex.
6. Не исполняй repo changes напрямую в web chat.
7. Research runs продолжай выполнять в Manus по актуальному approved contour из Git.
8. Если нужно понять исторический approved contour, используй `approved_contour_history` и Git history.

## Что считать устаревшим
Не используй как source of truth:
- numbered historical artifacts как замену current approved contour;
- старые approved versions, которые уже superseded в `version_registry`.
