# PISIPOUK 360 • Three.js / GSAP / HTML5 Play Framework
Date: 2026-10-13. Deployment scope: `feature/pisipouk-world-v17-design` only. Production `main` must not be changed without explicit approval.

## Source & outcome
The user supplied `code_artifact.html`, a complete Greek-language 3D toddler game, *Το Νησί των Σχημάτων*. It served as the direct implementation reference. It uses:
- Three.js for WebGL geometry, directional lighting, hemisphere lighting, soft shadows, camera and raycasting;
- OrbitControls for touch/desktop camera manipulation;
- GSAP for squash-and-stretch, bounce, dancing and tweened motion;
- SpeechSynthesis API in Greek for instructions, Web Audio oscillator tones, particle celebration;
- a UI with mission prompts, play mode and explicit touch-to-start audio initialization.

Implementation: `public/preschool/games/shape-island.html` and `shape-island-ui.css`.
Mounted in the existing React preschool by `src/components/preschool/Interactive3DShowcase.tsx`, first in Games and Discovery. It runs inside an iframe so errors, CSS and global browser events cannot break other pages.
The modified version adds **free exploration mode**, switches to a single unified pointer event path, computes raycasts from the canvas bounds rather than `window.innerWidth`, prevents double-counting while a shape animates, and rotates through unsolved shapes. Parent/child exchange `PISIPOUK_SHAPE_ISLAND_READY/FAILED` messages; a timeout and retry control explain failure rather than displaying a fake loading success.

## Reliability / privacy
No Flash/SWF runtime, Python, GPU generation, subscription, paid HF endpoint, local client installation or sign-in needed to play.
Libraries are self-hosted under `public/preschool/games/vendor/`:
- Three.js **r128** classic UMD build and matched OrbitControls, both MIT, source `mrdoob/three.js@r128`. Keep THREE_LICENSE.txt alongside; ~630KB before compression.
- GSAP **3.15**, source `greensock/GSAP`, subject to GreenSock's standard *no-charge* license. It is not MIT; verify license if monetization model changes: https://gsap.com/standard-license.
- Confetti animation is first-party canvas code; no external confetti library.
- All core CSS authored locally in `shape-island-ui.css`; no live Tailwind CDN.
- Optional Google Fonts can fall back to system rounded fonts; game must not depend on font loading.
- CDN/personal-tracking calls must not be introduced into children's playtime.

## Engine selection for next games
| Need | Framework | License | Recommendation |
| --- | --- | --- | --- |
| Real WebGL worlds with 3D camera, hit testing, particles | [Three.js](https://github.com/mrdoob/three.js) | MIT | **Selected / integrated** |
| Natural motion, timeline, squash/stretch | [GSAP](https://github.com/greensock/GSAP) | no-charge | **Selected / integrated** |
| Rich 2D platform, puzzles, sprite animations | [Phaser](https://github.com/phaserjs/phaser) | MIT | For future 2D games (not yet integrated) |
| Large texture/sprite stage and GPU 2D layering | [PixiJS](https://github.com/pixijs/pixijs) | MIT | Alternative to Phaser for art-heavy 2D worlds |
| Existing licensed legacy SWF only | [Ruffle](https://github.com/ruffle-rs/ruffle) | MIT/Apache 2.0 | **Not** needed for new games |
Do not add every engine to one screen: ship selected engine per game with isolated lifecycle and measured bundle size. HF Spaces can produce **approved** illustrated sprite assets offline, but real-time gameplay must remain self-contained on Vercel.

## Minimum checks
1. Direct game URL `/preschool/games/shape-island.html` responds 200, loads all three local JS vendor files and CSS.
2. Browser sets `document.body.dataset.gameReady = "true"` after successful Three.js renderer and geometry initialization.
3. Start opens the mission (audio only after touch), raycaster recognizes 3D shapes, random target updates and progress increments only once per object.
4. Camera orbit vs tap distinction, guided/free mode switch, "dance" button, touch tablets and desktop mouse.
5. Resize/rotate tablet screen; device pixel ratio capped at 2, WebGL fallback and keyboard accessibility checks.
6. `tests/preschool-shape-island-3d.spec.ts` exists, **NOT executed in this assistant environment**. Vercel build READY and HTTP200 verify serving, **not** runtime behavior.
7. Distinguish real 3D interaction from **HD cinematic image quality**: the current user-supplied geometry is toon/primitive. Premium 3D art models, textures and creative direction still require separate work and asset approval.

## Production safety
All commits on `feature/pisipouk-world-v17-design`. Never modify or merge `main` without owner approval.
