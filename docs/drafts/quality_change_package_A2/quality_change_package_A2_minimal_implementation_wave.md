# quality_change_package_A2_minimal_implementation_wave

Status note

- Expected authoritative planning artifacts were not found in this runtime workspace: `quality_spine_vA_canonical_draft`, `quality_system_principles_vA_working_draft_current`, `docs/drafts/quality_change_package_A2/quality_change_package_A2_design_candidate.md`.
- This draft is therefore grounded on the active runtime contour that is actually present in repo: `runtime_contract.md`, `runner/validator_run.py`, `runner/review_gate.py`, and Phase 0 persisted artifacts.
- Repo also contains older pre-A1 review artifacts under `runs/phase0-review-run-001/*`. For this package they are treated as non-authoritative history. The current implementation baseline is `runner/review_gate.py` together with `runs/phase0-review-run-a1-smoke/*`.
- Best-effort assumption for this wave: the current A1 runtime surface is the authoritative implementation baseline, and A2 must remain strictly subordinate to it.

## 1. Human layer

Этот slice минимальный, потому что он не строит новый stage, не вводит global memory, не тянет reputation layer и не ломает A1 review surface. Он использует уже существующие runtime surfaces: validator batch, current review grouping by `candidate_id`, existing manifests and persisted JSONL artifacts.

Практическая боль, которую снимает эта волна: повторяющиеся слабые сигналы сейчас либо распадаются на изолированные `hold`, либо вообще не получают устойчивой pattern-видимости. В итоге машина видит много отдельных намеков, но плохо показывает, что это уже повторяющийся economically relevant motif.

После этой wave можно идти в live research test, потому что система уже сможет:

- сохранять minimal pattern markers в repo-resident artifacts;
- отличать simple weak repetition от recurrence with amplifier;
- поднимать review salience повторяющегося weak signal без срыва A1 discipline;
- сравнивать pattern markers между run-ами без отдельной reinterpretation.

## 2. Package definition

- package name: `quality_change_package_A2_minimal_implementation_wave`
- purpose: ввести минимальный pattern layer для triage repeated weak signals внутри current Variant A runtime contour
- implementation goal: сделать повторяющиеся weak signals видимыми и review-relevant, не превращая recurrence itself в shortcut to `accept`
- in scope:
  - minimal pattern-state handling
  - minimal recurrence handling with frequency-first logic
  - minimal amplifier-aware escalation logic
  - minimal structured output markers in validator/review artifacts
  - minimal compatibility with existing A1 `accept | hold | reject`
  - minimal cross-run comparability for this layer
- out of scope:
  - A1 reopening
  - full A2 rollout
  - source reputation system
  - full corroboration strategy
  - claim-chain redesign
  - layered object model rollout
  - backlog proposal redesign
  - portfolio prioritization
  - production contour
  - canonical sync
  - runtime refactor for future-proofing

## 3. Minimal implementation slice

### What is implemented now

- Validator starts emitting one minimal `pattern_assessment` per validated item.
- Existing `candidate_id` semantics remain unchanged in this wave.
- Recurrence and pattern visibility are carried by shared `pattern_key`, not by repurposing `candidate_id`.
- Review consumes `pattern_assessment` only as a subordinate triage signal under A1 guardrails.
- Persisted validator and review artifacts expose stable run-local recurrence data and a run-comparable `pattern_key`.

### What is consciously not implemented now

- No new runtime stage between validator and review.
- No global pattern registry.
- No cross-run memory store.
- No source reputation scoring.
- No claim-chain or evidence graph redesign.
- No auto-ranking across portfolio.
- No automatic conversion of recurring patterns into `accept`.

### Why this is minimally sufficient

- `runner/review_gate.py` already preserves validated item structure and A1 decision semantics, so A2 can stay additive instead of introducing a new consolidation layer.
- `runner/validator_run.py` already sees the whole evidence batch, so recurrence inference can stay there without touching retrieval semantics.
- Cross-run comparability can start from persisted markers, not from a new synchronization mechanism.

## 4. Runtime change map

### `runner/validator_run.py`

