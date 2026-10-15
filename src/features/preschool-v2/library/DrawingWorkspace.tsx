import {useEffect,useMemo,useRef,useState,type MouseEvent,type PointerEvent} from "react";
import {Brush,Download,Eraser,ImageDown,PaintBucket,Pencil,Printer,Redo2,RotateCcw,Undo2} from "lucide-react";
import {printTemplate,printableSvg,saveSvg} from "./PatternStudio";
import type {Pattern} from "./studioContent";
import {artwork} from "./studioContent";
import "./DrawingWorkspace.css";

/** Author's original SVG is always the immutable base layer.
 * Pointer/stylus/mouse brush strokes are normalized to its 600 x 600 viewBox.
 * Fill and stroke edits have a single undo/redo history and can be exported together.
 */
type Tool="pencil"|"marker"|"eraser"|"fill";
type Point=[number,number];
type Stroke={id:string;points:Point[];color:string;width:number;opacity:number;tool:"pencil"|"marker"};
type ArtworkState={strokes:Stroke[];fills:Record<string,string>};
type History={past:ArtworkState[];present:ArtworkState;future:ArtworkState[]};
const EMPTY:ArtworkState={strokes:[],fills:{}};
const FRESH=():History=>({past:[],present:EMPTY,future:[]});
const SIZES=[4,8,13,20,28,38];
const PALETTE=["#273b50","#f05d60","#f7ab43","#f1d24e","#73bb79","#299acc","#8770ce","#e187b5","#845b3b","#ffffff"];
const ns="http://www.w3.org/2000/svg";
const PREC=2;
const round=(n:number)=>Math.round(n*10**PREC)/10**PREC;
const clamp=(n:number)=>Math.min(600,Math.max(0,n));
const pathFor=(points:Point[])=>points.map(([x,y],i)=>(i?"L":"M")+round(x)+" "+round(y)).join(" ");
const distToSegment=(x:number,y:number,a:Point,b:Point)=>{
 const dx=b[0]-a[0],dy=b[1]-a[1],len=dx*dx+dy*dy;
 const t=len?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/len)):0;
 return Math.hypot(x-(a[0]+dx*t),y-(a[1]+dy*t));
};
const hits=(p:Point,stroke:Stroke,radius:number)=>stroke.points.length<=1?
 Math.hypot(stroke.points[0][0]-p[0],stroke.points[0][1]-p[1])<radius+stroke.width/2:
 stroke.points.some((q,i)=>i>0&&distToSegment(p[0],p[1],stroke.points[i-1],q)<radius+stroke.width/2);
const strokeSize=(tool:Tool,size:number)=>tool==="marker"?Math.max(10,size):tool==="pencil"?Math.min(24,size):size;
const drawStroke=(stroke:Stroke, i:number)=>stroke.points.length===1?
 <circle key={stroke.id||i} cx={stroke.points[0][0]} cy={stroke.points[0][1]} r={stroke.width/2} fill={stroke.color} opacity={stroke.opacity} data-test-drawn-stroke="true"/>:
 <path key={stroke.id||i} d={pathFor(stroke.points)} fill="none" stroke={stroke.color} strokeWidth={stroke.width} strokeOpacity={stroke.opacity} strokeLinecap="round" strokeLinejoin="round" data-test-drawn-stroke="true"/>;

