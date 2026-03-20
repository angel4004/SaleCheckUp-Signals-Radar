import type { FeedbackActionType, FeedbackEvent } from "../lib/readModel";
import { ProvenanceChip } from "./ProvenanceChip";
import { StatusBadge } from "./StatusBadge";

interface FeedbackQueueListProps {
  events: FeedbackEvent[];
  actionFilter: FeedbackActionType | "all";
}

export function FeedbackQueueList({
  events,
  actionFilter,
}: FeedbackQueueListProps) {
  const filtered =
    actionFilter === "all"
      ? events
      : events.filter((event) => event.actionType === actionFilter);

  const groups = filtered.reduce<Record<string, FeedbackEvent[]>>(
    (accumulator, event) => {
      const key = event.runId;
      accumulator[key] = accumulator[key] ?? [];
      accumulator[key].push(event);
      return accumulator;
    },
    {},
  );

  const entries = Object.entries(groups);

  if (filtered.length === 0) {
    return <p className="empty-state">No local demo feedback events stored yet.</p>;
  }

  return (
    <div className="stack">
      {entries.map(([runId, runEvents]) => (
        <section className="panel" key={runId}>
          <div className="panel-header">
            <div>
              <p className="eyebrow">Grouped by run</p>
              <h2>{runId}</h2>
            </div>
            <StatusBadge
              label={`${runEvents.length} event${runEvents.length === 1 ? "" : "s"}`}
              tone="info"
            />
          </div>

          <div className="stack">
            {runEvents.map((event) => (
              <article className="subpanel" key={event.eventId}>
                <div className="panel-header">
                  <div>
                    <h3>{event.actionType}</h3>
                    <p className="muted">
                      scope: {event.targetScope}
                      {event.signalId ? ` · signal: ${event.signalId}` : ""}
                    </p>
                  </div>
                  <StatusBadge label={event.persistenceMode} tone="warning" />
                </div>
                <p className="muted">
                  created_at: {new Date(event.createdAt).toLocaleString()}
                </p>
                <p>{event.demoOnlyNote}</p>
                <ProvenanceChip provenance={event.provenance} />
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
