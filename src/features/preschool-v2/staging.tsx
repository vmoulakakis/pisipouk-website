import { Link, Outlet } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  ArrowLeft, ArrowRight, BookOpen, Check, ChevronLeft, ChevronRight, Compass,
  Download, Gamepad2, Hand, Heart, Home, LockKeyhole, Music2, Palette, Printer,
  RotateCcw, Sparkles, Volume2, X, Scissors, Leaf, Undo2, Eraser
} from "lucide-react";
import "./staging.css";

const BASE = "/pisipouk-v2-staging";
const AGES = ["2–3", "3–4", "4–5", "5–6"] as const;
type StageContextValue = { age: number; changeAge: (a: number) => void; explore: boolean; changeExplore: (value: boolean) => void };
const StageContext = createContext<StageContextValue>({ age: 0, changeAge: () => undefined, explore: false, changeExplore: () => undefined });
function useStage() { return useContext(StageContext); }

function SpeakButton({ text }: { text: string }) {
  const [message, setMessage] = useState("");
  const play = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) { setMessage("Χωρίς διαθέσιμη φωνή"); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "el-GR"; utter.rate = 0.86; utter.pitch = 1.04;
    window.speechSynthesis.speak(utter);
  };
  return <span className="p2-voice-wrap"><button type="button" className="p2-icon-btn" onClick={play} aria-label="Άκουσε την οδηγία" title="Άκουσε την οδηγία"><Volume2 size={21}/></button>{message && <span className="p2-sr-status" role="status">{message}</span>}</span>;
}

const links = [
  { to: BASE + "/", text: "Χωριό", icon: Home },
  { to: BASE + "/games", text: "Παιχνίδια", icon: Gamepad2 },
  { to: BASE + "/atelier", text: "Ατελιέ", icon: Palette },
  { to: BASE + "/stories", text: "Ιστορίες", icon: BookOpen },
];
export function StageShell() {
  const [age, setAge] = useState(0);
  const [explore, setExplore] = useState(false);
  useEffect(() => {
    try { const v = Number(sessionStorage.getItem("p2-stage-age")); if (v >= 0 && v <= 3) setAge(v); } catch { /* preview only */ }
  }, []);
  const changeAge = (a: number) => {
    setAge(a); if (a === 0) setExplore(false);
    try { sessionStorage.setItem("p2-stage-age", String(a)); } catch { /* preview only */ }
  };
  return <StageContext.Provider value={{ age, changeAge, explore, changeExplore: setExplore }}>
    <div className="p2-app">
      <a className="p2-skip" href="#p2-content">Μετάβαση στο περιεχόμενο</a>
      <header className="p2-header">
        <Link to={BASE + "/"} className="p2-brand" aria-label="Πισιπούκ — Χωριό">
          <img src="/preschool-world/bear.webp" alt="Πισιπούκ" />
          <span><strong>Πισιπούκ</strong><small>Ο κόσμος των ανακαλύψεων</small></span>
        </Link>
        <nav className="p2-top-nav" aria-label="Κεντρική πλοήγηση">
          {links.map(({to,text,icon:Icon}) => <Link key={to} to={to} activeProps={{"aria-current":"page",className:"p2-active"}} className="p2-nav-link"><Icon size={19}/>{text}</Link>)}
        </nav>
        <Link className="p2-adult" to={BASE + "/adults"}><LockKeyhole size={16}/> Για μεγάλους</Link>
      </header>
      <div className="p2-review-strip"><span>DESIGN STAGING · ΟΧΙ ΠΑΡΑΓΩΓΙΚΗ ΕΚΔΟΣΗ</span><strong>Hybrid World 2.0</strong></div>
      <section className="p2-age-bar" aria-label="Ηλικιακή ομάδα">
        <span className="p2-age-label">Διαλέγω ηλικία</span>
        <div className="p2-age-buttons">{AGES.map((label,i) => <button type="button" key={label} aria-pressed={age===i} onClick={()=>changeAge(i)} className={age===i?"p2-picked":""}>{label} ετών</button>)}</div>
        <span className="p2-age-notice">{age===0?"Απλή εξερεύνηση":"Προσαρμοσμένες περιπέτειες"}</span>
      </section>
      <main id="p2-content" className="p2-content"><Outlet /></main>
      <nav className="p2-bottom-nav" aria-label="Γρήγορη πλοήγηση">
        {links.map(({to,text,icon:Icon}) => <Link key={to} to={to} activeProps={{"aria-current":"page",className:"p2-active"}} className="p2-nav-link"><Icon size={22}/><span>{text}</span></Link>)}
      </nav>
    </div>
  </StageContext.Provider>;
}

