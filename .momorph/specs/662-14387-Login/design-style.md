# Design Style: Login

**Frame ID**: `662:14387`
**Frame Name**: `Login`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/662:14387
**Frame Image**: https://momorph.ai/api/images/9ypp4enmFmdK3YAFJLIu6C/662:14387/9b6a80531ed3a0744c2a0c2ed06a55af.png
**Extracted At**: 2026-03-06

---

## Design Tokens

### Colors

| Token Name | Hex / RGBA Value | Opacity | Usage |
|------------|-----------------|---------|-------|
| `--color-bg` | `rgba(0, 16, 26, 1)` / `#00101A` | 100% | Page background |
| `--color-header-overlay` | `rgba(11, 15, 18, 0.8)` | 80% | Header/navigation backdrop |
| `--color-accent` | `#15D5CA` | 100% | Interactive highlights, focus rings |
| `--color-text-primary` | `rgba(255, 255, 255, 1)` / `#FFFFFF` | 100% | All text on dark background |
| `--color-button-bg` | `rgba(255, 234, 158, 1)` / `#FFEA9E` | 100% | Login button background |
| `--color-button-text` | `rgba(0, 16, 26, 1)` / `#00101A` | 100% | Login button label (dark on yellow) |
| `--color-divider` | `#2E3940` | 100% | Footer top border |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing | Usage |
|------------|-------------|------|--------|-------------|----------------|-------|
| `--text-button-label` | Montserrat | 22px | 700 | 28px | 0px | Login button "LOGIN With Google" |
| `--text-hero-body` | Montserrat | 20px | 700 | 40px | 0.5px | Hero description text (B.2_content) |
| `--text-nav` | Montserrat | 16px | 700 | 24px | 0.15px | Language selector "VN" label |
| `--text-footer` | Montserrat Alternates | 16px | 700 | 24px | 0px | Footer copyright text |

> Note: Load Montserrat and Montserrat Alternates via Google Fonts.

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| `--spacing-xs` | 2px | Tightest gaps |
| `--spacing-sm` | 8px | Button icon gap |
| `--spacing-md` | 16px | Button padding unit, language selector padding |
| `--spacing-lg` | 24px | Button padding horizontal, Frame 550 gap |
| `--spacing-xl` | 40px | Hero inner gap, footer vertical padding |
| `--spacing-2xl` | 64px | Large section gap |
| `--spacing-3xl` | 96px | Hero vertical padding |
| `--spacing-header-x` | 144px | Header horizontal padding |
| `--spacing-hero-gap` | 120px | Hero section content gap |
| `--spacing-footer-x` | 90px | Footer horizontal padding |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-sm` | 4px | Language selector inner button |
| `--radius-md` | 8px | Login button inner, dropdown |
| `--border-none` | none | Most elements |
| `--border-divider` | `1px solid #2E3940` | Footer top border |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| `--shadow-button-hover` | `0 4px 12px rgba(255, 234, 158, 0.4)` | Login button hover glow |

---

## Layout Specifications

### Frame (Viewport)

| Property | Value | Notes |
|----------|-------|-------|
| width | 1440px | Desktop baseline |
| height | 1024px | Desktop baseline |
| background | `rgba(0, 16, 26, 1)` | Dark navy |
| position | relative | Contains absolute children |

### Header

| Property | Value |
|----------|-------|
| width | 1440px |
| height | 80px |
| display | flex |
| justify-content | space-between |
| align-items | center |
| padding | 12px 144px |
| background | `rgba(11, 15, 18, 0.8)` |
| position | sticky / top |
| z-index | 10 |

### Hero Section

| Property | Value |
|----------|-------|
| width | 1440px |
| height | 845px |
| display | flex |
| flex-direction | column |
| justify-content | flex-start |
| align-items | flex-start |
| padding | 96px 144px |
| gap | 120px |

### Layout Structure (ASCII)

