import { useEffect, useMemo, useState } from "react";
import { RotateCcw, Star, Trophy } from "lucide-react";
import { trackEvent } from "@/lib/pisipoukApi";
import type { PreschoolAge } from "@/content/virtualPreschoolMedia";

type Theme = "Χρώματα & Σχήματα" | "Αριθμοί" | "Γλώσσα" | "Συναισθήματα" | "Φύση" | "Κατασκευές" | "Μουσική & Ρυθμός" | "Καθημερινή ζωή";

type GameBase = {
  id: string;
  title: string;
  emoji: string;
  ages: PreschoolAge[];
  minutes: number;
  theme: Theme;
  skill: string;
  instruction: string;
  offlineMission: string;
};

type ChoiceGame = GameBase & {
  mechanic: "choice";
  prompt: string;
  choices: { label: string; correct?: boolean }[];
  reward: string;
};

type PatternGame = GameBase & {
  mechanic: "pattern";
  sequence: string[];
  options: string[];
  correct: string;
  reward: string;
};

type SequenceGame = GameBase & {
  mechanic: "sequence";
  steps: string[];
  reward: string;
};

type SortGame = GameBase & {
  mechanic: "sort";
  bins: { id: string; label: string; emoji: string }[];
  items: { id: string; label: string; emoji: string; bin: string }[];
  reward: string;
};

type MemoryGame = GameBase & {
  mechanic: "memory";
  pairs: { id: string; label: string; emoji: string }[];
  reward: string;
};

type Game = ChoiceGame | PatternGame | SequenceGame | SortGame | MemoryGame;

type MemoryCard = { key: string; pairId: string; emoji: string };

