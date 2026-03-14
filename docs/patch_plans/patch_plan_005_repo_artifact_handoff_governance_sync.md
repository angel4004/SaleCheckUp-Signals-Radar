# Patch Plan

## Status
Approved

## Related Decision
decision_003

## Document
repo_handoff_governance

## Current Version
Multi-document approved contour:
- `master_instruction_v0.2`
- `spec_governance_v0.1`
- `decision_log_v0.4`

## Target Version
Multi-document sync package:
- `master_instruction_v0.3`
- `spec_governance_v0.2`
- `decision_log_v0.5`

## Why This Patch Exists
В текущем approved contour зафиксировано, что Git является source of truth, но не зафиксирован явный artifact-based handoff между ChatGPT Project и VS Code/Codex.

Из-за этого длинные инструкции могут передаваться между окнами вручную как основной рабочий контур, что создает риск:
1. потери traceability;
2. неявного change scope;
3. silent sync-impact на связанные документы;
4. расщепления между discussion layer и execution layer.

## Exact Changes
1. Добавить в `master_instruction` новое operating rule про handoff через repo artifact, а не через ручной перенос длинных сообщений между окнами.
2. Добавить в `spec_governance` canonical section про handoff artifacts, их роли и governance rules.
3. Зафиксировать решение в `decision_log` как новый approved decision.
4. Создать `docs/indexes/current_handoff.md` как minimal optional single-entry artifact for active task handoff.
5. Обновить canonical `version_registry` и canonical `change_log`.
6. Явно перечислить residual sync-impact для approved docs, которые логически затронуты, но не обновляются в этом проходе.

## Explicit Non-Changes
- Не переписывать approved docs целиком без необходимости.
- Не менять `output_contract` и `test_set`, так как semantic/output model этим решением не меняется.
- Не исправлять молча pre-existing stale references в unrelated docs, если они не обязательны для текущего governance package.
- Не делать shell-first workflow основным способом создания handoff artifacts.

## Cross-Doc Sync Required
- `docs/indexes/version_registry.md`
- `docs/indexes/change_log.md`
- `docs/indexes/current_handoff.md`
- `docs/approved/project_brief_v0.3.md` as residual review candidate
- `docs/approved/experiment_charter_stage_a_v0.3.md` as residual review candidate
- `docs/approved/README_upload_to_projects.md` as residual review candidate

## Risks
- Если handoff contour будет отражен только в одном документе, появится partial governance sync.
- Если не обновить decision layer, новое правило останется только в instruction/governance docs, но не в approved decision history.
- Если не перечислить residual sync-impact явно, возникнет ложное ощущение полной синхронизации при наличии stale docs.

## Approval
Approved
