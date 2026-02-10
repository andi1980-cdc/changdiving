# Performance-Variabilität: Warum unterschiedliche Seiten verschiedene Werte erzielen

## ❓ Die Frage

Warum erzielen verschiedene Seiten unterschiedliche Werte bei Google PageSpeed Insights (LCP, INP, CLS, FCP, TTFB), obwohl der HTML-Code im gesamten Projekt konstant sein sollte?

## ✅ Die Antwort: Variabilität ist NORMAL

Auch bei identischer HTML-Struktur und CSS können verschiedene Seiten unterschiedliche Performance-Metriken haben. Dies liegt an mehreren Faktoren:

---

## 📊 Faktoren, die Performance beeinflussen

### 1. **LCP (Largest Contentful Paint)**

**Was ist LCP?**

- Das größte sichtbare Element beim Laden (meist Hero-Image oder Text)

**Warum variiert LCP?**

- ✅ **Unterschiedliche Hero-Images**: Verschiedene Dateigrößen (z.B. 60 KB vs. 120 KB)
- ✅ **LCP-Element ist unterschiedlich**: Manchmal ist es das Hero-Image, manchmal ein Text-Block
- ✅ **Bildgrößen variieren**: 600x400 vs. 1200x628 = unterschiedliche Ladezeiten
- ✅ **Anzahl der Bilder**: Mehr Bilder = mehr zu laden
- ✅ **fetchpriority='high'**: Nur auf Hero-Images (konsistent)

**Beispiel aus Ihrem Projekt:**

- `en/index.html`: 64 KB, 11 Images → höhere LCP-Wahrscheinlichkeit
- `en/posts/scuba-knowledge/buddy-system/index.html`: 29 KB, 3 Images → niedrigere LCP-Wahrscheinlichkeit

---

### 2. **CLS (Cumulative Layout Shift)**

**Was ist CLS?**

- Summe aller Layout-Verschiebungen während des Ladens

**Warum variiert CLS?**

- ✅ **Bilder ohne width/height**: Wir arbeiten daran, alle zu korrigieren
- ✅ **Font-Loading**: FOUT/FOIT (Font Flash) kann variieren
- ✅ **Third-party Scripts**: Trustindex Widget (nur auf manchen Seiten!)
- ✅ **Dynamischer Content**: Unterschiedliche Content-Mengen
- ✅ **Anzahl der Bilder**: Mehr Bilder = mehr potentielle Shifts

**Beispiel aus Ihrem Projekt:**

- `en/posts/marine-life-whale-shark/index.html`: Hat Trustindex Widget → potentiell höherer CLS
- `en/posts/scuba-knowledge/buddy-system/index.html`: Kein Trustindex → niedrigerer CLS

---

### 3. **INP (Interaction to Next Paint)**

**Was ist INP?**

- Zeit bis zum nächsten Frame nach einer Interaktion

**Warum variiert INP?**

- ✅ **JavaScript-Last**: Unterschiedliche Scripts pro Seite
- ✅ **Third-party Scripts**: Trustindex (nur manche Seiten!), Google Analytics (alle)
- ✅ **Event Handler**: Verschiedene interaktive Elemente
- ✅ **Content-Länge**: Mehr Content = mehr zu parsen

**Beispiel aus Ihrem Projekt:**

- `en/index.html`: 8 Scripts, größere Datei → potentiell höherer INP
- `en/contact/index.html`: Weniger Scripts, kleinere Datei → niedrigerer INP

---

### 4. **FCP (First Contentful Paint)**

**Was ist FCP?**

- Zeit bis zum ersten sichtbaren Element

**Warum variiert FCP?**

- ✅ **HTML-Größe**: 21 KB vs. 64 KB = unterschiedliche Parse-Zeiten
- ✅ **CSS-Größe**: Gleich (aber variiert durch verschiedene Selektoren)
- ✅ **Font-Loading**: Kann leicht variieren (Cache-Status)
- ✅ **Render-blocking Resources**: Gleich (CSS preload vorhanden)

**Beispiel aus Ihrem Projekt:**

- `en/index.html`: 64 KB → längerer FCP
- `en/posts/marine-life-whale-shark/index.html`: 21 KB → schnellerer FCP

---

### 5. **TTFB (Time To First Byte)**

**Was ist TTFB?**

