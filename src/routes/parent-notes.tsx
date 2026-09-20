import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ParentNotesSignup } from "@/components/site/ParentNotesSignup";
import { BookOpenCheck, HeartHandshake, MailOpen } from "lucide-react";

export const Route = createFileRoute("/parent-notes")({
  head: () => ({
    meta: [
      { title: "Parent Notes | Ο Πισιπούκ" },
      {
        name: "description",
        content:
          "Δωρεάν οδηγός 7 ημερών για πιο ήρεμη προσαρμογή στον παιδικό σταθμό και χρήσιμα Parent Notes για γονείς.",
      },
    ],
  }),
  component: ParentNotesPage,
});

function ParentNotesPage() {
  const { lang } = useLanguage();
  const gr = lang === "gr";

  return (
    <SiteLayout>
      <section className="hero-field py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_.9fr] lg:items-center lg:px-8">
          <div>
            <p className="section-kicker">Parent Notes</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
              {gr
                ? "Λίγη περισσότερη σιγουριά για τις πρώτες μέρες."
                : "A little more confidence for the first days."}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              {gr
                ? "Γραφτείτε δωρεάν και λάβετε αμέσως τον οδηγό 7 ημερών για πιο ήρεμη προσαρμογή στον παιδικό σταθμό. Μετά θα λαμβάνετε μόνο χρήσιμα Parent Notes για θέματα που πραγματικά απασχολούν μια οικογένεια."
                : "Subscribe free and receive the 7-day guide for a calmer preschool transition right away, followed by useful Parent Notes for families."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                [BookOpenCheck, gr ? "Πρακτικός οδηγός" : "Practical guide"],
                [HeartHandshake, gr ? "Χωρίς πίεση πώλησης" : "No sales pressure"],
                [MailOpen, gr ? "Διαγραφή με 1 κλικ" : "One-click unsubscribe"],
              ].map(([Icon, label]) => {
                const C = Icon as typeof BookOpenCheck;
                return (
                  <div key={String(label)} className="rounded-2xl border bg-card p-4">
                    <C className="h-6 w-6 text-primary" />
                    <p className="mt-3 font-black">{String(label)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2.5rem] border bg-card p-6 shadow-xl sm:p-8">
            <ParentNotesSignup lang={lang} source="parent_notes_page" />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
