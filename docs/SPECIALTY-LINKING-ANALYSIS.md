# Specialty-Verknüpfungsstruktur – Analyse & Empfehlungen

**Stand:** Januar 2025  
**Ziel:** Zertifizierte Taucher sollen nach Anfänger- und Fortgeschrittenenkursen leicht Specialty-Kurse entdecken können.

---

## 1. Aktuelle Verknüpfungsstruktur

### 1.1 Kurs-Hierarchie (Übersicht)

```
/courses/                    → Hauptindex (alle Kategorien im Submenu)
├── beginner-courses/        → Try Dive, Scuba Diver, Open Water
├── advanced-courses/        → Refresher, AOWD, Rescue, Master Scuba Diver
├── speciality/              → Specialty-Übersicht (alle 9 Specialties)
├── professional-courses/    → Divemaster, Instructor
└── technical-diving-courses/ → Intro-to-Tech, Advanced Nitrox, Advanced Wreck
```

### 1.2 Links ZU /courses/speciality/

| Quelle | Kontext |
|--------|---------|
| `courses/index.html` | Submenu |
| `courses/beginner-courses/` | Submenu |
| `courses/advanced-courses/` | Submenu + 3× im Intro |
| `courses/professional-courses/` | Submenu |
| `courses/technical-diving-courses/` | Submenu |
| `courses/master-scuba-diver/` | Im Text |
| `advanced/index.html` | Deep-Wreck-Nitrox, Nitrox, Wreck |
| `how-to-specialty-courses/` | CTA |
| `how-to-solo-diver/` | CTA |
| `straight-talk/solo-diver/` | CTA |
| `how-to-specialty-courses/` | CTA |
| `how-to-advanced-course/` | CTA |
| `how-to-master-scuba-diver/` | CTA |
| `beginner-guide/` | Wreck/Night |
| `deep-diving/` (tips) | Deep Diver |
| `which-course/` | CTA |
| `prices/index.html` | 2× |
| `fun-dives/` | how-to-specialty |

### 1.3 Links VON specialty-Seiten

| Specialty-Seite | Verlinkt zu |
|-----------------|-------------|
| **speciality/ (Übersicht)** | beginner-courses, how-to-specialty-courses, alle 9 Specialties, technical |
| **solo-diver** | navigation, sidemount, advanced-courses |
| **sidemount** | solo-diver |
| **nitrox-diver** | advanced-nitrox, nitrox-blender |
| **deep-diver** | how-to-specialty-courses |
| **wreck-diver** | how-to-specialty-courses |
| **night** | how-to-specialty-courses |
| **navigation** | (keine internen Kurslinks) |
| **search-recovery** | navigation |
| **deep-wreck-nitrox** | deep-diver, wreck-diver, nitrox-diver, nitrox-blender |

---

## 2. Identifizierte Lücken

### 2.1 Open Water Diver – keine Specialty-Verlinkung

**Problem:** Auf der Open-Water-Seite wird nur „advanced courses“ oder „fun dives“ erwähnt. Viele OWD-Absolventen könnten direkt eine Specialty (z.B. Nitrox, Navigation) machen – das wird nicht kommuniziert.

**Aktuell (Zeile ~673):**
```html
or <a href="/en/courses/advanced/">advanced courses</a> afterwards
```

**Empfehlung:** Zusätzlich „or specialty courses“ als Option nennen:
```html
or <a href="/en/courses/advanced/">advanced courses</a> or
<a href="/en/courses/speciality/">specialty courses</a> afterwards
```

**Sprachen:** EN, DE, TH

---

### 2.2 Beginner-courses – nur Submenu

**Problem:** Im Fließtext gibt es keinen Hinweis auf „Was kommt als Nächstes?“ – weder Advanced noch Specialty. Der Abschnitt nach Open Water beschreibt nur Try Dive, Scuba Diver, OWD.

**Empfehlung:** Einen Absatz ergänzen:
> Nach deiner ersten Zertifizierung: Erweitere deine Skills mit unseren [Advanced-Kursen](/en/courses/advanced-courses/) oder wähle eine [Specialty](/en/courses/speciality/) wie Nitrox oder Navigation – viele Specialties sind direkt nach Open Water möglich.

