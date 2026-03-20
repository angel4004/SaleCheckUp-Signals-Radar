Status note

- `draft`
- `working spec`
- `spec only`
- `not implementation`
- `not canonized`

# decision_read_model_contract_v1

## Document metadata

- `document_id`: `decision_read_model_contract_v1`
- `document_type`: `working_spec`
- `status`: `draft`
- `contract_maturity`: `v1`
- `layer_type`: `decision_consumption_layer`
- `contract_type`: `read_model_contract`
- `scope_mode`: `spec_only`
- `implementation_status`: `not_opened`
- `git_branch`: `main`
- `git_context_current_head_commit`: `38717f3710a740134cf0ef5139bf7aeee9a42f46`
- `git_context_runtime_baseline_commit`: `e16bb2d`
- `git_context_a1_runtime_patch_commit`: `78d79c2`
- `git_context_a1_validation_followup_commit`: `d55e002`
- `git_context_a2_draft_artifact_commit`: `f76b53879e7a292f9976b22985d5ad5d7bc3f81e`
- `git_context_a2_minimal_implementation_package_commit`: `050a6120bf3e469cc6457bb68bc81cd9858878b0`
- `git_context_a2_lane2_live_gate_execution_package_commit`: `dba74f242f957f510c90b4c6611852c4256a630d`
- `git_context_decision_consumption_layer_spec_commit`: `6bce73a42b12fff21629467cfce2a401ca3d992c`
- `git_context_nearest_repo_resident_a2_live_gate_result_commit`: `f5be6438628fcc5172b63d18bad726ecf29ccd24`
- `git_context_nearest_repo_resident_a2_live_gate_result_artifact`: `docs/drafts/quality_change_package_A2/quality_change_package_A2_live_gate_run_002.md`
- `repo_grounding_note`: `nearest live A2 result is present in repo as a draft outcome-capture document; raw runtime output bundle is referenced but not tracked in this repo`

## Document status note

Этот документ задает черновой V1 contract для `decision_read_model` как нормализованного read-side слоя между:

- runtime / A1 / A2 artifacts;
- governance-visible document status;
- будущим operator-facing consumption surface.

Документ не является approved contract.

Документ не открывает:

- UI implementation;
- projection implementation;
- final `feedback` contract;
- production contour;
- automatic canonical sync.

---

## 1. Purpose

### 1.1 Contract purpose

`decision_read_model_contract_v1` нужен, чтобы зафиксировать минимальную, но стабильную read-side форму данных для `decision_consumption_layer`.

Эта форма должна позволять:

- читать run как основную единицу учета;
- работать с `signal` как с основной единицей операторской работы;
- явно видеть `status`, `pattern`, `contradictions`, `next_step`, `evidence_trace`;
- сравнивать соседние comparable runs;
- не строить UI прямо на raw runtime artifacts.

### 1.2 Why this contract exists now

`decision_consumption_layer_spec_vA` уже зафиксировал, что следующий правильный шаг после layer-spec это не UI, а стабилизация объектов.

Это стало еще важнее после ближайшего repo-resident A2 live gate result:

- `quality_change_package_A2_live_gate_run_002.md`
- classification: `blocked`
- live fact: retrieval completed, validator stopped on empty evidence bundle, review was not started

Следствие для read model прямое:

- read model обязан уметь честно представлять `run` без выдуманных `signal`;
- read model обязан фиксировать stage completion / blockage;
- отсутствие сигнала или `pattern_assessment` должно быть моделируемым состоянием, а не скрытым провалом.

---

## 2. Why this contract exists

Без отдельного read model contract decision layer будет вынужден опираться на сырой shape upstream artifacts, который сейчас:

- execution-oriented;
- stage-specific;
- partly draft-grounded rather than canonized;
- не рассчитан на stable operator comparison surface.

Практическая проблема состоит в том, что current A1 / A2 contour уже дает полезные raw artifacts и policy guardrails, но не дает стабильный operator-facing object contract.

