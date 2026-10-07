import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, type ThreeEvent, useFrame } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";
import { Brush, Sparkles } from "lucide-react";

const PALETTE=["#e75b72","#f0aa3c","#e7d24d","#58aa79","#4a91bb","#7a67ae","#9c664c","#f5eee2"];

function PaintableFish({
  color,
  brush,
  awake,
  onPaint,
}:{
  color:string;
  brush:number;
  awake:boolean;
  onPaint:(count:number)=>void;
}){
  const group=useRef<THREE.Group>(null);
  const painting=useRef(false);
  const [canvas,setCanvas]=useState<HTMLCanvasElement|null>(null);
  const [texture,setTexture]=useState<THREE.CanvasTexture|null>(null);
  const strokes=useRef(0);

  useEffect(()=>{
    const c=document.createElement("canvas");
    c.width=1024;c.height=1024;
    const ctx=c.getContext("2d");
    if(ctx){
      const g=ctx.createLinearGradient(0,0,1024,1024);
      g.addColorStop(0,"#f5dfb8");g.addColorStop(.55,"#e8c88e");g.addColorStop(1,"#d8b379");
      ctx.fillStyle=g;ctx.fillRect(0,0,1024,1024);
      ctx.globalAlpha=.12;ctx.fillStyle="#7f603d";
      for(let i=0;i<28;i++){ctx.beginPath();ctx.arc((i*137)%1024,(i*271)%1024,7+(i%5)*2,0,Math.PI*2);ctx.fill()}
      ctx.globalAlpha=1;
    }
    const t=new THREE.CanvasTexture(c);
    t.colorSpace=THREE.SRGBColorSpace;
    t.anisotropy=4;
    setCanvas(c);setTexture(t);
    return()=>t.dispose();
  },[]);

  const paint=(e:ThreeEvent<PointerEvent>)=>{
    if(!painting.current||!canvas||!texture||!e.uv)return;
    e.stopPropagation();
    const ctx=canvas.getContext("2d");if(!ctx)return;
    const x=e.uv.x*canvas.width;
    const y=(1-e.uv.y)*canvas.height;
    const radius=brush*canvas.width*.012;
    const grad=ctx.createRadialGradient(x-radius*.25,y-radius*.25,1,x,y,radius);
    grad.addColorStop(0,"#ffffff88");
    grad.addColorStop(.18,color);
    grad.addColorStop(1,color+"99");
    ctx.fillStyle=grad;
    ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();
    texture.needsUpdate=true;
    strokes.current+=1;
    onPaint(strokes.current);
  };

  useFrame(({clock},delta)=>{
    const g=group.current;if(!g)return;
    if(awake){
      const t=clock.elapsedTime;
      g.position.x=THREE.MathUtils.damp(g.position.x,Math.sin(t*.8)*1.7,2.4,delta);
      g.position.y=THREE.MathUtils.damp(g.position.y,.35+Math.sin(t*1.4)*.25,3,delta);
      g.rotation.y=THREE.MathUtils.damp(g.rotation.y,Math.sin(t*.8)>.0?.18:-.18,3,delta);
      g.rotation.z=Math.sin(t*1.5)*.035;
    }else{
      g.position.x=THREE.MathUtils.damp(g.position.x,0,3,delta);
      g.position.y=THREE.MathUtils.damp(g.position.y,0,3,delta);
      g.rotation.y=THREE.MathUtils.damp(g.rotation.y,0,3,delta);
      g.rotation.z=THREE.MathUtils.damp(g.rotation.z,0,3,delta);
    }
  });

  return <group ref={group}>
    <mesh castShadow receiveShadow scale={[2.15,1.22,.92]}>
      <sphereGeometry args={[1,96,64]}/>
      <meshPhysicalMaterial map={texture||undefined} color={texture?"#ffffff":"#e8ca94"} roughness={.55} clearcoat={.22} clearcoatRoughness={.65} sheen={.25} sheenColor={new THREE.Color("#fff0d6")}/>
    </mesh>
    <mesh
      scale={[2.34,1.39,1.08]}
      onPointerDown={e=>{painting.current=true;paint(e)}}
      onPointerMove={paint}
      onPointerUp={()=>painting.current=false}
      onPointerOut={()=>painting.current=false}
      onPointerCancel={()=>painting.current=false}
    >
      <sphereGeometry args={[1,64,42]}/>
      <meshBasicMaterial transparent opacity={0} depthWrite={false}/>
    </mesh>
    <mesh position={[-2.05,0,0]} rotation={[0,0,Math.PI/2]} castShadow>
      <coneGeometry args={[.92,1.45,4]}/>
      <meshStandardMaterial color="#d7aa70" roughness={.6}/>
    </mesh>
    <mesh position={[-.15,.92,0]} rotation={[0,0,-.2]} castShadow>
      <coneGeometry args={[.42,.95,5]}/>
      <meshStandardMaterial color="#d7aa70" roughness={.6}/>
    </mesh>
    <mesh position={[-.1,-.95,0]} rotation={[0,0,Math.PI+.2]} castShadow>
      <coneGeometry args={[.38,.8,5]}/>
      <meshStandardMaterial color="#d7aa70" roughness={.6}/>
    </mesh>
    <group position={[1.18,.24,.78]}>
      <mesh><sphereGeometry args={[.18,32,20]}/><meshStandardMaterial color="#fffaf0"/></mesh>
      <mesh position={[.03,0,.14]}><sphereGeometry args={[.085,24,16]}/><meshStandardMaterial color="#2c2a2e"/></mesh>
      <mesh position={[.055,.035,.205]}><sphereGeometry args={[.022,12,8]}/><meshBasicMaterial color="#ffffff"/></mesh>
    </group>
    <mesh position={[1.58,-.16,.78]} rotation={[0,0,-.14]}>
      <torusGeometry args={[.18,.035,12,32,Math.PI*.95]}/>
      <meshStandardMaterial color="#6e5144"/>
    </mesh>
  </group>;
}

