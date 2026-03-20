Status note

- `draft`
- `working spec`
- `spec only`
- `not implementation`
- `not canonized`

# decision_consumption_layer_spec_vA

## Document metadata

- `document_id`: `decision_consumption_layer_spec_vA`
- `document_type`: `working_spec`
- `status`: `draft`
- `spec_maturity`: `vA`
- `layer_type`: `decision_consumption_layer`
- `scope_mode`: `spec_only`
- `implementation_status`: `not_opened`
- `git_branch`: `main`
- `git_context_runtime_baseline_commit`: `e16bb2d`
- `git_context_a1_runtime_patch_commit`: `78d79c2`
- `git_context_a1_validation_followup_commit`: `d55e002`
- `git_context_a2_draft_artifact_commit`: `f76b53879e7a292f9976b22985d5ad5d7bc3f81e`
- `git_context_a2_minimal_implementation_package_commit`: `050a6120bf3e469cc6457bb68bc81cd9858878b0`
- `git_context_latest_a2_lane2_live_gate_planning_commit`: `dba74f242f957f510c90b4c6611852c4256a630d`

## Document status note

This document defines the spec-level design for `decision_consumption_layer` as a distinct system layer for operator-facing decision consumption and structured feedback routing.

This document does not define:
- UI implementation,
- frontend architecture,
- production contour,
- auth / roles / settings,
- automatic governance sync,
- runtime redesign,
- A2 redesign.

---

## 1. Human layer

### 1.1 Why this layer exists

The research machine already has a strong backend / governance contour:
- runtime / execution layer,
- quality / governance layer,
- canonical / working draft layer,
- A1 discipline,
- A2 live-gate contour in progress.

However, the operator / decision-maker still lacks a dedicated human-facing layer for:
- consuming outputs,
- comparing runs,
- seeing contradictions,
- identifying decision-relevant objects,
- providing structured feedback without reading raw backend output as the primary interface.

### 1.2 What pain it removes

Without this layer, the operator must:
- read raw backend-shaped outputs directly;
- reconstruct change between runs manually;
- distinguish `noise / recurring pattern / decision-relevant object` informally;
- give feedback through notes, governance sync, or implementation changes rather than through a structured decision surface.

This creates a systematic asymmetry:
- backend quality improves,
- governance quality improves,
- but decision consumption remains under-instrumented.

### 1.3 Why this is not “just UI”

This is not a cosmetic frontend task.
This is a system layer because it must introduce:
- a normalized read model between backend artifacts and human consumption;
- a structured feedback contract between operator judgment and downstream machine action;
- stable object semantics for cross-run comparison;
- explicit separation between read-side consumption and write-side feedback routing.

### 1.4 Evolution principle

This layer must be built evolutionarily, not cosmetically.

The correct posture is:
- contract-first,
- projection-based,
- conservative in automation,
- explicit about uncertainty,
- explicit about contradiction,
- versioned from the beginning.

This is required to avoid a brittle frontend built directly on top of raw runtime artifacts.

---

## 2. Scope

### 2.1 In scope

This document covers:
- layer definition,
- operator job model,
- minimal read model direction,
- feedback contract direction,
- layer boundaries,
- minimal operator cockpit structure,
- persistence and evolution posture,
- success metrics,
- integration with current A1 / A2 / governance state,
- prerequisites before implementation,
- logical follow-up task packages.

### 2.2 Out of scope

This document does not cover:
- UI build,
- production UX,
- frontend architecture rollout,
- design system,
- auth / roles / settings,
- dashboard polishing,
- repo edits,
- automatic canonical sync,
- layered object model rollout across the entire platform,
- backlog productization.

---

## 3. Governing assumptions

The following are treated as agreed for this spec:

- `preserve_broadly_decide_conservatively`
- `honesty_over_cosmetic_decisiveness`
- `strict_stage_role_separation`
- `cross_run_comparability_is_foundational`
- `run_is_the_accounting_unit`
- `a1_discipline_must_remain_intact`
- `ui_layer_is_not_yet_opened_as_implementation_wave`
- `this_task_is_spec_only_not_ui_build`

---

## 4. Layer definition

### 4.1 Layer name

- `layer_name`: `decision_consumption_layer`

### 4.2 Purpose

`decision_consumption_layer` exists to provide a normalized operator-facing decision surface over research machine outputs, so that the operator can:

- identify what changed,
- identify what deserves attention,
- inspect `signal`-level meaning,
- detect contradictions,
- compare comparable runs,
- produce structured feedback,
- route next-step intent without automatically mutating runtime or governance.

