import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 25_000,
  expect: { timeout: 7_000 },
  fullyParallel: false,
  workers: 2,
  retries: 1,
  reporter: [["list"]],
  use: {
    baseURL: process.env.PRESCHOOL_BASE_URL || "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "android-chromium",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "apple-webkit",
      use: { ...devices["iPhone 15"] },
    },
    {
      name: "ipad-webkit",
      use: { ...devices["iPad Pro 11"] },
    },
  ],
});
