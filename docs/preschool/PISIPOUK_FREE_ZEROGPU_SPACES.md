# PISIPOUK — FREE Hugging Face ZeroGPU path
Date: 2026-10-12 | Scope: ONLY feature/pisipouk-world-v17-design | Never modify main.

**Free-only policy:** NO Hugging Face Jobs, NO paid dedicated GPUs, NO Inference Provider billing, NO automatic paid tier upgrades. Use publicly hosted Spaces with the included ZeroGPU allocation. Free usage is quota-limited and cannot be guaranteed immediately.

## Two public Spaces
1. **Microsoft TRELLIS.2** https://huggingface.co/spaces/microsoft/TRELLIS.2 — verified ZeroGPU listing. Upload an isolated PNG of the original Pisipouk character; Generate; Inspect 3D; click **Extract GLB**; Download. The official app source confirms two separate GPU steps (image_to_3d and extract_glb). One session may consume most of the free daily quota.
2. **VAST-AI SkinTokens** https://huggingface.co/spaces/VAST-AI/SkinTokens — verified ZeroGPU listing, accepts input mesh and produces **rigged GLB** with predicted skeleton and skinning weights. The official project states: upload mesh → Run → download. If quota is exhausted, use the next free quota reset, not paid credits.
3. **Blender** (free locally), https://www.blender.org/ — inspect rig/weights, fix body shape, make natural animations, export .glb. Use scripts/3d/animate_character.py as an initial blocking test, **not a polished animation**.
4. Validate genuine skinned and animated GLB with `python scripts/3d/validate_glb.py <file.glb> --stage animated`. Preview in `/preschool/3d/preview.html` only after real approved asset has been added.

## Brand identity: mandatory
Reference: `src/assets/pisipouk-logo.webp`. Golden brown teddy, rounded ears, pink cheeks, white T-shirt with **red heart**. No scarf/backpack. An AI-produced full-body reference image was generated on 2026-10-12 and is **provisional** pending visual fidelity approval. The input PNG is distributed as an independent download in the conversation, not yet committed as a binary to this repository.

## API access and reproducibility
Public Gradio Space API may support Python via `gradio_client`. The downloadable starter bundle includes `free_spaces.py` with `inspect` (read-only API introspection) and `mesh` (one free quota attempt) commands. APIs can change and may hide stateful endpoints. **The manual browser workflow is the more reliable fallback.**

Direct Gradio API calls were unavailable from the current assistant environment due network/DNS restrictions. No remote inference result has been produced, and no GLB is claimed. The official Hugging Face connector here can read Space metadata and launch paid GPU Jobs, but it has no capability to upload and submit inputs to a public Space directly. **Do not substitute paid Jobs**.

## Safety and QC
Before any public use verify:
- model silhouette, head, ears, paw shapes and shirt heart against original logo
- no extra limbs, holes, melted mouth, incorrect rear geometry
- rig and 6 clip GLB gate, animation skin deformation, foot planting, secondary motion
- facial expressiveness & native 30 fps Android/tablet touch and memory
- user explicit acceptance before merging into main

## ZeroGPU facts
https://huggingface.co/docs/hub/spaces-zerogpu — free users have limited daily ZeroGPU quota; queues and out-of-quota errors are expected.
https://huggingface.co/docs/hub/en/spaces-api-endpoints — supported programmatic clients and authentication.

**Progress:** Reference PNG, free starter CLI + QA pipeline drafted. Public TRELLIS.2 and SkinTokens Space URLs verified. Remote GPU inference inaccessible in this session; output GLB and animations pending.