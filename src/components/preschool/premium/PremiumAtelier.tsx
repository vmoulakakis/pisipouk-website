import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, Brush, Download, Eraser, Heart, PaintBucket, Printer, RotateCcw, Scissors, Sparkles, Undo2 } from "lucide-react";
import { AGE_BANDS, MOTIFS, PAINT_SWATCHES, galleryPreview, printableSvg, templateCount, type AgeBand } from "./illustrationAtlas";
import "./premium.css";

type Tool = "fill"|"brush"|"eraser"|"heart";
const saveBlob=(blob:Blob,name:string)=>{const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1800);};
function useCanvasDraw(){
 const ref=useRef<HTMLCanvasElement|null>(null);
 const active=useRef(false);
 const snapshots=useRef<ImageData[]>([]);
 const point=(e:PointerEvent<HTMLCanvasElement>)=>{const rect=e.currentTarget.getBoundingClientRect();return {x:(e.clientX-rect.left)*840/rect.width,y:(e.clientY-rect.top)*1188/rect.height};};
 const clear=()=>{const el=ref.current;const ctx=el?.getContext("2d");if(ctx)ctx.clearRect(0,0,840,1188);snapshots.current=[];};
 const snapshot=()=>{const ctx=ref.current?.getContext("2d");if(!ctx)return;snapshots.current.push(ctx.getImageData(0,0,840,1188));if(snapshots.current.length>12)snapshots.current.shift();};
 const undo=()=>{const prev=snapshots.current.pop(),ctx=ref.current?.getContext("2d");if(prev&&ctx)ctx.putImageData(prev,0,0);};
 const start=(e:PointerEvent<HTMLCanvasElement>,tool:Tool,color:string)=>{
  e.preventDefault();const c=e.currentTarget,ctx=c.getContext("2d");if(!ctx)return;snapshot();c.setPointerCapture(e.pointerId);const p=point(e);
  if(tool==="heart"){ctx.fillStyle=color;ctx.font="70px serif";ctx.fillText("♥",p.x-30,p.y+25);return;}
  active.current=true;ctx.globalCompositeOperation=tool==="eraser"?"destination-out":"source-over";ctx.strokeStyle=tool==="eraser"?"#000":color;ctx.lineWidth=tool==="eraser"?55:19;ctx.lineJoin="round";ctx.lineCap="round";ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+.1,p.y+.1);ctx.stroke();
 };
 const move=(e:PointerEvent<HTMLCanvasElement>)=>{if(!active.current)return;const ctx=e.currentTarget.getContext("2d");if(!ctx)return;const p=point(e);ctx.lineTo(p.x,p.y);ctx.stroke();};
 const stop=()=>{active.current=false;const ctx=ref.current?.getContext("2d");if(ctx)ctx.globalCompositeOperation="source-over";};
 return {ref,start,move,stop,clear,undo};
}
async function renderPng(svg:string):Promise<Blob>{
 const img=new Image();const url=URL.createObjectURL(new Blob([svg],{type:"image/svg+xml;charset=utf-8"}));
 try{await new Promise<void>((resolve,reject)=>{img.onload=()=>resolve();img.onerror=()=>reject(new Error("Δεν έγινε απόδοση της εικόνας."));img.src=url;});
 const canvas=document.createElement("canvas");canvas.width=1680;canvas.height=2376;const ctx=canvas.getContext("2d");if(!ctx)throw new Error("Δεν υπάρχει καμβάς.");
 ctx.fillStyle="white";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
 return await new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error("Αδυναμία PNG")),"image/png"));}finally{URL.revokeObjectURL(url);}
}
function TemplateSheet({id,age,fills,onPaint,canvasRef,tool,color,onPointerDown,onPointerMove,onPointerUp}:{id:string;age:AgeBand;fills:Record<string,string>;onPaint:(zone:string)=>void;canvasRef:React.RefObject<HTMLCanvasElement|null>;tool:Tool;color:string;onPointerDown:(e:PointerEvent<HTMLCanvasElement>,tool:Tool,color:string)=>void;onPointerMove:(e:PointerEvent<HTMLCanvasElement>)=>void;onPointerUp:()=>void}){
 const svg=printableSvg(id,age,fills);
 return <div className="premium-paper" aria-label="Διαδραστικό πατρόν ζωγραφικής">
  <div className="premium-vector" onClick={e=>{if(tool!=="fill")return;const node=e.target as SVGElement;const zone=node.closest("[data-zone]")?.getAttribute("data-zone");if(zone)onPaint(zone);}} dangerouslySetInnerHTML={{__html:svg}}/>
  <canvas className={"premium-ink "+(tool!=="fill"?"premium-ink-active":"")} style={{pointerEvents:tool==="fill"?"none":"auto",zIndex:tool==="fill"?0:5,touchAction:"none"}} width={840} height={1188} ref={canvasRef} aria-label="Καμβάς ελεύθερης ζωγραφικής" onPointerDown={e=>onPointerDown(e,tool,color)} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}/>
 </div>;
}
const instructions=[
 {icon:"🎨",title:"Χρωματίζω",description:"Γεμίζω τις περιοχές, σχεδιάζω ή προσθέτω καρδιές."},
 {icon:"🖨️",title:"Εκτυπώνω",description:"Αποθηκεύω σε PDF ή τυπώνω σε χαρτί Α4 / Α5."},
 {icon:"✂️",title:"Κόβουμε μαζί",description:"Ο ενήλικος κόβει μόνο τα κατάλληλα περιγράμματα."},
 {icon:"🧩",title:"Δημιουργώ",description:"Χρησιμοποιώ την εικόνα για ιστορία, κολάζ ή κατασκευή."}
];
export function PremiumAtelier({age}:{age:AgeBand}){
 const [selected,setSelected]=useState<string|null>(null);
 const [category,setCategory]=useState("Όλα");
 const [color,setColor]=useState("#f4aa91");
 const [tool,setTool]=useState<Tool>("fill");
 const [fills,setFills]=useState<Record<string,string>>({});
 const fillHistory=useRef<Record<string,string>[]>([]);
 const [busy,setBusy]=useState(false);
 const [status,setStatus]=useState("");
 const draw=useCanvasDraw();
 const available=MOTIFS.filter(x=>category==="Όλα"||x.category===category);
 const current=MOTIFS.find(x=>x.id===selected);
 const categories=["Όλα",...Array.from(new Set(MOTIFS.map(x=>x.category)))];
 const choose=(id:string)=>{setSelected(id);setFills({});fillHistory.current=[];setStatus("");setTool("fill");draw.clear();};
 useEffect(()=>{setSelected(null);setCategory("Όλα");},[age]);
 const build=()=>{if(!selected)return"";let svg=printableSvg(selected,age,fills);const canvas=draw.ref.current;if(canvas){const img=canvas.toDataURL("image/png");svg=svg.replace("</svg>",'<image x="0" y="0" width="420" height="594" href="'+img+'"/></svg>');}return svg;};
 const saveSvg=()=>{if(!selected)return;saveBlob(new Blob([build()],{type:"image/svg+xml;charset=utf-8"}),"pisipouk-atelier-"+selected+"-"+AGE_BANDS[age]+".svg");setStatus("Το πατρόν αποθηκεύτηκε με τα χρώματά σου!");};
 const savePdf=async()=>{if(!selected)return;setBusy(true);setStatus("Δημιουργώ το αρχείο εκτύπωσης…");try{const png=await renderPng(build());const bytes=new Uint8Array(await png.arrayBuffer());const {PDFDocument}=await import("pdf-lib");const doc=await PDFDocument.create();const page=doc.addPage([595.28,841.89]);const embedded=await doc.embedPng(bytes);page.drawImage(embedded,{x:0,y:0,width:595.28,height:841.89});const pdf=await doc.save();saveBlob(new Blob([new Uint8Array(pdf)],{type:"application/pdf"}),"pisipouk-atelier-"+selected+"-A4.pdf");setStatus("Έτοιμο PDF υψηλής ανάλυσης για εκτύπωση!");}catch(e){setStatus("Πρόβλημα στην εξαγωγή PDF: "+(e instanceof Error?e.message:"δοκίμασε ξανά"));}finally{setBusy(false);}};
 const savePng=async()=>{if(!selected)return;setBusy(true);try{saveBlob(await renderPng(build()),"pisipouk-"+selected+"-coloring.png");setStatus("Η ζωγραφιά αποθηκεύτηκε!");}catch{setStatus("Η εικόνα δεν αποθηκεύτηκε.");}finally{setBusy(false);}};
 const print=()=>{if(!selected)return;const win=window.open("","_blank");if(!win){setStatus("Επίτρεψε τα παράθυρα εκτύπωσης ή πάτησε PDF.");return;}
 win.document.open();win.document.write('<!doctype html><html lang="el"><head><meta charset="utf-8"/><title>Πισιπούκ · Εκτύπωση</title><style>@page{size:A4;margin:0}html,body{margin:0;padding:0}svg{display:block;width:210mm;height:297mm}</style></head><body>'+build()+'<script>window.onload=function(){setTimeout(function(){window.print()},250)}</script></body></html>');win.document.close();};
 const handleUndo=()=>{if(tool==="fill"){const previous=fillHistory.current.pop();if(previous)setFills(previous);}else draw.undo();};
 return <section className="premium-studio" aria-label="Atelier Πισιπούκ">
 <div className="premium-intro"><span>ΤΟ ΜΑΓΙΚΟ ΑΤΕΛΙΕ</span><h2>Χρώματα, φαντασία, αληθινές δημιουργίες!</h2><p>Διάλεξε ένα από τα <b>{MOTIFS.length} πατρόν</b> για την ηλικία {AGE_BANDS[age]}. Όλες οι εικόνες ζωγραφίζονται στην οθόνη και τυπώνονται.</p></div>
 {!current?<><div className="premium-filters">{categories.map(c=><button key={c} aria-pressed={c===category} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="premium-gallery">{available.map((m,i)=><button className="premium-tile" key={m.id} onClick={()=>choose(m.id)} aria-label={"Ζωγράφισε: "+m.title}><div className="premium-tile-art"><svg viewBox="0 0 400 400" aria-hidden="true" dangerouslySetInnerHTML={{__html:galleryPreview(m.id)}}/></div><span className="premium-tile-index">#{String(i+1).padStart(2,"0")}</span><strong>{m.title}</strong><small>{m.category} · {AGE_BANDS[age]} ετών</small><b>Ζωγράφισε <Brush size={17}/></b></button>)}</div></>:
 <div className="premium-editor"><div className="premium-editor-top"><button onClick={()=>{setSelected(null);setStatus("");}}>← Όλα τα πατρόν</button><div><b>{current.title}</b><span>Προσωπικό έργο • {AGE_BANDS[age]} ετών</span></div><button onClick={()=>{setFills({});fillHistory.current=[];draw.clear();setStatus("Καθαρό χαρτί!");}}><RotateCcw size={17}/> Από την αρχή</button></div>
 <div className="premium-workstation"><div className="premium-paint-sidebar"><h3>Το κουτί με τα εργαλεία</h3><div className="premium-paint-tools">
 {([{id:"fill" as Tool,label:"Γεμίζω",Icon:PaintBucket},{id:"brush" as Tool,label:"Πινέλο",Icon:Brush},{id:"eraser" as Tool,label:"Σβήνω",Icon:Eraser},{id:"heart" as Tool,label:"Στολίζω",Icon:Heart}]).map(t=><button key={t.id} aria-pressed={tool===t.id} onClick={()=>setTool(t.id)}><t.Icon size={22}/>{t.label}</button>)}</div>
 <h3>Διάλεξε χρώμα</h3><div className="premium-palette">{PAINT_SWATCHES.map(c=><button key={c} style={{background:c}} aria-label={"Επίλεξε χρώμα "+c} aria-pressed={color===c} onClick={()=>setColor(c)}/>)}</div><button className="premium-secondary" onClick={handleUndo}><Undo2/> Αναίρεση</button><p className="premium-tip"><Sparkles size={18}/> Αγγίζω μια περιοχή για να την γεμίσω. Με το πινέλο σχεδιάζω ελεύθερα!</p></div>
 <div className="premium-paper-stage"><TemplateSheet key={selected+"-"+age} id={selected} age={age} fills={fills} onPaint={zone=>{fillHistory.current.push({...fills});setFills(prev=>({...prev,[zone]:color}));}} canvasRef={draw.ref} tool={tool} color={color} onPointerDown={draw.start} onPointerMove={draw.move} onPointerUp={draw.stop}/></div>
 <div className="premium-export"><h3>Το έργο μου είναι έτοιμο!</h3><p>Πάρε τη ζωγραφιά σου έξω από την οθόνη.</p><button onClick={savePdf} disabled={busy} className="premium-export-primary"><Printer/> {busy?"Ετοιμάζεται…":"PDF για εκτύπωση"}</button><button onClick={print}><Printer/> Άμεση εκτύπωση</button><button onClick={savePng} disabled={busy}><Download/> PNG εικόνα</button><button onClick={saveSvg}><Download/> SVG πατρόν</button><p role="status" aria-live="polite">{status}</p><div className="premium-instructions">{instructions.map((step,i)=><div key={i}><span>{step.icon}</span><div><b>{step.title}</b><small>{step.description}</small></div></div>)}</div><p className="premium-safety"><Scissors size={17}/> Το κόψιμο και η χρήση εργαλείων γίνονται από ενήλικο ή με επίβλεψη.</p></div>
 </div></div>}
 <div className="premium-count">{templateCount()} αρχικές ηλικιακές παραλλαγές πατρόν • 20 σχέδια × 4 επίπεδα λεπτομέρειας • 100% πρωτότυπα SVG</div>
 </section>;
}
