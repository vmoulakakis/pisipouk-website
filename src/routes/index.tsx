import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Heart,
  MessageCircle,
  Palette,
  ShieldCheck,
  Sparkles,
  Sprout,
  Users,
  TicketCheck,
  School,
  PhoneCall,
} from "lucide-react";
import logoImage from "@/assets/pisipouk-logo.webp";
import arrivalImage from "@/assets/pisipouk-arrival.webp";
import classroomImage from "@/assets/pisipouk-classroom.webp";
import storyImage from "@/assets/pisipouk-story.webp";
import parentWelcomeImage from "@/assets/parent-welcome.webp";
import realCreativeImage from "@/assets/real-creative-table.webp";
import realCircleImage from "@/assets/real-circle-play.webp";
import realGreeceImage from "@/assets/real-greece-circle.webp";
import sampleMenuImage from "@/assets/sample-menu-september-2026.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ο Πισιπούκ | Παιδικός Σταθμός & Νηπιαγωγείο" },
      {
        name: "description",
        content:
          "Ένα ζεστό και ασφαλές σχολείο για παιδιά 2,5–6 ετών, με δημιουργική μάθηση, παιχνίδι και ουσιαστική συνεργασία με την οικογένεια.",
      },
      {
        property: "og:title",
        content: "Ο Πισιπούκ — Μικρά βήματα, μεγάλα όνειρα",
      },
      {
        property: "og:description",
        content: "Παίζουμε, μαθαίνουμε και μεγαλώνουμε μαζί.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "el_GR" },
    ],
  }),
  component: HomePage,
});

