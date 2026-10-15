# PISIPOUK WORLD 2.0 — R1 Preview Delivery Ledger

Date: 2026-10-15
Branch: `design/pisipouk-world-v2-ux-20261015`
Deployment type: `target=null` — Vercel preview, not production
Staging path: `/pisipouk-v2-staging/`
Production: unchanged at `main` commit `e609d62b73769002e00f8df1ea40e4626561caad`

## Implemented source

- `src/features/preschool-v2/age-worlds.tsx`: first-class age navigation 2–3, 3–4, 4–5, 5–6; links for games, patterns, crafts, and stories; visual catalog marks 19 not-implemented game proposals per age as planned.
- `src/features/preschool-v2/age-games.tsx`: 4 interactive prototype engines:
  - 2–3 popping moving bubbles, scores and round reset;
  - 3–4 physically presented bottles, first/second color selection, real mixed results and discovery count;
  - 4–5 choose short/long wood per gap, construct a three-piece bridge, animate bear crossing after validation;
  - 5–6 author directional program, obstacle detection, 4×4 navigation, start/stop execution feedback.
- `src/features/preschool-v2/age-printables.tsx`: four original vector line-art A4 drawings (bear, butterfly, bridge, seasonal wheel); SVG download; browser print-to-PDF; one four-step guided craft and one short original Greek narrated-by-browser story per age.
- `src/features/preschool-v2/age-worlds.css`: scoped responsive design, gentle CSS kinetic scene motion, reduced-motion fallback and A4 print CSS.
- New `src/routes/pisipouk-v2-staging.ages.$age*.tsx`: route-specific direct links and nested content.
- `tests/preschool/v2-age-first.spec.ts`: Playwright smoke and user-journey specifications; tests AUTHORED but NOT EXECUTED.

## Verification so far

- GitHub branch exists with all relevant files.
- Vercel build completed in 12.88s, deployment READY and no build errors in observed build events. Warnings about existing chunk sizes are present.
- Direct URL GET for age selection, four games, pattern, craft and story returned HTTP 200 and X-Robots-Tag: noindex.
- This does NOT prove React hydration, user gesture functionality, screenshots, PDF print quality or cross-browser compatibility. Those tests are still required.
- No merge, live alias changes, live environment or database writes.

## Remaining acceptance blockers

1. Real desktop and mobile browser capture plus tap/keyboard tests; execute Playwright suite against local served app or authenticated preview.
2. Genuine character model / rig / animation sheets approved against the original Pisipouk bear; current preview reuses existing mascot image and CSS movements.
3. Professionally drawn environment spritesheets and revised original A4 patron per curriculum with independent educator evaluation.
4. Remaining **76 distinct games** (19 per age); 76 more original A4 patterns; 36 more crafts; 36 more age-specific stories to reach the proposed 240 content target.
5. QA for child age groups and actual paper printing; spoken narration quality depends on host OS browser Greek TTS.
6. Privacy, server email with adult verification, CMS and AI weekly publishing are NOT implemented in this milestone.
7. Full E2E + visual regression + responsive WCAG checks, performance profiling, educator acceptance, staging signoff, and production promotion only by explicit approval.

## Delivery principle
Do not label this prototype or overall preschool complete. Use it as a working first slice to anchor visual fidelity, gameplay mechanics and teaching quality.
