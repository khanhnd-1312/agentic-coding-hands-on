# Tasks: Dropdown-profile (Profile Dropdown)

**Frame**: `721:5223-Dropdown-profile`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [x] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3, US4)
- **|**: File path affected by this task

---

## Phase 1: Foundation (Blocking Prerequisites)

**Purpose**: Refactor Header to support mutually exclusive dropdowns. Refactor LanguageSelector to accept controlled mode. This BLOCKS all user story work.

**Why foundation**: ProfileDropdown must receive `isOpen`/`onToggle` controlled props from Header. LanguageSelector must also be refactored to controlled mode for mutual exclusivity (FR-007). These changes must land first.

- [x] T001 Write failing tests for LanguageSelector controlled mode: verify it accepts optional `isOpen`/`onToggle` props, uses them when present, falls back to internal state when absent (backward-compatible). Verify all existing tests still pass. | `src/components/login/language-selector.test.tsx`
- [x] T002 Refactor LanguageSelector to support controlled mode: add optional props `isOpen?: boolean`, `onToggle?: (open: boolean) => void`. When props present: use them. When absent: use internal `useState` (backward-compat). No visual changes. | `src/components/login/language-selector.tsx`
- [x] T003 Write failing tests for Header dropdown coordination: only one dropdown open at a time. When language dropdown is open and avatar trigger clicked, language dropdown closes and profile dropdown opens. When profile dropdown is open and language trigger clicked, profile dropdown closes. | `src/components/homepage/header.test.tsx`
- [x] T004 Add `openDropdown` state to Header: `useState<"lang" | "profile" | null>(null)`. Wire LanguageSelector with `isOpen={openDropdown === "lang"}` and `onToggle={(open) => setOpenDropdown(open ? "lang" : null)}`. Avatar button remains as-is (placeholder for Phase 2). Verify T003 tests pass. | `src/components/homepage/header.tsx`

**Checkpoint**: Header manages dropdown state. LanguageSelector works in controlled mode. All existing tests pass. Foundation ready — user story phases can begin.

---

## Phase 2: US3 Toggle Dropdown + US1 Navigate to Profile (Priority: P1)

**Goal**: Build the ProfileDropdown component with open/close toggle, backdrop close, Escape close, profile navigation, ARIA menu pattern, and visual styling from design-style.md. Wire into Header.

**Independent Test**: Click avatar → dropdown opens with "Profile" and "Logout" items. Click "Profile" → navigates to `/profile`, dropdown closes. Click outside → dropdown closes. Press Escape → dropdown closes and focus returns to trigger.

### Tests (US3 + US1)

- [x] T005 [US3] Write failing test: clicking avatar trigger calls `onToggle(true)` — dropdown panel becomes visible | `src/components/homepage/profile-dropdown.test.tsx`
- [x] T006 [US3] Write failing test: clicking avatar trigger again calls `onToggle(false)` — dropdown closes | `src/components/homepage/profile-dropdown.test.tsx`
- [x] T007 [US3] Write failing test: clicking backdrop (fixed overlay) calls `onToggle(false)` | `src/components/homepage/profile-dropdown.test.tsx`
- [x] T008 [US3] Write failing test: pressing Escape closes dropdown and returns focus to trigger button | `src/components/homepage/profile-dropdown.test.tsx`
- [x] T009 [US3] Write failing test: dropdown renders `role="menu"` on panel, `role="menuitem"` on each item, `aria-haspopup="menu"` and `aria-expanded` on trigger | `src/components/homepage/profile-dropdown.test.tsx`
- [x] T010 [US1] Write failing test: clicking "Profile" menuitem calls `router.push('/profile')` and `onToggle(false)` | `src/components/homepage/profile-dropdown.test.tsx`

### Implementation (US3 + US1)

