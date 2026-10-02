export type PreschoolAge = "2–3" | "4–5" | "5–6";
export type LearningDomain =
  | "γλώσσα"
  | "μαθηματικά"
  | "λογική"
  | "συναισθήματα"
  | "δημιουργικότητα"
  | "κίνηση"
  | "φύση";

export type MediaItem = {
  id: string;
  title: string;
  provider: string;
  providerKind: "youtube" | "external";
  videoId?: string;
  externalUrl?: string;
  thumbnail?: string;
  ages: PreschoolAge[];
  minutes: number;
  domain: LearningDomain;
  prompt: string;
  offlineMission: string;
  followUp: { type: "game" | "coloring" | "craft" | "movement"; id: string; label: string };
};

export type MiniGame = {
  id: string;
  title: string;
  emoji: string;
  ages: PreschoolAge[];
  minutes: number;
  domain: LearningDomain;
  instruction: string;
  question: string;
  options: string[];
  correct: number;
  reward: string;
};

export type ColoringPage = {
  id: string;
  title: string;
  emoji: string;
  ages: PreschoolAge[];
  scene: "lion" | "ocean" | "space" | "garden" | "farm" | "rainbow" | "dino" | "boat";
  skill: string;
};

export type CraftActivity = {
  id: string;
  title: string;
  emoji: string;
  ages: PreschoolAge[];
  minutes: number;
  level: "Εύκολο" | "Μεσαίο";
  skill: string;
  materials: string[];
  steps: string[];
  seasonal?: "autumn" | "christmas" | "carnival" | "march25" | "easter" | "summer" | "oct28";
};

export const CURATED_MEDIA: MediaItem[] = [
  {
    id: "sesame-shapes",
    title: "Σχήματα με τον Elmo & φίλους",
    provider: "Sesame Street — official",
    providerKind: "youtube",
    videoId: "Ksd59Te9ZEo",
    thumbnail: "https://i.ytimg.com/vi/Ksd59Te9ZEo/hqdefault.jpg",
    ages: ["2–3", "4–5"],
    minutes: 6,
    domain: "μαθηματικά",
    prompt: "Πριν ξεκινήσει, βρείτε μαζί έναν κύκλο, ένα τετράγωνο και ένα τρίγωνο στο δωμάτιο.",
    offlineMission: "Μετά το βίντεο: φτιάξτε ένα σπιτάκι μόνο με 3 σχήματα.",
    followUp: { type: "game", id: "shape-match", label: "Παίξε: Ταίριαξε τα σχήματα" },
  },
  {
    id: "super-simple-shapes",
    title: "The Shape Song",
    provider: "Super Simple Songs — official",
    providerKind: "youtube",
    videoId: "TJhfl5vdxp4",
    thumbnail: "https://i.ytimg.com/vi/TJhfl5vdxp4/hqdefault.jpg",
    ages: ["2–3", "4–5"],
    minutes: 4,
    domain: "κίνηση",
    prompt: "Σηκωθείτε όρθιοι και σχηματίστε με τα χέρια σας κύκλο, καρδιά και τετράγωνο.",
    offlineMission: "Κάντε κυνήγι σχημάτων στο σπίτι για 3 λεπτά.",
    followUp: { type: "craft", id: "shape-rocket", label: "Φτιάξε: Πύραυλος από σχήματα" },
  },
  {
    id: "sesame-emotions",
    title: "Τραγούδι για τα συναισθήματα",
    provider: "Sesame Street — official",
    providerKind: "youtube",
    videoId: "y28GH2GoIyc",
    thumbnail: "https://i.ytimg.com/vi/y28GH2GoIyc/hqdefault.jpg",
    ages: ["4–5", "5–6"],
    minutes: 3,
    domain: "συναισθήματα",
    prompt: "Διαλέξτε ένα πρόσωπο: χαρούμενο, θυμωμένο, λυπημένο ή ενθουσιασμένο.",
    offlineMission: "Κάντε καθρέφτη συναισθημάτων: ο ένας δείχνει, ο άλλος μαντεύει.",
    followUp: { type: "game", id: "emotion-face", label: "Παίξε: Ποιο συναίσθημα βλέπεις;" },
  },
  {
    id: "super-simple-colors",
    title: "Χρώματα, αριθμοί & κίνηση",
    provider: "Super Simple Songs — official",
    providerKind: "youtube",
    videoId: "P0C1_bOhPV4",
    thumbnail: "https://i.ytimg.com/vi/P0C1_bOhPV4/hqdefault.jpg",
    ages: ["2–3", "4–5", "5–6"],
    minutes: 8,
    domain: "δημιουργικότητα",
    prompt: "Ο γονιός επιλέγει ένα σύντομο τραγούδι από τη συλλογή — όχι συνεχόμενη θέαση.",
    offlineMission: "Βρείτε 5 αντικείμενα ίδιου χρώματος και βάλτε τα σε σειρά από μικρό σε μεγάλο.",
    followUp: { type: "coloring", id: "rainbow", label: "Ζωγράφισε: Το ουράνιο τόξο" },
  },
  {
    id: "ert-tok-tok",
    title: "Τοκ Τοκ — ελληνική προσχολική σειρά",
    provider: "ERTkids / ΕΡΤ",
    providerKind: "external",
    externalUrl: "https://press.ert.gr/ertflix/ertflix-tok-tok-i-nea-seira-tis-ert-gia-paidia-proscholikis-ilikias/",
    ages: ["2–3", "4–5"],
    minutes: 10,
    domain: "γλώσσα",
    prompt: "Επιλέξτε επεισόδιο με θέμα χρώματα, σχήματα, βροχή ή αριθμούς.",
    offlineMission: "Ζητήστε από το παιδί να σας πει 3 πράγματα που θυμάται από το επεισόδιο.",
    followUp: { type: "movement", id: "move-3", label: "Κίνηση: 3 λεπτά χωρίς οθόνη" },
  },
  {
    id: "pbs-sesame-library",
    title: "Sesame Street — ασφαλής βιβλιοθήκη PBS KIDS",
    provider: "PBS KIDS",
    providerKind: "external",
    externalUrl: "https://pbskids.org/videos/sesame-street",
    ages: ["4–5", "5–6"],
    minutes: 8,
    domain: "γλώσσα",
    prompt: "Ο γονιός διαλέγει ένα σύντομο εκπαιδευτικό clip μαζί με το παιδί.",
    offlineMission: "Σχεδιάστε μία εικόνα από την ιστορία και δώστε της τίτλο.",
    followUp: { type: "coloring", id: "garden", label: "Ζωγράφισε: Η δική μου ιστορία" },
  },
];

