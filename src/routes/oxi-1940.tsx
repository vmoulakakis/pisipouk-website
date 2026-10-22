import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, Download, ExternalLink, Play, Pause, RotateCcw, Scissors, Printer, ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/oxi-1940")({
  head: () => ({
    meta: [
      { title: "28η Οκτωβρίου 1940 | Story Time & Μίνι βιβλιαράκι | Πισιπούκ" },
      { name: "description", content: "Δύο εικονογραφημένα μίνι βιβλιαράκια της 28ης Οκτωβρίου 1940 για παιδιά 2,5–3,5 και 4–6 ετών, εκτύπωση Α4 και κινούμενες οδηγίες κατασκευής." },
    ],
  }),
  component: OxiBookletPage,
});

const VERSIONS = [
  {
    id: "little",
    age: "2,5–3,5",
    title: "Το πρώτο μου βιβλιαράκι του ΟΧΙ",
    note: "Μικρές προτάσεις, μεγάλες εικόνες, θάρρος, βοήθεια και ειρήνη.",
    tint: "from-[#ebf8ff] via-white to-[#edf8ef]",
    emoji: "🕊️",
    booklet: "https://www.canva.com/d/u6uw_qM_5vw_1Ux",
    activities: "https://www.canva.com/d/Af9o_qKGSzyZJOW",
  },
  {
    id: "older",
    age: "4–6",
    title: "Η ιστορία του μεγάλου ΟΧΙ",
    note: "Το 1940, το τελεσίγραφο, η άρνηση, η Πίνδος και η αλληλεγγύη.",
    tint: "from-[#fff3e3] via-white to-[#ebf5ff]",
    emoji: "📖",
    booklet: "https://www.canva.com/d/vh251266XWuTlTv",
    activities: "https://www.canva.com/d/MIhXQfvj0kPD00Q",
  },
] as const;

const STEPS = [
  { title: "Εκτυπώνουμε", detail: "Ένα φύλλο Α4, οριζόντιο, μονής όψης, χωρίς προσαρμογή μεγέθους (100%)." },
  { title: "Διπλώνουμε στις μπλε γραμμές", detail: "Τσακίζουμε το χαρτί στις τέσσερις στήλες και στη μέση του ύψους." },
  { title: "Κόβει μόνο ο ενήλικος", detail: "Κάνουμε μία οριζόντια σχισμή στο κέντρο, μόνο στα δύο μεσαία πλαίσια. Όχι από πάνω μέχρι κάτω!" },
  { title: "Διπλώνουμε στη μέση", detail: "Φέρνουμε τις δύο μακριές πλευρές μαζί, με τις εικόνες στραμμένες προς τα έξω." },
  { title: "Ανοίγουμε τη σχισμή", detail: "Σπρώχνουμε απαλά τις δύο άκρες προς το κέντρο, μέχρι το χαρτί να σχηματίσει σταυρό." },
  { title: "Κλείνουμε το βιβλιαράκι", detail: "Διπλώνουμε τις σελίδες και το εξώφυλλο γίνεται η πρώτη σελίδα." },
  { title: "Ξεφυλλίζουμε 1–8", detail: "Ελέγχουμε τη σωστή φορά των εικόνων και διαβάζουμε την ιστορία μαζί." },
] as const;

