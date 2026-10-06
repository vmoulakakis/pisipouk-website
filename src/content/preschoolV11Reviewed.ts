import type { PreschoolAge } from "@/content/virtualPreschoolMedia";
import type { ReviewedVariant } from "@/lib/preschoolAdaptive";

const ALL:PreschoolAge[]=["2–3","4–5","5–6"];
const YOUNG:PreschoolAge[]=["2–3","4–5"];
const OLDER:PreschoolAge[]=["4–5","5–6"];

export type ReviewedActivity={id:string;icon:string;title:string;short:string;skill:string;benchmark:string;variants:ReviewedVariant[]};

export const REVIEWED_ACTIVITIES:ReviewedActivity[]=[
 {id:"color-sort",icon:"🧺",title:"Το Εργαστήριο των Χρωμάτων",short:"Σέρνω, ταξινομώ και ανακαλύπτω",skill:"Κατηγοριοποίηση • χρώματα • λεπτή κίνηση",benchmark:"open-ended sorting + touch manipulation",variants:[
  {id:"fruit-baskets",ages:YOUNG,title:"Τα καλάθια των φρούτων",prompt:"Βάλε κάθε φρούτο στο καλάθι με το σωστό χρώμα.",parentPrompt:"Ρώτησε: ποιο άλλο πράγμα στο σπίτι έχει αυτό το χρώμα;",theme:"Αγορά",difficulty:1,interaction:"drag",mode:"guided",data:{bins:["🔴","🟡","🟢"],items:["🍎|0","🍌|1","🥝|2"]}},
  {id:"sea-sort",ages:ALL,title:"Θησαυροί του Αιγαίου",prompt:"Ταξινόμησε τους θησαυρούς της θάλασσας.",parentPrompt:"Βρείτε μαζί τι ανήκει στη θάλασσα και τι όχι.",theme:"Θάλασσα",difficulty:2,interaction:"sort",mode:"coop",data:{bins:["🌊 Θάλασσα","🏖️ Παραλία"],items:["🐠|0","🐚|1","🪸|0","🏖️|1"]}},
  {id:"recycle-sort",ages:OLDER,title:"Ο σταθμός ανακύκλωσης",prompt:"Βοήθησε τον Πισιπούκ να βάλει κάθε υλικό στο σωστό σημείο.",parentPrompt:"Μετά κάντε μια αληθινή μικρή ταξινόμηση ανακύκλωσης.",theme:"Περιβάλλον",difficulty:3,interaction:"drag",mode:"coop",data:{bins:["📄 Χαρτί","🥫 Μέταλλο","🧴 Πλαστικό"],items:["📦|0","🥫|1","🧴|2","📰|0"]}},
 ]},
 {id:"hidden-world",icon:"🔎",title:"Κρυμμένοι Θησαυροί",short:"Ψάχνω μέσα σε ζωντανές σκηνές",skill:"Παρατήρηση • συγκέντρωση • λεξιλόγιο",benchmark:"hidden-object discovery",variants:[
  {id:"garden-stars",ages:ALL,title:"Τα αστέρια στον κήπο",prompt:"Βρες τα 5 μικρά αστέρια που κρύφτηκαν στα λουλούδια.",parentPrompt:"Μετά παίξτε “βρες κάτι…” στο δωμάτιο.",theme:"Κήπος",difficulty:1,interaction:"hunt",mode:"guided",data:{count:5,scene:"garden"}},
  {id:"island-shells",ages:YOUNG,title:"Κοχύλια στο νησί",prompt:"Βρες 6 κοχύλια στην παραλία του Πισιπούκ.",parentPrompt:"Μέτρα μαζί του κάθε εύρημα δυνατά.",theme:"Νησί",difficulty:2,interaction:"hunt",mode:"coop",data:{count:6,scene:"island"}},
  {id:"museum-shapes",ages:OLDER,title:"Το μουσείο των σχημάτων",prompt:"Βρες κύκλους, τρίγωνα και τετράγωνα στη σκηνή.",parentPrompt:"Ψάξτε μετά σχήματα σε αληθινά αντικείμενα.",theme:"Σχήματα",difficulty:3,interaction:"hunt",mode:"guided",data:{count:8,scene:"shapes"}},
 ]},
 {id:"maze-adventure",icon:"🗺️",title:"Οι Δρόμοι του Πισιπούκ",short:"Λαβύρινθοι που αλλάζουν",skill:"Χωρική σκέψη • σχεδιασμός • επιμονή",benchmark:"maze + obstacle problem solving",variants:[
  {id:"harbor-maze",ages:YOUNG,title:"Στο μικρό λιμανάκι",prompt:"Βοήθησε το καραβάκι να φτάσει στον φάρο.",parentPrompt:"Πες “πάνω, κάτω, δεξιά, αριστερά” όσο παίζετε.",theme:"Λιμάνι",difficulty:1,interaction:"maze",mode:"guided",data:{size:4,goal:"🏮",player:"⛵"}},
  {id:"forest-maze",ages:ALL,title:"Το μονοπάτι στο δάσος",prompt:"Ο Πισιπούκ ψάχνει τη φωλιά του φίλου του.",parentPrompt:"Ζήτησε από το παιδί να προβλέπει την επόμενη κίνηση.",theme:"Δάσος",difficulty:2,interaction:"maze",mode:"coop",data:{size:5,goal:"🏡",player:"🦉"}},
  {id:"space-maze",ages:OLDER,title:"Διαστημική διαδρομή",prompt:"Πέρασε ανάμεσα από τους αστεροειδείς και φτάσε στο αστέρι.",parentPrompt:"Ρώτησε: υπάρχει άλλος δρόμος;",theme:"Διάστημα",difficulty:3,interaction:"maze",mode:"guided",data:{size:6,goal:"⭐",player:"🚀"}},
 ]},
 {id:"trace-lab",icon:"✏️",title:"Μαγικές Γραμμές",short:"Ιχνογραφώ με δάχτυλο ή stylus",skill:"Προγραφή • συντονισμός ματιού-χεριού",benchmark:"tracing + fine-motor",variants:[
  {id:"wave-trace",ages:ALL,title:"Το κύμα του Αιγαίου",prompt:"Ακολούθησε το κύμα χωρίς να βιαστείς.",parentPrompt:"Κάντε το ίδιο σχήμα στον αέρα με όλο το χέρι.",theme:"Θάλασσα",difficulty:1,interaction:"trace",mode:"open",data:{path:"wave"}},
  {id:"spiral-trace",ages:OLDER,title:"Το σαλιγκάρι",prompt:"Ακολούθησε τη σπείρα μέχρι το κέντρο.",parentPrompt:"Σχεδιάστε μετά σπείρες σε χαρτί.",theme:"Φύση",difficulty:2,interaction:"trace",mode:"open",data:{path:"spiral"}},
  {id:"letter-trace",ages:OLDER,title:"Το γράμμα Π",prompt:"Ιχνογράφησε το Π του Πισιπούκ.",parentPrompt:"Βρείτε 3 λέξεις που αρχίζουν από Π.",theme:"Γλώσσα",difficulty:3,interaction:"trace",mode:"guided",data:{path:"pi"}},
 ]},
 {id:"builder",icon:"🏗️",title:"Χτίζω τον Κόσμο μου",short:"Open-ended 3D playset",skill:"Φαντασία • σχεδιασμός • αφήγηση",benchmark:"open-ended building + pretend play",variants:[
  {id:"island-builder",ages:ALL,title:"Το νησί του Πισιπούκ",prompt:"Χτίσε ένα μικρό νησί όπως το φαντάζεσαι.",parentPrompt:"Ρώτησε: ποιος μένει εδώ και τι κάνει σήμερα;",theme:"Ελλάδα",difficulty:1,interaction:"build",mode:"open",data:{pieces:["🏠","🌳","⛵","🌻","🐶","🦉","☀️","🌈"]}},
  {id:"farm-builder",ages:YOUNG,title:"Η μικρή φάρμα",prompt:"Φτιάξε χώρο για τα ζώα και δώσε τους μια ιστορία.",parentPrompt:"Μιμηθείτε μαζί τους ήχους των ζώων.",theme:"Φάρμα",difficulty:1,interaction:"build",mode:"coop",data:{pieces:["🏠","🌳","🐄","🐔","🐑","🚜","🌾","💧"]}},
  {id:"space-builder",ages:OLDER,title:"Βάση στο φεγγάρι",prompt:"Σχεδίασε μια βάση για μικρούς εξερευνητές.",parentPrompt:"Τι θα χρειάζονταν για να ζήσουν εκεί;",theme:"STEM",difficulty:3,interaction:"build",mode:"open",data:{pieces:["🚀","🌕","🛰️","⭐","🔭","🪐","👩‍🚀","🦉"]}},
 ]},
 {id:"dress-role",icon:"🎭",title:"Ο Πισιπούκ Παίζει Ρόλους",short:"Ντύνω τον ήρωα και φτιάχνω σενάρια",skill:"Pretend play • λεξιλόγιο • κοινωνικοί ρόλοι",benchmark:"dress-up + role play",variants:[
  {id:"artist-role",ages:ALL,title:"Πισιπούκ καλλιτέχνης",prompt:"Ντύσε τον Πισιπούκ για να δημιουργήσει ένα έργο.",parentPrompt:"Τι θα ζωγράφιζε και για ποιον;",theme:"Τέχνη",difficulty:1,interaction:"dress",mode:"open",data:{hats:["🎨","🧢","🌻"],props:["🖌️","🖍️","✂️"]}},
  {id:"scientist-role",ages:OLDER,title:"Πισιπούκ επιστήμονας",prompt:"Ετοίμασέ τον για ένα ασφαλές πείραμα.",parentPrompt:"Κάντε μια πρόβλεψη πριν δοκιμάσετε κάτι απλό.",theme:"STEM",difficulty:2,interaction:"dress",mode:"coop",data:{hats:["🥽","🎓","🧢"],props:["🔍","🧪","🔭"]}},
  {id:"storyteller-role",ages:ALL,title:"Πισιπούκ παραμυθάς",prompt:"Δώσε του αντικείμενα για μια καινούργια ιστορία.",parentPrompt:"Συνεχίστε εναλλάξ την ιστορία μία πρόταση ο καθένας.",theme:"Ιστορίες",difficulty:2,interaction:"dress",mode:"coop",data:{hats:["👑","🎩","🌙"],props:["📚","⭐","🗺️"]}},
 ]},
 {id:"cause-effect",icon:"🔬",title:"Μικροί Ερευνητές",short:"Προβλέπω, δοκιμάζω, παρατηρώ",skill:"STEM • αιτία-αποτέλεσμα • περιέργεια",benchmark:"open-ended preschool engineering/science",variants:[
  {id:"grow-plant",ages:ALL,title:"Μεγαλώνει το φυτό;",prompt:"Δώσε νερό και φως και δες τι αλλάζει.",parentPrompt:"Φυτέψτε μετά φακές σε βαμβάκι.",theme:"Φύση",difficulty:1,interaction:"cause",mode:"guided",data:{kind:"plant"}},
  {id:"float-sink",ages:OLDER,title:"Βυθίζεται ή επιπλέει;",prompt:"Κάνε πρώτα πρόβλεψη και μετά δοκίμασε.",parentPrompt:"Δοκιμάστε με ασφαλή αντικείμενα σε μια λεκάνη.",theme:"Νερό",difficulty:2,interaction:"cause",mode:"coop",data:{kind:"float"}},
  {id:"shadow-lab",ages:ALL,title:"Μεγάλες και μικρές σκιές",prompt:"Μετακίνησε το φως και παρατήρησε τη σκιά.",parentPrompt:"Παίξτε με φακό σε τοίχο μαζί.",theme:"Φως",difficulty:2,interaction:"cause",mode:"open",data:{kind:"shadow"}},
 ]},
 {id:"rhythm",icon:"🥁",title:"Ρυθμοί του Πισιπούκ",short:"Ακούω, αντιγράφω και δημιουργώ",skill:"Ακουστική μνήμη • ρυθμός • αυτορρύθμιση",benchmark:"music imitation + free composition",variants:[
  {id:"clap-2",ages:YOUNG,title:"Παλαμάκια δύο βημάτων",prompt:"Άκου: 👏 🥁. Τώρα εσύ!",parentPrompt:"Κάντε ρυθμούς ο ένας για τον άλλον.",theme:"Ρυθμός",difficulty:1,interaction:"rhythm",mode:"coop",data:{sequence:["👏","🥁"]}},
  {id:"clap-4",ages:ALL,title:"Ρυθμός τεσσάρων",prompt:"Άκου και επανάλαβε: 👏 🥁 👏 🔔.",parentPrompt:"Άλλαξε ένα βήμα και ζήτησε να το εντοπίσει.",theme:"Μουσική",difficulty:2,interaction:"rhythm",mode:"guided",data:{sequence:["👏","🥁","👏","🔔"]}},
  {id:"wave-rhythm",ages:OLDER,title:"Ρυθμός του κύματος",prompt:"Φτιάξε δικό σου μοτίβο με 🌊 👏 🔔.",parentPrompt:"Χτυπήστε τον ρυθμό και με το σώμα.",theme:"Θάλασσα",difficulty:3,interaction:"rhythm",mode:"open",data:{sequence:["🌊","👏","🔔","🌊"]}},
 ]},
 {id:"branch-story",icon:"📚",title:"Ιστορίες που Αλλάζουν",short:"Οι επιλογές του παιδιού αλλάζουν την πλοκή",skill:"Αφήγηση • ενσυναίσθηση • συνέπειες",benchmark:"interactive story + social emotional",variants:[
  {id:"dolphin-help",ages:ALL,title:"Το δελφίνι στο λιμάνι",prompt:"Ο Πισιπούκ συναντά ένα δελφίνι που φαίνεται χαμένο.",parentPrompt:"Ρώτησε: πώς καταλάβαμε ότι χρειάζεται βοήθεια;",theme:"Καλοσύνη",difficulty:1,interaction:"story",mode:"coop",data:{story:"dolphin"}},
  {id:"storm-story",ages:OLDER,title:"Το σύννεφο και η καταιγίδα",prompt:"Ένα μικρό σύννεφο φοβάται τον δυνατό ήχο.",parentPrompt:"Μιλήστε για κάτι που βοηθά όταν φοβόμαστε.",theme:"Συναισθήματα",difficulty:2,interaction:"story",mode:"coop",data:{story:"storm"}},
  {id:"lost-map",ages:OLDER,title:"Ο χάρτης της παλιάς ελιάς",prompt:"Ένας χάρτης οδηγεί σε τρία διαφορετικά μονοπάτια.",parentPrompt:"Ζήτησε από το παιδί να εξηγήσει γιατί διαλέγει δρόμο.",theme:"Περιπέτεια",difficulty:3,interaction:"story",mode:"guided",data:{story:"map"}},
 ]},
 {id:"memory",icon:"🧠",title:"Μνήμη με Ιστορία",short:"Θυμάμαι εικόνες μέσα σε νόημα",skill:"Εργαζόμενη μνήμη • προσοχή",benchmark:"memory play with narrative context",variants:[
  {id:"market-memory",ages:YOUNG,title:"Τι πήραμε από την αγορά;",prompt:"Θυμήσου τα 3 πράγματα που βάλαμε στο καλάθι.",parentPrompt:"Παίξτε μετά με 3 αληθινά αντικείμενα.",theme:"Καθημερινή ζωή",difficulty:1,interaction:"memory",mode:"coop",data:{items:["🍎","🥖","🧀"]}},
  {id:"sea-memory",ages:ALL,title:"Ποιο ζωάκι κρύφτηκε;",prompt:"Κοίτα προσεκτικά τα ζωάκια της θάλασσας.",parentPrompt:"Ζήτησε να περιγράψει ένα ζώο χωρίς να το ονομάσει.",theme:"Θάλασσα",difficulty:2,interaction:"memory",mode:"guided",data:{items:["🐠","🐙","🐬","🐢"]}},
  {id:"camp-memory",ages:OLDER,title:"Το σακίδιο του εξερευνητή",prompt:"Θυμήσου τι χρειαζόμαστε για μια ασφαλή εξόρμηση.",parentPrompt:"Φτιάξτε μαζί μια πραγματική λίστα.",theme:"Εξερεύνηση",difficulty:3,interaction:"memory",mode:"coop",data:{items:["💧","🧢","🗺️","🍎","🔦"]}},
 ]},
 {id:"movement",icon:"🤸",title:"Κουνιέμαι με τον Πισιπούκ",short:"Η οθόνη γίνεται αφορμή για κίνηση",skill:"Αδρή κίνηση • μίμηση • αυτορρύθμιση",benchmark:"screen-to-movement",variants:[
  {id:"animal-moves",ages:ALL,title:"Περπάτημα ζώων",prompt:"Κάνε 4 βήματα σαν αρκούδα και 4 σαν καβούρι.",parentPrompt:"Κάντε το μαζί και γελάστε — όχι τέλεια εκτέλεση.",theme:"Ζώα",difficulty:1,interaction:"movement",mode:"coop",data:{moves:["🐻 4 βήματα","🦀 4 βήματα","🐸 3 πηδήματα"]}},
  {id:"island-dance",ages:ALL,title:"Χορός στο νησί",prompt:"Κινήσου όταν παίζει ο ρυθμός και πάγωσε όταν σταματά.",parentPrompt:"Ο γονιός ελέγχει start/stop εναλλάξ με το παιδί.",theme:"Χορός",difficulty:2,interaction:"movement",mode:"coop",data:{moves:["💃 χορός","🧊 πάγωμα","🌀 στροφή"]}},
  {id:"calm-wave",ages:ALL,title:"Ανάσα σαν κύμα",prompt:"Σήκωσε τα χέρια αργά στην εισπνοή και κατέβασέ τα στην εκπνοή.",parentPrompt:"Κάντε 3 αργές αναπνοές μαζί.",theme:"Ηρεμία",difficulty:1,interaction:"movement",mode:"coop",data:{moves:["🌊 μέσα","🌊 έξω","⭐ χαλάρωση"]}},
 ]},
 {id:"coop-quest",icon:"🤝",title:"Αποστολές Μαζί",short:"Παιδί και γονιός σαν ομάδα",skill:"Συνεργασία • γλώσσα • σύνδεση",benchmark:"co-play prompts + off-screen continuation",variants:[
  {id:"tower-team",ages:ALL,title:"Ο πύργος των έξι",prompt:"Χτίστε μαζί έναν πύργο από 6 ασφαλή αντικείμενα.",parentPrompt:"Άφησε το παιδί να αποφασίζει εναλλάξ το επόμενο κομμάτι.",theme:"Κατασκευή",difficulty:1,interaction:"build",mode:"coop",data:{goal:6}},
  {id:"story-team",ages:OLDER,title:"Μία πρόταση ο καθένας",prompt:"Φτιάξτε ιστορία εναλλάξ. Ο Πισιπούκ ξεκινά: “Μια νύχτα βρήκα ένα χρυσό κλειδί…”",parentPrompt:"Μην διορθώνεις την ιστορία — πρόσθεσε πάνω στην ιδέα του παιδιού.",theme:"Ιστορία",difficulty:2,interaction:"story",mode:"coop",data:{starter:"Μια νύχτα βρήκα ένα χρυσό κλειδί…"}},
  {id:"sound-team",ages:ALL,title:"Μάντεψε τον ήχο",prompt:"Ο ένας κάνει έναν ασφαλή ήχο χωρίς να δείχνει το αντικείμενο. Ο άλλος μαντεύει.",parentPrompt:"Αλλάξτε ρόλους κάθε φορά.",theme:"Ήχοι",difficulty:2,interaction:"rhythm",mode:"coop",data:{rounds:4}},
 ]},
];

