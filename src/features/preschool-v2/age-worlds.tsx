import { Link, Outlet } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, Gamepad2, Home, Palette, Scissors, Sparkles } from "lucide-react";
import { StageAgeGame } from "./age-games";
import { PatternLibrary, CraftLibrary, StoryLibrary } from "./library/LibraryViews";
import "./age-worlds.css";

export const AGE_CODES=["2-3","3-4","4-5","5-6"] as const;
export const AGE_NAMES=["Μικροί εξερευνητές","Χρωματιστές ανακαλύψεις","Μικροί δημιουργοί","Μεγάλοι εφευρέτες"];
export const AGE_GAME_NAMES=["Μαγικές σαπουνόφουσκες","Ανακατεύω χρώματα","Η γέφυρα πάνω από το ποτάμι","Προγραμμάτισε τον φίλο"];
const AGE_SYMBOLS=["🫧","🎨","🌉","🤖"];
const BASE="/pisipouk-v2-staging/ages/";
export const ageIndex=(value:string)=>AGE_CODES.indexOf(value as typeof AGE_CODES[number]);
const GAME_CATALOG=[
 ["Μαγικές σαπουνόφουσκες","Τάισε τον Πισιπούκ","Ποιο ζωάκι μιλά;","Μπαλάκια στα καλαθάκια","Κούκου! Πού κρύφτηκε;","Ανθίζει το λουλούδι","Η ομπρέλα της βροχής","Μικρός ή μεγάλος;","Ντύσε το αρκουδάκι","Πού είναι η σκιά μου;","Ψαράκια στο λιμνάκι","Τρία μουσικά όργανα","Τα παπούτσια μου","Το πεινασμένο κουνελάκι","Ήλιος και φεγγάρι","Το τρενάκι κινείται","Το κουτί της έκπληξης","Μάζεψε τα φύλλα","Γέμισε το ποτηράκι","Πρόσωπα και χαμόγελα"],
 ["Ανακατεύω χρώματα","Χτίζω φωλιά","Η λαϊκή του Πισιπούκ","Ποιος άφησε πατημασιές;","Παζλ του δάσους","Το σπίτι των ζώων","Άκουσε τον ρυθμό","Μεγαλώνει ένα σποράκι","Το πιάτο των γεύσεων","Βρίσκω τα καλτσάκια","Φτιάχνω ένα ρομπότ","Πώς νιώθει ο φίλος;","Χορεύει η μουσική","Το τρένο των σχημάτων","Πόσα μήλα;","Οι κάδοι ανακύκλωσης","Η πεταλούδα βρίσκει λουλούδι","Ταξινομώ φύλλα","Τρεις εικόνες, μία ιστορία","Το μονοπάτι της φάρμας"],
 ["Η γέφυρα πάνω από το ποτάμι","Ο φούρνος του χωριού","Συγκομιδή 1–10","Ο κηπουρός των εποχών","Το πρώτο μου γράμμα","Μνήμη με φίλους","Οδηγίες στο ρομποτάκι","Οι περιστρεφόμενες σκιές","Το καλάθι υγιεινού σνακ","Ποιος βοηθά στο χωριό;","Η ορχήστρα των τεσσάρων","Το παραμύθι με τις 4 εικόνες","Το ταξίδι μιας σταγόνας","Τα αστέρια στον ουρανό","Δύο δρόμοι, μία λύση","Ντετέκτιβ της φύσης","Ζυγίζω στο μαγαζί","Η ημέρα μου","Τι θα έκανες εσύ;","Ταξίδι στην Ελλάδα"],
 ["Προγραμμάτισε τον φίλο","Εργαστήρι ήχων και συλλαβών","Ο χάρτης της περιπέτειας","Ο μηχανικός της γέφυρας","Το μαγαζί με τα νομίσματα","Μοτίβα στον κήπο","Η μυστική συνταγή","Το εργαστήρι συμμετρίας","Μικρός συνθέτης","Γράφω το παραμύθι μου","Ημερολόγιο του Πισιπούκ","Εφευρέτης μηχανισμών","Η πράσινη πόλη","Τι ώρα είναι;","Ασφαλής βόλτα","Ο κύκλος της πεταλούδας","Εργαστήριο σκιών","Χτίζω το δικό μου σπίτι","Μικρό μουσείο Ελλάδας","Φροντίζω έναν βιότοπο"]
];
export function AgeLanding(){
 return <div className="pw2-landing">
  <div className="pw2-landing-bear"><span className="pw2-landing-spark">✨</span><img src="/preschool-world/bear.webp" alt="Ο Πισιπούκ" /><span className="pw2-landing-message">Γεια σου φίλε μου!</span></div>
  <div className="pw2-landing-content"><div className="pw2-overline">ΠΙΣΙΠΟΥΚ · ΜΑΓΙΚΟΣ ΚΟΣΜΟΣ</div><h1>Κάθε ηλικία και μία <em>ξεχωριστή περιπέτεια!</em></h1><p>Πόσων χρονών είσαι; Διάλεξε την περιπέτειά σου.</p>
  <div className="pw2-age-grid">{AGE_CODES.map((key,index)=><Link to={BASE+key} key={key} className={"pw2-age-tile pw2-age-tile-"+index}><span>{AGE_SYMBOLS[index]}</span><strong>{key.replace("-","–")}</strong><small>ετών</small><b>{AGE_NAMES[index]}</b><ArrowRight/></Link>)}</div>
  <p className="pw2-disclaimer">STAGING: προς το παρόν 1 πραγματικά παιζόμενο παιχνίδι ανά ηλικία και δοκιμαστικά πρωτότυπα πατρόν. Τα υπόλοιπα βρίσκονται σε παραγωγή.</p></div></div>
}
export function AgeShell({ageKey}:{ageKey:string}){
 const a=ageIndex(ageKey);
 if(a===-1)return <Link to="/pisipouk-v2-staging/">Επιστροφή</Link>;
 return <div className={"pw2-app pw2-age-mode-"+a}>
  <div className="pw2-age-bar"><Link to="/pisipouk-v2-staging/"><ArrowLeft size={19}/> Αλλαγή ηλικίας</Link><strong>{AGE_SYMBOLS[a]} {AGE_NAMES[a]} · {ageKey.replace("-","–")} ετών</strong></div>
  <nav className="pw2-category-nav" aria-label="Ο χώρος της ηλικίας μου">
   <Link to={BASE+ageKey} activeProps={{className:"is-active"}}><Home/> Ο κόσμος μου</Link>
   <Link to={BASE+ageKey+"/game"} activeProps={{className:"is-active"}}><Gamepad2/> Παιχνίδι</Link>
   <Link to={BASE+ageKey+"/patterns"} activeProps={{className:"is-active"}}><Palette/> Ζωγραφιές A4</Link>
   <Link to={BASE+ageKey+"/crafts"} activeProps={{className:"is-active"}}><Scissors/> Κατασκευές</Link>
   <Link to={BASE+ageKey+"/stories"} activeProps={{className:"is-active"}}><BookOpen/> Ιστορίες</Link>
  </nav>
  <Outlet/>
 </div>
}
export function AgeWorldHome({ageKey}:{ageKey:string}){
 const a=ageIndex(ageKey);if(a<0)return null;
 const url=BASE+ageKey;
 return <div className="pw2-home">
  <div className="pw2-world-hero"><div><span className="pw2-overline">Ο ΔΙΚΟΣ ΜΟΥ ΚΟΣΜΟΣ · {ageKey.replace("-","–")} ΕΤΩΝ</span><h1>{AGE_NAMES[a]}</h1><p>Μαθαίνουμε μέσα από το παιχνίδι, την τέχνη και την περιέργεια!</p><Link className="pw2-main-button" to={url+"/game"}>Έλα να παίξουμε! <ArrowRight/></Link></div><div className="pw2-world-hero-art"><span>{AGE_SYMBOLS[a]}</span><img src="/preschool-world/bear.webp" alt="Ο Πισιπούκ σε περιμένει"/></div></div>
  <div className="pw2-physics-banner"><div><span className="pw2-overline">ΝΕΟΣ ΜΗΧΑΝΙΣΜΟΣ ΠΑΙΧΝΙΔΙΩΝ</span><strong>Ο κήπος της βαρύτητας</strong><p>Δοκίμασε πραγματική φυσική κίνησης με Phaser + Matter.js.</p></div><Link to={url+"/physics"} className="pw2-main-button">Παίζω με τη φυσική <ArrowRight size={18}/></Link></div><div className="pw2-portal-grid"><Link to={url+"/game"}><span>🎮</span><strong>Παίζω</strong><small>Πραγματικό παιχνίδι</small></Link><Link to={url+"/patterns"}><span>🖍️</span><strong>Ζωγραφίζω</strong><small>Πατρόν για εκτύπωση</small></Link><Link to={url+"/crafts"}><span>✂️</span><strong>Κατασκευάζω</strong><small>4 βήματα & υλικά</small></Link><Link to={url+"/stories"}><span>📚</span><strong>Ακούω ιστορίες</strong><small>Σελίδες με αφήγηση</small></Link></div>
  <section className="pw2-planned-games"><div className="pw2-planned-intro"><h2>20 παιχνίδια για αυτή την ηλικία</h2><p>Η πρώτη δραστηριότητα λειτουργεί στο preview. Τα υπόλοιπα καταγράφονται ως εκκρεμή, χωρίς ψεύτικα κουμπιά.</p></div><div className="pw2-game-catalog">{GAME_CATALOG[a].map((title,i)=>i===0?<Link key={i} className="pw2-game-live" to={url+"/game"}><small>{String(i+1).padStart(2,"0")}</small><strong>{title}</strong><b>Παίζω τώρα <ArrowRight size={16}/></b></Link>:<div key={i} className="pw2-game-planned"><small>{String(i+1).padStart(2,"0")}</small><strong>{title}</strong><em>Σχεδιάζεται</em></div>)}</div></section>
 </div>
}
export function AgeGameRoute({ageKey}:{ageKey:string}){return <StageAgeGame age={ageIndex(ageKey)} ageKey={ageKey}/>}
export function AgePatternsRoute({ageKey}:{ageKey:string}){return <PatternLibrary age={ageIndex(ageKey)} ageKey={ageKey}/>}
export function AgeCraftsRoute({ageKey}:{ageKey:string}){return <CraftLibrary age={ageIndex(ageKey)} ageKey={ageKey}/>}
export function AgeStoriesRoute({ageKey}:{ageKey:string}){return <StoryLibrary age={ageIndex(ageKey)} ageKey={ageKey}/>}
