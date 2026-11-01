import { expect, test } from "@playwright/test";
const base=process.env.PRESCHOOL_BASE_URL||"http://127.0.0.1:4173";
const games=[
 ["nov26-23-rain","2-3","rain-drop"],
 ["nov26-23-leaves","2-3","leaf"],
 ["nov26-23-cloud","2-3","hide-house"],
 ["nov26-45-bridge","4-5","bridge-piece"],
 ["nov26-45-habitats","4-5","animal"],
 ["nov26-45-kites","4-5","wind"],
 ["nov26-56-water","5-6","canal"],
 ["nov26-56-route","5-6","beacon"],
] as const;
const url=(age:string,id?:string)=>base+"/virtual-preschool?world=v12&age="+age+(id?"&activity="+id:"");
async function clickMesh(page:any,name:string,index=0){
 const p=await page.evaluate(({name,index}:{name:string,index:number})=>{
  const B=(window as any).BABYLON,scene=B?.EngineStore?.LastCreatedScene;
  if(!scene)throw new Error("Babylon scene not loaded");
  const meshes=scene.meshes.filter((m:any)=>m.name===name&&m.isEnabled());
  const m=meshes[index];if(!m)throw new Error("Missing pickable mesh "+name+" #"+index);
  const canvas=document.querySelector(".nov-game-canvas") as HTMLCanvasElement;
  const rect=canvas.getBoundingClientRect();
  const viewport=scene.activeCamera.viewport.toGlobal(canvas.width,canvas.height);
  const pos=B.Vector3.Project(m.getAbsolutePosition(),B.Matrix.Identity(),scene.getTransformMatrix(),viewport);
  return {x:rect.left+pos.x*rect.width/canvas.width,y:rect.top+pos.y*rect.height/canvas.height};
 },{name,index});
 await page.mouse.click(p.x,p.y);
}
test("keeps current preschool intact and exposes opt-in V12 November world",async({page})=>{
 const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto(base+"/virtual-preschool");
 await expect(page.getByText("Κάθε μέρα,")).toBeVisible();
 await page.goto(url("2-3"));
 await expect(page.getByText("Το Νησί της Βροχής")).toBeVisible({timeout:30_000});
 await expect(page.getByText("Οι σταγόνες χορεύουν")).toBeVisible();
 await page.getByRole("button",{name:/4–5 ετών/}).click();
 await expect(page.getByText("Η γέφυρα του ρυακιού")).toBeVisible();
 await page.getByRole("button",{name:/5–6 ετών/}).click();
 await expect(page.getByText("Τα κανάλια της βροχής")).toBeVisible();
 expect(errors).toEqual([]);
});
test("100 fast age and navigation regressions",async({page})=>{
 test.setTimeout(100_000);const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto(url("2-3"));
 await expect(page.getByText("Το Νησί της Βροχής")).toBeVisible({timeout:30_000});
 for(let i=0;i<100;i++){
  const age=["2–3","4–5","5–6"][i%3];
  await page.getByRole("button",{name:new RegExp(age+" ετών")}).click();
  await expect(page.getByText("Το Νησί της Βροχής")).toBeVisible();
 }
 expect(errors).toEqual([]);
});
for(const [id,age,name] of games){
 test("real Babylon 3D scene, picking, and cleanup: "+id,async({page})=>{
  const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto(url(age,id));
  const canvas=page.locator(".nov-game-canvas");
  await expect(canvas).toBeVisible({timeout:40_000});
  const box=await canvas.boundingBox();expect(box?.width||0).toBeGreaterThan(260);expect(box?.height||0).toBeGreaterThan(300);
  const state=await page.evaluate((name)=>{
   const B=(window as any).BABYLON,scene=B?.EngineStore?.LastCreatedScene;
   if(!scene)return {meshCount:0,pickCount:0,camera:false};
   (window as any).__novScene=scene;
   return {meshCount:scene.meshes.length,pickCount:scene.meshes.filter((m:any)=>m.name===name&&m.actionManager).length,camera:!!scene.activeCamera};
  },name);
  expect(state.meshCount).toBeGreaterThan(10);expect(state.pickCount).toBeGreaterThan(0);expect(state.camera).toBeTruthy();
  if(id==="nov26-45-habitats")await clickMesh(page,"forest-home");
  await clickMesh(page,name);
  await expect(page.locator(".nov-game-message")).toBeVisible();
  await page.getByRole("button",{name:/Πίσω/}).first().click();
  await expect(canvas).toHaveCount(0);
  const disposed=await page.evaluate(()=>Boolean((window as any).__novScene?.isDisposed()));
  expect(disposed).toBe(true);
  expect(errors).toEqual([]);
 });
}
test("real six-touch rain completion and new local exposure statistics",async({page})=>{
 await page.goto(url("2-3","nov26-23-rain"));
 await expect(page.locator(".nov-game-canvas")).toBeVisible({timeout:40_000});
 for(let i=0;i<6;i++)await clickMesh(page,"rain-drop",0);
 await expect(page.getByRole("heading",{name:"Μια υπέροχη ανακάλυψη!"})).toBeVisible({timeout:15_000});
 const stats=await page.evaluate(()=>JSON.parse(localStorage.getItem("pisipouk-nov26-local-stats")||"{}")["nov26-23-rain"]);
 expect(stats.completions).toBe(1);expect(stats.plays).toBe(1);expect(Object.keys(stats.variants).length).toBe(1);
});
test("A4 coloring, owned story player and off-screen activities are accessible",async({page})=>{
 await page.goto(url("2-3","nov26-23-color-a"));
 await expect(page.getByRole("dialog",{name:"Μεγάλη ομπρέλα"})).toBeVisible({timeout:30_000});
 await expect(page.getByRole("button",{name:"Εκτυπώσιμο πατρόν Α4"})).toBeVisible();
 await page.getByRole("button",{name:/Χρώμα/}).nth(2).click();
 await page.locator(".nov-artboard svg path").first().click();
 await expect(page.locator(".nov-artboard svg path").first()).toHaveAttribute("fill",/#/);
 await page.getByRole("button",{name:/Κλείσιμο/}).click();
 await page.getByRole("tab",{name:"Ιστορίες"}).click();
 await page.getByRole("button",{name:/Πισιπούκ και η πρώτη σταγόνα/}).click();
 await expect(page.locator(".nov-story")).toBeVisible();
 await page.getByRole("button",{name:"Συνέχεια"}).click();
 await expect(page.getByText("2/4")).toBeVisible();
});
test("parent-facing public SEO guide has canonical and LearningResource structured data",async({page,request})=>{
 const response=await page.goto(base+"/activities/november-2026/index.html");
 expect(response?.ok()).toBeTruthy();
 await expect(page.getByRole("heading",{name:"Το Νησί της Βροχής"})).toBeVisible();
 expect(await page.locator('script[type="application/ld+json"]').count()).toBe(1);
 expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toContain("november-2026/index.html");
 const sitemap=await request.get(base+"/sitemap.xml");expect(sitemap.ok()).toBeTruthy();
 expect(await sitemap.text()).toContain("/activities/november-2026/5-6.html");
});
