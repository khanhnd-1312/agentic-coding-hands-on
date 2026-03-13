# Design Style: Countdown - Prelaunch Page

**Frame ID**: `2268:35127`
**Frame Name**: `Countdown - Prelaunch page`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/2268:35127
**Extracted At**: 2026-03-12

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-bg-dark | #00101A | 100% | Page background color |
| --color-bg-gradient-start | #00101A | 100% | Gradient bottom (solid) |
| --color-bg-gradient-mid | #00121D | 46% | Gradient middle |
| --color-bg-gradient-end | #001320 | 0% | Gradient top (transparent) |
| --color-text-primary | #FFFFFF | 100% | Heading text, digit text, labels |
| --color-digit-border | #FFEA9E | 100% | Digit card border (gold) |
| --color-digit-bg-start | #FFFFFF | 100% | Digit card gradient top |
| --color-digit-bg-end | #FFFFFF | 10% | Digit card gradient bottom |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-countdown-heading | Montserrat | 36px | 700 (Bold Italic) | 48px | 0px |
| --text-countdown-digit | Digital Numbers | 73.73px | 400 (Regular) | auto | 0% |
| --text-countdown-label | Montserrat | 36px | 700 (Bold) | 48px | 0px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-digit-gap | 21px | Gap between two digit cards in a unit |
| --spacing-unit-gap | 60px | Gap between time units (Days, Hours, Minutes) |
| --spacing-heading-to-timer | 24px | Gap between heading and countdown timer |
| --spacing-digits-to-label | 21px | Gap between digit cards and unit label |
| --spacing-container-padding-x | 144px | Horizontal padding of main container |
| --spacing-container-padding-y | 96px | Vertical padding of main container |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-digit-card | 12px | Digit card border radius |
| --border-digit-card | 0.75px solid #FFEA9E | Digit card border (gold) |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --blur-digit-card | blur(24.96px) | Backdrop blur on digit cards (glassmorphism) |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 1512px (100vw) | Full viewport width |
| height | 1077px (100vh) | Full viewport height |
| background | #00101A | Dark navy background |
| position | relative | For absolute-positioned layers |

### Layout Structure (ASCII)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Page Container (1512 x 1077, bg: #00101A, position: relative)          │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  BG Image Layer (absolute, 1512x1077, z-0)                       │  │
│  │  background-image: url(bg-image), cover                          │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  Gradient Overlay (absolute, 1512x1077, z-10)                    │  │
│  │  linear-gradient(18deg, #00101A 15%, rgba(0,18,29,0.46) 52%,     │  │
│  │  transparent 63%)                                                │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  Content Container "Bia" (absolute, 1512x456, z-20)              │  │
│  │  padding: 96px 144px, flex, col, center, gap: 120px              │  │
│  │  positioned: y=218 to y=673                                      │  │
│  │                                                                   │  │
│  │  ┌───────────────────────────────────────────────────────────┐    │  │
│  │  │  Heading: "Sự kiện sẽ bắt đầu sau"                         │    │  │
│  │  │  Montserrat 36px/48px Bold, #FFFFFF, text-align: center    │    │  │
│  │  └───────────────────────────────────────────────────────────┘    │  │
│  │                        gap: 24px                                  │  │
│  │  ┌───────────────────────────────────────────────────────────┐    │  │
│  │  │  Time Container (644x192, flex, row, gap: 60px, center)    │    │  │
│  │  │                                                            │    │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                │    │  │
│  │  │  │ 1_Days   │  │ 2_Hours  │  │3_Minutes │                │    │  │
│  │  │  │ 175x192  │  │ 175x192  │  │ 175x192  │                │    │  │
│  │  │  │          │  │          │  │          │                │    │  │
│  │  │  │ [0][0]   │  │ [0][5]   │  │ [2][0]   │                │    │  │
│  │  │  │  DAYS    │  │  HOURS   │  │ MINUTES  │                │    │  │
│  │  │  └──────────┘  └──────────┘  └──────────┘                │    │  │
│  │  └───────────────────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Background Image — `MM_MEDIA_BG Image`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2268:35129` | - |
| width | 1512px (100%) | `width: 100%` |
| height | 1077px (100%) | `height: 100%` |
| position | absolute | `position: absolute; inset: 0` |
| background | url(...) lightgray | `background: url(/images/countdown-bg.webp) center/cover no-repeat` |
| background-position | -142px -789.753px | Custom offset (use `object-position` with Next.js Image) |
| background-size | 109.392% 216.017% | Zoomed in crop |
| z-index | 0 | `z-index: 0` (bottom layer) |

> **Note on z-index**: Figma uses `z-index: 1` for all layers (flat stacking). For implementation, use logical stacking: BG Image z-0, Gradient z-10, Content z-20.

---

### Gradient Overlay — `Cover`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2268:35130` | - |
| width | 1512px (100%) | `width: 100%` |
| height | 1077px (100%) | `height: 100%` |
| position | absolute | `position: absolute; inset: 0` |
| background | linear-gradient(18deg, ...) | `background: linear-gradient(18deg, #00101A 15.48%, rgba(0, 18, 29, 0.46) 52.13%, rgba(0, 19, 32, 0) 63.41%)` |
| z-index | 10 | `z-index: 10` (middle layer) |

