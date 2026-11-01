/** Original Pisipouk November 2026 pack. No child identifiers, remote telemetry or commercial assets. */
export type PackAge = "2–3" | "4–5" | "5–6";
export type PackKind = "game3d" | "craft" | "coloring" | "story" | "mission" | "music" | "stem" | "social" | "quest";
export type PackActivity = {
  id: string; kind: PackKind; age: PackAge; titleEL: string; titleEN: string;
  promptEL: string; promptEN: string; domain: string; difficulty: 1 | 2 | 3;
  parentEL: string; variants: number; theme: string;
};
export const NOVEMBER_PACK = {
  id: "2026-11", version: 1, titleEL: "Νοέμβριος: Το Νησί της Βροχής",
  titleEN: "November: The Rain Island", published: "2026-11-01",
  license: "Original Pisipouk-owned procedural art and story; no external 3D assets",
  localOnly: true, ages: ["2–3", "4–5", "5–6"] as PackAge[],
};
const A = (id:string,kind:PackKind,age:PackAge,titleEL:string,titleEN:string,promptEL:string,promptEN:string,domain:string,difficulty:1|2|3,parentEL:string,variants=12):PackActivity =>
 ({id:"nov26-"+id,kind,age,titleEL,titleEN,promptEL,promptEN,domain,difficulty,parentEL,variants,theme:"november-rain-aegean"});
