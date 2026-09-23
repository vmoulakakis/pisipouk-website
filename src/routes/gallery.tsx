import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import img01 from "@/assets/gallery-jpg/FB_IMG_1789560439522.jpg";
import img02 from "@/assets/gallery-jpg/FB_IMG_1789560446662.jpg";
import img03 from "@/assets/gallery-jpg/FB_IMG_1789560486550.jpg";
import img04 from "@/assets/gallery-jpg/FB_IMG_1789560511188.jpg";
import img05 from "@/assets/gallery-jpg/FB_IMG_1789560563190.jpg";
import img06 from "@/assets/gallery-jpg/FB_IMG_1789560635114.jpg";
import img07 from "@/assets/gallery-jpg/FB_IMG_1789560646865.jpg";
import img08 from "@/assets/gallery-jpg/FB_IMG_1789560673224.jpg";
import img09 from "@/assets/gallery-jpg/FB_IMG_1789560687810.jpg";
import img10 from "@/assets/gallery-jpg/FB_IMG_1789560707745.jpg";
import img11 from "@/assets/gallery-jpg/FB_IMG_1789560720338.jpg";
import img12 from "@/assets/gallery-jpg/FB_IMG_1789560734042.jpg";
import img13 from "@/assets/gallery-jpg/FB_IMG_1789560756470.jpg";
import img14 from "@/assets/gallery-jpg/FB_IMG_1789560790690.jpg";
import img15 from "@/assets/gallery-jpg/FB_IMG_1789560806512.jpg";
import img16 from "@/assets/gallery-jpg/FB_IMG_1789560835032.jpg";
import img17 from "@/assets/gallery-jpg/FB_IMG_1789560847486.jpg";
import img18 from "@/assets/gallery-jpg/FB_IMG_1789560858994.jpg";
import img19 from "@/assets/gallery-jpg/FB_IMG_1789560906708.jpg";
import img20 from "@/assets/gallery-jpg/FB_IMG_1789560940639.jpg";
import img21 from "@/assets/gallery-jpg/FB_IMG_1789560997132.jpg";
import img22 from "@/assets/gallery-jpg/FB_IMG_1789561050066.jpg";
import img23 from "@/assets/gallery-jpg/FB_IMG_1789561105222.jpg";
import img24 from "@/assets/gallery-jpg/FB_IMG_1789561116308.jpg";
import img25 from "@/assets/gallery-jpg/FB_IMG_1789561129623.jpg";
import img26 from "@/assets/gallery-jpg/FB_IMG_1789561193322.jpg";
import img27 from "@/assets/gallery-jpg/FB_IMG_1789561245227.jpg";

type Category = "all" | "space" | "learning" | "celebrations" | "outdoors";

const labels: Record<Category, { gr: string; en: string }> = {
  all: { gr: "Όλες", en: "All" },
  space: { gr: "Χώρος & υποδοχή", en: "Space & welcome" },
  learning: { gr: "Δημιουργία & μάθηση", en: "Learning & creativity" },
  celebrations: { gr: "Γιορτές & στιγμές", en: "Celebrations & moments" },
  outdoors: { gr: "Αυλή & παιχνίδι", en: "Outdoors & play" },
};

