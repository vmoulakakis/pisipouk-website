import { useState } from "react";
import { ArrowLeft, ExternalLink, Gamepad2, Map, Sparkles } from "lucide-react";
import { PreschoolV17 } from "./PreschoolV17";

/** Feature branch only: original illustrated 2.5D panorama + 20 clickable educational games. */
export function PisipoukVillageHub() {
  const [classic,setClassic]=useState(false);
  return <main style={{minHeight:"100dvh",background:"#075985",color:"#fff"}}>
    <nav aria-label="Πλοήγηση Πισιπούκ" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap",padding:"10px 16px",background:"#714018",borderBottom:"4px solid #facc15",fontFamily:"ui-rounded,system-ui,sans-serif"}}>
      <strong style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:16}}><Sparkles size={19}/> ΠΙΣΙΠΟΥΚ • ONLINE PRESCHOOL</strong>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <button onClick={()=>setClassic(false)} aria-pressed={!classic} style={{display:"inline-flex",alignItems:"center",gap:6,border:"2px solid #fff",borderRadius:13,background:!classic?"#16a34a":"#fbf4de",color:!classic?"white":"#365c40",padding:"9px 12px",fontWeight:900,cursor:"pointer"}}><Map size={18}/> Μαγικό Χωριό</button>
        <button onClick={()=>setClassic(true)} aria-pressed={classic} style={{display:"inline-flex",alignItems:"center",gap:6,border:"2px solid #fff",borderRadius:13,background:classic?"#16a34a":"#fbf4de",color:classic?"white":"#365c40",padding:"9px 12px",fontWeight:900,cursor:"pointer"}}><Gamepad2 size={18}/> Περισσότερα παιχνίδια</button>
        <a href="/preschool/world360/index.html" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,borderRadius:13,background:"#facc15",color:"#6c3b1a",padding:"10px 12px",fontWeight:950,textDecoration:"none"}}><ExternalLink size={18}/> Πλήρης οθόνη</a>
      </div>
    </nav>
    {classic?<><button onClick={()=>setClassic(false)} style={{margin:18,display:"flex",alignItems:"center",gap:8,background:"#facc15",color:"#714018",padding:"12px 18px",borderRadius:13,fontWeight:900,border:0}}><ArrowLeft size={18}/> Πίσω στο Μαγικό Χωριό</button><PreschoolV17/></>:
    <iframe src="/preschool/world360/index.html" title="Πισιπούκ 360 — Ο διαδραστικός κόσμος με 20 παιχνίδια" loading="eager" allow="autoplay" style={{display:"block",width:"100%",height:"calc(100dvh - 73px)",minHeight:640,border:0,background:"#0284c7"}}/>}
  </main>;
}
