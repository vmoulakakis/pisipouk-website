import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import pisipoukLogo from "@/assets/pisipouk-logo.webp";

export const Route = createFileRoute("/parent-zone")({
  head: () => ({
    meta: [
      { title: "Parent Zone | Online Preschool Πισιπούκ" },
      {
        name: "description",
        content:
          "Οδηγός για γονείς παιδιών 2–6 ετών: πώς να χρησιμοποιείτε το Online Preschool, διάρκεια δραστηριοτήτων, επίβλεψη και τι καλλιεργεί κάθε ηλικία.",
      },
    ],
  }),
  component: ParentZone,
});

const ageGuides = [
  {
    age: "2–3 ετών",
    emoji: "🧸",
    time: "5–10 λεπτά ανά δραστηριότητα",
    points: [
      "Μεγάλα αντικείμενα, λίγες επιλογές και σύντομα βήματα.",
      "Περισσότερη συμμετοχή του ενήλικα σε κόψιμο, κόλλα και οργάνωση υλικών.",
      "Παιχνίδι με χρώματα, απλές κατηγορίες, μέτρημα 1–3 και ονομασία αντικειμένων.",
    ],
  },
  {
    age: "4–5 ετών",
    emoji: "🚀",
    time: "10–15 λεπτά ανά δραστηριότητα",
    points: [
      "Περισσότερες επιλογές, μοτίβα, απλές ιστορίες και σύγκριση.",
      "Ο γονιός βοηθά με ερωτήσεις αντί να δίνει αμέσως τη λύση.",
      "Κατασκευές με απλό δίπλωμα, κόψιμο με επίβλεψη και περισσότερη αυτονομία.",
    ],
  },
  {
    age: "5–6 ετών",
    emoji: "🏰",
    time: "10–20 λεπτά ανά δραστηριότητα",
    points: [
      "Σύνθετες σκηνές, διαδοχή, μεγαλύτερα puzzles και μέτρημα έως το 10.",
      "Μικρές ιστορίες, λεξιλόγιο, κανόνες παιχνιδιού και επίλυση προβλήματος.",
      "Πιο αναλυτικές κατασκευές με στάδια και printable templates.",
    ],
  },
] as const;

function ParentZone() {
  return (
    <SiteLayout>
      <section className="bg-gradient-to-b from-amber-50 via-white to-sky-50 py-10 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto grid max-w-4xl items-center gap-5 sm:grid-cols-[150px_1fr]">
            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border bg-white shadow-sm">
              <img src={pisipoukLogo} alt="Ο Πισιπούκ" className="h-32 w-32 object-contain" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Parent Zone</p>
              <h1 className="mt-2 text-4xl font-black text-[#0b3b82] sm:text-6xl">Παίζουμε μαζί, χωρίς πίεση</h1>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                Μικρές, δημιουργικές δραστηριότητες για το σπίτι. Ο στόχος δεν είναι η «τέλεια απάντηση», αλλά η παρατήρηση, η συζήτηση, η προσπάθεια και η χαρά της δημιουργίας.
              </p>
            </div>
          </div>

          <div className="mt-9 grid gap-5 lg:grid-cols-3">
            {ageGuides.map((guide) => (
              <article key={guide.age} className="rounded-[2rem] border bg-white p-6 shadow-sm">
                <div className="text-4xl">{guide.emoji}</div>
                <h2 className="mt-3 text-2xl font-black text-[#0b3b82]">{guide.age}</h2>
                <p className="mt-2 rounded-full bg-sky-50 px-3 py-2 text-xs font-black text-sky-800">{guide.time}</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                  {guide.points.map((point) => <li key={point}>• {point}</li>)}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <article className="rounded-[2rem] border bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-[#0b3b82]">👩‍👧 Πότε βοηθά ο ενήλικας</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                <li>• Κόψιμο, τρύπημα, μικρά εξαρτήματα και υλικά που χρειάζονται ιδιαίτερη προσοχή.</li>
                <li>• Όταν το παιδί εκνευρίζεται: μικρή παύση, όχι πίεση για «σωστή» απάντηση.</li>
                <li>• Με ερωτήσεις όπως «Τι παρατηρείς;», «Τι θα δοκίμαζες;», «Ποιο είναι διαφορετικό;».</li>
              </ul>
            </article>
            <article className="rounded-[2rem] border bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-[#0b3b82]">🎯 Τι καλλιεργούμε</h2>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-black">
                {["Γλώσσα","Αριθμοί","Παρατήρηση","Μνήμη","Λεπτή κινητικότητα","Σειροθέτηση","Συναισθήματα","Δημιουργικότητα"].map((skill) => (
                  <span key={skill} className="rounded-full bg-emerald-50 px-3 py-2 text-emerald-800">{skill}</span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Οι δραστηριότητες είναι για παιχνίδι και εξάσκηση στο σπίτι και δεν αποτελούν αναπτυξιακή αξιολόγηση ή διαγνωστικό εργαλείο.
              </p>
            </article>
          </div>

          <div className="mt-8 rounded-[2rem] border bg-[#0b3b82] p-6 text-white shadow-sm sm:p-8">
            <h2 className="text-2xl font-black">Έτοιμοι για το σημερινό πρόγραμμα;</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
              Επιλέξτε ηλικία και αφήστε τον Πισιπούκ να προτείνει μια μικρή καθημερινή διαδρομή με ζωγραφική, παιχνίδι και δημιουργία.
            </p>
            <Link to="/virtual-preschool" className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-[#0b3b82]">
              Σήμερα με τον Πισιπούκ →
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
