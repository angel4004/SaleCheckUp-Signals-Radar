Status note

- `draft`
- `implementation package`
- `demo wave only`
- `not canonical`
- `not production contour`
- `no runtime or UI code opened by this document`
- `grounding_note`: repo-resident source-of-truth files `quality_spine_vA_canonical_draft`, `quality_spine_vA_status_addendum_operator_ui_demo_wave_v0`, and `quality_spine_vA_status_addendum_decision_read_model` were not found in the current worktree. This package is therefore grounded on repo-available artifacts only and does not invent substitute file paths.
- `assumption_note_1`: no repo-resident artifact named `minimal_operator_ui_demo_wave_v0` was found. References to it in this package are therefore best-effort interpretations based on the existing `apps/operator_ui_demo` contour already present in repo.
- `assumption_note_2`: for this wave, the correct primary demo path is the fully repo-resident `phase0-retrieval-run-003 -> phase0-validator-run-005 -> phase0-review-run-001` chain. Existing A2 live-gate surfaces remain useful secondary honesty states, but not the primary bounded demo path because they are partly hybrid.

# end_to_end_insight_flow_demo_wave_v0_implementation_package

## Document metadata

- `document_id`: `end_to_end_insight_flow_demo_wave_v0_implementation_package`
- `document_type`: `draft_implementation_package`
- `status`: `draft`
- `layer_type`: `decision_consumption_layer`
- `scope_mode`: `demo_wave_only`
- `implementation_status`: `not_opened`
- `git_branch`: `main`
- `git_context_current_head_commit`: `32b27a6b9d8412b10ed9e109670bc0cf144a1af6`
- `git_context_runtime_baseline_commit`: `e16bb2d`
- `git_context_a1_runtime_patch_commit`: `78d79c2`
- `git_context_a1_validation_followup_commit`: `d55e002`
- `git_context_a2_draft_artifact_commit`: `f76b53879e7a292f9976b22985d5ad5d7bc3f81e`
- `git_context_a2_minimal_implementation_package_commit`: `050a6120bf3e469cc6457bb68bc81cd9858878b0`
- `git_context_a2_lane2_live_gate_execution_package_commit`: `dba74f242f957f510c90b4c6611852c4256a630d`
- `git_context_decision_consumption_layer_spec_commit`: `6bce73a`
- `git_context_decision_read_model_contract_commit`: `bfa4cba`
- `git_context_operator_ui_demo_wave_commit`: `32b27a6`

## Repo grounding used for this package

- `docs/drafts/decision_consumption_layer/decision_consumption_layer_spec_vA.md`
- `docs/drafts/decision_consumption_layer/decision_read_model_contract_v1.md`
- `docs/drafts/quality_change_package_A2/quality_change_package_A2_minimal_implementation_wave.md`
- `docs/drafts/quality_change_package_A2/quality_change_package_A2_live_gate_run_001.md`
- `docs/drafts/quality_change_package_A2/quality_change_package_A2_live_gate_run_002.md`
- `runtime/input/phase0-retrieval-run-003.json`
- `runtime/runs/phase0-retrieval-run-003/run_manifest.json`
- `runtime/runs/phase0-retrieval-run-003/evidence_index.jsonl`
- `runtime/runs/phase0-validator-run-005/validation_manifest.json`
- `runtime/runs/phase0-validator-run-005/validated_signals.jsonl`
- `runtime/runs/phase0-review-run-001/review_manifest.json`
- `runtime/runs/phase0-review-run-001/reviewed_signals.jsonl`
- `runtime/runs/phase0-review-run-001/decision_summary_ru.md`
- `apps/operator_ui_demo/scripts/build_demo_read_model.mjs`
- `apps/operator_ui_demo/public/demo-data/runs_index.json`
- `apps/operator_ui_demo/public/demo-data/source_map.json`
- `apps/operator_ui_demo/public/demo-data/run_details/phase0-review-run-001.json`
- `apps/operator_ui_demo/public/demo-data/comparisons/phase0-validator-run-005__phase0-review-run-001.json`

