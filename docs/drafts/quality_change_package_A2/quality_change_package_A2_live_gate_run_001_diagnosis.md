# quality_change_package_A2_live_gate_run_001_diagnosis

Status: draft post-run diagnosis

References

- authoritative A2 minimal implementation package:
  - `docs/drafts/quality_change_package_A2/quality_change_package_A2_minimal_implementation_wave.md`
- execution-state and live gate record:
  - `docs/drafts/quality_change_package_A2/quality_change_package_A2_live_gate_run_001.md`

## 1. Human layer

Этот run доказал, что current contour проходит end-to-end в live режиме и не размягчает A1 decision discipline: retrieval, validator и review отработали по цепочке, а финальный статус остался `hold` с named gaps, concrete `next_step` и читаемым `evidence_trace`.

Этот run не доказал, что A2 materially improves recurring motif visibility в live conditions. A2 recurrence layer не был реально нагружен, потому что до validator дошёл только один surviving evidence item, а значит в run вообще не возникло условий для `weak_repeated_pattern`, `credible_pattern` или `decision_relevant_pattern`.

Идти сразу в следующий lane без диагноза рано, потому что иначе мы смешаем две разные проблемы: возможную sparsity самого lane и фактическое сужение contour уже на retrieval boundary. Сейчас важнее понять, почему intended recurrence lane не дал recurrence, чем просто сменить тему.

## 2. Run summary

- lane: `hotel_phone_abandonment`
- contour completion: `yes`
- A1 discipline appears intact: `yes`
- A2 recurrence logic materially exercised: `no`

## 3. Funnel diagnosis by stage

### Retrieval

- Retrieval produced `1` persisted evidence item and reported `8` skipped evidence items in [run_manifest.json](C:/Users/ilya.suvorov/Projects/Work/salecheckup_signals_radar_runtime/runs/a2-live-gate-001-retrieval/run_manifest.json).
- Persisted source mix was effectively single-source and single-family: one `industry_article`, one vendor/customer story from Revinate in [evidence_index.jsonl](C:/Users/ilya.suvorov/Projects/Work/salecheckup_signals_radar_runtime/runs/a2-live-gate-001-retrieval/evidence_index.jsonl).
- This already made A2 under-exercise likely before validator started: with only one persisted evidence item there was no path to within-run recurrence.
- Best-effort inference: the lane is not obviously empty, because retrieval raw synthesis referenced additional hotel phone-loss material, but the persisted evidence bundle still collapsed to one item. That points more to retrieval yield/selectivity than to proof that the lane itself has no recurring public motifs.

### Validator

- Validator kept `1` item in [validated_signals.jsonl](C:/Users/ilya.suvorov/Projects/Work/salecheckup_signals_radar_runtime/runs/a2-live-gate-001-validator/validated_signals.jsonl) and reported `repeated_pattern_key_count = 0` plus empty `pattern_state_counts` in [validation_manifest.json](C:/Users/ilya.suvorov/Projects/Work/salecheckup_signals_radar_runtime/runs/a2-live-gate-001-validator/validation_manifest.json).
- There were no recurring candidates with shared `pattern_key`, because recurrence in this wave starts only at `same pattern_key >= 2 inside one validator batch`, and the batch cardinality was `1`.
- There were therefore no live conditions for `weak_repeated_pattern`, `credible_pattern`, or `decision_relevant_pattern`.
- This does not look like validator overfiltering or grouping failure. The single item survived as a `monetizable_pain_signal`; validator simply had nothing to group.

### Review

- Review produced `1` final reviewed item in [reviewed_signals.jsonl](C:/Users/ilya.suvorov/Projects/Work/salecheckup_signals_radar_runtime/runs/a2-live-gate-001-review/reviewed_signals.jsonl) with `hold = 1`, `accept = 0`, `reject = 0` in [review_manifest.json](C:/Users/ilya.suvorov/Projects/Work/salecheckup_signals_radar_runtime/runs/a2-live-gate-001-review/review_manifest.json).
- No pattern markers were preserved because validator emitted no `pattern_assessment` in this run.
- A1 conservatism appears to have worked correctly, not excessively: the item stayed `hold` for missing independent validation and attribution specificity, with blocker and concrete `next_step` intact.
- Review did not suppress recurrence wrongly; it simply had no meaningful recurrence signal to exercise.

## 4. Failure mode classification

### `retrieval_under_yield`

- short explanation:
  - The contour narrowed before validator because retrieval persisted only one evidence item while also reporting eight skipped items.
