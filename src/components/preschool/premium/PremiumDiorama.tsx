import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
/**
 * Optional immersive hero scene. Three.js is imported only on capable desktop
 * devices, with accessible branded 2D art fallback for low-power/SSR/reduced motion.
 * No network assets, no microphone, and no child information.
 */
export function PremiumDiorama(){
 const host=useRef<HTMLDivElement|null>(null);
 const [ready,setReady]=useState(false);
 const reduceMotion=useReducedMotion();
 useEffect(()=>{
  const root=host.current;
  if(!root||reduceMotion||!window.matchMedia("(min-width: 850px)").matches)return;
  const probe=document.createElement("canvas");
  if(!probe.getContext("webgl2")&&!probe.getContext("webgl"))return;
  let disposed=false;let frame=0;let resizeObserver:ResizeObserver|null=null;
  let cleanup=()=>{};
  void import("three").then(THREE=>{
   if(disposed||!root)return;
   let renderer:InstanceType<typeof THREE.WebGLRenderer>;
   try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});}catch{return;}
   renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
   renderer.setClearAlpha(0);
   renderer.outputColorSpace=THREE.SRGBColorSpace;
   const scene=new THREE.Scene();
   const camera=new THREE.OrthographicCamera(-3.1,3.1,3.5,-3.5,.1,100);
   camera.position.set(0,0,14);
   const ambient=new THREE.HemisphereLight("#fff9e7","#87a9b8",2.7);scene.add(ambient);
   const key=new THREE.DirectionalLight("#fff1cd",3.0);key.position.set(-3,6,8);scene.add(key);
   const fill=new THREE.DirectionalLight("#a9dded",1.5);fill.position.set(5,-1,6);scene.add(fill);
   const group=new THREE.Group();scene.add(group);
   const geometry=new THREE.SphereGeometry(1,36,26);
   const mat=(color:string,roughness=.83)=>new THREE.MeshStandardMaterial({color,roughness,metalness:0.0});
   const amber=mat("#d69657"), cream=mat("#fff0d2"),pink=mat("#df8a98"),dark=mat("#433a45"),green=mat("#82baa1"),yellow=mat("#f8d478"),blue=mat("#a1ceeb");
   const sphere=(parent:InstanceType<typeof THREE.Group>,x:number,y:number,z:number,sx:number,sy:number,sz:number,material:InstanceType<typeof THREE.MeshStandardMaterial>)=>{
    const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);parent.add(mesh);return mesh;
   };
   // Sculpted toy bear; simple clay-like volumes, not an image placeholder.
   const bear=new THREE.Group();bear.position.set(.25,-.13,0);group.add(bear);
   sphere(bear,0,-1.16,-.1,.94,1.14,.66,amber);
   sphere(bear,-.9,-1.36,.32,.28,.54,.33,amber).rotation.z=-.35;
   sphere(bear,.9,-1.36,.32,.28,.54,.33,amber).rotation.z=.35;
   sphere(bear,-.52,-2.05,.32,.39,.32,.47,amber);
   sphere(bear,.52,-2.05,.32,.39,.32,.47,amber);
   sphere(bear,-.77,.92,-.08,.46,.48,.3,amber);
   sphere(bear,.77,.92,-.08,.46,.48,.3,amber);
   sphere(bear,-.77,.92,.23,.21,.22,.13,pink);
   sphere(bear,.77,.92,.23,.21,.22,.13,pink);
   sphere(bear,0,.20,.25,1.18,1.04,.78,amber);
   sphere(bear,0,-.12,.94,.62,.47,.32,cream);
   sphere(bear,-.41,.36,1.00,.115,.15,.10,dark);
   sphere(bear,.41,.36,1.00,.115,.15,.10,dark);
   sphere(bear,0,-.01,1.29,.17,.13,.11,dark);
   sphere(bear,-.68,.04,.9,.18,.12,.07,pink);
   sphere(bear,.68,.04,.9,.18,.12,.07,pink);
   const smile=new THREE.TorusGeometry(.23,.026,8,30,Math.PI);
   const mouth=new THREE.Mesh(smile,dark);mouth.position.set(0,-.21,1.22);mouth.rotation.z=Math.PI;bear.add(mouth);
   // Handmade floating flower mobiles and pastel bubbles create depth/parallax.
   const ornaments:InstanceType<typeof THREE.Group>[]=[];
   for(let i=0;i<8;i++){
    const g=new THREE.Group();const angle=i*Math.PI*2/8;
    g.position.set(Math.cos(angle)*2.25,Math.sin(angle)*2.52,-1.3);
    for(let j=0;j<5;j++){const a=j*Math.PI*2/5;sphere(g,Math.cos(a)*.26,Math.sin(a)*.26,0,.24,.24,.12,j%2?pink:yellow);}
    sphere(g,0,0,.12,.19,.19,.14,cream);group.add(g);ornaments.push(g);
   }
   const floor=new THREE.Mesh(new THREE.CylinderGeometry(2.12,2.29,.3,72),green);
   floor.position.set(0,-2.25,-1.5);group.add(floor);
   root.appendChild(renderer.domElement);renderer.domElement.setAttribute("aria-hidden","true");
   renderer.domElement.style.cssText="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;";
   const resize=()=>{const rect=root.getBoundingClientRect();renderer.setSize(Math.max(1,rect.width),Math.max(1,rect.height),false);camera.updateProjectionMatrix();};
   resize();resizeObserver=new ResizeObserver(resize);resizeObserver.observe(root);
   setReady(true);
   let last=0;const tick=(time:number)=>{if(disposed)return;frame=requestAnimationFrame(tick);if(document.visibilityState==="hidden"||time-last<30)return;last=time;group.rotation.y=Math.sin(time*.00044)*.13;bear.rotation.z=Math.sin(time*.00115)*.028;bear.position.y=-.13+Math.sin(time*.0017)*.05;ornaments.forEach((g,i)=>{g.rotation.z=time*.00013*(i%2?1:-1);g.position.y=Math.sin(i*Math.PI/4)*2.52+Math.sin(time*.001+i)*.06;});renderer.render(scene,camera);};
   frame=requestAnimationFrame(tick);
   cleanup=()=>{cancelAnimationFrame(frame);resizeObserver?.disconnect();scene.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();const mats=Array.isArray(object.material)?object.material:[object.material];mats.forEach(m=>m.dispose());}});renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();};
  }).catch(()=>{});
  return ()=>{disposed=true;cleanup();};
 },[reduceMotion]);
 return <motion.div ref={host} className={"ps-hero-bear ps-hero-3d"+(ready?" is-ready":"")} initial={reduceMotion?false:{y:15,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:.75,ease:"easeOut"}}>
  <img src="/preschool-world/bear.webp" alt="Ο Πισιπούκ μας καλωσορίζει στο χωριό της μάθησης" />
 </motion.div>;
}
