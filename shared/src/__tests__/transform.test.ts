import { describe, expect, it } from 'vitest';
import {
  changeCase,
  dedupeLines,
  normalizeWhitespace,
  quickCounts,
  removeEmptyLines,
  slugify,
  transliterate,
} from '../text/transform';

describe('changeCase', () => {
  it('UPPER и lower', () => {
    expect(changeCase('Привет Мир', 'upper')).toBe('ПРИВЕТ МИР');
    expect(changeCase('Привет Мир', 'lower')).toBe('привет мир');
  });

  it('Title Case поднимает первую букву каждого слова', () => {
    expect(changeCase('привет милый мир', 'title')).toBe('Привет Милый Мир');
  });

  it('Sentence case поднимает букву после точки', () => {
    expect(changeCase('привет. как дела? хорошо', 'sentence')).toBe('Привет. Как дела? Хорошо');
  });
});

describe('normalizeWhitespace', () => {
  it('схлопывает пробелы и лишние переводы строк', () => {
    expect(normalizeWhitespace('a   b\t\tc  \n\n\n\nd  ')).toBe('a b c\n\nd');
  });
});

describe('removeEmptyLines', () => {
  it('удаляет пустые строки', () => {
    expect(removeEmptyLines('one\n\n  \ntwo\n')).toBe('one\ntwo');
  });
});

describe('dedupeLines', () => {
  it('оставляет только первое вхождение строки', () => {
    expect(dedupeLines('a\nb\na\nc\nb')).toBe('a\nb\nc');
  });
});

describe('transliterate', () => {
  it('переводит кириллицу в латиницу с сохранением регистра', () => {
    expect(transliterate('Щука')).toBe('Shchuka');
    expect(transliterate('объезд')).toBe('obezd');
    expect(transliterate('Ёж и чаща')).toBe('Ezh i chashcha');
  });

  it('не трогает латиницу и цифры', () => {
    expect(transliterate('abc 123 -')).toBe('abc 123 -');
  });
});

describe('slugify', () => {
  it('строит url-совместимый идентификатор', () => {
    expect(slugify('Привет, мир! 2024')).toBe('privet-mir-2024');
  });
});

describe('quickCounts', () => {
  it('считает символы, слова и строки', () => {
    expect(quickCounts('раз два\nтри')).toEqual({ characters: 11, words: 3, lines: 2 });
    expect(quickCounts('')).toEqual({ characters: 0, words: 0, lines: 0 });
  });
});