const images = [
  {
    src: img01,
    cat: "space" as const,
    gr: "Μια αυθεντική στιγμή από τον χώρο του Πισιπούκ.",
    en: "A real moment from the Pisipouk school environment.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 1",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 1",
    featured: false,
  },
  {
    src: img02,
    cat: "space" as const,
    gr: "Καθημερινές εικόνες από το σχολικό περιβάλλον και την ομάδα μας.",
    en: "Everyday life in our school space with the group.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 2",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 2",
    featured: false,
  },
  {
    src: img03,
    cat: "learning" as const,
    gr: "Ζωγραφική και δημιουργική έκφραση μέσα από το παιχνίδι.",
    en: "Painting and creative expression through play.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 3",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 3",
    featured: true,
  },
  {
    src: img04,
    cat: "outdoors" as const,
    gr: "Ομαδική δραστηριότητα και κίνηση με τους φίλους μας.",
    en: "A group activity with movement and friends.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 4",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 4",
    featured: false,
  },
  {
    src: img05,
    cat: "learning" as const,
    gr: "Μάθηση μέσα από χρώμα, υλικά και δημιουργική εξερεύνηση.",
    en: "Learning through colour, materials and creative exploration.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 5",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 5",
    featured: false,
  },
  {
    src: img06,
    cat: "celebrations" as const,
    gr: "Γιορτινή στιγμή από την καθημερινότητα του Πισιπούκ.",
    en: "A celebratory moment from everyday life at Pisipouk.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 6",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 6",
    featured: false,
  },
  {
    src: img07,
    cat: "celebrations" as const,
    gr: "Χαμόγελα και κοινές αναμνήσεις από μια ξεχωριστή ημέρα.",
    en: "Smiles and shared memories from a special day.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 7",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 7",
    featured: false,
  },
  {
    src: img08,
    cat: "space" as const,
    gr: "Γωνιές του σχολείου σχεδιασμένες για τα παιδιά.",
    en: "Child-centred corners of our school environment.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 8",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 8",
    featured: false,
  },
  {
    src: img09,
    cat: "space" as const,
    gr: "Ο χώρος του Πισιπούκ μέσα από μια πραγματική σχολική στιγμή.",
    en: "A real school-day view of the Pisipouk space.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 9",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 9",
    featured: false,
  },
  {
    src: img10,
    cat: "learning" as const,
    gr: "Δημιουργικό παιχνίδι και συμμετοχή σε οργανωμένη δραστηριότητα.",
    en: "Creative play and active participation in a guided activity.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 10",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 10",
    featured: false,
  },
  {
    src: img11,
    cat: "outdoors" as const,
    gr: "Παιχνίδι και συνεργασία στην αυλή του Πισιπούκ.",
    en: "Outdoor play and cooperation in the Pisipouk yard.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 11",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 11",
    featured: true,
  },
  {
    src: img12,
    cat: "learning" as const,
    gr: "Μάθηση και εξερεύνηση με βιωματικό τρόπο.",
    en: "Hands-on learning and exploration.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 12",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 12",
    featured: false,
  },
  {
    src: img13,
    cat: "celebrations" as const,
    gr: "Μια ξεχωριστή στιγμή γιορτής με την ομάδα.",
    en: "A special celebration shared with the group.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 13",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 13",
    featured: false,
  },
  {
    src: img14,
    cat: "learning" as const,
    gr: "Δημιουργική δραστηριότητα μέσα στην τάξη.",
    en: "A creative classroom activity.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 14",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 14",
    featured: false,
  },
  {
    src: img15,
    cat: "learning" as const,
    gr: "Ομαδική εργασία και παιχνίδι στο τραπέζι της τάξης.",
    en: "Group work and play around the classroom table.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 15",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 15",
    featured: true,
  },
  {
    src: img16,
    cat: "learning" as const,
    gr: "Δραστηριότητα με την παιδαγωγική ομάδα και ενεργή συμμετοχή των παιδιών.",
    en: "An activity with the teaching team and active child participation.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 16",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 16",
    featured: false,
  },
  {
    src: img17,
    cat: "space" as const,
    gr: "Μια ακόμη εικόνα από τους χώρους όπου παίζουμε και μαθαίνουμε.",
    en: "Another real view of the spaces where children play and learn.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 17",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 17",
    featured: false,
  },
  {
    src: img18,
    cat: "outdoors" as const,
    gr: "Θεματική δραστηριότητα και παιχνίδι στον εξωτερικό χώρο.",
    en: "A themed activity and play outdoors.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 18",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 18",
    featured: false,
  },
  {
    src: img19,
    cat: "learning" as const,
    gr: "Μικρές ανακαλύψεις μέσα από καθημερινές δραστηριότητες.",
    en: "Small discoveries through everyday activities.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 19",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 19",
    featured: false,
  },
  {
    src: img20,
    cat: "learning" as const,
    gr: "Κατασκευή και συνεργασία — δημιουργούμε όλοι μαζί.",
    en: "Making and cooperating — creating together.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 20",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 20",
    featured: false,
  },
  {
    src: img21,
    cat: "learning" as const,
    gr: "Εικαστική δημιουργία και λεπτομέρειες από τα έργα των παιδιών.",
    en: "Art-making and details from the children's creations.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 21",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 21",
    featured: false,
  },
  {
    src: img22,
    cat: "learning" as const,
    gr: "Εκπαιδευτικό παιχνίδι που καλλιεργεί σκέψη και παρατήρηση.",
    en: "Educational play that encourages thinking and observation.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 22",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 22",
    featured: true,
  },
  {
    src: img23,
    cat: "celebrations" as const,
    gr: "Μια γιορτινή ανάμνηση γεμάτη χρώμα.",
    en: "A colourful celebration memory.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 23",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 23",
    featured: false,
  },
  {
    src: img24,
    cat: "celebrations" as const,
    gr: "Στιγμή χαράς και γιορτής με την παρέα.",
    en: "A joyful celebration moment with friends.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 24",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 24",
    featured: false,
  },
  {
    src: img25,
    cat: "outdoors" as const,
    gr: "Κίνηση και παιχνίδι έξω, με χώρο για εξερεύνηση.",
    en: "Movement and outdoor play with room to explore.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 25",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 25",
    featured: false,
  },
  {
    src: img26,
    cat: "outdoors" as const,
    gr: "Καλοκαιρινό παιχνίδι με νερό στην αυλή.",
    en: "Summer water play in the yard.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 26",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 26",
    featured: false,
  },
  {
    src: img27,
    cat: "outdoors" as const,
    gr: "Ο εξωτερικός χώρος του Πισιπούκ μέσα από μια αυθεντική στιγμή παιχνιδιού.",
    en: "A real outdoor play moment at Pisipouk.",
    altGr: "Αυθεντική φωτογραφία από τον Πισιπούκ στον Άγιο Δημήτριο — εικόνα 27",
    altEn: "Authentic photo from Pisipouk preschool in Agios Dimitrios — image 27",
    featured: true,
  },
];

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Φωτογραφίες Παιδικού Σταθμού στον Άγιο Δημήτριο | Ο Πισιπούκ" },
      {
        name: "description",
        content:
          "27 αυθεντικές φωτογραφίες από τον Πισιπούκ στον Άγιο Δημήτριο: δημιουργική μάθηση, δραστηριότητες, γιορτές, παιχνίδι, τάξεις και αυλή.",
      },
      {
        name: "keywords",
        content:
          "παιδικός σταθμός Άγιος Δημήτριος φωτογραφίες, νηπιαγωγείο Άγιος Δημήτριος, δραστηριότητες νηπιαγωγείου, δημιουργική μάθηση, αυλή παιδικού σταθμού, Πισιπούκ",
      },
      { property: "og:title", content: "Η ζωή στον Πισιπούκ | Φωτογραφίες & δραστηριότητες" },
      {
        property: "og:description",
        content:
          "Αυθεντικές φωτογραφίες από χώρους, δημιουργικές δραστηριότητες και στιγμές της καθημερινότητας στον Πισιπούκ.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { lang } = useLanguage();
  const [active, setActive] = useState<Category>("all");
  const visible = images.filter((image) => active === "all" || image.cat === active);

  const imageGallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name:
      lang === "gr"
        ? "Φωτογραφίες από τον παιδικό σταθμό και νηπιαγωγείο Ο Πισιπούκ"
        : "Photos from O Pisipouk preschool and kindergarten",
    description:
      lang === "gr"
        ? "27 αυθεντικές εικόνες από χώρους, παιχνίδι και δημιουργικές δραστηριότητες στον Πισιπούκ στον Άγιο Δημήτριο."
        : "27 authentic images of the spaces, play and creative activities at Pisipouk in Agios Dimitrios.",
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
            {lang === "gr" ? "Χώροι, παιχνίδι και δημιουργία" : "Spaces, play and creativity"}
          </h1>
          <p className="mt-3 max-w-2xl text-base font-medium text-muted-foreground sm:text-lg">
            {lang === "gr"
              ? "27 αυθεντικές στιγμές από την καθημερινότητά μας — καθαρές, φυσικές και χωρίς τεχνητή αλλοίωση."
              : "27 authentic moments from everyday life — clean, natural and without artificial distortion."}
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
                  Video
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
                  (image.featured || index % 9 === 0) && "gallery-shot-wide",
                )}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={image.src}
                    alt={lang === "gr" ? image.altGr : image.altEn}
                    title={image[lang]}
                    itemProp="contentUrl"
                    loading={index < 4 ? "eager" : "lazy"}
                    decoding="async"
                    className="w-full transition-transform duration-500 group-hover:scale-[1.015]"
                  />
                </div>
                <figcaption itemProp="caption">
                  <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider">
                    <Camera className="h-3.5 w-3.5" />
                    {lang === "gr" ? "Αυθεντική φωτογραφία" : "Authentic photo"}
                  </span>
                  <strong>{image[lang]}</strong>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-16 rounded-[2rem] bg-sun p-7 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10">
            <div>
              <h2 className="text-3xl font-black">
                {lang === "gr" ? "Οι φωτογραφίες βοηθούν. Η επίσκεψη αποφασίζει." : "Photos help. A visit decides."}
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-foreground/75">
                {lang === "gr"
                  ? "Γνωρίστε από κοντά τον χώρο, την ομάδα και τον τρόπο που υποδεχόμαστε κάθε παιδί."
                  : "Meet the space, the team and the way we welcome every child."}
              </p>
            </div>
            <Button asChild size="lg" className="mt-6 shrink-0 rounded-full sm:mt-0">
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
