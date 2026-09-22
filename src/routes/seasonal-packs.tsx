import { Link, createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import pisipoukLogo from "@/assets/pisipouk-logo.webp";

const PACKS = [
  { id: "autumn", emoji: "🍂", title: "Φθινόπωρο", note: "Φύλλα, χρώματα και μικρές παρατηρήσεις στη φύση." },
  { id: "christmas", emoji: "🎄", title: "Χριστούγεννα", note: "Γιορτινά σχήματα, στολίδια και δημιουργικές κατασκευές." },
  { id: "carnival", emoji: "🎭", title: "Απόκριες", note: "Μάσκες, μεταμφίεση, χρώματα και φαντασία." },
  { id: "march25", emoji: "🇬🇷", title: "25η Μαρτίου", note: "Σύμβολα, χρώματα και δημιουργικές δραστηριότητες." },
  { id: "easter", emoji: "🐰", title: "Πάσχα", note: "Αυγά, λαγουδάκια, ανοιξιάτικα μοτίβα και χειροτεχνίες." },
  { id: "summer", emoji: "☀️", title: "Καλοκαίρι", note: "Θάλασσα, ήλιος, φρούτα και καλοκαιρινές εικόνες." },
  { id: "oct28", emoji: "🇬🇷", title: "28η Οκτωβρίου", note: "Μπλε-λευκά μοτίβα, περιστέρι ειρήνης και printable δραστηριότητες." },
] as const;

export const Route = createFileRoute("/seasonal-packs")({
  head: () => ({
    meta: [
      { title: "Seasonal Packs | Ο Πισιπούκ" },
      { name: "description", content: "Εποχιακά πακέτα δραστηριοτήτων για παιδιά 2–6 ετών: ζωγραφική, puzzle, κατασκευή και printable A4." },
    ],
  }),
  component: SeasonalPacks,
});

function SeasonalPacks() {
  return (
    <SiteLayout>
      <section className="bg-gradient-to-b from-orange-50 via-white to-sky-50 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto grid max-w-4xl items-center gap-5 sm:grid-cols-[150px_1fr]">
            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border bg-white shadow-sm">
              <img src={pisipoukLogo} alt="Ο Πισιπούκ" className="h-32 w-32 object-contain" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Seasonal Packs</p>
              <h1 className="mt-2 text-4xl font-black text-[#0b3b82] sm:text-6xl">Παίζουμε με τις εποχές</h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Κάθε πακέτο έχει ζωγραφική, τυχαίο puzzle, κατασκευή, printable A4 και ενότητα «Τι καλλιεργεί».
              </p>
            </div>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PACKS.map((pack) => (
              <Link key={pack.id} to="/seasonal-packs/$season" params={{ season: pack.id }}
                className="group rounded-[1.8rem] border bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="text-5xl">{pack.emoji}</div>
                <h2 className="mt-4 text-2xl font-black text-[#0b3b82]">{pack.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{pack.note}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-black">
                  <span className="rounded-full bg-pink-50 px-2 py-1">🎨 Ζωγραφική</span>
                  <span className="rounded-full bg-violet-50 px-2 py-1">🧩 Puzzle</span>
                  <span className="rounded-full bg-amber-50 px-2 py-1">✂️ Κατασκευή</span>
                  <span className="rounded-full bg-sky-50 px-2 py-1">🖨️ Printable</span>
                </div>
                <div className="mt-5 text-sm font-black text-primary">Άνοιξε το pack →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
