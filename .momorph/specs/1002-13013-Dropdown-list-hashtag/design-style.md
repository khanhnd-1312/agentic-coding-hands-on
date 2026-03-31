# Design Style: Dropdown list hashtag

**Frame ID**: `1002:13013`
**Frame Name**: `Dropdown list hashtag`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/1002:13013
**Frame Image**: ![Frame](https://momorph.ai/api/images/9ypp4enmFmdK3YAFJLIu6C/1002:13013/2b8eea79a907bbfee55e3171d69b5862.png)
**Extracted At**: 2026-03-31

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| `--color-dropdown-bg` | `#00070C` | 100% | Dropdown list container background (var: Details-Container-2) |
| `--color-dropdown-border` | `#998C5F` | 100% | Dropdown & trigger button border (var: Details-Border) |
| `--color-trigger-bg` | `#FFFFFF` | 100% | Trigger button background (var: Details-Text-Secondary-1) |
| `--color-item-selected-bg` | `#FFEA9E` | 20% | Selected item background (rgba(255,234,158,0.2)) |
| `--color-text-primary` | `#FFFFFF` | 100% | Item text in dropdown list |
| `--color-text-trigger` | `#999999` | 100% | Trigger button label/sublabel (var: Details-Text-Secondary-2) |
| `--color-check-icon` | `#FFFFFF` (icon fill) | 100% | Checkmark icon for selected items (24x24px, `MM_MEDIA` icon instance `1002:13201` from component set `178:1020`) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing | Usage |
|------------|-------------|------|--------|-------------|----------------|-------|
| `--text-hashtag-item` | Montserrat | 16px | 700 | 24px | 0.15px | Hashtag item text in dropdown list |
| `--text-trigger-label` | Montserrat | 11px | 700 | 16px | 0.5px | Trigger button "Hashtag" label + "Toi da 5" sublabel |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| `--dropdown-padding` | 6px | Dropdown list container inner padding |
| `--item-padding-x` | 16px | Item horizontal padding (left + right) |
| `--item-padding-y` | 0px | Item has no vertical padding (height is fixed 40px) |
| `--trigger-padding` | 4px 8px | Trigger button padding |
| `--trigger-gap` | 8px | Gap inside trigger button (between icon and text) |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-dropdown` | 8px | Dropdown container border-radius |
| `--radius-trigger` | 8px | Trigger button border-radius |
| `--radius-item-selected` | 2px | Selected item border-radius |
| `--border-dropdown` | 1px solid #998C5F | Dropdown container and trigger border |

### Shadows

None — no box-shadow or text-shadow on this component (unlike the filter dropdown).

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| Dropdown width | 318px (fixed) | Fixed width matching trigger parent |
| Item height | 40px | Each hashtag row is 40px |
| Items shown | 8 (visible in Figma) | Full list is 13 hashtags (scrollable if more) |
| Position | absolute / overlay | Appears below trigger button |

### Layout Structure (ASCII)

```
┌─── Trigger Button (116×48px) ────────────────────────────────────────────────┐
│  [+] Hashtag                                                                  │
│      Tối đa 5                                                                 │
│  bg: #FFF, border: 1px solid #998C5F, r: 8px                                │
└───────────────────────────────────────────────────────────────────────────────┘

┌─── Dropdown List (318×332px) ─────────────────────────────────────────────────┐
│  border: 1px solid #998C5F, bg: #00070C, r: 8px, p: 6px                      │
│  flex-col                                                                     │
│                                                                               │
│  ┌─── A: Selected Item ── 306×40px ── bg: rgba(255,234,158,0.2), r: 2px ──┐ │
│  │  px: 16px, flex-row, items-center, justify-between                      │ │
│  │  [#High-perorming]                                    [✓ check icon]    │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌─── B: Selected Item ── 306×40px ───────────────────────────────────────┐  │
│  │  [#BE PROFESSIONAL]                                   [✓ check icon]    │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌─── C: Selected Item ── 306×40px ───────────────────────────────────────┐  │
│  │  [#BE OPTIMISTIC]                                     [✓ check icon]    │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌─── D: Unselected Item ── 306×40px ── bg: transparent ─────────────────┐  │
│  │  [#BE A TEAM]                                                           │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌─── Unselected Item ── 306×40px ────────────────────────────────────────┐  │
│  │  [#THINK OUTSIDE THE BOX]                                               │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│  ... (#GET RISKY, #GO FAST, #WASSHOI)                                        │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Trigger Button — `1002:15115`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `1002:15115` | — |
| width | 116px | `width: auto` / hug |
| height | 48px | `height: 48px` |
| padding | 4px 8px | `padding: 4px 8px` |
| background | `#FFFFFF` | `background-color: white` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 8px | `border-radius: 8px` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 8px | `gap: 8px` |

**Trigger contents:**
- Plus icon (`MM_MEDIA_Plus`): 24×24px
- Text block: "Hashtag\nToi da 5" — Montserrat 11px/700, color `#999`, line-height 16px, letter-spacing 0.5px

---

### Dropdown Container — `1002:13102`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `1002:13102` | — |
| width | 318px | `width: 318px` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| padding | 6px | `padding: 6px` |
| background | `#00070C` | `background-color: #00070C` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 8px | `border-radius: 8px` |
| align-items | flex-start | `align-items: flex-start` |
| position | absolute | Below trigger |
| z-index | 50+ | Above page content |
| overflow-y | auto | Scrollable when items exceed container |

---

### Selected Item (A/B/C) — `1002:13185` (example)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `1002:13185` (A), `1002:13207` (B), `1002:13216` (C) | — |
| width | 306px (fill) | `width: 100%` |
| height | 40px | `height: 40px` |
| padding | 0 16px | `padding: 0 16px` |
| background | `rgba(255, 234, 158, 0.2)` | `background-color: rgba(255, 234, 158, 0.2)` |
| border-radius | 2px | `border-radius: 2px` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | space-between | Text on left, check icon on right |
| gap | 2px | `gap: 2px` |

**Selected Item Text** (`1002:13190`):
| Property | Value |
|----------|-------|
| font-family | Montserrat |
| font-size | 16px |
| font-weight | 700 |
| line-height | 24px |
| letter-spacing | 0.15px |
| color | `#FFFFFF` |
| text-align | left |

**Check Icon** (`1002:13204`): 24×24px, circle with checkmark, visible only when selected.

---

### Unselected Item (D) — `1002:13104`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `1002:13104` | — |
| width | 306px (fill) | `width: 100%` |
| height | 40px | `height: 40px` |
| padding | 0 16px | `padding: 0 16px` |
| background | transparent | `background-color: transparent` |
| border-radius | 0px | `border-radius: 0` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 2px | `gap: 2px` |

**Unselected Item Text**: Same typography as selected (16px/700 Montserrat, #FFF, ls: 0.15px). No check icon visible.

**Item States:**

| State | Property | Value |
|-------|----------|-------|
| Default (unselected) | background | transparent |
| Default (unselected) | border-radius | 0px |
| Hover | background | `rgba(255, 234, 158, 0.1)` (subtle gold tint) |
| Selected | background | `rgba(255, 234, 158, 0.2)` |
| Selected | border-radius | 2px |
| Selected | check icon | visible (24×24px) |
| Disabled (max 5 reached) | opacity | 0.5 or pointer-events: none on unselected items |
| Focus | outline | `2px solid #15D5CA`, outline-offset: 2px |

---

## Component Hierarchy with Styles

```
1002:13013 — Dropdown list hashtag (frame)
├── 1002:15114 — Trigger area
│   └── 1002:15115 — Button (Instance)
│       └── I..;186:2758 — Frame 483
│           ├── I..;186:2759 — Plus icon (24×24)
│           └── I..;186:2760 — "Hashtag\nTối đa 5" (11px/700, #999)
│
└── 1002:13102 — Dropdown-List container
    │  bg: #00070C, border: 1px solid #998C5F, r: 8px, p: 6px
    │
    ├── 1002:13185 — A: "#High-perorming" [SELECTED, bg: rgba(255,234,158,0.2)]
    │   ├── 1002:13188 — A.1: Hashtag text (16px/700, #FFF)
    │   └── 1002:13204 — A.2: Check icon (24×24) ✓
    │
    ├── 1002:13207 — B: "#BE PROFESSIONAL" [SELECTED]
    │   ├── 1002:13210 — B.1: Hashtag text
    │   └── 1002:13214 — B.2: Check icon ✓
    │
    ├── 1002:13216 — C: "#BE OPTIMISTIC" [SELECTED]
    │   ├── 1002:13219 — C.1: Hashtag text
    │   └── 1002:13223 — C.2: Check icon ✓
    │
    ├── 1002:13104 — D: "#BE A TEAM" [UNSELECTED, bg: transparent, no check]
    ├── 1002:13131 — "#THINK OUTSIDE THE BOX" [UNSELECTED]
    ├── 1002:13137 — "#GET RISKY" [UNSELECTED]
    ├── 1002:13151 — "#GO FAST" [UNSELECTED]
    └── 1002:13227 — "#WASSHOI" [UNSELECTED]
```

---

## Responsive Specifications

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | 767px |
| Tablet | 768px | 1023px |
| Desktop | 1024px | ∞ |

### Responsive Changes

| Breakpoint | Change |
|------------|--------|
| Mobile | Dropdown width: 100% of parent container (instead of fixed 318px) |
| Tablet+ | Fixed 318px as per Figma |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Dropdown | opacity, transform | 150ms | ease-out | Open/Close |
| Item | background-color | 150ms | ease-in-out | Hover / Select |
| Check icon | opacity | 100ms | ease-in | Select/Deselect |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class (Figma target) | React Component | Current Code Status |
|----------------|---------------|--------------------------------------|-----------------|---------------------|
| Trigger button | `1002:15115` | `h-12 rounded-lg border border-[#998C5F] bg-white px-2 py-1` | `<HashtagField>` trigger button | Exists — styling needs update to match Figma (dark bg dropdown, check icons) |
| Dropdown container | `1002:13102` | `w-[318px] bg-[#00070C] border border-[#998C5F] rounded-lg p-1.5 flex flex-col` | Dropdown `<div>` inside `<HashtagField>` | Exists — uses white bg, needs dark bg `#00070C` |
| Selected item | `1002:13185` | `h-10 px-4 bg-[rgba(255,234,158,0.2)] rounded-sm flex items-center justify-between` (text left, check icon right) | `<li>` / `<button>` row | Exists — styling mismatch (white bg, no gold tint, no check icon) |
| Unselected item | `1002:13104` | `h-10 px-4 flex items-center hover:bg-[rgba(255,234,158,0.1)]` | `<li>` / `<button>` row | Exists — styling mismatch |
| Check icon | `1002:13204` | `w-6 h-6` (circle-check icon, 24px) | `<Icon name="check-circle" size={24}>` | **Missing** — `check-circle` icon does NOT exist in Icon component yet. Only `checkbox-checked` (square) exists. Must add new `check-circle` variant to `src/components/ui/icon.tsx`. |
| Item text | `1002:13190` | `text-base font-bold leading-6 tracking-[0.15px] text-white text-left` | `<span>` inside item | Exists — uses `text-sm text-[#00101A]`, needs `text-base text-white` |

---

## Notes

- This is a **multi-select** dropdown (max 5), NOT a single-select like the Live Board filter dropdowns.
- The existing `HashtagField` at `src/components/write-kudo/hashtag-field.tsx` has full behavior (fetch, select, deselect, create, search) but uses **light theme styling** (white bg, dark text). The Figma design uses **dark theme** (`#00070C` bg, white text, gold selected bg).
- The check icon (`1002:13204`) uses the `MM_MEDIA` icon component set (`178:1020`) — should be rendered via the `<Icon>` component.
- The trigger button shows a "+" icon and "Hashtag / Toi da 5" label — existing implementation already has this pattern.
- Selected items show `rgba(255,234,158,0.2)` bg (note: **0.2 opacity**, different from the filter dropdown which uses 0.1). This is intentional per Figma — the write-kudo context uses a slightly more visible selection highlight.
- All icons **MUST BE** in **Icon Component** instead of svg files or img tags.
