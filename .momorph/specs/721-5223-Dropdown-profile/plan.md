# Implementation Plan: Dropdown-profile (Profile Dropdown)

**Frame**: `721:5223-Dropdown-profile`
**Spec**: [spec.md](spec.md)
**Design**: [design-style.md](design-style.md)
**Created**: 2026-03-31

---

## Constitution Compliance

| Requirement | Constitution Rule | Status |
|-------------|-------------------|--------|
| TypeScript strict mode | I. Clean Code — all code MUST be TypeScript strict | ✅ Compliant |
| `kebab-case` filenames, `PascalCase` components | I. Clean Code — naming conventions | ✅ `profile-dropdown.tsx` → `ProfileDropdown` |
| `@/*` path alias | I. Clean Code — no relative `../` across boundaries | ✅ All imports via `@/` |
| `"use client"` only when needed | II. Framework — RSC by default | ✅ Required — browser APIs + Supabase client |
| Supabase client from `@/libs/supabase/client.ts` | II. Framework — no direct `createClient` | ✅ Use existing factory |
| TDD: Red → Green → Refactor | III. Test-First — NON-NEGOTIABLE | ✅ Tests written before implementation |
| WCAG 2.1 AA | IV. Responsive & Accessible UI | ✅ ARIA menu pattern, keyboard nav, focus ring |
| Mobile-first, responsive breakpoints | IV. Responsive — 360px, 768px, 1440px | ✅ Fixed dimensions, verify no overflow |
| Zod validation at I/O boundaries | V. Security First | ✅ N/A — no user input; signOut is SDK call |
| No `console.log` in production | Banned patterns | ✅ Will use structured error handling |

---

## Architecture Decisions

### Component Pattern

**Follow the LanguageSelector pattern** (`src/components/login/language-selector.tsx`) — it's the exact sibling dropdown using the same `Dropdown-List` Figma component set. Key decisions:

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Close mechanism | **Backdrop overlay** (`fixed inset-0 z-[99]`) | Matches LanguageSelector; more robust than mousedown listener (FilterDropdown pattern) |
| Keyboard nav | **Wrapping arrow keys** | Matches LanguageSelector; only 2 items, wrapping feels natural |
| Focus management | **`useRef` + `useEffect`** auto-focus | Matches LanguageSelector; focus tracked via `focusedIndex` state |
| ARIA pattern | **`role="menu"` / `role="menuitem"`** | Spec requires menu pattern (not listbox like LanguageSelector) — semantic difference: menu = actions, listbox = selection |
| Animation | **CSS transition 150ms ease-out** | Matches spec; LanguageSelector uses `150ms ease-in-out` — align to spec's `ease-out` |
| Dropdown alignment | **`right-0`** (right-aligned to trigger) | Avatar is at far-right of header; prevent viewport overflow |
| Mutual exclusivity | **Parent state coordination in header** | Header manages which dropdown is open via a single `openDropdown` state |

### State Management

**Local state only** — no global state needed:

| State | Owner | Type | Purpose |
|-------|-------|------|---------|
| `openDropdown` | `Header` (NEW) | `"lang" \| "profile" \| null` | **Mutual exclusivity** — only one dropdown open at a time |
| `isLoggingOut` | `ProfileDropdown` | `boolean` | Loading state during signOut |
| `focusedIndex` | `ProfileDropdown` | `number` | Keyboard nav tracking (-1 = none, 0 = Profile, 1 = Logout) |
| `error` | `ProfileDropdown` | `string \| null` | Error message for Toast (signOut failure) |

**Note on `isOpen`**: `ProfileDropdown` does NOT own an `isOpen` state. It receives `isOpen` as a **controlled prop** derived from `openDropdown === "profile"` in Header. Similarly, `LanguageSelector` receives `isOpen` from `openDropdown === "lang"`.

### Mutual Exclusivity Strategy (FR-007)

The header currently renders `LanguageSelector` and the avatar button independently. To enforce "only one dropdown open at a time":

1. **Lift dropdown-open state to Header**: Add `openDropdown` state (`"lang" | "profile" | null`)
2. **Pass `isOpen` + `onToggle` props** to both `LanguageSelector` and `ProfileDropdown`
3. **When one opens, the other closes** — controlled by Header
4. This requires a **minor refactor of LanguageSelector** to accept controlled `isOpen`/`onToggle` props (currently self-manages state)

### Toast for Logout Errors (FR-009)

