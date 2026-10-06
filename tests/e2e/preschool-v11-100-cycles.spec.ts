import { expect, test } from "@playwright/test";

const BASE_URL=process.env.PRESCHOOL_BASE_URL||"http://127.0.0.1:4173";
const views=[
  {width:390,height:844},
  {width:430,height:932},
  {width:768,height:1024},
  {width:1024,height:768},
  {width:1440,height:900},
];
const ages=["2–3 ετών","4–5 ετών","5–6 ετών"];

test("100 child-parent adaptive preschool cycles stay healthy",async({page})=>{
  test.setTimeout(240_000);
  const errors:string[]=[];
  page.on("pageerror",e=>errors.push(e.message));
  for(let i=0;i<100;i++){
    await page.setViewportSize(views[i%views.length]);
    const r=await page.goto(`${BASE_URL}/virtual-preschool?analytics=off&qa=${i}`,{waitUntil:"domcontentloaded"});
    expect(r?.ok(),`cycle ${i+1} route`).toBeTruthy();
    const adaptive=page.getByText("Adaptive Adventures").first();
    await expect(adaptive,`cycle ${i+1} adaptive launch`).toBeVisible();
    await adaptive.click();
    const shell=page.locator(".v11-shell");
    await expect(shell.getByText(/Κάθε φορά μια/),`cycle ${i+1} hero`).toBeVisible();
    await shell.getByRole("button",{name:ages[i%ages.length],exact:true}).click();
    const cards=shell.locator(".v11-grid > button");
    expect(await cards.count(),`cycle ${i+1} playable cards`).toBeGreaterThan(0);
    await expect(cards.first(),`cycle ${i+1} first card`).toBeVisible();
    if(i%5===0){
      await cards.first().click();
      await expect(shell.locator(".v11-modal"),`cycle ${i+1} player`).toBeVisible();
      await shell.locator(".v11-close").click();
    }
    await shell.getByRole("button",{name:/Κλείσιμο/}).click();
  }
  expect(errors,"page errors across 100 cycles").toEqual([]);
});
