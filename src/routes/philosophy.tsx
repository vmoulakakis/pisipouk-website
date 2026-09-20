import { createFileRoute, Link } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, MessageCircle, Puzzle, Sprout } from "lucide-react";
import story from "@/assets/pisipouk-story.webp";

export const Route = createFileRoute("/philosophy")({
  head: () => ({
    meta: [
      { title: "Παιδαγωγική φιλοσοφία | Ο Πισιπούκ" },
      {
        name: "description",
        content:
          "Ασφάλεια, σχέση, παιχνίδι και αυτονομία: οι αρχές πίσω από κάθε ημέρα στον Πισιπούκ.",
      },
    ],
  }),
  component: Philosophy,
});
function Philosophy() {
  const { lang } = useLanguage();
  const gr = lang === "gr";
  const pillars = [
    [
      Heart,
      gr ? "Πρώτα η σχέση" : "Relationship first",
      gr
        ? "Το παιδί μαθαίνει όταν νιώθει ότι το βλέπουν, το ακούν και το σέβονται."
        : "Children learn when they feel seen, heard and respected.",
    ],
    [
      Puzzle,
      gr ? "Το παιχνίδι είναι μάθηση" : "Play is learning",
      gr
        ? "Η γλώσσα, η σκέψη και η συνεργασία χτίζονται μέσα σε εμπειρίες με νόημα."
        : "Language, thinking and cooperation grow through meaningful experiences.",
    ],
    [
      Sprout,
      gr ? "Αυτονομία, βήμα βήμα" : "Independence, step by step",
      gr
        ? "Δίνουμε χρόνο και χώρο για να δοκιμάζει, να επιλέγει και να ξαναπροσπαθεί."
        : "We make room to try, choose and try again.",
    ],
    [
      MessageCircle,
      gr ? "Ο γονέας είναι συνεργάτης" : "Parents are partners",
      gr
        ? "Η καθαρή επικοινωνία βοηθά σπίτι και σχολείο να λειτουργούν ως μία ομάδα."
        : "Clear communication helps home and school work as one team.",
    ],
  ];
  return (
    <SiteLayout>
      <section className="hero-field py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-8">
          <div>
            <p className="section-kicker">
              {gr
                ? "Η σκέψη πίσω από κάθε στιγμή"
                : "The thinking behind every moment"}
            </p>
            <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">
              {gr
                ? "Δεν γεμίζουμε απλώς τη μέρα. Χτίζουμε εμπιστοσύνη."
                : "We do not simply fill the day. We build trust."}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {gr
                ? "Η παιδαγωγική μας ξεκινά από το ερώτημα: τι χρειάζεται αυτό το παιδί, τώρα, για να νιώσει ασφαλές και ικανό;"
                : "Our approach starts with one question: what does this child need now to feel safe and capable?"}
            </p>
          </div>
          <img
            src={story}
            alt={
              gr
                ? "Δημιουργική AI σύνθεση της ταυτότητας και των αξιών Πισιπούκ"
                : "Creative AI composition of the Pisipouk identity and values"
            }
            className="w-full rounded-[2.5rem] shadow-2xl"
          />
        </div>
      </section>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {pillars.map(([Icon, title, body], i) => {
              const I = Icon as typeof Heart;
              return (
                <article
                  key={String(title)}
                  className={
                    "rounded-[2rem] p-7 " +
                    (i === 0
                      ? "bg-sun"
                      : i === 1
                        ? "bg-sky"
                        : i === 2
                          ? "bg-leaf"
                          : "border bg-card")
                  }
                >
                  <I className="h-8 w-8" />
                  <h2 className="mt-6 text-2xl font-black">
                    {title as string}
                  </h2>
                  <p className="mt-3 leading-7 text-foreground/75">
                    {body as string}
                  </p>
                </article>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/program">
                {gr
                  ? "Δείτε το πρόγραμμα στην πράξη"
                  : "See the program in practice"}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
