import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Gamepad2,
  HeartHandshake,
  Library,
  LockKeyhole,
  RotateCcw,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { PreschoolV11Styled } from "@/components/preschool/PreschoolV11Styled";
import bearLogo from "@/assets/pisipouk-logo.webp";
import classroomPhoto from "@/assets/pisipouk-classroom.webp";
import storyPhoto from "@/assets/pisipouk-story.webp";
import artPhoto from "@/assets/real-art-table.webp";

type Age = "2–3" | "4–5" | "5–6";
type GameKind = "collect" | "music" | "feed" | "treasure" | "build" | "rescue" | "count" | "pattern" | "science" | "story";
type GameTone = "Μαθαίνω" | "Παίζω" | "Μαζί";

type GameDef = {
  id: string;
  age: Age;
  kind: GameKind;
  title: string;
  subtitle: string;
  icon: string;
  tone: GameTone;
  minutes: string;
  domain: string;
  parent: string;
  why: string;
};

type Stat = { plays: number; completions: number; mistakes: number; totalMs: number; lastPlayed: number };
type Stats = Record<string, Stat>;

declare global {
  interface Window {
    BABYLON?: any;
  }
}

const GAMES: GameDef[] = [
  { id:"23-color-harbor", age:"2–3", kind:"collect", title:"Το χρωματιστό λιμανάκι", subtitle:"Αγγίζω, ξεχωρίζω και βρίσκω χρώματα σε έναν 3D κόσμο.", icon:"🎨", tone:"Μαθαίνω", minutes:"3–4′", domain:"Χρώματα • προσοχή", parent:"Μετά βρείτε μαζί 3 αντικείμενα του ίδιου χρώματος στο δωμάτιο.", why:"Απλή κατηγοριοποίηση, άμεσο feedback και μεγάλοι στόχοι αφής." },
  { id:"23-picnic", age:"2–3", kind:"feed", title:"Το πικνίκ του Πισιπούκ", subtitle:"Δίνω στο αρκουδάκι φρούτα και ανακαλύπτω καθημερινές επιλογές.", icon:"🍎", tone:"Μαζί", minutes:"3–5′", domain:"Καθημερινή ζωή • λεξιλόγιο", parent:"Ο γονιός ονομάζει γεύση, χρώμα και υφή πριν το παιδί διαλέξει.", why:"Γλώσσα μέσα σε πραγματικό πλαίσιο και κοινό παιχνίδι με ενήλικα." },
  { id:"23-music", age:"2–3", kind:"music", title:"Μουσικά κουδουνάκια", subtitle:"Πατάω 3D όργανα και φτιάχνω δικό μου ρυθμό χωρίς σωστό/λάθος.", icon:"🔔", tone:"Παίζω", minutes:"2–5′", domain:"Ρυθμός • αιτία/αποτέλεσμα", parent:"Κάντε εναλλάξ έναν ήχο ο καθένας και αντιγράψτε τον άλλο.", why:"Open-ended cause-and-effect για μικρά παιδιά χωρίς αποτυχία." },
  { id:"23-hide", age:"2–3", kind:"treasure", title:"Κρυφτό στο νησί", subtitle:"Βρίσκω μεγάλα κρυμμένα ζωάκια γύρω από τον Πισιπούκ.", icon:"🐢", tone:"Παίζω", minutes:"3–4′", domain:"Παρατήρηση • μνήμη", parent:"Πες “πάνω/κάτω/δίπλα” καθώς ψάχνετε μαζί.", why:"Οπτική αναζήτηση με χωρικό λεξιλόγιο και ήρεμη εξερεύνηση." },

  { id:"45-treasure", age:"4–5", kind:"treasure", title:"Ο θησαυρός του Αιγαίου", subtitle:"Περιστρέφω το 3D νησί και ανακαλύπτω κρυμμένα σύμβολα.", icon:"🏝️", tone:"Παίζω", minutes:"4–6′", domain:"Χωρική αντίληψη • επιμονή", parent:"Ο γονιός δίνει ένα μόνο στοιχείο κάθε φορά αντί να δείχνει τη λύση.", why:"Exploration και problem solving αντί για διαδοχικά quiz." },
  { id:"45-build", age:"4–5", kind:"build", title:"Χτίζω το χωριό", subtitle:"Τοποθετώ 3D σπίτια, δέντρα και πύργους σε έναν ανοιχτό κόσμο.", icon:"🏗️", tone:"Παίζω", minutes:"5–8′", domain:"Δημιουργικότητα • χωρική σκέψη", parent:"Ζήτησε από το παιδί να σου εξηγήσει γιατί έβαλε κάθε αντικείμενο εκεί.", why:"Open-ended construction, αφήγηση και λεπτή λήψη αποφάσεων." },
  { id:"45-rescue", age:"4–5", kind:"rescue", title:"Διάσωση ζώων", subtitle:"Βοηθώ 3D ζωάκια να επιστρέψουν στο σωστό περιβάλλον.", icon:"🐬", tone:"Μαθαίνω", minutes:"4–6′", domain:"Φύση • κατηγοριοποίηση", parent:"Συζητήστε τι χρειάζεται κάθε ζώο για να ζήσει.", why:"Science vocabulary και classification με ιστορία και σκοπό." },
  { id:"45-carnival", age:"4–5", kind:"music", title:"Καρναβάλι ρυθμού", subtitle:"Παίζω τύμπανα, ξυλόφωνο και καμπανάκια σε 3D μουσική σκηνή.", icon:"🥁", tone:"Παίζω", minutes:"3–6′", domain:"Μουσική • μνήμη εργασίας", parent:"Ο γονιός φτιάχνει μικρό ρυθμό 2–3 χτυπημάτων και το παιδί απαντά.", why:"Ψυχαγωγία με ακουστική μνήμη, turn-taking και δημιουργία." },

  { id:"56-dock", age:"5–6", kind:"count", title:"Αποστολή στο λιμάνι", subtitle:"Φορτώνω ακριβώς όσα κιβώτια χρειάζεται το καραβάκι.", icon:"⛵", tone:"Μαθαίνω", minutes:"4–6′", domain:"Αριθμοί • επίλυση προβλήματος", parent:"Ρώτησε “πώς το ξέρεις;” αντί να ζητήσεις μόνο την απάντηση.", why:"Number sense μέσα σε λειτουργικό 3D πρόβλημα, όχι απομονωμένη πράξη." },
  { id:"56-lighthouse", age:"5–6", kind:"pattern", title:"Ο φάρος των μοτίβων", subtitle:"Βρίσκω ποιο 3D φως ή σχήμα συνεχίζει το μοτίβο.", icon:"💡", tone:"Μαθαίνω", minutes:"4–6′", domain:"Μοτίβα • λογική", parent:"Φτιάξτε μετά ένα μοτίβο με αντικείμενα του σπιτιού.", why:"Prediction, visual reasoning και εξήγηση στρατηγικής." },
  { id:"56-science", age:"5–6", kind:"science", title:"Εργαστήριο της θάλασσας", subtitle:"Κάνω πρόβλεψη: ποια αντικείμενα θα επιπλεύσουν και ποια θα βυθιστούν;", icon:"🔬", tone:"Μαζί", minutes:"5–7′", domain:"STEM • υπόθεση/παρατήρηση", parent:"Πρώτα κάντε πρόβλεψη και μετά δοκιμάστε με ασφαλή αντικείμενα σε λεκάνη.", why:"Predict → test → observe → explain, βασική λογική επιστημονικής διερεύνησης." },
  { id:"56-map", age:"5–6", kind:"story", title:"Ο χάρτης του Πισιπούκ", subtitle:"Διαλέγω μονοπάτια και αλλάζω την 3D ιστορία του αρκουδιού.", icon:"🗺️", tone:"Παίζω", minutes:"5–8′", domain:"Αφήγηση • αιτία/αποτέλεσμα", parent:"Στο τέλος ζητήστε από το παιδί να αφηγηθεί ξανά την περιπέτεια με δικά του λόγια.", why:"Branching storytelling, γλώσσα και causal reasoning σε έναν κόσμο εξερεύνησης." },
];