- classification: `required_now`
- why needed: this is the only current stage that sees the whole evidence batch and can assign recurrence/pattern markers before review.
- what should change:
  - extend validator JSON contract with a `pattern_assessment` object on every validated item
  - require a stable English `pattern_key` for the same pattern inside one batch
  - require validator to fill minimal recurrence and amplifier markers
  - normalize and validate allowed enums for `pattern_state` and `amplifiers_present`
  - keep existing `candidate_id` semantics unchanged; A2 must not repurpose `candidate_id` into a pattern-clustering identifier
  - add manifest-level counters such as `pattern_state_counts`
- what must stay unchanged:
  - exactly one `validated_signals` item per input `evidence_id`
  - current `signal_type` discipline
  - current `candidate_id` semantics
  - conservative cap on vendor/self-reported evidence
  - no source reputation logic

### `runner/review_gate.py`

- classification: `required_now`
- why needed: A1 decision surface must consume the new pattern markers without letting recurrence collapse into cosmetic decisiveness.
- what should change:
  - preserve and carry `pattern_assessment` into `reviewed_signals.jsonl`
  - add explicit A2 guardrail: `weak_repeated_pattern` can never produce `accept` by recurrence alone
  - add explicit A2 guardrail: repeated weak signal without `money_link` must not become `accept`
  - allow `credible_pattern` and `decision_relevant_pattern` to increase review salience and support `hold`, but not to bypass named blocker / concrete next step requirements
  - preserve validator-owned `pattern_assessment` as received; review may add a human-readable note only if low-cost, but may not rewrite `pattern_state` in this wave
  - for A2 `pattern_assessment`, treat `independent_sources` as present only when validator has explicit evidence of independence
  - add manifest-level counters such as `pattern_state_counts`
- what must stay unchanged:
  - `accept | hold | reject`
  - `hold` requires named blocker and concrete decision-moving `next_step`
  - contradiction handling
  - evidence-trace requirement
  - exactly one reviewed item per `candidate_id`
  - this wave does not redesign existing A1 corroboration semantics
  - this wave does not redefine global `independent_evidence` logic in review
  - review cannot silently override validator state

### `runner/retrieval_run.py`

- classification: `optional_if_low_cost`
- why needed: optional helper only if live test shows unstable validator detection of explicit source independence from raw URLs.
- what should change:
  - add `source_domain` into `evidence_index.jsonl`
  - pass `source_domain` through compact evidence payload into validator
- what must stay unchanged:
  - retrieval does not assign `pattern_state`
  - retrieval does not infer amplifiers
  - retrieval does not decide `candidate_id`

### New runtime file or structure

- classification: `deferred_later`
- required for this wave: none
- note: if this layer proves useful, a dedicated cross-run comparator may be added later, but it is explicitly out of scope for this minimal wave
- note: if a helper such as `pattern_cluster_id` is mentioned at implementation time, it may only be `optional_if_low_cost` and must not become the recurrence anchor for this wave

## 5. Minimal pattern logic

### Minimum state logic implemented now

- `weak_repeated_pattern`
  - same `pattern_key` appears at least twice inside the same validator batch
  - recurrence is real, but the pattern still lacks sufficient amplification
  - this state can raise visibility, but not decision authority
- `credible_pattern`
  - same `pattern_key` appears at least twice
  - recurrence has gained at least one additional amplifier from `money_link`, `jtbd_outcome`, `payer`, `independent_sources`
  - this state can justify stronger `hold` salience, but still not `accept` by itself
- `decision_relevant_pattern`
  - same `pattern_key` appears at least twice
  - `money_link` is present
  - at least one additional amplifier is present
  - this state means the pattern is materially important to keep visible in review and live research, not that it is automatically accepted

### Minimum recurrence definition

- Primary recurrence measure for this wave: `recurrence_count_in_run`
- Best-effort assumption: if `recurrence_markers` is emitted, the preferred minimum marker is `recurring_by_frequency`
- Optional note-level recurrence marker: `recurring_across_source_types`
- Variant A interpretation: frequency matters first; source-type spread may be recorded, but it does not become a hard gating system in this wave

### Minimum amplifier handling

- allowed amplifier values:
  - `money_link`
  - `jtbd_outcome`
  - `payer`
  - `independent_sources`
- precedence:
  - `money_link`
  - `jtbd_outcome`
  - `payer`
  - `independent_sources`
- minimum escalation rule:
  - `weak_repeated_pattern -> credible_pattern` requires recurrence plus at least one additional amplifier
