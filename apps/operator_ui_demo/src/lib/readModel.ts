export type RunState = "populated" | "blocked" | "zero_signal" | "inconclusive";
export type SourceMode = "artifact_backed" | "hybrid" | "mock";
export type EvidenceTracePresence = "present" | "limited" | "none";
export type RunOutcomeStatus = "completed" | "blocked" | "partial";
export type StageStatusCode = "completed" | "blocked" | "not_started";
export type FeedbackActionType =
  | "mark_noise"
  | "needs_more_evidence"
  | "hold"
  | "queue_next_run"
  | "escalate_contradiction";
export type FeedbackTargetScope = "run" | "signal";

export interface Provenance {
  sourceMode: SourceMode;
  sourceRefs: string[];
  sourceCommit: string | null;
  generatedAt: string;
  notes?: string;
}

export interface StageStatus {
  stageKey: string;
  stageLabel: string;
  status: StageStatusCode;
  detail: string;
  provenance: Provenance;
}

export interface StatusAssessment {
  statusCode: string;
  uncertaintyLevel: "low" | "medium" | "high";
  decisionRelevanceLevel: "low" | "medium" | "high";
  assessmentOrigin: string;
  sourceStatusCodeRaw: string | null;
  sourceEvidenceStrengthRaw: string | null;
  rationale: string;
  traceRefIds: string[];
  provenance: Provenance;
}

export interface ContradictionEntry {
  contradictionId: string;
  severityLevel: "critical" | "major" | "moderate" | "minor";
  contradictionKind: string;
  contradictionText: string;
  sourceStageOrigin: string;
  traceRefIds: string[];
  isResolved: boolean;
  resolutionNote?: string;
  provenance: Provenance;
}

export interface NextStepEntry {
  nextStepId: string;
  nextStepType: string;
  targetLayer: "runtime" | "governance" | "feedback" | "ui" | "operator_review";
  priorityLevel: "high" | "medium" | "low";
  provenanceType: "machine" | "operator" | "mixed";
  actionText: string;
  traceRefIds: string[];
  isBlocking: boolean;
  provenance: Provenance;
}

export interface EvidenceTraceEntry {
  traceId: string;
  traceRole: "support" | "qualify" | "contradict" | "context";
  artifactPath: string;
  artifactKind: string;
  documentStatus: string;
  sourceRecordId: string;
  locatorHint: string;
  excerptText: string;
  sourceStageOrigin: string;
  provenance: Provenance;
}

export interface FeedbackTarget {
  runId: string;
  signalId?: string;
}

export interface DemoSignal {
  signalId: string;
  runId: string;
  signalType: string;
  sourceSignalTypeRaw: string | null;
  label: string;
  summary: string;
  status: StatusAssessment;
  contradictions: ContradictionEntry[];
  nextSteps: NextStepEntry[];
  evidenceTraces: EvidenceTraceEntry[];
  changedVsPreviousComparable: string | null;
  feedbackTarget: FeedbackTarget;
  provenance: Provenance;
}

export interface DemoRunSummary {
  runId: string;
  runLabel: string;
  runState: RunState;
  runOutcomeStatus: RunOutcomeStatus;
  sourceRunOutcomeRaw: string | null;
  signalCount: number;
  contradictionCount: number;
  nextStepCount: number;
  evidenceTracePresence: EvidenceTracePresence;
  comparisonFamilyKey: string;
  previousComparableRunId: string | null;
  projectionGeneratedAt: string;
  humanSummary: string;
  provenance: Provenance;
}

export interface RunBlocker {
  blockedReasonCode: string;
  blockedReasonText: string;
  detail: string;
  citedOutputPaths: string[];
  provenance: Provenance;
}

export interface StateBanner {
  title: string;
  tone: "info" | "warning" | "danger" | "success";
  text: string;
  provenance: Provenance;
}

export interface DemoRunDetail {
  summary: DemoRunSummary;
  stageStatuses: StageStatus[];
  blocker?: RunBlocker;
  signals: DemoSignal[];
  runContradictions: ContradictionEntry[];
  runNextSteps: NextStepEntry[];
  runEvidenceTraces: EvidenceTraceEntry[];
  stateBanner: StateBanner;
  provenance: Provenance;
}

export interface ComparisonDeltaItem {
  key: string;
  label: string;
  leftValue: string | number;
  rightValue: string | number;
  change: string;
  provenance: Provenance;
}

export interface SignalDiffEntry {
  signalId: string;
  label: string;
  changeType: "added" | "removed" | "changed";
  summary: string;
  leftStatus?: string;
  rightStatus?: string;
  provenance: Provenance;
}

export interface ComparisonTextDelta {
  id: string;
  label: string;
  changeType: "added" | "removed" | "changed";
  leftValue?: string;
  rightValue?: string;
  note?: string;
  provenance: Provenance;
}

export interface DemoComparison {
  pairId: string;
  leftRunId: string;
  rightRunId: string;
  deltaSummary: ComparisonDeltaItem[];
  addedSignals: SignalDiffEntry[];
  removedSignals: SignalDiffEntry[];
  changedSignals: SignalDiffEntry[];
  contradictionDelta: ComparisonTextDelta[];
  nextStepDelta: ComparisonTextDelta[];
  partialDueToHybridData: boolean;
  partialNote: string;
  provenance: Provenance;
}

