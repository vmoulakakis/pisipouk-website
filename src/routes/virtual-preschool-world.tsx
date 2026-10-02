import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Brain,
  Clock3,
  Gamepad2,
  Heart,
  Leaf,
  Palette,
  Printer,
  Scissors,
  Sparkles,
  Star,
  Users,
  WandSparkles,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { trackEvent } from "@/lib/pisipoukApi";
import pisipoukLogo from "@/assets/pisipouk-logo.webp";

export const Route = createFileRoute("/virtual-preschool-world")({
  head: () => ({
    meta: [
      { title: "Online Preschool World Preview | Ο Πισιπούκ" },
      {
        name: "description",
        content:
          "Art-directed Online Preschool του Πισιπούκ για παιδιά 2–6 ετών: παιχνίδια, A4 printables, χειροτεχνίες, learning zones και ασφαλής προσωπικός Pisi Guide.",
      },
    ],
  }),
  component: WorldPreschool,
});

type Age = "2–3" | "4–5" | "5–6";
type Mood = "ενέργεια" | "ήρεμα" | "δημιουργία";
type Goal = "γλώσσα" | "μαθηματικά" | "κινητικότητα" | "συναίσθημα";
type Time = 5 | 10 | 15;

type CatalogItem = {
  id: string;
  type: "game" | "printable" | "craft";
  title: string;
  emoji: string;
  age: string;
  skill: string;
  href: string;
  season: string;
};

type WeeklyConfig = {
  week: string;
  items: string[];
};

type Recommendation = {
  title: string;
  why: string;
  href: string;
  icon: string;
  offline: string;
};

const FALLBACK_WEEKLY: CatalogItem[] = [
  { id: "game-memory", type: "game", title: "Παιχνίδι Μνήμης", emoji: "🧠", age: "3–6", skill: "Μνήμη · προσοχή", href: "/learning-games/memory?age=4-5", season: "all" },
  { id: "game-colors-shapes", type: "game", title: "Χρώματα & Σχήματα", emoji: "🎨", age: "2–5", skill: "Οπτική διάκριση", href: "/learning-games/colors-shapes?age=2-3", season: "all" },
  { id: "print-dot-pattern", type: "printable", title: "Συνέχισε το Μοτίβο", emoji: "🔴", age: "3–6", skill: "Μοτίβα · πρόβλεψη", href: "/virtual-preschool-grace#printable-dot-pattern", season: "all" },
  { id: "print-trace-paths", type: "printable", title: "Μονοπάτια για Μολύβι", emoji: "✏️", age: "2–5", skill: "Προγραφή · έλεγχος χεριού", href: "/virtual-preschool-grace#printable-trace-paths", season: "all" },
  { id: "craft-owl", type: "craft", title: "Χτίσε τη Μικρή Κουκουβάγια", emoji: "🦉", age: "3–6", skill: "Κόψε · χρωμάτισε · κόλλησε", href: "/virtual-preschool-grace#printable-owl", season: "all" },
  { id: "craft-rocket", type: "craft", title: "Ο Πύραυλος του Πισιπούκ", emoji: "🚀", age: "4–6", skill: "Σχήματα · κατασκευή", href: "/virtual-preschool-grace#printable-rocket", season: "all" },
];

const WORLD_CARDS = [
  {
    title: "Παιχνίδια",
    subtitle: "Παίζω · λύνω · ανακαλύπτω",
    icon: Gamepad2,
    href: "/learning-games",
    bg: "from-[#ffe5ea] via-[#fff0df] to-[#fff9f1]",
    accent: "#f54870",
    art: "🦁",
  },
  {
    title: "Ζωγραφιές & A4",
    subtitle: "Χρώματα · γραμμές · γράμματα",
    icon: Palette,
    href: "/virtual-preschool-grace#printables",
    bg: "from-[#dff8ff] via-[#ecfbff] to-[#f7fdff]",
    accent: "#16a8c5",
    art: "🖍️",
  },
  {
    title: "Χειροτεχνίες & Πατρόν",
    subtitle: "Κόβω · κολλάω · δημιουργώ",
    icon: Scissors,
    href: "/virtual-preschool-grace#printables",
    bg: "from-[#fff1c9] via-[#fff7df] to-[#fffaf1]",
    accent: "#f4a51c",
    art: "🦋",
  },
  {
    title: "Φύση & STEM",
    subtitle: "Παρατήρηση · πείραμα · απορία",
    icon: Leaf,
    href: "/seasonal-packs",
    bg: "from-[#dcf8e5] via-[#effcf3] to-[#fbfffc]",
    accent: "#2aaf73",
    art: "🌱",
  },
];

const LEARNING_ZONES = [
  { title: "Γλώσσα", note: "ιστορίες, λέξεις, προγραφή", icon: BookOpen, tone: "bg-rose-50 text-rose-700" },
  { title: "Μαθηματικά", note: "αριθμοί, σχήματα, μοτίβα", icon: Brain, tone: "bg-sky-50 text-sky-700" },
  { title: "Τέχνη", note: "χρώμα, σύνθεση, φαντασία", icon: Palette, tone: "bg-amber-50 text-amber-700" },
  { title: "Συναισθήματα", note: "αναγνώριση και έκφραση", icon: Heart, tone: "bg-pink-50 text-pink-700" },
  { title: "Κίνηση", note: "χέρι, σώμα, συντονισμός", icon: WandSparkles, tone: "bg-violet-50 text-violet-700" },
  { title: "Μαζί", note: "επικοινωνία και συνεργασία", icon: Users, tone: "bg-emerald-50 text-emerald-700" },
];

