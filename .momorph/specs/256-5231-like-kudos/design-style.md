# Design Style: Like Kudos

**Frame ID**: `256:5231` (KUDO card feed), `335:9620` (KUDO highlight card), `520:18779` (View Kudo detail)
**Frame Name**: `KUDO` / `KUDO - Highlight` / `View Kudo`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/256:5231
**Extracted At**: 2026-03-24

> **Note**: "Like Kudos" is an interaction feature embedded across three card surfaces: feed card, highlight card, and detail view. No single dedicated frame exists; these styles are derived from the KUDO card frames and the Live Board design-style.

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-heart-active | #D4271D | 100% | Heart icon when liked (red) |
| --color-heart-default | #999999 | 100% | Heart icon when not liked (grey) |
| --color-heart-disabled | #CCCCCC | 40% | Heart icon when sender views own kudo (disabled) |
| --color-heart-count | #1A1A1A | 100% | Heart count number text |
| --color-bg-card | #FFF8E1 | 100% | Kudo card background (warm cream) |
| --color-bg-card-alt | #FFF3C6 | 100% | Highlight kudo card background |
| --color-bg-overlay | #00101A | 90% | Dark overlay for detail/modal view |
| --color-text-action | #1A1A1A | 100% | "Copy Link" action text |
| --color-text-muted | #999999 | 100% | Timestamps, secondary info |
| --color-border-card | #E8D9A0 | 100% | Card border (optional subtle) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing | Usage |
|------------|-------------|------|--------|-------------|----------------|-------|
| --text-heart-count | Montserrat | 20px | 700 | 32px | 0 | Heart count number (e.g., "1.000") |
| --text-action-link | Montserrat | 16px | 700 | 24px | 0.15px | "Copy Link", "Xem chi tiết" action buttons |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-heart-gap | 8px | Gap between heart icon and count number |
| --spacing-action-gap | 24px | Gap between "❤ count", "Copy Link", "Xem chi tiết" actions |
| --spacing-card-pad-x | 24px | Card horizontal padding |
| --spacing-card-pad-y | 20px | Card vertical padding |
| --spacing-action-row-top | 16px | Top margin of action row from hashtags |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-card | 16px | Kudo card border radius |
| --radius-card-highlight | 20px | Highlight card border radius |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-card | 0 2px 12px rgba(0,0,0,0.08) | Kudo card shadow on dark page background |

---

## Layout Specifications

### Feed Card Bottom Action Row

