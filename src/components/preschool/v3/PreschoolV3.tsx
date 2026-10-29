import {useEffect,useState} from "react";
import {ArrowLeft,BookOpen,Brush,Compass,Heart,Home,Lightbulb,Music2,Scissors,Volume2,VolumeX,Leaf,Puzzle,ShieldCheck} from "lucide-react";
import {StoryBook} from "../world/Stories";
import {V3Atelier} from "./V3Atelier";
import {V3GameWorld} from "./V3GameWorld";
import {speak} from "../world/Game";
import "../world/world.css";
import "./v3.css";
type Age=0|1|2|3;
type Scene="map"|"atelier"|"stories"|"games"|"garden"|"music"|"makers"|"parents";
const AGE_LABELS=["2–3","3–4","4–5","5–6"] as const;
const HOTSPOTS=[
 {id:"atelier" as Scene,name:"Ατελιέ",x:14,y:45,icon:Brush,tag:"Ζωγραφίζω",tone:"pink"},
 {id:"stories" as Scene,name:"Ιστορίες",x:33,y:24,icon:BookOpen,tag:"Ακούω",tone:"purple"},
 {id:"atelier" as Scene,name:"Κατασκευές",x:48,y:51,icon:Scissors,tag:"Φτιάχνω",tone:"orange"},
 {id:"garden" as Scene,name:"Κήπος",x:17,y:71,icon:Leaf,tag:"Ανακαλύπτω",tone:"green"},
 {id:"music" as Scene,name:"Μουσική",x:76,y:49,icon:Music2,tag:"Παίζω ρυθμούς",tone:"yellow"},
 {id:"makers" as Scene,name:"Εφευρέτες",x:89,y:20,icon:Lightbulb,tag:"Σκέφτομαι",tone:"blue"}
];
export function PreschoolV3(){
 const [age,setAge]=useState<Age>(1),[scene,setScene]=useState<Scene>("map"),[audio,setAudio]=useState(true),[adult,setAdult]=useState(false);
 function navigate(next:Scene){if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel();setScene(next);}
 const back=()=>navigate("map");
 useEffect(()=>{if(scene==="map"&&audio){ /* Spoken prompts start only with a user gesture. */ }},[scene,audio]);
 const pageTitle=scene==="atelier"?"Το ατελιέ του Πισιπούκ":scene==="stories"?"Οι ιστορίες του χωριού":scene==="games"?"Ο κήπος των παιχνιδιών":"Ο ζωντανός κόσμος του Πισιπούκ";
 return <div className="p3-app">
  <a className="p3-skip" href="#p3-main">Πήγαινε στο παιχνίδι</a>
  <header className="p3-navbar">
   <button className="p3-logo" aria-label="Πίσω στο χωριό του Πισιπούκ" onClick={back}><img src="/preschool-world/bear.webp" alt=""/><span><strong>ΠΙΣΙΠΟΥΚ</strong><small>Το μαγικό μας χωριό</small></span></button>
   <div className="p3-age-options" role="group" aria-label="Ηλικία παιδιού">{AGE_LABELS.map((label,i)=><button key={label} aria-pressed={age===i} onClick={()=>{setAge(i as Age);if(audio)speak("Μια καινούρια περιπέτεια για "+label+" ετών!")}}><span>{label}</span><small>ετών</small></button>)}</div>
   <div className="p3-nav-actions"><button aria-label={audio?"Κλείσιμο φωνής":"Ενεργοποίηση φωνής"} onClick={()=>{setAudio(v=>!v);if("speechSynthesis" in window)window.speechSynthesis.cancel()}}>{audio?<Volume2/>:<VolumeX/>}</button><button aria-label="Για γονείς και παιδαγωγούς" onClick={()=>setAdult(true)}><ShieldCheck/></button></div>
  </header>
  <main id="p3-main" className="p3-main">
   {scene==="map"?<>
    <section className="p3-world-intro"><span className="p3-eyebrow">ΕΛΑ ΝΑ ΠΑΙΞΟΥΜΕ ΜΑΖΙ!</span><h1>Το χωριό μας <em>ζωντανεύει!</em></h1><p>Διάλεξε ένα σπιτάκι και μπες στην περιπέτεια.</p></section>
    <section className="p3-village" aria-label="Διαδραστικός εικονογραφημένος χάρτης του Πισιπούκ">
     <picture className="p3-world-art"><source media="(max-width:680px)" srcSet="/preschool-world/village-mobile.webp"/><img src="/preschool-world/village.webp" fetchPriority="high" alt="Εικονογραφημένο χωριό με ατελιέ, βιβλιοθήκη, εργαστήρι κατασκευών, κήπο, μουσικό περίπτερο και παρατηρητήριο"/></picture>
     <div className="p3-village-sun" aria-hidden="true"/><div className="p3-floating-cloud p3-cloud-one" aria-hidden="true"/><div className="p3-floating-cloud p3-cloud-two" aria-hidden="true"/><div className="p3-butterfly p3-butterfly-one" aria-hidden="true"><svg viewBox="0 0 60 45"><path d="M30 25 Q1 -10 2 14Q-2 42 30 29Q62 42 58 14Q59 -10 30 25Z" fill="#ffb5da" stroke="#fff" strokeWidth="3"/><path d="M30 20v17" stroke="#93689c" strokeWidth="3"/></svg></div>
     {HOTSPOTS.map((h,i)=>{const Icon=h.icon;return <button key={h.name} className={`p3-map-hotspot p3-map-${h.tone}`} style={{left:h.x+"%",top:h.y+"%",animationDelay:(i*.26)+"s"}} onClick={()=>{if(audio)speak("Πάμε στο "+h.name+"!");navigate(h.id)}} aria-label={h.name}><span className="p3-hotspot-symbol"><Icon size={30}/></span><span className="p3-hotspot-tag"><b>{h.name}</b><small>{h.tag}</small></span></button>})}
     <div className="p3-map-caption"><span>✦</span> Άγγιξε το μέρος που σου αρέσει! <span>✦</span></div>
    </section>
    <div className="p3-mobile-hotspots" aria-label="Μέρη του χωριού">{HOTSPOTS.map(h=><button key={h.name} onClick={()=>navigate(h.id)}><h.icon size={22}/><span>{h.name}</span></button>)}</div>
    <div className="p3-discovery-strip"><div className="p3-discovery-copy"><span>✨ ΜΙΑ ΚΑΙΝΟΥΡΙΑ ΠΕΡΙΠΕΤΕΙΑ</span><b>Παίξε με τα χρώματα, τα ζώα και τους ήχους!</b></div><button className="p3-main-button" onClick={()=>navigate("games")}><Puzzle/> Πάμε για παιχνίδι!</button></div>
   </>:null}
   {scene==="atelier"&&<V3Atelier age={age} onBack={back}/>}
   {scene==="stories"&&<div className="p3-story-room"><div className="p3-room-top"><button className="p3-back" onClick={back}><ArrowLeft/> Στο χωριό</button><div className="p3-room-title"><small>ΤΟ ΣΠΙΤΙ ΤΩΝ ΙΣΤΟΡΙΩΝ</small><h2>Μια ιστορία γεμάτη φαντασία!</h2></div></div><div className="pw-app"><StoryBook age={age} onComplete={()=>{}}/></div></div>}
   {(scene==="games"||scene==="garden"||scene==="music"||scene==="makers")&&<V3GameWorld key={scene+"-"+age} age={age} initial={scene==="garden"?"garden":scene==="music"?"music":scene==="makers"?"shapes":undefined} onBack={back}/>}
  </main>
  <footer className="p3-foot"><span><Heart size={17}/> Μαθαίνουμε παίζοντας, μαζί με έναν μεγάλο.</span><a href="/">Πίσω στον παιδικό σταθμό Πισιπούκ</a></footer>
  {adult&&<div className="p3-dialog-bg" onMouseDown={e=>{if(e.currentTarget===e.target)setAdult(false)}}><section className="p3-adult-dialog" role="dialog" aria-modal="true" aria-labelledby="p3-parent-title"><button className="p3-dialog-close" onClick={()=>setAdult(false)} aria-label="Κλείσιμο">×</button><span>ΓΙΑ ΤΟΥΣ ΜΕΓΑΛΟΥΣ</span><h2 id="p3-parent-title">Μαθαίνω με τα χέρια και την καρδιά μου</h2><p>Επιλέξτε ηλικιακή ομάδα ανάλογα με το παιδί. Το παιχνίδι είναι πρόσκληση για εξερεύνηση, όχι τεστ. Για τα μικρότερα παιδιά προτείνεται συνεχής συν-παρουσία ενηλίκου.</p><p>Μετά το παιχνίδι: συζητήστε τι παρατήρησε το παιδί, φτιάξτε πραγματικά αντικείμενα, ζωγραφίστε και παίξτε έξω.</p><p><b>Ασφάλεια:</b> Ψαλίδι και μικρά υλικά χρησιμοποιούνται μόνο από ή με ενήλικο. Τα έργα παραμένουν στη συσκευή, χωρίς λογαριασμό παιδιού.</p><button className="p3-main-button" onClick={()=>setAdult(false)}>Πίσω στο παιχνίδι</button></section></div>}
 </div>;
}
