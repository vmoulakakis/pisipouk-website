import { Suspense, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { CloudRain, Moon, Sun, Wind } from "lucide-react";

const RAW="https://raw.githubusercontent.com/shorepine/kenney/main/";
const ASSETS={
  bunny:RAW+"3d/cube-pets/animal-bunny.glb",
  fish:RAW+"3d/cube-pets/animal-fish.glb",
  tree:RAW+"3d/mini-forest/tree.glb",
  plant:RAW+"3d/mini-forest/plant.glb",
  rocks:RAW+"3d/mini-forest/rocks-high.glb",
  flower:RAW+"3d/nature/flower_yellowB.glb",
  boat:RAW+"3d/watercraft/boat-row-small.glb",
} as const;

function Model({url,position,scale=1,rotation=[0,0,0],onClick}:{url:string;position:[number,number,number];scale?:number;rotation?:[number,number,number];onClick?:()=>void}){
  const gltf=useGLTF(url);
  const scene=useMemo(()=>gltf.scene.clone(true),[gltf.scene]);
  scene.traverse(o=>{const m=o as THREE.Mesh;if(m.isMesh){m.castShadow=true;m.receiveShadow=true;}});
  return <primitive object={scene} position={position} scale={scale} rotation={rotation} onClick={(e:any)=>{e.stopPropagation();onClick?.()}}/>;
}

function Rain({active}:{active:boolean}){
  const geo=useMemo(()=>{
    const count=180;
    const arr=new Float32Array(count*3);
    for(let i=0;i<count;i++){arr[i*3]=(i*73%100)/10-5;arr[i*3+1]=1+(i*37%80)/10;arr[i*3+2]=(i*47%80)/10-4;}
    const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(arr,3));return g;
  },[]);
  useFrame((_,delta)=>{
    if(!active)return;
    const a=geo.attributes.position as THREE.BufferAttribute;
    for(let i=0;i<a.count;i++){let y=a.getY(i)-delta*5.5;if(y<.2)y=8;a.setY(i,y)}a.needsUpdate=true;
  });
  if(!active)return null;
  return <points geometry={geo}><pointsMaterial color="#b9e8ff" size={.055} transparent opacity={.72}/></points>;
}

function World({mode,onDiscover}:{mode:"sun"|"rain"|"night"|"wind";onDiscover:(x:string)=>void}){
  const night=mode==="night";
  return <>
    <color attach="background" args={[night?"#18264b":mode==="rain"?"#a5bdc7":"#bceafa"]}/>
    <fog attach="fog" args={[night?"#18264b":"#bceafa",11,26]}/>
    <hemisphereLight args={[night?"#9fb7ef":"#fff6df",night?"#25345e":"#6f9b78",night?.65:2.1]}/>
    <directionalLight castShadow position={[5,9,5]} intensity={night?.8:mode==="rain"?1.55:3.1} color={night?"#c2d2ff":"#fff0cf"} shadow-mapSize-width={2048} shadow-mapSize-height={2048}/>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.35,0]} receiveShadow>
      <circleGeometry args={[6.2,96]}/>
      <meshStandardMaterial color="#66b975" roughness={.94}/>
    </mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.43,0]}>
      <ringGeometry args={[5.4,9,128]}/>
      <meshPhysicalMaterial color={night?"#345d92":"#4eb6d8"} roughness={.2} metalness={.03} transmission={.08} transparent opacity={.92}/>
    </mesh>
    <Model url={ASSETS.tree} position={[-2.6,-.28,-1.1]} scale={1.4}/>
    <Model url={ASSETS.tree} position={[2.55,-.28,-1.55]} scale={1.05} rotation={[0,-.8,0]}/>
    <Model url={ASSETS.plant} position={[-1.65,-.28,.65]} scale={1.2}/>
    <Model url={ASSETS.rocks} position={[1.7,-.28,.95]} scale={1.05}/>
    <Model url={ASSETS.flower} position={[-.7,-.25,1.55]} scale={1.25} onClick={()=>onDiscover("λουλούδι")}/>
    <Float speed={1.4} rotationIntensity={.04} floatIntensity={.22}>
      <Model url={ASSETS.bunny} position={[.4,.08,-.15]} scale={1.35} rotation={[0,-.4,0]} onClick={()=>onDiscover("λαγουδάκι")}/>
    </Float>
    <Float speed={.8} rotationIntensity={.03} floatIntensity={.1}>
      <Model url={ASSETS.boat} position={[3.9,-.27,2.7]} scale={.8} rotation={[0,-.7,0]} onClick={()=>onDiscover("βαρκούλα")}/>
    </Float>
    <Float speed={1.1} rotationIntensity={.08} floatIntensity={.35}>
      <Model url={ASSETS.fish} position={[-3.6,-.1,2.5]} scale={.9} rotation={[0,.5,0]} onClick={()=>onDiscover("ψαράκι")}/>
    </Float>
    <Rain active={mode==="rain"}/>
    <ContactShadows position={[0,-.31,0]} scale={11} blur={2.6} far={7} opacity={night?.15:.3}/>
  </>;
}

export function MicroWorld3D(){
  const [mode,setMode]=useState<"sun"|"rain"|"night"|"wind">("sun");
  const [found,setFound]=useState<string[]>([]);
  const discover=(name:string)=>setFound(v=>v.includes(name)?v:[...v,name]);

  return <section className="pv16-module">
    <div className="pv16-module-copy">
      <span className="pv16-eyebrow">SLOW-PACED MICRO WORLD</span>
      <h2>Το νησί αλλάζει μαζί σου.</h2>
      <p>Το παιδί αλλάζει φως και καιρό, παρατηρεί τη φύση και ανακαλύπτει ζωντανά αντικείμενα χωρίς σκορ ή χρονόμετρο.</p>
    </div>
    <div className="pv16-world-shell">
      <div className="pv16-canvas" data-testid="micro-world-3d">
        <Canvas shadows dpr={[1,1.6]} camera={{position:[0,5.8,9.7],fov:39}} gl={{antialias:true,powerPreference:"high-performance"}}>
          <Suspense fallback={null}><World mode={mode} onDiscover={discover}/></Suspense>
        </Canvas>
      </div>
      <div className="pv16-weather" aria-label="Αλλάζω τον κόσμο">
        <button className={mode==="sun"?"on":""} onClick={()=>setMode("sun")} aria-label="Ήλιος"><Sun/></button>
        <button className={mode==="rain"?"on":""} onClick={()=>setMode("rain")} aria-label="Βροχή"><CloudRain/></button>
        <button className={mode==="night"?"on":""} onClick={()=>setMode("night")} aria-label="Νύχτα"><Moon/></button>
        <button className={mode==="wind"?"on":""} onClick={()=>setMode("wind")} aria-label="Αεράκι"><Wind/></button>
      </div>
      <div className="pv16-discovery">{found.length ? "Ανακάλυψες: "+found.join(" • ") : "Άγγιξε ό,τι σου κινεί την περιέργεια."}</div>
      <small className="pv16-license-note">3D world props: Kenney CC0 — προσωρινή approved asset library μέχρι το custom Pisipouk art pack.</small>
    </div>
  </section>;
}

useGLTF.preload(ASSETS.bunny);
useGLTF.preload(ASSETS.fish);
useGLTF.preload(ASSETS.tree);
useGLTF.preload(ASSETS.plant);
useGLTF.preload(ASSETS.rocks);
useGLTF.preload(ASSETS.flower);
useGLTF.preload(ASSETS.boat);
