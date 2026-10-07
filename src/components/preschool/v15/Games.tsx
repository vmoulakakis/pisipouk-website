import { useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, RotateCcw, Sparkles, Volume2 } from "lucide-react";
import { PisipoukCharacter, type PisipoukMood } from "./PisipoukCharacter";
import exterior from "@/assets/pisipouk-exterior.webp";
import classroom from "@/assets/pisipouk-classroom.webp";

export type V15Age="2-3"|"3-4"|"4-5"|"5-6";
export type V15GameId="necklace"|"feed"|"sort"|"music";

export type V15Game={
  id:V15GameId;
  title:string;
  ages:V15Age[];
  intro:string;
  skill:string;
  minutes:string;
  cover:string;
  accent:string;
};

export const V15_GAMES:V15Game[]=[
  {id:"feed",title:"Ταΐζω τον Πισιπούκ",ages:["2-3","3-4"],intro:"Διάλεξε, πιάσε και δώσε φαγητό στον Πισιπούκ.",skill:"καθημερινή ζωή • επιλογή • συντονισμός",minutes:"3–6′",cover:exterior,accent:"#40c987"},
  {id:"sort",title:"Τα Καλάθια των Χρωμάτων",ages:["2-3","3-4"],intro:"Βάλε κάθε αντικείμενο στο καλάθι που του ταιριάζει.",skill:"χρώματα • ταξινόμηση • οπτική διάκριση",minutes:"3–7′",cover:classroom,accent:"#ffae2f"},
  {id:"necklace",title:"Το Κολιέ του Πισιπούκ",ages:["3-4","4-5","5-6"],intro:"Πέρασε χάντρες, δέσε το κορδόνι και χάρισέ το στον Πισιπούκ.",skill:"λεπτή κίνηση • μοτίβα • δημιουργία",minutes:"5–9′",cover:classroom,accent:"#ff4f88"},
  {id:"music",title:"Η Μπάντα του Πισιπούκ",ages:["2-3","3-4","4-5","5-6"],intro:"Παίξε ελεύθερα, άκου και φτιάξε τον δικό σου ρυθμό.",skill:"ρυθμός • ακουστική μνήμη • ελεύθερο παιχνίδι",minutes:"4–10′",cover:exterior,accent:"#7155e6"},
];

function within(x:number,y:number,el:HTMLElement|null){
  if(!el)return false;
  const r=el.getBoundingClientRect();
  return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;
}

function DragThing({children,label,onDrop,disabled=false}:{children:React.ReactNode;label:string;onDrop:(x:number,y:number)=>boolean;disabled?:boolean}){
  const start=useRef<{x:number;y:number}|null>(null);
  const [delta,setDelta]=useState<{x:number;y:number}|null>(null);
  return <button
    className={`pv15-drag ${delta?"dragging":""}`}
    aria-label={label}
    disabled={disabled}
    style={delta?{transform:`translate3d(${delta.x}px,${delta.y}px,0) scale(1.07)`,zIndex:50}:undefined}
    onPointerDown={e=>{if(disabled)return;e.currentTarget.setPointerCapture(e.pointerId);start.current={x:e.clientX,y:e.clientY};setDelta({x:0,y:0})}}
    onPointerMove={e=>{if(!start.current||!e.currentTarget.hasPointerCapture(e.pointerId))return;setDelta({x:e.clientX-start.current.x,y:e.clientY-start.current.y})}}
    onPointerUp={e=>{if(!start.current)return;const ok=onDrop(e.clientX,e.clientY);start.current=null;setDelta(null);if(!ok)e.currentTarget.animate([{transform:"translateX(0)"},{transform:"translateX(-8px)"},{transform:"translateX(8px)"},{transform:"translateX(0)"}],{duration:240})}}
  >{children}</button>
}

function GameShell({game,mood,message,necklace=[],children,onBack,onReset}:{game:V15Game;mood:PisipoukMood;message:string;necklace?:string[];children:React.ReactNode;onBack:()=>void;onReset:()=>void}){
  return <div className="pv15-play" role="dialog" aria-label={game.title}>
    <div className="pv15-play-bg" style={{backgroundImage:`linear-gradient(180deg,#15244e22,#15244e55),url(${game.cover})`}}/>
    <header className="pv15-playbar">
      <button onClick={onBack}><ArrowLeft/> Πίσω</button>
      <div><small>{game.skill}</small><b>{game.title}</b></div>
      <button onClick={onReset}><RotateCcw/> Ξανά</button>
    </header>
    <div className="pv15-play-grid">
      <aside className="pv15-companion"><PisipoukCharacter mood={mood} necklace={necklace} speech={message}/></aside>
      <main className="pv15-board">{children}</main>
    </div>
  </div>
}