const HOUSES = [
  { id:"play", title:"Παιχνιδόσπιτο", caption:"Παίζω και ανακαλύπτω", url:BASE+"/games", icon:Gamepad2, x:72, y:45 },
  { id:"art", title:"Μαγικό Ατελιέ", caption:"Ζωγραφίζω", url:BASE+"/atelier", icon:Palette, x:23, y:47 },
  { id:"story", title:"Δεντροβιβλιοθήκη", caption:"Ακούω ιστορίες", url:BASE+"/stories", icon:BookOpen, x:47, y:32 },
];
export function StageVillage() {
  const { age, explore, changeExplore } = useStage();
  const [pan, setPan] = useState(0);
  const canExplore = age > 0;
  const doExplore = (checked:boolean) => { changeExplore(checked && canExplore); setPan(0); };
  return <div className="p2-village-screen">
    <div className="p2-screen-heading">
      <div><span className="p2-kicker">ΚΑΛΩΣ ΗΡΘΕΣ ΣΤΟΝ ΚΟΣΜΟ ΜΟΥ</span><h1>Έλα να παίξουμε μαζί!</h1><p>Διάλεξε ένα σπιτάκι και ξεκινάμε μια περιπέτεια.</p></div>
      <div className="p2-heading-right"><SpeakButton text="Γεια σου! Είμαι ο Πισιπούκ! Διάλεξε ένα σπιτάκι για να παίξουμε."/>{canExplore && <button type="button" className={"p2-explore-toggle "+(explore?"on":"")} aria-pressed={explore} onClick={()=>doExplore(!explore)}><Compass size={19}/>{explore?"Εξερεύνηση ενεργή":"Εξερευνώ"}</button>}{!canExplore&&<span className="p2-fixed-note"><Hand size={17}/> Απλό χωριό</span>}</div>
    </div>
    <div className={"p2-village-stage "+(explore?"p2-exploring":"")}>
      <div className="p2-village-pan" style={{transform:explore?"translateX("+pan+"%) scale(1.13)":"none"}}>
        <img className="p2-village-art" src="/preschool-world/village.webp" alt="Εικονογραφημένο χωριό Πισιπούκ με πολλά σπιτάκια και δέντρα" />
        {HOUSES.map(({id,title,url,icon:Icon,x,y})=><Link to={url} key={id} className={"p2-hotspot p2-hotspot-"+id} style={{left:x+"%",top:y+"%"}} title={title}><Icon size={23}/><span>{title}</span></Link>)}
      </div>
      <div className="p2-stage-mascot"><img src="/preschool-world/bear.webp" alt="" /><span>Πού πάμε σήμερα;</span></div>
      {explore&& <div className="p2-pan-controls" aria-label="Μετακίνηση χωριού"><button type="button" onClick={()=>setPan(v=>Math.min(12,v+5))} aria-label="Εξερεύνηση αριστερά"><ChevronLeft/></button><button type="button" onClick={()=>setPan(v=>Math.max(-12,v-5))} aria-label="Εξερεύνηση δεξιά"><ChevronRight/></button><button type="button" onClick={()=>setPan(0)}>Κέντρο</button></div>}
    </div>
    <div className="p2-room-fallback" aria-label="Δωμάτια του χωριού">{HOUSES.map(({title,caption,url,icon:Icon})=><Link key={url} to={url} className="p2-room-tile"><Icon size={26}/><strong>{title}</strong><span>{caption}</span><ArrowRight size={18} className="p2-room-arrow"/></Link>)}</div>
    <div className="p2-prototype-note"><Sparkles size={17}/> Το preview δείχνει 3 πραγματικές διαδρομές. Οι επόμενοι χώροι (κατασκευές, μουσική, φύση) περιλαμβάνονται στην αρχιτεκτονική, όχι ακόμη σε αυτό το δοκιμαστικό.</div>
  </div>;
}

