#!/usr/bin/env python3
"""FREE Hugging Face ZeroGPU ONLY. Never uses hf_jobs or paid inference providers.
Demo API changes frequently; first inspect, then try one generation.
The user provides an approved full-body isolated Pisipouk PNG.
"""
import argparse,os,shutil,sys
from pathlib import Path

SPACE="microsoft/TRELLIS.2"
def main():
 p=argparse.ArgumentParser()
 p.add_argument("action",choices=["inspect","mesh"])
 p.add_argument("--image")
 p.add_argument("--output",default="pisipouk_mesh.glb")
 p.add_argument("--seed",type=int,default=42)
 p.add_argument("--resolution",choices=["512","1024"],default="1024")
 args=p.parse_args()
 try:from gradio_client import Client,handle_file
 except ImportError:p.error("Run: python -m pip install -U gradio_client")
 # Client uses only the public ZeroGPU Space; API calls consume its included usage quota.
 # No Hugging Face Jobs API, credit transfers, provider APIs, or paid GPUs.
 try: client=Client(SPACE,token=os.environ.get("HF_TOKEN"))
 except Exception as e:sys.exit("Cannot connect to free Space: "+str(e))
 if args.action=="inspect":
  client.view_api()
  return
 if not args.image:p.error("--image required")
 inp=Path(args.image).resolve()
 if not inp.is_file():p.error("Input PNG missing: "+str(inp))
 try:
  data=client.predict(handle_file(str(inp)),args.seed,args.resolution,
   7.5,0.7,12,5.0,7.5,0.5,12,3.0,1.0,0.0,12,3.0,api_name="/image_to_3d")
  # This Space uses a session-local gr.State and a separate extraction stage.
  state=data[0] if isinstance(data,(list,tuple)) and len(data)>1 else None
  result=client.predict(state,100000,2048,api_name="/extract_glb")
  def find_glb(x):
   if isinstance(x,str) and x.lower().endswith(".glb"):return Path(x)
   if isinstance(x,dict):
    for v in x.values():
     r=find_glb(v)
     if r:return r
   if isinstance(x,(list,tuple)):
    for v in x:
     r=find_glb(v)
     if r:return r
   return None
  glb=find_glb(result)
  if not glb or not glb.is_file():raise RuntimeError("No downloaded GLB returned by Space")
  out=Path(args.output).resolve();out.parent.mkdir(parents=True,exist_ok=True)
  shutil.copy2(glb,out)
  print("STATIC mesh downloaded:",out,"(",out.stat().st_size,"bytes )")
  print("Next free step: https://huggingface.co/spaces/VAST-AI/SkinTokens")
 except Exception as e:
  sys.exit("Space quota/API/queue unavailable: "+str(e)+
   "\nBrowser fallback: https://huggingface.co/spaces/microsoft/TRELLIS.2 → Upload → Generate → Extract GLB")
if __name__=="__main__":main()
