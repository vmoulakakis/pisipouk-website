import { useMemo, useState } from "react";
import bear from "@/assets/pisipouk-logo.webp";

export type PisipoukMood = "idle"|"wave"|"happy"|"eat"|"dance"|"think"|"proud"|"sleepy";

export function PisipoukCharacter({
  mood="idle",
  necklace=[],
  className="",
  speech,
}:{
  mood?:PisipoukMood;
  necklace?:string[];
  className?:string;
  speech?:string;
}) {
  const beads=useMemo(()=>necklace.slice(0,10),[necklace]);
  return (
    <div className={`pv15-character mood-${mood} ${className}`} aria-label="Ο Πισιπούκ το αρκουδάκι">
      <div className="pv15-character-glow"/>
      <img src={bear} alt="Ο Πισιπούκ το αρκουδάκι" draggable={false}/>
      {beads.length>0 && (
        <div className="pv15-worn-necklace" aria-label="Το κολιέ του Πισιπούκ">
          <span className="cord"/>
          {beads.map((color,i)=><i key={i} style={{"--c":color,"--i":i} as React.CSSProperties}/>)}
        </div>
      )}
      {speech && <div className="pv15-speech">{speech}</div>}
    </div>
  );
}