export interface FeedbackEvent {
  eventId: string;
  actionType: FeedbackActionType;
  targetScope: FeedbackTargetScope;
  runId: string;
  signalId?: string;
  createdAt: string;
  persistenceMode: "local_demo_localStorage";
  demoOnlyNote: string;
  provenance: Provenance;
}

export interface RunsIndexResponse {
  generatedAt: string;
  sourceCommit: string | null;
  runs: DemoRunSummary[];
}

export interface SourceMapEntry {
  id: string;
  title: string;
  sourceMode: SourceMode;
  refs: string[];
  notes?: string;
}

export interface SourceMapResponse {
  generatedAt: string;
  sourceCommit: string | null;
  globalGroundingRefs: string[];
  entries: SourceMapEntry[];
}

export interface DemoLegendEntry {
  key: string;
  label: string;
  meaning: string;
}

export interface DemoFlowStep {
  stepId: string;
  label: string;
  objectType: string;
  objectId: string;
  state: string;
  materializationMode: SourceMode;
  summary: string;
  note: string;
  sourceArtifactRefs: string[];
  uiRoute?: string;
  outputRef?: string;
}

export interface BoundedDemoInputManifest {
  manifestId: string;
  generatedAt: string;
  sourceCommit: string | null;
  inputId: string;
  inputPath: string;
  boundedInputSummary: string;
  runGoal: string;
  currentHypothesis: string;
  modelId: string;
  searchQueries: string[];
  constraints: string[];
  requestedOutputs: string[];
  chosenRunChain: string[];
  assumptions: string[];
}

export interface DemoArtifactEntry {
  artifactId: string;
  label: string;
  artifactPath: string;
  artifactKind: string;
  sourceLayer: string;
  documentStatus: string;
  materializationMode: SourceMode;
  role: string;
  notes: string;
}

export interface DemoArtifactManifest {
  manifestId: string;
  generatedAt: string;
  sourceCommit: string | null;
  anchorRunId: string;
  artifacts: DemoArtifactEntry[];
}

export interface EndToEndDemoBundle {
  bundleId: string;
  generatedAt: string;
  sourceCommit: string | null;
  projectionCommand: string;
  readModelBuildCommand: string;
  uiRootRoute: string;
  primaryRunRoute: string;
  comparisonRoute: string;
  feedbackRoute: string;
  boundedInputId: string;
  boundedInputSummary: string;
  chosenAnchorRunId: string;
  chosenComparisonPairId: string;
  chosenArtifactAnchorRefs: string[];
  buildOutputs: string[];
  flowSteps: DemoFlowStep[];
  materializationLegend: DemoLegendEntry[];
  runStateLegend: DemoLegendEntry[];
  primarySurfaceRefs: string[];
  assumptions: string[];
  completionCriteria: string[];
}

export interface ProvenanceLineageStep {
  stepId: string;
  label: string;
  ref: string;
  note: string;
  materializationMode: SourceMode;
}

export interface UiObjectProvenanceEntry {
  objectId: string;
  objectType: "run" | "signal" | "comparison" | "feedback";
  route: string;
  runId?: string;
  signalId?: string;
  state: string;
  materializationMode: SourceMode;
  boundedInputSummary: string;
  sourceArtifactRefs: string[];
  projectionNotes: string;
  assumptions: string[];
  uiVisibleReason: string;
  lineage: ProvenanceLineageStep[];
}

export interface EndToEndProvenanceManifest {
  manifestId: string;
  generatedAt: string;
  sourceCommit: string | null;
  anchorRunId: string;
  entries: {
    runs: Record<string, UiObjectProvenanceEntry>;
    signals: Record<string, UiObjectProvenanceEntry>;
    comparisons: Record<string, UiObjectProvenanceEntry>;
    feedback: Record<string, UiObjectProvenanceEntry>;
  };
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }

  return (await response.json()) as T;
}

export function loadRunsIndex() {
  return fetchJson<RunsIndexResponse>("/demo-data/runs_index.json");
}

export function loadRunDetail(runId: string) {
  return fetchJson<DemoRunDetail>(`/demo-data/run_details/${runId}.json`);
}

export function loadComparison(pairId: string) {
  return fetchJson<DemoComparison>(`/demo-data/comparisons/${pairId}.json`);
}

export function loadSourceMap() {
  return fetchJson<SourceMapResponse>("/demo-data/source_map.json");
}

export function loadBoundedDemoInputManifest() {
  return fetchJson<BoundedDemoInputManifest>(
    "/demo-data/end_to_end_demo/bounded_demo_input_manifest_v0.json",
  );
}

export function loadDemoArtifactManifest() {
  return fetchJson<DemoArtifactManifest>(
    "/demo-data/end_to_end_demo/artifact_manifest_v0.json",
  );
}

export function loadEndToEndDemoBundle() {
  return fetchJson<EndToEndDemoBundle>(
    "/demo-data/end_to_end_demo/decision_read_bundle_demo_v0.json",
  );
}

export function loadEndToEndProvenanceManifest() {
  return fetchJson<EndToEndProvenanceManifest>(
    "/demo-data/end_to_end_demo/provenance_manifest_v0.json",
  );
}
