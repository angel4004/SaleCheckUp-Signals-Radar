import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "..", "..");
const outputRoot = path.join(appRoot, "public", "demo-data");
const generatedAt = new Date().toISOString();
const sourceCommit = execSync("git rev-parse HEAD", {
  cwd: repoRoot,
  encoding: "utf8",
}).trim();

const groundingRefs = [
  "docs/drafts/decision_consumption_layer/decision_consumption_layer_spec_vA.md",
  "docs/drafts/decision_consumption_layer/decision_read_model_contract_v1.md",
  "docs/drafts/quality_change_package_A2/quality_change_package_A2_live_gate_run_001.md",
  "docs/drafts/quality_change_package_A2/quality_change_package_A2_live_gate_run_001_diagnosis.md",
  "docs/drafts/quality_change_package_A2/quality_change_package_A2_live_gate_run_002.md",
  "docs/drafts/quality_change_package_A2/quality_change_package_A2_switch_to_lane_2_live_gate_execution_package.md",
  "docs/drafts/quality_change_package_A2/next_A2_live_gate_run_on_reservation_call_center_scaling_execution_package.md",
  "runtime/runs/phase0-retrieval-run-003/run_manifest.json",
  "runtime/runs/phase0-retrieval-run-003/evidence_index.jsonl",
  "runtime/runs/phase0-validator-run-005/validation_manifest.json",
  "runtime/runs/phase0-validator-run-005/validated_signals.jsonl",
  "runtime/runs/phase0-review-run-001/review_manifest.json",
  "runtime/runs/phase0-review-run-001/reviewed_signals.jsonl",
  "runtime/runs/phase0-review-run-001/decision_summary_ru.md",
  "runtime/runs/phase0-smoke-run-001/run_manifest.json",
  "runtime/runs/phase0-smoke-run-001/run_synthesis_ru.md",
];

const refs = {
  validatorManifest: "runtime/runs/phase0-validator-run-005/validation_manifest.json",
  validatedSignals: "runtime/runs/phase0-validator-run-005/validated_signals.jsonl",
  reviewManifest: "runtime/runs/phase0-review-run-001/review_manifest.json",
  reviewedSignals: "runtime/runs/phase0-review-run-001/reviewed_signals.jsonl",
  decisionSummary: "runtime/runs/phase0-review-run-001/decision_summary_ru.md",
  retrievalManifest: "runtime/runs/phase0-retrieval-run-003/run_manifest.json",
  evidenceIndex: "runtime/runs/phase0-retrieval-run-003/evidence_index.jsonl",
  smokeManifest: "runtime/runs/phase0-smoke-run-001/run_manifest.json",
  smokeSynthesis: "runtime/runs/phase0-smoke-run-001/run_synthesis_ru.md",
  smokeUpdate: "runtime/runs/phase0-smoke-run-001/project_update_block_ru.md",
  a2Run001: "docs/drafts/quality_change_package_A2/quality_change_package_A2_live_gate_run_001.md",
  a2Run001Diagnosis:
    "docs/drafts/quality_change_package_A2/quality_change_package_A2_live_gate_run_001_diagnosis.md",
  a2Run002: "docs/drafts/quality_change_package_A2/quality_change_package_A2_live_gate_run_002.md",
  a2Lane2Switch:
    "docs/drafts/quality_change_package_A2/quality_change_package_A2_switch_to_lane_2_live_gate_execution_package.md",
  a2Run003Preparation:
    "docs/drafts/quality_change_package_A2/next_A2_live_gate_run_on_reservation_call_center_scaling_execution_package.md",
};

function repoPath(...segments) {
  return segments.join("/").replaceAll("\\", "/");
}

async function readJson(relativePath) {
  const raw = await fs.readFile(path.join(repoRoot, relativePath), "utf8");
  return JSON.parse(raw);
}

async function readText(relativePath) {
  return fs.readFile(path.join(repoRoot, relativePath), "utf8");
}

async function readJsonl(relativePath) {
  const raw = await fs.readFile(path.join(repoRoot, relativePath), "utf8");
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

async function writeJson(relativePath, value) {
  const outputPath = path.join(outputRoot, relativePath);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function shorten(text, maxLength = 240) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1)}…`;
}

function ensureMatch(text, regex, fallback) {
  const match = text.match(regex);
  return match?.[1]?.trim() ?? fallback;
}

function extractSection(text, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(
    new RegExp(`${escaped}\\r?\\n([\\s\\S]*?)(?=\\r?\\n##+\\s|$)`),
  );
  return match?.[1]?.trim() ?? "";
}

function extractBacktickedItems(text) {
  return [...text.matchAll(/`([^`]+)`/g)].map((match) => match[1].trim());
}

function extractNestedCodeList(text, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(
    new RegExp(`- ${escaped}:\\s*\\r?\\n((?:\\s+- \`[^\`]+\`[^\\n]*\\r?\\n?)+)`, "i"),
  );
  return extractBacktickedItems(match?.[1] ?? "");
}

function provenance(sourceMode, sourceRefs, notes, options = {}) {
  return {
    sourceMode,
    sourceRefs,
    sourceCommit: options.sourceCommit ?? sourceCommit,
    generatedAt,
    ...(notes ? { notes } : {}),
  };
}

function mapSignalType(rawSignalType) {
  return rawSignalType === "hold" ? "hold_item" : rawSignalType;
}

function mapStatusCode(rawSignalType, reviewDecision) {
  if (reviewDecision) {
    if (reviewDecision === "hold") {
      return "hold";
    }

    if (reviewDecision === "accept") {
      return "promising";
    }

    return "discard_candidate";
  }

  switch (rawSignalType) {
    case "confirmed_case":
      return "promising";
    case "monetizable_pain_signal":
      return "needs_validation";
    case "technology_shift_signal":
      return "promising";
    case "hold":
    case "hold_item":
      return "hold";
    case "noise":
      return "discard_candidate";
    default:
      return "weak";
  }
}

function mapUncertaintyLevel(confidence) {
  switch (confidence) {
    case "high":
      return "low";
    case "medium":
      return "medium";
    case "low":
      return "high";
    default:
      return "medium";
  }
}

function inferDecisionRelevance(signalType) {
  switch (signalType) {
    case "confirmed_case":
    case "monetizable_pain_signal":
      return "high";
    case "technology_shift_signal":
      return "medium";
    case "hold_item":
      return "medium";
    default:
      return "low";
  }
}

