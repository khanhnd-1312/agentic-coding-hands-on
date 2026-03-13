# Design Style: Dropdown-ngon-ngu (Language Dropdown)

**Frame ID**: `721:4942`
**Frame Name**: `Dropdown-ngon-ngu`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/721:4942
**Extracted At**: 2026-03-13

---

## Implementation Gap Notice

> The existing `LanguageSelector` component (`src/components/login/language-selector.tsx`) uses **different styling** than the Figma design. The values in this document are extracted from Figma and are the **source of truth**.
>
> | Property | Current Code | Figma (correct) |
> |----------|-------------|-----------------|
> | Container bg | `rgba(11,15,18,0.95)` | `#00070C` |
> | Container border | `#2E3940` | `#998C5F` |
> | Selected indicator | Teal text `#15D5CA` | Gold bg `rgba(255,234,158,0.2)` |
> | Hover state | `rgba(255,255,255,0.08)` | `rgba(255,234,158,0.1)` (predicted) |

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-dropdown-bg | #00070C | 100% | Dropdown container background (Figma var: `Details-Container-2`) |
| --color-dropdown-border | #998C5F | 100% | Dropdown border (Figma var: `Details-Border`) |
| --color-selected-bg | #FFEA9E | 20% | Selected item highlight background `rgba(255,234,158,0.2)` |
| --color-hover-bg | #FFEA9E | 10% | Hover state background `rgba(255,234,158,0.1)` (predicted from design pattern) |
| --color-text-label | #FFFFFF | 100% | Language code text (VN, EN) |
| --color-focus-ring | #998C5F | 100% | Focus outline color (matches border) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-lang-code | Montserrat | 16px | 700 (Bold) | 24px | 0.15px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-dropdown-padding | 6px | Dropdown container inner padding |
| --spacing-item-padding | 16px | Language item internal padding (all sides) |
| --spacing-icon-text-gap | 4px | Gap between flag icon and language code |
| --spacing-inner-gap | 2px | Gap within button inner layout |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-dropdown | 8px | Dropdown container |
| --radius-item-inner | 4px | Language item inner button |
| --radius-selected-outer | 2px | Selected item outer wrapper |
| --border-dropdown | 1px solid #998C5F | Dropdown container border |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| (none) | - | No shadows in this component per Figma |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| width | auto (content-fit) | Wraps items, ~122px total (6+110+6) |
| padding | 6px | All sides |
| background | #00070C | Dark background |
| border | 1px solid #998C5F | Gold-toned border |
| border-radius | 8px | Rounded corners |
| z-index | 100 | Above fixed header (z-40) |
| position | absolute | Positioned below trigger element |

### Flex Layout

| Property | Value | Notes |
|----------|-------|-------|
| display | flex | Main layout |
| flex-direction | column | Vertical stack |
| align-items | flex-start | Items align left |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────────┐
│  Dropdown Container (p: 6px, radius: 8px)    │
│  bg: #00070C, border: 1px solid #998C5F      │
│  z-index: 100, position: absolute            │
│                                               │
│  ┌──────────────────────────────────────────┐ │
│  │  Selected Item (110x56px, radius: 2px)   │ │
│  │  bg: rgba(255,234,158,0.2)               │ │
│  │  ┌────────────────────────────────────┐  │ │
│  │  │  Inner (p: 16px, radius: 4px)      │  │ │
│  │  │  flex row, justify: space-between  │  │ │
│  │  │  ┌──────┐  ┌────┐                 │  │ │
│  │  │  │🇻🇳   │  │ VN │                  │  │ │
│  │  │  │24x24 │  │16px│                  │  │ │
│  │  │  │      │  │Bold│                  │  │ │
│  │  │  └──────┘  └────┘                 │  │ │
│  │  │  gap: 4px                          │  │ │
│  │  └────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────┘ │
│                                               │
│  ┌──────────────────────────────────────────┐ │
│  │  Option Item (110x56px, no radius)       │ │
│  │  bg: transparent                         │ │
│  │  ┌────────────────────────────────────┐  │ │
│  │  │  Inner (p: 16px, radius: 4px)      │  │ │
│  │  │  flex row, justify: space-between  │  │ │
│  │  │  ┌──────┐  ┌────┐                 │  │ │
│  │  │  │🇬🇧   │  │ EN │                  │  │ │
│  │  │  │24x24 │  │16px│                  │  │ │
│  │  │  │      │  │Bold│                  │  │ │
│  │  │  └──────┘  └────┘                 │  │ │
│  │  │  gap: 4px                          │  │ │
│  │  └────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

---

## Component Style Details

