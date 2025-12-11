#!/bin/bash

# Cloudflare Cache Purge Script
# This script purges the Cloudflare cache for changdiving.com

# Configuration
ZONE_NAME="changdiving.com"
EMAIL=""  # Your Cloudflare email (if using Email + Global API Key)
API_KEY=""  # Your Cloudflare Global API Key OR API Token
ZONE_ID=""  # Your Zone ID (optional - will be fetched if not provided)

# Check if using API Token (starts with specific format) or Email+Key
USE_API_TOKEN=false

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Cloudflare Cache Purge Script"
echo "=========================================="
echo ""

# Check if credentials are set
if [ -z "$API_KEY" ] && [ -z "$EMAIL" ]; then
    echo -e "${YELLOW}⚠️  No credentials configured!${NC}"
    echo ""
    echo "Please edit this script and add your credentials:"
    echo ""
    echo "Option 1: API Token (Recommended)"
    echo "  1. Go to: https://dash.cloudflare.com/profile/api-tokens"
    echo "  2. Create token with 'Zone.Cache Purge' permission"
    echo "  3. Set API_KEY='your-token-here'"
    echo ""
    echo "Option 2: Email + Global API Key"
    echo "  1. Go to: https://dash.cloudflare.com/profile/api-tokens"
    echo "  2. Click 'View' next to 'Global API Key'"
    echo "  3. Set EMAIL='your-email@example.com'"
    echo "  4. Set API_KEY='your-global-api-key'"
    echo ""
    echo "To get Zone ID (optional):"
    echo "  1. Go to: https://dash.cloudflare.com"
    echo "  2. Select your domain"
    echo "  3. Scroll down to 'Zone ID' in the right sidebar"
    echo "  4. Set ZONE_ID='your-zone-id'"
    echo ""
    exit 1
fi

# Determine authentication method
if [[ "$API_KEY" =~ ^[A-Za-z0-9_-]{40}$ ]]; then
    USE_API_TOKEN=true
    AUTH_HEADER="Authorization: Bearer $API_KEY"
    echo "Using API Token authentication"
else
    if [ -z "$EMAIL" ]; then
        echo -e "${RED}Error: EMAIL is required when using Global API Key${NC}"
        exit 1
    fi
    AUTH_HEADER="X-Auth-Email: $EMAIL"
    AUTH_KEY_HEADER="X-Auth-Key: $API_KEY"
    echo "Using Email + Global API Key authentication"
fi

# Get Zone ID if not provided
if [ -z "$ZONE_ID" ]; then
    echo "Fetching Zone ID for $ZONE_NAME..."
    
    if [ "$USE_API_TOKEN" = true ]; then
        ZONE_RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$ZONE_NAME" \
            -H "$AUTH_HEADER" \
            -H "Content-Type: application/json")
    else
        ZONE_RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$ZONE_NAME" \
            -H "$AUTH_HEADER" \
            -H "$AUTH_KEY_HEADER" \
            -H "Content-Type: application/json")
    fi
    
    ZONE_ID=$(echo "$ZONE_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    
    if [ -z "$ZONE_ID" ]; then
        echo -e "${RED}Error: Could not fetch Zone ID${NC}"
        echo "Response: $ZONE_RESPONSE"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Found Zone ID: $ZONE_ID${NC}"
fi

# Purge everything
echo ""
echo "Purging cache for $ZONE_NAME..."
echo ""

if [ "$USE_API_TOKEN" = true ]; then
    RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
        -H "$AUTH_HEADER" \
        -H "Content-Type: application/json" \
        --data '{"purge_everything":true}')
else
    RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
        -H "$AUTH_HEADER" \
        -H "$AUTH_KEY_HEADER" \
        -H "Content-Type: application/json" \
        --data '{"purge_everything":true}')
fi

# Check response
SUCCESS=$(echo "$RESPONSE" | grep -o '"success":[^,]*' | cut -d':' -f2)

if [ "$SUCCESS" = "true" ]; then
    echo -e "${GREEN}✓ Cache purge successful!${NC}"
    echo ""
    echo "The cache has been cleared. Your changes should now be visible."
    echo "Note: It may take a few minutes for changes to propagate globally."
else
    echo -e "${RED}✗ Cache purge failed!${NC}"
    echo ""
    echo "Response: $RESPONSE"
    exit 1
fi

echo ""
echo "=========================================="