Именно поэтому V1 contract должен:

- сохранять upstream traceability;
- не подменять A1 / A2 source semantics;
- добавлять нормализацию только там, где это помогает comparison и consumption;
- оставлять raw upstream fields видимыми рядом с normalized fields.

---

## 3. In scope

В этом документе определяются:

- purpose и boundary для `decision_read_model`;
- V1 object model;
- object relationships;
- required fields;
- traceability rules;
- comparability rules;
- boundaries with runtime / governance / feedback / UI;
- integration with current A1 / A2 state;
- explicit non-goals;
- follow-up tasks that this contract unlocks.

## 4. Out of scope

В этом документе сознательно не определяются:

- projection job or materializer implementation;
- database or storage engine;
- UI component hierarchy;
- frontend state management;
- write-side feedback event schema;
- production auth / roles / settings;
- automatic governance mutation;
- production contour design;
- runtime refactor.

---

## 5. Layer definition

### 5.1 Layer name

- `layer_name`: `decision_consumption_layer`
- `contract_name`: `decision_read_model_contract_v1`

### 5.2 Layer role

Этот contract описывает read-side слой, который:

- принимает upstream runtime / governance facts;
- нормализует их для operator consumption;
- сохраняет link назад к source artifacts;
- не становится новым source of truth.

### 5.3 Ownership posture

`decision_read_model` owns:

- normalized read objects for operator consumption;
- comparison-ready run and signal objects;
- explicit representation of blocked / partial / completed run state;
- traceable operator-facing summaries.

`decision_read_model` does not own:

- runtime execution;
- canonical governance truth;
- feedback write-side state;
- UI behavior;
- approval workflow.

---

## 6. Grounding from current A1 / A2 state

### 6.1 Current A1 grounding

Repo-grounded A1 reality сейчас такова:

- A1 review authority remains `accept | hold | reject`
- `hold` remains a valid state with blocker and concrete `next_step`
- review must preserve contradiction and evidence trace discipline

V1 read model therefore must preserve A1 raw outputs when they exist.

### 6.2 Current A2 grounding

Repo-grounded A2 reality сейчас такова:

- A2 minimal package introduces validator-owned `pattern_assessment`
- recurrence anchor is `pattern_key`, not `candidate_id`
- review consumes `pattern_assessment` under A1 guardrails
- current A2 live run 002 did not reach emitted live `pattern_assessment` because validator received no persisted evidence

V1 read model therefore must support both:

- presence of raw A2 pattern markers;
- honest absence of pattern markers when live contour never reached that stage.

### 6.3 Design implication from nearest live result

The nearest repo-resident A2 live gate result forces the following V1 rules:

1. `run_read_model` must be valid even when `signal_read_model[]` is empty.
2. `stage_status` must be explicit on the run object.
3. `blocked_reason_code` must be explicit when contour stops early.
4. The projector must not invent `status_assessment` or `pattern_assessment` for non-existent signals.
5. Zero-signal persisted state must still materialize `signal_read_models = []` rather than omitting the field.

---

## 7. Accounting and work unit

### 7.1 Primary accounting unit

- `primary_accounting_unit`: `run`

`run` остается primary accounting unit для traceability, comparison и navigation.

### 7.2 Primary work unit for V1

- `primary_work_unit`: `signal`

`signal` остается primary work unit внутри decision surface.

### 7.3 Important exception

Несмотря на work-unit ориентацию на `signal`, V1 обязан поддерживать run-level state even when no `signal_read_model` was surfaced.

Причина не теоретическая, а repo-grounded:

- nearest live A2 run result in repo already shows a real `blocked` run with zero emitted signals.

---

## 8. Core objects

### 8.1 `run_read_model`

Top-level read object for one run.

Purpose:

- хранить run as unit of account;
- давать summary для inbox / run detail;
- держать stage completion and blockage state;
- связывать run с comparable predecessor и source artifacts.

