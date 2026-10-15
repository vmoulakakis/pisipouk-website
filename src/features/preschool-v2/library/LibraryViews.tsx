import { useMemo, useState, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, ChevronLeft, ChevronRight, Download, Palette, Printer, RotateCcw, Volume2 } from "lucide-react";
import { CRAFTS, PATTERNS, PALETTE, artwork, artworkDataUrl } from "./studioContent";
import { printableSvg, saveSvg, printTemplate } from "./PatternStudio";
import { STORIES } from "./story-data";
import {monthlyPack,monthlyRotation} from "../games/curriculum";
import "./library.css";

const NAME=["2–3","3–4","4–5","5–6"];
function MonthlyStrip({type}:{type:string}){const m=monthlyPack();return <div className="pw2-monthly-strip" style={{background:m.color}}><span>{m.icon} <b>{m.name} {m.key.slice(0,4)}</b> · {m.theme}</span><small>Μηνιαία επιμέλεια {type}: αλλάζουν η σειρά και οι προτεινόμενες δραστηριότητες· διατηρούνται όλα τα παλαιότερα σχέδια. Δεν παράγονται αυτόματα νέα αρχεία χωρίς έλεγχο.</small></div>}

const AGE_ORIG="/pisipouk-v2-staging/ages/";
type Props={age:number;ageKey:string};
function Help({message}:{message:string}){return <p className="pw2-library-note">{message}</p>}
function Header({eyebrow,title,subtitle}:{eyebrow:string,title:string,subtitle:string}){return <header className="pw2-library-header"><span className="pw2-overline">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></header>}
export function PatternLibrary({age,ageKey}:Props){
 const [chosen,setChosen]=useState(()=>monthlyRotation(PATTERNS,new Date(),age)[0].id),[color,setColor]=useState(PALETTE[0]),[nonce,setNonce]=useState(0),[showGuide,setShowGuide]=useState(true);
 const [search,setSearch]=useState("");
 if(age<0||age>3)return null;
 const selected=PATTERNS.find(p=>p.id===chosen)||PATTERNS[0];
 const preview=artwork(selected,age,false);
 const gallery=monthlyRotation(PATTERNS,new Date(),age).filter(p=>p.title.toLocaleLowerCase("el").includes(search.toLocaleLowerCase("el")));
 const onPaint=(e:MouseEvent<HTMLDivElement>)=>{
  const el=e.target as Element;
  const s=el.closest?.(".a,.b,.c,.d") as SVGElement|null;
  if(s){s.style.fill=color;s.style.transition="fill .15s";}
 };
 const svgPrintable=()=>printableSvg(selected.title,preview);
 return <div className="pw2-library">
  <Header eyebrow={"20 ΠΡΩΤΟΤΥΠΑ ΣΧΕΔΙΑ · "+NAME[age]+" ΕΤΩΝ"} title="Το Μαγικό Ατελιέ" subtitle="Διάλεξε σχέδιο, χρωμάτισε στην οθόνη ή τύπωσε το περίγραμμα σε A4. Για ηλικίες 2–3 τα περιγράμματα είναι μεγαλύτερα και πιο χοντρά."/>
  <MonthlyStrip type="ζωγραφικής"/><div className="pw2-library-bar"><label htmlFor="pw2-pattern-search">Βρες σχέδιο:</label><input id="pw2-pattern-search" type="search" placeholder="Λουλούδι, Πισιπούκ, ζωάκι…" value={search} onChange={e=>setSearch(e.target.value)}/><span>{gallery.length} / {PATTERNS.length}</span></div>
  <div className="pw2-pattern-gallery">{gallery.map(p=><button type="button" key={p.id} className={chosen===p.id?"selected":""} aria-pressed={chosen===p.id} onClick={()=>{setChosen(p.id);setNonce(n=>n+1)}}><img loading="lazy" src={artworkDataUrl(p,age,true)} alt=""/><span>{p.title}</span></button>)}</div>
  <div className="pw2-paint-layout"><div className="pw2-library-editor"><h2>{selected.title}</h2><div className="pw2-library-palette" aria-label="Επιλογή χρώματος">{PALETTE.map(c=><button type="button" key={c} aria-label={"Χρώμα "+c} aria-pressed={color===c} onClick={()=>setColor(c)} style={{backgroundColor:c}}/>)}</div>
  <div key={selected.id+"-"+nonce} className="pw2-pattern-live" role="group" aria-label="Άγγιξε ένα μέρος του σχεδίου για να το χρωματίσεις" onClick={onPaint} dangerouslySetInnerHTML={{__html:preview}}/>
  <div className="pw2-library-actions"><button type="button" className="pw2-outline" onClick={()=>setNonce(n=>n+1)}><RotateCcw size={18}/> Καθαρό σχέδιο</button><button className="pw2-main-button" type="button" onClick={()=>saveSvg(svgPrintable(),"pisipouk-"+selected.id+"-a4.svg")}><Download size={18}/> Α4 SVG</button><button className="pw2-outline" type="button" onClick={()=>printTemplate(selected.title,preview)}><Printer size={18}/> PDF / Εκτύπωση</button></div></div>
  <div className="pw2-pattern-guide"><h2>Έμπνευση & χρώματα</h2><button type="button" onClick={()=>setShowGuide(v=>!v)} aria-pressed={showGuide}>{showGuide?"Κρύψε":"Δείξε"} το παράδειγμα</button>{showGuide&&<img src={artworkDataUrl(selected,age,true)} alt={"Πολύχρωμο παράδειγμα: "+selected.title}/>}<p>Η ζωγραφιά του παιδιού μπορεί να έχει οποιοδήποτε χρώμα. Δεν υπάρχει σωστό και λάθος!</p><Link to={AGE_ORIG+ageKey} className="pw2-text-link">Ο κόσμος μου <ArrowLeft size={17}/></Link></div></div>
 <Help message="Το περιεχόμενο βασίζεται σε 20 πρωτότυπα διανυσματικά σχέδια του ξεχωριστού playpacks branch. Είναι 20 σχέδια με ηλικιακά διαφοροποιημένη γραμμή, όχι 80 διαφορετικές εικονογραφήσεις. Χρειάζονται τελικό εικαστικό και παιδαγωγικό QA."/>
 </div>;
}
export function CraftLibrary({age,ageKey}:Props){
 const [chosen,setChosen]=useState(()=>monthlyRotation(CRAFTS,new Date(),age)[0].id),[step,setStep]=useState(0);
 if(age<0||age>3)return null;
 const item=CRAFTS.find(c=>c.id===chosen)||CRAFTS[0],art=PATTERNS.find(p=>p.id===item.pattern)||PATTERNS[0];
 const outline=artwork(art,age,false);
 return <div className="pw2-library"><Header eyebrow={"20 ΚΑΤΑΣΚΕΥΕΣ · "+NAME[age]+" ΕΤΩΝ"} title="Εργαστήρι δημιουργίας" subtitle="Διάλεξε κατασκευή, δες τα υλικά, ακολούθησε τέσσερα βήματα και τύπωσε πρωτότυπο πατρόν. Όλες οι κατασκευές γίνονται με επίβλεψη ενηλίκου."/>
 <MonthlyStrip type="κατασκευών"/><div className="pw2-pattern-gallery">{monthlyRotation(CRAFTS,new Date(),age).map(c=>{const p=PATTERNS.find(x=>x.id===c.pattern)||PATTERNS[0];return <button type="button" aria-pressed={chosen===c.id} className={chosen===c.id?"selected":""} key={c.id} onClick={()=>{setChosen(c.id);setStep(0)}}><img src={artworkDataUrl(p,age,true)} loading="lazy" alt=""/><span>{c.title}</span></button>})}</div>
 <div className="pw2-craft-expanded"><div className="pw2-craft-art"><img src={artworkDataUrl(art,age,true)} alt={"Ενδεικτική εικονογράφηση της κατασκευής "+item.title}/><p>Εικονογραφημένο θέμα, όχι φωτογραφία πραγματικού τελικού αποτελέσματος.</p></div>
 <div className="pw2-craft-how"><span className="pw2-overline">{item.minutes} ΛΕΠΤΑ · ΜΕ ΕΝΗΛΙΚΟ</span><h2>{item.title}</h2><p><strong>Υλικά:</strong> {item.materials}</p><p className="pw2-step-indicator">Βήμα {step+1} από {item.steps.length}</p><div className="pw2-step-hero"><span>{["🖍️","✂️","🧩","🌟"][step]}</span><strong>{item.steps[step]}</strong></div>
 <div className="pw2-library-actions"><button type="button" className="pw2-outline" disabled={step===0} onClick={()=>setStep(n=>Math.max(0,n-1))}><ChevronLeft/> Προηγούμενο</button><button type="button" className="pw2-main-button" onClick={()=>setStep(n=>(n+1)%item.steps.length)}>{step===3?"Από την αρχή":"Επόμενο"}<ChevronRight/></button></div>
 <div className="pw2-library-actions"><button type="button" className="pw2-outline" onClick={()=>saveSvg(printableSvg(item.title,outline),"pisipouk-"+item.id+"-patron-a4.svg")}><Download size={19}/> Α4 πατρόν</button><button type="button" className="pw2-outline" onClick={()=>printTemplate(item.title,outline)}><Printer size={19}/> Εκτύπωση / PDF</button></div>
 <p className="pw2-craft-warning">⚠️ Ο ενήλικος χειρίζεται ψαλίδι, μικρά εξαρτήματα ή σύνδεσμους. Για παιδιά 2–3 χρησιμοποιούμε μεγάλα προκομμένα κομμάτια και μη τοξικά υλικά.</p></div></div>
 <Help message="Οι 20 κατασκευές ανακτήθηκαν από το παλιότερο playpacks branch. Τα τέσσερα βήματα είναι πραγματικές οδηγίες κειμένου, αλλά ΔΕΝ διαθέτουν ακόμη τέσσερις ανεξάρτητες επαγγελματικές εικονογραφήσεις. Χρειάζεται ηλικιακή αξιολόγηση και επιβεβαίωση ασφαλών υλικών."/>
 </div>;
}
export function StoryLibrary({age,ageKey}:Props){
 const [chosen,setChosen]=useState(()=>STORIES.indexOf(monthlyRotation(STORIES,new Date(),age)[0])),[page,setPage]=useState(0),[ending,setEnding]=useState<number|null>(null);
 const story=STORIES[chosen]||STORIES[0];
 const text=page<story.pages.length?story.pages[page]:ending!==null?story.endings[ending]:story.question;
 const picture=PATTERNS[chosen%PATTERNS.length]||PATTERNS[0];
 const speak=()=>{if(typeof window==="undefined"||!("speechSynthesis" in window))return;const voice=window.speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith("el"));if(!voice)return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="el-GR";u.voice=voice;u.rate=.85;window.speechSynthesis.speak(u);};
 const reset=(index:number)=>{setChosen(index);setPage(0);setEnding(null)};
 if(age<0||age>3)return null;
 return <div className="pw2-library"><Header eyebrow="20 ΠΡΩΤΟΤΥΠΑ ΕΛΛΗΝΙΚΑ ΠΑΡΑΜΥΘΙΑ" title="Η Δεντροβιβλιοθήκη" subtitle="20 ιστορίες με εικονογραφημένη προεπισκόπηση, σελίδες, επιλογές και διαφορετικό τέλος. Με ελληνική φωνή όταν τη διαθέτει η συσκευή."/>
 <MonthlyStrip type="παραμυθιών"/><div className="pw2-pattern-gallery">{monthlyRotation(STORIES,new Date(),age).map((st)=><button type="button" key={st.title} className={STORIES.indexOf(st)===chosen?"selected":""} aria-pressed={STORIES.indexOf(st)===chosen} onClick={()=>reset(STORIES.indexOf(st))}><img loading="lazy" src={artworkDataUrl(PATTERNS[i%PATTERNS.length],age,true)} alt=""/><span>{st.title}</span></button>)}</div>
 <div className="pw2-story-book"><div className="pw2-story-illustration"><img src={artworkDataUrl(picture,age,true)} alt={"Ενδεικτικό εικαστικό: "+picture.title}/><span className="pw2-overline">Ο ΠΙΣΙΠΟΥΚ ΔΙΑΒΑΖΕΙ</span></div><div className="pw2-story-reader"><span className="pw2-overline">ΙΣΤΟΡΙΑ {chosen+1}/20 · ΣΕΛΙΔΑ {Math.min(page+1,story.pages.length)} / {story.pages.length}</span><h2>{story.title}</h2><p>{text}</p><div className="pw2-library-actions"><button type="button" className="pw2-outline" onClick={speak}><Volume2/> Άκουσέ το</button></div>
 {page>=story.pages.length&&ending===null&&<div className="pw2-story-choices" role="group" aria-label={story.question}>{story.choices.map((c,i)=><button type="button" key={c} className="pw2-main-button" onClick={()=>setEnding(i)}>{c}</button>)}</div>}
 <div className="pw2-library-actions"><button type="button" className="pw2-outline" disabled={page===0&&ending===null} onClick={()=>{if(ending!==null)setEnding(null);else setPage(n=>Math.max(0,n-1))}}><ChevronLeft/> Πίσω</button><button type="button" className="pw2-main-button" onClick={()=>{if(ending!==null||page>=story.pages.length)reset(chosen);else setPage(n=>n+1)}}>{ending!==null?"Ξανά η ιστορία":page>=story.pages.length?"Από την αρχή":"Επόμενη σελίδα"}<ChevronRight/></button></div></div></div>
 <Help message="Πρόκειται για 20 πραγματικά κείμενα από το ξεχωριστό branch, κοινά σε όλες τις ηλικίες προς το παρόν. Η τελική βιβλιοθήκη χρειάζεται διαφορετική γλωσσική προσαρμογή ανά ηλικία, εξατομικευμένα HD καρέ για κάθε ιστορία και επαγγελματική ελληνική αφήγηση."/>
 </div>;
}
