# Feature Specification: Sun* Kudos - Live Board

**Frame ID**: `2940:13431`
**Frame Name**: `Sun* Kudos - Live board`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-13
**Status**: Reviewed

---

## Overview

The **Sun* Kudos - Live Board** is the main page of the Sun* Annual Awards 2025 Kudos recognition system. It allows Sun* employees ("Sunners") to send, browse, and interact with "kudos" — public messages of appreciation and recognition. The page features a hero banner, highlighted top kudos in a carousel, an interactive spotlight word cloud, a chronological feed of all kudos, and a personal stats sidebar with secret box rewards.

**Target Users**: All Sun* employees (Sunners) participating in the SAA 2025 event.

**Business Context**: Part of the Sun* Annual Awards 2025 initiative to foster a culture of recognition and gratitude within the organization.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse All Kudos Feed (Priority: P1)

A Sunner visits the Kudos Live Board to browse the feed of all kudos messages posted by colleagues. They can scroll through cards showing sender, receiver, message content, images, hashtags, and engagement (hearts).

**Why this priority**: The All Kudos feed is the core content of the page. Without it, there is no live board. This is the MVP.

**Independent Test**: Load the page and verify that kudos cards render with correct sender/receiver info, timestamps, content, images, hashtags, and heart counts.

**Acceptance Scenarios**:

1. **Given** the user is on the Kudos Live Board, **When** the page loads, **Then** a scrollable list of Kudos post cards is displayed with sender info, receiver info, timestamp, message content, image gallery, hashtags, and heart count.
2. **Given** a kudos message exceeds 5 lines, **When** it renders in the All Kudos feed, **Then** it is truncated with "..." after 5 lines.
3. **Given** a kudos has more than 5 attached images, **When** displayed, **Then** only 5 thumbnail images are shown in a horizontal row.
4. **Given** a kudos has more than 5 hashtags, **When** displayed, **Then** only hashtags fitting 1 line are shown, remainder truncated with "...".

---

### User Story 2 - Like/Unlike a Kudos (Priority: P1)

A Sunner can tap the heart icon on any kudos card to "like" it, incrementing the heart count. Tapping again unlikes it. Liking a kudos awards "tim" (heart points) to the **kudos sender's** account — this is the core gamification currency.

**Why this priority**: Engagement is a core feature. Likes drive the highlight rankings, award tim points, and make the board interactive.

**Independent Test**: Click the heart button on a kudos card and verify the count changes, icon color toggles, and the sender's tim balance updates.

**Acceptance Scenarios**:

