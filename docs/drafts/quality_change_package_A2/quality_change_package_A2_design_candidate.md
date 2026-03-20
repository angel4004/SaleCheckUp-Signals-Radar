# Quality Change Package A2 Design Candidate

## Status
draft

## Classification
- artifact_type: `A2 design candidate`
- contour_relation: `provisional runtime-facing concretization`
- canonical_sync: `no`
- approved_doc: `no`
- runtime_patch: `no`

## Purpose
Этот документ materializes chat-level A2 answer package в repo-resident draft artifact.

Он не переписывает canonical/source-of-truth docs и не вводит runtime code changes.

## Planning basis
- authoritative planning artifact for this task: `quality_spine_vA_canonical_draft`
- support layer if needed: `quality_system_principles_vA_working_draft_synced`

Для этого draft artifact эти названия считаются planning anchors, а не repo-synced source of truth.

## Problem this package addresses
После `A1` система стала честнее в decision surface, но всё ещё слишком плоско обращается со слабыми повторяющимися сигналами.

Нужен слой `source_weighting_and_recurrence_handling`, который:
- улучшает triage quality для weak repeated patterns;
- не превращает repeated noise в false signal;
- не ломает `A1` discipline;
- не требует premature full source reputation system.

## In Scope
- explicit pattern-state logic
- source weighting logic for weak/repeated signals
- recurrence handling logic
- minimal escalation rules
- minimal review/output implications
- stage-role boundaries for this package
- minimal cross-run comparability requirements

## Out of Scope
- canonical doc rewrites
- approved doc rewrites
- runtime code edits
- `A1` reopening
- full claim-chain redesign
- `claim_chain_collection_with_priority_weighting` redesign
- `layered_object_model` rollout
- backlog proposal logic redesign
- portfolio prioritization
- standalone corroboration strategy
- breadth/depth architecture
- production contour

## Package-Level Accepted Design Logic

### Design principles preserved
- `preserve broadly, decide conservatively`
- `honesty_over_cosmetic_decisiveness`
- `broad_discovery_strict_acceptance`
- `auditability_is_mandatory`
- `strict_stage_role_separation`
- `cross_run_comparability_is_foundational`
- `run_is_the_accounting_unit`

### Core package intent
`A2` adds explicit handling for repeated weak evidence without changing the `A1` decision surface.

`pattern_state` is a classification layer, not a new final decision status.

### Pattern states
#### `weak_repeated_pattern`
- definition: weak signal recurs enough to deserve explicit visibility, but does not yet have additional strength beyond recurrence
- why it exists: to stop repeated weak signals from disappearing inside generic `hold`
- protected failure: under-recognizing weak but repeated evidence
- boundary: not decision-ready, not equivalent to `accept`, not standalone proof
- Variant A intent: remain `hold + recurring` when money proof is still missing

#### `credible_pattern`
- definition: a repeated weak pattern plus any one additional amplifier
- why it exists: to distinguish "repeats" from "starts to converge"
- protected failure: keeping an already-converging pattern in the same bucket as generic weak repeats
- boundary: not a confirmed case, not independent proof by itself
- Variant A intent: become a stronger review candidate without bypassing review conservatism

#### `decision_relevant_pattern`
- definition: a credible pattern with enough economic relevance to become materially important for decision attention
- why it exists: to mark the point where repeated evidence becomes meaningfully tied to decision logic
- protected failure: treating economically relevant recurring patterns as if they were just another weak hold
- boundary: not an automatic `accept`, not portfolio prioritization, not a corroboration system
- Variant A intent: upgrade attention and structured output, not final status semantics

### Escalation logic
#### Base recurrence signal
At package level, significance increases first through `frequency of recurrence`.

If a weak signal repeats many times but still lacks `money proof`, it remains `hold + recurring`.

Such an object may become a `review candidate`, but not a `decision-ready signal` by recurrence alone.

#### Amplifiers
- `independent_sources`
- `payer_clarity`
- `jtbd_outcome_clarity`
- `money_link_clarity`

Strength order:
- `money_link_clarity`
- `jtbd_outcome_clarity`
- `payer_clarity`
- `independent_sources`

#### State transitions
- recurrence only -> `weak_repeated_pattern`
- recurrence + any one amplifier -> `credible_pattern`
- recurrence + sufficient strengthening toward decision relevance -> `decision_relevant_pattern`

#### Forbidden or premature transitions
- repeated weak signal -> `accept` by recurrence alone
- repeated vendor/self-reported signal -> `decision-ready` without stronger economic grounding
- review-side invention of new recurrence logic that bypasses validator/retrieval boundaries

