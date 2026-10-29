import { expect, test } from "@playwright/test";
import fs from "node:fs";
const BASE=process.env.PRESCHOOL_BASE_URL||"http://127.0.0.1:4173";
const DIR="test-results/pisipouk-premium-visual";
test("captures actual illustrated preschool home, game and paint studio at phone and desktop",async({page})=>{
 fs.mkdirSync(DIR,{recursive:true});
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:width===390?844:950});
  await page.goto(BASE+"/virtual-preschool",{waitUntil:"networkidle"});
  await expect(page.getByRole("heading",{name:/μαγική ανακάλυψη/i})).toBeVisible();
  await page.screenshot({path:DIR+"/home-"+width+".png",fullPage:true,animations:"disabled"});
  await page.getByRole("button",{name:"Παιχνίδια"}).click();
  await expect(page.locator(".premium-domain-card").first()).toBeVisible();
  await page.screenshot({path:DIR+"/games-"+width+".png",fullPage:true,animations:"disabled"});
  await page.getByRole("button",{name:"Κατασκευές"}).click();
  await page.locator(".premium-tile").first().click();
  await expect(page.locator(".premium-paper")).toBeVisible();
  await page.screenshot({path:DIR+"/atelier-"+width+".png",fullPage:true,animations:"disabled"});
 }
});
