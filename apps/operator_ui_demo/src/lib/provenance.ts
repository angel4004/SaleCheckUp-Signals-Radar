import type { Provenance, SourceMode } from "./readModel";

export function sourceModeLabel(sourceMode: SourceMode) {
  switch (sourceMode) {
    case "artifact_backed":
      return "Artifact-backed";
    case "hybrid":
      return "Hybrid";
    case "mock":
      return "Mock";
    default:
      return sourceMode;
  }
}

export function sourceModeClassName(sourceMode: SourceMode) {
  return `mode-${sourceMode}`;
}

export function summarizeProvenance(provenance: Provenance) {
  return `${sourceModeLabel(provenance.sourceMode)} · ${provenance.sourceRefs.length} ref${
    provenance.sourceRefs.length === 1 ? "" : "s"
  } · ${provenance.sourceCommit ? "commit pinned" : "no commit"}`;
}
