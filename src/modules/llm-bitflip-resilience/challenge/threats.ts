import { llmBitflipResilience, type BitflipResult } from '../sandbox/module';

export type ChallengeAnswer = 'exposure' | 'scrub' | 'exponent';

export interface ThreatBreakdown {
  exposureRate: number; // raw flips per month = upsetRate * GB
  scrubAccumulation: number; // flips accumulated per scrub interval = lambdaFlips
  exponentDisruptionPct: number; // P(>= 1 exponent flip) as percentage
  dominantThreat: ChallengeAnswer;
  gapPct: number;
  result: BitflipResult;
}

/**
 * Evaluates the dominant resilience threat among three balanced loss/risk factors (in effective flips equivalent):
 * 1. exposure: monthly flip potential = upsetRate * footprintGb
 * 2. scrub: accumulation per scrub interval = lambdaFlips
 * 3. exponent: expected exponent flips in the injected dose = injectedFlips * (5/16)
 */
export function computeThreats(inputs: Record<string, number>): ThreatBreakdown {
  const result = llmBitflipResilience.run(inputs);
  const v = result.values;

  const exposureThreat = (inputs.upsetRateFlipsPerGbMonth ?? 1) * v.memoryFootprintGb;
  const scrubThreat = v.effectiveFlips;
  const exponentThreat = (inputs.injectedFlips ?? 0) * (5 / 16);

  const values: Record<ChallengeAnswer, number> = {
    exposure: exposureThreat,
    scrub: scrubThreat,
    exponent: exponentThreat,
  };

  const sorted = (Object.entries(values) as [ChallengeAnswer, number][]).sort((a, b) => b[1] - a[1]);
  const dominantThreat = sorted[0][0];
  const highest = sorted[0][1];
  const second = sorted[1][1];
  const gapPct = second > 0 ? ((highest - second) / second) * 100 : highest > 0 ? 100 : 0;

  return {
    exposureRate: exposureThreat,
    scrubAccumulation: scrubThreat,
    exponentDisruptionPct: exponentThreat,
    dominantThreat,
    gapPct,
    result,
  };
}
