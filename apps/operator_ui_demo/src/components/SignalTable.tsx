import type { DemoSignal } from "../lib/readModel";
import { ContradictionPanel } from "./ContradictionPanel";
import { EvidencePanel } from "./EvidencePanel";
import { FeedbackActions } from "./FeedbackActions";
import { NextStepPanel } from "./NextStepPanel";
import { ProvenanceChip } from "./ProvenanceChip";
import { StatusBadge } from "./StatusBadge";

interface SignalTableProps {
  signals: DemoSignal[];
}

function getStatusTone(statusCode: string) {
  switch (statusCode) {
    case "promising":
      return "success";
    case "contradicted":
    case "discard_candidate":
      return "danger";
    case "hold":
    case "needs_validation":
      return "warning";
    default:
      return "info";
  }
}

export function SignalTable({ signals }: SignalTableProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Visible object</p>
          <h2>Signals</h2>
        </div>
        <StatusBadge label={`${signals.length} signal${signals.length === 1 ? "" : "s"}`} />
      </div>

      {signals.length === 0 ? (
        <p className="empty-state">No signal rows surfaced for this run.</p>
      ) : (
        <div className="stack">
          {signals.map((signal) => (
            <article className="signal-card" key={signal.signalId}>
              <div className="panel-header">
                <div>
                  <p className="eyebrow">{signal.signalType}</p>
                  <h3>{signal.label}</h3>
                  <p className="muted">{signal.summary}</p>
                </div>
                <StatusBadge
                  label={signal.status.statusCode}
                  tone={getStatusTone(signal.status.statusCode)}
                />
              </div>

              <div className="metadata-row">
                <span>signal_id: {signal.signalId}</span>
                <span>uncertainty: {signal.status.uncertaintyLevel}</span>
                <span>decision relevance: {signal.status.decisionRelevanceLevel}</span>
                {signal.changedVsPreviousComparable ? (
                  <span>comparison: {signal.changedVsPreviousComparable}</span>
                ) : null}
              </div>

              <p>{signal.status.rationale}</p>
              <ProvenanceChip provenance={signal.provenance} />

              <div className="three-column">
                <ContradictionPanel
                  title={`Signal contradictions · ${signal.signalId}`}
                  contradictions={signal.contradictions}
                />
                <NextStepPanel
                  title={`Signal next steps · ${signal.signalId}`}
                  nextSteps={signal.nextSteps}
                />
                <EvidencePanel
                  title={`Signal evidence · ${signal.signalId}`}
                  evidenceTracePresence={signal.evidenceTraces.length > 0 ? "present" : "none"}
                  traces={signal.evidenceTraces}
                />
              </div>

              <FeedbackActions
                runId={signal.runId}
                signalId={signal.signalId}
                targetScope="signal"
              />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
