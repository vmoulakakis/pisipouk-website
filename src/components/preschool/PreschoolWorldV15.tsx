import "./preschool-v15.css";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, Brush, CalendarDays, Compass, Gamepad2, Home, LockKeyhole, Sparkles, Users, Volume2 } from "lucide-react";
import bearLogo from "@/assets/pisipouk-logo.webp";
import arrival from "@/assets/pisipouk-arrival.webp";
import classroom from "@/assets/pisipouk-classroom.webp";
import exterior from "@/assets/pisipouk-exterior.webp";
import story from "@/assets/pisipouk-story.webp";
import { AGE_META, GAME_META, GAME_ORDER, type AgeBand, type GameId, type SectionId } from "./v15/content";
import { GamePlayer } from "./v15/Games";
import { Atelier, ExploreWorld, ParentRoom, StoryRoom, TodayMission } from "./v15/Studios";
import { speakGreek } from "./v15/PisipoukGuide";

const nav: {id:SectionId;label:string;Icon:React.ComponentType<{size?:number}>}[] = [
  {id:"home",label:"Αρχική",Icon:Home},
  {id:"games",label:"Παίζω",Icon:Gamepad2},
  {id:"atelier",label:"Δημιουργώ",Icon:Brush},
  {id:"stories",label:"Ιστορίες",Icon:BookOpen},
  {id:"explore",label:"Εξερευνώ",Icon:Compass},
  {id:"parents",label:"Γονείς",Icon:Users},
];

function recordStart(id:GameId) {
  try {
    const raw=JSON.parse(localStorage.getItem("pisipouk-v15-stats")||"{}");
    const byGame=raw.byGame||{};
    byGame[id]={plays:(byGame[id]?.plays||0)+1,last:Date.now()};
    localStorage.setItem("pisipouk-v15-stats",JSON.stringify({...raw,plays:(raw.plays||0)+1,byGame}));
  } catch {}
}

function Hero({age,setAge,go}:{age:AgeBand;setAge:(a:AgeBand)=>void;go:(s:SectionId)=>void}) {
  return <>
    <section className="pw15-hero">
      <img className="pw15-hero-photo" src={story} alt="Ο μαγικός κόσμος του Πισιπούκ"/>
      <div className="pw15-hero-scrim"/>
      <div className="pw15-hero-copy">
        <span><Sparkles/> Ο ΜΑΓΙΚΟΣ ΚΟΣΜΟΣ ΤΟΥ ΠΙΣΙΠΟΥΚ</span>
        <h1>Παίζω.<br/>Δημιουργώ.<br/><em>Ανακαλύπτω.</em></h1>
        <p>Ένα ήρεμο, παιγνιώδες online preschool με τον Πισιπούκ ως σύντροφο — όχι εξεταστή.</p>
        <div className="pw15-hero-actions">
          <button onClick={()=>go("games")}><Gamepad2/> Παίζω τώρα</button>
          <button className="ghost" onClick={()=>speakGreek(AGE_META[age].voice)}><Volume2/> Άκου τον Πισιπούκ</button>
        </div>
      </div>
      <div className="pw15-hero-bear"><img src={bearLogo} alt="Ο Πισιπούκ το αρκουδάκι"/></div>
    </section>

    <section className="pw15-age-strip" aria-label="Επιλογή ηλικίας">
      {(Object.keys(AGE_META) as AgeBand[]).map(a=><button key={a} className={age===a?"on":""} onClick={()=>{setAge(a);speakGreek(AGE_META[a].voice)}}><b>{AGE_META[a].label}</b><span>{AGE_META[a].short}</span></button>)}
    </section>

    <section className="pw15-world-grid">
      <button onClick={()=>go("games")} className="games"><img src={arrival} alt=""/><div><Gamepad2/><b>Παιχνίδια</b><span>Ηλικιακά, tactile, χωρίς πίεση</span></div></button>
      <button onClick={()=>go("atelier")} className="atelier"><img src={classroom} alt=""/><div><Brush/><b>Atelier</b><span>Ζωγραφίζω και δημιουργώ ελεύθερα</span></div></button>
      <button onClick={()=>go("stories")} className="stories"><img src={story} alt=""/><div><BookOpen/><b>Ιστορίες</b><span>Ελληνική αφήγηση και επιλογές</span></div></button>
      <button onClick={()=>go("explore")} className="explore"><img src={exterior} alt=""/><div><Compass/><b>Εξερεύνηση</b><span>Παρατήρηση, φύση και μικρές ανακαλύψεις</span></div></button>
    </section>

    <section className="pw15-home-bottom">
      <button onClick={()=>go("home")} className="daily"><CalendarDays/><div><small>ΣΗΜΕΡΑ</small><b>Μια μικρή αποστολή έξω από την οθόνη</b></div></button>
      <button onClick={()=>go("parents")} className="parents"><LockKeyhole/><div><small>ΓΙΑ ΓΟΝΕΙΣ</small><b>Παιδαγωγική λογική & διακριτική πρόοδος</b></div></button>
    </section>
  </>;
}

