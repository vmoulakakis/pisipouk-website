import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Download, Eraser, Paintbrush, Printer, RotateCcw, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/pisipoukApi";
import pisipoukLogo from "@/assets/pisipouk-logo.webp";

export const Route = createFileRoute("/virtual-preschool")({
  head: () => ({
    meta: [
      { title: "Εικονικός Παιδικός Σταθμός | Ο Πισιπούκ" },
      {
        name: "description",
        content:
          "Online ζωγραφική για παιδιά 2–6 ετών στον Πισιπούκ, με σχέδια ανά ηλικία, κανονικό πινέλο, αποθήκευση και εκτύπωση.",
      },
    ],
  }),
  component: VirtualPreschool,
});

const COLORS = ["#ef4444","#f97316","#facc15","#22c55e","#06b6d4","#3b82f6","#8b5cf6","#ec4899","#8b5e3c","#111827"];

const AGE_META = {
  "2–3": {
    title: "Τα πρώτα μου χρώματα",
    description: "Μεγάλα σχήματα, παχιά περιγράμματα και ένα καθαρό θέμα.",
    accent: "from-rose-100 via-pink-50 to-orange-50",
    emoji: "🧸",
  },
  "4–5": {
    title: "Παίζω με ιστορίες",
    description: "Περισσότερα αντικείμενα, χαρακτήρες και μικρές σκηνές.",
    accent: "from-sky-100 via-cyan-50 to-indigo-50",
    emoji: "🚀",
  },
  "5–6": {
    title: "Δημιουργώ ολόκληρες σκηνές",
    description: "Πιο σύνθετες εικόνες, φόντο και πολλές περιοχές για χρώμα.",
    accent: "from-emerald-100 via-lime-50 to-teal-50",
    emoji: "🏰",
  },
} as const;

type Design = {
  id: string;
  title: string;
  emoji: string;
  age: "2–3" | "4–5" | "5–6";
  level: "Εύκολο" | "Μεσαίο" | "Πιο λεπτομερές";
};

type Craft = {
  id: string;
  title: string;
  emoji: string;
  age: "2–3" | "4–5" | "5–6";
  season: "Όλο τον χρόνο" | "Φθινόπωρο" | "Χριστούγεννα" | "Απόκριες" | "25η Μαρτίου" | "Πάσχα" | "Καλοκαίρι" | "28η Οκτωβρίου";
  materials: string[];
  steps: string[];
};

const CRAFTS: Craft[] = [
  { id: "leaf-collage", title: "Κολάζ με φθινοπωρινά φύλλα", emoji: "🍂", age: "2–3", season: "Φθινόπωρο", materials: ["χαρτόνι", "φύλλα", "κόλλα"], steps: ["Μαζεύουμε φύλλα.", "Τα ακουμπάμε πάνω στο χαρτόνι.", "Κολλάμε ελεύθερα και δημιουργούμε ένα μεγάλο δέντρο."] },
  { id: "paper-sun", title: "Ήλιος με χάρτινες ακτίνες", emoji: "☀️", age: "2–3", season: "Όλο τον χρόνο", materials: ["κίτρινο χαρτί", "κόλλα", "κηρομπογιές"], steps: ["Χρωματίζουμε έναν μεγάλο κύκλο.", "Κολλάμε χάρτινες λωρίδες γύρω του.", "Ζωγραφίζουμε ένα χαμογελαστό πρόσωπο."] },
  { id: "apple-stamp", title: "Τυπώματα με μήλο", emoji: "🍎", age: "2–3", season: "Φθινόπωρο", materials: ["μήλο κομμένο από ενήλικα", "τέμπερα", "χαρτί"], steps: ["Ο ενήλικας κόβει το μήλο.", "Βουτάμε απαλά στην τέμπερα.", "Κάνουμε μεγάλα τυπώματα στο χαρτί."] },
  { id: "easter-egg-stickers", title: "Πασχαλινό αυγό με χαρτάκια", emoji: "🥚", age: "2–3", season: "Πάσχα", materials: ["χαρτόνι", "χρωματιστά χαρτάκια", "κόλλα"], steps: ["Κόβουμε ένα μεγάλο αυγό.", "Σκίζουμε μικρά χρωματιστά χαρτάκια.", "Τα κολλάμε πάνω στο αυγό."] },
  { id: "summer-fish", title: "Ψαράκι με πολύχρωμα λέπια", emoji: "🐟", age: "2–3", season: "Καλοκαίρι", materials: ["χάρτινο ψαράκι", "κύκλοι χαρτιού", "κόλλα"], steps: ["Διαλέγουμε χρώματα.", "Κολλάμε κύκλους σαν λέπια.", "Προσθέτουμε μάτι και χαμόγελο."] },
  { id: "christmas-tree-dots", title: "Χριστουγεννιάτικο δέντρο με βούλες", emoji: "🎄", age: "2–3", season: "Χριστούγεννα", materials: ["πράσινο χαρτόνι", "δαχτυλομπογιές", "αστέρι χαρτιού"], steps: ["Φτιάχνουμε το τρίγωνο του δέντρου.", "Βάζουμε χρωματιστές βούλες με το δάχτυλο.", "Κολλάμε το αστέρι στην κορυφή."] },

  { id: "paper-butterfly", title: "Πεταλούδα με συμμετρικά χρώματα", emoji: "🦋", age: "4–5", season: "Όλο τον χρόνο", materials: ["χαρτί", "τέμπερες", "μαρκαδόρος"], steps: ["Διπλώνουμε το χαρτί στη μέση.", "Βάζουμε χρώματα στη μία πλευρά.", "Κλείνουμε, πιέζουμε και ανοίγουμε για συμμετρικά φτερά."] },
  { id: "rocket-roll", title: "Πύραυλος από ρολό χαρτιού", emoji: "🚀", age: "4–5", season: "Όλο τον χρόνο", materials: ["ρολό χαρτιού", "χαρτόνια", "κόλλα"], steps: ["Ντύνουμε το ρολό με χαρτί.", "Προσθέτουμε μύτη και πτερύγια.", "Κολλάμε λωρίδες σαν φλόγες."] },
  { id: "greek-flag-collage", title: "Ελληνική σημαία με κολάζ", emoji: "🇬🇷", age: "4–5", season: "28η Οκτωβρίου", materials: ["μπλε και λευκό χαρτί", "κόλλα", "χαρτόνι"], steps: ["Χωρίζουμε τη σημαία σε λωρίδες.", "Κολλάμε μπλε και λευκά κομμάτια.", "Προσθέτουμε τον σταυρό με βοήθεια ενήλικα."] },
  { id: "mask-craft", title: "Αποκριάτικη μάσκα", emoji: "🎭", age: "4–5", season: "Απόκριες", materials: ["χαρτόνι", "λάστιχο", "πούλιες ή χαρτάκια"], steps: ["Σχεδιάζουμε το σχήμα της μάσκας.", "Διακοσμούμε με χρώματα και κολλάζ.", "Ο ενήλικας ανοίγει τρύπες και περνά το λάστιχο."] },
  { id: "easter-bunny-cup", title: "Λαγουδάκι από χάρτινο ποτηράκι", emoji: "🐰", age: "4–5", season: "Πάσχα", materials: ["χάρτινο ποτηράκι", "χαρτί", "κόλλα", "μαρκαδόρος"], steps: ["Κολλάμε δύο μεγάλα αυτιά.", "Ζωγραφίζουμε μάτια και μουσούδα.", "Προσθέτουμε ουρίτσα από χαρτί."] },
  { id: "boat-craft", title: "Καραβάκι με χάρτινο πανί", emoji: "⛵", age: "4–5", season: "Καλοκαίρι", materials: ["χαρτόνι", "καλαμάκι", "χρωματιστό χαρτί"], steps: ["Φτιάχνουμε τη βάση του καραβιού.", "Ο ενήλικας στερεώνει το καλαμάκι.", "Προσθέτουμε πανί και ζωγραφίζουμε κύματα."] },

  { id: "forest-diorama", title: "Μικρό δάσος σε κουτί", emoji: "🌲", age: "5–6", season: "Φθινόπωρο", materials: ["μικρό κουτί", "χαρτόνια", "φύλλα", "κόλλα"], steps: ["Ντύνουμε το εσωτερικό του κουτιού.", "Φτιάχνουμε δέντρα και ζωάκια από χαρτί.", "Στήνουμε τα στοιχεία σε διαφορετικά επίπεδα."] },
  { id: "city-recycle", title: "Μικρή πόλη από ανακυκλώσιμα", emoji: "🏙️", age: "5–6", season: "Όλο τον χρόνο", materials: ["κουτάκια", "ρολά", "χαρτόνι", "κόλλα"], steps: ["Διαλέγουμε κτίρια και οχήματα.", "Ντύνουμε τα κουτάκια με χαρτί.", "Στήνουμε δρόμους και μικρή γειτονιά."] },
  { id: "peace-dove", title: "Περιστέρι ειρήνης", emoji: "🕊️", age: "5–6", season: "28η Οκτωβρίου", materials: ["λευκό χαρτόνι", "μπλε χαρτί", "κορδέλα"], steps: ["Σχεδιάζουμε το περίγραμμα του περιστεριού.", "Κόβουμε με βοήθεια ενήλικα.", "Προσθέτουμε κλαδί ή μπλε-λευκές λεπτομέρειες."] },
  { id: "march-wreath", title: "Ανοιξιάτικο στεφάνι", emoji: "🌼", age: "5–6", season: "25η Μαρτίου", materials: ["χάρτινο πιάτο", "χρωματιστά χαρτιά", "κόλλα"], steps: ["Ο ενήλικας αφαιρεί το κέντρο του πιάτου.", "Φτιάχνουμε λουλούδια και φύλλα.", "Τα κολλάμε γύρω από το στεφάνι."] },
  { id: "christmas-village", title: "Χριστουγεννιάτικο χωριό", emoji: "🏠", age: "5–6", season: "Χριστούγεννα", materials: ["χαρτόκουτα", "λευκό χαρτί", "βαμβάκι", "κόλλα"], steps: ["Φτιάχνουμε μικρά σπιτάκια.", "Προσθέτουμε πόρτες, παράθυρα και σκεπές.", "Στήνουμε χιονισμένο χωριό με βαμβάκι."] },
  { id: "summer-aquarium", title: "Τρισδιάστατο ενυδρείο", emoji: "🐠", age: "5–6", season: "Καλοκαίρι", materials: ["χάρτινο κουτί", "νήμα", "χαρτόνια", "κόλλα"], steps: ["Ζωγραφίζουμε το εσωτερικό σαν θάλασσα.", "Φτιάχνουμε ψάρια και φύκια.", "Κρεμάμε τα ψάρια με νήμα από την οροφή του κουτιού."] },
];