- [x] T011 [US3] Create ProfileDropdown component skeleton: `"use client"`, props `isOpen: boolean`, `onToggle: (open: boolean) => void`. Render trigger button (avatar icon with gold border `#998C5F`, `user-avatar` icon size 24, `aria-haspopup="menu"`, `aria-expanded={isOpen}`, `aria-label="User menu"`). Conditionally render dropdown panel + backdrop when `isOpen`. | `src/components/homepage/profile-dropdown.tsx`
- [x] T012 [US3] Implement backdrop overlay: `<div className="fixed inset-0 z-[99]" onClick={() => onToggle(false)} />` rendered when `isOpen`. Add Escape key listener via `useEffect` on document `keydown` — close and return focus to trigger via `triggerRef`. | `src/components/homepage/profile-dropdown.tsx`
- [x] T013 [US3] Implement dropdown panel with design-style.md visual specs: `<div role="menu" aria-labelledby={triggerId}>` with classes `flex flex-col p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg z-[100] absolute right-0 mt-1`. Add animation: `transition-[opacity,transform] duration-150 ease-out origin-top`. When open: `opacity-100 scale-y-100`. When closed (but still in DOM for animation): `opacity-0 scale-y-[0.95] pointer-events-none`. | `src/components/homepage/profile-dropdown.tsx`
- [x] T014 [US1] Implement Profile menuitem: `<button role="menuitem" tabIndex={-1}>` with classes `w-[121px] h-14 bg-[rgba(255,234,158,0.1)] rounded p-4 flex items-center gap-1 cursor-pointer focus:outline-2 focus:outline-[#998C5F] focus:-outline-offset-2`. Inner: `<span>` with `font-montserrat text-base font-bold text-white tracking-[0.15px] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]` text "Profile" + `<Icon name="user-avatar" size={24} />`. onClick: `router.push('/profile')` then `onToggle(false)`. | `src/components/homepage/profile-dropdown.tsx`
- [x] T015 [US3] Implement Logout menuitem (placeholder — no signOut yet): `<button role="menuitem" tabIndex={-1}>` with classes `w-[121px] h-14 bg-transparent hover:bg-[rgba(255,234,158,0.1)] rounded p-4 flex items-center gap-1 cursor-pointer text-white focus:outline-2 focus:outline-[#998C5F] focus:-outline-offset-2`. Inner: `<span>` with `font-montserrat text-base font-bold text-white tracking-[0.15px]` text "Logout" + `<Icon name="chevron-right" size={24} />`. onClick: `onToggle(false)` (placeholder, wired in Phase 3). | `src/components/homepage/profile-dropdown.tsx`
- [x] T016 [US3] Wire ProfileDropdown into Header: replace the existing avatar button (lines 120-134) with `<ProfileDropdown isOpen={openDropdown === "profile"} onToggle={(open) => setOpenDropdown(open ? "profile" : null)} />`. Verify T003 mutual exclusivity tests pass. | `src/components/homepage/header.tsx`
- [x] T017 [US3] Run all tests — verify T005-T010 pass, existing header and language-selector tests pass | `src/components/homepage/profile-dropdown.test.tsx`

**Checkpoint**: US3 (scenarios 1-4, 6) + US1 (scenarios 1, 3) pass. Dropdown opens/closes with animation, navigates to /profile, mutual exclusivity works. Logout button renders but has no signOut logic yet.

---

## Phase 3: US2 Logout (Priority: P1)

**Goal**: Wire Logout button to `supabase.auth.signOut()`. Add loading state during signOut. Show error Toast on failure. Redirect to `/login` on success.

**Independent Test**: Click "Logout" → loading state appears → redirected to `/login`. If signOut fails → error toast shown, user stays on page.

### Tests (US2)

- [x] T018 [US2] Write failing test: clicking "Logout" calls `supabase.auth.signOut()` (mock `@/libs/supabase/client` with `vi.mock`) | `src/components/homepage/profile-dropdown.test.tsx`
- [x] T019 [US2] Write failing test: after successful signOut, `router.push('/login')` is called | `src/components/homepage/profile-dropdown.test.tsx`
- [x] T020 [US2] Write failing test: while signOut is processing, Logout button has `opacity-50 cursor-not-allowed pointer-events-none` and is `disabled` — prevents double-click | `src/components/homepage/profile-dropdown.test.tsx`
- [x] T021 [US2] Write failing test: when signOut rejects with error, Toast renders with error message `"Đăng xuất thất bại. Vui lòng thử lại."`, user remains on current page | `src/components/homepage/profile-dropdown.test.tsx`

### Implementation (US2)

