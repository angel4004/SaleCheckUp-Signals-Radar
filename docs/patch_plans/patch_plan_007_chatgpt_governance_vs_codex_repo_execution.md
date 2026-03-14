# Patch Plan

## Status
Approved

## Related Decision
decision_004

## Document
chatgpt_governance_vs_codex_repo_execution

## Current Version
Multi-document approved contour:
- `master_instruction_v0.3`
- `spec_governance_v0.2`
- `decision_log_v0.6`
- `project_brief_v0.4`
- `experiment_charter_stage_a_v0.4`
- `README_upload_to_projects_v0.1`

## Target Version
Multi-document sync package:
- `master_instruction_v0.4`
- `spec_governance_v0.3`
- `decision_log_v0.7`
- `project_brief_v0.5`
- `experiment_charter_stage_a_v0.5`
- `README_upload_to_projects_v0.2`

## Why This Patch Exists
В текущем approved contour уже зафиксированы:
1. artifact-based handoff между ChatGPT Project и VS Code/Codex;
2. boundary Manus vs VS Code/Codex;
3. repo/spec execution loop в decision layer.

Но новое operating rule пока не доведено до полностью консистентного canonical governance state:
- `spec_governance_v0.2` не фиксирует `VS Code/Codex` как отдельный repo execution layer;
- не зафиксировано явно, что ChatGPT Project является thinking / feedback / governance layer;
- не зафиксировано явно, что repo changes не должны исполняться напрямую в web chat;
- related approved docs содержат частичные, но не полностью симметричные формулировки.

## Exact Changes
1. Выпустить новую версию `spec_governance` с явной фиксацией:
   - `ChatGPT Project` = thinking / feedback / governance layer;
   - `VS Code/Codex` = repo execution layer;
   - repo changes must not be executed directly in the web chat.
2. Выпустить новую версию `master_instruction`, чтобы существующее rule 11 было приведено к той же boundary и не конкурировало с governance wording.
3. Выпустить новую версию `decision_log` с новым approved decision и обновленным current contour.
4. Выпустить новые версии `project_brief`, `experiment_charter_stage_a` и `README_upload_to_projects` только в той мере, в какой это требуется для:
   - sync с новыми version refs;
   - устранения competing wording;
   - явной boundary ChatGPT Project / Manus / VS Code/Codex / web chat.
5. Обновить canonical `version_registry` и `change_log`.
6. Перевести superseded approved versions в `outdated`.

## Explicit Non-Changes
- Не менять `output_contract_v0.2`.
- Не менять `test_set_v0.2`.
- Не менять semantic model или research run model.
- Не вводить новые workflow artifacts beyond existing governance contour.

## Cross-Doc Sync Required
- `docs/indexes/version_registry.md`
- `docs/indexes/change_log.md`
- `docs/indexes/current_handoff.md`

## Risks
- Если обновить только `spec_governance`, в approved contour останутся конкурирующие или неполные формулировки в `master_instruction` и related docs.
- Если не обновить `decision_log`, новое operating rule не будет зафиксировано в canonical decision layer.
- Если не обновить support docs после version bump, approved contour снова станет stale по version refs.

## Approval
Approved
