import { useEffect, useRef, useState } from "react";
import {
 ArrowLeft, ArrowRight, BookOpen, Compass, Download, Heart, Home, Palette, Play, Printer, RotateCcw, Scissors, Sparkles,
 Volume2, Users, Puzzle, X
} from "lucide-react";
import exteriorScene from "@/assets/pisipouk-exterior.webp";
import classroomScene from "@/assets/pisipouk-classroom.webp";
import arrivalScene from "@/assets/pisipouk-arrival.webp";
import storyScene from "@/assets/pisipouk-story.webp";
import { Drawing } from "../world/Drawing";
import { StoryBook } from "../world/Stories";
import { PreschoolWorld } from "../world/World";
import { speak } from "../world/Game";
import { AGE_PATHS, CRAFTS, type CraftId, type PreschoolAge, craftSvg, saveCraftTemplate } from "./curriculum";
import { ShadowTheatre } from "./ShadowTheatre";
import { GameDirections, guideText, useGuideAudio, type GuideCue } from "../GameDirections";
import "./wonder.css";

type Area = "home" | "games" | "crafts" | "drawing" | "stories" | "village" | "nov17";
type GameKind = "colors" | "shapes" | "pattern" | "count" | "feelings" | "garden";
const GAME_LIBRARY: {id:GameKind;title:string;detail:string;icon:string;from:PreschoolAge;area:string}[] = [
 {id:"colors",title:"Το ουράνιο τόξο",detail:"Διάλεξε το σωστό χρώμα",icon:"🌈",from:0,area:"Χρώματα"},
 {id:"shapes",title:"Σχήματα στη φωλιά",detail:"Βρες ποιο σχήμα ταιριάζει",icon:"🔵",from:0,area:"Οπτική διάκριση"},
 {id:"garden",title:"Μεγαλώνω τον Σπορούλη",detail:"Χώμα, νερό, ήλιος και φροντίδα",icon:"🌱",from:0,area:"Φύση"},
 {id:"feelings",title:"Πώς νιώθει ο φίλος μου;",detail:"Μαθαίνω να αναγνωρίζω συναισθήματα",icon:"💛",from:1,area:"Συναισθήματα"},
 {id:"pattern",title:"Το μονοπάτι των μοτίβων",detail:"Ποιο έρχεται μετά;",icon:"🧩",from:1,area:"Σκέψη"},
 {id:"count",title:"Ο κήπος με τα μήλα",detail:"Μετράω παίζοντας",icon:"🍎",from:2,area:"Μαθηματικά"}
];
const SCENES:Record<GameKind,string>={
 colors:exteriorScene,shapes:classroomScene,garden:arrivalScene,
 feelings:storyScene,pattern:classroomScene,count:exteriorScene
};
const ROOM_SCENES:Record<Area,string>={
 home:exteriorScene,games:arrivalScene,crafts:classroomScene,
 drawing:classroomScene,stories:storyScene,village:exteriorScene
};
const PALETTE=[
 {name:"κόκκινο",color:"#e85362",emoji:"🍎"},
 {name:"μπλε",color:"#368bd7",emoji:"🫐"},
 {name:"κίτρινο",color:"#efbc29",emoji:"🌞"},
 {name:"πράσινο",color:"#43a56a",emoji:"🍀"}
];
const SHAPES=[{name:"κύκλος",icon:"●",css:"circle"},{name:"τετράγωνο",icon:"■",css:"square"},{name:"τρίγωνο",icon:"▲",css:"triangle"}];
const FEELINGS=[{name:"χαρά",face:"😄",question:"Ο Πισιπούκ πήρε μια ζεστή αγκαλιά. Πώς νιώθει;",correct:0},
 {name:"λύπη",face:"😢",question:"Η μικρή αρκούδα έχασε το παιχνίδι της. Πώς νιώθει;",correct:1},
 {name:"έκπληξη",face:"😮",question:"Μια πεταλούδα προσγειώθηκε ξαφνικά στη μύτη του! Πώς νιώθει;",correct:2}];

