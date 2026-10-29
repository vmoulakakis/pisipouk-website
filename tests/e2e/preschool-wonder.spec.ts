import {expect,test} from "@playwright/test";
const BASE=process.env.PRESCHOOL_BASE_URL||"http://127.0.0.1:4173";
test.describe("Preschool Wonder legacy integration with premium studios",()=>{
 test("new route and original illustrated hub load without runtime exceptions",async({page})=>{
  const errors:string[]=[];page.on("pageerror",error=>errors.push(error.message));
  await page.goto(BASE+"/virtual-preschool");
  await expect(page.getByRole("heading",{name:/μαγική ανακάλυψη/i})).toBeVisible();
  await page.getByRole("button",{name:/Παιχνίδια/}).first().click();
  await expect(page.getByRole("heading",{name:/καινούργια περιπέτεια/i})).toBeVisible();
  expect(errors).toEqual([]);
 });
 test("age selection affects available domain count",async({page})=>{
  await page.goto(BASE+"/virtual-preschool");
  await page.getByRole("button",{name:/2–3 ετών/}).click();
  await page.getByRole("button",{name:/Παιχνίδια/}).first().click();
  await expect(page.locator(".premium-domain-card")).toHaveCount(6);
  await page.getByRole("button",{name:/5–6 ετών/}).click();
  await expect(page.locator(".premium-domain-card")).toHaveCount(10);
 });
 test("keeps the 16 existing learning worlds intact",async({page})=>{
  await page.goto(BASE+"/virtual-preschool");
  await page.getByRole("button",{name:/16 κόσμοι/}).first().click();
  await expect(page.getByRole("button",{name:/Πίσω στη νέα αρχική/})).toBeVisible();
  await page.getByRole("button",{name:/Πίσω στη νέα αρχική/}).click();
  await expect(page.getByRole("heading",{name:/μαγική ανακάλυψη/i})).toBeVisible();
 });
 test("existing free drawing and stories remain available",async({page})=>{
  await page.goto(BASE+"/virtual-preschool");
  await page.getByRole("button",{name:"Ζωγραφική"}).click();
  await expect(page.locator("canvas[aria-label='Καμβάς ζωγραφικής']")).toBeVisible();
  await page.getByRole("button",{name:"Ιστορίες"}).click();
  await expect(page.getByText("ΣΕΛΙΔΑ 1 / 5")).toBeVisible();
 });
 test("other public pages return success responses",async({page})=>{
  for(const route of ["/","/virtual-preschool-grace","/learning-games"]){
   const response=await page.goto(BASE+route);expect(response?.ok()).toBeTruthy();
  }
 });
});
