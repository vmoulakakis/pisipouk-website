import "./preschool-v15.css";
import { useMemo, useState } from "react";
import { BookOpen, Brush, CalendarDays, Compass, Gamepad2, Home, LockKeyhole, Sparkles, Users } from "lucide-react";
import exterior from "@/assets/pisipouk-exterior.webp";
import classroom from "@/assets/pisipouk-classroom.webp";
import story from "@/assets/pisipouk-story.webp";
import arrival from "@/assets/pisipouk-arrival.webp";
import { PisipoukCharacter } from "./v15/PisipoukCharacter";
import { V15_GAMES, V15GamePlayer, type V15Age, type V15Game } from "./v15/Games";
import { Atelier, Stories, Today, Worlds } from "./v15/Experiences";

type Section="home"|"games"|"atelier"|"worlds"|"stories"|"today"|"parents";

const AGE_INFO:Record<V15Age,{label:string;short:string;promise:string}>={
  "2-3":{label:"2–3",short:"Ανακαλύπτω",promise:"Μεγάλα αντικείμενα, cause/effect, ήχος, απλές επιλογές και καθόλου πίεση."},
  "3-4":{label:"3–4",short:"Δοκιμάζω",promise:"Ταξινόμηση, pretend play, λεπτή κίνηση, απλές ακολουθίες και δημιουργία."},
  "4-5":{label:"4–5",short:"Δημιουργώ",promise:"Μοτίβα, μουσική, κατασκευή, ιστορία και πλουσιότερη εξερεύνηση."},
  "5-6":{label:"5–6",short:"Σχεδιάζω",promise:"Problem solving, πρόβλεψη, spatial reasoning, STEM και μεγαλύτερες αποστολές."},
};

const NAV=[
  ["home","Αρχική",Home],
  ["games","Παίζω",Gamepad2],
  ["atelier","Atelier",Brush],
  ["worlds","Κόσμοι",Compass],
  ["stories","Ιστορίες",BookOpen],
  ["today","Σήμερα",CalendarDays],
  ["parents","Γονείς",Users],
] as const;

function SceneHero(){
  return <section className="pv15-hero">
    <img src={exterior} alt="" className="pv15-hero-scene"/>
    <div className="pv15-hero-shade"/>
    <div className="pv15-hero-copy">
      <span className="pv15-kicker"><Sparkles/> Ο ΜΑΓΙΚΟΣ ΚΟΣΜΟΣ ΤΟΥ ΠΙΣΙΠΟΥΚ</span>
      <h1>Ένας κόσμος για να <em>παίζεις</em>, να <strong>φαντάζεσαι</strong> και να δημιουργείς.</h1>
      <p>Play-based online preschool 2–6 ετών, με τον Πισιπούκ δίπλα στο παιδί — όχι απέναντί του σαν εξεταστή.</p>
    </div>
    <PisipoukCharacter mood="wave" className="pv15-hero-bear"/>
  </section>
}

function HomePanel({age,setAge,go}:{age:V15Age;setAge:(a:V15Age)=>void;go:(s:Section)=>void}){
  return <>
    <SceneHero/>
    <section className="pv15-age-strip" aria-label="Επιλογή ηλικίας">
      {(Object.keys(AGE_INFO) as V15Age[]).map(a=><button key={a} className={age===a?"on":""} onClick={()=>setAge(a)}><b>{AGE_INFO[a].label} ετών</b><span>{AGE_INFO[a].short}</span></button>)}
    </section>
    <section className="pv15-portals">
      <button className="pv15-portal play" onClick={()=>go("games")}><img src={arrival} alt=""/><div><Gamepad2/><small>PLAY LAB</small><h2>Παίζω</h2><p>Ηλικιακά παιχνίδια με tactile interaction και ολοκληρωμένο payoff.</p></div></button>
      <button className="pv15-portal atelier" onClick={()=>go("atelier")}><img src={classroom} alt=""/><div><Brush/><small>OPEN ATELIER</small><h2>Δημιουργώ</h2><p>Ελεύθερη ζωγραφική και ψηφιακό tinkering χωρίς σωστό/λάθος.</p></div></button>
      <button className="pv15-portal worlds" onClick={()=>go("worlds")}><img src={exterior} alt=""/><div><Compass/><small>MICRO WORLDS</small><h2>Εξερευνώ</h2><p>Αργή παρατήρηση, hidden discoveries και φύση.</p></div></button>
      <button className="pv15-portal stories" onClick={()=>go("stories")}><img src={story} alt=""/><div><BookOpen/><small>STORY WORLD</small><h2>Ακούω ιστορίες</h2><p>Ελληνική αφήγηση, εικόνα και ήρεμο storytelling.</p></div></button>
    </section>
    <section className="pv15-bottom-cards">
      <button onClick={()=>go("today")}><CalendarDays/><div><small>ΣΗΜΕΡΑ</small><b>Μία μικρή αποστολή που συνεχίζεται εκτός οθόνης</b></div><span>→</span></button>
      <button onClick={()=>go("parents")}><LockKeyhole/><div><small>ΓΙΑ ΓΟΝΕΙΣ</small><b>Ασφάλεια, αρχές και local-first πρόοδος</b></div><span>→</span></button>
    </section>
  </>
}

