import {
  formatDeltaValue,
  getDeltaTone,
  getSignalChangeLabel,
  hasMeaningfulDiffs,
} from "../lib/compare";
import type { DemoComparison } from "../lib/readModel";
import { ProvenanceChip } from "./ProvenanceChip";
import { StatusBadge } from "./StatusBadge";

interface ComparisonDiffProps {
  comparison: DemoComparison;
}

export function ComparisonDiff({ comparison }: ComparisonDiffProps) {
  return (
    <div className="stack">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Comparison pair</p>
            <h2>
              {comparison.leftRunId} vs {comparison.rightRunId}
            </h2>
          </div>
          <StatusBadge
            label={comparison.partialDueToHybridData ? "partial" : "complete"}
            tone={comparison.partialDueToHybridData ? "warning" : "success"}
          />
        </div>
        <p>{comparison.partialNote}</p>
        <ProvenanceChip provenance={comparison.provenance} />
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Run delta</p>
            <h2>State, count, and trace deltas</h2>
          </div>
        </div>

        <div className="delta-grid">
          {comparison.deltaSummary.map((item) => (
            <article className="subpanel" key={item.key}>
              <h3>{item.label}</h3>
              <p className="delta-line">
                <strong>{formatDeltaValue(item.leftValue)}</strong>
                <span>→</span>
                <strong>{formatDeltaValue(item.rightValue)}</strong>
              </p>
              <p className="muted">{item.change}</p>
              <ProvenanceChip provenance={item.provenance} />
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Comparison order</p>
            <h2>Appeared / removed / changed signals</h2>
          </div>
          <StatusBadge
            label={hasMeaningfulDiffs(comparison) ? "diffs visible" : "no diffs"}
            tone={hasMeaningfulDiffs(comparison) ? "info" : "neutral"}
          />
        </div>

        <div className="stack">
          {[...comparison.addedSignals, ...comparison.removedSignals, ...comparison.changedSignals].map(
            (item) => (
              <article className="subpanel" key={`${item.changeType}-${item.signalId}`}>
                <div className="panel-header">
                  <div>
                    <h3>{item.label}</h3>
                    <p className="muted">{item.summary}</p>
                  </div>
                  <StatusBadge label={getSignalChangeLabel(item)} tone="info" />
                </div>
                <p className="muted">
                  {item.leftStatus ? `left: ${item.leftStatus}` : "left: n/a"} ·{" "}
                  {item.rightStatus ? `right: ${item.rightStatus}` : "right: n/a"}
                </p>
                <ProvenanceChip provenance={item.provenance} />
              </article>
            ),
          )}
        </div>
      </section>

      <section className="two-column">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Contradiction delta</p>
              <h2>Changed contradiction posture</h2>
            </div>
          </div>
          {comparison.contradictionDelta.length === 0 ? (
            <p className="empty-state">No contradiction delta entries.</p>
          ) : (
            <div className="stack">
              {comparison.contradictionDelta.map((item) => (
                <article className="subpanel" key={item.id}>
                  <div className="panel-header">
                    <h3>{item.label}</h3>
                    <StatusBadge
                      label={item.changeType}
                      tone={getDeltaTone(item.changeType)}
                    />
                  </div>
                  <p className="muted">{item.note}</p>
                  {item.leftValue ? <p>left: {item.leftValue}</p> : null}
                  {item.rightValue ? <p>right: {item.rightValue}</p> : null}
                  <ProvenanceChip provenance={item.provenance} />
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Next-step delta</p>
              <h2>New or changed next steps</h2>
            </div>
          </div>
          {comparison.nextStepDelta.length === 0 ? (
            <p className="empty-state">No next-step delta entries.</p>
          ) : (
            <div className="stack">
              {comparison.nextStepDelta.map((item) => (
                <article className="subpanel" key={item.id}>
                  <div className="panel-header">
                    <h3>{item.label}</h3>
                    <StatusBadge
                      label={item.changeType}
                      tone={getDeltaTone(item.changeType)}
                    />
                  </div>
                  <p className="muted">{item.note}</p>
                  {item.leftValue ? <p>left: {item.leftValue}</p> : null}
                  {item.rightValue ? <p>right: {item.rightValue}</p> : null}
                  <ProvenanceChip provenance={item.provenance} />
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
