import { defineConfig, devices } from '@playwright/test';

const webBaseUrl = process.env.E2E_BASE_URL ?? 'http://localhost:3000';
const apiBaseUrl = process.env.E2E_API_BASE_URL ?? 'http://localhost:3030';
const manageServers = process.env.E2E_NO_WEBSERVER !== '1';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  use: {
    baseURL: webBaseUrl,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: manageServers
    ? [
        {
          command: 'node ../server/dist/server.js',
          url: `${apiBaseUrl}/api/health`,
          reuseExistingServer: !process.env.CI,
          timeout: 60_000,
          env: {
            NODE_ENV: 'production',
            PORT: '3030',
            WEB_ORIGIN: webBaseUrl,
            DATABASE_URL:
              process.env.DATABASE_URL ??
              'postgres://deepletter:deepletter@localhost:5432/deepletter',
          },
        },
        {
          command: 'npm run start',
          url: webBaseUrl,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      ]
    : undefined,
});
