import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import exterior from "@/assets/pisipouk-exterior.webp";
import arrival from "@/assets/pisipouk-arrival.webp";
import welcome from "@/assets/parent-welcome.webp";
import classroom from "@/assets/pisipouk-classroom.webp";
import creative from "@/assets/real-creative-table.webp";
import artTable from "@/assets/real-art-table.webp";
import circle from "@/assets/real-circle-play.webp";
import greece from "@/assets/real-greece-circle.webp";
import story from "@/assets/pisipouk-story.webp";

type Category = "all" | "space" | "learning" | "outdoors" | "brand";

const labels: Record<Category, { gr: string; en: string }> = {
  all: { gr: "Όλες", en: "All" },
  space: { gr: "Χώρος", en: "Space" },
  learning: { gr: "Δημιουργία", en: "Learning" },
  outdoors: { gr: "Αυλή", en: "Outdoors" },
  brand: { gr: "Η ιστορία μας", en: "Our story" },
};

const images = [
  {
    src: exterior,
    cat: "space" as const,
    gr: "Η είσοδος του κόσμου του Πισιπούκ",
    en: "Welcome to the world of Pisipouk",
    type: "ai",
  },
  {
    src: arrival,
    cat: "space" as const,
    gr: "Η άφιξη ως ήρεμη καθημερινή τελετουργία",
    en: "Arrival as a calm daily ritual",
    type: "ai",
  },
  {
    src: welcome,
    cat: "space" as const,
    gr: "Η πρώτη επαφή γονέα, παιδιού και ομάδας",
    en: "The first connection between family and team",
    type: "ai",
  },
  {
    src: creative,
    cat: "learning" as const,
    gr: "Χέρια που δημιουργούν μαζί",
    en: "Hands creating together",
    type: "real",
  },
  {
    src: artTable,
    cat: "learning" as const,
    gr: "Συγκέντρωση, χρώμα και συνεργασία",
    en: "Focus, colour and cooperation",
    type: "real",
  },
  {
    src: classroom,
    cat: "learning" as const,
    gr: "Μάθηση μέσα από παιχνίδι",
    en: "Learning through play",
    type: "ai",
  },
  {
    src: circle,
    cat: "outdoors" as const,
    gr: "Ο κύκλος της ομάδας στην αυλή",
    en: "The group circle outdoors",
    type: "real",
  },
  {
    src: greece,
    cat: "outdoors" as const,
    gr: "Μαζί στις γιορτές και στις κοινές εμπειρίες",
    en: "Together in celebrations and shared experiences",
    type: "real",
  },
  {
    src: story,
    cat: "brand" as const,
    gr: "Ο Πισιπούκ μέσα από εικόνες και αξίες",
    en: "Pisipouk through images and values",
    type: "ai",
  },
];

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Φωτογραφίες & Στιγμές | Ο Πισιπούκ" },
      {
        name: "description",
        content:
          "Πραγματικές στιγμές και δημιουργικές απεικονίσεις από την καθημερινότητα στον Πισιπούκ, με σεβασμό στην ιδιωτικότητα των παιδιών.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { lang } = useLanguage();
  const [active, setActive] = useState<Category>("all");
  const visible = images.filter(
    (image) => active === "all" || image.cat === active,
  );

  return (
    <SiteLayout>
      <section className="hero-field py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="section-kicker">
            {lang === "gr" ? "Η ζωή στον Πισιπούκ" : "Life at Pisipouk"}
          </p>
          <h1 className="mt-3 max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">
            {lang === "gr"
              ? "Όχι φωτογραφίες για εντύπωση. Στιγμές με νόημα."
              : "Not photos for show. Moments that mean something."}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            {lang === "gr"
              ? "Συνδυάζουμε πραγματικές φωτογραφίες του σταθμού με δημιουργικές AI απεικονίσεις της ταυτότητας Πισιπούκ. Κάθε εικόνα δηλώνεται καθαρά και η ιδιωτικότητα των παιδιών προηγείται."
              : "We combine real school photography with creative AI representations of the Pisipouk identity. Every image is labelled and children’s privacy comes first."}
          </p>
          <div className="mt-7 flex items-start gap-3 rounded-2xl border bg-white/70 p-4 text-sm leading-6">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p>
              {lang === "gr"
                ? "Δεν δημοσιεύονται καθαρά αναγνωρίσιμα παιδικά πρόσωπα χωρίς επιβεβαιωμένη γραπτή συναίνεση."
                : "Clearly identifiable children’s faces are not published without confirmed written consent."}
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label={lang === "gr" ? "Φίλτρα φωτογραφιών" : "Photo filters"}
          >
            {(Object.keys(labels) as Category[]).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                aria-pressed={active === category}
                className={cn(
                  "min-h-11 rounded-full border px-5 py-2 text-sm font-bold transition-colors",
                  active === category
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card hover:bg-accent",
                )}
              >
                {labels[category][lang]}
              </button>
            ))}
          </div>

          <div className="gallery-masonry mt-8">
            {visible.map((image, index) => (
              <figure
                key={image.src}
                className={cn(
                  "gallery-shot group",
                  index % 5 === 0 && "gallery-shot-wide",
                )}
              >
                <img
                  src={image.src}
                  alt={image[lang]}
                  loading={index < 2 ? "eager" : "lazy"}
                />
                <figcaption>
                  <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider">
                    {image.type === "real" ? (
                      <Camera className="h-3.5 w-3.5" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    {image.type === "real"
                      ? lang === "gr"
                        ? "Πραγματική στιγμή"
                        : "Real moment"
                      : lang === "gr"
                        ? "Δημιουργική AI απεικόνιση"
                        : "Creative AI representation"}
                  </span>
                  <strong>{image[lang]}</strong>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-16 rounded-[2rem] bg-sun p-7 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10">
            <div>
              <h2 className="text-3xl font-black">
                {lang === "gr"
                  ? "Οι φωτογραφίες βοηθούν. Η επίσκεψη αποφασίζει."
                  : "Photos help. A visit decides."}
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-foreground/75">
                {lang === "gr"
                  ? "Γνωρίστε τον χώρο, την ομάδα και τον τρόπο που υποδεχόμαστε κάθε παιδί."
                  : "Meet the space, the team and the way we welcome every child."}
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="mt-6 shrink-0 rounded-full sm:mt-0"
            >
              <Link to="/book-visit">
                {lang === "gr" ? "Κλείστε μια γνωριμία" : "Book a visit"}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
