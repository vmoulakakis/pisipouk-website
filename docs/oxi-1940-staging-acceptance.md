# Πισιπούκ · Επέτειος «ΟΧΙ» 1940 — Release Gate

## Scope
This is an **isolated seasonal module**, not a virtual-preschool rewrite. Branch: `feature/oxi-1940-age-interactive-20261020`. Do **not** merge or deploy production until acceptance.

### Routes
- `/october-1940`: one landing page, two age cards, Canva booklet links and PDF detection.
- `/october-1940-young`: 12 interactive activities for **2.5–3.5**.
- `/october-1940-older`: 12 interactive activities for **4–6**.
- Discovery only: existing `/seasonal-packs/oct28` and `/virtual-preschool`. Their existing functionality remains unchanged.

### Source Canva designs
- Younger ages (13 pages): `DAHYiHNEHN4`, viewer `https://www.canva.com/d/Af9o_qKGSzyZJOW`.
- Older ages (13 pages): `DAHYiEcEFRY`, viewer `https://www.canva.com/d/MIhXQfvj0kPD00Q`.
- Current links open the designs via Canva. **They are not direct anonymous PDF downloads.**

### Required production PDF assets
1. Export each exact Canva design to **PDF Print**, A4 portrait, checking all 13 pages and text.
2. Commit/store as real publicly fetchable static assets:
   - `public/printables/oxi-1940-2-5-3-5.pdf`
   - `public/printables/oxi-1940-4-6.pdf`
3. Frontend checks PDF response `Content-Type: application/pdf` via HEAD. When present, card automatically offers **direct one-click download**; otherwise it uses Canva transparently.
4. Verify HEAD 200, application/pdf, GET nonzero bytes, 13 pages, 595 × 842 pt, click download on mobile/desktop. Never claim complete until BOTH succeed.
5. Ensure Canva public-share access / copyrights for cover images and generated artwork.

### Child safety and pedagogy
- No collection of child's name, age, result or behavioral event at this module level.
- No competitive timer, leaderboard or punitive sound; positive hints.
- Touch/keyboard alternative to HTML drag-and-drop: tap an item and tap a bin.
- No tsoliades, weapons, gore, or inaccurate reenactment. Theme: the historical refusal in 1940, Pindos, symbols, newspapers, solidarity and peace.
- **Educational review**: the pictograms and simplified language should be checked by a Greek early-childhood educator.

### Acceptance checklist (must verify in actual browser)
- [ ] Latest branch Vercel deployment READY, separate from production
- [ ] New route paths render: 200, no console exceptions
- [ ] Adult can navigate to the module from online-preschool and Seasonal Packs
- [ ] Young exercises count 1–3, simple pattern, size, classification, trace
- [ ] Older exercises count 1–10, letters, OXI, 1940, sequence, comparisons
- [ ] Drag/drop with mouse works, click-to-place touch alternative works
- [ ] Tracing works on mouse and pointer/touch and clears with reset
- [ ] Correct, incorrect and retry feedback behave as expected
- [ ] Mobile 390px, tablet 768px, desktop 1440px layout and scrolling tested
- [ ] 2 Canva booklets checked on unauthenticated browser; exact PDF assets available
- [ ] **Regression:** normal learning games, drawing, stories, gallery, SiteLayout and seasonal pack still work
- [ ] Product owner explicitly approves production merge/deploy

### Rollback
Do not merge before acceptance. If a production merge is later approved, keep an annotated pre-merge main SHA and redeploy that SHA to roll back. Existing production currently remains unchanged.
