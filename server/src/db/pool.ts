import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';
import { loadConfig } from '../config';
import { logger } from '../logger';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const config = loadConfig();
    pool = new Pool({ connectionString: config.databaseUrl, max: 10, idleTimeoutMillis: 30_000 });
    pool.on('error', (err) => {
      logger.error({ err }, 'Неожиданная ошибка простаивающего клиента PostgreSQL');
    });
  }
  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: readonly unknown[] = [],
): Promise<QueryResult<T>> {
  return getPool().query<T>(text, params as unknown[]);
}

export async function withClient<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
