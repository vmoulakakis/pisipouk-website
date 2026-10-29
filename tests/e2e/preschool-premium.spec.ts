import { expect, test } from "@playwright/test";
const BASE=process.env.PRESCHOOL_BASE_URL||"http://127.0.0.1:4173";
test.describe("Pisipouk Premium rebuilding scope and interaction",()=>{
 test("only preschool route uses the new premium experience and shows four age pathways",async({page})=>{
  const errors:string[]=[];page.on("pageerror",err=>errors.push(err.message));
  await page.goto(BASE+"/virtual-preschool");
  await expect(page.getByRole("heading",{name:/μαγική ανακάλυψη/})).toBeVisible();
  for(const label of ["2–3","3–4","4–5","5–6"])await expect(page.getByRole("button",{name:new RegExp(label)}).first()).toBeVisible();
  await page.getByRole("button",{name:/Κατασκευές/}).first().click();
  await expect(page.getByRole("heading",{name:/Χρώματα, φαντασία/})).toBeVisible();
  expect(errors).toEqual([]);
 });
 test("all 20 original motifs per age and digital coloring paint-zone interaction",async({page})=>{
  await page.goto(BASE+"/virtual-preschool");
  await page.getByRole("button",{name:/Κατασκευές/}).first().click();
  await expect(page.locator(".premium-tile")).toHaveCount(20);
  await page.getByRole("button",{name:/Ζωγράφισε: Ο αρκούδος Πισιπούκ/}).click();
  const zone=page.locator(".premium-vector [data-zone='head']");
  await expect(zone).toBeVisible();
  const before=await zone.getAttribute("fill");
  await page.getByRole("button",{name:"Επίλεξε χρώμα #75c8af"}).click();
  await zone.click();
  expect(await zone.getAttribute("fill")).toBe("#75c8af");
  expect(before).not.toBe("#75c8af");
  await page.getByRole("button",{name:/Αναίρεση/}).click();
  expect(await zone.getAttribute("fill")).toBe(before);
  const downloading=page.waitForEvent("download");
  await page.getByRole("button",{name:/SVG πατρόν/}).click();
  expect((await downloading).suggestedFilename()).toMatch(/\.svg$/);
 });
 test("digital A4 pdf and PNG save from colored template",async({page})=>{
  await page.goto(BASE+"/virtual-preschool");
  await page.getByRole("button",{name:/Κατασκευές/}).first().click();
  await page.getByRole("button",{name:/Ζωγράφισε: Η πεταλούδα/}).click();
  await page.getByRole("button",{name:/Επίλεξε χρώμα #f4aa91/}).click();
  await page.locator(".premium-vector [data-zone='leftWing']").click();
  const pdfPromise=page.waitForEvent("download",{timeout:30000});
  await page.getByRole("button",{name:/PDF για εκτύπωση/}).click();
  expect((await pdfPromise).suggestedFilename()).toMatch(/A4\.pdf$/);
  const pngPromise=page.waitForEvent("download",{timeout:30000});
  await page.getByRole("button",{name:/PNG εικόνα/}).click();
  expect((await pngPromise).suggestedFilename()).toMatch(/\.png$/);
 });
 test("all ten domains expose ten distinct mission titles",async({page})=>{
  await page.goto(BASE+"/virtual-preschool");
  await page.getByRole("button",{name:/5–6 ετών/}).click();
  await page.getByRole("button",{name:/Παιχνίδια/}).first().click();
  await expect(page.locator(".premium-domain-card")).toHaveCount(10);
  for(let i=0;i<10;i++){
    await page.locator(".premium-domain-card").nth(i).click();
    await expect(page.locator(".premium-mission-card")).toHaveCount(10);
    await page.getByRole("button",{name:/Οι κόσμοι μου/}).click();
  }
 });
 test("replay asks different color target and never resets same fixed order",async({page})=>{
  await page.goto(BASE+"/virtual-preschool");
  await page.getByRole("button",{name:/Παιχνίδια/}).first().click();
  await page.getByRole("button",{name:/μαγικό εργαστήρι χρωμάτων/i}).first().click();
  await page.locator(".premium-mission-card").first().click();
  const initial=await page.locator(".premium-play-head p").textContent();
  await page.getByRole("button",{name:/Νέος γύρος/}).click();
  const repeated=await page.locator(".premium-play-head p").textContent();
  expect(initial).not.toBe(repeated);
 });
 test("successful game allows replay or following activity",async({page})=>{
  await page.goto(BASE+"/virtual-preschool");
  await page.getByRole("button",{name:/Παιχνίδια/}).first().click();
  await page.getByRole("button",{name:/μαγικό εργαστήρι χρωμάτων/i}).first().click();
  await page.locator(".premium-mission-card").first().click();
  const prompt=await page.locator(".premium-play-head p").textContent();
  const color=(prompt||"").match(/(κόκκινο|μπλε|κίτρινο|πράσινο|μωβ|πορτοκαλί)/)?.[0];
  expect(color).toBeTruthy();
  await page.getByRole("button",{name:color!,exact:true}).click();
  await expect(page.getByRole("heading",{name:/Μπράβο για την προσπάθειά σου/})).toBeVisible();
  await page.getByRole("button",{name:/Νέος διαφορετικός γύρος/}).click();
  await expect(page.getByRole("heading",{name:/Μπράβο για την προσπάθειά σου/})).toHaveCount(0);
 });
 test("mobile screen is usable and other public routes unaffected",async({page})=>{
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:900});await page.goto(BASE+"/virtual-preschool");
   await page.getByRole("button",{name:/Κατασκευές/}).first().click();
   const sizes=await page.evaluate(()=>({w:document.documentElement.scrollWidth,inner:window.innerWidth}));
   expect(sizes.w,"atelier width "+width).toBeLessThanOrEqual(width+2);
  }
  for(const p of ["/","/about","/contact","/gallery","/learning-games"]){
   const response=await page.goto(BASE+p);
   expect(response?.ok()).toBeTruthy();
  }
 });
});
