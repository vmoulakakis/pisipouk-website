import { useMemo, useState, useEffect, useRef } from "react";
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Check, Leaf } from "lucide-react";
import { CinematicForest3D } from "./CinematicForest3D";
import type { V15Age } from "./v15/Games";
import "./forest-quest-v17.css";

type LeafColor = "red" | "gold" | "green";
type Piece = {id:number;color:LeafColor;x:number;y:number;rotation:number};
const PALETTE: Record<LeafColor,{name:string;paint:string;dark:string}> = {
 red:{name:"κόκκινα",paint:"#e47464",dark:"#a4443d"},
 gold:{name:"κίτρινα",paint:"#e8be56",dark:"#ab7d23"},
 green:{name:"πράσινα",paint:"#77b18a",dark:"#3d7756"},
};
const PIECES:Piece[]=[
 {id:1,color:"red",x:17,y:25,rotation:-18},
 {id:2,color:"gold",x:43,y:16,rotation:28},
 {id:3,color:"green",x:76,y:26,rotation:-30},
 {id:4,color:"gold",x:28,y:64,rotation:14},
 {id:5,color:"red",x:66,y:60,rotation:38},
 {id:6,color:"green",x:88,y:72,rotation:-4},
 {id:7,color:"gold",x:53,y:82,rotation:-32},
 {id:8,color:"red",x:9,y:77,rotation:27},
 {id:9,color:"green",x:89,y:44,rotation:18},
];
const AGE_GOAL: Record<V15Age,number>={"2-3":2,"3-4":3,"4-5":4,"5-6":5};
function LeafArt({color}:{color:LeafColor}){
 const id="leaf-"+color;
 return <svg className="fq17-leaf-art" viewBox="0 0 120 150" role="img" aria-label={"Φύλλο: "+PALETTE[color].name}>
 <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff4c8"/><stop offset=".32" stopColor={PALETTE[color].paint}/><stop offset="1" stopColor={PALETTE[color].dark}/></linearGradient></defs>
 <path d="M58 130 C58 116 54 104 44 96 C-4 72 21 17 90 8 C108 72 94 108 62 112 L64 137" fill={"url(#"+id+")"} stroke={PALETTE[color].dark} strokeWidth="3" strokeLinejoin="round"/>
 <path d="M61 118 C64 76 76 41 92 16 M66 78 L35 52 M70 67 L96 57 M63 96 L33 78" fill="none" stroke="#fff6d9" strokeWidth="3" opacity=".6" strokeLinecap="round"/>
 <path d="M59 119 Q63 134 58 146" stroke="#81694a" strokeWidth="4" fill="none" strokeLinecap="round"/>
 </svg>;
}
function sayGreek(text:string){
 if(typeof window==="undefined"||!("speechSynthesis" in window))return;
 window.speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(text);u.lang="el-GR";u.rate=.82;u.pitch=1.05;window.speechSynthesis.speak(u);
}
export function ForestQuestV17({age,onExit}:{age:V15Age;onExit:()=>void}){
 const [round,setRound]=useState(0);
 const [collected,setCollected]=useState<number[]>([]);
 const [mistakes,setMistakes]=useState(0);
 const [sound,setSound]=useState(false);
 const [focused,setFocused]=useState<number|null>(null);
 const basketRef=useRef<HTMLDivElement>(null);
 const [feedback,setFeedback]=useState("");
 const goal=AGE_GOAL[age];
 const sequence:LeafColor[]=["gold","red","green"];
 const target=sequence[round%sequence.length];
 const eligible=PIECES.filter(p=>p.color===target);
 const complete=collected.length>=Math.min(goal,eligible.length);
 const instructions=`Βρες τα ${PALETTE[target].name} φύλλα και βάλε τα στο καλαθάκι.`;
 useEffect(()=>{if(sound)sayGreek(instructions);return()=>{if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel()}},[round,sound,target]);
 const pick=(piece:Piece)=>{
  if(complete||collected.includes(piece.id))return;
  if(piece.color!==target){setMistakes(m=>m+1);setFeedback("Δοκίμασε να βρεις ένα φύλλο με το χρώμα του καλαθιού.");if(sound)sayGreek("Δοκίμασε πάλι.");return;}
  setCollected(c=>[...c,piece.id]);setFeedback("Μπράβο! Συνέχισε την εξερεύνηση.");setFocused(null);
  if(sound)sayGreek("Μπράβο!");
 };
 const advance=()=>{setRound(r=>r+1);setCollected([]);setMistakes(0);setFeedback("");setFocused(null)};
 const reset=()=>{setCollected([]);setMistakes(0);setFeedback("");setFocused(null)};
 const remaining=useMemo(()=>PIECES.filter(p=>!collected.includes(p.id)),[collected]);
 return <section className="fq17" aria-label="Παιχνίδι 3D δάσους: συλλογή φύλλων">
  <div className="fq17-top"><button onClick={onExit}><ArrowLeft size={18}/> Πίσω στους κόσμους</button><span><Leaf size={18}/> Το μαγικό δάσος</span><button aria-label={sound?"Απενεργοποίηση φωνής":"Ενεργοποίηση φωνής"} aria-pressed={sound} onClick={()=>setSound(s=>!s)}>{sound?<Volume2 size={22}/>:<VolumeX size={22}/>}</button></div>
  <div className="fq17-stage"><CinematicForest3D/><div className="fq17-atmosphere" aria-hidden="true"><i/><i/><i/><i/><i/></div>
   <div className="fq17-instructions"><span className="fq17-label">Η ΑΠΟΣΤΟΛΗ ΜΑΣ</span><h2>Ο θησαυρός των φύλλων</h2><p>{instructions}</p><div className="fq17-goal"><span>Συλλογή:</span><strong>{collected.length} / {Math.min(goal,eligible.length)}</strong></div></div>
   <div className="fq17-leaves" role="group" aria-label="Φύλλα στο δάσος">{remaining.map(p=><button className={"fq17-leaf "+(focused===p.id?"selected":"")} key={p.id} style={{left:p.x+"%",top:p.y+"%",transform:"translate(-50%,-50%) rotate("+p.rotation+"deg)",animationDelay:p.id*-.34+"s"}} aria-label={PALETTE[p.color].name+" φύλλο. Πάτησε για να το μαζέψεις."} onFocus={()=>setFocused(p.id)} onClick={()=>pick(p)}><LeafArt color={p.color}/></button>)}</div>
   <div className="fq17-basket" ref={basketRef} aria-label="Καλαθάκι συλλογής"><div className="fq17-basket-handle"/><div className="fq17-basket-inside">{collected.map(id=><span key={id}><LeafArt color={target}/></span>)}</div><div className="fq17-basket-body"><span>{PALETTE[target].name} φύλλα</span></div></div>
   <div className="fq17-message" role="status" aria-live="polite">{feedback}</div>
   {complete&&<div className="fq17-win" role="status"><span>✨</span><h3>Τα κατάφερες!</h3><p>Βρήκες τα φύλλα που ψάχναμε. Θέλεις να εξερευνήσουμε ένα ακόμη χρώμα;</p><button onClick={advance}>Επόμενη αποστολή →</button><button className="fq17-quiet" onClick={reset}><RotateCcw size={16}/> Παίζω ξανά</button></div>}
  </div>
  <div className="fq17-bottom"><div><strong>Παιδαγωγικός στόχος:</strong> χρώματα, οπτική διάκριση, παρατήρηση και πρώιμη αρίθμηση.</div><div><strong>Μετά την οθόνη:</strong> βρείτε με έναν ενήλικο πεσμένα φύλλα και συγκρίνετε χρώματα χωρίς να κόβετε φυτά.</div><span>{mistakes>0?"Μπορείς να δοκιμάσεις όσες φορές θέλεις.":"Χωρίς χρονόμετρο ή βαθμολογία."}</span></div>
 </section>;
}