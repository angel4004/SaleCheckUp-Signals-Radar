import type {
  FeedbackActionType,
  FeedbackEvent,
  FeedbackTargetScope,
} from "../lib/readModel";

export const FEEDBACK_STORAGE_KEY = "salecheckup.operator_ui_demo.feedback.v0";
const FEEDBACK_CHANGE_EVENT = "operator-ui-demo-feedback-changed";
const DEMO_ONLY_NOTE =
  "Local demo action only. Not yet wired to runtime or governance.";

function readStorage(): FeedbackEvent[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(FEEDBACK_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as FeedbackEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(events: FeedbackEvent[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(events));
  window.dispatchEvent(new CustomEvent(FEEDBACK_CHANGE_EVENT));
}

export function loadFeedbackEvents() {
  return readStorage().sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
}

export function createFeedbackEvent(input: {
  actionType: FeedbackActionType;
  targetScope: FeedbackTargetScope;
  runId: string;
  signalId?: string;
}): FeedbackEvent {
  const createdAt = new Date().toISOString();

  return {
    eventId: `feedback-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    actionType: input.actionType,
    targetScope: input.targetScope,
    runId: input.runId,
    signalId: input.signalId,
    createdAt,
    persistenceMode: "local_demo_localStorage",
    demoOnlyNote: DEMO_ONLY_NOTE,
    provenance: {
      sourceMode: "mock",
      sourceRefs: ["browser:localStorage"],
      sourceCommit: null,
      generatedAt: createdAt,
      notes: "Locally generated operator demo action.",
    },
  };
}

export function saveFeedbackEvent(event: FeedbackEvent) {
  const current = readStorage();
  writeStorage([event, ...current]);
  return event;
}

export function subscribeToFeedbackEvents(listener: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = () => listener();
  window.addEventListener(FEEDBACK_CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(FEEDBACK_CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function getDemoOnlyNote() {
  return DEMO_ONLY_NOTE;
}
