import { useEffect, useMemo, useRef, useState } from "react";
import { Brush, Eraser, HeartHandshake, Leaf, Play, RotateCcw, Volume2 } from "lucide-react";
import bearLogo from "@/assets/pisipouk-logo.webp";
import arrival from "@/assets/pisipouk-arrival.webp";
import classroom from "@/assets/pisipouk-classroom.webp";
import exterior from "@/assets/pisipouk-exterior.webp";
import story from "@/assets/pisipouk-story.webp";
import { PisipoukGuide, speakGreek } from "./PisipoukGuide";

const palette=["#f6527f","#f7a941","#f7d84d","#6fc97f","#55b9e9","#7459df","#8f6547","#fff"];

export function Atelier() {
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const [color,setColor]=useState(palette[0]);
  const [size,setSize]=useState(14);
  const drawing=useRef(false);

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const resize=()=>{const rect=canvas.getBoundingClientRect();const ratio=Math.min(2,window.devicePixelRatio||1);const old=document.createElement("canvas");old.width=canvas.width;old.height=canvas.height;old.getContext("2d")?.drawImage(canvas,0,0);canvas.width=Math.floor(rect.width*ratio);canvas.height=Math.floor(rect.height*ratio);const ctx=canvas.getContext("2d");if(!ctx)return;ctx.setTransform(ratio,0,0,ratio,0,0);ctx.fillStyle="#fffdf7";ctx.fillRect(0,0,rect.width,rect.height);if(old.width)ctx.drawImage(old,0,0,rect.width,rect.height);ctx.lineCap="round";ctx.lineJoin="round"};
    resize();window.addEventListener("resize",resize);return()=>window.removeEventListener("resize",resize);
  },[]);

  const p=(e:React.PointerEvent<HTMLCanvasElement>)=>{const r=e.currentTarget.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
  const clear=()=>{const c=canvasRef.current;if(!c)return;const r=c.getBoundingClientRect(),ctx=c.getContext("2d");if(!ctx)return;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,c.width,c.height);ctx.restore();ctx.fillStyle="#fffdf7";ctx.fillRect(0,0,r.width,r.height)};

  return <section className="pw15-studio">
    <div className="pw15-studio-intro">
      <img src={classroom} alt="Το ατελιέ του Πισιπούκ"/>
      <div><span>REGGIO-INSPIRED DIGITAL ATELIER</span><h2>Φτιάξε κάτι που δεν υπάρχει ακόμα.</h2><p>Χρώμα, κίνηση και ελεύθερη έκφραση χωρίς «σωστό» αποτέλεσμα.</p></div>
    </div>
    <div className="pw15-canvas-shell">
      <canvas ref={canvasRef} aria-label="Καμβάς ζωγραφικής"
        onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);drawing.current=true;const q=p(e),ctx=e.currentTarget.getContext("2d");ctx?.beginPath();ctx?.moveTo(q.x,q.y)}}
        onPointerMove={e=>{if(!drawing.current)return;const q=p(e),ctx=e.currentTarget.getContext("2d");if(!ctx)return;ctx.strokeStyle=color;ctx.lineWidth=size;ctx.lineTo(q.x,q.y);ctx.stroke()}}
        onPointerUp={e=>{drawing.current=false;try{e.currentTarget.releasePointerCapture(e.pointerId)}catch{}}}
        onPointerCancel={()=>{drawing.current=false}}
      />
      <div className="pw15-palette">{palette.map(c=><button key={c} aria-label={`Χρώμα ${c}`} className={color===c?"on":""} style={{background:c}} onClick={()=>setColor(c)}/>)}</div>
      <div className="pw15-tools">
        <button onClick={()=>setSize(8)} className={size===8?"on":""}>λεπτό</button>
        <button onClick={()=>setSize(14)} className={size===14?"on":""}>μεσαίο</button>
        <button onClick={()=>setSize(26)} className={size===26?"on":""}>χοντρό</button>
        <button onClick={clear}><Eraser/> καθαρίζω</button>
      </div>
    </div>
  </section>;
}

