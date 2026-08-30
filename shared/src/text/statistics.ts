import { READING_WORDS_PER_MINUTE, type TextStatistics, type WordFrequency } from '../contracts';

const WORD_RE = /[\p{L}\p{N}]+(?:[-'’][\p{L}\p{N}]+)*/gu;
const SENTENCE_SPLIT_RE = /[.!?…]+(?=\s|$)/u;
const PARAGRAPH_SPLIT_RE = /\n[ \t]*\n/u;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function extractWords(text: string): string[] {
  return text.match(WORD_RE) ?? [];
}

function countSentences(text: string): number {
  const parts = text
    .split(SENTENCE_SPLIT_RE)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  if (parts.length > 0) {
    return parts.length;
  }
  return extractWords(text).length > 0 ? 1 : 0;
}

function countParagraphs(text: string): number {
  const parts = text
    .split(PARAGRAPH_SPLIT_RE)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  if (parts.length > 0) {
    return parts.length;
  }
  return text.trim().length > 0 ? 1 : 0;
}

function topWords(words: string[], limit = 10): WordFrequency[] {
  const counts = new Map<string, number>();
  for (const word of words) {
    const key = word.toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, limit);
}

export function analyzeText(input: string): TextStatistics {
  const text = input.replace(/\r\n?/gu, '\n');
  const words = extractWords(text);
  const wordCount = words.length;

  const chars = Array.from(text);
  const charCount = chars.length;
  const charCountNoSpaces = chars.filter((ch) => !/\s/u.test(ch)).length;

  const lowerWords = words.map((word) => word.toLowerCase());
  const uniqueWordCount = new Set(lowerWords).size;

  const totalWordLength = words.reduce((sum, word) => sum + Array.from(word).length, 0);
  const sentenceCount = countSentences(text);
  const paragraphCount = countParagraphs(text);

  let longestWord = '';
  for (const word of words) {
    if (Array.from(word).length > Array.from(longestWord).length) {
      longestWord = word;
    }
  }

  return {
    charCount,
    charCountNoSpaces,
    wordCount,
    sentenceCount,
    paragraphCount,
    uniqueWordCount,
    averageWordLength: wordCount === 0 ? 0 : round2(totalWordLength / wordCount),
    averageSentenceLengthWords: sentenceCount === 0 ? 0 : round2(wordCount / sentenceCount),
    readingTimeSeconds: Math.round((wordCount / READING_WORDS_PER_MINUTE) * 60),
    longestWord,
    topWords: topWords(words),
  };
}
