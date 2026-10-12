"""Unit tests for the GLB acceptance gate, no GPU/Blender required."""
import json,struct,subprocess,sys,tempfile,unittest
from pathlib import Path
VALIDATOR=Path(__file__).resolve().parents[1]/"scripts"/"3d"/"validate_glb.py"
def asset(path,manifest):
 raw=json.dumps(manifest,separators=(",",":")).encode()
 raw+=b" " * ((-len(raw))%4)
 path.write_bytes(struct.pack("<4sII",b"glTF",2,20+len(raw))+struct.pack("<I4s",len(raw),b"JSON")+raw)
 return path
def good():
 names=["Idle","Walk","Wave","Point","Celebrate","Listen"]
 return {"asset":{"version":"2.0"},"meshes":[{"primitives":[{"attributes":{"POSITION":0}}]}],"skins":[{"joints":list(range(10))}],"animations":[{"name":x,"channels":[{"sampler":0,"target":{"node":0,"path":"rotation"}}],"samplers":[{"input":0,"output":1}]} for x in names]}
class GlbAcceptanceTests(unittest.TestCase):
 def run_gate(self,path,stage="animated"):
  return subprocess.run([sys.executable,str(VALIDATOR),str(path),"--stage",stage],capture_output=True,text=True)
 def test_animated_glb_with_clips(self):
  with tempfile.TemporaryDirectory() as d:
   out=self.run_gate(asset(Path(d)/"test.glb",good()))
   self.assertEqual(out.returncode,0,out.stderr)
 def test_no_skeleton_fails(self):
  with tempfile.TemporaryDirectory() as d:
   m=good();m.pop("skins")
   self.assertNotEqual(self.run_gate(asset(Path(d)/"test.glb",m)).returncode,0)
 def test_static_mesh_rejected_at_animation_gate(self):
  with tempfile.TemporaryDirectory() as d:
   m={"asset":{"version":"2.0"},"meshes":[{"primitives":[{}]}]}
   file=asset(Path(d)/"mesh.glb",m)
   self.assertEqual(self.run_gate(file,"mesh").returncode,0)
   self.assertNotEqual(self.run_gate(file,"animated").returncode,0)
 def test_png_cannot_masquerade_as_3d(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d)/"art.png";p.write_bytes(b"\\x89PNG"+bytes(60))
   self.assertNotEqual(self.run_gate(p).returncode,0)
if __name__=="__main__":unittest.main()
