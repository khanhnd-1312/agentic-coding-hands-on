# Design Style: Viết Kudo (Write Kudo)

**Frame ID**: `520:11602`
**Frame Name**: `Viết Kudo`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/520:11602
**Extracted At**: 2026-03-17

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-page-bg | #00101A | 100% | Page background (dark theme) |
| --color-overlay | #00101A | 80% | Modal backdrop overlay |
| --color-modal-bg | #FFF8E1 | 100% | Modal container background (warm cream) |
| --color-text-primary | #00101A | 100% | Headings, labels, body text |
| --color-text-placeholder | #999999 | 100% | Input placeholder text |
| --color-text-hint | #999999 | 100% | Hint/helper text below fields |
| --color-border | #998C5F | 100% | Input borders, button borders |
| --color-input-bg | #FFFFFF | 100% | Input field background |
| --color-btn-primary-bg | #FFEA9E | 100% | Primary "Gửi" button background |
| --color-btn-secondary-bg | rgba(255, 234, 158, 0.10) | 10% | Secondary "Hủy" button background |
| --color-delete-btn | #D4271D | 100% | Image delete (x) button background |
| --color-active-nav | #FFEA9E | 100% | Active navigation link (Sun* Kudos) |
| --color-error | #E46060 | 100% | Community standards link / error text |
| --color-required | #E46060 | 100% | Required field asterisk (*) color |
| --color-header-bg | #101417 | 80% | Header background |
| --color-chip-bg | #FFFFFF | 100% | Hashtag chip background (predicted) |
| --color-chip-border | #998C5F | 100% | Hashtag chip border (predicted) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-modal-title | Montserrat | 32px | 700 | 40px | 0 |
| --text-field-label | Montserrat | 22px | 700 | 28px | 0 |
| --text-input | Montserrat | 16px | 700 | 24px | 0.15px |
| --text-placeholder | Montserrat | 16px | 700 | 24px | 0.15px |
| --text-hint | Montserrat | 16px | 700 | 24px | 0.15px |
| --text-btn-primary | Montserrat | 22px | 700 | 28px | 0 |
| --text-btn-secondary | Montserrat | 16px | 700 | 24px | 0.15px |
| --text-nav | Montserrat | 16px | 700 | 24px | 0.15px |
| --text-nav-active | Montserrat | 16px | 700 | 24px | 0.15px |
| --text-checkbox | Montserrat | 22px | 700 | 28px | 0 |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-modal-padding | 40px | Modal internal padding (all sides) |
| --spacing-modal-gap | 32px | Gap between modal sections |
| --spacing-field-gap | 16px | Gap between label and input in a field row |
| --spacing-content-gap | 24px | Gap between content sections (hashtag, image, editor) |
| --spacing-toolbar-gap | 4px | Gap between rich-text toolbar and textarea |
| --spacing-action-gap | 24px | Gap between Cancel and Submit buttons |
| --spacing-input-padding | 16px 24px | Input field internal padding |
| --spacing-btn-padding-primary | 16px | Primary button padding |
| --spacing-btn-padding-secondary | 16px 40px | Secondary button padding |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-modal | 24px | Modal container border-radius |
| --radius-btn-primary | 8px | Primary "Gửi" button border-radius |
| --radius-nav | 4px | Navigation button border-radius |
| --radius-delete-btn | 71px (full circle) | Image delete button border-radius |
| --border-input | 1px solid #998C5F | Input field and button borders |
| --border-image | 1px solid #998C5F | Image thumbnail border |
| --border-image-selected | 1px solid #FFEA9E | Image thumbnail active/selected border |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-nav-active | 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 | Active nav item text shadow |
| --shadow-modal | none (uses overlay instead) | Modal elevation via backdrop |

---

## Layout Specifications

### Container (Modal)

| Property | Value | Notes |
|----------|-------|-------|
| width | 752px | Fixed modal width at desktop |
| height | auto | Content-driven; grows with content |
| max-height | 100vh | When content reaches window height, modal scrolls internally |
| overflow-y | auto | Scroll only when content exceeds viewport |
| padding | 40px | All sides |
| gap | 32px | Between sections |
| border-radius | 24px | Rounded corners |
| background | #FFF8E1 | Warm cream |
| position | centered | Horizontally and vertically centered on page |

