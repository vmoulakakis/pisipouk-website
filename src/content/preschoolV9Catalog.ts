import type { PreschoolAge } from "@/content/virtualPreschoolMedia";

export type Domain = "play"|"language"|"math"|"create"|"stories"|"stem"|"music"|"feelings";
export type Mechanic = "choice"|"order"|"tapcount"|"pattern"|"checklist";
export type QuickGame = {
  id:string; title:string; en:string; icon:string; ages:PreschoolAge[]; domain:Domain; mechanic:Mechanic;
  prompt:string; options?:string[]; correct?:number|number[]; sequence?:string[]; targetCount?:number;
  skill:string; offline:string;
};

const A23:PreschoolAge[]=["2–3"]; const A45:PreschoolAge[]=["4–5"]; const A56:PreschoolAge[]=["5–6"];
const A2345:PreschoolAge[]=["2–3","4–5"]; const A4556:PreschoolAge[]=["4–5","5–6"]; const ALL:PreschoolAge[]=["2–3","4–5","5–6"];

export const WORLDS:{id:Domain;title:string;en:string;icon:string;note:string}[]=[
  {id:"play",title:"Παίζω & Ανακαλύπτω",en:"Play & Discover",icon:"🎮",note:"Παζλ • μνήμη • αντιστοίχιση • ακολουθίες"},
  {id:"language",title:"Λέξεις & Ήχοι",en:"Words & Sounds",icon:"🔤",note:"Ρίμες • γράμματα • αφήγηση • λεξιλόγιο"},
  {id:"math",title:"Αριθμοί & Λογική",en:"Numbers & Logic",icon:"🔢",note:"Μέτρηση • μοτίβα • ποσότητες • προβλήματα"},
  {id:"create",title:"Δημιουργώ",en:"Create",icon:"🎨",note:"Ζωγραφική • κατασκευές • open-ended δημιουργία"},
  {id:"stories",title:"Ιστορίες του Πισιπούκ",en:"Pisipouk Stories",icon:"📚",note:"Ελληνικές ιστορίες • επιλογές • αφήγηση"},
  {id:"stem",title:"Φύση & STEM",en:"Nature & STEM",icon:"🔬",note:"Πειράματα • καιρός • ζώα • παρατήρηση"},
  {id:"music",title:"Μουσική & Κίνηση",en:"Music & Movement",icon:"🎵",note:"Ρυθμός • χορός • ήχοι • κινητικές αποστολές"},
  {id:"feelings",title:"Συναισθήματα & Ζωή",en:"Feelings & Life",icon:"💛",note:"Ενσυναίσθηση • ρουτίνες • ασφάλεια • συνεργασία"},
];