```
┌─────────────────────────────────────────────────────────────────────┐
│  Login Frame (1440 × 1024px, bg: #00101A)                           │
│                                                                     │
│  [C_Keyvisual] - Full-bleed background artwork (absolute, z: 1)     │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  A_Header (1440 × 80px, flex, px: 144px, bg: rgba overlay) │    │
│  │  ┌──────────┐                              ┌─────────────┐ │    │
│  │  │ A.1_Logo │                              │ A.2_Language│ │    │
│  │  │ (52×56px)│◄─────── gap: 238px ─────────►│ (108×56px) │ │    │
│  │  └──────────┘                              └─────────────┘ │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  B_Bìa (1440 × 845px, flex col, px: 144px, gap: 120px)     │    │
│  │  ┌───────────────────────────────────────────────────────┐  │    │
│  │  │  B.1_Key Visual frame (1152 × 200px)                  │  │    │
│  │  │    └── "ROOT FURTHER" logo image (451 × 200px)        │  │    │
│  │  └───────────────────────────────────────────────────────┘  │    │
│  │                                                             │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │  Frame 550 (flex col, gap: 24px, pl: 16px)          │    │    │
│  │  │  ┌───────────────────────────────────────────────┐  │    │    │
│  │  │  │ B.2_content (TEXT)                            │  │    │    │
│  │  │  │ "Bắt đầu hành trình của bạn cùng SAA 2025."  │  │    │    │
│  │  │  │ "Đăng nhập để khám phá!"                      │  │    │    │
│  │  │  └───────────────────────────────────────────────┘  │    │    │
│  │  │  ┌───────────────────────────────────────────────┐  │    │    │
│  │  │  │ B.3_Login (305 × 60px, flex, gap: 8px)        │  │    │    │
│  │  │  │  [Google Icon] [LOGIN With Google]             │  │    │    │
│  │  │  └───────────────────────────────────────────────┘  │    │    │
│  │  └─────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  [Rectangle 57] - side gradient (absolute, left→transparent, z:1)  │
│  [Cover]        - bottom gradient (absolute, bottom→transparent)    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  D_Footer (1440px, flex, justify-between, py:40px, px:90px) │    │
│  │  border-top: 1px solid #2E3940                              │    │
│  │  "Bản quyền thuộc về Sun* © 2025"                           │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### A_Header — Navigation Bar

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14391` | - |
| width | 1440px | `w-full` |
| height | 80px | `h-20` |
| display | flex | `flex` |
| justify-content | space-between | `justify-between` |
| align-items | center | `items-center` |
| padding | 12px 144px | `py-3 px-36` |
| background | `rgba(11, 15, 18, 0.8)` | `bg-[rgba(11,15,18,0.8)] backdrop-blur-sm` |
| position | sticky top-0 | `sticky top-0` |
| z-index | 10 | `z-10` |

---

### A.1_Logo — SAA 2025 Logo

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I662:14391;186:2166` | - |
| width | 52px | `w-13` |
| height | 56px | `h-14` |
| display | block | - |
| cursor | default | Non-interactive |

---

### A.2_Language — Language Selector

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I662:14391;186:1601` (outer frame) | - |
| **Inner Button Node ID** | `I662:14391;186:1696;186:1821` | - |
| width | 108px | `w-[108px]` |
| height | 56px | `h-14` |
| display | flex | `flex` |
| align-items | center | `items-center` |
| gap | 16px | `gap-4` |
| padding (inner button) | 16px (all sides) | `p-4` |
| border-radius (inner button) | 4px | `rounded-sm` |
| cursor | pointer | `cursor-pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default | No background highlight |
| Hover | background: `rgba(255,255,255,0.08)` |
| Active/Open | background: `rgba(255,255,255,0.12)` |
| Focus | outline: 2px solid `#15D5CA`, outline-offset: 2px |

**Content:** VN flag icon + "VN" text + chevron-down icon
**Action:** Opens language dropdown (frame `721:4942`)

---