type Task = { prompt:string; correct:string; options: string[]; note:string };
const TASKS: Task[] = [
 { prompt:"Πού είναι ο κύκλος;", correct:"circle", options:["circle","square","triangle","star"], note:"Παρατηρώ τα σχήματα"},
 { prompt:"Πού είναι το τρίγωνο;", correct:"triangle", options:["triangle","square","circle","star"], note:"Μαθαίνω παίζοντας"},
 { prompt:"Πού είναι το τετράγωνο;", correct:"square", options:["square","circle","triangle","star"], note:"Διακρίνω σχήματα"},
 { prompt:"Πού είναι το αστέρι;", correct:"star", options:["star","triangle","circle","square"], note:"Βρίσκω το σωστό σύμβολο"},
];
const SHAPES: Record<string, {symbol:string,label:string,color:string}> = {
  circle:{symbol:"●",label:"Κύκλος",color:"#F19F40"},
  square:{symbol:"■",label:"Τετράγωνο",color:"#73C0DD"},
  triangle:{symbol:"▲",label:"Τρίγωνο",color:"#AF9CDD"},
  star:{symbol:"★",label:"Αστέρι",color:"#E986A9"},
};
export function StageGames() {
  const {age}=useStage(); const [round,setRound]=useState(0); const [choice,setChoice]=useState("");
  const task=TASKS[round%TASKS.length];
  const count=age===0?2:age===1?3:4;
  const options=useMemo(()=>{
    const other=task.options.filter(x=>x!==task.correct);
    const offset=round%other.length;
    const mix=[task.correct, ...other.slice(offset).concat(other.slice(0,offset)).slice(0,count-1)];
    return mix.slice(round%count).concat(mix.slice(0,round%count));
  },[task,round,count]);
  const success=choice===task.correct;
  const pick=(key:string)=>setChoice(key);
  const reset=()=>setChoice("");
  const next=()=>{setRound(n=>n+1);setChoice("");};
  return <div className="p2-game-screen">
    <div className="p2-breadcrumb"><Link to={BASE+"/"}><ArrowLeft size={17}/> Χωριό</Link><span> / Παιχνιδόσπιτο</span></div>
    <div className="p2-game-card">
      <div className="p2-game-heading"><div><span className="p2-kicker">ΠΑΙΧΝΙΔΙ ΜΕ ΣΧΗΜΑΤΑ · {AGES[age]} ΕΤΩΝ</span><h1>Το μαγικό παιχνίδι</h1><p>{task.note}</p></div><img src="/preschool-world/bear.webp" alt="Πισιπούκ" /></div>
      <div className="p2-game-prompt"><strong>{task.prompt}</strong><SpeakButton text={task.prompt}/></div>
      <div className={"p2-answers p2-answers-"+count}>{options.map(key=><button type="button" key={key} aria-pressed={choice===key} className={"p2-answer "+(choice===key?(success?"good":"selected"):"")} onClick={()=>pick(key)}><span className="p2-symbol" style={{color:SHAPES[key].color}} aria-hidden="true">{SHAPES[key].symbol}</span><strong>{SHAPES[key].label}</strong></button>)}</div>
      <div className="p2-feedback" aria-live="polite">{choice?(success?<><Heart size={22}/> Μπράβο! Το ανακάλυψες!</>:<>Δοκίμασε ξανά, ο Πισιπούκ είναι μαζί σου.</>):"Άγγιξε το σωστό σχήμα!"}</div>
      <div className="p2-game-actions"><button type="button" className="p2-secondary" onClick={reset}><RotateCcw size={19}/> Ξανά το ίδιο</button><button type="button" className="p2-primary" onClick={next}>Νέος γύρος <ArrowRight size={19}/></button></div>
    </div>
    <div className="p2-prototype-note"><Sparkles size={17}/> Αυτό είναι ένα λειτουργικό UX δείγμα ενός μηχανισμού — όχι η τελική βιβλιοθήκη παιχνιδιών.</div>
  </div>;
}