export const QUICK_GAMES:QuickGame[]=[
  {id:"find-red",title:"Βρες το κόκκινο",en:"Find red",icon:"🍎",ages:A23,domain:"play",mechanic:"choice",prompt:"Ποιο είναι κόκκινο;",options:["🍎 Μήλο","🍌 Μπανάνα","🥦 Μπρόκολο"],correct:0,skill:"Χρώματα",offline:"Βρες δύο κόκκινα πράγματα στο δωμάτιο."},
  {id:"big-small",title:"Μεγάλο ή μικρό;",en:"Big or small?",icon:"🐘",ages:A23,domain:"math",mechanic:"choice",prompt:"Ποιο είναι μεγαλύτερο;",options:["🐘 Ελέφαντας","🐭 Ποντίκι"],correct:0,skill:"Σύγκριση μεγέθους",offline:"Βρες ένα μεγάλο και ένα μικρό κουτάλι."},
  {id:"count-three",title:"Τρία αστεράκια",en:"Three stars",icon:"⭐",ages:A23,domain:"math",mechanic:"tapcount",prompt:"Πάτησε ακριβώς 3 αστέρια.",targetCount:3,skill:"Ποσότητα 1–3",offline:"Βάλε 3 τουβλάκια στη σειρά."},
  {id:"shape-hunt",title:"Κυνήγι κύκλων",en:"Circle hunt",icon:"⚪",ages:A23,domain:"play",mechanic:"checklist",prompt:"Πάτησε όσα είναι κύκλοι.",options:["⚪","🔺","🟡","⬛"],correct:[0,2],skill:"Σχήματα",offline:"Βρες δύο κύκλους στο σπίτι."},
  {id:"animal-sound",title:"Ποιος κάνει νιάου;",en:"Who says meow?",icon:"🐱",ages:A23,domain:"language",mechanic:"choice",prompt:"Ποιο ζωάκι κάνει νιάου;",options:["🐱 Γάτα","🐶 Σκύλος","🐄 Αγελάδα"],correct:0,skill:"Ήχοι & λεξιλόγιο",offline:"Μιμήσου τρεις ήχους ζώων."},
  {id:"weather-dress",title:"Τι φοράμε στη βροχή;",en:"Dress for rain",icon:"🌧️",ages:A2345,domain:"feelings",mechanic:"choice",prompt:"Βρέχει. Τι παίρνουμε μαζί;",options:["☂️ Ομπρέλα","🕶️ Γυαλιά ηλίου","🩴 Σαγιονάρες"],correct:0,skill:"Καθημερινή ζωή",offline:"Κοίτα τον καιρό και διάλεξε σωστό ρούχο."},
  {id:"shadow-match",title:"Ποια σκιά ταιριάζει;",en:"Match the shadow",icon:"🌘",ages:A2345,domain:"play",mechanic:"choice",prompt:"Ποια σκιά ταιριάζει σε ένα καραβάκι;",options:["⛵","🌳","🐟"],correct:0,skill:"Οπτική διάκριση",offline:"Κάνε σκιές με τα χέρια σου στον τοίχο."},
  {id:"sound-soft",title:"Δυνατά ή σιγά;",en:"Loud or soft",icon:"🔊",ages:A2345,domain:"music",mechanic:"choice",prompt:"Ποιον ήχο ακούμε συνήθως πιο σιγά;",options:["🤫 Ψίθυρο","🚒 Σειρήνα","🥁 Τύμπανο"],correct:0,skill:"Ακουστική διάκριση",offline:"Βρες 2 ήσυχους και 2 δυνατούς ήχους."},
  {id:"animal-home",title:"Πού μένει το ψάρι;",en:"Where does the fish live?",icon:"🐟",ages:A2345,domain:"stem",mechanic:"choice",prompt:"Πού ζει το ψαράκι;",options:["🌊 Στη θάλασσα","🌳 Στο δέντρο","☁️ Στο σύννεφο"],correct:0,skill:"Φύση & κατηγοριοποίηση",offline:"Διάλεξε ένα ζώο και πες πού ζει."},
  {id:"emotion-lost",title:"Πώς μπορεί να νιώθει;",en:"How might they feel?",icon:"😢",ages:ALL,domain:"feelings",mechanic:"choice",prompt:"Ένα παιδί έχασε το αγαπημένο του παιχνίδι. Πώς μπορεί να νιώθει;",options:["😢 Λυπημένο","😄 Χαρούμενο","😴 Νυσταγμένο"],correct:0,skill:"Συναισθήματα",offline:"Κάνε τρεις γκριμάτσες συναισθημάτων στον καθρέφτη."},
  {id:"clap-pattern",title:"Παλαμάκια του Πισιπούκ",en:"Pisipouk clap pattern",icon:"👏",ages:ALL,domain:"music",mechanic:"pattern",prompt:"Συνέχισε: 👏 👏 🤫 👏 👏 🤫 ...",options:["👏","🤫","🦶"],correct:0,skill:"Ρυθμός & μνήμη",offline:"Φτιάξε δικό σου ρυθμό με παλαμάκια και πατήματα."},
  {id:"color-pattern",title:"Μοτίβο χρωμάτων",en:"Color pattern",icon:"🟣",ages:A45,domain:"math",mechanic:"pattern",prompt:"Τι έρχεται μετά; 🔴 🟡 🔴 🟡 ...",options:["🔴","🔵","🟢"],correct:0,skill:"Μοτίβα",offline:"Φτιάξε μοτίβο με δύο χρώματα από αντικείμενα."},
  {id:"morning-order",title:"Η πρωινή σειρά",en:"Morning order",icon:"🌞",ages:A4556,domain:"feelings",mechanic:"order",prompt:"Βάλε τα βήματα στη σωστή σειρά.",sequence:["🛏️ Ξυπνάω","🪥 Βουρτσίζω δόντια","👕 Ντύνομαι","🥣 Τρώω πρωινό"],skill:"Ακολουθίες & αυτονομία",offline:"Ζωγράφισε τη δική σου πρωινή σειρά."},
  {id:"sound-m",title:"Άκου το Μ",en:"Hear M",icon:"Μ",ages:A4556,domain:"language",mechanic:"choice",prompt:"Ποια λέξη αρχίζει από Μ;",options:["🍎 μήλο","🐟 ψάρι","☀️ ήλιος"],correct:0,skill:"Φωνολογική επίγνωση",offline:"Βρες άλλη μία λέξη που αρχίζει από Μ."},
  {id:"opposites",title:"Τα αντίθετα",en:"Opposites",icon:"↔️",ages:A4556,domain:"language",mechanic:"choice",prompt:"Ποιο είναι το αντίθετο του «ψηλά»;",options:["χαμηλά","γρήγορα","ζεστά"],correct:0,skill:"Λεξιλόγιο",offline:"Βρες δύο ακόμη ζευγάρια αντιθέτων."},
  {id:"story-sequence",title:"Από σπόρο σε λουλούδι",en:"Seed to flower",icon:"🌱",ages:A4556,domain:"language",mechanic:"order",prompt:"Βάλε την ιστορία στη σωστή σειρά.",sequence:["🌰 Σπόρος","💧 Ποτίζω","🌿 Βλαστός","🌻 Λουλούδι"],skill:"Αφήγηση & χρονική σειρά",offline:"Φύτεψε φακές σε βαμβάκι και παρατήρησε κάθε μέρα."},
  {id:"rhyme",title:"Βρες τη ρίμα",en:"Find the rhyme",icon:"🎤",ages:A56,domain:"language",mechanic:"choice",prompt:"Ποια λέξη κάνει ρίμα με «γάτα»;",options:["πατάτα","βάρκα","νερό"],correct:0,skill:"Ρίμα",offline:"Φτιάξε μια αστεία μικρή ρίμα."},
  {id:"add-fruit",title:"Φρουτοπρόσθεση",en:"Fruit addition",icon:"🍓",ages:A56,domain:"math",mechanic:"choice",prompt:"🍓🍓 + 🍓 = πόσες;",options:["2","3","4"],correct:1,skill:"Πρώιμη πρόσθεση",offline:"Κάνε 2+1 με τουβλάκια."},
  {id:"sea-pattern",title:"Μοτίβο της θάλασσας",en:"Sea pattern",icon:"🐚",ages:A4556,domain:"math",mechanic:"pattern",prompt:"Τι έρχεται μετά; 🐚 🐟 🐚 🐟 ...",options:["🐚","🐟","⭐"],correct:0,skill:"Μοτίβα & πρόβλεψη",offline:"Φτιάξε μοτίβο με κουτάλια και πιρούνια."},
  {id:"sink-float",title:"Βυθίζεται ή επιπλέει;",en:"Sink or float?",icon:"🧪",ages:A4556,domain:"stem",mechanic:"choice",prompt:"Τι νομίζεις ότι θα κάνει ένα ξύλινο κουτάλι στο νερό;",options:["🌊 Θα επιπλέει","⬇️ Θα βυθιστεί"],correct:0,skill:"Πρόβλεψη",offline:"Δοκίμασε 3 ασφαλή αντικείμενα σε λεκάνη με έναν μεγάλο."},
  {id:"five-senses",title:"Οι αισθήσεις του λεμονιού",en:"Lemon senses",icon:"🍋",ages:A4556,domain:"stem",mechanic:"checklist",prompt:"Πάτησε όσα μπορείς να χρησιμοποιήσεις για να εξερευνήσεις ένα λεμόνι.",options:["👀 Βλέπω","👃 Μυρίζω","✋ Αγγίζω","👅 Δοκιμάζω"],correct:[0,1,2,3],skill:"Παρατήρηση & αισθήσεις",offline:"Εξερεύνησε ένα ασφαλές φρούτο με έναν μεγάλο."},
  {id:"recycle",title:"Πού το βάζουμε;",en:"Where does it go?",icon:"♻️",ages:A4556,domain:"stem",mechanic:"choice",prompt:"Το καθαρό χαρτί πού πάει;",options:["♻️ Ανακύκλωση","🗑️ Σκουπίδια","🌱 Γλάστρα"],correct:0,skill:"Περιβάλλον",offline:"Ξεχώρισε χαρτί και πλαστικό μαζί με έναν μεγάλο."},
  {id:"melting",title:"Τι λιώνει;",en:"What melts?",icon:"🧊",ages:A4556,domain:"stem",mechanic:"choice",prompt:"Ποιο αλλάζει όταν το αφήσουμε σε ζεστό μέρος;",options:["🧊 Παγάκι","🪨 Πέτρα","🧱 Τουβλάκι"],correct:0,skill:"Αλλαγές ύλης",offline:"Παρατήρησε ένα παγάκι σε πιατάκι."},
  {id:"kind-choice",title:"Η επιλογή της καλοσύνης",en:"Kind choice",icon:"💛",ages:A4556,domain:"feelings",mechanic:"choice",prompt:"Ένα παιδί είναι μόνο του. Τι μπορούμε να κάνουμε;",options:["🤝 Να το καλέσουμε να παίξει","🚶 Να φύγουμε","🙈 Να το αγνοήσουμε"],correct:0,skill:"Ενσυναίσθηση",offline:"Κάνε σήμερα μία μικρή πράξη καλοσύνης."},
  {id:"safe-cross",title:"Περνάω τον δρόμο",en:"Cross safely",icon:"🚦",ages:A4556,domain:"feelings",mechanic:"order",prompt:"Βάλε τα ασφαλή βήματα στη σειρά.",sequence:["🛑 Σταματώ","👀 Κοιτάζω","👂 Ακούω","🚶 Περνάω με μεγάλο"],skill:"Ασφάλεια",offline:"Κάνε πρόβα μόνο με έναν ενήλικα σε ασφαλές σημείο."},
  {id:"share-turn",title:"Η σειρά μου, η σειρά σου",en:"My turn, your turn",icon:"🤲",ages:A2345,domain:"feelings",mechanic:"choice",prompt:"Δύο παιδιά θέλουν το ίδιο παιχνίδι. Τι βοηθά;",options:["⏱️ Παίζουμε με σειρά","😠 Το αρπάζω","🙅 Δεν παίζει κανείς"],correct:0,skill:"Συνεργασία",offline:"Παίξε ένα παιχνίδι εναλλάξ με κάποιον."},
  {id:"healthy-plate",title:"Χρώματα στο πιάτο",en:"Colors on the plate",icon:"🥗",ages:A4556,domain:"feelings",mechanic:"checklist",prompt:"Διάλεξε τρόφιμα διαφορετικών χρωμάτων.",options:["🍅","🥦","🫐","🍟"],correct:[0,1,2],skill:"Υγιεινές επιλογές",offline:"Βρες τρία χρώματα στο πραγματικό σου γεύμα."},
  {id:"map-route",title:"Βρες τον δρόμο στον φάρο",en:"Route to the lighthouse",icon:"🗺️",ages:A56,domain:"play",mechanic:"order",prompt:"Βάλε τα σημάδια με τη σειρά.",sequence:["🌳 Δέντρο","🪨 Βράχος","⛵ Λιμάνι","💡 Φάρος"],skill:"Χωρική σκέψη",offline:"Φτιάξε διαδρομή με 4 αντικείμενα στο πάτωμα."},
  {id:"same-different",title:"Ίδιο ή διαφορετικό;",en:"Same or different?",icon:"👀",ages:A23,domain:"play",mechanic:"choice",prompt:"Ποιο ζευγάρι είναι ίδιο;",options:["🍎🍎","🍎🍐","🔺⚪"],correct:0,skill:"Οπτική σύγκριση",offline:"Βρες δύο ίδια αντικείμενα."},
  {id:"missing-number",title:"Ποιος αριθμός λείπει;",en:"Missing number",icon:"🔢",ages:A56,domain:"math",mechanic:"choice",prompt:"1, 2, __, 4",options:["3","5","6"],correct:0,skill:"Αριθμητική σειρά",offline:"Μέτρα 1–10 και κρύψε έναν αριθμό."},
  {id:"half-whole",title:"Βρες το άλλο μισό",en:"Find the other half",icon:"🍊",ages:A56,domain:"math",mechanic:"choice",prompt:"Ποιο ολοκληρώνει το πορτοκάλι;",options:["🍊","🍎","🥝"],correct:0,skill:"Μέρος & όλο",offline:"Κόψε ένα χαρτί στη μέση και ξαναένωσέ το."},
  {id:"beginning-sound",title:"Ίδιος πρώτος ήχος",en:"Same first sound",icon:"👂",ages:A56,domain:"language",mechanic:"choice",prompt:"Ποια λέξη αρχίζει όπως «μπάλα»;",options:["μπανάνα","γάτα","νερό"],correct:0,skill:"Αρχικός ήχος",offline:"Βρες 3 λέξεις από τον ίδιο ήχο."},
  {id:"story-choice",title:"Τι θα έκανε ο Πισιπούκ;",en:"What would Pisipouk do?",icon:"🦉",ages:A4556,domain:"stories",mechanic:"choice",prompt:"Ο Πισιπούκ βρίσκει ένα φοβισμένο σκαντζοχοιράκι. Τι κάνει;",options:["💬 Του μιλά ήρεμα","🏃 Φεύγει","📣 Φωνάζει δυνατά"],correct:0,skill:"Αφήγηση & ενσυναίσθηση",offline:"Συνέχισε την ιστορία με δικό σου τέλος."},
  {id:"instrument-family",title:"Ποιο κάνει μουσική;",en:"What makes music?",icon:"🎹",ages:A2345,domain:"music",mechanic:"checklist",prompt:"Πάτησε τα μουσικά όργανα.",options:["🥁","🎹","🥄","🎸"],correct:[0,1,3],skill:"Μουσικά όργανα",offline:"Φτιάξε ρυθμό με δύο ασφαλή αντικείμενα."},
];