function Bead({color,shape}:{color:string;shape:"round"|"star"|"flower"}){
  return <span className={`pv15-bead ${shape}`} style={{"--bead":color} as React.CSSProperties}><i/></span>
}

function NecklaceGame({game,onBack}:{game:V15Game;onBack:()=>void}){
  const zone=useRef<HTMLDivElement>(null);
  const [beads,setBeads]=useState<string[]>([]);
  const [phase,setPhase]=useState<"string"|"tie"|"wear">("string");
  const colors=["#ff4f83","#ffd23f","#4db5ef","#7455e8","#48c47d","#ff9250"];
  const shapes:["round","star","flower","round","star","flower"]=["round","star","flower","round","star","flower"];
  const reset=()=>{setBeads([]);setPhase("string")};
  const message=phase==="wear"?"Το έφτιαξες για μένα! Το φοράω!":phase==="tie"?"Τώρα ένωσε τις δύο άκρες.":"Πέρασε τις χάντρες στο κορδόνι όπως σου αρέσει.";
  return <GameShell game={game} mood={phase==="wear"?"proud":phase==="tie"?"think":"wave"} necklace={phase==="wear"?beads:[]} message={message} onBack={onBack} onReset={reset}>
    <div className="pv15-necklace-world">
      <div className="pv15-workbench">
        <div ref={zone} className="pv15-thread-zone">
          <svg viewBox="0 0 700 250" aria-hidden="true"><path className={phase!=="string"?"closing":""} d="M80 55 Q350 275 620 55" fill="none" stroke="#f7e2ba" strokeWidth="10" strokeLinecap="round"/><circle cx="80" cy="55" r="13" fill="#f7e2ba"/><circle cx="620" cy="55" r="13" fill="#f7e2ba"/></svg>
          <div className="pv15-thread-beads">{beads.map((c,i)=><Bead key={i} color={c} shape={shapes[i%shapes.length]}/>)}</div>
          {beads.length<6&&<div className="pv15-hint">Άφησε εδώ τη χάντρα</div>}
        </div>
        <div className="pv15-tray">
          {colors.map((c,i)=><DragThing key={c} label="Χάντρα" disabled={phase!=="string"} onDrop={(x,y)=>{if(!within(x,y,zone.current))return false;setBeads(v=>[...v,c].slice(0,10));return true}}><Bead color={c} shape={shapes[i]}/></DragThing>)}
        </div>
        {beads.length>=6&&phase==="string"&&<button className="pv15-primary" onClick={()=>setPhase("tie")}><Check/> Δένω το κολιέ</button>}
        {phase==="tie"&&<button className="pv15-primary magic" onClick={()=>setPhase("wear")}><Sparkles/> Το δίνω στον Πισιπούκ</button>}
        {phase==="wear"&&<div className="pv15-reward">✨ Το δώρο σου έγινε μέρος του κόσμου του Πισιπούκ.</div>}
      </div>
    </div>
  </GameShell>
}

const FOODS=[
  {id:"apple",label:"μήλο",kind:"fruit",color:"#eb4354"},
  {id:"banana",label:"μπανάνα",kind:"fruit",color:"#f8cf34"},
  {id:"carrot",label:"καρότο",kind:"veg",color:"#ff812d"},
  {id:"berry",label:"φράουλα",kind:"fruit",color:"#ef3e69"},
  {id:"cookie",label:"μπισκότο",kind:"treat",color:"#c88a58"},
];

function Food({id,color}:{id:string;color:string}){
  return <span className={`pv15-food food-${id}`} style={{"--food":color} as React.CSSProperties}><i/><b/></span>
}

