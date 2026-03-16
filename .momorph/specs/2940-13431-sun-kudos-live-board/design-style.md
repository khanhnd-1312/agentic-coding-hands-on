# Design Style: Sun* Kudos - Live Board

**Frame ID**: `2940:13431`
**Frame Name**: `Sun* Kudos - Live board`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/2940:13431
**Extracted At**: 2026-03-13

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-bg-primary | #00101A | 100% | Page background, main dark background |
| --color-bg-header | #101417 | 80% | Top navigation bar (semi-transparent) |
| --color-bg-card | #FFF8E1 | 100% | Kudos card backgrounds (warm cream) |
| --color-bg-card-alt | #FFF3C6 | 100% | Expanded/alternate card backgrounds |
| --color-border-gold | #998C5F | 100% | Border accents (CSS var: --Details-Border) |
| --color-separator | #2E3940 | 100% | Dividers, horizontal rules in sidebar |
| --color-accent-gold | #FFEA9E | 100% | Section titles, hero text accent, sidebar titles |
| --color-accent-tan | #DBD1C1 | 100% | Large decorative "KUDOS" text |
| --color-text-white | #FFFFFF | 100% | Navigation links, card text, subtitles |
| --color-text-muted | #999999 | 100% | Timestamps, secondary info, time labels |
| --color-heart-red | #D4271D | 100% | Heart icon (active), red dot indicator, hashtag highlight |
| --color-highlight-pink | #F17676 | 100% | Spotlight highlighted names |
| --color-black | #000000 | varies | Navigation arrows (carousel), overlay backgrounds |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing | Usage |
|------------|-------------|------|--------|-------------|----------------|-------|
| --text-hero-logo | SVN-Gotham | 139.78px | 400 | 34.95px | -13% | Large "KUDOS" logo text |
| --text-heading-xl | Montserrat | 57px | 700 | 64px | -0.25px | "HIGHLIGHT KUDOS" section title |
| --text-heading-lg | Montserrat | 36px | 700 | 44px | 0 | Hero subtitle "He thong ghi nhan va cam on" |
| --text-heading-md | Montserrat | 32px | 700 | 40px | 0 | Spotlight "388 KUDOS" counter |
| --text-heading-sm | Montserrat | 24px | 700 | 32px | 0 | "Sun* Annual Awards 2025" sub-headers |
| --text-sidebar-label | Montserrat | 22px | 700 | 28px | 0 | Sidebar stats labels (e.g., "So Kudos ban nhan duoc:") |
| --text-body | Montserrat | 20px | 700 | 32px | 0 | Kudos message body content |
| --text-nav | Montserrat | 16px | 700 | 24px | 0.15px | Navigation links, button text |
| --text-nav-sm | Montserrat | 14px | 700 | 20px | 0.1px | Secondary navigation items |
| --text-footer | Montserrat Alternates | 16px | 700 | 24px | 0% | Footer copyright text |
| --text-spotlight-name-lg | Montserrat | 11.34px | 700 | 6.36px | 0.208px | Spotlight large names |
| --text-spotlight-name-md | Montserrat | 10.92px | 500 | 16.38px | 0.102px | Spotlight medium names |
| --text-spotlight-name-sm | Montserrat | 10.21px | 700 | 6.36px | 0.208px | Spotlight smaller names |
| --text-spotlight-name-xs | Montserrat | 7.94px | 700 | 6.36px | 0.208px | Spotlight smallest names |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-page-x | 144px | Page horizontal padding (desktop) |
| --spacing-section-gap | 120px | Gap between major sections |
| --spacing-section-inner | 64px | Gap within sections (e.g., header to content) |
| --spacing-card-gap | 40px | Gap between cards, header to list |
| --spacing-sidebar-gap | 80px | Gap between main content and sidebar |
| --spacing-nav-gap | 24px | Navigation item spacing |
| --spacing-nav-actions | 16px | Navigation action button spacing |
| --spacing-header-y | 12px | Header vertical padding |
| --spacing-hero-top | 96px | Top padding of main content area |
| --spacing-footer-x | 90px | Footer horizontal padding |
| --spacing-footer-y | 40px | Footer vertical padding |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-sm | 4px | Small elements, tags |
| --radius-md | 8px | Cards, input fields |
| --radius-lg | 24px | Pill-shaped buttons, search input |
| --radius-full | 100px | Circular avatars, round buttons |
| --border-gold | 1px solid #998C5F | Spotlight border, accent buttons |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-none | none | Cards use flat design on dark bg |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 1440px | Desktop design width |
| height | 5862px | Full page height |
| background | #00101A | Dark navy/black |
| content-padding-x | 144px | Horizontal padding for content sections |

