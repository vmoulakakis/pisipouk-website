import { test, expect } from "@playwright/test";
const base=process.env.PISIPOUK_WORLD_URL||"http://127.0.0.1:4178/preschool/world360/index.html";
test("village image and all age groups",async({page})=>{
 const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto(base);
 await expect(page.locator("body")).toHaveAttribute("data-game-ready","true");
 await expect(page.locator("body")).toHaveAttribute("data-art-ready","true");
 await expect(page.locator(".spot")).toHaveCount(8);
 for(const [age,label] of [["2-3","2–3"],["3-4","3–4"],["4-5","4–5"],["5-6","5–6"]]){
  await page.locator('[data-age="'+age+'"]').click();
  await expect(page.locator(".game-card")).toHaveCount(5);
 }
 expect(errors).toEqual([]);
});
test("all 20 activities open, render and skip without script errors",async({page})=>{
 const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto(base);
 const games=await page.evaluate(()=>window.PisipoukWorld360.games);
 expect(games).toHaveLength(20);
 for(const game of games){
  await page.evaluate(id=>window.PisipoukWorld360.open(id),game.id);
  await expect(page.locator("#modal")).toBeVisible();
  await expect(page.locator("#prompt")).not.toBeEmpty();
  await expect(page.locator("#play-area")).not.toBeEmpty();
  await page.locator("#skip").click();
  await expect(page.locator("#game-age")).toContainText("2");
  await page.locator("#close").click();
  await expect(page.locator("#modal")).toBeHidden();
 }
 expect(errors).toEqual([]);
});
test("bubble popping completes and resets without reload",async({page})=>{
 await page.goto(base);
 await page.evaluate(()=>window.PisipoukWorld360.open("bubble"));
 for(let i=0;i<8;i++)await page.locator('[data-action="pop"]').first().click();
 await expect(page.locator("#reward")).toBeVisible();
 await page.locator("#reward-next").click();
 await expect(page.locator("#reward")).toBeHidden();
 await expect(page.locator('[data-action="pop"]')).toHaveCount(8);
});
test("match by tap supports feeding, shape and recycling",async({page})=>{
 await page.goto(base);
 for(const game of ["feed","shapes","recycle"]){
  await page.evaluate(id=>window.PisipoukWorld360.open(id),game);
  const piece=page.locator("[data-piece]").first();
  const id=await piece.getAttribute("data-piece");
  await piece.click();
  const zone=game==="feed"?"feed":game==="shapes"?id:null;
  if(zone!==null){await page.locator('[data-zone="'+zone+'"]').click();
   await expect(page.locator("#game-progress")).toContainText("1");}
  await page.locator("#close").click();
 }
});
test("keyboard-free pointer navigation and parent information",async({page})=>{
 await page.goto(base);
 await page.locator("#right").click();
 await expect(page.locator("#panorama")).toHaveCSS("transform",/matrix/);
 await page.locator("#parent").click();
 await expect(page.locator("#adult-modal")).toBeVisible();
 await page.locator("#adult-close").click();
 await expect(page.locator("#adult-modal")).toBeHidden();
});
