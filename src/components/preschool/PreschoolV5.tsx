import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Gamepad2,
  Heart,
  Home,
  Languages,
  LockKeyhole,
  Palette,
  Pause,
  PersonStanding,
  Play,
  Printer,
  RotateCcw,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Volume2,
  X,
} from "lucide-react";
import { PreschoolGameLab } from "@/components/preschool/PreschoolGameLab";
import type { PreschoolAge } from "@/content/virtualPreschoolMedia";
import { trackEvent } from "@/lib/pisipoukApi";

type Lang = "el" | "en";
type Panel = "home" | "games" | "crafts" | "color" | "stories" | "move" | "today" | "parents";
type MascotMood = "hello" | "play" | "craft" | "paint" | "story" | "move" | "star";

type Story = {
  titleEl: string;
  titleEn: string;
  age: PreschoolAge[];
  slides: { icon: string; el: string; en: string }[];
};

type Craft = {
  titleEl: string;
  titleEn: string;
  ages: PreschoolAge[];
  minutes: number;
  icon: string;
  materialsEl: string[];
  materialsEn: string[];
  stepsEl: string[];
  stepsEn: string[];
  pattern: "owl" | "boat" | "flower" | "kite";
};

type MoveMission = {
  titleEl: string;
  titleEn: string;
  textEl: string;
  textEn: string;
  icon: string;
  seconds: number;
};

const COPY = {
  el: {
    home: "Αρχική",
    games: "Παιχνίδια",
    crafts: "Κατασκευές",
    color: "Ζωγραφική",
    stories: "Βίντεο Ιστορίες",
    move: "Κινούμαι",
    parents: "Για Γονείς",
    today: "Σήμερα",
    headline1: "Μαθαίνουμε.",
    headline2: "Παίζουμε.",
    headline3: "Δημιουργούμε.",
    sub: "Ένας ελληνικός, ασφαλής και χαρούμενος online παιδικός κόσμος για παιδιά 2–6 ετών, με παιχνίδια, ιστορίες, κατασκευές, ζωγραφική και κίνηση.",
    weekly: "Η αποστολή της εβδομάδας",
    weeklyNote: "Κάθε εβδομάδα αλλάζουν παιχνίδι, κατασκευή, ζωγραφιά και αποστολή.",
    start: "Ξεκινάμε!",
    back: "Πίσω στον κόσμο",
    greekOnly: "Οι ιστορίες είναι πρωτότυπες και μόνο στα Ελληνικά.",
    parentIntro: "Ένας καθαρός χώρος για τους γονείς — χωρίς να μπερδεύει το παιδικό navigation.",
  },
  en: {
    home: "Home",
    games: "Games",
    crafts: "Crafts",
    color: "Coloring",
    stories: "Video Stories",
    move: "Move",
    parents: "Parents",
    today: "Today",
    headline1: "We learn.",
    headline2: "We play.",
    headline3: "We create.",
    sub: "A Greek-first, safe and joyful online preschool world for ages 2–6, with games, stories, crafts, coloring and movement.",
    weekly: "Mission of the week",
    weeklyNote: "Each week brings a different game, craft, coloring page and mission.",
    start: "Let’s go!",
    back: "Back to the world",
    greekOnly: "Stories are original and narrated in Greek; English subtitles are available.",
    parentIntro: "A clear parent space that stays separate from the child navigation.",
  },
};

const AGES: { id: PreschoolAge; label: string; noteEl: string; noteEn: string }[] = [
  { id: "2–3", label: "2–3", noteEl: "χρώματα • σχήματα • ρουτίνες", noteEn: "colors • shapes • routines" },
  { id: "4–5", label: "4–5", noteEl: "ιστορίες • λογική • συναισθήματα", noteEn: "stories • logic • emotions" },
  { id: "5–6", label: "5–6", noteEl: "γράμματα • αριθμοί • επίλυση", noteEn: "letters • numbers • problem solving" },
];

const STORIES: Story[] = [
  {
    titleEl: "Ο Πισιπούκ και το χαμένο αστέρι",
    titleEn: "Pisipouk and the Lost Star",
    age: ["2–3", "4–5", "5–6"],
    slides: [
      { icon: "🌙", el: "Ένα βράδυ, ένα μικρό αστέρι έπεσε σιγά στο δάσος του Πισιπούκ.", en: "One night, a little star gently fell into Pisipouk’s forest." },
      { icon: "🦉", el: "Ο Πισιπούκ άνοιξε τα φτερά του και είπε: «Θα σε βοηθήσω να βρεις τον ουρανό σου». ", en: "Pisipouk opened his wings and said, ‘I’ll help you find your sky.’" },
      { icon: "🌲", el: "Μαζί ρώτησαν το πεύκο, το ρυάκι και το φεγγάρι. Κάθε φίλος τους έδειξε ένα μικρό σημάδι.", en: "Together they asked the pine tree, the stream and the moon; each friend gave them a clue." },
      { icon: "⭐", el: "Το αστέρι γύρισε στον ουρανό και άφησε στον Πισιπούκ μια λαμπερή ευχή: να βοηθά πάντα όποιον το χρειάζεται.", en: "The star returned to the sky and left Pisipouk a bright wish: always help someone who needs you." },
    ],
  },
  {
    titleEl: "Το καραβάκι που φοβόταν τα κύματα",
    titleEn: "The Little Boat Afraid of Waves",
    age: ["3–4" as PreschoolAge, "4–5", "5–6"].filter(Boolean) as PreschoolAge[],
    slides: [
      { icon: "⛵", el: "Σ’ ένα μικρό ελληνικό λιμανάκι ζούσε ένα καραβάκι που αγαπούσε τη θάλασσα, αλλά φοβόταν τα κύματα.", en: "In a small Greek harbor lived a boat that loved the sea but feared the waves." },
      { icon: "🌊", el: "Μια μέρα ο άνεμος του ψιθύρισε: «Δεν χρειάζεται να είσαι άφοβο· χρειάζεται να προχωράς λίγο λίγο». ", en: "One day the wind whispered, ‘You don’t need to be fearless; just move forward little by little.’" },
      { icon: "🐬", el: "Ένα δελφίνι κολύμπησε δίπλα του και μαζί μέτρησαν τρία μικρά κύματα.", en: "A dolphin swam beside it and together they counted three small waves." },
      { icon: "☀️", el: "Όταν βγήκε ο ήλιος, το καραβάκι χαμογέλασε. Είχε μάθει πως το θάρρος μεγαλώνει με κάθε μικρή προσπάθεια.", en: "When the sun came out, the little boat smiled; courage grows with every small try." },
    ],
  },
  {
    titleEl: "Η μικρή ελιά και ο δυνατός άνεμος",
    titleEn: "The Little Olive Tree and the Wind",
    age: ["4–5", "5–6"],
    slides: [
      { icon: "🫒", el: "Στην άκρη ενός χωριού μεγάλωνε μια μικρή ελιά που ήθελε να γίνει δυνατή.", en: "At the edge of a village grew a little olive tree that wanted to become strong." },
      { icon: "💨", el: "Όταν φύσηξε δυνατός άνεμος, η ελιά λύγισε αλλά δεν έσπασε.", en: "When a strong wind blew, the olive tree bent but did not break." },
      { icon: "🌱", el: "Οι ρίζες της κρατούσαν βαθιά το χώμα και κάθε μέρα γίνονταν πιο δυνατές.", en: "Its roots held the soil tightly and grew stronger every day." },
      { icon: "💚", el: "Η ελιά κατάλαβε πως δύναμη δεν σημαίνει να μη λυγίζεις ποτέ, αλλά να ξανασηκώνεσαι.", en: "The olive tree learned that strength is not never bending, but rising again." },
    ],
  },
  {
    titleEl: "Η γιορτή των χρωμάτων",
    titleEn: "The Festival of Colors",
    age: ["2–3", "4–5"],
    slides: [
      { icon: "🔴", el: "Το κόκκινο, το κίτρινο και το μπλε μάλωναν για το ποιο είναι το πιο όμορφο χρώμα.", en: "Red, yellow and blue argued about which color was the most beautiful." },
      { icon: "🎨", el: "Ο Πισιπούκ τους πρότεινε να ανακατευτούν και να δουν τι θα συμβεί.", en: "Pisipouk suggested they mix together and see what happens." },
      { icon: "🟣", el: "Γεννήθηκαν νέα χρώματα: πορτοκαλί, πράσινο και μωβ, και όλα άρχισαν να γελούν.", en: "New colors appeared: orange, green and purple, and everyone started laughing." },
      { icon: "🌈", el: "Στο τέλος έφτιαξαν όλοι μαζί ένα μεγάλο ουράνιο τόξο. Η ομορφιά τους ήταν μεγαλύτερη όταν συνεργάζονταν.", en: "Together they made a big rainbow; their beauty was greater when they worked as a team." },
    ],
  },
];

