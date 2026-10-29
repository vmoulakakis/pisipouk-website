/* Original Pisipouk printable studio: 20 motifs x four progressively detailed age variants.
   All paths are authored locally; no third-party images/templates are embedded. */
export type AgeBand = 0 | 1 | 2 | 3;
export const AGE_BANDS = ["2–3", "3–4", "4–5", "5–6"] as const;
export type Motif = { id:string; title:string; category:string; scene:string; prompt:string };
export const MOTIFS:Motif[] = [
 {id:"bear",title:"Ο αρκούδος Πισιπούκ",category:"Φίλοι",scene:"forest",prompt:"Πώς νιώθει σήμερα ο Πισιπούκ;"},
 {id:"fox",title:"Η μικρή αλεπού",category:"Ζώα",scene:"forest",prompt:"Πού θα φτιάξει τη φωλιά της;"},
 {id:"bunny",title:"Το κουνελάκι",category:"Ζώα",scene:"garden",prompt:"Τι θα φάει το κουνελάκι;"},
 {id:"owl",title:"Η σοφή κουκουβάγια",category:"Ζώα",scene:"forest",prompt:"Τι βλέπει τη νύχτα;"},
 {id:"turtle",title:"Η χελώνα",category:"Ζώα",scene:"sea",prompt:"Πού θα ταξιδέψει;"},
 {id:"whale",title:"Η χαρούμενη φάλαινα",category:"Θάλασσα",scene:"sea",prompt:"Πώς ανασαίνει η φάλαινα;"},
 {id:"fish",title:"Το χρωματιστό ψάρι",category:"Θάλασσα",scene:"sea",prompt:"Τι μοτίβο θα βάλεις στα λέπια;"},
 {id:"bee",title:"Η εργατική μέλισσα",category:"Φύση",scene:"garden",prompt:"Ποιο λουλούδι θα επισκεφθεί;"},
 {id:"butterfly",title:"Η πεταλούδα",category:"Φύση",scene:"garden",prompt:"Μοιάζουν οι δύο φτερούγες;"},
 {id:"flower",title:"Το λουλούδι της φιλίας",category:"Φύση",scene:"garden",prompt:"Σε ποιον θα το χαρίσεις;"},
 {id:"sunflower",title:"Ο ηλίανθος",category:"Φύση",scene:"garden",prompt:"Τι χρειάζεται για να μεγαλώσει;"},
 {id:"leaf",title:"Το φθινοπωρινό φύλλο",category:"Εποχές",scene:"forest",prompt:"Γιατί αλλάζει χρώμα;"},
 {id:"tree",title:"Το δέντρο των εποχών",category:"Εποχές",scene:"forest",prompt:"Τι συμβαίνει στο δέντρο τον χειμώνα;"},
 {id:"apple",title:"Το μήλο της σοδειάς",category:"Φύση",scene:"garden",prompt:"Τι φτιάχνουμε με τα μήλα;"},
 {id:"pumpkin",title:"Η μεγάλη κολοκύθα",category:"Εποχές",scene:"garden",prompt:"Τι σχήμα έχει;"},
 {id:"mushroom",title:"Το μανιταρόσπιτο",category:"Φαντασία",scene:"forest",prompt:"Ποιος θα μπορούσε να ζει εδώ;"},
 {id:"house",title:"Το σπίτι της παρέας",category:"Φαντασία",scene:"village",prompt:"Ποιον θα καλούσες στο σπίτι;"},
 {id:"rocket",title:"Ο πύραυλος των ονείρων",category:"Διάστημα",scene:"space",prompt:"Σε ποιον πλανήτη θα πήγαινες;"},
 {id:"boat",title:"Η βαρκούλα",category:"Ταξίδια",scene:"sea",prompt:"Πού ταξιδεύει η βαρκούλα;"},
 {id:"rainbow",title:"Το ουράνιο τόξο",category:"Χρώματα",scene:"sky",prompt:"Πόσα χρώματα θα χρησιμοποιήσεις;"}
];
export const PAINT_SWATCHES = ["#f8fafc","#f4aa91","#ffcf58","#75c8af","#80b5f5","#c5a1e8","#ef82ad","#9bcc75","#c28d68","#263c58"];
const esc=(v:string)=>v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const make=(fills:Record<string,string>,id:string,tag:string,attributes:string,children="") =>
 "<"+tag+" data-zone=\""+id+"\" "+attributes+" fill=\""+(fills[id]||"white")+"\" stroke=\"#36445a\" stroke-width=\"5\" stroke-linejoin=\"round\" stroke-linecap=\"round\">"+children+"</"+tag+">";