function FeedGame({game,age,onBack}:{game:V15Game;age:V15Age;onBack:()=>void}){
  const mouth=useRef<HTMLDivElement>(null);
  const [eaten,setEaten]=useState<string[]>([]);
  const [msg,setMsg]=useState("Δώσε μου κάτι να δοκιμάσω!");
  const [mood,setMood]=useState<PisipoukMood>("wave");
  const goal=age==="2-3"?3:4;
  const reset=()=>{setEaten([]);setMsg("Δώσε μου κάτι να δοκιμάσω!");setMood("wave")};
  const done=eaten.length>=goal;
  return <GameShell game={game} mood={done?"happy":mood} message={done?"Χόρτασα! Ευχαριστώ που έφτιαξες το πικνίκ μαζί μου.":msg} onBack={onBack} onReset={reset}>
    <div className="pv15-feed-world">
      <div ref={mouth} className="pv15-mouth-target"><span>δώσε εδώ</span></div>
      <div className="pv15-picnic">
        {FOODS.map(f=>!eaten.includes(f.id)&&<DragThing key={f.id} label={f.label} disabled={done} onDrop={(x,y)=>{
          if(!within(x,y,mouth.current))return false;
          if(age!=="2-3"&&f.kind==="treat"){setMood("think");setMsg("Αυτό είναι λιχουδιά. Ας βρούμε πρώτα κάτι από τη φύση!");return true}
          setEaten(v=>[...v,f.id]);setMood("eat");setMsg(`Νιαμ! ${f.label}! Τι άλλο θα βρούμε;`);setTimeout(()=>setMood("happy"),450);return true;
        }}><Food id={f.id} color={f.color}/><small>{f.label}</small></DragThing>)}
      </div>
      {done&&<div className="pv15-reward">🍎 Δοκίμασες διαφορετικά φαγητά με τον Πισιπούκ.</div>}
    </div>
  </GameShell>
}

const SORT=[
  {id:"r1",label:"κόκκινο μήλο",c:"red",type:"apple"},
  {id:"r2",label:"κόκκινο λουλούδι",c:"red",type:"flower"},
  {id:"b1",label:"μπλε ψάρι",c:"blue",type:"fish"},
  {id:"b2",label:"μπλε σταγόνα",c:"blue",type:"drop"},
  {id:"y1",label:"κίτρινος ήλιος",c:"yellow",type:"sun"},
  {id:"y2",label:"κίτρινο αστέρι",c:"yellow",type:"star"},
] as const;

function SortObject({type}:{type:string}){return <span className={`pv15-sort-object obj-${type}`}><i/><b/></span>}

function SortGame({game,onBack}:{game:V15Game;onBack:()=>void}){
  const refs={red:useRef<HTMLDivElement>(null),blue:useRef<HTMLDivElement>(null),yellow:useRef<HTMLDivElement>(null)};
  const [placed,setPlaced]=useState<string[]>([]);
  const [msg,setMsg]=useState("Βρες ποια χρώματα ταιριάζουν μεταξύ τους.");
  const [mood,setMood]=useState<PisipoukMood>("wave");
  const reset=()=>{setPlaced([]);setMsg("Βρες ποια χρώματα ταιριάζουν μεταξύ τους.");setMood("wave")};
  const done=placed.length===SORT.length;
  return <GameShell game={game} mood={done?"happy":mood} message={done?"Τα βρήκες όλα! Κάθε χρώμα βρήκε το σπίτι του.":msg} onBack={onBack} onReset={reset}>
    <div className="pv15-sort-world">
      <div className="pv15-loose-objects">{SORT.filter(o=>!placed.includes(o.id)).map(o=><DragThing key={o.id} label={o.label} onDrop={(x,y)=>{
        const target=(Object.keys(refs) as Array<keyof typeof refs>).find(k=>within(x,y,refs[k].current));
        if(!target)return false;
        if(target!==o.c){setMood("think");setMsg("Κοίτα ξανά. Πού βλέπεις το ίδιο χρώμα;");return true}
        setPlaced(v=>[...v,o.id]);setMood("happy");setMsg("Ναι! Ίδιο χρώμα.");return true;
      }}><SortObject type={o.type}/></DragThing>)}</div>
      <div className="pv15-baskets">
        <div ref={refs.red} className="pv15-basket red"><span/><b>ΚΟΚΚΙΝΟ</b></div>
        <div ref={refs.blue} className="pv15-basket blue"><span/><b>ΜΠΛΕ</b></div>
        <div ref={refs.yellow} className="pv15-basket yellow"><span/><b>ΚΙΤΡΙΝΟ</b></div>
      </div>
      {done&&<div className="pv15-reward">🌈 Ο κόσμος έγινε πιο τακτοποιημένος.</div>}
    </div>
  </GameShell>
}

