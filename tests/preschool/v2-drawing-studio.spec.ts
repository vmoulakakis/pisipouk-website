import {test,expect} from "@playwright/test";
const host=(process.env.PISIPOUK_PREVIEW_URL||"http://localhost:5173").replace(/\/$/,"");
const url=host+"/pisipouk-v2-staging/ages/3-4/patterns";
test.describe("PISIPOUK mouse pencil and marker drawing studio",()=>{
 test.beforeEach(async({page})=>{
  await page.goto(url);
  await expect(page.getByRole("button",{name:/Μολύβι/})).toBeVisible();
  await expect(page.locator(".pw2-drawing-layer")).toBeVisible();
 });
 test("20 original patterns plus free blank sheet",async({page})=>{
  await expect(page.locator(".pw2-pattern-gallery button")).toHaveCount(21);
  await page.getByRole("button",{name:/Κενός καμβάς/}).click();
  await expect(page.getByRole("heading",{name:/Η ελεύθερη ζωγραφιά μου/})).toBeVisible();
 });
 test("mouse draws freehand pencil stroke and undo/redo restores it",async({page})=>{
  await page.getByRole("button",{name:/Μολύβι/}).click();
  const stage=page.locator(".pw2-drawing-layer");
  await stage.scrollIntoViewIfNeeded();
  const bounds=await stage.boundingBox();
  expect(bounds).not.toBeNull();
  const x=bounds!.x+bounds!.width*.2,y=bounds!.y+bounds!.height*.48;
  await page.mouse.move(x,y);await page.mouse.down();
  await page.mouse.move(x+95,y+30,{steps:12});await page.mouse.up();
  await expect(stage.locator('[data-test-drawn-stroke="true"]')).toHaveCount(1);
  await page.getByRole("button",{name:/Αναίρεση/}).click();
  await expect(stage.locator('[data-test-drawn-stroke="true"]')).toHaveCount(0);
  await page.getByRole("button",{name:/Επανάληψη/}).click();
  await expect(stage.locator('[data-test-drawn-stroke="true"]')).toHaveCount(1);
 });
 test("marker draws semi-transparent strokes and eraser removes them",async({page})=>{
  await page.getByRole("button",{name:/Μαρκαδόρος/}).click();
  const stage=page.locator(".pw2-drawing-layer");
  await stage.scrollIntoViewIfNeeded();
  const b=await stage.boundingBox();
  expect(b).not.toBeNull();const x=b!.x+b!.width*.42,y=b!.y+b!.height*.52;
  await page.mouse.move(x,y);await page.mouse.down();
  await page.mouse.move(x+67,y,{steps:9});await page.mouse.up();
  await expect(stage.locator('path[data-test-drawn-stroke]')).toHaveAttribute("stroke-opacity","0.48");
  await page.getByRole("button",{name:/Γόμα/}).click();
  await page.mouse.move(x+22,y);await page.mouse.down();
  await page.mouse.move(x+45,y,{steps:5});await page.mouse.up();
  await expect(stage.locator('[data-test-drawn-stroke="true"]')).toHaveCount(0);
 });
 test("selected pattern remains in view when switching to the free drawing page and back",async({page})=>{
  const gallery=page.locator(".pw2-pattern-gallery button");
  await gallery.nth(1).click();
  const name=await gallery.nth(1).locator("span").last().innerText();
  await expect(page.locator(".pw2-library-editor h2")).toHaveText(name);
  await gallery.first().click();
  await expect(page.locator(".pw2-art-base svg")).toBeVisible();
  await gallery.nth(1).click();
  await expect(page.locator(".pw2-library-editor h2")).toHaveText(name);
 });
 test("download A4 SVG includes the child's actual pencil stroke",async({page})=>{
  const stage=page.locator(".pw2-drawing-layer"),b=await stage.boundingBox();
  expect(b).not.toBeNull();
  await page.mouse.move(b!.x+b!.width*.3,b!.y+b!.height*.3);await page.mouse.down();
  await page.mouse.move(b!.x+b!.width*.65,b!.y+b!.height*.4,{steps:10});await page.mouse.up();
  const capture=page.waitForEvent("download");
  await page.getByRole("button",{name:/Αποθήκευση A4 SVG/}).click();
  const downloaded=await capture;
  expect(downloaded.suggestedFilename()).toMatch(/pisipouk-.*-my-art-a4\.svg/);
  const stream=await downloaded.createReadStream(),chunks:Buffer[]=[];
  for await(const part of stream)chunks.push(Buffer.from(part));
  const xml=Buffer.concat(chunks).toString("utf-8");
  expect(xml).toContain('data-pisipouk-drawing="original-mouse-pencil-marker"');
  expect(xml).toMatch(/stroke-width/);
 });
 test("saves locally as PNG; no required login or backend write",async({page})=>{
  const pending=page.waitForEvent("download");
  await page.getByRole("button",{name:/Αποθήκευση PNG/}).click();
  const file=await pending;expect(file.suggestedFilename()).toMatch(/my-art\.png/);
 });
});