### Review and output implications
- `accept | hold | reject` remains unchanged
- `hold` still requires a named blocker
- `hold` still requires a concrete decision-moving `next_step`
- contradiction surfacing remains explicit
- evidence-to-decision traceability remains mandatory
- recurrence handling must surface in review/intermediate outputs as structured markers, not as free-form hidden reasoning

### Stage-role boundaries
#### Retrieval
- gathers and preserves source-level evidence and source descriptors
- may preserve source-type distinctions useful for later recurrence handling
- does not decide pattern state
- does not decide final weighting of payer/JTBD/outcome/money-link logic

#### Validator
- interprets recurrence and amplifiers
- classifies pattern state
- preserves evidence-backed rationale for why the state applies
- must not invent unsupported economic proof

#### Review
- consumes pattern-state output
- keeps `A1` decision discipline
- may escalate attention and shape `next_step`
- must not recalculate source weighting from scratch
- must not turn recurrence alone into `accept`

### Cross-run comparability minimum
The following must stay comparable across runs:
- pattern-state enum semantics
- amplifier enum semantics
- recurrence handling semantics
- minimal structured markers used to surface pattern state

The following may remain flexible:
- exact narrative wording
- exact evidence mix
- exact review phrasing

Minimum requirement now:
- two runs should allow an operator to compare how the same class of recurring pattern was classified and why

## Provisional Runtime-Facing Concretization
This section is intentionally provisional.

It captures implementation-oriented guesses that may help runtime shaping later, but they are not canonical sync and not approved design truth.

### Provisional object model guesses
- `pattern_key_v1`
- `pattern_assessment`
- `pattern_state`
- `recurrence_count`
- `distinct_source_count`
- `amplifiers_present`
- `recurrence_note`
- `decision_attention_flag`
- `state_reason`

### Provisional enum guesses
- `pattern_state`: `weak_repeated_pattern | credible_pattern | decision_relevant_pattern`
- `recurrence_note`: `none | recurring_by_frequency | recurring_across_source_types | both`

### Provisional threshold guesses
- base recurrence may be treated as `distinct_evidence_count >= 2`
- pure `weak_repeated_pattern` may become a stronger review-attention candidate around `recurrence_count >= 3`
- `decision_relevant_pattern` may require `money_link_clarity` plus at least one additional amplifier

These thresholds are runtime-facing best-effort assumptions, not accepted package-level truth.

### Provisional implementation placement guesses
- retrieval preserves source metadata useful for later weighting
- validator is the preferred place to derive `pattern_key_v1`, count recurrence, and assign `pattern_state`
- review consumes the result and applies `A1` gate logic without inventing new pattern-state rules

### Provisional comparability payload guess
Minimum runtime-facing payload for later comparison may include:
- `run_id`
- `candidate_id`
- `pattern_key_v1`
- `pattern_state`
- `recurrence_count`
- `amplifiers_present`
- final `status`

## Integration With Current Runtime Contour
- `A2` fits the current retrieval -> validator -> review contour
- `A2` does not require production contour build-out
- `A2` does not replace `A1`
- `A2` does not change final status semantics
- `A2` adds a classification layer that should feed review, not replace it

## What Changes If This Package Is Later Accepted
- repeated weak signals become explicitly classifiable
- recurrence gets minimal weighting logic
- amplifiers get explicit escalation meaning
- review can distinguish ordinary weak `hold` from `hold + recurring`
- cross-run comparison of pattern classification becomes minimally possible

## What Does Not Change
- `A1` decision statuses stay `accept | hold | reject`
- `hold` still requires a concrete decision-moving `next_step`
- review stays conservative
- repeated noise does not become a real signal by repetition alone
- no source reputation system is introduced here
- no runtime patch is introduced here

## Risks Reduced By A2
- flat handling of repeated weak evidence
- loss of recurring patterns inside generic `hold`
- inconsistent triage attention for recurring weak patterns

## Risks Introduced By A2
- over-reading repeated noise as stronger than it is
- unstable recurrence classification if `pattern_key` derivation is weak
- review overreach if review starts re-weighting sources on its own

## Later Sync Needed
If this package moves beyond draft, later sync may be needed into:
- `quality_spine_vA_canonical_draft`
- `quality_system_principles_vA_working_draft_synced`
- governance/source-of-truth docs that later absorb approved A2 semantics
- runtime-facing docs only after a separate implementation wave is explicitly approved

## Not To Open Now
- `A1` execution/design loop
- canonical rewrites
- approved doc rewrites
- runtime code patching
- production contour
- claim-chain redesign
- corroboration strategy redesign
- portfolio prioritization

## Explicit Boundary
This artifact:
- is a repo-resident draft
- is not canonical sync
- is not an approved doc
- is not a runtime patch
- is not a claim that `A2` has already been adopted into the active governance layer
