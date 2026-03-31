# Design Style: Dropdown Phòng ban

**Frame ID**: `721:5684`
**Frame Name**: `Dropdown Phòng ban`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/721:5684
**Frame Image**: ![Frame](https://momorph.ai/api/images/9ypp4enmFmdK3YAFJLIu6C/721:5684/e16a7a42afaa2c9adf5fb3b0231dca16.png)
**Extracted At**: 2026-03-31

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| `--color-dropdown-bg` | `#00070C` | 100% | Dropdown container background (var: Details-Container-2) |
| `--color-dropdown-border` | `#998C5F` | 100% | Dropdown container border (var: Details-Border) |
| `--color-item-selected-bg` | `#FFEA9E` | 10% | Selected item background (rgba(255,234,158,0.1)) |
| `--color-text-primary` | `#FFFFFF` | 100% | Default item text color |
| `--color-text-selected` | `#FFFFFF` | 100% | Selected item text color (with glow) |
| `--color-overlay-bg` | `#696969` | 100% | Figma artboard background only — NOT rendered in implementation. The existing `FilterDropdown` does not use a dimmed backdrop. |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing | Usage |
|------------|-------------|------|--------|-------------|----------------|-------|
| `--text-dropdown-item` | Montserrat | 16px | 700 | 24px | 0.5px | Dropdown item text |

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
| Dropdown width | hug-content (min ~101px) | Width adapts to longest item text. With ~50 departments (e.g. "CEVC1 - DSV - UI/UX 1"), actual width will be wider. Use `min-w-full` (at least as wide as trigger) + `w-auto`. |
| Dropdown height | hug-content, max ~348px | Height adapts to number of items, capped with `max-height` for scrolling |
| Items shown | 6 (visible in Figma) | Full list is ~50 departments (scrollable) |
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
│   │  ┌─── A.1 Item (Selected) ─── 90×56px ───────────────┐  │                  │
│   │  │  bg: rgba(255,234,158,0.1)                         │  │                  │
│   │  │  border-radius: 4px                                │  │                  │
│   │  │  padding: 16px                                     │  │                  │
│   │  │  text: "CEVC2" (16px/700, #FFF, text-shadow glow) │  │                  │
│   │  └────────────────────────────────────────────────────┘  │                  │
│   │                                                          │                  │
│   │  ┌─── A.2 Item (Default) ──── 90×56px ───────────────┐  │                  │
│   │  │  bg: transparent                                   │  │                  │
│   │  │  padding: 16px                                     │  │                  │
│   │  │  text: "CEVC3" (16px/700, #FFF, no glow)          │  │                  │
│   │  └────────────────────────────────────────────────────┘  │                  │
│   │                                                          │                  │
│   │  ┌─── A.3 Item (Default) ──── 91×56px ───────────────┐  │                  │
│   │  │  text: "CEVC4"                                     │  │                  │
│   │  └────────────────────────────────────────────────────┘  │                  │
│   │                                                          │                  │
│   │  ┌─── Item (Default) ─────── 91×56px ────────────────┐  │                  │
│   │  │  text: "CEVC1"                                     │  │                  │
│   │  └────────────────────────────────────────────────────┘  │                  │
│   │                                                          │                  │
│   │  ┌─── Item (Default) ─────── 91×56px ────────────────┐  │                  │
│   │  │  text: "OPD"                                       │  │                  │
│   │  └────────────────────────────────────────────────────┘  │                  │
│   │                                                          │                  │
│   │  ┌─── Item (Default) ─────── 91×56px ────────────────┐  │                  │
│   │  │  text: "Infra"                                     │  │                  │
│   │  └────────────────────────────────────────────────────┘  │                  │
│   │                                                          │                  │
│   └──────────────────────────────────────────────────────────┘                  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### A_Dropdown Container — `563:8027`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `563:8027` | — |
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

### A.1 Dropdown Item (Selected) — `I563:8027;563:7956`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I563:8027;563:7956` | — |
| width | 90px (hug) | `width: auto` / hug content |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| border-radius | 4px | `border-radius: 4px` |
| background | `rgba(255, 234, 158, 0.1)` | `background-color: rgba(255, 234, 158, 0.1)` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| justify-content | flex-start | `justify-content: flex-start` |
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

### A.2–A.N Dropdown Item (Default) — `I563:8027;563:7957` (example)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I563:8027;563:7957` (CEVC3), `I563:8027;563:7958` (CEVC4), etc. | — |
| width | ~90–91px (hug) | `width: auto` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| border-radius | 4px | `border-radius: 4px` |
| background | transparent | `background-color: transparent` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 4px | `gap: 4px` |
| cursor | pointer | `cursor: pointer` |

**Default Item Text:**

| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.5px | `letter-spacing: 0.5px` |
| color | `#FFFFFF` | `color: #FFFFFF` |
| text-align | center | `text-align: center` |
| text-shadow | none | No glow effect |

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
721:5684 — Dropdown Phòng ban (overlay frame, bg: #696969)
└── 563:8027 — A_Dropdown-List (Instance)
    │  bg: #00070C, border: 1px solid #998C5F, r: 8px, p: 6px
    │  flex-col, align-items: flex-start
    │
    ├── I563:8027;563:7956 — A.1 "CEVC2" [SELECTED]
    │   │  bg: rgba(255,234,158,0.1), r: 4px, p: 16px, h: 56px
    │   └── Text: "CEVC2" (Montserrat 16px/700, #FFF, text-shadow glow)
    │
    ├── I563:8027;563:7957 — A.2 "CEVC3" [DEFAULT]
    │   │  bg: transparent, r: 4px, p: 16px, h: 56px
    │   └── Text: "CEVC3" (Montserrat 16px/700, #FFF)
    │
    ├── I563:8027;563:7958 — A.3 "CEVC4" [DEFAULT]
    │   └── Text: "CEVC4"
    │
    ├── I563:8027;563:7959 — "CEVC1" [DEFAULT]
    │   └── Text: "CEVC1"
    │
    ├── I563:8027;563:7960 — "OPD" [DEFAULT]
    │   └── Text: "OPD"
    │
    └── I563:8027;563:7961 — "Infra" [DEFAULT]
        └── Text: "Infra"
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | 767px |
| Tablet | 768px | 1023px |
| Desktop | 1024px | ∞ |

### Responsive Changes

#### Mobile (< 768px)

| Component | Changes |
|-----------|---------|
| Dropdown container | max-height: 50vh, overflow-y: auto |
| Item width | 100% of dropdown container |

#### Tablet & Desktop (≥ 768px)

| Component | Changes |
|-----------|---------|
| Dropdown container | hug-content width, max-height: ~348px |
| No changes | Same as Figma design |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Dropdown | opacity, transform | 150ms | ease-out | Open/Close toggle |
| Item | background-color | 150ms | ease-in-out | Hover |
| Item (select) | text-shadow | 150ms | ease-in-out | Click |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class (Figma target) | React Component | Current Code Gap |
|----------------|---------------|--------------------------------------|-----------------|------------------|
| Dropdown container | `563:8027` | `bg-[#00070C] border border-[#998C5F] rounded-lg p-1.5 flex flex-col` | `<FilterDropdown>` (existing) | Container styles match ✓ |
| Item (selected) | `I563:8027;563:7956` | `bg-[rgba(255,234,158,0.1)] rounded p-4 h-14 [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]` | `<li role="option" aria-selected="true">` | Code uses `bg-[rgba(255,234,158,0.2)]` (0.2 not 0.1), no text-shadow, `px-4 py-2` not `p-4` |
| Item (default) | `I563:8027;563:7957` | `rounded p-4 h-14 hover:bg-[rgba(255,234,158,0.1)]` | `<li role="option">` | Code uses `px-4 py-2` not `p-4`, missing `h-14` |
| Item text | `I563:8027;563:7956;186:1497` | `text-base font-bold leading-6 tracking-[0.5px] text-white text-center` | `<span>` inside `<li>` | Code uses `text-sm` (14px), Figma needs `text-base` (16px) |

---

## Notes

- Dropdown container uses CSS variable `--Details-Container-2` for background and `--Details-Border` for border — these are Figma design tokens; in implementation use the actual hex values.
- The dropdown list in Figma shows 6 items but the full department list has ~50 entries — implementation MUST support scrolling with `overflow-y: auto` and a `max-height`.
- All text uses Montserrat 700 — consistent with the SAA 2025 dark theme.
- Selected item has a gold glow text-shadow matching the active nav item pattern used across the project.
- An existing `FilterDropdown` component exists at `src/components/kudos-live-board/filter-dropdown.tsx`. The implementation task is to **update its styles** to match this Figma spec — see the Implementation Mapping table above for specific gaps.
- All icons **MUST BE** in **Icon Component** instead of svg files or img tags.