export function motifArtwork(id:string,fills:Record<string,string>={}):string{
 const s=(name:string,tag:string,attrs:string,children="")=>make(fills,name,tag,attrs,children);
 const eye=(x:number,y:number,r=5)=>"<circle cx=\""+x+"\" cy=\""+y+"\" r=\""+r+"\" fill=\"#36445a\"/>";
 const smile=(x:number,y:number)=>"<path d=\"M"+(x-14)+" "+y+" Q"+x+" "+(y+15)+" "+(x+14)+" "+y+"\" stroke=\"#36445a\" stroke-width=\"4\" fill=\"none\" stroke-linecap=\"round\"/>";
 switch(id){
 case "bear": return s("earL","circle",'cx="119" cy="101" r="46"')+s("earR","circle",'cx="281" cy="101" r="46"')+s("head","ellipse",'cx="200" cy="181" rx="136" ry="126"')+s("muzzle","ellipse",'cx="200" cy="216" rx="67" ry="48"')+s("nose","ellipse",'cx="200" cy="196" rx="16" ry="12"')+eye(151,167)+eye(249,167)+smile(200,226);
 case "fox": return s("leftEar","path",'d="M89 165 L70 35 Q155 66 176 116 Z"')+s("rightEar","path",'d="M224 115 Q265 55 330 35 L308 168 Z"')+s("face","path",'d="M75 150 Q200 65 325 150 Q330 270 200 325 Q70 270 75 150 Z"')+s("cheekL","path",'d="M75 224 Q140 214 200 301 L110 278 Z"')+s("cheekR","path",'d="M325 224 Q260 214 200 301 L290 278 Z"')+eye(151,195)+eye(249,195)+s("nose","circle",'cx="200" cy="245" r="13"');
 case "bunny":return s("earL","ellipse",'cx="138" cy="99" rx="36" ry="94" transform="rotate(-10 138 99)"')+s("earR","ellipse",'cx="262" cy="99" rx="36" ry="94" transform="rotate(10 262 99)"')+s("face","ellipse",'cx="200" cy="229" rx="125" ry="110"')+s("muzzle","ellipse",'cx="200" cy="265" rx="60" ry="39"')+s("nose","path",'d="M186 250 L214 250 L200 267 Z"')+eye(154,220)+eye(246,220)+smile(200,270);
 case "owl":return s("body","ellipse",'cx="200" cy="214" rx="119" ry="154"')+s("wingL","ellipse",'cx="102" cy="242" rx="45" ry="77" transform="rotate(-17 102 242)"')+s("wingR","ellipse",'cx="298" cy="242" rx="45" ry="77" transform="rotate(17 298 242)"')+s("eyeL","circle",'cx="158" cy="169" r="42"')+s("eyeR","circle",'cx="242" cy="169" r="42"')+s("beak","path",'d="M188 210 L212 210 L200 232 Z"')+eye(158,169,8)+eye(242,169,8);
 case "turtle":return s("flipperL","ellipse",'cx="112" cy="248" rx="69" ry="32" transform="rotate(-25 112 248)"')+s("flipperR","ellipse",'cx="286" cy="248" rx="69" ry="32" transform="rotate(25 286 248)"')+s("head","circle",'cx="320" cy="149" r="59"')+s("shell","ellipse",'cx="184" cy="188" rx="126" ry="103"')+s("shellCore","path",'d="M158 96 L218 96 L267 151 L238 228 L151 264 L93 212 L93 148 Z"')+s("shellSpot","ellipse",'cx="182" cy="183" rx="40" ry="34"')+eye(335,133)+smile(327,167);
 case "whale":return s("tail","path",'d="M95 229 Q22 191 36 119 Q92 126 114 173 Q165 192 159 236 Z"')+s("body","path",'d="M91 224 Q102 90 247 108 Q345 112 344 215 Q333 312 225 317 Q118 310 91 224 Z"')+s("belly","path",'d="M112 256 Q224 216 335 236 Q312 326 223 318 Q138 315 112 256 Z"')+s("spout","path",'d="M211 119 Q184 70 168 54 Q202 54 215 90 Q235 53 267 50 Q258 80 232 117 Z"')+eye(272,172)+smile(270,204);
 case "fish":return s("tail","path",'d="M280 200 L362 114 L362 286 Z"')+s("body","ellipse",'cx="190" cy="200" rx="143" ry="103"')+s("fin","path",'d="M156 112 L224 47 L248 122 Z"')+s("belly","path",'d="M113 243 Q211 205 316 239 Q249 319 147 283 Z"')+s("stripe","path",'d="M204 98 Q251 196 203 303 L249 290 Q283 201 249 109 Z"')+eye(106,173)+smile(110,223);
 case "bee":return s("wingL","ellipse",'cx="149" cy="110" rx="78" ry="49" transform="rotate(-34 149 110)"')+s("wingR","ellipse",'cx="251" cy="110" rx="78" ry="49" transform="rotate(34 251 110)"')+s("body","ellipse",'cx="200" cy="228" rx="113" ry="108"')+s("stripe1","path",'d="M120 172 Q200 194 279 172 L298 205 Q200 226 102 205 Z"')+s("stripe2","path",'d="M98 245 Q200 268 302 245 L280 281 Q200 300 120 281 Z"')+eye(163,159)+eye(237,159)+smile(200,183);
 case "butterfly":return s("leftWing","path",'d="M195 190 C87 36 -6 89 74 212 C18 322 128 363 195 226 Z"')+s("rightWing","path",'d="M205 190 C313 36 406 89 326 212 C382 322 272 363 205 226 Z"')+s("dotL","circle",'cx="122" cy="176" r="34"')+s("dotR","circle",'cx="278" cy="176" r="34"')+s("lowerL","circle",'cx="145" cy="273" r="20"')+s("lowerR","circle",'cx="255" cy="273" r="20"')+s("body","ellipse",'cx="200" cy="222" rx="20" ry="106"')+"<path d=\"M190 125 Q151 60 148 65 M210 125 Q249 60 252 65\" fill=\"none\" stroke=\"#36445a\" stroke-width=\"5\"/>";
 case "flower":return Array.from({length:8},(_,i)=>{const a=i*Math.PI/4,x=200+Math.cos(a)*88,y=180+Math.sin(a)*88;return s("petal"+i,"ellipse",'cx="'+x+'" cy="'+y+'" rx="46" ry="66" transform="rotate('+(i*45+90)+' '+x+' '+y+')"');}).join("")+s("center","circle",'cx="200" cy="180" r="60"')+"<path d=\"M200 239 L200 374 Q150 309 120 341 Q158 390 200 342 Q235 306 273 336 Q240 385 200 342\" fill=\"none\" stroke=\"#36445a\" stroke-width=\"7\"/>";
 case "sunflower":return Array.from({length:12},(_,i)=>{const a=i*Math.PI/6,x=200+Math.cos(a)*95,y=164+Math.sin(a)*95;return s("petal"+i,"ellipse",'cx="'+x+'" cy="'+y+'" rx="27" ry="69" transform="rotate('+(i*30+90)+' '+x+' '+y+')"');}).join("")+s("seeds","circle",'cx="200" cy="164" r="66"')+"<path d=\"M200 232 V373 M200 325 Q124 260 96 304 Q153 354 200 325 M200 340 Q276 280 299 313 Q258 360 200 340\" stroke=\"#36445a\" stroke-width=\"7\" fill=\"none\"/>";
 case "leaf":return s("leaf","path",'d="M197 351 Q20 227 95 88 Q223 9 316 75 Q394 229 197 351 Z"')+"<path d=\"M197 350 Q211 194 314 76 M179 256 L102 174 M225 204 L308 205 M257 148 L243 79\" fill=\"none\" stroke=\"#36445a\" stroke-width=\"5\"/>";
 case "tree":return s("trunk","path",'d="M172 373 L175 244 L143 175 L168 167 L199 220 L237 162 L259 175 L218 255 L230 373 Z"')+s("canopy1","circle",'cx="130" cy="174" r="77"')+s("canopy2","circle",'cx="217" cy="112" r="89"')+s("canopy3","circle",'cx="278" cy="190" r="80"')+s("fruit1","circle",'cx="141" cy="154" r="13"')+s("fruit2","circle",'cx="234" cy="168" r="13"');
 case "apple":return s("leaf","ellipse",'cx="236" cy="83" rx="54" ry="25" transform="rotate(-30 236 83)"')+s("fruit","path",'d="M200 139 Q102 62 72 166 Q35 285 143 349 Q198 385 220 351 Q255 373 302 332 Q381 255 321 154 Q280 76 200 139 Z"')+"<path d=\"M201 142 Q192 92 206 53\" stroke=\"#36445a\" stroke-width=\"8\" fill=\"none\"/>";
 case "pumpkin":return s("left","ellipse",'cx="145" cy="218" rx="100" ry="117"')+s("right","ellipse",'cx="255" cy="218" rx="100" ry="117"')+s("middle","ellipse",'cx="200" cy="222" rx="72" ry="124"')+s("stem","path",'d="M179 113 Q181 73 207 51 L229 64 Q203 93 217 117 Z"')+s("vine","path",'d="M223 78 Q292 52 280 27 Q237 29 249 48"');
 case "mushroom":return s("stalk","path",'d="M159 199 L154 334 Q200 368 246 334 L241 199 Z"')+s("cap","path",'d="M58 215 Q56 53 200 51 Q344 53 342 215 Q200 239 58 215 Z"')+s("spot1","ellipse",'cx="142" cy="139" rx="29" ry="22"')+s("spot2","ellipse",'cx="238" cy="132" rx="25" ry="31"')+s("door","path",'d="M181 344 V287 Q200 267 219 287 V344 Z"');
 case "house":return s("walls","rect",'x="93" y="165" width="214" height="195" rx="12"')+s("roof","path",'d="M55 181 L200 57 L345 181 Z"')+s("door","rect",'x="171" y="253" width="61" height="107" rx="18"')+s("windowL","rect",'x="112" y="211" width="50" height="56" rx="8"')+s("windowR","rect",'x="247" y="211" width="40" height="56" rx="8"');
 case "rocket":return s("flame","path",'d="M154 288 Q116 337 201 385 Q284 338 245 288 Z"')+s("finL","path",'d="M154 224 Q84 226 84 336 L159 290 Z"')+s("finR","path",'d="M246 224 Q316 226 316 336 L241 290 Z"')+s("body","path",'d="M153 290 Q110 130 200 24 Q290 130 247 290 Z"')+s("window","circle",'cx="200" cy="153" r="42"');
 case "boat":return s("hull","path",'d="M58 244 H350 L296 333 H132 Z"')+s("sail","path",'d="M205 69 V233 H79 Z"')+s("sail2","path",'d="M219 84 L330 232 H219 Z"')+s("sun","circle",'cx="331" cy="87" r="30"')+"<path d=\"M45 352 Q93 325 141 352 T235 352 T331 352\" fill=\"none\" stroke=\"#36445a\" stroke-width=\"6\"/>";
 case "rainbow":return [0,1,2,3,4,5].map((i)=>s("arc"+i,"path",'d="M'+(36+22*i)+' 308 A'+(164-22*i)+' '+(164-22*i)+' 0 0 1 '+(364-22*i)+' 308 L'+(342-22*i)+' 308 A'+(142-22*i)+' '+(142-22*i)+' 0 0 0 '+(58+22*i)+' 308 Z"')).join("")+s("cloudL","ellipse",'cx="83" cy="314" rx="65" ry="40"')+s("cloudR","ellipse",'cx="317" cy="314" rx="65" ry="40"');
 default:return motifArtwork("bear",fills);
 }
}
export function printableSvg(motifId:string,age:AgeBand,fills:Record<string,string>={},paper:"A4"|"A5"="A4"){
 const m=MOTIFS.find(x=>x.id===motifId)||MOTIFS[0];
 const decorations=age===0?"":age===1?
 '<g stroke="#94aac0" fill="none" stroke-width="2"><path d="M52 225 Q80 211 108 225 M290 224 Q320 209 345 223"/></g>':
 age===2?'<g stroke="#94aac0" fill="none" stroke-width="2"><path d="M58 225 Q80 208 104 224 M298 224 Q322 208 345 223 M75 332 L92 345 M304 332 L321 345"/></g>':
 '<g stroke="#9badbe" fill="none" stroke-width="2" stroke-dasharray="5 5"><path d="M60 334 Q200 390 340 334 M50 184 Q200 5 350 184"/></g>';
 const trace=age>=2?'<path d="M41 426 H359" stroke="#bbc4d1" stroke-width="1" stroke-dasharray="4 5"/>':"";
 const mm=paper==="A4"?"210mm\" height=\"297mm":"148mm\" height=\"210mm";
 return '<svg xmlns="http://www.w3.org/2000/svg" width="'+mm+'" viewBox="0 0 420 594"><rect width="420" height="594" rx="6" fill="#fff"/><rect x="16" y="14" width="388" height="566" rx="17" fill="#fff" stroke="#d4dce5" stroke-width="2"/><g fill="#36445a" font-family="Arial,sans-serif" text-anchor="middle"><text x="210" y="50" font-size="20" font-weight="700">'+esc(m.title)+'</text><text x="210" y="70" font-size="10">ΠΙΣΙΠΟΥΚ · ΧΡΩΜΑΤΙΖΩ ΚΑΙ ΔΗΜΙΟΥΡΓΩ · '+AGE_BANDS[age]+'</text></g><g transform="translate(35 95) scale(.875)">'+motifArtwork(motifId,fills)+decorations+'</g>'+trace+'<g font-family="Arial,sans-serif" text-anchor="middle" fill="#617087"><text x="210" y="474" font-size="13">'+esc(m.prompt)+'</text><text x="210" y="504" font-size="11">Σκέφτομαι → ζωγραφίζω → δημιουργώ</text><text x="210" y="545" font-size="10">Κόψιμο μόνο με την επίβλεψη ενηλίκου ✂</text></g></svg>';
}
export function galleryPreview(motifId:string){const p:Record<string,string>={}; const ids=[...motifArtwork(motifId).matchAll(/data-zone="([^"]+)"/g)].map(m=>m[1]);ids.forEach((id,i)=>p[id]=PAINT_SWATCHES[1+(i%8)]);return motifArtwork(motifId,p);}
export function templateCount(){return MOTIFS.length*AGE_BANDS.length;}
