/** PISIPOUK internal calendar/context. Europe/Athens, no location or weather tracking. */
export type PlaceKey="city"|"islands"|"mountain"|"countryside"|"mainland";
export type Topic="nature"|"water"|"food"|"reading"|"feelings"|"peace"|"community"|"science"|"greek"|"arts"|"seasons"|"animals"|"space";
export type EventKind="greek-holiday"|"greek-observance"|"international"|"cultural";
export type CalendarEvent={id:string;date:string;name:string;icon:string;kind:EventKind;topic:Topic;description:string;prompt:string;importance:number;source:string};
export const PLACES:{id:PlaceKey;name:string;icon:string;landscape:string;note:string;outdoors:string;topics:Topic[];symbols:string[]}[]=[
 {id:"city",name:"Πόλη / Αθήνα",icon:"🏙️",landscape:"Πάρκα, πλατείες, ασφαλείς διαδρομές",note:"Μαθαίνω τη γειτονιά, το σχολείο και τους χώρους της πόλης.",outdoors:"Πηγαίνετε με ενήλικο σε ένα πάρκο και παρατηρήστε ένα δέντρο.",topics:["community","space","arts"],symbols:["🏫","🌳","🏛️","🚶"]},
 {id:"islands",name:"Νησιά / Ακτές",icon:"🏝️",landscape:"Θάλασσα, λιμάνια, ακτές",note:"Ανακαλύπτω τη θάλασσα, τα νησιά και τους μικρούς θαλάσσιους κατοίκους.",outdoors:"Βρείτε στον χάρτη ένα ελληνικό νησί και ζωγραφίστε μια βαρκούλα.",topics:["water","nature","space"],symbols:["⛵","🐟","🐚","🏝️"]},
 {id:"mountain",name:"Ορεινή Ελλάδα",icon:"⛰️",landscape:"Έλατα, βουνά, δάση",note:"Παρατηρώ πώς η φύση αλλάζει ψηλά στο βουνό.",outdoors:"Συγκρίνετε φωτογραφίες ορεινού δάσους με το δέντρο της γειτονιάς.",topics:["nature","seasons","animals"],symbols:["🌲","⛰️","🦅","🍄"]},
 {id:"countryside",name:"Χωριά / Ύπαιθρος",icon:"🫒",landscape:"Ελαιώνες, χωράφια, κήποι",note:"Ανακαλύπτω τη συγκομιδή, την ελιά και τη φροντίδα του κήπου.",outdoors:"Με ενήλικο παρατηρήστε το σχήμα ενός φύλλου ή ενός καρπού.",topics:["food","nature","community"],symbols:["🫒","🚜","🌾","🐑"]},
 {id:"mainland",name:"Ηπειρωτική Ελλάδα",icon:"🌳",landscape:"Ποτάμια, κοιλάδες, λίμνες",note:"Μαθαίνω πώς συνδέονται ποτάμια, δέντρα και ζώα.",outdoors:"Ζωγραφίστε ποτάμι που ξεκινά από βουνό και φτάνει στη θάλασσα.",topics:["water","nature","animals"],symbols:["🏞️","🌳","🦆","⛰️"]}
];
const LAW="https://www.hli.gov.gr/ergasiakes-scheseis/nomothesia-ergasiakes-scheseis/amoivi/kyriaki-argies-amoivi/imeres-argias-2/";
const BANK="https://www.bankofgreece.gr/enimerosi/grafeio-typoy/anazhthsh-enhmerwsewn/enhmerwseis?announcement=84e874ac-2317-4f31-9fd0-5b21debc4b85";
const UN="https://www.un.org/en/observances/list-days-weeks";
const UNESCO="https://www.unesco.org/en/days/list";
const raw:{id:string;m:number;d:number;name:string;icon:string;kind:EventKind;topic:Topic;description:string;prompt:string;importance:number;source:string}[]=[
 {id:"new-year",m:1,d:1,name:"Πρωτοχρονιά",icon:"🎉",kind:"greek-holiday",topic:"community",description:"Καλωσορίζουμε τη νέα χρονιά με παιδική περιέργεια.",prompt:"Τι καινούργιο θέλεις να δοκιμάσεις;",importance:2,source:LAW},
 {id:"epiphany",m:1,d:6,name:"Θεοφάνεια",icon:"💧",kind:"greek-holiday",topic:"water",description:"Νερό και ελληνικές παραδόσεις.",prompt:"Πού υπάρχει νερό γύρω μας;",importance:2,source:LAW},
 {id:"education",m:1,d:24,name:"Διεθνής Ημέρα Εκπαίδευσης",icon:"📚",kind:"international",topic:"reading",description:"Το παιχνίδι και η μάθηση είναι για όλα τα παιδιά.",prompt:"Τι θα ήθελες να μάθεις;",importance:2,source:"https://www.unesco.org/en/days/education"},
 {id:"wetlands",m:2,d:2,name:"Παγκόσμια Ημέρα Υγροτόπων",icon:"🦆",kind:"international",topic:"water",description:"Λίμνες και ζώα που χρειάζονται νερό.",prompt:"Ποιο ζώο ζει κοντά στο νερό;",importance:2,source:UN},
 {id:"science",m:2,d:11,name:"Ημέρα Γυναικών και Κοριτσιών στην Επιστήμη",icon:"🔬",kind:"international",topic:"science",description:"Εξερεύνηση και ερωτήσεις για κάθε παιδί.",prompt:"Τι θα ήθελες να ανακαλύψεις;",importance:2,source:UN},
 {id:"language",m:2,d:21,name:"Διεθνής Ημέρα Μητρικής Γλώσσας",icon:"🗣️",kind:"international",topic:"reading",description:"Μοιραζόμαστε τις γλώσσες μας.",prompt:"Πώς λες καλημέρα;",importance:2,source:UN},
 {id:"forests",m:3,d:21,name:"Διεθνής Ημέρα Δασών",icon:"🌲",kind:"international",topic:"nature",description:"Φροντίζουμε τα δάση και τα ζώα.",prompt:"Ποιο ζώο χρειάζεται το δάσος;",importance:2,source:UN},
 {id:"water",m:3,d:22,name:"Παγκόσμια Ημέρα Νερού",icon:"💦",kind:"international",topic:"water",description:"Χρησιμοποιούμε το νερό με φροντίδα.",prompt:"Πώς μπορούμε να προστατεύσουμε το νερό;",importance:3,source:"https://www.unwater.org/our-work/world-water-day"},
 {id:"march25",m:3,d:25,name:"25η Μαρτίου",icon:"🇬🇷",kind:"greek-holiday",topic:"greek",description:"Σημαία, ελληνική παράδοση και ειρήνη.",prompt:"Ποια χρώματα έχει η σημαία;",importance:3,source:LAW},
 {id:"earth",m:4,d:22,name:"Ημέρα της Γης",icon:"🌍",kind:"cultural",topic:"nature",description:"Μικρές πράξεις φροντίδας για τη Γη.",prompt:"Πώς φροντίζουμε τη φύση;",importance:2,source:"https://www.earthday.org/"},
 {id:"books",m:4,d:23,name:"Παγκόσμια Ημέρα Βιβλίου",icon:"📖",kind:"international",topic:"reading",description:"Ιστορίες και παραμύθια για όλους.",prompt:"Ποιος θα είναι ο ήρωας;",importance:3,source:UNESCO},
 {id:"may1",m:5,d:1,name:"Πρωτομαγιά",icon:"🌼",kind:"greek-holiday",topic:"nature",description:"Άνοιξη, λουλούδια και συνεργασία.",prompt:"Ποιο λουλούδι θα ζωγραφίσεις;",importance:2,source:LAW},
 {id:"family",m:5,d:15,name:"Διεθνής Ημέρα Οικογένειας",icon:"💛",kind:"international",topic:"feelings",description:"Κάθε οικογένεια αξίζει αγάπη και φροντίδα.",prompt:"Ποιον αγαπημένο σου άνθρωπο θέλεις να ζωγραφίσεις;",importance:2,source:UN},
 {id:"environment",m:6,d:5,name:"Παγκόσμια Ημέρα Περιβάλλοντος",icon:"🌿",kind:"international",topic:"nature",description:"Φροντίδα φυτών και ανακύκλωση.",prompt:"Τι μπορούμε να ξαναχρησιμοποιήσουμε;",importance:3,source:UN},
 {id:"oceans",m:6,d:8,name:"Παγκόσμια Ημέρα Ωκεανών",icon:"🐠",kind:"international",topic:"water",description:"Γνωρίζουμε τη θάλασσα και τους κατοίκους της.",prompt:"Ποιο ζωάκι ζει στον ωκεανό;",importance:3,source:UN},
 {id:"friends",m:7,d:30,name:"Διεθνής Ημέρα Φιλίας",icon:"🤝",kind:"international",topic:"feelings",description:"Μοιραζόμαστε και βοηθάμε τους φίλους.",prompt:"Πώς βοηθούμε έναν φίλο;",importance:2,source:UN},
 {id:"aug15",m:8,d:15,name:"15 Αυγούστου",icon:"🌺",kind:"greek-holiday",topic:"community",description:"Καλοκαιρινές παραδόσεις και κοινότητα.",prompt:"Τι κάνουμε μαζί σε μια γιορτή;",importance:2,source:LAW},
 {id:"literacy",m:9,d:8,name:"Διεθνής Ημέρα Γραμματισμού",icon:"🔤",kind:"international",topic:"reading",description:"Παίζουμε με εικόνες, γράμματα και αφηγήσεις.",prompt:"Ποιο γράμμα γνωρίζεις;",importance:3,source:"https://www.unesco.org/en/days/literacy"},
 {id:"peace",m:9,d:21,name:"Διεθνής Ημέρα Ειρήνης",icon:"🕊️",kind:"international",topic:"feelings",description:"Συνεργασία χωρίς σύγκρουση.",prompt:"Πώς βοηθάς κάποιον να νιώθει ασφαλής;",importance:3,source:UN},
 {id:"teachers",m:10,d:5,name:"Παγκόσμια Ημέρα Εκπαιδευτικών",icon:"👩‍🏫",kind:"international",topic:"reading",description:"Μαθαίνουμε και ανακαλύπτουμε μαζί.",prompt:"Τι σου αρέσει να μαθαίνεις;",importance:2,source:UNESCO},
 {id:"food",m:10,d:16,name:"Παγκόσμια Ημέρα Διατροφής",icon:"🍎",kind:"international",topic:"food",description:"Φρούτα και γεύσεις χωρίς «καλά/κακά» τρόφιμα.",prompt:"Ποιο φρούτο αναγνωρίζεις;",importance:3,source:"https://www.fao.org/world-food-day/en"},
 {id:"un",m:10,d:24,name:"Ημέρα Ηνωμένων Εθνών",icon:"🌍",kind:"international",topic:"community",description:"Συνεργασία και σεβασμός στον κόσμο.",prompt:"Πώς συνεργαζόμαστε;",importance:2,source:UN},
 {id:"oct28",m:10,d:28,name:"28η Οκτωβρίου",icon:"🇬🇷",kind:"greek-holiday",topic:"greek",description:"Ελληνική σημαία, ειρήνη και θάρρος χωρίς βίαιες εικόνες.",prompt:"Ποια χρώματα έχει η ελληνική σημαία;",importance:3,source:LAW},
 {id:"children",m:11,d:20,name:"Παγκόσμια Ημέρα του Παιδιού",icon:"🧒",kind:"international",topic:"feelings",description:"Δικαίωμα στο παιχνίδι, στη φροντίδα και στην έκφραση.",prompt:"Ποιο παιχνίδι αγαπάς;",importance:3,source:"https://www.unicef.org/world-childrens-day"},
 {id:"inclusion",m:12,d:3,name:"Διεθνής Ημέρα Ατόμων με Αναπηρία",icon:"🤲",kind:"international",topic:"community",description:"Όλοι μπορούμε να συμμετέχουμε με διαφορετικό τρόπο.",prompt:"Πώς θα παίξουμε όλοι μαζί;",importance:3,source:UN},
 {id:"christmas",m:12,d:25,name:"Χριστούγεννα",icon:"🎄",kind:"greek-holiday",topic:"community",description:"Παραμύθια και μικρές πράξεις φροντίδας.",prompt:"Τι δώρο θα έφτιαχνες για κάποιον;",importance:3,source:LAW},
 {id:"dec26",m:12,d:26,name:"Δεύτερη ημέρα Χριστουγέννων",icon:"🎁",kind:"greek-holiday",topic:"community",description:"Οικογενειακό παιχνίδι και χαρά.",prompt:"Με ποιον θέλεις να παίξεις;",importance:1,source:LAW}
];
function iso(y:number,m:number,d:number){return y+"-"+String(m).padStart(2,"0")+"-"+String(d).padStart(2,"0")}
function plusDays(day:string,n:number){const d=new Date(day+"T12:00:00Z");d.setUTCDate(d.getUTCDate()+n);return iso(d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate())}
function daysBetween(a:string,b:string){return Math.round((Date.parse(a+"T12:00:00Z")-Date.parse(b+"T12:00:00Z"))/86400000)}
export function athensToday(now=new Date()){const parts=new Intl.DateTimeFormat("en-US",{timeZone:"Europe/Athens",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(now);const val=(type:string)=>parts.find(p=>p.type===type)?.value||"";return val("year")+"-"+val("month")+"-"+val("day")}
export function orthodoxEaster(year:number):string{
 if(year<1900||year>2099)throw Error("Supported Easter years: 1900–2099");
 const a=year%4,b=year%7,c=year%19,d=(19*c+15)%30,e=(2*a+4*b-d+34)%7;
 // Julian date March 22 + d + e, Gregorian difference 13 days during 1900–2099.
 const julian=new Date(Date.UTC(year,2,22+d+e+13));
 return iso(julian.getUTCFullYear(),julian.getUTCMonth()+1,julian.getUTCDate());
}
export function calendarYear(year:number):CalendarEvent[]{
 const easter=orthodoxEaster(year),rows:CalendarEvent[]=raw.map(x=>({id:x.id,date:iso(year,x.m,x.d),name:x.name,icon:x.icon,kind:x.kind,topic:x.topic,description:x.description,prompt:x.prompt,importance:x.importance,source:x.source}));
 const add=(id:string,date:string,name:string,icon:string,topic:Topic,desc:string,kind:EventKind="greek-observance",importance=2)=>rows.push({id,date,name,icon,topic,description:desc,prompt:"Τι παρατηρείς σήμερα;",importance,source:BANK,kind});
 add("clean-monday",plusDays(easter,-48),"Καθαρά Δευτέρα","🪁","arts","Χαρταετός, χρώματα και δημιουργία.");
 add("good-friday",plusDays(easter,-2),"Μεγάλη Παρασκευή","🌷","feelings","Ήρεμες ιστορίες, ενσυναίσθηση και φροντίδα.", "greek-observance",1);
 add("easter",easter,"Ορθόδοξο Πάσχα","🐣","nature","Άνοιξη, ανανέωση, αυγά και οικογενειακές παραδόσεις.");
 add("easter-monday",plusDays(easter,1),"Δευτέρα του Πάσχα","🌼","community","Παίζουμε και μοιραζόμαστε την ανοιξιάτικη χαρά.","greek-holiday",3);
 add("holy-spirit",plusDays(easter,50),"Αγίου Πνεύματος","🌿","community","Τοπικές παραδόσεις και κοινότητα.","greek-observance",1);
 return rows.sort((a,b)=>a.date.localeCompare(b.date)||b.importance-a.importance);
}
export function eventsInMonth(year:number,month:number){return calendarYear(year).filter(x=>Number(x.date.slice(5,7))===month)}
export function regionById(id:PlaceKey){return PLACES.find(p=>p.id===id)||PLACES[0]}
export function seasonFor(date:string):"Χειμώνας"|"Άνοιξη"|"Καλοκαίρι"|"Φθινόπωρο"{
 const m=Number(date.slice(5,7));return m===12||m<3?"Χειμώνας":m<6?"Άνοιξη":m<9?"Καλοκαίρι":"Φθινόπωρο";
}
const hints:Record<Topic,{games:number[];words:string[];offline:string}>={
 nature:{games:[8,9,3,14,15],words:["φυλλ","δεντρ","λουλουδ","κηπο","τρακτερ","πεταλουδ"],offline:"Παρατηρήστε ένα δέντρο και ζωγραφίστε ένα φύλλο του."},
 water:{games:[8,11,12,15,14],words:["βαρκ","συννεφ","βροχ","θαλασσ","ουρανιο"],offline:"Παρατηρήστε μαζί τι επιπλέει σε ένα μικρό δοχείο νερού."},
 food:{games:[1,4,5,18,9],words:["μηλο","καροτ","φραουλ","τρακτερ","κηπο"],offline:"Βρείτε και ταξινομήστε φρούτα διαφορετικών χρωμάτων."},
 reading:{games:[16,6,2,3],words:["σχολει","καλημερα","Πισιπουκ","καρτα"],offline:"Διαβάστε παραμύθι και ζωγραφίστε έναν ήρωα."},
 feelings:{games:[7,16,17,2],words:["συναισθη","προσωπο","καλημερα","Πισιπουκ"],offline:"Ζωγραφίστε ένα χαρούμενο και ένα ήρεμο πρόσωπο."},
 peace:{games:[7,16,17,2],words:["καλημερα","συναισθη","σχολει"],offline:"Παίξτε ένα ομαδικό παιχνίδι χωρίς νικητή."},
 community:{games:[7,11,16,17],words:["σπιτ","σχολει","καλημερα","καρτα"],offline:"Φτιάξτε χάρτη με το σπίτι και την πλατεία."},
 science:{games:[14,15,8,5],words:["ηλιο","καιρο","συννεφ","δεντρ"],offline:"Παρατηρήστε τη σκιά ενός ασφαλούς παιχνιδιού."},
 greek:{games:[19,7,16,3],words:["Πισιπουκ","σχολει","βαρκ","ελιά","σημαια"],offline:"Ζωγραφίστε ελληνική σημαία με λευκό και μπλε."},
 arts:{games:[19,5,10,9],words:["ουρανιο","λουλουδ","στολιδ","καρτα"],offline:"Δημιουργήστε κολάζ από μεγάλα χαρτιά."},
 seasons:{games:[3,8,9,14],words:["εποχ","βροχ","συννεφ","δεντρ","ηλιο"],offline:"Συγκρίνετε δύο εικόνες της ίδιας εποχής."},
 animals:{games:[6,2,8,12],words:["σκίουρ","πεταλουδ","κοτουλ","προβατ","σαλιγκαρ"],offline:"Μιμηθείτε ήχους ζώων μαζί με ενήλικο."},
 space:{games:[11,13,3,14],words:["σπιτ","σχολει","βαρκ","τρακτερ"],offline:"Φτιάξτε διαδρομή από το σπίτι σε ένα πάρκο."}
};
const normalize=(s:string)=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
export function dayContext(date:string,place:PlaceKey="city"){
 const events=calendarYear(Number(date.slice(0,4)));
 const today=events.filter(e=>e.date===date);
 const soon=events.filter(e=>daysBetween(e.date,date)>0&&daysBetween(e.date,date)<=7).sort((a,b)=>daysBetween(a.date,date)-daysBetween(b.date));
 const recent=events.filter(e=>daysBetween(date,e.date)>0&&daysBetween(date,e.date)<=2);
 const featured=today.slice().sort((a,b)=>b.importance-a.importance)[0]||soon.find(e=>e.importance>=2)||recent[0]||null;
 const region=regionById(place),season=seasonFor(date);
 const primary:Topic=featured?.topic||(season==="Καλοκαίρι"?"water":season==="Χειμώνας"?"seasons":"nature");
 const topics=[primary,...region.topics];const gameIndexes=[...new Set(topics.flatMap(t=>hints[t].games))];
 return {date,region,season,featured,today,soon,topics,gameIndexes,words:[...new Set(topics.flatMap(t=>hints[t].words))],
  offline:featured?hints[primary].offline:region.outdoors,
  narrative:featured?(featured.name+(featured.date===date?" σήμερα":" πλησιάζει")+": "+featured.description):(season+" — "+region.landscape+". "+region.note),
  disclaimer:"Εποχιακή και γεωγραφική προσέγγιση, όχι ζωντανά δεδομένα καιρού ή εντοπισμός θέσης."};
}
export function curateItems<T extends {title:string}>(items:readonly T[],date:string,place:PlaceKey,limit?:number):T[]{
 const words=dayContext(date,place).words.map(normalize);
 const ordered=items.map((item,i)=>({item,i,score:words.reduce((sum,word)=>sum+(normalize(item.title).includes(word)?3:0),0)}));
 ordered.sort((a,b)=>b.score-a.score||a.i-b.i);
 return ordered.map(x=>x.item).slice(0,limit??items.length);
}
export function curateGames(date:string,place:PlaceKey,age:number):number[]{
 const featured=dayContext(date,place).gameIndexes;
 const offset=(age+Number(date.slice(8,10)))%Math.max(1,featured.length);
 return [...new Set([...featured.slice(offset),...featured.slice(0,offset),...Array.from({length:20},(_,i)=>i)])];
}
