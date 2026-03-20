# quality_change_package_A2_switch_to_lane_2_live_gate_execution_package

Status: `draft`

Status note

- This draft was initially grounded on the repo-resident artifacts available in the non-git runtime workspace from which it was transferred here: `docs/drafts/quality_change_package_A2/quality_change_package_A2_minimal_implementation_wave.md`, `input/a2-live-gate-001-*`, `input/a2-live-gate-002-*`, `runs/a2-live-gate-001-*`, `runs/a2-live-gate-002-retrieval`, `runs/a2-minimal-smoke`, and the current runtime contour in `runner/`.
- The following named authoritative or supporting drafts exist in this canonical repo, but were not reopened, re-grounded, or edited during this transfer: `quality_spine_vA_canonical_draft`, `quality_system_principles_vA_working_draft_current`, `quality_spine_vA_canonical_draft_addendum_decision_consumption_gap`, `docs/drafts/quality_change_package_A2/quality_change_package_A2_design_candidate.md`, `docs/drafts/quality_change_package_A2/quality_change_package_A2_live_gate_run_001.md`, `docs/drafts/quality_change_package_A2/quality_change_package_A2_live_gate_run_001_diagnosis.md`, `docs/drafts/quality_change_package_A2/quality_change_package_A2_live_gate_run_002.md`.
- This package does not redesign A2. It only operationalizes the smallest next live gate step after the `hotel_phone_abandonment` mismatch under the current contour.
- This package preserves the agreed contour posture: preserve broadly, decide conservatively, `honesty_over_cosmetic_decisiveness`, strict stage-role separation, cross-run comparability as foundational, and `run` as the accounting unit.

## 1. Human layer

Сейчас нужен lane switch, потому что `hotel_phone_abandonment` не дал materially useful live-gate exercise для A2 recurrence. В run 001 retrieval завершился, но дал только `evidence_count=1`, validator и review дошли до конца, однако recurrence layer не был реально нагружен. В run 002 retrieval плотность не улучшилась, `evidence_count=0`, validator остановился с `No evidence records found`, а review вообще не был достигнут.

`reservation_call_center_scaling` сейчас лучше подходит для следующего A2 live gate, потому что уже зафиксирован в `quality_change_package_A2_minimal_implementation_wave` как lane с vendor-heavy case-study material вокруг `abandonment reduction`, `staffing expansion` и `outbound revenue`. Для текущего contour это важнее, чем идеально чистая доказательность: нужен lane, который с большей вероятностью даст несколько persisted evidence items по одной теме и позволит A2 показать recurrence markers без размягчения A1.

Практически следующий run должен показать три вещи. Во-первых, может ли текущий contour получить не один, а несколько persisted evidence items по одному lane. Во-вторых, может ли validator присвоить shared `pattern_key`, `recurrence_count_in_run >= 2` и non-empty `pattern_state_counts`. В-третьих, может ли review дойти до конца и сохранить A1 discipline, где recurrence повышает salience, но не превращается в shortcut к `accept`.

Этот switch не означает, что `hotel_phone_abandonment` бесполезен навсегда. Он также не доказывает, что A2 failed. Он означает только то, что under current contour этот lane оказался плохим live-gate lane для substantive A2 exercise, а `reservation_call_center_scaling` является более консервативным следующим шагом.

## 2. System layer

### A. Package definition

- `package_name`: `switch_to_lane_2_for_A2_live_gate`
- `purpose`: `prepare the smallest execution-ready live gate package to materially exercise A2 recurrence on lane_2 under the current contour`
- `lane`: `reservation_call_center_scaling`
- `in_scope`:
  - lane framing
  - input preparation guidance
  - execution guidance for the next live run
  - gate criteria
  - interpretation boundaries
  - post-run repo and governance capture
