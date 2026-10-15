import {useState} from "react";
import {Link} from "@tanstack/react-router";
import {ArrowRight, BookOpen, Brain, Heart, Palette} from "lucide-react";
import {gamesForAge} from "./curriculum";
import {curateGames,dayContext} from "../context/awareness";
import {useLearningContext} from "../context/useLearningContext";
import "./catalog.css";
const PAGES=[
 {name:"Εξερευνώ",desc:"Ανακαλύπτω, ταξινομώ και παρατηρώ",I:BookOpen},
 {name:"Σκέφτομαι",desc:"Μοτίβα, λογική, φροντίδα και δημιουργία",I:Brain},
 {name:"Ανακαλύπτω",desc:"Κίνηση, ήχοι, χώρος και συγκρίσεις",I:Palette},
 {name:"Δημιουργώ",desc:"Συναισθήματα, ιστορίες και φαντασία",I:Heart}
];
const ICONS=["🫧","🍎","🧠","🌱","🔢","🌈","🦋","💛","🌻","🧱","🥁","🗺️","🎵","↔️","☀️","⚖️","📖","🚦","➕","🎨"];
export function GameCatalog({age,ageKey}:{age:number;ageKey:string}){
 const [page,setPage]=useState(0);
 const {today,place}=useLearningContext();
 const all=gamesForAge(age);
 const games=all.slice(page*5,page*5+5);
 const context=dayContext(today,place);
 const featured=curateGames(today,place,age).slice(0,3).map(i=>all[i]);
 const url="/pisipouk-v2-staging/ages/"+ageKey;
 return <section className="pgc-catalog" aria-label="Τα 20 εκπαιδευτικά μου παιχνίδια">
  <div className="pgc-heading"><div><span>80 ΕΚΠΑΙΔΕΥΤΙΚΕΣ ΕΜΠΕΙΡΙΕΣ · 20 ΑΝΑ ΗΛΙΚΙΑ</span><h2>Διάλεξε το παιχνίδι σου</h2><p>Κάθε δραστηριότητα έχει ξεχωριστό σκοπό. Μπορείς πάντα να γυρίσεις εδώ.</p></div><strong>{String(page*5+1).padStart(2,"0")}–{String(page*5+5).padStart(2,"0")} / 20</strong></div>
  <div className="pgc-today">
   <div><span>🌱 ΠΡΟΤΕΙΝΟΜΕΝΑ ΣΗΜΕΡΑ · {context.region.name}</span><strong>{context.featured?.name||context.season}</strong></div>
   <div className="pgc-today-games">{featured.map(g=><Link key={g.id} to={g.index===0?url+"/game":url+"/play/"+g.index}>{g.title}<ArrowRight size={15}/></Link>)}</div>
  </div>
  <div className="pgc-tabs" role="group" aria-label="Ομάδες παιχνιδιών">{PAGES.map((p,i)=><button key={p.name} type="button" aria-pressed={page===i} onClick={()=>setPage(i)} className={page===i?"selected":""}><p.I size={20}/><span>{p.name}</span></button>)}</div>
  <div className="pgc-intro">{PAGES[page].desc}</div>
  <div className="pgc-grid">{games.map(g=><Link key={g.id} to={g.index===0?url+"/game":url+"/play/"+g.index} className="pgc-card"><span className="pgc-card-art">{ICONS[g.index]}</span><div><small>ΠΑΙΧΝΙΔΙ {String(g.index+1).padStart(2,"0")}</small><strong>{g.title}</strong><span>{g.objective}</span></div><ArrowRight className="pgc-arrow" size={20}/></Link>)}</div>
  <div className="pgc-page-buttons"><button type="button" disabled={page===0} onClick={()=>setPage(p=>Math.max(0,p-1))}>← Προηγούμενα</button><span>Ομάδα {page+1} από 4</span><button type="button" disabled={page===3} onClick={()=>setPage(p=>Math.min(3,p+1))}>Επόμενα →</button></div>
 </section>;
}