const GAMES: Game[] = [
  {
    id: "color-baskets",
    title: "Τα καλάθια των χρωμάτων",
    emoji: "🧺",
    ages: ["2–3"],
    minutes: 4,
    theme: "Χρώματα & Σχήματα",
    skill: "Αναγνώριση χρωμάτων & ταξινόμηση",
    instruction: "Πάτησε ένα αντικείμενο και μετά το καλάθι με το ίδιο χρώμα.",
    offlineMission: "Βρείτε στο σπίτι 3 κόκκινα και 3 μπλε αντικείμενα.",
    mechanic: "sort",
    bins: [
      { id: "red", label: "Κόκκινο", emoji: "🟥" },
      { id: "blue", label: "Μπλε", emoji: "🟦" },
      { id: "yellow", label: "Κίτρινο", emoji: "🟨" },
    ],
    items: [
      { id: "apple", label: "Μήλο", emoji: "🍎", bin: "red" },
      { id: "ball", label: "Μπάλα", emoji: "🔵", bin: "blue" },
      { id: "sun", label: "Ήλιος", emoji: "🌞", bin: "yellow" },
      { id: "heart", label: "Καρδιά", emoji: "❤️", bin: "red" },
      { id: "fish", label: "Ψαράκι", emoji: "🐟", bin: "blue" },
      { id: "star", label: "Αστέρι", emoji: "⭐", bin: "yellow" },
    ],
    reward: "Ταξινόμησες όλα τα χρώματα!",
  },
  {
    id: "shape-home",
    title: "Ποιο σχήμα λείπει;",
    emoji: "🔺",
    ages: ["2–3"],
    minutes: 3,
    theme: "Χρώματα & Σχήματα",
    skill: "Οπτική διάκριση σχημάτων",
    instruction: "Κοίτα την τρύπα και βρες ποιο σχήμα ταιριάζει.",
    offlineMission: "Βρείτε έναν κύκλο και ένα τετράγωνο στο δωμάτιο.",
    mechanic: "choice",
    prompt: "Η τρύπα είναι στρογγυλή. Τι βάζουμε μέσα;",
    choices: [{ label: "🔵 Κύκλο", correct: true }, { label: "🔺 Τρίγωνο" }, { label: "🟥 Τετράγωνο" }],
    reward: "Ο κύκλος δεν έχει γωνίες — μπράβο!",
  },
  {
    id: "big-small",
    title: "Μεγάλο ή μικρό;",
    emoji: "🐘",
    ages: ["2–3"],
    minutes: 3,
    theme: "Καθημερινή ζωή",
    skill: "Σύγκριση μεγέθους",
    instruction: "Διάλεξε ποιο είναι μεγαλύτερο.",
    offlineMission: "Βρείτε ένα μεγάλο και ένα μικρό κουτάλι.",
    mechanic: "choice",
    prompt: "Ποιο είναι μεγαλύτερο;",
    choices: [{ label: "🐘 Ελέφαντας", correct: true }, { label: "🐭 Ποντίκι" }],
    reward: "Σωστά — ο ελέφαντας είναι μεγαλύτερος!",
  },
  {
    id: "count-three",
    title: "Μετράω ως το 3",
    emoji: "🍓",
    ages: ["2–3"],
    minutes: 3,
    theme: "Αριθμοί",
    skill: "Πρώιμη αρίθμηση",
    instruction: "Άγγιξε τον αριθμό που δείχνει πόσα αντικείμενα βλέπεις.",
    offlineMission: "Βάλτε 3 τουβλάκια στη σειρά και μετρήστε τα δυνατά.",
    mechanic: "choice",
    prompt: "🍓 🍓 🍓 — πόσες φράουλες είναι;",
    choices: [{ label: "2" }, { label: "3", correct: true }, { label: "4" }],
    reward: "Τρία! Δείξε 3 δάχτυλα.",
  },
  {
    id: "toy-cleanup",
    title: "Ώρα για συμμάζεμα",
    emoji: "🧸",
    ages: ["2–3"],
    minutes: 4,
    theme: "Καθημερινή ζωή",
    skill: "Ρουτίνα & κατηγοριοποίηση",
    instruction: "Βάλε κάθε πράγμα στη σωστή θέση.",
    offlineMission: "Μαζέψτε μαζί 5 παιχνίδια πριν τελειώσει ένα τραγούδι.",
    mechanic: "sort",
    bins: [
      { id: "toy", label: "Παιχνίδια", emoji: "🧸" },
      { id: "book", label: "Βιβλία", emoji: "📚" },
    ],
    items: [
      { id: "bear", label: "Αρκουδάκι", emoji: "🧸", bin: "toy" },
      { id: "blocks", label: "Τουβλάκια", emoji: "🧱", bin: "toy" },
      { id: "book1", label: "Παραμύθι", emoji: "📕", bin: "book" },
      { id: "book2", label: "Βιβλίο", emoji: "📗", bin: "book" },
    ],
    reward: "Το δωμάτιο είναι τακτοποιημένο!",
  },
  {
    id: "animal-memory",
    title: "Μνήμη ζωάκια",
    emoji: "🐼",
    ages: ["2–3", "4–5"],
    minutes: 5,
    theme: "Φύση",
    skill: "Μνήμη εργασίας & παρατήρηση",
    instruction: "Γύρισε δύο κάρτες και βρες τα ίδια ζωάκια.",
    offlineMission: "Παίξτε “τι λείπει;” με 3 πραγματικά παιχνίδια.",
    mechanic: "memory",
    pairs: [
      { id: "lion", label: "Λιοντάρι", emoji: "🦁" },
      { id: "frog", label: "Βάτραχος", emoji: "🐸" },
      { id: "fox", label: "Αλεπού", emoji: "🦊" },
    ],
    reward: "Βρήκες όλα τα ζευγάρια!",
  },
  {
    id: "garden-pattern",
    title: "Συνέχισε το μοτίβο",
    emoji: "🌼",
    ages: ["4–5"],
    minutes: 4,
    theme: "Χρώματα & Σχήματα",
    skill: "Μοτίβα & πρόβλεψη",
    instruction: "Βρες τι έρχεται μετά.",
    offlineMission: "Φτιάξτε μοτίβο με κουτάλια και πιρούνια: κουτάλι–πιρούνι–κουτάλι…",
    mechanic: "pattern",
    sequence: ["🌼", "🌷", "🌼", "🌷"],
    options: ["🌼", "🌿", "⭐"],
    correct: "🌼",
    reward: "Το μοτίβο συνεχίζεται σωστά!",
  },
  {
    id: "emotion-match",
    title: "Βρες το συναίσθημα",
    emoji: "😊",
    ages: ["4–5"],
    minutes: 4,
    theme: "Συναισθήματα",
    skill: "Αναγνώριση συναισθημάτων",
    instruction: "Διάλεξε το πρόσωπο που ταιριάζει στην ιστορία.",
    offlineMission: "Κάντε 3 γκριμάτσες και μαντέψτε ο ένας το συναίσθημα του άλλου.",
    mechanic: "choice",
    prompt: "Η Μαρία βρήκε το αγαπημένο της παιχνίδι. Πώς νιώθει;",
    choices: [{ label: "😊 Χαρούμενη", correct: true }, { label: "😢 Λυπημένη" }, { label: "😠 Θυμωμένη" }],
    reward: "Ναι — μάλλον νιώθει χαρά!",
  },
  {
    id: "seed-story",
    title: "Από τον σπόρο στο λουλούδι",
    emoji: "🌱",
    ages: ["4–5"],
    minutes: 5,
    theme: "Φύση",
    skill: "Ακολουθία γεγονότων",
    instruction: "Πάτησε τις εικόνες με τη σωστή σειρά.",
    offlineMission: "Φυτέψτε έναν φακό σε βαμβάκι και παρατηρήστε τον κάθε μέρα.",
    mechanic: "sequence",
    steps: ["🌰 Σπόρος", "💧 Νερό", "🌱 Βλαστός", "🌻 Λουλούδι"],
    reward: "Έφτιαξες ολόκληρο τον κύκλο ανάπτυξης!",
  },
  {
    id: "habitat-sort",
    title: "Πού ζει το ζωάκι;",
    emoji: "🐳",
    ages: ["4–5"],
    minutes: 5,
    theme: "Φύση",
    skill: "Κατηγοριοποίηση & φυσικός κόσμος",
    instruction: "Διάλεξε ζωάκι και μετά το σωστό σπίτι.",
    offlineMission: "Διαλέξτε ένα ζώο και φτιάξτε με μαξιλάρια το “σπίτι” του.",
    mechanic: "sort",
    bins: [
      { id: "sea", label: "Θάλασσα", emoji: "🌊" },
      { id: "land", label: "Στεριά", emoji: "🌳" },
    ],
    items: [
      { id: "whale", label: "Φάλαινα", emoji: "🐳", bin: "sea" },
      { id: "fish", label: "Ψάρι", emoji: "🐠", bin: "sea" },
      { id: "lion", label: "Λιοντάρι", emoji: "🦁", bin: "land" },
      { id: "rabbit", label: "Λαγός", emoji: "🐇", bin: "land" },
    ],
    reward: "Όλα τα ζωάκια βρήκαν το σπίτι τους!",
  },
  {
    id: "count-eight",
    title: "Μέτρα τους πλανήτες",
    emoji: "🪐",
    ages: ["4–5"],
    minutes: 4,
    theme: "Αριθμοί",
    skill: "Αντιστοίχιση ποσότητας–αριθμού",
    instruction: "Μέτρα και διάλεξε.",
    offlineMission: "Μετρήστε 8 μικρά αντικείμενα και χωρίστε τα σε δύο ομάδες.",
    mechanic: "choice",
    prompt: "🪐 🪐 🪐 🪐 🪐 🪐 — πόσοι πλανήτες;",
    choices: [{ label: "5" }, { label: "6", correct: true }, { label: "7" }],
    reward: "Έξι πλανήτες — τέλεια μέτρηση!",
  },
  {
    id: "rhythm-copy",
    title: "Χτύπα τον ρυθμό",
    emoji: "🥁",
    ages: ["4–5", "5–6"],
    minutes: 4,
    theme: "Μουσική & Ρυθμός",
    skill: "Ακουστική μνήμη & μοτίβα",
    instruction: "Δες το ρυθμικό μοτίβο και βρες τι έρχεται μετά.",
    offlineMission: "Χτυπήστε παλαμάκια–γόνατα–παλαμάκια–γόνατα για 20 δευτερόλεπτα.",
    mechanic: "pattern",
    sequence: ["👏", "🦵", "👏", "🦵"],
    options: ["👏", "🦶", "🤫"],
    correct: "👏",
    reward: "Κράτησες σωστά τον ρυθμό!",
  },
  {
    id: "rocket-build",
    title: "Χτίζω τον πύραυλο",
    emoji: "🚀",
    ages: ["5–6"],
    minutes: 6,
    theme: "Κατασκευές",
    skill: "Σειρά, λογική & χωρική σκέψη",
    instruction: "Πάτησε τα κομμάτια με τη σειρά που χρειάζονται για να απογειωθεί ο πύραυλος.",
    offlineMission: "Φτιάξτε πύραυλο με 4 γεωμετρικά σχήματα από χαρτί.",
    mechanic: "sequence",
    steps: ["⬜ Σώμα", "🔵 Παράθυρο", "🔺 Μύτη", "🪽 Πτερύγια", "🔥 Φλόγα"],
    reward: "3…2…1… απογείωση!",
  },
  {
    id: "number-bonds",
    title: "Μικρές προσθέσεις",
    emoji: "➕",
    ages: ["5–6"],
    minutes: 5,
    theme: "Αριθμοί",
    skill: "Αριθμητική σκέψη",
    instruction: "Χρησιμοποίησε τα αντικείμενα για να βρεις το σύνολο.",
    offlineMission: "Βάλτε 2 κουμπιά και άλλα 3. Μετρήστε πόσα έγιναν όλα μαζί.",
    mechanic: "choice",
    prompt: "⭐⭐ + ⭐⭐⭐ = ?",
    choices: [{ label: "4" }, { label: "5", correct: true }, { label: "6" }],
    reward: "2 και 3 κάνουν 5!",
  },
  {
    id: "letter-start",
    title: "Με ποιο γράμμα αρχίζει;",
    emoji: "🔤",
    ages: ["5–6"],
    minutes: 5,
    theme: "Γλώσσα",
    skill: "Φωνολογική επίγνωση",
    instruction: "Πες τη λέξη αργά και άκου τον πρώτο ήχο.",
    offlineMission: "Βρείτε 3 πράγματα στο σπίτι που αρχίζουν από Μ.",
    mechanic: "choice",
    prompt: "🍎 ΜΗΛΟ — ποιο είναι το πρώτο γράμμα;",
    choices: [{ label: "Μ", correct: true }, { label: "Λ" }, { label: "Ο" }],
    reward: "Μμμ… Μ όπως Μήλο!",
  },
  {
    id: "rhyme-pairs",
    title: "Ποια λέξη κάνει ρίμα;",
    emoji: "🎤",
    ages: ["5–6"],
    minutes: 5,
    theme: "Γλώσσα",
    skill: "Ρίμα & ακουστική διάκριση",
    instruction: "Άκου τις καταλήξεις των λέξεων.",
    offlineMission: "Βρείτε μαζί δύο αστείες λέξεις που τελειώνουν παρόμοια.",
    mechanic: "choice",
    prompt: "Ποια λέξη ταιριάζει καλύτερα ηχητικά με “γάτα”;",
    choices: [{ label: "πατάτα", correct: true }, { label: "μήλο" }, { label: "σπίτι" }],
    reward: "Γάτα–πατάτα: άκου πόσο μοιάζει το τέλος!",
  },
  {
    id: "day-sequence",
    title: "Η σειρά της ημέρας",
    emoji: "🌅",
    ages: ["5–6"],
    minutes: 5,
    theme: "Καθημερινή ζωή",
    skill: "Χρονική ακολουθία",
    instruction: "Βάλε τις στιγμές στη φυσική σειρά μιας ημέρας.",
    offlineMission: "Πείτε μαζί 3 πράγματα που κάνετε πριν φύγετε για το σχολείο.",
    mechanic: "sequence",
    steps: ["🌅 Ξυπνάω", "🥣 Τρώω πρωινό", "🎒 Ετοιμάζομαι", "🌙 Κοιμάμαι"],
    reward: "Έβαλες τη μέρα σε σωστή σειρά!",
  },
  {
    id: "kind-choice",
    title: "Τι θα έκανε ένας καλός φίλος;",
    emoji: "💛",
    ages: ["5–6"],
    minutes: 5,
    theme: "Συναισθήματα",
    skill: "Κοινωνική επίλυση προβλήματος",
    instruction: "Διάλεξε την πιο βοηθητική πράξη.",
    offlineMission: "Σκεφτείτε μία καλή πράξη που μπορείτε να κάνετε σήμερα για κάποιον.",
    mechanic: "choice",
    prompt: "Ένα παιδί έριξε τα τουβλάκια του. Τι κάνουμε;",
    choices: [{ label: "🤝 Βοηθάμε να τα μαζέψει", correct: true }, { label: "😂 Γελάμε" }, { label: "🚪 Φεύγουμε" }],
    reward: "Η βοήθεια και η καλοσύνη δυναμώνουν την ομάδα!",
  },
  {
    id: "space-memory",
    title: "Μνήμη διαστήματος",
    emoji: "🌌",
    ages: ["5–6"],
    minutes: 6,
    theme: "Κατασκευές",
    skill: "Μνήμη εργασίας & συγκέντρωση",
    instruction: "Βρες τα ίδια σύμβολα του διαστήματος.",
    offlineMission: "Κλείστε τα μάτια, ακούστε 3 αντικείμενα που λέει ο γονιός και επαναλάβετε τα με τη σειρά.",
    mechanic: "memory",
    pairs: [
      { id: "rocket", label: "Πύραυλος", emoji: "🚀" },
      { id: "planet", label: "Πλανήτης", emoji: "🪐" },
      { id: "star", label: "Αστέρι", emoji: "⭐" },
      { id: "alien", label: "Εξωγήινος", emoji: "👽" },
    ],
    reward: "Αποστολή μνήμης ολοκληρώθηκε!",
  },
];

