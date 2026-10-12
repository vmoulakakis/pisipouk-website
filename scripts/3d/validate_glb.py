"""Hard gate for production glTF binary assets: reject static meshes pretending to be animated.
Only standard library required; use --stage mesh before UniRig and --stage animated after Blender.
"""
import argparse,json,struct,sys
from pathlib import Path
MANDATORY={"Idle","Walk","Wave","Point","Celebrate","Listen"}
def inspect(file):
 data=Path(file).read_bytes()
 if len(data)<20 or data[:4]!=b"glTF":raise ValueError("Expected binary .glb (not a JPG, PNG or HTML)")
 _,version,size=struct.unpack_from("<4sII",data,0)
 if version!=2 or size!=len(data):raise ValueError("Invalid GLB header or total length")
 length,tag=struct.unpack_from("<I4s",data,12)
 if tag!=b"JSON" or length>len(data)-20:raise ValueError("Missing glTF JSON chunk")
 return json.loads(data[20:20+length].decode("utf-8"))
def run():
 p=argparse.ArgumentParser();p.add_argument("file");p.add_argument("--stage",choices=("mesh","animated"),default="animated")
 a=p.parse_args()
 try:
  g=inspect(a.file)
  meshes=g.get("meshes",[]);skins=g.get("skins",[]);anims=g.get("animations",[])
  if not meshes:raise ValueError("No mesh geometry")
  if a.stage=="animated":
   if not skins or max(len(s.get("joints",[])) for s in skins)<8:raise ValueError("Missing usable skin with >=8 joints")
   names={a.get("name") for a in anims}
   if MANDATORY-names:raise ValueError("Missing clips: "+", ".join(sorted(MANDATORY-names)))
   if not all(a.get("samplers") and a.get("channels") for a in anims):raise ValueError("Empty animation channels")
   for anim in anims:
    for channel in anim.get("channels",[]):
     if channel.get("target",{}).get("node") is None:raise ValueError("Unbound animation channel")
  print(json.dumps({"pass":True,"meshes":len(meshes),"skins":len(skins),"joints":[len(s.get("joints",[])) for s in skins],"animations":[x.get("name") for x in anims]}))
 except Exception as exc:
  print(json.dumps({"pass":False,"error":str(exc)}),file=sys.stderr);sys.exit(1)
if __name__=="__main__":run()