---

### Content Container — `Bia`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2268:35131` | - |
| width | 1512px (100%) | `width: 100%` |
| height | 456px | `height: auto` (use flex centering) |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| align-items | center | `align-items: center` |
| justify-content | center | `justify-content: center` |
| padding | 96px 144px | `padding: 96px 144px` |
| gap | 120px | `gap: 120px` |
| position | absolute | `position: absolute` |
| z-index | 20 | `z-index: 20` (top layer — content above gradient) |

---

### Heading Text — `"Sự kiện sẽ bắt đầu sau"`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2268:35137` | - |
| width | 1512px (100%) | `width: 100%` |
| height | 48px | `height: auto` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 36px | `font-size: 36px` |
| font-weight | 700 | `font-weight: 700` |
| font-style | italic | `font-style: italic` |
| line-height | 48px | `line-height: 48px` |
| letter-spacing | 0px | `letter-spacing: 0` |
| color | #FFFFFF | `color: #FFFFFF` |
| text-align | center | `text-align: center` |

> **Visual verification**: The heading text is rendered in **italic** as confirmed by the frame screenshot. This applies to the full heading text only — unit labels (DAYS/HOURS/MINUTES) are NOT italic.

---

### Countdown Timer Container — `Time`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2268:35138` | - |
| width | 644px | `width: auto` (content-sized) |
| height | 192px | `height: auto` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 60px | `gap: 60px` |

---

### Time Unit — `1_Days` / `2_Hours` / `3_Minutes`

| Property | Value | CSS |
|----------|-------|-----|
| **Node IDs** | `2268:35139` (Days), `2268:35144` (Hours), `2268:35149` (Minutes) | - |
| width | 175px | `width: auto` |
| height | 192px | `height: auto` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| align-items | flex-start | `align-items: flex-start` |
| gap | 21px | `gap: 21px` |

---

### Digit Pair Container — `Frame 485`

| Property | Value | CSS |
|----------|-------|-----|
| **Node IDs** | `2268:35140`, `2268:35145`, `2268:35150` | - |
| width | 175px | `width: auto` |
| height | 123px | `height: auto` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 21px | `gap: 21px` |

---

### Single Digit Card — `Group 5` / `Group 4` (Component Instance)

| Property | Value | CSS |
|----------|-------|-----|
| **Component ID** | `186:2619` | - |
| **Example Node IDs** | `2268:35141`, `2268:35142`, `2268:35146`, `2268:35147`, `2268:35151`, `2268:35152` | - |
| width | 77px | `width: 77px` |
| height | 123px | `height: 123px` |

#### Inner Rectangle (glassmorphism card)

