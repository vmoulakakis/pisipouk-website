# PISIPOUK WORLD — Real 3D Character Production (HF × GitHub)
Last reviewed: 2026-10-12. Scope restricted to feature/pisipouk-world-v17-design; NEVER merge to main automatically.

## Brand lock
Source of truth: src/assets/pisipouk-logo.webp. Original caramel teddy bear, round ears, rosy cheeks, cream muzzle, white T-shirt with a prominent RED HEART. Do NOT add a teal scarf, backpack, text logo, alternate shirt or other unapproved identity changes. Crop logo lettering away from isolated full-body character input. Reference rights remain with PISIPOUK.

## Selected models
* Mesh generation: microsoft/TRELLIS.2-4B, MIT. https://huggingface.co/microsoft/TRELLIS.2-4B and https://github.com/microsoft/TRELLIS.2; CUDA NVIDIA >=24 GB official requirement. This yields a textured *static* mesh, NOT a rig or animation.
* Rigging: VAST-AI/UniRig, MIT. https://huggingface.co/VAST-AI/UniRig and https://github.com/vltrx/UniRig. GPU >=8GB. Skeleton and skinning outputs need review.
* Clip production / artistic correction: Blender (official open-source). https://www.blender.org/. Generated animation script scripts/3d/animate_character.py requires approved bone mapping, exports six REAL glTF clips. More clips and facial blendshapes are needed for premium release.
* Web viewer target: Three.js / React Three Fiber after asset approval. Never claim user-facing interactive 3D based on static hero images alone.

## Legal safety
Do not use Tencent Hunyuan3D-2.1 for EU deployment: territorial license disallows EU. Mixamo commercial runtime use generally allowed but do not redistribute raw animation packs. Preserve each asset's license metadata and archive the downloaded LICENSE for audit.

## Preparation: character reference
1. Produce original, isolated full-body front and 3/4 orthographic reference based on the real Pisipouk bear; no typography, accessories, props, or background.
2. Poses: neutral A-pose for rigging, expressive approved turnaround for art direction, separate eyes/mouth and T-shirt heart shapes for facial/body rig.
3. Creative director manually approves silhouette, color, face, heart and hands BEFORE starting GPU generation. The character must not be generic AI bear.

## Stage A — Generate mesh on a GPU (NOT run in ChatGPT; may cost money)
Install upstream microsoft/TRELLIS.2 using its README (tested CUDA dependencies; license and security review), then:
```sh
python scripts/3d/generate_mesh.py \
 --reference assets/3d-source/pisipouk-neutral.png \
 --output build/3d/pisipouk_mesh.glb --texture-size 2048 --max-faces 125000
python scripts/3d/validate_glb.py build/3d/pisipouk_mesh.glb --stage mesh
```
Official upstream is a 4B GPU model; GitHub-hosted free runners DO NOT provide a 24GB NVIDIA GPU. HF Jobs require positive balance and are billed by minute. No GPU job is scheduled without explicit cost approval.

## Stage B — Rig with UniRig
Inside official vltrx/UniRig environment; verify version-specific commands upstream:
```sh
bash launch/inference/generate_skeleton.sh --input build/3d/pisipouk_mesh.glb --output build/3d/pisipouk_skeleton.fbx
bash launch/inference/generate_skin.sh --input build/3d/pisipouk_skeleton.fbx --output build/3d/pisipouk_skin.fbx
bash launch/inference/merge.sh --source build/3d/pisipouk_skin.fbx --target build/3d/pisipouk_mesh.glb --output build/3d/pisipouk_rigged.glb
```
Inspect skeleton & weight painting in Blender. Correct foot planting, facial joints, head and scarfless shirt deformation. Create a bone map JSON in the format:
```json
{"hips":"ACTUAL_HIP_BONE","spine":"ACTUAL_SPINE_BONE","neck":"ACTUAL_NECK_BONE","head":"ACTUAL_HEAD_BONE","arm_left":"ACTUAL_L_ARM_BONE","arm_right":"ACTUAL_R_ARM_BONE","leg_left":"ACTUAL_L_LEG_BONE","leg_right":"ACTUAL_R_LEG_BONE"}
```
Bone names above are placeholders. Fill from the actual exported skeleton; never guess.

## Stage C — Export actual animation clips
```sh
blender --background --python scripts/3d/animate_character.py -- \
 --input build/3d/pisipouk_rigged.glb --output build/3d/pisipouk_animated.glb \
 --bone-map assets/3d-source/pisipouk-bone-map.json
python scripts/3d/validate_glb.py build/3d/pisipouk_animated.glb --stage animated
```
Mandatory clips: Idle, Walk, Wave, Point, Celebrate, Listen. This script is motion blocking, not yet professional motion polish or facial performance. Rigged GLB exports must be visually checked; the validator checks structure, not aesthetics.

## Stage D — Optimize and integrate
Retopologize for deformation-friendly topology, fix UV texture seams, bake maps, add multiple LODs and compressed textures. Validate GLB in viewer; adaptive FPS; low-motion fallback; test midrange Android/tablet touch. After QA, place *approved* asset in public/preschool/3d/pisipouk_animated.glb (Git LFS recommended for large binaries), reference from V17 only. 360 games should be genuinely manipulable, not multiple-choice quizzes.

## Quality gates
G0 brand reference approval | G1 detailed mesh and PBR inspection | G2 skin/rig deformations and 6 clips validated | G3 physically natural motion / facial expressiveness | G4 performance and touch-game QA | G5 parental / educational review | G6 explicit user approval before main.
**Status now:** adapter code and deterministic validators committed. GPU mesh generation, actual UniRig inference and premium model not run yet. Static concept art does not qualify as a game asset.

## Suggested alternate approach
To achieve the exact cinematic IMAGE fidelity from concept art with limited web GPU, author high-quality 3D masters and bake lighting/textures into optimized real-time assets, while selecting pre-rendered cutscenes for expensive visual sequences. WebGL and video cannot preserve full offline path-traced quality in every mobile frame.
