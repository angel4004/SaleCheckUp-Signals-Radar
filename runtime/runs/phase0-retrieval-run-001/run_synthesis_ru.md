# Run Synthesis

## Run Goal
Проверить, что baseline contour умеет выполнять реальный retrieval run через OpenRouter web plugin и собирать evidence_index.

## Current Hypothesis
После успешного smoke/parity baseline contour должен уметь получать внешний web evidence и сохранять его в стабильный run bundle.

## What Was Checked
Проверен retrieval boundary: local runner -> OpenRouter -> web plugin -> pinned openai model -> run bundle.

## Search Queries
- hotel missed call booking revenue case study
- hotel direct booking abandonment recovery revenue case study
- hotel AI reservation agent direct bookings case study

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
Получено web evidence entries: 5

## Candidate Signals
Phase 0 retrieval boundary only. Candidate extraction remains intentionally minimal.

## Known Gaps
- Нет validator layer
- Нет dashboard layer
- Нет auto_sync
- Нет mature candidate extraction logic
- Нужен review качества внешнего evidence

## Recommended Next Step
Если evidence корректный, перейти к retrieval review и решить, делать ли validator_gate следующим шагом.

## Raw Assistant Output
{
  "what_was_checked": "Verified baseline contour's capability to perform a real retrieval run using the OpenRouter web plugin and capture external web evidence into the evidence_index. Focus was on retrieval functionality and stable evidence bundle storage under Variant A with constraints excluding validator_gate, run_dashboard, auto_sync, and repo mutation.",
  "potentially_important_findings": [
    "OpenRouter API integration was successfully merged into AI service framework enabling external data fetch and streaming completions through a new `/ai/completion` endpoint, confirming retrieval plugin feasibility and real-time evidence retrieval flow [github.com](https://github.com/ghostfolio/ghostfolio/pull/5025).",
    "Case studies demonstrate quantifiable revenue impact from AI-driven hotel solutions that optimize direct bookings and reduce call abandonment, such as StayGrid AI increasing hotel revenue by 35% in 90 days and Qcall.ai cutting call abandonment by 84%, providing strong, relevant external evidence for retrieval [agilesoftlabs.com](https://www.agilesoftlabs.com/blog/2026/02/staygrid-ai-case-study-how-50-room), [qcall.ai](https://qcall.ai/reduce-hotel-call-abandonment).",
    "Evidence from abandonment recovery campaigns by Eden Hotels and Ovolo Hotels shows conversion uplift and high ROI from email remarketing and cart abandonment recovery strategies, supporting rich, actionable content for the retrieval context [hotelchamp.com](https://www.hotelchamp.com/blog/case-study-eden-hotels-converting-leaving-booking-engine-guests), [hospitalitynet.org](https://www.hospitalitynet.org/news/4128094.html)."
  ],
  "known_gaps": [
    "No run_dashboard or validator_gate implies the synthesis and validation steps remain manual and outside this retrieval boundary test.",
    "Current evidence reflects hotel industry domain but lacks direct integration testing details on evidence indexing format stability and sync.",
    "Limited insight on multi-turn or iterative retrieval over web plugins beyond initial external API completion."
  ],
  "recommended_next_step": "Produce the requested artifacts documenting the retrieval run manifest, candidate signals extracted, and indexed external evidence. Synthesize findings into run_synthesis_ru.md emphasizing retrieval success and external evidence value. Update project_update_block_ru.md highlighting achievement of stable retrieval with OpenRouter web plugin under Variant A and constraints, while outlining next integration phases for validation and dashboarding."
}
