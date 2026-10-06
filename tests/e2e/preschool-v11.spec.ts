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
    const shell=page.locator(".v11-shell");
    await expect(shell.getByText(/Κάθε φορά μια/)).toBeVisible();
    await expect(shell.getByText(/χωρίς paid AI/)).toBeVisible();
    await shell.getByRole("button",{name:"4–5 ετών",exact:true}).click();
    const first=shell.locator(".v11-grid > button").first();
    await expect(first).toBeVisible();
    await first.click();
    await expect(shell.locator(".v11-modal")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("has parent co-op and touch 3D experiences", async ({ page }) => {
    await page.goto(`${BASE_URL}/virtual-preschool?analytics=off`,{waitUntil:"networkidle"});
    await page.getByText("Adaptive Adventures").click();
    const shell=page.locator(".v11-shell");
    await shell.getByRole("button",{name:"4–5 ετών",exact:true}).click();
    await expect(shell.getByText("Το νησί που γυρίζει")).toBeVisible();
    await expect(shell.getByText("Ο καθρέφτης")).toBeVisible();
  });

  test("keeps the rest of the website healthy", async ({ page }) => {
    for(const path of ["/","/virtual-preschool","/learning-games"]){
      const r=await page.goto(`${BASE_URL}${path}`,{waitUntil:"domcontentloaded"});
      expect(r?.ok()).toBeTruthy();
    }
  });
});
