import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Clock3,
  Gamepad2,
  Heart,
  Palette,
  Printer,
  Scissors,
  Sparkles,
  Star,
  WandSparkles,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { trackEvent } from "@/lib/pisipoukApi";
import pisipoukLogo from "@/assets/pisipouk-logo.webp";

export const Route = createFileRoute("/virtual-preschool-grace")({
  head: () => ({
    meta: [
      { title: "Online Preschool Grace Preview | Ο Πισιπούκ" },
      {
        name: "description",
        content:
          "Preview της νέας εμπειρίας Online Preschool του Πισιπούκ: παιχνίδι, ζωγραφική, A4 printables, πατρόν και δημιουργικές δραστηριότητες για παιδιά 2–6 ετών.",
      },
    ],
  }),
  component: GracePreschool,
});

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
  version: number;
  week: string;
  updatedAt: string;
  source: string;
  items: string[];
};

type Printable = {
  id: string;
  title: string;
  emoji: string;
  age: string;
  minutes: string;
  skill: string;
  materials: string[];
  steps: string[];
  supervision: string;
};

const FALLBACK_WEEKLY: CatalogItem[] = [
  { id: "game-memory", type: "game", title: "Παιχνίδι Μνήμης", emoji: "🧠", age: "3–6", skill: "Μνήμη · προσοχή", href: "/learning-games/memory?age=4-5", season: "all" },
  { id: "game-colors-shapes", type: "game", title: "Χρώματα & Σχήματα", emoji: "🎨", age: "2–5", skill: "Οπτική διάκριση", href: "/learning-games/colors-shapes?age=2-3", season: "all" },
  { id: "print-dot-pattern", type: "printable", title: "Συνέχισε το Μοτίβο", emoji: "🔴", age: "3–6", skill: "Μοτίβα · πρόβλεψη", href: "#printable-dot-pattern", season: "all" },
  { id: "print-trace-paths", type: "printable", title: "Μονοπάτια για Μολύβι", emoji: "✏️", age: "2–5", skill: "Προγραφή · έλεγχος χεριού", href: "#printable-trace-paths", season: "all" },
  { id: "craft-owl", type: "craft", title: "Χτίσε τη Μικρή Κουκουβάγια", emoji: "🦉", age: "3–6", skill: "Κόψε · χρωμάτισε · κόλλησε", href: "#printable-owl", season: "all" },
  { id: "craft-rocket", type: "craft", title: "Ο Πύραυλος του Πισιπούκ", emoji: "🚀", age: "4–6", skill: "Σχήματα · κατασκευή", href: "#printable-rocket", season: "all" },
];

