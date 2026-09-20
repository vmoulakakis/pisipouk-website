import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, PageHeader } from "@/components/site/Section";
import { DoorOpen, KeyRound, HeartPulse, Sparkles, Siren, Heart, FileLock2 } from "lucide-react";

export const Route = createFileRoute("/safety-care")({
  head: () => ({
    meta: [
      { title: "Ασφάλεια & Φροντίδα | Safety & Care — Ο Πισιπούκ" },
      { name: "description", content: "Ελεγχόμενη είσοδος, εξουσιοδοτημένη παραλαβή, αρχείο υγείας, καθημερινή υγιεινή, GDPR." },
    ],
  }),
  component: SafetyCare,
});

function SafetyCare() {
  const { lang } = useLanguage();
  const items = [
    { icon: DoorOpen, title: { gr: "Ελεγχόμενη είσοδος/έξοδος", en: "Controlled entry/exit" }, body: { gr: "Πόρτα ασφαλείας και καταγραφή κάθε προσέλευσης/αποχώρησης.", en: "Secure door and a record of every arrival/departure." } },
    { icon: KeyRound, title: { gr: "Εξουσιοδοτημένη παραλαβή", en: "Authorized pickup" }, body: { gr: "Παράδοση μόνο σε εξουσιοδοτημένα από τον γονέα πρόσωπα.", en: "Children released only to parent-authorized persons." } },
    { icon: HeartPulse, title: { gr: "Αρχείο υγείας & αλλεργιών", en: "Health & allergy records" }, body: { gr: "Εμφανής σήμανση αλλεργιών και ιατρικών σημειώσεων στην ομάδα.", en: "Allergy and medical notes clearly flagged for the team." } },
    { icon: Sparkles, title: { gr: "Καθημερινή υγιεινή", en: "Daily hygiene" }, body: { gr: "Καθαριότητα χώρων, υλικών και προσωπικής υγιεινής.", en: "Daily cleaning of spaces, materials and personal hygiene." } },
    { icon: Siren, title: { gr: "Πρωτόκολλο συμβάντων", en: "Incident protocol" }, body: { gr: "Σαφές πρωτόκολλο και άμεση ενημέρωση γονέων.", en: "Clear protocol with immediate parent notification." } },
    { icon: Heart, title: { gr: "Συναισθηματική ασφάλεια", en: "Emotional safety" }, body: { gr: "Έμπειρη ομάδα δίπλα σε κάθε παιδί, με σεβασμό και ζεστασιά.", en: "An experienced team beside each child, with respect and warmth." } },
    { icon: FileLock2, title: { gr: "GDPR & συναίνεση φωτογραφιών", en: "GDPR & photo consent" }, body: { gr: "Καμία δημόσια χρήση φωτογραφιών χωρίς γραπτή συναίνεση.", en: "No public photo use without written consent." } },
  ];

  return (
    <SiteLayout>
      <Section>
        <PageHeader
          eyebrow={lang === "gr" ? "Ασφάλεια & Φροντίδα" : "Safety & Care"}
          title={lang === "gr" ? "Η ασφάλεια έρχεται πρώτη" : "Safety comes first"}
          subtitle={lang === "gr"
            ? "Από την είσοδο έως την αποχώρηση, ένα προσεκτικά σχεδιασμένο πλαίσιο φροντίδας."
            : "From arrival to departure, a carefully designed framework of care."}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, body }, i) => (
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
    </SiteLayout>
  );
}