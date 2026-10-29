/** Original, screen-to-real-world preschool activities. No child data is collected. */
export type PreschoolAge = 0 | 1 | 2 | 3;
export const AGE_PATHS = [
  { title:"Μικροί εξερευνητές", age:"2–3", promise:"Αγγίζω, παρατηρώ, ονομάζω.", guidance:"Μία κίνηση τη φορά · με έναν μεγάλο κοντά μου.", duration:"2–4′", color:"#ffbf6a" },
  { title:"Περίεργα αστεράκια", age:"3–4", promise:"Συνδυάζω, διαλέγω, παίζω ρόλους.", guidance:"Δύο μικρά βήματα · πολλές δοκιμές.", duration:"4–6′", color:"#b9d8ff" },
  { title:"Μικροί δημιουργοί", age:"4–5", promise:"Φτιάχνω, αφηγούμαι, ανακαλύπτω μοτίβα.", guidance:"Πειραματίζομαι και εξηγώ με εικόνες.", duration:"5–8′", color:"#edc1ef" },
  { title:"Μικροί εφευρέτες", age:"5–6", promise:"Προβλέπω, σχεδιάζω, λύνω προβλήματα.", guidance:"Επιλέγω λύσεις και δοκιμάζω ξανά.", duration:"6–10′", color:"#b9e9c6" }
] as const;
export type CraftId = "flower"|"butterfly"|"bear"|"tree"|"seed";
export type Craft = {
  id: CraftId; title: string; subtitle:string; minAge:PreschoolAge;
  materials:string; safety:string;
  steps: readonly { icon:string; title:string; help:string }[];
  question:string; experience:string;
};
export const CRAFTS: Craft[] = [
  {id:"flower",title:"Το λουλούδι της φιλίας",subtitle:"Ζωγραφίζω • κολλάω • χαρίζω",minAge:0,
   materials:"Α4, κηρομπογιές, κόλλα κατάλληλη για παιδιά, χοντρό χαρτί",
   safety:"Ο ενήλικος προετοιμάζει τα κομμάτια για παιδιά κάτω των 4.",
   steps:[
     {icon:"🖍️",title:"Δίνω χρώμα",help:"Χρωματίζουμε τα μεγάλα πέταλα όπως μας αρέσει."},
     {icon:"✂️",title:"Ετοιμάζουμε",help:"Ο ενήλικος κόβει στο μαύρο περίγραμμα."},
     {icon:"🧩",title:"Φτιάχνω",help:"Κολλάμε τα πέταλα γύρω από τον κύκλο."},
     {icon:"💝",title:"Χαρίζω",help:"Το δίνουμε σε κάποιον και μιλάμε για τη φιλία."}
   ],question:"Ποιο χρώμα διάλεξες για τον φίλο σου;",experience:"Δώσε σε κάποιον ένα λουλούδι από χαρτί."},
  {id:"butterfly",title:"Η πεταλούδα των χρωμάτων",subtitle:"Συμμετρία • κίνηση • χρώματα",minAge:1,
   materials:"Α4, κηρομπογιές, κόλλα, χαρτί",
   safety:"Το ψαλίδι χρησιμοποιείται μόνο με επίβλεψη ενηλίκου.",
   steps:[
     {icon:"🎨",title:"Χρωματίζω",help:"Διαλέγουμε τα ίδια ή διαφορετικά χρώματα στις δύο φτερούγες."},
     {icon:"✂️",title:"Κόβουμε",help:"Ο ενήλικος κόβει το μαύρο περίγραμμα."},
     {icon:"🦋",title:"Διπλώνω",help:"Διπλώνουμε στη διακεκομμένη γραμμή."},
     {icon:"🌼",title:"Παίζω",help:"Ανοίγουμε τις φτερούγες και φανταζόμαστε πού πετά."}
   ],question:"Τι βλέπεις στην αριστερή και στη δεξιά φτερούγα;",experience:"Παρατήρησε ένα φύλλο ή μια πεταλούδα στον κήπο."},
  {id:"bear",title:"Η μάσκα του Πισιπούκ",subtitle:"Θέατρο • εκφράσεις • συναισθήματα",minAge:1,
   materials:"Χοντρό Α4, μαρκαδόροι, χαρτόνι, κόλλα",
   safety:"Ο ενήλικος κόβει τη μάσκα και ανοίγει τα μάτια. Χωρίς κορδόνι γύρω από τον λαιμό.",
   steps:[
     {icon:"🖍️",title:"Χρωματίζω",help:"Βάζω το δικό μου χρώμα στο αρκουδάκι."},
     {icon:"✂️",title:"Ετοιμάζουμε",help:"Ο ενήλικος κόβει τις γραμμές και τα μάτια."},
     {icon:"🐻",title:"Κρατάω",help:"Κρατάμε τη μάσκα μπροστά στο πρόσωπο, χωρίς να τη δένουμε."},
     {icon:"😊",title:"Παίζω ρόλους",help:"Λέω πώς νιώθει σήμερα το αρκουδάκι."}
   ],question:"Πώς θα δείξεις ότι το αρκουδάκι χαίρεται;",experience:"Παίξε μικρό θέατρο με ένα μέλος της οικογένειας."},
  {id:"tree",title:"Το δέντρο των εποχών",subtitle:"Παρατήρηση • φύση • αλλαγή",minAge:2,
   materials:"Α4, χρώματα, κόλλα, φύλλα από χαρτί",
   safety:"Συλλέγουμε μόνο πεσμένα φύλλα και πλένουμε τα χέρια.",
   steps:[
     {icon:"🌳",title:"Παρατηρώ",help:"Πώς μοιάζει το δέντρο στη δική μας εποχή;"},
     {icon:"🎨",title:"Χρωματίζω",help:"Βάφω τον κορμό και τα κλαδιά."},
     {icon:"🍂",title:"Προσθέτω",help:"Κολλάω φύλλα, άνθη ή χιόνι από χαρτί."},
     {icon:"🗣️",title:"Αφηγούμαι",help:"Λέω τι αλλάζει όταν έρχεται άλλη εποχή."}
   ],question:"Πώς θα αλλάξει το δέντρο τον χειμώνα;",experience:"Βρες ένα πραγματικό δέντρο και παρατήρησέ το για μια εβδομάδα."},
  {id:"seed",title:"Ο Σπορούλης μεγαλώνει",subtitle:"STEM • αλληλουχία • φροντίδα",minAge:2,
   materials:"Α4, χρώματα, χαρτόνι, προαιρετικά γλαστράκι με χώμα",
   safety:"Ο ενήλικος επιβλέπει χώμα, σπόρους και μικρά υλικά. Δεν βάζουμε σπόρους στο στόμα.",
   steps:[
     {icon:"🌱",title:"Βάζω σπόρο",help:"Κοιτάζουμε πώς ο σπόρος μπαίνει μέσα στο χώμα."},
     {icon:"💧",title:"Προσθέτω νερό",help:"Ποτίζουμε λίγο, χωρίς να πλημμυρίσει το χώμα."},
     {icon:"☀️",title:"Βλέπω φως",help:"Βρίσκουμε ένα κατάλληλο φωτεινό σημείο."},
     {icon:"🌿",title:"Παρατηρώ",help:"Σε πολλές ημέρες εμφανίζονται ρίζα και βλαστός."}
   ],question:"Τι νομίζεις ότι θα εμφανιστεί πρώτο;",experience:"Φύτεψε έναν κατάλληλο σπόρο με έναν ενήλικο και κράτησε ζωγραφικό ημερολόγιο."}
];
const ROOT=`<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297"><rect x="0" y="0" width="210" height="297" fill="white"/><g fill="none" stroke="#202020" stroke-width="1.15" stroke-linejoin="round" stroke-linecap="round">`;
const SHAPES:Record<CraftId,string>={
 flower:`<circle cx="105" cy="116" r="24"/><ellipse cx="105" cy="56" rx="22" ry="34"/><ellipse cx="105" cy="176" rx="22" ry="34"/><ellipse cx="45" cy="116" rx="34" ry="22"/><ellipse cx="165" cy="116" rx="34" ry="22"/><ellipse cx="62" cy="73" rx="23" ry="31" transform="rotate(-45 62 73)"/><ellipse cx="148" cy="73" rx="23" ry="31" transform="rotate(45 148 73)"/><ellipse cx="62" cy="159" rx="23" ry="31" transform="rotate(45 62 159)"/><ellipse cx="148" cy="159" rx="23" ry="31" transform="rotate(-45 148 159)"/><path d="M105 200v42q-32-30-38-11 10 25 38 13q30-36 39-11-6 25-39 11"/>`,
 butterfly:`<path d="M105 96 C70 37 17 38 25 95 C-3 151 63 179 105 138 C147 179 213 151 185 95 C193 38 140 37 105 96 Z"/><ellipse cx="105" cy="116" rx="9" ry="45"/><path d="M100 75 Q83 56 91 45 M110 75 Q127 56 119 45"/><circle cx="69" cy="96" r="17"/><circle cx="141" cy="96" r="17"/><circle cx="62" cy="142" r="9"/><circle cx="148" cy="142" r="9"/><path stroke-dasharray="3 3" d="M105 42 V188"/>`,
 bear:`<circle cx="59" cy="65" r="22"/><circle cx="151" cy="65" r="22"/><circle cx="105" cy="124" r="73"/><circle cx="79" cy="111" r="13" stroke-dasharray="2 3"/><circle cx="131" cy="111" r="13" stroke-dasharray="2 3"/><ellipse cx="105" cy="148" rx="26" ry="20"/><ellipse cx="105" cy="139" rx="10" ry="7"/><path d="M105 146 v11 m0 0 q-8 10-16 0 m16 0q8 10 16 0"/>`,
 tree:`<path d="M90 238 Q94 185 79 168 Q52 151 55 136 M119 238 Q116 185 130 166 Q164 150 162 118 M104 192 L105 74 M91 238 H120"/><path d="M105 70 C55 16 18 68 40 101 C8 143 42 174 68 160 C89 190 121 169 125 166 C176 187 199 129 174 106 C202 64 157 22 105 70 Z"/><path stroke-dasharray="3 3" d="M29 259 H181"/>`,
 seed:`<rect x="16" y="52" width="178" height="173" rx="5"/><path stroke-dasharray="4 3" d="M60.5 52 V225 M105 52 V225 M149.5 52 V225"/><ellipse cx="38" cy="155" rx="9" ry="14"/><path d="M83 157 q-16-14 0-31 q16 17 0 31 M83 157 v20"/><path d="M126 170 V120 Q105 116 113 100 Q125 101 126 120 Q149 102 141 93 Q126 96 126 120"/><path d="M172 190 V109 Q151 111 154 89 Q171 95 172 109 Q192 89 188 80 Q173 85 172 109"/><path d="M23 187h29 M68 187h29 M112 187h29 M157 187h29"/>`
};
const escapeXml=(s:string)=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
export function craftSvg(id:CraftId):string{
 const c=CRAFTS.find(x=>x.id===id)!;
 return ROOT+SHAPES[id]+`</g><text x="105" y="23" text-anchor="middle" font-family="DejaVu Sans,Arial,sans-serif" font-size="8" font-weight="700" fill="#222">${escapeXml(c.title)}</text><text x="105" y="37" text-anchor="middle" font-family="DejaVu Sans,Arial,sans-serif" font-size="4" fill="#444">ΠΙΣΙΠΟΥΚ • ΠΑΤΡΟΝ ΖΩΓΡΑΦΙΚΗΣ &amp; ΚΑΤΑΣΚΕΥΗΣ</text><path d="M15 250 H195" stroke="#999" stroke-width=".4"/><text x="105" y="265" font-family="DejaVu Sans,Arial,sans-serif" text-anchor="middle" fill="#333" font-size="4">Μαύρη γραμμή: περίγραμμα • Διακεκομμένη: δίπλωμα / καθοδήγηση</text><text x="105" y="277" font-family="DejaVu Sans,Arial,sans-serif" text-anchor="middle" fill="#333" font-size="4">Η κοπή γίνεται με επίβλεψη ενηλίκου.</text></svg>`;
}
export function saveCraftTemplate(id:CraftId){
 const blob=new Blob([craftSvg(id)],{type:"image/svg+xml;charset=utf-8"});
 const url=URL.createObjectURL(blob);
 const link=document.createElement("a");link.href=url;link.download=`pisipouk-patron-${id}-A4.svg`;document.body.appendChild(link);link.click();link.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
