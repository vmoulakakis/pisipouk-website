import { expect, test } from "@playwright/test";

const BASE_URL = process.env.PRESCHOOL_BASE_URL || "http://127.0.0.1:4173";

test.describe("Online Preschool World", () => {
  test("renders the art-directed experience and guided recommendation", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const response = await page.goto(`${BASE_URL}/virtual-preschool-world`, { waitUntil: "networkidle" });
    expect(response?.ok()).toBeTruthy();

    await expect(page.getByRole("heading", { name: /Μαθαίνω/ }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "15 λεπτά που έχουν νόημα" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Προσωπικός βοηθός/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Κάθε εβδομάδα κάτι φρέσκο" })).toBeVisible();

    await page.getByRole("button", { name: "5–6" }).first().click();
    await expect(page.getByText("Βρες το Μοτίβο", { exact: true }).first()).toBeVisible();

    await page.getByRole("button", { name: "ήρεμα" }).click();
    await page.getByRole("button", { name: "γλώσσα" }).click();
    await page.getByRole("button", { name: "15′" }).click();
    await page.getByRole("button", { name: "Πρότεινέ μου" }).click();

    await expect(page.getByText("Βάλε την Ιστορία σε Σειρά", { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/Μετά την οθόνη:/)).toBeVisible();
    expect(pageErrors).toEqual([]);
  });

  test("keeps legacy preschool routes healthy", async ({ page }) => {
    for (const path of ["/virtual-preschool", "/virtual-preschool-grace", "/learning-games"]) {
      const response = await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });
      expect(response?.ok()).toBeTruthy();
    }
  });
});
