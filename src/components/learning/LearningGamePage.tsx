import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { ReactNode } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import pisipoukLogo from "@/assets/pisipouk-logo.webp";

export type Age = "2-3" | "4-5" | "5-6";
type DragGameId = "sort" | "dress" | "school-bag" | "fruit-basket";
export type GameId = DragGameId | "snake" | "maze" | "memory" | "pattern";
type Mood = "idle" | "success" | "thinking";
type Item = { id: string; emoji: string; label: string; zone: string };
type Zone = { id: string; label: string; emoji: string };
type Round = { title: string; instruction: string; zones: Zone[]; items: Item[]; skills: string[]; parentNote: string };

const GAME_CSS =
  "@keyframes pp-cheer{0%,100%{transform:translateY(0) rotate(0) scale(1)}28%{transform:translateY(-12px) rotate(-5deg) scale(1.05)}58%{transform:translateY(0) rotate(5deg) scale(1.02)}78%{transform:translateY(-5px) rotate(-2deg) scale(1.03)}} " +
  "@keyframes pp-think{0%,100%{transform:rotate(0) translateX(0)}35%{transform:rotate(-3deg) translateX(-2px)}70%{transform:rotate(3deg) translateX(2px)}} " +
  "@keyframes pp-idle{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}} " +
  ".pp-success{animation:pp-cheer .82s ease}.pp-thinking{animation:pp-think .9s ease}.pp-idle{animation:pp-idle 2.5s ease-in-out infinite}";

const GAME_META: Record<GameId, { title: string; emoji: string }> = {
  sort: { title: "Σωστή κατηγορία", emoji: "🧺" },
  dress: { title: "Ντύσε τον Πισιπούκ", emoji: "🧢" },
  "school-bag": { title: "Φτιάξε τη σχολική τσάντα", emoji: "🎒" },
  "fruit-basket": { title: "Φρούτα στο καλάθι", emoji: "🍎" },
  snake: { title: "Το Φιδάκι των Αριθμών", emoji: "🐍" },
  maze: { title: "Λαβύρινθος του Πισιπούκ", emoji: "🌀" },
  memory: { title: "Παιχνίδι Μνήμης", emoji: "🧠" },
  pattern: { title: "Βρες το Μοτίβο", emoji: "🔷" },
};

function isAge(value: unknown): value is Age {
  return value === "2-3" || value === "4-5" || value === "5-6";
}

function isGame(value: string): value is GameId {
  return value in GAME_META;
}

function isDragGame(value: GameId): value is DragGameId {
  return value === "sort" || value === "dress" || value === "school-bag" || value === "fruit-basket";
}

function shuffle<T>(values: T[]) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapWith]] = [result[swapWith], result[index]];
  }
  return result;
}

function countFor(age: Age) {
  return age === "2-3" ? 4 : age === "4-5" ? 6 : 8;
}

