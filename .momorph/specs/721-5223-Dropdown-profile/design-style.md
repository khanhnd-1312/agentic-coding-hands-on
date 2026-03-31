# Design Style: Dropdown-profile (Profile Dropdown)

**Frame ID**: `721:5223`
**Frame Name**: `Dropdown-profile`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/721:5223
**Extracted At**: 2026-03-31

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-dropdown-bg | #00070C | 100% | Dropdown container background (Figma var: `Details-Container-2`) |
| --color-dropdown-border | #998C5F | 100% | Dropdown border (Figma var: `Details-Border`) |
| --color-selected-bg | #FFEA9E | 10% | Active/selected item highlight background `rgba(255,234,158,0.1)` |
| --color-hover-bg | #FFEA9E | 10% | Hover state background `rgba(255,234,158,0.1)` (predicted from design pattern) |
| --color-text-primary | #FFFFFF | 100% | Menu item text ("Profile", "Logout") |
| --color-text-glow | #FAE287 | - | Text glow effect on "Profile" label (text-shadow) |
| --color-focus-ring | #998C5F | 100% | Focus outline color (matches border) |
| --color-frame-bg | #696969 | 100% | Frame background (for context only, not part of component) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-menu-item | Montserrat | 16px | 700 (Bold) | 24px | 0.15px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-dropdown-padding | 6px | Dropdown container inner padding |
| --spacing-item-padding | 16px | Menu item internal padding (all sides) |
| --spacing-icon-text-gap | 4px | Gap between icon and label text |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-dropdown | 8px | Dropdown container |
| --radius-item | 4px | Menu item inner button |
| --border-dropdown | 1px solid #998C5F | Dropdown container border |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-text-glow | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` | Text glow on "Profile" label (always present — default style, not conditional) |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| width | auto (content-fit) | Wraps items, ~133px total (6+121+6) |
| padding | 6px | All sides |
| background | #00070C | Dark background |
| border | 1px solid #998C5F | Gold-toned border |
| border-radius | 8px | Rounded corners |
| z-index | 100 | Above fixed header (z-40) |
| position | absolute | Positioned below trigger element (avatar in header) |
| alignment | right-aligned | Dropdown's right edge aligns with trigger's right edge (avatar is at far-right of header) |

### Flex Layout

| Property | Value | Notes |
|----------|-------|-------|
| display | flex | Main layout |
| flex-direction | column | Vertical stack |
| align-items | flex-start | Items align left |

### Layout Structure (ASCII)

```
┌────────────────────────────────────────────────┐
│  Dropdown Container (p: 6px, radius: 8px)      │
│  bg: #00070C, border: 1px solid #998C5F        │
│  z-index: 100, position: absolute              │
│                                                 │
│  ┌────────────────────────────────────────────┐ │
│  │  A.1 Profile Item (119x56px, radius: 4px)  │ │
│  │  bg: rgba(255,234,158,0.1)                 │ │
│  │  ┌──────────────────────────────────────┐  │ │
│  │  │  Inner (p: 16px, flex row)           │  │ │
│  │  │  align: center, gap: 4px             │  │ │
│  │  │  ┌──────────┐  ┌──────┐             │  │ │
│  │  │  │ Profile  │  │  👤  │              │  │ │
│  │  │  │ 16px Bold│  │24x24 │              │  │ │
│  │  │  │ glow     │  │ icon │              │  │ │
│  │  │  └──────────┘  └──────┘             │  │ │
│  │  └──────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────┘ │
│                                                 │
│  ┌────────────────────────────────────────────┐ │
│  │  A.2 Logout Item (121x56px)                │ │
│  │  bg: transparent                           │ │
│  │  ┌──────────────────────────────────────┐  │ │
│  │  │  Inner (p: 16px, flex row)           │  │ │
│  │  │  align: center, gap: 4px             │  │ │
│  │  │  ┌──────────┐  ┌──────┐             │  │ │
│  │  │  │ Logout   │  │  ›   │              │  │ │
│  │  │  │ 16px Bold│  │24x24 │              │  │ │
│  │  │  │ white    │  │ icon │              │  │ │
│  │  │  └──────────┘  └──────┘             │  │ │
│  │  └──────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

---

## Component Style Details

### A. Dropdown Container (`A_Dropdown-List`)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `666:9601` | - |
| **Component ID** | `563:7882` | Component set: `563:8216` |
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

### A.1. Profile Menu Item (`A.1_Profile`)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I666:9601;563:7844` | - |
| **Component ID** | `186:1496` | Component set: `186:1426` |
| width | 119px | `width: 119px` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| border-radius | 4px | `border-radius: 4px` |
| background | rgba(255, 234, 158, 0.1) | `background: rgba(255, 234, 158, 0.1)` |
| cursor | pointer | `cursor: pointer` |

