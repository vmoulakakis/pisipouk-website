"""Blender 3.x/4.x: animate a previously UniRig-skinned Pisipouk GLB.
A bone_map JSON is mandatory. Fails rather than silently animating the wrong joints.
Requires Blender, not runnable inside the browser; exports real skinned glTF animation clips.
"""
import argparse,json,math
from pathlib import Path
import bpy

p=argparse.ArgumentParser()
p.add_argument("--input",required=True)
p.add_argument("--output",required=True)
p.add_argument("--bone-map",required=True,help="JSON mapping role to actual rig bone name")
a=p.parse_args()
bone_map=json.loads(Path(a.bone_map).read_text(encoding="utf-8"))
required=["hips","spine","head","arm_left","arm_right","leg_left","leg_right","neck"]
for role in required:
 if role not in bone_map:raise RuntimeError("Missing bone map role "+role)
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(Path(a.input).resolve()))
rigs=[ob for ob in bpy.context.scene.objects if ob.type=="ARMATURE"]
if len(rigs)!=1:raise RuntimeError("Expected exactly one skinned armature, found "+str(len(rigs)))
rig=rigs[0]
for role,bone_name in bone_map.items():
 if bone_name not in rig.pose.bones:raise RuntimeError("Bone not present: "+role+"="+bone_name)
rig.animation_data_create()
bpy.context.scene.render.fps=24
clips=["Idle","Walk","Wave","Point","Celebrate","Listen"]
roles=list(bone_map)
def angle(clip,role,t):
 s=math.sin(2*math.pi*t);c=math.cos(2*math.pi*t)
 if clip=="Idle":
  return (0.025*s if role=="spine" else 0.03*s if role=="head" else 0,0,0)
 if clip=="Walk":
  if role=="leg_left":return (0.29*s,0,0)
  if role=="leg_right":return (-0.29*s,0,0)
  if role=="arm_left":return (-0.23*s,0,0)
  if role=="arm_right":return (0.23*s,0,0)
  if role=="spine":return (0,0,0.035*s)
 if clip=="Wave":
  if role=="arm_right":return (-0.9-0.18*c,0.0,0.55+0.16*s)
  if role=="head":return (0,0,0.08*s)
 if clip=="Point":
  if role=="arm_right":return (-1.1,0.1,0.1)
  if role=="head":return (-0.06,0,0.07)
 if clip=="Celebrate":
  if role in ["arm_left","arm_right"]:return (-1.5+0.1*s,0,(-0.35 if role=="arm_left" else 0.35))
  if role=="spine":return (0.08*s,0,0)
 if clip=="Listen":
  if role=="head":return (0.0,0.0,0.15+0.05*s)
  if role=="spine":return (0.0,0,0.025*s)
 return (0,0,0)
for clip in clips:
 for pb in rig.pose.bones:
  pb.rotation_mode="XYZ"
  pb.rotation_euler=(0,0,0)
  pb.location=(0,0,0)
 act=bpy.data.actions.new(clip)
 rig.animation_data.action=act
 for frame in [1,7,13,19,25,31,37,43,49]:
  t=(frame-1)/48.0
  for role in roles:
   pb=rig.pose.bones[bone_map[role]]
   pb.rotation_euler=angle(clip,role,t)
   pb.keyframe_insert(data_path="rotation_euler",frame=frame,group=role)
  if clip=="Walk":
   pb=rig.pose.bones[bone_map["hips"]]
   pb.location.z=0.018*(1-math.cos(4*math.pi*t))
   pb.keyframe_insert(data_path="location",frame=frame,group="hips")
 for fc in act.fcurves:
  for kp in fc.keyframe_points:kp.interpolation="BEZIER"
 rig.animation_data.action=None
 track=rig.animation_data.nla_tracks.new()
 track.name=clip
 strip=track.strips.new(clip,1,act)
 strip.action_frame_start=1
 strip.action_frame_end=49
rig.animation_data.action=None
out=Path(a.output).resolve();out.parent.mkdir(parents=True,exist_ok=True)
bpy.ops.export_scene.gltf(filepath=str(out),export_format="GLB",export_animations=True,export_nla_strips=True,export_skins=True,export_apply=False)
if not out.exists():raise RuntimeError("GLB export failed")
print(json.dumps({"animated_glb":str(out),"clips":clips,"bytes":out.stat().st_size}))
