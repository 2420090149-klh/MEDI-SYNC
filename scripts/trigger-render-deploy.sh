#!/usr/bin/env bash
set -euo pipefail

# Trigger a Render deploy using environment variables:
#   export RENDER_API_KEY=your_key
#   export RENDER_SERVICE_ID=your_service_id
#   ./scripts/trigger-render-deploy.sh

if [ -z "${RENDER_API_KEY:-}" ] || [ -z "${RENDER_SERVICE_ID:-}" ]; then
  echo "Environment variables RENDER_API_KEY and RENDER_SERVICE_ID must be set"
  exit 1
fi

URI="https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys"
BODY='{"clearCache":true}'

curl -s -X POST "$URI" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer ${RENDER_API_KEY}" \
  -d "$BODY" | jq .

echo "Triggered deploy (response above)."
