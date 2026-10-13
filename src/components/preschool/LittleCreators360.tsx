import { useState } from "react";
import { ArrowRight, Hammer, Palette, Gamepad2, Paintbrush, Music2, BookOpen, Sprout, Sparkles, RotateCcw } from "lucide-react";
import type { V15Age } from "./v15/Games";
import "./little-creators-360.css";
type Pillar="build"|"create"|"play"|"paint"|"sing"|"stories";
type Activity={id:string;label:string;skill:string;destination?:"garden"|"sort"|"count"|"build"|"choir"|"story"|"existing"};
type PillarEntry={id:Pillar;name:string;descriptor:string;icon:typeof Hammer;activities:Activity[]};
const pillars:PillarEntry[]=[
 {id:"build",name:"ΚΑΤΑΣΚΕΥΑΖΩ",descriptor:"Τουβλάκια, τροχοί και μικρές μηχανές",icon:Hammer,activities:[
 {id:"B01",label:"3D Πύργοι από Κύβους",skill:"Χώρος και ισορροπία",destination:"build"},
 {id:"B02",label:"Φτιάχνω Τρακτέρ",skill:"Συναρμολόγηση"},
 {id:"B03",label:"Γέφυρα για Παπάκια",skill:"Πρώιμη μηχανική"},
 {id:"B04",label:"Νερόμυλος",skill:"Αιτία και αποτέλεσμα"}]},
 {id:"create",name:"ΔΗΜΙΟΥΡΓΩ",descriptor:"Πηλός, λουλούδια και φαντασία",icon:Sprout,activities:[
 {id:"C01",label:"Πηλοζωάκια",skill:"Δημιουργική σύνθεση"},
 {id:"C02",label:"Φυτεύω Λουλούδια",skill:"Φροντίδα και παρατήρηση",destination:"garden"},
 {id:"C03",label:"Φρουτοσαλάτα",skill:"Ταξινόμηση και φροντίδα"},
 {id:"C04",label:"Χάρτινο Παραμύθι",skill:"Ακολουθία και κατασκευή"}]},
 {id:"play",name:"ΠΑΙΖΩ",descriptor:"Ένας κόσμος που ανταποκρίνεται",icon:Gamepad2,activities:[
 {id:"P01",label:"Το Νησάκι της Φάρμας",skill:"Ελεύθερη 3D εξερεύνηση",destination:"garden"},
 {id:"P02",label:"Ζυγαριά Χρωμάτων",skill:"Χρώμα και ποσότητα",destination:"sort"},
 {id:"P03",label:"Κρυμμένοι Φίλοι",skill:"Μνήμη και αναγνώριση"},
 {id:"P04",label:"Το Μπάνιο των Ζώων",skill:"Λεπτή κινητικότητα"}]},
 {id:"paint",name:"ΖΩΓΡΑΦΙΖΩ",descriptor:"Χρώματα, πατρόν και προγραφή",icon:Paintbrush,activities:[
 {id:"D01",label:"Βάφω την Αγελάδα",skill:"Εικαστική δημιουργία"},
 {id:"D02",label:"Φωτεινή Νεροζωγραφική",skill:"Αισθητηριακή εξερεύνηση"},
 {id:"D03",label:"Ζωγραφίζω Πατρόν",skill:"Χρώματα και συντονισμός",destination:"existing"},
 {id:"D04",label:"Μονοπάτια Ουράνιου Τόξου",skill:"Προγραφή",destination:"existing"}]},
 {id:"sing",name:"ΤΡΑΓΟΥΔΩ",descriptor:"Ήχοι, ρυθμοί και φωνές",icon:Music2,activities:[
 {id:"M01",label:"Χορωδία Ζώων",skill:"Ακουστική αντίληψη",destination:"choir"},
 {id:"M02",label:"Μαγικό Ξυλόφωνο",skill:"Μουσική ανακάλυψη",destination:"existing"},
 {id:"M03",label:"Ρυθμικοί Σπόροι",skill:"Ρυθμός"},
 {id:"M04",label:"Τραγούδια του Πισιπούκ",skill:"Γλώσσα και τραγούδι"}]},
 {id:"stories",name:"ΙΣΤΟΡΙΕΣ",descriptor:"Χαρακτήρες που ζουν μαζί μας",icon:BookOpen,activities:[
 {id:"S01",label:"Το Κοτοπουλάκι Βρίσκει Φίλους",skill:"Αφήγηση και ενσυναίσθηση",destination:"story"},
 {id:"S02",label:"Το Χαμένο Κοτοπουλάκι",skill:"Ενσυναίσθηση"},
 {id:"S03",label:"Κουκλοθέατρο",skill:"Παιχνίδι ρόλων"},
 {id:"S04",label:"Τι Γίνεται Μετά;",skill:"Αλληλουχία και επιλογές",destination:"existing"}]},
];
export function LittleCreators360({age,onGoTo}:{age:V15Age;onGoTo:(zone:string)=>void}){
 const [active,setActive]=useState<Pillar>("create");
 const selected=pillars.find(p=>p.id===active)!;
 const open=(item:Activity)=>{
  if(!item.destination)return;
  if(item.destination==="existing"){
   onGoTo(active==="build"?"games":active==="paint"?"atelier":active==="sing"?"music":"stories");return;
  }
  const game=({sort:"A01",count:"B05",garden:"C09",build:"B01",choir:"M01",story:"S01"} as Record<string,string>)[item.destination]||"C09";
  window.open("/preschool/360/cozy-garden.html?game="+game+"&age="+encodeURIComponent(age),"pisipouk360","noopener,noreferrer");
 };
 return <section className="lc360" aria-label="Μικροί Δημιουργοί — έξι δημιουργικοί κόσμοι">
  <header className="lc360-heading">
   <span><Sparkles size={17}/> PISIPOUK 360 • 2–5 ΕΤΩΝ</span>
   <h2>Μικροί Δημιουργοί</h2>
   <p>Έξι δημιουργικοί κόσμοι, αληθινό παιχνίδι και μικρές καθημερινές ανακαλύψεις. Διάλεξε πού θέλεις να παίξεις!</p>
  </header>
  <div className="lc360-pillars" role="tablist" aria-label="Έξι δημιουργικοί κόσμοι">{pillars.map(p=>{
   const Icon=p.icon;
   return <button role="tab" aria-selected={active===p.id} key={p.id} className={"lc360-pillar "+p.id+(active===p.id?" selected":"")} onClick={()=>setActive(p.id)}>
    <Icon size={27} strokeWidth={2.2}/><b>{p.name}</b><small>{p.descriptor}</small>
   </button>;
  })}</div>
  <div className="lc360-panel" role="tabpanel">
   <div className="lc360-panelhead"><div><strong>{selected.name}</strong><p>Δραστηριότητες με διαφορετικούς στόχους για κάθε ηλικία. Όσες είναι ενεργές ανοίγουν ήδη το παιχνίδι.</p></div><span>{selected.activities.filter(x=>x.destination).length} διαθέσιμες διαδρομές</span></div>
   <div className="lc360-activities">{selected.activities.map((item,i)=><div className={"lc360-activity "+(item.destination?"ready":"planned")} key={item.id}>
     <span className="lc360-number">{String(i+1).padStart(2,"0")}</span>
     <div><h3>{item.label}</h3><p>{item.skill}</p><small>{item.destination?"Δοκιμαστική δραστηριότητα":"Σε ανάπτυξη — δεν είναι ακόμη διαθέσιμο"}</small></div>
     {item.destination?<button onClick={()=>open(item)} aria-label={"Παίζω: "+item.label}>ΠΑΙΖΩ <ArrowRight size={17}/></button>:<span className="lc360-coming">ΣΥΝΤΟΜΑ</span>}
    </div>)}</div>
  </div>
  <div className="lc360-feature"><span><Sprout size={27}/> ΝΕΑ ΖΩΝΤΑΝΗ 3D ΣΚΗΝΗ</span><div><h3>Το Μαγικό Περιβολάκι</h3><p>Φύτεψε, πότισε, άλλαξε τον καιρό, φρόντισε λουλούδια και ανακάλυψε νέες τυχαίες αποστολές. Δεν υπάρχει Game Over.</p></div><button onClick={()=>window.open("/preschool/360/cozy-garden.html?game=C09&age="+encodeURIComponent(age),"pisipouk360","noopener,noreferrer")}>Μεγάλο πράσινο ΠΑΙΖΩ! <ArrowRight size={19}/></button></div>
  <p className="lc360-transparency"><RotateCcw size={15}/> Οι 24 δραστηριότητες αποτελούν το συνολικό πρόγραμμα. Οι διαθέσιμες 3D διαδρομές ανοίγουν σε δοκιμαστική λειτουργία· οι υπόλοιπες επισημαίνονται ως υπό ανάπτυξη.</p>
 </section>;
}
