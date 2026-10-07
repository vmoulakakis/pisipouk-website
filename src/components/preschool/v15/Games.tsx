import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, RotateCcw, Sparkles } from "lucide-react";
import bearLogo from "@/assets/pisipouk-logo.webp";
import arrival from "@/assets/pisipouk-arrival.webp";
import classroom from "@/assets/pisipouk-classroom.webp";
import exterior from "@/assets/pisipouk-exterior.webp";
import story from "@/assets/pisipouk-story.webp";
import { AGE_META, GAME_META, type AgeBand, type GameId } from "./content";
import { PisipoukGuide, speakGreek } from "./PisipoukGuide";

const KENNEY = "https://raw.githubusercontent.com/shorepine/kenney/3694c6879e487c108f55677be7dd2ca75b07cc3b";
const OPENMOJI = "https://raw.githubusercontent.com/hfg-gmuend/openmoji/aeb8bb3a59e2de39c754ac79180c8131c906acea/color/svg";

const sceneImages = { arrival, classroom, exterior, story };

type P = { x:number; y:number };
function inside(x:number,y:number,rect:DOMRect|null){return !!rect&&x>=rect.left&&x<=rect.right&&y>=rect.top&&y<=rect.bottom}

function Drag({
  children,onDrop,label,disabled=false,className="",
}:{
  children:React.ReactNode;onDrop:(x:number,y:number)=>boolean;label:string;disabled?:boolean;className?:string;
}) {
  const [delta,setDelta]=useState<P|null>(null);
  const start=useRef<P|null>(null);
  return <button
    type="button"
    className={`pw15-drag ${className} ${delta?"dragging":""}`}
    aria-label={label}
    disabled={disabled}
    style={delta?{transform:`translate3d(${delta.x}px,${delta.y}px,0) scale(1.08)`,zIndex:80}:undefined}
    onPointerDown={e=>{if(disabled)return;e.currentTarget.setPointerCapture(e.pointerId);start.current={x:e.clientX,y:e.clientY};setDelta({x:0,y:0})}}
    onPointerMove={e=>{if(!start.current||!e.currentTarget.hasPointerCapture(e.pointerId))return;setDelta({x:e.clientX-start.current.x,y:e.clientY-start.current.y})}}
    onPointerUp={e=>{if(!start.current)return;const ok=onDrop(e.clientX,e.clientY);start.current=null;setDelta(null);if(!ok)e.currentTarget.animate([{transform:"translateX(0)"},{transform:"translateX(-8px)"},{transform:"translateX(7px)"},{transform:"translateX(0)"}],{duration:220})}}
  >{children}</button>;
}

function Shell({
  id,age,onClose,message,mood="idle",children,necklace,
}:{
  id:GameId;age:AgeBand;onClose:()=>void;message:string;mood?:"idle"|"happy"|"think"|"dance"|"eat";children:React.ReactNode;necklace?:string[];
}) {
  const meta=GAME_META[id];
  return <div className="pw15-game" style={{"--scene":`url("${sceneImages[meta.scene]}")`} as React.CSSProperties}>
    <div className="pw15-game-bg"/>
    <header className="pw15-game-head">
      <button onClick={onClose}><ArrowLeft/> <span>Πίσω</span></button>
      <div><small>{AGE_META[age].label} • {meta.domain}</small><b>{meta.title}</b></div>
      <button onClick={()=>speakGreek(message)} aria-label="Άκου οδηγία">🔊</button>
    </header>
    <div className="pw15-game-layout">
      <PisipoukGuide message={message} mood={mood} necklace={necklace}/>
      <section className="pw15-playfield">{children}</section>
    </div>
  </div>
}

const food = [
  {id:"apple",name:"μήλο",src:`${OPENMOJI}/1F34E.svg`,healthy:true},
  {id:"banana",name:"μπανάνα",src:`${OPENMOJI}/1F34C.svg`,healthy:true},
  {id:"carrot",name:"καρότο",src:`${OPENMOJI}/1F955.svg`,healthy:true},
  {id:"strawberry",name:"φράουλα",src:`${OPENMOJI}/1F353.svg`,healthy:true},
  {id:"cookie",name:"μπισκότο",src:`${OPENMOJI}/1F36A.svg`,healthy:false},
];