const AGE_INFO: Record<Age, { label:string; note:string; principle:string }> = {
  "2–3": { label:"2–3 ετών", note:"Μεγάλοι στόχοι • αιτία/αποτέλεσμα • χρώμα • ήχος", principle:"Πολύ σύντομα παιχνίδια, άμεση ανταπόκριση και σχεδόν καθόλου “λάθος”." },
  "4–5": { label:"4–5 ετών", note:"Ιστορία • κατασκευή • ταξινόμηση • εξερεύνηση", principle:"Περισσότερες επιλογές, φαντασία, spatial play και απλά προβλήματα." },
  "5–6": { label:"5–6 ετών", note:"Λογική • αριθμοί • STEM • αφήγηση", principle:"Πρόβλεψη, εξήγηση στρατηγικής και μεγαλύτερες αποστολές με σαφή σκοπό." },
};

const COLORS = ["#ffcf45", "#ff6d8f", "#5bc5ef", "#7c5cf2", "#61c985", "#ff9362"];

function loadBabylon(){
  if (window.BABYLON) return Promise.resolve(window.BABYLON);
  return new Promise<any>((resolve,reject)=>{
    const prior=document.querySelector<HTMLScriptElement>("script[data-pisipouk-babylon]");
    if(prior){prior.addEventListener("load",()=>resolve(window.BABYLON));prior.addEventListener("error",reject);return;}
    const s=document.createElement("script");
    s.src="https://cdn.babylonjs.com/babylon.js";
    s.async=true;
    s.dataset.pisipoukBabylon="1";
    s.onload=()=>resolve(window.BABYLON);
    s.onerror=()=>reject(new Error("Babylon.js could not load"));
    document.head.appendChild(s);
  });
}

function getStats():Stats{try{return JSON.parse(localStorage.getItem("pisipouk-v12-stats")||"{}")}catch{return {}}}
function saveStats(s:Stats){try{localStorage.setItem("pisipouk-v12-stats",JSON.stringify(s))}catch{}}
function speak(text:string){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="el-GR";u.rate=.9;speechSynthesis.speak(u)}catch{}}

function makeRng(seed:number){let x=seed||1234567;return()=>{x=(x*1664525+1013904223)%4294967296;return x/4294967296}}
function hash(s:string){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}

function createMaterial(B:any,scene:any,name:string,color:string,rough=.55,metal=.02){
  const m=new B.PBRMaterial(name,scene);m.albedoColor=B.Color3.FromHexString(color);m.roughness=rough;m.metallic=metal;return m;
}

function createBear(B:any,scene:any){
  const brown=createMaterial(B,scene,"bear-fur","#b66a35",.72,0);
  const cream=createMaterial(B,scene,"bear-muzzle","#f1c99a",.8,0);
  const dark=createMaterial(B,scene,"bear-eyes","#251d2a",.35,.05);
  const gold=createMaterial(B,scene,"bear-star","#ffd44d",.28,.08);
  const root=new B.TransformNode("pisipouk-bear",scene);
  const body=B.MeshBuilder.CreateSphere("bear-body",{diameter:2.1,segments:32},scene);body.scaling=new B.Vector3(.85,1.05,.72);body.position.y=1.55;body.material=brown;body.parent=root;
  const head=B.MeshBuilder.CreateSphere("bear-head",{diameter:1.55,segments:32},scene);head.position.y=2.82;head.material=brown;head.parent=root;
  for(const sx of [-1,1]){const ear=B.MeshBuilder.CreateSphere("bear-ear",{diameter:.62,segments:24},scene);ear.position=new B.Vector3(.54*sx,3.38,0);ear.material=brown;ear.parent=root;const inner=B.MeshBuilder.CreateSphere("bear-ear-inner",{diameter:.35,segments:20},scene);inner.position=new B.Vector3(.55*sx,3.39,-.18);inner.material=cream;inner.parent=root}
  const muzzle=B.MeshBuilder.CreateSphere("bear-muzzle",{diameter:.75,segments:24},scene);muzzle.scaling=new B.Vector3(1,.68,.45);muzzle.position=new B.Vector3(0,2.65,-.68);muzzle.material=cream;muzzle.parent=root;
  const nose=B.MeshBuilder.CreateSphere("bear-nose",{diameter:.23,segments:18},scene);nose.position=new B.Vector3(0,2.72,-.99);nose.material=dark;nose.parent=root;
  for(const sx of [-1,1]){const eye=B.MeshBuilder.CreateSphere("bear-eye",{diameter:.16,segments:16},scene);eye.position=new B.Vector3(.27*sx,2.98,-.72);eye.material=dark;eye.parent=root}
  for(const sx of [-1,1]){const arm=B.MeshBuilder.CreateCapsule("bear-arm",{height:1.15,radius:.25,tessellation:20},scene);arm.rotation.z=.62*sx;arm.position=new B.Vector3(.93*sx,1.72,0);arm.material=brown;arm.parent=root;const leg=B.MeshBuilder.CreateCapsule("bear-leg",{height:1.1,radius:.32,tessellation:20},scene);leg.position=new B.Vector3(.48*sx,.56,0);leg.material=brown;leg.parent=root}
  const star=B.MeshBuilder.CreateDisc("bear-star",{radius:.27,tessellation:5},scene);star.position=new B.Vector3(0,1.65,-.77);star.rotation.x=Math.PI;star.material=gold;star.parent=root;
  root.scaling=new B.Vector3(.72,.72,.72);
  return root;
}

