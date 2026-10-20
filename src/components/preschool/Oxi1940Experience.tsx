import { useEffect, useRef, useState, type DragEvent, type PointerEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Download, MousePointer2, RotateCcw, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import "./oxi1940.css";

type Age = "little" | "big";
type Choice = { label: string; picture?: string; size?: "large" | "small" };
type Task =
  | { id: string; title: string; instruction: string; kind: "choice"; display?: string; choices: Choice[]; answer: number; lesson: string }
  | { id: string; title: string; instruction: string; kind: "sequence"; tokens: string[]; answer: string[]; lesson: string }
  | { id: string; title: string; instruction: string; kind: "sort"; tokens: { label: string; icon: string; side: 0 | 1 }[]; bins: [string, string]; lesson: string }
  | { id: string; title: string; instruction: string; kind: "trace"; lesson: string };

export const OXI_ASSETS = {
  little: { title: "Μικροί εξερευνητές", age: "2,5–3,5 ετών", canva: "https://www.canva.com/d/Af9o_qKGSzyZJOW", filename: "oxi-1940-2-5-3-5.pdf" },
  big: { title: "Μεγάλοι εξερευνητές", age: "4–6 ετών", canva: "https://www.canva.com/d/MIhXQfvj0kPD00Q", filename: "oxi-1940-4-6.pdf" },
} as const;

// Every challenge has a single verifiable solution. No timer, negative score or user tracking.
const LITTLE: Task[] = [
  { id:"l1", title:"Μετρώ τις σημαίες", instruction:"Πόσες σημαίες βλέπεις;",kind:"choice",display:"🇬🇷 🇬🇷",choices:[{label:"1"},{label:"2"},{label:"3"}],answer:1,lesson:"Αρίθμηση μέχρι το 3" },
  { id:"l2", title:"Τα περιστέρια της ειρήνης", instruction:"Μέτρησε τα περιστέρια.",kind:"choice",display:"🕊️ 🕊️ 🕊️",choices:[{label:"1"},{label:"2"},{label:"3"}],answer:2,lesson:"Αντιστοίχιση αριθμού και ποσότητας" },
  { id:"l3", title:"Βρίσκω τις ελιές", instruction:"Άγγιξε το κλαδί της ελιάς.",kind:"choice",choices:[{label:"Περιστέρι",picture:"🕊️"},{label:"Κλαδί ελιάς",picture:"🫒"},{label:"Σημαία",picture:"🇬🇷"}],answer:1,lesson:"Οπτική διάκριση" },
  { id:"l4", title:"Η γαλανόλευκη", instruction:"Πού είναι η ελληνική σημαία;",kind:"choice",choices:[{label:"Καρδιά",picture:"💙"},{label:"Σημαία",picture:"🇬🇷"},{label:"Καμπάνα",picture:"🔔"}],answer:1,lesson:"Αναγνώριση συμβόλων" },
  { id:"l5", title:"Το μεγάλο περιστέρι", instruction:"Διάλεξε το μεγάλο περιστέρι.",kind:"choice",choices:[{label:"Μεγάλο",picture:"🕊️",size:"large"},{label:"Μικρό",picture:"🕊️",size:"small"}],answer:0,lesson:"Μεγέθη" },
  { id:"l6", title:"Μικρή σημαία", instruction:"Διάλεξε τη μικρή σημαία.",kind:"choice",choices:[{label:"Μεγάλη",picture:"🇬🇷",size:"large"},{label:"Μικρή",picture:"🇬🇷",size:"small"}],answer:1,lesson:"Σύγκριση μεγέθους" },
  { id:"l7", title:"Συνέχισε το μοτίβο", instruction:"Σημαία, ελιά, σημαία… τι ακολουθεί;",kind:"choice",display:"🇬🇷 · 🫒 · 🇬🇷 · ❔",choices:[{label:"Ελιά",picture:"🫒"},{label:"Περιστέρι",picture:"🕊️"}],answer:0,lesson:"Απλό μοτίβο ΑΒ" },
  { id:"l8", title:"Από την Πίνδο", instruction:"Βρες το βουνό!",kind:"choice",choices:[{label:"Βουνό",picture:"🏔️"},{label:"Βάρκα",picture:"⛵"},{label:"Ήλιος",picture:"☀️"}],answer:0,lesson:"Λεξιλόγιο και παρατήρηση" },
  { id:"l9", title:"Τα σύμβολα της ειρήνης", instruction:"Βρες το περιστέρι.",kind:"choice",choices:[{label:"Λουλούδι",picture:"🌼"},{label:"Σημαία",picture:"🇬🇷"},{label:"Περιστέρι",picture:"🕊️"}],answer:2,lesson:"Παρατήρηση και αναγνώριση" },
  { id:"l10", title:"Το μεγάλο Ο", instruction:"Ποιο γράμμα αρχίζει τη λέξη ΟΧΙ;",kind:"choice",display:"ΟΧΙ",choices:[{label:"Ο"},{label:"Α"},{label:"Ε"}],answer:0,lesson:"Πρώιμη φωνολογική επίγνωση" },
  { id:"l11", title:"Βάλε στη σωστή θέση", instruction:"Μετακίνησε ή πάτησε κάθε εικόνα στη σωστή ομάδα.",kind:"sort",bins:["Σύμβολα ειρήνης","Σημαίες"],tokens:[{label:"Περιστέρι",icon:"🕊️",side:0},{label:"Σημαία",icon:"🇬🇷",side:1},{label:"Ελιά",icon:"🫒",side:0}],lesson:"Ταξινόμηση με drag & drop ή άγγιγμα" },
  { id:"l12", title:"Ζωγραφίζω το ΟΧΙ", instruction:"Με το δάχτυλο ή το ποντίκι ακολούθησε τη λέξη ΟΧΙ.",kind:"trace",lesson:"Προγραφή και λεπτή κινητικότητα" },
];

const BIG: Task[] = [
  { id:"b1",title:"Μετρώ τις σημαίες",instruction:"Μέτρησε και επίλεξε τον σωστό αριθμό.",kind:"choice",display:"🇬🇷 🇬🇷 🇬🇷 🇬🇷 🇬🇷 🇬🇷",choices:[{label:"5"},{label:"6"},{label:"7"}],answer:1,lesson:"Αρίθμηση μέχρι το 10" },
  { id:"b2",title:"Μετρώ τις ελιές",instruction:"Πόσες ελιές βλέπεις;",kind:"choice",display:"🫒 🫒 🫒 🫒\n🫒 🫒 🫒 🫒",choices:[{label:"7"},{label:"8"},{label:"9"}],answer:1,lesson:"Ποσότητες και αριθμοί" },
  { id:"b3",title:"Ποιο είναι περισσότερο;",instruction:"Τέσσερα περιστέρια και επτά σημαίες. Ποια είναι περισσότερα;",kind:"choice",display:"🕊️ 🕊️ 🕊️ 🕊️\n🇬🇷 🇬🇷 🇬🇷 🇬🇷 🇬🇷 🇬🇷 🇬🇷",choices:[{label:"Περιστέρια"},{label:"Σημαίες"},{label:"Είναι ίσα"}],answer:1,lesson:"Σύγκριση ποσοτήτων" },
  { id:"b4",title:"Το αρχικό γράμμα",instruction:"Με ποιο γράμμα αρχίζει η ΣΗΜΑΙΑ;",kind:"choice",display:"ΣΗΜΑΙΑ 🇬🇷",choices:[{label:"Π"},{label:"Σ"},{label:"Ο"}],answer:1,lesson:"Αρχικά γράμματα" },
  { id:"b5",title:"Το πρώτο γράμμα της ελιάς",instruction:"Διάλεξε το γράμμα που αρχίζει η ΕΛΙΑ.",kind:"choice",display:"ΕΛΙΑ 🫒",choices:[{label:"Ο"},{label:"Ε"},{label:"Α"}],answer:1,lesson:"Φωνολογική επίγνωση" },
  { id:"b6",title:"Γράφω το ΟΧΙ",instruction:"Πάτησε τα γράμματα με τη σωστή σειρά για να φτιάξεις το ΟΧΙ.",kind:"sequence",tokens:["Χ","Ι","Ο"],answer:["Ο","Χ","Ι"],lesson:"Ακολουθία γραμμάτων" },
  { id:"b7",title:"Η χρονολογία",instruction:"Βρες τη χρονολογία της επετείου του ΟΧΙ.",kind:"choice",choices:[{label:"1904"},{label:"1940"},{label:"1946"}],answer:1,lesson:"Αναγνώριση συμβόλων και αριθμητικής ακολουθίας" },
  { id:"b8",title:"Το μοτίβο της σημαίας",instruction:"Τι μπαίνει μετά;",kind:"choice",display:"🇬🇷 · 🕊️ · 🇬🇷 · 🕊️ · ❔",choices:[{label:"Σημαία",picture:"🇬🇷"},{label:"Ελιά",picture:"🫒"}],answer:0,lesson:"Επαναλαμβανόμενο μοτίβο ΑΒ" },
  { id:"b9",title:"Το μοτίβο της Πίνδου",instruction:"Τι λείπει από το μοτίβο;",kind:"choice",display:"🏔️ · 🔔 · 🫒 · 🏔️ · 🔔 · ❔",choices:[{label:"Ελιά",picture:"🫒"},{label:"Καμπάνα",picture:"🔔"},{label:"Βουνό",picture:"🏔️"}],answer:0,lesson:"Μοτίβο ΑΒΓ" },
  { id:"b10",title:"Ακούω τα νέα του 1940",instruction:"Ποιο αντικείμενο χρησιμοποιούσαν το 1940 για να ακούν ειδήσεις;",kind:"choice",choices:[{label:"Παλιό ραδιόφωνο",picture:"📻"},{label:"Tablet",picture:"📱"},{label:"Κινητό",picture:"☎️"}],answer:0,lesson:"Κατανόηση χρονικής εποχής" },
  { id:"b11",title:"Τότε και τώρα",instruction:"Ταξινόμησε τα αντικείμενα στην εποχή τους.",kind:"sort",bins:["1940","Σήμερα"],tokens:[{label:"Παλιό ραδιόφωνο",icon:"📻",side:0},{label:"Tablet",icon:"📱",side:1},{label:"Παλιά εφημερίδα",icon:"📰",side:0},{label:"Laptop",icon:"💻",side:1}],lesson:"Χρονολογική ταξινόμηση" },
  { id:"b12",title:"Ιχνογραφώ το ΟΧΙ",instruction:"Πέρασε με μολύβι ή ποντίκι πάνω από το ΟΧΙ και το 1940.",kind:"trace",lesson:"Προγραφή και συμβολισμός" },
];

function ChoiceActivity({ task, onFinish }: {task: Extract<Task,{kind:"choice"}>;onFinish:()=>void}) {
  const [selected,setSelected] = useState<number|null>(null);
  const correct=selected===task.answer;
  return <div className="oxi-task-body">
    {task.display && <div className="oxi-examples whitespace-pre-line" aria-label={task.display}>{task.display}</div>}
    <div className="oxi-answers" role="group" aria-label={task.instruction}>{task.choices.map((c,i)=><button type="button" key={i} disabled={correct} aria-pressed={selected===i} onClick={()=>setSelected(i)} className={`oxi-answer ${selected===i?(correct?"is-correct":"is-incorrect"):""}`}>
      {c.picture && <span aria-hidden="true" className={c.size==="large"?"oxi-big":c.size==="small"?"oxi-small":"oxi-icon"}>{c.picture}</span>}
      <span>{c.label}</span></button>)}</div>
    {selected!==null && <p aria-live="polite" className="oxi-feedback">{correct?"🌟 Μπράβο! Το βρήκες!":"Δοκίμασε άλλη μια φορά, είμαι εδώ!"}</p>}
    {correct && <button onClick={onFinish} className="oxi-next">Επόμενη δραστηριότητα <ArrowRight size={18}/></button>}
  </div>;
}
function SequenceActivity({task,onFinish}:{task:Extract<Task,{kind:"sequence"}>;onFinish:()=>void}){
  const [placed,setPlaced]=useState<string[]>([]);
  const correct=placed.join("")===task.answer.join("");
  const put=(letter:string,index:number)=>{if(placed.length===task.answer.length)return;setPlaced(v=>[...v,letter]);};
  return <div className="oxi-task-body"><div className="oxi-slots">{task.answer.map((_,i)=><div key={i} className="oxi-slot">{placed[i]??"_"}</div>)}</div><div className="oxi-answers">{task.tokens.map((item,i)=><button className="oxi-answer" disabled={placed.includes(item)} key={i} onClick={()=>put(item,i)}>{item}</button>)}</div><button className="oxi-reset" type="button" onClick={()=>setPlaced([])}><RotateCcw size={16}/> Ξανά</button>{placed.length===task.answer.length&&<p className="oxi-feedback" aria-live="polite">{correct?"🌟 Έγραψες σωστά το ΟΧΙ!":"Δοκίμασε ξανά με άλλη σειρά."}</p>}{correct&&<button className="oxi-next" onClick={onFinish}>Συνεχίζω <ArrowRight size={18}/></button>}</div>;
}
function SortActivity({task,onFinish}:{task:Extract<Task,{kind:"sort"}>;onFinish:()=>void}){
 const [placed,setPlaced]=useState<Record<string,number>>({});
 const [active,setActive]=useState<string|null>(null);
 const allDone=task.tokens.every((t)=>placed[t.label]!==undefined);
 const good=allDone&&task.tokens.every(t=>placed[t.label]===t.side);
 const assign=(label:string,bin:number)=>{setPlaced(v=>({...v,[label]:bin}));setActive(null);};
 const onDrop=(e:DragEvent<HTMLButtonElement>,bin:number)=>{e.preventDefault();const label=e.dataTransfer.getData("text/plain")||active;if(label&&task.tokens.some(t=>t.label===label))assign(label,bin);};
 return <div className="oxi-task-body"><p className="text-sm text-slate-600">Σύρε την εικόνα σε ένα κουτάκι ή πάτησέ την και μετά πάτησε την ομάδα.</p><div className="oxi-tiles">{task.tokens.map(t=><button key={t.label} type="button" draggable onClick={()=>setActive(t.label)} onDragStart={e=>{e.dataTransfer.setData("text/plain",t.label);setActive(t.label);}} aria-pressed={active===t.label} className={`oxi-tile ${active===t.label?"is-active":""}`}><span aria-hidden="true">{t.icon}</span>{t.label} {placed[t.label]!==undefined?"✓":""}</button>)}</div><div className="oxi-bins">{task.bins.map((bin,i)=><button type="button" key={bin} onDragOver={e=>e.preventDefault()} onDrop={e=>onDrop(e,i)} onClick={()=>{if(active)assign(active,i)}} className="oxi-bin"><b>{bin}</b><span>{task.tokens.filter(t=>placed[t.label]===i).map(t=>t.icon).join("  ")||"Ακούμπησε εδώ"}</span></button>)}</div>{allDone&&<p role="status" className="oxi-feedback">{good?"🌟 Ωραία ταξινόμηση!":"Κάποια εικόνα χρειάζεται άλλη θέση. Δοκίμασε ξανά."}</p>}<button type="button" onClick={()=>{setPlaced({});setActive(null)}} className="oxi-reset"><RotateCcw size={16}/> Από την αρχή</button>{good&&<button onClick={onFinish} className="oxi-next">Συνεχίζω <ArrowRight size={18}/></button>}</div>;
}
function TraceActivity({age,onFinish}:{age:Age;onFinish:()=>void}){
 const canvasRef=useRef<HTMLCanvasElement|null>(null);
 const down=useRef(false);
 const [strokes,setStrokes]=useState(0);
 const point=(event:PointerEvent<HTMLCanvasElement>)=>{const canvas=canvasRef.current;if(!canvas)return null;const rect=canvas.getBoundingClientRect();return {x:(event.clientX-rect.left)*canvas.width/rect.width,y:(event.clientY-rect.top)*canvas.height/rect.height};};
 const begin=(e:PointerEvent<HTMLCanvasElement>)=>{const p=point(e),canvas=canvasRef.current;if(!p||!canvas)return;down.current=true;e.currentTarget.setPointerCapture(e.pointerId);const c=canvas.getContext("2d");if(!c)return;c.beginPath();c.moveTo(p.x,p.y);c.lineWidth=12;c.lineJoin="round";c.lineCap="round";c.strokeStyle="#1368af";setStrokes(v=>v+1);};
 const move=(e:PointerEvent<HTMLCanvasElement>)=>{if(!down.current)return;const p=point(e),c=canvasRef.current?.getContext("2d");if(!p||!c)return;c.lineTo(p.x,p.y);c.stroke();};
 const finish=()=>{down.current=false;};
 return <div className="oxi-task-body"><div className="oxi-trace" aria-label={age==="big"?"Πέρασε με το ποντίκι επάνω από το ΟΧΙ και το 1940":"Πέρασε με το ποντίκι επάνω από το ΟΧΙ"}><div className="oxi-trace-guide">{age==="big"?"ΟΧΙ · 1940":"ΟΧΙ"}</div><canvas ref={canvasRef} width={900} height={320} onPointerDown={begin} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} style={{touchAction:"none"}} aria-label="Επιφάνεια ζωγραφικής με ποντίκι ή αφή" /></div><div className="oxi-trace-actions"><button className="oxi-reset" type="button" onClick={()=>{const canvas=canvasRef.current;canvas?.getContext("2d")?.clearRect(0,0,canvas.width,canvas.height);setStrokes(0)}}><RotateCcw size={16}/> Σβήσε και ξαναδοκίμασε</button><button className="oxi-next" type="button" disabled={strokes===0} onClick={onFinish}>Το ολοκλήρωσα <Check size={18}/></button></div></div>;
}
export function Oxi1940Hub(){
 return <SiteLayout><div className="oxi-root"><div className="oxi-wrap"><section className="oxi-hero"><span className="oxi-kicker">🎈 Ο ΠΙΣΙΠΟΥΚ • ΕΠΟΧΙΑΚΗ ΜΑΘΗΣΗ</span><h1>28η Οκτωβρίου 1940</h1><p className="oxi-hero-strong">Το «ΟΧΙ» γίνεται μια μικρή ιστορία μάθησης.</p><p>Γνωρίζουμε με σεβασμό το 1940, τη δύναμη της αλληλεγγύης και την αξία της ειρήνης. Επιλέξτε ηλικία για να παίξετε ή να ανοίξετε το εικονογραφημένο βιβλιαράκι.</p><div className="oxi-decor" aria-hidden="true">📰 ΟΧΙ &nbsp; 🇬🇷 &nbsp; 🏔️ &nbsp; 🕊️ &nbsp; 🫒</div></section><div className="oxi-grid">{(["little","big"] as const).map((age)=><AgeCard age={age} key={age}/>)}</div><p className="oxi-parent-note">👩‍🏫 Οι δραστηριότητες δεν καταγράφουν προσωπικά δεδομένα παιδιών και δεν χρησιμοποιούν βαθμολογία ή χρονόμετρο. Οι λήψεις από Canva γίνονται με καθοδήγηση ενήλικα.</p><Link to="/virtual-preschool" className="oxi-back"><ArrowLeft size={16}/> Επιστροφή στο Online Preschool</Link></div></div></SiteLayout>;
}
function AgeCard({age}:{age:Age}){
 const v=OXI_ASSETS[age];
 return <article className="oxi-card"><div className="oxi-card-art" aria-hidden="true"><span className="oxi-card-olive">🌿</span><span className="oxi-card-year">1940</span><span className="oxi-card-flag">🇬🇷</span><span className="oxi-card-village">🏔️ 🕊️</span></div><div className="oxi-card-content"><span className="oxi-age">{v.age}</span><h2>{v.title}</h2><p>{age==="little"?"Μεγάλα σύμβολα, μετρήματα μέχρι το 3, απλές επιλογές, μοτίβα και πρώτο drag & drop.":"Μέτρημα μέχρι το 10, γράμματα της λέξης ΟΧΙ, μοτίβα, συγκρίσεις, ιστορικά αντικείμενα και ταξινόμηση."}</p><a className="oxi-primary" href={age==="little"?"/october-1940-young":"/october-1940-older"}><MousePointer2 size={18}/> Παίζω διαδραστικά <ArrowRight size={17}/></a><a href={v.canva} target="_blank" rel="noopener noreferrer" className="oxi-secondary"><Download size={18}/> Άνοιγμα PDF μέσω Canva</a><small>Στο Canva: «Κοινή χρήση» → «Λήψη» → «PDF για εκτύπωση».</small></div></article>;
}
export function Oxi1940Game({age}:{age:Age}){
 const tasks=age==="little"?LITTLE:BIG; const info=OXI_ASSETS[age];
 const [index,setIndex]=useState(0);const task=tasks[index];
 const onFinish=()=>setIndex(v=>Math.min(v+1,tasks.length));
 const done=index>=tasks.length;
 return <SiteLayout><div className="oxi-root"><div className="oxi-wrap oxi-play"><div className="oxi-toolbar"><Link to="/october-1940" className="oxi-back"><ArrowLeft size={16}/> Και οι δύο ηλικίες</Link><span className="oxi-age">{info.age}</span></div><h1>28η Οκτωβρίου 1940</h1><p>Διαδραστικές δραστηριότητες για {info.age}. Δοκίμασε με ποντίκι, αφή ή drag & drop!</p><div className="oxi-progress"><span>{done?"Ολοκλήρωση":`Δραστηριότητα ${index+1} από ${tasks.length}`}</span><div role="progressbar" aria-valuenow={index} aria-valuemin={0} aria-valuemax={tasks.length} aria-label="Πρόοδος δραστηριοτήτων"><div style={{width:`${100*index/tasks.length}%`}}/></div></div>{done?<section className="oxi-task-card oxi-celebrate"><div className="text-7xl" aria-hidden="true">🎉</div><h2>Μπράβο για την προσπάθειά σου!</h2><p>Γνώρισες την 28η Οκτωβρίου 1940 μέσα από το παιχνίδι.</p><button className="oxi-primary" onClick={()=>setIndex(0)}><RotateCcw size={18}/> Παίζω ξανά</button><a href={info.canva} className="oxi-secondary" target="_blank" rel="noopener noreferrer"><Download size={18}/> Εκτυπώσιμο βιβλιαράκι στο Canva</a></section>:<section className="oxi-task-card" key={task.id}><div className="oxi-task-head"><span className="oxi-kicker">🕊️ 28Η ΟΚΤΩΒΡΙΟΥ • ΕΛΛΑΔΑ 1940</span><h2>{task.title}</h2><p>{task.instruction}</p><small>Καλλιεργώ: {task.lesson}</small></div>{task.kind==="choice"&&<ChoiceActivity task={task} onFinish={onFinish}/ >}{task.kind==="sequence"&&<SequenceActivity task={task} onFinish={onFinish}/ >}{task.kind==="sort"&&<SortActivity task={task} onFinish={onFinish}/ >}{task.kind==="trace"&&<TraceActivity age={age} onFinish={onFinish}/>}</section>}<p className="oxi-parent-note">Για το παιδί: δοκίμασε ελεύθερα. Για τον ενήλικα: μιλήστε με απλά λόγια για το «ΟΧΙ», την αλληλεγγύη και την ειρήνη. Δεν υπάρχουν ποινές ή ανταγωνισμός.</p></div></div></SiteLayout>;
}