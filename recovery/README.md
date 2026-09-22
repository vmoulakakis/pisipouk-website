# Pisipouk — End-to-End Recovery Kit

Captured: **2026-09-22 22:20 Europe/Athens**

This recovery branch is based directly on production commit `e2cee276956848fab558fe664949e0426b7e6682`.
Outside the `recovery/` directory, the application source is identical to that production snapshot.

## Exact production snapshot

- GitHub repository: `vmoulakakis/pisipouk-website`
- Immutable snapshot branch: `backup-e2e-production-2026-09-22-2220`
- Recovery branch: `recovery-kit-2026-09-22-2220`
- Production source commit: `e2cee276956848fab558fe664949e0426b7e6682`
- Vercel project: `pisipouk`
- Vercel project ID: `prj_VXN6LQQZYgXRK9fDy4PEJ3V0PUhW`
- Vercel team ID: `team_jt3jd1HJUB4sK1oZdl9MUYGs`
- Captured production deployment: `dpl_BqYziUoZFmQNNC7G2EZqCUhusFTL`
- Production URL: `https://pisipouk.vercel.app`

## One-command recovery

The bootstrap command from any Mac/Linux/WSL machine is:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/vmoulakakis/pisipouk-website/recovery-kit-2026-09-22-2220/recovery/restore-from-zero.sh)
```

Prerequisites: Git, Node.js/npm, network access, and a logged-in Vercel CLI session. Alternatively set `VERCEL_TOKEN`.
The script clones the immutable recovery branch, verifies the application against the production commit, runs `npm ci`, builds, links the exact Vercel project, deploys production, and checks key public routes.

## Integrity

`source-manifest.tsv` records every production file's Git blob SHA, size and path (134 files).
`git-branches.json` records the branch heads visible when the kit was created.
`snapshot.json` records GitHub, Vercel and external-backend identifiers.

## Vercel

The app's deploy-critical configuration is already versioned in `vercel.json`:
- framework: Vite
- build: `npm run build`
- output: `dist`
- SPA rewrite to `/index.html`
- immutable cache headers for assets

A scan of the production source found no `import.meta.env`, `process.env`, `VITE_` or `VERCEL_` runtime references, so this snapshot does not depend on Vercel environment variables for the current frontend build.

## Supabase dependency

The current site calls Supabase project `gqpbskssrvpfjtujwezc`. To make disaster recovery stronger, this kit also stores the **Pisipouk Edge Function source** and non-secret metadata under `recovery/supabase/`.

For security, this public GitHub backup intentionally does **not** contain:
- production leads/subscriber rows or other PII,
- service-role keys,
- Resend/API secret values,
- admin credential material.

Those must be kept in a separate encrypted/private secret-and-data backup if full Supabase-project loss must also be recoverable.

## Verification only

```bash
bash recovery/verify.sh
```
