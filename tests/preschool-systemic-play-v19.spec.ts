import {test,expect} from "@playwright/test";
import type {Page} from "@playwright/test";

const base=process.env.PISIPOUK_PREVIEW_URL||"http://127.0.0.1:3000";
async function games(page:Page){
 await page.goto(base+"/virtual-preschool");
 await page.getByRole("button",{name:"Παιχνίδια",exact:true}).first().click();
 await expect(page.getByRole("heading",{name:"Ο κήπος που αλλάζει μαζί σου"})).toBeVisible();
}
test.describe("Pisipouk systemic play experiences",()=>{
 test("garden: sow, rain, grow, pollinate and inspect",async({page})=>{
  await games(page);
  const world=page.locator(".lg19-canvas");
  await expect(page.locator(".lg19-plants > g")).toHaveCount(0);
  const b=await world.boundingBox();if(!b)throw Error("SVG bounds unavailable");
  // SVG preserveAspectRatio='xMidYMid meet' in a responsive world.
  const scale=Math.min(b.width/1000,b.height/550),left=b.x+(b.width-1000*scale)/2,top=b.y+(b.height-550*scale)/2;
  await page.mouse.click(left+142*scale,top+425*scale);
  await expect(page.locator(".lg19-plants > g")).toHaveCount(1);
  await page.getByRole("button",{name:"Βροχή"}).first().click();
  await expect(page.getByText("Μαλακή βροχή")).toBeVisible();
  await page.waitForTimeout(1800);
  const growth=Number(await page.locator("[data-plant]").first().getAttribute("data-growth"));
  expect(growth).toBeGreaterThan(.045);
  await page.getByRole("button",{name:"Παρατηρώ"}).click();
  await page.mouse.click(left+142*scale,top+320*scale);
  await expect(page.locator(".lg19-message")).toContainText("Μαργαρίτα");
 });
 test("garden: undo a planted object",async({page})=>{
  await games(page);const svg=page.locator(".lg19-canvas"),b=await svg.boundingBox();if(!b)throw Error("SVG bounds unavailable");
  const scale=Math.min(b.width/1000,b.height/550);await page.mouse.click(b.x+142*scale,b.y+425*scale);
  await expect(page.locator(".lg19-plants > g")).toHaveCount(1);
  await page.locator(".lg19-meta button[title='Αναίρεση']").click();
  await expect(page.locator(".lg19-plants > g")).toHaveCount(0);
 });
 test("builder: adds objects, allows pause and offers wind",async({page})=>{
  await games(page);
  const builder=page.locator(".bp19");
  await expect(builder.getByRole("heading",{name:"Η πολιτεία των μικρών κατασκευαστών"})).toBeVisible();
  await builder.getByRole("button",{name:"Νέο"}).click();
  await expect(builder.locator(".bp19-counter")).toContainText("Υλικά: 1");
  await builder.getByRole("button",{name:"Παύση"}).click();
  await expect(builder.getByRole("button",{name:"Κίνηση"})).toBeVisible();
  await builder.getByRole("button",{name:"Φύσηξε δεξιά"}).click();
  await expect(builder.getByText("Άνεμος δεξιά")).toBeVisible();
 });
});
