import { trackEvent } from "@/lib/pisipoukApi";
import type { PreschoolAge } from "@/content/virtualPreschoolMedia";

export type PlayMode = "guided" | "open" | "coop";
export type Interaction = "drag"|"tap"|"memory"|"maze"|"trace"|"build"|"story"|"rhythm"|"cause"|"hunt"|"dress"|"sort"|"paint"|"movement";

export type ReviewedVariant = {
  id:string;
  ages:PreschoolAge[];
  title:string;
  prompt:string;
  parentPrompt:string;
  theme:string;
  difficulty:1|2|3;
  interaction:Interaction;
  mode:PlayMode;
  data:Record<string,unknown>;
};

export type GameStat = {
  starts:number; completes:number; retries:number; exits:number;
  totalMs:number; lastPlayed:number; variantsSeen:string[];
};

export type StatsStore = Record<string,GameStat>;
const KEY="pisipouk-v11-stats";

export function readStats():StatsStore{
  try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return{}}
}
function writeStats(s:StatsStore){try{localStorage.setItem(KEY,JSON.stringify(s))}catch{}}
function statFor(s:StatsStore,id:string):GameStat{return s[id]||{starts:0,completes:0,retries:0,exits:0,totalMs:0,lastPlayed:0,variantsSeen:[]}}

export function recordGameEvent(gameId:string,event:"start"|"complete"|"retry"|"exit",meta:{variantId:string;age:PreschoolAge;durationMs?:number;interaction:Interaction;mode:PlayMode}){
  const s=readStats();const x=statFor(s,gameId);
  if(event==="start")x.starts++;
  if(event==="complete")x.completes++;
  if(event==="retry")x.retries++;
  if(event==="exit")x.exits++;
  if(meta.durationMs)x.totalMs+=meta.durationMs;
  x.lastPlayed=Date.now();
  if(!x.variantsSeen.includes(meta.variantId))x.variantsSeen=[...x.variantsSeen,meta.variantId].slice(-30);
  s[gameId]=x;writeStats(s);
  void trackEvent(`preschool_game_${event}`,{gameId,...meta});
}

export function getGameInsight(id:string){
  const x=readStats()[id];
  if(!x)return{completionRate:0,retryRate:0,avgSeconds:0,variants:0,plays:0};
  return{
    completionRate:x.starts?Math.round((x.completes/x.starts)*100):0,
    retryRate:x.starts?Math.round((x.retries/x.starts)*100):0,
    avgSeconds:x.completes?Math.round(x.totalMs/x.completes/1000):0,
    variants:x.variantsSeen.length,plays:x.starts,
  };
}

function hash(s:string){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function ageDifficulty(age:PreschoolAge){return age==="2–3"?1:age==="4–5"?2:3}

export function chooseReviewedVariant(gameId:string,age:PreschoolAge,variants:ReviewedVariant[]):ReviewedVariant{
  const pool=variants.filter(v=>v.ages.includes(age));
  if(!pool.length)throw new Error(`No reviewed variant for ${gameId}/${age}`);
  const stats=readStats()[gameId];const seen=new Set(stats?.variantsSeen||[]);const ideal=ageDifficulty(age);
  const ranked=[...pool].sort((a,b)=>{
    const sa=(seen.has(a.id)?0:30)-Math.abs(a.difficulty-ideal)*5 + (hash(`${gameId}:${a.id}:${new Date().toISOString().slice(0,10)}`)%11);
    const sb=(seen.has(b.id)?0:30)-Math.abs(b.difficulty-ideal)*5 + (hash(`${gameId}:${b.id}:${new Date().toISOString().slice(0,10)}`)%11);
    return sb-sa;
  });
  return ranked[0];
}

export function shuffleReviewed<T>(items:T[],seed:string){
  const out=[...items];let n=hash(seed)||1;
  for(let i=out.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[out[i],out[j]]=[out[j],out[i]]}
  return out;
}

export function boredomSignal(id:string){
  const x=readStats()[id];if(!x||x.starts<3)return"unknown" as const;
  const completion=x.completes/x.starts;const exits=x.exits/x.starts;const retries=x.retries/x.starts;
  if(exits>.45||completion<.3)return"high" as const;
  if(retries>.9||completion<.55)return"medium" as const;
  return"low" as const;
}
