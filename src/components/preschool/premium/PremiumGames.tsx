import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Compass, Heart, Play, RotateCcw, Sparkles, Volume2, VolumeX } from "lucide-react";
import { DOMAINS, GAME_MISSIONS_COUNT, cardArt, challengeSignature, makeChallenge, type Challenge, type Choice, type DomainId } from "./learningEngine";
import { type AgeBand } from "./illustrationAtlas";
import { speak } from "../world/Game";
import "./premium.css";
const MOTION_SAFE = typeof window!=="undefined"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const TONES:Record<string,number>={red:329.63,blue:392,yellow:523.25};
function PlayArt({id,large=false}:{id:string;large?:boolean}){
 return <svg className={large?"premium-game-art premium-game-art-large":"premium-game-art"} viewBox="0 0 400 400" aria-hidden="true" dangerouslySetInnerHTML={{__html:cardArt(id)}}/>;
}
function OptionArt({option}:{option:Choice}){
 if(option.color)return <span className="premium-color-orb" style={{background:option.color}}/>;
 if(option.shape)return <span className={"premium-shape premium-shape-"+option.shape}/>;
 if(option.motif)return <PlayArt id={option.motif}/>;
 if(option.emoji)return <span className="premium-emotion">{option.emoji}</span>;
 return <span className="premium-number">{option.label}</span>;
}
function TraceChallenge({challenge,onSuccess}:{challenge:Challenge;onSuccess:()=>void}){
 const [trace,setTrace]=useState<{x:number;y:number}[]>([]);
 const drawing=useRef(false);const seen=useRef(new Set<number>());
 const paths:Record<string,{d:string;points:[number,number][]}>={
 wave:{d:"M35 180 C95 55 145 305 200 180 S310 55 365 180",points:Array.from({length:61},(_,i)=>{const t=i/60;return [35+330*t,180-85*Math.sin(t*4*Math.PI)] as [number,number];})},
 circle:{d:"M200 52 A125 125 0 1 1 199.9 52",points:Array.from({length:61},(_,i)=>{const t=2*Math.PI*i/60-Math.PI/2;return [200+125*Math.cos(t),177+125*Math.sin(t)] as [number,number];})},
 zigzag:{d:"M40 310 L116 60 L191 310 L269 60 L360 310",points:Array.from({length:61},(_,i)=>{const t=i/60*4,k=Math.min(3,Math.floor(t)),f=t-k;return [40+320*(i/60),k%2===0?310-250*f:60+250*f] as [number,number];})},
 loop:{d:"M56 210 C55 20 342 20 342 210 S70 375 56 210",points:Array.from({length:61},(_,i)=>{const t=i/60*2*Math.PI;return [200+140*Math.cos(t),205+125*Math.sin(t)] as [number,number];})},
 mountain:{d:"M30 320 L115 95 L190 300 L278 80 L370 320",points:Array.from({length:61},(_,i)=>{const t=i/60*4,k=Math.min(3,Math.floor(t)),f=t-k;const y=[320,95,300,80,320];return [30+340*i/60,y[k]+(y[k+1]-y[k])*f] as [number,number];})}
 };
 const p=paths[challenge.correct]||paths.wave;
 useEffect(()=>{setTrace([]);seen.current.clear();},[challenge.key]);
 const coords=(e:PointerEvent<SVGSVGElement>)=>{const rect=e.currentTarget.getBoundingClientRect();return {x:(e.clientX-rect.left)*400/rect.width,y:(e.clientY-rect.top)*400/rect.height};};
 const move=(e:PointerEvent<SVGSVGElement>)=>{if(!drawing.current)return;const pos=coords(e);setTrace(v=>[...v.slice(-850),pos]);p.points.forEach(([x,y],i)=>{if(Math.hypot(x-pos.x,y-pos.y)<42)seen.current.add(i);});if(seen.current.size>=38){drawing.current=false;onSuccess();}};
 return <div className="premium-trace-wrap"><div className="premium-trace-heading">Ακολούθησε τα φωτεινά αστεράκια με το δάχτυλό σου!</div><svg viewBox="0 0 400 400" className="premium-trace-stage" role="img" aria-label="Διαδραστική διαδρομή προγραφής" onPointerDown={e=>{drawing.current=true;e.currentTarget.setPointerCapture(e.pointerId);move(e);}} onPointerMove={move} onPointerUp={()=>{drawing.current=false;}} onPointerCancel={()=>{drawing.current=false;}}>
 <defs><linearGradient id="trace-glow" x1="0" x2="1"><stop stopColor="#ea9a7c"/><stop offset="1" stopColor="#b887e3"/></linearGradient></defs>
 <path d={p.d} fill="none" stroke="#e7d8f5" strokeWidth="56" strokeLinecap="round"/><path d={p.d} fill="none" stroke="white" strokeDasharray="3 19" strokeWidth="10" strokeLinecap="round"/>
 {p.points.filter((_,i)=>i%5===0).map(([x,y],i)=><circle key={i} cx={x} cy={y} r="7" fill="#9a7bd5" opacity={seen.current.has(i*5)?0.2:0.9}/>)}
 <polyline points={trace.map(x=>x.x+","+x.y).join(" ")} fill="none" stroke="url(#trace-glow)" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
 <circle cx={p.points[0][0]} cy={p.points[0][1]} r="20" fill="#79c39b" stroke="white" strokeWidth="5"/><text x={p.points[0][0]} y={p.points[0][1]+6} textAnchor="middle" fontSize="22">★</text>
 </svg><p>Πήγαινε με τον δικό σου ρυθμό. Δεν χρειάζεται τέλεια γραμμή.</p></div>;
}
function RhythmChallenge({challenge,onSuccess}:{challenge:Challenge;onSuccess:()=>void}){
 const [progress,setProgress]=useState(0);const [active,setActive]=useState("");const [message,setMessage]=useState("Άκου πρώτα τη μουσική!");
 const ctx=useRef<AudioContext|null>(null);const timers=useRef<number[]>([]);
 useEffect(()=>{setProgress(0);setMessage("Άκου πρώτα τη μουσική!");return ()=>{timers.current.forEach(clearTimeout);if(ctx.current){void ctx.current.close();ctx.current=null;}};},[challenge.key]);
 const note=(id:string)=>{try{const AudioCtx=window.AudioContext;ctx.current ||=new AudioCtx();const audio=ctx.current;void audio.resume();const o=audio.createOscillator(),gain=audio.createGain();o.type="sine";o.frequency.value=TONES[id]||440;gain.gain.setValueAtTime(0.0001,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.16,audio.currentTime+.015);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.26);o.connect(gain).connect(audio.destination);o.start();o.stop(audio.currentTime+.28);}catch{setMessage("Η συσκευή δεν υποστηρίζει ήχο. Ακολούθησε τα φωτεινά χρώματα.");}};
 const play=()=>{timers.current.forEach(clearTimeout);challenge.sequence.forEach((id,i)=>{timers.current.push(window.setTimeout(()=>{setActive(id);note(id);},i*420));});timers.current.push(window.setTimeout(()=>setActive(""),challenge.sequence.length*420));};
 const tap=(id:string)=>{note(id);if(challenge.sequence[progress]===id){if(progress+1===challenge.sequence.length){onSuccess();setMessage("Τέλειο! Έφτιαξες τον δικό σου ρυθμό.");}else{setProgress(v=>v+1);setMessage("Συνέχισε!");}}else{setProgress(0);setMessage("Δεν πειράζει! Άκου ξανά και δοκίμασε.");}};
 return <div className="premium-rhythm"><button className="premium-listen" onClick={play}><Play/> Άκου τον ρυθμό</button><div className="premium-note-track">{challenge.sequence.map((n,i)=><span key={i} style={{background:{"red":"#f99c8a","blue":"#98c3f1","yellow":"#f7d77b"}[n]}} className={active===n?"premium-note-flash":""}>♪</span>)}</div><div className="premium-music-buttons">{["red","blue","yellow"].map((id,i)=><button key={id} className={"premium-music-key premium-music-"+id} onClick={()=>tap(id)} aria-label={"Νότα "+(i+1)}>♪</button>)}</div><p role="status">{message}</p><p>Σωστές νότες: {progress} από {challenge.sequence.length}</p></div>;
}
function StoryChallenge({challenge,onSuccess}:{challenge:Challenge;onSuccess:()=>void}){
 const [progress,setProgress]=useState(0);const [message,setMessage]=useState("Διάλεξε ποια εικόνα συμβαίνει πρώτη.");
 useEffect(()=>{setProgress(0);setMessage("Διάλεξε ποια εικόνα συμβαίνει πρώτη.");},[challenge.key]);
 const choose=(c:Choice)=>{const target=challenge.sequence[progress];if(c.motif===target){if(progress===2){onSuccess();setMessage("Η ιστορία ολοκληρώθηκε!");}else{setProgress(v=>v+1);setMessage("Ωραία! Τώρα βρες το επόμενο μέρος.");}}else setMessage("Δοκίμασε μια άλλη σειρά. Τι έγινε πρώτα;");};
 return <div className="premium-story"><div className="premium-story-progress">Βήμα {Math.min(progress+1,3)} από 3 — {["Αρχή","Μέση","Τέλος"][Math.min(progress,2)]}</div><div className="premium-options">{challenge.choices.map((c,i)=><button key={i} className="premium-option-card" onClick={()=>choose(c)}><OptionArt option={c}/><b>Σκηνή {i+1}</b></button>)}</div><p role="status">{message}</p></div>;
}
function RegularGame({challenge,onSuccess,onWrong}:{challenge:Challenge;onSuccess:()=>void;onWrong:()=>void}){
 return <><div className="premium-game-scene">{challenge.domain==="count"?<div className="premium-count-objects">{challenge.objects.map((id,i)=><span key={i}><PlayArt id={id}/></span>)}</div>:
 challenge.domain==="patterns"?<div className="premium-pattern-scene">{challenge.objects.map((id,i)=><PlayArt key={i} id={id}/>)}<span className="premium-mystery">?</span></div>:
 <div className="premium-stage-character"><PlayArt id={challenge.domain==="colors"?"butterfly":challenge.domain==="shapes"?"house":challenge.domain==="feelings"?"bear":challenge.domain==="language"?"owl":"tree"} large/></div>}</div>
 <div className="premium-options">{challenge.choices.map(choice=><button key={choice.id} className="premium-option-card" onClick={()=>choice.id===challenge.correct?onSuccess():onWrong()} aria-label={choice.label}><OptionArt option={choice}/><b>{choice.label}</b></button>)}</div></>;
}
export function PremiumGames({age}:{age:AgeBand}){
 const [domain,setDomain]=useState<DomainId|null>(null);const [mission,setMission]=useState<number|null>(null);
 const [challenge,setChallenge]=useState<Challenge|null>(null);const [solved,setSolved]=useState(false);const [wrong,setWrong]=useState(0);const [status,setStatus]=useState("");
 const [completed,setCompleted]=useState<string[]>([]);
 const catalogue=DOMAINS.filter(d=>d.minAge<=age);const activeDomain=DOMAINS.find(x=>x.id===domain);
 const chooseMission=(id:DomainId,idx:number)=>{setDomain(id);setMission(idx);setSolved(false);setWrong(0);setChallenge(makeChallenge(id,idx,age));setStatus("");};
 const replay=()=>{if(!domain||mission===null)return;const old=challengeSignature(challenge!);let next=makeChallenge(domain,mission,age,challenge?.correct);for(let i=0;i<12&&challengeSignature(next)===old;i++)next=makeChallenge(domain,mission,age,challenge?.correct);setChallenge(next);setSolved(false);setWrong(0);setStatus("");};
 const win=()=>{if(!challenge)return;setSolved(true);setStatus("Το βρήκες! Τώρα φτιάξε μια δική σου ιδέα!");setCompleted(prev=>prev.includes(domain+"-"+mission)?prev:[...prev,domain+"-"+mission]);};
 const wrongAnswer=()=>{setWrong(v=>v+1);setStatus(wrong===0?"Δοκίμασε πάλι. Μπορείς να αγγίξεις κάθε επιλογή.":"Βοήθεια: παρατήρησε τις εικόνες μία μία.");};
 useEffect(()=>{setDomain(null);setMission(null);setChallenge(null);setCompleted([]);},[age]);
 const suggested=useMemo(()=>catalogue.map(x=>({id:x.id,total:x.missions.length})),[age]);
 if(!domain||!activeDomain)return <section className="premium-games"><div className="premium-intro"><span>ΤΟ ΜΕΓΑΛΟ ΧΩΡΙΟ ΤΩΝ ΠΑΙΧΝΙΔΙΩΝ</span><h2>Κάθε παιχνίδι, μια καινούργια περιπέτεια!</h2><p><b>{GAME_MISSIONS_COUNT} εικονογραφημένες αποστολές</b> σε 10 μαθησιακούς κόσμους. Οι ερωτήσεις, τα αντικείμενα και οι θέσεις αλλάζουν στο ξαναπαίξε.</p></div><div className="premium-domain-grid">{catalogue.map(d=><button className="premium-domain-card" key={d.id} onClick={()=>{setDomain(d.id);setMission(null);}}><span className="premium-domain-icon"><PlayArt id={d.art}/></span><small>{d.icon} {d.missions.length} ΑΠΟΣΤΟΛΕΣ</small><strong>{d.title}</strong><span>{d.tagline}</span><b>Εξερευνώ <ArrowRight size={18}/></b></button>)}</div><p className="premium-count">{suggested.reduce((x,y)=>x+y.total,0)} διαθέσιμες αποστολές για την επιλεγμένη ηλικία · χωρίς διαφημίσεις και βαθμολογίες</p></section>;
 return <section className="premium-games">
 <div className="premium-editor-top"><button onClick={()=>{setDomain(null);setMission(null);setChallenge(null);}}><ArrowLeft size={18}/> Οι κόσμοι μου</button><b>{activeDomain.icon} {activeDomain.title}</b><span>Ηλικία {["2–3","3–4","4–5","5–6"][age]}</span></div>
 {mission===null||!challenge?<><div className="premium-intro"><span>ΔΙΑΛΕΓΩ ΤΗ ΔΙΚΗ ΜΟΥ ΠΕΡΙΠΕΤΕΙΑ</span><h2>{activeDomain.title}</h2><p>{activeDomain.tagline} — όλες οι αποστολές έχουν μεταβαλλόμενες δοκιμασίες.</p></div><div className="premium-mission-grid">{activeDomain.missions.map((label,i)=><button key={i} className="premium-mission-card" onClick={()=>chooseMission(domain,i)}><span className="premium-mission-number">{i+1}</span><PlayArt id={activeDomain.art}/><strong>{label}</strong><small>{completed.includes(domain+"-"+i)?"♥ Το εξερεύνησα":"Παίζω τώρα →"}</small></button>)}</div></>:
 <div className="premium-play">
  <div className="premium-play-top"><button onClick={()=>setMission(null)}><ArrowLeft/> Όλες οι αποστολές</button><span>ΑΠΟΣΤΟΛΗ {mission+1} / 10</span><button onClick={replay}><RotateCcw/> Νέος γύρος</button></div>
  <div className="premium-play-paper"><div className="premium-play-head"><span className="premium-game-ribbon"><Sparkles size={17}/> ΜΙΚΡΗ ΑΝΑΚΑΛΥΨΗ</span><h2>{challenge.intro}</h2><p>{challenge.prompt}</p><button className="premium-speak" onClick={()=>speak(challenge.prompt,setStatus)}><Volume2 size={21}/> Άκουσέ το</button></div>
  {solved?<div className="premium-success"><div className="premium-success-art"><PlayArt id={activeDomain.art} large/></div><h3>Μπράβο για την προσπάθειά σου!</h3><p>Θέλεις μία νέα έκπληξη ή διαφορετική αποστολή;</p><div><button className="premium-export-primary" onClick={replay}><RotateCcw/> Νέος διαφορετικός γύρος</button><button onClick={()=>chooseMission(domain,(mission+1)%10)}>Επόμενη αποστολή <ArrowRight/></button></div></div>:
 <>{challenge.domain==="tracing"?<TraceChallenge challenge={challenge} onSuccess={win}/>:challenge.domain==="rhythm"?<RhythmChallenge challenge={challenge} onSuccess={win}/>:challenge.domain==="stories"?<StoryChallenge challenge={challenge} onSuccess={win}/>:<RegularGame challenge={challenge} onSuccess={win} onWrong={wrongAnswer}/>}<p className="premium-game-status" role="status" aria-live="polite">{status||"Παίζουμε με την ησυχία μας, χωρίς πίεση."}</p></>}
  </div><div className="premium-parent-tip"><Heart size={19}/> Μετά το παιχνίδι, δοκιμάστε να βρείτε αντίστοιχα σχήματα, χρώματα ή μοτίβα στο σπίτι σας.</div>
 </div>}
 </section>;
}
