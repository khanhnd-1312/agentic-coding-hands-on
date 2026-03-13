# Feature Specification: Hệ Thống Giải

**Frame ID**: `313:8436`
**Frame Name**: `Hệ thống giải`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/313:8436
**Created**: 2026-03-11
**Status**: Draft

---

## Overview

Trang "Hệ Thống Giải" (Award System) là màn hình giới thiệu toàn bộ hạng mục giải thưởng của sự kiện Sun* Annual Awards 2025 (SAA 2025). Trang hiển thị thông tin chi tiết về 6 giải thưởng (Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 – Creator, MVP) kèm số lượng và giá trị từng giải. Bên dưới là khối quảng bá chương trình "Sun* Kudos".

Đây là màn hình **thông tin tĩnh** — không có form, không có input — chỉ hiển thị và điều hướng nội bộ trong trang.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Xem tổng quan hệ thống giải thưởng SAA 2025 (Priority: P1)

Người dùng truy cập trang Hệ Thống Giải để tìm hiểu có những giải thưởng nào, tiêu chí và giá trị của từng giải.

**Why this priority**: Đây là nội dung cốt lõi của trang, cần hiển thị đúng và đầy đủ ngay khi vào trang.

**Independent Test**: Mở trang `/awards`, kiểm tra tất cả 6 thẻ giải thưởng hiển thị với tiêu đề, mô tả, số lượng và giá trị chính xác.

**Acceptance Scenarios**:

