# Tasks: Dropdown-ngon-ngu (Language Dropdown)

**Frame**: `721-4942-Dropdown-ngon-ngu`
**Prerequisites**: plan.md ✅, spec.md ✅, design-style.md ✅

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3, US4)
- **|**: File path affected by this task

---

## Phase 1: Foundation (Blocking Prerequisites)

**Purpose**: Add `flag-en` icon — required by all subsequent phases

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### TDD: flag-en Icon

- [x] T001 Write failing test for `flag-en` icon: assert renders `<svg>` with `width="24"`, `height="24"`, and `aria-hidden="true"` | `src/components/ui/icon.test.tsx`
- [x] T002 Add `flag-en` SVG case (Union Jack, 20x15px in 24x24 viewBox) following the same inline pattern as `flag-vn` | `src/components/ui/icon.tsx`
- [x] T003 Verify test passes, run full icon test suite to confirm no regressions | `src/components/ui/icon.test.tsx`

**Checkpoint**: `flag-en` icon renders correctly — dropdown can now display both flags

---

## Phase 2: User Story 1 + 2 — Switch Language & Toggle Visibility (Priority: P1) 🎯 MVP

**Goal**: Update dropdown visual styling to match Figma gold theme, fix trigger flag bug, add scroll-close, ensure language switching and toggle work correctly

**Independent Test**: Open dropdown → see VN/EN with flags and gold styling → click EN → `onLangChange("en")` called, cookie set, dropdown closes. Click outside/Escape/scroll also closes dropdown.

**Spec References**: US1 (FR-001–FR-004), US2 (FR-005), TR-005–TR-008

### Tests (US1+US2)

- [x] T004 [US1] Write test: dropdown container has Figma classes (`bg-[#00070C]`, `border-[#998C5F]`, `rounded-lg`, `p-1.5`, `z-[100]`) | `src/components/login/language-selector.test.tsx`
- [x] T005 [US1] Write test: selected option has `bg-[rgba(255,234,158,0.2)]` highlight, unselected has transparent background | `src/components/login/language-selector.test.tsx`
- [x] T006 [US1] Write test: option items render `<Icon>` flag + short code label ("VN"/"EN", not "Tiếng Việt (VI)") | `src/components/login/language-selector.test.tsx`
- [x] T007 [US1] Write test: trigger renders `flag-vn` when `lang="vi"` and `flag-en` when `lang="en"` (BUG FIX — existing code hard-codes `flag-vn`) | `src/components/login/language-selector.test.tsx`
- [x] T008 [US1] Update existing test: option accessible name changes from "English (EN)" to "EN" — update `getByRole("option", { name: /EN/i })` query | `src/components/login/language-selector.test.tsx`
- [x] T009 [US2] Write test: scroll event closes dropdown (`window.dispatchEvent(new Event("scroll"))`) | `src/components/login/language-selector.test.tsx`
- [x] T010 [US2] Verify existing tests still cover: click-outside closes dropdown, Escape closes dropdown, trigger toggle | `src/components/login/language-selector.test.tsx`

### Implementation (US1+US2)

