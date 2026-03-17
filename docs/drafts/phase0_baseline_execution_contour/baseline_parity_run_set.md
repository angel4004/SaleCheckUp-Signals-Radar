# Baseline Parity Run Set

## Status
pre-cutover draft

## Purpose
Этот документ задает минимальный parity set для `Phase 0`.

Parity здесь тестирует **stability of the contour**, а не research superiority против текущего Manus contour.

## Shared baseline conditions
Все три parity runs должны идти при одинаковых baseline условиях:
- same model family;
- same provider policy;
- same bundle contract;
- same stopping discipline;
- same review template.

### Fixed baseline conditions
- `model_family = openai`
- model ids are pinned `openai/...`
- `provider_policy.allow_fallbacks = false`
- review template = `_template_run_synthesis_ru.md` + `_template_project_update_block_ru.md`

## Required run set
### Run 1 — recent/global lane
Проверяет, дает ли contour предсказуемый baseline bundle на свежем global lane.

### Run 2 — RU-or-market-specific lane
Проверяет, сохраняется ли repeatability при локализованной market scope.

### Run 3 — revisit lane
Проверяет, способен ли contour повторяемо собирать bundle на revisit scenario без смены baseline условий.

## Evaluation rule
Parity считается достигнутой не тогда, когда один contour “умнее”, а когда baseline contour:
- воспроизводимо собирает один consolidated bundle;
- сохраняет одинаковую execution discipline across runs;
- не требует заново изобретать flow и review surface для каждого run.

## Explicit non-goal
Этот parity set не доказывает:
- research superiority;
- production readiness;
- superiority over Manus;
- готовность quality levers beyond Phase 0.
