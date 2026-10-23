import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/october-28-activities")({head:()=>({meta:[{title:"28η Οκτωβρίου · Δραστηριότητες | Πισιπούκ"},{name:"description",content:"Ειδική ενότητα 28ης Οκτωβρίου: ζωγραφική για παιδιά 2–3 και 4–6 ετών, διαδραστικά χρώματα και εκτυπώσιμα φύλλα Α4."}]}),component:OctoberActivities});
const poem=["Γιορτάζει η Πατρίδα","μεγάλη χαρά","σιμά της η δόξα","μ’ ολάσπρα φτερά.","","Γιορτάζει η Πατρίδα","σε κάθε μεριά","μυρίζουν οι δάφνες","γελά η λευτεριά."];
const palette=["#ffffff","#60a5fa","#2563eb","#fbbf24","#f9a8d4","#4ade80","#ef4444"];
function Coloring({boy=false}:{boy?:boolean}) {
 const [fills,setFills]=useState<Record<string,string>>({});
 const [color,setColor]=useState("#60a5fa");
 const paint=(id:string)=>setFills(old=>({...old,[id]:color}));
 const shape=(id:string,d:string)=><path d={d} fill={fills[id]||"white"} stroke="#17202a" strokeWidth="5" strokeLinejoin="round" onClick={()=>paint(id)} className="cursor-pointer"/>;
 return <div className="relative overflow-hidden rounded-2xl border-2 border-sky-200 bg-white p-4 print:break-after-page print:rounded-none print:border-0 print:p-0">
   <div className="print:hidden mb-4 flex flex-wrap items-center gap-2"><span className="mr-2 font-bold">🎨 Χρώματα:</span>{palette.map(c=><button key={c} aria-label={"Χρώμα "+c} onClick={()=>setColor(c)} className="h-9 w-9 rounded-full border-2 border-slate-600" style={{background:c,outline:color===c?"3px solid #f59e0b":undefined}}/>)}<button onClick={()=>setFills({})} className="rounded-full bg-slate-100 px-4 py-2 font-bold">Καθαρισμός</button><button onClick={()=>window.print()} className="rounded-full bg-blue-600 px-4 py-2 font-bold text-white">🖨️ Εκτύπωση Α4</button></div>
   <div className="mx-auto max-w-[530px] border-4 border-sky-200 p-5 print:h-[280mm] print:w-[200mm] print:max-w-none print:border-2">
     <h2 className="text-center text-3xl font-black text-slate-950">Εθνική γιορτή</h2>
     <div className="mt-4 text-center text-[15px] font-semibold leading-[1.45] text-slate-900">{poem.map((line,i)=><div key={i}>{line||" "}</div>)}</div>
     <svg viewBox="0 0 450 400" className="mx-auto mt-3 w-full" role="img" aria-label={boy?"Αγοράκι με ελληνική σημαία για ζωγραφική":"Κοριτσάκι με ελληνική σημαία για ζωγραφική"}>
       {shape("flag","M270 65 Q350 75 432 85 L432 240 Q358 215 270 225 Z")}
       {Array.from({length:8},(_,i)=><line key={i} x1="271" x2="431" y1={88+i*17} y2={103+i*17} stroke="#17202a" strokeWidth="3"/>)}
       <path d="M270 66 L270 140 L332 147 L332 73 M299 70 L299 144 M270 104 L332 110" stroke="#17202a" strokeWidth="6" fill="none"/>
       <path d="M262 42 L245 305" stroke="#17202a" strokeWidth="9" strokeLinecap="round"/>
       {shape("head","M80 148 C75 55 225 39 233 145 C225 224 100 223 80 148 Z")}
       {shape("hair",boy?"M76 130 Q61 61 115 73 Q148 33 185 67 Q235 66 240 117 L223 113 L204 103 L188 115 L161 104 L143 118 L112 105 Z":"M74 167 Q40 62 126 52 Q238 22 244 147 L240 195 L220 202 L207 158 Q173 125 154 107 Q130 150 83 157 L93 211 L61 208 Z")}
       <circle cx="127" cy="153" r="8" fill="#17202a"/><circle cx="190" cy="153" r="8" fill="#17202a"/>
       <path d="M140 182 Q159 199 180 180" stroke="#17202a" strokeWidth="4" fill="none" strokeLinecap="round"/>
       {shape("body",boy?"M112 210 L209 210 L219 318 L102 318 Z":"M112 208 L205 208 L242 316 L72 316 Z")}
       {shape("leftarm","M112 225 Q81 242 54 283 L71 296 L130 258 Z")}
       {shape("rightarm","M200 227 L256 180 L269 194 L219 273 Z")}
       {shape("leftleg","M119 316 L149 316 L145 373 L112 373 Z")}
       {shape("rightleg","M165 316 L201 316 L213 373 L174 373 Z")}
       {shape("shoe1","M106 369 L151 369 L157 385 L99 385 Z")}
       {shape("shoe2","M170 369 L217 369 L230 385 L167 385 Z")}
     </svg>
     <p className="text-center text-xs font-bold text-slate-600">Ο Πισιπούκ · 28η Οκτωβρίου · Ηλικίες 2–3 ετών</p>
   </div>
 </div>;
}
function OctoberActivities(){
 const [variant,setVariant]=useState<"girl"|"boy">("girl");
 return <SiteLayout><main className="mx-auto max-w-6xl px-4 py-10 print:max-w-none print:p-0">
   <div className="rounded-3xl bg-gradient-to-r from-sky-100 to-amber-50 p-7 print:hidden">
    <Link to="/virtual-preschool" className="text-sm font-bold text-sky-800">← Επιστροφή στο Preschool</Link>
    <h1 className="mt-4 text-4xl font-black text-sky-950">🇬🇷 28η Οκτωβρίου 1940</h1>
    <p className="mt-3 text-lg">Μαθαίνουμε για την ειρήνη, την ελληνική σημαία και την εθνική γιορτή με παιχνίδι και ζωγραφική.</p>
    <p className="mt-2 text-sm text-slate-600">Πατήστε ένα χρώμα και μετά την περιοχή της ζωγραφιάς. Η εκτύπωση δημιουργεί ασπρόμαυρο φύλλο Α4.</p>
    <div className="mt-5 flex flex-wrap gap-2"><button onClick={()=>setVariant("girl")} className={`rounded-xl px-5 py-3 font-bold ${variant==="girl"?"bg-blue-700 text-white":"bg-white"}`}>👧 Κοριτσάκι</button><button onClick={()=>setVariant("boy")} className={`rounded-xl px-5 py-3 font-bold ${variant==="boy"?"bg-blue-700 text-white":"bg-white"}`}>👦 Αγοράκι</button></div>
   </div>
   <div className="mt-5 print:mt-0"><Coloring key={variant} boy={variant==="boy"}/></div>
   <section className="my-8 grid gap-4 sm:grid-cols-2 print:hidden">
    <article className="rounded-3xl border bg-white p-6"><h2 className="text-2xl font-black">🌱 Για παιδιά 2,5–3,5 ετών</h2><p className="mt-2">Χρωματίζουμε τη σημαία, εντοπίζουμε το μπλε και το λευκό, σχεδιάζουμε μεγάλες γραμμές. Ζητάμε βοήθεια ενήλικα για το κόψιμο.</p></article>
    <article className="rounded-3xl border bg-white p-6"><h2 className="text-2xl font-black">🎨 Για παιδιά 4–6 ετών</h2><p className="mt-2">Μετράμε ρίγες, βρίσκουμε σχήματα, ζωγραφίζουμε και συζητάμε τι σημαίνει ειρήνη. Οι δραστηριότητες γίνονται χωρίς βαθμολογία.</p></article>
   </section>
 </main><style>{`@media print{@page{size:A4 portrait;margin:5mm}body{print-color-adjust:exact;-webkit-print-color-adjust:exact}nav,header,footer{display:none!important}svg path[fill]:not([fill="none"]){fill:white!important}}`}</style></SiteLayout>
}