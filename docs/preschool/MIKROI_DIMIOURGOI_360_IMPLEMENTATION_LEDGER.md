# Μικροί Δημιουργοί 360 — Implementation Ledger
Updated 2026-10-13. Development branch: `feature/pisipouk-world-v17-design`. Never merge to `main` without explicit owner approval.

## Product intent
One child-first, interactive, ORIGINAL Three.js/WebGL nursery-school game platform ages 2–5, as a PISIPOUK online-preschool extension. Six creative pillars and 24 original activities as specified in `MIKROI_DIMIOURGOI_360_Production_Blueprint_v1.zip` (user-provided design contract).

**No claim of completion for all 24 activities.** Current deliverable is a working vertical-slice implementation whose actual mouse/touch gameplay must still pass device QA.

## Implemented in this branch
- `src/components/preschool/LittleCreators360.tsx` renders six pillars, four activity entries each, with nonfunctional ones clearly labeled `Σε ανάπτυξη`.
- `public/preschool/360/cozy-garden.html` isolated screen with large green PLAY, large back and skip, age band 2–3 / 3–4 / 4–5, calm mode, optional el-GR speech, single pointer mouse + touch and touch-friendly toolbar.
- `cozy-garden.js`: self-hosted Three.js WebGL stage with orbit camera, 3D farm island/barn, soil plots, modeled flowers, sheep, bee, water wheel, apples, crates. Tools include sow, water, switch sun/rain, send bee, BUILD wooden planter, and PAINT flower petals in four colors.
- `public/preschool/360/core/random-play.js` seeded quest generator and solvability validation, 3 playable game modes: `C09` (garden multi-discipline), `A01` (color sorting), `B05` (counting apples). New garden quests randomly alternate planting, watering, exploration, building and painting. Set ages limit counting complexity.
- Dynamic events are gentle and suppressed during drag, narration, reduced motion and calm mode; rewards are soft particle effects and chimes. No penalty or timed failure.
- `/preschool/360/sw.js` scoped PWA cache with network-first updates, private browser-side state, no analytics, ads or accounts. Offline after first successful cache install only; browser Greek TTS **not guaranteed offline**.
- Vendor Three.js classic r128 and OrbitControls are hosted locally, not loaded from CDN at runtime.
- `tests/preschool360-random.test.cjs` includes deterministic replay, 1980 mission solvability samples across age bands/modes, replay variation, event checks, and invalid goals. `npm run build` invokes `npm run test:preschool360` (JS syntax + Node tests) before Vite build.
- `tests/preschool360-farm.spec.ts` covers 3D readiness, guided mode navigation, building/painting tool and 6-pillar UI; browser Playwright execution is **not yet verified**.

## Not yet delivered (no false completeness)
- Full original art/animation package reaching cinematic reference fidelity; current 3D environment is original procedural stylized low-poly, not HD film rendering.
- The other 21 original activities as bespoke, end-to-end playable games (older V15/V17 mini-games are reused in some navigation links but not equivalent to those bespoke activity specifications).
- Actual device QA and educator study of ages 2–5, across tablet/mouse/Chromebook and low-end GPUs.
- Full accessibility audit, offline microphone/TTS/cached Greek recordings, legal GDPR/COPPA sign-off.
- Guaranteed 60fps on all hardware (not feasible; 60fps target with adaptive fallback).

## Acceptance requirements before releasing
1. Assert browser reports `document.body.dataset.gameReady = true`, then `playable=true` after child action; test with real browser, not just HTTP 200.
2. Verify on-device 3D hit testing and ≥40 CSSpx forgiving snap, free and guided play, three modes, planter building, painting, weather, pointer dragging, orientation/resize.
3. Confirm secure cached offline loading after successful first visit; offline Greek audio requires bundled voice (not implemented).
4. Analyze frame time, first payload (<10MB goal), WebGL context loss and silent audio permission failure.
5. Pedagogue validates Montessori/Reggio/guided play adaptations and no-fail recovery.
6. Owner approves art direction and explicit production merge.

## URLs (preview only)
- `/virtual-preschool` → Games → "Μικροί Δημιουργοί"
- `/preschool/360/cozy-garden.html?game=C09` → Garden
- `/preschool/360/cozy-garden.html?game=A01` → Color sorting
- `/preschool/360/cozy-garden.html?game=B05` → Counting

**Production main intentionally remains unchanged.**
