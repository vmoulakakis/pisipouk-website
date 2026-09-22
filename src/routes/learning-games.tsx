import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";

type Age = "2-3" | "4-5" | "5-6";

const AGES: Array<{ id: Age; label: string; note: string }> = [
  { id: "2-3", label: "2–3 ετών", note: "Μεγάλα στοιχεία, λίγες επιλογές και άμεση επιβράβευση." },
  { id: "4-5", label: "4–5 ετών", note: "Περισσότερα βήματα, μνήμη, κατηγορίες και απλή στρατηγική." },
  { id: "5-6", label: "5–6 ετών", note: "Μεγαλύτερη πρόκληση, ακολουθίες, προσανατολισμός και δημιουργία." },
];

const GAMES = [
  { id: "puzzle", emoji: "🧩", title: "Puzzle", skill: "Παρατηρητικότητα & ακολουθία", levels: { "2-3": "4 κομμάτια", "4-5": "6 κομμάτια", "5-6": "9 κομμάτια" } },
  { id: "memory", emoji: "🧠", title: "Memory", skill: "Μνήμη & συγκέντρωση", levels: { "2-3": "3 ζευγάρια", "4-5": "4 ζευγάρια", "5-6": "6 ζευγάρια" } },
  { id: "maze", emoji: "🗺️", title: "Λαβύρινθος", skill: "Προσανατολισμός & σχεδιασμός", levels: { "2-3": "μικρή διαδρομή", "4-5": "μεσαία διαδρομή", "5-6": "μεγάλη διαδρομή" } },
  { id: "dots", emoji: "🔢", title: "Ένωσε τις τελείες", skill: "Αριθμοί & οπτικοκινητικός συντονισμός", levels: { "2-3": "1–6", "4-5": "1–10", "5-6": "1–15" } },
  { id: "matching", emoji: "🔗", title: "Αντιστοίχιση", skill: "Κατηγορίες & λογική", levels: { "2-3": "εικόνα → ομάδα", "4-5": "έννοια → ομάδα", "5-6": "ζώο → περιβάλλον" } },
  { id: "scene", emoji: "🌈", title: "Φτιάξε τη σκηνή σου", skill: "Φαντασία & σύνθεση", levels: { "2-3": "6 αυτοκόλλητα", "4-5": "8 αυτοκόλλητα", "5-6": "10 αυτοκόλλητα" } },
] as const;

export const Route = createFileRoute("/learning-games")({
  head: () => ({
    meta: [
      { title: "Μαθησιακά Παιχνίδια 2–6 ετών | Ο Πισιπούκ" },
      {
        name: "description",
        content: "Δωρεάν διαδραστικά μαθησιακά παιχνίδια για παιδιά 2–6 ετών: puzzle, memory, λαβύρινθοι, τελείες, αντιστοίχιση και δημιουργία σκηνής.",
      },
    ],
  }),
  component: LearningGames,
});

function LearningGames() {
  const [age, setAge] = useState<Age>("2-3");
  const selected = AGES.find((item) => item.id === age) ?? AGES[0];

  return (
    <SiteLayout>
      <section className="bg-gradient-to-b from-violet-50 via-white to-sky-50 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Εικονικός Παιδικός Σταθμός</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-[#0b3b82] sm:text-6xl">Μαθησιακά Παιχνίδια 🧩</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Κάθε παιχνίδι ανοίγει σε δική του ελαφριά σελίδα, ώστε η ζωγραφική και οι κατασκευές να παραμένουν γρήγορες.
              Διάλεξε ηλικία και ξεκίνα.
            </p>
          </div>

          <div className="mx-auto mt-7 grid max-w-3xl grid-cols-3 gap-2 rounded-[1.5rem] border bg-white p-2 shadow-sm">
            {AGES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setAge(item.id)}
                aria-pressed={age === item.id}
                className={
                  "min-h-12 rounded-xl px-3 py-2 text-sm font-black transition " +
                  (age === item.id ? "bg-primary text-primary-foreground" : "bg-slate-50 text-slate-700 hover:bg-slate-100")
                }
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="mx-auto mt-3 max-w-2xl text-center text-xs leading-5 text-muted-foreground">{selected.note}</p>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GAMES.map((game) => (
              <Link
                key={game.id}
                to="/learning-games/$gameId"
                params={{ gameId: game.id }}
                search={{ age }}
                className="group flex min-h-56 flex-col rounded-[1.8rem] border bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-5xl" aria-hidden="true">{game.emoji}</span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-black text-primary">{game.levels[age]}</span>
                </div>
                <h2 className="mt-5 text-2xl font-black text-[#0b3b82]">{game.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{game.skill}</p>
                <div className="mt-auto pt-5 text-sm font-black text-primary">Παίξε τώρα →</div>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              to="/virtual-preschool"
              className="rounded-full border bg-white px-5 py-3 text-sm font-black text-[#0b3b82] shadow-sm hover:bg-slate-50"
            >
              ← Ζωγραφική & Κατασκευές
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
