# Phase 0 Architecture Decision

## Status
pre-cutover draft

## Purpose
Этот документ фиксирует минимальный baseline execution contour для `Phase 0` как repo-resident package.

`Phase 0` не является текущим approved contour и не заменяет действующий research contour.

## Target baseline contour
- `ChatGPT Project` = thinking / governance workspace
- `OpenRouter` = execution gateway
- `openai/...` = pinned baseline model family
- `Codex cloud` = target repo / code / docs executor

## Intended outcome
Нужно получить минимальный execution contour, который уже:
- testable;
- observable;
- repeatable;
- пригоден для дальнейшего включения quality levers по одному.

## Practical boundary
`Phase 0` intentionally does not build:
- full production architecture;
- validator gate;
- dashboard;
- auto_sync;
- historical_rescoring;
- provider failover experiments;
- full research-memory layer.

## Contradictions with the current approved contour
### 1. Source of truth contradiction
Текущий approved contour фиксирует `Git` как source of truth для approved docs и version history.

Target baseline contour из этого package использует формулировку `ChatGPT Project` как current source of truth for project work.

Этот пакет не пытается молча разрешить это противоречие.  
Для `Phase 0` оно трактуется как future cutover question, а не как уже принятый operating rule.

### 2. Research execution contradiction
Текущий approved contour использует `Manus` как research execution layer.

Target baseline contour этого package использует `OpenRouter + pinned openai/...` как baseline execution contour.

В `Phase 0` это остается draft baseline, а не active replacement.

### 3. Output contract contradiction
Текущий approved `output_contract` описывает Manus-oriented run artifact model:
- `new_cases.jsonl`
- `updated_cases.jsonl`
- `new_signals.jsonl`
- `held_items.jsonl`
- `rejected_items.jsonl`
- `run_synthesis_ru.md`

`Phase 0` package вводит другой minimal bundle:
- `run_manifest.json`
- `candidate_signals.jsonl`
- `evidence_index.jsonl`
- `run_synthesis_ru.md`
- `project_update_block_ru.md`

Этот bundle не объявляется новым active approved run standard.

### 4. Runtime placement contradiction
Repo сейчас фактически docs-only и не содержит естественного runtime / code area.

Поэтому `Phase 0` intentionally remains documentation-first and does not create new production-like runtime code.

## Phase 0 operating rule
`Phase 0` создается как pre-cutover baseline package:
- он живет в draft layer;
- он не заменяет current approved contour;
- он может использоваться для controlled baseline design, parity planning и future cutover preparation;
- любое включение этого baseline в active approved contour требует отдельного approved governance wave.

## Acceptance logic for Phase 0
`Phase 0` считается practically successful только если later parity execution покажет, что:
- comparable runs завершаются предсказуемо;
- каждый run дает один consolidated bundle;
- review больше не требует собирать смысл из scattered artifacts;
- provider policy фиксируется явно;
- новые experimental runs можно запускать по новому baseline contour.

## Placement rationale
`docs/drafts/phase0_baseline_execution_contour/` — least disruptive placement, потому что:
- не смешивает baseline package с active approved contour;
- использует уже существующий draft layer;
- оставляет открытым future cutover without silent governance rewrite.
