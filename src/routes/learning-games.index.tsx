import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import pisipoukLogo from "@/assets/pisipouk-logo.webp";

type Age = "2-3" | "4-5" | "5-6";

const AGES: Array<{ id: Age; label: string; note: string }> = [
  { id: "2-3", label: "2–3 ετών", note: "Λίγες επιλογές, μεγάλα αντικείμενα, σύντομοι γύροι και απλή αρίθμηση." },
  { id: "4-5", label: "4–5 ετών", note: "Περισσότερες επιλογές, μνήμη, κατηγορίες, μοτίβα και μεσαίοι λαβύρινθοι." },
  { id: "5-6", label: "5–6 ετών", note: "Μεγαλύτερες διαδρομές, περισσότερα ζευγάρια, σύνθετα μοτίβα και στρατηγική." },
];

const GAMES = [
  { id: "sort", emoji: "🧺", title: "Σωστή κατηγορία", skill: "Κατηγοριοποίηση · γλώσσα · συγκέντρωση", badge: "DRAG & DROP" },
  { id: "dress", emoji: "🧢", title: "Ντύσε τον Πισιπούκ", skill: "Σχήμα σώματος · λεξιλόγιο · λεπτή κινητικότητα", badge: "DRAG & DROP" },
  { id: "school-bag", emoji: "🎒", title: "Φτιάξε τη σχολική τσάντα", skill: "Καθημερινές έννοιες · επιλογή · λογική", badge: "DRAG & DROP" },
  { id: "fruit-basket", emoji: "🍎", title: "Φρούτα στο καλάθι", skill: "Αντιστοίχιση · κατηγορίες · λεξιλόγιο", badge: "DRAG & DROP" },
  { id: "snake", emoji: "🐍", title: "Το Φιδάκι των Αριθμών", skill: "Αρίθμηση · ποσότητες · αναμονή σειράς", badge: "ΖΑΡΙ" },
  { id: "maze", emoji: "🌀", title: "Λαβύρινθος του Πισιπούκ", skill: "Χωρικός προσανατολισμός · σχεδιασμός · συγκέντρωση", badge: "ΝΕΟΣ ΛΑΒΥΡΙΝΘΟΣ" },
  { id: "memory", emoji: "🧠", title: "Παιχνίδι Μνήμης", skill: "Οπτική μνήμη · προσοχή · αντιστοίχιση", badge: "ΤΥΧΑΙΑ ΖΕΥΓΑΡΙΑ" },
  { id: "pattern", emoji: "🔷", title: "Βρες το Μοτίβο", skill: "Λογική · πρόβλεψη · παρατήρηση", badge: "ΝΕΟ ΜΟΤΙΒΟ" },
  { id: "count", emoji: "🔢", title: "Μέτρα και Βρες", skill: "Αρίθμηση · ποσότητες · αντιστοίχιση", badge: "ΝΕΑ ΠΟΣΟΤΗΤΑ" },
  { id: "odd-one", emoji: "🧐", title: "Ποιο δεν ταιριάζει;", skill: "Κατηγοριοποίηση · λογική · λεξιλόγιο", badge: "ΝΕΟΣ ΓΥΡΟΣ" },
  { id: "size-order", emoji: "📏", title: "Από μικρό σε μεγάλο", skill: "Σειροθέτηση · σύγκριση · συγκέντρωση", badge: "ΝΕΑ ΣΕΙΡΑ" },
  { id: "colors-shapes", emoji: "🎨", title: "Χρώματα & Σχήματα", skill: "Οπτική διάκριση · χρώματα · σχήματα", badge: "ΝΕΟΣ ΣΤΟΧΟΣ" },
] as const;

export const Route = createFileRoute("/learning-games/")({
  head: () => ({
    meta: [
      { title: "Μαθησιακά Παιχνίδια 2–6 ετών | Ο Πισιπούκ" },
      { name: "description", content: "Διαδραστικά μαθησιακά παιχνίδια για παιδιά 2–6 ετών: drag & drop, φιδάκι αριθμών, λαβύρινθος, μνήμη και μοτίβα, με τυχαίους γύρους ανά ηλικία." },
    ],
  }),
  component: LearningGames,
});

function LearningGames() {
  const [age, setAge] = useState<Age>("2-3");
  const [childName, setChildName] = useState("");
  const [savedName, setSavedName] = useState("");
  const selected = AGES.find((item) => item.id === age) ?? AGES[0];

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pisipouk_child_first_name") ?? "";
      setChildName(stored);
      setSavedName(stored);
    } catch {}
  }, []);

  const saveChildName = () => {
    const clean = childName.trim().replace(/\s+/g, " ").slice(0, 24);
    setChildName(clean);
    setSavedName(clean);
    try {
      if (clean) localStorage.setItem("pisipouk_child_first_name", clean);
      else localStorage.removeItem("pisipouk_child_first_name");
    } catch {}
  };

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
                12 παιχνίδια που προσαρμόζονται στην ηλικία. Κάθε νέος γύρος αλλάζει επιλογές, σειρά, διαδρομή, ποσότητες ή ζευγάρια ώστε το παιδί να σκέφτεται ξανά.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-7 grid max-w-3xl grid-cols-3 gap-2 rounded-[1.5rem] border bg-white p-2 shadow-sm">
            {AGES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setAge(item.id)}
                aria-pressed={age === item.id}
                className={"min-h-12 rounded-xl px-2 py-2 text-sm font-black transition " + (age === item.id ? "bg-primary text-primary-foreground" : "bg-slate-50 text-slate-700 hover:bg-slate-100")}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="mx-auto mt-3 max-w-2xl text-center text-xs leading-5 text-muted-foreground">{selected.note}</p>

          <div className="mx-auto mt-5 max-w-xl rounded-2xl border bg-white p-4 shadow-sm">
            <label htmlFor="child-first-name" className="text-sm font-black text-[#0b3b82]">Πώς θέλεις να σε φωνάζει ο Πισιπούκ;</label>
            <div className="mt-2 flex gap-2">
              <input
                id="child-first-name"
                value={childName}
                onChange={(event) => setChildName(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter") saveChildName(); }}
                placeholder="Μικρό όνομα"
                autoComplete="off"
                maxLength={24}
                className="min-w-0 flex-1 rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="button" onClick={saveChildName} className="rounded-xl bg-primary px-4 py-2 text-sm font-black text-primary-foreground">Αποθήκευση</button>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {savedName ? "Ο Πισιπούκ θα μιλά προσωπικά στον/στη " + savedName + "." : "Προαιρετικό. Το όνομα μένει μόνο σε αυτή τη συσκευή και δεν αποστέλλεται στα στατιστικά."}
            </p>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GAMES.map((game) => (
              <a
                key={game.id}
                href={"/learning-games/" + game.id + "?age=" + age}
                className="group flex min-h-64 flex-col rounded-[1.8rem] border bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-5xl" aria-hidden="true">{game.emoji}</span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black text-emerald-700">{game.badge}</span>
                </div>
                <h2 className="mt-5 text-xl font-black leading-tight text-[#0b3b82]">{game.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{game.skill}</p>
                <div className="mt-auto pt-5 text-sm font-black text-primary">Παίξε τώρα →</div>
              </a>
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
