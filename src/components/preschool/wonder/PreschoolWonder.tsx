import { useEffect, useState } from "react";
import {
 ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Compass, Download, Heart, Home, Palette, Play, Printer, RotateCcw, Scissors, Sparkles,
 Sprout, Volume2, Users, Puzzle, X
} from "lucide-react";
import exteriorScene from "@/assets/pisipouk-exterior.webp";
import classroomScene from "@/assets/pisipouk-classroom.webp";
import arrivalScene from "@/assets/pisipouk-arrival.webp";
import storyScene from "@/assets/pisipouk-story.webp";
import { PremiumAtelier } from "./PremiumAtelier";
import { Drawing } from "../world/Drawing";
import { StoryBook } from "../world/Stories";
import { PreschoolWorld } from "../world/World";
import { speak } from "../world/Game";
import { AGE_PATHS, CRAFTS, type CraftId, type PreschoolAge, craftSvg, saveCraftTemplate } from "./curriculum";
import "./wonder.css";

type Area = "home" | "games" | "crafts" | "drawing" | "stories" | "village";
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
function GameRoom({age}:{age:PreschoolAge}){
 const [current,setCurrent]=useState<GameKind|null>(null);
 const games=GAME_LIBRARY.filter(x=>x.from<=age);
 return <section className="ps-section" aria-label="Διαδραστικά παιχνίδια">
   <div className="ps-section-title"><span className="ps-eyebrow">ΠΑΙΖΩ ΚΑΙ ΑΝΑΚΑΛΥΠΤΩ</span><h2>Διάλεξε μια μικρή περιπέτεια</h2><p>Πραγματικό παιχνίδι με άγγιγμα ή πληκτρολόγιο, χωρίς χρονόμετρα ή βαθμολογίες.</p></div>
   {current ? <div className="ps-lab"><button className="ps-back" onClick={()=>setCurrent(null)}><ArrowLeft/> Όλα τα παιχνίδια</button><GameActivity key={current+"-"+age} kind={current} age={age}/></div> :
   <div className="ps-game-grid">{games.map(g=><button key={g.id} className="ps-game-card" onClick={()=>setCurrent(g.id)}><span className="ps-game-illustration" aria-hidden="true"><img src={SCENES[g.id]} alt="" loading="lazy"/><span className="ps-scene-sticker">{g.icon}</span></span><small>{g.area}</small><strong>{g.title}</strong><span>{g.detail}</span><b>Παίζω <ArrowRight size={18}/></b></button>)}</div>}
 </section>;
}
function GameActivity({kind,age}:{kind:GameKind;age:PreschoolAge}){
 const [step,setStep]=useState(0);
 const [round,setRound]=useState(0);
 const [deck,setDeck]=useState(()=>Array.from({length:32},(_,i)=>i).sort(()=>Math.random()-.5));
 const [,setSelected]=useState("");
 const [message,setMessage]=useState("");
 const choices=age===0?2:age===1?3:4;
 const solved=kind==="garden"?step===4:step>= (age===0?2:3);
 const targetColor=PALETTE[deck[step+round*3]%choices];
 const targetShape=SHAPES[deck[step+round*2]%SHAPES.length];
 const countGoal=2+(deck[step+round*4]%(age+3));
 const feelings=FEELINGS[deck[step+round*3]%FEELINGS.length];
 const pattern=step%2===0?["🔴","🔵","🔴","🔵"]:["⭐","🌿","🌿","⭐","🌿","🌿"];
 const expected=deck[step+round]%2===0?"🔴":"⭐";
 const reset=()=>{setRound(v=>v+1);setDeck(Array.from({length:32},(_,i)=>i).sort(()=>Math.random()-.5));setStep(0);setSelected("");setMessage("");};
 const succeed=()=>{setMessage("Το ανακάλυψες! ✨");setSelected("");setStep(v=>v+1);};
 const tryChoice=(right:boolean)=>{if(right)succeed();else setMessage("Ας δοκιμάσουμε ξανά. Κοίτα προσεκτικά!");};
 const titles:Record<GameKind,string>={colors:"Τα χρώματα της φύσης",shapes:"Τα σχήματα στον κήπο",pattern:"Το μυστικό μοτίβο",count:"Μετράω τα μήλα",feelings:"Μαθαίνω τα συναισθήματα",garden:"Ο Σπορούλης μεγαλώνει"};
 const prompt= kind==="colors"?`Βρες το ${targetColor.name}!`:kind==="shapes"?`Βρες το ${targetShape.name}!`:kind==="pattern"?"Τι έρχεται μετά στο μοτίβο;":kind==="count"?`Πόσα μήλα βλέπεις;`:kind==="feelings"?feelings.question:"Τι χρειάζεται ο Σπορούλης τώρα;";
 return <div className="ps-game-stage"><div className="ps-game-meta"><span>ΠΑΙΧΝΙΔΙ ΕΞΕΡΕΥΝΗΣΗΣ</span><button onClick={reset}><RotateCcw size={17}/> Από την αρχή</button></div>
   <h3>{titles[kind]}</h3>
   {solved ? <div className="ps-win" role="status"><span aria-hidden="true">🌟 🐻 🌟</span><h4>Τα κατάφερες με τον δικό σου τρόπο!</h4><p>Ποιο μέρος θέλεις να δοκιμάσεις ξανά ή να φτιάξεις με αληθινά υλικά;</p><button className="ps-primary" onClick={reset}><RotateCcw/> Παίζω ξανά</button></div> : <>
   <div className="ps-game-request"><p>{prompt}</p><TextToSpeech text={prompt}/></div>
   {kind==="colors"&&<div className="ps-choices">{PALETTE.slice(0,choices).map(c=><button key={c.name} className="ps-color-choice" aria-label={c.name} onClick={()=>tryChoice(c.name===targetColor.name)} style={{background:c.color}}><span>{c.emoji}</span><b>{c.name}</b></button>)}</div>}
   {kind==="shapes"&&<div className="ps-choices">{SHAPES.slice(0,age===0?2:3).map(c=><button key={c.name} className="ps-shape-choice" onClick={()=>tryChoice(c.name===targetShape.name)}><span aria-hidden="true">{c.icon}</span><b>{c.name}</b></button>)}</div>}
   {kind==="pattern"&&<><div className="ps-pattern-line" aria-label="Μοτίβο">{pattern.map((v,i)=><span key={i}>{v}</span>)}<span className="ps-questionmark">?</span></div><div className="ps-choices">{(age<3?["🔴","🔵","⭐"]:["⭐","🔴","🌿"]).map(v=><button key={v} className="ps-choice-square" onClick={()=>tryChoice(v===expected)}>{v}</button>)}</div></>}
   {kind==="count"&&<><div className="ps-apples" aria-label={`${countGoal} μήλα`}>{Array.from({length:countGoal},(_,i)=><span key={i}>🍎</span>)}</div><div className="ps-choices">{[countGoal-1,countGoal,countGoal+1].map(n=><button key={n} className="ps-choice-square" onClick={()=>tryChoice(n===countGoal)}>{n}</button>)}</div></>}
   {kind==="feelings"&&<><div className="ps-friend-face" aria-hidden="true">🐻</div><div className="ps-choices">{FEELINGS.map((f,i)=><button key={f.name} className="ps-emotion-choice" onClick={()=>tryChoice(i===feelings.correct)}><span>{f.face}</span><b>{f.name}</b></button>)}</div></>}
   {kind==="garden"&&<div className="ps-garden-game"><div className="ps-garden-visual" aria-label={["Άδειο γλαστράκι","Ο σπόρος μέσα στο χώμα","Υγρό χώμα","Ο ήλιος ζεσταίνει το σπόρο"][step]}><span className="ps-sun">☀️</span><span className="ps-garden-top">{["🪴","🌰","💧","🌱"][step]}</span><div className="ps-pot">🪴</div></div><div className="ps-garden-actions">{["Βάζω τον σπόρο 🌰","Ποτίζω λίγο 💧","Βρίσκω το φως ☀️","Παρατηρώ το βλαστάρι 🌱"].map((label,i)=><button key={label} disabled={i!==step} aria-current={i===step?"step":undefined} onClick={()=>{setStep(v=>v+1);setMessage("Η φροντίδα βοηθά το φυτό να μεγαλώσει!");}}>{i<step?<CheckCircle2/>:<Sprout/>}{label}</button>)}</div></div>}
   <p className="ps-gentle-feedback" role="status" aria-live="polite">{message||"Μπορείς να δοκιμάσεις όσες φορές θέλεις."}</p>
   <div className="ps-progress-dots" aria-label="Πρόοδος δραστηριότητας">{Array.from({length:kind==="garden"?4:age===0?2:3},(_,i)=><span key={i} className={i<step?"finished":""}/>)}</div>
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
const MENU: {id:Area;label:string;icon:typeof Home}[] = [
 {id:"home",label:"Αρχική",icon:Home},
 {id:"games",label:"Παιχνίδια",icon:Puzzle},
 {id:"crafts",label:"Κατασκευές",icon:Scissors},
 {id:"drawing",label:"Ζωγραφική",icon:Palette},
 {id:"stories",label:"Ιστορίες",icon:BookOpen},
 {id:"village",label:"16 κόσμοι",icon:Compass}
];
function JourneyHome({age,go}:{age:PreschoolAge;go:(a:Area)=>void}){
 const cards=[
  {id:"games" as Area,title:"Το δάσος των παιχνιδιών",description:"Χρώματα, σχήματα, μοτίβα και μικρές ανακαλύψεις.",eyebrow:"ΠΑΙΖΩ",icon:Puzzle,tone:"mint"},
  {id:"crafts" as Area,title:"Το εργαστήρι του Πισιπούκ",description:"Μεγάλα πατρόν, εικόνες και βήματα με τα χέρια.",eyebrow:"ΚΑΤΑΣΚΕΥΑΖΩ",icon:Scissors,tone:"peach"},
  {id:"drawing" as Area,title:"Το πολύχρωμο ατελιέ",description:"Ζωγραφίζω με το δάχτυλο και κρατάω την εικόνα μου.",eyebrow:"ΖΩΓΡΑΦΙΖΩ",icon:Palette,tone:"lavender"},
  {id:"stories" as Area,title:"Η φωλιά των ιστοριών",description:"Ακούω, παρατηρώ, φαντάζομαι και αφηγούμαι.",eyebrow:"ΑΚΟΥΩ",icon:BookOpen,tone:"sun"},
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
  {area==="home"&&<JourneyHome age={age} go={changeArea}/>}
  {area==="games"&&<GameRoom key={age} age={age}/>}
  {area==="crafts"&&<PremiumAtelier age={age}/>}
  {area==="drawing"&&<section className="ps-section"><div className="ps-section-title"><span className="ps-eyebrow">ΤΟ ΠΟΛΥΧΡΩΜΟ ΑΤΕΛΙΕ</span><h2>Το χαρτί είναι δικό σου! 🎨</h2><p>Ζωγράφισε ελεύθερα. Κάθε ιδέα είναι μοναδική!</p></div><Drawing saveData={setDrawingData}/><p className="ps-adult-hint">Ένας ενήλικος μπορεί να αποθηκεύσει ή να εκτυπώσει το έργο. {drawingData?"Η δημιουργία σου είναι έτοιμη!":""}</p></section>}
  {area==="stories"&&<section className="ps-section"><div className="ps-section-title"><span className="ps-eyebrow">Ο ΚΟΣΜΟΣ ΤΩΝ ΠΑΡΑΜΥΘΙΩΝ</span><h2>Άκου και φαντάσου 📖</h2><p>Παραμύθια στα ελληνικά με εικόνες και ερωτήσεις για συζήτηση.</p></div><StoryBook age={age} onComplete={()=>{}}/></section>}
  </main>
  <footer className="ps-footer"><span>🐻 Παίζω • Ανακαλύπτω • Δημιουργώ</span><a href="/">Πίσω στον παιδικό σταθμό Πισιπούκ</a><small>Μαθαίνουμε μαζί με έναν ενήλικο • Χωρίς δημόσιους πίνακες κατάταξης</small></footer>
  {caregiver&&<div className="ps-modal-scrim" onMouseDown={e=>{if(e.target===e.currentTarget)setCaregiver(false);}}><section role="dialog" aria-modal="true" aria-labelledby="ps-adult-heading" className="ps-grownup-dialog"><button className="ps-close" onClick={()=>setCaregiver(false)} aria-label="Κλείσιμο"><X/></button><span className="ps-eyebrow">ΓΟΝΕΙΣ ΚΑΙ ΠΑΙΔΑΓΩΓΟΙ</span><h2 id="ps-adult-heading">Εμπειρίες με νόημα, όχι περισσότερη οθόνη.</h2><p>Επιλέξτε ηλικία σύμφωνα με τις δυνατότητες και τα ενδιαφέροντα του παιδιού. Οι χρόνοι είναι ενδεικτικοί. Τα μικρότερα παιδιά χρειάζονται συνεχή συν-παρουσία ενηλίκου.</p><div className="ps-adult-facts"><p><b>NAEYC:</b> παιχνίδι, ανάπτυξη με βάση τις δυνατότητες του κάθε παιδιού.</p><p><b>HighScope:</b> σχεδιάζω, δημιουργώ, συζητώ τι έγινε.</p><p><b>Montessori / Reggio Emilia:</b> αυτενέργεια, επιλογές, υλικά και διερευνητική δημιουργία.</p></div><p><b>Ασφάλεια:</b> Τα πατρόν και η κοπή απαιτούν επίβλεψη. Δεν αποθηκεύουμε ονόματα, βαθμούς ή φωτογραφίες παιδιών σε εξυπηρετητή.</p><button className="ps-primary" onClick={()=>setCaregiver(false)}><Heart/> Κατάλαβα</button></section></div>}
 </div>;
}
