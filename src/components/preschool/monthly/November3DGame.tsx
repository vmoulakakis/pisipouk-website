import { useEffect, useRef, useState } from "react";
import type { PackActivity } from "./november2026";
import bearLogo from "@/assets/pisipouk-logo.webp";

type Stat = { plays:number; completions:number; retries:number; mistakes:number; totalMs:number; lastPlayed:number; variants:Record<string,number>; lastVariant?:string };
const KEY="pisipouk-nov26-local-stats";
function read():Record<string,Stat>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return {}}}
function write(s:Record<string,Stat>){try{localStorage.setItem(KEY,JSON.stringify(s))}catch{}}
export function getNovemberStats(){return read()}
function record(id:string,change:(s:Stat)=>void){
 const all=read();const s=all[id]||{plays:0,completions:0,retries:0,mistakes:0,totalMs:0,lastPlayed:0,variants:{}};
 change(s);s.lastPlayed=Date.now();all[id]=s;write(all);
}
function selectVariant(activity:PackActivity){
 const s=read()[activity.id];const max=activity.variants;
 const pool=Array.from({length:max},(_,i)=>({id:String(i),n:s?.variants?.[String(i)]||0}))
 .filter(v=>v.id!==s?.lastVariant).sort((a,b)=>a.n-b.n);
 const min=pool[0]?.n??0;const choices=pool.filter(x=>x.n===min);
 const variant=choices[Math.floor(Math.random()*choices.length)]?.id||"0";
 record(activity.id,x=>{x.plays++;x.variants[variant]=(x.variants[variant]||0)+1;x.lastVariant=variant});
 return Number(variant);
}
export function startNovemberActivity(activity:PackActivity){return selectVariant(activity)}
export function finishNovemberActivity(id:string,elapsedMs=0){record(id,s=>{s.completions++;s.totalMs+=Math.max(0,elapsedMs)})}
function rngFor(seed:number){let x=(seed+1)*2654435761>>>0;return()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296}}
const PALETTE=["#70c5f2","#f6cb62","#e98ba4","#86c79c","#9a8bd9","#f2a772"];
function mat(B:any,scene:any,name:string,color:string){
 const m=new B.PBRMaterial(name,scene);m.albedoColor=B.Color3.FromHexString(color);m.roughness=.7;m.metallic=.02;return m;
}
function buildScene(B:any,canvas:HTMLCanvasElement,activity:PackActivity,variant:number,
 message:(s:string)=>void,progress:(n:number,t:number)=>void,complete:()=>void,mistake:()=>void){
 const engine=new B.Engine(canvas,true,{antialias:true,stencil:true});
 const scene=new B.Scene(engine);scene.clearColor=new B.Color4(.82,.94,1,1);
 const camera=new B.ArcRotateCamera("nov-camera",-Math.PI/2,1.05,13,new B.Vector3(0,1,0),scene);
 camera.lowerRadiusLimit=9;camera.upperRadiusLimit=17;camera.lowerBetaLimit=.55;camera.upperBetaLimit=1.4;
 if(activity.age!=="2–3")camera.attachControl(canvas,true);
 const light=new B.HemisphericLight("nov-sky",new B.Vector3(0,1,0),scene);light.intensity=1.1;
 const sun=new B.DirectionalLight("nov-sun",new B.Vector3(-.4,-1,.3),scene);sun.position=new B.Vector3(5,12,-5);
 const shadow=new B.ShadowGenerator(512,sun);shadow.useBlurExponentialShadowMap=true;
 const floor=B.MeshBuilder.CreateCylinder("island",{height:.45,diameter:10,tessellation:48},scene);
 floor.position.y=-.12;floor.material=mat(B,scene,"grass","#8bcf91");floor.receiveShadows=true;
 const sea=B.MeshBuilder.CreateDisc("sea",{radius:14,tessellation:64},scene);sea.rotation.x=Math.PI/2;sea.position.y=-.39;sea.material=mat(B,scene,"sea-blue","#6dbce9");
 const bear=new B.TransformNode("pisipouk-bear",scene);
 const fur=mat(B,scene,"fur","#b67645"),face=mat(B,scene,"muzzle","#f2d2a7"),eye=mat(B,scene,"eyes","#312b30");
 const part=(name:string,diameter:number,x:number,y:number,z:number,m:any)=>{
  const mesh=B.MeshBuilder.CreateSphere(name,{diameter,segments:20},scene);mesh.position=new B.Vector3(x,y,z);mesh.material=m;mesh.parent=bear;return mesh;
 };
 const body=part("bear-body",1.4,0,1,0,fur);body.scaling.y=1.12;
 part("bear-head",1.12,0,2.1,0,fur);part("bear-left-ear",.38,-.42,2.56,-.04,fur);part("bear-right-ear",.38,.42,2.56,-.04,fur);
 part("bear-muzzle",.5,0,1.94,-.51,face);part("bear-nose",.14,0,2.03,-.78,eye);
 part("bear-eye-left",.12,-.2,2.21,-.48,eye);part("bear-eye-right",.12,.2,2.21,-.48,eye);
 bear.scaling.scaleInPlace(.7);bear.position=new B.Vector3(-3.5,.22,-.6);
 bear.getChildMeshes().forEach((m:any)=>shadow.addShadowCaster(m));
 const r=rngFor(variant+activity.id.length*77);
 const history=read()[activity.id];const confidence=(history?.completions||0)-(history?.mistakes||0);
 const adaptive=(base:number)=>Math.max(2,base+(confidence>3?1:confidence< -2?-1:0));
 let n=0;let finished=false;let audio:any;
 const timers:ReturnType<typeof setTimeout>[]=[];
 const done=(total:number,feedback:string)=>{if(finished)return;n++;progress(n,total);message(feedback);if(n>=total){finished=true;message("Τα κατάφερες! Μπορείς να παίξεις ξανά με άλλη περιπέτεια.");timers.push(setTimeout(complete,450))}};
 const tone=(f:number)=>{try{const C=window.AudioContext||(window as any).webkitAudioContext;if(!C)return;audio=audio||new C();void audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(.11,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.3);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.31)}catch{}};
 const mesh=(name:string,shape:"sphere"|"box"|"cylinder",x:number,z:number,color:string,size=1)=>{
  const m=shape==="sphere"?B.MeshBuilder.CreateSphere(name,{diameter:size,segments:20},scene):
   shape==="box"?B.MeshBuilder.CreateBox(name,{size},scene):B.MeshBuilder.CreateCylinder(name,{height:size*.65,diameter:size,tessellation:24},scene);
  m.position=new B.Vector3(x,.65,z);m.material=mat(B,scene,name+"-material",color);shadow.addShadowCaster(m);return m;
 };
 const pick=(m:any,fn:()=>void)=>{m.actionManager=new B.ActionManager(scene);m.actionManager.registerAction(new B.ExecuteCodeAction(B.ActionManager.OnPickTrigger,fn));};
 const scatter=(count:number,fn:(i:number,x:number,z:number)=>void)=>{const angle=(variant%7)*.12;for(let i=0;i<count;i++){const x=-2.1+(i%4)*1.45,z=-1.7+Math.floor(i/4)*2.2;fn(i,x*Math.cos(angle)-z*Math.sin(angle),x*Math.sin(angle)+z*Math.cos(angle))}};
 const prompt=activity.promptEL;message(prompt+" "+["Δοκίμασε μια καινούρια αρχή.","Κοίταξε τον κόσμο από άλλη πλευρά.","Άφησε το δάχτυλό σου να εξερευνήσει."][variant%3]);
 switch(activity.id){
 case "nov26-23-rain":{
  scatter(6,(i,x,z)=>{const drop=mesh("rain-drop","sphere",x,z,PALETTE[(i+variant)%6],1.1);drop.scaling.y=1.3;
   pick(drop,()=>{if(finished)return;tone(260+i*64+variant*5);drop.rotation.z+=.3;done(adaptive(6),"Άκου! Πλιτ, πλιτ!");});});break;
 }
 case "nov26-23-leaves":{
  const target=Math.floor(r()*3),colors=PALETTE.slice(0,3),correctCount=confidence>3?4:confidence< -2?2:3;
  message("Βρες τα τρία φύλλα στο χρώμα του μεγάλου καλαθιού.");
  mesh("basket","cylinder",0,2.8,colors[target],1.7);
  const order=Array.from({length:7},(_,i)=>i<correctCount?target:(target+1+i%2)%3).sort(()=>r()-.5);
  scatter(7,(i,x,z)=>{const leaf=mesh("leaf","sphere",x,z,colors[order[i]],1.05);leaf.scaling.y=.48;
   pick(leaf,()=>{if(!leaf.isEnabled()||finished)return;if(order[i]===target){leaf.setEnabled(false);done(correctCount,"Ναι! Βρήκες ένα φύλλο.");}else{message("Δοκίμασε άλλο χρώμα. Όλα τα φύλλα είναι όμορφα.");mistake();}});});break;
 }
 case "nov26-23-cloud":{
  const houses=confidence>3?4:confidence< -2?2:3;const target=Math.floor(r()*houses);scatter(houses,(i,x,z)=>{const house=mesh("hide-house","box",x,z,PALETTE[(i+2)%6],1.55);
   pick(house,()=>{if(finished)return;if(i===target){const cloud=mesh("found-cloud","sphere",x,z,PALETTE[0],1.2);cloud.position.y=2;done(1,"Να το συννεφάκι!");}else{message("Δεν είναι εδώ. Ας δούμε δίπλα.");mistake();}});});break;
 }
 case "nov26-45-bridge":{
  scatter(4,(i,x,z)=>{const plank=mesh("bridge-piece","box",x,z,PALETTE[(i+1)%6],1.1);
   pick(plank,()=>{if(finished||!plank.isEnabled())return;plank.position=new B.Vector3(-1.1+n*1.1,.45,1.3);plank.scaling=new B.Vector3(1.1,.25,.7);done(adaptive(3),"Η γέφυρα μεγαλώνει!");});});break;
 }
 case "nov26-45-habitats":{
  const land=mesh("forest-home","cylinder",-2,2.6,"#8fcf87",1.65),water=mesh("water-home","cylinder",2,2.6,"#71bfea",1.65);
  let home:"land"|"water"|null=null;pick(land,()=>{home="land";message("Διάλεξες δάσος. Τώρα ένα ζωάκι.");});pick(water,()=>{home="water";message("Διάλεξες νερό. Τώρα ένα ζωάκι.");});
  const animals=["land","water","land","water"].sort(()=>r()-.5).slice(0,confidence< -2?3:4);
  scatter(animals.length,(i,x,z)=>{const animal=mesh("animal","sphere",x,z,PALETTE[(i+3)%6],1.15);
   pick(animal,()=>{if(!animal.isEnabled()||finished)return;if(!home){message("Πρώτα διάλεξε σπιτάκι.");return}
    if(home===animals[i]){animal.setEnabled(false);home=null;done(animals.length,"Το ζωάκι βρήκε το σπίτι του!");}else{message("Μπορούμε να ξαναδοκιμάσουμε μαζί.");mistake();}});});break;
 }
 case "nov26-45-kites":{
  const kite=mesh("kite","box",(variant%3)-1,0,PALETTE[(variant+2)%6],1.2);kite.position.y=2;kite.rotation.y=.6;
  scatter(4,(i,x,z)=>{const wind=mesh("wind","cylinder",x,z,PALETTE[i],1.2);
   pick(wind,()=>{if(finished)return;kite.position.x=Math.max(-2,Math.min(2,kite.position.x+(i%2?1:-1)));kite.position.y+=.15;tone(300+i*80);done(adaptive(3),"Ο χαρταετός πετά!");});});break;
 }
 case "nov26-56-water":{
  const channelCount=confidence< -2?2:3,target=Math.floor(r()*channelCount);
  message("Παρατήρησε τα κανάλια: ποιο φτάνει μέχρι τον πράσινο κήπο;");
  const xs=channelCount===2?[-1.4,1.4]:[-2.1,0,2.1];
  const garden=mesh("garden","cylinder",xs[target],2.65,"#4fbb72",1.5);garden.position.y=.55;
  for(let i=0;i<channelCount;i++){
   const canal=mesh("canal","box",xs[i],.05,PALETTE[i],1.25);
   canal.scaling=new B.Vector3(.52,.18,i===target?4.2:2.1);
   pick(canal,()=>{if(finished)return;if(i===target){
    const water=mesh("water-flow","sphere",xs[i],-2.1,"#54bce9",.65);
    const animation=new B.Animation("water-journey","position.z",30,B.Animation.ANIMATIONTYPE_FLOAT,B.Animation.ANIMATIONLOOPMODE_CONSTANT);
    animation.setKeys([{frame:0,value:-2.1},{frame:40,value:2.65}]);water.animations=[animation];scene.beginAnimation(water,0,40,false);
    done(1,"Το νερό ακολούθησε το κανάλι ως τον κήπο! Τι παρατήρησες;");
   }else{mistake();message("Αυτό το κανάλι σταματά νωρίς. Δες ποιο συνεχίζει ως τον κήπο.");}});
  }break;
 }
 case "nov26-56-route":{
  const order=[0,1,2].sort(()=>r()-.5).slice(0,confidence< -2?2:3);const names=["μπλε","κίτρινο","ροζ"];
  message("Πήγαινε με τη σειρά: "+order.map(i=>names[i]).join(" → ")+".");
  scatter(3,(i,x,z)=>{const beacon=mesh("beacon","cylinder",x,z,PALETTE[i],1.35);
   pick(beacon,()=>{if(finished)return;if(i===order[n]){beacon.position.y+=.5;done(order.length,"Σωστή στάση! Συνέχισε τη διαδρομή.");}else{mistake();message("Δοκίμασε ξανά: "+order.map(j=>names[j]).join(" → "));}});});break;
 }
 }
 let t=0;scene.registerBeforeRender(()=>{t+=engine.getDeltaTime()/1000;bear.position.y=.22+Math.sin(t*2)*.045});
 engine.runRenderLoop(()=>scene.render());const resize=()=>engine.resize();window.addEventListener("resize",resize);
 return()=>{timers.forEach(clearTimeout);window.removeEventListener("resize",resize);try{audio?.close()}catch{};scene.dispose();engine.dispose()};
}
export function November3DGame({activity,onClose}:{activity:PackActivity;onClose:()=>void}){
 const canvas=useRef<HTMLCanvasElement>(null),started=useRef(Date.now());
 const [variant,setVariant]=useState(()=>selectVariant(activity));
 const [message,setMessage]=useState(activity.promptEL),[progress,setProgress]=useState({n:0,total:1}),[complete,setComplete]=useState(false),[error,setError]=useState("");
 useEffect(()=>{
  let cleanup:(()=>void)|undefined,active=true;started.current=Date.now();
  const B=(window as any).BABYLON;
  if(!B){setError("Ο 3D κόσμος δεν είναι διαθέσιμος. Δοκίμασε ξανά αργότερα.");return}
  try{if(canvas.current)cleanup=buildScene(B,canvas.current,activity,variant,s=>active&&setMessage(s),(n,total)=>active&&setProgress({n,total}),()=>{
   if(!active)return;setComplete(true);record(activity.id,s=>{s.completions++;s.totalMs+=Date.now()-started.current});
  },()=>record(activity.id,s=>{s.mistakes++;s.retries++}));}catch(e){setError("Ο κόσμος δεν μπόρεσε να ανοίξει.")}
  return()=>{active=false;cleanup?.()};
 },[activity,variant]);
 const replay=()=>{setComplete(false);setError("");setProgress({n:0,total:1});setVariant(selectVariant(activity))};
 return <div className="nov-game-overlay" role="dialog" aria-modal="true" aria-label={activity.titleEL}>
  <div className="nov-game-frame">
   <canvas ref={canvas} aria-label={"3D παιχνίδι "+activity.titleEL} className="nov-game-canvas"/>
   <div className="nov-game-header"><button onClick={onClose}>← Πίσω</button><strong>{activity.titleEL}</strong><button onClick={replay}>↻ Άλλο παιχνίδι</button></div>
   <div className="nov-game-message"><img src={bearLogo} alt="Πισιπούκ, το αρκουδάκι"/><div><b>Ο Πισιπούκ λέει</b><p>{error||message}</p><small>{progress.n}/{progress.total}</small></div></div>
   <div className="nov-game-parent"><b>Μαζί με έναν μεγάλο:</b> {activity.parentEL}</div>
   {complete&&<div className="nov-game-finish"><h2>Μια υπέροχη ανακάλυψη!</h2><button onClick={replay}>Παίζω διαφορετικά</button><button onClick={onClose}>Επιστροφή</button></div>}
  </div>
 </div>;
}