### 8.2 `signal_read_model`

Primary operator work object inside one run.

Purpose:

- представлять один operator-facing signal;
- держать normalized status and pattern view;
- сохранять traceability назад к runtime artifacts;
- быть основной единицей comparison.

### 8.3 `status_assessment`

Normalized status object for one signal.

Purpose:

- показывать operator-facing current signal state;
- сохранять upstream A1 raw status if available;
- не скрывать uncertainty и decision relevance.

### 8.4 `pattern_assessment`

Optional pattern interpretation object for one signal.

Purpose:

- отделять repeated-pattern reading от main status;
- сохранять raw A2 `pattern_assessment` when upstream emitted it;
- поддерживать future cross-run comparison without forcing it into runtime raw contract.

### 8.5 `contradiction_entry`

Traceable contradiction record tied to one signal.

Purpose:

- делать contradictions visible and inspectable;
- позволять severity-based sorting;
- связывать contradiction с evidence trace.

### 8.6 `next_step_entry`

Traceable next-step recommendation or requirement tied to one signal.

Purpose:

- делать follow-up action explicit;
- позволять routing without write-side mutation;
- сохранять provenance of the suggested step.

### 8.7 `evidence_trace_entry`

Minimal inspectable evidence trace unit.

Purpose:

- сохранять support / qualify / contradict / context relation;
- привязывать signal reading к source artifact and locator;
- не давать operator-facing objects без inspectable trace.

### 8.8 `feedback_placeholder_ref`

Optional placeholder reference for future feedback integration.

Purpose:

- зарезервировать stable attachment point для future `operator_feedback_contract_v1`;
- не открывать full feedback write model prematurely.

---

## 9. V1 helper structures

Следующие substructures не являются отдельными primary objects V1, но обязательны как field-level helpers.

### 9.1 `artifact_ref`

Required fields:

- `artifact_path`
- `artifact_kind`
- `document_status`
- `git_commit_sha`
- `artifact_note_ru`

### 9.2 `stage_status`

Required fields:

- `stage_name`
- `stage_status_code`
- `reason_code`
- `source_stage_status_raw`
- `source_artifact_refs`

### 9.3 `comparison_anchor`

Required fields:

- `comparison_anchor_type`
- `comparison_anchor_value`
- `comparison_confidence`

---

## 10. Enum baseline

### 10.1 Required V1 enums

- `signal_type`
  - `confirmed_case`
  - `monetizable_pain_signal`
  - `technology_shift_signal`
  - `hold_item`
  - `noise`
- `status_code`
  - `promising`
  - `needs_validation`
  - `contradicted`
  - `weak`
  - `hold`
  - `discard_candidate`
- `pattern_status`
  - `pattern_candidate`
  - `isolated_case`
  - `cross_run_repeat`
  - `insufficient_pattern_evidence`
- `uncertainty_level`
  - `low`
  - `medium`
  - `high`
- `decision_relevance_level`
  - `high`
  - `medium`
  - `low`
- `severity_level`
  - `critical`
  - `major`
  - `moderate`
  - `minor`
- `next_step_type`
  - `validate_with_more_evidence`
  - `compare_across_runs`
  - `clarify_money_link`
  - `clarify_payer`
  - `clarify_jtbd`
  - `escalate_for_review`
  - `hold_for_future_run`
- `trace_role`
  - `support`
  - `qualify`
  - `contradict`
  - `context`

Important note:

- V1 `signal_type` here is a decision-consumption read-side label
- it does not replace the approved source-layer triplet `signal_type + resolution_status + evidence_strength`
- `hold_item` and `noise` are allowed only as read-side triage labels in this draft line, not as governance-side source truth

### 10.2 Additional V1 helper enums

- `run_outcome_status`
  - `completed`
  - `blocked`
  - `partial`
