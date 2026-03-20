import type { FeedbackActionType, FeedbackTargetScope } from "../lib/readModel";
import {
  createFeedbackEvent,
  getDemoOnlyNote,
  saveFeedbackEvent,
} from "../state/feedbackStore";

interface FeedbackActionsProps {
  runId: string;
  targetScope: FeedbackTargetScope;
  signalId?: string;
}

const signalActions: FeedbackActionType[] = [
  "mark_noise",
  "needs_more_evidence",
  "hold",
  "queue_next_run",
  "escalate_contradiction",
];

const runActions: FeedbackActionType[] = [
  "needs_more_evidence",
  "hold",
  "queue_next_run",
  "escalate_contradiction",
];

export function FeedbackActions({
  runId,
  targetScope,
  signalId,
}: FeedbackActionsProps) {
  const actions = targetScope === "signal" ? signalActions : runActions;

  function handleClick(actionType: FeedbackActionType) {
    saveFeedbackEvent(
      createFeedbackEvent({
        actionType,
        targetScope,
        runId,
        signalId,
      }),
    );
  }

  return (
    <section className="feedback-actions">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Feedback affordances</p>
          <h3>{targetScope === "signal" ? "Signal actions" : "Run actions"}</h3>
        </div>
      </div>

      <p className="muted">{getDemoOnlyNote()}</p>

      <div className="button-cluster">
        {actions.map((action) => (
          <button
            className="action-button"
            key={`${targetScope}-${action}-${signalId ?? runId}`}
            onClick={() => handleClick(action)}
            type="button"
          >
            {action}
          </button>
        ))}
      </div>
    </section>
  );
}