#### Content Group (Text + Icon)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I666:9601;563:7844;186:2012` | - |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 4px | `gap: 4px` |
| width | 56px | `width: 56px` |
| height | 24px | `height: 24px` |

#### Profile Label Text

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I666:9601;563:7844;186:1497` | - |
| content | "Profile" | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| text-align | center | `text-align: center` |
| color | #FFFFFF | `color: var(--Details-Text-Secondary-1, #FFF)` |
| text-shadow | 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 | Gold glow effect |

#### User Avatar Icon (IC)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I666:9601;563:7844;186:1498` | - |
| **Component ID** | `186:1611` | Component set: `178:1020` |
| **Codebase icon name** | `user-avatar` | `<Icon name="user-avatar" size={24} />` |
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |
| fill | `white` (hardcoded in SVG) | Does NOT inherit from `color` — always renders white |
| Note | User/person silhouette icon | Placed to the right of "Profile" text |

---

### A.2. Logout Menu Item (`A.2_Logout`)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I666:9601;563:7868` | - |
| **Component ID** | `186:1433` | Component set: `186:1426` |
| width | 121px | `width: 121px` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| border-radius | 4px | `border-radius: 4px` |
| background | transparent | `background: transparent` |
| cursor | pointer | `cursor: pointer` |

#### Content Group (Text + Icon)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I666:9601;563:7868;186:1937` | - |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 4px | `gap: 4px` |
| width | 61px | `width: 61px` |
| height | 24px | `height: 24px` |

#### Logout Label Text

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I666:9601;563:7868;186:1439` | - |
| content | "Logout" | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| text-align | center | `text-align: center` |
| color | #FFFFFF | `color: var(--Details-Text-Secondary-1, #FFF)` |

#### Chevron Right Icon (IC)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I666:9601;563:7868;186:1441` | - |
| **Component ID** | `335:10890` | Component set: `178:1020` |
| **Codebase icon name** | `chevron-right` | `<Icon name="chevron-right" size={24} />` |
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |
| fill | `currentColor` | **Inherits from parent `color` CSS** — set `color: white` on parent |
| Note | Chevron/arrow pointing right | Indicates navigation action |

---

## Component Hierarchy with Styles

```
Dropdown Container (bg: #00070C, border: 1px solid #998C5F, radius: 8px, p: 6px, z: 100)
├── Profile Item (119x56, bg: rgba(255,234,158,0.1), radius: 4px)
│   └── Button Inner (p: 16px, flex row, align-center, gap: 4px)
│       ├── Text "Profile" (Montserrat 16px/24px Bold, #FFF, glow: 0 0 6px #FAE287)
│       └── User Avatar Icon (24x24, icon: "user-avatar")
│
└── Logout Item (121x56, bg: transparent)
    └── Button Inner (p: 16px, flex row, align-center, gap: 4px)
        ├── Text "Logout" (Montserrat 16px/24px Bold, #FFF)
        └── Chevron Right Icon (24x24, icon: "chevron-right")
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

**Note**: The dropdown position is determined by its trigger element (user avatar in the header). The dropdown itself has fixed dimensions. On narrow viewports (360px), ensure the dropdown does not extend beyond the right edge of the screen.

---

## Icon Specifications

| Icon Name | Size | Source | Component ID | Codebase Name | Usage |
|-----------|------|--------|--------------|---------------|-------|
| user-avatar (person silhouette) | 24x24px | Component set `178:1020` | `186:1611` | `user-avatar` ✅ | Profile menu item icon |
| chevron-right | 24x24px | Component set `178:1020` | `335:10890` | `chevron-right` ✅ | Logout menu item icon (indicates navigation) |

**Note**: Both icons exist in the `<Icon>` component at `src/components/ui/icon.tsx`. Verified 2026-03-31.

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Dropdown | opacity, transform(scaleY) | 150ms | ease-out | Open/Close toggle |
| Menu Item | background-color | 150ms | ease-in-out | Hover |
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

### Menu Item States

| State | Property | Value | Notes |
|-------|----------|-------|-------|
| Default (Logout) | background | `transparent` | Logout item default |
| Default (Profile) | background + text-shadow | `rgba(255, 234, 158, 0.1)` + glow `0 0 6px #FAE287` | Profile item **always** has highlighted bg + glow — this is its default, not conditional |
| Hover | background | `rgba(255, 234, 158, 0.1)` | Gold-tinted hover highlight (on Logout; Profile already has this bg) |
| Focus | outline | `2px solid #998C5F`, `outline-offset: -2px` | Keyboard focus indicator |
| Focus + Hover | background + outline | `rgba(255,234,158,0.1)` + `2px solid #998C5F` | Combined states |
| Loading (Logout only) | opacity | `0.5`, `cursor: not-allowed`, `pointer-events: none` | While `signOut()` is processing (predicted — not in Figma) |

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
| Dropdown Container | `666:9601` | `flex flex-col p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg z-[100] absolute right-0` | `<ProfileDropdown />` (dropdown panel) |
| Profile Item | `I666:9601;563:7844` | `w-[121px] h-14 bg-[rgba(255,234,158,0.1)] rounded p-4 flex items-center gap-1 cursor-pointer` | `role="menuitem"` button (Profile) |
| Logout Item | `I666:9601;563:7868` | `w-[121px] h-14 bg-transparent hover:bg-[rgba(255,234,158,0.1)] rounded p-4 flex items-center gap-1 cursor-pointer text-white` | `role="menuitem"` button (Logout) |
| Profile Text | `I666:9601;563:7844;186:1497` | `font-montserrat text-base font-bold text-white tracking-[0.15px] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]` | `<span>` inside Profile item |
| Logout Text | `I666:9601;563:7868;186:1439` | `font-montserrat text-base font-bold text-white tracking-[0.15px]` | `<span>` inside Logout item |
| User Icon | `I666:9601;563:7844;186:1498` | `w-6 h-6` | `<Icon name="user-avatar" size={24} />` |
| Chevron Right Icon | `I666:9601;563:7868;186:1441` | `w-6 h-6` | `<Icon name="chevron-right" size={24} />` |

---

## Notes

- All colors should use CSS variables matching the project's design token system (`Details-Border`, `Details-Container-2`, `Details-Text-Secondary-1`)
- Icons are from component set `178:1020` — reuse existing `<Icon>` component
- The dropdown is a purely client-side component (`"use client"`) — requires Supabase client for logout action
- Font: Montserrat must be loaded — already available in project fonts at `src/fonts/`
- **Width normalization**: Figma shows Profile 119px vs Logout 121px (2px difference). For cleaner implementation, use **121px for both** items.
- **Text glow on Profile**: The "Profile" label has a special text-shadow glow effect (`0 0 6px #FAE287`) and highlighted background as its **default** appearance — always present, not conditional on the current route. This visually distinguishes it as the primary action in the dropdown.
- **Difference from Admin variant**: The "Dropdown-profile Admin" (`721:5277`) has an additional "Dashboard" menu item between Profile and Logout. This spec covers only the regular user variant with two items.
- The dropdown shares the same `Dropdown-List` component set (`563:8216`) as the language dropdown, ensuring visual consistency.
