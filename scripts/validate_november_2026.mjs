import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const catalog=JSON.parse(read("public/preschool-catalog.json"));
const meta=JSON.parse(read("public/preschool-monthly/2026-11.json"));
const rows=catalog.items.filter(x=>x.month==="2026-11");
const required={game3d:8,craft:4,coloring:6,story:2,mission:6,music:2,stem:2,social:2,quest:2};
assert.equal(rows.length,34,"November must contain 34 original activities");
assert.equal(catalog.items.length,54,"Existing 20 catalog entries must remain");
assert.equal(meta.activityCount,34);
assert.equal(meta.externalAssets.length,0,"No external game assets");
assert.deepEqual(Object.keys(meta.counts).sort(),Object.keys(required).sort());
for(const [kind,count] of Object.entries(required))assert.equal(rows.filter(x=>x.kind===kind).length,count,`Missing ${kind}`);
const ids=new Set();
for(const a of rows){
 assert(!ids.has(a.id),`duplicate ${a.id}`);ids.add(a.id);
 for(const key of ["title","titleEN","descriptionEL","descriptionEN","parentEL","skill","age","href"])assert.equal(typeof a[key],"string",`${a.id} missing ${key}`);
 assert(["2–3","4–5","5–6"].includes(a.age),`bad age ${a.id}`);
 assert(a.href.startsWith("/virtual-preschool?world=v12&age=")&&a.href.includes(a.id),`invalid href ${a.id}`);
 assert(a.variants>=8,`missing replay variants ${a.id}`);
 assert(a.difficulty>0&&a.difficulty<=3,`bad difficulty ${a.id}`);
}
const source=read("src/components/preschool/monthly/november2026.ts");
const gameplay=read("src/components/preschool/monthly/November3DGame.tsx");
const studio=read("src/components/preschool/monthly/NovemberPack.tsx");
for(const a of rows.filter(x=>x.kind==="game3d"))assert(gameplay.includes('case "'+a.id+'"'),`missing real 3D gameplay ${a.id}`);
for(const a of rows.filter(x=>x.kind==="coloring"))assert(studio.includes('"'+a.id+'":['),`missing coloring geometry ${a.id}`);
for(const a of rows.filter(x=>x.kind==="craft"))assert(studio.includes('"'+a.id+'":[')&&source.includes('"'+a.id+'":{materials:'),`missing A4 craft ${a.id}`);
for(const a of rows.filter(x=>x.kind==="story"))assert(source.includes('"'+a.id+'":['),`missing original story ${a.id}`);
for(const age of ["2-3","4-5","5-6"]){
 const html=read(`public/activities/november-2026/${age}.html`);
 assert(html.includes('application/ld+json'),`structured data missing for ${age}`);
 assert(html.includes('rel="canonical"'),`canonical missing for ${age}`);
 assert(rows.some(a=>a.age.replace("–","-")===age),`age group missing ${age}`);
}
const index=read("public/activities/november-2026/index.html");
assert(index.includes('application/ld+json'));
const sitemap=read("public/sitemap.xml");
for(const age of ["index","2-3","4-5","5-6"])assert(sitemap.includes(`/activities/november-2026/${age}.html`));
const route=read("src/routes/virtual-preschool.tsx");
assert(route.includes('PreschoolWonder')&&route.includes('PreschoolV12Runtime'),"Must preserve current route while staging V12");
assert(read("src/components/preschool/PreschoolV12.tsx").includes('<NovemberPack age={age}/>'));
for(const banned of ["api.openai.com","api.anthropic.com","stripe.com","sketchfab.com","paid-ai","subscription-key"])assert(![source,gameplay,studio].join("\n").includes(banned),`unexpected paid or remote dependency ${banned}`);
console.log("November 2026 pack validated: 34 age-separated activities, 8 playable 3D cases, 4 A4 crafts, 6 coloring scenes, 2 original stories, 4 parent SEO pages; 20 existing catalog entries retained.");