const DATA: Record<DragGameId, { title: string; instruction: string; zones: Zone[]; pool: Item[]; skills: string[]; parentNote: string }> = {
  sort: {
    title: "Βάλε τα στη σωστή κατηγορία",
    instruction: "Σύρε κάθε εικόνα στη σωστή ομάδα. Σε κινητό μπορείς να πατήσεις πρώτα την εικόνα και μετά την ομάδα.",
    zones: [
      { id: "animals", label: "Ζώα", emoji: "🐾" },
      { id: "fruit", label: "Φρούτα", emoji: "🍎" },
      { id: "vehicles", label: "Οχήματα", emoji: "🚗" },
    ],
    pool: [
      { id: "dog", emoji: "🐶", label: "Σκύλος", zone: "animals" },
      { id: "cat", emoji: "🐱", label: "Γάτα", zone: "animals" },
      { id: "rabbit", emoji: "🐰", label: "Κουνέλι", zone: "animals" },
      { id: "apple", emoji: "🍎", label: "Μήλο", zone: "fruit" },
      { id: "banana", emoji: "🍌", label: "Μπανάνα", zone: "fruit" },
      { id: "orange", emoji: "🍊", label: "Πορτοκάλι", zone: "fruit" },
      { id: "car", emoji: "🚗", label: "Αυτοκίνητο", zone: "vehicles" },
      { id: "bus", emoji: "🚌", label: "Λεωφορείο", zone: "vehicles" },
      { id: "bike", emoji: "🚲", label: "Ποδήλατο", zone: "vehicles" },
    ],
    skills: ["Αντιστοίχιση", "Συγκέντρωση", "Γλώσσα"],
    parentNote: "Ζητήστε από το παιδί να ονομάσει το αντικείμενο και να εξηγήσει γιατί ανήκει σε αυτή την ομάδα.",
  },
  dress: {
    title: "Ντύσε τον Πισιπούκ",
    instruction: "Βάλε κάθε ρούχο στο μέρος του σώματος όπου το φοράμε.",
    zones: [
      { id: "head", label: "Κεφάλι", emoji: "🙂" },
      { id: "body", label: "Σώμα", emoji: "👕" },
      { id: "feet", label: "Πόδια", emoji: "🦶" },
    ],
    pool: [
      { id: "cap", emoji: "🧢", label: "Καπέλο", zone: "head" },
      { id: "sunhat", emoji: "👒", label: "Καπέλο ήλιου", zone: "head" },
      { id: "scarf", emoji: "🧣", label: "Κασκόλ", zone: "body" },
      { id: "shirt", emoji: "👕", label: "Μπλούζα", zone: "body" },
      { id: "coat", emoji: "🧥", label: "Μπουφάν", zone: "body" },
      { id: "shoe", emoji: "👟", label: "Παπούτσι", zone: "feet" },
      { id: "sock", emoji: "🧦", label: "Κάλτσα", zone: "feet" },
      { id: "boot", emoji: "🥾", label: "Μποτάκι", zone: "feet" },
    ],
    skills: ["Λεπτή κινητικότητα", "Γλώσσα", "Δημιουργικότητα"],
    parentNote: "Ονομάστε τα ρούχα και συζητήστε πότε τα χρησιμοποιούμε: ζέστη, κρύο, βροχή ή παιχνίδι.",
  },
  "school-bag": {
    title: "Φτιάξε τη σχολική τσάντα",
    instruction: "Τι χρειαζόμαστε για το σχολείο; Βάλε τα κατάλληλα στην τσάντα και τα υπόλοιπα στο σπίτι.",
    zones: [
      { id: "bag", label: "Στην τσάντα", emoji: "🎒" },
      { id: "home", label: "Μένει σπίτι", emoji: "🏠" },
    ],
    pool: [
      { id: "book", emoji: "📘", label: "Βιβλίο", zone: "bag" },
      { id: "pencil", emoji: "✏️", label: "Μολύβι", zone: "bag" },
      { id: "water", emoji: "💧", label: "Νερό", zone: "bag" },
      { id: "snack", emoji: "🍎", label: "Σνακ", zone: "bag" },
      { id: "pillow", emoji: "🛏️", label: "Μαξιλάρι", zone: "home" },
      { id: "pan", emoji: "🍳", label: "Τηγάνι", zone: "home" },
      { id: "lamp", emoji: "💡", label: "Λάμπα", zone: "home" },
      { id: "plant", emoji: "🪴", label: "Γλάστρα", zone: "home" },
    ],
    skills: ["Συγκέντρωση", "Αντιστοίχιση", "Γλώσσα"],
    parentNote: "Ρωτήστε «γιατί το χρειαζόμαστε;» ώστε η επιλογή να γίνεται με σκέψη και όχι μόνο με αναγνώριση εικόνας.",
  },
  "fruit-basket": {
    title: "Βάλε τα φρούτα στο καλάθι",
    instruction: "Βάλε τα φρούτα στο καλάθι. Ό,τι δεν είναι φρούτο πάει στο άλλο κουτί.",
    zones: [
      { id: "fruit", label: "Καλάθι φρούτων", emoji: "🧺" },
      { id: "other", label: "Δεν είναι φρούτο", emoji: "📦" },
    ],
    pool: [
      { id: "apple", emoji: "🍎", label: "Μήλο", zone: "fruit" },
      { id: "pear", emoji: "🍐", label: "Αχλάδι", zone: "fruit" },
      { id: "banana", emoji: "🍌", label: "Μπανάνα", zone: "fruit" },
      { id: "grapes", emoji: "🍇", label: "Σταφύλι", zone: "fruit" },
      { id: "carrot", emoji: "🥕", label: "Καρότο", zone: "other" },
      { id: "bread", emoji: "🍞", label: "Ψωμί", zone: "other" },
      { id: "ball", emoji: "⚽", label: "Μπάλα", zone: "other" },
      { id: "redbook", emoji: "📕", label: "Βιβλίο", zone: "other" },
    ],
    skills: ["Αντιστοίχιση", "Γλώσσα", "Συγκέντρωση"],
    parentNote: "Μετά το παιχνίδι, ζητήστε από το παιδί να πει χρώμα, γεύση ή σχήμα ενός φρούτου.",
  },
};

