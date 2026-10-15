import {useState} from "react";
import {Link} from "@tanstack/react-router";
import {ArrowLeft,CalendarDays,Gamepad2,Palette,Scissors,BookOpen} from "lucide-react";
import {gamesForAge,monthlyPack,monthlyRotation} from "../games/curriculum";
import {PATTERNS,CRAFTS} from "../library/studioContent";
import {STORIES} from "../library/story-data";
import "./monthly.css";
const MONTHS=Array.from({length:12},(_,i)=>i);
const AGES=["2–3","3–4","4–5","5–6"];
export function MonthlyLearningPreview(){
 const [month,setMonth]=useState(()=>new Date().getMonth()),[age,setAge]=useState(0);
 const year=new Date().getFullYear(),date=new Date(year,month,15),pack=monthlyPack(date);
 const p=monthlyRotation(PATTERNS,date,age),c=monthlyRotation(CRAFTS,date,age),s=monthlyRotation(STORIES,date,age),g=monthlyRotation(gamesForAge(age),date,age);
 return <div className="plm-month" style={{"--plm-color":pack.color} as React.CSSProperties}>
  <Link to="/pisipouk-v2-staging/" className="plm-back"><ArrowLeft/> Πίσω στον Πισιπούκ</Link>
  <header className="plm-hero"><div><span>ΕΠΟΠΤΕΙΑ ΕΚΠΑΙΔΕΥΤΙΚΟΥ · ΜΗΝΙΑΙΟ ΠΡΟΓΡΑΜΜΑ</span><h1><CalendarDays size={34}/> Οι 12 μήνες του Πισιπούκ</h1><p>Δες τι προτείνεται για κάθε μήνα και ηλικία. Η μηνιαία εναλλαγή είναι προγραμματισμένη ανά ημερολογιακό μήνα.</p></div><div className="plm-bigicon">{pack.icon}</div></header>
  <div className="plm-months" role="group" aria-label="Προεπισκόπηση μήνα">{MONTHS.map(m=>{const data=monthlyPack(new Date(year,m,15));return <button type="button" key={m} className={m===month?"selected":""} aria-pressed={m===month} onClick={()=>setMonth(m)}>{data.icon}<span>{data.name}</span></button>})}</div>
  <div className="plm-age-list" role="group" aria-label="Επιλογή ηλικίας">{AGES.map((label,i)=><button type="button" key={label} aria-pressed={age===i} className={age===i?"selected":""} onClick={()=>setAge(i)}>{label} ετών</button>)}</div>
  <section className="plm-current"><h2>{pack.name} {year} — {pack.theme}</h2><p>Διαφορετική θεματική ατμόσφαιρα, αντικείμενα και ηλικιακή δυσκολία, με συνέχεια στη δραστηριότητα εκτός οθόνης.</p><div className="plm-icons">{pack.objects.map((icon,i)=><span key={i}>{icon}</span>)}</div><p><strong>Στο σπίτι ή στο σχολείο:</strong> {pack.offline}</p></section>
  <div className="plm-preview-cards">
   <article><div><Gamepad2/><strong>20 παιχνίδια</strong></div><p>Κάθε ηλικία έχει 20 ανοιχτά παιχνίδια με μηνιαίες παραλλαγές.</p><ol>{g.slice(0,5).map(x=><li key={x.id}>{x.title}</li>)}</ol></article>
   <article><div><Palette/><strong>20 ζωγραφιές</strong></div><p>Μηνιαία αλλαγή προτάσεων και σειράς, διατηρώντας όλες τις εικόνες.</p><ol>{p.slice(0,5).map(x=><li key={x.id}>{x.title}</li>)}</ol></article>
   <article><div><Scissors/><strong>20 κατασκευές</strong></div><p>Εναλλαγή εγκεκριμένων οδηγιών και εκτυπώσιμων σχεδίων.</p><ol>{c.slice(0,5).map(x=><li key={x.id}>{x.title}</li>)}</ol></article>
   <article><div><BookOpen/><strong>20 ιστορίες</strong></div><p>Αλλαγή των προτεινόμενων ιστοριών, χωρίς απώλεια παλαιότερων.</p><ol>{s.slice(0,5).map(x,i)=><li key={i}>{x.title}</li>)}</ol></article>
  </div>
  <div className="plm-status"><strong>Τι ανανεώνεται αυτόματα;</strong> Οι μηνιαίες προτάσεις, η εποχιακή θεματολογία, το υλικό που εμφανίζεται πρώτο και αρκετές παράμετροι των παιχνιδιών. <strong>Τι δεν παράγεται ακόμη αυτόματα;</strong> 80 νέα γραφικά παιχνίδια, καινούργια διανυσματικά πατρόν και πλήρως εικονογραφημένες ιστορίες. Αυτά απαιτούν εγκεκριμένα αρχεία και παιδαγωγική αξιολόγηση πριν από δημοσίευση.</div>
 </div>;
}
