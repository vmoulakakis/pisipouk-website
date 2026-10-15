import {useMemo,useState} from "react";
import {Link} from "@tanstack/react-router";
import {ArrowLeft,ArrowRight,CalendarDays,MapPin,BookOpen,Palette,Scissors,Gamepad2} from "lucide-react";
import {calendarYear,curateGames,curateItems,dayContext,eventsInMonth,PLACES,regionById,type PlaceKey} from "../context/awareness";
import {useLearningContext} from "../context/useLearningContext";
import {gamesForAge} from "../games/curriculum";
import {CRAFTS,PATTERNS} from "../library/studioContent";
import {STORIES} from "../library/story-data";
import "./calendar.css";

const weekdays=["Δε","Τρ","Τε","Πε","Πα","Σα","Κυ"];
const ageCodes=["2-3","3-4","4-5","5-6"];
const shortDate=(y:number,m:number,d:number)=>y+"-"+String(m).padStart(2,"0")+"-"+String(d).padStart(2,"0");
function nextMonth(day:string,offset:number){const m=Number(day.slice(5,7))-1;const y=Number(day.slice(0,4));const d=new Date(Date.UTC(y,m+offset,1));return shortDate(d.getUTCFullYear(),d.getUTCMonth()+1,1);}
export function LearningCalendar(){
 const {today,place,setPlace}=useLearningContext();
 const [selected,setSelected]=useState<string|null>(null);
 const [age,setAge]=useState(0);
 const day=selected||today;
 const year=Number(day.slice(0,4)),month=Number(day.slice(5,7));
 const events=useMemo(()=>eventsInMonth(year,month),[year,month]);
 const context=useMemo(()=>dayContext(day,place),[day,place]);
 const mondayOffset=(new Date(Date.UTC(year,month-1,1)).getUTCDay()+6)%7;
 const daysInMonth=new Date(Date.UTC(year,month,0)).getUTCDate();
 const games=gamesForAge(age);
 const gameRecommendations=curateGames(day,place,age).slice(0,5).map(i=>games[i]);
 const patterns=curateItems(PATTERNS,day,place,5);
 const crafts=curateItems(CRAFTS,day,place,5);
 const stories=curateItems(STORIES,day,place,5);
 const monthLabel=new Intl.DateTimeFormat("el-GR",{month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(Date.UTC(year,month-1,5)));
 const picked=regionById(place);
 const monthJump=(delta:number)=>{const target=nextMonth(day,delta);setSelected(target)};
 return <div className="pwc-calendar">
  <Link to="/pisipouk-v2-staging/" className="pwc-back"><ArrowLeft size={18}/> Ο κόσμος του Πισιπούκ</Link>
  <header className="pwc-heading"><div><span className="pw2-overline">ΕΣΩΤΕΡΙΚΟ ΕΚΠΑΙΔΕΥΤΙΚΟ ΗΜΕΡΟΛΟΓΙΟ · ΕΛΛΑΔΑ</span><h1><CalendarDays/> Το ημερολόγιο των ανακαλύψεων</h1><p>Γιορτές, επιλεγμένες παγκόσμιες ημέρες, εποχές και περιοχές συνδυάζονται σε εκπαιδευτικές προτάσεις ανά ηλικία.</p></div><div className="pwc-current">{context.season} · {picked.icon}</div></header>
  <div className="pwc-layout">
   <section className="pwc-calendar-panel" aria-label="Ημερολόγιο">
    <div className="pwc-cal-navigation"><button type="button" onClick={()=>monthJump(-1)} aria-label="Προηγούμενος μήνας">‹</button><h2>{monthLabel}</h2><button type="button" onClick={()=>monthJump(1)} aria-label="Επόμενος μήνας">›</button></div>
    <div className="pwc-grid" role="grid" aria-label="Ημερολόγιο "+monthLabel}>
     {weekdays.map(x=><span className="pwc-weekday" key={x} role="columnheader">{x}</span>)}
     {Array.from({length:mondayOffset},(_,i)=><span key={"blank"+i} aria-hidden="true"/>)}
     {Array.from({length:daysInMonth},(_,i)=>{const date=shortDate(year,month,i+1),todayEvents=events.filter(e=>e.date===date),first=todayEvents[0];return <button role="gridcell" key={date} type="button" onClick={()=>setSelected(date)} aria-label={(i+1)+" "+monthLabel+(todayEvents.length?": "+todayEvents.map(e=>e.name).join(", "):"")} aria-selected={day===date} className={(day===date?"chosen ":"")+(date===today?"now ":"")+(first?"has-event":"")}>
       <span>{i+1}</span>{first&&<span className="pwc-day-icon" title={first.name}>{first.icon}</span>}{todayEvents.length>1&&<small>+{todayEvents.length-1}</small>}
      </button>})}
    </div>
    <div className="pwc-cal-actions"><button type="button" onClick={()=>setSelected(today)}>Σήμερα · {today.split("-").reverse().join("/")}</button><span>{events.length} επιλεγμένα γεγονότα τον μήνα</span></div>
    <div className="pwc-events">{events.map(ev=><button type="button" key={ev.id} onClick={()=>setSelected(ev.date)} className={ev.date===day?"selected":""}><span>{ev.icon} {ev.date.slice(8,10)}/{ev.date.slice(5,7)}</span><strong>{ev.name}</strong><small>{ev.kind==="greek-holiday"?"Ελληνική αργία":ev.kind==="greek-observance"?"Ελληνική εορτή/παράδοση":ev.kind==="international"?"Παγκόσμια ημέρα":"Επετειακή ημέρα"}</small></button>)}</div>
   </section>
   <div className="pwc-context">
    <section className="pwc-region-panel"><h2><MapPin size={21}/> Περιοχή της δραστηριότητας</h2><p>Επιλέγεται από ενήλικο. Δεν χρησιμοποιείται GPS ή ακριβής τοποθεσία παιδιού.</p>
     <div className="pwc-regions" role="group" aria-label="Επιλογή ευρύτερης περιοχής">{PLACES.map(p=><button key={p.id} type="button" aria-pressed={place===p.id} className={place===p.id?"selected":""} onClick={()=>setPlace(p.id)}>{p.icon}<span>{p.name}</span></button>)}</div>
     <p className="pwc-place-description">{picked.icon} {picked.note}</p>
     <div className="pwc-landmarks">{picked.symbols.map((s,i)=><span key={i}>{s}</span>)}</div>
    </section>
    <section className="pwc-focus"><span className="pw2-overline">ΕΚΠΑΙΔΕΥΤΙΚΗ ΕΣΤΙΑΣΗ · {day.split("-").reverse().join("/")}</span><h2>{context.featured?context.featured.icon+" "+context.featured.name:"🌿 "+context.season}</h2><p>{context.narrative}</p>{context.featured&&<div className="pwc-focus-link"><a href={context.featured.source} rel="noopener noreferrer" target="_blank">Επίσημη πηγή ημερομηνίας ↗</a><small>{context.featured.date===day?"Σήμερα":"Προσεχώς: "+context.featured.date.split("-").reverse().join("/")}</small></div>}
     <p><strong>Μικρή ερώτηση προς το παιδί:</strong> {context.featured?.prompt||"Τι παρατηρούμε στην εποχή αυτή;"}</p>
     <div className="pwc-offline"><b>Χωρίς οθόνη</b><span>{context.offline}</span></div>
    </section>
   </div>
  </div>
  <section className="pwc-recs"><div className="pwc-recs-head"><div><span className="pw2-overline">ΔΙΑΘΕΜΑΤΙΚΟ ΠΡΟΓΡΑΜΜΑ</span><h2>Προτάσεις για {["2–3","3–4","4–5","5–6"][age]} ετών</h2></div><div className="pwc-age" role="group" aria-label="Ηλικιακή ομάδα">{ageCodes.map((a,i)=><button key={a} type="button" aria-pressed={age===i} onClick={()=>setAge(i)}>{a.replace("-","–")}</button>)}</div></div>
   <div className="pwc-recommend-grid">
    <article><h3><Gamepad2 size={20}/> Εκπαιδευτικά παιχνίδια</h3>{gameRecommendations.map(g=><Link key={g.id} to={"/pisipouk-v2-staging/ages/"+ageCodes[age]+(g.index===0?"/game":"/play/"+g.index)}>{g.title}<ArrowRight size={16}/></Link>)}</article>
    <article><h3><Palette size={20}/> Ζωγραφιές και πατρόν</h3>{patterns.map(p=><div key={p.id}>{p.title}</div>)}<Link to={"/pisipouk-v2-staging/ages/"+ageCodes[age]+"/patterns"}>Άνοιξε το Ατελιέ <ArrowRight size={16}/></Link></article>
    <article><h3><Scissors size={20}/> Κατασκευές</h3>{crafts.map(c=><div key={c.id}>{c.title}</div>)}<Link to={"/pisipouk-v2-staging/ages/"+ageCodes[age]+"/crafts"}>Άνοιξε τις κατασκευές <ArrowRight size={16}/></Link></article>
    <article><h3><BookOpen size={20}/> Παραμύθια</h3>{stories.map(s=><div key={s.title}>{s.title}</div>)}<Link to={"/pisipouk-v2-staging/ages/"+ageCodes[age]+"/stories"}>Άνοιξε τη βιβλιοθήκη <ArrowRight size={16}/></Link></article>
   </div>
   <p className="pwc-editorial-note">Οι προτάσεις κατατάσσουν ήδη υπάρχον και ελεγμένο ως προς την ημερομηνία θεματικό υλικό, δεν παράγουν από μόνες τους νέο παιχνίδι, νέα γραφικά ή νέα πατρόν. {context.disclaimer} Οι διαφορετικές κλιματικές συνθήκες κάθε περιοχής δεν αποτελούν πρόγνωση.</p>
  </section>
 </div>;
}
