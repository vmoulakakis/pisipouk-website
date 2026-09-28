import { createFileRoute, Link } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  Clock3,
  Leaf,
  ShieldCheck,
  UtensilsCrossed,
  Stethoscope,
  BadgeCheck,
} from "lucide-react";

export const Route = createFileRoute("/nutrition")({
  head: () => ({
    meta: [
      { title: "Διατροφή & Μενού Οκτωβρίου 2026 | Ο Πισιπούκ" },
      {
        name: "description",
        content:
          "Το νέο διαιτολόγιο Οκτωβρίου 2026 του Πισιπούκ: πρωινό 08:00–09:00, κυρίως γεύμα, συνοδευτικά και η προσέγγισή μας στην ποιότητα των πρώτων υλών και την παρασκευή.",
      },
    ],
  }),
  component: NutritionPage,
});

const weeks = [
  {
    title: "28/9/26 – 2/10/26",
    days: [
      ["Δευτέρα 28/9", "Κουλούρι Θεσσαλονίκης με τυρί", "Χορτόσουπα • τυρόπιτα", "ψωμί • φρούτο"],
      ["Τρίτη 29/9", "Ψωμί με μαρμελάδα • φρούτο", "Ψαρόσουπα", "ψωμί • φρούτο"],
      ["Τετάρτη 30/9", "Αβγό • μπανάνα", "Φασολάδα", "ψωμί • τυρί • φρούτο"],
      ["Πέμπτη 1/10", "Γάλα με δημητριακά • φρούτο", "Κοτόπουλο με πατάτες στο φούρνο", "ψωμί • τυρί • σαλάτα • φρούτο"],
      ["Παρασκευή 2/10", "Μπισκότα • βυσσινάδα", "Γιουβαρλάκια", "ψωμί • τυρί • φρούτο"],
    ],
  },
  {
    title: "5/10/26 – 9/10/26",
    days: [
      ["Δευτέρα 5/10", "Τοστ • χυμός", "Σπανακόρυζο", "ψωμί • τυρί • φρούτο"],
      ["Τρίτη 6/10", "Ψωμί με μέλι • φρούτο", "Ψαροκροκέτες με ρύζι", "ψωμί • σαλάτα • φρούτο"],
      ["Τετάρτη 7/10", "Αβγό με ψωμί • μπανάνα", "Φακές", "ψωμί • τυρί • φρούτο"],
      ["Πέμπτη 8/10", "Γάλα με δημητριακά • φρούτο", "Κοτόσουπα", "ψωμί • τυρί • φρούτο"],
      ["Παρασκευή 9/10", "Κουλουράκια • χυμός πορτοκάλι", "Μακαρόνια με κιμά", "ψωμί • τυρί • σαλάτα • φρούτο"],
    ],
  },
  {
    title: "12/10/26 – 16/10/26",
    days: [
      ["Δευτέρα 12/10", "Κέικ • χυμός", "Μακαρόνια με σάλτσα", "ψωμί • τυρί • φρούτο"],
      ["Τρίτη 13/10", "Ψωμί με ταχίνι • φρούτο", "Ψαρόσουπα", "ψωμί • φρούτο"],
      ["Τετάρτη 14/10", "Αβγό • μπανάνα", "Φασολάκια με πατάτες", "ψωμί • τυρί • φρούτο"],
      ["Πέμπτη 15/10", "Γάλα με δημητριακά • φρούτο", "Κοτόπουλο με ρύζι", "ψωμί • τυρί • σαλάτα • φρούτο"],
      ["Παρασκευή 16/10", "Τυρόπιτα • βυσσινάδα", "Κρεατόσουπα με λαχανικά", "ψωμί • τυρί • φρούτο"],
    ],
  },
  {
    title: "19/10/26 – 23/10/26",
    days: [
      ["Δευτέρα 19/10", "Τσουρέκι • χυμός", "Ντοματόσουπα • τυρόπιτα", "φρούτο"],
      ["Τρίτη 20/10", "Ψωμί με μέλι • φρούτο", "Ψαροκροκέτες με ρύζι", "ψωμί • σαλάτα • φρούτο"],
      ["Τετάρτη 21/10", "Αβγό • μπανάνα", "Φακές", "ψωμί • τυρί • φρούτο"],
      ["Πέμπτη 22/10", "Γάλα με δημητριακά • φρούτο", "Κοτόσουπα", "ψωμί • τυρί • φρούτο"],
      ["Παρασκευή 23/10", "Κουλουράκια • βυσσινάδα", "Μπιφτέκια με πατάτες", "ψωμί • τυρί • σαλάτα • φρούτο"],
    ],
  },
];

