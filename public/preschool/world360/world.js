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

function render(){
 const s=ST.s;if(!s||!ST.game)return;const t=s.type;
 $("game-progress").textContent=s.progress?("✨ "+s.progress):"";
 let out="";
 if(t==="bubble")out='<div class="board">'+s.items.filter(x=>!s.done.includes(x.id)).map(x=>tile("🫧","pop","", 'data-id="'+x.id+'" style="background:'+x.color+';border-radius:50%;font-size:62px"')).join("")+"</div>";
 if(t==="feed")out='<div class="board">'+zone("🐼","feed","Ταΐζω το ζωάκι","font-size:105px")+'</div><div class="board">'+s.items.filter((x,i)=>!s.done.includes(i)).map(x=>piece(x,s.items.indexOf(x))).join("")+'</div><p class="prompt-counter">'+s.progress+" / "+s.target+"</p>";
 if(t==="sounds")out='<div class="board">'+s.items.map(i=>tile(ANIMALS[i][0],"answer",ANIMALS[i][1],'data-id="'+i+'"')).join("")+'</div>'+tile("🔊","repeat","Άκου πάλι");
 if(t==="wipe")out='<div class="trace-board" id="wipe-board"><div class="reveal-image">'+s.emoji+'</div><canvas id="wipe-canvas" class="wipe-canvas"></canvas></div>';
 if(t==="sizes")out='<div class="board">'+s.items.filter(x=>!s.done.includes(x.id)).map(x=>piece(x.icon,x.id,x.size==="big"?"Μεγάλο":"Μικρό","font-size:"+(x.size==="big"?72:36)+"px")).join("")+"</div><div class=board>"+zone("🧺","big","Μεγάλο")+zone("🧺","small","Μικρό")+"</div>";
 if(t==="cupcake")out='<div class="board">'+s.items.filter(x=>!s.done.includes(x.id)).map(x=>piece("🧁",x.id,"","background:"+x.color)).join("")+'</div><div class="board">'+s.items.map(x=>zone("🍽️",x.id,"","background:"+x.color+";font-size:43px")).join("")+"</div>";
 if(t==="shapes")out='<div class="board">'+s.items.filter(i=>!s.done.includes(i)).map(i=>piece(["●","■","▲"][i],i,["Κύκλος","Τετράγωνο","Τρίγωνο"][i],"color:"+COLORS[i])).join("")+'</div><div class="board">'+s.items.map(i=>zone(["●","■","▲"][i],i,"","color:#88999e")).join("")+"</div>";
 if(t==="routine")out='<div class="board">'+tile(s.icon,"brush","Σκούπισε με το δάχτυλο",'style="font-size:100px;min-width:260px;min-height:210px"')+'</div><div class=prompt-counter>✨ '+s.progress+" κινήσεις</div>";
 if(t==="patterns")out='<div class="board">'+[s.a,s.b,s.a,"❓"].map(x=>tile(x,"noop")).join("")+'</div><p class=prompt-counter>Τι λείπει;</p><div class="board">'+s.items.map((x,i)=>tile(x,"answer","",'data-id="'+i+'"')).join("")+"</div>";
 if(t==="xylophone")out='<div class="board">'+Array.from({length:5},(_,i)=>tile(["🔴","🟠","🟡","🟢","🔵"][i],"note","",'data-id="'+i+'" style="background:'+["#fda4af","#fdba74","#fde047","#86efac","#7dd3fc"][i]+';min-height:164px"')).join("")+"</div>"+tile("🔊","repeat","Άκου το μοτίβο");
 if(t==="balance")out='<div class="board">'+zone("⚖️","static",s.progress+" / "+s.target)+'</div><div class="board">'+Array.from({length:s.target},(_,i)=>tile("🍎","count","",'data-id="'+i+'" '+(s.done.includes(i)?"disabled":""))).join("")+"</div>";
 if(t==="plant")out='<div class=board>'+zone(["🟫","🌱","🌿","🌻"][s.progress]||"🌻","static")+'</div><div class="board">'+["🌱","💧","☀️"].map((e,i)=>tile(e,"grow",["Σπόρος","Νερό","Ήλιος"][i],'data-id="'+i+'"')).join("")+"</div>";
 if(t==="maze")out='<div style="display:grid;grid-template-columns:repeat(4,65px);gap:7px">'+Array.from({length:16},(_,i)=>'<div class=tile style="min-width:65px;min-height:65px;font-size:30px">'+(i===s.pos?"🦔":i===15?"🏠":"·")+"</div>").join("")+'</div><div class="board">'+[["⬅️",-1],["⬆️",-4],["⬇️",4],["➡️",1]].map(x=>tile(x[0],"move","",'data-id="'+x[1]+'"')).join("")+"</div>";
 if(t==="recycle")out='<div class=board>'+s.items.filter((x,i)=>!s.done.includes(i)).map(x=>piece(x.e,s.items.indexOf(x))).join("")+'</div><div class=board>'+["📄 Χαρτί","🧴 Πλαστικό","🍃 Οργανικά"].map((e,i)=>zone("♻️",i,e)).join("")+"</div>";
 if(t==="shadows")out='<div class="board">'+zone(s.items[s.target],"static","Βρες τη σκιά","filter:grayscale(1) brightness(.4);font-size:85px")+'</div><div class=board>'+s.items.map((e,i)=>tile(e,"answer","",'data-id="'+i+'"')).join("")+"</div>";
 if(t==="phonics")out='<p class=count-text>«'+s.items[s.target][0]+'»</p><div class=board>'+s.items.map((e,i)=>tile(e[1],"answer",e[2],'data-id="'+i+'"')).join("")+"</div>";
 if(t==="market")out='<div class=story-card>🧸 Το παιχνίδι κοστίζει '+s.target+' 🪙</div><p class=prompt-counter>'+s.progress+" / "+s.target+'</p><div class=board>'+Array.from({length:s.target},(_,i)=>tile("🪙","coin","",'data-id="'+i+'" '+(s.done.includes(i)?"disabled":""))).join("")+"</div>";
 if(t==="emotions")out='<div class=story-card>'+s.items[s.target][2]+'</div><div class=board>'+shuffle([0,1,2,3]).map(i=>tile(s.items[i][1],"answer",s.items[i][0],'data-id="'+i+'"')).join("")+"</div>";
 if(t==="beebot")out='<div style="display:grid;grid-template-columns:repeat(3,78px);gap:6px">'+Array.from({length:9},(_,i)=>'<div class=tile style="min-width:78px;min-height:75px;font-size:34px">'+(s.pos===i?"🐝":i===8?"🌼":"🌿")+"</div>").join("")+'</div><div class=board>'+tile("⬆️","bee","Μπροστά",'data-id="forward"')+tile("↶","bee","Αριστερά",'data-id="left"')+tile("↷","bee","Δεξιά",'data-id="right"')+"</div>";
 if(t==="sequence")out='<div class=board>'+s.items.filter(x=>!s.done.includes(x.id)).map(x=>tile(x.e,"sequence",x.label,'data-id="'+x.id+'"')).join("")+'</div><div class=prompt-counter>Σειρά: '+s.done.map(i=>["🌅","🛝","🌙"][i]).join(" → ")+"</div>";
 board(out);
 if(t==="wipe")setupWipe();
 if(t==="xylophone"&&!s.played){s.played=true;setTimeout(playNotes,400)}
 if(["feed","sizes","cupcake","shapes","recycle"].includes(t))hint("Πάτησε αντικείμενο και μετά στόχο — ή σύρε το!");
}
function playNotes(){const s=ST.s;if(s?.type!=="xylophone")return;s.notes.forEach((n,i)=>setTimeout(()=>sound(262*Math.pow(2,n/7)),i*460))}
function setupWipe(){
 const c=$("wipe-canvas"),s=ST.s;if(!c||!s)return;const rect=c.getBoundingClientRect();c.width=Math.max(1,rect.width);c.height=Math.max(1,rect.height);const ctx=c.getContext("2d");ctx.fillStyle="#bbc6d2";ctx.fillRect(0,0,c.width,c.height);ctx.font="bold 28px sans-serif";ctx.fillStyle="#677c90";ctx.textAlign="center";ctx.fillText("ΣΚΟΥΠΙΣΕ!",c.width/2,c.height/2);
 let active=false;
 const draw=e=>{if(!active||!$("reward").hidden)return;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)*c.width/r.width,y=(e.clientY-r.top)*c.height/r.height;ctx.save();ctx.globalCompositeOperation="destination-out";ctx.beginPath();ctx.arc(x,y,40,0,Math.PI*2);ctx.fill();ctx.restore();if(++s.progress>=s.target){c.style.pointerEvents="none";completed()}};
 c.addEventListener("pointerdown",e=>{active=true;c.setPointerCapture(e.pointerId);draw(e)});c.addEventListener("pointermove",draw);c.addEventListener("pointerup",e=>{active=false;try{c.releasePointerCapture(e.pointerId)}catch{}});c.addEventListener("pointercancel",()=>active=false);
}
function match(id,z,element){
 const s=ST.s;if(!s||!ST.game||!$("reward").hidden)return;const t=s.type,n=Number(id);let ok=false;
 if(t==="feed")ok=z==="feed";
 if(t==="sizes")ok=(n===0&&z==="big")||(n===1&&z==="small");
 if(t==="cupcake"||t==="shapes")ok=n===Number(z);
 if(t==="recycle")ok=s.items[n]?.bin===Number(z);
 if(!ok){gentle(element);return}
 if(s.done.includes(n))return;s.done.push(n);s.progress++;ST.selected=null;sound(570);
 if(s.progress>=({feed:3,sizes:2,cupcake:4,shapes:3,recycle:6}[t]))completed();else render();
}
function act(a,id,el){
 const s=ST.s;if(!s||!ST.game||!$("reward").hidden)return;const t=s.type,n=Number(id);
 if(a==="repeat"){if(t==="xylophone")playNotes();else speak(s.prompt);return}
 if(a==="pop"&&t==="bubble"){if(s.done.includes(n))return;s.done.push(n);s.progress++;el.textContent=s.items[n].emoji;el.disabled=true;sound(490+n*35);if(s.progress>=s.items.length)completed();return}
 if(a==="answer"&&t==="sounds"){n===s.target?completed():gentle(el);return}
 if(a==="brush"&&t==="routine"){s.progress++;sound(320+s.progress*14);if(s.progress>=s.target)completed();else render();return}
 if(a==="answer"&&t==="patterns"){s.items[n]===s.b?completed():gentle(el);return}
 if(a==="note"&&t==="xylophone"){sound(262*Math.pow(2,n/7));if(n===s.notes[s.progress]){s.progress++;if(s.progress>=s.notes.length)completed()}else{s.progress=0;gentle(el)}return}
 if(a==="count"&&t==="balance"){if(s.done.includes(n))return;s.done.push(n);s.progress++;sound(430+s.progress*50);s.progress===s.target?completed():render();return}
 if(a==="grow"&&t==="plant"){if(n===s.progress){s.progress++;sound(420+n*80);s.progress>=3?completed():render()}else gentle(el);return}
 if(a==="move"&&t==="maze"){let next=s.pos+n;if(next<0||next>15||(Math.abs(n)===1&&Math.floor(next/4)!==Math.floor(s.pos/4))){gentle(el);return}s.pos=next;next===15?completed():render();return}
 if(a==="answer"&&["shadows","phonics","emotions"].includes(t)){n===s.target?completed():gentle(el);return}
 if(a==="coin"&&t==="market"){if(s.done.includes(n))return;s.done.push(n);s.progress++;sound(510);s.progress===s.target?completed():render();return}
 if(a==="bee"&&t==="beebot"){if(id==="left")s.direction=(s.direction+3)%4;else if(id==="right")s.direction=(s.direction+1)%4;else{const [dx,dy]=[[0,-1],[1,0],[0,1],[-1,0]][s.direction];const x=s.pos%3+dx,y=Math.floor(s.pos/3)+dy;if(x>=0&&x<3&&y>=0&&y<3)s.pos=y*3+x;else gentle(el)}s.pos===8?completed():render();return}
 if(a==="sequence"&&t==="sequence"){if(n===s.done.length){s.done.push(n);sound(460+n*100);s.done.length===3?completed():render()}else gentle(el);return}
}
