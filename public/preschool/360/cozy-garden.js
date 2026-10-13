/* PISIPOUK 360 / Το Μικρό Μου Περιβολάκι
 * Original Three.js WebGL toddler game. Built for mouse+touch with no external API.
 * Local game state only; all Three.js objects built procedurally on-device.
 */
(function(){
 "use strict";
 const $=id=>document.getElementById(id);
 const engine=window.PisipoukRandom;
 const ui={canvas:$("farm-canvas"),stage:$("stage"),status:$("status"),progress:$("progress"),
  quest:$("quest-text"),title:$("quest-title"),icon:$("quest-icon"),splash:$("splash"),mute:$("mute"),fallback:$("fallback")};
 const C=engine?.colors||[],SEEDS=engine?.seeds||[];
 const THREE=window.THREE;
 const parameters=new URLSearchParams(location.search);
 const config={game:["C09","A01","B05"].includes(parameters.get("game"))?parameters.get("game"):"C09",
   age:["2-3","3-4","4-5"].includes(parameters.get("age"))?parameters.get("age"):"3-4",
   seed:Number(parameters.get("seed"))>>>0||engine?.cryptoSeed?.()||42};
 const state={started:false,mode:"guided",game:config.game,age:config.age,seed:config.seed,index:0,round:null,
   history:[],phase:"IDLE",selected:null,progress:0,tool:"plant",weather:"sun",muted:true,
   isDrag:false,down:null,plants:[],dropped:[],speaking:false,celebration:0,particles:[],events:[],
   pending:[],elapsed:0,reduce:matchMedia("(prefers-reduced-motion: reduce)").matches,quality:"normal"};
 let scene,camera,renderer,controls,clock,raycaster,pointer,ambient=[],active=[],planted=[],fruitItems=[],
   plots=[],crates=[],clickables=[],waterwheel,bee,beeWing,sheep,sky,smoke,barn,tree,decor=[],animation=0,
   gameTime=0,oldTime=0,planner=null,context=null,selectGlow=null,supportsWebGL=false;
 const palette={wood:0xc39a6b,woodLight:0xe8c99b,grass:0x85bb72,dark:0x54795b,cream:0xfff2d0};
 function fail(message){
  console.error("[PISIPOUK 360]",message);document.body.dataset.gameReady="failed";ui.fallback.hidden=false;
  ui.status.textContent="Ο τρισδιάστατος κόσμος δεν φορτώθηκε. Χρησιμοποίησε τα μεγάλα κουμπιά.";
  parent.postMessage({type:"PISIPOUK_FARM_FAILED"},"*");
 }
 function material(hex,roughness=.82){return new THREE.MeshStandardMaterial({color:hex,roughness,metalness:0,flatShading:true});}
 function mesh(geo,mat,shadow=true){const m=new THREE.Mesh(geo,mat);m.castShadow=shadow;m.receiveShadow=shadow;return m;}
 function box(w,h,d,c){return mesh(new THREE.BoxGeometry(w,h,d),material(c));}
 function ball(r,c,w=10,h=8){return mesh(new THREE.SphereGeometry(r,w,h),material(c));}
 function disc(r,h,c,segments=12){return mesh(new THREE.CylinderGeometry(r,r,h,segments),material(c));}
 function put(parent,o,x,y,z){o.position.set(x,y,z);parent.add(o);return o;}
 function group(){return new THREE.Group();}
 function mark(root,type,data={}){root.userData.interactive={type,...data};clickables.push(root);return root;}
 function clearArray(arr){arr.forEach(x=>{x.parent?.remove(x);x.traverse?.(c=>{c.geometry?.dispose?.();if(c.material&&c.material!==undefined){if(Array.isArray(c.material))c.material.forEach(m=>m.dispose?.());else c.material.dispose?.();}})});arr.length=0;}
 function addToActive(o){scene.add(o);active.push(o);return o;}
 function createTerrain(){
  scene.background=new THREE.Color(0xb8e5f4);scene.fog=new THREE.Fog(0xcde8de,20,52);
  put(scene,disc(7.7,1.13,0xb69a76,16),0,-.67,0);
  put(scene,disc(7.85,.40,0x81b66d,16),0,-.06,0);
  const ring=mesh(new THREE.TorusGeometry(7.6,.13,6,24),material(0x6e995d));
  put(scene,ring,0,.13,0);ring.rotation.x=Math.PI/2;
  const pebbleColors=[0xe9d8a6,0xc8b1a5,0xe8d5bf,0xa6bba3];
  for(let i=0;i<54;i++){
   const t=i*2.399,r=5.8+((i*7)%10)*.1,x=Math.sin(t)*r,z=Math.cos(t)*r;
   const p=ball(.13+(i%4)*.055,pebbleColors[i%4],7,6);p.scale.y=.6;put(scene,p,x,.20,z);decor.push(p);
  }
  for(let i=0;i<35;i++){
   const t=i*2.53,r=4+((i*5)%19)*.16,x=Math.sin(t)*r,z=Math.cos(t)*r;
   if(z>-1&&z<2.7&&Math.abs(x)<5.4)continue;
   const grass=group();
   for(let j=0;j<3;j++){const leaf=mesh(new THREE.ConeGeometry(.085,.35,4),material(i%3?0x679c64:0x9ec47a),false);put(grass,leaf,(j-1)*.11,.18,0);leaf.rotation.z=(j-1)*.2;}
   put(scene,grass,x,.15,z);decor.push(grass);
  }
  const river=disc(1.8,.07,0x83cdd5,20);river.scale.set(1.2,1,.86);put(scene,river,5.55,.17,-3.9);
  const inner=disc(1.25,.08,0x68b9c8,20);put(scene,inner,5.7,.20,-3.9);
  // Barn silhouette and blue roof, intentionally original 3D chunky-toy geometry.
  barn=group();
  put(barn,box(2.7,2.0,2.0,0xd78362),0,1.25,0);
  const roof=mesh(new THREE.ConeGeometry(2.15,1.28,4),material(0x618fa1));roof.rotation.y=Math.PI/4;
  put(barn,roof,0,2.80,0);
  put(barn,box(.95,1.22,.05,0xf5d5a2),0,.91,1.03);
  put(barn,box(.13,1.22,.07,0x987052),0,.91,1.08);
  put(barn,box(.95,.12,.06,0x987052),0,1.52,1.08);
  for(let side of [-1,1]){const win=put(barn,box(.48,.5,.08,0x8fdbda),side*.91,1.74,1.04);
   put(barn,box(.54,.11,.11,0xfde7c2),side*.91,1.74,1.11);}
  put(scene,barn,-3.75,.19,-3.7);barn.rotation.y=.23;
  // Windmill / wheel with real geometric spokes.
  waterwheel=group();const hub=put(waterwheel,disc(.21,.4,0xd9b379,10),0,0,0);hub.rotation.x=Math.PI/2;
  for(let i=0;i<8;i++){let a=i*Math.PI/4,rod=box(.13,1.22,.19,0xb9895a);rod.rotation.z=-a;put(waterwheel,rod,Math.sin(a)*.57,Math.cos(a)*.57,0);}
  const wheelRing=mesh(new THREE.TorusGeometry(1.14,.15,7,16),material(0xc89a65));put(waterwheel,wheelRing,0,0,0);
  put(scene,waterwheel,5.4,1.58,-3.45);
  const stand=put(scene,box(.35,1.05,.40,0xb28b6f),5.4,.63,-3.45);
  // Reusable growing spots and their padded invisible hit area.
  for(let i=0;i<5;i++){
   const x=(i-2)*2.20,z=1.13;
   const root=group();
   const soil=put(root,disc(.76,.18,0x9c7658,20),0,.25,0);
   const border=mesh(new THREE.TorusGeometry(.76,.12,5,24),material(0xe4bd86));
   border.rotation.x=Math.PI/2;put(root,border,0,.35,0);
   const hit=mesh(new THREE.CylinderGeometry(.95,.95,.6,14),new THREE.MeshBasicMaterial({visible:false}));
   put(root,hit,0,.49,0);
   put(scene,root,x,.10,z);mark(root,"plot",{slot:i});plots.push(root);
  }
  // Fruit tree and friendly sheep.
  tree=group();put(tree,disc(.24,2.8,0x9a7860,8),0,1.52,0);
  for(let i=0;i<6;i++){const a=i*Math.PI*2/6;put(tree,ball(1.05,i%2?0x88b66f:0x79a76e,9,7),Math.cos(a)*.83,2.86+((i%3)-1)*.31,Math.sin(a)*.83);}
  put(scene,tree,3.65,.2,-3.7);
  sheep=group();put(sheep,ball(.57,0xfff2dd,12,9),0,.79,0);
  put(sheep,ball(.36,0xffead0,10,8),-.41,1.00,.31);
  for(let a of [-1,1]){put(sheep,box(.13,.40,.17,0xa38669),a*.33,.40,.23);
    put(sheep,ball(.20,0xeac5ab,8,7),-.48+a*.20,1.18,.29);}
  for(let eye of [-1,1])put(sheep,ball(.046,0x382d29,7,6),-.67,1.09,eye*.16+.32);
  put(scene,sheep,-6.25,.16,-.6);
  bee=group();put(bee,ball(.22,0xfbd15e,12,9),0,0,0);
  for(let x of [-.07,.07])put(bee,box(.07,.28,.22,0x6c5940),x,0,.03);
  for(let x of [-.15,.15]){beeWing=put(bee,ball(.19,0xe2f9f7,8,6),x,.23,0);beeWing.scale.set(1,.31,.7);}
  put(scene,bee,3.1,3.3,-.5);
 }
 function createCameraAndLights(){
  camera=new THREE.PerspectiveCamera(43,1,.1,100);camera.position.set(0,10.5,17.8);camera.lookAt(0,.7,0);
  scene.add(new THREE.HemisphereLight(0xffefcf,0x6d966e,1.85));
  const sun=new THREE.DirectionalLight(0xffebbf,2.7);sun.position.set(-4,12,6);
  sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-12;sun.shadow.camera.right=12;sun.shadow.camera.top=12;sun.shadow.camera.bottom=-12;sun.shadow.bias=-.0008;scene.add(sun);
  const fill=new THREE.DirectionalLight(0x9ad6ed,.85);fill.position.set(5,5,-5);scene.add(fill);
  const floor=mesh(new THREE.PlaneGeometry(200,200),material(0xc6dccd),false);floor.rotation.x=-Math.PI/2;
  floor.receiveShadow=true;put(scene,floor,0,-1.3,0);
  controls=new THREE.OrbitControls(camera,ui.canvas);controls.target.set(0,.75,-.15);controls.enableDamping=true;controls.dampingFactor=.075;
  controls.maxPolarAngle=1.33;controls.minPolarAngle=.47;controls.minDistance=10.5;controls.maxDistance=24;
  controls.enablePan=false;controls.rotateSpeed=.55;controls.enableZoom=true;
 }
 function setQuality(){
  const mobile=innerWidth<780||/Android|iPad|iPhone/i.test(navigator.userAgent);
  const slow=mobile||state.reduce;state.quality=slow?"lite":"normal";
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,slow?1.35:1.75));
  renderer.shadowMap.enabled=!state.reduce;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 }
 function resize(){
  if(!renderer)return;
  const w=Math.max(1,ui.canvas.clientWidth),h=Math.max(1,ui.canvas.clientHeight);
  renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
 }
 function sound(kind="pop",freq=392){
  if(state.muted)return;
  try{
   const AudioContextCtor=window.AudioContext||window.webkitAudioContext;
   if(!AudioContextCtor)return;
   context=context||new AudioContextCtor();if(context.state==="suspended")context.resume();
   let o=context.createOscillator(),g=context.createGain(),t=context.currentTime;
   o.type=kind==="boing"?"triangle":"sine";o.frequency.setValueAtTime(freq,t);
   o.frequency.exponentialRampToValueAtTime(kind==="boing"?freq*.6:freq*1.45,t+.18);
   g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.085,t+.026);
   g.gain.exponentialRampToValueAtTime(.001,t+.34);o.connect(g);g.connect(context.destination);
   o.start(t);o.stop(t+.35);o.onended=()=>{o.disconnect();g.disconnect();};
  }catch(e){console.debug("Audio unavailable:",e);}
 }
 function speak(s){if(!s||state.muted||!("speechSynthesis"in window))return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s);u.lang="el-GR";u.rate=.87;u.pitch=1.1;
   state.speaking=true;u.onend=()=>{state.speaking=false;};u.onerror=()=>{state.speaking=false;};speechSynthesis.speak(u);
  }catch{state.speaking=false;}}
 function setStatus(s){ui.status.textContent=s;}
 function setTool(t){state.tool=t;document.querySelectorAll("[data-tool]").forEach(b=>b.classList.toggle("selected",b.dataset.tool===t));
  const hints={plant:"Άγγιξε ένα παρτέρι για να φυτέψεις!",water:"Άγγιξε ή σύρε το νερό πάνω σε ένα φυτό.",sun:"Άλλαξε τον καιρό και δες τα φυτά να μεγαλώνουν!",bee:"Άγγιξε το λουλούδι για να έρθει η μελισσούλα!"};setStatus(hints[t]||"Παίζουμε!");}
 function clearRound(){
  clearArray(active);clickables=plots.slice();fruitItems=[];crates=[];state.dropped=[];
  state.selected=null;state.progress=0;ui.progress.textContent="";
 }
 function initRound(restart=false){
  clearRound();if(restart)state.index=0;
  state.round=engine.makeRound(state.game,state.age,state.seed,state.index++,state.history);
  state.history.push(engine.roundKey(state.round));if(state.history.length>12)state.history.shift();
  planner=new engine.SurprisePlanner(state.round.seed^state.index);
  const count=state.round.goal.count;
  state.phase="SELECTION";
  const names={C09:"Το Μικρό Μου Περιβολάκι",A01:"Τα Καλάθια των Χρωμάτων",B05:"Μετράω τα Μήλα"};
  ui.title.textContent=names[state.game];
  ui.icon.textContent=state.game==="C09"?"🌱":state.game==="A01"?"🧺":"🍎";
  ui.quest.textContent=state.mode==="free"?"Πειραματίσου! Διάλεξε ό,τι θέλεις.":state.round.narrationKey;
  if(state.game==="C09"){showGarden();setTool(state.round.templateId==="care"?"water":"plant");}
  if(state.game==="A01"||state.game==="B05"){showFruitRound();}
  if(state.game==="C09"&&state.round.templateId==="care")addPlant(2,state.round.plantId,.74,true);
  state.phase="INTERACTION";
  setStatus("Ανακάλυψε, δοκίμασε και παίξε όσο θέλεις!");
  ui.progress.textContent=state.game==="C09"?"":("0 / "+count);
 }
 function showGarden(){plots.forEach(p=>p.visible=true);}
 function createApple(hex,id,x,y,z){
  const g=group(),main=put(g,ball(.37,hex,12,9),0,0,0);main.scale.set(.90,1.05,.85);
  put(g,box(.09,.15,.08,0x8b6b3b),0,.40,0);
  const l=ball(.16,0x65995d,7,6);l.scale.set(1,.27,.6);l.rotation.z=.56;put(g,l,.14,.46,0);
  g.position.set(x,y,z);g.userData.apple=id;return mark(g,"apple",{id});
 }
 function crate(colorHex,x,z,isTarget){
  const b=group();put(b,box(1.65,.43,1.08,0xcfa16d),0,.38,0);
  put(b,box(1.78,.17,1.18,0xe9bc7f),0,.60,0);
  put(b,box(1.30,.035,.82,colorHex),0,.705,0);
  put(b,box(.12,.4,.1,0x9e6e49),-.78,.38,.51);put(b,box(.12,.4,.1,0x9e6e49),.78,.38,.51);
  b.position.set(x,.2,z);b.userData.target=isTarget;
  mark(b,"basket",{target:isTarget});return addToActive(b);
 }
 function showFruitRound(){
  plots.forEach(p=>p.visible=false);
  const spec=state.round,goalColor=C.find(c=>c.id===spec.goal.color)||C[0];
  const target=crate(goalColor.hex,1.25,2.7,true);crates.push(target);
  const other=crate(0xb6a293,-1.25,2.7,false);crates.push(other);
  const source=spec.objects.slice(0,8);
  source.forEach((item,i)=>{
   const color=C.find(c=>c.id===item.color)||C[0];
   let x=-4.9+i*1.47,z=.35,y=.60;const a=createApple(color.hex,item.id,x,y,z);
   a.userData.data=item;addToActive(a);fruitItems.push(a);
  });
  ui.quest.textContent=spec.narrationKey;
  setStatus("Άγγιξε ένα φρούτο και μετά το καλαθάκι. Μπορείς και να το σύρεις.");
 }
 function makeFlower(species,progress){
  const g=group(),kind=SEEDS.find(s=>s.id===species)||SEEDS[0];
  const stem=put(g,mesh(new THREE.CylinderGeometry(.07,.10,1.52,7),material(0x64a66d)),0,.82,0);
  for(let i=0;i<3;i++){
   const leaf=ball(.26,i%2?0x6d9d69:0x86b977,9,6);leaf.scale.set(1,.25,.7);
   put(g,leaf,(i%2?-.26:.26),.65+i*.34,0);leaf.rotation.z=i%2?-.3:.3;
  }
  const head=group();const petalColor=material(kind.flower);
  for(let i=0;i<9;i++){
   const a=i*Math.PI*2/9;let petal=mesh(new THREE.SphereGeometry(.23,8,6),petalColor);
   petal.scale.set(.77,1.1,.31);petal.rotation.z=-a;
   put(head,petal,Math.cos(a)*.36,Math.sin(a)*.36,0);
  }
  put(head,ball(.25,species==="sunflower"?0x78543f:0xf3b862,9,7),0,0,.06);
  put(g,head,0,1.65,0);g.scale.setScalar(progress);return g;
 }
 function addPlant(slot,species,initialGrowth=.15,existing=false){
  if(state.plants.some(p=>p.slot===slot))return null;
  const meshObj=makeFlower(species,initialGrowth);
  meshObj.position.set((slot-2)*2.20,.44,1.13);
  const p={slot,species,growth:initialGrowth,moisture:existing?0.30:0,mesh:meshObj,watered:false};
  scene.add(meshObj);planted.push(meshObj);state.plants.push(p);
  return p;
 }
 function removePlantVisuals(){for(const ob of planted){ob.parent?.remove(ob);ob.traverse(c=>c.geometry?.dispose?.());}planted=[];state.plants=[];}
 function reward(x=0,y=1.6,z=1.5){
  for(let i=0;i<16;i++){
   const dot=mesh(new THREE.OctahedronGeometry(.08+(i%3)*.025),new THREE.MeshBasicMaterial({color:[0xf6d466,0xe99b8d,0x93cbb4,0xbba6dd][i%4]}),false);
   put(scene,dot,x,y,z);state.particles.push({o:dot,elapsed:0,vx:Math.sin(i*2.4)*2.4,vy:1.5+Math.random()*2.1,vz:Math.cos(i*2.4)*2.4});
  }
  sound("chime",525);
 }
 function complete(){
  if(state.mode==="free"){reward();return;}
  if(state.progress<(state.round?.goal.count||1))return;
  state.phase="REWARD";state.celebration=gameTime+1.6;
  reward(0,2,1);
  setStatus("Υπέροχα! Μπορείς να παίξεις ξανά ή να διαλέξεις ΝΕΟ!");
  ui.progress.textContent="✨ Το κατάφερες!";
  ui.quest.textContent="Μπράβο! Παίζουμε κι άλλο;";
  if(!state.muted)speak("Μπράβο! Συνέχισε όπως σου αρέσει.");
 }
 function onGarden(type,slot){
  if(state.game!=="C09")return;
  if(state.tool==="plant"){
   let existing=state.plants.find(p=>p.slot===slot);
   if(existing){setStatus("Αυτό το παρτέρι έχει ήδη λουλούδι! Δοκίμασε δίπλα.");sound("boing",225);return;}
   const species=state.round?.plantId||"flower",p=addPlant(slot,species);
   if(p){reward((slot-2)*2.2,1,1);setStatus("Μπράβο! Φύτεψες ένα λουλουδάκι! Τώρα μπορείς να το ποτίσεις.");
    if(state.phase!=="REWARD"&&(state.round.templateId==="plant"||state.mode==="free")){state.progress++;complete();}}
  } else if(state.tool==="water"){
   let p=state.plants.find(p=>p.slot===slot);
   if(!p){p=addPlant(slot,"flower",.15);setStatus("Τώρα υπάρχει ένα φυτό. Πότισέ το!");return;}
   p.moisture=Math.min(1,p.moisture+.42);p.watered=true;p.growth=Math.min(1.6,p.growth+.09);
   reward((slot-2)*2.2,1,1.4);
   if(state.phase!=="REWARD"&&(state.round.templateId==="care"||state.mode==="free")){state.progress++;complete();}
  } else if(state.tool==="sun"){
   state.weather=state.weather==="sun"?"rain":"sun";
   setStatus(state.weather==="rain"?"Ήρθε μια απαλή βροχή!":"Ο ήλιος ζεσταίνει τον κήπο!");
   state.plants.forEach(p=>{p.growth=Math.min(1.6,p.growth+.08);p.moisture=Math.min(1,p.moisture+.08);});
   if(state.round.templateId==="explore"&&state.phase!=="REWARD"){state.progress++;complete();}
  } else if(state.tool==="bee"){
   const p=state.plants.find(p=>p.slot===slot);
   if(p){bee.position.set((slot-2)*2.2,2.8,1.13);reward((slot-2)*2.2,1.7,1.13);
    setStatus("Η μελισσούλα επισκέφτηκε το λουλούδι!");}
   else setStatus("Πρώτα μπορούμε να φυτέψουμε ένα λουλούδι για τη μελισσούλα.");
  }
 }
 function targetFruit(root){
  const data=root.userData.data;
  if(!data||state.dropped.includes(data.id))return;
  if(state.mode!=="free"&&data.color!==state.round.goal.color){
   sound("boing",185);setStatus("Αυτό το φρούτο έχει άλλο χρώμα. Μπορείς να δοκιμάσεις ξανά!");
   root.scale.setScalar(1.13);setTimeout(()=>{if(root.parent)root.scale.setScalar(1)},170);return;
  }
  state.dropped.push(data.id);root.visible=false;
  if(state.mode==="free"){setStatus("Ωραία επιλογή! Δοκίμασε κι άλλο φρούτο.");reward(root.position.x,1.3,1);return;}
  state.progress++;ui.progress.textContent=state.progress+" / "+state.round.goal.count;
  reward(root.position.x,1.2,1);
  if(state.progress>=state.round.goal.count)complete();
  else setStatus("Μπράβο! Συνέχισε να ψάχνεις.");
 }
 function clickInteraction(hit,target){
  if(!hit)return;
  if(hit.type==="plot"){onGarden(hit.type,hit.slot);return;}
  if(hit.type==="apple"){
   const item=fruitItems.find(a=>a.userData.interactive?.id===hit.id);
   if(item&&item.visible){state.selected=item;
    if(state.game==="B05"||state.mode==="free")targetFruit(item);
    else setStatus("Επέλεξες φρούτο. Πάτησε το καλαθάκι ή σύρε το μέσα.");}
  }
  if(hit.type==="basket"&&state.selected){
   if(hit.target)targetFruit(state.selected);
   else {sound("boing",230);setStatus("Δοκίμασε το καλαθάκι με το χρώμα της αποστολής.");}
   state.selected=null;
  }
 }
 function getHit(clientX,clientY){
  if(!renderer||!camera)return null;
  const rect=renderer.domElement.getBoundingClientRect();
  pointer.x=((clientX-rect.left)/rect.width)*2-1;
  pointer.y=-((clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  const found=raycaster.intersectObjects(clickables.filter(g=>g.visible),true);
  if(found.length){let o=found[0].object;while(o&&!o.userData?.interactive)o=o.parent;
   if(o?.userData?.interactive)return o.userData.interactive;}
  // 40 CSS px forgiveness threshold, measured from projected center to pointer.
  const threshold=46;
  let best=null,bestDist=threshold;
  for(const root of clickables.filter(g=>g.visible)){
   const o=root.userData.interactive;if(!o)continue;
   let c=root.position.clone();if(o.type==="plot")c.y+=.5;else if(o.type==="basket")c.y+=.5;
   c.project(camera);
   const sx=(c.x+1)*.5*rect.width+rect.left,sy=(-c.y+1)*.5*rect.height+rect.top;
   const dist=Math.hypot(clientX-sx,clientY-sy);
   if(dist<bestDist){bestDist=dist;best=o;}
  }
  return best;
 }
 function interactFromPointer(event,isDown){
  if(!state.started||state.phase==="IDLE")return;
  const hit=getHit(event.clientX,event.clientY);
  if(isDown){
   state.down={x:event.clientX,y:event.clientY,hit,at:performance.now()};
   if(state.game==="A01"&&hit?.type==="apple"){
    state.selected=fruitItems.find(a=>a.userData.interactive.id===hit.id);
    state.isDrag=true;controls.enabled=false;
   }
  }else{
   if(!state.down)return;
   const d=Math.hypot(event.clientX-state.down.x,event.clientY-state.down.y);
   const initialHit=state.down.hit;state.down=null;controls.enabled=true;state.isDrag=false;
   if(state.game==="A01"&&initialHit?.type==="apple"&&d>12){
    const a=fruitItems.find(a=>a.userData.interactive.id===initialHit.id);
    // magnetic snap to basket measured in screen CSS px and projected coordinates
    if(hit?.type==="basket"&&hit.target&&a){targetFruit(a);state.selected=null;}
    else if(a){sound("boing",200);setStatus("Το φρούτο επιστρέφει απαλά. Δοκίμασε ξανά!");}
    return;
   }
   if(d<17)clickInteraction(hit||initialHit);
  }
 }
 function drawInteraction(){
  ui.canvas.addEventListener("pointerdown",e=>{if(e.button>0)return;interactFromPointer(e,true);});
  ui.canvas.addEventListener("pointerup",e=>interactFromPointer(e,false));
  ui.canvas.addEventListener("pointercancel",()=>{state.down=null;state.isDrag=false;controls.enabled=true;});
  ui.canvas.addEventListener("pointermove",e=>{
   if(!state.started)return;let hit=getHit(e.clientX,e.clientY);
   ui.canvas.style.cursor=hit?"pointer":"grab";
   if(state.isDrag&&state.selected){
    let p=pointer.clone();raycaster.setFromCamera(pointer,camera);
    let plane=new THREE.Plane(new THREE.Vector3(0,1,0),-.85),target=new THREE.Vector3();
    if(raycaster.ray.intersectPlane(plane,target)){
     state.selected.position.x=THREE.MathUtils.clamp(target.x,-6,6);
     state.selected.position.z=THREE.MathUtils.clamp(target.z,-.1,3.1);
    }
   }
  },{passive:true});
  ui.canvas.addEventListener("webglcontextlost",e=>{e.preventDefault();state.started=false;fail("WebGL context lost")},{passive:false});
  ui.canvas.addEventListener("webglcontextrestored",()=>{location.reload();});
 }
 function newGame(id){
  state.game=id;state.phase="SELECTION";state.mode="guided";state.index=0;
  document.querySelectorAll("[data-game]").forEach(b=>b.classList.toggle("selected",b.dataset.game===id));
  $("free-mode").setAttribute("aria-pressed","false");
  removePlantVisuals();initRound();
 }
 function surprise(kind){
  if(state.reduce)return;
  if(kind==="butterfly"){
   const obj=group();
   put(obj,ball(.09,0x684b78,6,6),0,0,0);
   const wings=[];
   for(let side of [-1,1]){
    const wing=ball(.28,side<0?0xa58dd4:0xf4ae68,7,5);
    wing.scale.set(.65,1.25,.22);put(obj,wing,side*.26,0,0);wings.push(wing);
   }
   put(scene,obj,-6.8,3.25,-.2);
   state.events.push({kind,obj,wings,life:0});
  }else if(kind==="bee"){state.events.push({kind,obj:bee,life:0});}
  else if(kind==="rainbow"){
   const rainbow=mesh(new THREE.TorusGeometry(4.3,.10,7,50,Math.PI),new THREE.MeshBasicMaterial({color:0xffd899,transparent:true,opacity:.75}));
   put(scene,rainbow,0,3.2,-6);state.events.push({kind,obj:rainbow,life:0});
  }else{reward(-3.5,2.3,-1);}
 }
 function loop(){
  animation=requestAnimationFrame(loop);const delta=Math.min(.05,clock.getDelta());gameTime+=delta;
  if(controls)controls.update();
  if(waterwheel&&!state.reduce)waterwheel.rotation.z+=delta*.35;
  if(sheep&&!state.reduce)sheep.position.y=.16+Math.sin(gameTime*1.4)*.035;
  if(bee&&!state.reduce){bee.position.y=3.3+Math.sin(gameTime*3)*.17;bee.position.x+=Math.sin(gameTime*1.7)*delta*.08;}
  for(const p of state.plants){
   if(p.moisture>.09&&p.growth<1.5){p.growth=Math.min(1.5,p.growth+delta*.043);
    p.moisture=Math.max(0,p.moisture-delta*.018);}
   if(state.weather==="rain")p.moisture=Math.min(1,p.moisture+delta*.017);
   if(p.mesh)p.mesh.scale.setScalar(Math.max(.14,p.growth));
  }
  for(let i=state.particles.length-1;i>=0;i--){
   const p=state.particles[i];p.elapsed+=delta;p.o.position.x+=p.vx*delta;p.o.position.y+=(p.vy-p.elapsed*3)*delta;p.o.position.z+=p.vz*delta;
   if(p.elapsed>1){p.o.parent?.remove(p.o);p.o.geometry.dispose();p.o.material.dispose();state.particles.splice(i,1);}
  }
  for(let i=state.events.length-1;i>=0;i--){
   const e=state.events[i];e.life+=delta;
   if(e.kind==="butterfly"){e.obj.position.x+=delta*1.9;e.obj.position.y=3.3+Math.sin(e.life*5)*.22;
     e.wings.forEach((w,j)=>w.scale.x=.25+Math.abs(Math.sin(e.life*12))*1.0);}
   if(e.kind==="rainbow")e.obj.material.opacity=Math.max(0,.75-e.life*.19);
   if(e.life>5.0){if(e.kind!=="bee"){e.obj.parent?.remove(e.obj);e.obj.traverse(v=>v.geometry?.dispose?.());}state.events.splice(i,1);}
  }
  if(state.started){
   const event=planner?.update(gameTime,{dragging:state.isDrag,speaking:state.speaking,calm:state.reduce});
   if(event)surprise(event.kind);
   if(state.phase==="REWARD"&&gameTime>state.celebration)state.phase="SELECTION";
  }
  renderer.render(scene,camera);
 }
 function configureUI(){
  document.querySelectorAll(".farm-age button").forEach(b=>b.addEventListener("click",()=>{
   document.querySelectorAll(".farm-age button").forEach(x=>x.classList.toggle("chosen",x===b));
   state.age=b.dataset.age;
  }));
  function start(free){
   if(!renderer){fail("renderer unavailable");return;}
   state.started=true;state.mode=free?"free":"guided";ui.splash.hidden=true;
   document.body.dataset.playable="true";initRound();
   if(!state.muted)speak(ui.quest.textContent);
  }
  $("start").addEventListener("click",()=>start(false));$("free-start").addEventListener("click",()=>start(true));
  $("free-mode").addEventListener("click",()=>{state.mode=state.mode==="free"?"guided":"free";
    $("free-mode").setAttribute("aria-pressed",String(state.mode==="free"));
    ui.quest.textContent=state.mode==="free"?"Παίξε όπως σου αρέσει!":state.round?.narrationKey||"Διάλεξε αποστολή!";
    setStatus(state.mode==="free"?"Ελεύθερο παιχνίδι χωρίς τέλος.":"Ας δοκιμάσουμε μια νέα αποστολή.");
  });
  $("next").addEventListener("click",()=>{if(state.started){removePlantVisuals();initRound();}});
  $("voice").addEventListener("click",()=>speak(ui.quest.textContent));
  $("back").addEventListener("click",()=>{location.href="/virtual-preschool";});
  $("mute").addEventListener("click",()=>{state.muted=!state.muted;$("mute").textContent=state.muted?"🔇":"🔊";
    $("mute").setAttribute("aria-pressed",String(state.muted));if(state.muted&&"speechSynthesis"in window)window.speechSynthesis.cancel();});
  $("rotate-left").addEventListener("click",()=>{camera.position.applyAxisAngle(new THREE.Vector3(0,1,0),-.27);});
  $("rotate-right").addEventListener("click",()=>{camera.position.applyAxisAngle(new THREE.Vector3(0,1,0),.27);});
  $("calm").addEventListener("click",()=>{state.reduce=!state.reduce;$("calm").setAttribute("aria-pressed",String(state.reduce));setStatus(state.reduce?"Οι εκπλήξεις θα είναι ήρεμες.":"Η φύση ζωντανεύει πάλι!");});
  $("fallback-play").addEventListener("click",()=>{ui.status.textContent="Φύτεψες ένα φυτό! Μπράβο!";});
  document.querySelectorAll("[data-game]").forEach(b=>b.addEventListener("click",()=>{newGame(b.dataset.game);}));
  document.querySelectorAll("[data-tool]").forEach(b=>b.addEventListener("click",()=>setTool(b.dataset.tool)));
  document.addEventListener("visibilitychange",()=>{if(document.hidden){if(clock)clock.stop();}else if(clock)clock.start();});
 }
 function begin(){
  try{
   if(!THREE||!engine||!THREE.OrbitControls)throw Error("Missing locally hosted Three.js, OrbitControls or Random Play core.");
   const context3d=ui.canvas.getContext("webgl2",{antialias:true,alpha:false})||ui.canvas.getContext("webgl",{antialias:true,alpha:false});
   if(!context3d)throw Error("WebGL unavailable on this browser.");
   renderer=new THREE.WebGLRenderer({canvas:ui.canvas,context:context3d,antialias:true,powerPreference:"high-performance"});
   renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
   setQuality();scene=new THREE.Scene();createCameraAndLights();createTerrain();
   pointer=new THREE.Vector2();raycaster=new THREE.Raycaster();clock=new THREE.Clock();
   configureUI();drawInteraction();resize();if("ResizeObserver" in window)new ResizeObserver(resize).observe(ui.canvas);else window.addEventListener("resize",resize);
   document.body.dataset.gameReady="true";parent.postMessage({type:"PISIPOUK_FARM_READY"},"*");
   loop();
  }catch(e){fail(e.message||String(e));}
 }
 if("serviceWorker" in navigator && location.protocol==="https:"){
    window.addEventListener("load",()=>navigator.serviceWorker.register("/preschool/360/sw.js",{scope:"/preschool/360/"}).catch(error=>console.debug("[PISIPOUK 360] Offline cache unavailable",error)),{once:true});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",begin,{once:true});else begin();
})();