1. **Given** người dùng đã đăng nhập và truy cập `/awards`, **When** trang load xong, **Then** hiển thị hero banner Keyvisual, tiêu đề "Hệ thống giải thưởng SAA 2025" màu vàng (#FFEA9E), navigation menu bên trái với 6 mục, và đầy đủ 6 thẻ giải thưởng bên phải.
2. **Given** trang đã load, **When** người dùng scroll xuống, **Then** lần lượt thấy các thẻ: Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 – Creator, MVP.
3. **Given** mỗi thẻ giải thưởng, **When** người dùng xem, **Then** thấy: ảnh/icon giải (336x336px), tiêu đề giải, mô tả, số lượng giải thưởng (kèm đơn vị Cá nhân/Tập thể), và giá trị giải thưởng (VNĐ).

---

### User Story 2 - Điều hướng nhanh tới hạng mục giải bằng menu trái (Priority: P1)

Người dùng sử dụng menu điều hướng bên trái để nhảy nhanh tới phần giải thưởng mình quan tâm.

**Why this priority**: Menu nav giúp UX điều hướng trong trang dài (6410px) — quan trọng như nội dung chính.

**Independent Test**: Click vào từng mục trong nav menu, kiểm tra trang scroll đến đúng section, và mục đó hiển thị trạng thái active (border-bottom vàng).

**Acceptance Scenarios**:

1. **Given** trang đã load với nav menu hiển thị "Top Talent" đang active, **When** người dùng click "Top Project" trong nav, **Then** trang smooth-scroll đến section "Top Project" và nav item "Top Project" có `border-bottom: 1px solid #FFEA9E`.
2. **Given** người dùng đang ở bất kỳ vị trí nào trên trang, **When** scroll qua một section giải thưởng, **Then** nav item tương ứng tự động chuyển sang active (scroll spy).
3. **Given** hover lên một nav item không active, **When** di chuột, **Then** nav item hiển thị background `rgba(255,234,158,0.1)` (gold subtle) và cursor pointer.
4. **Given** nav menu hiển thị 6 mục: "Top Talent", "Top Project", "Top Project Leader", "Best Manager", "Signature 2025 - Creator", "MVP", **When** trang load, **Then** "Top Talent" là mục active mặc định (đầu tiên hiển thị trong viewport).

---

### User Story 3 - Xem giải thưởng Top Talent (Priority: P2)

Người dùng muốn biết chi tiết về giải Top Talent: tiêu chí, số lượng (10 Đơn vị) và giá trị (7.000.000 VNĐ/giải).

**Why this priority**: Mỗi thẻ giải là nội dung độc lập quan trọng; P2 vì đây là một trong 6 giải tương tự nhau.

**Independent Test**: Kiểm tra thẻ D.1 Top Talent hiển thị đúng ảnh, tiêu đề, mô tả, và metadata (10 Đơn vị / 7.000.000 VNĐ).

**Acceptance Scenarios**:

1. **Given** section D.1, **When** người dùng xem, **Then** thấy ảnh giải thưởng 336x336px với hiệu ứng glow vàng (#FAE287), tiêu đề "Top Talent" màu vàng.
2. **Given** section D.1, **When** xem metadata, **Then** hiển thị "Số lượng giải thưởng: 10 Đơn vị" và "Giá trị giải thưởng: 7.000.000 VNĐ cho mỗi giải thưởng".
3. **Given** section D.1, **When** xem mô tả, **Then** đoạn văn mô tả đầy đủ tiêu chí vinh danh, justify-align.

---

### User Story 4 - Xem thẻ giải thưởng các hạng mục còn lại (Priority: P2)

Tương tự D.1, người dùng xem chi tiết các giải: Top Project (2 Tập thể / 15tr), Top Project Leader (3 Cá nhân / 7tr), Best Manager (1 Cá nhân / 10tr), Signature 2025 (1 Cá nhân 5tr / 1 Tập thể 8tr), MVP (1 / 15tr).

**Why this priority**: Các thẻ dùng cùng template component — quan trọng để verify dữ liệu chính xác cho từng giải.

**Independent Test**: Kiểm tra từng thẻ D.2-D.6 hiển thị đúng dữ liệu.

**Acceptance Scenarios**:

1. **Given** thẻ D.2 Top Project, **When** xem, **Then** hiển thị "Số lượng: 02 Tập thể" và "Giá trị: 15.000.000 VNĐ".
2. **Given** thẻ D.4 Best Manager, **When** xem, **Then** hiển thị "Số lượng: 01 Cá nhân" và "Giá trị: 10.000.000 VNĐ".
3. **Given** thẻ D.5 Signature 2025, **When** xem, **Then** hiển thị "Giá trị: 5.000.000 VNĐ (Cá nhân) / 8.000.000 VNĐ (Tập thể)".
4. **Given** thẻ D.6 MVP, **When** xem, **Then** hiển thị "Số lượng: 01" và "Giá trị: 15.000.000 VNĐ".

---

### User Story 5 - Điều hướng tới Sun* Kudos Live board từ trang giải thưởng (Priority: P2)

Người dùng thấy block quảng bá "Sun* Kudos" ở cuối trang và click nút "Chi tiết" để điều hướng sang trang **Sun* Kudos Live board** (`/kudo/live`) trong cùng tab.

**Why this priority**: CTA quan trọng để cross-promote tính năng Sun* Kudos.

**Independent Test**: Click nút "Chi tiết" trong block Sunkudos, kiểm tra trang chuyển hướng **same tab** tới `/kudo/live`.

**Acceptance Scenarios**:

1. **Given** người dùng scroll đến cuối trang, **When** thấy block "Sun* Kudos" với label "Phong trào ghi nhận", tiêu đề "Sun* Kudos" (57px gold), mô tả và nút "Chi tiết", **Then** nút hiển thị đúng style: **solid gold background (#FFEA9E), dark navy text (#00101A), border-radius 4px, width 127px, kèm icon bên phải**.
2. **Given** hover nút "Chi tiết", **When** di chuột, **Then** background chuyển sang `#F5DF8A` (gold đậm hơn) + cursor pointer.
3. **Given** click nút "Chi tiết", **When** click, **Then** điều hướng **same tab** tới trang Sun* Kudos Live board (`/kudo/live`, frame `2940:13431`). Không mở new tab.

---

### User Story 6 - Xem hero banner Keyvisual (Priority: P3)

Người dùng thấy hero banner nghệ thuật với hình ảnh "ROOT FURTHER", tiêu đề sự kiện và logo ở đầu trang.

**Why this priority**: Trang trí thương hiệu, không ảnh hưởng chức năng cốt lõi.

**Independent Test**: Kiểm tra ảnh nền hiển thị đúng, không bị vỡ, alt text đúng.

**Acceptance Scenarios**:

1. **Given** trang load, **When** nhìn vào top, **Then** hero banner 547px hiển thị đầy đủ với ảnh nền cover, gradient overlay từ đen ở dưới.
2. **Given** hero banner, **When** resize màn hình, **Then** ảnh luôn cover và crop trung tâm.
3. **Given** accessibility check, **When** đọc alt text, **Then** thấy `alt="Keyvisual Sun* Annual Award 2025"`.

---

### Edge Cases

- Nếu dữ liệu giải thưởng không tải được từ API, hiển thị skeleton loader hoặc thông báo lỗi thân thiện.
- Trên màn hình nhỏ (< 768px), nav menu chuyển từ sidebar sang tab-bar hoặc dropdown ngang.
- Khi scroll vượt qua tất cả award cards xuống Sun* Kudos section, nav menu giữ nguyên **"MVP" là active** (last active item, không deactivate).
- Nội dung tĩnh — nếu không có API, dữ liệu có thể được hardcode hoặc lấy từ CMS.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| Header | `313:8440` | Fixed navigation bar, logo + nav links + profile | - (shared component) |
| Keyvisual / Hero | `313:8437` | Full-width 547px hero image + gradient | None (decorative) |
| Title Section | `313:8453` | Subtitle + divider + main page title | Static |
| Navigation Menu | `313:8459` | Left sidebar with 6 award category links | Click → scroll to section, hover highlight |
| Nav Item (Active) | `313:8460` | "Top Talent" with gold bottom border | Active state |
| Nav Item (Default) | `313:8461` | Other items with hover state | Click, hover |
| Award Cards List | `313:8466` | Container for all 6 award cards | Scroll target |
| Award Card D.1 | `313:8467` | Top Talent card (image + content block) | Static display |
| Award Card D.2 | `313:8468` | Top Project card | Static display |
| Award Card D.3 | `313:8469` | Top Project Leader card | Static display |
| Award Card D.4 | `313:8470` | Best Manager card | Static display |
| Award Card D.5 | `313:8471` | Signature 2025 – Creator card | Static display |
| Award Card D.6 | `313:8510` | MVP card | Static display |
| Award Image | `I313:8467;214:2525` | 336x336px image with gold glow | Decorative |
| Award Content | `I313:8467;214:2526` | Title + description + metadata | Read-only |
| Sun* Kudos Block | `335:12023` | Dark card (#0F0F0F, border-radius:16px, 1152x500px). Left: label "Phong trào ghi nhận" + title "Sun* Kudos" (57px gold) + description + gold CTA button. Right: decorative image frame (272x219px). | Click "Chi tiết" → navigate |
| "Chi tiết" Button | `I335:12023;313:8426` | **Solid gold button** (bg:#FFEA9E, text:#00101A), 127x56px, with icon. NOT an outline button. | Click → Sun* Kudos page |
| Footer | `354:4323` | Page footer with links | - (shared component) |

### Navigation Flow

- **From**: Homepage SAA (`2167:9026`) → click "Hệ thống giải" CTA → `/awards`
- **On page**: Left nav items → smooth scroll to award section (scroll spy, anchor links)
- **To**: Sun* Kudos Live board (`2940:13431`, `/kudo/live`) → via "Chi tiết" button, **same tab** (`<Link href="/kudo/live">`)
- **Back**: Browser back / Header nav links

### Visual Requirements

See [design-style.md](./design-style.md) for full visual specifications.

- **Color scheme**: Dark background `#00101A`, gold accent `#FFEA9E`, white text `#FFFFFF`
- **Typography**: Montserrat font family, 700 weight dominant
- **Award card style**: Glassmorphism (backdrop-blur:32px + border-radius:16px)
- **Image effect**: mix-blend-mode:screen + golden glow box-shadow
- **Responsive breakpoints**: 360px (mobile), 768px (tablet), 1440px (desktop)
- **Accessibility**: WCAG 2.1 AA — white text on `#00101A` has contrast > 7:1

### Layout Specifications

- Page width: 1440px (design), 100% responsive
- Content container: max-width 1152px, centered, px:144px
- Award section: flex-row, nav:178px + gap:80px + cards:853px
- See ASCII layout diagram in [design-style.md](./design-style.md)

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display hero banner (Keyvisual) with correct image, gradient overlay and accessibility alt text.
- **FR-002**: System MUST render section title "Hệ thống giải thưởng SAA 2025" in gold color (#FFEA9E) with subtitle above.
- **FR-003**: System MUST display left navigation menu with all 6 award category names.
- **FR-004**: Users MUST be able to click any nav item to smooth-scroll to the corresponding award card.
- **FR-005**: System MUST highlight the active nav item with `border-bottom: 1px solid #FFEA9E` when its section is in viewport (scroll spy).
- **FR-006**: System MUST render all 6 award cards, each containing: award image (336x336), title, description, quantity (with unit), and prize value (in VNĐ).
- **FR-007**: System MUST display the Sun* Kudos promotional block at the bottom with a "Chi tiết" button.
- **FR-008**: Users MUST be able to click "Chi tiết" to navigate **same tab** to the Sun* Kudos Live board page (`/kudo/live`). Implemented as `<Link href="/kudo/live">`, NOT `target="_blank"`.
- **FR-009**: System MUST be accessible to authenticated users only (redirect unauthenticated to `/login`).
- **FR-010**: Left navigation menu MUST be **sticky** (`position: sticky; top: [header-height]`) so it remains visible while user scrolls through the long award cards list.
- **FR-011**: Each award card section MUST have an `id` attribute matching the nav item slug (e.g., `id="top-talent"`) to serve as scroll anchor targets.

### Technical Requirements

- **TR-001**: Page MUST use Next.js App Router with React Server Components (RSC) by default for static content rendering.
- **TR-002**: Client-side scroll spy (nav active state) requires a `"use client"` component wrapper for the navigation menu only.
- **TR-003**: Award data MAY be fetched from `GET /api/awards` server-side or hardcoded as static data if no CMS is available.
- **TR-004**: Smooth scrolling MUST use native CSS `scroll-behavior: smooth` or Intersection Observer API.
- **TR-005**: Images MUST use Next.js `<Image>` component with proper `alt` text and `sizes` prop.
- **TR-006**: Font (Montserrat) MUST be loaded via Next.js `next/font/google` for performance.
- **TR-007**: Page MUST be responsive: verified at 360px, 768px, 1440px.
- **TR-008**: Route: `/awards` under `app/(protected)/` layout to enforce auth middleware.

### State Management

| State | Type | Scope | Default | Notes |
|-------|------|-------|---------|-------|
| `activeNavItem` | `string` | Local (`"use client"` nav component) | `'top-talent'` | ID of currently active award section |
| Award data | Static constant or server fetch | Server (RSC) | hardcoded array | 6 `AwardCategory` objects, ordered |
| Loading state (images) | Browser native | Per `<Image>` | loading="lazy" | Below-fold images lazy-loaded |
| Error state (data) | Local | Page level | `null` | Show friendly error if API fetch fails |

**No global state required** — all state is local to the nav scroll spy component.

### Accessibility Requirements

- **Nav landmark**: `<nav aria-label="Danh mục giải thưởng">` wrapping the left navigation menu.
- **Active nav item**: `aria-current="true"` on the currently active `<a>` or `<button>` in the nav.
- **Award section anchors**: Each award card wrapped in `<section id="{slug}" aria-labelledby="{slug}-title">`.
- **Award card heading**: `<h2 id="{slug}-title">` for the award title (e.g., "Top Talent").
- **Award image alt text**: Descriptive alt e.g., `alt="Hình ảnh giải thưởng Top Talent"`.
- **Keyvisual alt**: `alt="Keyvisual Sun* Annual Award 2025"`.
- **"Chi tiết" button**: `aria-label="Xem Sun* Kudos Live board"` to clarify destination (navigates to `/kudo/live`).
- **Keyboard navigation**: All nav items reachable via `Tab`; activate with `Enter`/`Space`.
- **Focus ring**: Never `outline: none` without a visible replacement on interactive elements.
- **Color contrast**: Gold `#FFEA9E` on dark `#00101A` — ratio ~8.5:1 ✅ WCAG AA. Dark `#00101A` on gold `#FFEA9E` (button) — ratio ~8.5:1 ✅ WCAG AA.

### Key Entities *(if feature involves data)*

- **AwardCategory**: id, name (vi/en), description, imageUrl, quantity, quantityUnit (Cá nhân/Tập thể/Đơn vị), prizeValue (VNĐ), order
- **SunKudosPromo**: title, label, description, ctaUrl, imageUrl (static content)

---

## Award Data Summary

| ID | Award Name | Quantity | Unit | Prize Value |
|----|------------|----------|------|-------------|
| D.1 | Top Talent | 10 | Đơn vị | 7.000.000 VNĐ/giải |
| D.2 | Top Project | 02 | Tập thể | 15.000.000 VNĐ/giải |
| D.3 | Top Project Leader | 03 | Cá nhân | 7.000.000 VNĐ/giải |
| D.4 | Best Manager | 01 | Cá nhân | 10.000.000 VNĐ/giải |
| D.5 | Signature 2025 – Creator | 01 | Cá nhân / Tập thể | 5.000.000 / 8.000.000 VNĐ |
| D.6 | MVP (Most Valuable Person) | 01 | - | 15.000.000 VNĐ |

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/awards` | GET | Load award categories and data | Predicted (new) |
| `/api/awards/system` | GET | Alternative: get award system info | Predicted (new) |

> **Note**: Award data is static for SAA 2025. Can be seeded into Supabase or hardcoded as constants. If static, no API call needed.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 6 award cards render with correct data (name, description, quantity, value) matching Figma spec.
- **SC-002**: Left nav scroll spy correctly highlights active item on scroll with < 100ms visual response.
- **SC-003**: "Chi tiết" button successfully navigates same tab to `/kudo/live` (Sun* Kudos Live board).
- **SC-004**: Page loads within 2 seconds on desktop (LCP < 2s), images lazy-loaded below fold.
- **SC-005**: WCAG 2.1 AA color contrast compliance on all text elements.
- **SC-006**: Page renders correctly at 360px, 768px, 1440px breakpoints without horizontal scroll.

---

## Out of Scope

- Voting or nomination functionality on this page.
- Editing award data (admin CMS is separate).
- Search or filter awards.
- Sharing individual award cards.
- Animation beyond smooth scroll and simple hover transitions.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`) — predicted endpoints documented above
- [ ] Database design completed (`.momorph/database.sql`) — AwardCategory table needed
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)
- [x] Design style documented (`design-style.md`)

---

## Notes

- **All award content is static** for SAA 2025 — data does not change during the event. Consider using Next.js static generation (`generateStaticParams` / `export const revalidate`) for best performance.
- The `Header` and `Footer` components are shared with other pages (Homepage SAA, Login) — reuse existing implementations.
- The scroll spy behavior needs `IntersectionObserver` API — implement as a `"use client"` hook (e.g., `useScrollSpy`) to avoid hydration issues with RSC.
- Nav items C.1–C.6 and award cards D.1–D.6 are 1:1 mapped — maintain consistent ordering in both DOM and data array.
- `Signature 2025` nav item (C.5) maps to full name "Signature 2025 – Creator" in the content card.
- The Keyvisual image path must be confirmed with design team for production asset.