const PALETTE=["#EA816C","#FFB85C","#7BB5E7","#8DC7A0","#AF9FD8","#2F5277"];
export function StageAtelier() {
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const drawing=useRef(false); const [color,setColor]=useState(PALETTE[0]); const [stamp,setStamp]=useState(0); const history=useRef<string[]>([]);
  const restore=(data:string)=>{const canvas=canvasRef.current;if(!canvas||!data)return;const ctx=canvas.getContext("2d");if(!ctx)return;const img=new Image();img.onload=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#ffffff";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);};img.src=data;};
  useEffect(()=>{const canvas=canvasRef.current;if(!canvas)return;const ctx=canvas.getContext("2d");if(!ctx)return;ctx.fillStyle="#ffffff";ctx.fillRect(0,0,canvas.width,canvas.height);try{const saved=sessionStorage.getItem("p2-drawing");if(saved){history.current=[saved];restore(saved);} }catch{}},[]);
  const point=(e:ReactPointerEvent<HTMLCanvasElement>)=>{const c=e.currentTarget.getBoundingClientRect();return {x:(e.clientX-c.left)/c.width*900,y:(e.clientY-c.top)/c.height*550};};
  const start=(e:ReactPointerEvent<HTMLCanvasElement>)=>{e.currentTarget.setPointerCapture(e.pointerId);const p=point(e);const ctx=e.currentTarget.getContext("2d");if(!ctx)return;drawing.current=true;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+.3,p.y+.3);ctx.strokeStyle=color;ctx.lineWidth=11;ctx.lineCap="round";ctx.lineJoin="round";ctx.stroke();};
  const move=(e:ReactPointerEvent<HTMLCanvasElement>)=>{if(!drawing.current)return;const ctx=e.currentTarget.getContext("2d");if(!ctx)return;const p=point(e);ctx.lineTo(p.x,p.y);ctx.stroke();};
  const finish=()=>{if(!drawing.current)return;drawing.current=false;const data=canvasRef.current?.toDataURL("image/png")||"";if(data){history.current=[...history.current.slice(-9),data];try{sessionStorage.setItem("p2-drawing",data);}catch{}setStamp(v=>v+1);}};
  const undo=()=>{if(history.current.length<2)return;history.current.pop();const prev=history.current[history.current.length-1];restore(prev);try{sessionStorage.setItem("p2-drawing",prev);}catch{}};
  const clear=()=>{const c=canvasRef.current;if(!c)return;const ctx=c.getContext("2d");if(!ctx)return;ctx.fillStyle="#ffffff";ctx.fillRect(0,0,c.width,c.height);const data=c.toDataURL();history.current=[data];try{sessionStorage.setItem("p2-drawing",data);}catch{}setStamp(v=>v+1);};
  const save=()=>{const data=canvasRef.current?.toDataURL("image/png");if(!data)return;const a=document.createElement("a");a.href=data;a.download="pisipouk-zografia-staging.png";a.click();};
  return <div className="p2-art-screen">
    <div className="p2-breadcrumb"><Link to={BASE+"/"}><ArrowLeft size={17}/> Χωριό</Link><span> / Μαγικό Ατελιέ</span></div>
    <div className="p2-art-header"><div><span className="p2-kicker">ΜΑΓΙΚΟ ΑΤΕΛΙΕ</span><h1>Ζωγραφίζω τον κόσμο μου</h1><p>Διάλεξε χρώμα και ζωγράφισε ελεύθερα. Η ζωγραφιά παραμένει στη συσκευή κατά την περιήγηση.</p></div><img src="/preschool-world/bear.webp" alt="" /></div>
    <div className="p2-painter"><div className="p2-palette" role="group" aria-label="Διάλεξε χρώμα">{PALETTE.map(c=><button type="button" key={c} onClick={()=>setColor(c)} aria-label={"Χρώμα "+c} aria-pressed={c===color} className={c===color?"p2-current-color":""} style={{background:c}}/>)}</div>
    <canvas ref={canvasRef} width={900} height={550} className="p2-canvas" aria-label="Καμβάς ζωγραφικής" onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} />
    <div className="p2-painter-actions"><button type="button" className="p2-secondary" onClick={undo}><Undo2 size={17}/> Αναίρεση</button><button type="button" className="p2-secondary" onClick={clear}><Eraser size={17}/> Καθαρισμός</button><button type="button" className="p2-primary" onClick={save}><Download size={18}/> Αποθήκευση PNG</button></div></div>
    <div className="p2-prototype-note"><Sparkles size={17}/> Καμβάς staging με βασική ζωγραφική. Τα πατρόν, η εκτύπωση A4 και το πλήρες toolset αποτελούν επόμενο implementation milestone.</div>
  </div>;
}

