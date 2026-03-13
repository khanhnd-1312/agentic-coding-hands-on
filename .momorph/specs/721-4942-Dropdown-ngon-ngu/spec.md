# Feature Specification: Dropdown-ngon-ngu (Language Dropdown)

**Frame ID**: `721:4942`
**Frame Name**: `Dropdown-ngon-ngu`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-13
**Status**: Reviewed

---

## Overview

A language selector dropdown component that allows users to switch the application interface language between Vietnamese (VN) and English (EN). The dropdown displays country flags alongside language codes and visually distinguishes the currently selected language with a highlighted background. This component appears in the header area of the Login and Homepage screens as an overlay triggered by the language selector button.

**Design Reference**: ![Dropdown-ngon-ngu](assets/frame.png)

**Figma**: [View Frame](https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/721:4942)

### Existing Implementation

A `LanguageSelector` component already exists at `src/components/login/language-selector.tsx`. It includes the trigger button + dropdown panel as a single component. The current implementation uses **different styling** than the Figma design (e.g., grey border `#2E3940` instead of gold `#998C5F`, teal selected text `#15D5CA` instead of gold highlight background). **The Figma design is the source of truth** — the implementation must be updated to match.

### Related Specs

- **Login** (`specs/662-14387-Login/`): Defines the trigger button (A.2_Language) with chevron-down icon, 108x56px, ARIA attributes
- **Homepage SAA** (`specs/2167-9026-Homepage-SAA/`): Includes language switcher in header, z-index stacking (header z-40, overlays z-50+)

---

## User Scenarios & Testing

### User Story 1 - Switch Language (Priority: P1)

A user wants to change the application language from Vietnamese to English (or vice versa) so that they can use the interface in their preferred language.

**Why this priority**: Core functionality of the component. Without language switching, the component has no purpose.

**Independent Test**: Render the dropdown, click on a non-selected language option, verify the language updates and the dropdown closes.

**Acceptance Scenarios**:

1. **Given** the dropdown is open with VN selected, **When** the user clicks on "EN", **Then** the interface language switches to English, the selected highlight moves to EN, and the dropdown closes.
2. **Given** the dropdown is open with EN selected, **When** the user clicks on "VN", **Then** the interface language switches to Vietnamese, the selected highlight moves to VN, and the dropdown closes.
3. **Given** the dropdown is open, **When** the user clicks on the already-selected language, **Then** the dropdown closes without any language change.
4. **Given** the user selects "EN", **When** translations load, **Then** all visible UI text updates to English with no flash of untranslated content (FOUC).

---

### User Story 2 - Toggle Dropdown Visibility (Priority: P1)

A user wants to open and close the language dropdown so they can see the available language options.

**Why this priority**: The dropdown must be toggleable for the user to interact with it at all. Tied with US1 as both are essential.

**Independent Test**: Click the language trigger button, verify dropdown appears. Click again or click outside, verify dropdown closes.

**Acceptance Scenarios**:

1. **Given** the dropdown is closed, **When** the user clicks the language selector trigger (flag + language code + chevron-down in the header), **Then** the dropdown opens below the trigger showing all available language options.
2. **Given** the dropdown is open, **When** the user clicks the trigger again, **Then** the dropdown closes.
3. **Given** the dropdown is open, **When** the user clicks outside the dropdown area, **Then** the dropdown closes.
4. **Given** the dropdown is open, **When** the user presses the Escape key, **Then** the dropdown closes and focus returns to the trigger button.
5. **Given** the dropdown is open, **When** the user scrolls the page, **Then** the dropdown closes.

---

### User Story 3 - Persist Language Preference (Priority: P2)

A user wants their language selection to persist across page navigations and sessions so they don't have to re-select their language every time.

**Why this priority**: Important for UX but the component can function without persistence in MVP.

**Independent Test**: Select a language, navigate to another page, verify the language preference is retained.

**Acceptance Scenarios**:

1. **Given** the user selects "EN", **When** they navigate to another page, **Then** the interface remains in English.
2. **Given** the user selected "VN" in a previous session, **When** they return to the site, **Then** the interface loads in Vietnamese.
3. **Given** no language preference is stored, **When** the user visits the site, **Then** the default language is Vietnamese (VN).
4. **Given** the stored preference cookie is corrupted or invalid, **When** the page loads, **Then** the system falls back to Vietnamese (VN) as default.

---

### User Story 4 - Keyboard Navigation (Priority: P2)

A user who relies on keyboard navigation wants to use the language dropdown without a mouse.