function FoldDrawing({ step }: { step: number }) {
  const openSheet = step < 5;
  return (
    <svg viewBox="0 0 760 410" aria-label="Κινούμενο σχηματικό παράδειγμα διπλώματος βιβλιαρίου 8 σελίδων" role="img" className="h-auto w-full">
      <defs>
        <linearGradient id="paperOxi" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fffdf6" /><stop offset="100%" stopColor="#dfeeff" />
        </linearGradient>
      </defs>
      {openSheet ? (
        <g>
          <rect x="30" y="18" width="700" height="360" rx="7" fill="url(#paperOxi)" stroke="#82acd1" strokeWidth="3" />
          {Array.from({ length: 8 }, (_, i) => {
            const col = i % 4, row = Math.floor(i / 4);
            const x = 30 + col * 175, y = 18 + row * 180;
            const number = row === 0 ? [5, 4, 3, 2][col] : [6, 7, 8, 1][col];
            return <g key={i} transform={row === 0 ? `rotate(180 ${x + 87.5} ${y + 90})` : undefined}>
              <rect x={x + 9} y={y + 9} width="157" height="162" rx="8" fill={col % 2 === 0 ? "#e3effb" : "#f9f5e8"} opacity=".8" />
              <text x={x + 87.5} y={y + 59} textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="38" fill="#124987">{number}</text>
              <text x={x + 87.5} y={y + 93} textAnchor="middle" fontFamily="sans-serif" fontSize="25">{number === 1 ? "🇬🇷" : number === 8 ? "🕊️" : "🌿"}</text>
              <text x={x + 87.5} y={y + 131} textAnchor="middle" fontFamily="sans-serif" fontSize="15" fill="#17334f">{number === 1 ? "Εξώφυλλο" : "1940 · ΟΧΙ"}</text>
            </g>;
          })}
          {[205, 380, 555].map(x => <line key={x} x1={x} y1="18" x2={x} y2="378" stroke="#1975b3" strokeWidth="3" strokeDasharray="9 7" />)}
          <line x1="30" y1="198" x2="730" y2="198" stroke="#1975b3" strokeWidth="3" strokeDasharray="9 7" />
          <line x1="205" y1="198" x2="555" y2="198" stroke={step >= 2 ? "#e53a51" : "#d77b7b"} strokeWidth={step >= 2 ? 8 : 4} strokeDasharray="12 7" />
          {step === 2 && <text x="380" y="400" textAnchor="middle" fill="#bc2343" fontWeight="900" fontSize="16">✂ Κόβουμε μόνο τα δύο μεσαία τμήματα</text>}
          {step === 3 && <path d="M30 199 Q175 248 205 198 M730 199 Q585 248 555 198" fill="none" stroke="#f09825" strokeWidth="7" strokeLinecap="round" />}
          {step === 4 && <path d="M205 198 L380 125 L555 198 L380 270 Z" fill="#d3e9f9" stroke="#ec9c25" strokeWidth="7" opacity=".92" />}
        </g>
      ) : (
        <g>
          {[0, 1, 2, 3].map((n) => <rect key={n} x={215 + n * 8} y={62 - n * 8} width="295" height="275" rx="13" fill={n % 2 ? "#cde8f5" : "#fff9e9"} stroke="#447fac" strokeWidth="3" />)}
          <rect x="249" y="42" width="295" height="275" rx="13" fill="url(#paperOxi)" stroke="#13518f" strokeWidth="5" />
          <text x="397" y="105" textAnchor="middle" fontFamily="sans-serif" fill="#114781" fontWeight="900" fontSize="24">28η Οκτωβρίου</text>
          <text x="397" y="144" textAnchor="middle" fontFamily="sans-serif" fill="#114781" fontWeight="900" fontSize="31">1940</text>
          <text x="397" y="212" textAnchor="middle" fontFamily="sans-serif" fill="#144889" fontWeight="900" fontSize="76">ΟΧΙ</text>
          <text x="397" y="274" textAnchor="middle" fontFamily="sans-serif" fill="#52764c" fontWeight="800" fontSize="21">8 μικρές σελίδες</text>
          {step === 6 && <text x="397" y="367" textAnchor="middle" fill="#12528b" fontSize="20" fontWeight="700">1 → 2 → 3 → 4 → 5 → 6 → 7 → 8</text>}
        </g>
      )}
    </svg>
  );
}

