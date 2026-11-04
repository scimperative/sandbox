import { checkPlayDefinition } from '../../../core/play/testKit';
import { llmBitflipPlay } from './definition';

const checked = checkPlayDefinition(llmBitflipPlay, 5);
console.log(`llm-bitflip-resilience Play tests passed: ${checked} recomputed from the kernel.`);
