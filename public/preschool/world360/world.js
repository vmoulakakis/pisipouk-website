/* PISIPOUK 360 | Original 20-game interactive HTML5 runtime.
 * Local-only visit state. All activities support touch and mouse.
 */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const COLORS=["#f43f5e","#facc15","#22c55e","#0284c7","#a855f7"];
const AGES=["2-3","3-4","4-5","5-6"];
const GAMES=[
["bubble",0,"nature","🫧","Μαγικές Φυσαλίδες","Αισθήσεις"],["feed",0,"animals","🐼","Ταΐζω το Ζωάκι","Φροντίδα"],["sounds",0,"animals","🐮","Οι Φωνές των Ζώων","Ακρόαση"],["wipe",0,"atelier","🪞","Ο Μαγικός Καθρέφτης","Λεπτή κινητικότητα"],["sizes",0,"bakery","🚂","Το Τρένο των Μεγεθών","Μεγέθη"],
["cupcake",1,"bakery","🧁","Εργαστήρι Χρωμάτων","Ταξινόμηση"],["shapes",1,"library","🔺","Το Παζλ των Σχημάτων","Σχήματα"],["routine",1,"castle","🪥","Πλένω & Φροντίζω","Αυτονομία"],["patterns",1,"nature","🥕","Μοτίβα στο Περιβόλι","Μοτίβα Α–Β"],["xylophone",1,"music","🎹","Μουσικό Ξυλόφωνο","Ρυθμός"],
["balance",2,"bakery","⚖️","Η Ζυγαριά της Κουζίνας","Αριθμοί 1–5"],["plant",2,"nature","🌻","Ο Κύκλος του Φυτού","Φυσικές επιστήμες"],["maze",2,"stem","🦔","Λαβύρινθος Σκαντζόχοιρου","Χώρος"],["recycle",2,"castle","♻️","Ήρωας Ανακύκλωσης","Περιβάλλον"],["shadows",2,"atelier","🌗","Σκιές και Σιλουέτες","Οπτική διάκριση"],
["phonics",3,"library","🅰️","Αλφαβητάρι Ήχων","Φωνολογία"],["market",3,"bakery","🪙","Η Αγορά των Νομισμάτων","Αρίθμηση"],["emotions",3,"castle","🥰","Καθρέφτης Συναισθημάτων","Ενσυναίσθηση"],["beebot",3,"stem","🐝","Η Μελισσούλα-Ρομπότ","Πρώτος κώδικας"],["sequence",3,"library","📚","Φτιάχνω μια Ιστορία","Αφήγηση"]
].map(([id,age,zone,icon,title,skill])=>({id,age,zone,icon,title,skill}));
const ANIMALS=[["🐮","αγελαδίτσα","μου"],["🐷","γουρουνάκι","γκρου"],["🐤","κοτοπουλάκι","πιπ"],["🐑","προβατάκι","μπε"],["🐱","γατάκι","νιάου"]];
const ST={age:1,game:null,round:0,s:null,selected:null,stars:0,muted:true,offset:0};
const rnd=()=>{try{let x=new Uint32Array(1);crypto.getRandomValues(x);return x[0]/4294967296}catch{return Math.random()}};
const pick=a=>a[Math.floor(rnd()*a.length)],num=(lo,hi)=>lo+Math.floor(rnd()*(hi-lo+1));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){let j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
let soundContext=null;
function sound(hz=500){if(ST.muted)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;soundContext=soundContext||new C();const o=soundContext.createOscillator(),g=soundContext.createGain(),t=soundContext.currentTime;o.type="sine";o.frequency.setValueAtTime(hz,t);o.frequency.exponentialRampToValueAtTime(hz*1.3,t+.17);g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.07,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+.26);o.connect(g);g.connect(soundContext.destination);o.start(t);o.stop(t+.28)}catch{}}
function speak(str){if(ST.muted||!window.speechSynthesis)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(str);u.lang="el-GR";u.rate=.83;speechSynthesis.speak(u)}catch{}}
function say(s){$("prompt").textContent=s;speak(s)}
function hint(s){$("game-hint").textContent=s}
function tile(icon,id,label="",attr=""){return '<button class="tile" data-action="'+id+'" '+attr+'>'+icon+(label?'<small style="display:block;font-size:12px;font-weight:950">'+label+"</small>":"")+"</button>"}
function piece(icon,id,label="",style=""){return '<button class="tile" data-piece="'+id+'" style="'+style+'">'+icon+(label?'<small style="display:block;font-size:12px">'+label+"</small>":"")+"</button>"}
function zone(icon,id,label="",style=""){return '<div class="dropzone" data-zone="'+id+'" style="'+style+'">'+icon+(label?'<div class="text">'+label+"</div>":"")+"</div>"}
function board(rows){$("play-area").innerHTML=rows}
function completed(){ST.stars++;$("stars").textContent=ST.stars;const text=pick(["✨ Μπράβο!","🌈 Υπέροχα!","⭐ Το κατάφερες!","🦋 Μαγική στιγμή!","🎉 Πολύ όμορφα!"]);$("reward-text").textContent=text;$("reward").hidden=false;sound(740);hint("Ξεκίνα έναν καινούργιο, διαφορετικό γύρο!")}
function gentle(el){hint("Δοκίμασε ξανά όπως σου αρέσει!");if(el){el.classList.remove("wrong");void el.offsetHeight;el.classList.add("wrong")}sound(260)}
function makeRound(){
const t=ST.game.id,s={type:t,progress:0,done:[],selected:null,prompt:""};
if(t==="bubble"){s.items=Array.from({length:8},(_,i)=>({id:i,color:pick(COLORS),emoji:pick(["🦋","🌼","🐥","🐞","🐢"])}));s.prompt="Σκάσε τις φυσαλίδες και βρες μικρές εκπλήξεις!"}
if(t==="feed"){s.items=shuffle(["🍎","🍓","🍐","🥕","🍌"]);s.target=3;s.prompt="Δώσε τρία φρουτάκια στο ζωάκι!"}
if(t==="sounds"){s.target=num(0,4);s.items=shuffle([s.target,(s.target+num(1,4))%5]);s.prompt="Ποιο ζωάκι κάνει «"+ANIMALS[s.target][2]+"»;"}
if(t==="wipe"){s.target=15;s.emoji=pick(["🐼","🌈","🦋","🍓","🐥"]);s.prompt="Σκούπισε το θολό τζαμάκι για να δεις την έκπληξη!"}
if(t==="sizes"){s.items=shuffle([{id:0,size:"big",icon:"🍎"},{id:1,size:"small",icon:"🍏"}]);s.prompt="Βάλε το μεγάλο μήλο στο μεγάλο καλάθι και το μικρό στο μικρό!"}
if(t==="cupcake"){s.items=shuffle([0,1,2,3].map(id=>({id,color:COLORS[id]})));s.prompt="Ταίριαξε κάθε κεκάκι στην πιατέλα ίδιου χρώματος!"}
if(t==="shapes"){s.items=shuffle([0,1,2]);s.prompt="Βάλε τα τρία σχήματα στη σωστή θέση!"}
if(t==="routine"){s.target=14;s.icon=pick(["🦷","👐"]);s.prompt=s.icon==="🦷"?"Καθάρισε τα δοντάκια με μικρές κινήσεις!":"Πλύνε τα χεράκια με απαλές κινήσεις!"}
if(t==="patterns"){s.a=pick(["🥕","🍎","🌼","🐤"]);s.b=pick(["🎃","🍐","🍓","🦋"]);s.items=shuffle([s.a,s.b,"🍄"]);s.prompt="Τι ακολουθεί στο μοτίβο;"}
if(t==="xylophone"){s.notes=Array.from({length:num(1,3)},()=>num(0,4));s.prompt="Άκου τις νότες και παίξε τις με τη σειρά!"}
if(t==="balance"){s.target=num(1,5);s.prompt="Πρόσθεσε "+s.target+" μήλα στη ζυγαριά!"}
if(t==="plant"){s.prompt="Σπόρος, νερό και ήλιος — βοήθησε το φυτό να ανθίσει!"}
if(t==="maze"){s.pos=0;s.prompt="Βοήθησε τον σκαντζόχοιρο να φτάσει στη φωλίτσα!"}
if(t==="recycle"){s.items=shuffle([{e:"📰",bin:0},{e:"📦",bin:0},{e:"🧴",bin:1},{e:"🥤",bin:1},{e:"🍎",bin:2},{e:"🍌",bin:2}]);s.prompt="Βάλε τα αντικείμενα στους κατάλληλους κάδους!"}
if(t==="shadows"){s.items=shuffle(["🎹","🎨","🖌️","✂️"]);s.target=num(0,3);s.prompt="Βρες ποιο αντικείμενο ταιριάζει με τη σκιά!"}
if(t==="phonics"){s.items=shuffle([["Α","🐴","Άλογο"],["Μ","🍎","Μήλο"],["Σ","🏠","Σπίτι"],["Π","🦆","Πάπια"]]);s.target=num(0,3);s.prompt="Ποια λέξη αρχίζει από «"+s.items[s.target][0]+"»;"}
if(t==="market"){s.target=num(2,7);s.prompt="Το παιχνίδι κοστίζει "+s.target+" νομίσματα. Μέτρησέ τα!"}
if(t==="emotions"){s.items=[["χαρά","😄","Ένας φίλος πήρε μια μεγάλη αγκαλιά!"],["λύπη","😢","Το μπαλόνι του πέταξε μακριά."],["έκπληξη","😮","Βρήκε ένα δώρο!"],["θυμό","😠","Πήραν το παιχνίδι του χωρίς να ρωτήσουν."]];s.target=num(0,3);s.prompt=s.items[s.target][2]+" Πώς νιώθει;"}
if(t==="beebot"){s.pos=0;s.direction=1;s.target=[2,2];s.prompt="Φτάσε στη μαργαρίτα οδηγώντας τη μελισσούλα!"}
if(t==="sequence"){s.items=shuffle([{id:0,e:"🌅",label:"Πρωί"},{id:1,e:"🛝",label:"Παιχνίδι"},{id:2,e:"🌙",label:"Ύπνος"}]);s.prompt="Πρώτα το πρωί, μετά το παιχνίδι, τέλος ο ύπνος!"}
return s;
}
function launch(g){if(!g)return;ST.game=g;ST.round=0;$("modal").hidden=false;document.body.style.overflow="hidden";newRound()}
function newRound(){if(!ST.game)return;ST.round++;ST.selected=null;ST.s=makeRound();$("reward").hidden=true;$("game-title").textContent=ST.game.title;$("game-age").textContent="Ηλικία "+AGES[ST.game.age]+" ετών · νέα δοκιμή "+ST.round;$("game-illustration").textContent=ST.game.icon;say(ST.s.prompt);render()}
function close(){ST.game=null;ST.s=null;$("modal").hidden=true;document.body.style.overflow="";if(window.speechSynthesis)speechSynthesis.cancel()}
