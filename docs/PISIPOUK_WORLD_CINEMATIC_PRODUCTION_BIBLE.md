# PISIPOUK WORLD — CINEMATIC ART & GAME PRODUCTION BIBLE v1.0
Date: 2026-10-12. Scope: /virtual-preschool only. PRODUCTION MAIN MUST REMAIN UNTOUCHED.

## Creative objective
Build a coherent, polished storybook-quality 3D interactive world with a distinctive Pisipouk bear, physical animation, cinematic lighting, Greek natural voice and guided play. The current procedural WebGL, emoji and generic cards are prototypes, NOT approved final art.

## Character and animation
Hero Pisipouk: compact friendly plush bear; golden caramel fur with strand-level authored look in masters and optimized fur cards/material in GLB; teal scarf; tiny canvas explorer satchel; wide curious expressive eyes; four-finger tactile paws; instantly readable silhouette at 200px. Artwork requires review against the existing original Pisipouk brand/logo, not direct replacement.
Deliver turnaround front/side/back/three-quarter, orthographic model sheet, expression board (curious/joyful/confused/comforting/focused/sleepy), material swatches, rigged Blender master, GLB mobile LOD0/LOD1, texture atlases, thumbnail, animations. Do not claim an image sheet alone is a game-ready 3D model.

Natural animation clips: idle breathing, anticipation, wave, playful walk, jog, hop, point, reach, grasp, release, listen, blink, gaze track, sit, celebrate, calm disappointment, dance, hug, sleep; blend locomotion with idle and look-at; avoid uncanny jerks. Motion arcs, squash-and-stretch, secondary scarf movement, ease-in/out, settle and subtle microgestures. Foot planting prevents sliding; contact points in interaction authoring.
Support 30/60fps adaptive animation, time-based movement, reduced-motion, muted by default, pausable narration.

## Six production-quality worlds
1 Forest: seasonal forest, leaf collecting, animal habitats, streams, nature observation and cause-effect; PBR stones, foliage, physically plausible shadows, interactive fauna.
2 Atelier: paint mixing, wet watercolor, pottery, collages, shape construction, expressive creation (no forced right answer).
3 Story Theater: puppet choices, sequencing, role-play, Greek story branching, gentle emotional reflection.
4 Music Town: percussion, dancing, call-and-response, pitch/rhythm experimentation, cooperative turn-taking.
5 Invention Workshop: size, spatial arrangements, patterns, counting with manipulatives, bridge and machine construction.
6 Little Greece: localized biomes, seasonal traditions, seaside ecology, weather, Greek cultural exploration.

## 30-game release target (not yet implemented)
Forest: leaf explorer, animal homes, butterfly garden, water stream, weather station.
Atelier: 3D clay, free paint, color mixing, nature collage, puppet creator.
Story: create a story, choose an ending, feelings theatre, sound story, story sequencing.
Music: rhythm echo, xylophone garden, body-movement prompts, instrument orchestra, lullaby creation.
Workshop: pattern necklace, build a bridge, counting picnic, shape homes, size sorter.
Little Greece: island boat, seasonal calendar, beach cleanup, village market, olive harvest.
Each game has a one-page design sheet: user choice, tangible mechanic, adult co-play prompt, age adaptations, replay without grind, accessible control, safety, measurable completion without child profiling.

## Pedagogy / UX
Grounded in NAEYC developmentally appropriate practice and active, hands-on agency. Age 2.5–3: 1-2 choices, large touch zones, no reading. Age 3–4: short sequences and cause/effect. Age 4–5: creative exploration and storytelling. Age 5–6: prediction, open-ended problem-solving, longer but optional play. Do not reward screen time, use leaderboards, force loops, ads, manipulative notifications or diagnose children. Companion adult prompts, end-of-activity offline extension.
References https://www.naeyc.org/resources/position-statements/dap/principles and https://www.naeyc.org/resources/topics/technology-and-media/preschoolers-and-kindergartners/

## Production pipeline and licensing
Art direction/storyboards -> asset sourcing/license review -> sculpt/retopo/UV -> PBR materials -> rig/weight paint -> authored motions -> export GLB -> glTF validation -> meshopt/Draco/KTX2 optimization -> R3F/Three integration -> mobile profiling -> touch playtesting.
Tools/projects for evaluation:
- https://github.com/mrdoob/three.js (rendering)
- https://github.com/pmndrs/react-three-fiber (React renderer)
- https://github.com/pmndrs/drei (components/helpers)
- https://github.com/phaserjs/phaser (2D minigames)
- https://github.com/pixijs/pixijs (illustrated 2D)
- https://www.blender.org/ (DCC modeling, rigging, animation)
- https://polyhaven.com/ (CC0 HDRIs, PBR environment textures; check each file)
- https://kenney.nl/assets (CC0 prototyping/game-ready)
- https://quaternius.com/ (CC0 packs when explicitly labeled; animated characters and actions)
- https://ambientcg.com/ (CC0 textures)
- https://github.com/KhronosGroup/glTF-Sample-Assets (glTF technical reference; per-asset licenses)
- https://huggingface.co/Tencent/Hunyuan3D-2.1 and https://huggingface.co/microsoft/TRELLIS-image-large (candidates only; review current actual licenses, model card, GPU requirements, safety, and outputs before using).
Original Pisipouk assets and commissioned/internally-generated artwork preferred for brand identity. No direct copying of copyrighted characters. License ledger per asset (URL, author, license, download SHA, attribution, derivative permission, date).

## Milestones/quality gates
G0 Character bible accepted by owner; check alignment with authentic Pisipouk brand.
G1 Download and validate licensed model candidates, rig + 10 natural motion clips; test facial expressiveness on devices.
G2 One fully polished forest game in actual game scene with 3D interactive objects, no placeholder emoji, character animations, Greek audio, robust inputs and QA.
G3 Minimum 5 polished activities per world, all age-appropriate and tested.
G4 accessibility, stress/FPS on low-end Android and iPad, WebGL fallback, lazy loading, asset memory cap and content privacy audit.
G5 production rollout only after explicit owner approval and confirmed functional tests. Entire development only on feature branch.

## Performance targets (engineering acceptance, not achieved claims)
Aim >=30fps midrange mobile, >=50fps desktop in playable scene. Asset budgets defined after profiling; stream per-world scenes rather than loading all at once. Support reduced motion, no forced full-screen or autoplay loud audio.
## Current status
Research and art direction documented. A 2D cinematic 3D-style concept sheet may serve as reference only. Production mesh, skeleton, HD textured character, motion clips, and 30 games are NOT delivered yet.