**Sprachen:** EN, DE, TH

---

### 2.3 Einzelne Specialty-Seiten – kein Link zur Specialty-Übersicht

**Problem:** Specialty-Seiten verlinken meist nur auf `how-to-specialty-courses`, nicht auf `/courses/speciality/`. Zertifizierte Taucher, die z.B. Sidemount oder Night lesen, sehen nicht „Alle Specialties anzeigen“.

| Seite | Hat Link zu /speciality/? | Hat Link zu how-to-specialty? |
|-------|---------------------------|------------------------------|
| solo-diver | ❌ | ❌ (hat CTA zu speciality auf how-to/straight-talk) |
| sidemount | ❌ | ✅ |
| nitrox-diver | ❌ | ✅ |
| deep-diver | ❌ | ✅ |
| wreck-diver | ❌ | ✅ |
| night | ❌ | ✅ |
| navigation | ❌ | ❌ |
| search-recovery | ❌ | ❌ |

**Empfehlung:** Auf allen Specialty-Seiten einen CTA-Block ergänzen (wie bei solo-diver auf how-to/straight-talk):
> Curious about other specialties? See [all specialty courses](/en/courses/speciality/) we offer.

**Betroffene Seiten:** sidemount, nitrox-diver, deep-diver, wreck-diver, night, navigation, search-recovery (solo-diver hat bereits auf how-to/straight-talk den CTA, aber nicht auf der Kurs-Seite selbst)

**Hinweis:** solo-diver hat auf der Kurs-Seite keinen „Alle Specialties“-CTA – nur auf how-to und straight-talk.

---

### 2.4 Specialty-Übersicht – kein Link zu Advanced

**Problem:** Die Specialty-Seite verlinkt zu `beginner-courses` (Open Water), erwähnt aber nicht explizit „Advanced Open Water“ als typischen Vorläufer.

**Aktuell:** „Many specialties can be taken right after your Open Water Diver“

**Empfehlung:** Zusätzlich verlinken:
> Oft sinnvoll nach dem [Advanced Open Water](/en/courses/advanced/) – oder direkt nach Open Water für viele Specialties.

**Sprachen:** EN, DE, TH

---

### 2.5 Solo-diver Kurs-Seite – fehlender „Alle Specialties“-CTA

**Problem:** how-to-solo-diver und straight-talk/solo-diver haben den CTA „Curious about other specialties? See all specialty courses“. Die eigentliche Kurs-Seite `courses/solo-diver/` hat diesen CTA nicht.

**Empfehlung:** Einen CTA-Block vor dem Download-Bereich oder nach dem „Book now“-Button einfügen (analog zu how-to/straight-talk).

---

## 3. Zusammenfassung der Empfehlungen

| Priorität | Maßnahme | Dateien |
|-----------|----------|---------|
| **Hoch** | Open Water: Specialty als Option ergänzen | open-water-diver (EN/DE/TH) |
| **Hoch** | Alle Specialty-Seiten: „Alle Specialties“-CTA | solo-diver, sidemount, nitrox, deep, wreck, night, navigation, search-recovery (EN/DE/TH) |
| **Mittel** | Beginner-courses: „Was kommt danach?“-Absatz | beginner-courses (EN/DE/TH) |
| **Mittel** | Specialty-Übersicht: Advanced verlinken | speciality (EN/DE/TH) |

---

## 4. Idealer Nutzerfluss (nach Implementierung)

```
Open Water Diver
    ├──→ Advanced Open Water
    │         └──→ Specialties (Nitrox, Deep, Wreck, …)
    └──→ Specialties (viele direkt nach OWD möglich)
              └──→ Weitere Specialties (via CTA auf jeder Specialty-Seite)

Beginner-courses
    └──→ Klarer Hinweis: Advanced ODER Specialty als nächster Schritt

Specialty-Seite (z.B. Sidemount)
    └──→ CTA: "Alle Specialty-Kurse anzeigen" → /courses/speciality/
```

---

## 5. Technische Hinweise

- URL-Schreibweise: `speciality` (UK) in allen Pfaden
- Alle Änderungen in EN, DE, TH umsetzen
- CTA-Text sollte konsistent sein (wie bei solo-diver how-to/straight-talk)