function NutritionPage() {
  const { lang } = useLanguage();
  const gr = lang === "gr";

  const qualityPoints = gr
    ? [
        [
          Leaf,
          "Ποιότητα πρώτων υλών",
          "Δίνουμε έμφαση σε απλές, αναγνωρίσιμες πρώτες ύλες και σε ποικιλία λαχανικών, οσπρίων, φρούτων, ψαριού, κοτόπουλου και κρέατος μέσα στον μήνα.",
        ],
        [
          UtensilsCrossed,
          "Φροντισμένη παρασκευή",
          "Το μενού βασίζεται σε γνώριμα παιδικά γεύματα, με καθημερινή οργάνωση της παρασκευής και έμφαση στη γεύση, την υφή και την κατάλληλη παρουσίαση για μικρά παιδιά.",
        ],
        [
          Stethoscope,
          "Διαιτολόγος & παιδίατρος",
          "Σύμφωνα με τον κανονισμό λειτουργίας 2026–2027, το διαιτολόγιο καθορίζεται από διαιτολόγο και ελέγχεται κάθε μήνα από την παιδίατρο.",
        ],
        [
          ShieldCheck,
          "Αλλεργίες & ιδιαίτερες ανάγκες",
          "Αλλεργίες, δυσανεξίες και ιατρικές οδηγίες συζητούνται προσωπικά με την οικογένεια πριν την έναρξη και όποτε προκύπτει ανάγκη.",
        ],
      ]
    : [
        [Leaf, "Ingredient quality", "We focus on simple, recognisable ingredients and a varied monthly rotation of vegetables, legumes, fruit, fish, chicken and meat."],
        [UtensilsCrossed, "Careful preparation", "Meals are organised around familiar child-friendly dishes, with attention to taste, texture and age-appropriate presentation."],
        [Stethoscope, "Dietitian & pediatrician", "Under the 2026–2027 operating rules, the meal plan is set by a dietitian and reviewed monthly by the pediatrician."],
        [ShieldCheck, "Allergies & individual needs", "Allergies, intolerances and medical guidance are discussed directly with each family."],
      ];

  return (
    <SiteLayout>
      <section className="hero-field py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="section-kicker">
            {gr ? "Η φροντίδα συνεχίζεται στο τραπέζι" : "Care continues at the table"}
          </p>
          <h1 className="mt-3 max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">
            {gr
              ? "Νέο διαιτολόγιο Οκτωβρίου 2026"
              : "New October 2026 meal plan"}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            {gr
              ? "Πρωινό 08:00–09:00, κυρίως γεύμα και συνοδευτικά σε ένα πρόγραμμα με ποικιλία μέσα στην εβδομάδα και σαφή ενημέρωση προς τους γονείς."
              : "Breakfast 08:00–09:00, main meal and accompaniments in a varied weekly plan with clear information for families."}
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {[
              [
                Clock3,
                gr ? "Πρωινό 08:00–09:00" : "Breakfast 08:00–09:00",
                gr
                  ? "Το πρώτο οργανωμένο γεύμα της ημέρας."
                  : "The first structured meal of the day.",
              ],
              [
                UtensilsCrossed,
                gr ? "Ποικιλία μέσα στον μήνα" : "Variety through the month",
                gr
                  ? "Όσπρια, λαχανικά, ψάρι, κοτόπουλο, κρέας, ζυμαρικά και σούπες."
                  : "Legumes, vegetables, fish, chicken, meat, pasta and soups.",
              ],
              [
                ShieldCheck,
                gr ? "Προσωπική ενημέρωση" : "Personal guidance",
                gr
                  ? "Ειδικές διατροφικές ανάγκες συζητούνται με την οικογένεια."
                  : "Individual dietary needs are discussed with each family.",
              ],
            ].map(([Icon, title, body]) => {
              const I = Icon as typeof Leaf;
              return (
                <div key={String(title)} className="rounded-[1.5rem] border bg-white/80 p-5">
                  <I className="h-7 w-7 text-primary" />
                  <h2 className="mt-3 font-black">{title as string}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {body as string}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-4 pt-10 sm:pt-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="rounded-[2.5rem] border bg-card p-7 shadow-sm sm:p-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-leaf px-4 py-2 text-sm font-black">
                <BadgeCheck className="h-5 w-5" />
                {gr
                  ? "Πρώτες ύλες, παρασκευή & έλεγχος"
                  : "Ingredients, preparation & oversight"}
              </div>
              <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                {gr
                  ? "Η ποιότητα του γεύματος ξεκινά πριν φτάσει στο πιάτο."
                  : "Meal quality starts before food reaches the plate."}
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                {gr
                  ? "Δεν μας ενδιαφέρει μόνο το τι γράφει το μενού, αλλά και η λογική πίσω από αυτό: ποικιλία πρώτων υλών, φροντισμένη προετοιμασία, κατάλληλη παρουσίαση για την ηλικία και σαφής συνεννόηση με την οικογένεια."
                  : "We care not only about what is on the menu, but also the thinking behind it: ingredient variety, careful preparation, age-appropriate presentation and clear communication with families."}
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {qualityPoints.map(([Icon, title, body]) => {
                const I = Icon as typeof Leaf;
                return (
                  <div key={String(title)} className="rounded-[1.5rem] bg-muted/55 p-5">
                    <I className="h-7 w-7 text-primary" />
                    <h3 className="mt-3 font-black">{title as string}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {body as string}
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="mt-6 text-xs leading-5 text-muted-foreground">
              {gr
                ? "Σημείωση: αναφορές σε συγκεκριμένες πιστοποιήσεις ή συστήματα (π.χ. HACCP / ISO 22000) εμφανίζονται ως επίσημες μόνο όταν υπάρχει το αντίστοιχο τεκμηριωμένο έγγραφο."
                : "Note: specific certification claims (e.g. HACCP / ISO 22000) are displayed as formal certifications only when supporting documentation is available."}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-kicker">
              {gr ? "Οκτώβριος 2026" : "October 2026"}
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              {gr
                ? "Το νέο μηνιαίο μενού, καθαρά σε κάθε οθόνη"
                : "The new monthly menu, clear on every screen"}
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              {gr
                ? "Το παρακάτω μενού έχει περαστεί από το νέο διαιτολόγιο Οκτωβρίου 2026 που δόθηκε από τη διοίκηση. Η πρώτη εβδομάδα ξεκινά στις 28/9 και το πρόγραμμα που δόθηκε φτάνει έως 23/10."
                : "The menu below follows the October 2026 plan supplied by the school. The first week begins on 28 September and the supplied schedule runs through 23 October."}
            </p>
          </div>

          <div className="mt-10 grid gap-7">
            {weeks.map((week) => (
              <section
                key={week.title}
                className="rounded-[2rem] border bg-card p-5 shadow-sm sm:p-7"
              >
                <h3 className="text-2xl font-black">{week.title}</h3>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  {week.days.map(([day, breakfast, main, sides]) => (
                    <article key={day} className="rounded-2xl bg-muted/45 p-5">
                      <h4 className="text-lg font-black">{day}</h4>
                      <dl className="mt-4 grid gap-3 text-sm">
                        <div>
                          <dt className="font-black text-primary">
                            Πρωινό 08:00–09:00
                          </dt>
                          <dd className="mt-1 leading-6">{breakfast}</dd>
                        </div>
                        <div>
                          <dt className="font-black">Κυρίως γεύμα</dt>
                          <dd className="mt-1 leading-6">{main}</dd>
                        </div>
                        <div>
                          <dt className="font-black text-muted-foreground">
                            Συνοδευτικά
                          </dt>
                          <dd className="mt-1 leading-6">{sides}</dd>
                        </div>
                      </dl>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-[2rem] border bg-white p-6 shadow-sm sm:p-8">
            <p className="section-kicker">
              {gr ? "Οδηγίες & χρήσιμες πληροφορίες" : "Guidance & useful information"}
            </p>
            <h2 className="mt-3 text-3xl font-black">
              {gr
                ? "Πώς διαβάζεται και εφαρμόζεται το μηνιαίο μενού"
                : "How to read and use the monthly menu"}
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {(gr
                ? [
                    "Το «Πρωινό» είναι το πρώτο οργανωμένο γεύμα και σερβίρεται 08:00–09:00.",
                    "Κάθε ημέρα εμφανίζονται ξεχωριστά το κυρίως γεύμα και τα συνοδευτικά του.",
                    "Το μενού μπορεί να προσαρμοστεί όταν υπάρχει θέμα διαθεσιμότητας, εποχικότητας ή ειδικής διατροφικής ανάγκης.",
                    "Αλλεργίες, δυσανεξίες και ιατρικές οδηγίες πρέπει να συζητούνται προσωπικά με τον σταθμό.",
                    "Η ποικιλία αξιολογείται σε επίπεδο εβδομάδας και μήνα — όχι από ένα μόνο γεύμα.",
                    "Για οποιαδήποτε αλλαγή ή διευκρίνιση οι γονείς ενημερώνονται από τον σταθμό.",
                  ]
                : [
                    "Breakfast is the first structured meal and is served 08:00–09:00.",
                    "Each day lists the main meal separately from its accompaniments.",
                    "The menu may be adjusted for availability, seasonality or individual dietary needs.",
                    "Allergies, intolerances and medical guidance should be discussed directly with the school.",
                    "Variety is considered across the week and month rather than from a single meal.",
                    "Families can contact the school for current changes or clarifications.",
                  ]
              ).map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl bg-muted/45 p-4">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-bold leading-6">{item}</span>
                </div>
              ))}
            </div>

            <Button asChild size="lg" className="mt-7 rounded-full">
              <Link to="/contact">
                {gr ? "Ρωτήστε μας για τη διατροφή" : "Ask us about meals"}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