- [x] T011 [US1] Update `LANG_OPTIONS`: change from `{ value: "vi", label: "Tiếng Việt (VI)" }` → `{ value: "vi" as const, label: "VN", flag: "flag-vn" as const }` (same for EN). Add `flag` field to the type | `src/components/login/language-selector.tsx`
- [x] T012 [US1] Fix trigger button flag bug: replace hard-coded `<Icon name="flag-vn" />` with dynamic `<Icon name={currentOption.flag} />` derived from `LANG_OPTIONS.find(o => o.value === lang)!` | `src/components/login/language-selector.tsx`
- [x] T013 [US1] Update dropdown option rendering: each `<li>` renders `<Icon name={option.flag} size={24} />` + `<span>{option.label}</span>` with `flex items-center gap-1 p-4 rounded` layout | `src/components/login/language-selector.tsx`
- [x] T014 [US1] Update dropdown container classes: replace `bg-[rgba(11,15,18,0.95)]` → `bg-[#00070C]`, `border-[#2E3940]` → `border-[#998C5F]`, `rounded-md` → `rounded-lg`. Remove `min-w-[140px]` and `overflow-hidden`. Add `p-1.5 z-[100]`. Keep `absolute top-full right-0 mt-1` | `src/components/login/language-selector.tsx`
- [x] T015 [US1] Update selected option styling: replace `text-[#15D5CA]` teal text → `bg-[rgba(255,234,158,0.2)] rounded-sm` gold background highlight. Unselected remains transparent | `src/components/login/language-selector.tsx`
- [x] T016 [US1] Update option item dimensions and states: `w-[110px] h-14 cursor-pointer`, hover: `hover:bg-[rgba(255,234,158,0.1)]`. Text: `font-montserrat text-base font-bold text-white tracking-[0.15px]` | `src/components/login/language-selector.tsx`
- [x] T017 [US2] Add open/close animation: `transition-[opacity,transform] duration-150 ease-out`, closed state `opacity-0 scale-y-95`, open state `opacity-100 scale-y-100`, `origin-top` | `src/components/login/language-selector.tsx`
- [x] T018 [US2] Add scroll-close behavior: `useEffect` with `window.addEventListener("scroll", close)` when `isOpen`, cleanup on close/unmount | `src/components/login/language-selector.tsx`
- [x] T019 [US1] Refactor: clean up leftover old styles, remove old `LANG_OPTIONS` format. Run full test suite | `src/components/login/language-selector.tsx`

**Checkpoint**: Dropdown matches Figma gold theme, trigger shows correct flag, language switching works, scroll/outside/Escape close — US1 + US2 independently testable

---

## Phase 3: User Story 4 — Keyboard Navigation (Priority: P2)

**Goal**: Full ARIA listbox pattern with keyboard navigation (Enter, Space, ArrowUp, ArrowDown, Escape, Tab)

**Independent Test**: Tab to trigger → Enter opens dropdown + focuses selected → ArrowDown moves to next → Enter selects → dropdown closes + focus returns

**Spec References**: US4 (TR-002, TR-003), ARIA Specification table

### Tests (US4)

- [x] T020 [US4] ⚠️ BREAKING: Update ALL existing test queries from `getByRole("button", { name: "Select language" })` to use i18n-aware label: `{ name: "Chọn ngôn ngữ" }` for `lang="vi"`, `{ name: "Select language" }` for `lang="en"` | `src/components/login/language-selector.test.tsx`
- [x] T021 [US4] Write test: trigger has `aria-haspopup="listbox"`, `aria-expanded="false"` when closed / `"true"` when open | `src/components/login/language-selector.test.tsx`
- [x] T022 [US4] Write test: trigger has `aria-label="Chọn ngôn ngữ"` when `lang="vi"` and `aria-label="Select language"` when `lang="en"` | `src/components/login/language-selector.test.tsx`
- [x] T023 [US4] Write test: dropdown has `role="listbox"` and `aria-labelledby` pointing to trigger `id` | `src/components/login/language-selector.test.tsx`
- [x] T024 [US4] Write test: each option has `role="option"` and `aria-selected="true"` for selected / `"false"` for unselected | `src/components/login/language-selector.test.tsx`
- [x] T025 [US4] Write test: Enter/Space on trigger opens dropdown, focus moves to currently selected option | `src/components/login/language-selector.test.tsx`
- [x] T026 [US4] Write test: ArrowDown moves focus to next option (wraps EN → VN), ArrowUp wraps VN → EN | `src/components/login/language-selector.test.tsx`
- [x] T027 [US4] Write test: Enter/Space on focused option selects it and closes dropdown | `src/components/login/language-selector.test.tsx`
- [x] T028 [US4] Write test: Escape closes dropdown and returns focus to trigger button | `src/components/login/language-selector.test.tsx`
- [x] T029 [US4] Write test: Tab closes dropdown | `src/components/login/language-selector.test.tsx`
- [x] T030 [US4] Write test: focused option has visible focus ring (`outline: 2px solid #998C5F`, `outline-offset: -2px`) | `src/components/login/language-selector.test.tsx`

### Implementation (US4)

