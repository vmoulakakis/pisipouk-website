import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, BarChart3, Gamepad2, HeartHandshake, Library, LockKeyhole, RotateCcw, Sparkles, X } from "lucide-react";
import { PreschoolV11Styled } from "@/components/preschool/PreschoolV11Styled";
import bearLogo from "@/assets/pisipouk-logo.webp";
import type { AgeBand, GameDef } from "./v13/gameCatalog";
import { AGE_INFO, GAMES } from "./v13/gameCatalog";
import { createGameScene } from "./v13/gameEngine";

type Stat = { plays: number; completions: number; retries: number; totalMs: number; lastPlayed: number };
type Stats = Record<string, Stat>;

function getStats(): Stats {
  try {
    return JSON.parse(localStorage.getItem("pisipouk-v13-game-stats") || "{}");
  } catch {
    return {};
  }
}

function persistStats(next: Stats) {
  try {
    localStorage.setItem("pisipouk-v13-game-stats", JSON.stringify(next));
  } catch {
    // Local stats are optional and parent-facing only.
  }
}

function GameCanvas({
  game,
  onClose,
  onComplete,
  onRetry,
}: {
  game: GameDef;
  onClose: () => void;
  onComplete: (ms: number) => void;
  onRetry: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const startedAt = useRef(Date.now());
  const [message, setMessage] = useState("Ο Πισιπούκ ετοιμάζει το παιχνίδι…");
  const [progress, setProgress] = useState({ value: 0, total: 1 });
  const [done, setDone] = useState(false);
  const [restart, setRestart] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    setDone(false);
    setError(null);
    setMessage("Ο Πισιπούκ ετοιμάζει το παιχνίδι…");
    setProgress({ value: 0, total: 1 });
    startedAt.current = Date.now();

    const B = (window as any).BABYLON;
    if (!B || !canvas.current) {
      setError("Ο 3D μηχανισμός δεν είναι διαθέσιμος. Δοκίμασε ανανέωση της σελίδας.");
      return;
    }

    try {
      cleanup = createGameScene(B, canvas.current, game, {
        onMessage: (value) => !cancelled && setMessage(value),
        onProgress: (value, total) => !cancelled && setProgress({ value, total }),
        onDone: () => {
          if (cancelled) return;
          setDone(true);
          onComplete(Date.now() - startedAt.current);
        },
        onMistake: () => !cancelled && onRetry(),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Το παιχνίδι δεν μπόρεσε να ξεκινήσει.");
    }

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [game.id, restart]);

  return (
    <div className="v13-play">
      <canvas ref={canvas} aria-label={`3D παιχνίδι ${game.title}`} />
      <div className="v13-game-top">
        <button onClick={onClose} aria-label="Έξοδος από το παιχνίδι"><X /> Έξοδος</button>
        <div className="v13-title-pill">
          <small>{AGE_INFO[game.age].label} • {game.domain}</small>
          <b>{game.title}</b>
        </div>
        <button onClick={() => setRestart(v => v + 1)} aria-label="Ξανά το παιχνίδι"><RotateCcw /> Ξανά</button>
      </div>

      <div className="v13-guide" aria-live="polite">
        <img src={bearLogo} alt="Πισιπούκ το αρκουδάκι" />
        <div>
          <b>Πισιπούκ</b>
          <p>{error || message}</p>
          {!error && <span>{Math.min(progress.value, progress.total)} / {progress.total}</span>}
        </div>
      </div>

      <div className="v13-parent-prompt">
        <HeartHandshake />
        <div>
          <b>Παίξτε μαζί, αν θέλετε</b>
          <span>{game.parentPrompt}</span>
        </div>
      </div>

      {done && (
        <div className="v13-done">
          <img src={bearLogo} alt="Πισιπούκ" />
          <h2>Ωραία εξερεύνηση!</h2>
          <p>Δεν χρειάζονται πόντοι. Μπορείς να ξαναπαίξεις και να δοκιμάσεις αλλιώς.</p>
          <div>
            <button onClick={() => setRestart(v => v + 1)}><RotateCcw /> Ξανά</button>
            <button className="primary" onClick={onClose}><Gamepad2 /> Άλλο παιχνίδι</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ParentStats({ stats, onClose }: { stats: Stats; onClose: () => void }) {
  const rows = GAMES.map(game => ({ game, stat: stats[game.id] })).filter(row => row.stat?.plays);
  return (
    <div className="v13-modal-back">
      <div className="v13-parent">
        <button className="v13-close" onClick={onClose} aria-label="Κλείσιμο"><X /></button>
        <div className="v13-parent-head">
          <BarChart3 />
          <div>
            <small>LOCAL-FIRST • ΧΩΡΙΣ ΟΝΟΜΑ ΠΑΙΔΙΟΥ</small>
            <h2>Στατιστικά παιχνιδιών</h2>
          </div>
        </div>
        <p>Τα στοιχεία μένουν μόνο στη συσκευή. Δεν είναι αναπτυξιακή αξιολόγηση· βοηθούν να βλέπεις τι επιλέγει το παιδί και ποια παιχνίδια χρειάζονται βελτίωση.</p>
        <div className="v13-stats">
          {rows.length ? rows.map(({ game, stat }) => (
            <div key={game.id}>
              <b>{AGE_INFO[game.age].label} · {game.title}</b>
              <span>{stat.plays} εκκινήσεις • {stat.completions} ολοκληρώσεις • {stat.retries} επαναπροσπάθειες • {Math.round(stat.totalMs / Math.max(1, stat.completions) / 1000)}s μ. χρόνος</span>
            </div>
          )) : (
            <div><b>Δεν υπάρχουν ακόμη δεδομένα.</b><span>Παίξτε ένα παιχνίδι και επιστρέψτε εδώ.</span></div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PreschoolGamesV13() {
  const [age, setAge] = useState<AgeBand>("2");
  const [game, setGame] = useState<GameDef | null>(null);
  const [legacy, setLegacy] = useState(false);
  const [parent, setParent] = useState(false);
  const [stats, setStats] = useState<Stats>(() => getStats());

  const games = useMemo(() => GAMES.filter(item => item.age === age), [age]);

  const startGame = (nextGame: GameDef) => {
    setStats(current => {
      const old = current[nextGame.id] || { plays: 0, completions: 0, retries: 0, totalMs: 0, lastPlayed: 0 };
      const next = {
        ...current,
        [nextGame.id]: { ...old, plays: old.plays + 1, lastPlayed: Date.now() },
      };
      persistStats(next);
      return next;
    });
    setGame(nextGame);
  };

  const complete = (ms: number) => {
    if (!game) return;
    setStats(current => {
      const old = current[game.id] || { plays: 1, completions: 0, retries: 0, totalMs: 0, lastPlayed: Date.now() };
      const next = {
        ...current,
        [game.id]: { ...old, completions: old.completions + 1, totalMs: old.totalMs + ms, lastPlayed: Date.now() },
      };
      persistStats(next);
      return next;
    });
  };

  const retry = () => {
    if (!game) return;
    setStats(current => {
      const old = current[game.id] || { plays: 1, completions: 0, retries: 0, totalMs: 0, lastPlayed: Date.now() };
      const next = {
        ...current,
        [game.id]: { ...old, retries: old.retries + 1, lastPlayed: Date.now() },
      };
      persistStats(next);
      return next;
    });
  };

  if (legacy) {
    return (
      <div className="v13-legacy">
        <button className="v13-back-library" onClick={() => setLegacy(false)}><ArrowLeft /> Παιχνίδια V13</button>
        <PreschoolV11Styled />
      </div>
    );
  }

  return (
    <div className="v13">
      <style>{CSS}</style>
      <header className="v13-top">
        <div className="v13-brand">
          <img src={bearLogo} alt="Πισιπούκ το αρκουδάκι" />
          <div><b>ΠΑΙΧΝΙΔΙΑ ΠΙΣΙΠΟΥΚ</b><small>V13 • AGE-FIRST PLAY LAB</small></div>
        </div>
        <div className="v13-actions">
          <button onClick={() => setLegacy(true)}><Library /> Υπόλοιπο Preschool</button>
          <button className="parent" onClick={() => setParent(true)}><LockKeyhole /> Γονείς</button>
        </div>
      </header>

      <main className="v13-main">
        <section className="v13-hero">
          <div className="v13-hero-bear"><img src={bearLogo} alt="Πισιπούκ" /></div>
          <div>
            <span className="v13-kicker"><Sparkles /> ΜΟΝΟ ΠΑΙΧΝΙΔΙΑ • ΝΕΑ ΗΛΙΚΙΑΚΗ ΛΟΓΙΚΗ</span>
            <h1>Πρώτα η ηλικία.<br /><em>Μετά το παιχνίδι.</em></h1>
            <p>Κατάργησα τη λογική «ένα παιχνίδι για όλους». Κάθε παιχνίδι ανήκει σε μία συγκεκριμένη αναπτυξιακή ηλικία και έχει δικό του interaction model.</p>
          </div>
        </section>

        <section className="v13-age-selector" aria-label="Επιλογή ηλικίας">
          {(Object.keys(AGE_INFO) as AgeBand[]).map(item => (
            <button key={item} className={age === item ? "on" : ""} onClick={() => setAge(item)}>
              <b>{AGE_INFO[item].label}</b>
              <span>{AGE_INFO[item].short}</span>
            </button>
          ))}
        </section>

        <section className="v13-age-principle">
          <Gamepad2 />
          <div><b>{AGE_INFO[age].label}</b><span>{AGE_INFO[age].principle}</span></div>
        </section>

        <section className="v13-grid" data-age={age}>
          {games.map(item => (
            <button className={`v13-card mode-${item.mode}`} key={item.id} onClick={() => startGame(item)}>
              <div className="v13-card-visual">
                <span>{item.icon}</span>
                <i>{item.mode}</i>
                <div className="hill one" />
                <div className="hill two" />
              </div>
              <small>{item.minutes} • {item.domain}</small>
              <h2>{item.title}</h2>
              <p>{item.subtitle}</p>
              <div className="v13-card-why"><b>Γιατί ταιριάζει στην ηλικία</b><span>{item.developmentalWhy}</span></div>
              <strong>ΠΑΙΖΩ →</strong>
            </button>
          ))}
        </section>
      </main>

      {game && <GameCanvas game={game} onClose={() => setGame(null)} onComplete={complete} onRetry={retry} />}
      {parent && <ParentStats stats={stats} onClose={() => setParent(false)} />}
    </div>
  );
}

const CSS = `
.v13{min-height:100svh;background:radial-gradient(circle at 88% 0,#dff8ff 0,transparent 34%),linear-gradient(180deg,#fffdf5,#eff9ff);color:#17205b;font-family:inherit}.v13 *{box-sizing:border-box}.v13 button{font:inherit;touch-action:manipulation}.v13-top{height:78px;width:min(1500px,calc(100% - 28px));margin:auto;display:flex;align-items:center;justify-content:space-between;gap:14px}.v13-brand{display:flex;align-items:center;gap:10px}.v13-brand img{width:56px;height:56px;object-fit:contain;border-radius:18px;background:white;box-shadow:0 10px 26px #21345b1b}.v13-brand b{display:block;font-size:.95rem}.v13-brand small{display:block;font-size:.62rem;color:#694be8;font-weight:950;letter-spacing:.1em}.v13-actions{display:flex;gap:8px}.v13-actions button{border:0;border-radius:17px;background:white;color:#17205b;padding:11px 14px;font-weight:900;display:flex;align-items:center;gap:7px;box-shadow:0 9px 24px #22355b14}.v13-actions .parent{background:#6549e6;color:white}.v13-main{width:min(1500px,calc(100% - 28px));margin:auto;padding-bottom:34px}.v13-hero{min-height:300px;border-radius:34px;background:linear-gradient(120deg,#fff 0 62%,#e3f8ff 62%);box-shadow:0 22px 60px #24365a17;display:grid;grid-template-columns:220px 1fr;align-items:center;overflow:hidden;padding:24px 34px}.v13-hero-bear{display:grid;place-items:center}.v13-hero-bear img{width:185px;height:185px;object-fit:contain;filter:drop-shadow(0 20px 18px #25375b28)}.v13-kicker{display:inline-flex;align-items:center;gap:7px;background:#fff1ac;border-radius:999px;padding:8px 13px;font-size:.68rem;font-weight:950}.v13 h1{font-size:clamp(3rem,5vw,6rem);line-height:.87;letter-spacing:-.055em;margin:14px 0;color:#5f43dc}.v13 h1 em{font-style:normal;color:#ff4f81}.v13-hero p{max-width:900px;margin:0;color:#586483;font-weight:740;line-height:1.5}.v13-age-selector{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:14px 0}.v13-age-selector button{border:0;border-radius:22px;background:white;color:#17205b;min-height:104px;padding:14px;text-align:left;box-shadow:0 10px 26px #23355b12}.v13-age-selector button:nth-child(1){background:#fff4bf}.v13-age-selector button:nth-child(2){background:#e8f8ff}.v13-age-selector button:nth-child(3){background:#f1eaff}.v13-age-selector button:nth-child(4){background:#eaf9e7}.v13-age-selector button.on{outline:3px solid #6849e8;box-shadow:0 12px 30px #4b3ca122}.v13-age-selector b{display:block;font-size:1.1rem}.v13-age-selector span{display:block;margin-top:5px;font-size:.69rem;color:#68728f;font-weight:800;line-height:1.35}.v13-age-principle{background:#17205b;color:white;border-radius:22px;padding:14px 17px;display:flex;align-items:center;gap:11px;margin-bottom:13px}.v13-age-principle b,.v13-age-principle span{display:block}.v13-age-principle span{font-size:.76rem;color:#e5e9ff;margin-top:2px}.v13-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:13px}.v13-card{border:0;border-radius:27px;background:white;color:#17205b;padding:12px;text-align:left;box-shadow:0 13px 34px #25365a16;cursor:pointer;transition:transform .18s ease}.v13-card:hover{transform:translateY(-4px)}.v13-card-visual{height:170px;border-radius:21px;background:linear-gradient(145deg,#bceeff,#fff1bd);position:relative;overflow:hidden;display:grid;place-items:center}.v13-card-visual>span{font-size:4.8rem;position:relative;z-index:4;filter:drop-shadow(0 13px 9px #334b6e25)}.v13-card-visual i{position:absolute;left:10px;top:10px;z-index:5;background:#ffffffdf;border-radius:999px;padding:5px 8px;font-size:.63rem;font-style:normal;font-weight:950}.v13-card-visual .hill{position:absolute;border-radius:50%}.v13-card-visual .hill.one{width:90%;height:55%;background:#70cf79;left:-20%;bottom:-25%;transform:rotate(-7deg)}.v13-card-visual .hill.two{width:70%;height:45%;background:#58c2ef;right:-25%;top:-20%;opacity:.78}.mode-Παίζω .v13-card-visual{background:linear-gradient(145deg,#dff4ff,#e9ddff)}.mode-Μαθαίνω .v13-card-visual{background:linear-gradient(145deg,#fff0bd,#dff6ff)}.mode-Μαζί .v13-card-visual{background:linear-gradient(145deg,#ffe2ec,#fff4c8)}.v13-card>small{display:block;margin:10px 3px 0;color:#684be7;font-size:.68rem;font-weight:900}.v13-card h2{font-size:1.12rem;margin:4px 3px}.v13-card>p{font-size:.76rem;color:#66718f;line-height:1.42;min-height:50px;margin:0 3px}.v13-card-why{margin-top:10px;border-top:1px solid #eeeef7;padding:9px 3px 0}.v13-card-why b,.v13-card-why span{display:block}.v13-card-why b{font-size:.65rem;color:#4e5670}.v13-card-why span{font-size:.66rem;color:#707991;line-height:1.35;margin-top:3px;min-height:53px}.v13-card strong{display:block;margin:10px 3px 2px;color:#6548e7;font-size:.74rem}.v13-play{position:fixed;inset:0;z-index:500;background:#bfeeff}.v13-play canvas{width:100%;height:100%;display:block;touch-action:none}.v13-game-top{position:absolute;top:max(12px,env(safe-area-inset-top));left:14px;right:14px;display:flex;justify-content:space-between;align-items:center;gap:10px;pointer-events:none}.v13-game-top>*{pointer-events:auto}.v13-game-top>button{min-height:46px;border:0;border-radius:17px;background:#ffffffef;color:#17205b;padding:10px 13px;font-weight:900;display:flex;align-items:center;gap:6px;box-shadow:0 10px 26px #27385c25}.v13-title-pill{background:#17205bec;color:white;border-radius:19px;padding:9px 15px;text-align:center;backdrop-filter:blur(12px)}.v13-title-pill small{display:block;color:#aee7ff;font-size:.62rem;font-weight:900}.v13-title-pill b{display:block}.v13-guide{position:absolute;left:14px;bottom:max(16px,calc(env(safe-area-inset-bottom) + 9px));display:flex;align-items:center;gap:9px;max-width:min(560px,calc(100% - 28px));background:#ffffffef;border-radius:22px;padding:8px 13px 8px 8px;box-shadow:0 14px 35px #26375e2e;backdrop-filter:blur(12px)}.v13-guide img{width:64px;height:64px;object-fit:contain;border-radius:17px}.v13-guide b{display:block;color:#6849e8}.v13-guide p{margin:2px 0;font-size:.8rem;line-height:1.35;font-weight:800}.v13-guide span{font-size:.68rem;color:#747c97;font-weight:900}.v13-parent-prompt{position:absolute;right:14px;bottom:max(16px,calc(env(safe-area-inset-bottom) + 9px));display:flex;gap:8px;align-items:center;max-width:390px;background:#17205be8;color:white;border-radius:20px;padding:10px 13px;backdrop-filter:blur(12px)}.v13-parent-prompt b,.v13-parent-prompt span{display:block}.v13-parent-prompt b{font-size:.7rem}.v13-parent-prompt span{font-size:.66rem;color:#e5e8ff;line-height:1.35}.v13-done{position:absolute;inset:0;background:#17205bc9;display:grid;place-content:center;justify-items:center;text-align:center;color:white;padding:20px;backdrop-filter:blur(8px)}.v13-done img{width:120px;height:120px;object-fit:contain}.v13-done h2{font-size:2.5rem;margin:5px 0}.v13-done p{max-width:530px;color:#e8ebff}.v13-done>div{display:flex;gap:8px}.v13-done button{border:0;border-radius:17px;background:white;color:#17205b;min-height:48px;padding:11px 15px;font-weight:900;display:flex;align-items:center;gap:6px}.v13-done .primary{background:#ffd64f}.v13-modal-back{position:fixed;inset:0;z-index:550;background:#11183fb5;display:grid;place-items:center;padding:18px;backdrop-filter:blur(8px)}.v13-parent{position:relative;width:min(880px,100%);max-height:92vh;overflow:auto;background:white;border-radius:28px;padding:24px}.v13-close{position:absolute;right:13px;top:13px;border:0;border-radius:50%;width:42px;height:42px;background:#eeeaff;color:#6849e8}.v13-parent-head{display:flex;align-items:center;gap:10px}.v13-parent-head svg{width:40px;height:40px;color:#6548e7}.v13-parent-head small{font-size:.62rem;color:#6b50e7;font-weight:950}.v13-parent-head h2{margin:2px 0}.v13-parent>p{color:#65708d;line-height:1.5}.v13-stats{display:grid;gap:8px}.v13-stats>div{background:#f5f3ff;border-radius:16px;padding:11px}.v13-stats b,.v13-stats span{display:block}.v13-stats span{font-size:.72rem;color:#69718e;margin-top:3px}.v13-legacy{min-height:100svh}.v13-back-library{position:fixed;z-index:999;left:14px;top:14px;border:0;border-radius:17px;background:#17205b;color:white;padding:11px 14px;font-weight:900;display:flex;align-items:center;gap:6px;box-shadow:0 12px 28px #0003}
@media(max-width:1100px){.v13-grid{grid-template-columns:repeat(2,1fr)}.v13-age-selector{grid-template-columns:repeat(2,1fr)}.v13-parent-prompt{display:none}}
@media(max-width:700px){.v13-top{height:66px;width:100%;padding:6px 9px;position:sticky;top:0;z-index:80;background:#effaff}.v13-brand img{width:44px;height:44px}.v13-brand b{font-size:.72rem}.v13-brand small{font-size:.5rem}.v13-actions button{min-width:44px;min-height:44px;padding:9px}.v13-actions button:first-child{font-size:0}.v13-actions .parent{display:none}.v13-main{width:calc(100% - 14px)}.v13-hero{grid-template-columns:92px 1fr;min-height:240px;padding:18px 14px;border-radius:25px}.v13-hero-bear img{width:90px;height:90px}.v13 h1{font-size:2.7rem}.v13-hero p{font-size:.82rem}.v13-kicker{font-size:.55rem}.v13-age-selector{grid-template-columns:1fr 1fr;gap:7px}.v13-age-selector button{min-height:90px;padding:11px}.v13-grid{grid-template-columns:1fr}.v13-card-visual{height:190px}.v13-game-top{align-items:flex-start}.v13-title-pill{max-width:52%;padding:8px 10px}.v13-title-pill b{font-size:.82rem}.v13-game-top>button{min-width:48px;font-size:.68rem;padding:8px}.v13-guide{left:8px;right:8px;max-width:none;bottom:max(8px,env(safe-area-inset-bottom));padding-right:9px}.v13-guide img{width:54px;height:54px}.v13-guide p{font-size:.72rem}.v13-done h2{font-size:2rem}}
@media(prefers-reduced-motion:reduce){.v13-card{transition:none}}
`;