function FeedGame({age,onClose}:{age:AgeBand;onClose:()=>void}) {
  const target=useRef<HTMLDivElement>(null);
  const [eaten,setEaten]=useState<string[]>([]);
  const [message,setMessage]=useState(age==="2-3"?"Δώσε μου ένα φρούτο.":"Φτιάξε μου ένα πολύχρωμο πικνίκ.");
  const goal=age==="2-3"?3:4;
  const drop=(item:typeof food[number],x:number,y:number)=>{
    if(!inside(x,y,target.current?.getBoundingClientRect()||null)) return false;
    if(age!=="2-3"&&!item.healthy){setMessage("Αυτό είναι λιχουδιά. Ας διαλέξουμε πρώτα κάτι που μεγαλώνει στη φύση.");return true}
    setEaten(v=>v.includes(item.id)?v:[...v,item.id]);setMessage(`Νιαμ! ${item.name}. Τι άλλο θα διαλέξεις;`);return true;
  };
  const done=eaten.length>=goal;
  return <Shell id="feed" age={age} onClose={onClose} message={done?"Χόρτασα! Ευχαριστώ για το πικνίκ.":message} mood={done?"happy":"eat"}>
    <div className="pw15-feed">
      <div className="pw15-feed-target" ref={target}><img src={bearLogo} alt="" /><span>δώσε εδώ</span></div>
      <div className="pw15-picnic">
        {food.map(item=><Drag key={item.id} label={item.name} disabled={done||eaten.includes(item.id)} onDrop={(x,y)=>drop(item,x,y)}>
          <img src={item.src} alt={item.name}/>
        </Drag>)}
      </div>
      <div className="pw15-progress">{Math.min(eaten.length,goal)} / {goal}</div>
    </div>
  </Shell>;
}

const beadColors=["#f95f8d","#ffc941","#58bfe8","#6b58e9","#5fd08a","#ff9c51"];
function NecklaceGame({age,onClose}:{age:AgeBand;onClose:()=>void}) {
  const target=useRef<HTMLDivElement>(null);
  const [beads,setBeads]=useState<string[]>([]);
  const [phase,setPhase]=useState<"make"|"tie"|"wear">("make");
  const min=age==="4-5"?8:6;
  const [message,setMessage]=useState("Διάλεξε χάντρες και πέρασέ τες στο κορδόνι.");
  const drop=(color:string,x:number,y:number)=>{if(phase!=="make"||!inside(x,y,target.current?.getBoundingClientRect()||null))return false;setBeads(v=>[...v,color].slice(0,12));setMessage("Η χάντρα πέρασε. Συνέχισε όπως σου αρέσει.");return true};
  return <Shell id="necklace" age={age} onClose={onClose} message={message} mood={phase==="wear"?"happy":phase==="tie"?"think":"idle"} necklace={phase==="wear"?beads:undefined}>
    <div className="pw15-necklace">
      <div className="pw15-thread" ref={target}>
        <div className={`pw15-string ${phase!=="make"?"tied":""}`}/>
        <div className="pw15-thread-beads">{beads.map((c,i)=><i key={i} style={{background:c}}/>)}</div>
      </div>
      <div className="pw15-bead-tray">{beadColors.map((c,i)=><Drag key={c} label={`Χάντρα ${i+1}`} disabled={phase!=="make"} onDrop={(x,y)=>drop(c,x,y)}><span className="pw15-bead" style={{"--bead":c} as React.CSSProperties}/></Drag>)}</div>
      {beads.length>=min&&phase==="make"&&<button className="pw15-action" onClick={()=>{setPhase("tie");setMessage("Τώρα ενώνουμε τις δύο άκρες και δένουμε το κολιέ.");}}><Check/> Δένω το κολιέ</button>}
      {phase==="tie"&&<button className="pw15-action magic" onClick={()=>{setPhase("wear");setMessage("Το έφτιαξες! Κοίτα, τώρα το φοράω στον λαιμό μου.");}}><Sparkles/> Το δίνω στον Πισιπούκ</button>}
      {phase==="wear"&&<div className="pw15-finale">Το δώρο σου έγινε μέρος του Πισιπούκ.</div>}
    </div>
  </Shell>;
}