**Why this priority**: Accessibility requirement per constitution (WCAG 2.1 AA). Important but secondary to core functionality.

**Independent Test**: Tab to the trigger, open with Enter/Space, navigate options with arrow keys, select with Enter.

**Acceptance Scenarios**:

1. **Given** focus is on the language trigger, **When** the user presses Enter or Space, **Then** the dropdown opens and focus moves to the currently selected option.
2. **Given** the dropdown is open, **When** the user presses ArrowDown, **Then** focus moves to the next language option (wrapping from last to first).
3. **Given** the dropdown is open, **When** the user presses ArrowUp, **Then** focus moves to the previous language option (wrapping from first to last).
4. **Given** focus is on a language option, **When** the user presses Enter or Space, **Then** that language is selected and the dropdown closes.
5. **Given** the dropdown is open, **When** the user presses Escape, **Then** the dropdown closes and focus returns to the trigger.
6. **Given** the dropdown is open, **When** the user presses Tab, **Then** the dropdown closes and focus moves to the next focusable element.

---

### Edge Cases

- What happens when the stored language preference is invalid or corrupted? System MUST fall back to VN (default).
- How does the dropdown behave when rendered in a narrow viewport (360px)? Dropdown position MUST NOT overflow the viewport — adjust position if needed.
- What if the trigger is near the bottom of the viewport? Dropdown SHOULD open upward if insufficient space below.
- What happens if the user rapidly toggles the dropdown? Animation must not glitch — use `pointer-events: none` during transition or debounce.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Trigger Button (in header) | Flag icon + language code ("VN"/"EN") + chevron-down icon, 108x56px | Click toggles dropdown. **Defined in Login/Homepage specs, not this frame.** |
| Dropdown Container | Dark background panel (#00070C) with gold border (#998C5F), 8px radius, 6px padding | Opens below trigger, closes on selection/outside click/Escape |
| Language Option (Selected) | Highlighted item with semi-transparent gold background `rgba(255,234,158,0.2)`, flag + code | Click closes dropdown (no change) |
| Language Option (Unselected) | Transparent background, flag + code | Click selects language and closes dropdown |
| Flag Icon | Country flag (VN: `flag-vn`, EN: `flag-en`) in 24x24 container, 20x15px actual flag | Non-interactive, visual indicator |
| Language Code | Bold white text label ("VN" or "EN"), Montserrat 16px/24px Bold | Non-interactive, visual label |

### Navigation Flow

- **Entry points**: Header language selector button on Login screen (`662:14387`) and Homepage SAA (`2167:9026`)
- **Behavior**: Opens as overlay below trigger, closes back to current screen with updated language
- **Triggers**: Click on language trigger button in header
- **Item order**: Fixed order — Vietnamese (VN) always first, English (EN) always second. The selected highlight moves to the active language; items do NOT reorder based on selection.

### Visual Requirements

> See [design-style.md](design-style.md) for complete visual specifications including colors, typography, spacing, and component states.

- **Positioning**: Absolutely positioned below trigger, z-index 100 (above header z-40)
- **Responsive**: Dropdown has fixed dimensions, positioned relative to trigger across all breakpoints
- **Animations**: Fade-in/out + scale with 150ms ease-out on open/close
- **Accessibility**: WCAG 2.1 AA — keyboard navigable, visible focus ring, ARIA listbox pattern

### ARIA Specification

| Attribute | Element | Value |
|-----------|---------|-------|
| `role` | Trigger button | `button` |
| `aria-haspopup` | Trigger button | `"listbox"` |
| `aria-expanded` | Trigger button | `{isOpen}` |
| `aria-label` | Trigger button | `"Select language"` (EN) / `"Chọn ngôn ngữ"` (VI) |
| `role` | Dropdown container | `"listbox"` |
| `aria-labelledby` | Dropdown container | `{triggerId}` |
| `role` | Each option | `"option"` |
| `aria-selected` | Each option | `true` / `false` |

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST display a dropdown with exactly two language options: Vietnamese (VN) and English (EN)
- **FR-002**: System MUST visually distinguish the currently selected language with a highlighted background (`rgba(255,234,158,0.2)`)
- **FR-003**: Users MUST be able to switch language by clicking on an unselected option
- **FR-004**: System MUST close the dropdown after a language selection is made
- **FR-005**: System MUST close the dropdown when the user clicks outside, presses Escape, or scrolls the page
- **FR-006**: System MUST persist the selected language preference in a cookie (key: `lang`, values: `vi` | `en`, max-age: 31536000 / 1 year, path: `/`)
- **FR-007**: System MUST apply the selected language to all translatable UI text across the application without full page reload
- **FR-008**: System MUST default to Vietnamese (`vi`) when no language preference is stored or when stored value is invalid

### Technical Requirements

- **TR-001**: Component MUST be a client component (`"use client"`) — no server-side data fetching needed
- **TR-002**: Component MUST use ARIA listbox pattern (see ARIA Specification table above)
- **TR-003**: Component MUST support full keyboard navigation (Enter, Space, ArrowUp, ArrowDown, Escape, Tab)
- **TR-004**: Language switching MUST NOT cause a full page reload — use client-side i18n context
- **TR-005**: Dropdown open/close MUST animate with 150ms ease-out transition (opacity + transform)
- **TR-006**: Dropdown MUST render at z-index 100 to appear above the fixed header (z-40)
- **TR-007**: Component MUST use existing `LanguagePreference` type from `@/types/login`
- **TR-008**: Component MUST use existing `<Icon>` component from `@/components/ui/icon` for flag rendering
- **TR-009**: Component MUST integrate with existing i18n dictionaries (`@/i18n/homepage.ts`, `@/i18n/countdown-prelaunch.ts`)

### Key Entities

- **Language**: Code (`vi` | `en`), display label (`VN` | `EN`), flag icon name (`flag-vn` | `flag-en`), fixed display order: VN first, EN second
- **LanguagePreference** (existing type): `"vi" | "en"` — defined in `src/types/login.ts`
- **Language Preference Cookie**: `lang=vi|en; path=/; max-age=31536000`

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| (none) | - | This is a purely client-side component | - |

**Note**: Language switching is handled entirely on the client side. No API calls are needed. Translation strings are bundled with the application via i18n dictionary files.

---

## State Management

### Local State

| State | Type | Default | Description |
|-------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Whether the dropdown panel is visible |

### Props (from parent)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `lang` | `LanguagePreference` | Yes | Currently selected language |
| `onLangChange` | `(lang: LanguagePreference) => void` | Yes | Callback when language changes |

### Side Effects

- On language change: set cookie `lang={value}; path=/; max-age=31536000`
- On language change: call `onLangChange` prop so parent can update i18n context

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Language switches in < 100ms with no visible flash of untranslated content
- **SC-002**: Dropdown opens/closes smoothly with 150ms animation, no layout shift
- **SC-003**: All interactive elements are keyboard-accessible and have visible focus indicators
- **SC-004**: Language preference persists across page navigations and browser sessions via cookie
- **SC-005**: Component passes `axe-core` accessibility audit with zero violations

---

## Out of Scope

- Adding more languages beyond VN and EN (future enhancement)
- Server-side language detection based on browser `Accept-Language` header
- URL-based locale routing (e.g., `/en/`, `/vi/`) — may be added in a future iteration
- Right-to-left (RTL) language support
- The trigger button itself (defined in Login and Homepage header specs)

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`) — not needed for this component
- [ ] Database design completed (`.momorph/database.sql`) — not needed for this component
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)
- [x] i18n infrastructure exists (`src/i18n/homepage.ts`, `src/i18n/countdown-prelaunch.ts`)
- [x] `LanguagePreference` type exists (`src/types/login.ts`)
- [x] `Icon` component exists (`src/components/ui/icon.tsx`) — `flag-vn` available
- [ ] `flag-en` icon MUST be added to `Icon` component (currently missing — only `flag-vn` exists)
- [x] `LanguageSelector` component exists (`src/components/login/language-selector.tsx`) — needs visual update to match Figma

---

## Notes

- This component is referenced by both the Login screen (`662:14387`) and Homepage SAA (`2167:9026`) as a shared header overlay
- The dropdown trigger button is NOT part of this frame — it lives in the header of each screen (includes flag + language code + chevron-down icon). This spec covers only the dropdown panel itself
- Per SCREENFLOW.md, language preference is stored via cookie with key `lang`
- The Figma design shows VN as the selected state — this is the default language
- Flag icons should use the existing `<Icon>` component (component set `178:1020`)
- Font: Montserrat Bold 16px is used for language codes — already available in project fonts at `src/fonts/`
- **Implementation gap**: The existing `LanguageSelector` component styling diverges from Figma — it uses `bg-[rgba(11,15,18,0.95)]` + `border-[#2E3940]` instead of Figma's `#00070C` + `#998C5F`. Selected state uses teal text (`#15D5CA`) instead of golden bg highlight (`rgba(255,234,158,0.2)`). Update required.
