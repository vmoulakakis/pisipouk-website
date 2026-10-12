import { test, expect } from "@playwright/test";
const preview = process.env.PISIPOUK_PREVIEW_URL || "https://pisipouk-git-feature-pisipouk-63f55e-vassilis-projects-3bf8541b.vercel.app";
test.describe("Virtual Preschool V17 core smoke", () => {
  test("preschool portal opens and age filter works", async ({ page }) => {
    await page.goto(preview + "/virtual-preschool");
    await expect(page.getByRole("heading",{name:/Μικρά χεράκια/i})).toBeVisible();
    await page.getByRole("button",{name:/5–6/}).first().click();
    await expect(page.getByRole("button",{name:/5–6/}).first()).toHaveAttribute("aria-pressed","true");
  });
  test("Atelier templates, coloring and undo work", async ({ page }) => {
    await page.goto(preview + "/virtual-preschool");
    await page.getByRole("button",{name:"Atelier",exact:true}).first().click();
    await expect(page.getByText("Διάλεξε ζωγραφιά")).toBeVisible();
    await expect(page.getByRole("button",{name:/Το αρκουδάκι/})).toBeVisible();
    await page.getByRole("button",{name:/Η πεταλούδα/}).click();
    await expect(page.getByRole("img",{name:/Διαδραστικό πατρόν: Η πεταλούδα/})).toBeVisible();
    const firstArea=page.locator(".at360-paper > path").first();
    await firstArea.click();
    await expect(firstArea).not.toHaveAttribute("fill","#fffef9");
    await page.getByRole("button",{name:"Πίσω",exact:true}).click();
    await expect(firstArea).toHaveAttribute("fill","#fffef9");
  });
  test("forest quest navigation and collection works", async ({ page }) => {
    await page.goto(preview + "/virtual-preschool");
    await page.getByRole("button",{name:"Εξερεύνησε τον κόσμο της φύσης"}).click();
    await expect(page.getByRole("heading",{name:"Ο θησαυρός των φύλλων"})).toBeVisible();
    await page.getByRole("button",{name:/κίτρινα φύλλο/}).first().click();
    await expect(page.getByText("1 / 3")).toBeVisible();
  });
});