### Grid/Flex Layout

| Property | Value | Notes |
|----------|-------|-------|
| display | flex | Modal main layout |
| flex-direction | column | Vertical stack of form sections |
| gap | 32px | Between major sections |
| align-items | flex-start | Left-aligned children |

### Layout Structure (ASCII)

```
┌─────────────────────────────────────────────────────────────────┐
│  Page (1440×1024, bg: #00101A)                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Header (1440×80, bg: rgba(16,20,23,0.8), p: 12px 144px) │  │
│  │  [Logo] [About SAA] [Awards Info] [Sun* Kudos] ... [VN]  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────── Overlay (rgba(0,16,26,0.8)) ──────────┐    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │  Modal (752px, p: 40px, gap: 32px, r: 24px)     │    │    │
│  │  │  bg: #FFF8E1                                     │    │    │
│  │  │                                                  │    │    │
│  │  │  ┌──────────────────────────────────────────┐    │    │    │
│  │  │  │  A: Title (672px, 32px/700, centered)     │    │    │    │
│  │  │  │  "Gửi lời cám ơn và ghi nhận đến..."     │    │    │    │
│  │  │  └──────────────────────────────────────────┘    │    │    │
│  │  │                                                  │    │    │
│  │  │  ┌────────────┐ ┌──────────────────────────┐     │    │    │
│  │  │  │ B.1: Label  │ │ B.2: Search Input        │     │    │    │
│  │  │  │ "Người nhận"│ │ (514×56, p: 16px 24px)   │     │    │    │
│  │  │  │ 22px/700 *  │ │ border: 1px #998C5F      │     │    │    │
│  │  │  └────────────┘ └──────────────────────────┘     │    │    │
│  │  │                                                  │    │    │
│  │  │  ┌────────────┐ ┌──────────────────────────┐     │    │    │
│  │  │  │ Label       │ │ Danh hiệu Input          │     │    │    │
│  │  │  │ "Danh hiệu"│ │ (514×56, p: 16px 24px)   │     │    │    │
│  │  │  │ 22px/700 *  │ │ border: 1px #998C5F      │     │    │    │
│  │  │  └────────────┘ └──────────────────────────┘     │    │    │
│  │  │  Hint: "Ví dụ: Người truyền động lực cho tôi"   │    │    │
│  │  │                                                  │    │    │
│  │  │  ┌──────────────────────────────────────────┐    │    │    │
│  │  │  │ C: Toolbar (672px, h: 40px)               │    │    │    │
│  │  │  │ [B] [I] [S] [≡] [🔗] [❝] | Tiêu chuẩn.. │    │    │    │
│  │  │  ├──────────────────────────────────────────┤    │    │    │
│  │  │  │ D: Textarea (672px, h: 200px)             │    │    │    │
│  │  │  │ p: 16px 24px, border: 1px #998C5F         │    │    │    │
│  │  │  │ placeholder: "Hãy gửi gắm lời cám ơn..." │    │    │    │
│  │  │  └──────────────────────────────────────────┘    │    │    │
│  │  │  D.1: "Bạn có thể '@+tên' để nhắc..."          │    │    │
│  │  │                                                  │    │    │
│  │  │  ┌────────────┐ ┌─────────────────┐              │    │    │
│  │  │  │ E.1: Label  │ │ [+ Hashtag]     │              │    │    │
│  │  │  │ "Hashtag" * │ │ Tối đa 5        │              │    │    │
│  │  │  └────────────┘ └─────────────────┘              │    │    │
│  │  │                                                  │    │    │
│  │  │  ┌──────┐ ┌─[img]─[img]─[img]─[img]─[img]─┐    │    │    │
│  │  │  │F.1:  │ │ 80×80 thumbnails with red ✕     │    │    │    │
│  │  │  │Image │ │ + [+ Image] (Tối đa 5)          │    │    │    │
│  │  │  └──────┘ └────────────────────────────────┘    │    │    │
│  │  │                                                  │    │    │
│  │  │  ☐ G: "Gửi lời cám ơn và ghi nhận ẩn danh"     │    │    │
│  │  │                                                  │    │    │
│  │  │  ┌────────────┐  ┌────────────────────────┐      │    │    │
│  │  │  │ H.1: Hủy ✕ │  │ H.2: Gửi ▷ (502×60)   │      │    │    │
│  │  │  │ secondary   │  │ bg: #FFEA9E, r: 8px   │      │    │    │
│  │  │  └────────────┘  └────────────────────────┘      │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### A: Modal Title

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9870 | - |
| width | 672px (fill) | `width: 100%` |
| height | auto (80px with 2 lines) | `height: auto` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 32px | `font-size: 32px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 40px | `line-height: 40px` |
| color | #00101A | `color: var(--color-text-primary)` |
| text-align | center | `text-align: center` |

