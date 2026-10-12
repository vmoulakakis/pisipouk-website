"""TRELLIS.2 image-to-3D adapter. Run in the official GPU environment, not on the website server.
Requires NVIDIA GPU >=24 GB VRAM and cost approval. Input must be an approved Pisipouk reference.
Upstream: https://github.com/microsoft/TRELLIS.2 (MIT).
"""
import os,argparse,json
from pathlib import Path
def main():
 p=argparse.ArgumentParser()
 p.add_argument("--reference",required=True)
 p.add_argument("--output",required=True)
 p.add_argument("--texture-size",type=int,choices=(1024,2048,4096),default=2048)
 p.add_argument("--max-faces",type=int,default=125000)
 a=p.parse_args()
 src=Path(a.reference).resolve()
 if not src.is_file():p.error("Missing approved reference PNG")
 dst=Path(a.output).resolve();dst.parent.mkdir(parents=True,exist_ok=True)
 os.environ.setdefault("OPENCV_IO_ENABLE_OPENEXR","1")
 os.environ.setdefault("PYTORCH_CUDA_ALLOC_CONF","expandable_segments:True")
 import torch
 if not torch.cuda.is_available() or torch.cuda.get_device_properties(0).total_memory < 23*1024**3:
  raise RuntimeError("TRELLIS.2 official pipeline requires an NVIDIA GPU with at least 24 GB VRAM")
 from PIL import Image
 from trellis2.pipelines import Trellis2ImageTo3DPipeline
 import o_voxel
 pipe=Trellis2ImageTo3DPipeline.from_pretrained("microsoft/TRELLIS.2-4B")
 pipe.cuda()
 mesh=pipe.run(Image.open(src).convert("RGBA"))[0]
 mesh.simplify(16777216)
 glb=o_voxel.postprocess.to_glb(vertices=mesh.vertices,faces=mesh.faces,attr_volume=mesh.attrs,coords=mesh.coords,attr_layout=mesh.layout,voxel_size=mesh.voxel_size,aabb=[[-.5,-.5,-.5],[.5,.5,.5]],decimation_target=a.max_faces,texture_size=a.texture_size,remesh=True,remesh_band=1,remesh_project=0,verbose=True)
 glb.export(str(dst),extension_webp=True)
 if not dst.exists() or dst.stat().st_size<1024:raise RuntimeError("No valid-sized GLB was produced")
 print(json.dumps({"mesh":str(dst),"bytes":dst.stat().st_size,"stage":"MESH_ONLY_NOT_RIGGED"}))
if __name__=="__main__":main()
