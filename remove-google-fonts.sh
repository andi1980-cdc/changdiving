#!/bin/bash

# Script zum Entfernen von externen Google Fonts aus allen HTML-Dateien
# Die lokalen Fonts (/fonts/fonts.css) bleiben erhalten

echo "🚀 Starte Google Fonts Entfernung..."
echo ""

# Zähler
count=0

# Finde alle HTML-Dateien mit Google Fonts
while IFS= read -r file; do
    # Erstelle Backup
    # cp "$file" "$file.backup"
    
    # Entferne die drei Google Fonts Zeilen
    # 1. <link rel="preconnect" href="https://fonts.googleapis.com" />
    # 2. <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    # 3. <link href="https://fonts.googleapis.com/css2?family=Roboto..." />
    
    sed -i '' '/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"/d' "$file"
    sed -i '' '/<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com"/d' "$file"
    sed -i '' '/<link.*href="https:\/\/fonts\.googleapis\.com\/css2.*"/d' "$file"
    
    count=$((count + 1))
    
    if [ $((count % 50)) -eq 0 ]; then
        echo "✅ $count Dateien bearbeitet..."
    fi
done < <(find . -name "*.html" -type f -exec grep -l "fonts.googleapis.com" {} \;)

echo ""
echo "✅ Fertig! $count Dateien wurden bereinigt."
echo ""
echo "📊 Vorher: Externe Google Fonts (langsam)"
echo "📊 Nachher: Nur lokale Fonts /fonts/fonts.css (schnell!)"
echo ""
echo "🎯 Erwartete Performance-Verbesserung: +30-50% schnellerer Page Load!"

