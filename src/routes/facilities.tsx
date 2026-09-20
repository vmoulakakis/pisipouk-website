import { createFileRoute, Link } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, DoorOpen, Eye, LayoutGrid, Trees } from "lucide-react";
import exterior from "@/assets/pisipouk-exterior.webp";
import classroom from "@/assets/pisipouk-classroom.webp";
import welcome from "@/assets/parent-welcome.webp";

export const Route = createFileRoute("/facilities")({
  head: () => ({
    meta: [
      { title: "Χώροι & εγκαταστάσεις | Ο Πισιπούκ" },
      {
        name: "description",
        content:
          "Δείτε πώς ο χώρος του Πισιπούκ υποστηρίζει την ασφάλεια, την αυτονομία, τη δημιουργία και την επαφή με την οικογένεια.",
      },
    ],
  }),
  component: Facilities,
});
function Facilities() {
  const { lang } = useLanguage();
  const gr = lang === "gr";
  return (
    <SiteLayout>
      <section className="hero-field py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="section-kicker">
                {gr
                  ? "Χώρος που μιλά στη γλώσσα του παιδιού"
                  : "A space designed around children"}
              </p>
              <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">
                {gr
                  ? "Να μπορεί να κινηθεί, να εξερευνήσει, να νιώσει οικεία"
                  : "Room to move, explore and feel at home"}
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {gr
                  ? "Η πρώτη επίσκεψη δεν είναι ξενάγηση βιτρίνας. Είναι η στιγμή που παρατηρείτε αν ο χώρος ταιριάζει στο παιδί και στην οικογένειά σας."
                  : "The first visit is not a showroom tour. It is your chance to feel whether the space fits your child and family."}
              </p>
            </div>
            <img
              src={exterior}
              alt={
                gr
                  ? "Δημιουργική AI απεικόνιση της εξωτερικής ταυτότητας Πισιπούκ"
                  : "Creative AI representation of the Pisipouk exterior"
              }
              className="aspect-[4/3] w-full rounded-[2.5rem] object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              [DoorOpen, gr ? "Ελεγχόμενη άφιξη" : "Controlled arrival"],
              [LayoutGrid, gr ? "Ζώνες δραστηριοτήτων" : "Activity zones"],
              [
                Trees,
                gr ? "Κίνηση και εξωτερικός χώρος" : "Movement and outdoors",
              ],
              [
                Eye,
                gr ? "Ορατότητα και επίβλεψη" : "Visibility and supervision",
              ],
            ].map(([Icon, title]) => {
              const I = Icon as typeof Eye;
              return (
                <article
                  key={String(title)}
                  className="value-card rounded-3xl border bg-card p-6"
                >
                  <I className="h-7 w-7 text-primary" />
                  <h2 className="mt-5 text-xl font-black">{title as string}</h2>
                </article>
              );
            })}
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            <figure className="overflow-hidden rounded-[2rem] border bg-card">
              <img
                src={classroom}
                alt={
                  gr
                    ? "Δημιουργική AI απεικόνιση παιδαγωγικού χώρου"
                    : "Creative AI representation of a learning space"
                }
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="p-4 text-sm text-muted-foreground">
                {gr
                  ? "Δημιουργική AI απεικόνιση της ατμόσφαιρας — όχι φωτογραφική τεκμηρίωση συγκεκριμένης αίθουσας."
                  : "Creative AI atmosphere representation — not documentary photography of a specific room."}
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-[2rem] border bg-card">
              <img
                src={welcome}
                alt={
                  gr
                    ? "Γονέας και παιδί σε συνάντηση γνωριμίας, δημιουργική AI απεικόνιση"
                    : "Parent and child at an introductory visit, creative AI representation"
                }
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="p-4 text-sm text-muted-foreground">
                {gr
                  ? "Η επίσκεψη σάς επιτρέπει να επιβεβαιώσετε τον πραγματικό χώρο και τις διαδικασίες."
                  : "A visit lets you verify the actual space and routines."}
              </figcaption>
            </figure>
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/book-visit">
                {gr ? "Δείτε τον χώρο από κοντά" : "See the space in person"}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