function createIsland(B:any,scene:any){
  const sand=createMaterial(B,scene,"sand","#f6d78b",.9,0), grass=createMaterial(B,scene,"grass","#74c96b",.86,0), water=createMaterial(B,scene,"water","#43b7e8",.2,.04), white=createMaterial(B,scene,"houseWhite","#fff8e7",.75,0), blue=createMaterial(B,scene,"roofBlue","#3b75d6",.42,.05);
  const sea=B.MeshBuilder.CreateDisc("sea",{radius:18,tessellation:64},scene);sea.rotation.x=Math.PI/2;sea.position.y=-.28;sea.material=water;
  const island=B.MeshBuilder.CreateCylinder("island",{height:.8,diameterTop:13,diameterBottom:11.5,tessellation:64},scene);island.material=sand;island.position.y=-.1;
  const top=B.MeshBuilder.CreateCylinder("island-grass",{height:.18,diameter:11.7,tessellation:64},scene);top.material=grass;top.position.y=.38;
  for(const p of [[-3,0,2],[3.2,0,2.2],[2.4,0,-2.7]]){const trunk=B.MeshBuilder.CreateCylinder("tree-trunk",{height:1.3,diameter:.32,tessellation:16},scene);trunk.position=new B.Vector3(p[0],1,p[2]);trunk.material=createMaterial(B,scene,"trunk"+Math.random(),"#8a593e",.9,0);const crown=B.MeshBuilder.CreateSphere("tree-crown",{diameter:1.55,segments:20},scene);crown.position=new B.Vector3(p[0],2,p[2]);crown.material=grass}
  for(const p of [[-2.7,-1.7],[1.1,2.5]]){const house=B.MeshBuilder.CreateBox("house",{width:1.6,height:1.3,depth:1.4},scene);house.position=new B.Vector3(p[0],1.05,p[1]);house.material=white;const roof=B.MeshBuilder.CreateCylinder("roof",{diameter:2,height:.75,tessellation:4},scene);roof.rotation.y=Math.PI/4;roof.position=new B.Vector3(p[0],1.95,p[1]);roof.material=blue}
  return {sea,island};
}

