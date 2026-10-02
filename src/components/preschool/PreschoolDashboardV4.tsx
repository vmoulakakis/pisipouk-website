import { useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Home,
  LockKeyhole,
  Palette,
  PersonStanding,
  Play,
  Scissors,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { PreschoolGameLab } from "@/components/preschool/PreschoolGameLab";
import {
  COLORING_PAGES,
  CRAFT_LIBRARY,
  CURATED_MEDIA,
  type PreschoolAge,
} from "@/content/virtualPreschoolMedia";
import { trackEvent } from "@/lib/pisipoukApi";

type Panel = "home" | "games" | "stories" | "crafts" | "color" | "move" | "today";

const AGES: { id: PreschoolAge; label: string; note: string; emoji: string }[] = [
  { id: "2–3", label: "2–3 ετών", note: "χρώματα • σχήματα • απλές ρουτίνες", emoji: "🧸" },
  { id: "4–5", label: "4–5 ετών", note: "μοτίβα • ιστορίες • συναισθήματα", emoji: "🌈" },
  { id: "5–6", label: "5–6 ετών", note: "γράμματα • αριθμοί • problem solving", emoji: "🚀" },
];

const WORLDS = [
  { id: "games" as const, title: "Παιχνίδια", note: "Παίζω και μαθαίνω", icon: Gamepad2, emoji: "🎮", cls: "world-games" },
  { id: "stories" as const, title: "Ιστορίες", note: "Ακούω και ταξιδεύω", icon: BookOpen, emoji: "📚", cls: "world-stories" },
  { id: "crafts" as const, title: "Κατασκευές", note: "Φτιάχνω και δημιουργώ", icon: Scissors, emoji: "✂️", cls: "world-crafts" },
  { id: "color" as const, title: "Ζωγραφική", note: "Χρωματίζω τον κόσμο", icon: Palette, emoji: "🎨", cls: "world-color" },
  { id: "move" as const, title: "Κινούμαι", note: "Χορεύω και γυμνάζομαι", icon: PersonStanding, emoji: "🤸", cls: "world-move" },
];

const MOVE_MISSIONS = [
  ["🕺", "Freeze dance", "Χόρεψε για 30″ και πάγωσε όταν σταματήσει η μουσική."],
  ["🐸", "Βατραχάκια", "Κάνε 6 μικρά πηδηματάκια σαν βατραχάκι."],
  ["🌈", "Κυνήγι χρωμάτων", "Βρες 3 αντικείμενα διαφορετικού χρώματος στο δωμάτιο."],
  ["🧘", "Ήρεμη αναπνοή", "Πάρε 3 αργές αναπνοές και σήκωσε τα χέρια ψηλά."],
  ["👏", "Ρυθμός", "Χτύπα παλαμάκια: αργά, γρήγορα, αργά, γρήγορα."],
  ["🚶", "Ισορροπία", "Περπάτησε πάνω σε μια νοητή γραμμή σαν σχοινί."],
];

export function PreschoolDashboardV4() {
  const [age, setAge] = useState<PreschoolAge>("4–5");
  const [panel, setPanel] = useState<Panel>("home");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [craftId, setCraftId] = useState("");
  const [paint, setPaint] = useState(["#ffd75a", "#ff78a8", "#67c9ff", "#7bdba5", "#b99bff"]);
  const [paintColor, setPaintColor] = useState("#ff5f8f");

  const videos = useMemo(() => CURATED_MEDIA.filter((v) => v.ages.includes(age)), [age]);
  const crafts = useMemo(() => CRAFT_LIBRARY.filter((c) => c.ages.includes(age)), [age]);
  const coloring = useMemo(() => COLORING_PAGES.filter((c) => c.ages.includes(age)), [age]);
  const chosenCraft = CRAFT_LIBRARY.find((c) => c.id === craftId) ?? crafts[0];

  function open(next: Panel) {
    setPanel(next);
    trackEvent("preschool_world_open", { world: next, age });
  }

  function chooseAge(next: PreschoolAge) {
    setAge(next);
    trackEvent("preschool_age", { age: next });
  }

  return (
    <div className="pd4">
      <style>{`
        .pd4{--ink:#20225b;--violet:#6853f7;--pink:#ff5d9e;--yellow:#ffd54f;--sky:#63c8ff;--mint:#6fdaa5;min-height:100svh;color:var(--ink);font-family:inherit;background:#dff4ff;overflow:hidden}
        .pd4 *{box-sizing:border-box}.pd4 button,.pd4 a{font:inherit}.pd4-home{position:relative;min-height:100svh;overflow:hidden;background:linear-gradient(180deg,#d9f4ff 0%,#eafcff 50%,#fff2c9 100%)}
        .pd4-home:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 20% 18%,rgba(255,255,255,.95),transparent 18%),radial-gradient(circle at 78% 12%,rgba(255,255,255,.65),transparent 22%),linear-gradient(130deg,rgba(112,91,247,.06),transparent 38%);pointer-events:none}
        .pd4-cloud{position:absolute;border-radius:999px;background:rgba(255,255,255,.84);filter:blur(.2px);box-shadow:45px 8px 0 5px rgba(255,255,255,.78),90px -2px 0 0 rgba(255,255,255,.68)}
        .pd4-cloud.c1{width:90px;height:36px;top:18%;left:3%}.pd4-cloud.c2{width:110px;height:40px;top:24%;right:8%;opacity:.7}
        .pd4-top{position:relative;z-index:20;height:86px;margin:0 auto;width:min(1510px,calc(100% - 34px));display:grid;grid-template-columns:260px 1fr 280px;gap:16px;align-items:center;padding-top:12px}
        .pd4-logo{height:62px;border-radius:26px;background:rgba(255,255,255,.94);box-shadow:0 16px 40px rgba(53,58,116,.13);display:flex;align-items:center;gap:12px;padding:8px 17px;text-decoration:none;color:var(--ink)}
        .pd4-logo img{width:48px;height:48px;border-radius:16px;object-fit:cover}.pd4-logo b{display:block;font-size:1.1rem;letter-spacing:.02em}.pd4-logo small{display:block;color:#7c66f3;font-weight:900;font-size:.66rem;letter-spacing:.08em}
        .pd4-nav{height:62px;border-radius:28px;background:rgba(255,255,255,.94);box-shadow:0 16px 40px rgba(53,58,116,.13);display:flex;align-items:center;justify-content:center;padding:6px;gap:2px}
        .pd4-nav button{border:0;background:transparent;color:var(--ink);height:50px;min-width:92px;border-radius:21px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:.72rem;font-weight:950;cursor:pointer}.pd4-nav svg{width:21px;height:21px}.pd4-nav button:hover,.pd4-nav button.is-active{background:#efeaff;color:#5f47e9}
        .pd4-actions{display:flex;gap:8px;justify-content:flex-end}.pd4-actions button,.pd4-actions a{border:0;text-decoration:none;height:58px;border-radius:24px;display:flex;align-items:center;gap:8px;padding:0 18px;font-weight:950;cursor:pointer}.pd4-today{background:#fff0a6;color:#654f00}.pd4-parent{background:linear-gradient(135deg,#745bf7,#8f55f5);color:white;box-shadow:0 12px 28px rgba(102,83,247,.28)}
        .pd4-stage{position:relative;z-index:4;width:min(1510px,calc(100% - 34px));height:calc(100svh - 98px);min-height:690px;margin:0 auto;padding:25px 0 24px;display:grid;grid-template-columns:minmax(480px,.9fr) minmax(560px,1.1fr);grid-template-rows:1fr 248px;gap:22px 30px}
        .pd4-copy{align-self:center;z-index:3;padding-left:18px}.pd4-kicker{display:inline-flex;align-items:center;gap:7px;border-radius:999px;background:#fff4b7;padding:9px 14px;font-size:.76rem;font-weight:950;letter-spacing:.06em;color:#5b4c00;box-shadow:0 8px 24px rgba(90,75,0,.08)}
        .pd4 h1{font-size:clamp(4.2rem,6vw,7.4rem);line-height:.78;letter-spacing:-.065em;margin:16px 0 15px;font-weight:1000}.pd4 h1 span{display:block}.pd4 h1 .l1{color:#5d42dd}.pd4 h1 .l2{color:#ffb51f}.pd4 h1 .l3{color:#ff5488}.pd4-sub{max-width:650px;font-size:1.14rem;line-height:1.45;font-weight:750;color:#3f4770;margin:0}
        .pd4-ages{margin-top:18px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;max-width:760px}.pd4-age{border:0;border-radius:25px;background:rgba(255,255,255,.88);padding:13px 14px;text-align:left;min-height:82px;box-shadow:0 14px 30px rgba(54,72,113,.10);cursor:pointer;display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center}.pd4-age b{display:block;font-size:1rem}.pd4-age small{display:block;font-size:.7rem;color:#67708f;margin-top:3px;line-height:1.3}.pd4-age .emo{font-size:1.9rem}.pd4-age.is-active{outline:4px solid rgba(104,83,247,.18);background:white}.pd4-age:nth-child(1){background:#fff2bd}.pd4-age:nth-child(2){background:#ddf6ff}.pd4-age:nth-child(3){background:#eee2ff}
        .pd4-start{margin-top:15px;border:0;border-radius:22px;background:linear-gradient(135deg,#ffdb4d,#ffc935);color:#30305e;min-height:56px;padding:0 22px;font-weight:1000;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 16px 35px rgba(158,116,0,.16)}
        .pd4-art{position:relative;align-self:stretch;border-radius:42px;overflow:hidden;background:linear-gradient(180deg,#88dcff,#eafff1 60%,#ffe9a9);box-shadow:0 28px 70px rgba(42,75,120,.20);border:7px solid rgba(255,255,255,.88)}
        .pd4-art:before{content:"";position:absolute;inset:0;background-image:linear-gradient(180deg,transparent 58%,rgba(27,63,59,.16)),url('/preschool-hero.webp');background-size:cover;background-position:center;filter:saturate(1.18) contrast(1.03)}
        .pd4-art:after{content:"Κάθε μέρα κάτι νέο σε περιμένει!";position:absolute;right:20px;top:20px;max-width:210px;padding:12px 16px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 14px 35px rgba(43,56,99,.15);font-weight:950;text-align:center}
        .pd4-owl{position:absolute;right:5%;bottom:6%;font-size:clamp(6rem,9vw,10rem);filter:drop-shadow(0 18px 18px rgba(44,45,85,.22));animation:pd4bob 3.4s ease-in-out infinite}.pd4-spark{position:absolute;font-size:2.2rem;animation:pd4float 5s ease-in-out infinite}.pd4-spark.s1{left:10%;top:12%}.pd4-spark.s2{right:24%;top:17%;animation-delay:-2s}.pd4-spark.s3{left:35%;bottom:16%;animation-delay:-1s}
        .pd4-worlds{grid-column:1/-1;display:grid;grid-template-columns:repeat(5,1fr);gap:13px;align-self:end}.pd4-world{position:relative;border:0;border-radius:31px;min-height:225px;padding:18px;overflow:hidden;text-align:left;color:#fff;cursor:pointer;box-shadow:0 18px 42px rgba(43,47,99,.18);transition:.22s transform,.22s box-shadow}.pd4-world:hover{transform:translateY(-7px) scale(1.01);box-shadow:0 28px 55px rgba(43,47,99,.22)}.pd4-world:before{content:"";position:absolute;inset:0;background-image:url('/preschool-hero.webp');background-size:640px;background-position:center;opacity:.18;mix-blend-mode:soft-light}.pd4-world:after{content:"";position:absolute;width:150px;height:150px;border-radius:50%;right:-45px;top:-45px;background:rgba(255,255,255,.18)}.pd4-world>*{position:relative;z-index:2}.pd4-world .big{font-size:4.9rem;line-height:1;filter:drop-shadow(0 10px 14px rgba(35,37,80,.14))}.pd4-world h3{font-size:1.65rem;line-height:1;margin:18px 0 6px;letter-spacing:-.035em}.pd4-world p{margin:0;font-weight:800;opacity:.92;font-size:.86rem}.pd4-world .go{position:absolute;right:17px;bottom:17px;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.92);color:#2f326a}.world-games{background:linear-gradient(145deg,#7757f9,#5d45db)}.world-stories{background:linear-gradient(145deg,#3bc2ff,#2a9bea)}.world-crafts{background:linear-gradient(145deg,#ffbd2e,#ff8a25)}.world-color{background:linear-gradient(145deg,#ff72b3,#ed4f9d)}.world-move{background:linear-gradient(145deg,#4ed885,#25b865)}
        .pd4-panel{position:fixed;inset:0;z-index:200;background:linear-gradient(180deg,#eef8ff,#fff7e8);display:flex;flex-direction:column}.pd4-panel-head{height:78px;flex:0 0 78px;background:rgba(255,255,255,.94);border-bottom:1px solid #e8e8f4;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 20px;box-shadow:0 8px 30px rgba(50,55,102,.08)}.pd4-panel-head button{border:0;background:#f0ecff;color:#5f47e9;border-radius:18px;height:46px;padding:0 16px;font-weight:950;display:flex;align-items:center;gap:8px;cursor:pointer}.pd4-panel-head h2{margin:0;font-size:1.45rem;letter-spacing:-.03em}.pd4-panel-head .close{justify-self:end;width:46px;padding:0;justify-content:center}.pd4-panel-body{flex:1;overflow:auto;padding:26px max(18px,calc((100vw - 1420px)/2));overscroll-behavior:contain}
        .pd4-story-grid,.pd4-craft-grid,.pd4-move-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.pd4-card{background:white;border-radius:28px;padding:18px;box-shadow:0 14px 36px rgba(52,62,104,.09);border:1px solid #edf0f7}.pd4-card img{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:20px}.pd4-card h3{margin:12px 0 7px;font-size:1.15rem}.pd4-card p{color:#646d8b;line-height:1.5}.pd4-card button{border:0;border-radius:16px;background:#6752f5;color:#fff;padding:11px 14px;font-weight:950;cursor:pointer}
        .pd4-craft-layout{display:grid;grid-template-columns:.9fr 1.1fr;gap:18px}.pd4-craft-grid{grid-template-columns:repeat(2,minmax(0,1fr));align-content:start}.pd4-craft-grid button{border:0;text-align:left;cursor:pointer}.pd4-craft-detail{position:sticky;top:0;background:white;border-radius:30px;padding:24px;box-shadow:0 16px 40px rgba(55,62,110,.09)}.pd4-craft-detail h3{font-size:2rem;margin:0 0 12px}.pd4-chips{display:flex;flex-wrap:wrap;gap:7px}.pd4-chip{border-radius:999px;background:#fff3cc;padding:7px 10px;font-size:.78rem;font-weight:900}.pd4-craft-detail li{margin:10px 0;color:#4f5778;line-height:1.45}
        .pd4-color-layout{display:grid;grid-template-columns:1.1fr .9fr;gap:22px}.pd4-canvas{background:white;border-radius:32px;padding:20px;box-shadow:0 18px 46px rgba(50,60,106,.10)}.pd4-canvas svg{width:100%;max-height:66vh}.pd4-palette{background:white;border-radius:32px;padding:22px;box-shadow:0 18px 46px rgba(50,60,106,.10)}.pd4-colors{display:grid;grid-template-columns:repeat(5,48px);gap:10px}.pd4-color{width:48px;height:48px;border:4px solid white;box-shadow:0 0 0 2px #e4e7f1;border-radius:50%;cursor:pointer}.pd4-color.is-active{box-shadow:0 0 0 4px #6a55f5}.pd4-coloring-list{margin-top:18px;display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.pd4-coloring-list div{border-radius:18px;background:#f5f1ff;padding:14px;font-weight:900}
        .pd4-today-panel{max-width:1100px;margin:0 auto}.pd4-today-hero{text-align:center;padding:24px 0}.pd4-today-hero h3{font-size:clamp(2.5rem,5vw,5rem);margin:0;letter-spacing:-.06em;color:#5d43df}.pd4-loop{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.pd4-loop .pd4-card{text-align:center}.pd4-loop .emoji{font-size:4rem}.pd4-loop b{display:block;font-size:1.3rem;margin:8px 0}.pd4-loop small{color:#68718d}.pd4-start-big{margin:22px auto 0;border:0;border-radius:22px;background:#ffd54f;color:#2d2f63;min-height:58px;padding:0 24px;font-weight:1000;display:flex;align-items:center;gap:9px;cursor:pointer}
        .pd4-video{position:fixed;inset:0;z-index:300;background:rgba(16,18,52,.82);display:grid;place-items:center;padding:24px}.pd4-video-inner{width:min(900px,96vw);background:white;border-radius:28px;padding:14px}.pd4-video-top{display:flex;justify-content:flex-end;margin-bottom:8px}.pd4-video-top button{width:42px;height:42px;border:0;border-radius:50%;cursor:pointer}.pd4-video iframe{width:100%;aspect-ratio:16/9;border:0;border-radius:18px}
        @keyframes pd4bob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-10px) rotate(2deg)}}@keyframes pd4float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @media(max-width:1180px){.pd4-top{grid-template-columns:210px 1fr 150px}.pd4-actions .pd4-today span,.pd4-actions .pd4-parent span{display:none}.pd4-actions button,.pd4-actions a{width:58px;padding:0;justify-content:center}.pd4-nav button{min-width:72px}.pd4-stage{grid-template-columns:1fr 1fr;grid-template-rows:1fr 220px}.pd4 h1{font-size:4.5rem}.pd4-world{min-height:200px}.pd4-world .big{font-size:4rem}}
        @media(max-width:900px){.pd4{overflow:auto}.pd4-home{min-height:auto;padding-bottom:22px}.pd4-top{height:auto;width:calc(100% - 20px);grid-template-columns:1fr auto;padding-top:10px}.pd4-logo{height:56px}.pd4-nav{position:fixed;z-index:220;left:10px;right:10px;bottom:10px;height:68px;order:3}.pd4-nav button{min-width:0;flex:1}.pd4-actions{grid-column:2}.pd4-stage{height:auto;min-height:0;width:calc(100% - 20px);grid-template-columns:1fr;grid-template-rows:auto auto auto;padding-top:15px;padding-bottom:90px}.pd4-copy{padding:0 5px}.pd4 h1{font-size:clamp(3.6rem,16vw,5.4rem)}.pd4-art{min-height:360px}.pd4-worlds{grid-column:1;grid-template-columns:repeat(2,1fr)}.pd4-world{min-height:180px}.pd4-world:last-child{grid-column:1/-1}.pd4-story-grid,.pd4-move-grid{grid-template-columns:1fr 1fr}.pd4-craft-layout,.pd4-color-layout{grid-template-columns:1fr}.pd4-craft-detail{position:static}.pd4-loop{grid-template-columns:1fr 1fr}}
        @media(max-width:560px){.pd4-logo span:last-child{display:none}.pd4-logo{width:58px;padding:5px}.pd4-top{grid-template-columns:60px 1fr}.pd4-actions{gap:5px}.pd4-actions button,.pd4-actions a{width:52px;height:52px}.pd4-sub{font-size:.96rem}.pd4-ages{grid-template-columns:1fr}.pd4-art{min-height:290px}.pd4-worlds{grid-template-columns:1fr 1fr}.pd4-world{min-height:160px}.pd4-world .big{font-size:3.4rem}.pd4-world h3{font-size:1.25rem}.pd4-story-grid,.pd4-move-grid{grid-template-columns:1fr}.pd4-craft-grid{grid-template-columns:1fr}.pd4-loop{grid-template-columns:1fr}.pd4-panel-head{grid-template-columns:auto 1fr auto}.pd4-panel-head h2{text-align:center;font-size:1.05rem}.pd4-colors{grid-template-columns:repeat(5,42px)}.pd4-color{width:42px;height:42px}}
      `}</style>

      <section className="pd4-home">
        <div className="pd4-cloud c1" /><div className="pd4-cloud c2" />
        <header className="pd4-top">
          <a href="/" className="pd4-logo" aria-label="Πισιπούκ">
            <img src="/favicon.webp" alt="" />
            <span><b>ΠΙΣΙΠΟΥΚ</b><small>VIRTUAL PRESCHOOL+</small></span>
          </a>
          <nav className="pd4-nav" aria-label="Δραστηριότητες">
            <button className="is-active" onClick={() => setPanel("home")}><Home /><span>Αρχική</span></button>
            <button onClick={() => open("games")}><Gamepad2 /><span>Παιχνίδια</span></button>
            <button onClick={() => open("stories")}><BookOpen /><span>Ιστορίες</span></button>
            <button onClick={() => open("crafts")}><Scissors /><span>Κατασκευές</span></button>
            <button onClick={() => open("color")}><Palette /><span>Ζωγραφική</span></button>
            <button onClick={() => open("move")}><PersonStanding /><span>Κινούμαι</span></button>
            <a href="/parent-zone" style={{display:"contents"}}><button type="button"><Users /><span>Γονείς</span></button></a>
          </nav>
          <div className="pd4-actions">
            <button className="pd4-today" onClick={() => open("today")}><CalendarDays /><span>Σήμερα</span></button>
            <a className="pd4-parent" href="/parent-zone"><LockKeyhole /><span>Είσοδος Γονέων</span></a>
          </div>
        </header>

        <main className="pd4-stage">
          <div className="pd4-copy">
            <div className="pd4-kicker"><Sparkles size={15} /> Ο ΚΟΣΜΟΣ ΤΟΥ ΠΙΣΙΠΟΥΚ</div>
            <h1><span className="l1">Μαθαίνουμε.</span><span className="l2">Παίζουμε.</span><span className="l3">Δημιουργούμε.</span></h1>
            <p className="pd4-sub">Ένας μαγικός κόσμος για παιδιά 2–6 ετών με παιχνίδια, ιστορίες, κατασκευές, ζωγραφική και κίνηση — όλα από την πρώτη οθόνη.</p>
            <div className="pd4-ages">
              {AGES.map((a) => <button key={a.id} className={`pd4-age ${age === a.id ? "is-active" : ""}`} onClick={() => chooseAge(a.id)}><span className="emo">{a.emoji}</span><span><b>{a.label}</b><small>{a.note}</small></span></button>)}
            </div>
            <button className="pd4-start" onClick={() => open("today")}><Play fill="currentColor" size={19} /> Ξεκινάμε το σημερινό ταξίδι <ChevronRight size={18} /></button>
          </div>

          <div className="pd4-art" aria-label="Ο εικονογραφημένος κόσμος του Πισιπούκ">
            <span className="pd4-spark s1">⭐</span><span className="pd4-spark s2">✨</span><span className="pd4-spark s3">🌈</span>
            <span className="pd4-owl" aria-hidden="true">🦉</span>
          </div>

          <div className="pd4-worlds">
            {WORLDS.map((w) => <button key={w.id} className={`pd4-world ${w.cls}`} onClick={() => open(w.id)}><div className="big" aria-hidden="true">{w.emoji}</div><h3>{w.title}</h3><p>{w.note}</p><span className="go"><ChevronRight size={22} /></span></button>)}
          </div>
        </main>
      </section>

      {panel !== "home" && (
        <section className="pd4-panel" role="dialog" aria-modal="true">
          <div className="pd4-panel-head">
            <button onClick={() => setPanel("home")}><ChevronLeft size={18} /> Πίσω</button>
            <h2>{panel === "games" ? "🎮 Παιχνίδια" : panel === "stories" ? "📚 Ιστορίες" : panel === "crafts" ? "✂️ Κατασκευές" : panel === "color" ? "🎨 Ζωγραφική" : panel === "move" ? "🤸 Κινούμαι" : "✨ Σημερινό ταξίδι"}</h2>
            <button className="close" onClick={() => setPanel("home")} aria-label="Κλείσιμο"><X size={20} /></button>
          </div>

          <div className="pd4-panel-body">
            {panel === "games" && <PreschoolGameLab age={age} />}

            {panel === "stories" && <div className="pd4-story-grid">{videos.map((v) => <article className="pd4-card" key={v.id}>{v.thumbnail ? <img src={v.thumbnail} alt="" /> : <div style={{fontSize:"5rem",textAlign:"center"}}>📺</div>}<h3>{v.title}</h3><p>{v.prompt}</p><p><b>Μετά:</b> {v.offlineMission}</p><button onClick={() => { if (v.providerKind === "youtube" && v.videoId) setVideoId(v.videoId); else if (v.externalUrl) window.open(v.externalUrl,"_blank","noopener,noreferrer"); }}>▶ Άνοιξε την ιστορία</button></article>)}</div>}

            {panel === "crafts" && <div className="pd4-craft-layout"><div className="pd4-craft-grid">{crafts.map((c) => <button key={c.id} className="pd4-card" onClick={() => setCraftId(c.id)}><div style={{fontSize:"4rem"}}>{c.emoji}</div><h3>{c.title}</h3><p>{c.minutes}′ • {c.level}</p></button>)}</div>{chosenCraft && <aside className="pd4-craft-detail"><div style={{fontSize:"5rem"}}>{chosenCraft.emoji}</div><h3>{chosenCraft.title}</h3><p><b>Δεξιότητα:</b> {chosenCraft.skill}</p><h4>Υλικά</h4><div className="pd4-chips">{chosenCraft.materials.map((m) => <span className="pd4-chip" key={m}>{m}</span>)}</div><h4>Βήματα</h4><ol>{chosenCraft.steps.map((s,i) => <li key={s}><b>{i+1}.</b> {s}</li>)}</ol></aside>}</div>}

            {panel === "color" && <div className="pd4-color-layout"><div className="pd4-canvas"><svg viewBox="0 0 640 520"><rect width="640" height="520" rx="32" fill="#dff6ff"/><circle cx="525" cy="95" r="58" fill={paint[0]} onClick={() => setPaint(p => p.map((x,i)=>i===0?paintColor:x))} style={{cursor:"pointer"}}/><path d="M0 400 Q150 330 300 405 T640 390 V520 H0Z" fill={paint[3]} onClick={() => setPaint(p => p.map((x,i)=>i===3?paintColor:x))} style={{cursor:"pointer"}}/><path d="M150 350 C115 210 340 195 360 345 C375 465 155 470 150 350Z" fill={paint[1]} stroke="#25295f" strokeWidth="12" onClick={() => setPaint(p => p.map((x,i)=>i===1?paintColor:x))} style={{cursor:"pointer"}}/><circle cx="215" cy="315" r="17" fill="#25295f"/><circle cx="300" cy="315" r="17" fill="#25295f"/><path d="M220 375 Q260 410 303 372" fill="none" stroke="#25295f" strokeWidth="12" strokeLinecap="round"/><path d="M150 270 Q65 185 100 120 Q170 145 210 220" fill={paint[2]} stroke="#25295f" strokeWidth="12" onClick={() => setPaint(p => p.map((x,i)=>i===2?paintColor:x))} style={{cursor:"pointer"}}/><path d="M360 270 Q450 190 430 118 Q355 145 310 220" fill={paint[4]} stroke="#25295f" strokeWidth="12" onClick={() => setPaint(p => p.map((x,i)=>i===4?paintColor:x))} style={{cursor:"pointer"}}/></svg></div><aside className="pd4-palette"><h3>Διάλεξε χρώμα</h3><div className="pd4-colors">{["#ff5f8f","#ffb627","#62c8ff","#71d99e","#9a7cff","#f66b4f","#35b96e","#7356f5","#ffd75a","#4d78ff"].map(c => <button aria-label={`Χρώμα ${c}`} key={c} className={`pd4-color ${paintColor===c?"is-active":""}`} style={{background:c}} onClick={() => setPaintColor(c)} />)}</div><h3>Σελίδες ζωγραφικής</h3><div className="pd4-coloring-list">{coloring.map(c => <div key={c.id}>{c.emoji} {c.title}</div>)}</div></aside></div>}

            {panel === "move" && <div className="pd4-move-grid">{MOVE_MISSIONS.map(([e,t,d]) => <article className="pd4-card" key={t}><div style={{fontSize:"4.5rem"}}>{e}</div><h3>{t}</h3><p>{d}</p><button onClick={() => trackEvent("preschool_move_start", { activity:t, age })}>Ξεκίνα ▶</button></article>)}</div>}

            {panel === "today" && <div className="pd4-today-panel"><div className="pd4-today-hero"><div style={{fontSize:"4rem"}}>⭐</div><h3>Το σημερινό ταξίδι</h3><p>Μικρή ολοκληρωμένη εμπειρία με αρχή, μέση και επιστροφή στον πραγματικό κόσμο.</p></div><div className="pd4-loop">{[["👀","Βλέπω","5–8′"],["🎮","Παίζω","4–7′"],["🎨","Δημιουργώ","8–15′"],["🤸","Κινούμαι","3–5′"]].map(([e,t,m]) => <div className="pd4-card" key={t}><div className="emoji">{e}</div><b>{t}</b><small>{m}</small></div>)}</div><button className="pd4-start-big" onClick={() => setPanel("stories")}><Play fill="currentColor" size={20}/> Ξεκινάμε τώρα <ChevronRight size={18}/></button></div>}
          </div>
        </section>
      )}

      {videoId && <div className="pd4-video" onClick={() => setVideoId(null)}><div className="pd4-video-inner" onClick={(e) => e.stopPropagation()}><div className="pd4-video-top"><button onClick={() => setVideoId(null)} aria-label="Κλείσιμο"><X /></button></div><iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`} allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div></div>}
    </div>
  );
}
