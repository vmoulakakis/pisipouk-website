import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

type Pack = {
  title: string;
  emoji: string;
  symbols: string[];
  craft: { title: string; materials: string[]; steps: string[] };
  skills: string[];
  parentNote: string;
  video: { title: string; duration: string };
};

const PRINT_CSS = "@media print{body *{visibility:hidden!important}.season-print-sheet,.season-print-sheet *{visibility:visible!important}.season-print-sheet{position:absolute!important;left:0;top:0;width:100%;padding:12mm!important;background:white!important}.no-print{display:none!important}}";

const PACKS: Record<string, Pack> = {
  autumn: {
    title: "Φθινόπωρο",
    emoji: "🍂",
    symbols: ["🍂","🍁","🌰","🌳","☔","🦔"],
    craft: { title: "Κολάζ με φθινοπωρινά φύλλα", materials: ["χαρτόνι","φύλλα","κόλλα"], steps: ["Μαζεύουμε διαφορετικά φύλλα.","Τα ταξινομούμε κατά χρώμα ή μέγεθος.","Τα κολλάμε και φτιάχνουμε ένα δέντρο."] },
    skills: ["Λεπτή κινητικότητα","Συγκέντρωση","Γλώσσα","Δημιουργικότητα"],
    parentNote: "Μιλήστε για χρώματα, υφές και αλλαγές στη φύση.",
    video: { title: "Φθινοπωρινό κολάζ", duration: "0:45" },
  },
  christmas: {
    title: "Χριστούγεννα",
    emoji: "🎄",
    symbols: ["🎄","⭐","🎁","🔔","⛄","🧦"],
    craft: { title: "Χριστουγεννιάτικο δέντρο με χαρτάκια", materials: ["πράσινο χαρτόνι","χρωματιστά χαρτάκια","κόλλα"], steps: ["Κόβουμε ή σκίζουμε χαρτάκια.","Τα κολλάμε πάνω στο δέντρο.","Προσθέτουμε αστέρι στην κορυφή."] },
    skills: ["Λεπτή κινητικότητα","Συγκέντρωση","Δημιουργικότητα"],
    parentNote: "Δώστε χώρο στο παιδί να επιλέξει χρώματα και διάταξη.",
    video: { title: "Χριστουγεννιάτικο δέντρο", duration: "0:55" },
  },
  carnival: {
    title: "Απόκριες",
    emoji: "🎭",
    symbols: ["🎭","🎈","🤡","🎩","🎉","🪄"],
    craft: { title: "Αποκριάτικη μάσκα", materials: ["χαρτόνι","λάστιχο","χρωματιστά χαρτιά"], steps: ["Σχεδιάζουμε τη μάσκα.","Διακοσμούμε ελεύθερα.","Ο ενήλικας ανοίγει τρύπες και περνά το λάστιχο."] },
    skills: ["Δημιουργικότητα","Γλώσσα","Λεπτή κινητικότητα"],
    parentNote: "Ρωτήστε ποιον χαρακτήρα φαντάζεται ότι γίνεται με τη μάσκα.",
    video: { title: "Φτιάχνουμε μάσκα", duration: "1:00" },
  },
  march25: {
    title: "25η Μαρτίου",
    emoji: "🇬🇷",
    symbols: ["🇬🇷","🌿","🕊️","💙","🤍","🌼"],
    craft: { title: "Μπλε-λευκό στεφάνι", materials: ["χάρτινο πιάτο","μπλε και λευκό χαρτί","κόλλα"], steps: ["Ο ενήλικας αφαιρεί το κέντρο.","Φτιάχνουμε μικρά μπλε και λευκά σχήματα.","Τα κολλάμε γύρω από το στεφάνι."] },
    skills: ["Συγκέντρωση","Λεπτή κινητικότητα","Γλώσσα"],
    parentNote: "Κρατήστε την έμφαση στα χρώματα, στα σύμβολα και στη δημιουργική έκφραση.",
    video: { title: "Μπλε-λευκό στεφάνι", duration: "0:50" },
  },
  easter: {
    title: "Πάσχα",
    emoji: "🐰",
    symbols: ["🐰","🥚","🌷","🐣","🌼","🧺"],
    craft: { title: "Πασχαλινό αυγό με κολάζ", materials: ["χαρτόνι","χρωματιστά χαρτάκια","κόλλα"], steps: ["Σχεδιάζουμε ένα μεγάλο αυγό.","Σκίζουμε μικρά χαρτάκια.","Τα κολλάμε δημιουργώντας μοτίβα."] },
    skills: ["Λεπτή κινητικότητα","Συγκέντρωση","Δημιουργικότητα"],
    parentNote: "Παίξτε με επαναλαμβανόμενα μοτίβα: γραμμή, κύκλος, τελεία.",
    video: { title: "Πασχαλινό αυγό", duration: "0:40" },
  },
  summer: {
    title: "Καλοκαίρι",
    emoji: "☀️",
    symbols: ["☀️","🐠","⛵","🍉","🏖️","🦀"],
    craft: { title: "Ψαράκι με πολύχρωμα λέπια", materials: ["χαρτόνι","χρωματιστοί κύκλοι","κόλλα"], steps: ["Σχεδιάζουμε το σώμα του ψαριού.","Κολλάμε κύκλους σαν λέπια.","Προσθέτουμε μάτι και ουρά."] },
    skills: ["Δημιουργικότητα","Λεπτή κινητικότητα","Γλώσσα"],
    parentNote: "Μιλήστε για θάλασσα, ζώα, ζέστη και καλοκαιρινά φρούτα.",
    video: { title: "Πολύχρωμο ψαράκι", duration: "0:45" },
  },
  oct28: {
    title: "28η Οκτωβρίου",
    emoji: "🇬🇷",
    symbols: ["🇬🇷","🕊️","💙","🤍","🌿","⭐"],
    craft: { title: "Περιστέρι ειρήνης", materials: ["λευκό χαρτόνι","μπλε χαρτί","κόλλα"], steps: ["Σχεδιάζουμε το περίγραμμα του περιστεριού.","Κόβουμε με βοήθεια ενήλικα.","Προσθέτουμε μπλε-λευκές λεπτομέρειες."] },
    skills: ["Συγκέντρωση","Γλώσσα","Δημιουργικότητα"],
    parentNote: "Η δραστηριότητα μπορεί να εστιάσει στην έννοια της ειρήνης με απλό, ηλικιακά κατάλληλο τρόπο.",
    video: { title: "Περιστέρι ειρήνης", duration: "0:55" },
  },
};