### A. Dropdown Container (`A_Dropdown-List`)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `525:11713` | - |
| **Component ID** | `362:6179` | Component set: `563:8216` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| align-items | flex-start | `align-items: flex-start` |
| padding | 6px | `padding: 6px` |
| background | #00070C | `background: var(--Details-Container-2, #00070C)` |
| border | 1px solid #998C5F | `border: 1px solid var(--Details-Border, #998C5F)` |
| border-radius | 8px | `border-radius: 8px` |
| z-index | 100 | `z-index: 100` |
| position | absolute | `position: absolute` |

---

### A.1. Selected Language Item - Vietnamese (`A.1_tieng Viet`)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I525:11713;362:6085` | - |
| **Component ID** | `186:1692` | Component set: `186:1695` |
| width | 108px (Figma) → use 110px for uniform sizing | `width: 110px` |
| height | 56px | `height: 56px` |
| border-radius | 2px (outer), 4px (inner) | `border-radius: 2px` |
| background | rgba(255, 234, 158, 0.2) | `background: rgba(255, 234, 158, 0.2)` |
| cursor | pointer | `cursor: pointer` |

#### Inner Button

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I525:11713;362:6085;186:1821` | - |
| width | 108px | `width: 108px` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| justify-content | space-between | `justify-content: space-between` |
| align-items | center | `align-items: center` |
| gap | 2px | `gap: 2px` |
| border-radius | 4px | `border-radius: 4px` |

#### Content Group (Flag + Text)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I525:11713;362:6085;186:1821;186:1937` | - |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 4px | `gap: 4px` |
| width | 53px | `width: 53px` |
| height | 24px | `height: 24px` |

#### Flag Icon (VN)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I525:11713;362:6085;186:1821;186:1709` | - |
| **Component ID** | `178:1019` | Component set: `178:1020` |
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |
| Inner flag | 20x15px | Centered within 24x24 container |
| Colors | Red: #E31D1C, Star: #FFD221 | Original flag colors |

#### Language Code Text (VN)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I525:11713;362:6085;186:1821;186:1439` | - |
| content | "VN" | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| text-align | center | `text-align: center` |
| color | #FFFFFF | `color: #FFFFFF` |

---

### A.2. Option Language Item - English (`A.2_tieng Anh`)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I525:11713;362:6128` | - |
| **Component ID** | `186:1694` | Component set: `186:1695` |
| width | 110px | `width: 110px` |
| height | 56px | `height: 56px` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | center | `justify-content: center` |
| background | transparent | `background: transparent` |
| cursor | pointer | `cursor: pointer` |

#### Inner Button

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I525:11713;362:6128;186:1903` | - |
| width | 110px | `width: 110px` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| justify-content | space-between | `justify-content: space-between` |
| align-items | center | `align-items: center` |
| border-radius | 4px | `border-radius: 4px` |

#### Content Group (Flag + Text)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I525:11713;362:6128;186:1903;186:1937` | - |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 4px | `gap: 4px` |
| width | 52px | `width: 52px` |
| height | 24px | `height: 24px` |

#### Flag Icon (EN / GB-NIR)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I525:11713;362:6128;186:1903;186:1709` | - |
| **Component ID** | `178:967` | Component set: `178:1020` |
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |
| Inner flag | 20x15px | Centered within 24x24 container |
| Note | UK/Northern Ireland flag | Union Jack design |

#### Language Code Text (EN)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I525:11713;362:6128;186:1903;186:1439` | - |
| content | "EN" | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| text-align | center | `text-align: center` |
| color | #FFFFFF | `color: #FFFFFF` |

---

## Component Hierarchy with Styles

```
Dropdown Container (bg: #00070C, border: 1px solid #998C5F, radius: 8px, p: 6px, z: 100)
├── Selected Item - VN (110x56, bg: rgba(255,234,158,0.2), radius: 2px)
│   └── Button Inner (p: 16px, flex row, justify-between, align-center, radius: 4px, gap: 2px)
│       └── Content (flex row, gap: 4px, align-center)
│           ├── Flag Icon VN (24x24, inner flag 20x15, colors: #E31D1C + #FFD221)
│           └── Text "VN" (Montserrat 16px/24px Bold, #FFF, ls: 0.15px)
│
└── Option Item - EN (110x56, bg: transparent)
    └── Button Inner (p: 16px, flex row, justify-between, align-center, radius: 4px)
        └── Content (flex row, gap: 4px, align-center)
            ├── Flag Icon EN (24x24, inner flag 20x15, Union Jack)
            └── Text "EN" (Montserrat 16px/24px Bold, #FFF, ls: 0.15px)
```

---

## Responsive Specifications

### Breakpoints

