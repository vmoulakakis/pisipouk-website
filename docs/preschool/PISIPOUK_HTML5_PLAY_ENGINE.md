# PISIPOUK 360 — HTML5 FLASH-LIKE PLAY ENGINE (v18)
Last revised: 2026-10-12. Scope: feature/pisipouk-world-v17-design only. Production branch main untouched.

## Product change
The user explicitly DOES NOT want a standalone 3D file or a rigging installation. The goal is a free Flash-era-like interactive preschool: immersive but lightweight 2D scenes, animated props, drag/drop, puzzles, soft audio, creativity and responsive mobile touch. The old cinematic 3D character-generation pipeline is optional/unnecessary for this product goal and is not run.

## Runtime architecture — no browser plugin
Current implementation: `src/components/preschool/AnimatedArcade.tsx` + `animated-arcade.css`. Written using the standard Canvas 2D API with requestAnimationFrame, reduced-motion preference, pointer capture, scene objects, physics-like easing, particles, vector sprites, optional WebAudio oscillators (user gesture only). No paid API, GPU dependency, third-party CDN or runtime installation. Vercel delivers ordinary HTML/JS/CSS. GitHub stores the source. HF Spaces can later supply approved offline sprites/audio illustrations; browser playback never depends on Hugging Face availability.

Game configuration is declarative in `ANIMATED_GAMES`; current modes:
1. bloom — touch flowerheads to make them bloom (nature)
2. sort — drag colored gemstones to matching baskets (logic)
3. bridge — drag wooden pieces into a bridge (spatial construction)
4. music — play tones across an animated music garden (creative, no forced completion)
5. sail — choose islands to send a boat across waves (Greece)
6. shapes — drag shapes to their matching silhouettes (spatial geometry)
7. constellation — connect stars in sequence (early sequencing and storytelling)
8. water — drag raindrops to water plants (care, fine motor control)

Accessibility: touch, mouse and keyboard fallback buttons; obvious touch targets; muted audio toggle; `prefers-reduced-motion`; no scores, countdown, rankings, ads, progress profiling or external trackers. Tasks filtered and object count adapted by age. Parent-child activities suggested after play.

## Other world enrichment
Atelier templates in `Atelier360.tsx` expanded from eight to sixteen: original set plus rainbow, turtle, school, autumn pumpkin, kite, rocket, snowman and Greek summertime beach. Supports bucket fill by SVG region, free drawing, tracing strokes, stickers, undo, printable SVG and print mode. Existing Stories, Today, the forest prototype and the previous learning-question microactivities stay available — but quizzes must not be mistaken for interactive games.

## Why not install Flash or SWF?
Adobe Flash Player is discontinued. `ruffle-rs/ruffle` is a free MIT/Apache licensed SWF emulator useful ONLY if we already have licensed historic SWF assets; it is not a good engine for authoring new children's HTML5 games.
`phaserjs/phaser` and `pixijs/pixijs` are MIT licensed and excellent candidates when the game collection needs larger animation/sprite/physics pipelines. For the first release the self-contained Canvas engine avoids adding dependency weight or broken CDNs.
References:
- https://github.com/phaserjs/phaser/blob/master/LICENSE.md
- https://github.com/pixijs/pixijs/blob/dev/LICENSE
- https://github.com/ruffle-rs/ruffle/blob/master/LICENSE.md
- https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

## Hugging Face in the correct role
Use free Spaces **as content production tools**, never as a fragile live runtime. Potential future assets: cohesive multi-frame character sprites, 2D illustrated backgrounds, voice/audio snippets, activity illustrations. Only adopt outputs with known provenance, copyright clearance, consistent art direction and matching Pisipouk original heart-shirt branding. Human review of each frame, then compress and commit approved WebP/AVIF/sprite atlases in GitHub. No paid HF GPU Jobs or paid APIs; free Space availability is not guaranteed.

## Release and acceptance checklist
- [x] Eight new HTML5 interactive scenes committed.
- [x] Games integrated in /virtual-preschool and 6 world sections where age-appropriate.
- [x] 16 digital/printable SVG Atelier templates committed.
- [x] Browser smoke test source added at `tests/preschool-arcade-v18.spec.ts`.
- [ ] Execute Playwright tests in a browser with access to the protected Vercel preview.
- [ ] Test all 8 game modes on low-cost Android phone / iPad and desktop.
- [ ] Check sound permission, 60fps performance, pointer capture, focus and canvas scaling.
- [ ] Replace procedural visuals with curated, approved HD 2D art sprite sheets.
- [ ] Add richer open-ended play and 5+ truly interactive games for each world.
- [ ] Review pedagogical design with preschool educators.
- [ ] Explicit owner approval BEFORE any production merge.

Build success is NOT playtest completion. Keep main untouched.