const sortItems=[
  {id:"r1",color:"red",src:`${KENNEY}/2d/Puzzle%20Pack%201/element_red_diamond_glossy.png`},
  {id:"r2",color:"red",src:`${KENNEY}/2d/Puzzle%20Pack%201/element_red_square_glossy.png`},
  {id:"b1",color:"blue",src:`${KENNEY}/2d/Puzzle%20Pack%201/element_blue_diamond_glossy.png`},
  {id:"b2",color:"blue",src:`${KENNEY}/2d/Puzzle%20Pack%201/element_blue_square_glossy.png`},
  {id:"y1",color:"yellow",src:`${KENNEY}/2d/Puzzle%20Pack%201/element_yellow_diamond_glossy.png`},
  {id:"y2",color:"yellow",src:`${KENNEY}/2d/Puzzle%20Pack%201/element_yellow_square_glossy.png`},
];

function SortGame({age,onClose}:{age:AgeBand;onClose:()=>void}) {
  const refs={red:useRef<HTMLDivElement>(null),blue:useRef<HTMLDivElement>(null),yellow:useRef<HTMLDivElement>(null)};
  const [placed,setPlaced]=useState<string[]>([]);
  const [message,setMessage]=useState("Βρες ποιο καλάθι έχει το ίδιο χρώμα.");
  const drop=(item:typeof sortItems[number],x:number,y:number)=>{
    const hit=(Object.keys(refs) as (keyof typeof refs)[]).find(k=>inside(x,y,refs[k].current?.getBoundingClientRect()||null));
    if(!hit)return false;
    if(hit!==item.color){setMessage("Κοίτα ξανά το χρώμα. Δοκίμασε ένα άλλο καλάθι.");return true}
    setPlaced(v=>[...v,item.id]);setMessage("Ναι. Ίδιο χρώμα. Συνέχισε.");return true;
  };
  const done=placed.length===sortItems.length;
  return <Shell id="sort" age={age} onClose={onClose} message={done?"Τα βρήκες όλα. Θέλεις να τα ανακατέψουμε ξανά;":message} mood={done?"happy":"idle"}>
    <div className="pw15-sort">
      <div className="pw15-sort-items">{sortItems.filter(x=>!placed.includes(x.id)).map(item=><Drag key={item.id} label="Γυαλιστερό σχήμα" onDrop={(x,y)=>drop(item,x,y)}><img src={item.src} alt=""/></Drag>)}</div>
      <div className="pw15-baskets">
        <div ref={refs.red} className="red"><span/></div><div ref={refs.blue} className="blue"><span/></div><div ref={refs.yellow} className="yellow"><span/></div>
      </div>
    </div>
  </Shell>;
}

const animals=[
  {id:"dog",src:`${KENNEY}/2d/Animal%20Pack%20Remastered/Round/dog.png`,hz:261.63},
  {id:"rabbit",src:`${KENNEY}/2d/Animal%20Pack%20Remastered/Round/rabbit.png`,hz:329.63},
  {id:"cow",src:`${KENNEY}/2d/Animal%20Pack%20Remastered/Round/cow.png`,hz:392},
  {id:"bear",src:`${KENNEY}/2d/Animal%20Pack%20Remastered/Round/bear.png`,hz:523.25},
];
function tone(hz:number){try{const AC=window.AudioContext||(window as any).webkitAudioContext;const ctx=new AC();const o=ctx.createOscillator();const g=ctx.createGain();o.type="triangle";o.frequency.value=hz;g.gain.setValueAtTime(.001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.16,ctx.currentTime+.02);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.4);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+.42);setTimeout(()=>ctx.close(),600)}catch{}}