### B.2_content — Hero Text Block

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14753` | - |
| Container Node ID | `662:14755` (Frame 550, flex col, gap: 24px, pl: 16px) | - |
| font-family | Montserrat | `font-['Montserrat']` |
| font-size | 20px | `text-[20px]` |
| font-weight | 700 | `font-bold` |
| line-height | 40px | `leading-10` |
| letter-spacing | 0.5px | `tracking-[0.5px]` |
| color | `rgba(255,255,255,1)` | `text-white` |
| text-align | left | - |
| width | 480px | `w-[480px]` |

**Content (2 lines):**
- Line 1: `Bắt đầu hành trình của bạn cùng SAA 2025.`
- Line 2: `Đăng nhập để khám phá!`

---

### B.3_Login — Google Login Button

> **Note**: Node `662:14425` is the outer wrapper frame (borderRadius: 0px). The styled clickable
> button is the inner instance `662:14426` (Button-IC About) — all style values below refer to it.

| Property | Value | CSS |
|----------|-------|-----|
| **Outer frame Node ID** | `662:14425` | - |
| **Inner button Node ID** | `662:14426` | - |
| width | 305px | `w-[305px]` |
| height | 60px | `h-[60px]` |
| display | flex | `flex` |
| align-items | center | `items-center` |
| gap | 8px | `gap-2` |
| padding | 16px 24px | `py-4 px-6` |
| background | `rgba(255, 234, 158, 1)` | `bg-[#FFEA9E]` |
| border-radius | 8px | `rounded-lg` |
| font-family | Montserrat | `font-['Montserrat']` |
| font-size | 22px | `text-[22px]` |
| font-weight | 700 | `font-bold` |
| line-height | 28px | `leading-7` |
| letter-spacing | 0px | - |
| color | `rgba(0, 16, 26, 1)` | `text-[#00101A]` |
| cursor | pointer | `cursor-pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default | background: `#FFEA9E` |
| Hover | background: `#FFE480`, box-shadow: `0 4px 12px rgba(255,234,158,0.4)` |
| Active | background: `#FFD740`, transform: scale(0.98) |
| Focus | outline: 2px solid `#15D5CA`, outline-offset: 2px |
| Loading | opacity: 0.7, cursor: not-allowed, spinner visible |

**Content (left → right):** label "LOGIN With Google" (Frame 483, 225×28px) + Google icon (24×24px, trailing)
> Note: Unlike the standard Google Sign-In button, this design places the text label first and the Google icon on the trailing (right) end. This is intentional per the SAA 2025 Figma design.

---

### Rectangle 57 — Left-to-Right Gradient Overlay

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14392` | - |
| width | 1442px | `w-full` |
| height | 1024px | `h-full` |
| position | absolute | `absolute inset-0` |
| background | `linear-gradient(90deg, #00101A 0%, #00101A 25.41%, rgba(0,16,26,0) 100%)` | `bg-linear-to-r from-[#00101A] via-[#00101A]/[0.25] to-transparent` |
| z-index | 1 | `z-1` |
| pointer-events | none | decorative only |

---

### Cover — Bottom Vignette Gradient

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14390` | - |
| width | 1440px | `w-full` |
| height | 1093px (extends beyond frame) | `h-full` |
| position | absolute | `absolute bottom-0 left-0` |
| background | `linear-gradient(0deg, #00101A 22.48%, rgba(0,19,32,0) 51.74%)` | `bg-linear-to-t from-[#00101A] to-transparent` |
| z-index | 1 | `z-1` |
| pointer-events | none | decorative only |

---

### D_Footer — Copyright Footer

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14447` | - |
| width | 1440px | `w-full` |
| display | flex | `flex` |
| justify-content | space-between | `justify-between` |
| align-items | center | `items-center` |
| padding | 40px 90px | `py-10 px-22.5` |
| border-top | `1px solid #2E3940` | `border-t border-[#2E3940]` |
| font-family | Montserrat Alternates | `font-['Montserrat_Alternates']` |
| font-size | 16px | `text-base` |
| font-weight | 700 | `font-bold` |
| color | `rgba(255,255,255,1)` | `text-white` |
| text-align (inner text) | center | `text-center` |

**Content:** `Bản quyền thuộc về Sun* © 2025`
**Inner text dimensions**: 275×11px

---

## Component Hierarchy with Styles

```
LoginPage (bg: #00101A, min-h-screen, relative, overflow-hidden)
├── C_Keyvisual (absolute, inset-0, z-0) — full-bleed background artwork
├── Rectangle57 (absolute, inset-0, z-1) — left-to-right gradient overlay
├── Cover (absolute, bottom-0, left-0, w-full, h-full, z-1) — bottom vignette
│
├── A_Header (w-full, h-20, flex, justify-between, items-center,
│             py-3, px-36, bg-[rgba(11,15,18,0.8)], backdrop-blur-sm,
│             absolute, top-0, z-10)
│   ├── A.1_Logo (w-[52px], h-[56px]) — <Image> SAA 2025 logo
│   └── A.2_Language (w-[108px], h-14, flex, items-center, gap-4, cursor-pointer,
│                     relative) — inner button: p-4, rounded-sm
│       ├── VN Flag Icon (<Icon name="flag-vn" size={20} />)
│       ├── "VN" text (text-white, text-base, font-bold, tracking-[0.15px])
│       └── Chevron Down Icon (<Icon name="chevron-down" size={16} />)
│
├── B_Bìa (w-full, flex, flex-col, items-start, py-24, px-36,
│           gap-30, absolute, top-20)
│   ├── Frame487 (w-[1152px], flex, flex-col, gap-20)
│   │   ├── B.1_KeyVisual frame (w-[1152px], h-[200px]) — contains logo image
│   │   │   └── ROOT_FURTHER image (w-[451px], h-[200px]) — <Image>
│   │   └── Frame550 (w-[496px], flex, flex-col, gap-6, pl-4)
│   │       ├── B.2_content (w-[480px], text-white, text-[20px], font-bold,
│   │       │                leading-10, tracking-[0.5px])
│   │       └── B.3_Login wrapper (w-[305px], h-[60px])
│   │           └── Button-IC (w-[305px], h-[60px], flex, items-center, gap-2,
│   │                          py-4, px-6, bg-[#FFEA9E], rounded-lg, cursor-pointer)
│   │               ├── Frame483 (w-[225px], flex, items-center)
│   │               │   └── "LOGIN With Google" (text-[#00101A], text-[22px],
│   │               │        font-bold, leading-7)
│   │               └── Google Icon (<Icon name="google" size={24} />)
│
└── D_Footer (w-full, flex, justify-between, items-center,
              py-10, px-22.5, border-t, border-[#2E3940],
              text-white, text-base, font-bold, absolute, bottom-0)
    └── "Bản quyền thuộc về Sun* © 2025" (font-['Montserrat_Alternates'])
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width | Target Device |
|------|-----------|-----------|---------------|
| Mobile | 0 | 767px | 360px reference |
| Tablet | 768px | 1023px | 768px reference |
| Desktop | 1024px | ∞ | 1440px reference |

### Responsive Changes

#### Mobile (< 768px)

| Component | Changes |
|-----------|---------|
| A_Header | padding: `12px 16px`, height: 60px |
| A.1_Logo | width: 36px, height: 40px |
| A.2_Language | padding: `8px 12px`, width: auto |
| B_Bìa | padding: `40px 16px`, gap: `40px` |
| B.1_KeyVisual | width: 100%, height: auto |
| B.2_content | font-size: 16px, width: 100% |
| B.3_Login | width: 100% (full-width button) |
| D_Footer | padding: `24px 16px`, font-size: 14px, text-align: center |

#### Tablet (768px - 1023px)

| Component | Changes |
|-----------|---------|
| A_Header | padding: `12px 48px` |
| B_Bìa | padding: `64px 48px`, gap: `80px` |
| B.1_KeyVisual | width: 100%, height: auto |
| B.3_Login | width: 280px |
| D_Footer | padding: `32px 48px` |

#### Desktop (≥ 1024px)

| Component | Changes |
|-----------|---------|
| All | Figma design values apply exactly |
| A_Header | padding: `12px 144px` |
| B_Bìa | padding: `96px 144px` |
| B.3_Login | width: 305px |

---

## Icon Specifications

| Icon Name | Container Size | Image Size | Color | Usage |
|-----------|---------------|------------|-------|-------|
| `google` | 24×24px | 24×24px | Original brand colors | Login button leading icon |
| `flag-vn` | 24×24px | 20×15px (flag ratio) | Original colors | Language selector leading icon |
| `chevron-down` | 24×24px | 16×16px | `#FFFFFF` | Language dropdown trailing indicator |

> All icons MUST be rendered via an **Icon Component** (not raw `<svg>` or `<img>` tags).

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| B.3_Login Button | background-color, box-shadow | 150ms | ease-in-out | Hover |
| B.3_Login Button | transform | 100ms | ease-in | Active/click |
| A.2_Language | background | 150ms | ease-in-out | Hover |
| Language Dropdown | opacity, transform | 150ms | ease-out | Open/close |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind Classes | React Component |
|----------------|---------------|-----------------|-----------------|
| Page background | `662:14387` | `bg-[#00101A] min-h-screen relative overflow-hidden` | `<LoginPage>` |
| Background artwork | `662:14388` | `absolute inset-0 z-0 object-cover` | `<Image>` (Next.js, fill) |
| Side gradient overlay | `662:14392` | `absolute inset-0 z-1 bg-linear-to-r from-[#00101A] to-transparent pointer-events-none` | `<div>` |
| Bottom vignette | `662:14390` | `absolute bottom-0 left-0 w-full h-full z-1 bg-linear-to-t from-[#00101A] to-transparent pointer-events-none` | `<div>` |
| Header | `662:14391` | `w-full h-20 flex justify-between items-center py-3 px-36 bg-[rgba(11,15,18,0.8)] backdrop-blur-sm absolute top-0 z-10` | `<Header>` |
| Logo | `I662:14391;186:2166` | `w-[52px] h-[56px]` | `<Image>` (Next.js) |
| Language toggle | `I662:14391;186:1601` | `w-[108px] h-14 flex items-center gap-4 cursor-pointer relative` | `<LanguageSelector>` |
| Language inner button | `I662:14391;186:1696;186:1821` | `flex items-center justify-between p-4 rounded-sm` | inner `<button>` |
| Hero section | `662:14393` | `w-full flex flex-col items-start py-24 px-36 gap-30 absolute top-20` | `<HeroSection>` |
| Key visual frame | `662:14395` | `w-[1152px] h-[200px]` | `<div>` |
| ROOT FURTHER image | `2939:9548` | `w-[451px] h-[200px] object-cover` | `<Image>` (Next.js) |
| Frame 550 container | `662:14755` | `w-[496px] flex flex-col gap-6 pl-4` | `<div>` |
| Hero text | `662:14753` | `w-[480px] text-white text-[20px] font-bold leading-10 tracking-[0.5px]` | `<p>` |
| Login button wrapper | `662:14425` | `w-[305px] h-[60px]` | `<div>` |
| Login button (styled) | `662:14426` | `w-[305px] h-[60px] flex items-center gap-2 py-4 px-6 bg-[#FFEA9E] rounded-lg cursor-pointer` | `<LoginButton>` |
| Button label | `I662:14426;186:1568` | `text-[#00101A] text-[22px] font-bold leading-7` | `<span>` |
| Google icon | `I662:14426;186:1766` | - | `<Icon name="google" size={24} />` |
| Footer | `662:14447` | `w-full flex justify-between items-center py-10 px-22.5 border-t border-[#2E3940] text-white text-base font-bold absolute bottom-0` | `<Footer>` |

---

## Notes

- Use CSS variables for all design tokens to support future theming
- Montserrat and Montserrat Alternates MUST be loaded via `next/font/google`
- The background keyvisual image must use `next/image` with `fill` and `object-cover`
- The header uses `backdrop-blur` for the glass effect (ensure `backdrop-filter` is supported)
- Color contrast for button label (`#00101A` on `#FFEA9E`) ≈ 12.5:1 — exceeds WCAG AA
- Color contrast for body text (`#FFFFFF` on `#00101A`) ≈ 19.5:1 — exceeds WCAG AA
