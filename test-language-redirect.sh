#!/bin/bash

echo "Testing Server-Side Language Detection"
echo "======================================="
echo ""

# Test 1: Check bot detection (should NOT redirect)
echo "Test 1: Bot User-Agent (Googlebot) - Should NOT redirect"
echo "curl -I -H \"User-Agent: Googlebot\" https://changdiving.com/"
curl -s -I -H "User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" https://changdiving.com/ | head -3
echo ""

# Test 2: German browser (should redirect to /de/)
echo "Test 2: German Accept-Language - Should redirect to /de/"
echo "curl -I -H \"Accept-Language: de-DE,de;q=0.9\" https://changdiving.com/"
curl -s -I -H "Accept-Language: de-DE,de;q=0.9" -H "User-Agent: Mozilla/5.0" https://changdiving.com/ | grep -E "HTTP|Location"
echo ""

# Test 3: Thai IP (should redirect to /th/)
echo "Test 3: Thai Country (CF-IPCountry) - Should redirect to /th/"
echo "Note: This will only work on actual Cloudflare deployment"
echo ""

# Test 4: English default (should redirect to /en/)
echo "Test 4: English Accept-Language - Should redirect to /en/"
echo "curl -I -H \"Accept-Language: en-US,en;q=0.9\" https://changdiving.com/"
curl -s -I -H "Accept-Language: en-US,en;q=0.9" -H "User-Agent: Mozilla/5.0" https://changdiving.com/ | grep -E "HTTP|Location"
echo ""

# Test 5: noredirect parameter (should NOT redirect)
echo "Test 5: With ?noredirect parameter - Should NOT redirect"
echo "curl -I \"https://changdiving.com/?noredirect\""
curl -s -I -H "User-Agent: Mozilla/5.0" "https://changdiving.com/?noredirect" | head -3
echo ""

echo "======================================="
echo "Tests complete!"
echo ""
echo "Expected behavior:"
echo "- Bots see the language selector (no redirect)"
echo "- Human users are redirected based on their language"
echo "- Cookie is set to remember preference"
echo "- ?noredirect parameter prevents redirect"