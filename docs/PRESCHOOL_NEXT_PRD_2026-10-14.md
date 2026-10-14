# PISIPOUK PRESCHOOL NEXT — Product Requirements Document
Version: 1.0 | Date: 2026-10-14 | Status: APPROVED FOR STAGED DEVELOPMENT (not production release)

## 0. Product framing
A Greek-language, browser-first, high-quality, accessible and developmentally appropriate preschool environment at `/virtual-preschool` for ages 2–6, with primary focus on ages 2–5. Children interact with animated original characters and activities; teachers/parents prepare printable materials and provide guided experiences. No competitive ranking of children.

## 1. Non-negotiable boundary and release safety
- Existing production site, shared `SiteLayout`, common routes, styles, API endpoints, authentication and other pages MUST remain untouched.
- Work on existing `feature/pisipouk-preschool-final-20261014` or a derived branch, draft PR; never auto-merge to main.
- The current route uses `src/routes/virtual-preschool.tsx` to iframe `public/pisipouk-learning-world.html`; avoid broad route refactors.
- Keep backwards compatibility for painting/story/print workflows and existing URLs.
- Before each change snapshot branch commit SHA, capture changed-file list and ensure allowlist includes only `public/pisipouk-learning-world.html`, `public/mikroi-dimiourgoi.html`, `public/preschool-printables.html`, new `public/preschool/**` assets, and preschool-scoped tests/docs. Route file changes only if indispensable.
- Recheck baseline home and other routes after each preview deploy. Guard Vercel production vs preview environment.
- Rollback by reverting PR commit/preview; never force-push main. Preserve full provenance of licenses and art sources.

## 2. Goals and explicit non-goals
Goals: premium playful illustrated quality, instant interaction, age tiers, 24 complete interactive activities over six pillars, classroom printables and social-emotional positive feedback, Greek narration, reliable mobile/tablet experiences, no child tracking.
Non-goals: unrestricted online image generation by children, advertisements, mandatory child accounts, multiplayer chat, competitive leaderboards, heavy continuous 3D rendering, new production APIs.
The earlier six HTML/emoji games and 24 SVG printables are scaffolding NOT acceptance-complete premium games.

## 3. Information architecture
Home = hero landscape featuring the original Pisipouk bear, age selector, six prominent animated houses, educator/parent entry; direct links to games, creative studio, story library and printables.
Pillars: Κατασκευάζω, Δημιουργώ, Παίζω, Ζωγραφίζω, Τραγουδώ, Ιστορίες. Each contains four unique, fully realized activities. Age/content filters must actually change mechanics, counts, duration and instructional vocabulary.
Teacher area: browse by age 2–3/3–4/4–5/5–6, theme/season, learning objective; create A4 print/PDF locally, invoke mailto with clear adult-only workflow. Export actual attachments manually; mailto does NOT automatically attach PDF.
No child ranking. Optional stars are non-comparative encouragement and remain local; teacher prompts should praise persistence and observation rather than reward chasing.

## 4. Art direction: QUALITY BAR
Stylized original high-resolution 2.5D / faux-3D chunky toy environment, luminous colors without sensory overload. Consistent face geometry, outlines, material and lighting across all objects. Character model sheet for Pisipouk: front, 3/4, side, pose library; nine expressions; outfit continuity; export rights documented.
Use generated original raster illustrations as static backdrops and separable transparent foreground sprites. Asset families:
- Hero 2400x1350 reference; desktop/tablet/mobile crops from one artboard.
- Character sprite atlases with transparent alpha; 4+ animation key poses per core action.
- Environment layers: sky, mountains, trees, houses, flowers, interactive hit targets.
- UI silhouettes and affordances in SVG/CSS. Avoid animated GIFs.
- Printing art: separate sharp black-and-white 300-dpi A4 line art, not desaturated color sprites.
Production assets may be AI-generated with documented rights and checked for consistency, legibility and child-safety. No runtime Hugging Face or third-party image request from children's devices.
Brand palette: azure #0284C7, meadow #22C55E, sunshine #FACC15, tangerine #F97316, apple #EF4444, grape #A855F7 with accessible dark text and quieter contrast backgrounds.
Use responsive `<picture>` WebP/AVIF, fallback PNG, lazy-load below-the-fold assets, safe aspect ratios, 1x/2x only where useful. All interactive art must have touch targets and semantic equivalents.

## 5. Architecture decisions
Keep existing app stack and Vercel settings. Games are isolated HTML5 modules, DOM for semantics/buttons/accessibility, CSS transforms for small feedback, Canvas 2D for painting/high-frequency interactions. RequestAnimationFrame ONLY for active game stages, stop on hidden/unmounted, reduced-motion fallback. Static backdrops + sprite atlases for parallax and segmented character motion. No mandatory WebGL/Three/R3F in the critical path. No new backend or sitewide state. Modularize from monolithic `pisipouk-learning-world.html` incrementally without breaking iframe/resizing contract.
Pointer Events for touch/mouse/pen; click/tap alternatives to drag; pointer capture; minimum 48x48 CSS px targets, prefer 64+, large hit geometry. Canvas DPR clamp based on device and memory; pre-render reusable layers and avoid per-frame layout/DOM thrashing. WebAudio synthesized feedback with user gesture; Greek recorded offline narration as primary, optional SpeechSynthesis only as fallback. Use resource-safe local caching only after browser/offline QA.
Session generator seeded PRNG + solvability validation with explicit state transition IDLE -> TUTORIAL -> PLAY -> FEEDBACK -> COMPLETE -> NEXT, plus PAUSED/BACK/RECOVER and safe reset.
Privacy: no externally embedded trackers/scripts/fonts; no personal child data; localized adult controls; legal/privacy review before production.

