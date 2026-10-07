import { useEffect, useMemo, useRef, useState } from "react";
import { Brush, Eraser, Leaf, Play, RefreshCcw, Sparkles, Volume2 } from "lucide-react";
import storyImage from "@/assets/pisipouk-story.webp";
import classroomImage from "@/assets/pisipouk-classroom.webp";
import arrivalImage from "@/assets/pisipouk-arrival.webp";

const COLORS = ["#ff4f85", "#ffb22e", "#ffd940", "#47c879", "#43ace8", "#7256e8", "#8c5a3c", "#ffffff"];

export function DrawingStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(15);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      const old = document.createElement("canvas");
      old.width = canvas.width;
      old.height = canvas.height;
      const oldCtx = old.getContext("2d");
      oldCtx?.drawImage(canvas,0,0);
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(ratio, ratio);
      ctx.fillStyle = "#fffdf7";
      ctx.fillRect(0,0,rect.width,rect.height);
      if (old.width) ctx.drawImage(old,0,0,rect.width,rect.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };
    resize();
    window.addEventListener("resize",resize);
    return () => window.removeEventListener("resize",resize);
  }, []);

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x:event.clientX-rect.left, y:event.clientY-rect.top };
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    const p = point(event);
    const ctx = event.currentTarget.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(p.x,p.y);
  };

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const p=point(event);
    const ctx=event.currentTarget.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle=color;
    ctx.lineWidth=size;
    ctx.lineTo(p.x,p.y);
    ctx.stroke();
  };

  const stop = (event: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current=false;
    try { event.currentTarget.releasePointerCapture(event.pointerId); } catch {}
  };

  const clear = () => {
    const canvas=canvasRef.current;
    if (!canvas) return;
    const rect=canvas.getBoundingClientRect();
    const ctx=canvas.getContext("2d");
    if (!ctx) return;
    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.restore();
    ctx.fillStyle="#fffdf7";
    ctx.fillRect(0,0,rect.width,rect.height);
  };

  return (
    <div className="pm-studio pm-drawing">
      <div className="pm-studio-copy">
        <span className="pm-eyebrow"><Brush/> ΔΗΜΙΟΥΡΓΩ ΕΛΕΥΘΕΡΑ</span>
        <h2>Το ατελιέ του Πισιπούκ</h2>
        <p>Ζωγράφισε με δάχτυλο, γραφίδα ή ποντίκι. Δεν υπάρχει «σωστό» σχέδιο.</p>
      </div>
      <div className="pm-drawing-wrap">
        <canvas
          ref={canvasRef}
          aria-label="Καμβάς ελεύθερης ζωγραφικής"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={stop}
          onPointerCancel={stop}
        />
        <div className="pm-palette">
          {COLORS.map(c=><button key={c} aria-label={`Χρώμα ${c}`} className={color===c?"on":""} style={{background:c}} onClick={()=>setColor(c)}/>)}
        </div>
        <div className="pm-brush-tools">
          <button className={size===8?"on":""} onClick={()=>setSize(8)}>Λεπτό</button>
          <button className={size===15?"on":""} onClick={()=>setSize(15)}>Μεσαίο</button>
          <button className={size===28?"on":""} onClick={()=>setSize(28)}>Χοντρό</button>
          <button onClick={clear}><Eraser/> Καθαρίζω</button>
        </div>
      </div>
    </div>
  );
}