## 1. Human layer

Эта wave должна показать не набор изолированных экранов, а один честный движущийся контур: есть ограниченный вход, есть зафиксированная цепочка `run`, есть projection в demo-side read model, и есть UI, в котором оператор видит итоговый insight вместе с provenance, contradictions и next steps.

Почему это правильный следующий шаг после `minimal_operator_ui_demo_wave_v0`: минимальная demo-поверхность уже показывает, что `Run Inbox`, `Run Detail`, `Comparison View` и `Feedback Queue` могут рендерить read-side объекты. Но этого недостаточно, если человек не может быстро понять, какой именно вход породил какой `run`, как этот `run` дошел до операторского экрана и где кончается реальность и начинается demo-side reconstruction. Следующая правильная цель поэтому не новый экран, а связанный `input -> run -> projection -> UI` путь.

В конце demo оператор должен реально увидеть: один bounded `phase0` сценарий, в котором из конкретного входного пакета и сохраненных runtime artifacts собирается review-visible surface с двумя `signal`, явными `hold`, evidence trace назад к retrieval, сравнением validator vs review и отдельно помеченными `hybrid` / `mock` зонами. Оператор также должен видеть, что UI не мутирует runtime автоматически и не мутирует governance автоматически.

## A. Wave definition

- `wave_name`: `end_to_end_insight_flow_demo_wave_v0`
- `purpose`: сделать один bounded и locally replayable путь от repo-resident input/artifacts до operator-visible insight внутри существующего `apps/operator_ui_demo`
- `why_now`:
  - текущий repo уже содержит `decision_consumption_layer` spec, `decision_read_model_contract_v1`, demo projector и seeded operator UI contour
  - текущий contour уже показывает `run`, `signal`, `comparison`, `blocked`, `zero_signal`, `inconclusive`, но еще не оформлен как единый human-demonstrable end-to-end path
  - без этого шага UI остается похожим на полезный mock/projection surface, а не на ясно читаемый контур from input to insight
- `in_scope`:
  - one primary artifact-backed demo path
  - explicit lineage from bounded input to operator-visible review insight
  - explicit labeling of `artifact_backed`, `hybrid`, and `mock`
  - reuse of the existing `operator_ui_demo` contour
  - explicit preservation of `run_is_the_accounting_unit`
  - explicit preservation of `signal` as the primary operator work unit for V1
- `out_of_scope`:
  - production contour
  - runtime logic changes
  - UI redesign beyond what is necessary for end-to-end demonstrability
  - finalization of `decision_read_model_contract_v1`
  - finalization of `operator_feedback_contract_v1`
  - automatic mutation of runtime
  - automatic mutation of governance
  - canonical doc rewrite

## B. End-to-end flow definition

What counts as bounded / replayable input:

- primary bounded input for this wave: `runtime/input/phase0-retrieval-run-003.json`
- replayability for this wave means: re-projecting the same repo-resident runtime artifacts into demo-side JSON without depending on fresh live web retrieval
- bounded artifact set for the primary path:
  - `runtime/input/phase0-retrieval-run-003.json`
  - `runtime/runs/phase0-retrieval-run-003/*`
  - `runtime/runs/phase0-validator-run-005/*`
  - `runtime/runs/phase0-review-run-001/*`

What run contour step is used:

- primary contour step chain:
  - `phase0-retrieval-run-003`
  - `phase0-validator-run-005`
  - `phase0-review-run-001`
- this preserves:
  - `run_is_the_accounting_unit`
  - `strict_stage_role_separation`
  - `preserve_broadly_decide_conservatively`

What read-side projection step is used:

- existing projector: `apps/operator_ui_demo/scripts/build_demo_read_model.mjs`
- projection target: `apps/operator_ui_demo/public/demo-data/`
- projection posture:
  - primary path should stay `artifact_backed`
  - comparison deltas may remain partly `hybrid`
  - local feedback remains `mock`
- important boundary:
  - this wave may add demo-side lineage metadata
  - this wave must not silently promote that demo-side lineage metadata into canonical `decision_read_model_contract_v1`

