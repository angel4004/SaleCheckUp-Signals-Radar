# Test Set v0.2

## Назначение
Этот документ нужен для первичной проверки того, как Manus отличает сильные сигналы от шума.

Он используется до первого полноценного run и затем может расширяться в следующих версиях.

## Ожидаемая модель результата
Manus должен уметь различать три независимых слоя оценки записи:

### 1. `signal_type`
- `confirmed_case`
- `monetizable_pain_signal`
- `technology_shift_signal`
- `none`

### 2. `resolution_status`
- `accepted`
- `rejected`
- `hold`

### 3. `evidence_strength`
- `low`
- `medium`
- `high`

## Правило проверки
Для каждого материала Manus должен:
1. определить `signal_type`;
2. определить `resolution_status`;
3. определить `evidence_strength`;
4. кратко объяснить, почему материал отнесен именно к такому сочетанию значений;
5. если `resolution_status = rejected` — объяснить, чего не хватает;
6. если `resolution_status = hold` — объяснить, почему запись нельзя корректно закрыть в `accepted` или `rejected`;
7. если запись не rejected — объяснить relevance для SaleCheckUp.

---

## Набор примеров

### Пример 1 — confirmed case
**Тип материала:** публичный кейс компании  
**Сигнал:** отель внедрил решение для обработки звонков и в кейсе указано, что доля пропущенных звонков снизилась, а доля доведенных до брони обращений выросла. Есть клиент, есть продукт, есть результат, есть метрики.

**Ожидаемый результат:**
- `signal_type = confirmed_case`
- `resolution_status = accepted`
- `evidence_strength = high`

**Почему:** есть payer, outcome, money-link и подтвержденный кейс.

---

### Пример 2 — confirmed case
**Тип материала:** vendor case study  
**Сигнал:** поставщик решения публикует кейс сети отелей, где после внедрения revenue-management решения вырос ADR и RevPAR. Указан клиент, временной период и несколько метрик.

**Ожидаемый результат:**
- `signal_type = confirmed_case`
- `resolution_status = accepted`
- `evidence_strength = high`

**Почему:** это подтвержденный кейс с прямой близостью к деньгам.

---

### Пример 3 — monetizable_pain_signal
**Тип материала:** серия отзывов и обсуждений  
**Сигнал:** в нескольких публичных обсуждениях руководители отделов бронирования жалуются, что лиды и звонки теряются ночью и в выходные, follow-up происходит несистемно, заявки не дожимаются до брони.

**Ожидаемый результат:**
- `signal_type = monetizable_pain_signal`
- `resolution_status = accepted`
- `evidence_strength = medium`

**Почему:** кейса с подтвержденным результатом нет, но видна near-money боль и утечка выручки.

---

### Пример 4 — monetizable_pain_signal
**Тип материала:** обзор рынка и жалобы пользователей  
**Сигнал:** из обзора и отзывов видно, что отели недовольны сложностью существующих CRM/workflow-решений, из-за чего лиды обрабатываются медленно, upsell практически не делается, а выручка теряется на процессе.

**Ожидаемый результат:**
- `signal_type = monetizable_pain_signal`
- `resolution_status = accepted`
- `evidence_strength = medium`

**Почему:** нет одного сильного кейса, но есть повторяющийся monetizable паттерн боли.

---

### Пример 5 — technology_shift_signal
**Тип материала:** обзор новой технологии  
**Сигнал:** появились AI-native voice / speech systems, которые могут автоматически разбирать звонки, выявлять lost booking intent и стоить дешевле тяжелых enterprise-решений.

**Ожидаемый результат:**
- `signal_type = technology_shift_signal`
- `resolution_status = accepted`
- `evidence_strength = medium`

**Почему:** это не кейс, а технологический сдвиг, который может решать уже понятную monetizable-задачу.

---

### Пример 6 — technology_shift_signal
**Тип материала:** продуктовый обзор + use case  
**Сигнал:** новый класс AI-инструментов позволяет малым отелям запускать guest communication automation без долгого внедрения и тяжелой интеграции, потенциально заменяя более дорогие старые решения.

**Ожидаемый результат:**
- `signal_type = technology_shift_signal`
- `resolution_status = accepted`
- `evidence_strength = medium`

**Почему:** главный смысл — не подтвержденный результат, а новая возможность решать старую задачу проще.

---

### Пример 7 — rejected material
**Тип материала:** AI news  
**Сигнал:** компания анонсировала AI-copilot для hospitality teams. В тексте нет клиента, нет результатов, нет метрик, нет понимания, кто и сколько платит.

**Ожидаемый результат:**
- `signal_type = none`
- `resolution_status = rejected`
- `evidence_strength = low`

**Почему:** это просто анонс новой функции без payer → outcome → money-link.

---

### Пример 8 — rejected material
**Тип материала:** feature release  
**Сигнал:** SaaS-компания выпустила новый dashboard для sales analytics. Описаны функции интерфейса, но неясно, кто покупает, зачем покупает и какой результат это дает.

**Ожидаемый результат:**
- `signal_type = none`
- `resolution_status = rejected`
- `evidence_strength = low`

**Почему:** feature release без понятного monetizable сигнала.

---

### Пример 9 — rejected material
**Тип материала:** трендовая статья  
**Сигнал:** статья о том, что AI меняет travel-индустрию и что компании должны готовиться к новому будущему. Конкретных кейсов, болей и money-link нет.

**Ожидаемый результат:**
- `signal_type = none`
- `resolution_status = rejected`
- `evidence_strength = low`

**Почему:** это buzz и общий тренд, а не рабочий сигнал.

---

### Пример 10 — пограничный случай
**Тип материала:** маркетинговая страница с use case  
**Сигнал:** страница описывает, что решение помогает увеличить конверсию обращений в брони, но без конкретного клиента и без подтвержденных метрик. При этом use case выглядит реалистично и релевантно для SaleCheckUp.

**Ожидаемый результат:**
- `signal_type = monetizable_pain_signal`
- `resolution_status = hold`
- `evidence_strength = low`

**Почему:** сигнал выглядит релевантным и потенциально monetizable, но он недостаточно подтвержден. Manus не должен автоматически превращать это в accepted case или accepted signal.

---

## Критерий успешности test set
Тестовый прогон по этому набору считается успешным, если:
- точность определения `signal_type` и `resolution_status` по набору не ниже 80%;
- пограничные случаи не превращаются автоматически в `confirmed_case` или в accepted signal без достаточных оснований;
- каждое решение сопровождается понятным объяснением relevance для SaleCheckUp, причины reject или причины hold;
- модель не смешивает semantic type и resolution state.