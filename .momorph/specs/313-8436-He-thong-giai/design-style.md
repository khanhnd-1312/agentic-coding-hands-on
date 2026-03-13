# Design Style: Hệ Thống Giải

**Frame ID**: `313:8436`
**Frame Name**: `Hệ thống giải`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/313:8436
**Frame Image**: ![Frame](https://momorph.ai/api/images/9ypp4enmFmdK3YAFJLIu6C/313:8436/bd17cac24871c9513f259333a5431530.png)
**Extracted At**: 2026-03-11

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| `--color-background` | `#00101A` | 100% | Page background (rgba(0,16,26,1)) |
| `--color-header-bg` | `#101417` | 80% | Header background (rgba(16,20,23,0.8)) |
| `--color-gold` | `#FFEA9E` | 100% | Primary accent — page title, active nav indicator |
| `--color-gold-glow` | `#FAE287` | 100% | Award image glow shadow |
| `--color-gold-subtle` | `#FFEA9E` | 10% | Subtle gold tint background |
| `--color-text-primary` | `#FFFFFF` | 100% | Body text, nav item text |
| `--color-divider` | `#2E3940` | 100% | Section dividers (rgba(46,57,64,1)) |
| `--color-tan` | `#DBD1C1` | 100% | Secondary decorative (rgba(219,209,193,1)) |
| `--color-error` | `#D4271D` | 100% | Error / accent red (rgba(212,39,29,1)) |
| `--color-transparent` | `transparent` | 0% | Button transparent state |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing | Usage |
|------------|-------------|------|--------|-------------|----------------|-------|
| `--text-page-title` | Montserrat | 57px | 700 | 64px | -0.25px | Page main title "Hệ thống giải thưởng SAA 2025" |
| `--text-prize-value` | Montserrat | 36px | 700 | 44px | 0px | Prize value text (e.g., "7.000.000 VNĐ") |
| `--text-section-label` | Montserrat | 24px | 700 | 32px | 0px | Section sub-labels ("Số lượng giải thưởng:", "Sun* Kudos" subtitle-like labels) |
| `--text-award-title` | Montserrat | 24px | 700 | 32px | 0px | Award card titles (e.g., "Top Talent") |
| `--text-body` | Montserrat | 16px | 700 | 24px | 0.5px | Body/description text (award descriptions, Sun* Kudos desc) |
| `--text-nav` | Montserrat | 14px | 700 | 20px | 0.25px | Navigation item labels |
| `--text-small` | Montserrat | 14px | 700 | 20px | 0.1px | Small metadata labels (unit, sub-labels) |
| `--text-alt` | Montserrat Alternates | 16px | 700 | 24px | 0% | Alternating accent text |
| `--text-decorative` | SVN-Gotham | 96px | 400 | 24px | -13% | Decorative Keyvisual text |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| `--spacing-xs` | 4px | Nav item icon gap |
| `--spacing-sm` | 10px | Sun* Kudos internal gap |
| `--spacing-md` | 16px | Nav items gap, title-to-content gap |
| `--spacing-lg` | 24px | Content block gap |
| `--spacing-xl` | 32px | Card internal gap |
| `--spacing-2xl` | 40px | Section title gap |
| `--spacing-3xl` | 80px | Award card vertical gap, nav-to-content gap |
| `--spacing-4xl` | 96px | Page top/bottom padding |
| `--spacing-page-x` | 144px | Page horizontal padding |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-sm` | 4px | Nav item border-radius |
| `--radius-lg` | 16px | Content card border-radius |
| `--border-divider` | `1px solid #2E3940` | Section dividers |
| `--border-nav-active` | `1px solid #FFEA9E` | Active nav item bottom border |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| `--shadow-award-image` | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` | Award image golden glow |
| `--shadow-none` | none | Default no shadow |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| Frame width | 1440px | Desktop design |
| Frame height | 6410px | Full page scroll |
| Content max-width | 1152px | Inner content container |
| Padding horizontal | 144px | Left + right |
| Padding vertical | 96px | Top + bottom |

### Page Structure

| Section | Height | Position | Notes |
|---------|--------|----------|-------|
| Header | 80px | Fixed top | Background rgba(16,20,23,0.8) |
| Keyvisual / Hero | 547px | Top of page | Full-width hero image |
| Cover gradient | 627px | Overlays keyvisual | Dark gradient overlay |
| Title section | 129px | After keyvisual | Section title + divider |
| Award system section | 4833px | Main content | Left nav + right cards |
| Sun* Kudos | 500px | After awards | CTA block |
| Footer | ~246px | Bottom | Border-top divider |

### Layout Structure (ASCII)

```
┌────────────────────────────────────────────────────────────── 1440px ──┐
│  Header (h:80px, bg:rgba(16,20,23,0.8), px:144px)                       │
│  ┌───────────┐                          ┌──────────────────────────────┐│
│  │ Logo      │                          │ Nav links + Profile Avatar   ││
│  └───────────┘                          └──────────────────────────────┘│
├────────────────────────────────────────────────────────────────────────┤
│  Keyvisual / Hero (h:547px)                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  Background image + gradient overlay                                ││
│  │  Title: "ROOT FURTHER" + Logo + Icon                                ││
│  └─────────────────────────────────────────────────────────────────────┘│
├────────────────────────────────────────────────────────────────────────┤
│  Content Area (px:144px, py:96px)                                       │
│  ┌──────────────────────────────── 1152px ─────────────────────────────┐│
│  │  A: Title Section (h:129px, gap:16px)                               ││
│  │  ┌────────────────────────────────────────────────────────────────┐ ││
│  │  │  "Sun* annual awards 2025" (Montserrat 24px 700, color:#FFF)   │ ││
│  │  │  Divider (1px, #2E3940)                                        │ ││
│  │  │  "Hệ thống giải thưởng SAA 2025" (57px 700, #FFEA9E)          │ ││
│  │  └────────────────────────────────────────────────────────────────┘ ││
│  │                                                                     ││
│  │  B: Award System Section (flex-row, gap:80px)                       ││
│  │  ┌─── 178px nav ───┐  ┌────────────── 853px content ──────────────┐ ││
│  │  │  C: Menu List   │  │  D: Award Cards (flex-col, gap:80px)      │ ││
│  │  │  - Top Talent   │  │  ┌─────────────────────────────────────┐  │ ││
│  │  │  - Top Project  │  │  │  D.1 Top Talent Card (h:631px)      │  │ ││
│  │  │  - Top Project  │  │  │  [Image 336x336] [Content block]    │  │ ││
│  │  │    Leader       │  │  └─────────────────────────────────────┘  │ ││
│  │  │  - Best Manager │  │  ┌─────────────────────────────────────┐  │ ││
│  │  │  - Signature    │  │  │  D.2 Top Project Card (h:679px)     │  │ ││
│  │  │    2025         │  │  └─────────────────────────────────────┘  │ ││
│  │  │  - MVP          │  │  ... (D.3 - D.6 similar)                  │ ││
│  │  └─────────────────┘  └───────────────────────────────────────────┘ ││
│  │                                                                     ││
│  │  D1: Sun* Kudos Section (h:500px, centered)                         ││
│  │  ┌────────────────────────────────────────────────────────────────┐ ││
│  │  │  Logo + Title "Sun* Kudos" + Description + "Chi tiết" button  │ ││
│  │  └────────────────────────────────────────────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────────────┘│
├────────────────────────────────────────────────────────────────────────┤
│  Footer (px:90px, py:40px, border-top: 1px #2E3940)                    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Header - `313:8440`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `313:8440` | - |
| width | 1440px | `width: 100%` |
| height | 80px | `height: 80px` |
| padding | 12px 144px | `padding: 12px 144px` |
| background | rgba(16,20,23,0.8) | `background-color: rgba(16,20,23,0.8)` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| justify-content | space-between | `justify-content: space-between` |
| gap | 238px | `gap: 238px` |

---

### Keyvisual (Hero Banner) - `313:8437`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `313:8437` | - |
| width | 1440px | `width: 100%` |
| height | 547px | `height: 547px` |
| background | image + gradient overlay | `background: url(...) cover, linear-gradient(...)` |
| overflow | hidden | `overflow: hidden` |

---

### Title Section - `313:8453`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `313:8453` | - |
| width | 1152px | `width: 100%` |
| height | 129px | `height: 129px` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| gap | 16px | `gap: 16px` |

#### Subtitle Text - `313:8454`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `313:8454` | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 24px | `font-size: 24px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 32px | `line-height: 32px` |
| letter-spacing | 0px | `letter-spacing: 0` |
| color | #FFFFFF | `color: white` |
| text-align | center | `text-align: center` |

#### Main Title Text - `313:8457`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `313:8457` | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 57px | `font-size: 57px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 64px | `line-height: 64px` |
| letter-spacing | -0.25px | `letter-spacing: -0.25px` |
| color | #FFEA9E | `color: #FFEA9E` |
| text-align | left | `text-align: left` |

---

### Navigation Menu - `313:8459`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `313:8459` | - |
| width | 178px | `width: 178px` |
| height | 448px | `height: 448px` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| gap | 16px | `gap: 16px` |

#### Nav Item (Default) - `313:8461` (Top project example)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `313:8461` | - |
| width | 146px | `width: 146px` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| border-radius | 4px | `border-radius: 4px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 4px | `gap: 4px` |

**Nav Item Text Typography:**

| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 14px | `font-size: 14px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 20px | `line-height: 20px` |
| letter-spacing | 0.25px | `letter-spacing: 0.25px` |
| text-align | center | `text-align: center` |

**Nav Item Icon:** 24x24px (`MM_MEDIA_Target` icon, positioned before the text label)

**States:**
| State | Property | Value |
|-------|----------|-------|
| Default | background | transparent |
| Default | color | `#FFFFFF` |
| Default | border | none |
| Default | text-shadow | none |
| Active | border-bottom | `1px solid #FFEA9E` |
| Active | color | `#FFEA9E` |
| Active | text-shadow | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` |
| Hover | background | `rgba(255, 234, 158, 0.1)` |
| Hover | cursor | pointer |

---

### Award Card - `313:8467` (D.1 Top Talent — reference for all cards)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `313:8467` | - |
| width | 856px | `width: 856px` |
| height | 631px (varies) | `height: auto` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| gap | 80px | `gap: 80px` |

#### Award Image - `I313:8467;214:2525`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I313:8467;214:2525` | - |
| width | 336px | `width: 336px` |
| height | 336px | `height: 336px` |
| padding | ~149px 53px | `padding: 149.864px 53.455px` |
| box-shadow | gold glow | `box-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` |
| mix-blend-mode | screen | `mix-blend-mode: screen` |

#### Award Content Block - `I313:8467;214:2526`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I313:8467;214:2526` | - |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| align-items | flex-start | `align-items: flex-start` |
| gap | 32px | `gap: 32px` |
| border-radius | 16px | `border-radius: 16px` |
| backdrop-filter | blur(32px) | `backdrop-filter: blur(32px)` |

#### Award Title - `I313:8467;214:2530`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I313:8467;214:2530` | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | **24px** | `font-size: 24px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 32px | `line-height: 32px` |
| letter-spacing | 0px | `letter-spacing: 0` |
| color | #FFEA9E | `color: #FFEA9E` |

#### Award Description Text

| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.5px | `letter-spacing: 0.5px` |
| color | #FFFFFF | `color: white` |
| text-align | justify | `text-align: justify` |

#### Award Card Inner Row (Image + Content) - `I313:8467;214:2803`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I313:8467;214:2803` | - |
| width | 856px | `width: 856px` |
| height | 550px | `height: 550px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | flex-start | `align-items: flex-start` |
| gap | 40px | `gap: 40px` |

#### Award Image Rectangle (inner) - `I313:8467;214:2525;81:2442`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I313:8467;214:2525;81:2442` | - |
| width | 336px | `width: 336px` |
| height | 336px | `height: 336px` |
| border | 0.955px solid #FFEA9E | `border: 1px solid #FFEA9E` |
| border-radius | 24px | `border-radius: 24px` |
| background | cover image | `background: url(...) cover` |

#### Award Content Block Width

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I313:8467;214:2527` (inner content) | - |
| width | **480px** | `width: 480px` |
| height | 248px (title+desc block) | - |

#### Metadata Row — "Số lượng giải thưởng"

| Property | Value | CSS |
|----------|-------|-----|
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 16px | `gap: 16px` |
| height | 44px | `height: 44px` |

**Typography in metadata row:**

| Element | Font Size | Weight | Color | Notes |
|---------|-----------|--------|-------|-------|
| Icon (Diamond) | 24x24px | - | - | `MM_MEDIA_Diamond` icon |
| "Số lượng giải thưởng:" label | 24px, lh:32px, ls:0 | 700 | `#FFEA9E` | Node `I313:8467;214:2536` |
| Quantity number (e.g., "10") | ~36px | 700 | `#FFFFFF` | Inside Frame 443 |
| Unit ("Đơn vị"/"Cá nhân"/"Tập thể") | 14px, lh:20px, ls:0.1px | 700 | `#FFFFFF` | Node `I313:8467;214:3532` |

#### Value Row — "Giá trị giải thưởng"

**Typography in value row:**

| Element | Font Size | Weight | Color | Notes |
|---------|-----------|--------|-------|-------|
| Icon (License) | 24x24px | - | - | `MM_MEDIA_License` icon |
| "Giá trị giải thưởng:" label | 24px, lh:32px, ls:0 | 700 | `#FFEA9E` | Node `I313:8467;214:2544` |
| Prize value (e.g., "7.000.000 VNĐ") | **36px**, lh:44px, ls:0 | 700 | `#FFFFFF` | Node `I313:8467;214:2546` |
| Sub-label ("cho mỗi giải thưởng") | 14px, lh:20px, ls:0.1px | 700 | `#FFFFFF` | Node `I313:8467;214:2547` |

---

### KV Block (Root Further Logo) - `313:8450`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `313:8450` | - |
| width | 1152px | `width: 100%` |
| height | 150px | `height: 150px` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| align-items | flex-start | `align-items: flex-start` |

**Inner content:** "ROOT FURTHER" logo image (RECTANGLE, 338x150px, `aspect-ratio: 169/75`, `background: cover`, no text). This is a decorative artwork logo image positioned above the title section.

---

### Sun* Kudos Section - `335:12023`

> ⚠️ **CORRECTION**: Layout is a **dark card** (`#0F0F0F`, border-radius:16px) with left-side content + right-side image. NOT a simple centered column.

**Outer wrapper:**

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `335:12023` | - |
| width | 1152px | `width: 100%` |
| height | 500px | `height: 500px` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| align-items | center | `align-items: center` |
| justify-content | center | `justify-content: center` |
| gap | 10px | `gap: 10px` |

**Inner card - `I335:12023;313:8415`:**

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I335:12023;313:8415` | - |
| width | 1152px | `width: 100%` |
| height | 500px | `height: 500px` |
| background | `#0F0F0F` + cover image | `background: url(...), #0F0F0F` |
| border-radius | 16px | `border-radius: 16px` |

**Content block (left) - `I335:12023;313:8419`:**

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I335:12023;313:8419` | - |
| width | 470px | `width: 470px` |
| height | 408px | `height: 408px` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| justify-content | center | `justify-content: center` |
| gap | 32px | `gap: 32px` |

**Sun* Kudos typography:**

| Element | Font Size | Weight | Line Height | Color | Notes |
|---------|-----------|--------|-------------|-------|-------|
| "Phong trào ghi nhận" label | 24px, ls:0 | 700 | 32px | `#FFFFFF` | Node `I335:12023;313:8421` |
| "Sun* Kudos" title | **57px**, ls:-0.25px | 700 | 64px | `#FFEA9E` | Node `I335:12023;313:8422` |
| Description text | 16px, ls:0.5px | 700 | 24px | `#FFFFFF` | Node `I335:12023;313:8423`, text-align:justify |

**Description text content (exact from Figma):**
> "ĐIỂM MỚI CỦA SAA 2025 Hoạt động ghi nhận và cảm ơn đồng nghiệp - lần đầu tiên được diễn ra dành cho tất cả Sunner. Hoạt động sẽ được triển khai vào tháng 11/2025, khuyến khích người Sun* chia sẻ những lời ghi nhận, cảm ơn đồng nghiệp trên hệ thống do BTC công bố. Đây sẽ là chất liệu để Hội đồng Heads tham khảo trong quá trình lựa chọn người đạt giải."

**Right image frame - `I335:12023;313:8417`:** 272x219px decorative art frame

#### "Chi tiết" Button - `I335:12023;313:8426`

> ⚠️ **CORRECTION**: Button is **solid gold filled**, NOT transparent outline. Text is dark on gold.

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I335:12023;313:8426` | - |
| width | 127px | `width: 127px` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| background | `#FFEA9E` (solid gold) | `background-color: #FFEA9E` |
| border-radius | 4px | `border-radius: 4px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 8px | `gap: 8px` |

**Button Text Typography:**

| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| color | **`#00101A`** (dark navy) | `color: #00101A` |

**Button Icon:** 24x24px `IC` icon instance (positioned after text, right side)

**States:**
| State | Property | Value |
|-------|----------|-------|
| Default | background | `#FFEA9E` (solid gold) |
| Default | color | `#00101A` (dark navy text) |
| Hover | background | `#F5DF8A` (slightly darker gold) |
| Hover | cursor | pointer |
| Focus | outline | `2px solid #FFEA9E`, outline-offset: 2px |

---

### Footer - `354:4323`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `354:4323` | - |
| width | 1440px | `width: 100%` |
| padding | 40px 90px | `padding: 40px 90px` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | space-between | `justify-content: space-between` |
| border-top | `1px solid #2E3940` | `border-top: 1px solid var(--color-divider)` |

---

## Component Hierarchy with Styles

```
313:8436 — Page (bg:#00101A, 1440x6410)
├── 313:8439 — Cover (overlay gradient, absolute, 1440x627)
├── 313:8440 — Header (Instance, flex-row, h:80px, bg:rgba(16,20,23,0.8), px:144px)
│   ├── LOGO (w:52px, h:48px)
│   └── Nav links + Avatar
│
├── 313:8437 — Keyvisual Group (1440x547, absolute)
│   └── Hero image (cover, crop center)
│
├── 313:8449 — Bìa / Content Area (flex-col, gap:120px, px:144px, py:96px)
│   ├── 313:8450 — KV block (1152x150, gap:40px, flex-col)
│   │
│   ├── 313:8453 — A: Title Section (1152x129, gap:16px, flex-col)
│   │   ├── 313:8454 — Subtitle text (Montserrat 24px 700, #FFF, center)
│   │   ├── 313:8455 — Divider rect (1152x1px, #2E3940)
│   │   └── 313:8456 — Title row (flex-row, gap:32px, h:64px)
│   │       └── 313:8457 — Main title (Montserrat 57px 700, #FFEA9E)
│   │
│   ├── 313:8458 — B: Award System (flex-row, gap:80px, 1152x4833)
│   │   ├── 313:8459 — C: Menu Nav (w:178px, flex-col, gap:16px)
│   │   │   ├── 313:8460 — C.1 Top Talent [ACTIVE] (border-bottom: 1px #FFEA9E)
│   │   │   ├── 313:8461 — C.2 Top Project (p:16px, r:4px)
│   │   │   ├── 313:8462 — C.3 Top Project Leader
│   │   │   ├── 313:8463 — C.4 Best Manager
│   │   │   ├── 313:8464 — C.5 Signature 2025
│   │   │   └── 313:8465 — C.6 MVP
│   │   │
│   │   └── 313:8466 — D: Award Cards List (w:853px, flex-col, gap:80px)
│   │       ├── 313:8467 — D.1 Top Talent (856x631, flex-col, gap:80px)
│   │       │   ├── Frame (flex-row, gap:40px)
│   │       │   │   ├── I..;214:2525 — Picture 336x336 (glow shadow)
│   │       │   │   └── I..;214:2526 — Content (r:16px, blur:32px)
│   │       │   │       ├── title + description (Montserrat 16px 700)
│   │       │   │       ├── divider (1px #2E3940)
│   │       │   │       ├── metadata row (qty + unit)
│   │       │   │       ├── divider
│   │       │   │       └── value row (prize amount)
│   │       │   └── bottom divider (1px #2E3940)
│   │       ├── 313:8468 — D.2 Top Project (679px)
│   │       ├── 313:8469 — D.3 Top Project Leader (679px)
│   │       ├── 313:8470 — D.4 Best Manager
│   │       ├── 313:8471 — D.5 Signature 2025
│   │       └── 313:8510 — D.6 MVP
│   │
│   └── 335:12023 — D1: Sun* Kudos (1152x500, centered, flex-col)
│       ├── Image / artwork
│       ├── Label "Phong trào ghi nhận"
│       ├── Title "Sun* Kudos"
│       ├── Description text
│       └── I..;313:8426 — Button "Chi tiết" (solid gold bg #FFEA9E, dark text #00101A, 127x56px)
│
└── 354:4323 — Footer (flex-row, px:90px, py:40px, border-top:#2E3940)
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | 767px |
| Tablet | 768px | 1023px |
| Desktop | 1024px | 1439px |
| Wide Desktop | 1440px | ∞ |

### Responsive Changes

#### Mobile (< 768px)

| Component | Changes |
|-----------|---------|
| Content area | padding: 16px |
| Award section | flex-direction: column (stack nav above cards) |
| Nav menu | display: horizontal scroll / tabs |
| Award card | flex-direction: column (image above content) |
| Award image | width: 100%, max-width: 280px |
| Page title | font-size: 32px |
| Header | padding: 12px 16px |

#### Tablet (768px - 1023px)

| Component | Changes |
|-----------|---------|
| Content area | padding: 48px 32px |
| Award section | gap: 40px |
| Nav menu | width: 140px |
| Award image | 240x240px |
| Page title | font-size: 40px |

#### Desktop (≥ 1024px)

| Component | Changes |
|-----------|---------|
| Content area | padding: 96px 144px (Figma spec) |
| Award section | flex-direction: row |
| Page title | font-size: 57px |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Nav item | border-bottom, color | 150ms | ease-in-out | Click/Active |
| Nav item | background-color | 150ms | ease-in-out | Hover |
| Award section | scroll position | smooth | ease-in-out | Nav click |
| Button "Chi tiết" | background-color | 150ms | ease-in-out | Hover |
| Page | scroll behavior | smooth | native | Anchor link |

---

## Icon Specifications

| Icon Name | Size | Color | Usage |
|-----------|------|-------|-------|
| Logo (Sun*) | 52x48px | White/Gold | Header left |
| Award icons | 336x336px | Various | Award card images |
| IC (icon in "Chi tiết" button) | 24x24px | #00101A | Button icon, right-side of "Chi tiết" button |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Page bg | `313:8436` | `bg-[#00101A] min-h-screen` | `<AwardSystemPage />` |
| Header | `313:8440` | `fixed top-0 w-full h-20 bg-[rgba(16,20,23,0.8)] backdrop-blur-sm px-36` | `<Header />` |
| Keyvisual | `313:8437` | `relative w-full h-[547px] overflow-hidden` | `<Keyvisual />` |
| Content area | `313:8449` | `flex flex-col gap-[120px] px-36 py-24` | `<ContentArea />` |
| Title section | `313:8453` | `flex flex-col gap-4 w-full` | `<SectionTitle />` |
| Main title | `313:8457` | `text-[57px] font-bold leading-[64px] tracking-[-0.25px] text-[#FFEA9E]` | `<h1>` |
| Award section | `313:8458` | `flex flex-row gap-20 w-full` | `<AwardSystemSection />` |
| Nav menu | `313:8459` | `flex flex-col gap-4 w-[178px]` | `<AwardNavMenu />` |
| Nav item (active) | `313:8460` | `border-b border-[#FFEA9E] text-[#FFEA9E] p-4` | `<AwardNavItem active />` |
| Nav item | `313:8461` | `rounded p-4 text-white hover:bg-[rgba(255,234,158,0.1)]` | `<AwardNavItem />` |
| Award cards list | `313:8466` | `flex flex-col gap-20 flex-1` | `<AwardCardList />` |
| Award card | `313:8467` | `flex flex-col gap-20 w-full` | `<AwardCard />` |
| Award image | `I313:8467;214:2525` | `w-[336px] h-[336px] shadow-[0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]` | `<AwardImage />` |
| Award content | `I313:8467;214:2526` | `flex flex-col gap-8 rounded-2xl backdrop-blur-[32px]` | `<AwardContent />` |
| Sun* Kudos | `335:12023` | `flex flex-col items-center justify-center h-[500px] w-full` | `<SunKudosBlock />` |
| Chi tiết button | `I335:12023;313:8426` | `bg-[#FFEA9E] text-[#00101A] w-[127px] h-14 px-4 rounded flex items-center gap-2 hover:bg-[#F5DF8A]` | `<Button variant="gold">` |
| Sun* Kudos card | `I335:12023;313:8415` | `relative w-full h-[500px] rounded-2xl bg-[#0F0F0F] overflow-hidden` | `<SunKudosCard />` |
| Sun* Kudos content | `I335:12023;313:8419` | `flex flex-col gap-8 w-[470px] h-[408px] justify-center` | `<SunKudosContent />` |
| KV block | `313:8450` | `w-full h-[150px] flex flex-col items-start` | `<KVBlock />` |
| Footer | `354:4323` | `flex justify-between items-center px-[90px] py-10 border-t border-[#2E3940]` | `<Footer />` |

---

## Notes

- All text colors use gold (#FFEA9E) for headings and white (#FFFFFF) for body on dark background
- Font family is **Montserrat** throughout (bold/700 weight dominant)
- **Montserrat** must be loaded via Google Fonts
- The dark background theme (#00101A) is consistent with SAA 2025 brand
- Award images use `mix-blend-mode: screen` with golden glow shadows
- Backdrop blur on content cards creates glassmorphism effect
- Nav active indicator is purely bottom-border based (no background fill)
- All icons **MUST BE** in **Icon Component** instead of svg files or img tags
- Color contrast: white text on #00101A meets WCAG AA (contrast > 7:1)
