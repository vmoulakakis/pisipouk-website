#!/usr/bin/env bash
set -Eeuo pipefail

REPO_URL="https://github.com/vmoulakakis/pisipouk-website.git"
RECOVERY_BRANCH="recovery-kit-2026-09-22-2220"
SNAPSHOT_SHA="e2cee276956848fab558fe664949e0426b7e6682"
TEAM_ID="team_jt3jd1HJUB4sK1oZdl9MUYGs"
TEAM_SLUG="vassilis-projects-3bf8541b"
PROJECT_ID="prj_VXN6LQQZYgXRK9fDy4PEJ3V0PUhW"
PROJECT_NAME="pisipouk"
PUBLIC_URL="https://pisipouk.vercel.app"

need() {
  command -v "$1" >/dev/null 2>&1 || { echo "Missing required command: $1" >&2; exit 1; }
}
need git
need node
need npm
need npx
need curl

if [[ -n "${PISIPOUK_RESTORE_DIR:-}" ]]; then
  WORKDIR="$PISIPOUK_RESTORE_DIR"
  if [[ -e "$WORKDIR" ]]; then
    echo "Restore directory already exists: $WORKDIR" >&2
    exit 1
  fi
else
  WORKDIR="$(mktemp -d -t pisipouk-restore-XXXXXX)"
fi

echo "[1/6] Cloning immutable recovery branch..."
git clone --branch "$RECOVERY_BRANCH" --single-branch "$REPO_URL" "$WORKDIR"
cd "$WORKDIR"

echo "[2/6] Verifying application source matches production snapshot..."
if ! git diff --quiet "$SNAPSHOT_SHA" -- . ':(exclude)recovery'; then
  echo "ERROR: application source differs from production snapshot $SNAPSHOT_SHA" >&2
  exit 1
fi

echo "[3/6] Installing locked dependencies and building..."
npm ci --no-audit --no-fund
npm run build

echo "[4/6] Restoring exact Vercel project link..."
mkdir -p .vercel
cat > .vercel/project.json <<JSON
{"orgId":"$TEAM_ID","projectId":"$PROJECT_ID"}
JSON

TOKEN_ARGS=()
if [[ -n "${VERCEL_TOKEN:-}" ]]; then
  TOKEN_ARGS=(--token "$VERCEL_TOKEN")
fi

echo "[5/6] Deploying production..."
if ! npx --yes vercel@latest deploy --prod --yes --scope "$TEAM_SLUG" --project "$PROJECT_ID" "${TOKEN_ARGS[@]}"; then
  echo "Existing Vercel project ID was unavailable. Attempting recreation as '$PROJECT_NAME'..."
  rm -rf .vercel
  npx --yes vercel@latest project add "$PROJECT_NAME" --scope "$TEAM_SLUG" --yes "${TOKEN_ARGS[@]}" || true
  npx --yes vercel@latest link --yes --project "$PROJECT_NAME" --scope "$TEAM_SLUG" "${TOKEN_ARGS[@]}"
  npx --yes vercel@latest deploy --prod --yes --scope "$TEAM_SLUG" --project "$PROJECT_NAME" "${TOKEN_ARGS[@]}"
fi

echo "[6/6] Verifying public routes..."
for route in "/" "/learning-games" "/learning-games/memory?age=4-5" "/learning-games/maze?age=5-6" "/seasonal-packs"; do
  curl --fail --silent --show-error --location "$PUBLIC_URL$route" >/dev/null
  echo "  OK  $route"
done

# Best-effort Git integration relink. Failure here does not invalidate the restored production deployment.
npx --yes vercel@latest link --repo --yes --scope "$TEAM_SLUG" "${TOKEN_ARGS[@]}" >/dev/null 2>&1 || true

echo
echo "Pisipouk restored and verified: $PUBLIC_URL"
echo "Source snapshot: $SNAPSHOT_SHA"
echo "Working copy: $WORKDIR"
