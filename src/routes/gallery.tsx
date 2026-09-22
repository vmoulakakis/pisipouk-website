import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Play, Sparkles } from "lucide-react";
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
import logo from "@/assets/pisipouk-logo.webp";

type Category = "all" | "space" | "learning" | "outdoors" | "brand";

const labels: Record<Category, { gr: string; en: string }> = {
  all: { gr: "Όλες", en: "All" },
  space: { gr: "Χώρος & υποδοχή", en: "Space & welcome" },
  learning: { gr: "Δημιουργία & μάθηση", en: "Learning & creativity" },
  outdoors: { gr: "Αυλή & παιχνίδι", en: "Outdoors & play" },
  brand: { gr: "Ο Πισιπούκ", en: "Pisipouk" },
};

const images = [
  {
    src: exterior,
    cat: "space" as const,
    gr: "Η είσοδος του Πισιπούκ — ένας φωτεινός, φιλόξενος χώρος για παιδιά προσχολικής ηλικίας στον Άγιο Δημήτριο.",
    en: "The entrance to Pisipouk — a bright, welcoming preschool environment in Agios Dimitrios, Athens.",
    altGr: "Είσοδος παιδικού σταθμού και νηπιαγωγείου Ο Πισιπούκ στον Άγιο Δημήτριο",
    altEn: "Entrance of O Pisipouk preschool and kindergarten in Agios Dimitrios, Athens",
    type: "ai",
  },
  {
    src: arrival,
    cat: "space" as const,
    gr: "Η άφιξη στο σχολείο γίνεται με χαμόγελο, οικειότητα και μια ήρεμη μετάβαση από το σπίτι στην ομάδα.",
    en: "School arrival is designed around warmth, familiarity and a calm transition from home to the group.",
    altGr: "Παιδί κατά την άφιξη στον παιδικό σταθμό Πισιπούκ",
    altEn: "Child arriving at Pisipouk preschool",
    type: "ai",
  },
  {
    src: welcome,
    cat: "space" as const,
    gr: "Η πρώτη επαφή γονέα, παιδιού και παιδαγωγικής ομάδας χτίζει εμπιστοσύνη από την πρώτη ημέρα.",
    en: "The first connection between child, parent and teaching team builds trust from day one.",
    altGr: "Υποδοχή οικογένειας στον παιδικό σταθμό Πισιπούκ",
    altEn: "Family welcome at Pisipouk preschool",
    type: "ai",
  },
  {
    src: creative,
    cat: "learning" as const,
    gr: "Δημιουργική απασχόληση με χρώματα και κατασκευές: τα παιδιά συνεργάζονται, πειραματίζονται και εκφράζονται.",
    en: "Creative art and craft time: children cooperate, experiment and express themselves through colour and making.",
    altGr: "Δημιουργική απασχόληση και χειροτεχνίες παιδιών στον Πισιπούκ",
    altEn: "Children doing creative arts and crafts at Pisipouk preschool",
    type: "real",
  },
  {
    src: artTable,
    cat: "learning" as const,
    gr: "Ζωγραφική και χειροτεχνία στο τραπέζι της τάξης, με έμφαση στη λεπτή κινητικότητα, τη φαντασία και τη συνεργασία.",
    en: "Painting and craft work at the classroom table, supporting fine motor skills, imagination and cooperation.",
    altGr: "Ζωγραφική και χειροτεχνίες στον παιδικό σταθμό Πισιπούκ",
    altEn: "Painting and crafts at Pisipouk preschool",
    type: "real",
  },
  {
    src: classroom,
    cat: "learning" as const,
    gr: "Μάθηση μέσα από παιχνίδι, κατασκευές και κοινές εμπειρίες σε ένα περιβάλλον σχεδιασμένο για μικρά παιδιά.",
    en: "Learning through play, construction and shared experiences in a child-centred classroom.",
    altGr: "Παιδιά παίζουν και μαθαίνουν στην τάξη του Πισιπούκ",
    altEn: "Children learning through play in a Pisipouk classroom",
    type: "ai",
  },
  {
    src: circle,
    cat: "outdoors" as const,
    gr: "Ομαδικό παιχνίδι και κίνηση στην αυλή, με χώρο για εξερεύνηση, κοινωνική αλληλεπίδραση και χαρά.",
    en: "Group play and movement outdoors, with space for exploration, social interaction and fun.",
    altGr: "Ομαδικό παιχνίδι παιδιών στην αυλή του Πισιπούκ",
    altEn: "Children enjoying group play in the Pisipouk outdoor area",
    type: "real",
  },
  {
    src: greece,
    cat: "outdoors" as const,
    gr: "Κοινές δραστηριότητες και γιορτές που βοηθούν τα παιδιά να νιώθουν ότι ανήκουν σε μια ζεστή σχολική κοινότητα.",
    en: "Shared activities and celebrations that help children feel part of a warm school community.",
    altGr: "Ομαδική δραστηριότητα παιδιών στον παιδικό σταθμό Πισιπούκ",
    altEn: "Group activity at Pisipouk preschool",
    type: "real",
  },
  {
    src: story,
    cat: "brand" as const,
    gr: "Το αρκουδάκι Πισιπούκ συνοδεύει την ταυτότητα του σχολείου και τον κόσμο φαντασίας που συναντούν τα παιδιά.",
    en: "The Pisipouk bear is part of the school identity and the imaginative world children meet every day.",
    altGr: "Μασκότ αρκουδάκι Πισιπούκ και παιδική δημιουργική ταυτότητα",
    altEn: "Pisipouk bear mascot and preschool creative identity",
    type: "ai",
  },
  {
    src: logo,
    cat: "brand" as const,
    gr: "Ο Πισιπούκ — παιδικός σταθμός και νηπιαγωγείο στον Άγιο Δημήτριο, με επίκεντρο τη φροντίδα, το παιχνίδι και τη μάθηση.",
    en: "O Pisipouk — preschool and kindergarten in Agios Dimitrios, focused on care, play and learning.",
    altGr: "Λογότυπο Ο Πισιπούκ παιδικός σταθμός νηπιαγωγείο Άγιος Δημήτριος",
    altEn: "O Pisipouk preschool kindergarten Agios Dimitrios logo",
    type: "ai",
  },
];

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      {
        title:
          "Φωτογραφίες Παιδικού Σταθμού στον Άγιο Δημήτριο | Ο Πισιπούκ",
      },
      {
        name: "description",
        content:
          "Δείτε εικόνες από τον Πισιπούκ στον Άγιο Δημήτριο: δημιουργικές δραστηριότητες, παιχνίδι, τάξεις, αυλή και χώρους υποδοχής του παιδικού σταθμού και νηπιαγωγείου.",
      },
      {
        name: "keywords",
        content:
          "παιδικός σταθμός Άγιος Δημήτριος φωτογραφίες, νηπιαγωγείο Άγιος Δημήτριος, δραστηριότητες προσχολικής αγωγής, Πισιπούκ",
      },
      {
        property: "og:title",
        content: "Η ζωή στον Πισιπούκ | Φωτογραφίες & δραστηριότητες",
      },
      {
        property: "og:description",
        content:
          "Χώροι, δημιουργικές δραστηριότητες και στιγμές από την καθημερινότητα στον Πισιπούκ, στον Άγιο Δημήτριο.",
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

  const imageGallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name:
      lang === "gr"
        ? "Φωτογραφίες από τον παιδικό σταθμό και νηπιαγωγείο Ο Πισιπούκ"
        : "Photos from O Pisipouk preschool and kindergarten",
    description:
      lang === "gr"
        ? "Εικόνες από χώρους, παιχνίδι και δημιουργικές δραστηριότητες στον Πισιπούκ στον Άγιο Δημήτριο."
        : "Images of the spaces, play and creative activities at Pisipouk in Agios Dimitrios.",
    about: {
      "@type": "Preschool",
      name: "Ο Πισιπούκ",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Δημ. Ψυχογιού 20",
        addressLocality: "Άγιος Δημήτριος",
        addressCountry: "GR",
      },
    },
  };

  return (
    <SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGallerySchema) }}
      />

      <section className="hero-field py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="section-kicker">
            {lang === "gr" ? "Η ζωή στον Πισιπούκ" : "Life at Pisipouk"}
          </p>
          <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            {lang === "gr"
              ? "Χώροι, παιχνίδι και δημιουργία"
              : "Spaces, play and creativity"}
          </h1>
          <p className="mt-3 max-w-2xl text-base font-medium text-muted-foreground sm:text-lg">
            {lang === "gr"
              ? "Μικρές στιγμές από την καθημερινότητα στον Πισιπούκ."
              : "Small moments from everyday life at Pisipouk."}
          </p>
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

          <section
            className="mt-8 overflow-hidden rounded-[2rem] border bg-gradient-to-br from-amber-50 via-white to-sky-50 shadow-sm"
            aria-labelledby="pisipouk-reel-title"
          >
            <div className="grid items-center gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-8">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-primary">
                  <Play className="h-3.5 w-3.5 fill-current" />
                  {lang === "gr" ? "Video" : "Video"}
                </div>
                <h2 id="pisipouk-reel-title" className="mt-3 text-2xl font-black sm:text-3xl">
                  {lang === "gr" ? "Μια στιγμή από τον Πισιπούκ" : "A moment from Pisipouk"}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                  {lang === "gr"
                    ? "Δείτε ένα σύντομο reel από τη ζωή και τις δραστηριότητές μας."
                    : "Watch a short reel from our everyday life and activities."}
                </p>
              </div>

              <div className="order-1 flex justify-center lg:order-2">
                <div className="w-[267px] overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
                  <iframe
                    src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1716104009476176%2F&show_text=true&width=267&t=0"
                    width="267"
                    height="591"
                    className="block border-0"
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen
                    loading="lazy"
                    title={lang === "gr" ? "Facebook Reel του Πισιπούκ" : "Pisipouk Facebook Reel"}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="gallery-masonry mt-8">
            {visible.map((image, index) => (
              <figure
                key={image.src}
                itemScope
                itemType="https://schema.org/ImageObject"
                className={cn(
                  "gallery-shot group",
                  index % 5 === 0 && "gallery-shot-wide",
                )}
              >
                <img
                  src={image.src}
                  alt={lang === "gr" ? image.altGr : image.altEn}
                  title={image[lang]}
                  itemProp="contentUrl"
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                />
                <figcaption itemProp="caption">
                  <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider">
                    {image.type === "real" ? (
                      <Camera className="h-3.5 w-3.5" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    {image.type === "real"
                      ? lang === "gr"
                        ? "Στιγμή δραστηριότητας"
                        : "Activity moment"
                      : lang === "gr"
                        ? "Δημιουργική απεικόνιση"
                        : "Creative representation"}
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
                  ? "Γνωρίστε από κοντά τον χώρο, την ομάδα και τον τρόπο που υποδεχόμαστε κάθε παιδί."
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
