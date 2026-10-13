/* PISIPOUK 360 • Kenney CC0 models scene adapter
   Original scene staging/animations; model geometry authored by Kenney (CC0).
   Local URLs only; failed models are optional and leave procedural scene intact.
*/
(function(root){
"use strict";
const BASE="/preschool/360/assets/";
const DESCRIPTORS=[
 {id:"tree-oak",x:-6.4,z:-3.5,size:2.9,type:"scenery"},
 {id:"tree-detailed",x:0.65,z:-5.6,size:3.1,type:"scenery"},
 {id:"bush",x:3.5,z:-4.8,size:1.05,type:"scenery"},
 {id:"grass-large",x:-7.05,z:1.5,size:.58,type:"scenery"},
 {id:"flower-red",x:-5.85,z:3.6,size:.66,type:"scenery"},
 {id:"flower-yellow",x:6.6,z:3.25,size:.66,type:"scenery"},
 {id:"flower-purple",x:6.1,z:-1.2,size:.73,type:"scenery"},
 {id:"fence-gate",x:0,z:-4.65,size:1.65,type:"scenery"},
 {id:"mushrooms",x:6.6,z:-4.4,size:.55,type:"scenery"},
 {id:"cow",x:5.65,z:-2.3,size:1.65,type:"animal",name:"Αγελαδίτσα",sound:"μου",note:261.63},
 {id:"pig",x:-5.7,z:-1.55,size:1.30,type:"animal",name:"Γουρουνάκι",sound:"γκρου",note:293.66},
 {id:"chick",x:1.85,z:-2.8,size:.90,type:"animal",name:"Κοτοπουλάκι",sound:"πιπ πιπ",note:392},
 {id:"cat",x:-2.6,z:-2.5,size:1.00,type:"animal",name:"Γατάκι",sound:"νιάου",note:440},
 {id:"apple",x:4.8,z:-.9,size:.56,type:"fruit",name:"Μηλαράκι"},
 {id:"carrot",x:6.25,z:1.4,size:.52,type:"fruit",name:"Καροτάκι"},
 {id:"strawberry",x:-6.2,z:2.3,size:.43,type:"fruit",name:"Φραουλίτσα"}
];
function create(options){
 const {THREE,scene,register}=options;
 if(!THREE?.GLTFLoader)return{ready:Promise.resolve({loaded:0,failed:DESCRIPTORS.length}),update() {},getAnimals:()=>[]};
 const loader=new THREE.GLTFLoader();
 const entities=[];
 let cancelled=false;
 const files=DESCRIPTORS.map(item=>new Promise(resolve=>{
   loader.load(BASE+item.id+".glb",gltf=>{
     if(cancelled){resolve(false);return;}
     const group=new THREE.Group();
     const mesh=gltf.scene;
     mesh.traverse(o=>{
       if(!o.isMesh)return;
       o.castShadow=true;o.receiveShadow=true;
       if(o.material){
         const mats=Array.isArray(o.material)?o.material:[o.material];
         for(const m of mats){
           if("roughness"in m)m.roughness=.35;
           if("metalness"in m)m.metalness=.04;
           if(m.color){
             const hsl={h:0,s:0,l:0};m.color.getHSL(hsl);
             // Retain recognizable animal colors; amplify chroma without destroying white fur.
             if(hsl.s>.1)m.color.setHSL(hsl.h,Math.min(.9,hsl.s*1.25),Math.min(.84,hsl.l));
           }
           m.needsUpdate=true;
         }
       }
     });
     mesh.updateMatrixWorld(true);
     const bounds=new THREE.Box3().setFromObject(mesh);
     const dimensions=bounds.getSize(new THREE.Vector3());
     const minY=bounds.min.y;
     const max=Math.max(dimensions.x,dimensions.y,dimensions.z,.001);
     mesh.scale.setScalar(item.size/max);
     mesh.position.set(-bounds.getCenter(new THREE.Vector3()).x*item.size/max,-minY*item.size/max,-bounds.getCenter(new THREE.Vector3()).z*item.size/max);
     group.add(mesh);
     group.position.set(item.x,.20,item.z);
     scene.add(group);
     if(item.type!=="scenery"){
       group.userData.interactive={type:"farmModel",id:item.id,name:item.name,sound:item.sound,note:item.note,kind:item.type};
       register(group);
       // Extra invisible target: > 40% bigger than the visible mesh, for younger children.
       const shape=new THREE.Mesh(new THREE.SphereGeometry(item.size*.72,12,9),new THREE.MeshBasicMaterial({visible:false}));
       shape.position.y=item.size*.46;group.add(shape);
     }
     entities.push({item,group,phase:item.x*2.17});
     resolve(true);
   },undefined,error=>{console.info("[PISIPOUK] CC0 model unavailable:",item.id,error?.message||error);resolve(false)});
 }));
 const ready=Promise.all(files).then(result=>({loaded:result.filter(Boolean).length,failed:result.filter(x=>!x).length}));
 return {
   ready,
   getAnimals:()=>entities.filter(e=>e.item.type==="animal"),
   onClick(id){
      const entry=entities.find(e=>e.item.id===id);if(!entry)return null;
      entry.flashUntil=performance.now()+850;
      return entry.item;
   },
   update(time){
     for(const e of entities){
       const t=time+e.phase;
       if(e.item.type==="animal"){
         e.group.rotation.y=Math.sin(t*.9)*.08;
         const jump=e.flashUntil&&performance.now()<e.flashUntil;
         e.group.position.y=.20+(jump?Math.abs(Math.sin(t*12))*.32:Math.sin(t*1.3)*.035);
       }
       if(e.item.type==="fruit")e.group.rotation.y=time*.35+e.phase;
       if(e.item.type==="scenery"&&e.item.id.startsWith("flower"))e.group.rotation.z=Math.sin(t*1.3)*.05;
     }
   },
   dispose(){cancelled=true;entities.forEach(e=>scene.remove(e.group));entities.length=0;}
 };
}
root.PisipoukCC0Art={create,descriptors:DESCRIPTORS};
})(window);