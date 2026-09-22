import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import pisipoukLogo from "@/assets/pisipouk-logo.webp";

type Age = "2-3" | "4-5" | "5-6";

const AGES: Array<{ id: Age; label: string; note: string }> = [
  { id: "2-3", label: "2–3 ετών", note: "Μεγάλα αντικείμενα και 4 επιλογές ανά γύρο." },
  { id: "4-5", label: "4–5 ετών", note: "6 επιλογές, περισσότερες κατηγορίες και περισσότερη παρατήρηση." },
  { id: "5-6", label: "5–6 ετών", note: "8 επιλογές και πιο σύνθετη ταξινόμηση." },
];

const GAMES = [
  { id: "sort", emoji: "🧺", title: "Βάλε τα στη σωστή κατηγορία", skill: "Κατηγοριοποίηση · γλώσσα · συγκέντρωση" },
  { id: "dress", emoji: "🧢", title: "Ντύσε τον Πισιπούκ", skill: "Σχήμα σώματος · λεξιλόγιο · λεπτή κινητικότητα" },
  { id: "school-bag", emoji: "🎒", title: "Φτιάξε τη σχολική τσάντα", skill: "Καθημερινές έννοιες · επιλογή · λογική" },
  { id: "fruit-basket", emoji: "🍎", title: "Βάλε τα φρούτα στο καλάθι", skill: "Αντιστοίχιση · κατηγορίες · λεξιλόγιο" },
] as const;

export const Route = createFileRoute("/learning-games")({
  head: () => ({
    meta: [
      { title: "Μαθησιακά Παιχνίδια 2–6 ετών | Ο Πισιπούκ" },
      { name: "description", content: "Διαδραστικά drag & drop μαθησιακά παιχνίδια για παιδιά 2–6 ετών, με νέο τυχαίο γύρο κάθε φορά και παιδαγωγικές δεξιότητες για γονείς και εκπαιδευτικούς." },
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
          <div className="mx-auto grid max-w-4xl items-center gap-5 sm:grid-cols-[150px_1fr]">
            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border bg-white shadow-sm">
              <img src={pisipoukLogo} alt="Ο Πισιπούκ" className="h-32 w-32 object-contain" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Μαθαίνω παίζοντας</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-[#0b3b82] sm:text-6xl">Μαθησιακά Παιχνίδια</h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Κάθε «Νέος γύρος» ανακατεύει αντικείμενα και επιλογές, ώστε το παιδί να παρατηρεί και να σκέφτεται ξανά — όχι να απομνημονεύει.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-7 grid max-w-3xl grid-cols-3 gap-2 rounded-[1.5rem] border bg-white p-2 shadow-sm">
            {AGES.map((item) => (
              <button key={item.id} type="button" onClick={() => setAge(item.id)} aria-pressed={age === item.id}
                className={"min-h-12 rounded-xl px-2 py-2 text-sm font-black transition " + (age === item.id ? "bg-primary text-primary-foreground" : "bg-slate-50 text-slate-700 hover:bg-slate-100")}>
                {item.label}
              </button>
            ))}
          </div>
          <p className="mx-auto mt-3 max-w-2xl text-center text-xs leading-5 text-muted-foreground">{selected.note}</p>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {GAMES.map((game) => (
              <Link key={game.id} to="/learning-games/$gameId" params={{ gameId: game.id }} search={{ age }}
                className="group flex min-h-56 flex-col rounded-[1.8rem] border bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-5xl" aria-hidden="true">{game.emoji}</span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700">ΤΥΧΑΙΟΣ ΓΥΡΟΣ</span>
                </div>
                <h2 className="mt-5 text-2xl font-black text-[#0b3b82]">{game.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{game.skill}</p>
                <div className="mt-auto pt-5 text-sm font-black text-primary">Παίξε τώρα →</div>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/seasonal-packs" className="rounded-full bg-primary px-5 py-3 text-sm font-black text-primary-foreground">🍂 Seasonal Packs</Link>
            <Link to="/virtual-preschool" className="rounded-full border bg-white px-5 py-3 text-sm font-black text-[#0b3b82] shadow-sm">← Ζωγραφική & Κατασκευές</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