---

### B: Người nhận (Recipient Field)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9871 | - |
| width | 672px (fill) | `width: 100%` |
| height | 56px | `height: 56px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 16px | `gap: 16px` |

#### B.1: Label "Người nhận"

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9872 | - |
| width | 146px | `width: 146px` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 22px | `font-size: 22px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 28px | `line-height: 28px` |
| color | #00101A | `color: var(--color-text-primary)` |

*Note: Required fields show a red asterisk "*" before the label.*

#### B.2: Search Input

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9873 | - |
| width | 514px (fill remaining) | `flex: 1` |
| height | 56px | `height: 56px` |
| padding | 16px 24px | `padding: 16px 24px` |
| background | #FFFFFF | `background-color: var(--color-input-bg)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| border-radius | 0px (default) | `border-radius: 0` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| placeholder color | #999999 | `color: var(--color-text-placeholder)` |

**States:**
| State | Changes |
|-------|---------|
| Default | border: 1px solid #998C5F |
| Focus | border-color: #FFEA9E (predicted) |
| Error | border-color: #E46060 |
| Filled | text color: #00101A |

---

### B': Danh hiệu (Title/Badge Field)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;1688:10448 | - |
| width | 672px (fill) | `width: 100%` |
| height | 104px (label + input + hint) | `height: auto` |
| display | block | `display: block` |

#### B'.1: Label "Danh hiệu"

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;1688:10436 | - |
| width | 139px | `width: auto` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 22px | `font-size: 22px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 28px | `line-height: 28px` |
| color | #00101A | `color: var(--color-text-primary)` |

*Note: Red asterisk (*) uses color #E46060 (`var(--color-required)`).*

#### B'.2: Danh hiệu Input

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;1688:10437 | - |
| width | 514px (fill remaining) | `flex: 1` |
| height | 56px | `height: 56px` |
| padding | 16px 24px | `padding: 16px 24px` |
| background | #FFFFFF | `background-color: var(--color-input-bg)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| placeholder | "Dành tặng một danh hiệu cho đồng đội" | - |
| placeholder color | #999999 | `color: var(--color-text-placeholder)` |

**States:**
| State | Changes |
|-------|---------|
| Default | border: 1px solid #998C5F |
| Focus | border-color: #FFEA9E (predicted) |
| Error | border-color: #E46060 |
| Filled | text color: #00101A |

#### B'.3: Hint Text (below Danh hiệu)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;1688:10447 | - |
| width | 418px | `width: auto` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| color | #999999 | `color: var(--color-text-hint)` |
| content (line 1) | "Ví dụ: Người truyền động lực cho tôi." | - |
| content (line 2) | "Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn." | - |

---

### Required Field Asterisk

| Property | Value | CSS |
|----------|-------|-----|
| content | "*" | `content: "*"` or inline `<span>` |
| color | #E46060 | `color: var(--color-required)` |
| font-size | inherit from label (22px) | `font-size: inherit` |
| position | before label text | - |

Applied to: Người nhận, Danh hiệu, Hashtag labels.

---

