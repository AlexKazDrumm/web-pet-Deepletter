import mammoth from 'mammoth';
import type { UploadFormat } from '@deepletter/shared';
import { AppError } from '../errors';

export async function extractText(format: UploadFormat, buffer: Buffer): Promise<string> {
  if (format === 'docx') {
    let value: string;
    try {
      const result = await mammoth.extractRawText({ buffer });
      value = result.value;
    } catch {
      throw AppError.badRequest('CORRUPT_DOCUMENT', 'Не удалось разобрать .docx');
    }
    const text = value.trim();
    if (!text) {
      throw AppError.badRequest('EMPTY_DOCUMENT', 'Документ не содержит текста');
    }
    return text;
  }

  const text = buffer.toString('utf-8').trim();
  if (!text) {
    throw AppError.badRequest('EMPTY_DOCUMENT', 'Документ не содержит текста');
  }
  return text;
}