function recommendation(age: Age, mood: Mood, goal: Goal, time: Time): Recommendation {
  const key = `${age}-${mood}-${goal}`;
  const picks: Record<string, Recommendation> = {
    "2–3-ενέργεια-μαθηματικά": { title: "Χρώματα & Σχήματα", why: "Μεγάλα αντικείμενα και άμεση επιλογή, ιδανικά για μικρή ηλικία με ενέργεια.", href: "/learning-games/colors-shapes?age=2-3", icon: "🔵", offline: "Βρείτε 3 κύκλους μέσα στο σπίτι." },
    "2–3-ήρεμα-κινητικότητα": { title: "Μονοπάτια για Μολύβι", why: "Μικρή, ήρεμη άσκηση προγραφής χωρίς απαίτηση για ακρίβεια.", href: "/virtual-preschool-grace#printable-trace-paths", icon: "✏️", offline: "Κάντε πρώτα τη διαδρομή με το δάχτυλο στον αέρα." },
    "2–3-δημιουργία-συναίσθημα": { title: "Ζωγραφίζω το πρόσωπό μου", why: "Το παιδί εκφράζεται με χρώμα αντί να χρειάζεται να βρει τις σωστές λέξεις.", href: "/virtual-preschool", icon: "🎨", offline: "Κάντε μαζί μία χαρούμενη και μία ήρεμη φατσούλα." },
    "4–5-ενέργεια-γλώσσα": { title: "Σωστή Κατηγορία", why: "Γρήγορο drag & drop με λέξεις και κατηγορίες που κρατά ενεργή την προσοχή.", href: "/learning-games/sort?age=4-5", icon: "🧺", offline: "Χωρίστε 6 αντικείμενα σε δύο ομάδες και ονομάστε τες." },
    "4–5-ήρεμα-μαθηματικά": { title: "Συνέχισε το Μοτίβο", why: "Ήρεμη λογική, πρόβλεψη και πρώιμη μαθηματική σκέψη.", href: "/virtual-preschool-grace#printable-dot-pattern", icon: "🔴", offline: "Φτιάξτε μοτίβο με κουτάλια και πιρούνια." },
    "4–5-δημιουργία-κινητικότητα": { title: "Μικρή Κουκουβάγια", why: "Χρώμα, κόψιμο και σύνθεση σε μία μικρή χειροτεχνία.", href: "/virtual-preschool-grace#printable-owl", icon: "🦉", offline: "Δώστε όνομα στην κουκουβάγια και φτιάξτε της μία φωλιά." },
    "5–6-ενέργεια-μαθηματικά": { title: "Βρες το Μοτίβο", why: "Πιο σύνθετη πρόκληση λογικής με μικρούς επαναλαμβανόμενους γύρους.", href: "/learning-games/pattern?age=5-6", icon: "🔷", offline: "Φτιάξτε δικό σας μοτίβο με 3 χρώματα." },
    "5–6-ήρεμα-γλώσσα": { title: "Βάλε την Ιστορία σε Σειρά", why: "Καλλιεργεί αφήγηση, ακολουθία και αιτία–αποτέλεσμα χωρίς πίεση χρόνου.", href: "/virtual-preschool-grace#printable-story-cards", icon: "📚", offline: "Πείτε την ίδια ιστορία με διαφορετικό τέλος." },
    "5–6-δημιουργία-συναίσθημα": { title: "Τροχός Συναισθημάτων", why: "Συνδυάζει κατασκευή, γλώσσα και αναγνώριση συναισθήματος.", href: "/virtual-preschool-grace#printable-emotion-wheel", icon: "🙂", offline: "Δείξτε ένα συναίσθημα χωρίς λόγια και μαντέψτε το." },
  };

  const exact = picks[key];
  if (exact) return exact;

  if (goal === "συναίσθημα") return { title: "Τροχός Συναισθημάτων", why: "Μία ήρεμη αφετηρία για να μιλήσουμε για το πώς νιώθουμε.", href: "/virtual-preschool-grace#printable-emotion-wheel", icon: "💛", offline: "Διαλέξτε μαζί μία λέξη για το σημερινό συναίσθημα." };
  if (goal === "κινητικότητα") return { title: "Μονοπάτια για Μολύβι", why: "Μικρή εξάσκηση χεριού που προσαρμόζεται εύκολα στη διάρκεια που έχετε.", href: "/virtual-preschool-grace#printable-trace-paths", icon: "✏️", offline: "Κάντε μεγάλα κύματα με κορδέλα ή μαντήλι." };
  if (goal === "γλώσσα") return { title: "Παιχνίδι Μνήμης με Λέξεις", why: "Ονομάζουμε, θυμόμαστε και περιγράφουμε μαζί.", href: `/learning-games/memory?age=${age === "2–3" ? "2-3" : age === "5–6" ? "5-6" : "4-5"}`, icon: "🧠", offline: "Διαλέξτε 3 εικόνες και φτιάξτε μία μικρή ιστορία." };
  return { title: "Χρώματα & Σχήματα", why: `Καθαρή μαθηματική πρόκληση που χωρά άνετα σε ${time} λεπτά.`, href: "/learning-games/colors-shapes?age=4-5", icon: "🔶", offline: "Βρείτε 5 σχήματα γύρω σας." };
}

