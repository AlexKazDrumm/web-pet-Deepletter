import { z } from 'zod';

export const UPLOAD_FORMATS = ['docx', 'txt', 'md'] as const;
export type UploadFormat = (typeof UPLOAD_FORMATS)[number];

export const DEFAULT_MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const READING_WORDS_PER_MINUTE = 200;

export const UPLOAD_MIME_BY_FORMAT: Record<UploadFormat, readonly string[]> = {
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  txt: ['text/plain'],
  md: ['text/markdown', 'text/x-markdown', 'text/plain'],
};

export const toolSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  category: z.string().min(1),
  href: z.string().min(1),
  sortOrder: z.number().int(),
});
export type Tool = z.infer<typeof toolSchema>;

export const toolListResponseSchema = z.object({
  tools: z.array(toolSchema),
});
export type ToolListResponse = z.infer<typeof toolListResponseSchema>;

export const wordFrequencySchema = z.object({
  word: z.string(),
  count: z.number().int().nonnegative(),
});
export type WordFrequency = z.infer<typeof wordFrequencySchema>;

export const textStatisticsSchema = z.object({
  charCount: z.number().int().nonnegative(),
  charCountNoSpaces: z.number().int().nonnegative(),
  wordCount: z.number().int().nonnegative(),
  sentenceCount: z.number().int().nonnegative(),
  paragraphCount: z.number().int().nonnegative(),
  uniqueWordCount: z.number().int().nonnegative(),
  averageWordLength: z.number().nonnegative(),
  averageSentenceLengthWords: z.number().nonnegative(),
  readingTimeSeconds: z.number().int().nonnegative(),
  longestWord: z.string(),
  topWords: z.array(wordFrequencySchema),
});
export type TextStatistics = z.infer<typeof textStatisticsSchema>;

export const documentAnalysisSchema = z.object({
  id: z.string().uuid(),
  sourceFormat: z.enum(UPLOAD_FORMATS),
  sizeBytes: z.number().int().nonnegative(),
  createdAt: z.string(),
  statistics: textStatisticsSchema,
});
export type DocumentAnalysis = z.infer<typeof documentAnalysisSchema>;

export const analyzeResponseSchema = z.object({
  analysis: documentAnalysisSchema,
});
export type AnalyzeResponse = z.infer<typeof analyzeResponseSchema>;

export const analysisHistoryItemSchema = z.object({
  id: z.string().uuid(),
  sourceFormat: z.enum(UPLOAD_FORMATS),
  sizeBytes: z.number().int().nonnegative(),
  wordCount: z.number().int().nonnegative(),
  charCount: z.number().int().nonnegative(),
  readingTimeSeconds: z.number().int().nonnegative(),
  createdAt: z.string(),
});
export type AnalysisHistoryItem = z.infer<typeof analysisHistoryItemSchema>;

export const analysisHistoryResponseSchema = z.object({
  items: z.array(analysisHistoryItemSchema),
});
export type AnalysisHistoryResponse = z.infer<typeof analysisHistoryResponseSchema>;

export const historyQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
export type HistoryQuery = z.infer<typeof historyQuerySchema>;

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});
export type ApiError = z.infer<typeof apiErrorSchema>;

export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  uptimeSeconds: z.number().nonnegative(),
});
export type HealthResponse = z.infer<typeof healthResponseSchema>;