- `stage_status_code`
  - `completed`
  - `blocked`
  - `not_started`
- `source_stage_origin`
  - `retrieval`
  - `validator`
  - `review`
  - `projection_comparator`
  - `projection_fallback`
- `pattern_basis`
  - `within_run`
  - `cross_run`
  - `mixed`
- `comparison_anchor_type`
  - `pattern_key`
  - `normalized_signal_fingerprint`
  - `manual_review_only`
- `comparison_confidence`
  - `high`
  - `medium`
  - `low`
- `priority_level`
  - `high`
  - `medium`
  - `low`
- `feedback_placeholder_state`
  - `not_opened`
  - `reserved`
  - `deferred_to_feedback_contract`
- `target_layer`
  - `runtime`
  - `governance`
  - `feedback`
  - `ui`
  - `operator_review`
- `provenance_type`
  - `machine`
  - `operator`
  - `mixed`

### 10.3 Raw A1 / A2 preservation rule

Нормализованные enums выше не заменяют upstream raw values.

Если current runtime artifact already emits a raw machine value, read model must preserve it in a `*_raw` field.

Examples:

- `source_run_outcome_raw = blocked | hold_and_review | completed_as_captured_by_source`
- `source_stage_status_raw = retrieval completed | validator blocked on empty evidence bundle | review not started`
- `source_signal_type_raw = confirmed_case | monetizable_pain_signal | technology_shift_signal | none`
- `source_status_code_raw = accept | hold | reject`
- `source_evidence_strength_raw = low | medium | high`
- `runtime_pattern_state_raw = weak_repeated_pattern | credible_pattern | decision_relevant_pattern`

---

## 11. Object relationships

### 11.1 Required relationship baseline

- one `run_read_model` contains many `signal_read_model`
- one `signal_read_model` has one `status_assessment`
- one `signal_read_model` may have zero or one `pattern_assessment`
- one `signal_read_model` may have many `contradiction_entry`
- one `signal_read_model` may have many `next_step_entry`
- one `signal_read_model` may have many `evidence_trace_entry`
- one `signal_read_model` may have zero or one `feedback_placeholder_ref`

### 11.2 Repo-grounded cardinality clarification

Logical V1 posture remains one run to many signals, but persisted cardinality for `signal_read_model[]` must be `0..n`.

Причина:

- current repo already contains a real A2 live run result whose honest projection is zero surfaced signals because validator never produced a usable batch.

Persisted zero-signal support means:

- `signal_count = 0`
- `signal_read_models = []`
- `run_read_model` is still a valid materialized object

### 11.3 Evidence rule

Any persisted `signal_read_model` must contain at least one `evidence_trace_entry`.

No signal may surface without trace.

---

## 12. Required fields

### 12.1 `run_read_model`

Required fields:

- `run_id`
- `lane_id`
- `run_label`
- `primary_accounting_unit`
- `run_outcome_status`
- `source_run_outcome_raw`
- `stage_statuses`
- `signal_count`
- `signal_read_models`
- `comparison_family_key`
- `previous_comparable_run_id`
- `source_artifact_refs`
- `read_model_version`
- `projection_generated_at`
- `human_summary_ru`

Conditionally required:

- `blocked_reason_code`
  - required when `run_outcome_status != completed`
- `blocked_reason_ru`
  - required when `run_outcome_status != completed`

Field notes:

- `primary_accounting_unit` must always equal `run`
- `signal_count` may be `0`
- `signal_read_models` must always be present; for a zero-signal run it must be `[]`
- `source_run_outcome_raw` may be `null`, but the field must exist when no stable raw run classification was emitted by the source artifact
- `previous_comparable_run_id` may be `null`, but the field must exist explicitly

### 12.2 `signal_read_model`

Required fields:

