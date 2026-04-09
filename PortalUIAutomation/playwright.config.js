// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  timeout: 60 * 1000,
  expect: {
    timeout: 60 * 1000,
  },
  reporter: [
    ['list'],
    ['allure-playwright'],
  ],
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {


    channel: 'chrome',
    headless: false,
    ignoreHTTPSErrors: true,

    screenshot: 'only-on-failure',      // saves under test-results/<project>/<test>.png
    video: 'retain-on-failure',         // saves .webm on failure
    trace: 'on-first-retry',


    // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',

  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',

      use: {
        headless: false,
        channel: 'chromium',
        ...devices['Desktop Chrome'],

        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',

      },
      outputDir: 'test-results/',

    },


  ],

});

