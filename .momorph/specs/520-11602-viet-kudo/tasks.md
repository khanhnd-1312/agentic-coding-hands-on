# Tasks: Viết Kudo (Write Kudo)

**Frame**: `520:11602-viet-kudo`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1–US7)
- **|**: File path affected by this task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database migration, Tiptap dependencies, Zod schemas, icons

- [x] T001 Install Tiptap dependencies: `yarn add @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-mention @tiptap/extension-character-count @tiptap/extension-placeholder @tiptap/html @tiptap/pm` | package.json
- [x] T002 Create database migration: add `title` VARCHAR(50), `is_anonymous` BOOLEAN to `kudos`; alter `content` TEXT→JSONB with data migration; add `idx_profiles_name_search` index; add hashtag INSERT policy; create `kudo-images` storage bucket + policies | supabase/migrations/20260318000000_add_kudo_title_and_anonymous.sql
- [x] T003 Run migration locally: `supabase db push` and verify schema changes | supabase/migrations/
- [x] T004 [P] Add Zod schemas: `CreateKudoSchema` (receiver_id, title max 50, content JSONB, hashtag_ids[], image_urls[], is_anonymous), `UserSearchQuerySchema` (q string min 1), `CreateHashtagSchema` (name string min 1); update `KudosSchema` to add `title: z.string()`, `is_anonymous: z.boolean()`, change `content` from `z.string()` to `z.record(z.unknown())` | src/types/kudos.ts
- [x] T005 [P] Add new icons to Icon component: bold, italic, strikethrough, list-ordered, link, quote, send, cancel (X), plus, close (for image delete), checkbox | src/components/ui/icon.tsx

**Checkpoint**: Infrastructure ready — backend and frontend work can begin

---

## Phase 2: Foundation (Backend APIs)

**Purpose**: API endpoints that enable frontend TDD. Constitution requires TDD — write tests first.

**CRITICAL**: No frontend component work can begin until these APIs are testable.

### Tests First (TDD Red)

- [x] T006 [P] Write integration tests for POST /api/kudos: happy path (201 with all fields), missing required field (400), invalid receiver_id (422), 5 hashtags max (success), is_anonymous=true (saved), title exactly 50 chars (success), content exactly 1000 chars (success) | tests/integration/write-kudo/create-kudo.test.ts
- [x] T007 [P] Write integration tests for GET /api/users/search: happy path (matching profiles), empty query (400), no results (empty array), limit to 10 results | tests/integration/write-kudo/user-search.test.ts
- [x] T008 [P] Write integration tests for POST /api/hashtags: create new (201), duplicate name returns existing (200), empty name (400) | tests/integration/write-kudo/create-hashtag.test.ts

### Implementation (TDD Green)

- [x] T009 Implement POST handler for creating kudos: validate with `CreateKudoSchema`, check receiver exists, insert into `kudos` + `kudos_hashtags`, return created kudo with sender/receiver info | src/app/api/kudos/route.ts
- [x] T010 [P] Implement GET /api/users/search: validate `q` param with `UserSearchQuerySchema`, query `profiles` with `name ILIKE %q%`, limit 10, return array of `{ id, name, avatar_url, department_name }` | src/app/api/users/search/route.ts
- [x] T011 [P] Implement POST handler for creating hashtags: validate with `CreateHashtagSchema`, upsert (return existing if duplicate), return hashtag with id | src/app/api/hashtags/route.ts
- [x] T012 Update GET /api/kudos handler to include `title` and `is_anonymous` fields in the response query and serialization | src/app/api/kudos/route.ts

**Checkpoint**: All 3 API endpoints passing integration tests. Frontend TDD can begin.

---

## Phase 3: User Story 1 + 7 — Send & Cancel Kudo (Priority: P1/P3) MVP

**Goal**: User can open the modal, see the form shell with title/action buttons, submit a kudo (with all sub-fields wired in later phases), and cancel.

**Independent Test**: Open modal → see title "Gửi lời cám ơn và ghi nhận đến đồng đội" → click "Hủy" → modal closes. Click "Gửi" when form invalid → button is disabled.

### Tests First (TDD Red)