This component is a small overlay dropdown. Its dimensions remain fixed across all breakpoints.

| Name | Min Width | Max Width | Changes |
|------|-----------|-----------|---------|
| Mobile | 0 | 639px | No dimension change. Verify dropdown does not overflow viewport edge. |
| Tablet | 640px | 1023px | No change |
| Desktop | 1024px | -- | No change |

**Breakpoints to verify per constitution**: 360px (mobile), 768px (tablet), 1440px (desktop)

**Note**: The dropdown position is determined by its trigger element (language selector button in the header). The dropdown itself has fixed dimensions. On narrow viewports (360px), ensure the dropdown does not extend beyond the right edge of the screen.

---

## Icon Specifications

| Icon Name | Size | Source | Status | Usage |
|-----------|------|--------|--------|-------|
| flag-vn | 20x15px (in 24x24 container) | Component `178:1019` (set: `178:1020`) | Exists in `Icon` component | Vietnamese flag |
| flag-en (GB-NIR) | 20x15px (in 24x24 container) | Component `178:967` (set: `178:1020`) | **MISSING — must be added** | English/UK flag |

**Action required**: Add `flag-en` SVG to the `Icon` component at `src/components/ui/icon.tsx`. The icon should render the Union Jack / Northern Ireland flag at 20x15px within a 24x24 viewBox.

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Dropdown | opacity, transform(scaleY) | 150ms | ease-out | Open/Close toggle |
| Option Item | background-color | 150ms | ease-in-out | Hover |
| Focus ring | outline | 0ms | immediate | Focus |

### Open Animation
```css
/* Closed */
opacity: 0; transform: scaleY(0.95); transform-origin: top;
/* Open */
opacity: 1; transform: scaleY(1);
/* Transition */
transition: opacity 150ms ease-out, transform 150ms ease-out;
```

---

## Interactive States

### Option Item States

| State | Property | Value | Notes |
|-------|----------|-------|-------|
| Default | background | `transparent` | Unselected option |
| Hover | background | `rgba(255, 234, 158, 0.1)` | Predicted from design system gold palette |
| Selected | background | `rgba(255, 234, 158, 0.2)` | From Figma: currently active language |
| Focus | outline | `2px solid #998C5F`, `outline-offset: -2px` | Keyboard focus indicator |
| Focus + Selected | background + outline | `rgba(255,234,158,0.2)` + `2px solid #998C5F` | Combined states |

### Dropdown Container States

| State | Description |
|-------|-------------|
| Closed | `display: none` or `opacity: 0; pointer-events: none` |
| Opening | Animating in (150ms) |
| Open | Fully visible, interactive |
| Closing | Animating out (150ms), `pointer-events: none` |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Dropdown Container | `525:11713` | `flex flex-col p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg z-[100] absolute` | Part of `<LanguageSelector />` (dropdown panel) |
| Selected Item | `I525:11713;362:6085` | `w-[110px] h-14 bg-[rgba(255,234,158,0.2)] rounded-sm cursor-pointer` | `<LanguageOption selected />` or `role="option"` div |
| Option Item | `I525:11713;362:6128` | `w-[110px] h-14 bg-transparent hover:bg-[rgba(255,234,158,0.1)] cursor-pointer` | `<LanguageOption />` or `role="option"` div |
| Item Inner | various | `flex items-center justify-between p-4 rounded gap-0.5` | (part of option) |
| Content Group | various | `flex items-center gap-1` | (part of option) |
| Flag Icon VN | `178:1019` | `w-6 h-6` | `<Icon name="flag-vn" size={24} />` |
| Flag Icon EN | `178:967` | `w-6 h-6` | `<Icon name="flag-en" size={24} />` |
| Language Text | various | `font-montserrat text-base font-bold text-white tracking-[0.15px] text-center` | `<span>` inside option |

---

## Notes

- All colors should use CSS variables matching the project's design token system (`Details-Border`, `Details-Container-2`)
- Flag icons are from component set `178:1020` — reuse existing `<Icon>` component. **`flag-en` must be added.**
- The dropdown is a purely client-side component (`"use client"`) — no server data fetching needed
- Language preference is stored via cookie: `lang=vi|en; path=/; max-age=31536000`
- Font: Montserrat must be loaded — already available in project fonts at `src/fonts/`
- The existing `LanguageSelector` component at `src/components/login/language-selector.tsx` needs visual updates to match these Figma-based values
- **Item order is fixed**: VN always first, EN always second. The selected highlight (`rgba(255,234,158,0.2)`) moves to whichever language is active — items do NOT reorder.
- **Width normalization**: Figma shows Selected 108px vs Option 110px (2px difference). For cleaner implementation, use **110px for both** items.
