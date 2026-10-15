# PISIPOUK WORLD 2.0 — Game Engine & Animation Architecture Decision Record
**Status:** DECISION / PARTIAL STAGING IMPLEMENTATION — NOT production release.
**Date:** 15 October 2026
**Scope:** `/virtual-preschool` replacement in standalone branch `design/pisipouk-world-v2-ux-20261015`. NO modification to preschool physical-business pages, site's main route, public payments/contact, original Supabase schema, Vercel production domains or main branch.

## Core user failure diagnosis
The prior implementations used panels and CSS tween animations, a shared bear raster and thin quiz-style experiences. This is technically a web page with some interaction, not a coherent high-production-value toy game. Number of editorial prompts is not the number of distinct games. More content cannot solve incorrect character motion/art direction. Art, motion and game physics require independent pipelines.

## Public case studies and what is **verifiably** used
1. Toca Boca engineering blog (Toca Boca Days, not all Toca games): Unity, custom BatchRendererGroup, culling, instanced rendering and shader-based skinning to support high-performance customizable avatars. Source: https://unity.com/blog/how-toca-boca-built-a-high-performance-scalable-rendering-backend
2. Phaser official (library used in THIS staging): Phaser 4.x and Matter.js rigid bodies, friction, gravity, restitution, constraints, touch and collision layers. Physics descriptions: https://docs.phaser.io/phaser/concepts/physics and https://docs.phaser.io/phaser/concepts/physics/matter . Live demos: https://phaser.io/examples/v3.85.0/physics/matterjs/view/circular-body
3. PixiJS: batching and spritesheets for GPU-efficient 2D content, useful alternative or integration for games with many objects. https://pixijs.com/8.x/guides/concepts/performance-tips ; real interactive case studies https://pixijs.com/showcase . We do NOT claim Toca Boca or Sago Mini uses PixiJS without source evidence.
4. Rive: interactive skeletal characters, mesh deformation, constraint chains, inverse kinematics, blended animations, state machines and triggers. https://rive.app/features ; example physically reactive bear https://rive.app/community/files/15878-29905-bear-mouse-interaction/ . A usable original bear needs a brand-approved rig and .riv package.
5. Spine: strong 2D skeletal animation, secondary physics constraints. The physics constraints are NOT in the Essential tier. https://us.esotericsoftware.com/spine-physics-constraints . Use only if cost/toolchain review prefers it to Rive.
6. Blender: high-quality original 3D model sheet (mesh/UV/fur shaders/rig/pose turntable). Render 2.5D frames/atlases for the website rather than forcing real-time 3D throughout.
7. Pok Pok, Sago Mini, PBS Kids: inspiring interaction and pedagogy, but **their private implementation frameworks are unverified**. https://playpokpok.com/ ; https://sagomini.com/ ; https://pbskids.org/games .

## Final implementation choice
- React 19 + TanStack Router manages site routes, auth boundaries and content management only.
- **Phaser 4.2.1 + Matter.js** is the WEB gameplay scene + physics runtime, loaded asynchronously for active games ONLY. One Phaser.Game mounted inside a React route; scene lifecycle must destroy on route exit. Treat Phaser's own scene animation and tweens as in-game rendering, not React CSS.
- **Rive** will manage 2D skeletal animated Pisipouk and close-up interactive characters after original .riv has been created and its commercial export license assessed. Do not ship random Rive community bears as Pisipouk.
- Blender as offline authoring/rendering tool. For premium scenes, original hand-painted 2.5D background layers + sprite-atlas / rigs. Rive can render closeups; do not deploy simultaneous large Rive + Phaser loops unless benchmarked.
- PixiJS is an alternative assessed against Phaser, not a default parallel runtime.
- Phaser is open-source MIT. Rive paid export required for shipping: https://www.rive.app/pricing ; verify current terms before asset export.
- The rest of pisipouk.com remains on its existing code and hosting. No additional SPA for the whole site.

