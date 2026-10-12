import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ArrowLeft, CloudRain, Droplets, Flower2, Hand, Leaf, Moon, RotateCcw, Search, Sparkles, Sun, Volume2, VolumeX, Wind } from "lucide-react";
import type { V15Age } from "./v15/Games";
import "./LivingGarden.css";

type Species = "daisy" | "sunflower" | "tomato" | "lavender";
type Instrument = "seed" | "water" | "move" | "bee" | "inspect";
type Weather = "sun" | "rain" | "night";
type Plant = { id:number; slot:number; species:Species; growth:number; moisture:number; pollinated:boolean; fruit:boolean; bloomAge:number };
type Gesture = { mode:"water"|"move"; plantId?:number; x:number; y:number; origin:number };
const PLOTS = [142,314,486,658,830] as const;
const SOIL_Y=420;
const PLANTS: Record<Species,{name:string;short:string;seedColor:string;petal:string;center:string;need:number;fact:string}> = {
 daisy:{name:"Μαργαρίτα",short:"Λουλούδι",seedColor:"#e0ba66",petal:"#fff7e0",center:"#ecad43",need:.35,fact:"Η μαργαρίτα στρέφεται προς το φως και προσελκύει επικονιαστές."},
 sunflower:{name:"Ηλίανθος",short:"Ήλιος",seedColor:"#a78154",petal:"#f9c34d",center:"#6b4a35",need:.42,fact:"Ο νεαρός ηλίανθος μπορεί να ακολουθεί τον ήλιο όσο μεγαλώνει."},
 tomato:{name:"Ντοματιά",short:"Καρποί",seedColor:"#dc957a",petal:"#ffdc63",center:"#e3a144",need:.48,fact:"Τα άνθη της ντοματιάς γίνονται καρποί μετά από επιτυχημένη επικονίαση."},
 lavender:{name:"Λεβάντα",short:"Άρωμα",seedColor:"#a68abc",petal:"#9b83cf",center:"#765399",need:.28,fact:"Η λεβάντα έχει αρωματικά άνθη που προσελκύουν έντομα."},
};
const speciesOrder:Species[]=["daisy","sunflower","tomato","lavender"];
const info:Record<Instrument,string>={
 seed:"Διάλεξε σπόρο και άγγιξε ένα ελεύθερο παρτέρι.",
 water:"Σύρε το ποτιστήρι πάνω από τα φυτά. Το νερό μπαίνει στο χώμα.",
 move:"Πιάσε ένα φυτό και μετακίνησέ το σε άλλο ελεύθερο παρτέρι.",
 bee:"Άγγιξε ένα ανθισμένο φυτό για να έρθει η μελισσούλα.",
 inspect:"Άγγιξε ένα φυτό για να ανακαλύψεις τι χρειάζεται.",
};
const colors=["#eac88d","#f0dba8","#a2c28e","#dfc594"];
const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
const nearest=(x:number)=>PLOTS.reduce((best,val,i)=>Math.abs(x-val)<Math.abs(x-PLOTS[best])?i:best,0);
function coords(e:ReactPointerEvent<SVGSVGElement>){const svg=e.currentTarget,matrix=svg.getScreenCTM();if(!matrix)return{x:0,y:0};const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const c=p.matrixTransform(matrix.inverse());return{x:clamp(c.x,0,1000),y:clamp(c.y,0,550)};}
const toolNames:Record<Instrument,string>={seed:"Φυτεύω",water:"Ποτίζω",move:"Μετακινώ",bee:"Επικονιάζω",inspect:"Παρατηρώ"};
export function LivingGarden({age,onBack}:{age:V15Age;onBack:()=>void}){
 const [seed,setSeed]=useState<Species>("daisy");
 const [instrument,setInstrument]=useState<Instrument>("seed");
 const [weather,setWeather]=useState<Weather>("sun");
 const [plants,setPlants]=useState<Plant[]>([]);
 const [message,setMessage]=useState("Καλώς ήρθες! Φύτεψε τον πρώτο σου σπόρο και δημιούργησε τον δικό σου κήπο.");
 const [harvest,setHarvest]=useState(0);
 const [activeBee,setActiveBee]=useState<{x:number;y:number;until:number}|null>(null);
 const [gesture,setGesture]=useState<Gesture|null>(null);
 const [muted,setMuted]=useState(true);
 const [pulse,setPulse]=useState(0);
 const [day,setDay]=useState(1);
 const [history,setHistory]=useState<{plants:Plant[];harvest:number}[]>([]);
 const nextId=useRef(0);
 const watering=useRef<number>(0);
 const plantRef=useRef(plants);
 plantRef.current=plants;
 const gestureRef=useRef<Gesture|null>(null);
 const ageFast=age==="2-3"?1.7:age==="3-4"?1.45:age==="4-5"?1.2:1;
 const save=()=>setHistory(h=>[...h.slice(-12),{plants:plantRef.current.map(p=>({...p})),harvest}]);
 const say=(s:string)=>{if(muted||typeof window==="undefined"||!("speechSynthesis"in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s);u.lang="el-GR";u.rate=.85;window.speechSynthesis.speak(u)};
 const announce=(s:string)=>{setMessage(s);say(s)};
 useEffect(()=>{
  const timer=window.setInterval(()=>{
   setPulse(t=>t+.25);
   const now=Date.now();
   setActiveBee(prev=>prev&&now>prev.until?null:prev);
   setPlants(prev=>prev.map(p=>{
    const hasLight=weather==="sun";
    const moisture=clamp(p.moisture+(weather==="rain"?.013:-.004),0,1);
    const enough=moisture>PLANTS[p.species].need*.32;
    const progress=p.growth<1&&enough?(hasLight?.016:weather==="rain"?.009:.002)*ageFast:0;
    const growth=clamp(p.growth+progress,0,1);
    const bloomAge=p.pollinated&&growth>.86?p.bloomAge+.25:p.bloomAge;
    return {...p,moisture,growth,bloomAge,fruit:p.fruit||(p.pollinated&&bloomAge>3)};
   }));
  },250);
  return()=>window.clearInterval(timer);
 },[weather,ageFast]);
 const waterNear=(x:number,y:number)=>{
  if(y<180||Date.now()-watering.current<100)return;
  watering.current=Date.now();
  setPlants(prev=>prev.map(p=>Math.abs(PLOTS[p.slot]-x)<92&&y>SOIL_Y-220?{...p,moisture:clamp(p.moisture+.10,0,1)}:p));
 };
 const plant=(x:number,y:number)=>{
  if(y<280||y>535)return;
  const slot=nearest(x);
  if(Math.abs(PLOTS[slot]-x)>80){announce("Διάλεξε ένα στρογγυλό παρτέρι.");return;}
  if(plantRef.current.some(p=>p.slot===slot)){announce("Εδώ έχει ήδη φυτρώσει ένας φίλος! Δοκίμασε άλλο παρτέρι.");return;}
  save();
  const id=++nextId.current;
  setPlants(prev=>[...prev,{id,slot,species:seed,growth:.045,moisture:.05,pollinated:false,fruit:false,bloomAge:0}]);
  announce("Φύτεψες "+PLANTS[seed].name+"! Τώρα χρειάζεται νερό και φως.");
 };
 const clickPlant=(p:Plant)=>{
  if(instrument==="inspect"){
   announce(PLANTS[p.species].name+". "+PLANTS[p.species].fact+" "+(p.moisture<.28?"Διψάει.":"Έχει αρκετό νερό.")+(p.growth<.78?" Ακόμη μεγαλώνει.":" Είναι σχεδόν έτοιμο να ανθίσει."));
  }else if(instrument==="bee"){
   if(p.growth<.8){announce("Η μελισσούλα επισκέπτεται τα ανοιχτά άνθη. Περίμενε λίγο ακόμη.");return;}
   if(p.pollinated){announce("Η μελισσούλα έχει ήδη επισκεφθεί αυτό το λουλούδι.");return;}
   save();setPlants(prev=>prev.map(t=>t.id===p.id?{...t,pollinated:true,bloomAge:0}:t));
   setActiveBee({x:PLOTS[p.slot],y:SOIL_Y-130,until:Date.now()+5000});
   announce("Η μελισσούλα βρήκε νέκταρ! Τώρα μπορεί να δημιουργηθεί ένας καρπός.");
  }else if(instrument==="inspect"&&p.fruit)announce("Ένας καρπός μεγάλωσε!");
 };
 const collect=(p:Plant)=>{
  if(!p.fruit)return;
  save();setPlants(prev=>prev.map(t=>t.id===p.id?{...t,fruit:false,pollinated:false,bloomAge:0}:t));
  setHarvest(h=>h+1);
  announce("Μάζεψες έναν ώριμο καρπό! Ο κήπος συνεχίζει να μεγαλώνει.");
 };
 const down=(e:ReactPointerEvent<SVGSVGElement>)=>{
  if(e.button!==0)return;
  const {x,y}=coords(e);
  if(instrument==="seed"){plant(x,y);return;}
  if(instrument==="water"){const g:Gesture={mode:"water",x,y,origin:-1};gestureRef.current=g;setGesture(g);e.currentTarget.setPointerCapture(e.pointerId);waterNear(x,y);return;}
  const target=plantRef.current.find(p=>Math.abs(PLOTS[p.slot]-x)<75&&y>=170&&y<SOIL_Y+65);
  if(!target)return;
  if(instrument==="move"){
   const g:Gesture={mode:"move",plantId:target.id,x,y,origin:target.slot};gestureRef.current=g;setGesture(g);e.currentTarget.setPointerCapture(e.pointerId);return;
  }
  if(instrument==="bee"||instrument==="inspect") {
   if(target.fruit&&instrument==="inspect"){collect(target);return;}
   clickPlant(target);
  }
 };
 const motion=(e:ReactPointerEvent<SVGSVGElement>)=>{
  const g=gestureRef.current;if(!g)return;
  const {x,y}=coords(e);const next={...g,x,y};gestureRef.current=next;setGesture(next);
  if(g.mode==="water")waterNear(x,y);
 };
 const stop=(e:ReactPointerEvent<SVGSVGElement>)=>{
  const g=gestureRef.current;if(!g)return;
  if(g.mode==="move"&&g.plantId!==undefined){
   const {x,y}=coords(e);const slot=nearest(x);
   if(y>=270&&Math.abs(PLOTS[slot]-x)<85&&!plantRef.current.some(p=>p.slot===slot&&p.id!==g.plantId)){
    save();setPlants(prev=>prev.map(p=>p.id===g.plantId?{...p,slot}:p));announce("Μετακίνησες το φυτό. Παρατήρησε πώς συνεχίζει να μεγαλώνει.");
   }else announce("Το φυτό επέστρεψε στο παρτέρι του. Δοκίμασε ένα ελεύθερο σημείο.");
  }
  gestureRef.current=null;setGesture(null);
  try{e.currentTarget.releasePointerCapture(e.pointerId)}catch{}
 };
 const undo=()=>{const prev=history[history.length-1];if(!prev)return;setPlants(prev.plants);setHarvest(prev.harvest);setHistory(h=>h.slice(0,-1));announce("Γυρίσαμε ένα βήμα πίσω.");};
 const restart=()=>{save();setPlants([]);setHarvest(0);setWeather("sun");setDay(d=>d+1);announce("Ένας ολοκαίνουργιος κήπος σε περιμένει!");};
 const average=plants.length?plants.reduce((sum,p)=>sum+p.growth,0)/plants.length:0;
 const grown=plants.filter(p=>p.growth>.8).length;
 const dayLabel=weather==="sun"?"Ηλιόλουστη μέρα":weather==="rain"?"Μαλακή βροχή":"Νυχτερινή ηρεμία";
 return <section className="lg19">
  <div className="lg19-heading"><div><span className="lg19-eyebrow"><Sparkles size={17}/> ΠΙΣΙΠΟΥΚ • ΖΩΝΤΑΝΟ ΕΡΓΑΣΤΗΡΙΟ</span><h2>Ο κήπος που αλλάζει μαζί σου</h2><p>Ένας κόσμος που δεν έχει μία σωστή απάντηση. Εσύ αποφασίζεις τι θα φυτρώσει, πότε θα βρέξει και πώς θα εξελιχθεί.</p></div></div>
  <div className="lg19-top-controls">
   <div className="lg19-weather" role="group" aria-label="Αλλαγή καιρού">
    {([{id:"sun",label:"Ήλιος",Icon:Sun},{id:"rain",label:"Βροχή",Icon:CloudRain},{id:"night",label:"Νύχτα",Icon:Moon}] as const).map(({id,label,Icon})=><button key={id} className={weather===id?"on":""} onClick={()=>{setWeather(id);announce(id==="rain"?"Άρχισε απαλή βροχή! Τα φυτά ποτίζονται.":id==="night"?"Τα αστέρια βγήκαν. Τα φυτά ξεκουράζονται.":"Ο ήλιος βοηθά τα φυτά να μεγαλώσουν.");}} aria-pressed={weather===id}><Icon size={19}/>{label}</button>)}
   </div>
   <div className="lg19-meta"><span><Leaf size={17}/> {plants.length} φυτά</span><span><Flower2 size={17}/> {grown} άνθη</span><span>Καρποί: {harvest}</span><button title="Αναίρεση" disabled={!history.length} onClick={undo}><ArrowLeft size={16}/> Πίσω</button><button title="Καινούργιος κήπος" onClick={restart}><RotateCcw size={16}/> Ξανά</button></div>
  </div>
  <div className={"lg19-world lg19-"+weather}>
   <svg viewBox="0 0 1000 550" className="lg19-canvas" role="group" aria-label="Διαδραστικός κήπος με πέντε παρτέρια" onPointerDown={down} onPointerMove={motion} onPointerUp={stop} onPointerCancel={stop} style={{cursor:instrument==="move"?"grab":instrument==="water"?"crosshair":"pointer"}}>
    <defs>
     <linearGradient id="lg19-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor={weather==="night"?"#17264b":weather==="rain"?"#819eac":"#6bb7c9"}/><stop offset="1" stopColor={weather==="night"?"#66758f":weather==="rain"?"#bccfd1":"#f9dfab"}/></linearGradient>
     <radialGradient id="lg19-sun"><stop stopColor="#fff8d9"/><stop offset=".68" stopColor="#ffeab0"/><stop offset="1" stopColor="#ffdf9655"/></radialGradient>
     <linearGradient id="lg19-hill" x1="0" y1="0" x2="0" y2="1"><stop stopColor={weather==="night"?"#496f71":"#93c4a0"}/><stop offset="1" stopColor={weather==="night"?"#2f5557":"#589780"}/></linearGradient>
     <linearGradient id="lg19-soil" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#967052"/><stop offset="1" stopColor="#654936"/></linearGradient>
     <linearGradient id="lg19-leaf" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#a4cb80"/><stop offset="1" stopColor="#3f8254"/></linearGradient>
     <filter id="lg19-glow"><feGaussianBlur stdDeviation="16"/></filter>
    </defs>
    <rect width="1000" height="550" fill="url(#lg19-sky)"/>
    {weather==="night"?<><circle cx="810" cy="84" r="35" fill="#fff6d3"/>{Array.from({length:24},(_,i)=><circle key={i} cx={(i*139+33)%970} cy={(i*73+26)%290} r={i%3===0?3:1.8} fill="#fff6d9" className="lg19-star"/>)}</>:<><circle cx="802" cy="100" r="78" fill="#ffedbb6b" filter="url(#lg19-glow)"/><circle cx="802" cy="100" r="47" fill="url(#lg19-sun)"/></>}
    <g className="lg19-clouds"><g opacity={weather==="night"?.2:.7} fill="#fffdf4"><ellipse cx="205" cy="115" rx="90" ry="22"/><ellipse cx="166" cy="97" rx="39" ry="30"/><ellipse cx="236" cy="101" rx="54" ry="38"/></g><g fill="#fffdf6" opacity={weather==="rain"?.74:.5}><ellipse cx="593" cy="125" rx="68" ry="18"/><ellipse cx="570" cy="103" rx="42" ry="29"/></g></g>
    <path d="M0 326 Q137 196 301 290 Q501 167 694 276 Q834 177 1000 267 L1000 550 L0 550Z" fill="#acd1b1" opacity=".6"/>
    <path d="M0 390 Q175 280 354 339 Q569 238 765 353 Q887 301 1000 323 L1000 550 L0 550Z" fill="url(#lg19-hill)"/>
    <g opacity=".6">{Array.from({length:14},(_,i)=><g key={i}><path d={"M"+(i*73+22)+" 355 l0 -"+(20+i%5*9)} stroke="#598c68" strokeWidth="5"/><ellipse cx={i*73+22} cy={342-i%5*9} rx={19+i%4*4} ry={24+i%4*4} fill={i%2?"#6f9c71":"#477d65"}/></g>)}</g>
    <path d="M0 450 Q200 394 382 454 T1000 438 L1000 550 L0 550Z" fill={weather==="night"?"#346d65":"#70a889"}/>
    {Array.from({length:42},(_,i)=><g key={i} transform={"translate("+((i*137+19)%1000)+","+(455+(i*47)%88)+")"} opacity=".5"><path d="M0 0 q-12 -14 -8 -27 M0 0 q0 -25 10 -25" stroke="#d3e5a3" strokeWidth="2" fill="none"/></g>)}
    <g className="lg19-plots">{PLOTS.map((x,i)=><g key={i}><ellipse cx={x} cy={443} rx="78" ry="28" fill="#3f5e4955"/><ellipse cx={x} cy={431} rx="75" ry="25" fill="url(#lg19-soil)" stroke="#dec493" strokeWidth="3"/>{Array.from({length:5},(_,j)=><ellipse key={j} cx={x+(j-2)*21} cy={431+(j%2)*8} rx="4" ry="2.2" fill="#e2be8b" opacity=".55"/>)}{!plants.some(p=>p.slot===i)&&<circle cx={x} cy={427} r="27" fill="none" stroke="#f8e9c0" strokeDasharray="5 7" strokeWidth="3" opacity=".85"/>}</g>)}</g>
    <g className="lg19-plants">{plants.map(p=>{
     const x=gesture?.mode==="move"&&gesture.plantId===p.id?gesture.x:PLOTS[p.slot];
     const y=gesture?.mode==="move"&&gesture.plantId===p.id?gesture.y:SOIL_Y;
     const factor=.2+p.growth*.8, s=p.species==="sunflower"?1.25:p.species==="lavender"?.85:1;
     const ht=(67+p.growth*120)*s;
     const flowerColor=PLANTS[p.species].petal;
     return <g key={p.id} transform={"translate("+x+" "+y+")"} data-plant={p.id} data-growth={p.growth.toFixed(2)}>
       <ellipse cx="0" cy="0" rx="24" ry="7" fill="#2d403444"/>
       <g className="lg19-swayer" style={{transformOrigin:"0px 0px",animationDelay:(p.id*.33)+"s"}}>
        <path d={"M0 0 C-13 -"+(ht*.36)+" 11 -"+(ht*.68)+" 0 -"+ht} fill="none" stroke="#458550" strokeWidth={5+p.growth*4} strokeLinecap="round"/>
        {[.35,.61].map((at,j)=><g key={j} transform={"translate("+((j%2===0?-4:4))+" "+(-ht*at)+")"}><path d={j===0?"M0 0 Q-53 -33 -59 -2 Q-24 19 0 0":"M0 0 Q53 -36 56 -4 Q31 18 0 0"} fill="url(#lg19-leaf)" stroke="#447e52" strokeWidth="1.6"/></g>)}
        {p.growth<.30?<g><ellipse cx="0" cy={-ht} rx="10" ry="16" fill="#76a968"/><path d={"M-4 "+(-ht)+" Q0 "+(-ht-7)+" 5 "+(-ht)} stroke="#cfe4a2" strokeWidth="2" fill="none"/></g>:<>
         <g transform={"translate(0 "+(-ht)+")"} style={{opacity:clamp((p.growth-.28)*2,0,1)}}>
          {Array.from({length:p.species==="lavender"?11:10},(_,i)=>{
           const a=i*Math.PI*2/(p.species==="lavender"?11:10);
           const rr=p.species==="lavender"?16:23*factor;
           return <ellipse key={i} cx={Math.sin(a)*rr} cy={Math.cos(a)*rr} rx={p.species==="lavender"?7:11*factor} ry={p.species==="lavender"?16:19*factor} transform={"rotate("+(a*180/Math.PI)+" "+(Math.sin(a)*rr)+" "+(Math.cos(a)*rr)+")"} fill={flowerColor} stroke="#ffffff55" strokeWidth="1.5"/>;
          })}
          <circle r={p.species==="sunflower"?18:12} fill={PLANTS[p.species].center}/>
          {Array.from({length:9},(_,i)=><circle key={i} cx={Math.sin(i*2.4)*7} cy={Math.cos(i*2.4)*7} r="1.6" fill="#684532" opacity=".7"/>)}
         </g>
        </>}
        {p.fruit&&<g transform={"translate(20 "+(-ht*.58)+")"} className="lg19-fruit"><circle r="18" fill="#e16b54" stroke="#fff0cf" strokeWidth="3"/><path d="M-9 -15 L0 -21 L9 -15 L0 -14Z" fill="#4b905e"/></g>}
       </g>
       <g transform="translate(0 24)"><rect x="-46" y="-5" width="92" height="20" rx="10" fill="#fffaf0df"/><rect x="-42" y="0" width={84*p.moisture} height="10" rx="5" fill="#5cbac6"/><rect x="-42" y="0" width="84" height="10" rx="5" stroke="#7d9585" fill="none" strokeWidth="1.5"/></g>
      </g>;
    })}</g>
    {activeBee&&<g className="lg19-bee" transform={"translate("+(activeBee.x+25)+" "+(activeBee.y-80)+")"}><ellipse rx="30" ry="16" fill="#efc958" stroke="#7a593f" strokeWidth="3"/><path d="M-5 -14 V14 M13 -12 V12" stroke="#765137" strokeWidth="9"/><ellipse cx="-7" cy="-22" rx="17" ry="11" fill="#e5f5f6ba"/><ellipse cx="17" cy="-20" rx="17" ry="11" fill="#e5f5f6ba"/><circle cx="25" cy="-4" r="3" fill="#534034"/></g>}
    {weather==="rain"&&<g className="lg19-rain">{Array.from({length:45},(_,i)=><path key={i} d={"M"+((i*173+13)%1000)+" "+(i*43%500)+" l-10 21"} fill="none" stroke="#d8f8ff" strokeWidth={i%3===0?3:2} strokeLinecap="round" style={{animationDelay:"-"+(i*.13)+"s"}}/>)}</g>}
    {gesture?.mode==="water"&&<g pointerEvents="none" transform={"translate("+gesture.x+" "+gesture.y+")"}><path d="M-47 -53 H-7 L6 -15 Q-14 4 -44 -16Z" fill="#74b4c6" stroke="#f8f0d6" strokeWidth="5"/><path d="M-7 -50 Q31 -57 21 -27 L12 -20" fill="none" stroke="#f8f0d6" strokeWidth="7"/>{[0,1,2,3,4].map(i=><ellipse key={i} cx={i*11-12} cy={i*15+6} rx="4" ry="8" fill="#6de2fc" opacity=".8"/>)}</g>}
    {gesture?.mode==="move"&&<g pointerEvents="none"><circle cx={gesture.x} cy={gesture.y+9} r="80" fill="#fff9cf19" stroke="#fff7d5a4" strokeWidth="4" strokeDasharray="10 11"/></g>}
   </svg>
   <div className="lg19-gesture-caption">{info[instrument]}</div>
   <div className="lg19-living-status"><span className={"lg19-weather-dot "+weather}/>{dayLabel}<span className="lg19-growth">Ανάπτυξη {Math.round(average*100)}%</span></div>
  </div>
  <div className="lg19-toolbar">
   <div className="lg19-tools" role="group" aria-label="Εργαλεία κήπου">
    {([{id:"seed",icon:Leaf},{id:"water",icon:Droplets},{id:"move",icon:Hand},{id:"bee",icon:Flower2},{id:"inspect",icon:Search}] as const).map(({id,icon:Icon})=><button key={id} className={instrument===id?"on":""} aria-pressed={instrument===id} onClick={()=>{setInstrument(id);setMessage(info[id]);}}><Icon size={24}/><span>{toolNames[id]}</span></button>)}
   </div>
   {instrument==="seed"&&<div className="lg19-seeds" role="group" aria-label="Επιλογή σπόρου">{speciesOrder.map(s=><button key={s} className={seed===s?"on":""} onClick={()=>setSeed(s)} aria-pressed={seed===s}><i style={{background:PLANTS[s].petal}}/><span>{PLANTS[s].name}</span></button>)}</div>}
  </div>
  <div className="lg19-message"><div><Sparkles size={21}/><p role="status" aria-live="polite">{message}</p></div><button onClick={()=>{setMuted(m=>!m);if(muted)say(message)}} title={muted?"Ενεργοποίηση φωνής":"Σίγαση φωνής"} aria-label={muted?"Ενεργοποίηση φωνής":"Σίγαση φωνής"}>{muted?<VolumeX size={20}/>:<Volume2 size={20}/>}</button></div>
  <div className="lg19-learning">
   <div><b>Ελεύθερη εξερεύνηση</b><p>Πειραματίσου: δύο ίδια φυτά με διαφορετικό νερό ή ήλιο δεν εξελίσσονται με τον ίδιο τρόπο. Δεν υπάρχει χρονόμετρο ούτε λάθος επιλογή.</p></div>
   <div><b>Παρατηρώ και προβλέπω</b><p>Ποιο φυτό θα ανθίσει πρώτο; Τι αλλάζει όταν βρέχει; Πώς βοηθά μια μέλισσα; Συζήτησέ το με έναν μεγάλο.</p></div>
  </div>
  <button className="lg19-back" onClick={onBack}><ArrowLeft size={18}/> Πίσω στα παιχνίδια του Πισιπούκ</button>
 </section>;
}
