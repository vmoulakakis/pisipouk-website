import {test,expect} from "@playwright/test";
const BASE=process.env.PRESCHOOL_BASE_URL||"http://127.0.0.1:4173";
test("atelier has 20 age-specific patterns, supports painting and PNG output",async({page})=>{
 await page.goto(BASE+"/virtual-preschool");
 await page.getByRole("button",{name:"Κατασκευές"}).click();
 await expect(page.locator(".ps-pattern-rail button")).toHaveCount(20);
 await expect(page.locator(".ps-a4-frame canvas")).toBeVisible();
 const canvas=page.locator(".ps-a4-frame canvas");const b=await canvas.boundingBox();expect(b).toBeTruthy();
 await page.mouse.move(b!.x+b!.width/2,b!.y+b!.height/2);await page.mouse.down();await page.mouse.move(b!.x+b!.width*.7,b!.y+b!.height*.7,{steps:7});await page.mouse.up();
 const file=page.waitForEvent("download");await page.getByRole("button",{name:/Αποθήκευση ζωγραφιάς/}).click();expect((await file).suggestedFilename()).toMatch(/\.png$/);
 await page.getByRole("button",{name:/Αναίρεση/}).click();
 await page.getByRole("button",{name:/Καθαρισμός/}).click();
 const outline=page.waitForEvent("download");await page.getByRole("button",{name:/Κενό πατρόν SVG/}).click();expect((await outline).suggestedFilename()).toMatch(/\.svg$/);
});
test("age switching yields 20 drawing templates per age",async({page})=>{
 await page.goto(BASE+"/virtual-preschool");await page.getByRole("button",{name:"Κατασκευές"}).click();
 for(const age of ["2–3","3–4","4–5","5–6"]){
  await page.getByRole("button",{name:new RegExp(age+" ετών")}).click();
  await expect(page.locator(".ps-pattern-rail button")).toHaveCount(20);
 }
});
test("every replay generates a valid new game scenario",async({page})=>{
 await page.goto(BASE+"/virtual-preschool");await page.getByRole("button",{name:"Παιχνίδια"}).click();
 await page.getByRole("button",{name:/Το ουράνιο τόξο/}).click();
 for(let round=0;round<5;round++){
  for(let q=0;q<3;q++){
   const prompt=await page.locator(".ps-game-request p").innerText();
   const color=prompt.match(/Βρες το (.+)!/)?.[1];expect(color).toBeTruthy();
   await page.getByRole("button",{name:color!,exact:true}).click();
  }
  await expect(page.getByRole("heading",{name:/Τα κατάφερες/})).toBeVisible();
  await page.getByRole("button",{name:/Παίζω ξανά/}).click();
 }
});
