import { expect, test } from "@playwright/test";

const BASE_URL = process.env.PRESCHOOL_BASE_URL || "http://127.0.0.1:4173";

test.describe("Online Preschool Final art direction", () => {
  test("renders the final visual system and Pisi Guide", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const response = await page.goto(`${BASE_URL}/virtual-preschool-final`, { waitUntil: "networkidle" });
    expect(response?.ok()).toBeTruthy();

    await expect(page.getByRole("heading", { name: /Μαθαίνω/ })).toBeVisible();
    await expect(page.getByText("15 λεπτά με αρχή, μέση και… ζωή εκτός οθόνης")).toBeVisible();
    await expect(page.getByText(/Προσωπικός βοηθός χωρίς ελεύθερο παιδικό chatbot/)).toBeVisible();

    await page.getByRole("button", { name: "5–6" }).first().click();
    await expect(page.getByText("Βρες το μοτίβο · 5′")).toBeVisible();

    await page.getByRole("button", { name: "ήρεμα" }).click();
    await page.getByRole("button", { name: "γλώσσα" }).click();
    await page.getByRole("button", { name: "15′" }).click();
    await expect(page.getByText("Βάλε την Ιστορία σε Σειρά")).toBeVisible();

    await expect(page.locator("main svg")).toHaveCount(10);
    expect(pageErrors).toEqual([]);
  });

  test("keeps all existing preschool routes healthy", async ({ page }) => {
    for (const route of ["/virtual-preschool", "/virtual-preschool-grace", "/virtual-preschool-world", "/learning-games"]) {
      const response = await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
      expect(response?.ok()).toBeTruthy();
    }
  });
});