export type CraftItem={id:string;title:string;en:string;icon:string;ages:PreschoolAge[];minutes:number;difficulty:1|2|3;theme:string;materials:string[];steps:string[]};
export const CRAFTS_V9:CraftItem[]=[
  {id:"paper-pisipouk",title:"Ο Πισιπούκ από χαρτί",en:"Paper Pisipouk",icon:"🦉",ages:ALL,minutes:15,difficulty:1,theme:"Πισιπούκ",materials:["Χαρτόνι Α4","Κόλλα","Μαρκαδόροι","Ψαλίδι ασφαλείας"],steps:["Χρωμάτισε τα μέρη","Κόψε με βοήθεια ενηλίκου","Κόλλησε σώμα και φτερά","Πρόσθεσε το χρυσό αστέρι"]},
  {id:"aegean-boat",title:"Καραβάκι του Αιγαίου",en:"Aegean boat",icon:"⛵",ages:ALL,minutes:12,difficulty:1,theme:"Θάλασσα",materials:["Χαρτί Α4","Μπλε μαρκαδόρος","Κόλλα"],steps:["Χρωμάτισε πανί και κύματα","Δίπλωσε το καραβάκι","Πρόσθεσε σημαιάκι","Φτιάξε λιμανάκι από τουβλάκια"]},
  {id:"olive-wreath",title:"Στεφάνι ελιάς",en:"Olive wreath",icon:"🫒",ages:A4556,minutes:14,difficulty:2,theme:"Ελλάδα",materials:["Χαρτόνι","Πράσινο","Κόλλα"],steps:["Κόψε τον κύκλο","Χρωμάτισε τα φύλλα","Κόλλησε γύρω γύρω","Μίλησε για την ελιά"]},
  {id:"sun-catcher",title:"Ηλιοπαγίδα χρωμάτων",en:"Color sun catcher",icon:"☀️",ages:ALL,minutes:18,difficulty:2,theme:"Φως & χρώμα",materials:["Διαφανές χαρτί","Χρωματιστά χαρτάκια","Κόλλα"],steps:["Φτιάξε περίγραμμα","Κόλλησε χρωματιστά κομμάτια","Σήκωσέ το στο φως","Παρατήρησε τα χρώματα"]},
  {id:"turtle-mask",title:"Μάσκα θαλάσσιας χελώνας",en:"Sea turtle mask",icon:"🐢",ages:A4556,minutes:16,difficulty:2,theme:"Θάλασσα",materials:["Χαρτόνι","Πράσινα χρώματα","Λάστιχο"],steps:["Χρωμάτισε το καβούκι","Κόψε με ενήλικα","Άνοιξε τα μάτια","Πρόσθεσε λάστιχο"]},
  {id:"windmill",title:"Ανεμόμυλος του νησιού",en:"Island windmill",icon:"🌬️",ages:A4556,minutes:20,difficulty:3,theme:"Κυκλάδες",materials:["Χαρτόνι","Διπλόκαρφο","Μαρκαδόροι"],steps:["Χρωμάτισε τον πύργο","Κόψε τα φτερά","Σύνδεσε με διπλόκαρφο","Δοκίμασε να τα γυρίσεις φυσώντας"]},
  {id:"octopus",title:"Χταπόδι μετρήσεων",en:"Counting octopus",icon:"🐙",ages:A2345,minutes:14,difficulty:1,theme:"Αριθμοί",materials:["Χαρτί","Κόλλα","Αριθμοί 1–8"],steps:["Κόψε 8 πλοκάμια","Βάλε τους αριθμούς","Κόλλησε στη σειρά","Μέτρα δυνατά"]},
  {id:"weather-wheel",title:"Τροχός του καιρού",en:"Weather wheel",icon:"🌦️",ages:A4556,minutes:18,difficulty:2,theme:"Καιρός",materials:["Χαρτόνι","Διπλόκαρφο","Χρώματα"],steps:["Χρωμάτισε σύμβολα καιρού","Κόψε τον τροχό","Βάλε δείκτη","Δείξε τον σημερινό καιρό"]},
  {id:"feelings-wheel",title:"Τροχός συναισθημάτων",en:"Feelings wheel",icon:"😊",ages:A4556,minutes:15,difficulty:2,theme:"Συναισθήματα",materials:["Χαρτόνι","Χρώματα","Διπλόκαρφο"],steps:["Ζωγράφισε 4 πρόσωπα","Ονόμασε τα συναισθήματα","Βάλε δείκτη","Διάλεξε πώς νιώθεις"]},
  {id:"leaf-crown",title:"Στέμμα φύλλων",en:"Leaf crown",icon:"🍂",ages:ALL,minutes:16,difficulty:1,theme:"Φθινόπωρο",materials:["Χαρτόνι","Πεσμένα φύλλα","Κόλλα"],steps:["Μάζεψε μόνο πεσμένα φύλλα","Ταξινόμησέ τα","Κόλλησέ τα στη λωρίδα","Φόρεσε το στέμμα"]},
  {id:"shape-city",title:"Πόλη από σχήματα",en:"Shape city",icon:"🏠",ages:A2345,minutes:18,difficulty:2,theme:"Σχήματα",materials:["Χρωματιστά χαρτιά","Κόλλα","Μαρκαδόροι"],steps:["Κόψε μεγάλα σχήματα","Φτιάξε σπίτια και δέντρα","Κόλλησε σε χαρτί","Ονόμασε τα σχήματα"]},
  {id:"moon-mobile",title:"Μόμπιλο φεγγαριού και αστεριών",en:"Moon and stars mobile",icon:"🌙",ages:A4556,minutes:22,difficulty:3,theme:"Ουρανός",materials:["Χαρτόνι","Κλωστή","Κόλλα"],steps:["Χρωμάτισε τα κομμάτια","Κόψε με βοήθεια","Δέσε σε διαφορετικά ύψη","Κρέμασέ το με έναν μεγάλο"]},
];

