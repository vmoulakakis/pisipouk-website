import { useEffect, useRef, useState } from "react";
import { ArrowLeft, RotateCcw, Volume2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import "./physics-garden.css";

/**
 * Real scene renderer: Phaser 4.2.1 / Matter.js.
 * No CDN, no imported third-party artwork, no writes to any backend.
 * Only created on client after this staging route is mounted.
 */
export function PhaserPhysicsGarden({ageKey}:{ageKey:string}){
 const mount=useRef<HTMLDivElement>(null);
 const game=useRef<{destroy:(removeCanvas?:boolean)=>void}|null>(null);
 const spawn=useRef<(()=>void)|null>(null);
 const reset=useRef<(()=>void)|null>(null);
 const [round,setRound]=useState(0);
 const [count,setCount]=useState(0);
 const [error,setError]=useState("");
 const [loaded,setLoaded]=useState(false);
 useEffect(()=>{
  let disposed=false;
  async function init(){
   try{
    const {default:Phaser}=await import("phaser");
    if(disposed||!mount.current)return;
    const stage=mount.current;
    stage.replaceChildren();
    let produced=0;
    const parentUpdate=(n:number)=>{if(!disposed)setCount(n)};
    class NaturePhysicsScene extends Phaser.Scene{
     texturesReady=false;
     fruits: Array<{destroy:()=>void}>=[];
     constructor(){super({key:"PisipoukMatterNature"});}
     preload(){this.load.image("pisipoukOriginal","/preschool-world/bear.webp");}
     create(){
      // Background is deliberately vector-built and device independent.
      this.add.rectangle(480,270,960,540,0xc0eaff);
      const hills=this.add.graphics();
      hills.fillStyle(0xeafbf5);hills.fillEllipse(190,520,760,280);
      hills.fillStyle(0x99d9b2);hills.fillEllipse(720,570,900,330);
      hills.fillStyle(0x80c59c);hills.fillEllipse(350,600,870,245);
      hills.fillStyle(0xffe39c);hills.fillCircle(808,105,58);
      for(let i=0;i<4;i++){
       const x=140+i*250;
       hills.fillStyle(0xffffff,.75);hills.fillEllipse(x,116+(i%2)*38,125,45);
      }
      const bark=this.add.graphics();
      bark.fillStyle(0xa26e48);bark.fillRoundedRect(72,210,30,195,12);
      for(const [x,y,r] of [[79,211,62],[117,178,49],[59,145,52],[142,241,42]]){
       bark.fillStyle(0x70b67c);bark.fillCircle(x,y,r);
      }
      const skyGroup=this.add.group();
      for(let i=0;i<6;i++){
       const x=200+i*140;
       let leaf=this.add.ellipse(x,415+(i%2)*10,60,18,0x408e69,.5);
       skyGroup.add(leaf);
      }
      // Matter static terrain, left and right bumpers, and inclined ramps.
      this.matter.world.setBounds(4,4,952,532,48);
      const floor=this.matter.add.rectangle(480,528,960,28,{isStatic:true,friction:.78});
      const rampA=this.matter.add.rectangle(341,333,250,22,{isStatic:true,angle:-.18,friction:.26});
      const rampB=this.matter.add.rectangle(687,420,260,22,{isStatic:true,angle:.15,friction:.26});
      this.add.rectangle(341,333,250,22,0xb88352).setRotation(-.18).setStrokeStyle(4,0x835b38);
      this.add.rectangle(687,420,260,22,0xb88352).setRotation(.15).setStrokeStyle(4,0x835b38);
      // Explicitly mark physics fixtures used above; make visible only via props.
      void floor;void rampA;void rampB;
      if(this.textures.exists("pisipoukOriginal")){
       const bear=this.add.image(80,428,"pisipoukOriginal").setDisplaySize(132,132).setOrigin(.5,1);
       bear.setDepth(10);
       this.tweens.add({targets:bear,y:"-=6",duration:1650,yoyo:true,repeat:-1,ease:"Sine.easeInOut"});
      }
      const g=this.make.graphics({x:0,y:0});
      g.fillStyle(0xfbb85c);g.fillCircle(42,42,38);
      g.lineStyle(5,0xe38f35);g.strokeCircle(42,42,36);
      g.fillStyle(0xffffff,.45);g.fillEllipse(30,28,22,12);
      g.fillStyle(0x755138);g.fillRoundedRect(39,0,7,12,4);
      g.fillStyle(0x78b77b);g.fillEllipse(56,7,23,11);
      g.generateTexture("PisipoukFruit",84,84);g.destroy();
      this.texturesReady=true;
      // Phaser input recognizes taps anywhere, while click target remains a Phaser pointer.
      this.input.on("pointerdown",(pointer:typeof this.input.activePointer)=>this.spawnBall(pointer.worldX));
      produced=0;parentUpdate(produced);
      spawn.current=()=>this.spawnBall(350+Math.random()*220);
      reset.current=()=>{
       this.fruits.forEach(fruit=>fruit.destroy());
       this.fruits=[];
       produced=0;parentUpdate(0);
      };
     }
     spawnBall(x:number){
      if(!this.texturesReady||produced>=20)return;
      const ball=this.matter.add.image(Math.max(130,Math.min(825,x)),53,"PisipoukFruit");
      ball.setCircle(37).setBounce(.67).setFriction(.08).setFrictionAir(.008).setMass(1.5);
      ball.setAngularVelocity((Math.random()-.5)*.05);
      ball.setVelocityX((Math.random()-.5)*3);
      ball.setData("fruit",true);ball.setDepth(5);
      this.fruits.push(ball);
      produced++;parentUpdate(produced);
     }
    }
    if(disposed)return;
    const p=new Phaser.Game({
      type:Phaser.AUTO,parent:stage,width:960,height:540,
      transparent:false,backgroundColor:"#c0eaff",
      antialias:true,pixelArt:false,
      scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},
      physics:{default:"matter",matter:{gravity:{x:0,y:1.2},enableSleeping:true,debug:false}},
      scene:NaturePhysicsScene,
      render:{antialias:true,pixelArt:false}
    });
    game.current=p;
    setLoaded(true);
   }catch(e){
    if(!disposed){setError("Ο μηχανισμός γραφικών δεν φορτώθηκε σε αυτή τη συσκευή.");setLoaded(false)}
   }
  }
  void init();
  return ()=>{disposed=true;spawn.current=null;reset.current=null;game.current?.destroy(true);game.current=null;};
 },[round]);
 const speak=()=>{if(typeof window==="undefined"||!("speechSynthesis" in window))return;window.speechSynthesis.cancel();const s=new SpeechSynthesisUtterance("Άγγιξε τον κήπο για να πέσει ένα φρούτο. Κοίτα πώς κυλά και αναπηδά!");s.lang="el-GR";s.rate=.87;window.speechSynthesis.speak(s)};
 return <div className="pw2-physics">
  <div className="pw2-overline">ΠΡΑΓΜΑΤΙΚΟΣ ΜΗΧΑΝΙΣΜΟΣ ΠΑΙΧΝΙΔΙΟΥ · PHASER 4 + MATTER.JS</div>
  <h1>Ο κήπος της βαρύτητας</h1>
  <p>Άγγιξε την εικόνα και δες ένα φρούτο να πέφτει, να συγκρούεται, να αναπηδά και να κυλά στις ράμπες.</p>
  <div className="pw2-physics-controls"><button type="button" onClick={speak} aria-label="Άκου την οδηγία"><Volume2 size={20}/> Άκου</button><span role="status">{loaded?"Πραγματική προσομοίωση φυσικής":"Φόρτωση game engine…"}</span><b>{count}/20 φρούτα</b></div>
  {error?<p role="alert">{error}</p>:null}
  <div className="pw2-physics-canvas" ref={mount} role="group" aria-label="Παιχνίδι φυσικής με πτώση φρούτων"/>
  <div className="pw2-physics-actions"><button type="button" onClick={()=>spawn.current?.()} disabled={!loaded}>🍎 Ρίξε ένα μήλο</button><button type="button" onClick={()=>reset.current?.()} disabled={!loaded}><RotateCcw size={18}/> Καθάρισε</button><button type="button" onClick={()=>setRound(n=>n+1)}>Νέος κήπος</button></div>
  <p className="pw2-library-note">Η σκηνή χρησιμοποιεί κανονικά άκαμπτα σώματα Matter.js. Αυτό είναι τεχνολογική δοκιμή φυσικής, όχι τελικό καλλιτεχνικό αποτέλεσμα: ο rigged Πισιπούκ και τα χειροποίητα HD assets χρειάζονται ακόμη παραγωγή.</p>
  <Link to={"/pisipouk-v2-staging/ages/"+ageKey} className="pw2-text-link"><ArrowLeft size={17}/> Επιστροφή στον κόσμο μου</Link>
 </div>
}
