/**
 * First-party, preschool-safe editorial calendar.
 * No geolocation, child PII or external calendar API. Athens is a default adult-selectable region.
 * Dates are Gregorian local dates; movable Greek Orthodox days are verified per year before publication.
 */
export type CalendarEvent={id:string;month:number;day:number;title:string;emoji:string;type:"holiday"|"international"|"seasonal";tag:string;activity:string;source?:string;country?:"GR"|"all"};
const fixed:CalendarEvent[]=[
 {id:"new-year",month:1,day:1,title:"Πρωτοχρονιά",emoji:"🎉",type:"holiday",tag:"νέα-αρχή",activity:"Καρτούλα με τις ευχές του Πισιπούκ",country:"GR"},
 {id:"epiphany",month:1,day:6,title:"Θεοφάνεια",emoji:"💧",type:"holiday",tag:"νερό",activity:"Παρατηρώ το νερό με ενήλικο",country:"GR"},
 {id:"education",month:1,day:24,title:"Διεθνής Ημέρα Εκπαίδευσης",emoji:"📚",type:"international",tag:"μαθαίνω",activity:"Διάλεξε κάτι νέο που θα ήθελες να μάθεις",source:"https://www.unesco.org/en/days/education",country:"all"},
 {id:"mother-language",month:2,day:21,title:"Διεθνής Ημέρα Μητρικής Γλώσσας",emoji:"💬",type:"international",tag:"γλώσσα",activity:"Λέξεις που μας κάνουν χαρούμενους",source:"https://www.un.org/en/observances/list-days-weeks",country:"all"},
 {id:"forest",month:3,day:21,title:"Διεθνής Ημέρα Δασών",emoji:"🌲",type:"international",tag:"δάσος",activity:"Φτιάχνω το δικό μου δάσος",source:"https://www.un.org/en/observances/list-days-weeks",country:"all"},
 {id:"water",month:3,day:22,title:"Παγκόσμια Ημέρα Νερού",emoji:"💧",type:"international",tag:"νερό",activity:"Μετρώ σταγόνες και πειραματίζομαι",source:"https://www.un.org/en/observances/list-days-weeks",country:"all"},
 {id:"independence",month:3,day:25,title:"25η Μαρτίου",emoji:"🇬🇷",type:"holiday",tag:"ελλάδα",activity:"Χρωματίζω ελληνική σημαία και μιλάμε για την ειρήνη",country:"GR"},
 {id:"earth",month:4,day:22,title:"Ημέρα της Γης",emoji:"🌍",type:"seasonal",tag:"γη",activity:"Μαθαίνω πώς φροντίζουμε τη Γη",country:"all"},
 {id:"mayday",month:5,day:1,title:"Πρωτομαγιά",emoji:"🌼",type:"holiday",tag:"λουλούδια",activity:"Φτιάχνω χάρτινο στεφάνι",country:"GR"},
 {id:"environment",month:6,day:5,title:"Παγκόσμια Ημέρα Περιβάλλοντος",emoji:"🌿",type:"international",tag:"περιβάλλον",activity:"Ταξινομώ υλικά για επαναχρησιμοποίηση",source:"https://www.un.org/en/observances/list-days-weeks",country:"all"},
 {id:"ocean",month:6,day:8,title:"Παγκόσμια Ημέρα Ωκεανών",emoji:"🐠",type:"international",tag:"θάλασσα",activity:"Φροντίζω τη θαλάσσια ζωή",source:"https://www.un.org/en/observances/list-days-weeks",country:"all"},
 {id:"play",month:6,day:11,title:"Διεθνής Ημέρα Παιχνιδιού",emoji:"🧸",type:"international",tag:"παιχνίδι",activity:"Ελεύθερο παιχνίδι με φίλους",source:"https://www.un.org/en/observances/list-days-weeks",country:"all"},
 {id:"assumption",month:8,day:15,title:"15 Αυγούστου",emoji:"🌻",type:"holiday",tag:"καλοκαίρι",activity:"Καλοκαιρινές αναμνήσεις σε ζωγραφιά",country:"GR"},
 {id:"peace",month:9,day:21,title:"Διεθνής Ημέρα Ειρήνης",emoji:"🕊️",type:"international",tag:"ειρήνη",activity:"Φτιάχνω μια καρδιά για έναν φίλο",source:"https://www.un.org/en/observances/list-days-weeks",country:"all"},
 {id:"animals",month:10,day:4,title:"Παγκόσμια Ημέρα Ζώων",emoji:"🐻",type:"seasonal",tag:"ζώα",activity:"Πώς φροντίζουμε τα ζώα;",country:"all"},
 {id:"teachers",month:10,day:5,title:"Παγκόσμια Ημέρα Εκπαιδευτικών",emoji:"📘",type:"international",tag:"σχολείο",activity:"Φτιάχνω μια ευχαριστήρια κάρτα",source:"https://www.unesco.org/en/days/teachers",country:"all"},
 {id:"food",month:10,day:16,title:"Παγκόσμια Ημέρα Διατροφής",emoji:"🍎",type:"international",tag:"διατροφή",activity:"Ετοιμάζω πολύχρωμο υγιεινό πιάτο",source:"https://www.un.org/en/observances/list-days-weeks",country:"all"},
 {id:"oxi",month:10,day:28,title:"28η Οκτωβρίου — ΟΧΙ",emoji:"🇬🇷",type:"holiday",tag:"ελλάδα",activity:"Ελληνική σημαία και ιστορία για την ειρήνη, χωρίς πολεμικές εικόνες",country:"GR"},
 {id:"child",month:11,day:20,title:"Παγκόσμια Ημέρα του Παιδιού",emoji:"🧒",type:"international",tag:"δικαιώματα",activity:"Κάθε παιδί έχει δικαίωμα στο παιχνίδι",source:"https://www.un.org/en/observances/world-childrens-day/",country:"all"},
 {id:"disability",month:12,day:3,title:"Διεθνής Ημέρα Ατόμων με Αναπηρία",emoji:"🤝",type:"international",tag:"συμπερίληψη",activity:"Παίζουμε όλοι μαζί, με διαφορετικούς τρόπους",source:"https://www.un.org/en/observances/list-days-weeks",country:"all"},
 {id:"christmas",month:12,day:25,title:"Χριστούγεννα",emoji:"⭐",type:"holiday",tag:"προσφορά",activity:"Φτιάχνω κάρτα ευχών",country:"GR"},
 {id:"boxing",month:12,day:26,title:"Δεύτερη ημέρα Χριστουγέννων",emoji:"🎁",type:"holiday",tag:"προσφορά",activity:"Μοιράζομαι μια μικρή πράξη καλοσύνης",country:"GR"}
];
const orthodox2026:CalendarEvent[]=[
 {id:"clean-monday-2026",month:2,day:23,title:"Καθαρά Δευτέρα",emoji:"🪁",type:"holiday",tag:"χαρταετός",activity:"Φτιάχνω χαρταετό με μεγάλα σχήματα",country:"GR"},
 {id:"good-friday-2026",month:4,day:10,title:"Μεγάλη Παρασκευή",emoji:"🌷",type:"holiday",tag:"άνοιξη",activity:"Ήρεμη δραστηριότητα με λουλούδια",country:"GR"},
 {id:"easter-2026",month:4,day:12,title:"Πάσχα",emoji:"🐣",type:"seasonal",tag:"άνοιξη",activity:"Χρωματιστά αυγά από χαρτί",country:"GR"},
 {id:"easter-monday-2026",month:4,day:13,title:"Δευτέρα του Πάσχα",emoji:"🐣",type:"holiday",tag:"άνοιξη",activity:"Πασχαλινές κάρτες και παιχνίδια",country:"GR"},
 {id:"spirit-2026",month:6,day:1,title:"Αγίου Πνεύματος (όπου εφαρμόζεται)",emoji:"🌿",type:"seasonal",tag:"φύση",activity:"Ανοιξιάτικο στεφάνι",country:"GR"}
];
export type RegionKey="attica"|"islands"|"mountain"|"coast"|"city";
export const REGIONS:Record<RegionKey,{label:string;scene:string;objects:string[];offline:string}>={
 attica:{label:"Αττική / Αθήνα",scene:"Πόλη, γειτονιά και λόφοι",objects:["🏙️","🌳","🏡"],offline:"Παρατηρούμε μαζί δέντρα ή μνημεία στη γειτονιά"},
 islands:{label:"Ελληνικά νησιά",scene:"Νησί, καΐκια και παραθαλάσσιο χωριό",objects:["🏝️","⛵","🐟"],offline:"Ζωγραφίζουμε το νησί και τη θάλασσα"},
 mountain:{label:"Ορεινή Ελλάδα",scene:"Δάσος, βουνά και μονοπάτια",objects:["🏔️","🌲","🦔"],offline:"Φτιάχνουμε τοπίο με χαρτιά σε πράσινες αποχρώσεις"},
 coast:{label:"Παραθαλάσσια Ελλάδα",scene:"Παραλία, κύματα και προστασία της θάλασσας",objects:["🌊","🐚","🐠"],offline:"Σχεδιάζουμε καθαρή παραλία χωρίς σκουπίδια"},
 city:{label:"Άλλη ελληνική πόλη",scene:"Σχολείο, πλατεία και γειτονιά",objects:["🏫","🚲","🌷"],offline:"Περιγράφουμε ασφαλείς διαδρομές στη γειτονιά"}
};
export function localParts(date:Date=new Date(),zone="Europe/Athens"){
 const fmt=new Intl.DateTimeFormat("en-GB",{timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",hourCycle:"h23",minute:"2-digit"});
 const p=Object.fromEntries(fmt.formatToParts(date).filter(x=>x.type!=="literal").map(x=>[x.type,Number(x.value)]));
 return {year:p.year,month:p.month,day:p.day,hour:p.hour,minute:p.minute};
}
export function contextFor(date:Date=new Date(),region:RegionKey="attica"){
 const x=localParts(date);const season=x.month===12||x.month<=2?"χειμώνας":x.month<=5?"άνοιξη":x.month<=8?"καλοκαίρι":"φθινόπωρο";
 const daypart=x.hour<6?"νύχτα":x.hour<12?"πρωί":x.hour<17?"μεσημέρι":x.hour<21?"απόγευμα":"βράδυ";
 const records=[...fixed,...(x.year===2026?orthodox2026:[])].filter(e=>(e.country==="GR"||e.country==="all")&&e.month===x.month&&e.day===x.day);
 const nearby=[...fixed,...(x.year===2026?orthodox2026:[])].filter(e=>e.month===x.month&&Math.abs(e.day-x.day)<=7);
 return {...x,season,daypart,region:REGIONS[region],regionKey:region,events:records,nearbyEvents:nearby,zone:"Europe/Athens" as const};
}
export function calendarMonth(year:number,month:number){
 return [...fixed,...(year===2026?orthodox2026:[])].filter(e=>e.month===month).sort((a,b)=>a.day-b.day);
}
export function seasonalSuggestions(date:Date,region:RegionKey,age:number){
 const c=contextFor(date,region),event=c.events[0]||c.nearbyEvents[0];
 const play=c.season==="φθινόπωρο"?"🍂 Παρατηρώ φύλλα και χρώματα":c.season==="χειμώνας"?"❄️ Χτίζω ένα ζεστό σπιτάκι":c.season==="άνοιξη"?"🌷 Φροντίζω λουλούδια":"🐠 Εξερευνώ τον κόσμο της θάλασσας";
 return {event,game:event?event.activity:play,story:event?"Μια ιστορία για: "+event.title:"Ιστορία για "+c.season,
  craft:event?"Κατασκευή: "+event.activity:"Κατασκευή από τον τόπο μας: "+c.region.scene,
  drawing:event?"Ζωγραφίζω: "+event.tag:"Ζωγραφίζω "+c.region.scene,
  outdoor:c.region.offline,ageText:["Απλά σχήματα και μεγάλα πατήματα","Σύγκριση και ταξινόμηση","Δοκιμές με περισσότερα βήματα","Σχεδιασμός και εξήγηση"][age]||"Δημιουργική εξερεύνηση"};
}