export const NOVEMBER_ACTIVITIES: PackActivity[] = [
  A("23-rain","game3d","2–3","Οι σταγόνες χορεύουν","Dancing raindrops","Άγγιξε τις μεγάλες σταγόνες. Κάθε μία κάνει έναν ήχο.","Tap big raindrops to hear their sounds.","αιτία/αποτέλεσμα • ήχος",1,"Χτυπήστε απαλά το τραπέζι σαν βροχή.",24),
  A("23-leaves","game3d","2–3","Φύλλα στο καλαθάκι","Leaves in the basket","Άγγιξε τα φύλλα που ταιριάζουν με το χρώμα του καλαθιού.","Find leaves matching the basket color.","χρώματα • λεπτή κίνηση",1,"Βρείτε δύο αληθινά πεσμένα φύλλα.",18),
  A("23-cloud","game3d","2–3","Πού κρύφτηκε το συννεφάκι;","Where is the cloud?","Βρες το συννεφάκι πίσω από τα μεγάλα σπιτάκια.","Find the cloud behind the big houses.","παρατήρηση • χωρικός λόγος",1,"Παίξτε κρυφτό με ένα μαξιλάρι.",20),
  A("45-bridge","game3d","4–5","Η γέφυρα του ρυακιού","Bridge over the brook","Βάλε τρία κομμάτια στη σειρά για να περάσει ο Πισιπούκ.","Place three bridge pieces in order.","κατασκευή • χωρική σκέψη",2,"Χτίστε γέφυρα με χάρτινα κουτιά.",18),
  A("45-habitats","game3d","4–5","Φίλοι του δάσους","Forest friends","Βοήθησε τα ζωάκια να βρουν το σωστό σπιτάκι.","Help the animals find their homes.","φύση • ταξινόμηση",2,"Ποιο ζώο θα βλέπατε στο πάρκο;",18),
  A("45-kites","game3d","4–5","Χαρταετοί στον άνεμο","Kites in the wind","Διάλεξε πού φυσά ο άνεμος και οδήγησε τον χαρταετό.","Choose wind direction to guide a kite.","κατεύθυνση • πρόβλεψη",2,"Δοκιμάστε να φυσήξετε μια χάρτινη κορδέλα.",24),
  A("56-water","game3d","5–6","Τα κανάλια της βροχής","Rainwater channels","Πρόβλεψε ποιο κανάλι οδηγεί το νερό στον κήπο.","Predict which channel brings water to the garden.","STEM • αιτιολόγηση",3,"Δοκιμάστε με νερό σε ασφαλή δίσκο και με επίβλεψη.",24),
  A("56-route","game3d","5–6","Ο χάρτης με τα φανάρια","Lantern route","Βρες τη σωστή διαδρομή με τρεις επιλογές.","Plan a route in three steps.","λογική • ακολουθία",3,"Σχεδιάστε έναν μικρό χάρτη του σπιτιού.",24),
  A("23-craft","craft","2–3","Ομπρέλα με μεγάλα σχήματα","Big-shape umbrella","Χρωμάτισε την ομπρέλα και κόλλησε μεγάλες χάρτινες σταγόνες.","Color and decorate an umbrella.","λεπτή κίνηση • χρώμα",1,"Ο ενήλικος κόβει τα σχήματα.",8),
  A("45-craft-tree","craft","4–5","Δέντρο που αλλάζει","Changing tree","Δίπλωσε το δέντρο και πρόσθεσε φύλλα.","Fold a tree and add leaves.","φύση • κατασκευή",2,"Συγκρίνετε ένα αληθινό δέντρο.",8),
  A("45-craft-boat","craft","4–5","Το καραβάκι της βροχής","Rain boat","Δίπλωσε το καραβάκι και φτιάξε χάρτινα κύματα.","Fold a boat and make paper waves.","χωρική σκέψη • συνεργασία",2,"Δοκιμάστε το μόνο σε ρηχό δίσκο με επίβλεψη.",8),
  A("56-craft","craft","5–6","Μετεωρολογικός τροχός","Weather wheel","Φτιάξε έναν τροχό για να παρατηρείς τον καιρό.","Make a wheel to observe weather.","επιστήμη • καταγραφή",3,"Καταγράψτε μαζί τον καιρό τρεις ημέρες.",8),
  A("23-color-a","coloring","2–3","Μεγάλη ομπρέλα","Big umbrella","Βάψε τις μεγάλες περιοχές με ένα άγγιγμα.","Tap to color large shapes.","χρώμα • αισθητηριακό",1,"Διάλεξε μαζί δύο χρώματα.",16),
  A("23-color-b","coloring","2–3","Το αρκουδάκι με το αδιάβροχο","Bear in a raincoat","Δώσε χρώμα στο αδιάβροχο του Πισιπούκ.","Color Pisipouk's raincoat.","δημιουργία • λεξιλόγιο",1,"Πες τι φοράμε όταν βρέχει.",16),
  A("45-color-a","coloring","4–5","Ο κήπος μετά τη βροχή","Garden after rain","Χρωμάτισε λουλούδια και φύλλα όπως θέλεις.","Color the garden freely.","δημιουργία • φύση",2,"Βρείτε παρόμοια χρώματα έξω.",20),
  A("45-color-b","coloring","4–5","Το μικρό καραβάκι","Little boat","Διάλεξε χρώματα για θάλασσα και ουρανό.","Color sea and sky.","φαντασία • παρατήρηση",2,"Μιλήστε για κύματα και σύννεφα.",20),
  A("56-color-a","coloring","5–6","Ο χάρτης του νησιού","Island map","Ζωγράφισε τη διαδρομή σου ανάμεσα στα μέρη.","Color and trace a route.","χάρτης • δημιουργία",3,"Φτιάξτε δικό σας υπόμνημα χάρτη.",24),
  A("56-color-b","coloring","5–6","Το εργαστήριο του καιρού","Weather laboratory","Δώσε χρώμα στα όργανα και πρόσθεσε δικά σου σύμβολα.","Color weather tools.","STEM • εικαστικά",3,"Ποιο εργαλείο θα επινοούσες;",24),
  A("23-story","story","2–3","Πισιπούκ και η πρώτη σταγόνα","Pisipouk and the first drop","Μια σταγόνα βρίσκει φίλους στον κήπο.","A raindrop finds friends in the garden.","γλώσσα • συναίσθημα",1,"Κάντε μαζί ήχους βροχής.",8),
  A("56-story","story","5–6","Ο φάρος που άκουγε τον άνεμο","The lighthouse that heard the wind","Ο Πισιπούκ λύνει ένα μικρό μυστήριο με τη βοήθεια φίλων.","Pisipouk solves a mystery with friends.","αφήγηση • ακολουθία",3,"Πείτε ένα εναλλακτικό τέλος.",12),
  A("23-mission-a","mission","2–3","Βρες κάτι απαλό","Find something soft","Με έναν μεγάλο βρες κάτι απαλό και κάτι τραχύ.","Find soft and rough objects.","αισθήσεις • κίνηση",1,"Δώσε μόνο ασφαλή μεγάλα αντικείμενα.",12),
  A("23-mission-b","mission","2–3","Περπατώ σαν σταγόνα","Move like a raindrop","Περπάτησε αργά και γρήγορα, όπως η βροχή.","Move slowly and quickly.","κίνηση • μίμηση",1,"Παίξτε μαζί σε ασφαλές πάτωμα.",12),
  A("45-mission-a","mission","4–5","Κυνήγι πεσμένων φύλλων","Fallen-leaf hunt","Βρες τρία διαφορετικά πεσμένα φύλλα.","Find three fallen leaves.","φύση • ταξινόμηση",2,"Μην κόβετε φύλλα από φυτά.",12),
  A("45-mission-b","mission","4–5","Γέφυρα με μαξιλάρια","Cushion bridge","Φτιάξε μια διαδρομή με μαξιλάρια στο πάτωμα.","Build a safe floor path.","ισορροπία • συνεργασία",2,"Ο ενήλικος ελέγχει τη σταθερότητα.",12),
  A("56-mission-a","mission","5–6","Ημερολόγιο ουρανού","Sky journal","Ζωγράφισε τον ουρανό σήμερα και αύριο.","Draw the sky today and tomorrow.","παρατήρηση • χρόνος",3,"Συγκρίνετε τις δύο ζωγραφιές.",12),
  A("56-mission-b","mission","5–6","Χάρτης της βόλτας","Walk map","Σχεδίασε μια ασφαλή διαδρομή από τη βόλτα.","Draw a route from a walk.","χάρτης • μνήμη",3,"Ο ενήλικος επιλέγει τη διαδρομή.",12),
  A("23-music","music","2–3","Ψιχάλες και παλαμάκια","Rain and claps","Κάνε έναν ήχο σαν ψιχάλα και έναν σαν δυνατή βροχή.","Make gentle and loud rain sounds.","μουσική • ρυθμός",1,"Αντιγράψτε ο ένας τον άλλον.",16),
  A("45-music","music","4–5","Η ορχήστρα του ανέμου","Wind orchestra","Φτιάξε ρυθμό με παλαμάκια και παύσεις.","Make a rhythm with claps and pauses.","ρυθμός • συνεργασία",2,"Παίξτε εναλλάξ τον μαέστρο.",16),
  A("45-stem","stem","4–5","Πού ταξιδεύει ο αέρας;","Where does air go?","Πρόβλεψε τι θα κουνηθεί όταν φυσήξεις.","Predict what will move when you blow.","φυσική • πρόβλεψη",2,"Χρησιμοποιήστε μόνο μεγάλο ελαφρύ χαρτί.",12),
  A("56-stem","stem","5–6","Ποια γέφυρα αντέχει;","Which bridge is stronger?","Δοκίμασε δύο χάρτινες γέφυρες και παρατήρησε.","Compare two paper bridges.","μηχανική • πείραμα",3,"Μόνο μεγάλα ελαφριά αντικείμενα.",12),
  A("23-social","social","2–3","Μοιραζόμαστε την ομπρέλα","Sharing an umbrella","Διάλεξε πώς θα βοηθήσεις έναν φίλο στη βροχή.","Choose how to help a friend.","συναίσθημα • φροντίδα",1,"Παίξτε ρόλους χωρίς σωστή/λάθος απάντηση.",12),
  A("56-social","social","5–6","Μια ομάδα στον φάρο","A team at the lighthouse","Συζήτησε πώς συνεργάζονται οι φίλοι όταν διαφωνούν.","Talk about working together.","συνεργασία • ενσυναίσθηση",3,"Πείτε δύο δίκαιες λύσεις.",12),
  A("45-quest","quest","4–5","Αποστολή: ζωντανεύει ο κήπος","Quest: wake the garden","Βρες φύλλο, σύννεφο και λουλούδι στο νησί.","Find a leaf, cloud and flower.","εξερεύνηση • φύση",2,"Συνεχίστε με έναν αληθινό κήπο.",24),
  A("56-quest","quest","5–6","Αποστολή: φως στον φάρο","Quest: light the lighthouse","Συνδύασε χάρτη, αριθμούς και παρατήρηση.","Use map, numbers and observation.","λογική • STEM • γλώσσα",3,"Ζωγραφίστε τη δική σας αποστολή.",24),
];
export const NOVEMBER_STORIES:Record<string,string[]> = {
 "nov26-23-story":[
  "Ο Πισιπούκ, το αρκουδάκι, άκουσε: πλιτ! Μια μικρή σταγόνα έπεσε στο φύλλο.",
  "«Καλώς ήρθες!» είπε το λουλούδι. «Διψούσα λίγο σήμερα». Η σταγόνα κύλησε απαλά.",
  "Ο Πισιπούκ άνοιξε την ομπρέλα του. «Έλα να ακούσουμε τη βροχή μαζί», είπε.",
  "Και οι φίλοι άκουσαν τις σταγόνες, άλλες σιγανές κι άλλες δυνατές. Κανείς δεν βιαζόταν."
 ],
 "nov26-56-story":[
  "Ο φάρος στο νησί δεν άναψε. Ο Πισιπούκ είδε τρία χάρτινα βελάκια να τα γυρίζει ο άνεμος.",
  "Η φίλη του, η χελώνα, είπε: «Ας παρατηρήσουμε πρώτα από πού φυσά». Σημείωσαν τη φορά στον χάρτη.",
  "Ο Πισιπούκ διάλεξε το ασφαλές μονοπάτι και βρήκε το κουμπί πίσω από ένα μεγάλο παράθυρο.",
  "Το φως άναψε. «Το καταφέραμε μαζί, γιατί ακούσαμε όλες τις ιδέες», είπε ο Πισιπούκ."
 ]
};
export const NOVEMBER_CRAFT_STEPS:Record<string,{materials:string;steps:string[]}> = {
 "nov26-23-craft":{materials:"Α4, κηρομπογιές, χαρτί, κόλλα",steps:["Χρωμάτισε την μεγάλη ομπρέλα.","Ο ενήλικος κόβει τα μεγάλα σχήματα.","Κόλλησε σταγόνες κάτω από την ομπρέλα."]},
 "nov26-45-craft-tree":{materials:"Α4, κηρομπογιές, ασφαλής κόλλα",steps:["Χρωμάτισε κορμό και κλαδιά.","Δίπλωσε κατά μήκος της διακεκομμένης γραμμής.","Κόλλησε χάρτινα φύλλα με έναν ενήλικο."]},
 "nov26-45-craft-boat":{materials:"Α4, κηρομπογιές, χαρτόνι",steps:["Χρωμάτισε το καραβάκι.","Δίπλωσε στη διακεκομμένη γραμμή.","Τοποθέτησε χάρτινα κύματα γύρω του."]},
 "nov26-56-craft":{materials:"Α4, χρώματα, χοντρό χαρτί, χάρτινο διπλόκαρφο μόνο με ενήλικο",steps:["Χρωμάτισε τα τέσσερα σύμβολα καιρού.","Ο ενήλικος κόβει τους δύο κύκλους.","Σύνδεσε τους κύκλους με βοήθεια ενηλίκου και γύρισέ τους."]}
};
