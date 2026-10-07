import { useEffect, useMemo, useRef, useState } from "react";
import { Brush, Eraser, Leaf, Play, Volume2 } from "lucide-react";
import story from "@/assets/pisipouk-story.webp";
import arrival from "@/assets/pisipouk-arrival.webp";
import classroom from "@/assets/pisipouk-classroom.webp";
import exterior from "@/assets/pisipouk-exterior.webp";

const COLORS=["#ef4d73","#ffae36","#f4d33b","#43be7c","#3ea4e6","#7458df","#7e5537","#ffffff"];

export function Atelier(){
  const canvas=useRef<HTMLCanvasElement>(null);
  const drawing=useRef(false);
  const [color,setColor]=useState(COLORS[0]);
  const [size,setSize]=useState(14);
  useEffect(()=>{
    const c=canvas.current;if(!c)return;
    const fit=()=>{const r=c.getBoundingClientRect();const ratio=Math.min(2,window.devicePixelRatio||1);c.width=Math.floor(r.width*ratio);c.height=Math.floor(r.height*ratio);const x=c.getContext("2d");if(!x)return;x.scale(ratio,ratio);x.fillStyle="#fffaf1";x.fillRect(0,0,r.width,r.height);x.lineCap="round";x.lineJoin="round"};
    fit();window.addEventListener("resize",fit);return()=>window.removeEventListener("resize",fit)
  },[]);
  const p=(e:React.PointerEvent<HTMLCanvasElement>)=>{const r=e.currentTarget.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
  const start=(e:React.PointerEvent<HTMLCanvasElement>)=>{drawing.current=true;e.currentTarget.setPointerCapture(e.pointerId);const q=p(e);const x=e.currentTarget.getContext("2d");x?.beginPath();x?.moveTo(q.x,q.y)};
  const move=(e:React.PointerEvent<HTMLCanvasElement>)=>{if(!drawing.current)return;const q=p(e);const x=e.currentTarget.getContext("2d");if(!x)return;x.strokeStyle=color;x.lineWidth=size;x.lineTo(q.x,q.y);x.stroke()};
  const clear=()=>{const c=canvas.current;if(!c)return;const r=c.getBoundingClientRect();const x=c.getContext("2d");if(!x)return;x.save();x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,c.width,c.height);x.restore();x.fillStyle="#fffaf1";x.fillRect(0,0,r.width,r.height)};
  return <section className="pv15-experience">
    <div className="pv15-exp-copy"><span>ΑΝΟΙΧΤΟ ATELIER</span><h2>Ζωγράφισε τον δικό σου κόσμο</h2><p>Χωρίς σωστό και λάθος. Δάχτυλο, γραφίδα ή ποντίκι — το παιδί δημιουργεί ελεύθερα.</p></div>
    <div className="pv15-canvas-wrap"><canvas ref={canvas} aria-label="Καμβάς δημιουργίας" onPointerDown={start} onPointerMove={move} onPointerUp={()=>drawing.current=false} onPointerCancel={()=>drawing.current=false}/>
      <div className="pv15-palette">{COLORS.map(c=><button key={c} className={color===c?"on":""} aria-label={"Χρώμα "+c} style={{background:c}} onClick={()=>setColor(c)}/>)}</div>
      <div className="pv15-tools"><button onClick={()=>setSize(8)}>Λεπτό</button><button onClick={()=>setSize(14)}>Μεσαίο</button><button onClick={()=>setSize(28)}>Χοντρό</button><button onClick={clear}><Eraser/>Καθαρίζω</button></div>
    </div>
  </section>
}

const STORIES=[
  {title:"Το αστέρι που έχασε τον δρόμο",img:story,lines:["Ένα μικρό αστέρι προσγειώθηκε στον κήπο του Πισιπούκ.","Ο Πισιπούκ δεν βιάστηκε. Κάθισε δίπλα του και το άκουσε.","Μαζί ακολούθησαν το φως πάνω από το νησί.","Το αστέρι βρήκε τον δρόμο του — και έναν καινούργιο φίλο."]},
  {title:"Η μικρή βαρκούλα",img:arrival,lines:["Μια μικρή βαρκούλα φοβόταν να αφήσει το λιμάνι.","Ο Πισιπούκ της έδειξε πώς να ακούει τον άνεμο.","Έκανε πρώτα ένα μικρό ταξίδι και μετά ένα λίγο μεγαλύτερο.","Το θάρρος της μεγάλωσε, βήμα-βήμα."]},
  {title:"Το μυστικό της τάξης",img:classroom,lines:["Τα παιχνίδια της τάξης είχαν κρυφτεί.","Κάθε παιχνίδι άφηνε ένα μικρό σημάδι: ήχο, χρώμα ή σχήμα.","Ο Πισιπούκ και τα παιδιά τα βρήκαν συνεργαζόμενοι.","Το μυστικό ήταν πως μαζί παρατηρούμε περισσότερα."]},
];

