import { useState } from "react";
import type { Age } from "./content";
import { PATTERNS, CRAFTS, artwork, artworkDataUrl } from "./studioContent";
import { printTemplate, printableSvg, saveSvg } from "./PatternStudio";

export function CraftStudio({age}:{age:Age}) {
 const [selected,setSelected]=useState(CRAFTS[0].id);
 const [step,setStep]=useState(0);
 const item=CRAFTS.find(x=>x.id===selected)||CRAFTS[0];
 const pattern=PATTERNS.find(x=>x.id===item.pattern)||PATTERNS[0];
 const outline=artwork(pattern,age,false);
 return <section className="pw-craft-studio">
   <div className="pw-studio-title"><div><small>20 ΠΡΩΤΟΤΥΠΑ ΠΑΤΡΟΝ · ΒΗΜΑ ΠΡΟΣ ΒΗΜΑ</small><h2>✂️ Το εργαστήρι κατασκευών</h2>
     <p>Κάθε κατασκευή έχει εικόνα αποτελέσματος, ασφαλή υλικά, οδηγίες ενηλίκου και εκτυπώσιμο πατρόν.</p></div><strong>{CRAFTS.length} κατασκευές</strong></div>
   <div className="pw-pattern-gallery" role="group" aria-label="Επιλογή κατασκευής">
    {CRAFTS.map(c=>{const p=PATTERNS.find(x=>x.id===c.pattern)||PATTERNS[0];return <button type="button" key={c.id} onClick={()=>{setSelected(c.id);setStep(0);}} aria-pressed={c.id===selected}><img loading="lazy" src={artworkDataUrl(p,age,true)} alt=""/><span>{c.title}</span></button>})}
   </div>
   <div className="pw-craft-lesson">
     <div className="pw-craft-finished"><img src={artworkDataUrl(pattern,age,true)} alt={"Εικονογραφημένο παράδειγμα για "+item.title}/><p>Πώς περίπου θα μοιάζει η δημιουργία μας</p></div>
     <div className="pw-craft-detail">
       <div className="pw-craft-badges"><span>👶 {["2–3","3–4","4–5","5–6"][age]} ετών</span><span>⏱️ {item.minutes} λεπτά</span><span>🧑 Με ενήλικο</span></div>
       <h3>{item.title}</h3><p><b>Θα χρειαστούμε:</b> {item.materials}.</p>
       <p><b>Τεχνική:</b> Παρατηρώ το παράδειγμα, ακολουθώ τις εικόνες και φτιάχνω τη δική μου παραλλαγή.</p>
       <div className="pw-craft-steps" aria-label="Βήματα κατασκευής">
        {item.steps.map((instruction,i)=><button type="button" key={instruction} className={step===i?"active":""} onClick={()=>setStep(i)} aria-pressed={step===i}>
          <span className="pw-step-art" aria-hidden="true"><img src={artworkDataUrl(pattern,age,i>=2)} alt="" /><b>{i+1}</b></span>
          <span><strong>Βήμα {i+1}</strong><small>{instruction}</small></span>
        </button>)}
       </div>
       <div className="pw-craft-callout"><strong>Τώρα κάνουμε το βήμα {step+1}</strong><p>{item.steps[step]}</p><div className="pw-tools">
        <button type="button" disabled={step===0} onClick={()=>setStep(s=>Math.max(0,s-1))}>← Προηγούμενο</button>
        <button type="button" onClick={()=>setStep(s=>(s+1)%4)}>{step===3?"↻ Πάλι από την αρχή":"Επόμενο βήμα →"}</button>
       </div></div>
       <p className="pw-safety">Ασφάλεια: ο ενήλικος χειρίζεται ψαλίδι, κοφτερά εργαλεία και συνδετήρες. Για ηλικίες 2–3 χρησιμοποιούμε αποκλειστικά μεγάλα έτοιμα κομμάτια και κατάλληλα μη τοξικά υλικά.</p>
       <div className="pw-tools">
         <button type="button" onClick={()=>saveSvg(printableSvg(item.title,outline),"pisipouk-"+item.id+"-patron-a4.svg")}>↓ Κατέβασε Α4 πατρόν</button>
         <button type="button" onClick={()=>printTemplate(item.title,outline)}>🖨️ Εκτύπωση / PDF</button>
       </div>
     </div>
   </div>
 </section>;
}
