# Output Contract v0.1

## Назначение
Этот документ фиксирует, что именно Manus обязан возвращать по итогам каждого run и в каком виде должен быть устроен результат.

## Единица учета
Единица учета — **run**.

Каждый run должен иметь собственный набор артефактов.

## Обязательные артефакты run
1. `run_manifest.json`
2. `new_cases.jsonl`
3. `updated_cases.jsonl`
4. `new_signals.jsonl`
5. `rejected_items.jsonl`
6. `daily_synthesis_ru.md`

## Общие правила
1. Машинные ключи и enum-значения — на английском.
2. Аналитические объяснения и human-readable layer — на русском.
3. Если данные неизвестны, это нужно явно помечать, а не выдумывать.
4. Если сумма оплаты неизвестна, нужно попытаться дать оценку и явно пометить ее тип:
   - exact
   - estimated_with_evidence
   - rough_inference
5. Case, signal и reject не должны смешиваться.
6. Один и тот же кейс нельзя дублировать в одном и том же run.

## 1. run_manifest.json
Этот файл описывает сам run.

### Обязательные поля
- `run_id`
- `run_timestamp`
- `project_name`
- `objective`
- `market_scope`
- `summary`

### Поле summary должно содержать
- `sources_scanned`
- `items_considered`
- `new_cases_added`
- `existing_cases_updated`
- `new_signals_added`
- `items_rejected`

## 2. new_cases.jsonl
Содержит новые confirmed cases, найденные в текущем run.

### Обязательные поля каждой записи
- `case_id`
- `status`
- `date_added`
- `date_updated`
- `company_vendor`
- `customer_or_segment`
- `market_relevance`
- `source_geography`
- `applicability_to_russia`
- `global_scalability_signal`
- `signal_type`
- `what_customer_pays_for`
- `estimated_spend`
- `jtbd`
- `business_problem`
- `outcome`
- `metrics`
- `money_proximity`
- `evidence_type`
- `trust_level`
- `source_links`
- `technology_used`
- `better_technology_opportunity`
- `relevance_for_salecheckup`
- `hypothesis_for_salecheckup`
- `scores`

### Правила
- `signal_type` для кейсов должен быть `confirmed_case`
- `estimated_spend` обязателен даже если это оценка, а не факт
- `status` должен быть `new`

## 3. updated_cases.jsonl
Содержит кейсы, которые уже были известны, но обновились новыми данными.

### Обязательные поля
Те же, что и для `new_cases.jsonl`.

### Дополнительно
- `status` должен быть `updated`
- должно быть понятно, что именно изменилось

Рекомендуемое дополнительное поле:
- `update_reason`

## 4. new_signals.jsonl
Содержит новые сигналы двух типов:
- `monetizable_pain_signal`
- `technology_shift_signal`

### Обязательные поля каждой записи
- `signal_id`
- `date_added`
- `date_updated`
- `signal_type`
- `title`
- `description`
- `market_relevance`
- `source_geography`
- `applicability_to_russia`
- `global_scalability_signal`
- `evidence_strength`
- `supporting_sources`
- `money_link`
- `relevance_for_salecheckup`
- `hypothesis_for_salecheckup`

### Правила
- signal нельзя выдавать за case
- если сигнал не подтвержден, это должно быть видно из полей `evidence_strength` и `description`

## 5. rejected_items.jsonl
Содержит материалы, которые Manus рассмотрел, но отклонил как шум или слабый сигнал.

### Обязательные поля каждой записи
- `item_id`
- `title`
- `source_type`
- `rejection_reason_ru`
- `would_reconsider_if_ru`

### Правила
- reject лог обязателен
- rejected item не должен попадать в cases или signals
- причина reject должна быть понятной и проверяемой

## 6. daily_synthesis_ru.md
Человеко-читаемый слой по итогам run.

### Обязательные разделы
1. Что нового найдено
2. За что и сколько люди платят
3. Какие результаты они покупают
4. Какие сигналы ближе всего к деньгам
5. Какие текущие решения выглядят переусложненными, дорогими или устаревающими
6. Какие новые технологии могут дать тот же результат лучше
7. Что это значит для SaleCheckUp
8. 1–3 гипотезы для SaleCheckUp

## Требования к качеству
1. Не путать факт, обещание и inference.
2. Не выдавать оценку оплаты как факт, если это inference.
3. Не тащить AI-news и feature releases в cases.
4. Не заполнять обязательные поля бессодержательным текстом.
5. Не добавлять кейс, если нельзя объяснить его relevance для SaleCheckUp.

## Минимальный критерий приемки run
Run можно считать пригодным к разбору только если:
- все обязательные файлы созданы;
- в них нет смешения case / signal / reject;
- у cases заполнено поле `estimated_spend`;
- human layer содержит хотя бы 1 гипотезу для SaleCheckUp.
