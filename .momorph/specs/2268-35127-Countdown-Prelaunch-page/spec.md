# Feature Specification: Countdown - Prelaunch Page

**Frame ID**: `2268:35127`
**Frame Name**: `Countdown - Prelaunch page`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/2268:35127
**Route**: `/countdown`
**Created**: 2026-03-12
**Status**: Draft

---

## Overview

The Countdown - Prelaunch page is a full-screen landing page displayed to users before the SAA 2025 event officially begins. It features a prominent countdown timer (Days, Hours, Minutes) over a dark, artistic background image with a gradient overlay. The page communicates that the event has not yet started and builds anticipation with a real-time countdown.

This screen is publicly accessible (no authentication required) and serves as the entry point before the event goes live. Once the countdown reaches zero, users should be redirected to the Login page.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View countdown timer (Priority: P1)

A visitor lands on the pre-launch page and sees a real-time countdown showing the remaining days, hours, and minutes until the SAA 2025 event begins.

**Why this priority**: This is the core and only function of the page. Without the countdown, the page has no purpose.

**Independent Test**: Navigate to `/countdown` and verify the countdown timer displays and updates in real-time.

**Acceptance Scenarios**:

1. **Given** the event start time is configured and in the future, **When** a user visits `/countdown`, **Then** they see the heading "Sự kiện sẽ bắt đầu sau" and a countdown timer displaying DD:HH:MM values that update every second.
2. **Given** the countdown timer is displaying, **When** one minute passes, **Then** the MINUTES value decreases by 1 (or rolls over from 00 to 59 and HOURS decreases by 1).
3. **Given** the event start time is in the future, **When** the page loads, **Then** the DAYS value shows a two-digit number (00-99), HOURS shows 00-23, and MINUTES shows 00-59.

---

### User Story 2 - Redirect when countdown reaches zero (Priority: P1)

When the countdown reaches zero (event has started), the user is automatically redirected to the Login page so they can authenticate and access the main application.

**Why this priority**: Without this redirect, users would be stuck on a page showing 00:00:00 with no way to proceed.

**Independent Test**: Set the event start time to the past and verify the page redirects to `/login`.

**Acceptance Scenarios**:

1. **Given** the event start time has passed, **When** a user visits `/countdown`, **Then** they are immediately redirected to `/login`.
2. **Given** a user is viewing the countdown page, **When** the timer reaches 00 DAYS / 00 HOURS / 00 MINUTES, **Then** the page automatically redirects to `/login` within a few seconds.

---

### User Story 3 - Display artistic background (Priority: P2)

The page displays a visually appealing dark background with an artistic image and gradient overlay, matching the SAA 2025 event branding.

**Why this priority**: The visual design sets the tone for the event but is secondary to the functional countdown.

**Independent Test**: Navigate to `/countdown` and verify the background image and gradient overlay render correctly.

**Acceptance Scenarios**:

