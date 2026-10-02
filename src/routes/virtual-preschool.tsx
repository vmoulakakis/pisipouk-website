import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  Gamepad2,
  Heart,
  Palette,
  Printer,
  RotateCcw,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { trackEvent } from "@/lib/pisipoukApi";

export const Route = createFileRoute("/virtual-preschool")({
  head: () => ({
    meta: [
      { title: "Pisipouk Virtual Preschool+ | Παιχνίδια, Ζωγραφιές & A4 Χειροτεχνίες" },
      {
        name: "description",
        content:
          "Το δωρεάν Virtual Preschool του Πισιπούκ για παιδιά 2–6 ετών: καθημερινό πρόγραμμα, διαδραστικά παιχνίδια, online ζωγραφική, A4 πατρόν χειροτεχνίας και Parent Zone.",
      },
    ],
  }),
  component: VirtualPreschool,
});

type Age = "2–3" | "4–5" | "5–6";
type CraftKind = "owl" | "rocket" | "mask" | "tree" | "fish" | "butterfly" | "dino" | "crown" | "boat" | "flower" | "bunny" | "robot";

type Craft = {
  id: string;
  title: string;
  kind: CraftKind;
  age: Age;
  minutes: number;
  level: string;
  skill: string;
  materials: string[];
  steps: string[];
};

type Game = {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  question: string;
  options: string[];
  correct: number;
  skill: string;
  age: Age | "2–6";
};

type ColoringDesign = {
  id: string;
  title: string;
  emoji: string;
  age: Age;
  scene: "garden" | "space" | "ocean" | "farm";
};

const AGES: { id: Age; label: string; note: string; emoji: string }[] = [
  { id: "2–3", label: "2–3 ετών", note: "Μεγάλα σχήματα • απλές επιλογές", emoji: "🧸" },
  { id: "4–5", label: "4–5 ετών", note: "Ιστορίες • μέτρηση • δημιουργία", emoji: "🌈" },
  { id: "5–6", label: "5–6 ετών", note: "Γράμματα • λογική • σύνθετες δραστηριότητες", emoji: "🚀" },
];

const THEMES = [
  { title: "Το μαγικό δάσος", emoji: "🌳", accent: "from-emerald-400 to-lime-300", tip: "Βρείτε 3 διαφορετικά φύλλα στη βόλτα σας." },
  { title: "Μικροί αστροναύτες", emoji: "🪐", accent: "from-indigo-500 to-violet-400", tip: "Μετρήστε 5 αστέρια πριν τον ύπνο." },
  { title: "Βουτιά στον ωκεανό", emoji: "🐳", accent: "from-cyan-500 to-sky-300", tip: "Κάντε μαζί τον ήχο της θάλασσας." },
  { title: "Χρώματα παντού", emoji: "🎨", accent: "from-fuchsia-500 to-rose-300", tip: "Ψάξτε στο σπίτι ένα αντικείμενο για κάθε βασικό χρώμα." },
];

