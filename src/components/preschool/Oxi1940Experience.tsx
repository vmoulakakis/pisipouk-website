import { useEffect, useRef, useState, type DragEvent, type PointerEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Download, MousePointer2, RotateCcw } from "lucide-react";
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
  little: { title: "Μικροί εξερευνητές", age: "2,5–3,5 ετών", canva: "https://www.canva.com/d/Af9o_qKGSzyZJOW", filename: "oxi-1940-2-5-3-5.pdf", pdf: "/printables/oxi-1940-2-5-3-5.pdf" },
  big: { title: "Μεγάλοι εξερευνητές", age: "4–6 ετών", canva: "https://www.canva.com/d/MIhXQfvj0kPD00Q", filename: "oxi-1940-4-6.pdf", pdf: "/printables/oxi-1940-4-6.pdf" },
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
  const put=(letter:string)=>{if(placed.length===task.answer.length)return;setPlaced(v=>[...v,letter]);};
  return <div className="oxi-task-body"><div className="oxi-slots">{task.answer.map((_,i)=><div key={i} className="oxi-slot">{placed[i]??"_"}</div>)}</div><div className="oxi-answers">{task.tokens.map((item,i)=><button className="oxi-answer" disabled={placed.includes(item)} key={i} onClick={()=>put(item)}>{item}</button>)}</div><button className="oxi-reset" type="button" onClick={()=>setPlaced([])}><RotateCcw size={16}/> Ξανά</button>{placed.length===task.answer.length&&<p className="oxi-feedback" aria-live="polite">{correct?"🌟 Έγραψες σωστά το ΟΧΙ!":"Δοκίμασε ξανά με άλλη σειρά."}</p>}{correct&&<button className="oxi-next" onClick={onFinish}>Συνεχίζω <ArrowRight size={18}/></button>}</div>;
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
function OxiHeritageArt({age}:{age:Age}){
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 310" role="img" aria-label="Εικονογραφημένο τοπίο: ορεινή Ελλάδα 1940, χωριό της Πίνδου, εφημερίδα ΟΧΙ και ελληνική σημαία" preserveAspectRatio="xMidYMid slice" style={{width:"100%",height:"100%",display:"block"}}>
    <defs><linearGradient id={age+"-sky"} x1="0" x2="0" y1="0" y2="1"><stop stopColor="#b5d9f2"/><stop offset="1" stopColor="#eef6e9"/></linearGradient><linearGradient id={age+"-paper"}><stop stopColor="#e8d6ad"/><stop offset="1" stopColor="#fff1d1"/></linearGradient></defs>
    <rect width="700" height="310" fill={`url(#${age}-sky)`}/>
    <circle cx="574" cy="49" r="30" fill="#fff8d5" opacity=".85"/>
    <path d="M0 205L85 118L125 156L220 48L318 176L404 92L510 192L617 110L700 206Z" fill="#819fb0"/>
    <path d="M0 210L85 143L125 173L220 66L318 193L404 109L510 206L617 124L700 216Z" fill="#577b8d"/>
    <path d="M165 119L220 66L263 121L235 105L220 116L207 103Z M371 139L404 109L441 146L410 135L398 142Z M590 158L617 124L643 159L625 148Z" fill="#f7fbfc"/>
    <path d="M0 238Q133 169 255 231Q422 165 570 224Q629 205 700 213L700 310L0 310Z" fill="#5a766c"/>
    <path d="M0 273Q202 229 359 265Q504 228 700 243L700 310L0 310Z" fill="#8ca18a"/>
    {[[110,214,84],[312,196,71],[457,223,80]].map(([x,y,w],i)=><g key={i}><rect x={x} y={y} width={w} height="78" fill="#d4c39c" stroke="#8d7a5d" strokeWidth="3"/><path d={`M${x-8} ${y}L${x+w/2} ${y-39}L${x+w+8} ${y}Z`} fill="#a56c4f" stroke="#7d5a49" strokeWidth="3"/><rect x={x+14} y={y+22} width="19" height="24" rx="4" fill="#5e7684"/><path d={`M${x+w-29} ${y+78}V${y+38}Q${x+w-18} ${y+24} ${x+w-8} ${y+38}V${y+78}`} fill="#7e705e"/><path d={`M${x} ${y+48}h${w} M${x+w/2} ${y}v78`} stroke="#ac9b79" opacity=".45"/></g>)}
    <g transform="translate(16 26) rotate(-5 87 95)"><rect x="0" y="0" width="174" height="164" rx="3" fill={`url(#${age}-paper)`} stroke="#baa880" strokeWidth="3"/><path d="M12 13h149M12 31h149M12 133h149M12 147h120" stroke="#877d69" strokeWidth="2" opacity=".5"/><text x="87" y="27" textAnchor="middle" fill="#5a5348" fontSize="13" fontWeight="bold">28 ΟΚΤΩΒΡΙΟΥ 1940</text><text x="87" y="107" textAnchor="middle" fill="#23394b" fontSize="71" fontWeight="900">ΟΧΙ</text><text x="87" y="123" textAnchor="middle" fill="#3e4d54" fontSize="11">Η ΕΛΛΑΔΑ ΤΟΥ 1940</text></g>
    <g transform="translate(537 30)"><rect x="9" y="5" width="5" height="225" rx="2" fill="#776753"/><rect x="14" y="8" width="145" height="90" fill="#1d58a0"/>{[1,3,5,7].map(i=><rect key={i} x="14" y={8+i*10} width="145" height="10" fill="white"/>)}<rect x="14" y="8" width="56" height="50" fill="#1d58a0"/><path d="M42 8v50M14 33h56" stroke="white" strokeWidth="9"/></g>
    <g fill="#426945"><path d="M0 306Q84 269 155 307M515 309Q620 253 700 293" stroke="#665f3f" strokeWidth="9" fill="none"/>{Array.from({length:8},(_,i)=><g key={i}><ellipse cx={20+i*20} cy={304-i%3*7} rx="13" ry="6" transform={`rotate(-35 ${20+i*20} ${304-i%3*7})`}/><ellipse cx={520+i*22} cy={305-i%3*7} rx="13" ry="6" transform={`rotate(30 ${520+i*22} ${305-i%3*7})`}/></g>)}</g>
    <text x="352" y="302" fontSize="14" textAnchor="middle" fill="#fff" fontWeight="900">ΠΙΝΔΟΣ · 1940</text>
  </svg>;
}
function AgeCard({age}:{age:Age}){
 const v=OXI_ASSETS[age];
 const [pdfAvailable,setPdfAvailable]=useState(false);
 useEffect(()=>{let active=true;fetch(v.pdf,{method:"HEAD"}).then(r=>{if(active&&r.ok&&(r.headers.get("content-type")??"").includes("application/pdf"))setPdfAvailable(true)}).catch(()=>{});return()=>{active=false}},[v.pdf]);
 return <article className="oxi-card"><div className="oxi-card-art"><OxiHeritageArt age={age}/></div><div className="oxi-card-content"><span className="oxi-age">{v.age}</span><h2>{v.title}</h2><p>{age==="little"?"Μεγάλα σύμβολα, μετρήματα μέχρι το 3, απλές επιλογές, μοτίβα και πρώτο drag & drop.":"Μέτρημα μέχρι το 10, γράμματα της λέξης ΟΧΙ, μοτίβα, συγκρίσεις, ιστορικά αντικείμενα και ταξινόμηση."}</p><a className="oxi-primary" href={age==="little"?"/october-1940-young":"/october-1940-older"}><MousePointer2 size={18}/> Παίζω διαδραστικά <ArrowRight size={17}/></a><a href={pdfAvailable?v.pdf:v.canva} download={pdfAvailable?v.filename:undefined} target={pdfAvailable?undefined:"_blank"} rel={pdfAvailable?undefined:"noopener noreferrer"} className="oxi-secondary"><Download size={18}/> {pdfAvailable?"Κατέβασε PDF Α4":"Άνοιξε το βιβλιαράκι Canva"}</a><small>{pdfAvailable?"Αυθεντικό, εκτυπώσιμο PDF σε μέγεθος Α4.":"Όταν δημοσιευθεί το PDF στον ιστότοπο, το κουμπί θα γίνει αυτόματα απευθείας λήψη. Προς το παρόν: Canva → Κοινή χρήση → Λήψη → PDF για εκτύπωση."}</small></div></article>;
}
export function Oxi1940Game({age}:{age:Age}){
 const tasks=age==="little"?LITTLE:BIG; const info=OXI_ASSETS[age];
 const [index,setIndex]=useState(0);const task=tasks[index];
 const onFinish=()=>setIndex(v=>Math.min(v+1,tasks.length));
 const done=index>=tasks.length;
 return <div className="oxi-root"><div className="oxi-wrap oxi-play"><div className="oxi-toolbar"><Link to="/october-1940" className="oxi-back"><ArrowLeft size={16}/> Και οι δύο ηλικίες</Link><span className="oxi-age">{info.age}</span></div><h1>28η Οκτωβρίου 1940</h1><p>Διαδραστικές δραστηριότητες για {info.age}. Δοκίμασε με ποντίκι, αφή ή drag & drop!</p><div className="oxi-progress"><span>{done?"Ολοκλήρωση":`Δραστηριότητα ${index+1} από ${tasks.length}`}</span><div role="progressbar" aria-valuenow={index} aria-valuemin={0} aria-valuemax={tasks.length} aria-label="Πρόοδος δραστηριοτήτων"><div style={{width:`${100*index/tasks.length}%`}}/></div></div>{done?<section className="oxi-task-card oxi-celebrate"><div className="text-7xl" aria-hidden="true">🎉</div><h2>Μπράβο για την προσπάθειά σου!</h2><p>Γνώρισες την 28η Οκτωβρίου 1940 μέσα από το παιχνίδι.</p><button className="oxi-primary" onClick={()=>setIndex(0)}><RotateCcw size={18}/> Παίζω ξανά</button><a href={info.canva} className="oxi-secondary" target="_blank" rel="noopener noreferrer"><Download size={18}/> Εκτυπώσιμο βιβλιαράκι στο Canva</a></section>:<section className="oxi-task-card" key={task.id}><div className="oxi-task-head"><span className="oxi-kicker">🕊️ 28Η ΟΚΤΩΒΡΙΟΥ • ΕΛΛΑΔΑ 1940</span><h2>{task.title}</h2><p>{task.instruction}</p><small>Καλλιεργώ: {task.lesson}</small></div>{task.kind==="choice"&&<ChoiceActivity task={task} onFinish={onFinish}/ >}{task.kind==="sequence"&&<SequenceActivity task={task} onFinish={onFinish}/ >}{task.kind==="sort"&&<SortActivity task={task} onFinish={onFinish}/ >}{task.kind==="trace"&&<TraceActivity age={age} onFinish={onFinish}/>}</section>}<p className="oxi-parent-note">Για το παιδί: δοκίμασε ελεύθερα. Για τον ενήλικα: μιλήστε με απλά λόγια για το «ΟΧΙ», την αλληλεγγύη και την ειρήνη. Δεν υπάρχουν ποινές ή ανταγωνισμός.</p></div></div>;
}