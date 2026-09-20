import { createFileRoute, Link } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { dict } from "@/i18n/translations";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import {
  Heart, Shield, Sparkles, Users, GraduationCap, Sprout, Sun, Smile,
  CheckCircle2, MessageCircle, Calendar, Phone, Mail, MapPin, ChevronRight,
} from "lucide-react";
import heroImage from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Παιδικός Σταθμός - Νηπιαγωγείο Ο Πισιπούκ | Ασφάλεια, Αγάπη και Δημιουργία" },
      {
        name: "description",
        content:
          "Ο Πισιπούκ είναι ένας ζεστός παιδικός σταθμός - νηπιαγωγείο με ασφαλές περιβάλλον, δημιουργική μάθηση και καθημερινή φροντίδα για κάθε παιδί.",
      },
      { property: "og:title", content: "Ο Πισιπούκ — Παιδικός Σταθμός & Νηπιαγωγείο" },
      { property: "og:description", content: "Ασφάλεια, αγάπη και δημιουργική μάθηση για κάθε παιδί." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { lang } = useLanguage();
  const trust = [
    { icon: Shield, k: "safe" as const },
    { icon: Sparkles, k: "creative" as const },
    { icon: MessageCircle, k: "updates" as const },
    { icon: Users, k: "small" as const },
    { icon: GraduationCap, k: "team" as const },
  ];

  const why = [
    {
      icon: Heart,
      title: { gr: "Αγάπη & ζεστασιά", en: "Love & warmth" },
      body: { gr: "Κάθε παιδί νιώθει σαν στο σπίτι του, με προσοχή και κατανόηση.", en: "Every child feels at home, with attention and understanding." },
    },
    {
      icon: Shield,
      title: { gr: "Ασφάλεια πάνω από όλα", en: "Safety above all" },
      body: { gr: "Ελεγχόμενη είσοδος/έξοδος, υγιεινή, εξουσιοδοτημένη παραλαβή.", en: "Controlled entry/exit, hygiene, authorized pickup only." },
    },
    {
      icon: Sprout,
      title: { gr: "Μάθηση μέσα από παιχνίδι", en: "Learning through play" },
      body: { gr: "Δημιουργικές δραστηριότητες, μουσική, εικαστικά, φύση.", en: "Creative activities, music, arts, and nature." },
    },
    {
      icon: MessageCircle,
      title: { gr: "Καθημερινή ενημέρωση", en: "Daily updates" },
      body: { gr: "Από το portal γονέα βλέπετε πώς πέρασε η μέρα του παιδιού σας.", en: "Through the parent portal you see how your child's day went." },
    },
  ];

  const ageGroups = [
    { title: { gr: "Παιδικός Σταθμός", en: "Preschool" }, age: { gr: "2,5 – 4 ετών", en: "2.5 – 4 years" }, body: { gr: "Πρώτη κοινωνικοποίηση, αυτονομία, παιχνίδι.", en: "First socialization, independence, play." } },
    { title: { gr: "Προ-νηπιαγωγείο", en: "Pre-K" }, age: { gr: "4 – 5 ετών", en: "4 – 5 years" }, body: { gr: "Γλώσσα, εικαστικά, μουσικοκινητική.", en: "Language, arts, music & movement." } },
    { title: { gr: "Νηπιαγωγείο", en: "Kindergarten" }, age: { gr: "5 – 6 ετών", en: "5 – 6 years" }, body: { gr: "Προετοιμασία για το σχολείο, μαθηματική σκέψη.", en: "School readiness, early mathematical thinking." } },
  ];

  const day = [
    { time: "07:00 – 09:00", text: { gr: "Προσέλευση & ελεύθερο παιχνίδι", en: "Arrival & free play" } },
    { time: "09:00 – 09:30", text: { gr: "Πρωινός κύκλος", en: "Morning circle" } },
    { time: "09:30 – 10:30", text: { gr: "Παιδαγωγική δραστηριότητα", en: "Educational activity" } },
    { time: "10:30 – 11:00", text: { gr: "Δεκατιανό", en: "Snack" } },
    { time: "11:00 – 12:00", text: { gr: "Δημιουργική απασχόληση", en: "Creative activities" } },
    { time: "12:00 – 13:00", text: { gr: "Φαγητό", en: "Lunch" } },
    { time: "13:00 – 14:30", text: { gr: "Ξεκούραση", en: "Rest" } },
    { time: "14:30 – 16:00", text: { gr: "Αποχώρηση", en: "Departure" } },
  ];

  const testimonials = [
    {
      name: "Μαρία Π.",
      role: { gr: "Μαμά της Ελένης, 4 ετών", en: "Mom of Eleni, 4" },
      body: {
        gr: "Η κόρη μου πηγαίνει με χαμόγελο κάθε πρωί. Νιώθουμε ότι είναι σαν στο σπίτι.",
        en: "My daughter walks in smiling every morning. We feel like she's at home.",
      },
    },
    {
      name: "Γιώργος Κ.",
      role: { gr: "Μπαμπάς του Νίκου, 3 ετών", en: "Dad of Nikos, 3" },
      body: {
        gr: "Καθημερινή ενημέρωση, ζεστή ομάδα, απίστευτη φροντίδα. Τους ευχαριστούμε.",
        en: "Daily updates, a warm team, incredible care. Thank you.",
      },
    },
    {
      name: "Άννα Σ.",
      role: { gr: "Μαμά της Λυδίας, 5 ετών", en: "Mom of Lydia, 5" },
      body: {
        gr: "Δημιουργικές δραστηριότητες και ασφαλές περιβάλλον. Τη συστήνω σε κάθε γονέα.",
        en: "Creative activities and a safe environment. I recommend Pisipouk to every parent.",
      },
    },
  ];

  const faqPreview = [
    {
      q: { gr: "Ποιες ηλικίες δέχεστε;", en: "What ages do you accept?" },
      a: { gr: "Παιδιά από περίπου 2,5 έως 6 ετών.", en: "Children approximately 2.5 to 6 years old." },
    },
    {
      q: { gr: "Πώς γίνεται η προσαρμογή;", en: "How does adaptation work?" },
      a: { gr: "Σταδιακά, με τον δικό του ρυθμό κάθε παιδιού και στενή συνεργασία με τον γονέα.", en: "Gradually, at each child's own pace and in close collaboration with the parent." },
    },
    {
      q: { gr: "Συμμετέχετε σε προγράμματα voucher;", en: "Do you participate in voucher programs?" },
      a: {
        gr: "Η δυνατότητα συμμετοχής σε προγράμματα voucher εξαρτάται από την εκάστοτε περίοδο και τις διαθέσιμες διαδικασίες.",
        en: "Voucher participation depends on the current period and available procedures.",
      },
    },
  ];

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 gradient-warm opacity-70" aria-hidden />
        <div className="absolute -right-24 top-10 -z-10 h-72 w-72 rounded-full bg-sun/40 blur-3xl" aria-hidden />
        <div className="absolute -left-20 top-40 -z-10 h-72 w-72 rounded-full bg-sky/40 blur-3xl" aria-hidden />

        <div className="container mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-xs font-semibold text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" /> {lang === "gr" ? "Παιδικός Σταθμός & Νηπιαγωγείο" : "Preschool & Kindergarten"}
            </span>
            <h1 className="mt-4 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              {dict.hero.title[lang]}
            </h1>
            <p className="mt-5 max-w-xl text-balance text-lg text-muted-foreground">{dict.hero.subtitle[lang]}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/enrollment">
                  <Calendar className="h-5 w-5" /> {dict.cta.bookLong[lang]}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/program">{dict.cta.viewProgram[lang]} <ChevronRight className="h-4 w-4" /></Link>
              </Button>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {trust.map(({ icon: Icon, k }) => (
                <li key={k} className="flex items-center gap-2 rounded-2xl bg-card/70 px-3 py-2 text-sm shadow-sm backdrop-blur">
                  <Icon className="h-4 w-4 text-primary" /> {dict.trust[k][lang]}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="blob overflow-hidden border-8 border-card bg-card shadow-xl">
              <img
                src={heroImage}
                alt={lang === "gr" ? "Παιδιά παίζουν στον παιδικό σταθμό Πισιπούκ" : "Children playing at Pisipouk preschool"}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
            <div className="absolute -bottom-4 left-4 hidden rounded-2xl bg-card px-4 py-3 shadow-lg sm:block">
              <p className="text-xs text-muted-foreground">{lang === "gr" ? "Ωράριο" : "Hours"}</p>
              <p className="text-sm font-semibold">{dict.contact.hoursValue[lang]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{dict.sections.why[lang]}</h2>
          <p className="mt-3 text-muted-foreground">{dict.positioning[lang]}</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {why.map(({ icon: Icon, title, body }, i) => (
            <div key={i} className="rounded-3xl bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{title[lang]}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body[lang]}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* PHILOSOPHY */}
      <Section tone="muted">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">{dict.sections.philosophy[lang]}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{dict.positioning[lang]}</p>
            <ul className="mt-6 space-y-3">
              {[
                { gr: "Σεβασμός στον ρυθμό κάθε παιδιού", en: "Respect for each child's own rhythm" },
                { gr: "Συνεργασία με τους γονείς", en: "Close collaboration with parents" },
                { gr: "Έμπειρη παιδαγωγική ομάδα", en: "Experienced educational team" },
                { gr: "Μικρές ομάδες & εξατομικευμένη φροντίδα", en: "Small groups & individualized care" },
              ].map((it, i) => (
                <li key={i} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" /> {it[lang]}</li>
              ))}
            </ul>
            <Button asChild className="mt-6 rounded-full">
              <Link to="/about">{dict.cta.learnMore[lang]} <ChevronRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Heart, label: { gr: "Αγάπη", en: "Love" }, color: "bg-blossom text-blossom-foreground" },
              { icon: Shield, label: { gr: "Ασφάλεια", en: "Safety" }, color: "bg-sky text-sky-foreground" },
              { icon: Smile, label: { gr: "Χαρά", en: "Joy" }, color: "bg-sun text-sun-foreground" },
              { icon: Sprout, label: { gr: "Δημιουργικότητα", en: "Creativity" }, color: "bg-leaf text-leaf-foreground" },
            ].map(({ icon: Icon, label, color }, i) => (
              <div key={i} className={`flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl ${color} p-6 text-center shadow-sm`}>
                <Icon className="h-8 w-8" />
                <p className="font-semibold">{label[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* AGE GROUPS */}
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{dict.sections.ageGroups[lang]}</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {ageGroups.map((g, i) => (
            <div key={i} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">{g.age[lang]}</p>
              <h3 className="mt-2 text-2xl font-bold">{g.title[lang]}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{g.body[lang]}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* DAY */}
      <Section tone="warm">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">{dict.sections.aDay[lang]}</h2>
            <p className="mt-3 text-muted-foreground">
              {lang === "gr"
                ? "Μια ισορροπημένη μέρα γεμάτη παιχνίδι, μάθηση, φαγητό και ξεκούραση."
                : "A balanced day full of play, learning, meals and rest."}
            </p>
            <Button asChild variant="outline" className="mt-5 rounded-full">
              <Link to="/daily-life">{dict.cta.learnMore[lang]} <ChevronRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <ol className="space-y-2 rounded-3xl bg-card/80 p-5 shadow-sm backdrop-blur">
            {day.map((d, i) => (
              <li key={i} className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2 text-sm odd:bg-muted/40">
                <span className="font-mono text-xs text-muted-foreground">{d.time}</span>
                <span className="flex-1 text-right font-medium">{d.text[lang]}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{dict.sections.testimonials[lang]}</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((tt, i) => (
            <figure key={i} className="rounded-3xl bg-card p-6 shadow-sm">
              <Sun className="h-6 w-6 text-sun-foreground" />
              <blockquote className="mt-3 text-base leading-relaxed">"{tt.body[lang]}"</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold">{tt.name}</span>{" "}
                <span className="text-muted-foreground">— {tt.role[lang]}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* FAQ PREVIEW */}
      <Section tone="muted">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">{dict.sections.faqPreview[lang]}</h2>
          <div className="mt-8 space-y-3">
            {faqPreview.map((f, i) => (
              <details key={i} className="group rounded-2xl border border-border bg-card p-5">
                <summary className="cursor-pointer list-none font-semibold flex items-center justify-between">
                  {f.q[lang]}
                  <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a[lang]}</p>
              </details>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/faq">{lang === "gr" ? "Όλες οι ερωτήσεις" : "All questions"}</Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* CTA + CONTACT */}
      <Section>
        <div className="rounded-3xl bg-primary p-8 text-primary-foreground sm:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">{dict.sections.contactBlock[lang]}</h2>
              <p className="mt-3 text-primary-foreground/80">
                {lang === "gr"
                  ? "Κλείστε ένα ραντεβού γνωριμίας — θα χαρούμε να σας ξεναγήσουμε στον χώρο μας."
                  : "Book an introductory visit — we'd love to give you a tour of our space."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary" className="rounded-full">
                  <Link to="/enrollment"><Calendar className="h-5 w-5" /> {dict.cta.bookLong[lang]}</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                  <Link to="/contact">{dict.cta.contactUs[lang]}</Link>
                </Button>
              </div>
            </div>
            <ul className="space-y-3 rounded-2xl bg-primary-foreground/10 p-5 text-sm">
              <li className="flex items-center gap-3"><Phone className="h-5 w-5" /> {dict.contact.placeholderPhone}</li>
              <li className="flex items-center gap-3"><Mail className="h-5 w-5" /> {dict.contact.placeholderEmail}</li>
              <li className="flex items-center gap-3"><MapPin className="h-5 w-5" /> {dict.contact.placeholderAddress[lang]}</li>
              <li className="flex items-center gap-3"><Calendar className="h-5 w-5" /> {dict.contact.hoursValue[lang]}</li>
            </ul>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}