- `out_of_scope`:
  - A2 redesign
  - retrieval architecture redesign
  - source reputation redesign
  - claim-chain redesign
  - layered object model rollout
  - UI package
  - production contour
  - automatic canonical sync
  - reopening `hotel_phone_abandonment` as primary A2 live gate lane

### B. Lane-fit rationale

#### Why `hotel_phone_abandonment` is a poor gate lane under the current contour

- Run 001 completed end-to-end, but retrieval persisted only one evidence record.
- Run 001 therefore did not materially exercise A2 recurrence, because one evidence item cannot produce real within-run recurrence.
- Run 002 kept the same lane and tried denser input coverage, but retrieval persisted zero evidence records.
- Run 002 therefore failed before review and produced a `blocked` contour outcome, not a substantive A2 result.
- The repeated failure mode is lane/retrieval mismatch under the current contour, not a demonstrated A2 design failure as such.

#### Why `reservation_call_center_scaling` is a better fit for A2 recurrence validation

- The existing A2 minimal wave already framed this lane as one of the intended live-test lanes.
- Its expected evidence shape is narrower and more repeatable for the current runtime surface: vendor/customer stories about `abandonment reduction`, `staffing expansion`, `reservation sales reporting`, and `outbound revenue`.
- Under the current contour, vendor-heavy material is useful here because the immediate question is not `accept` readiness. The immediate question is whether the machine can detect repeated motifs across multiple persisted evidence items and preserve A1 discipline when doing so.
- This lane is more likely than `hotel_phone_abandonment` to surface several comparable URLs around one operational motif instead of collapsing into one isolated hospitality pain anecdote.
- If the lane produces `3-5` persisted evidence items and at least two of them can converge on one `pattern_key`, A2 gets a real recurrence exercise while A1 can still conservatively hold vendor-heavy evidence.

#### Explicit assumptions

- Assumption: vendor-heavy evidence is acceptable for recurrence exercise in this gate, because this run is testing A2 recurrence visibility rather than independent validation.
- Assumption: independent validation is not required for `success`, because `success` here means materially exercising recurrence under the current contour, not substantively validating the business claim.
- Assumption: cross-run comparability requires the same contour shape and the same model/policy surface, so this package keeps `retrieval -> validator -> review`, `openai/gpt-4o-mini-search-preview` for retrieval, `openai/gpt-5.4-mini` for validator/review, `allow_fallbacks=false`, `require_parameters=true`, and `web_plugin.engine=exa`.

### C. Input / execution preparation

#### Runtime surface to keep fixed

- Contour: `retrieval -> validator -> review`
- Retrieval model: `openai/gpt-4o-mini-search-preview`
- Validator model: `openai/gpt-5.4-mini`
- Review model: `openai/gpt-5.4-mini`
- Provider policy:
  - `allow_fallbacks=false`
  - `require_parameters=true`
- Web plugin:
  - `id=web`
  - `engine=exa`
  - `max_results=5`
- Recommended next run ids:
  - `a2-live-gate-003-retrieval`
  - `a2-live-gate-003-validator`
  - `a2-live-gate-003-review`

#### Required input shape

Следующий run должен оставаться single-lane. Не нужно смешивать `reservation_call_center_scaling` с другими lanes, не нужно делать mixed experiment, и не нужно расширять задачу до generic contact-center scaling.

Retrieval input JSON should keep the current runtime shape and explicitly anchor the run goal and current hypothesis on `reservation_call_center_scaling`.

Minimal retrieval input fields to preserve:

- `run_id`
- `run_goal`
- `current_hypothesis`
- `approved_context_snapshot`
- `constraints`
- `requested_outputs`
- `model_id`
- `provider_policy`
- `web_plugin`
- `search_queries`

Recommended retrieval query pack for the next live gate:

1. `hotel reservation sales call center case study`
2. `hotel reservation sales staffing expansion case study`
3. `hotel call abandonment reservation sales case study`
4. `resort reservation call center scaling revenue case study`
5. `hotel reservation sales outbound revenue case study`
6. `hospitality reservation sales reporting staffing growth`
7. `resort reservation sales call overflow case study`
8. `hotel reservation sales direct booking phone revenue`