export const MINI_GAMES: MiniGame[] = [
  { id: "shape-match", title: "Ταίριαξε τα σχήματα", emoji: "🔺", ages: ["2–3", "4–5"], minutes: 4, domain: "λογική", instruction: "Βρες ποιο σχήμα ταιριάζει.", question: "Ποιο είναι στρογγυλό;", options: ["🔵", "🟥", "🔺"], correct: 0, reward: "Μπράβο! Ο κύκλος δεν έχει γωνίες." },
  { id: "color-hunt", title: "Κυνήγι χρωμάτων", emoji: "🌈", ages: ["2–3", "4–5"], minutes: 4, domain: "δημιουργικότητα", instruction: "Διάλεξε το χρώμα που ζητάει η κάρτα.", question: "Ποιο είναι κίτρινο;", options: ["🍓", "🌞", "🫐"], correct: 1, reward: "Το βρήκες! Τώρα βρες κάτι κίτρινο δίπλα σου." },
  { id: "count-5", title: "Μέτρα ως το 5", emoji: "🔢", ages: ["2–3", "4–5"], minutes: 4, domain: "μαθηματικά", instruction: "Μέτρα προσεκτικά.", question: "⭐⭐⭐⭐⭐ Πόσα αστέρια βλέπεις;", options: ["4", "5", "6"], correct: 1, reward: "Πέντε! Δείξε τώρα 5 δάχτυλα." },
  { id: "pattern-next", title: "Βρες το μοτίβο", emoji: "🧩", ages: ["4–5", "5–6"], minutes: 5, domain: "λογική", instruction: "Συνέχισε τη σειρά.", question: "🔴 🔵 🔴 🔵 …", options: ["🔴", "🟢", "🟡"], correct: 0, reward: "Σωστά! Τα μοτίβα επαναλαμβάνονται." },
  { id: "emotion-face", title: "Ποιο συναίσθημα;", emoji: "😊", ages: ["4–5", "5–6"], minutes: 5, domain: "συναισθήματα", instruction: "Κοίτα το πρόσωπο και διάλεξε.", question: "😢 Πώς νιώθει;", options: ["Χαρούμενος", "Λυπημένος", "Έκπληκτος"], correct: 1, reward: "Σωστά. Μπορούμε να μιλάμε για ό,τι νιώθουμε." },
  { id: "letter-a", title: "Βρες το Α", emoji: "🔤", ages: ["4–5", "5–6"], minutes: 4, domain: "γλώσσα", instruction: "Άκου τη λέξη στο μυαλό σου και βρες το αρχικό γράμμα.", question: "Ποια λέξη αρχίζει από Α;", options: ["Αρκούδα", "Μήλο", "Ήλιος"], correct: 0, reward: "Α όπως Αρκούδα!" },
  { id: "big-small", title: "Μεγάλο ή μικρό;", emoji: "🐘", ages: ["2–3", "4–5"], minutes: 4, domain: "λογική", instruction: "Σύγκρινε τα αντικείμενα.", question: "Ποιο είναι συνήθως μεγαλύτερο;", options: ["🐘 Ελέφαντας", "🐭 Ποντίκι"], correct: 0, reward: "Ναι! Ο ελέφαντας είναι μεγαλύτερος." },
  { id: "same-different", title: "Ίδιο ή διαφορετικό", emoji: "👀", ages: ["4–5", "5–6"], minutes: 5, domain: "λογική", instruction: "Παρατήρησε τις λεπτομέρειες.", question: "Ποιο διαφέρει; 🍎 🍎 🍐 🍎", options: ["1ο", "2ο", "3ο", "4ο"], correct: 2, reward: "Μπράβο στην παρατήρηση!" },
  { id: "simple-add", title: "Μικρές προσθέσεις", emoji: "➕", ages: ["5–6"], minutes: 5, domain: "μαθηματικά", instruction: "Μέτρα και πρόσθεσε.", question: "🍓🍓 + 🍓 = ?", options: ["2", "3", "4"], correct: 1, reward: "2 + 1 = 3. Τέλεια!" },
  { id: "story-order", title: "Βάλε την ιστορία σε σειρά", emoji: "📚", ages: ["5–6"], minutes: 6, domain: "γλώσσα", instruction: "Τι γίνεται πρώτο;", question: "Για να φυτρώσει ένα λουλούδι, τι κάνουμε πρώτα;", options: ["Βλέπουμε το λουλούδι", "Φυτεύουμε τον σπόρο", "Μυρίζουμε το λουλούδι"], correct: 1, reward: "Πρώτα φυτεύουμε — μετά φροντίζουμε και περιμένουμε." },
  { id: "nature-sort", title: "Ζωντανό ή όχι;", emoji: "🌱", ages: ["4–5", "5–6"], minutes: 5, domain: "φύση", instruction: "Σκέψου αν μεγαλώνει και χρειάζεται φροντίδα.", question: "Ποιο είναι ζωντανό;", options: ["🌳 Δέντρο", "🪑 Καρέκλα", "🚲 Ποδήλατο"], correct: 0, reward: "Το δέντρο μεγαλώνει και χρειάζεται νερό και φως." },
  { id: "kind-choice", title: "Επιλέγω με καλοσύνη", emoji: "💛", ages: ["4–5", "5–6"], minutes: 5, domain: "συναισθήματα", instruction: "Τι θα βοηθούσε έναν φίλο;", question: "Ένα παιδί έριξε τα τουβλάκια του. Τι κάνουμε;", options: ["Γελάμε", "Βοηθάμε να τα μαζέψει", "Φεύγουμε"], correct: 1, reward: "Η καλοσύνη κάνει την ομάδα πιο δυνατή." },
];