function createScene(B:any, canvas:HTMLCanvasElement, game:GameDef, onMessage:(x:string)=>void, onProgress:(n:number,total:number)=>void, onDone:()=>void, onMistake:()=>void){
  const engine=new B.Engine(canvas,true,{preserveDrawingBuffer:true,stencil:true,antialias:true});
  const scene=new B.Scene(engine);scene.clearColor=new B.Color4(.82,.95,1,1);
  const camera=new B.ArcRotateCamera("camera",-Math.PI/2,1.05,15,new B.Vector3(0,1.2,0),scene);camera.attachControl(canvas,true);camera.lowerRadiusLimit=9;camera.upperRadiusLimit=18;camera.lowerBetaLimit=.65;camera.upperBetaLimit=1.35;camera.wheelPrecision=75;camera.pinchPrecision=90;camera.panningSensibility=0;
  const hemi=new B.HemisphericLight("hemi",new B.Vector3(0,1,0),scene);hemi.intensity=1.05;
  const sun=new B.DirectionalLight("sun",new B.Vector3(-.45,-1,.35),scene);sun.position=new B.Vector3(8,14,-8);sun.intensity=1.2;
  const shadow=new B.ShadowGenerator(1024,sun);shadow.useBlurExponentialShadowMap=true;shadow.blurKernel=16;
  createIsland(B,scene);
  const bear=createBear(B,scene);bear.position=new B.Vector3(-3.7,.45,-.5);shadow.addShadowCaster(bear,true);
  let t=0;scene.registerBeforeRender(()=>{t+=engine.getDeltaTime()/1000;bear.position.y=.45+Math.sin(t*2.1)*.055;bear.rotation.y=Math.sin(t*.8)*.08});
  const rng=makeRng(hash(game.id+":"+Math.floor(Date.now()/86400000)+":"+Math.floor(Math.random()*9999)));
  const clickable:any[]=[];
  const addClickable=(mesh:any,fn:()=>void)=>{clickable.push(mesh);mesh.actionManager=new B.ActionManager(scene);mesh.actionManager.registerAction(new B.ExecuteCodeAction(B.ActionManager.OnPickTrigger,fn));mesh.actionManager.registerAction(new B.SetValueAction(B.ActionManager.OnPointerOverTrigger,mesh,"scaling",mesh.scaling.scale(1.08)));mesh.actionManager.registerAction(new B.SetValueAction(B.ActionManager.OnPointerOutTrigger,mesh,"scaling",mesh.scaling.scale(1/1.08)))};
  const pop=(mesh:any)=>{const a=new B.Animation("pop","scaling",30,B.Animation.ANIMATIONTYPE_VECTOR3,B.Animation.ANIMATIONLOOPMODE_CONSTANT);a.setKeys([{frame:0,value:mesh.scaling.clone()},{frame:6,value:mesh.scaling.scale(1.35)},{frame:14,value:new B.Vector3(0.02,.02,.02)}]);mesh.animations=[a];scene.beginAnimation(mesh,0,14,false,1,()=>mesh.setEnabled(false))};
  const sparkle=(pos:any)=>{for(let i=0;i<7;i++){const s=B.MeshBuilder.CreateSphere("spark",{diameter:.12,segments:8},scene);s.position=pos.clone();s.material=createMaterial(B,scene,"spark"+i,COLORS[i%COLORS.length],.25,.05);const dir=new B.Vector3((rng()-.5)*2,rng()*1.5,(rng()-.5)*2);const a=new B.Animation("sparkA","position",30,B.Animation.ANIMATIONTYPE_VECTOR3,B.Animation.ANIMATIONLOOPMODE_CONSTANT);a.setKeys([{frame:0,value:s.position.clone()},{frame:18,value:s.position.add(dir)}]);s.animations=[a];scene.beginAnimation(s,0,18,false,1,()=>s.dispose())}}
  const setProgress=(n:number,total:number,msg?:string)=>{onProgress(n,total);if(msg)onMessage(msg);if(n>=total){onMessage("Μπράβο! Η αποστολή ολοκληρώθηκε ⭐");speak("Μπράβο! Τα κατάφερες!");setTimeout(onDone,650)}};

  if(game.kind==="collect"){
    const targetIndex=Math.floor(rng()*3), target=["κίτρινα","μπλε","ροζ"][targetIndex], targetColor=["#ffd547","#45b9ef","#ff7197"][targetIndex];
    onMessage(`Βρες τα 3 ${target} αντικείμενα.`);let n=0;const total=3;
    for(let i=0;i<7;i++){const correct=i<3;const mesh=i%2===0?B.MeshBuilder.CreateSphere("color-object",{diameter:.78,segments:24},scene):B.MeshBuilder.CreateBox("color-object",{size:.72},scene);mesh.position=new B.Vector3(-1.4+(i%4)*1.35,.92,-2.5+Math.floor(i/4)*2.2);mesh.material=createMaterial(B,scene,"col"+i,correct?targetColor:COLORS[(targetIndex+i+2)%COLORS.length],.42,.02);shadow.addShadowCaster(mesh);addClickable(mesh,()=>{if(correct&&mesh.isEnabled()){n++;sparkle(mesh.position);pop(mesh);setProgress(n,total,"Το βρήκες! Ψάξε κι άλλο.")}else{onMistake();onMessage("Κοίτα ξανά το χρώμα. Δεν πειράζει — δοκίμασε άλλο αντικείμενο.")}})}
  } else if(game.kind==="feed"){
    onMessage("Δώσε στον Πισιπούκ 4 φρούτα από το πικνίκ.");let n=0;const fruits=["#ff625c","#ffd44f","#7ecb64","#f189b4","#ff8b4a","#b878e8"];
    for(let i=0;i<6;i++){const fruit=B.MeshBuilder.CreateSphere("fruit",{diameter:.7,segments:24},scene);fruit.scaling=new B.Vector3(1,.88,1);fruit.position=new B.Vector3(-.8+i*1.05,.8,2.1+(i%2)*.55);fruit.material=createMaterial(B,scene,"fruit"+i,fruits[i],.48,.01);shadow.addShadowCaster(fruit);addClickable(fruit,()=>{if(!fruit.isEnabled())return;n++;sparkle(fruit.position);pop(fruit);setProgress(n,4,n<4?"Νόστιμο! Πες το χρώμα του φρούτου.":undefined)})}
  } else if(game.kind==="music"){
    onMessage(game.age==="2–3"?"Παίξε ελεύθερα 8 ήχους. Δεν υπάρχει λάθος!":"Παίξε 8 ήχους και δοκίμασε να φτιάξεις μικρό μοτίβο.");let n=0;const AudioCtx=window.AudioContext||(window as any).webkitAudioContext;let audio:any;
    const freqs=[261.6,329.6,392,523.2];
    for(let i=0;i<4;i++){const drum=B.MeshBuilder.CreateCylinder("instrument",{height:.75,diameter:1.25,tessellation:40},scene);drum.position=new B.Vector3(-1.9+i*1.35,.85,1.5);drum.material=createMaterial(B,scene,"instrument"+i,COLORS[i],.35,.03);shadow.addShadowCaster(drum);addClickable(drum,()=>{try{audio=audio||new AudioCtx();const o=audio.createOscillator(),g=audio.createGain();o.frequency.value=freqs[i];o.type=i%2?"sine":"triangle";g.gain.setValueAtTime(.16,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.45);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.46)}catch{};drum.scaling.y=.72;setTimeout(()=>drum.scaling.y=1,120);n++;sparkle(drum.position);setProgress(n,8,n<8?"Ωραίος ήχος! Συνέχισε.":undefined)})}
  } else if(game.kind==="treasure"){
    onMessage(game.age==="2–3"?"Βρες 4 ζωάκια που κρύφτηκαν στο νησί.":"Περιστρέψε το νησί και βρες 5 κρυμμένους θησαυρούς.");let n=0,total=game.age==="2–3"?4:5;
    for(let i=0;i<total;i++){const gem=B.MeshBuilder.CreatePolyhedron("treasure",{type:i%2?2:1,size:.56},scene);const a=(i/total)*Math.PI*2+rng()*.4;gem.position=new B.Vector3(Math.cos(a)*(3.6+rng()),.75+ rng()*.6,Math.sin(a)*(3.6+rng()));gem.material=createMaterial(B,scene,"gem"+i,COLORS[(i+1)%COLORS.length],.22,.12);shadow.addShadowCaster(gem);addClickable(gem,()=>{if(!gem.isEnabled())return;n++;sparkle(gem.position);pop(gem);setProgress(n,total,n<total?`Μπράβο! Μένουν ${total-n}.`:undefined)})}
  } else if(game.kind==="build"){
    onMessage("Χτίσε ένα μικρό χωριό: βάλε 6 κομμάτια όπου σου αρέσει.");let n=0;const spots=[[-1.8,-1.3],[0,-1.5],[1.8,-1.2],[-1.4,.8],[.4,.7],[2,.6]];
    for(let i=0;i<6;i++){const block=i%3===0?B.MeshBuilder.CreateCylinder("build-piece",{height:1,diameter:1,tessellation:4},scene):B.MeshBuilder.CreateBox("build-piece",{size:1},scene);block.position=new B.Vector3(-4.6+i*.72,.9,3.1);block.material=createMaterial(B,scene,"block"+i,COLORS[i%COLORS.length],.5,.01);shadow.addShadowCaster(block);addClickable(block,()=>{if((block as any)._placed)return;(block as any)._placed=true;const [x,z]=spots[n%spots.length];const from=block.position.clone(),to=new B.Vector3(x,.9,z);const a=new B.Animation("place","position",30,B.Animation.ANIMATIONTYPE_VECTOR3,B.Animation.ANIMATIONLOOPMODE_CONSTANT);a.setKeys([{frame:0,value:from},{frame:18,value:to}]);block.animations=[a];scene.beginAnimation(block,0,18,false);n++;setProgress(n,6,n<6?"Ωραία επιλογή. Συνέχισε όπως θέλεις!":undefined)})}
  } else if(game.kind==="rescue"){
    onMessage("Βοήθησε τα 4 ζωάκια: πάτησε πρώτα θάλασσα ή στεριά και μετά το ζωάκι που ταιριάζει.");let n=0;let habitat:"sea"|"land"|null=null;
    const seaZone=B.MeshBuilder.CreateCylinder("sea-zone",{height:.35,diameter:2.2,tessellation:48},scene);seaZone.position=new B.Vector3(-2.4,.55,2.6);seaZone.material=createMaterial(B,scene,"sea-zone-m","#4abbed",.28,.04);addClickable(seaZone,()=>{habitat="sea";onMessage("Διάλεξες θάλασσα. Ποιο ζωάκι ζει εκεί;")});
    const landZone=B.MeshBuilder.CreateCylinder("land-zone",{height:.35,diameter:2.2,tessellation:48},scene);landZone.position=new B.Vector3(2.4,.55,2.6);landZone.material=createMaterial(B,scene,"land-zone-m","#73c96a",.6,0);addClickable(landZone,()=>{habitat="land";onMessage("Διάλεξες στεριά. Ποιο ζωάκι ζει εκεί;")});
    const animals=[{h:"sea",c:"#64c9ef"},{h:"land",c:"#b57a4d"},{h:"sea",c:"#7bd3d1"},{h:"land",c:"#d99d5b"}];
    animals.forEach((a,i)=>{const m=B.MeshBuilder.CreateSphere("animal",{diameter:.8,segments:24},scene);m.scaling=new B.Vector3(1.25,.75,.75);m.position=new B.Vector3(-2.1+i*1.4,.85,-2);m.material=createMaterial(B,scene,"animal"+i,a.c,.62,0);addClickable(m,()=>{if(!habitat){onMessage("Πρώτα διάλεξε θάλασσα ή στεριά.");return}if(habitat===a.h&&!m.isEnabled()){return}if(habitat===a.h){n++;sparkle(m.position);pop(m);setProgress(n,4,"Σωστά! Διάλεξε ξανά περιβάλλον.");habitat=null}else{onMistake();onMessage("Σκέψου πού μπορεί να αναπνέει και να βρίσκει τροφή αυτό το ζωάκι.")}})})
  } else if(game.kind==="count"){
    const target=3+Math.floor(rng()*4);onMessage(`Το καραβάκι χρειάζεται ακριβώς ${target} κιβώτια. Πάτησέ τα.`);let n=0;
    for(let i=0;i<8;i++){const crate=B.MeshBuilder.CreateBox("crate",{size:.78},scene);crate.position=new B.Vector3(-2.7+(i%4)*1.25,.82,-1.8+Math.floor(i/4)*1.4);crate.material=createMaterial(B,scene,"crate"+i,["#d59a55","#c88745"][i%2],.88,0);shadow.addShadowCaster(crate);addClickable(crate,()=>{if(!crate.isEnabled())return;n++;pop(crate);if(n===target)setProgress(n,target);else if(n>target){onMistake();onMessage(`Έχουμε ${n}. Χρειαζόμασταν ${target}. Πάτησε ↻ για νέα προσπάθεια.`)}else setProgress(n,target,`Έβαλες ${n}. Πόσα λείπουν;`)})}
  } else if(game.kind==="pattern"){
    const seq=[0,1,0,1];onMessage("Κοίτα το μοτίβο. Ποιο χρώμα έρχεται μετά;");seq.forEach((ci,i)=>{const m=B.MeshBuilder.CreateSphere("pattern-fixed",{diameter:.82,segments:24},scene);m.position=new B.Vector3(-3+i*1.15,.85,-1.5);m.material=createMaterial(B,scene,"pat"+i,["#4ebdf0","#ffd34c"][ci],.36,.02)});[0,2,1].forEach((ci,i)=>{const m=B.MeshBuilder.CreateSphere("pattern-choice",{diameter:1,segments:28},scene);m.position=new B.Vector3(-1.4+i*1.4,.9,1.4);m.material=createMaterial(B,scene,"choice"+i,["#4ebdf0","#ff7197","#ffd34c"][ci],.3,.03);addClickable(m,()=>{if(ci===0){sparkle(m.position);setProgress(1,1)}else{onMistake();onMessage("Κοίτα ξανά: μπλε, κίτρινο, μπλε, κίτρινο…")}})})
  } else if(game.kind==="science"){
    onMessage("Κάνε πρόβλεψη: πάτησε αντικείμενο και δες αν επιπλέει ή βυθίζεται. Δοκίμασε και τα 5.");let n=0;const floats=[true,false,true,false,true];
    for(let i=0;i<5;i++){const m=i%2?B.MeshBuilder.CreateBox("science-object",{size:.72},scene):B.MeshBuilder.CreateSphere("science-object",{diameter:.78,segments:24},scene);m.position=new B.Vector3(-2.4+i*1.2,1.3,-1.4);m.material=createMaterial(B,scene,"sci"+i,COLORS[i],.45,.08);addClickable(m,()=>{if((m as any)._done)return;(m as any)._done=true;const to=m.position.clone();to.y=floats[i]?.95:-.18;const a=new B.Animation("float","position",30,B.Animation.ANIMATIONTYPE_VECTOR3,B.Animation.ANIMATIONLOOPMODE_CONSTANT);a.setKeys([{frame:0,value:m.position.clone()},{frame:25,value:to}]);m.animations=[a];scene.beginAnimation(m,0,25,false);n++;setProgress(n,5,floats[i]?"Επιπλέει! Τι παρατήρησες;":"Βυθίζεται! Τι μπορεί να είναι διαφορετικό;")})}
  } else if(game.kind==="story"){
    onMessage("Ο Πισιπούκ βρήκε έναν χάρτη. Διάλεξε μπλε ή χρυσό μονοπάτι.");const blue=B.MeshBuilder.CreateBox("blue-path",{width:2.2,height:.35,depth:2.8},scene);blue.position=new B.Vector3(-1.7,.58,1.4);blue.material=createMaterial(B,scene,"bluepath","#4dbcf0",.5,.02);const gold=B.MeshBuilder.CreateBox("gold-path",{width:2.2,height:.35,depth:2.8},scene);gold.position=new B.Vector3(1.7,.58,1.4);gold.material=createMaterial(B,scene,"goldpath","#ffd34e",.45,.02);let chosen=false;const choose=(which:string,m:any)=>{if(chosen)return;chosen=true;sparkle(m.position);onMessage(which==="μπλε"?"Το μπλε μονοπάτι σε έφερε σε μια κρυφή σπηλιά με ζωγραφιές!":"Το χρυσό μονοπάτι σε έφερε σε έναν κήπο με σπόρους!");setTimeout(()=>setProgress(1,1),1200)};addClickable(blue,()=>choose("μπλε",blue));addClickable(gold,()=>choose("χρυσό",gold))
  }

  engine.runRenderLoop(()=>scene.render());
  const resize=()=>engine.resize();window.addEventListener("resize",resize);
  return ()=>{window.removeEventListener("resize",resize);scene.dispose();engine.dispose()};
}

