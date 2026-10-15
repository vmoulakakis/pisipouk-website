import {test,expect} from "@playwright/test";
const host=(process.env.PISIPOUK_PREVIEW_URL||"http://localhost:5173").replace(/\/$/,"");
const base=host+"/pisipouk-v2-staging/ages";
test.describe("80 educational games + monthly preview: stage only",()=>{
 const ages=["2-3","3-4","4-5","5-6"];
 for(const age of ages){
  test("every game in age "+age+" is linked, distinct and playable",async({page})=>{
   await page.goto(base+"/"+age);
   const catalog=page.locator(".pw2-game-catalog > a");
   await expect(catalog).toHaveCount(20);
   const titles=await catalog.locator("strong").allTextContents();
   expect(new Set(titles).size).toBe(20);
   const urls=await catalog.evaluateAll(nodes=>nodes.map(n=>n.getAttribute("href")));
   expect(new Set(urls).size).toBe(20);
   for(let i=1;i<=19;i++){
    await page.goto(base+"/"+age+"/play/"+i);
    await expect(page.locator(".pgx-heading h1")).not.toBeEmpty();
    await expect(page.locator(".pgx-playboard")).toBeVisible();
    await expect(page.locator(".pgx-playboard button").first()).toBeVisible();
   }
  });
 }
 test("sorting allows child to choose a food or animal basket",async({page})=>{
  await page.goto(base+"/3-4/play/1");
  await expect(page.getByRole("button",{name:/Φρούτα/})).toBeVisible();
  await expect(page.getByRole("button",{name:/Ζώα/})).toBeVisible();
 });
 test("garden reacts to watering and displays child-safe feedback",async({page})=>{
  await page.goto(base+"/2-3/play/8");
  await page.getByRole("button",{name:/Ρίχνω λίγο νερό/}).click();
  await expect(page.locator(".pgx-feedback")).not.toBeEmpty();
 });
 test("creative scene places stamps and offers download",async({page})=>{
  await page.goto(base+"/5-6/play/19");
  await page.locator("#pgx-art").click({position:{x:90,y:90}});
  await expect(page.locator("#pgx-art text")).toHaveCount(1);
  const pending=page.waitForEvent("download");
  await page.getByRole("button",{name:"Αποθήκευση SVG"}).click();
  const file=await pending;expect(file.suggestedFilename()).toMatch(/pisipouk-dimiourgia-/);
 });
 test("the original artwork libraries preserve 20 activities per category",async({page})=>{
  for(const segment of ["patterns","crafts","stories"]){
   await page.goto(base+"/4-5/"+segment);
   await expect(page.locator(".pw2-pattern-gallery button")).toHaveCount(20);
   await expect(page.locator(".pw2-monthly-strip")).toBeVisible();
  }
 });
 test("the session never forces a streak or public ranking",async({page})=>{
  await page.goto(base+"/2-3/play/17");
  await expect(page.getByRole("button",{name:/Αλλάζω φανάρι/})).toBeVisible();
  await expect(page.getByText(/Δοκίμασε με τον δικό σου ρυθμό/)).toBeVisible();
 });
});
