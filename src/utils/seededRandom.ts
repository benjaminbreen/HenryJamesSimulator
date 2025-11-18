// Seeded random number generator for reproducible procedural generation
// Uses mulberry32 algorithm - fast, simple, high quality

export class SeededRandom {
  private state: number;

  constructor(seed: string) {
    // Convert string seed to number
    this.state = this.hashString(seed);
  }

  // Hash string to number for seed
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Generate next random number [0, 1)
  next(): number {
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Random integer in range [min, max]
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Random float in range [min, max)
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  // Random boolean with given probability (0-1)
  nextBool(probability: number = 0.5): boolean {
    return this.next() < probability;
  }

  // Pick random element from array
  choice<T>(array: T[]): T {
    if (array.length === 0) throw new Error('Cannot pick from empty array');
    return array[this.nextInt(0, array.length - 1)];
  }

  // Shuffle array (Fisher-Yates)
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  // Pick n random elements from array without replacement
  sample<T>(array: T[], n: number): T[] {
    if (n > array.length) throw new Error('Sample size larger than array');
    return this.shuffle(array).slice(0, n);
  }

  // Weighted random choice
  weightedChoice<T>(items: T[], weights: number[]): T {
    if (items.length !== weights.length) {
      throw new Error('Items and weights must have same length');
    }

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = this.next() * totalWeight;

    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) return items[i];
    }

    return items[items.length - 1];
  }

  // Generate UUID-like string
  uuid(): string {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars[this.nextInt(0, 15)];
      if ([8, 12, 16, 20].includes(i)) result += '-';
    }
    return result;
  }
}

// Utility function to create reproducible seed from player state
export function createGameSeed(baseSeed?: string): string {
  if (baseSeed) return baseSeed;

  // Create seed from timestamp + random element for new games
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `hj1889-${timestamp}-${random}`;
}
