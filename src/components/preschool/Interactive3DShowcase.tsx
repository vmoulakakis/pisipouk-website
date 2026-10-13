import { useState } from "react";
import { Box, ExternalLink, Gamepad2, Maximize2, RotateCcw, Sparkles } from "lucide-react";

/** The supplied Three.js/GSAP game runs inside an isolated static HTML iframe. */
export function Interactive3DShowcase(){
 const [revision,setRevision]=useState(0),[loaded,setLoaded]=useState(false);
 const gameUrl="/preschool/games/shape-island.html";
 const reset=()=>{setLoaded(false);setRevision(n=>n+1)};
 const full=()=>{const iframe=document.getElementById("pisipouk-3d-shape-island") as HTMLIFrameElement|null;const request=iframe?.requestFullscreen?.();if(request){request.catch(()=>window.open(gameUrl,"_blank","noopener,noreferrer"))}else window.open(gameUrl,"_blank","noopener,noreferrer")};
 return <section className="pw17-3d-showcase" aria-label="Τρισδιάστατο παιχνίδι: Το Νησί των Σχημάτων" style={{maxWidth:1290,margin:"25px auto 35px",padding:"0 16px"}}>
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap",marginBottom:16}}>
    <div>
     <span style={{display:"inline-flex",alignItems:"center",gap:7,fontSize:12,letterSpacing:".1em",color:"#af7351",fontWeight:900}}><Sparkles size={16}/> ΝΕΟ ΠΑΙΧΝΙΔΙ THREE.JS · WEBGL</span>
     <h2 style={{fontWeight:900,fontSize:"clamp(26px,3.8vw,43px)",color:"#2e5e4e",margin:"10px 0 6px"}}>🏝️ Το Νησί των Σχημάτων</h2>
     <p style={{margin:0,color:"#587769",fontWeight:700,maxWidth:740,lineHeight:1.5}}>Περιστρέφεις το νησί, αγγίζεις πραγματικά τρισδιάστατα σχήματα, ακούς τις ονομασίες τους και τα βάζεις να χορεύουν.</p>
    </div>
    <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
     <button type="button" onClick={reset} style={{display:"flex",alignItems:"center",gap:8,border:"1px solid #d9e3db",borderRadius:12,background:"#fff",padding:"11px 14px",color:"#356a57",fontWeight:900}}><RotateCcw size={17}/> Επανεκκίνηση</button>
     <button type="button" onClick={full} style={{display:"flex",alignItems:"center",gap:8,border:0,borderRadius:12,background:"#376d58",padding:"11px 16px",color:"#fff",fontWeight:900}}><Maximize2 size={17}/> Μεγάλη οθόνη</button>
    </div>
  </div>
  <div style={{position:"relative",width:"100%",height:"min(77vh,760px)",minHeight:530,borderRadius:24,overflow:"hidden",background:"linear-gradient(#7fd5f7,#e9f9fd)",border:"4px solid white",boxShadow:"0 22px 55px #30604c28"}}>
   {!loaded&&<div aria-live="polite" style={{position:"absolute",inset:0,display:"grid",placeItems:"center",background:"#c1eafa",zIndex:1,pointerEvents:"none"}}><span style={{display:"flex",alignItems:"center",gap:8,fontWeight:900,color:"#275d69"}}><Box size={20}/> Φορτώνει ο τρισδιάστατος κόσμος…</span></div>}
   <iframe key={revision} id="pisipouk-3d-shape-island" src={gameUrl} title="Το Νησί των Σχημάτων — διαδραστικό 3D παιχνίδι" loading="eager" allow="fullscreen; autoplay" onLoad={()=>setLoaded(true)} style={{height:"100%",width:"100%",border:0,display:"block"}} />
  </div>
  <p style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",fontSize:12,color:"#63766e",fontWeight:750,marginTop:13}}><Gamepad2 size={17}/> Αν ο browser δεν υποστηρίζει WebGL ή δεν φορτώνονται οι δωρεάν βιβλιοθήκες, το παιχνίδι θα εμφανίσει σχετικό μήνυμα. <a href={gameUrl} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,color:"#2e735f",fontWeight:900}}>Άνοιγμα σε νέα καρτέλα <ExternalLink size={15}/></a></p>
 </section>;
}
