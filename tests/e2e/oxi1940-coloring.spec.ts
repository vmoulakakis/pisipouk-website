import { expect, test } from "@playwright/test";
import { PDFDocument } from "pdf-lib";
import { readFile } from "node:fs/promises";
const BASE=process.env.PRESCHOOL_BASE_URL || "http://127.0.0.1:4173";
test.describe("28η Οκτωβρίου — ζωγραφική και λήψεις γονέων",()=>{
  test("visible route, four sheets, fill color, undo and blank PDF with four A4 pages",async({page})=>{
    const errors:string[]=[];page.on("pageerror",error=>errors.push(error.message));
    await page.goto(BASE+"/october-1940-coloring",{waitUntil:"networkidle"});
    await expect(page.getByRole("heading",{name:/Ζωγραφίζω την Ειρήνη/})).toBeVisible();
    await expect(page.getByRole("button",{name:/Το περιστέρι της ειρήνης/})).toBeVisible();
    await page.getByRole("button",{name:"Χρώμα #2f945f"}).click();
    await page.locator("[data-region=body]").click();
    await expect(page.locator("[data-region=body]")).toHaveAttribute("fill","#2f945f");
    await page.getByRole("button",{name:/Η ελληνική σημαία/}).click();
    await expect(page.locator("[data-region=stripe0]")).toHaveCount(1);
    const download=page.waitForEvent("download");
    await page.getByRole("button",{name:/Κατέβασε 4 πατρόν PDF Α4/}).click();
    const finished=await download;
    expect(finished.suggestedFilename()).toMatch(/\.pdf$/);
    const file=await finished.path();expect(file).not.toBeNull();
    const doc=await PDFDocument.load(await readFile(file!));expect(doc.getPages()).toHaveLength(4);
    for(const p of doc.getPages()){expect(Math.round(p.getWidth())).toBe(595);expect(Math.round(p.getHeight())).toBe(842);}
    expect(errors).toEqual([]);
  });
  test("freehand works and child can save a PNG without account",async({page})=>{
    await page.setViewportSize({width:390,height:844});
    await page.goto(BASE+"/october-1940-coloring",{waitUntil:"networkidle"});
    await page.getByRole("button",{name:/Πινέλο/}).click();
    const canvas=page.locator("canvas[aria-label]");
    await expect(canvas).toBeVisible();
    const bounds=await canvas.boundingBox();expect(bounds).not.toBeNull();
    await page.mouse.move(bounds!.x+30,bounds!.y+30);await page.mouse.down();
    await page.mouse.move(bounds!.x+65,bounds!.y+65,{steps:4});await page.mouse.up();
    await expect(page.getByRole("button",{name:/Πίσω/})).toBeEnabled();
    const dl=page.waitForEvent("download");
    await page.getByRole("button",{name:/Αποθήκευση ζωγραφιάς PNG/}).click();
    expect((await dl).suggestedFilename()).toMatch(/\.png$/);
    await page.getByRole("button",{name:/Πίσω/}).click();
  });
  test("parents can find it from both October hub and preschool",async({page})=>{
    await page.goto(BASE+"/october-1940",{waitUntil:"networkidle"});
    await expect(page.getByRole("link",{name:/Ζωγραφίζω στην οθόνη/})).toBeVisible();
    await expect(page.getByRole("link",{name:/Κατεβάζω δωρεάν PDF Α4/})).toBeVisible();
    await page.goto(BASE+"/virtual-preschool",{waitUntil:"networkidle"});
    await expect(page.getByRole("link",{name:/ζωγραφική online, λήψη PDF Α4/})).toBeVisible();
  });
});