const STORY=[
 {title:"Μια καινούργια περιπέτεια",text:"Ο Πισιπούκ άνοιξε το παράθυρο και είδε τον ήλιο να λάμπει πάνω από το χωριό.",emoji:"☀️"},
 {title:"Ένας φίλος στον κήπο",text:"Στον κήπο βρήκε ένα μικρό λουλούδι που διψούσε. Τι θα μπορούσε να κάνει;",emoji:"🌷"},
 {title:"Μια πράξη φροντίδας",text:"Ο Πισιπούκ έφερε λίγο νερό. Το λουλούδι ίσιωσε τα πέταλά του και χαμογέλασε.",emoji:"💧"},
 {title:"Η χαρά μοιράζεται",text:"Από εκείνη τη μέρα, ο Πισιπούκ επισκεπτόταν τον κήπο και φρόντιζε τα φυτά μαζί με τους φίλους του.",emoji:"🌼"},
];
export function StageStories() {
  const [page,setPage]=useState(0);
  const story=STORY[page];
  return <div className="p2-stories-screen">
    <div className="p2-breadcrumb"><Link to={BASE+"/"}><ArrowLeft size={17}/> Χωριό</Link><span> / Δεντροβιβλιοθήκη</span></div>
    <div className="p2-story-book"><div className="p2-book-illustration"><div className="p2-story-icon">{story.emoji}</div><img src="/preschool-world/bear.webp" alt="" /></div><div className="p2-story-page"><span className="p2-kicker">ΜΙΑ ΙΣΤΟΡΙΑ ΤΟΥ ΠΙΣΙΠΟΥΚ</span><h1>{story.title}</h1><p>{story.text}</p><div className="p2-story-audio"><SpeakButton text={story.text}/> <span>Άκουσε την ιστορία</span></div><div className="p2-page-count">Σελίδα {page+1} από {STORY.length}</div><div className="p2-page-actions"><button className="p2-secondary" type="button" onClick={()=>setPage(v=>Math.max(0,v-1))} disabled={page===0}><ChevronLeft size={18}/> Προηγούμενη</button><button className="p2-primary" type="button" onClick={()=>setPage(v=>(v+1)%STORY.length)}>{page===STORY.length-1?"Από την αρχή":"Επόμενη"} <ChevronRight size={18}/></button></div></div></div>
    <div className="p2-prototype-note"><Sparkles size={17}/> Τα πρωτότυπα εικονογραφημένα βιβλία και η επαγγελματική ελληνική αφήγηση θα εγκριθούν ξεχωριστά. Εδώ αξιολογούμε τη ροή σελίδων.</div>
  </div>;
}
export function StageAdults(){
  return <div className="p2-adults-screen"><div className="p2-breadcrumb"><Link to={BASE+"/"}><ArrowLeft size={17}/> Χωριό</Link><span> / Χώρος ενηλίκων</span></div><span className="p2-kicker">ΣΧΕΔΙΑΣΜΟΣ ΧΩΡΟΥ ΕΝΗΛΙΚΩΝ</span><h1>Δραστηριότητες & δημιουργίες</h1><p>Ο χώρος ενηλίκων θα είναι ξεχωριστή εμπειρία με πραγματικό έλεγχο πρόσβασης. Αυτή είναι μόνο οπτική προδιαγραφή, όχι διαθέσιμο διαχειριστικό σύστημα.</p><div className="p2-adult-grid"><div><Printer size={28}/><h2>Εκτυπώσιμα</h2><p>A4/A5, ασπρόμαυρα και έγχρωμα.</p><span>Υπό σχεδιασμό</span></div><div><BookOpen size={28}/><h2>Πλάνο εβδομάδας</h2><p>Εγκεκριμένες δραστηριότητες για τέσσερις ηλικίες.</p><span>Υπό σχεδιασμό</span></div><div><LockKeyhole size={28}/><h2>Ασφαλής κοινοποίηση</h2><p>Πραγματικό email με έλεγχο ενηλίκου και συναίνεση.</p><span>Υπό σχεδιασμό</span></div></div></div>;
}
