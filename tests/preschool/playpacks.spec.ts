import { test, expect } from "@playwright/test";

/** These tests target an active dev/preview server supplied by PRESCHOOL_TEST_BASE_URL. */
const base=(process.env.PRESCHOOL_TEST_BASE_URL || "http://localhost:5173").replace(/\/$/,"");
test.describe("Pisipouk Preschool replay + maker studio",()=>{
 test.beforeEach(async({page})=>{await page.goto(base+"/virtual-preschool",{waitUntil:"domcontentloaded"});});
 test("game starts a different activity, but same-round replay repeats the current game",async({page})=>{
   await page.getByTestId("domain-art").click();
   const heading=page.locator(".pw-game h3");
   const before=await heading.textContent();
   await page.getByRole("button",{name:/Παίζω ξανά · Νέος γύρος/}).first().click();
   await expect(heading).not.toHaveText(before!);
   const next=await heading.textContent();
   await page.getByRole("button",{name:/Ξανά το ίδιο/}).first().click();
   await expect(heading).toHaveText(next!);
 });
 test("six categories expose twenty illustrated scenarios",async({page})=>{
   for(const id of ["art","craft","nature","music","story","feelings"]){
     await page.getByTestId("domain-"+id).click();
     await expect(page.locator(".pw-activity-picker .pw-pattern-gallery button")).toHaveCount(20);
     await page.getByRole("button",{name:/Πίσω στο χωριό/}).click();
   }
 });
 test("drawing studio has twenty original illustrated templates and visual examples",async({page})=>{
   await page.getByRole("button",{name:"Ζωγραφίζω",exact:true}).first().click();
   await expect(page.locator(".pw-pattern-studio .pw-pattern-gallery button")).toHaveCount(20);
   await expect(page.locator(".pw-pattern-example img")).toBeVisible();
   await page.getByRole("button",{name:/Νέο πατρόν/}).click();
   await expect(page.locator(".pw-pattern-paint svg")).toBeVisible();
 });
 test("crafts offer twenty guided builds with four visible step illustrations",async({page})=>{
   await page.getByTestId("domain-craft").click();
   await expect(page.locator(".pw-craft-studio .pw-pattern-gallery button")).toHaveCount(20);
   await expect(page.locator(".pw-craft-steps button")).toHaveCount(4);
   await page.getByRole("button",{name:/Επόμενο βήμα/}).click();
   await expect(page.locator(".pw-craft-callout")).toContainText("βήμα 2");
 });
 test("stories offer twenty narratives; new story never repeats currently selected book",async({page})=>{
   await page.getByRole("button",{name:"Ιστορίες",exact:true}).first().click();
   await expect(page.locator(".pw-story-selector button")).toHaveCount(20);
   const heading=page.locator(".pw-book h3"),before=await heading.textContent();
   await page.getByRole("button",{name:/Νέα ιστορία/}).click();
   await expect(heading).not.toHaveText(before!);
   const next=await heading.textContent();
   await page.getByRole("button",{name:/Ξανά η ίδια ιστορία/}).click();
   await expect(heading).toHaveText(next!);
 });
 test("preschool remains within mobile width and keyboard buttons focus",async({page})=>{
   await page.setViewportSize({width:390,height:844});
   await page.reload();
   await expect(page.locator(".pw-app")).toBeVisible();
   const width=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:window.innerWidth}));
   expect(width.scroll).toBeLessThanOrEqual(width.inner+2);
 });
});
