import { ChallengeShell } from '../../../core/challenge/ChallengeShell';
import { llmBitflipChallenge } from './definition';

export function ChallengeGame() {
  return <ChallengeShell definition={llmBitflipChallenge} />;
}
