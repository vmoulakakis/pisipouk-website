import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, HeartHandshake, RotateCcw, Sparkles, Volume2, X } from "lucide-react";
import { MagicBear, type BearReaction } from "./MagicBear";
import type { MagicAge, MagicGameDef } from "./catalog";

type Point = { x: number; y: number };

function inRect(x: number, y: number, rect: DOMRect | null) {
  return !!rect && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function DragToken({
  children,
  className = "",
  disabled,
  onDrop,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onDrop: (x: number, y: number) => boolean;
  label: string;
}) {
  const [drag, setDrag] = useState<Point | null>(null);
  const origin = useRef<Point | null>(null);

  return (
    <button
      type="button"
      className={`pm-drag-token ${className} ${drag ? "is-dragging" : ""}`}
      aria-label={label}
      disabled={disabled}
      style={drag ? { transform: `translate3d(${drag.x}px,${drag.y}px,0) scale(1.08)`, zIndex: 80 } : undefined}
      onPointerDown={(event) => {
        if (disabled) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        origin.current = { x: event.clientX, y: event.clientY };
        setDrag({ x: 0, y: 0 });
      }}
      onPointerMove={(event) => {
        if (!origin.current || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
        setDrag({ x: event.clientX - origin.current.x, y: event.clientY - origin.current.y });
      }}
      onPointerUp={(event) => {
        if (!origin.current) return;
        const accepted = onDrop(event.clientX, event.clientY);
        origin.current = null;
        setDrag(null);
        if (!accepted) {
          event.currentTarget.animate(
            [
              { transform: "translateX(0)" },
              { transform: "translateX(-8px)" },
              { transform: "translateX(7px)" },
              { transform: "translateX(0)" },
            ],
            { duration: 260, easing: "ease-out" },
          );
        }
      }}
    >
      {children}
    </button>
  );
}

function Bead({ color, shape = "round" }: { color: string; shape?: "round" | "star" | "flower" }) {
  if (shape === "star") {
    return (
      <svg viewBox="0 0 80 80" className="pm-object-svg" aria-hidden="true">
        <defs>
          <radialGradient id={`bead-${color.replace("#", "")}`} cx="34%" cy="22%">
            <stop offset="0" stopColor="#fff" stopOpacity=".8" />
            <stop offset=".28" stopColor={color} />
            <stop offset="1" stopColor={color} stopOpacity=".78" />
          </radialGradient>
        </defs>
        <path d="M40 5 50 28 75 30 56 47 62 72 40 59 18 72 24 47 5 30 30 28Z" fill={`url(#bead-${color.replace("#", "")})`} stroke="#fff" strokeWidth="4" />
        <circle cx="40" cy="39" r="5" fill="#593b35" opacity=".5" />
      </svg>
    );
  }
  if (shape === "flower") {
    return (
      <svg viewBox="0 0 80 80" className="pm-object-svg" aria-hidden="true">
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <ellipse key={angle} cx="40" cy="18" rx="13" ry="21" fill={color} stroke="#fff" strokeWidth="3" transform={`rotate(${angle} 40 40)`} />
        ))}
        <circle cx="40" cy="40" r="14" fill="#ffd84d" stroke="#fff" strokeWidth="3" />
        <circle cx="40" cy="40" r="5" fill="#6b4d2e" opacity=".45" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 80" className="pm-object-svg" aria-hidden="true">
      <defs>
        <radialGradient id={`round-${color.replace("#", "")}`} cx="30%" cy="22%">
          <stop offset="0" stopColor="#fff" stopOpacity=".92" />
          <stop offset=".2" stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity=".72" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="30" fill={`url(#round-${color.replace("#", "")})`} stroke="#fff" strokeWidth="4" />
      <ellipse cx="29" cy="27" rx="8" ry="5" fill="#fff" opacity=".55" transform="rotate(-30 29 27)" />
      <circle cx="40" cy="40" r="5" fill="#5b3d3d" opacity=".42" />
    </svg>
  );
}

