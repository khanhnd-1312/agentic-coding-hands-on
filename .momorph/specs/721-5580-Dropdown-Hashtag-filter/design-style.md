# Design Style: Dropdown Hashtag filter

**Frame ID**: `721:5580`
**Frame Name**: `Dropdown Hashtag filter`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/721:5580
**Frame Image**: ![Frame](https://momorph.ai/api/images/9ypp4enmFmdK3YAFJLIu6C/721:5580/288a43bf333b986c83f6bf8e7d4bfc9d.png)
**Extracted At**: 2026-03-31

---

## Design Tokens

> This dropdown uses the **exact same visual pattern** as the Department Dropdown (`721:5684`). All design tokens, typography, spacing, and states are identical. Both use the `Dropdown-List` component set (`563:8216`) and the `Button` component set (`186:1426`).

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| `--color-dropdown-bg` | `#00070C` | 100% | Dropdown container background (var: Details-Container-2) |
| `--color-dropdown-border` | `#998C5F` | 100% | Dropdown container border (var: Details-Border) |
| `--color-item-selected-bg` | `#FFEA9E` | 10% | Selected item background (rgba(255,234,158,0.1)) |
| `--color-text-primary` | `#FFFFFF` | 100% | Default item text color |
| `--color-text-selected` | `#FFFFFF` | 100% | Selected item text color (with glow) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing | Usage |
|------------|-------------|------|--------|-------------|----------------|-------|
| `--text-dropdown-item` | Montserrat | 16px | 700 | 24px | 0.5px | Dropdown item text (e.g. "#Dedicated", "#Inspring") |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| `--dropdown-padding` | 6px | Container inner padding |
| `--item-padding` | 16px | Item inner padding (all sides) |
| `--item-inner-gap` | 4px | Gap between icon and text inside item |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-dropdown` | 8px | Dropdown container border-radius |
| `--radius-item` | 4px | Item border-radius |
| `--border-dropdown` | 1px solid #998C5F | Dropdown container border |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| `--shadow-selected-glow` | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` | Text-shadow on selected item |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| Dropdown width | hug-content (min ~147px) | Width adapts to longest hashtag text. Hashtag names like "#Giải pháp sáng tạo" can be wide. Use `min-w-full` (at least as wide as trigger). |
| Dropdown height | hug-content, max ~348px | Height adapts to number of items, capped with `max-height` for scrolling |
| Items shown | 6 (visible in Figma) | Full list is 13 hashtags (scrollable) |
| Position | absolute / overlay | Appears below trigger button |

### Layout Structure (ASCII)

```
┌──────────────── (No overlay backdrop in implementation) ───────────────────────┐
│                                                                                 │
│   ┌─────────── Dropdown Container (w:auto, max-h:~348px) ───┐                  │
│   │  border: 1px solid #998C5F                               │                  │
│   │  background: #00070C                                     │                  │
│   │  border-radius: 8px                                      │                  │
│   │  padding: 6px                                            │                  │
│   │  display: flex, flex-direction: column                   │                  │
│   │                                                          │                  │
│   │  ┌─── A.1 Item (Selected) ── 135×56px ───────────────┐  │                  │
│   │  │  bg: rgba(255,234,158,0.1)                         │  │                  │
│   │  │  border-radius: 4px                                │  │                  │
│   │  │  padding: 16px                                     │  │                  │
│   │  │  text: "#Dedicated" (16px/700, #FFF, glow)        │  │                  │
│   │  └────────────────────────────────────────────────────┘  │                  │
│   │                                                          │                  │
│   │  ┌─── A.2 Item (Default) ── 118×56px ────────────────┐  │                  │
│   │  │  bg: transparent                                   │  │                  │
│   │  │  text: "#Inspring" (16px/700, #FFF, no glow)      │  │                  │
│   │  └────────────────────────────────────────────────────┘  │                  │
│   │  ... (4 more items)                                      │                  │
│   └──────────────────────────────────────────────────────────┘                  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### A_Dropdown Container — `563:8026`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `563:8026` | — |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| padding | 6px | `padding: 6px` |
| background | `#00070C` | `background-color: #00070C` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 8px | `border-radius: 8px` |
| align-items | flex-start | `align-items: flex-start` |
| position | absolute | Overlay positioned relative to trigger |
| z-index | 50+ | Above header (z-40) |
| overflow-y | auto | Scrollable when list exceeds max-height |
| max-height | ~348px | Show ~6 items before scrolling |

---

### A.1 Dropdown Item (Selected) — `I563:8026;525:13508`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I563:8026;525:13508` | — |
| width | 135px (hug) | `width: auto` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| border-radius | 4px | `border-radius: 4px` |
| background | `rgba(255, 234, 158, 0.1)` | `background-color: rgba(255, 234, 158, 0.1)` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 4px | `gap: 4px` |
| cursor | pointer | `cursor: pointer` |

**Selected Item Text:**

| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.5px | `letter-spacing: 0.5px` |
| color | `#FFFFFF` | `color: #FFFFFF` |
| text-align | center | `text-align: center` |
| text-shadow | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` | Gold glow on selected item |

---

### A.2–A.N Dropdown Item (Default) — `I563:8026;525:14864` (example)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I563:8026;525:14864` (#Inspring), `I563:8026;525:14791` (#Dedicated), etc. | — |
| width | ~118–135px (hug) | `width: auto` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| border-radius | 4px | `border-radius: 4px` |
| background | transparent | `background-color: transparent` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 4px | `gap: 4px` |
| cursor | pointer | `cursor: pointer` |

**Item States:**

| State | Property | Value |
|-------|----------|-------|
| Default | background | transparent |
| Default | color | `#FFFFFF` |
| Default | text-shadow | none |
| Hover | background | `rgba(255, 234, 158, 0.1)` |
| Hover | cursor | pointer |
| Selected/Active | background | `rgba(255, 234, 158, 0.1)` |
| Selected/Active | text-shadow | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` |
| Focus | outline | `2px solid #15D5CA`, outline-offset: 2px |

---

## Component Hierarchy with Styles

```
721:5580 — Dropdown Hashtag filter (frame)
└── 563:8026 — A_Dropdown-List (Instance)
    │  bg: #00070C, border: 1px solid #998C5F, r: 8px, p: 6px
    │  flex-col, align-items: flex-start
    │
    ├── I563:8026;525:13508 — A.1 "#Dedicated" [SELECTED]
    │   │  bg: rgba(255,234,158,0.1), r: 4px, p: 16px, h: 56px
    │   └── Text: "#Dedicated" (Montserrat 16px/700, #FFF, text-shadow glow)
    │
    ├── I563:8026;525:14864 — A.2 "#Inspring" [DEFAULT]
    │   └── Text: "#Inspring" (Montserrat 16px/700, #FFF)
    │
    ├── I563:8026;525:14791 — A.3 "#Dedicated" [DEFAULT]
    │   └── Text: "#Dedicated"
    │
    ├── I563:8026;525:15060 — "#Dedicated" [DEFAULT]
    ├── I563:8026;525:13538 — "#Inspring" [DEFAULT]
    └── I563:8026;525:15061 — "#Inspring" [DEFAULT]
```

---

## Responsive Specifications

Identical to Department Dropdown — see `specs/721-5684-Dropdown-Phong-ban/design-style.md`.

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | 767px |
| Tablet | 768px | 1023px |
| Desktop | 1024px | ∞ |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Dropdown | opacity, transform | 150ms | ease-out | Open/Close toggle |
| Item | background-color | 150ms | ease-in-out | Hover |
| Item (select) | text-shadow | 150ms | ease-in-out | Click |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class (Figma target) | React Component |
|----------------|---------------|--------------------------------------|-----------------|
| Dropdown container | `563:8026` | `bg-[#00070C] border border-[#998C5F] rounded-lg p-1.5 flex flex-col max-h-87 overflow-y-auto` | `<FilterDropdown>` (existing, shared with department) |
| Item (selected) | `I563:8026;525:13508` | `bg-[rgba(255,234,158,0.1)] rounded p-4 h-14 [text-shadow:...]` | `<li role="option" aria-selected="true">` |
| Item (default) | `I563:8026;525:14864` | `rounded p-4 h-14 hover:bg-[rgba(255,234,158,0.1)]` | `<li role="option">` |
| Item text | `I563:8026;525:13508;186:1497` | `text-base font-bold leading-6 tracking-[0.5px] text-white` | `<span>` inside `<li>` |

> **Implementation note**: The `FilterDropdown` component at `src/components/kudos-live-board/filter-dropdown.tsx` is already shared between hashtag and department filters. The style updates done for the Department Dropdown spec (`721-5684`) **already apply** to this hashtag filter as well — **no additional code changes needed**.

---

## Notes

- This dropdown is **visually identical** to the Department Dropdown (`721:5684`). Both use the same `Dropdown-List` component set (`563:8216`) and `Button` component set (`186:1426`).
- The `FilterDropdown` component is already styled per Figma (updated in the Department Dropdown implementation). This spec exists for documentation completeness.
- Hashtag items display with `#` prefix (e.g., "#Dedicated", "#Inspring") — the `#` is part of the hashtag name stored in the database.
- All icons **MUST BE** in **Icon Component** instead of svg files or img tags.
