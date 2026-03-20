import type { Provenance } from "../lib/readModel";
import {
  sourceModeClassName,
  sourceModeLabel,
  summarizeProvenance,
} from "../lib/provenance";

interface ProvenanceChipProps {
  provenance: Provenance;
}

export function ProvenanceChip({ provenance }: ProvenanceChipProps) {
  return (
    <details
      className={`provenance-chip ${sourceModeClassName(provenance.sourceMode)}`}
    >
      <summary>{summarizeProvenance(provenance)}</summary>
      <div className="provenance-details">
        <p>
          <strong>Mode:</strong> {sourceModeLabel(provenance.sourceMode)}
        </p>
        <p>
          <strong>Generated:</strong>{" "}
          {new Date(provenance.generatedAt).toLocaleString()}
        </p>
        <p>
          <strong>Commit:</strong> {provenance.sourceCommit ?? "n/a"}
        </p>
        {provenance.notes ? (
          <p>
            <strong>Notes:</strong> {provenance.notes}
          </p>
        ) : null}
        <div>
          <strong>Refs:</strong>
          <ul className="list-compact">
            {provenance.sourceRefs.map((ref) => (
              <li key={ref}>{ref}</li>
            ))}
          </ul>
        </div>
      </div>
    </details>
  );
}
