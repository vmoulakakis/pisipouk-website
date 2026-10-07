import { expect, test, type Locator, type Page } from "@playwright/test";

const BASE_URL = process.env.PRESCHOOL_BASE_URL || "http://127.0.0.1:4173";

async function openApp(page: Page) {
  await page.goto(`${BASE_URL}/virtual-preschool`, { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Μαθαίνουμε.")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole("img", { name: "Ο Πισιπούκ το αρκουδάκι" }).first()).toBeVisible();
}

async function drag(locator: Locator, target: Locator) {
  const from = await locator.boundingBox();
  const to = await target.boundingBox();
  if (!from || !to) throw new Error("Missing drag bounds");
  await locator.page().mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await locator.page().mouse.down();
  await locator.page().mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 12 });
  await locator.page().mouse.up();
}

test.describe.serial("Pisipouk V14 magical preschool", () => {
  test("magical home keeps age-first navigation and Pisipouk as the hero", async ({ page }) => {
    await openApp(page);
    for (const label of ["2 ετών","3 ετών","4 ετών","5–6 ετών"]) {
      await expect(page.getByRole("button", { name: new RegExp(label) }).first()).toBeVisible();
    }
    for (const label of ["Διαδραστικά Παιχνίδια","Ζωγραφική & Δημιουργία","Ιστορίες Πισιπούκ","Εξερεύνηση"]) {
      await expect(page.getByRole("button", { name: new RegExp(label) })).toBeVisible();
    }
  });

  test("necklace is a full creation loop: string beads, tie it, then Pisipouk wears it", async ({ page }) => {
    test.setTimeout(90_000);
    await openApp(page);
    await page.getByRole("button", { name: /3 ετών/ }).first().click();
    await page.getByRole("button", { name: /Διαδραστικά Παιχνίδια/ }).click();
    await page.getByRole("heading", { name: "Το Κολιέ του Πισιπούκ" }).click();

    const target = page.locator(".pm-thread-target");
    const beads = page.getByRole("button", { name: "Χάντρα" });
    await expect(beads.first()).toBeVisible();
    for (let i = 0; i < 6; i++) await drag(beads.nth(i % (await beads.count())), target);

    await expect(page.getByRole("button", { name: /Δένω το κολιέ/ })).toBeVisible();
    await page.getByRole("button", { name: /Δένω το κολιέ/ }).click();
    await page.getByRole("button", { name: /Το δίνω στον Πισιπούκ/ }).click();
    await expect(page.getByText(/το φοράω στον λαιμό μου/)).toBeVisible();
    await expect(page.locator(".pm-necklace-worn")).toBeVisible();
  });

  test("feeding game accepts healthy food and gives gentle guidance for a treat", async ({ page }) => {
    await openApp(page);
    await page.getByRole("button", { name: /3 ετών/ }).first().click();
    await page.getByRole("button", { name: /Διαδραστικά Παιχνίδια/ }).click();
    await page.getByRole("heading", { name: "Ταΐζω τον Πισιπούκ" }).click();

    const mouth = page.locator(".pm-feed-mouth");
    await drag(page.getByRole("button", { name: "μπισκότο" }), mouth);
    await expect(page.getByText(/λιχουδιά/)).toBeVisible();

    for (const food of ["μήλο","μπανάνα","καρότο","φράουλα"]) {
      await drag(page.getByRole("button", { name: food }), mouth);
    }
    await expect(page.getByText(/Χόρτασα/)).toBeVisible();
  });

  test("color baskets use real drag/drop and gentle correction", async ({ page }) => {
    await openApp(page);
    await page.getByRole("button", { name: /3 ετών/ }).first().click();
    await page.getByRole("button", { name: /Διαδραστικά Παιχνίδια/ }).click();
    await page.getByRole("heading", { name: "Τα καλάθια των χρωμάτων" }).click();

    const blue = page.getByLabel("Μπλε καλάθι").locator("xpath=..");
    await drag(page.getByRole("button", { name: "κόκκινο μήλο" }).first(), blue);
    await expect(page.getByText(/Κοίτα ξανά το χρώμα/)).toBeVisible();

    const red = page.getByLabel("Κόκκινο καλάθι").locator("xpath=..");
    const yellow = page.getByLabel("Κίτρινο καλάθι").locator("xpath=..");
    while (await page.getByRole("button", { name: "κόκκινο μήλο" }).count()) await drag(page.getByRole("button", { name: "κόκκινο μήλο" }).first(), red);
    while (await page.getByRole("button", { name: "μπλε ψάρι" }).count()) await drag(page.getByRole("button", { name: "μπλε ψάρι" }).first(), blue);
    while (await page.getByRole("button", { name: "κίτρινος ήλιος" }).count()) await drag(page.getByRole("button", { name: "κίτρινος ήλιος" }).first(), yellow);
    await expect(page.getByText(/Τα ταξινόμησες όλα/)).toBeVisible();
  });

  test("music animals supports free play and age-appropriate rhythm challenge", async ({ page }) => {
    await openApp(page);
    await page.getByRole("button", { name: /4 ετών/ }).first().click();
    await page.getByRole("button", { name: /Διαδραστικά Παιχνίδια/ }).click();
    await page.getByRole("heading", { name: "Μουσικά Ζωάκια" }).click();

    const musicians = page.locator(".pm-musician");
    await musicians.nth(0).click();
    await musicians.nth(1).click();
    await expect(page.getByText(/2 ήχοι/)).toBeVisible();
    await page.getByRole("button", { name: /Αντέγραψε τον ρυθμό/ }).click();
    await expect(page.getByText(/Άκου τον ρυθμό/)).toBeVisible();
  });

  test("drawing studio responds to touch-style pointer drawing and tools", async ({ page }) => {
    await openApp(page);
    await page.getByRole("button", { name: /Ζωγραφική & Δημιουργία/ }).click();
    const canvas = page.getByLabel("Καμβάς ελεύθερης ζωγραφικής");
    const box = await canvas.boundingBox();
    if (!box) throw new Error("drawing canvas missing");
    await page.mouse.move(box.x + 120, box.y + 120);
    await page.mouse.down();
    await page.mouse.move(box.x + 300, box.y + 260, { steps: 10 });
    await page.mouse.up();
    await expect(page.getByRole("button", { name: "Καθαρίζω" })).toBeVisible();
  });

  test("stories and exploration are interactive, not static cards", async ({ page }) => {
    await openApp(page);
    await page.getByRole("button", { name: /Ιστορίες Πισιπούκ/ }).click();
    await page.getByRole("button", { name: /Η πρώτη μέρα της μικρής βαρκούλας/ }).click();
    await expect(page.getByText(/Μια μικρή βαρκούλα φοβόταν/)).toBeVisible();
    await page.getByRole("button", { name: "Συνέχεια →" }).click();
    await expect(page.getByText(/άνεμος μπορεί να γίνει φίλος/)).toBeVisible();

    await page.getByRole("button", { name: "Εξερευνώ" }).first().click();
    for (const name of ["Βρες κοχύλι","Βρες αστέρι","Βρες φύλλο","Βρες βαρκούλα","Βρες λουλούδι"]) {
      await page.getByRole("button", { name }).click();
    }
    await expect(page.getByText(/Τα βρήκες όλα/)).toBeVisible();
  });

  test("mobile view keeps app-like navigation and playable content", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openApp(page);
    await expect(page.locator(".pm-bottom-nav")).toBeVisible();
    await page.getByRole("button", { name: "Παίζω" }).last().click();
    await expect(page.getByRole("heading", { name: "Παίζω με τον Πισιπούκ" })).toBeVisible();
  });
});
