# Implementation Plan: Viết Kudo (Write Kudo)

**Frame**: `520:11602-viet-kudo`
**Date**: 2026-03-17
**Spec**: `specs/520-11602-viet-kudo/spec.md`

---

## Summary

Build a modal dialog for composing and sending Kudos. The modal includes recipient search (autocomplete), a "Danh hiệu" title field, a Tiptap-based rich-text editor with @mention support, hashtag chips, image uploads (Supabase Storage), an anonymous toggle, and form validation. Requires a database migration (add `title`, `is_anonymous` columns + `content` TEXT→JSONB), two new API Route Handlers (POST kudos, GET user search + POST hashtags in existing files), and a Supabase Storage bucket for client-direct image uploads.

---

## Technical Context

**Language/Framework**: TypeScript (strict) / Next.js 15 (App Router)
**Primary Dependencies**: React 19, TailwindCSS 4, Tiptap (NEW), Zod 4
**Database**: Supabase PostgreSQL (existing `kudos` table, migration needed)
**Testing**: Vitest (unit/integration), Playwright (E2E)
**State Management**: Local React state (`useState`) — no global store needed
**API Style**: REST (Next.js Route Handlers)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions — kebab-case files, PascalCase components, `@/*` imports
- [x] Uses approved libraries and patterns — Tiptap is new (see Violations)
- [x] Adheres to folder structure guidelines — `src/components/write-kudo/`, `src/app/api/`
- [x] Meets security requirements — Zod validation, RLS policies, HTML sanitization
- [x] Follows testing standards — TDD, co-located `.test.ts` files

**Violations (if any)**:

| Violation | Justification | Alternative Rejected |
|-----------|---------------|---------------------|
| New library: `@tiptap/react` + extensions | Rich-text editor with toolbar, @mention, and character limit is a core requirement (FR-004, FR-005). No existing editor in the project. | Textarea with markdown — doesn't support inline formatting UX per spec; ContentEditable raw — too complex and error-prone |
| New library: `@tiptap/starter-kit`, `@tiptap/extension-mention`, `@tiptap/extension-link`, `@tiptap/extension-character-count` | Required Tiptap extensions for bold/italic/strike/list/link/quote/mention/charlimit per spec | Building custom editor — YAGNI violation, unreliable |

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based folder `src/components/write-kudo/` with sub-components. Matches existing pattern (`kudos-live-board/`, `login/`, `homepage/`).
- **Styling Strategy**: Tailwind utility classes inline, matching project convention. Design tokens from `design-style.md` mapped to Tailwind arbitrary values `bg-[#FFF8E1]`.
- **Data Fetching**: Client-side fetch in `"use client"` components (modal needs event handlers and local state per TR-003). Debounced search via custom hook.
- **Rich-Text Editor**: Tiptap with custom toolbar matching design. Output stored as JSON (Tiptap native) — safer than raw HTML, renders server-side via Tiptap `generateHTML()`.
- **Image Upload**: Direct upload to Supabase Storage bucket `kudo-images`. Returns public URL stored in `kudos.images[]` column.

### Backend Approach

- **API Design**: 4 new/modified Route Handlers
  - `POST /api/kudos` — Create kudo (NEW handler in existing file)
  - `GET /api/users/search?q=` — Search users by name (NEW)
  - `POST /api/hashtags` — Create new hashtag (NEW handler in existing file)
- **Image Upload Strategy**: Client-direct upload to Supabase Storage via `supabase.storage.from('kudo-images').upload()` in the `useImageUpload` hook. No server Route Handler needed — Supabase JS client handles auth and upload directly from the browser. This avoids multipart/form-data complexity on CF edge.
- **Data Access**: Supabase client via `@/libs/supabase/server.ts` in Route Handlers
- **Validation**: Zod schemas for all request bodies/params per constitution

### Database Changes

**New migration**: `20260318000000_add_kudo_title_and_anonymous.sql`

```sql
-- Add title (danh hiệu) and anonymous flag to kudos table
ALTER TABLE kudos ADD COLUMN title VARCHAR(50) NOT NULL DEFAULT '';
ALTER TABLE kudos ADD COLUMN is_anonymous BOOLEAN NOT NULL DEFAULT false;

-- Change content column to JSONB for Tiptap JSON storage
-- Existing plain-text content is migrated to a Tiptap-compatible JSON wrapper
ALTER TABLE kudos ALTER COLUMN content TYPE JSONB USING
  jsonb_build_object('type', 'doc', 'content',
    jsonb_build_array(jsonb_build_object('type', 'paragraph', 'content',
      jsonb_build_array(jsonb_build_object('type', 'text', 'text', content))
    ))
  );

-- Index for user search by name (ILIKE performance)
CREATE INDEX idx_profiles_name_search ON profiles (lower(name) text_pattern_ops);

-- Allow authenticated users to insert hashtags (for user-created hashtags)
CREATE POLICY "Authenticated users can create hashtags"
  ON hashtags FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create storage bucket for kudo images
INSERT INTO storage.buckets (id, name, public)
  VALUES ('kudo-images', 'kudo-images', true);

-- Storage policy: authenticated users can upload images
CREATE POLICY "Authenticated users can upload kudo images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'kudo-images');

-- Storage policy: public read access
CREATE POLICY "Public read kudo images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'kudo-images');
```

