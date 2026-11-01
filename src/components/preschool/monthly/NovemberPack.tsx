import { useEffect, useMemo, useRef, useState } from "react";
import { NOVEMBER_ACTIVITIES, NOVEMBER_CRAFT_STEPS, NOVEMBER_PACK, NOVEMBER_STORIES, type PackActivity, type PackAge, type PackKind } from "./november2026";
import { November3DGame, getNovemberStats, startNovemberActivity, finishNovemberActivity } from "./November3DGame";
import bearLogo from "@/assets/pisipouk-logo.webp";

const GROUPS:{id:string;title:string;kinds:PackKind[]}[]=[
 {id:"game",title:"3D παιχνίδια",kinds:["game3d"]},
 {id:"craft",title:"Κατασκευές Α4",kinds:["craft"]},
 {id:"color",title:"Ζωγραφική",kinds:["coloring"]},
 {id:"story",title:"Ιστορίες",kinds:["story"]},
 {id:"explore",title:"Μουσική • Φύση • Αποστολές",kinds:["mission","music","stem","social","quest"]},
];
const PALETTE=["#f4c768","#7cc6e9","#9ccf8b","#e69aaf","#a8a2e8","#f1ad7e"];
const SCENES:Record<string,string[]>={
 "nov26-23-color-a":["M45 170 Q30 105 105 78 Q180 105 165 170 Z","M105 78 L105 221 Q130 243 139 216","M75 140 Q91 124 105 141 Q120 125 137 142 L137 166 L75 166 Z"],
 "nov26-23-color-b":["M53 105 Q42 63 105 61 Q168 63 157 105 L164 216 L46 216 Z","M59 68 A24 24 0 1 1 83 45 A24 24 0 0 1 59 68","M127 45 A24 24 0 1 1 151 68 A24 24 0 0 1 127 45","M75 129 Q105 104 135 129 L132 168 Q105 186 78 168 Z"],
 "nov26-45-color-a":["M32 213 L52 141 L74 213 Z","M76 213 L101 108 L126 213 Z","M129 213 L159 145 L183 213 Z","M41 133 Q63 67 86 133 Z","M111 109 Q133 46 161 109 Z"],
 "nov26-45-color-b":["M28 159 L184 159 L160 199 L52 199 Z","M99 157 L99 86 L152 151 Z","M44 213 Q99 197 171 214 L174 231 L36 231 Z"],
 "nov26-56-color-a":["M27 69 L92 48 L157 70 L185 117 L167 198 L91 236 L30 193 Z","M56 98 L103 124 L80 180 L144 200","M103 124 L150 101 L167 151","M40 193 L80 180 L125 206"],
 "nov26-56-color-b":["M41 205 L41 127 L82 127 L82 205 Z","M91 205 L91 95 L132 95 L132 205 Z","M141 205 L141 147 L179 147 L179 205 Z","M98 75 Q111 47 125 75 Z","M45 107 Q62 82 80 107 Z"],
};
const CRAFT_PATTERNS:Record<string,string[]>={
 "nov26-23-craft":["M33 156 Q40 78 105 78 Q170 78 177 156 Z","M105 156 V217 Q130 243 143 211","M58 169 L70 194 L82 169 Z","M123 169 L135 194 L147 169 Z"],
 "nov26-45-craft-tree":["M94 224 L94 145 L116 145 L116 224 Z","M105 73 Q39 95 56 149 Q76 167 105 145 Q135 167 155 149 Q172 95 105 73 Z","M105 65 V234"],
 "nov26-45-craft-boat":["M32 166 L177 166 L151 208 L60 208 Z","M104 165 V80 L156 153 Z","M104 84 L64 156 L104 156 Z","M30 225 Q65 208 105 225 Q145 242 181 225"],
 "nov26-56-craft":["M105 148 m-73 0 a73 73 0 1 0 146 0 a73 73 0 1 0 -146 0","M105 75 V221","M32 148 H178","M105 99 L128 149 L105 198 L82 149 Z"],
};
function svgMarkup(paths:string[],fills:string[],title:string,printable=false){
 const shapes=paths.map((d,i)=>'<path d="'+d+'" fill="'+(printable?"white":(fills[i]||"white"))+'" stroke="#27384a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>').join("");
 const safe=title.replace(/&/g,"&amp;").replace(/</g,"&lt;");
 return '<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297"><rect width="210" height="297" fill="white"/><text x="105" y="28" text-anchor="middle" font-family="sans-serif" font-size="7" fill="#25304d">'+safe+'</text>'+shapes+'<text x="105" y="270" text-anchor="middle" font-family="sans-serif" font-size="4" fill="#25304d">ΠΙΣΙΠΟΥΚ • ΝΟΕΜΒΡΙΟΣ 2026 • Α4</text></svg>';
}
function downloadSvg(text:string,name:string){
 const url=URL.createObjectURL(new Blob([text],{type:"image/svg+xml;charset=utf-8"}));
 const a=document.createElement("a");a.href=url;a.download=name;a.click();window.setTimeout(()=>URL.revokeObjectURL(url),1200);
}
function playSound(index:number){
 try{const C=window.AudioContext||(window as any).webkitAudioContext;if(!C)return;const ctx=new C();
 const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=[261,329,392,440][index%4];g.gain.setValueAtTime(.11,ctx.currentTime);
 g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.35);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+.36);o.onended=()=>{void ctx.close()};}catch{}
}
function Detail({activity,variant,onClose}:{activity:PackActivity;variant:number;onClose:()=>void}){
 const [startedAt]=useState(()=>Date.now());
 const [step,setStep]=useState(0),[paint,setPaint]=useState<Record<number,string>>({}),[color,setColor]=useState(PALETTE[variant%PALETTE.length]);
 const [finished,setFinished]=useState(false),[choice,setChoice]=useState(""),[soundCount,setSoundCount]=useState(0);
 const variantHints=["Διάλεξε μια καινούρια αρχή.","Παρατήρησε κάτι μικρό.","Δοκίμασε άλλο χρώμα.","Πες τι βλέπεις.","Άκουσε μια ιδέα από έναν μεγάλο.","Φτιάξε κάτι διαφορετικό.","Δείξε το αγαπημένο σου σημείο.","Δοκίμασε με δικό σου τρόπο."];
 const isCraft=activity.kind==="craft",isColor=activity.kind==="coloring",isStory=activity.kind==="story";
 const shapes=isCraft?CRAFT_PATTERNS[activity.id]:SCENES[activity.id];
 const story=NOVEMBER_STORIES[activity.id]||[],craft=NOVEMBER_CRAFT_STEPS[activity.id];
 const end=()=>{if(!finished){finishNovemberActivity(activity.id,Date.now()-startedAt);setFinished(true);}};
 const print=()=>downloadSvg(svgMarkup(shapes||[],[],activity.titleEL,true),activity.id+"-A4.svg");
 return <div className="nov-dialog-back" role="dialog" aria-modal="true" aria-label={activity.titleEL}><section className="nov-dialog">
  <header><img src={bearLogo} alt="Πισιπούκ το αρκουδάκι"/><div><small>{activity.age} ετών • {activity.domain}</small><h3>{activity.titleEL}</h3></div><button onClick={onClose}>✕ Κλείσιμο</button></header>
  <p>{activity.promptEL} {variantHints[variant%variantHints.length]}</p>
  {shapes&&<div className="nov-artboard">
   <svg viewBox="0 0 210 297" role="img" aria-label={activity.titleEL}><rect width="210" height="297" fill="white"/>
    {shapes.map((d,i)=><path key={i} d={d} stroke="#263c54" strokeWidth="2.3" fill={isCraft?"white":paint[i]||"white"} onClick={()=>{if(!isCraft)setPaint(p=>({...p,[i]:color}))}} style={{cursor:isCraft?"default":"pointer"}}/>)}
   </svg>
   {!isCraft&&<div className="nov-palette" aria-label="Διάλεξε χρώμα">{PALETTE.map(c=><button key={c} aria-label={"Χρώμα "+c} aria-pressed={color===c} style={{background:c}} onClick={()=>setColor(c)}/>)}</div>}
   <div className="nov-row"><button onClick={print}>Εκτυπώσιμο πατρόν Α4</button>{!isCraft&&<button onClick={()=>downloadSvg(svgMarkup(shapes,Array.from({length:shapes.length},(_,i)=>paint[i]||"white"),activity.titleEL),activity.id+"-colored.svg")}>Αποθήκευση ζωγραφιάς</button>}</div>
   {isCraft&&<div><b>Υλικά: {craft.materials}</b><ol>{craft.steps.map(s=><li key={s}>{s}</li>)}</ol><small>Κοπή, μικρά υλικά και εργαλεία μόνο με επίβλεψη ενηλίκου.</small></div>}
  </div>}
  {isStory&&<div className="nov-story"><p>{story[step]}</p><div className="nov-row"><button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}>Πίσω</button><span>{step+1}/{story.length}</span><button onClick={()=>setStep(s=>Math.min(story.length-1,s+1))} disabled={step===story.length-1}>Συνέχεια</button></div><div className="nov-row"><button onClick={()=>setChoice("Τι θα έκανες εσύ;")}>Φαντάζομαι άλλο τέλος</button><button onClick={()=>setChoice("Πώς ένιωθαν οι φίλοι;")}>Μιλάμε για τα συναισθήματα</button></div>{choice&&<p>{choice} Μίλησε με έναν μεγάλο και ζωγράφισε την απάντηση.</p>}</div>}
  {activity.kind==="music"&&<div className="nov-music"><b>Δοκίμασε ήχους με δικό σου ρυθμό.</b><div className="nov-row">{[0,1,2,3].map(i=><button key={i} onClick={()=>{playSound(i+variant);setSoundCount(n=>n+1)}} aria-label={"Μουσικό πλήκτρο "+(i+1)}>♪ {i+1}</button>)}</div><p>{soundCount} ήχοι • χωρίς σωστό και λάθος</p></div>}
  {["mission","stem","social","quest"].includes(activity.kind)&&<div className="nov-explore"><h4>Δοκιμάζω με έναν μεγάλο</h4><p>{activity.parentEL}</p><p>{["Παρατήρησε κάτι διαφορετικό.","Δοκίμασε και μια δεύτερη ιδέα.","Πες με δικά σου λόγια τι ανακάλυψες."][variant%3]}</p>{activity.kind==="stem"&&<p>Πρώτα κάνουμε πρόβλεψη, έπειτα δοκιμή και τέλος συζητάμε τι παρατηρήσαμε.</p>}{activity.kind==="quest"&&<p>Εξερεύνησε τρεις στάσεις: παρατήρηση → επιλογή → αφήγηση. Διάλεξε εσύ τη σειρά των στάσεων.</p>}</div>}
  <aside><b>Μαζί με έναν μεγάλο</b><p>{activity.parentEL}</p></aside>
  <div className="nov-row"><button className="nov-done" onClick={end}>{finished?"Η δραστηριότητα ολοκληρώθηκε":"Ολοκληρώσαμε μαζί"}</button><button onClick={onClose}>Πίσω στον κόσμο</button></div>
 </section></div>;
}
export function NovemberPack({age}:{age:PackAge}){
 const [group,setGroup]=useState("game"),[selected,setSelected]=useState<PackActivity|null>(null),[variant,setVariant]=useState(0),[showParent,setShowParent]=useState(false);
 const activities=useMemo(()=>NOVEMBER_ACTIVITIES.filter(a=>a.age===age&&GROUPS.find(g=>g.id===group)?.kinds.includes(a.kind)),[age,group]);
 const open=(a:PackActivity)=>{setSelected(a);setVariant(startNovemberActivity(a));};
 const handled=useRef(false);
 useEffect(()=>{if(handled.current)return;const id=new URLSearchParams(window.location.search).get("activity");const found=NOVEMBER_ACTIVITIES.find(a=>a.id===id&&a.age===age);if(found){handled.current=true;open(found)}},[age]);
 const stats=getNovemberStats();
 const played=NOVEMBER_ACTIVITIES.filter(a=>a.age===age&&stats[a.id]?.plays).length;
 return <section id="november-2026" className="nov-pack" aria-label="Νοέμβριος 2026: Το Νησί της Βροχής">
  <style>{CSS}</style>
  <div className="nov-hero"><img src={bearLogo} alt="Πισιπούκ, το αρκουδάκι"/><div><small>ΜΗΝΙΑΙΑ ΠΕΡΙΠΕΤΕΙΑ • ΝΟΕΜΒΡΙΟΣ 2026</small><h2>{NOVEMBER_PACK.titleEL}</h2><p>Νέες περιπέτειες για {age} ετών. Αγγίζω, δημιουργώ, εξερευνώ και συνεχίζω το παιχνίδι έξω από την οθόνη.</p></div></div>
  <div className="nov-tabs" role="tablist" aria-label="Διάλεξε δραστηριότητες">{GROUPS.map(g=><button key={g.id} role="tab" aria-selected={group===g.id} onClick={()=>setGroup(g.id)}>{g.title}</button>)}</div>
  <div className="nov-grid">{activities.map(a=><button key={a.id} className="nov-card" onClick={()=>open(a)}>
   <div className="nov-card-shape" aria-hidden="true"><i/><i/><i/></div><small>{a.kind==="game3d"?"3D • ":a.kind==="coloring"?"Α4 • ":""}{a.domain}</small><h3>{a.titleEL}</h3><p>{a.promptEL}</p><span>Παίζω / δημιουργώ →</span>
  </button>)}</div>
  <div className="nov-footer"><p><b>Δική μας δημιουργία.</b> Όλες οι σκηνές και οι ιστορίες είναι πρωτότυπες. Τα στατιστικά μένουν στη συσκευή, χωρίς ονόματα παιδιών, βαθμούς ή ανταγωνισμό.</p><button onClick={()=>setShowParent(v=>!v)}>Γωνιά γονέα • {played} δραστηριότητες δοκιμάστηκαν</button></div>
  {showParent&&<div className="nov-parent-summary"><h3>Τοπική εικόνα παιχνιδιού</h3>{NOVEMBER_ACTIVITIES.filter(a=>a.age===age&&stats[a.id]).map(a=><p key={a.id}>{a.titleEL}: {stats[a.id].plays} επισκέψεις, {stats[a.id].completions} ολοκληρώσεις, {stats[a.id].retries} επαναπροσπάθειες</p>)}<p>Δεν αποστέλλεται τίποτα σε διακομιστή. Αυτά δεν αποτελούν αξιολόγηση ανάπτυξης.</p></div>}
  {selected&&(selected.kind==="game3d"?<November3DGame key={selected.id} activity={selected} initialVariant={variant} onClose={()=>setSelected(null)}/>:<Detail key={selected.id+":"+variant} activity={selected} variant={variant} onClose={()=>setSelected(null)}/>)}
 </section>;
}
const CSS=`
.nov-pack{margin:42px auto 0;max-width:1320px;padding:30px;border-radius:32px;background:linear-gradient(145deg,#f0f9ff,#fff7e9);color:#263b55;font-family:inherit}
.nov-hero{display:flex;align-items:center;gap:20px}.nov-hero img{width:110px;height:110px;object-fit:contain;border-radius:30px}.nov-hero small{letter-spacing:.14em;font-weight:800;color:#34648c}.nov-hero h2{font-size:clamp(26px,4vw,48px);margin:8px 0}.nov-hero p{max-width:650px}
.nov-tabs{display:flex;gap:9px;overflow-x:auto;padding:22px 0}.nov-tabs button{white-space:nowrap;border:1px solid #d4e4e8;border-radius:20px;padding:14px 18px;background:white;font-weight:800}.nov-tabs [aria-selected=true]{background:#365e93;color:white}
.nov-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px}.nov-card{text-align:left;min-height:240px;padding:20px;border-radius:25px;border:1px solid #dbe5eb;background:white;box-shadow:0 8px 24px #21466512;color:#263b55;display:flex;flex-direction:column;gap:8px}.nov-card h3{font-size:21px;margin:0}.nov-card p{margin:0;line-height:1.4}.nov-card small{font-weight:700;color:#476b83}.nov-card span{margin-top:auto;font-weight:900;color:#275e93}
.nov-card-shape{height:65px;display:flex;align-items:center;gap:8px}.nov-card-shape i{width:36px;height:36px;border-radius:45% 55% 65% 35%;background:#90c7e6;transform:rotate(-15deg)}.nov-card-shape i:nth-child(2){background:#eec58a;transform:rotate(24deg)}.nov-card-shape i:nth-child(3){background:#a3cfa6;transform:rotate(-25deg)}
.nov-footer{display:flex;gap:16px;justify-content:space-between;align-items:center;margin-top:20px;flex-wrap:wrap}.nov-footer p{max-width:650px}.nov-footer button,.nov-row button,.nov-game-header button,.nov-game-finish button,.nov-dialog header button{border:0;border-radius:14px;padding:12px 16px;background:#35659a;color:white;font-weight:800;min-height:46px}
.nov-parent-summary{padding:20px;background:white;border-radius:20px}.nov-dialog-back,.nov-game-overlay{position:fixed;inset:0;z-index:9999;background:#102b47d9;display:grid;place-items:center;padding:10px}
.nov-dialog{background:#fffdf8;width:min(780px,100%);max-height:96dvh;overflow:auto;border-radius:26px;padding:20px;color:#263b55}.nov-dialog header{display:flex;gap:12px;align-items:center}.nov-dialog header img{width:68px;height:68px;object-fit:contain}.nov-dialog header div{flex:1}.nov-dialog header h3{margin:0;font-size:24px}.nov-dialog header small{font-size:12px}.nov-dialog>p{font-size:19px}
.nov-artboard{max-width:560px;margin:auto}.nov-artboard>svg{display:block;width:min(100%,380px);max-height:48dvh;margin:auto;background:white;border:1px solid #dce4e9}.nov-artboard ol{padding-left:25px}.nov-palette,.nov-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:15px 0}.nov-palette button{width:48px;height:48px;border:2px solid #b5c6d7;border-radius:50%}.nov-palette button[aria-pressed=true]{outline:3px solid #234e80}
.nov-dialog aside,.nov-explore,.nov-music,.nov-story{background:#eaf6ff;padding:17px;border-radius:16px}.nov-dialog .nov-done{background:#28745d}.nov-row button:disabled{opacity:.45}.nov-game-frame{position:relative;width:min(100%,1100px);height:min(92dvh,780px);overflow:hidden;border-radius:24px;background:#cfeaff}.nov-game-canvas{display:block;width:100%;height:100%;touch-action:none}.nov-game-header{position:absolute;left:12px;right:12px;top:12px;display:flex;justify-content:space-between;gap:8px;align-items:center;background:#ffffffde;padding:9px;border-radius:18px}.nov-game-header strong{font-size:clamp(14px,2.6vw,24px)}.nov-game-message{position:absolute;left:12px;bottom:92px;max-width:min(450px,90%);background:#ffffffee;border-radius:20px;padding:10px;display:flex;align-items:center;gap:10px}.nov-game-message img{width:65px;height:65px;object-fit:contain}.nov-game-message p{margin:5px 0}.nov-game-parent{position:absolute;left:12px;right:12px;bottom:10px;background:#fff8e3e9;border-radius:15px;padding:10px}.nov-game-finish{position:absolute;inset:20% 10%;display:grid;align-content:center;justify-items:center;gap:10px;background:#fffdf2f5;border-radius:25px;padding:20px;text-align:center}
@media(max-width:650px){.nov-pack{padding:14px;border-radius:18px}.nov-hero img{width:68px;height:68px}.nov-hero{align-items:flex-start}.nov-grid{grid-template-columns:1fr 1fr;gap:9px}.nov-card{min-height:210px;padding:12px}.nov-card h3{font-size:17px}.nov-card p{font-size:13px}.nov-game-header button{padding:8px;min-height:42px}.nov-game-message{bottom:102px}.nov-game-parent{font-size:12px}}
@media(max-width:380px){.nov-grid{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.nov-card-shape i{transform:none}}
`;
