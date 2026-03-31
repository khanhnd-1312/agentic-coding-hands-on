# Feature Specification: Dropdown list hashtag (Write Kudo Hashtag Picker)

**Frame ID**: `1002:13013`
**Frame Name**: `Dropdown list hashtag`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/1002:13013
**Created**: 2026-03-31
**Status**: Draft

---

## Overview

The "Dropdown list hashtag" is a **multi-select** hashtag picker used in the **Write Kudo** screen (`520:11602`). When the user clicks the "+ Hashtag / Toi da 5" trigger button, a dark-themed dropdown opens showing all available hashtags. Users can select up to 5 hashtags by clicking items — selected items show a gold-tinted background and a check icon. This is distinct from the Live Board filter dropdown (single-select) — this is a multi-select picker for composing kudos.

**Design Reference**: ![Dropdown list hashtag](https://momorph.ai/api/images/9ypp4enmFmdK3YAFJLIu6C/1002:13013/2b8eea79a907bbfee55e3171d69b5862.png)

### Existing Implementation

A `HashtagField` component exists at `src/components/write-kudo/hashtag-field.tsx`. It has complete **behavior** (fetch hashtags, multi-select up to 5, deselect, create new, search/filter) but uses **light theme styling** (white bg, dark text, no check icons). The Figma design requires **dark theme** (`#00070C` bg, white text, gold selected bg, check icons).

**Current styling gaps vs Figma design:**
- Dropdown background: code uses `bg-white`, Figma specifies `#00070C` (dark)
- Dropdown border: code uses `border-[#998C5F]` — matches Figma ✓
- Item text color: code uses `text-[#00101A]` (dark), Figma specifies `#FFFFFF` (white)
- Item font size: code uses `text-sm` (14px), Figma specifies `text-base` (16px/700)
- Selected item bg: code uses `hover:bg-gray-100`, Figma specifies `rgba(255,234,158,0.2)` (gold tint)
- Check icon: code has none, Figma shows a 24×24px circle-check icon on selected items
- Item height: code uses auto/padding-based, Figma specifies 40px fixed height
- Dropdown width: code uses `w-64` (256px), Figma specifies 318px
- Search input: code has a search input at top — Figma does NOT show a search input (but behavior is useful, keep it)

**The Figma design is the source of truth for visual styling** — the implementation must be updated to match while preserving existing behavior.

### Related Specs

- **Viet Kudo** (`specs/520-11602-viet-kudo/`): Parent screen where this dropdown is used
- **Dropdown Hashtag filter** (`specs/721-5580-Dropdown-Hashtag-filter/`): Similar visual pattern but single-select for Live Board filtering
- **Hastag group** (frame `1002:13094`): Related hashtag display component

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select hashtags for a kudo (Priority: P1)

A user writing a kudo wants to attach up to 5 hashtags to categorize their recognition message. They click the "Hashtag" trigger, see all available hashtags, and click to select/deselect.

**Why this priority**: Core functionality — hashtags are required when writing a kudo.

**Independent Test**: Open dropdown, click 3 hashtags, verify they show check icons and gold bg, verify selected count matches.

**Acceptance Scenarios**:

1. **Given** the dropdown is open with no selections, **When** the user clicks "#High-perorming", **Then** the item shows gold bg `rgba(255,234,158,0.2)` + check icon, and the hashtag is added to the selected list.
2. **Given** 3 hashtags are selected, **When** the user clicks a 4th unselected hashtag, **Then** it becomes selected (total 4), check icon appears.
3. **Given** 5 hashtags are already selected (max), **When** the user tries to click a 6th, **Then** the click is ignored (or remaining items are disabled/dimmed).
4. **Given** a hashtag is selected, **When** the user clicks it again, **Then** it is deselected — check icon disappears, gold bg removed.

---

### User Story 2 - Open and close dropdown (Priority: P1)

A user wants to open the hashtag picker and close it after selecting.

**Why this priority**: Essential UX — must be toggleable.

**Independent Test**: Click trigger to open, click outside to close, verify selected state persists.

**Acceptance Scenarios**:

1. **Given** the dropdown is closed, **When** the user clicks the "+ Hashtag" trigger button, **Then** the dropdown opens below the trigger showing all hashtags.
2. **Given** the dropdown is open, **When** the user clicks outside, **Then** the dropdown closes and selected hashtags are preserved.
3. **Given** 5 hashtags are selected, **When** the user selects the 5th, **Then** the dropdown auto-closes.

---

### User Story 3 - Search/filter hashtags (Priority: P2)

A user wants to quickly find a hashtag by typing.

**Why this priority**: UX enhancement — useful with 13+ hashtags.

**Independent Test**: Type in search field, verify list filters in real-time.

**Acceptance Scenarios**:

1. **Given** the dropdown is open, **When** the user types "Aim" in the search field, **Then** only hashtags containing "Aim" are shown (e.g., "#Aim High").
2. **Given** the user types a name that doesn't exist, **When** they press Enter, **Then** a new hashtag is created via `POST /api/hashtags` and auto-selected.

> Note: The Figma design does NOT show a search input, but the existing implementation has it and it's valuable UX. Keep the search functionality but style it to match the dark theme.

---

### User Story 4 - Keyboard navigation (Priority: P2)

A user navigates the hashtag list using keyboard.

**Why this priority**: Accessibility compliance.

**Acceptance Scenarios**:

1. **Given** the search input has focus, **When** the user presses `Enter`, **Then** the first visible hashtag is selected.
2. **Given** the dropdown is open, **When** the user presses `Escape`, **Then** the dropdown closes.

---

### Edge Cases

- Max 5 hashtags: when limit is reached, remaining unselected items should be visually disabled (dimmed) or the dropdown auto-closes.
- If the hashtag API fails, show a loading/error state inside the dropdown.
- If no hashtags exist in the database, show empty state.
- Very long hashtag names should be truncated with ellipsis within the 306px item width.
- The trigger button should show "Toi da 5" (max 5) sublabel. When all 5 are used, the trigger button should not appear (already implemented).

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| Trigger Button | `1002:15115` | White bg, "+ Hashtag / Toi da 5", border #998C5F | Click → open dropdown |
| Dropdown Container | `1002:13102` | Dark bg #00070C, border #998C5F, r:8px, p:6px | Overlay below trigger |
| Selected Item (A/B/C) | `1002:13185` | Gold bg 0.2, text + check icon 24px | Click → deselect |
| Unselected Item (D+) | `1002:13104` | Transparent bg, text only, no check | Click → select |
| Check Icon | `1002:13204` | 24×24px circle-check, visible on selected | — |
| Plus Icon | `I1002:15115;186:2759` | 24×24px "+" in trigger button | — |

### Navigation Flow

- **From**: Write Kudo modal → Hashtag field → click trigger
- **On component**: View list → toggle select/deselect → auto-close at max
- **To**: Selected hashtags shown as chips above/beside the trigger
- **Back**: Click outside to dismiss

### Visual Requirements

See [design-style.md](./design-style.md) for full visual specifications.

- **Theme**: Dark dropdown (`#00070C`) on light Write Kudo form — mixed theme
- **Selected state**: Gold bg `rgba(255,234,158,0.2)` + check icon (NOT text-shadow glow)
- **Typography**: Montserrat 16px/700, white text, letter-spacing 0.15px
- **Item height**: 40px fixed
- **Dropdown width**: 318px fixed

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display all hashtags from `GET /api/hashtags` in a scrollable list.
- **FR-002**: Users MUST be able to select up to 5 hashtags (multi-select with toggle).
- **FR-003**: Selected items MUST show gold bg `rgba(255,234,158,0.2)` and a check icon (24×24px).
- **FR-004**: Unselected items MUST have transparent bg and no check icon.
- **FR-005**: When 5 hashtags are selected, additional selections MUST be blocked (disable or auto-close).
- **FR-006**: Users MUST be able to deselect by clicking a selected item (toggle off).
- **FR-007**: System MUST close the dropdown when clicking outside.
- **FR-008**: Users SHOULD be able to search/filter hashtags by name (existing behavior, keep it).
- **FR-009**: Users SHOULD be able to create a new hashtag if it doesn't exist (via `POST /api/hashtags`).

### Technical Requirements

- **TR-001**: Component MUST reuse the existing `HashtagField` at `src/components/write-kudo/hashtag-field.tsx`, updating styles to match Figma dark theme.
- **TR-002**: Hashtag data MUST be fetched from `GET /api/hashtags` (returns `{ data: { id, name }[] }`).
- **TR-003**: New hashtags MUST be created via `POST /api/hashtags` (returns `{ data: { id, name } }`).
- **TR-004**: Check icon MUST use the `<Icon>` component, not raw SVG or img. The Figma design uses a **circle-check** icon (`MM_MEDIA` instance `1002:13201`). The current Icon component does NOT have `check-circle` — it only has `checkbox-checked` (square). A new `check-circle` icon variant MUST be added to `src/components/ui/icon.tsx` before use.
- **TR-005**: The dropdown MUST use dark theme colors (`#00070C` bg, `#FFFFFF` text) matching the design-style.md spec.

### State Management

| State | Type | Scope | Default | Notes |
|-------|------|-------|---------|-------|
| `isOpen` | boolean | Local | `false` | Dropdown open/closed |
| `selectedHashtags` | Array<{id, name}> | Parent (WriteKudo) | `[]` | Currently selected (max 5) |
| `allHashtags` | Hashtag[] | Local/Cache | `[]` | Full list from API |
| `filter` | string | Local | `""` | Search input value |
| `isLoading` | boolean | Local | `false` | While fetching hashtags |
| `error` | string \| null | Local | `null` | Error message if API fetch fails |

### Accessibility Requirements

- **Trigger**: `aria-haspopup="listbox"`, `aria-expanded="true/false"`
- **List**: `role="listbox"`, `aria-multiselectable="true"`, `aria-label="Chon hashtag"`
- **Items**: `role="option"`, `aria-selected="true/false"`
- **Keyboard**: `Enter` to select first filtered item, `Escape` to close
- **Focus ring**: `2px solid #15D5CA` on focused items

### Key Entities

- **Hashtag**: `{ id: string, name: string }` — from `GET /api/hashtags`
- **Selection state**: Array of selected hashtag objects, managed by parent `WriteKudoModal`

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/hashtags` | GET | Fetch all available hashtags | Exists |
| `/api/hashtags` | POST | Create new hashtag | Exists |

---

## Hashtag Data

13 hashtags (same as Live Board filter):

```
#Toàn diện, #Giỏi chuyên môn, #Hiệu suất cao, #Truyền cảm hứng,
#Cống hiến, #Aim High, #Be Agile, #Wasshoi, #Hướng mục tiêu,
#Hướng khách hàng, #Chuẩn quy trình, #Giải pháp sáng tạo, #Quản lý xuất sắc
```

---

## Success Criteria *(mandatory)*

- **SC-001**: Dropdown uses dark theme (#00070C bg, white text) matching Figma.
- **SC-002**: Selected items show gold bg (0.2 opacity) + 24px check icon.
- **SC-003**: Max 5 selection limit enforced.
- **SC-004**: Toggle select/deselect works correctly.
- **SC-005**: Search and create-new-hashtag features still work with dark theme.
- **SC-006**: WCAG 2.1 AA color contrast compliance.

---

## Out of Scope

- Reordering selected hashtags.
- Hashtag categories or grouping.
- Admin hashtag management.
- Inline hashtag editing.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] Design style documented (`design-style.md`)
- [x] `HashtagField` component exists (`src/components/write-kudo/hashtag-field.tsx`)
- [x] `GET /api/hashtags` and `POST /api/hashtags` endpoints exist
- [x] Write Kudo screen spec exists (`specs/520-11602-viet-kudo/`)

---

## Notes

- This is a **style-update task** — the `HashtagField` component already has full behavior. The primary work is updating the dropdown's visual theme from light to dark, and adding check icons for selected items.
- The search input at the top of the dropdown is NOT in the Figma design but is valuable UX. **Keep it** but style it to match the dark theme (dark bg, white text, gold border).
- The trigger button style in Figma (white bg, gold border) differs from the dropdown (dark bg). This mixed-theme is intentional — the trigger sits on the light Write Kudo form while the dropdown overlays with dark theme.
- Selected item bg uses **0.2 opacity** (not 0.1 like the Live Board filter) — this is intentional per Figma for better visibility in the multi-select context.