## 6. Activity matrix (24)
**Κατασκευάζω:** 1 modular tower stacking (tap to place, sequence), 2 tractor assembly (part-to-socket), 3 duckling bridge (length/ordering), 4 waterwheel gears (cause/effect).
**Δημιουργώ:** 5 digital clay shaping (safe stamps, not unconstrained mesh editing), 6 flower maker (petals/stems/combinations), 7 fruit salad studio (safe gestures; no knives), 8 sticker farm diorama (drag or tap to place).
**Παίζω:** 9 garden lifecycle dig/plant/water/harvest, 10 animal feeding match, 11 muddy pig scrub, 12 apple basket catch (no time pressure).
**Ζωγραφίζω:** 13 colorable toy object, 14 watercolor splashes, 15 connect dots 1–5, 16 magical reveal.
**Τραγουδώ:** 17 animal choir pentatonic notes, 18 rainbow xylophone, 19 rhythm apple beats (no fail), 20 licensed/original Greek rhyme puppet stage.
**Ιστορίες:** 21 lost chick kindness tale, 22 farm from sunrise to sunset, 23 puppet stage dress-up, 24 strawberry mystery choose-clue story.
Each activity requires: entry/exit, age variants, deterministic procedural quests, meaningful interaction, original art/audio, reward feedback, quick help, a teacher objective, performance/accessibility tests. Content gate is playable, not a card/placeholder.

## 7. Age bands
2–3: 1-step exploration, max 2–3 meaningful objects, gentle audio, large tap targets, no numerical dependency.
3–4: 2-step sequences, sorting up to 3–4, open-ended creation.
4–5: 3–4 step sequences, counts 1–5, early STEAM and narrative choices.
5–6: optional extension with planning/problem solving, distinct from primary 2–5 scope.
No clock or punishment; delayed hint and auto-assist optional. Reduced motion/sound-off defaults and parent-controlled voice.

## 8. Performance and quality budgets (targets, subject to measurement)
First meaningful interaction <= 3s on tested low-spec tablet over controlled throttling; initial transferred resources target <= 1.5 MB, capped <= 3 MB for core preschool page; lazy-loaded activity packs <= 2 MB each; 30 fps floor and 60 fps target during active animation; no long tasks > 100ms during critical input; responsive 320px to 1920px; no horizontal scrolling. Never claim measured values until real QA.
Canvas painter export PNG; print CSS A4 and print-to-PDF verified across Chrome/Edge/Safari; if offline, cache only local static resources with scope isolated from broader site.

## 9. QA and acceptance gates
A. Baseline: home, navigation, unrelated key routes unchanged and screenshots matching; no changes beyond allowlist, production main unchanged.
B. Automated: npm build and TypeScript check; test each game state/misclick/finish/replay/resize; assert age filters change actual challenges.
C. Manual: Chrome desktop, Edge, Safari iOS, Android Chrome, economical classroom tablet, keyboard and assistive technology; test touch gestures and back/exit; verify no failure dead ends.
D. Assets: style bible and exported sizes match; visual comparison of game to approved mockup; text legibility; no external watermark; rights manifest for artwork/characters/music.
E. Perf: bundle and FPS measured on target hardware; throttled interaction and memory run; offline only after caching verification.
F. Safety: no data collection, no external runtime model; adult flow for printing/emails; teacher educational review.
G. Vercel: preview deployment READY + actual smoke test of /virtual-preschool and three child paths, then draft PR review. Release is explicitly separate approval event. No auto merge.

## 10. Milestones and deliverable order
M0 audit baseline + capture UX/visuals + asset inventory + working tests.
M1 style bible + three visual variations, select one before production assets (Product Design in Work mode).
M2 build approved flagship vertical slice: Magical Garden, original art layers, 4 age variants, sound, no-fail, touch, smoke tests.
M3 shared reusable game shell, sprites, session engine, age profiles, localized voice system.
M4 additional five polished games (one per pillar), then complete remaining 18 (total 24).
M5 integrate painting/printables/original A4 outlines, seasonal content, PDFs/mailto, teacher mode.
M6 complete mobile, accessibility, pedagogy, perf, regression QA and controlled release.
No milestone is represented as complete unless evidence exists.

## 11. Tool roles / limitations
Product Design: visual exploration and design QA; full plugin workflow requires ChatGPT Work, not standard chat.
Hugging Face: model/space scouting and asset pipeline experiments, not direct children's runtime rendering; provider availability/license/cost to be verified.
GitHub: code audit, protected branch, scoped PR, code reviews.
Vercel: automatic PR previews, readiness and smoke testing; no production promotion without acceptance gates.
