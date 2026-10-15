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
 test("20 authored line-art patterns available and A4 SVG downloadable",async ({page})=>{
  await page.goto(base+"/ages/2-3/patterns");
  await expect(page.locator(".pw2-pattern-gallery button")).toHaveCount(20);
  await expect(page.locator(".pw2-pattern-live svg")).toBeVisible();
  const downloadPromise=page.waitForEvent("download");
  await page.getByRole("button",{name:/Α4 SVG/}).click();
  const download=await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/pisipouk-p1-a4\.svg/);
 });
 test("20 crafts and four navigable instructions",async ({page})=>{
  await page.goto(base+"/ages/4-5/crafts");
  await expect(page.locator(".pw2-pattern-gallery button")).toHaveCount(20);
  await expect(page.locator(".pw2-step-indicator")).toContainText("Βήμα 1 από 4");
  await page.getByRole("button",{name:/Επόμενο/}).click();
  await expect(page.locator(".pw2-step-indicator")).toContainText("Βήμα 2 από 4");
 });
 test("20 original Greek narratives, pages and ending choice",async ({page})=>{
  await page.goto(base+"/ages/5-6/stories");
  await expect(page.locator(".pw2-pattern-gallery button")).toHaveCount(20);
  await expect(page.locator(".pw2-story-reader .pw2-overline")).toContainText("ΣΕΛΙΔΑ 1 / 4");
  await page.getByRole("button",{name:/Επόμενη σελίδα/}).click();
  await expect(page.locator(".pw2-story-reader .pw2-overline")).toContainText("ΣΕΛΙΔΑ 2 / 4");
 });
 test("Phaser Matter engine creates a canvas and adds a simulated fruit",async ({page})=>{
  await page.goto(base+"/ages/2-3/physics");
  await expect(page.locator(".pw2-physics-canvas canvas")).toBeVisible({timeout:30000});
  await page.getByRole("button",{name:/Ρίξε ένα μήλο/}).click();
  await expect(page.locator(".pw2-physics-controls b")).toContainText("1/20");
  await page.getByRole("button",{name:/Καθάρισε/}).click();
  await expect(page.locator(".pw2-physics-controls b")).toContainText("0/20");
 });

});