type PointerSession={pointerId:number;tool:Tool;start:Point;points:Point[];removed:Set<string>;brush:Stroke|null};
export function DrawingWorkspace({pattern,age}:{pattern:Pattern|null;age:number}){
 const [tool,setTool]=useState<Tool>("pencil");
 const [color,setColor]=useState("#f05d60");
 const [size,setSize]=useState(9);
 const [snapshots,setSnapshots]=useState<Record<string,History>>({});
 const [draft,setDraft]=useState<Stroke|null>(null);
 const [erased,setErased]=useState<string[]>([]);
 const [message,setMessage]=useState("Διάλεξε μολύβι ή μαρκαδόρο και σύρε το ποντίκι πάνω στη ζωγραφιά.");
 const artRef=useRef<HTMLDivElement>(null);
 const boardRef=useRef<HTMLDivElement>(null);
 const currentRef=useRef<PointerSession|null>(null);
 const idRef=useRef(0);
 const key=age+"-"+(pattern?.id||"free");
 const title=pattern?.title||"Η ελεύθερη ζωγραφιά μου";
 const initial=useMemo(()=>pattern?artwork(pattern,age,false):
 '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="#ffffff"/></svg>',
 [pattern,age]);
 const history=snapshots[key]||FRESH(),present=history.present;
 const refForPrint=useRef(present);
 refForPrint.current=present;
 const commit=(next:ArtworkState)=>{
  setSnapshots(all=>{const h=all[key]||FRESH();if(h.present===next)return all;
   return {...all,[key]:{past:[...h.past.slice(-79),h.present],present:next,future:[]}};});
 };
 const undo=()=>setSnapshots(all=>{const h=all[key]||FRESH();if(!h.past.length)return all;
  return {...all,[key]:{past:h.past.slice(0,-1),present:h.past[h.past.length-1],future:[h.present,...h.future]}};});
 const redo=()=>setSnapshots(all=>{const h=all[key]||FRESH();if(!h.future.length)return all;
  return {...all,[key]:{past:[...h.past,h.present],present:h.future[0],future:h.future.slice(1)}};});
 const reset=()=>{if(!present.strokes.length&&!Object.keys(present.fills).length)return;commit({strokes:[],fills:{}});setDraft(null);setErased([]);setMessage("Έχεις ένα καθαρό χαρτί. Μπορείς πάντα να αναιρέσεις.");};
 // Identities of fillable shapes are stable per original immutable SVG.
 useEffect(()=>{
  const shapes=artRef.current?.querySelectorAll<SVGElement>(".a,.b,.c,.d");
  shapes?.forEach((el,i)=>{el.dataset.paintIndex=String(i);el.style.fill=present.fills[String(i)]||"";});
 },[key,present.fills,initial]);
 useEffect(()=>{
  currentRef.current=null;setDraft(null);setErased([]);setMessage("Ζωγράφισε με το ποντίκι, το δάχτυλο ή τη γραφίδα.");
 },[key]);
 const fillShape=(e:MouseEvent<HTMLDivElement>)=>{
  if(tool!=="fill")return;
  const target=e.target as Element;
  const shape=target.closest(".a,.b,.c,.d") as SVGElement|null;
  if(!shape||!artRef.current?.contains(shape))return;
  const id=shape.dataset.paintIndex;
  if(id===undefined)return;
  commit({strokes:present.strokes,fills:{...present.fills,[id]:color}});
  setMessage("Υπέροχο χρώμα! Μπορείς να γεμίσεις κι άλλο μέρος της εικόνας.");
 };
 const coords=(e:PointerEvent<SVGSVGElement>):Point=>{
  const rect=e.currentTarget.getBoundingClientRect();
  const sideX=rect.width||1,sideY=rect.height||1;
  return [clamp((e.clientX-rect.left)/sideX*600),clamp((e.clientY-rect.top)/sideY*600)];
 };
 const eraserHit=(p:Point,s:Stroke)=>hits(p,s,Math.max(14,size*1.5));
 const pointerDown=(e:PointerEvent<SVGSVGElement>)=>{
  if(tool==="fill"||currentRef.current||!e.isPrimary||e.button>0)return;
  e.preventDefault();
  const p=coords(e);
  const stroke:Stroke|null=tool==="eraser"?null:{id:key+"-"+Date.now()+"-"+(++idRef.current),color,width:strokeSize(tool,size),opacity:tool==="marker"?.48:1,tool,points:[p]};
  currentRef.current={pointerId:e.pointerId,tool,start:p,points:[p],removed:new Set<string>(),brush:stroke};
  if(stroke)setDraft(stroke);
  if(tool==="eraser"){
   const ids=present.strokes.filter(s=>eraserHit(p,s)).map(s=>s.id);
   currentRef.current.removed=new Set(ids);setErased(ids);
  }
  e.currentTarget.setPointerCapture(e.pointerId);
 };
 const pointerMove=(e:PointerEvent<SVGSVGElement>)=>{
  const session=currentRef.current;
  if(!session||session.pointerId!==e.pointerId)return;
  e.preventDefault();
  const p=coords(e),previous=session.points.at(-1)!;
  if(Math.hypot(p[0]-previous[0],p[1]-previous[1])<.8)return;
  session.points.push(p);
  if(session.tool==="eraser"){
   const removal=session.removed;
   // Sweep across the movement segment to erase fast mouse/stylus movement.
   const distance=Math.hypot(p[0]-previous[0],p[1]-previous[1]);
   const n=Math.max(1,Math.ceil(distance/12));
   for(let k=0;k<=n;k++){
    const q:Point=[previous[0]+(p[0]-previous[0])*k/n,previous[1]+(p[1]-previous[1])*k/n];
    for(const s of present.strokes)if(!removal.has(s.id)&&eraserHit(q,s))removal.add(s.id);
   }
   setErased([...removal]);
  }else if(session.brush){setDraft({...session.brush,points:session.points.slice()})}
 };
 const pointerEnd=(e:PointerEvent<SVGSVGElement>,cancel:boolean)=>{
  const session=currentRef.current;
  if(!session||session.pointerId!==e.pointerId)return;
  // On pointerup, include the final point even if the mouse jumped just before release.
  if(!cancel&&session.tool!=="eraser"){
   const p=coords(e),previous=session.points.at(-1)!;
   if(Math.hypot(p[0]-previous[0],p[1]-previous[1])>.6)session.points.push(p);
  }
  if(!cancel){
   if(session.tool==="eraser"){
    if(session.removed.size){
     commit({strokes:present.strokes.filter(s=>!session.removed.has(s.id)),fills:present.fills});
     setMessage("Έσβησες τη γραμμή. Μπορείς να τη σχεδιάσεις ξανά.");
    }
   }else if(session.brush){
    commit({strokes:[...present.strokes,{...session.brush,points:session.points.slice()}],fills:present.fills});
    setMessage("Ωραία! Συνέχισε να δημιουργείς όπως σου αρέσει.");
   }
  }
  if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
  currentRef.current=null;setDraft(null);setErased([]);
 };
 const compositeSvg=()=>{
  const base=artRef.current?.querySelector("svg");
  if(!base)throw Error("Drawing not loaded");
  const copy=base.cloneNode(true) as SVGSVGElement;
  // Inline fills are read from application state rather than from a possibly stale DOM paint.
  copy.querySelectorAll<SVGElement>(".a,.b,.c,.d").forEach((node,i)=>{node.style.fill=refForPrint.current.fills[String(i)]||"";});
  const layer=document.createElementNS(ns,"g");
  layer.setAttribute("data-pisipouk-drawing","original-mouse-pencil-marker");
  for(const s of refForPrint.current.strokes){
   if(!s.points.length)continue;
   const n=document.createElementNS(ns,s.points.length===1?"circle":"path");
   if(s.points.length===1){
    n.setAttribute("cx",String(round(s.points[0][0])));n.setAttribute("cy",String(round(s.points[0][1])));
    n.setAttribute("r",String(s.width/2));n.setAttribute("fill",s.color);n.setAttribute("opacity",String(s.opacity));
   }else{
    n.setAttribute("d",pathFor(s.points));n.setAttribute("fill","none");
    n.setAttribute("stroke",s.color);n.setAttribute("stroke-width",String(s.width));
    n.setAttribute("stroke-opacity",String(s.opacity));
    n.setAttribute("stroke-linecap","round");n.setAttribute("stroke-linejoin","round");
   }
   layer.appendChild(n);
  }
  copy.appendChild(layer);
  copy.setAttribute("xmlns",ns);
  return new XMLSerializer().serializeToString(copy);
 };
 const exportSvg=()=>{try{saveSvg(printableSvg(title,compositeSvg()),"pisipouk-"+(pattern?.id||"free")+"-my-art-a4.svg");setMessage("Η ζωγραφιά αποθηκεύτηκε μαζί με τις γραμμές και τα χρώματά σου.");}catch{setMessage("Δεν μπόρεσε να αποθηκευτεί η εικόνα. Δοκίμασε ξανά.")}};
 const exportPNG=()=>{
  try{
   const svg=compositeSvg(),url=URL.createObjectURL(new Blob([svg],{type:"image/svg+xml;charset=utf-8"})),image=new Image();
   image.onload=()=>{
    try{const canvas=document.createElement("canvas");canvas.width=1800;canvas.height=1800;
     const context=canvas.getContext("2d");if(!context)throw Error("canvas unavailable");
     context.fillStyle="#ffffff";context.fillRect(0,0,1800,1800);context.drawImage(image,0,0,1800,1800);
     canvas.toBlob(blob=>{if(!blob){setMessage("Αποτυχία δημιουργίας PNG.");return}
      const download=URL.createObjectURL(blob),a=document.createElement("a");
      a.href=download;a.download="pisipouk-"+(pattern?.id||"free")+"-my-art.png";a.click();
      window.setTimeout(()=>URL.revokeObjectURL(download),2000);
      setMessage("Αποθηκεύτηκε εικόνα PNG υψηλής ανάλυσης.");
     },"image/png");
    }catch{setMessage("Δεν μπόρεσε να δημιουργηθεί PNG.")}finally{URL.revokeObjectURL(url)}
   };
   image.onerror=()=>{URL.revokeObjectURL(url);setMessage("Δεν φορτώθηκε το σχέδιο για PNG.")};
   image.src=url;
  }catch{setMessage("Δεν ήταν δυνατή η αποθήκευση PNG.")}
 };
 const doPrint=()=>{try{printTemplate(title,compositeSvg());setMessage("Εκτύπωση A4 με τις δικές σου ζωγραφιές και χρώματα.");}catch{setMessage("Η εκτύπωση δεν είναι διαθέσιμη σε αυτό το πρόγραμμα περιήγησης.")}};
 return <div className="pw2-drawing-workspace">
  <div className="pw2-drawing-tools" role="group" aria-label="Εργαλεία ζωγραφικής">
   {([
    ["pencil","Μολύβι",<Pencil key="p"/>],
    ["marker","Μαρκαδόρος",<Brush key="m"/>],
    ["fill","Γέμισμα",<PaintBucket key="f"/>],
    ["eraser","Γόμα",<Eraser key="e"/>]
   ] as Array<[Tool,string,React.ReactNode]>).map(([id,label,icon])=>
    <button key={id} type="button" aria-pressed={tool===id} className={tool===id?"selected":""} onClick={()=>{setTool(id);setMessage(id==="fill"?"Κάνε κλικ μέσα σε ένα περίγραμμα για να το γεμίσεις.":id==="eraser"?"Πέρνα πάνω από μία γραμμή για να τη σβήσεις.":"Κράτα πατημένο το ποντίκι και ζωγράφισε ελεύθερα.");}}>{icon}<span>{label}</span></button>
   )}
  </div>
  <div className="pw2-drawing-palette" role="group" aria-label="Χρώματα ζωγραφικής">
   {PALETTE.map(c=><button key={c} type="button" aria-pressed={c===color} aria-label={"Χρώμα "+c} title={"Χρώμα "+c} onClick={()=>setColor(c)} style={{backgroundColor:c}}/>)}
   <label className="pw2-custom-color">Δικό μου χρώμα <input aria-label="Προσαρμοσμένο χρώμα" type="color" value={color} onChange={e=>setColor(e.target.value)}/></label>
  </div>
  <div className="pw2-drawing-precision">
   <label htmlFor="pw2-pen-width">Πάχος {size}px</label><input id="pw2-pen-width" type="range" min="2" max="38" step="1" value={size} onChange={e=>setSize(Number(e.target.value))} disabled={tool==="fill"} />
   <span className="pw2-brush-preview" style={{width:Math.max(8,Math.min(size,38)),height:Math.max(8,Math.min(size,38)),background:tool==="eraser"?"#fff":color,opacity:tool==="marker"?.48:1}}/>
  </div>
  <div className="pw2-drawing-history" role="group" aria-label="Ιστορικό ζωγραφικής">
   <button type="button" onClick={undo} disabled={!history.past.length}><Undo2 size={19}/> Αναίρεση</button>
   <button type="button" onClick={redo} disabled={!history.future.length}><Redo2 size={19}/> Επανάληψη</button>
   <button type="button" onClick={reset} disabled={!present.strokes.length&&!Object.keys(present.fills).length}><RotateCcw size={19}/> Καθαρισμός</button>
  </div>
  <div className={"pw2-art-surface tool-"+tool} ref={boardRef} aria-label={title}>
   <div className="pw2-art-base" ref={artRef} key={key} role="group" aria-label="Σχέδιο για χρωματισμό" onClick={fillShape} dangerouslySetInnerHTML={{__html:initial}}/>
   <svg className="pw2-drawing-layer" xmlns={ns} viewBox="0 0 600 600" role="img" aria-label={tool==="fill"?"Το ζωγραφισμένο σχέδιο":"Ελεύθερη ζωγραφική με ποντίκι και αφή"} style={{pointerEvents:tool==="fill"?"none":"auto"}}
    onPointerDown={pointerDown} onPointerMove={pointerMove}
    onPointerUp={e=>pointerEnd(e,false)}
    onPointerCancel={e=>pointerEnd(e,true)}>
    {present.strokes.filter(x=>!erased.includes(x.id)).map(drawStroke)}
    {draft&&drawStroke(draft,-1)}
   </svg>
  </div>
  <p className="pw2-drawing-status" role="status" aria-live="polite">{message}</p>
  <div className="pw2-drawing-actions">
   <button type="button" className="pw2-main-button" onClick={exportPNG}><ImageDown size={18}/> Αποθήκευση PNG</button>
   <button type="button" className="pw2-outline" onClick={exportSvg}><Download size={18}/> Αποθήκευση A4 SVG</button>
   <button type="button" className="pw2-outline" onClick={doPrint}><Printer size={18}/> Εκτύπωση / PDF</button>
  </div>
  <p className="pw2-drawing-footnote">Οι δημιουργίες μένουν στον browser κατά τη χρήση του Ατελιέ και δεν αποστέλλονται σε διακομιστή. Οι εκτυπώσεις και τα αρχεία περιλαμβάνουν και τις δικές σου γραμμές.</p>
 </div>;
}
