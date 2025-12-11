#!/bin/bash

# Simple Cloudflare Cache Purge
# Usage: ./purge-cache-simple.sh YOUR_API_TOKEN

if [ -z "$1" ]; then
    echo "Usage: $0 YOUR_CLOUDFLARE_API_TOKEN"
    echo ""
    echo "To get your API Token:"
    echo "1. Go to: https://dash.cloudflare.com/profile/api-tokens"
    echo "2. Create token with 'Zone.Cache Purge' permission for changdiving.com"
    echo "3. Run: $0 YOUR_TOKEN_HERE"
    exit 1
fi

API_TOKEN="$1"
ZONE_NAME="changdiving.com"

echo "Fetching Zone ID for $ZONE_NAME..."
ZONE_RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$ZONE_NAME" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json")

ZONE_ID=$(echo "$ZONE_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$ZONE_ID" ]; then
    echo "❌ Error: Could not fetch Zone ID"
    echo "Response: $ZONE_RESPONSE"
    exit 1
fi

echo "✓ Zone ID: $ZONE_ID"
echo ""
echo "Purging cache..."

RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}')

SUCCESS=$(echo "$RESPONSE" | grep -o '"success":[^,]*' | cut -d':' -f2)

if [ "$SUCCESS" = "true" ]; then
    echo "✅ Cache purge successful!"
    echo ""
    echo "Your changes should now be visible. It may take a few minutes to propagate globally."
else
    echo "❌ Cache purge failed!"
    echo "Response: $RESPONSE"
    exit 1
fi

