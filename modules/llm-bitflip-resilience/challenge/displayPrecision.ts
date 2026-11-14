function roundStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export function roundForDisplay(key: string, value: number): number {
  if (key === 'modelParamsBillions') return roundStep(value, 0.01);
  if (key === 'bytesPerParam') return roundStep(value, 0.5);
  if (key === 'upsetRateFlipsPerGbMonth') return roundStep(value, value < 1 ? 0.01 : value < 10 ? 0.1 : 1);
  if (key === 'scrubIntervalDays') return roundStep(value, value < 1 ? 0.1 : 1);
  if (key === 'toleranceExponent') return roundStep(value, 0.01);
  if (key === 'injectedFlips') return Math.round(value);
  if (key === 'mbuFraction') return roundStep(value, 0.01);
  return value;
}