const THEME_STYLE: Record<Theme, string> = {
  "Χρώματα & Σχήματα": "from-pink-400 to-orange-300",
  "Αριθμοί": "from-blue-500 to-cyan-300",
  "Γλώσσα": "from-violet-500 to-fuchsia-300",
  "Συναισθήματα": "from-rose-500 to-pink-300",
  "Φύση": "from-emerald-500 to-lime-300",
  "Κατασκευές": "from-indigo-500 to-sky-300",
  "Μουσική & Ρυθμός": "from-amber-400 to-pink-300",
  "Καθημερινή ζωή": "from-teal-500 to-cyan-300",
};

function shuffled<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function PreschoolGameLab({ age }: { age: PreschoolAge }) {
  const gamesForAge = useMemo(() => GAMES.filter((g) => g.ages.includes(age)), [age]);
  const themes = useMemo(() => Array.from(new Set(gamesForAge.map((g) => g.theme))), [gamesForAge]);
  const [theme, setTheme] = useState<Theme | "Όλα">("Όλα");
  const visible = useMemo(() => (theme === "Όλα" ? gamesForAge : gamesForAge.filter((g) => g.theme === theme)), [gamesForAge, theme]);
  const [gameId, setGameId] = useState(gamesForAge[0]?.id ?? GAMES[0].id);
  const active = gamesForAge.find((g) => g.id === gameId) ?? gamesForAge[0] ?? GAMES[0];
  const [choice, setChoice] = useState<number | null>(null);
  const [patternPick, setPatternPick] = useState<string | null>(null);
  const [sequenceOrder, setSequenceOrder] = useState<string[]>([]);
  const [sequencePicked, setSequencePicked] = useState<string[]>([]);
  const [sortSelected, setSortSelected] = useState<string | null>(null);
  const [sorted, setSorted] = useState<Record<string, string>>({});
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [memoryOpen, setMemoryOpen] = useState<string[]>([]);
  const [memoryMatched, setMemoryMatched] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    if (!gamesForAge.some((g) => g.id === gameId)) setGameId(gamesForAge[0]?.id ?? GAMES[0].id);
    if (theme !== "Όλα" && !themes.includes(theme)) setTheme("Όλα");
  }, [age, gamesForAge, gameId, theme, themes]);

  useEffect(() => {
    setChoice(null);
    setPatternPick(null);
    setSequencePicked([]);
    setSortSelected(null);
    setSorted({});
    setMemoryOpen([]);
    setMemoryMatched([]);
    if (active.mechanic === "sequence") setSequenceOrder(shuffled(active.steps));
    else setSequenceOrder([]);
    if (active.mechanic === "memory") {
      const cards = active.pairs.flatMap((p) => [
        { key: `${p.id}-a`, pairId: p.id, emoji: p.emoji },
        { key: `${p.id}-b`, pairId: p.id, emoji: p.emoji },
      ]);
      setMemoryCards(shuffled(cards));
    } else setMemoryCards([]);
  }, [active.id]);

  const success = (() => {
    if (active.mechanic === "choice") return choice !== null && !!active.choices[choice]?.correct;
    if (active.mechanic === "pattern") return patternPick === active.correct;
    if (active.mechanic === "sequence") return sequencePicked.length === active.steps.length;
    if (active.mechanic === "sort") return active.items.every((item) => sorted[item.id] === item.bin);
    if (active.mechanic === "memory") return memoryMatched.length === active.pairs.length;
    return false;
  })();

  useEffect(() => {
    if (!success || completed.includes(active.id)) return;
    setCompleted((prev) => [...prev, active.id]);
    trackEvent("preschool_game_complete", { game: active.id, age, mechanic: active.mechanic, theme: active.theme });
  }, [success, active.id, active.mechanic, active.theme, age, completed]);

  function openGame(game: Game) {
    setGameId(game.id);
    trackEvent("preschool_game_start", { game: game.id, age, mechanic: game.mechanic, theme: game.theme });
    window.setTimeout(() => document.getElementById("preschool-game-player")?.scrollIntoView({ behavior: "smooth", block: "center" }), 30);
  }

  function reset() {
    setChoice(null);
    setPatternPick(null);
    setSequencePicked([]);
    setSortSelected(null);
    setSorted({});
    setMemoryOpen([]);
    setMemoryMatched([]);
    if (active.mechanic === "sequence") setSequenceOrder(shuffled(active.steps));
    if (active.mechanic === "memory") {
      setMemoryCards(shuffled(active.pairs.flatMap((p) => [
        { key: `${p.id}-a`, pairId: p.id, emoji: p.emoji },
        { key: `${p.id}-b`, pairId: p.id, emoji: p.emoji },
      ])));
    }
  }

  function pickSequence(step: string) {
    if (active.mechanic !== "sequence") return;
    const next = active.steps[sequencePicked.length];
    if (step !== next || sequencePicked.includes(step)) return;
    setSequencePicked((prev) => [...prev, step]);
  }

  function placeSort(bin: string) {
    if (active.mechanic !== "sort" || !sortSelected) return;
    setSorted((prev) => ({ ...prev, [sortSelected]: bin }));
    setSortSelected(null);
  }

  function flipCard(card: MemoryCard) {
    if (active.mechanic !== "memory") return;
    if (memoryMatched.includes(card.pairId) || memoryOpen.includes(card.key) || memoryOpen.length >= 2) return;
    const next = [...memoryOpen, card.key];
    setMemoryOpen(next);
    if (next.length === 2) {
      const first = memoryCards.find((c) => c.key === next[0]);
      const second = memoryCards.find((c) => c.key === next[1]);
      if (first && second && first.pairId === second.pairId) {
        window.setTimeout(() => {
          setMemoryMatched((prev) => [...prev, first.pairId]);
          setMemoryOpen([]);
        }, 350);
      } else window.setTimeout(() => setMemoryOpen([]), 700);
    }
  }

  return (
    <section id="games" className="mx-auto max-w-7xl px-5 py-12">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm font-black uppercase tracking-[.25em] text-indigo-500">Game Galaxy</div>
          <h2 className="mt-2 text-4xl font-black">Παιχνίδια που αλλάζουν με την ηλικία</h2>
          <p className="mt-2 max-w-3xl text-slate-600">Διαφορετική δυσκολία και διαφορετικός τρόπος παιχνιδιού — ταξινόμηση, μνήμη, μοτίβα, ακολουθίες, γλώσσα, μαθηματικά και κοινωνική σκέψη.</p>
        </div>
        <div className="rounded-2xl bg-indigo-50 px-4 py-3 font-black text-indigo-700"><Trophy className="mr-2 inline h-5 w-5" />{completed.length} ολοκληρωμένα</div>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        <button onClick={() => setTheme("Όλα")} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black ${theme === "Όλα" ? "bg-[#142458] text-white" : "bg-white shadow"}`}>✨ Όλα</button>
        {themes.map((t) => <button key={t} onClick={() => setTheme(t)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black ${theme === t ? "bg-[#142458] text-white" : "bg-white shadow"}`}>{t}</button>)}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((g) => (
          <button key={g.id} onClick={() => openGame(g)} className={`group rounded-[26px] border-2 p-5 text-left shadow-lg transition ${active.id === g.id ? "border-indigo-400 bg-indigo-50" : "border-white bg-white hover:border-indigo-200"}`}>
            <div className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${THEME_STYLE[g.theme]} text-4xl shadow-md transition group-hover:scale-105`}>{g.emoji}</div>
            <div className="mt-4 flex items-center justify-between gap-2"><h3 className="text-xl font-black">{g.title}</h3>{completed.includes(g.id) && <Star className="h-5 w-5 fill-yellow-300 text-yellow-500" />}</div>
            <p className="mt-2 text-sm leading-6 text-slate-500">{g.instruction}</p>
            <div className="mt-4 flex items-center justify-between text-xs font-black"><span className="text-indigo-500">{g.theme}</span><span className="text-slate-400">{g.minutes}′</span></div>
          </button>
        ))}
      </div>

      <div id="preschool-game-player" className="mt-8 overflow-hidden rounded-[36px] bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 p-1 shadow-2xl">
        <div className="rounded-[33px] bg-white p-6 md:p-9">
          <div className="grid gap-7 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
            <aside className={`rounded-[30px] bg-gradient-to-br ${THEME_STYLE[active.theme]} p-6 text-white shadow-xl`}>
              <div className="text-7xl">{active.emoji}</div>
              <div className="mt-5 text-xs font-black uppercase tracking-[.2em] opacity-80">{age} • {active.minutes}′ • {active.theme}</div>
              <h3 className="mt-2 text-3xl font-black leading-tight">{active.title}</h3>
              <p className="mt-4 font-semibold leading-7 text-white/90">{active.instruction}</p>
              <div className="mt-5 rounded-2xl bg-white/20 p-4 text-sm font-black">🎯 {active.skill}</div>
              <div className="mt-3 rounded-2xl bg-[#142458]/20 p-4 text-sm font-bold">🏃 Μετά χωρίς οθόνη: {active.offlineMission}</div>
            </aside>

            <div className="min-h-[420px] rounded-[30px] bg-[#fffaf2] p-5 md:p-7">
              {active.mechanic === "choice" && <div>
                <div className="rounded-3xl bg-white p-5 text-center text-2xl font-black shadow">{active.prompt}</div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">{active.choices.map((c, i) => <button key={c.label} onClick={() => setChoice(i)} className={`rounded-2xl border-2 p-5 text-lg font-black shadow-sm ${choice === i ? (c.correct ? "border-emerald-400 bg-emerald-50" : "border-rose-400 bg-rose-50") : "border-white bg-white hover:border-indigo-300"}`}>{c.label}</button>)}</div>
                {choice !== null && <div className={`mt-4 rounded-2xl p-4 text-center font-black ${active.choices[choice]?.correct ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>{active.choices[choice]?.correct ? `⭐ ${active.reward}` : "Δοκίμασε ξανά — κοίτα και σκέψου λίγο ακόμη."}</div>}
              </div>}

              {active.mechanic === "pattern" && <div>
                <div className="rounded-3xl bg-white p-5 shadow"><div className="text-center text-sm font-black text-slate-500">Τι έρχεται μετά;</div><div className="mt-4 flex flex-wrap justify-center gap-3 text-5xl">{active.sequence.map((x, i) => <span key={`${x}-${i}`} className="grid h-20 w-20 place-items-center rounded-2xl bg-slate-50">{x}</span>)}<span className="grid h-20 w-20 place-items-center rounded-2xl border-4 border-dashed border-indigo-300 bg-indigo-50">?</span></div></div>
                <div className="mt-5 grid grid-cols-3 gap-3">{active.options.map((o) => <button key={o} onClick={() => setPatternPick(o)} className={`rounded-2xl border-2 bg-white p-5 text-5xl shadow ${patternPick === o ? (o === active.correct ? "border-emerald-400" : "border-rose-400") : "border-white"}`}>{o}</button>)}</div>
                {patternPick && <div className={`mt-4 rounded-2xl p-4 text-center font-black ${patternPick === active.correct ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>{patternPick === active.correct ? `⭐ ${active.reward}` : "Κοίτα πάλι πώς επαναλαμβάνεται το μοτίβο."}</div>}
              </div>}

              {active.mechanic === "sequence" && <div>
                <div className="rounded-3xl bg-white p-5 shadow"><div className="text-center text-sm font-black text-slate-500">Η σειρά σου</div><div className="mt-4 flex min-h-24 flex-wrap justify-center gap-3">{active.steps.map((_, i) => <div key={i} className="grid min-h-20 min-w-24 place-items-center rounded-2xl border-4 border-dashed border-indigo-200 bg-indigo-50 px-3 text-center font-black">{sequencePicked[i] ?? `${i + 1}`}</div>)}</div></div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">{sequenceOrder.map((step) => <button key={step} disabled={sequencePicked.includes(step)} onClick={() => pickSequence(step)} className={`rounded-2xl bg-white p-4 text-left font-black shadow ${sequencePicked.includes(step) ? "opacity-30" : "hover:ring-2 hover:ring-indigo-300"}`}>{step}</button>)}</div>
                {success && <div className="mt-4 rounded-2xl bg-emerald-100 p-4 text-center font-black text-emerald-800">⭐ {active.reward}</div>}
              </div>}

              {active.mechanic === "sort" && <div>
                <div className="rounded-3xl bg-white p-5 shadow"><div className="text-center text-sm font-black text-slate-500">1. Διάλεξε αντικείμενο</div><div className="mt-4 flex flex-wrap justify-center gap-3">{active.items.map((item) => <button key={item.id} onClick={() => setSortSelected(item.id)} className={`min-w-24 rounded-2xl border-2 p-3 text-center shadow-sm ${sortSelected === item.id ? "border-indigo-500 bg-indigo-50" : "border-white bg-slate-50"}`}><div className="text-4xl">{item.emoji}</div><div className="mt-1 text-xs font-black">{item.label}</div>{sorted[item.id] && <div className={`mt-1 text-xs font-black ${sorted[item.id] === item.bin ? "text-emerald-600" : "text-rose-500"}`}>{sorted[item.id] === item.bin ? "✓ σωστά" : "↻ ξανά"}</div>}</button>)}</div></div>
                <div className="mt-5"><div className="text-center text-sm font-black text-slate-500">2. Βάλ' το στη σωστή ομάδα</div><div className="mt-3 grid gap-3 sm:grid-cols-2">{active.bins.map((bin) => <button key={bin.id} onClick={() => placeSort(bin.id)} className="rounded-3xl border-4 border-dashed border-indigo-200 bg-white p-5 text-center shadow-sm hover:border-indigo-400"><div className="text-5xl">{bin.emoji}</div><div className="mt-2 font-black">{bin.label}</div></button>)}</div></div>
                {success && <div className="mt-4 rounded-2xl bg-emerald-100 p-4 text-center font-black text-emerald-800">⭐ {active.reward}</div>}
              </div>}

              {active.mechanic === "memory" && <div>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">{memoryCards.map((card) => {
                  const open = memoryOpen.includes(card.key) || memoryMatched.includes(card.pairId);
                  return <button key={card.key} onClick={() => flipCard(card)} className={`aspect-square rounded-3xl border-2 text-5xl shadow transition ${open ? "border-indigo-200 bg-white" : "border-indigo-500 bg-gradient-to-br from-indigo-500 to-violet-500 text-white"}`}>{open ? card.emoji : "?"}</button>;
                })}</div>
                {success && <div className="mt-4 rounded-2xl bg-emerald-100 p-4 text-center font-black text-emerald-800">⭐ {active.reward}</div>}
              </div>}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
                <div className="text-sm font-black text-slate-500">⭐ {completed.filter((id) => gamesForAge.some((g) => g.id === id)).length}/{gamesForAge.length} παιχνίδια αυτής της ηλικίας</div>
                <button onClick={reset} className="rounded-xl bg-slate-100 px-4 py-2 font-black"><RotateCcw className="mr-2 inline h-4 w-4" />Ξανά</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
