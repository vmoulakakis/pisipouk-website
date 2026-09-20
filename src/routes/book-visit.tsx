import { createFileRoute, Link } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Clock3, HeartHandshake } from "lucide-react";
import welcome from "@/assets/parent-welcome.webp";

export const Route = createFileRoute("/book-visit")({
  head: () => ({
    meta: [
      { title: "Κλείστε επίσκεψη | Ο Πισιπούκ" },
      {
        name: "description",
        content:
          "Κλείστε μια προσωπική γνωριμία με τον χώρο και την ομάδα του Πισιπούκ.",
      },
    ],
  }),
  component: BookVisit,
});
function BookVisit() {
  const { lang } = useLanguage();
  const gr = lang === "gr";
  return (
    <SiteLayout>
      <section className="hero-field py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="section-kicker">
              {gr
                ? "Η απόφαση γίνεται πιο απλή από κοντά"
                : "The decision becomes clearer in person"}
            </p>
            <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">
              {gr
                ? "Ελάτε με τις ερωτήσεις σας. Φύγετε με καθαρή εικόνα."
                : "Bring your questions. Leave with clarity."}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {gr
                ? "Γνωρίστε τον χώρο και τη φιλοσοφία μας, μιλήστε για το παιδί σας και ενημερωθείτε προσωπικά για διαθεσιμότητα και voucher 2026–2027."
                : "Meet the space and our approach, tell us about your child and receive personal information about availability and the 2026–2027 voucher."}
            </p>
            <Button asChild size="lg" className="mt-8 rounded-full">
              <Link to="/enrollment">
                {gr ? "Ζητήστε να σας καλέσουμε" : "Request a call"}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          <img
            src={welcome}
            alt={
              gr
                ? "Συνάντηση γνωριμίας γονέα και παιδιού, δημιουργική AI απεικόνιση"
                : "Parent and child introductory visit, creative AI representation"
            }
            className="aspect-[4/3] w-full rounded-[2.5rem] object-cover shadow-2xl"
          />
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <h2 className="text-center text-4xl font-black">
            {gr
              ? "Τι θα κερδίσετε από την επίσκεψη"
              : "What you will get from the visit"}
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [
                Clock3,
                gr
                  ? "Σύντομη, προσωπική συνάντηση"
                  : "A short personal meeting",
              ],
              [
                HeartHandshake,
                gr
                  ? "Συζήτηση για τις ανάγκες του παιδιού"
                  : "A conversation about your child",
              ],
              [CheckCircle2, gr ? "Σαφή επόμενα βήματα" : "Clear next steps"],
            ].map(([Icon, title]) => {
              const I = Icon as typeof Clock3;
              return (
                <div
                  key={String(title)}
                  className="rounded-3xl border bg-card p-6 text-center"
                >
                  <I className="mx-auto h-8 w-8 text-primary" />
                  <h3 className="mt-4 text-lg font-black">{title as string}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