### C: Rich Text Toolbar

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9877 | - |
| width | 672px | `width: 100%` |
| height | 40px | `height: 40px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| border-bottom | none (connected to textarea) | `border-bottom: none` |

#### Toolbar Buttons (C.1–C.6: Bold, Italic, Strikethrough, List, Link, Quote)

| Property | Value | CSS |
|----------|-------|-----|
| **Node IDs** | C.1: I520:11647;520:9881, C.2: I520:11647;662:11119, C.3: I520:11647;662:11213, C.4: I520:11647;662:10376, C.5: I520:11647;662:10507, C.6: I520:11647;662:10647 | - |
| width | ~48px each | `width: 48px` |
| height | 40px | `height: 40px` |
| padding | 10px 16px | `padding: 10px 16px` |
| background | transparent | `background: transparent` |
| border-right | 1px solid #998C5F | `border-right: 1px solid var(--color-border)` |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default | background: transparent |
| Hover | background: rgba(0,0,0,0.05) (predicted) |
| Active/Toggled | background: rgba(0,0,0,0.1) (predicted) |

#### Community Standards Link

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;3053:11621 | - |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| color | #E46060 | `color: var(--color-error)` |
| text-decoration | none | `text-decoration: none` |

---

### D: Message Textarea

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9886 | - |
| width | 672px | `width: 100%` |
| height | 200px | `min-height: 200px` |
| padding | 16px 24px | `padding: 16px 24px` |
| background | #FFFFFF | `background-color: var(--color-input-bg)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| border-top | none (connected to toolbar) | `border-top: none` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| placeholder color | #999999 | `color: var(--color-text-placeholder)` |

**States:**
| State | Changes |
|-------|---------|
| Default | border: 1px solid #998C5F |
| Focus | border-color: #FFEA9E (predicted) |
| Error | border-color: #E46060 |

---

### D.1: Hint Text

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9887 | - |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| color | #999999 (predicted) | `color: var(--color-text-hint)` |

---

### E: Hashtag Section

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9890 | - |
| width | 672px | `width: 100%` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 16px | `gap: 16px` |

#### E.1: Label "Hashtag"

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9891 | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 22px | `font-size: 22px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 28px | `line-height: 28px` |
| color | #00101A | `color: var(--color-text-primary)` |

#### E.2: "+ Hashtag" Button

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;662:8911 | - |
| height | 48px | `height: 48px` |
| padding | 4px 8px | `padding: 4px 8px` |
| background | #FFFFFF | `background-color: var(--color-input-bg)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| font-size | 16px | `font-size: 16px` |
| color | #999999 | `color: var(--color-text-placeholder)` |
| content (line 1) | "+" icon + "Hashtag" | - |
| content (line 2) | "Tối đa 5" (smaller sub-text) | - |
| visibility | hidden when `selectedHashtags.length >= 5` | - |

#### E.3: Hashtag Chip (predicted — not shown in default state)

| Property | Value | CSS |
|----------|-------|-----|
| height | 32px (predicted) | `height: 32px` |
| padding | 4px 12px | `padding: 4px 12px` |
| background | #FFFFFF | `background-color: var(--color-chip-bg)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-chip-border)` |
| border-radius | 16px (pill) | `border-radius: 9999px` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 14px (predicted) | `font-size: 14px` |
| font-weight | 700 | `font-weight: 700` |
| color | #00101A | `color: var(--color-text-primary)` |
| gap | 4px (between text and "x") | `gap: 4px` |
| "x" close icon | 12×12, color: #999 | `width: 12px; height: 12px` |

---

### F: Image Section

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9896 | - |
| width | 672px | `width: 100%` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 16px | `gap: 16px` |

#### F.1: Label "Image"

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9897 | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 22px | `font-size: 22px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 28px | `line-height: 28px` |
| color | #00101A | `color: var(--color-text-primary)` |

#### F.2–F.4: Image Thumbnails

| Property | Value | CSS |
|----------|-------|-----|
| **Node IDs** | I520:11647;662:9197, I520:11647;662:9393, I520:11647;662:9439 | - |
| width | 80px | `width: 80px` |
| height | 80px | `height: 80px` |
| background | #FFFFFF | `background-color: white` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| object-fit | cover | `object-fit: cover` |
| position | relative | `position: relative` (for delete button) |

#### Image Delete Button (red circle "x")

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | e.g. I520:11647;662:9197;662:9287 | - |
| width | 20px | `width: 20px` |
| height | 20px | `height: 20px` |
| border-radius | 71px (circle) | `border-radius: 50%` |
| background | #D4271D | `background-color: var(--color-delete-btn)` |
| padding | 1.43px | `padding: 1.4px` |
| position | absolute, top-right | `position: absolute; top: -6px; right: -6px` |
| color | #FFFFFF | `color: white` |

#### F.5: "+ Image" Button

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;662:9132 | - |
| height | 48px | `height: 48px` |
| padding | 4px 8px | `padding: 4px 8px` |
| background | #FFFFFF | `background-color: var(--color-input-bg)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| font-size | 16px | `font-size: 16px` |
| color | #999999 | `color: var(--color-text-placeholder)` |
| content (line 1) | "+" icon + "Image" | - |
| content (line 2) | "Tối đa 5" (smaller sub-text) | - |
| visibility | hidden when `attachedImages.length >= 5` | - |

