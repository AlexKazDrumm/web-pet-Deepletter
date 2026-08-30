import {
  analysisHistoryResponseSchema,
  analyzeResponseSchema,
  type AnalysisHistoryResponse,
  type AnalyzeResponse,
} from '@deepletter/shared';
import { apiBaseUrl } from './config';

export class ApiClientError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
  }
}

async function throwFromResponse(res: Response): Promise<never> {
  let code = 'HTTP_ERROR';
  let message = `Ошибка запроса (${res.status})`;
  try {
    const body = (await res.json()) as { error?: { code?: string; message?: string } };
    if (body?.error?.message) {
      message = body.error.message;
      code = body.error.code ?? code;
    }
  } catch {
    // тело не JSON — оставляем дефолтное сообщение
  }
  throw new ApiClientError(code, message);
}

export async function analyzeDocument(file: File): Promise<AnalyzeResponse> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${apiBaseUrl}/api/documents/analyze`, { method: 'POST', body: form });
  if (!res.ok) {
    await throwFromResponse(res);
  }
  return analyzeResponseSchema.parse(await res.json());
}

export async function getRecentAnalyses(limit = 5): Promise<AnalysisHistoryResponse> {
  const res = await fetch(`${apiBaseUrl}/api/documents/analyses?limit=${limit}`);
  if (!res.ok) {
    await throwFromResponse(res);
  }
  return analysisHistoryResponseSchema.parse(await res.json());
}
