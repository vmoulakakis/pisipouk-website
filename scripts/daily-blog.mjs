import fs from 'node:fs';
const token = process.env.GITHUB_TOKEN;
if (!token) throw Error('Missing GITHUB_TOKEN');
const file='src/content/blogArticles.ts';
let content=fs.readFileSync(file,'utf8');
const date=new Date().toISOString().slice(0,10);
if(content.includes('publishedAt: "'+date+'"') || content.includes('"publishedAt": "'+date+'"')) {
 console.log('Article for today already exists; skip duplicates.'); process.exit(0);
}
const year=new Date().getUTCFullYear();
const month=new Date().getUTCMonth()+1;
const seasonal=({1:'χειμερινό παιχνίδι',2:'απόκριες και συναισθήματα',3:'άνοιξη και φύση',4:'πασχαλινές οικογενειακές δραστηριότητες',5:'παιχνίδι έξω',6:'καλοκαιρινές μεταβάσεις',7:'καλοκαιρινή ασφάλεια',8:'προετοιμασία για σχολείο',9:'προσαρμογή στον παιδικό σταθμό',10:'φθινόπωρο και δημιουργικό παιχνίδι',11:'γλωσσική ανάπτυξη και παραμύθια',12:'γιορτές και οικογενειακές ρουτίνες'})[month];
const slugs=[...content.matchAll(/slug:\s*"([^"]+)"/g)].map(x=>x[1]);
const system='Είσαι επιστημονικά προσεκτικός Έλληνας επιμελητής προσχολικής αγωγής. Μόνο ελληνικό κείμενο, αποκλειστικά ηλικίες 2,5–6 και γονείς. Μη γράφεις πρόσφατες ειδήσεις ή ανακοινώσεις χωρίς επαληθεύσιμη τρέχουσα πηγή. Όχι ιατρικές διαγνώσεις. Προτίμησε χρηστικές δραστηριότητες χαμηλού κόστους. Επέστρεψε αποκλειστικά ένα JSON object.';
const user=JSON.stringify({task:'Φτιάξε ένα διαφορετικό υψηλής ποιότητας άρθρο 450-650 ελληνικών λέξεων με πρακτικά βήματα, απλό ελκυστικό ύφος, χωρίς παραπλανητικές διαβεβαιώσεις, τίτλο SEO και οργανική λέξη-κλειδί. Μην επαναλάβεις υπάρχον θέμα. Πηγές να είναι αληθινές δημόσιες έγκυρες URL που γνωρίζεις με υψηλή βεβαιότητα (π.χ. CDC NAEYC), χωρίς επινοημένα links.',date,seasonal,existingSlugs:slugs,requiredJsonKeys:['slug','title','seoTitle','metaDescription','excerpt','tag','keywords','intro','sections','faq','sources'],constraints:'slug ascii lowercase hyphen, seoTitle < 70 chars, metaDescription 115-165 chars, sections array each {heading,paragraphs:string[],bullets?:string[]}, faq array {question,answer}, sources array {label,url}; minimum 4 sections; 2 FAQ; minimum 2 sources; no publishedAt fields'});
const response=await fetch('https://models.github.ai/inference/chat/completions',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({model:'openai/gpt-4.1',messages:[{role:'system',content:system},{role:'user',content:user}],temperature:0.6,max_tokens:4000,response_format:{type:'json_object'}})});
if(!response.ok)throw Error('GitHub Models inference HTTP '+response.status+' '+(await response.text()).slice(0,400));
const raw=(await response.json()).choices?.[0]?.message?.content;
const a=JSON.parse(raw);
for(const k of ['slug','title','seoTitle','metaDescription','excerpt','tag','intro'])if(typeof a[k]!=='string'||!a[k].trim())throw Error('Invalid '+k);
if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.slug)||slugs.includes(a.slug))throw Error('Duplicate/invalid slug');
if(!Array.isArray(a.sections)||a.sections.length<4||!Array.isArray(a.faq)||!Array.isArray(a.sources)||a.sources.length<2||!Array.isArray(a.keywords))throw Error('Invalid arrays');
const words=[a.intro,...a.sections.flatMap(s=>s.paragraphs||[])].join(' ').trim().split(/\s+/).length;
if(words<420||words>750)throw Error('Article word count out of bounds '+words);
for(const s of a.sources){if(!s.label||!/^https:\/\/(www\.)?(cdc\.gov|naeyc\.org|unicef\.org|who\.int|healthychildren\.org)\//.test(s.url))throw Error('Untrusted source '+s.url);}
a.publishedAt=date;a.updatedAt=date;a.displayDate=new Intl.DateTimeFormat('el-GR',{day:'numeric',month:'short',year:'numeric',timeZone:'Europe/Athens'}).format(new Date(date+'T12:00:00Z'));a.readMinutes=Math.max(3,Math.ceil(words/170));
const anchor='export const blogArticles: BlogArticle[] = [';
if(!content.includes(anchor))throw Error('Blog article anchor not found');
content=content.replace(anchor,anchor+'\n  '+JSON.stringify(a,null,2).replace(/\n/g,'\n  ')+',');
fs.writeFileSync(file,content);
const site='https://www.pisipouk.com';
const sitemap='public/sitemap.xml';
let xml=fs.readFileSync(sitemap,'utf8').replaceAll('https://pisipouk.vercel.app',site);
const url=site+'/blog/'+a.slug;
if(!xml.includes(url)) xml=xml.replace('</urlset>', '  <url><loc>'+url+'</loc><lastmod>'+date+'</lastmod><priority>0.8</priority></url>\n</urlset>');
fs.writeFileSync(sitemap,xml);
const robots='public/robots.txt';
fs.writeFileSync(robots,fs.readFileSync(robots,'utf8').replaceAll('https://pisipouk.vercel.app',site));
console.log('Generated',a.slug,'words',words,'sources',a.sources.length);
