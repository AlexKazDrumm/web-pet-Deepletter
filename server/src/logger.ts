import pino from 'pino';
import { loadConfig } from './config';

function createLogger(): pino.Logger {
  const config = loadConfig();
  if (config.isProduction || config.nodeEnv === 'test') {
    return pino({ level: config.nodeEnv === 'test' ? 'silent' : config.logLevel });
  }
  return pino({
    level: config.logLevel,
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'SYS:HH:MM:ss', ignore: 'pid,hostname' },
    },
  });
}

export const logger = createLogger();
