import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, PageHeader } from "@/components/site/Section";
import { ChevronRight } from "lucide-react";

const FAQS = [
  { q: { gr: "Ποιες ηλικίες δέχεστε;", en: "What ages do you accept?" }, a: { gr: "Παιδιά από περίπου 2,5 έως 6 ετών (παιδικός σταθμός & νηπιαγωγείο).", en: "Children approximately 2.5 to 6 years old (preschool & kindergarten)." } },
  { q: { gr: "Πώς γίνεται η περίοδος προσαρμογής;", en: "How does the adaptation period work?" }, a: { gr: "Σταδιακά, με τον δικό του ρυθμό κάθε παιδιού και στενή συνεργασία με τον γονέα.", en: "Gradually, at each child's own pace and in close collaboration with the parent." } },
  { q: { gr: "Πώς ενημερώνομαι για το παιδί μου;", en: "How am I updated about my child?" }, a: { gr: "Καθημερινά μέσω του Portal Γονέα, με σημειώσεις, διάθεση, γεύματα και ξεκούραση.", en: "Daily via the Parent Portal, with notes on mood, meals and rest." } },
  { q: { gr: "Τι γίνεται αν το παιδί μου αρρωστήσει;", en: "What happens if my child gets sick?" }, a: { gr: "Επικοινωνούμε άμεσα μαζί σας. Παρακαλούμε να μην έρχονται παιδιά με πυρετό.", en: "We contact you immediately. Please do not bring children with a fever." } },
  { q: { gr: "Ποιοι μπορούν να παραλάβουν το παιδί;", en: "Who can pick up my child?" }, a: { gr: "Μόνο πρόσωπα εξουσιοδοτημένα γραπτώς από εσάς.", en: "Only persons you have authorized in writing." } },
  { q: { gr: "Τι σιτίζονται τα παιδιά;", en: "What do the children eat?" }, a: { gr: "Ισορροπημένο μενού με φρέσκα υλικά, με πλήρη καταγραφή αλλεργιών.", en: "A balanced menu with fresh ingredients and full allergy records." } },
  { q: { gr: "Πώς γίνεται η εγγραφή;", en: "How do I enroll?" }, a: { gr: "Συμπληρώστε τη φόρμα ενδιαφέροντος και θα κλείσουμε ραντεβού γνωριμίας.", en: "Fill out the interest form and we'll book an introductory visit." } },
  { q: { gr: "Υπάρχουν διαθέσιμες θέσεις;", en: "Are places available?" }, a: { gr: "Η διαθεσιμότητα μεταβάλλεται. Επικοινωνήστε μαζί μας για επικαιροποιημένη ενημέρωση.", en: "Availability changes. Please contact us for up-to-date information." } },
  { q: { gr: "Συμμετέχετε σε προγράμματα voucher;", en: "Do you participate in voucher programs?" }, a: { gr: "Η δυνατότητα συμμετοχής σε προγράμματα voucher εξαρτάται από την εκάστοτε περίοδο και τις διαθέσιμες διαδικασίες.", en: "Voucher participation depends on the current period and available procedures." } },
  { q: { gr: "Μπορώ να επισκεφθώ τον χώρο;", en: "Can I visit the space?" }, a: { gr: "Ναι! Κλείστε ραντεβού γνωριμίας από τη σελίδα Εγγραφές.", en: "Yes! Book an introductory visit from the Enrollment page." } },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Συχνές Ερωτήσεις | FAQ — Ο Πισιπούκ" },
      { name: "description", content: "Απαντήσεις στις πιο συχνές ερωτήσεις των γονέων για τον Πισιπούκ." },
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  const { lang } = useLanguage();
  return (
    <SiteLayout>
      <Section>
        <PageHeader
          eyebrow={lang === "gr" ? "FAQ" : "FAQ"}
          title={lang === "gr" ? "Συχνές ερωτήσεις" : "Frequently asked questions"}
        />
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {FAQS.map((f, i) => (
            <details key={i} className="group rounded-2xl border border-border bg-card p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                {f.q[lang]}
                <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a[lang]}</p>
            </details>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}