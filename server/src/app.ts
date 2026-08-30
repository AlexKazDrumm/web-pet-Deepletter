import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import type { AppConfig } from './config';
import type { AnalysisRepository } from './db/analysisRepo';
import type { ToolsRepository } from './db/toolsRepo';
import { logger } from './logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { createRateLimiters } from './middleware/rateLimit';
import { documentsRouter } from './routes/documents';
import { healthRouter } from './routes/health';
import { toolsRouter } from './routes/tools';

export interface AppDependencies {
  config: AppConfig;
  toolsRepo: ToolsRepository;
  analysisRepo: AnalysisRepository;
}

export function createApp({ config, toolsRepo, analysisRepo }: AppDependencies): Express {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(
    cors({
      origin: config.webOrigins.length > 0 ? config.webOrigins : false,
      methods: ['GET', 'POST'],
      maxAge: 86_400,
    }),
  );
  if (config.nodeEnv !== 'test') {
    app.use(pinoHttp({ logger }));
  }
  app.use(express.json({ limit: '64kb' }));

  const limiters = createRateLimiters(config);
  app.use('/api', limiters.global);

  app.use('/api/health', healthRouter());
  app.use('/api/tools', toolsRouter(toolsRepo));
  app.use('/api/documents', documentsRouter(analysisRepo, config, limiters.analyze));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