export type ColoringItem={id:string;title:string;en:string;icon:string;ages:PreschoolAge[];theme:string};
export const COLORING_V9:ColoringItem[]=[
  {id:"island",title:"Το νησί του Πισιπούκ",en:"Pisipouk island",icon:"🏝️",ages:ALL,theme:"Ελλάδα"},
  {id:"owl",title:"Ο Πισιπούκ πετάει",en:"Pisipouk flies",icon:"🦉",ages:ALL,theme:"Πισιπούκ"},
  {id:"sea",title:"Κάτω από το Αιγαίο",en:"Under the Aegean",icon:"🐠",ages:ALL,theme:"Θάλασσα"},
  {id:"garden",title:"Κήπος με πεταλούδες",en:"Butterfly garden",icon:"🦋",ages:ALL,theme:"Φύση"},
  {id:"autumn",title:"Φθινοπωρινό μονοπάτι",en:"Autumn path",icon:"🍂",ages:ALL,theme:"Φθινόπωρο"},
  {id:"space",title:"Ο Πισιπούκ στο διάστημα",en:"Pisipouk in space",icon:"🚀",ages:A4556,theme:"Διάστημα"},
  {id:"village",title:"Το ελληνικό χωριό",en:"Greek village",icon:"🏘️",ages:A4556,theme:"Ελλάδα"},
  {id:"farm",title:"Η μικρή φάρμα",en:"Little farm",icon:"🐔",ages:A2345,theme:"Ζώα"},
  {id:"weather",title:"Τέσσερις καιροί",en:"Four weathers",icon:"🌦️",ages:A4556,theme:"Καιρός"},
  {id:"feelings",title:"Πρόσωπα & συναισθήματα",en:"Faces & feelings",icon:"🙂",ages:A4556,theme:"Συναισθήματα"},
];

