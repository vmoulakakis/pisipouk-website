import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/pisipoukApi";

type Age = "2-3" | "4-5" | "5-6";

const AGES: Array<{ id: Age; label: string }> = [
  { id: "2-3", label: "2–3 ετών" },
  { id: "4-5", label: "4–5 ετών" },
  { id: "5-6", label: "5–6 ετών" },
];

const GAME_META = {
  puzzle: { emoji: "🧩", title: "Puzzle", subtitle: "Βάλε τα κομμάτια στη σωστή σειρά." },
  memory: { emoji: "🧠", title: "Memory", subtitle: "Βρες όλα τα ίδια ζευγάρια." },
  maze: { emoji: "🗺️", title: "Λαβύρινθος", subtitle: "Βοήθησε τον Πισιπούκ να φτάσει στον στόχο." },
  dots: { emoji: "🔢", title: "Ένωσε τις τελείες", subtitle: "Πάτησε τους αριθμούς με τη σωστή σειρά." },
  matching: { emoji: "🔗", title: "Αντιστοίχιση", subtitle: "Ταίριαξε κάθε εικόνα με τη σωστή κατηγορία." },
  scene: { emoji: "🌈", title: "Φτιάξε τη σκηνή σου", subtitle: "Διάλεξε αυτοκόλλητο και τοποθέτησέ το στη σκηνή." },
} as const;

type GameId = keyof typeof GAME_META;

function isAge(value: unknown): value is Age {
  return value === "2-3" || value === "4-5" || value === "5-6";
}

export const Route = createFileRoute("/learning-games/$gameId")({
  validateSearch: (search: Record<string, unknown>) => ({
    age: isAge(search.age) ? search.age : ("2-3" as Age),
  }),
  head: ({ params }) => {
    const meta = GAME_META[params.gameId as GameId];
    return {
      meta: [
        { title: meta ? meta.title + " | Μαθησιακά Παιχνίδια Πισιπούκ" : "Μαθησιακά Παιχνίδια | Ο Πισιπούκ" },
        {
          name: "description",
          content: meta
            ? meta.subtitle + " Δωρεάν online δραστηριότητα για παιδιά 2–6 ετών."
            : "Δωρεάν online μαθησιακά παιχνίδια για παιδιά 2–6 ετών.",
        },
      ],
    };
  },
  component: LearningGamePage,
});

