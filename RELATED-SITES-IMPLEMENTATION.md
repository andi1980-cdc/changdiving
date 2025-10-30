# Related Dive Sites - Implementation Guide

## Progress: 7/39 Dateien fertig

### ✅ Completed Files:
- HTMS Chang Wreck (EN/DE/TH) ✅
- T11 Wreck (EN/DE/TH) ✅
- Koho Maru 5 (EN) ✅
- Hin Luk Bat (EN) ✅ (Demo)

---

## Remaining Files: 32

### Wracks (5 files remaining):
- [ ] Koho Maru 5 (DE/TH)
- [ ] Phutthayotfa Wreck (EN/DE/TH)

### Riffe - Advanced (3 files):
- [ ] Koh Rang Pinnacle (EN/DE/TH)

### Riffe - Intermediate (12 files):
- [ ] Blueberry Hill (EN/DE/TH)
- [ ] Secret Reef (EN/DE/TH)
- [ ] Hin Raab North (EN/DE/TH)
- [ ] Hin Raab South (EN/DE/TH)

### Riffe - Beginner (11 files):
- [ ] Hin Luk Bat (DE/TH) - EN already done
- [ ] Hin Pray Nam (EN/DE/TH)
- [ ] Hin Rua Tek (EN/DE/TH)
- [ ] Hin Sam Sao (EN/DE/TH)

---

## Implementation Pattern

### Location in File:
Insert BEFORE `</div>\n    </main>` (end of dive-site-box)

### Search String:
```
        </ul>
      </div>
    </main>

    <!-- Cookie Consent Banner XX -->
```

---

## Templates by Category

### 🚢 WRACK-TEMPLATE (zeigt andere Wracks)

#### Koho Maru 5 & Phutthayotfa:
Shows: HTMS Chang, T11, [other wreck not itself]

**English:**
```html
        <hr />

        <!-- Related Dive Sites Section -->
        <h2 style="
            margin-top: 50px;
            font-size: 32px;
            background: linear-gradient(to right, #0077b6, #c0c0c0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: bold;
          ">
          More Wreck Dives
        </h2>
        <p>
          Explore more wreck diving adventures around Koh Chang. These historic wrecks offer fascinating underwater exploration and abundant marine life.
        </p>

        <div class="row">
          <a href="/en/dive-sites/htms-chang-wreck/" class="three columns">
            <img src="/img/dive-sites/htms-chang-wreck_header_small.webp" alt="HTMS Chang Wreck" width="600" height="400" loading="lazy" />
            <div class="excerpt">
              <h3>⚓ HTMS Chang Wreck</h3>
              <p style="min-height: 60px">Thailand's most famous wreck dive! (Max depth: 31m)</p>
            </div>
          </a>
          <a href="/en/dive-sites/t11-wreck/" class="three columns">
            <img src="/img/dive-sites/t11-wreck_header_small.webp" alt="T11 Wreck" width="600" height="400" loading="lazy" />
            <div class="excerpt">
              <h3>🚢 T11 Wreck</h3>
              <p style="min-height: 60px">Historic shipwreck with intact structure. (Max depth: 18m)</p>
            </div>
          </a>
          <a href="/en/dive-sites/[OTHER-WRECK]/" class="three columns">
            <!-- Add 3rd wreck here -->
          </a>
          <a href="/en/dive-sites/" class="three columns">
            <img src="/img/dive-sites/dive-site-map_small.webp" alt="View all sites" width="600" height="400" loading="lazy" />
            <div class="excerpt">
              <h3>🗺️ View All Sites</h3>
              <p style="min-height: 60px">Explore all 13 dive sites around Koh Chang.</p>
            </div>
          </a>
        </div>
```

**Deutsch:**
- Titel: "Weitere Wracktauchgänge"
- Text: "Entdecke weitere Wracktauch-Abenteuer rund um Koh Chang..."
- Links: `/de/dive-sites/...`

**Thai:**
- Titel: "จุดดำน้ำเรืออับปางอื่นๆ"
- Text: "สำรวจการผจญภัยดำน้ำที่เรืออับปางรอบเกาะช้าง..."
- Links: `/th/dive-sites/...`

---

### 🪸 RIFF-TEMPLATE (zeigt ähnliche Riffe)

#### Beginner Reefs (Hin Luk Bat, Hin Pray Nam, Hin Rua Tek, Hin Sam Sao):
Shows: 3 other beginner/intermediate reefs

**Example for Hin Pray Nam (EN):**
```html
        <hr />

        <h2 style="...gradient...">Similar Dive Sites</h2>
        <p>Explore more beginner-friendly reef dives around Koh Chang...</p>

        <div class="row">
          <a href="/en/dive-sites/hin-luk-bat/" class="three columns">
            <img src="/img/dive-sites/hin-luk-bat_header_small.webp" alt="Hin Luk Bat" width="600" height="400" loading="lazy" />
            <div class="excerpt">
              <h3>🐠 Hin Luk Bat</h3>
              <p style="min-height: 60px">Koh Chang's most popular dive site with coral walls. (Max depth: 22m)</p>
            </div>
          </a>
          <a href="/en/dive-sites/hin-sam-sao/" class="three columns">
            <!-- Hin Sam Sao -->
          </a>
          <a href="/en/dive-sites/hin-rua-tek/" class="three columns">
            <!-- Hin Rua Tek -->
          </a>
          <a href="/en/dive-sites/" class="three columns">
            <!-- View All -->
          </a>
        </div>
```

#### Intermediate Reefs (Blueberry Hill, Secret Reef, Hin Raab N/S):
Shows: Other intermediate + maybe 1 advanced reef

#### Advanced Reefs (Koh Rang Pinnacle):
Shows: Intermediate/advanced reefs

---

## Related Sites Mapping

### Wracks → Wracks:
- HTMS Chang → T11, Koho Maru 5, Phutthayotfa
- T11 → HTMS Chang, Koho Maru 5, Phutthayotfa
- Koho Maru 5 → HTMS Chang, T11, Phutthayotfa
- Phutthayotfa → HTMS Chang, T11, Koho Maru 5

### Beginner Reefs → Beginner/Easy Intermediate:
- Hin Luk Bat → Hin Sam Sao, Secret Reef, Hin Pray Nam
- Hin Pray Nam → Hin Luk Bat, Hin Sam Sao, Hin Rua Tek
- Hin Rua Tek → Hin Luk Bat, Hin Sam Sao, Hin Pray Nam
- Hin Sam Sao → Hin Luk Bat, Hin Pray Nam, Hin Rua Tek

### Intermediate Reefs → Intermediate + 1 Advanced:
- Blueberry Hill → Koh Rang Pinnacle, Secret Reef, Hin Raab South
- Secret Reef → Blueberry Hill, Hin Luk Bat, Hin Raab South
- Hin Raab North → Hin Raab South, Blueberry Hill, Koh Rang Pinnacle
- Hin Raab South → Hin Raab North, Blueberry Hill, Secret Reef

### Advanced → Intermediate/Advanced:
- Koh Rang Pinnacle → Hin Raab North, Blueberry Hill, Secret Reef

---

## SEO Benefits

✅ Internal Linking zwischen allen Dive Sites
✅ Bessere User Experience (Entdecken ähnlicher Sites)
✅ Längere Session Duration
✅ Niedrigere Bounce Rate
✅ Bessere Crawlability für Google

---

## Next Steps

1. ✅ Complete remaining wreck files (5)
2. ✅ Add to all reef files (26)
3. ✅ Test auf verschiedenen Bildschirmgrößen
4. ✅ Validate HTML
5. ⏳ Generate new sitemap

Status: 7/39 completed (18%)