const copy = {
  gr: {
    eyebrow: "Παιδικός Σταθμός & Νηπιαγωγείο",
    title: "Μικρά βήματα. Μεγάλα όνειρα.",
    intro:
      "Στον Πισιπούκ κάθε παιδί βρίσκει χώρο να παίξει, να ανακαλύψει και να ανθίσει — με ασφάλεια, τρυφερότητα και ανθρώπους που το γνωρίζουν πραγματικά.",
    visit: "Κλείστε μια γνωριμία",
    explore: "Δείτε το πρόγραμμά μας",
    trust: ["2,5–6 ετών", "Ολοήμερο πρόγραμμα", "Καθημερινή ενημέρωση"],
    whyKicker: "Γιατί οι πρώτες εμπειρίες μετράνε",
    whyTitle: "Ένα σχολείο που μοιάζει με δεύτερο σπίτι",
    whyBody:
      "Η μάθηση δεν μπαίνει σε κουτάκια. Χτίζεται μέσα από παιχνίδι, κίνηση, τέχνη, ιστορίες, φύση και σταθερές σχέσεις εμπιστοσύνης.",
    values: [
      [
        "Ασφάλεια με φροντίδα",
        "Καθαροί χώροι, σταθερή ρουτίνα και υπεύθυνη παραλαβή.",
      ],
      [
        "Μάθηση μέσα από παιχνίδι",
        "Δραστηριότητες που καλλιεργούν γλώσσα, σκέψη, κίνηση και φαντασία.",
      ],
      [
        "Μικρές ομάδες",
        "Χρόνος και προσοχή για τον ρυθμό, τον χαρακτήρα και τις ανάγκες κάθε παιδιού.",
      ],
      [
        "Μαζί με την οικογένεια",
        "Ανοιχτή επικοινωνία και ουσιαστική εικόνα της καθημερινής εξέλιξης.",
      ],
    ],
    dayKicker: "Μια μέρα στον Πισιπούκ",
    dayTitle: "Κάθε μέρα έχει ρυθμό, αλλά ποτέ δεν είναι ίδια",
    dayBody:
      "Η μέρα εναλλάσσει ελεύθερο παιχνίδι, οργανωμένες δραστηριότητες, φαγητό, ξεκούραση και χρόνο έξω. Έτσι το παιδί νιώθει σιγουριά χωρίς να χάνει τη χαρά της ανακάλυψης.",
    moments: [
      "Υποδοχή & ελεύθερο παιχνίδι",
      "Κύκλος ομάδας & δημιουργία",
      "Κίνηση, φύση & εξερεύνηση",
      "Φαγητό, ξεκούραση & ήρεμη αποχώρηση",
    ],
    groupsKicker: "Μεγαλώνουμε μαζί",
    groupsTitle: "Το σωστό πλαίσιο για κάθε ηλικία",
    groups: [
      [
        "2,5–4",
        "Παιδικός σταθμός",
        "Αυτονομία, κοινωνικοποίηση και ανακάλυψη μέσα από αισθητηριακό παιχνίδι.",
      ],
      [
        "4–5",
        "Προ-νηπιαγωγείο",
        "Γλώσσα, μουσικοκινητική, εικαστικά και πρώτες οργανωμένες ομαδικές εμπειρίες.",
      ],
      [
        "5–6",
        "Νηπιαγωγείο",
        "Δημιουργική προετοιμασία για το σχολείο με αυτοπεποίθηση και περιέργεια.",
      ],
    ],
    finalTitle: "Η επιλογή σχολείου ξεκινά με μια αληθινή γνωριμία.",
    finalBody:
      "Ελάτε να δείτε τον χώρο, να γνωρίσετε την ομάδα και να συζητήσουμε όσα χρειάζεται το παιδί σας.",
  },
  en: {
    eyebrow: "Preschool & Kindergarten",
    title: "Small steps. Big dreams.",
    intro:
      "At Pisipouk every child has room to play, discover and thrive — with safety, warmth and people who truly know them.",
    visit: "Book a visit",
    explore: "Explore our program",
    trust: ["Ages 2.5–6", "Full-day program", "Daily parent updates"],
    whyKicker: "Because first experiences matter",
    whyTitle: "A school that feels like a second home",
    whyBody:
      "Learning is built through play, movement, art, stories, nature and steady relationships of trust.",
    values: [
      [
        "Safe and cared for",
        "Thoughtful routines, clean spaces and responsible pickup.",
      ],
      [
        "Learning through play",
        "Experiences that develop language, thinking, movement and imagination.",
      ],
      [
        "Small groups",
        "Time and attention for every child’s pace, character and needs.",
      ],
      [
        "Together with families",
        "Open communication and a meaningful view of everyday progress.",
      ],
    ],
    dayKicker: "A day at Pisipouk",
    dayTitle: "Every day has a rhythm, but no two days are the same",
    dayBody:
      "Free play, guided activities, meals, rest and outdoor time create a reassuring rhythm without losing the joy of discovery.",
    moments: [
      "Arrival & free play",
      "Group circle & creativity",
      "Movement, nature & discovery",
      "Lunch, rest & calm departure",
    ],
    groupsKicker: "Growing together",
    groupsTitle: "The right setting for every age",
    groups: [
      [
        "2.5–4",
        "Preschool",
        "Independence, social skills and discovery through sensory play.",
      ],
      [
        "4–5",
        "Pre-K",
        "Language, music and movement, art and first structured group experiences.",
      ],
      [
        "5–6",
        "Kindergarten",
        "Creative preparation for school with confidence and curiosity.",
      ],
    ],
    finalTitle: "Choosing a school starts with a real conversation.",
    finalBody:
      "Come see the space, meet the team and talk with us about what your child needs.",
  },
};

const valueIcons = [ShieldCheck, Palette, Users, MessageCircle];