const stories=[
  {title:"Το αστέρι που έχασε τον δρόμο",image:story,lines:["Ένα μικρό αστέρι έπεσε απαλά στον κήπο του Πισιπούκ.","Ο Πισιπούκ το ρώτησε αν θέλει να ψάξουν μαζί τον δρόμο του.","Πέρασαν από λουλούδια, θάλασσα και ένα ήσυχο μονοπάτι.","Το αστέρι κοίταξε ψηλά και βρήκε ξανά τους φίλους του."]},
  {title:"Η μικρή βαρκούλα",image:arrival,lines:["Μια μικρή βαρκούλα φοβόταν να φύγει από το λιμάνι.","Ο Πισιπούκ της έδειξε πως ο άνεμος μπορεί να γίνει φίλος.","Έκαναν ένα μικρό ταξίδι και μετά ένα λίγο μεγαλύτερο.","Όταν γύρισε, η βαρκούλα ήξερε πως το θάρρος μεγαλώνει λίγο-λίγο."]},
  {title:"Το μυστικό της τάξης",image:classroom,lines:["Στην τάξη κάτι είχε αλλάξει.","Κάθε γωνιά έκρυβε ένα μικρό στοιχείο: έναν ήχο, ένα χρώμα ή ένα σχήμα.","Οι φίλοι συνεργάστηκαν και βρήκαν τα στοιχεία ένα-ένα.","Το μεγαλύτερο μυστικό ήταν πως μαζί βλέπουμε περισσότερα."]},
];

export function StoryRoom() {
  const [storyIndex,setStoryIndex]=useState(0);const [scene,setScene]=useState(0);const current=stories[storyIndex];
  return <section className="pw15-story-room">
    <div className="pw15-story-tabs">{stories.map((s,i)=><button key={s.title} className={i===storyIndex?"on":""} onClick={()=>{setStoryIndex(i);setScene(0)}}><img src={s.image} alt=""/><span>{s.title}</span></button>)}</div>
    <article className="pw15-story-stage">
      <img src={current.image} alt={current.title}/>
      <div className="pw15-story-copy">
        <small>ΣΚΗΝΗ {scene+1}/{current.lines.length}</small><h2>{current.title}</h2><p>{current.lines[scene]}</p>
        <div><button onClick={()=>speakGreek(current.lines[scene])}><Volume2/> Άκου</button><button disabled={scene===0} onClick={()=>setScene(v=>Math.max(0,v-1))}>Πίσω</button><button className="primary" onClick={()=>setScene(v=>v===current.lines.length-1?0:v+1)}>{scene===current.lines.length-1?"Ξανά":"Συνέχεια"}</button></div>
      </div>
    </article>
  </section>;
}

const exploreSpots=[
  {x:15,y:66,label:"ένα μικρό σημάδι χαμηλά"},
  {x:31,y:31,label:"μια λεπτομέρεια κοντά στα φυτά"},
  {x:52,y:63,label:"κάτι που κρύβεται στη μέση"},
  {x:72,y:28,label:"κάτι ψηλότερα"},
  {x:84,y:70,label:"μια τελευταία λεπτομέρεια"},
];

export function ExploreWorld() {
  const [found,setFound]=useState<number[]>([]);
  const message=found.length===exploreSpots.length?"Τα βρήκες όλα. Τώρα κοίτα έξω από την οθόνη και βρες κάτι που δεν είχες προσέξει.":"Κοίτα αργά. Πάτα μόνο όταν πραγματικά παρατηρήσεις κάτι.";
  return <section className="pw15-explore">
    <img className="pw15-explore-bg" src={exterior} alt="Ο εξωτερικός χώρος του Πισιπούκ"/>
    <div className="pw15-explore-wash"/>
    {exploreSpots.map((s,i)=><button key={i} className={found.includes(i)?"found":""} style={{left:`${s.x}%`,top:`${s.y}%`}} aria-label={s.label} onClick={()=>setFound(v=>v.includes(i)?v:[...v,i])}><span/></button>)}
    <PisipoukGuide message={message} mood={found.length===exploreSpots.length?"happy":"idle"}/>
    <div className="pw15-explore-count"><Leaf/> {found.length}/{exploreSpots.length}</div>
  </section>;
}