function makeRound(gameId: DragGameId, age: Age): Round {
  const base = DATA[gameId];
  return { ...base, items: shuffle(base.pool).slice(0, Math.min(countFor(age), base.pool.length)) };
}

export function LearningGamePage({ gameId, age }: { gameId: GameId; age: Age }) {
  if (isDragGame(gameId)) return <DragGame key={gameId + "-" + age} gameId={gameId} age={age} />;
  if (gameId === "snake") return <SnakeGame key={"snake-" + age} age={age} />;
  if (gameId === "maze") return <MazeGame key={"maze-" + age} age={age} />;
  if (gameId === "memory") return <MemoryGame key={"memory-" + age} age={age} />;
  return <PatternGame key={"pattern-" + age} age={age} />;
}

function GameShell({
  age,
  title,
  instruction,
  mood,
  message,
  beat,
  onNewRound,
  children,
  skills,
  parentNote,
}: {
  age: Age;
  title: string;
  instruction: string;
  mood: Mood;
  message: string;
  beat: number;
  onNewRound: () => void;
  children: ReactNode;
  skills: string[];
  parentNote: string;
}) {
  return (
    <SiteLayout>
      <style>{GAME_CSS}</style>
      <section className="bg-gradient-to-b from-sky-50 via-white to-amber-50 py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/learning-games" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-[#0b3b82] shadow-sm">← Παιχνίδια</Link>
            <Button type="button" variant="outline" className="rounded-full bg-white" onClick={onNewRound}>🎲 Νέος τυχαίος γύρος</Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">{age.replace("-", "–")} ετών</p>
            <h1 className="mt-2 text-3xl font-black text-[#0b3b82] sm:text-5xl">{title}</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{instruction}</p>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[180px_1fr]">
            <aside className="rounded-[1.8rem] border bg-white p-4 text-center shadow-sm">
              <div
                key={mood + "-" + beat}
                className={"relative mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-sky-50 to-amber-50 " + (mood === "success" ? "pp-success" : mood === "thinking" ? "pp-thinking" : "pp-idle")}
              >
                <img src={pisipoukLogo} alt="Ο Πισιπούκ" className="h-28 w-28 object-contain" />
                {mood === "success" && <span className="absolute -right-1 top-0 text-xl" aria-hidden="true">✨</span>}
                {mood === "thinking" && <span className="absolute -right-1 top-0 text-xl" aria-hidden="true">💭</span>}
              </div>
              <div className={"mt-3 rounded-2xl px-3 py-3 text-xs font-bold leading-5 " + (mood === "success" ? "bg-emerald-50 text-emerald-800" : mood === "thinking" ? "bg-amber-50 text-amber-900" : "bg-sky-50 text-[#0b3b82]")}>
                {message}
              </div>
            </aside>

            <div className="rounded-[1.8rem] border bg-white p-4 shadow-sm sm:p-6">
              {children}
            </div>
          </div>

          <section className="mt-6 rounded-[1.8rem] border bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Για εκπαιδευτικούς & γονείς</p>
            <h2 className="mt-2 text-2xl font-black text-[#0b3b82]">Τι καλλιεργεί αυτή η δραστηριότητα</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill) => <span key={skill} className="rounded-full bg-primary/10 px-3 py-2 text-xs font-black text-primary">{skill}</span>)}
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{parentNote}</p>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
}

