# Runtime Flow Spec v0

## Status
pre-cutover draft

## Purpose
Этот документ фиксирует intended runtime flow для `Phase 0` baseline contour.

## Baseline flow
`run_input_package -> client-side request assembly -> OpenRouter -> pinned openai model -> local state update -> run_bundle`

## Step meaning
1. `run_input_package`
   Клиент формирует единый structured input object.
2. `client-side request assembly`
   Клиент собирает executable request без предположения о server-side run state.
3. `OpenRouter`
   Gateway layer исполняет запрос к pinned `openai/...` model.
4. `local state update`
   Клиент обновляет `run_state`, request refs и intermediate outputs локально.
5. `run_bundle`
   Клиент собирает единый consolidated bundle.

## Runtime assumptions
- run state is client-managed;
- execution gateway does not own canonical run state;
- request refs should be captured locally;
- provider policy is applied explicitly by the client;
- repo mutation is outside runtime flow.

## Observability minimum
Минимальная observable surface для later parity checks:
- `run_id`
- `model_id`
- `provider_policy`
- `request_history`
- `run_status`
- bundle completeness

## Explicit non-goals
Этот flow не включает:
- validator gate;
- dashboard;
- auto_sync;
- historical rescoring;
- gateway-managed session memory;
- repo write-back;
- provider failover experiments.
