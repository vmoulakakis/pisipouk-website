import { useMemo, useState } from "react";
import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import type { V15Age } from "./v15/Games";
import "./preschool-v17-games.css";
type Activity="patterns"|"count"|"feelings"|"habitat"|"story"|"sizes";
export const DISCOVERY_GAMES:{id:Activity;title:string;skill:string;ages:V15Age[];icon:string;scene:string}[]=[
{id:"patterns",title:"Η γιρλάντα των χρωμάτων",skill:"Μοτίβα & λογική",ages:["3-4","4-5","5-6"],icon:"🌈",scene:"🪄"},
{id:"count",title:"Τα μήλα στο καλαθάκι",skill:"Αρίθμηση & ποσότητες",ages:["2-3","3-4","4-5","5-6"],icon:"🍎",scene:"🧺"},
{id:"feelings",title:"Πώς νιώθει ο φίλος μας;",skill:"Συναισθηματική κατανόηση",ages:["3-4","4-5","5-6"],icon:"💛",scene:"🐻"},
{id:"habitat",title:"Το σπίτι των ζώων",skill:"Φύση & συσχετισμοί",ages:["2-3","3-4","4-5","5-6"],icon:"🌲",scene:"🏕️"},
{id:"story",title:"Φτιάχνω μια μικρή ιστορία",skill:"Γλώσσα & αφήγηση",ages:["4-5","5-6"],icon:"📚",scene:"🌠"},
{id:"sizes",title:"Μικρό, μεσαίο, μεγάλο",skill:"Σύγκριση μεγεθών",ages:["2-3","3-4","4-5"],icon:"🪆",scene:"🏡"},
];
const patterns=["🔴","🟡","🔴","🟡"];
const questions:{[k in Activity]:{prompt:string;options:string[];answer:string;explain:string;offline:string}}={
 patterns:{prompt:"Ποιο χρώμα συνεχίζει το μοτίβο;",options:["🟢","🔴","🟡"],answer:"🔴",explain:"Εναλλάσσουμε κόκκινο και κίτρινο! Μπορείς να φτιάξεις νέο μοτίβο;",offline:"Φτιάξε ένα μοτίβο με χρωματιστά αντικείμενα στο σπίτι."},
 count:{prompt:"Βάλε 3 μήλα στο καλάθι!",options:["🍎","🍐","🍋"],answer:"🍎",explain:"Τρία μήλα! Μέτρα δυνατά μαζί με έναν μεγάλο.",offline:"Μέτρησε τρία ασφαλή αντικείμενα στην κουζίνα."},
 feelings:{prompt:"Ο φίλος έχασε το αγαπημένο του παιχνίδι. Πώς μπορεί να νιώθει;",options:["😢","😴","🥳"],answer:"😢",explain:"Μπορεί να είναι λυπημένος. Τι θα μπορούσαμε να του πούμε;",offline:"Δείξτε με τα πρόσωπά σας τρία διαφορετικά συναισθήματα."},
 habitat:{prompt:"Πού ζει συνήθως το ψαράκι;",options:["🌳","🌊","🏜️"],answer:"🌊",explain:"Στο νερό! Τι άλλα ζώα ζουν εκεί;",offline:"Ζωγράφισε ένα ζώο στο δικό του περιβάλλον."},
 story:{prompt:"Το μικρό αρκουδάκι βρήκε μια πόρτα. Τι θα συναντήσει;",options:["🌈","🐱","🚀"],answer:"",explain:"Υπέροχη ιδέα! Συνέχισε την ιστορία με τον δικό σου τρόπο.",offline:"Πες την ιστορία σου σε έναν μεγάλο και ζωγραφίστε το τέλος."},
 sizes:{prompt:"Ποιο από τα τρία είναι το μεγαλύτερο;",options:["●","●●","●●●"],answer:"●●●",explain:"Το βρήκες! Το μεγαλύτερο έχει περισσότερο χώρο.",offline:"Βρείτε τρία αντικείμενα διαφορετικών μεγεθών."}
};
export function DiscoveryGames({age,onClose}:{age:V15Age;onClose:()=>void}){
 const available=useMemo(()=>DISCOVERY_GAMES.filter(g=>g.ages.includes(age)),[age]);
 const [active,setActive]=useState<Activity|null>(null),[picked,setPicked]=useState<string|null>(null),[count,setCount]=useState(0);
 const [round,setRound]=useState(0);
 const choose=(v:string)=>{
  if(!active)return;
  if(active==="count"){if(v==="🍎")setCount(n=>Math.min(3,n+1));else setPicked(v);return;}
  setPicked(v);
 };
 const finish=active==="count"?count===3:!!picked&&(questions[active].answer===""||picked===questions[active].answer);
 const retry=()=>{setPicked(null);setCount(0);setRound(r=>r+1)};
 const close=()=>{setActive(null);retry()};
 return <div className="pw17-discovery">
 {!active?<>
 <div className="pw17-game-intro"><span>✨ 6 μικρά παιχνιδοεργαστήρια</span><h2>Μαθαίνω παίζοντας</h2><p>Διαλέγω, δοκιμάζω και ξαναπροσπαθώ. Χωρίς βαθμούς και χρονόμετρα.</p></div>
 <div className="pw17-discovery-grid">{available.map(g=><button key={g.id} className="pw17-discovery-card" onClick={()=>{setActive(g.id);retry()}}><span className="pw17-discovery-art"><span>{g.scene}</span><i>{g.icon}</i></span><b>{g.title}</b><small>{g.skill}</small><strong>Παίζω →</strong></button>)}</div>
 </>:<div className="pw17-play-stage" key={active+"-"+round}>
 <button className="pw17-stage-back" onClick={close}><ArrowLeft size={17}/> Παιχνίδια</button>
 <div className="pw17-stage-landscape" aria-hidden="true"><span>☁️</span><span>✦</span><span>🌿</span></div>
 <div className="pw17-stage-panel"><span className="pw17-stage-kicker"><Sparkles size={16}/> {DISCOVERY_GAMES.find(g=>g.id===active)?.skill}</span>
 <h2>{DISCOVERY_GAMES.find(g=>g.id===active)?.title}</h2>
 <p className="pw17-stage-prompt">{questions[active].prompt}</p>
 {active==="patterns"&&<div className="pw17-pattern-strip">{patterns.map((p,i)=><span key={i}>{p}</span>)}<span>❔</span></div>}
 {active==="count"&&<div className="pw17-count-tray"><span>🧺</span><span>{Array.from({length:count},()=> "🍎").join(" ")||"Βάλε τα μήλα!"}</span><b>{count} / 3</b></div>}
 <div className="pw17-choice-grid">{questions[active].options.map(o=><button key={o} disabled={finish} onClick={()=>choose(o)} className={picked===o?"chosen":""} aria-label={"Επιλογή "+o}>{o}</button>)}</div>
 {picked&&!finish&&<p className="pw17-gentle-hint">Ας δοκιμάσουμε κάτι άλλο. Μπορείς! 🌱</p>}
 {finish&&<div className="pw17-success"><strong>✨ Μια όμορφη ανακάλυψη!</strong><p>{questions[active].explain}</p><div className="pw17-offline"><b>Παίζουμε και εκτός οθόνης:</b> {questions[active].offline}</div><button onClick={retry}><RotateCcw size={17}/> Παίζω ξανά</button></div>}
 </div></div>}
 <div className="pw17-discovery-footer"><button onClick={onClose}>← Επιστροφή στον κόσμο του Πισιπούκ</button></div>
 </div>;
}