### 4.3 Core problem it solves

The layer solves the gap between:
- execution-quality machine output,
- governance-quality documentation,
- and practical operator decision usability.

The specific problem is that raw upstream artifacts are not suitable as the primary operator surface because they are optimized for:
- execution traceability,
- stage/lane processing,
- governance sync,
- quality control,

rather than for:
- rapid triage,
- cross-run change recognition,
- explicit contradiction handling,
- structured operator feedback.

### 4.4 Non-goals

This layer must not:
- become a new source of truth,
- become a write surface for governance,
- become a direct control panel for runtime mutation,
- hide uncertainty for presentation cleanliness,
- become a vanity dashboard,
- solve full product platform UX prematurely.

---

## 5. Operator job model

### 5.1 Primary operator role

Within this layer, the operator is primarily:

- `decision_maker`
- `next_step_dispatcher`

This is not primarily a passive reader role.
The layer exists to support decision consumption and structured routing.

### 5.2 Primary operator jobs

The operator uses this layer to:

1. triage action-needed items;
2. inspect a run without reading raw backend artifacts as the primary surface;
3. inspect `signal`-level meaning;
4. compare current run with previous comparable run;
5. determine whether an object is closer to:
   - `noise`,
   - `recurring pattern`,
   - `decision-relevant candidate`,
   - `hold`;
6. identify contradictions;
7. produce explicit operator outcomes;
8. route next-step intent to the correct downstream layer.

### 5.3 Primary questions the layer must answer quickly

The layer must help the operator answer:

- What changed since the previous comparable run?
- What needs my attention now?
- Which items are unresolved?
- Which items contain contradictions?
- Which signals look actionable?
- What evidence supports this object?
- What next step is recommended?
- What did I or the machine already conclude about this object?

### 5.4 Primary operator decisions supported in V1

The layer must support at minimum:

- `mark_noise`
- `needs_more_evidence`
- `hold`
- `queue_next_run`
- `escalate_contradiction`

These actions are intentionally conservative and do not assume that the operator should immediately force business commitment from every surfaced signal.

---

## 6. Core object posture

### 6.1 Accounting unit

- `accounting_unit`: `run`

`run` remains the accounting unit across the machine and this layer must preserve that rule.

### 6.2 Primary work unit

- `primary_work_unit`: `signal`

`signal` is the primary interactive unit inside the operator surface.

### 6.3 Supporting objects

This layer must support at minimum:

- `run`
- `signal`
- `contradiction`
- `next_step`
- `evidence_trace`
- `feedback_event`

### 6.4 Secondary object posture

- `pattern_state` is treated as a secondary object in V1.

It may be exposed as:
- secondary badge,
- secondary interpretive hint,
- comparison support element.

It is not the primary work unit in V1.

### 6.5 Exclusion rule

Objects without `evidence_trace` must not surface as operator-facing decision objects.

This rule exists to prevent the layer from becoming a suggestion surface detached from inspectable support.

---

## 7. Minimal operator surface structure

## 7.1 Primary entry point

- `primary_entry_view`: `run_inbox`

`run_inbox` is the main entry because the operator first needs to know where attention is required, not to browse a flat object space.

---

## 7.2 `run_inbox`

### Purpose

`run_inbox` is the triage surface.
Its job is to tell the operator:
- what needs action,
- what changed,
- what remains unresolved,
- where contradictions exist.

### Required posture

`run_inbox` must show:
- action-needed items first,
- not only a raw chronological run list.

### Sorting posture

Primary sorting:
- `unresolved_first`

Secondary sort logic may later include:
- contradiction presence,
- recency,
- priority,
but unresolved state is the primary rule in V1.

### Required filters

V1 must support at minimum:
- `contradiction`
- `changed`

### Empty-state contract

The empty state must communicate all of the following clearly:
- there are no unresolved items,
- all currently surfaced items are reviewed,
- there are no new material changes.

---

## 7.3 `run_detail`

### Purpose

`run_detail` is the primary workspace for one run.

Its job is not to display everything the backend produced.
Its job is to organize the run around operator work.

### Required structure

V1 `run_detail` must include:

1. short run summary on top;
2. grouped list of `signal_card`;
3. signal-level drill-down sections.

### Grouping rule

Signals are grouped by:
- `status`

This is the simplest and most operationally useful grouping for V1.

---

## 7.4 `signal_card`

### Role

