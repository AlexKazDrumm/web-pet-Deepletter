import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { analyzeText } from '@deepletter/shared';
import { pgAnalysisRepository } from './analysisRepo';
import { pgToolsRepository } from './toolsRepo';
import { closePool, query } from './pool';

const run = process.env.RUN_DB_IT === '1';

describe.skipIf(!run)('репозитории поверх настоящего PostgreSQL', () => {
  beforeAll(() => {
    const scriptDir = resolve(__dirname, '../../scripts');
    execFileSync('node', [resolve(scriptDir, 'migrate.cjs'), 'up'], { stdio: 'inherit' });
    execFileSync('node', [resolve(scriptDir, 'seed.cjs')], { stdio: 'inherit' });
  }, 60_000);

  afterAll(async () => {
    await closePool();
  });

  it('seed наполняет каталог инструментов', async () => {
    const tools = await pgToolsRepository.listTools();
    expect(tools.length).toBeGreaterThanOrEqual(4);
    expect(tools.map((t) => t.slug)).toContain('document-analyzer');
  });

  it('insert + listRecent сохраняют и читают запись анализа', async () => {
    const statistics = analyzeText('Одно предложение. И второе предложение тут.');
    const created = await pgAnalysisRepository.insert({
      sourceFormat: 'txt',
      sizeBytes: 42,
      statistics,
    });
    expect(created.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(created.statistics.wordCount).toBe(statistics.wordCount);

    const recent = await pgAnalysisRepository.listRecent(5);
    expect(recent[0]?.id).toBe(created.id);

    const stored = await query('SELECT * FROM document_analyses WHERE id = $1', [created.id]);
    expect(stored.rows[0]).not.toHaveProperty('file_name');
  });
});