- hard guardrail:
  - repeated weak signal without `money_link` must not become `accept`
- scope note:
  - for A2 `pattern_assessment`, `independent_sources` may be present only when validator has explicit evidence of independence
  - this wave does not redesign existing A1 corroboration semantics
  - any broader corroboration redesign is `deferred_later`

### Thresholds and markers needed now

- `pattern_key`
- `pattern_state`
- `recurrence_count_in_run`
- `amplifiers_present`
- `primary_amplifier`

### Thresholds and markers optional if low cost

- `recurrence_markers`
- `pattern_summary_ru`

### Thresholds and markers that are too early

- numeric pattern score
- source reputation score
- corroboration scorecard
- time-window decay logic
- full source-family taxonomy
- claim-chain lineage
- cross-run memory state
- pattern ranking across lanes

## 6. Output / artifact implications

### Minimal structured fields

Validator output should add this minimal shape to every `validated_signals.jsonl` item:

```json
"pattern_assessment": {
  "pattern_key": "hotel_phone_abandonment_ota_leakage",
  "pattern_state": "credible_pattern",
  "recurrence_count_in_run": 2,
  "amplifiers_present": [
    "money_link",
    "payer"
  ],
  "primary_amplifier": "money_link"
}
```

Optional if low cost:

- `recurrence_markers`
- `pattern_summary_ru`

Review output should preserve the same `pattern_assessment` on each `reviewed_signals.jsonl` item as received from validator. If needed, review may add a short human-readable note, but this wave does not introduce review-side rewriting of `pattern_state`.

### Why this does not break A1 review surface

- A1 decision field stays `status` with `accept | hold | reject`
- `next_step`, `missing_evidence_or_gap`, `contradictions`, and `evidence_trace` remain mandatory under current A1 rules
- `pattern_assessment` is additive and subordinate; it is not a replacement for review status or blocker logic

### What must be visible in persisted artifacts

- `validated_signals.jsonl`
  - per-item `pattern_assessment`
- `validation_manifest.json`
  - `pattern_state_counts`
  - count of repeated pattern keys in run
- `reviewed_signals.jsonl`
  - persisted `pattern_assessment`
  - A1 decision plus blocker/traceability fields
- `review_manifest.json`
  - `pattern_state_counts`
  - decision counts remain primary, pattern counts remain secondary

### Minimum comparability unit between runs

For this wave, the minimum cross-run comparison unit is:

`run_id + pattern_key + pattern_state + recurrence_count_in_run + primary_amplifier + status`

`candidate_id` remains run-local and is not the cross-run identity anchor.

## 7. Stage-role boundaries

### Retrieval

- collects evidence
- classifies broad source usefulness as today
- may optionally expose `source_domain`
- must not assign pattern state
- must not assign amplifiers
- must not decide `candidate_id`

### Validator

- assigns `signal_type` as today
- assigns `pattern_assessment`
- determines minimum recurrence and amplifier markers
- must preserve one output item per `evidence_id`
- must keep existing `candidate_id` semantics unchanged
- must not treat recurrence as proof of truth

### Review

- consumes validator pattern markers under A1 guardrails
- decides `accept | hold | reject`
- keeps blocker, contradiction, next-step, and evidence-trace discipline
- preserves validator `pattern_assessment` as received in this wave
- may add a short human-readable note only if low cost
- may not silently upgrade weak recurrence into acceptance

### What review is not allowed to do in this wave

- invent a new `pattern_key` not grounded in validator output
- use recurrence as a substitute for independent validation
- rewrite validator-owned `pattern_state`
- create `accept` because a pattern looks repeated
- redesign claim structure
- backfill missing `money_link`
- act as a source reputation layer

## 8. Validation plan

### Minimal live-test plan after implementation

Run 2-3 real research lanes through the full contour:

1. `hotel_phone_abandonment`
   - target shape: repeated symptoms around missed calls, IVR friction, abandoned calls, OTA leakage
   - expected result: repeated weak signals become one visible recurring pattern, likely `credible_pattern` or `decision_relevant_pattern`, but not automatic `accept`

2. `reservation_call_center_scaling`
   - target shape: vendor-heavy case studies about abandonment reduction, staffing expansion, outbound revenue
   - expected result: strong recurrence markers remain blocked by A1 unless independent or materially sufficient support exists