function TextToSpeech({text}:{text:string}){
 const [state,setState]=useState("");
 return <div className="ps-speak"><button type="button" onClick={()=>speak(text,setState)} aria-label="Άκουσε τις οδηγίες στα ελληνικά"><Volume2 size={20}/> Άκουσέ το</button>{state&&<small role="status">{state}</small>}</div>;
}
const colorCues = ["red", "blue", "yellow", "green"] as const;
const shapeCues = ["circle", "square", "triangle"] as const;
const gameTitles: Record<GameKind, string> = {
  colors: "Τα χρώματα της φύσης",
  shapes: "Τα σχήματα στον κήπο",
  pattern: "Το μυστικό μοτίβο",
  count: "Μετράω τα μήλα",
  feelings: "Μαθαίνω τα συναισθήματα",
  garden: "Ο Σπορούλης μεγαλώνει",
};
const gardenMoves = [
  { icon: "🌰", label: "Βάλε τον σπόρο" },
  { icon: "💧", label: "Πότισε τον σπόρο" },
  { icon: "☀️", label: "Δώσε φως" },
  { icon: "🌱", label: "Δες το βλαστάρι" },
];
const gameExamples: Record<GameKind, { label: string; pieces: string[]; action: string }> = {
  colors: { label: "Παράδειγμα: βλέπω πράσινο και πατάω το πράσινο", pieces: ["🍀", "→"], action: "🟢" },
  shapes: { label: "Παράδειγμα: βλέπω τρίγωνο και πατάω το τρίγωνο", pieces: ["▲", "→"], action: "▲" },
  pattern: { label: "Παράδειγμα: καρδιά, ήλιος, καρδιά, μετά ήλιος", pieces: ["💛", "☀️", "💛", "→"], action: "☀️" },
  count: { label: "Παράδειγμα: ένα, δύο μήλα. Πατάω το δύο", pieces: ["🍎", "🍎", "→"], action: "2" },
  feelings: { label: "Παράδειγμα: βλέπω ένα χαμόγελο, διαλέγω χαρούμενο πρόσωπο", pieces: ["😊", "→"], action: "😄" },
  garden: { label: "Παράδειγμα: πατάω το υλικό που μου ζητάει η γλάστρα", pieces: ["🪴", "→"], action: "💧" },
};

function gameCue(kind: GameKind, step: number, choices: number): GuideCue {
  if (kind === "colors") return colorCues[step % choices];
  if (kind === "shapes") return shapeCues[step % Math.min(3, choices)];
  if (kind === "feelings") return (["feelings-0", "feelings-1", "feelings-2"] as const)[step % 3];
  if (kind === "garden") return (["garden-0", "garden-1", "garden-2", "garden-3"] as const)[step];
  return kind;
}

function GameRoom({age}:{age:PreschoolAge}){
  const [current,setCurrent]=useState<GameKind|null>(null);
  const {play,stop}=useGuideAudio();
  const games=GAME_LIBRARY.filter(x=>x.from<=age);
  return <section className="ps-section" aria-label="Διαδραστικά παιχνίδια">
    <div className="ps-section-title"><h2>Διάλεξε παιχνίδι</h2></div>
    {current ? <div className="ps-lab">
      <button className="ps-back" onClick={()=>{stop();setCurrent(null);}}><ArrowLeft/> Όλα τα παιχνίδια</button>
      <GameActivity key={current+"-"+age} kind={current} age={age} play={play}/>
    </div> :
    <div className="ps-game-grid">{games.map(g=><button key={g.id} className="ps-game-card" onClick={()=>{
      setCurrent(g.id);
      play(gameCue(g.id, 0, age===0?2:age===1?3:4));
    }}><span className="ps-game-illustration" aria-hidden="true"><img src={SCENES[g.id]} alt="" loading="lazy"/><span className="ps-scene-sticker">{g.icon}</span></span><small>{g.area}</small><strong>{g.title}</strong><span>{g.detail}</span><b>Παίζω <ArrowRight size={18}/></b></button>)}</div>}
  </section>;
}