## Production-grade character contract for faithful Pisipouk
- Master source: the **existing** original mascot reference /preschool-world/bear.webp and src/assets/pisipouk-logo.webp. Approve original silhouette before any AI stylization.
- Layer / bone rig: head, torso, pelvis, upper/lower arms, hands, ears (flex), eyes, eyebrows, mouth/visemes, nose, cheeks, feet, 3D-style soft shadows. Face blend poses for happy, curious, thinking, gently encouraging, calm and surprised.
- Runtime states: idle, listening, wave, point, walk, grab, release, push, celebrate (gentle), rest, speak. Behavior events: `onEnterScene`, `onChildTap`, `onPickup`, `onCorrect`, `onRetry`, `onNewGame`. Avoid continuous bounce or random shaking.
- Gaze aligns to scene activity. Position should respond to objects, not just follow pointer unconditionally. No looped mouth animation while audio is off.
- Physical response: believable anticipatory action, momentum and follow-through, damping, collision, purposeful pauses; never turn a static PNG with CSS zoom into "skeletal animation".
- Required assets: editable Blender / layered master source, `.riv` runtime pack if chosen, expression atlas, transparent alpha frame samples, mobile-resolution texture atlas, asset source rights register, perf budgets. NONE of these final assets are delivered by installing Phaser.
- Human art direction approval before release. For commercial reuse, never lift assets from Sago Mini, Toca Boca, Pok Pok, Pinterest or external games.

## Interaction/motion contract
- Game loop / physics: fixed step where available, time based physics, tune damping + gravity per game; colliders match drawn shapes.
- Cause–effect examples: balls roll and bounce, fruit drops with friction, paper folds with hinge constraints, water visibly fills container, plants unfold after a child action, characters orient head and torso when attentive.
- UX for 2–3: large, slow toy interactions with high tap tolerance; no complex drag requirements; no timers. Age 3–4: sorting, sequential reactions and color mixing. Ages 4–5: tangible construction/puzzles. Ages 5–6: planning, sequences, construction and explanation.
- Reduced-motion fallback: state changes remain legible, no loss of capability. Mute speech and animation independently, avoid flashing. Touch plus keyboard alternatives.
- Performance targets to verify in real devices (not currently measured): 30+ fps on mid-range phone, target 60fps on upper tier; load texture atlas per game scene; lazy-load Phaser 4 (~1.4MB build asset) only for gameplay; mobile controls are never overlayed by scene animation.

## Content truth register
- The user demands 20 **different genuine interactive games per age** (80), 20 original coloring printables per age (80), 10 crafts per age (40), 10 original age-tailored illustrated stories per age (40). Total acceptance target: 240 authored creative items, with explicit age-appropriate quality and rights.
- Already committed to staging: four small age-specific gameplay prototypes; one additional working Phaser-based Matter physics experiment; not five polished released games.
- **Recovered from feature branch**: 20 *unique* SVG outlines, 20 craft instruction items, 20 Greek stories with choice endings; browsable in each age section. They are shared content with age-adaptive line width, not 80 separate art-directed drawings / 80 crafts / 80 stories.
- Older 120 playpacks are quizzes/editorial prompts, not games. Do not count them toward 80 gameplay requirement.
- Craft steps are illustrated only by a shared representative SVG, not four accurately hand-illustrated physical construction stages. Full craft asset production still pending.
- No educator approval, licensed audio production, Rive .riv rig, advanced tests or final commercial reuse certification yet.
- Content can be imported or authored through safe draft/review/publish workflow, but weekly AI production must remain behind educator review.

## Gating and QA
G0 Architecture: lockfiles in sync; Phaser scene client-only, routes direct load, no regressions elsewhere.
G1 Art: original mascot model sheet + pose sheet approved. Four game scenes meet pixel-perfect visual target on mobile/tablet/desktop.
G2 Physics: test gravity, collision, velocity damping, 30fps midrange mobile, clean teardown and replay; Canvas fallback.
G3 Content: each of 80 games has a unique interaction outline and finished asset bundle; original 80 patterns and 40 crafts and 40 stories have author/rights, print check, educator review.
G4 End-to-end Playwright + screenshot baselines + real printed A4 sample; Greek text/font proof, story narration.
G5 Only after user APPROVAL: merge to main. Production remains unchanged until all gates green.

## Exact preview implementation
- Package: `phaser@4.2.1`, imported dynamically in `src/features/preschool-v2/physics/PhaserGarden.tsx`.
- Staging route `/pisipouk-v2-staging/ages/2-3/physics` and equivalent routes for other ages.
- Stage itself is a physics *laboratory* for collision/gravity profiling, NOT a substitute for high-quality age-based games.
- Library: `src/features/preschool-v2/library/LibraryViews.tsx`, source traced to separate playpacks branch, no production overwrite.
- QA documents and playbooks must report real browser test evidence; a Vercel READY status only demonstrates a compiled deploy and URL availability.
