import {test,expect} from "@playwright/test";
const BASE=process.env.PRESCHOOL_BASE_URL||"http://127.0.0.1:4173";
test("original illustrated village is the interactive home with six clickable destinations",async({page})=>{
 const faults:string[]=[];page.on("pageerror",e=>faults.push(e.message));
 await page.goto(BASE+"/virtual-preschool");
 await expect(page.getByRole("heading",{name:/χωριό μας ζωντανεύει/})).toBeVisible();
 await expect(page.locator(".p3-map-hotspot")).toHaveCount(6);
 await expect(page.locator(".p3-world-art img")).toBeVisible();
 await page.getByRole("button",{name:"Ατελιέ",exact:true}).click();
 await expect(page.getByRole("heading",{name:/Η ζωγραφιά είναι δική σου/})).toBeVisible();
 await page.getByRole("button",{name:"Στο χωριό"}).click();
 await expect(page.locator(".p3-map-hotspot")).toHaveCount(6);
 expect(faults).toEqual([]);
});
test("paint bucket colors SVG regions; artwork and real PDF are downloadable",async({page})=>{
 await page.goto(BASE+"/virtual-preschool");
 await page.getByRole("button",{name:"Ατελιέ",exact:true}).click();
 await expect(page.locator(".p3-template-grid button")).toHaveCount(20);
 const ear=page.locator(".p3-svg-paint svg circle").nth(2);
 await ear.click();
 await expect(ear).toHaveAttribute("style",/fill/);
 await page.getByRole("button",{name:/Πινέλο/}).click();
 const paper=page.locator(".p3-pen-layer");const b=await paper.boundingBox();expect(b).toBeTruthy();
 await page.mouse.move(b!.x+b!.width*.4,b!.y+b!.height*.4);
 await page.mouse.down();await page.mouse.move(b!.x+b!.width*.65,b!.y+b!.height*.6,{steps:8});await page.mouse.up();
 await page.getByRole("button",{name:/Πίσω/}).last().click();
 const png=page.waitForEvent("download");
 await page.getByRole("button",{name:/Η ζωγραφιά μου/}).click();
 expect((await png).suggestedFilename()).toMatch(/-coloring\.png$/);
 const pdf=page.waitForEvent("download",{timeout:30000});
 await page.getByRole("button",{name:/Εκτύπωση PDF Α4/}).click();
 expect((await pdf).suggestedFilename()).toMatch(/-A4\.pdf$/);
});
test("20 printable outlines are available at each of four ages",async({page})=>{
 await page.goto(BASE+"/virtual-preschool");
 await page.getByRole("button",{name:"Ατελιέ",exact:true}).click();
 for(const age of ["2–3","3–4","4–5","5–6"]){
   await page.getByRole("button",{name:age+" ετών"}).click();
   await expect(page.locator(".p3-template-grid button")).toHaveCount(20);
 }
});
test("replay yields fresh color missions, each playable through the end",async({page})=>{
 await page.goto(BASE+"/virtual-preschool");
 await page.getByRole("button",{name:/Πάμε για παιχνίδι/}).click();
 await page.getByRole("button",{name:/Μαγικά χρώματα/}).click();
 const sets:string[]=[];
 for(let run=0;run<3;run++){
  const prompts:string[]=[];
  for(let i=0;i<3;i++){
   const text=await page.locator(".p3-speech span").innerText();
   const matched=text.match(/Χρωμάτισε με (.+)!/);expect(matched).toBeTruthy();
   prompts.push(matched![1]);await page.getByRole("button",{name:matched![1],exact:true}).click();
  }
  await expect(page.getByRole("heading",{name:/Το καταφέραμε μαζί/})).toBeVisible();
  sets.push(prompts.join("|"));await page.getByRole("button",{name:/Καινούριο παιχνίδι/}).click();
 }
 expect(new Set(sets).size).toBeGreaterThan(1);
});
test("fruit game has reachable solutions for youngest age",async({page})=>{
 await page.goto(BASE+"/virtual-preschool");
 await page.getByRole("button",{name:"2–3 ετών"}).click();
 await page.getByRole("button",{name:/Πάμε για παιχνίδι/}).click();
 await page.getByRole("button",{name:/Το δάσος πεινάει/}).click();
 for(let stage=0;stage<3;stage++){
  const prompt=await page.locator(".p3-speech span").innerText();
  const match=prompt.match(/Βάλε (\d+) (.+) στο καλάθι/);expect(match).toBeTruthy();
  const amount=Number(match![1]);const food=match![2];
  await expect(page.getByRole("button",{name:new RegExp(food)})).toBeVisible();
  for(let j=0;j<amount;j++)await page.getByRole("button",{name:new RegExp(food)}).click();
 }
 await expect(page.getByRole("heading",{name:/Το καταφέραμε μαζί/})).toBeVisible();
});
test("mobile view keeps main map and atelier inside screen",async({page})=>{
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});
  await page.goto(BASE+"/virtual-preschool");
  const dim=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,view:innerWidth}));
  expect(dim.scroll,"map at "+width).toBeLessThanOrEqual(dim.view+2);
  if(width<=390){await expect(page.locator(".p3-mobile-hotspots button")).toHaveCount(6);await page.locator(".p3-mobile-hotspots button").first().click()}
  else await page.locator(".p3-map-hotspot").first().click();
  await expect(page.locator(".p3-paper")).toBeVisible();
  const studio=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,view:innerWidth}));
  expect(studio.scroll,"atelier at "+width).toBeLessThanOrEqual(studio.view+2);
 }
});
test("other routes stay accessible",async({page})=>{
 for(const route of ["/","/contact","/gallery","/learning-games"]){const res=await page.goto(BASE+route);expect(res?.ok(),route).toBeTruthy()}
});
