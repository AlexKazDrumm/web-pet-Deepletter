import path from 'node:path';
import { expect, test } from '@playwright/test';

const sampleDocx = path.resolve(
  __dirname,
  '../../../docs/sample-documents/deepletter-overview.docx',
);

test('домашняя страница показывает каталог инструментов', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Инструменты для текста и документов' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { level: 3, name: 'Анализ документа' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 3, name: 'Markdown → HTML' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 3, name: 'Генератор случайных данных' })).toBeVisible();
});

test('анализ .docx: загрузка → индикатор → результат со статистикой', async ({ page }) => {
  await page.goto('/tools/document-analyzer');
  await expect(page.getByRole('heading', { name: 'Анализ документа', level: 1 })).toBeVisible();

  await page.getByTestId('file-input').setInputFiles(sampleDocx);
  await expect(page.getByTestId('file-name')).toContainText('deepletter-overview.docx');

  await page.getByTestId('analyze').click();

  const result = page.getByTestId('result');
  await expect(result).toBeVisible();
  await expect(result.getByText('Слова', { exact: true })).toBeVisible();
  await expect(result.getByText('Время чтения', { exact: true })).toBeVisible();
  await expect(page.getByTestId('recent')).toBeVisible();
});

test('анализ отклоняет неподдерживаемый формат с понятной ошибкой', async ({ page }) => {
  await page.goto('/tools/document-analyzer');
  await page.getByTestId('file-input').setInputFiles({
    name: 'script.sh',
    mimeType: 'application/x-sh',
    buffer: Buffer.from('#!/bin/sh\necho hello\n'),
  });
  await page.getByTestId('analyze').click();

  const status = page.getByTestId('status');
  await expect(status).toContainText('Ошибка анализа');
  await expect(status).toContainText(/не поддерживается/i);
});