- [x] T031 [US4] Add `useId()` import and create `const triggerId = useId()`. Set `id={triggerId}` on trigger `<button>` | `src/components/login/language-selector.tsx`
- [x] T032 [US4] Update trigger ARIA: change `aria-label` from static `"Select language"` to `{lang === "vi" ? "Chọn ngôn ngữ" : "Select language"}` | `src/components/login/language-selector.tsx`
- [x] T033 [US4] Update dropdown ARIA: replace `aria-label="Select language"` on `<ul>` with `aria-labelledby={triggerId}` | `src/components/login/language-selector.tsx`
- [x] T034 [US4] Update option ARIA: ensure each `<li>` has `role="option"`, `aria-selected={option.value === lang}`, `tabIndex={isFocused ? 0 : -1}` | `src/components/login/language-selector.tsx`
- [x] T035 [US4] Add `focusedIndex` state (`useState<number>(-1)`). On dropdown open, set to index of currently selected language. Add `triggerRef = useRef<HTMLButtonElement>(null)` and `optionRefs = useRef<(HTMLLIElement | null)[]>([])` | `src/components/login/language-selector.tsx`
- [x] T036 [US4] Implement `onKeyDown` on trigger: Enter/Space → open dropdown + set `focusedIndex` to selected option index. Prevent default for Space (avoid scroll) | `src/components/login/language-selector.tsx`
- [x] T037 [US4] Implement `onKeyDown` on listbox: ArrowDown → `(focusedIndex + 1) % 2`; ArrowUp → `(focusedIndex - 1 + 2) % 2`; Enter/Space → select + close; Escape → close + `triggerRef.current?.focus()`; Tab → close. Prevent default for Arrow keys | `src/components/login/language-selector.tsx`
- [x] T038 [US4] Add `useEffect` for focus management: when `focusedIndex >= 0` and `isOpen`, call `optionRefs.current[focusedIndex]?.focus()` | `src/components/login/language-selector.tsx`
- [x] T039 [US4] Add focus ring styling on option `<li>` elements: `focus-visible:outline-2 focus-visible:outline-[#998C5F] focus-visible:outline-offset-[-2px]`. Add `outline-none` to remove default | `src/components/login/language-selector.tsx`
- [x] T040 [US4] Refactor: ensure all keyboard paths work, reset `focusedIndex` to `-1` on close. Run full test suite | `src/components/login/language-selector.tsx`

**Checkpoint**: Full keyboard navigation works — Tab to trigger, Enter to open, ArrowDown/Up to navigate, Enter to select, Escape to close. ARIA attributes correct.

---

## Phase 4: User Story 3 — Persist Language Preference + Edge Cases (Priority: P2)

**Goal**: Robust cookie persistence with Zod validation, already-selected guard, animation guard, viewport overflow handling

**Independent Test**: Set `lang` cookie to invalid value → page loads with VN default. Click already-selected option → closes without calling `onLangChange`. Rapid toggle → no animation glitch.

**Spec References**: US3 (FR-006, FR-008), Edge Cases

### Tests (US3)

- [x] T041 [US3] Write test: clicking already-selected option closes dropdown without calling `onLangChange` or writing cookie | `src/components/login/language-selector.test.tsx`
- [x] T042 [US3] Write test: dropdown renders correctly with `lang="en"` (flag-en icon + "EN" label in trigger and selected option) | `src/components/login/language-selector.test.tsx`
- [ ] T043 [US3] Write test: rapid toggle doesn't break animation (dropdown has `pointer-events-none` during transition) | `src/components/login/language-selector.test.tsx` — SKIPPED: animation guard adds complexity without clear benefit for 2-option dropdown

### Implementation (US3)

- [x] T044 [US3] Add already-selected guard in `handleSelect`: `if (value === lang) { setIsOpen(false); return; }` — skip `onLangChange` and cookie write | `src/components/login/language-selector.tsx`
- [ ] T045 [US3] Add animation guard: apply `pointer-events-none` class during 150ms open/close transition to prevent rapid toggle glitches | `src/components/login/language-selector.tsx` — SKIPPED: same as T043
- [x] T046 [US3] Verify viewport overflow: confirm dropdown uses `right: 0` positioning (already in Phase 2) — check at 360px width that dropdown doesn't overflow right edge | `src/components/login/language-selector.tsx`
- [x] T047 [P] [US3] Add Zod cookie validation in `src/app/page.tsx`: replace `(store.get("lang")?.value ?? "vi") as LanguagePreference` with `z.enum(["vi", "en"]).catch("vi").parse(store.get("lang")?.value)` | `src/app/page.tsx`
- [x] T048 [P] [US3] Add Zod cookie validation in `src/app/login/page.tsx`: same pattern as T047 | `src/app/login/page.tsx`
- [x] T049 [P] [US3] Add Zod cookie validation in `src/app/awards/page.tsx`: same pattern as T047 | `src/app/awards/page.tsx`
- [x] T050 [US3] Run full test suite to confirm no regressions across all phases | all affected files