**Content format decision**: Store Tiptap JSON as `JSONB` instead of plain text. The migration converts existing plain-text content to a Tiptap-compatible JSON doc structure so the feed renderer can use `generateHTML()` uniformly. The `KudosSchema.content` type changes from `z.string()` to `z.record(z.unknown())` (Tiptap JSON object).

### Integration Points

- **Existing Services**: `@/libs/supabase/client.ts` (browser), `@/libs/supabase/server.ts` (Route Handlers), `@/libs/supabase/api-auth.ts` (auth guard)
- **Shared Components**: `<Icon />` from `src/components/ui/icon.tsx` — extend with new icons (bold, italic, etc.)
- **Existing Types**: `User`, `Hashtag`, `KudosSchema` from `src/types/kudos.ts` — extend with `CreateKudoSchema`
- **Parent Integration**: `WriteKudoModal` opened from `kudos-search-input.tsx` (Live board) and Homepage CTA

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/520-11602-viet-kudo/
├── spec.md              # Feature specification ✅
├── design-style.md      # Design specifications ✅
├── plan.md              # This file ✅
├── tasks.md             # Task breakdown (next step)
└── assets/
    └── frame.png        # Figma frame screenshot ✅
```

### Source Code (affected areas)

```text
# New Files
src/
├── components/write-kudo/
│   ├── write-kudo-modal.tsx          # Main modal container ("use client")
│   ├── write-kudo-modal.test.tsx     # Unit tests
│   ├── recipient-field.tsx           # Autocomplete search input
│   ├── recipient-field.test.tsx
│   ├── danh-hieu-field.tsx           # Title/badge text input with char counter
│   ├── danh-hieu-field.test.tsx
│   ├── kudo-editor.tsx               # Tiptap rich-text editor + toolbar
│   ├── kudo-editor.test.tsx
│   ├── hashtag-field.tsx             # Hashtag chips + add dropdown
│   ├── hashtag-field.test.tsx
│   ├── image-upload-field.tsx        # Image thumbnails + upload
│   ├── image-upload-field.test.tsx
│   ├── anonymous-toggle.tsx          # Checkbox toggle
│   └── anonymous-toggle.test.tsx
├── hooks/
│   ├── use-user-search.ts            # Debounced user search hook
│   ├── use-user-search.test.ts
│   ├── use-image-upload.ts           # Supabase Storage direct upload hook
│   ├── use-image-upload.test.ts
│   ├── use-create-kudo.ts            # POST /api/kudos submission hook
│   └── use-create-kudo.test.ts
├── app/api/
│   ├── kudos/route.ts                # MODIFY: add POST handler
│   ├── users/search/route.ts         # NEW: GET user search
│   └── hashtags/route.ts             # MODIFY: add POST handler
└── types/
    └── kudos.ts                       # MODIFY: add CreateKudoSchema, UserSearchSchema

# Database
supabase/migrations/
└── 20260318000000_add_kudo_title_and_anonymous.sql   # NEW

# Tests
tests/
└── integration/
    └── write-kudo/
        └── create-kudo.test.ts        # Integration test for POST /api/kudos
```

### Modified Files

| File | Changes |
|------|---------|
| `src/types/kudos.ts` | Add `CreateKudoSchema`, `UserSearchQuerySchema`, `CreateHashtagSchema`; update `KudosSchema.content` from `z.string()` to `z.record(z.unknown())` (JSONB); add `title: z.string()` and `is_anonymous: z.boolean()` to `KudosSchema` |
| `src/app/api/kudos/route.ts` | Add `POST` handler for creating kudos; update `GET` handler to include `title` and `is_anonymous` in response |
| `src/app/api/hashtags/route.ts` | Add `POST` handler for creating hashtags |
| `src/components/ui/icon.tsx` | Add editor toolbar icons (bold, italic, strikethrough, list, link, quote, send, cancel, plus, close) |
| `src/components/kudos-live-board/kudos-search-input.tsx` | Wire "Write Kudo" click to open `WriteKudoModal` |
| `src/components/kudos-live-board/kudo-post-card.tsx` | Update content rendering to use `generateHTML()` from Tiptap JSON instead of plain text |
| `src/components/kudos-live-board/highlight-kudo-card.tsx` | Same — update content rendering for Tiptap JSON |
| `package.json` | Add Tiptap dependencies |

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@tiptap/react` | ^2.x | React integration for Tiptap editor |
| `@tiptap/starter-kit` | ^2.x | Bold, italic, strike, list, quote, heading |
| `@tiptap/extension-link` | ^2.x | Link insertion in editor |
| `@tiptap/extension-mention` | ^2.x | @mention autocomplete |
| `@tiptap/extension-character-count` | ^2.x | Max 1000 char enforcement |
| `@tiptap/extension-placeholder` | ^2.x | Placeholder text support |
| `@tiptap/html` | ^2.x | `generateHTML()` for rendering Tiptap JSON in feed cards |
| `@tiptap/pm` | ^2.x | ProseMirror core (peer dependency of Tiptap) |