Reuse existing `Toast` component from `src/components/kudos-live-board/toast.tsx`. It's simple and prop-driven:
```typescript
<Toast message={error} onDismiss={() => setError(null)} duration={3000} />
```

No global toast provider exists — manage toast state locally in `ProfileDropdown`.

---

## Project Structure

### New Files

| File | Purpose | Lines (est.) |
|------|---------|-------------|
| `src/components/homepage/profile-dropdown.tsx` | ProfileDropdown component (dropdown panel + trigger wrapper) | ~150 |
| `src/components/homepage/profile-dropdown.test.tsx` | Unit tests for ProfileDropdown | ~200 |

### Modified Files

| File | Changes | Impact |
|------|---------|--------|
| `src/components/homepage/header.tsx` | Add `openDropdown` state, replace avatar button with `ProfileDropdown`, pass controlled props to `LanguageSelector` | Medium — refactor dropdown coordination |
| `src/components/login/language-selector.tsx` | Accept optional `isOpen`/`onToggle` props for controlled mode (backward-compatible) | Low — additive change, existing behavior preserved when props absent |
| `src/components/login/language-selector.test.tsx` | Verify existing tests still pass with controlled-mode refactor; add test for controlled `isOpen`/`onToggle` props | Low — existing tests must not break |
| `src/components/homepage/header.test.tsx` | Add tests for dropdown mutual exclusivity | Low |

### Dependencies

No new packages needed. All required libraries exist:
- `@supabase/ssr` — already installed (for `signOut`)
- `next/navigation` — built-in (`useRouter`, `usePathname`)
- `react` — built-in (`useState`, `useRef`, `useEffect`, `useId`, `useCallback`)

---

## Implementation Approach

### Phase 1: Foundation — Types, Refactor Header State (TDD)

**Goal**: Prepare the header for hosting two mutually exclusive dropdowns.

**1.1. Write failing tests for Header dropdown coordination**
- Test: When profile dropdown is open and language trigger is clicked, profile dropdown closes
- Test: When language dropdown is open and avatar trigger is clicked, language dropdown closes
- Test: Only one dropdown can be open at a time

**1.2. Refactor LanguageSelector to support controlled mode**
- Add optional props: `isOpen?: boolean`, `onToggle?: (open: boolean) => void`
- When props present: use them (controlled). When absent: use internal state (uncontrolled, backward-compatible)
- Ensure existing LanguageSelector tests still pass

**1.3. Add `openDropdown` state to Header**
- Type: `useState<"lang" | "profile" | null>(null)`
- Wire `LanguageSelector` with `isOpen={openDropdown === "lang"}` and `onToggle`
- Create placeholder for `ProfileDropdown` (avatar button still renders, no dropdown yet)

**Acceptance**: Header renders correctly, LanguageSelector works in controlled mode, existing tests pass.

---

### Phase 2: Core — ProfileDropdown Component (US3 Toggle + US1 Profile Nav)

**Goal**: Build the dropdown panel with toggle behavior and profile navigation.

**2.1. Write failing tests for ProfileDropdown**
- Test: Clicking avatar trigger opens dropdown
- Test: Clicking avatar trigger again closes dropdown
- Test: Clicking outside (backdrop) closes dropdown
- Test: Pressing Escape closes dropdown and returns focus to trigger
- Test: Clicking "Profile" navigates to `/profile` and closes dropdown
- Test: Dropdown renders with correct ARIA attributes (`role="menu"`, `role="menuitem"`)

**2.2. Implement ProfileDropdown component**
- Follow LanguageSelector pattern for structure
- `"use client"` directive
- Accept props: `isOpen: boolean`, `onToggle: (open: boolean) => void`
- Render avatar trigger button (moved from header) + dropdown panel
- Backdrop overlay (`fixed inset-0 z-[99]`) for click-outside
- Dropdown panel (`absolute right-0 z-[100]`) with design-style.md values
- Profile item: `<button role="menuitem">` with `router.push('/profile')`
- Logout item: `<button role="menuitem">` (placeholder, wired in Phase 3)