const CRAFTS: Craft[] = [
  {
    titleEl: "Ο Πισιπούκ από χαρτί",
    titleEn: "Paper Pisipouk",
    ages: ["2–3", "4–5", "5–6"], minutes: 15, icon: "🦉", pattern: "owl",
    materialsEl: ["Χαρτόνι Α4", "Ψαλίδι ασφαλείας", "Κόλλα", "Μαρκαδόροι"],
    materialsEn: ["A4 card", "Safety scissors", "Glue", "Markers"],
    stepsEl: ["Εκτύπωσε το πατρόν.", "Κόψε τα μεγάλα σχήματα με βοήθεια ενήλικα.", "Κόλλησε μάτια, φτερά και ράμφος.", "Δώσε όνομα στον δικό σου Πισιπούκ!"],
    stepsEn: ["Print the template.", "Cut the large shapes with adult help.", "Glue eyes, wings and beak.", "Give your Pisipouk a name!"],
  },
  {
    titleEl: "Καλοκαιρινό καραβάκι",
    titleEn: "Summer Paper Boat",
    ages: ["3–4" as PreschoolAge, "4–5", "5–6"].filter(Boolean) as PreschoolAge[], minutes: 12, icon: "⛵", pattern: "boat",
    materialsEl: ["Χαρτόνι", "Καλαμάκι", "Κόλλα", "Κηρομπογιές"], materialsEn: ["Card", "Paper straw", "Glue", "Crayons"],
    stepsEl: ["Εκτύπωσε το πατρόν.", "Χρωμάτισε το πανί.", "Κόλλησε το καλαμάκι σαν κατάρτι.", "Βάλε το καραβάκι στο δωμάτιο ως διακόσμηση."],
    stepsEn: ["Print the template.", "Color the sail.", "Glue the straw as a mast.", "Display your boat in your room."],
  },
  {
    titleEl: "Λουλούδι των συναισθημάτων",
    titleEn: "Feelings Flower",
    ages: ["4–5", "5–6"], minutes: 18, icon: "🌼", pattern: "flower",
    materialsEl: ["Χαρτί Α4", "Ξυλομπογιές", "Ψαλίδι", "Κόλλα"], materialsEn: ["A4 paper", "Colored pencils", "Scissors", "Glue"],
    stepsEl: ["Εκτύπωσε το λουλούδι.", "Σε κάθε πέταλο ζωγράφισε ένα συναίσθημα.", "Κόψε το λουλούδι.", "Μίλησε με έναν μεγάλο για κάθε συναίσθημα."],
    stepsEn: ["Print the flower.", "Draw one feeling on each petal.", "Cut out the flower.", "Talk with an adult about each feeling."],
  },
  {
    titleEl: "Ο χαρταετός μου",
    titleEn: "My Kite",
    ages: ["2–3", "4–5", "5–6"], minutes: 15, icon: "🪁", pattern: "kite",
    materialsEl: ["Χαρτόνι", "Κορδέλες", "Κόλλα", "Χρώματα"], materialsEn: ["Card", "Ribbons", "Glue", "Colors"],
    stepsEl: ["Εκτύπωσε το πατρόν.", "Χρωμάτισε τα 4 τρίγωνα.", "Κόλλησε κορδέλες στην ουρά.", "Κρέμασέ τον στο παράθυρο."],
    stepsEn: ["Print the template.", "Color the four triangles.", "Glue ribbons to the tail.", "Hang it by the window."],
  },
];

const MOVE_MISSIONS: MoveMission[] = [
  { titleEl: "Χορός του Πισιπούκ", titleEn: "Pisipouk Dance", textEl: "Χόρεψε ελεύθερα και πάγωσε όταν ο χρόνος τελειώσει!", textEn: "Dance freely and freeze when the timer ends!", icon: "💃", seconds: 30 },
  { titleEl: "Βήματα στο νησί", titleEn: "Island Steps", textEl: "Περπάτησε αργά σαν να πατάς πάνω σε πέτρες μέσα στη θάλασσα.", textEn: "Walk slowly as if stepping on stones in the sea.", icon: "🏝️", seconds: 25 },
  { titleEl: "Βατραχάκια", titleEn: "Little Frogs", textEl: "Κάνε 8 μικρά πηδηματάκια και μετά τέντωσε τα χέρια ψηλά.", textEn: "Do 8 small frog jumps, then stretch your arms high.", icon: "🐸", seconds: 20 },
  { titleEl: "Ήρεμη αναπνοή", titleEn: "Calm Breathing", textEl: "Μύρισε ένα φανταστικό λουλούδι και φύσηξε απαλά ένα κεράκι.", textEn: "Smell an imaginary flower and gently blow out a candle.", icon: "🌸", seconds: 35 },
  { titleEl: "Ρυθμός με παλαμάκια", titleEn: "Clap the Rhythm", textEl: "Αργά, αργά, γρήγορα, γρήγορα — και ξανά!", textEn: "Slow, slow, fast, fast — and again!", icon: "👏", seconds: 30 },
];

const COLOR_SCENES = [
  { id: "sun", titleEl: "Ο ήλιος του Αιγαίου", titleEn: "Aegean Sun", icon: "☀️" },
  { id: "owl", titleEl: "Ο Πισιπούκ", titleEn: "Pisipouk", icon: "🦉" },
  { id: "boat", titleEl: "Το καραβάκι", titleEn: "Little Boat", icon: "⛵" },
  { id: "flower", titleEl: "Το λουλούδι", titleEn: "Flower", icon: "🌼" },
];

function weekNumber(date = new Date()) {
  const first = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - first.getTime()) / 86400000);
  return Math.floor((days + first.getDay() + 1) / 7);
}

