import "./preschool-v16.css";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, Brush, Cuboid, Headphones, Home, Leaf, LockKeyhole, Sparkles, Volume2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import bear from "@/assets/pisipouk-logo.webp";
import exterior from "@/assets/pisipouk-exterior.webp";
import classroom from "@/assets/pisipouk-classroom.webp";
import story from "@/assets/pisipouk-story.webp";
import { AtelierPhysics3D } from "./v16/AtelierPhysics3D";
import { Paint3D } from "./v16/Paint3D";
import { MicroWorld3D } from "./v16/MicroWorld3D";

type Age="2-3"|"3-4"|"4-5"|"5-6";
type Area="home"|"atelier"|"paint"|"world"|"parent";

type EventRow={kind:"open";area:Exclude<Area,"home"|"parent">;age:Age;ts:number};

const AGE:Record<Age,{label:string;hint:string}>={
  "2-3":{label:"2–3",hint:"Ανακαλύπτω"},
  "3-4":{label:"3–4",hint:"Δοκιμάζω"},
  "4-5":{label:"4–5",hint:"Δημιουργώ"},
  "5-6":{label:"5–6",hint:"Σχεδιάζω"},
};

const AREAS={
  atelier:{title:"3D Atelier",spoken:"Πάμε να χτίσουμε και να δοκιμάσουμε τι στέκεται και τι πέφτει.",icon:Cuboid,image:classroom},
  paint:{title:"Ζωντανή Ζωγραφική",spoken:"Πάμε να ζωγραφίσουμε πάνω σε έναν τρισδιάστατο φίλο και να τον ζωντανέψουμε.",icon:Brush,image:story},
  world:{title:"Μαγικό Νησί",spoken:"Πάμε να εξερευνήσουμε το νησί, τον καιρό και τα ζωάκια.",icon:Leaf,image:exterior},
} as const;

function speak(text:string){
  try{
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.lang="el-GR";u.rate=.87;u.pitch=1.05;
    speechSynthesis.speak(u);
  }catch{}
}

function logOpen(area:EventRow["area"],age:Age){
  try{
    const key="pisipouk-v16-events";
    const rows=JSON.parse(localStorage.getItem(key)||"[]") as EventRow[];
    const next=[...rows,{kind:"open" as const,area,age,ts:Date.now()}].slice(-300);
    localStorage.setItem(key,JSON.stringify(next));
  }catch{}
}

function Guide({small=false}:{small?:boolean}){
  return <div className={small?"pv16-guide small":"pv16-guide"} aria-label="Ο Πισιπούκ το αρκουδάκι">
    <span className="halo"/>
    <img src={bear} alt="Ο Πισιπούκ το αρκουδάκι"/>
    <span className="spark s1">✦</span><span className="spark s2">✦</span>
  </div>;
}

function HomeScreen({age,setAge,open}:{age:Age;setAge:(a:Age)=>void;open:(a:EventRow["area"])=>void}){
  const cards=(Object.keys(AREAS) as EventRow["area"][]).filter(a=>age!=="2-3"||a!=="atelier");
  return <>
    <section className="pv16-hero">
      <img className="scene" src={exterior} alt=""/>
      <div className="veil"/>
      <div className="copy">
        <span className="tag"><Sparkles/> ΠΙΣΙΠΟΥΚ • PLAY-BASED 3D PRESCHOOL</span>
        <h1>Αγγίζω.<br/><em>Δοκιμάζω.</em><br/><strong>Ανακαλύπτω.</strong></h1>
        <p>Χωρίς σκορ, χρονόμετρα και «λάθος». Το περιβάλλον απαντά με φυσική, κίνηση, ήχο και φαντασία.</p>
      </div>
      <Guide/>
    </section>

    <section className="pv16-age" aria-label="Ηλικία παιδιού">
      {(Object.keys(AGE) as Age[]).map(a=><button key={a} className={age===a?"on":""} onClick={()=>setAge(a)}><b>{AGE[a].label}</b><span>{AGE[a].hint}</span></button>)}
    </section>

    <section className="pv16-portals">
      {cards.map(id=>{
        const item=AREAS[id],Icon=item.icon;
        return <article key={id} className={"pv16-portal "+id}>
          <button className="visual" onClick={()=>open(id)} aria-label={item.title}>
            <img src={item.image} alt=""/>
            <span className="shade"/>
            <Guide small/>
            <div className="portal-copy"><Icon/><h2>{item.title}</h2><b>ΜΠΑΙΝΩ →</b></div>
          </button>
          <button className="listen" aria-label={"Άκου οδηγία για "+item.title} onClick={()=>speak(item.spoken)}><Volume2/></button>
        </article>
      })}
    </section>

    <section className="pv16-calm-note">
      <Headphones/>
      <div><b>Calm design</b><span>Ήπια χρώματα, αργός ρυθμός, μεγάλα touch targets και φυσική ανατροφοδότηση.</span></div>
    </section>
  </>;
}