function OxiBookletPage() {
  const [age, setAge] = useState<"little" | "older">("little");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const current = VERSIONS.find((item) => item.id === age)!;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStep((previous) => {
        if (previous === STEPS.length - 1) { setPlaying(false); return previous; }
        return previous + 1;
      });
    }, 4200);
    return () => window.clearInterval(timer);
  }, [playing]);

  return (
    <SiteLayout>
      <main className="min-h-screen bg-[#fffaf2] text-[#193750]">
        <section className="bg-gradient-to-br from-[#e5f4ff] via-[#fffdf7] to-[#f5ecd7] px-4 py-10 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <Link to="/virtual-preschool" className="inline-flex items-center gap-2 rounded-full border border-[#c8dbee] bg-white/80 px-4 py-2 text-sm font-bold text-[#125188]"><ArrowLeft className="h-4 w-4" /> Online Preschool</Link>
            <div className="mt-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[.16em] text-[#3f784e]">Εορταστική θεματική · 28 Οκτωβρίου</p>
                <h1 className="mt-3 text-4xl font-black leading-tight text-[#124987] sm:text-6xl">Το μεγάλο ΟΧΙ του 1940</h1>
                <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-[#38566d]">Διαβάζουμε την ιστορία, εκτυπώνουμε ένα Α4 και φτιάχνουμε ένα μίνι βιβλιαράκι 8 σελίδων. Επιλέγουμε την κατάλληλη ηλικία και βλέπουμε βήμα-βήμα το δίπλωμα.</p><a href="/october-1940" className="mt-5 inline-flex min-h-12 items-center rounded-full bg-[#124987] px-5 py-3 text-sm font-black text-white">🧩 Παίζω 12 δραστηριότητες ανά ηλικία · 24 συνολικά →</a><a href="/october-1940-coloring" className="ml-2 mt-5 inline-flex min-h-12 items-center rounded-full border border-blue-300 bg-white px-5 py-3 text-sm font-black text-blue-900">🎨 Ζωγραφική online & PDF Α4 →</a>
              </div>
              <div className="self-start rounded-3xl border border-white/80 bg-white/80 p-5 text-center shadow-sm">
                <div className="text-4xl">🇬🇷 📖 🕊️</div>
                <p className="mt-2 text-sm font-black text-[#125188]">Ένα Α4 · 8 σελίδες · Χωρίς κόλλα</p>
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <h2 className="text-3xl font-black text-[#124987]">Διάλεξε ηλικία</h2>
          <p className="mt-2 text-sm font-semibold text-slate-600">Δύο διαφορετικές ιστορίες και φύλλα δραστηριοτήτων, με την ίδια τεχνική κατασκευής.</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {VERSIONS.map((item) => (
              <article key={item.id} className={`rounded-[2rem] border-2 bg-gradient-to-br p-6 shadow-sm transition ${item.tint} ${age === item.id ? "border-[#0c70b8] shadow-lg" : "border-white"}`}>
                <button type="button" onClick={() => { setAge(item.id); setPlaying(false); setStep(0); }} aria-pressed={age === item.id} className="w-full text-left">
                  <span className="text-5xl">{item.emoji}</span>
                  <div className="mt-3 text-xs font-black uppercase tracking-widest text-[#3c7259]">Για παιδιά {item.age} ετών</div>
                  <h3 className="mt-2 text-2xl font-black text-[#124987]">{item.title}</h3>
                  <p className="mt-2 min-h-12 text-sm font-semibold leading-6 text-slate-600">{item.note}</p>
                  <span className="mt-4 inline-flex rounded-full bg-[#124987] px-4 py-2 text-xs font-black text-white">{age === item.id ? "✓ Επιλεγμένο" : "Επίλεξε ηλικία"}</span>
                </button>
                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  <a href={item.booklet} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#0b5494] px-4 py-3 text-center text-sm font-black text-white hover:bg-[#073e72]"><Download className="h-4 w-4" /> Βιβλιαράκι στο Canva <ExternalLink className="h-3 w-3" /></a>
                  <a href={item.activities} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[#a4c4db] bg-white px-4 py-3 text-center text-sm font-black text-[#144a7b] hover:bg-blue-50"><BookOpen className="h-4 w-4" /> 12 δραστηριότητες</a>
                </div>
                <p className="mt-3 text-xs font-medium text-[#4e6377]">Στο Canva: Άνοιξε το σχέδιο → Κοινοποίηση → Λήψη → PDF Εκτύπωσης.</p>
              </article>
            ))}
          </div>
        </section>
        <section id="how-to-fold" className="bg-[#e9f3fb] px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[.2em] text-[#3c7259]">Κινούμενος οδηγός</p>
                <h2 className="mt-2 text-3xl font-black text-[#124987]">Πώς γίνεται το βιβλιαράκι</h2>
                <p className="mt-2 text-sm font-medium text-slate-600">Η ίδια τεχνική για {current.age} ετών. Πατήστε Αναπαραγωγή ή δείτε τα βήματα ένα-ένα.</p>
              </div>
              <button type="button" onClick={() => { if (step === 6) setStep(0); setPlaying((v) => !v); }} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0b5494] px-6 py-3 font-black text-white shadow-md">
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />} {playing ? "Παύση" : "Αναπαραγωγή"}
              </button>
            </div>
            <div className="mt-7 overflow-hidden rounded-[2rem] border-2 border-[#d0e1ed] bg-white p-4 shadow-lg sm:p-8">
              <FoldDrawing step={step} />
              <div aria-live="polite" className="mt-5 rounded-2xl bg-[#f5faff] p-5 text-center">
                <div className="text-xs font-black uppercase tracking-widest text-[#3b769c]">Βήμα {step + 1} / {STEPS.length}</div>
                <h3 className="mt-2 text-2xl font-black text-[#124987]">{STEPS[step].title}</h3>
                <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">{STEPS[step].detail}</p>
              </div>
              <div className="mt-5 flex items-center justify-center gap-3">
                <button type="button" disabled={step === 0} onClick={() => { setPlaying(false); setStep((s) => Math.max(0, s - 1)); }} className="rounded-full border border-[#aac9dc] px-5 py-2 font-black text-[#124987] disabled:opacity-40">← Πίσω</button>
                <button type="button" onClick={() => { setPlaying(false); setStep(0); }} className="rounded-full border border-[#aac9dc] px-4 py-2 text-[#124987]" aria-label="Από την αρχή"><RotateCcw className="h-5 w-5" /></button>
                <button type="button" disabled={step === STEPS.length - 1} onClick={() => { setPlaying(false); setStep((s) => Math.min(STEPS.length - 1, s + 1)); }} className="rounded-full bg-[#0b5494] px-5 py-2 font-black text-white disabled:opacity-40">Επόμενο →</button>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4 text-sm font-black text-[#125188]"><Printer className="mb-2 h-6 w-6" /> Α4 οριζόντιο · μονή όψη · 100%</div>
              <div className="rounded-2xl bg-white p-4 text-sm font-black text-[#125188]"><Scissors className="mb-2 h-6 w-6" /> Κόβει ΜΟΝΟ ενήλικος τη μεσαία σχισμή</div>
              <div className="rounded-2xl bg-white p-4 text-sm font-black text-[#125188]"><Heart className="mb-2 h-6 w-6" /> Διαβάζουμε μαζί χωρίς πίεση ή βαθμολογία</div>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-4 py-12 text-center">
          <h2 className="text-2xl font-black text-[#124987]">Έτοιμοι για Story Time;</h2>
          <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">Οι τέσσερις επάνω εικόνες στο Α4 φαίνονται ανάποδα επίτηδες — μετά το δίπλωμα διαβάζονται σωστά. Για την πρώτη εκτύπωση, δοκιμάστε ένα απλό φύλλο και ελέγξτε τη φυσική σειρά 1–8.</p>
          <Link to="/virtual-preschool" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#124987] px-6 py-3 font-black text-white">Πίσω στον κόσμο του Πισιπούκ <ArrowRight className="h-4 w-4" /></Link>
        </section>
      </main>
    </SiteLayout>
  );
}
