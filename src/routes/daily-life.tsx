import { createFileRoute, Link } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bed, HeartHandshake, Sun, Utensils } from "lucide-react";
import arrival from "@/assets/pisipouk-arrival.webp";
import creative from "@/assets/real-creative-table.webp";
import circle from "@/assets/real-circle-play.webp";

const SCHEDULE = [
  ["07:00–08:00", "Προσέλευση & ελεύθερο παιχνίδι", "Arrival & free play"],
  ["08:00–09:00", "Πρωινός κύκλος", "Morning circle"],
  ["09:30–10:30", "Παιδαγωγική δραστηριότητα", "Learning activity"],
  ["10:30–11:00", "Δεκατιανό", "Morning snack"],
  ["11:00–12:00", "Δημιουργία & κίνηση", "Making & movement"],
  ["12:00–13:00", "Γεύμα", "Lunch"],
  ["13:00–14:30", "Ήρεμη ώρα & ξεκούραση", "Quiet time & rest"],
  ["14:30–16:00", "Παιχνίδι & αποχώρηση", "Play & departure"],
] as const;

export const Route = createFileRoute("/daily-life")({
  head: () => ({
    meta: [
      { title: "Η καθημερινότητά μας | Ο Πισιπούκ" },
      {
        name: "description",
        content:
          "Μια ολοκληρωμένη εικόνα της ημέρας στον Πισιπούκ, από την ήρεμη προσαρμογή έως το παιχνίδι, το γεύμα και την ξεκούραση.",
      },
    ],
  }),
  component: DailyLife,
});

function DailyLife() {
  const { lang } = useLanguage();
  const gr = lang === "gr";
  return (
    <SiteLayout>
      <section className="hero-field py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="section-kicker">
              {gr
                ? "Μια μέρα με ρυθμό και φροντίδα"
                : "A day with rhythm and care"}
            </p>
            <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">
              {gr
                ? "Ξέρεις πώς περνά το παιδί σου — από το πρώτο καλημέρα"
                : "Know how your child spends the day — from the first hello"}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {gr
                ? "Σταθερές στιγμές δίνουν ασφάλεια. Παιχνίδι, δημιουργία και χρόνος για ανάσα δίνουν χώρο στο παιδί να ανθίσει."
                : "Familiar moments create security. Play, creativity and quiet time help each child flourish."}
            </p>
          </div>
          <figure className="photo-frame rotate-1 overflow-hidden rounded-[2.5rem] border-8 border-white shadow-2xl">
            <img
              src={arrival}
              alt={
                gr
                  ? "Παιδί και γονέας φτάνουν στον Πισιπούκ, δημιουργική AI απεικόνιση"
                  : "Parent and child arriving at Pisipouk, creative AI representation"
              }
              className="aspect-[4/3] w-full object-cover"
            />
            <figcaption className="bg-white px-5 py-3 text-xs font-bold text-muted-foreground">
              {gr
                ? "Δημιουργική AI απεικόνιση · χωρίς αναγνωρίσιμο παιδικό πρόσωπο"
                : "Creative AI representation · no identifiable child face"}
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="section-kicker">
              {gr ? "Ο ημερήσιος χάρτης" : "The daily map"}
            </p>
            <h2 className="mt-3 text-4xl font-black">
              {gr ? "Από τις 07:00 έως τις 16:00" : "From 07:00 to 16:00"}
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              {gr
                ? "Το ωράριο είναι ο οδηγός· οι ανάγκες της ομάδας και κάθε παιδιού παραμένουν στο κέντρο."
                : "The schedule is a guide; the needs of the group and each child remain central."}
            </p>
          </div>
          <ol className="space-y-3">
            {SCHEDULE.map((item, i) => (
              <li
                key={item[0]}
                className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border bg-card p-4 sm:grid-cols-[7rem_auto_1fr] sm:items-center"
              >
                <span className="font-mono text-sm font-bold text-primary">
                  {item[0]}
                </span>
                <span className="hidden h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-black text-white sm:flex">
                  {i + 1}
                </span>
                <strong>{gr ? item[1] : item[2]}</strong>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="bg-ink py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-5 md:grid-cols-4">
            {[
              [HeartHandshake, gr ? "Ήρεμη προσαρμογή" : "Gentle adaptation"],
              [Sun, gr ? "Κίνηση & αυλή" : "Movement & outdoors"],
              [Utensils, gr ? "Γεύμα με φροντίδα" : "Caring meals"],
              [Bed, gr ? "Χρόνος ξεκούρασης" : "Time to rest"],
            ].map(([Icon, title]) => {
              const I = Icon as typeof Sun;
              return (
                <div
                  key={String(title)}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6"
                >
                  <I className="h-7 w-7 text-sun" />
                  <h3 className="mt-5 text-xl font-black">{title as string}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            <figure className="overflow-hidden rounded-[2rem]">
              <img
                src={creative}
                alt={
                  gr
                    ? "Πραγματική δημιουργική δραστηριότητα, φωτογραφημένη από πάνω"
                    : "Real creative activity, photographed from above"
                }
                className="aspect-[4/3] w-full object-cover"
              />
            </figure>
            <figure className="overflow-hidden rounded-[2rem]">
              <img
                src={circle}
                alt={
                  gr
                    ? "Πραγματική ομαδική δραστηριότητα στην αυλή, φωτογραφημένη από ψηλά"
                    : "Real outdoor group activity, photographed from above"
                }
                className="aspect-[4/3] w-full object-cover"
              />
            </figure>
          </div>
          <div className="mt-10 rounded-[2rem] bg-sun p-8 sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-black">
                {gr
                  ? "Θέλεις να δεις τη ροή από κοντά;"
                  : "Want to experience the rhythm in person?"}
              </h2>
              <p className="mt-2 text-foreground/75">
                {gr
                  ? "Μια σύντομη επίσκεψη απαντά σε όσα δεν χωρούν σε μια σελίδα."
                  : "A short visit answers what a page cannot."}
              </p>
            </div>
            <Button asChild size="lg" className="mt-6 rounded-full sm:mt-0">
              <Link to="/book-visit">
                {gr ? "Κλείσε γνωριμία" : "Book a visit"}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
