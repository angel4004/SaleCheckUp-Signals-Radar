import type {
  EvidenceTraceEntry,
  EvidenceTracePresence,
} from "../lib/readModel";
import { ProvenanceChip } from "./ProvenanceChip";
import { StatusBadge } from "./StatusBadge";

interface EvidencePanelProps {
  title?: string;
  evidenceTracePresence: EvidenceTracePresence;
  traces: EvidenceTraceEntry[];
}

function getEvidenceTone(presence: EvidenceTracePresence) {
  switch (presence) {
    case "present":
      return "success";
    case "limited":
      return "warning";
    case "none":
      return "danger";
    default:
      return "neutral";
  }
}

export function EvidencePanel({
  title = "Evidence Trace",
  evidenceTracePresence,
  traces,
}: EvidencePanelProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Visible object</p>
          <h2>{title}</h2>
        </div>
        <StatusBadge
          label={evidenceTracePresence}
          tone={getEvidenceTone(evidenceTracePresence)}
        />
      </div>

      {traces.length === 0 ? (
        <p className="empty-state">
          No evidence trace entries are available for this scope.
        </p>
      ) : (
        <div className="stack">
          {traces.map((trace) => (
            <article className="subpanel" key={trace.traceId}>
              <div className="panel-header">
                <div>
                  <h3>{trace.sourceRecordId}</h3>
                  <p className="muted">{trace.excerptText}</p>
                </div>
                <StatusBadge label={trace.traceRole} tone="info" />
              </div>
              <p className="muted">
                Artifact: {trace.artifactPath} · Locator: {trace.locatorHint}
              </p>
              <p className="muted">
                Kind: {trace.artifactKind} · Status: {trace.documentStatus} ·
                Stage: {trace.sourceStageOrigin}
              </p>
              <ProvenanceChip provenance={trace.provenance} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