**2.3. Apply visual styles from design-style.md**
- Container: `bg-[#00070C] border border-[#998C5F] rounded-lg p-1.5`
- Profile item: `bg-[rgba(255,234,158,0.1)] rounded` + text glow `[text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]`
- Logout item: `bg-transparent hover:bg-[rgba(255,234,158,0.1)] rounded text-white` (text-white needed for `chevron-right` icon which uses `fill: currentColor`)
- Icons: `<Icon name="user-avatar" size={24} />`, `<Icon name="chevron-right" size={24} />`
- Text: `font-montserrat text-base font-bold text-white tracking-[0.15px]`
- Width normalization: both items `w-[121px] h-14`
- Focus ring: `focus:outline-2 focus:outline-[#998C5F] focus:-outline-offset-2` on each menuitem
- Animation (include from start — trivial CSS): `transition-[opacity,transform] duration-150 ease-out origin-top` on dropdown panel. Closed: `opacity-0 scale-y-[0.95]`. Open: `opacity-100 scale-y-100`.

**2.4. Wire into Header**
- Replace avatar button with `<ProfileDropdown isOpen={openDropdown === "profile"} onToggle={...} />`
- Verify mutual exclusivity with LanguageSelector

**Acceptance**: US3 (scenarios 1-4, 6) + US1 (scenarios 1, 3) pass. Dropdown opens/closes, navigates to /profile. *(US3 scenario 5 — scroll close — is in Phase 5.)*

---

### Phase 3: Logout — signOut Integration (US2)

**Goal**: Wire the Logout button to Supabase signOut with loading and error states.

**3.1. Write failing tests for logout behavior**
- Test: Clicking "Logout" calls `supabase.auth.signOut()`
- Test: After successful signOut, redirects to `/login`
- Test: During signOut, Logout button shows loading state (disabled, opacity 0.5)
- Test: On signOut failure, error toast appears, user remains on page
- Test: Double-click prevention — button disabled during signOut

**3.2. Implement logout handler**
```typescript
const handleLogout = useCallback(async () => {
  setIsLoggingOut(true);
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push('/login');
  } catch {
    setError('Đăng xuất thất bại. Vui lòng thử lại.');
    setIsLoggingOut(false);
  }
}, [router]);
```

**3.3. Add loading state to Logout item**
- When `isLoggingOut`: `opacity-50 cursor-not-allowed pointer-events-none`
- Matches design-style.md Loading state (predicted, not in Figma)

**3.4. Add Toast for errors**
- Import existing `Toast` from `@/components/kudos-live-board/toast`
- Render conditionally when `error` state is set
- Auto-dismiss after 3000ms

**Acceptance**: US2 (all 3 scenarios) pass. Logout works end-to-end.

---

### Phase 4: Keyboard Navigation (US4)

**Goal**: Full ARIA menu keyboard support.

**4.1. Write failing tests for keyboard navigation**
- Test: Enter/Space on trigger opens dropdown, focuses first item
- Test: ArrowDown moves focus to next item (wraps)
- Test: ArrowUp moves focus to previous item (wraps)
- Test: Enter/Space on focused item triggers action
- Test: Escape closes dropdown, returns focus to trigger
- Test: Tab closes dropdown, focus moves to next focusable element

**4.2. Implement keyboard handlers**
- `handleTriggerKeyDown`: Enter/Space → open, set focusedIndex to 0
- `handleMenuKeyDown`: ArrowDown/ArrowUp → cycle focusedIndex (wrap at 0/1)
- Enter/Space → trigger action on focused item
- Escape → close, focus trigger
- Tab → close (default browser behavior)

**4.3. Implement focus management**
- `menuItemRefs = useRef<(HTMLButtonElement | null)[]>([null, null])`
- `useEffect` watching `focusedIndex` → auto-focus via `ref.focus()`

**Acceptance**: US4 (all 6 scenarios) pass.

---

### Phase 5: Polish — Edge Cases, Scroll Close, Responsive

**Goal**: Handle remaining edge cases from spec.

**5.1. Write tests for edge cases**
- Test: Scroll event closes dropdown
- Test: Profile click on `/profile` page closes without redundant navigation (US1 scenario 2)
- Test: Rapid toggle doesn't break animation (pointer-events-none during transition)

**5.2. Add scroll listener**
- `useEffect` → `window.addEventListener('scroll', close)` when open
- Cleanup on close/unmount

**5.3. Prevent redundant profile navigation**
- Check `pathname === '/profile'` before `router.push`

**5.4. Verify responsive behavior**
- Manual check at 360px, 768px, 1440px
- Ensure dropdown doesn't overflow viewport right edge (right-aligned, so left edge is the risk on very narrow screens — unlikely with ~133px dropdown width)

