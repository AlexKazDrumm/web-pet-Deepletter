import { describe, expect, it } from 'vitest';
import { formatBytes, formatDuration, formatNumber } from '@/lib/format';

describe('formatBytes', () => {
  it('форматирует байты, килобайты и мегабайты', () => {
    expect(formatBytes(512)).toBe('512 Б');
    expect(formatBytes(2048)).toBe('2.0 КБ');
    expect(formatBytes(2 * 1024 * 1024)).toBe('2.0 МБ');
  });
});

describe('formatDuration', () => {
  it('секунды и минуты', () => {
    expect(formatDuration(45)).toBe('45 с');
    expect(formatDuration(60)).toBe('1 мин');
    expect(formatDuration(95)).toBe('1 мин 35 с');
  });
});

describe('formatNumber', () => {
  it('группирует разряды', () => {
    expect(formatNumber(1234567).replace(/\s/g, '_')).toBe('1_234_567');
  });
});
