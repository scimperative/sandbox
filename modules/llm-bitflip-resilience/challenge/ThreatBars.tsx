import { ValueBars } from '../../../core/ui';
import type { ChallengeEvaluation } from '../../../core/challenge/types';

export const THREAT_LABELS = [
  { id: 'exposure', label: 'Store Exposure' },
  { id: 'scrub', label: 'Scrub Accumulation' },
  { id: 'exponent', label: 'Exponent Vulnerability' },
];

export function ThreatBars({ evaluation }: { evaluation: ChallengeEvaluation }) {
  return (
    <ValueBars
      ariaLabel="Resilience threat levels"
      bars={THREAT_LABELS.map(({ id, label }) => ({
        id,
        label,
        value: evaluation.values[id],
        display: evaluation.formattedValues?.[id] ?? `${evaluation.values[id].toFixed(1)}%`,
      }))}
      bindingId={evaluation.answerId}
      bindingLabel="dominant threat"
    />
  );
}
