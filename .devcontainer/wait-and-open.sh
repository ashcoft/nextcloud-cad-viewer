#!/bin/bash

echo "⏳ Waiting for Nextcloud to be ready..."

# Wait for Nextcloud to be accessible
MAX_WAIT=60
COUNTER=0

while [ $COUNTER -lt $MAX_WAIT ]; do
    if curl -s http://localhost:8080 > /dev/null 2>&1; then
        echo "✅ Nextcloud is ready!"
        break
    fi
    echo "   Waiting... ($COUNTER/$MAX_WAIT)"
    sleep 2
    COUNTER=$((COUNTER + 2))
done

if [ $COUNTER -ge $MAX_WAIT ]; then
    echo "⚠️ Nextcloud didn't respond within $MAX_WAIT seconds"
    echo "   Start it manually: cd /workspace/server && php -S 0.0.0.0:8080"
fi

echo ""
echo "🎨 CAD Viewer Demo is ready!"
echo "   Open: http://localhost:8080/apps/cad_viewer"