function DragGame({ gameId, age }: { gameId: DragGameId; age: Age }) {
  const [round, setRound] = useState(() => makeRound(gameId, age));
  const [remaining, setRemaining] = useState<Item[]>(round.items);
  const [placed, setPlaced] = useState<Record<string, Item[]>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [mood, setMood] = useState<Mood>("idle");
  const [message, setMessage] = useState("Παρατήρησε πρώτα και μετά δοκίμασε. Δεν βιαζόμαστε.");
  const [beat, setBeat] = useState(0);

  const react = (nextMood: Mood, text: string) => {
    setMood(nextMood);
    setMessage(text);
    setBeat((value) => value + 1);
  };

  const dropTo = (zoneId: string, itemId?: string | null) => {
    const candidate = itemId ?? selected ?? dragging;
    const item = remaining.find((entry) => entry.id === candidate);
    if (!item) return;

    if (item.zone !== zoneId) {
      react("thinking", "Χμ… ας το ξαναδούμε. Πού χρησιμοποιούμε ή πού ανήκει το «" + item.label + "»; Κοίτα τις ομάδες και δοκίμασε πάλι.");
      setSelected(null);
      setDragging(null);
      return;
    }

    const nextRemaining = remaining.filter((entry) => entry.id !== item.id);
    setRemaining(nextRemaining);
    setPlaced((current) => ({ ...current, [zoneId]: [...(current[zoneId] ?? []), item] }));
    setSelected(null);
    setDragging(null);

    if (nextRemaining.length === 0) {
      react("success", "Τα κατάφερες! Παρατήρησες, σκέφτηκες και έβαλες όλα τα αντικείμενα στη σωστή θέση.");
    } else {
      react("success", "Μπράβο! Αυτή η επιλογή ταιριάζει. Συνέχισε με το επόμενο αντικείμενο.");
    }
  };

  const newRound = () => {
    const next = makeRound(gameId, age);
    setRound(next);
    setRemaining(next.items);
    setPlaced({});
    setSelected(null);
    setDragging(null);
    setMood("idle");
    setMessage("Νέος γύρος! Τα αντικείμενα άλλαξαν. Κοίτα προσεκτικά πριν διαλέξεις.");
    setBeat((value) => value + 1);
  };

  return (
    <GameShell
      age={age}
      title={round.title}
      instruction={round.instruction}
      mood={mood}
      message={message}
      beat={beat}
      onNewRound={newRound}
      skills={round.skills}
      parentNote={round.parentNote}
    >
      <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">Αντικείμενα</p>
      <div className="mt-3 flex min-h-28 flex-wrap gap-3 rounded-2xl bg-slate-50 p-3">
        {remaining.map((item) => (
          <button
            key={item.id}
            type="button"
            draggable
            onDragStart={() => setDragging(item.id)}
            onDragEnd={() => setDragging(null)}
            onClick={() => setSelected((current) => current === item.id ? null : item.id)}
            className={"min-h-20 min-w-24 rounded-2xl border bg-white p-3 text-center shadow-sm transition " + (selected === item.id ? "ring-2 ring-primary" : "hover:-translate-y-0.5")}
          >
            <div className="text-3xl">{item.emoji}</div>
            <div className="mt-1 text-xs font-black">{item.label}</div>
          </button>
        ))}
        {remaining.length === 0 && <div className="flex w-full items-center justify-center py-6 text-sm font-black text-emerald-700">🎉 Ο γύρος ολοκληρώθηκε!</div>}
      </div>

      <div className={"mt-5 grid gap-3 " + (round.zones.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
        {round.zones.map((zone) => (
          <button
            key={zone.id}
            type="button"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => { event.preventDefault(); dropTo(zone.id, dragging); }}
            onClick={() => dropTo(zone.id, selected)}
            className="min-h-36 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-3 text-center transition hover:border-primary hover:bg-primary/5"
          >
            <div className="text-4xl">{zone.emoji}</div>
            <div className="mt-1 font-black text-[#0b3b82]">{zone.label}</div>
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              {(placed[zone.id] ?? []).map((item) => <span key={item.id} className="rounded-full bg-slate-100 px-2 py-1 text-lg" title={item.label}>{item.emoji}</span>)}
            </div>
          </button>
        ))}
      </div>
    </GameShell>
  );
}

type SnakeSpecial = { kind: "snake" | "star"; destination: number };

function snakeLength(age: Age) {
  return age === "2-3" ? 12 : age === "4-5" ? 18 : 24;
}

function makeSnakeSpecials(age: Age) {
  const length = snakeLength(age);
  const count = age === "2-3" ? 1 : age === "4-5" ? 2 : 3;
  const candidates = shuffle(Array.from({ length: length - 4 }, (_, index) => index + 3));
  const specials: Record<number, SnakeSpecial> = {};

  for (let index = 0; index < count; index += 1) {
    const position = candidates[index];
    specials[position] = { kind: "snake", destination: Math.max(1, position - (2 + index)) };
  }
  for (let index = 0; index < count; index += 1) {
    const position = candidates[count + index];
    specials[position] = { kind: "star", destination: Math.min(length, position + (2 + index)) };
  }
  return specials;
}

function SnakeGame({ age }: { age: Age }) {
  const length = snakeLength(age);
  const [position, setPosition] = useState(1);
  const [specials, setSpecials] = useState<Record<number, SnakeSpecial>>(() => makeSnakeSpecials(age));
  const [die, setDie] = useState<number | null>(null);
  const [mood, setMood] = useState<Mood>("idle");
  const [message, setMessage] = useState("Ρίξε το ζάρι και μέτρα τα βήματα μαζί με τον Πισιπούκ.");
  const [beat, setBeat] = useState(0);
  const maxDie = age === "2-3" ? 3 : age === "4-5" ? 4 : 6;
  const columns = age === "2-3" ? 4 : 6;

  const roll = () => {
    if (position >= length) return;
    const value = 1 + Math.floor(Math.random() * maxDie);
    const landed = Math.min(length, position + value);
    const special = specials[landed];
    const finalPosition = special ? special.destination : landed;
    setDie(value);
    setPosition(finalPosition);
    setBeat((current) => current + 1);

    if (finalPosition >= length) {
      setMood("success");
      setMessage("Τερμάτισες! Μέτρησες τη διαδρομή μέχρι το τέλος. Μπράβο!");
    } else if (special?.kind === "snake") {
      setMood("thinking");
      setMessage("Έφερες " + value + ". Το φιδάκι μας πήγε λίγο πίσω, αλλά συνεχίζουμε και μετράμε ξανά από το " + finalPosition + ".");
    } else if (special?.kind === "star") {
      setMood("success");
      setMessage("Έφερες " + value + " και βρήκες αστεράκι! Προχωράμε μέχρι το " + finalPosition + ".");
    } else {
      setMood("success");
      setMessage("Έφερες " + value + ". Μέτρησε τα βήματα και φτάσαμε στο " + finalPosition + ".");
    }
  };

  const newRound = () => {
    setPosition(1);
    setSpecials(makeSnakeSpecials(age));
    setDie(null);
    setMood("idle");
    setMessage("Νέα διαδρομή! Ρίξε το ζάρι και μέτρα κάθε βήμα.");
    setBeat((value) => value + 1);
  };

  return (
    <GameShell
      age={age}
      title="Το Φιδάκι των Αριθμών"
      instruction={"Φτάσε από το 1 στο " + length + ". Τα ⭐ σε βοηθούν να προχωρήσεις και τα 🐍 σε πάνε λίγα βήματα πίσω."}
      mood={mood}
      message={message}
      beat={beat}
      onNewRound={newRound}
      skills={["Αρίθμηση", "Ποσότητες", "Συγκέντρωση", "Αναμονή σειράς"]}
      parentNote={"Ζητήστε από το παιδί να μετρά δυνατά κάθε μετακίνηση. Για αυτή την ηλικία το ζάρι φτάνει μέχρι το " + maxDie + ", ώστε η ποσότητα να παραμένει διαχειρίσιμη."}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">Θέση Πισιπούκ</p>
          <p className="mt-1 text-3xl font-black text-[#0b3b82]">{position} / {length}</p>
        </div>
        <Button type="button" className="min-h-14 rounded-full px-6 text-base font-black" onClick={roll} disabled={position >= length}>
          🎲 {die ? "Ξανά · " + die : "Ρίξε το ζάρι"}
        </Button>
      </div>

      <div className="mt-5 grid gap-2" style={{ gridTemplateColumns: "repeat(" + columns + ", minmax(0, 1fr))" }}>
        {Array.from({ length }, (_, index) => {
          const number = index + 1;
          const special = specials[number];
          return (
            <div
              key={number}
              className={"relative flex aspect-square min-h-14 flex-col items-center justify-center rounded-xl border text-center shadow-sm " + (position === number ? "bg-amber-100 ring-2 ring-primary" : "bg-slate-50")}
            >
              <span className="text-[10px] font-black text-slate-500">{number}</span>
              <span className="text-xl">{number === length ? "🏁" : special?.kind === "snake" ? "🐍" : special?.kind === "star" ? "⭐" : ""}</span>
              {position === number && <span className="absolute bottom-0.5 right-1 text-lg" aria-label="Ο Πισιπούκ">🐻</span>}
            </div>
          );
        })}
      </div>
    </GameShell>
  );
}

type MazeCell = { open: boolean[] };

function mazeSize(age: Age) {
  return age === "2-3" ? 4 : age === "4-5" ? 5 : 6;
}

function makeMaze(size: number): MazeCell[] {
  const cells = Array.from({ length: size * size }, () => ({ open: [false, false, false, false] }));
  const visited = new Set<number>([0]);
  const stack = [0];
  const directions = [
    { dr: -1, dc: 0, dir: 0, opposite: 2 },
    { dr: 0, dc: 1, dir: 1, opposite: 3 },
    { dr: 1, dc: 0, dir: 2, opposite: 0 },
    { dr: 0, dc: -1, dir: 3, opposite: 1 },
  ];

  while (stack.length) {
    const current = stack[stack.length - 1];
    const row = Math.floor(current / size);
    const col = current % size;
    const options = shuffle(directions.filter(({ dr, dc }) => {
      const nextRow = row + dr;
      const nextCol = col + dc;
      if (nextRow < 0 || nextCol < 0 || nextRow >= size || nextCol >= size) return false;
      return !visited.has(nextRow * size + nextCol);
    }));

    if (!options.length) {
      stack.pop();
      continue;
    }

    const choice = options[0];
    const next = (row + choice.dr) * size + (col + choice.dc);
    cells[current].open[choice.dir] = true;
    cells[next].open[choice.opposite] = true;
    visited.add(next);
    stack.push(next);
  }

  return cells;
}

function MazeGame({ age }: { age: Age }) {
  const size = mazeSize(age);
  const [maze, setMaze] = useState(() => makeMaze(size));
  const [position, setPosition] = useState(0);
  const [mood, setMood] = useState<Mood>("idle");
  const [message, setMessage] = useState("Βρες ένα ανοιχτό πέρασμα δίπλα στον Πισιπούκ και προχώρα ένα τετράγωνο τη φορά.");
  const [beat, setBeat] = useState(0);
  const goal = size * size - 1;

  const moveTo = (target: number) => {
    if (position === goal) return;
    const row = Math.floor(position / size);
    const col = position % size;
    const targetRow = Math.floor(target / size);
    const targetCol = target % size;
    const dr = targetRow - row;
    const dc = targetCol - col;
    const dir = dr === -1 && dc === 0 ? 0 : dr === 0 && dc === 1 ? 1 : dr === 1 && dc === 0 ? 2 : dr === 0 && dc === -1 ? 3 : -1;

    setBeat((value) => value + 1);
    if (dir < 0) {
      setMood("thinking");
      setMessage("Πήγαινε σε ένα διπλανό τετράγωνο. Κοιτάμε ένα βήμα τη φορά.");
      return;
    }
    if (!maze[position].open[dir]) {
      setMood("thinking");
      setMessage("Εδώ υπάρχει τοίχος. Κοίτα τις πλευρές που είναι ανοιχτές και διάλεξε άλλη κατεύθυνση.");
      return;
    }

    setPosition(target);
    if (target === goal) {
      setMood("success");
      setMessage("Βρήκες την έξοδο! Σχεδίασες τη διαδρομή βήμα βήμα. Μπράβο!");
    } else {
      setMood("success");
      setMessage("Σωστό πέρασμα. Τώρα κοίτα πάλι γύρω σου πριν κάνεις το επόμενο βήμα.");
    }
  };

  const newRound = () => {
    setMaze(makeMaze(size));
    setPosition(0);
    setMood("idle");
    setMessage("Νέος λαβύρινθος! Ξεκίνα από τον Πισιπούκ και βρες τη σχολική τσάντα.");
    setBeat((value) => value + 1);
  };

  return (
    <GameShell
      age={age}
      title="Λαβύρινθος του Πισιπούκ"
      instruction={"Οδήγησε τον Πισιπούκ 🐻 μέχρι την τσάντα 🎒. Ο λαβύρινθος αλλάζει σε κάθε νέο γύρο και έχει " + size + "×" + size + " τετράγωνα."}
      mood={mood}
      message={message}
      beat={beat}
      onNewRound={newRound}
      skills={["Χωρικός προσανατολισμός", "Σχεδιασμός", "Συγκέντρωση", "Επίλυση προβλήματος"]}
      parentNote="Ενθαρρύνετε το παιδί να κοιτάζει πρώτα τις ανοιχτές πλευρές και μετά να επιλέγει. Αν κλειστεί σε αδιέξοδο, η επιστροφή είναι μέρος της λύσης."
    >
      <div className="mx-auto grid max-w-xl bg-[#0b3b82] p-1" style={{ gridTemplateColumns: "repeat(" + size + ", minmax(0, 1fr))" }}>
        {maze.map((cell, index) => {
          const walls = {
            borderTop: cell.open[0] ? "2px solid #dbeafe" : "5px solid #0b3b82",
            borderRight: cell.open[1] ? "2px solid #dbeafe" : "5px solid #0b3b82",
            borderBottom: cell.open[2] ? "2px solid #dbeafe" : "5px solid #0b3b82",
            borderLeft: cell.open[3] ? "2px solid #dbeafe" : "5px solid #0b3b82",
          };
          return (
            <button
              key={index}
              type="button"
              onClick={() => moveTo(index)}
              className={"relative aspect-square bg-white text-2xl transition " + (position === index ? "bg-amber-100" : "hover:bg-sky-50")}
              style={walls}
              aria-label={"Τετράγωνο " + (index + 1)}
            >
              {position === index ? "🐻" : index === goal ? "🎒" : ""}
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}

type MemoryCard = { id: string; pair: number; emoji: string };

const MEMORY_EMOJIS = ["🐶", "🐱", "🐰", "🦊", "🐸", "🐼", "🍎", "🍌", "🌟", "🚗", "🎈", "🌼"];

function memoryPairs(age: Age) {
  return age === "2-3" ? 3 : age === "4-5" ? 4 : 6;
}

function makeMemoryDeck(age: Age): MemoryCard[] {
  const chosen = shuffle(MEMORY_EMOJIS).slice(0, memoryPairs(age));
  return shuffle(chosen.flatMap((emoji, pair) => [
    { id: pair + "-a", pair, emoji },
    { id: pair + "-b", pair, emoji },
  ]));
}

function MemoryGame({ age }: { age: Age }) {
  const [deck, setDeck] = useState(() => makeMemoryDeck(age));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [mood, setMood] = useState<Mood>("idle");
  const [message, setMessage] = useState("Γύρισε δύο κάρτες και προσπάθησε να θυμάσαι πού βρίσκεται κάθε εικόνα.");
  const [beat, setBeat] = useState(0);

  const flip = (index: number) => {
    if (locked || flipped.includes(index) || matched.includes(deck[index].pair)) return;
    if (flipped.length === 0) {
      setFlipped([index]);
      return;
    }

    const first = flipped[0];
    setFlipped([first, index]);
    setBeat((value) => value + 1);

    if (deck[first].pair === deck[index].pair) {
      const nextMatched = [...matched, deck[index].pair];
      setMatched(nextMatched);
      setFlipped([]);
      setMood("success");
      setMessage(nextMatched.length === memoryPairs(age) ? "Βρήκες όλα τα ζευγάρια! Η μνήμη δυναμώνει κάθε φορά που παρατηρείς." : "Μπράβο, αυτό είναι ζευγάρι! Θυμήσου τώρα τις υπόλοιπες θέσεις.");
      return;
    }

    setLocked(true);
    setMood("thinking");
    setMessage("Δεν είναι ίδιο ζευγάρι αυτή τη φορά. Κοίτα τις εικόνες για λίγο και κράτησε τις θέσεις τους στη μνήμη σου.");
    window.setTimeout(() => {
      setFlipped([]);
      setLocked(false);
    }, 750);
  };

  const newRound = () => {
    setDeck(makeMemoryDeck(age));
    setFlipped([]);
    setMatched([]);
    setLocked(false);
    setMood("idle");
    setMessage("Νέα ζευγάρια και νέα σειρά! Παρατήρησε προσεκτικά κάθε κάρτα.");
    setBeat((value) => value + 1);
  };

  const columns = age === "2-3" ? 3 : 4;

  return (
    <GameShell
      age={age}
      title="Παιχνίδι Μνήμης"
      instruction={"Βρες " + memoryPairs(age) + " ίδια ζευγάρια. Οι κάρτες ανακατεύονται σε κάθε νέο γύρο."}
      mood={mood}
      message={message}
      beat={beat}
      onNewRound={newRound}
      skills={["Οπτική μνήμη", "Συγκέντρωση", "Αντιστοίχιση", "Αυτοέλεγχος"]}
      parentNote="Αποφύγετε να δείχνετε αμέσως τη σωστή κάρτα. Δώστε λίγο χρόνο στο παιδί να ανακαλέσει τη θέση και να εξηγήσει τι θυμάται."
    >
      <div className="mx-auto grid max-w-2xl gap-3" style={{ gridTemplateColumns: "repeat(" + columns + ", minmax(0, 1fr))" }}>
        {deck.map((card, index) => {
          const visible = flipped.includes(index) || matched.includes(card.pair);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => flip(index)}
              disabled={matched.includes(card.pair)}
              className={"aspect-square rounded-2xl border text-4xl shadow-sm transition " + (visible ? "bg-white ring-2 ring-sky-100" : "bg-[#0b3b82] text-white hover:-translate-y-0.5")}
              aria-label={visible ? card.emoji : "Κλειστή κάρτα"}
            >
              {visible ? card.emoji : "?"}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-center text-sm font-black text-[#0b3b82]">Ζευγάρια: {matched.length} / {memoryPairs(age)}</p>
    </GameShell>
  );
}

type PatternRound = { sequence: string[]; missing: number; answer: string; options: string[] };

const PATTERN_SYMBOLS = ["🔴", "🔵", "🟡", "🟢", "🟣", "🟠", "⭐", "❤️"];

function makePattern(age: Age): PatternRound {
  const choices = shuffle(PATTERN_SYMBOLS);
  let sequence: string[];

  if (age === "2-3") {
    const [a, b] = choices;
    sequence = [a, b, a, b, a, b];
  } else if (age === "4-5") {
    const [a, b, c] = choices;
    sequence = [a, b, c, a, b, c];
  } else {
    const [a, b, c] = choices;
    sequence = Math.random() > 0.5 ? [a, a, b, b, c, c, a, a] : [a, b, c, a, b, c, a, b];
  }

  const start = age === "2-3" ? 3 : Math.floor(sequence.length / 2);
  const missing = start + Math.floor(Math.random() * (sequence.length - start));
  const answer = sequence[missing];
  const optionCount = age === "2-3" ? 3 : 4;
  const options = shuffle([answer, ...choices.filter((item) => item !== answer).slice(0, optionCount - 1)]);
  return { sequence, missing, answer, options };
}

function PatternGame({ age }: { age: Age }) {
  const [round, setRound] = useState(() => makePattern(age));
  const [mood, setMood] = useState<Mood>("idle");
  const [message, setMessage] = useState("Κοίτα πώς επαναλαμβάνονται τα σύμβολα. Ποιο πρέπει να μπει στο κενό;");
  const [beat, setBeat] = useState(0);
  const [solved, setSolved] = useState(false);

  const choose = (value: string) => {
    setBeat((current) => current + 1);
    if (value === round.answer) {
      setSolved(true);
      setMood("success");
      setMessage("Ακριβώς! Βρήκες τον κανόνα του μοτίβου και προέβλεψες τι ακολουθεί.");
    } else {
      setMood("thinking");
      setMessage("Ας το κοιτάξουμε ξανά χωρίς βιασύνη. Δες ποια μικρή ομάδα συμβόλων επαναλαμβάνεται πριν από το κενό.");
    }
  };

  const newRound = () => {
    setRound(makePattern(age));
    setSolved(false);
    setMood("idle");
    setMessage("Νέο μοτίβο! Κοίτα πρώτα ολόκληρη τη σειρά και μετά διάλεξε.");
    setBeat((value) => value + 1);
  };

  return (
    <GameShell
      age={age}
      title="Βρες το Μοτίβο"
      instruction="Παρατήρησε τη σειρά και βρες ποιο σύμβολο λείπει. Τα μοτίβα γίνονται πιο σύνθετα όσο μεγαλώνει η ηλικία."
      mood={mood}
      message={message}
      beat={beat}
      onNewRound={newRound}
      skills={["Λογική", "Πρόβλεψη", "Παρατήρηση", "Συγκέντρωση"]}
      parentNote="Ζητήστε από το παιδί να πει δυνατά τον κανόνα, π.χ. «κόκκινο-μπλε, κόκκινο-μπλε». Η λεκτική περιγραφή βοηθά να οργανώσει τη σκέψη του."
    >
      <div className="flex flex-wrap justify-center gap-2 rounded-2xl bg-slate-50 p-4">
        {round.sequence.map((symbol, index) => (
          <div key={index} className={"flex h-16 w-16 items-center justify-center rounded-2xl border bg-white text-3xl shadow-sm " + (index === round.missing ? "border-dashed border-primary bg-primary/5" : "")}>
            {index === round.missing ? (solved ? round.answer : "❓") : symbol}
          </div>
        ))}
      </div>

      <p className="mt-5 text-center text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">Διάλεξε το σύμβολο που λείπει</p>
      <div className="mt-3 flex flex-wrap justify-center gap-3">
        {round.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => choose(option)}
            disabled={solved}
            className="flex h-16 w-20 items-center justify-center rounded-2xl border bg-white text-3xl shadow-sm transition hover:-translate-y-0.5 hover:ring-2 hover:ring-primary disabled:opacity-60"
          >
            {option}
          </button>
        ))}
      </div>
    </GameShell>
  );
}
