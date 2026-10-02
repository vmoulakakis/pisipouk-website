import { expect, test } from "@playwright/test";

const BASE_URL = process.env.PRESCHOOL_BASE_URL || "http://127.0.0.1:4173";

test.describe("Pisipouk Virtual Preschool+", () => {
  test("ships playable games, interactive coloring, A4 crafts and parent zone", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const response = await page.goto(`${BASE_URL}/virtual-preschool`, { waitUntil: "networkidle" });
    expect(response?.ok()).toBeTruthy();

    await expect(page.getByRole("heading", { name: /Κάθε μέρα μια νέα/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /8 μικρά παιχνίδια/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Ζωγραφίζω στην οθόνη/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Πραγματικά A4 πατρόν/ })).toBeVisible();

    await page.getByRole("button", { name: /Μέτρα τα αστέρια/ }).click();
    await page.getByRole("button", { name: "4", exact: true }).click();
    await expect(page.getByText("Μπράβο! Το βρήκες!")).toBeVisible();

    await page.getByRole("button", { name: /Πύραυλος στο φεγγάρι/ }).click();
    const firstColorRegion = page.locator("#coloring svg path.cursor-pointer").first();
    await page.getByRole("button", { name: "Χρώμα #3b82f6" }).click();
    await firstColorRegion.click();
    await expect(firstColorRegion).toHaveAttribute("fill", "#3b82f6");

    await expect(page.locator("#crafts article")).toHaveCount(12);
    await expect(page.locator("#crafts").getByRole("button", { name: "Εκτύπωση A4" })).toHaveCount(12);
    await expect(page.locator("#crafts").getByRole("button", { name: "HD Πατρόν" })).toHaveCount(12);

    await expect(page.getByRole("heading", { name: /Ο γονιός ξέρει πάντα/ })).toBeVisible();
    expect(pageErrors).toEqual([]);
  });
});
