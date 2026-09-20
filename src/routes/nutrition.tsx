import { createFileRoute, Link } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Leaf,
  ShieldCheck,
  UtensilsCrossed,
} from "lucide-react";
import menuImage from "@/assets/sample-menu-september-2026.webp";

export const Route = createFileRoute("/nutrition")({
  head: () => ({
    meta: [
      { title: "Διατροφή & Ενδεικτικό Μενού | Ο Πισιπούκ" },
      {
        name: "description",
        content:
          "Η διατροφική προσέγγιση του Πισιπούκ, διαχείριση αλλεργιών και ενδεικτικό μηνιαίο μενού Σεπτεμβρίου 2026.",
      },
    ],
  }),
  component: NutritionPage,
});

function NutritionPage() {
  const { lang } = useLanguage();
  const gr = lang === "gr";
  return (
    <SiteLayout>
      <section className="hero-field py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8">
          <div>
            <p className="section-kicker">
              {gr
                ? "Η φροντίδα συνεχίζεται στο τραπέζι"
                : "Care continues at the table"}
            </p>
            <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">
              {gr
                ? "Φαγητό που το παιδί αναγνωρίζει και χαίρεται"
                : "Food children recognise and enjoy"}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {gr
                ? "Το μενού οργανώνεται ώστε η καθημερινή διατροφή να έχει ποικιλία, οικείες γεύσεις και καθαρή ενημέρωση προς την οικογένεια."
                : "Our menu is organised around variety, familiar flavours and clear communication with families."}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              [
                Leaf,
                gr ? "Εποχικότητα" : "Seasonality",
                gr
                  ? "Προσαρμογή των επιλογών στην εποχή και στη διαθεσιμότητα."
                  : "Choices adapt to season and availability.",
              ],
              [
                UtensilsCrossed,
                gr ? "Ποικιλία" : "Variety",
                gr
                  ? "Εναλλαγή οσπρίων, λαχανικών, κρέατος, ψαριού και γαλακτοκομικών."
                  : "A varied rotation of food groups.",
              ],
              [
                ShieldCheck,
                gr ? "Αλλεργίες" : "Allergies",
                gr
                  ? "Κάθε ειδική ανάγκη συζητείται και καταγράφεται πριν την έναρξη."
                  : "Every special requirement is discussed and recorded before starting.",
              ],
            ].map(([Icon, title, body]) => {
              const CardIcon = Icon as typeof Leaf;
              return (
                <div
                  key={String(title)}
                  className="flex gap-4 rounded-[1.5rem] border bg-white/75 p-5"
                >
                  <CardIcon className="h-7 w-7 shrink-0 text-primary" />
                  <div>
                    <h2 className="font-black">{title as string}</h2>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {body as string}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-kicker">
              {gr ? "Παράδειγμα στην πράξη" : "A practical example"}
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              {gr
                ? "Ενδεικτικό μενού Σεπτεμβρίου 2026"
                : "Sample September 2026 menu"}
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              {gr
                ? "Το πραγματικό μενού της τρέχουσας εβδομάδας επιβεβαιώνεται από τον σταθμό. Το παρακάτω δείχνει τη δομή και τη λογική ενός ολοκληρωμένου μήνα."
                : "The current weekly menu is confirmed by the school. The example below shows the structure of a complete month."}
            </p>
          </div>
          <figure className="mt-10 overflow-hidden rounded-[2rem] border bg-white p-2 shadow-xl">
            <img
              src={menuImage}
              alt={
                gr
                  ? "Ενδεικτικό μηνιαίο μενού Πισιπούκ Σεπτεμβρίου 2026"
                  : "Sample Pisipouk monthly menu for September 2026"
              }
              className="w-full rounded-[1.5rem]"
            />
            <figcaption className="flex items-start gap-2 p-4 text-sm text-muted-foreground">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {gr
                ? "Ενδεικτικό παράδειγμα. Πιάτα, συστατικά και ημέρες μπορούν να αλλάξουν. Για αλλεργίες ή ειδικές διατροφικές ανάγκες απαιτείται προσωπική συνεννόηση."
                : "Illustrative example. Dishes, ingredients and days may change. Allergies and special dietary needs require personal consultation."}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-ink py-16 text-white sm:py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <h2 className="text-3xl font-black sm:text-4xl">
            {gr
              ? "Τι συζητάμε πριν ξεκινήσει το παιδί"
              : "What we discuss before your child starts"}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {(gr
              ? [
                  "Αλλεργίες και δυσανεξίες",
                  "Ιατρικές οδηγίες",
                  "Τροφές που αποφεύγονται",
                  "Ιδιαίτερες συνήθειες και στάδιο αυτονομίας",
                ]
              : [
                  "Allergies and intolerances",
                  "Medical guidance",
                  "Foods to avoid",
                  "Eating habits and independence",
                ]
            ).map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <Check className="h-5 w-5 text-sun" />
                <span className="font-bold">{item}</span>
              </div>
            ))}
          </div>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="mt-8 rounded-full"
          >
            <Link to="/contact">
              {gr ? "Μιλήστε μαζί μας" : "Talk to us"}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