What UI consumption step is used:

- existing UI contour in `apps/operator_ui_demo`
- primary route sequence:
  - `Run Inbox`
  - `Run Detail`
  - `Comparison View`
  - `Feedback Queue`
- secondary honesty states that may remain visible from the same inbox:
  - `blocked`
  - `zero_signal`
  - `inconclusive`

## C. Minimal demo path

- `input`:
  - operator/demo host starts from `runtime/input/phase0-retrieval-run-003.json`
  - the input identity must be made visible in the demo as an explicit lineage anchor, not only as an implicit upstream assumption
- `execution_or_replay`:
  - use persisted repo-resident runtime outputs from `phase0-retrieval-run-003`, `phase0-validator-run-005`, and `phase0-review-run-001`
  - no fresh live execution is required for this wave
  - no production contour is opened
- `projection`:
  - run `apps/operator_ui_demo/scripts/build_demo_read_model.mjs`
  - generate or refresh:
    - `apps/operator_ui_demo/public/demo-data/runs_index.json`
    - `apps/operator_ui_demo/public/demo-data/source_map.json`
    - `apps/operator_ui_demo/public/demo-data/run_details/phase0-validator-run-005.json`
    - `apps/operator_ui_demo/public/demo-data/run_details/phase0-review-run-001.json`
    - `apps/operator_ui_demo/public/demo-data/comparisons/phase0-validator-run-005__phase0-review-run-001.json`
- `ui_render`:
  - open `Run Inbox`
  - open `phase0-review-run-001`
  - inspect run banner, stage statuses, signal rows, contradictions, next steps, evidence trace, and provenance chips
  - open validator-vs-review comparison for the same family
- `operator_observation`:
  - operator sees two review-visible `signal`
  - operator sees both review decisions are `hold`
  - operator sees exact evidence trace linkage back to retrieval artifacts
  - operator sees that comparison sections are partly hybrid where cross-run mapping is reconstructed
  - operator sees that feedback affordances are local demo actions only

## D. Data / artifact path

Which artifacts are source:

- `runtime/input/phase0-retrieval-run-003.json`
- `runtime/runs/phase0-retrieval-run-003/run_manifest.json`
- `runtime/runs/phase0-retrieval-run-003/evidence_index.jsonl`
- `runtime/runs/phase0-validator-run-005/validation_manifest.json`
- `runtime/runs/phase0-validator-run-005/validated_signals.jsonl`
- `runtime/runs/phase0-review-run-001/review_manifest.json`
- `runtime/runs/phase0-review-run-001/reviewed_signals.jsonl`
- `runtime/runs/phase0-review-run-001/decision_summary_ru.md`

Which are projected / demo-side:

- `apps/operator_ui_demo/public/demo-data/runs_index.json`
- `apps/operator_ui_demo/public/demo-data/source_map.json`
- `apps/operator_ui_demo/public/demo-data/run_details/phase0-validator-run-005.json`
- `apps/operator_ui_demo/public/demo-data/run_details/phase0-review-run-001.json`
- `apps/operator_ui_demo/public/demo-data/comparisons/phase0-validator-run-005__phase0-review-run-001.json`
- existing UI pages/components that consume those files

Which are generated for the wave:

- refreshed demo-side JSON for the primary path
- one explicit demo-side lineage attachment for the primary scenario
- best-effort implementation options for that attachment:
  - add a demo-only lineage block into `run_details/*.json`
  - or create one narrow scenario descriptor under `apps/operator_ui_demo/public/demo-data/`
- no new canonical contract document
- no new runtime artifact contract

How provenance is preserved via:

- `artifact_backed`:
  - primary `phase0` path
  - run summary facts rooted in tracked runtime manifests
  - signal rows rooted in tracked validator/review outputs
  - evidence traces rooted in tracked retrieval artifacts
- `hybrid`:
  - cross-run contradiction / next-step delta mapping
  - `zero_signal` classification over completed smoke bundle
  - `a2-live-gate-001` and `a2-live-gate-002` demo entries built from repo-resident drafts plus cited external runtime paths
  - any demo-only lineage block that stitches several tracked refs into one operator-readable chain
