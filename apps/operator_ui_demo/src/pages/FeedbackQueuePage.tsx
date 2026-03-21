import { useEffect, useMemo, useState } from "react";
import { FeedbackQueueList } from "../components/FeedbackQueueList";
import { LineagePanel } from "../components/LineagePanel";
import type {
  EndToEndProvenanceManifest,
  FeedbackActionType,
  FeedbackEvent,
} from "../lib/readModel";
import {
  loadEndToEndProvenanceManifest,
  loadRunsIndex,
} from "../lib/readModel";
import {
  loadFeedbackEvents,
  subscribeToFeedbackEvents,
} from "../state/feedbackStore";

type ActionFilter = FeedbackActionType | "all";

const actions: ActionFilter[] = [
  "all",
  "mark_noise",
  "needs_more_evidence",
  "hold",
  "queue_next_run",
  "escalate_contradiction",
];

export function FeedbackQueuePage() {
  const [events, setEvents] = useState<FeedbackEvent[]>([]);
  const [provenanceManifest, setProvenanceManifest] =
    useState<EndToEndProvenanceManifest | null>(null);
  const [actionFilter, setActionFilter] = useState<ActionFilter>("all");
  const [runCount, setRunCount] = useState(0);

  useEffect(() => {
    setEvents(loadFeedbackEvents());

    return subscribeToFeedbackEvents(() => {
      setEvents(loadFeedbackEvents());
    });
  }, []);

  useEffect(() => {
    let active = true;

    loadEndToEndProvenanceManifest()
      .then((response) => {
        if (active) {
          setProvenanceManifest(response);
        }
      })
      .catch(() => {
        if (active) {
          setProvenanceManifest(null);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    loadRunsIndex()
      .then((response) => {
        if (active) {
          setRunCount(response.runs.length);
        }
      })
      .catch(() => {
        if (active) {
          setRunCount(0);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredCount = useMemo(() => {
    return actionFilter === "all"
      ? events.length
      : events.filter((event) => event.actionType === actionFilter).length;
  }, [actionFilter, events]);

  return (
    <div className="stack">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">View</p>
            <h2>Feedback Queue</h2>
            <p className="muted">
              Local demo queue only. Persistence mode is browser `localStorage`.
            </p>
          </div>
        </div>

        <dl className="stat-grid">
          <div>
            <dt>persistence_mode</dt>
            <dd>local_demo_localStorage</dd>
          </div>
          <div>
            <dt>stored_events</dt>
            <dd>{events.length}</dd>
          </div>
          <div>
            <dt>filtered_events</dt>
            <dd>{filteredCount}</dd>
          </div>
          <div>
            <dt>seeded_runs</dt>
            <dd>{runCount}</dd>
          </div>
        </dl>

        <div className="filter-bar">
          {actions.map((action) => (
            <button
              className={`filter-chip${actionFilter === action ? " is-active" : ""}`}
              key={action}
              onClick={() => setActionFilter(action)}
              type="button"
            >
              {action}
            </button>
          ))}
        </div>
      </section>

      {provenanceManifest?.entries.feedback["feedback-local"] ? (
        <LineagePanel
          entry={provenanceManifest.entries.feedback["feedback-local"]}
          eyebrow="Mock zone"
          title="Why feedback stays demo-only"
        />
      ) : null}

      <FeedbackQueueList actionFilter={actionFilter} events={events} />
    </div>
  );
}
