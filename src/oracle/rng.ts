/** FNV-1a, 32 bit. Stable across runs and platforms — the seed must not drift. */
export function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 — small, fast, and good enough for choosing words. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rand = () => number;

export const pick = <T,>(rand: Rand, items: readonly T[]): T =>
  items[Math.floor(rand() * items.length)];

/** Weighted choice without replacement. Sharpening favours salient signals
 *  while leaving the quieter ones a real chance of being heard. */
export function pickWeighted<T>(
  rand: Rand,
  items: readonly T[],
  weightOf: (item: T) => number,
  sharpen = 2,
): T | undefined {
  if (!items.length) return undefined;
  const weights = items.map((i) => Math.pow(Math.max(weightOf(i), 1e-6), sharpen));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}
