import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, PageHeader } from "@/components/site/Section";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["all", "classrooms", "activities", "play", "arts", "yard", "events"] as const;
type Category = (typeof CATEGORIES)[number];

const LABELS: Record<Category, { gr: string; en: string }> = {
  all: { gr: "Όλα", en: "All" },
  classrooms: { gr: "Αίθουσες", en: "Classrooms" },
  activities: { gr: "Δραστηριότητες", en: "Activities" },
  play: { gr: "Παιχνίδι", en: "Play" },
  arts: { gr: "Εικαστικά", en: "Arts" },
  yard: { gr: "Αυλή", en: "Yard" },
  events: { gr: "Εκδηλώσεις", en: "Events" },
};

const PLACEHOLDERS: { cat: Exclude<Category, "all">; bg: string; icon: string }[] = [
  { cat: "classrooms", bg: "from-sky to-sun", icon: "🏫" },
  { cat: "activities", bg: "from-leaf to-sky", icon: "🎨" },
  { cat: "play", bg: "from-sun to-blossom", icon: "🧸" },
  { cat: "arts", bg: "from-blossom to-sun", icon: "🖌️" },
  { cat: "yard", bg: "from-leaf to-sun", icon: "🌳" },
  { cat: "events", bg: "from-sky to-blossom", icon: "🎉" },
  { cat: "classrooms", bg: "from-sun to-leaf", icon: "📚" },
  { cat: "play", bg: "from-blossom to-sky", icon: "🪀" },
  { cat: "activities", bg: "from-sky to-leaf", icon: "🎵" },
];

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Ο Πισιπούκ" },
      { name: "description", content: "Στιγμές από την καθημερινότητα στον Πισιπούκ. / Moments from daily life at Pisipouk." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { lang } = useLanguage();
  const [active, setActive] = useState<Category>("all");
  const items = PLACEHOLDERS.filter((p) => active === "all" || p.cat === active);

  return (
    <SiteLayout>
      <Section>
        <PageHeader
          eyebrow="Gallery"
          title={lang === "gr" ? "Στιγμές από τον Πισιπούκ" : "Moments at Pisipouk"}
        />

        <div className="mt-6 flex items-start gap-2 rounded-2xl bg-secondary/60 p-4 text-sm">
          <ShieldAlert className="mt-0.5 h-5 w-5 text-secondary-foreground" />
          <p className="text-secondary-foreground">
            {lang === "gr"
              ? "Δημοσιεύουμε φωτογραφίες παιδιών μόνο εφόσον υπάρχει γραπτή συναίνεση των γονέων. Οι παρακάτω εικόνες είναι ενδεικτικές."
              : "We publish children's photos only with written parent consent. The images below are indicative placeholders."}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                active === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-accent",
              )}
            >
              {LABELS[c][lang]}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((it, i) => (
            <div key={i} className={`flex aspect-square items-center justify-center rounded-3xl bg-gradient-to-br ${it.bg} text-5xl shadow-sm`}>
              <span aria-hidden>{it.icon}</span>
              <span className="sr-only">{LABELS[it.cat][lang]}</span>
            </div>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}