- `signal_id`
- `run_id`
- `signal_type`
- `source_signal_type_raw`
- `signal_label`
- `signal_summary_ru`
- `source_stage_origin`
- `source_signal_ref`
- `comparison_anchor`
- `changed_vs_previous_comparable`
- `status_assessment`
- `contradiction_entries`
- `next_step_entries`
- `evidence_trace_entries`
- `pattern_assessment`
- `feedback_placeholder_ref`

Field notes:

- `pattern_assessment` may be `null`
- `feedback_placeholder_ref` may be `null`
- `source_signal_ref` must preserve upstream id material when it exists, including `candidate_id` or equivalent raw anchor
- `source_signal_type_raw` may be `null`, but the field must exist so approved source-layer semantics are not erased

### 12.3 `status_assessment`

Required fields:

- `status_code`
- `uncertainty_level`
- `decision_relevance_level`
- `assessment_origin`
- `source_status_code_raw`
- `source_evidence_strength_raw`
- `rationale_ru`
- `trace_ref_ids`

Conditionally required:

- `blocking_reason_ru`
  - required when `status_code = hold` or `status_code = needs_validation`
- `status_change_note_ru`
  - required when `changed_vs_previous_comparable = true`

Field notes:

- `source_status_code_raw` must remain visible when source review output exists
- `source_evidence_strength_raw` may be `null`, but the field must exist when the upstream source did not expose a stable evidence-strength value
- `assessment_origin` must not claim `review` if review never ran for that signal

### 12.4 `pattern_assessment`

Required fields when object is present:

- `pattern_status`
- `pattern_basis`
- `pattern_key`
- `runtime_pattern_state_raw`
- `recurrence_count_in_run`
- `cross_run_repeat_count`
- `pattern_summary_ru`
- `source_stage_origin`
- `trace_ref_ids`

Conditional rules:

- `pattern_key` may be `null` only when `pattern_status = isolated_case` or `pattern_status = insufficient_pattern_evidence`
- `runtime_pattern_state_raw` must be preserved when source runtime emitted A2 `pattern_assessment`
- `cross_run_repeat_count` may be `null` in V1 when no comparable-run comparison was performed

### 12.5 `contradiction_entry`

Required fields:

- `contradiction_id`
- `severity_level`
- `contradiction_kind`
- `contradiction_text_ru`
- `source_stage_origin`
- `trace_ref_ids`
- `is_resolved`

Conditionally required:

- `resolution_note_ru`
  - required when `is_resolved = true`

### 12.6 `next_step_entry`

Required fields:

- `next_step_id`
- `next_step_type`
- `target_layer`
- `priority_level`
- `provenance`
- `action_text_ru`
- `trace_ref_ids`
- `is_blocking`

### 12.7 `evidence_trace_entry`

Required fields:

- `trace_id`
- `trace_role`
- `artifact_path`
- `artifact_kind`
- `document_status`
- `source_record_id`
- `locator_hint`
- `excerpt_text`
- `source_stage_origin`

Field notes:

- `excerpt_text` may be short and does not need to equal raw full evidence text
- `locator_hint` must be specific enough that a human can reopen the source artifact

### 12.8 `feedback_placeholder_ref`

Required fields when object is present:

- `feedback_placeholder_id`
- `feedback_placeholder_state`
- `target_signal_id`
- `intended_contract`
- `note_ru`

Field rule:

- `intended_contract` must be `operator_feedback_contract_v1` in this V1 draft line

---

## 13. Traceability requirements

### 13.1 Source artifact visibility

Every `run_read_model` must include explicit `source_artifact_refs`.

Those refs must preserve:

- source artifact path;
- source document status;
- grounding commit when repo-resident;
- enough note text to explain why the artifact matters.

### 13.2 Signal trace requirement

Every `signal_read_model` must include:

- at least one `evidence_trace_entry`;
- `trace_ref_ids` on `status_assessment`;
- `trace_ref_ids` on every `contradiction_entry`;
- `trace_ref_ids` on every `next_step_entry`.

### 13.3 Raw value preservation

