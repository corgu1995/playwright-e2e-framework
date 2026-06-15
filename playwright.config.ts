import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

/**
 * Load environment variables from a local `.env` file (see `.env.example`).
 * This keeps credentials and the base URL out of source control while still
 * allowing sensible defaults for the public Sauce Labs demo site.
 */
dotenv.config();

const BASE_URL = process.env.BASE_URL ?? 'https://www.saucedemo.com';

/**
 * Playwright configuration.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  /* Run tests within a file in parallel. */
  fullyParallel: true,

  /* Fail the build on CI if `test.only` was left in the source by accident. */
  forbidOnly: !!process.env.CI,

  /* Retry flaky tests on CI only; fail fast locally to surface real issues. */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of an explicit worker count and let Playwright auto-detect. */
  workers: undefined,

  /* Reporters: concise console output, a rich HTML report, and CI annotations. */
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['github'],
  ],

  /* Shared settings for all projects below. */
  use: {
    baseURL: BASE_URL,

    /* Collect a trace when retrying a failed test for fast debugging. */
    trace: 'on-first-retry',

    /* Capture a screenshot only when a test fails. */
    screenshot: 'only-on-failure',

    /* Keep video only when a test fails. */
    video: 'retain-on-failure',
  },

  /* Cross-browser coverage across the three major engines. */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
