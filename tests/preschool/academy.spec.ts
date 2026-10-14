import { test, expect } from "@playwright/test";

const base = (process.env.PRESCHOOL_TEST_BASE_URL || "http://localhost:5173").replace(/\/$/, "");
const academy = base + "/preschool/academy.html";

test.describe("Pisipouk Magic Academy — isolated preschool release checks", () => {
  test("loads its own assets and preserves preschool navigation", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(academy, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /Κάθε μέρα/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Το Μαγικό Περιβολάκι" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Εργαστήρι/ }).first()).toHaveAttribute("href", "/virtual-preschool");
    expect(errors).toEqual([]);
  });

  test("age selection changes number of learning actions", async ({ page }) => {
    await page.goto(academy);
    await expect(page.locator("#garden-counter")).toHaveText("1 / 3");
    await page.getByRole("button", { name: "4–5" }).click();
    await expect(page.locator("#garden-counter")).toHaveText("1 / 5");
    await page.getByRole("button", { name: "3–4" }).click();
    await expect(page.locator("#garden-counter")).toHaveText("1 / 4");
  });

  test("weather, mood and practical life morning circle", async ({ page }) => {
    await page.goto(academy);
    await page.getByRole("button", { name: /Βροχή/ }).click();
    await expect(page.locator("#scene")).toHaveAttribute("data-weather", "rain");
    await page.locator("#circle-next").click();
    await expect(page.locator("#circle-prompt")).toContainText("νιώθεις");
    await page.getByRole("button", { name: /Ηρεμία/ }).click();
    await page.locator("#circle-next").click();
    await expect(page.locator("#circle-prompt")).toContainText("μακριά από την οθόνη");
    await page.getByRole("button", { name: /Καλημέρα/ }).click();
    await expect(page.locator("#circle-next")).toBeEnabled();
  });

  test("garden finishes without timed failure and can replay", async ({ page }) => {
    await page.goto(academy);
    for (let i = 0; i < 3; i++) {
      await page.locator("#garden-tool").click();
    }
    await expect(page.locator("#garden-message")).toContainText("Μπράβο");
    await expect(page.locator("#garden-tool")).toBeDisabled();
    await page.locator("#garden-reset").click();
    await expect(page.locator("#garden-counter")).toHaveText("1 / 3");
    await expect(page.locator("#garden-tool")).toBeEnabled();
  });

  test("local two-child turns and Titos helper remain on-device", async ({ page }) => {
    await page.goto(academy);
    await page.locator("#buddy").click();
    await expect(page.locator("#buddy")).toHaveAttribute("aria-pressed","true");
    await expect(page.locator("#buddy-label")).toContainText("Παιδιού Α");
    await page.locator("#garden-bed").click();
    await expect(page.locator("#buddy-label")).toContainText("Παιδιού Β");
    await page.locator("#helper").click();
    await expect(page.locator("#garden-message")).toContainText("Ο Τίτος λέει");
  });

  test("reduced-motion mode and sound disabled by default", async ({ page }) => {
    await page.goto(academy);
    await expect(page.locator("#sound-toggle")).toHaveAttribute("aria-pressed","false");
    await page.locator("#calm-toggle").click();
    await expect(page.locator("body")).toHaveClass(/calm/);
    await expect(page.locator("#calm-toggle")).toHaveAttribute("aria-pressed","true");
  });
});
