# Feature Specification: Like Kudos

**Frame ID**: `256:5231` (KUDO feed card), `335:9620` (KUDO highlight), `520:18779` (View Kudo detail)
**Frame Name**: `KUDO` / `KUDO - Highlight` / `View Kudo`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-24
**Status**: Reviewed

> **Note**: "Like Kudos" is an interaction feature embedded across all Kudo card surfaces (feed, highlight carousel, detail modal). Visual references: `assets/frame-kudo-card.png`, `assets/frame-kudo-highlight.png`, `assets/frame-view-kudo.png`.

---

## Overview

The **Like Kudos** feature allows authenticated Sun* employees ("Sunners") to express appreciation for any kudo by clicking a heart (❤) icon on kudo cards. Liking a kudo:

1. **Toggles the heart icon** — grey (not liked) ↔ red (liked)
2. **Updates the heart count** — increments or decrements by 1 (displayed in Vietnamese format: `1.000`)
3. **Awards "tim" (heart points)** to the **kudo sender's** account — this is the core gamification currency in SAA 2025

The like button appears on three surfaces:
- **Feed card** (`256:5231`) — in the All Kudos section of the Live Board
- **Highlight card** (`335:9620`) — in the Highlight Kudos carousel
- **Detail view** (`520:18779`) — when a user opens a full kudo modal

**Target Users**: All authenticated Sun* employees (Sunners) viewing the Kudos Live Board.

**Business Context**: Likes drive the Highlight rankings (top 5 most-liked kudos), gamification (tim points), and engagement on the SAA 2025 Kudos board. A sender cannot like their own kudo. On special admin-configured days, likes award double tim points (+2 instead of +1).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Like a Kudos (Priority: P1)

A Sunner sees a kudo card from a colleague and clicks the grey heart icon to express appreciation. The heart turns red, the count increments by 1, and the kudo sender earns +1 tim point. The interaction is instant via optimistic UI.

**Why this priority**: This is the core feature. Without it, no engagement metric exists and tim points cannot be earned. It is the primary gamification action.

**Independent Test**: Click the heart button on a kudo card with a grey heart and verify the icon turns red, count increments by 1, and the API call is made.

**Acceptance Scenarios**:

1. **Given** the user is authenticated and viewing a kudo they have **not yet liked**, **When** they click the heart icon, **Then** the icon immediately turns red (`#D4271D`), the heart count increments by 1, and a `POST /api/kudos/{id}/like` request is sent.
2. **Given** the API call succeeds, **When** the response arrives, **Then** the UI count is reconciled with the server-returned `heart_count` (no visual flicker if identical).
3. **Given** the API call fails (network error), **When** the error is returned, **Then** the heart icon reverts to grey, the count reverts to its original value, and a brief error toast is shown.
4. **Given** a successful like, **When** the kudo sender's stats sidebar is visible, **Then** the "Tim nhận" count in the stats sidebar updates accordingly.
5. **Given** the same kudo appears on **multiple surfaces simultaneously** (e.g., visible in both the Highlight carousel and the All Kudos feed), **When** the user likes it on any one surface, **Then** the heart count and icon state update on **all surfaces** in the same session — no page reload required.

---

### User Story 2 - Unlike a Kudos (Priority: P1)

A Sunner who has previously liked a kudo can click the red heart icon again to unlike it. The heart turns grey, the count decrements by 1, and the tim point awarded to the sender is revoked.

**Why this priority**: Unlike is essential for correct UX symmetry. Without it, users cannot correct accidental likes.

**Independent Test**: Click the red heart on a kudo already liked by the current user and verify it turns grey and count decrements.

**Acceptance Scenarios**:

1. **Given** the user has **already liked** a kudo (heart is red), **When** they click the heart icon again, **Then** the icon immediately turns grey, the count decrements by 1, and a `DELETE /api/kudos/{id}/like` request is sent.
2. **Given** the API call succeeds, **When** the response arrives, **Then** the UI count is reconciled with the server value.
3. **Given** the API call fails, **When** the error is returned, **Then** the heart reverts to red, the count reverts, and an error toast is shown.

---

### User Story 3 - Sender Cannot Like Own Kudo (Priority: P1)

A Sunner who **sent** a kudo must not be able to like it. The heart button on their own kudos is visually disabled — shown in light grey with a `not-allowed` cursor — and is non-interactive.

**Why this priority**: Preventing self-liking is a fairness constraint for the gamification system. Tim points must only come from genuine peer appreciation.

**Independent Test**: Log in as the sender of a kudo, navigate to the Live Board, locate that kudo card, and verify the heart button is visually greyed out and non-clickable.

**Acceptance Scenarios**:

