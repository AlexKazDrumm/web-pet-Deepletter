import type {
  AnalysisHistoryItem,
  DocumentAnalysis,
  TextStatistics,
  UploadFormat,
} from '@deepletter/shared';
import { query } from './pool';

export interface NewAnalysisRecord {
  sourceFormat: UploadFormat;
  sizeBytes: number;
  statistics: TextStatistics;
}

export interface AnalysisRepository {
  insert(record: NewAnalysisRecord): Promise<DocumentAnalysis>;
  listRecent(limit: number): Promise<AnalysisHistoryItem[]>;
}

interface AnalysisRow {
  id: string;
  source_format: UploadFormat;
  size_bytes: number;
  char_count: number;
  char_count_no_spaces: number;
  word_count: number;
  sentence_count: number;
  paragraph_count: number;
  unique_word_count: number;
  average_word_length: string | number;
  average_sentence_length_words: string | number;
  reading_time_seconds: number;
  longest_word: string;
  top_words: unknown;
  created_at: Date;
}

function toStatistics(row: AnalysisRow): TextStatistics {
  return {
    charCount: row.char_count,
    charCountNoSpaces: row.char_count_no_spaces,
    wordCount: row.word_count,
    sentenceCount: row.sentence_count,
    paragraphCount: row.paragraph_count,
    uniqueWordCount: row.unique_word_count,
    averageWordLength: Number(row.average_word_length),
    averageSentenceLengthWords: Number(row.average_sentence_length_words),
    readingTimeSeconds: row.reading_time_seconds,
    longestWord: row.longest_word,
    topWords: Array.isArray(row.top_words) ? (row.top_words as TextStatistics['topWords']) : [],
  };
}

export const pgAnalysisRepository: AnalysisRepository = {
  async insert(record) {
    const s = record.statistics;
    const result = await query<AnalysisRow>(
      `INSERT INTO document_analyses (
         source_format, size_bytes, char_count, char_count_no_spaces, word_count,
         sentence_count, paragraph_count, unique_word_count, average_word_length,
         average_sentence_length_words, reading_time_seconds, longest_word, top_words
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [
        record.sourceFormat,
        record.sizeBytes,
        s.charCount,
        s.charCountNoSpaces,
        s.wordCount,
        s.sentenceCount,
        s.paragraphCount,
        s.uniqueWordCount,
        s.averageWordLength,
        s.averageSentenceLengthWords,
        s.readingTimeSeconds,
        s.longestWord,
        JSON.stringify(s.topWords),
      ],
    );
    const row = result.rows[0];
    if (!row) {
      throw new Error('INSERT document_analyses не вернул строку');
    }
    return {
      id: row.id,
      sourceFormat: row.source_format,
      sizeBytes: row.size_bytes,
      createdAt: row.created_at.toISOString(),
      statistics: toStatistics(row),
    };
  },

  async listRecent(limit) {
    const result = await query<AnalysisRow>(
      `SELECT id, source_format, size_bytes, word_count, char_count, reading_time_seconds, created_at
       FROM document_analyses
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit],
    );
    return result.rows.map((row) => ({
      id: row.id,
      sourceFormat: row.source_format,
      sizeBytes: row.size_bytes,
      wordCount: row.word_count,
      charCount: row.char_count,
      readingTimeSeconds: row.reading_time_seconds,
      createdAt: row.created_at.toISOString(),
    }));
  },
};