function signalLabelFromEvidence(evidenceRecord) {
  if (!evidenceRecord) {
    return "Provisional signal";
  }

  if (evidenceRecord.source_title.includes("Evermore")) {
    return "Evermore reservation call-center scaling";
  }

  if (evidenceRecord.source_title.includes("15,910 Real Guest Calls")) {
    return "Hidden phone-loss after IVR removal";
  }

  return shorten(evidenceRecord.source_title, 72);
}

function buildEvidenceTraceEntry(runId, evidenceRecord) {
  const traceId = `trace-${runId}-${evidenceRecord.evidence_id}`;

  return {
    traceId,
    traceRole: "support",
    artifactPath: refs.evidenceIndex,
    artifactKind: "jsonl_record",
    documentStatus: "repo_tracked_runtime_artifact",
    sourceRecordId: evidenceRecord.evidence_id,
    locatorHint: `evidence_id=${evidenceRecord.evidence_id}`,
    excerptText: shorten(evidenceRecord.source_content_excerpt, 260),
    sourceStageOrigin: "retrieval",
    provenance: provenance(
      "artifact_backed",
      [refs.evidenceIndex],
      "Exact evidence trace entry from tracked retrieval output.",
    ),
  };
}

function buildManifestTraceEntry(runId, artifactPath, sourceRecordId, excerptText, locatorHint) {
  return {
    traceId: `trace-${runId}-${sourceRecordId}`,
    traceRole: "context",
    artifactPath,
    artifactKind: artifactPath.endsWith(".md") ? "markdown" : "json",
    documentStatus: artifactPath.startsWith("docs/")
      ? "draft"
      : "repo_tracked_runtime_artifact",
    sourceRecordId,
    locatorHint,
    excerptText,
    sourceStageOrigin: "projection_fallback",
    provenance: provenance(
      artifactPath.startsWith("docs/") ? "hybrid" : "artifact_backed",
      [artifactPath],
      artifactPath.startsWith("docs/")
        ? "Trace reconstructed from repo-resident draft outcome capture."
        : "Trace anchored to tracked runtime artifact.",
    ),
  };
}

function buildExternalTraceEntry(runId, artifactPath, sourceRecordId, excerptText) {
  return {
    traceId: `trace-${runId}-${sourceRecordId}`,
    traceRole: "context",
    artifactPath,
    artifactKind: "external_runtime_path",
    documentStatus: "external_untracked_runtime_output",
    sourceRecordId,
    locatorHint: artifactPath,
    excerptText,
    sourceStageOrigin: "projection_fallback",
    provenance: provenance(
      "hybrid",
      [artifactPath],
      "Path cited by a tracked draft, but raw output bundle is not tracked in this repo.",
    ),
  };
}

function buildContradiction({
  contradictionId,
  severityLevel,
  contradictionKind,
  contradictionText,
  sourceStageOrigin,
  traceRefIds,
  sourceRefs,
  notes,
  sourceMode = "hybrid",
}) {
  return {
    contradictionId,
    severityLevel,
    contradictionKind,
    contradictionText,
    sourceStageOrigin,
    traceRefIds,
    isResolved: false,
    provenance: provenance(sourceMode, sourceRefs, notes),
  };
}

function buildNextStep({
  nextStepId,
  nextStepType,
  targetLayer,
  priorityLevel,
  provenanceType,
  actionText,
  traceRefIds,
  isBlocking,
  sourceRefs,
  notes,
  sourceMode = "hybrid",
}) {
  return {
    nextStepId,
    nextStepType,
    targetLayer,
    priorityLevel,
    provenanceType,
    actionText,
    traceRefIds,
    isBlocking,
    provenance: provenance(sourceMode, sourceRefs, notes),
  };
}

function uniqueBy(items, keySelector) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keySelector(item);
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function buildStageStatus(stageKey, stageLabel, status, detail, sourceRefs, notes) {
  return {
    stageKey,
    stageLabel,
    status,
    detail,
    provenance: provenance(
      sourceRefs.some((item) => item.startsWith("docs/")) ? "hybrid" : "artifact_backed",
      sourceRefs,
      notes,
    ),
  };
}