function ParentDashboard(){
  const [rows,setRows]=useState<EventRow[]>([]);
  useEffect(()=>{
    try{setRows(JSON.parse(localStorage.getItem("pisipouk-v16-events")||"[]"))}catch{}
  },[]);
  const data=useMemo(()=>{
    return (["atelier","paint","world"] as const).map(area=>({
      name:area==="atelier"?"Κατασκευές":area==="paint"?"Ζωγραφική":"Εξερεύνηση",
      visits:rows.filter(r=>r.area===area).length,
    }));
  },[rows]);
  const total=rows.length;
  const last=rows.at(-1);

  return <section className="pv16-parent">
    <div className="pv16-parent-head">
      <span className="pv16-eyebrow"><LockKeyhole/> LOCAL-FIRST INSIGHT ENGINE</span>
      <h2>Ενδιαφέροντα, όχι βαθμοί.</h2>
      <p>Το dashboard δεν αποθηκεύει όνομα παιδιού ή άλλο PII. Δείχνει μόνο ποιο είδος δημιουργικού παιχνιδιού επιλέγεται περισσότερο σε αυτή τη συσκευή.</p>
    </div>
    <div className="pv16-stats">
      <article><b>{total}</b><span>ανοίγματα εμπειριών</span></article>
      <article><b>{last?AGE[last.age].label:"—"}</b><span>τελευταίο ηλικιακό mode</span></article>
      <article><b>{last?AREAS[last.area].title:"—"}</b><span>τελευταία επιλογή</span></article>
    </div>
    <div className="pv16-chart">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{top:12,right:18,left:-20,bottom:4}}>
          <CartesianGrid strokeDasharray="3 3" vertical={false}/>
          <XAxis dataKey="name"/><YAxis allowDecimals={false}/><Tooltip/>
          <Bar dataKey="visits" radius={[12,12,0,0]}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div className="pv16-parent-principles">
      <article><b>Montessori</b><p>Φυσική συνέπεια και control of error χωρίς τιμωρητικό feedback.</p></article>
      <article><b>Reggio Emilia</b><p>Ανοιχτό atelier, πολλαπλοί τρόποι έκφρασης και περιβάλλον ως τρίτος δάσκαλος.</p></article>
      <article><b>Slow learning</b><p>Χωρίς countdown, coins, streaks ή υπερδιέγερση.</p></article>
      <article><b>Next step</b><p>Τα anonymous interaction events μπορούν αργότερα να τροφοδοτούν ασφαλές adaptive scaffolding.</p></article>
    </div>
  </section>;
}

export function PreschoolV16(){
  const [age,setAge]=useState<Age>("3-4");
  const [area,setArea]=useState<Area>("home");

  const open=(next:EventRow["area"])=>{
    logOpen(next,age);setArea(next);
  };

  return <div className="pv16-app">
    <header className="pv16-top">
      <button className="brand" onClick={()=>setArea("home")}><Guide small/><div><b>Ο Κόσμος του Πισιπούκ</b><small>NEXT-GEN PRESCHOOL LAB</small></div></button>
      <nav>
        <button className={area==="home"?"on":""} onClick={()=>setArea("home")}><Home/><span>Αρχική</span></button>
        <button className={area==="atelier"?"on":""} onClick={()=>open("atelier")} disabled={age==="2-3"}><Cuboid/><span>Atelier</span></button>
        <button className={area==="paint"?"on":""} onClick={()=>open("paint")}><Brush/><span>Ζωγραφική</span></button>
        <button className={area==="world"?"on":""} onClick={()=>open("world")}><Leaf/><span>Κόσμος</span></button>
        <button className={area==="parent"?"on":""} onClick={()=>setArea("parent")}><BarChart3/><span>Γονείς</span></button>
      </nav>
    </header>

    <main className="pv16-main">
      {area==="home"&&<HomeScreen age={age} setAge={setAge} open={open}/>}
      {area==="atelier"&&<AtelierPhysics3D/>}
      {area==="paint"&&<Paint3D/>}
      {area==="world"&&<MicroWorld3D/>}
      {area==="parent"&&<ParentDashboard/>}
    </main>

    {area!=="home"&&<button className="pv16-floating-home" onClick={()=>setArea("home")} aria-label="Πίσω στην αρχική"><Home/></button>}
  </div>;
}