function WorldPreschool() {
  const [age, setAge] = useState<Age>("4–5");
  const [weekly, setWeekly] = useState<CatalogItem[]>(FALLBACK_WEEKLY);
  const [weekLabel, setWeekLabel] = useState("Αυτή την εβδομάδα");
  const [stars, setStars] = useState(0);

  useEffect(() => {
    void trackEvent("preschool_world_open", { version: "world-v1" });
    try {
      const storedAge = localStorage.getItem("pisipouk_world_age") as Age | null;
      const storedStars = Number(localStorage.getItem("pisipouk_world_stars") ?? "0");
      if (storedAge && ["2–3", "4–5", "5–6"].includes(storedAge)) setAge(storedAge);
      if (Number.isFinite(storedStars)) setStars(storedStars);
    } catch {}

    const loadWeekly = async () => {
      try {
        const [catalogResponse, weeklyResponse] = await Promise.all([
          fetch("/preschool-catalog.json", { cache: "no-store" }),
          fetch("/preschool-weekly.json", { cache: "no-store" }),
        ]);
        if (!catalogResponse.ok || !weeklyResponse.ok) return;
        const catalog = (await catalogResponse.json()) as { items: CatalogItem[] };
        const config = (await weeklyResponse.json()) as WeeklyConfig;
        const byId = new Map(catalog.items.map((item) => [item.id, item]));
        const selected = config.items.map((id) => byId.get(id)).filter(Boolean) as CatalogItem[];
        if (selected.length) setWeekly(selected);
        if (config.week) setWeekLabel(`Εβδομάδα ${config.week.replace("-W", " · ")}`);
      } catch {}
    };
    void loadWeekly();
  }, []);

  const chooseAge = (value: Age) => {
    setAge(value);
    try { localStorage.setItem("pisipouk_world_age", value); } catch {}
    void trackEvent("preschool_world_age", { age: value });
  };

  const today = useMemo(() => {
    if (age === "2–3") return [
      { icon: "☀️", title: "Ζέσταμα", note: "Κάνουμε 3 μεγάλες κινήσεις", href: "#pisi-guide" },
      { icon: "🔵", title: "Παιχνίδι", note: "Χρώματα & Σχήματα", href: "/learning-games/colors-shapes?age=2-3" },
      { icon: "✏️", title: "Χαρτί", note: "Μονοπάτια για Μολύβι", href: "/virtual-preschool-grace#printable-trace-paths" },
      { icon: "🌈", title: "Μακριά από οθόνη", note: "Βρίσκουμε χρώματα στο σπίτι", href: "#parent-zone" },
    ];
    if (age === "5–6") return [
      { icon: "☀️", title: "Ζέσταμα", note: "Λέμε 3 πράγματα που παρατηρούμε", href: "#pisi-guide" },
      { icon: "🔷", title: "Παιχνίδι", note: "Βρες το Μοτίβο", href: "/learning-games/pattern?age=5-6" },
      { icon: "📚", title: "Χαρτί", note: "Ιστορία σε Σειρά", href: "/virtual-preschool-grace#printable-story-cards" },
      { icon: "🚀", title: "Δημιουργία", note: "Πύραυλος από Σχήματα", href: "/virtual-preschool-grace#printable-rocket" },
    ];
    return [
      { icon: "☀️", title: "Ζέσταμα", note: "Μία μικρή κουβέντα για τη μέρα", href: "#pisi-guide" },
      { icon: "🧠", title: "Παιχνίδι", note: "Παιχνίδι Μνήμης", href: "/learning-games/memory?age=4-5" },
      { icon: "🎨", title: "Δημιουργία", note: "Συνέχισε το Μοτίβο", href: "/virtual-preschool-grace#printable-dot-pattern" },
      { icon: "🦉", title: "Χειροτεχνία", note: "Μικρή Κουκουβάγια", href: "/virtual-preschool-grace#printable-owl" },
    ];
  }, [age]);

  const addStar = () => {
    const next = Math.min(stars + 1, 12);
    setStars(next);
    try { localStorage.setItem("pisipouk_world_stars", String(next)); } catch {}
  };

  return (
    <SiteLayout>
      <main className="overflow-hidden bg-[#fffaf4] text-[#19324a]">
        <section className="relative isolate border-b border-orange-100 bg-[radial-gradient(circle_at_8%_12%,#fff0c8_0,transparent_24%),radial-gradient(circle_at_88%_6%,#dff7e8_0,transparent_26%),linear-gradient(180deg,#fffdf9_0%,#fff7ee_100%)]">
          <DecorativeCloud className="absolute -left-20 top-16 opacity-70" />
          <DecorativeCloud className="absolute -right-16 top-36 scale-75 opacity-50" />
          <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 sm:pb-12 sm:pt-10">
            <div className="grid gap-7 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-[#0b3b82] shadow-sm backdrop-blur">
                  <Sparkles className="h-4 w-4 text-[#f6ad22]" /> Online Preschool · World Preview
                </div>
                <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[.94] tracking-[-.045em] text-[#103d78] sm:text-6xl lg:text-[5.25rem]">
                  Μαθαίνω.
                  <span className="block text-[#f04474]">Παίζω.</span>
                  <span className="block text-[#1aa887]">Δημιουργώ.</span>
                </h1>
                <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:text-lg">
                  Ένας ζωντανός κόσμος μάθησης για παιδιά 2–6 ετών: μικρά παιχνίδια, πραγματικές χειροτεχνίες, A4 πατρόν και ένας ασφαλής προσωπικός οδηγός που βοηθά τον γονέα να διαλέγει το σωστό επόμενο βήμα.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href="#today" className="inline-flex min-h-13 items-center gap-2 rounded-full bg-[#f04474] px-6 py-3.5 text-sm font-black text-white shadow-[0_15px_35px_rgba(240,68,116,.25)] transition hover:-translate-y-0.5">
                    Ξεκινάμε μαζί <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="#pisi-guide" className="inline-flex min-h-13 items-center gap-2 rounded-full border border-violet-100 bg-white px-6 py-3.5 text-sm font-black text-violet-700 shadow-sm transition hover:-translate-y-0.5">
                    <Bot className="h-4 w-4" /> Pisi Guide
                  </a>
                </div>
                <div className="mt-7 grid max-w-2xl grid-cols-3 gap-2">
                  {(["2–3", "4–5", "5–6"] as const).map((value, index) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => chooseAge(value)}
                      aria-pressed={age === value}
                      className={`rounded-[1.3rem] border p-3 text-left transition ${age === value ? "border-[#f04474]/30 bg-white shadow-lg" : "border-white/70 bg-white/65 hover:bg-white"}`}
                    >
                      <div className="text-xl">{index === 0 ? "🐰" : index === 1 ? "🧸" : "🦊"}</div>
                      <div className="mt-1 text-sm font-black text-[#103d78]">{value} ετών</div>
                      <div className="mt-0.5 text-[10px] font-bold text-slate-500">{index === 0 ? "Ανακάλυψη" : index === 1 ? "Εξερεύνηση" : "Προετοιμασία"}</div>
                    </button>
                  ))}
                </div>
              </div>
              <HeroIllustration />
            </div>

            <div className="relative z-20 mt-7 grid gap-3 rounded-[2rem] border border-white/80 bg-white/85 p-3 shadow-[0_18px_55px_rgba(62,43,20,.09)] backdrop-blur sm:grid-cols-2 lg:grid-cols-5">
              {WORLD_CARDS.map((card) => (
                <a key={card.title} href={card.href} className={`group relative min-h-40 overflow-hidden rounded-[1.55rem] bg-gradient-to-br ${card.bg} p-4 transition hover:-translate-y-1`}>
                  <div className="flex items-start justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/85 shadow-sm" style={{ color: card.accent }}><card.icon className="h-5 w-5" /></span>
                    <span className="text-4xl drop-shadow-sm">{card.art}</span>
                  </div>
                  <h2 className="mt-4 text-lg font-black text-[#103d78]">{card.title}</h2>
                  <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{card.subtitle}</p>
                  <span className="absolute bottom-4 right-4 grid h-8 w-8 place-items-center rounded-full bg-white text-[#103d78] shadow-sm transition group-hover:translate-x-1"><ArrowRight className="h-4 w-4" /></span>
                </a>
              ))}
              <a href="#parent-zone" className="group relative min-h-40 overflow-hidden rounded-[1.55rem] bg-gradient-to-br from-[#e8f8ef] via-[#f0fcf4] to-white p-4 transition hover:-translate-y-1">
                <div className="flex items-start justify-between"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-emerald-700 shadow-sm"><Users className="h-5 w-5" /></span><span className="text-4xl">👨‍👩‍👧</span></div>
                <h2 className="mt-4 text-lg font-black text-[#103d78]">Για Γονείς</h2>
                <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">Στόχος, χρόνος, υλικά και ιδέες για συνέχεια εκτός οθόνης.</p>
                <span className="absolute bottom-4 right-4 grid h-8 w-8 place-items-center rounded-full bg-white text-[#103d78] shadow-sm transition group-hover:translate-x-1"><ArrowRight className="h-4 w-4" /></span>
              </a>
            </div>
          </div>
        </section>

        <section id="today" className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[.2em] text-[#f04474]">Η σημερινή μας διαδρομή</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#103d78] sm:text-5xl">15 λεπτά που έχουν νόημα</h2>
                <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-600 sm:text-base">Μία μικρή ακολουθία που τελειώνει πάντα με κάτι πραγματικό: χαρτί, κίνηση, κουβέντα ή κατασκευή.</p>
              </div>
              <div className="rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-700">⭐ {stars}/12 μικρές νίκες στη συσκευή</div>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {today.map((item, index) => (
                <a
                  key={item.title}
                  href={item.href}
                  onClick={() => { addStar(); void trackEvent("preschool_world_step", { age, step: index + 1, title: item.title }); }}
                  className="group relative overflow-hidden rounded-[1.8rem] border border-slate-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,.07)] transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="absolute -right-3 -top-4 text-7xl opacity-[.07]">{item.icon}</div>
                  <div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#fff3f6] text-lg">{item.icon}</span><span className="text-xs font-black text-slate-300">0{index + 1}</span></div>
                  <h3 className="mt-5 text-xl font-black text-[#103d78]">{item.title}</h3>
                  <p className="mt-2 min-h-10 text-sm font-semibold leading-5 text-slate-500">{item.note}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#f04474]">Ξεκίνα <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="pisi-guide" className="relative border-y border-violet-100 bg-[linear-gradient(135deg,#f8f3ff_0%,#fff8fc_46%,#f1fbff_100%)] py-12 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-violet-700 shadow-sm"><Bot className="h-4 w-4" /> Pisi Guide · safe personal companion</div>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-[#103d78] sm:text-5xl">Προσωπικός βοηθός, χωρίς να αφήνουμε το παιδί μόνο με ένα chatbot.</h2>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-600 sm:text-base">Ο γονέας δίνει τέσσερις απλές πληροφορίες και ο Pisi Guide προτείνει μία μικρή δραστηριότητα και μία συνέχεια εκτός οθόνης. Δεν ζητά όνομα παιδιού, δεν αποθηκεύει συνομιλίες και δεν στέλνει προσωπικά δεδομένα σε μοντέλο.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ["🛡️", "Κλειστό πεδίο", "Μόνο vetted δραστηριότητες"],
                  ["🧠", "Παιδαγωγικός κανόνας", "Ηλικία + στόχος + διάθεση"],
                  ["🏡", "Screen → real", "Κάθε πρόταση βγαίνει από την οθόνη"],
                ].map(([icon, title, note]) => (
                  <div key={title} className="rounded-[1.5rem] border border-white bg-white/80 p-4 shadow-sm"><div className="text-2xl">{icon}</div><div className="mt-2 text-sm font-black text-[#103d78]">{title}</div><div className="mt-1 text-xs font-semibold leading-5 text-slate-500">{note}</div></div>
                ))}
              </div>
            </div>
            <PisiGuide initialAge={age} onAge={chooseAge} />
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[.2em] text-emerald-700">Learning Zones</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#103d78] sm:text-5xl">Ένας κόσμος, έξι τρόποι να μεγαλώνω</h2>
              </div>
              <p className="max-w-md text-sm font-medium leading-6 text-slate-600">Δεν κυνηγάμε “σωστές απαντήσεις”. Χτίζουμε περιέργεια, αυτοπεποίθηση, γλώσσα, σκέψη, κίνηση και σχέσεις.</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {LEARNING_ZONES.map((zone) => (
                <div key={zone.title} className="rounded-[1.8rem] border border-slate-100 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,.055)]">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${zone.tone}`}><zone.icon className="h-6 w-6" /></div>
                  <h3 className="mt-4 text-xl font-black text-[#103d78]">{zone.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{zone.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-orange-100 bg-[#fff6e9] py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[.2em] text-orange-700">Weekly Picks · {weekLabel}</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#103d78] sm:text-5xl">Κάθε εβδομάδα κάτι φρέσκο</h2>
              </div>
              <p className="max-w-md text-sm font-medium leading-6 text-slate-600">2 παιχνίδια · 2 εκτυπώσιμα · 2 χειροτεχνίες. Η rotation αλλάζει μόνο όταν υπάρχουν αρκετά στοιχεία ή όταν χρειάζεται ελεγχόμενη εξερεύνηση.</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {weekly.map((item, index) => (
                <a key={item.id} href={item.href} onClick={() => void trackEvent("preschool_world_weekly", { activity_id: item.id, type: item.type })} className="group relative min-h-56 overflow-hidden rounded-[1.8rem] border border-white bg-white p-5 shadow-[0_16px_45px_rgba(87,56,20,.08)] transition hover:-translate-y-1">
                  <div className={`absolute inset-x-0 top-0 h-2 ${index % 3 === 0 ? "bg-rose-300" : index % 3 === 1 ? "bg-sky-300" : "bg-amber-300"}`} />
                  <div className="flex items-start justify-between"><span className="text-5xl">{item.emoji}</span><span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">{item.type}</span></div>
                  <h3 className="mt-5 text-xl font-black text-[#103d78]">{item.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{item.skill}</p>
                  <div className="mt-6 flex items-center justify-between text-xs font-bold text-slate-500"><span>{item.age} ετών</span><span className="inline-flex items-center gap-1 font-black text-[#f04474]">Άνοιξε <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span></div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="parent-zone" className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
              <div className="overflow-hidden rounded-[2.2rem] bg-[linear-gradient(135deg,#174b8f_0%,#0f6f7e_100%)] p-7 text-white shadow-xl sm:p-9">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-[.18em]"><Users className="h-4 w-4" /> Parent Co-Pilot</div>
                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Ο γονέας ξέρει τι κάνει και γιατί.</h2>
                <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-white/80 sm:text-base">Κάθε δραστηριότητα πρέπει να λέει με μία ματιά: ηλικία, στόχο, χρόνο, υλικά, πώς βοηθάμε και πότε σταματάμε. Η εμπειρία δεν βαθμολογεί το παιδί· βοηθά τον ενήλικα να δημιουργήσει μία καλή στιγμή μάθησης.</p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {["🎯 Ένας καθαρός στόχος", "⏱️ 5–15 λεπτά, όχι ατελείωτο screen time", "👐 Πάντα μία hands-on συνέχεια", "💛 Χωρίς πίεση, rankings ή “έχασες”"].map((text) => <div key={text} className="rounded-2xl bg-white/10 p-4 text-sm font-bold">{text}</div>)}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <a href="/virtual-preschool-grace#printables" className="group rounded-[2rem] border border-orange-100 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,.06)] transition hover:-translate-y-1">
                  <div className="flex items-center justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-700"><Printer className="h-6 w-6" /></span><span className="text-5xl">🖨️</span></div>
                  <h3 className="mt-5 text-2xl font-black text-[#103d78]">A4 Studio</h3><p className="mt-2 text-sm font-semibold leading-6 text-slate-500">Πατρόν, coloring, tracing, κόψιμο και οδηγίες στην άκρη της σελίδας.</p><div className="mt-5 text-sm font-black text-orange-700">Δες τα printables →</div>
                </a>
                <Link to="/learning-games" className="group rounded-[2rem] border border-sky-100 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,.06)] transition hover:-translate-y-1">
                  <div className="flex items-center justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-sky-700"><Gamepad2 className="h-6 w-6" /></span><span className="text-5xl">🎮</span></div>
                  <h3 className="mt-5 text-2xl font-black text-[#103d78]">Play Lab</h3><p className="mt-2 text-sm font-semibold leading-6 text-slate-500">Σύντομα παιχνίδια ανά ηλικία, χωρίς πίεση χρόνου και χωρίς αρνητική βαθμολογία.</p><div className="mt-5 text-sm font-black text-sky-700">Δες όλα τα παιχνίδια →</div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-[2.3rem] border border-emerald-100 bg-[linear-gradient(180deg,#effbf3,#fffdf8)] px-6 py-10 text-center shadow-[0_20px_55px_rgba(18,94,65,.08)] sm:px-10 sm:py-14">
              <div className="pointer-events-none absolute -left-10 bottom-0 text-8xl opacity-20">🌼</div><div className="pointer-events-none absolute -right-8 bottom-0 text-8xl opacity-20">🌿</div>
              <img src={pisipoukLogo} alt="Ο Πισιπούκ" className="mx-auto h-20 w-20 object-contain" />
              <div className="mx-auto mt-4 max-w-3xl text-2xl font-black leading-tight text-[#103d78] sm:text-4xl">«Κάθε παιδί είναι ένας μικρός εξερευνητής — και ο κόσμος είναι το πιο όμορφο σχολείο.»</div>
              <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-6 text-slate-500">Το Online Preschool υπάρχει για να δίνει ιδέες που συνεχίζονται στο τραπέζι, στο πάτωμα, στον κήπο και στη συζήτηση με έναν άνθρωπο.</p>
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}

function PisiGuide({ initialAge, onAge }: { initialAge: Age; onAge: (age: Age) => void }) {
  const [age, setAge] = useState<Age>(initialAge);
  const [mood, setMood] = useState<Mood>("δημιουργία");
  const [goal, setGoal] = useState<Goal>("μαθηματικά");
  const [time, setTime] = useState<Time>(10);
  const [result, setResult] = useState<Recommendation | null>(null);

  useEffect(() => setAge(initialAge), [initialAge]);

  const run = () => {
    onAge(age);
    const pick = recommendation(age, mood, goal, time);
    setResult(pick);
    void trackEvent("pisi_guide_recommend", { age, mood, goal, minutes: time, activity: pick.title });
  };

  const chip = (active: boolean) => `rounded-full border px-3 py-2 text-xs font-black transition ${active ? "border-violet-300 bg-violet-600 text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-violet-200"}`;

  return (
    <div className="rounded-[2.2rem] border border-white bg-white/90 p-5 shadow-[0_24px_70px_rgba(72,45,120,.12)] sm:p-7">
      <div className="flex items-center gap-4"><div className="relative grid h-16 w-16 place-items-center rounded-[1.4rem] bg-[linear-gradient(145deg,#e7dcff,#d7f6ff)] text-4xl shadow-inner">🤖<span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-white" /></div><div><div className="text-xs font-black uppercase tracking-[.16em] text-violet-600">Pisi Guide</div><h3 className="text-xl font-black text-[#103d78]">Τι ταιριάζει σήμερα;</h3></div></div>

      <GuideRow label="Ηλικία">
        {(["2–3", "4–5", "5–6"] as const).map((value) => <button key={value} type="button" className={chip(age === value)} onClick={() => setAge(value)}>{value}</button>)}
      </GuideRow>
      <GuideRow label="Διάθεση">
        {(["ενέργεια", "ήρεμα", "δημιουργία"] as const).map((value) => <button key={value} type="button" className={chip(mood === value)} onClick={() => setMood(value)}>{value === "ενέργεια" ? "⚡ ενέργεια" : value === "ήρεμα" ? "🌙 ήρεμα" : "🎨 δημιουργία"}</button>)}
      </GuideRow>
      <GuideRow label="Θέλω να δουλέψουμε">
        {(["γλώσσα", "μαθηματικά", "κινητικότητα", "συναίσθημα"] as const).map((value) => <button key={value} type="button" className={chip(goal === value)} onClick={() => setGoal(value)}>{value}</button>)}
      </GuideRow>
      <GuideRow label="Χρόνος">
        {([5, 10, 15] as const).map((value) => <button key={value} type="button" className={chip(time === value)} onClick={() => setTime(value)}>{value}′</button>)}
      </GuideRow>

      <button type="button" onClick={run} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#7657d8,#9a5ee0)] px-5 py-3 text-sm font-black text-white shadow-[0_12px_28px_rgba(118,87,216,.25)] transition hover:-translate-y-0.5"><Sparkles className="h-4 w-4" /> Πρότεινέ μου</button>

      {result && (
        <div className="mt-5 rounded-[1.6rem] border border-violet-100 bg-[#fbf9ff] p-5">
          <div className="flex items-start gap-4"><div className="text-4xl">{result.icon}</div><div><div className="text-xs font-black uppercase tracking-[.15em] text-violet-600">Η πρόταση του Pisi Guide</div><h4 className="mt-1 text-xl font-black text-[#103d78]">{result.title}</h4><p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{result.why}</p></div></div>
          <div className="mt-4 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600"><span className="font-black text-emerald-700">Μετά την οθόνη:</span> {result.offline}</div>
          <a href={result.href} className="mt-4 inline-flex items-center gap-2 text-sm font-black text-violet-700">Άνοιξε τη δραστηριότητα <ArrowRight className="h-4 w-4" /></a>
        </div>
      )}
      <p className="mt-4 text-center text-[10px] font-bold leading-4 text-slate-400">Δεν ζητάμε όνομα παιδιού · δεν υπάρχει ελεύθερο chat · οι επιλογές μένουν σε vetted δραστηριότητες του Πισιπούκ.</p>
    </div>
  );
}

function GuideRow({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="mt-5"><div className="mb-2 text-xs font-black text-[#103d78]">{label}</div><div className="flex flex-wrap gap-2">{children}</div></div>;
}

function DecorativeCloud({ className = "" }: { className?: string }) {
  return <div className={`pointer-events-none h-24 w-56 ${className}`}><svg viewBox="0 0 240 100" className="h-full w-full" aria-hidden="true"><path d="M38 78C19 78 8 67 8 53c0-14 12-25 28-25 5 0 10 1 14 3C58 14 75 4 95 4c27 0 48 18 51 41 6-4 14-6 22-6 22 0 40 15 40 34 0 2 0 4-1 5H38Z" fill="#fff" /></svg></div>;
}

function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[720px]">
      <div className="absolute -inset-4 rounded-[3rem] bg-white/55 blur-2xl" />
      <svg viewBox="0 0 760 590" className="relative w-full drop-shadow-[0_25px_35px_rgba(87,56,20,.16)]" role="img" aria-label="Παιδιά δημιουργούν μαζί με τον Πισιπούκ σε φωτεινό εργαστήρι">
        <defs>
          <linearGradient id="room" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#fff4d6"/><stop offset=".48" stopColor="#e9f8ef"/><stop offset="1" stopColor="#dff4ff"/></linearGradient>
          <linearGradient id="table" x1="0" x2="1"><stop stopColor="#d89b66"/><stop offset="1" stopColor="#b97849"/></linearGradient>
          <radialGradient id="sun" cx=".5" cy=".5" r=".5"><stop stopColor="#fff7bd"/><stop offset="1" stopColor="#ffd95c"/></radialGradient>
        </defs>
        <rect x="18" y="18" width="724" height="554" rx="58" fill="url(#room)"/>
        <circle cx="650" cy="92" r="48" fill="url(#sun)" opacity=".95"/>
        <path d="M104 116c48-45 97-56 146-32" fill="none" stroke="#f9b6c5" strokeWidth="10" strokeLinecap="round"/>
        <path d="M138 96l19 23 20-25 21 24 20-26" fill="none" stroke="#70c9c0" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="60" y="88" width="116" height="134" rx="18" fill="#fff" opacity=".72"/>
        <rect x="81" y="112" width="74" height="10" rx="5" fill="#ffd45c"/><rect x="81" y="139" width="54" height="10" rx="5" fill="#7ac9dd"/><rect x="81" y="166" width="67" height="10" rx="5" fill="#f08aaa"/>
        <path d="M566 156c21-43 60-62 102-46v116H552c-6-24-1-48 14-70Z" fill="#a9ddba"/>
        <rect x="542" y="220" width="152" height="18" rx="9" fill="#8a5d41" opacity=".75"/>
        <circle cx="599" cy="180" r="25" fill="#e1f0c8"/><path d="M598 161c-16-28 5-42 18-23 14-22 35-5 19 18-10 13-21 20-37 24Z" fill="#54ad73"/>
        <ellipse cx="386" cy="465" rx="285" ry="64" fill="#d9aa78" opacity=".35"/>
        <rect x="89" y="404" width="592" height="98" rx="35" fill="url(#table)"/>

        <g transform="translate(240 190)">
          <circle cx="94" cy="96" r="64" fill="#b97b4d"/><circle cx="48" cy="46" r="31" fill="#a96c43"/><circle cx="140" cy="46" r="31" fill="#a96c43"/>
          <circle cx="94" cy="95" r="50" fill="#d89c68"/><circle cx="76" cy="88" r="6" fill="#1f2937"/><circle cx="113" cy="88" r="6" fill="#1f2937"/>
          <ellipse cx="94" cy="109" rx="21" ry="16" fill="#f6d1b1"/><circle cx="94" cy="103" r="7" fill="#3f2a25"/><path d="M82 117c8 12 18 12 26 0" fill="none" stroke="#5b3630" strokeWidth="4" strokeLinecap="round"/>
          <path d="M48 135c27 20 67 21 94 1" fill="none" stroke="#3aa4a4" strokeWidth="15" strokeLinecap="round"/>
          <path d="M86 61l8-17 9 17" fill="#f6c84c"/>
          <path d="M61 157c-13 45-19 83-19 112h104c0-31-7-69-20-111" fill="#b97b4d"/>
          <circle cx="95" cy="197" r="22" fill="#f6d1b1"/><path d="M84 194l10 10 17-20" fill="none" stroke="#f04474" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
        </g>

        <g transform="translate(74 236)">
          <circle cx="118" cy="54" r="49" fill="#f2c39e"/><path d="M75 50c5-52 71-66 91-20 10 22-2 40-2 40-18-18-37-24-89-20Z" fill="#6a402f"/>
          <circle cx="101" cy="56" r="5" fill="#26364a"/><circle cx="135" cy="56" r="5" fill="#26364a"/><path d="M108 75c9 7 19 7 28 0" fill="none" stroke="#a85c55" strokeWidth="4" strokeLinecap="round"/>
          <path d="M73 111c29-24 67-23 94 0l-3 87H76Z" fill="#4ca6d8"/><rect x="88" y="126" width="59" height="50" rx="12" fill="#f7c95b"/>
          <path d="M65 148c-23 20-28 41-15 61" fill="none" stroke="#f2c39e" strokeWidth="19" strokeLinecap="round"/><path d="M173 147c25 19 30 38 18 59" fill="none" stroke="#f2c39e" strokeWidth="19" strokeLinecap="round"/>
        </g>

        <g transform="translate(496 236)">
          <circle cx="86" cy="55" r="49" fill="#f3c7a8"/><path d="M45 57c-3-45 42-70 76-46 19 13 23 39 15 55-15-15-40-25-91-9Z" fill="#7b4c36"/><circle cx="68" cy="57" r="5" fill="#26364a"/><circle cx="103" cy="57" r="5" fill="#26364a"/><path d="M76 76c9 8 19 8 29 0" fill="none" stroke="#a85c55" strokeWidth="4" strokeLinecap="round"/>
          <path d="M42 112c28-22 63-23 89 0l7 84H36Z" fill="#f08aaa"/><circle cx="86" cy="145" r="20" fill="#fff0b8"/><path d="M77 145h18M86 136v18" stroke="#e7a93c" strokeWidth="5" strokeLinecap="round"/>
          <path d="M35 146c-22 17-26 37-15 58" fill="none" stroke="#f3c7a8" strokeWidth="18" strokeLinecap="round"/><path d="M137 146c22 19 26 39 15 58" fill="none" stroke="#f3c7a8" strokeWidth="18" strokeLinecap="round"/>
        </g>

        <g transform="translate(165 412)"><rect x="0" y="0" width="101" height="61" rx="12" fill="#fff" transform="rotate(-5 50 30)"/><path d="M24 39c13-23 27-25 42-1 9-13 17-14 28-2" fill="none" stroke="#5bc8a4" strokeWidth="6" strokeLinecap="round"/><circle cx="27" cy="23" r="8" fill="#ffd458"/></g>
        <g transform="translate(527 421)"><rect x="0" y="0" width="38" height="46" rx="7" fill="#ef526f"/><rect x="44" y="8" width="39" height="38" rx="7" fill="#5cc6d7"/><path d="M20 0v-18M64 8v-21" stroke="#394d64" strokeWidth="5" strokeLinecap="round"/></g>
        <g transform="translate(365 422)"><rect x="0" y="0" width="46" height="46" rx="8" fill="#ffd257"/><path d="M23 4v38M4 23h38" stroke="#fff" strokeWidth="5" opacity=".65"/></g>
        <g fill="#f04474"><circle cx="712" cy="296" r="7"/><circle cx="47" cy="338" r="6"/><circle cx="707" cy="366" r="5"/></g>
        <g fill="#f7bd3b"><path d="M208 103l7 15 17 2-13 11 4 17-15-8-15 8 4-17-13-11 17-2Z"/><path d="M662 257l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1Z"/></g>
      </svg>
    </div>
  );
}
