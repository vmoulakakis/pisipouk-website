import {useMemo,useState} from "react";
import {Link} from "@tanstack/react-router";
import {ArrowLeft,CalendarDays,MapPin,Sun,Clock,BookOpen,Palette,Scissors,Gamepad2} from "lucide-react";
import {calendarMonth,contextFor,REGIONS,seasonalSuggestions,type RegionKey} from "./context-engine";
import "./context-calendar.css";
const greekMonths=["Ιανουάριος","Φεβρουάριος","Μάρτιος","Απρίλιος","Μάιος","Ιούνιος","Ιούλιος","Αύγουστος","Σεπτέμβριος","Οκτώβριος","Νοέμβριος","Δεκέμβριος"];
const DAYS=["Δε","Τρ","Τε","Πε","Πα","Σα","Κυ"];
export function PreschoolContextCalendar(){
 const now=new Date(),current=contextFor(now);
 const [month,setMonth]=useState(current.month);
 const [year,setYear]=useState(current.year);
 const [region,setRegion]=useState<RegionKey>("attica");
 const [age,setAge]=useState(0);
 const [picked,setPicked]=useState<number|null>(current.day);
 const [previewNow,setPreviewNow]=useState(false);
 const selected=previewNow?now:new Date(Date.UTC(year,month-1,picked||1,9));
 const context=contextFor(selected,region);
 const items=calendarMonth(year,month);
 const activeEvent=items.filter(e=>e.day===(picked||1));
 const suggested=seasonalSuggestions(selected,region,age);
 const first=(new Date(Date.UTC(year,month-1,1)).getUTCDay()+6)%7;
 const daysInMonth=new Date(Date.UTC(year,month,0)).getUTCDate();
 const cells=Array.from({length:Math.ceil((first+daysInMonth)/7)*7},(_,i)=>i-first+1);
 const changeMonth=(delta:number)=>{
  const newDate=new Date(Date.UTC(year,month-1+delta,1));
  setYear(newDate.getUTCFullYear());setMonth(newDate.getUTCMonth()+1);setPicked(1);setPreviewNow(false);
 };
 return <section className="pcal-page">
  <Link to="/pisipouk-v2-staging/" className="pcal-return"><ArrowLeft size={18}/> Online Preschool</Link>
  <header className="pcal-hero"><div><span>ΕΣΩΤΕΡΙΚΟ ΕΚΠΑΙΔΕΥΤΙΚΟ ΗΜΕΡΟΛΟΓΙΟ</span><h1><CalendarDays size={32}/> Ο χρόνος και ο κόσμος του Πισιπούκ</h1><p>Ελληνικές αργίες, διεθνείς ημέρες, εποχές, ώρα και ο τόπος μας — για ζωντανές προτάσεις παιχνιδιών, ιστοριών, κατασκευών και ζωγραφικής.</p></div><div className="pcal-avatar" aria-hidden="true">🐻🌍</div></header>
  <div className="pcal-options">
   <label>Περιοχή (επιλογή ενηλίκου)<select value={region} onChange={e=>setRegion(e.target.value as RegionKey)}>{Object.entries(REGIONS).map(([k,v])=><option value={k} key={k}>{v.label}</option>)}</select></label>
   <label>Ηλικία<select value={age} onChange={e=>setAge(Number(e.target.value))}>{["2–3","3–4","4–5","5–6"].map((x,i)=><option value={i} key={x}>{x} ετών</option>)}</select></label>
   <button type="button" onClick={()=>{setMonth(current.month);setYear(current.year);setPicked(current.day);setPreviewNow(true)}}>📍 Σήμερα στην Ελλάδα</button>
  </div>
  <div className="pcal-moment"><span><Sun size={20}/> {context.season}</span><span><Clock size={20}/> {previewNow?context.daypart:"Προεπισκόπηση ημέρας"}</span><span><MapPin size={20}/> {context.region.label}</span></div>
  <div className="pcal-layout">
   <div className="pcal-board"><div className="pcal-monthhead"><button type="button" onClick={()=>changeMonth(-1)} aria-label="Προηγούμενος μήνας">‹</button><h2>{greekMonths[month-1]} {year}</h2><button type="button" onClick={()=>changeMonth(1)} aria-label="Επόμενος μήνας">›</button></div>
    <div className="pcal-grid">{DAYS.map(d=><strong key={d}>{d}</strong>)}{cells.map((d,i)=>d<1||d>daysInMonth?<span key={"blank"+i}/>:<button type="button" key={d} aria-pressed={picked===d} className={(items.some(e=>e.day===d)?"has-event ":"")+(picked===d?"chosen":"")} onClick={()=>{setPicked(d);setPreviewNow(false)}}><b>{d}</b><small>{items.find(e=>e.day===d)?.emoji||""}</small></button>)}</div>
    <div className="pcal-legend"><span>🟡 Ημερομηνία με εκπαιδευτική εκδήλωση</span><span>Μόνο παιδαγωγικά κατάλληλες επιλεγμένες ημέρες</span></div>
    {year!==2026&&<p className="pcal-note">Οι κινητές ορθόδοξες εορτές έχουν ελεγχθεί μόνο για το 2026 και δεν προβάλλονται σε άλλα έτη χωρίς επαλήθευση.</p>}
   </div>
   <aside className="pcal-day"><h2>{picked||1} {greekMonths[month-1]}</h2>
    {activeEvent.length?activeEvent.map(e=><div key={e.id} className="pcal-event"><span>{e.emoji}</span><div><small>{e.type==="holiday"?"Ελληνική εορτή":e.type==="international"?"Παγκόσμια ημέρα":"Εκπαιδευτική επέτειος"}</small><strong>{e.title}</strong><p>{e.activity}</p>{e.source&&<a href={e.source} target="_blank" rel="noreferrer">Επίσημη πηγή ↗</a>}</div></div>):<p>Δεν υπάρχει καταχωρισμένη επέτειος εδώ. Το πρόγραμμα ακολουθεί την εποχή και το περιβάλλον.</p>}
    <div className="pcal-preview"><h3>Ο Πισιπούκ προτείνει</h3><p><Gamepad2 size={18}/> {suggested.game}</p><p><Palette size={18}/> {suggested.drawing}</p><p><Scissors size={18}/> {suggested.craft}</p><p><BookOpen size={18}/> {suggested.story}</p><p>🌱 {suggested.ageText}</p></div>
   </aside>
  </div>
  <div className="pcal-awareness"><h2>Ηλικιακή, χρονική και χωρική προσαρμογή</h2><p>Για την ηλικία {["2–3","3–4","4–5","5–6"][age]} ετών: {suggested.ageText}. Το τοπίο είναι «{context.region.scene}». Πρόταση χωρίς οθόνη: {suggested.outdoor}.</p>
  <p><strong>Ασφάλεια:</strong> δεν χρησιμοποιούμε GPS, IP geolocation, στοιχεία παιδιών ή πρόβλεψη πραγματικού καιρού. Η εποχή και η ώρα προκύπτουν από τη ζώνη Europe/Athens· ο τόπος επιλέγεται από ενήλικο. Οι προτάσεις επιλέγονται από εγκεκριμένες θεματικές, όχι από ανεξέλεγκτη ζωντανή AI παραγωγή.</p></div>
 </section>;
}
