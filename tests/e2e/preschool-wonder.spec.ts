import { test, expect } from "@playwright/test";

const BASE = process.env.PRESCHOOL_BASE_URL || "http://127.0.0.1:4173";

test.describe("Pisipouk Wonder — isolated virtual preschool redesign", () => {
  test("age selection changes game and printable availability", async ({ page }) => {
    const errors:string[]=[];
    page.on("pageerror",e=>errors.push(e.message));
    await page.goto(BASE+"/virtual-preschool");
    await expect(page.getByRole("heading",{name:/μαγική ανακάλυψη/i})).toBeVisible();
    await page.getByRole("button",{name:/2–3 ετών/}).click();
    await page.getByRole("button",{name:/Παιχνίδια/}).first().click();
    await expect(page.getByRole("button",{name:/Το ουράνιο τόξο/})).toBeVisible();
    await expect(page.getByRole("button",{name:/Ο κήπος με τα μήλα/})).toHaveCount(0);
    await page.getByRole("button",{name:/5–6 ετών/}).click();
    await expect(page.getByRole("button",{name:/Ο κήπος με τα μήλα/})).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("plays the color activity with gentle feedback and restart", async ({ page }) => {
    await page.goto(BASE+"/virtual-preschool");
    await page.getByRole("button",{name:/Παιχνίδια/}).first().click();
    await page.getByRole("button",{name:/Το ουράνιο τόξο/}).click();
    await expect(page.getByText("Βρες το κόκκινο!")).toBeVisible();
    await page.getByRole("button",{name:"μπλε"}).click();
    await expect(page.getByText(/δοκιμάσουμε ξανά/i)).toBeVisible();
    await page.getByRole("button",{name:"κόκκινο"}).click();
    await expect(page.getByText("Βρες το μπλε!")).toBeVisible();
    await page.getByRole("button",{name:/Από την αρχή/}).click();
    await expect(page.getByText("Βρες το κόκκινο!")).toBeVisible();
  });

  test("opens craft steps with a real A4 outline", async ({ page }) => {
    await page.goto(BASE+"/virtual-preschool");
    await page.getByRole("button",{name:/Κατασκευές/}).first().click();
    await page.getByRole("button",{name:/Το λουλούδι της φιλίας/}).click();
    await expect(page.getByText("ΒΗΜΑ 1 ΑΠΟ 4")).toBeVisible();
    await expect(page.getByRole("img",{name:/Ασπρόμαυρο πατρόν Α4/})).toBeVisible();
    await expect(page.getByRole("button",{name:/Πατρόν SVG Α4/})).toBeVisible();
    await page.getByRole("button",{name:/Επόμενο βήμα/}).click();
    await expect(page.getByText("ΒΗΜΑ 2 ΑΠΟ 4")).toBeVisible();
  });

  test("preserves legacy sixteen-domain world and other routes", async ({ page }) => {
    await page.goto(BASE+"/virtual-preschool");
    await page.getByRole("button",{name:/16 κόσμοι/}).first().click();
    await expect(page.getByRole("button",{name:/Πίσω στη νέα αρχική/})).toBeVisible();
    await page.getByRole("button",{name:/Πίσω στη νέα αρχική/}).click();
    await expect(page.getByRole("heading",{name:/μαγική ανακάλυψη/i})).toBeVisible();
    for(const path of ["/","/virtual-preschool-grace","/learning-games"]){
      const response=await page.goto(BASE+path);
      expect(response?.ok()).toBeTruthy();
    }
  });

  test("renders at mobile width without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({width:390,height:844});
    await page.goto(BASE+"/virtual-preschool");
    await expect(page.getByRole("heading",{name:/μαγική ανακάλυψη/i})).toBeVisible();
    const width=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,view:window.innerWidth}));
    expect(width.scroll).toBeLessThanOrEqual(width.view+1);
  });
});
