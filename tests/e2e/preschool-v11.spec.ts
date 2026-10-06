import { expect, test } from "@playwright/test";

const BASE_URL = process.env.PRESCHOOL_BASE_URL || "http://127.0.0.1:4173";

test.describe("Pisipouk V11 adaptive preschool", () => {
  test("opens the adaptive adventure and records a play", async ({ page }) => {
    const errors:string[]=[];
    page.on("pageerror", e=>errors.push(e.message));
    const res=await page.goto(`${BASE_URL}/virtual-preschool?analytics=off`,{waitUntil:"networkidle"});
    expect(res?.ok()).toBeTruthy();
    await expect(page.getByText("Adaptive Adventures")).toBeVisible();
    await page.getByText("Adaptive Adventures").click();
    await expect(page.getByText(/Κάθε φορά μια/)).toBeVisible();
    await expect(page.getByText(/χωρίς paid AI/)).toBeVisible();
    await page.getByRole("button",{name:/4–5 ετών/}).click();
    const first=page.locator(".v11-grid > button").first();
    await expect(first).toBeVisible();
    await first.click();
    await expect(page.locator(".v11-modal")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("has parent co-op and touch 3D experiences", async ({ page }) => {
    await page.goto(`${BASE_URL}/virtual-preschool?analytics=off`,{waitUntil:"networkidle"});
    await page.getByText("Adaptive Adventures").click();
    await page.getByRole("button",{name:/4–5 ετών/}).click();
    await expect(page.getByText("Το νησί που γυρίζει")).toBeVisible();
    await expect(page.getByText("Ο καθρέφτης")).toBeVisible();
  });

  test("keeps the rest of the website healthy", async ({ page }) => {
    for(const path of ["/","/virtual-preschool","/learning-games"]){
      const r=await page.goto(`${BASE_URL}${path}`,{waitUntil:"domcontentloaded"});
      expect(r?.ok()).toBeTruthy();
    }
  });
});
