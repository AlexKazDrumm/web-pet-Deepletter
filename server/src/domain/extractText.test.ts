import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { extractText } from './extractText';

const sampleDocx = resolve(__dirname, '../../../docs/sample-documents/deepletter-overview.docx');

describe('extractText', () => {
  it('декодирует txt как UTF-8', async () => {
    const text = await extractText('txt', Buffer.from('Привет, мир', 'utf-8'));
    expect(text).toBe('Привет, мир');
  });

  it('возвращает исходную разметку для md', async () => {
    const text = await extractText('md', Buffer.from('# Заголовок\n\nтекст', 'utf-8'));
    expect(text).toContain('# Заголовок');
  });

  it('извлекает простой текст из .docx', async () => {
    const text = await extractText('docx', readFileSync(sampleDocx));
    expect(text).toContain('Deepletter');
    expect(text).toContain('DOCX, TXT и Markdown');
  });

  it('бросает EMPTY_DOCUMENT для пустого текста', async () => {
    await expect(extractText('txt', Buffer.from('   \n  ', 'utf-8'))).rejects.toMatchObject({
      code: 'EMPTY_DOCUMENT',
    });
  });

  it('бросает CORRUPT_DOCUMENT для битого .docx', async () => {
    await expect(
      extractText('docx', Buffer.from('PK но это не zip', 'utf-8')),
    ).rejects.toMatchObject({ code: 'CORRUPT_DOCUMENT' });
  });
});
