export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'FILE_REQUIRED'
  | 'UNSUPPORTED_FORMAT'
  | 'FILE_TOO_LARGE'
  | 'EMPTY_DOCUMENT'
  | 'CORRUPT_DOCUMENT'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'INTERNAL';

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode;
  readonly details?: unknown;

  constructor(statusCode: number, code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static badRequest(code: ErrorCode, message: string, details?: unknown): AppError {
    return new AppError(400, code, message, details);
  }

  static payloadTooLarge(message: string): AppError {
    return new AppError(413, 'FILE_TOO_LARGE', message);
  }

  static notFound(message = 'Ресурс не найден'): AppError {
    return new AppError(404, 'NOT_FOUND', message);
  }
}
