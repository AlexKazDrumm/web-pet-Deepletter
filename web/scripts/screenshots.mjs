import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const BASE = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:3000';
const outDir = fileURLToPath(new URL('../../docs/screenshots/', import.meta.url));
const sampleDocx = fileURLToPath(
  new URL('../../docs/sample-documents/deepletter-overview.docx', import.meta.url),
);

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

async function shoot(name) {
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${outDir}${name}.png`, fullPage: true });
  console.log(`saved ${name}.png`);
}

await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
await shoot('home');

await page.goto(`${BASE}/tools/text-transform`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Убрать лишние пробелы' }).click();
await page.getByRole('button', { name: 'Каждое Слово С Заглавной' }).click();
await shoot('text-transform');

await page.goto(`${BASE}/tools/markdown`, { waitUntil: 'networkidle' });
await shoot('markdown');

await page.goto(`${BASE}/tools/randomizer`, { waitUntil: 'networkidle' });
await page.getByRole('combobox').selectOption('password');
await page.getByLabel('Seed').fill('42');
await page.getByTestId('generate').click();
await page.getByTestId('random-result').waitFor({ state: 'visible' });
await shoot('randomizer');

await page.goto(`${BASE}/tools/document-analyzer`, { waitUntil: 'networkidle' });
await page.getByTestId('file-input').setInputFiles(sampleDocx);
await page.getByTestId('analyze').click();
await page.getByTestId('result').waitFor({ state: 'visible' });
await shoot('document-analyzer');

await browser.close();
