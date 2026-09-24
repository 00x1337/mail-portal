#!/usr/bin/env bash
set -e

VPS_HOST="148.113.251.156"
VPS_USER="ubuntu"
REMOTE_PATH="/opt/mailcow-dockerized"

echo "=========================================="
echo "🚀 Deploying Mail Portal to $VPS_HOST..."
echo "=========================================="

# 1. Sync templates
echo "📦 Uploading templates..."
rsync -avz --exclude="cache" templates/ "${VPS_USER}@${VPS_HOST}:${REMOTE_PATH}/data/web/templates/"

# 2. Sync CSS & JS & IMG
if [ -d "css" ]; then
    echo "🎨 Uploading styles..."
    rsync -avz css/ "${VPS_USER}@${VPS_HOST}:${REMOTE_PATH}/data/web/css/"
fi

if [ -d "img" ]; then
    echo "🖼️  Uploading images..."
    rsync -avz img/ "${VPS_USER}@${VPS_HOST}:${REMOTE_PATH}/data/web/img/"
fi

# 3. Sync SOGo customizations if present
if [ -d "conf/sogo" ]; then
    echo "⚙️  Uploading SOGo configs..."
    rsync -avz conf/sogo/ "${VPS_USER}@${VPS_HOST}:${REMOTE_PATH}/data/conf/sogo/"
fi

# 4. Clear Twig Cache & Reload Services on VPS
echo "🔄 Clearing cache and restarting web services..."
ssh "${VPS_USER}@${VPS_HOST}" "sudo rm -rf /opt/mailcow-dockerized/data/web/templates/cache/* && sudo docker restart mailcowdockerized-php-fpm-mailcow-1 mailcowdockerized-nginx-mailcow-1"

# 5. Health Check
echo "🔍 Verifying deployment (waiting 3s for services to be ready)..."
sleep 3
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://${VPS_HOST}:8080/")
if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "🎉 Deployment SUCCESSFUL! Web portal is live at: http://${VPS_HOST}:8080/"
else
    echo "⚠️ Warning: HTTP status returned: $HTTP_STATUS"
fi