function shuffle<T>(values: T[]) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapWith]] = [result[swapWith], result[index]];
  }
  return result;
}

export const Route = createFileRoute("/seasonal-packs_/$season")({
  head: ({ params }) => ({ meta: [{ title: (PACKS[params.season]?.title ?? "Seasonal Pack") + " | Ο Πισιπούκ" }] }),
  component: PackPage,
});

function PackPage() {
  const { season } = Route.useParams();
  const pack = PACKS[season];
  if (!pack) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <h1 className="text-3xl font-black">Το pack δεν βρέθηκε</h1>
          <Link to="/seasonal-packs" className="mt-5 inline-flex rounded-full bg-primary px-5 py-3 font-black text-primary-foreground">Όλα τα packs</Link>
        </div>
      </SiteLayout>
    );
  }
  return <PackContent pack={pack} />;
}

function PackContent({ pack }: { pack: Pack }) {
  const target = pack.symbols;
  const [tiles, setTiles] = useState(() => shuffle(target));
  const [selected, setSelected] = useState<number | null>(null);
  const solved = tiles.every((tile, index) => tile === target[index]);

  const swap = (index: number) => {
    if (selected === null) {
      setSelected(index);
      return;
    }
    const next = [...tiles];
    [next[selected], next[index]] = [next[index], next[selected]];
    setTiles(next);
    setSelected(null);
  };

  const newPuzzle = () => {
    let next = shuffle(target);
    if (next.every((tile, index) => tile === target[index])) next = shuffle(target);
    setTiles(next);
    setSelected(null);
  };

  return (
    <SiteLayout>
      <style>{PRINT_CSS}</style>
      <section className="bg-gradient-to-b from-orange-50 via-white to-sky-50 py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="no-print flex flex-wrap items-center justify-between gap-3">
            <Link to="/seasonal-packs" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-[#0b3b82]">← Seasonal Packs</Link>
            <Button type="button" variant="outline" className="rounded-full bg-white" onClick={() => window.print()}>🖨️ Εκτύπωση / PDF A4</Button>
          </div>

          <div className="season-print-sheet mt-6 rounded-[2rem] border bg-white p-5 shadow-sm sm:p-8">
            <div className="text-center">
              <div className="text-6xl">{pack.emoji}</div>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-primary">Seasonal Pack</p>
              <h1 className="mt-2 text-4xl font-black text-[#0b3b82] sm:text-5xl">{pack.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">Ζωγραφική · puzzle · κατασκευή · printable</p>
            </div>

            <div className="no-print mt-7 grid gap-3 sm:grid-cols-2">
              <a href="/virtual-preschool#coloring-library" className="rounded-2xl border bg-pink-50 p-4 font-black text-[#0b3b82]">🎨 Άνοιξε τη ζωγραφική</a>
              <Link to="/learning-games" className="rounded-2xl border bg-violet-50 p-4 font-black text-[#0b3b82]">🧩 Περισσότερα μαθησιακά παιχνίδια</Link>
            </div>

            <section className="mt-7 rounded-2xl border bg-violet-50/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">Puzzle</p>
                  <h2 className="mt-1 text-2xl font-black text-[#0b3b82]">Βάλε τη σειρά όπως στον στόχο</h2>
                </div>
                <Button type="button" variant="outline" className="no-print rounded-full bg-white" onClick={newPuzzle}>🎲 Νέο puzzle</Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-3xl">
                {target.map((item, index) => <span key={index} className="rounded-xl border bg-white p-2">{item}</span>)}
              </div>
              <div className="no-print mt-4 grid grid-cols-3 gap-3">
                {tiles.map((item, index) => (
                  <button key={index} type="button" onClick={() => swap(index)}
                    className={"aspect-square rounded-2xl border bg-white text-4xl shadow-sm " + (selected === index ? "ring-2 ring-primary" : "")}>
                    {item}
                  </button>
                ))}
              </div>
              <p className="no-print mt-3 text-sm font-black">{solved ? "🎉 Μπράβο! Το puzzle ολοκληρώθηκε." : "Πάτησε δύο κομμάτια για να αλλάξουν θέση."}</p>
            </section>

            <section className="mt-7 rounded-2xl border bg-amber-50/70 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">Κατασκευή</p>
              <h2 className="mt-1 text-2xl font-black text-[#0b3b82]">{pack.craft.title}</h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <div>
                  <h3 className="font-black">Υλικά</h3>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">{pack.craft.materials.map((item) => <li key={item}>• {item}</li>)}</ul>
                </div>
                <div>
                  <h3 className="font-black">Βήματα</h3>
                  <ol className="mt-2 space-y-1 text-sm text-slate-700">{pack.craft.steps.map((step, index) => <li key={step}><b>{index + 1}.</b> {step}</li>)}</ol>
                </div>
              </div>
            </section>

            <section className="no-print mt-7 overflow-hidden rounded-2xl border bg-slate-950 text-white">
              <div className="relative flex min-h-52 items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 p-6 text-center">
                <div>
                  <div className="text-6xl">{pack.emoji}</div>
                  <p className="mt-3 text-lg font-black">{pack.video.title}</p>
                  <span className="mt-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black">{pack.video.duration}</span>
                </div>
                <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-1 text-[10px]">video preview</span>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-black">Video κατασκευής</h2>
                <p className="mt-1 text-sm text-white/70">Έτοιμη υποδομή για δικό μας σύντομο video 30–90″, embedded χωρίς έξοδο από το site.</p>
                <Button type="button" disabled className="mt-4 rounded-full">▶️ Δες πώς γίνεται</Button>
                <p className="mt-2 text-xs text-white/55">Δεν βρέθηκε ακόμη δικό μας video αρχείο ή επίσημο video URL στο project, οπότε δεν βάζουμε ξένο περιεχόμενο.</p>
              </div>
            </section>

            <section className="mt-7 rounded-2xl border bg-sky-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">Για εκπαιδευτικούς & γονείς</p>
              <h2 className="mt-1 text-2xl font-black text-[#0b3b82]">Τι καλλιεργεί αυτή η δραστηριότητα</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {pack.skills.map((skill) => <span key={skill} className="rounded-full bg-white px-3 py-2 text-xs font-black text-primary shadow-sm">{skill}</span>)}
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{pack.parentNote}</p>
            </section>

            <div className="mt-7 border-t pt-4 text-center text-xs font-bold text-muted-foreground">Ο Πισιπούκ · pisipouk.vercel.app</div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
