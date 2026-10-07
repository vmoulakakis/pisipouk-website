export type AgeBand = "2-3" | "3-4" | "4-5" | "5-6";
export type SectionId = "home" | "games" | "atelier" | "stories" | "explore" | "parents";
export type GameId = "feed" | "sound-garden" | "necklace" | "sort" | "music" | "story-order" | "nature-hunt" | "marble";

export const AGE_META: Record<AgeBand, { label: string; short: string; principle: string; voice: string }> = {
  "2-3": {
    label: "2–3",
    short: "Αγγίζω • ακούω • ανακαλύπτω",
    principle: "Μεγάλοι στόχοι αφής, αιτία–αποτέλεσμα, απλές επιλογές και παιχνίδι χωρίς αποτυχία.",
    voice: "Παίζουμε αργά και απλά. Άγγιξε, σύρε και ανακάλυψε.",
  },
  "3-4": {
    label: "3–4",
    short: "Ταιριάζω • φτιάχνω • μιμούμαι",
    principle: "Ταξινόμηση, απλές ακολουθίες, λεπτή κίνηση, pretend play και ήπια αυτοδιόρθωση.",
    voice: "Δοκίμασε, φτιάξε και άλλαξε γνώμη όποτε θέλεις.",
  },
  "4-5": {
    label: "4–5",
    short: "Δημιουργώ • αφηγούμαι • χτίζω",
    principle: "Περισσότερη φαντασία, μοτίβα, μουσική, ιστορία, συνεργασία και construction play.",
    voice: "Μπορείς να φτιάξεις περισσότερες από μία σωστές λύσεις.",
  },
  "5-6": {
    label: "5–6",
    short: "Σχεδιάζω • προβλέπω • λύνω",
    principle: "Πρόβλεψη, χωρική λογική, απλό STEM, σύνθετες ακολουθίες και αφηγηματικές επιλογές.",
    voice: "Σκέψου τι θα συμβεί, δοκίμασε και μετά άλλαξε το σχέδιό σου.",
  },
};

export const GAME_META: Record<GameId, {
  title: string;
  ages: AgeBand[];
  domain: string;
  minutes: string;
  scene: "classroom" | "arrival" | "story" | "exterior";
  teaser: string;
}> = {
  feed: {
    title: "Το πικνίκ του Πισιπούκ",
    ages: ["2-3", "3-4"],
    domain: "Καθημερινή ζωή • επιλογή",
    minutes: "3–6′",
    scene: "arrival",
    teaser: "Δίνω φαγητό, ακούω αντίδραση και συνεχίζω το πικνίκ.",
  },
  "sound-garden": {
    title: "Ο κήπος των ήχων",
    ages: ["2-3", "3-4"],
    domain: "Αιτία–αποτέλεσμα • ήχος",
    minutes: "3–7′",
    scene: "exterior",
    teaser: "Αγγίζω ζώα και αντικείμενα και ο κόσμος απαντά.",
  },
  necklace: {
    title: "Το κολιέ του Πισιπούκ",
    ages: ["3-4", "4-5"],
    domain: "Λεπτή κίνηση • μοτίβα",
    minutes: "5–9′",
    scene: "classroom",
    teaser: "Περνάω χάντρες, δένω το κορδόνι και ο Πισιπούκ το φοράει.",
  },
  sort: {
    title: "Τα καλάθια των χρωμάτων",
    ages: ["3-4", "4-5"],
    domain: "Ταξινόμηση • οπτική διάκριση",
    minutes: "4–8′",
    scene: "classroom",
    teaser: "Σύρω γυαλιστερά αντικείμενα στο σωστό καλάθι χωρίς αγχωτικό feedback.",
  },
  music: {
    title: "Η μπάντα του Πισιπούκ",
    ages: ["3-4", "4-5", "5-6"],
    domain: "Ρυθμός • ακουστική μνήμη",
    minutes: "4–10′",
    scene: "story",
    teaser: "Παίζω ελεύθερα και, όταν θέλω, επαναλαμβάνω έναν μικρό ρυθμό.",
  },
  "story-order": {
    title: "Φτιάχνω την ιστορία",
    ages: ["4-5", "5-6"],
    domain: "Αφήγηση • ακολουθία",
    minutes: "5–9′",
    scene: "story",
    teaser: "Βάζω σκηνές στη σειρά και ακούω την ιστορία να ζωντανεύει.",
  },
  "nature-hunt": {
    title: "Μυστικά του κήπου",
    ages: ["2-3", "3-4", "4-5", "5-6"],
    domain: "Παρατήρηση • φύση",
    minutes: "4–10′",
    scene: "exterior",
    teaser: "Εξερευνώ έναν πραγματικό χώρο και ανακαλύπτω μικρές λεπτομέρειες.",
  },
  marble: {
    title: "Η διαδρομή της μπίλιας",
    ages: ["5-6"],
    domain: "STEM • πρόβλεψη • βαρύτητα",
    minutes: "7–12′",
    scene: "classroom",
    teaser: "Στήνω ράμπες, προβλέπω τη διαδρομή και δοκιμάζω ξανά.",
  },
};

export const GAME_ORDER: GameId[] = ["feed","sound-garden","necklace","sort","music","story-order","nature-hunt","marble"];
