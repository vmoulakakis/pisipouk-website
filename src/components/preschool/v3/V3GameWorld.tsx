import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, RefreshCw, Volume2 } from "lucide-react";
import { speak } from "../world/Game";
import {FruitIllustration, GardenIllustration} from "./V3Illustrations";
import "./v3.css";

type Mode = "colors" | "feed" | "shapes" | "garden" | "music" | "story";
type Age = 0 | 1 | 2 | 3;
type Props={age:Age;initial?:Mode;onBack:()=>void};
const COLORS=[
 {name:"κόκκινο",value:"#F36377",symbol:"●"},
 {name:"κίτρινο",value:"#F9C752",symbol:"◆"},
 {name:"μπλε",value:"#5A9BEF",symbol:"★"},
 {name:"πράσινο",value:"#6BC58F",symbol:"♥"},
 {name:"μοβ",value:"#A88BDA",symbol:"✿"},
 {name:"πορτοκαλί",value:"#FA9661",symbol:"☀"}
];
const FRUITS=[{name:"μήλα",symbol:"🍎"},{name:"αχλάδια",symbol:"🍐"},{name:"φράουλες",symbol:"🍓"},{name:"κεράσια",symbol:"🍒"},{name:"πορτοκάλια",symbol:"🍊"},{name:"καρότα",symbol:"🥕"}];
const SHAPES=[{name:"κύκλος",icon:"●"},{name:"τετράγωνο",icon:"■"},{name:"τρίγωνο",icon:"▲"},{name:"αστέρι",icon:"★"},{name:"καρδιά",icon:"♥"}];
const BEATS=[{name:"Τύμπανο",icon:"🥁",frequency:160},{name:"Καμπανάκι",icon:"🔔",frequency:660},{name:"Ξυλόφωνο",icon:"🎵",frequency:440},{name:"Μαράκα",icon:"🎶",frequency:320}];
const TITLES:Record<Mode,string>={colors:"Το μαγικό εργαστήριο χρωμάτων",feed:"Ταΐζω τους φίλους του δάσους",shapes:"Το σπιτάκι των σχημάτων",garden:"Ο Σπορούλης μεγαλώνει",music:"Η μικρή ορχήστρα",story:"Φτιάξε μια ιστορία"};
const INTRO:Record<Mode,string>={colors:"Άγγιξε τις μπογιές. Δώσε ζωή στο λουλούδι!",feed:"Βάλε φρούτα στο καλάθι του αρκούδου!",shapes:"Γέμισε το σπιτάκι με σχήματα!",garden:"Βοήθησε ένα μικρό σποράκι να μεγαλώσει.",music:"Άκου, παίξε, φτιάξε δικό σου ρυθμό!",story:"Διάλεξε τι θα κάνει ο ήρωας!"};
export const WORLD_GAMES:{id:Mode;label:string;description:string;from:Age;icon:string}[]=[
 {id:"colors",label:"Μαγικά χρώματα",description:"Ζωγραφίζω τον κήπο",from:0,icon:"🎨"},
 {id:"feed",label:"Το δάσος πεινάει",description:"Μετράω με αληθινές κινήσεις",from:0,icon:"🧺"},
 {id:"shapes",label:"Το σπιτάκι",description:"Χτίζω με σχήματα",from:0,icon:"🏠"},
 {id:"garden",label:"Ο Σπορούλης",description:"Φροντίζω τη φύση",from:0,icon:"🌱"},
 {id:"music",label:"Η ορχήστρα",description:"Παίζω και ακούω ήχους",from:1,icon:"🎶"},
 {id:"story",label:"Το παραμύθι μου",description:"Αλλάζω την ιστορία",from:1,icon:"📖"}
];
function safeRandom(seed:number){let t=(seed*2654435761)>>>0;t^=t<<13;t^=t>>>17;t^=t<<5;return(t>>>0)/4294967296}
function shuffled<T>(values:T[],seed:number){const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(safeRandom(seed+i*71)*(i+1));[out[j],out[i]]=[out[i],out[j]]}return out;}
function sound(f:number){if(typeof window==="undefined")return;const Audio=(window.AudioContext||(window as typeof window &{webkitAudioContext?:typeof AudioContext}).webkitAudioContext);if(!Audio)return;const a=new Audio();const o=a.createOscillator();const g=a.createGain();o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(.14,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.3);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+.31);o.onended=()=>void a.close();}
function Activity({mode,age,round,onReplay}:{mode:Mode;age:Age;round:number;onReplay:()=>void}){
 const [step,setStep]=useState(0),[choice,setChoice]=useState<string[]>([]),[feedback,setFeedback]=useState(""),[selected,setSelected]=useState<string|null>(null);
 const colors=useMemo(()=>shuffled(COLORS.slice(0,Math.min(6,3+age)),round*89+11),[round,age]);
 const fruits=useMemo(()=>shuffled(FRUITS.slice(0,age===0?3:6),round*59+37),[round]);
 const shapes=useMemo(()=>shuffled(SHAPES.slice(0,age<2?3:5),round*33+3),[round,age]);
 const notes=useMemo(()=>Array.from({length:age<=1?2:age===2?3:4},(_,i)=>BEATS[Math.floor(safeRandom(round*67+i*109+9)*BEATS.length)].name),[round,age]);
 const targetCount=2+((round*3+age)%Math.min(5,age+3));
 const targetColor=colors[(step+round)%colors.length];
 const targetShape=shapes[step%shapes.length];

 const complete=mode==="garden"?step>=4:mode==="music"?step>=notes.length:mode==="story"?step>=3:step>=3;
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{ref.current?.focus()},[]);
 const finishStep=(message:string)=>{setStep(v=>v+1);setFeedback(message);setChoice([]);setSelected(null);};
 const chooseColor=(name:string)=>{if(name===targetColor.name)finishStep(["Το λουλούδι χάρηκε!","Τι υπέροχος κήπος!","Εσύ διαλέγεις τα χρώματα!"][step%3]);else setFeedback("Δοκίμασε κι άλλη μπογιά, χωρίς βιασύνη.")};
 const addFood=(item:string)=>{if(item!==fruits[(round+step)%fruits.length].name){setFeedback("Ο φίλος σου περιμένει άλλο φρούτο!");return;}const next=[...choice,item];setChoice(next);if(next.length>=targetCount)finishStep("Το καλάθι γέμισε!");else setFeedback("Συνέχισε να γεμίζεις το καλάθι!")};
 const chooseShape=(name:string)=>{if(name===targetShape.name)finishStep("Το κομμάτι ταίριαξε!");else setFeedback("Άγγιξε το περίγραμμα, ψάξε ξανά!")};
 const playNote=(name:string)=>{const beat=BEATS.find(n=>n.name===name);if(beat)sound(beat.frequency);if(name===notes[step])finishStep("Τι ωραίος ήχος!");else setFeedback("Άκου τη σειρά και δοκίμασε ξανά.")};
 const stageStyle={background:["#FCEFCB","#D7F1E6","#E1EDFC","#F6DFED"][round%4]};
 return <div className="p3-game-play" ref={ref} tabIndex={-1}>
  <div className={"p3-stage p3-stage-"+mode} style={stageStyle}>
   <span className="p3-stage-sun" aria-hidden="true">☀</span><span className="p3-stage-cloud" aria-hidden="true">☁</span>
   {complete?<div className="p3-success" role="status"><img src="/preschool-world/bear.webp" alt="Ο Πισιπούκ χαμογελά"/><h3>Το καταφέραμε μαζί!</h3><p>Πάμε σε μια καινούρια περιπέτεια;</p><button className="p3-main-button" onClick={onReplay}><RefreshCw size={23}/> Καινούριο παιχνίδι</button></div>:
   <>
    <div className="p3-character-tale"><img src="/preschool-world/bear.webp" alt="" /><div className="p3-speech"><span>{mode==="colors"?`Χρωμάτισε με ${targetColor.name}!`:mode==="feed"?`Βάλε ${targetCount} ${fruits[round%fruits.length].name} στο καλάθι!`:mode==="shapes"?`Ποιο είναι το ${targetShape.name};`:mode==="garden"?["Διάλεξε σπόρο!","Φύτεψέ τον!","Δώσε λίγο νερό!","Βρες ζεστό φως!"][step]:mode==="music"?`Άκου και παίξε: ${notes.join(" – ")}`:`Τι θα κάνει ο ήρωας τώρα; (${step+1}/3)`}</span><button aria-label="Άκουσε την οδηγία" onClick={()=>speak(mode==="colors"?`Χρωμάτισε με ${targetColor.name}`:mode==="feed"?`Βάλε ${targetCount} ${fruits[round%fruits.length].name}`:INTRO[mode])}><Volume2/></button></div></div>
    {mode==="colors"&&<div className="p3-paint-game"><div className="p3-large-flower" aria-label="Λουλούδι που χρωματίζεται" style={{"--petal":step===0?"#fff":colors[(step-1+colors.length)%colors.length].value} as React.CSSProperties}><svg viewBox="0 0 240 240" role="img" aria-label="Μεγάλο λουλούδι"><g fill="var(--petal)" stroke="#4e6a4d" strokeWidth="4"><ellipse cx="120" cy="62" rx="34" ry="42"/><ellipse cx="120" cy="178" rx="34" ry="42"/><ellipse cx="62" cy="120" rx="42" ry="34"/><ellipse cx="178" cy="120" rx="42" ry="34"/><circle cx="120" cy="120" r="37" fill="#F8CD55"/></g><path d="M120 205v33" stroke="#3C9364" strokeWidth="7"/></svg></div><div className="p3-color-pots">{shuffled(colors,round+step*19).map(c=><button key={c.name} aria-label={c.name} onClick={()=>chooseColor(c.name)} style={{"--pot":c.value} as React.CSSProperties}><span>{c.symbol}</span><b>{c.name}</b></button>)}</div></div>}
    {mode==="feed"&&<div className="p3-feed-game"><div className="p3-food-count" aria-label={`${choice.length} από ${targetCount}`}>{Array.from({length:targetCount},(_,i)=><span key={i} className={i<choice.length?"filled":""}>{i<choice.length?fruits[round%fruits.length].symbol:"○"}</span>)}</div><button className="p3-basket" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();addFood(e.dataTransfer.getData("text/plain"))}} onClick={()=>selected&&addFood(selected)}>🧺<small>Ρίξε εδώ!</small></button><div className="p3-food-items">{shuffled(FRUITS.slice(0,age===0?3:6),round+step).map(f=><button key={f.name} draggable onDragStart={e=>e.dataTransfer.setData("text/plain",f.name)} onClick={()=>{setSelected(f.name);addFood(f.name)}} title={f.name}><FruitIllustration name={f.name}/><b>{f.name}</b></button>)}</div></div>}
    {mode==="shapes"&&<div className="p3-shape-game"><div className="p3-outline-shape" aria-label={`Περίγραμμα: ${targetShape.name}`}>{targetShape.icon}</div><div className="p3-shape-blocks">{shuffled(shapes,round+step*7).map(s=><button key={s.name} onClick={()=>chooseShape(s.name)} aria-label={s.name}><span>{s.icon}</span><b>{s.name}</b></button>)}</div></div>}
    {mode==="garden"&&<div className="p3-garden-game"><div className="p3-grow-plant"><GardenIllustration step={step}/></div><div className="p3-garden-options">{["🌰 Σπόρος","🪴 Χώμα","💧 Νερό","☀️ Ήλιος"].map((label,i)=><button key={i} disabled={i!==step} onClick={()=>finishStep("Ο Σπορούλης μεγαλώνει λίγο ακόμη!")}>{label}</button>)}</div></div>}
    {mode==="music"&&<div className="p3-music-game"><div className="p3-rhythm">{notes.map((n,i)=><span key={i} className={i<step?"played":""}>{BEATS.find(b=>b.name===n)?.icon}</span>)}</div><div className="p3-instruments">{BEATS.map(n=><button key={n.name} onClick={()=>playNote(n.name)}><span>{n.icon}</span><b>{n.name}</b></button>)}</div></div>}
    {mode==="story"&&<div className="p3-story-game"><div className="p3-story-picture"><img src={["/preschool-world/village.webp","/preschool-world/bear.webp","/preschool-world/village-mobile.webp"][step]} alt="Εικονογραφημένη σκηνή ιστορίας"/></div><div className="p3-story-choices">{[["Ο Πισιπούκ ανακαλύπτει μια φωλιά","Ο Πισιπούκ ακολουθεί μια πεταλούδα"],["Προσφέρει βοήθεια στον φίλο","Φυτεύει ένα πολύχρωμο λουλούδι"],["Κάνουν μια μεγάλη γιορτή","Φτιάχνουν ένα σπιτάκι"]][step].map(s=><button key={s} onClick={()=>{setSelected(s);finishStep("Η ιστορία προχωρά όπως εσύ διάλεξες!")}}><ArrowRight/> {s}</button>)}</div></div>}
    <div className="p3-stage-bottom"><div className="p3-dots" aria-label="Πρόοδος">{Array.from({length:mode==="garden"?4:mode==="music"?notes.length:3},(_,i)=><span key={i} className={i<step?"active":""}/>)}</div><p role="status" aria-live="polite">{feedback||"Άγγιξε, δοκίμασε, ανακάλυψε!"}</p></div>
   </>}
  </div>
 </div>;
}
export function V3GameWorld({age,initial,onBack}:Props){
 const [mode,setMode]=useState<Mode|null>(initial||null),[round,setRound]=useState(1);
 return <section className="p3-activities"><div className="p3-room-top"><button className="p3-back" onClick={mode?()=>{setMode(null);setRound(1)}:onBack}><ArrowLeft/> {mode?"Τα παιχνίδια":"Το χωριό"}</button><div className="p3-room-title"><small>ΠΑΙΖΩ ΚΑΙ ΑΝΑΚΑΛΥΠΤΩ</small><h2>{mode?TITLES[mode]:"Διάλεξε μια περιπέτεια"}</h2></div></div>
  {mode?<Activity key={mode+"-"+round+"-"+age} mode={mode} age={age} round={round} onReplay={()=>setRound(v=>v+1)}/>:<div className="p3-game-shelf">{WORLD_GAMES.filter(g=>g.from<=age).map(g=><button key={g.id} onClick={()=>setMode(g.id)}><span>{g.icon}</span><strong>{g.label}</strong><small>{g.description}</small><ArrowRight size={20}/></button>)}</div>}
 </section>;
}
