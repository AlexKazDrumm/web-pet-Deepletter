import { createApp } from './app';
import { loadConfig } from './config';
import { closePool, getPool } from './db/pool';
import { pgAnalysisRepository } from './db/analysisRepo';
import { pgToolsRepository } from './db/toolsRepo';
import { logger } from './logger';

async function main(): Promise<void> {
  const config = loadConfig();

  await getPool().query('SELECT 1');
  logger.info('Соединение с PostgreSQL установлено');

  const app = createApp({
    config,
    toolsRepo: pgToolsRepository,
    analysisRepo: pgAnalysisRepository,
  });

  const server = app.listen(config.port, () => {
    logger.info(`Deepletter API слушает http://localhost:${config.port}`);
  });

  const shutdown = (signal: string): void => {
    logger.info(`Получен ${signal}, завершаю работу`);
    server.close(() => {
      void closePool().finally(() => process.exit(0));
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
  logger.error({ err }, 'Не удалось запустить сервер');
  process.exit(1);
});
