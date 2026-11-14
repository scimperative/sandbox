import type { ChallengeEvaluation, ChallengeLevel } from '../../../core/challenge/types';
import { fmtNumber, fmtDays, fmtPct } from '../visualizer/format';
import { ThreatBars, THREAT_LABELS } from './ThreatBars';
import { FormulaLine } from './FormulaLine';
import type { ThreatBreakdown } from './threats';

export const answerOptions = THREAT_LABELS;

export function SpecCard({
  level,
}: {
  level: ChallengeLevel<Record<string, number>>;
  evaluation: ChallengeEvaluation;
}) {
  const inputs = level.inputs;
  return (
    <>
      <dl className="challenge-specs">
        <div className="challenge-spec">
          <dt>Model Parameters</dt>
          <dd>{fmtNumber(inputs.modelParamsBillions, 3)} B</dd>
        </div>
        <div className="challenge-spec">
          <dt>Bytes Per Parameter</dt>
          <dd>{inputs.bytesPerParam ?? 2} B</dd>
        </div>
        <div className="challenge-spec">
          <dt>Upset Rate</dt>
          <dd>{fmtNumber(inputs.upsetRateFlipsPerGbMonth ?? 1, 3)} flips/GB/mo</dd>
        </div>
        <div className="challenge-spec">
          <dt>Scrub Interval</dt>
          <dd>{fmtDays(inputs.scrubIntervalDays ?? 30)}</dd>
        </div>
        <div className="challenge-spec">
          <dt>Injected Dose</dt>
          <dd>{inputs.injectedFlips ?? 0} flips</dd>
        </div>
        <div className="challenge-spec">
          <dt>Tolerance Exponent α</dt>
          <dd>{(inputs.toleranceExponent ?? 0.32).toFixed(2)}</dd>
        </div>
      </dl>
      <details className="challenge-environment">
        <summary>System & Architecture Settings</summary>
        <dl>
          <div>
            <dt>SECDED ECC</dt>
            <dd>{inputs.eccEnabled ? 'Enabled' : 'Disabled'}</dd>
          </div>
          <div>
            <dt>MBU Fraction</dt>
            <dd>{fmtPct(inputs.mbuFraction ?? 0)}</dd>
          </div>
        </dl>
      </details>
    </>
  );
}

const challengeEquations = [
  {
    id: 'exposure-rate',
    label: 'Physical store exposure',
    latex: '\\mathrm{Exposure} = r \\cdot G = r \\cdot (N_{\\mathrm{params}} \\cdot b)',
    description: 'Rate of upsets accumulating in memory per unit time as a function of store size G and flux rate r.',
  },
  {
    id: 'scrub-accumulation',
    label: 'Scrub interval accumulation',
    latex: '\\lambda = r \\cdot G \\cdot T_{\\mathrm{scrub}}, \\quad \\text{Stress} = \\frac{\\lambda}{N_{50}}',
    description: 'Expected flips accumulating between scrubs relative to the model 50% survival tolerance threshold.',
  },
  {
    id: 'exponent-probability',
    label: 'Exponent hit probability',
    latex: 'P(\\ge 1\\ \\text{exponent flip}) = 1 - \\left(\\frac{11}{16}\\right)^N',
    description: 'Probability that at least one injected flip strikes an exponent bit (which swings weights by up to 65,536x).',
  },
];

export function Formulas() {
  return (
    <section className="challenge-formulas">
      <h3>Resilience Threat Reference</h3>
      {challengeEquations.map((equation) => (
        <section key={equation.id}>
          <strong>{equation.label}</strong>
          <FormulaLine latex={equation.latex} />
          <p>{equation.description}</p>
        </section>
      ))}
    </section>
  );
}

export function Reveal({
  level,
  evaluation,
  selectedAnswer,
  correct,
}: {
  level: ChallengeLevel<Record<string, number>>;
  evaluation: ChallengeEvaluation;
  selectedAnswer: string | null;
  correct: boolean;
}) {
  const details = evaluation.details as ThreatBreakdown;
  const labels: Record<string, string> = {
    exposure: 'Store Exposure',
    scrub: 'Scrub Accumulation',
    exponent: 'Exponent Vulnerability',
  };

  return (
    <section className="challenge-reveal-card">
      <div className="challenge-result-status">
        <div>
          <h2>{correct ? 'Correct' : 'Not quite'}</h2>
          <p>
            Your answer: <strong>{labels[selectedAnswer ?? ''] ?? 'Unanswered'}</strong>. Dominant threat:{' '}
            <strong>{labels[evaluation.answerId]}</strong>.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Store Size</span>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-h)' }}>
            {details.result.values.memoryFootprintGb.toFixed(1)} GB
          </div>
        </div>
      </div>

      <ThreatBars evaluation={evaluation} />

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', margin: '6px 0 10px' }}>
        <span>Accumulated Dose: {details.scrubAccumulation.toFixed(1)} flips</span>
        <span>P(Exponent Hit): {details.exponentDisruptionPct.toFixed(1)}%</span>
      </div>

      <p className="challenge-lesson">{level.lesson}</p>
    </section>
  );
}
