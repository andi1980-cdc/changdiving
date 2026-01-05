# Analyse: Bilder ohne width/height Attribute

## 📊 Zusammenfassung

**GESAMT: 1091 Bilder ohne width/height Attribute**
- **271 einzigartige Bilddateien**
- **356 betroffene HTML-Dateien**

---

## 📐 Kategorisierung nach Größen

### 1. **HERO (2580x1460)** - 4 Bilder
- **Attribut:** `width="2580" height="1460"`
- **Verwendung:** Hero-Header-Bilder (große Bilder)
- **Beispiele:**
  - `img/posts/gulf-vs-andemann_big.webp`
  - `img/posts/ocean-climate_big.webp`
  - `img/posts/blacktip-reef-shark_big.webp`

### 2. **STANDARD (600x400)** - 112 Bilder
- **Attribut:** `width="600" height="400"`
- **Verwendung:** Standard Content-Bilder
- **Beispiele:**
  - `img/posts/dive-boat_small.webp`
  - `img/posts/padi-vs-sdi-tdi_small.webp`
  - `img/posts/diving-emergency_small.webp`

### 3. **THUMBNAILS (200x200)** - 580 Bilder
- **Attribut:** `width="200" height="200"`
- **Verwendung:** Marine Life Seite (Tabelle mit Fisch-Bildern)
- **Hinweis:** Im CSS wird `width="120"` gesetzt, aber das Bild ist 200x200
- **Beispiele:**
  - `img/posts/whale-shark_small.jpg`
  - `img/posts/blacktip-reef-shark.jpg`
  - `img/posts/grey-reef-shark.jpg`
  - `img/posts/clarks-anemonefish.jpg`
  - Alle anderen Marine Life Thumbnails

### 4. **LOGOS** - 356 Bilder
- **logo_cdc_white.webp:** `width="100" height="100"` (tatsächlich 100x100)
- **logo_cdc.webp:** `width="500" height="492"` (tatsächlich 500x492)
- **Verwendung:** Logo-Bilder auf allen Seiten

### 5. **CUSTOM** - 39 Bilder
Verschiedene Größen, die individuell behandelt werden müssen:
- **1024x1024:** 12 Bilder (z.B. `speedboat-recovery-*.webp`)
- **800x495:** 12 Bilder (z.B. `boat-overview-top.png.webp`)
- **1200x628:** 3 Bilder (z.B. `see_turtle_htms_chang.webp`)
- **800x600:** 6 Bilder (z.B. `speedboat-recovery-*-800x600.webp`)
- **1600x200:** 3 Bilder (z.B. `fun_dive_header.webp`)
- **723x91:** 3 Bilder (z.B. `dan-shortterm-digitalbanner.jpg.webp`)

---

## 🎯 Empfohlene Vorgehensweise

### Phase 1: Hauptkategorien (einfach)
1. ✅ **Hero (2580x1460)** - 4 Bilder
2. ✅ **Standard (600x400)** - 112 Bilder
3. ✅ **Thumbnails (200x200)** - 580 Bilder

### Phase 2: Logos (einfach)
4. ✅ **Logos** - 356 Bilder
   - `logo_cdc_white.webp`: 100x100
   - `logo_cdc.webp`: 500x492

### Phase 3: Custom (individuell)
5. ⚠️ **Custom** - 39 Bilder
   - Müssen einzeln behandelt werden

---

## 📋 Detaillierte Liste

Die vollständige Analyse ist in `missing_image_dimensions.json` gespeichert.

---

## 🛠️ Nächste Schritte

1. **Script erstellen**, das automatisch width/height Attribute hinzufügt
2. **Nach Kategorien vorgehen** (Hero → Standard → Thumbnails → Logos → Custom)
3. **Testen** auf einigen Beispiel-Seiten
4. **Anwenden** auf alle HTML-Dateien

---

*Erstellt: 2025-12-30*

