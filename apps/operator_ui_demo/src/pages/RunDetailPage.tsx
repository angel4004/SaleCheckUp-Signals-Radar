import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ContradictionPanel } from "../components/ContradictionPanel";
import { EvidencePanel } from "../components/EvidencePanel";
import { FeedbackActions } from "../components/FeedbackActions";
import { LineagePanel } from "../components/LineagePanel";
import { NextStepPanel } from "../components/NextStepPanel";
import { ProvenanceChip } from "../components/ProvenanceChip";
import { SignalTable } from "../components/SignalTable";
import { StatusBadge } from "../components/StatusBadge";
import type {
  DemoRunDetail,
  EndToEndProvenanceManifest,
} from "../lib/readModel";
import { loadEndToEndProvenanceManifest, loadRunDetail } from "../lib/readModel";

function getBannerTone(tone: DemoRunDetail["stateBanner"]["tone"]) {
  switch (tone) {
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "danger":
      return "danger";
    default:
      return "info";
  }
}

export function RunDetailPage() {
  const { runId } = useParams();
  const [detail, setDetail] = useState<DemoRunDetail | null>(null);
  const [provenanceManifest, setProvenanceManifest] =
    useState<EndToEndProvenanceManifest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!runId) {
      setError("Missing run id.");
      setLoading(false);
      return;
    }

    let active = true;

    Promise.all([loadRunDetail(runId), loadEndToEndProvenanceManifest()])
      .then(([detailResponse, provenanceResponse]) => {
        if (!active) {
          return;
        }

        setDetail(detailResponse);
        setProvenanceManifest(provenanceResponse);
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Failed to load run detail.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [runId]);

  if (loading) {
    return <p className="empty-state">Loading run detail…</p>;
  }

  if (error) {
    return <p className="error-state">{error}</p>;
  }

  if (!detail) {
    return <p className="empty-state">Run detail is not available.</p>;
  }

  const runLineage =
    provenanceManifest?.entries.runs[detail.summary.runId] ?? null;

  return (
    <div className="stack">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">View</p>
            <h2>{detail.summary.runId}</h2>
            <p className="muted">{detail.summary.runLabel}</p>
          </div>
          <StatusBadge
            label={detail.summary.runState}
            tone={getBannerTone(detail.stateBanner.tone)}
          />
        </div>

        <p>{detail.summary.humanSummary}</p>

        <div className="metadata-row">
          <span>run_id: {detail.summary.runId}</span>
          <span>run_state: {detail.summary.runState}</span>
          <span>materialization_mode: {detail.summary.provenance.sourceMode}</span>
          <span>comparison_family_key: {detail.summary.comparisonFamilyKey}</span>
          <span>
            previous_comparable_run_id:{" "}
            {detail.summary.previousComparableRunId ?? "none"}
          </span>
        </div>

        <dl className="stat-grid">
          <div>
            <dt>signal_count</dt>
            <dd>{detail.summary.signalCount}</dd>
          </div>
          <div>
            <dt>contradiction_count</dt>
            <dd>{detail.summary.contradictionCount}</dd>
          </div>
          <div>
            <dt>next_step_count</dt>
            <dd>{detail.summary.nextStepCount}</dd>
          </div>
          <div>
            <dt>evidence_trace_presence</dt>
            <dd>{detail.summary.evidenceTracePresence}</dd>
          </div>
        </dl>

        <ProvenanceChip provenance={detail.summary.provenance} />
        <FeedbackActions runId={detail.summary.runId} targetScope="run" />
      </section>

      {runLineage ? (
        <LineagePanel entry={runLineage} title={`How ${detail.summary.runId} reached UI`} />
      ) : null}

      <section className={`banner tone-${detail.stateBanner.tone}`}>
        <div className="panel-header">
          <div>
            <p className="eyebrow">State-specific banner</p>
            <h2>{detail.stateBanner.title}</h2>
          </div>
          <StatusBadge
            label={detail.summary.runState}
            tone={getBannerTone(detail.stateBanner.tone)}
          />
        </div>
        <p>{detail.stateBanner.text}</p>
        <ProvenanceChip provenance={detail.stateBanner.provenance} />
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Stage status</p>
            <h2>Run state and contour posture</h2>
          </div>
        </div>

        <div className="stage-grid">
          {detail.stageStatuses.map((stage) => (
            <article className="subpanel" key={stage.stageKey}>
              <div className="panel-header">
                <h3>{stage.stageLabel}</h3>
                <StatusBadge
                  label={stage.status}
                  tone={
                    stage.status === "completed"
                      ? "success"
                      : stage.status === "blocked"
                        ? "danger"
                        : "info"
                  }
                />
              </div>
              <p>{stage.detail}</p>
              <ProvenanceChip provenance={stage.provenance} />
            </article>
          ))}
        </div>
      </section>

      {detail.blocker ? (
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Blocked run panel</p>
              <h2>{detail.blocker.blockedReasonCode}</h2>
            </div>
            <StatusBadge label="blocked_reason" tone="danger" />
          </div>
          <p>{detail.blocker.blockedReasonText}</p>
          <p className="muted">{detail.blocker.detail}</p>
          <ul className="list-compact">
            {detail.blocker.citedOutputPaths.map((path) => (
              <li key={path}>{path}</li>
            ))}
          </ul>
          <ProvenanceChip provenance={detail.blocker.provenance} />
        </section>
      ) : null}

      <SignalTable
        signalProvenanceEntries={provenanceManifest?.entries.signals}
        signals={detail.signals}
      />

      <div className="two-column">
        <ContradictionPanel contradictions={detail.runContradictions} />
        <NextStepPanel nextSteps={detail.runNextSteps} />
      </div>

      <EvidencePanel
        evidenceTracePresence={detail.summary.evidenceTracePresence}
        traces={detail.runEvidenceTraces}
      />
    </div>
  );
}
