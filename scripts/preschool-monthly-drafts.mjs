#!/usr/bin/env node
/** Unpublished monthly DeepSeek draft generator for PISIPOUK. NEVER auto-publishes. */
import fs from "node:fs/promises";
import path from "node:path";
const arg=process.argv.find(x=>/^\d{4}-(0[1-9]|1[0-2])$/.test(x));
if(!arg){console.error("Usage: node scripts/preschool-monthly-drafts.mjs YYYY-MM [--dry-run]");process.exit(2)}
const dry=process.argv.includes("--dry-run"),secret=process.env.DEEPSEEK_API_KEY;
const model=process.env.DEEPSEEK_MODEL||"deepseek-flash";
const themes=[
 "χειμώνας και φροντίδα","φιλία και συναισθήματα","σποράκια και άνοιξη","πρωινά της άνοιξης",
 "επικονιαστές και λουλούδια","θάλασσα και ασφάλεια","ήλιος και νερό","ταξίδια και χάρτες",
 "σχολείο και νέες φιλίες","πρωτοβρόχια, ελιά και ελληνική σημαία χωρίς σκηνές βίας",
 "φθινοπωρινό δάσος","καλοσύνη, προσφορά και χειμερινές γιορτές"
];
const topic=themes[Number(arg.slice(5))-1];
const ageGroups=["2-3","3-4","4-5","5-6"],kinds=[["games",20],["patterns",20],["crafts",10],["stories",10]];
const root=path.resolve("content/preschool/drafts",arg);
if(dry){console.log(JSON.stringify({month:arg,topic,ageGroups,requests:16,plannedDrafts:240,format:"textual ideas / print and art briefs ONLY",automaticPublishing:false},null,2));process.exit(0)}
if(!secret){console.error("DEEPSEEK_API_KEY is required as a secure server environment secret.");process.exit(2)}
for(const age of ageGroups){
 for(const [kind,total] of kinds){
  const dest=path.join(root,age,kind+".json");
  try{await fs.access(dest);console.log("Preserving existing draft: "+dest);continue}catch{}
  const instructions={
   games:"Describe different child actions, outcomes, sensory gameplay, pedagogy, animation reactions and no ranking.",
   patterns:"Describe original A4 age-specific SVG coloring briefs with line-art details and broad coloring regions. Ideas ONLY, not actual art files.",
   crafts:"Describe material list, exactly four distinct visual process steps, cutout A4 pattern brief and adult safety.",
   stories:"Describe original Greek-language narrative, 4-8 illustrated scenes, supportive feelings and a meaningful alternative ending."
  }[kind];
  const example={activities:[{title:"title",goal:"learning objective",instructions:"adult or child instructions",visualScene:"visual art direction",safety:"safety rules"}]};
  const prompt=[
   "Output strictly valid JSON only, in the shape of",JSON.stringify(example),".",
   "Create exactly",total,"distinct original",kind,"drafts in Greek for age",age,
   "with seasonal theme:",topic,".",instructions,
   "Each activity must contain at least title, goal, instructions, visualScene, safety strings.",
   "Keep choices child-led, strengthen self-regulation and executive function without clinical claims, timed pressure, shame, streaks or addictive loops.",
   "No copyright copying from commercial games or third-party printables, no personal child data.",
   "They are drafts for educator and illustrator approval, not published content."
  ].join(" ");
  const request=await fetch("https://api.deepseek.com/chat/completions",{
   method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+secret},
   body:JSON.stringify({model,stream:false,response_format:{type:"json_object"},max_tokens:8000,
    messages:[{role:"system",content:"Write strictly valid JSON for Greek preschool curriculum drafts. Do not publish."},{role:"user",content:prompt}]})
  });
  if(!request.ok)throw Error("DeepSeek API returned "+request.status+" for "+age+"/"+kind);
  const payload=await request.json();
  if(payload.choices?.[0]?.finish_reason==="length")throw Error("Incomplete model output for "+age+"/"+kind);
  const raw=payload.choices?.[0]?.message?.content;
  if(typeof raw!=="string"||!raw.trim())throw Error("Empty content for "+age+"/"+kind);
  const parsed=JSON.parse(raw);
  if(!Array.isArray(parsed.activities)||parsed.activities.length!==total)throw Error("Wrong draft count for "+age+"/"+kind);
  for(const a of parsed.activities){
   if(["title","goal","instructions","visualScene","safety"].some(k=>typeof a?.[k]!=="string"||a[k].trim().length<5)){
    throw Error("Draft lacks required editorial fields: "+age+"/"+kind);
   }
  }
  await fs.mkdir(path.dirname(dest),{recursive:true});
  await fs.writeFile(dest,JSON.stringify({
   month:arg,age,kind,topic,model,status:"draft",approved:false,publishable:false,
   generatedAt:new Date().toISOString(),rights:"Unreviewed original briefs, no ready-to-use assets.",
   activities:parsed.activities
  },null,2)+"\n");
  console.log("Unpublished draft prepared: "+dest);
 }
}
console.log("Draft generation complete. NO deployment or publication occurred.");
