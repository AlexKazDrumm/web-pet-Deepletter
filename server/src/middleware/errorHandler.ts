import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { AppError } from '../errors';
import { logger } from '../logger';

function isZodError(err: unknown): err is { name: string; flatten: () => unknown } {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { name?: unknown }).name === 'ZodError' &&
    typeof (err as { flatten?: unknown }).flatten === 'function'
  );
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Маршрут не найден' } });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res
      .status(err.statusCode)
      .json({ error: { code: err.code, message: err.message, details: err.details } });
    return;
  }

  if (isZodError(err)) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Некорректные параметры запроса',
        details: err.flatten(),
      },
    });
    return;
  }

  if (err instanceof multer.MulterError) {
    const tooLarge = err.code === 'LIMIT_FILE_SIZE';
    res.status(tooLarge ? 413 : 400).json({
      error: {
        code: tooLarge ? 'FILE_TOO_LARGE' : 'VALIDATION_ERROR',
        message: tooLarge
          ? 'Файл превышает допустимый размер'
          : `Ошибка загрузки файла: ${err.message}`,
      },
    });
    return;
  }

  logger.error({ err }, 'Необработанная ошибка запроса');
  res.status(500).json({ error: { code: 'INTERNAL', message: 'Внутренняя ошибка сервера' } });
}
