#!/usr/bin/env bash
set -Eeuo pipefail
BASE="${1:-https://pisipouk.vercel.app}"
routes=(
  "/"
  "/learning-games"
  "/learning-games/snake?age=4-5"
  "/learning-games/maze?age=5-6"
  "/learning-games/memory?age=4-5"
  "/learning-games/count?age=2-3"
  "/seasonal-packs"
  "/virtual-preschool"
)
for route in "${routes[@]}"; do
  code="$(curl -L -sS -o /dev/null -w '%{http_code}' "$BASE$route")"
  if [[ "$code" != "200" ]]; then
    echo "FAIL $code $route" >&2
    exit 1
  fi
  echo "OK   $code $route"
done
