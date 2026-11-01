import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "preschool-november-2026.spec.ts",
  timeout: 75_000,
  expect: { timeout: 20_000 },
  retries: 1,
  workers: 2,
  reporter: [["list"], ["html", { outputFolder: "playwright-november-report", open: "never" }]],
  use: { baseURL: process.env.PRESCHOOL_BASE_URL || "http://127.0.0.1:4173", trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "android-chromium", use: { ...devices["Pixel 7"], browserName: "chromium" } },
    { name: "iphone-webkit", use: { ...devices["iPhone 13"], browserName: "webkit" } },
    { name: "ipad-webkit", use: { ...devices["iPad (gen 7)"], browserName: "webkit" } },
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"], browserName: "chromium", viewport: { width: 1440, height: 900 } } },
  ],
});
