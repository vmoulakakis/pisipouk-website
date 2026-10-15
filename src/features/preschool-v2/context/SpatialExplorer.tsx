import {useState} from "react";
import {Link} from "@tanstack/react-router";
import {ArrowLeft,ArrowRight,Compass,MapPin,RotateCcw,Volume2} from "lucide-react";
import {PLACES,dayContext,type PlaceKey} from "../context/awareness";
import {useLearningContext} from "../context/useLearningContext";
import "./spatial.css";
const BOARD=[
 ["🏔️","🌲","🏘️","⛵"],
 ["🏞️","🐻","🌳","🏖️"],
 ["🌻","🫒","🐑","🐟"],
 ["🏡","🚜","🌾","🏝️"]
];
const directions=[[-1,0,"Πάνω","↑"],[1,0,"Κάτω","↓"],[0,-1,"Αριστερά","←"],[0,1,"Δεξιά","→"]] as const;
export function SpatialExplorer({age,ageKey}:{age:number;ageKey:string}){
 const {place,today}=useLearningContext();const context=dayContext(today,place);
 const [at,setAt]=useState<[number,number]>([1,1]);
 const [target,setTarget]=useState<PlaceKey>(place);
 const [feedback,setFeedback]=useState("Κοίτα τον χάρτη και βοήθησε τον Πισιπούκ να εξερευνήσει.");
 const selected=PLACES.find(p=>p.id===target)||PLACES[0];
 const [points,setPoints]=useState(0);
 const goal:[number,number]=target==="mountain"?[0,0]:target==="islands"?[3,3]:target==="city"?[0,2]:target==="countryside"?[2,1]:[1,0];
 const speak=()=>{if(typeof window==="undefined"||!("speechSynthesis" in window))return;const x=new SpeechSynthesisUtterance("Πήγαινε στον κόσμο: "+selected.name+". Δοκίμασε τα βελάκια. Πάνω, κάτω, δεξιά, αριστερά.");x.lang="el-GR";x.rate=.85;window.speechSynthesis.cancel();window.speechSynthesis.speak(x)};
 function move(dr:number,dc:number){
  const y=at[0]+dr,x=at[1]+dc;
  if(y<0||y>=4||x<0||x>=4){setFeedback("Εδώ τελειώνει ο χάρτης! Δοκίμασε άλλη κατεύθυνση.");return}
  setAt([y,x]);setFeedback(y===goal[0]&&x===goal[1]?"Μπράβο! Ανακάλυψες το μέρος. Διάλεξε άλλο τοπίο!":"Ποιο βήμα θα κάνεις μετά;");
  if(y===goal[0]&&x===goal[1])setPoints(p=>p+1);
 }
 const reset=()=>{setAt([1,1]);setFeedback("Επέλεξε τόπο και βρες τη διαδρομή.")};
 return <section className="pws-spatial">
  <Link to={"/pisipouk-v2-staging/ages/"+ageKey} className="pws-return"><ArrowLeft size={18}/> Ο κόσμος μου</Link>
  <header><span className="pw2-overline">ΧΩΡΙΚΟΣ ΠΡΟΣΑΝΑΤΟΛΙΣΜΟΣ · {["2–3","3–4","4–5","5–6"][age]} ΕΤΩΝ</span><h1><Compass/> Ο χάρτης των ανακαλύψεων</h1><p>Γνωρίζω τα τοπία της Ελλάδας, εξερευνώ κατευθύνσεις και εντοπίζω πού βρίσκονται αντικείμενα.</p></header>
  <div className="pws-place-tabs" role="group" aria-label="Τοποθεσίες εξερεύνησης">{PLACES.map(p=><button type="button" key={p.id} aria-pressed={p.id===target} className={p.id===target?"selected":""} onClick={()=>{setTarget(p.id);reset()}}><span>{p.icon}</span>{p.name}</button>)}</div>
  <div className="pws-layout">
   <div><div className="pws-map" role="group" aria-label="Εκπαιδευτικός φανταστικός χάρτης κατευθύνσεων">{BOARD.flatMap((row,r)=>row.map((emoji,c)=><div key={r+"-"+c} className={(goal[0]===r&&goal[1]===c?"goal ":"")+(at[0]===r&&at[1]===c?"bear":"")}><span>{at[0]===r&&at[1]===c?"🐻":emoji}</span>{goal[0]===r&&goal[1]===c&&!(at[0]===r&&at[1]===c)&&<small>🎯</small>}</div>))}</div><p className="pws-map-caption">Φανταστικός χάρτης παιχνιδιού · όχι γεωγραφική αποτύπωση της Ελλάδας.</p></div>
   <aside className="pws-side"><div className="pws-target"><span>{selected.icon}</span><h2>Προορισμός: {selected.name}</h2><p>{selected.note}</p><p><strong>Τοπίο:</strong> {selected.landscape}</p></div>
    <button type="button" className="pws-speak" onClick={speak}><Volume2 size={18}/> Άκου την οδηγία</button>
    <div className="pws-arrows">{directions.map(([dr,dc,name,arrow])=><button type="button" key={arrow} onClick={()=>move(dr,dc)} aria-label={name}><span>{arrow}</span>{name}</button>)}</div>
    <p className="pws-status" role="status" aria-live="polite">{feedback}</p>
    <button type="button" className="pws-reset" onClick={reset}><RotateCcw size={18}/> Ξεκινώ ξανά</button>
    <div className="pws-note"><MapPin size={18}/> {context.region.name} · {context.season}. Η πραγματική περιοχή επιλέγεται από ενήλικο στο ημερολόγιο, χωρίς GPS.</div>
   </aside>
  </div>
 </section>;
}
