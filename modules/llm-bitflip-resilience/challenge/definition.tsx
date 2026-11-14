import { createElement, type ReactNode } from 'react';
import { BUILD_INFO } from '../../../core/buildInfo';
import type {
  ChallengeDefinition,
  ChallengeDifficulty,
  ChallengeEvaluation,
  ChallengeLevel,
} from '../../../core/challenge/types';
import { MODULE_RELEASE_VERSION } from '../version';
import { answerOptions, Formulas, Reveal, SpecCard } from './ChallengeParts';
import { CLASSIC_LEVELS } from './levels';
import { computeThreats, type ChallengeAnswer, type ThreatBreakdown } from './threats';
import { fmtNumber } from '../visualizer/format';

function difficultyForGap(gapPct: number): ChallengeDifficulty | 'mixed' {
  if (gapPct >= 200) return 'easy';
  if (gapPct >= 30 && gapPct <= 100) return 'medium';
  if (gapPct >= 10 && gapPct < 30) return 'hard';
  return 'mixed';
}

const classicLevels: ChallengeLevel<Record<string, number>>[] = CLASSIC_LEVELS.map((level) => {
  const evaluation = evaluate(level.inputs);
  return {
    id: level.id,
    title: level.title,
    lesson: level.lesson,
    inputs: level.inputs,
    difficulty: difficultyForGap(evaluation.gapPct),
    archetype: level.id,
    expectedAnswer: level.expectedAnswer,
  };
});

const randomArchetypes: Record<ChallengeAnswer, string[]> = {
  exposure: ['giant-store-cross-section', 'deep-space-flux-surge', 'dense-fleet-cluster-store'],
  scrub: ['infrequent-scrub-drift', 'unscrubbed-mission-tail', 'prolonged-drift-sublinear'],
  exponent: ['exponent-bit-disruption', 'multi-flip-exponent-risk', 'critical-exponent-cascade'],
};

const archetypeLessons: Record<string, string> = {
  'giant-store-cross-section': 'A large parameter count inflates the physical store cross-section, catching single-bit upsets at a high monthly rate.',
  'deep-space-flux-surge': 'Elevated radiation flux rapidly flips bits across physical RAM before other failure modes can emerge.',
  'dense-fleet-cluster-store': 'At massive model parameter scales, memory exposure is the overwhelming reliability bottleneck.',
  'infrequent-scrub-drift': 'Long scrub intervals allow Poisson upsets to accumulate and exceed the N50 survival threshold.',
  'unscrubbed-mission-tail': 'Infrequent weight refreshes compound cumulative errors until performance collapses.',
  'prolonged-drift-sublinear': 'Sublinear tolerance scaling means larger models cannot survive prolonged intervals without scrubbing.',
  'exponent-bit-disruption': 'Even a moderate injected dose causes exponent bit corruption, swinging weights wildly.',
  'multi-flip-exponent-risk': 'Accumulated injected flips guarantee exponent degradation regardless of parameter scaling.',
  'critical-exponent-cascade': 'Exponent-bit flips produce immense magnitude swings that dominate all other error patterns.',
};

function evaluate(inputs: Record<string, number>): ChallengeEvaluation {
  const threats = computeThreats(inputs);
  const formattedValues: Record<string, string> = {
    exposure: `${threats.exposureRate.toFixed(1)} flips/mo`,
    scrub: `${threats.scrubAccumulation.toFixed(1)} flips/int`,
    exponent: `${threats.exponentDisruptionPct.toFixed(1)} flips`,
  };

  return {
    answerId: threats.dominantThreat,
    values: {
      exposure: threats.exposureRate,
      scrub: threats.scrubAccumulation,
      exponent: threats.exponentDisruptionPct,
    },
    formattedValues,
    status: 'VALID',
    diagnostics: threats.result.diagnostics
      .filter((d) => d.key !== undefined || d.severity === 'error')
      .map((d) => d.message),
    gapPct: threats.gapPct,
    details: threats,
  };
}

function targetGapPct(rng: () => number, difficulty: ChallengeDifficulty, roundIndex: number): number {
  const progress = roundIndex / 9;
  if (difficulty === 'easy') {
    return 500 - progress * 280 - rng() * 5;
  }
  if (difficulty === 'medium') {
    return 95 - progress * 60 - rng() * 2;
  }
  return 28 - progress * 16 - rng() * 0.5;
}

