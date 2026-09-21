import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Download, Eraser, Printer, RefreshCw, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/pisipoukApi";

export const Route = createFileRoute("/virtual-preschool")({
  head:()=>({meta:[
    {title:"Εικονικός Παιδικός Σταθμός | Ο Πισιπούκ"},
    {name:"description",content:"Καθημερινή online ζωγραφική για παιδιά στον Πισιπούκ. Επιλέξτε χρώματα, αποθηκεύστε και εκτυπώστε τη ζωγραφιά."}
  ]}),
  component: VirtualPreschool
});

const palette=["#ef4444","#f59e0b","#facc15","#22c55e","#06b6d4","#3b82f6","#8b5cf6","#ec4899","#8b5e3c","#ffffff"];

const drawings=[
  [
    {id:"ear1",d:"M90 55 A25 25 0 1 1 140 55 A25 25 0 1 1 90 55",fill:"#fff"},
    {id:"ear2",d:"M180 55 A25 25 0 1 1 230 55 A25 25 0 1 1 180 55",fill:"#fff"},
    {id:"face",d:"M80 100 C80 55 240 55 240 140 C240 205 80 205 80 140 Z",fill:"#fff"},
    {id:"hill",d:"M35 220 Q160 145 285 220 L285 240 L35 240 Z",fill:"#fff"}
  ],
  [
    {id:"sun",d:"M125 70 A35 35 0 1 1 195 70 A35 35 0 1 1 125 70",fill:"#fff"},
    {id:"cloud1",d:"M40 125 C45 95 75 95 85 112 C95 85 135 90 136 120 C160 118 168 145 146 155 L58 155 C34 150 27 132 40 125 Z",fill:"#fff"},
    {id:"cloud2",d:"M180 135 C185 105 215 105 225 122 C236 95 274 102 275 130 C296 130 302 154 284 163 L198 163 C176 158 168 143 180 135 Z",fill:"#fff"},
    {id:"grass",d:"M20 210 Q75 175 130 210 Q185 175 300 210 L300 240 L20 240 Z",fill:"#fff"}
  ]
];

function VirtualPreschool(){
  const dayIndex=useMemo(()=>Math.floor(Date.now()/86400000)%drawings.length,[]);
  const [drawingIndex,setDrawingIndex]=useState(dayIndex);
  const [selected,setSelected]=useState(palette[0]);
  const [fills,setFills]=useState<Record<string,string>>({});
  const svgRef=useRef<SVGSVGElement>(null);
  const drawing=drawings[drawingIndex];

  useEffect(()=>{trackEvent("game_start",{game:"daily_coloring",drawing:drawingIndex});},[drawingIndex]);

  const fill=(id:string)=>{setFills(v=>({...v,[id]:selected}));trackEvent("color_selected",{game:"daily_coloring"});};
  const reset=()=>setFills({});
  const next=()=>{setDrawingIndex(v=>(v+1)%drawings.length);setFills({});};

  const download=()=>{
    const svg=svgRef.current;
    if(!svg)return;
    const xml=new XMLSerializer().serializeToString(svg);
    const blob=new Blob([xml],{type:"image/svg+xml;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const img=new Image();
    img.onload=()=>{
      const canvas=document.createElement("canvas");
      canvas.width=1200;canvas.height=900;
      const ctx=canvas.getContext("2d");
      if(!ctx)return;
      ctx.fillStyle="#ffffff";ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
      ctx.fillStyle="#333";ctx.font="28px sans-serif";ctx.textAlign="center";
      ctx.fillText("Η ζωγραφιά μου στον Πισιπούκ - pisipouk.vercel.app",600,875);
      const a=document.createElement("a");a.href=canvas.toDataURL("image/png");a.download="pisipouk-zografia.png";a.click();
      URL.revokeObjectURL(url);
      trackEvent("share_click",{game:"daily_coloring",action:"download"});
    };
    img.src=url;
  };

  const print=()=>{trackEvent("share_click",{game:"daily_coloring",action:"print"});window.print();};

  return <SiteLayout>
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="text-center">
          <p className="section-kicker">Εικονικός Παιδικός Σταθμός</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Η ζωγραφιά της ημέρας</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">Διάλεξε χρώμα και πάτησε πάνω στα λευκά μέρη της εικόνας.</p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px] lg:items-start">
          <div className="print-area rounded-[2rem] border bg-white p-4 shadow-sm">
            <svg ref={svgRef} viewBox="0 0 320 240" className="mx-auto aspect-[4/3] w-full max-w-3xl touch-manipulation" aria-label="Ζωγραφιά για χρωμάτισμα">
              <rect width="320" height="240" fill="#ffffff"/>
              {drawing.map(part=><path key={part.id} d={part.d} fill={fills[part.id]||part.fill} stroke="#111111" strokeWidth="5" strokeLinejoin="round" onClick={()=>fill(part.id)} className="cursor-pointer"/> )}
              {drawingIndex===0&&<>
                <circle cx="140" cy="118" r="6" fill="#111"/>
                <circle cx="180" cy="118" r="6" fill="#111"/>
                <path d="M145 145 Q160 158 175 145" fill="none" stroke="#111" strokeWidth="5" strokeLinecap="round"/>
              </>}
            </svg>
            <div className="hidden print:block pt-3 text-center text-sm font-bold text-gray-700">Η ζωγραφιά μου στον Πισιπούκ - pisipouk.vercel.app</div>
          </div>

          <aside className="rounded-[2rem] border bg-card p-5">
            <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary"/><h2 className="font-black">Διάλεξε χρώμα</h2></div>
            <div className="mt-4 grid grid-cols-5 gap-3">
              {palette.map(color=><button key={color} type="button" onClick={()=>setSelected(color)} aria-label={"Χρώμα "+color} className={"h-11 w-11 rounded-full border-2 transition-transform "+(selected===color?"scale-110 ring-2 ring-primary ring-offset-2":"")} style={{backgroundColor:color}} />)}
            </div>

            <div className="mt-6 grid gap-3">
              <Button type="button" variant="outline" className="rounded-full" onClick={reset}><Eraser className="h-4 w-4"/>Καθάρισέ το</Button>
              <Button type="button" variant="outline" className="rounded-full" onClick={next}><RefreshCw className="h-4 w-4"/>Άλλη ζωγραφιά</Button>
              <Button type="button" className="rounded-full" onClick={download}><Download className="h-4 w-4"/>Αποθήκευση PNG</Button>
              <Button type="button" variant="secondary" className="rounded-full" onClick={print}><Printer className="h-4 w-4"/>Εκτύπωση</Button>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <style>{`@media print {
      body * { visibility:hidden !important; }
      .print-area, .print-area * { visibility:visible !important; }
      .print-area { position:absolute !important; inset:0 !important; width:100% !important; border:0 !important; box-shadow:none !important; }
      header, footer { display:none !important; }
    }`}</style>
  </SiteLayout>
}