**5.5. Deferred edge cases (documented, not implemented)**
- **Session expiry while dropdown is open**: Supabase middleware already redirects unauthenticated requests to `/login` on the next server-side route. `router.push('/profile')` triggers a server request where middleware enforces auth. No additional client-side check needed.
- **Open upward if near bottom of viewport**: Avatar is always in the fixed header at the top of the page. The dropdown always has ample space below. Deferred — would require a `ResizeObserver` or `getBoundingClientRect` check that adds complexity for zero real-world benefit in this layout.

**Acceptance**: All edge cases from spec pass. Deferred items documented with justification.

---

## Testing Strategy

| Type | Focus | Tool | Coverage |
|------|-------|------|----------|
| Unit | ProfileDropdown render, states, props | Vitest + React Testing Library | All 4 user stories, all acceptance scenarios |
| Unit | Header dropdown coordination | Vitest + RTL | Mutual exclusivity |
| Unit | LanguageSelector controlled mode | Vitest + RTL | Backward compatibility |
| Integration | signOut + redirect flow | Vitest (mock Supabase) | US2 happy path + error |
| Manual | Responsive, animation, visual match | Browser | 360px, 768px, 1440px breakpoints |
| Accessibility | axe-core audit | Vitest + axe | Zero violations (SC-005) |

### Mock Strategy

| Dependency | Mock Approach |
|------------|---------------|
| `@/libs/supabase/client` | `vi.mock` → return `{ auth: { signOut: vi.fn() } }` |
| `next/navigation` | `vi.mock` → `useRouter` returns `{ push: vi.fn() }`, `usePathname` returns test path |
| `@/components/kudos-live-board/toast` | Real component (simple, no side effects) |

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| LanguageSelector refactor breaks existing behavior | Medium | Low | Backward-compatible: uncontrolled mode when no props passed. Existing tests verify. |
| `/profile` route doesn't exist yet | Low | High | Navigate anyway — Next.js will show 404. Add stub route if needed. Flag in Dependencies. |
| signOut fails silently in development (no real session) | Low | Medium | Development mode fallback in middleware already handles this. Toast shows error in any case. |
| Animation jank on rapid toggle | Low | Low | `pointer-events: none` during transition. Test manually. |

---

## Estimated File Sizes

| File | New/Modified | Lines (est.) |
|------|-------------|-------------|
| `profile-dropdown.tsx` | New | ~150 |
| `profile-dropdown.test.tsx` | New | ~200 |
| `header.tsx` | Modified | +30 (net) |
| `language-selector.tsx` | Modified | +15 (net) |
| **Total** | | ~395 lines |

---

## Open Questions

- [x] Icon names verified in codebase: `user-avatar` ✅, `chevron-right` ✅
- [x] Toast component exists and is reusable: `src/components/kudos-live-board/toast.tsx` ✅
- [x] Supabase `signOut()` available via SDK — no custom endpoint needed ✅
- [ ] **Profile page route** (`/profile`) does not exist — should we create a stub page in this feature scope, or defer to a separate task? **Recommendation**: Defer. Navigate to `/profile`; it will 404 until the profile feature is built.

---

## Implementation Order Summary

```
Phase 1: Foundation (Header refactor + LanguageSelector controlled mode)
  ├── Tests first → Header dropdown coordination
  ├── Refactor LanguageSelector → accept isOpen/onToggle props
  └── Add openDropdown state to Header

Phase 2: Core (ProfileDropdown + US3 Toggle + US1 Profile Nav + Animation)
  ├── Tests first → Toggle, backdrop, Escape, Profile click
  ├── Build ProfileDropdown component with design-style values + animation
  └── Wire into Header

Phase 3: Logout (US2 signOut)
  ├── Tests first → signOut call, redirect, loading, error, Toast
  ├── Implement handleLogout with Supabase client
  └── Add Toast for error feedback

Phase 4: Keyboard Nav (US4)
  ├── Tests first → Arrow keys, Enter/Space, Escape, Tab
  ├── Implement keyboard handlers
  └── Focus management with refs

Phase 5: Polish (Edge cases, scroll close, responsive)
  ├── Tests first → Scroll close, redundant nav prevention
  ├── Deferred edge cases documented with justification
  └── Manual responsive verification (360/768/1440px)
```

Each phase produces a working, testable increment. Phases 1-3 are critical path. Phase 4 is P2 priority. Phase 5 is polish.