- `mock`:
  - local feedback actions stored in browser `localStorage`
  - no runtime write-back
  - no governance write-back

## E. UI demonstration contract

What exactly the UI must visibly demonstrate:

- one operator can start from a bounded run family rather than from disconnected screens
- the primary path goes from bounded input to retrieval to validator to review to operator-visible insight
- `phase0-review-run-001` is visibly connected to `phase0-validator-run-005`
- at least one changed signal is visibly connected across validator vs review comparison
- provenance is visible on summary, state banner, stage statuses, signal cards, contradiction entries, next steps, and evidence traces
- local feedback is visibly present, but visibly demo-only

Which states must be visible:

- run states:
  - `populated`
  - `blocked`
  - `zero_signal`
  - `inconclusive`
- stage states:
  - `completed`
  - `blocked`
  - `not_started`
- provenance/source states:
  - `artifact_backed`
  - `hybrid`
  - `mock`

Which fields / objects must be visibly connected across the flow:

- `runId`
- `previousComparableRunId`
- `comparisonFamilyKey`
- `signalId`
- `traceId`
- `artifactPath`
- `locatorHint`
- `sourceMode`
- one explicit `input_ref` or `input_package_ref` for the primary scenario

How user understands “this came from that run/input”:

- the primary review run must expose a visible lineage chain such as:
  - `runtime/input/phase0-retrieval-run-003.json`
  - `phase0-retrieval-run-003`
  - `phase0-validator-run-005`
  - `phase0-review-run-001`
  - current projected demo file
- this linkage may live in demo-only projection metadata if needed
- this linkage must not be presented as final canonical `decision_read_model` shape unless later canonized separately

## F. Minimal implementation plan

Likely files/folders touched later during implementation:

- `apps/operator_ui_demo/scripts/build_demo_read_model.mjs`
- `apps/operator_ui_demo/src/lib/readModel.ts`
- `apps/operator_ui_demo/src/pages/RunInboxPage.tsx`
- `apps/operator_ui_demo/src/pages/RunDetailPage.tsx`
- `apps/operator_ui_demo/src/components/RunCard.tsx`
- `apps/operator_ui_demo/src/components/ProvenanceChip.tsx`
- `apps/operator_ui_demo/public/demo-data/`

What adapter / projection layer is needed:

- a thin demo-only lineage adapter over the existing projector
- purpose of the adapter:
  - bind one primary scenario to one visible `input -> run -> projection -> UI` chain
  - keep `run` as the accounting unit
  - keep `signal` as the operator work unit
  - expose what is `artifact_backed` vs `hybrid` vs `mock`
- boundary:
  - no runtime schema change is required for this wave
  - no final read-model canonization is implied

What should be created vs reused:

- reuse:
  - existing `operator_ui_demo` routing and screens
  - existing seeded `phase0` artifacts
  - existing `source_map` posture
  - existing comparison surface
- create:
  - explicit lineage attachment for the primary path
  - minimal UI affordance that makes the lineage human-readable
  - refreshed demo-data built from the active repo state

How to run the demo locally:

```powershell
node apps/operator_ui_demo/scripts/build_demo_read_model.mjs
npm --prefix apps/operator_ui_demo run dev
```

Local demo walkthrough:

- open `Run Inbox`
- open `phase0-review-run-001`
- inspect lineage, stage statuses, signals, contradictions, next steps, and evidence traces
- open comparison for `phase0-validator-run-005__phase0-review-run-001`
- optionally trigger local feedback and confirm it lands only in `Feedback Queue`

What counts as completed demo wave:

- one operator can follow a single bounded scenario from explicit input reference to visible review insight
- the UI clearly marks `artifact_backed`, `hybrid`, and `mock`
- the UI shows that no automatic runtime mutation happens
- the UI shows that no automatic governance mutation happens
- the demo remains honest about partial comparison and hybrid reconstruction

## G. Proof criteria

What counts as successful end-to-end demo:

