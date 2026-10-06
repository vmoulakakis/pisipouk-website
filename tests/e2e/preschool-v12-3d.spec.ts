import { expect, test } from "@playwright/test";

const BASE_URL = process.env.PRESCHOOL_BASE_URL || "http://127.0.0.1:4173";

const ages = [
  { label: "2–3 ετών", game: "Το χρωματιστό λιμανάκι" },
  { label: "4–5 ετών", game: "Ο θησαυρός του Αιγαίου" },
  { label: "5–6 ετών", game: "Αποστολή στο λιμάνι" },
] as const;

const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

test.describe("Pisipouk V12 3D PlayWorld", () => {
  test("renders bear-led age separated game hub", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    const response = await page.goto(`${BASE_URL}/virtual-preschool`, { waitUntil: "networkidle" });
    expect(response?.ok()).toBeTruthy();
    await expect(page.getByText("Ο ΚΟΣΜΟΣ ΤΟΥ ΠΙΣΙΠΟΥΚ").first()).toBeVisible();
    await expect(page.getByText("Το αρκουδάκι είναι ο οδηγός!")).toBeVisible();
    for (const a of ages) {
      await page.getByRole("button", { name: new RegExp(a.label) }).click();
      await expect(page.getByRole("heading", { name: a.game })).toBeVisible();
    }
    expect(errors).toEqual([]);
  });

  for (const vp of viewports) {
    test(`loads a real Babylon canvas at ${vp.width}x${vp.height}`, async ({ page }) => {
      test.setTimeout(60_000);
      await page.setViewportSize(vp);
      const errors: string[] = [];
      page.on("pageerror", e => errors.push(e.message));
      await page.goto(`${BASE_URL}/virtual-preschool`, { waitUntil: "domcontentloaded" });
      await page.getByRole("heading", { name: "Το χρωματιστό λιμανάκι" }).click();
      const canvas = page.locator("canvas[aria-label^='3D παιχνίδι']");
      await expect(canvas).toBeVisible({ timeout: 20_000 });
      await page.waitForFunction(() => Boolean((window as any).BABYLON), null, { timeout: 20_000 });
      const size = await canvas.boundingBox();
      expect(size?.width || 0).toBeGreaterThan(300);
      expect(size?.height || 0).toBeGreaterThan(500);
      await expect(page.getByText(/Βρες τα 3|ετοιμάζει τον κόσμο/)).toBeVisible({ timeout: 20_000 });
      expect(errors).toEqual([]);
    });
  }

  test("keeps education, entertainment and parent co-play separate by age", async ({ page }) => {
    await page.goto(`${BASE_URL}/virtual-preschool`, { waitUntil: "networkidle" });
    await expect(page.getByText("Μουσικά κουδουνάκια")).toBeVisible();
    await expect(page.getByText("Το πικνίκ του Πισιπούκ")).toBeVisible();
    await page.getByRole("button", { name: /4–5 ετών/ }).click();
    await expect(page.getByText("Χτίζω το χωριό")).toBeVisible();
    await expect(page.getByText("Καρναβάλι ρυθμού")).toBeVisible();
    await page.getByRole("button", { name: /5–6 ετών/ }).click();
    await expect(page.getByText("Εργαστήριο της θάλασσας")).toBeVisible();
    await expect(page.getByText("Ο χάρτης του Πισιπούκ")).toBeVisible();
  });

  test("parent dashboard is privacy-safe and local-first", async ({ page }) => {
    await page.goto(`${BASE_URL}/virtual-preschool`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Γονείς/ }).click();
    await expect(page.getByRole("heading", { name: "Γωνιά Γονέα" })).toBeVisible();
    await expect(page.getByText(/ΧΩΡΙΣ ΟΝΟΜΑ ΠΑΙΔΙΟΥ/)).toBeVisible();
    await expect(page.getByText(/Δεν είναι αξιολόγηση ανάπτυξης/)).toBeVisible();
  });

  test("legacy preschool library remains available", async ({ page }) => {
    await page.goto(`${BASE_URL}/virtual-preschool`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Όλο το Preschool/ }).click();
    await expect(page.getByRole("button", { name: /3D PlayWorld/ })).toBeVisible();
    await expect(page.getByText(/Ο ΚΟΣΜΟΣ ΤΟΥ ΠΙΣΙΠΟΥΚ/).first()).toBeVisible();
  });

  test("100 fast age-navigation cycles do not leak page errors", async ({ page }) => {
    test.setTimeout(90_000);
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto(`${BASE_URL}/virtual-preschool`, { waitUntil: "domcontentloaded" });
    for (let i = 0; i < 100; i++) {
      const a = ages[i % ages.length];
      await page.getByRole("button", { name: new RegExp(a.label) }).click();
      await expect(page.getByRole("heading", { name: a.game })).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
});
