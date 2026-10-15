import { Link, Outlet } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, Gamepad2, Home, Palette, Scissors, Sparkles } from "lucide-react";
import { StageAgeGame } from "./age-games";
import {monthlyPack} from "./games/curriculum";
import {GameCatalog} from "./games/GameCatalog";
import { PatternLibrary, CraftLibrary, StoryLibrary } from "./library/LibraryViews";
import "./age-worlds.css";
import "./physics/physics-garden.css";

export const AGE_CODES=["2-3","3-4","4-5","5-6"] as const;
export const AGE_NAMES=["Μικροί εξερευνητές","Χρωματιστές ανακαλύψεις","Μικροί δημιουργοί","Μεγάλοι εφευρέτες"];
export const AGE_GAME_NAMES=["Μαγικές σαπουνόφουσκες","Ανακατεύω χρώματα","Η γέφυρα πάνω από το ποτάμι","Προγραμμάτισε τον φίλο"];
const AGE_SYMBOLS=["🫧","🎨","🌉","🤖"];
const BASE="/pisipouk-v2-staging/ages/";
export const ageIndex=(value:string)=>AGE_CODES.indexOf(value as typeof AGE_CODES[number]);
export function AgeLanding(){
 return <div className="pw2-landing">
  <div className="pw2-landing-bear"><span className="pw2-landing-spark">✨</span><img src="/preschool-world/bear.webp" alt="Ο Πισιπούκ" /><span className="pw2-landing-message">Γεια σου φίλε μου!</span></div>
  <div className="pw2-landing-content"><div className="pw2-overline">ΠΙΣΙΠΟΥΚ · ΜΑΓΙΚΟΣ ΚΟΣΜΟΣ</div><h1>Κάθε ηλικία και μία <em>ξεχωριστή περιπέτεια!</em></h1><p>Πόσων χρονών είσαι; Διάλεξε την περιπέτειά σου.</p>
  <div className="pw2-age-grid">{AGE_CODES.map((key,index)=><Link to={BASE+key} key={key} className={"pw2-age-tile pw2-age-tile-"+index}><span>{AGE_SYMBOLS[index]}</span><strong>{key.replace("-","–")}</strong><small>ετών</small><b>{AGE_NAMES[index]}</b><ArrowRight/></Link>)}</div>
  <p className="pw2-disclaimer">STAGING: 20 διαδραστικά παιχνίδια ανά ηλικία, με κοινά τεχνικά engines και 80 διαφορετικούς μαθησιακούς στόχους. Τα εικαστικά και ο παιδαγωγικός έλεγχος είναι ακόμη υπό ανάπτυξη.</p></div></div>
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
 const url=BASE+ageKey,pack=monthlyPack();
 return <div className="pw2-home">
  <div className="pw2-world-hero"><div><span className="pw2-overline">Ο ΔΙΚΟΣ ΜΟΥ ΚΟΣΜΟΣ · {ageKey.replace("-","–")} ΕΤΩΝ</span><h1>{AGE_NAMES[a]}</h1><p>Μαθαίνουμε μέσα από το παιχνίδι, την τέχνη, τα συναισθήματα και την περιέργεια!</p><Link className="pw2-main-button" to={url+"/game"}>Έλα να παίξουμε! <ArrowRight/></Link></div><div className="pw2-world-hero-art"><span>{AGE_SYMBOLS[a]}</span><img src="/preschool-world/bear.webp" alt="Ο Πισιπούκ σε περιμένει"/></div></div>
  <div className="pw2-monthly-banner" style={{background:pack.color}}><span>{pack.icon} <strong>{pack.name} {pack.key.split("-")[0]}</strong> · {pack.theme}</span><small>Μηνιαία θεματολογία για όλες τις δραστηριότητες. Η προηγούμενη βιβλιοθήκη διατηρείται.</small></div><div className="pw2-physics-banner"><div><span className="pw2-overline">ΝΕΟΣ ΜΗΧΑΝΙΣΜΟΣ ΠΑΙΧΝΙΔΙΩΝ</span><strong>Ο κήπος της βαρύτητας</strong><p>Δοκίμασε πραγματική φυσική κίνησης με Phaser + Matter.js.</p></div><Link to={url+"/physics"} className="pw2-main-button">Παίζω με τη φυσική <ArrowRight size={18}/></Link></div><div className="pw2-portal-grid"><Link to={url+"/game"}><span>🎮</span><strong>Παίζω</strong><small>Πραγματικό παιχνίδι</small></Link><Link to={url+"/patterns"}><span>🖍️</span><strong>Ζωγραφίζω</strong><small>Πατρόν για εκτύπωση</small></Link><Link to={url+"/crafts"}><span>✂️</span><strong>Κατασκευάζω</strong><small>4 βήματα & υλικά</small></Link><Link to={url+"/stories"}><span>📚</span><strong>Ακούω ιστορίες</strong><small>Σελίδες με αφήγηση</small></Link></div>
  <GameCatalog age={a} ageKey={ageKey}/>
 </div>
}
export function AgeGameRoute({ageKey}:{ageKey:string}){return <StageAgeGame age={ageIndex(ageKey)} ageKey={ageKey}/>}
export function AgePatternsRoute({ageKey}:{ageKey:string}){return <PatternLibrary age={ageIndex(ageKey)} ageKey={ageKey}/>}
export function AgeCraftsRoute({ageKey}:{ageKey:string}){return <CraftLibrary age={ageIndex(ageKey)} ageKey={ageKey}/>}
export function AgeStoriesRoute({ageKey}:{ageKey:string}){return <StoryLibrary age={ageIndex(ageKey)} ageKey={ageKey}/>}
