import {useEffect,useMemo,useRef,useState,type MouseEvent,type ReactNode} from "react";
import {Link} from "@tanstack/react-router";
import {ArrowLeft,ArrowRight,Heart,RotateCcw,Volume2,BookOpen} from "lucide-react";
import {gamesForAge,makeGame,monthlyPack,DEVELOPMENT_NOTES} from "./curriculum";
import {dayContext} from "../context/awareness";
import {useLearningContext} from "../context/useLearningContext";
import "./learning-engine.css";

type Props={age:number;ageKey:string;index:number};
const FOOD=["🍎","🍐","🍊","🍇","🍓","🥕","🍋","🍒","🍌","🍉","🫐","🍑"];
const ANIMALS=["🐰","🦋","🐝","🐻","🐢","🐟","🦔","🐦","🐿️","🐈","🐸","🦊"];
const SHAPES=["⭐","💛","🍀","🌼","🌈","🌷"], COLORS=["#efaf53","#80c6e2","#f0a8c8","#add698","#aaa0df"];
const NOTES=[261.63,329.63,392,523.25];
function speak(s:string){if(typeof window==="undefined"||!("speechSynthesis" in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s);u.lang="el-GR";u.rate=.85;window.speechSynthesis.speak(u);}
function note(i:number){if(typeof window==="undefined")return;try{const ctx=new AudioContext();const o=ctx.createOscillator(),v=ctx.createGain();o.type="sine";o.frequency.value=NOTES[i%4];o.connect(v);v.connect(ctx.destination);v.gain.setValueAtTime(.001,ctx.currentTime);v.gain.exponentialRampToValueAtTime(.15,ctx.currentTime+.02);v.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.28);o.start();o.stop(ctx.currentTime+.29);o.onended=()=>{void ctx.close()};}catch{}}
function Control({children,click,active=false,disabled=false}:{children:ReactNode;click:()=>void;active?:boolean;disabled?:boolean}){return <button type="button" disabled={disabled} aria-pressed={active} onClick={click} className={"pgx-control "+(active?"active":"")}>{children}</button>}
function Tip({children}:{children:string}){return <div className="pgx-tip"><strong>{children}</strong><button type="button" onClick={()=>speak(children)} aria-label="Άκου την οδηγία"><Volume2 size={22}/></button></div>}
const PAIRS=[["🐻","🌳"],["🐠","🌊"],["🦋","🌼"],["🐝","🌻"]];
/** 19 distinct game interactions are shared as engines across 4 editorial age adaptations. */
function Mechanic({age,index,month,round}:{age:number;index:number;month:number;round:number}){
 const [number,setNumber]=useState(0),[choice,setChoice]=useState(-1),[marked,setMarked]=useState<number[]>([]),[order,setOrder]=useState<number[]>([]),[phase,setPhase]=useState(0);
 const [pos,setPos]=useState<[number,number]>([0,0]),[message,setMessage]=useState("Δοκίμασε με τον δικό σου ρυθμό. Δεν χρειάζεται να βιαστείς.");
 const [stamps,setStamps]=useState<Array<{x:number;y:number;icon:number}>>([]),[stamp,setStamp]=useState(0);
 const monthData=monthlyPack(new Date(2026,month,15)),m=monthData.objects;
 const fruit=FOOD[(month+round+age)%12],animal=ANIMALS[(month+round+age)%12];
 const goal=Math.min(3+age+(month%2),8),unit=(s:string)=>setMessage(s);
 const feedback=<div className="pgx-feedback" aria-live="polite"><Heart size={18}/>{message}</div>;
 const chosen=(i:number,text:string)=>{setChoice(i);unit(text)};
 const tick=()=>setNumber(n=>n+1);
 const grid=(nodes:ReactNode,cls="")=><div className={"pgx-grid "+cls}>{nodes}</div>;
 switch(index){
 case 1:{const x=[fruit,animal,FOOD[(month+3)%12],ANIMALS[(month+4)%12],FOOD[(month+6)%12],ANIMALS[(month+7)%12]][number%6],isFood=FOOD.includes(x);
  return <><Tip>Βάλε κάθε αντικείμενο στο σωστό καλαθάκι.</Tip><div className="pgx-hero-symbol">{number>=goal?"🌟":x}</div>{grid(["🍎 Φρούτα","🐾 Ζώα"].map((v,i)=><Control key={v} click={()=>{if(number>=goal)return;if((i===0)===isFood){tick();unit(number+1===goal?"Τα ταξινόμησες όλα!":"Το βρήκες! Συνέχισε.")}else unit("Κοίτα προσεκτικά το άλλο καλάθι.")}}>{v}</Control>),"two")}{feedback}</>;
 }
 case 2:{const pairs=age+2;
  const ids=Array.from({length:pairs},(_,i)=>i),base=ids.concat(ids),rotate=(month+round)%base.length,deck=base.slice(rotate).concat(base.slice(0,rotate));
  const a=order.length===2;
  const flip=(i:number)=>{if(marked.includes(deck[i]))return;if(a){setOrder([i]);return;}if(order.includes(i))return;const next=[...order,i];setOrder(next);if(next.length===2){if(deck[next[0]]===deck[i]){setMarked(v=>[...v,deck[i]]);setOrder([]);unit("Θυμήθηκες το ζευγάρι!")}else unit("Θυμόμαστε τις εικόνες και ξαναδοκιμάζουμε.")}};
  return <><Tip>Γύρισε τις κάρτες και βρες τα ζευγάρια.</Tip>{grid(deck.map((v,i)=><Control key={i} active={marked.includes(v)||order.includes(i)} click={()=>flip(i)}>{marked.includes(v)||order.includes(i)?<span className="pgx-emoji">{[fruit,animal,"🦋","🌼","🪁"][v]}</span>:<span className="pgx-emoji">❔</span>}</Control>),"cards")}{feedback}</>;
 }
 case 3:{const seq=[["🌱","Σπόρος"],["💧","Ποτίζω"],["🌿","Βλαστάρι"],["🌼","Λουλούδι"],["🍎","Καρπός"]].slice(0,Math.min(2+age,5));
  return <><Tip>Βάλε τα στάδια στη σωστή σειρά, από την αρχή ως το τέλος.</Tip><div className="pgx-chain">{order.map(i=><span key={i}>{seq[i][0]}</span>)}</div>{grid(seq.map(([e,l],i)=><Control key={i} disabled={order.includes(i)} click={()=>{if(i===order.length){setOrder(v=>[...v,i]);unit(order.length+1===seq.length?"Ολοκλήρωσες την ιστορία!":"Τι θα γίνει μετά;")}else unit("Τι συνέβη πρώτα; Δοκίμασε ξανά.")}}><span className="pgx-emoji">{e}</span><small>{l}</small></Control>),"cards")}{feedback}</>;
 }
 case 4:{return <><Tip>Άγγιξε τα αντικείμενα ένα ένα και μέτρησέ τα.</Tip>{grid(Array.from({length:goal},(_,i)=><Control key={i} active={marked.includes(i)} click={()=>{if(marked.includes(i))return;setMarked(a=>[...a,i]);if(marked.length+1===goal)unit("Μέτρησες όλα τα αντικείμενα!")}}><span className="pgx-emoji">{marked.includes(i)?"✅":fruit}</span></Control>),"cards")}<strong className="pgx-count">{marked.length} / {goal}</strong>{feedback}</>;}
 case 5:{const options=[m[0],m[2]];const target=number%2;
  return <><Tip>Παρατήρησε το μοτίβο και συνέχισε τη σειρά.</Tip><div className="pgx-chain">{Array.from({length:age<2?4:6},(_,i)=>(i+number)%2).map((i,k)=><span key={k}>{options[i]}</span>)}<span>❔</span></div>{grid(options.map((x,i)=><Control key={i} click={()=>{if(i===target){tick();unit("Κατάλαβες πώς επαναλαμβάνεται η σειρά!")}else unit("Δες ποιο αντικείμενο έρχεται μετά.")}}><span className="pgx-emoji">{x}</span></Control>),"two")}{feedback}</>;}
 case 6:{const pair=PAIRS[(month+age)%4],other=PAIRS[(month+age+2)%4][1];
  return <><Tip>Βρες πού ζει ή πού συναντάμε τον φίλο μας.</Tip><div className="pgx-hero-symbol">{pair[0]}</div>{grid([pair[1],other].map((s,i)=><Control key={s} active={choice===i} click={()=>chosen(i,i===0?"Σωστά παρατήρησες τη σχέση!":"Σκέψου πού συναντάμε συνήθως αυτόν τον φίλο.")}><span className="pgx-emoji">{s}</span></Control>),"two")}{feedback}</>;}
 case 7:{const moods=[["😊","Χαρά"],["😢","Λύπη"],["😮","Έκπληξη"],["😌","Ηρεμία"]];
  return <><Tip>Παρατήρησε τα πρόσωπα. Πώς νιώθουν οι φίλοι μας;</Tip><div className="pgx-hero-symbol">{moods[(age+month)%4][0]}</div>{grid(moods.slice(0,age===0?2:4).map(([s,l],i)=><Control key={l} active={choice===i} click={()=>chosen(i,"Σε ευχαριστώ που σκέφτηκες το συναίσθημα "+l.toLowerCase()+". Πώς θα βοηθούσες έναν φίλο;")}><span className="pgx-emoji">{s}</span><b>{l}</b></Control>),"cards")}{feedback}</>;}
 case 8:{return <><Tip>Πότισε λίγο λίγο το φυτό και παρατήρησε πώς μεγαλώνει.</Tip><div className="pgx-grow"><span style={{transform:"scale("+(.6+number/goal*.65)+")"}}>{number<goal/2?"🌱":number<goal?"🌿":"🌻"}</span><span>🪴</span></div><button type="button" className="pgx-action" disabled={number>=goal} onClick={()=>{tick();if(number+1===goal)unit("Το φυτό μεγάλωσε χάρη στη φροντίδα σου!")}}>💧 Ρίχνω λίγο νερό</button>{feedback}</>;}
 case 9:{return <><Tip>Χτίσε τον δικό σου πύργο με διαφορετικά χρωματιστά τουβλάκια.</Tip><div className="pgx-tower">{order.map((i,k)=><span key={k} style={{background:COLORS[i],width:(90+(k%3)*22)+"px"}}/>)}</div>{grid(COLORS.slice(0,age<2?3:5).map((s,i)=><Control key={s} click={()=>{if(order.length<goal){setOrder(v=>[...v,i]);if(order.length+1===goal)unit("Έφτιαξες έναν ολόκληρο πύργο!")}}}><span className="pgx-block" style={{background:s}}/></Control>),"cards")}{feedback}</>;}
 case 10:{const seq=[0,1,0,age>1?2:1].slice(0,age<2?3:4);
  return <><Tip>Άκου τον ρυθμό και επανέλαβε τον με τα μουσικά όργανα.</Tip><button type="button" className="pgx-action" onClick={()=>seq.forEach((x,i)=>window.setTimeout(()=>note(x),i*330))}>🔊 Άκου τον ρυθμό</button>{grid(["🥁","🎹","🔔"].slice(0,age<2?2:3).map((s,i)=><Control key={s} click={()=>{note(i);if(i===seq[order.length]){setOrder(v=>[...v,i]);if(order.length+1===seq.length)unit("Ακολούθησες όλο τον ρυθμό!")}else{setOrder([]);unit("Άκουσε ξανά. Δοκίμασε όσες φορές θέλεις.")}}}><span className="pgx-emoji">{s}</span></Control>),"cards")}<div className="pgx-count">{order.length}/{seq.length} νότες</div>{feedback}</>;}
 case 11:{const side=age<2?3:4,rock=age>1?[1,1]:[-1,-1];
  function move(dr:number,dc:number){const next:[number,number]=[pos[0]+dr,pos[1]+dc];if(next.some(x=>x<0||x>=side)||(next[0]===rock[0]&&next[1]===rock[1])){unit("Αυτό το μονοπάτι είναι κλειστό. Βρες άλλο.");return;}setPos(next);if(next[0]===side-1&&next[1]===side-1)unit("Έφτασες στο σπιτάκι!")}
  return <><Tip>Οδήγησε τον Πισιπούκ στο σπίτι με τα βελάκια.</Tip><div className="pgx-maze" style={{gridTemplateColumns:"repeat("+side+",1fr)"}}>{Array.from({length:side*side},(_,i)=>{const r=Math.floor(i/side),c=i%side;return <span key={i}>{pos[0]===r&&pos[1]===c?"🐻":r===side-1&&c===side-1?"🏡":r===rock[0]&&c===rock[1]?"🪨":"·"}</span>})}</div>{grid([[-1,0,"↑"],[0,-1,"←"],[1,0,"↓"],[0,1,"→"]].map(([dr,dc,s])=><Control key={s} click={()=>move(Number(dr),Number(dc))}>{s}</Control>),"cards")}{feedback}</>;}
 case 12:{const high=(month+age)%2===0;
  return <><Tip>Άκου τον ήχο. Είναι πιο ψηλός ή πιο χαμηλός;</Tip><div className="pgx-hero-symbol">🎼</div><button type="button" className="pgx-action" onClick={()=>note(high?3:0)}>▶ Ακούω τον ήχο</button>{grid(["🐻 Χαμηλός","🐦 Ψηλός"].map((s,i)=><Control key={s} active={choice===i} click={()=>chosen(i,(i===1)===high?"Άκουσες με προσοχή!":"Άκουσε άλλη μια φορά και σύγκρινε τους ήχους.")}>{s}</Control>),"two")}{feedback}</>;}
 case 13:{const label=["πάνω","στο κέντρο","κάτω"][(month+age)%3];const target=(month+age)%3;
  return <><Tip>{"Μετακίνησε το αρκουδάκι "+label+"."}</Tip>{grid(["⬆️ Πάνω","🟡 Κέντρο","⬇️ Κάτω"].map((s,i)=><Control key={s} active={choice===i} click={()=>chosen(i,i===target?"Βρήκες τη σωστή θέση!":"Παρατήρησε ξανά τη θέση.")}>{choice===i?"🧸 ":""}{s}</Control>),"cards")}{feedback}</>;}
 case 14:{const forms=["★","●","▲","■"];const target=(month+age)%(age===0?3:4);
  return <><Tip>Κοίτα το φωτεινό σχήμα και βρες τη σκιά του.</Tip><div className="pgx-light-shape">{forms[target]}</div>{grid(forms.slice(0,age===0?3:4).map((s,i)=><Control key={i} active={choice===i} click={()=>chosen(i,i===target?"Η σκιά ταιριάζει με το σχήμα!":"Κοίτα πάλι την καμπύλη και τις γωνίες.")}><span className="pgx-shadow">{s}</span></Control>),"cards")}{feedback}</>;}
 case 15:{const l=order.filter(i=>i===0).length,r=order.filter(i=>i===1).length;
  return <><Tip>Βάλε αντικείμενα στη ζυγαριά και δες πώς γέρνει.</Tip><div className="pgx-balance"><div className="pgx-beam" style={{transform:"rotate("+Math.max(-16,Math.min(16,(r-l)*8))+"deg)"}}><span>{fruit.repeat(l)}</span><span>{animal.repeat(r)}</span></div><div className="pgx-fulcrum">▲</div></div>{grid(["Αριστερό πιάτο","Δεξί πιάτο"].map((s,i)=><Control key={s} click={()=>{if(order.length<12){setOrder(v=>[...v,i]);unit("Παρατήρησε τι συμβαίνει όταν αλλάζει το βάρος.")}}}>{s}</Control>),"two")}{l===r&&l>0?<div className="pgx-feedback">⚖️ Ισορρόπησες τις δύο πλευρές!</div>:feedback}</>;}
 case 16:{const groups=[[["🐻","Πισιπούκ"],["🐢","χελώνα"],["🐦","πουλάκι"]],[["🌳","στον κήπο"],["🏡","στο χωριό"],[m[month%6],"σε μια νέα εποχιακή περιπέτεια"]],[["🌟","ανακάλυψη"],["🤝","φιλία"],["🎁","έκπληξη"]]];const g=groups[Math.min(2,order.length)];
  return <><Tip>Διάλεξε ήρωα, τόπο και περιπέτεια για το δικό σου παραμύθι.</Tip><div className="pgx-chain">{order.map((i,j)=><span key={j}>{groups[j][i][0]}</span>)}</div>{order.length<3?grid(g.map(([s,l],i)=><Control key={s} click={()=>{setOrder(v=>[...v,i]);if(order.length===2)unit("Έφτιαξες παραμύθι! Μπορείς να το αφηγηθείς με δικά σου λόγια.")}}><span className="pgx-emoji">{s}</span><small>{l}</small></Control>),"cards"):<p className="pgx-tale">{groups[0][order[0]][1]} πήγε {groups[1][order[1]][1]} και έζησε μία {groups[2][order[2]][1]}. Τι έγινε μετά;</p>}{feedback}</>;}
 case 17:{const green=phase%2===0;
  return <><Tip>Παρατήρησε το φανάρι και αποφάσισε πότε να προχωρήσεις.</Tip><div className="pgx-traffic"><span style={{opacity:green?.2:1}}>🔴</span><span style={{opacity:green?1:.2}}>🟢</span></div>{grid(["🚶 Προχωρώ","✋ Περιμένω"].map((s,i)=><Control key={s} click={()=>chosen(i,i===(green?0:1)?"Παρατήρησες προσεκτικά!":"Μπορούμε να περιμένουμε ήρεμα και να ξαναδούμε το φανάρι.")}>{s}</Control>),"two")}<button type="button" className="pgx-action" onClick={()=>setPhase(v=>v+1)}>🚦 Αλλάζω φανάρι</button>{feedback}</>;}
 case 18:{const left=age+1,right=month%3+1,target=left+right;
  return <><Tip>Ένωσε δύο μικρές παρέες και φτιάξε το σύνολό τους.</Tip><div className="pgx-equation"><span>{fruit.repeat(left)}</span><b>+</b><span>{animal.repeat(right)}</span></div><div className="pgx-count">{number} από {target}</div>{grid([["➕ Προσθέτω",1],["➖ Αφαιρώ",-1]].map(([s,delta])=><Control key={s} click={()=>{const v=Math.max(0,Math.min(target,number+Number(delta)));setNumber(v);if(v===target)unit("Έφτιαξες ακριβώς την ίδια ποσότητα!")}}>{s}</Control>),"two")}{feedback}</>;}
 case 19:{const add=(e:MouseEvent<SVGSVGElement>)=>{const b=e.currentTarget.getBoundingClientRect();setStamps(v=>[...v,{x:(e.clientX-b.left)/b.width*500,y:(e.clientY-b.top)/b.height*320,icon:stamp}].slice(-75))};
  const save=()=>{const svg=document.getElementById("pgx-art");if(!svg)return;const blob=new Blob([new XMLSerializer().serializeToString(svg)],{type:"image/svg+xml;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="pisipouk-dimiourgia-"+month+".svg";a.click();window.setTimeout(()=>URL.revokeObjectURL(url),2000)};
  return <><Tip>Διάλεξε σφραγίδα και ζωγράφισε ελεύθερα, χωρίς σωστό ή λάθος.</Tip>{grid(SHAPES.slice(0,age<2?3:6).map((x,i)=><Control key={i} active={stamp===i} click={()=>setStamp(i)}><span className="pgx-emoji">{x}</span></Control>),"cards")}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 320" id="pgx-art" className="pgx-art" role="img" aria-label="Ελεύθερος καμβάς με σφραγίδες" onClick={add}><rect width="500" height="320" fill="#fffdf3"/>{stamps.map((x,i)=><text key={i} fontSize="43" x={x.x} y={x.y} textAnchor="middle">{SHAPES[x.icon]}</text>)}</svg>{grid([<Control key="clear" click={()=>setStamps([])}>Καθαρίζω</Control>,<Control key="save" click={save}>Αποθήκευση SVG</Control>],"two")}{feedback}</>;}
 default:return <p>Η δραστηριότητα δεν είναι διαθέσιμη.</p>;
 }
}
export function EducationalGame({age,ageKey,index}:Props){
 const {today,place}=useLearningContext();
 const context=dayContext(today,place);
 const monthly=monthlyPack(new Date(today+"T12:00:00")),game=makeGame(age,index),[round,setRound]=useState(0);
 if(age<0||age>3||index<1||index>19)return <p>Δεν βρέθηκε παιχνίδι.</p>;
 return <section className="pgx-game" style={{"--pgx-accent":monthly.color} as React.CSSProperties}>
  <div className="pgx-breadcrumb"><Link to={"/pisipouk-v2-staging/ages/"+ageKey}><ArrowLeft size={18}/> Ο κόσμος μου</Link><span>Παιχνίδι {index+1} / 20</span></div>
  <div className="pgx-heading"><div><span className="pw2-overline">{context.featured?.icon||monthly.icon} {context.featured?.name||monthly.name} · {context.season} · {context.region.name}</span><h1>{game.title}</h1><p>{game.objective}</p><p className="pgx-psychology">🌱 {game.psychology}</p><small>{game.duration} · {age===0?"Με ενήλικο":"Προαιρετικά μαζί με ενήλικο"}</small></div><img src="/preschool-world/bear.webp" alt="Πισιπούκ"/></div>
  <div className="pgx-playboard" key={monthly.key+"-"+age+"-"+index+"-"+round}><Mechanic age={age} index={index} month={Number(today.slice(5,7))-1} round={round}/></div>
  <div className="pgx-bottom"><button type="button" onClick={()=>setRound(v=>v+1)}><RotateCcw size={18}/> Ξανά / νέος γύρος</button><span>{DEVELOPMENT_NOTES[age]}</span><Link to={"/pisipouk-v2-staging/ages/"+ageKey+"/play/"+(index===19?1:index+1)}>Επόμενο <ArrowRight size={18}/></Link></div>
  <p className="pgx-offline"><BookOpen size={19}/><span><b>Χωρίς οθόνη · {context.region.name}:</b> {context.offline}</span></p>
  <p className="pgx-qa">Λειτουργικό πρωτότυπο παιχνιδιού. Τα τελικά HD assets, επαγγελματικά Rive animations και ο εκπαιδευτικός έλεγχος παραμένουν σε εκκρεμότητα.</p>
 </section>;
}
