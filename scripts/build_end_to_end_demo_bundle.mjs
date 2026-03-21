import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const demoDataRoot = path.join(
  repoRoot,
  "apps",
  "operator_ui_demo",
  "public",
  "demo-data",
);
const outputRoot = path.join(demoDataRoot, "end_to_end_demo");

const refs = {
  boundedInput: "runtime/input/phase0-retrieval-run-003.json",
  retrievalManifest: "runtime/runs/phase0-retrieval-run-003/run_manifest.json",
  retrievalEvidence: "runtime/runs/phase0-retrieval-run-003/evidence_index.jsonl",
  validatorManifest: "runtime/runs/phase0-validator-run-005/validation_manifest.json",
  validatedSignals: "runtime/runs/phase0-validator-run-005/validated_signals.jsonl",
  reviewManifest: "runtime/runs/phase0-review-run-001/review_manifest.json",
  reviewedSignals: "runtime/runs/phase0-review-run-001/reviewed_signals.jsonl",
  decisionSummary: "runtime/runs/phase0-review-run-001/decision_summary_ru.md",
  runsIndex: "apps/operator_ui_demo/public/demo-data/runs_index.json",
  sourceMap: "apps/operator_ui_demo/public/demo-data/source_map.json",
  validatorRunDetail:
    "apps/operator_ui_demo/public/demo-data/run_details/phase0-validator-run-005.json",
  reviewRunDetail:
    "apps/operator_ui_demo/public/demo-data/run_details/phase0-review-run-001.json",
  smokeRunDetail:
    "apps/operator_ui_demo/public/demo-data/run_details/phase0-smoke-run-001.json",
  blockedRunDetail:
    "apps/operator_ui_demo/public/demo-data/run_details/a2-live-gate-002.json",
  inconclusiveRunDetail:
    "apps/operator_ui_demo/public/demo-data/run_details/a2-live-gate-001.json",
  comparison:
    "apps/operator_ui_demo/public/demo-data/comparisons/phase0-validator-run-005__phase0-review-run-001.json",
  boundedOutput:
    "apps/operator_ui_demo/public/demo-data/end_to_end_demo/bounded_demo_input_manifest_v0.json",
  artifactOutput:
    "apps/operator_ui_demo/public/demo-data/end_to_end_demo/artifact_manifest_v0.json",
  bundleOutput:
    "apps/operator_ui_demo/public/demo-data/end_to_end_demo/decision_read_bundle_demo_v0.json",
  provenanceOutput:
    "apps/operator_ui_demo/public/demo-data/end_to_end_demo/provenance_manifest_v0.json",
};

const assumptions = [
  "phase0-review-run-001 remains the primary artifact-backed operator anchor for this demo wave.",
  "The new end_to_end_demo manifests stay demo-only and do not redefine decision_read_model_contract_v1.",
  "phase0-smoke-run-001, a2-live-gate-001, and a2-live-gate-002 remain secondary honesty states rather than the primary walkthrough path.",
];

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

async function readJson(relativePath) {
  const raw = await fs.readFile(path.join(repoRoot, relativePath), "utf8");
  return JSON.parse(raw);
}