Whenever current upstream A1 / A2 artifacts already expose machine-readable raw values, V1 read model must keep them alongside normalized interpretation.

This is required so the read model does not silently erase:

- run-level and stage-level blockage wording when normalized run/stage enums are introduced;
- A1 final decision authority;
- A2 raw recurrence / amplifier evidence;
- stage provenance.

### 13.4 Blocked run traceability

If a run is `blocked` or `partial`, `run_read_model` must point to the artifact(s) that justify the blockage.

For the current nearest live A2 case, that means the read model must be able to trace back to a repo-resident run result artifact that states:

- retrieval completed;
- validator blocked on empty evidence bundle;
- review not started.

### 13.5 Governance status exposure

If a source artifact is repo-resident documentation, its `document_status` must be explicit as one of:

- `approved`
- `draft`
- `outdated`

V1 read model may expose that status, but may not change it.

---

## 14. Comparability requirements

### 14.1 Comparable run must be explicit

Each `run_read_model` must carry:

- `comparison_family_key`
- `previous_comparable_run_id`

Comparable-run selection must never be implicit-only UI state.

### 14.2 Comparison anchor priority

For `signal_read_model`, V1 anchor priority is:

1. `pattern_key`
2. `normalized_signal_fingerprint`
3. `manual_review_only`

### 14.3 `candidate_id` boundary

Current repo-grounded A2 package explicitly keeps `candidate_id` run-local.

Therefore:

- `candidate_id` may be preserved in `source_signal_ref`
- `candidate_id` must not be the cross-run identity anchor by itself

### 14.4 Cross-run comparison posture

V1 comparison must support at minimum:

- appeared signals;
- disappeared signals;
- status change;
- contradiction change;
- pattern repeat visibility;
- blocked vs completed run difference.

### 14.5 Honest incompleteness rule

If no valid comparable predecessor exists, read model must say so explicitly instead of inventing diff state.

If comparison is weak, `comparison_confidence` must be `low`.

### 14.6 Current A2 mapping rule

`cross_run_repeat` is a read-model comparison result.

It must not be inferred from a single raw A2 within-run `runtime_pattern_state_raw`.

---

## 15. Boundaries with runtime / governance / feedback / UI

### 15.1 `runtime`

`runtime` owns:

- execution contour;
- raw run outputs;
- raw A1 decision fields;
- raw A2 `pattern_assessment` fields when emitted.

`decision_read_model` may:

- read runtime artifacts;
- normalize them;
- preserve raw fields.

`decision_read_model` may not:

- mutate runtime outputs;
- invent successful stage completion;
- rewrite raw A1 / A2 values as source truth.

### 15.2 `governance`

`governance` owns:

- `approved | draft | outdated` document status;
- canonical decision layer;
- approval and canonization flow.

`decision_read_model` may expose governance status for context.

`decision_read_model` may not:

- perform canonical sync;
- auto-promote draft artifacts;
- decide approval status.

### 15.3 `feedback`

V1 read model only reserves `feedback_placeholder_ref`.

It may:

- expose a stable attachment point;
- mark feedback as not yet opened.

It may not:

- define final feedback event schema;
- route write-side mutations automatically;
- close operator work by itself.

### 15.4 `UI`

`UI` is a downstream consumer of this contract.

UI may:

- render the objects;
- filter and sort them;
- present comparison and queue surfaces.

UI may not:

- redefine machine-facing fields;
- become the place where status semantics are invented;
- hide blocked run state for presentation cleanliness.

---

## 16. Integration with current A1 / A2 state

### 16.1 A1 integration

When review output exists, V1 read model must preserve:

- raw A1 decision in `source_status_code_raw`
- raw source semantic type in `source_signal_type_raw`
- raw source evidence strength in `source_evidence_strength_raw`
- blocker and rationale content through `status_assessment`
- contradiction and `next_step` visibility

Recommended current-state projection:

