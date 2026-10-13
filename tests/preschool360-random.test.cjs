const test=require("node:test");
const assert=require("node:assert/strict");
const URL=require("node:url");
const path=require("node:path");
let core;
const ready=import(URL.pathToFileURL(path.join(__dirname,"../public/preschool/360/core/random-play.js")).href)
 .then(()=>{core=globalThis.PisipoukRandom;assert.ok(core,"Random play engine must be globally available");});
test("seeded procedural missions are reproducible",async()=>{
 await ready;
 for(const game of ["C09","A01","B05"]){
  const a=core.makeRound(game,"3-4",123456,4);
  const b=core.makeRound(game,"3-4",123456,4);
  assert.deepEqual(a,b,game);
 }
});
test("random goals are always achievable for 2-5 year olds",async()=>{
 await ready;
 for(const age of ["2-3","3-4","4-5"]){
  for(const game of ["C09","A01","B05"]){
   for(let i=0;i<220;i++){
    const s=core.makeRound(game,age,0xabc100+i,i);
    const validated=core.validateRound(s);
    assert.ok(validated.valid,JSON.stringify({age,game,i,issues:validated.issues}));
    assert.ok(s.goal.count>=1);
    assert.ok(s.goal.count<=core.ageCount(age));
    if(game!=="C09")assert.ok(s.objects.filter(o=>o.color===s.goal.color).length>=s.goal.count);
   }
  }
 }
});
test("procedural replay varies sessions while remaining solvable",async()=>{
 await ready;
 const seen=new Set();
 for(let i=0;i<45;i++){
  const s=core.makeRound("A01","4-5",777,i);
  seen.add(core.roundKey(s));
 }
 assert.ok(seen.size>=8,"Too few meaningful session variants: "+seen.size);
});
test("event injector respects dragging, narration and calm mode",async()=>{
 await ready;
 let p=new core.SurprisePlanner(99);
 assert.equal(p.update(10),null);
 assert.equal(p.update(13,{dragging:true}),null);
 assert.equal(p.update(16,{speaking:true}),null);
 assert.equal(p.update(19,{calm:true}),null);
 const event=p.update(25);
 assert.ok(event&&["butterfly","bee","rainbow","ladybug"].includes(event.kind));
 assert.equal(p.update(26),null);
});
test("invalid counting goals are rejected",async()=>{
 await ready;
 let round=core.makeRound("B05","2-3",85,0);
 round.goal.count=99;
 assert.ok(!core.validateRound(round).valid);
});
