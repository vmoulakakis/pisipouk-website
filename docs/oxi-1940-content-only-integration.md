# Πισιπούκ — 28η Οκτωβρίου 1940 (Content-only Release Candidate)

## Προστασία παραγωγής
- Αρχικό production commit: `3ee1bce876e62fb5280a1bcce87e5776d1fe72ab`.
- Το κύριο `main` παραμένει αμετάβλητο μέχρι επιτυχημένα build/preview/E2E.
- Καμία αλλαγή στο global menu, αρχική σελίδα, gallery, δεδομένα παιδιών, authentication, global styles, υπάρχουσες δραστηριότητες.
- Η πρόσβαση προστίθεται μόνο στο υπάρχον Preschool Village και στο Seasonal Pack «28η Οκτωβρίου».

## Διαδρομές
- `/october-1940`: Κέντρο επετείου με 12+12 διαδραστικές ασκήσεις, 2 ηλικίες, Canva links, εμφανές εργαστήρι ζωγραφικής.
- `/october-1940-young`: Ασκήσεις 2,5–3,5.
- `/october-1940-older`: Ασκήσεις 4–6.
- `/october-1940-coloring`: 4 HD vector designs (περιστέρι/ελιά/σημαία/ΟΧΙ), tap/click coloring areas, brush, eraser, undo, clear, PNG save and generated four-page A4 PDF download from the browser. Uses existing `pdf-lib`, `@pdf-lib/fontkit`, `/preschool-world/greek.ttf`; no new package install or server upload.
- `/oxi-1940`: Mini booklet Story Time και σχηματικές κινούμενες οδηγίες διπλώματος, 2 ηλικίες.

## Printable gap
- Browser-generated 4-page A4 coloring PDF **is part of this branch**, but not yet verified by running Playwright on a successful deploy.
- Earlier 11-page colored and 8-page black-and-white 3D craft PDFs and age-specific VERIFIED PDF files exist in ChatGPT chat/Library, **not** yet as public GitHub/Vercel assets. Canva links continue to be available for age-specific booklets. Do not claim all historic files have been deployed.

## Release checklist
- [ ] Vercel preview READY (currently **blocked** by daily API deployment quota, status failure).
- [ ] Mobile/tablet/desktop painting and text check.
- [ ] Playwright tests for PDF 4 pages at A4 595x842 pt and PNG downloads.
- [ ] All 24 interactive learning exercises work.
- [ ] Existing Preschool, Seasonal Packs, Gallery, home and games remain unchanged.
- [ ] Test representative children-friendly instructions and colors before public release.
- [ ] Review release and merge only after these checks.

## Rollback
Revert merged feature commit or redeploy known-good main commit listed above; never force-push production.
