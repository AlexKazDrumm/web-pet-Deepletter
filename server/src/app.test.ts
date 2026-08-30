import { resolve } from 'node:path';
import type { Express } from 'express';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import type { AnalysisHistoryItem, DocumentAnalysis, Tool } from '@deepletter/shared';
import { createApp } from './app';
import { loadConfig } from './config';
import type { AnalysisRepository, NewAnalysisRecord } from './db/analysisRepo';
import type { ToolsRepository } from './db/toolsRepo';

const sampleDocx = resolve(__dirname, '../../docs/sample-documents/deepletter-overview.docx');
const sampleTxt = resolve(__dirname, '../../docs/sample-documents/deepletter-overview.txt');

const tools: Tool[] = [
  {
    slug: 'document-analyzer',
    title: 'Анализ документа',
    summary: 'x',
    category: 'Документы',
    href: '/tools/document-analyzer',
    sortOrder: 10,
  },
];

const toolsRepo: ToolsRepository = {
  listTools: async () => tools,
};

class FakeAnalysisRepo implements AnalysisRepository {
  saved: NewAnalysisRecord[] = [];

  async insert(record: NewAnalysisRecord): Promise<DocumentAnalysis> {
    this.saved.push(record);
    return {
      id: '00000000-0000-4000-8000-000000000000',
      sourceFormat: record.sourceFormat,
      sizeBytes: record.sizeBytes,
      createdAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
      statistics: record.statistics,
    };
  }

  async listRecent(limit: number): Promise<AnalysisHistoryItem[]> {
    return this.saved.slice(0, limit).map((record, index) => ({
      id: `00000000-0000-4000-8000-00000000000${index}`,
      sourceFormat: record.sourceFormat,
      sizeBytes: record.sizeBytes,
      wordCount: record.statistics.wordCount,
      charCount: record.statistics.charCount,
      readingTimeSeconds: record.statistics.readingTimeSeconds,
      createdAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
    }));
  }
}

let app: Express;
let analysisRepo: FakeAnalysisRepo;

beforeAll(() => {
  analysisRepo = new FakeAnalysisRepo();
  app = createApp({ config: loadConfig(), toolsRepo, analysisRepo });
});

describe('GET /api/health', () => {
  it('отвечает статусом ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok' });
    expect(typeof res.body.uptimeSeconds).toBe('number');
  });
});

describe('GET /api/tools', () => {
  it('возвращает каталог из репозитория', async () => {
    const res = await request(app).get('/api/tools');
    expect(res.status).toBe(200);
    expect(res.body.tools).toHaveLength(1);
    expect(res.body.tools[0].slug).toBe('document-analyzer');
  });
});

describe('POST /api/documents/analyze', () => {
  it('анализирует .txt и сохраняет запись', async () => {
    const res = await request(app)
      .post('/api/documents/analyze')
      .attach('file', sampleTxt, { contentType: 'text/plain' });
    expect(res.status).toBe(201);
    expect(res.body.analysis.sourceFormat).toBe('txt');
    expect(res.body.analysis.statistics.wordCount).toBeGreaterThan(30);
    expect(res.body.analysis.statistics.paragraphCount).toBe(3);
    expect(analysisRepo.saved.length).toBeGreaterThan(0);
  });

  it('анализирует .docx', async () => {
    const res = await request(app).post('/api/documents/analyze').attach('file', sampleDocx, {
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    expect(res.status).toBe(201);
    expect(res.body.analysis.sourceFormat).toBe('docx');
    expect(res.body.analysis.statistics.charCount).toBeGreaterThan(100);
  });

  it('отклоняет запрос без файла (400 FILE_REQUIRED)', async () => {
    const res = await request(app).post('/api/documents/analyze');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('FILE_REQUIRED');
  });

  it('отклоняет запрещённое расширение (400 UNSUPPORTED_FORMAT)', async () => {
    const res = await request(app)
      .post('/api/documents/analyze')
      .attach('file', Buffer.from('#!/bin/sh\necho hi'), {
        filename: 'script.sh',
        contentType: 'application/x-sh',
      });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('UNSUPPORTED_FORMAT');
  });

  it('отклоняет подделку: .docx без ZIP-сигнатуры (400 CORRUPT_DOCUMENT)', async () => {
    const res = await request(app)
      .post('/api/documents/analyze')
      .attach('file', Buffer.from('это просто текст, а не docx'), {
        filename: 'fake.docx',
        contentType: 'application/octet-stream',
      });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('CORRUPT_DOCUMENT');
  });

  it('отклоняет превышение размера (413 FILE_TOO_LARGE)', async () => {
    const big = Buffer.alloc(loadConfig().maxUploadBytes + 1024, 0x41);
    const res = await request(app)
      .post('/api/documents/analyze')
      .attach('file', big, { filename: 'big.txt', contentType: 'text/plain' });
    expect(res.status).toBe(413);
    expect(res.body.error.code).toBe('FILE_TOO_LARGE');
  });
});

describe('GET /api/documents/analyses', () => {
  it('возвращает недавние записи анализа', async () => {
    await request(app).post('/api/documents/analyze').attach('file', sampleTxt);
    const res = await request(app).get('/api/documents/analyses').query({ limit: 5 });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    for (const item of res.body.items) {
      expect(item).not.toHaveProperty('fileName');
      expect(item).toHaveProperty('wordCount');
    }
  });

  it('отклоняет некорректный limit (400 VALIDATION_ERROR)', async () => {
    const res = await request(app).get('/api/documents/analyses').query({ limit: 999 });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('неизвестный маршрут', () => {
  it('отдаёт 404 в формате ApiError', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