function MusicGame({age,onClose}:{age:AgeBand;onClose:()=>void}) {
  const [active,setActive]=useState<string|null>(null);
  const [plays,setPlays]=useState(0);
  const [target,setTarget]=useState<string[]>([]);
  const [input,setInput]=useState<string[]>([]);
  const [message,setMessage]=useState("Άγγιξε τα ζωάκια και φτιάξε τον δικό σου ήχο.");
  const challenge=target.length>0;
  const hit=(id:string)=>{
    const a=animals.find(x=>x.id===id)!;tone(a.hz);setActive(id);setTimeout(()=>setActive(null),300);setPlays(v=>v+1);
    if(challenge){const next=[...input,id];if(target.slice(0,next.length).some((v,i)=>v!==next[i])){setMessage("Δεν πειράζει. Άκου ξανά και δοκίμασε.");setInput([]);return}setInput(next);if(next.length===target.length){setMessage("Το θυμήθηκες. Τώρα φτιάξε δικό σου ρυθμό.");setTarget([]);setInput([])}}
  };
  const startChallenge=()=>{const len=age==="3-4"?2:age==="4-5"?3:4;const seq=Array.from({length:len},(_,i)=>animals[(i*2+plays)%animals.length].id);setTarget(seq);setInput([]);setMessage("Άκου και μετά παίξε τον ίδιο μικρό ρυθμό.");seq.forEach((id,i)=>setTimeout(()=>{const a=animals.find(x=>x.id===id)!;tone(a.hz);setActive(id);setTimeout(()=>setActive(null),260)},i*520))};
  return <Shell id="music" age={age} onClose={onClose} message={message} mood={active?"dance":"idle"}>
    <div className="pw15-music">
      <div className="pw15-music-stage">{animals.map(a=><button key={a.id} className={active===a.id?"on":""} onClick={()=>hit(a.id)} aria-label={`Παίζω ήχο ${a.id}`}><img src={a.src} alt=""/><i/></button>)}</div>
      {age!=="2-3"&&<button className="pw15-action" onClick={startChallenge}>Ακούω και επαναλαμβάνω</button>}
      <div className="pw15-progress">{challenge?`${input.length} / ${target.length}`:`${plays} ήχοι`}</div>
    </div>
  </Shell>;
}

function SoundGarden({age,onClose}:{age:AgeBand;onClose:()=>void}) {
  const [count,setCount]=useState(0);const [message,setMessage]=useState("Άγγιξε ό,τι σου κινεί την περιέργεια.");
  const items=[...animals.slice(0,3),{id:"fish",src:`${KENNEY}/2d/Fish%20Pack/fish_blue.png`,hz:440}];
  return <Shell id="sound-garden" age={age} onClose={onClose} message={message} mood={count>3?"happy":"idle"}>
    <div className="pw15-garden">
      {items.map((a,i)=><button key={a.id} style={{left:`${15+i*22}%`,top:`${22+(i%2)*28}%`}} onClick={()=>{tone(a.hz);setCount(v=>v+1);setMessage("Ο κόσμος απάντησε. Δοκίμασε κάτι άλλο.");}}><img src={a.src} alt=""/></button>)}
    </div>
  </Shell>;
}

const storyScenes=[
  {id:"arrival",src:arrival,label:"Ο Πισιπούκ φτάνει και κοιτάζει γύρω του."},
  {id:"classroom",src:classroom,label:"Μπαίνει στην τάξη και βρίσκει τους φίλους του."},
  {id:"story",src:story,label:"Όλοι μαζί φτιάχνουν μια καινούργια ιστορία."},
];
function StoryOrder({age,onClose}:{age:AgeBand;onClose:()=>void}) {
  const [order,setOrder]=useState<string[]>([]);const [message,setMessage]=useState("Διάλεξε ποια σκηνή πιστεύεις ότι έρχεται πρώτη.");
  const add=(id:string)=>{if(order.includes(id))return;const next=[...order,id];setOrder(next);setMessage(next.length===3?"Άκου τώρα την ιστορία που έφτιαξες.":"Ωραία. Ποια σκηνή θέλεις μετά;")};
  useEffect(()=>{if(order.length===3){const text=order.map(id=>storyScenes.find(x=>x.id===id)!.label).join(" ");setTimeout(()=>speakGreek(text),300)}},[order]);
  return <Shell id="story-order" age={age} onClose={onClose} message={message} mood={order.length===3?"happy":"think"}>
    <div className="pw15-story-order">
      <div className="pw15-story-options">{storyScenes.map(s=><button key={s.id} disabled={order.includes(s.id)} onClick={()=>add(s.id)}><img src={s.src} alt=""/><span>{order.indexOf(s.id)>=0?order.indexOf(s.id)+1:""}</span></button>)}</div>
      <div className="pw15-story-strip">{order.map((id,i)=>{const s=storyScenes.find(x=>x.id===id)!;return <div key={id}><b>{i+1}</b><img src={s.src} alt=""/></div>})}</div>
    </div>
  </Shell>;
}

