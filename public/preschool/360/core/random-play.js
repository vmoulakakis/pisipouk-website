/* PISIPOUK 360 Random Play Core v1.0
 * Original source. No cookies, identifiers, network services or dependencies.
 * CommonJS export supports Node tests; window export supports self-hosted HTML5.
 */
(function(root,factory){
  const core=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=core;
  if(root)root.PisipoukRandom=core;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const colors=[
    {id:"red",name:"κόκκινα",hex:0xe77963},
    {id:"yellow",name:"κίτρινα",hex:0xf6ca55},
    {id:"green",name:"πράσινα",hex:0x83bc76},
    {id:"purple",name:"μωβ",hex:0xb28ed6}
  ];
  const seeds=[
    {id:"tomato",name:"ντοματιά",flower:0xffd978,produce:"ντοματάκια"},
    {id:"flower",name:"μαργαρίτα",flower:0xffffff,produce:"λουλούδια"},
    {id:"sunflower",name:"ηλίανθος",flower:0xffbe4d,produce:"ηλιόσποροι"},
    {id:"lavender",name:"λεβάντα",flower:0xa38ad8,produce:"ανθάκια"}
  ];
  function mulberry32(seed){
    let state=seed>>>0;
    return function(){state=(state+0x6D2B79F5)|0;let t=Math.imul(state^(state>>>15),1|state);
      t^=t+Math.imul(t^(t>>>7),61|t);return((t^(t>>>14))>>>0)/4294967296;};
  }
  function hash(text){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
  function choice(arr,rng){return arr[Math.floor(rng()*arr.length)];}
  function shuffle(arr,rng){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function cryptoSeed(){try{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]>>>0;}catch{return(Math.random()*4294967296)>>>0;}}
  function band(age){return age==="2-3"?"2-3":age==="4-5"||age==="5-6"?"4-5":"3-4";}
  function ageCount(age){return band(age)==="2-3"?2:band(age)==="3-4"?3:4;}
  function roundKey(r){return r.templateId+"|"+r.goal.color+"|"+r.goal.count+"|"+r.goal.targetKind;}
  function makeRound(gameId,age,seed,roundIndex=0,history=[]){
    const a=band(age);
    const base=hash(gameId+"|"+a+"|"+(seed>>>0)+"|"+roundIndex);
    for(let attempt=0;attempt<7;attempt++){
      const rng=mulberry32(base+(attempt*0x9e3779b9));
      const color=choice(colors.slice(0,a==="2-3"?3:4),rng);
      const plant=choice(seeds,rng);
      const slots=shuffle([0,1,2,3,4],rng);
      const count=1+Math.floor(rng()*Math.min(ageCount(a),slots.length));
      const palettes=shuffle(colors.slice(0,a==="2-3"?3:4),rng);
      const type=gameId==="A01"?"sort":gameId==="B05"?"count":
        choice(["care","plant","explore"],rng);
      const objects=Array.from({length:Math.max(count+1,4)},(_,i)=>{
        const p=palettes[(i+Math.floor(rng()*palettes.length))%palettes.length];
        return{id:"item-"+i,kind:gameId==="C09"?"seed":"apple",color:gameId==="B05"&&i<count?color.id:p.id,
          slot:slots[i%slots.length],size:.8+rng()*.35};
      });
      if(gameId==="A01"){
        for(let i=0;i<objects.length;i++)objects[i].color=i<count?color.id:palettes.find(p=>p.id!==color.id).id;
      }
      const goal=type==="count"?{verb:"collect",targetKind:"apple",color:color.id,count}:
        type==="sort"?{verb:"sort",targetKind:"fruit",color:color.id,count}:
        {verb:type,targetKind:plant.id,color:color.id,count:1};
      const words=type==="count"?"Μάζεψε "+count+" "+color.name+" μήλα.":
        type==="sort"?"Βάλε τα "+color.name+" φρούτα στο καλαθάκι.":
        type==="care"?"Πότισε το φυτό σου!":type==="plant"?"Φύτεψε ένα "+plant.name+"!":"Δοκίμασε ό,τι θέλεις στον κήπο!";
      if(gameId==="B05")objects.forEach((o,i)=>{o.color=i<count?color.id:palettes.find(p=>p.id!==color.id).id;});
      const spec={schemaVersion:1,gameId,seed:seed>>>0,roundIndex,ageBand:a,playMode:"guided",
        templateId:type,goal,objects,slots,plantId:plant.id,narrationKey:words,
        hintKeys:["Κοίτα προσεκτικά.","Δοκίμασε ξανά, με τον δικό σου ρυθμό."],
        surprisePool:shuffle(["butterfly","bee","rainbow","ladybug"],rng),
        visualVariant:Math.floor(rng()*5),rewardVariant:Math.floor(rng()*4)};
      if(validateRound(spec).valid&&(!history.length||!history.slice(-3).includes(roundKey(spec))))return spec;
    }
    // All feasible constraints met; repeated rounds are safer than an infinite retry loop.
    return makeFallback(gameId,a,seed,roundIndex);
  }
  function makeFallback(gameId,a,seed,roundIndex){
    const spec={schemaVersion:1,gameId,seed:seed>>>0,roundIndex,ageBand:a,playMode:"guided",
      templateId:gameId==="A01"?"sort":gameId==="B05"?"count":"plant",
      goal:{verb:gameId==="A01"?"sort":gameId==="B05"?"collect":"plant",
        targetKind:gameId==="C09"?"flower":"apple",color:"red",count:2},
      objects:[0,1,2,3].map(i=>({id:"item-"+i,kind:"apple",color:i%2?"yellow":"red",slot:i,size:1})),
      slots:[0,1,2,3,4],plantId:"flower",narrationKey:"Παίζουμε με τον κήπο!",
      hintKeys:["Δοκίμασε ξανά."],surprisePool:["butterfly"],visualVariant:0,rewardVariant:0};
    return spec;
  }
  function validateRound(r){
    const issues=[];
    if(!r||r.schemaVersion!==1)issues.push("schema");
    if(!["A01","B05","C09"].includes(r?.gameId))issues.push("game-id");
    if(!r?.objects?.length||r.objects.length>10)issues.push("object-count");
    if(!r?.slots?.length||new Set(r.slots).size!==r.slots.length)issues.push("slots");
    if(!(r.goal?.count>=1&&r.goal.count<=10))issues.push("goal-count");
    if(["A01","B05"].includes(r.gameId)&&r.objects.filter(o=>o.color===r.goal.color).length<r.goal.count)issues.push("insufficient-targets");
    if(r.objects?.some(o=>!r.slots.includes(o.slot)))issues.push("invalid-slot");
    return{valid:issues.length===0,issues};
  }
  class SurprisePlanner{
    constructor(seed){this.rng=mulberry32((seed^0x9E3779B9)>>>0);this.activeUntil=0;this.nextAt=12;this.events=["butterfly","bee","rainbow","ladybug"];}
    update(seconds,{dragging=false,speaking=false,calm=false,reducedMotion=false}={}){
      if(calm||reducedMotion||seconds<this.nextAt)return null;
      if(dragging||speaking||seconds<this.activeUntil){this.nextAt=seconds+3;return null;}
      const event=choice(this.events,this.rng);
      const duration=3+this.rng()*3;
      this.activeUntil=seconds+duration;
      this.nextAt=seconds+18+this.rng()*22;
      return{kind:event,duration};
    }
  }
  return{colors,seeds,mulberry32,hash,shuffle,cryptoSeed,band,ageCount,roundKey,makeRound,validateRound,SurprisePlanner};
});