const NOTES=[
  {id:"dog",hz:261.63,color:"#ff7d5d",name:"Ντο"},
  {id:"cat",hz:329.63,color:"#5bb8ec",name:"Μι"},
  {id:"rabbit",hz:392,color:"#f2a8cf",name:"Σολ"},
  {id:"bear",hz:523.25,color:"#8d63e9",name:"Ντο"},
];

function playTone(hz:number){
  try{const AC=window.AudioContext||(window as any).webkitAudioContext;const ctx=new AC();const osc=ctx.createOscillator();const g=ctx.createGain();osc.type="triangle";osc.frequency.value=hz;g.gain.setValueAtTime(.001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.16,ctx.currentTime+.03);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.44);osc.connect(g);g.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.46);setTimeout(()=>ctx.close(),600)}catch{}
}

function MusicGame({game,age,onBack}:{game:V15Game;age:V15Age;onBack:()=>void}){
  const [active,setActive]=useState<string|null>(null);
  const [count,setCount]=useState(0);
  const [msg,setMsg]=useState("Άγγιξε τα ζωάκια και άκου τη μπάντα!");
  const [challenge,setChallenge]=useState<string[]>([]);
  const [input,setInput]=useState<string[]>([]);
  const reset=()=>{setActive(null);setCount(0);setMsg("Άγγιξε τα ζωάκια και άκου τη μπάντα!");setChallenge([]);setInput([])};
  const hit=(id:string)=>{
    const note=NOTES.find(n=>n.id===id)!;playTone(note.hz);setActive(id);setTimeout(()=>setActive(null),330);setCount(v=>v+1);
    if(challenge.length){const next=[...input,id];if(challenge[next.length-1]!==id){setInput([]);setMsg("Άκου ξανά. Ο ρυθμός περιμένει!");return}setInput(next);if(next.length===challenge.length){setChallenge([]);setInput([]);setMsg("Το έπαιξες! Τώρα φτιάξε τον δικό σου ρυθμό.")}}
  };
  const startChallenge=()=>{
    const len=age==="3-4"?2:age==="4-5"?3:4;
    const seq=Array.from({length:len},(_,i)=>NOTES[(count+i*2)%NOTES.length].id);setChallenge(seq);setInput([]);setMsg("Άκου προσεκτικά και παίξ' το μετά.");
    seq.forEach((id,i)=>setTimeout(()=>{const n=NOTES.find(x=>x.id===id)!;playTone(n.hz);setActive(id);setTimeout(()=>setActive(null),220)},i*520));
  };
  return <GameShell game={game} mood={active?"dance":count>4?"happy":"wave"} message={msg} onBack={onBack} onReset={reset}>
    <div className="pv15-music-world">
      <div className="pv15-stage-lights"><i/><i/><i/><i/></div>
      <div className="pv15-band">{NOTES.map((n,i)=><button key={n.id} className={`pv15-musician ${active===n.id?"active":""}`} style={{"--note":n.color} as React.CSSProperties} onClick={()=>hit(n.id)}><span className={`animal a${i}`}><i/><b/></span><span className="instrument">{i===0?"🥁":i===1?"🎹":i===2?"🪘":"🔔"}</span><small>{n.name}</small></button>)}</div>
      <div className="pv15-music-actions"><button onClick={()=>NOTES.forEach((n,i)=>setTimeout(()=>hit(n.id),i*260))}><Volume2/> Παίζει η μπάντα</button>{age!=="2-3"&&<button className="primary" onClick={startChallenge}><Sparkles/> Αντέγραψε τον ρυθμό</button>}</div>
    </div>
  </GameShell>
}

export function V15GamePlayer({game,age,onBack}:{game:V15Game;age:V15Age;onBack:()=>void}){
  if(game.id==="necklace")return <NecklaceGame game={game} onBack={onBack}/>;
  if(game.id==="feed")return <FeedGame game={game} age={age} onBack={onBack}/>;
  if(game.id==="sort")return <SortGame game={game} onBack={onBack}/>;
  return <MusicGame game={game} age={age} onBack={onBack}/>;
}
