import { expect, test } from "@playwright/test";

const BASE_URL = process.env.PRESCHOOL_BASE_URL || "http://127.0.0.1:4173";

test.describe("Online Preschool Grace", () => {
  test("renders the new experience and interactive challenge", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const response = await page.goto(`${BASE_URL}/virtual-preschool-grace`, { waitUntil: "networkidle" });
    expect(response?.ok()).toBeTruthy();

    await expect(page.getByRole("heading", { name: "Το Εργαστήρι του Πισιπούκ" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Το σημερινό 15λεπτο" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "6 επιλογές που αξίζουν αυτή την εβδομάδα" })).toBeVisible();

    await page.getByRole("button", { name: "5–6" }).click();
    await expect(page.getByText("Βρες το Μοτίβο", { exact: true }).first()).toBeVisible();

    const blueChoice = page.locator("button").filter({ hasText: "🔵" }).first();
    await blueChoice.click();
    await expect(page.getByText(/Μπράβο — βρήκες τον ρυθμό/)).toBeVisible();

    await expect(page.getByRole("button", { name: /Εκτύπωσε Α4 πατρόν/ })).toHaveCount(10);
    expect(pageErrors).toEqual([]);
  });

  test("keeps the existing preschool and learning games routes healthy", async ({ page }) => {
    let response = await page.goto(`${BASE_URL}/virtual-preschool`, { waitUntil: "networkidle" });
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator("body")).toContainText(/Online Preschool|Εικονικός|Ζωγραφ/);

    response = await page.goto(`${BASE_URL}/learning-games`, { waitUntil: "networkidle" });
    expect(response?.ok()).toBeTruthy();
    await expect(page.getByRole("heading", { name: "Μαθησιακά Παιχνίδια" })).toBeVisible();
  });

  test("serves a valid 2-2-2 weekly shelf", async ({ request }) => {
    const [catalogResponse, weeklyResponse] = await Promise.all([
      request.get(`${BASE_URL}/preschool-catalog.json`),
      request.get(`${BASE_URL}/preschool-weekly.json`),
    ]);
    expect(catalogResponse.ok()).toBeTruthy();
    expect(weeklyResponse.ok()).toBeTruthy();

    const catalog = await catalogResponse.json();
    const weekly = await weeklyResponse.json();
    const byId = new Map(catalog.items.map((item: { id: string; type: string }) => [item.id, item]));
    const counts = { game: 0, printable: 0, craft: 0 };

    expect(weekly.items).toHaveLength(6);
    expect(new Set(weekly.items).size).toBe(6);
    for (const id of weekly.items) {
      const item = byId.get(id) as { type: keyof typeof counts } | undefined;
      expect(item).toBeTruthy();
      counts[item!.type] += 1;
    }
    expect(counts).toEqual({ game: 2, printable: 2, craft: 2 });
  });
});
