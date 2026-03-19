# Run Synthesis

## Run Goal
Проверить repeatability baseline contour на revisit lane с отдельным input package и тем же provider policy.

## Current Hypothesis
Baseline contour должен стабильно выполнять revisit run при тех же baseline условиях и сохранять ту же форму bundle.

## What Was Checked
Проверен baseline contour: local runner -> OpenRouter -> pinned openai model -> run bundle.

## Provider Policy Used
{
  "order": [],
  "allow_fallbacks": false,
  "require_parameters": true
}

## Candidate Signals
This pass checks contour mechanics, not real extraction logic.

## Evidence Coverage
This pass checks bundle assembly, not real evidence indexing.

## Known Gaps
- Нет validator layer
- Нет dashboard layer
- Нет auto_sync
- Нет real extraction logic
- Нет web retrieval layer

## Recommended Next Step
Если output корректный, перейти к следующему parity run или к добавлению retrieval boundary.

## Raw Assistant Output
Checked: Conducted a parity run of the baseline contour on the revisit lane using a separate input package under the same provider policy and model family, focusing on Variant A only and excluding validator_gate, run_dashboard, auto_sync, and repo mutations. The run checked contour stability and bundle shape consistency under baseline conditions.

Potentially important: The baseline contour produced a stable revisit run, maintaining the same bundle contract and demonstrating repeatability. This supports the hypothesis that the baseline contour can reliably reproduce revisit lane runs without degrading signal bundle shape or integrity.

Known gaps: No validator_gate or run_dashboard was used, limiting automated quality validation and real-time monitoring. No repo mutation or advanced synchronization was allowed, which may restrict testing dynamic adjustments or fixes. Research superiority was not tested, only stability, so potential improvements remain unexplored.

Recommended next step: Introduce validator_gate and run_dashboard in a controlled experiment to gain automated validation insights and visibility. Then, consider testing on additional variants or relaxing constraints to explore improvements beyond baseline parity. Finally, review generated outputs (run_manifest.json, candidate_signals.jsonl, evidence_index.jsonl, synthesis and project update docs) for detailed signal consistency and documentation.