function makeRandomLevel(
  rng: () => number,
  difficulty: ChallengeDifficulty,
  answer: ChallengeAnswer,
  archetype: string,
  roundIndex: number,
): ChallengeLevel<Record<string, number>> {
  const goal = targetGapPct(rng, difficulty, roundIndex);
  const inputs: Record<string, number> = {
    modelParamsBillions: 8.03,
    bytesPerParam: 2,
    upsetRateFlipsPerGbMonth: 1,
    scrubIntervalDays: 30,
    toleranceExponent: 0.32,
    injectedFlips: 2,
    eccEnabled: 0,
    mbuFraction: 0,
  };

  // Keep rounding precise enough so gapPct strictly decreases monotonically across rounds
  if (answer === 'exposure') {
    inputs.modelParamsBillions = 8.03;
    inputs.bytesPerParam = 2;
    inputs.scrubIntervalDays = 0.01;
    inputs.injectedFlips = 10; // exponent Threat = 3.125
    const secondThreat = 10 * (5 / 16);
    const targetExposure = secondThreat * (1 + goal / 100);
    const targetRate = targetExposure / (8.03 * 2);
    inputs.upsetRateFlipsPerGbMonth = parseFloat(targetRate.toFixed(4));
  } else if (answer === 'scrub') {
    inputs.modelParamsBillions = 8.03;
    inputs.upsetRateFlipsPerGbMonth = 0.2; // exposure = 3.212
    inputs.injectedFlips = 10; // exponent = 3.125
    const secondThreat = Math.max(0.2 * 16.06, 10 * (5 / 16));
    const targetScrubFlips = secondThreat * (1 + goal / 100);
    const targetDays = (targetScrubFlips * 30.4375) / (0.2 * 16.06);
    inputs.scrubIntervalDays = parseFloat(targetDays.toFixed(3));
  } else {
    inputs.modelParamsBillions = 8.03;
    inputs.upsetRateFlipsPerGbMonth = 0.2; // exposure = 3.212
    inputs.scrubIntervalDays = 0.05; // scrub is tiny
    const secondThreat = 0.2 * 16.06;
    const targetExpThreat = secondThreat * (1 + goal / 100);
    const targetFlips = targetExpThreat / (5 / 16);
    inputs.injectedFlips = parseFloat(targetFlips.toFixed(2));
  }

  const evaluation = evaluate(inputs);
  const labels: Record<string, string> = {
    exposure: 'Store Exposure',
    scrub: 'Scrub Accumulation',
    exponent: 'Exponent Vulnerability',
  };

  return {
    id: `${archetype}-${Math.floor(rng() * 36 ** 5).toString(36)}`,
    title: archetype.replaceAll('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    lesson: `Dominant threat is ${labels[evaluation.answerId]}. ${archetypeLessons[archetype]}`,
    inputs,
    difficulty,
    archetype,
    expectedAnswer: answer,
  };
}

function hints(
  _level: ChallengeLevel<Record<string, number>>,
  evaluation: ChallengeEvaluation,
): [
  { title: string; working: ReactNode },
  { title: string; working: ReactNode },
  { title: string; working: ReactNode },
] {
  const details = evaluation.details as ThreatBreakdown;

  return [
    {
      title: 'Examine memory footprint and interval length',
      working: createElement(
        'p',
        null,
        `Weight store size is ${details.result.values.memoryFootprintGb.toFixed(1)} GB. Scrub interval is ${details.result.resolvedInputs.scrubIntervalDays} days. Injected dose is ${details.result.resolvedInputs.injectedFlips} flips.`,
      ),
    },
    {
      title: 'Compare physical rate vs dose accumulation',
      working: createElement(
        'p',
        null,
        `Monthly exposure rate is ${details.exposureRate.toFixed(1)} flips/month. Scrub interval flip accumulation is ${details.scrubAccumulation.toFixed(1)} flips. Expected exponent bit corruptions: ${fmtNumber(details.exponentDisruptionPct, 2)}.`,
      ),
    },
    {
      title: 'Determine the primary vulnerability',
      working: createElement(
        'p',
        null,
        `Dominant threat is ${evaluation.answerId.toUpperCase()}: Store Exposure (${details.exposureRate.toFixed(1)} flips/mo), Scrub Accumulation (${details.scrubAccumulation.toFixed(1)} flips), Exponent Hits (${details.exponentDisruptionPct.toFixed(1)} flips).`,
      ),
    },
  ];
}

export const llmBitflipChallenge: ChallengeDefinition<Record<string, number>> = {
  id: 'llm-bitflip-resilience',
  title: 'What Limits Resilience?',
  versionInfo: `Silicon Carbide Imperative Sandbox v${BUILD_INFO.sandboxVersion} · llm-bitflip-resilience v${MODULE_RELEASE_VERSION}`,
  options: answerOptions,
  classicLevels,
  generate(rng, difficulty, context) {
    const answer = context.answerId as ChallengeAnswer;
    const available = randomArchetypes[answer].filter((a) => a !== context.avoidArchetype);
    const chosenArchetype = available.length > 0 ? available[Math.floor(rng() * available.length)] : randomArchetypes[answer][0];
    return makeRandomLevel(rng, difficulty, answer, chosenArchetype, context.roundIndex);
  },
  evaluate,
  hints,
  SpecCard,
  Reveal,
  Formulas,
  timeLimitsSeconds: { easy: 10 * 60, medium: 8 * 60, hard: 6 * 60 },
};
