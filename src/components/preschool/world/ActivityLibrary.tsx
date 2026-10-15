import { useState, useMemo } from "react";
import type { Age } from "./content";
import { createPack, PACK_LABELS, type PlayPack } from "./playpacks";
import { PATTERNS, artworkDataUrl } from "./studioContent";
import { Game } from "./Game";

export function ActivityLibrary({category,age,onComplete}:{category:PlayPack;age:Age;onComplete:()=>void}) {
 const activities=useMemo(()=>createPack(category,age),[category,age]);
 const [selected,setSelected]=useState(0);
 return <div className="pw-activity-library">
   <Game key={category+"-"+age+"-"+selected} task={activities[selected]} pool={activities} onComplete={onComplete}/>
   <section aria-label={"Επιλογή δραστηριότητας "+PACK_LABELS[category]} className="pw-activity-picker">
     <div className="pw-studio-title"><div><small>ΝΕΟΙ ΓΥΡΟΙ ΚΑΙ ΟΠΤΙΚΑ ΠΑΡΑΔΕΙΓΜΑΤΑ</small><h3>20 επιλογές · {PACK_LABELS[category]}</h3><p>Διάλεξε εσύ ένα παιχνίδι ή πάτησε «Παίζω ξανά · Νέος γύρος» για διαφορετική δραστηριότητα.</p></div><strong>{activities.length}</strong></div>
     <div className="pw-pattern-gallery">
       {activities.map((activity,i)=>{
         const pat=PATTERNS[i%PATTERNS.length];
         return <button type="button" key={activity.title} onClick={()=>setSelected(i)} aria-label={"Άνοιξε: "+activity.title}>
           <img loading="lazy" src={artworkDataUrl(pat,age,true)} alt=""/>
           <span>{activity.title}</span>
         </button>;
       })}
     </div>
   </section>
 </div>;
}