function PaintScene({color,brush,awake,onPaint}:{color:string;brush:number;awake:boolean;onPaint:(n:number)=>void}){
  return <>
    <color attach="background" args={["#d8eef0"]}/>
    <fog attach="fog" args={["#d8eef0",10,22]}/>
    <hemisphereLight args={["#fff7e6","#7093a0",2.4]}/>
    <directionalLight castShadow position={[4,7,5]} intensity={3.1} color="#fff2d7" shadow-mapSize-width={2048} shadow-mapSize-height={2048}/>
    <pointLight position={[-4,3,3]} intensity={10} distance={10} color="#acdfff"/>
    <Float speed={.5} rotationIntensity={.015} floatIntensity={.05}>
      <PaintableFish color={color} brush={brush} awake={awake} onPaint={onPaint}/>
    </Float>
    <mesh receiveShadow rotation={[-Math.PI/2,0,0]} position={[0,-1.5,0]}>
      <circleGeometry args={[5.4,64]}/>
      <meshStandardMaterial color="#c9b58f" roughness={.95}/>
    </mesh>
    <ContactShadows position={[0,-1.47,0]} opacity={.32} scale={7} blur={2.3} far={5}/>
  </>;
}

export function Paint3D(){
  const [mounted,setMounted]=useState(false);
  const [color,setColor]=useState(PALETTE[0]);
  const [brush,setBrush]=useState(2);
  const [awake,setAwake]=useState(false);
  const [strokes,setStrokes]=useState(0);
  useEffect(()=>setMounted(true),[]);
  const canWake=strokes>=3;

  return <section className="pv16-module">
    <div className="pv16-module-copy">
      <span className="pv16-eyebrow"><Brush/> 3D TEXTURE PAINTING</span>
      <h2>Ζωγραφίζω πάνω στο αντικείμενο.</h2>
      <p>Το χρώμα γίνεται πραγματική texture πάνω στο 3D σώμα. Όταν το παιδί τελειώσει, η δημιουργία «ξυπνά» και κινείται μέσα στον κόσμο.</p>
    </div>
    <div className="pv16-paint-shell">
      <div className="pv16-canvas" data-testid="paint-3d">
        {mounted ? <Canvas shadows dpr={[1,1.65]} camera={{position:[0,1.1,7.1],fov:39}}>
          <Suspense fallback={null}><PaintScene color={color} brush={brush} awake={awake} onPaint={setStrokes}/></Suspense>
        </Canvas> : <div className="pv16-3d-loading">Ετοιμάζω τη ζωντανή ζωγραφική…</div>}
      </div>
      <div className="pv16-paint-tools">
        <div className="pv16-swatches">{PALETTE.map(c=><button key={c} aria-label={"Χρώμα "+c} className={c===color?"on":""} style={{background:c}} onClick={()=>setColor(c)}/>)}</div>
        <div className="pv16-brushes"><button className={brush===1?"on":""} onClick={()=>setBrush(1)}>●</button><button className={brush===2?"on":""} onClick={()=>setBrush(2)}>●</button><button className={brush===3?"on":""} onClick={()=>setBrush(3)}>●</button></div>
        <button className="pv16-wake" disabled={!canWake} onClick={()=>setAwake(v=>!v)}><Sparkles/>{awake?"Ηρεμώ":"Ζωντανεύω"}</button>
      </div>
      <div className="pv16-paint-note">{canWake?"Η δημιουργία είναι έτοιμη να ξυπνήσει ✨":"Ζωγράφισε ελεύθερα πάνω στο ψαράκι…"}</div>
    </div>
  </section>;
}
