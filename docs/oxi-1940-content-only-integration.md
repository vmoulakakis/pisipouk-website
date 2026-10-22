# 28η Οκτωβρίου 1940 — Content-only integration (2026-10-22)
## Deployment boundaries
Source base main 3ee1bce876e62fb5280a1bcce87e5776d1fe72ab. Production routes/layout/gallery/content remain as-is. Added only October 1940 routes and one seasonal link from the preschool village; seasonal pack link uses conditional oct28 only.
## Features
- /october-1940: 12 child-led activities per age group (2.5–3.5 and 4–6); interaction via pointer/tap; no child-level storage.
- /october-1940-young and /october-1940-older: age-specific activities.
- /oxi-1940: 8-page A4 minibooklet guide with animated schematic folding and Canva source links.
- Canva activity designs: https://www.canva.com/d/Af9o_qKGSzyZJOW and https://www.canva.com/d/MIhXQfvj0kPD00Q
- Canva story booklets: https://www.canva.com/d/u6uw_qM_5vw_1Ux and https://www.canva.com/d/vh251266XWuTlTv
## Asset publishing gap
The newest 3D craft PDFs, verified age-target PDFs, instructional MP4, and any Library-only PDF have NOT been uploaded to public/ or made anonymously accessible. The interactive hub correctly provides a Canva fallback if an expected PDF in /printables is missing. Do not label this as a complete asset migration or replace fallback with a dead link. Production release requires image/PDF quality, external link and accessibility checks.
## Precautions
No homepage, global header/nav, gallery, tracking, service workers, existing gameplay, or global CSS touched. Before production, verify Vercel preview, route navigation, browser console, responsive behavior and downloads.