#### Input properties that increase the chance of multiple persisted evidence items

- Queries should stay inside hospitality reservations rather than generic BPO or telecom call-center topics.
- Queries should target repeatable operator motifs: `reservation sales`, `call center`, `staffing expansion`, `overflow`, `outbound revenue`, `direct booking phone revenue`.
- Queries should include case-study and reporting language, because the current contour persisted vendor/customer-story evidence more reliably than symptom-only research phrases.
- Query set should cover both `hotel`, `resort`, and `hospitality` phrasing to avoid overfitting one lexical cluster.
- The preferred retrieval target is `3-5` persisted evidence records.
- The minimum meaningful floor is `2` persisted evidence records from distinct URLs.

#### Input anti-patterns that can cause `inconclusive` or `blocked`

- Over-narrow symptom-only queries such as missed calls without reservation-sales framing.
- Generic non-hospitality call-center scaling queries that drift into BPO or customer support.
- Duplicate vendor-name queries that collapse the run into one supplier cluster.
- Demo, contact, landing, or product-page style queries that increase low-signal retrieval.
- Mixing unrelated motifs in one run, for example combining reservation sales scaling with multilingual friction or unrelated hotel operations themes.

#### Recommended stage input alignment

Validator input should preserve the current shape:

- `run_id`: `a2-live-gate-003-validator`
- `run_goal`: state that validator checks whether lane 2 produces materially recurring motifs without overclaiming
- `current_hypothesis`: state that multiple reservation-sales evidence items should allow recurrence-based `pattern_assessment` without weakening A1
- `source_run_id`: `a2-live-gate-003-retrieval`
- `source_run_dir`: the corresponding retrieval run directory
- `model_id`: `openai/gpt-5.4-mini`
- `provider_policy`: unchanged from current live gate runs

Review input should preserve the current shape:

- `run_id`: `a2-live-gate-003-review`
- `stage`: `phase0_review_gate`
- `source_run_id`: `a2-live-gate-003-validator`
- `source_validated_signals_path`: `runs/a2-live-gate-003-validator/validated_signals.jsonl`
- `output_run_dir`: `runs/a2-live-gate-003-review`
- `models.retrieval`: `openai/gpt-4o-mini-search-preview`
- `models.review`: `openai/gpt-5.4-mini`
- `review_policy`: unchanged from current A1 review gate surface

#### Exact execution sequence

1. Prepare `input\a2-live-gate-003-retrieval.json` with the current runtime field shape and the lane 2 query pack above.
2. Run `python .\runner\retrieval_run.py input\a2-live-gate-003-retrieval.json`.
3. Inspect persisted retrieval artifacts and read `run_manifest.json`.
4. If retrieval `evidence_count == 0`, classify the run as `blocked` and stop the live gate chain there.
5. Prepare `input\a2-live-gate-003-validator.json` against the retrieval run directory.
6. Run `python .\runner\validator_run.py input\a2-live-gate-003-validator.json`.
7. Prepare `input\a2-live-gate-003-review.json` against the validator output path.
8. Run `python .\runner\review_gate.py input\a2-live-gate-003-review.json`.
9. Classify the outcome only from persisted run artifacts, not from free-form model prose in raw outputs.

### D. Gate criteria

#### `success`

Classify the run as `success` only if all of the following are true:

- Retrieval `run_manifest.json` shows `evidence_count >= 2`.
- Retrieval evidence comes from at least two distinct URLs in `evidence_index.jsonl`.
- Validator `validation_manifest.json` shows `repeated_pattern_key_count >= 1`.
- Validator `validation_manifest.json` shows non-empty `pattern_state_counts`.
- At least two items in `validated_signals.jsonl` share one `pattern_key`.
- That shared `pattern_key` has `recurrence_count_in_run >= 2` on those items.
- Review is reached and persists a normal review bundle.
- A1 remains intact at review: recurrence raises salience, but does not bypass blocker logic and does not force `accept`.
- `accept` is not required. For vendor-heavy lane 2 evidence, `hold` is an expected conservative outcome.