const CRAFTS: Craft[] = [
  { id: "forest-owl", title: "Κουκουβάγια του δάσους", kind: "owl", age: "2–3", minutes: 15, level: "Εύκολο", skill: "Λεπτή κινητικότητα", materials: ["Α4 εκτύπωση", "κηρομπογιές", "κόλλα stick", "παιδικό ψαλίδι με ενήλικα"], steps: ["Χρωματίστε τα μεγάλα κομμάτια.", "Κόψτε πάνω στις διακεκομμένες γραμμές με βοήθεια ενήλικα.", "Κολλήστε μάτια, φτερά και κοιλίτσα πάνω στο σώμα."] },
  { id: "happy-rocket", title: "Ο χαρούμενος πύραυλος", kind: "rocket", age: "4–5", minutes: 20, level: "Εύκολο", skill: "Σχήματα & ακολουθία", materials: ["Α4 πατρόν", "μαρκαδόροι", "κόλλα", "παιδικό ψαλίδι"], steps: ["Χρωματίστε τα μέρη του πυραύλου.", "Κόψτε σώμα, παράθυρο, πτερύγια και φλόγες.", "Συναρμολογήστε από πάνω προς τα κάτω."] },
  { id: "party-mask", title: "Μάσκα φαντασίας", kind: "mask", age: "4–5", minutes: 20, level: "Εύκολο", skill: "Δημιουργική έκφραση", materials: ["Α4 πατρόν", "χρώματα", "χαρτάκια", "κορδέλα με ενήλικα"], steps: ["Διακοσμήστε τη μάσκα όπως θέλετε.", "Ο ενήλικας κόβει το περίγραμμα και τα μάτια.", "Προσθέστε κορδέλα ή κρατήστε τη σαν θεατρικό αξεσουάρ."] },
  { id: "kind-tree", title: "Το δέντρο της καλοσύνης", kind: "tree", age: "5–6", minutes: 25, level: "Μεσαίο", skill: "Συναισθήματα & γλώσσα", materials: ["Α4 πατρόν", "χρωματιστά μολύβια", "κόλλα"], steps: ["Χρωματίστε κορμό και φύλλα.", "Σε κάθε φύλλο πείτε ή γράψτε μια καλή πράξη.", "Κολλήστε τα φύλλα γύρω από το δέντρο."] },
  { id: "rainbow-fish", title: "Ψαράκι με πολύχρωμα λέπια", kind: "fish", age: "2–3", minutes: 15, level: "Εύκολο", skill: "Χρώματα & μοτίβα", materials: ["Α4 πατρόν", "δαχτυλομπογιές ή κηρομπογιές", "κόλλα"], steps: ["Δώστε διαφορετικό χρώμα στα μεγάλα λέπια.", "Κόψτε τα έτοιμα κυκλάκια με ενήλικα.", "Κολλήστε τα πάνω στο σώμα του ψαριού."] },
  { id: "symmetry-butterfly", title: "Πεταλούδα συμμετρίας", kind: "butterfly", age: "4–5", minutes: 20, level: "Μεσαίο", skill: "Συμμετρία & παρατήρηση", materials: ["Α4 πατρόν", "μαρκαδόροι", "αυτοκόλλητα"], steps: ["Χρωματίστε ένα σχέδιο στο αριστερό φτερό.", "Αντιγράψτε τα ίδια χρώματα στο δεξί.", "Κόψτε την πεταλούδα και διπλώστε απαλά τα φτερά."] },
  { id: "little-dino", title: "Ο δεινόσαυρός μου", kind: "dino", age: "5–6", minutes: 25, level: "Μεσαίο", skill: "Σχεδιασμός & αφήγηση", materials: ["Α4 πατρόν", "χρώματα", "κόλλα", "χαρτόνι"], steps: ["Διαλέξτε τα χρώματα του δεινόσαυρου.", "Κόψτε σώμα, πόδια και πλάκες.", "Συναρμολογήστε και δώστε του όνομα και μια μικρή ιστορία."] },
  { id: "star-crown", title: "Στέμμα μικρού εξερευνητή", kind: "crown", age: "4–5", minutes: 15, level: "Εύκολο", skill: "Αυτοπεποίθηση & μοτίβα", materials: ["Α4 πατρόν", "χρώματα", "αυτοκόλλητα", "συρραπτικό μόνο από ενήλικα"], steps: ["Χρωματίστε τα αστέρια.", "Κόψτε το στέμμα με ενήλικα.", "Ο ενήλικας προσαρμόζει το μέγεθος και ενώνει τις άκρες."] },
  { id: "sea-boat", title: "Καραβάκι στο Αιγαίο", kind: "boat", age: "5–6", minutes: 25, level: "Μεσαίο", skill: "Σχήματα & σύνθεση", materials: ["Α4 πατρόν", "μπλε/λευκά χρώματα", "κόλλα"], steps: ["Χρωματίστε θάλασσα, πανί και καραβάκι.", "Κόψτε τα κομμάτια.", "Κολλήστε το πανί και δημιουργήστε κύματα στο φόντο."] },
  { id: "flower-wheel", title: "Ρόδα λουλουδιών", kind: "flower", age: "2–3", minutes: 15, level: "Εύκολο", skill: "Αντιστοίχιση χρωμάτων", materials: ["Α4 πατρόν", "κηρομπογιές", "κόλλα"], steps: ["Χρωματίστε κάθε πέταλο διαφορετικά.", "Βρείτε ένα αντικείμενο στο σπίτι με ίδιο χρώμα.", "Κολλήστε τον κύκλο στο κέντρο."] },
  { id: "bunny-puppet", title: "Λαγουδάκι finger puppet", kind: "bunny", age: "4–5", minutes: 20, level: "Εύκολο", skill: "Ρόλοι & αφήγηση", materials: ["Α4 πατρόν", "χρώματα", "κόλλα"], steps: ["Χρωματίστε το λαγουδάκι.", "Ο ενήλικας κόβει το περίγραμμα και τις υποδοχές.", "Παίξτε μια μικρή ιστορία με το puppet."] },
  { id: "shape-robot", title: "Ρομπότ από σχήματα", kind: "robot", age: "5–6", minutes: 25, level: "Μεσαίο", skill: "Γεωμετρία & επίλυση", materials: ["Α4 πατρόν", "χρώματα", "κόλλα"], steps: ["Ονομάστε όλα τα σχήματα.", "Χρωματίστε και κόψτε τα κομμάτια.", "Συνθέστε το δικό σας ρομπότ με διαφορετική διάταξη."] },
];

const COLORING: ColoringDesign[] = [
  { id: "butterfly-garden", title: "Πεταλούδα στον κήπο", emoji: "🦋", age: "2–3", scene: "garden" },
  { id: "happy-flowers", title: "Χαρούμενα λουλούδια", emoji: "🌼", age: "4–5", scene: "garden" },
  { id: "rocket-moon", title: "Πύραυλος στο φεγγάρι", emoji: "🚀", age: "4–5", scene: "space" },
  { id: "planet-party", title: "Πάρτι στους πλανήτες", emoji: "🪐", age: "5–6", scene: "space" },
  { id: "whale-sea", title: "Φάλαινα στη θάλασσα", emoji: "🐳", age: "2–3", scene: "ocean" },
  { id: "coral-friends", title: "Φίλοι στον βυθό", emoji: "🐠", age: "5–6", scene: "ocean" },
  { id: "farm-day", title: "Μέρα στη φάρμα", emoji: "🐄", age: "4–5", scene: "farm" },
  { id: "little-tractor", title: "Το μικρό τρακτέρ", emoji: "🚜", age: "5–6", scene: "farm" },
];

const GAMES: Game[] = [
  { id: "shape-match", emoji: "🔷", title: "Κυνήγι σχημάτων", subtitle: "Βρες το σωστό σχήμα", question: "Ποιο είναι το τρίγωνο;", options: ["●", "▲", "■", "★"], correct: 1, skill: "Σχήματα", age: "2–3" },
  { id: "color-match", emoji: "🎨", title: "Μαγικά χρώματα", subtitle: "Ταίριαξε το χρώμα", question: "Ποιο χρώμα είναι σαν τον ήλιο;", options: ["🔵", "🟡", "🟢", "🟣"], correct: 1, skill: "Χρώματα", age: "2–3" },
  { id: "count-stars", emoji: "⭐", title: "Μέτρα τα αστέρια", subtitle: "1, 2, 3... πάμε!", question: "⭐⭐⭐⭐ Πόσα αστέρια βλέπεις;", options: ["3", "4", "5", "6"], correct: 1, skill: "Πρώιμα μαθηματικά", age: "4–5" },
  { id: "letter-find", emoji: "🔤", title: "Βρες το Α", subtitle: "Παιχνίδι γραμμάτων", question: "Ποιο είναι το γράμμα Α;", options: ["Μ", "Α", "Π", "Σ"], correct: 1, skill: "Προγραφή", age: "4–5" },
  { id: "logic-sequence", emoji: "🧠", title: "Τι έρχεται μετά;", subtitle: "Μικρή λογική πρόκληση", question: "🔴 🔵 🔴 🔵 ...", options: ["🔴", "🟢", "🟡", "🟣"], correct: 0, skill: "Μοτίβα", age: "5–6" },
  { id: "animal-home", emoji: "🐾", title: "Πού μένει;", subtitle: "Ζωάκια & περιβάλλον", question: "Πού ζει το ψαράκι;", options: ["🌳", "🌊", "🏠", "☁️"], correct: 1, skill: "Γνώση κόσμου", age: "4–5" },
  { id: "emotion-game", emoji: "😊", title: "Πώς νιώθω;", subtitle: "Αναγνωρίζω συναισθήματα", question: "Ποιο πρόσωπο δείχνει χαρά;", options: ["😢", "😊", "😠", "😴"], correct: 1, skill: "Συναισθήματα", age: "2–6" },
  { id: "odd-one", emoji: "👀", title: "Βρες το διαφορετικό", subtitle: "Παρατήρηση & συγκέντρωση", question: "Ποιο είναι διαφορετικό; 🐠 🐠 🐟 🐠", options: ["1ο", "2ο", "3ο", "4ο"], correct: 2, skill: "Παρατήρηση", age: "5–6" },
];

