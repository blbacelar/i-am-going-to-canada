import { defineConfig, devices } from "@playwright/test";

const externalUrl = process.env.PLAYWRIGHT_EXTERNAL_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: externalUrl ?? "http://127.0.0.1:3107",
    trace: "retain-on-failure",
  },
  webServer: externalUrl
    ? undefined
    : {
        command: "npm run dev -- --port 3107",
        url: "http://127.0.0.1:3107/en",
        reuseExistingServer: false,
        timeout: 120_000,
      },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
