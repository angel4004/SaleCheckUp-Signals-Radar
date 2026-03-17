# Run Contract v0

## Status
pre-cutover draft

## Purpose
Этот документ задает минимальный baseline contract для `Phase 0` execution contour.

Он не заменяет текущий approved `output_contract.md` и не является active run standard до отдельного cutover decision.

## Core objects
В `Phase 0` используются три обязательных объекта:
1. `run_input_package`
2. `run_state`
3. `run_bundle`

## 1. run_input_package
`run_input_package` является единым structured input object.

### Required fields
- `run_id`
- `run_goal`
- `current_hypothesis`
- `approved_context_snapshot`
- `constraints`
- `requested_outputs`

### Meaning
- `run_id` — уникальный идентификатор baseline run;
- `run_goal` — какую baseline-задачу должен закрыть run;
- `current_hypothesis` — какая гипотеза baseline contour сейчас проверяется;
- `approved_context_snapshot` — grounding на current approved contour, а не на draft assumptions;
- `constraints` — execution limits и boundary;
- `requested_outputs` — какой consolidated bundle должен вернуться на выходе.

## 2. run_state
`run_state` является client-managed state object.

### Required fields
- `run_id`
- `model_id`
- `provider_policy`
- `request_history`
- `intermediate_outputs`
- `run_status`
- `started_at`
- `completed_at`

### Rules
- run state управляется на client side;
- server-side run state на execution gateway не предполагается;
- `provider_policy` обязателен как explicit routing object;
- `request_history` обязан хранить request refs, достаточные для later audit.

## 3. run_bundle
`run_bundle` является единым consolidated output package.

### Required files
- `run_manifest.json`
- `candidate_signals.jsonl`
- `evidence_index.jsonl`
- `run_synthesis_ru.md`
- `project_update_block_ru.md`

### Bundle rule
Смысл baseline run не должен распадаться на несвязанные scattered artifacts.  
Каждый `Phase 0` run должен завершаться одним bundle.

## Baseline provider and model rules
- runtime secret: `OPENROUTER_API_KEY`
- secret loading: environment only
- model family: pinned `openai/...` only
- mixed model family behavior: out of scope
- unpinned model ids: not allowed

## Provider policy rule
`provider_policy` обязателен и должен присутствовать:
- в `run_state`;
- в `run_manifest.json`

### Minimum fields
- `order`
- `allow_fallbacks`
- `require_parameters`

### Baseline defaults
- `allow_fallbacks: false`
- `require_parameters: true`

## Provisional artifact rule
`candidate_signals.jsonl` в этом baseline contour является pre-validator artifact.

Поэтому любые signal-typing fields в нем должны трактоваться как provisional proposals, а не как final validated classification.

## Boundary
Этот contract:
- не заменяет active approved Manus run contract;
- не вводит validator logic;
- не вводит final production runtime;
- не создает automatic write-back в ChatGPT Project.