function Parents(){
  return <section className="pv15-parents">
    <span className="pv15-kicker">ΓΙΑ ΓΟΝΕΙΣ & ΠΑΙΔΑΓΩΓΟΥΣ</span>
    <h2>Το παιδί παίζει. Ο ενήλικος βλέπει το πλαίσιο — όχι βαθμούς.</h2>
    <p>Η εμπειρία είναι σχεδιασμένη γύρω από αυτενέργεια, ήπια ανατροφοδότηση, ελεύθερη δημιουργία, εξερεύνηση και συνέχεια στον πραγματικό κόσμο. Δεν υπάρχουν streaks, leaderboards ή αγχωτικά timers.</p>
    <div className="pv15-parent-grid">
      <article><b>Αυτοδιόρθωση</b><p>Τα λάθη επιστρέφουν απαλά, χωρίς κόκκινα Χ ή τιμωρητικούς ήχους.</p></article>
      <article><b>Slow play</b><p>Χώρος για παρατήρηση και επανάληψη, όχι arcade υπερδιέγερση.</p></article>
      <article><b>Age-first</b><p>Κάθε δραστηριότητα εμφανίζεται μόνο στις ηλικίες όπου βγάζει παιδαγωγικό νόημα.</p></article>
      <article><b>Offline συνέχεια</b><p>Μικρές προτάσεις για παιχνίδι, κίνηση, φύση και συνεργασία με γονέα.</p></article>
    </div>
  </section>
}

export function PreschoolV15(){
  const [section,setSection]=useState<Section>("home");
  const [age,setAge]=useState<V15Age>("3-4");
  const [game,setGame]=useState<V15Game|null>(null);
  const games=useMemo(()=>V15_GAMES.filter(g=>g.ages.includes(age)),[age]);

  return <div className="pv15-app">
    <header className="pv15-top">
      <button className="pv15-brand" onClick={()=>setSection("home")} aria-label="Αρχική Πισιπούκ"><PisipoukCharacter mood="idle"/><div><b>Ο Κόσμος του Πισιπούκ</b><small>ONLINE PRESCHOOL</small></div></button>
      <nav>{NAV.map(([id,label,Icon])=><button key={id} className={section===id?"on":""} onClick={()=>setSection(id)}><Icon size={19}/><span>{label}</span></button>)}</nav>
    </header>

    <main className="pv15-main">
      {section==="home"&&<HomePanel age={age} setAge={setAge} go={setSection}/>}
      {section==="games"&&<section className="pv15-games">
        <div className="pv15-section-head"><div><span className="pv15-kicker"><Gamepad2/> ΠΑΙΧΝΙΔΙΑ ΑΝΑ ΗΛΙΚΙΑ</span><h2>Παίζω με τον Πισιπούκ</h2><p>{AGE_INFO[age].promise}</p></div><div className="pv15-age-pills">{(Object.keys(AGE_INFO) as V15Age[]).map(a=><button key={a} className={age===a?"on":""} onClick={()=>setAge(a)}>{AGE_INFO[a].label}</button>)}</div></div>
        <div className="pv15-game-grid">{games.map(g=><button className="pv15-game-card" key={g.id} onClick={()=>setGame(g)} style={{"--accent":g.accent} as React.CSSProperties}><img src={g.cover} alt=""/><div className="shade"/><PisipoukCharacter mood={g.id==="music"?"dance":g.id==="feed"?"happy":"wave"}/><div className="copy"><small>{g.minutes} • {g.skill}</small><h3>{g.title}</h3><p>{g.intro}</p><b>ΠΑΙΖΩ →</b></div></button>)}</div>
      </section>}
      {section==="atelier"&&<Atelier/>}
      {section==="worlds"&&<Worlds/>}
      {section==="stories"&&<Stories/>}
      {section==="today"&&<Today/>}
      {section==="parents"&&<Parents/>}
    </main>

    <nav className="pv15-mobile-nav">{NAV.filter(([id])=>id!=="parents").map(([id,label,Icon])=><button key={id} className={section===id?"on":""} onClick={()=>setSection(id)}><Icon size={22}/><span>{label}</span></button>)}</nav>
    {game&&<V15GamePlayer game={game} age={age} onBack={()=>setGame(null)}/>}
  </div>
}
