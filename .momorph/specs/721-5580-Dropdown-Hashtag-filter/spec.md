# Feature Specification: Dropdown Hashtag filter

**Frame ID**: `721:5580`
**Frame Name**: `Dropdown Hashtag filter`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/721:5580
**Created**: 2026-03-31
**Status**: Draft

---

## Overview

The "Dropdown Hashtag filter" is a filter dropdown component that allows users to select a hashtag to filter kudos on the Sun* Kudos Live Board page. When triggered, it overlays a scrollable list of hashtag names (e.g., #Dedicated, #Inspring) on top of the page. The currently selected hashtag is highlighted with a gold-tinted background and glow text-shadow. Selecting a hashtag filters the kudos cards on the Live Board to show only those tagged with that hashtag.

**Design Reference**: ![Dropdown Hashtag filter](https://momorph.ai/api/images/9ypp4enmFmdK3YAFJLIu6C/721:5580/288a43bf333b986c83f6bf8e7d4bfc9d.png)

### Existing Implementation

The `FilterDropdown` component at `src/components/kudos-live-board/filter-dropdown.tsx` is **already fully implemented and styled** for this use case. It is a generic dropdown used for both hashtag and department filtering on the Live Board (`src/components/kudos-live-board/highlight-section.tsx`). The hashtag list is fetched from `GET /api/hashtags` (returns `{ data: { id: string, name: string }[] }`).

The style updates applied during the Department Dropdown implementation (`721-5684`) **already apply** to this hashtag filter — both use the same shared `FilterDropdown` component. **No additional code changes are needed.**

### Related Specs

- **Sun* Kudos Live Board** (`specs/2940-13431-sun-kudos-live-board/`): Parent page where this dropdown is used as a filter
- **Dropdown Phong ban** (`specs/721-5684-Dropdown-Phong-ban/`): Identical visual pattern (department filter) — shares the same `FilterDropdown` component

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filter kudos by hashtag (Priority: P1)

A user on the Sun* Kudos Live Board wants to filter the displayed kudos to see only those tagged with a specific hashtag (e.g., #Dedicated, #Truyền cảm hứng). They click the "Hashtag" filter trigger, see a dropdown list of hashtags, and select one to apply the filter.

**Why this priority**: Core functionality — filtering by hashtag is the primary purpose of this dropdown.

**Independent Test**: Open the dropdown, click a hashtag, verify the filter is applied and the dropdown closes.

**Acceptance Scenarios**:

1. **Given** the dropdown is open with "#Dedicated" selected, **When** the user clicks "#Inspring", **Then** the filter changes to "#Inspring", the selected highlight moves (gold background + text-shadow glow), and the dropdown closes.
2. **Given** the dropdown is open, **When** the user clicks the already-selected hashtag, **Then** the selection is cleared (deselected), the filter is removed, and the dropdown closes. *(Toggle behavior — existing implementation uses `onSelect(null)` to deselect.)*
3. **Given** a hashtag is selected, **When** the filter is applied, **Then** the Live Board (both highlights and all-kudos sections) updates to show only kudos tagged with that hashtag.
4. **Given** the dropdown is open, **When** the user scrolls the list, **Then** additional hashtag names become visible (the full list of 13 hashtags is scrollable).

---

### User Story 2 - Open and close dropdown (Priority: P1)

A user wants to open the hashtag filter dropdown to see available hashtags, and close it without making a selection.

**Why this priority**: Essential UX — the dropdown must be toggleable.

**Independent Test**: Click the trigger to open, verify the dropdown appears. Click outside or press Escape to close.

**Acceptance Scenarios**:

1. **Given** the dropdown is closed, **When** the user clicks the "Hashtag" trigger button, **Then** the dropdown opens displaying the list of hashtags with the current selection highlighted.
2. **Given** the dropdown is open, **When** the user clicks outside the dropdown area, **Then** the dropdown closes without changing the selection.
3. **Given** the dropdown is open, **When** the user presses `Escape`, **Then** the dropdown closes and focus returns to the trigger button.

---

### User Story 3 - Keyboard navigation (Priority: P2)

A user navigates the hashtag list using keyboard for accessibility.

**Why this priority**: Important for accessibility compliance.

**Independent Test**: Open dropdown with Enter/Space, navigate items with arrow keys, select with Enter.

**Acceptance Scenarios**:

1. **Given** the dropdown trigger has focus, **When** the user presses `Enter` or `Space`, **Then** the dropdown opens.
2. **Given** the dropdown is open, **When** the user presses `ArrowDown`/`ArrowUp`, **Then** focus moves to the next/previous hashtag item.
3. **Given** focus is on a hashtag item, **When** the user presses `Enter`, **Then** that hashtag is selected, the dropdown closes, and the filter is applied.

---

### Edge Cases

- If the hashtag list API fails to load, the dropdown shows an empty state with "Không có dữ liệu" fallback text.
- If the list is longer than ~6 items (13 hashtags total), the dropdown is scrollable with `overflow-y: auto` and a `max-height` constraint (~348px).
- When the selected hashtag is scrolled out of view, the dropdown auto-scrolls to show the selected item when reopened.
- Hashtag names include the `#` prefix (stored in database as part of the name).

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| Dropdown Container | `563:8026` | Dark card with gold border, flex-column, scrollable | Open/Close toggle |
| Item (Selected) | `I563:8026;525:13508` | Gold-tinted bg + text-shadow glow | Click → deselect or re-confirm |
| Item (Default) | `I563:8026;525:14864` | Transparent bg, white text | Click → select, Hover → gold bg |
| Item Text | `I563:8026;525:13508;186:1497` | Montserrat 16px/700, centered | — |

### Navigation Flow

- **From**: Sun* Kudos Live Board filter bar → click "Hashtag" trigger button
- **On component**: View list → select hashtag → filter applied
- **To**: Dropdown closes, Live Board re-renders with filtered data
- **Back**: Click outside / Escape to dismiss

### Visual Requirements

See [design-style.md](./design-style.md) for full visual specifications. This dropdown is **visually identical** to the Department Dropdown.

- **Color scheme**: Dark background `#00070C`, gold border `#998C5F`, gold-tinted selected `rgba(255,234,158,0.1)`
- **Typography**: Montserrat 700, 16px throughout
- **Selected state**: Gold text-shadow glow (`0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`)
- **Responsive**: Scrollable list, max-height constraint
- **Accessibility**: WCAG 2.1 AA — white text on `#00070C` has contrast > 7:1

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a scrollable list of all hashtags fetched from `GET /api/hashtags`.
- **FR-002**: System MUST highlight the currently selected hashtag with a gold-tinted background (`rgba(255,234,158,0.1)`) and text-shadow glow.
- **FR-003**: Users MUST be able to click a hashtag to select it, which closes the dropdown and applies the filter.
- **FR-004**: System MUST close the dropdown when the user clicks outside or presses `Escape`.
- **FR-005**: System MUST support keyboard navigation (`ArrowUp`/`ArrowDown`, `Enter`, `Escape`).
- **FR-006**: System MUST filter both the highlights carousel AND the all-kudos feed when a hashtag is selected.

### Technical Requirements

- **TR-001**: Hashtag data MUST be fetched from `GET /api/hashtags` (returns `{ data: { id, name }[] }`).
- **TR-002**: Component MUST reuse the existing `FilterDropdown` at `src/components/kudos-live-board/filter-dropdown.tsx` — **no new component needed**.
- **TR-003**: Hashtag filter MUST be applied to both `/api/kudos?hashtag={id}` and `/api/kudos/highlights?hashtag={id}` endpoints.
- **TR-004**: The `FilterDropdown` styles were already updated to match Figma in the Department Dropdown implementation. **No additional style changes needed.**

### State Management

| State | Type | Scope | Default | Notes |
|-------|------|-------|---------|-------|
| `isOpen` | boolean | Local | `false` | Dropdown open/closed |
| `selectedHashtag` | string \| null | Parent/URL | `null` | Currently selected hashtag ID |
| `hashtags` | Hashtag[] | Server/Cache | `[]` | List of hashtags from API |
| `focusedIndex` | number | Local | `-1` | Keyboard navigation index |
| `isLoading` | boolean | Parent | `false` | While fetching hashtags from API |
| `error` | string \| null | Parent | `null` | Error message if API fetch fails |

### Accessibility Requirements

- **Dropdown trigger**: `aria-haspopup="listbox"`, `aria-expanded="true/false"`
- **Dropdown list**: `role="listbox"`, `aria-labelledby={triggerId}`
- **List items**: `role="option"`, `aria-selected="true/false"`
- **Keyboard**: Full `ArrowUp`/`ArrowDown`/`Enter`/`Escape` support
- **Focus ring**: `2px solid #15D5CA` on focused items

### Key Entities

- **Hashtag**: `{ id: string, name: string }` — tag used to categorize kudos (from `GET /api/hashtags`)
- **Filter state**: The selected hashtag ID is used as a query parameter to filter kudos

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/hashtags` | GET | Fetch list of all hashtags | Exists |
| `/api/kudos` | GET | Fetch kudos filtered by `hashtag` query param | Exists |
| `/api/kudos/highlights` | GET | Fetch highlight kudos filtered by `hashtag` query param | Exists |

---

## Hashtag Data

The full list of 13 hashtags (from Figma spec, with Vietnamese diacritics as stored in DB):

```
#Toàn diện, #Giỏi chuyên môn, #Hiệu suất cao, #Truyền cảm hứng,
#Cống hiến, #Aim High, #Be Agile, #Wasshoi, #Hướng mục tiêu,
#Hướng khách hàng, #Chuẩn quy trình, #Giải pháp sáng tạo, #Quản lý xuất sắc
```

> Note: Hashtag names in the database include the `#` prefix. The Figma mockup shows placeholder names (#Dedicated, #Inspring) but actual data uses Vietnamese names above.

---

## Success Criteria *(mandatory)*

- **SC-001**: All 13 hashtags render correctly in the scrollable dropdown list.
- **SC-002**: Selected hashtag is visually highlighted with gold background + glow (matches Figma).
- **SC-003**: Selecting a hashtag filters both highlights and all-kudos sections.
- **SC-004**: Toggle deselect works (clicking selected hashtag clears filter).
- **SC-005**: Keyboard navigation works fully.
- **SC-006**: WCAG 2.1 AA color contrast compliance.

---

## Out of Scope

- Creating new hashtags from the filter dropdown (hashtag creation is in the Write Kudo screen).
- Multi-select hashtags (only single selection).
- Hashtag search/type-ahead within the dropdown.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] Design style documented (`design-style.md`)
- [x] `FilterDropdown` component already implemented and styled (`src/components/kudos-live-board/filter-dropdown.tsx`)
- [x] `GET /api/hashtags` endpoint exists
- [x] Hashtag filter already wired in `highlight-section.tsx`

---

## Notes

- **No implementation work needed** — the `FilterDropdown` component is already fully functional and styled for hashtag filtering. This spec exists for documentation completeness and traceability.
- The component is shared with the Department Dropdown (`721:5684`). Style updates from that spec apply to both.
- The existing `FilterDropdown` tests (17 tests) already cover all behavior including style conformance.
- Hashtag filtering already works on both `/api/kudos` (via `kudos_hashtags.hashtag_id` join filter) and `/api/kudos/highlights` (same filter).
