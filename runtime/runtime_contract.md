# Runtime Contract

## Purpose
Этот файл фиксирует execution contract для текущего local runtime contour вокруг SaleCheckUp Signals Radar.

## Scope
Контракт относится к model-backed runtime layers:
- retrieval
- validator
- review

Он не заменяет project governance docs и не заменяет Project Instructions.
Он фиксирует именно технические и execution-level правила этого runtime contour.

## Rule 1. One execution contour
Все model-backed runtime layers работают внутри одного execution contour.
Нельзя смешивать разные auth contracts, разные transport paths и разные model access patterns внутри одного незавершённого слоя.

## Rule 2. OpenRouter only for this contour
Для текущего contour model-backed layers используют OpenRouter как execution gateway.
API access идёт через:
- environment variable: `OPENROUTER_API_KEY`
- base URL: `https://openrouter.ai/api/v1`

## Rule 3. Role split by task fit
Модели выбираются по роли, а не по принципу "одна самая сильная везде".

Current working split:
- retrieval: `openai/gpt-4o-mini-search-preview`
- validator: `openai/gpt-5.4-mini`
- review: `openai/gpt-5.4-mini`

## Rule 4. No silent fallback on auth/model failure
Если слой задуман как model-backed layer, ошибка auth/model call не должна молча маскироваться под успешный результат.
Auth/model failure должен быть явно виден как error или явный fallback mode, если fallback специально предусмотрен и помечен.

## Rule 5. Exact cardinality rule
Если слой принимает список сущностей, он не должен молча терять элементы.
Ожидание по умолчанию:
- one input entity -> one output entity

Примеры:
- one evidence item -> one validated signal
- one candidate_id -> one reviewed signal

## Rule 6. Conservative evidence policy
Vendor/self-reported material не считается автоматически подтверждённым кейсом.
Без независимой верификации такой материал не должен автоматически переходить в `confirmed_case` или `accept`.

## Rule 7. Review/decision conservatism
Если evidence слабый, неоднозначный или не даёт независимого подтверждения денежной боли, слой review должен предпочитать:
- `hold`
а не преждевременный `accept`.

## Rule 8. Runtime contract first, memory second
Перед изменением model-backed runtime layers нужно сначала проверять активный runtime contract, а не опираться только на память из чата.

## Current baseline status
Текущий baseline contour считается собранным в такой форме:
- retrieval -> OpenRouter/OpenAI
- validator -> OpenRouter/OpenAI
- review -> OpenRouter/OpenAI

## Known limits
Этот contour пока не означает:
- production readiness
- fully autonomous portfolio prioritization
- approved migration of the whole project governance layer

Это только working runtime baseline for Phase 0A execution contour.
