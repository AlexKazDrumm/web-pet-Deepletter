import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

loadEnv({ path: path.resolve(process.cwd(), '../.env') });
loadEnv({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3030),
  DATABASE_URL: z
    .string()
    .url({ message: 'DATABASE_URL обязателен и должен быть URL подключения' }),
  WEB_ORIGIN: z.string().default('http://localhost:3000'),
  MAX_UPLOAD_BYTES: z.coerce
    .number()
    .int()
    .positive()
    .default(5 * 1024 * 1024),
  RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  ANALYZE_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(20),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
});

export type AppConfig = {
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
  databaseUrl: string;
  webOrigins: string[];
  maxUploadBytes: number;
  rateLimitWindowMs: number;
  rateLimitMax: number;
  analyzeRateLimitMax: number;
  logLevel: z.infer<typeof envSchema>['LOG_LEVEL'];
  isProduction: boolean;
};

let cached: AppConfig | null = null;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  if (cached) {
    return cached;
  }
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Некорректная конфигурация окружения:\n${issues}`);
  }
  const value = parsed.data;
  cached = {
    nodeEnv: value.NODE_ENV,
    port: value.PORT,
    databaseUrl: value.DATABASE_URL,
    webOrigins: value.WEB_ORIGIN.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    maxUploadBytes: value.MAX_UPLOAD_BYTES,
    rateLimitWindowMs: value.RATE_LIMIT_WINDOW_MS,
    rateLimitMax: value.RATE_LIMIT_MAX,
    analyzeRateLimitMax: value.ANALYZE_RATE_LIMIT_MAX,
    logLevel: value.LOG_LEVEL,
    isProduction: value.NODE_ENV === 'production',
  };
  return cached;
}

export function resetConfigCache(): void {
  cached = null;
}