const PALETTE = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"];

function track(name: string, data?: Record<string, string | number | boolean>) {
  void trackEvent(name, data ?? {});
}

function patternBody(kind: CraftKind) {
  const common = `stroke="#172033" stroke-width="5" fill="white" stroke-linejoin="round" stroke-linecap="round"`;
  const dash = `stroke="#64748b" stroke-width="3" fill="none" stroke-dasharray="12 10"`;
  const patterns: Record<CraftKind, string> = {
    owl: `<ellipse cx="400" cy="560" rx="210" ry="260" ${common}/><circle cx="320" cy="480" r="72" ${common}/><circle cx="480" cy="480" r="72" ${common}/><circle cx="320" cy="480" r="20" fill="#172033"/><circle cx="480" cy="480" r="20" fill="#172033"/><polygon points="400,520 365,570 435,570" ${common}/><path d="M205 550 Q120 650 215 760" ${common}/><path d="M595 550 Q680 650 585 760" ${common}/><path d="M270 330 L320 225 L370 345" ${common}/><path d="M430 345 L480 225 L530 330" ${common}/><path d="M250 850 H550" ${dash}/>`,
    rocket: `<path d="M400 180 C290 300 275 560 300 800 H500 C525 560 510 300 400 180Z" ${common}/><circle cx="400" cy="430" r="70" ${common}/><path d="M300 650 L190 820 L300 790Z" ${common}/><path d="M500 650 L610 820 L500 790Z" ${common}/><path d="M335 800 L400 970 L465 800Z" ${common}/><path d="M285 1030 H515" ${dash}/>`,
    mask: `<path d="M150 430 Q400 220 650 430 L610 680 Q500 760 400 650 Q300 760 190 680Z" ${common}/><ellipse cx="300" cy="500" rx="75" ry="48" ${common}/><ellipse cx="500" cy="500" rx="75" ry="48" ${common}/><path d="M390 575 Q400 600 410 575" ${common}/><circle cx="170" cy="510" r="10" ${common}/><circle cx="630" cy="510" r="10" ${common}/><path d="M160 760 H640" ${dash}/>`,
    tree: `<path d="M340 780 C355 650 350 560 300 480 C355 500 380 455 400 390 C420 455 445 500 500 480 C450 560 445 650 460 780Z" ${common}/><circle cx="260" cy="360" r="95" ${common}/><circle cx="400" cy="285" r="110" ${common}/><circle cx="540" cy="365" r="95" ${common}/><path d="M210 900 H590" ${dash}/><path d="M170 980 H630" ${dash}/>`,
    fish: `<path d="M170 560 C300 380 530 390 620 560 C530 730 300 740 170 560Z" ${common}/><path d="M620 560 L745 420 L720 560 L745 700Z" ${common}/><circle cx="275" cy="515" r="18" fill="#172033"/><path d="M310 590 Q360 630 410 590" ${common}/><circle cx="430" cy="505" r="52" ${common}/><circle cx="520" cy="560" r="52" ${common}/><circle cx="430" cy="620" r="52" ${common}/><path d="M180 820 H700" ${dash}/>`,
    butterfly: `<ellipse cx="400" cy="560" rx="35" ry="170" ${common}/><path d="M365 520 C170 250 105 430 210 590 C110 700 220 855 365 620Z" ${common}/><path d="M435 520 C630 250 695 430 590 590 C690 700 580 855 435 620Z" ${common}/><circle cx="245" cy="500" r="48" ${common}/><circle cx="555" cy="500" r="48" ${common}/><path d="M380 390 Q330 315 300 320" ${common}/><path d="M420 390 Q470 315 500 320" ${common}/><path d="M150 930 H650" ${dash}/>`,
    dino: `<path d="M170 650 C140 500 250 370 420 410 C560 440 590 570 560 680 L670 710 L620 800 L500 750 L470 880 H390 L370 755 L270 760 L245 880 H165 L190 730 C155 710 145 680 170 650Z" ${common}/><path d="M250 440 L280 330 L330 430 L380 320 L420 420" ${common}/><circle cx="500" cy="520" r="16" fill="#172033"/><path d="M470 930 H640" ${dash}/>`,
    crown: `<path d="M125 690 L170 350 L300 520 L400 300 L500 520 L630 350 L675 690Z" ${common}/><circle cx="400" cy="430" r="40" ${common}/><circle cx="260" cy="555" r="30" ${common}/><circle cx="540" cy="555" r="30" ${common}/><path d="M115 790 H685" ${dash}/>`,
    boat: `<path d="M170 650 H650 L565 790 H255Z" ${common}/><path d="M400 250 V650" ${common}/><path d="M400 280 L400 570 L610 570Z" ${common}/><path d="M390 310 L390 540 L220 540Z" ${common}/><path d="M120 890 Q220 830 320 890 T520 890 T720 890" ${common}/><path d="M120 970 Q220 910 320 970 T520 970 T720 970" ${common}/>`,
    flower: `<circle cx="400" cy="550" r="85" ${common}/><ellipse cx="400" cy="350" rx="85" ry="130" ${common}/><ellipse cx="400" cy="750" rx="85" ry="130" ${common}/><ellipse cx="200" cy="550" rx="130" ry="85" ${common}/><ellipse cx="600" cy="550" rx="130" ry="85" ${common}/><ellipse cx="260" cy="405" rx="110" ry="75" transform="rotate(45 260 405)" ${common}/><ellipse cx="540" cy="405" rx="110" ry="75" transform="rotate(-45 540 405)" ${common}/><ellipse cx="260" cy="695" rx="110" ry="75" transform="rotate(-45 260 695)" ${common}/><ellipse cx="540" cy="695" rx="110" ry="75" transform="rotate(45 540 695)" ${common}/>`,
    bunny: `<ellipse cx="400" cy="585" rx="210" ry="260" ${common}/><ellipse cx="300" cy="260" rx="70" ry="180" transform="rotate(-12 300 260)" ${common}/><ellipse cx="500" cy="260" rx="70" ry="180" transform="rotate(12 500 260)" ${common}/><circle cx="330" cy="540" r="18" fill="#172033"/><circle cx="470" cy="540" r="18" fill="#172033"/><path d="M400 585 l-28 30 h56Z" ${common}/><path d="M400 620 Q350 680 300 640 M400 620 Q450 680 500 640" ${common}/><circle cx="205" cy="760" r="65" ${common}/><path d="M250 930 H550" ${dash}/>`,
    robot: `<rect x="260" y="250" width="280" height="230" rx="35" ${common}/><circle cx="335" cy="340" r="28" ${common}/><circle cx="465" cy="340" r="28" ${common}/><path d="M330 420 H470" ${common}/><rect x="220" y="520" width="360" height="320" rx="35" ${common}/><circle cx="400" cy="620" r="55" ${common}/><path d="M220 580 L120 650 L190 710" ${common}/><path d="M580 580 L680 650 L610 710" ${common}/><path d="M310 840 V970 M490 840 V970" ${common}/><circle cx="310" cy="1000" r="50" ${common}/><circle cx="490" cy="1000" r="50" ${common}/>`
  };
  return patterns[kind];
}

