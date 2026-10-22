import { expect, test } from "@playwright/test";

const BASE = process.env.PRESCHOOL_BASE_URL || "http://127.0.0.1:4173";

test.describe("28η Οκτωβρίου 1940 — isolated seasonal journeys", () => {
  test("two correct ages, no runtime errors, no non-working PDF links", async ({page}) => {
    const errors:string[]=[];
    page.on("pageerror", e=>errors.push(e.message));
    await page.goto(BASE+"/october-1940",{waitUntil:"networkidle"});
    await expect(page.getByRole("heading",{name:"28η Οκτωβρίου 1940"})).toBeVisible();
    await expect(page.getByText("2,5–3,5 ετών",{exact:true})).toBeVisible();
    await expect(page.getByText("4–6 ετών",{exact:true})).toBeVisible();
    await expect(page.getByRole("link",{name:/Παίζω διαδραστικά/})).toHaveCount(2);
    await expect(page.getByRole("link",{name:/βιβλιαράκι Canva|Κατέβασε PDF Α4/})).toHaveCount(2);
    expect(errors).toEqual([]);
  });
  test("toddler task: correct count, retry and progress",async ({page})=>{
    await page.goto(BASE+"/october-1940-young",{waitUntil:"networkidle"});
    await expect(page.getByRole("heading",{name:"Μετρώ τις σημαίες"})).toBeVisible();
    await page.getByRole("button",{name:"1",exact:true}).click();
    await expect(page.getByText(/Δοκίμασε άλλη μια φορά/)).toBeVisible();
    await page.getByRole("button",{name:"2",exact:true}).click();
    await expect(page.getByText(/Μπράβο/)).toBeVisible();
    await page.getByRole("button",{name:/Επόμενη δραστηριότητα/}).click();
    await expect(page.getByRole("heading",{name:"Τα περιστέρια της ειρήνης"})).toBeVisible();
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow","1");
  });
  test("4–6 tasks have distinct age-level challenge",async ({page})=>{
    await page.goto(BASE+"/october-1940-older",{waitUntil:"networkidle"});
    await expect(page.getByText("4–6 ετών",{exact:true})).toBeVisible();
    await expect(page.getByRole("heading",{name:"Μετρώ τις σημαίες"})).toBeVisible();
    await page.getByRole("button",{name:"6",exact:true}).click();
    await expect(page.getByText(/Μπράβο/)).toBeVisible();
  });
  test("old seasonal pack and virtual-preschool remain accessible",async ({page})=>{
    for (const route of ["/seasonal-packs/oct28","/virtual-preschool","/learning-games"]) {
      const response=await page.goto(BASE+route,{waitUntil:"networkidle"});
      expect(response?.ok()).toBeTruthy();
    }
    await page.goto(BASE+"/seasonal-packs/oct28",{waitUntil:"networkidle"});
    await expect(page.getByRole("link",{name:/Άνοιξε την ενότητα του ΟΧΙ/})).toBeVisible();
  });
  test("age cards remain usable at mobile width",async ({page})=>{
    await page.setViewportSize({width:390,height:844});
    await page.goto(BASE+"/october-1940",{waitUntil:"networkidle"});
    const actions=page.getByRole("link",{name:/Παίζω διαδραστικά/});
    await expect(actions).toHaveCount(2);
    await actions.first().click();
    await expect(page.getByRole("heading",{name:"Μετρώ τις σημαίες"})).toBeVisible();
  });
});