1. **Given** a user visits `/countdown`, **When** the page loads, **Then** the background displays a dark artistic image with a gradient overlay from dark (#00101A) at the bottom to transparent at the top.
2. **Given** the page is loaded, **When** the user views on different screen sizes, **Then** the background image covers the full viewport and the countdown remains centered.

---

### Edge Cases

- **Event start time not configured**: System MUST redirect to `/login` immediately (treat as "event already started"). Log a warning server-side.
- **Client clock drift**: Countdown MUST compute remaining time as `event_start_time - server_time` from API response, then tick locally. The initial delta is server-authoritative; client `setInterval` handles subsequent ticks.
- **Very small screens (360px)**: Countdown digits MUST scale down proportionally (see responsive specs in `design-style.md`). All three time units MUST remain visible without horizontal scrolling.
- **Background image fails to load**: The dark background color (#00101A) MUST display as fallback. The `<Image>` component MUST NOT break the layout on error.
- **Network failure on API call**: Display 00:00:00 with a "Loading..." or retry message. Retry the `/api/countdown` request up to 3 times with exponential backoff.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Background Image | Full-screen artistic image with colorful abstract waves | None (decorative) |
| Gradient Overlay | Dark-to-transparent gradient over the background | None (decorative) |
| Heading Text | "Sự kiện sẽ bắt đầu sau" (Event will start in) | None (static text) |
| Countdown Timer - Days | Two LED-style digit cards showing days remaining + "DAYS" label | Auto-updates |
| Countdown Timer - Hours | Two LED-style digit cards showing hours remaining + "HOURS" label | Auto-updates |
| Countdown Timer - Minutes | Two LED-style digit cards showing minutes remaining + "MINUTES" label | Auto-updates |

### Navigation Flow

- From: Direct URL access or external link
- To: `/login` (when countdown reaches zero or event has started)
- Triggers: Countdown timer reaching zero, or server-side redirect if event already started

### Visual Requirements

- Responsive breakpoints: 360px (mobile), 768px (tablet), 1440px (desktop) — per constitution QA checkpoints
- Animations/Transitions: Digit flip/fade animation on countdown tick (recommended for polish)
- See `design-style.md` for detailed visual specifications

### Accessibility Requirements

- **Semantic HTML**: Use `<main>` landmark for content area, `<h1>` for heading, `<time>` element for countdown values
- **Screen reader**: Countdown container MUST have `role="timer"` and `aria-live="polite"` with `aria-atomic="true"`. Update the aria-live region only when **minutes** change (not every second), to avoid spamming screen readers
- **Visually hidden label**: Include a `sr-only` text like "Countdown: 0 days, 5 hours, 20 minutes remaining" that updates only on minute transitions
- **Reduced motion**: Respect `prefers-reduced-motion` — disable digit flip animations when enabled
- **Color contrast**: White text (#FFFFFF) on dark background (#00101A) provides >15:1 ratio (exceeds WCAG AA)
- **Background image**: MUST have `alt=""` (decorative) and `aria-hidden="true"`

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a countdown timer showing days, hours, and minutes until the configured event start time.
- **FR-002**: System MUST update the countdown every second using a client-side interval (`setInterval`). Although the design shows only Days/Hours/Minutes, second-level ticking ensures the minute transition is perceived as real-time.
- **FR-003**: System MUST fetch the event start time from the server (not hardcoded) to ensure consistency across clients.
- **FR-004**: System MUST redirect users to `/login` when the countdown reaches zero or the event start time has already passed.
- **FR-005**: System MUST display each time unit (days, hours, minutes) as two separate digit cards with LED-style font.
- **FR-006**: System MUST show a full-viewport background image with gradient overlay.
- **FR-007**: Each digit MUST be displayed in its own glassmorphism card with border and backdrop blur.

### Technical Requirements

- **TR-001**: Page MUST load within 3 seconds on a 3G connection (consider lazy-loading the background image).
- **TR-002**: Countdown computation MUST be based on server-provided target timestamp to avoid client clock drift issues.
- **TR-003**: Page MUST be a Server Component by default; countdown timer logic requires `"use client"` for the timer interval.
- **TR-004**: Background image MUST use Next.js `<Image>` component for optimization.

### Key Entities *(if feature involves data)*

- **Event Configuration**: Contains `event_start_time` (timestamp), used to compute countdown values.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/countdown` | GET | Returns event start timestamp and server current time | New |

**Predicted Response**:
```json
{
  "event_start_time": "2026-04-01T09:00:00+07:00",
  "server_time": "2026-03-12T10:30:00+07:00"
}
```

---

## State Management

### Server State
- **Event start time**: Fetched once from `/api/countdown` on page load via Server Component or `useEffect` on mount. Cached for the duration of the session (no re-fetch needed).

### Client State (in `CountdownTimer` component — `"use client"`)
- `timeRemaining: { days: number, hours: number, minutes: number }` — computed from `event_start_time - now`, updated every second via `setInterval`
- `isExpired: boolean` — `true` when remaining time <= 0, triggers redirect to `/login`
- `isLoading: boolean` — `true` until the first API response is received
- `hasError: boolean` — `true` if the API call fails after retries

### Loading State
- While `isLoading === true`: Show the page layout with the background and heading, but display `--:--:--` or skeleton placeholders in the digit cards
- On error: Display `00:00:00` with a subtle "Unable to load countdown" message

### No Global State Needed
- This page has no shared state with other pages. No global store or context required.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Countdown timer displays correct remaining time (within 1-minute accuracy of server time).
- **SC-002**: Page redirects to `/login` within 5 seconds of the countdown reaching zero.
- **SC-003**: Page renders correctly at all three breakpoints (360px, 768px, 1440px).
- **SC-004**: Background image and gradient overlay display correctly on all supported browsers.

---

## Out of Scope

- Seconds display in countdown (design only shows Days/Hours/Minutes)
- Event description or teaser content on the pre-launch page
- User registration or email signup for event notifications
- Admin UI for configuring the event start time (managed via database/env)

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`)
- [ ] Database design completed (`.momorph/database.sql`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)

---

## Notes

- The Vietnamese heading text "Sự kiện sẽ bắt đầu sau" translates to "The event will start in". Text MUST include proper Vietnamese diacritics.
- The countdown digit font is "Digital Numbers" — a monospaced LED-style font that needs to be loaded as a custom font.
- The digit cards use glassmorphism effect (semi-transparent background with backdrop blur and gold border).
- The page has no header/navbar — it's a standalone splash screen.
- Consider adding a subtle animation for digit transitions to enhance the countdown experience.
