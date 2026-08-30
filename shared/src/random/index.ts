export type RandomSource = () => number;

export function seededRandom(seed: number): RandomSource {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const ALPHABETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/',
} as const;

export interface AlphabetOptions {
  upper?: boolean;
  lower?: boolean;
  digits?: boolean;
  symbols?: boolean;
  custom?: string;
}

export function buildAlphabet(options: AlphabetOptions): string {
  if (options.custom && options.custom.length > 0) {
    return [...new Set(options.custom)].join('');
  }
  let pool = '';
  if (options.upper) pool += ALPHABETS.upper;
  if (options.lower) pool += ALPHABETS.lower;
  if (options.digits) pool += ALPHABETS.digits;
  if (options.symbols) pool += ALPHABETS.symbols;
  return pool;
}

export function randomInt(min: number, max: number, rng: RandomSource = Math.random): number {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new RangeError('Границы диапазона должны быть числами');
  }
  const lo = Math.ceil(Math.min(min, max));
  const hi = Math.floor(Math.max(min, max));
  if (lo > hi) {
    throw new RangeError('Пустой диапазон целых чисел');
  }
  return lo + Math.floor(rng() * (hi - lo + 1));
}

export function randomDateBetween(
  startIso: string,
  endIso: string,
  rng: RandomSource = Math.random,
): Date {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) {
    throw new RangeError('Некорректная дата');
  }
  const lo = Math.min(start, end);
  const hi = Math.max(start, end);
  return new Date(lo + Math.floor(rng() * (hi - lo + 1)));
}

export function randomString(
  length: number,
  alphabet: string,
  rng: RandomSource = Math.random,
): string {
  if (!Number.isInteger(length) || length <= 0) {
    throw new RangeError('Длина должна быть положительным целым числом');
  }
  if (length > 4096) {
    throw new RangeError('Длина не может превышать 4096');
  }
  if (alphabet.length === 0) {
    throw new RangeError('Пустой набор символов');
  }
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += alphabet.charAt(Math.floor(rng() * alphabet.length));
  }
  return out;
}

export interface PasswordOptions {
  length: number;
  alphabet: AlphabetOptions;
}

export function generatePassword(
  options: PasswordOptions,
  rng: RandomSource = Math.random,
): string {
  const pool = buildAlphabet(options.alphabet);
  return randomString(options.length, pool, rng);
}