const PRINTABLES: Printable[] = [
  {
    id: "shape-robot",
    title: "Ρομπότ από Σχήματα",
    emoji: "🤖",
    age: "3–6",
    minutes: "10–15′",
    skill: "Σχήματα · χωρική σύνθεση · λεπτή κινητικότητα",
    materials: ["κηρομπογιές ή μαρκαδόροι", "παιδικό ψαλίδι", "κόλλα", "χαρτόνι προαιρετικά"],
    steps: ["Χρωματίζουμε τα κομμάτια.", "Κόβουμε πάνω στις συνεχόμενες γραμμές.", "Συνθέτουμε το ρομπότ πριν κολλήσουμε.", "Κολλάμε τα κομμάτια σε νέο χαρτί."],
    supervision: "Το κόψιμο γίνεται με ενήλικα δίπλα στο παιδί.",
  },
  {
    id: "owl",
    title: "Χτίσε τη Μικρή Κουκουβάγια",
    emoji: "🦉",
    age: "3–6",
    minutes: "12–18′",
    skill: "Συμμετρία · κατασκευή · οπτική διάκριση",
    materials: ["χρώματα", "ψαλίδι", "κόλλα"],
    steps: ["Χρωματίζουμε σώμα, φτερά και μάτια.", "Κόβουμε τα μεγάλα κομμάτια.", "Δοκιμάζουμε δύο διαφορετικές θέσεις για τα φτερά.", "Κολλάμε και δίνουμε όνομα στην κουκουβάγια."],
    supervision: "Ο ενήλικας βοηθά στα μικρά κυκλικά κομμάτια.",
  },
  {
    id: "rocket",
    title: "Ο Πύραυλος του Πισιπούκ",
    emoji: "🚀",
    age: "4–6",
    minutes: "15–20′",
    skill: "Σχήματα · ακολουθία · δημιουργική αφήγηση",
    materials: ["χρώματα", "ψαλίδι", "κόλλα", "αλουμινόχαρτο προαιρετικά"],
    steps: ["Χρωματίζουμε το σώμα του πυραύλου.", "Κόβουμε πτερύγια, παράθυρο και φλόγα.", "Συναρμολογούμε από πάνω προς τα κάτω.", "Λέμε πού ταξιδεύει ο πύραυλος."],
    supervision: "Κρατάμε τα πολύ μικρά κομμάτια μακριά από παιδιά που βάζουν αντικείμενα στο στόμα.",
  },
  {
    id: "emotion-wheel",
    title: "Ο Τροχός των Συναισθημάτων",
    emoji: "🙂",
    age: "3–6",
    minutes: "10′",
    skill: "Αναγνώριση συναισθήματος · γλώσσα · αυτορρύθμιση",
    materials: ["χρώματα", "ψαλίδι", "διπλόκαρφο χειροτεχνίας ή συνδετήρας με ενήλικα"],
    steps: ["Χρωματίζουμε τα τέσσερα πρόσωπα.", "Κόβουμε τον κύκλο.", "Ο ενήλικας στερεώνει τον δείκτη.", "Κάθε παιδί δείχνει πώς νιώθει και λέει γιατί."],
    supervision: "Το διπλόκαρφο το χειρίζεται μόνο ενήλικας.",
  },
  {
    id: "weather-wheel",
    title: "Τι Καιρό Κάνει;",
    emoji: "🌦️",
    age: "3–6",
    minutes: "8–12′",
    skill: "Παρατήρηση · καθημερινή ρουτίνα · λεξιλόγιο",
    materials: ["χρώματα", "ψαλίδι", "μανταλάκι ή δείκτης"],
    steps: ["Παρατηρούμε έξω από το παράθυρο.", "Χρωματίζουμε τα σύμβολα καιρού.", "Κόβουμε τον κύκλο.", "Βάζουμε τον δείκτη στον σημερινό καιρό."],
    supervision: "Το κόψιμο γίνεται με επίβλεψη.",
  },
  {
    id: "trace-paths",
    title: "Μονοπάτια για Μολύβι",
    emoji: "✏️",
    age: "2–5",
    minutes: "5–8′",
    skill: "Προγραφή · οπτικοκινητικός συντονισμός",
    materials: ["χοντρή ξυλομπογιά ή κηρομπογιά"],
    steps: ["Ξεκινάμε από το μεγάλο αστέρι.", "Ακολουθούμε αργά κάθε μονοπάτι.", "Δεν πειράζει αν βγούμε έξω από τη γραμμή.", "Στο τέλος διαλέγουμε το αγαπημένο μονοπάτι."],
    supervision: "Για 2–3 ετών προτιμάμε χοντρή κηρομπογιά και μικρή διάρκεια.",
  },
  {
    id: "dot-pattern",
    title: "Συνέχισε το Μοτίβο",
    emoji: "🔴",
    age: "3–6",
    minutes: "6–10′",
    skill: "Μοτίβα · πρόβλεψη · πρώιμη μαθηματική σκέψη",
    materials: ["χρώματα ή αυτοκόλλητα dots"],
    steps: ["Λέμε δυνατά τι βλέπουμε: κόκκινο–μπλε–κόκκινο–μπλε.", "Προβλέπουμε τι έρχεται μετά.", "Χρωματίζουμε τα κενά κυκλάκια.", "Δημιουργούμε δικό μας μοτίβο στην τελευταία σειρά."],
    supervision: "Αν χρησιμοποιούνται μικρά αυτοκόλλητα, χρειάζεται επίβλεψη.",
  },
  {
    id: "story-cards",
    title: "Βάλε την Ιστορία σε Σειρά",
    emoji: "📚",
    age: "4–6",
    minutes: "10–15′",
    skill: "Ακολουθία · αφήγηση · αιτία και αποτέλεσμα",
    materials: ["χρώματα", "ψαλίδι"],
    steps: ["Χρωματίζουμε τις τρεις κάρτες.", "Κόβουμε τα πλαίσια.", "Ανακατεύουμε και βάζουμε αρχή–μέση–τέλος.", "Το παιδί αφηγείται την ιστορία με δικά του λόγια."],
    supervision: "Το κόψιμο γίνεται με βοήθεια ενήλικα.",
  },
  {
    id: "hedgehog",
    title: "Φθινοπωρινός Σκαντζόχοιρος",
    emoji: "🦔",
    age: "3–6",
    minutes: "15′",
    skill: "Κολλάζ · υφή · λεπτή κινητικότητα",
    materials: ["χρώματα", "κόλλα", "μικρά χάρτινα φύλλα ή αληθινά ξερά φύλλα"],
    steps: ["Χρωματίζουμε το πρόσωπο.", "Βάζουμε κόλλα μόνο στην περιοχή με τις ακίδες.", "Κολλάμε φύλλα ή χάρτινα κομμάτια.", "Μετράμε πόσα διαφορετικά χρώματα χρησιμοποιήσαμε."],
    supervision: "Ελέγχουμε τα φυσικά υλικά πριν δοθούν στο παιδί.",
  },
  {
    id: "butterfly",
    title: "Πεταλούδα Συμμετρίας",
    emoji: "🦋",
    age: "3–6",
    minutes: "10–15′",
    skill: "Συμμετρία · χρώμα · παρατήρηση",
    materials: ["χρώματα", "ψαλίδι προαιρετικά"],
    steps: ["Χρωματίζουμε πρώτα τη μία πλευρά.", "Προσπαθούμε να επαναλάβουμε τα ίδια μοτίβα στην άλλη.", "Κυκλώνουμε όσα σημεία είναι ίδια.", "Κόβουμε μόνο αν θέλουμε να τη χρησιμοποιήσουμε σαν διακοσμητικό."],
    supervision: "Για μικρότερα παιδιά μπορεί να μείνει ως φύλλο ζωγραφικής χωρίς κόψιμο.",
  },
];

