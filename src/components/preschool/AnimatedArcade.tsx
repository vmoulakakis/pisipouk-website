import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Sparkles, MousePointer2 } from "lucide-react";
import type { V15Age } from "./v15/Games";
import "./animated-arcade.css";

/** No Flash Player, paid API or external runtime: a true HTML5 Canvas game loop. */
type Kind = "bloom"|"sort"|"bridge"|"music"|"sail"|"shapes"|"constellation"|"water";
type Game = {id:Kind;title:string;subject:string;description:string;world:string;ages:V15Age[];accent:string;scene:string;offline:string};
export const ANIMATED_GAMES:Game[] = [
 {id:"bloom",title:"Ο κήπος ξυπνά!",subject:"Φύση · αιτία και αποτέλεσμα",description:"Άγγιξε τα λουλουδάκια και δες τον κήπο να ανθίζει.",world:"nature",ages:["2-3","3-4","4-5","5-6"],accent:"#d36d81",scene:"garden",offline:"Φυτέψτε έναν σπόρο μαζί και παρατηρήστε την ανάπτυξή του."},
 {id:"sort",title:"Τα καλάθια των χρωμάτων",subject:"Ταξινόμηση · χρώματα",description:"Σύρε κάθε χρωματιστό πετράδι στο σωστό καλάθι.",world:"discovery",ages:["2-3","3-4","4-5","5-6"],accent:"#d39b47",scene:"workshop",offline:"Ταξινομήστε μεγάλα ασφαλή αντικείμενα ανά χρώμα."},
 {id:"bridge",title:"Φτιάξε τη γεφυρούλα",subject:"Κατασκευές · χώρος",description:"Τοποθέτησε ξύλινα σανιδάκια για να ενώσεις τις όχθες.",world:"discovery",ages:["3-4","4-5","5-6"],accent:"#4a8f9b",scene:"river",offline:"Χτίστε μια μικρή γέφυρα με μεγάλους κύβους και δοκιμάστε την."},
 {id:"music",title:"Η μουσική του ουράνιου τόξου",subject:"Ελεύθερη μουσική · ρυθμός",description:"Άγγιξε τα μουσικά λουλούδια και φτιάξε τη μελωδία σου.",world:"music",ages:["2-3","3-4","4-5","5-6"],accent:"#986db4",scene:"music",offline:"Δοκιμάστε να επαναλάβετε με παλαμάκια μια μικρή μελωδία."},
 {id:"sail",title:"Το μικρό καραβάκι",subject:"Ελλάδα · εξερεύνηση",description:"Άγγιξε τα νησάκια για να ταξιδέψει το καραβάκι.",world:"greece",ages:["3-4","4-5","5-6"],accent:"#4c9bb2",scene:"sea",offline:"Φτιάξτε χάρτινη βάρκα και παρατηρήστε πώς επιπλέει."},
 {id:"shapes",title:"Το σπίτι των σχημάτων",subject:"Γεωμετρία · συντονισμός",description:"Πιάσε τα σχήματα και βάλε το καθένα στη σκιά του.",world:"discovery",ages:["2-3","3-4","4-5","5-6"],accent:"#b77c59",scene:"workshop",offline:"Φτιάξτε ένα σπιτάκι από μεγάλα χρωματιστά χαρτονάκια."},
 {id:"constellation",title:"Η μαγική ιστορία των άστρων",subject:"Αφήγηση · διαδοχή",description:"Άγγιξε διαδοχικά τα φωτεινά αστέρια και σχεδίασε τη δική σου ιστορία.",world:"stories",ages:["4-5","5-6"],accent:"#8071bc",scene:"night",offline:"Φανταστείτε μια ιστορία για τα αστέρια και ζωγραφίστε την."},
 {id:"water",title:"Ποτίζω τον μικρό κήπο",subject:"Φροντίδα · λεπτή κίνηση",description:"Σύρε τις σταγόνες στα μικρά φυτά για να μεγαλώσουν.",world:"nature",ages:["2-3","3-4","4-5","5-6"],accent:"#5a9fa7",scene:"garden",offline:"Ποτίστε μαζί ένα αληθινό φυτό με λίγο νερό."},
];
type Piece={id:number;x:number;y:number;ox:number;oy:number;destX:number;destY:number;color:number;done:boolean};
type Particle={x:number;y:number;vx:number;vy:number,life:number,color:string};
type Scene={pieces:Piece[];completed:number;target:number;current:number;drag:number|null;particles:Particle[];notes:number;boatX:number;boatGoal:number;boatMoving:boolean;visited:number[];lastTime:number;win:boolean;points:{x:number;y:number}[]};
const W=960,H=540;
const PALETTE=["#ec857f","#efc65f","#77bba0","#78a8d4","#a58bc8"];
const LABELS=["κόκκινο","κίτρινο","πράσινο","μπλε","μωβ"];
const circles=(count:number,x1:number,x2:number,y:number)=>Array.from({length:count},(_,i)=>({x:x1+(x2-x1)*(count===1?.5:i/(count-1)),y}));
function initial(id:Kind,age:V15Age):Scene {
 const n=age==="2-3"?3:age==="3-4"?4:age==="4-5"?5:6;
 const build=(pts:{x:number;y:number}[],targets:{x:number;y:number}[],colors:number[])=>pts.map((p,i)=>({id:i,x:p.x,y:p.y,ox:p.x,oy:p.y,destX:targets[i].x,destY:targets[i].y,color:colors[i],done:false}));
 let pieces:Piece[]=[];
 if(id==="bloom"||id==="water"){
  const pts=circles(Math.min(id==="bloom"?5:4,n),155,830,390);
  pieces=build(pts,pts,pts.map((_,i)=>i%5));
 }
 if(id==="sort"){
  const targets=circles(6,190,770,428);
  const pts=circles(6,120,830,210);
  pieces=build(pts,targets,[0,1,2,0,1,2]).slice(0,n);
 }
 if(id==="bridge"){
  const pts=circles(4,230,730,445), targets=circles(4,350,620,313);
  pieces=build(pts,targets,[0,0,0,0]);
 }
 if(id==="shapes"){
  const pts=circles(5,190,765,435), targets=circles(5,190,765,265);
  pieces=build(pts,targets,[0,1,2,3,4]).slice(0,n);
 }
 if(id==="constellation"){
  const stars=[{x:230,y:160},{x:360,y:110},{x:490,y:210},{x:650,y:125},{x:740,y:270},{x:570,y:365}];
  pieces=build(stars,stars,stars.map((_,i)=>i)).slice(0,n);
 }
 return{pieces,completed:0,target:id==="music"?5:id==="sail"?3:pieces.length,current:0,drag:null,particles:[],notes:0,boatX:150,boatGoal:150,boatMoving:false,visited:[],lastTime:0,win:false,points:[]};
}
function oval(ctx:CanvasRenderingContext2D,x:number,y:number,rx:number,ry:number,color:string){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
function roundRect(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number,color:string){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function stroke(ctx:CanvasRenderingContext2D,color:string,width:number){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap="round";ctx.lineJoin="round";ctx.stroke();}
function shine(ctx:CanvasRenderingContext2D,x:number,y:number,r:number,t:number,color="#fff9cd"){
 ctx.save();ctx.translate(x,y);ctx.rotate(t);ctx.globalAlpha=.65;ctx.fillStyle=color;
 for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);ctx.beginPath();ctx.ellipse(0,-r*.74,r*.12,r*.31,0,0,Math.PI*2);ctx.fill();}
 ctx.restore();
}
function plant(ctx:CanvasRenderingContext2D,x:number,y:number,color:string,bloom:number,t:number){
 ctx.save();ctx.translate(x,y);ctx.lineWidth=8;ctx.strokeStyle="#4b8863";ctx.lineCap="round";
 ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-7,-35,8,-70,-3,-104*bloom);ctx.stroke();
 oval(ctx,-19,-36,23,10,"#72ac75");oval(ctx,22,-52,22,10,"#589766");
 if(bloom>.05){
  const headY=-101*bloom+Math.sin(t*1.8+x)*3;
  for(let i=0;i<6;i++){let a=i*Math.PI/3;oval(ctx,Math.cos(a)*22,headY+Math.sin(a)*22,16*bloom,22*bloom,color);}
  oval(ctx,0,headY,16*bloom,16*bloom,"#f9d673");oval(ctx,-4,headY-4,3,3,"#fff9d4");
 } else oval(ctx,0,-10,14,20,"#5d9d70");
 ctx.restore();
}
function jewel(ctx:CanvasRenderingContext2D,x:number,y:number,color:string,r=34){
 ctx.save();ctx.translate(x,y);ctx.shadowColor="#30535d50";ctx.shadowBlur=14;ctx.shadowOffsetY=7;
 ctx.fillStyle=color;ctx.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4-Math.PI/8;const xx=Math.cos(a)*r,yy=Math.sin(a)*r; i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.closePath();ctx.fill();ctx.shadowBlur=0;
 ctx.globalAlpha=.48;ctx.fillStyle="white";ctx.beginPath();ctx.moveTo(-r*.53,-r*.35);ctx.lineTo(0,-r*.7);ctx.lineTo(-r*.16,-r*.2);ctx.closePath();ctx.fill();ctx.restore();
}
function shape(ctx:CanvasRenderingContext2D,id:number,x:number,y:number,color:string,outline=false){
 ctx.save();ctx.translate(x,y);ctx.fillStyle=outline?"#f0e7d9":color;ctx.strokeStyle=outline?"#bea996":"#ffffff";ctx.lineWidth=outline?4:3;
 ctx.beginPath();const k=id%5;
 if(k===0)ctx.arc(0,0,33,0,Math.PI*2);
 else if(k===1)ctx.rect(-32,-32,64,64);
 else if(k===2){ctx.moveTo(0,-37);ctx.lineTo(38,32);ctx.lineTo(-38,32);ctx.closePath();}
 else if(k===3){for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2===0?38:18; i?ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r):ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();}
 else{ctx.moveTo(0,35);ctx.bezierCurveTo(-80,-6,-30,-49,0,-20);ctx.bezierCurveTo(30,-49,80,-6,0,35);}
 ctx.fill();ctx.stroke();ctx.restore();
}
function paintSky(ctx:CanvasRenderingContext2D,scene:string,t:number,reduced:boolean){
 const night=scene==="night",sea=scene==="sea",workshop=scene==="workshop";
 const grad=ctx.createLinearGradient(0,0,0,H);
 const sky=night?["#1d2956","#676b9b"]:sea?["#81bbde","#fce0b9"]:workshop?["#f5dcb9","#fbead1"]:["#80c3d1","#f6e0ad"];
 grad.addColorStop(0,sky[0]);grad.addColorStop(1,sky[1]);ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
 if(night){
  oval(ctx,780,90,37,37,"#fcf0ca");
  for(let i=0;i<24;i++){let x=(i*141+47)%W,y=(i*83+34)%400;shine(ctx,x,y,7,t*.25+i);}
 }else{
  oval(ctx,790,90,48,48,"#ffefb2");
  for(let i=0;i<4;i++){const x=((i*290+120)+(reduced?0:t*3))%1100-90,y=76+(i%2)*50;oval(ctx,x,y,57,17,"#ffffff90");oval(ctx,x+20,y-13,32,20,"#ffffff90");}
 }
 if(sea){
  const ocean=ctx.createLinearGradient(0,290,0,540);ocean.addColorStop(0,"#83cfd6");ocean.addColorStop(1,"#377d9c");ctx.fillStyle=ocean;ctx.fillRect(0,305,W,235);
  for(let i=0;i<24;i++){const x=i*47,y=336+(i%6)*37+(reduced?0:Math.sin(t+i)*5);ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+12,y-5,x+25,y);stroke(ctx,"#ffffff66",3);}
 }else if(!night){
  ctx.beginPath();ctx.moveTo(0,325);ctx.bezierCurveTo(160,218,250,308,460,274);ctx.bezierCurveTo(720,240,850,286,960,225);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fillStyle=workshop?"#c4d1a6":"#9bc3a5";ctx.fill();
  ctx.beginPath();ctx.moveTo(0,413);ctx.bezierCurveTo(200,324,400,402,625,360);ctx.bezierCurveTo(810,337,902,365,W,340);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fillStyle=workshop?"#afc6a3":"#70ad87";ctx.fill();
  for(let i=0;i<12;i++){let x=i*92+25;oval(ctx,x,496+(i%3)*13,28,13,i%2?"#78b68e":"#88c19b");}
 }
 if(!night&&!sea&&!workshop){
  for(let i=0;i<5;i++){const x=55+i*233;
    roundRect(ctx,x,250,17,190,8,"#8d7861");oval(ctx,x+8,235,71,80,i%2?"#568f6d":"#6c9f79");
    oval(ctx,x-28,211,44,43,"#7fb48c66");
  }
 }
}
function draw(ctx:CanvasRenderingContext2D,id:Kind,scene:Scene,t:number,reduced:boolean){
 const game=ANIMATED_GAMES.find(g=>g.id===id)!;paintSky(ctx,game.scene,t,reduced);
 if(id==="bloom"||id==="water"){
  if(id==="water")for(const p of scene.pieces) {
   oval(ctx,p.ox,420,55,20,"#975b46");roundRect(ctx,p.ox-42,386,84,39,9,"#bc7858");
  }
  for(const p of scene.pieces) {
   const grown=p.done?1:id==="water"?.25:0;
   plant(ctx,id==="water"?p.ox:p.x,id==="water"?p.oy:p.y,PALETTE[p.color],grown,t);
   if(id==="water"&&!p.done)shine(ctx,p.ox+10,p.oy-110,10,t);
  }
  if(id==="water"){
   for(let i=0;i<scene.pieces.length;i++){
    if(scene.pieces[i].done)continue;
    const x=scene.drag===i?scene.pieces[i].x:185+i*195;
    const y=scene.drag===i?scene.pieces[i].y:160;
    oval(ctx,x,y,26,35,"#63c4e3");oval(ctx,x-7,y-9,7,14,"#daf7fa");
   }
  }
  if(id==="bloom")for(const p of scene.pieces)if(!p.done)shine(ctx,p.x,p.y-88,11,t*.8);
 }
 if(id==="sort"){
  const baskets=circles(3,240,720,425);
  for(let i=0;i<3;i++){
   const b=baskets[i];oval(ctx,b.x,b.y+45,104,16,"#1f4c4160");roundRect(ctx,b.x-81,b.y-38,162,90,28,PALETTE[i]);
   roundRect(ctx,b.x-65,b.y-43,130,23,11,"#fff6ce99");
   oval(ctx,b.x,b.y-38,62,13,"#6c4e3d");oval(ctx,b.x,b.y-41,53,9,"#caac87");
   ctx.font="bold 17px system-ui";ctx.textAlign="center";ctx.fillStyle="#304d42";ctx.fillText(LABELS[i],b.x,b.y+36);
  }
  for(const p of scene.pieces)if(!p.done)jewel(ctx,p.x,p.y,PALETTE[p.color]);
 }
 if(id==="bridge"){
  roundRect(ctx,0,310,960,230,0,"#5eb7c9");for(let i=0;i<17;i++) {const x=i*70;const y=342+i%3*44+(reduced?0:Math.sin(t+i)*7);ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+20,y-9,x+37,y);stroke(ctx,"#d9f1e4b8",4);}
  roundRect(ctx,0,320,274,220,0,"#82b288");roundRect(ctx,686,320,274,220,0,"#82b288");
  roundRect(ctx,264,300,20,135,4,"#93694b");roundRect(ctx,676,300,20,135,4,"#93694b");
  for(const p of scene.pieces) {
   roundRect(ctx,p.destX-46,p.destY-19,92,38,7,p.done?"#c79156":"#e2d4b557");
   if(!p.done){roundRect(ctx,p.x-42,p.y-16,84,33,6,"#ca9161");roundRect(ctx,p.x-40,p.y-14,80,8,3,"#e6b581");}
  }
 }
 if(id==="music"){
  const pts=circles(5,170,790,335);
  for(let i=0;i<pts.length;i++){
   plant(ctx,pts[i].x,445,PALETTE[i],1,t);
   oval(ctx,pts[i].x,335,65,54,PALETTE[i]);oval(ctx,pts[i].x-19,321,12,12,"#fffafa9a");
   ctx.fillStyle="#fff";ctx.font="bold 36px system-ui";ctx.textAlign="center";ctx.fillText(["Ντο","Ρε","Μι","Φα","Σολ"][i],pts[i].x,344);
   if(scene.notes===i+1)shine(ctx,pts[i].x,267,24,t);
  }
 }
 if(id==="sail"){
  const islandPts=[{x:350,y:315},{x:560,y:315},{x:790,y:315}];
  for(let i=0;i<3;i++){
   let p=islandPts[i];oval(ctx,p.x,p.y,65,21,"#eaca80");oval(ctx,p.x,p.y-15,46,18,"#a0b988");
   ctx.fillStyle="#688968";ctx.fillRect(p.x+4,p.y-68,8,52);oval(ctx,p.x+7,p.y-75,35,27,"#529577");
   if(scene.visited.includes(i))shine(ctx,p.x,p.y-107,25,t);
  }
  const x=scene.boatX,y=391+(reduced?0:Math.sin(t*2)*4);
  ctx.fillStyle="#a65b4f";ctx.beginPath();ctx.moveTo(x-62,y);ctx.lineTo(x+62,y);ctx.lineTo(x+39,y+32);ctx.lineTo(x-39,y+32);ctx.closePath();ctx.fill();
  ctx.fillStyle="#fff5d7";ctx.beginPath();ctx.moveTo(x,y-107);ctx.lineTo(x,y-7);ctx.lineTo(x-66,y-7);ctx.closePath();ctx.fill();
  ctx.fillStyle="#eda97c";ctx.beginPath();ctx.moveTo(x+8,y-84);ctx.lineTo(x+8,y-7);ctx.lineTo(x+60,y-7);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(x,y-117);ctx.lineTo(x,y+3);stroke(ctx,"#75554a",5);
 }
 if(id==="shapes"){
  roundRect(ctx,95,209,770,137,29,"#fff8e3df");
  for(const p of scene.pieces){
   shape(ctx,p.id,p.destX,p.destY,PALETTE[p.color],true);
   if(p.done)shape(ctx,p.id,p.destX,p.destY,PALETTE[p.color],false);
   else shape(ctx,p.id,p.x,p.y,PALETTE[p.color],false);
  }
 }
 if(id==="constellation"){
  for(let i=0;i<scene.current-1;i++){ctx.beginPath();ctx.moveTo(scene.pieces[i].x,scene.pieces[i].y);ctx.lineTo(scene.pieces[i+1].x,scene.pieces[i+1].y);stroke(ctx,"#fff0b9",5);}
  scene.pieces.forEach((p,i)=>{oval(ctx,p.x,p.y,i===scene.current?18:12,i===scene.current?18:12,i<=scene.current?"#ffe3a0":"#c5c7eb");shine(ctx,p.x,p.y,i===scene.current?22:12,t*.5+i);});
 }
 for(const p of scene.particles){ctx.globalAlpha=Math.max(0,p.life);oval(ctx,p.x,p.y,7*p.life,7*p.life,p.color);ctx.globalAlpha=1;}
}
function pointer(e:ReactPointerEvent<HTMLCanvasElement>){
 const b=e.currentTarget.getBoundingClientRect();
 return {x:(e.clientX-b.left)*W/b.width,y:(e.clientY-b.top)*H/b.height};
}
function effect(scene:Scene,x:number,y:number,color:string){
 for(let i=0;i<15;i++){let a=i*Math.PI*2/15;scene.particles.push({x,y,vx:Math.cos(a)*(30+(i%3)*20),vy:Math.sin(a)*(30+(i%3)*20)-30,life:1,color});}
}
function note(freq:number){
 if(typeof window==="undefined")return;
 const win=window as Window & {webkitAudioContext?:typeof AudioContext};
 const Ac=win.AudioContext||win.webkitAudioContext;if(!Ac)return;
 const ctx=new Ac(),osc=ctx.createOscillator(),gain=ctx.createGain();
 osc.type="sine";osc.frequency.value=freq;osc.connect(gain);gain.connect(ctx.destination);
 gain.gain.setValueAtTime(.001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.18,ctx.currentTime+.024);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.45);
 osc.start();osc.stop(ctx.currentTime+.48);osc.onended=()=>{void ctx.close();};
}
export function AnimatedArcade({age,world,onExit}:{age:V15Age;world?:string;onExit:()=>void}){
 const games=ANIMATED_GAMES.filter(g=>g.ages.includes(age)&&(!world||g.world===world));
 const [selected,setSelected]=useState<Kind|null>(null),[status,setStatus]=useState(""),[progress,setProgress]=useState(0),[won,setWon]=useState(false),[sound,setSound]=useState(true);
 const canvas=useRef<HTMLCanvasElement>(null),scene=useRef<Scene|null>(null),lastFrame=useRef(0);
 const selectedGame=ANIMATED_GAMES.find(g=>g.id===selected);
 const restart=(id:Kind)=>{scene.current=initial(id,age);setSelected(id);setWon(false);setProgress(0);setStatus("Παίξε με το δάχτυλο, το ποντίκι ή τα κουμπιά.")};
 useEffect(()=>{if(!selected)return;const c=canvas.current;if(!c)return;const ctx=c.getContext("2d");if(!ctx)return;let raf=0,alive=true;let reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const frame=(ms:number)=>{
   if(!alive)return;
   const dpr=Math.min(2,window.devicePixelRatio||1);
   const width=Math.round(c.clientWidth*dpr),height=Math.round(c.clientHeight*dpr);
   if(width>0&&height>0&&(c.width!==width||c.height!==height)){c.width=width;c.height=height;}
   ctx.setTransform(c.width/W,0,0,c.height/H,0,0);
   const s=scene.current;if(s){let dt=Math.min(.05,(ms-(lastFrame.current||ms))/1000);lastFrame.current=ms;
    if(s.boatMoving){s.boatX+=(s.boatGoal-s.boatX)*Math.min(1,dt*2.1);if(Math.abs(s.boatGoal-s.boatX)<2){s.boatX=s.boatGoal;s.boatMoving=false;}}
    for(const p of s.particles){if(!reduce){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=75*dt;}p.life-=dt*.9;}
    s.particles=s.particles.filter(p=>p.life>0);
    draw(ctx,selected,s,ms/1000,reduce);
   }
   raf=requestAnimationFrame(frame);
  };raf=requestAnimationFrame(frame);
  return()=>{alive=false;cancelAnimationFrame(raf);lastFrame.current=0;};
 },[selected]);
 const update=(s:Scene,id:Kind)=>{
  setProgress(s.completed);
  if(s.completed>=s.target&&id!=="music"){s.win=true;setWon(true);setStatus("Υπέροχα! Η αποστολή ολοκληρώθηκε.");if(sound)note(784);}
 };
 const handleAction=(x:number,y:number)=>{
  if(!selected||!scene.current)return;const s=scene.current;if(s.win)return;
  if(selected==="music"){
   const pts=circles(5,170,790,335);let i=pts.findIndex(p=>Math.hypot(x-p.x,y-p.y)<75);
   if(i<0)return;s.notes=i+1;s.completed++;effect(s,pts[i].x,pts[i].y,PALETTE[i]);if(sound)note([261.63,293.66,329.63,349.23,392][i]);setProgress(s.completed);setStatus("Μπράβο! Φτιάξε τη δική σου μελωδία.");return;
  }
  if(selected==="sail"){
   const pts=[350,560,790];let i=pts.findIndex(p=>Math.abs(x-p)<85&&y<375&&y>210);
   if(i<0||s.visited.includes(i))return;s.visited.push(i);s.boatGoal=pts[i]-60;s.boatMoving=true;effect(s,pts[i],255,"#fff7c7");s.completed++;setStatus("Έφτασες σε ένα ακόμη νησάκι!");update(s,selected);return;
  }
  if(selected==="bloom"||selected==="constellation"){
   const p=s.pieces.find(p=>!p.done&&Math.hypot(x-p.x,y-(selected==="bloom"?p.y-65:p.y))<85);
   if(!p)return;
   if(selected==="constellation"&&p.id!==s.current){setStatus("Ακολούθησε το φωτεινό αστέρι.");return;}
   p.done=true;s.completed++;s.current++;effect(s,p.x,p.y-45,"#fef1aa");setStatus("Το ανακάλυψες! Συνέχισε.");update(s,selected);return;
  }
 };
 const start=(e:ReactPointerEvent<HTMLCanvasElement>)=>{
  if(!selected||!scene.current)return;const p=pointer(e),s=scene.current;
  if(["bloom","constellation","music","sail"].includes(selected)){handleAction(p.x,p.y);return;}
  const target=s.pieces.find(piece=>!piece.done&&Math.hypot(p.x-(selected==="water"?185+piece.id*195:piece.x),p.y-(selected==="water"?160:piece.y))<68);
  if(!target)return;s.drag=target.id;if(selected==="water"){target.x=185+target.id*195;target.y=160;}e.currentTarget.setPointerCapture(e.pointerId);
 };
 const move=(e:ReactPointerEvent<HTMLCanvasElement>)=>{
  const s=scene.current;if(!s||s.drag===null)return;const p=pointer(e),piece=s.pieces[s.drag];
  if(!piece)return;piece.x=p.x;piece.y=p.y;
 };
 const finish=(e:ReactPointerEvent<HTMLCanvasElement>)=>{
  if(!selected||!scene.current)return;const s=scene.current,p=pointer(e);
  if(s.drag===null)return;const thing=s.pieces[s.drag];s.drag=null;if(!thing)return;
  let success=false;
  if(selected==="sort"){
   const bins=circles(3,240,720,425);success=Math.hypot(p.x-bins[thing.color].x,p.y-bins[thing.color].y)<115;
  } else if(selected==="water"){
   success=Math.hypot(p.x-thing.destX,p.y-thing.destY)<95;
  }else success=Math.hypot(p.x-thing.destX,p.y-thing.destY)<80;
  if(success){thing.done=true;thing.x=thing.destX;thing.y=thing.destY;s.completed++;effect(s,thing.x,thing.y-30,PALETTE[thing.color]);setStatus("Τοποθετήθηκε! Συνέχισε την ανακάλυψη.");update(s,selected);}
  else{thing.x=thing.ox;thing.y=thing.oy;setStatus("Μπορείς να δοκιμάσεις ξανά, χωρίς βιασύνη.");}
 };
 const accessibleAction=(n:number)=>{
  if(!selected||!scene.current)return;const s=scene.current;
  if(["music","sail","bloom","constellation"].includes(selected)){
   if(selected==="music"){handleAction(circles(5,170,790,335)[n].x,335);}
   else if(selected==="sail"){handleAction([350,560,790][n],315);}
   else{const p=s.pieces[selected==="constellation"?s.current:n];if(p)handleAction(p.x,p.y-(selected==="bloom"?65:0));}
   return;
  }
  const thing=s.pieces[n];if(!thing||thing.done)return;
  thing.done=true;thing.x=thing.destX;thing.y=thing.destY;s.completed++;effect(s,thing.x,thing.y,PALETTE[thing.color]);setStatus("Τοποθετήθηκε!");update(s,selected);
 };
 const current=scene.current;
 return <section className="pa18">
  {!selected?<><header className="pa18-intro"><span><Sparkles size={18}/> HTML5 PLAY STUDIO</span><h2>Παιχνίδια που ζωντανεύουν!</h2><p>Αγγίζω, σέρνω, χτίζω, ανακαλύπτω. Κάθε σκηνή κινείται και ανταποκρίνεται στις επιλογές μου.</p></header><div className="pa18-grid">{games.map((g,i)=><button key={g.id} className="pa18-card" onClick={()=>restart(g.id)}>
    <div className={"pa18-art art-"+g.scene}><span className="pa18-art-shape" style={{background:g.accent}}/><span className="pa18-art-shape secondary"/><span className="pa18-art-number">{String(i+1).padStart(2,"0")}</span><span className="pa18-art-label">{g.scene==="night"?"✦":g.scene==="sea"?"≈":g.scene==="music"?"♫":g.scene==="garden"?"❀":g.scene==="river"?"⌒":"◇"}</span></div>
    <div className="pa18-card-info"><small>{g.subject}</small><h3>{g.title}</h3><p>{g.description}</p><strong>Παίζω τώρα →</strong></div></button>)}</div></>:<>
  <div className="pa18-toolbar"><button onClick={()=>{setSelected(null);setWon(false)}}><ArrowLeft size={17}/> Όλα τα παιχνίδια</button><div><b>{selectedGame?.title}</b><small>{selectedGame?.subject}</small></div><div className="pa18-tool-actions"><button onClick={()=>setSound(s=>!s)} aria-label={sound?"Χωρίς ήχο":"Με ήχο"}>{sound?<Volume2 size={20}/>:<VolumeX size={20}/>}</button><button onClick={()=>restart(selected)} aria-label="Από την αρχή"><RotateCcw size={20}/></button></div></div>
  <div className="pa18-stage"><canvas ref={canvas} aria-label={selectedGame?.title} role="img" onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} />
   <div className="pa18-instruction"><MousePointer2 size={18}/>{selectedGame?.description}</div>
   <div className="pa18-meter">{selected==="music"?"Νότες:":"Ανακαλύψεις:"} <strong>{progress}{selected==="music"?"":"/"+(current?.target||0)}</strong></div>
   {won&&<div className="pa18-win" role="status"><strong>Μπράβο, μικρέ εξερευνητή!</strong><p>Έκανες μια όμορφη ανακάλυψη. Θέλεις να ξαναπαίξεις;</p><button onClick={()=>restart(selected)}>Παίζω ξανά</button></div>}
  </div>
  <p className="pa18-status" role="status" aria-live="polite">{status}</p>
  <details className="pa18-access"><summary>Επιλογές χωρίς σύρσιμο (πληκτρολόγιο / προσβασιμότητα)</summary><div>
   {(selected==="sail"?["Νησί 1","Νησί 2","Νησί 3"]:selected==="music"?["Ντο","Ρε","Μι","Φα","Σολ"]:(current?.pieces||[]).map((p,i)=>selected==="sort"?LABELS[p.color]+" πετράδι "+(i+1):"Αντικείμενο "+(i+1))).map((s,i)=><button key={i} disabled={selected==="sail"?current?.visited.includes(i):selected==="music"?false:selected==="constellation"?i!==current?.current:current?.pieces[i]?.done} onClick={()=>accessibleAction(i)}>{s}</button>)}
  </div></details>
  <p className="pa18-offline"><b>Συνεχίζουμε εκτός οθόνης:</b> {selectedGame?.offline}</p>
  </>}
  <button className="pa18-exit" onClick={onExit}>← Επιστροφή στον κόσμο του Πισιπούκ</button>
 </section>;
}