const FOOD = [
  { id: "apple", label: "μήλο", color: "#ef4655", healthy: true },
  { id: "banana", label: "μπανάνα", color: "#ffd646", healthy: true },
  { id: "carrot", label: "καρότο", color: "#ff8a2c", healthy: true },
  { id: "strawberry", label: "φράουλα", color: "#ef3f64", healthy: true },
  { id: "cookie", label: "μπισκότο", color: "#c98b57", healthy: false },
];

function FoodArt({ id }: { id: string }) {
  if (id === "apple") return (
    <svg viewBox="0 0 100 100" className="pm-object-svg" aria-hidden="true">
      <defs><radialGradient id="appleG" cx="30%" cy="25%"><stop stopColor="#ff8793"/><stop offset=".7" stopColor="#e9394c"/><stop offset="1" stopColor="#b92038"/></radialGradient></defs>
      <path d="M52 30c16-15 34 2 31 24-3 23-19 37-32 37S21 77 18 55c-3-23 15-39 34-25Z" fill="url(#appleG)" stroke="#9f2435" strokeWidth="3"/>
      <path d="M50 31c1-12 7-19 17-21" fill="none" stroke="#6a4931" strokeWidth="6" strokeLinecap="round"/>
      <path d="M59 20c11-9 23-6 27 2-11 7-20 8-27-2Z" fill="#4da85b"/>
      <ellipse cx="36" cy="46" rx="8" ry="5" fill="#fff" opacity=".38" transform="rotate(-25 36 46)"/>
    </svg>
  );
  if (id === "banana") return (
    <svg viewBox="0 0 100 100" className="pm-object-svg" aria-hidden="true">
      <path d="M22 19c13 47 39 57 66 28-4 36-35 52-58 34C12 67 10 42 22 19Z" fill="#ffd93d" stroke="#d99c13" strokeWidth="4"/>
      <path d="M24 18 18 11" stroke="#754d2f" strokeWidth="5" strokeLinecap="round"/>
      <path d="M85 48 92 43" stroke="#754d2f" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  );
  if (id === "carrot") return (
    <svg viewBox="0 0 100 100" className="pm-object-svg" aria-hidden="true">
      <path d="M49 30c16 0 26 7 21 22L45 91 28 48c-4-11 7-18 21-18Z" fill="#ff8a2c" stroke="#d66016" strokeWidth="3"/>
      <path d="M49 31c-7-13-2-22 6-25 6 11 5 18-6 25Z" fill="#4dab64"/>
      <path d="M46 31c-16-7-21-1-22 7 10 3 17 1 22-7Z" fill="#62bd70"/>
      <path d="M54 32c16-7 22-1 23 7-10 4-18 1-23-7Z" fill="#3d9b56"/>
    </svg>
  );
  if (id === "strawberry") return (
    <svg viewBox="0 0 100 100" className="pm-object-svg" aria-hidden="true">
      <path d="M50 22c23 0 35 14 29 34-5 18-20 31-29 38-11-8-26-22-30-40-4-18 9-32 30-32Z" fill="#ef4263" stroke="#bd2343" strokeWidth="3"/>
      <path d="M50 24c-10-14-19-8-24-2 9 8 16 8 24 2Zm0 0c10-14 19-8 24-2-9 8-16 8-24 2Z" fill="#49a95c"/>
      {[35,50,64].map((x,i)=><g key={x}><circle cx={x} cy={48+i*8} r="2.5" fill="#ffe66d"/><circle cx={x+7} cy={63-i*5} r="2.5" fill="#ffe66d"/></g>)}
    </svg>
  );
  return (
    <svg viewBox="0 0 100 100" className="pm-object-svg" aria-hidden="true">
      <circle cx="50" cy="50" r="34" fill="#c98b57" stroke="#9f663f" strokeWidth="4"/>
      {[34,48,62,42,58].map((x,i)=><circle key={i} cx={x} cy={34 + (i%3)*16} r="5" fill="#5d3628"/>)}
    </svg>
  );
}

