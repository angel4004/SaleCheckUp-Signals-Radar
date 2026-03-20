import type { NextStepEntry } from "../lib/readModel";
import { ProvenanceChip } from "./ProvenanceChip";
import { StatusBadge } from "./StatusBadge";

interface NextStepPanelProps {
  title?: string;
  nextSteps: NextStepEntry[];
}

function getPriorityTone(priority: NextStepEntry["priorityLevel"]) {
  switch (priority) {
    case "high":
      return "danger";
    case "medium":
      return "warning";
    default:
      return "info";
  }
}

export function NextStepPanel({
  title = "Next Steps",
  nextSteps,
}: NextStepPanelProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Visible object</p>
          <h2>{title}</h2>
        </div>
        <StatusBadge
          label={`${nextSteps.length} item${nextSteps.length === 1 ? "" : "s"}`}
          tone={nextSteps.length > 0 ? "info" : "neutral"}
        />
      </div>

      {nextSteps.length === 0 ? (
        <p className="empty-state">No next-step entries surfaced for this scope.</p>
      ) : (
        <div className="stack">
          {nextSteps.map((item) => (
            <article className="subpanel" key={item.nextStepId}>
              <div className="panel-header">
                <div>
                  <h3>{item.nextStepType}</h3>
                  <p className="muted">{item.actionText}</p>
                </div>
                <StatusBadge
                  label={item.priorityLevel}
                  tone={getPriorityTone(item.priorityLevel)}
                />
              </div>
              <p className="muted">
                Target layer: {item.targetLayer} · Blocking:{" "}
                {item.isBlocking ? "yes" : "no"} · Trace refs:{" "}
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
