import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Brush, Compass, Gamepad2, Heart, Home, Leaf, Menu, Music2, Shapes, Sparkles, Volume2, X } from "lucide-react";
import { PisipoukCharacter } from "./v15/PisipoukCharacter";
import { V15_GAMES, V15GamePlayer, type V15Game, type V15Age } from "./v15/Games";
import { Atelier, Stories, Today, Worlds } from "./v15/Experiences";
import "./preschool-v17.css";
import { DiscoveryGames } from "./DiscoveryGames";
import { CinematicForest3D } from "./CinematicForest3D";
import { ForestQuestV17 } from "./ForestQuestV17";
import { Atelier360 } from "./Atelier360";
import { WorldActivities } from "./WorldActivities";
import { AnimatedArcade } from "./AnimatedArcade";
import { LivingGarden } from "./LivingGarden";
import { BuildPlayground } from "./BuildPlayground";
import forestImage from "@/assets/pisipouk-exterior.webp";
import atelierImage from "@/assets/pisipouk-classroom.webp";
import storyImage from "@/assets/pisipouk-story.webp";
import arrivalImage from "@/assets/pisipouk-arrival.webp";

type Zone = "home" | "games" | "atelier" | "nature" | "stories" | "music" | "discovery" | "greece" | "today" | "parents";
const ages: { id: V15Age; label: string; discovery: string }[] = [
  { id: "2-3", label: "2–3", discovery: "Αγγίζω και ανακαλύπτω" },
  { id: "3-4", label: "3–4", discovery: "Παρατηρώ και δοκιμάζω" },
  { id: "4-5", label: "4–5", discovery: "Δημιουργώ και αφηγούμαι" },
  { id: "5-6", label: "5–6", discovery: "Σκέφτομαι και εξερευνώ" },
];
const worlds: { id: Zone; title: string; subtitle: string; emoji: string; image: string; tone: string; accessible: string }[] = [
  { id: "nature", title: "Το μαγικό δάσος", subtitle: "Φύση, εποχές και μικρές ανακαλύψεις", emoji: "🍃", image: forestImage, tone: "forest", accessible: "Εξερεύνησε τον κόσμο της φύσης" },
  { id: "atelier", title: "Το ατελιέ των χρωμάτων", subtitle: "Ζωγραφίζω ελεύθερα, δίχως σωστό ή λάθος", emoji: "🎨", image: atelierImage, tone: "peach", accessible: "Άνοιξε το ατελιέ ζωγραφικής" },
  { id: "stories", title: "Η παραμυθοχώρα", subtitle: "Εικόνες, ιστορίες και φαντασία", emoji: "📖", image: storyImage, tone: "lilac", accessible: "Άκου και εξερεύνησε ιστορίες" },
  { id: "music", title: "Η μουσική πολιτεία", subtitle: "Ρυθμός, κίνηση και δικοί σου ήχοι", emoji: "🎵", image: arrivalImage, tone: "yellow", accessible: "Παίξε μουσικά παιχνίδια" },
  { id: "discovery", title: "Το εργαστήριο ανακαλύψεων", subtitle: "Σχήματα, μοτίβα και μικρά προβλήματα", emoji: "🧩", image: atelierImage, tone: "sky", accessible: "Παίξε παιχνίδια εξερεύνησης" },
  { id: "greece", title: "Η μικρή μας Ελλάδα", subtitle: "Εποχές, τόποι και παραδόσεις", emoji: "☀️", image: forestImage, tone: "blue", accessible: "Εξερεύνησε την Ελλάδα" },
];
const ageToPhrase: Record<V15Age,string> = { "2-3":"Πάτησε, άκου και δοκίμασε.", "3-4":"Διάλεξε και φτιάξε κάτι δικό σου.", "4-5":"Συνδύασε εικόνες, ήχους και ιδέες.", "5-6":"Κάνε προβλέψεις και βρες νέους τρόπους." };
const navigation: {id: Zone; label: string; icon: typeof Home}[] = [
  {id:"home",label:"Αρχική",icon:Home},{id:"games",label:"Παιχνίδια",icon:Gamepad2},{id:"atelier",label:"Atelier",icon:Brush},{id:"stories",label:"Ιστορίες",icon:BookOpen},{id:"today",label:"Σήμερα",icon:Sparkles},
];
export function PreschoolV17() {
  const [zone,setZone] = useState<Zone>("home");
  const [age,setAge] = useState<V15Age>("3-4");
  const [game,setGame] = useState<V15Game|null>(null);
  const [menu,setMenu] = useState(false);
  const games = useMemo(()=>V15_GAMES.filter(g=>g.ages.includes(age)),[age]);
  const open = (next:Zone)=>{setZone(next);setMenu(false);window.scrollTo({top:0,behavior:"smooth"});};
  const playWorld = (target:Zone)=>{
    open(target);
  };
  const current=worlds.find(w=>w.id===zone);
  return <div className="pw17">
    <header className="pw17-header">
      <button className="pw17-brand" onClick={()=>open("home")} aria-label="Πίσω στην αρχική του Πισιπούκ">
        <img src={arrivalImage} alt="" /><span><strong>Ο κόσμος του Πισιπούκ</strong><small>Μια μικρή περιπέτεια κάθε μέρα</small></span>
      </button>
      <nav className="pw17-desktop-nav" aria-label="Κύρια πλοήγηση">
        {navigation.map(({id,label,icon:Icon})=><button key={id} className={zone===id?"active":""} onClick={()=>open(id)}><Icon size={18}/>{label}</button>)}
      </nav>
      <button className="pw17-parent-link" onClick={()=>open("parents")}><Heart size={17}/> Για γονείς</button>
      <button className="pw17-menu-toggle" onClick={()=>setMenu(!menu)} aria-label={menu?"Κλείσιμο μενού":"Άνοιγμα μενού"} aria-expanded={menu}>{menu?<X/>:<Menu/>}</button>
    </header>
    {menu&&<div className="pw17-mobile-menu">{[...navigation,{id:"parents" as Zone,label:"Για γονείς",icon:Heart}].map(({id,label,icon:Icon})=><button key={id} onClick={()=>open(id)}><Icon size={20}/>{label}</button>)}</div>}
    <main id="pw17-content" className="pw17-main">
      {zone==="home"&&<>
        <section className="pw17-hero" aria-labelledby="pw17-hero-heading">
          <div className="pw17-hero-illustration" aria-hidden="true"><CinematicForest3D/><span className="pw17-orbit pw17-orbit-one">✦</span><span className="pw17-orbit pw17-orbit-two">✿</span></div>
          <div className="pw17-hero-inner">
            <div className="pw17-copy"><span className="pw17-eyebrow"><Sparkles size={16}/> Καλώς ήρθες στον μαγικό μας κόσμο</span>
              <h1 id="pw17-hero-heading">Μικρά χεράκια.<br/><em>Μεγάλες ανακαλύψεις.</em></h1>
              <p>Ένας ζεστός κόσμος παιχνιδιού για παιδιά 2–6 ετών. Διάλεξε, πειραματίσου, δημιούργησε — πάντα με τον δικό σου ρυθμό.</p>
              <div className="pw17-hero-actions"><button className="pw17-button primary" onClick={()=>open("games")}><Gamepad2/> Πάμε να παίξουμε <ArrowRight/></button><button className="pw17-button light" onClick={()=>open("today")}><Leaf/> Η σημερινή ιδέα</button></div>
              <div className="pw17-soft-note"><Heart size={16}/> Χωρίς βαθμούς, διαφημίσεις ή αγχωτικό χρονόμετρο.</div>
            </div>
            <div className="pw17-hero-bear"><PisipoukCharacter mood="wave" speech="Πάμε μαζί;" /></div>
          </div>
        </section>
        <section className="pw17-age-section" aria-labelledby="pw17-age-heading"><div className="pw17-section-heading"><span className="pw17-overline">ΠΡΩΤΑ ΕΠΙΛΕΓΟΥΜΕ</span><h2 id="pw17-age-heading">Πόσο χρονών είσαι;</h2><p>Κάθε ηλικία έχει τις δικές της μικρές χαρές.</p></div>
          <div className="pw17-ages" role="group" aria-label="Επιλογή ηλικιακής ομάδας">{ages.map((a,i)=><button key={a.id} className={age===a.id?"selected":""} onClick={()=>setAge(a.id)} aria-pressed={age===a.id}><span className="pw17-age-icon">{["🧸","🌱","🌈","🚀"][i]}</span><strong>{a.label} <small>ετών</small></strong><span>{a.discovery}</span></button>)}</div>
        </section>
        <section className="pw17-worlds" aria-labelledby="pw17-worlds-heading"><div className="pw17-section-heading"><span className="pw17-overline">ΕΞΙ ΚΟΣΜΟΙ, ΑΠΕΙΡΕΣ ΙΔΕΕΣ</span><h2 id="pw17-worlds-heading">Πού θα ταξιδέψουμε σήμερα;</h2><p>Διάλεξε μια πόρτα. Κάθε κόσμος κρύβει κάτι όμορφο.</p></div>
          <div className="pw17-world-grid">{worlds.map(w=><button key={w.id} className={"pw17-world-card "+w.tone} onClick={()=>playWorld(w.id)} aria-label={w.accessible}><div className="pw17-world-art"><img src={w.image} alt="" loading="lazy"/><span>{w.emoji}</span></div><div className="pw17-world-info"><h3>{w.title}</h3><p>{w.subtitle}</p><span className="pw17-world-arrow">Ανακάλυψε <ArrowRight size={18}/></span></div></button>)}</div>
        </section>
        <section className="pw17-feature"><div><span className="pw17-overline">ΜΙΑ ΜΙΚΡΗ ΑΠΟΣΤΟΛΗ</span><h2>Η ομορφότερη περιπέτεια συνεχίζεται έξω από την οθόνη.</h2><p>Παρατήρησε ένα φύλλο, άκου τη βροχή ή ζωγράφισε κάτι που είδες. Λίγα λεπτά παρέα μπορούν να γίνουν μεγάλη ιστορία.</p><button className="pw17-button primary" onClick={()=>open("today")}>Δες τη σημερινή ιδέα <ArrowRight/></button></div><img src={storyImage} alt="Εικονογράφηση για κοινή ανάγνωση και φαντασία" loading="lazy"/></section>
      </>}
      {zone!=="home"&&<section className="pw17-inner-heading"><button className="pw17-back" onClick={()=>open("home")}><ArrowLeft size={18}/> Πίσω στους κόσμους</button><span className="pw17-overline">Ο ΚΟΣΜΟΣ ΤΟΥ ΠΙΣΙΠΟΥΚ</span><h1>{zone==="games"?"Παίζω και ανακαλύπτω":zone==="atelier"?"Το ατελιέ των χρωμάτων":zone==="stories"?"Η παραμυθοχώρα":zone==="today"?"Η σημερινή μας ιδέα":zone==="parents"?"Για γονείς και παιδαγωγούς":current?.title||"Εξερευνώ"}</h1><p>{zone==="games"?ageToPhrase[age]:current?.subtitle||"Μαθαίνουμε με παιχνίδι, φαντασία και ελεύθερη εξερεύνηση."}</p></section>}
      {zone==="games"&&<><div className="pw17-compact-ages">{ages.map(a=><button key={a.id} className={age===a.id?"selected":""} onClick={()=>setAge(a.id)} aria-pressed={age===a.id}>{a.label} ετών</button>)}</div><LivingGarden age={age} onBack={()=>open("home")}/><BuildPlayground age={age} onBack={()=>open("home")}/><AnimatedArcade age={age} onExit={()=>open("home")}/><DiscoveryGames age={age} onClose={()=>open("home")}/><div className="pw17-game-intro"><span>ΑΚΟΜΗ ΠΕΡΙΣΣΟΤΕΡΟ ΠΑΙΧΝΙΔΙ</span><h2>Οι αγαπημένες δραστηριότητες του Πισιπούκ</h2></div><div className="pw17-game-grid">{games.map(g=><button key={g.id} onClick={()=>setGame(g)} className="pw17-game-card"><img src={g.cover} alt="" loading="lazy"/><div><span>{g.minutes} · {g.skill}</span><h2>{g.title}</h2><p>{g.intro}</p><strong>Παίζω <ArrowRight size={18}/></strong></div></button>)}</div></>}
      {zone==="atelier"&&<><div className="pw17-experience"><Atelier360/></div><WorldActivities world="atelier" age={age} onExit={()=>open("home")}/></>}
      {zone==="stories"&&<><AnimatedArcade age={age} world="stories" onExit={()=>open("home")}/><WorldActivities world="stories" age={age} onExit={()=>open("home")}/><div className="pw17-experience"><Stories/></div></>}
      {zone==="today"&&<div className="pw17-experience"><Today/></div>}
      {zone==="nature"&&<><LivingGarden age={age} onBack={()=>open("home")}/><ForestQuestV17 age={age} onExit={()=>open("home")}/><AnimatedArcade age={age} world="nature" onExit={()=>open("home")}/><WorldActivities world="nature" age={age} onExit={()=>open("home")}/></>}
      {zone==="greece"&&<><AnimatedArcade age={age} world="greece" onExit={()=>open("home")}/><WorldActivities world="greece" age={age} onExit={()=>open("home")}/><div className="pw17-context"><img src={forestImage} alt="" /><h2>Μικρές αποστολές στην Ελλάδα</h2><p>Μια νέα ιστορία ξεκινά από τα χρώματα της εποχής. Βρες τρία φυσικά αντικείμενα, παρατήρησέ τα με έναν ενήλικο και ζωγράφισε το αγαπημένο σου.</p><button className="pw17-button primary" onClick={()=>open("today")}>Δες μια δραστηριότητα <ArrowRight/></button></div></>}
      {zone==="music"&&<><AnimatedArcade age={age} world="music" onExit={()=>open("home")}/><WorldActivities world="music" age={age} onExit={()=>open("home")}/><div className="pw17-context"><Music2 size={48}/><h2>Παίζουμε με τον ρυθμό</h2><p>Ακούμε, δοκιμάζουμε και δημιουργούμε ήχους χωρίς σωστό ή λάθος.</p><button className="pw17-button primary" onClick={()=>setGame(V15_GAMES.find(g=>g.id==="music")||null)}>Ξεκίνα τη μουσική <ArrowRight/></button></div></>}
      {zone==="discovery"&&<><BuildPlayground age={age} onBack={()=>open("home")}/><AnimatedArcade age={age} world="discovery" onExit={()=>open("home")}/><WorldActivities world="discovery" age={age} onExit={()=>open("home")}/><div className="pw17-context"><Shapes size={48}/><h2>Ανακάλυψε σχήματα και μοτίβα</h2><p>Δοκίμασε παιχνίδια ταξινόμησης και ακολουθιών ανά ηλικία.</p><button className="pw17-button primary" onClick={()=>open("games")}>Δες τα παιχνίδια <ArrowRight/></button></div></>}
      {zone==="parents"&&<div className="pw17-parent-content"><div><Heart/><h2>Παιχνίδι με σεβασμό στον ρυθμό του παιδιού</h2><p>Ο Πισιπούκ δεν αξιολογεί παιδιά. Τα παιχνίδια είναι μικρές αφορμές για περιέργεια, δημιουργικότητα και κοινή εμπειρία.</p></div><div><Leaf/><h2>Μετά την οθόνη</h2><p>Κάθε επίσκεψη είναι αφορμή να συνεχίσετε με αληθινά υλικά, κίνηση και συζήτηση. Για τα μικρότερα παιδιά προτείνουμε τη συμμετοχή ενηλίκου.</p></div><div><Volume2/><h2>Ηρεμία και προσβασιμότητα</h2><p>Χωρίς διαφημίσεις, πίεση χρόνου ή δημόσιες κατατάξεις. Σχεδιάζουμε ευανάγνωστες επιλογές και σεβόμαστε τις ρυθμίσεις μειωμένης κίνησης.</p></div></div>}
    </main>
    <footer className="pw17-footer"><span>Με αγάπη, από τον Πισιπούκ 🧸</span><button onClick={()=>open("parents")}>Για γονείς</button><a href="/">Επιστροφή στο σχολείο</a></footer>
    <nav className="pw17-bottom-nav" aria-label="Πλοήγηση για κινητά">{navigation.slice(0,5).map(({id,label,icon:Icon})=><button key={id} className={zone===id?"active":""} onClick={()=>open(id)}><Icon size={22}/><span>{label}</span></button>)}</nav>
    {game&&<V15GamePlayer game={game} age={age} onBack={()=>setGame(null)}/>}
  </div>;
}