- evidence from artifacts:
  - [run_manifest.json](C:/Users/ilya.suvorov/Projects/Work/salecheckup_signals_radar_runtime/runs/a2-live-gate-001-retrieval/run_manifest.json): `evidence_count = 1`, `skipped_evidence_count = 8`
  - [evidence_index.jsonl](C:/Users/ilya.suvorov/Projects/Work/salecheckup_signals_radar_runtime/runs/a2-live-gate-001-retrieval/evidence_index.jsonl): only one persisted source, one vendor/customer story
  - [run_synthesis_ru.md](C:/Users/ilya.suvorov/Projects/Work/salecheckup_signals_radar_runtime/runs/a2-live-gate-001-retrieval/run_synthesis_ru.md): raw synthesis mentions additional hotel phone-loss material, but that diversity did not survive into the persisted evidence bundle

### `A2_mechanically_ok_but_live-inconclusive`

- short explanation:
  - Live contour did not produce recurrence conditions, so this run cannot say whether A2 meaningfully improves recurring motif visibility in practice.
- evidence from artifacts:
  - [validation_manifest.json](C:/Users/ilya.suvorov/Projects/Work/salecheckup_signals_radar_runtime/runs/a2-live-gate-001-validator/validation_manifest.json): `repeated_pattern_key_count = 0`, empty `pattern_state_counts`
  - [review_manifest.json](C:/Users/ilya.suvorov/Projects/Work/salecheckup_signals_radar_runtime/runs/a2-live-gate-001-review/review_manifest.json): empty `pattern_state_counts`, `accept = 0`
  - [smoke_summary.json](C:/Users/ilya.suvorov/Projects/Work/salecheckup_signals_radar_runtime/runs/a2-minimal-smoke/smoke_summary.json): A2 mechanics were already shown in controlled smoke, so the live failure here is non-exercise rather than obvious mechanical breakage

## 5. A2-specific assessment

- Did A2 appear mechanically present in live outputs:
  - best-effort answer: indirectly yes, directly no
  - the live manifests include A2-aware counters and review policy guardrails, but no live item reached emitted `pattern_assessment` because recurrence never formed
- Did A2 materially improve recurring motif visibility in this run:
  - no
- Was `pattern_key` coherent enough inside the run:
  - not meaningfully testable in this run, because no repeated items existed
- Was there any sign that A2 softened A1 incorrectly:
  - no
  - review stayed in `hold`, did not convert recurrence into `accept`, and preserved blocker/next-step discipline

## 6. Decision on next move

### Recommendation

- exact choice: `rerun_same_lane_with_better_input`

### Why this is the best next step

- The current evidence says the bottleneck is upstream yield, not broken A2 logic.
- The lane still matches the intended A2 use case: repeated weak hospitality phone-loss motifs that should become more visible without relaxing A1.
- Rerunning the same lane with denser, more recurrence-oriented input keeps the experiment controlled and lets us answer the original question instead of changing both lane and input at once.
- Switching lanes now would hide whether `hotel_phone_abandonment` failed because the lane is wrong or because the retrieval bundle was too narrow.
- A runtime logic repair is not yet justified from the artifacts: validator and review behaved conservatively and consistently with the A2 package.

### Why the other options are weaker right now

- `switch_to_lane_2`:
  - weaker because it changes the test subject before the current lane has been cleanly exercised
- `make_tiny_pre_live_adjustment`:
  - weaker because the main observed problem is input/yield, not a demonstrated runtime logic defect
- `stop_A2_and_review_design`:
  - weaker because nothing in this run shows A2 harming A1 or failing mechanically; the run was mostly inconclusive, not negative

## 7. Minimal execution sketch

### Minimal execution sketch

- What exactly to do next:
  - rerun `hotel_phone_abandonment` with a denser retrieval input package that explicitly asks for multiple public evidence forms around missed reservation calls, call abandonment, direct-booking leakage, staffing strain, and phone-to-revenue loss in hospitality
- What not to change:
  - do not change validator logic, review logic, A1 guardrails, or A2 recurrence rules
- What specific success signal to look for in the next run:
  - at least `2` persisted evidence items that survive into validator with a coherent recurring motif, producing emitted `pattern_assessment` on live validated items while final review still avoids recurrence-only `accept`

## 8. Explicit end section

### What this run proved

- Current A2-enabled contour can execute end-to-end in live mode.
- A1 discipline remained conservative and readable.
- Review did not soften into recurrence-driven `accept`.

### What this run did not prove

- It did not prove that A2 materially improves recurring motif visibility in live conditions.
- It did not prove `pattern_key` coherence on a real recurring batch.
- It did not prove that this lane is intrinsically poor for A2; only that the realized bundle was too thin.

### Where the contour narrowed

- The contour narrowed at retrieval: persisted evidence collapsed to one item before validator had any opportunity to form recurrence.

### Most likely bottleneck

- `retrieval_under_yield`, with best-effort secondary interpretation `A2_mechanically_ok_but_live-inconclusive`

### Recommended next step

- `rerun_same_lane_with_better_input`
