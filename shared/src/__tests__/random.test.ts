import { describe, expect, it } from 'vitest';
import {
  buildAlphabet,
  generatePassword,
  randomDateBetween,
  randomInt,
  randomString,
  seededRandom,
} from '../random/index';

describe('seededRandom', () => {
  it('детерминирован для одного зерна', () => {
    const a = seededRandom(42);
    const b = seededRandom(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('выдаёт числа в диапазоне [0, 1)', () => {
    const rng = seededRandom(1);
    for (let i = 0; i < 1000; i += 1) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe('randomInt', () => {
  it('не выходит за границы диапазона', () => {
    const rng = seededRandom(7);
    for (let i = 0; i < 500; i += 1) {
      const value = randomInt(1, 6, rng);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(6);
      expect(Number.isInteger(value)).toBe(true);
    }
  });

  it('работает при перепутанных границах', () => {
    expect(randomInt(10, 10, seededRandom(1))).toBe(10);
  });

  it('бросает ошибку на пустом диапазоне', () => {
    expect(() => randomInt(5.1, 5.9, seededRandom(1))).toThrow(RangeError);
  });
});

describe('randomDateBetween', () => {
  it('возвращает дату внутри интервала', () => {
    const start = '2020-01-01T00:00:00.000Z';
    const end = '2020-12-31T23:59:59.000Z';
    const date = randomDateBetween(start, end, seededRandom(3));
    expect(date.getTime()).toBeGreaterThanOrEqual(new Date(start).getTime());
    expect(date.getTime()).toBeLessThanOrEqual(new Date(end).getTime());
  });

  it('бросает ошибку на некорректной дате', () => {
    expect(() => randomDateBetween('not-a-date', '2020-01-01', seededRandom(1))).toThrow(
      RangeError,
    );
  });
});

describe('buildAlphabet', () => {
  it('собирает пул из выбранных групп', () => {
    expect(buildAlphabet({ digits: true })).toBe('0123456789');
    expect(buildAlphabet({ upper: true, lower: true })).toHaveLength(52);
  });

  it('custom имеет приоритет и дедуплицируется', () => {
    expect(buildAlphabet({ upper: true, custom: 'aabbc' })).toBe('abc');
  });
});

describe('randomString / generatePassword', () => {
  it('строка нужной длины из заданного алфавита', () => {
    const value = randomString(32, 'ab', seededRandom(9));
    expect(value).toHaveLength(32);
    expect(/^[ab]+$/.test(value)).toBe(true);
  });

  it('generatePassword уважает длину и набор', () => {
    const pwd = generatePassword({ length: 16, alphabet: { digits: true } }, seededRandom(11));
    expect(pwd).toHaveLength(16);
    expect(/^[0-9]+$/.test(pwd)).toBe(true);
  });

  it('бросает ошибку на пустом алфавите или некорректной длине', () => {
    expect(() => randomString(8, '', seededRandom(1))).toThrow(RangeError);
    expect(() => randomString(0, 'abc', seededRandom(1))).toThrow(RangeError);
    expect(() => randomString(99999, 'abc', seededRandom(1))).toThrow(RangeError);
  });
});