export function Stories(){
  const [s,setS]=useState(0),[i,setI]=useState(0);const cur=STORIES[s];
  const speak=()=>{try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(cur.lines[i]);u.lang="el-GR";u.rate=.87;speechSynthesis.speak(u)}catch{}};
  return <section className="pv15-stories">
    <div className="pv15-story-tabs">{STORIES.map((x,n)=><button key={x.title} className={s===n?"on":""} onClick={()=>{setS(n);setI(0)}}><img src={x.img} alt=""/><span>{x.title}</span></button>)}</div>
    <article className="pv15-story-player"><img src={cur.img} alt={cur.title}/><div className="pv15-story-panel"><small>ΣΚΗΝΗ {i+1}/{cur.lines.length}</small><h2>{cur.title}</h2><p>{cur.lines[i]}</p><div><button onClick={speak}><Volume2/>Άκουσέ το</button><button disabled={!i} onClick={()=>setI(v=>Math.max(0,v-1))}>←</button><button className="primary" onClick={()=>setI(v=>v===cur.lines.length-1?0:v+1)}>{i===cur.lines.length-1?"Ξανά":"Συνέχεια →"}</button></div></div></article>
  </section>
}

const FINDS=[["κοχύλι",14,68,"◒"],["αστέρι",72,18,"★"],["φύλλο",84,64,"◆"],["βαρκούλα",53,54,"◢"],["λουλούδι",29,22,"✿"]] as const;
export function Worlds(){
  const [found,setFound]=useState<string[]>([]);
  const scene=useMemo(()=>exterior,[]);
  return <section className="pv15-worlds" style={{backgroundImage:`linear-gradient(180deg,#13295715,#13295738),url(${scene})`}}>
    <div className="pv15-world-copy"><span><Leaf/>ΜΙΚΡΟΣ ΕΞΕΡΕΥΝΗΤΗΣ</span><h2>Παρατήρησε. Άκου. Ανακάλυψε.</h2><p>Δεν υπάρχει χρονόμετρο. Βρες τα κρυμμένα πράγματα με τον δικό σου ρυθμό.</p></div>
    {FINDS.map(([name,x,y,icon])=><button key={name} className={found.includes(name)?"found":""} style={{left:x+"%",top:y+"%"}} aria-label={"Βρες "+name} onClick={()=>!found.includes(name)&&setFound(v=>[...v,name])}><b>{icon}</b></button>)}
    <div className="pv15-world-status">{found.length===FINDS.length?"Τα βρήκες όλα! Θέλεις να ξανακοιτάξεις τον κόσμο;":"Βρήκες "+found.length+" από "+FINDS.length}</div>
  </section>
}

export function Today(){
  const missions=useMemo(()=>[
    ["Κυνήγι χρωμάτων","Βρες τρία αντικείμενα του ίδιου χρώματος.","🎨"],
    ["Ήχοι γύρω μου","Κλείσε τα μάτια και βρες τρεις διαφορετικούς ήχους.","🎵"],
    ["Μικρός φυσιοδίφης","Βρες ένα φύλλο και παρατήρησε τις γραμμές του.","🌿"],
    ["Χορός του Πισιπούκ","Φτιάξε τρεις κινήσεις και επανάλαβέ τες.","✨"],
    ["Ιστορία μαζί","Πες μία πρόταση και άφησε έναν μεγάλο να συνεχίσει.","📚"],
  ],[]);
  const m=missions[new Date().getDay()%missions.length];
  return <section className="pv15-today"><div className="pv15-today-art"><span>{m[2]}</span><i/></div><div><span>Η ΑΠΟΣΤΟΛΗ ΣΗΜΕΡΑ</span><h2>{m[0]}</h2><p>{m[1]}</p><button><Play/>Ξεκινώ</button></div></section>
}