- [x] T022 [US2] Add `isLoggingOut` and `error` state to ProfileDropdown. Implement `handleLogout`: `setIsLoggingOut(true)` → `createClient().auth.signOut()` → on success `router.push('/login')` → on error `setError('Đăng xuất thất bại. Vui lòng thử lại.')` and `setIsLoggingOut(false)`. Wire to Logout button onClick. | `src/components/homepage/profile-dropdown.tsx`
- [x] T023 [US2] Add loading visual state to Logout menuitem: when `isLoggingOut` is true, add `opacity-50 cursor-not-allowed pointer-events-none` classes and set `disabled` attribute | `src/components/homepage/profile-dropdown.tsx`
- [x] T024 [US2] Add Toast for error feedback: import `Toast` from `@/components/kudos-live-board/toast`. Render `<Toast message={error} onDismiss={() => setError(null)} duration={3000} />` conditionally when `error` is not null. Place outside the dropdown panel so it persists after dropdown closes. | `src/components/homepage/profile-dropdown.tsx`
- [x] T025 [US2] Run all tests — verify T018-T021 pass, all previous tests still pass | `src/components/homepage/profile-dropdown.test.tsx`

**Checkpoint**: US2 (all 3 scenarios) pass. Logout works end-to-end with loading state and error handling.

---

## Phase 4: US4 Keyboard Navigation (Priority: P2)

**Goal**: Full ARIA menu keyboard support — Enter/Space to open, ArrowDown/ArrowUp to navigate (wrapping), Enter/Space to activate, Escape to close, Tab to close.

**Independent Test**: Tab to avatar → Enter opens dropdown, focus on first item → ArrowDown moves to Logout → Enter triggers logout → Escape closes and returns focus.

### Tests (US4)

- [x] T026 [US4] Write failing test: pressing Enter on trigger opens dropdown and focuses first menuitem ("Profile") | `src/components/homepage/profile-dropdown.test.tsx`
- [x] T027 [US4] Write failing test: pressing Space on trigger opens dropdown and focuses first menuitem | `src/components/homepage/profile-dropdown.test.tsx`
- [x] T028 [US4] Write failing test: pressing ArrowDown moves focus to next menuitem (wraps from Logout back to Profile) | `src/components/homepage/profile-dropdown.test.tsx`
- [x] T029 [US4] Write failing test: pressing ArrowUp moves focus to previous menuitem (wraps from Profile to Logout) | `src/components/homepage/profile-dropdown.test.tsx`
- [x] T030 [US4] Write failing test: pressing Enter on focused menuitem triggers its action (Profile → navigate, Logout → signOut) | `src/components/homepage/profile-dropdown.test.tsx`
- [x] T031 [US4] Write failing test: pressing Tab closes dropdown and moves focus to next focusable element | `src/components/homepage/profile-dropdown.test.tsx`

### Implementation (US4)

- [x] T032 [US4] Add `focusedIndex` state (`-1` default) and `menuItemRefs = useRef<(HTMLButtonElement | null)[]>([null, null])`. Add `useEffect` that auto-focuses `menuItemRefs.current[focusedIndex]` when `focusedIndex >= 0` and `isOpen`. | `src/components/homepage/profile-dropdown.tsx`
- [x] T033 [US4] Implement `handleTriggerKeyDown`: on Enter/Space → `onToggle(true)`, `setFocusedIndex(0)`, `preventDefault()`. Attach to trigger button `onKeyDown`. | `src/components/homepage/profile-dropdown.tsx`
- [x] T034 [US4] Implement `handleMenuKeyDown` on the `role="menu"` container: ArrowDown → `setFocusedIndex((prev) => (prev + 1) % 2)`, ArrowUp → `setFocusedIndex((prev) => (prev - 1 + 2) % 2)`, Enter/Space → call action for `focusedIndex` (0 = profile nav, 1 = logout), Escape → `onToggle(false)` + focus trigger, Tab → `onToggle(false)`. All arrow keys call `preventDefault()`. | `src/components/homepage/profile-dropdown.tsx`
- [x] T035 [US4] Set `tabIndex` on menuitems: `tabIndex={focusedIndex === idx ? 0 : -1}`. Reset `focusedIndex` to `-1` when dropdown closes. | `src/components/homepage/profile-dropdown.tsx`
- [x] T036 [US4] Run all tests — verify T026-T031 pass, all previous tests still pass | `src/components/homepage/profile-dropdown.test.tsx`

**Checkpoint**: US4 (all 6 scenarios) pass. Full keyboard accessibility.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Remaining edge cases, scroll-close behavior, redundant navigation prevention, responsive verification, accessibility audit.

