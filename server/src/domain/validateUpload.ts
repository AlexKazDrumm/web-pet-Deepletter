import { UPLOAD_FORMATS, UPLOAD_MIME_BY_FORMAT, type UploadFormat } from '@deepletter/shared';
import { AppError } from '../errors';

const EXT_TO_FORMAT: Record<string, UploadFormat> = {
  '.docx': 'docx',
  '.txt': 'txt',
  '.md': 'md',
  '.markdown': 'md',
};

const ZIP_SIGNATURE = Buffer.from([0x50, 0x4b, 0x03, 0x04]);

export interface ValidatedUpload {
  format: UploadFormat;
  buffer: Buffer;
}

export function detectFormat(originalName: string, mimeType: string): UploadFormat {
  const lower = originalName.toLowerCase();
  const dot = lower.lastIndexOf('.');
  const ext = dot >= 0 ? lower.slice(dot) : '';
  const format = EXT_TO_FORMAT[ext];
  if (!format) {
    throw AppError.badRequest(
      'UNSUPPORTED_FORMAT',
      `Расширение файла не поддерживается. Разрешены: ${UPLOAD_FORMATS.join(', ')}`,
    );
  }
  const allowedMimes = UPLOAD_MIME_BY_FORMAT[format];
  // Браузеры нередко отдают application/octet-stream для .docx — это допустимо.
  if (mimeType && mimeType !== 'application/octet-stream' && !allowedMimes.includes(mimeType)) {
    throw AppError.badRequest(
      'UNSUPPORTED_FORMAT',
      `MIME-тип "${mimeType}" не соответствует расширению .${format}`,
    );
  }
  return format;
}

export function verifySignature(format: UploadFormat, buffer: Buffer): void {
  if (buffer.length === 0) {
    throw AppError.badRequest('EMPTY_DOCUMENT', 'Файл пустой');
  }
  if (format === 'docx') {
    if (!buffer.subarray(0, 4).equals(ZIP_SIGNATURE)) {
      throw AppError.badRequest(
        'CORRUPT_DOCUMENT',
        'Файл не является корректным .docx: не найдена сигнатура ZIP-контейнера OOXML',
      );
    }
    if (!buffer.includes(Buffer.from('[Content_Types].xml'))) {
      throw AppError.badRequest(
        'CORRUPT_DOCUMENT',
        'В .docx отсутствует обязательная запись [Content_Types].xml',
      );
    }
    return;
  }
  if (buffer.includes(0x00)) {
    throw AppError.badRequest('CORRUPT_DOCUMENT', 'Текстовый файл содержит нулевые байты');
  }
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(buffer);
  } catch {
    throw AppError.badRequest('CORRUPT_DOCUMENT', 'Текстовый файл не в кодировке UTF-8');
  }
}

export function validateUpload(
  originalName: string,
  mimeType: string,
  buffer: Buffer,
): ValidatedUpload {
  const format = detectFormat(originalName, mimeType);
  verifySignature(format, buffer);
  return { format, buffer };
}