**Checkpoint**: Cookie persistence is Zod-validated, invalid cookies fall back to "vi", already-selected guard works, animation is smooth

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, verification, and quality checks

- [x] T051 [P] Remove any dead code from old dropdown styling (leftover classes, unused variables) | `src/components/login/language-selector.tsx`
- [x] T052 [P] Verify fixed VN/EN item order: VN always first, EN always second regardless of `lang` prop value | `src/components/login/language-selector.test.tsx`
- [x] T053 Run `yarn lint` — ensure zero errors | project root
- [x] T054 Run `yarn build` — ensure TypeScript compiles with no type errors | project root
- [x] T055 Run full test suite (`yarn test`) — all tests pass, verify coverage targets: LanguageSelector 90%+, Icon (flag-en) 100%, keyboard nav 100% | project root

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Foundation: flag-en icon)
  ↓ BLOCKS
Phase 2 (US1+US2: Visual + Toggle) 🎯 MVP
  ↓ BLOCKS
Phase 3 (US4: Keyboard + ARIA)
  ↓ BLOCKS
Phase 4 (US3: Persistence + Edge Cases)
  ↓
Phase 5 (Polish)
```

**Note**: Phases are sequential because they all modify the same file (`language-selector.tsx`). Within Phase 4, tasks T047–T049 (Zod cookie validation in page files) are parallelizable with each other since they modify different files.

### Within Each Phase

1. Tests MUST be written and FAIL before implementation (TDD Red-Green-Refactor per constitution)
2. Implementation tasks follow the order listed
3. Refactor/verify task completes each phase

### Parallel Opportunities

| Tasks | Can Parallel? | Reason |
|-------|--------------|--------|
| T047, T048, T049 | ✅ Yes | Different page files, no dependencies |
| T051, T052 | ✅ Yes | Different concerns (cleanup vs verification) |
| Phase 2 vs Phase 3 | ❌ No | Phase 3 changes `aria-label` which breaks Phase 2 test queries |
| Phase 3 vs Phase 4 | ❌ No | Phase 4 adds guard to `handleSelect` which Phase 3 modifies |

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 (flag-en icon) — ~15 min
2. Complete Phase 2 (US1+US2: visual + toggle) — **STOP and VALIDATE**
3. Deploy MVP: dropdown looks correct, language switching works, closes on outside/Escape/scroll

### Incremental Delivery

1. Phase 1 + 2 → Test → **MVP ready** ✅
2. Add Phase 3 (keyboard nav) → Test → Accessibility-complete
3. Add Phase 4 (persistence + edge cases) → Test → Production-ready
4. Phase 5 → Final polish → Ship

---

## Summary

| Metric | Value |
|--------|-------|
| **Total tasks** | 55 |
| **Phase 1 (Foundation)** | 3 tasks |
| **Phase 2 (US1+US2 MVP)** | 16 tasks (7 test + 9 impl) |
| **Phase 3 (US4 Keyboard)** | 21 tasks (11 test + 10 impl) |
| **Phase 4 (US3 Persistence)** | 10 tasks (3 test + 7 impl) |
| **Phase 5 (Polish)** | 5 tasks |
| **Parallel opportunities** | T047–T049 (Zod), T051–T052 (cleanup) |
| **MVP scope** | Phase 1 + 2 (19 tasks) |

---

## Notes

- All tasks follow TDD Red-Green-Refactor cycle per constitution
- Commit after each phase completion (not per task — tasks within a phase are tightly coupled)
- Phase 3 (T020) has a **breaking change warning**: existing test queries must be updated for i18n-aware `aria-label` BEFORE new tests are added
- The component remains at `src/components/login/language-selector.tsx` — relocation to `src/components/ui/` is out of scope
- Montserrat Bold font is already loaded — no font setup tasks needed
- No new files created — all tasks modify existing files
