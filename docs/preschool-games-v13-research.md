# Pisipouk V13 — Games-only research baseline

This branch is intentionally scoped to the games experience only. No changes to crafts, stories, enrollment, nutrition, gallery, or other site areas.

## Age model

The previous 2–3 / 4–5 / 5–6 grouping was too coarse. V13 uses four developmental bands that map to milestone changes much more closely:

- **2 years** — cause/effect, big targets, single-step pretend play, simple object use, no failure loop.
- **3 years** — color/shape matching, simple two-step routines, action vocabulary, large-object fine-motor interactions.
- **4 years** — pretend roles, story order, helper tasks, construction and planning, simple rules.
- **5–6 years** — counting to 10, prediction/testing, spatial planning, rules/turn-taking, multi-step stories and puzzles.

## Design rules

1. Every game belongs to exactly one age band.
2. No game is a reskinned quiz card.
3. At least half of the catalog is open-ended or playful, not academic drill.
4. Wrong actions use gentle recovery, never punishment or loss of points.
5. Parent co-play is optional and does not cover the child controls.
6. Motion, sound and rewards are relevant to the action; no distracting reward spam.
7. Touch interaction is first-class: large hit targets, drag thresholds, no hover dependency.
8. Sessions are short and replayable; difficulty changes by age and within-session progress.
9. Learning goals must be visible in the mechanic itself, not only in the description.
10. Automated QA must exercise the real mechanic, not just open the canvas.

## Research references used for the redesign

- NAEYC Developmentally Appropriate Practice: play should preserve **choice, wonder and delight**, with guided play between free play and direct instruction.
- CDC developmental milestones at ages 2, 3, 4 and 5: used to choose interaction complexity and goals.
- AAP guidance for young children: high-quality content, co-use, relevant interactivity, low distraction, and avoiding fast-paced/overstimulating design.
- Pok Pok: open-ended play, no forced win/lose loop, calm interaction, adult prompts.
- Sago Mini: movable/stackable/interactable props, pretend play, building, music and discovery.
- Khan Academy Kids: whole-child coverage and adaptive sequencing rather than one repeated mechanic.

## QA acceptance gates

- All games load a Babylon scene with interactive meshes.
- Every age selector exposes only that age's games.
- Each game can be completed or meaningfully played using actual pointer/drag actions.
- Wrong actions recover without dead-end state.
- Scene and engine are disposed after leaving a game.
- 100 repeated mount/unmount sessions do not accumulate active engines.
- Mobile viewport keeps primary controls reachable and at least 44 CSS px high.