function GameActivity({kind,age,play}:{kind:GameKind;age:PreschoolAge;play:(cue:GuideCue)=>void}){
  const [step,setStep]=useState(0);
  const [message,setMessage]=useState("");
  const [demo,setDemo]=useState(1);
  const title=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{title.current?.focus();},[]);
  const choices=age===0?2:age===1?3:4;
  const rounds=kind==="garden"?4:age===0?2:3;
  const solved=step>=rounds;
  const cue=solved?"win":gameCue(kind,step,choices);
  const targetColor=PALETTE[step%choices];
  const shapeChoices=SHAPES.slice(0,Math.min(3,choices));
  const targetShape=shapeChoices[step%shapeChoices.length];
  const countGoal=Math.min(2+step+age,7);
  const feelings=FEELINGS[step%FEELINGS.length];
  const pattern=step%2===0?["🔴","🔵","🔴","🔵"]:["⭐","🌿","🌿","⭐","🌿","🌿"];
  const expected=step%2===0?"🔴":"⭐";
  const example=gameExamples[kind];
  const reset=()=>{setStep(0);setDemo(v=>v+1);setMessage("");play(gameCue(kind,0,choices));};
  const tryChoice=(right:boolean)=>{
    if(!right){
      setMessage("Δες το παράδειγμα και δοκίμασε άλλη επιλογή.");
      setDemo(v=>v+1);
      play(cue);
      return;
    }
    const next=step+1;
    setStep(next);
    setMessage("Μπράβο!");
    setDemo(0);
    play(next>=rounds?"win":gameCue(kind,next,choices));
  };
  return <div className="ps-game-stage" data-game-demo={demo>0}>
    <div className="ps-game-meta"><h3 ref={title} tabIndex={-1}>{gameTitles[kind]}</h3><button onClick={reset}><RotateCcw size={17}/> Από την αρχή</button></div>
    {solved ? <div className="ps-win" role="status"><span aria-hidden="true">🌟 🐻 🌟</span><h4>Τα κατάφερες!</h4><button className="ps-primary" onClick={reset}><RotateCcw/> Παίζω ξανά</button></div> : <>
      <GameDirections text={guideText[cue]} listen={()=>play(cue)} show={()=>{setDemo(v=>v+1);play(cue);}}/>
      {demo>0&&<div className="ps-game-example" key={demo} aria-label={example.label}>
        {example.pieces.map((piece,i)=><span key={i} aria-hidden="true">{piece}</span>)}
        <span className="ps-demo-target" aria-hidden="true">{example.action}</span>
        <span className="ps-demo-motion" aria-hidden="true">👆</span>
      </div>}
      {kind==="colors"&&<div className="ps-choices">{PALETTE.slice(0,choices).map(c=><button key={c.name} className="ps-color-choice" aria-label={c.name} onClick={()=>tryChoice(c.name===targetColor.name)} style={{background:c.color}}><span aria-hidden="true">{c.emoji}</span><b>{c.name}</b></button>)}</div>}
      {kind==="shapes"&&<div className="ps-choices">{shapeChoices.map(c=><button key={c.name} className="ps-shape-choice" onClick={()=>tryChoice(c.name===targetShape.name)}><span aria-hidden="true">{c.icon}</span><b>{c.name}</b></button>)}</div>}
      {kind==="pattern"&&<><div className="ps-pattern-line" aria-label="Μοτίβο">{pattern.map((v,i)=><span key={i}>{v}</span>)}<span className="ps-questionmark">?</span></div><div className="ps-choices">{(age<3?["🔴","🔵","⭐"]:["⭐","🔴","🌿"]).map(v=><button key={v} className="ps-choice-square" onClick={()=>tryChoice(v===expected)}>{v}</button>)}</div></>}
      {kind==="count"&&<><div className="ps-apples" aria-label={`${countGoal} μήλα`}>{Array.from({length:countGoal},(_,i)=><span key={i}>🍎</span>)}</div><div className="ps-choices">{[countGoal-1,countGoal,countGoal+1].map(n=><button key={n} className="ps-choice-square" onClick={()=>tryChoice(n===countGoal)}>{n}</button>)}</div></>}
      {kind==="feelings"&&<div className="ps-choices">{FEELINGS.map((f,i)=><button key={f.name} className="ps-emotion-choice" onClick={()=>tryChoice(i===feelings.correct)}><span aria-hidden="true">{f.face}</span><b>{f.name}</b></button>)}</div>}
      {kind==="garden"&&<div className="ps-garden-game"><div className="ps-garden-visual" aria-label={["Άδειο γλαστράκι","Ο σπόρος μέσα στο χώμα","Υγρό χώμα","Ο ήλιος ζεσταίνει το σπόρο"][step]}><span className="ps-sun" aria-hidden="true">☀️</span><span className="ps-garden-top" aria-hidden="true">{["🪴","🌰","💧","🌱"][step]}</span><div className="ps-pot" aria-hidden="true">🪴</div></div><div className="ps-garden-actions"><button aria-current="step" onClick={()=>tryChoice(true)}><span aria-hidden="true">{gardenMoves[step].icon}</span>{gardenMoves[step].label}</button></div></div>}
      <p className="ps-gentle-feedback" role="status">{message}</p>
      <div className="ps-progress-dots" aria-label={`${step} από ${rounds} βήματα`}>{Array.from({length:rounds},(_,i)=><span key={i} className={i<step?"finished":""}/>)}</div>
    </>}
  </div>;
}
function CraftStudio({age}:{age:PreschoolAge}){
 const [craftId,setCraftId]=useState<CraftId|null>(null);
 const [step,setStep]=useState(0);
 const [msg,setMsg]=useState("");
 const available=CRAFTS.filter(c=>c.minAge<=age);
 const craft=CRAFTS.find(c=>c.id===craftId);
 useEffect(()=>{setCraftId(null);setStep(0);},[age]);
 const print=()=>{
  if(!craft)return;
  const win=window.open("","_blank");
  if(!win){setMsg("Ο φυλλομετρητής εμπόδισε το παράθυρο. Κατέβασε το SVG και εκτύπωσέ το σε Α4.");return;}
  win.document.open();
  win.document.write('<!doctype html><html lang="el"><head><meta charset="utf-8"><title>Πισιπούκ • Πατρόν Α4</title><style>@page{size:A4;margin:0}body{margin:0}svg{display:block;width:210mm;height:297mm}</style></head><body>'+craftSvg(craft.id)+'</body></html>');
  win.document.close();win.focus();win.print();
 };
 return <section className="ps-section">
  <div className="ps-section-title"><span className="ps-eyebrow">ΤΟ ΕΡΓΑΣΤΗΡΙ ΤΩΝ ΧΕΡΙΩΝ</span><h2>Κατασκευάζω στ’ αλήθεια!</h2><p>Πατρόν Α4 με μεγάλα περιγράμματα και οπτικές οδηγίες. Η κατασκευή γίνεται με ενήλικο.</p></div>
  {craft ? <div className="ps-craft-detail"><button className="ps-back" onClick={()=>{setCraftId(null);setStep(0);setMsg("");}}><ArrowLeft/> Όλες οι κατασκευές</button>
    <div className="ps-craft-layout"><div className="ps-pattern-preview"><div className="ps-pattern-paper"><img alt={`Ασπρόμαυρο πατρόν Α4: ${craft.title}`} src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(craftSvg(craft.id))}`}/></div><div className="ps-pattern-tools"><button onClick={()=>saveCraftTemplate(craft.id)}><Download/> Πατρόν SVG Α4</button><button onClick={print}><Printer/> Εκτύπωση Α4</button></div><p role="status">{msg}</p></div>
    <div className="ps-steps-card"><small>ΚΑΤΑΣΚΕΥΗ ΜΕ ΑΛΗΘΙΝΑ ΥΛΙΚΑ</small><h3>{craft.title}</h3><p className="ps-materials"><b>Χρειαζόμαστε:</b> {craft.materials}</p><div className="ps-step-indicator">{craft.steps.map((s,i)=><button key={i} className={step===i?"active":""} aria-label={`Βήμα ${i+1}: ${s.title}`} aria-current={step===i?"step":undefined} onClick={()=>setStep(i)}>{i+1}</button>)}</div>
      <div className="ps-step-focus"><div className="ps-step-art" aria-hidden="true">{craft.steps[step].icon}</div><span>ΒΗΜΑ {step+1} ΑΠΟ {craft.steps.length}</span><h4>{craft.steps[step].title}</h4><p>{craft.steps[step].help}</p><TextToSpeech text={craft.steps[step].help}/></div>
      <div className="ps-step-controls"><button disabled={step===0} onClick={()=>setStep(v=>v-1)}><ArrowLeft/> Πίσω</button><button className="ps-primary" onClick={()=>{if(step<craft.steps.length-1)setStep(v=>v+1);else setMsg("Μπράβο για την προσπάθεια! Τώρα δοκιμάζουμε έξω από την οθόνη.");}}>{step===craft.steps.length-1?"Το έφτιαξα!":"Επόμενο βήμα"} <ArrowRight/></button></div>
      <div className="ps-educator-note"><b>💬 Συζητάμε μαζί:</b> {craft.question}<p><b>🌳 Εκτός οθόνης:</b> {craft.experience}</p><p><b>⚠️ Ασφάλεια:</b> {craft.safety}</p></div>
    </div></div></div>:
   <div className="ps-craft-grid">{available.map(c=><button key={c.id} className="ps-craft-card" onClick={()=>{setCraftId(c.id);setStep(0);}}><div className="ps-craft-thumb"><img loading="lazy" src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(craftSvg(c.id))}`} alt=""/></div><span>{c.subtitle}</span><strong>{c.title}</strong><b>Δες τα βήματα <ArrowRight size={18}/></b></button>)}</div>}
 </section>;
}