1. **Given** the authenticated user is the **sender** of a kudo, **When** the kudo card renders, **Then** the heart icon is displayed in light grey (`#CCCCCC`, 40% opacity) with `cursor: not-allowed`.
2. **Given** the heart button is disabled (sender's own kudo), **When** the user clicks on it, **Then** nothing happens — no API call is made, no visual change occurs.
3. **Given** the heart button is disabled, **When** the user hovers over it, **Then** a tooltip "Bạn không thể tim kudo của mình" (optional enhancement) may appear.

---

### User Story 4 - Special Day Double Tim Points (Priority: P2)

On admin-configured "special days", each like awards **+2 tim points** to the kudo sender instead of +1. This is entirely **backend logic** — there is no UI indicator or visual difference for the user on special days. The multiplier is determined server-side when the like is processed.

**Why this priority**: Double-point days drive engagement spikes and are part of the event gamification design.

**Independent Test**: An admin configures a special day in the database. A user likes a kudo during that day and the sender's tim balance increases by 2, not 1. No UI change is expected on the like button itself.

**Acceptance Scenarios**:

1. **Given** the current date is configured as a special day by an admin, **When** a user likes a kudo, **Then** the server awards **+2 tim points** to the kudo sender and returns `"tim_awarded": 2` in the API response.
2. **Given** a like was placed on a special day (stored as `tim_awarded: 2` on the `KudoLike` record), **When** the user unlikes the kudo, **Then** the server revokes exactly **2 tim points** from the sender's account (reads `tim_awarded` from the stored record, not re-checks the current date).
3. **Given** the current date is NOT a special day, **When** a user likes a kudo, **Then** the kudo sender receives **+1 tim point** and the API returns `"tim_awarded": 1`.
4. **Given** any like/unlike action on a special day, **When** the user views the Like button, **Then** the button looks and behaves **identically** to a non-special day — no visual indicator is shown.

---

### User Story 5 - Debounced Rapid Clicks (Priority: P2)

If a user clicks the heart button multiple times rapidly, only a single API call is made within a debounce window. The UI updates optimistically on the first click.

**Why this priority**: Prevents race conditions and duplicate tim point awards from accidental double-clicks.

**Independent Test**: Click the heart button 5 times in 200ms and verify only one API call is made.

**Acceptance Scenarios**:

1. **Given** a user clicks the heart button multiple times within 300ms, **When** the debounce window expires, **Then** only a single API call (`POST` or `DELETE`) is made based on the final intended state.
2. **Given** rapid clicks result in a net "no change" (like then unlike), **When** debounce resolves, **Then** no API call is made and the UI remains in the original state.

---

### Edge Cases

- **Unauthenticated user**: The heart button is not rendered or is hidden/disabled with a prompt to log in.
- **Kudo no longer exists**: If the kudo was deleted between page load and the like action, the API returns 404; show an appropriate error toast and remove the card from the feed.
- **Very high count**: Counts ≥ 1,000 are displayed with Vietnamese dot formatting (e.g., `1.000`, `10.000`).
- **Zero count**: Heart count shows `0` when no one has liked the kudo.
- **Network offline**: Optimistic UI rolls back; a toast indicates the action failed.
- **Anonymous kudo**: When a kudo is sent with `is_anonymous=true`, the sender identity is hidden in the UI but the `sender_id` still exists in the database. The server-side self-like prevention still applies (a sender cannot like their own anonymous kudo). On the client side, the API response for `GET /api/kudos` must include `is_my_kudo: true/false` (not derived from visible sender info) so the disable state renders correctly even for anonymous cards.
- **Concurrent likes from other users**: The board does **NOT** use Supabase Realtime. Other users' likes are invisible to the current user until a full page reload. This is by design. When the current user performs their own like/unlike and the API responds, the UI reconciles to the server-returned `heart_count` — which will naturally include any likes made by other users between page load and this API call.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions | Surfaces |
|-----------|-------------|--------------|----------|
| Heart Icon (default) | Grey heart (24×24) | Click → like | Feed card, Highlight card, Detail view |
| Heart Icon (active) | Red (#D4271D) heart (24×24) | Click → unlike | Feed card, Highlight card, Detail view |
| Heart Icon (disabled) | Light grey heart, `not-allowed` cursor | None (own kudo) | Feed card, Highlight card, Detail view |
| Heart Count | Number in Montserrat 20px 700 | Updates optimistically | Adjacent to heart icon |
| Action Row | Flex row: [❤ count] [Copy Link] [Xem chi tiết / Đóng] | Contains all card actions | Bottom of every kudo card |

See `design-style.md` for full visual specs.

### Navigation Flow

- **Like action**: In-place — no navigation. Heart count and icon update within the current card.
- **Entry point — Feed card**: `/kudo/live` All Kudos section. Like is accessible directly here.
- **Entry point — Highlight card**: `/kudo/live` Highlight carousel. Like is accessible without leaving the carousel.
- **Entry point — Detail view**: Opened via "Xem chi tiết ↗" button on highlight cards. The detail view is a modal overlay (no route change); the route remains `/kudo/live`. Like is accessible inside the modal.
- **Side effects**: Heart count updates in-place across all surfaces; stats sidebar "Tim nhận" counter may update if visible.

### Visual Requirements

- **Heart state transition**: scale animation `1 → 1.3 → 1` over 300ms on like; colour change on unlike (200ms)
- **Optimistic UI**: count updates immediately before API response
- **Responsive breakpoints**: Desktop ≥ 1024px (primary design), Mobile < 768px (reduced font sizes)
- **Accessibility**: `aria-label="Thích kudo này"` / `aria-pressed={isLiked}` on heart button; `role="button"` with keyboard support (`Enter`/`Space`)

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST toggle the like state per user per kudo (one like per user per kudo, idempotent).
- **FR-002**: System MUST update the heart count **immediately** on the UI via optimistic update (client-side only — no server round-trip required before count changes visually).
- **FR-003**: System MUST prevent the kudo sender from liking their own kudo — the button MUST be visually disabled.
- **FR-004**: System MUST award `+1 tim` to the kudo sender on like and revoke `1 tim` on unlike (default day).
- **FR-005**: System (server-side only) MUST award `+2 tim` / revoke `2 tim` on special admin-configured days. The client has no knowledge of special days — no UI indicator is shown.
- **FR-006**: System MUST debounce rapid clicks within a 300ms window before making API calls.
- **FR-007**: System MUST roll back optimistic UI if the API call fails and display an error toast.
- **FR-008**: Heart count MUST use Vietnamese number formatting (dot as thousands separator).
- **FR-009**: When the same kudo is visible on multiple surfaces simultaneously (feed + highlight + detail), a like/unlike action on any surface MUST update the count and icon state on **all surfaces** within the same session (cross-surface sync via client-side shared state — no page reload required).
- **FR-010**: Heart count updates from other users' actions are NOT shown in real-time. The count refreshes only on full page reload or when the current user performs their own like/unlike action.

### Technical Requirements

- **TR-001**: Like/unlike operations MUST complete within 500ms API response time (p95).
- **TR-002**: The feature MUST work on the Live Board page without full page reload.
- **TR-003**: Like state MUST be persisted in the database and consistent across sessions/devices.
- **TR-004**: API endpoints MUST validate authentication — unauthenticated requests return 401.
- **TR-005**: Self-like prevention MUST be enforced on the **server side** in addition to the client UI.
- **TR-006**: Route Handlers (`app/api/kudos/[id]/like/route.ts`) MUST validate all inputs with **Zod** before processing (constitution §II Next.js, §V Security A03).
- **TR-007**: The `kudo_likes` Supabase table MUST have **Row-Level Security (RLS)** policies enabled — users may only insert/delete their own like rows (constitution §II Supabase, §V A01/A07).
- **TR-008**: `HeartButton` MUST be a `"use client"` component (requires browser event handlers and local state); it MUST NOT be a React Server Component (constitution §II Next.js).
- **TR-009**: `GET /api/kudos` response MUST include `is_liked_by_me: boolean` and `is_my_kudo: boolean` per kudo item, computed server-side from the authenticated session (not client-derivable).
- **TR-010**: The system MUST **NOT** use Supabase Realtime or WebSockets for heart count updates. Heart counts update only when the current user performs a like/unlike action (optimistic update + server reconciliation). Other users' likes become visible only on full page reload — this is the accepted behavior.

### Key Entities *(if feature involves data)*

- **KudoLike**: Represents a like action. Key attributes: `kudo_id`, `user_id` (liker), `created_at`, `is_special_day` (boolean), `tim_awarded` (1 or 2).
- **Kudo**: Has `heart_count` (cached aggregate). Updated on like/unlike.
- **UserTimBalance**: The `tim` points balance for the kudo sender. Updated on like/unlike.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `POST /api/kudos/{id}/like` | POST | Like a kudo; awards tim to sender | New (predicted) |
| `DELETE /api/kudos/{id}/like` | DELETE | Unlike a kudo; revokes tim from sender | New (predicted) |
| `GET /api/kudos` | GET | Returns kudos list including `heart_count`, `is_liked_by_me`, `is_my_kudo` per kudo | Exists (extend response) |
| `GET /api/kudos/{id}` | GET | Returns single kudo with `heart_count`, `is_liked_by_me`, `is_my_kudo` | Exists (extend response) |
> All API requirements are **predicted** based on UI analysis. Exact endpoint paths may differ.

> **Note on special days**: The `GET /api/settings/special-days` endpoint is **NOT needed by the client**. The server determines the special-day multiplier internally when processing a like (checks date against admin-configured settings server-side). The client only observes the result via `tim_awarded` in the POST response.

### API Response Formats

**`POST /api/kudos/{id}/like` — 200 OK:**
```json
{
  "kudo_id": "uuid",
  "heart_count": 1001,
  "tim_awarded": 1
}
```
Returns 400 if self-like attempted. Returns 409 if already liked. Returns 401 if unauthenticated.

**`DELETE /api/kudos/{id}/like` — 200 OK:**
```json
{
  "kudo_id": "uuid",
  "heart_count": 999,
  "tim_revoked": 1
}
```
Returns 404 if like does not exist. Returns 401 if unauthenticated.

**`GET /api/kudos` — kudo item shape (relevant fields):**
```json
{
  "id": "uuid",
  "heart_count": 1000,
  "is_liked_by_me": false,
  "is_my_kudo": false
}
```

---

## State Management

### Local Component State (`HeartButton` — `"use client"`)

| State Variable | Type | Initial Value | Description |
|----------------|------|---------------|-------------|
| `isLiked` | `boolean` | from `is_liked_by_me` prop | Whether the current user has liked this kudo |
| `heartCount` | `number` | from `heart_count` prop | Displayed heart count (optimistic) |
| `isLoading` | `boolean` | `false` | True while API call is in-flight |

### Cross-Surface Sync (A3 — confirmed required)

When a user likes/unlikes a kudo on **one surface** (e.g., Highlight carousel), the count on the **same kudo's card on all other surfaces** (e.g., Feed card, Detail modal) MUST update immediately in the same session — without a full page reload.

**Implementation approach**: Use a **React Context** (`KudoLikeContext`) or a lightweight client-side store (e.g., Zustand) that holds a map of `{ [kudoId: string]: { isLiked: boolean; heartCount: number } }`. All `HeartButton` instances for the same kudo subscribe to this shared state. On like/unlike, the context is updated and all instances re-render.

```
KudoLikeContext (client-side store)
  kudoLikeMap: Record<string, { isLiked: boolean; heartCount: number }>

  actions:
    - optimisticLike(kudoId)    → updates kudoLikeMap[kudoId]
    - optimisticUnlike(kudoId)  → updates kudoLikeMap[kudoId]
    - reconcile(kudoId, serverCount) → syncs to server value after API response
    - rollback(kudoId, prevState) → reverts on API error
```

**Initial population**: The context is seeded from the server-fetched kudo list (`is_liked_by_me`, `heart_count` per kudo) on page load. No re-fetch is needed between user actions.

### Global / Server State

- The kudo list (`/api/kudos`) is fetched server-side in a Server Component on initial page load and passed as props to seed the client context.
- After a like/unlike API response, the `HeartButton` calls `reconcile(kudoId, serverCount)` — no full re-fetch of the kudos list is triggered (no React Query / SWR invalidation). The server response for `POST/DELETE /api/kudos/{id}/like` is the single source of truth for post-action counts.
- No polling or Supabase Realtime subscriptions are used.

### Loading & Error States

| State | UI Behavior |
|-------|-------------|
| `isLoading: true` | Heart icon pulses (CSS animation), button `pointer-events: none` to prevent double-submit |
| API error (like fails) | `rollback(kudoId, prevState)` reverts all surfaces; show error toast (2s) |
| API error (unlike fails) | `rollback(kudoId, prevState)` reverts all surfaces; show error toast (2s) |
| Initial page load | Heart button renders with server-provided values from context; no skeleton needed |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Heart icon state (grey/red/disabled) renders correctly for 100% of kudo cards on Live Board load.
- **SC-002**: Like/unlike optimistic update occurs within 50ms of click (perceived as instant).
- **SC-003**: No duplicate API calls produced by rapid clicking (debounce working).
- **SC-004**: Sender's heart button is disabled on 100% of their own kudo cards.
- **SC-005**: Tim point balance updates correctly for standard days (+1/-1) and special days (+2/-2).

---

## Out of Scope

- Admin UI for configuring special days (separate admin feature).
- Push notifications to kudo sender when their kudo is liked.
- Displaying a list of users who liked a kudo (no "who liked this" popover in current design).
- Liking from outside the Kudos Live Board (e.g., email notification links).

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`)
- [ ] Database design completed (`.momorph/database.sql`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)
- [x] Live Board spec exists (`.momorph/specs/2940-13431-sun-kudos-live-board/spec.md`) — Like Kudos is User Story 2 in that spec; this spec supersedes it with full detail

---

## Notes

- The like feature is described at a high level in the Live Board spec (User Story 2). This document provides the full, implementation-ready specification.
- Related Figma frames: `256:5231` (KUDO feed card), `335:9620` (KUDO Highlight), `520:18779` (View Kudo detail).
- All three surfaces (feed, highlight, detail) share the same like interaction logic but differ in layout context.
- The "tim" points system is the gamification backbone of SAA 2025 — correctness of the award/revoke logic is critical.
