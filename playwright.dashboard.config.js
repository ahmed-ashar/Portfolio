import { defineConfig } from "@playwright/test";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
export default defineConfig({
  outputDir: "artifacts/dashboard-test-results",
  testDir: "./tests",
  testMatch: "dashboard.spec.js",
  workers: 1,
  timeout: 60000,
  use: {
    actionTimeout: 10000,
    baseURL: "http://127.0.0.1:4174",
    channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node scripts/dashboard-test-server.mjs",
    url: "http://127.0.0.1:4174",
    reuseExistingServer: false,
    env: { CMS_DATA_DIR: resolve(".local", "cms-test-" + randomUUID()) },
  },
});