#### `inconclusive`

Classify the run as `inconclusive` if any of the following is true while the contour still runs far enough to inspect the outputs:

- Retrieval `evidence_count == 1`.
- Review is reached, but validator `repeated_pattern_key_count == 0`.
- Review is reached, but recurrence exists too weakly to count as a material A2 exercise.
- The run produces multiple items, but they do not converge into a shared `pattern_key` with meaningful within-run recurrence.

#### `blocked`

Classify the run as `blocked` if any of the following is true:

- Retrieval `evidence_count == 0`.
- Validator stops with `No evidence records found`.
- The live-gate chain fails before review because upstream evidence is empty or invalid.

### E. Run output / artifact expectations

#### Standard runtime bundles to preserve

Retrieval stage should preserve the standard bundle:

- `run_manifest.json`
- `candidate_signals.jsonl`
- `evidence_index.jsonl`
- `run_synthesis_ru.md`
- `project_update_block_ru.md`

Validator stage should preserve the standard bundle:

- `validation_manifest.json`
- `validated_signals.jsonl`
- `validation_summary_ru.md`
- `project_update_block_ru.md`

Review stage should preserve the standard bundle:

- `review_manifest.json`
- `reviewed_signals.jsonl`
- `decision_summary_ru.md`
- `project_update_block_ru.md`

#### Post-run draft artifacts required after the run

- Mandatory post-run draft: `docs/drafts/quality_change_package_A2/quality_change_package_A2_live_gate_run_003.md`
- Optional diagnosis draft only if the run is `inconclusive` or `blocked`: `docs/drafts/quality_change_package_A2/quality_change_package_A2_live_gate_run_003_diagnosis.md`

#### Mandatory sections inside the post-run draft

- `run setup`
- `input summary`
- `retrieval counts`
- `validator counts`
- `review counts`
- `gate outcome`
- `interpretation boundaries`
- `governance return payload`

#### Minimal information required for later governance sync

The post-run draft must preserve at least the following machine-stable payload:

- `lane`
- `run_ids`
- `model_policy_continuity`
- `retrieval.evidence_count`
- `validator.validated_signal_count`
- `validator.pattern_state_counts`
- `validator.repeated_pattern_key_count`
- `review.decision_counts`
- `final_outcome_class`
- `issue_scope_assessment`

`issue_scope_assessment` should say whether the new result still looks lane-specific or whether it has escalated into a contour-level retrieval issue.

### F. Interpretation boundaries

#### What a `success` run means

- `success` means lane 2 allowed a real A2 recurrence exercise under the current contour.
- `success` means the machine was able to persist enough evidence to let validator emit non-trivial recurrence markers and still keep A1 conservative at review.
- `success` means the lane switch was justified as an execution step.

#### What a `success` run does not mean

- `success` does not mean A2 is substantively validated overall.
- `success` does not mean production contour is ready.
- `success` does not prove `hotel_phone_abandonment` is useless forever.
- `success` does not justify reopening A2 design.
- `success` does not authorize canonical sync by itself.

#### What an `inconclusive` run means

- `inconclusive` means the contour ran, but did not materially test recurrence.
- `inconclusive` means lane switch alone did not yet produce enough recurring persisted evidence to make a governance-level A2 judgment.

#### When contour-level retrieval discussion becomes justified

- It becomes justified only if lane 2 still yields `0-1` persisted evidence items under the same contour and model policy.
- It also becomes justified if the lane switch still fails before review despite the tighter, hospitality-specific input preparation above.
- Until that happens, the conservative interpretation should remain lane-fit correction rather than contour redesign.

## 3. Integration layer