function BabylonGame({game,onClose,onComplete,onMistake}:{game:GameDef;onClose:()=>void;onComplete:(ms:number)=>void;onMistake:()=>void}){
  const canvas=useRef<HTMLCanvasElement>(null);const started=useRef(Date.now());
  const[msg,setMsg]=useState("Ο Πισιπούκ ετοιμάζει τον κόσμο…");const[progress,setProgress]=useState({n:0,total:1});const[error,setError]=useState<string|null>(null);const[restart,setRestart]=useState(0);const[done,setDone]=useState(false);
  useEffect(()=>{let cleanup:(()=>void)|undefined;let cancelled=false;setDone(false);setMsg("Ο Πισιπούκ ετοιμάζει τον κόσμο…");setProgress({n:0,total:1});setError(null);started.current=Date.now();loadBabylon().then(B=>{if(cancelled||!canvas.current)return;cleanup=createScene(B,canvas.current,game,setMsg,(n,total)=>setProgress({n,total}),()=>{setDone(true);onComplete(Date.now()-started.current)},onMistake)}).catch(()=>setError("Ο 3D μηχανισμός δεν φορτώθηκε. Έλεγξε τη σύνδεση και δοκίμασε ξανά."));return()=>{cancelled=true;cleanup?.()}},[game.id,restart]);
  return <div className="v12-play"><canvas ref={canvas} aria-label={`3D παιχνίδι ${game.title}`}/><div className="v12-game-top"><button onClick={onClose}><X/> Έξοδος</button><div><small>{game.age} ετών • {game.domain}</small><b>{game.title}</b></div><button onClick={()=>setRestart(v=>v+1)}><RotateCcw/> Ξανά</button></div><div className="v12-guide"><img src={bearLogo} alt="Πισιπούκ το αρκουδάκι"/><div><b>Πισιπούκ</b><p>{error||msg}</p>{!error&&<span>{Math.min(progress.n,progress.total)}/{progress.total}</span>}</div></div><div className="v12-parent-hint"><HeartHandshake/><div><b>Μαζί με τον γονέα</b><span>{game.parent}</span></div></div>{done&&<div className="v12-win"><div>⭐</div><h2>Τα κατάφερες!</h2><p>Τώρα συνέχισε την ιδέα εκτός οθόνης.</p><button onClick={onClose}>Επιστροφή στα παιχνίδια</button></div>}</div>
}