const STORIES = [
  {
    title:"Το αστέρι που έχασε τον δρόμο",
    image:storyImage,
    scenes:[
      "Ένα μικρό αστέρι έπεσε απαλά στον κήπο του Πισιπούκ.",
      "Ο Πισιπούκ το ρώτησε: «Θέλεις να βρούμε μαζί τον δρόμο σου;»",
      "Πέρασαν από λουλούδια, ένα γαλάζιο λιμανάκι και έναν ήσυχο ανεμόμυλο.",
      "Το αστέρι κοίταξε ψηλά. «Τώρα θυμήθηκα! Ο δρόμος μου είναι εκεί που λάμπουν οι φίλοι μου.»",
    ],
  },
  {
    title:"Η πρώτη μέρα της μικρής βαρκούλας",
    image:arrivalImage,
    scenes:[
      "Μια μικρή βαρκούλα φοβόταν να φύγει από το λιμάνι.",
      "Ο Πισιπούκ της έδειξε πώς ο άνεμος μπορεί να γίνει φίλος.",
      "Η βαρκούλα δοκίμασε ένα μικρό ταξίδι, μετά ένα λίγο μεγαλύτερο.",
      "Όταν γύρισε, ήξερε πως το θάρρος μεγαλώνει όταν δοκιμάζουμε λίγο-λίγο.",
    ],
  },
  {
    title:"Το μυστικό της τάξης",
    image:classroomImage,
    scenes:[
      "Στην τάξη του Πισιπούκ όλα τα παιχνίδια είχαν κρυφτεί.",
      "Κάθε αντικείμενο άφηνε ένα μικρό στοιχείο: έναν ήχο, ένα χρώμα ή ένα σχήμα.",
      "Τα παιδιά συνεργάστηκαν και τα βρήκαν ένα-ένα.",
      "Το μεγαλύτερο μυστικό ήταν πως όταν βοηθάμε ο ένας τον άλλο, βρίσκουμε περισσότερα.",
    ],
  },
];

export function StoryStudio() {
  const [story,setStory]=useState(0);
  const [scene,setScene]=useState(0);
  const current=STORIES[story];

  const speak=()=>{
    try {
      speechSynthesis.cancel();
      const utterance=new SpeechSynthesisUtterance(current.scenes[scene]);
      utterance.lang="el-GR";
      utterance.rate=.88;
      speechSynthesis.speak(utterance);
    } catch {}
  };

  return (
    <div className="pm-studio pm-stories">
      <div className="pm-story-list">
        {STORIES.map((item,index)=>(
          <button key={item.title} className={story===index?"on":""} onClick={()=>{setStory(index);setScene(0);}}>
            <img src={item.image} alt="" />
            <span>{item.title}</span>
          </button>
        ))}
      </div>
      <article className="pm-story-player">
        <img src={current.image} alt={current.title}/>
        <div className="pm-story-overlay">
          <small>ΣΚΗΝΗ {scene+1} / {current.scenes.length}</small>
          <h2>{current.title}</h2>
          <p>{current.scenes[scene]}</p>
          <div>
            <button onClick={speak}><Volume2/> Άκουσέ το</button>
            <button disabled={scene===0} onClick={()=>setScene(v=>Math.max(0,v-1))}>← Πίσω</button>
            <button className="primary" onClick={()=>setScene(v=>v===current.scenes.length-1?0:v+1)}>{scene===current.scenes.length-1?"Ξανά":"Συνέχεια →"}</button>
          </div>
        </div>
      </article>
    </div>
  );
}

const FINDS = [
  {id:"shell", label:"κοχύλι", x:16,y:68, icon:"◒"},
  {id:"star", label:"αστέρι", x:73,y:22, icon:"★"},
  {id:"leaf", label:"φύλλο", x:84,y:66, icon:"◆"},
  {id:"boat", label:"βαρκούλα", x:53,y:55, icon:"◢"},
  {id:"flower", label:"λουλούδι", x:29,y:24, icon:"✿"},
];

export function ExploreStudio() {
  const [found,setFound]=useState<string[]>([]);
  const [message,setMessage]=useState("Βρες τα 5 κρυμμένα πράγματα στο μαγικό νησί.");
  return (
    <div className="pm-studio pm-explore">
      <div className="pm-explore-world">
        <div className="pm-explore-sun"/>
        <div className="pm-explore-sea"/>
        <div className="pm-explore-island"/>
        <div className="pm-explore-house h1"/><div className="pm-explore-house h2"/>
        <div className="pm-explore-windmill"><i/><b/><span/></div>
        {FINDS.map(item=>(
          <button
            key={item.id}
            className={found.includes(item.id)?"found":""}
            style={{left:`${item.x}%`,top:`${item.y}%`}}
            aria-label={`Βρες ${item.label}`}
            onClick={()=>{
              if(found.includes(item.id)) return;
              setFound(v=>[...v,item.id]);
              setMessage(`Βρήκες ${item.label}! ${found.length===4?"Τα βρήκες όλα!":"Συνέχισε να εξερευνάς."}`);
            }}
          ><span>{item.icon}</span></button>
        ))}
        <div className="pm-explore-guide"><Leaf/><b>{message}</b><span>{found.length}/5</span></div>
      </div>
    </div>
  );
}

