import { Link } from "react-router-dom";
import type { DemoRunSummary } from "../lib/readModel";
import { ProvenanceChip } from "./ProvenanceChip";
import { StatusBadge } from "./StatusBadge";

interface RunCardProps {
  run: DemoRunSummary;
}

function getRunStateTone(runState: DemoRunSummary["runState"]) {
  switch (runState) {
    case "populated":
      return "success";
    case "blocked":
      return "danger";
    case "zero_signal":
      return "info";
    case "inconclusive":
      return "warning";
    default:
      return "neutral";
  }
}

export function RunCard({ run }: RunCardProps) {
  const comparisonPair = run.previousComparableRunId
    ? `${run.previousComparableRunId}__${run.runId}`
    : run.runId === "phase0-validator-run-005"
      ? "phase0-validator-run-005__phase0-review-run-001"
      : null;

  return (
    <article className="panel run-card">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Run</p>
          <h3>{run.runId}</h3>
          <p className="muted">{run.runLabel}</p>
        </div>
        <StatusBadge label={run.runState} tone={getRunStateTone(run.runState)} />
      </div>

      <p>{run.humanSummary}</p>

      <dl className="stat-grid">
        <div>
          <dt>Signals</dt>
          <dd>{run.signalCount}</dd>
        </div>
        <div>
          <dt>Contradictions</dt>
          <dd>{run.contradictionCount}</dd>
        </div>
        <div>
          <dt>Next steps</dt>
          <dd>{run.nextStepCount}</dd>
        </div>
        <div>
          <dt>Evidence trace</dt>
          <dd>{run.evidenceTracePresence}</dd>
        </div>
      </dl>

      <ProvenanceChip provenance={run.provenance} />

      <div className="action-row">
        <Link className="button-link" to={`/runs/${run.runId}`}>
          Open detail
        </Link>
        {comparisonPair ? (
          <Link
            className="button-link secondary"
            to={`/compare?pair=${comparisonPair}`}
          >
            Compare
          </Link>
        ) : null}
      </div>
    </article>
  );
}
