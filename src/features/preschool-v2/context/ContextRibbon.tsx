import {Link} from "@tanstack/react-router";
import {CalendarDays,MapPin,ArrowRight} from "lucide-react";
import {dayContext} from "./awareness";
import {useLearningContext} from "./useLearningContext";
import "./context-ribbon.css";
export function ContextRibbon({age}:{age?:number}){
 const {today,place}=useLearningContext(),context=dayContext(today,place);
 return <section className="pwc-ribbon" aria-label="Σήμερα στον Πισιπούκ">
  <div className="pwc-ribbon-symbol">{context.featured?.icon||(context.season==="Φθινόπωρο"?"🍁":context.season==="Χειμώνας"?"❄️":context.season==="Άνοιξη"?"🌷":"☀️")}</div>
  <div className="pwc-ribbon-copy"><small><CalendarDays size={14}/> {today.split("-").reverse().join("/")} · {context.season} <MapPin size={14}/> {context.region.name}</small>
   <strong>{context.featured?.name||"Η εποχή στον κόσμο μας"}</strong>
   <span>{context.featured?.description||context.region.note}</span>
  </div>
  <Link to="/pisipouk-v2-staging/adults/monthly" title="Άνοιξε το εσωτερικό εκπαιδευτικό ημερολόγιο">
   <CalendarDays size={19}/> Ημερολόγιο <ArrowRight size={17}/>
  </Link>
 </section>;
}
