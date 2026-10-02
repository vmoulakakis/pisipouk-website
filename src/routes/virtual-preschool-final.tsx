import { createFileRoute } from "@tanstack/react-router";
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
  Music2,
  Palette,
  Printer,
  Scissors,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { trackEvent } from "@/lib/pisipoukApi";
import pisipoukLogo from "@/assets/pisipouk-logo.webp";

export const Route = createFileRoute("/virtual-preschool-final")({
  head: () => ({
    meta: [
      { title: "Online Preschool | Ο Πισιπούκ" },
      {
        name: "description",
        content:
          "Το νέο Online Preschool του Πισιπούκ: premium παιδικός σχεδιασμός, παιχνίδια, εκτυπώσιμα, χειροτεχνίες και ασφαλής Pisi Guide για παιδιά 2–6 ετών.",
      },
    ],
  }),
  component: FinalPreschool,
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

type WeeklyConfig = { week: string; items: string[] };

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

const ZONES = [
  { title: "Γλώσσα & Ιστορίες", note: "λέξεις · αφήγηση · προγραφή", icon: BookOpen, tone: "#ff698e", soft: "#fff0f5" },
  { title: "Μαθηματικά & Λογική", note: "αριθμοί · σχήματα · μοτίβα", icon: Brain, tone: "#2b9fed", soft: "#edf8ff" },
  { title: "Τέχνη & Δημιουργία", note: "χρώμα · φαντασία · χειροτεχνία", icon: Palette, tone: "#f7a725", soft: "#fff8e7" },
  { title: "Φύση & STEM", note: "παρατήρηση · πείραμα · απορία", icon: Leaf, tone: "#34ad72", soft: "#edfff4" },
  { title: "Κίνηση & Ρυθμός", note: "σώμα · μουσική · συντονισμός", icon: Music2, tone: "#9b69df", soft: "#f7efff" },
  { title: "Συναισθήματα & Μαζί", note: "έκφραση · επικοινωνία · συνεργασία", icon: Heart, tone: "#ef5b77", soft: "#fff0f1" },
];

function getRecommendation(age: Age, mood: Mood, goal: Goal, time: Time): Recommendation {
  if (goal === "συναίσθημα") {
    return { title: "Τροχός Συναισθημάτων", why: `Ταιριάζει στα ${time}′ και δίνει στο παιδί έναν απλό τρόπο να δείξει πώς νιώθει.`, href: "/virtual-preschool-grace#printable-emotion-wheel", icon: "💛", offline: "Δείξτε ένα συναίσθημα χωρίς λόγια και μαντέψτε το μαζί." };
  }
  if (goal === "κινητικότητα") {
    return age === "2–3"
      ? { title: "Μονοπάτια για Μολύβι", why: "Μεγάλες κινήσεις, ήρεμος ρυθμός και καθόλου πίεση για ακρίβεια.", href: "/virtual-preschool-grace#printable-trace-paths", icon: "✏️", offline: "Κάντε πρώτα τη διαδρομή με το δάχτυλο στον αέρα." }
      : { title: "Χτίσε τη Μικρή Κουκουβάγια", why: "Χρώμα, κόψιμο και σύνθεση σε μικρά, καθαρά βήματα.", href: "/virtual-preschool-grace#printable-owl", icon: "🦉", offline: "Φτιάξτε της μία μικρή φωλιά από χαρτί ή φύλλα." };
  }
  if (goal === "γλώσσα") {
    return age === "5–6"
      ? { title: "Βάλε την Ιστορία σε Σειρά", why: "Αφήγηση, ακολουθία και αιτία–αποτέλεσμα χωρίς χρονόμετρο.", href: "/virtual-preschool-grace#printable-story-cards", icon: "📚", offline: "Πείτε ξανά την ιστορία με διαφορετικό τέλος." }
      : { title: "Σωστή Κατηγορία", why: "Μικρές γλωσσικές επιλογές που γίνονται παιχνίδι.", href: "/learning-games/sort?age=4-5", icon: "🧺", offline: "Χωρίστε 6 αντικείμενα σε δύο ομάδες και δώστε τους όνομα." };
  }
  if (age === "2–3") return { title: "Χρώματα & Σχήματα", why: "Μεγάλες επιλογές και άμεσο feedback για μικρούς εξερευνητές.", href: "/learning-games/colors-shapes?age=2-3", icon: "🔵", offline: "Βρείτε τρία αντικείμενα με το ίδιο χρώμα." };
  if (mood === "ήρεμα") return { title: "Συνέχισε το Μοτίβο", why: "Ήρεμη λογική και πρόβλεψη, χωρίς πίεση χρόνου.", href: "/virtual-preschool-grace#printable-dot-pattern", icon: "🔴", offline: "Φτιάξτε μοτίβο με κουτάλια και πιρούνια." };
  return { title: "Βρες το Μοτίβο", why: "Σύντομοι γύροι λογικής που κρατούν ενεργή την περιέργεια.", href: `/learning-games/pattern?age=${age === "5–6" ? "5-6" : "4-5"}`, icon: "🔷", offline: "Φτιάξτε δικό σας μοτίβο με τρία χρώματα." };
}

function FinalPreschool() {
  const [age, setAge] = useState<Age>("4–5");
  const [weekly, setWeekly] = useState<CatalogItem[]>(FALLBACK_WEEKLY);
  const [weekLabel, setWeekLabel] = useState("Αυτή την εβδομάδα");
  const [stars, setStars] = useState(0);

  useEffect(() => {
    void trackEvent("preschool_final_open", { version: "final-art-v1" });
    try {
      const storedAge = window.localStorage.getItem("pisipouk-preschool-age") as Age | null;
      const storedStars = Number(window.localStorage.getItem("pisipouk-preschool-stars") || "0");
      if (storedAge === "2–3" || storedAge === "4–5" || storedAge === "5–6") setAge(storedAge);
      if (Number.isFinite(storedStars)) setStars(Math.min(12, storedStars));
    } catch {
      // local preferences are optional
    }

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
        if (selected.length === 6) setWeekly(selected);
        if (config.week) setWeekLabel(`Εβδομάδα ${config.week.replace("-W", " · ")}`);
      } catch {
        // curated fallback remains available
      }
    };
    void loadWeekly();
  }, []);

  const chooseAge = (value: Age) => {
    setAge(value);
    try { window.localStorage.setItem("pisipouk-preschool-age", value); } catch { /* optional */ }
    void trackEvent("preschool_final_age", { age: value });
  };

  const addStar = () => {
    const next = Math.min(12, stars + 1);
    setStars(next);
    try { window.localStorage.setItem("pisipouk-preschool-stars", String(next)); } catch { /* optional */ }
  };

  const today = useMemo(() => {
    if (age === "2–3") return [
      { title: "Παίζω", note: "Χρώματα & Σχήματα · 4′", icon: "🎮", href: "/learning-games/colors-shapes?age=2-3" },
      { title: "Ζωγραφίζω", note: "Μεγάλα μονοπάτια · 4′", icon: "🖍️", href: "/virtual-preschool-grace#printable-trace-paths" },
      { title: "Κινούμαι", note: "Βρες 3 χρώματα στο σπίτι · 3′", icon: "🌈", href: "#pisi-guide" },
    ];
    if (age === "5–6") return [
      { title: "Παίζω", note: "Βρες το μοτίβο · 5′", icon: "🎮", href: "/learning-games/pattern?age=5-6" },
      { title: "Αφηγούμαι", note: "Ιστορία σε σειρά · 5′", icon: "📚", href: "/virtual-preschool-grace#printable-story-cards" },
      { title: "Κατασκευάζω", note: "Πύραυλος του Πισιπούκ · 5′", icon: "🚀", href: "/virtual-preschool-grace#printable-rocket" },
    ];
    return [
      { title: "Παίζω", note: "Παιχνίδι Μνήμης · 5′", icon: "🎮", href: "/learning-games/memory?age=4-5" },
      { title: "Σκέφτομαι", note: "Συνέχισε το μοτίβο · 5′", icon: "🧠", href: "/virtual-preschool-grace#printable-dot-pattern" },
      { title: "Δημιουργώ", note: "Μικρή Κουκουβάγια · 5′", icon: "🦉", href: "/virtual-preschool-grace#printable-owl" },
    ];
  }, [age]);

  return (
    <SiteLayout>
      <main className="overflow-hidden bg-[#fffaf2] text-slate-800">
        <section className="relative isolate overflow-hidden border-b border-orange-100 bg-[linear-gradient(180deg,#fff7ea_0%,#fffaf4_60%,#f4fbff_100%)]">
          <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-sky-200/35 blur-3xl" />
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-7 sm:px-6 sm:py-10 lg:grid-cols-[.82fr_1.18fr] lg:items-center lg:py-14">
            <div className="relative z-20 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-white bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[.17em] text-[#144777] shadow-sm backdrop-blur"><Sparkles className="h-4 w-4 text-amber-500" /> Online Preschool · νέο εικαστικό σύστημα</div>
              <img src={pisipoukLogo} alt="Ο Πισιπούκ" className="mt-5 h-11 w-auto object-contain" />
              <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[.92] tracking-[-.055em] text-[#11467b] sm:text-6xl xl:text-7xl">
                Μαθαίνω. <span className="text-[#ef4770]">Παίζω.</span><br />
                Δημιουργώ. <span className="text-[#20a87d]">Μεγαλώνω.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-slate-600 sm:text-lg">Ένας φωτεινός online κόσμος για παιδιά 2–6 ετών, με μικρές δραστηριότητες που συνεχίζονται στο χαρτί, στα χέρια και στην πραγματική ζωή.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#today" className="inline-flex min-h-13 items-center gap-2 rounded-full bg-[#f04474] px-6 py-3.5 text-sm font-black text-white shadow-[0_12px_30px_rgba(240,68,116,.27)] transition hover:-translate-y-0.5">Ξεκινάμε μαζί <ArrowRight className="h-4 w-4" /></a>
                <a href="#pisi-guide" className="inline-flex min-h-13 items-center gap-2 rounded-full border border-sky-100 bg-white px-6 py-3.5 text-sm font-black text-[#144777] shadow-sm transition hover:-translate-y-0.5"><Bot className="h-4 w-4 text-violet-600" /> Pisi Guide</a>
              </div>
              <div className="mt-7 flex flex-wrap gap-2 text-xs font-black text-slate-600">
                {["χωρίς διαφημίσεις", "touch friendly", "A4 εκτύπωση", "γονέας + παιδί"].map((label) => <span key={label} className="rounded-full border border-white bg-white/80 px-3 py-2 shadow-sm">✓ {label}</span>)}
              </div>
            </div>
            <div className="relative order-1 min-h-[430px] lg:order-2 lg:min-h-[560px]">
              <HeroIllustration />
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 pb-7 sm:px-6 sm:pb-10">
            <div className="grid gap-3 rounded-[2rem] border border-white bg-white/88 p-3 shadow-[0_18px_50px_rgba(71,42,17,.09)] backdrop-blur md:grid-cols-[auto_1fr] md:items-center">
              <div className="px-3 text-sm font-black text-[#144777]">Επίλεξε ηλικία</div>
              <div className="grid grid-cols-3 gap-2">
                {(["2–3", "4–5", "5–6"] as Age[]).map((value, index) => (
                  <button key={value} type="button" onClick={() => chooseAge(value)} aria-pressed={age === value} className={`group min-h-20 rounded-[1.35rem] border px-3 py-3 text-left transition ${age === value ? "border-[#f3a4b8] bg-[#fff0f5] shadow-md" : "border-slate-100 bg-white hover:-translate-y-0.5"}`}>
                    <div className="flex items-center gap-3"><AgeFace index={index} active={age === value} /><div><div className="text-lg font-black text-[#144777]">{value} ετών</div><div className="mt-0.5 text-xs font-bold text-slate-500">{index === 0 ? "Ανακαλύπτω" : index === 1 ? "Παίζω & μαθαίνω" : "Ετοιμάζομαι"}</div></div></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {ZONES.map((zone, index) => (
                <a key={zone.title} href={index === 0 ? "/virtual-preschool-grace#printables" : index === 1 ? "/learning-games" : index === 2 ? "/virtual-preschool-grace#printables" : index === 3 ? "/seasonal-packs" : "#pisi-guide"} className="group overflow-hidden rounded-[1.65rem] border border-white bg-white shadow-[0_12px_35px_rgba(15,23,42,.06)] transition hover:-translate-y-1 hover:shadow-lg">
                  <ZoneArt index={index} tone={zone.tone} soft={zone.soft} />
                  <div className="p-4"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-xl" style={{ backgroundColor: zone.soft, color: zone.tone }}><zone.icon className="h-4 w-4" /></span><h2 className="text-sm font-black leading-tight text-[#144777]">{zone.title}</h2></div><p className="mt-2 text-[11px] font-semibold leading-5 text-slate-500">{zone.note}</p></div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="today" className="border-y border-sky-100 bg-[#eef9ff] py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-black uppercase tracking-[.2em] text-sky-700">Η σημερινή μου διαδρομή</p><h2 className="mt-2 text-3xl font-black tracking-tight text-[#144777] sm:text-5xl">15 λεπτά με αρχή, μέση και… ζωή εκτός οθόνης</h2><p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">Τρία μικρά βήματα για την ηλικία {age}, χωρίς βαθμολογία και χωρίς “έχασες”.</p></div><div className="rounded-full bg-white px-4 py-2 text-sm font-black text-amber-700 shadow-sm">⭐ {stars}/12 μικρές νίκες στη συσκευή</div></div>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {today.map((item, index) => (
                <a key={item.title} href={item.href} onClick={() => { addStar(); void trackEvent("preschool_final_step", { age, step: index + 1, title: item.title }); }} className="group relative overflow-hidden rounded-[2rem] border border-white bg-white p-6 shadow-[0_18px_45px_rgba(20,70,123,.08)] transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="absolute -right-6 -top-8 text-[7rem] opacity-[.055]">{item.icon}</div><div className="flex items-center justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff2f5] text-2xl">{item.icon}</span><span className="text-xs font-black text-slate-300">0{index + 1}</span></div><h3 className="mt-5 text-2xl font-black text-[#144777]">{item.title}</h3><p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{item.note}</p><div className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#f04474]">Ξεκίνα <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="pisi-guide" className="relative overflow-hidden bg-[linear-gradient(135deg,#f7f0ff_0%,#fff6fb_46%,#effbff_100%)] py-12 sm:py-16">
          <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-violet-200/30 blur-3xl" /><div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div><div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-violet-700 shadow-sm"><Bot className="h-4 w-4" /> Pisi Guide · ασφαλής προσωπική καθοδήγηση</div><div className="mt-6 grid items-center gap-6 sm:grid-cols-[180px_1fr]"><PisiMascot /><div><h2 className="text-3xl font-black tracking-tight text-[#144777] sm:text-5xl">Προσωπικός βοηθός χωρίς ελεύθερο παιδικό chatbot.</h2><p className="mt-4 text-sm font-semibold leading-7 text-slate-600 sm:text-base">Ο γονέας επιλέγει ηλικία, διάθεση, στόχο και χρόνο. Ο Pisi προτείνει μόνο vetted δραστηριότητες του Πισιπούκ και πάντα μία ιδέα εκτός οθόνης.</p></div></div><div className="mt-6 grid gap-3 sm:grid-cols-3">{[["🛡️","Κλειστό πεδίο","Μόνο ελεγμένες δραστηριότητες"],["🧠","Παιδαγωγικός κανόνας","Ηλικία + στόχος + διάθεση"],["🏡","Screen → real","Πάντα συνέχεια εκτός οθόνης"]].map(([icon,title,note]) => <div key={title} className="rounded-[1.4rem] border border-white bg-white/80 p-4 shadow-sm"><div className="text-2xl">{icon}</div><div className="mt-2 text-sm font-black text-[#144777]">{title}</div><div className="mt-1 text-xs font-semibold leading-5 text-slate-500">{note}</div></div>)}</div></div><PisiGuide initialAge={age} onAge={chooseAge} /></div>
        </section>

        <section className="border-y border-orange-100 bg-[#fff6e9] py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[.2em] text-orange-700">Weekly Picks · {weekLabel}</p><h2 className="mt-2 text-3xl font-black tracking-tight text-[#144777] sm:text-5xl">Κάθε εβδομάδα κάτι φρέσκο</h2></div><p className="max-w-md text-sm font-semibold leading-6 text-slate-600">2 παιχνίδια · 2 εκτυπώσιμα · 2 χειροτεχνίες, με safe rotation.</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{weekly.map((item,index) => <a key={item.id} href={item.href} onClick={() => void trackEvent("preschool_final_weekly", { activity_id: item.id, type: item.type })} className="group relative min-h-56 overflow-hidden rounded-[1.9rem] border border-white bg-white p-5 shadow-[0_16px_45px_rgba(87,56,20,.08)] transition hover:-translate-y-1"><div className={`absolute inset-x-0 top-0 h-2 ${index % 3 === 0 ? "bg-rose-300" : index % 3 === 1 ? "bg-sky-300" : "bg-amber-300"}`} /><div className="flex items-start justify-between"><WeeklyArt emoji={item.emoji} index={index} /><span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">{item.type}</span></div><h3 className="mt-5 text-xl font-black text-[#144777]">{item.title}</h3><p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{item.skill}</p><div className="mt-6 flex items-center justify-between text-xs font-bold text-slate-500"><span>{item.age} ετών</span><span className="inline-flex items-center gap-1 font-black text-[#f04474]">Άνοιξε <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span></div></a>)}</div></div>
        </section>

        <section className="py-12 sm:py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6"><div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]"><div className="overflow-hidden rounded-[2.2rem] bg-[linear-gradient(135deg,#174b8f_0%,#0f7e83_100%)] p-7 text-white shadow-xl sm:p-9"><div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-[.18em]"><Users className="h-4 w-4" /> Για γονείς</div><h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Ξέρεις πάντα τι κάνεις και γιατί.</h2><p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-white/80 sm:text-base">Κάθε δραστηριότητα έχει ηλικία, στόχο, χρόνο και συνέχεια εκτός οθόνης. Δεν βαθμολογούμε το παιδί· δημιουργούμε μια καλή στιγμή μάθησης.</p><div className="mt-7 grid gap-3 sm:grid-cols-2">{["🎯 Καθαρός εκπαιδευτικός στόχος","⏱️ 5–15 λεπτά","👐 Hands-on συνέχεια","💛 Χωρίς πίεση ή rankings"].map((text) => <div key={text} className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-black">{text}</div>)}</div></div><div className="grid gap-4"><a href="/virtual-preschool-grace#printables" className="group flex min-h-40 items-center justify-between rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1"><div><div className="text-3xl">🖨️</div><h3 className="mt-3 text-2xl font-black text-[#144777]">A4 Printable Studio</h3><p className="mt-2 text-sm font-semibold text-slate-500">Πατρόν, ζωγραφιές και φύλλα με οδηγίες.</p></div><Printer className="h-8 w-8 text-orange-500" /></a><a href="/learning-games" className="group flex min-h-40 items-center justify-between rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm transition hover:-translate-y-1"><div><div className="text-3xl">🎮</div><h3 className="mt-3 text-2xl font-black text-[#144777]">Interactive Games</h3><p className="mt-2 text-sm font-semibold text-slate-500">Μικρά παιχνίδια χωρίς άγχος και “έχασες”.</p></div><Gamepad2 className="h-8 w-8 text-sky-500" /></a></div></div></div></section>
      </main>
    </SiteLayout>
  );
}

function PisiGuide({ initialAge, onAge }: { initialAge: Age; onAge: (age: Age) => void }) {
  const [age, setAge] = useState<Age>(initialAge);
  const [mood, setMood] = useState<Mood>("δημιουργία");
  const [goal, setGoal] = useState<Goal>("γλώσσα");
  const [time, setTime] = useState<Time>(10);
  useEffect(() => setAge(initialAge), [initialAge]);
  const pick = useMemo(() => getRecommendation(age, mood, goal, time), [age, mood, goal, time]);
  const setBothAge = (value: Age) => { setAge(value); onAge(value); };

  return <div className="rounded-[2.2rem] border border-white bg-white/92 p-5 shadow-[0_24px_70px_rgba(79,49,123,.13)] backdrop-blur sm:p-7"><div className="flex items-center justify-between gap-3"><div><div className="text-xs font-black uppercase tracking-[.18em] text-violet-600">Pisi recommends</div><div className="mt-1 text-xl font-black text-[#144777]">Τι ταιριάζει σήμερα;</div></div><div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-2xl">🤖</div></div><Choice label="Ηλικία" values={["2–3","4–5","5–6"]} active={age} onPick={(v) => setBothAge(v as Age)} /><Choice label="Διάθεση" values={["ενέργεια","ήρεμα","δημιουργία"]} active={mood} onPick={(v) => setMood(v as Mood)} /><Choice label="Στόχος" values={["γλώσσα","μαθηματικά","κινητικότητα","συναίσθημα"]} active={goal} onPick={(v) => setGoal(v as Goal)} /><Choice label="Χρόνος" values={["5′","10′","15′"]} active={`${time}′`} onPick={(v) => setTime(Number(v.replace("′", "")) as Time)} /><div className="mt-6 rounded-[1.6rem] bg-[linear-gradient(135deg,#144777,#1f7e91)] p-5 text-white"><div className="flex items-start gap-3"><div className="text-4xl">{pick.icon}</div><div><div className="text-xs font-black uppercase tracking-[.15em] text-white/65">Η πρόταση του Pisi</div><h3 className="mt-1 text-2xl font-black">{pick.title}</h3><p className="mt-2 text-sm font-semibold leading-6 text-white/80">{pick.why}</p></div></div><div className="mt-4 rounded-2xl bg-white/10 p-3 text-sm font-bold">🏡 Μετά την οθόνη: {pick.offline}</div><a href={pick.href} onClick={() => void trackEvent("preschool_final_pisi_pick", { age, mood, goal, time, title: pick.title })} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-black text-[#144777]">Ξεκίνα την πρόταση <ArrowRight className="h-4 w-4" /></a></div><p className="mt-4 text-[11px] font-semibold leading-5 text-slate-400">Δεν ζητάμε όνομα ή στοιχεία παιδιού. Οι επιλογές αυτής της έκδοσης γίνονται τοπικά στη συσκευή.</p></div>;
}

function Choice({ label, values, active, onPick }: { label: string; values: string[]; active: string; onPick: (value: string) => void }) {
  return <div className="mt-4"><div className="mb-2 text-[11px] font-black uppercase tracking-[.14em] text-slate-400">{label}</div><div className="flex flex-wrap gap-2">{values.map((value) => <button type="button" key={value} onClick={() => onPick(value)} aria-pressed={active === value} className={`rounded-full border px-3 py-2 text-xs font-black transition ${active === value ? "border-violet-300 bg-violet-100 text-violet-800" : "border-slate-100 bg-slate-50 text-slate-600 hover:bg-white"}`}>{value}</button>)}</div></div>;
}

function AgeFace({ index, active }: { index: number; active: boolean }) {
  const skin = ["#f8b48b", "#f3a27f", "#d99268"][index];
  const hair = ["#a9602d", "#5a341e", "#3f2b1c"][index];
  const shirt = ["#48c99b", "#f0668d", "#f3a63b"][index];
  return <svg viewBox="0 0 64 64" className={`h-12 w-12 shrink-0 transition ${active ? "scale-110" : ""}`} aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#fff" /><circle cx="32" cy="29" r="16" fill={skin} /><path d="M16 29c1-16 9-22 18-22 10 0 17 8 17 21-5-4-9-9-11-14-5 7-13 10-24 15Z" fill={hair} /><circle cx="26" cy="29" r="1.6" fill="#23344d" /><circle cx="38" cy="29" r="1.6" fill="#23344d" /><path d="M27 36c3 3 7 3 10 0" fill="none" stroke="#9a4c4c" strokeWidth="2" strokeLinecap="round" /><path d="M17 58c1-12 8-18 15-18s14 6 15 18" fill={shirt} /></svg>;
}

function HeroIllustration() {
  return <div className="absolute inset-0"><svg viewBox="0 0 760 560" className="h-full w-full drop-shadow-[0_25px_45px_rgba(64,41,19,.15)]" role="img" aria-label="Παιδιά δημιουργούν μαζί με τον αρκούδο του Πισιπούκ σε ένα φωτεινό εργαστήρι"><defs><linearGradient id="wall" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff9e9" /><stop offset="1" stopColor="#eaf8ff" /></linearGradient><linearGradient id="table" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f9d8a7" /><stop offset="1" stopColor="#e8b97a" /></linearGradient><filter id="soft"><feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".14" /></filter></defs><rect x="18" y="18" width="724" height="520" rx="46" fill="url(#wall)" /><circle cx="660" cy="90" r="68" fill="#dff4ff" /><circle cx="660" cy="90" r="49" fill="#8ed8ff" opacity=".9" /><path d="M618 112c28-37 58-34 84-7" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" /><path d="M40 400c72-44 136-34 202-7 61 25 118 20 176-9 75-38 161-44 286 12v118H40Z" fill="#daf2d7" opacity=".8" /><g filter="url(#soft)"><rect x="88" y="368" width="584" height="112" rx="34" fill="url(#table)" /><rect x="118" y="390" width="520" height="22" rx="11" fill="#fff3d6" opacity=".85" /></g><g transform="translate(270 126)"><circle cx="112" cy="112" r="93" fill="#9b6137" /><circle cx="55" cy="42" r="30" fill="#9b6137" /><circle cx="169" cy="42" r="30" fill="#9b6137" /><circle cx="55" cy="43" r="15" fill="#d19a6c" /><circle cx="169" cy="43" r="15" fill="#d19a6c" /><ellipse cx="112" cy="124" rx="53" ry="43" fill="#c98d5f" /><circle cx="84" cy="103" r="8" fill="#1d2938" /><circle cx="140" cy="103" r="8" fill="#1d2938" /><ellipse cx="112" cy="123" rx="13" ry="10" fill="#2e211d" /><path d="M92 141c13 15 27 15 40 0" fill="none" stroke="#542d2d" strokeWidth="5" strokeLinecap="round" /><path d="M58 184c23 18 89 18 108 0" fill="none" stroke="#2aa3a0" strokeWidth="22" strokeLinecap="round" /><path d="M83 189l29 35 29-35" fill="#ffcb57" opacity=".95" /></g><g transform="translate(82 180)"><circle cx="91" cy="87" r="62" fill="#f3ad82" /><path d="M30 90c0-68 104-90 127-20-16-7-31-24-40-41-15 20-43 37-87 40Z" fill="#6d3d22" /><circle cx="70" cy="88" r="5" fill="#263448" /><circle cx="111" cy="88" r="5" fill="#263448" /><path d="M78 111c9 8 18 8 27 0" fill="none" stroke="#a34d4d" strokeWidth="4" strokeLinecap="round" /><path d="M45 163c12-28 79-28 92 0v93H45Z" fill="#f3658a" /><circle cx="91" cy="43" r="9" fill="#ff81a0" /><path d="M40 233l-18 62M137 233l23 62" stroke="#f3ad82" strokeWidth="18" strokeLinecap="round" /></g><g transform="translate(500 198)"><circle cx="78" cy="72" r="56" fill="#e7a17b" /><path d="M27 69C29 20 102 3 131 42c-17 4-32 1-44-8-10 13-29 25-60 35Z" fill="#4d3022" /><circle cx="61" cy="72" r="5" fill="#263448" /><circle cx="95" cy="72" r="5" fill="#263448" /><path d="M66 94c8 7 17 7 25 0" fill="none" stroke="#a34d4d" strokeWidth="4" strokeLinecap="round" /><path d="M32 140c15-28 78-28 92 0v91H32Z" fill="#32a2c7" /><path d="M42 226l-18 62M114 226l20 62" stroke="#e7a17b" strokeWidth="18" strokeLinecap="round" /></g><g><rect x="176" y="350" width="108" height="74" rx="8" fill="#fff" transform="rotate(-7 230 387)" /><path d="M192 391c19-21 35-20 51 2 12-21 24-25 34-12" fill="none" stroke="#f5668c" strokeWidth="6" strokeLinecap="round" /><circle cx="224" cy="370" r="8" fill="#f8c84c" /><rect x="472" y="348" width="54" height="54" rx="6" fill="#ef5c54" /><rect x="523" y="324" width="54" height="78" rx="6" fill="#3aa7db" /><path d="M551 287l32 37h-64Z" fill="#f6bd3e" /><circle cx="145" cy="388" r="13" fill="#77c8e9" /><circle cx="610" cy="389" r="13" fill="#82cf75" /></g><g opacity=".95"><path d="M64 102c26-24 48-25 68-4" fill="none" stroke="#f6c84e" strokeWidth="12" strokeLinecap="round" /><path d="M65 125c27-24 51-24 73 0" fill="none" stroke="#f26b88" strokeWidth="12" strokeLinecap="round" /><path d="M65 149c27-24 54-24 80 0" fill="none" stroke="#72c7dd" strokeWidth="12" strokeLinecap="round" /></g><g><circle cx="95" cy="72" r="11" fill="#ffd45f" /><path d="M95 44v-14M95 114v14M67 72H53M137 72h-14M75 52l-10-10M125 102l10 10M75 102l-10 10M125 52l10-10" stroke="#ffd45f" strokeWidth="5" strokeLinecap="round" /></g></svg><div className="absolute bottom-7 right-7 rounded-[1.4rem] border border-white/80 bg-white/80 px-4 py-3 shadow-lg backdrop-blur"><div className="text-xs font-black uppercase tracking-[.15em] text-[#ef4770]">Pisipouk Studio</div><div className="mt-1 text-sm font-black text-[#144777]">Μικρά βήματα · μεγάλες ανακαλύψεις ✨</div></div></div>;
}

function PisiMascot() {
  return <svg viewBox="0 0 180 190" className="mx-auto h-44 w-44 drop-shadow-[0_18px_28px_rgba(56,38,85,.18)]" aria-hidden="true"><defs><linearGradient id="botBody" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffffff" /><stop offset="1" stopColor="#dcefff" /></linearGradient></defs><circle cx="90" cy="92" r="80" fill="#eee8ff" /><rect x="48" y="47" width="84" height="68" rx="30" fill="url(#botBody)" stroke="#b9d9ef" strokeWidth="4" /><rect x="57" y="58" width="66" height="41" rx="20" fill="#173968" /><circle cx="78" cy="78" r="8" fill="#75e5ff" /><circle cx="103" cy="78" r="8" fill="#75e5ff" /><path d="M80 89c8 7 15 7 23 0" fill="none" stroke="#75e5ff" strokeWidth="4" strokeLinecap="round" /><path d="M90 46V30" stroke="#6286ad" strokeWidth="5" strokeLinecap="round" /><circle cx="90" cy="25" r="7" fill="#f7b843" /><rect x="59" y="110" width="62" height="52" rx="24" fill="url(#botBody)" stroke="#b9d9ef" strokeWidth="4" /><path d="M90 124l8 12 14 2-10 10 2 14-14-7-13 7 2-14-10-10 14-2Z" fill="#f65b82" /><path d="M55 124l-20 16M125 124l20 16" stroke="#dcefff" strokeWidth="15" strokeLinecap="round" /><circle cx="30" cy="144" r="10" fill="#f7c550" /><circle cx="150" cy="144" r="10" fill="#66d4a9" /></svg>;
}

function ZoneArt({ index, tone, soft }: { index: number; tone: string; soft: string }) {
  return <div className="relative h-28 overflow-hidden" style={{ background: `linear-gradient(135deg, ${soft}, #fff)` }}><svg viewBox="0 0 220 120" className="absolute inset-0 h-full w-full" aria-hidden="true"><circle cx="176" cy="24" r="48" fill={tone} opacity=".11" /><circle cx="36" cy="110" r="45" fill={tone} opacity=".08" />{index === 0 && <g><rect x="45" y="39" width="48" height="56" rx="7" fill="#ff889f" /><rect x="105" y="30" width="48" height="65" rx="7" fill="#5ec4e7" /><path d="M55 54h27M55 66h20M115 48h27M115 60h24" stroke="#fff" strokeWidth="5" strokeLinecap="round" /><path d="M91 43l14 8v44H91Z" fill="#ffc950" /></g>}{index === 1 && <g><rect x="54" y="61" width="38" height="35" rx="6" fill="#57bce0" /><rect x="94" y="45" width="38" height="51" rx="6" fill="#f6b943" /><rect x="134" y="28" width="38" height="68" rx="6" fill="#ef6b87" /><text x="66" y="87" fontSize="25" fontWeight="900" fill="#fff">1</text><text x="106" y="77" fontSize="25" fontWeight="900" fill="#fff">2</text><text x="146" y="64" fontSize="25" fontWeight="900" fill="#fff">3</text></g>}{index === 2 && <g><ellipse cx="110" cy="64" rx="55" ry="34" fill="#f1b86a" /><circle cx="85" cy="57" r="8" fill="#ef5b77" /><circle cx="108" cy="48" r="8" fill="#4bb9d8" /><circle cx="129" cy="59" r="8" fill="#61bd7a" /><circle cx="101" cy="75" r="8" fill="#8c6ee7" /><path d="M150 29l18 54" stroke="#8c5b36" strokeWidth="8" strokeLinecap="round" /><path d="M145 28l20-8 4 17Z" fill="#f7c550" /></g>}{index === 3 && <g><path d="M100 94V56" stroke="#6ca65c" strokeWidth="8" strokeLinecap="round" /><path d="M103 61c-22-2-34-15-31-33 23 2 33 13 31 33Z" fill="#6fc87f" /><path d="M103 70c22-2 34-15 31-33-23 2-33 13-31 33Z" fill="#42af69" /><circle cx="150" cy="48" r="24" fill="#bcecff" stroke="#4eadd0" strokeWidth="6" /><path d="M166 66l21 22" stroke="#4eadd0" strokeWidth="8" strokeLinecap="round" /></g>}{index === 4 && <g><circle cx="103" cy="65" r="34" fill="#f6b44a" /><circle cx="103" cy="65" r="19" fill="#fff0c5" /><path d="M60 31l13 18M142 31l-13 18M60 99l13-18M142 99l-13-18" stroke="#9e69e0" strokeWidth="8" strokeLinecap="round" /><path d="M78 65h50" stroke="#ef5b77" strokeWidth="6" strokeLinecap="round" /></g>}{index === 5 && <g><path d="M110 90S58 61 72 36c12-20 35-9 38 5 5-14 29-25 41-5 15 26-41 54-41 54Z" fill="#ef6684" /><circle cx="70" cy="84" r="15" fill="#ffd25f" /><circle cx="150" cy="84" r="15" fill="#75d2ab" /><path d="M62 84h16M142 84h16" stroke="#fff" strokeWidth="4" strokeLinecap="round" /></g>}</svg></div>;
}

function WeeklyArt({ emoji, index }: { emoji: string; index: number }) {
  const bg = ["#fff0f3", "#eaf9ff", "#fff7df"][index % 3];
  return <div className="grid h-16 w-16 place-items-center rounded-[1.35rem] text-4xl shadow-inner" style={{ backgroundColor: bg }}>{emoji}</div>;
}