function BasketArt({ color, label }: { color: string; label: string }) {
  return (
    <svg viewBox="0 0 150 125" className="pm-basket-svg" role="img" aria-label={label}>
      <defs>
        <linearGradient id={`basket-${color.replace("#","")}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff" stopOpacity=".45"/><stop offset=".25" stopColor={color}/><stop offset="1" stopColor={color} stopOpacity=".76"/>
        </linearGradient>
      </defs>
      <path d="M35 48 Q75 5 115 48" fill="none" stroke="#8b653e" strokeWidth="9" strokeLinecap="round"/>
      <path d="M20 47h110l-12 60H32Z" fill={`url(#basket-${color.replace("#","")})`} stroke="#6b4a34" strokeWidth="4"/>
      {[40,60,80,100].map(x=><path key={x} d={`M${x} 51 36 104`} stroke="#fff" strokeOpacity=".36" strokeWidth="3"/>)}
      <ellipse cx="75" cy="48" rx="57" ry="9" fill="#fff" opacity=".22"/>
    </svg>
  );
}

function AnimalArt({ animal, active }: { animal: "dog" | "cat" | "rabbit" | "bear"; active: boolean }) {
  const fur = animal === "dog" ? "#b8753e" : animal === "cat" ? "#8d92a4" : animal === "rabbit" ? "#f7efe8" : "#bb713f";
  const ear = animal === "rabbit" ? "M30 10 Q18 48 39 55 M70 10 Q82 48 61 55" : "M30 40 Q22 18 14 38 M70 40 Q78 18 86 38";
  return (
    <svg viewBox="0 0 100 105" className={`pm-animal-svg ${active ? "is-active" : ""}`} aria-hidden="true">
      <path d={ear} fill="none" stroke={fur} strokeWidth={animal === "rabbit" ? 15 : 18} strokeLinecap="round"/>
      <circle cx="50" cy="56" r="37" fill={fur} stroke="#fff" strokeWidth="4"/>
      <ellipse cx="50" cy="69" rx="21" ry="17" fill="#f4d3ae"/>
      <circle cx="38" cy="52" r="5" fill="#2c2230"/><circle cx="62" cy="52" r="5" fill="#2c2230"/>
      <circle cx="50" cy="66" r="6" fill="#33221d"/>
      <path d="M42 76 Q50 83 58 76" fill="none" stroke="#482821" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}

function GameFrame({
  game,
  reaction,
  necklace,
  message,
  progress,
  children,
  onClose,
  onReset,
}: {
  game: MagicGameDef;
  reaction: BearReaction;
  necklace?: string[];
  message: string;
  progress: string;
  children: React.ReactNode;
  onClose: () => void;
  onReset: () => void;
}) {
  return (
    <div className="pm-game-overlay" role="dialog" aria-label={game.title}>
      <div className="pm-game-sky" />
      <header className="pm-game-header">
        <button onClick={onClose} aria-label="Πίσω στα παιχνίδια"><ArrowLeft /> Παιχνίδια</button>
        <div><small>{game.domain}</small><strong>{game.title}</strong></div>
        <button onClick={onReset} aria-label="Ξεκινώ ξανά"><RotateCcw /> Ξανά</button>
      </header>
      <div className="pm-game-world">
        <div className="pm-game-bear">
          <MagicBear reaction={reaction} necklace={necklace} />
          <div className="pm-speech" aria-live="polite"><b>Πισιπούκ</b><span>{message}</span><i>{progress}</i></div>
        </div>
        <main className="pm-game-board">{children}</main>
      </div>
      <aside className="pm-parent-chip"><HeartHandshake/><span><b>Μαζί με τον γονέα</b>{game.parentPrompt}</span></aside>
    </div>
  );
}

function NecklaceGame({ game, onClose }: { game: MagicGameDef; onClose: () => void }) {
  const target = useRef<HTMLDivElement>(null);
  const colors = ["#ff4f85", "#ffd33f", "#4ebbf0", "#7a59e8", "#4fc982", "#ff9a48"];
  const shapes: ("round" | "star" | "flower")[] = ["round", "star", "round", "flower", "round", "star"];
  const [beads, setBeads] = useState<string[]>([]);
  const [phase, setPhase] = useState<"beads" | "tie" | "wear">("beads");
  const [message, setMessage] = useState("Πέρασε τις χάντρες στο κορδόνι. Διάλεξε όπως σου αρέσει!");
  const minBeads = 6;

  const reset = () => {
    setBeads([]);
    setPhase("beads");
    setMessage("Πέρασε τις χάντρες στο κορδόνι. Διάλεξε όπως σου αρέσει!");
  };

  const addBead = (color: string, x: number, y: number) => {
    if (!inRect(x, y, target.current?.getBoundingClientRect() || null) || phase !== "beads") return false;
    setBeads((current) => [...current, color].slice(0, 10));
    setMessage("Τέλεια! Η χάντρα πέρασε στο κορδόνι.");
    return true;
  };

  return (
    <GameFrame
      game={game}
      reaction={phase === "wear" ? "happy" : phase === "tie" ? "think" : "wave"}
      necklace={phase === "wear" ? beads : []}
      message={message}
      progress={phase === "wear" ? "Το δώρο σου είναι έτοιμο!" : `${beads.length} χάντρες`}
      onClose={onClose}
      onReset={reset}
    >
      <section className="pm-necklace-stage">
        <div className="pm-craft-table">
          <div className="pm-thread-target" ref={target} aria-label="Κορδόνι">
            <svg viewBox="0 0 560 210" aria-hidden="true">
              <path className={phase !== "beads" ? "is-tying" : ""} d="M62 55 Q280 245 498 55" fill="none" stroke="#f5e1bd" strokeWidth="9" strokeLinecap="round"/>
              <circle cx="62" cy="55" r="13" fill="#f5e1bd"/><circle cx="498" cy="55" r="13" fill="#f5e1bd"/>
            </svg>
            <div className={`pm-thread-beads ${phase === "wear" ? "is-flying" : ""}`}>
              {beads.map((color, index) => (
                <span key={index} style={{ "--bead-color": color } as React.CSSProperties}><Bead color={color} shape={shapes[index % shapes.length]} /></span>
              ))}
            </div>
            {beads.length < minBeads && <div className="pm-drop-hint"><Sparkles/> Άφησε εδώ μια χάντρα</div>}
          </div>

          <div className="pm-bead-bowls">
            {colors.map((color, index) => (
              <DragToken key={color} label="Χάντρα" disabled={phase !== "beads"} onDrop={(x,y) => addBead(color,x,y)}>
                <Bead color={color} shape={shapes[index]} />
              </DragToken>
            ))}
          </div>

          {beads.length >= minBeads && phase === "beads" && (
            <button className="pm-big-action" onClick={() => { setPhase("tie"); setMessage("Πιάσε τις δύο άκρες… και δένουμε το κολιέ!"); }}>
              <Check/> Δένω το κολιέ
            </button>
          )}
          {phase === "tie" && (
            <button className="pm-big-action pm-big-action--magic" onClick={() => { setPhase("wear"); setMessage("Το έφτιαξες! Κοίτα — το φοράω στον λαιμό μου!"); }}>
              <Sparkles/> Το δίνω στον Πισιπούκ
            </button>
          )}
          {phase === "wear" && <div className="pm-success-ribbon">✨ Μοναδικό κολιέ — φτιαγμένο από εσένα! ✨</div>}
        </div>
      </section>
    </GameFrame>
  );
}

function FeedGame({ game, age, onClose }: { game: MagicGameDef; age: MagicAge; onClose: () => void }) {
  const mouth = useRef<HTMLDivElement>(null);
  const [eaten, setEaten] = useState<string[]>([]);
  const [reaction, setReaction] = useState<BearReaction>("wave");
  const [message, setMessage] = useState(age === "2" ? "Δώσε μου ένα φρούτο!" : "Μπορείς να βρεις ένα υγιεινό φαγητό για το πικνίκ;");
  const goal = age === "2" ? 3 : 4;

  const reset = () => {
    setEaten([]);
    setReaction("wave");
    setMessage(age === "2" ? "Δώσε μου ένα φρούτο!" : "Μπορείς να βρεις ένα υγιεινό φαγητό για το πικνίκ;");
  };

  const dropFood = (food: typeof FOOD[number], x: number, y: number) => {
    if (!inRect(x,y,mouth.current?.getBoundingClientRect() || null)) return false;
    if (age !== "2" && !food.healthy) {
      setReaction("think");
      setMessage("Μμμ… αυτό είναι λιχουδιά. Ας βρούμε πρώτα κάτι που μεγαλώνει στη φύση!");
      setTimeout(()=>setReaction("idle"),650);
      return true;
    }
    setEaten(current => current.includes(food.id) ? current : [...current, food.id]);
    setReaction("eat");
    setMessage(`Νιαμ! ${food.label}! Τι άλλο να δοκιμάσουμε;`);
    setTimeout(()=>setReaction("happy"),500);
    return true;
  };

  const done = eaten.length >= goal;

  return (
    <GameFrame
      game={game}
      reaction={done ? "happy" : reaction}
      message={done ? "Χόρτασα! Έφτιαξες ένα πολύχρωμο πικνίκ." : message}
      progress={`${Math.min(eaten.length,goal)} / ${goal}`}
      onClose={onClose}
      onReset={reset}
    >
      <section className="pm-feed-stage">
        <div className="pm-feed-mouth" ref={mouth}><span>δώσε εδώ</span></div>
        <div className="pm-picnic-cloth">
          {FOOD.map((food) => (
            <DragToken key={food.id} disabled={done || eaten.includes(food.id)} label={food.label} onDrop={(x,y)=>dropFood(food,x,y)}>
              <FoodArt id={food.id}/>
              <span className="pm-object-label">{food.label}</span>
            </DragToken>
          ))}
        </div>
        {done && <div className="pm-success-ribbon">🥕 Δοκίμασες διαφορετικά φαγητά μαζί με τον Πισιπούκ.</div>}
      </section>
    </GameFrame>
  );
}

type SortObject = { id: string; color: "red" | "blue" | "yellow"; art: "apple" | "fish" | "sun"; label: string };
const SORT_OBJECTS: SortObject[] = [
  { id:"red-apple-1", color:"red", art:"apple", label:"κόκκινο μήλο" },
  { id:"blue-fish-1", color:"blue", art:"fish", label:"μπλε ψάρι" },
  { id:"yellow-sun-1", color:"yellow", art:"sun", label:"κίτρινος ήλιος" },
  { id:"red-apple-2", color:"red", art:"apple", label:"κόκκινο μήλο" },
  { id:"blue-fish-2", color:"blue", art:"fish", label:"μπλε ψάρι" },
  { id:"yellow-sun-2", color:"yellow", art:"sun", label:"κίτρινος ήλιος" },
];

function SortArt({ item }: { item: SortObject }) {
  if (item.art === "apple") return <FoodArt id="apple"/>;
  if (item.art === "fish") return (
    <svg viewBox="0 0 100 100" className="pm-object-svg" aria-hidden="true">
      <defs><linearGradient id="fishB" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#72d6ff"/><stop offset="1" stopColor="#267ddb"/></linearGradient></defs>
      <ellipse cx="45" cy="52" rx="31" ry="23" fill="url(#fishB)" stroke="#175cae" strokeWidth="3"/>
      <path d="M72 51 95 31 94 72Z" fill="#44a7ed" stroke="#175cae" strokeWidth="3"/>
      <circle cx="31" cy="46" r="5" fill="#fff"/><circle cx="31" cy="46" r="2.5" fill="#22304c"/>
      <path d="M25 62q12 8 24 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 100 100" className="pm-object-svg" aria-hidden="true">
      <g fill="#ffd644" stroke="#e49a10" strokeWidth="3">
        {[0,45,90,135].map(a=><rect key={a} x="45" y="4" width="10" height="24" rx="5" transform={`rotate(${a} 50 50)`}/>)}
        <circle cx="50" cy="50" r="27"/>
      </g>
      <circle cx="41" cy="46" r="3.5" fill="#4b341b"/><circle cx="59" cy="46" r="3.5" fill="#4b341b"/>
      <path d="M39 59q11 10 22 0" fill="none" stroke="#4b341b" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}

function BasketsGame({ game, onClose }: { game: MagicGameDef; onClose: () => void }) {
  const refs = {
    red: useRef<HTMLDivElement>(null),
    blue: useRef<HTMLDivElement>(null),
    yellow: useRef<HTMLDivElement>(null),
  };
  const [placed, setPlaced] = useState<string[]>([]);
  const [message, setMessage] = useState("Βάλε κάθε αντικείμενο στο καλάθι με το ίδιο χρώμα.");
  const [mistakes, setMistakes] = useState(0);

  const reset = () => { setPlaced([]); setMessage("Βάλε κάθε αντικείμενο στο καλάθι με το ίδιο χρώμα."); setMistakes(0); };

  const drop = (item: SortObject, x:number, y:number) => {
    const colors = Object.keys(refs) as SortObject["color"][];
    const landed = colors.find(color => inRect(x,y,refs[color].current?.getBoundingClientRect() || null));
    if (!landed) return false;
    if (landed !== item.color) {
      setMistakes(v=>v+1);
      setMessage("Κοίτα ξανά το χρώμα. Πού βλέπεις ένα ίδιο;");
      return true;
    }
    setPlaced(current => current.includes(item.id) ? current : [...current,item.id]);
    setMessage("Ναι! Ίδιο χρώμα — μπήκε στο καλάθι.");
    return true;
  };

  const done = placed.length === SORT_OBJECTS.length;
  return (
    <GameFrame
      game={game}
      reaction={done ? "happy" : mistakes > 1 ? "think" : "wave"}
      message={done ? "Τα ταξινόμησες όλα! Θέλεις να τα ανακατέψουμε ξανά;" : message}
      progress={`${placed.length} / ${SORT_OBJECTS.length}`}
      onClose={onClose}
      onReset={reset}
    >
      <section className="pm-sort-stage">
        <div className="pm-sort-objects">
          {SORT_OBJECTS.map(item => !placed.includes(item.id) && (
            <DragToken key={item.id} label={item.label} onDrop={(x,y)=>drop(item,x,y)}>
              <SortArt item={item}/>
            </DragToken>
          ))}
        </div>
        <div className="pm-basket-row">
          <div ref={refs.red} className="pm-basket-zone"><BasketArt color="#ef4860" label="Κόκκινο καλάθι"/><b>ΚΟΚΚΙΝΟ</b></div>
          <div ref={refs.blue} className="pm-basket-zone"><BasketArt color="#3c9fe8" label="Μπλε καλάθι"/><b>ΜΠΛΕ</b></div>
          <div ref={refs.yellow} className="pm-basket-zone"><BasketArt color="#ffd23f" label="Κίτρινο καλάθι"/><b>ΚΙΤΡΙΝΟ</b></div>
        </div>
        {done && <div className="pm-success-ribbon">🌈 Ο κήπος έγινε πολύχρωμος!</div>}
      </section>
    </GameFrame>
  );
}

const NOTES = [
  { id:"dog", animal:"dog" as const, hz:261.63, color:"#ff755c", name:"Ντο" },
  { id:"cat", animal:"cat" as const, hz:329.63, color:"#5ab5ec", name:"Μι" },
  { id:"rabbit", animal:"rabbit" as const, hz:392.0, color:"#f2a7cb", name:"Σολ" },
  { id:"bear", animal:"bear" as const, hz:523.25, color:"#8a62ea", name:"Ντο" },
];

function playTone(frequency:number) {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(.001,ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.18,ctx.currentTime+.025);
    gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.42);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime+.46);
    setTimeout(()=>ctx.close(),650);
  } catch {}
}

function MusicGame({ game, age, onClose }: { game: MagicGameDef; age: MagicAge; onClose: () => void }) {
  const [active,setActive] = useState<string | null>(null);
  const [freePlays,setFreePlays] = useState(0);
  const [challenge,setChallenge] = useState(false);
  const [target,setTarget] = useState<string[]>([]);
  const [input,setInput] = useState<string[]>([]);
  const [message,setMessage] = useState("Άγγιξε τα ζωάκια και άκουσε τη μπάντα!");
  const canChallenge = age !== "2";

  const hit = (id:string) => {
    const note = NOTES.find(n=>n.id===id)!;
    playTone(note.hz);
    setActive(id);
    setTimeout(()=>setActive(null),360);
    setFreePlays(v=>v+1);
    if (challenge) {
      const next=[...input,id];
      setInput(next);
      if (target.slice(0,next.length).some((v,i)=>v!==next[i])) {
        setMessage("Άκου ξανά. Δεν πειράζει — ο ρυθμός περιμένει!");
        setInput([]);
        return;
      }
      if (next.length===target.length) {
        setMessage("Το έπαιξες! Τώρα φτιάξε δικό σου ρυθμό.");
        setChallenge(false);
        setInput([]);
      }
    }
  };

  const newChallenge=()=>{
    const len=age==="3"?2:age==="4"?3:4;
    const seq=Array.from({length:len},(_,i)=>NOTES[(i*2+freePlays)%NOTES.length].id);
    setTarget(seq); setInput([]); setChallenge(true); setMessage("Άκου τον ρυθμό και παίξ' τον μετά!");
    seq.forEach((id,i)=>setTimeout(()=>{ const n=NOTES.find(x=>x.id===id)!; playTone(n.hz); setActive(id); setTimeout(()=>setActive(null),230); },i*520));
  };

  const reset=()=>{setActive(null);setFreePlays(0);setChallenge(false);setTarget([]);setInput([]);setMessage("Άγγιξε τα ζωάκια και άκουσε τη μπάντα!");};

  return (
    <GameFrame game={game} reaction={active ? "dance" : freePlays>4 ? "happy":"wave"} message={message} progress={challenge?`${input.length} / ${target.length}`:`${freePlays} ήχοι`} onClose={onClose} onReset={reset}>
      <section className="pm-music-stage">
        <div className="pm-stage-lights"><i/><i/><i/><i/></div>
        <div className="pm-band">
          {NOTES.map((note,index)=>(
            <button key={note.id} className={`pm-musician ${active===note.id?"is-playing":""}`} onClick={()=>hit(note.id)} style={{"--music-color":note.color} as React.CSSProperties}>
              <AnimalArt animal={note.animal} active={active===note.id}/>
              <div className="pm-instrument">
                {index===0 && <><span className="drum"/><b>🥁</b></>}
                {index===1 && <><span className="keys"/><b>♪</b></>}
                {index===2 && <><span className="tamb"/><b>✦</b></>}
                {index===3 && <><span className="bell"/><b>♫</b></>}
              </div>
              <span>{note.name}</span>
            </button>
          ))}
        </div>
        <div className="pm-music-actions">
          <button onClick={()=>NOTES.forEach((note,i)=>setTimeout(()=>hit(note.id),i*260))}><Volume2/> Παίζει η μπάντα</button>
          {canChallenge && <button className="primary" onClick={newChallenge}><Sparkles/> Αντέγραψε τον ρυθμό</button>}
        </div>
      </section>
    </GameFrame>
  );
}

export function MagicGamePlayer({ game, age, onClose }: { game: MagicGameDef; age: MagicAge; onClose: () => void }) {
  if (game.id === "necklace") return <NecklaceGame game={game} onClose={onClose}/>;
  if (game.id === "feed") return <FeedGame game={game} age={age} onClose={onClose}/>;
  if (game.id === "baskets") return <BasketsGame game={game} onClose={onClose}/>;
  return <MusicGame game={game} age={age} onClose={onClose}/>;
}
