# Feature Specification: Dropdown Phòng ban (Department Dropdown)

**Frame ID**: `721:5684`
**Frame Name**: `Dropdown Phòng ban`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/721:5684
**Created**: 2026-03-31
**Status**: Draft

---

## Overview

The "Dropdown Phòng ban" (Department Dropdown) is a filter dropdown component that allows users to select a department to filter content on the Sun* Kudos Live Board page. When triggered, it overlays a scrollable list of department names (e.g., CEVC2, CEVC3, OPD, Infra) on top of the page. The currently selected department is highlighted with a gold-tinted background and glow text-shadow. Selecting a department filters the kudos/recognition cards displayed on the Live Board to show only those related to members of that department.

**Design Reference**: ![Dropdown Phòng ban](https://momorph.ai/api/images/9ypp4enmFmdK3YAFJLIu6C/721:5684/e16a7a42afaa2c9adf5fb3b0231dca16.png)

### Existing Implementation

A `FilterDropdown` component already exists at `src/components/kudos-live-board/filter-dropdown.tsx`. It is a generic dropdown used for both hashtag and department filtering on the Live Board (`src/components/kudos-live-board/highlight-section.tsx`). The department list is fetched from `GET /api/departments` (returns `{ data: { id: string, name: string }[] }`).

**Current styling gaps vs Figma design:**
- Item padding: code uses `px-4 py-2`, Figma specifies `p-4` (16px all sides) with `h-56px`
- Selected bg opacity: code uses `rgba(255,234,158,0.2)`, Figma specifies `rgba(255,234,158,0.1)`
- Font size: code uses `text-sm` (14px), Figma specifies 16px/700
- Selected text-shadow glow: code has none, Figma specifies `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`
- Container padding: code uses `p-1.5` (6px) — matches Figma ✓

**The Figma design is the source of truth** — the implementation must be updated to match.

### Related Specs

- **Sun* Kudos Live Board** (`specs/2940-13431-sun-kudos-live-board/`): Parent page where this dropdown is used as a filter
- **Dropdown-ngon-ngu** (`specs/721-4942-Dropdown-ngon-ngu/`): Similar dropdown component pattern (language selector)

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filter kudos by department (Priority: P1)

A user on the Sun* Kudos Live Board wants to filter the displayed kudos to see only recognition messages related to a specific department (e.g., CEVC2, Infra). They click the "Phòng ban" filter trigger, see a dropdown list of departments, and select one to apply the filter.

**Why this priority**: This is the core functionality — without selecting a department, the dropdown has no purpose.

**Independent Test**: Open the dropdown, click a department, verify the filter is applied and the dropdown closes.

**Acceptance Scenarios**:

1. **Given** the dropdown is open with "CEVC2" selected, **When** the user clicks "CEVC3", **Then** the filter changes to "CEVC3", the selected highlight moves to "CEVC3" (gold background + text-shadow glow), and the dropdown closes.
2. **Given** the dropdown is open, **When** the user clicks the already-selected department, **Then** the selection is cleared (deselected to "All"), the filter is removed, and the dropdown closes. *(Toggle behavior — existing implementation uses `onSelect(null)` to deselect.)*
3. **Given** a department is selected, **When** the filter is applied, **Then** the Live Board updates to show only kudos involving members of that department.
4. **Given** the dropdown is open, **When** the user scrolls the list, **Then** additional department names become visible (the full list of ~50 departments is scrollable).

---

### User Story 2 - Open and close dropdown (Priority: P1)

A user wants to open the department filter dropdown to see available departments, and close it without making a selection.

**Why this priority**: Essential UX — the dropdown must be toggleable before any filter can be applied.

**Independent Test**: Click the trigger to open, verify the dropdown appears. Click outside or press Escape to close.

**Acceptance Scenarios**:

1. **Given** the dropdown is closed, **When** the user clicks the "Phòng ban" trigger button, **Then** the dropdown opens displaying the list of departments with the current selection highlighted.
2. **Given** the dropdown is open, **When** the user clicks outside the dropdown area, **Then** the dropdown closes without changing the selection.
3. **Given** the dropdown is open, **When** the user presses `Escape`, **Then** the dropdown closes and focus returns to the trigger button.
4. **Given** the dropdown opens, **Then** it appears as an overlay with `z-index` above the header (z-50+) positioned relative to the trigger.

---

### User Story 3 - Keyboard navigation (Priority: P2)

A user navigates the department list using keyboard for accessibility.

**Why this priority**: Important for accessibility compliance but not the primary interaction method.

**Independent Test**: Open dropdown with Enter/Space, navigate items with arrow keys, select with Enter.

**Acceptance Scenarios**:

1. **Given** the dropdown trigger has focus, **When** the user presses `Enter` or `Space`, **Then** the dropdown opens.
2. **Given** the dropdown is open, **When** the user presses `ArrowDown`, **Then** focus moves to the next department item.
3. **Given** the dropdown is open, **When** the user presses `ArrowUp`, **Then** focus moves to the previous department item.
4. **Given** focus is on a department item, **When** the user presses `Enter`, **Then** that department is selected, the dropdown closes, and the filter is applied.

---

### Edge Cases

- If the department list API fails to load, display a friendly error message inside the dropdown or fall back to an empty state.
- If the list is very long (~50 departments), the dropdown must be scrollable with `overflow-y: auto` and a `max-height` constraint (~348px or 6 visible items).
- When the selected department is scrolled out of view, the dropdown should auto-scroll to show the selected item when reopened.
- On very small viewports, the dropdown should not overflow the screen — it should be constrained within the viewport bounds.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| Dropdown Container | `563:8027` | Dark card with gold border, flex-column, scrollable | Open/Close toggle |
| Item (Selected) | `I563:8027;563:7956` | Gold-tinted bg + text-shadow glow | Click → deselect or re-confirm |
| Item (Default) | `I563:8027;563:7957` | Transparent bg, white text | Click → select, Hover → gold bg |
| Item Text | `I563:8027;563:7956;186:1497` | Montserrat 16px/700, centered | — |

### Navigation Flow

- **From**: Sun* Kudos Live Board filter bar → click "Phòng ban" trigger button
- **On component**: View list → select department → filter applied
- **To**: Dropdown closes, Live Board re-renders with filtered data
- **Back**: Click outside / Escape to dismiss

### Visual Requirements

See [design-style.md](./design-style.md) for full visual specifications.

- **Color scheme**: Dark background `#00070C`, gold border `#998C5F`, gold-tinted selected `rgba(255,234,158,0.1)`
- **Typography**: Montserrat 700, 16px throughout
- **Selected state**: Gold text-shadow glow (`0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`)
- **Responsive**: Scrollable list, max-height constraint
- **Accessibility**: WCAG 2.1 AA — white text on `#00070C` has contrast > 7:1

### Layout Specifications

- Dropdown width: hug-content (adapts to longest department name)
- Item height: 56px each
- Container padding: 6px
- Item padding: 16px
- See ASCII layout diagram in [design-style.md](./design-style.md)

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a scrollable list of all departments fetched from `GET /api/departments`.
- **FR-002**: System MUST highlight the currently selected department with a gold-tinted background (`rgba(255,234,158,0.1)`) and text-shadow glow.
- **FR-003**: Users MUST be able to click a department to select it, which closes the dropdown and applies the filter to the Live Board.
- **FR-004**: System MUST close the dropdown when the user clicks outside of it or presses `Escape`.
- **FR-005**: System MUST support keyboard navigation (`ArrowUp`/`ArrowDown` to move, `Enter` to select, `Escape` to close).
- **FR-006**: Dropdown MUST appear as an overlay with `z-index` above the page header (z-50+).
- **FR-007**: When the list exceeds visible area (~6 items), the dropdown MUST be scrollable with `overflow-y: auto`.

### Technical Requirements

- **TR-001**: Dropdown data (department list) MUST be fetched from `GET /api/departments` and cached client-side.
- **TR-002**: Component MUST be a `"use client"` component (requires click handlers, local state for open/close).
- **TR-003**: Selected department state MUST be managed via URL search params or parent component state to enable shareable filtered views.
- **TR-004**: The dropdown MUST reuse the existing `FilterDropdown` component at `src/components/kudos-live-board/filter-dropdown.tsx`, updating its styles to match the Figma design (see "Existing Implementation" section above for the list of style gaps).
- **TR-005**: Focus management: when opened, focus moves to the selected item; when closed, focus returns to the trigger.

### State Management

| State | Type | Scope | Default | Notes |
|-------|------|-------|---------|-------|
| `isOpen` | boolean | Local | `false` | Dropdown open/closed |
| `selectedDepartment` | string \| null | Parent/URL | `null` | Currently selected department ID |
| `departments` | Department[] | Server/Cache | `[]` | List of departments from API |
| `focusedIndex` | number | Local | `-1` | Keyboard navigation index |
| `isLoading` | boolean | Parent | `true` | While fetching departments from API |
| `error` | string \| null | Parent | `null` | Error message if API fetch fails |

### Accessibility Requirements

- **Dropdown trigger**: `aria-haspopup="listbox"`, `aria-expanded="true/false"`
- **Dropdown list**: `role="listbox"`, `aria-label="Chọn phòng ban"`
- **List items**: `role="option"`, `aria-selected="true/false"`
- **Keyboard**: Full `ArrowUp`/`ArrowDown`/`Enter`/`Escape` support
- **Focus ring**: `2px solid #15D5CA` on focused items (never `outline: none` without replacement)

### Key Entities *(if feature involves data)*

- **Department**: `{ id: string, name: string }` — organizational unit used as a filter dimension (from `GET /api/departments`, no `slug` field)
- **Filter state**: The selected department ID is used as a query parameter to filter kudos on the Live Board

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/departments` | GET | Fetch list of all departments | Exists |
| `/api/kudos` or `/api/kudos/highlights` | GET | Fetch kudos filtered by `department_id` query param | Exists (needs filter param) |

---

## Department Data

The full list of departments (from Figma spec, ~50 entries):

```
CTO, SPD, FCOV, CEVC1, CEVC2, STVC - R&D, CEVC2 - CySS, FCOV - LRM,
CEVC2 - System, OPDC - HRF, CEVC1 - DSV - UI/UX 1, CEVC1 - DSV, CEVEC,
OPDC - HRD - C&C, STVC, FCOV - F&A, CEVC1 - DSV - UI/UX 2, CEVC1 - AIE,
OPDC - HRF - C&B, FCOV - GA, FCOV - ISO, STVC - EE, GEU - HUST,
CEVEC - SAPD, OPDC - HRF - OD, CEVEC - GSD, GEU - TM, STVC - R&D - DTR,
STVC - R&D - DPS, CEVC3, STVC - R&D - AIR, CEVC4, PAO, GEU, GEU - DUT,
OPDC - HRD - L&D, OPDC - HRD - TI, OPDC - HRF - TA, GEU - UET,
STVC - R&D - SDX, OPDC - HRD - HRBP, PAO - PEC, IAV, STVC - Infra,
CPV - CGP, GEU - UIT, OPDC - HRD, BDV, CPV, PAO - PAO
```

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All ~50 departments render correctly in the scrollable dropdown list.
- **SC-002**: Selected department is visually highlighted with gold background + glow (matches Figma).
- **SC-003**: Selecting a department filters the Live Board content within 500ms.
- **SC-004**: Dropdown opens/closes smoothly (150ms transition).
- **SC-005**: Keyboard navigation works fully (Tab, ArrowUp/Down, Enter, Escape).
- **SC-006**: WCAG 2.1 AA color contrast compliance on all text elements.

---

## Out of Scope

- Search/filter within the department dropdown (type-ahead).
- Multi-select departments (only single selection).
- Department grouping or hierarchy display.
- Admin management of department list.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/contexts/api-docs.yaml`) — `/api/departments` endpoint needed
- [ ] Database design completed — `departments` table needed
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)
- [x] Design style documented (`design-style.md`)

---

## Notes

- A `FilterDropdown` component **already exists** at `src/components/kudos-live-board/filter-dropdown.tsx` and is already wired for department filtering in `highlight-section.tsx`. The primary task is to **update its styles** to match Figma, not create a new component.
- The Figma design shows 6 items but the data spec lists ~50 departments — implementation MUST handle scrolling with `overflow-y: auto` and `max-height`.
- The trigger button for this dropdown is part of the Live Board filter bar (frame `2940:13431`), not defined in this frame.
- Department data comes from the backend `departments` table via `GET /api/departments` (returns `{ data: { id, name }[] }`). The dropdown is data-driven.
- The existing `FilterDropdown` also handles the hashtag filter — any style changes MUST apply consistently to both usages.
