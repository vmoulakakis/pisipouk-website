/* Offline service worker scoped to /preschool/360/.
 * No user data storage, analytics, push, ads, external requests, or broad root intercepts.
 */
const PREFIX="pisipouk360-";
const VERSION="v3-cc0-20261013";
const CACHE=PREFIX+VERSION;
const PRECACHE=[
 "/preschool/360/cozy-garden.html",
 "/preschool/360/cozy-garden.css",
 "/preschool/360/cozy-garden.js",
 "/preschool/360/core/random-play.js",
 "/preschool/360/manifest.webmanifest",
 "/preschool/360/icon.svg",
 "/preschool/games/vendor/three-r128.min.js",
 "/preschool/games/vendor/OrbitControls-r128.js",
 "/preschool/games/vendor/GLTFLoader-r128.js",
 "/preschool/360/cc0-art.js",
 "/preschool/360/assets/tree-oak.glb",
 "/preschool/360/assets/tree-detailed.glb",
 "/preschool/360/assets/flower-red.glb",
 "/preschool/360/assets/flower-yellow.glb",
 "/preschool/360/assets/flower-purple.glb",
 "/preschool/360/assets/grass-large.glb",
 "/preschool/360/assets/fence-gate.glb",
 "/preschool/360/assets/bush.glb",
 "/preschool/360/assets/cow.glb",
 "/preschool/360/assets/chick.glb",
 "/preschool/360/assets/pig.glb",
 "/preschool/360/assets/cat.glb",
 "/preschool/360/assets/apple.glb",
 "/preschool/360/assets/carrot.glb",
 "/preschool/360/assets/strawberry.glb",
 "/preschool/360/assets/mushrooms.glb"
];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PRECACHE)));
 self.skipWaiting();
});
self.addEventListener("activate",event=>{
 event.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))),
  self.clients.claim()
 ]));
});
self.addEventListener("fetch",event=>{
 const req=event.request;
 if(req.method!=="GET")return;
 const u=new URL(req.url);
 if(u.origin!==self.location.origin)return;
 // Only named standalone farm files and exactly these two shared vendor files.
 if(!PRECACHE.includes(u.pathname))return;
 event.respondWith(caches.open(CACHE).then(async cache=>{
   try{
     const response=await fetch(req);
     if(response.ok)await cache.put(req,response.clone());
     return response;
   }catch(error){
     const cached=await cache.match(req);
     if(cached)return cached;
     throw error;
   }
 }));
});
