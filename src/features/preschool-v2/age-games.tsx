import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Heart, RotateCcw, Sparkles, Volume2, VolumeX } from "lucide-react";

function Voice({instruction}:{instruction:string}){
 const [muted,setMuted]=useState(false);
 const say=()=>{if(muted||typeof window==="undefined"||!("speechSynthesis" in window))return;window.speechSynthesis.cancel();const s=new SpeechSynthesisUtterance(instruction);s.lang="el-GR";s.rate=.86;s.pitch=1.08;window.speechSynthesis.speak(s)};
 return <span className="pw2-audio"><button type="button" onClick={say} aria-label="Άκου την οδηγία" title="Άκου την οδηγία"><Volume2 size={24}/></button><button type="button" onClick={()=>{setMuted(x=>!x);if(!muted&&"speechSynthesis" in window)window.speechSynthesis.cancel()}} aria-label={muted?"Άνοιγμα ήχου":"Σίγαση ήχου"}>{muted?<VolumeX size={20}/>:<Volume2 size={19}/>}</button></span>;
}
function PlayHeader({topic,title,desc}:{topic:string;title:string;desc:string}){
 return <div className="pw2-play-head"><div><div className="pw2-overline">{topic}</div><h2>{title}</h2><p>{desc}</p></div><Voice instruction={desc}/></div>
}
const POSITIONS=[[18,33],[43,20],[76,28],[25,66],[68,63],[89,66],[52,50],[6,71]];
function BubblePlay(){
 const [round,setRound]=useState(0),[popped,setPopped]=useState<number[]>([]);
 const total=5+(round%2);
 const done=popped.length===total;
 const newRound=()=>{setRound(x=>x+1);setPopped([])};
 return <section className="pw2-play">
  <PlayHeader topic="ΗΛΙΚΙΑ 2–3 · ΑΙΤΙΑ & ΑΠΟΤΕΛΕΣΜΑ" title="Οι μαγικές σαπουνόφουσκες" desc="Άγγιξε κάθε σαπουνόφουσκα για να κάνει ποπ!"/>
  <div className="pw2-bubble-scene" aria-label="Κήπος με σαπουνόφουσκες"><div className="pw2-sky-cloud cloud-one"/><div className="pw2-sky-cloud cloud-two"/><div className="pw2-garden"/><div className="pw2-scene-bear"><img src="/preschool-world/bear.webp" alt="Ο Πισιπούκ" /></div>
   {POSITIONS.slice(0,total).map(([x,y],i)=><button key={String(round)+"-"+i} type="button" disabled={popped.includes(i)} className={"pw2-bubble "+(popped.includes(i)?"burst":"")} style={{left:((x+round*7)%88+4)+"%",top:y+"%",animationDelay:(i*.23)+"s"}} onClick={()=>setPopped(v=>[...v,i])} aria-label={"Άγγιξε τη φούσκα "+(i+1)}><span/></button>)}
   <div className="pw2-scene-score">{popped.length} / {total} ✨</div>
  </div>
  <div className="pw2-response" role="status" aria-live="polite">{done?"🎉 Μπράβο! Έσκασαν όλες οι φούσκες!":"Οι φούσκες χορεύουν και περιμένουν το χεράκι σου!"}</div>
  <div className="pw2-play-actions"><button type="button" className="pw2-outline" onClick={()=>setPopped([])}><RotateCcw/> Ξανά το ίδιο</button><button className="pw2-main-button" type="button" onClick={newRound}>Νέες φούσκες <Sparkles/></button></div>
 </section>;
}
const COLORS=[{id:"red",name:"Κόκκινο",color:"#F0676C"},{id:"yellow",name:"Κίτρινο",color:"#F7C95A"},{id:"blue",name:"Μπλε",color:"#60A8DF"}];
const MIX:Record<string,{name:string;color:string}>={"red-yellow":{name:"Πορτοκαλί",color:"#F4A14B"},"yellow-red":{name:"Πορτοκαλί",color:"#F4A14B"},"yellow-blue":{name:"Πράσινο",color:"#77BB7A"},"blue-yellow":{name:"Πράσινο",color:"#77BB7A"},"red-blue":{name:"Μωβ",color:"#A586DB"},"blue-red":{name:"Μωβ",color:"#A586DB"}};
function ColorPlay(){
 const [first,setFirst]=useState<string|null>(null),[second,setSecond]=useState<string|null>(null),[discoveries,setDiscoveries]=useState<string[]>([]);
 const result=first&&second?MIX[first+"-"+second]:null;
 const choose=(v:string)=>{if(result){setFirst(v);setSecond(null)}else if(!first)setFirst(v);else if(first===v)setFirst(null);else{setSecond(v);const r=MIX[first+"-"+v];if(r)setDiscoveries(a=>a.includes(r.name)?a:[...a,r.name])}};
 const reset=()=>{setFirst(null);setSecond(null)};
 return <section className="pw2-play">
 <PlayHeader topic="ΗΛΙΚΙΑ 3–4 · ΔΟΚΙΜΑΖΩ ΚΑΙ ΑΝΑΚΑΛΥΠΤΩ" title="Μαγικό εργαστήρι χρωμάτων" desc="Ρίξε δύο διαφορετικά χρώματα στο μπολ. Τι θα συμβεί;"/>
 <div className="pw2-mix-scene"><div className="pw2-bottles">{COLORS.map(c=><button type="button" key={c.id} className={"pw2-color-bottle "+(first===c.id||second===c.id?"chosen":"")} aria-label={"Ρίχνω "+c.name+" χρώμα"} aria-pressed={first===c.id||second===c.id} onClick={()=>choose(c.id)}>
   <svg viewBox="0 0 90 130" aria-hidden="true"><rect x="31" y="5" width="28" height="24" rx="5" fill="#dae7eb" stroke="#678da4" strokeWidth="3"/><path d="M30 29Q17 42 17 63V108Q17 120 31 120H59Q73 120 73 108V63Q73 42 60 29Z" fill={c.color} stroke="#688fa6" strokeWidth="4"/><path d="M24 64Q45 51 65 64" fill="none" stroke="#fff9" strokeWidth="6"/></svg>
   <strong>{c.name}</strong></button>)}</div>
   <div className="pw2-mixing-area">{first&&<div className="pw2-drop first" style={{background:COLORS.find(c=>c.id===first)?.color}}/>}{second&&<div className="pw2-drop second" style={{background:COLORS.find(c=>c.id===second)?.color}}/>}<div className="pw2-bowl"><div className="pw2-bowl-liquid" style={{background:result?.color||COLORS.find(c=>c.id===first)?.color||"#b9dae5"}}/><div className="pw2-bowl-outer"/></div></div>
   <div className="pw2-mix-label" role="status">{result?<>✨ Φτιάξαμε <strong style={{color:result.color}}>{result.name}!</strong></>:first?"Διάλεξε άλλο ένα διαφορετικό χρώμα.":"Διάλεξε το πρώτο χρώμα!"}</div>
  </div>
  <div className="pw2-response">Χρώματα που ανακάλυψες: {discoveries.length} από 3 🎨</div>
  <div className="pw2-play-actions"><button className="pw2-outline" type="button" onClick={reset}><RotateCcw/> Καθαρίζω το μπολ</button><button className="pw2-main-button" type="button" onClick={reset}>Άλλη ανάμειξη <ArrowRight/></button></div>
 </section>;
}
function BridgePlay(){
 const [level,setLevel]=useState(0),[choice,setChoice]=useState(1),[filled,setFilled]=useState<number[]>([]),[status,setStatus]=useState("Διάλεξε το σωστό ξύλο, μετά άγγιξε ένα κενό."),[walking,setWalking]=useState(false),[arrived,setArrived]=useState(false);
 const slots=level%2===0?[1,2,1]:[2,1,2];
 const put=(idx:number)=>{if(walking||arrived)return;if(filled.includes(idx)){setFilled(p=>p.filter(x=>x!==idx));setStatus("Αφαιρέσαμε το ξύλο. Δοκίμασε ξανά.");return;}if(choice!==slots[idx]){setStatus("Εδώ χρειάζεται "+(slots[idx]===1?"κοντό":"μακρύ")+" ξύλο.");return;}setFilled(p=>[...p,idx]);setStatus("Τοποθέτησες σωστά το ξύλο!")};
 const reset=(next:boolean)=>{setWalking(false);setArrived(false);setFilled([]);setStatus("Διάλεξε ένα ξύλο και τοποθέτησέ το στο κενό.");if(next)setLevel(n=>n+1)};
 const walk=()=>{if(arrived){reset(true);return;}if(filled.length!==3){setStatus("Λείπουν ξύλα από τη γέφυρα!");return;}setStatus("Ο Πισιπούκ περνάει προσεκτικά τη γέφυρα!");setWalking(true)};
 useEffect(()=>{if(!walking)return;const t=window.setTimeout(()=>{setWalking(false);setArrived(true);setStatus("Μπράβο! Ο Πισιπούκ πέρασε με ασφάλεια!")},2700);return()=>window.clearTimeout(t)},[walking]);
 return <section className="pw2-play"><PlayHeader topic="ΗΛΙΚΙΑ 4–5 · ΠΕΙΡΑΜΑΤΙΖΟΜΑΙ ΚΑΙ ΧΤΙΖΩ" title="Η γέφυρα πάνω από το ποτάμι" desc="Επίλεξε κοντά και μακριά ξύλα για να γεμίσεις τα τρία κενά της γέφυρας."/>
 <div className="pw2-wood-selection" role="group" aria-label="Επιλογή ξύλου">{[1,2].map(n=><button type="button" key={n} aria-pressed={choice===n} className={choice===n?"selected":""} onClick={()=>setChoice(n)}><span className={"pw2-wood "+(n===1?"short":"long")}/><strong>{n===1?"Κοντό ξύλο":"Μακρύ ξύλο"}</strong></button>)}</div>
 <div className="pw2-river-scene"><div className="pw2-river-water"/><div className="pw2-river-wave a"/><div className="pw2-river-wave b"/><div className="pw2-river-wave c"/><div className="pw2-river-bank left"/><div className="pw2-river-bank right"/><div className="pw2-bridge-spaces">{slots.map((target,i)=><button type="button" key={i} onClick={()=>put(i)} disabled={walking||arrived} className={"pw2-bridge-space "+(filled.includes(i)?"built":"")} aria-label={"Κενό "+(i+1)+", "+(target===1?"κοντό":"μακρύ")+" ξύλο"}><span>{filled.includes(i)?"✓":target===1?"Μικρό":"Μεγάλο"}</span></button>)}</div><div className={"pw2-walker "+(walking?"walking":arrived?"arrived":"")}><img src="/preschool-world/bear.webp" alt="Πισιπούκ"/></div><span className="pw2-river-flowers">🌼　🌷　🌻</span></div>
 <div className="pw2-response" role="status" aria-live="polite">{status}</div><div className="pw2-play-actions"><button type="button" className="pw2-outline" onClick={()=>reset(false)}><RotateCcw/> Ξανά το ίδιο</button><button type="button" className="pw2-main-button" onClick={walk}>{arrived?"Επόμενη γέφυρα":"Δοκίμασε τη γέφυρα"} <ArrowRight/></button></div>
 </section>;
}
type Direction="up"|"right"|"down"|"left";
const DIRECTIONS:Record<Direction,[number,number]>={up:[-1,0],right:[0,1],down:[1,0],left:[0,-1]};
const SYMBOLS:Record<Direction,string>={up:"↑",right:"→",down:"↓",left:"←"};
const OBSTACLES=[[1,1],[2,2]];
function RobotPlay(){
 const [commands,setCommands]=useState<Direction[]>([]),[at,setAt]=useState<[number,number]>([0,0]),[playing,setPlaying]=useState(false),[status,setStatus]=useState("Πρόσθεσε βελάκια ώστε το ρομπότ να φτάσει στο αστέρι."),[won,setWon]=useState(false);
 const point=useRef<[number,number]>([0,0]);
 const reset=(keep:boolean)=>{setPlaying(false);point.current=[0,0];setAt([0,0]);setWon(false);setStatus("Σχεδίασε μία διαδρομή χωρίς να χτυπήσεις σε πέτρες.");if(!keep)setCommands([])};
 useEffect(()=>{if(!playing)return;let cursor=0;const timer=window.setInterval(()=>{if(cursor>=commands.length){setPlaying(false);setStatus("Δεν έφτασε στο αστέρι. Δοκίμασε άλλη διαδρομή.");return;}const d=DIRECTIONS[commands[cursor]];cursor+=1;const next:[number,number]=[point.current[0]+d[0],point.current[1]+d[1]];if(next.some(n=>n<0||n>=4)||OBSTACLES.some(([r,c])=>r===next[0]&&c===next[1])){setPlaying(false);setStatus("Ωχ, εμπόδιο! Χρειάζεται άλλο πρόγραμμα.");return;}point.current=next;setAt(next);if(next[0]===3&&next[1]===3){setPlaying(false);setWon(true);setStatus("Το ρομπότ έφτασε στο αστέρι! Μπράβο!")}},600);return()=>window.clearInterval(timer)},[playing,commands]);
 const execute=()=>{reset(true);setPlaying(true);setStatus("Το ρομπότ εκτελεί το πρόγραμμα!")};
 return <section className="pw2-play"><PlayHeader topic="ΗΛΙΚΙΑ 5–6 · ΥΠΟΛΟΓΙΣΤΙΚΗ ΣΚΕΨΗ" title="Προγραμμάτισε τον φίλο" desc="Φτιάξε μία σειρά από βελάκια για να φτάσει το ρομπότ στο αστέρι χωρίς εμπόδια."/>
 <div className="pw2-robot-stage"><div className="pw2-robot-map" role="group" aria-label="Πλέγμα τεσσάρων επί τεσσάρων">{Array.from({length:16},(_,i)=>{const r=Math.floor(i/4),c=i%4;const there=at[0]===r&&at[1]===c;const obstacle=OBSTACLES.some(([a,b])=>a===r&&b===c);const goal=r===3&&c===3;return <div key={i} className={"pw2-robot-tile "+(obstacle?"rock":"")+(goal?" destination":"")}><span aria-label={there?"Ρομπότ":obstacle?"Πέτρα":goal?"Αστέρι":undefined} className={there?"robot-moving":""}>{there?"🤖":obstacle?"🪨":goal?"⭐":""}</span></div>})}</div>
 <div className="pw2-robot-panel"><h3>Οι εντολές μου</h3><div className="pw2-robot-direction">{(["up","left","down","right"] as Direction[]).map(dir=><button type="button" key={dir} disabled={playing||commands.length>=12} aria-label={"Προσθήκη "+dir} onClick={()=>setCommands(v=>[...v,dir])}>{SYMBOLS[dir]}</button>)}</div><div className="pw2-command-queue" aria-label="Πρόγραμμα εντολών">{commands.length===0?<em>Εδώ θα μπουν τα βελάκια σου</em>:commands.map((d,i)=><span key={i}>{SYMBOLS[d]}</span>)}</div><div className="pw2-robot-buttons"><button type="button" disabled={playing||commands.length===0} onClick={()=>{reset(true);setCommands(v=>v.slice(0,-1))}}>Αναίρεση</button><button type="button" className="pw2-main-button" disabled={playing||commands.length===0} onClick={execute}>Εκτέλεση! <ArrowRight/></button></div><p className="pw2-robot-hint">Δοκίμασε: τρεις φορές δεξιά και τρεις φορές κάτω.</p></div></div>
 <div className="pw2-response" aria-live="polite" role="status">{status} {won?"🎉":""}</div><div className="pw2-play-actions"><button type="button" className="pw2-outline" onClick={()=>reset(false)}><RotateCcw/> Νέο πρόγραμμα</button><button type="button" className="pw2-main-button" disabled={commands.length===0||playing} onClick={execute}>Ξανά οι εντολές <Sparkles/></button></div>
 </section>;
}
export function StageAgeGame({age,ageKey}:{age:number;ageKey:string}){
 if(age<0||age>3)return null;
 return <div className="pw2-game-wrap"><div className="pw2-return"><Link to={"/pisipouk-v2-staging/ages/"+ageKey}><ArrowLeft size={19}/> Ο κόσμος μου</Link></div>{age===0?<BubblePlay/>:age===1?<ColorPlay/>:age===2?<BridgePlay/>:<RobotPlay/>}<p className="pw2-disclaimer">Δοκιμαστικό λειτουργικό gameplay. Τα τελικά 3D rigs, οι ειδικές φωνές και τα 19 επιπλέον παιχνίδια αυτής της ηλικίας δεν έχουν ολοκληρωθεί.</p></div>
}