1. **Given** the user has not liked a kudos, **When** they click the heart icon, **Then** the icon turns red (#D4271D), the kudos heart count increments by 1, and the **kudos sender's** account receives +1 tim point.
2. **Given** the user has already liked a kudos, **When** they click the heart icon again, **Then** the icon turns gray, the kudos heart count decrements by 1, and the tim point awarded to the sender is revoked.
3. **Given** any kudos, **When** checking like rules, **Then** each user can only give one like per kudos. The sender of a kudos MUST NOT be able to like their own kudos — the heart button MUST be visually disabled (grayed out, cursor: not-allowed) for the sender.
4. **Given** a heart is placed during a **special day** (admin-configured), **When** the like is persisted, **Then** the kudos sender's account receives **+2 tim points** instead of +1.
5. **Given** a heart was placed during a special day, **When** the user unlikes it, **Then** **2 tim points** are revoked from the sender's account (not 1).
6. **Given** rapid clicks on the heart button, **When** debounce is applied, **Then** only a single API call is made within the debounce window and the UI updates optimistically.

---

### User Story 3 - View Highlight Kudos Carousel (Priority: P1)

The top section showcases the 5 most-liked kudos in a **center-focus carousel**: the active card is displayed prominently at the center while adjacent cards appear dimmed/faded on either side. Navigation arrows and a "2/5" pagination indicator control the carousel.

**Why this priority**: Highlighting top kudos is a key engagement driver and visual anchor of the page.

**Independent Test**: Verify carousel renders 5 cards with center-focus effect, arrow navigation works, and pagination indicator updates.

**Acceptance Scenarios**:

1. **Given** the page loads, **When** the Highlight Kudos section renders, **Then** a carousel of the top 5 most-liked kudos is displayed with the current card highlighted at center and adjacent cards dimmed.
2. **Given** the user is on slide 1 of 5, **When** they click the forward arrow, **Then** the carousel transitions to the next card (300ms ease-in-out) and the pagination updates (e.g., "2/5").
3. **Given** the user is on slide 1, **When** viewing the previous arrow, **Then** it is disabled (not clickable, opacity: 0.3, cursor: not-allowed).
4. **Given** the user is on slide 5, **When** viewing the forward arrow, **Then** it is disabled.
5. **Given** the highlight card content exceeds 3 lines, **When** displayed, **Then** it is truncated with "...".
6. **Given** the user clicks "Xem chi tiết" on a highlight card, **When** navigation triggers, **Then** the user is taken to the kudos detail page for that specific kudos.
7. **Given** the user clicks on the card body itself, **When** the click event fires, **Then** the kudos detail page opens (same as "Xem chi tiết").
8. **Given** there are no highlight kudos available, **When** the section renders, **Then** a text "Hiện tại chưa có Kudos nào." is displayed instead of the carousel.

---

### User Story 4 - Filter Kudos by Hashtag and Department (Priority: P2)

Users can filter the Highlight Kudos and All Kudos views using Hashtag and Department (Phong ban) dropdown filters.

**Why this priority**: Filtering enables targeted browsing and is important for large events, but the page is functional without it.

**Independent Test**: Open the Hashtag dropdown, select a tag, and verify both Highlight and All Kudos sections update to show only matching kudos.

**Acceptance Scenarios**:

1. **Given** the user clicks the "Hashtag" dropdown, **When** the dropdown opens, **Then** a list of hashtags (queried from DB) is displayed.
2. **Given** the user selects a hashtag, **When** the filter is applied, **Then** both Highlight Kudos carousel and All Kudos feed update to show only kudos with that hashtag.
3. **Given** the user clicks a hashtag within a kudos card, **When** it's clicked, **Then** the Hashtag filter is set to that tag and both views update accordingly.
4. **Given** the user clicks the "Phòng ban" dropdown, **When** the dropdown opens, **Then** a list of departments (queried from DB) is displayed.
5. **Given** the user selects a department, **When** the filter is applied, **Then** both views update to show only kudos involving that department.
6. **Given** a filter is applied, **When** the carousel updates, **Then** the pagination resets to "1/N" (slide 1) and the feed scrolls to top.
7. **Given** a filter is active, **When** the user clicks the active filter again (or clicks a "clear" action), **Then** the filter is removed, both views return to unfiltered state, and the carousel resets to slide 1.

---

### User Story 5 - Send a Kudos (Priority: P2)

A Sunner clicks the search/input bar in the hero section to open a dialog where they can compose and send a kudos message to a colleague.

**Why this priority**: Sending kudos is essential to the platform, but the dialog is a separate frame/feature. This story covers the trigger.

**Independent Test**: Click the input bar and verify the kudos dialog opens.

**Acceptance Scenarios**:

1. **Given** the user is on the Kudos Live Board, **When** they click the input bar with placeholder "Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?", **Then** a dialog/modal for composing a kudos message opens.
2. **Given** the dialog is open, **When** the user submits a valid kudos, **Then** it is saved to the database and appears in the All Kudos feed.

---

### User Story 6 - View Personal Stats and Open Secret Box (Priority: P2)

The sidebar shows the user's personal kudos statistics (kudos received, sent, hearts received, secret boxes opened/unopened) and a button to open a secret box reward.

**Why this priority**: Gamification element that drives engagement. Functional without it but significantly enhances UX.

**Independent Test**: Load the page and verify sidebar stats are populated for the logged-in user. Click "Mở Secret Box" and verify dialog opens.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** the sidebar renders, **Then** it displays 6 stat rows: Số Kudos bạn nhận được, Số Kudos bạn đã gửi, Số tim bạn nhận được (hearts received), ──separator──, Số Secret Box bạn đã mở, Số Secret Box chưa mở — all with correct values from the API.
2. **Given** the user has unopened secret boxes, **When** they click "Mở Secret Box 🎁", **Then** a dialog opens to reveal their reward.
3. **Given** the user has 0 unopened secret boxes, **When** viewing the button, **Then** the button is disabled or hidden.

---

### User Story 7 - Explore Spotlight Board (Priority: P2)

An interactive word cloud / diagram shows all kudos recipients' names. Larger names indicate more kudos received. Users can search, pan, and zoom.

**Why this priority**: Visually engaging feature that adds "wow factor" but the page works without it.

**Independent Test**: Verify the spotlight canvas renders names, search filters names, and pan/zoom controls work.

**Acceptance Scenarios**:

1. **Given** the page loads, **When** the Spotlight Board renders, **Then** a word cloud of recipient names is displayed with "{N} KUDOS" (total count from DB) as header.
2. **Given** the spotlight is visible, **When** the user hovers over a name node, **Then** a tooltip displays the person's name and the time they received kudos.
3. **Given** the spotlight is visible, **When** the user clicks on a name node, **Then** they are navigated to the kudos detail page for that person's kudos.
4. **Given** the search input (max 100 characters, optional), **When** the user types a name, **Then** the matching name is highlighted/focused in the word cloud.
5. **Given** the pan/zoom toggle, **When** clicked, **Then** the user can switch between pan mode and zoom mode on the canvas. Hover on the toggle shows tooltip "Pan/Zoom".
6. **Given** the spotlight data is loading, **When** the API call is in progress, **Then** a loading state is displayed. If there is no data, an empty state is shown.

---

### User Story 8 - Copy Kudos Link (Priority: P3)

Users can copy the direct link to any kudos post to share it.

**Why this priority**: Nice-to-have sharing feature.

**Independent Test**: Click "Copy Link" on a kudos card and verify the URL is in the clipboard and a toast appears.

**Acceptance Scenarios**:

1. **Given** any kudos card, **When** the user clicks "Copy Link", **Then** the kudos URL is copied to clipboard and a toast notification "Link copied — ready to share!" appears.

---

### User Story 9 - Navigate to User Profiles (Priority: P3)

Clicking on a sender/receiver name or avatar navigates to their profile page. Hovering shows a profile preview.

**Why this priority**: Enhances discoverability but is supplementary to core functionality.

**Independent Test**: Click a user name and verify navigation. Hover and verify preview popover.

**Acceptance Scenarios**:

1. **Given** a kudos card with sender/receiver info, **When** the user clicks a name or avatar, **Then** they are navigated to that person's profile page.
2. **Given** a kudos card, **When** the user hovers over a name or avatar, **Then** a profile preview popover is displayed.

---

### User Story 10 - View Top 10 Sunners Who Received Gifts (Priority: P3)

The sidebar shows a list of the 10 most recent Sunners who received gifts/rewards.

**Why this priority**: Social proof element, supplementary.

**Independent Test**: Verify the list renders with avatars, names, and gift descriptions.

**Acceptance Scenarios**:

1. **Given** the sidebar is visible, **When** the "10 SUNNER NHẬN QUÀ MỚI NHẤT" section loads, **Then** a vertical list of 10 items is displayed, each with a circle avatar, name, and gift description.
2. **Given** a list item, **When** the user clicks on a name/avatar, **Then** they navigate to that person's profile.

---

### Edge Cases

- What happens when there are fewer than 5 highlight kudos? → Carousel adapts to show available cards, pagination adjusts (e.g., "1/3").
- What happens when the kudos feed is empty? → Display text "Hiện tại chưa có Kudos nào." (from Figma spec).
- What happens when the user is not logged in? → Page is **protected** — middleware redirects unauthenticated users to the login page. The "not logged in" state never occurs on this page.
- What happens when an image fails to load? → Show placeholder/broken image icon.
- What happens when the Spotlight Board has too many names? → Names scale down; pan/zoom allows exploration.
- What happens when the Spotlight Board has no data? → Display empty state (loading → empty transition per Figma B.7 spec).
- What happens on slow connections? → Skeleton loaders for cards, lazy-load images.
- What happens when the sidebar lists are empty? → Display text "Chưa có dữ liệu" (from Figma D spec).
- What happens when a user hearts a kudos on a special day and the admin later removes the special day config? → The heart record retains its "special day" flag for correct reversal (2 tim instead of 1).

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Header Navigation | Fixed top bar with logo, nav links, language, notifications, avatar | Click nav items to navigate |
| Hero Banner (KV Kudos) | Full-width background image with title and search | Click search to open dialog |
| Search Input | Pill-shaped input with placeholder | Click to open kudos compose dialog |
| Profile Search | Search button for finding Sunner profiles | Click to search (**UI-only**: render the button but no logic implementation at this time) |
| Highlight Kudos | Carousel of top 5 most-liked kudos | Arrow nav, pagination |
| Hashtag Filter | Dropdown to filter by hashtag | Click to open, select to filter |
| Department Filter | Dropdown to filter by department | Click to open, select to filter |
| Spotlight Board | Interactive word cloud of recipients | Hover, search, pan/zoom |
| All Kudos Feed | Scrollable list of kudos post cards | Scroll, interact with cards |
| Kudos Post Card | Card with sender/receiver/content/images/tags/actions | Like, copy link, click profile |
| Sidebar Stats | Personal statistics panel | View stats, open secret box |
| Secret Box Button | CTA to open reward | Click to open dialog |
| Top 10 Sunner List | Recent gift recipients | Click to navigate to profile |
| Footer | Navigation links and copyright | Click nav links |

### Navigation Flow

- **Entry points**: Homepage → Header nav "Sun* Kudos" | Hệ thống giải → "Chi tiết Sun* Kudos" CTA
- **Exit points**:
  - → User Profile page (click name/avatar on any card or sidebar)
  - → Kudos Detail page (click card body, click "Xem chi tiết" on highlight cards, click spotlight node)
  - → Send Kudos Dialog / Viết Kudo (click search input A.1)
  - → Secret Box Dialog (click "Mở Secret Box" D.1.8)
  - → Dropdown list hashtag overlay (click Hashtag filter B.1.1)
  - → Dropdown Phòng ban overlay (click Department filter B.1.2)
  - → Dropdown-ngôn ngữ (Header language selector)
  - → Dropdown-profile (Header profile avatar)
  - → Homepage SAA / Hệ thống giải (Header nav links)
- **Triggers**: Click navigation links, click interactive elements, hover for profile preview popover

### Visual Requirements

- **Design Style**: See [design-style.md](./design-style.md) for complete visual specs
- Responsive breakpoints: 360px (mobile), 768px (tablet), 1440px (desktop)
- Animations: Carousel slide transitions (300ms), heart toggle (200ms), toast notifications (200ms)
- Accessibility: WCAG 2.1 AA compliance, keyboard navigation for carousel and filters, focus rings on interactive elements
- ARIA requirements:
  - Carousel: `role="region"`, `aria-roledescription="carousel"`, `aria-label="Highlight Kudos"`, each slide has `role="group"` with `aria-roledescription="slide"` and `aria-label="Slide N of M"`
  - Filter dropdowns: `role="listbox"` with `aria-expanded`, `aria-activedescendant`, options have `role="option"` and `aria-selected`
  - Heart button: `aria-pressed` (true/false), `aria-label="Like kudos"` or `"Unlike kudos"`
  - Spotlight Board: `aria-label="Spotlight Board — interactive word cloud of kudos recipients"`
  - Toast notifications: `role="status"`, `aria-live="polite"`

---

## Business Rules

### BR-001: Star Count (Hoa Thị) Display Logic

Each Sunner displays a star count (hoa thị) next to their name. The star count is calculated from the total number of kudos **received**:

| Stars | Threshold | Tooltip Description |
|-------|-----------|---------------------|
| 1 ★ | 10 Kudos received | "Sunner đã nhận được 10 Kudos và bắt đầu lan tỏa năng lượng ấm áp đến mọi người xung quanh." |
| 2 ★★ | 20 Kudos received | "Sunner đã nhận được 20 Kudos và chứng minh sức ảnh hưởng của mình qua những hành động lan tỏa tích cực mỗi ngày." |
| 3 ★★★ | 50 Kudos received | "Sunner đã nhận được 50 Kudos và trở thành hình mẫu của sự công nhận, sẻ chia và lan tỏa tinh thần Sun*." |
| 0 | < 10 Kudos | No stars displayed |

- Hovering over the star count MUST display the corresponding tooltip description.
- Star count appears on: Highlight cards (B.3.2, B.3.6), All Kudos cards (C.3.1, C.3.3), Sidebar user entries.

### BR-002: Heart / Tim Point System

When a user hearts a kudos:
- The **kudos sender** receives **+1 tim point** on their account.
- On **special days** (admin-configured), the sender receives **+2 tim points** instead.
- When the heart is removed (unhearted), the exact number of tim points awarded (1 or 2) is revoked.
- Each heart record MUST store whether it was placed on a special day, so revocation is accurate.
- The sender of a kudos CANNOT heart their own kudos (button disabled).

### BR-003: Timestamp Format

All timestamps display in the format: `HH:mm - MM/DD/YYYY` (e.g., "10:00 - 10/30/2025").

---

## State Management

### Local Component State

| State | Component | Type | Default |
|-------|-----------|------|---------|
| currentSlide | HighlightKudos carousel | number | 0 |
| isLiked | HeartButton (per kudos) | boolean | from API |
| heartCount | HeartButton (per kudos) | number | from API |
| isFilterOpen | Hashtag/Department dropdowns | boolean | false |
| selectedHashtag | Filter | string \| null | null |
| selectedDepartment | Filter | string \| null | null |
| spotlightMode | SpotlightBoard | 'pan' \| 'zoom' | 'pan' |
| spotlightSearch | SpotlightBoard search input | string | '' |
| toastMessage | Global toast | string \| null | null |

### Server/Global State (via Supabase)

| State | Source | Caching |
|-------|--------|---------|
| kudosList (All Kudos feed) | `GET /api/kudos` (paginated, infinite scroll) | Client-side state accumulation — `useState<Kudos[]>` appends pages fetched via `useInfiniteScroll` hook. No SWR/React Query. |
| highlightKudos | `GET /api/kudos/highlights` | Cache with filter params as key |
| spotlightData | `GET /api/spotlight` | Cache, infrequent updates |
| userStats (includes secret box counts) | `GET /api/users/me/stats` | Cache, revalidate on heart/send/open-box actions |
| topGiftSunners | `GET /api/sunners/top-gifts` | Cache, infrequent updates |

### Loading & Error States

| State | Behavior |
|-------|----------|
| Initial page load | Skeleton loaders for each section |
| Feed loading more (infinite scroll) | Spinner at bottom of feed |
| Heart toggle in progress | Optimistic UI update, revert on error |
| Filter change | Skeleton for affected sections, instant filter UI response |
| API error | Toast notification with retry option |
| Spotlight loading | Loading spinner inside canvas area |
| Empty feed | Text: "Hiện tại chưa có Kudos nào." |
| Empty sidebar list | Text: "Chưa có dữ liệu" |

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a paginated feed of all kudos, ordered by most recent.
- **FR-002**: System MUST display a carousel of the top 5 most-liked kudos ("Highlight Kudos").
- **FR-003**: Users MUST be able to like/unlike a kudos (one like per user per kudos, sender cannot like own — button disabled). Liking awards tim points to the kudos sender per BR-002.
- **FR-004**: Users MUST be able to filter kudos by hashtag and department, affecting both Highlight and All Kudos views.
- **FR-005**: System MUST display an interactive Spotlight Board showing kudos recipients as a word cloud with total count.
- **FR-006**: Users MUST be able to copy a direct link to any kudos post.
- **FR-007**: System MUST display personal stats (kudos received/sent, hearts received, secret boxes opened/unopened) in the sidebar for logged-in users.
- **FR-008**: Users MUST be able to open secret box rewards via the sidebar button.
- **FR-009**: System MUST display ONE sidebar list: "10 SUNNER NHẬN QUÀ MỚI NHẤT" (10 most recent gift recipients).
- **FR-010**: Clicking the search input in the hero MUST open a kudos compose dialog.
- **FR-011**: Clicking a user name/avatar MUST navigate to their profile page.
- **FR-012**: Hovering a user name/avatar MUST show a profile preview popover.
- **FR-013**: Kudos content MUST truncate at 3 lines (Highlight) / 5 lines (All Kudos) with "...".
- **FR-014**: Image gallery MUST show max 5 thumbnails per kudos; clicking opens full image.
- **FR-015**: Hashtags MUST truncate at 1 line with "..." in card view.
- **FR-016**: Star count (hoa thị) MUST display on all user info blocks per BR-001, with hover tooltip explaining the meaning.
- **FR-017**: Clicking on any kudos card body MUST navigate to the kudos detail page.
- **FR-018**: Sidebar MUST have independent scroll, separate from the main feed scroll.
- **FR-019**: When filters are applied, carousel pagination MUST reset to slide 1.
- **FR-020**: All Kudos feed MUST use infinite scroll for loading additional content.

### Technical Requirements

- **TR-001**: Page MUST load initial above-the-fold content (hero + highlight) within 2 seconds on desktop.
- **TR-002**: Carousel MUST support keyboard navigation (arrow keys) and be screen-reader accessible.
- **TR-003**: Heart toggle MUST be debounced to prevent rapid repeated API calls.
- **TR-004**: All Kudos feed MUST implement infinite scroll or pagination for large datasets.
- **TR-005**: Spotlight Board MUST render as canvas/SVG for performance with large name sets.
- **TR-006**: All API calls MUST use Supabase client per constitution (browser: client.ts, server: server.ts).
- **TR-007**: All user inputs (search, filters) MUST be validated with Zod.

### Key Entities *(if feature involves data)*

- **Kudos**: A message of appreciation — sender_id, receiver_id, content, hashtags[], images[], created_at, heart_count
- **Heart/Like**: A like on a kudos — user_id, kudos_id (unique constraint per user per kudos), is_special_day (boolean — whether the heart was placed during an admin-configured special day), created_at
- **Hashtag**: Tag associated with kudos — id, name
- **Department**: Organizational department — id, name
- **SecretBox**: Reward box — user_id, is_opened, reward_content, opened_at
- **User/Sunner**: Employee profile — id, name, avatar_url, department_id, kudos_received_count, tim_points (heart currency), title
- **SpecialDay**: Admin-configured special days — id, date, multiplier (default: 2)

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| /api/kudos | GET | Fetch paginated list of all kudos (with sender/receiver/hashtags/images). Query params: `page`, `limit`, `hashtag?`, `department?` | Predicted |
| /api/kudos/highlights | GET | Fetch top 5 most-liked kudos. Query params: `hashtag?`, `department?` | Predicted |
| /api/kudos/:id/like | POST | Like a kudos | Predicted |
| /api/kudos/:id/like | DELETE | Unlike a kudos | Predicted |
| /api/kudos | POST | Create a new kudos | Predicted |
| /api/hashtags | GET | Fetch all available hashtags | Predicted |
| /api/departments | GET | Fetch all departments | Predicted |
| /api/spotlight | GET | Fetch spotlight data (name cloud + total count) | Predicted |
| /api/users/me/stats | GET | Fetch current user's kudos/secret box statistics | Predicted |
| /api/users/me/secret-box | POST | Open a secret box | Predicted |
| /api/users/:id/profile-preview | GET | Fetch profile preview for hover popover | Predicted |
| /api/sunners/top-gifts | GET | Fetch 10 most recent gift recipients | Predicted |
| /api/special-days/today | GET | Check if today is a special day (for heart multiplier) | Predicted |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Page loads fully (hero + highlight + above-fold) within 2 seconds on 4G connection.
- **SC-002**: All interactive elements (like, filter, carousel, copy link) respond within 200ms.
- **SC-003**: 95%+ of Sunners can successfully browse and like kudos without confusion (usability test).
- **SC-004**: Spotlight Board renders smoothly (60fps) with up to 500 names.
- **SC-005**: All Kudos feed supports at least 1000 kudos entries without performance degradation.

---

## Out of Scope

- Kudos compose dialog (separate frame/spec — triggered from this page)
- Secret Box reveal dialog (separate frame/spec — triggered from this page)
- User profile page (separate page — linked from this page)
- Kudos detail page (separate frame — linked from "Xem chi tiet")
- Admin campaign management page (manages special days / multiplier config — separate admin feature)
- Profile search logic (the search button in the hero area is **UI-only** for now; render the button but do not implement search functionality)
- Notification system (bell icon links elsewhere)
- Real-time live updates (WebSocket/SSE for new kudos appearing)
- Video attachments in kudos (not supported — kudos support image-only galleries)

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`)
- [ ] Database design completed (`.momorph/database.sql`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)

---

## Notes

- The page is designed at 1440px width (desktop-first in design, but implementation MUST be mobile-first per constitution — see constitution §IV)
- The star count (hoa thị) display logic is fully documented in BR-001 above
- Hashtag click within a kudos card acts as a filter shortcut (updates both Highlight + All Kudos), not a navigation
- The Spotlight Board is the most technically complex component — may require a dedicated library (e.g., d3-cloud, react-wordcloud) and renders as canvas/SVG
- Kudos cards in Highlight (B.3) differ from All Kudos (C.3): Highlight shows 3-line truncation, no image gallery, has "Xem chi tiết" link; All Kudos shows 5-line truncation with image gallery, no "Xem chi tiết"
- The "IDOL GIOI TRE" label on kudos cards is a category/hashtag badge (D.4), displayed as a tag above the timestamp
- The sidebar contains ONE list: "10 SUNNER NHẬN QUÀ MỚI NHẤT" (most recent gift recipients) — see FR-009
- Profile search button in hero area is **UI-only** — render the button but do not implement search logic (separate feature, out of scope)
- Kudos only support image attachments, no video support