- `accept` -> `promising`
- `hold` -> `hold`
- `reject` -> `discard_candidate`

If a future run exposes richer A1 semantics, this mapping may be tightened in a follow-up draft, but raw source value must remain visible.

This normalization must not be read as a replacement for the approved source-layer triplet.

### 16.2 A2 integration

When validator or review output already carries raw A2 `pattern_assessment`, V1 read model must preserve:

- `pattern_key`
- `runtime_pattern_state_raw`
- `recurrence_count_in_run`
- raw amplifier evidence if available through source trace

Recommended current-state read-side interpretation:

- raw within-run A2 pattern states usually map to `pattern_candidate`
- absence of emitted A2 pattern state on a surfaced signal usually maps to `isolated_case` or `insufficient_pattern_evidence`, depending on whether the signal existed but had no repeat basis versus the stage never reached pattern evaluation

### 16.3 Live run 002 implication

Nearest repo-resident live result requires explicit support for:

- `run_outcome_status = blocked`
- `stage_statuses` showing `retrieval = completed`, `validator = blocked`, `review = not_started`
- `signal_count = 0`
- no fabricated signal-level objects

### 16.4 Live run 001 implication

Repo-resident diagnosis of live run 001 shows:

- contour can complete end-to-end;
- A1 can remain conservative;
- live recurrence may still be under-exercised even when the contour completes.

V1 read model therefore must not treat `run completed` as proof that `pattern_assessment` is materially informative.

### 16.5 Current repo limitation

Current repo does not track the raw runtime bundle for A2 live gate run 002.

For this reason V1 contract must permit grounding through repo-resident outcome-capture artifacts while still keeping explicit `artifact_ref` hooks for the runtime paths they describe.

---

## 17. Explicit non-goals

This draft does not try to:

- define full projection logic;
- define final storage schema;
- define final `feedback_event` contract;
- define operator action state machine;
- define production API;
- define UI information architecture;
- backfill missing runtime outputs;
- reinterpret blocked runs as successful runs;
- make `pattern_status` a substitute for A1 decision;
- introduce automatic canonical sync.

---

## 18. What future tasks this unlocks

После фиксации этого contract можно открывать уже не абстрактные discussion tasks, а конкретные adjacent specs:

- `operator_feedback_contract_v1`
- `decision_consumption_projection_spec_v1`
- `operator_cockpit_information_architecture_v1`

Дополнительно этот contract дает стабильную основу для:

- run inbox projection;
- cross-run comparator rules;
- blocked-run rendering rules;
- future feedback queue attachment.

---

## 19. Next logical task

### 19.1 Recommended immediate next task

- `operator_feedback_contract_v1`

### 19.2 Why this is next

После фиксации read-side objects следующим узким местом становится не UI, а write-side attachment semantics:

- как signal получает operator outcome;
- что именно является resolvable feedback record;
- как next-step routing отделяется от governance и runtime mutation.

---

## 20. What should not be opened yet

Не нужно открывать раньше времени:

- projection implementation;
- UI build;
- frontend architecture;
- production contour design;
- feedback contract finalization beyond placeholder semantics;
- automatic governance sync;
- broad product backlog decomposition;
- runtime redesign for future-proofing.

---

## 21. Explicit end section

### 21.1 What this contract fixes now

Сейчас этот draft фиксирует:

- V1 read-side object set;
- required relationships;
- required fields;
- raw-to-normalized preservation rule;
- blocked-run handling posture;
- A1 / A2 integration posture.

### 21.2 What remains intentionally open

Intentionally open:

- exact projector algorithm;
- exact storage backend;
- exact `normalized_signal_fingerprint` formula;
- exact contradiction taxonomy;
- exact priority scale for `next_step_entry`;
- exact feedback write-side model;
- exact UI composition.

### 21.3 Canonization posture

This document must remain an explicit draft.

It should not be presented as if canonical approval already exists.