---

### G: Anonymous Checkbox

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:14099 | - |
| width | 672px | `width: 100%` |
| height | 28px | `height: 28px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 16px | `gap: 16px` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 22px | `font-size: 22px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 28px | `line-height: 28px` |
| color | #999999 | `color: var(--color-text-hint)` |

#### G.1: Checkbox Input

| Property | Value | CSS |
|----------|-------|-----|
| width | 20px (predicted) | `width: 20px` |
| height | 20px (predicted) | `height: 20px` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| border-radius | 4px (predicted) | `border-radius: 4px` |
| background (unchecked) | transparent | `background: transparent` |
| background (checked) | #FFEA9E (predicted) | `background: var(--color-btn-primary-bg)` |
| checkmark color | #00101A (predicted) | `color: var(--color-text-primary)` |

**States:**
| State | Changes |
|-------|---------|
| Unchecked | border: 1px solid #998C5F, background: transparent |
| Checked | background: #FFEA9E, border-color: #FFEA9E, checkmark visible |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |

---

### H.1: Cancel Button ("Hủy")

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9906 | - |
| width | auto (~146px) | `width: auto` |
| height | 60px | `height: 60px` |
| padding | 16px 40px | `padding: 16px 40px` |
| background | rgba(255,234,158,0.10) | `background-color: var(--color-btn-secondary-bg)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| border-radius | 0px (default) | `border-radius: 0` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| color | #00101A | `color: var(--color-text-primary)` |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default | background: rgba(255,234,158,0.10) |
| Hover | background: rgba(255,234,158,0.20) (predicted) |

---

### H.2: Submit Button ("Gửi")

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9907 | - |
| width | 502px | `flex: 1` |
| height | 60px | `height: 60px` |
| padding | 16px | `padding: 16px` |
| background | #FFEA9E | `background-color: var(--color-btn-primary-bg)` |
| border | none | `border: none` |
| border-radius | 8px | `border-radius: var(--radius-btn-primary)` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 22px | `font-size: 22px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 28px | `line-height: 28px` |
| color | #00101A | `color: var(--color-text-primary)` |
| text-align | center | `text-align: center` |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default | background: #FFEA9E |
| Hover | background: #FFE27A (predicted — slightly darker gold) |
| Active | background: #FFD94E (predicted) |
| Disabled | background: #E5E5E5, color: #999, cursor: not-allowed |
| Loading | show spinner, text hidden |

---

## Component Hierarchy with Styles