export const CREATIVE_CHALLENGES=[
 {id:"sunset",icon:"🌅",title:"Ζωγράφισε το δικό σου ηλιοβασίλεμα",prompt:"Διάλεξε 3 χρώματα και φτιάξε ουρανό, θάλασσα και κάτι που ταξιδεύει."},
 {id:"monster",icon:"👾",title:"Φιλικό τερατάκι",prompt:"Σχεδίασε ένα αστείο πλάσμα με 3 μάτια και 2 διαφορετικά παπούτσια."},
 {id:"island",icon:"🏝️",title:"Το μυστικό νησί",prompt:"Φτιάξε χάρτη ενός νησιού και βάλε πάνω 4 μέρη που θα ήθελες να εξερευνήσεις."},
 {id:"feelings",icon:"🙂",title:"Πρόσωπα που μιλούν χωρίς λέξεις",prompt:"Ζωγράφισε 4 πρόσωπα: χαρά, έκπληξη, θυμό και ηρεμία."},
 {id:"space",icon:"🚀",title:"Το όχημα του μέλλοντος",prompt:"Σχεδίασε ένα όχημα που μπορεί να ταξιδεύει και στη θάλασσα και στον ουρανό."},
 {id:"music",icon:"🎵",title:"Ζωγραφίζω έναν ήχο",prompt:"Άκου έναν ήχο και ζωγράφισε τι σχήμα ή χρώμα σου θυμίζει."},
];

