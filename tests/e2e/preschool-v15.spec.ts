import { expect, test, type Locator, type Page } from "@playwright/test";

const BASE_URL = process.env.PRESCHOOL_BASE_URL || "http://127.0.0.1:4173";

async function openApp(page: Page) {
  await page.goto(`${BASE_URL}/virtual-preschool`, { waitUntil: "domcontentloaded" });
  await expect(page.getByText(/Ένας κόσμος για να/)).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole("img", { name: "Ο Πισιπούκ το αρκουδάκι" }).first()).toBeVisible();
}

async function drag(from: Locator, to: Locator) {
  const a=await from.boundingBox(),b=await to.boundingBox();
  if(!a||!b)throw new Error("missing drag bounds");
  const page=from.page();
  await page.mouse.move(a.x+a.width/2,a.y+a.height/2);
  await page.mouse.down();
  await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:12});
  await page.mouse.up();
}

test.describe.serial("Pisipouk V15 from-scratch preschool",()=>{
  test("home uses real brand character and age-first world navigation",async({page})=>{
    await openApp(page);
    for(const age of ["2–3 ετών","3–4 ετών","4–5 ετών","5–6 ετών"]) await expect(page.getByRole("button",{name:new RegExp(age)}).first()).toBeVisible();
    for(const label of ["Παίζω","Δημιουργώ","Εξερευνώ","Ακούω ιστορίες"]) await expect(page.getByRole("button",{name:new RegExp(label)}).first()).toBeVisible();
  });

  test("necklace completes full creative payoff and appears on Pisipouk",async({page})=>{
    await openApp(page);
    await page.getByRole("button",{name:/3–4 ετών/}).first().click();
    await page.getByRole("button",{name:/Παίζω/}).first().click();
    await page.getByRole("button",{name:/Το Κολιέ του Πισιπούκ/}).click();
    const zone=page.locator(".pv15-thread-zone");
    for(let i=0;i<6;i++) await drag(page.getByRole("button",{name:"Χάντρα"}).nth(i),zone);
    await page.getByRole("button",{name:/Δένω το κολιέ/}).click();
    await page.getByRole("button",{name:/Το δίνω στον Πισιπούκ/}).click();
    await expect(page.getByText(/Το φοράω/)).toBeVisible();
    await expect(page.locator(".pv15-worn-necklace")).toBeVisible();
  });

  test("feeding offers gentle age-based feedback",async({page})=>{
    await openApp(page);
    await page.getByRole("button",{name:/3–4 ετών/}).first().click();
    await page.getByRole("button",{name:/Παίζω/}).first().click();
    await page.getByRole("button",{name:/Ταΐζω τον Πισιπούκ/}).click();
    const target=page.locator(".pv15-mouth-target");
    await drag(page.getByRole("button",{name:"μπισκότο"}),target);
    await expect(page.getByText(/λιχουδιά/)).toBeVisible();
    for(const food of ["μήλο","μπανάνα","καρότο","φράουλα"]) await drag(page.getByRole("button",{name:food}),target);
    await expect(page.getByText(/Χόρτασα/)).toBeVisible();
  });

  test("sorting uses real drag-drop and self-correction",async({page})=>{
    await openApp(page);
    await page.getByRole("button",{name:/3–4 ετών/}).first().click();
    await page.getByRole("button",{name:/Παίζω/}).first().click();
    await page.getByRole("button",{name:/Τα Καλάθια των Χρωμάτων/}).click();
    const blue=page.locator(".pv15-basket.blue");
    await drag(page.getByRole("button",{name:"κόκκινο μήλο"}),blue);
    await expect(page.getByText(/Κοίτα ξανά/)).toBeVisible();
  });

  test("music free-play and rhythm challenge work",async({page})=>{
    await openApp(page);
    await page.getByRole("button",{name:/4–5 ετών/}).first().click();
    await page.getByRole("button",{name:/Παίζω/}).first().click();
    await page.getByRole("button",{name:/Η Μπάντα του Πισιπούκ/}).click();
    await page.locator(".pv15-musician").nth(0).click();
    await page.locator(".pv15-musician").nth(1).click();
    await page.getByRole("button",{name:/Αντέγραψε τον ρυθμό/}).click();
    await expect(page.getByText(/Άκου προσεκτικά/)).toBeVisible();
  });

  test("atelier canvas stories and micro-world are interactive",async({page})=>{
    await openApp(page);
    await page.getByRole("button",{name:"Atelier"}).first().click();
    const canvas=page.getByLabel("Καμβάς δημιουργίας");
    const b=await canvas.boundingBox();if(!b)throw new Error("canvas missing");
    await page.mouse.move(b.x+120,b.y+120);await page.mouse.down();await page.mouse.move(b.x+260,b.y+230,{steps:8});await page.mouse.up();
    await expect(page.getByRole("button",{name:/Καθαρίζω/})).toBeVisible();

    await page.getByRole("button",{name:"Ιστορίες"}).first().click();
    await page.getByRole("button",{name:/Η μικρή βαρκούλα/}).click();
    await page.getByRole("button",{name:/Συνέχεια/}).click();
    await expect(page.getByText(/ακούει τον άνεμο/)).toBeVisible();

    await page.getByRole("button",{name:"Κόσμοι"}).first().click();
    await page.getByRole("button",{name:"Βρες αστέρι"}).click();
    await expect(page.getByText(/Βρήκες 1 από 5/)).toBeVisible();
  });

  test("mobile layout remains app-like",async({page})=>{
    await page.setViewportSize({width:390,height:844});
    await openApp(page);
    await expect(page.locator(".pv15-mobile-nav")).toBeVisible();
    await page.getByRole("button",{name:"Παίζω"}).last().click();
    await expect(page.getByRole("heading",{name:"Παίζω με τον Πισιπούκ"})).toBeVisible();
  });
});