export type StoryItem={id:string;title:string;en:string;icon:string;ages:PreschoolAge[];theme:string;slides:{icon:string;el:string;en:string}[]};
export const STORIES_V9:StoryItem[]=[
  {id:"lost-star",title:"Ο Πισιπούκ και το χαμένο αστέρι",en:"Pisipouk and the lost star",icon:"⭐",ages:ALL,theme:"Καλοσύνη",slides:[{icon:"🌙",el:"Ένα βράδυ ένα μικρό αστέρι έπεσε απαλά σ’ ένα ελληνικό νησί.",en:"One evening a little star fell on a Greek island."},{icon:"🦉",el:"Ο Πισιπούκ άνοιξε τα φτερά του και αποφάσισε να το βοηθήσει.",en:"Pisipouk decided to help it."},{icon:"⛵",el:"Μαζί πέρασαν από λιμανάκι, ελιές και λευκά σπίτια.",en:"Together they passed the harbor, olive trees and white houses."},{icon:"⭐",el:"Το αστέρι γύρισε στον ουρανό και τους θύμισε πως η βοήθεια κάνει τον κόσμο φωτεινότερο.",en:"The star returned to the sky and reminded them that helping makes the world brighter."}]},
  {id:"little-boat",title:"Το μικρό καραβάκι και ο άνεμος",en:"The little boat and the wind",icon:"⛵",ages:A4556,theme:"Θάρρος",slides:[{icon:"⛵",el:"Ένα μικρό καραβάκι αγαπούσε τη θάλασσα αλλά φοβόταν τα κύματα.",en:"A little boat loved the sea but feared the waves."},{icon:"💨",el:"Ο άνεμος του είπε: «Προχώρα λίγο λίγο».",en:"The wind said: Move little by little."},{icon:"🐬",el:"Ένα δελφίνι κολύμπησε δίπλα του και μαζί μέτρησαν τρία κύματα.",en:"A dolphin swam beside it and together they counted three waves."},{icon:"☀️",el:"Το καραβάκι έμαθε πως το θάρρος μεγαλώνει με κάθε μικρή προσπάθεια.",en:"The boat learned that courage grows with every small try."}]},
  {id:"olive-tree",title:"Η μικρή ελιά που λύγιζε",en:"The little olive tree",icon:"🫒",ages:A4556,theme:"Ανθεκτικότητα",slides:[{icon:"🌱",el:"Μια μικρή ελιά ήθελε να γίνει δυνατή.",en:"A little olive tree wanted to become strong."},{icon:"💨",el:"Όταν φύσηξε ο άνεμος, λύγισε πολύ.",en:"When the wind blew, it bent low."},{icon:"🌧️",el:"Η βροχή πότισε τις ρίζες της και εκείνες δυνάμωσαν.",en:"Rain watered its roots."},{icon:"💚",el:"Κατάλαβε πως δύναμη είναι να λυγίζεις και να ξανασηκώνεσαι.",en:"It learned that strength is bending and rising again."}]},
  {id:"colors-party",title:"Η γιορτή των χρωμάτων",en:"The festival of colors",icon:"🌈",ages:A2345,theme:"Συνεργασία",slides:[{icon:"🔴",el:"Το κόκκινο, το κίτρινο και το μπλε ήθελαν όλα να είναι πρώτα.",en:"Red, yellow and blue all wanted to be first."},{icon:"🎨",el:"Ο Πισιπούκ πρότεινε να συνεργαστούν.",en:"Pisipouk suggested they work together."},{icon:"🟣",el:"Ανακατεύτηκαν και εμφανίστηκαν νέα χρώματα.",en:"They mixed and new colors appeared."},{icon:"🌈",el:"Έφτιαξαν ένα ουράνιο τόξο που χρειαζόταν όλα τα χρώματα.",en:"They made a rainbow that needed every color."}]},
  {id:"dolphin-map",title:"Το δελφίνι και ο κρυμμένος χάρτης",en:"The dolphin and the hidden map",icon:"🐬",ages:A4556,theme:"Προσανατολισμός",slides:[{icon:"🗺️",el:"Ο Πισιπούκ βρήκε έναν χάρτη με τρία σύμβολα.",en:"Pisipouk found a map with three symbols."},{icon:"🐬",el:"Ένα δελφίνι θυμόταν μόνο το πρώτο σημάδι.",en:"A dolphin remembered only the first clue."},{icon:"🌳",el:"Μαζί έβαλαν τα σημάδια στη σωστή σειρά.",en:"Together they put the clues in order."},{icon:"🎁",el:"Στον φάρο βρήκαν ένα κουτί με κοχύλια και μήνυμα για τη συνεργασία.",en:"At the lighthouse they found shells and a message about teamwork."}]},
  {id:"rain-cloud",title:"Το σύννεφο που φοβόταν τη βροχή",en:"The cloud afraid of rain",icon:"☁️",ages:A2345,theme:"Συναισθήματα",slides:[{icon:"☁️",el:"Ένα μικρό σύννεφο κρατούσε όλες τις σταγόνες μέσα του.",en:"A little cloud held all its drops inside."},{icon:"🦉",el:"Ο Πισιπούκ του είπε πως μερικές φορές βοηθά να αφήνουμε αυτό που νιώθουμε να βγει.",en:"Pisipouk said sometimes it helps to let feelings out."},{icon:"🌧️",el:"Το σύννεφο άφησε μια απαλή βροχή και ένιωσε πιο ελαφρύ.",en:"The cloud let out gentle rain and felt lighter."},{icon:"🌱",el:"Κάτω από τη βροχή φύτρωσαν λουλούδια.",en:"Flowers grew under the rain."}]},
  {id:"moon-letter",title:"Το γράμμα που έστειλε το φεγγάρι",en:"The moon's letter",icon:"🌙",ages:A56,theme:"Γλώσσα",slides:[{icon:"✉️",el:"Ο Πισιπούκ βρήκε ένα γράμμα στο παράθυρο.",en:"Pisipouk found a letter at the window."},{icon:"Μ",el:"Το γράμμα είχε ένα μεγάλο Μ και τρεις ζωγραφιές.",en:"The letter had one big M and three drawings."},{icon:"🍎",el:"Έψαξε λέξεις που αρχίζουν από Μ: μήλο, μέλι, μουσική.",en:"He searched for words beginning with M."},{icon:"🌙",el:"Το φεγγάρι χαμογέλασε: το μυστικό μήνυμα ήταν «Μπράβο!».",en:"The moon smiled: the secret message was Well done!"}]},
  {id:"seed-trip",title:"Το ταξίδι ενός μικρού σπόρου",en:"A little seed's journey",icon:"🌱",ages:ALL,theme:"Φύση",slides:[{icon:"🌰",el:"Ένας μικρός σπόρος ταξίδευε με τον άνεμο.",en:"A little seed travelled with the wind."},{icon:"🌧️",el:"Η βροχή τον βοήθησε να βρει μαλακό χώμα.",en:"Rain helped it find soft soil."},{icon:"🌿",el:"Με ήλιο και νερό φύτρωσε ένα μικρό βλαστάρι.",en:"With sun and water a sprout appeared."},{icon:"🌻",el:"Μια μέρα έγινε λουλούδι και έδωσε νέους σπόρους.",en:"One day it became a flower and made new seeds."}]},
];