function NatureHunt({age,onClose}:{age:AgeBand;onClose:()=>void}) {
  const count=age==="2-3"?3:age==="3-4"?4:5;const [found,setFound]=useState<number[]>([]);
  const spots=[{x:16,y:68},{x:32,y:32},{x:55,y:62},{x:76,y:28},{x:84,y:72}].slice(0,count);
  const message=found.length===count?"Τα βρήκες όλα. Τώρα κοίτα έξω από την οθόνη: τι παρατηρείς γύρω σου;":"Κοίτα αργά. Υπάρχουν μικρά φωτεινά σημάδια στον κήπο.";
  return <Shell id="nature-hunt" age={age} onClose={onClose} message={message} mood={found.length===count?"happy":"idle"}>
    <div className="pw15-hunt">
      <img src={exterior} alt="Ο χώρος του Πισιπούκ"/>
      {spots.map((s,i)=><button key={i} className={found.includes(i)?"found":""} style={{left:`${s.x}%`,top:`${s.y}%`}} onClick={()=>setFound(v=>v.includes(i)?v:[...v,i])} aria-label="Κρυμμένη λεπτομέρεια"><span/></button>)}
      <div className="pw15-progress">{found.length} / {count}</div>
    </div>
  </Shell>;
}

function MarbleRun({age,onClose}:{age:AgeBand;onClose:()=>void}) {
  const [pieces,setPieces]=useState([0,1,2]);const [running,setRunning]=useState(false);const [message,setMessage]=useState("Άλλαξε τη σειρά των ραμπών. Μετά άφησε τη μπίλια να κυλήσει.");
  const rotate=(idx:number)=>{if(running)return;setPieces(v=>{const n=[...v];n[idx]=(n[idx]+1)%3;return n})};
  const good=pieces.join("")==="012";
  const run=()=>{setRunning(false);requestAnimationFrame(()=>{setRunning(true);setMessage(good?"Η διαδρομή δούλεψε. Τι άλλαξε όταν οι ράμπες είχαν αυτή τη σειρά;":"Η μπίλια σταμάτησε νωρίς. Άλλαξε μία ράμπα και πρόβλεψε τι θα γίνει.")})};
  return <Shell id="marble" age={age} onClose={onClose} message={message} mood={good&&running?"happy":"think"}>
    <div className="pw15-marble">
      <div className="pw15-marble-track">
        {pieces.map((state,i)=><button key={i} onClick={()=>rotate(i)} className={`piece p${i} r${state}`} aria-label={`Ράμπα ${i+1}`}><img src={`${KENNEY}/2d/Physics%20Assets/Wood%20elements/elementWood00${i*4}.png`} alt=""/></button>)}
        <span className={running?`ball run-${good?"good":"bad"}`:"ball"}/>
      </div>
      <button className="pw15-action" onClick={run}><Sparkles/> Αφήνω τη μπίλια</button>
    </div>
  </Shell>;
}

export function GamePlayer({id,age,onClose}:{id:GameId;age:AgeBand;onClose:()=>void}) {
  if(id==="feed")return <FeedGame age={age} onClose={onClose}/>;
  if(id==="sound-garden")return <SoundGarden age={age} onClose={onClose}/>;
  if(id==="necklace")return <NecklaceGame age={age} onClose={onClose}/>;
  if(id==="sort")return <SortGame age={age} onClose={onClose}/>;
  if(id==="music")return <MusicGame age={age} onClose={onClose}/>;
  if(id==="story-order")return <StoryOrder age={age} onClose={onClose}/>;
  if(id==="nature-hunt")return <NatureHunt age={age} onClose={onClose}/>;
  return <MarbleRun age={age} onClose={onClose}/>;
}
