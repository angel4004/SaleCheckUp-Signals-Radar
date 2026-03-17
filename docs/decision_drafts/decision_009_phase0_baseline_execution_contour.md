# Decision Draft

## Status
Draft

## Decision ID
decision_009

## Title
Phase 0 baseline execution contour as a pre-cutover draft package

## Scope
Подготовка minimal baseline execution contour как docs-first pre-cutover package без переключения active approved contour.

## Problem
Текущий approved contour уже задает governance loop, handoff contract и Manus-oriented run standard, но не содержит отдельного minimal baseline execution package для будущего OpenRouter / pinned OpenAI contour.

Из-за этого сейчас трудно:
- тестировать минимальный baseline contour отдельно от будущих quality levers;
- обсуждать cutover на уровне repo-resident artifacts;
- удерживать boundary между baseline execution package и active approved contour;
- подготовить repeatable bundle contract без преждевременного production redesign.

## Decision
Принято следующее решение для `Phase 0`.

1. `Phase 0 baseline execution contour` вводится как docs-first pre-cutover draft package.
2. Package живет в `docs/drafts/phase0_baseline_execution_contour/`.
3. Package не заменяет current approved contour и не объявляет active cutover.
4. Package фиксирует:
   - target baseline contour;
   - minimal run contract;
   - runtime flow;
   - orchestration pattern;
   - repo execution boundary;
   - parity run set;
   - cutover template;
   - secret policy;
   - minimal artifact templates.
5. Runtime code scaffold не вводится, потому что в repo нет естественного runtime / code area.
6. Repo-wide hygiene добавляется только в минимальном объеме:
   - `.gitignore`
   - `env.example`
7. `current_handoff.md` должен явно фиксировать, что:
   - current approved contour remains active;
   - `phase0_baseline_execution_contour` is a pre-cutover draft package;
   - no active contour replacement is claimed.

## Rationale
Эта модель позволяет подготовить baseline execution contour как testable, observable и repeatable package, не ломая действующий approved Manus contour и не симулируя неутвержденный cutover.

Она лучше широкого redesign, потому что:
- создает repo-resident baseline package уже сейчас;
- не требует искусственно придумывать production runtime folder;
- явно удерживает contradictions вместо молчаливой подмены active rules;
- оставляет future cutover как отдельное governance decision.

## Consequences
### Draft-layer consequences
- появляется новый draft package в `docs/drafts/phase0_baseline_execution_contour/`;
- появляются minimal JSON / JSONL / Markdown templates для baseline bundle;
- появляется explicit secret hygiene baseline.

### Governance consequences
- current approved contour не меняется;
- `version_registry`, `change_log` и `approved_contour_history` не обновляются;
- change остается draft-layer package, а не approved contour migration.

### Contradictions explicitly carried forward
- current approved source of truth = `Git`, target baseline wording = `ChatGPT Project`;
- current research executor = `Manus`, target baseline executor = `OpenRouter + openai/...`;
- current approved run bundle != draft Phase 0 bundle;
- current approved repo executor label = `VS Code/Codex`, target baseline label = `Codex cloud`.

## Affected Documents
- docs/drafts/phase0_baseline_execution_contour/phase0_architecture_decision.md
- docs/drafts/phase0_baseline_execution_contour/run_contract_v0.md
- docs/drafts/phase0_baseline_execution_contour/runtime_flow_spec_v0.md
- docs/drafts/phase0_baseline_execution_contour/orchestration_spec_v0.md
- docs/drafts/phase0_baseline_execution_contour/repo_execution_boundary.md
- docs/drafts/phase0_baseline_execution_contour/baseline_parity_run_set.md
- docs/drafts/phase0_baseline_execution_contour/cutover_decision_template.md
- docs/drafts/phase0_baseline_execution_contour/secret_policy_v0.md
- docs/drafts/phase0_baseline_execution_contour/_template_run_input_package.json
- docs/drafts/phase0_baseline_execution_contour/_template_run_state.json
- docs/drafts/phase0_baseline_execution_contour/_template_run_manifest.json
- docs/drafts/phase0_baseline_execution_contour/_template_evidence_index.jsonl
- docs/drafts/phase0_baseline_execution_contour/_template_candidate_signals.jsonl
- docs/drafts/phase0_baseline_execution_contour/_template_run_synthesis_ru.md
- docs/drafts/phase0_baseline_execution_contour/_template_project_update_block_ru.md
- docs/indexes/current_handoff.md
- .gitignore
- env.example

## Version Impact
- approved documents: no change
- stable approved paths remain unchanged
- `version_registry`: no change
- `change_log`: no change

## History / Snapshot Impact
- current_snapshot_id: `approved_contour_2026-03-15_decision_008`
- superseded_snapshot_ids: none
- recovery_model_change: no
- new snapshot required: no

## Boundary
Это решение:
- не делает `Phase 0` active approved contour;
- не меняет approved docs;
- не меняет run logic действующего Manus contour;
- не вводит runtime code scaffold;
- не вводит validator gate, dashboard, auto_sync или historical rescoring.

## Approval
Pending
