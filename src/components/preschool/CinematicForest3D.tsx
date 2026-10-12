import { useEffect, useRef } from "react";
import forestFallback from "@/assets/pisipouk-exterior.webp";
/** Procedural real-time WebGL scene. Self-contained: no external assets, safe fallback. */
const vertex=`attribute vec2 position;void main(){gl_Position=vec4(position,0.0,1.0);}`;
const fragment=`precision highp float;
uniform vec2 u_resolution;uniform float u_time;
vec3 sky(vec2 uv){float horizon=smoothstep(-0.26,0.4,uv.y);vec3 top=vec3(.23,.56,.70);vec3 bottom=vec3(.96,.82,.58);return mix(bottom,top,horizon);}
float sphere(vec3 p,vec3 c,float r){return length(p-c)-r;}
float scene(vec3 p){float d=p.y+1.3;for(int i=0;i<5;i++){float x=float(i)*1.65-3.1;float z=2.0+mod(float(i)*1.7,3.0);float trunk=max(length((p-vec3(x,-.24,z)).xz)-.13,abs(p.y+.34)-1.0);d=min(d,trunk);d=min(d,sphere(p,vec3(x,.78,z),.92));}d=min(d,sphere(p,vec3(-1.2,-.42,0.0),.50));d=min(d,sphere(p,vec3(1.3,-.55,1.1),.35));return d;}
vec3 material(vec3 p){if(p.y< -1.27)return vec3(.31,.57,.34);for(int i=0;i<5;i++){float x=float(i)*1.65-3.1;float z=2.0+mod(float(i)*1.7,3.0);if(length(p-vec3(x,.78,z))<1.02)return mix(vec3(.16,.43,.30),vec3(.44,.68,.35),float(i)/5.0);if(length((p-vec3(x,-.24,z)).xz)<.18)return vec3(.49,.28,.17);}return vec3(.83,.52,.30);}
void main(){vec2 uv=(gl_FragCoord.xy-.5*u_resolution)/u_resolution.y;vec3 ro=vec3(sin(u_time*.09)*.50,1.0,-6.7);vec3 rd=normalize(vec3(uv.x,uv.y-.07,1.8));vec3 col=sky(uv);float sun=pow(max(dot(rd,normalize(vec3(.65,.65,1.0))),0.0),50.0);col+=vec3(.95,.76,.43)*sun*.75;float t=0.0;bool hit=false;vec3 p=ro;for(int j=0;j<68;j++){p=ro+rd*t;float d=scene(p);if(d<.008){hit=true;break;}if(t>21.)break;t+=max(.03,d*.74);}if(hit){float e=.02;vec3 n=normalize(vec3(scene(p+vec3(e,0.,0.))-scene(p-vec3(e,0.,0.)),scene(p+vec3(0.,e,0.))-scene(p-vec3(0.,e,0.)),scene(p+vec3(0.,0.,e))-scene(p-vec3(0.,0.,e))));vec3 light=normalize(vec3(-.55,.90,-.45));float diffuse=max(dot(n,light),0.0);col=material(p)*(.55+.6*diffuse)+vec3(.92,.65,.40)*pow(max(dot(reflect(-light,n),-rd),0.0),18.)*.12;float fog=1.0-exp(-.014*t*t);col=mix(col,sky(uv),fog);}float sparkle=0.0;for(int k=0;k<10;k++){float a=float(k)*1.781;vec2 q=vec2(sin(a*3.3+u_time*.24)*.85,cos(a*2.1+u_time*.17)*.55);float dd=length(uv-q);sparkle+=.012/(dd*dd+.004)*.065;}col+=vec3(.95,.76,.39)*min(sparkle,.25);col=pow(col,vec3(.88));gl_FragColor=vec4(col,1.0);}`;
export function CinematicForest3D(){
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const node=canvas.current;if(!node)return;
  const gl=node.getContext("webgl",{alpha:false,antialias:false,powerPreference:"low-power"});if(!gl)return;
  const compile=(type:number,source:string)=>{const shader=gl.createShader(type);if(!shader)return null;gl.shaderSource(shader,source);gl.compileShader(shader);return gl.getShaderParameter(shader,gl.COMPILE_STATUS)?shader:null};
  const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);if(!vs||!fs)return;
  const program=gl.createProgram();if(!program)return;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  gl.useProgram(program);const position=gl.getAttribLocation(program,"position");gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const resolution=gl.getUniformLocation(program,"u_resolution"),time=gl.getUniformLocation(program,"u_time");
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let frame=0;let active=true;
  const draw=(ms:number)=>{if(!active)return;const width=Math.max(1,Math.floor(node.clientWidth*Math.min(devicePixelRatio||1,1.5))),height=Math.max(1,Math.floor(node.clientHeight*Math.min(devicePixelRatio||1,1.5)));if(node.width!==width||node.height!==height){node.width=width;node.height=height;gl.viewport(0,0,width,height);}gl.uniform2f(resolution,width,height);gl.uniform1f(time,reduced?0:ms*.001);gl.drawArrays(gl.TRIANGLES,0,6);if(!reduced)frame=requestAnimationFrame(draw);};
  frame=requestAnimationFrame(draw);
  const lost=(e:Event)=>{e.preventDefault();active=false;cancelAnimationFrame(frame)};node.addEventListener("webglcontextlost",lost);
  return()=>{active=false;cancelAnimationFrame(frame);node.removeEventListener("webglcontextlost",lost);gl.deleteProgram(program);gl.deleteBuffer(buffer);gl.deleteShader(vs);gl.deleteShader(fs)};
 },[]);
 return <div className="pw17-3d-environment" aria-label="Τρισδιάστατο κινούμενο τοπίο παραμυθένιου δάσους"><img src={forestFallback} alt="" className="pw17-3d-fallback"/><canvas ref={canvas} aria-hidden="true"/></div>;
}