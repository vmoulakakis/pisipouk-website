import { useRef, useState, type PointerEvent } from "react";
import { Download, Paintbrush, Printer, RotateCcw, Undo2, Eraser, PaintBucket, ArrowLeft, ImageDown } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

type SheetId = "dove" | "flag" | "olive" | "oxi";
type Shape = { id: string; d: string; fill?: string; width?: number };
type Sheet = { id: SheetId; title: string; hint: string; shapes: Shape[] };
const sheets: Sheet[] = [
  { id: "dove", title: "Το περιστέρι της ειρήνης", hint: "Χρωμάτισε τα φτερά και το κλαδί ελιάς.", shapes: [
    { id: "body", d: "M194 550 C137 530 111 466 145 404 C167 363 210 355 246 379 C255 326 305 302 340 323 C371 341 382 383 365 415 C422 407 490 358 537 310 C567 283 598 287 608 311 C622 345 575 405 520 457 C597 433 634 445 636 474 C643 518 552 561 461 580 C414 627 350 651 284 626 C244 612 218 583 194 550 Z" },
    { id: "wing", d: "M291 508 C295 448 373 381 498 306 C522 292 543 302 538 324 C532 356 508 381 477 408 C537 368 569 384 560 409 C548 450 462 512 376 543 Z" },
    { id: "wing2", d: "M331 517 C366 464 446 439 499 435 C529 432 540 449 517 468 C476 508 417 542 364 551 Z" },
    { id: "tail", d: "M427 563 C503 576 573 601 598 631 C614 652 598 670 572 659 C543 648 518 637 490 624 C530 659 542 682 524 692 C503 705 468 662 435 621 C462 675 451 704 430 694 C413 683 403 635 389 597 Z" },
    { id: "head", d: "M207 411 C201 361 239 322 288 324 C333 325 358 362 346 406 C331 455 270 473 229 452 Z" },
    { id: "beak", d: "M220 403 L154 420 L218 439 Z" },
    { id: "leaf1", d: "M150 417 C113 386 96 358 115 344 C135 332 155 366 171 405 Z" },
    { id: "leaf2", d: "M170 425 C143 443 118 473 99 458 C80 444 126 413 159 411 Z" },
    { id: "leaf3", d: "M149 406 C138 377 143 347 162 341 C188 334 182 377 165 417 Z" },
    { id: "leaf4", d: "M128 435 C113 461 89 480 76 467 C64 449 101 425 132 424 Z" },
  ]},
  { id: "flag", title: "Η ελληνική σημαία", hint: "Εναλλάσσω μπλε και λευκές λωρίδες.", shapes: [
    { id:"pole", d:"M163 270 L181 270 L181 787 L163 787 Z" },
    { id:"flag-outline", d:"M183 283 Q294 248 410 285 Q520 323 612 275 L612 619 Q525 668 411 622 Q294 579 183 619 Z" },
    ...[0,1,2,3,4,5,6,7,8].map(n => ({id:"stripe"+n,d:"M183 "+(288+n*37)+" Q294 "+(251+n*37)+" 410 "+(288+n*37)+" Q520 "+(322+n*37)+" 612 "+(273+n*37)+" L612 "+(310+n*37)+" Q520 "+(359+n*37)+" 410 "+(325+n*37)+" Q294 "+(288+n*37)+" 183 "+(325+n*37)+" Z"})),
    { id:"cross-h",d:"M183 365 Q265 340 365 365 L365 406 Q259 378 183 408 Z" },
    { id:"cross-v",d:"M247 272 L294 269 L294 490 L247 490 Z" },
  ]},
  { id: "olive", title: "Η ελιά της ειρήνης", hint: "Ζωγραφίζω πράσινα φύλλα και μικρές ελιές.", shapes: [
    {id:"trunk",d:"M330 779 C329 711 351 643 345 575 C335 497 300 444 261 396 L282 380 C337 425 370 471 385 539 C397 468 425 413 483 367 L502 385 C442 453 429 517 421 590 C414 671 425 733 444 779 Z"},
    {id:"branchl",d:"M346 585 C291 543 243 516 177 509 L185 488 C265 491 315 513 360 552 Z"},
    {id:"branchr",d:"M391 574 C452 525 505 506 568 516 L566 538 C503 535 447 552 407 603 Z"},
    ...[[181,485,-30],[210,421,30],[252,459,-30],[293,370,25],[337,422,-15],[395,355,15],[453,403,-15],[495,455,30],[544,485,-30],[170,580,35],[246,573,-25],[502,587,15],[560,565,-30],[358,297,10],[420,303,-25],[295,308,35]].map(([x,y,a],i)=>({id:"leaf"+i,d:"M"+x+" "+y+" C"+(x-49)+" "+(y-48)+" "+(x-57)+" "+(y+12)+" "+x+" "+(y+37)+" C"+(x+54)+" "+(y+5)+" "+(x+43)+" "+(y-36)+" "+x+" "+y+" Z"})),
    ...[[240,510],[301,488],[452,485],[505,542],[339,357],[414,397]].map(([x,y],i)=>({id:"fruit"+i,d:"M"+(x-13)+" "+y+" a13 17 0 1 0 26 0 a13 17 0 1 0 -26 0 Z"})),
  ]},
  { id:"oxi", title:"Ζωγραφίζω το ΟΧΙ", hint:"Κάθε γράμμα και κάθε λουλούδι αποκτά χρώμα.", shapes:[
    {id:"letter-o",d:"M153 368 C153 278 201 246 258 246 C316 246 366 281 366 368 C366 460 317 496 258 496 C199 496 153 461 153 368 Z M220 369 C220 417 235 435 258 435 C284 435 299 413 299 368 C299 326 285 307 258 307 C235 307 220 327 220 369 Z"},
    {id:"letter-x",d:"M378 259 L452 259 L480 331 L511 259 L584 259 L517 368 L588 486 L510 486 L478 408 L446 486 L367 486 L442 365 Z"},
    {id:"letter-i",d:"M318 528 L390 528 L390 770 L318 770 Z"},
    ...[[190,663],[539,665],[248,766],[491,781]].map(([x,y],i)=>({id:"flower"+i,d:"M"+x+" "+(y-42)+" C"+(x-26)+" "+(y-64)+" "+(x-45)+" "+(y-22)+" "+(x-21)+" "+y+" C"+(x-59)+" "+(y+10)+" "+(x-26)+" "+(y+45)+" "+x+" "+(y+19)+" C"+(x+24)+" "+(y+58)+" "+(x+55)+" "+(y+16)+" "+(x+25)+" "+y+" C"+(x+57)+" "+(y-33)+" "+(x+21)+" "+(y-59)+" "+x+" "+(y-42)+" Z"})),
    {id:"leaf-bottom-1",d:"M143 830 Q205 750 259 835 Q202 877 143 830 Z"},
    {id:"leaf-bottom-2",d:"M459 836 Q515 760 585 839 Q530 880 459 836 Z"}
  ]}
];
const colors=["#1856a9","#62b5e8","#ffffff","#2f945f","#98ca58","#ffcf48","#ed829b","#ef8d3c","#7355b9","#282f39"];
const safe = (s: string) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
const template = (id: SheetId) => sheets.find(s=>s.id===id)!;
function svgMarkup(sheet:Sheet, fills:Record<string,string>) {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 960" width="720" height="960" role="img" aria-label="'+safe(sheet.title)+'">'+
    '<rect width="720" height="960" fill="white"/><rect x="24" y="24" width="672" height="912" rx="28" fill="white" stroke="#205792" stroke-width="4"/>'+
    '<text x="360" y="96" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="31" fill="#194a83">28η Οκτωβρίου 1940</text>'+
    '<text x="360" y="145" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="27" fill="#305c83">'+safe(sheet.title)+'</text>'+
    '<path d="M96 179 H624" stroke="#d6e7f8" stroke-width="5"/>'+
    sheet.shapes.map(s=>'<path data-region="'+safe(s.id)+'" d="'+safe(s.d)+'" fill="'+safe(fills[s.id]||s.fill||'#ffffff')+'" fill-rule="evenodd" stroke="#253956" stroke-width="'+(s.width||4)+'" stroke-linejoin="round" stroke-linecap="round"/>').join("")+
    (sheet.id==="dove" ? '<circle cx="263" cy="387" r="9" fill="#27384e"/><circle cx="266" cy="384" r="3" fill="white"/><path d="M125 414 L201 418" stroke="#315936" stroke-width="5"/>' : "")+
    '<text x="360" y="901" text-anchor="middle" font-family="Arial,sans-serif" font-size="21" fill="#396587">Πισιπούκ · Ζωγραφίζω με τη φαντασία μου!</text></svg>';
}
function download(blob:Blob,filename:string){const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),10000);}
async function svgToCanvas(svg:string,overlay?:HTMLCanvasElement){
  const img=new Image();const blob=new Blob([svg],{type:"image/svg+xml;charset=utf-8"});const url=URL.createObjectURL(blob);
  try{
    img.src=url;await img.decode();
    const canvas=document.createElement("canvas");canvas.width=1440;canvas.height=1920;
    const ctx=canvas.getContext("2d");if(!ctx)throw Error("Δεν υποστηρίζεται ζωγραφική.");
    ctx.fillStyle="#fff";ctx.fillRect(0,0,1440,1920);ctx.drawImage(img,0,0,1440,1920);
    if(overlay)ctx.drawImage(overlay,0,0,1440,1920);
    return canvas;
  }finally{URL.revokeObjectURL(url);}
}
export function Oxi1940Coloring(){
  const [current,setCurrent]=useState<SheetId>("dove");
  const [color,setColor]=useState("#1856a9");
  const [tool,setTool]=useState<"fill"|"brush"|"eraser">("fill");
  const [brushSize,setBrushSize]=useState(11);
  const [fills,setFills]=useState<Record<string,string>>({});
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const [history,setHistory]=useState(0);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const painting=useRef(false);
  const undoStack=useRef<ImageData[]>([]);
  const sheet=template(current);
  const clearCanvas=()=>{const c=canvasRef.current;c?.getContext("2d")?.clearRect(0,0,720,960);undoStack.current=[];setHistory(0);};
  const select=(id:SheetId)=>{setCurrent(id);setFills({});clearCanvas();setError("");};
  const paintShape=(e:React.MouseEvent<HTMLDivElement>)=>{
    if(tool!=="fill")return;
    const node=(e.target as Element).closest("[data-region]");
    const id=node?.getAttribute("data-region");
    if(id)setFills(old=>({...old,[id]:color}));
  };
  const point=(e:PointerEvent<HTMLCanvasElement>)=>{const r=e.currentTarget.getBoundingClientRect();return{x:(e.clientX-r.left)*720/r.width,y:(e.clientY-r.top)*960/r.height}};
  const down=(e:PointerEvent<HTMLCanvasElement>)=>{
    if(tool==="fill")return;
    const ctx=canvasRef.current?.getContext("2d");if(!ctx)return;
    undoStack.current.push(ctx.getImageData(0,0,720,960));if(undoStack.current.length>12)undoStack.current.shift();setHistory(undoStack.current.length);
    painting.current=true;e.currentTarget.setPointerCapture(e.pointerId);
    const p=point(e);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x,p.y);ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=brushSize*(tool==="eraser"?2:1);
    ctx.globalCompositeOperation=tool==="eraser"?"destination-out":"source-over";ctx.strokeStyle=color;ctx.stroke();
  };
  const move=(e:PointerEvent<HTMLCanvasElement>)=>{if(!painting.current)return;const ctx=canvasRef.current?.getContext("2d");if(!ctx)return;const p=point(e);ctx.lineTo(p.x,p.y);ctx.stroke();};
  const stop=()=>{painting.current=false;canvasRef.current?.getContext("2d")?.closePath();};
  const undo=()=>{const previous=undoStack.current.pop(),ctx=canvasRef.current?.getContext("2d");if(ctx&&previous){ctx.globalCompositeOperation="source-over";ctx.putImageData(previous,0,0);setHistory(undoStack.current.length);}};
  const reset=()=>{setFills({});clearCanvas();};
  async function saveDrawing(){
    setBusy(true);setError("");
    try{const canvas=await svgToCanvas(svgMarkup(sheet,fills),canvasRef.current||undefined);canvas.toBlob(blob=>{if(blob)download(blob,"Pisipouk_OXI1940_"+current+"_zografia.png");else setError("Δεν ήταν δυνατή η λήψη.");setBusy(false);},"image/png");}
    catch(e){setBusy(false);setError("Η αποθήκευση απέτυχε. Δοκίμασε ξανά.");}
  }
  async function getPdf(){
    setBusy(true);setError("");
    try{
      const [{PDFDocument,rgb},fontkit]=await Promise.all([import("pdf-lib"),import("@pdf-lib/fontkit")]);
      const pdf=await PDFDocument.create();pdf.registerFontkit(fontkit.default);
      const f=await fetch("/preschool-world/greek.ttf");if(!f.ok)throw Error("missing font");
      const greek=await pdf.embedFont(await f.arrayBuffer(),{subset:true});
      for(const s of sheets){
        const page=pdf.addPage([595.28,841.89]);
        const picture=await svgToCanvas(svgMarkup(s,{}));
        const png=await pdf.embedPng(picture.toDataURL("image/png"));
        page.drawImage(png,{x:44,y:90,width:507,height:676});
        page.drawText("ΠΙΣΙΠΟΥΚ • 28η Οκτωβρίου 1940",{x:48,y:797,font:greek,size:13,color:rgb(0.12,0.29,0.54)});
        page.drawText("Όνομα: __________________________________",{x:48,y:72,font:greek,size:10,color:rgb(0.2,0.25,0.35)});
        page.drawText("Εκτύπωση: Α4 · 100% · Μονή όψη · Με τη βοήθεια ενήλικα",{x:48,y:45,font:greek,size:9,color:rgb(0.27,0.35,0.43)});
      }
      download(new Blob([new Uint8Array(await pdf.save())],{type:"application/pdf"}),"Pisipouk_28_Oktovriou_1940_4_Patron_A4.pdf");
    }catch(e){setError("Δεν δημιουργήθηκε το PDF. Δοκίμασε ξανά ή χρησιμοποίησε τον εκτυπωτή.");}
    finally{setBusy(false);}
  }
  return <SiteLayout><main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50 px-4 py-7 text-slate-800">
    <div className="mx-auto max-w-6xl">
      <a href="/october-1940" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-sky-200 bg-white px-4 text-sm font-bold text-blue-800"><ArrowLeft size={18}/> Επιστροφή στην 28η Οκτωβρίου</a>
      <header className="mt-6 text-center"><p className="text-sm font-black tracking-wide text-emerald-700">🇬🇷 Ο ΠΙΣΙΠΟΥΚ • ΕΡΓΑΣΤΗΡΙ ΤΕΧΝΗΣ</p><h1 className="mt-2 text-3xl font-black text-[#154b83] sm:text-5xl">Ζωγραφίζω την Ειρήνη! 🎨</h1><p className="mx-auto mt-3 max-w-3xl text-base text-slate-600">28η Οκτωβρίου 1940: διαλέγω σχέδιο, χρωματίζω με το δάχτυλο ή το ποντίκι και κρατώ τη ζωγραφιά μου. Οι γονείς μπορούν να κατεβάσουν τέσσερα πατρόν σε PDF Α4.</p></header>
      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-blue-900">1. Διαλέγω ζωγραφιά</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">{sheets.map((s,i)=><button key={s.id} type="button" aria-pressed={current===s.id} onClick={()=>select(s.id)} className={"min-h-12 rounded-2xl border-2 px-3 py-3 text-left text-sm font-bold "+(current===s.id?"border-blue-600 bg-sky-100 text-blue-950":"border-slate-100 bg-slate-50 text-slate-700")}>{["🕊️","🇬🇷","🌿","✏️"][i]} {s.title}</button>)}</div>
          <h2 className="mt-6 text-lg font-black text-blue-900">2. Διαλέγω χρώμα</h2>
          <div className="mt-3 grid grid-cols-5 gap-2">{colors.map(c=><button key={c} title={"Χρώμα "+c} aria-label={"Χρώμα "+c} aria-pressed={color===c} onClick={()=>setColor(c)} className={"aspect-square rounded-full border-2 "+(color===c?"ring-4 ring-sky-200":"")} style={{background:c,borderColor:c==="#ffffff"?"#8ca1b6":c}}/>)}</div>
          <h2 className="mt-6 text-lg font-black text-blue-900">3. Πώς ζωγραφίζω;</h2>
          <div className="mt-3 flex flex-wrap gap-2">
          {([{id:"fill",label:"Γέμισμα",icon:PaintBucket},{id:"brush",label:"Πινέλο",icon:Paintbrush},{id:"eraser",label:"Γόμα",icon:Eraser}] as const).map(x=><button key={x.id} type="button" aria-pressed={tool===x.id} onClick={()=>setTool(x.id)} className={"inline-flex min-h-11 items-center gap-1 rounded-xl border px-3 text-sm font-bold "+(tool===x.id?"border-blue-600 bg-blue-700 text-white":"border-slate-200 bg-white text-slate-700")}><x.icon size={17}/>{x.label}</button>)}
          </div>
          {tool!=="fill"&&<label className="mt-4 block text-sm font-bold">Μέγεθος πινέλου <input type="range" min="5" max="34" value={brushSize} onChange={e=>setBrushSize(Number(e.target.value))} className="mt-2 w-full" /></label>}
          <div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={undo} disabled={!history} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold disabled:opacity-40"><Undo2 size={17}/> Πίσω</button><button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold"><RotateCcw size={17}/> Από την αρχή</button></div>
        </aside>
        <section className="rounded-3xl border border-sky-100 bg-white p-3 shadow-md sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-black text-blue-900">{sheet.title}</h2><p className="mt-1 text-sm text-slate-600">{sheet.hint}</p></div><span className="rounded-full bg-amber-100 px-3 py-2 text-xs font-bold text-amber-900">{tool==="fill"?"Άγγιξε ένα σχήμα για να το γεμίσεις":"Σύρε το δάχτυλο ή το ποντίκι"}</span></div>
          <div className="mx-auto relative w-full max-w-[600px] overflow-hidden rounded-2xl border-2 border-slate-200 bg-white" style={{aspectRatio:"3/4"}}>
            <div className="absolute inset-0" onClick={paintShape} dangerouslySetInnerHTML={{__html:svgMarkup(sheet,fills)}} aria-label={sheet.title}/>
            <canvas ref={canvasRef} width={720} height={960} onPointerDown={down} onPointerMove={move} onPointerUp={stop} onPointerCancel={stop} className="absolute inset-0 h-full w-full" style={{touchAction:tool==="fill"?"auto":"none",pointerEvents:tool==="fill"?"none":"auto",cursor:tool==="fill"?"default":"crosshair"}} aria-label="Επιφάνεια ελεύθερης ζωγραφικής"/>
          </div>
          <div className="mt-4 flex flex-wrap gap-2"><button type="button" disabled={busy} onClick={saveDrawing} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-black text-white disabled:opacity-60"><ImageDown size={18}/> Αποθήκευση ζωγραφιάς PNG</button><button type="button" disabled={busy} onClick={getPdf} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-blue-700 px-5 text-sm font-black text-white disabled:opacity-60"><Download size={18}/> Κατέβασε 4 πατρόν PDF Α4</button></div>
          {error&&<p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
          <p className="mt-3 text-xs text-slate-500">Τα σχέδια είναι χωρίς διαφημίσεις, χωρίς λογαριασμό και χωρίς αποστολή της ζωγραφιάς σε server. Τα πατρόν κατεβαίνουν χωρίς χρώματα για εκτύπωση. Για παιδιά προσχολικής ηλικίας με υποστήριξη ενήλικα.</p>
        </section>
      </div>
      <div className="mx-auto mt-7 max-w-5xl rounded-2xl border border-blue-100 bg-white p-5">
        <h2 className="flex items-center gap-2 text-xl font-black text-blue-900"><Printer size={21}/> Για γονείς & εκπαιδευτικούς</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">Πατήστε «Κατέβασε 4 πατρόν PDF Α4», αποθηκεύστε το αρχείο και εκτυπώστε σε πραγματικό μέγεθος (100%, μονή όψη). Το παιδί ζωγραφίζει την ελληνική σημαία, το περιστέρι, την ελιά και το ΟΧΙ. Το ψαλίδι χρησιμοποιείται μόνο με επίβλεψη ενηλίκου.</p>
        <div className="mt-4 flex flex-wrap gap-3"><a href="/oxi-1940" className="font-bold text-blue-700 underline underline-offset-4">📖 Μίνι βιβλιαράκι και οδηγίες</a><a href="/october-1940" className="font-bold text-blue-700 underline underline-offset-4">🧩 24 εκπαιδευτικά παιχνίδια</a></div>
      </div>
    </div>
  </main></SiteLayout>;
}
