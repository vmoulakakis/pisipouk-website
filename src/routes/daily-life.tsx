import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, PageHeader } from "@/components/site/Section";
import { Utensils, Bed, TreePine, Calendar, HeartHandshake } from "lucide-react";

const SCHEDULE = [
  { time: "07:00 – 09:00", text: { gr: "Προσέλευση & ελεύθερο παιχνίδι", en: "Arrival & free play" } },
  { time: "09:00 – 09:30", text: { gr: "Πρωινός κύκλος", en: "Morning circle" } },
  { time: "09:30 – 10:30", text: { gr: "Παιδαγωγική δραστηριότητα", en: "Educational activity" } },
  { time: "10:30 – 11:00", text: { gr: "Δεκατιανό", en: "Snack" } },
  { time: "11:00 – 12:00", text: { gr: "Δημιουργική απασχόληση", en: "Creative activities" } },
  { time: "12:00 – 13:00", text: { gr: "Φαγητό", en: "Lunch" } },
  { time: "13:00 – 14:30", text: { gr: "Ξεκούραση", en: "Rest" } },
  { time: "14:30 – 16:00", text: { gr: "Αποχώρηση", en: "Departure" } },
];

export const Route = createFileRoute("/daily-life")({
  head: () => ({
    meta: [
      { title: "Η Καθημερινότητά μας | Daily Life — Ο Πισιπούκ" },
      { name: "description", content: "Ωρολόγιο πρόγραμμα, γεύματα, ξεκούραση, υπαίθριο παιχνίδι, εκδηλώσεις και περίοδος προσαρμογής." },
    ],
  }),
  component: DailyLife,
});

function DailyLife() {
  const { lang } = useLanguage();
  const blocks = [
    { icon: Utensils, title: { gr: "Γεύματα", en: "Meals" }, body: { gr: "Ισορροπημένο μενού με φρέσκα υλικά. Καταγραφή αλλεργιών για κάθε παιδί.", en: "Balanced menu with fresh ingredients. Allergy records for each child." } },
    { icon: Bed, title: { gr: "Ξεκούραση", en: "Rest" }, body: { gr: "Ήσυχος χώρος για το μεσημεριανό ύπνο/ξεκούραση των μικρότερων.", en: "A quiet space for younger children's nap and rest time." } },
    { icon: TreePine, title: { gr: "Υπαίθριο παιχνίδι", en: "Outdoor play" }, body: { gr: "Καθημερινό παιχνίδι στην αυλή με ασφάλεια και επίβλεψη.", en: "Daily yard play, safe and supervised." } },
    { icon: Calendar, title: { gr: "Εκδηλώσεις", en: "Events" }, body: { gr: "Γιορτές, παραστάσεις, εργαστήρια γονέων-παιδιών.", en: "Celebrations, performances, parent–child workshops." } },
    { icon: HeartHandshake, title: { gr: "Περίοδος προσαρμογής", en: "Adaptation period" }, body: { gr: "Σταδιακή προσαρμογή με τον ρυθμό κάθε παιδιού και στενή συνεργασία με τον γονέα.", en: "Gradual adaptation at each child's pace, in close collaboration with parents." } },
  ];

  return (
    <SiteLayout>
      <Section>
        <PageHeader
          eyebrow={lang === "gr" ? "Καθημερινότητα" : "Daily life"}
          title={lang === "gr" ? "Μια ζεστή, ισορροπημένη μέρα" : "A warm, balanced day"}
          subtitle={lang === "gr" ? "Από τις 07:00 έως τις 16:00, με φροντίδα σε κάθε λεπτομέρεια." : "From 07:00 to 16:00, with care in every detail."}
        />

        <div className="mx-auto mt-10 max-w-3xl rounded-3xl bg-card p-6 shadow-sm">
          <h2 className="text-xl font-bold">{lang === "gr" ? "Ωρολόγιο πρόγραμμα" : "Daily schedule"}</h2>
          <ol className="mt-4 space-y-2">
            {SCHEDULE.map((s, i) => (
              <li key={i} className="flex items-center justify-between gap-3 rounded-2xl px-3 py-3 text-sm odd:bg-muted/40">
                <span className="font-mono text-xs text-muted-foreground">{s.time}</span>
                <span className="flex-1 text-right font-medium">{s.text[lang]}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="muted">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map(({ icon: Icon, title, body }, i) => (
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