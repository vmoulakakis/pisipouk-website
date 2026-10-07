import { useMemo, useState } from "react";
import {
  BookOpen,
  Brush,
  CalendarDays,
  Compass,
  Gamepad2,
  Home,
  LockKeyhole,
  Sparkles,
  Users,
} from "lucide-react";
import bearLogo from "@/assets/pisipouk-logo.webp";
import { MagicBear } from "./v14/MagicBear";
import { AGE_INFO, MAGIC_GAMES, type MagicAge, type MagicSection } from "./v14/catalog";
import { MagicGamePlayer } from "./v14/MagicGames";
import { DrawingStudio, ExploreStudio, ParentsStudio, StoryStudio, TodayStudio } from "./v14/MagicStudios";

const NAV: { id: MagicSection; label: string; icon: React.ComponentType<{size?:number}> }[] = [
  { id:"home", label:"Αρχική", icon:Home },
  { id:"games", label:"Παίζω", icon:Gamepad2 },
  { id:"create", label:"Δημιουργώ", icon:Brush },
  { id:"stories", label:"Ιστορίες", icon:BookOpen },
  { id:"explore", label:"Εξερευνώ", icon:Compass },
  { id:"today", label:"Σήμερα", icon:CalendarDays },
  { id:"parents", label:"Για Γονείς", icon:Users },
];

function MagicLandscape() {
  return (
    <div className="pm-landscape" aria-hidden="true">
      <div className="pm-sun"/>
      <div className="pm-cloud c1"/><div className="pm-cloud c2"/>
      <div className="pm-hill far"/><div className="pm-hill near"/>
      <div className="pm-sea"/>
      <div className="pm-village">
        <i className="house a"/><i className="house b"/><i className="house c"/>
        <i className="dome d1"/><i className="dome d2"/>
        <div className="windmill"><b/><span className="blade b1"/><span className="blade b2"/><span className="blade b3"/><span className="blade b4"/></div>
      </div>
      <div className="pm-flowers">{Array.from({length:16},(_,i)=><i key={i} style={{"--i":i} as React.CSSProperties}/>)}</div>
      <div className="pm-star-friend">★</div>
    </div>
  );
}

function HomePanel({ age, setAge, go }: { age:MagicAge; setAge:(v:MagicAge)=>void; go:(s:MagicSection)=>void }) {
  return (
    <>
      <section className="pm-hero">
        <MagicLandscape/>
        <div className="pm-hero-copy">
          <span className="pm-kicker"><Sparkles/> Ο ΜΑΓΙΚΟΣ ΚΟΣΜΟΣ ΤΟΥ ΠΙΣΙΠΟΥΚ</span>
          <h1><span>Μαθαίνουμε.</span><em>Παίζουμε.</em><strong>Δημιουργούμε.</strong></h1>
          <p>Ένας ασφαλής, χαρούμενος online κόσμος για παιδιά 2–6 ετών, με παιχνίδι, δημιουργία, ιστορίες και εξερεύνηση.</p>
        </div>
        <div className="pm-hero-bear-wrap"><MagicBear reaction="wave"/></div>
      </section>

      <section className="pm-age-row" aria-label="Επιλογή ηλικίας">
        {(Object.keys(AGE_INFO) as MagicAge[]).map(item=>(
          <button key={item} className={age===item?"on":""} onClick={()=>setAge(item)}>
            <span>{AGE_INFO[item].label}</span><small>{AGE_INFO[item].short}</small>
          </button>
        ))}
      </section>

      <section className="pm-feature-row">
        <button className="pm-feature games" onClick={()=>go("games")}><div><Gamepad2/><b>Διαδραστικά Παιχνίδια</b><span>Ηλικιακά, tactile και με πραγματικό payoff</span></div><strong>ΠΑΙΖΩ →</strong></button>
        <button className="pm-feature create" onClick={()=>go("create")}><div><Brush/><b>Ζωγραφική & Δημιουργία</b><span>Touch canvas και ελεύθερη έκφραση</span></div><strong>ΔΗΜΙΟΥΡΓΩ →</strong></button>
        <button className="pm-feature stories" onClick={()=>go("stories")}><div><BookOpen/><b>Ιστορίες Πισιπούκ</b><span>Ελληνική αφήγηση και σκηνές</span></div><strong>ΑΚΟΥΩ →</strong></button>
        <button className="pm-feature explore" onClick={()=>go("explore")}><div><Compass/><b>Εξερεύνηση</b><span>Hidden objects, φύση και ανακάλυψη</span></div><strong>ΕΞΕΡΕΥΝΩ →</strong></button>
      </section>

      <section className="pm-home-bottom">
        <button className="pm-weekly" onClick={()=>go("today")}><CalendarDays/><div><small>Η ΑΠΟΣΤΟΛΗ ΤΗΣ ΗΜΕΡΑΣ</small><b>Κάθε μέρα κάτι νέο σε περιμένει</b></div><span>→</span></button>
        <button className="pm-parent-card" onClick={()=>go("parents")}><LockKeyhole/><div><small>ΓΙΑ ΓΟΝΕΙΣ</small><b>Ασφάλεια, πρόοδος και offline συνέχεια</b></div><span>→</span></button>
      </section>
    </>
  );
}

