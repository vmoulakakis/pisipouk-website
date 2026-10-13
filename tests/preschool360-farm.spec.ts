import {test,expect} from "@playwright/test";
const base=process.env.PISIPOUK_PREVIEW_URL||"http://127.0.0.1:3000";

test.describe("Μικροί Δημιουργοί — WebGL farm vertical slice",()=>{
 test("local threejs assets create real WebGL world with start and orbit controls",async({page})=>{
   const errors:string[]=[];page.on("pageerror",error=>errors.push(error.message));
   await page.goto(base+"/preschool/360/cozy-garden.html",{waitUntil:"domcontentloaded"});
   await expect(page.locator("body")).toHaveAttribute("data-game-ready","true",{timeout:25000});
   await expect(page.locator("canvas#farm-canvas")).toBeVisible();
   await page.getByRole("button",{name:/ΠΑΙΖΩ!/}).click();
   await expect(page.locator("body")).toHaveAttribute("data-playable","true");
   await expect(page.locator(".farm-overlay")).toBeHidden();
   await page.getByRole("button",{name:"Περιστροφή αριστερά"}).click();
   await page.getByRole("button",{name:"Περιστροφή δεξιά"}).click();
   expect(errors).toEqual([]);
 });
 test("random play provides 3 distinct modes and a no-fail new mission",async({page})=>{
   await page.goto(base+"/preschool/360/cozy-garden.html?seed=12345");
   await expect(page.locator("body")).toHaveAttribute("data-game-ready","true",{timeout:25000});
   await page.locator("#start").click();
   await page.locator('[data-game="A01"]').click();
   await expect(page.locator("#quest-title")).toHaveText("Τα Καλάθια των Χρωμάτων");
   await expect(page.locator("#progress")).toContainText("0 /");
   await page.locator('[data-game="B05"]').click();
   await expect(page.locator("#quest-title")).toHaveText("Μετράω τα Μήλα");
   await page.locator('[data-game="C09"]').click();
   await expect(page.locator("#quest-title")).toHaveText("Το Μικρό Μου Περιβολάκι");
   await page.locator("#next").click();
   await expect(page.locator("body")).toHaveAttribute("data-playable","true");
 });
 test("gardening lets children select planting, building, painting and calm mode",async({page})=>{
   await page.goto(base+"/preschool/360/cozy-garden.html");
   await expect(page.locator("body")).toHaveAttribute("data-game-ready","true",{timeout:25000});
   await page.locator("#free-start").click();
   await page.locator('[data-tool="build"]').click();
   await expect(page.locator("#status")).toContainText("ξύλινο");
   await page.locator('[data-tool="paint"]').click();
   await expect(page.locator("#paint-colors")).toBeVisible();
   await page.locator('[data-paint="purple"]').click();
   await expect(page.locator('[data-paint="purple"]')).toHaveClass(/chosen/);
   await page.locator('[data-tool="plant"]').click();
   await expect(page.locator("#paint-colors")).toBeHidden();
   await page.locator("#calm").click();
   await expect(page.locator("#calm")).toHaveAttribute("aria-pressed","true");
 });
 test("6 pillars and 24 activities appear in the preschool route",async({page})=>{
   await page.goto(base+"/virtual-preschool");
   await page.getByRole("button",{name:/Παιχνίδια/}).first().click();
   await expect(page.getByRole("heading",{name:"Μικροί Δημιουργοί"})).toBeVisible();
   const tabs=page.locator(".lc360-pillars button");
   await expect(tabs).toHaveCount(6);
   for(const label of ["ΚΑΤΑΣΚΕΥΑΖΩ","ΔΗΜΙΟΥΡΓΩ","ΠΑΙΖΩ","ΖΩΓΡΑΦΙΖΩ","ΤΡΑΓΟΥΔΩ","ΙΣΤΟΡΙΕΣ"]){
     await page.getByRole("tab",{name:new RegExp(label)}).click();
     await expect(page.locator(".lc360-activities .lc360-activity")).toHaveCount(4);
   }
 });
});