export function TodayStudio() {
  const day = new Date().getDay();
  const missions = useMemo(()=>[
    ["Κυνήγι χρωμάτων","Βρες στο σπίτι 3 πράγματα που έχουν το ίδιο χρώμα.","🎨"],
    ["Ήχοι γύρω μου","Κλείσε τα μάτια για 20 δευτερόλεπτα και μέτρα πόσους διαφορετικούς ήχους ακούς.","🎵"],
    ["Μικρός φυσιοδίφης","Βρες ένα φύλλο και παρατήρησε τις γραμμές του.","🌿"],
    ["Χορός του Πισιπούκ","Διάλεξε ένα τραγούδι και κάνε 3 διαφορετικές κινήσεις.","✨"],
    ["Ιστορία δύο προτάσεων","Πες μία πρόταση και ζήτησε από έναν μεγάλο να συνεχίσει την ιστορία.","📚"],
    ["Μαγικό χτίσιμο","Φτιάξε έναν πύργο με ό,τι ασφαλές υπάρχει γύρω σου.","🏗️"],
    ["Ήρεμο κύμα","Πάρε 4 αργές ανάσες σαν να ανεβαίνει και να κατεβαίνει ένα κύμα.","🌊"],
  ],[]);
  const mission=missions[day % missions.length];
  return (
    <div className="pm-today-card">
      <div className="pm-today-art"><span>{mission[2]}</span><i/><b/></div>
      <div>
        <span className="pm-eyebrow"><Sparkles/> Η ΑΠΟΣΤΟΛΗ ΣΗΜΕΡΑ</span>
        <h2>{mission[0]}</h2>
        <p>{mission[1]}</p>
        <button onClick={()=>location.hash="today-done"}><Play/> Ξεκινώ την αποστολή</button>
      </div>
    </div>
  );
}

export function ParentsStudio() {
  const [stats,setStats]=useState<{plays:number;completions:number;minutes:number}>({plays:0,completions:0,minutes:0});
  useEffect(()=>{
    try{
      const raw=JSON.parse(localStorage.getItem("pisipouk-v13-game-stats")||"{}");
      const values=Object.values(raw) as any[];
      const plays=values.reduce((n,v)=>n+(v.plays||0),0);
      const completions=values.reduce((n,v)=>n+(v.completions||0),0);
      const ms=values.reduce((n,v)=>n+(v.totalMs||0),0);
      setStats({plays,completions,minutes:Math.round(ms/60000)});
    }catch{}
  },[]);
  return (
    <div className="pm-parents-panel">
      <div>
        <span className="pm-eyebrow">ΓΙΑ ΓΟΝΕΙΣ • LOCAL-FIRST</span>
        <h2>Ο χρόνος στην οθόνη συνεχίζεται στον πραγματικό κόσμο.</h2>
        <p>Δεν ζητάμε όνομα παιδιού. Τα τοπικά στοιχεία βοηθούν μόνο να βλέπετε ποιες δραστηριότητες επιλέγονται περισσότερο.</p>
      </div>
      <div className="pm-parent-stats">
        <div><b>{stats.plays}</b><span>εκκινήσεις παιχνιδιών</span></div>
        <div><b>{stats.completions}</b><span>ολοκληρώσεις</span></div>
        <div><b>{stats.minutes}</b><span>λεπτά ολοκληρωμένου παιχνιδιού</span></div>
      </div>
      <div className="pm-parent-advice">
        <b>Μικρή ιδέα</b>
        <p>Μετά από ένα ψηφιακό παιχνίδι, κάντε μία μικρή πραγματική συνέχεια: ταξινόμηση παιχνιδιών, τραγούδι, κατασκευή, συζήτηση ή βόλτα παρατήρησης.</p>
      </div>
    </div>
  );
}