const DESIGNS: Design[] = [
  // 2–3: μεγάλα, καθαρά αντικείμενα
  { id: "sun", title: "Ήλιος", emoji: "☀️", age: "2–3", level: "Εύκολο" },
  { id: "apple", title: "Μήλο", emoji: "🍎", age: "2–3", level: "Εύκολο" },
  { id: "balloon", title: "Μπαλόνι", emoji: "🎈", age: "2–3", level: "Εύκολο" },
  { id: "cat", title: "Γατούλα", emoji: "🐱", age: "2–3", level: "Εύκολο" },
  { id: "fish", title: "Ψαράκι", emoji: "🐠", age: "2–3", level: "Εύκολο" },
  { id: "flower", title: "Λουλούδι", emoji: "🌼", age: "2–3", level: "Εύκολο" },
  { id: "duck", title: "Παπάκι", emoji: "🐤", age: "2–3", level: "Εύκολο" },
  { id: "car", title: "Αυτοκινητάκι", emoji: "🚗", age: "2–3", level: "Εύκολο" },
  { id: "cloud", title: "Σύννεφο & βροχή", emoji: "🌧️", age: "2–3", level: "Εύκολο" },
  { id: "star", title: "Αστεράκι", emoji: "⭐", age: "2–3", level: "Εύκολο" },
  { id: "house", title: "Σπιτάκι", emoji: "🏠", age: "2–3", level: "Εύκολο" },
  { id: "icecream", title: "Παγωτό", emoji: "🍦", age: "2–3", level: "Εύκολο" },
  { id: "turtle", title: "Χελωνίτσα", emoji: "🐢", age: "2–3", level: "Εύκολο" },
  { id: "bear", title: "Αρκουδάκι", emoji: "🧸", age: "2–3", level: "Εύκολο" },
  { id: "pisipouk-easy", title: "Ο Πισιπούκ", emoji: "🐻", age: "2–3", level: "Εύκολο" },

  // 4–5: μικρές σκηνές και περισσότερα στοιχεία
  { id: "bunny", title: "Κουνελάκι", emoji: "🐰", age: "4–5", level: "Μεσαίο" },
  { id: "elephant", title: "Ελεφαντάκι", emoji: "🐘", age: "4–5", level: "Μεσαίο" },
  { id: "train", title: "Τρενάκι", emoji: "🚂", age: "4–5", level: "Μεσαίο" },
  { id: "firetruck", title: "Πυροσβεστικό", emoji: "🚒", age: "4–5", level: "Μεσαίο" },
  { id: "unicorn", title: "Μονόκερος", emoji: "🦄", age: "4–5", level: "Μεσαίο" },
  { id: "butterfly", title: "Πεταλούδα", emoji: "🦋", age: "4–5", level: "Μεσαίο" },
  { id: "dino", title: "Δεινόσαυρος", emoji: "🦕", age: "4–5", level: "Μεσαίο" },
  { id: "rocket", title: "Πύραυλος", emoji: "🚀", age: "4–5", level: "Μεσαίο" },
  { id: "seabed", title: "Μικρός βυθός", emoji: "🐟", age: "4–5", level: "Μεσαίο" },
  { id: "fruit-basket", title: "Καλάθι με φρούτα", emoji: "🍓", age: "4–5", level: "Μεσαίο" },
  { id: "bee-garden", title: "Μέλισσα στον κήπο", emoji: "🐝", age: "4–5", level: "Μεσαίο" },
  { id: "airplane", title: "Αεροπλανάκι", emoji: "✈️", age: "4–5", level: "Μεσαίο" },
  { id: "boat", title: "Καραβάκι", emoji: "⛵", age: "4–5", level: "Μεσαίο" },
  { id: "pisipouk-balloon", title: "Πισιπούκ με μπαλόνι", emoji: "🐻", age: "4–5", level: "Μεσαίο" },
  { id: "pisipouk-garden", title: "Πισιπούκ στον κήπο", emoji: "🐻", age: "4–5", level: "Μεσαίο" },

  // 5–6: σύνθετες σκηνές / περισσότερες περιοχές
  { id: "dino-scene", title: "Δεινόσαυρος στο δάσος", emoji: "🦕", age: "5–6", level: "Πιο λεπτομερές" },
  { id: "space-scene", title: "Διάστημα & πλανήτες", emoji: "🚀", age: "5–6", level: "Πιο λεπτομερές" },
  { id: "farm-scene", title: "Αγρόκτημα", emoji: "🚜", age: "5–6", level: "Πιο λεπτομερές" },
  { id: "ocean-scene", title: "Βυθός", emoji: "🐙", age: "5–6", level: "Πιο λεπτομερές" },
  { id: "castle-scene", title: "Κάστρο & ουράνιο τόξο", emoji: "🏰", age: "5–6", level: "Πιο λεπτομερές" },
  { id: "garden-scene", title: "Κήπος με έντομα", emoji: "🌻", age: "5–6", level: "Πιο λεπτομερές" },
  { id: "forest-scene", title: "Ζωάκια στο δάσος", emoji: "🦊", age: "5–6", level: "Πιο λεπτομερές" },
  { id: "construction-scene", title: "Εργοτάξιο", emoji: "🚧", age: "5–6", level: "Πιο λεπτομερές" },
  { id: "park-scene", title: "Παιχνίδι στο πάρκο", emoji: "🛝", age: "5–6", level: "Πιο λεπτομερές" },
  { id: "classroom-scene", title: "Η τάξη μας", emoji: "🎨", age: "5–6", level: "Πιο λεπτομερές" },
  { id: "beach-scene", title: "Μέρα στην παραλία", emoji: "🏖️", age: "5–6", level: "Πιο λεπτομερές" },
  { id: "city-scene", title: "Μικρή πόλη", emoji: "🏘️", age: "5–6", level: "Πιο λεπτομερές" },
  { id: "weather-scene", title: "Ο καιρός", emoji: "🌦️", age: "5–6", level: "Πιο λεπτομερές" },
  { id: "pisipouk-class", title: "Ο Πισιπούκ στην τάξη", emoji: "🐻", age: "5–6", level: "Πιο λεπτομερές" },
  { id: "pisipouk-adventure", title: "Η περιπέτεια του Πισιπούκ", emoji: "🐻", age: "5–6", level: "Πιο λεπτομερές" },
];

