import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, type ThreeEvent, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, RoundedBox } from "@react-three/drei";
import { Physics, RigidBody, type RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { RotateCcw, Sparkles } from "lucide-react";

type ShapeKind="cube"|"plank"|"cylinder"|"sphere";
type Piece={id:number;kind:ShapeKind;color:string;position:[number,number,number];rotation?:[number,number,number]};

const WOOD=["#e6a86f","#c98754","#f0c18a","#b97748"];
const CALM=["#e78778","#75a9c7","#88ad77","#d6b86d","#9f8bc5"];

function CameraRig(){
  useFrame(({camera})=>{
    camera.lookAt(0,1.25,0);
  });
  return null;
}

function StudioLights(){
  return <>
    <hemisphereLight args={["#fff6df","#8094a3",2.1]}/>
    <directionalLight
      castShadow
      position={[5,9,6]}
      intensity={3.4}
      color="#fff1d0"
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-near={1}
      shadow-camera-far={30}
      shadow-camera-left={-8}
      shadow-camera-right={8}
      shadow-camera-top={8}
      shadow-camera-bottom={-8}
    />
    <pointLight position={[-4,4,2]} intensity={12} distance={12} color="#a7d9ff"/>
  </>;
}

function Material({color,wood=false}:{color:string;wood?:boolean}){
  return <meshPhysicalMaterial
    color={color}
    roughness={wood?.72:.52}
    metalness={0.02}
    clearcoat={wood?.0.08:0.16}
    clearcoatRoughness={0.55}
    sheen={wood?0.14:0.32}
    sheenColor={new THREE.Color("#fff4df")}
  />;
}

function DraggablePiece({piece}:{piece:Piece}){
  const body=useRef<RapierRigidBody>(null);
  const [dragging,setDragging]=useState(false);
  const plane=useMemo(()=>new THREE.Plane(new THREE.Vector3(0,1,0),-1.35),[]);
  const temp=useMemo(()=>new THREE.Vector3(),[]);

  const begin=(e:ThreeEvent<PointerEvent>)=>{
    e.stopPropagation();
    const rb=body.current;if(!rb)return;
    setDragging(true);
    rb.setGravityScale(0,true);
    rb.setLinvel({x:0,y:0,z:0},true);
    rb.setAngvel({x:0,y:0,z:0},true);
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
  };
  const move=(e:ThreeEvent<PointerEvent>)=>{
    if(!dragging||!body.current)return;
    e.stopPropagation();
    const hit=e.ray.intersectPlane(plane,temp);
    if(!hit)return;
    body.current.setTranslation({x:THREE.MathUtils.clamp(hit.x,-3.9,3.9),y:Math.max(1.1,hit.y+0.45),z:THREE.MathUtils.clamp(hit.z,-2.7,2.7)},true);
    body.current.setLinvel({x:0,y:0,z:0},true);
  };
  const end=(e:ThreeEvent<PointerEvent>)=>{
    if(!body.current)return;
    e.stopPropagation();
    setDragging(false);
    body.current.setGravityScale(1,true);
    body.current.wakeUp();
  };

  const common={castShadow:true,receiveShadow:true,onPointerDown:begin,onPointerMove:move,onPointerUp:end,onPointerCancel:end};
  return <RigidBody
    ref={body}
    position={piece.position}
    rotation={piece.rotation}
    colliders={piece.kind==="sphere"?"ball":piece.kind==="cylinder"?"hull":"cuboid"}
    restitution={piece.kind==="sphere"?.46:.08}
    friction={.9}
    linearDamping={.28}
    angularDamping={.38}
    ccd
  >
    {piece.kind==="cube"&&<RoundedBox args={[1.05,1.05,1.05]} radius={.14} smoothness={5} {...common}><Material color={piece.color} wood/></RoundedBox>}
    {piece.kind==="plank"&&<RoundedBox args={[2.15,.42,.72]} radius={.12} smoothness={5} {...common}><Material color={piece.color} wood/></RoundedBox>}
    {piece.kind==="cylinder"&&<mesh {...common}><cylinderGeometry args={[.52,.52,1.18,32]}/><Material color={piece.color} wood/></mesh>}
    {piece.kind==="sphere"&&<mesh {...common}><sphereGeometry args={[.55,32,22]}/><Material color={piece.color}/></mesh>}
  </RigidBody>;
}

function AtelierRoom({pieces}:{pieces:Piece[]}){
  return <>
    <CameraRig/>
    <StudioLights/>
    <color attach="background" args={["#e8f4ef"]}/>
    <fog attach="fog" args={["#e8f4ef",10,24]}/>
    <mesh receiveShadow rotation={[-Math.PI/2,0,0]} position={[0,-.08,0]}>
      <planeGeometry args={[18,14]}/>
      <meshStandardMaterial color="#d6bf9b" roughness={.92}/>
    </mesh>
    <mesh receiveShadow position={[0,3.3,-4.8]}>
      <boxGeometry args={[12,6.6,.25]}/>
      <meshStandardMaterial color="#f3e8d7" roughness={.88}/>
    </mesh>
    <mesh receiveShadow position={[-5.2,2,0]} rotation={[0,Math.PI/2,0]}>
      <boxGeometry args={[10,4,.25]}/>
      <meshStandardMaterial color="#e5dbc9" roughness={.9}/>
    </mesh>

    <Float speed={1.1} rotationIntensity={.08} floatIntensity={.18}>
      <mesh position={[-3.9,3.25,-4.55]} castShadow>
        <torusGeometry args={[.72,.09,16,48]}/>
        <meshStandardMaterial color="#c28c52" roughness={.7}/>
      </mesh>
    </Float>
    <mesh position={[3.65,2.9,-4.55]}>
      <circleGeometry args={[.78,48]}/>
      <meshStandardMaterial color="#f5d879" roughness={.7}/>
    </mesh>

    <Physics gravity={[0,-9.81,0]} timeStep="vary">
      <RigidBody type="fixed" colliders="cuboid" position={[0,-.2,0]}>
        <mesh visible={false}><boxGeometry args={[12,.4,9]}/></mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid" position={[0,1.05,-4.45]}>
        <mesh visible={false}><boxGeometry args={[12,2.1,.3]}/></mesh>
      </RigidBody>
      {pieces.map(piece=><DraggablePiece key={piece.id} piece={piece}/>)}
    </Physics>
    <ContactShadows position={[0,.015,0]} opacity={.32} scale={11} blur={2.7} far={7}/>
  </>;
}

const START:Piece[]=[
  {id:1,kind:"cube",color:WOOD[0],position:[-2.4,2.7,.2]},
  {id:2,kind:"cube",color:WOOD[2],position:[-1.2,3.2,-.35]},
  {id:3,kind:"plank",color:WOOD[1],position:[.2,3.4,.2]},
  {id:4,kind:"cylinder",color:CALM[2],position:[2,2.8,-.2]},
  {id:5,kind:"sphere",color:CALM[1],position:[3.1,3.7,.4]},
];

export function AtelierPhysics3D(){
  const [mounted,setMounted]=useState(false);
  const [pieces,setPieces]=useState<Piece[]>(START);
  const [next,setNext]=useState(10);
  const [quality,setQuality]=useState<"high"|"eco">("high");
  useEffect(()=>setMounted(true),[]);

  const add=(kind:ShapeKind)=>{
    const color=(kind==="cube"||kind==="plank"?WOOD:CALM)[next%(kind==="cube"||kind==="plank"?WOOD.length:CALM.length)];
    setPieces(v=>[...v,{id:next,kind,color,position:[((next%5)-2)*.75,4.5+(next%3)*.35,0]}]);
    setNext(v=>v+1);
  };

  return <section className="pv16-module">
    <div className="pv16-module-copy">
      <span className="pv16-eyebrow"><Sparkles/> PHYSICAL 3D ATELIER</span>
      <h2>Χτίζω, δοκιμάζω, παρατηρώ.</h2>
      <p>Τα αντικείμενα έχουν βάρος, πέφτουν, συγκρούονται και ισορροπούν. Δεν υπάρχει «λάθος» — η φυσική δίνει την απάντηση.</p>
    </div>
    <div className="pv16-atelier-shell">
      <div className="pv16-canvas" data-testid="atelier-3d">
        {mounted ? <Canvas
          shadows
          dpr={quality==="high"?[1,1.7]:1}
          camera={{position:[0,6.4,8.8],fov:42,near:.1,far:40}}
          gl={{antialias:true,powerPreference:"high-performance"}}
        >
          <Suspense fallback={null}><AtelierRoom pieces={pieces}/></Suspense>
        </Canvas> : <div className="pv16-3d-loading">Ετοιμάζω το 3D atelier…</div>}
      </div>
      <div className="pv16-tool-tray" aria-label="Υλικά κατασκευής">
        <button onClick={()=>add("cube")}><i className="cube"/>Κύβος</button>
        <button onClick={()=>add("plank")}><i className="plank"/>Ξύλο</button>
        <button onClick={()=>add("cylinder")}><i className="cylinder"/>Κύλινδρος</button>
        <button onClick={()=>add("sphere")}><i className="sphere"/>Μπάλα</button>
        <button onClick={()=>setPieces(START)}><RotateCcw/>Από την αρχή</button>
        <button onClick={()=>setQuality(q=>q==="high"?"eco":"high")} className="quiet">{quality==="high"?"HD":"Eco"}</button>
      </div>
    </div>
  </section>;
}
