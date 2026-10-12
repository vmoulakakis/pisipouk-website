import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ArrowLeft, Circle, Hand, MoveHorizontal, Pause, Play, RotateCcw, Save, Shapes, Sparkles, Wind } from "lucide-react";
import type { V15Age } from "./v15/Games";
import "./BuildPlayground.css";

type Material="wood"|"brick"|"ball"|"beam";
type Body={id:number;kind:Material;x:number;y:number;w:number;h:number;vx:number;vy:number;color:string;moving:boolean};
const WIDTH=960,HEIGHT=540,GROUND=458;
const materials:Record<Material,{name:string;color:string;w:number;h:number}> = {
 wood:{name:"Ξύλινος κύβος",color:"#c89560",w:80,h:80},
 brick:{name:"Πέτρινος κύβος",color:"#a2b7bb",w:80,h:65},
 beam:{name:"Ξύλινη σανίδα",color:"#dfaf76",w:174,h:25},
 ball:{name:"Μπαλίτσα",color:"#e58275",w:55,h:55},
};
const clamp=(v:number,min:number,max:number)=>Math.min(max,Math.max(min,v));
const coords=(e:ReactPointerEvent<HTMLCanvasElement>)=>{const b=e.currentTarget.getBoundingClientRect();return{x:(e.clientX-b.left)*WIDTH/b.width,y:(e.clientY-b.top)*HEIGHT/b.height};};
const overlap=(a:Body,b:Body)=>Math.abs(a.x-b.x)<(a.w+b.w)*.48&&Math.abs(a.y-b.y)<(a.h+b.h)*.48;
const palette=["#c89560","#a2b7bb","#dfaf76","#e58275"];
function shape(ctx:CanvasRenderingContext2D,b:Body,selected=false){
 ctx.save();ctx.translate(b.x,b.y);ctx.shadowColor="#2743365e";ctx.shadowBlur=13;ctx.shadowOffsetY=11;
 if(b.kind==="ball"){
  let g=ctx.createRadialGradient(-11,-13,6,0,0,b.w/2);g.addColorStop(0,"#fff1d4");g.addColorStop(.22,b.color);g.addColorStop(1,"#ac544f");
  ctx.beginPath();ctx.arc(0,0,b.w/2,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=selected?"#fffbd8":"#fff6ed";ctx.lineWidth=selected?5:2;ctx.stroke();
 }else{
  ctx.beginPath();ctx.roundRect(-b.w/2,-b.h/2,b.w,b.h,7);ctx.fillStyle=b.color;ctx.fill();ctx.strokeStyle=selected?"#fffbd8":"#ffffff9b";ctx.lineWidth=selected?5:2;ctx.stroke();
  ctx.shadowBlur=0;ctx.fillStyle="#ffffff2a";ctx.fillRect(-b.w/2+7,-b.h/2+7,b.w-14,8);
  if(b.kind==="wood"||b.kind==="beam"){
   ctx.strokeStyle="#76553e64";ctx.lineWidth=2;
   for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(-b.w/2+15,-b.h/2+(i+1)*b.h/3);ctx.bezierCurveTo(-b.w/6,b.h/7,b.w/5,-b.h/7,b.w/2-15,-b.h/2+(i+1)*b.h/3);ctx.stroke();}
   if(b.kind==="beam"){ctx.fillStyle="#8a633e";for(const x of [-b.w*.36,b.w*.36]){ctx.beginPath();ctx.arc(x,0,3,0,Math.PI*2);ctx.fill();}}
  }else{ctx.strokeStyle="#697f8580";ctx.lineWidth=2;ctx.strokeRect(-b.w/2+11,-b.h/2+10,b.w-22,b.h-20);}
 }
 ctx.restore();
}
function background(ctx:CanvasRenderingContext2D,t:number,reduced:boolean){
 const grad=ctx.createLinearGradient(0,0,0,HEIGHT);grad.addColorStop(0,"#78b8cc");grad.addColorStop(.65,"#e7ddbe");grad.addColorStop(1,"#e5cb98");ctx.fillStyle=grad;ctx.fillRect(0,0,WIDTH,HEIGHT);
 ctx.fillStyle="#fff2b5";ctx.beginPath();ctx.arc(790,91,49,0,Math.PI*2);ctx.fill();
 for(let i=0;i<4;i++){let x=(i*330+50+(reduced?0:t*5))%1200-100,y=110+(i%2)*50;ctx.fillStyle="#fffef0a8";ctx.beginPath();ctx.ellipse(x,y,58,18,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(x+22,y-9,32,25,0,0,Math.PI*2);ctx.fill();}
 ctx.fillStyle="#a2bd98";ctx.beginPath();ctx.moveTo(0,390);ctx.bezierCurveTo(240,265,350,375,560,313);ctx.bezierCurveTo(765,245,880,330,960,300);ctx.lineTo(960,540);ctx.lineTo(0,540);ctx.fill();
 ctx.fillStyle="#82a887";ctx.beginPath();ctx.moveTo(0,418);ctx.bezierCurveTo(190,320,400,407,590,349);ctx.bezierCurveTo(793,324,856,399,960,360);ctx.lineTo(960,540);ctx.lineTo(0,540);ctx.fill();
 ctx.fillStyle="#6caa8c";ctx.fillRect(0,GROUND,WIDTH,HEIGHT-GROUND);
 ctx.fillStyle="#907154";ctx.fillRect(0,GROUND+8,WIDTH,15);ctx.fillStyle="#cfb28b";ctx.fillRect(0,GROUND,WIDTH,8);
 for(let i=0;i<36;i++){let x=(i*77+45)%960,y=GROUND+32+(i*13)%58;ctx.fillStyle="#e9d6a752";ctx.beginPath();ctx.ellipse(x,y,9,3,0,0,Math.PI*2);ctx.fill();}
 ctx.fillStyle="#7b5e48";for(const x of [18,36,925,943]){ctx.fillRect(x,342,12,118);}
 ctx.fillStyle="#c39b66";ctx.fillRect(0,360,72,16);ctx.fillRect(900,360,60,16);
}
function advance(items:Body[],dt:number,wind:number,held:number|null){
 const bodies=items.map(b=>({...b}));
 for(const b of bodies){if(b.id===held)continue;
  b.vy+=1100*dt;b.vx+=wind*dt;b.vx*=Math.pow(.984,dt*60);
  b.x+=b.vx*dt;b.y+=b.vy*dt;
  if(b.x-b.w/2<8){b.x=b.w/2+8;b.vx=Math.abs(b.vx)*.35;}
  if(b.x+b.w/2>WIDTH-8){b.x=WIDTH-8-b.w/2;b.vx=-Math.abs(b.vx)*.35;}
  if(b.y+b.h/2>GROUND){b.y=GROUND-b.h/2;b.vy=b.kind==="ball"?-Math.abs(b.vy)*.42:0;if(Math.abs(b.vy)<30)b.vy=0;b.vx*=.96;}
 }
 for(let pass=0;pass<4;pass++){
  const ordered=[...bodies].sort((a,b)=>b.y-a.y);
  for(const a of ordered){if(a.id===held)continue;
   for(const b of ordered){if(a.id===b.id||!overlap(a,b))continue;
    const oldBottom=a.y+a.h/2-a.vy*dt;
    const top=b.y-b.h/2;
    if(a.y<=b.y&&a.vy>=b.vy-35&&oldBottom<top+42){
      a.y=top-a.h/2;a.vy=Math.min(b.vy,0);a.vx*=.9;
    }else if(a.y>b.y&&b.id!==held){
      // Resolve side contacts as well as vertical contacts so objects do not tunnel.
      const dx=a.x-b.x, penetration=(a.w+b.w)/2-Math.abs(dx);
      if(penetration>0&&penetration<(a.w+b.w)*.2){
       a.x+=Math.sign(dx||1)*penetration;a.vx*=-.22;
      }
    }
   }
  }
 }
 return bodies;
}
export function BuildPlayground({age,onBack}:{age:V15Age;onBack:()=>void}){
 const canvas=useRef<HTMLCanvasElement>(null);
 const blocks=useRef<Body[]>([]),render=useRef(0),last=useRef(0),nextId=useRef(0),drag=useRef<number|null>(null),wind=useRef(0),running=useRef(true);
 const [kind,setKind]=useState<Material>("wood"),[paused,setPaused]=useState(false),[message,setMessage]=useState("Βάλε τουβλάκια, φτιάξε έναν πύργο και δοκίμασε τον άνεμο."),[count,setCount]=useState(0),[tall,setTall]=useState(0),[windLabel,setWindLabel]=useState("Ησυχία");
 const [selected,setSelected]=useState<number|null>(null);
 const reduced=useRef(false);
 const refresh=()=>{setCount(blocks.current.length);const n=blocks.current.reduce((m,b)=>Math.max(m,GROUND-(b.y-b.h/2)),0);setTall(Math.round(n));};
 const add=(atX=475,atY=85,k:Material=kind)=>{
  if(blocks.current.length>=35){setMessage("Ο χώρος γέμισε! Μπορείς να ξαναχτίσεις.");return;}
  const m=materials[k],body:Body={id:++nextId.current,kind:k,x:clamp(atX,m.w/2+10,WIDTH-m.w/2-10),y:clamp(atY,m.h/2+8,GROUND-m.h/2-12),w:m.w,h:m.h,vx:0,vy:0,color:m.color,moving:true};
  blocks.current.push(body);setSelected(body.id);refresh();setMessage("Κοίτα πώς επηρεάζεται η κατασκευή σου από τη βαρύτητα.");
 };
 const reset=()=>{blocks.current=[];wind.current=0;setWindLabel("Ησυχία");setSelected(null);refresh();setMessage("Ένας καινούργιος χώρος για δημιουργία!")};
 const undo=()=>{blocks.current.pop();setSelected(null);refresh()};
 const blow=(dir:number)=>{wind.current=dir*480;setWindLabel(dir<0?"Άνεμος αριστερά":"Άνεμος δεξιά");setMessage("Παρατήρησε: θα αντέξει η κατασκευή στον άνεμο;");setTimeout(()=>{wind.current=0;setWindLabel("Ησυχία")},1800)};
 useEffect(()=>{running.current=!paused},[paused]);
 useEffect(()=>{reduced.current=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let live=true;
  const loop=(ms:number)=>{
   if(!live||!canvas.current)return;
   const c=canvas.current,ctx=c.getContext("2d");if(!ctx)return;
   let dpr=Math.min(2,window.devicePixelRatio||1),w=Math.max(1,Math.floor(c.clientWidth*dpr)),h=Math.max(1,Math.floor(c.clientHeight*dpr));if(c.width!==w||c.height!==h){c.width=w;c.height=h;}
   ctx.setTransform(w/WIDTH,0,0,h/HEIGHT,0,0);
   const dt=Math.min(.032,(ms-(last.current||ms))/1000);last.current=ms;
   if(running.current){blocks.current=advance(blocks.current,dt,wind.current,drag.current);}
   background(ctx,ms/1000,reduced.current);
   for(const b of blocks.current)shape(ctx,b,drag.current===b.id);
   render.current=requestAnimationFrame(loop);
  };render.current=requestAnimationFrame(loop);return()=>{live=false;cancelAnimationFrame(render.current);};
 },[]);
 const down=(e:ReactPointerEvent<HTMLCanvasElement>)=>{
  if(e.button!==0)return;const p=coords(e);
  const hit=[...blocks.current].reverse().find(b=>Math.abs(p.x-b.x)<b.w/2+9&&Math.abs(p.y-b.y)<b.h/2+10);
  if(hit){drag.current=hit.id;setSelected(hit.id);e.currentTarget.setPointerCapture(e.pointerId);}else add(p.x,p.y);
 };
 const move=(e:ReactPointerEvent<HTMLCanvasElement>)=>{if(drag.current===null)return;let p=coords(e),b=blocks.current.find(b=>b.id===drag.current);if(!b)return;b.x=clamp(p.x,b.w/2+5,WIDTH-b.w/2-5);b.y=clamp(p.y,b.h/2+5,GROUND-b.h/2);b.vx=0;b.vy=0;};
 const up=(e:ReactPointerEvent<HTMLCanvasElement>)=>{if(drag.current===null)return;drag.current=null;try{e.currentTarget.releasePointerCapture(e.pointerId)}catch{}refresh();};
 const save=()=>{const c=canvas.current;if(!c)return;const a=document.createElement("a");a.href=c.toDataURL("image/png");a.download="pisipouk-kataskevi.png";a.click();};
 const modes=age==="2-3"?["wood","ball"] as Material[]:["wood","brick","beam","ball"] as Material[];
 return <section className="bp19"><header className="bp19-header"><span><Sparkles size={17}/> ΕΛΕΥΘΕΡΟ ΠΑΙΧΝΙΔΙ • ΦΥΣΙΚΗ</span><h2>Η πολιτεία των μικρών κατασκευαστών</h2><p>Φτιάξε έναν πύργο, μια γέφυρα ή κάτι που δεν έχει ξαναδεί κανείς. Τα τουβλάκια έχουν βαρύτητα και ο άνεμος δοκιμάζει τις ιδέες σου.</p></header>
 <div className="bp19-controls"><div className="bp19-palette" role="group" aria-label="Υλικά κατασκευής">{modes.map((m,i)=><button key={m} className={kind===m?"active":""} aria-pressed={kind===m} onClick={()=>{setKind(m);setMessage("Διάλεξες "+materials[m].name+". Άγγιξε τη σκηνή για να το τοποθετήσεις.");}}><span style={{background:materials[m].color}} className={"bp19-token "+m}/><span>{materials[m].name}</span></button>)}</div><div className="bp19-buttons"><button onClick={()=>add()}><Shapes size={17}/> Νέο</button><button onClick={()=>{setPaused(p=>!p);setMessage(paused?"Η φυσική ξεκίνησε.":"Η κατασκευή σταμάτησε για να τη διορθώσεις.");}}>{paused?<Play size={18}/>:<Pause size={18}/>} {paused?"Κίνηση":"Παύση"}</button><button onClick={undo} disabled={!count}><ArrowLeft size={18}/> Πίσω</button><button onClick={reset}><RotateCcw size={18}/> Ξανά</button></div></div>
 <div className="bp19-stage"><canvas ref={canvas} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} role="img" aria-label="Διαδραστικός χώρος κατασκευών με φυσική και βαρύτητα"/><span className="bp19-help">Άγγιξε για νέο αντικείμενο • Σύρε για να το μετακινήσεις</span><span className="bp19-counter">Υλικά: {count} · Ύψος: {tall}</span></div>
 <div className="bp19-sim"><div><button onClick={()=>blow(-1)}><Wind size={20}/> Φύσηξε αριστερά</button><button onClick={()=>blow(1)}><Wind size={20}/> Φύσηξε δεξιά</button></div><span>{windLabel}</span><button onClick={save}><Save size={18}/> Φύλαξε εικόνα</button></div>
 <p className="bp19-message" role="status">{message}</p>
 <div className="bp19-guidance"><div><b>Δοκίμασε ένα πείραμα</b><p>Φτιάξε δύο πύργους διαφορετικού ύψους. Ποιος αντέχει περισσότερο στον άνεμο; Πώς αλλάζει η συμπεριφορά με μακριές σανίδες;</p></div><div><b>Το παιχνίδι συνεχίζεται</b><p>Χτίστε πραγματικές κατασκευές με μεγάλα τουβλάκια και συγκρίνετε τι τις κάνει σταθερές, μαζί με έναν ενήλικο.</p></div></div>
 <button className="bp19-return" onClick={onBack}><ArrowLeft size={17}/> Πίσω στον κόσμο του Πισιπούκ</button>
 </section>;
}
