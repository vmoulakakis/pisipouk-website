import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Download, Printer, RotateCcw, Volume2 } from "lucide-react";

export const Route = createFileRoute("/virtual-preschool/november-17-activities")({
  head: () => ({ meta: [{ title: "17 Νοεμβρίου • 8 δημιουργικές δραστηριότητες | Πισιπούκ" }, { name: "description", content: "Δωρεάν δραστηριότητες για το Πολυτεχνείο 3–6 ετών: αντιστοίχιση, κατανόηση, ζωγραφική, ειρήνη, ραδιόφωνο και κατασκευές." }] }),
  component: NovemberActivities,
});

const activities = [
  ["🎶","Τραγουδώ για την ειρήνη","Γλώσσα • 3–6 ετών"],
  ["🕊️","Ενώνω τις ίδιες εικόνες","Οπτική διάκριση • 3–6 ετών"],
  ["📻","Μαθαίνω την ιστορία","Κατανόηση • 4–6 ετών"],
  ["🕊️","Το περιστέρι μου","Ζωγραφική • 3–6 ετών"],
  ["☮️","Το σήμα της ειρήνης","Ζωγραφική • 3–6 ετών"],
  ["📻","Αν είχα ραδιόφωνο","Προφορική έκφραση • 4–6 ετών"],
  ["📣","Τα δικά μου συνθήματα","Δημιουργικότητα • 4–6 ετών"],
  ["🌺","Κόβω και κατασκευάζω","Λεπτή κινητικότητα • 3–6 ετών"],
] as const;
const symbols = [
  { id:"dove", icon:"🕊️", name:"Περιστέρι" },
  { id:"flower", icon:"🌺", name:"Γαρίφαλο" },
  { id:"flag", icon:"🇬🇷", name:"Σημαία" },
  { id:"olive", icon:"🌿", name:"Κλαδί ελιάς" },
  { id:"school", icon:"🏛️", name:"Πολυτεχνείο" },
];
const questions = [
  {q:"Πού συγκεντρώθηκαν οι φοιτητές;",opts:["Στο Πολυτεχνείο","Στο σπίτι"],ans:0,icons:["🏛️","🏠"]},
  {q:"Πώς έστειλαν τη φωνή τους;",opts:["Με ραδιοφωνικό σταθμό","Με τηλεόραση"],ans:0,icons:["📻","📺"]},
  {q:"Τι έλεγαν στο ραδιόφωνο;",opts:["Τα μηνύματά τους","Μόνο μουσική"],ans:0,icons:["🎙️","🎵"]},
  {q:"Τι ζητούσαν;",opts:["Ψωμί, Παιδεία, Ελευθερία","Περισσότερα παιχνίδια"],ans:0,icons:["📚","🧸"]},
  {q:"Τι σημαίνει να ακούμε τους άλλους;",opts:["Σεβασμός","Να μη μιλά κανείς"],ans:0,icons:["🤝","🙊"]},
  {q:"Πώς θυμόμαστε το Πολυτεχνείο;",opts:["Με σεβασμό στη δημοκρατία","Ξεχνώντας την ιστορία"],ans:0,icons:["🌺","❌"]},
];
function hear(text:string){if(typeof window==="undefined"||!("speechSynthesis" in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="el-GR";u.rate=.85;window.speechSynthesis.speak(u)}
function ArtCanvas({kind}:{kind:"dove"|"peace"|"free"}){
 const ref=useRef<HTMLCanvasElement>(null);
 const down=useRef(false);
 const [color,setColor]=useState("#ef476f");
 const [width,setWidth]=useState(9);
 const [version,setVersion]=useState(0);
 useEffect(()=>{const c=ref.current;if(!c)return;const ctx=c.getContext("2d");if(!ctx)return;ctx.fillStyle="#fff";ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle="#222";ctx.lineWidth=6;ctx.lineJoin="round";ctx.lineCap="round";if(kind==="dove"){ctx.beginPath();ctx.moveTo(170,320);ctx.bezierCurveTo(80,240,100,170,150,135);ctx.bezierCurveTo(215,162,235,230,285,234);ctx.bezierCurveTo(340,205,376,220,389,265);ctx.bezierCurveTo(445,286,414,331,372,326);ctx.bezierCurveTo(328,394,255,405,213,367);ctx.bezierCurveTo(164,391,119,375,107,354);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(356,264,5,0,7);ctx.fillStyle="#222";ctx.fill();ctx.beginPath();ctx.moveTo(391,270);ctx.lineTo(458,229);ctx.moveTo(430,242);ctx.lineTo(433,215);ctx.moveTo(446,235);ctx.lineTo(472,232);ctx.stroke();}if(kind==="peace"){ctx.beginPath();ctx.arc(260,260,175,0,Math.PI*2);ctx.moveTo(260,85);ctx.lineTo(260,435);ctx.moveTo(260,262);ctx.lineTo(136,384);ctx.moveTo(260,262);ctx.lineTo(384,384);ctx.stroke();}},[kind,version]);
 const position=(e:React.PointerEvent<HTMLCanvasElement>)=>{const r=e.currentTarget.getBoundingClientRect();return {x:(e.clientX-r.left)*520/r.width,y:(e.clientY-r.top)*520/r.height}};
 const stroke=(e:React.PointerEvent<HTMLCanvasElement>,first:boolean)=>{const ctx=ref.current?.getContext("2d");if(!ctx)return;const p=position(e);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap="round";ctx.lineJoin="round";if(first){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+.1,p.y+.1);ctx.stroke()}else{ctx.lineTo(p.x,p.y);ctx.stroke()}};
 const download=()=>{const a=document.createElement("a");a.download="pisipouk-17-noemvriou-zografia.png";a.href=ref.current?.toDataURL("image/png")||"";a.click()};
 return <div className="rounded-3xl bg-white p-4 shadow-lg">
  <div className="mb-4 flex flex-wrap items-center justify-center gap-3"><span className="font-bold">Διάλεξε χρώμα:</span>{["#ef476f","#ffb703","#219ebc","#43aa8b","#8338ec","#222"].map(c=><button key={c} type="button" aria-label={"Χρώμα "+c} aria-pressed={color===c} onClick={()=>setColor(c)} style={{background:c,width:40,height:40,borderRadius:"50%",border:color===c?"4px solid #111":"3px solid white",boxShadow:"0 0 0 1px #ccc"}}/>)}<label className="font-bold">Πινέλο <input type="range" min="4" max="26" value={width} onChange={e=>setWidth(Number(e.target.value))}/></label></div>
  <canvas ref={ref} width={520} height={520} aria-label="Διαδραστικό χαρτί ζωγραφικής" role="img" className="mx-auto w-full max-w-[520px] rounded-2xl border-4 border-amber-200 bg-white" style={{touchAction:"none"}} onPointerDown={e=>{down.current=true;e.currentTarget.setPointerCapture(e.pointerId);stroke(e,true)}} onPointerMove={e=>{if(down.current)stroke(e,false)}} onPointerUp={()=>down.current=false} onPointerCancel={()=>down.current=false}/>
  <div className="mt-4 flex flex-wrap justify-center gap-3"><button className="rounded-full bg-sky-100 px-5 py-3 font-bold" onClick={download}><Download className="mr-2 inline size-5"/>Αποθήκευση PNG</button><button className="rounded-full bg-orange-100 px-5 py-3 font-bold" onClick={()=>setVersion(v=>v+1)}><RotateCcw className="mr-2 inline size-5"/>Από την αρχή</button></div>
 </div>
}
function Matching(){
 const [chosen,setChosen]=useState<string|null>(null);const [done,setDone]=useState<string[]>([]);const [message,setMessage]=useState("Βρες δύο ίδιες εικόνες.");
 const right=[symbols[2],symbols[4],symbols[0],symbols[1],symbols[3]];
 return <><p className="mb-5 text-center text-lg">Άγγιξε μια εικόνα αριστερά και μετά την ίδια δεξιά. Μπορείς να δοκιμάσεις ξανά!</p><div className="grid grid-cols-2 gap-5">{[symbols,right].map((side,i)=><div className="grid gap-3" key={i}>{side.map(s=><button disabled={done.includes(s.id)} aria-pressed={i===0&&chosen===s.id} key={s.id} className={"min-h-24 rounded-3xl border-4 p-3 text-center text-lg font-bold "+(done.includes(s.id)?"border-green-400 bg-green-100":i===0&&chosen===s.id?"border-amber-500 bg-amber-100":"border-sky-100 bg-white")} onClick={()=>{if(i===0){setChosen(s.id);setMessage("Τώρα βρες την ίδια εικόνα δεξιά.");}else if(chosen===s.id){setDone(a=>[...a,s.id]);setChosen(null);setMessage("Μπράβο! Βρήκες ένα ζευγάρι.");}else{setMessage("Δοκίμασε άλλη εικόνα. Δεν πειράζει!");}}}><span className="block text-5xl" aria-hidden="true">{s.icon}</span>{s.name}</button>)}</div>)}</div><p role="status" className="mt-4 rounded-2xl bg-amber-100 p-4 text-center font-bold">{done.length===5?"Τα βρήκες όλα! 🌟":message}</p><button className="mt-3 rounded-full bg-white px-5 py-3 font-bold" onClick={()=>{setDone([]);setChosen(null);setMessage("Πάμε ξανά!")}}>Παίζω ξανά</button></>
}
function Quiz(){
 const [n,setN]=useState(0);const [answer,setAnswer]=useState<number|null>(null);const q=questions[n];const correct=answer===q.ans;
 return <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-xl"><p className="font-bold text-violet-700">Ερώτηση {n+1} από {questions.length}</p><div className="my-3 h-3 overflow-hidden rounded-full bg-sky-100"><div className="h-full bg-violet-500" style={{width:((n+1)/questions.length*100)+"%"}}/></div><h3 className="my-7 text-center text-2xl font-black">{q.q}</h3><button className="mb-5 rounded-full bg-sky-100 px-4 py-2 font-bold" onClick={()=>hear(q.q)}><Volume2 className="mr-2 inline size-5"/>Άκου την ερώτηση</button><div className="grid gap-4 sm:grid-cols-2">{q.opts.map((a,i)=><button key={i} onClick={()=>setAnswer(i)} className={"min-h-40 rounded-3xl border-4 p-4 text-lg font-bold "+(answer===i?"border-amber-500 bg-amber-50":"border-sky-100")}><span className="mb-3 block text-6xl" aria-hidden="true">{q.icons[i]}</span>{a}</button>)}</div><p className="my-5 text-center font-bold" role="status">{answer===null?"Διάλεξε μια εικόνα.":correct?"Πολύ ωραία! Ας συνεχίσουμε. 🌟":"Κοίτα τις εικόνες και δοκίμασε ξανά."}</p>{correct&&<button className="w-full rounded-full bg-violet-600 px-6 py-4 font-black text-white" onClick={()=>{setAnswer(null);setN(v=>(v+1)%questions.length)}}>{n===5?"Ξαναπαίζω":"Επόμενη ερώτηση"} <ArrowRight className="inline size-5"/></button>}</div>
}
function NovemberActivities(){
 const [page,setPage]=useState(0);const [age,setAge]=useState<3|4|5|6>(4);const [radio,setRadio]=useState("");const [messages,setMessages]=useState(["","","","",""]);
 const title=activities[page];
 const print=()=>window.print();
 return <main lang="el" className="min-h-screen bg-gradient-to-b from-amber-50 via-sky-50 to-rose-50 px-4 py-8 text-slate-800 sm:px-7"><style>{`@media print {body *{visibility:hidden!important}#nov-paper,#nov-paper *{visibility:visible!important}#nov-paper{position:absolute;left:0;top:0;width:100%;box-shadow:none!important;border:none!important;background:#fff!important}.nov-no-print{display:none!important}@page{size:A4;margin:10mm}}`}</style>
 <div className="mx-auto max-w-6xl">
 <div className="nov-no-print mb-5 flex flex-wrap items-center justify-between gap-3"><Link to="/virtual-preschool" className="flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold"><ArrowLeft className="size-5"/>Το χωριό του Πισιπούκ</Link><div className="flex items-center gap-3"><label className="font-bold">Ηλικία <select value={age} onChange={e=>setAge(Number(e.target.value) as 3|4|5|6)} className="rounded-xl border p-2">{[3,4,5,6].map(v=><option key={v} value={v}>{v} ετών</option>)}</select></label><button onClick={print} className="rounded-full bg-white px-5 py-3 font-bold"><Printer className="mr-2 inline size-5"/>Εκτύπωση</button></div></div>
 <div className="rounded-[2.5rem] bg-white/90 p-6 shadow-xl sm:p-10"><div className="text-center"><span className="text-6xl" aria-hidden="true">🐻 🌺 🕊️</span><p className="mt-4 font-black tracking-widest text-rose-600">Ο ΠΙΣΙΠΟΥΚ ΘΥΜΑΤΑΙ</p><h1 className="mt-3 text-4xl font-black text-slate-900 sm:text-6xl">17 Νοεμβρίου</h1><p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">Οκτώ δραστηριότητες για την ελευθερία, την ειρήνη και τη δημοκρατία. Παίζουμε και δημιουργούμε μαζί με έναν ενήλικο.</p></div>
 <div className="nov-no-print my-8 grid grid-cols-2 gap-3 sm:grid-cols-4">{activities.map((a,i)=><button key={i} onClick={()=>setPage(i)} aria-pressed={i===page} className={"rounded-2xl border-2 p-3 text-left "+(page===i?"border-violet-500 bg-violet-50 shadow-md":"border-slate-100 bg-white hover:border-amber-300")}><span className="text-3xl" aria-hidden="true">{a[0]}</span><strong className="mt-2 block">{i+1}. {a[1]}</strong><small className="mt-1 block text-slate-500">{a[2]}</small></button>)}</div>
 <section id="nov-paper" className="min-h-[560px] rounded-[2rem] border-4 border-amber-300 bg-gradient-to-b from-white to-amber-50 p-5 sm:p-10"><div className="mb-7 text-center"><p className="font-black text-rose-600">17 ΝΟΕΜΒΡΙΟΥ · ΦΥΛΛΟ {page+1}/8</p><h2 className="mt-2 text-3xl font-black">{title[0]} {title[1]}</h2><p className="mt-2 text-sm font-bold text-slate-500">{title[2]}</p></div>
 {page===0&&<div className="mx-auto max-w-2xl space-y-5 text-center"><p className="text-5xl">👧🏽 👦🏻 👧🏼 🎶</p><p className="text-xl font-semibold leading-9">Τα παιδιά τραγουδούν μες στους δρόμους,<br/>κι η φωνή τους τον κόσμο αλλάζει.</p><p className="text-5xl">🌧️ ☀️ 🌈</p><p className="text-xl font-semibold leading-9">Τα σύννεφα σκορπίζουν κι η μέρα προβάλλει,<br/>λουλούδι ανθίζει σαν ελπίδα μεγάλη.</p><div className="nov-no-print"><button className="rounded-full bg-sky-200 px-6 py-3 font-bold" onClick={()=>hear("Τα παιδιά τραγουδούν μες στους δρόμους, κι η φωνή τους τον κόσμο αλλάζει. Τα σύννεφα σκορπίζουν κι η μέρα προβάλλει, λουλούδι ανθίζει σαν ελπίδα μεγάλη.")}><Volume2 className="mr-2 inline size-5"/>Άκου και τραγούδησε</button></div><p className="text-lg">💬 Πώς μπορούμε να κάνουμε έναν φίλο να χαμογελάσει;</p></div>}
 {page===1&&<Matching/>}
 {page===2&&<Quiz/>}
 {page===3&&<><p className="mb-5 text-center text-lg">Χρωμάτισε το περιστέρι της ειρήνης και το κλαδί της ελιάς.</p><ArtCanvas kind="dove"/></>}
 {page===4&&<><p className="mb-5 text-center text-lg">Δώσε τα αγαπημένα σου χρώματα στο σύμβολο της ειρήνης.</p><ArtCanvas kind="peace"/></>}
 {page===5&&<div className="mx-auto max-w-xl text-center"><span className="text-8xl">📻</span><h3 className="my-5 text-2xl font-black">Αν είχα ένα ραδιόφωνο, θα έλεγα σε όλο τον κόσμο...</h3><textarea aria-label="Το δικό μου μήνυμα" value={radio} onChange={e=>setRadio(e.target.value.slice(0,240))} placeholder="Ένας μεγάλος μπορεί να γράψει εδώ τα λόγια σου…" className="min-h-40 w-full rounded-3xl border-4 border-sky-200 p-5 text-xl"/><div className="nov-no-print mt-4 flex justify-center gap-3"><button onClick={()=>hear(radio||"Πες το δικό σου μήνυμα για την ειρήνη.")} className="rounded-full bg-sky-200 px-6 py-3 font-bold"><Volume2 className="mr-2 inline size-5"/>Άκου το μήνυμά μου</button></div><p className="mt-5 font-bold">ΨΩΜΙ · ΠΑΙΔΕΙΑ · ΕΛΕΥΘΕΡΙΑ</p></div>}
 {page===6&&<><p className="mb-5 text-center text-lg">Γράψε μαζί με έναν μεγάλο ή ζωγράφισε τα δικά σου μηνύματα.</p><div className="grid gap-5 sm:grid-cols-2">{messages.map((m,i)=><div className="rounded-xl border-8 border-amber-300 bg-white p-3 shadow-md" key={i}><textarea value={m} onChange={e=>setMessages(a=>a.map((s,j)=>i===j?e.target.value.slice(0,100):s))} aria-label={"Πλακάτ "+(i+1)} placeholder={["ΕΙΡΗΝΗ","ΦΙΛΙΑ","ΕΛΕΥΘΕΡΙΑ","ΣΕΒΑΣΜΟΣ","Η ΔΙΚΗ ΜΟΥ ΙΔΕΑ"][i]} className="min-h-20 w-full resize-none text-center text-2xl font-black"/></div>)}</div></>}
 {page===7&&<><p className="mb-6 text-center text-lg">Με έναν ενήλικο: εκτύπωσε, κόψε, χρωμάτισε και φτιάξε μια γιρλάντα.</p><div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{["🌺","🌺","🌺","🌺","🕊️","🇬🇷","ΨΩΜΙ","ΠΑΙΔΕΙΑ","ΕΛΕΥΘΕΡΙΑ"].map((x,i)=><div key={i} className="flex aspect-square items-center justify-center rounded-xl border-4 border-dashed border-slate-500 bg-white p-2 text-center text-3xl font-black sm:text-5xl">{x}</div>)}</div><div className="mt-6 rounded-2xl bg-white p-5"><h3 className="text-xl font-black">✂️ Τα 4 βήματα της κατασκευής</h3><ol className="ml-6 mt-2 list-decimal space-y-2"><li>Εκτύπωσε την καρτέλα σε χαρτί Α4.</li><li>Χρωμάτισε τα σύμβολα και τα λουλούδια.</li><li>Με τη βοήθεια ενήλικου κόψε στις διακεκομμένες γραμμές.</li><li>Κόλλησε τις κάρτες σε κορδέλα ή χαρτόνι και συζήτησε τι σημαίνουν.</li></ol></div></>}
 <p className="mt-8 text-center text-sm font-semibold">Όνομα: ______________________________</p></section>
 <div className="nov-no-print mt-7 flex flex-wrap justify-between gap-3"><button className="rounded-full bg-slate-100 px-6 py-3 font-bold disabled:opacity-30" disabled={page===0} onClick={()=>setPage(v=>v-1)}><ArrowLeft className="mr-2 inline size-5"/>Προηγούμενο</button><button className="rounded-full bg-rose-500 px-6 py-3 font-bold text-white" onClick={()=>{if(page===7)setPage(0);else setPage(v=>v+1)}}>{page===7?"Από την αρχή":"Επόμενη δραστηριότητα"}<ArrowRight className="ml-2 inline size-5"/></button></div>
 <aside className="mt-8 rounded-3xl bg-sky-50 p-5 text-sm leading-7 text-slate-700"><strong>Για γονείς και παιδαγωγούς:</strong> Στα 3–4 δίνουμε χρόνο για εικόνες, κίνηση, ζωγραφική και προφορικό διάλογο. Στα 5–6 προσθέτουμε ερωτήσεις, αφήγηση και απλή γραφή. Τα γεγονότα του 1973 μνημονεύονται με ιστορική ακρίβεια και ευαισθησία, χωρίς τρομακτικές λεπτομέρειες. Η κοπή γίνεται μόνο με επίβλεψη ενηλίκου. Οι δημιουργίες παραμένουν στον φυλλομετρητή και δεν αποστέλλονται σε διακομιστή.</aside>
 </div></div></main>
}
