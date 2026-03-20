import type { ComparisonTextDelta, DemoComparison, SignalDiffEntry } from "./readModel";

export function formatDeltaValue(value: string | number) {
  if (typeof value === "number") {
    return String(value);
  }

  return value;
}

export function getSignalChangeLabel(entry: SignalDiffEntry) {
  switch (entry.changeType) {
    case "added":
      return "Added";
    case "removed":
      return "Removed";
    default:
      return "Changed";
  }
}

export function getDeltaTone(changeType: ComparisonTextDelta["changeType"]) {
  switch (changeType) {
    case "added":
      return "success";
    case "removed":
      return "danger";
    default:
      return "warning";
  }
}

export function hasMeaningfulDiffs(comparison: DemoComparison) {
  return (
    comparison.addedSignals.length > 0 ||
    comparison.removedSignals.length > 0 ||
    comparison.changedSignals.length > 0 ||
    comparison.contradictionDelta.length > 0 ||
    comparison.nextStepDelta.length > 0
  );
}