const POLYTECHNIC_2026_EPISODES = [
 { title:"1967: Οι στρατιωτικοί κυβερνούν", icon:"🕊️", year:"1967", story:"Το 1967 στην Ελλάδα μια ομάδα στρατιωτικών πήρε την εξουσία. Οι άνθρωποι δεν μπορούσαν να εκφράζονται ελεύθερα και δεν γίνονταν ελεύθερες εκλογές.", plain:"Η ελευθερία σημαίνει ότι μπορούμε να λέμε τη γνώμη μας και να συμμετέχουμε στις αποφάσεις.", question:"Πώς νιώθουμε όταν δεν μας αφήνουν να μιλήσουμε;" },
 { title:"Τι ήθελαν οι άνθρωποι;", icon:"📚", year:"1967–1973", story:"Πολλοί άνθρωποι, και ιδιαίτερα οι νέοι, ζητούσαν ελευθερία, καλύτερη παιδεία και δημοκρατία. Ήθελαν να ακούγεται η φωνή όλων.", plain:"Κάθε παιδί έχει δικαίωμα να μαθαίνει, κι όλοι αξίζουμε σεβασμό.", question:"Γιατί είναι σημαντικό να ακούμε τη γνώμη των άλλων;" },
 { title:"Η αρχή της εξέγερσης", icon:"📣", year:"14 Νοεμβρίου 1973", story:"Στις 14 Νοεμβρίου 1973 φοιτητές συγκεντρώθηκαν στο Πολυτεχνείο. Ενώθηκαν και φώναξαν «Ψωμί – Παιδεία – Ελευθερία!»", plain:"Όταν συνεργαζόμαστε για κάτι δίκαιο, η φωνή μας γίνεται πιο δυνατή.", question:"Τι μπορούμε να καταφέρουμε όλοι μαζί;" },
 { title:"Η φωνή στο ραδιόφωνο", icon:"📻", year:"Νοέμβριος 1973", story:"Μέσα στο Πολυτεχνείο οι φοιτητές έφτιαξαν έναν ραδιοφωνικό σταθμό. Μετέδιδαν μηνύματα και καλούσαν τους ανθρώπους να τους στηρίξουν.", plain:"Το ραδιόφωνο μπορεί να μεταφέρει μία φωνή σε πάρα πολλούς ανθρώπους.", question:"Πώς μπορούμε να μεταφέρουμε ένα καλό μήνυμα;" },
 { title:"Οι άνθρωποι βοηθούν", icon:"🤝", year:"Νοέμβριος 1973", story:"Πολλοί φοιτητές και πολίτες έδειξαν αλληλεγγύη. Πρόσφεραν βοήθεια και στάθηκαν ο ένας δίπλα στον άλλον.", plain:"Αλληλεγγύη σημαίνει ότι δεν αφήνουμε κάποιον μόνο του όταν μας χρειάζεται.", question:"Πώς μπορείς να βοηθήσεις έναν φίλο σου;" },
 { title:"Η δύσκολη νύχτα του Νοέμβρη", icon:"🌙", year:"17 Νοεμβρίου 1973", story:"Τα ξημερώματα της 17ης Νοεμβρίου ο στρατός εισέβαλε στο Πολυτεχνείο με τανκ. Υπήρξε βία, άνθρωποι τραυματίστηκαν και υπήρξαν νεκροί στα γεγονότα της εξέγερσης.", plain:"Ήταν μια πολύ δύσκολη στιγμή. Θυμόμαστε τους ανθρώπους με σεβασμό και μιλάμε για την ειρήνη.", question:"Τι μας βοηθά όταν φοβόμαστε ή στενοχωριόμαστε;" },
 { title:"1974: Επιστρέφει η δημοκρατία", icon:"☀️", year:"1974", story:"Τον Ιούλιο του 1974, μήνες μετά την εξέγερση, τελείωσε η δικτατορία και αποκαταστάθηκε η δημοκρατία στην Ελλάδα.", plain:"Στη δημοκρατία οι πολίτες μπορούν να επιλέγουν τους εκπροσώπους τους με εκλογές.", question:"Πώς αποφασίζουμε δίκαια όταν έχουμε διαφορετικές ιδέες;" },
 { title:"Γιατί θυμόμαστε;", icon:"🌺", year:"17 Νοεμβρίου", story:"Κάθε χρόνο θυμόμαστε τους ανθρώπους που αγωνίστηκαν για ελευθερία, παιδεία και δημοκρατία. Τα κόκκινα γαρύφαλλα είναι σύμβολο μνήμης.", plain:"Η ελευθερία, η ειρήνη, ο σεβασμός και η δημοκρατία αξίζουν τη φροντίδα μας.", question:"Πώς δείχνουμε σεβασμό στους άλλους;" }
] as const;
function PolytechnicNovember2026(){
 return <section className="ps-section" id="polytechneio-2026" aria-label="17 Νοεμβρίου 2026 • Το Πολυτεχνείο">
  <div className="ps-section-title"><span className="ps-eyebrow">ΕΠΕΤΕΙΑΚΟ ΑΦΙΕΡΩΜΑ • 17 ΝΟΕΜΒΡΙΟΥ 2026</span><h2>Μια ιστορία για την ελευθερία 🌺</h2><p>Το Πολυτεχνείο μέσα από οκτώ μικρά επεισόδια, για παιδιά 3–6 ετών. Διαβάζουμε και συζητάμε μαζί με έναν ενήλικο.</p></div>
  <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:12,marginBottom:24}}>
    <img src="/preschool-world/bear.webp" alt="Ο Πισιπούκ" style={{width:76,height:76,objectFit:"contain"}} />
    <div><strong style={{display:"block",color:"#174a75"}}>Ο Πισιπούκ μαθαίνει να ακούει, να βοηθά και να θυμάται.</strong><span>8 επεισόδια • ιστορία • συναισθήματα • ερωτήσεις συζήτησης</span></div>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,300px),1fr))",gap:16}}>
   {POLYTECHNIC_2026_EPISODES.map((ep,i)=><article key={ep.title} style={{padding:22,borderRadius:24,background:"linear-gradient(160deg,#fff8ec,#eef8ff)",border:"1px solid #e8dfd4",boxShadow:"0 8px 24px #2342a00d"}}>
    <div style={{fontSize:36}} aria-hidden="true">{ep.icon}</div><span style={{color:"#b74754",fontSize:12,fontWeight:800}}>ΕΠΕΙΣΟΔΙΟ {i+1} • {ep.year}</span>
    <h3 style={{fontSize:22,color:"#143c68",margin:"8px 0 14px"}}>{ep.title}</h3><p style={{lineHeight:1.75}}>{ep.story}</p>
    <p style={{background:"#fff",borderRadius:14,padding:12,lineHeight:1.6}}><b>Με απλά λόγια:</b> {ep.plain}</p>
    <p style={{color:"#6c4268",lineHeight:1.6}}><b>💬 Συζητάμε μαζί:</b> {ep.question}</p>
   </article>)}
  </div>
  <div style={{marginTop:26,padding:22,borderRadius:24,background:"linear-gradient(120deg,#fff1df,#e6f7ff)",display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:16}}><div><strong style={{display:"block",fontSize:21,color:"#143c68"}}>🎨 8 νέες διαδραστικές δραστηριότητες</strong><p style={{margin:"8px 0 0",lineHeight:1.6}}>Αντιστοίχιση, ερωτήσεις, ψηφιακή ζωγραφική, δικά μου μηνύματα και εκτυπώσιμες κάρτες Α4.</p></div><a href="/virtual-preschool/november-17-activities" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"14px 22px",borderRadius:999,color:"#fff",background:"#8b4be9",fontWeight:900,textDecoration:"none"}}>Παίζω και δημιουργώ →</a></div>
  <p style={{marginTop:22,fontSize:14,color:"#516071"}}>🖨️ Το εικονογραφημένο βιβλιαράκι Α4 διατίθεται ξεχωριστά. Η παρούσα ενότητα περιλαμβάνει την ψηφιακή αφήγηση των οκτώ επεισοδίων.</p>
 </section>;
}