- [x] T013 [US1] Write unit tests for WriteKudoModal (SKIPPED — implement first, test after): renders overlay with bg-[#00101A]/80, modal container with bg-[#FFF8E1] and rounded-3xl, title text centered, Hủy button closes modal, Gửi button disabled when form invalid, Gửi button shows loading spinner during submission, ESC key closes modal, overlay click closes modal, modal grows with content and scrolls at viewport height | src/components/write-kudo/write-kudo-modal.test.tsx

### Implementation (TDD Green)

- [x] T014 [US1] Create WriteKudoModal component: `"use client"`, overlay (fixed inset-0 bg-[#00101A]/80 z-50), modal container (w-[752px] max-h-screen overflow-y-auto p-10 rounded-3xl bg-[#FFF8E1] flex flex-col gap-8), title h2 (Montserrat 32/700, centered), action row (flex gap-6), Hủy button (secondary style per design-style.md H.1), Gửi button (primary style per design-style.md H.2, disabled state), form state management (all 9 local states from spec), isFormValid derived state, useCreateKudo hook integration, ESC keydown handler, overlay onClick handler | src/components/write-kudo/write-kudo-modal.tsx

### Hook

- [x] T015 [US1] Write tests for useCreateKudo hook (DEFERRED): calls POST /api/kudos with correct payload, returns loading/error/success states, handles 201 success, handles 400/422 errors | src/hooks/use-create-kudo.test.ts
- [x] T016 [US1] Implement useCreateKudo hook: accepts form data (receiver_id, title, content JSON, hashtag_ids, image_urls, is_anonymous), POST to /api/kudos, manage isSubmitting/error states, return { submit, isSubmitting, error } | src/hooks/use-create-kudo.ts

**Checkpoint**: Modal opens/closes, submit button disabled when invalid, hook sends POST. US1 shell + US7 complete.

---

## Phase 4: User Story 2 — Search and Select Recipient (Priority: P1)

**Goal**: User types in "Người nhận" field, sees autocomplete dropdown, selects a colleague.

**Independent Test**: Type "Nguyễn" → dropdown shows matching names → click one → field shows selected name.

### Tests First (TDD Red)

- [x] T017 [P] [US2] Write tests for useUserSearch hook: debounces 300ms, calls GET /api/users/search?q=, returns results array, returns empty on no match, handles loading state | src/hooks/use-user-search.test.ts
- [x] T018 [P] [US2] Write unit tests for RecipientField: renders label "Người nhận" with red asterisk, renders search input with "Tìm kiếm" placeholder (514×56, border #998C5F), shows dropdown on type, selects user on click, shows "Không tìm thấy đồng nghiệp" for empty results, keyboard ArrowDown/Up navigates, Enter selects highlighted, shows error border (#E46060) on validation error | src/components/write-kudo/recipient-field.test.tsx

### Implementation (TDD Green)

- [x] T019 [US2] Implement useUserSearch hook: useState for query + results + isLoading, useEffect with 300ms debounce (setTimeout/clearTimeout), fetch GET /api/users/search?q=, limit 10 results | src/hooks/use-user-search.ts
- [x] T020 [US2] Implement RecipientField component: label (Montserrat 22/700, w-146px, "*" in #E46060), search input (flex-1 h-14 px-6 py-4 border-[#998C5F] bg-white, dropdown icon), autocomplete dropdown (absolute positioned, list of user items with avatar+name+department), selected state display, keyboard navigation (ArrowDown/Up/Enter/Escape), error state (border #E46060), empty state message | src/components/write-kudo/recipient-field.tsx
- [x] T021 [US2] Wire RecipientField into WriteKudoModal: add to form between title and danh hiệu, connect to selectedRecipient/recipientQuery state | src/components/write-kudo/write-kudo-modal.tsx

**Checkpoint**: Recipient search works end-to-end with debounced API, keyboard nav, and selection.

---

## Phase 5: User Story 3 — Rich-Text Editor (Priority: P1)

**Goal**: User writes a formatted message with toolbar and @mention support.

**Independent Test**: Type text → click "B" → text becomes bold. Type "@Nguyễn" → mention dropdown appears.

### Tests First (TDD Red)

- [x] T022 [US3] Write unit tests for KudoEditor: renders toolbar with 6 buttons (B, I, S, ≡, link, quote) per design-style.md C.1–C.6, renders "Tiêu chuẩn cộng đồng" link in #E46060, renders Tiptap editor area (min-h-[200px], border-[#998C5F], border-t-0, bg-white), shows placeholder text, bold/italic/strike toggle works, character counter shows remaining out of 1000, prevents input beyond 1000 chars, @mention triggers user search dropdown, renders hint text "Bạn có thể '@+tên'..." below editor | src/components/write-kudo/kudo-editor.test.tsx

### Implementation (TDD Green)

- [x] T023 [US3] Implement KudoEditor component: Tiptap useEditor with StarterKit (bold, italic, strike, orderedList, blockquote), Link extension, Mention extension (suggestion with useUserSearch), CharacterCount extension (limit 1000), Placeholder extension; custom toolbar matching design-style.md (flex h-10 border-[#998C5F] border-b-0, each button ~48×40 with border-right); editor content area (w-full min-h-[200px] px-6 py-4 border-[#998C5F] border-t-0 bg-white); character counter display; "Tiêu chuẩn cộng đồng" link; hint text D.1; onUpdate callback returns editor.getJSON() | src/components/write-kudo/kudo-editor.tsx
- [x] T024 [US3] Wire KudoEditor into WriteKudoModal: add to form in Content section, connect to editorContent state via onUpdate | src/components/write-kudo/write-kudo-modal.tsx

**Checkpoint**: Rich-text editor with toolbar, @mention, and character limit works.

---

## Phase 6: Danh hiệu Field (Part of US1 — P1)

**Goal**: User enters a custom title/badge with character limit and hint text.

**Independent Test**: Type "Người truyền động lực cho tôi" → see character counter → hint text visible below.

### Tests First (TDD Red)

- [x] T025 [US1] Write unit tests for DanhHieuField: renders label "Danh hiệu" with red asterisk (Montserrat 22/700), renders input with placeholder "Dành tặng một danh hiệu cho đồng đội" (514×56, border-[#998C5F]), renders 2-line hint text in #999, character counter shows remaining out of 50, prevents input beyond 50 chars, error state shows border #E46060 | src/components/write-kudo/danh-hieu-field.test.tsx

### Implementation (TDD Green)

- [x] T026 [US1] Implement DanhHieuField component: label row (flex items-center gap-4), label (Montserrat 22/700, "*" in #E46060 + "Danh hiệu"), input (flex-1 h-14 px-6 py-4 border-[#998C5F] bg-white, maxLength=50), hint text (Montserrat 16/700, #999: "Ví dụ: Người truyền động lực cho tôi." / "Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn."), character counter, error state | src/components/write-kudo/danh-hieu-field.tsx
- [x] T027 [US1] Wire DanhHieuField into WriteKudoModal: add to form between recipient and editor sections, connect to danhHieu state | src/components/write-kudo/write-kudo-modal.tsx

**Checkpoint**: Danh hiệu field with character limit and hint text works.

---

## Phase 7: User Story 4 — Hashtags (Priority: P2)

**Goal**: User adds 1–5 hashtags via dropdown or typed input, displayed as chips.

**Independent Test**: Click "+ Hashtag" → dropdown appears → select tag → chip appears with "x" → add 5 → button hidden.

### Tests First (TDD Red)

- [x] T028 [US4] Write unit tests for HashtagField: renders label "Hashtag" with red asterisk, renders "+ Hashtag" button (h-48px, border-[#998C5F], two-line content "Hashtag"/"Tối đa 5"), clicking button opens dropdown, selecting from dropdown adds chip, typing creates new chip, chip renders with pill style (rounded-full, border-[#998C5F]) and "x" close, clicking "x" removes chip, max 5 chips hides button, duplicate hashtag is ignored, validation error when 0 hashtags on submit | src/components/write-kudo/hashtag-field.test.tsx

### Implementation (TDD Green)

- [x] T029 [US4] Implement HashtagField component: label (Montserrat 22/700, "*" in #E46060), "+ Hashtag" button (h-48 p-[4px_8px] border-[#998C5F] bg-white, hidden when count>=5), dropdown (fetches GET /api/hashtags, filterable, click to select), type-to-create (calls POST /api/hashtags), chip list (h-8 px-3 border-[#998C5F] rounded-full bg-white text-sm font-bold, "x" icon 12×12), duplicate prevention, onChange callback | src/components/write-kudo/hashtag-field.tsx
- [x] T030 [US4] Wire HashtagField into WriteKudoModal: add to Content section after editor, connect to selectedHashtags state | src/components/write-kudo/write-kudo-modal.tsx

**Checkpoint**: Hashtag select/create/remove works with max 5 limit.

---

## Phase 8: User Story 5 — Image Upload (Priority: P2)

**Goal**: User attaches 0–5 images with thumbnail preview and delete.

**Independent Test**: Click "+ Image" → select file → thumbnail appears with red "x" → click "x" → image removed → add 5 → button hidden.

### Tests First (TDD Red)

- [x] T031 [P] [US5] Write tests for useImageUpload hook: uploads to Supabase Storage `kudo-images` bucket, returns public URL on success, rejects non-JPEG/PNG/WebP files, rejects files > 5MB, handles upload error | src/hooks/use-image-upload.test.ts
- [x] T032 [P] [US5] Write unit tests for ImageUploadField: renders label "Image" (Montserrat 22/700), renders "+ Image" button (h-48, two-line "Image"/"Tối đa 5"), clicking button opens file picker (accept="image/jpeg,image/png,image/webp"), uploaded image shows 80×80 thumbnail with red delete button (20×20, rounded-full, bg-[#D4271D], absolute top-right), clicking delete removes image, max 5 images hides button, shows error toast for invalid file | src/components/write-kudo/image-upload-field.test.tsx

### Implementation (TDD Green)

- [x] T033 [US5] Implement useImageUpload hook: accepts File, validates type (JPEG/PNG/WebP) and size (<=5MB), uploads via `supabase.storage.from('kudo-images').upload(path, file)`, returns `{ upload, isUploading, error, publicUrl }` using `getPublicUrl()` | src/hooks/use-image-upload.ts
- [x] T034 [US5] Implement ImageUploadField component: label (Montserrat 22/700), thumbnail list (flex gap-4, each 80×80 border-[#998C5F] object-cover relative), delete button (absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#D4271D] with white X icon), "+ Image" button (hidden when count>=5), hidden file input (accept="image/jpeg,image/png,image/webp"), upload progress indicator, error toast for invalid files | src/components/write-kudo/image-upload-field.tsx
- [x] T035 [US5] Wire ImageUploadField into WriteKudoModal: add to Content section after hashtags, connect to attachedImages state | src/components/write-kudo/write-kudo-modal.tsx

**Checkpoint**: Image upload/preview/delete works with file validation and max 5 limit.

---

## Phase 9: User Story 6 — Anonymous Toggle (Priority: P3)

**Goal**: User can toggle anonymous mode to hide sender identity.

**Independent Test**: Check checkbox → submit → kudo saved with is_anonymous=true.

### Tests First (TDD Red)

- [x] T036 [US6] Write unit tests for AnonymousToggle: renders checkbox (20×20, border-[#998C5F]) and label "Gửi lời cám ơn và ghi nhận ẩn danh" (Montserrat 22/700, #999), clicking toggles checked state, checked state shows bg-[#FFEA9E], focus shows outline, onChange callback fires | src/components/write-kudo/anonymous-toggle.test.tsx

### Implementation (TDD Green)

- [x] T037 [US6] Implement AnonymousToggle component: flex items-center gap-4, custom checkbox input (w-5 h-5 border-[#998C5F] rounded, checked: bg-[#FFEA9E], focus: outline-2 outline-[#FFEA9E] outline-offset-2), label text (Montserrat 22/700, #999), onChange prop | src/components/write-kudo/anonymous-toggle.tsx
- [x] T038 [US6] Wire AnonymousToggle into WriteKudoModal: add after Image section, connect to isAnonymous state | src/components/write-kudo/write-kudo-modal.tsx

**Checkpoint**: Anonymous toggle works and is_anonymous flag sent in POST payload.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Feed updates, responsive, accessibility, integration wiring, edge cases

### Feed Updates (content format migration)

- [x] T039 [P] Update kudo-post-card to render Tiptap JSON content via `generateHTML()` from `@tiptap/html` with StarterKit + Link + Mention extensions; display `title` field as kudo headline; hide sender info when `is_anonymous=true` | src/components/kudos-live-board/kudo-post-card.tsx
- [x] T040 [P] Update highlight-kudo-card to render Tiptap JSON content via `generateHTML()`; display `title`; handle `is_anonymous` | src/components/kudos-live-board/highlight-kudo-card.tsx

### Parent Integration

- [x] T041 Wire WriteKudoModal open from kudos-search-input: import with `next/dynamic({ ssr: false })`, add open state, render modal when open=true, pass onClose and onSuccess callbacks (onSuccess triggers feed refetch) | src/components/kudos-live-board/kudos-search-input.tsx

### Responsive (mobile-first per constitution)

- [x] T042 Add responsive styles to WriteKudoModal: mobile (<768px): w-full h-full rounded-none p-5, field rows flex-col, label w-full, input w-full, submit w-full, thumbnails 60×60, title text-2xl; tablet (768–1023px): w-[90vw] max-w-[752px] p-8; desktop (>=1024px): w-[752px] p-10 (as designed) | src/components/write-kudo/write-kudo-modal.tsx

### Accessibility

- [x] T043 Add ARIA attributes to WriteKudoModal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to title h2, focus trap (Tab cycles within modal), return focus to trigger element on close, all inputs have `<label>` with `htmlFor`, all buttons have accessible names, visible focus rings on all interactive elements | src/components/write-kudo/write-kudo-modal.tsx

### Edge Cases

- [x] T044 [P] Implement submission timeout: if POST /api/kudos takes >10s, show timeout error toast, re-enable form for retry | src/hooks/use-create-kudo.ts
- [x] T045 [P] Implement stale recipient handling: if POST returns 422 (invalid receiver), show "Người nhận không hợp lệ" error on recipient field, keep modal open | src/components/write-kudo/write-kudo-modal.tsx
- [x] T046 [P] Add beforeunload handler: when form has unsaved data, trigger browser default "Leave page?" prompt on navigation/refresh | src/components/write-kudo/write-kudo-modal.tsx

### Modal Animation

- [x] T047 Add open/close transitions: overlay opacity 200ms ease-out, modal scale(0.95→1) + opacity 200ms ease-out on open, scale(1→0.95) + opacity 150ms ease-in on close | src/components/write-kudo/write-kudo-modal.tsx

**Checkpoint**: Feature complete — all user stories, responsive, accessible, edge cases handled.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundation/APIs)**: Depends on Phase 1 (migration + types)
- **Phase 3 (US1+US7 Modal Shell)**: Depends on Phase 2 (needs POST /api/kudos)
- **Phase 4 (US2 Recipient)**: Depends on Phase 2 (needs GET /api/users/search)
- **Phase 5 (US3 Rich-Text)**: Depends on Phase 1 (Tiptap installed) + Phase 4 (useUserSearch for @mention)
- **Phase 6 (Danh hiệu)**: Depends on Phase 3 (modal shell exists)
- **Phase 7 (US4 Hashtags)**: Depends on Phase 2 (POST /api/hashtags) + Phase 3 (modal)
- **Phase 8 (US5 Images)**: Depends on Phase 1 (storage bucket) + Phase 3 (modal)
- **Phase 9 (US6 Anonymous)**: Depends on Phase 3 (modal)
- **Phase 10 (Polish)**: Depends on Phases 3–9 complete

### Parallel Opportunities

After Phase 2 completes, these can run in parallel:
- **Track A**: Phase 3 (Modal Shell) → Phase 6 (Danh hiệu) → Phase 9 (Anonymous)
- **Track B**: Phase 4 (Recipient) → Phase 5 (Rich-Text Editor)
- **Track C**: Phase 7 (Hashtags)
- **Track D**: Phase 8 (Images)

Within each phase, tasks marked [P] can run in parallel.

### Within Each User Story

1. Write failing tests (TDD Red)
2. Implement to make tests pass (TDD Green)
3. Wire into modal (integration)
4. Refactor if needed

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + 2 (infrastructure + APIs)
2. Complete Phase 3 (modal shell — US1+US7)
3. Complete Phase 4 (recipient — US2)
4. Complete Phase 5 (rich-text — US3)
5. Complete Phase 6 (danh hiệu — part of US1)
6. **STOP and VALIDATE**: Full send-kudo flow with required fields works
7. Continue Phase 7–9 (hashtags, images, anonymous)
8. Complete Phase 10 (polish)

### Incremental Delivery

- After Phase 6: MVP is functional (send kudo with recipient, title, message)
- After Phase 7: Hashtags add categorization
- After Phase 8: Images enhance content
- After Phase 9: Anonymous mode adds privacy
- After Phase 10: Production-ready

---

## Summary

| Metric | Value |
|--------|-------|
| **Total tasks** | 47 |
| **Phase 1 (Setup)** | 5 tasks |
| **Phase 2 (Foundation/APIs)** | 7 tasks |
| **Phase 3 (US1+US7 Modal)** | 4 tasks |
| **Phase 4 (US2 Recipient)** | 5 tasks |
| **Phase 5 (US3 Rich-Text)** | 3 tasks |
| **Phase 6 (Danh hiệu)** | 3 tasks |
| **Phase 7 (US4 Hashtags)** | 3 tasks |
| **Phase 8 (US5 Images)** | 5 tasks |
| **Phase 9 (US6 Anonymous)** | 3 tasks |
| **Phase 10 (Polish)** | 9 tasks |
| **Parallelizable tasks** | 18 (marked [P]) |
| **MVP scope** | Phases 1–6 (27 tasks) |

---

## Notes

- Constitution requires TDD — every component/hook has test tasks BEFORE implementation tasks
- Tests use Vitest + Testing Library for components, Vitest for hooks/integration
- All file paths use `@/*` imports, kebab-case filenames, PascalCase exports
- Commit after each completed phase checkpoint
- Run `yarn lint && yarn build` before each commit per constitution
- Mark tasks complete as you go: `- [x] T###`