3. `multilingual_guest_call_friction`
   - target shape: recurring operational issue with clear JTBD/outcome but uneven money proof
   - expected result: pattern becomes more visible than today, but typically stays `hold`

### Success criteria

- repeated weak theme no longer disappears into unrelated isolated items
- `pattern_key` is stable enough to compare adjacent runs on the same lane
- review output remains fully A1-valid
- no frequency-only pattern becomes `accept`
- operator can quickly tell which repeated weak motifs deserve immediate live follow-up

### Failure or rollback signals

- recurrence alone starts producing `accept`
- `pattern_key` churn is so high that adjacent runs cannot be compared
- A2 starts depending on `candidate_id` clustering instead of `pattern_key`
- review starts treating repeated evidence count as implicit independent validation
- artifacts become harder to read without giving clearer decision leverage

### Sign that A2 improved the machine instead of adding complexity

- the machine surfaces one or two genuinely recurring motifs faster than the current A1-only contour
- live follow-up work becomes more directed
- decision discipline does not get softer
- the added fields can be read directly from repo artifacts without external interpretation machinery

## 9. Integration layer

### How this wave fits the current runtime contour

- It attaches to the existing `retrieval -> validator -> review` contour.
- It keeps `run` as the accounting unit.
- It uses existing validator batch visibility and adds `pattern_assessment` as an additive field.
- It does not require a new runtime stage.

### How it preserves A1 discipline

- A1 remains the decision authority.
- A2 markers are salience markers, not approval shortcuts.
- `hold` still requires a blocker and a concrete decision-moving next step.
- `accept` still requires materially sufficient support.
- This wave does not redesign existing A1 corroboration semantics.
- Validator remains the owner of `pattern_state`; any explicit review-level override mechanism is `deferred_later`.

### Docs that need sync later if this wave works

- `quality_spine_vA_canonical_draft` if/when restored in repo
- `quality_system_principles_vA_working_draft_current` if/when restored in repo
- `docs/drafts/quality_change_package_A2/quality_change_package_A2_design_candidate.md` if/when restored in repo
- `runtime_contract.md`
- any repo-resident runtime runbook or output-shape document that becomes the approved execution surface

### What remains later even after this wave

- source reputation system
- fuller corroboration policy
- claim-chain redesign
- layered object model rollout
- explicit cross-run comparator tooling
- portfolio-level prioritization logic

### New risks introduced by minimal A2 implementation

- unstable `pattern_key` generation
- false merging of similar but not identical motifs
- over-weighting recurrence from one vendor-heavy subcluster
- accidental inflation of `independent_sources` without explicit evidence of independence
- extra output fields becoming noisy if the prompt is under-specified

## 10. Explicit end section

### What will change

- validator output gains minimal `pattern_assessment`
- `pattern_key` becomes the recurrence anchor for this wave
- review explicitly consumes recurrence and amplifier markers under A1 guardrails
- manifests expose minimal pattern counters for run-level inspection

### What will not change

- runtime contour remains `retrieval -> validator -> review`
- A1 `accept | hold | reject` semantics remain intact
- `hold` still requires named blocker and concrete next step
- one input `evidence_id` still produces one validated item
- existing `candidate_id` semantics remain unchanged
- run remains the accounting unit
- no canonical sync and no runtime governance expansion

### What is intentionally deferred

- source reputation
- global memory
- cross-run comparator script
- broader corroboration redesign
- explicit review-level override mechanism for `pattern_state`
- claim-chain redesign
- layered object model
- production contour
- portfolio prioritization

### What needs sync later

- `quality_spine_vA_canonical_draft` if restored
- `quality_system_principles_vA_working_draft_current` if restored
- `docs/drafts/quality_change_package_A2/quality_change_package_A2_design_candidate.md` if restored
- `runtime_contract.md`
- approved output-shape/runbook docs once implementation is validated

### What must be checked in live research immediately after implementation

- does the same recurring motif get the same or near-stable `pattern_key` across adjacent runs
- does recurrence improve review salience without producing premature `accept`
- does repeated weak signal without `money_link` stay out of `accept`
- does the wave stay anchored on `pattern_key` rather than accidental `candidate_id` clustering
- do persisted artifacts remain directly interpretable by a human reviewer
