# Schema Templates für verbleibende Dive Sites

## Verwendung:
Diese Templates für schnelles Copy-Paste in die verbleibenden Dive Sites.
Ersetze [SITE_NAME], [DEPTH], etc. mit den spezifischen Werten.

---

## Template 1: Reef Dive Site (für alle Hin-Sites)

### BreadcrumbList Schema
```json
<!-- BreadcrumbList Schema -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "[HOME_LABEL]",
        "item": "https://changdiving.com/[LANG]/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "[DIVE_SITES_LABEL]",
        "item": "https://changdiving.com/[LANG]/dive-sites/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "[SITE_NAME]",
        "item": "https://changdiving.com/[LANG]/dive-sites/[SITE_SLUG]/"
      }
    ]
  }
</script>
```

### FAQ Schema - Reef Sites
```json
<!-- FAQ Schema -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What certification level do I need for [SITE_NAME]?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "[SITE_NAME] is suitable for [LEVEL] divers with depths ranging from [DEPTH]. It's perfect for [USE_CASE]."
        }
      },
      {
        "@type": "Question",
        "name": "What marine life can I see at [SITE_NAME]?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "[SITE_NAME] features [MARINE_LIFE]. The reef ecosystem attracts diverse underwater species."
        }
      },
      {
        "@type": "Question",
        "name": "How deep is [SITE_NAME]?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The depth ranges from [MIN_DEPTH] to [MAX_DEPTH] meters, making it [ACCESSIBILITY_DESC]."
        }
      },
      {
        "@type": "Question",
        "name": "Is [SITE_NAME] suitable for beginners?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "[YES/NO]. [REASONING]"
        }
      },
      {
        "@type": "Question",
        "name": "What makes [SITE_NAME] special?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "[UNIQUE_FEATURES] make [SITE_NAME] a [DESCRIPTION]."
        }
      }
    ]
  }
</script>
```

---

## Quick Reference: Translations

### Breadcrumb Labels:
**EN:** Home | Dive Sites
**DE:** Startseite | Tauchplätze
**TH:** หน้าหลัก | จุดดำน้ำ

### FAQ Question Templates:

#### EN:
- "What certification level do I need for..."
- "What marine life can I see at..."
- "How deep is..."
- "Is ... suitable for beginners?"
- "What makes ... special?"

#### DE:
- "Welche Zertifizierung brauche ich für..."
- "Welche Meeresbewohner kann ich an ... sehen?"
- "Wie tief ist..."
- "Ist ... für Anfänger geeignet?"
- "Was macht ... besonders?"

#### TH:
- "ต้องมีใบรับรองระดับไหนถึงจะดำน้ำที่...ได้?"
- "จะพบสัตว์ทะเลอะไรบ้างที่...?"
- "...ลึกเท่าไหร่?"
- "...เหมาะสำหรับนักดำน้ำมือใหม่ไหม?"
- "อะไรทำให้...พิเศษ?"

---

## Sites Data Quick Reference

### Koho Maru 5
- Type: Wreck
- Depth: 22m
- Level: Advanced
- Special: Japanese WWII cargo vessel

### Phutthayotfa Chulalok Wreck
- Type: Wreck
- Depth: 28m
- Level: Advanced
- Special: Thai naval vessel, artificial reef

### Hin Luk Bat
- Type: Reef/Pinnacle
- Depth: 5-22m
- Level: All levels
- Special: Pinnacle with swim-throughs

### Hin Pray Nam
- Type: Reef
- Depth: 8-20m
- Level: All levels
- Special: Colorful soft corals

### Hin Raab North
- Type: Reef
- Depth: 8-18m
- Level: Beginners+
- Special: Easy reef, good vis

### Hin Raab South
- Type: Reef
- Depth: 8-18m
- Level: Beginners+
- Special: Sister site to North

### Hin Rua Tek
- Type: Reef
- Depth: 12-20m
- Level: OW+
- Special: Rock formations

### Hin Sam Sao
- Type: Reef
- Depth: 10-18m
- Level: All levels
- Special: Three pinnacles

### Secret Reef
- Type: Reef
- Depth: 8-16m
- Level: All levels
- Special: Hidden gem, less crowded

---

**Diese Templates sparen Zeit beim Erstellen der restlichen Schemas!**