function ParentStats({stats,onClose}:{stats:Stats;onClose:()=>void}){
  const rows=GAMES.map(g=>({g,s:stats[g.id]})).filter(x=>x.s?.plays);
  return <div className="v12-modalback"><div className="v12-parent"><button className="v12-close" onClick={onClose}><X/></button><div className="v12-parent-head"><BarChart3/><div><small>LOCAL-FIRST • ΧΩΡΙΣ ΟΝΟΜΑ ΠΑΙΔΙΟΥ</small><h2>Γωνιά Γονέα</h2></div></div><p>Τα στοιχεία μένουν σε αυτή τη συσκευή. Δεν είναι αξιολόγηση ανάπτυξης· βοηθούν μόνο να βλέπεις τι προτιμά το παιδί και αν ένα παιχνίδι επαναλαμβάνεται υπερβολικά.</p><div className="v12-stats">{rows.length?rows.map(({g,s})=><div key={g.id}><b>{g.icon} {g.title}</b><span>{s.plays} φορές • {s.completions} ολοκληρώσεις • {s.mistakes} επαναπροσπάθειες • {Math.round(s.totalMs/Math.max(1,s.completions)/1000)}s μ. χρόνος</span></div>):<div><b>Δεν υπάρχουν ακόμη παιχνίδια.</b><span>Παίξτε μία δραστηριότητα και επιστρέψτε εδώ.</span></div>}</div><section className="v12-research"><h3>Τι μετράμε παιδαγωγικά</h3><p>Παιχνίδι και περιέργεια • κοινωνικο-συναισθηματική ανάπτυξη • γλώσσα • λογική/μαθηματικά • επιστημονική διερεύνηση • δημιουργικότητα • κίνηση και πραγματική ζωή.</p></section></div></div>
}

export function PreschoolV12(){
  const[age,setAge]=useState<Age>("2–3");const[game,setGame]=useState<GameDef|null>(null);const[legacy,setLegacy]=useState(false);const[parent,setParent]=useState(false);const[stats,setStats]=useState<Stats>(()=>getStats());
  const games=useMemo(()=>GAMES.filter(g=>g.age===age),[age]);
  const start=(g:GameDef)=>{setStats(prev=>{const old=prev[g.id]||{plays:0,completions:0,mistakes:0,totalMs:0,lastPlayed:Date.now()};const next={...prev,[g.id]:{...old,plays:old.plays+1,lastPlayed:Date.now()}};saveStats(next);return next});setGame(g)};
  const complete=(ms:number)=>{if(!game)return;const id=game.id;setStats(prev=>{const old=prev[id]||{plays:1,completions:0,mistakes:0,totalMs:0,lastPlayed:Date.now()};const next={...prev,[id]:{...old,completions:old.completions+1,totalMs:old.totalMs+ms,lastPlayed:Date.now()}};saveStats(next);return next})};
  const mistake=()=>{if(!game)return;const id=game.id;setStats(prev=>{const old=prev[id]||{plays:1,completions:0,mistakes:0,totalMs:0,lastPlayed:Date.now()};const next={...prev,[id]:{...old,mistakes:old.mistakes+1,lastPlayed:Date.now()}};saveStats(next);return next})};
  if(legacy)return <div className="v12-legacy"><button className="v12-back-library" onClick={()=>setLegacy(false)}><ArrowLeft/> 3D PlayWorld</button><PreschoolV11Styled/></div>;
  return <div className="v12"><style>{CSS}</style><header className="v12-top"><div className="v12-brand"><img src={bearLogo} alt="Πισιπούκ το αρκουδάκι"/><div><b>Ο ΚΟΣΜΟΣ ΤΟΥ ΠΙΣΙΠΟΥΚ</b><small>3D PLAYWORLD • 2–6 ΕΤΩΝ</small></div></div><div className="v12-actions"><button onClick={()=>setLegacy(true)}><Library/> Όλο το Preschool</button><button className="parent" onClick={()=>setParent(true)}><LockKeyhole/> Γονείς</button></div></header><main className="v12-main"><section className="v12-hero"><div className="v12-copy"><span className="v12-kicker"><Sparkles/> ΝΕΑ 3D ΠΑΙΧΝΙΔΙΑ ΜΕ ΤΟΝ ΠΙΣΙΠΟΥΚ</span><h1>Παίζω μέσα<br/><em>στον κόσμο.</em></h1><p>Όχι emoji πάνω σε κάρτες. Πραγματικοί 3D χώροι, αντικείμενα που αγγίζεις, περιστρέφεις και εξερευνάς — με διαφορετικό σχεδιασμό για κάθε ηλικία.</p><div className="v12-ages">{(Object.keys(AGE_INFO) as Age[]).map(a=><button key={a} className={age===a?"on":""} onClick={()=>setAge(a)}><b>{AGE_INFO[a].label}</b><span>{AGE_INFO[a].note}</span></button>)}</div></div><div className="v12-photo-stack"><img className="p1" src={classroomPhoto} alt="Ο πραγματικός χώρος του Πισιπούκ"/><img className="p2" src={storyPhoto} alt="Ιστορίες και παιδαγωγικό περιβάλλον του Πισιπούκ"/><img className="p3" src={artPhoto} alt="Δημιουργικές δραστηριότητες του Πισιπούκ"/><div className="v12-mascot"><img src={bearLogo} alt="Πισιπούκ"/><b>Το αρκουδάκι είναι ο οδηγός!</b></div></div></section><section className="v12-age-note"><div><Gamepad2/><div><b>{AGE_INFO[age].label}</b><span>{AGE_INFO[age].principle}</span></div></div><div><Trophy/><span>{games.length} flagship 3D παιχνίδια • learning + pure fun + co-play</span></div></section><section className="v12-grid">{games.map(g=><button className={`v12-card tone-${g.tone}`} key={g.id} onClick={()=>start(g)}><div className="v12-card-art"><span>{g.icon}</span><i>{g.tone}</i><div className="v12-depth one"/><div className="v12-depth two"/></div><small>{g.minutes} • {g.domain}</small><h2>{g.title}</h2><p>{g.subtitle}</p><div className="v12-card-bottom"><span>Γιατί υπάρχει: {g.why}</span><b>ΠΑΙΖΩ 3D →</b></div></button>)}</section><section className="v12-method"><div><BookOpen/><h3>Research → παιχνίδι, όχι worksheet</h3><p>Οι δραστηριότητες σχεδιάζονται γύρω από child choice, exploration, creation, family interaction και whole-child ανάπτυξη. Κάθε ηλικία έχει άλλη δυσκολία και άλλο interaction budget.</p></div><div><HeartHandshake/><h3>Ο γονιός είναι μέρος του παιχνιδιού</h3><p>Κάθε παιχνίδι έχει μικρό co-play prompt. Η οθόνη δίνει αφορμή για συζήτηση ή δράση έξω από την οθόνη.</p></div><div><Sparkles/><h3>Procedural παραλλαγές</h3><p>Χρώματα, θέσεις, στόχοι και διάταξη αλλάζουν ανά session ώστε να μειώνεται η επανάληψη χωρίς paid AI runtime.</p></div></section></main>{game&&<BabylonGame game={game} onClose={()=>setGame(null)} onComplete={complete} onMistake={mistake}/>} {parent&&<ParentStats stats={stats} onClose={()=>setParent(false)}/>}</div>
}