| Property | Value | CSS |
|----------|-------|-----|
| **Example Node IDs** | `I2268:35141;186:2616` | - |
| width | 76.8px | `width: 100%` |
| height | 122.88px | `height: 100%` |
| border | 0.75px solid #FFEA9E | `border: 0.75px solid #FFEA9E` |
| border-radius | 12px | `border-radius: 12px` |
| opacity | 0.5 | `opacity: 0.5` |
| background | linear-gradient(180deg, #FFF 0%, rgba(255,255,255,0.10) 100%) | `background: linear-gradient(180deg, #FFF 0%, rgba(255,255,255,0.10) 100%)` |
| backdrop-filter | blur(24.96px) | `backdrop-filter: blur(24.96px)` |

> **CRITICAL Implementation Note**: The `opacity: 0.5` in Figma applies ONLY to this background rectangle, NOT to the digit text rendered on top. In CSS, if you set `opacity: 0.5` on a parent element, child elements inherit the opacity. To achieve the correct effect, the digit card MUST use a layered approach:
> - The glassmorphism background rectangle is an **absolutely positioned child** with `opacity: 0.5`
> - The digit text is a **separate sibling** positioned on top with `opacity: 1` (full opacity)
> - Alternatively, use `rgba()` colors in the gradient instead of a separate opacity property: `background: linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.05) 100%)`

#### Digit Text

| Property | Value | CSS |
|----------|-------|-----|
| **Example Node IDs** | `I2268:35141;186:2617` | - |
| font-family | Digital Numbers | `font-family: 'Digital Numbers', monospace` |
| font-size | 73.73px | `font-size: 73.73px` |
| font-weight | 400 | `font-weight: 400` |
| color | #FFFFFF | `color: #FFFFFF` |
| text-align | left | `text-align: center` (center within card) |
| width | 59px | `width: auto` |
| height | 95px | `height: auto` |

---

### Unit Label — `DAYS` / `HOURS` / `MINUTES`

| Property | Value | CSS |
|----------|-------|-----|
| **Node IDs** | `2268:35143` (DAYS), `2268:35148` (HOURS), `2268:35153` (MINUTES) | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 36px | `font-size: 36px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 48px | `line-height: 48px` |
| letter-spacing | 0px | `letter-spacing: 0` |
| color | #FFFFFF | `color: #FFFFFF` |
| text-align | left | `text-align: left` |

---

## Component Hierarchy with Styles

```
Page (bg: #00101A, w: 100vw, h: 100vh, position: relative, overflow: hidden)
├── BG Image (absolute, inset: 0, z-0, object-fit: cover)
├── Gradient Overlay (absolute, inset: 0, z-10, gradient 18deg)
└── Content "Bia" (absolute, z-20, flex, col, center, p: 96px 144px, gap: 120px)
    └── Countdown Section (flex, col, center, gap: 24px)
        ├── Heading "Sự kiện sẽ bắt đầu sau" (Montserrat 36px/48px bold italic, #FFF, center)
        └── Time Container (flex, row, center, gap: 60px)
            ├── Days Unit (flex, col, gap: 21px)
            │   ├── Digit Pair (flex, row, gap: 21px)
            │   │   ├── Digit Card (77x123, glassmorphism, border: #FFEA9E)
            │   │   │   └── Digit "0" (Digital Numbers 73.73px, #FFF)
            │   │   └── Digit Card (77x123, glassmorphism, border: #FFEA9E)
            │   │       └── Digit "0" (Digital Numbers 73.73px, #FFF)
            │   └── Label "DAYS" (Montserrat 36px/48px bold, #FFF)
            ├── Hours Unit (flex, col, gap: 21px)
            │   ├── Digit Pair (flex, row, gap: 21px)
            │   │   ├── Digit Card → "0"
            │   │   └── Digit Card → "5"
            │   └── Label "HOURS"
            └── Minutes Unit (flex, col, gap: 21px)
                ├── Digit Pair (flex, row, gap: 21px)
                │   ├── Digit Card → "2"
                │   └── Digit Card → "0"
                └── Label "MINUTES"
```

---

## Responsive Specifications

> **Note**: Only the desktop (1512px) design exists in Figma. Mobile and tablet values below are **extrapolated** based on proportion scaling and constitution guidelines. Verify at QA checkpoints: **360px**, **768px**, **1440px** (per constitution IV).

### Breakpoints (per constitution)

| Name | Tailwind | Min Width | QA Checkpoint |
|------|----------|-----------|---------------|
| Mobile | default | 0 | 360px |
| Tablet | `md:` | 768px | 768px |
| Desktop | `lg:` | 1024px | 1440px |
| Wide | `xl:` | 1280px | — |

### Responsive Changes

#### Mobile (< 768px) — verify at 360px

| Component | Changes |
|-----------|---------|
| Container padding | 24px 16px |
| Heading font-size | 20px, line-height: 28px |
| Digit card | 48px x 77px (scaled down) |
| Digit font-size | 46px |
| Unit label font-size | 18px, line-height: 24px |
| Unit gap | 24px (instead of 60px) |
| Digit gap | 12px (instead of 21px) |
| Digits-to-label gap | 12px |

#### Tablet (768px - 1023px) — verify at 768px

| Component | Changes |
|-----------|---------|
| Container padding | 48px 32px |
| Heading font-size | 28px, line-height: 36px |
| Digit card | 60px x 96px |
| Digit font-size | 56px |
| Unit label font-size | 24px |
| Unit gap | 40px |

#### Desktop (>= 1024px) — verify at 1440px

| Component | Changes |
|-----------|---------|
| Container padding | 96px 144px |
| All values | As per Figma design (default) |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Digit text | opacity, transform | 300ms | ease-in-out | Countdown tick (digit change) |
| Page | opacity | 500ms | ease-out | Initial load (fade in) |
| Redirect | opacity | 300ms | ease-in | Countdown reaches zero (fade out before redirect) |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Page Container | `2268:35127` | `relative w-full h-screen bg-[#00101A] overflow-hidden` | `<CountdownPage />` |
| BG Image | `2268:35129` | `absolute inset-0 z-0` | `<Image>` (Next.js) |
| Gradient Overlay | `2268:35130` | `absolute inset-0 z-10` + inline gradient | `<div>` |
| Content Area | `2268:35131` | `absolute inset-0 z-20 flex flex-col items-center justify-center` | `<div>` |
| Heading | `2268:35137` | `text-4xl font-bold italic text-white text-center font-montserrat` | `<h1>` |
| Timer Container | `2268:35138` | `flex items-center gap-[60px]` | `<CountdownTimer />` |
| Time Unit | `2268:35139` etc. | `flex flex-col items-start gap-[21px]` | `<CountdownUnit />` |
| Digit Pair | `2268:35140` etc. | `flex items-center gap-[21px]` | `<div>` inside `<CountdownUnit>` |
| Digit Card | `186:2619` (component) | `w-[77px] h-[123px] relative` | `<DigitCard />` |
| Digit Card BG | `186:2616` | `absolute inset-0 rounded-xl border-[0.75px] border-[#FFEA9E] backdrop-blur-[25px]` + rgba gradient (see CRITICAL note) | `<div>` inside `<DigitCard>` |
| Digit Text | `186:2617` | `text-[73.73px] text-white font-digital` | `<span>` inside `<DigitCard>` |
| Unit Label | `2268:35143` etc. | `text-4xl font-bold text-white font-montserrat` | `<span>` inside `<CountdownUnit>` |

---

## Custom Fonts

| Font Name | Usage | Source |
|-----------|-------|--------|
| Montserrat | Heading, unit labels | Google Fonts |
| Digital Numbers | Countdown digits | Custom font file (needs to be added to project) |

---

## Notes

- All colors should use CSS variables for theming support
- Prefer Tailwind utility classes as per project constitution (TailwindCSS 4.x)
- The glassmorphism digit cards use a combination of `opacity: 0.5`, `backdrop-filter: blur(24.96px)`, gradient background, and gold border — see CRITICAL implementation note in Single Digit Card section about opacity layering
- The "Digital Numbers" font is a specialty font that mimics LED/LCD displays — it must be loaded as a custom `@font-face`
- The background image should be optimized as WebP and served via Next.js `<Image>` for performance
- Ensure color contrast meets WCAG AA for the white text (#FFFFFF) on dark background (#00101A) — contrast ratio is >15:1, well above minimum
