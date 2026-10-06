import { useState } from "react";
import { Sparkles } from "lucide-react";
import { PreschoolReviewedLab } from "./PreschoolReviewedLab";

export function PreschoolReviewedLauncher(){
  const[open,setOpen]=useState(false);
  return <>
    <button className="reviewed-launch" onClick={()=>setOpen(true)} aria-label="Άνοιξε τα αξιολογημένα adaptive παιχνίδια"><Sparkles/><span><b>Reviewed Play Lab</b><small>12 game families • 36 variants • stats</small></span></button>
    {open&&<div className="reviewed-overlay"><PreschoolReviewedLab onClose={()=>setOpen(false)}/></div>}
    <style>{`
      .reviewed-launch{position:fixed;z-index:58;left:50%;bottom:22px;transform:translateX(-50%);border:0;border-radius:22px;background:linear-gradient(135deg,#17215b,#4a3acb);color:#fff;padding:11px 16px;display:flex;gap:9px;align-items:center;box-shadow:0 16px 40px #26305d55;font:inherit;font-weight:900;touch-action:manipulation}.reviewed-launch span{display:grid;text-align:left}.reviewed-launch small{font-size:.62rem;opacity:.82}.reviewed-overlay{position:fixed;z-index:500;inset:0;background:#e4f9ff;overflow:auto}.reviewed-overlay>.rv{min-height:100svh}@media(max-width:720px){.reviewed-launch{bottom:max(216px,calc(env(safe-area-inset-bottom) + 212px));padding:9px 11px}.reviewed-launch small{display:none}.reviewed-launch b{font-size:.72rem}}
    `}</style>
  </>
}
