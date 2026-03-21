import type { UiObjectProvenanceEntry } from "../lib/readModel";
import { sourceModeTone } from "../lib/provenance";
import { StatusBadge } from "./StatusBadge";

interface LineagePanelProps {
  entry: UiObjectProvenanceEntry;
  title: string;
  eyebrow?: string;
}

export function LineagePanel({
  entry,
  title,
  eyebrow = "Visible provenance",
}: LineagePanelProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p className="muted">{entry.uiVisibleReason}</p>
        </div>
        <StatusBadge
          label={entry.materializationMode}
          tone={sourceModeTone(entry.materializationMode)}
        />
      </div>

      <div className="metadata-row">
        <span>object_id: {entry.objectId}</span>
        <span>object_type: {entry.objectType}</span>
        <span>state: {entry.state}</span>
        <span>materialization_mode: {entry.materializationMode}</span>
        {entry.runId ? <span>run_id: {entry.runId}</span> : null}
        {entry.signalId ? <span>signal_id: {entry.signalId}</span> : null}
      </div>

      <p>
        <strong>bounded_input_summary:</strong> {entry.boundedInputSummary}
      </p>
      <p>
        <strong>projection_notes:</strong> {entry.projectionNotes}
      </p>
      <p>
        <strong>ui_route:</strong> {entry.route}
      </p>

      <div className="two-column">
        <article className="subpanel">
          <h3>source_artifact_refs</h3>
          <ul className="list-compact">
            {entry.sourceArtifactRefs.map((ref) => (
              <li key={ref}>{ref}</li>
            ))}
          </ul>
        </article>

        <article className="subpanel">
          <h3>assumptions</h3>
          {entry.assumptions.length === 0 ? (
            <p className="muted">No additional assumptions for this object.</p>
          ) : (
            <ul className="list-compact">
              {entry.assumptions.map((assumption) => (
                <li key={assumption}>{assumption}</li>
              ))}
            </ul>
          )}
        </article>
      </div>

      <section className="stack">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Lineage</p>
            <h3>How this object reached UI</h3>
          </div>
        </div>
        <div className="stage-grid">
          {entry.lineage.map((step) => (
            <article className="subpanel" key={`${entry.objectId}-${step.stepId}`}>
              <div className="panel-header">
                <div>
                  <p className="eyebrow">{step.stepId}</p>
                  <h3>{step.label}</h3>
                </div>
                <StatusBadge
                  label={step.materializationMode}
                  tone={sourceModeTone(step.materializationMode)}
                />
              </div>
              <p className="muted">{step.ref}</p>
              <p>{step.note}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
