import { describe, expect, it } from 'vitest';
import { analyzeText } from '../text/statistics';

describe('analyzeText', () => {
  it('возвращает нули для пустой строки', () => {
    const stats = analyzeText('');
    expect(stats).toMatchObject({
      charCount: 0,
      wordCount: 0,
      sentenceCount: 0,
      paragraphCount: 0,
      uniqueWordCount: 0,
      longestWord: '',
      topWords: [],
    });
  });

  it('считает слова, предложения и абзацы для русского текста', () => {
    const text = 'Пример текста. Второе предложение!\n\nНовый абзац со словами.';
    const stats = analyzeText(text);
    expect(stats.wordCount).toBe(8);
    expect(stats.sentenceCount).toBe(3);
    expect(stats.paragraphCount).toBe(2);
  });

  it('считает уникальные слова без учёта регистра', () => {
    const stats = analyzeText('Кот кот КОТ пёс');
    expect(stats.wordCount).toBe(4);
    expect(stats.uniqueWordCount).toBe(2);
  });

  it('не считает пробелы в charCountNoSpaces', () => {
    const stats = analyzeText('a b  c');
    expect(stats.charCount).toBe(6);
    expect(stats.charCountNoSpaces).toBe(3);
  });

  it('находит самое длинное слово', () => {
    const stats = analyzeText('короткое длинношеее среднее');
    expect(stats.longestWord).toBe('длинношеее');
  });

  it('строит топ частотных слов по убыванию', () => {
    const stats = analyzeText('alpha alpha beta beta beta gamma');
    expect(stats.topWords[0]).toEqual({ word: 'beta', count: 3 });
    expect(stats.topWords[1]).toEqual({ word: 'alpha', count: 2 });
  });

  it('оценивает время чтения по 200 слов в минуту', () => {
    const words = Array.from({ length: 200 }, () => 'слово').join(' ');
    expect(analyzeText(words).readingTimeSeconds).toBe(60);
  });

  it('трактует текст без завершающих знаков как одно предложение', () => {
    const stats = analyzeText('текст без точки в конце');
    expect(stats.sentenceCount).toBe(1);
  });

  it('нормализует переводы строк CRLF', () => {
    const stats = analyzeText('первый\r\n\r\nвторой');
    expect(stats.paragraphCount).toBe(2);
  });
});
