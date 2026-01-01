================================================================================
GOOGLE PAGESPEED PERFORMANCE-ANALYSE
================================================================================

1. FCP (First Contentful Paint) - Render-Blocking Ressourcen
--------------------------------------------------------------------------------

PROBLEM 1: CSS blockiert Rendering
  - style.css wird mit media='all' geladen
  - Blockiert First Contentful Paint
  - Lösung: media='print' für non-critical CSS oder inline critical CSS

PROBLEM 2: Google Analytics Script blockiert
  - gtag.js wird ohne async geladen (nur src hat async)
  - Inline dataLayer Script blockiert
  - Lösung: Script in <head> mit async, inline Script optimieren

2. TBT (Total Blocking Time) - JavaScript Performance
--------------------------------------------------------------------------------

PROBLEM 3: Große JavaScript-Dateien
  - global.js könnte groß sein
  - Cookie Consent Script
  - Lösung: Code splitting, lazy loading, defer

PROBLEM 4: Inline Scripts blockieren
  - Google Analytics inline Script
  - Lösung: In async function verschieben oder defer

3. LCP (Largest Contentful Paint) - Hero Image
--------------------------------------------------------------------------------

PROBLEM 5: Hero Image nicht optimiert
  - Fehlt fetchpriority='high'
  - Möglicherweise loading='lazy' (sollte eager sein)
  - Lösung: fetchpriority='high', loading='eager' oder weglassen

PROBLEM 6: CSS verzögert LCP
  - style.css wird spät geladen
  - Lösung: Critical CSS inline, rest async

4. CLS (Cumulative Layout Shift) - Layout Stabilität
--------------------------------------------------------------------------------

PROBLEM 7: Bilder ohne Dimensionen
  - Fehlende width/height Attribute
  - Lösung: Immer width und height angeben

PROBLEM 8: Font Loading
  - Google Fonts ohne font-display:swap
  - Lösung: &display=swap zu Font-URL hinzufügen

5. Veraltete API
--------------------------------------------------------------------------------

PROBLEM 9: -webkit-text-size-adjust
  - Veraltete CSS-Eigenschaft
  - Lösung: Entfernen, nur text-size-adjust verwenden

6. Weitere Performance-Probleme
--------------------------------------------------------------------------------

PROBLEM 10: Cookie Consent CSS im Body
  - Wird nach <body> geladen
  - Lösung: In <head> verschieben

PROBLEM 11: Fehlende Resource Hints
  - Keine preload für kritische Ressourcen
  - Lösung: preload für fonts, critical images

================================================================================
ZUSAMMENFASSUNG: 11 Hauptprobleme identifiziert
================================================================================