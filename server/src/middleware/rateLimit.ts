import rateLimit, { type RateLimitRequestHandler } from 'express-rate-limit';
import type { AppConfig } from '../config';

export interface RateLimiters {
  global: RateLimitRequestHandler;
  analyze: RateLimitRequestHandler;
}

export function createRateLimiters(config: AppConfig): RateLimiters {
  const base = {
    windowMs: config.rateLimitWindowMs,
    standardHeaders: 'draft-7' as const,
    legacyHeaders: false,
    message: {
      error: { code: 'RATE_LIMITED', message: 'Слишком много запросов, попробуйте позже' },
    },
  };
  return {
    global: rateLimit({ ...base, limit: config.rateLimitMax }),
    analyze: rateLimit({ ...base, limit: config.analyzeRateLimitMax }),
  };
}