`signal_card` is the primary interaction unit inside `run_detail`.

### Collapsed state

Collapsed `signal_card` must show at minimum:
- `label`
- `status`
- `changed`
- `contradiction_marker`
- `previous_comparable_status`

This gives the operator enough information to decide whether to open the item.

### Expanded sections

Expanded `signal_card` must support the following sections:

- `evidence_trace`
- `signal_history_across_runs`
- `feedback_actions`

### Evidence format

`evidence_trace` in V1 should be shown as:
- short excerpts,
- plus source refs.

The layer should not require the operator to open raw backend artifacts for first-pass evidence inspection.

### History format

`signal_history_across_runs` in V1 should be shown as:
- simple timeline.

### Confidence / strength posture

Signal strength or confidence may be shown in V1 only in a coarse way.
No pseudo-precise scoring should be introduced at this stage.

---

## 7.5 `comparison_view`

### Purpose

`comparison_view` exists to make cross-run comparability operationally usable.

### Top section

The first section must be:
- `summary_of_material_changes`

### Comparison modes

V1 must support both:
- current run vs previous comparable run,
- current run vs selectable comparable run.

### Comparison order

V1 comparison output should follow this order:

1. appeared / disappeared signals;
2. signal status changes;
3. new contradictions.

### Main comparison object

- `signal`

`pattern_state` may later enrich comparison, but `signal` remains the primary comparison object in V1.

---

## 7.6 `feedback_queue`

### Purpose

`feedback_queue` exists to track unresolved operator work and downstream-routed items without mixing them into governance or runtime directly.

### Intake rule

Primary queue contents:
- unresolved items only.

### Grouping rule

V1 grouping:
- by `target_layer`

### Closure rule

A queue item is closed only when there is:
- `explicit_operator_outcome`

This is important.
“Viewed” is not closure.
“Any click happened” is not closure.
Closure requires explicit resolution.

---

## 8. Read model requirements

### 8.1 Need for a normalized read model

A normalized read model is required between upstream machine artifacts and the operator surface.

The operator surface must not depend directly on raw runtime artifact shape.

### 8.2 Why raw runtime artifacts are insufficient

Raw runtime artifacts are insufficient as a UI contract because they are:
- execution-oriented,
- trace-heavy,
- stage/lane-shaped,
- unstable as a direct interaction contract,
- not optimized for cross-run consumption.

### 8.3 Read model design principles

The read model for this layer must be:

- read-optimized,
- projection-based,
- rebuildable from upstream artifacts,
- versioned,
- explicit about uncertainty,
- explicit about contradiction presence,
- conservative about interpretive state.

### 8.4 Minimum entities required

The read model must support at minimum:

- `run`
- `signal`
- `contradiction`
- `next_step`
- `evidence_trace`
- `feedback_event`

### 8.5 Minimum derived fields already implied by agreed V1 UX

At minimum, the read model must support:

- `unresolved_state`
- `changed_vs_previous_comparable`
- `previous_comparable_status`
- `contradiction_presence`
- `evidence_trace_presence`
- `next_step_provenance`
- `target_layer`
- `explicit_operator_outcome`

### 8.6 Comparable-run requirement

The layer requires a stable way to derive or resolve:
- `previous_comparable_run`

This is foundational.
Without comparable-run semantics, the layer cannot support its primary job properly.

### 8.7 Open read-model items

Still open and to be defined in a follow-up package:
- final schema for each entity,
- final lifecycle enum set,
- exact object identity rules across runs,
- exact comparison derivation logic,
- exact contradiction derivation logic.

---

## 9. Feedback contract direction

### 9.1 Feedback posture

Feedback in this layer must be:
- structured,
- auditable,
- traceable,
- conservative in effect.

It must not implicitly mutate runtime or governance.

### 9.2 Default operator action posture

After inspecting a signal, the default operator action is:
- `give_feedback`

The layer is not designed for passive reading only.

### 9.3 Minimum V1 actions

V1 must support:

- `mark_noise`
- `needs_more_evidence`
- `hold`
- `queue_next_run`
- `escalate_contradiction`

### 9.4 Easiest action

The easiest action to perform must be:
- `mark_noise`

This reflects the need for fast dismissal of low-value objects without overloading the operator.

### 9.5 Primary feedback target

- `primary_feedback_target`: `signal`

### 9.6 Whole-run feedback rule

Whole-run feedback is allowed only as:
- `routing_action`

This prevents the operator from using run-level feedback as a vague substitute for signal-level judgment.