function craftSvg(craft: Craft) {
  const title = craft.title.replace(/[&<>]/g, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 800 1120"><rect width="800" height="1120" fill="white"/><text x="55" y="75" font-family="Arial" font-size="25" font-weight="700" fill="#0b3b82">PISIPOUK • A4 CRAFT PATTERN</text><text x="55" y="120" font-family="Arial" font-size="30" font-weight="700" fill="#172033">${title}</text><text x="55" y="155" font-family="Arial" font-size="18" fill="#64748b">Κόψε στις συνεχείς γραμμές • Δίπλωσε/ένωσε στις διακεκομμένες • Πάντα με ενήλικα</text><g transform="translate(0,80) scale(.82)">${patternBody(craft.kind)}</g><text x="400" y="1080" text-anchor="middle" font-family="Arial" font-size="16" fill="#64748b">pisipouk.vercel.app/virtual-preschool</text></svg>`;
}

function downloadTextFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function printSvg(svg: string, title: string) {
  const win = window.open("", "_blank", "noopener,noreferrer");
  if (!win) return;
  win.document.write(`<!doctype html><html><head><title>${title}</title><style>@page{size:A4;margin:0}html,body{margin:0;padding:0}svg{width:210mm;height:297mm;display:block}</style></head><body>${svg}<script>window.onload=()=>setTimeout(()=>window.print(),150)</script></body></html>`);
  win.document.close();
}

function CraftPattern({ craft, compact = false }: { craft: Craft; compact?: boolean }) {
  return (
    <svg viewBox="0 0 800 1120" className={compact ? "h-full w-full" : "h-auto w-full"} aria-label={`Πατρόν ${craft.title}`}>
      <rect width="800" height="1120" rx="34" fill="#fff" />
      <g transform="translate(0,60) scale(.82)" dangerouslySetInnerHTML={{ __html: patternBody(craft.kind) }} />
    </svg>
  );
}

function sceneRegions(scene: ColoringDesign["scene"]) {
  if (scene === "space") {
    return [
      "M300 720 C270 570 300 350 400 220 C500 350 530 570 500 720 Z",
      "M300 590 L190 770 L305 735 Z",
      "M500 590 L610 770 L495 735 Z",
      "M350 720 L400 930 L450 720 Z",
      "M355 420 A45 45 0 1 0 445 420 A45 45 0 1 0 355 420",
      "M120 280 A70 70 0 1 0 260 280 A70 70 0 1 0 120 280",
      "M580 260 A45 45 0 1 0 670 260 A45 45 0 1 0 580 260",
    ];
  }
  if (scene === "ocean") {
    return [
      "M160 540 C270 370 520 370 610 540 C520 710 270 710 160 540 Z",
      "M610 540 L740 405 L710 540 L740 675 Z",
      "M270 455 A25 25 0 1 0 320 455 A25 25 0 1 0 270 455",
      "M170 790 Q260 700 350 790 T530 790 T710 790 L710 930 L170 930 Z",
      "M120 250 C170 200 230 200 280 250 C230 285 170 285 120 250 Z",
      "M500 260 C550 210 610 210 660 260 C610 295 550 295 500 260 Z",
    ];
  }
  if (scene === "farm") {
    return [
      "M160 710 L160 420 L400 250 L640 420 L640 710 Z",
      "M320 710 L320 520 L480 520 L480 710 Z",
      "M205 465 H295 V555 H205 Z",
      "M505 465 H595 V555 H505 Z",
      "M110 820 C180 680 270 680 340 820 Z",
      "M460 820 C530 680 620 680 690 820 Z",
      "M365 175 A35 35 0 1 0 435 175 A35 35 0 1 0 365 175",
    ];
  }
  return [
    "M400 500 C255 220 100 340 210 560 C100 720 260 840 400 620 Z",
    "M400 500 C545 220 700 340 590 560 C700 720 540 840 400 620 Z",
    "M375 430 H425 V720 H375 Z",
    "M190 860 C210 760 300 740 330 860 Z",
    "M470 860 C500 740 590 760 610 860 Z",
    "M255 790 A45 45 0 1 0 345 790 A45 45 0 1 0 255 790",
    "M455 790 A45 45 0 1 0 545 790 A45 45 0 1 0 455 790",
  ];
}

function ColoringCanvas({ design }: { design: ColoringDesign }) {
  const regions = useMemo(() => sceneRegions(design.scene), [design.scene]);
  const [selectedColor, setSelectedColor] = useState(PALETTE[0]);
  const [fills, setFills] = useState<Record<number, string>>({});

  const printable = () => {
    const paths = regions.map((d) => `<path d="${d}" fill="white" stroke="#172033" stroke-width="8" stroke-linejoin="round"/>`).join("");
    return `<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 800 1120"><rect width="800" height="1120" fill="white"/><text x="55" y="80" font-family="Arial" font-size="28" font-weight="700" fill="#172033">Pisipouk • ${design.title}</text><text x="55" y="115" font-family="Arial" font-size="18" fill="#64748b">Χρωμάτισε όπως φαντάζεσαι!</text><g transform="translate(0,80)">${paths}</g><text x="400" y="1080" text-anchor="middle" font-family="Arial" font-size="16" fill="#64748b">pisipouk.vercel.app/virtual-preschool</text></svg>`;
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-xl shadow-sky-100/60">
        <svg viewBox="0 0 800 1040" className="aspect-[4/5] w-full rounded-[1.5rem] bg-gradient-to-b from-sky-50 to-amber-50">
          <defs>
            <filter id="softShadow"><feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".12" /></filter>
          </defs>
          <circle cx="680" cy="120" r="70" fill="#fde68a" opacity=".9" />
          <path d="M0 900 Q180 820 350 900 T800 900 V1040 H0Z" fill="#d9f99d" />
          <g transform="translate(0,15)" filter="url(#softShadow)">
            {regions.map((d, index) => (
              <path
                key={`${design.id}-${index}`}
                d={d}
                fill={fills[index] ?? "#fff"}
                stroke="#172033"
                strokeWidth="8"
                strokeLinejoin="round"
                className="cursor-pointer transition hover:opacity-80"
                onClick={() => setFills((current) => ({ ...current, [index]: selectedColor }))}
              />
            ))}
          </g>
        </svg>
      </div>
      <aside className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Online Coloring</p>
        <h3 className="mt-2 text-xl font-black">{design.emoji} {design.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">Διάλεξε χρώμα και πάτησε πάνω σε κάθε περιοχή της εικόνας.</p>
        <div className="mt-5 grid grid-cols-4 gap-2">
          {PALETTE.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Χρώμα ${color}`}
              onClick={() => setSelectedColor(color)}
              className={`h-10 rounded-xl border-2 transition hover:scale-105 ${selectedColor === color ? "border-white ring-2 ring-white/30" : "border-transparent"}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="mt-5 grid gap-2">
          <button type="button" onClick={() => setFills({})} className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold hover:bg-white/15"><RotateCcw className="h-4 w-4" /> Καθάρισμα</button>
          <button type="button" onClick={() => { printSvg(printable(), design.title); track("preschool_coloring_print", { design: design.id }); }} className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 hover:bg-cyan-300"><Printer className="h-4 w-4" /> Εκτύπωση A4</button>
          <button type="button" onClick={() => { downloadTextFile(printable(), `${design.id}-pisipouk-a4.svg`, "image/svg+xml"); track("preschool_coloring_download", { design: design.id }); }} className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-950 hover:bg-slate-100"><Download className="h-4 w-4" /> A4 αρχείο HD</button>
        </div>
      </aside>
    </div>
  );
}

function GameArena({ game }: { game: Game }) {
  const [answer, setAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const correct = answer === game.correct;

  const choose = (index: number) => {
    setAnswer(index);
    if (index === game.correct) {
      setScore((value) => value + 1);
      track("preschool_game_complete", { game: game.id, correct: true });
    } else {
      track("preschool_game_attempt", { game: game.id, correct: false });
    }
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-violet-100 bg-white shadow-2xl shadow-violet-100/60">
      <div className="bg-[radial-gradient(circle_at_top_left,#8b5cf6,#312e81_52%,#111827)] p-6 text-white md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-violet-200">Παίζω • Μαθαίνω • Ξαναπαίζω</p>
            <h3 className="mt-2 text-2xl font-black md:text-3xl">{game.emoji} {game.title}</h3>
            <p className="mt-1 text-violet-100">{game.subtitle} • {game.skill}</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-center backdrop-blur"><div className="text-xs text-violet-200">Μπράβο!</div><div className="text-xl font-black">{score} ⭐</div></div>
        </div>
      </div>
      <div className="p-6 md:p-8">
        <div className="rounded-3xl bg-amber-50 p-6 text-center text-2xl font-black text-slate-900 md:text-3xl">{game.question}</div>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {game.options.map((option, index) => {
            const isChosen = answer === index;
            const state = answer !== null && index === game.correct ? "border-emerald-400 bg-emerald-50" : isChosen ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50";
            return (
              <button key={`${game.id}-${option}-${index}`} type="button" onClick={() => choose(index)} className={`min-h-24 rounded-3xl border-2 p-4 text-3xl font-black text-slate-900 transition hover:-translate-y-1 ${state}`}>{option}</button>
            );
          })}
        </div>
        {answer !== null && (
          <div className={`mt-5 flex items-center justify-between gap-4 rounded-2xl p-4 ${correct ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>
            <div className="flex items-center gap-3 font-bold">{correct ? <CheckCircle2 className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />} {correct ? "Μπράβο! Το βρήκες!" : "Καλή προσπάθεια — δοκίμασε άλλη επιλογή."}</div>
            <button type="button" onClick={() => setAnswer(null)} className="rounded-xl bg-white px-4 py-2 text-sm font-black shadow-sm">Ξανά</button>
          </div>
        )}
      </div>
    </div>
  );
}

function VirtualPreschool() {
  const [age, setAge] = useState<Age>("4–5");
  const [activeGameId, setActiveGameId] = useState(GAMES[2].id);
  const [activeColoringId, setActiveColoringId] = useState(COLORING[2].id);
  const [craftFilter, setCraftFilter] = useState<"all" | Age>("all");
  const theme = THEMES[Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7)) % THEMES.length];
  const activeGame = GAMES.find((game) => game.id === activeGameId) ?? GAMES[0];
  const activeColoring = COLORING.find((item) => item.id === activeColoringId) ?? COLORING[0];
  const filteredCrafts = craftFilter === "all" ? CRAFTS : CRAFTS.filter((craft) => craft.age === craftFilter);
  const daily = [
    { icon: "👋", title: "Πρωινός κύκλος", note: "2 λεπτά", text: "Πες το όνομά σου, τον καιρό και ένα πράγμα που σε κάνει χαρούμενο.", href: "#daily" },
    { icon: "🎮", title: "Παιχνίδι της ημέρας", note: "5 λεπτά", text: activeGame.title, href: "#games" },
    { icon: "🖍️", title: "Ζωγραφίζω", note: "10 λεπτά", text: activeColoring.title, href: "#coloring" },
    { icon: "✂️", title: "Χειροτεχνία", note: "15–25 λεπτά", text: CRAFTS.find((craft) => craft.age === age)?.title ?? CRAFTS[0].title, href: "#crafts" },
  ];

  return (
    <SiteLayout>
      <div className="overflow-hidden bg-[#fffdf7] text-slate-900">
        <section className="relative isolate overflow-hidden border-b border-amber-100">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_20%,#fce7f3_0,transparent_30%),radial-gradient(circle_at_80%_10%,#cffafe_0,transparent_30%),radial-gradient(circle_at_70%_80%,#fef3c7_0,transparent_34%),linear-gradient(#fffdf7,#ffffff)]" />
          <div className="absolute left-[7%] top-20 -z-10 h-24 w-24 rotate-12 rounded-[2rem] bg-pink-300/45 blur-[1px]" />
          <div className="absolute right-[9%] top-28 -z-10 h-20 w-20 rounded-full bg-cyan-300/45" />
          <div className="absolute bottom-16 left-[44%] -z-10 h-28 w-28 rounded-full bg-amber-300/35" />
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:py-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-violet-700 shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4" /> Pisipouk Virtual Preschool+
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-5xl md:text-6xl lg:text-7xl">
                Κάθε μέρα μια νέα
                <span className="block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">μικρή περιπέτεια μάθησης.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">Παιχνίδια που παίζονται, ζωγραφιές που χρωματίζονται online, πραγματικά A4 πατρόν και οδηγίες χειροτεχνίας — φτιαγμένα για παιδιά 2–6 και γονείς που θέλουν ποιοτικό δημιουργικό χρόνο.</p>
              <div className="mt-7 flex flex-wrap gap-3 text-sm font-bold text-slate-600">
                <span className="rounded-full bg-white px-4 py-2 shadow-sm">✓ Χωρίς εγκατάσταση</span>
                <span className="rounded-full bg-white px-4 py-2 shadow-sm">✓ HD vector γραφικά</span>
                <span className="rounded-full bg-white px-4 py-2 shadow-sm">✓ A4 printables</span>
                <span className="rounded-full bg-white px-4 py-2 shadow-sm">✓ Νέο θέμα κάθε εβδομάδα</span>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#daily" onClick={() => track("preschool_hero_start")} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-violet-700">Ξεκίνα το σημερινό πρόγραμμα <ArrowRight className="h-5 w-5" /></a>
                <a href="#crafts" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-black text-slate-900 shadow-sm transition hover:-translate-y-1"><Printer className="h-5 w-5" /> Εκτύπωσε A4 δραστηριότητα</a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -left-5 top-6 z-20 rotate-[-8deg] rounded-2xl bg-amber-300 px-4 py-3 text-sm font-black shadow-lg">ΝΕΟ ΚΑΘΕ ΕΒΔΟΜΑΔΑ ✨</div>
              <div className="relative overflow-hidden rounded-[3rem] border-[8px] border-white bg-gradient-to-br from-sky-300 via-cyan-100 to-amber-100 p-6 shadow-2xl shadow-violet-200/60 md:p-8">
                <div className="absolute right-8 top-8 h-24 w-24 rounded-full bg-amber-300 shadow-[0_0_60px_rgba(251,191,36,.45)]" />
                <div className="relative mt-20 rounded-[2.2rem] bg-white/80 p-5 shadow-xl backdrop-blur md:p-7">
                  <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-violet-600">Theme of the week</p><h2 className="mt-1 text-2xl font-black md:text-3xl">{theme.emoji} {theme.title}</h2></div><div className="rounded-2xl bg-violet-100 px-3 py-2 text-center text-xs font-black text-violet-700">4<br/>δραστηριότητες</div></div>
                  <div className="mt-5 grid grid-cols-4 gap-2">
                    {["🎮", "🎨", "✂️", "📚"].map((icon) => <div key={icon} className="grid aspect-square place-items-center rounded-2xl bg-white text-3xl shadow-sm">{icon}</div>)}
                  </div>
                  <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-900">💡 Για γονείς: {theme.tip}</div>
                </div>
                <div className="relative mt-5 flex items-end justify-around">
                  <div className="text-7xl drop-shadow-lg md:text-8xl">🦊</div><div className="-mb-1 text-8xl drop-shadow-lg md:text-9xl">🧒</div><div className="text-7xl drop-shadow-lg md:text-8xl">🐻</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-white py-7">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div><p className="text-sm font-black text-violet-700">Προσωποποίησε τη δυσκολία</p><h2 className="text-xl font-black">Για ποια ηλικία παίζουμε σήμερα;</h2></div>
              <div className="grid gap-2 sm:grid-cols-3">
                {AGES.map((item) => <button key={item.id} type="button" onClick={() => { setAge(item.id); track("preschool_age_select", { age: item.id }); }} className={`rounded-2xl border px-4 py-3 text-left transition ${age === item.id ? "border-violet-500 bg-violet-50 shadow-md" : "border-slate-200 bg-white hover:border-violet-200"}`}><div className="font-black">{item.emoji} {item.label}</div><div className="mt-1 text-xs text-slate-500">{item.note}</div></button>)}
              </div>
            </div>
          </div>
        </section>

        <section id="daily" className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div><div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-black text-amber-900"><CalendarDays className="h-4 w-4" /> ΣΗΜΕΡΙΝΗ ΡΟΥΤΙΝΑ</div><h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">20–40 λεπτά δημιουργικού χρόνου.</h2><p className="mt-3 max-w-2xl text-slate-600">Μια καθαρή καθημερινή διαδρομή ώστε ο γονιός να μη χρειάζεται να ψάχνει τι θα κάνει το παιδί.</p></div>
              <div className="rounded-2xl bg-white px-5 py-4 text-sm font-bold text-slate-600 shadow-sm"><Clock3 className="mr-2 inline h-4 w-4 text-violet-600" /> Προσαρμόζεται στην ηλικία {age}</div>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {daily.map((item, index) => <a key={item.title} href={item.href} className="group rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="flex items-center justify-between"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-50 to-amber-50 text-3xl">{item.icon}</div><span className="text-xs font-black text-slate-400">0{index + 1}</span></div><h3 className="mt-5 text-xl font-black">{item.title}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{item.text}</p><div className="mt-4 flex items-center justify-between text-xs font-black text-violet-700"><span>{item.note}</span><ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></div></a>)}
            </div>
          </div>
        </section>

        <section id="games" className="bg-gradient-to-b from-violet-50/70 to-white py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="max-w-3xl"><div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-black text-violet-800"><Gamepad2 className="h-4 w-4" /> PLAY LAB</div><h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">8 μικρά παιχνίδια. Πραγματικά playable.</h2><p className="mt-3 text-slate-600">Σύντομοι γύροι, μεγάλα tap targets, άμεσο feedback και δυνατότητα επανάληψης χωρίς φόρτωση άλλης εφαρμογής.</p></div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {GAMES.map((game) => <button key={game.id} type="button" onClick={() => { setActiveGameId(game.id); track("preschool_game_open", { game: game.id }); }} className={`rounded-[1.7rem] border p-4 text-left transition hover:-translate-y-1 ${activeGameId === game.id ? "border-violet-500 bg-white shadow-xl shadow-violet-100" : "border-violet-100 bg-white/80"}`}><div className="text-3xl">{game.emoji}</div><div className="mt-3 font-black">{game.title}</div><div className="mt-1 text-xs text-slate-500">{game.age} • {game.skill}</div></button>)}
            </div>
            <div className="mt-6"><GameArena key={activeGame.id} game={activeGame} /></div>
          </div>
        </section>

        <section id="coloring" className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl"><div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1.5 text-xs font-black text-cyan-900"><Palette className="h-4 w-4" /> COLORING STUDIO</div><h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">Ζωγραφίζω στην οθόνη ή εκτυπώνω A4.</h2><p className="mt-3 text-slate-600">Vector γραμμές που μένουν καθαρές σε κινητό, tablet και εκτύπωση. Χωρίς pixelated clip-art.</p></div>
              <div className="flex max-w-full gap-2 overflow-x-auto pb-2">{COLORING.map((item) => <button key={item.id} type="button" onClick={() => setActiveColoringId(item.id)} className={`shrink-0 rounded-2xl border px-4 py-3 text-sm font-black ${activeColoringId === item.id ? "border-cyan-500 bg-cyan-50" : "border-slate-200 bg-white"}`}>{item.emoji} {item.title}</button>)}</div>
            </div>
            <div className="mt-8"><ColoringCanvas key={activeColoring.id} design={activeColoring} /></div>
          </div>
        </section>

        <section id="crafts" className="bg-[#f8fafc] py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl"><div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1.5 text-xs font-black text-rose-900"><Scissors className="h-4 w-4" /> CRAFT STUDIO</div><h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">Όχι “ιδέες”. Πραγματικά A4 πατρόν.</h2><p className="mt-3 text-slate-600">Κάθε χειροτεχνία έχει print-ready vector πατρόν, υλικά, χρόνο, δεξιότητα και οδηγίες βήμα-βήμα.</p></div>
              <div className="flex gap-2 overflow-x-auto pb-2"><button type="button" onClick={() => setCraftFilter("all")} className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${craftFilter === "all" ? "bg-slate-950 text-white" : "bg-white"}`}>Όλα</button>{AGES.map((item) => <button key={item.id} type="button" onClick={() => setCraftFilter(item.id)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${craftFilter === item.id ? "bg-slate-950 text-white" : "bg-white"}`}>{item.label}</button>)}</div>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredCrafts.map((craft) => {
                const svg = craftSvg(craft);
                return <article key={craft.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="grid h-64 place-items-center overflow-hidden bg-gradient-to-br from-rose-50 via-white to-amber-50 p-4"><CraftPattern craft={craft} compact /></div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3"><div><div className="text-xs font-black uppercase tracking-[0.16em] text-rose-600">{craft.age} • {craft.minutes}′ • {craft.level}</div><h3 className="mt-2 text-xl font-black">{craft.title}</h3></div><div className="rounded-2xl bg-amber-100 p-2.5 text-amber-900"><Star className="h-5 w-5" /></div></div>
                    <div className="mt-4 rounded-2xl bg-slate-50 p-4"><div className="text-xs font-black text-slate-500">ΤΙ ΚΑΛΛΙΕΡΓΕΙ</div><div className="mt-1 font-bold">{craft.skill}</div></div>
                    <details className="mt-4 rounded-2xl border border-slate-200 p-4"><summary className="cursor-pointer font-black">Υλικά & οδηγίες</summary><div className="mt-3 text-sm leading-6 text-slate-600"><strong className="text-slate-900">Υλικά:</strong> {craft.materials.join(", ")}.<ol className="mt-2 list-decimal space-y-1 pl-5">{craft.steps.map((step) => <li key={step}>{step}</li>)}</ol></div></details>
                    <div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => { printSvg(svg, craft.title); track("preschool_craft_print", { craft: craft.id }); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-3 text-sm font-black text-white hover:bg-slate-800"><Printer className="h-4 w-4" /> Εκτύπωση A4</button><button type="button" onClick={() => { downloadTextFile(svg, `${craft.id}-pisipouk-a4.svg`, "image/svg+xml"); track("preschool_craft_download", { craft: craft.id }); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-100 px-3 py-3 text-sm font-black text-rose-900 hover:bg-rose-200"><Download className="h-4 w-4" /> HD Πατρόν</button></div>
                  </div>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section id="parents" className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="overflow-hidden rounded-[2.8rem] bg-slate-950 text-white shadow-2xl">
              <div className="grid gap-0 lg:grid-cols-[1.05fr_.95fr]">
                <div className="p-7 md:p-10 lg:p-12"><div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-cyan-200"><Users className="h-4 w-4" /> PARENT ZONE</div><h2 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">Ο γονιός ξέρει πάντα τι κάνουμε — και γιατί.</h2><p className="mt-4 max-w-xl leading-7 text-slate-300">Στόχος δεν είναι περισσότερος παθητικός χρόνος οθόνης. Είναι μια μικρή ψηφιακή αφετηρία που οδηγεί σε χέρια, χαρτί, κουβέντα, κίνηση και δημιουργία.</p><div className="mt-7 grid gap-3 sm:grid-cols-2">{[
                  ["🧠", "Τι καλλιεργεί", "Κάθε δραστηριότητα έχει ξεκάθαρο skill focus."],
                  ["⏱️", "Πόσο κρατά", "Μικρά blocks 5–25 λεπτών για εύκολη ρουτίνα."],
                  ["🖨️", "Τι εκτυπώνω", "A4 vector assets με καθαρές γραμμές."],
                  ["🏡", "Τι κάνω offline", "Κάθε θέμα συνεχίζεται στο σπίτι χωρίς οθόνη."],
                ].map(([emoji, title, text]) => <div key={title} className="rounded-2xl bg-white/7 p-4"><div className="text-2xl">{emoji}</div><div className="mt-2 font-black">{title}</div><div className="mt-1 text-sm leading-6 text-slate-400">{text}</div></div>)}</div></div>
                <div className="bg-gradient-to-br from-cyan-300 via-emerald-200 to-amber-200 p-7 text-slate-950 md:p-10 lg:p-12"><p className="text-xs font-black uppercase tracking-[0.22em] text-slate-700">Weekly Parent Pack</p><h3 className="mt-3 text-3xl font-black">Το πακέτο αυτής της εβδομάδας</h3><div className="mt-6 space-y-3">{["1 A4 craft pattern", "2 printable coloring pages", "1 μικρό παιχνίδι λογικής", "1 offline family activity", "1 σύντομη parent tip"].map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 font-bold"><Check className="h-5 w-5 text-emerald-700" /> {item}</div>)}</div><button type="button" onClick={() => { document.getElementById("crafts")?.scrollIntoView({ behavior: "smooth" }); track("preschool_weekly_pack_start"); }} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 font-black text-white hover:bg-violet-800"><Download className="h-5 w-5" /> Φτιάξε το δικό σου pack τώρα</button></div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20 pt-4 md:pb-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-6"><ShieldCheck className="h-8 w-8 text-emerald-700" /><h3 className="mt-4 text-xl font-black">Child-first σχεδιασμός</h3><p className="mt-2 text-sm leading-6 text-emerald-950/70">Μεγάλα στοιχεία, ήρεμη πλοήγηση, σύντομες δραστηριότητες και παρουσία ενήλικα στις κατασκευές.</p></div>
              <div className="rounded-[2rem] border border-violet-100 bg-violet-50 p-6"><Trophy className="h-8 w-8 text-violet-700" /><h3 className="mt-4 text-xl font-black">Μάθηση που μοιάζει με παιχνίδι</h3><p className="mt-2 text-sm leading-6 text-violet-950/70">Χρώματα, αριθμοί, γλώσσα, λογική, παρατήρηση και συναισθήματα μέσα από μικρές νίκες.</p></div>
              <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-6"><Heart className="h-8 w-8 text-rose-700" /><h3 className="mt-4 text-xl font-black">Από το online στο μαζί</h3><p className="mt-2 text-sm leading-6 text-rose-950/70">Η εμπειρία σχεδιάζεται ώστε να συνεχίζεται με ζωγραφική, κόψιμο, κουβέντα και παιχνίδι εκτός οθόνης.</p></div>
            </div>
            <div className="mt-8 overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-violet-700 via-fuchsia-600 to-orange-500 p-7 text-white shadow-2xl md:p-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-sm font-black uppercase tracking-[0.18em] text-white/75">Γνώρισε και τον πραγματικό Πισιπούκ</p><h2 className="mt-2 text-3xl font-black md:text-4xl">Σου άρεσε ο τρόπος που μαθαίνουμε;</h2><p className="mt-2 max-w-2xl text-white/85">Κλείσε επίσκεψη και γνώρισε τον χώρο, την ομάδα και την καθημερινότητά μας από κοντά.</p></div><div className="flex flex-col gap-3 sm:flex-row"><a href="/book-visit" onClick={() => track("preschool_book_visit")} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-slate-950 shadow-xl">Κλείσε επίσκεψη <ArrowRight className="h-5 w-5" /></a><a href="/contact" className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-6 py-4 font-black text-white backdrop-blur">Ρώτησέ μας</a></div></div>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
