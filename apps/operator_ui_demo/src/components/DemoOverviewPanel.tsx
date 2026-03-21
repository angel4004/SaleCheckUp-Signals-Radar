import { Link } from "react-router-dom";
import type {
  BoundedDemoInputManifest,
  DemoArtifactManifest,
  EndToEndDemoBundle,
} from "../lib/readModel";
import { sourceModeTone } from "../lib/provenance";
import { StatusBadge } from "./StatusBadge";

interface DemoOverviewPanelProps {
  bundle: EndToEndDemoBundle;
  inputManifest: BoundedDemoInputManifest;
  artifactManifest: DemoArtifactManifest;
}

export function DemoOverviewPanel({
  bundle,
  inputManifest,
  artifactManifest,
}: DemoOverviewPanelProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Demo overview</p>
          <h2>Bounded input to operator-visible insight</h2>
          <p className="muted">{bundle.boundedInputSummary}</p>
        </div>
        <StatusBadge label={bundle.chosenAnchorRunId} tone="success" />
      </div>

      <dl className="stat-grid">
        <div>
          <dt>bounded_input_id</dt>
          <dd>{inputManifest.inputId}</dd>
        </div>
        <div>
          <dt>chosen_anchor_run_id</dt>
          <dd>{bundle.chosenAnchorRunId}</dd>
        </div>
        <div>
          <dt>comparison_pair</dt>
          <dd>{bundle.chosenComparisonPairId}</dd>
        </div>
        <div>
          <dt>artifact_count</dt>
          <dd>{artifactManifest.artifacts.length}</dd>
        </div>
      </dl>

      <div className="two-column">
        <article className="subpanel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Bounded input</p>
              <h3>{inputManifest.inputPath}</h3>
            </div>
            <StatusBadge label={inputManifest.modelId} tone="info" />
          </div>
          <p>{inputManifest.runGoal}</p>
          <p className="muted">{inputManifest.currentHypothesis}</p>
          <p>
            <strong>bounded_input_summary:</strong> {inputManifest.boundedInputSummary}
          </p>
          <ul className="list-compact">
            {inputManifest.constraints.map((constraint) => (
              <li key={constraint}>{constraint}</li>
            ))}
          </ul>
        </article>

        <article className="subpanel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Projection/build summary</p>
              <h3>Explicit demo-side bundle materialization</h3>
            </div>
            <StatusBadge label="rebuildable" tone="success" />
          </div>
          <p>
            <strong>projection_command:</strong> <code>{bundle.projectionCommand}</code>
          </p>
          <p>
            <strong>read_model_build_command:</strong>{" "}
            <code>{bundle.readModelBuildCommand}</code>
          </p>
          <p>
            <strong>chosen_artifact_anchor_refs:</strong>
          </p>
          <ul className="list-compact">
            {bundle.chosenArtifactAnchorRefs.map((ref) => (
              <li key={ref}>{ref}</li>
            ))}
          </ul>
        </article>
      </div>

      <section className="stack">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Flow steps</p>
            <h3>{"Input -> run contour -> projection -> UI"}</h3>
          </div>
        </div>
        <div className="stage-grid">
          {bundle.flowSteps.map((step) => (
            <article className="subpanel" key={step.stepId}>
              <div className="panel-header">
                <div>
                  <p className="eyebrow">{step.objectType}</p>
                  <h3>{step.label}</h3>
                </div>
                <StatusBadge
                  label={step.materializationMode}
                  tone={sourceModeTone(step.materializationMode)}
                />
              </div>
              <p className="muted">{step.objectId}</p>
              <p>{step.summary}</p>
              <p className="muted">
                state: {step.state}
                {step.uiRoute ? ` · ui_route: ${step.uiRoute}` : ""}
              </p>
              <p className="muted">{step.note}</p>
              <ul className="list-compact">
                {step.sourceArtifactRefs.map((ref) => (
                  <li key={ref}>{ref}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <div className="two-column">
        <article className="subpanel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Legend</p>
              <h3>artifact_backed / hybrid / mock</h3>
            </div>
          </div>
          <div className="stack">
            {bundle.materializationLegend.map((entry) => (
              <article className="subpanel compact" key={entry.key}>
                <div className="panel-header">
                  <h3>{entry.label}</h3>
                  <StatusBadge
                    label={entry.key}
                    tone={sourceModeTone(entry.key as "artifact_backed" | "hybrid" | "mock")}
                  />
                </div>
                <p className="muted">{entry.meaning}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="subpanel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Legend</p>
              <h3>Run state semantics</h3>
            </div>
          </div>
          <div className="stack">
            {bundle.runStateLegend.map((entry) => (
              <article className="subpanel compact" key={entry.key}>
                <div className="panel-header">
                  <h3>{entry.label}</h3>
                  <StatusBadge label={entry.key} tone="info" />
                </div>
                <p className="muted">{entry.meaning}</p>
              </article>
            ))}
          </div>
        </article>
      </div>

      <div className="two-column">
        <article className="subpanel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Local walkthrough</p>
              <h3>Relevant routes</h3>
            </div>
          </div>
          <div className="action-row">
            <Link className="button-link" to={bundle.primaryRunRoute}>
              Open chosen run
            </Link>
            <Link className="button-link secondary" to={bundle.comparisonRoute}>
              Open comparison
            </Link>
            <Link className="button-link secondary" to={bundle.feedbackRoute}>
              Open feedback queue
            </Link>
          </div>
          <ul className="list-compact">
            {bundle.completionCriteria.map((criterion) => (
              <li key={criterion}>{criterion}</li>
            ))}
          </ul>
        </article>

        <article className="subpanel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Generated outputs</p>
              <h3>UI-readable bundle files</h3>
            </div>
          </div>
          <ul className="list-compact">
            {bundle.buildOutputs.map((output) => (
              <li key={output}>{output}</li>
            ))}
          </ul>
          {bundle.assumptions.length > 0 ? (
            <>
              <p>
                <strong>Assumptions made:</strong>
              </p>
              <ul className="list-compact">
                {bundle.assumptions.map((assumption) => (
                  <li key={assumption}>{assumption}</li>
                ))}
              </ul>
            </>
          ) : null}
        </article>
      </div>
    </section>
  );
}
