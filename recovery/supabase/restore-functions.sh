#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_REF="gqpbskssrvpfjtujwezc"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TMP="$(mktemp -d -t pisipouk-supabase-XXXXXX)"
trap 'rm -rf "$TMP"' EXIT

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo "Set SUPABASE_ACCESS_TOKEN before running this script." >&2
  exit 1
fi

mkdir -p "$TMP/supabase/functions"
for slug in pisipouk-api pisipouk-lead pisipouk-event pisipouk-admin-data pisipouk-subscribe; do
  mkdir -p "$TMP/supabase/functions/$slug"
  cp "$ROOT/recovery/supabase/functions/$slug/index.ts" "$TMP/supabase/functions/$slug/index.ts"
done

cd "$TMP"

for slug in pisipouk-api pisipouk-lead pisipouk-event pisipouk-subscribe; do
  npx --yes supabase@latest functions deploy "$slug" --project-ref "$PROJECT_REF" --no-verify-jwt
done
npx --yes supabase@latest functions deploy pisipouk-admin-data --project-ref "$PROJECT_REF"

echo "Pisipouk Edge Functions redeployed to $PROJECT_REF."
echo "Secret values and production database rows are intentionally not restored by this public script."
