import { expect, test, type Locator, type Page } from "@playwright/test";

const BASE_URL = process.env.PRESCHOOL_BASE_URL || "http://127.0.0.1:4173";

async function open(page: Page) {
  await page.goto(`${BASE_URL}/virtual-preschool`, { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Παίζω.")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole("img", { name: "Ο Πισιπούκ το αρκουδάκι" })).toBeVisible();
}

async function drag(source: Locator, target: Locator) {
  const a = await source.boundingBox();
  const b = await target.boundingBox();
  if (!a || !b) throw new Error("missing drag bounds");
  await source.page().mouse.move(a.x+a.width/2,a.y+a.height/2);
  await source.page().mouse.down();
  await source.page().mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:12});
  await source.page().mouse.up();
}

test.describe.serial("Pisipouk V15 brand world", () => {
  test("home is age-first and has the main worlds", async ({ page }) => {
    await open(page);
    for (const age of ["2–3","3–4","4–5","5–6"]) {
      await expect(page.getByRole("button",{name:new RegExp(age)}).first()).toBeVisible();
    }
    for (const name of ["Παιχνίδια","Atelier","Ιστορίες","Εξερεύνηση"]) {
      await expect(page.getByRole("button",{name:new RegExp(name)}).first()).toBeVisible();
    }
  });

  test("age selection changes available game library", async ({ page }) => {
    await open(page);
    await page.getByRole("button",{name:/5–6/}).first().click();
    await page.getByRole("button",{name:/Παίζω τώρα/}).click();
    await expect(page.getByRole("heading",{name:"Η διαδρομή της μπίλιας"})).toBeVisible();
    await expect(page.getByRole("heading",{name:"Το πικνίκ του Πισιπούκ"})).toHaveCount(0);
  });

  test("necklace has drag, tie and wear payoff", async ({ page }) => {
    await open(page);
    await page.getByRole("button",{name:/3–4/}).first().click();
    await page.getByRole("button",{name:/Παίζω τώρα/}).click();
    await page.getByRole("heading",{name:"Το κολιέ του Πισιπούκ"}).click();
    const target=page.locator(".pw15-thread");
    for(let i=0;i<6;i++) {
      const bead=page.getByRole("button",{name:/Χάντρα/}).nth(i%6);
      await drag(bead,target);
    }
    await page.getByRole("button",{name:/Δένω το κολιέ/}).click();
    await page.getByRole("button",{name:/Το δίνω στον Πισιπούκ/}).click();
    await expect(page.getByText(/τώρα το φοράω/)).toBeVisible();
    await expect(page.locator(".pv15-worn-necklace")).toBeVisible();
  });

  test("feeding has child-friendly drag and gentle correction", async ({ page }) => {
    await open(page);
    await page.getByRole("button",{name:/3–4/}).first().click();
    await page.getByRole("button",{name:/Παίζω τώρα/}).click();
    await page.getByRole("heading",{name:"Το πικνίκ του Πισιπούκ"}).click();
    const target=page.locator(".pw15-feed-target");
    await drag(page.getByRole("button",{name:"μπισκότο"}),target);
    await expect(page.getByText(/λιχουδιά/)).toBeVisible();
    for(const name of ["μήλο","μπανάνα","καρότο","φράουλα"]) await drag(page.getByRole("button",{name}),target);
    await expect(page.getByText(/Χόρτασα/)).toBeVisible();
  });

  test("sorting uses real pointer drag/drop", async ({ page }) => {
    await open(page);
    await page.getByRole("button",{name:/3–4/}).first().click();
    await page.getByRole("button",{name:/Παίζω τώρα/}).click();
    await page.getByRole("heading",{name:"Τα καλάθια των χρωμάτων"}).click();
    const red=page.locator(".pw15-baskets .red");
    const blue=page.locator(".pw15-baskets .blue");
    const yellow=page.locator(".pw15-baskets .yellow");
    const items=page.getByRole("button",{name:"Γυαλιστερό σχήμα"});
    await drag(items.nth(0),red);
    await drag(page.getByRole("button",{name:"Γυαλιστερό σχήμα"}).nth(0),red);
    await drag(page.getByRole("button",{name:"Γυαλιστερό σχήμα"}).nth(0),blue);
    await drag(page.getByRole("button",{name:"Γυαλιστερό σχήμα"}).nth(0),blue);
    await drag(page.getByRole("button",{name:"Γυαλιστερό σχήμα"}).nth(0),yellow);
    await drag(page.getByRole("button",{name:"Γυαλιστερό σχήμα"}).nth(0),yellow);
    await expect(page.getByText(/Τα βρήκες όλα/)).toBeVisible();
  });

  test("music is free play first and has an optional memory challenge", async ({ page }) => {
    await open(page);
    await page.getByRole("button",{name:/4–5/}).first().click();
    await page.getByRole("button",{name:/Παίζω τώρα/}).click();
    await page.getByRole("heading",{name:"Η μπάντα του Πισιπούκ"}).click();
    const notes=page.locator(".pw15-music-stage button");
    await notes.nth(0).click(); await notes.nth(1).click();
    await expect(page.getByText(/2 ήχοι/)).toBeVisible();
    await page.getByRole("button",{name:/Ακούω και επαναλαμβάνω/}).click();
    await expect(page.getByText(/Άκου και μετά/)).toBeVisible();
  });

  test("story order and nature hunt are genuinely interactive", async ({ page }) => {
    await open(page);
    await page.getByRole("button",{name:/4–5/}).first().click();
    await page.getByRole("button",{name:/Παίζω τώρα/}).click();
    await page.getByRole("heading",{name:"Φτιάχνω την ιστορία"}).click();
    const scenes=page.locator(".pw15-story-options button");
    await scenes.nth(2).click(); await scenes.nth(0).click(); await scenes.nth(1).click();
    await expect(page.getByText(/Άκου τώρα/)).toBeVisible();
    await page.getByRole("button",{name:/Πίσω/}).first().click();

    await page.getByRole("button",{name:"Εξερευνώ"}).first().click();
    const spots=page.locator(".pw15-explore>button");
    for(let i=0;i<await spots.count();i++) await spots.nth(i).click();
    await expect(page.getByText(/Τα βρήκες όλα/)).toBeVisible();
  });

  test("atelier supports free touch drawing", async ({ page }) => {
    await open(page);
    await page.getByRole("button",{name:/Atelier/}).first().click();
    const canvas=page.getByLabel("Καμβάς ζωγραφικής");
    const b=await canvas.boundingBox();
    if(!b) throw new Error("canvas missing");
    await page.mouse.move(b.x+120,b.y+120);await page.mouse.down();await page.mouse.move(b.x+300,b.y+250,{steps:10});await page.mouse.up();
    await expect(page.getByRole("button",{name:/καθαρίζω/})).toBeVisible();
  });

  test("mobile layout remains app-like", async ({ page }) => {
    await page.setViewportSize({width:390,height:844});
    await open(page);
    await expect(page.locator(".pw15-mobile-nav")).toBeVisible();
    await page.getByRole("button",{name:"Παίζω"}).last().click();
    await expect(page.getByRole("heading",{name:"Παίζω με τον Πισιπούκ"})).toBeVisible();
  });
});