const CSS=`
.v12{min-height:100svh;background:radial-gradient(circle at 80% 0,#dff7ff 0,transparent 34%),linear-gradient(180deg,#fffdf4,#eef9ff);color:#18205b;font-family:inherit}.v12 *{box-sizing:border-box}.v12 button{font:inherit;touch-action:manipulation}.v12-top{height:82px;display:flex;align-items:center;justify-content:space-between;gap:16px;width:min(1580px,calc(100% - 28px));margin:auto}.v12-brand{display:flex;align-items:center;gap:11px}.v12-brand img{width:58px;height:58px;object-fit:contain;border-radius:18px;background:white;box-shadow:0 10px 28px #273c6922}.v12-brand b{display:block;font-size:.96rem}.v12-brand small{font-size:.64rem;color:#7457ec;font-weight:950;letter-spacing:.09em}.v12-actions{display:flex;gap:8px}.v12-actions button{border:0;border-radius:18px;background:white;color:#17205b;padding:12px 15px;font-weight:900;display:flex;align-items:center;gap:7px;box-shadow:0 9px 25px #28396516}.v12-actions .parent{background:#6848e8;color:white}.v12-main{width:min(1580px,calc(100% - 28px));margin:auto;padding-bottom:34px}.v12-hero{min-height:500px;border-radius:38px;overflow:hidden;display:grid;grid-template-columns:1.04fr .96fr;background:linear-gradient(135deg,#fff 0 55%,#e8f8ff 55%);box-shadow:0 24px 65px #22355b1d;position:relative}.v12-copy{padding:42px 38px;z-index:2}.v12-kicker{display:inline-flex;align-items:center;gap:7px;background:#fff0ad;border-radius:999px;padding:9px 14px;font-size:.7rem;font-weight:950}.v12 h1{font-size:clamp(3.8rem,6vw,7.3rem);line-height:.83;letter-spacing:-.065em;margin:18px 0 18px;color:#5f43dc}.v12 h1 em{font-style:normal;color:#ff4e82}.v12-copy>p{max-width:720px;font-size:1.05rem;line-height:1.5;font-weight:750;color:#526083}.v12-ages{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:22px}.v12-ages button{border:0;border-radius:20px;background:#f4f1ff;padding:13px;text-align:left;color:#18205b;min-height:92px}.v12-ages button:nth-child(2){background:#fff0d0}.v12-ages button:nth-child(3){background:#e7f6ff}.v12-ages button.on{outline:4px solid #694ae92d;box-shadow:inset 0 0 0 2px #674ae8}.v12-ages b{display:block;font-size:1rem}.v12-ages span{display:block;font-size:.68rem;font-weight:800;color:#69718f;margin-top:5px}.v12-photo-stack{position:relative;min-height:500px;overflow:hidden}.v12-photo-stack img{position:absolute;object-fit:cover;border:7px solid white;box-shadow:0 18px 38px #24365f2f}.v12-photo-stack .p1{width:68%;height:65%;right:3%;top:6%;border-radius:32px;transform:rotate(2deg)}.v12-photo-stack .p2{width:48%;height:48%;left:2%;bottom:4%;border-radius:28px;transform:rotate(-4deg)}.v12-photo-stack .p3{width:39%;height:40%;right:6%;bottom:2%;border-radius:25px;transform:rotate(5deg)}.v12-mascot{position:absolute;right:4%;top:56%;z-index:5;background:white;border-radius:24px;padding:8px 12px 8px 8px;display:flex;align-items:center;gap:8px;box-shadow:0 15px 35px #27396030;transform:rotate(-2deg)}.v12-mascot img{position:static!important;width:58px!important;height:58px!important;border:0!important;box-shadow:none!important;object-fit:contain!important}.v12-mascot b{font-size:.72rem;max-width:120px}.v12-age-note{display:flex;justify-content:space-between;align-items:center;gap:14px;margin:14px 0;background:#17205b;color:white;border-radius:24px;padding:15px 18px}.v12-age-note>div{display:flex;align-items:center;gap:11px}.v12-age-note b{display:block}.v12-age-note span{font-size:.76rem;color:#e4e7ff;font-weight:750}.v12-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:13px}.v12-card{border:0;background:#fff;border-radius:28px;padding:13px;text-align:left;color:#17205b;box-shadow:0 14px 34px #25355c17;cursor:pointer;transition:.2s transform}.v12-card:hover{transform:translateY(-5px)}.v12-card-art{height:180px;border-radius:22px;background:linear-gradient(145deg,#b8ecff,#fff0b8);display:grid;place-items:center;position:relative;overflow:hidden;perspective:700px}.v12-card-art>span{font-size:5rem;z-index:3;filter:drop-shadow(0 18px 12px #43547b2e);transform:translateZ(70px) rotate(-3deg)}.v12-card-art i{position:absolute;left:12px;top:12px;background:#ffffffdf;border-radius:999px;padding:6px 9px;font-style:normal;font-size:.65rem;font-weight:950;z-index:5}.v12-depth{position:absolute;border-radius:50%;transform:rotateX(64deg);filter:blur(.2px)}.v12-depth.one{width:78%;height:52%;background:#75d378;bottom:-17%;left:9%;box-shadow:inset 0 0 35px #3b9d5d60}.v12-depth.two{width:52%;height:38%;background:#4ec3ef;top:-15%;right:-13%;opacity:.8}.tone-Παίζω .v12-card-art{background:linear-gradient(145deg,#bdefff,#e9deff)}.tone-Μαζί .v12-card-art{background:linear-gradient(145deg,#ffe2ec,#fff2bd)}.v12-card>small{display:block;margin:11px 3px 0;color:#6c55e9;font-weight:900;font-size:.69rem}.v12-card h2{font-size:1.18rem;margin:4px 3px}.v12-card>p{font-size:.78rem;color:#68718e;line-height:1.45;font-weight:720;margin:0 3px;min-height:54px}.v12-card-bottom{margin-top:12px;border-top:1px solid #ececf6;padding:10px 3px 2px}.v12-card-bottom span{display:block;font-size:.67rem;color:#69718b;line-height:1.35}.v12-card-bottom b{display:block;margin-top:8px;color:#6548e7;font-size:.74rem}.v12-method{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:14px}.v12-method>div{background:white;border-radius:24px;padding:18px;box-shadow:0 12px 30px #26365a14}.v12-method svg{color:#6548e7}.v12-method h3{margin:8px 0 5px}.v12-method p{margin:0;color:#69718e;font-size:.77rem;line-height:1.45}.v12-play{position:fixed;inset:0;z-index:300;background:#bfeeff}.v12-play canvas{width:100%;height:100%;display:block;touch-action:none}.v12-game-top{position:absolute;top:max(12px,env(safe-area-inset-top));left:14px;right:14px;display:flex;justify-content:space-between;align-items:center;gap:12px;pointer-events:none}.v12-game-top>*{pointer-events:auto}.v12-game-top>button{border:0;border-radius:18px;background:#ffffffed;color:#18205b;padding:11px 14px;font-weight:900;display:flex;gap:6px;align-items:center;box-shadow:0 10px 26px #27385d25}.v12-game-top>div{background:#17205bea;color:white;padding:10px 17px;border-radius:21px;text-align:center;backdrop-filter:blur(12px);box-shadow:0 10px 28px #24345d28}.v12-game-top small{display:block;color:#a9e6ff;font-size:.62rem;font-weight:900}.v12-game-top b{display:block;font-size:1rem}.v12-guide{position:absolute;left:18px;bottom:max(22px,calc(env(safe-area-inset-bottom) + 12px));display:flex;align-items:center;gap:9px;background:#ffffffee;padding:8px 14px 8px 8px;border-radius:24px;box-shadow:0 14px 35px #26375e2f;max-width:min(520px,calc(100% - 36px));backdrop-filter:blur(12px)}.v12-guide img{width:68px;height:68px;object-fit:contain;border-radius:18px;background:white}.v12-guide b{display:block;color:#694ae8}.v12-guide p{margin:2px 0;font-size:.82rem;line-height:1.35;font-weight:800}.v12-guide span{font-size:.7rem;color:#777f98;font-weight:900}.v12-parent-hint{position:absolute;right:18px;bottom:max(22px,calc(env(safe-area-inset-bottom) + 12px));background:#17205be8;color:white;border-radius:22px;padding:10px 14px;max-width:390px;display:flex;gap:9px;align-items:center;backdrop-filter:blur(12px)}.v12-parent-hint b{display:block;font-size:.72rem}.v12-parent-hint span{display:block;font-size:.67rem;color:#e5e8ff;line-height:1.35}.v12-win{position:absolute;inset:0;background:#17205bc7;backdrop-filter:blur(8px);display:grid;place-content:center;text-align:center;color:white;padding:20px}.v12-win>div{font-size:6rem}.v12-win h2{font-size:3rem;margin:0}.v12-win p{color:#e8ebff}.v12-win button{justify-self:center;border:0;border-radius:18px;background:#ffd64f;color:#17205b;padding:13px 18px;font-weight:950}.v12-modalback{position:fixed;inset:0;z-index:320;background:#11183fb5;backdrop-filter:blur(8px);display:grid;place-items:center;padding:18px}.v12-parent{width:min(850px,100%);max-height:92vh;overflow:auto;background:white;border-radius:30px;padding:26px;position:relative}.v12-close{position:absolute;right:14px;top:14px;border:0;border-radius:50%;width:42px;height:42px;background:#eeeaff;color:#6648e7}.v12-parent-head{display:flex;align-items:center;gap:11px}.v12-parent-head svg{width:42px;height:42px;color:#6548e7}.v12-parent-head small{color:#7258e9;font-weight:950;font-size:.62rem}.v12-parent-head h2{margin:2px 0}.v12-parent>p{color:#65708d;line-height:1.5}.v12-stats{display:grid;gap:8px}.v12-stats>div{background:#f5f3ff;border-radius:17px;padding:12px}.v12-stats b,.v12-stats span{display:block}.v12-stats span{font-size:.73rem;color:#68718e;margin-top:4px}.v12-research{margin-top:16px;background:#fff7d8;border-radius:20px;padding:14px}.v12-research h3{margin:0 0 5px}.v12-research p{margin:0;font-size:.76rem;line-height:1.45}.v12-legacy{min-height:100svh}.v12-back-library{position:fixed;z-index:999;left:14px;top:14px;border:0;border-radius:18px;background:#17205b;color:white;padding:11px 14px;font-weight:900;display:flex;align-items:center;gap:6px;box-shadow:0 12px 30px #0003}
@media(max-width:1100px){.v12-hero{grid-template-columns:1fr}.v12-photo-stack{min-height:390px}.v12-grid{grid-template-columns:repeat(2,1fr)}.v12-method{grid-template-columns:1fr}.v12-parent-hint{display:none}.v12-hero{background:white}.v12-ages{max-width:800px}}
@media(max-width:700px){.v12-top{height:68px;width:100%;padding:6px 9px;position:sticky;top:0;z-index:60;background:#eefaff}.v12-brand img{width:46px;height:46px}.v12-brand b{font-size:.75rem}.v12-brand small{font-size:.52rem}.v12-actions button{padding:10px}.v12-actions button:first-child span,.v12-actions button:first-child{font-size:0}.v12-actions button:first-child svg{width:23px;height:23px}.v12-actions .parent{display:none}.v12-main{width:calc(100% - 14px)}.v12-hero{border-radius:28px}.v12-copy{padding:24px 18px}.v12 h1{font-size:4rem}.v12-copy>p{font-size:.9rem}.v12-ages{grid-template-columns:1fr}.v12-photo-stack{min-height:335px}.v12-photo-stack .p1{width:76%;height:64%}.v12-photo-stack .p2{width:52%}.v12-photo-stack .p3{width:43%}.v12-mascot{top:58%;right:3%}.v12-age-note{align-items:flex-start;flex-direction:column}.v12-grid{grid-template-columns:1fr}.v12-card-art{height:190px}.v12-game-top{align-items:flex-start}.v12-game-top>div{max-width:50%}.v12-game-top>button{font-size:.7rem;padding:9px}.v12-guide{bottom:max(14px,calc(env(safe-area-inset-bottom) + 8px));left:9px;right:9px;max-width:none}.v12-guide img{width:56px;height:56px}.v12-guide p{font-size:.74rem}.v12-win h2{font-size:2.2rem}}
@media(prefers-reduced-motion:reduce){.v12-card{transition:none}}
`;
