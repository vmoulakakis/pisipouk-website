export type MagicAge = "2" | "3" | "4" | "5-6";
export type MagicSection = "home" | "games" | "create" | "stories" | "explore" | "today" | "parents";
export type MagicGameId = "necklace" | "feed" | "baskets" | "music";

export type MagicGameDef = {
  id: MagicGameId;
  age: MagicAge[];
  title: string;
  subtitle: string;
  domain: string;
  minutes: string;
  color: string;
  secondary: string;
  art: "necklace" | "food" | "baskets" | "music";
  parentPrompt: string;
  developmentalWhy: string;
};

export const AGE_INFO: Record<MagicAge, { label: string; short: string; promise: string }> = {
  "2": {
    label: "2 ετών",
    short: "Παίζω και ανακαλύπτω",
    promise: "Μεγάλα αντικείμενα, απλές αιτίες–αποτελέσματα, ήχος, κίνηση και χαρά χωρίς πίεση.",
  },
  "3": {
    label: "3 ετών",
    short: "Μαθαίνω με παιχνίδι",
    promise: "Ταξινομώ, ταιριάζω, φτιάχνω, μιμούμαι και αρχίζω μικρές ακολουθίες.",
  },
  "4": {
    label: "4 ετών",
    short: "Δημιουργώ και εξερευνώ",
    promise: "Περισσότερη φαντασία, ρόλοι, μοτίβα, μουσική, ιστορία και κατασκευή.",
  },
  "5-6": {
    label: "5–6 ετών",
    short: "Λύνω και σχεδιάζω",
    promise: "Στρατηγική, πρόβλεψη, σύνθετα μοτίβα, αφήγηση, STEM και επιλογές.",
  },
};

export const MAGIC_GAMES: MagicGameDef[] = [
  {
    id: "feed",
    age: ["2", "3"],
    title: "Ταΐζω τον Πισιπούκ",
    subtitle: "Διαλέγω φαγητό, το πιάνω και το δίνω στον Πισιπούκ.",
    domain: "Καθημερινή ζωή • ταξινόμηση",
    minutes: "3–6′",
    color: "#38d09a",
    secondary: "#d8fff0",
    art: "food",
    parentPrompt: "Ονομάστε μαζί χρώματα, μυρωδιές και γεύσεις από αληθινά φρούτα μετά το παιχνίδι.",
    developmentalWhy: "Για μικρές ηλικίες συνδυάζει απλή επιλογή, συντονισμό χεριού–ματιού και οικείες καθημερινές έννοιες.",
  },
  {
    id: "baskets",
    age: ["2", "3"],
    title: "Τα καλάθια των χρωμάτων",
    subtitle: "Πιάνω αντικείμενα και τα βάζω στο καλάθι που ταιριάζει.",
    domain: "Χρώματα • ταξινόμηση",
    minutes: "3–7′",
    color: "#ffb12c",
    secondary: "#fff0c3",
    art: "baskets",
    parentPrompt: "Μετά βρείτε στο δωμάτιο 3 πράγματα του ίδιου χρώματος.",
    developmentalWhy: "Το sorting γίνεται με μεγάλα touch targets και ήπια διόρθωση, χωρίς κόκκινα Χ ή αποτυχία.",
  },
  {
    id: "necklace",
    age: ["3", "4", "5-6"],
    title: "Το Κολιέ του Πισιπούκ",
    subtitle: "Περνάω χάντρες, κλείνω το κορδόνι και ο Πισιπούκ φοράει το δώρο μου.",
    domain: "Λεπτή κίνηση • μοτίβα • δημιουργία",
    minutes: "5–9′",
    color: "#ff4e91",
    secondary: "#ffe0ef",
    art: "necklace",
    parentPrompt: "Φτιάξτε ένα πραγματικό μοτίβο με κουμπιά, καπάκια ή χρωματιστά χαρτάκια.",
    developmentalWhy: "Δίνει σαφές δημιουργικό αποτέλεσμα: επιλογή, σειρά, λεπτή κίνηση και πραγματικό payoff animation στο τέλος.",
  },
  {
    id: "music",
    age: ["2", "3", "4", "5-6"],
    title: "Μουσικά Ζωάκια",
    subtitle: "Παίζω ελεύθερα, ακούω, μιμούμαι και φτιάχνω το δικό μου συγκρότημα.",
    domain: "Μουσική • ακουστική μνήμη",
    minutes: "4–10′",
    color: "#7b59ef",
    secondary: "#e8ddff",
    art: "music",
    parentPrompt: "Χτυπήστε μαζί έναν απλό ρυθμό με παλαμάκια και αφήστε το παιδί να σας απαντήσει.",
    developmentalWhy: "Το free-play προηγείται του challenge. Η ακουστική μνήμη και η μίμηση μπαίνουν σταδιακά ανά ηλικία.",
  },
];