function LearningGamePage() {
  const { gameId } = Route.useParams();
  const { age } = Route.useSearch();
  const meta = GAME_META[gameId as GameId];

  useEffect(() => {
    if (meta) trackEvent("game_start", { game: "learning_" + gameId, age });
  }, [age, gameId, meta]);

  if (!meta) {
    return (
      <SiteLayout>
        <section className="py-16">
          <div className="mx-auto max-w-xl px-4 text-center">
            <div className="text-6xl">🧩</div>
            <h1 className="mt-4 text-3xl font-black">Το παιχνίδι δεν βρέθηκε</h1>
            <Link to="/learning-games" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 font-black text-primary-foreground">
              Όλα τα παιχνίδια
            </Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="bg-gradient-to-b from-sky-50 via-white to-amber-50 py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/learning-games" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-[#0b3b82] shadow-sm">
              ← Παιχνίδια
            </Link>
            <Link to="/virtual-preschool" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-[#0b3b82] shadow-sm">
              Ζωγραφική & Κατασκευές
            </Link>
          </div>

          <div className="mt-7 text-center">
            <div className="text-6xl" aria-hidden="true">{meta.emoji}</div>
            <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-primary">Μαθαίνω παίζοντας</p>
            <h1 className="mt-2 text-4xl font-black text-[#0b3b82] sm:text-5xl">{meta.title}</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">{meta.subtitle}</p>
          </div>

          <div className="mx-auto mt-6 grid max-w-2xl grid-cols-3 gap-2 rounded-[1.5rem] border bg-white p-2 shadow-sm">
            {AGES.map((item) => (
              <Link
                key={item.id}
                to="/learning-games/$gameId"
                params={{ gameId }}
                search={{ age: item.id }}
                className={
                  "flex min-h-12 items-center justify-center rounded-xl px-2 py-2 text-center text-sm font-black transition " +
                  (age === item.id ? "bg-primary text-primary-foreground" : "bg-slate-50 text-slate-700 hover:bg-slate-100")
                }
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-7 rounded-[2rem] border bg-white p-4 shadow-sm sm:p-7">
            <GameRenderer key={gameId + "-" + age} gameId={gameId as GameId} age={age} />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function GameRenderer({ gameId, age }: { gameId: GameId; age: Age }) {
  if (gameId === "puzzle") return <PuzzleGame age={age} />;
  if (gameId === "memory") return <MemoryGame age={age} />;
  if (gameId === "maze") return <MazeGame age={age} />;
  if (gameId === "dots") return <DotsGame age={age} />;
  if (gameId === "matching") return <MatchingGame age={age} />;
  return <SceneGame age={age} />;
}

const PUZZLE_DATA: Record<Age, { target: string[]; start: string[] }> = {
  "2-3": {
    target: ["☀️", "🌳", "🐻", "🏠"],
    start: ["🐻", "☀️", "🏠", "🌳"],
  },
  "4-5": {
    target: ["☀️", "☁️", "🌳", "🐻", "🌼", "🏠"],
    start: ["🌼", "☀️", "🏠", "☁️", "🐻", "🌳"],
  },
  "5-6": {
    target: ["☀️", "☁️", "🌈", "🌳", "🐻", "🌼", "🚲", "🦋", "🏠"],
    start: ["🦋", "☀️", "🏠", "🌳", "🚲", "☁️", "🌼", "🌈", "🐻"],
  },
};

function PuzzleGame({ age }: { age: Age }) {
  const config = PUZZLE_DATA[age];
  const [tiles, setTiles] = useState(config.start);
  const [selected, setSelected] = useState<number | null>(null);
  const solved = tiles.every((tile, index) => tile === config.target[index]);

  const choose = (index: number) => {
    if (solved) return;
    if (selected === null) {
      setSelected(index);
      return;
    }
    if (selected === index) {
      setSelected(null);
      return;
    }
    setTiles((current) => {
      const next = [...current];
      [next[selected], next[index]] = [next[index], next[selected]];
      return next;
    });
    setSelected(null);
  };

  return (
    <div>
      <div className="rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">Στόχος</p>
        <div className="mt-2 flex flex-wrap gap-2 text-3xl">
          {config.target.map((item, index) => <span key={index} className="rounded-xl border bg-white p-2">{item}</span>)}
        </div>
      </div>
      <p className="mt-4 text-sm font-bold text-slate-700">Πάτησε δύο κομμάτια για να αλλάξουν θέση.</p>
      <div className={"mt-4 grid gap-3 " + (age === "2-3" ? "grid-cols-2" : "grid-cols-3")}>
        {tiles.map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={() => choose(index)}
            className={
              "aspect-square rounded-2xl border-2 bg-white text-5xl shadow-sm transition " +
              (selected === index ? "border-primary ring-4 ring-primary/15" : "border-slate-200 hover:border-primary/50")
            }
            aria-pressed={selected === index}
          >
            {item}
          </button>
        ))}
      </div>
      <GameFooter
        complete={solved}
        message={solved ? "Μπράβο! Το puzzle μπήκε στη σωστή σειρά. 🎉" : "Βρες τη σειρά που βλέπεις στον στόχο."}
        onReset={() => { setTiles(config.start); setSelected(null); }}
      />
    </div>
  );
}

function deterministicDeck(values: string[]) {
  const deck = [...values, ...values];
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapWith = (index * 3 + values.length) % (index + 1);
    [deck[index], deck[swapWith]] = [deck[swapWith], deck[index]];
  }
  return deck;
}

const MEMORY_VALUES: Record<Age, string[]> = {
  "2-3": ["🐻", "🍎", "☀️"],
  "4-5": ["🐻", "🍎", "☀️", "🚗"],
  "5-6": ["🐻", "🍎", "☀️", "🚗", "🦋", "🚀"],
};

function MemoryGame({ age }: { age: Age }) {
  const values = MEMORY_VALUES[age];
  const deck = useMemo(() => deterministicDeck(values), [age]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [first, second] = flipped;
    const timer = window.setTimeout(() => {
      if (deck[first] === deck[second]) {
        setMatched((current) => Array.from(new Set([...current, first, second])));
      }
      setFlipped([]);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [deck, flipped]);

  const reveal = (index: number) => {
    if (flipped.length >= 2 || flipped.includes(index) || matched.includes(index)) return;
    setFlipped((current) => {
      const next = [...current, index];
      if (next.length === 2) setMoves((value) => value + 1);
      return next;
    });
  };

  const complete = matched.length === deck.length;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-700">Βρες τα ίδια ζευγάρια.</p>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">Κινήσεις: {moves}</span>
      </div>
      <div className={"mt-5 grid gap-3 " + (deck.length <= 6 ? "grid-cols-3" : deck.length <= 8 ? "grid-cols-4" : "grid-cols-4 sm:grid-cols-6")}>
        {deck.map((item, index) => {
          const open = flipped.includes(index) || matched.includes(index);
          return (
            <button
              key={index}
              type="button"
              onClick={() => reveal(index)}
              className={
                "aspect-square rounded-2xl border text-4xl font-black shadow-sm transition " +
                (open ? "bg-amber-50 border-amber-200" : "bg-[#0b3b82] border-[#0b3b82] text-white")
              }
              aria-label={open ? "Κάρτα " + item : "Κλειστή κάρτα"}
            >
              {open ? item : "?"}
            </button>
          );
        })}
      </div>
      <GameFooter
        complete={complete}
        message={complete ? "Τα βρήκες όλα! Εξαιρετική μνήμη. ⭐" : "Θυμήσου πού κρύβεται κάθε εικόνα."}
        onReset={() => { setFlipped([]); setMatched([]); setMoves(0); }}
      />
    </div>
  );
}

type MatchItem = { id: string; emoji: string; label: string; category: string };

const MATCHING: Record<Age, { categories: string[]; items: MatchItem[] }> = {
  "2-3": {
    categories: ["Φρούτα", "Ζώα", "Οχήματα"],
    items: [
      { id: "apple", emoji: "🍎", label: "Μήλο", category: "Φρούτα" },
      { id: "banana", emoji: "🍌", label: "Μπανάνα", category: "Φρούτα" },
      { id: "dog", emoji: "🐶", label: "Σκυλάκι", category: "Ζώα" },
      { id: "cat", emoji: "🐱", label: "Γατούλα", category: "Ζώα" },
      { id: "car", emoji: "🚗", label: "Αυτοκίνητο", category: "Οχήματα" },
      { id: "bus", emoji: "🚌", label: "Λεωφορείο", category: "Οχήματα" },
    ],
  },
  "4-5": {
    categories: ["Ουρανός", "Θάλασσα", "Κήπος"],
    items: [
      { id: "sun", emoji: "☀️", label: "Ήλιος", category: "Ουρανός" },
      { id: "cloud", emoji: "☁️", label: "Σύννεφο", category: "Ουρανός" },
      { id: "fish", emoji: "🐟", label: "Ψάρι", category: "Θάλασσα" },
      { id: "octopus", emoji: "🐙", label: "Χταπόδι", category: "Θάλασσα" },
      { id: "bee", emoji: "🐝", label: "Μέλισσα", category: "Κήπος" },
      { id: "flower", emoji: "🌼", label: "Λουλούδι", category: "Κήπος" },
    ],
  },
  "5-6": {
    categories: ["Θάλασσα", "Δάσος", "Πάγος"],
    items: [
      { id: "dolphin", emoji: "🐬", label: "Δελφίνι", category: "Θάλασσα" },
      { id: "whale", emoji: "🐋", label: "Φάλαινα", category: "Θάλασσα" },
      { id: "fox", emoji: "🦊", label: "Αλεπού", category: "Δάσος" },
      { id: "deer", emoji: "🦌", label: "Ελάφι", category: "Δάσος" },
      { id: "penguin", emoji: "🐧", label: "Πιγκουίνος", category: "Πάγος" },
      { id: "bear", emoji: "🐻‍❄️", label: "Πολική αρκούδα", category: "Πάγος" },
    ],
  },
};

function MatchingGame({ age }: { age: Age }) {
  const config = MATCHING[age];
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [message, setMessage] = useState("Διάλεξε μία εικόνα και μετά την κατηγορία της.");

  const chooseCategory = (category: string) => {
    if (!selected) {
      setMessage("Πρώτα διάλεξε μία εικόνα.");
      return;
    }
    const item = config.items.find((entry) => entry.id === selected);
    if (!item) return;
    if (item.category === category) {
      setDone((current) => [...current, item.id]);
      setMessage("Σωστά! " + item.label + " → " + category + " ✅");
      setSelected(null);
    } else {
      setMessage("Δοκίμασε ξανά. Σε ποια ομάδα ανήκει το " + item.label + ";");
    }
  };

  const complete = done.length === config.items.length;

  return (
    <div>
      <p className="text-sm font-bold text-slate-700">1. Διάλεξε εικόνα · 2. Πάτησε τη σωστή κατηγορία.</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {config.items.map((item) => {
          const isDone = done.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              disabled={isDone}
              onClick={() => setSelected(item.id)}
              className={
                "min-h-28 rounded-2xl border p-3 text-center transition " +
                (isDone ? "bg-emerald-50 opacity-60" : selected === item.id ? "border-primary bg-primary/5 ring-2 ring-primary" : "bg-white hover:border-primary/40")
              }
            >
              <div className="text-4xl">{item.emoji}</div>
              <div className="mt-2 text-sm font-black">{item.label}</div>
            </button>
          );
        })}
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {config.categories.map((category) => (
          <Button key={category} type="button" variant="outline" className="min-h-12 rounded-xl" onClick={() => chooseCategory(category)}>
            {category}
          </Button>
        ))}
      </div>
      <GameFooter
        complete={complete}
        message={complete ? "Όλες οι αντιστοιχίσεις είναι σωστές! 🎉" : message}
        onReset={() => { setSelected(null); setDone([]); setMessage("Διάλεξε μία εικόνα και μετά την κατηγορία της."); }}
      />
    </div>
  );
}

type Point = { x: number; y: number };

const DOTS: Record<Age, Point[]> = {
  "2-3": [
    { x: 120, y: 300 }, { x: 180, y: 170 }, { x: 300, y: 110 },
    { x: 420, y: 170 }, { x: 480, y: 300 }, { x: 300, y: 340 },
  ],
  "4-5": [
    { x: 100, y: 300 }, { x: 135, y: 190 }, { x: 220, y: 120 }, { x: 320, y: 90 }, { x: 420, y: 125 },
    { x: 500, y: 210 }, { x: 470, y: 320 }, { x: 370, y: 355 }, { x: 255, y: 345 }, { x: 160, y: 330 },
  ],
  "5-6": [
    { x: 95, y: 300 }, { x: 120, y: 220 }, { x: 165, y: 150 }, { x: 230, y: 105 }, { x: 305, y: 85 },
    { x: 385, y: 105 }, { x: 455, y: 150 }, { x: 505, y: 220 }, { x: 520, y: 300 }, { x: 470, y: 350 },
    { x: 390, y: 330 }, { x: 320, y: 370 }, { x: 250, y: 330 }, { x: 170, y: 350 }, { x: 110, y: 325 },
  ],
};

function DotsGame({ age }: { age: Age }) {
  const points = DOTS[age];
  const [next, setNext] = useState(0);
  const [hint, setHint] = useState("Ξεκίνα από το 1.");

  const choose = (index: number) => {
    if (index !== next) {
      setHint("Ψάξε το " + (next + 1) + ".");
      return;
    }
    setNext((value) => value + 1);
    setHint(index === points.length - 1 ? "Ολοκληρώθηκε!" : "Τώρα βρες το " + (index + 2) + ".");
  };

  const complete = next === points.length;

  return (
    <div>
      <p className="text-sm font-bold text-slate-700">{hint}</p>
      <div className="mt-4 overflow-hidden rounded-2xl border bg-gradient-to-b from-sky-50 to-amber-50">
        <svg viewBox="0 0 600 420" className="h-auto w-full" aria-label="Παιχνίδι ένωσε τις τελείες">
          {points.slice(1, next).map((point, index) => {
            const previous = points[index];
            return <line key={index} x1={previous.x} y1={previous.y} x2={point.x} y2={point.y} stroke="#0b3b82" strokeWidth="7" strokeLinecap="round" />;
          })}
          {points.map((point, index) => {
            const active = index < next;
            return (
              <g
                key={index}
                role="button"
                tabIndex={0}
                aria-label={"Τελεία " + (index + 1)}
                onClick={() => choose(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    choose(index);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <circle cx={point.x} cy={point.y} r="25" fill={active ? "#0b3b82" : "#ffffff"} stroke="#0b3b82" strokeWidth="4" />
                <text x={point.x} y={point.y + 7} textAnchor="middle" fontSize="21" fontWeight="800" fill={active ? "#ffffff" : "#0b3b82"}>
                  {index + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <GameFooter complete={complete} message={complete ? "Μπράβο! Ένωσες όλες τις τελείες. ⭐" : hint} onReset={() => { setNext(0); setHint("Ξεκίνα από το 1."); }} />
    </div>
  );
}

type Cell = [number, number];

const MAZES: Record<Age, { size: number; path: Cell[] }> = {
  "2-3": {
    size: 5,
    path: [[0,0],[0,1],[1,1],[2,1],[2,2],[2,3],[1,3],[1,4],[2,4],[3,4],[4,4]],
  },
  "4-5": {
    size: 6,
    path: [[0,0],[1,0],[1,1],[1,2],[0,2],[0,3],[1,3],[2,3],[2,2],[3,2],[4,2],[4,3],[4,4],[3,4],[3,5],[4,5],[5,5]],
  },
  "5-6": {
    size: 7,
    path: [[0,0],[0,1],[1,1],[2,1],[2,2],[3,2],[3,1],[4,1],[4,2],[4,3],[3,3],[2,3],[2,4],[1,4],[1,5],[2,5],[3,5],[4,5],[5,5],[5,4],[6,4],[6,5],[6,6]],
  },
};

function MazeGame({ age }: { age: Age }) {
  const config = MAZES[age];
  const [position, setPosition] = useState<Cell>(config.path[0]);
  const [message, setMessage] = useState("Οδήγησε τον Πισιπούκ μέχρι την τσάντα 🎒.");
  const allowed = useMemo(() => new Set(config.path.map(([row, col]) => row + "-" + col)), [config.path]);
  const goal = config.path[config.path.length - 1];
  const complete = position[0] === goal[0] && position[1] === goal[1];

  const move = (dr: number, dc: number) => {
    if (complete) return;
    const next: Cell = [position[0] + dr, position[1] + dc];
    if (!allowed.has(next[0] + "-" + next[1])) {
      setMessage("Εκεί έχει τοίχο. Δοκίμασε άλλη κατεύθυνση.");
      return;
    }
    setPosition(next);
    if (next[0] === goal[0] && next[1] === goal[1]) setMessage("Έφτασες! Μπράβο! 🎉");
    else setMessage("Συνέχισε — είσαι στον σωστό δρόμο.");
  };

  return (
    <div>
      <p className="text-sm font-bold text-slate-700">{message}</p>
      <div
        className="mx-auto mt-5 grid max-w-xl gap-1 rounded-2xl bg-slate-200 p-2"
        style={{ gridTemplateColumns: "repeat(" + config.size + ", minmax(0, 1fr))" }}
      >
        {Array.from({ length: config.size * config.size }).map((_, index) => {
          const row = Math.floor(index / config.size);
          const col = index % config.size;
          const open = allowed.has(row + "-" + col);
          const here = position[0] === row && position[1] === col;
          const finish = goal[0] === row && goal[1] === col;
          return (
            <div
              key={index}
              className={
                "flex aspect-square items-center justify-center rounded-lg text-xl sm:text-2xl " +
                (open ? "bg-white" : "bg-slate-500")
              }
              aria-hidden={!here && !finish}
            >
              {here ? "🐻" : finish ? "🎒" : ""}
            </div>
          );
        })}
      </div>
      <div className="mx-auto mt-5 grid w-48 grid-cols-3 gap-2">
        <span />
        <Button type="button" variant="outline" className="h-12 text-xl" onClick={() => move(-1, 0)} aria-label="Πάνω">↑</Button>
        <span />
        <Button type="button" variant="outline" className="h-12 text-xl" onClick={() => move(0, -1)} aria-label="Αριστερά">←</Button>
        <Button type="button" variant="outline" className="h-12 text-xl" onClick={() => move(1, 0)} aria-label="Κάτω">↓</Button>
        <Button type="button" variant="outline" className="h-12 text-xl" onClick={() => move(0, 1)} aria-label="Δεξιά">→</Button>
      </div>
      <GameFooter complete={complete} message={complete ? "Ο Πισιπούκ βρήκε την τσάντα του! 🎒⭐" : message} onReset={() => { setPosition(config.path[0]); setMessage("Οδήγησε τον Πισιπούκ μέχρι την τσάντα 🎒."); }} />
    </div>
  );
}

const SCENE_STICKERS: Record<Age, string[]> = {
  "2-3": ["☀️", "🌳", "🐻", "🌼", "☁️", "🦋"],
  "4-5": ["☀️", "🌳", "🐻", "🌼", "☁️", "🦋", "🏠", "🚲"],
  "5-6": ["☀️", "🌳", "🐻", "🌼", "☁️", "🦋", "🏠", "🚲", "🐦", "🌈"],
};

function SceneGame({ age }: { age: Age }) {
  const stickers = SCENE_STICKERS[age];
  const [selected, setSelected] = useState(stickers[0]);
  const [cells, setCells] = useState<Array<string | null>>(Array(12).fill(null));

  const place = (index: number) => {
    setCells((current) => {
      const next = [...current];
      next[index] = selected === "🧽" ? null : selected;
      return next;
    });
  };

  return (
    <div>
      <p className="text-sm font-bold text-slate-700">Διάλεξε αυτοκόλλητο και μετά πάτησε ένα τετράγωνο στη σκηνή.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {[...stickers, "🧽"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSelected(item)}
            aria-pressed={selected === item}
            className={
              "flex h-12 w-12 items-center justify-center rounded-xl border text-2xl transition " +
              (selected === item ? "border-primary bg-primary/10 ring-2 ring-primary" : "bg-white")
            }
            aria-label={item === "🧽" ? "Γόμα" : "Αυτοκόλλητο " + item}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2 rounded-2xl border bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-100 p-3">
        {cells.map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={() => place(index)}
            className="aspect-square rounded-xl border border-white/80 bg-white/40 text-3xl backdrop-blur-sm hover:bg-white/65 sm:text-4xl"
            aria-label={"Θέση " + (index + 1)}
          >
            {item ?? ""}
          </button>
        ))}
      </div>
      <GameFooter
        complete={cells.filter(Boolean).length >= Math.min(6, stickers.length)}
        message={cells.filter(Boolean).length >= Math.min(6, stickers.length) ? "Υπέροχη σκηνή! Μπορείς να συνεχίσεις να τη διακοσμείς. 🌈" : "Γέμισε τη σκηνή με ό,τι φαντάζεσαι."}
        onReset={() => { setCells(Array(12).fill(null)); setSelected(stickers[0]); }}
      />
    </div>
  );
}

function GameFooter({ complete, message, onReset }: { complete: boolean; message: string; onReset: () => void }) {
  return (
    <div className={"mt-6 rounded-2xl border p-4 " + (complete ? "border-emerald-200 bg-emerald-50" : "bg-slate-50")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={"text-sm font-black " + (complete ? "text-emerald-800" : "text-slate-700")}>{message}</p>
        <Button type="button" variant="outline" className="rounded-full bg-white" onClick={onReset}>
          Ξανά
        </Button>
      </div>
    </div>
  );
}