```
┌──────────────────────────────────────────────────────────┐
│  Kudo Card (bg: #FFF8E1, radius: 16px, px: 24px)         │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  [Avatar] Sender → [Avatar] Receiver                 │ │
│  │  Category chip  •  Timestamp                        │ │
│  │  Message content (max 5 lines, truncated)           │ │
│  │  [Image 1][Image 2][Image 3][Image 4][Image 5]      │ │
│  │  #hashtag1 #hashtag2 #hashtag3...                   │ │
│  │  ─────────────────────────────────────              │ │
│  │  [❤ 1.000]    [🔗 Copy Link]                        │ │  ← action row (mt: 16px)
│  └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Highlight Card Bottom Action Row

```
┌──────────────────────────────────────────────────────────┐
│  Highlight Card (bg: #FFF8E1, radius: 20px, px: 24px)    │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  [Avatar] Sender → [Avatar] Receiver                 │ │
│  │  Names & department badges                           │ │
│  │  Timestamp                                           │ │
│  │  Category chip                                       │ │
│  │  Message content (max 3 lines, truncated)           │ │
│  │  #hashtag1 #hashtag2 ...                            │ │
│  │  ─────────────────────────────────────              │ │
│  │  [❤ 1.000]    [🔗 Copy Link]    [Xem chi tiết ↗]   │ │
│  └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### View Kudo (Detail Modal) Bottom Action Row

```
┌──────────────────────────────────────────────────────────┐
│  Modal (bg: #00101A/90%, w: ~560px, radius: 16px)        │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  [Avatar] Sender → [Avatar] Receiver                 │ │
│  │  Names & department badges                           │ │
│  │  Timestamp                                           │ │
│  │  Full message content (no truncation)               │ │
│  │  [Image 1][Image 2][Image 3][Image 4][Image 5]      │ │
│  │  #hashtag1 #hashtag2 #hashtag3 #hashtag4            │ │
│  │  ─────────────────────────────────────              │ │
│  │  [❤ 10]    [🔗 Copy Link]    [Đóng]                 │ │
│  └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Heart Button (Like Toggle)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `256:5231` (within KUDO card) | - |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 8px | `gap: 8px` |
| cursor | pointer | `cursor: pointer` |
| user-select | none | `user-select: none` |

**Heart Icon:**
| Property | Value | CSS |
|----------|-------|-----|
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |
| fill (default) | #999999 | `color: var(--color-heart-default)` |
| fill (liked) | #D4271D | `color: var(--color-heart-active)` |
| fill (disabled) | #CCCCCC | `color: var(--color-heart-disabled)` |

**Heart Count Text:**
| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | - |
| font-size | 20px | `font-size: 20px` |
| font-weight | 700 | `font-weight: 700` |
| color | #1A1A1A | `color: var(--color-heart-count)` |
| format | Vietnamese number format | e.g., "1.000" (dot as thousands separator) |

**States:**
| State | Icon Color | Cursor | Count | Other |
|-------|------------|--------|-------|-------|
| Default (not liked) | #999999 (grey) | pointer | unchanged | - |
| Liked (active) | #D4271D (red) | pointer | +1 optimistic | - |
| Disabled (own kudo) | #CCCCCC (light grey) | not-allowed | non-interactive | `pointer-events: none` |
| Loading (API in-flight) | #D4271D (red, pulsing) | wait | optimistic value | `pointer-events: none` |
| Hover (not liked) | #D4271D with opacity 0.6 | pointer | unchanged | - |
| Hover (liked) | #D4271D with opacity 0.8 | pointer | unchanged | - |
| **Focus** | border/ring: 2px solid #D4271D | pointer | unchanged | `outline: 2px solid #D4271D; outline-offset: 2px` (WCAG AA, constitution §IV) |

---

### Action Row Container

| Property | Value | CSS |
|----------|-------|-----|
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 24px | `gap: 24px` |
| margin-top | 16px | `margin-top: 16px` |
| padding-top | 16px | `padding-top: 16px` |
| border-top | 1px solid #E8D9A0 | `border-top: 1px solid var(--color-border-card)` |

---

### "Copy Link" Action Button

| Property | Value | CSS |
|----------|-------|-----|
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 6px | `gap: 6px` |
| font-family | Montserrat | - |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| color | #1A1A1A | `color: var(--color-text-action)` |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Changes |
|-------|---------|
| Hover | opacity: 0.7 |
| Focus | `outline: 2px solid #1A1A1A; outline-offset: 2px` |
| Active (just copied) | Shows toast "Đã sao chép link!" for 2s |

---

### "Xem chi tiết" / "Đóng" Action Button

| Property | Value | CSS |
|----------|-------|-----|
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 4px | `gap: 4px` |
| font-family | Montserrat | - |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| color | #1A1A1A | `color: var(--color-text-action)` |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Changes |
|-------|---------|
| Hover | opacity: 0.7 |
| Focus | `outline: 2px solid #1A1A1A; outline-offset: 2px` |

---

## Component Hierarchy with Styles

```
KudoCard (bg: #FFF8E1, radius: 16px, p: 20px 24px)
├── CardHeader (flex row, gap: 12px, align: center)
│   ├── SenderAvatar (w: 40px, h: 40px, radius: full)
│   ├── ArrowIcon (w: 20px, color: #999)
│   └── ReceiverAvatar (w: 40px, h: 40px, radius: full)
│
├── CardMeta (flex row, gap: 8px, mt: 8px)
│   ├── SenderName (Montserrat 14px 700)
│   ├── Department (Montserrat 12px 400, color: #999)
│   └── Timestamp (Montserrat 12px 400, color: #999)
│
├── CardContent (mt: 12px)
│   ├── CategoryChip (optional)
│   ├── MessageText (Montserrat 20px 700, max 5 lines, truncated)
│   ├── ImageGallery (flex row, gap: 4px, mt: 8px)
│   └── HashtagList (flex wrap, gap: 4px, mt: 8px, color: #D4271D)
│
└── CardActions (flex row, gap: 24px, mt: 16px, pt: 16px, border-top: 1px solid #E8D9A0)
    ├── HeartButton (flex row, gap: 8px, cursor: pointer)
    │   ├── HeartIcon (24x24, color: #999 default / #D4271D liked)
    │   └── HeartCount (Montserrat 20px 700, color: #1A1A1A)
    ├── CopyLinkButton (flex row, gap: 6px)
    │   ├── LinkIcon (20x20)
    │   └── Text "Copy Link" (Montserrat 16px 700)
    └── ViewDetailButton [highlight/detail only]
        ├── Text "Xem chi tiết" / "Đóng" (Montserrat 16px 700)
        └── ExternalLinkIcon (16x16) [highlight only]
```

---

## Responsive Specifications

### Breakpoints

> Per constitution §IV, UI is **mobile-first**. QA verification at 360px / 768px / 1440px.

| Name | Min Width | Tailwind Prefix | QA Size |
|------|-----------|-----------------|---------|
| Mobile (default) | 0 | (base) | 360px |
| Tablet | 640px | `sm:` | 768px |
| Desktop | 1024px | `lg:` | 1440px |

### Responsive Changes

#### Mobile base (360px target)

| Component | Changes |
|-----------|---------|
| Kudo Card | padding: 12px 16px |
| HeartCount | font-size: 16px, font-weight: 700 |
| Action row | gap: 12px |
| Action text ("Copy Link") | font-size: 14px |
| Heart icon | 20x20px |

#### Tablet (sm: 640px+)

| Component | Changes |
|-----------|---------|
| Kudo Card | padding: 16px 20px |
| HeartCount | font-size: 18px |
| Action row | gap: 16px |
| Action text | font-size: 14px |
| Heart icon | 22x22px |

#### Desktop (lg: 1024px+, design at 1440px)

| Component | Changes |
|-----------|---------|
| Kudo Card | padding: 20px 24px |
| HeartCount | font-size: 20px |
| Action row | gap: 24px |
| Action text | font-size: 16px |
| Heart icon | 24x24px |

---

## Icon Specifications

| Icon Name | Size | Color (default) | Color (active) | Usage |
|-----------|------|-----------------|----------------|-------|
| icon-heart | 24x24 | #999999 | #D4271D | Like toggle button |
| icon-link | 20x20 | #1A1A1A | - | Copy Link action |
| icon-external-link | 16x16 | #1A1A1A | - | "Xem chi tiết" on highlight card |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Heart icon | color, transform (scale 1→1.3→1) | 300ms | ease-in-out | Click to like |
| Heart icon | color | 200ms | ease-out | Click to unlike |
| Heart count | content (optimistic update) | 0ms | - | Click |
| Copy Link toast | opacity | 200ms | ease-out | After copy |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Heart Button | within `256:5231` | `flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:outline-2 focus-visible:outline-[#D4271D] focus-visible:outline-offset-2` | `<HeartButton>` |
| Heart Icon (default) | within `256:5231` | `text-[#999999]` *(not `text-gray-400` = #9CA3AF)* | `<Icon name="heart">` |
| Heart Icon (active) | within `256:5231` | `text-[#D4271D]` *(not `text-red-600` = #DC2626)* | `<Icon name="heart-filled">` |
| Heart Icon (disabled) | within `256:5231` | `text-[#CCCCCC] opacity-40 cursor-not-allowed` | `<Icon name="heart">` |
| Heart Count | within `256:5231` | `font-bold text-xl text-[#1A1A1A]` | `<span>` |
| Action Row | within `256:5231` | `flex items-center gap-6 mt-4 pt-4 border-t border-[#E8D9A0]` | `<CardActions>` |
| Copy Link Button | within `256:5231` | `flex items-center gap-1.5 font-bold text-[#1A1A1A] hover:opacity-70 focus-visible:outline-2` | `<CopyLinkButton>` |
| View Detail Button | within `335:9620` | `flex items-center gap-1 font-bold text-[#1A1A1A] hover:opacity-70 focus-visible:outline-2` | `<ViewDetailButton>` |
| Close Button ("Đóng") | within `520:18779` | `flex items-center gap-1 font-bold text-[#1A1A1A] hover:opacity-70 focus-visible:outline-2` | `<CloseButton>` |

---

## Notes

- Heart count uses Vietnamese number formatting: dot as thousands separator (e.g., `1.000` not `1,000`)
- Use Icon Component for all icons — no raw SVG files or `<img>` tags
- Heart toggle uses **optimistic UI**: update count and icon color immediately on click, then reconcile on API response
- Debounce rapid clicks with 300ms window to avoid duplicate API calls
- All colors use CSS variables for theming support
- Ensure color contrast: #D4271D on #FFF8E1 meets WCAG AA (5.1:1)
