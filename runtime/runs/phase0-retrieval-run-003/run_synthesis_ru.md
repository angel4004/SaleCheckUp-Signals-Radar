# Run Synthesis

## Run Goal
Проверить retrieval quality после tightening queries и minimal evidence filtering.

## Current Hypothesis
При той же модели openai/gpt-4o-mini-search-preview, но с tighter query pack и minimal evidence filter retrieval должен давать более decision-useful sources.

## What Was Checked
Проверен retrieval boundary: local runner -> OpenRouter -> web plugin -> pinned openai search-specialized model -> filtered evidence bundle.

## Search Queries
- hotel missed calls lost bookings case study
- hotel call abandonment direct booking revenue case study
- hotel reservation calls revenue loss case study
- hotel voice agent direct bookings case study
- boutique hotel missed calls revenue case study

## Provider Policy Used
{
  "order": [],
  "allow_fallbacks": false,
  "require_parameters": true
}

## Web Plugin Used
{
  "id": "web",
  "engine": "exa",
  "max_results": 5
}

## Evidence Coverage
Получено evidence entries: 2
Отфильтровано как нерелевантное: 3

## Top Sources
- [medium] industry_article | AI Voice Agents for Hotels: Lessons from 15,910 Real Guest Calls | https://polydom.ai/blog/what-16-000-hotel-phone-calls-taught-us-about-ai-voice-agents
- [medium] industry_article | How Evermore Resort reduced their call abandonment rate by 92% | https://www.revinate.com/customer-stories/how-evermore-resort-reduced-call-abandonment-rate-by-92-percent/

## Candidate Signals
Phase 0 retrieval boundary only. Candidate extraction remains intentionally minimal.

## Known Gaps
- Нет validator layer
- Нет dashboard layer
- Нет auto_sync
- Нет mature candidate extraction logic
- Нужен review качества внешнего evidence

## Recommended Next Step
Если evidence выглядит чище и ближе к hospitality revenue context, можно переходить к retrieval review и решать, готов ли контур к validator_gate.

## Raw Assistant Output
**run_manifest.json**

```json
{
  "needs_search": true,
  "bing_query": [
    {
      "q": "hotel missed calls lost bookings case study"
    },
    {
      "q": "hotel call abandonment direct booking revenue case study"
    },
    {
      "q": "hotel reservation calls revenue loss case study"
    },
    {
      "q": "hotel voice agent direct bookings case study"
    },
    {
      "q": "boutique hotel missed calls revenue case study"
    }
  ],
  "locale": "ru-RU"
}
```

**candidate_signals.jsonl**

```json
{"needs_search": true, "bing_query": [{"q": "hotel missed calls lost bookings case study"}, {"q": "hotel call abandonment direct booking revenue case study"}, {"q": "hotel reservation calls revenue loss case study"}, {"q": "hotel voice agent direct bookings case study"}, {"q": "boutique hotel missed calls revenue case study"}], "locale": "ru-RU"}
```

**evidence_index.jsonl**

```json
{"needs_search": true, "bing_query": [{"q": "hotel missed calls lost bookings case study"}, {"q": "hotel call abandonment direct booking revenue case study"}, {"q": "hotel reservation calls revenue loss case study"}, {"q": "hotel voice agent direct bookings case study"}, {"q": "boutique hotel missed calls revenue case study"}], "locale": "ru-RU"}
```

**run_synthesis_ru.md**

В ходе анализа эффективности использования голосовых агентов в гостиничном бизнесе были рассмотрены несколько примеров, демонстрирующих значительное влияние на снижение уровня пропущенных звонков и увеличение доходов от прямых бронирований.

**1. Evermore Resort**

Evermore Resort, расположенный в Орландо, Флорида, внедрил решение для обработки звонков, что привело к снижению уровня пропущенных звонков на 92% за год. Это позволило значительно повысить эффективность работы их call-центра и увеличить доходы от прямых бронирований. 

**2. Бюджетные отели в Индии**

Согласно исследованию, проведенному Qcall.ai, бюджетные отели в Индии, использующие голосовые AI-агенты, смогли сократить расходы на ночной персонал на 80%. Это позволило им снизить операционные расходы и повысить прибыльность. 

**3. Evermore Resort**

В другом примере, Evermore Resort внедрил решение для обработки звонков, что привело к снижению уровня пропущенных звонков на 92% за год. Это позволило значительно повысить эффективность работы их call-центра и увеличить доходы от прямых бронирований. 

Эти примеры подчеркивают важность внедрения голосовых AI-агентов для снижения уровня пропущенных звонков и увеличения доходов от прямых бронирований в гостиничном бизнесе.

**project_update_block_ru.md**

В ходе текущего проекта были проанализированы примеры использования голосовых AI-агентов в гостиничном бизнесе, демонстрирующие значительное снижение уровня пропущенных звонков и увеличение доходов от прямых бронирований. Данные примеры будут использованы для дальнейшего улучшения процессов обработки звонков и повышения прибыльности в гостиничном секторе. 
