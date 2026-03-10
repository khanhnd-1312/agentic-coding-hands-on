# Design Style: Homepage SAA

**Frame ID**: `2167:9026`
**Frame Name**: `Homepage SAA`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/2167:9026
**Extracted At**: 2026-03-10

---

## Design Tokens

### Colors

| Token Name | Hex Value | Usage |
|------------|-----------|-------|
| `--color-bg` | `rgba(0, 16, 26, 1)` = `#00101A` | Page background |
| `--color-header-overlay` | `rgba(11, 15, 18, 0.8)` | Header backdrop |
| `--color-accent` | `#FFEA9E` | Active nav, headings, primary buttons, event time |
| `--color-text-primary` | `rgba(255, 255, 255, 1)` = `#FFFFFF` | Body text, nav links |
| `--color-border` | `#2E3940` | Dividers, footer border-top |
| `--color-btn-border` | `#998C5F` | Secondary button border, avatar border |
| `--color-btn-secondary-bg` | `rgba(255, 234, 158, 0.10)` | Secondary button background |
| `--color-badge` | `rgba(212, 39, 29, 1)` = `#D4271D` | Notification dot |
| `--color-kudos-bg` | `#0F0F0F` | Sun* Kudos card background |
| `--color-countdown-digit` | `rgba(255, 255, 255, 1)` | Countdown digit text |
| `--color-btn-text-dark` | `rgba(0, 16, 26, 1)` = `#00101A` | Text on yellow buttons |
| `--color-kudos-wordmark` | `rgba(219, 209, 193, 1)` = `#DBD1C1` | KUDOS wordmark |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing | Usage |
|------------|-------------|------|--------|-------------|----------------|-------|
| `--text-display` | Montserrat | 57px | 700 | 64px | -0.25px | Section titles ("Hệ thống giải thưởng", "Sun* Kudos") |
| `--text-heading-coming-soon` | Montserrat | 24px | 700 | 32px | — | "Coming soon", countdown labels, section captions |
| `--text-event-time` | Montserrat | 24px | 700 | 32px | — | Event time & venue values (#FFEA9E) |
| `--text-event-label` | Montserrat | 16px | 700 | 24px | 0.15px | "Thời gian:", "Địa điểm:" labels |
| `--text-nav-header` | Montserrat | 14px | 700 | 20px | 0.1px | Header nav links |
| `--text-nav-footer` | Montserrat | 16px | 700 | 24px | 0.15px | Footer nav links |
| `--text-cta-primary` | Montserrat | 22px | 700 | 28px | — | "ABOUT AWARDS" / "ABOUT KUDOS" button text |
| `--text-cta-secondary` | Montserrat | 16px | 700 | 24px | 0.15px | "Chi tiết" button text |
| `--text-award-title` | Montserrat | 24px | 400 | 32px | — | Award card title |
| `--text-award-desc` | Montserrat | 16px | 400 | 24px | 0.5px | Award card description |
| `--text-body-large` | Montserrat | 24px | 700 | 32px | — | B4 content body (justified) |
| `--text-body-kudos` | Montserrat | 16px | 700 | 24px | 0.5px | Sun* Kudos description (justified) |
| `--text-countdown-digit` | Digital Numbers | 49px | 400 | — | — | Countdown tile digits |
| `--text-kudos-wordmark` | SVN-Gotham | 96px | 400 | 24px | -13% | "KUDOS" wordmark |
| `--text-footer-copyright` | Montserrat Alternates | 16px | 700 | — | — | Footer copyright text |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| `--page-padding-x` | `144px` | Main content horizontal padding |
| `--page-padding-y` | `96px` | Main content vertical padding |
| `--header-padding` | `12px 144px` | Header padding |
| `--header-gap` | `238px` | Gap between header left/right groups |
| `--section-gap` | `120px` | Gap between major page sections |
| `--countdown-gap` | `40px` | Gap between countdown tiles |
| `--tile-inner-gap` | `14px` | Gap between the two digit boxes in a tile |
| `--award-card-gap` | `24px` | Gap inside each award card (image → text) |
| `--award-row-gap` | `80px` | Gap between award cards in a row |
| `--footer-padding` | `40px 90px` | Footer padding |
| `--footer-nav-gap` | `48px` | Footer nav link gap |
| `--kudos-content-gap` | `32px` | Gap inside Sun* Kudos content block |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-nav-btn` | `4px` | Header/footer nav button border-radius |
| `--radius-cta` | `8px` | CTA buttons |
| `--radius-countdown-digit` | `8px` | Countdown digit boxes |
| `--radius-award-img` | `24px` | Award card image |
| `--radius-kudos-card` | `16px` | Sun* Kudos card container |
| `--radius-widget` | `100px` | Widget floating button (pill) |
| `--border-divider` | `1px solid #2E3940` | Horizontal divider, footer border |
| `--border-accent` | `0.5px solid #FFEA9E` | Countdown digit box border |
| `--border-award-img` | `0.955px solid #FFEA9E` | Award image border |
| `--border-btn-secondary` | `1px solid #998C5F` | Secondary CTA & avatar button border |
| `--border-nav-active` | `1px solid #FFEA9E` | Active header nav link underline |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| `--shadow-glow-accent` | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` | Award image, Widget button glow |
| `--shadow-countdown-blur` | `backdrop-filter: blur(16.64px)` | Countdown digit box frosted glass |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| max-width | `1512px` | Frame width (desktop 1512px baseline) |
| content-width | `1224px` | Inner content container |
| padding-x | `144px` | Page horizontal padding |
| padding-y | `96px` | Page vertical padding |

### Layout Structure (ASCII)

```
┌──────────────────────────────── 1512px ────────────────────────────────┐
│  A1_Header (1512×80px, flex row, padding 12px 144px, gap 238px)        │
│  ┌─────────┐  ┌──────────────────────────────┐  ┌────────────────────┐ │
│  │  LOGO   │  │ About SAA | Awards | Kudos   │  │ 🔔 VN 👤           │ │
│  │ 52×48px │  │ 14px/700 Montserrat          │  │                    │ │
│  └─────────┘  └──────────────────────────────┘  └────────────────────┘ │
│                                                                         │
│  3.5_Keyvisual (1512×1392px, full-bleed BG image + gradient cover)      │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  Cover gradient: 12deg, #00101A → transparent                       ││
│  │                                                                     ││
│  │  Bìa section (1512×4220px, flex column, padding 96px 144px)        ││
│  │  ┌────────────────────── 1224px ──────────────────────────────────┐ ││
│  │  │  Root Further Logo (451×200px image)                           │ ││
│  │  │                                                                │ ││
│  │  │  B1_Countdown time (1224×176px, flex col, gap 16px)           │ ││
│  │  │  ┌─────────────────────────────────────────────────────────┐  │ ││
│  │  │  │  "Coming soon" (24px/700 Montserrat)                    │  │ ││
│  │  │  │                                                         │  │ ││
│  │  │  │  B1.3_Countdown (429×128px, flex row, gap 40px)        │  │ ││
│  │  │  │  ┌───────────┐ ┌───────────┐ ┌───────────┐             │  │ ││
│  │  │  │  │  [D][D]   │ │  [D][D]   │ │  [D][D]   │             │  │ ││
│  │  │  │  │  DAYS     │ │  HOURS    │ │  MINUTES  │             │  │ ││
│  │  │  │  │ 116×128px │ │ 116×128px │ │ 116×128px │             │  │ ││
│  │  │  │  └───────────┘ └───────────┘ └───────────┘             │  │ ││
│  │  │  └─────────────────────────────────────────────────────────┘  │ ││
│  │  │                                                                │ ││
│  │  │  B2_Thông tin sự kiện (637×64px)                              │ ││
│  │  │  Thời gian: [18h30]  Địa điểm: [Nhà hát nghệ thuật quân đội] │ ││
│  │  │                                                                │ ││
│  │  │  B3_CTA (570×60px, flex row, gap 40px)                       │ ││
│  │  │  ┌──────────────────┐ ┌──────────────────┐                   │ ││
│  │  │  │  ABOUT AWARDS    │ │  ABOUT KUDOS     │                   │ ││
│  │  │  │ 276×60px #FFEA9E │ │ border #998C5F   │                   │ ││
│  │  │  └──────────────────┘ └──────────────────┘                   │ ││
│  │  └────────────────────────────────────────────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                         │
│  B4_content (1152×1090px, body text, justified)                         │
│                                                                         │
│  C_Hệ thống giải thưởng (1224px, flex col, gap 80px)                   │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  C1_Header: caption + divider + "Hệ thống giải thưởng" 57px     │   │
│  │                                                                  │   │
│  │  C2_Award list (1224×1144px, grid 3-col)                        │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                        │   │
│  │  │ 336×504px│ │ 336×504px│ │ 336×504px│                        │   │
│  │  │  [Img]   │ │  [Img]   │ │  [Img]   │                        │   │
│  │  │  Title   │ │  Title   │ │  Title   │                        │   │
│  │  │  Desc    │ │  Desc    │ │  Desc    │                        │   │
│  │  │ Chi tiết │ │ Chi tiết │ │ Chi tiết │                        │   │
│  │  └──────────┘ └──────────┘ └──────────┘                        │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  D1_Sunkudos (1224×500px)                                               │
│  ┌──────────────────────────────────── 1120px ────────────────────────┐ │
│  │ bg #0F0F0F + bg-image, border-radius 16px                         │ │
│  │  ┌──────────── 457px ────────────┐   ┌─────────────────────────┐  │ │
│  │  │ Phong trào ghi nhận (24px)    │   │  KUDOS wordmark +       │  │ │
│  │  │ Sun* Kudos (57px #FFEA9E)     │   │  decorative image       │  │ │
│  │  │ Description (16px, justified) │   │  264×219px              │  │ │
│  │  │ [Chi tiết] 127×56px #FFEA9E   │   └─────────────────────────┘  │ │
│  │  └───────────────────────────────┘                                │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  6_Widget Button (106×64px, fixed right, #FFEA9E, border-radius 100px) │
│                                                                         │
│  7_Footer (1512px, padding 40px 90px, border-top 1px #2E3940)          │
│  ┌──────────┐  ┌─────────────────────────────────┐  ┌───────────────┐  │
│  │  LOGO    │  │ About SAA | Awards | Kudos       │  │ Copyright     │  │
│  │ 69×64px  │  │ 16px/700 Montserrat, gap 48px   │  │               │  │
│  └──────────┘  └─────────────────────────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### A1_Header — Navigation Bar

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2167:9091` | — |
| width | `1512px` | `w-full` |
| height | `80px` | `h-20` |
| padding | `12px 144px` | `py-3 px-36` |
| gap | `238px` | `gap-[238px]` |
| display | flex row | `flex flex-row` |
| justify-content | space-between | `justify-between` |
| align-items | center | `items-center` |
| background | `rgba(11,15,18,0.8)` | `bg-[rgba(11,15,18,0.8)]` |
| backdrop-filter | blur | `backdrop-blur-sm` |
| position | fixed top-0 | `fixed top-0 z-40` |

> **Z-index stacking note**: Header uses `z-40`. Widget button uses `z-50` (above header). Dropdown overlays triggered from the header (language, profile) should use `z-50` or higher to appear on top of all content. Page content is `z-0`.

**Nav Link Container** (Frame 476, flex row, gap **24px** between the 3 links):
| Property | Value |
|----------|-------|
| gap | `24px` |
| align-items | center |

**Nav Link States:**
| State | Property | Value |
|-------|----------|-------|
| Normal | color | `#FFFFFF`, font 14px/700 |
| Hover | background | `rgba(255,255,255,0.08)`, border-radius 4px |
| Active/Selected | color | `#FFEA9E`, border-bottom `1px solid #FFEA9E` |
| Focus | outline | `2px solid #15D5CA`, offset 2px |

**Controls (right):**
- Notification: 40×40px, icon-only, red badge `8×8px` `bg #D4271D` `border-radius 100px`
- Language: 108×56px, VN flag + "VN" text + chevron
- Avatar: 40×40px, border `1px solid #998C5F`, icon-only

**Header Control States (notification, language, avatar):**
| State | Property | Value |
|-------|----------|-------|
| Default | background | transparent |
| Hover | background | `rgba(255,255,255,0.08)`, border-radius `4px` |
| Active | background | `rgba(255,255,255,0.12)` |
| Focus | outline | `2px solid #15D5CA`, offset `2px` |

---

### B1_Countdown — Countdown Timer

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2167:9035` | — |
| width | `1224px` | `w-full max-w-[1224px]` |
| height | `176px` | — |
| display | flex column | `flex flex-col` |
| gap | `16px` | `gap-4` |

**Countdown Row** (`2167:9037`, 429×128px, flex row, gap 40px):

**Each Tile** (116×128px, flex col, gap 14px, justify-center):
- Two digit boxes side by side (gap 14px)
- Unit label below: 24px/700 Montserrat, white

**Digit Box** (`51×82px`):
| Property | Value |
|----------|-------|
| border | `0.5px solid #FFEA9E` |
| border-radius | `8px` |
| background | `linear-gradient(180deg, #FFF 0%, rgba(255,255,255,0.10) 100%)` |
| opacity | `0.5` |
| backdrop-filter | `blur(16.64px)` |

**Digit Text**: `Digital Numbers`, 49px, 400, white

**"Coming soon" label** (`2167:9036`): 24px/700 Montserrat, white. Hidden when countdown reaches zero.

---

### B2_Thông tin sự kiện — Event Info

| Property | Value |
|----------|-------|
| **Node ID** | `2167:9053` |
| width | `637px` |
| height | `64px` |
| display | flex column, gap 8px |

**Row layout**: Two groups side by side (gap 60px)
- Label ("Thời gian:", "Địa điểm:"): 16px/700 Montserrat, white, letter-spacing 0.15px
- Value ("18h30", "Nhà hát nghệ thuật quân đội"): 24px/700 Montserrat, **`#FFEA9E`**
- Sub-note (Facebook group): 16px/700 Montserrat, white — rendered as **static `<p>` tag**, not a link

---

### B3_CTA — Primary Call-To-Action Buttons

#### B3.1 — "ABOUT AWARDS" (Primary, Hover State shown)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2167:9063` | — |
| width | `276px` | `w-[276px]` |
| height | `60px` | `h-[60px]` |
| padding | `16px 24px` | `py-4 px-6` |
| background | `#FFEA9E` | `bg-[#FFEA9E]` |
| border-radius | `8px` | `rounded-lg` |
| font-size | `22px` | `text-[22px]` |
| font-weight | `700` | `font-bold` |
| font-family | Montserrat | |
| color | `#00101A` | `text-[#00101A]` |
| gap | `8px` | `gap-2` |

**States:**
| State | Property | Value |
|-------|----------|-------|
| Default | background | `#FFEA9E` |
| Hover | background | `#FFE480`, box-shadow glow |
| Active | background | `#FFD740`, scale 0.98 |
| Focus | outline | `2px solid #15D5CA`, offset 2px |

#### B3.2 — "ABOUT KUDOS" (Secondary, Normal State)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2167:9064` | — |
| width | `254px` (derived: 570px container − 276px B3.1 − 40px gap) | `w-[254px]` |
| height | `60px` | `h-[60px]` |
| padding | `16px 24px` | `py-4 px-6` |
| background | `rgba(255,234,158,0.10)` | `bg-[rgba(255,234,158,0.10)]` |
| border | `1px solid #998C5F` | `border border-[#998C5F]` |
| border-radius | `8px` | `rounded-lg` |
| font-size | `22px` | `text-[22px]` |
| font-weight | `700` | `font-bold` |
| color | `#FFFFFF` | `text-white` |

**States:**
| State | Property | Value |
|-------|----------|-------|
| Default | background | `rgba(255,234,158,0.10)`, border `1px solid #998C5F` |
| Hover | background | `#FFEA9E`, color `#00101A`, border-color `#FFEA9E` |
| Active | background | `#FFD740`, scale `0.98` |
| Focus | outline | `2px solid #15D5CA`, offset `2px` |

---

### C1_Header Giải thưởng — Awards Section Header

| Property | Value |
|----------|-------|
| **Node ID** | `2167:9069` |
| width | `1224px` |
| gap | `16px` |
| display | flex column |

- Caption: "Sun* annual awards 2025" — 24px/700 Montserrat, white
- Divider: `1px solid #2E3940`
- Title: "Hệ thống giải thưởng" — 57px/700 Montserrat, `#FFEA9E`, line-height 64px, letter-spacing -0.25px

---

### C2_Award Card — Award List Item

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2167:9075` (Top Talent example) | — |
| width | `336px` | `w-[336px]` |
| height | `504px` | — |
| display | flex column | `flex flex-col` |
| gap | `24px` | `gap-6` |

**Picture area** (`336×336px`):
| Property | Value |
|----------|-------|
| border | `0.955px solid #FFEA9E` |
| border-radius | `24px` |
| box-shadow | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` |
| mix-blend-mode | `screen` |

**Text area** (flex col, gap 4px):
- Title: 24px/400 Montserrat, `#FFEA9E`, line-height 32px
- Description: 16px/400 Montserrat, white, line-height 24px, letter-spacing 0.5px, max 2 lines with ellipsis
- "Chi tiết" button: 88×56px, padding 16px 0, transparent bg, 16px/700 Montserrat, white, icon + text

**"Chi tiết" button states:**
| State | Property | Value |
|-------|----------|-------|
| Normal | color | `#FFFFFF`, transparent bg |
| Hover | color | `#FFEA9E`, text underline |
| Focus | outline | `2px solid #15D5CA`, offset 2px |
| Active | opacity | 0.8 |

**Hover state (card)**: `translateY(-4px)`, elevated box-shadow glow.

**Award grid layout**:
- Row: flex row, gap 80px, 3 cards per row
- Mobile: 1 column; Tablet: 2 columns; Desktop: 3 columns

---

### D1_Sunkudos — Sun* Kudos Feature Block

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `3390:10349` | — |
| width | `1120px` | `w-[1120px]` |
| height | `500px` | `h-[500px]` |
| border-radius | `16px` | `rounded-2xl` |
| background | `#0F0F0F` + decorative bg image | `bg-[#0F0F0F]` |

**Content block** (`D2`, 457×408px, flex col, gap 32px):
- Caption "Phong trào ghi nhận": 24px/700 Montserrat, white
- Title "Sun* Kudos": 57px/700 Montserrat, `#FFEA9E`, line-height 64px, letter-spacing -0.25px
- Body: 16px/700 Montserrat, white, line-height 24px, letter-spacing 0.5px, text-align justified

**"Chi tiết" CTA** (`127×56px`):
| Property | Value |
|----------|-------|
| background | `#FFEA9E` |
| border-radius | `4px` |
| padding | `16px` |
| font-size | `16px` |
| font-weight | `700` |
| color | `#00101A` |

**"Chi tiết" CTA States:**
| State | Property | Value |
|-------|----------|-------|
| Default | background | `#FFEA9E` |
| Hover | background | `#FFE480`, box-shadow glow |
| Active | background | `#FFD740`, scale `0.98` |
| Focus | outline | `2px solid #15D5CA`, offset `2px` |

---

### 6_Widget Button — Floating Action Button

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `5022:15169` | — |
| width | `106px` | `w-[106px]` |
| height | `64px` | `h-16` |
| position | fixed, right | `fixed right-[19px] z-50` |
| bottom | ~130px from viewport bottom (verify during implementation — Figma artboard top:830px in a ~1024px viewport) | `bottom-[130px]` *(verify)* |
| background | `#FFEA9E` | `bg-[#FFEA9E]` |
| border-radius | `100px` | `rounded-full` |
| box-shadow | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` | — |
| padding | `16px` | `p-4` |
| gap | `8px` (between pen icon and SAA icon) | `gap-2` |

Contents: pencil icon (24px) + "/" separator + SAA logo icon (24px)

**Widget Button States:**
| State | Property | Value |
|-------|----------|-------|
| Default | background | `#FFEA9E`, box-shadow `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` |
| Hover | background | `#FFE480`, box-shadow intensified |
| Active | transform | `scale(0.97)` |
| Focus | outline | `2px solid #15D5CA`, offset `2px` |

---

### 7_Footer

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `5001:14800` | — |
| width | `1512px` | `w-full` |
| padding | `40px 90px` | `py-10 px-[90px]` |
| border-top | `1px solid #2E3940` | `border-t border-[#2E3940]` |
| display | flex row | `flex flex-row` |
| justify-content | space-between | `justify-between` |
| align-items | center | `items-center` |

- Logo: 69×64px
- Nav links: 16px/700 Montserrat, white, gap 48px

**Footer Nav Link States:**
| State | Property | Value |
|-------|----------|-------|
| Default | color | `#FFFFFF`, background transparent |
| Hover | background | `rgba(255,234,158,0.08)`, border-radius `4px` |
| Active/Selected | background | `rgba(255,234,158,0.1)`, border-radius `4px` |
| Focus | outline | `2px solid #15D5CA`, offset `2px` |
- **"Tiêu chuẩn chung" link** (node `I5001:14800;1161:9487`): 186×56px, 16px/700 Montserrat, white — 4th nav link in the footer group
- Copyright text: **"Bản quyền thuộc về Sun* © 2025"** — font `Montserrat Alternates` 16px/700, center-aligned, right side of footer. Node `I5001:14800;342:1413`, 275×11px

---

## Component Hierarchy with Styles

```
Homepage (#00101A, min-h-screen)
├── A1_Header (fixed top, 1512×80px, bg rgba(11,15,18,0.8), blur, z-40)
│   ├── Logo (52×48px, click → /)
│   ├── NavLinks (flex row, gap 24px, 14px/700 Montserrat)
│   │   ├── "About SAA 2025" → href="/" [selected on homepage: color #FFEA9E, border-bottom; no-op when already on /]
│   │   ├── "Awards Information" [hover: bg rgba(255,255,255,0.08)]
│   │   └── "Sun* Kudos" [normal]
│   └── Controls (flex row, gap 16px)
│       ├── Notification (40×40px, badge dot #D4271D)
│       ├── Language (108×56px)
│       └── Avatar (40×40px, border #998C5F)
│
├── 3.5_Keyvisual (1512×1392px, absolute, full-bleed BG)
│   └── Cover gradient (linear-gradient 12deg, #00101A → transparent)
│
├── Bìa (1512×4220px, flex col, padding 96px 144px, gap 120px)
│   ├── Root Further Logo (451×200px image)
│   ├── B1_Countdown (1224px, flex col, gap 16px)
│   │   ├── "Coming soon" (24px/700, hidden when countdown=0)
│   │   └── Countdown Row (429×128px, flex row, gap 40px)
│   │       ├── Days tile (116×128px)
│   │       ├── Hours tile (116×128px)
│   │       └── Minutes tile (116×128px)
│   │           └── [2× digit boxes (51×82px, blur glass)] + label
│   ├── B2_Event Info (637×64px, flex col, gap 8px)
│   │   ├── Row: "Thời gian: 18h30"
│   │   ├── Row: "Địa điểm: Nhà hát nghệ thuật quân đội"
│   │   └── Note: Facebook group text
│   └── B3_CTA (570×60px, flex row, gap 40px)
│       ├── "ABOUT AWARDS" (276×60px, bg #FFEA9E, r-lg)
│       └── "ABOUT KUDOS" (border #998C5F, bg transparent)
│
├── B4_content (1152px, body text 24px/700, justified)
│
├── C_Awards Section (1224px, flex col, gap 80px, padding 96px 144px)
│   ├── C1_Header
│   │   ├── Caption "Sun* annual awards 2025" (24px/700, white)
│   │   ├── Divider (1px #2E3940)
│   │   └── Title "Hệ thống giải thưởng" (57px/700, #FFEA9E)
│   └── C2_Award List (flex row, gap 80px, 3-col grid)
│       └── AwardCard × 6 (336×504px each)
│           ├── Picture (336×336px, border #FFEA9E, r-24px, glow shadow)
│           ├── Title (24px/400, #FFEA9E)
│           ├── Description (16px/400, white, 2-line clamp)
│           └── "Chi tiết" link button
│
├── D1_Sunkudos (1120×500px, bg #0F0F0F, r-16px)
│   ├── D2_Content (457px, flex col, gap 32px)
│   │   ├── Caption (24px/700, white)
│   │   ├── "Sun* Kudos" (57px/700, #FFEA9E)
│   │   ├── Description (16px/700, white, justified)
│   │   └── "Chi tiết" CTA (127×56px, bg #FFEA9E)
│   └── Decorative: KUDOS wordmark + logo image
│
├── 6_Widget (106×64px, fixed right, bg #FFEA9E, rounded-full)
│
└── 7_Footer (1512px, padding 40px 90px, border-top #2E3940)
    ├── Logo (69×64px)
    ├── Nav links (16px/700 Montserrat, gap 48px): About SAA 2025 | Awards Information | Sun* Kudos | Tiêu chuẩn chung
    └── Copyright ("Bản quyền thuộc về Sun* © 2025", Montserrat Alternates 16px/700)
```

---

## Responsive Specifications

### Breakpoints

| Name | Width | Notes |
|------|-------|-------|
| Mobile | 360px | Base mobile |
| Tablet | 768px | 2-col awards grid |
| Desktop | 1440px+ | 3-col awards grid, full layout |

### Responsive Changes

#### Mobile (< 768px)
| Component | Change |
|-----------|--------|
| Header | Hamburger menu, hide nav links |
| Page padding-x | `16px` |
| Countdown tiles | Scale down or stack |
| CTA buttons | Full width, stacked |
| Award cards | 1-column grid |
| Sun* Kudos | Stack content + image vertically |
| Widget button | Stays fixed, right edge |

#### Tablet (768px – 1023px)
| Component | Change |
|-----------|--------|
| Page padding-x | `48px` |
| Award cards | 2-column grid |
| CTA buttons | Inline, reduced width |

#### Desktop (≥ 1440px)
| Component | Change |
|-----------|--------|
| Page padding-x | `144px` |
| Award cards | 3-column grid |
| Full layout | As per Figma |

---

## Icon Specifications

| Icon Name | Size | Usage |
|-----------|------|-------|
| logo | 52×48px (header), 69×64px (footer) | SAA brand logo |
| flag-vn | 20×15px | Language selector |
| chevron-down | 24×24px | Language dropdown |
| notification-bell | 24×24px | Notification button |
| user-avatar | 24×24px | Profile button |
| arrow-up (↑) | 24×24px | CTA button icon, "Chi tiết" button |
| pen | 24×24px | Widget floating button |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Nav link | background-color | 150ms | ease-in-out | Hover |
| CTA button | background-color, box-shadow | 150ms | ease-in-out | Hover |
| CTA button | transform scale(0.98) | 100ms | ease-in | Active |
| Award card | transform translateY(-4px), box-shadow | 200ms | ease-out | Hover |
| Countdown | digit value | every minute | — | Automatic |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind Class | React Component |
|----------------|---------------|----------------|-----------------|
| Page wrapper | 2167:9026 | `bg-[#00101A] min-h-screen` | `<HomePage>` |
| Header | 2167:9091 | `fixed top-0 w-full h-20 backdrop-blur-sm` | `<Header>` |
| Logo | I2167:9091;178:1033 | `w-[52px] h-[48px]` | `<Image>` |
| Nav active link | I2167:9091;186:1579 | `text-[#FFEA9E] border-b border-[#FFEA9E]` | `<NavLink active>` |
| Countdown section | 2167:9035 | `flex flex-col gap-4` | `<Countdown>` |
| Digit tile | 2167:9038–9048 | `w-[116px] h-[128px]` | `<CountdownTile>` |
| Digit box | I*;186:2616 | `border-[0.5px] border-[#FFEA9E] rounded-lg backdrop-blur` | `<DigitBox>` |
| CTA primary | 2167:9063 | `bg-[#FFEA9E] w-[276px] h-[60px] rounded-lg` | `<CTAButton variant="primary">` |
| CTA secondary | 2167:9064 | `border border-[#998C5F] bg-[rgba(255,234,158,0.10)]` | `<CTAButton variant="secondary">` |
| Award card | 2167:9075 | `w-[336px] flex flex-col gap-6` | `<AwardCard>` |
| Award image | I2167:9075;214:1019 | `border border-[#FFEA9E] rounded-3xl` | `<Image>` |
| Sun* Kudos block | 3390:10349 | `rounded-2xl bg-[#0F0F0F]` | `<KudosBlock>` |
| Widget button | 5022:15169 | `fixed rounded-full bg-[#FFEA9E] w-[106px] h-16 z-50` | `<WidgetButton>` |
| Footer | 5001:14800 | `border-t border-[#2E3940] py-10 px-[90px]` | `<Footer>` |
| Footer copyright | I5001:14800;342:1413 | `font-[var(--font-montserrat-alt)] text-base font-bold` | `<span>` in Footer |
| Footer "Tiêu chuẩn chung" | I5001:14800;1161:9487 | `w-[186px] h-14 text-base font-bold` | `<NavLink>` in Footer |

---

## Notes

- All colors use CSS variables defined in `globals.css`
- Countdown uses `Digital Numbers` font — must be loaded locally (not on Google Fonts)
- KUDOS wordmark uses `SVN-Gotham` font — must be loaded locally
- Award images are fetched from backend API (dynamic content)
- Widget button is `position: fixed` — must be inside a portal or at root level
- Ensure color contrast meets WCAG AA: white on `#00101A` passes (21:1)
- All icons MUST use the `<Icon>` component instead of raw SVG or img tags
- `mix-blend-mode: screen` on award images requires a dark background to render correctly