export function PreschoolMagicV14() {
  const [section,setSection]=useState<MagicSection>("home");
  const [age,setAge]=useState<MagicAge>("3");
  const [activeGame,setActiveGame]=useState<(typeof MAGIC_GAMES)[number] | null>(null);
  const games=useMemo(()=>MAGIC_GAMES.filter(game=>game.age.includes(age)),[age]);

  return (
    <div className="pm-app">
      <header className="pm-topbar">
        <button className="pm-brand" onClick={()=>setSection("home")} aria-label="Αρχική Πισιπούκ">
          <img src={bearLogo} alt="" />
          <div><b>Ο Κόσμος του <span>Πισιπούκ</span></b><small>MAGICAL ONLINE PRESCHOOL</small></div>
        </button>
        <nav className="pm-nav" aria-label="Κύρια πλοήγηση">
          {NAV.map(item=>{const Icon=item.icon; return <button key={item.id} className={section===item.id?"on":""} onClick={()=>setSection(item.id)}><Icon size={20}/><span>{item.label}</span></button>})}
        </nav>
      </header>

      <main className="pm-main">
        {section==="home" && <HomePanel age={age} setAge={setAge} go={setSection}/>}
        {section==="games" && (
          <section className="pm-section">
            <div className="pm-section-head">
              <div><span className="pm-kicker"><Gamepad2/> ΠΑΙΧΝΙΔΙΑ ΑΝΑ ΗΛΙΚΙΑ</span><h2>Παίζω με τον Πισιπούκ</h2><p>{AGE_INFO[age].promise}</p></div>
              <div className="pm-mini-ages">{(Object.keys(AGE_INFO) as MagicAge[]).map(item=><button key={item} onClick={()=>setAge(item)} className={age===item?"on":""}>{AGE_INFO[item].label}</button>)}</div>
            </div>
            <div className="pm-game-grid">
              {games.map(game=>(
                <button key={game.id} className="pm-game-card" onClick={()=>setActiveGame(game)} style={{"--game":game.color,"--game2":game.secondary} as React.CSSProperties}>
                  <div className={`pm-card-art art-${game.art}`}><MagicBear reaction={game.id==="music"?"dance":game.id==="feed"?"happy":"wave"}/><span className="pm-card-spark">✦</span></div>
                  <small>{game.minutes} • {game.domain}</small><h3>{game.title}</h3><p>{game.subtitle}</p><b>ΠΑΙΖΩ ΤΩΡΑ →</b>
                </button>
              ))}
            </div>
          </section>
        )}
        {section==="create" && <DrawingStudio/>}
        {section==="stories" && <StoryStudio/>}
        {section==="explore" && <ExploreStudio/>}
        {section==="today" && <TodayStudio/>}
        {section==="parents" && <ParentsStudio/>}
      </main>

      <nav className="pm-bottom-nav" aria-label="Πλοήγηση κινητού">
        {NAV.filter(x=>x.id!=="parents").slice(0,6).map(item=>{const Icon=item.icon;return <button key={item.id} className={section===item.id?"on":""} onClick={()=>setSection(item.id)}><Icon size={22}/><span>{item.label}</span></button>})}
      </nav>

      {activeGame && <MagicGamePlayer game={activeGame} age={age} onClose={()=>setActiveGame(null)}/>}
    </div>
  );
}
