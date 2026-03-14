# Patch Plan

## Status
Approved

## Related Decision
decision_003

## Document
residual_sync_alignment_after_decision_003

## Current Version
Multi-document approved contour:
- `project_brief_v0.3`
- `experiment_charter_stage_a_v0.3`
- `decision_log_v0.5`
- legacy `README_upload_to_projects.md`

## Target Version
Multi-document sync package:
- `project_brief_v0.4`
- `experiment_charter_stage_a_v0.4`
- `decision_log_v0.6`
- `README_upload_to_projects_v0.1`

## Why This Patch Exists
После change-package `decision_003` остался открытый residual sync-impact в approved contour:
1. `project_brief_v0.3` содержит stale refs на старые governance docs;
2. `experiment_charter_stage_a_v0.3` содержит stale refs и не выражает boundary Manus vs VS Code/Codex;
3. `README_upload_to_projects.md` остается legacy unversioned approved doc со старым contour;
4. `decision_log_v0.5` после выпуска новых версий тоже станет stale в разделе текущего approved contour.

Без закрытия этого пакета approved contour остается несинхронизированным.

## Exact Changes
1. Выпустить `project_brief_v0.4` с явной boundary:
   - `Manus` = research execution layer;
   - `VS Code/Codex` = repo/spec execution layer;
   - repo artifacts = handoff layer.
2. Выпустить `experiment_charter_stage_a_v0.4` с явной boundary между research execution и repo/spec execution.
3. Нормализовать upload README как versioned approved doc:
   - выпустить `README_upload_to_projects_v0.1`;
   - legacy unversioned file перевести в `outdated`.
4. Выпустить `decision_log_v0.6`, чтобы:
   - обновить current approved contour;
   - явно зафиксировать, что residual sync-impact по `decision_003` закрыт.
5. Обновить canonical `version_registry` и `change_log`.
6. Обновить `docs/indexes/current_handoff.md` под активную задачу.

## Explicit Non-Changes
- Не менять `master_instruction_v0.3`.
- Не менять `spec_governance_v0.2`.
- Не менять `output_contract_v0.2`.
- Не менять `test_set_v0.2`.
- Не вводить новые architecture decisions beyond alignment with `decision_003`.

## Cross-Doc Sync Required
- `docs/indexes/version_registry.md`
- `docs/indexes/change_log.md`
- `docs/indexes/current_handoff.md`

## Risks
- Если обновить только `project_brief` и `experiment_charter`, `decision_log` останется stale относительно текущего approved contour.
- Если оставить unversioned README в `docs/approved`, lifecycle approved docs останется не до конца нормализованным.
- Если boundary Manus vs VS Code/Codex будет сформулирована несимметрично в разных docs, возникнет новая governance ambiguity.

## Approval
Approved