### 9.7 Outcome rule

Feedback on a signal must produce:
- `explicit_operator_outcome`

Any allowed explicit outcome from the supported set may close signal-level work.

### 9.8 `operator_note`

- supported
- optional

`operator_note` exists as an auxiliary rationale field, not as the primary mechanism of state transition.

### 9.9 `next_step` semantics

V1 `next_step` must include:
- `recommendation`
- `target_layer`
- `priority`

Presentation posture:
- `queueable_action_block`

Provenance must always be visible:
- `machine`
- `operator`

### 9.10 Automation restriction

No feedback action in this layer may automatically:
- change runtime configuration,
- rewrite governance docs,
- canonize truth,
- modify A1/A2 rules,
- bypass explicit downstream review.

### 9.11 Open feedback contract items

Still open:
- final `feedback_event` schema,
- exact action enum set,
- downstream routing states,
- approval / review policy for routed items.

---

## 10. Layer boundaries

### 10.1 `runtime_layer`

Owns:
- execution,
- raw run outputs,
- stage/lane processing.

Does not own:
- operator-facing decision consumption,
- feedback queue semantics,
- governance truth writing.

### 10.2 `governance_layer`

Owns:
- approved docs,
- canonical decisions,
- stage rules,
- quality posture,
- official document statuses.

Does not own:
- live operator triage state,
- ad hoc decision-surface annotations,
- unresolved queue work.

### 10.3 `decision_consumption_layer`

Owns:
- normalized read-side decision surface,
- operator-facing object projections,
- cross-run comparison views,
- operator-facing prioritization logic.

Does not own:
- execution,
- canonical truth mutation,
- governance canonization,
- runtime mutation.

### 10.4 `feedback_layer`

Owns:
- structured operator feedback events,
- routed action candidates,
- unresolved queue semantics,
- explicit operator outcomes.

Does not own:
- automatic runtime mutation,
- automatic governance mutation.

### 10.5 Boundary summary

This layer must not:
- mix UI state with governance state,
- collapse read model into raw execution artifacts,
- turn operator clicks into silent system mutation.

---

## 11. Persistence and evolution model

### 11.1 Persistence posture

Operator feedback must not live only in:
- canonical docs,
- raw runtime artifacts,
- unstructured notes.

### 11.2 Write-side persistence

Feedback should persist in a dedicated:
- `feedback_event` log

### 11.3 Read-side persistence

The operator surface should be built through:
- versioned projections

### 11.4 Evolution posture

The layer must evolve through:
- versioned contracts,
- additive fields,
- explicit deprecations,
- rebuildable projections.

### 11.5 Minimum versioning surfaces

The implementation wave should later introduce at least:

- `read_model_version`
- `feedback_contract_version`
- `projection_version`
- `evidence_ref_version`
- `view_schema_version`

### 11.6 Open persistence items

Still open:
- exact storage location for `feedback_event`,
- queue materialization strategy,
- projection ownership,
- rebuild / backfill strategy.

---

## 12. Success metrics

### 12.1 Success posture

Success is not “the layer looks polished”.
Success means the layer materially improves operator decision usability.

### 12.2 What success should look like operationally

The operator should be able to:
- identify what changed quickly,
- identify unresolved work quickly,
- see contradictions explicitly,
- inspect evidence without relying on raw artifacts as the first surface,
- produce structured feedback,
- route next-step intent cleanly.

### 12.3 Candidate metrics

The following metrics are appropriate candidates for later contract work:

- `time_to_first_operator_judgment`
- `time_to_identify_material_change`
- `raw_artifact_escape_rate`
- `feedback_structuring_rate`
- `unrouted_feedback_rate`
- `contradiction_visibility_rate`
- `decision_candidate_precision`
- `comparable_run_coverage`
- `operator_review_closure_rate`

### 12.4 Anti-vanity rule

A visually pleasing surface without better decision throughput, contradiction visibility, and structured feedback routing does not count as success.

---

## 13. Integration with current machine state

### 13.1 Integration with A1

This layer must preserve A1 discipline.
It does not redefine A1 logic.
It only makes A1-shaped outputs more consumable and more comparable.

### 13.2 Integration with A2

This layer is especially important for A2 live-gate work because A2 increases pressure on:
- cross-run comparison,
- contradiction visibility,
- operator routing of next steps,
- disciplined differentiation between real movement and noise.

### 13.3 Integration with governance status

This layer must be able to consume document status markers such as:
- `approved`
- `draft`
- `outdated`

