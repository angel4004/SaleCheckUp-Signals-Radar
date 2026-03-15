# Output Contract v0.5

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
5. `held_items.jsonl`
6. `rejected_items.jsonl`
7. `run_synthesis_ru.md`

## Общая модель оценки записи
Каждая рассмотренная запись должна интерпретироваться через три независимых слоя:

### 1. `signal_type`
Что это по содержанию:
- `confirmed_case`
- `monetizable_pain_signal`
- `technology_shift_signal`
- `none`

### 2. `resolution_status`
В каком состоянии находится запись после текущего run:
- `accepted`
- `rejected`
- `hold`

### 3. `evidence_strength`
Насколько сильны основания:
- `low`
- `medium`
- `high`

## Общие правила
1. Машинные ключи и enum-значения — на английском.
2. Аналитические объяснения и human-readable layer — на русском.
3. Если данные неизвестны, это нужно явно помечать, а не выдумывать.
4. Если сумма оплаты неизвестна, нужно попытаться дать оценку и явно пометить ее тип:
   - exact
   - estimated_with_evidence
   - rough_inference
5. Case, signal, hold и reject не должны смешиваться.
6. Один и тот же кейс нельзя дублировать в одном и том же run.
7. `reject` не является semantic class.
   - Если запись отклонена, это означает:
     - `resolution_status = rejected`
     - `signal_type = none`, если валидный тип сигнала не установлен
8. `hold` не является semantic class.
   - Если запись удержана, это означает:
     - `resolution_status = hold`
     - `signal_type` указывается только если он уже определен корректно; иначе используется `none`
9. Human-readable слой должен быть привязан к `run`, а не к `day` как обязательной единице документации.
10. Day-level grouping допустим только как фильтр, навигация и способ чтения, но не как обязательный artifact unit.

## 1. run_manifest.json
Этот файл описывает сам run, grounding на approved contour и search-governance layer.

### Обязательные поля
- `run_id`
- `run_timestamp`
- `project_name`
- `objective`
- `market_scope`
- `approved_contour_commit_sha`
- `approved_contour_paths`
- `search_governance`
- `summary`

### Поля grounding должны означать
- `approved_contour_commit_sha` — полный Git commit SHA approved contour, по которому выполнялся run.
- `approved_contour_paths` — список stable approved doc paths из `docs/approved/`, использованных для run.

Manual listing of versioned approved filenames не является корректной заменой этих полей.

Эти поля должны соответствовать contour snapshot, описанному в canonical history layer:
- `docs/indexes/approved_contour_history.md`;
- `docs/history/approved_contours/`.

### Обязательное поле search_governance
`search_governance` должен быть обязательным nested object со следующими полями:
- `decision_question`
- `uncertainty_to_reduce`
- `search_space_map`
- `time_window_primary`
- `time_window_secondary`
- `older_evidence_rule`
- `required_geographies`
- `optional_geographies`
- `reason_for_geography_selection`
- `source_coverage_plan`
- `revisit_targets`
- `new_exploration_targets`
- `revisit_reason`
- `stopping_rule`
- `stopping_reason`
- `coverage_summary`
- `covered_areas`
- `uncovered_areas`
- `main_blind_spots`
- `coverage_confidence`
- `recommended_next_search_lane`
- `next_run_rationale`

### Поля search_governance должны означать
- `decision_question` — какой decision question решает run;
- `uncertainty_to_reduce` — какую неопределенность run пытается снизить;
- `search_space_map` — object with non-empty arrays:
  - `market_axes`
  - `source_type_axes`
  - `geography_axes`
  - `time_axes`
- `time_window_primary` — object `{ start, end, selection_reason }`;
- `time_window_secondary` — object `{ start, end, selection_reason }`; `start` и `end` могут быть `null` только если secondary window не использовался и `selection_reason` говорит это явно;
- `older_evidence_rule` — правило, когда и зачем допустимо уходить в более старые источники;
- `required_geographies` — non-empty array географий, которые run обязан покрыть;
- `optional_geographies` — array географий, которые можно покрыть дополнительно;
- `reason_for_geography_selection` — почему именно эти рынки входят в search scope;
- `source_coverage_plan` — object with:
  - `required_source_types` as non-empty array
  - `optional_source_types` as array
- `revisit_targets` — array ранее известных направлений или объектов, которые нужно перепроверить;
- `new_exploration_targets` — array новых направлений поиска;
- `revisit_reason` — зачем в этом run нужны revisit targets;
- `stopping_rule` — правило, по которому run считает поиск достаточным для остановки;
- `stopping_reason` — почему поиск реально остановлен в этом run;
- `coverage_summary` — краткое human-readable summary о полноте покрытия;
- `covered_areas` — array того, что реально покрыто;
- `uncovered_areas` — array того, что осталось непокрытым;
- `main_blind_spots` — array главных blind spots текущего run;
- `coverage_confidence` — enum:
  - `low`
  - `medium`
  - `high`
- `recommended_next_search_lane` — какой следующий lane должен проверять следующий run;
- `next_run_rationale` — почему именно этот следующий lane снижает неопределенность лучше всего.

### Поле summary должно содержать
- `sources_scanned`
- `items_considered`
- `new_cases_added`
- `existing_cases_updated`
- `new_signals_added`
- `held_items_added`
- `items_rejected`

## 2. new_cases.jsonl
Содержит новые confirmed cases, найденные в текущем run.

