import { useState, type MouseEvent } from "react";
import { nextDifferent } from "./random";
import type { Age } from "./age-model";
import { PATTERNS, PALETTE, artwork, artworkDataUrl } from "./studioContent";

/** SVG paths are first-party static drawings. No user-generated HTML enters the SVG renderer. */
export function printableSvg(title:string,body:string):string {
  const inner=body.replace(/^<svg[^>]*>/,"").replace(/<\/svg>\s*$/,"");
  return '<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 600 849">'
    +'<rect width="600" height="849" fill="white"/><text x="300" y="67" font-family="sans-serif" font-size="27" text-anchor="middle" fill="#24334b">'
    +escapeXml(title)+'</text><g transform="translate(0 115)">'+inner+'</g>'
    +'<text x="300" y="812" font-family="sans-serif" font-size="16" text-anchor="middle" fill="#5b696f">PISIPOUK · Η δικιά μου δημιουργία</text></svg>';
}
function escapeXml(value:string):string {
  return value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
export function saveSvg(svg:string,filename:string) {
  const url=URL.createObjectURL(new Blob([svg],{type:"image/svg+xml;charset=utf-8"}));
  const a=document.createElement("a");
  a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function printTemplate(title:string, svg:string){
  const page=window.open("","_blank");
  if(page) page.opener=null;
  if(!page){saveSvg(printableSvg(title,svg),"pisipouk-patron-a4.svg");return;}
  page.document.write('<!DOCTYPE html><html lang="el"><head><meta charset="utf-8"><title>'+escapeXml(title)+'</title><style>@page{size:A4 portrait;margin:0}html,body{margin:0}svg{width:210mm;height:297mm;display:block}</style></head><body>'+printableSvg(title,svg)+'</body></html>');
  page.document.close();
  page.focus();
  // Printing is explicitly requested through the parent/adult control.
  page.setTimeout(()=>page.print(),350);
}
export function PatternStudio({ age }: { age:Age }) {
  const [selected,setSelected]=useState(PATTERNS[0].id);
  const [color,setColor]=useState(PALETTE[0]);
  const [repaint,setRepaint]=useState(0);
  const [guide,setGuide]=useState(true);
  const pattern=PATTERNS.find(p=>p.id===selected) || PATTERNS[0];
  const svg=artwork(pattern,age,false);
  const onPaint=(event:MouseEvent<HTMLDivElement>)=>{
    const node=event.target as Element;
    if(!node || typeof node.closest!=="function") return;
    const shape=node.closest(".a,.b,.c,.d") as SVGElement|null;
    if(shape){ shape.style.fill=color; shape.style.transition="fill .2s ease"; }
  };
  return <section className="pw-pattern-studio" aria-label="20 πρωτότυπα πατρόν ζωγραφικής">
    <div className="pw-studio-title"><div><small>20 ΠΡΩΤΟΤΥΠΑ Α4 ΠΑΤΡΟΝ · {["2–3","3–4","4–5","5–6"][age]} ΕΤΩΝ</small><h2>🖍️ Η βιβλιοθήκη ζωγραφικής</h2>
      <p>Διάλεξε πατρόν, πάτησε ένα χρώμα και άγγιξε την εικόνα. Δεν υπάρχει σωστό ή λάθος χρώμα.</p></div><strong>{PATTERNS.length} σχέδια</strong></div>
    <div className="pw-pattern-gallery" role="group" aria-label="Διάλεξε σχέδιο">
      {PATTERNS.map((item)=><button type="button" key={item.id} aria-pressed={selected===item.id} onClick={()=>{setSelected(item.id);setRepaint(n=>n+1);}}>
        <img loading="lazy" src={artworkDataUrl(item,age,true)} alt="" /><span>{item.title}</span></button>)}
    </div>
    <div className="pw-studio-board">
      <div className="pw-studio-controls"><h3>{pattern.title}</h3><p><b>Βήμα 1:</b> Διάλεξε χρώμα. <b>Βήμα 2:</b> Άγγιξε τα μέρη του σχεδίου. <b>Βήμα 3:</b> Φτιάξε τη δική σου εκδοχή.</p>
        <div className="pw-studio-colors" role="group" aria-label="Παλέτα χρωμάτων">{PALETTE.map(c=><button type="button" key={c} onClick={()=>setColor(c)} aria-label={"Επιλογή χρώματος "+c} aria-pressed={color===c} style={{backgroundColor:c}} />)}</div>
        <div className="pw-tools"><button type="button" onClick={()=>setRepaint(v=>v+1)}>↻ Καθαρό πατρόν</button>
          <button type="button" onClick={()=>setGuide(v=>!v)} aria-pressed={guide}>🎨 {guide?"Κρύψε":"Δείξε"} παράδειγμα</button>
          <button type="button" onClick={()=>saveSvg(printableSvg(pattern.title,svg),"pisipouk-"+pattern.id+"-a4.svg")}>↓ Α4 SVG</button>
          <button type="button" onClick={()=>printTemplate(pattern.title,svg)}>🖨️ Εκτύπωση / PDF</button>
        </div><p className="pw-studio-help">Η εικόνα είναι πρωτότυπη και εκτυπώνεται ως καθαρό διανυσματικό περίγραμμα. Για παιδιά 2–3, τα περιγράμματα είναι πιο χοντρά.</p>
      </div>
      <div className="pw-pattern-paint" key={selected+"-"+repaint} onClick={onPaint} dangerouslySetInnerHTML={{__html:svg}} role="group" aria-label={"Χρωμάτισε "+pattern.title} />
      {guide&&<figure className="pw-pattern-example"><img src={artworkDataUrl(pattern,age,true)} alt={"Χρωματιστό παράδειγμα: "+pattern.title}/><figcaption>Χρωματιστό παράδειγμα · Μπορείς να διαλέξεις άλλα χρώματα!</figcaption></figure>}
    </div>
  </section>;
}
