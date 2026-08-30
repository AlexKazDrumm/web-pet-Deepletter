import { Router, type RequestHandler } from 'express';
import multer from 'multer';
import { analyzeText, historyQuerySchema } from '@deepletter/shared';
import type { AppConfig } from '../config';
import type { AnalysisRepository } from '../db/analysisRepo';
import { extractText } from '../domain/extractText';
import { validateUpload } from '../domain/validateUpload';
import { AppError } from '../errors';

export function documentsRouter(
  repo: AnalysisRepository,
  config: AppConfig,
  analyzeLimiter: RequestHandler,
): Router {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: config.maxUploadBytes, files: 1, fields: 4 },
  });

  const router = Router();

  router.post('/analyze', analyzeLimiter, upload.single('file'), async (req, res, next) => {
    try {
      if (!req.file) {
        throw AppError.badRequest('FILE_REQUIRED', 'Прикрепите файл в поле «file»');
      }
      const { format, buffer } = validateUpload(
        req.file.originalname,
        req.file.mimetype,
        req.file.buffer,
      );
      const text = await extractText(format, buffer);
      const statistics = analyzeText(text);
      const analysis = await repo.insert({
        sourceFormat: format,
        sizeBytes: buffer.length,
        statistics,
      });
      res.status(201).json({ analysis });
    } catch (err) {
      next(err);
    }
  });

  router.get('/analyses', async (req, res, next) => {
    try {
      const parsed = historyQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        throw AppError.badRequest(
          'VALIDATION_ERROR',
          'Некорректные параметры запроса',
          parsed.error.flatten(),
        );
      }
      const items = await repo.listRecent(parsed.data.limit);
      res.json({ items });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
