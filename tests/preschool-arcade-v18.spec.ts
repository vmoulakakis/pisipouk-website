import { test, expect } from "@playwright/test";

const base = process.env.PISIPOUK_PREVIEW_URL || "http://127.0.0.1:3000";
async function enterGames(page:import("@playwright/test").Page){
  await page.goto(base+"/virtual-preschool");
  await page.getByRole("button",{name:/Παιχνίδια/}).first().click();
  await expect(page.getByRole("heading",{name:"Παιχνίδια που ζωντανεύουν!"})).toBeVisible();
}
test("HTML5 arcade contains eight interactive modes", async ({page})=>{
 await enterGames(page);
 const grid=page.locator(".pa18-card");
 await expect(grid).toHaveCount(8);
 await expect(page.getByRole("button",{name:/Ο κήπος ξυπνά!/})).toBeVisible();
 await expect(page.getByRole("button",{name:/Το σπίτι των σχημάτων/})).toBeVisible();
});
test("garden game blooms when tapped, without a quiz", async ({page})=>{
 await enterGames(page);
 await page.getByRole("button",{name:/Ο κήπος ξυπνά!/}).click();
 const canvas=page.locator(".pa18-stage canvas");
 await expect(canvas).toBeVisible();
 const b=await canvas.boundingBox();if(!b)throw Error("Canvas not measurable");
 await canvas.click({position:{x:b.width*155/960,y:b.height*325/540}});
 await expect(page.locator(".pa18-meter")).toContainText("1/");
});
test("color sorting works by actual pointer drag",async({page})=>{
 await enterGames(page);
 await page.getByRole("button",{name:/Τα καλάθια των χρωμάτων/}).click();
 const canvas=page.locator(".pa18-stage canvas"),b=await canvas.boundingBox();if(!b)throw Error("Canvas not measurable");
 const xy=(x:number,y:number)=>({x:b.x+b.width*x/960,y:b.y+b.height*y/540});
 const a=xy(120,210),c=xy(240,425);
 await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(c.x,c.y,{steps:15});await page.mouse.up();
 await expect(page.locator(".pa18-meter")).toContainText("1/");
});
test("Atelier provides sixteen individual printable templates",async({page})=>{
 await page.goto(base+"/virtual-preschool");
 await page.getByRole("button",{name:"Atelier",exact:true}).first().click();
 await expect(page.locator(".at360-templates button")).toHaveCount(16);
 await page.getByRole("button",{name:/Ουράνιο τόξο/}).click();
 await expect(page.getByRole("img",{name:/Διαδραστικό πατρόν: Ουράνιο τόξο/})).toBeVisible();
});
