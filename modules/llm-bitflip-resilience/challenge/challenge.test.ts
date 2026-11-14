import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { generateRandomRun } from '../../../core/challenge/generator';
import { llmBitflipChallenge } from './definition';
import { CLASSIC_LEVELS } from './levels';

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

// 1. Verify Classic Levels
for (const [index, level] of CLASSIC_LEVELS.entries()) {
  const evaluation = llmBitflipChallenge.evaluate(level.inputs);
  const label = `Classic level ${index + 1} (${level.id})`;
  assert(evaluation.answerId === level.expectedAnswer, `${label}: answer ${evaluation.answerId} must match expectation ${level.expectedAnswer}`);
  assert(evaluation.gapPct >= 10, `${label}: gap should be >= 10%, got ${evaluation.gapPct}%`);
}

// 2. Hint rendering test
const firstClassic = llmBitflipChallenge.classicLevels[0];
const evaluation = llmBitflipChallenge.evaluate(firstClassic.inputs);
const hintMarkup = renderToStaticMarkup(createElement('div', null, ...llmBitflipChallenge.hints(firstClassic, evaluation).map((h) => h.working)));
assert(hintMarkup.includes('Weight store size'), 'Hint markup should contain store size info');

// 3. Random Generation Test
for (const difficulty of ['easy', 'medium', 'hard'] as const) {
  const { levels } = generateRandomRun(llmBitflipChallenge, 'TESTSEED1', difficulty);
  assert(levels.length === 10, `Generated run should produce 10 levels for ${difficulty}`);
  for (const level of levels) {
    const evalResult = llmBitflipChallenge.evaluate(level.inputs);
    assert(evalResult.answerId !== undefined, 'Evaluation should produce a valid answer');
  }
}

console.log('llm-bitflip-resilience challenge tests passed successfully.');