const outlineStyle = (id: string) => {
  const age = DESIGNS.find((design) => design.id === id)?.age ?? "4–5";
  const strokeWidth = age === "2–3" ? 9 : age === "4–5" ? 6.5 : 5;
  return {
    fill: "#fff",
    stroke: "#111827",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
};

function Outline({ id }: { id: string }) {
  const common = outlineStyle(id);
  if (id === "sun") return <>
    <circle {...common} cx="450" cy="325" r="130"/>
    {Array.from({length:12}).map((_,i)=>{const a=i*Math.PI/6;return <line key={i} x1={450+Math.cos(a)*180} y1={325+Math.sin(a)*180} x2={450+Math.cos(a)*245} y2={325+Math.sin(a)*245} {...common}/>})}
    <circle cx="405" cy="300" r="12" fill="#111"/><circle cx="495" cy="300" r="12" fill="#111"/>
    <path d="M400 365 Q450 410 500 365" {...common} fill="none"/>
  </>;

  if (id === "apple") return <>
    <path {...common} d="M450 185 Q335 135 265 255 Q205 390 305 515 Q380 595 450 545 Q520 595 595 515 Q695 390 635 255 Q565 135 450 185Z"/>
    <path d="M450 190 Q445 120 500 85" {...common} fill="none"/>
    <path {...common} d="M500 105 Q565 75 600 125 Q550 160 495 140Z"/>
  </>;

  if (id === "balloon") return <>
    <ellipse {...common} cx="450" cy="250" rx="170" ry="190"/>
    <path {...common} d="M420 430 L480 430 L450 475Z"/>
    <path d="M450 475 Q390 535 470 585 Q535 625 565 575" {...common} fill="none"/>
  </>;

  if (id === "cat") return <>
    <path {...common} d="M285 175 L330 105 L370 170 Q450 130 530 170 L570 105 L615 175 Q650 230 625 335 Q605 430 450 455 Q295 430 275 335 Q250 230 285 175Z"/>
    <circle cx="385" cy="275" r="10" fill="#111"/><circle cx="515" cy="275" r="10" fill="#111"/>
    <path d="M425 320 Q450 340 475 320 M450 337 Q450 370 415 380 M450 337 Q450 370 485 380" {...common} fill="none" strokeWidth={6}/>
    <path d="M300 315 L205 290 M300 340 L195 340 M600 315 L695 290 M600 340 L705 340" {...common} fill="none" strokeWidth={5}/>
    <path {...common} d="M335 455 Q270 520 330 570 Q450 620 570 570 Q630 520 565 455"/>
  </>;

  if (id === "fish") return <>
    <ellipse {...common} cx="430" cy="330" rx="220" ry="135"/>
    <path {...common} d="M640 330 L760 225 L760 435Z"/>
    <circle cx="330" cy="300" r="12" fill="#111"/>
    <path d="M285 355 Q320 380 355 355" {...common} fill="none" strokeWidth={6}/>
    <circle {...common} cx="150" cy="180" r="28"/><circle {...common} cx="105" cy="120" r="16"/>
  </>;

  if (id === "flower") return <>
    <circle {...common} cx="450" cy="260" r="70"/>
    {Array.from({length:8}).map((_,i)=>{const a=i*Math.PI/4;return <ellipse key={i} {...common} cx={450+Math.cos(a)*120} cy={260+Math.sin(a)*120} rx="48" ry="80" transform={`rotate(${i*45} ${450+Math.cos(a)*120} ${260+Math.sin(a)*120})`}/>})}
    <path {...common} d="M430 390 Q385 500 410 590 H490 Q515 500 470 390Z"/>
    <path d="M410 475 Q340 430 300 490 M490 475 Q560 430 600 490" {...common} fill="none"/>
  </>;

  if (id === "bunny") return <>
    <ellipse {...common} cx="350" cy="165" rx="55" ry="125"/><ellipse {...common} cx="550" cy="165" rx="55" ry="125"/>
    <ellipse {...common} cx="450" cy="330" rx="185" ry="165"/>
    <circle cx="385" cy="300" r="10" fill="#111"/><circle cx="515" cy="300" r="10" fill="#111"/>
    <path d="M430 350 Q450 365 470 350 M450 365 Q430 395 405 400 M450 365 Q470 395 495 400" {...common} fill="none" strokeWidth={6}/>
    <ellipse {...common} cx="450" cy="525" rx="165" ry="70"/><circle {...common} cx="660" cy="500" r="55"/>
  </>;

  if (id === "elephant") return <>
    <ellipse {...common} cx="430" cy="310" rx="230" ry="155"/><circle {...common} cx="610" cy="285" r="110"/>
    <ellipse {...common} cx="545" cy="285" rx="75" ry="95"/>
    <path d="M690 300 Q735 340 700 455 Q675 515 720 535" {...common} fill="none"/>
    <circle cx="640" cy="260" r="10" fill="#111"/>
    <path d="M260 420 L250 560 M390 450 L390 565 M520 450 L520 565" {...common} fill="none"/>
    <path d="M215 320 Q150 285 135 345" {...common} fill="none"/>
  </>;

  if (id === "train") return <>
    <rect {...common} x="180" y="250" width="300" height="220" rx="22"/><rect {...common} x="480" y="310" width="165" height="160" rx="18"/>
    <rect {...common} x="225" y="175" width="80" height="85" rx="8"/><path {...common} d="M160 250 H500 L455 180 H210Z"/>
    <circle {...common} cx="260" cy="500" r="55"/><circle {...common} cx="430" cy="500" r="55"/><circle {...common} cx="575" cy="500" r="55"/>
    <path d="M295 175 Q260 120 305 95 Q350 75 360 120" {...common} fill="none"/>
  </>;

  if (id === "firetruck") return <>
    <rect {...common} x="165" y="270" width="500" height="210" rx="25"/><path {...common} d="M500 270 L590 185 L665 185 L720 270Z"/>
    <rect {...common} x="550" y="220" width="90" height="70" rx="8"/>
    <circle {...common} cx="285" cy="500" r="62"/><circle {...common} cx="620" cy="500" r="62"/>
    <path d="M210 250 L520 120 M260 250 L570 120 M300 225 L325 185 M360 200 L385 160 M420 175 L445 135" {...common} fill="none"/>
  </>;

  if (id === "unicorn") return <>
    <ellipse {...common} cx="450" cy="345" rx="195" ry="155"/>
    <path {...common} d="M360 220 Q320 115 405 125 L450 205"/><path {...common} d="M490 205 L555 90 L590 210"/>
    <path {...common} d="M520 175 L565 65 L600 180"/>
    <circle cx="390" cy="325" r="10" fill="#111"/><circle cx="510" cy="325" r="10" fill="#111"/>
    <path d="M410 390 Q450 420 490 390" {...common} fill="none" strokeWidth={6}/>
    <path d="M335 455 Q300 535 355 565 M565 455 Q600 535 545 565" {...common} fill="none"/>
  </>;

  if (id === "butterfly") return <>
    <ellipse {...common} cx="450" cy="335" rx="38" ry="180"/>
    <path {...common} d="M405 260 Q270 125 190 220 Q150 305 285 355 Q155 420 220 520 Q315 580 405 420Z"/>
    <path {...common} d="M495 260 Q630 125 710 220 Q750 305 615 355 Q745 420 680 520 Q585 580 495 420Z"/>
    <circle {...common} cx="450" cy="135" r="42"/>
    <circle {...common} cx="285" cy="275" r="45"/><circle {...common} cx="615" cy="275" r="45"/>
    <circle {...common} cx="300" cy="445" r="35"/><circle {...common} cx="600" cy="445" r="35"/>
  </>;

  if (id === "dino-scene") return <>
    <path {...common} d="M175 480 Q155 350 235 270 Q310 195 430 215 Q505 120 620 145 Q730 170 710 255 Q690 315 610 315 L575 470 Q520 515 465 470 L425 395 Q380 450 315 465 L285 555 L215 555 L230 465Z"/>
    <circle cx="645" cy="205" r="10" fill="#111"/>
    <path d="M290 245 L330 175 L365 230 L410 160 L450 220 L500 155 L535 215" {...common} fill="none"/>
    <path {...common} d="M95 555 Q130 430 170 555Z M710 555 Q750 410 795 555Z"/>
    <circle {...common} cx="120" cy="180" r="55"/><path d="M120 90 L120 55 M45 180 L10 180 M195 180 L230 180 M65 125 L40 100 M175 125 L200 100" {...common} fill="none" strokeWidth={6}/>
    <path d="M70 575 Q220 520 370 575 Q540 520 830 575" {...common} fill="none"/>
  </>;

  if (id === "space-scene") return <>
    <path {...common} d="M450 120 Q555 195 555 340 Q555 445 450 505 Q345 445 345 340 Q345 195 450 120Z"/>
    <circle {...common} cx="450" cy="285" r="60"/>
    <path {...common} d="M345 365 L270 440 L350 445 M555 365 L630 440 L550 445"/>
    <path {...common} d="M410 495 Q450 590 490 495"/>
    <circle {...common} cx="170" cy="175" r="70"/><path {...common} d="M110 185 Q170 125 230 185"/>
    <circle {...common} cx="730" cy="210" r="55"/><path d="M665 210 Q730 175 795 210" {...common} fill="none"/>
    <path d="M120 390 L155 390 M138 372 L138 408 M720 430 L755 430 M738 412 L738 448 M250 95 L280 95 M265 80 L265 110" {...common} fill="none" strokeWidth={6}/>
  </>;

  if (id === "farm-scene") return <>
    <path {...common} d="M120 365 L300 210 L480 365Z"/><rect {...common} x="150" y="365" width="300" height="205"/>
    <rect {...common} x="245" y="430" width="110" height="140"/><rect {...common} x="185" y="395" width="70" height="65"/>
    <path {...common} d="M535 440 H735 L790 490 V565 H535Z"/><circle {...common} cx="590" cy="565" r="48"/><circle {...common} cx="720" cy="565" r="48"/>
    <circle {...common} cx="650" cy="255" r="85"/><path d="M650 340 L650 520" {...common} fill="none"/>
    <path {...common} d="M70 575 Q250 520 430 575 Q610 520 830 575"/>
    <path d="M95 500 L95 575 M125 500 L125 575 M95 525 H125" {...common} fill="none" strokeWidth={5}/>
  </>;

  if (id === "ocean-scene") return <>
    <path d="M0 140 Q110 95 220 140 Q330 185 440 140 Q550 95 660 140 Q770 185 900 140" {...common} fill="none"/>
    <ellipse {...common} cx="300" cy="325" rx="145" ry="85"/><path {...common} d="M440 325 L535 250 L535 400Z"/>
    <circle cx="250" cy="300" r="9" fill="#111"/>
    <path {...common} d="M610 280 Q690 235 745 300 Q785 350 730 410 Q655 470 595 405 Q550 340 610 280Z"/>
    <circle cx="690" cy="315" r="8" fill="#111"/>
    <path d="M620 450 Q585 505 620 560 M675 455 Q650 515 675 570 M730 445 Q770 505 735 565" {...common} fill="none"/>
    <path {...common} d="M120 560 Q150 485 185 560 M195 560 Q225 470 255 560 M780 560 Q810 470 845 560"/>
    <circle {...common} cx="120" cy="250" r="18"/><circle {...common} cx="95" cy="210" r="11"/>
  </>;

  if (id === "castle-scene") return <>
    <rect {...common} x="250" y="270" width="400" height="300"/>
    <rect {...common} x="165" y="330" width="120" height="240"/><rect {...common} x="615" y="330" width="120" height="240"/>
    <path {...common} d="M150 330 L180 270 L210 330 L240 270 L270 330Z M600 330 L630 270 L660 330 L690 270 L720 330Z"/>
    <path {...common} d="M390 570 V430 Q450 365 510 430 V570Z"/>
    <rect {...common} x="320" y="330" width="70" height="70"/><rect {...common} x="510" y="330" width="70" height="70"/>
    <path d="M115 260 Q180 135 300 170 Q450 40 600 170 Q720 135 785 260" {...common} fill="none"/>
    <circle {...common} cx="115" cy="155" r="50"/>
    <path d="M60 155 H20 M170 155 H210 M115 100 V60" {...common} fill="none" strokeWidth={6}/>
  </>;

  if (id === "duck") return <>
    <ellipse {...common} cx="430" cy="340" rx="180" ry="120"/>
    <circle {...common} cx="585" cy="285" r="85"/>
    <path {...common} d="M655 285 L755 325 L655 350Z"/>
    <circle cx="610" cy="260" r="9" fill="#111"/>
    <path {...common} d="M300 445 Q260 515 305 545 M465 445 Q430 520 475 550"/>
  </>;

  if (id === "car") return <>
    <path {...common} d="M190 395 L245 285 H575 L680 395 V485 H190Z"/>
    <path {...common} d="M315 285 L380 205 H520 L575 285Z"/>
    <circle {...common} cx="300" cy="500" r="62"/><circle {...common} cx="575" cy="500" r="62"/>
    <rect {...common} x="385" y="225" width="115" height="60" rx="10"/>
  </>;

  if (id === "cloud") return <>
    <path {...common} d="M255 330 Q265 245 350 250 Q390 165 485 220 Q590 200 615 295 Q705 300 705 380 H230 Q205 345 255 330Z"/>
    <path d="M300 430 L275 500 M390 430 L365 500 M480 430 L455 500 M570 430 L545 500" {...common} fill="none"/>
  </>;

  if (id === "star") return <>
    <path {...common} d="M450 105 L500 245 L650 250 L530 340 L575 485 L450 400 L325 485 L370 340 L250 250 L400 245Z"/>
    <circle cx="410" cy="285" r="10" fill="#111"/><circle cx="490" cy="285" r="10" fill="#111"/>
    <path d="M410 340 Q450 375 490 340" {...common} fill="none" strokeWidth={6}/>
  </>;

  if (id === "house") return <>
    <path {...common} d="M210 320 L450 125 L690 320Z"/>
    <rect {...common} x="255" y="320" width="390" height="255"/>
    <rect {...common} x="400" y="420" width="100" height="155"/>
    <rect {...common} x="305" y="370" width="75" height="75"/><rect {...common} x="520" y="370" width="75" height="75"/>
  </>;

  if (id === "icecream") return <>
    <circle {...common} cx="450" cy="220" r="115"/>
    <path {...common} d="M340 315 H560 L450 575Z"/>
    <path d="M385 365 L520 500 M515 365 L380 500" {...common} fill="none" strokeWidth={5}/>
  </>;

  if (id === "turtle") return <>
    <ellipse {...common} cx="430" cy="340" rx="210" ry="140"/>
    <circle {...common} cx="655" cy="335" r="70"/>
    <circle cx="680" cy="315" r="8" fill="#111"/>
    <path {...common} d="M300 230 Q260 180 225 230 M300 450 Q255 505 220 455 M540 225 Q585 175 620 225 M535 455 Q585 510 620 455"/>
    <path d="M350 260 L510 420 M510 260 L350 420 M430 210 V470 M225 340 L635 340" {...common} fill="none" strokeWidth={5}/>
  </>;

  if (id === "bear" || id === "pisipouk-easy") return <>
    <circle {...common} cx="335" cy="185" r="70"/><circle {...common} cx="565" cy="185" r="70"/>
    <ellipse {...common} cx="450" cy="330" rx="190" ry="175"/>
    <circle cx="390" cy="300" r="10" fill="#111"/><circle cx="510" cy="300" r="10" fill="#111"/>
    <ellipse {...common} cx="450" cy="365" rx="70" ry="50"/>
    <circle cx="450" cy="350" r="12" fill="#111"/>
    <path {...common} d="M330 480 Q285 545 335 585 M570 480 Q615 545 565 585"/>
    {id === "pisipouk-easy" ? <path {...common} d="M330 140 Q450 55 570 140 Q500 110 450 120 Q400 110 330 140Z"/> : null}
  </>;

  if (id === "dino") return <>
    <path {...common} d="M190 465 Q170 330 245 260 Q315 190 430 210 Q520 105 655 140 Q755 170 730 255 Q710 305 630 305 L590 470 Q530 520 470 475 L425 390 Q380 445 315 460 L285 555 L215 555 L230 455Z"/>
    <circle cx="665" cy="205" r="9" fill="#111"/>
    <path d="M300 245 L335 185 L370 235 L410 170 L450 225 L495 165 L530 220" {...common} fill="none"/>
  </>;

  if (id === "rocket") return <>
    <path {...common} d="M450 90 Q560 170 560 340 Q560 460 450 525 Q340 460 340 340 Q340 170 450 90Z"/>
    <circle {...common} cx="450" cy="280" r="65"/>
    <path {...common} d="M340 365 L255 450 L345 455 M560 365 L645 450 L555 455 M405 510 Q450 600 495 510"/>
    <path d="M410 555 Q450 625 490 555" {...common} fill="none"/>
  </>;

  if (id === "seabed") return <>
    <path d="M0 165 Q110 120 220 165 Q330 210 440 165 Q550 120 660 165 Q770 210 900 165" {...common} fill="none"/>
    <ellipse {...common} cx="390" cy="340" rx="180" ry="105"/><path {...common} d="M565 340 L680 260 L680 420Z"/>
    <circle cx="335" cy="315" r="9" fill="#111"/>
    <path {...common} d="M145 560 Q175 470 210 560 M235 560 Q265 455 300 560 M700 560 Q735 465 770 560"/>
  </>;

  if (id === "fruit-basket") return <>
    <path {...common} d="M250 360 Q450 280 650 360 L600 545 H300Z"/>
    <circle {...common} cx="340" cy="315" r="70"/><circle {...common} cx="450" cy="280" r="75"/><circle {...common} cx="560" cy="315" r="70"/>
    <path d="M450 205 Q445 155 485 125 M340 250 Q330 210 360 185 M560 250 Q575 205 610 190" {...common} fill="none"/>
    <path d="M300 410 H600 M320 465 H580" {...common} fill="none" strokeWidth={5}/>
  </>;

  if (id === "bee-garden") return <>
    <ellipse {...common} cx="445" cy="285" rx="110" ry="75"/>
    <ellipse {...common} cx="365" cy="230" rx="70" ry="95"/><ellipse {...common} cx="525" cy="230" rx="70" ry="95"/>
    <path d="M380 250 H510 M375 300 H515" {...common} fill="none" strokeWidth={6}/>
    <circle cx="410" cy="270" r="8" fill="#111"/><circle cx="480" cy="270" r="8" fill="#111"/>
    <circle {...common} cx="250" cy="470" r="50"/><circle {...common} cx="650" cy="465" r="50"/>
    <path d="M250 520 V590 M650 515 V590" {...common} fill="none"/>
  </>;

  if (id === "airplane") return <>
    <path {...common} d="M110 335 L390 300 L560 145 L620 160 L545 300 L760 325 Q815 335 760 365 L545 370 L620 505 L560 520 L390 380 L110 350Z"/>
    <circle {...common} cx="500" cy="335" r="12"/><circle {...common} cx="560" cy="335" r="12"/><circle {...common} cx="620" cy="335" r="12"/>
  </>;

  if (id === "boat") return <>
    <path {...common} d="M220 420 H680 Q640 535 450 560 Q260 535 220 420Z"/>
    <path d="M450 420 V135" {...common} fill="none"/>
    <path {...common} d="M455 150 L455 375 L640 375Z"/>
    <path {...common} d="M445 175 L445 360 L300 360Z"/>
    <path d="M95 585 Q220 535 345 585 Q470 535 595 585 Q720 535 825 585" {...common} fill="none"/>
  </>;

  if (id === "pisipouk-balloon") return <>
    <circle {...common} cx="335" cy="185" r="60"/><circle {...common} cx="515" cy="185" r="60"/>
    <ellipse {...common} cx="425" cy="325" rx="160" ry="150"/>
    <circle cx="380" cy="300" r="9" fill="#111"/><circle cx="470" cy="300" r="9" fill="#111"/>
    <ellipse {...common} cx="425" cy="355" rx="60" ry="45"/>
    <path {...common} d="M330 455 Q290 520 330 565 M520 455 Q560 520 520 565"/>
    <ellipse {...common} cx="700" cy="190" rx="80" ry="105"/>
    <path d="M700 295 Q650 390 545 420" {...common} fill="none"/>
  </>;

  if (id === "pisipouk-garden") return <>
    <circle {...common} cx="330" cy="190" r="55"/><circle {...common} cx="500" cy="190" r="55"/>
    <ellipse {...common} cx="415" cy="325" rx="150" ry="140"/>
    <circle cx="375" cy="300" r="9" fill="#111"/><circle cx="455" cy="300" r="9" fill="#111"/>
    <ellipse {...common} cx="415" cy="350" rx="55" ry="42"/>
    <path {...common} d="M320 455 Q280 520 320 565 M510 455 Q550 520 510 565"/>
    <circle {...common} cx="700" cy="360" r="45"/><path d="M700 405 V575" {...common} fill="none"/>
    <path {...common} d="M630 575 Q665 515 700 575 Q735 515 770 575Z"/>
  </>;

  if (id === "forest-scene") return <>
    <path {...common} d="M130 565 Q160 430 210 565Z M690 565 Q730 400 780 565Z"/>
    <circle {...common} cx="210" cy="250" r="95"/><circle {...common} cx="730" cy="235" r="100"/>
    <path {...common} d="M330 430 Q365 330 410 430 Q455 330 500 430 Q545 330 590 430 L575 565 H345Z"/>
    <circle {...common} cx="455" cy="395" r="42"/><circle cx="440" cy="385" r="7" fill="#111"/><circle cx="470" cy="385" r="7" fill="#111"/>
    <path d="M80 590 Q260 540 440 590 Q620 540 830 590" {...common} fill="none"/>
  </>;

  if (id === "construction-scene") return <>
    <rect {...common} x="160" y="390" width="360" height="150" rx="18"/>
    <circle {...common} cx="240" cy="555" r="58"/><circle {...common} cx="455" cy="555" r="58"/>
    <path {...common} d="M420 390 L565 210 L620 235 L520 390Z"/>
    <path {...common} d="M610 235 L740 300 L680 405 L560 350Z"/>
    <path {...common} d="M120 590 H780"/>
    <path {...common} d="M690 530 L735 440 L780 530Z"/>
  </>;

  if (id === "park-scene") return <>
    <path {...common} d="M130 560 V300 H330 V560 M130 360 H330"/>
    <path d="M175 360 V520 M285 360 V520" {...common} fill="none"/>
    <path {...common} d="M470 565 L540 330 L610 565"/>
    <path {...common} d="M540 330 Q660 360 700 465 H570"/>
    <circle {...common} cx="770" cy="210" r="90"/><path d="M770 300 V560" {...common} fill="none"/>
    <path d="M60 590 Q260 545 460 590 Q660 545 840 590" {...common} fill="none"/>
  </>;

  if (id === "classroom-scene") return <>
    <rect {...common} x="170" y="115" width="560" height="220" rx="12"/>
    <rect {...common} x="210" y="405" width="220" height="110"/><rect {...common} x="500" y="405" width="220" height="110"/>
    <path {...common} d="M250 515 V585 M390 515 V585 M540 515 V585 M680 515 V585"/>
    <circle {...common} cx="275" cy="245" r="42"/><circle {...common} cx="450" cy="245" r="42"/><circle {...common} cx="625" cy="245" r="42"/>
    <path d="M230 160 H670 M230 200 H600" {...common} fill="none" strokeWidth={5}/>
  </>;

  if (id === "beach-scene") return <>
    <circle {...common} cx="150" cy="155" r="65"/>
    <path d="M0 355 Q150 300 300 355 Q450 410 600 355 Q750 300 900 355" {...common} fill="none"/>
    <path {...common} d="M300 530 L360 300 L420 530"/>
    <path {...common} d="M360 300 Q500 320 560 450 H390"/>
    <path {...common} d="M620 485 Q680 420 740 485 Q770 530 710 565 Q650 585 605 545Z"/>
    <path {...common} d="M100 585 Q280 530 450 585 Q620 530 820 585"/>
  </>;

  if (id === "city-scene") return <>
    <rect {...common} x="90" y="300" width="180" height="270"/><rect {...common} x="300" y="220" width="210" height="350"/><rect {...common} x="540" y="330" width="220" height="240"/>
    <rect {...common} x="130" y="350" width="50" height="50"/><rect {...common} x="205" y="350" width="50" height="50"/>
    <rect {...common} x="350" y="275" width="55" height="55"/><rect {...common} x="430" y="275" width="55" height="55"/>
    <rect {...common} x="585" y="380" width="55" height="55"/><rect {...common} x="675" y="380" width="55" height="55"/>
    <path {...common} d="M40 585 H840"/>
  </>;

  if (id === "weather-scene") return <>
    <circle {...common} cx="165" cy="170" r="65"/>
    <path {...common} d="M365 195 Q375 125 445 135 Q480 80 545 120 Q610 110 625 175 Q690 180 690 240 H345 Q325 210 365 195Z"/>
    <path d="M390 285 L365 350 M470 285 L445 350 M550 285 L525 350 M630 285 L605 350" {...common} fill="none"/>
    <path {...common} d="M210 520 Q305 410 400 520 Q500 410 590 520 Q680 430 780 520"/>
    <path d="M165 80 V35 M80 170 H35 M250 170 H295" {...common} fill="none" strokeWidth={6}/>
  </>;

  if (id === "pisipouk-class") return <>
    <circle {...common} cx="300" cy="185" r="55"/><circle {...common} cx="470" cy="185" r="55"/>
    <ellipse {...common} cx="385" cy="320" rx="150" ry="140"/>
    <circle cx="345" cy="295" r="9" fill="#111"/><circle cx="425" cy="295" r="9" fill="#111"/>
    <ellipse {...common} cx="385" cy="345" rx="55" ry="42"/>
    <rect {...common} x="555" y="160" width="220" height="170"/>
    <path d="M585 210 H745 M585 250 H700" {...common} fill="none" strokeWidth={5}/>
    <rect {...common} x="240" y="485" width="450" height="85" rx="15"/>
    <circle {...common} cx="300" cy="530" r="22"/><circle {...common} cx="360" cy="530" r="22"/><circle {...common} cx="420" cy="530" r="22"/>
  </>;

  if (id === "pisipouk-adventure") return <>
    <circle {...common} cx="290" cy="190" r="55"/><circle {...common} cx="460" cy="190" r="55"/>
    <ellipse {...common} cx="375" cy="325" rx="150" ry="140"/>
    <circle cx="335" cy="300" r="9" fill="#111"/><circle cx="415" cy="300" r="9" fill="#111"/>
    <ellipse {...common} cx="375" cy="350" rx="55" ry="42"/>
    <path {...common} d="M610 565 Q650 410 700 565Z"/>
    <circle {...common} cx="720" cy="230" r="90"/>
    <path {...common} d="M560 500 Q620 420 680 500 Q740 420 800 500 L800 590 H560Z"/>
    <path {...common} d="M105 590 Q280 530 455 590 Q630 530 825 590"/>
  </>;

  if (id === "garden-scene") return <>
    <circle {...common} cx="450" cy="245" r="62"/>
    {Array.from({length:10}).map((_,i)=>{const a=i*Math.PI/5;const x=450+Math.cos(a)*115;const y=245+Math.sin(a)*115;return <ellipse key={i} {...common} cx={x} cy={y} rx="40" ry="70" transform={`rotate(${i*36} ${x} ${y})`}/>})}
    <path {...common} d="M430 355 Q390 470 410 580 H490 Q510 470 470 355Z"/>
    <path d="M410 455 Q340 410 290 475 M490 455 Q560 410 610 475" {...common} fill="none"/>
    <path {...common} d="M170 575 Q220 505 270 575 Q320 500 370 575 Q420 500 470 575 Q520 500 570 575 Q620 500 690 575Z"/>
    <circle {...common} cx="220" cy="410" r="32"/><path d="M220 378 V330 M188 410 H145 M252 410 H295" {...common} fill="none" strokeWidth={5}/>
    <path {...common} d="M670 365 Q715 320 760 365 Q785 410 740 450 Q695 465 655 430 Q625 390 670 365Z"/>
  </>;

  return null;
}

function VirtualPreschool() {
  const daySeed = useMemo(() => Math.floor(Date.now() / 86400000), []);

  const dailyChoices = useMemo(() => {
    const groups = ["2–3","4–5","5–6"] as const;
    return groups.flatMap((age, groupIndex) => {
      const group = DESIGNS.filter((d) => d.age === age);
      const start = (daySeed + groupIndex * 2) % group.length;
      return [group[start], group[(start + 3) % group.length]];
    });
  }, [daySeed]);

  const [designId, setDesignId] = useState(dailyChoices[0].id);
  const [selectedAge, setSelectedAge] = useState<Design["age"]>(dailyChoices[0].age);
  const [color, setColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(24);
  const [erasing, setErasing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);

  const current = DESIGNS.find((d) => d.id === designId) ?? DESIGNS[0];

  useEffect(() => {
    trackEvent("game_start", { game: "freehand_coloring", drawing: designId, age: current.age });
  }, [designId, current.age]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const pickDesign = (id: string) => {
    const nextDesign = DESIGNS.find((d) => d.id === id);
    setDesignId(id);
    if (nextDesign) setSelectedAge(nextDesign.age);
    clearCanvas();
    setErasing(false);
    requestAnimationFrame(() => {
      document.getElementById("coloring-studio")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = true;
    lastRef.current = point(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || !lastRef.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const p = point(e);
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = color;
    ctx.globalCompositeOperation = erasing ? "destination-out" : "source-over";
    ctx.beginPath();
    ctx.moveTo(lastRef.current.x, lastRef.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.restore();
    lastRef.current = p;
  };

  const stopDraw = () => {
    drawingRef.current = false;
    lastRef.current = null;
  };

  const download = () => {
    const paint = canvasRef.current;
    const svg = svgRef.current;
    if (!paint || !svg) return;
    const out = document.createElement("canvas");
    out.width = 1200;
    out.height = 930;
    const ctx = out.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, out.width, out.height);

    const svgText = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const bg = new Image();

    bg.onload = () => {
      ctx.drawImage(paint, 0, 0, 1200, 867);
      ctx.drawImage(bg, 0, 0, 1200, 867);
      ctx.fillStyle = "#333";
      ctx.font = "26px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Η ζωγραφιά μου στον Πισιπούκ - pisipouk.vercel.app", 600, 910);
      const a = document.createElement("a");
      a.href = out.toDataURL("image/png");
      a.download = `pisipouk-${designId}.png`;
      a.click();
      URL.revokeObjectURL(url);
      trackEvent("share_click", { game: "freehand_coloring", action: "download", drawing: designId });
    };
    bg.src = url;
  };

  const print = () => {
    trackEvent("share_click", { game: "freehand_coloring", action: "print", drawing: designId });
    window.print();
  };

  return (
    <SiteLayout>
      <section className="bg-white py-8 sm:py-12">
        <div className="mx-auto max-w-[1500px] px-3 sm:px-5 lg:px-7">
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <a href="#coloring-library" className="group rounded-[1.8rem] border bg-gradient-to-br from-pink-50 to-sky-50 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🎨</span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Online Preschool</p>
                  <h2 className="mt-1 text-2xl font-black text-[#0b3b82]">Ζωγραφική</h2>
                  <p className="mt-1 text-sm text-muted-foreground">45 σχέδια ανά ηλικία + online studio</p>
                </div>
              </div>
            </a>
            <a href="#crafts-library" className="group rounded-[1.8rem] border bg-gradient-to-br from-amber-50 to-emerald-50 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-4">
                <span className="text-4xl">✂️</span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Online Preschool</p>
                  <h2 className="mt-1 text-2xl font-black text-[#0b3b82]">Κατασκευές</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Ιδέες, υλικά και βήματα για παιδιά 2–6 ετών</p>
                </div>
              </div>
            </a>
          </div>

          <div id="coloring-library" className="scroll-mt-24 overflow-hidden rounded-[2rem] border bg-white shadow-sm">
            <div className="relative px-5 pb-6 pt-6 sm:px-8 lg:px-10">
              <div className="absolute right-6 top-6 hidden text-5xl lg:block">☀️</div>
              <div className="grid items-center gap-5 lg:grid-cols-[280px_1fr_280px]">
                <div className="flex justify-center lg:justify-start">
                  <img src={pisipoukLogo} alt="Ο Πισιπούκ" className="h-auto w-56 max-w-full object-contain" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">Εικονικός Παιδικός Σταθμός</p>
                  <h1 className="mt-2 text-4xl font-black tracking-tight text-[#0b3b82] sm:text-5xl lg:text-6xl">
                    Βιβλιοθήκη Ζωγραφικής
                  </h1>
                  <p className="mt-2 text-base font-bold text-[#0b3b82] sm:text-lg">
                    45 μοναδικά σχέδια, 15 για κάθε ηλικιακή ομάδα
                  </p>
                </div>
                <div className="hidden text-center font-black italic text-[#0b3b82] lg:block">
                  <div className="text-2xl">Μικρά χεράκια</div>
                  <div className="mt-1 text-3xl">Μεγάλες ιδέες!</div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 p-3 lg:grid-cols-3">
              {(["2–3","4–5","5–6"] as const).map((age) => {
                const meta = AGE_META[age];
                const ageDesigns = DESIGNS.filter((item) => item.age === age);
                const panel =
                  age === "2–3"
                    ? "border-rose-200 bg-gradient-to-b from-rose-50 to-pink-100/70"
                    : age === "4–5"
                      ? "border-sky-200 bg-gradient-to-b from-sky-50 to-blue-100/70"
                      : "border-emerald-200 bg-gradient-to-b from-emerald-50 to-green-100/70";
                const heading = age === "2–3" ? "text-rose-600" : age === "4–5" ? "text-blue-600" : "text-green-700";
                const slogan =
                  age === "2–3"
                    ? "Μεγάλα σχήματα, απλά σχέδια, πολλή χαρά!"
                    : age === "4–5"
                      ? "Περισσότερες λεπτομέρειες, περισσότερες ιστορίες!"
                      : "Ολόκληρες σκηνές, μικρές προκλήσεις, μεγάλα όνειρα!";
                return (
                  <div key={age} className={"rounded-[1.8rem] border p-4 sm:p-5 " + panel}>
                    <div className="text-center">
                      <div className={"text-4xl font-black sm:text-5xl " + heading}>{age} ετών</div>
                      <p className={"mt-2 text-sm font-black sm:text-base " + heading}>{slogan}</p>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5">
                      {ageDesigns.map((item, index) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => pickDesign(item.id)}
                          className={
                            "group rounded-xl border bg-white p-1.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md " +
                            (designId === item.id ? "ring-2 ring-primary ring-offset-1" : "")
                          }
                        >
                          <div className="aspect-[4/3] overflow-hidden rounded-lg bg-white">
                            <svg viewBox="0 0 900 650" className="h-full w-full" aria-hidden="true">
                              <Outline id={item.id} />
                            </svg>
                          </div>
                          <div className="mt-1 min-h-[2.4rem] text-center">
                            <p className="text-[10px] font-black leading-tight text-slate-800 sm:text-[11px]">
                              {index + 1}. {item.title}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="mt-5 rounded-full bg-white/75 px-4 py-3 text-center text-sm font-black shadow-sm">
                      {age === "2–3"
                        ? "Τα πρώτα τους βήματα στον κόσμο των χρωμάτων!"
                        : age === "4–5"
                          ? "Φαντασία, δημιουργικότητα και χαμόγελα!"
                          : "Μεγαλώνουμε μέσα από τη δημιουργία!"}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t bg-white px-4 py-5 sm:px-7">
              <div className="grid gap-3 text-center sm:grid-cols-5">
                {[
                  ["🎨", "Διάλεξε σχέδιο"],
                  ["🖌️", "Ζωγράφισε"],
                  ["⬇️", "Αποθήκευσε"],
                  ["🖨️", "Εκτύπωσε"],
                  ["❤️", "Δημιούργησε ξανά!"],
                ].map(([icon, label]) => (
                  <div key={label} className="flex items-center justify-center gap-2 rounded-full bg-slate-50 px-3 py-2.5">
                    <span className="text-xl">{icon}</span>
                    <span className="text-sm font-black text-[#0b3b82]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>


          <section id="crafts-library" className="scroll-mt-24 pt-10">
            <div className="rounded-[2rem] border bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-5 shadow-sm sm:p-8">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Κατασκευές Πισιπούκ</p>
                <h2 className="mt-2 text-3xl font-black text-[#0b3b82] sm:text-5xl">Φτιάχνουμε με τα χέρια μας ✂️</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Πρωτότυπες ιδέες ανά ηλικία, με απλά υλικά και σύντομα βήματα. Οι εποχικές δραστηριότητες αλλάζουν μαζί με τη χρονιά.
                </p>
              </div>

              <div className="mt-7 flex flex-wrap justify-center gap-2">
                {["Όλο τον χρόνο","Φθινόπωρο","28η Οκτωβρίου","Χριστούγεννα","Απόκριες","25η Μαρτίου","Πάσχα","Καλοκαίρι"].map((season) => (
                  <span key={season} className="rounded-full border bg-white px-3 py-1.5 text-xs font-black text-[#0b3b82]">{season}</span>
                ))}
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                {(["2–3","4–5","5–6"] as const).map((age) => {
                  const panel =
                    age === "2–3"
                      ? "border-rose-200 bg-rose-50/80"
                      : age === "4–5"
                        ? "border-sky-200 bg-sky-50/80"
                        : "border-emerald-200 bg-emerald-50/80";
                  return (
                    <div key={age} className={"rounded-[1.8rem] border p-4 sm:p-5 " + panel}>
                      <div className="text-center">
                        <div className="text-3xl font-black text-[#0b3b82]">{age} ετών</div>
                        <p className="mt-1 text-xs font-bold text-muted-foreground">{AGE_META[age].description}</p>
                      </div>
                      <div className="mt-5 grid gap-3">
                        {CRAFTS.filter((craft) => craft.age === age).map((craft) => (
                          <article key={craft.id} className="rounded-2xl border bg-white p-4 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">{craft.emoji}</span>
                                <div>
                                  <h3 className="text-sm font-black leading-tight text-slate-900">{craft.title}</h3>
                                  <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-1 text-[10px] font-black text-primary">{craft.season}</span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-3">
                              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-muted-foreground">Υλικά</p>
                              <p className="mt-1 text-xs leading-5 text-slate-700">{craft.materials.join(" · ")}</p>
                            </div>
                            <div className="mt-3">
                              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-muted-foreground">Βήματα</p>
                              <ol className="mt-1 space-y-1 text-xs leading-5 text-slate-700">
                                {craft.steps.map((step, index) => (
                                  <li key={step}><span className="font-black text-primary">{index + 1}.</span> {step}</li>
                                ))}
                              </ol>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7 rounded-2xl border bg-white p-4 text-center">
                <p className="text-sm font-black text-[#0b3b82]">Με ενήλικα δίπλα μας 👩‍👧‍👦</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Ψαλίδι, μικρά εξαρτήματα και οποιοδήποτε κόψιμο ή τρύπημα γίνονται πάντα με επίβλεψη και βοήθεια ενήλικα.
                </p>
              </div>
            </div>
          </section>

          <div id="coloring-studio" className="scroll-mt-24 pt-10">
            <div className="mb-4 text-center">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Ζωγραφική</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">{current.emoji} {current.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{current.age} ετών · {current.level}</p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_360px] xl:items-start">
              <div className="min-w-0">
                <div className="print-area rounded-[2rem] border bg-white p-3 shadow-sm sm:p-5">
                  <div className="relative mx-auto aspect-[900/650] w-full max-w-5xl overflow-hidden rounded-[1.4rem] bg-white">
                    <canvas
                      ref={canvasRef}
                      width={900}
                      height={650}
                      onPointerDown={startDraw}
                      onPointerMove={draw}
                      onPointerUp={stopDraw}
                      onPointerCancel={stopDraw}
                      onPointerLeave={stopDraw}
                      className="absolute inset-0 z-10 h-full w-full touch-none cursor-crosshair"
                      aria-label="Καμβάς ζωγραφικής"
                    />
                    <svg
                      ref={svgRef}
                      viewBox="0 0 900 650"
                      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
                      aria-label={`Σχέδιο: ${current.title}`}
                    >
                      <Outline id={designId} />
                    </svg>
                  </div>
                  <div className="hidden print:block pt-3 text-center text-sm font-bold text-gray-700">
                    Η ζωγραφιά μου στον Πισιπούκ - pisipouk.vercel.app
                  </div>
                </div>
              </div>

              <aside className="rounded-[2rem] border bg-card p-5 xl:sticky xl:top-24">
                <div className="flex items-center gap-2">
                  <Paintbrush className="h-5 w-5 text-primary" />
                  <h3 className="font-black">Παλέτα ζωγραφικής</h3>
                </div>

                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {AGE_META[current.age].description}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {COLORS.map((paintColor) => (
                    <button
                      key={paintColor}
                      type="button"
                      onClick={() => { setColor(paintColor); setErasing(false); }}
                      aria-label={"Χρώμα " + paintColor}
                      className={"h-11 w-11 rounded-full border-2 transition-transform " + (!erasing && color === paintColor ? "scale-110 ring-2 ring-primary ring-offset-2" : "")}
                      style={{ backgroundColor: paintColor }}
                    />
                  ))}
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">Πάχος πινέλου</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[14,26,42].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setBrushSize(size)}
                        className={"flex h-12 items-center justify-center rounded-xl border bg-background " + (brushSize === size ? "ring-2 ring-primary" : "")}
                      >
                        <span className="rounded-full bg-foreground" style={{ width: Math.max(8,size/2), height: Math.max(8,size/2) }} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <Button type="button" variant={erasing ? "default" : "outline"} className="rounded-full" onClick={() => setErasing(v => !v)}>
                    <Eraser className="h-4 w-4" />{erasing ? "Γόμα ενεργή" : "Γόμα"}
                  </Button>
                  <Button type="button" variant="outline" className="rounded-full" onClick={clearCanvas}>
                    <RotateCcw className="h-4 w-4" />Καθάρισέ το
                  </Button>
                  <Button type="button" className="rounded-full" onClick={download}>
                    <Download className="h-4 w-4" />Αποθήκευση PNG
                  </Button>
                  <Button type="button" variant="secondary" className="rounded-full" onClick={print}>
                    <Printer className="h-4 w-4" />Εκτύπωση
                  </Button>
                </div>

                <div className="mt-5 rounded-2xl bg-primary/5 p-4">
                  <p className="text-xs font-black text-primary">Μικρή υπενθύμιση</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Δεν υπάρχει «σωστό» χρώμα. Το παιδί επιλέγει, πειραματίζεται και δημιουργεί ελεύθερα.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <style>{`@media print {
        body * { visibility:hidden !important; }
        .print-area, .print-area * { visibility:visible !important; }
        .print-area { position:absolute !important; inset:0 !important; width:100% !important; border:0 !important; box-shadow:none !important; }
        header, footer { display:none !important; }
      }`}</style>
    </SiteLayout>
  );
}