export const CRAFT_CHALLENGES=[
 {id:"windmill",icon:"🌬️",title:"Κυκλαδίτικος ανεμόμυλος",mins:20,materials:["χαρτόνι Α4","διπλόκαρφο","μαρκαδόροι"],parent:"Ο ενήλικας βοηθά μόνο στο τρύπημα/κόψιμο."},
 {id:"story-puppets",icon:"🎭",title:"Κούκλες για ιστορίες",mins:18,materials:["χαρτί","ξυλάκια χειροτεχνίας","κόλλα"],parent:"Μετά παίξτε μια μικρή παράσταση μαζί."},
 {id:"shadow-theatre",icon:"🌙",title:"Θέατρο σκιών",mins:22,materials:["χαρτόνι","φακός","λευκό σεντόνι"],parent:"Ο γονιός χειρίζεται το φως, το παιδί τους ήρωες."},
 {id:"nature-crown",icon:"🍂",title:"Στέμμα της φύσης",mins:15,materials:["χαρτόνι","πεσμένα φύλλα","κόλλα"],parent:"Μαζεύουμε μόνο πεσμένα φυσικά υλικά."},
 {id:"shape-town",icon:"🏘️",title:"Πόλη από σχήματα",mins:20,materials:["χρωματιστά χαρτιά","κόλλα","μαρκαδόροι"],parent:"Ρώτησε ποιο σχήμα χρησιμοποίησε για κάθε κτίριο."},
 {id:"boat-mobile",icon:"⛵",title:"Μόμπιλο Αιγαίου",mins:25,materials:["χαρτόνι","κλωστή","μπλε χαρτί"],parent:"Ο ενήλικας αναλαμβάνει το κρέμασμα."},
];

export const STORY_SEEDS=[
 {id:"star-key",title:"Ο Πισιπούκ και το κλειδί του αστεριού",theme:"Περιέργεια",opening:"Ένα χρυσό κλειδί έπεσε από τον ουρανό και μόνο ο Πισιπούκ άκουσε το μικρό του κουδούνισμα."},
 {id:"quiet-cloud",title:"Το σύννεφο που ήθελε ησυχία",theme:"Αυτορρύθμιση",opening:"Ένα μικρό σύννεφο ταξίδευε πάνω από το Αιγαίο, αλλά κάθε δυνατός ήχος το έκανε να τρέμει."},
 {id:"olive-secret",title:"Το μυστικό της παλιάς ελιάς",theme:"Φύση",opening:"Στον κορμό μιας πολύ παλιάς ελιάς υπήρχε ένα σημάδι που έμοιαζε με χάρτη."},
 {id:"colors-bridge",title:"Η γέφυρα των χρωμάτων",theme:"Συνεργασία",opening:"Τα χρώματα ήθελαν να περάσουν απέναντι, όμως η γέφυρα εμφανιζόταν μόνο όταν συνεργάζονταν."},
];