export type MoveItem={id:string;title:string;en:string;icon:string;ages:PreschoolAge[];seconds:number;kind:"move"|"nature"|"music"|"calm";prompt:string};
export const MOVES_V9:MoveItem[]=[
  {id:"island-dance",title:"Χορός του νησιού",en:"Island dance",icon:"💃",ages:ALL,seconds:40,kind:"music",prompt:"Χόρεψε και πάγωσε όταν σταματήσει ο ρυθμός."},
  {id:"frog-jumps",title:"Βατραχάκια",en:"Frog jumps",icon:"🐸",ages:A2345,seconds:30,kind:"move",prompt:"Κάνε 8 μικρά πηδηματάκια σαν βατραχάκι."},
  {id:"color-hunt",title:"Κυνήγι χρωμάτων",en:"Color hunt",icon:"🌈",ages:ALL,seconds:60,kind:"nature",prompt:"Βρες 4 διαφορετικά χρώματα γύρω σου."},
  {id:"wave-breath",title:"Ανάσα σαν κύμα",en:"Wave breathing",icon:"🌊",ages:ALL,seconds:45,kind:"calm",prompt:"Τρεις αργές αναπνοές με τα χέρια να ανεβοκατεβαίνουν."},
  {id:"animal-walk",title:"Περπάτημα ζώων",en:"Animal walk",icon:"🐻",ages:A2345,seconds:45,kind:"move",prompt:"Περπάτησε σαν αρκούδα, καβούρι και γάτα."},
  {id:"balance-island",title:"Νησί ισορροπίας",en:"Balance island",icon:"🏝️",ages:A4556,seconds:45,kind:"move",prompt:"Στάσου στο ένα πόδι σαν να είσαι σε μικρό νησί."},
  {id:"sound-hunt",title:"Κυνήγι ήχων",en:"Sound hunt",icon:"👂",ages:ALL,seconds:60,kind:"nature",prompt:"Μείνε ήσυχος και βρες 3 διαφορετικούς ήχους."},
  {id:"leaf-search",title:"Αποστολή φύλλων",en:"Leaf mission",icon:"🍃",ages:ALL,seconds:90,kind:"nature",prompt:"Βρες δύο διαφορετικά πεσμένα φύλλα και σύγκρινέ τα."},
  {id:"clap-copy",title:"Αντέγραψε τον ρυθμό",en:"Copy the rhythm",icon:"👏",ages:ALL,seconds:40,kind:"music",prompt:"Χτύπα: παλαμάκι, παλαμάκι, γόνατο — και επανάλαβε."},
  {id:"statue",title:"Μουσικά αγάλματα",en:"Musical statues",icon:"🗿",ages:ALL,seconds:50,kind:"music",prompt:"Κινήσου και όταν δεις ⭐ πάγωσε σαν άγαλμα."},
  {id:"slow-fast",title:"Αργά και γρήγορα",en:"Slow and fast",icon:"🐢",ages:A2345,seconds:45,kind:"move",prompt:"Περπάτησε πρώτα σαν χελώνα και μετά σαν λαγός."},
  {id:"kindness-mission",title:"Μυστική αποστολή καλοσύνης",en:"Kindness mission",icon:"💛",ages:A4556,seconds:60,kind:"calm",prompt:"Σκέψου μία μικρή βοήθεια που μπορείς να κάνεις σήμερα."},
];
