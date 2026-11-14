import { PlayShell } from '../../../core/play/PlayShell';
import { llmBitflipPlay } from './definition';

export function PlayGame() {
  return <PlayShell definition={llmBitflipPlay} />;
}