function PisipoukMascot({ mood = "hello", compact = false }: { mood?: MascotMood; compact?: boolean }) {
  const accent = mood === "play" ? "#7359f7" : mood === "craft" ? "#ff7f4d" : mood === "paint" ? "#ff5c9d" : mood === "story" ? "#43aef5" : mood === "move" ? "#39c681" : "#ffd44f";
  return (
    <svg className={`v5-mascot ${compact ? "is-compact" : ""}`} viewBox="0 0 220 220" role="img" aria-label="Πισιπούκ">
      <defs>
        <linearGradient id={`body-${mood}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff8e7"/><stop offset="1" stopColor="#e8cda7"/></linearGradient>
        <filter id={`shadow-${mood}`}><feDropShadow dx="0" dy="10" stdDeviation="8" floodOpacity=".2"/></filter>
      </defs>
      <g filter={`url(#shadow-${mood})`}>
        <g className="wing wing-left"><path d="M82 102 C43 87,22 111,34 144 C50 176,79 153,94 128Z" fill="#a66d43"/><path d="M76 111 C54 107,45 126,52 143" fill="none" stroke="#f2d0a6" strokeWidth="9" strokeLinecap="round"/></g>
        <g className="wing wing-right"><path d="M138 102 C177 87,198 111,186 144 C170 176,141 153,126 128Z" fill="#a66d43"/><path d="M144 111 C166 107,175 126,168 143" fill="none" stroke="#f2d0a6" strokeWidth="9" strokeLinecap="round"/></g>
        <ellipse cx="110" cy="126" rx="59" ry="68" fill={`url(#body-${mood})`} stroke="#7d573a" strokeWidth="5"/>
        <path d="M68 79 L78 42 L98 72 M122 72 L142 42 L152 79" fill="#9b663f" stroke="#7d573a" strokeWidth="5" strokeLinejoin="round"/>
        <circle cx="88" cy="103" r="29" fill="white" stroke="#7d573a" strokeWidth="4"/><circle cx="132" cy="103" r="29" fill="white" stroke="#7d573a" strokeWidth="4"/>
        <circle className="eye" cx="91" cy="106" r="13" fill="#39291f"/><circle className="eye" cx="129" cy="106" r="13" fill="#39291f"/><circle cx="87" cy="101" r="4" fill="white"/><circle cx="125" cy="101" r="4" fill="white"/>
        <path d="M102 121 L110 133 L118 121Z" fill="#ffae24" stroke="#cc7612" strokeWidth="3"/>
        <path d="M84 144 Q110 164 136 144" fill="none" stroke="#7d573a" strokeWidth="5" strokeLinecap="round"/>
        <circle cx="110" cy="167" r="18" fill={accent}/><Star x="99" y="156" width="22" height="22" fill="white" stroke="white"/>
      </g>
    </svg>
  );
}

function PatternArt({ kind }: { kind: Craft["pattern"] }) {
  if (kind === "boat") return <svg viewBox="0 0 420 300"><path d="M86 205H340L300 250H125Z" fill="none" stroke="#25316b" strokeWidth="7"/><path d="M210 58V207" stroke="#25316b" strokeWidth="7"/><path d="M214 70L302 160H214Z" fill="none" stroke="#25316b" strokeWidth="7"/><circle cx="156" cy="224" r="12" fill="none" stroke="#25316b" strokeWidth="5"/></svg>;
  if (kind === "flower") return <svg viewBox="0 0 420 300"><circle cx="210" cy="144" r="40" fill="none" stroke="#25316b" strokeWidth="7"/>{[0,60,120,180,240,300].map((a)=><ellipse key={a} cx="210" cy="75" rx="34" ry="55" fill="none" stroke="#25316b" strokeWidth="7" transform={`rotate(${a} 210 144)`}/>) }<path d="M210 184V270" stroke="#25316b" strokeWidth="7"/><path d="M208 226Q155 198 145 244Q179 258 208 242" fill="none" stroke="#25316b" strokeWidth="6"/></svg>;
  if (kind === "kite") return <svg viewBox="0 0 420 300"><path d="M210 40L325 140L210 235L95 140Z" fill="none" stroke="#25316b" strokeWidth="7"/><path d="M210 40V235M95 140H325" stroke="#25316b" strokeWidth="5"/><path d="M210 235Q250 258 220 285" fill="none" stroke="#25316b" strokeWidth="5"/><path d="M218 254l28 12-26 14z" fill="none" stroke="#25316b" strokeWidth="4"/></svg>;
  return <svg viewBox="0 0 420 300"><ellipse cx="210" cy="160" rx="85" ry="100" fill="none" stroke="#25316b" strokeWidth="7"/><path d="M145 96L160 45L194 88M226 88L260 45L275 96" fill="none" stroke="#25316b" strokeWidth="7"/><circle cx="180" cy="135" r="28" fill="none" stroke="#25316b" strokeWidth="6"/><circle cx="240" cy="135" r="28" fill="none" stroke="#25316b" strokeWidth="6"/><circle cx="180" cy="135" r="8" fill="#25316b"/><circle cx="240" cy="135" r="8" fill="#25316b"/><path d="M200 163L210 176L220 163Z" fill="none" stroke="#25316b" strokeWidth="5"/><path d="M155 200Q115 175 102 210Q130 234 165 222M265 200Q305 175 318 210Q290 234 255 222" fill="none" stroke="#25316b" strokeWidth="7"/></svg>;
}

function ColoringCanvas({ scene, lang }: { scene: string; lang: Lang }) {
  const [colors, setColors] = useState(["#ffe16b", "#ff86ad", "#6ed3ff", "#76d99e", "#b8a0ff", "#ffffff"]);
  const [selected, setSelected] = useState("#ff86ad");
  const [fills, setFills] = useState(["#fff7c8", "#eaf8ff", "#ffffff", "#ffffff", "#ffffff"]);
  const fill = (i: number) => setFills((v) => v.map((x, n) => (n === i ? selected : x)));
  return <div className="v5-color-workspace">
    <div className="v5-palette">{colors.map((c)=><button key={c} aria-label={c} className={selected===c?"is-on":""} style={{background:c}} onClick={()=>setSelected(c)}/>) }<button className="reset" onClick={()=>setFills(["#fff7c8","#eaf8ff","#ffffff","#ffffff","#ffffff"])}><RotateCcw/></button></div>
    <div className="v5-canvas">
      {scene === "boat" ? <svg viewBox="0 0 520 360"><rect width="520" height="360" fill={fills[1]} onClick={()=>fill(1)}/><circle cx="440" cy="70" r="42" fill={fills[0]} onClick={()=>fill(0)}/><path d="M0 280Q120 240 240 285T520 270V360H0Z" fill={fills[2]} stroke="#26316c" strokeWidth="6" onClick={()=>fill(2)}/><path d="M120 230H370L330 300H165Z" fill={fills[3]} stroke="#26316c" strokeWidth="7" onClick={()=>fill(3)}/><path d="M250 80V232M255 95L345 190H255Z" fill={fills[4]} stroke="#26316c" strokeWidth="7" onClick={()=>fill(4)}/></svg> :
      scene === "flower" ? <svg viewBox="0 0 520 360"><rect width="520" height="360" fill={fills[1]} onClick={()=>fill(1)}/><circle cx="260" cy="155" r="55" fill={fills[0]} stroke="#26316c" strokeWidth="7" onClick={()=>fill(0)}/>{[0,60,120,180,240,300].map((a,i)=><ellipse key={a} cx="260" cy="70" rx="42" ry="70" fill={fills[(i%3)+2]} stroke="#26316c" strokeWidth="7" transform={`rotate(${a} 260 155)`} onClick={()=>fill((i%3)+2)}/>)}<path d="M260 210V340" stroke="#26316c" strokeWidth="10"/></svg> :
      scene === "owl" ? <svg viewBox="0 0 520 360"><rect width="520" height="360" fill={fills[1]} onClick={()=>fill(1)}/><ellipse cx="260" cy="205" rx="105" ry="125" fill={fills[0]} stroke="#26316c" strokeWidth="8" onClick={()=>fill(0)}/><path d="M180 122L200 55L240 110M280 110L320 55L340 122" fill={fills[2]} stroke="#26316c" strokeWidth="7" onClick={()=>fill(2)}/><circle cx="222" cy="175" r="42" fill="white" stroke="#26316c" strokeWidth="6"/><circle cx="298" cy="175" r="42" fill="white" stroke="#26316c" strokeWidth="6"/><circle cx="222" cy="175" r="13" fill="#26316c"/><circle cx="298" cy="175" r="13" fill="#26316c"/><path d="M245 215L260 235L275 215Z" fill={fills[3]} stroke="#26316c" strokeWidth="5" onClick={()=>fill(3)}/></svg> :
      <svg viewBox="0 0 520 360"><rect width="520" height="360" fill={fills[1]} onClick={()=>fill(1)}/><circle cx="260" cy="165" r="82" fill={fills[0]} stroke="#26316c" strokeWidth="7" onClick={()=>fill(0)}/>{[0,45,90,135,180,225,270,315].map((a)=><path key={a} d="M260 36V76" stroke={fills[3]} strokeWidth="18" strokeLinecap="round" transform={`rotate(${a} 260 165)`} onClick={()=>fill(3)}/>)}<circle cx="232" cy="155" r="8" fill="#26316c"/><circle cx="288" cy="155" r="8" fill="#26316c"/><path d="M225 196Q260 225 295 196" fill="none" stroke="#26316c" strokeWidth="7" strokeLinecap="round"/></svg>}
      <div className="v5-canvas-hint">🎨 {lang === "el" ? "Πάτησε τα σχήματα για να τα χρωματίσεις" : "Tap shapes to color them"}</div>
    </div>
  </div>;
}

function StoryPlayer({ story, lang, onClose }: { story: Story; lang: Lang; onClose: () => void }) {
  const [slide, setSlide] = useState(0);
  const [playing, setPlaying] = useState(false);
  const line = lang === "el" ? story.slides[slide].el : story.slides[slide].en;
  useEffect(() => {
    if (!playing) return;
    const speech = window.speechSynthesis;
    speech.cancel();
    const u = new SpeechSynthesisUtterance(story.slides[slide].el);
    u.lang = "el-GR";
    u.rate = .88;
    speech.speak(u);
    const timer = window.setTimeout(() => setSlide((s) => (s + 1) % story.slides.length), 6500);
    return () => { window.clearTimeout(timer); speech.cancel(); };
  }, [playing, slide, story]);
  return <div className="v5-story-player">
    <button className="v5-player-close" onClick={onClose}><X/></button>
    <div className="v5-story-scene"><div className="v5-story-icon">{story.slides[slide].icon}</div><PisipoukMascot mood="story" compact/></div>
    <div className="v5-story-copy"><div className="v5-story-tag"><Volume2/> {lang === "el" ? "Ελληνική αφήγηση" : "Greek narration"}</div><h3>{lang === "el" ? story.titleEl : story.titleEn}</h3><p>{line}</p></div>
    <div className="v5-player-controls"><button onClick={()=>setSlide((slide-1+story.slides.length)%story.slides.length)}><ChevronLeft/></button><button className="main" onClick={()=>setPlaying(!playing)}>{playing?<Pause/>:<Play/>}</button><button onClick={()=>setSlide((slide+1)%story.slides.length)}><ChevronRight/></button><div className="v5-dots">{story.slides.map((_,i)=><span key={i} className={i===slide?"on":""}/>)}</div></div>
  </div>;
}

export function PreschoolV5() {
  const [lang, setLang] = useState<Lang>("el");
  const [age, setAge] = useState<PreschoolAge>("4–5");
  const [panel, setPanel] = useState<Panel>("home");
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [craftIndex, setCraftIndex] = useState(0);
  const [colorScene, setColorScene] = useState("sun");
  const [moveIndex, setMoveIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const t = COPY[lang];
  const week = weekNumber();
  const weeklyCraft = CRAFTS[week % CRAFTS.length];
  const weeklyStory = STORIES[week % STORIES.length];
  const weeklyMove = MOVE_MISSIONS[week % MOVE_MISSIONS.length];
  const stories = useMemo(()=>STORIES.filter((s)=>s.age.includes(age)),[age]);
  const crafts = useMemo(()=>CRAFTS.filter((c)=>c.ages.includes(age)),[age]);

  useEffect(()=>{
    if (!timerOn || seconds <= 0) return;
    const id = window.setInterval(()=>setSeconds((s)=>s-1),1000);
    return ()=>window.clearInterval(id);
  },[timerOn,seconds]);
  useEffect(()=>{ if (seconds===0) setTimerOn(false); },[seconds]);

  function open(next: Panel) {
    setPanel(next);
    setStoryIndex(null);
    trackEvent("preschool_v5_open", { panel: next, age, lang });
  }
  function startMove(i: number) {
    setMoveIndex(i); setSeconds(MOVE_MISSIONS[i].seconds); setTimerOn(true);
  }
  const mood: MascotMood = panel === "games" ? "play" : panel === "crafts" ? "craft" : panel === "color" ? "paint" : panel === "stories" ? "story" : panel === "move" ? "move" : panel === "today" ? "star" : "hello";

  const nav = [
    ["home", Home, t.home], ["games", Gamepad2, t.games], ["crafts", Scissors, t.crafts], ["color", Palette, t.color], ["stories", BookOpen, t.stories], ["move", PersonStanding, t.move],
  ] as const;

  return <div className={`v5 v5-${panel}`}>
    <style>{`
      .v5{--ink:#18235d;--violet:#654cf2;--yellow:#ffd44f;--pink:#ff598b;--blue:#46b8f4;--green:#48c989;--cream:#fff9eb;min-height:100svh;background:#dff6ff;color:var(--ink);overflow:hidden;font-family:inherit;position:relative}
      .v5 *{box-sizing:border-box}.v5 button,.v5 a{font:inherit}.v5 button{touch-action:manipulation}.v5-bg{position:absolute;inset:0;background:linear-gradient(180deg,rgba(218,245,255,.36),rgba(255,245,205,.28)),url('/preschool-hero.webp') center/cover no-repeat;filter:saturate(1.2) contrast(1.03);transform:scale(1.02)}.v5-bg:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(243,251,255,.96) 0%,rgba(243,251,255,.72) 42%,rgba(243,251,255,.10) 72%,rgba(243,251,255,.2) 100%)}
      .v5-shell{position:relative;z-index:2;height:100svh;display:grid;grid-template-rows:84px 1fr;gap:0}.v5-top{width:min(1540px,calc(100% - 28px));margin:0 auto;display:grid;grid-template-columns:255px 1fr auto;gap:14px;align-items:center;padding-top:10px}.v5-brand{height:62px;border-radius:25px;background:rgba(255,255,255,.94);box-shadow:0 12px 35px rgba(34,48,98,.14);display:flex;align-items:center;gap:11px;padding:7px 14px}.v5-brand img{width:47px;height:47px;border-radius:15px;object-fit:cover}.v5-brand b{display:block;font-size:1.15rem;letter-spacing:.02em}.v5-brand small{display:block;font-size:.66rem;color:#6654e8;font-weight:950;letter-spacing:.09em}.v5-nav{height:62px;border-radius:27px;background:rgba(255,255,255,.95);box-shadow:0 12px 35px rgba(34,48,98,.14);display:flex;justify-content:center;align-items:center;padding:5px;gap:2px}.v5-nav button{height:51px;min-width:98px;border:0;background:transparent;border-radius:20px;color:var(--ink);font-weight:950;font-size:.75rem;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;cursor:pointer}.v5-nav svg{width:21px;height:21px}.v5-nav button:hover,.v5-nav button.is-on{background:#eeeaff;color:#5d47db}.v5-actions{display:flex;gap:8px}.v5-actions button{height:58px;border:0;border-radius:23px;padding:0 15px;font-weight:950;display:flex;align-items:center;gap:7px;cursor:pointer}.v5-lang{background:white;color:var(--ink);box-shadow:0 10px 28px rgba(34,48,98,.12)}.v5-parents{background:linear-gradient(135deg,#735bf7,#8e56ed);color:white;box-shadow:0 14px 30px rgba(102,78,235,.26)}
      .v5-home{width:min(1540px,calc(100% - 28px));margin:0 auto;height:calc(100svh - 84px);display:grid;grid-template-columns:minmax(450px,.86fr) minmax(540px,1.14fr);grid-template-rows:1fr 235px;gap:14px 28px;padding:14px 0 18px}.v5-copy{align-self:center;padding-left:18px}.v5-chip{display:inline-flex;align-items:center;gap:7px;background:#fff0a9;border-radius:999px;padding:8px 14px;font-size:.78rem;font-weight:950;color:#665100;box-shadow:0 8px 20px rgba(96,78,0,.08)}.v5 h1{margin:14px 0 12px;font-size:clamp(4rem,6.1vw,7.4rem);line-height:.8;letter-spacing:-.065em;font-weight:1000}.v5 h1 span{display:block}.v5 h1 .a{color:#5e43db}.v5 h1 .b{color:#ffad18}.v5 h1 .c{color:#ff4f83}.v5-sub{font-size:1.08rem;line-height:1.45;font-weight:750;max-width:650px;color:#3f4772}.v5-ages{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:16px;max-width:720px}.v5-age{border:0;border-radius:23px;min-height:78px;padding:12px;text-align:left;cursor:pointer;box-shadow:0 12px 28px rgba(45,57,106,.10);background:white;color:var(--ink)}.v5-age:nth-child(1){background:#fff0b9}.v5-age:nth-child(2){background:#dff6ff}.v5-age:nth-child(3){background:#eee3ff}.v5-age.is-on{outline:4px solid rgba(99,76,242,.18)}.v5-age b{font-size:1.06rem}.v5-age small{display:block;margin-top:4px;color:#5d678d;font-size:.7rem;font-weight:800;line-height:1.25}.v5-start{margin-top:14px;border:0;border-radius:21px;min-height:55px;padding:0 20px;background:linear-gradient(135deg,#ffe25a,#ffc936);font-weight:1000;color:#2b326a;display:inline-flex;align-items:center;gap:9px;cursor:pointer;box-shadow:0 14px 32px rgba(157,115,0,.16)}
      .v5-hero{align-self:stretch;position:relative;border-radius:42px;overflow:hidden;background:linear-gradient(180deg,#8be0ff,#eaffef);box-shadow:0 28px 70px rgba(43,68,110,.2);border:7px solid rgba(255,255,255,.9)}.v5-hero:before{content:'';position:absolute;inset:0;background:url('/preschool-hero.webp') center/cover no-repeat;filter:saturate(1.3)}.v5-hero:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 48%,rgba(17,49,75,.2))}.v5-hero-mascot{position:absolute;right:3%;bottom:0;z-index:2;width:min(33%,285px)}.v5-hero-note{position:absolute;right:20px;top:20px;z-index:3;background:rgba(255,255,255,.92);backdrop-filter:blur(10px);border-radius:20px;padding:11px 15px;font-weight:950;max-width:220px;text-align:center;box-shadow:0 12px 28px rgba(28,53,94,.14)}
      .v5-worlds{grid-column:1/-1;display:grid;grid-template-columns:repeat(5,1fr);gap:12px;align-self:end}.v5-world{border:0;border-radius:29px;min-height:215px;padding:16px;position:relative;overflow:hidden;text-align:left;color:white;cursor:pointer;box-shadow:0 17px 38px rgba(38,45,93,.18);transition:.2s}.v5-world:hover{transform:translateY(-6px) scale(1.01)}.v5-world:before{content:'';position:absolute;inset:0;background:url('/preschool-hero.webp') center/650px auto;opacity:.12;mix-blend-mode:soft-light}.v5-world>*{position:relative;z-index:2}.v5-world .icon{width:64px;height:64px;border-radius:20px;background:rgba(255,255,255,.2);display:grid;place-items:center}.v5-world .icon svg{width:38px;height:38px}.v5-world h3{font-size:1.55rem;line-height:1;margin:20px 0 6px}.v5-world p{margin:0;font-weight:800;font-size:.82rem;opacity:.93}.v5-world .arrow{position:absolute;right:15px;bottom:15px;width:40px;height:40px;border-radius:50%;background:white;color:#27306c;display:grid;place-items:center}.v5-world.games{background:linear-gradient(145deg,#7359f7,#563fd6)}.v5-world.crafts{background:linear-gradient(145deg,#ff8d55,#f05d76)}.v5-world.color{background:linear-gradient(145deg,#ff63ac,#b64df1)}.v5-world.stories{background:linear-gradient(145deg,#46bdf6,#3489e8)}.v5-world.move{background:linear-gradient(145deg,#4bd18f,#24a969)}
      .v5-mascot{width:100%;height:auto;overflow:visible}.v5-mascot .wing{transform-origin:110px 118px;animation:v5wing 2.4s ease-in-out infinite}.v5-mascot .wing-left{animation-delay:-.2s}.v5-mascot .wing-right{animation-direction:reverse}.v5-mascot .eye{animation:v5blink 4.8s linear infinite}.v5-mascot.is-compact{max-width:150px}@keyframes v5wing{0%,100%{transform:rotate(0)}50%{transform:rotate(8deg)}}@keyframes v5blink{0%,45%,50%,100%{transform:scaleY(1);transform-origin:center}47%{transform:scaleY(.12)}}
      .v5-panel{position:fixed;z-index:100;inset:0;background:linear-gradient(180deg,#edfaff,#fff8e7);overflow:auto}.v5-panel-head{position:sticky;top:0;z-index:10;height:80px;background:rgba(255,255,255,.94);backdrop-filter:blur(16px);box-shadow:0 10px 28px rgba(39,48,96,.08);display:grid;grid-template-columns:auto 1fr auto;align-items:center;padding:0 max(16px,calc((100vw - 1480px)/2));gap:14px}.v5-panel-head button{border:0;background:#f0ecff;color:#5844d5;border-radius:18px;min-height:48px;padding:0 15px;font-weight:950;display:flex;align-items:center;gap:7px;cursor:pointer}.v5-panel-title{display:flex;align-items:center;gap:12px}.v5-panel-title h2{margin:0;font-size:1.65rem;letter-spacing:-.03em}.v5-panel-title p{margin:2px 0 0;font-size:.78rem;color:#67708e;font-weight:750}.v5-panel-mascot{width:70px}.v5-panel-body{width:min(1480px,calc(100% - 30px));margin:0 auto;padding:24px 0 40px}.v5-section-title{display:flex;align-items:end;justify-content:space-between;gap:15px;margin-bottom:16px}.v5-section-title h3{font-size:2.25rem;letter-spacing:-.04em;margin:0}.v5-section-title p{margin:5px 0 0;color:#66708f;font-weight:700}
      .v5-story-grid,.v5-craft-grid,.v5-move-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.v5-story-card,.v5-craft-card,.v5-move-card{border:0;border-radius:27px;background:white;box-shadow:0 14px 36px rgba(45,57,106,.1);padding:18px;text-align:left;color:var(--ink);cursor:pointer;min-height:225px;position:relative;overflow:hidden}.v5-story-card .art,.v5-craft-card .art,.v5-move-card .art{height:105px;border-radius:21px;background:linear-gradient(135deg,#dff6ff,#fff0c8);display:grid;place-items:center;font-size:4.4rem}.v5-story-card h4,.v5-craft-card h4,.v5-move-card h4{font-size:1.2rem;line-height:1.1;margin:14px 0 6px}.v5-card-meta{font-size:.75rem;font-weight:850;color:#7a83a0}.v5-story-card .go,.v5-craft-card .go,.v5-move-card .go{position:absolute;right:15px;bottom:15px;width:38px;height:38px;border-radius:50%;background:#6550ed;color:white;display:grid;place-items:center}
      .v5-story-player{max-width:980px;margin:10px auto;border-radius:34px;background:#142458;color:white;box-shadow:0 30px 80px rgba(21,32,82,.25);overflow:hidden;position:relative;display:grid;grid-template-columns:1.2fr .8fr;min-height:520px}.v5-player-close{position:absolute;right:14px;top:14px;z-index:4;border:0;background:rgba(255,255,255,.12);color:white;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;cursor:pointer}.v5-story-scene{background:radial-gradient(circle at 65% 25%,#ffd95d 0,transparent 16%),linear-gradient(180deg,#4a53c8,#151e65);display:grid;place-items:center;position:relative;overflow:hidden}.v5-story-scene:after{content:'';position:absolute;left:-10%;right:-10%;bottom:-70px;height:200px;background:#3d9b69;border-radius:50%}.v5-story-icon{font-size:9rem;z-index:2;filter:drop-shadow(0 16px 20px rgba(0,0,0,.2))}.v5-story-scene .v5-mascot{position:absolute;left:20px;bottom:15px;z-index:3;width:150px}.v5-story-copy{padding:65px 34px 20px;display:flex;flex-direction:column;justify-content:center}.v5-story-tag{display:inline-flex;align-items:center;gap:7px;color:#8fdcff;font-weight:950;font-size:.78rem}.v5-story-copy h3{font-size:2rem;line-height:1.05;margin:14px 0}.v5-story-copy p{font-size:1.1rem;line-height:1.65;color:#e2e8ff}.v5-player-controls{grid-column:1/-1;display:flex;align-items:center;justify-content:center;gap:12px;padding:15px;background:#0e194c}.v5-player-controls button{width:44px;height:44px;border:0;border-radius:50%;background:rgba(255,255,255,.12);color:white;display:grid;place-items:center;cursor:pointer}.v5-player-controls .main{width:58px;height:58px;background:#ff5b92}.v5-dots{display:flex;gap:5px;margin-left:10px}.v5-dots span{width:22px;height:5px;background:#46517f;border-radius:5px}.v5-dots span.on{background:#ffd85a}
      .v5-craft-detail{display:grid;grid-template-columns:1fr .95fr;gap:18px}.v5-pattern{background:white;border-radius:30px;box-shadow:0 16px 40px rgba(45,57,106,.10);padding:20px}.v5-pattern svg{width:100%;height:auto;max-height:480px}.v5-craft-info{background:white;border-radius:30px;box-shadow:0 16px 40px rgba(45,57,106,.10);padding:24px}.v5-craft-info h3{font-size:2rem;margin:0 0 12px}.v5-craft-info h4{margin:18px 0 8px}.v5-craft-info ul,.v5-craft-info ol{padding-left:22px;line-height:1.7}.v5-print{border:0;background:#ff6b8f;color:white;border-radius:18px;min-height:50px;padding:0 17px;font-weight:950;display:inline-flex;align-items:center;gap:8px;cursor:pointer}
      .v5-color-tabs{display:flex;gap:8px;overflow-x:auto;padding-bottom:10px}.v5-color-tabs button{border:0;background:white;border-radius:18px;padding:10px 14px;font-weight:900;white-space:nowrap;cursor:pointer;box-shadow:0 7px 18px rgba(45,57,106,.08)}.v5-color-tabs button.is-on{background:#6a54ef;color:white}.v5-color-workspace{display:grid;grid-template-columns:90px 1fr;gap:12px;margin-top:10px}.v5-palette{background:white;border-radius:26px;padding:12px;display:flex;flex-direction:column;gap:10px;box-shadow:0 14px 34px rgba(45,57,106,.10)}.v5-palette button{width:54px;height:54px;border:4px solid white;border-radius:50%;box-shadow:0 4px 12px rgba(30,42,90,.12);cursor:pointer}.v5-palette button.is-on{outline:4px solid #5f4be0}.v5-palette .reset{background:#f1effa;color:#5146b8;display:grid;place-items:center}.v5-canvas{position:relative;background:white;border-radius:30px;padding:12px;box-shadow:0 16px 40px rgba(45,57,106,.10);min-height:560px;display:grid;place-items:center}.v5-canvas svg{width:min(850px,100%);max-height:530px}.v5-canvas-hint{position:absolute;left:18px;top:18px;background:rgba(255,255,255,.9);border-radius:999px;padding:9px 13px;font-size:.78rem;font-weight:950;box-shadow:0 6px 18px rgba(45,57,106,.1)}
      .v5-move-card button{margin-top:12px;border:0;background:#42c882;color:white;border-radius:16px;min-height:44px;padding:0 14px;font-weight:950;cursor:pointer}.v5-timer{max-width:700px;margin:18px auto 0;background:#16275d;color:white;border-radius:34px;padding:28px;text-align:center;box-shadow:0 24px 60px rgba(34,45,91,.2)}.v5-timer .icon{font-size:5.5rem}.v5-timer strong{display:block;font-size:4.5rem;line-height:1;margin:12px 0}.v5-timer p{color:#dce6ff}.v5-timer button{border:0;background:#ffd44f;color:#27306b;border-radius:18px;min-height:48px;padding:0 18px;font-weight:950;cursor:pointer}
      .v5-today-card{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}.v5-loop-step{background:white;border-radius:26px;padding:18px;box-shadow:0 14px 35px rgba(45,57,106,.09);min-height:190px}.v5-loop-step .n{width:36px;height:36px;border-radius:50%;background:#27306b;color:white;display:grid;place-items:center;font-weight:950}.v5-loop-step .e{font-size:3rem;margin:16px 0}.v5-loop-step h4{font-size:1.2rem;margin:0 0 5px}.v5-loop-step p{font-size:.86rem;color:#6b7491;line-height:1.45}.v5-weekly-banner{margin-top:16px;border-radius:30px;padding:18px 20px;background:linear-gradient(135deg,#6550ef,#9356e8);color:white;display:grid;grid-template-columns:auto 1fr auto;gap:16px;align-items:center}.v5-weekly-banner .badge{width:64px;height:64px;border-radius:20px;background:rgba(255,255,255,.15);display:grid;place-items:center;font-size:2.2rem}.v5-weekly-banner h4{font-size:1.25rem;margin:0}.v5-weekly-banner p{margin:4px 0 0;color:#ece9ff}.v5-weekly-banner button{border:0;background:#ffd850;color:#27306b;border-radius:17px;min-height:46px;padding:0 15px;font-weight:950;cursor:pointer}
      .v5-parent-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.v5-parent-card{background:white;border-radius:28px;padding:22px;box-shadow:0 14px 36px rgba(45,57,106,.09)}.v5-parent-card svg{width:34px;height:34px;color:#6550ef}.v5-parent-card h4{font-size:1.22rem;margin:14px 0 7px}.v5-parent-card p{color:#68718e;line-height:1.55}.v5-parent-card a{display:inline-flex;margin-top:8px;color:#5944d8;font-weight:950;text-decoration:none}
      .v5-mobile-nav{display:none}
      @media(max-width:1100px){.v5-top{grid-template-columns:220px 1fr auto}.v5-nav button{min-width:72px;font-size:.65rem}.v5-actions .v5-parents span{display:none}.v5-home{grid-template-columns:1fr 1fr;grid-template-rows:1fr 205px}.v5 h1{font-size:clamp(3.5rem,7vw,6rem)}.v5-world{min-height:190px}.v5-world h3{font-size:1.3rem}.v5-world p{font-size:.72rem}.v5-story-grid,.v5-craft-grid,.v5-move-grid{grid-template-columns:repeat(2,1fr)}}
      @media(max-width:760px){.v5{overflow:auto}.v5-shell{height:auto;min-height:100svh;display:block}.v5-top{height:72px;width:100%;padding:8px 10px;display:flex;justify-content:space-between}.v5-brand{height:54px;padding:5px 10px}.v5-brand img{width:42px;height:42px}.v5-brand small{display:none}.v5-brand b{font-size:.95rem}.v5-nav{display:none}.v5-actions .v5-parents{display:none}.v5-actions button{height:48px}.v5-home{width:100%;height:auto;min-height:calc(100svh - 72px);padding:10px 12px 92px;display:block}.v5-copy{padding:0}.v5-chip{font-size:.68rem}.v5 h1{font-size:clamp(3.25rem,17vw,5.2rem);margin-top:10px}.v5-sub{font-size:.94rem}.v5-ages{grid-template-columns:1fr 1fr 1fr;gap:6px}.v5-age{min-height:72px;padding:9px}.v5-age small{font-size:.59rem}.v5-hero{height:260px;margin-top:14px}.v5-worlds{margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:9px}.v5-world{min-height:150px;border-radius:23px;padding:13px}.v5-world:last-child{grid-column:1/-1;min-height:125px}.v5-world .icon{width:48px;height:48px}.v5-world h3{font-size:1.15rem;margin:11px 0 4px}.v5-mobile-nav{position:fixed;z-index:90;left:8px;right:8px;bottom:8px;height:72px;border-radius:24px;background:rgba(255,255,255,.96);box-shadow:0 10px 35px rgba(28,43,91,.18);display:grid;grid-template-columns:repeat(5,1fr);padding:6px}.v5-mobile-nav button{border:0;background:transparent;color:#26306b;border-radius:17px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:.58rem;font-weight:950}.v5-mobile-nav button.is-on{background:#eeeaff;color:#5f49df}.v5-mobile-nav svg{width:20px}.v5-panel{padding-bottom:82px}.v5-panel-head{height:68px;padding:0 10px;grid-template-columns:auto 1fr auto}.v5-panel-head button{padding:0 10px}.v5-panel-title h2{font-size:1.25rem}.v5-panel-title p{display:none}.v5-panel-mascot{width:56px}.v5-panel-body{width:calc(100% - 20px);padding-top:16px}.v5-section-title h3{font-size:1.7rem}.v5-story-grid,.v5-craft-grid,.v5-move-grid{grid-template-columns:1fr}.v5-story-player{grid-template-columns:1fr;min-height:0}.v5-story-scene{min-height:290px}.v5-story-copy{padding:24px}.v5-player-controls{grid-column:1}.v5-craft-detail{grid-template-columns:1fr}.v5-color-workspace{grid-template-columns:1fr}.v5-palette{flex-direction:row;overflow-x:auto}.v5-palette button{min-width:48px;width:48px;height:48px}.v5-canvas{min-height:400px}.v5-today-card{grid-template-columns:1fr 1fr}.v5-parent-grid{grid-template-columns:1fr}.v5-weekly-banner{grid-template-columns:auto 1fr}.v5-weekly-banner button{grid-column:1/-1}}
      @media print{body *{visibility:hidden!important}.v5-pattern,.v5-pattern *{visibility:visible!important}.v5-pattern{position:fixed!important;inset:0!important;box-shadow:none!important;border-radius:0!important;padding:18mm!important}.v5-pattern svg{width:100%!important;height:100%!important}}
      @media(prefers-reduced-motion:reduce){.v5 *{animation:none!important;scroll-behavior:auto!important}}
    `}</style>
    <div className="v5-bg"/>
    <div className="v5-shell">
      <header className="v5-top">
        <div className="v5-brand"><img src="/favicon.webp" alt=""/><span><b>ΠΙΣΙΠΟΥΚ</b><small>VIRTUAL PRESCHOOL+</small></span></div>
        <nav className="v5-nav" aria-label={lang === "el" ? "Πλοήγηση παιδιού" : "Child navigation"}>{nav.map(([id,Icon,label])=><button key={id} className={panel===id?"is-on":""} onClick={()=>open(id)}><Icon/><span>{label}</span></button>)}</nav>
        <div className="v5-actions"><button className="v5-lang" onClick={()=>setLang(lang==="el"?"en":"el")}><Languages/><span>{lang.toUpperCase()}</span></button><button className="v5-parents" onClick={()=>open("parents")}><LockKeyhole/><span>{t.parents}</span></button></div>
      </header>

      <main className="v5-home" aria-hidden={panel!=="home"}>
        <section className="v5-copy">
          <div className="v5-chip"><Sparkles/> {lang === "el" ? "ΕΛΛΗΝΙΚΟ ONLINE PRESCHOOL" : "GREEK-FIRST ONLINE PRESCHOOL"}</div>
          <h1><span className="a">{t.headline1}</span><span className="b">{t.headline2}</span><span className="c">{t.headline3}</span></h1>
          <p className="v5-sub">{t.sub}</p>
          <div className="v5-ages">{AGES.map((a)=><button className={`v5-age ${age===a.id?"is-on":""}`} key={a.id} onClick={()=>{setAge(a.id);trackEvent("preschool_v5_age",{age:a.id})}}><b>{a.label} {lang === "el" ? "ετών" : "yrs"}</b><small>{lang === "el" ? a.noteEl : a.noteEn}</small></button>)}</div>
          <button className="v5-start" onClick={()=>open("today")}><Play/> {t.start}</button>
        </section>
        <section className="v5-hero"><div className="v5-hero-note">✨ {lang === "el" ? "Κάθε εβδομάδα ένας νέος μικρός κόσμος!" : "A fresh little world every week!"}</div><div className="v5-hero-mascot"><PisipoukMascot mood="hello"/></div></section>
        <section className="v5-worlds">
          <button className="v5-world games" onClick={()=>open("games")}><div className="icon"><Gamepad2/></div><h3>{t.games}</h3><p>{lang === "el" ? "Διαδραστικά παιχνίδια ανά ηλικία" : "Interactive age-based games"}</p><span className="arrow"><ChevronRight/></span></button>
          <button className="v5-world crafts" onClick={()=>open("crafts")}><div className="icon"><Scissors/></div><h3>{t.crafts}</h3><p>{lang === "el" ? "Πατρόν Α4 • υλικά • βήματα" : "A4 patterns • materials • steps"}</p><span className="arrow"><ChevronRight/></span></button>
          <button className="v5-world color" onClick={()=>open("color")}><div className="icon"><Palette/></div><h3>{t.color}</h3><p>{lang === "el" ? "Χρωματίζω πάνω στην οθόνη" : "Color directly on screen"}</p><span className="arrow"><ChevronRight/></span></button>
          <button className="v5-world stories" onClick={()=>open("stories")}><div className="icon"><BookOpen/></div><h3>{t.stories}</h3><p>{lang === "el" ? "Δικός μας player • ελληνική αφήγηση" : "Our player • Greek narration"}</p><span className="arrow"><ChevronRight/></span></button>
          <button className="v5-world move" onClick={()=>open("move")}><div className="icon"><PersonStanding/></div><h3>{t.move}</h3><p>{lang === "el" ? "Χορός • κίνηση • μικρές αποστολές" : "Dance • movement • mini missions"}</p><span className="arrow"><ChevronRight/></span></button>
        </section>
      </main>
    </div>

    {panel!=="home" && <section className="v5-panel">
      <header className="v5-panel-head"><button onClick={()=>open("home")}><ArrowLeft/><span>{t.back}</span></button><div className="v5-panel-title"><div><h2>{panel==="games"?t.games:panel==="crafts"?t.crafts:panel==="color"?t.color:panel==="stories"?t.stories:panel==="move"?t.move:panel==="parents"?t.parents:t.today}</h2><p>{lang === "el" ? `Ηλικία ${age} ετών • Εβδομάδα ${week}` : `Age ${age} • Week ${week}`}</p></div></div><div className="v5-panel-mascot"><PisipoukMascot mood={mood}/></div></header>
      <div className="v5-panel-body">
        {panel==="games" && <><div className="v5-section-title"><div><h3>{lang === "el" ? "Παίζω και μαθαίνω" : "Play & learn"}</h3><p>{lang === "el" ? "19 θεματικά παιχνίδια με διαφορετικούς στόχους ανά ηλικία." : "19 thematic games with age-specific learning goals."}</p></div><div className="v5-chip">🎯 {age}</div></div><PreschoolGameLab age={age}/></>}
        {panel==="stories" && <>{storyIndex===null ? <><div className="v5-section-title"><div><h3>{lang === "el" ? "Ελληνικές ιστορίες του Πισιπούκ" : "Pisipouk’s Greek stories"}</h3><p>{t.greekOnly}</p></div><div className="v5-chip"><Volume2/> EL-GR</div></div><div className="v5-story-grid">{stories.map((s,i)=><button className="v5-story-card" key={s.titleEl} onClick={()=>setStoryIndex(i)}><div className="art">{s.slides[0].icon}</div><h4>{lang === "el" ? s.titleEl : s.titleEn}</h4><div className="v5-card-meta">4 {lang === "el" ? "σκηνές • ελληνική αφήγηση" : "scenes • Greek narration"}</div><span className="go"><Play/></span></button>)}</div></> : <StoryPlayer story={stories[storyIndex]} lang={lang} onClose={()=>setStoryIndex(null)}/>}</>}
        {panel==="crafts" && <><div className="v5-section-title"><div><h3>{lang === "el" ? "Κατασκευές με πατρόν Α4" : "Crafts with A4 templates"}</h3><p>{lang === "el" ? "Εκτύπωσε, κόψε με επίβλεψη και δημιούργησε μαζί με το παιδί." : "Print, cut with supervision and create together."}</p></div><div className="v5-chip"><Printer/> A4</div></div><div className="v5-craft-grid">{crafts.map((c,i)=><button key={c.titleEl} className="v5-craft-card" onClick={()=>setCraftIndex(i)}><div className="art">{c.icon}</div><h4>{lang === "el"?c.titleEl:c.titleEn}</h4><div className="v5-card-meta">{c.minutes}′ • {lang === "el" ? "πατρόν + οδηγίες" : "template + guide"}</div><span className="go"><ChevronRight/></span></button>)}</div><div className="v5-craft-detail" style={{marginTop:18}}><div className="v5-pattern"><PatternArt kind={(crafts[craftIndex]??weeklyCraft).pattern}/></div><div className="v5-craft-info"><h3>{lang === "el"?(crafts[craftIndex]??weeklyCraft).titleEl:(crafts[craftIndex]??weeklyCraft).titleEn}</h3><button className="v5-print" onClick={()=>window.print()}><Printer/> {lang === "el" ? "Εκτύπωση πατρόν Α4" : "Print A4 template"}</button><h4>{lang === "el" ? "Υλικά" : "Materials"}</h4><ul>{(lang === "el"?(crafts[craftIndex]??weeklyCraft).materialsEl:(crafts[craftIndex]??weeklyCraft).materialsEn).map(x=><li key={x}>{x}</li>)}</ul><h4>{lang === "el" ? "Βήματα" : "Steps"}</h4><ol>{(lang === "el"?(crafts[craftIndex]??weeklyCraft).stepsEl:(crafts[craftIndex]??weeklyCraft).stepsEn).map(x=><li key={x}>{x}</li>)}</ol></div></div></>}
        {panel==="color" && <><div className="v5-section-title"><div><h3>{lang === "el" ? "Το εργαστήρι ζωγραφικής" : "Coloring studio"}</h3><p>{lang === "el" ? "Μεγάλα σχήματα, καθαρές γραμμές και εύκολο tap για παιδιά 2–6." : "Large shapes, clean outlines and easy tap coloring for ages 2–6."}</p></div><div className="v5-chip"><Palette/> {age}</div></div><div className="v5-color-tabs">{COLOR_SCENES.map(s=><button key={s.id} className={colorScene===s.id?"is-on":""} onClick={()=>setColorScene(s.id)}>{s.icon} {lang === "el"?s.titleEl:s.titleEn}</button>)}</div><ColoringCanvas scene={colorScene} lang={lang}/></>}
        {panel==="move" && <><div className="v5-section-title"><div><h3>{lang === "el" ? "Σηκωνόμαστε από την οθόνη" : "Move away from the screen"}</h3><p>{lang === "el" ? "Μικρές ασφαλείς αποστολές κίνησης με χρονόμετρο." : "Short safe movement missions with a timer."}</p></div><div className="v5-chip"><Clock3/> 20–35″</div></div><div className="v5-move-grid">{MOVE_MISSIONS.map((m,i)=><div className="v5-move-card" key={m.titleEl}><div className="art">{m.icon}</div><h4>{lang === "el"?m.titleEl:m.titleEn}</h4><p>{lang === "el"?m.textEl:m.textEn}</p><button onClick={()=>startMove(i)}><Play/> {lang === "el" ? "Έναρξη" : "Start"}</button></div>)}</div><div className="v5-timer"><div className="icon">{MOVE_MISSIONS[moveIndex].icon}</div><h3>{lang === "el"?MOVE_MISSIONS[moveIndex].titleEl:MOVE_MISSIONS[moveIndex].titleEn}</h3><strong>{seconds || MOVE_MISSIONS[moveIndex].seconds}</strong><p>{lang === "el"?MOVE_MISSIONS[moveIndex].textEl:MOVE_MISSIONS[moveIndex].textEn}</p><button onClick={()=>{if(seconds===0)setSeconds(MOVE_MISSIONS[moveIndex].seconds);setTimerOn(!timerOn)}}>{timerOn?<Pause/>:<Play/>} {timerOn?(lang === "el"?"Παύση":"Pause"):(lang === "el"?"Ξεκίνα":"Start")}</button></div></>}
        {panel==="today" && <><div className="v5-section-title"><div><h3>{lang === "el" ? "Το σημερινό ταξίδι" : "Today’s journey"}</h3><p>{lang === "el" ? "20 λεπτά με αρχή, μέση και επιστροφή στον πραγματικό κόσμο." : "A 20-minute loop that ends back in the real world."}</p></div><div className="v5-chip"><CalendarDays/> {t.today}</div></div><div className="v5-today-card">{[["1","🎮",t.games,lang==="el"?"Ένα παιχνίδι για την ηλικία του παιδιού":"One age-based game"],["2","📖",t.stories,lang==="el"?weeklyStory.titleEl:weeklyStory.titleEn],["3","✂️",t.crafts,lang==="el"?weeklyCraft.titleEl:weeklyCraft.titleEn],["4","🤸",t.move,lang==="el"?weeklyMove.titleEl:weeklyMove.titleEn]].map(x=><div className="v5-loop-step" key={x[0]}><div className="n">{x[0]}</div><div className="e">{x[1]}</div><h4>{x[2]}</h4><p>{x[3]}</p></div>)}</div><div className="v5-weekly-banner"><div className="badge">🏆</div><div><h4>{t.weekly}</h4><p>{t.weeklyNote}</p></div><button onClick={()=>open("games")}><Star/> {t.start}</button></div></>}
        {panel==="parents" && <><div className="v5-section-title"><div><h3>{lang === "el" ? "Γωνιά Γονέων" : "Parent corner"}</h3><p>{t.parentIntro}</p></div><div className="v5-chip"><ShieldCheck/> {lang === "el" ? "Ασφαλές περιβάλλον" : "Safe environment"}</div></div><div className="v5-parent-grid"><div className="v5-parent-card"><ShieldCheck/><h4>{lang === "el" ? "Παιδική ασφάλεια" : "Child safety"}</h4><p>{lang === "el" ? "Χωρίς εξωτερικά links μέσα στις παιδικές δραστηριότητες, χωρίς ανοιχτό chat και με σαφή επιστροφή στον γονέα." : "No external links inside child activities, no open chat and a clear parent exit."}</p></div><div className="v5-parent-card"><Printer/><h4>{lang === "el" ? "Εκτυπώσιμο υλικό" : "Printables"}</h4><p>{lang === "el" ? "Τα πατρόν των κατασκευών είναι Α4 και μπορούν να εκτυπωθούν απευθείας." : "Craft templates are A4 and can be printed directly."}</p><button className="v5-print" onClick={()=>open("crafts")}><Scissors/> {t.crafts}</button></div><div className="v5-parent-card"><Heart/><h4>{lang === "el" ? "Εβδομαδιαία ανανέωση" : "Weekly refresh"}</h4><p>{lang === "el" ? `Η εβδομάδα ${week} εμφανίζει διαφορετικό συνδυασμό ιστορίας, κατασκευής, ζωγραφικής και κίνησης.` : `Week ${week} rotates a different story, craft, coloring scene and movement mission.`}</p><a href="/parent-zone">{lang === "el" ? "Πλήρης περιοχή γονέων →" : "Full parent area →"}</a></div></div></>}
      </div>
    </section>}

    <nav className="v5-mobile-nav">{[["games",Gamepad2,t.games],["crafts",Scissors,t.crafts],["color",Palette,t.color],["stories",BookOpen,t.stories],["move",PersonStanding,t.move]] .map(([id,Icon,label])=><button key={String(id)} className={panel===id?"is-on":""} onClick={()=>open(id as Panel)}><Icon/><span>{label}</span></button>)}</nav>
  </div>;
}