async function buildData() {
  const retrievalManifest003 = await readJson(refs.retrievalManifest);
  const evidence003 = await readJsonl(refs.evidenceIndex);
  const validatorManifest005 = await readJson(refs.validatorManifest);
  const validatedSignals005 = await readJsonl(refs.validatedSignals);
  const reviewManifest001 = await readJson(refs.reviewManifest);
  const reviewedSignals001 = await readJsonl(refs.reviewedSignals);
  const decisionSummary001 = await readText(refs.decisionSummary);
  const smokeManifest001 = await readJson(refs.smokeManifest);
  const smokeSynthesis001 = await readText(refs.smokeSynthesis);
  const smokeUpdate001 = await readText(refs.smokeUpdate);
  const a2Run001 = await readText(refs.a2Run001);
  const a2Run001Diagnosis = await readText(refs.a2Run001Diagnosis);
  const a2Run002 = await readText(refs.a2Run002);

  const evidenceById = new Map(evidence003.map((item) => [item.evidence_id, item]));
  const validatedByCandidateId = new Map(
    validatedSignals005.map((item) => [item.candidate_id, item]),
  );

  const validatorSignals = validatedSignals005.map((signal) => {
    const evidence = evidenceById.get(signal.evidence_id);
    const evidenceTrace = evidence
      ? buildEvidenceTraceEntry("phase0-validator-run-005", evidence)
      : null;
    const contradiction = buildContradiction({
      contradictionId: `contradiction-${signal.candidate_id}-verification-gap`,
      severityLevel: signal.signal_type === "hold" ? "major" : "moderate",
      contradictionKind:
        signal.signal_type === "hold"
          ? "vendor_metric_verification_gap"
          : "independent_verification_gap",
      contradictionText: signal.weaknesses_ru,
      sourceStageOrigin: "validator",
      traceRefIds: evidenceTrace ? [evidenceTrace.traceId] : [],
      sourceRefs: [refs.validatedSignals, refs.evidenceIndex],
      notes: "Derived from tracked validator weaknesses against exact evidence trace.",
    });

    return {
      signalId: signal.candidate_id,
      runId: "phase0-validator-run-005",
      signalType: mapSignalType(signal.signal_type),
      sourceSignalTypeRaw: signal.signal_type,
      label: signalLabelFromEvidence(evidence),
      summary: signal.outcome_ru,
      status: {
        statusCode: mapStatusCode(signal.signal_type),
        uncertaintyLevel: mapUncertaintyLevel(signal.confidence),
        decisionRelevanceLevel: inferDecisionRelevance(mapSignalType(signal.signal_type)),
        assessmentOrigin: "validator",
        sourceStatusCodeRaw: signal.signal_type,
        sourceEvidenceStrengthRaw: signal.confidence,
        rationale: signal.rationale_ru,
        traceRefIds: evidenceTrace ? [evidenceTrace.traceId] : [],
        provenance: provenance(
          "artifact_backed",
          [refs.validatedSignals, refs.evidenceIndex],
          "Normalized from tracked validator output and retrieval evidence.",
        ),
      },
      contradictions: [contradiction],
      nextSteps: [],
      evidenceTraces: evidenceTrace ? [evidenceTrace] : [],
      changedVsPreviousComparable: null,
      feedbackTarget: {
        runId: "phase0-validator-run-005",
        signalId: signal.candidate_id,
      },
      provenance: provenance(
        "artifact_backed",
        [refs.validatedSignals, refs.evidenceIndex],
        "Signal row comes directly from tracked validator output with normalized status fields.",
      ),
    };
  });

  const validatorRunTraces = uniqueBy(
    [
      buildManifestTraceEntry(
        "phase0-validator-run-005",
        refs.validatorManifest,
        "validation_manifest",
        `Validated signal count: ${validatorManifest005.validated_signal_count}.`,
        "validated_signal_count",
      ),
      ...validatorSignals.flatMap((signal) => signal.evidenceTraces),
    ],
    (item) => item.traceId,
  );
  const validatorRunContradictions = uniqueBy(
    validatorSignals.flatMap((signal) => signal.contradictions),
    (item) => item.contradictionId,
  );
  const validatorRunNextSteps = [
    buildNextStep({
      nextStepId: "next-phase0-validator-run-005-review-pass",
      nextStepType: "escalate_for_review",
      targetLayer: "operator_review",
      priorityLevel: "medium",
      provenanceType: "machine",
      actionText:
        "Pass the surfaced validator items through review to obtain operator-safe hold/accept posture and concrete next steps.",
      traceRefIds: ["trace-phase0-validator-run-005-validation_manifest"],
      isBlocking: false,
      sourceRefs: [refs.validatorManifest, refs.reviewManifest],
      notes: "Hybrid projection step to keep next-step panel visible before review output exists.",
    }),
  ];

  const validatorRunSummary = {
    runId: "phase0-validator-run-005",
    runLabel: "Validator verdict surface",
    runState: "populated",
    runOutcomeStatus: "completed",
    sourceRunOutcomeRaw: validatorManifest005.run_status,
    signalCount: validatorSignals.length,
    contradictionCount: validatorRunContradictions.length,
    nextStepCount: validatorRunNextSteps.length,
    evidenceTracePresence: "present",
    comparisonFamilyKey: "hotel_phone_abandonment::phase0-retrieval-run-003",
    previousComparableRunId: null,
    projectionGeneratedAt: generatedAt,
    humanSummary:
      "Two validator-surfaced signals are available with direct evidence traces and conservative contradiction visibility.",
    provenance: provenance(
      "artifact_backed",
      [refs.validatorManifest, refs.validatedSignals, refs.retrievalManifest, refs.evidenceIndex],
      "Summary assembled from tracked validator and retrieval artifacts.",
    ),
  };

  const validatorRunDetail = {
    summary: validatorRunSummary,
    stageStatuses: [
      buildStageStatus(
        "retrieval",
        "Retrieval",
        "completed",
        `${retrievalManifest003.evidence_count} persisted evidence items in tracked retrieval bundle.`,
        [refs.retrievalManifest, refs.evidenceIndex],
        "Exact retrieval status from tracked runtime output.",
      ),
      buildStageStatus(
        "validator",
        "Validator",
        "completed",
        `${validatorManifest005.validated_signal_count} signals emitted by validator.`,
        [refs.validatorManifest, refs.validatedSignals],
        "Exact validator status from tracked runtime output.",
      ),
      buildStageStatus(
        "review",
        "Review",
        "not_started",
        "Review decisions are not part of this run object.",
        [refs.validatorManifest],
        "Explicit demo-side stage exposure; no review mutation or hidden inference.",
      ),
    ],
    signals: validatorSignals,
    runContradictions: validatorRunContradictions,
    runNextSteps: validatorRunNextSteps,
    runEvidenceTraces: validatorRunTraces,
    stateBanner: {
      title: "Populated validator surface",
      tone: "success",
      text:
        "Signals are surfaced directly from tracked validator output with explicit evidence traces and unresolved verification gaps.",
      provenance: provenance(
        "artifact_backed",
        [refs.validatorManifest, refs.validatedSignals],
        "Banner wording derived from tracked validator bundle counts and signal posture.",
      ),
    },
    provenance: provenance(
      "artifact_backed",
      [refs.validatorManifest, refs.validatedSignals, refs.evidenceIndex],
      "Run detail rooted in tracked validator and retrieval artifacts.",
    ),
  };

  const reviewSignals = reviewedSignals001.map((signal) => {
    const validatedSource = validatedByCandidateId.get(signal.candidate_id);
    const evidence = validatedSource ? evidenceById.get(validatedSource.evidence_id) : null;
    const evidenceTrace = evidence
      ? buildEvidenceTraceEntry("phase0-review-run-001", evidence)
      : null;
    const rawSignalType = validatedSource?.signal_type ?? null;
    const statusChange =
      mapStatusCode(rawSignalType ?? "hold") !==
      mapStatusCode(rawSignalType ?? "hold", signal.review_decision);
    const baseContradiction = buildContradiction({
      contradictionId: `contradiction-${signal.candidate_id}-review-gap`,
      severityLevel: signal.review_decision === "hold" ? "major" : "moderate",
      contradictionKind: "review_hold_preserves_uncertainty",
      contradictionText: signal.decision_rationale_ru,
      sourceStageOrigin: "review",
      traceRefIds: evidenceTrace ? [evidenceTrace.traceId] : [],
      sourceRefs: [refs.reviewedSignals, refs.decisionSummary, refs.evidenceIndex],
      notes: "Derived from tracked review decision rationale against exact evidence trace.",
    });
    const divergenceContradiction = statusChange
      ? buildContradiction({
          contradictionId: `contradiction-${signal.candidate_id}-validator-review-divergence`,
          severityLevel: "moderate",
          contradictionKind: "validator_review_divergence",
          contradictionText:
            "Review downgraded the validator posture and kept the item on hold instead of leaving it at the validator-facing signal class.",
          sourceStageOrigin: "projection_comparator",
          traceRefIds: evidenceTrace ? [evidenceTrace.traceId] : [],
          sourceRefs: [refs.validatedSignals, refs.reviewedSignals, refs.decisionSummary],
          notes: "Hybrid contradiction derived from comparing tracked validator and review outputs.",
        })
      : null;
    const nextStep = buildNextStep({
      nextStepId: `next-${signal.candidate_id}-review-follow-up`,
      nextStepType: "validate_with_more_evidence",
      targetLayer: "operator_review",
      priorityLevel:
        signal.priority_hint === "high"
          ? "high"
          : signal.priority_hint === "low"
            ? "low"
            : "medium",
      provenanceType: "machine",
      actionText: signal.required_next_step,
      traceRefIds: evidenceTrace ? [evidenceTrace.traceId] : [],
      isBlocking: true,
      sourceRefs: [refs.reviewedSignals, refs.decisionSummary],
      notes: "Exact next step text preserved from tracked review output.",
      sourceMode: "artifact_backed",
    });

    return {
      signalId: signal.candidate_id,
      runId: "phase0-review-run-001",
      signalType: mapSignalType(signal.review_decision),
      sourceSignalTypeRaw: rawSignalType,
      label: signalLabelFromEvidence(evidence),
      summary: signal.outcome_ru,
      status: {
        statusCode: mapStatusCode(rawSignalType ?? "hold", signal.review_decision),
        uncertaintyLevel: mapUncertaintyLevel(signal.review_confidence),
        decisionRelevanceLevel: inferDecisionRelevance(mapSignalType(rawSignalType ?? "hold")),
        assessmentOrigin: "review",
        sourceStatusCodeRaw: signal.review_decision,
        sourceEvidenceStrengthRaw: validatedSource?.confidence ?? null,
        rationale: signal.decision_rationale_ru,
        traceRefIds: evidenceTrace ? [evidenceTrace.traceId] : [],
        provenance: provenance(
          "artifact_backed",
          [refs.reviewedSignals, refs.decisionSummary, refs.evidenceIndex],
          "Normalized from tracked review output with raw validator signal type preserved.",
        ),
      },
      contradictions: divergenceContradiction
        ? [baseContradiction, divergenceContradiction]
        : [baseContradiction],
      nextSteps: [nextStep],
      evidenceTraces: evidenceTrace ? [evidenceTrace] : [],
      changedVsPreviousComparable: statusChange ? "status_changed_to_hold" : "status_stable",
      feedbackTarget: {
        runId: "phase0-review-run-001",
        signalId: signal.candidate_id,
      },
      provenance: provenance(
        "artifact_backed",
        [refs.reviewedSignals, refs.decisionSummary, refs.evidenceIndex],
        "Signal row comes from tracked review output with exact next-step text preserved.",
      ),
    };
  });

  const reviewRunContradictions = uniqueBy(
    reviewSignals.flatMap((signal) => signal.contradictions),
    (item) => item.contradictionId,
  );
  const reviewRunNextSteps = uniqueBy(
    reviewSignals.flatMap((signal) => signal.nextSteps),
    (item) => item.nextStepId,
  );
  const reviewRunTraces = uniqueBy(
    [
      buildManifestTraceEntry(
        "phase0-review-run-001",
        refs.reviewManifest,
        "review_manifest",
        `Review output count: ${reviewManifest001.output_item_count}; decision_counts.hold = ${reviewManifest001.decision_counts.hold}.`,
        "output_item_count",
      ),
      buildManifestTraceEntry(
        "phase0-review-run-001",
        refs.decisionSummary,
        "decision_summary",
        shorten(decisionSummary001, 260),
        "review decision summary",
      ),
      ...reviewSignals.flatMap((signal) => signal.evidenceTraces),
    ],
    (item) => item.traceId,
  );

  const reviewRunSummary = {
    runId: "phase0-review-run-001",
    runLabel: "Review decision surface",
    runState: "populated",
    runOutcomeStatus: "completed",
    sourceRunOutcomeRaw: reviewManifest001.status,
    signalCount: reviewSignals.length,
    contradictionCount: reviewRunContradictions.length,
    nextStepCount: reviewRunNextSteps.length,
    evidenceTracePresence: "present",
    comparisonFamilyKey: "hotel_phone_abandonment::phase0-retrieval-run-003",
    previousComparableRunId: "phase0-validator-run-005",
    projectionGeneratedAt: generatedAt,
    humanSummary:
      "Review preserves two hold decisions, makes uncertainty explicit, and adds concrete signal-level follow-up steps.",
    provenance: provenance(
      "artifact_backed",
      [refs.reviewManifest, refs.reviewedSignals, refs.decisionSummary, refs.evidenceIndex],
      "Summary assembled from tracked review, validator, and retrieval artifacts.",
    ),
  };

  const reviewRunDetail = {
    summary: reviewRunSummary,
    stageStatuses: [
      buildStageStatus(
        "retrieval",
        "Retrieval",
        "completed",
        `${retrievalManifest003.evidence_count} persisted evidence items remained available to the chain.`,
        [refs.retrievalManifest, refs.evidenceIndex],
        "Exact retrieval status from tracked runtime output.",
      ),
      buildStageStatus(
        "validator",
        "Validator",
        "completed",
        `${validatorManifest005.validated_signal_count} validator items were passed into review.`,
        [refs.validatorManifest, refs.validatedSignals],
        "Exact validator count from tracked runtime output.",
      ),
      buildStageStatus(
        "review",
        "Review",
        "completed",
        `${reviewManifest001.decision_counts.hold} hold decisions emitted by review.`,
        [refs.reviewManifest, refs.reviewedSignals, refs.decisionSummary],
        "Exact review status from tracked runtime output.",
      ),
    ],
    signals: reviewSignals,
    runContradictions: reviewRunContradictions,
    runNextSteps: reviewRunNextSteps,
    runEvidenceTraces: reviewRunTraces,
    stateBanner: {
      title: "Populated review surface",
      tone: "success",
      text:
        "Operator-facing hold posture is explicit, contradictions stay visible, and next steps are concrete rather than implicit.",
      provenance: provenance(
        "artifact_backed",
        [refs.reviewManifest, refs.reviewedSignals, refs.decisionSummary],
        "Banner derived from tracked review decision distribution and signal-level next steps.",
      ),
    },
    provenance: provenance(
      "artifact_backed",
      [refs.reviewManifest, refs.reviewedSignals, refs.decisionSummary, refs.evidenceIndex],
      "Run detail rooted in tracked review and retrieval artifacts.",
    ),
  };

  const smokeTraceManifest = buildManifestTraceEntry(
    "phase0-smoke-run-001",
    refs.smokeManifest,
    "smoke_manifest",
    "Smoke run completed successfully under the minimal baseline contour.",
    "summary",
  );
  const smokeTraceSynthesis = buildManifestTraceEntry(
    "phase0-smoke-run-001",
    refs.smokeSynthesis,
    "smoke_synthesis",
    shorten(smokeSynthesis001, 260),
    "known gaps and recommended next step",
  );
  const smokeTraceUpdate = buildManifestTraceEntry(
    "phase0-smoke-run-001",
    refs.smokeUpdate,
    "smoke_project_update",
    shorten(smokeUpdate001, 200),
    "project update block",
  );
  const smokeRunContradiction = buildContradiction({
    contradictionId: "contradiction-phase0-smoke-run-001-no-operator-surface",
    severityLevel: "moderate",
    contradictionKind: "completed_contour_without_operator_surface",
    contradictionText:
      "The smoke contour completed mechanically, but evidence indexing and candidate extraction were not implemented in this pass, so no operator-facing signal rows surfaced.",
    sourceStageOrigin: "projection_fallback",
    traceRefIds: [smokeTraceSynthesis.traceId, smokeTraceUpdate.traceId],
    sourceRefs: [refs.smokeManifest, refs.smokeSynthesis, refs.smokeUpdate],
    notes: "Hybrid contradiction derived from tracked smoke synthesis and update notes.",
  });
  const smokeRunNextStep = buildNextStep({
    nextStepId: "next-phase0-smoke-run-001-inspect-zero-signal",
    nextStepType: "hold_for_future_run",
    targetLayer: "ui",
    priorityLevel: "medium",
    provenanceType: "operator",
    actionText:
      "Inspect why no operator-facing signals surfaced before treating this contour as decision-ready.",
    traceRefIds: [smokeTraceSynthesis.traceId],
    isBlocking: false,
    sourceRefs: [refs.smokeSynthesis, refs.smokeUpdate],
    notes: "Demo-side next step attached to a completed smoke contour with zero surfaced signals.",
  });

  const smokeRunSummary = {
    runId: "phase0-smoke-run-001",
    runLabel: "Smoke contour zero-signal demo",
    runState: "zero_signal",
    runOutcomeStatus: "completed",
    sourceRunOutcomeRaw: smokeManifest001.run_status,
    signalCount: 0,
    contradictionCount: 1,
    nextStepCount: 1,
    evidenceTracePresence: "limited",
    comparisonFamilyKey: "phase0-smoke",
    previousComparableRunId: null,
    projectionGeneratedAt: generatedAt,
    humanSummary:
      "The smoke contour completed, but this demo explicitly classifies it as zero_signal because no operator-facing signal rows were available.",
    provenance: provenance(
      "hybrid",
      [refs.smokeManifest, refs.smokeSynthesis, refs.smokeUpdate],
      "Explicit zero_signal classification is a demo-side mapping over a completed smoke bundle.",
    ),
  };

  const smokeRunDetail = {
    summary: smokeRunSummary,
    stageStatuses: [
      buildStageStatus(
        "retrieval",
        "Baseline run",
        "completed",
        smokeManifest001.summary,
        [refs.smokeManifest],
        "Exact smoke run completion from tracked runtime artifact.",
      ),
      buildStageStatus(
        "validator",
        "Validator",
        "not_started",
        "Validator layer was not part of this smoke contour.",
        [refs.smokeSynthesis],
        "Explicit stage exposure from tracked smoke synthesis.",
      ),
      buildStageStatus(
        "review",
        "Review",
        "not_started",
        "Review layer was not part of this smoke contour.",
        [refs.smokeSynthesis],
        "Explicit stage exposure from tracked smoke synthesis.",
      ),
    ],
    signals: [],
    runContradictions: [smokeRunContradiction],
    runNextSteps: [smokeRunNextStep],
    runEvidenceTraces: [smokeTraceManifest, smokeTraceSynthesis, smokeTraceUpdate],
    stateBanner: {
      title: "Zero-signal state is explicit",
      tone: "info",
      text:
        "This demo marks the run as zero_signal deliberately. The UI is not inferring that state from missing sections or empty arrays.",
      provenance: provenance(
        "hybrid",
        [refs.smokeManifest, refs.smokeSynthesis],
        "Banner explains the explicit demo-side zero_signal mapping.",
      ),
    },
    provenance: provenance(
      "hybrid",
      [refs.smokeManifest, refs.smokeSynthesis, refs.smokeUpdate],
      "Run detail combines tracked smoke artifacts with explicit demo-side state mapping.",
    ),
  };

  const run002CompletionStatuses = extractNestedCodeList(a2Run002, "contour completion");
  const run002OutputPaths = extractBacktickedItems(extractSection(a2Run002, "### Runtime output locations")).filter(
    (item) => item.includes(":\\"),
  );
  const run002RecommendedNextStep = ensureMatch(
    a2Run002,
    /### Recommended next step[\s\S]*?- ([^\n]+)/,
    "Review whether the retrieval contour can produce stable persisted evidence for this lane.",
  );
  const run002DocTrace = buildManifestTraceEntry(
    "a2-live-gate-002",
    refs.a2Run002,
    "a2_live_gate_run_002",
    shorten(a2Run002, 260),
    "blocked classification and contour completion",
  );
  const run002ExternalTraces = run002OutputPaths.map((item, index) =>
    buildExternalTraceEntry(
      "a2-live-gate-002",
      item,
      `a2_live_gate_002_output_${index + 1}`,
      "Runtime output path cited in the tracked draft outcome capture.",
    ),
  );
  const blockedRunContradictions = [
    buildContradiction({
      contradictionId: "contradiction-a2-live-gate-002-empty-evidence-bundle",
      severityLevel: "critical",
      contradictionKind: "validator_received_no_persisted_evidence",
      contradictionText:
        "Retrieval completed, but validator stopped on an empty evidence bundle, so the operator surface never reached a signal-emitting stage.",
      sourceStageOrigin: "projection_fallback",
      traceRefIds: [run002DocTrace.traceId],
      sourceRefs: [refs.a2Run002],
      notes: "Derived from tracked blocked live-gate outcome capture.",
    }),
    buildContradiction({
      contradictionId: "contradiction-a2-live-gate-002-query-density-regressed-yield",
      severityLevel: "major",
      contradictionKind: "denser_queries_did_not_improve_yield",
      contradictionText:
        "The rerun densified query coverage, but persisted retrieval yield regressed from one surviving evidence item to zero.",
      sourceStageOrigin: "projection_fallback",
      traceRefIds: [run002DocTrace.traceId],
      sourceRefs: [refs.a2Run002],
      notes: "Derived from the tracked run 002 comparison and gate decision sections.",
    }),
  ];
  const blockedRunNextStep = buildNextStep({
    nextStepId: "next-a2-live-gate-002-retrieval-capability-review",
    nextStepType: "validate_with_more_evidence",
    targetLayer: "operator_review",
    priorityLevel: "high",
    provenanceType: "operator",
    actionText: run002RecommendedNextStep,
    traceRefIds: [run002DocTrace.traceId],
    isBlocking: true,
    sourceRefs: [refs.a2Run002],
    notes: "Exact recommendation preserved from tracked run 002 outcome capture.",
  });
  const blockedRunSummary = {
    runId: "a2-live-gate-002",
    runLabel: "A2 live gate blocked contour",
    runState: "blocked",
    runOutcomeStatus: "blocked",
    sourceRunOutcomeRaw: ensureMatch(a2Run002, /- classification: `([^`]+)`/, "blocked"),
    signalCount: 0,
    contradictionCount: blockedRunContradictions.length,
    nextStepCount: 1,
    evidenceTracePresence: "limited",
    comparisonFamilyKey: "a2-live-gate::hotel_phone_abandonment",
    previousComparableRunId: "a2-live-gate-001",
    projectionGeneratedAt: generatedAt,
    humanSummary:
      "The contour stopped before validator/review decisioning because retrieval persisted zero evidence items.",
    provenance: provenance(
      "hybrid",
      [refs.a2Run002, ...run002OutputPaths],
      "Blocked run stitched from a repo-resident draft plus cited external runtime paths.",
    ),
  };
  const blockedRunDetail = {
    summary: blockedRunSummary,
    stageStatuses: [
      buildStageStatus("retrieval", "Retrieval", "completed", run002CompletionStatuses[0] ?? "Retrieval completed.", [refs.a2Run002], "Derived from tracked run 002 contour completion section."),
      buildStageStatus("validator", "Validator", "blocked", run002CompletionStatuses[1] ?? "Validator blocked on empty evidence bundle.", [refs.a2Run002], "Derived from tracked run 002 contour completion section."),
      buildStageStatus("review", "Review", "not_started", run002CompletionStatuses[2] ?? "Review not started.", [refs.a2Run002], "Derived from tracked run 002 contour completion section."),
    ],
    blocker: {
      blockedReasonCode: "validator_empty_evidence_bundle",
      blockedReasonText:
        "Validator blocked immediately because retrieval produced no persisted evidence records.",
      detail:
        "This is a real blocked contour. The UI shows it explicitly rather than hiding the absence of signal rows.",
      citedOutputPaths: run002OutputPaths,
      provenance: provenance(
        "hybrid",
        [refs.a2Run002, ...run002OutputPaths],
        "Blocked reason anchored in the tracked outcome capture and cited external runtime paths.",
      ),
    },
    signals: [],
    runContradictions: blockedRunContradictions,
    runNextSteps: [blockedRunNextStep],
    runEvidenceTraces: [run002DocTrace, ...run002ExternalTraces],
    stateBanner: {
      title: "Blocked before fair operator inspection",
      tone: "danger",
      text:
        "Retrieval completed, but validator stopped on an empty evidence bundle and review never started. No signal rows are fabricated.",
      provenance: provenance("hybrid", [refs.a2Run002], "Banner derived from tracked blocked contour completion wording."),
    },
    provenance: provenance(
      "hybrid",
      [refs.a2Run002, ...run002OutputPaths],
      "Run detail stitched from the tracked draft outcome capture and cited runtime paths.",
    ),
  };

  const run001CompletionStatuses = extractNestedCodeList(a2Run001, "contour completion");
  const run001OutputPaths = extractBacktickedItems(extractSection(a2Run001, "### Runtime output locations")).filter(
    (item) => item.includes(":\\"),
  );
  const run001Classification = ensureMatch(a2Run001, /- classification: `([^`]+)`/, "hold_and_review");
  const retrievalUnderYieldText = ensureMatch(a2Run001Diagnosis, /### `retrieval_under_yield`[\s\S]*?- short explanation:\s*\r?\n\s+- ([^\n]+)/, "The contour narrowed before validator because retrieval persisted only one evidence item.");
  const liveInconclusiveText = ensureMatch(a2Run001Diagnosis, /### `A2_mechanically_ok_but_live-inconclusive`[\s\S]*?- short explanation:\s*\r?\n\s+- ([^\n]+)/, "Live contour did not produce recurrence conditions, so the run remains inconclusive.");
  const run001DocTrace = buildManifestTraceEntry("a2-live-gate-001", refs.a2Run001, "a2_live_gate_run_001", shorten(a2Run001, 260), "gate assessment and completion status");
  const run001DiagnosisTrace = buildManifestTraceEntry("a2-live-gate-001", refs.a2Run001Diagnosis, "a2_live_gate_run_001_diagnosis", shorten(a2Run001Diagnosis, 260), "retrieval_under_yield and live-inconclusive diagnosis");
  const run001ExternalTraces = run001OutputPaths.map((item, index) =>
    buildExternalTraceEntry("a2-live-gate-001", item, `a2_live_gate_001_output_${index + 1}`, "Runtime output path cited in the tracked run 001 live-gate capture."),
  );
  const inconclusiveSignalTrace = {
    ...run001DiagnosisTrace,
    traceId: "trace-a2-live-gate-001-provisional-signal",
    traceRole: "support",
    sourceRecordId: "provisional_signal_basis",
    locatorHint: "retrieval_under_yield + live-inconclusive diagnosis",
    excerptText: "One live candidate was reviewable, but the contour remained too thin to exercise recurrence materially.",
  };
  const inconclusiveSignalContradictions = [
    buildContradiction({
      contradictionId: "contradiction-a2-live-gate-001-retrieval-under-yield",
      severityLevel: "major",
      contradictionKind: "retrieval_under_yield",
      contradictionText: retrievalUnderYieldText,
      sourceStageOrigin: "projection_fallback",
      traceRefIds: [run001DiagnosisTrace.traceId],
      sourceRefs: [refs.a2Run001, refs.a2Run001Diagnosis],
      notes: "Derived from tracked run 001 diagnosis.",
    }),
    buildContradiction({
      contradictionId: "contradiction-a2-live-gate-001-live-inconclusive",
      severityLevel: "moderate",
      contradictionKind: "live_inconclusive",
      contradictionText: liveInconclusiveText,
      sourceStageOrigin: "projection_fallback",
      traceRefIds: [run001DiagnosisTrace.traceId],
      sourceRefs: [refs.a2Run001Diagnosis],
      notes: "Derived from tracked run 001 diagnosis.",
    }),
  ];
  const inconclusiveSignalNextStep = buildNextStep({
    nextStepId: "next-a2-live-gate-001-rerun-same-lane",
    nextStepType: "hold_for_future_run",
    targetLayer: "operator_review",
    priorityLevel: "high",
    provenanceType: "operator",
    actionText:
      "rerun_same_lane_with_better_input: densify retrieval around missed reservation calls, direct-booking leakage, staffing strain, and phone-to-revenue loss without changing runtime logic.",
    traceRefIds: [run001DiagnosisTrace.traceId],
    isBlocking: true,
    sourceRefs: [refs.a2Run001Diagnosis],
    notes: "Derived from the tracked run 001 diagnosis recommendation.",
  });
  const inconclusiveSignal = {
    signalId: "a2-live-gate-001-provisional-signal-001",
    runId: "a2-live-gate-001",
    signalType: "hold_item",
    sourceSignalTypeRaw: null,
    label: "Single surviving hotel phone-loss candidate",
    summary:
      "A live candidate reached review, but the batch stayed too thin to support recurrence visibility or a stronger operator decision.",
    status: {
      statusCode: "hold",
      uncertaintyLevel: "high",
      decisionRelevanceLevel: "medium",
      assessmentOrigin: "projection_fallback",
      sourceStatusCodeRaw: run001Classification,
      sourceEvidenceStrengthRaw: null,
      rationale: liveInconclusiveText,
      traceRefIds: [inconclusiveSignalTrace.traceId],
      provenance: provenance("hybrid", [refs.a2Run001, refs.a2Run001Diagnosis], "Provisional signal reconstructed from tracked live-gate outcome and diagnosis drafts."),
    },
    contradictions: inconclusiveSignalContradictions,
    nextSteps: [inconclusiveSignalNextStep],
    evidenceTraces: [inconclusiveSignalTrace],
    changedVsPreviousComparable: "comparison_unavailable_due_to_partial_data",
    feedbackTarget: { runId: "a2-live-gate-001", signalId: "a2-live-gate-001-provisional-signal-001" },
    provenance: provenance("hybrid", [refs.a2Run001, refs.a2Run001Diagnosis], "Provisional signal row is reconstructed because the raw live bundle is not tracked in this repo."),
  };
  const inconclusiveRunSummary = {
    runId: "a2-live-gate-001",
    runLabel: "A2 live gate inconclusive contour",
    runState: "inconclusive",
    runOutcomeStatus: "partial",
    sourceRunOutcomeRaw: run001Classification,
    signalCount: 1,
    contradictionCount: inconclusiveSignalContradictions.length,
    nextStepCount: 1,
    evidenceTracePresence: "limited",
    comparisonFamilyKey: "a2-live-gate::hotel_phone_abandonment",
    previousComparableRunId: null,
    projectionGeneratedAt: generatedAt,
    humanSummary:
      "The contour completed end-to-end, but retrieval under-yield kept the live run too thin to substantively exercise recurrence.",
    provenance: provenance("hybrid", [refs.a2Run001, refs.a2Run001Diagnosis, ...run001OutputPaths], "Inconclusive run stitched from tracked drafts and cited external runtime paths."),
  };
  const inconclusiveRunDetail = {
    summary: inconclusiveRunSummary,
    stageStatuses: [
      buildStageStatus("retrieval", "Retrieval", "completed", run001CompletionStatuses[0] ?? "Retrieval completed.", [refs.a2Run001], "Derived from tracked run 001 contour completion section."),
      buildStageStatus("validator", "Validator", "completed", run001CompletionStatuses[1] ?? "Validator completed.", [refs.a2Run001], "Derived from tracked run 001 contour completion section."),
      buildStageStatus("review", "Review", "completed", run001CompletionStatuses[2] ?? "Review completed.", [refs.a2Run001], "Derived from tracked run 001 contour completion section."),
    ],
    signals: [inconclusiveSignal],
    runContradictions: inconclusiveSignalContradictions,
    runNextSteps: [inconclusiveSignalNextStep],
    runEvidenceTraces: [run001DocTrace, run001DiagnosisTrace, ...run001ExternalTraces],
    stateBanner: {
      title: "Inconclusive because recurrence never formed fairly",
      tone: "warning",
      text:
        "The contour ran far enough to inspect outputs, but the live batch remained too thin to claim a substantive recurrence exercise. The UI keeps that uncertainty explicit.",
      provenance: provenance("hybrid", [refs.a2Run001, refs.a2Run001Diagnosis], "Banner derived from tracked run 001 outcome and diagnosis drafts."),
    },
    provenance: provenance("hybrid", [refs.a2Run001, refs.a2Run001Diagnosis, ...run001OutputPaths], "Run detail combines tracked drafts with cited external runtime paths and a provisional signal row."),
  };

  const comparison = {
    pairId: "phase0-validator-run-005__phase0-review-run-001",
    leftRunId: "phase0-validator-run-005",
    rightRunId: "phase0-review-run-001",
    deltaSummary: [
      { key: "run_state", label: "Run state", leftValue: validatorRunSummary.runState, rightValue: reviewRunSummary.runState, change: "State stayed populated while the decision posture tightened.", provenance: provenance("hybrid", [refs.validatorManifest, refs.reviewManifest], "Comparison delta derived from two tracked run summaries.") },
      { key: "signal_count", label: "Signal count", leftValue: validatorRunSummary.signalCount, rightValue: reviewRunSummary.signalCount, change: "Signal count stayed stable across validator and review.", provenance: provenance("hybrid", [refs.validatedSignals, refs.reviewedSignals], "Comparison delta derived from tracked signal arrays.") },
      { key: "contradiction_count", label: "Contradiction count", leftValue: validatorRunSummary.contradictionCount, rightValue: reviewRunSummary.contradictionCount, change: "Review introduced one extra contradiction entry for validator-review divergence.", provenance: provenance("hybrid", [refs.validatedSignals, refs.reviewedSignals, refs.decisionSummary], "Comparison delta derived from tracked signal and decision artifacts.") },
      { key: "next_step_count", label: "Next-step count", leftValue: validatorRunSummary.nextStepCount, rightValue: reviewRunSummary.nextStepCount, change: "Review introduced signal-specific follow-up steps.", provenance: provenance("hybrid", [refs.validatorManifest, refs.reviewManifest, refs.reviewedSignals], "Comparison delta derived from tracked manifests and review next-step fields.") },
    ],
    addedSignals: [],
    removedSignals: [],
    changedSignals: [
      {
        signalId: "signal-001",
        label: "Hidden phone-loss after IVR removal",
        changeType: "changed",
        summary:
          "Validator surfaced the item as a monetizable pain signal; review kept it on hold because independent verification is still missing.",
        leftStatus: validatorSignals[0]?.status.statusCode ?? "needs_validation",
        rightStatus: reviewSignals[0]?.status.statusCode ?? "hold",
        provenance: provenance("hybrid", [refs.validatedSignals, refs.reviewedSignals, refs.decisionSummary], "Signal change derived from tracked validator and review outputs for the same candidate_id."),
      },
    ],
    contradictionDelta: [
      {
        id: "contradiction-delta-signal-001",
        label: "Validator-review divergence",
        changeType: "added",
        rightValue: "Review added an explicit divergence contradiction for signal-001.",
        note: "Partial because contradiction taxonomy is still a hybrid draft projection.",
        provenance: provenance("hybrid", [refs.validatedSignals, refs.reviewedSignals, refs.decisionSummary], "Hybrid contradiction delta projected from tracked artifacts."),
      },
    ],
    nextStepDelta: reviewRunNextSteps.map((step) => ({
      id: `next-step-delta-${step.nextStepId}`,
      label: step.nextStepType,
      changeType: "added",
      rightValue: step.actionText,
      note: "Review adds concrete signal-level follow-up text.",
      provenance: provenance("hybrid", [refs.reviewedSignals, refs.decisionSummary], "Next-step delta projected from tracked review output."),
    })),
    partialDueToHybridData: true,
    partialNote:
      "State and signal deltas are rooted in tracked artifacts. Contradiction and next-step delta sections remain partial because their cross-run mapping is still a hybrid projection.",
    provenance: provenance("hybrid", [refs.validatedSignals, refs.reviewedSignals, refs.decisionSummary], "Comparison surface is precomputed from tracked artifacts plus hybrid delta mapping."),
  };

  return {
    runs: [validatorRunSummary, reviewRunSummary, blockedRunSummary, smokeRunSummary, inconclusiveRunSummary],
    details: {
      "phase0-validator-run-005": validatorRunDetail,
      "phase0-review-run-001": reviewRunDetail,
      "a2-live-gate-002": blockedRunDetail,
      "phase0-smoke-run-001": smokeRunDetail,
      "a2-live-gate-001": inconclusiveRunDetail,
    },
    comparison,
    sourceMap: {
      generatedAt,
      sourceCommit,
      globalGroundingRefs: groundingRefs,
      entries: [
        { id: "phase0-validator-run-005", title: "Validator verdict surface", sourceMode: "artifact_backed", refs: [refs.validatorManifest, refs.validatedSignals, refs.retrievalManifest, refs.evidenceIndex], notes: "Tracked runtime artifacts with normalized read-side projection." },
        { id: "phase0-review-run-001", title: "Review decision surface", sourceMode: "artifact_backed", refs: [refs.reviewManifest, refs.reviewedSignals, refs.decisionSummary, refs.evidenceIndex], notes: "Tracked runtime artifacts with normalized read-side projection." },
        { id: "a2-live-gate-002", title: "Blocked A2 live gate", sourceMode: "hybrid", refs: [refs.a2Run002, ...run002OutputPaths], notes: "Repo-resident draft plus cited untracked runtime paths." },
        { id: "phase0-smoke-run-001", title: "Zero-signal smoke contour", sourceMode: "hybrid", refs: [refs.smokeManifest, refs.smokeSynthesis, refs.smokeUpdate], notes: "Tracked smoke bundle plus explicit demo-side zero_signal mapping." },
        { id: "a2-live-gate-001", title: "Inconclusive A2 live gate", sourceMode: "hybrid", refs: [refs.a2Run001, refs.a2Run001Diagnosis, ...run001OutputPaths], notes: "Repo-resident drafts plus cited untracked runtime paths and a provisional signal row." },
        { id: "phase0-validator-run-005__phase0-review-run-001", title: "Comparison pair", sourceMode: "hybrid", refs: [refs.validatedSignals, refs.reviewedSignals, refs.decisionSummary], notes: "Precomputed comparison with partial hybrid delta mapping." },
        { id: "feedback-local", title: "Local demo feedback events", sourceMode: "mock", refs: ["browser:localStorage"], notes: "Created locally in the browser and never written into runtime or governance." },
      ],
    },
  };
}

async function main() {
  const data = await buildData();

  await fs.mkdir(outputRoot, { recursive: true });
  await writeJson("runs_index.json", { generatedAt, sourceCommit, runs: data.runs });
  await writeJson("source_map.json", data.sourceMap);
  await writeJson("feedback_seed.json", []);

  await Promise.all(
    Object.entries(data.details).map(([runId, value]) =>
      writeJson(repoPath("run_details", `${runId}.json`), value),
    ),
  );
  await writeJson(repoPath("comparisons", `${data.comparison.pairId}.json`), data.comparison);

  process.stdout.write(`Demo read model emitted to ${path.relative(repoRoot, outputRoot)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack ?? error}\n`);
  process.exitCode = 1;
});
