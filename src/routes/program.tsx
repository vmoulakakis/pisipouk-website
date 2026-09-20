import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, PageHeader } from "@/components/site/Section";

export const Route = createFileRoute("/program")({
  head: () => ({
    meta: [
      { title: "Παιδαγωγικό Πρόγραμμα | Educational Program — Ο Πισιπούκ" },
      { name: "description", content: "Γλωσσική, μαθηματική, μουσική, εικαστική, συναισθηματική αγωγή & προετοιμασία για το σχολείο. / Language, math, music, arts, emotional education & school readiness." },
    ],
  }),
  component: ProgramPage,
});

const AREAS = [
  {
    title: { gr: "Γλωσσική ανάπτυξη", en: "Language development" },
    benefit: { gr: "Πλούσιο λεξιλόγιο και αυτοπεποίθηση στην έκφραση.", en: "Rich vocabulary and confidence in expression." },
    example: { gr: "Αφήγηση παραμυθιού με κούκλες.", en: "Storytelling with puppets." },
  },
  {
    title: { gr: "Μαθηματική σκέψη", en: "Early mathematical thinking" },
    benefit: { gr: "Σχέσεις, σχήματα, αριθμοί στην καθημερινή ζωή.", en: "Relations, shapes and numbers in daily life." },
    example: { gr: "Παιχνίδια ταξινόμησης με φυσικά υλικά.", en: "Sorting games with natural materials." },
  },
  {
    title: { gr: "Μουσικοκινητική αγωγή", en: "Music & movement" },
    benefit: { gr: "Ρυθμός, ισορροπία και έκφραση συναισθημάτων.", en: "Rhythm, balance and emotional expression." },
    example: { gr: "Κύκλος μουσικής με όργανα κρουστών.", en: "Music circle with percussion instruments." },
  },
  {
    title: { gr: "Εικαστικά", en: "Arts" },
    benefit: { gr: "Λεπτή κινητικότητα και δημιουργική φαντασία.", en: "Fine motor skills and creative imagination." },
    example: { gr: "Ζωγραφική με υδατογραφίες.", en: "Watercolor painting." },
  },
  {
    title: { gr: "Θεατρικό παιχνίδι", en: "Drama play" },
    benefit: { gr: "Ενσυναίσθηση, συνεργασία και αυτοπεποίθηση.", en: "Empathy, cooperation and confidence." },
    example: { gr: "Δραματοποίηση παραμυθιού.", en: "Acting out a story." },
  },
  {
    title: { gr: "Συναισθηματική αγωγή", en: "Emotional education" },
    benefit: { gr: "Αναγνώριση και διαχείριση συναισθημάτων.", en: "Recognizing and managing feelings." },
    example: { gr: "Κάρτες συναισθημάτων στον πρωινό κύκλο.", en: "Feelings cards in the morning circle." },
  },
  {
    title: { gr: "Κοινωνικές δεξιότητες", en: "Social skills" },
    benefit: { gr: "Σεβασμός, μοίρασμα, συνεργασία.", en: "Respect, sharing, cooperation." },
    example: { gr: "Ομαδικά παιχνίδια αυλής.", en: "Group yard games." },
  },
  {
    title: { gr: "Περιβαλλοντική αγωγή", en: "Environmental awareness" },
    benefit: { gr: "Σύνδεση με τη φύση και υπευθυνότητα.", en: "Connection with nature and responsibility." },
    example: { gr: "Φύτεμα στον λαχανόκηπό μας.", en: "Planting in our small garden." },
  },
  {
    title: { gr: "Προετοιμασία για το σχολείο", en: "School readiness" },
    benefit: { gr: "Συγκέντρωση, αυτονομία, βασικές γνώσεις.", en: "Focus, independence, foundational knowledge." },
    example: { gr: "Φύλλα εργασίας προγραφής & προμαθηματικών.", en: "Pre-writing and pre-math worksheets." },
  },
];

function ProgramPage() {
  const { lang } = useLanguage();
  return (
    <SiteLayout>
      <Section>
        <PageHeader
          eyebrow={lang === "gr" ? "Πρόγραμμα" : "Program"}
          title={lang === "gr" ? "Παιδαγωγικό πρόγραμμα" : "Educational program"}
          subtitle={lang === "gr"
            ? "9 πεδία ανάπτυξης. Μάθηση μέσα από το παιχνίδι, με σεβασμό στον ρυθμό κάθε παιδιού."
            : "9 areas of development. Learning through play, respecting each child's rhythm."}
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((a, i) => (
            <article key={i} className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-bold">{a.title[lang]}</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{lang === "gr" ? "Όφελος: " : "Benefit: "}</span>
                {a.benefit[lang]}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{lang === "gr" ? "Παράδειγμα: " : "Example: "}</span>
                {a.example[lang]}
              </p>
            </article>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}