export function ParentRoom() {
  const [stats,setStats]=useState({plays:0,minutes:0});
  useEffect(()=>{try{const raw=JSON.parse(localStorage.getItem("pisipouk-v15-stats")||"{}");setStats({plays:raw.plays||0,minutes:Math.round((raw.ms||0)/60000)})}catch{}},[]);
  return <section className="pw15-parent">
    <div className="pw15-parent-hero"><img src={bearLogo} alt="Πισιπούκ"/><div><span>PARENT / EDUCATOR VIEW</span><h2>Το παιδί παίζει. Ο ενήλικας βλέπει το πλαίσιο, όχι «βαθμούς».</h2><p>Η λογική συνδυάζει open-ended atelier, αυτοδιόρθωση, ήπιο αισθητηριακό ρυθμό και αργή συναισθηματικά ασφαλή καθοδήγηση.</p></div></div>
    <div className="pw15-parent-grid">
      <div><b>{stats.plays}</b><span>εκκινήσεις παιχνιδιών στη συσκευή</span></div><div><b>{stats.minutes}</b><span>λεπτά ολοκληρωμένης δραστηριότητας</span></div><div><HeartHandshake/><span>Πρόταση: μετά από κάθε ψηφιακή δραστηριότητα, 5–10′ πραγματικού co-play.</span></div>
    </div>
    <div className="pw15-principles">
      <article><b>Reggio Emilia</b><p>Πολλαπλές μορφές έκφρασης και ανοιχτό atelier.</p></article>
      <article><b>Montessori-inspired</b><p>Control of error, αυτονομία και tactile manipulation χωρίς επικριτικά εφέ.</p></article>
      <article><b>Calm sensory design</b><p>Φυσικές υφές, ήπια παλέτα, αργό pacing και χωρίς arcade pressure.</p></article>
      <article><b>Privacy</b><p>Χωρίς πραγματικό όνομα παιδιού. Τοπική πρόοδος στη συσκευή.</p></article>
    </div>
    <small className="pw15-credit">Υποστηρικτικά game sprites: Kenney CC0. Ο Πισιπούκ και οι φωτογραφίες/brand assets προέρχονται από το υπάρχον site.</small>
  </section>;
}

export function TodayMission() {
  const missions=useMemo(()=>[
    ["Βρες 3 αποχρώσεις του ίδιου χρώματος γύρω σου.","χρώμα"],
    ["Άκου για 20 δευτερόλεπτα και μέτρα διαφορετικούς ήχους.","ήχος"],
    ["Διάλεξε ένα φύλλο και παρατήρησε γραμμές και σχήμα.","φύση"],
    ["Φτιάξε μια ιστορία με δύο αντικείμενα του δωματίου.","ιστορία"],
    ["Χτίσε κάτι που στέκεται χρησιμοποιώντας ασφαλή αντικείμενα.","κατασκευή"],
  ],[]);
  const item=missions[new Date().getDay()%missions.length];
  const [started,setStarted]=useState(false);
  return <section className="pw15-today">
    <img src={arrival} alt=""/>
    <div><span>Η ΑΠΟΣΤΟΛΗ ΣΗΜΕΡΑ</span><h2>{item[1]}</h2><p>{item[0]}</p><button onClick={()=>{setStarted(true);speakGreek(item[0])}}><Play/> {started?"Το κάνω τώρα":"Ξεκινώ"}</button>{started&&<button className="quiet" onClick={()=>setStarted(false)}><RotateCcw/> ξανά</button>}</div>
  </section>;
}
