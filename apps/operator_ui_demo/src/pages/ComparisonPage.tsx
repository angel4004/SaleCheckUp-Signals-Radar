import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ComparisonDiff } from "../components/ComparisonDiff";
import type { DemoComparison } from "../lib/readModel";
import { loadComparison } from "../lib/readModel";

const seededPair = "phase0-validator-run-005__phase0-review-run-001";

export function ComparisonPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pairId = searchParams.get("pair") ?? seededPair;
  const [comparison, setComparison] = useState<DemoComparison | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pairId !== seededPair) {
      setSearchParams({ pair: seededPair }, { replace: true });
      return;
    }

    let active = true;

    loadComparison(pairId)
      .then((response) => {
        if (active) {
          setComparison(response);
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Failed to load comparison.");
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
  }, [pairId, setSearchParams]);

  return (
    <div className="stack">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">View</p>
            <h2>Comparison View</h2>
            <p className="muted">
              Precomputed comparison between runs. Partial sections are labeled
              explicitly when hybrid derivation was required.
            </p>
          </div>
        </div>

        <label className="field">
          <span>Comparison pair</span>
          <select
            value={pairId}
            onChange={(event) => setSearchParams({ pair: event.target.value })}
          >
            <option value={seededPair}>{seededPair}</option>
          </select>
        </label>
      </section>

      {loading ? <p className="empty-state">Loading comparison…</p> : null}
      {error ? <p className="error-state">{error}</p> : null}
      {comparison ? <ComparisonDiff comparison={comparison} /> : null}
    </div>
  );
}