- the primary `phase0` scenario is navigable from inbox to detail to comparison
- the operator can answer:
  - what input/run this came from
  - what the current review posture is
  - what evidence supports the visible signals
  - what changed between validator and review
  - what next step is suggested
- provenance is visible and correctly labeled
- no fabricated signal rows are used for the primary artifact-backed path

What counts as partial / inconclusive:

- screens render, but input lineage is still implicit rather than explicit
- the operator can see run detail, but cannot easily tell “this came from that run/input”
- comparison works, but the hybrid sections are not clearly explained
- only secondary hybrid A2 paths are demonstrable while the primary artifact-backed path remains unclear

What counts as failed demo:

- the UI still behaves like disconnected screens rather than one moving contour
- blocked / zero-signal / inconclusive states are hidden or cosmetically normalized away
- provenance labels are absent or misleading
- local feedback appears to mutate runtime or governance
- the wave overstates current maturity as if the system were production-ready

What evidence should be brought back to source-of-truth after completion:

- screenshot set or short walkthrough of:
  - inbox
  - primary run detail
  - comparison page
  - feedback queue
- exact primary source artifacts used
- exact projected demo artifacts generated
- explicit list of `artifact_backed`, `hybrid`, and `mock` zones
- operator-readability gaps discovered during the walkthrough
- recommendation whether the lineage attachment should remain demo-only or graduate into a later contract proposal

## 3. Integration layer

How this wave builds on existing `operator_ui_demo` contour:

- it reuses the current contour rather than replacing it
- it treats `Run Inbox`, `Run Detail`, `Comparison View`, and `Feedback Queue` as the existing shell
- it upgrades the shell from “rendering available demo objects” to “showing one bounded path from input to insight”
- it preserves the current honest surface for `blocked`, `zero_signal`, and `inconclusive` states

How it uses `decision_read_model` intent without pretending the full system is finalized:

- it aligns with the existing read-model direction:
  - `run` as primary accounting unit
  - `signal` as primary operator work unit
  - explicit contradictions
  - explicit next steps
  - explicit provenance
  - explicit partial/blocked states
- it does not declare the current projector JSON shape to be the final canonical contract
- any lineage attachment introduced for this wave may remain demo-only until separately reviewed

What later tasks it unlocks:

- a cleaner handoff from demo projection to a more stable projector layer
- a deliberate `operator_feedback_contract_v1` draft that attaches to visible run/signal lineage instead of to isolated buttons
- a follow-up wave for multi-scenario comparison once one bounded path is working clearly
- a later wave for stronger A2 demo inclusion if repo-resident raw/live artifacts become more complete

What it intentionally leaves unresolved:

- final canonical `decision_read_model`
- final feedback write-side contract
- production storage / transport
- auth / roles / settings
- auto-sync into governance
- auto-mutation of runtime
- full A2 live recurrence demonstrability
- any claim of production readiness

## 4. Explicit end section

What the operator will see in the end-to-end demo:

- a run inbox with explicit run states
- one primary review run detail that can be traced back to a bounded input and upstream runs
- two review-visible `signal` with evidence traces, contradictions, and next steps
- one validator-vs-review comparison showing at least one meaningful decision-tightening delta
- a feedback queue that clearly stores demo-only local actions

What in it will be real:

- repo-resident `phase0` input and runtime artifacts
- repo-resident evidence traces
- repo-resident validator and review outputs
- repo-resident UI contour and projector

What will remain hybrid / provisional:

- comparison contradiction and next-step deltas
- `zero_signal` smoke mapping
- `a2-live-gate-001` and `a2-live-gate-002` demo entries
- any demo-only lineage attachment that is added for this wave
- local feedback persistence

What must not be confused with production readiness:

- this is not a production read model
- this is not a production operator workstation
- this is not a runtime control plane
- this is not governance mutation
- this is not proof that A2 live recurrence handling is fully demonstrated

What next task should logically be opened after this wave:

- open draft `operator_feedback_contract_v1`, but bind it explicitly to the demonstrated `run` / `signal` lineage and keep write-side automation out of scope