export function PreschoolWorldV15() {
  const [age,setAge]=useState<AgeBand>("3-4");
  const [section,setSection]=useState<SectionId>("home");
  const [game,setGame]=useState<GameId|null>(null);
  const games=useMemo(()=>GAME_ORDER.filter(id=>GAME_META[id].ages.includes(age)),[age]);

  useEffect(()=>{
    document.documentElement.style.background="#f7f4ec";
    return()=>{document.documentElement.style.background=""};
  },[]);

  const openGame=(id:GameId)=>{recordStart(id);setGame(id)};

  return <div className="pw15">
    <header className="pw15-top">
      <button className="pw15-brand" onClick={()=>setSection("home")} aria-label="Αρχική Πισιπούκ"><img src={bearLogo} alt=""/><div><b>Ο Κόσμος του Πισιπούκ</b><small>MAGICAL ONLINE PRESCHOOL</small></div></button>
      <nav aria-label="Κύρια πλοήγηση">{nav.map(({id,label,Icon})=><button key={id} className={section===id?"on":""} onClick={()=>setSection(id)}><Icon size={19}/><span>{label}</span></button>)}</nav>
      <button className="pw15-parent-shortcut" onClick={()=>setSection("parents")}><LockKeyhole size={18}/></button>
    </header>

    <main className="pw15-main">
      {section==="home"&&<><Hero age={age} setAge={setAge} go={setSection}/><TodayMission/></>}
      {section==="games"&&<section className="pw15-games-page">
        <div className="pw15-section-head"><div><span><Gamepad2/> ΠΑΙΧΝΙΔΙΑ ΓΙΑ {AGE_META[age].label}</span><h2>Παίζω με τον Πισιπούκ</h2><p>{AGE_META[age].principle}</p></div><div className="pw15-age-pills">{(Object.keys(AGE_META) as AgeBand[]).map(a=><button key={a} onClick={()=>setAge(a)} className={a===age?"on":""}>{AGE_META[a].label}</button>)}</div></div>
        <div className="pw15-game-grid">{games.map(id=>{const m=GAME_META[id];const image=m.scene==="classroom"?classroom:m.scene==="arrival"?arrival:m.scene==="exterior"?exterior:story;return <button key={id} className="pw15-game-card" onClick={()=>openGame(id)}><div className="pw15-game-art"><img src={image} alt=""/><div className="pw15-game-art-bear"><img src={bearLogo} alt=""/></div><span>{m.minutes}</span></div><small>{m.domain}</small><h3>{m.title}</h3><p>{m.teaser}</p><b>ΠΑΙΖΩ →</b></button>})}</div>
      </section>}
      {section==="atelier"&&<Atelier/>}
      {section==="stories"&&<StoryRoom/>}
      {section==="explore"&&<ExploreWorld/>}
      {section==="parents"&&<ParentRoom/>}
    </main>

    <nav className="pw15-mobile-nav" aria-label="Πλοήγηση κινητού">{nav.filter(x=>x.id!=="parents").map(({id,label,Icon})=><button key={id} className={section===id?"on":""} onClick={()=>setSection(id)}><Icon size={21}/><span>{label}</span></button>)}</nav>
    {game&&<GamePlayer id={game} age={age} onClose={()=>setGame(null)}/>}
  </div>;
}