const GAME_LINKS = [
  { emoji: "🧠", title: "Μνήμη", href: "/learning-games/memory?age=4-5", note: "οπτική μνήμη" },
  { emoji: "🔷", title: "Μοτίβα", href: "/learning-games/pattern?age=4-5", note: "λογική & πρόβλεψη" },
  { emoji: "🔢", title: "Μέτρημα", href: "/learning-games/count?age=4-5", note: "ποσότητες" },
  { emoji: "🧺", title: "Κατηγορίες", href: "/learning-games/sort?age=2-3", note: "γλώσσα & ταξινόμηση" },
  { emoji: "🌀", title: "Λαβύρινθος", href: "/learning-games/maze?age=4-5", note: "χώρος & σχεδιασμός" },
  { emoji: "🎨", title: "Χρώματα & Σχήματα", href: "/learning-games/colors-shapes?age=2-3", note: "οπτική διάκριση" },
];

function GracePreschool() {
  const [weekly, setWeekly] = useState<CatalogItem[]>(FALLBACK_WEEKLY);
  const [weekLabel, setWeekLabel] = useState("Αυτή την εβδομάδα");
  const [age, setAge] = useState<"2–3" | "4–5" | "5–6">("4–5");

  useEffect(() => {
    void trackEvent("preschool_grace_open", { version: "grace-v1" });

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
      } catch {
        // The curated fallback remains visible if the weekly feed is unavailable.
      }
    };

    void loadWeekly();
  }, []);

  const dailyPath = useMemo(() => {
    if (age === "2–3") {
      return [
        { n: "01", title: "Χρώματα & Σχήματα", note: "4 λεπτά", href: "/learning-games/colors-shapes?age=2-3" },
        { n: "02", title: "Μονοπάτια για Μολύβι", note: "5 λεπτά", href: "#printable-trace-paths" },
        { n: "03", title: "Ελεύθερη ζωγραφική", note: "5 λεπτά", href: "/virtual-preschool" },
      ];
    }
    if (age === "5–6") {
      return [
        { n: "01", title: "Βρες το Μοτίβο", note: "5 λεπτά", href: "/learning-games/pattern?age=5-6" },
        { n: "02", title: "Βάλε την Ιστορία σε Σειρά", note: "6 λεπτά", href: "#printable-story-cards" },
        { n: "03", title: "Πύραυλος του Πισιπούκ", note: "8 λεπτά", href: "#printable-rocket" },
      ];
    }
    return [
      { n: "01", title: "Παιχνίδι Μνήμης", note: "5 λεπτά", href: "/learning-games/memory?age=4-5" },
      { n: "02", title: "Συνέχισε το Μοτίβο", note: "5 λεπτά", href: "#printable-dot-pattern" },
      { n: "03", title: "Μικρή Κουκουβάγια", note: "8 λεπτά", href: "#printable-owl" },
    ];
  }, [age]);

  const openWeekly = (item: CatalogItem) => {
    void trackEvent("preschool_weekly_pick", { activity_id: item.id, type: item.type });
  };

  return (
    <SiteLayout>
      <main className="overflow-hidden bg-[#fffdf8] text-slate-800">
        <section className="relative border-b border-sky-100 bg-[radial-gradient(circle_at_10%_20%,#fff4d8_0,transparent_28%),radial-gradient(circle_at_85%_15%,#dcfce7_0,transparent_30%),linear-gradient(180deg,#eef8ff_0%,#fffdf8_86%)] py-8 sm:py-14">
          <div className="pointer-events-none absolute -left-12 top-16 h-40 w-40 rounded-full bg-rose-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-10 h-48 w-48 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white bg-white/85 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#0b3b82] shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4 text-amber-500" /> Online Preschool · Grace Preview
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[.98] tracking-[-0.04em] text-[#0b3b82] sm:text-6xl lg:text-7xl">
                Το Εργαστήρι του Πισιπούκ
              </h1>
              <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-slate-600 sm:text-lg">
                Παίζουμε στην οθόνη, δημιουργούμε με τα χέρια και παίρνουμε την ιδέα μαζί μας στο χαρτί. Μικρές δραστηριότητες 2–6 ετών, χωρίς πίεση και χωρίς θόρυβο.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#today" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0b3b82] px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/10 transition hover:-translate-y-0.5">
                  Ξεκίνα το σημερινό 15λεπτο <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#printables" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-[#0b3b82] shadow-sm transition hover:-translate-y-0.5">
                  <Printer className="h-4 w-4" /> A4 Printables
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                {["χωρίς λογαριασμό", "touch friendly", "A4 ink-friendly", "γονέας + παιδί"].map((label) => (
                  <span key={label} className="rounded-full border border-white bg-white/75 px-3 py-1.5 shadow-sm">✓ {label}</span>
                ))}
              </div>
            </div>

            <HeroStudio />
          </div>
        </section>

        <section id="today" className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Μικρή καθημερινή ρουτίνα</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#0b3b82] sm:text-5xl">Το σημερινό 15λεπτο</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">Ένα παιχνίδι, μία δημιουργική άσκηση και μία δραστηριότητα που βγαίνει από την οθόνη.</p>
              </div>
              <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
                {(["2–3", "4–5", "5–6"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAge(value)}
                    aria-pressed={age === value}
                    className={`min-h-11 rounded-xl px-4 text-sm font-black transition ${age === value ? "bg-[#0b3b82] text-white" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {dailyPath.map((item, index) => (
                <a
                  key={item.n}
                  href={item.href}
                  onClick={() => void trackEvent("preschool_activity_start", { activity_id: `daily-${age}-${index + 1}`, age })}
                  className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,.06)] transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-5xl font-black text-slate-100">{item.n}</span>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">{item.note}</span>
                  </div>
                  <h3 className="mt-6 text-2xl font-black text-[#0b3b82]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Βήμα {index + 1} από 3 · σταματάμε όταν το παιδί έχει χορτάσει το παιχνίδι.</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-black text-emerald-700">Ξεκίνα <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-emerald-100 bg-[#f4fbf6] py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Weekly shelf · {weekLabel}</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#0b3b82] sm:text-5xl">6 επιλογές που αξίζουν αυτή την εβδομάδα</h2>
              </div>
              <span className="max-w-sm text-sm leading-6 text-slate-600">Το shelf μπορεί να ανανεώνεται από engagement, αλλά μόνο με ασφαλή rotation και χωρίς να πειράζει τις υπόλοιπες σελίδες.</span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {weekly.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => openWeekly(item)}
                  className="group flex min-h-52 flex-col rounded-[1.75rem] border border-white bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,.07)] transition hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-5xl" aria-hidden="true">{item.emoji}</span>
                    <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">{item.type}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-black text-[#0b3b82]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.skill}</p>
                  <div className="mt-auto flex items-center justify-between pt-5 text-xs font-bold text-slate-500">
                    <span>{item.age} ετών</span>
                    <span className="font-black text-emerald-700">Άνοιξε →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
              <div className="lg:sticky lg:top-24">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">Interactive Play Lab</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#0b3b82] sm:text-5xl">Παίζω λίγο. Σκέφτομαι πολύ.</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">Σύντομες προκλήσεις με άμεσο feedback. Χωρίς χρονόμετρο, χωρίς βαθμολογία που αγχώνει και χωρίς “έχασες”.</p>
                <Link to="/learning-games" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-600/15">
                  <Gamepad2 className="h-4 w-4" /> Όλα τα μαθησιακά παιχνίδια
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <PatternChallenge />
                <EmotionChallenge />
                {GAME_LINKS.map((game) => (
                  <a
                    key={game.title}
                    href={game.href}
                    onClick={() => void trackEvent("preschool_challenge_start", { game: game.title })}
                    className="group rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="text-4xl">{game.emoji}</div>
                    <h3 className="mt-4 text-xl font-black text-[#0b3b82]">{game.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{game.note}</p>
                    <div className="mt-4 text-sm font-black text-violet-700">Παίξε →</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="printables" className="border-y border-orange-100 bg-[#fff8ee] py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-700">Printable Studio</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#0b3b82] sm:text-5xl">A4 φύλλα που είναι και πατρόν</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">Οι οδηγίες μπαίνουν σε στενή στήλη στο πλάι και το μεγαλύτερο μέρος της Α4 μένει για το σχέδιο. Συνεχόμενη γραμμή = κόψιμο, διακεκομμένη = δίπλωμα/ίχνος.</p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {PRINTABLES.map((item) => (
                <article id={`printable-${item.id}`} key={item.id} className="scroll-mt-24 overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_16px_45px_rgba(124,45,18,.06)]">
                  <div className="aspect-[4/3] bg-[linear-gradient(145deg,#fff7ed,#ffffff)] p-4">
                    <PatternPreview id={item.id} />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-3xl">{item.emoji}</div>
                        <h3 className="mt-2 text-xl font-black text-[#0b3b82]">{item.title}</h3>
                      </div>
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black text-orange-700">A4</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{item.skill}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                      <span className="rounded-full bg-slate-50 px-3 py-1.5">{item.age} ετών</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1.5"><Clock3 className="h-3.5 w-3.5" /> {item.minutes}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => printActivity(item)}
                      className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0b3b82] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#082e66]"
                    >
                      <Printer className="h-4 w-4" /> Εκτύπωσε Α4 πατρόν
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-5 lg:grid-cols-4">
              {[
                { icon: Palette, title: "Παίζω", text: "Μικρά interactive tasks με καθαρό στόχο και γρήγορο feedback.", className: "bg-sky-50 text-sky-700" },
                { icon: WandSparkles, title: "Ζωγραφίζω", text: "Ελεύθερη έκφραση και line-art σχέδια χωρίς να κυνηγάμε το “τέλειο”.", className: "bg-rose-50 text-rose-700" },
                { icon: Scissors, title: "Φτιάχνω", text: "Πατρόν με μεγάλα κομμάτια, σαφή cut lines και επίβλεψη ενήλικα.", className: "bg-amber-50 text-amber-700" },
                { icon: Heart, title: "Μοιράζομαι", text: "Ο γονιός βλέπει τι καλλιεργεί η δραστηριότητα και πώς να συμμετέχει.", className: "bg-emerald-50 text-emerald-700" },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.className}`}><item.icon className="h-5 w-5" /></div>
                  <h3 className="mt-4 text-lg font-black text-[#0b3b82]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-[2rem] bg-[#0b3b82] p-6 text-white shadow-xl sm:p-8">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-200">Για τον γονιό</p>
                  <h2 className="mt-2 text-2xl font-black sm:text-3xl">Ο στόχος δεν είναι περισσότερη οθόνη. Είναι καλύτερο παιχνίδι.</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-sky-50/90">Χρησιμοποιήστε το Online Preschool σαν αφετηρία: παίξτε λίγα λεπτά μαζί, τυπώστε κάτι που αξίζει και συνεχίστε στο τραπέζι, στο πάτωμα ή έξω.</p>
                </div>
                <Link to="/parent-zone" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#0b3b82]">Parent Zone <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}

function HeroStudio() {
  return (
    <div className="relative mx-auto w-full max-w-[580px] rounded-[2.4rem] border border-white bg-white/80 p-4 shadow-[0_30px_80px_rgba(15,23,42,.12)] backdrop-blur sm:p-6">
      <svg viewBox="0 0 700 520" role="img" aria-label="Χαρούμενο δημιουργικό εργαστήρι του Πισιπούκ" className="h-auto w-full">
        <defs>
          <linearGradient id="wall" x1="0" x2="1"><stop stopColor="#eff8ff"/><stop offset="1" stopColor="#fff7ed"/></linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="12" stdDeviation="10" floodOpacity=".12"/></filter>
        </defs>
        <rect x="8" y="8" width="684" height="504" rx="42" fill="url(#wall)"/>
        <circle cx="585" cy="92" r="46" fill="#fde68a" opacity=".9"/>
        <path d="M35 389 C170 318 300 410 420 355 C530 305 604 330 678 286 L678 512 L35 512 Z" fill="#dcfce7"/>
        <g filter="url(#soft)">
          <rect x="95" y="255" width="510" height="170" rx="28" fill="#ffffff"/>
          <rect x="126" y="286" width="145" height="104" rx="18" fill="#dbeafe"/>
          <circle cx="170" cy="337" r="30" fill="#fda4af"/>
          <rect x="211" y="310" width="35" height="57" rx="10" fill="#86efac"/>
          <path d="M329 377 L385 289 L441 377 Z" fill="#fde68a"/>
          <rect x="466" y="301" width="94" height="76" rx="18" fill="#c4b5fd"/>
        </g>
        <path d="M92 216 C130 184 172 189 211 216" fill="none" stroke="#38bdf8" strokeWidth="16" strokeLinecap="round"/>
        <path d="M492 206 C530 171 582 173 620 206" fill="none" stroke="#fb7185" strokeWidth="16" strokeLinecap="round"/>
        <g transform="translate(286 78)" filter="url(#soft)">
          <circle cx="64" cy="64" r="60" fill="#fff"/>
          <image href={pisipoukLogo} x="9" y="9" width="110" height="110" preserveAspectRatio="xMidYMid meet" />
        </g>
        <g fontFamily="Arial, sans-serif" fontWeight="800" fill="#0b3b82" textAnchor="middle">
          <text x="350" y="224" fontSize="28">ΠΑΙΖΩ · ΦΤΙΑΧΝΩ · ΤΥΠΩΝΩ</text>
        </g>
        <g>
          <circle cx="76" cy="102" r="18" fill="#fb7185"/><path d="M76 120 C78 148 57 157 67 180" fill="none" stroke="#fb7185" strokeWidth="3"/>
          <circle cx="642" cy="144" r="18" fill="#60a5fa"/><path d="M642 162 C638 188 659 198 649 221" fill="none" stroke="#60a5fa" strokeWidth="3"/>
        </g>
      </svg>
      <div className="absolute -bottom-4 left-6 rounded-full bg-amber-300 px-4 py-2 text-xs font-black text-amber-950 shadow-lg">✨ original vector playground</div>
    </div>
  );
}

function PatternChallenge() {
  const [answer, setAnswer] = useState<string | null>(null);
  const correct = "🔵";
  const choose = (value: string) => {
    setAnswer(value);
    void trackEvent(value === correct ? "preschool_challenge_complete" : "preschool_challenge_start", { challenge: "pattern-tap", correct: value === correct });
  };
  return (
    <div className="rounded-[1.7rem] border border-violet-100 bg-[linear-gradient(145deg,#f5f3ff,#ffffff)] p-5 shadow-sm sm:col-span-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="rounded-full bg-violet-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-violet-700">Mini challenge</span>
          <h3 className="mt-3 text-xl font-black text-[#0b3b82]">Τι έρχεται μετά;</h3>
          <p className="mt-1 text-sm text-slate-500">Κοίτα το μοτίβο και πάτησε την επόμενη κουκκίδα.</p>
        </div>
        <Star className="h-7 w-7 text-amber-400" fill="currentColor" />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2 text-4xl" aria-label="κίτρινο μπλε κίτρινο μπλε">
        <span>🟡</span><span>🔵</span><span>🟡</span><span>🔵</span><span className="rounded-2xl border-2 border-dashed border-violet-200 px-3 py-1 text-2xl">?</span>
      </div>
      <div className="mt-5 flex gap-2">
        {["🟢", "🔵", "🔴"].map((value) => (
          <button key={value} type="button" onClick={() => choose(value)} className="min-h-14 min-w-14 rounded-2xl border border-slate-200 bg-white text-3xl shadow-sm transition hover:-translate-y-0.5">{value}</button>
        ))}
      </div>
      {answer && <p className={`mt-4 text-sm font-black ${answer === correct ? "text-emerald-700" : "text-violet-700"}`}>{answer === correct ? "Μπράβο — βρήκες τον ρυθμό! ⭐" : "Καλή δοκιμή. Κοίτα ξανά τι επαναλαμβάνεται."}</p>}
    </div>
  );
}

function EmotionChallenge() {
  const [answer, setAnswer] = useState<string | null>(null);
  const correct = "🙂";
  const choose = (value: string) => {
    setAnswer(value);
    if (value === correct) void trackEvent("preschool_challenge_complete", { challenge: "emotion-match" });
  };
  return (
    <div className="rounded-[1.7rem] border border-rose-100 bg-[linear-gradient(145deg,#fff1f2,#ffffff)] p-5 shadow-sm sm:col-span-2">
      <span className="rounded-full bg-rose-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-rose-700">Συναίσθημα</span>
      <h3 className="mt-3 text-xl font-black text-[#0b3b82]">Η Μαρία τελείωσε έναν δύσκολο πύργο.</h3>
      <p className="mt-1 text-sm text-slate-500">Πώς μπορεί να νιώθει;</p>
      <div className="mt-5 flex gap-2">
        {["😟", "🙂", "😡"].map((value) => (
          <button key={value} type="button" onClick={() => choose(value)} className="min-h-16 min-w-16 rounded-2xl border border-slate-200 bg-white text-4xl shadow-sm transition hover:-translate-y-0.5">{value}</button>
        ))}
      </div>
      {answer && <p className={`mt-4 text-sm font-black ${answer === correct ? "text-emerald-700" : "text-rose-700"}`}>{answer === correct ? "Ναι — μπορεί να νιώθει χαρά και περηφάνια. 💛" : "Μπορεί να υπάρχουν πολλές απαντήσεις· ας σκεφτούμε τι συνέβη πρώτα."}</p>}
    </div>
  );
}

function PatternPreview({ id }: { id: string }) {
  return (
    <div className="h-full w-full rounded-2xl border border-dashed border-orange-200 bg-white p-2">
      <div dangerouslySetInnerHTML={{ __html: patternSvg(id, true) }} className="h-full w-full [&_svg]:h-full [&_svg]:w-full" />
    </div>
  );
}

function printActivity(item: Printable) {
  void trackEvent("preschool_print", { activity_id: item.id, format: "A4" });
  const popup = window.open("", "_blank");
  if (!popup) return;
  const materials = item.materials.map((x) => `<li>${escapeHtml(x)}</li>`).join("");
  const steps = item.steps.map((x, index) => `<li><b>${index + 1}.</b> ${escapeHtml(x)}</li>`).join("");
  popup.document.write(`<!doctype html><html lang="el"><head><meta charset="utf-8"><title>${escapeHtml(item.title)}</title><style>
    @page{size:A4 portrait;margin:7mm}*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;color:#172033;background:#fff}.page{width:196mm;min-height:283mm;display:grid;grid-template-columns:54mm 1fr;gap:7mm}.guide{border:1.2px solid #d7dee8;border-radius:5mm;padding:6mm;background:#fbfcfe}.brand{font-weight:900;color:#0b3b82;font-size:10pt;letter-spacing:.02em}.guide h1{font-size:17pt;line-height:1.05;margin:5mm 0 2mm;color:#0b3b82}.meta{font-size:9pt;line-height:1.5;color:#475569}.guide h2{font-size:10pt;margin:5mm 0 2mm;color:#0b3b82}.guide ul{padding-left:4mm;margin:0;font-size:8.5pt;line-height:1.45}.guide li{margin-bottom:1.8mm}.safety{margin-top:5mm;padding:3mm;border-radius:3mm;background:#fff7ed;color:#9a3412;font-size:8pt;line-height:1.4}.legend{margin-top:4mm;font-size:7.5pt;line-height:1.5;color:#64748b}.pattern{border:1.2px solid #d7dee8;border-radius:5mm;padding:5mm;display:flex;align-items:center;justify-content:center;overflow:hidden}.pattern svg{width:100%;height:auto;max-height:268mm}.footer{position:fixed;bottom:3mm;right:8mm;font-size:7pt;color:#94a3b8}@media print{.no-print{display:none}}
  </style></head><body><div class="page"><aside class="guide"><div class="brand">Ο Πισιπούκ · Printable Studio</div><h1>${escapeHtml(item.emoji)} ${escapeHtml(item.title)}</h1><div class="meta"><b>${escapeHtml(item.age)} ετών</b> · ${escapeHtml(item.minutes)}<br>${escapeHtml(item.skill)}</div><h2>Υλικά</h2><ul>${materials}</ul><h2>Οδηγίες</h2><ul>${steps}</ul><div class="safety"><b>Με ενήλικα δίπλα:</b><br>${escapeHtml(item.supervision)}</div><div class="legend"><b>Υπόμνημα</b><br>━ συνεχόμενη = κόψιμο<br>┄ διακεκομμένη = δίπλωμα / ίχνος</div></aside><main class="pattern">${patternSvg(item.id, false)}</main></div><div class="footer">pisipouk.vercel.app · original printable</div><script>window.onload=()=>{setTimeout(()=>window.print(),150)}</script></body></html>`);
  popup.document.close();
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] ?? char);
}

function patternSvg(id: string, preview: boolean) {
  const stroke = "#1f2937";
  const soft = preview ? "#dbeafe" : "#ffffff";
  const accent = preview ? "#fde68a" : "#ffffff";
  const line = preview ? 5 : 4;
  const dash = preview ? "10 10" : "12 10";
  const head = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 980" role="img"><rect width="720" height="980" rx="28" fill="#fff"/><g fill="${soft}" stroke="${stroke}" stroke-width="${line}" stroke-linejoin="round">`;
  const tail = `</g></svg>`;

  if (id === "shape-robot") return head + `<circle cx="360" cy="165" r="95"/><rect x="230" y="305" width="260" height="250" rx="18"/><rect x="110" y="345" width="95" height="180" rx="18"/><rect x="515" y="345" width="95" height="180" rx="18"/><rect x="245" y="590" width="95" height="210" rx="18"/><rect x="380" y="590" width="95" height="210" rx="18"/><circle cx="325" cy="145" r="14" fill="#fff"/><circle cx="395" cy="145" r="14" fill="#fff"/><path d="M320 205 Q360 235 400 205" fill="none"/><path d="M340 68 L360 25 L380 68" fill="${accent}"/>` + tail;
  if (id === "owl") return head + `<ellipse cx="360" cy="500" rx="190" ry="265"/><path d="M245 315 L185 210 L315 270 Z"/><path d="M475 315 L535 210 L405 270 Z"/><circle cx="295" cy="420" r="72"/><circle cx="425" cy="420" r="72"/><circle cx="295" cy="420" r="22" fill="#fff"/><circle cx="425" cy="420" r="22" fill="#fff"/><path d="M330 485 L390 485 L360 535 Z" fill="${accent}"/><path d="M225 535 Q150 620 235 730" fill="none"/><path d="M495 535 Q570 620 485 730" fill="none"/>` + tail;
  if (id === "rocket") return head + `<path d="M360 100 C470 205 485 465 430 645 L290 645 C235 465 250 205 360 100 Z"/><circle cx="360" cy="355" r="72"/><path d="M290 520 L165 720 L300 675 Z"/><path d="M430 520 L555 720 L420 675 Z"/><path d="M315 650 L360 860 L405 650 Z" fill="${accent}"/><path d="M360 100 L360 645" fill="none" stroke-dasharray="${dash}"/>` + tail;
  if (id === "emotion-wheel") return head + `<circle cx="360" cy="470" r="270"/><path d="M360 200 V740 M90 470 H630" fill="none"/><circle cx="255" cy="365" r="18" fill="#fff"/><circle cx="315" cy="365" r="18" fill="#fff"/><path d="M245 425 Q285 465 325 425" fill="none"/><circle cx="405" cy="365" r="18" fill="#fff"/><circle cx="465" cy="365" r="18" fill="#fff"/><path d="M395 455 Q435 415 475 455" fill="none"/><circle cx="255" cy="575" r="18" fill="#fff"/><circle cx="315" cy="575" r="18" fill="#fff"/><path d="M245 635 H325" fill="none"/><circle cx="405" cy="575" r="18" fill="#fff"/><circle cx="465" cy="575" r="18" fill="#fff"/><path d="M400 625 Q435 665 470 625" fill="none"/><path d="M360 115 L330 175 H390 Z" fill="${accent}"/>` + tail;
  if (id === "weather-wheel") return head + `<circle cx="360" cy="475" r="280"/><path d="M360 195 V755 M80 475 H640" fill="none"/><circle cx="240" cy="350" r="70" fill="${accent}"/><g fill="none"><path d="M445 330 C500 270 590 330 560 395 C620 410 595 485 535 475 H430 C365 472 365 390 430 385 C415 365 420 345 445 330 Z"/><path d="M185 555 C240 495 330 555 300 620 C360 635 335 710 275 700 H170 C105 697 105 615 170 610 C155 590 160 570 185 555 Z"/></g><path d="M455 590 L430 660 M510 590 L485 660 M565 590 L540 660" fill="none"/><path d="M360 475 L535 300" fill="none" stroke-dasharray="${dash}"/>` + tail;
  if (id === "trace-paths") return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 980"><rect width="720" height="980" fill="#fff"/><g fill="none" stroke="${stroke}" stroke-width="${line}" stroke-linecap="round"><path d="M95 190 C240 80 465 315 620 175" stroke-dasharray="${dash}"/><path d="M95 460 C210 650 330 260 620 475" stroke-dasharray="${dash}"/><path d="M95 760 C235 600 420 895 620 745" stroke-dasharray="${dash}"/></g><g font-family="Arial" font-size="52"><text x="48" y="205">⭐</text><text x="615" y="195">🏠</text><text x="48" y="475">🐝</text><text x="615" y="490">🌼</text><text x="48" y="775">🚗</text><text x="615" y="760">🏁</text></g></svg>`;
  if (id === "dot-pattern") return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 980"><rect width="720" height="980" fill="#fff"/><g stroke="${stroke}" stroke-width="${line}">${dotRow(180,["#fff","#fff","#fff","#fff","#fff","#fff"])}${dotRow(390,["#fff","#fff","#fff","#fff","#fff","#fff"])}${dotRow(600,["#fff","#fff","#fff","#fff","#fff","#fff"])}${dotRow(810,["#fff","#fff","#fff","#fff","#fff","#fff"])}</g><g font-family="Arial" font-size="25" fill="#64748b"><text x="85" y="95">Χρωμάτισε: κόκκινο · μπλε · κόκκινο · μπλε · ? · ?</text><text x="85" y="305">Κίτρινο · κίτρινο · πράσινο · κίτρινο · κίτρινο · ?</text><text x="85" y="515">Μωβ · πορτοκαλί · πράσινο · μωβ · πορτοκαλί · ?</text><text x="85" y="725">Φτιάξε το δικό σου μοτίβο</text></g></svg>`;
  if (id === "story-cards") return head + `<rect x="75" y="110" width="570" height="215" rx="18"/><rect x="75" y="382" width="570" height="215" rx="18"/><rect x="75" y="654" width="570" height="215" rx="18"/><g fill="none"><circle cx="210" cy="215" r="55"/><path d="M265 215 H455"/><path d="M190 488 C265 405 365 565 500 470"/><path d="M190 755 L265 690 L345 790 L445 710 L530 805"/></g><path d="M75 350 H645 M75 622 H645" fill="none" stroke-dasharray="${dash}"/>` + tail;
  if (id === "hedgehog") return head + `<path d="M170 620 C120 440 210 255 420 275 C545 285 620 390 585 535 C550 680 365 740 220 675 Z"/><path d="M180 610 C215 495 310 455 430 480 C390 560 340 625 250 680 Z" fill="#fff"/><circle cx="280" cy="535" r="14" fill="#fff"/><circle cx="205" cy="575" r="18" fill="#fff"/><path d="M330 310 L370 225 L400 320 M405 315 L465 230 L475 340 M485 340 L555 275 L545 390 M255 325 L220 235 L300 315" fill="none"/>` + tail;
  if (id === "butterfly") return head + `<ellipse cx="360" cy="480" rx="48" ry="245"/><path d="M320 330 C215 175 90 255 130 430 C155 525 245 540 320 480 Z"/><path d="M400 330 C505 175 630 255 590 430 C565 525 475 540 400 480 Z"/><path d="M320 530 C205 520 120 620 175 770 C230 820 300 725 330 620 Z"/><path d="M400 530 C515 520 600 620 545 770 C490 820 420 725 390 620 Z"/><path d="M345 245 C310 170 285 170 255 195 M375 245 C410 170 435 170 465 195" fill="none"/><path d="M360 235 V730" fill="none" stroke-dasharray="${dash}"/>` + tail;
  return head + `<circle cx="360" cy="460" r="260"/><path d="M220 460 H500 M360 320 V600" fill="none"/>` + tail;
}

function dotRow(y: number, fills: string[]) {
  return fills.map((fill, index) => `<circle cx="${110 + index * 100}" cy="${y}" r="32" fill="${fill}"/>`).join("");
}