- [x] T037 Write failing test: window scroll event closes dropdown (calls `onToggle(false)`) | `src/components/homepage/profile-dropdown.test.tsx`
- [x] T038 Write failing test: clicking "Profile" when `pathname === '/profile'` closes dropdown without calling `router.push` (no redundant navigation) | `src/components/homepage/profile-dropdown.test.tsx`
- [x] T039 Implement scroll-close: add `useEffect` when `isOpen` → `window.addEventListener('scroll', () => onToggle(false))`. Cleanup on close/unmount. | `src/components/homepage/profile-dropdown.tsx`
- [x] T040 Implement redundant navigation prevention: use `usePathname()` from `next/navigation`. In Profile click handler, check `if (pathname !== '/profile') router.push('/profile')`. Always close dropdown. | `src/components/homepage/profile-dropdown.tsx`
- [x] T041 Run `axe-core` accessibility audit on ProfileDropdown: add test with `vitest-axe` or `jest-axe` — expect zero violations. Verify `role="menu"`, `role="menuitem"`, `aria-haspopup`, `aria-expanded`, `tabIndex` roving, focus ring visibility. | `src/components/homepage/profile-dropdown.test.tsx`
- [x] T042 Manual responsive verification: open dropdown at 360px, 768px, 1440px. Verify dropdown does not overflow viewport right edge. Verify animation is smooth. Verify text glow renders correctly. Screenshot results. | (manual)
- [x] T043 Run full test suite: `yarn lint && yarn build` — must pass with zero errors per constitution PR checklist. | (terminal)

**Checkpoint**: All edge cases pass. Accessibility audit clean. Build passes.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Foundation ← No dependencies (start immediately)
  │
  ▼
Phase 2: US3+US1 ← Depends on Phase 1 (needs openDropdown state in Header)
  │
  ▼
Phase 3: US2 ← Depends on Phase 2 (needs Logout button to exist)
  │
  ▼
Phase 4: US4 ← Depends on Phase 2 (needs dropdown + menuitems to exist)
  │         ⚡ Can run in PARALLEL with Phase 3 (different concerns, same file)
  ▼
Phase 5: Polish ← Depends on Phase 3 + Phase 4 (all features must exist)
```

### Parallel Opportunities

| Tasks | Why Parallel | Constraint |
|-------|-------------|------------|
| T001 + T003 | Different test files (language-selector.test vs header.test) | None |
| T005-T010 | All write to same test file but are independent test cases | Write sequentially within file |
| Phase 3 + Phase 4 | Different concerns (signOut logic vs keyboard nav) | Both modify `profile-dropdown.tsx` — coordinate or sequence |
| T037 + T038 | Independent test cases | Same test file — write sequentially |

### Within Each Phase

1. Tests MUST be written and FAIL before implementation (TDD per constitution)
2. Implementation tasks are sequential within each phase (same file)
3. Final "run all tests" task validates the phase

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 (Foundation) — ~4 tasks
2. Complete Phase 2 (US3 Toggle + US1 Profile Nav) — ~13 tasks
3. **STOP and VALIDATE**: Dropdown opens/closes, navigates to /profile, mutual exclusivity works
4. This is a usable MVP — Logout placeholder closes dropdown, keyboard nav not yet implemented

### Incremental Delivery

1. Phase 1 → Foundation ready
2. Phase 2 → US3+US1 complete → **Deployable MVP**
3. Phase 3 → US2 Logout works → Deploy
4. Phase 4 → US4 Keyboard nav → Deploy
5. Phase 5 → Polish + a11y audit → Deploy

---

## Summary

| Metric | Value |
|--------|-------|
| **Total tasks** | 43 |
| **Phase 1 (Foundation)** | 4 tasks |
| **Phase 2 (US3+US1)** | 13 tasks |
| **Phase 3 (US2)** | 8 tasks |
| **Phase 4 (US4)** | 11 tasks |
| **Phase 5 (Polish)** | 7 tasks |
| **New files** | 2 (`profile-dropdown.tsx`, `profile-dropdown.test.tsx`) |
| **Modified files** | 4 (`header.tsx`, `header.test.tsx`, `language-selector.tsx`, `language-selector.test.tsx`) |
| **MVP scope** | Phase 1 + Phase 2 (17 tasks) |
| **Parallel opportunities** | Phase 3 ⚡ Phase 4; T001 ⚡ T003 |

---

## Notes

- Commit after each phase (or each logical group within a phase)
- Run tests before moving to next phase
- Mark tasks complete as you go: `[x]`
- Constitution requires `yarn lint && yarn build` pass before any commit
- The `/profile` route does not exist yet — navigation will 404 until profile feature is built. This is expected and documented in plan.md.