async function writeJson(relativePath, value) {
  const outputPath = path.join(outputRoot, relativePath);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function lineage(stepId, label, ref, note, materializationMode) {
  return { stepId, label, ref, note, materializationMode };
}

function runEntry({
  runId,
  route,
  state,
  materializationMode,
  boundedInputSummary,
  sourceArtifactRefs,
  projectionNotes,
  assumptions: entryAssumptions = [],
  uiVisibleReason,
  lineageSteps,
}) {
  return {
    objectId: runId,
    objectType: "run",
    route,
    runId,
    state,
    materializationMode,
    boundedInputSummary,
    sourceArtifactRefs,
    projectionNotes,
    assumptions: entryAssumptions,
    uiVisibleReason,
    lineage: lineageSteps,
  };
}

function signalEntry({
  runId,
  signalId,
  state,
  materializationMode,
  boundedInputSummary,
  sourceArtifactRefs,
  projectionNotes,
  assumptions: entryAssumptions = [],
  uiVisibleReason,
  lineageSteps,
}) {
  return {
    objectId: `${runId}::${signalId}`,
    objectType: "signal",
    route: `/runs/${runId}`,
    runId,
    signalId,
    state,
    materializationMode,
    boundedInputSummary,
    sourceArtifactRefs,
    projectionNotes,
    assumptions: entryAssumptions,
    uiVisibleReason,
    lineage: lineageSteps,
  };
}

async function main() {
  execFileSync(
    process.execPath,
    [
      path.join(
        repoRoot,
        "apps",
        "operator_ui_demo",
        "scripts",
        "build_demo_read_model.mjs",
      ),
    ],
    { cwd: repoRoot, stdio: "inherit" },
  );

  const [
    boundedInput,
    retrievalManifest,
    validatorManifest,
    reviewManifest,
    runsIndex,
    sourceMap,
    validatorRunDetail,
    reviewRunDetail,
    smokeRunDetail,
    blockedRunDetail,
    inconclusiveRunDetail,
    comparison,
  ] = await Promise.all([
    readJson(refs.boundedInput),
    readJson(refs.retrievalManifest),
    readJson(refs.validatorManifest),
    readJson(refs.reviewManifest),
    readJson(refs.runsIndex),
    readJson(refs.sourceMap),
    readJson(refs.validatorRunDetail),
    readJson(refs.reviewRunDetail),
    readJson(refs.smokeRunDetail),
    readJson(refs.blockedRunDetail),
    readJson(refs.inconclusiveRunDetail),
    readJson(refs.comparison),
  ]);

  const generatedAt = runsIndex.generatedAt;
  const sourceCommit = runsIndex.sourceCommit ?? sourceMap.sourceCommit ?? null;
  const boundedInputSummary =
    "Bounded phase0 hotel phone-loss input is replayed through persisted retrieval, validator, and review artifacts before entering the demo-side projection.";

  const runDetails = {
    "phase0-validator-run-005": validatorRunDetail,
    "phase0-review-run-001": reviewRunDetail,
    "phase0-smoke-run-001": smokeRunDetail,
    "a2-live-gate-002": blockedRunDetail,
    "a2-live-gate-001": inconclusiveRunDetail,
  };

  const runConfigs = {
    "phase0-validator-run-005": {
      route: "/runs/phase0-validator-run-005",
      mode: "artifact_backed",
      projectionNotes:
        "Validator detail is rebuilt from tracked validator output plus retrieval evidence, with the new provenance overlay keeping the bounded chain visible.",
      uiVisibleReason:
        "This run stays visible as the pre-review stage anchor so the operator can compare validator posture against review posture.",
      assumptions: [],
      lineageSteps: [
        lineage("bounded_input", "Bounded input manifest", refs.boundedInput, "The same bounded input anchors the validator surface.", "artifact_backed"),
        lineage("retrieval_run", "Retrieval run", refs.retrievalManifest, "Validator consumes the persisted evidence bundle from retrieval.", "artifact_backed"),
        lineage("validator_run", "Validator run", refs.validatorManifest, "Validator emitted the tracked signal rows shown to the operator.", "artifact_backed"),
        lineage("projected_run_detail", "Projected validator detail", refs.validatorRunDetail, "The UI reads generated validator detail JSON plus the explicit provenance overlay.", "hybrid"),
        lineage("ui_route", "Run detail route", "route:/runs/phase0-validator-run-005", "RunDetailPage renders the validator surface with explicit lineage.", "hybrid"),
      ],
    },
    "phase0-review-run-001": {
      route: "/runs/phase0-review-run-001",
      mode: "artifact_backed",
      projectionNotes:
        "The primary run detail is rebuilt from tracked retrieval, validator, and review artifacts. The provenance overlay remains explicit and demo-only.",
      uiVisibleReason:
        "This run is the chosen primary operator-facing anchor because it preserves the full bounded phase0 chain and keeps provenance inspectable at every stage.",
      assumptions: assumptions.slice(0, 2),
      lineageSteps: [
        lineage("bounded_input", "Bounded input manifest", refs.boundedInput, "Chosen bounded input for the demo wave.", "artifact_backed"),
        lineage("retrieval_run", "Retrieval run", refs.retrievalManifest, "Retrieval produced the persisted evidence bundle used downstream.", "artifact_backed"),
        lineage("validator_run", "Validator run", refs.validatorManifest, "Validator emitted the candidate rows that review later tightened.", "artifact_backed"),
        lineage("review_run", "Review run", refs.reviewManifest, "Review kept both candidates on hold and attached next-step guidance.", "artifact_backed"),
        lineage("projected_run_detail", "Projected run detail", refs.reviewRunDetail, "The UI reads generated review detail JSON plus the explicit provenance overlay.", "hybrid"),
        lineage("ui_route", "Run detail route", "route:/runs/phase0-review-run-001", "RunDetailPage reads both the generated run detail and the provenance overlay.", "hybrid"),
      ],
    },
    "phase0-smoke-run-001": {
      route: "/runs/phase0-smoke-run-001",
      mode: "hybrid",
      projectionNotes:
        "The smoke contour is rendered as zero_signal through explicit demo-side mapping over tracked smoke artifacts.",
      uiVisibleReason:
        "This run stays visible so zero_signal is distinguishable from blocked and populated states.",
      assumptions: [
        "zero_signal remains a demo-side classification over the tracked smoke bundle for this wave.",
      ],
      lineageSteps: [
        lineage("source_capture", "Smoke contour artifacts", refs.smokeRunDetail, "Tracked smoke artifacts are mapped into an explicit zero_signal run state.", "hybrid"),
        lineage("ui_route", "Run detail route", "route:/runs/phase0-smoke-run-001", "RunDetailPage keeps zero_signal visible instead of collapsing it into an empty list.", "hybrid"),
      ],
    },
    "a2-live-gate-002": {
      route: "/runs/a2-live-gate-002",
      mode: "hybrid",
      projectionNotes:
        "Blocked state is reconstructed from repo-resident A2 live-gate outcome capture plus cited external runtime paths.",
      uiVisibleReason:
        "This run remains visible so blocked is distinguishable from zero_signal and the absence of signal rows is not hidden.",
      assumptions: ["The raw runtime bundle for live gate 002 remains untracked in repo."],
      lineageSteps: [
        lineage("source_capture", "Tracked blocked outcome capture", blockedRunDetail.runEvidenceTraces[0]?.artifactPath ?? refs.blockedRunDetail, "A tracked draft captures the blockage and cites the external runtime locations.", "hybrid"),
        lineage("projected_run_detail", "Projected blocked run detail", refs.blockedRunDetail, "The UI reads a generated blocked run detail bundle.", "hybrid"),
        lineage("ui_route", "Run detail route", "route:/runs/a2-live-gate-002", "RunDetailPage keeps blocked visible and does not invent signal rows.", "hybrid"),
      ],
    },
    "a2-live-gate-001": {
      route: "/runs/a2-live-gate-001",
      mode: "hybrid",
      projectionNotes:
        "Inconclusive state is rendered from tracked live-gate outcome and diagnosis drafts plus a provisional signal row.",
      uiVisibleReason:
        "This run remains visible so inconclusive is distinguishable from populated and blocked states.",
      assumptions: [
        "The live-gate signal row stays provisional until the raw live bundle is tracked in repo.",
      ],
      lineageSteps: [
        lineage("source_capture", "Tracked inconclusive outcome capture", inconclusiveRunDetail.runEvidenceTraces[0]?.artifactPath ?? refs.inconclusiveRunDetail, "Tracked drafts capture the live contour result and diagnosis.", "hybrid"),
        lineage("projected_run_detail", "Projected inconclusive run detail", refs.inconclusiveRunDetail, "The UI reads a generated inconclusive run detail bundle.", "hybrid"),
        lineage("ui_route", "Run detail route", "route:/runs/a2-live-gate-001", "RunDetailPage keeps the inconclusive state explicit for the operator.", "hybrid"),
      ],
    },
  };

  const runEntries = Object.fromEntries(
    Object.entries(runDetails).map(([runId, detail]) => {
      const config = runConfigs[runId];
      return [
        runId,
        runEntry({
          runId,
          route: config.route,
          state: detail.summary.runState,
          materializationMode: config.mode,
          boundedInputSummary,
          sourceArtifactRefs: uniq([
            refs.boundedInput,
            ...detail.summary.provenance.sourceRefs,
            Object.values(refs).find((value) => value.endsWith(`${runId}.json`)),
          ]),
          projectionNotes: config.projectionNotes,
          assumptions: config.assumptions,
          uiVisibleReason: config.uiVisibleReason,
          lineageSteps: config.lineageSteps,
        }),
      ];
    }),
  );

  const signalEntries = {};
  for (const detail of [validatorRunDetail, reviewRunDetail, inconclusiveRunDetail]) {
    for (const signal of detail.signals) {
      const runId = detail.summary.runId;
      const lineageSteps = [
        lineage("bounded_input", "Bounded input manifest", refs.boundedInput, "The selected demo input anchors the visible signal.", "artifact_backed"),
        lineage("retrieval_evidence", "Retrieval evidence", refs.retrievalEvidence, `Evidence trace for ${signal.signalId} stays inspectable through the persisted retrieval bundle.`, "artifact_backed"),
      ];

      if (runId === "phase0-validator-run-005" || runId === "phase0-review-run-001") {
        lineageSteps.push(
          lineage("validator_signal", "Validator signal row", refs.validatedSignals, `candidate_id ${signal.signalId} was emitted from tracked validator output.`, "artifact_backed"),
        );
      }

      if (runId === "phase0-review-run-001") {
        lineageSteps.push(
          lineage("review_signal", "Review signal row", refs.reviewedSignals, `candidate_id ${signal.signalId} was tightened under the review gate before projection.`, "artifact_backed"),
          lineage("projected_run_detail", "Projected run detail", refs.reviewRunDetail, "The UI reads generated review detail JSON plus the explicit provenance overlay.", "hybrid"),
        );
      } else if (runId === "phase0-validator-run-005") {
        lineageSteps.push(
          lineage("projected_run_detail", "Projected validator detail", refs.validatorRunDetail, "The UI reads generated validator detail JSON plus the explicit provenance overlay.", "hybrid"),
        );
      } else {
        lineageSteps.push(
          lineage("projected_run_detail", "Projected inconclusive run detail", refs.inconclusiveRunDetail, "The UI reads a provisional signal row because the raw live bundle is not tracked in repo.", "hybrid"),
        );
      }

      lineageSteps.push(
        lineage("ui_route", "Run detail route", `route:/runs/${runId}`, `The detail route renders ${signal.signalId} with explicit state, provenance, and source_artifact_refs.`, signal.provenance.sourceMode),
      );

      signalEntries[`${runId}::${signal.signalId}`] = signalEntry({
        runId,
        signalId: signal.signalId,
        state: signal.status.statusCode,
        materializationMode: signal.provenance.sourceMode,
        boundedInputSummary,
        sourceArtifactRefs: uniq([
          refs.boundedInput,
          refs.retrievalEvidence,
          ...signal.provenance.sourceRefs,
          ...signal.evidenceTraces.flatMap((trace) => trace.provenance.sourceRefs),
          runId === "phase0-review-run-001"
            ? refs.reviewRunDetail
            : runId === "phase0-validator-run-005"
              ? refs.validatorRunDetail
              : refs.inconclusiveRunDetail,
        ]),
        projectionNotes:
          runId === "phase0-review-run-001"
            ? "Signal row is normalized from reviewed_signals.jsonl, validator output, and retrieval evidence. The provenance overlay stays explicit and demo-only."
            : runId === "phase0-validator-run-005"
              ? "Signal row is normalized from validated_signals.jsonl and linked retrieval evidence. The overview/provenance overlay remains demo-only."
              : "Signal row is provisional and derived from repo-resident live-gate outcome capture plus diagnosis drafts because the raw live bundle is not tracked here.",
        assumptions:
          runId === "a2-live-gate-001"
            ? ["The provisional signal stays demo-only until a repo-resident raw live bundle exists."]
            : [],
        uiVisibleReason:
          runId === "phase0-review-run-001"
            ? "The operator sees this signal because review kept candidate_id visible, linked it to persisted evidence, and the detail route reads the new provenance overlay."
            : runId === "phase0-validator-run-005"
              ? "The operator sees this signal directly from tracked validator output with a linked retrieval evidence trace."
              : "The operator still sees the signal so that the inconclusive state remains explicit instead of silently collapsing to an empty run.",
        lineageSteps,
      });
    }
  }

  const boundedDemoInputManifest = {
    manifestId: "bounded_demo_input_manifest_v0",
    generatedAt,
    sourceCommit,
    inputId: boundedInput.run_id,
    inputPath: refs.boundedInput,
    boundedInputSummary,
    runGoal: boundedInput.run_goal,
    currentHypothesis: boundedInput.current_hypothesis,
    modelId: boundedInput.model_id,
    searchQueries: boundedInput.search_queries,
    constraints: boundedInput.constraints,
    requestedOutputs: boundedInput.requested_outputs,
    chosenRunChain: [retrievalManifest.run_id, validatorManifest.run_id, reviewManifest.run_id],
    assumptions,
  };

  const artifactManifest = {
    manifestId: "artifact_manifest_v0",
    generatedAt,
    sourceCommit,
    anchorRunId: reviewManifest.run_id,
    artifacts: [
      { artifactId: "bounded-input", label: "Bounded input manifest", artifactPath: refs.boundedInput, artifactKind: "json", sourceLayer: "runtime_input", documentStatus: "repo_tracked_runtime_artifact", materializationMode: "artifact_backed", role: "bounded_input", notes: "Chosen explicit bounded input manifest for the primary demo path." },
      { artifactId: "retrieval-manifest", label: "Retrieval run manifest", artifactPath: refs.retrievalManifest, artifactKind: "json", sourceLayer: "runtime", documentStatus: "repo_tracked_runtime_artifact", materializationMode: "artifact_backed", role: "run_anchor", notes: "Primary retrieval anchor for the phase0 path." },
      { artifactId: "retrieval-evidence", label: "Retrieval evidence index", artifactPath: refs.retrievalEvidence, artifactKind: "jsonl", sourceLayer: "runtime", documentStatus: "repo_tracked_runtime_artifact", materializationMode: "artifact_backed", role: "evidence_trace", notes: "Evidence trace source for validator and review signals." },
      { artifactId: "validator-signals", label: "Validated signals", artifactPath: refs.validatedSignals, artifactKind: "jsonl", sourceLayer: "runtime", documentStatus: "repo_tracked_runtime_artifact", materializationMode: "artifact_backed", role: "signal_source", notes: "Exact validator signal rows used by the generated UI bundle." },
      { artifactId: "review-signals", label: "Reviewed signals", artifactPath: refs.reviewedSignals, artifactKind: "jsonl", sourceLayer: "runtime", documentStatus: "repo_tracked_runtime_artifact", materializationMode: "artifact_backed", role: "signal_source", notes: "Exact review signal rows used by the generated UI bundle." },
      { artifactId: "review-detail", label: "Generated review run detail", artifactPath: refs.reviewRunDetail, artifactKind: "json", sourceLayer: "projection", documentStatus: "generated_demo_data", materializationMode: "hybrid", role: "ui_bundle", notes: "Primary operator-visible run detail bundle." },
      { artifactId: "comparison-bundle", label: "Generated comparison bundle", artifactPath: refs.comparison, artifactKind: "json", sourceLayer: "projection", documentStatus: "generated_demo_data", materializationMode: "hybrid", role: "ui_bundle", notes: "Comparison deltas remain partly hybrid even though the source runs are tracked." },
      { artifactId: "provenance-overlay", label: "End-to-end provenance manifest", artifactPath: refs.provenanceOutput, artifactKind: "json", sourceLayer: "projection", documentStatus: "generated_demo_data", materializationMode: "hybrid", role: "demo_overlay", notes: "Demo-only provenance overlay that keeps the flow explicit without redefining the canonical contract." },
      { artifactId: "feedback-local", label: "Local feedback store", artifactPath: "browser:localStorage", artifactKind: "browser_storage", sourceLayer: "ui", documentStatus: "demo_only", materializationMode: "mock", role: "feedback", notes: "Feedback queue persistence remains local-only for this wave." },
    ],
  };

  const decisionReadBundle = {
    bundleId: "decision_read_bundle_demo_v0",
    generatedAt,
    sourceCommit,
    projectionCommand: "node scripts/build_end_to_end_demo_bundle.mjs",
    readModelBuildCommand: "node apps/operator_ui_demo/scripts/build_demo_read_model.mjs",
    uiRootRoute: "/runs",
    primaryRunRoute: "/runs/phase0-review-run-001",
    comparisonRoute: `/compare?pair=${comparison.pairId}`,
    feedbackRoute: "/feedback",
    boundedInputId: boundedInput.run_id,
    boundedInputSummary,
    chosenAnchorRunId: reviewManifest.run_id,
    chosenComparisonPairId: comparison.pairId,
    chosenArtifactAnchorRefs: [refs.boundedInput, refs.retrievalManifest, refs.validatorManifest, refs.reviewManifest, refs.reviewRunDetail],
    buildOutputs: [refs.runsIndex, refs.validatorRunDetail, refs.reviewRunDetail, refs.comparison, refs.boundedOutput, refs.artifactOutput, refs.bundleOutput, refs.provenanceOutput],
    flowSteps: [
      { stepId: "bounded_input", label: "Bounded input manifest", objectType: "bounded_input", objectId: boundedInput.run_id, state: "selected", materializationMode: "artifact_backed", summary: boundedInputSummary, note: "No fresh live retrieval is required for this wave; the bounded input is replayed locally against persisted artifacts.", sourceArtifactRefs: [refs.boundedInput], uiRoute: "/runs" },
      { stepId: "retrieval_run", label: "Retrieval contour anchor", objectType: "run", objectId: retrievalManifest.run_id, state: retrievalManifest.run_status, materializationMode: "artifact_backed", summary: `${retrievalManifest.evidence_count} persisted evidence items survived retrieval filtering.`, note: "This is the runtime source for the phase0 evidence bundle.", sourceArtifactRefs: [refs.retrievalManifest, refs.retrievalEvidence] },
      { stepId: "validator_run", label: "Validator contour anchor", objectType: "run", objectId: validatorManifest.run_id, state: validatorRunDetail.summary.runState, materializationMode: "artifact_backed", summary: `${validatorManifest.validated_signal_count} validator-visible signals were emitted from the persisted evidence bundle.`, note: "Validator output remains directly inspectable before the review gate tightens posture.", sourceArtifactRefs: [refs.validatorManifest, refs.validatedSignals] },
      { stepId: "review_run", label: "Review contour anchor", objectType: "run", objectId: reviewManifest.run_id, state: reviewRunDetail.summary.runState, materializationMode: "artifact_backed", summary: `${reviewManifest.output_item_count} reviewed signals remain operator-visible with conservative hold decisions.`, note: "This is the chosen primary operator-facing run for the demo wave.", sourceArtifactRefs: [refs.reviewManifest, refs.reviewedSignals, refs.decisionSummary], uiRoute: "/runs/phase0-review-run-001" },
      { stepId: "projection_bundle", label: "Read-side projection bundle", objectType: "projection", objectId: "decision_read_bundle_demo_v0", state: "materialized", materializationMode: "hybrid", summary: "Generated read-side JSON plus explicit demo-only lineage/provenance overlays feed the UI without mutating runtime or governance.", note: "The generator rebuilds the UI-readable bundle from tracked artifacts, but the overview/provenance layer is still a demo-side stitch.", sourceArtifactRefs: [refs.runsIndex, refs.reviewRunDetail, refs.comparison, refs.boundedOutput, refs.artifactOutput, refs.bundleOutput, refs.provenanceOutput] },
      { stepId: "operator_ui", label: "Operator UI surface", objectType: "ui_surface", objectId: "apps/operator_ui_demo", state: "operator_visible", materializationMode: "hybrid", summary: "Inbox, detail, comparison, and feedback routes all read the generated bundle and keep provenance/state semantics explicit.", note: "The UI is intentionally demo-scoped and does not open a production contour.", sourceArtifactRefs: ["apps/operator_ui_demo/src/pages/RunInboxPage.tsx", "apps/operator_ui_demo/src/pages/RunDetailPage.tsx", "apps/operator_ui_demo/src/pages/ComparisonPage.tsx", "apps/operator_ui_demo/src/pages/FeedbackQueuePage.tsx"], uiRoute: "/runs" },
      { stepId: "feedback_mock", label: "Feedback mock boundary", objectType: "feedback", objectId: "feedback-local", state: "local_demo_localStorage", materializationMode: "mock", summary: "Feedback stays explicitly local and demo-only, so the operator surface never mutates runtime or governance automatically.", note: "Mock is a deliberate visible boundary, not a hidden implementation gap.", sourceArtifactRefs: ["browser:localStorage"], uiRoute: "/feedback" },
    ],
    materializationLegend: [
      { key: "artifact_backed", label: "artifact_backed", meaning: "The visible object is anchored in repo-tracked runtime artifacts and can be traced back to specific manifests, signal rows, or evidence records." },
      { key: "hybrid", label: "hybrid", meaning: "The visible object is rebuilt from tracked artifacts plus demo-side stitching or draft-derived mapping that remains intentionally explicit." },
      { key: "mock", label: "mock", meaning: "The visible object is demo-only and stays outside runtime and governance mutation paths." },
    ],
    runStateLegend: [
      { key: "populated", label: "populated", meaning: "The run has surfaced operator-visible signal rows with inspectable evidence traces." },
      { key: "blocked", label: "blocked", meaning: "The contour stopped before a fair signal-emitting stage completed and the UI keeps that blockage explicit." },
      { key: "zero_signal", label: "zero_signal", meaning: "The contour completed far enough to produce a run object, but it emitted zero operator-visible signals." },
      { key: "inconclusive", label: "inconclusive", meaning: "The contour surfaced a partial signal view, but the evidence remained too thin for a stronger conclusion." },
    ],
    primarySurfaceRefs: [refs.runsIndex, refs.reviewRunDetail, refs.comparison, refs.boundedOutput, refs.artifactOutput, refs.bundleOutput, refs.provenanceOutput],
    assumptions,
    completionCriteria: [
      "The projection/build command regenerates both the base demo read model and the explicit end_to_end_demo bundle.",
      "The Run Inbox shows bounded input summary, chosen run/artifact anchor, materialization legend, and state legend.",
      "The chosen run detail shows visible run lineage plus signal lineage with state, materialization_mode, source_artifact_refs, and projection_notes.",
      "The comparison route shows explicit hybrid projection context instead of implying a fully canonical comparator.",
      "The feedback route keeps mock persistence explicit and does not hide the write-side boundary.",
    ],
  };

  const provenanceManifest = {
    manifestId: "provenance_manifest_v0",
    generatedAt,
    sourceCommit,
    anchorRunId: "phase0-review-run-001",
    entries: {
      runs: runEntries,
      signals: signalEntries,
      comparisons: {
        [comparison.pairId]: {
          objectId: comparison.pairId,
          objectType: "comparison",
          route: `/compare?pair=${comparison.pairId}`,
          state: comparison.partialDueToHybridData ? "partial" : "complete",
          materializationMode: "hybrid",
          boundedInputSummary,
          sourceArtifactRefs: [refs.boundedInput, refs.validatorManifest, refs.validatedSignals, refs.reviewManifest, refs.reviewedSignals, refs.decisionSummary, refs.comparison],
          projectionNotes: "The comparison bundle is generated from tracked validator/review artifacts, but contradiction and next-step deltas remain intentionally labeled hybrid.",
          assumptions: ["Cross-run contradiction and next-step delta mapping stays hybrid for this wave."],
          uiVisibleReason: "The comparison view stays explicit about which sections are precomputed from tracked artifacts and which still rely on hybrid delta mapping.",
          lineage: [
            lineage("validator_run", "Validator source run", refs.validatorManifest, "The left side of the comparison comes from the tracked validator run.", "artifact_backed"),
            lineage("review_run", "Review source run", refs.reviewManifest, "The right side of the comparison comes from the tracked review run.", "artifact_backed"),
            lineage("comparison_bundle", "Generated comparison bundle", refs.comparison, "The comparator precomputes deltas into a UI-readable JSON file.", "hybrid"),
            lineage("ui_route", "Comparison route", `route:/compare?pair=${comparison.pairId}`, "ComparisonPage reads the comparison JSON plus the explicit provenance overlay.", "hybrid"),
          ],
        },
      },
      feedback: {
        "feedback-local": {
          objectId: "feedback-local",
          objectType: "feedback",
          route: "/feedback",
          state: "local_demo_localStorage",
          materializationMode: "mock",
          boundedInputSummary,
          sourceArtifactRefs: ["browser:localStorage"],
          projectionNotes: "Feedback events stay inside browser localStorage and never mutate runtime or governance automatically.",
          assumptions: [],
          uiVisibleReason: "The operator can test feedback affordances locally while the UI keeps the write-side boundary explicit.",
          lineage: [
            lineage("signal_or_run_action", "Feedback action button", "apps/operator_ui_demo/src/components/FeedbackActions.tsx", "Operator clicks stay inside the demo shell and do not write back into runtime.", "mock"),
            lineage("local_storage", "Browser localStorage", "browser:localStorage", "Feedback events persist only in the browser for this wave.", "mock"),
            lineage("feedback_queue", "Feedback Queue route", "route:/feedback", "The queue visualizes demo-only local events with explicit mock provenance.", "mock"),
          ],
        },
      },
    },
  };

  await Promise.all([
    writeJson("bounded_demo_input_manifest_v0.json", boundedDemoInputManifest),
    writeJson("artifact_manifest_v0.json", artifactManifest),
    writeJson("decision_read_bundle_demo_v0.json", decisionReadBundle),
    writeJson("provenance_manifest_v0.json", provenanceManifest),
  ]);

  process.stdout.write(`End-to-end demo bundle emitted to ${refs.bundleOutput}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack ?? error}\n`);
  process.exitCode = 1;
});
