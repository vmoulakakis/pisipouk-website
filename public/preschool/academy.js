/* PISIPOUK ACADEMY — independent HTML5 module. No analytics, APIs or personal data. */
(() => {
  "use strict";
  const el = (id) => document.getElementById(id);
  const required = ["scene","daily-text","daily-date","circle-prompt","circle-choices","circle-feedback","circle-back","circle-next","garden-instruction","garden-subline","garden-counter","garden-bed","growth","bed-hint","garden-tool","garden-reset","garden-message","buddy","buddy-label","sound-toggle","read-aloud","calm-toggle","helper"];
  if (required.some((id) => !el(id))) { console.error("Pisipouk academy: missing DOM element"); return; }

  let age = 2, circleStep = 0, picks = [null,null,null], weather = "sun";
  let gardenStep = 0, paired = false, pairedTurn = 0, sound = false, calm = false, audio = null, hintCount = 0;

  const ageOptions = [2,3,4,5];
  const steps = {
    2: [
      { name:"Φύτεψε ένα σποράκι",action:"🌱 Φυτεύω", growth:"🌱", message:"Μικρό σποράκι, καλώς ήρθες!" },
      { name:"Πότισε το σποράκι",action:"💧 Ποτίζω", growth:"🌿", message:"Το νεράκι βοηθάει το φυτό!" },
      { name:"Μάζεψε τη φράουλα",action:"🍓 Μαζεύω", growth:"🍓", message:"Μια κόκκινη φράουλα μεγάλωσε!" }
    ],
    3: [
      {name:"Σκάψε το μαλακό χώμα",action:"🪏 Σκάβω",growth:"🟤",message:"Έφτιαξες χώρο για το σποράκι!"},
      {name:"Φύτεψε τον σπόρο",action:"🌰 Φυτεύω",growth:"🌱",message:"Ο σπόρος βρήκε το σπιτάκι του!"},
      {name:"Πότισε για να μεγαλώσει",action:"💧 Ποτίζω",growth:"🌻",message:"Το λουλούδι μεγάλωσε!"},
      {name:"Μάζεψε τον ώριμο καρπό",action:"🍓 Μαζεύω",growth:"🍓",message:"Ο καρπός είναι έτοιμος!"}
    ],
    4: [
      {name:"Σκάψε το παρτέρι",action:"🪏 Σκάβω",growth:"🟤",message:"Το χώμα είναι έτοιμο!"},
      {name:"Βάλε τον σπόρο στο χώμα",action:"🌰 Φυτεύω",growth:"🌰",message:"Τώρα έχει χώρο να μεγαλώσει!"},
      {name:"Δώσε λίγο νερό",action:"💧 Ποτίζω",growth:"🌱",message:"Βλέπεις το μικρό βλαστάρι;"},
      {name:"Βοήθησε το φυτό με τον ήλιο",action:"☀️ Φως",growth:"🌼",message:"Με το φως ανθίζει!"},
      {name:"Μάζεψε τη φράουλα",action:"🍓 Μαζεύω",growth:"🍓",message:"Ο κύκλος ολοκληρώθηκε!"}
    ],
    5: [
      {name:"Ετοίμασε το χώμα: πρώτο βήμα",action:"🪏 Σκάβω",growth:"🟤",message:"Ετοίμασες το παρτέρι!"},
      {name:"Φύτεψε: τι χρειάζεται μετά;",action:"🌰 Φυτεύω",growth:"🌰",message:"Ο σπόρος μας περιμένει!"},
      {name:"Πότισε με φροντίδα",action:"💧 Ποτίζω",growth:"🌱",message:"Το νερό απορροφήθηκε!"},
      {name:"Δώσε του φως για να ανθίσει",action:"☀️ Φως",growth:"🌼",message:"Φως και νερό κάνουν θαύματα!"},
      {name:"Παρατήρησε και μάζεψε τον καρπό",action:"🍓 Συγκομιδή",growth:"🍓",message:"Μπορείς να πεις όλα τα βήματα;"}
    ]
  };

  const months = [
    { title:"Χειμωνιάτικη αγκαλιά", mission:"Παρατήρησε τι αλλάζει στη φύση τον χειμώνα." },
    { title:"Τα συναισθήματά μου", mission:"Ζωγράφισε ένα προσωπάκι και πες πώς νιώθει." },
    { title:"Η άνοιξη έρχεται", mission:"Ψάξε για ένα μικρό σημάδι της άνοιξης." },
    { title:"Μικροί κηπουροί", mission:"Μάθε τι χρειάζεται ένα λουλούδι για να μεγαλώσει." },
    { title:"Οι φίλοι των λουλουδιών", mission:"Παρατήρησε προσεκτικά ένα φύλλο ή ένα λουλούδι." },
    { title:"Καλοκαιρινή θάλασσα", mission:"Βρες στο σπίτι δύο πράγματα με γαλάζιο χρώμα." },
    { title:"Ο ήλιος και η σκιά", mission:"Κοίτα πώς αλλάζει η σκιά έξω, μαζί με ενήλικο." },
    { title:"Καλοκαιρινά φρούτα", mission:"Πες το χρώμα από το αγαπημένο σου καλοκαιρινό φρούτο." },
    { title:"Ξανά μαζί στο σχολείο", mission:"Διάλεξε έναν τρόπο να πεις καλημέρα." },
    { title:"Οι πρώτες σταγόνες", mission:"Παρατήρησε σύννεφα, φύλλα και τα πρώτα φθινοπωρινά χρώματα." },
    { title:"Από την ελιά στο λαδάκι", mission:"Βρες το πράσινο χρώμα σε ένα φύλλο ελιάς." },
    { title:"Μικρές πράξεις αγάπης", mission:"Σκέψου έναν ευγενικό τρόπο να βοηθήσεις κάποιον." }
  ];
  const secondMission = [
    "Σχημάτισε δύο φύλλα με τα δάχτυλά σου.",
    "Πες μία ιστορία για τον Τίτο.",
    "Διάλεξε δύο χρώματα και συνδύασέ τα.",
    "Βρες ένα στρογγυλό αντικείμενο στο δωμάτιο.",
    "Φτιάξε μια αγκαλιά με τα χέρια σου.",
    "Μέτρησε μέχρι το τρία μαζί με τον Πισιπούκ.",
    "Βρες κάτι μαλακό και κάτι σκληρό."
  ];

  function athensDate() {
    try {
      const parts = new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Athens",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
      const p = Object.fromEntries(parts.map(v=>[v.type,v.value]));
      return { key:p.year+"-"+p.month+"-"+p.day, month:Number(p.month), day:Number(p.day) };
    } catch {
      const d = new Date();
      return {key:d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"),month:d.getMonth()+1,day:d.getDate()};
    }
  }
  function hash(text) {
    let value = 2166136261;
    for (let i=0;i<text.length;i++) { value ^= text.charCodeAt(i); value = Math.imul(value,16777619); }
    return value>>>0;
  }
  function daily() {
    const now = athensDate();
    const special = now.month===10&&now.day===28 ? {title:"Μιλάμε για την ειρήνη",mission:"Φτιάξε με τα χέρια σου ένα περιστέρι της ειρήνης."} : null;
    const base = special || months[now.month-1];
    const rotation = secondMission[hash(now.key+"|"+age)%secondMission.length];
    el("daily-text").textContent = base.title+" · "+(age<=3?base.mission:rotation);
    el("daily-date").textContent = now.day+"/"+now.month+" · "+(age)+"–"+(age+1)+" ετών";
  }
  const circle = [
    {prompt:"Τι καιρό κάνει σήμερα έξω από το παράθυρο;",options:[
      {label:"Ήλιος",pic:"☀️",key:"sun",tip:"Ένας φωτεινός ουρανός!"},
      {label:"Σύννεφα",pic:"☁️",key:"cloud",tip:"Τα σύννεφα αλλάζουν σχήματα!"},
      {label:"Βροχή",pic:"🌧️",key:"rain",tip:"Οι σταγόνες ποτίζουν τη γη!"},
      {label:"Χιόνι",pic:"❄️",key:"snow",tip:"Τα χιονονιφάδες είναι μοναδικές!"}
    ]},
    {prompt:"Πώς νιώθεις αυτή τη στιγμή;",options:[
      {label:"Χαρά",pic:"😊",key:"happy",tip:"Χαίρομαι που το μοιράζεσαι!"},
      {label:"Ηρεμία",pic:"😌",key:"calm",tip:"Μπορούμε να παίξουμε ήρεμα."},
      {label:"Νύστα",pic:"😴",key:"sleepy",tip:"Μια μικρή ξεκούραση κάνει καλό."},
      {label:"Θυμό",pic:"😠",key:"angry",tip:"Όλα τα συναισθήματα έχουν θέση εδώ."},
      {label:"Μια αγκαλιά",pic:"🤗",key:"hug",tip:"Μπορείς να ζητήσεις μια αγκαλιά από έναν ενήλικο."}
    ]},
    {prompt:"Τι μικρή αποστολή θα κάνεις μακριά από την οθόνη;",options:[
      {label:"Νεράκι",pic:"🥤",key:"drink",tip:"Ας κάνουμε μια μικρή παύση για νερό."},
      {label:"Ένα χρώμα",pic:"🎨",key:"find",tip:"Βρες στο δωμάτιο κάτι πράσινο!"},
      {label:"Μια καλημέρα",pic:"👋",key:"greet",tip:"Χάρισε ένα χαμόγελο ή μια καλημέρα!"}
    ]}
  ];

  function paintCircle() {
    const scene = circle[circleStep];
    el("circle-prompt").textContent=scene.prompt;
    document.querySelectorAll("[data-dot]").forEach((d,i)=>d.classList.toggle("on",i<=circleStep));
    const wrap=el("circle-choices");
    wrap.replaceChildren();
    scene.options.forEach((option)=>{
      const button=document.createElement("button");
      button.type="button";
      button.className="choice"+(picks[circleStep]===option.key?" active":"");
      button.setAttribute("aria-pressed",String(picks[circleStep]===option.key));
      const pic=document.createElement("span");pic.className="choice-pic";pic.textContent=option.pic;
      const label=document.createElement("span");label.textContent=option.label;
      button.append(pic,label);
      button.addEventListener("click",()=>{
        picks[circleStep]=option.key;
        if(circleStep===0){weather=option.key;el("scene").dataset.weather=weather;}
        el("circle-feedback").textContent=option.tip;
        // Select choice without resetting the focus of this button.
        wrap.querySelectorAll(".choice").forEach(b=>{b.classList.remove("active");b.setAttribute("aria-pressed","false");});
        button.classList.add("active");button.setAttribute("aria-pressed","true");
        el("circle-next").disabled=false;
        ping(570);
      });
      wrap.append(button);
    });
    el("circle-back").disabled=circleStep===0;
    el("circle-next").disabled=!picks[circleStep];
    el("circle-next").textContent=circleStep===2?"🌱 Πάμε στον κήπο!":"Συνέχεια →";
    el("circle-feedback").textContent=picks[circleStep]?"Ωραία επιλογή!":"Διάλεξε μία εικόνα — δεν υπάρχει λάθος.";
  }

  function currentActions(){return steps[age];}
  function paintGarden(){
    const tasks=currentActions(),finished=gardenStep>=tasks.length;
    const t=finished?null:tasks[gardenStep];
    el("garden-instruction").textContent=finished?"🎉 Το περιβολάκι μας μεγάλωσε!":t.name+".";
    el("garden-subline").textContent=finished?"Μπορείς να ξεκινήσεις ένα νέο περιβολάκι.":age===2?"Άγγιξε το παρτέρι ή το κουμπί.":"Πατάμε ένα βήμα κάθε φορά.";
    el("garden-counter").textContent=(finished?tasks.length:gardenStep+1)+" / "+tasks.length;
    el("garden-tool").disabled=finished;
    el("garden-tool").textContent=finished?"🌟 Ολοκληρώθηκε!":t.action;
    const growth=el("growth"),bed=el("garden-bed");
    growth.textContent=gardenStep===0?"":tasks[Math.min(gardenStep,tasks.length)-1].growth;
    bed.className="garden-bed stage-"+Math.min(gardenStep,5);
    el("bed-hint").textContent=finished?"Μπράβο!":"Άγγιξέ με!";
    bed.disabled=finished;
    const player=paired?" · Σειρά "+(pairedTurn%2===0?"Παιδιού Α":"Παιδιού Β"):"";
    el("buddy-label").textContent=paired?"🤝 Παίζουμε εναλλάξ στην ίδια συσκευή"+player:"";
  }
  function ping(f=440){
    if(!sound)return;
    try{
      const C=window.AudioContext||window.webkitAudioContext;
      if(!C)return;
      audio ||= new C();
      if(audio.state==="suspended")audio.resume().catch(()=>{});
      const o=audio.createOscillator(),g=audio.createGain();
      o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(.08,audio.currentTime);
      g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.2);
      o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+.21);
    }catch{}
  }
  function actGarden(){
    const tasks=currentActions();
    if(gardenStep>=tasks.length)return;
    const step=tasks[gardenStep];
    gardenStep++;pairedTurn++;
    el("garden-message").textContent=(paired?"🤝 ":"")+step.message+(gardenStep===tasks.length?" 🌟 Μπράβο για την προσπάθεια!":"");
    paintGarden();
    const b=el("garden-bed");b.classList.add("pop");
    ping(370+gardenStep*75);
  }
  function resetGarden(){
    gardenStep=0;pairedTurn=0;hintCount=0;
    el("garden-message").textContent="Ο Πισιπούκ κι ο Τίτος είναι δίπλα σου!";
    paintGarden();
  }
  function companion(){
    hintCount++;
    const tasks=currentActions();
    const hint=gardenStep>=tasks.length ? "Τα κατάφερες! Θέλεις να ξεκινήσουμε ένα νέο περιβολάκι;" :
      gardenStep===0 ? "Χμμ! Πού να βάλουμε τον σπόρο; Μήπως στο χώμα; Δοκίμασε να αγγίξεις το παρτέρι!" :
      "Εγώ ο Τίτος μπερδεύτηκα! Νομίζω πως μετά έρχεται: "+tasks[gardenStep].name.toLowerCase()+". Τι λες;";
    el("garden-message").textContent="🐿️ Ο Τίτος λέει: «"+hint+"»";
    ping(440);
  }
  function readCurrent(){
    const target=document.activeElement?.closest?.("#garden") ? el("garden-instruction") : document.activeElement?.closest?.("#circle") ? el("circle-prompt") : el("garden-instruction");
    if(!("speechSynthesis" in window)){el("garden-message").textContent="Η συσκευή δεν διαθέτει εκφώνηση. Οι οδηγίες φαίνονται στην οθόνη.";return;}
    try{
      window.speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(target.textContent);
      u.lang="el-GR";u.rate=.84;u.pitch=1.08;
      window.speechSynthesis.speak(u);
    }catch{el("garden-message").textContent="Η εκφώνηση δεν είναι διαθέσιμη στη συσκευή.";}
  }
  function setAge(next){
    if(!ageOptions.includes(next))return;
    age=next;
    document.querySelectorAll("[data-age]").forEach(b=>{
      const on=Number(b.dataset.age)===age;
      b.classList.toggle("selected",on);b.setAttribute("aria-pressed",String(on));
    });
    resetGarden();daily();
  }
  document.querySelectorAll("[data-age]").forEach(b=>b.addEventListener("click",()=>setAge(Number(b.dataset.age))));
  el("circle-back").addEventListener("click",()=>{if(circleStep>0){circleStep--;paintCircle();}});
  el("circle-next").addEventListener("click",()=>{
    if(!picks[circleStep])return;
    if(circleStep===2){el("garden").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});return;}
    circleStep++;paintCircle();
  });
  el("garden-bed").addEventListener("click",actGarden);
  el("garden-tool").addEventListener("click",actGarden);
  el("garden-reset").addEventListener("click",resetGarden);
  el("helper").addEventListener("click",companion);
  el("buddy").addEventListener("click",()=>{paired=!paired;el("buddy").setAttribute("aria-pressed",String(paired));el("buddy").textContent=paired?"🤝 Παρέα: ανοιχτή":"🤝 Παίζουμε δύο μαζί";paintGarden();});
  el("sound-toggle").addEventListener("click",()=>{sound=!sound;el("sound-toggle").setAttribute("aria-pressed",String(sound));el("sound-toggle").textContent=sound?"🔊 Ήχοι ανοιχτοί":"🔇 Ήχοι κλειστοί";if(sound)ping(520);});
  el("read-aloud").addEventListener("click",readCurrent);
  el("calm-toggle").addEventListener("click",()=>{calm=!calm;document.body.classList.toggle("calm",calm);el("calm-toggle").setAttribute("aria-pressed",String(calm));el("calm-toggle").textContent=calm?"☀️ Κανονική λειτουργία":"🌙 Ήρεμη λειτουργία";});
  document.addEventListener("visibilitychange",()=>{if(document.hidden&&window.speechSynthesis)window.speechSynthesis.cancel();});
  paintCircle();resetGarden();daily();
})();
