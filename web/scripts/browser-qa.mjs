/* global document, window */
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const baseUrl = process.env.BROWSER_QA_BASE_URL ?? 'http://localhost:3000';
const outputDir = fileURLToPath(new URL('../test-results/browser-qa/', import.meta.url));
const sampleDocx = fileURLToPath(
  new URL('../../docs/sample-documents/deepletter-overview.docx', import.meta.url),
);
const profiles = [
  { name: 'desktop', viewport: { width: 1440, height: 1000 } },
  { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true },
];
const routes = [
  '/',
  '/tools/document-analyzer',
  '/tools/text-transform',
  '/tools/markdown',
  '/tools/randomizer',
];
const failures = [];

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch();

for (const profile of profiles) {
  const context = await browser.newContext(profile);
  const page = await context.newPage();

  page.on('console', (message) => {
    if (message.type() === 'error') {
      failures.push(`${profile.name}: console: ${message.text()}`);
    }
  });
  page.on('pageerror', (error) => failures.push(`${profile.name}: pageerror: ${error.message}`));
  page.on('requestfailed', (request) => {
    const expectedNavigationAbort =
      request.failure()?.errorText === 'net::ERR_ABORTED' && request.url().includes('_rsc=');
    if (expectedNavigationAbort) {
      return;
    }
    failures.push(
      `${profile.name}: request failed: ${request.method()} ${request.url()} (${request.failure()?.errorText ?? 'unknown'})`,
    );
  });
  page.on('response', (response) => {
    if (response.status() >= 400) {
      failures.push(`${profile.name}: HTTP ${response.status()} ${response.url()}`);
    }
  });

  for (const route of routes) {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
    if (!response?.ok()) {
      failures.push(
        `${profile.name}: navigation failed: ${route} (${response?.status() ?? 'none'})`,
      );
      continue;
    }

    const diagnostics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      lang: document.documentElement.lang,
      hasMain: Boolean(document.querySelector('main')),
      brokenImages: [...document.images]
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src),
    }));
    if (diagnostics.overflow > 1) {
      failures.push(`${profile.name}: horizontal overflow ${diagnostics.overflow}px on ${route}`);
    }
    if (diagnostics.lang !== 'ru' || !diagnostics.hasMain) {
      failures.push(`${profile.name}: missing document semantics on ${route}`);
    }
    for (const image of diagnostics.brokenImages) {
      failures.push(`${profile.name}: broken image on ${route}: ${image}`);
    }
  }

  await page.goto(`${baseUrl}/tools/document-analyzer`, { waitUntil: 'networkidle' });
  await page.getByTestId('file-input').setInputFiles(sampleDocx);
  await page.getByTestId('analyze').click();
  await page.getByTestId('result').waitFor();

  await page.goto(`${baseUrl}/tools/markdown`, { waitUntil: 'networkidle' });
  await page.getByTestId('markdown-input').fill('# Browser QA\n\n**Готово**');
  await page.getByTestId('markdown-preview').getByText('Готово').waitFor();

  await page.goto(`${baseUrl}/tools/randomizer`, { waitUntil: 'networkidle' });
  await page.getByTestId('mode').selectOption('password');
  await page.getByLabel('Seed').fill('42');
  await page.getByTestId('generate').click();
  await page.getByTestId('random-result').waitFor();

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${outputDir}${profile.name}-home.png`, fullPage: true });
  await context.close();
}

await browser.close();

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Browser QA passed: ${profiles.length} profiles × ${routes.length} routes`);
}