### Grid/Flex Layout

| Property | Value | Notes |
|----------|-------|-------|
| Main layout | flex column | Vertical stack of sections |
| Section gap | 120px | Between major sections |
| All Kudos layout | flex row | Main content + sidebar |
| All Kudos gap | 80px | Between feed and sidebar |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────────────────────────┐
│  Page (w: 1440px, bg: #00101A)                                │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Hero Banner (w: 1440, h: 512) - Background image + gradient│
│  │  ┌──────────────────────────────────────────────────────┐│  │
│  │  │  Header (w: 1440, h: 80, px: 144, bg: #101417/80%)  ││  │
│  │  │  [Logo 52x48] [Nav gap:24] ... [Lang][Bell][Avatar]  ││  │
│  │  └──────────────────────────────────────────────────────┘│  │
│  │  "Hệ thống ghi nhận và cảm ơn"                          │  │
│  │  KUDOS (large decorative logo)                            │  │
│  │  [Search pill input] [Search profile button]              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Highlight Section (px: 0, gap: 40)                       │  │
│  │  "Sun* Annual Awards 2025" / "HIGHLIGHT KUDOS"            │  │
│  │  [Hashtag ▼] [Phong ban ▼]                                │  │
│  │  ┌─[◀]──[Card 1]──[Card 2]──[Card 3]──[Card 4]──[▶]─┐  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  [◀] 2/5 [▶]                                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Spotlight Section (px: 144)                               │  │
│  │  "Sun* Annual Awards 2025" / "SPOTLIGHT BOARD"             │  │
│  │  ┌──────────────────────────────────────────────────────┐│  │
│  │  │  Spotlight Canvas (w: 1157, h: 548, border: #998C5F) ││  │
│  │  │  "388 KUDOS" [search] [pan/zoom]                     ││  │
│  │  │  Word cloud of names                                  ││  │
│  │  └──────────────────────────────────────────────────────┘│  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  All Kudos Section (px: 144, gap: 40)                      │  │
│  │  "Sun* Annual Awards 2025" / "ALL KUDOS"                   │  │
│  │  ┌─────────────────────────┐  ┌────────────────────────┐  │  │
│  │  │  Kudos Feed (flex col)  │  │  Sidebar Stats         │  │  │
│  │  │  ┌──[KUDO Post Card]──┐ │  │  Kudos nhận: 25        │  │  │
│  │  │  │ Sender → Receiver  │ │  │  Kudos gửi: 25         │  │  │
│  │  │  │ Time               │ │  │  Tim nhận: 25          │  │  │
│  │  │  │ Message content    │ │  │  Secret Box mở: 25     │  │  │
│  │  │  │ [images gallery]   │ │  │  Secret Box chưa: 25   │  │  │
│  │  │  │ #tags              │ │  │  [Mở Secret Box 🎁]   │  │  │
│  │  │  │ ❤ 1000  Copy Link │ │  │                        │  │  │
│  │  │  └────────────────────┘ │  │  10 SUNNER NHẬN QUÀ    │  │  │
│  │  │  [More cards...]        │  │  MỚI NHẤT              │  │  │
│  │  └─────────────────────────┘  │  [Avatar] Name - desc  │  │  │
│  │                          80px  │  [Avatar] Name - desc  │  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Footer (px: 90, py: 40)                                   │  │
│  │  [Nav links gap: 80] "Bản quyền thuộc về Sun* © 2025"     │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Header Navigation Bar

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13433 | - |
| width | 1440px | `width: 100%` |
| height | 80px | `height: 80px` |
| padding | 12px 144px | `padding: 12px 144px` |
| background | rgba(16, 20, 23, 0.8) | `background-color: rgba(16, 20, 23, 0.8)` |
| display | flex row | `display: flex; flex-direction: row` |
| gap | 238px | `gap: 238px` |
| align-items | center | `align-items: center` |
| justify-content | space-between | `justify-content: space-between` |
| position | absolute | `position: absolute; top: 0; z-index: 1` |

---

### Hero Banner (KV Kudos)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13432 | - |
| width | 1440px | `width: 100%` |
| height | 512px | `height: 512px` |
| background | Image with gradient overlay | `background: url(...) center/cover` |
| gradient | 25deg, #00101A 14.74% → transparent 47.8% | `linear-gradient(25deg, #00101A 14.74%, transparent 47.8%)` |

---

### Search Input (Button ghi nhan)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13449 | - |
| width | fill | `width: 100%; max-width: ~600px` |
| height | 72px | `height: 72px` |
| border-radius | 100px | `border-radius: 100px` (pill shape) |
| background | transparent | `background: transparent` |
| border | 1px solid #998C5F | `border: 1px solid var(--border-gold)` |
| placeholder | "Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?" | - |
| font | Montserrat 16px | `font-size: 16px` |
| color | #FFFFFF | `color: white` |

**States:**
| State | Changes |
|-------|---------|
| Default | border: 1px solid #998C5F |
| Hover | cursor: pointer |
| Focus | border-color: #FFEA9E (gold accent) |

---

### Highlight Kudos Card

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13465 | - |
| width | ~320px per card | `width: calc((100% - gaps) / visible)` |
| background | gradient overlay on image | - |
| border-radius | 8px | `border-radius: 8px` |

**Carousel visual behavior (center-focus):**
| State | Changes |
|-------|---------|
| Active (center) | Full opacity, scale: 1, z-index: 2, interactive |
| Adjacent (sides) | Reduced opacity (~0.5), scale: 0.9, z-index: 1, dimmed, non-interactive |

**Sub-components:**
- Sender info: Avatar (circle, 100px radius) + Name + Department + Star count (hoa thị)
- Arrow icon: Direction indicator sender → receiver (non-interactive)
- Receiver info: Same as sender
- Timestamp: Montserrat 14px, #999999, format "HH:mm - MM/DD/YYYY"
- Content: 3-line truncation with "..." (click opens detail)
- Hashtags: Red accent text (#D4271D), max 5 on 1 line, clickable (filter shortcut)
- Actions bar: Heart count + Copy Link + "Xem chi tiết"

---

### Carousel Navigation Buttons

| Property | Value | CSS |
|----------|-------|-----|
| **Node IDs** | 2940:13468 (next), 2940:13470 (prev) | - |
| size | 40x40px | `width: 40px; height: 40px` |
| shape | circle | `border-radius: 100px` |
| background | transparent / dark | - |
| icon | Chevron | SVG icon |

**States:**
| State | Changes |
|-------|---------|
| Default | opacity: 1 |
| Hover | opacity: 0.8, cursor: pointer, scale: 1.05 |
| Disabled | opacity: 0.3, cursor: not-allowed |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |

---

### Pagination Indicator

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13471 | - |
| display | flex row | `display: flex; align-items: center` |
| content | "2/5" | Current/Total format |
| color | #FFFFFF | `color: white` |
| font | Montserrat 32px 700 | `font-size: 32px; font-weight: 700` |

---

### Spotlight Board

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:14174 | - |
| width | 1157px | `width: calc(100% - 2 * 144px)` |
| height | 548px | `height: 548px` |
| border | 1px solid #998C5F | `border: 1px solid var(--border-gold)` |
| background | Dark with overlaid name clouds | - |
| header | "388 KUDOS" + search + pan/zoom controls | - |

---

### Kudos Post Card (All Kudos)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 3127:21871 | - |
| width | fill | `width: 100%` |
| background | #FFF8E1 | `background-color: #FFF8E1` |
| border-radius | 8px | `border-radius: 8px` |
| padding | ~24px | `padding: 24px` |

**Sub-components:**
- Sender block (C.3.1): Avatar + Name + Dept + Stars
- Arrow icon (C.3.2): "sent" direction indicator
- Receiver block (C.3.3): Avatar + Name + Dept + Stars
- Hashtag badge (D.4): Category tag (e.g., "IDOL GIOI TRE")
- Timestamp (C.3.4): "10:00 - 10/30/2025", color: #999999
- Content (C.3.5): Max 5 lines with "..." truncation
- Image gallery (C.3.6): Horizontal row of square thumbnails, max 5
- Hashtag line (C.3.7): "#Dedicated #Inspring..." max 1 line
- Action bar (C.4): Heart button + Copy Link button

---

### Heart Button

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I3127:21871;256:5175 | - |
| display | flex row | `display: flex; align-items: center; gap: 4px` |
| icon color (inactive) | gray | - |
| icon color (active) | #D4271D | `color: #D4271D` |
| count | number | `font-weight: 700` |

**States:**
| State | Changes |
|-------|---------|
| Inactive (not liked) | Heart icon: gray (#999999), count displayed |
| Active (liked) | Heart icon: #D4271D (red), count + 1 |
| Disabled (own kudos) | Heart icon: gray, opacity: 0.3, cursor: not-allowed, non-clickable |
| Loading (debounce) | Pointer-events: none, slight opacity reduction |

---

### Sidebar Stats Panel

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13488 | - |
| width | ~300px (flexible) | - |
| position | sticky | `position: sticky; top: 100px` |
| overflow-y | auto | `overflow-y: auto` (independent scroll) |

**Sub-components:**
- Stats overview (D.1): 6 stat rows (label + value)
  - Label: Montserrat 22px 700, #FFFFFF
  - Value: Montserrat 22px 700, #FFFFFF, right-aligned
  - Row items: Kudos nhận (D.1.2) → Kudos gửi (D.1.3) → Tim nhận (D.1.4) → Separator (D.1.5, 1px #2E3940) → Secret Box mở (D.1.6) → Secret Box chưa (D.1.7)
- "Mở Secret Box" button (D.1.8): See Secret Box Button section
- **List**: "10 SUNNER NHẬN QUÀ MỚI NHẤT" (D.3) — Avatar circles + name + gift description
- Empty state for lists: Text "Chưa có dữ liệu"

---

### Filter Dropdown Buttons (Hashtag / Phòng ban)

| Property | Value | CSS |
|----------|-------|-----|
| **Node IDs** | 2940:13459 (Hashtag), 2940:13460 (Phòng ban) | - |
| border | 1px solid #998C5F | `border: 1px solid var(--border-gold)` |
| border-radius | 8px | `border-radius: 8px` |
| padding | 8px 16px | `padding: 8px 16px` |
| font | Montserrat 14px 700 | - |
| color | #FFFFFF | `color: white` |
| icon | Chevron down | Trailing icon |

**States:**
| State | Changes |
|-------|---------|
| Default | border: 1px solid #998C5F |
| Hover | border-color: #FFEA9E, cursor: pointer |
| Open | border-color: #FFEA9E, chevron rotated 180deg |
| Selected (has active option) | Text shows selected value, highlighted state |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |

---

### Secret Box Button

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13497 | - |
| border | 1px solid #998C5F | `border: 1px solid var(--border-gold)` |
| border-radius | 8px | `border-radius: 8px` |
| padding | 12px 24px | `padding: 12px 24px` |
| text | "Mở Secret Box 🎁" | - |
| font | Montserrat 16px 700 | - |
| color | #FFFFFF | `color: white` |

**States:**
| State | Changes |
|-------|---------|
| Default | border: 1px solid #998C5F |
| Hover | border-color: #FFEA9E, cursor: pointer |
| Disabled (0 boxes) | opacity: 0.5, cursor: not-allowed |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |

---

### Profile Search Button

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13450 (approx) | - |
| display | flex row | `display: flex; align-items: center; gap: 8px` |
| border | 1px solid #998C5F | `border: 1px solid var(--border-gold)` |
| border-radius | 100px | `border-radius: 100px` (pill shape) |
| padding | 12px 24px | `padding: 12px 24px` |
| font | Montserrat 16px 700 | - |
| color | #FFFFFF | `color: white` |
| icon | icon-search 20x20 | Prefix icon |

> **Note**: This button is **UI-only** — render the button but do not implement search logic. Out of scope for this spec.

**States:**
| State | Changes |
|-------|---------|
| Default | border: 1px solid #998C5F |
| Hover | border-color: #FFEA9E, cursor: pointer |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |

---

### Copy Link Button

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I3127:21871;256:5216 | - |
| display | flex row | `display: flex; align-items: center; gap: 4px` |
| icon | icon-copy 16x16 | Prefix icon |
| text | "Copy Link" | - |
| font | Montserrat 14px 700 | - |
| color | #FFFFFF | `color: white` |

**States:**
| State | Changes |
|-------|---------|
| Default | opacity: 1 |
| Hover | opacity: 0.8, cursor: pointer, text-decoration: underline |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |

---

### Top 10 Sunner List Item

| Property | Value | CSS |
|----------|-------|-----|
| display | flex row | `display: flex; align-items: center; gap: 12px` |
| avatar | circle, ~40px | `width: 40px; height: 40px; border-radius: 100px` |
| name | Montserrat 14px 700, #FFFFFF | - |
| description | Montserrat 14px 400, #999999 | - |

**States:**
| State | Changes |
|-------|---------|
| Default | opacity: 1 |
| Hover | opacity: 0.8, cursor: pointer |

---

### Footer

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13522 | - |
| width | 1440px | `width: 100%` |
| padding | 40px 90px | `padding: 40px 90px` |
| display | flex row | `display: flex; justify-content: space-between` |
| nav gap | 80px | `gap: 80px` |
| font | Montserrat Alternates 16px 700 | - |
| color | #FFFFFF | `color: white` |

---

## Component Hierarchy with Styles

```
Page (bg: #00101A, w: 1440px)
├── Hero Banner [2940:13432] (w: 1440, h: 512, bg-image + gradient)
│   ├── Header [2940:13433] (w: 1440, h: 80, bg: #101417/80%, flex row, px: 144)
│   │   ├── Logo [I2940:13433;178:1033] (w: 52, h: 48)
│   │   ├── Nav Links (flex row, gap: 24)
│   │   └── Actions (flex row, gap: 16) [Language | Bell | Avatar]
│   ├── Title "Hệ thống ghi nhận và cảm ơn" (Montserrat 36px 700, #FFEA9E)
│   └── Logo "KUDOS" (SVN-Gotham 139.78px, #DBD1C1)
│
├── Main Content [2940:13434] (flex col, gap: 120, pt: 96)
│   ├── Section 1: Hero + Highlight [2940:13435] (flex col, gap: 64)
│   │   ├── Search & Title [2940:13436] (px: 144)
│   │   ├── Search Input [2940:13449] (pill, border: #998C5F)
│   │   └── Highlight [2940:13451] (flex col, gap: 40)
│   │       ├── Header + Filters (flex row, "HIGHLIGHT KUDOS" + dropdowns)
│   │       ├── Carousel [2940:13461] (horizontal scroll, 5 cards)
│   │       │   ├── Prev Button [2940:13470] (circle, chevron)
│   │       │   ├── Kudo Cards [2940:13465] (highlight card style)
│   │       │   └── Next Button [2940:13468] (circle, chevron)
│   │       └── Pagination [2940:13471] (flex row, "2/5")
│   │
│   ├── Section 2: Spotlight [2940:14170]
│   │   ├── Header "SPOTLIGHT BOARD" [2940:13476] (px: 144)
│   │   └── Spotlight Canvas [2940:14174] (w: 1157, h: 548, border: #998C5F)
│   │       ├── Header "388 KUDOS" + Search + Controls
│   │       └── Name Word Cloud (interactive)
│   │
│   ├── Section 3: All Kudos [2940:13475] (flex col, gap: 40)
│   │   ├── Header "ALL KUDOS" [2940:14221] (px: 144)
│   │   └── Content [2940:13481] (flex row, gap: 80, px: 144)
│   │       ├── Kudos Feed (flex col, gap: ~24)
│   │       │   ├── KUDO Post [3127:21871] (bg: #FFF8E1, radius: 8)
│   │       │   ├── KUDO Post [3127:22053]
│   │       │   ├── KUDO Post [3127:22375]
│   │       │   └── KUDO Post [3127:22439]
│   │       └── Sidebar [2940:13488] (sticky, independent scroll)
│   │           ├── Stats Panel [2940:13489]
│   │           │   ├── Kudos nhận [2940:13491] (label + value)
│   │           │   ├── Kudos gửi [2940:13492]
│   │           │   ├── Tim nhận [3241:14882]
│   │           │   ├── Separator [2940:13494] (1px #2E3940)
│   │           │   ├── Secret Box mở [2940:13495]
│   │           │   ├── Secret Box chưa [2940:13496]
│   │           │   └── Button "Mở quà" [2940:13497]
│   │           └── Top 10 Gift Recipients [2940:13510] ("10 SUNNER NHẬN QUÀ MỚI NHẤT")
│   │               ├── Title [2940:13513]
│   │               └── List items [2940:13516-13520]
│   │
│   └── Footer [2940:13522] (px: 90, py: 40, flex row)
│       ├── Nav Links (flex row, gap: 80)
│       └── Copyright (Montserrat Alternates 16px)
```

---

## Responsive Specifications

### Breakpoints (per constitution §IV)

| Name | Tailwind Prefix | Min Width | QA Verify At |
|------|-----------------|-----------|--------------|
| Mobile (default) | — | 0 | 360px |
| Small | `sm:` | 640px | — |
| Tablet | `md:` | 768px | 768px |
| Desktop | `lg:` | 1024px | — |
| Large Desktop | `xl:` | 1280px | 1440px |

> **Note**: Implementation MUST be mobile-first per constitution. Default styles target mobile, then progressively enhance with `sm:`, `md:`, `lg:`, `xl:` modifiers.

### Responsive Changes

#### Mobile (default, < 640px)

| Component | Changes |
|-----------|---------|
| Container | padding: 16px |
| Header | hamburger menu, hide nav text |
| Hero title | font-size: 24px |
| Highlight carousel | 1 card visible, swipe gesture |
| Spotlight | full width, reduced height |
| All Kudos | stack vertically, sidebar below feed |
| Sidebar | full width, collapsible |
| Image gallery | max 3 thumbnails |

#### Tablet (`md:` 768px+)

| Component | Changes |
|-----------|---------|
| Container | padding: 48px |
| Highlight carousel | 2 cards visible |
| Spotlight | full width |
| All Kudos | stack vertically or narrow sidebar |

#### Desktop (`lg:` 1024px+)

| Component | Changes |
|-----------|---------|
| Container | padding: 80px |
| Highlight carousel | 3 cards visible |
| All Kudos | 2-column layout (feed + sidebar) |

#### Large Desktop (`xl:` 1280px+)

| Component | Changes |
|-----------|---------|
| Container | max-width: 1440px, padding: 144px, margin: 0 auto |
| Highlight carousel | 4 cards visible (center-focus) |
| All Kudos | 2-column layout, sidebar sticky |

---

## Icon Specifications

| Icon Name | Size | Color | Usage |
|-----------|------|-------|-------|
| icon-pen | 20x20 | #FFFFFF | Search input prefix |
| icon-search | 20x20 | #FFFFFF | Profile search, Spotlight search |
| icon-chevron-left | 24x24 | #FFFFFF | Carousel prev |
| icon-chevron-right | 24x24 | #FFFFFF | Carousel next |
| icon-heart | 20x20 | gray / #D4271D | Like toggle |
| icon-copy | 16x16 | #FFFFFF | Copy link button |
| icon-arrow-right | 16x16 | #999999 | Sender → Receiver direction |
| icon-bell | 24x24 | #FFFFFF | Notification bell |
| icon-gift | 20x20 | #FFFFFF | Secret Box button |
| icon-pan-zoom | 20x20 | #FFFFFF | Spotlight controls |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Carousel | transform (translateX) | 300ms | ease-in-out | Arrow click / pagination |
| Heart icon | color, scale | 200ms | ease-out | Click toggle |
| Copy Link | toast fade-in | 200ms | ease-out | Click |
| Spotlight names | opacity, scale | 150ms | ease-out | Hover |
| Dropdown filters | opacity, transform | 150ms | ease-out | Toggle |
| Card hover | box-shadow, transform | 200ms | ease-out | Hover |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Page container | 2940:13431 | `bg-[#00101A] min-h-screen` | `<KudosLiveBoardPage>` |
| Header | 2940:13433 | `fixed top-0 w-full bg-[#101417]/80 backdrop-blur px-36 h-20 flex items-center justify-between z-50` | `<Header>` |
| Hero Banner | 2940:13432 | `relative w-full h-[512px] bg-cover` | `<HeroBanner>` |
| Search Input | 2940:13449 | `w-full rounded-full border border-[#998C5F] bg-transparent px-6 py-4 text-white` | `<KudosSearchInput>` |
| Highlight Section | 2940:13451 | `flex flex-col gap-10` | `<HighlightKudos>` |
| Highlight Card | 2940:13465 | `bg-gradient rounded-lg overflow-hidden` | `<HighlightKudoCard>` |
| Carousel | 2940:13461 | `flex overflow-hidden` | `<KudosCarousel>` |
| Carousel Nav | 2940:13468/70 | `w-10 h-10 rounded-full flex items-center justify-center` | `<CarouselButton>` |
| Spotlight | 2940:14174 | `border border-[#998C5F] rounded-lg overflow-hidden` | `<SpotlightBoard>` |
| All Kudos Section | 2940:13475 | `flex flex-col gap-10` | `<AllKudos>` |
| Kudos Post Card | 3127:21871 | `bg-[#FFF8E1] rounded-lg p-6` | `<KudoPostCard>` |
| Heart Button | I3127:21871;256:5175 | `flex items-center gap-1 cursor-pointer` | `<HeartButton>` |
| Copy Link Button | I3127:21871;256:5216 | `text-sm cursor-pointer` | `<CopyLinkButton>` |
| Sidebar | 2940:13488 | `flex flex-col gap-6` | `<KudosSidebar>` |
| Stats Panel | 2940:13489 | `flex flex-col gap-4` | `<StatsPanel>` |
| Secret Box Button | 2940:13497 | `border border-[#998C5F] rounded-lg px-4 py-3 text-white font-bold` | `<SecretBoxButton>` |
| Top Sunner List (Gifts) | 2940:13510 | `flex flex-col gap-3` | `<TopSunnerList>` |
| Top Sunner List Item | 2940:13516+ | `flex items-center gap-3` | `<TopSunnerListItem>` |
| Profile Search Button | ~2940:13450 | `rounded-full border border-[#998C5F] px-6 py-3 text-white font-bold` | `<ProfileSearchButton>` (UI-only) |
| Pagination Indicator | 2940:13471 | `flex items-center text-white text-[32px] font-bold` | `<PaginationIndicator>` |
| Toast Notification | — | `fixed bottom-4 right-4 bg-white/90 rounded-lg px-4 py-3 shadow-lg` | `<Toast>` |
| Filter Dropdown (Hashtag) | 2940:13459 | `border border-[#998C5F] rounded-lg px-4 py-2 text-white font-bold text-sm` | `<FilterDropdown type="hashtag">` |
| Filter Dropdown (Dept) | 2940:13460 | `border border-[#998C5F] rounded-lg px-4 py-2 text-white font-bold text-sm` | `<FilterDropdown type="department">` |
| Star Count (Hoa Thị) | various | `flex items-center gap-0.5 text-[#FFEA9E]` | `<StarCount count={n}>` |
| Footer | 2940:13522 | `w-full px-[90px] py-10 flex justify-between` | `<Footer>` |

---

## Notes

- All colors should use CSS variables for theming support
- Primary font is **Montserrat** (700 weight dominant), with **SVN-Gotham** for the decorative logo and **Montserrat Alternates** for footer
- Dark theme throughout: #00101A background with gold (#FFEA9E, #998C5F) and warm cream (#FFF8E1) accents
- Spotlight Board is an interactive word cloud — may require canvas/SVG rendering
- All icons **MUST BE** in **Icon Component** instead of svg files or img tags
- Ensure color contrast meets WCAG AA (light text on dark bg passes, verify cream cards)
