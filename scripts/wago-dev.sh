#!/usr/bin/env bash
# Arranca GO2026 con tunnel y registra el webhook en WAGO automáticamente.
# Uso: bash scripts/wago-dev.sh

set -e

WAGO_API="https://api.recursomusical.com.mx"
WAGO_TOKEN="wh_65cf3f2f72a92706501d377b32a89a114ff7f81e19f4e2ea"
CONNECTION_ID="ff16833d-d669-42f7-a458-6b63dfbd2d00"
ENV_FILE="$(dirname "$0")/../.env"
TUNNEL_LOG="/tmp/go2026-tunnel-$$.log"

cleanup() {
  echo ""
  echo "Limpiando webhook $WEBHOOK_ID..."
  [ -n "$WEBHOOK_ID" ] && curl -s -X DELETE \
    "${WAGO_API}/api/webhooks/${WEBHOOK_ID}" \
    -H "Authorization: Bearer ${WAGO_TOKEN}" > /dev/null
  kill $(jobs -p) 2>/dev/null
  rm -f "$TUNNEL_LOG"
  echo "Listo."
}
trap cleanup EXIT INT TERM

# 1. Arrancar dev server en background
echo "Arrancando GO2026..."
npm run dev > /tmp/go2026-dev-$$.log 2>&1 &
DEV_PID=$!

# 2. Arrancar tunnel en background y capturar URL
echo "Iniciando tunnel cloudflared..."
cloudflared tunnel --config /dev/null --url http://localhost:4321 > "$TUNNEL_LOG" 2>&1 &
TUNNEL_PID=$!

# 3. Esperar URL del tunnel (max 30s)
TUNNEL_URL=""
for i in $(seq 1 30); do
  TUNNEL_URL=$(grep -o "https://[a-z0-9\-]*\.trycloudflare\.com" "$TUNNEL_LOG" 2>/dev/null | head -1)
  [ -n "$TUNNEL_URL" ] && break
  sleep 1
done

if [ -z "$TUNNEL_URL" ]; then
  echo "ERROR: No se pudo obtener URL del tunnel"
  exit 1
fi

echo "Tunnel: $TUNNEL_URL"

# 4. Registrar webhook en WAGO
WEBHOOK_ENDPOINT="${TUNNEL_URL}/api/webhook/whatsapp"
RESPONSE=$(curl -s -X POST "${WAGO_API}/api/connections/${CONNECTION_ID}/webhooks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${WAGO_TOKEN}" \
  -d "{\"url\":\"${WEBHOOK_ENDPOINT}\",\"events\":[\"message\",\"message.reaction\",\"session.status\"]}")

WEBHOOK_ID=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
SIGNING_SECRET=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['signingSecret'])" 2>/dev/null)

if [ -z "$WEBHOOK_ID" ]; then
  echo "ERROR registrando webhook: $RESPONSE"
  exit 1
fi

echo "Webhook creado: $WEBHOOK_ID"
echo "URL: $WEBHOOK_ENDPOINT"

# 5. Actualizar .env con el nuevo secret
if grep -q "WAGO_WEBHOOK_SECRET" "$ENV_FILE"; then
  # Reemplazar valor existente (compatible con macOS sed)
  sed -i '' "s|^WAGO_WEBHOOK_SECRET=.*|WAGO_WEBHOOK_SECRET=${SIGNING_SECRET}|" "$ENV_FILE"
else
  echo "WAGO_WEBHOOK_SECRET=${SIGNING_SECRET}" >> "$ENV_FILE"
fi

echo ""
echo "Listo. Webhook activo:"
echo "  URL:    $WEBHOOK_ENDPOINT"
echo "  ID:     $WEBHOOK_ID"
echo "  Secret: ${SIGNING_SECRET:0:16}..."
echo ""
echo "Ctrl+C para detener y limpiar."
echo ""

# 6. Esperar (mantener tunnel y dev server vivos)
wait $DEV_PID $TUNNEL_PID
