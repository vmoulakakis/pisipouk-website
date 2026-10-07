# Pisipouk V16 — Open 3D Asset Pipeline

## Goal

Create custom, coherent Pisipouk 3D assets without paid runtime services. AI generation is a **build-time art tool**, never called from the child experience.

## Approved stack

### 1. Microsoft TRELLIS.2 (primary custom 3D generator)
- Hugging Face model: `microsoft/TRELLIS.2-4B`
- GitHub: `microsoft/TRELLIS.2`
- License: MIT
- Input: clean reference image
- Output: PBR-ready GLB with base color, roughness, metallic and opacity-capable material data
- Official code supports GLB export with WebP textures.
- Hardware note: official repo currently requires Linux + NVIDIA GPU with at least 24 GB VRAM. Therefore this is an **offline / build-time pipeline**, not a browser dependency.

Use it for:
- Pisipouk master 3D character blockout
- food / beads / instruments / toys
- Greek-island props
- atelier materials

Every generated result must be manually reviewed in Blender before production.

### 2. Blender
Mandatory clean-up stage:
1. fix silhouette
2. remove floating / broken geometry
3. retopologize if necessary
4. correct UVs
5. create child-safe proportions
6. rig character
7. author animation clips
8. export glTF / GLB

Target web budgets:
- hero character LOD0: <= 90k triangles
- hero character LOD1: <= 45k triangles
- hero character LOD2: <= 18k triangles
- normal prop: 2k–25k triangles
- mobile texture target: 1K–2K
- hero / close-up texture maximum: 4K
- prefer WebP / KTX2 textures where practical

### 3. Kenney CC0 (temporary and supporting props)
The repository `shorepine/kenney` contains the full Kenney asset library and explicitly states CC0. We may use these assets as:
- temporary world props while custom Pisipouk art is being created
- physics prototyping
- non-brand-critical background objects

Do not use weapon/blaster packs in preschool content.

Approved examples:
- `3d/cube-pets/*`
- `3d/food/*`
- `3d/nature/*`
- `3d/marble/*`
- `3d/furniture/*`
- `3d/watercraft/*`
- `3d/brick/*`

## Rejected / not default

### Hunyuan3D-2 / Hunyuan3D-2.1
Do not make this the production asset pipeline without a fresh legal review. Public license material has had territory / non-commercial restrictions and is not a clean default for an EU commercial preschool product.

### Stable Fast 3D
Useful technically, but its Community License has commercial revenue conditions and the model is gated. TRELLIS.2 is the cleaner default for this project.

## Pisipouk character workflow

1. Start from the best real Pisipouk reference image from the site / original brand artwork.
2. Produce a clean front 3/4 reference with neutral pose.
3. Generate a TRELLIS.2 base mesh.
4. Clean and retopologize in Blender.
5. Create a single canonical skeleton.
6. Add facial shape keys / morph targets:
   - blink
   - smile
   - surprise
   - think
   - mouth A / E / O
7. Animation clips:
   - idle
   - wave
   - walk
   - pick-up
   - eat
   - clap
   - dance
   - point
   - think
   - wear-necklace
   - paint
   - sleep
8. Export one GLB with named animation clips.
9. Generate LODs and test on iPad / mid-range Android.

## Runtime rules

- React 19 + R3F 9 stable
- Rapier v2 physics
- glTF / GLB only
- no AI inference in child runtime
- lazy-load worlds
- dispose scenes / textures on exit
- DPR cap on mobile
- target 60 FPS; gracefully reduce shadows / DPR before reducing interaction quality
- no timers, coins, streaks, leaderboards
