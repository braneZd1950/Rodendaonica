import { defineConfig, devices } from '@playwright/test'

/**
 * Demo video snimka: ~5 min trail kroz aplikaciju.
 * Video: e2e-results/.../video.webm
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 420_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  outputDir: 'e2e-results',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173',
    locale: 'hr-HR',
    timezoneId: 'Europe/Zagreb',
    viewport: { width: 1366, height: 768 },
    video: {
      mode: 'on',
      size: { width: 1366, height: 768 },
    },
    trace: 'on',
    screenshot: 'off',
    actionTimeout: 25_000,
    navigationTimeout: 45_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: true,
        timeout: 180_000,
      },
})
