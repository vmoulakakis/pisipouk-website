import { test, expect } from "@playwright/test";
const host = (process.env.PISIPOUK_PREVIEW_URL || "http://localhost:5173").replace(/\/$/, "");
const base = host + "/pisipouk-v2-staging";
test.describe("Pisipouk World 2.0: age-first staging smoke", () => {
 test("welcome has four selectable age worlds", async ({page})=>{
  await page.goto(base+"/");
  await expect(page.getByRole("link",{name:/Μικροί εξερευνητές/})).toBeVisible();
  await expect(page.getByRole("link",{name:/Χρωματιστές ανακαλύψεις/})).toBeVisible();
  await expect(page.getByRole("link",{name:/Μικροί δημιουργοί/})).toBeVisible();
  await expect(page.getByRole("link",{name:/Μεγάλοι εφευρέτες/})).toBeVisible();
 });
 for(const age of ["2-3","3-4","4-5","5-6"]){
  test("age world direct URL, navigation, return: "+age, async ({page})=>{
   await page.goto(base+"/ages/"+age);
   await expect(page.getByRole("link",{name:/Παίζω/}).first()).toBeVisible();
   await page.getByRole("link",{name:"Παιχνίδι"}).click();
   await expect(page).toHaveURL(new RegExp("/ages/"+age+"/game"));
   await page.getByRole("link",{name:"Ο κόσμος μου"}).click();
   await expect(page).toHaveURL(new RegExp("/ages/"+age));
  });
 }
 test("age 2-3 bubbles pop and new round refreshes",async ({page})=>{
  await page.goto(base+"/ages/2-3/game");
  await page.locator(".pw2-bubble").first().click();
  await expect(page.locator(".pw2-scene-score")).toContainText("1 / 5");
  await page.getByRole("button",{name:/Νέες φούσκες/}).click();
  await expect(page.locator(".pw2-scene-score")).toContainText("0 / 6");
 });
 test("age 3-4 paint primary colors and discover orange",async ({page})=>{
  await page.goto(base+"/ages/3-4/game");
  await page.getByRole("button",{name:/Ρίχνω Κόκκινο/}).click();
  await page.getByRole("button",{name:/Ρίχνω Κίτρινο/}).click();
  await expect(page.locator(".pw2-mix-label")).toContainText("Πορτοκαλί");
  await page.getByRole("button",{name:/Άλλη ανάμειξη/}).click();
  await expect(page.locator(".pw2-mix-label")).toContainText("Διάλεξε");
 });
 test("age 4-5 bridge chooses matching log lengths",async ({page})=>{
  await page.goto(base+"/ages/4-5/game");
  await page.getByRole("button",{name:/Κενό 1/}).click();
  await page.getByRole("button",{name:"Μακρύ ξύλο"}).click();
  await page.getByRole("button",{name:/Κενό 2/}).click();
  await page.getByRole("button",{name:"Κοντό ξύλο"}).click();
  await page.getByRole("button",{name:/Κενό 3/}).click();
  await expect(page.locator(".pw2-bridge-space.built")).toHaveCount(3);
  await page.getByRole("button",{name:/Δοκίμασε τη γέφυρα/}).click();
  await expect(page.locator(".pw2-response")).toContainText("πέρασε", {timeout:6000});
 });
 test("age 5-6 robot follows six-command path to star",async ({page})=>{
  await page.goto(base+"/ages/5-6/game");
  for(let i=0;i<3;i++)await page.getByRole("button",{name:"Προσθήκη right"}).click();
  for(let i=0;i<3;i++)await page.getByRole("button",{name:"Προσθήκη down"}).click();
  await page.getByRole("button",{name:/Εκτέλεση!/}).click();
  await expect(page.locator(".pw2-response")).toContainText("έφτασε στο αστέρι",{timeout:9000});
 });
 test("A4 sheet visible and original SVG downloadable",async ({page})=>{
  await page.goto(base+"/ages/2-3/patterns");
  await expect(page.locator(".pw2-a4-svg")).toBeVisible();
  const downloadPromise=page.waitForEvent("download");
  await page.getByRole("button",{name:/Λήψη SVG/}).click();
  const download=await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/pisipouk-patron-1\.svg/);
 });
 test("age craft has four navigable steps",async ({page})=>{
  await page.goto(base+"/ages/4-5/crafts");
  await expect(page.getByText("ΒΗΜΑ 1 / 4")).toBeVisible();
  await page.getByRole("button",{name:/Επόμενο βήμα/}).click();
  await expect(page.getByText("ΒΗΜΑ 2 / 4")).toBeVisible();
 });
 test("age-specific story has paginated Greek copy",async ({page})=>{
  await page.goto(base+"/ages/5-6/stories");
  await expect(page.getByText("ΣΕΛΙΔΑ 1 ΑΠΟ 5")).toBeVisible();
  await page.getByRole("button",{name:/Επόμενη σελίδα/}).click();
  await expect(page.getByText("ΣΕΛΙΔΑ 2 ΑΠΟ 5")).toBeVisible();
 });
});