---

## Implementation Strategy

### Phase Breakdown

#### Phase 0: Asset & Infrastructure Setup
- Run `supabase/migrations/20260318000000_add_kudo_title_and_anonymous.sql`
- `yarn add @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-mention @tiptap/extension-character-count @tiptap/extension-placeholder`
- Add new icon SVGs to `<Icon />` component
- Add Zod schemas to `src/types/kudos.ts`: `CreateKudoSchema`, `UserSearchQuerySchema`, `CreateHashtagSchema`

#### Phase 1: Backend API (enables frontend TDD)
- **POST `/api/kudos`** — Validate with Zod, insert into `kudos` + `kudos_hashtags`, return created kudo
- **GET `/api/users/search?q=`** — Search `profiles` by `name ILIKE %q%`, return array of users (limit 10)
- **POST `/api/hashtags`** — Create new hashtag, return it (or return existing if duplicate)
- *(No image upload endpoint — uses client-direct Supabase Storage via `useImageUpload` hook in Phase 7)*

#### Phase 2: Core Modal Shell (US1 + US7 — P1/P3)
- `WriteKudoModal` — overlay, modal container, title, action buttons (Hủy/Gửi)
- ESC/overlay click to close
- Form validation logic (isFormValid derived state)
- Loading + error states on submit

#### Phase 3: Recipient Search (US2 — P1)
- `RecipientField` — label + search input with autocomplete dropdown
- `useUserSearch` hook — debounced API call (300ms)
- Keyboard navigation (ArrowDown/Up, Enter)

#### Phase 4: Rich-Text Editor (US3 — P1)
- `KudoEditor` — Tiptap with toolbar (B, I, S, List, Link, Quote)
- @mention integration with `useUserSearch`
- Character counter (max 1000)
- "Tiêu chuẩn cộng đồng" link

#### Phase 5: Danh hiệu Field (Part of US1 — P1)
- `DanhHieuField` — text input, max 50 chars, hint text, char counter

#### Phase 6: Hashtags (US4 — P2)
- `HashtagField` — label + "+ Hashtag" button + chip list
- Dropdown to select from existing or type to create new
- Max 5 limit, at least 1 required

#### Phase 7: Image Upload (US5 — P2)
- `ImageUploadField` — label + thumbnails + "+ Image" button
- `useImageUpload` hook — Supabase Storage upload
- File validation (type, size)
- Thumbnail with red delete button

#### Phase 8: Anonymous Toggle (US6 — P3)
- `AnonymousToggle` — checkbox + label