export const COLORING_PAGES: ColoringPage[] = [
  { id: "lion", title: "Χαρούμενο λιονταράκι", emoji: "🦁", ages: ["2–3", "4–5"], scene: "lion", skill: "Μεγάλα περιγράμματα" },
  { id: "ocean", title: "Ο βυθός", emoji: "🐳", ages: ["2–3", "4–5", "5–6"], scene: "ocean", skill: "Χρώματα & θαλάσσια ζώα" },
  { id: "space", title: "Διάστημα", emoji: "🚀", ages: ["4–5", "5–6"], scene: "space", skill: "Φαντασία" },
  { id: "garden", title: "Ο κήπος μου", emoji: "🌻", ages: ["2–3", "4–5"], scene: "garden", skill: "Φύση & χρώματα" },
  { id: "farm", title: "Στη φάρμα", emoji: "🐮", ages: ["2–3", "4–5"], scene: "farm", skill: "Ζώα" },
  { id: "rainbow", title: "Ουράνιο τόξο", emoji: "🌈", ages: ["2–3", "4–5", "5–6"], scene: "rainbow", skill: "Σειρά χρωμάτων" },
  { id: "dino", title: "Φιλικός δεινόσαυρος", emoji: "🦕", ages: ["4–5", "5–6"], scene: "dino", skill: "Λεπτομέρεια" },
  { id: "boat", title: "Καραβάκι στο Αιγαίο", emoji: "⛵", ages: ["4–5", "5–6"], scene: "boat", skill: "Ελλάδα & θάλασσα" },
  { id: "lion-2", title: "Λιοντάρι με μοτίβα", emoji: "🦁", ages: ["5–6"], scene: "lion", skill: "Μοτίβα" },
  { id: "ocean-2", title: "Ψάρια και κοράλλια", emoji: "🐠", ages: ["4–5", "5–6"], scene: "ocean", skill: "Παρατήρηση" },
  { id: "garden-2", title: "Πεταλούδες στον κήπο", emoji: "🦋", ages: ["4–5", "5–6"], scene: "garden", skill: "Συμμετρία" },
  { id: "space-2", title: "Ο πλανήτης μου", emoji: "🪐", ages: ["5–6"], scene: "space", skill: "Δημιουργικότητα" },
];