But it must not perform canonical sync automatically.

### 13.4 Required upstream inputs

This layer requires at minimum:
- stable `run_id`,
- run metadata,
- comparable-run linkage or derivable comparable semantics,
- upstream artifact refs,
- evidence trace anchors,
- governance status markers,
- document status markers.

### 13.5 Outputs back into the system

This layer should emit:
- `feedback_event`
- routed action candidates
- contradiction escalation candidates
- next-run planning candidates
- review completion markers

---

## 14. Fixed V1 decisions

The following are treated as fixed for the current working spec baseline.

### 14.1 Entry and navigation

- primary entry = `run_inbox`
- inbox shows action-needed items
- default destination = `run_detail`
- default comparison = `previous_comparable_run`
- selectable comparable run is also supported

### 14.2 Work unit and grouping

- primary work unit = `signal_card`
- main underlying object = `signal`
- grouping inside `run_detail` = by `status`

### 14.3 Collapsed signal view

Collapsed `signal_card` shows:
- `label`
- `status`
- `changed`
- `contradiction_marker`
- `previous_comparable_status`

### 14.4 Expanded signal view

Expanded `signal_card` includes:
- `evidence_trace`
- `signal_history_across_runs`
- `feedback_actions`

### 14.5 Comparison posture

`comparison_view` starts with:
- `summary_of_material_changes`

Then shows:
1. appeared / disappeared signals
2. status changes
3. new contradictions

### 14.6 Queue posture

- unresolved items appear in queue
- queue groups by `target_layer`
- queue closes only on `explicit_operator_outcome`

### 14.7 Filtering posture

V1 includes filters for:
- `contradiction`
- `changed`

### 14.8 Pattern-state posture

- `pattern_state` is secondary
- may appear as badge or secondary interpretive marker
- is not the primary work unit in V1

### 14.9 Evidence rule

- objects without `evidence_trace` do not surface

---

## 15. Prerequisites before implementation

Before implementation is opened, the following must be defined:

1. stable `run_id`
2. comparable-run semantics
3. artifact reference contract
4. evidence trace contract
5. document status exposure contract
6. draft `feedback_event` contract direction
7. projection ownership

These are required to prevent implementation from collapsing into ad hoc frontend coupling.

---

## 16. Logical follow-up task packages

### 16.1 Recommended next task packages

- `decision_read_model_contract_v1`
- `operator_feedback_contract_v1`
- `decision_consumption_projection_spec_v1`
- `operator_cockpit_information_architecture_v1`

### 16.2 Task ordering recommendation

Recommended order:
1. `decision_read_model_contract_v1`
2. `operator_feedback_contract_v1`
3. `decision_consumption_projection_spec_v1`
4. `operator_cockpit_information_architecture_v1`

Rationale:
- first stabilize objects,
- then stabilize feedback,
- then stabilize projection rules,
- then describe operator surface against stable contracts.

### 16.3 What should not be opened early

Do not open early:
- production frontend architecture,
- design system work,
- auth / RBAC,
- settings model,
- automatic governance sync,
- generalized analytics layer,
- full platform productization backlog.

---

## 17. Explicit end section

### 17.1 What this layer must give the machine

This layer must give the machine:
- a usable operator decision surface,
- structured operator feedback as system input,
- stable cross-run decision consumption,
- explicit contradiction visibility,
- disciplined next-step routing.

### 17.2 What this layer must not try to solve

This layer must not try to solve:
- full production UI rollout,
- runtime redesign,
- governance redesign,
- automatic source-of-truth mutation,
- full platform object modeling,
- generalized dashboarding.

### 17.3 What must be done before implementation

Before implementation:
- define the read model contract,
- define the feedback contract,
- define evidence trace rules,
- define comparable-run semantics,
- define projection ownership and persistence posture.

### 17.4 Canonization posture

This document should not automatically trigger canonization.

Canonization, if considered later, should be evaluated separately against:
- `quality_spine_vA_canonical_draft`
- `quality_system_principles_vA_working_draft_current`
- `quality_spine_vA_canonical_draft_addendum_decision_consumption_gap`
- `quality_spine_vA_status_addendum_A2_lane2_live_gate`

---

## 18. Open items

The following remain intentionally open:

- final lifecycle enum set for `signal`
- final `feedback_event` schema
- final `decision_read_model` schema
- exact projection rules from upstream artifacts
- exact contradiction derivation rules
- exact queue state model
- exact visual layout
- implementation architecture
- downstream routing approval policy