Этот task стыкуется с текущим состоянием A1 и A2 так: A1 runtime behavior уже валидирован и остаётся authoritative decision surface. A2 minimal implementation wave уже существует, механически реализована и mechanically smoke-validated, но ещё не substantively validated в live contour. Следующий run не переоткрывает дизайн. Он только пытается дать A2 тот тип evidence density, которого не хватило в `hotel_phone_abandonment`.

После run в governance/source-of-truth chat нужно вернуть только outcome и минимальный structured payload из section `governance return payload`. Нужно зафиксировать, дал ли lane switch materially better recurrence exercise, сохранилась ли A1 discipline, и выглядит ли проблема всё ещё lane-specific либо уже contour-level. Возвращать надо outcome, а не переписывать spine или канонизировать новые doctrine.

До результата этого run не нужно открывать:

- A2 redesign
- retrieval redesign
- source reputation redesign
- claim-chain redesign
- layered object model rollout
- UI package
- production contour
- automatic canonical sync
- reconsideration of `hotel_phone_abandonment` as primary A2 live gate lane

#### Risks removed by this execution step

- Снимается неоднозначность по выбору следующего lane.
- Снимается ложное давление судить A2 по poor-fit lane.
- Сохраняется comparability между runs, потому что contour и model policy не меняются, меняется только lane and input framing.

#### New risks created by this execution step

- Vendor-heavy recurrence может выглядеть сильнее, чем она есть substantively.
- `success` может быть ошибочно прочитан как доказательство общей A2 validation.
- Смена lane может ухудшить поверхностную сопоставимость, если потом забыть, что switch был lane-fit correction, а не product judgment.

## 4. Explicit end section

### What will change if this execution package is accepted

- The next A2 live gate will stop forcing `hotel_phone_abandonment` as the active lane.
- The preferred next live gate lane becomes `reservation_call_center_scaling`.
- The next run will use one fixed lane, one fixed query pack, and one fixed contour for a targeted recurrence exercise.
- The next outcome will be classed as `success`, `inconclusive`, or `blocked` from persisted run artifacts.

### What will not change

- A1 remains intact and authoritative.
- A2 remains not yet substantively validated.
- The runtime contour remains `retrieval -> validator -> review`.
- `accept | hold | reject` semantics remain unchanged.
- This package does not redesign retrieval, sources, claim chains, object model, UI, or production contour.
- This package does not prove permanent rejection of `hotel_phone_abandonment`.

### What must be fixed back into repo after the run

- The standard retrieval, validator, and review run bundles for run 003.
- `docs/drafts/quality_change_package_A2/quality_change_package_A2_live_gate_run_003.md`
- If needed, `docs/drafts/quality_change_package_A2/quality_change_package_A2_live_gate_run_003_diagnosis.md`
- The minimal governance return payload with lane, run ids, model/policy continuity, retrieval counts, validator counts, review counts, final outcome class, and issue scope assessment.

### What should remain unopened until after the run outcome

- A2 redesign
- contour-level retrieval redesign
- source reputation redesign
- claim-chain redesign
- layered object model rollout
- production contour discussion
- automatic canonical sync
- reopening `hotel_phone_abandonment` as the primary A2 gate lane

## Assumptions and non-changes

- Best-effort assumption: if no other live gate run is inserted first, the next sequential run id is `003`. If numbering changes later, only the run-id strings should change.
- Best-effort assumption: the unavailable governance/source-of-truth drafts remain unavailable in this workspace and will be synced later only after the run outcome exists.
- This draft intentionally leaves untouched all approved docs, canonical/governance docs, runtime code, current input packages, existing A2 drafts, and any index or cross-reference file.
- Later sync may be needed for `quality_spine_vA_canonical_draft`, `quality_system_principles_vA_working_draft_current`, `quality_spine_vA_canonical_draft_addendum_decision_consumption_gap`, and any restored A2 live-gate history drafts, but that sync is intentionally out of scope for this package.
