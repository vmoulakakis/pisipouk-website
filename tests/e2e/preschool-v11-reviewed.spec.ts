import { expect, test } from "@playwright/test";

const BASE_URL=process.env.PRESCHOOL_BASE_URL||"http://127.0.0.1:4173";

test.describe("V11 reviewed adaptive play lab",()=>{
  test("opens reviewed library with many mechanics",async({page})=>{
    const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
    const r=await page.goto(`${BASE_URL}/virtual-preschool?analytics=off`,{waitUntil:"domcontentloaded"});
    expect(r?.ok()).toBeTruthy();
    await page.locator(".reviewed-launch").click();
    const lab=page.locator(".rv");
    await expect(lab.getByText("REVIEWED PLAY LAB")).toBeVisible();
    await lab.getByRole("button",{name:"4–5 ετών",exact:true}).click();
    expect(await lab.locator(".rv-card").count()).toBeGreaterThan(6);
    await expect(lab.getByText("3D Shape World")).toBeVisible();
    await expect(lab.getByText(/variants/).first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("runs real WebGL canvas and stats view",async({page})=>{
    await page.goto(`${BASE_URL}/virtual-preschool?analytics=off`,{waitUntil:"domcontentloaded"});
    await page.locator(".reviewed-launch").click();
    const lab=page.locator(".rv");
    await lab.getByText("3D Shape World").click();
    await expect(page.locator("canvas.rv-webgl")).toBeVisible();
    await expect(page.getByText(/Πραγματικό WebGL/)).toBeVisible();
    await page.locator(".rv-x").click();
    await lab.getByRole("button",{name:/Στατιστικά/}).click();
    await expect(lab.getByText(/Boredom signal/).first()).toBeVisible();
  });

  test("opens a reviewed activity and parent co-play guidance",async({page})=>{
    await page.goto(`${BASE_URL}/virtual-preschool?analytics=off`,{waitUntil:"domcontentloaded"});
    await page.locator(".reviewed-launch").click();
    const lab=page.locator(".rv");
    await lab.getByRole("button",{name:"4–5 ετών",exact:true}).click();
    const cards=lab.locator(".rv-card:not(.webgl)");
    await cards.first().click();
    await expect(page.locator(".rv-player")).toBeVisible();
    await expect(page.getByText("Μαζί με τον γονέα")).toBeVisible();
  });
});
