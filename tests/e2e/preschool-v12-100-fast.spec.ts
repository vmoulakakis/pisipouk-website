import { expect, test } from "@playwright/test";

const BASE_URL = process.env.PRESCHOOL_BASE_URL || "http://127.0.0.1:4173";

const ages = ["2–3 ετών", "4–5 ετών", "5–6 ετών"];
const titles = [
  "Το χρωματιστό λιμανάκι",
  "Ο θησαυρός του Αιγαίου",
  "Αποστολή στο λιμάνι",
];

test("100 V12 child parent sessions mount and dispose 3D scenes cleanly", async ({ page }) => {
  test.setTimeout(360_000);
  const pageErrors: string[] = [];
  page.on("pageerror", e => pageErrors.push(e.message));

  await page.goto(`${BASE_URL}/virtual-preschool`, { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Το αρκουδάκι είναι ο οδηγός!")).toBeVisible({ timeout: 20_000 });

  for (let i = 0; i < 100; i++) {
    const age = ages[i % ages.length];
    const title = titles[i % titles.length];

    await page.getByRole("button", { name: new RegExp(age) }).evaluate((el: HTMLElement) => el.click());
    await page.getByRole("heading", { name: title }).evaluate((el: HTMLElement) => el.click());

    const canvas = page.locator("canvas[aria-label^='3D παιχνίδι']");
    await expect(canvas).toBeVisible({ timeout: 8_000 });
    await page.waitForFunction(() => {
      const B = (window as any).BABYLON;
      const scene = B?.EngineStore?.LastCreatedScene;
      return Boolean(scene && !scene.isDisposed && scene.meshes?.length > 8);
    }, null, { timeout: 8_000 });

    const enginesBefore = await page.evaluate(() => (window as any).BABYLON?.EngineStore?.Instances?.length ?? 0);
    expect(enginesBefore).toBeGreaterThan(0);

    const back = page.getByRole("button", { name: "Επιστροφή στα παιχνίδια" });
    if (await back.isVisible().catch(() => false)) {
      await back.evaluate((el: HTMLElement) => el.click());
    } else {
      await page.getByRole("button", { name: /Έξοδος/ }).evaluate((el: HTMLElement) => el.click());
    }
    await expect(canvas).toHaveCount(0, { timeout: 8_000 });

    if (i % 10 === 0) {
      await page.getByRole("button", { name: /Γονείς/ }).evaluate((el: HTMLElement) => el.click());
      await expect(page.getByRole("heading", { name: "Γωνιά Γονέα" })).toBeVisible({ timeout: 5_000 });
      await page.locator(".v12-close").evaluate((el: HTMLElement) => el.click());
    }
  }

  expect(pageErrors).toEqual([]);
});