export const CRAFT_LIBRARY: CraftActivity[] = [
  { id: "shape-rocket", title: "Πύραυλος από σχήματα", emoji: "🚀", ages: ["4–5", "5–6"], minutes: 20, level: "Εύκολο", skill: "Σχήματα & σύνθεση", materials: ["Χρωματιστά χαρτόνια", "Κόλλα", "Παιδικό ψαλίδι"], steps: ["Κόψτε ένα μεγάλο ορθογώνιο για το σώμα.", "Προσθέστε τρίγωνο στην κορυφή και μικρά τρίγωνα στα πλάγια.", "Κολλήστε κύκλους για παράθυρα και λωρίδες για φλόγες."] },
  { id: "lion-mane", title: "Λιονταράκι με χάρτινη χαίτη", emoji: "🦁", ages: ["3–4" as PreschoolAge, "4–5"], minutes: 20, level: "Εύκολο", skill: "Κοπή & κόλληση", materials: ["Χαρτόνι", "Κόλλα", "Μαρκαδόροι"], steps: ["Κόψτε λωρίδες πορτοκαλί και κίτρινου χαρτιού.", "Κολλήστε τις γύρω από έναν κύκλο.", "Ζωγραφίστε μάτια, μύτη και χαμόγελο."] },
  { id: "autumn-tree", title: "Φθινοπωρινό δέντρο", emoji: "🍂", ages: ["2–3", "4–5"], minutes: 15, level: "Εύκολο", skill: "Αισθητηριακό παιχνίδι", materials: ["Χαρτί", "Δαχτυλομπογιές", "Πραγματικά φύλλα"], steps: ["Ζωγραφίστε έναν κορμό.", "Κάντε αποτυπώματα με κόκκινο, κίτρινο και πορτοκαλί.", "Κολλήστε 2–3 φύλλα που μαζέψατε έξω."] , seasonal: "autumn" },
  { id: "christmas-tree", title: "Χριστουγεννιάτικο δέντρο Α4", emoji: "🎄", ages: ["2–3", "4–5", "5–6"], minutes: 20, level: "Εύκολο", skill: "Μοτίβα & λεπτή κινητικότητα", materials: ["Πράσινο χαρτόνι", "Χάρτινα στολίδια", "Κόλλα"], steps: ["Κόψτε 3 τρίγωνα διαφορετικού μεγέθους.", "Κολλήστε τα από μεγάλο σε μικρό.", "Προσθέστε στολίδια ακολουθώντας μοτίβο χρωμάτων."] , seasonal: "christmas" },
  { id: "snowman", title: "Χιονάνθρωπος με κύκλους", emoji: "⛄", ages: ["2–3", "4–5"], minutes: 15, level: "Εύκολο", skill: "Μεγέθη", materials: ["Λευκό χαρτί", "Κόλλα", "Χρώματα"], steps: ["Κόψτε 3 κύκλους.", "Βάλτε τους από μεγαλύτερο σε μικρότερο.", "Προσθέστε καπέλο, μύτη και κουμπιά."] , seasonal: "christmas" },
  { id: "carnival-mask", title: "Αποκριάτικη μάσκα", emoji: "🎭", ages: ["4–5", "5–6"], minutes: 25, level: "Μεσαίο", skill: "Φαντασία", materials: ["Χαρτόνι", "Χρώματα", "Κορδέλα", "Αυτοκόλλητα"], steps: ["Σχεδιάστε ή εκτυπώστε το περίγραμμα.", "Διακοσμήστε με χρώματα και σχήματα.", "Ο ενήλικας ανοίγει τρύπες και περνά κορδέλα."] , seasonal: "carnival" },
  { id: "march-flag", title: "Ελληνική σημαία με λωρίδες", emoji: "🇬🇷", ages: ["4–5", "5–6"], minutes: 20, level: "Εύκολο", skill: "Μοτίβο & πολιτισμός", materials: ["Μπλε/λευκό χαρτί", "Κόλλα", "Χαρτόνι"], steps: ["Κόψτε μπλε και λευκές λωρίδες.", "Τοποθετήστε τις εναλλάξ.", "Προσθέστε τον λευκό σταυρό στο μπλε τετράγωνο."] , seasonal: "march25" },
  { id: "easter-bunny", title: "Πασχαλινό λαγουδάκι", emoji: "🐰", ages: ["2–3", "4–5"], minutes: 20, level: "Εύκολο", skill: "Κύκλοι & κόλληση", materials: ["Χαρτί", "Βαμβάκι", "Κόλλα"], steps: ["Φτιάξτε έναν μεγάλο κύκλο για πρόσωπο.", "Προσθέστε δύο μεγάλα αυτιά.", "Κολλήστε βαμβάκι για ουρίτσα ή λεπτομέρειες."] , seasonal: "easter" },
  { id: "easter-egg", title: "Αυγό με συμμετρικά μοτίβα", emoji: "🥚", ages: ["4–5", "5–6"], minutes: 20, level: "Εύκολο", skill: "Συμμετρία", materials: ["Α4 πατρόν αυγού", "Μαρκαδόροι", "Αυτοκόλλητα"], steps: ["Χωρίστε το αυγό σε λωρίδες.", "Φτιάξτε μικρά επαναλαμβανόμενα μοτίβα.", "Χρωματίστε συμμετρικά αριστερά και δεξιά."] , seasonal: "easter" },
  { id: "summer-boat", title: "Καλοκαιρινό καραβάκι", emoji: "⛵", ages: ["4–5", "5–6"], minutes: 25, level: "Μεσαίο", skill: "Κατασκευή", materials: ["Χαρτόνι", "Καλαμάκι", "Χρωματιστό χαρτί"], steps: ["Φτιάξτε τη βάση από διπλωμένο χαρτόνι.", "Ο ενήλικας στερεώνει το καλαμάκι.", "Κολλήστε τριγωνικό πανί και ζωγραφίστε κύματα."] , seasonal: "summer" },
  { id: "oct28-dove", title: "Περιστέρι ειρήνης", emoji: "🕊️", ages: ["4–5", "5–6"], minutes: 20, level: "Εύκολο", skill: "Ειρήνη & συνεργασία", materials: ["Λευκό χαρτί", "Μπλε χαρτόνι", "Κόλλα"], steps: ["Σχεδιάστε το περίγραμμα του περιστεριού.", "Ο ενήλικας βοηθά στο κόψιμο.", "Προσθέστε ένα κλαδί και μιλήστε για το τι σημαίνει ειρήνη."] , seasonal: "oct28" },
  { id: "kindness-chain", title: "Αλυσίδα καλοσύνης", emoji: "💛", ages: ["4–5", "5–6"], minutes: 15, level: "Εύκολο", skill: "Κοινωνικές δεξιότητες", materials: ["Χρωματιστές λωρίδες χαρτιού", "Κόλλα"], steps: ["Πείτε μία καλή πράξη για κάθε λωρίδα.", "Γράψτε ή ζωγραφίστε την πράξη.", "Ενώστε τις λωρίδες σε αλυσίδα."] },
  { id: "emotion-wheel", title: "Ρόδα συναισθημάτων", emoji: "🙂", ages: ["4–5", "5–6"], minutes: 25, level: "Μεσαίο", skill: "Συναισθηματική αναγνώριση", materials: ["Χαρτόνι", "Χρώματα", "Διπλόκαρφο από ενήλικα"], steps: ["Χωρίστε έναν κύκλο σε 6 κομμάτια.", "Ζωγραφίστε διαφορετικό συναίσθημα σε κάθε μέρος.", "Περιστρέψτε το βελάκι και μιλήστε για μια στιγμή που νιώσατε έτσι."] },
  { id: "paper-butterfly", title: "Πεταλούδα συμμετρίας", emoji: "🦋", ages: ["4–5", "5–6"], minutes: 20, level: "Εύκολο", skill: "Συμμετρία", materials: ["Χαρτί", "Τέμπερες", "Μαρκαδόρος"], steps: ["Διπλώστε το χαρτί στη μέση.", "Βάλτε μικρές σταγόνες χρώματος στη μία πλευρά.", "Κλείστε, πιέστε και ανοίξτε για συμμετρικά φτερά."] },
  { id: "robot-box", title: "Ρομπότ από ανακυκλώσιμα", emoji: "🤖", ages: ["5–6"], minutes: 30, level: "Μεσαίο", skill: "STEM & σχεδιασμός", materials: ["Μικρά κουτιά", "Καπάκια", "Χαρτί", "Κόλλα"], steps: ["Διαλέξτε ποιο κουτί είναι σώμα και ποιο κεφάλι.", "Προσθέστε χέρια και πόδια.", "Σχεδιάστε κουμπιά και πείτε τι μπορεί να κάνει το ρομπότ σας."] },
  { id: "nature-crown", title: "Στέμμα της φύσης", emoji: "👑", ages: ["2–3", "4–5"], minutes: 20, level: "Εύκολο", skill: "Φύση & παρατήρηση", materials: ["Λωρίδα χαρτονιού", "Φύλλα", "Λουλουδάκια", "Κόλλα"], steps: ["Μαζέψτε μόνο πεσμένα φυσικά υλικά.", "Κολλήστε τα πάνω στη λωρίδα.", "Ο ενήλικας προσαρμόζει και ενώνει το στέμμα."] },
  { id: "weather-wheel", title: "Ρόδα καιρού", emoji: "🌦️", ages: ["4–5", "5–6"], minutes: 25, level: "Μεσαίο", skill: "Παρατήρηση & λεξιλόγιο", materials: ["Χαρτόνι", "Χρώματα", "Διπλόκαρφο από ενήλικα"], steps: ["Ζωγραφίστε ήλιο, σύννεφο, βροχή και αέρα.", "Φτιάξτε ένα βελάκι.", "Κάθε πρωί δείξτε τον καιρό και περιγράψτε τον."] },
  { id: "story-puppets", title: "Δαχτυλόκουκλες ιστορίας", emoji: "🎭", ages: ["4–5", "5–6"], minutes: 25, level: "Μεσαίο", skill: "Γλώσσα & αφήγηση", materials: ["Χαρτί", "Χρώματα", "Κόλλα"], steps: ["Σχεδιάστε 3 μικρούς χαρακτήρες.", "Κόψτε με βοήθεια ενήλικα.", "Κολλήστε θηλιές και παίξτε μια μικρή ιστορία με αρχή, μέση και τέλος."] },
];
