import { BUILD_INFO } from '../../../core/buildInfo';
import { scaleLever, stepLever, type LeverSpec } from '../../../core/play/levers';
import type { PlayDefinition, PlayEvaluation } from '../../../core/play/types';
import { INPUT_SPECS, llmBitflipResilience } from '../sandbox/module';
import { MODULE_RELEASE_VERSION } from '../version';
import { fmtDays } from '../visualizer/format';
import { CLASSIC_LEVELS } from '../challenge/levels';

function spec(key: string): LeverSpec {
  const found = INPUT_SPECS.find((input) => input.key === key);
  if (!found || found.min === undefined || found.max === undefined) throw new Error(`Play: unknown input ${key}`);
  return { key, label: found.label, unit: found.unit, min: found.min, max: found.max };
}

function evaluate(inputs: Record<string, number>): PlayEvaluation {
  const result = llmBitflipResilience.run(inputs);
  return {
    value: result.values.t50Days,
    rejected: result.diagnostics.some((item) => item.severity === 'error' || item.key !== undefined),
  };
}

export const llmBitflipPlay: PlayDefinition = {
  id: 'llm-bitflip-resilience',
  title: 'LLM Bit-Flip Resilience & Retention',
  versionInfo: `Silicon Carbide Imperative Sandbox v${BUILD_INFO.sandboxVersion} · llm-bitflip-resilience v${MODULE_RELEASE_VERSION}`,
  metricLabel: 'mean time to 50% tolerance (t50)',
  intro: 'Mean time to 50% tolerance is set by the model threshold divided by the accumulation rate over the exposed memory. Two architectural changes are offered to the same model. Tap the one that extends survival longer.',
  format: (value) => fmtDays(value),
  scenarios: CLASSIC_LEVELS.map(({ id, title, inputs }) => ({ id, title: title.replace(/^Level \d+: /, ''), inputs })),
  evaluate,
  inputInfo: INPUT_SPECS.map(({ key, label, unit }) => ({ key, label, unit })),
  levers: [
    scaleLever(spec('scrubIntervalDays'), [0.2, 0.5],
      'Frequent weight scrubbing clears accumulated upsets before they can threaten model inference accuracy.'),
    scaleLever(spec('upsetRateFlipsPerGbMonth'), [0.2, 0.6],
      'Lower radiation flux directly reduces the arrival frequency of memory single-event upsets.'),
    scaleLever(spec('bytesPerParam'), [0.5, 0.75],
      'Lowering bytes per weight reduces the memory footprint that radiation particles can strike.'),
    stepLever(spec('eccEnabled'), [1, 1],
      'SECDED ECC corrects single-bit errors in memory words, dramatically delaying failure.'),
    scaleLever(spec('toleranceExponent'), [1.1, 1.4],
      'A higher scaling exponent alpha gives larger models more intrinsic per-parameter error tolerance.'),
  ],
};
