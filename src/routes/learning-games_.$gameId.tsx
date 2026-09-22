import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import pisipoukLogo from "@/assets/pisipouk-logo.webp";

type Age = "2-3" | "4-5" | "5-6";
type GameId = "sort" | "dress" | "school-bag" | "fruit-basket";
type Mood = "idle" | "success" | "thinking";
type Item = { id: string; emoji: string; label: string; zone: string };
type Zone = { id: string; label: string; emoji: string };
type Round = { title: string; instruction: string; zones: Zone[]; items: Item[]; skills: string[]; parentNote: string };

const GAME_CSS = "@keyframes pp-cheer{0%,100%{transform:translateY(0) rotate(0)}30%{transform:translateY(-10px) rotate(-5deg)}60%{transform:translateY(0) rotate(5deg)}} @keyframes pp-think{0%,100%{transform:rotate(0)}35%{transform:rotate(-3deg)}70%{transform:rotate(3deg)}} @keyframes pp-idle{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}} .pp-success{animation:pp-cheer .72s ease}.pp-thinking{animation:pp-think .8s ease}.pp-idle{animation:pp-idle 2.4s ease-in-out infinite}";

function isAge(value: unknown): value is Age {
  return value === "2-3" || value === "4-5" || value === "5-6";
}
function isGame(value: string): value is GameId {
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

const DATA: Record<GameId, { title: string; instruction: string; zones: Zone[]; pool: Item[]; skills: string[]; parentNote: string }> = {
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

function makeRound(gameId: GameId, age: Age): Round {
  const base = DATA[gameId];
  const selected = shuffle(base.pool).slice(0, Math.min(countFor(age), base.pool.length));
  return { ...base, items: selected };
}

export const Route = createFileRoute("/learning-games_/$gameId")({
  validateSearch: (search: Record<string, unknown>) => ({ age: isAge(search.age) ? search.age : ("2-3" as Age) }),
  head: ({ params }) => ({ meta: [{ title: (DATA[params.gameId as GameId]?.title ?? "Μαθησιακό Παιχνίδι") + " | Ο Πισιπούκ" }] }),
  component: GamePage,
});

function GamePage() {
  const { gameId: rawGameId } = Route.useParams();
  const { age } = Route.useSearch();
  if (!isGame(rawGameId)) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <h1 className="text-3xl font-black">Το παιχνίδι δεν βρέθηκε</h1>
          <Link to="/learning-games" className="mt-5 inline-flex rounded-full bg-primary px-5 py-3 font-black text-primary-foreground">Όλα τα παιχνίδια</Link>
        </div>
      </SiteLayout>
    );
  }
  return <GameBoard key={rawGameId + "-" + age} gameId={rawGameId} age={age} />;
}

function GameBoard({ gameId, age }: { gameId: GameId; age: Age }) {
  const [roundKey, setRoundKey] = useState(1);
  const round = useMemo(() => makeRound(gameId, age), [gameId, age, roundKey]);
  const [remaining, setRemaining] = useState<Item[]>(round.items);
  const [placed, setPlaced] = useState<Record<string, Item[]>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [mood, setMood] = useState<Mood>("idle");
  const [message, setMessage] = useState("Παρατήρησε πρώτα και μετά δοκίμασε. Δεν βιαζόμαστε.");
  const [beat, setBeat] = useState(0);

  const itemById = (id: string | null) => remaining.find((item) => item.id === id);
  const react = (next: Mood, text: string) => {
    setMood(next);
    setMessage(text);
    setBeat((value) => value + 1);
  };

  const dropTo = (zoneId: string, id?: string | null) => {
    const item = itemById(id ?? selected ?? dragging);
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
    setRoundKey((value) => value + 1);
    setRemaining(next.items);
    setPlaced({});
    setSelected(null);
    setDragging(null);
    setMood("idle");
    setMessage("Νέος γύρος! Τα αντικείμενα άλλαξαν. Κοίτα προσεκτικά πριν διαλέξεις.");
  };

  return (
    <SiteLayout>
      <style>{GAME_CSS}</style>
      <section className="bg-gradient-to-b from-sky-50 via-white to-amber-50 py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/learning-games" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-[#0b3b82] shadow-sm">← Παιχνίδια</Link>
            <Button type="button" variant="outline" className="rounded-full bg-white" onClick={newRound}>🎲 Νέος τυχαίος γύρος</Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">{age.replace("-", "–")} ετών</p>
            <h1 className="mt-2 text-3xl font-black text-[#0b3b82] sm:text-5xl">{round.title}</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{round.instruction}</p>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[170px_1fr]">
            <div className="rounded-[1.8rem] border bg-white p-4 text-center shadow-sm">
              <div key={mood + "-" + beat} className={"mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-sky-50 to-amber-50 " + (mood === "success" ? "pp-success" : mood === "thinking" ? "pp-thinking" : "pp-idle")}>
                <img src={pisipoukLogo} alt="Ο Πισιπούκ" className="h-28 w-28 object-contain" />
              </div>
              <div className={"mt-3 rounded-2xl px-3 py-3 text-xs font-bold leading-5 " + (mood === "success" ? "bg-emerald-50 text-emerald-800" : mood === "thinking" ? "bg-amber-50 text-amber-900" : "bg-sky-50 text-[#0b3b82]")}>
                {message}
              </div>
            </div>

            <div className="rounded-[1.8rem] border bg-white p-4 shadow-sm sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">Αντικείμενα</p>
              <div className="mt-3 flex min-h-28 flex-wrap gap-3 rounded-2xl bg-slate-50 p-3">
                {remaining.map((item) => (
                  <button key={item.id} type="button" draggable
                    onDragStart={() => setDragging(item.id)}
                    onDragEnd={() => setDragging(null)}
                    onClick={() => setSelected((current) => current === item.id ? null : item.id)}
                    className={"min-h-20 min-w-24 rounded-2xl border bg-white p-3 text-center shadow-sm transition " + (selected === item.id ? "ring-2 ring-primary" : "hover:-translate-y-0.5")}>
                    <div className="text-3xl">{item.emoji}</div>
                    <div className="mt-1 text-xs font-black">{item.label}</div>
                  </button>
                ))}
                {remaining.length === 0 && <div className="flex w-full items-center justify-center py-6 text-sm font-black text-emerald-700">🎉 Ο γύρος ολοκληρώθηκε!</div>}
              </div>

              <div className={"mt-5 grid gap-3 " + (round.zones.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
                {round.zones.map((zone) => (
                  <button key={zone.id} type="button"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => { event.preventDefault(); dropTo(zone.id, dragging); }}
                    onClick={() => dropTo(zone.id, selected)}
                    className="min-h-36 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-3 text-center transition hover:border-primary hover:bg-primary/5">
                    <div className="text-4xl">{zone.emoji}</div>
                    <div className="mt-1 font-black text-[#0b3b82]">{zone.label}</div>
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      {(placed[zone.id] ?? []).map((item) => <span key={item.id} className="rounded-full bg-slate-100 px-2 py-1 text-lg" title={item.label}>{item.emoji}</span>)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <section className="mt-6 rounded-[1.8rem] border bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Για εκπαιδευτικούς & γονείς</p>
            <h2 className="mt-2 text-2xl font-black text-[#0b3b82]">Τι καλλιεργεί αυτή η δραστηριότητα</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {round.skills.map((skill) => <span key={skill} className="rounded-full bg-primary/10 px-3 py-2 text-xs font-black text-primary">{skill}</span>)}
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{round.parentNote}</p>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
}
