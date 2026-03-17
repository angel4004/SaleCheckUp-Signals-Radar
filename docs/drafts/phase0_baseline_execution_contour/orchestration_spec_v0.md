# Orchestration Spec v0

## Status
pre-cutover draft

## Purpose
Этот документ фиксирует baseline recommendation для orchestration pattern в `Phase 0`.

## Recommended pattern
Используется только manager-style orchestration.

## Minimal roles
### `run_manager`
Отвечает за:
- принятие `run_input_package`;
- сбор execution parameters;
- запуск request flow;
- обновление `run_state`;
- контроль completeness bundle.

### `research_worker`
Отвечает за:
- выполнение собственно research step;
- подготовку candidate outputs;
- связывание evidence с candidate signals;
- возврат материалов для bundle assembly.

### `bundle_writer`
Отвечает за:
- финальную сборку `run_manifest.json`;
- финальную сборку `candidate_signals.jsonl`;
- финальную сборку `evidence_index.jsonl`;
- финальную сборку `run_synthesis_ru.md`;
- финальную сборку `project_update_block_ru.md`.

## Coordination rule
`run_manager` остается единой точкой orchestration.  
`research_worker` и `bundle_writer` не создают параллельную control plane.

## Out of scope
Этот baseline intentionally excludes:
- `validator_gate`
- `run_dashboard`
- `auto_sync`
- `historical_rescoring`
- provider failover experimentation
- multi-model experimentation
- production queueing / job-control system