### Обязательные поля каждой записи
- `case_id`
- `date_added`
- `date_updated`
- `company_vendor`
- `customer_or_segment`
- `market_relevance`
- `source_geography`
- `applicability_to_russia`
- `global_scalability_signal`
- `signal_type`
- `resolution_status`
- `what_customer_pays_for`
- `estimated_spend`
- `jtbd`
- `business_problem`
- `outcome`
- `metrics`
- `money_proximity`
- `evidence_type`
- `evidence_strength`
- `trust_level`
- `source_links`
- `technology_used`
- `better_technology_opportunity`
- `relevance_for_salecheckup`
- `hypothesis_for_salecheckup`
- `scores`

### Правила
- `signal_type` для кейсов должен быть `confirmed_case`
- `resolution_status` для кейсов в этом файле должен быть `accepted`
- `estimated_spend` обязателен даже если это оценка, а не факт

## 3. updated_cases.jsonl
Содержит кейсы, которые уже были известны, но обновились новыми данными.

### Обязательные поля
Те же, что и для `new_cases.jsonl`.

### Дополнительно
- должно быть понятно, что именно изменилось

### Рекомендуемое дополнительное поле
- `update_reason`

### Правила
- `signal_type` для кейсов должен быть `confirmed_case`
- `resolution_status` для кейсов в этом файле должен быть `accepted`

## 4. new_signals.jsonl
Содержит новые сигналы двух типов:
- `monetizable_pain_signal`
- `technology_shift_signal`

### Обязательные поля каждой записи
- `signal_id`
- `date_added`
- `date_updated`
- `signal_type`
- `resolution_status`
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
- `signal_type` должен быть одним из:
  - `monetizable_pain_signal`
  - `technology_shift_signal`
- `resolution_status` для сигналов в этом файле должен быть `accepted`
- signal нельзя выдавать за case
- если сигнал не подтвержден полностью, это должно быть видно из полей `evidence_strength` и `description`

## 5. held_items.jsonl
Содержит записи, которые Manus рассмотрел, но не может корректно закрыть в `accepted` или `rejected` в рамках текущего run.

### Обязательные поля каждой записи
- `item_id`
- `date_added`
- `date_updated`
- `signal_type`
- `resolution_status`
- `title`
- `description`
- `evidence_strength`
- `supporting_sources`
- `hold_reason_ru`
- `would_resolve_if_ru`
- `relevance_for_salecheckup`

### Правила
- `resolution_status` для всех записей в этом файле должен быть `hold`
- `signal_type` может быть:
  - `confirmed_case`
  - `monetizable_pain_signal`
  - `technology_shift_signal`
  - `none`
- `hold_reason_ru` должен объяснять, почему запись нельзя корректно принять или отклонить
- `would_resolve_if_ru` должен объяснять, что должно измениться, чтобы запись можно было перевести в `accepted` или `rejected`
- held item не должен одновременно попадать в `new_cases.jsonl`, `updated_cases.jsonl`, `new_signals.jsonl` или `rejected_items.jsonl` в рамках одного run

## 6. rejected_items.jsonl
Содержит материалы, которые Manus рассмотрел, но отклонил как шум или слабый сигнал.

### Обязательные поля каждой записи
- `item_id`
- `signal_type`
- `resolution_status`
- `title`
- `source_type`
- `rejection_reason_ru`
- `would_reconsider_if_ru`

### Правила
- `resolution_status` для всех записей в этом файле должен быть `rejected`
- `signal_type` по умолчанию должен быть `none`, если валидный тип сигнала не установлен корректно
- reject лог обязателен
- rejected item не должен попадать в cases, signals или held items
- причина reject должна быть понятной и проверяемой

## 7. run_synthesis_ru.md
Человеко-читаемый слой по итогам run.

### Обязательные разделы
1. Какой вопрос решал run
2. Какую неопределенность снижал run
3. Почему выбраны эти годы и месяцы
4. Почему выбраны эти страны и рынки
5. Какие типы источников были в coverage plan
6. Что реально покрыто, что осталось непокрытым и где blind spots
7. Почему поиск остановлен и насколько он был полным
8. Какой следующий search lane нужен
9. Что нового найдено
10. За что и сколько люди платят
11. Какие результаты они покупают
12. Какие сигналы ближе всего к деньгам
13. Какие записи удержаны в `hold` и почему
14. Какие текущие решения выглядят переусложненными, дорогими или устаревающими
15. Какие новые технологии могут дать тот же результат лучше
16. Что это значит для SaleCheckUp
17. 1–3 гипотезы для SaleCheckUp

Search Governance block должен идти перед текущими finding sections.

## Требования к качеству
1. Не путать факт, обещание и inference.
2. Не выдавать оценку оплаты как факт, если это inference.
3. Не тащить AI-news и feature releases в cases.
4. Не заполнять обязательные поля бессодержательным текстом.
5. Не добавлять кейс, если нельзя объяснить его relevance для SaleCheckUp.
6. Не прятать uncertainty внутрь уверенного класса, если корректное состояние записи — `hold`.
7. Не выдавать coverage как полный, если остаются существенные uncovered areas или blind spots.
8. Не останавливать поиск без явного stopping reason и next-run rationale.

## Минимальный критерий приемки run
Run можно считать пригодным к разбору только если:
- все обязательные файлы созданы;
- `run_manifest.json` содержит `approved_contour_commit_sha`, `approved_contour_paths` и `search_governance`;
- `search_governance` явно содержит decision question, coverage summary, stopping reason и recommended next search lane;
- в них нет смешения case / signal / hold / reject;
- у cases заполнено поле `estimated_spend`;
- `run_synthesis_ru.md` содержит Search Governance block с covered / uncovered areas, blind spots и stopping explanation;
- human-readable layer содержит хотя бы 1 гипотезу для SaleCheckUp.