- Zeit bis zum ersten Byte vom Server

**Warum variiert TTFB?**

- ⚠️ **Server-Response**: Variiert je nach Cache-Status
- ⚠️ **Netzwerk-Bedingungen**: Variieren zum Test-Zeitpunkt
- ⚠️ **Content-Length**: Größere Dateien = längere Übertragungszeit
- ⚠️ **Server-Last**: Variiert je nach Traffic

**WICHTIG**: TTFB ist primär server-seitig und nicht direkt durch HTML-Code kontrollierbar!

---

## 📈 Tatsächliche Unterschiede in Ihrem Projekt

### Dateigrößen:

- `en/index.html`: **64 KB** (11 Images)
- `en/posts/scuba-knowledge/buddy-system/index.html`: **29 KB** (3 Images)
- `en/posts/marine-life-whale-shark/index.html`: **21 KB** (5 Images + Trustindex)

### Third-party Scripts:

- **Trustindex Widget**: Nur auf manchen Seiten (z.B. whale-shark)
- **Google Analytics**: Auf allen Seiten (gleich)
- **Cookie Consent**: Auf allen Seiten (gleich)

### Anzahl der Bilder:

- Landing Page: 11 Images
- Blog Posts: 3-8 Images
- Kurs-Seiten: 7 Images

---

## ✅ Was bereits optimiert ist

1. **CSS Preload**: ✅ Implementiert auf allen Seiten
2. **Font Preload**: ✅ Implementiert auf allen Seiten
3. **Hero-Image fetchpriority**: ✅ Implementiert
4. **Local Fonts**: ✅ Roboto + Noto Sans Thai lokal gehostet
5. **Scripts defer/async**: ✅ Implementiert
6. **width/height Attribute**: ⚠️ In Arbeit (742 Bilder ohne Dimensionen identifiziert)

---

## 🎯 Was noch optimiert werden könnte

### 1. **Konsistenz bei Third-party Scripts**

- Trustindex nur auf Landing Page oder alle/nichts
- **Impact**: CLS, INP

### 2. **Bilder ohne Dimensionen**

- Alle 742 Bilder mit width/height versehen
- **Impact**: CLS (kritisch!)

### 3. **Bildgrößen optimieren**

- Responsive Images (srcset) für alle Bilder
- **Impact**: LCP, FCP

### 4. **HTML-Minimierung**

- HTML komprimieren/minimieren
- **Impact**: TTFB, FCP (klein, aber vorhanden)

### 5. **Critical CSS inline**

- Kritischer CSS inline einbetten
- **Impact**: FCP (klein, da preload vorhanden)

---

## 💡 Wichtige Erkenntnis

**Variabilität ist NORMAL und ERWARTBAR:**

1. ✅ **Verschiedene Seiten = verschiedene Content-Mengen**
   - Landing Page: 64 KB, 11 Images
   - Blog Post: 21-29 KB, 3-8 Images

2. ✅ **Verschiedene Bilder = verschiedene Ladezeiten**
   - Hero-Images: 60-120 KB
   - Content-Images: 20-80 KB

3. ✅ **Test-Bedingungen variieren**
   - Netzwerk-Geschwindigkeit (Throttling)
   - Server-Last
   - Cache-Status

4. ✅ **Third-party Scripts variieren**
   - Trustindex: Nur manche Seiten
   - Google Analytics: Alle Seiten

---

## 📊 Fazit

**Ihre HTML-Struktur ist konsistent**, aber **Performance variiert aus guten Gründen:**

- ✅ Unterschiedliche Content-Mengen
- ✅ Unterschiedliche Bildgrößen/-anzahl
- ✅ Unterschiedliche Third-party Scripts
- ✅ Unterschiedliche Test-Bedingungen

**Was Sie tun können:**

1. ✅ Alle Bilder mit width/height versehen (CLS)
2. ✅ Responsive Images implementieren (LCP)
3. ✅ Trustindex konsistent einsetzen oder entfernen (CLS, INP)
4. ⚠️ Server-seitige Optimierung (TTFB)

**Was Sie akzeptieren sollten:**

- Variabilität zwischen verschiedenen Seiten ist normal
- Einzelne Test-Ergebnisse können variieren (Netzwerk, Cache)
- 100% identische Werte sind unrealistisch

---

_Zuletzt aktualisiert: 2025-12-30_
