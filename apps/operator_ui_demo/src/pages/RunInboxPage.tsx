import { useEffect, useMemo, useState } from "react";
import { DemoOverviewPanel } from "../components/DemoOverviewPanel";
import { RunCard } from "../components/RunCard";
import { StatusBadge } from "../components/StatusBadge";
import type {
  BoundedDemoInputManifest,
  DemoArtifactManifest,
  DemoRunSummary,
  EndToEndDemoBundle,
  RunState,
} from "../lib/readModel";
import {
  loadBoundedDemoInputManifest,
  loadDemoArtifactManifest,
  loadEndToEndDemoBundle,
  loadRunsIndex,
} from "../lib/readModel";

type FilterState = RunState | "all";

export function RunInboxPage() {
  const [runs, setRuns] = useState<DemoRunSummary[]>([]);
  const [bundle, setBundle] = useState<EndToEndDemoBundle | null>(null);
  const [inputManifest, setInputManifest] =
    useState<BoundedDemoInputManifest | null>(null);
  const [artifactManifest, setArtifactManifest] =
    useState<DemoArtifactManifest | null>(null);
  const [filter, setFilter] = useState<FilterState>("all");
  const [error, setError] = useState<string | null>(null);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [overviewLoading, setOverviewLoading] = useState(true);

  useEffect(() => {
    let active = true;

    loadRunsIndex()
      .then((response) => {
        if (!active) {
          return;
        }

        setRuns(response.runs);
      })
      .catch((reason: unknown) => {
        if (!active) {
          return;
        }

        setError(reason instanceof Error ? reason.message : "Failed to load runs.");
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    Promise.all([
      loadBoundedDemoInputManifest(),
      loadDemoArtifactManifest(),
      loadEndToEndDemoBundle(),
    ])
      .then(([inputResponse, artifactResponse, bundleResponse]) => {
        if (!active) {
          return;
        }

        setInputManifest(inputResponse);
        setArtifactManifest(artifactResponse);
        setBundle(bundleResponse);
      })
      .catch((reason: unknown) => {
        if (!active) {
          return;
        }

        setOverviewError(
          reason instanceof Error
            ? reason.message
            : "Failed to load end-to-end demo bundle.",
        );
      })
      .finally(() => {
        if (active) {
          setOverviewLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const counts = useMemo(
    () => ({
      populated: runs.filter((run) => run.runState === "populated").length,
      blocked: runs.filter((run) => run.runState === "blocked").length,
      zero_signal: runs.filter((run) => run.runState === "zero_signal").length,
      inconclusive: runs.filter((run) => run.runState === "inconclusive").length,
    }),
    [runs],
  );

  const filteredRuns =
    filter === "all" ? runs : runs.filter((run) => run.runState === filter);

  return (
    <div className="stack">
      {overviewLoading ? <p className="empty-state">Loading bounded demo overview…</p> : null}
      {overviewError ? <p className="error-state">{overviewError}</p> : null}
      {bundle && inputManifest && artifactManifest ? (
        <DemoOverviewPanel
          artifactManifest={artifactManifest}
          bundle={bundle}
          inputManifest={inputManifest}
        />
      ) : null}

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">View</p>
            <h2>Run Inbox</h2>
            <p className="muted">
              Filter by explicit demo run state. No state is inferred from empty arrays.
            </p>
          </div>
          <StatusBadge label={`${runs.length} runs`} tone="info" />
        </div>

        <div className="filter-bar">
          {(["all", "populated", "blocked", "zero_signal", "inconclusive"] as const).map(
            (value) => (
              <button
                className={`filter-chip${filter === value ? " is-active" : ""}`}
                key={value}
                onClick={() => setFilter(value)}
                type="button"
              >
                {value}
              </button>
            ),
          )}
        </div>

        <div className="counter-grid">
          <article className="counter-card">
            <span>populated</span>
            <strong>{counts.populated}</strong>
          </article>
          <article className="counter-card">
            <span>blocked</span>
            <strong>{counts.blocked}</strong>
          </article>
          <article className="counter-card">
            <span>zero_signal</span>
            <strong>{counts.zero_signal}</strong>
          </article>
          <article className="counter-card">
            <span>inconclusive</span>
            <strong>{counts.inconclusive}</strong>
          </article>
        </div>
      </section>

      {loading ? <p className="empty-state">Loading run inbox…</p> : null}
      {error ? <p className="error-state">{error}</p> : null}

      <div className="card-grid">
        {filteredRuns.map((run) => (
          <RunCard key={run.runId} run={run} />
        ))}
      </div>
    </div>
  );
}
