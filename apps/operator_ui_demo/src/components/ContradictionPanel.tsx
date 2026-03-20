import type { ContradictionEntry } from "../lib/readModel";
import { ProvenanceChip } from "./ProvenanceChip";
import { StatusBadge } from "./StatusBadge";

interface ContradictionPanelProps {
  title?: string;
  contradictions: ContradictionEntry[];
}

function getSeverityTone(severity: ContradictionEntry["severityLevel"]) {
  switch (severity) {
    case "critical":
    case "major":
      return "danger";
    case "moderate":
      return "warning";
    default:
      return "info";
  }
}

export function ContradictionPanel({
  title = "Contradictions",
  contradictions,
}: ContradictionPanelProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Visible object</p>
          <h2>{title}</h2>
        </div>
        <StatusBadge
          label={`${contradictions.length} item${
            contradictions.length === 1 ? "" : "s"
          }`}
          tone={contradictions.length > 0 ? "warning" : "neutral"}
        />
      </div>

      {contradictions.length === 0 ? (
        <p className="empty-state">
          No contradiction entries surfaced for this scope.
        </p>
      ) : (
        <div className="stack">
          {contradictions.map((item) => (
            <article className="subpanel" key={item.contradictionId}>
              <div className="panel-header">
                <div>
                  <h3>{item.contradictionKind}</h3>
                  <p className="muted">{item.contradictionText}</p>
                </div>
                <StatusBadge
                  label={item.severityLevel}
                  tone={getSeverityTone(item.severityLevel)}
                />
              </div>
              <p className="muted">
                Stage: {item.sourceStageOrigin} · Trace refs:{" "}
                {item.traceRefIds.join(", ") || "n/a"}
              </p>
              <ProvenanceChip provenance={item.provenance} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
