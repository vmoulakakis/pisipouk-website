import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, PageHeader } from "@/components/site/Section";
import { Heart, Shield, Smile, Sparkles, Sprout, Users, Wind } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Σχετικά με τον Πισιπούκ | About O Pisipouk" },
      { name: "description", content: "Γνωρίστε τη φιλοσοφία, τις αξίες και την παιδαγωγική ομάδα του Πισιπούκ. / Get to know the philosophy, values and team of O Pisipouk." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { lang } = useLanguage();

  const values = [
    { icon: Heart, title: { gr: "Αγάπη", en: "Love" }, body: { gr: "Η βάση κάθε σχέσης μας με τα παιδιά.", en: "The foundation of every relationship with our children." } },
    { icon: Shield, title: { gr: "Ασφάλεια", en: "Safety" }, body: { gr: "Σωματική και συναισθηματική ασφάλεια κάθε στιγμή.", en: "Physical and emotional safety at every moment." } },
    { icon: Users, title: { gr: "Σεβασμός", en: "Respect" }, body: { gr: "Σεβόμαστε τον ρυθμό και τις ανάγκες κάθε παιδιού.", en: "We respect each child's pace and needs." } },
    { icon: Sparkles, title: { gr: "Δημιουργικότητα", en: "Creativity" }, body: { gr: "Η μάθηση γίνεται μέσα από την έκφραση και το παιχνίδι.", en: "Learning happens through expression and play." } },
    { icon: Wind, title: { gr: "Συνεργασία", en: "Collaboration" }, body: { gr: "Στενή συνεργασία με τους γονείς και την ομάδα.", en: "Close collaboration with parents and the team." } },
    { icon: Sprout, title: { gr: "Αυτονομία", en: "Independence" }, body: { gr: "Ενθαρρύνουμε την αυτονομία και την αυτοπεποίθηση.", en: "We encourage independence and self-confidence." } },
    { icon: Smile, title: { gr: "Χαρά", en: "Joy" }, body: { gr: "Κάθε μέρα ξεκινά και κλείνει με χαμόγελο.", en: "Each day begins and ends with a smile." } },
  ];

  return (
    <SiteLayout>
      <Section>
        <PageHeader
          eyebrow={lang === "gr" ? "Σχετικά" : "About"}
          title={lang === "gr" ? "Ένας χώρος που νιώθει σαν σπίτι" : "A place that feels like home"}
          subtitle={lang === "gr"
            ? "Ο Πισιπούκ είναι ένας ζεστός, ασφαλής και δημιουργικός παιδικός σταθμός – νηπιαγωγείο, όπου κάθε παιδί μεγαλώνει με αγάπη και σεβασμό."
            : "O Pisipouk is a warm, safe and creative preschool – kindergarten where every child grows with love and respect."}
        />
      </Section>

      <Section tone="muted">
        <h2 className="text-center text-3xl font-bold">{lang === "gr" ? "Οι αξίες μας" : "Our values"}</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, body }, i) => (
            <div key={i} className="rounded-3xl bg-card p-6 shadow-sm">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{title[lang]}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body[lang]}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto grid max-w-5xl gap-8 rounded-3xl bg-card p-8 shadow-sm md:grid-cols-[200px,1fr] md:items-center">
          <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-sky to-sun text-4xl font-bold text-foreground/70">
            ΠΙ
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              {lang === "gr" ? "Από τη Διοίκηση" : "From the Management"}
            </p>
            <h2 className="mt-2 text-2xl font-bold">{lang === "gr" ? "Κατερίνα Υφαντή — Καλωσορίσατε στον Πισιπούκ" : "Katerina Yfanti — Welcome to Pisipouk"}</h2>
            <p className="mt-3 text-muted-foreground">
              {lang === "gr"
                ? "Όταν ένας γονιός μάς εμπιστεύεται το παιδί του, μάς εμπιστεύεται ό,τι πολυτιμότερο έχει. Θέλουμε ο Πισιπούκ να είναι ένας χώρος όπου κάθε παιδί νιώθει οικεία, χαρούμενα και ασφαλές, ενώ ταυτόχρονα μαθαίνει, κοινωνικοποιείται και ανακαλύπτει τον κόσμο μέσα από το παιχνίδι. Για εμάς είναι εξίσου σημαντική η ουσιαστική επικοινωνία και η σχέση εμπιστοσύνης με την οικογένεια. Σας προσκαλώ να γνωρίσετε από κοντά τον χώρο, την ομάδα και τη φιλοσοφία μας."
                : "When a parent entrusts us with their child, they are entrusting us with what matters most. We want Pisipouk to feel warm, joyful and safe, while children learn, socialise and discover the world through play. Meaningful communication and trust with each family are equally important to us. I invite you to visit, meet the team and experience our philosophy in person."}
            </p>
            <p className="mt-5 font-black">Κατερίνα Υφαντή</p>
            <p className="text-sm text-muted-foreground">{lang === "gr" ? "Διοίκηση — Ο Πισιπούκ" : "Management — O Pisipouk"}</p>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}