#### Phase 9: Polish & Integration
- Update `kudo-post-card.tsx` and `highlight-kudo-card.tsx` to render Tiptap JSON content via `generateHTML()` and display `title`/`is_anonymous` fields
- Update `GET /api/kudos` response to include `title` and `is_anonymous`
- Responsive breakpoints (360px, 768px, 1440px)
- Accessibility audit (ARIA `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap, visible focus rings)
- Wire modal open from `kudos-search-input.tsx` (Live board) and Homepage CTA
- Edge case handling (all 9 from spec: char limits, invalid upload, stale recipient, slow network, invalid mention, empty search, duplicate hashtag, browser back)
- Lazy-load modal with `next/dynamic({ ssr: false })` to avoid Tiptap SSR issues and reduce initial bundle

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Tiptap bundle size impact | Medium | Medium | Tree-shake unused extensions; lazy-load modal with `next/dynamic` |
| Tiptap @mention + search performance | Low | High | Debounce 300ms, limit results to 10, index profiles.name |
| Image upload to Supabase Storage on CF edge | Low | Medium | Client-direct upload via `supabase.storage.from().upload()` — no server middleman; browser handles the request directly to Supabase, bypassing CF edge entirely |
| Content format migration (TEXT → JSONB) | Medium | High | Migration wraps existing plain-text in Tiptap-compatible JSON doc; feed renderer updated in same PR to use `generateHTML()`; test both old and new content in integration tests |
| Rich-text XSS when rendering kudo content | Low | Critical | Store Tiptap JSON, render via `generateHTML()` with sanitization; never use `dangerouslySetInnerHTML` with raw user HTML |
| `sender_not_receiver` constraint on anonymous kudos | Low | Medium | Anonymous still sends with `sender_id`; only display is hidden. DB constraint unchanged. |

### Estimated Complexity

- **Frontend**: **High** — Rich-text editor, autocomplete, image upload, multi-field form
- **Backend**: **Medium** — 3 new endpoints, 1 migration, storage bucket
- **Testing**: **Medium** — TDD for each component, integration test for POST /api/kudos

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions**: Modal form → API → Database round-trip
- [x] **External dependencies**: Supabase Auth, Supabase Storage, Supabase DB
- [x] **Data layer**: `kudos`, `kudos_hashtags`, `hashtags`, `profiles` tables
- [x] **User workflows**: Complete send-kudo flow (search → fill → attach → submit)

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Form validation, submit flow, character counters |
| Service ↔ Service | No | — |
| App ↔ External API | Yes | Supabase Storage upload, DB operations |
| App ↔ Data Layer | Yes | Insert kudo + hashtags, user search, image URL storage |
| Cross-platform | Yes | Responsive at 360px / 768px / 1440px |

### Test Environment

- **Environment type**: Local Supabase (`make up`) + Vitest + Playwright
- **Test data strategy**: Seeded database with test users, departments, hashtags
- **Isolation approach**: Transaction rollback per test / fresh seed

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| Supabase DB | Real (local) | Constitution mandates real DB integration tests |
| Supabase Storage | Mock in unit, real in integration | Storage upload tested E2E; unit tests mock the hook |
| Supabase Auth | Mock user session | Inject test auth context via middleware |
| Tiptap editor | Render with Testing Library | Test content output, not internal editor state |

### Test Scenarios Outline

1. **Happy Path**
   - [x] Submit kudo with all required fields → 201 Created
   - [x] Search user → returns matching profiles
   - [x] Upload valid image → returns public URL
   - [x] Create new hashtag → returns hashtag with ID

2. **Error Handling**
   - [x] Submit with missing required field → 400 validation error
   - [x] Submit with invalid receiver_id → 422
   - [x] Upload oversized image → 413 / validation error
   - [x] Upload invalid file type → 400

3. **Edge Cases**
   - [x] Submit with 5 hashtags (max) → success
   - [x] Submit with 5 images (max) → success
   - [x] Submit with is_anonymous=true → kudo saved with flag
   - [x] Duplicate hashtag creation → returns existing
   - [x] Message body exactly 1000 chars → success
   - [x] Danh hiệu exactly 50 chars → success

### Tooling & Framework

- **Test framework**: Vitest (unit + integration), Playwright (E2E)
- **Supporting tools**: Testing Library (React components), MSW (optional API mocking)
- **CI integration**: `yarn test` in CI pipeline, `yarn test:e2e` for Playwright

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Core send flow (POST /api/kudos) | 90%+ | High |
| Form validation logic | 90%+ | High |
| UI components (render + interactions) | 80%+ | Medium |
| Edge cases (limits, errors) | 75%+ | Medium |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved (status: Reviewed)
- [x] `design-style.md` complete with design tokens
- [ ] Database migration written and tested locally
- [ ] Tiptap packages installed and verified edge-safe

### External Dependencies

- Supabase Storage bucket `kudo-images` must be created
- Montserrat font must be available globally (verify in app layout)
- Existing `profiles` table must have seed data for search testing

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following Phase 0 → Phase 9 order

---

## Notes

- The `kudos` table stores `images` as `TEXT[]` (array of URLs). Supabase Storage public URLs fit this column directly.
- The `sender_not_receiver` constraint prevents self-kudos. Anonymous mode only hides the sender on **display** — the DB still records `sender_id` for audit/admin purposes.
- The `content` column is migrated from `TEXT` to `JSONB` to store Tiptap JSON natively. The migration wraps existing plain-text content in a Tiptap doc structure so `generateHTML()` works uniformly. **Both feed card components must be updated in this PR.**
- Image uploads use client-direct Supabase Storage upload — no server Route Handler needed. The `useImageUpload` hook calls `supabase.storage.from('kudo-images').upload()` and returns the public URL.
- Tiptap JSON storage avoids XSS entirely: use `editor.getJSON()` for persistence, `generateHTML(json, extensions)` for rendering. Never use `dangerouslySetInnerHTML` with raw user HTML.
- Lazy-load `WriteKudoModal` with `next/dynamic({ ssr: false })` — Tiptap requires browser DOM and the modal is not needed on initial page load.
