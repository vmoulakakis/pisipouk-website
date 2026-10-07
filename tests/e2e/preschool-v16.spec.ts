import { expect, test, type Page } from "@playwright/test";

const BASE_URL=process.env.PRESCHOOL_BASE_URL||"http://127.0.0.1:4173";

async function openApp(page:Page){
  await page.goto(BASE_URL+"/virtual-preschool",{waitUntil:"domcontentloaded"});
  await expect(page.getByText("Αγγίζω.")).toBeVisible({timeout:25_000});
  await expect(page.getByRole("img",{name:"Ο Πισιπούκ το αρκουδάκι"}).first()).toBeVisible();
}

test.describe.serial("Pisipouk V16 R3F preschool",()=>{
  test("age-first child home exposes only appropriate worlds",async({page})=>{
    await openApp(page);
    for(const age of ["2–3","3–4","4–5","5–6"]) await expect(page.getByRole("button",{name:new RegExp(age)}).first()).toBeVisible();
    await page.getByRole("button",{name:/2–3/}).first().click();
    await expect(page.getByRole("button",{name:"3D Atelier",exact:true})).toHaveCount(0);
    await expect(page.getByRole("button",{name:"Ζωντανή Ζωγραφική",exact:true})).toBeVisible();
    await expect(page.getByRole("button",{name:"Μαγικό Νησί",exact:true})).toBeVisible();
  });

  test("physical atelier boots a real WebGL canvas and tool tray",async({page})=>{
    const errors:string[]=[];
    page.on("pageerror",e=>errors.push(e.message));
    await openApp(page);
    await page.getByRole("button",{name:/3–4/}).first().click();
    await page.getByRole("button",{name:"3D Atelier",exact:true}).click();
    const shell=page.getByTestId("atelier-3d");
    await expect(shell.locator("canvas")).toBeVisible({timeout:30_000});
    await expect(page.getByRole("button",{name:"Κύβος"})).toBeVisible();
    await page.getByRole("button",{name:"Κύβος"}).click();
    await page.getByRole("button",{name:"Μπάλα"}).click();
    await page.waitForTimeout(1200);
    expect(errors).toEqual([]);
  });

  test("3D painting accepts pointer strokes and unlocks bring-art-to-life",async({page})=>{
    await openApp(page);
    await page.getByRole("button",{name:"Ζωντανή Ζωγραφική",exact:true}).click();
    const canvas=page.getByTestId("paint-3d").locator("canvas");
    await expect(canvas).toBeVisible({timeout:30_000});
    const box=await canvas.boundingBox();
    if(!box)throw new Error("paint canvas missing bounds");
    const cx=box.x+box.width*.5, cy=box.y+box.height*.52;
    for(let pass=0;pass<3;pass++){
      await page.mouse.move(cx-80,cy-20+pass*8);
      await page.mouse.down();
      await page.mouse.move(cx+80,cy+20+pass*8,{steps:18});
      await page.mouse.up();
    }
    const wake=page.getByRole("button",{name:/Ζωντανεύω/});
    await expect(wake).toBeEnabled({timeout:10_000});
    await wake.click();
    await expect(page.getByRole("button",{name:/Ηρεμώ/})).toBeVisible();
  });

  test("micro world supports calm weather changes and loads 3D scene",async({page})=>{
    await openApp(page);
    await page.getByRole("button",{name:"Μαγικό Νησί",exact:true}).click();
    const canvas=page.getByTestId("micro-world-3d").locator("canvas");
    await expect(canvas).toBeVisible({timeout:30_000});
    await page.getByRole("button",{name:"Βροχή"}).click();
    await expect(page.getByRole("button",{name:"Βροχή"})).toHaveClass(/on/);
    await page.getByRole("button",{name:"Νύχτα"}).click();
    await expect(page.getByRole("button",{name:"Νύχτα"})).toHaveClass(/on/);
    await expect(page.getByText(/Kenney CC0/)).toBeVisible();
  });

  test("parent insight stays local and reflects anonymous child choices",async({page})=>{
    await openApp(page);
    await page.getByRole("button",{name:"Ζωντανή Ζωγραφική",exact:true}).click();
    await page.getByRole("button",{name:"Πίσω στην αρχική"}).click();
    await page.getByRole("button",{name:"Μαγικό Νησί",exact:true}).click();
    await page.getByRole("button",{name:"Πίσω στην αρχική"}).click();
    await page.getByRole("button",{name:"Γονείς"}).click();
    await expect(page.getByText("Ενδιαφέροντα, όχι βαθμοί.")).toBeVisible();
    await expect(page.getByText("2",{exact:true}).first()).toBeVisible();
    const stored=await page.evaluate(()=>localStorage.getItem("pisipouk-v16-events"));
    expect(stored).toBeTruthy();
    expect(stored).not.toContain("name");
  });

  test("mobile child UI keeps touch-size portals and 3D canvas",async({page})=>{
    await page.setViewportSize({width:390,height:844});
    await openApp(page);
    await page.getByRole("button",{name:"Ζωντανή Ζωγραφική",exact:true}).click();
    await expect(page.getByTestId("paint-3d").locator("canvas")).toBeVisible({timeout:30_000});
    await expect(page.getByRole("button",{name:"Πίσω στην αρχική"})).toBeVisible();
  });
});