```
Page (1440×1024, bg: #00101A)
├── Keyvisual (background image, 1611×640)
├── Cover (gradient overlay, 1440×512)
├── Header (1440×80, bg: rgba(16,20,23,0.8), px: 144px)
│   ├── Logo (52×48)
│   ├── Nav Links (flex, gap: 24px)
│   │   ├── "About SAA 2025" (Montserrat 16/700, #FFF)
│   │   ├── "Awards Information" (Montserrat 14/700, #FFF)
│   │   └── "Sun* Kudos" (Montserrat 16/700, #FFEA9E, border-bottom, text-shadow)
│   └── Right Section (flex, gap: 16px)
│       ├── Language Selector "VN" (Montserrat 16/700)
│       └── User Avatar Button (40×40, border: 1px #998C5F)
│
├── Overlay Mask (1440×1024, bg: rgba(0,16,26,0.8))
│
└── Modal "Viết KUDO" (752px, p: 40px, gap: 32px, r: 24px, bg: #FFF8E1)
    ├── A: Title (672px, Montserrat 32/700, #00101A, text-center)
    │
    ├── B: Người nhận Row (672px, flex-row, gap: 16px, items-center)
    │   ├── B.1: Label (146×28, Montserrat 22/700, #00101A, "*" in #E46060 + "Người nhận")
    │   └── B.2: Search Input (514×56, p: 16px 24px, border: 1px #998C5F, bg: #FFF)
    │
    ├── B': Danh hiệu Row (672px, flex-row + hint below)
    │   ├── B'.1: Label (139×28, Montserrat 22/700, #00101A, "*" in #E46060 + "Danh hiệu")
    │   ├── B'.2: Input (514×56, p: 16px 24px, border: 1px #998C5F, bg: #FFF)
    │   └── B'.3: Hint Text (Montserrat 16/700, #999, 2 lines)
    │
    ├── Content (672px, flex-col, gap: 24px)
    │   ├── Editor Block (flex-col, gap: 4px)
    │   │   ├── C: Toolbar (672×40, flex-row, border: 1px #998C5F)
    │   │   │   ├── [B] [I] [S] [≡] [🔗] [❝] (each ~48×40)
    │   │   │   └── "Tiêu chuẩn cộng đồng" (Montserrat 16/700, #E46060)
    │   │   ├── D: Textarea (672×200, p: 16px 24px, border: 1px #998C5F, bg: #FFF)
    │   │   └── D.1: Hint (Montserrat 16/700, #999)
    │   │
    │   ├── E: Hashtag Row (flex-row, gap: 16px, items-center)
    │   │   ├── E.1: Label (108×28, Montserrat 22/700, #00101A, "* Hashtag")
    │   │   └── E.2: [+ Hashtag] Button (h: 48px, p: 4px 8px, border: 1px #998C5F)
    │   │
    │   └── F: Image Row (flex-row, gap: 16px, items-center)
    │       ├── F.1: Label (74×28, Montserrat 22/700, #00101A, "Image")
    │       ├── F.2–F.4: Thumbnails × 5 (each 80×80, border: 1px #998C5F)
    │       │   └── Delete Button (20×20, r: 50%, bg: #D4271D, absolute top-right)
    │       └── F.5: [+ Image] Button (h: 48px, p: 4px 8px, border: 1px #998C5F)
    │
    ├── G: Anonymous Checkbox (flex-row, gap: 16px, items-center)
    │   ├── Checkbox (□)
    │   └── Label (Montserrat 22/700, #999)
    │
    └── H: Action Row (672×60, flex-row, gap: 24px)
        ├── H.1: "Hủy ✕" (p: 16px 40px, border: 1px #998C5F, bg: rgba(255,234,158,0.1))
        └── H.2: "Gửi ▷" (502×60, p: 16px, bg: #FFEA9E, r: 8px, Montserrat 22/700)
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
| Modal | width: 100vw, height: 100vh (full-screen), border-radius: 0 |
| Modal padding | 20px |
| Field rows | flex-direction: column (label above input) |
| Label width | 100% (full width) |
| Input width | 100% (full width) |
| Submit button | width: 100% |
| Image thumbnails | 60×60px |
| Title | font-size: 24px |

#### Tablet (768px - 1023px)

| Component | Changes |
|-----------|---------|
| Modal | width: 90vw, max-width: 752px |
| Modal padding | 32px |

#### Desktop (≥ 1024px)

| Component | Changes |
|-----------|---------|
| Modal | width: 752px (fixed), centered |
| Modal padding | 40px |
| Layout | As designed — row layout for fields |

---

## Icon Specifications

| Icon Name | Size | Color | Usage |
|-----------|------|-------|-------|
| icon-dropdown | 24×24 | #998C5F | Dropdown arrow in search input |
| icon-bold | 20×20 | #00101A | Toolbar bold button |
| icon-italic | 20×20 | #00101A | Toolbar italic button |
| icon-strikethrough | 20×20 | #00101A | Toolbar strikethrough button |
| icon-list-ordered | 20×20 | #00101A | Toolbar ordered list button |
| icon-link | 20×20 | #00101A | Toolbar link button |
| icon-quote | 20×20 | #00101A | Toolbar quote button |
| icon-close | 12×12 | #FFFFFF | Image delete button (inside red circle) |
| icon-cancel | 16×16 | #00101A | Cancel button "✕" icon |
| icon-send | 16×16 | #00101A | Submit button "▷" icon |
| icon-plus | 16×16 | #999999 | "+ Hashtag" and "+ Image" prefix icon |
| icon-checkbox | 24×24 | #998C5F | Anonymous toggle checkbox |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Overlay | opacity | 200ms | ease-out | Modal open/close |
| Modal | opacity, transform (scale 0.95→1) | 200ms | ease-out | Modal open |
| Modal | opacity, transform (scale 1→0.95) | 150ms | ease-in | Modal close |
| Buttons | background-color | 150ms | ease-in-out | Hover |
| Inputs | border-color | 150ms | ease-in-out | Focus |
| Toolbar buttons | background-color | 100ms | ease-in-out | Hover/Toggle |
| Image thumbnail | opacity | 150ms | ease-out | Add/Remove |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Modal Overlay | 520:11646 | `fixed inset-0 bg-[#00101A]/80 z-50` | `<ModalOverlay />` |
| Modal Container | 520:11647 | `w-[752px] p-10 rounded-3xl bg-[#FFF8E1] flex flex-col gap-8` | `<WriteKudoModal />` |
| Title | I520:11647;520:9870 | `text-[32px] font-bold leading-10 text-center font-montserrat text-[#00101A]` | `<h2>` |
| Recipient Field | I520:11647;520:9871 | `flex items-center gap-4` | `<RecipientField />` |
| Field Label | I520:11647;520:9872 | `text-[22px] font-bold leading-7 font-montserrat text-[#00101A]` | `<label>` |
| Required Asterisk | - | `text-[#E46060]` | `<span className="text-[#E46060]">*</span>` |
| Search Input | I520:11647;520:9873 | `flex-1 h-14 px-6 py-4 border border-[#998C5F] bg-white font-montserrat` | `<SearchInput />` |
| Danh hiệu Field | I520:11647;1688:10448 | `flex flex-col gap-2` | `<DanhHieuField />` |
| Danh hiệu Input | I520:11647;1688:10437 | `flex-1 h-14 px-6 py-4 border border-[#998C5F] bg-white font-montserrat` | `<Input />` |
| Danh hiệu Hint | I520:11647;1688:10447 | `text-base font-bold text-[#999] font-montserrat` | `<p>` |
| Rich Text Toolbar | I520:11647;520:9877 | `flex items-center h-10 border border-[#998C5F] border-b-0` | `<EditorToolbar />` |
| Textarea | I520:11647;520:9886 | `w-full min-h-[200px] px-6 py-4 border border-[#998C5F] border-t-0 bg-white` | `<RichTextEditor />` |
| Hashtag Section | I520:11647;520:9890 | `flex items-center gap-4` | `<HashtagField />` |
| Hashtag Chip | - | `h-8 px-3 border border-[#998C5F] rounded-full bg-white text-sm font-bold` | `<HashtagChip />` |
| Image Section | I520:11647;520:9896 | `flex items-center gap-4` | `<ImageUploadField />` |
| Image Thumbnail | I520:11647;662:9197 | `w-20 h-20 border border-[#998C5F] relative` | `<ImageThumbnail />` |
| Delete Button | I520:11647;662:9197;662:9287 | `absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#D4271D]` | `<DeleteButton />` |
| Anonymous Toggle | I520:11647;520:14099 | `flex items-center gap-4 text-[22px] font-bold text-[#999]` | `<AnonymousToggle />` |
| Cancel Button | I520:11647;520:9906 | `px-10 py-4 border border-[#998C5F] bg-[#FFEA9E]/10 font-montserrat font-bold` | `<Button variant="secondary">` |
| Submit Button | I520:11647;520:9907 | `flex-1 h-[60px] rounded-lg bg-[#FFEA9E] text-[22px] font-bold font-montserrat` | `<Button variant="primary">` |

---

## Notes

- All colors should use CSS variables for theming support
- Prefer Tailwind utility classes where project uses Tailwind
- Icons should be SVG for scalability
- Font should be loaded via Google Fonts or local files
- Ensure color contrast meets WCAG AA (4.5:1 for normal text)
- All icons **MUST BE** in **Icon Component** instead of svg files or img tags.
- The design uses a warm gold/cream palette (#FFF8E1, #FFEA9E) consistent with the SAA 2025 brand.
- The `Montserrat` font is used throughout with weight 700 (bold) — verify this matches the project's global font configuration.