function EnrollmentSplash({ lang }: { lang: "gr" | "en" }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = window.sessionStorage.getItem("pisipouk-enrollment-2026");
    if (seen) return;
    const timer = window.setTimeout(() => setOpen(true), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const changeOpen = (value: boolean) => {
    setOpen(value);
    if (!value)
      window.sessionStorage.setItem("pisipouk-enrollment-2026", "seen");
  };

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogContent className="max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-4xl overflow-y-auto rounded-[2rem] border-0 bg-background p-0">
        <div className="grid lg:grid-cols-[0.88fr_1.12fr]">
          <div className="relative hidden min-h-[600px] overflow-hidden bg-sky lg:block">
            <img
              src={parentWelcomeImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-transparent to-transparent" />
            <p className="absolute bottom-7 left-7 right-7 text-2xl font-black leading-tight text-white">
              {lang === "gr"
                ? "Η πρώτη επίσκεψη δεν είναι απλώς ένα ραντεβού. Είναι η στιγμή που νιώθετε αν αυτό είναι το σωστό μέρος."
                : "The first visit is more than an appointment. It is the moment you feel whether this is the right place."}
            </p>
          </div>
          <div className="p-6 sm:p-9">
            <div className="flex items-center gap-3 pr-8">
              <img
                src={logoImage}
                alt=""
                className="h-16 w-16 object-contain"
                aria-hidden="true"
              />
              <span className="rounded-full bg-blossom px-3 py-1 text-xs font-black text-blossom-foreground">
                {lang === "gr"
                  ? "ΣΧΟΛΙΚΗ ΧΡΟΝΙΑ 2026–2027"
                  : "SCHOOL YEAR 2026–2027"}
              </span>
            </div>
            <DialogTitle className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
              {lang === "gr"
                ? "Τι χρειάζεται η οικογένειά σας τώρα;"
                : "What does your family need right now?"}
            </DialogTitle>
            <DialogDescription className="mt-3 text-base leading-7">
              {lang === "gr"
                ? "Διαλέξτε το επόμενο βήμα και θα σας οδηγήσουμε κατευθείαν στη σωστή πληροφορία."
                : "Choose your next step and we will take you directly to the right information."}
            </DialogDescription>
            <div className="mt-7 grid gap-3">
              <DialogClose asChild>
                <Link to="/enrollment" className="splash-choice">
                  <School className="h-6 w-6 text-primary" />
                  <span>
                    <strong>
                      {lang === "gr"
                        ? "Με ενδιαφέρει θέση για το 2026–2027"
                        : "I am interested in a 2026–2027 place"}
                    </strong>
                    <small>
                      {lang === "gr"
                        ? "Δήλωση ενδιαφέροντος και βασικές πληροφορίες εγγραφής"
                        : "Register interest and see enrollment information"}
                    </small>
                  </span>
                  <ArrowRight className="ml-auto h-5 w-5" />
                </Link>
              </DialogClose>
              <DialogClose asChild>
                <Link to="/espa-2026-2027" className="splash-choice">
                  <TicketCheck className="h-6 w-6 text-leaf-foreground" />
                  <span>
                    <strong>
                      {lang === "gr"
                        ? "Θέλω ενημέρωση για voucher / ΕΣΠΑ"
                        : "I want voucher / funding updates"}
                    </strong>
                    <small>
                      {lang === "gr"
                        ? "Χωρίς μη επιβεβαιωμένες υποσχέσεις ή ημερομηνίες"
                        : "Clear updates without unconfirmed promises"}
                    </small>
                  </span>
                  <ArrowRight className="ml-auto h-5 w-5" />
                </Link>
              </DialogClose>
              <DialogClose asChild>
                <Link
                  to="/book-visit"
                  className="splash-choice splash-choice-primary"
                >
                  <PhoneCall className="h-6 w-6" />
                  <span>
                    <strong>
                      {lang === "gr"
                        ? "Θέλω να γνωρίσω τον Πισιπούκ"
                        : "I want to meet Pisipouk"}
                    </strong>
                    <small>
                      {lang === "gr"
                        ? "Κλείστε επίσκεψη και μιλήστε για το παιδί σας"
                        : "Book a visit and tell us about your child"}
                    </small>
                  </span>
                  <ArrowRight className="ml-auto h-5 w-5" />
                </Link>
              </DialogClose>
            </div>
            <p className="mt-6 text-xs leading-5 text-muted-foreground">
              {lang === "gr"
                ? "Οι θέσεις και η δυνατότητα voucher επιβεβαιώνονται προσωπικά από τον σταθμό. Δεν εμφανίζουμε ψεύτικο countdown ή μη επιβεβαιωμένη διαθεσιμότητα."
                : "Places and voucher eligibility are confirmed personally by the school. We do not show fake countdowns or unverified availability."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HomePage() {
  const { lang } = useLanguage();
  const c = copy[lang];
  return (
    <SiteLayout>
      <EnrollmentSplash lang={lang} />
      <section className="hero-field relative overflow-hidden">
        <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-10 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-6 flex items-center gap-3">
              <img
                src={logoImage}
                alt=""
                className="h-20 w-20 object-contain"
                aria-hidden="true"
              />
              <p className="font-hand text-lg font-bold text-primary">
                {c.eyebrow}
              </p>
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              {c.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
              {c.intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-13 rounded-full px-7 text-base shadow-lg shadow-primary/20"
              >
                <Link to="/book-visit">
                  <CalendarDays className="h-5 w-5" />
                  {c.visit}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-13 rounded-full border-2 bg-white/70 px-7 text-base"
              >
                <Link to="/program">
                  {c.explore}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-foreground/75">
              {c.trust.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-leaf-foreground" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
            <div className="photo-frame rotate-[1.2deg] overflow-hidden rounded-[2.2rem] bg-white p-2 shadow-2xl shadow-sky/30">
              <img
                src={arrivalImage}
                alt={
                  lang === "gr"
                    ? "Οικογένεια φτάνει σε έναν φωτεινό παιδικό σταθμό"
                    : "A family arriving at a bright preschool"
                }
                className="aspect-[4/3] w-full rounded-[1.8rem] object-cover"
                fetchPriority="high"
              />
            </div>
            <div className="absolute -bottom-6 -left-3 rounded-3xl bg-foreground px-5 py-4 text-background shadow-xl sm:left-8">
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 fill-blossom text-blossom" />
                <span className="max-w-[13rem] text-sm font-bold">
                  {lang === "gr"
                    ? "Εδώ κάθε παιδί είναι γνωστό με το όνομά του."
                    : "Here, every child is known by name."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-white py-7">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 md:grid-cols-3 lg:px-8">
          <Link to="/book-visit" className="parent-path">
            <CalendarDays className="h-6 w-6 text-primary" />
            <span>
              <strong>
                {lang === "gr" ? "Να γνωρίσω τον χώρο" : "Meet the school"}
              </strong>
              <small>
                {lang === "gr"
                  ? "Κλείνω προσωπική επίσκεψη"
                  : "Book a personal visit"}
              </small>
            </span>
            <ArrowRight className="ml-auto h-5 w-5" />
          </Link>
          <Link to="/espa-2026-2027" className="parent-path">
            <TicketCheck className="h-6 w-6 text-leaf-foreground" />
            <span>
              <strong>
                {lang === "gr"
                  ? "Έχω ή περιμένω voucher"
                  : "I have or expect a voucher"}
              </strong>
              <small>
                {lang === "gr"
                  ? "Βλέπω την επίσημη ενημέρωση"
                  : "See the official update"}
              </small>
            </span>
            <ArrowRight className="ml-auto h-5 w-5" />
          </Link>
          <Link to="/enrollment" className="parent-path">
            <PhoneCall className="h-6 w-6 text-blossom-foreground" />
            <span>
              <strong>
                {lang === "gr"
                  ? "Θέλω θέση 2026–2027"
                  : "I want a 2026–2027 place"}
              </strong>
              <small>
                {lang === "gr"
                  ? "Δηλώνω ενδιαφέρον έγκαιρα"
                  : "Register interest early"}
              </small>
            </span>
            <ArrowRight className="ml-auto h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="section-kicker">{c.whyKicker}</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                {c.whyTitle}
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                {c.whyBody}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {c.values.map(([title, body], index) => {
                const Icon = valueIcons[index];
                return (
                  <article
                    key={title}
                    className="value-card group rounded-[1.75rem] border bg-card p-6"
                  >
                    <Icon className="h-7 w-7 text-primary" />
                    <h3 className="mt-5 text-xl font-bold">{title}</h3>
                    <p className="mt-2 leading-7 text-muted-foreground">
                      {body}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink overflow-hidden py-20 text-white sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="relative">
            <img
              src={classroomImage}
              alt={
                lang === "gr"
                  ? "Παιδαγωγός παίζει δημιουργικά με παιδιά"
                  : "Teacher leading creative play"
              }
              className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-2xl"
              loading="lazy"
            />
            <span className="absolute -right-3 -top-4 inline-flex h-16 w-16 rotate-6 items-center justify-center rounded-2xl bg-sun text-sun-foreground shadow-lg">
              <Sparkles className="h-8 w-8" />
            </span>
          </div>
          <div>
            <p className="section-kicker text-sun">{c.dayKicker}</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              {c.dayTitle}
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/70">{c.dayBody}</p>
            <ol className="mt-8 grid gap-3 sm:grid-cols-2">
              {c.moments.map((item, i) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <span className="font-hand text-2xl font-black text-sun">
                    0{i + 1}
                  </span>
                  <span className="font-semibold">{item}</span>
                </li>
              ))}
            </ol>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="mt-8 rounded-full"
            >
              <Link to="/daily-life">
                {lang === "gr"
                  ? "Δείτε την καθημερινότητά μας"
                  : "See our daily life"}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-kicker">{c.groupsKicker}</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              {c.groupsTitle}
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {c.groups.map(([age, title, body], i) => (
              <article
                key={age}
                className={`age-card age-card-${i + 1} rounded-[2rem] p-7`}
              >
                <p className="font-hand text-lg font-black">
                  {age} {lang === "gr" ? "ετών" : "years"}
                </p>
                <h3 className="mt-8 text-2xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-foreground/70">{body}</p>
                <Link
                  to="/program"
                  className="mt-7 inline-flex items-center gap-2 font-bold underline decoration-2 underline-offset-4"
                >
                  {lang === "gr" ? "Μάθετε περισσότερα" : "Learn more"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/55 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="section-kicker">
                {lang === "gr"
                  ? "Αληθινές στιγμές, με ιδιωτικότητα"
                  : "Real moments, with privacy"}
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                {lang === "gr"
                  ? "Η καθημερινότητα φαίνεται στις μικρές λεπτομέρειες"
                  : "Everyday care lives in the small details"}
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                {lang === "gr"
                  ? "Δημιουργία, συνεργασία, κίνηση και κοινές εμπειρίες. Οι πραγματικές φωτογραφίες παρουσιάζονται από ψηλά ή χωρίς αναγνωρίσιμα πρόσωπα παιδιών."
                  : "Creativity, cooperation, movement and shared experiences. Real photos are shown from above or without identifiable children’s faces."}
              </p>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="mt-7 rounded-full border-2 bg-white"
              >
                <Link to="/gallery">
                  {lang === "gr"
                    ? "Δείτε περισσότερες στιγμές"
                    : "See more moments"}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="moment-grid">
              <img
                src={realCreativeImage}
                alt={
                  lang === "gr"
                    ? "Δημιουργική δραστηριότητα από ψηλά"
                    : "Creative activity viewed from above"
                }
                loading="lazy"
              />
              <img
                src={realCircleImage}
                alt={
                  lang === "gr"
                    ? "Ομαδικό παιχνίδι στην αυλή από ψηλά"
                    : "Group play in the yard from above"
                }
                loading="lazy"
              />
              <img
                src={realGreeceImage}
                alt={
                  lang === "gr"
                    ? "Ομαδική δραστηριότητα γύρω από την ελληνική σημαία"
                    : "Group activity around the Greek flag"
                }
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:px-8">
          <div>
            <p className="section-kicker">
              {lang === "gr"
                ? "Διατροφή με διαφάνεια"
                : "Food with transparency"}
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              {lang === "gr"
                ? "Τι μπορεί να τρώει το παιδί σε έναν μήνα;"
                : "What might a child eat over a month?"}
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              {lang === "gr"
                ? "Παρακάτω παρουσιάζεται ενδεικτικό μηνιαίο μενού Σεπτεμβρίου 2026. Το πραγματικό μενού κάθε περιόδου μπορεί να προσαρμόζεται με βάση εποχικότητα, διαθεσιμότητα και διατροφικές ανάγκες."
                : "Below is a sample September 2026 monthly menu. The current menu may change for seasonality, availability and dietary needs."}
            </p>
            <ul className="mt-6 space-y-3 text-sm font-bold">
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-primary" />
                {lang === "gr"
                  ? "Πρωινό και μεσημεριανό σε καθαρή εβδομαδιαία εικόνα"
                  : "Breakfast and lunch in a clear weekly view"}
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-primary" />
                {lang === "gr"
                  ? "Ορατές βασικές κατηγορίες γευμάτων"
                  : "Visible core meal categories"}
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-primary" />
                {lang === "gr"
                  ? "Ενημέρωση για αλλεργίες και ειδικές ανάγκες προσωπικά"
                  : "Allergy and special-needs guidance handled personally"}
              </li>
            </ul>
            <Button asChild size="lg" className="mt-7 rounded-full">
              <Link to="/nutrition">
                {lang === "gr"
                  ? "Η διατροφική μας προσέγγιση"
                  : "Our food approach"}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          <figure className="rounded-[2rem] border bg-white p-3 shadow-xl">
            <img
              src={sampleMenuImage}
              alt={
                lang === "gr"
                  ? "Ενδεικτικό μηνιαίο μενού Πισιπούκ, Σεπτέμβριος 2026"
                  : "Sample Pisipouk monthly menu, September 2026"
              }
              className="w-full rounded-[1.4rem]"
              loading="lazy"
            />
            <figcaption className="px-3 pb-1 pt-3 text-center text-xs text-muted-foreground">
              {lang === "gr"
                ? "Ενδεικτικό παράδειγμα — όχι το τρέχον δεσμευτικό μενού."
                : "Illustrative example — not the current binding menu."}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-foreground py-16 text-background sm:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <p className="section-kicker text-sun">{lang === "gr" ? "Οι ερωτήσεις που έχει κάθε γονιός" : "The questions every parent has"}</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                {lang === "gr" ? "Θα νιώθει ασφαλές; Θα περνά καλά; Θα ξέρω πώς ήταν η μέρα του;" : "Will my child feel safe, enjoy the day and will I know how it went?"}
              </h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-background/75">
                {lang === "gr"
                  ? "Αυτές είναι οι σωστές ερωτήσεις. Η καθημερινή φροντίδα, η σχέση με τους παιδαγωγούς, η επικοινωνία με την οικογένεια και η ομαλή προσαρμογή είναι πιο σημαντικές από μια λίστα παροχών."
                  : "These are the right questions. Daily care, trusted educators, family communication and a thoughtful settling-in process matter more than a list of features."}
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  lang === "gr" ? "Καθημερινή ενημέρωση γονέων" : "Daily parent updates",
                  lang === "gr" ? "Υποστήριξη από παιδοψυχολόγο" : "Child psychologist support",
                  lang === "gr" ? "Πλήρης διατροφή με διαιτολόγο" : "Meal plan with dietitian guidance",
                  lang === "gr" ? "Μεγάλος αυλόγυρος & δραστηριότητες" : "Large outdoor space & activities",
                ].map((item)=><div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"><Check className="h-5 w-5 shrink-0 text-sun" /><span className="font-bold">{item}</span></div>)}
              </div>
            </div>
            <div className="rounded-[2rem] bg-white/8 p-7 ring-1 ring-white/10">
              <p className="text-sm font-black uppercase tracking-[.15em] text-sun">{lang === "gr" ? "Σχολική χρονιά 2026–2027" : "School year 2026–2027"}</p>
              <h3 className="mt-4 text-3xl font-black">{lang === "gr" ? "Μην περιμένετε να αποφασίσετε από φωτογραφίες." : "Do not decide from photos alone."}</h3>
              <p className="mt-4 leading-7 text-background/75">{lang === "gr" ? "Οι επισκέψεις γίνονται κατόπιν συνεννόησης και η διαθεσιμότητα επιβεβαιώνεται προσωπικά από τον σταθμό. Αν σκέφτεστε εγγραφή, προγραμματίστε έγκαιρα μια γνωριμία." : "Visits are by appointment and availability is confirmed directly by the school. If you are considering enrollment, arrange a visit early."}</p>
              <div className="mt-6 grid gap-3">
                <Button asChild size="lg" variant="secondary" className="rounded-full"><Link to="/book-visit"><CalendarDays className="h-5 w-5" />{lang === "gr" ? "Κλείστε επίσκεψη" : "Book a visit"}</Link></Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"><Link to="/blog">{lang === "gr" ? "Δείτε το blog για γονείς" : "Explore the parent blog"}<ArrowRight className="h-5 w-5" /></Link></Button>
              </div>
              <p className="mt-4 text-xs leading-5 text-background/55">{lang === "gr" ? "Δεν εμφανίζουμε τεχνητή διαθεσιμότητα ή ψεύτικες «τελευταίες θέσεις». Ρωτήστε μας για την πραγματική εικόνα." : "We do not show artificial scarcity or fake ‘last spots’. Ask us for the real availability."}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-sun px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
            <img
              src={storyImage}
              alt=""
              className="absolute inset-y-0 right-0 hidden h-full w-[46%] object-cover opacity-20 mix-blend-multiply lg:block"
              aria-hidden="true"
            />
            <div className="relative max-w-2xl">
              <Sprout className="h-9 w-9 text-leaf-foreground" />
              <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                {c.finalTitle}
              </h2>
              <p className="mt-5 text-lg leading-8 text-foreground/75">
                {c.finalBody}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/book-visit">
                    <CalendarDays className="h-5 w-5" />
                    {c.visit}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-2 bg-white/70"
                >
                  <Link to="/contact">
                    {lang === "gr" ? "Επικοινωνήστε μαζί μας" : "Contact us"}
                  </Link>
                </Button>
              </div>
              <p className="mt-6 flex items-center gap-2 text-sm font-bold text-foreground/65">
                <Clock3 className="h-4 w-4" />
                {lang === "gr"
                  ? "Η επίσκεψη γίνεται κατόπιν συνεννόησης."
                  : "Visits are available by appointment."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
