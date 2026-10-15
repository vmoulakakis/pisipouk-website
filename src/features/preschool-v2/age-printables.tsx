import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Download, Printer, Scissors, Sparkles, Volume2 } from "lucide-react";
type AgeProps={age:number;ageKey:string};
const ROOT="/pisipouk-v2-staging/ages/";
const PATTERNS=[
 {title:"Ο Πισιπούκ και το λουλούδι",note:"Πολύ μεγάλα περιγράμματα, για δαχτυλομπογιές και χοντρές κηρομπογιές"},
 {title:"Η μαγική πεταλούδα",note:"Μεγάλη συμμετρική πεταλούδα, με χρώματα και απλά σχήματα"},
 {title:"Χτίζω τη δική μου γέφυρα",note:"Ξύλα, δέντρα και ποτάμι για ζωγραφική και κατασκευή"},
 {title:"Ο τροχός των εποχών",note:"Τέσσερις εποχές σε τροχό, μαζί με ένα βέλος που περιστρέφεται"}
];
function BearPattern(){
 return <g stroke="#283D4E" fill="white" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round">
  <circle cx="262" cy="410" r="94"/><circle cx="528" cy="410" r="94"/><ellipse cx="395" cy="700" rx="210" ry="230"/>
  <ellipse cx="270" cy="575" rx="78" ry="102" transform="rotate(-24 270 575)"/><ellipse cx="523" cy="575" rx="78" ry="102" transform="rotate(24 523 575)"/>
  <circle cx="400" cy="440" r="205"/><circle cx="330" cy="423" r="19" fill="#283D4E"/><circle cx="468" cy="423" r="19" fill="#283D4E"/>
  <ellipse cx="398" cy="515" rx="93" ry="70"/><ellipse cx="395" cy="491" rx="27" ry="19" fill="#283D4E"/><path d="M395 510Q370 552 342 523M395 510Q421 552 447 523" fill="none"/>
  <ellipse cx="294" cy="406" rx="32" ry="14" stroke="#b9b9b9" strokeWidth="3"/><ellipse cx="498" cy="406" rx="32" ry="14" stroke="#b9b9b9" strokeWidth="3"/>
  <path d="M258 807Q230 885 289 898Q339 905 339 856M456 856Q462 915 522 899Q568 868 529 803" fill="white"/>
  <path d="M612 806Q665 746 690 797Q714 847 663 877M668 793Q681 773 689 789" fill="none"/>
  <circle cx="647" cy="703" r="46"/><circle cx="647" cy="618" r="39"/><circle cx="563" cy="702" r="39"/><circle cx="727" cy="698" r="39"/><circle cx="648" cy="783" r="39"/><circle cx="647" cy="702" r="28"/>
 </g>;
}
function ButterflyPattern(){
 return <g stroke="#283D4E" strokeWidth="6.5" fill="white" strokeLinejoin="round" strokeLinecap="round">
  <path d="M400 500C267 260 126 298 135 452C140 545 227 572 317 578C151 623 129 801 219 856C301 909 381 808 398 658Z"/>
  <path d="M400 500C533 260 674 298 665 452C660 545 573 572 483 578C649 623 671 801 581 856C499 909 419 808 402 658Z"/>
  <ellipse cx="400" cy="581" rx="37" ry="205"/><circle cx="400" cy="360" r="45"/>
  <path d="M378 328Q324 260 334 219M422 328Q476 260 468 219"/>
  <circle cx="334" cy="216" r="10"/><circle cx="468" cy="216" r="10"/>
  <circle cx="385" cy="352" r="5" fill="#283D4E"/><circle cx="415" cy="352" r="5" fill="#283D4E"/><path d="M387 371Q400 383 413 371"/>
  <circle cx="260" cy="462" r="66"/><circle cx="540" cy="462" r="66"/>
  <path d="M220 693Q267 645 338 707M580 693Q533 645 462 707"/>
  <circle cx="287" cy="753" r="37"/><circle cx="513" cy="753" r="37"/>
  <path d="M230 904Q400 955 570 904"/>
 </g>;
}
function BridgePattern(){
 return <g stroke="#283D4E" strokeWidth="6" fill="white" strokeLinecap="round" strokeLinejoin="round">
 <path d="M84 282Q399 123 716 282" strokeDasharray="14 16" fill="none"/>
 <path d="M110 352Q198 287 285 352Q377 290 463 352Q558 286 693 352" fill="none"/>
 <rect x="115" y="445" width="160" height="105" rx="23"/><rect x="315" y="445" width="235" height="105" rx="23"/><rect x="590" y="445" width="125" height="105" rx="23"/>
 <path d="M140 470Q178 495 248 470M345 470Q448 507 523 470M610 470Q662 490 695 470" strokeWidth="4"/>
 <path d="M90 665Q160 635 220 665Q285 693 346 665Q410 633 471 664Q545 698 620 662Q677 636 724 668" fill="none"/>
 <path d="M105 737Q169 706 225 740Q300 774 369 737Q449 697 516 739Q602 778 693 735" fill="none"/>
 <path d="M126 823Q260 770 394 826Q525 877 678 823" fill="none"/>
 <path d="M147 820V928M132 875L147 850 168 876M653 811V921M635 868L653 845 674 876" fill="none"/>
 <circle cx="650" cy="225" r="62"/><path d="M650 121V93M650 357V325M550 225H522M777 225H752M583 158L560 136M715 296L739 320M715 157L738 134M583 291L558 315"/>
 </g>;
}
function WheelPattern(){
 return <g stroke="#283D4E" strokeWidth="6" fill="white" strokeLinejoin="round" strokeLinecap="round">
  <circle cx="400" cy="515" r="290"/><circle cx="400" cy="515" r="33"/><path d="M400 225V805M110 515H690"/>
  <circle cx="267" cy="385" r="49"/><path d="M267 302V286M267 480V466M184 385H169M365 385H349M205 325L192 310M333 448L346 463M332 325L348 310M203 448L186 465"/>
  <path d="M484 325Q531 283 572 325Q640 312 634 363Q640 404 587 412H489Q448 410 450 371Q445 344 484 325Z"/>
  <path d="M509 431L486 479M571 431L548 481M622 430L602 477" strokeDasharray="9 15"/>
  <path d="M180 670Q243 620 308 672Q285 752 215 737Q166 716 180 670Z"/><path d="M245 668Q256 725 292 742M222 670Q203 710 190 721"/>
  <path d="M495 656L590 749M590 656L495 749M543 627V780M462 703H620M483 662L601 745M600 661L482 745" strokeWidth="10"/>
  <path d="M400 852L450 923L416 911L405 965L387 910L352 925Z" /><circle cx="400" cy="898" r="15"/>
  <circle cx="400" cy="515" r="10" fill="#283D4E"/>
 </g>;
}
const ART=[<BearPattern key="bear"/>,<ButterflyPattern key="butterfly"/>,<BridgePattern key="bridge"/>,<WheelPattern key="wheel"/>];
function PatternSVG({age,svgRef}:{age:number;svgRef:React.RefObject<SVGSVGElement|null>}){
 return <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" role="img" aria-label={PATTERNS[age].title} className="pw2-a4-svg">
 <rect x="6" y="6" width="788" height="1088" rx="8" fill="#fff" stroke="#bbb" strokeWidth="2"/>
 <text x="400" y="93" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold" fontSize="30" fill="#283D4E">ΠΙΣΙΠΟΥΚ · ΖΩΓΡΑΦΙΖΩ</text>
 <path d="M95 125H705" stroke="#bbb" strokeWidth="2" />
 {ART[age]}
 <path d="M95 1006H705" stroke="#bbb" strokeWidth="2" />
 <text x="400" y="1047" textAnchor="middle" fontFamily="sans-serif" fontSize="19" fill="#566677">Το έργο μου · ______________________</text>
 </svg>
}
function useSVGDownload(age:number){
 const ref=useRef<SVGSVGElement>(null);
 const download=()=>{
  const svg=ref.current;if(!svg)return;
  const output=new XMLSerializer().serializeToString(svg);
  const file=new Blob([output],{type:"image/svg+xml;charset=utf-8"});
  const url=URL.createObjectURL(file);const anchor=document.createElement("a");anchor.href=url;anchor.download="pisipouk-patron-"+(age+1)+".svg";anchor.click();window.setTimeout(()=>URL.revokeObjectURL(url),2000);
 };
 return {ref,download};
}
export function StagePatterns({age,ageKey}:AgeProps){
 const {ref,download}=useSVGDownload(age);
 if(age<0||age>3)return null;
 return <div className="pw2-pattern-view"><div className="pw2-page-intro"><div className="pw2-overline">ΑΥΘΕΝΤΙΚΟ ΠΑΤΡΟΝ · ΠΡΑΓΜΑΤΙΚΟ ΔΙΑΝΥΣΜΑΤΙΚΟ A4</div><h1>{PATTERNS[age].title}</h1><p>{PATTERNS[age].note}</p></div>
 <div className="pw2-print-layout"><div className="pw2-print-sheet"><PatternSVG svgRef={ref} age={age}/></div><div className="pw2-print-tools"><h2>Το δικό μου πατρόν</h2><p>Ασπρόμαυρο, σχεδιασμένο ειδικά για τον Πισιπούκ. Κάνε λήψη SVG ή χρησιμοποίησε την εκτύπωση του browser.</p><button type="button" className="pw2-main-button" onClick={download}><Download/> Λήψη SVG (A4)</button><button type="button" className="pw2-outline" onClick={()=>window.print()}><Printer/> Εκτύπωση / PDF</button><p className="pw2-disclaimer">Α4, κατακόρυφο, στο 100% του μεγέθους. Ένας ενήλικας πρέπει να ελέγξει την προεπισκόπηση και την κλίμακα πριν από τη χρήση.</p><Link className="pw2-text-link" to={"/pisipouk-v2-staging/ages/"+ageKey+"/crafts"}>Σχετική κατασκευή <ArrowRight size={17}/></Link></div></div>
 </div>;
}
const CRAFTS=[
 {title:"Χάρτινος Πισιπούκ",materials:"Χοντρό χαρτί Α4, χοντρές κηρομπογιές, κόλλα σε στικ. Ο ενήλικας χρησιμοποιεί το ψαλίδι.",steps:["Τυπώνουμε και χρωματίζουμε τον μεγάλο Πισιπούκ.","Ο ενήλικας κόβει προσεκτικά το περίγραμμα.","Κολλάμε τον Πισιπούκ σε χοντρό χαρτόνι.","Παίζουμε μαζί και του αφηγούμαστε μια ιστορία."]},
 {title:"Πεταλούδα με φτερά",materials:"Έγχρωμα χαρτιά, μπογιές, κόλλα, ασφαλές ψαλίδι με επίβλεψη, καλαμάκι χάρτινο.",steps:["Χρωματίζουμε και τυπώνουμε τη μεγάλη πεταλούδα.","Κόβουμε το περίγραμμα με βοήθεια ενηλίκου.","Διπλώνουμε ελαφρά τα φτερά στο κέντρο.","Στερεώνουμε χάρτινη λαβή και κάνουμε την πεταλούδα να πετάει."]},
 {title:"Χτίζω μία χάρτινη γέφυρα",materials:"Χοντρό χαρτί, χρώματα, κόλλα, δύο μικρά ασφαλή κουτάκια, ψαλίδι με επίβλεψη.",steps:["Χρωματίζουμε τα ξύλα της γέφυρας στο πατρόν.","Κόβουμε ή διπλώνουμε τις λωρίδες με βοήθεια.","Ενώνουμε τις λωρίδες πάνω από δύο κουτάκια.","Δοκιμάζουμε με ελαφρύ χάρτινο ζωάκι. Αν λυγίζει, ενισχύουμε τη γέφυρα."]},
 {title:"Τροχός τεσσάρων εποχών",materials:"Χαρτόνι Α4, μπογιές, ψαλίδι με επίβλεψη, μία διπλόκαρφη για χειρισμό μόνο από ενήλικα.",steps:["Χρωματίζουμε τον κύκλο των τεσσάρων εποχών.","Ο ενήλικας κόβει τον κύκλο και το βέλος.","Ο ενήλικας στερεώνει το βέλος με ασφαλή σύνδεση.","Γυρίζουμε τον τροχό και μιλάμε για ήλιο, βροχή, φύλλα και χιόνι."]}
];
export function StageCrafts({age,ageKey}:AgeProps){
 const [step,setStep]=useState(0);
 const {ref,download}=useSVGDownload(age);
 if(age<0||age>3)return null;
 const craft=CRAFTS[age];
 return <div className="pw2-craft-view"><div className="pw2-page-intro"><span className="pw2-overline">ΠΑΙΖΟΥΜΕ ΚΑΙ ΕΚΤΟΣ ΟΘΟΝΗΣ · ΜΕ ΕΝΗΛΙΚΑ</span><h1>{craft.title}</h1><p>{craft.materials}</p></div>
 <div className="pw2-craft-card"><div className="pw2-craft-step"><span>ΒΗΜΑ {step+1} / {craft.steps.length}</span><div className="pw2-craft-symbol" aria-hidden="true">{["🖍️","✂️","🧩","🌈"][step]}</div><h2>{craft.steps[step]}</h2><div className="pw2-craft-controls"><button type="button" className="pw2-outline" onClick={()=>setStep(v=>Math.max(v-1,0))} disabled={step===0}><ChevronLeft/> Πίσω</button><button type="button" className="pw2-main-button" onClick={()=>setStep(v=>(v+1)%4)}>{step===3?"Από την αρχή":"Επόμενο βήμα"} <ChevronRight/></button></div></div>
 <div className="pw2-craft-preview"><PatternSVG age={age} svgRef={ref}/><button type="button" className="pw2-main-button" onClick={download}><Download size={17}/> Πατρόν A4 SVG</button></div></div><p className="pw2-safety">⚠️ Επίβλεψη ενηλίκου. Χρησιμοποιήστε μη τοξικά υλικά. Όλα τα εργαλεία, η κοπή και οι μικρές συνδέσεις ελέγχονται από ενήλικα.</p><Link className="pw2-text-link" to={"/pisipouk-v2-staging/ages/"+ageKey+"/patterns"}>Εκτύπωση σε πλήρη σελίδα <ArrowRight size={17}/></Link></div>;
}
const STORIES=[
 {title:"Ο Πισιπούκ και το χαρούμενο λουλούδι",pages:[["🌞","Ο ήλιος ξύπνησε τον Πισιπούκ. Καλημέρα, ήλιε!"],["🌷","Στον κήπο ένα λουλούδι διψούσε. Νεράκι, παρακαλώ!"],["💧","Ο Πισιπούκ έφερε νερό. Το λουλούδι χαμογέλασε."],["🌈","Τώρα ο κήπος είναι χαρούμενος. Τι όμορφη μέρα!"]]},
 {title:"Η πεταλούδα ψάχνει χρώματα",pages:[["🦋","Η πεταλούδα είχε άσπρα φτερά και ήθελε να τα στολίσει."],["🍓","Βρήκε ένα κόκκινο λουλούδι και χαιρέτησε τη φίλη της."],["🌻","Βρήκε και ένα κίτρινο λουλούδι. Τι όμορφα χρώματα!"],["🎨","Ο Πισιπούκ ανακάτεψε χρώματα και έφτιαξε πορτοκαλί!"],["🌈","Η πεταλούδα πέταξε στον ουρανό γεμάτη χαρά."]]},
 {title:"Η γέφυρα της φιλίας",pages:[["🌳","Μετά τη βροχή, ένα μικρό ποτάμι χώριζε τους δύο φίλους."],["🌉","Ο Πισιπούκ σκέφτηκε να φτιάξει μια γέφυρα."],["🪵","Μάζεψαν ξύλα. Το πρώτο ξύλο ήταν πολύ κοντό."],["🔨","Το δοκίμασαν ξανά και βρήκαν το σωστό μέγεθος."],["🐻","Πέρασαν προσεκτικά τη γέφυρα και αγκαλιάστηκαν."]]},
 {title:"Ο μικρός εφευρέτης",pages:[["🤖","Ένα μικρό ρομπότ ήθελε να επισκεφθεί το αστέρι."],["🪨","Στον δρόμο υπήρχαν πέτρες και κλειστά μονοπάτια."],["➡️","Ο Πισιπούκ σχεδίασε μια σειρά από βελάκια."],["🔁","Η πρώτη διαδρομή δεν λειτούργησε. Έτσι δοκίμασε άλλη."],["⭐","Το ρομπότ έφτασε στο αστέρι. Κάθε δοκιμή μάς βοηθά να μάθουμε!"]]}
];
export function StageAgeStory({age,ageKey}:AgeProps){
 const [page,setPage]=useState(0);
 if(age<0||age>3)return null;
 const story=STORIES[age],scene=story.pages[page]||story.pages[0];
 const speak=()=>{if(typeof window==="undefined"||!("speechSynthesis" in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(scene[1]);u.lang="el-GR";u.rate=.83;window.speechSynthesis.speak(u)};
 return <div className="pw2-story-view"><span className="pw2-overline">ΕΛΛΗΝΙΚΗ ΕΙΚΟΝΟΓΡΑΦΗΜΕΝΗ ΙΣΤΟΡΙΑ · ΠΡΩΤΟΤΥΠΟ</span><h1>{story.title}</h1>
 <div className="pw2-story-pages"><div className="pw2-story-art"><span>{scene[0]}</span><img src="/preschool-world/bear.webp" alt="Ο Πισιπούκ"/></div><div className="pw2-story-copy"><span className="pw2-overline">ΣΕΛΙΔΑ {page+1} ΑΠΟ {story.pages.length}</span><p>{scene[1]}</p><button type="button" className="pw2-outline" onClick={speak}><Volume2/> Άκου την ιστορία</button><div className="pw2-story-pagers"><button type="button" className="pw2-outline" disabled={page===0} onClick={()=>setPage(n=>n-1)}><ChevronLeft/> Πριν</button><button type="button" className="pw2-main-button" onClick={()=>setPage(n=>(n+1)%story.pages.length)}>{page===story.pages.length-1?"Από την αρχή":"Επόμενη σελίδα"} <ChevronRight/></button></div></div></div>
 <p className="pw2-disclaimer">Πρωτότυπο ελληνικό κείμενο, δοκιμαστική αφήγηση συσκευής και προσωρινή εικονογράφηση. Δεν έχει ολοκληρωθεί η τελική εικονογράφηση ανά σελίδα ή η επαγγελματική αφήγηση.</p><Link className="pw2-text-link" to={"/pisipouk-v2-staging/ages/"+ageKey}>Επιστροφή στο χωριό <ArrowLeft size={16}/></Link></div>;
}