const MENU: {id:Area;label:string;icon:typeof Home}[] = [
 {id:"home",label:"Αρχική",icon:Home},
 {id:"games",label:"Παιχνίδια",icon:Puzzle},
 {id:"crafts",label:"Κατασκευές",icon:Scissors},
 {id:"drawing",label:"Ζωγραφική",icon:Palette},
 {id:"stories",label:"Ιστορίες",icon:BookOpen},
 {id:"village",label:"16 κόσμοι",icon:Compass},
 {id:"nov17",label:"17 Νοεμβρίου",icon:BookOpen}
];
function JourneyHome({age,go}:{age:PreschoolAge;go:(a:Area)=>void}){
 const cards=[
  {id:"games" as Area,title:"Το δάσος των παιχνιδιών",description:"Χρώματα, σχήματα, μοτίβα και μικρές ανακαλύψεις.",eyebrow:"ΠΑΙΖΩ",icon:Puzzle,tone:"mint"},
  {id:"crafts" as Area,title:"Το εργαστήρι του Πισιπούκ",description:"Μεγάλα πατρόν, εικόνες και βήματα με τα χέρια.",eyebrow:"ΚΑΤΑΣΚΕΥΑΖΩ",icon:Scissors,tone:"peach"},
  {id:"drawing" as Area,title:"Το πολύχρωμο ατελιέ",description:"Ζωγραφίζω με το δάχτυλο και κρατάω την εικόνα μου.",eyebrow:"ΖΩΓΡΑΦΙΖΩ",icon:Palette,tone:"lavender"},
  {id:"stories" as Area,title:"Η φωλιά των ιστοριών",description:"Ακούω, παρατηρώ, φαντάζομαι και αφηγούμαι.",eyebrow:"ΑΚΟΥΩ",icon:BookOpen,tone:"sun"},
  {id:"nov17" as Area,title:"17 Νοεμβρίου 2026 • Το Πολυτεχνείο",description:"Οκτώ ιστορίες για την ελευθερία, τη δημοκρατία και τον σεβασμό.",eyebrow:"ΝΕΟ • ΓΙΑ ΠΑΙΔΙΑ 3–6",icon:BookOpen,tone:"peach"},
  {id:"village" as Area,title:"Το μεγάλο χωριό της μάθησης",description:"Εξερευνώ και τους 16 ήδη υπάρχοντες εκπαιδευτικούς κόσμους.",eyebrow:"ΕΞΕΡΕΥΝΩ",icon:Compass,tone:"sky"}
 ];
 return <><section className="ps-hero"><div className="ps-hero-scenery" role="img" aria-label="Εικονογραφημένο χωριό με παιχνίδια, σπίτια και δέντρα"/><div className="ps-hero-shade"/><div className="ps-hero-text"><span className="ps-hero-tag"><Sparkles size={17}/> ΚΑΛΩΣ ΗΡΘΕΣ ΣΤΟ ΧΩΡΙΟ ΜΑΣ!</span><h1>Κάθε μέρα, <em>μια μικρή</em> μαγική ανακάλυψη!</h1><p>{AGE_PATHS[age].promise} Εδώ παίζουμε, δοκιμάζουμε και δημιουργούμε μαζί με τον Πισιπούκ.</p><button className="ps-hero-action" onClick={()=>go("games")}><Play fill="currentColor"/> Ξεκινάμε το παιχνίδι <ArrowRight/></button></div><img className="ps-hero-bear" src="/preschool-world/bear.webp" alt="Ο Πισιπούκ, το χαμογελαστό αρκουδάκι"/></section>
 <section className="ps-welcome-panel"><div><span className="ps-eyebrow">ΜΙΑ ΔΙΑΔΡΟΜΗ ΣΤΑ ΜΕΤΡΑ ΣΟΥ</span><h2>Σήμερα είμαι {AGE_PATHS[age].age} ετών!</h2><p>{AGE_PATHS[age].guidance}</p></div><div className="ps-welcome-sticker"><span>✨</span><b>{AGE_PATHS[age].duration}</b><small>για ένα μικρό παιχνίδι</small></div></section>
 <div className="ps-rooms">{cards.map(({id,title,description,eyebrow,icon:Icon,tone})=><button key={id} className={`ps-room ps-${tone}`} onClick={()=>go(id)}><span className="ps-room-art"><img src={ROOM_SCENES[id]} alt="" loading="lazy"/><Icon size={46} strokeWidth={1.7}/></span><span className="ps-room-body"><small>{eyebrow}</small><strong>{title}</strong><span>{description}</span><b>Μπαίνω <ArrowRight size={16}/></b></span></button>)}</div>
 <aside className="ps-offline"><span>🌿</span><div><strong>Η μεγάλη ανακάλυψη γίνεται έξω από την οθόνη.</strong><p>Μετά από ένα παιχνίδι: ζωγράφισε, χόρεψε, φύτεψε, παίξε και συζήτησε με έναν ενήλικο.</p></div></aside>
 </>;
}
export function PreschoolWonder(){
 const [age,setAge]=useState<PreschoolAge>(1);
 const [area,setArea]=useState<Area>("home");
 const [drawingData,setDrawingData]=useState("");
 const [caregiver,setCaregiver]=useState(false);
 const changeArea=(a:Area)=>{if("speechSynthesis" in window)window.speechSynthesis.cancel();setArea(a);};
 useEffect(()=>()=>{if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel();},[]);
 if(area==="village") return <div className="ps-wonder"><div className="ps-return-village"><button onClick={()=>changeArea("home")}><ArrowLeft/> Πίσω στη νέα αρχική</button></div><PreschoolWorld/></div>;
 return <div className="ps-wonder" id="ps-wonder"><a className="ps-skip" href="#ps-wonder-content">Μετάβαση στο περιεχόμενο</a>
  <header className="ps-topbar"><button className="ps-brand" onClick={()=>changeArea("home")}><img src="/preschool-world/bear.webp" alt=""/><span><b>ΠΙΣΙΠΟΥΚ</b><small>ΤΟ ΧΩΡΙΟ ΤΗΣ ΜΑΘΗΣΗΣ</small></span></button><nav aria-label="Πλοήγηση δραστηριοτήτων">{MENU.map(({id,label,icon:Icon})=><button key={id} onClick={()=>changeArea(id)} aria-current={area===id?"page":undefined}><Icon size={20}/><span>{label}</span></button>)}</nav><button className="ps-grownup" onClick={()=>setCaregiver(true)}><Users size={19}/> Για μεγάλους</button></header>
  <div className="ps-age-picker" aria-label="Επιλογή ηλικιακής ομάδας"><span>🌟 ΔΙΑΛΕΞΕ ΗΛΙΚΙΑ</span><div>{AGE_PATHS.map((item,i)=><button key={i} onClick={()=>setAge(i as PreschoolAge)} aria-pressed={age===i} style={{"--age-color":item.color} as React.CSSProperties}><b>{item.age}</b><small>ετών</small></button>)}</div><strong>{AGE_PATHS[age].title}</strong></div>
  <main id="ps-wonder-content" className="ps-main">{area!=="home"&&<div className="ps-page-breadcrumb"><button onClick={()=>changeArea("home")}><ArrowLeft size={20}/> Το χωριό μας</button><span>{MENU.find(x=>x.id===area)?.label}</span></div>}
  {area==="home"&&<><ShadowTheatre key={age} age={age}/><JourneyHome age={age} go={changeArea}/></>}
  {area==="nov17"&&<PolytechnicNovember2026/>}
  {area==="games"&&<GameRoom key={age} age={age}/>}
  {area==="crafts"&&<CraftStudio age={age}/>}
  {area==="drawing"&&<section className="ps-section"><div className="ps-section-title"><span className="ps-eyebrow">ΤΟ ΠΟΛΥΧΡΩΜΟ ΑΤΕΛΙΕ</span><h2>Το χαρτί είναι δικό σου! 🎨</h2><p>Ζωγράφισε ελεύθερα. Κάθε ιδέα είναι μοναδική!</p></div><Drawing saveData={setDrawingData}/><p className="ps-adult-hint">Ένας ενήλικος μπορεί να αποθηκεύσει ή να εκτυπώσει το έργο. {drawingData?"Η δημιουργία σου είναι έτοιμη!":""}</p></section>}
  {area==="stories"&&<section className="ps-section"><div className="ps-section-title"><span className="ps-eyebrow">Ο ΚΟΣΜΟΣ ΤΩΝ ΠΑΡΑΜΥΘΙΩΝ</span><h2>Άκου και φαντάσου 📖</h2><p>Παραμύθια στα ελληνικά με εικόνες και ερωτήσεις για συζήτηση.</p></div><StoryBook age={age} onComplete={()=>{}}/></section>}
  </main>
  <footer className="ps-footer"><span>🐻 Παίζω • Ανακαλύπτω • Δημιουργώ</span><a href="/">Πίσω στον παιδικό σταθμό Πισιπούκ</a><small>Μαθαίνουμε μαζί με έναν ενήλικο • Χωρίς δημόσιους πίνακες κατάταξης</small></footer>
  {caregiver&&<div className="ps-modal-scrim" onMouseDown={e=>{if(e.target===e.currentTarget)setCaregiver(false);}}><section role="dialog" aria-modal="true" aria-labelledby="ps-adult-heading" className="ps-grownup-dialog"><button className="ps-close" onClick={()=>setCaregiver(false)} aria-label="Κλείσιμο"><X/></button><span className="ps-eyebrow">ΓΟΝΕΙΣ ΚΑΙ ΠΑΙΔΑΓΩΓΟΙ</span><h2 id="ps-adult-heading">Εμπειρίες με νόημα, όχι περισσότερη οθόνη.</h2><p>Επιλέξτε ηλικία σύμφωνα με τις δυνατότητες και τα ενδιαφέροντα του παιδιού. Οι χρόνοι είναι ενδεικτικοί. Τα μικρότερα παιδιά χρειάζονται συνεχή συν-παρουσία ενηλίκου.</p><div className="ps-adult-facts"><p><b>NAEYC:</b> παιχνίδι, ανάπτυξη με βάση τις δυνατότητες του κάθε παιδιού.</p><p><b>HighScope:</b> σχεδιάζω, δημιουργώ, συζητώ τι έγινε.</p><p><b>Montessori / Reggio Emilia:</b> αυτενέργεια, επιλογές, υλικά και διερευνητική δημιουργία.</p></div><p><b>Ασφάλεια:</b> Τα πατρόν και η κοπή απαιτούν επίβλεψη. Δεν αποθηκεύουμε ονόματα, βαθμούς ή φωτογραφίες παιδιών σε εξυπηρετητή.</p><button className="ps-primary" onClick={()=>setCaregiver(false)}><Heart/> Κατάλαβα</button></section></div>}
 </div>;
}

