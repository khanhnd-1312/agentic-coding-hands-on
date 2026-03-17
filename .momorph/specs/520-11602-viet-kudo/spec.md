# Feature Specification: Viết Kudo (Write Kudo)

**Frame ID**: `520:11602`
**Frame Name**: `Viết Kudo`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-17
**Status**: Reviewed

---

## Overview

A modal dialog that allows authenticated users to send a Kudo (appreciation/recognition) to a colleague. The form collects the recipient, a custom title ("Danh hiệu"), a rich-text message body, hashtags, optional images, and an anonymous-send toggle. On submission the Kudo is persisted and appears in the public Kudos feed.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Send a Kudo to a colleague (Priority: P1)

A logged-in user opens the "Viết Kudo" modal, searches for and selects a recipient, enters a title and a rich-text thank-you message, adds at least one hashtag, and submits. The Kudo appears in the Kudos feed.

**Why this priority**: Core value proposition — without sending a Kudo, the feature has no purpose.

**Independent Test**: Open the modal, fill all required fields (recipient, title, message, hashtag), click "Gửi", and verify the Kudo appears in the feed.

**Acceptance Scenarios**:

1. **Given** the user is logged in and the modal is open, **When** the user fills in all required fields (Người nhận, Danh hiệu, message body, at least 1 hashtag) and clicks "Gửi", **Then** the system validates the form, sends the data to the API, shows a loading state, closes the modal on success, and the new Kudo appears in the feed.
2. **Given** the user has not filled all required fields, **When** the user clicks "Gửi", **Then** the submit button remains disabled (or validation errors are shown for each missing field).
3. **Given** the user submits but the API returns an error, **When** the error is received, **Then** an error message is displayed and the modal stays open so the user can retry.

---

### User Story 2 - Search and select a recipient (Priority: P1)

The user types in the "Người nhận" field to search for a colleague and selects one from the autocomplete dropdown.

**Why this priority**: Selecting a recipient is a mandatory step; without it, a Kudo cannot be sent.

**Independent Test**: Open the modal, type at least 1 character in the search field, verify autocomplete suggestions appear, select one, and confirm the field is populated.

**Acceptance Scenarios**:

1. **Given** the modal is open, **When** the user types at least 1 character in the "Người nhận" search input, **Then** a dropdown with matching colleagues appears.
2. **Given** the dropdown is visible, **When** the user clicks a name, **Then** the recipient is selected and displayed in the field.
3. **Given** no text is entered and the user tries to submit, **When** the form is validated, **Then** a validation error ("Trường bắt buộc") is displayed on the recipient field.

---

### User Story 3 - Compose a rich-text message (Priority: P1)

The user writes a thank-you message using a rich-text editor with formatting options (bold, italic, strikethrough, ordered list, link, quote) and can mention colleagues with "@".

**Why this priority**: The message body is the core content of a Kudo and must support formatting and mentions.

**Independent Test**: Type text in the editor, apply bold/italic/strikethrough, insert a link, create a list, and use "@name" to mention a colleague.

**Acceptance Scenarios**:

1. **Given** the editor is active, **When** the user selects text and clicks "B", **Then** the selected text becomes bold.
2. **Given** the editor is active, **When** the user types "@" followed by a name, **Then** an autocomplete dropdown of colleagues appears for mention.
3. **Given** the editor is empty, **When** the user attempts to submit, **Then** validation prevents submission and shows an error.

---

### User Story 4 - Add hashtags (Priority: P2)

The user clicks "+ Hashtag" to add up to 5 hashtags to categorize the Kudo. At least 1 hashtag is required.

**Why this priority**: Hashtags are mandatory for categorization but secondary to the core send flow.

**Independent Test**: Click "+ Hashtag", add a hashtag from the dropdown, verify the chip appears, add up to 5, verify the button is hidden at max.

**Acceptance Scenarios**:

1. **Given** the hashtag section is visible, **When** the user clicks "+ Hashtag", **Then** a dropdown appears to select or create a hashtag.
2. **Given** 5 hashtags are already added, **When** the user looks at the section, **Then** the "+ Hashtag" button is hidden.
3. **Given** a hashtag chip is displayed, **When** the user clicks "x" on the chip, **Then** the hashtag is removed.
4. **Given** no hashtags are added, **When** the user tries to submit, **Then** a validation error is shown.

---

### User Story 5 - Attach images (Priority: P2)

The user can optionally attach up to 5 images to the Kudo by clicking "+ Image".

**Why this priority**: Images enhance kudos but are not required.

**Independent Test**: Click "+ Image", select a file, verify the thumbnail appears with an "x" button. Repeat up to 5 and verify the add button disappears.

**Acceptance Scenarios**:

1. **Given** the image section is visible, **When** the user clicks "+ Image", **Then** the system opens a file picker.
2. **Given** an image is selected, **When** the file picker closes, **Then** an 80×80px thumbnail appears with a red "x" delete button.
3. **Given** 5 images are already attached, **When** the user views the section, **Then** the "+ Image" button is hidden.
4. **Given** a thumbnail is visible, **When** the user clicks the red "x", **Then** the image is removed from the list.

---

### User Story 6 - Send Kudo anonymously (Priority: P3)

The user can toggle a checkbox to send the Kudo anonymously, hiding their identity from the recipient.

**Why this priority**: Nice-to-have feature that adds privacy but is not core functionality.

**Independent Test**: Check the "Gửi lời cám ơn và ghi nhận ẩn danh" checkbox, submit the form, verify the Kudo is marked as anonymous.

**Acceptance Scenarios**:

1. **Given** the checkbox is unchecked, **When** the user checks it, **Then** anonymous mode is enabled (optionally shows an anonymous name input).
2. **Given** anonymous mode is enabled, **When** the Kudo is submitted, **Then** the sender's identity is hidden in the feed.

---

### User Story 7 - Cancel Kudo creation (Priority: P3)

The user can cancel the form by clicking "Hủy", discarding all unsaved input.

**Why this priority**: Standard UX pattern, low implementation effort.

**Independent Test**: Fill some fields, click "Hủy", verify the modal closes and no Kudo is created.

**Acceptance Scenarios**:

1. **Given** the user has entered data in the form, **When** the user clicks "Hủy", **Then** the modal closes and all entered data is discarded.

---

### Edge Cases

- **Character limit overflow (message body)**: If the message body exceeds 1000 characters, the system MUST prevent further input and display a character counter showing remaining characters.
- **Character limit overflow (danh hiệu)**: If the "Danh hiệu" field exceeds 50 characters, the system MUST prevent further input and display a character counter.
- **Invalid image upload**: If the user selects an unsupported file type (not JPEG/PNG/WebP) or a file exceeding 5MB, the system MUST show an inline error toast and NOT add the image.
- **Stale recipient**: If the selected recipient becomes inactive between selection and submission, the API MUST return a 422 error and the modal MUST display "Người nhận không hợp lệ" without closing.
- **Slow network / submission**: The "Gửi" button MUST show a loading spinner during submission. If the request takes >10s, show a timeout error. The user can retry without re-entering data.
- **Invalid @mention**: If "@name" does not match any colleague, the autocomplete dropdown shows "Không tìm thấy" (Not found). The raw text is kept as-is (not converted to a mention link).
- **Empty search results**: If the recipient search yields no results, show "Không tìm thấy đồng nghiệp" in the dropdown.
- **Duplicate hashtag**: If the user tries to add the same hashtag twice, the system MUST silently ignore the duplicate.
- **Browser back/refresh**: If the user navigates away with unsaved data, the browser's default "Leave page?" prompt is sufficient (no custom confirmation required).

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Modal Overlay | Dark overlay (rgba(0,16,26,0.8)) behind the modal | Click outside to close (optional) |
| Modal Container | White/cream dialog (752px wide, border-radius 24px, bg #FFF8E1). Height grows with content; when reaching window height, modal becomes internally scrollable (overflow-y: auto). | Scrollable when content exceeds viewport |
| Title (A) | "Gửi lời cám ơn và ghi nhận đến đồng đội" — centered heading | Static label |
| Người nhận (B) | Label "Người nhận*" + search dropdown input with "Tìm kiếm" placeholder | Type to search, click to select from autocomplete |
| Danh hiệu (B') | Label "Danh hiệu*" + text input with "Dành tặng một danh hiệu cho đồng đội" placeholder + 2-line hint: "Ví dụ: Người truyền động lực cho tôi." / "Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn." | Type to enter a custom title |
| Rich Text Toolbar (C) | Bold, Italic, Strikethrough, List, Link, Quote buttons + "Tiêu chuẩn cộng đồng" link | Toggle formatting |
| Message Body (D) | Rich-text textarea with placeholder and @ mention support | Type, format, mention |
| Hint Text (D.1) | "Bạn có thể '@ + tên' để nhắc tới đồng nghiệp khác" | Static helper text |
| Hashtag (E) | Label + "+ Hashtag" button + tag chips (max 5) | Add/remove hashtags |
| Image (F) | Label + image thumbnails (80×80) with delete buttons + "+ Image" button (max 5) | Upload/delete images |
| Anonymous Toggle (G) | Checkbox + label "Gửi lời cám ơn và ghi nhận ẩn danh" | Toggle on/off |
| Cancel Button (H.1) | "Hủy" with X icon — outlined/secondary style | Click to close modal |
| Submit Button (H.2) | "Gửi" with send icon — primary yellow button (502px wide) | Click to submit, disabled when invalid |

> **Visual specifications** → See [design-style.md](./design-style.md)

### Navigation Flow

- **Entry points**:
  - Homepage SAA (`2167:9026`) — click "Write Kudo" CTA / FAB
  - Sun* Kudos Live board (`2940:13431`) — click Write-Kudo input or "Ghi nhận" button
- **Exit points**:
  - Click "Gửi" (submit) → success → close modal, return to originating page
  - Click "Hủy" (cancel) → close modal, return to originating page
  - Press `Escape` key → same as "Hủy"
  - Click overlay backdrop outside modal → same as "Hủy"
- **Sub-navigations (from this screen)**:
  - Link toolbar button (C.5) → Addlink Box dialog (`1002:12917`)
  - Hashtag "+" button (E.2) → Dropdown list hashtag (`1002:13013`)

### Visual Requirements

- Responsive breakpoints: 360px (mobile), 768px (tablet), 1440px (desktop — this design)
- Animations/Transitions: Modal fade-in/out with scale, overlay opacity transition
- Accessibility: WCAG AA — all interactive elements keyboard-navigable, visible focus rings, proper ARIA labels for modal, inputs, and buttons

### Keyboard Interactions

| Key | Context | Action |
|-----|---------|--------|
| `Escape` | Modal is open | Close modal (same as "Hủy") |
| `Tab` | Any field | Move focus to next interactive element |
| `Shift+Tab` | Any field | Move focus to previous interactive element |
| `Enter` | Recipient dropdown open | Select highlighted item |
| `ArrowDown/Up` | Recipient dropdown open | Navigate autocomplete suggestions |
| `Enter` | Submit button focused | Submit form |

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the modal as an overlay on top of the current page with a dark backdrop.
- **FR-002**: System MUST provide an autocomplete search dropdown for selecting the recipient ("Người nhận") from the list of colleagues.
- **FR-003**: System MUST provide a text input for "Danh hiệu" (title/badge) with a max length of 50 characters.
- **FR-004**: System MUST provide a rich-text editor with toolbar (Bold, Italic, Strikethrough, Ordered List, Link, Quote) for the message body, with a max length of 1000 characters.
- **FR-005**: System MUST support "@mention" in the message body with autocomplete for colleague names.
- **FR-006**: System MUST allow adding 1–5 hashtags. Click "+ Hashtag" opens a dropdown to select; user can also type to create a new chip. Each added hashtag appears as a chip with "x" to remove. Max 5, at least 1 required.
- **FR-007**: System MUST allow uploading 0–5 images. Click "+ Image" opens file picker; after selection, thumbnail is displayed immediately beside existing images. When 5 images are attached, the "+ Image" button MUST be hidden.
- **FR-008**: System MUST provide an anonymous send toggle that hides the sender's identity.
- **FR-009**: System MUST validate all required fields (Người nhận, Danh hiệu, message body, at least 1 hashtag) before enabling the "Gửi" button.
- **FR-010**: System MUST close the modal and discard data when "Hủy" is clicked.
- **FR-011**: System MUST show a loading state on the "Gửi" button during submission.
- **FR-012**: Modal height MUST grow with content. When content reaches the viewport height, the modal MUST become internally scrollable (`overflow-y: auto`).

### Technical Requirements

- **TR-001**: Rich-text editor MUST sanitize HTML output to prevent XSS (no raw `dangerouslySetInnerHTML` without sanitization).
- **TR-002**: Image uploads MUST be validated for file type (JPEG, PNG, WebP) and file size (max 5MB per image recommended).
- **TR-003**: Form state MUST be managed client-side (`"use client"` component) since it requires event handlers and local state.
- **TR-004**: API calls MUST validate input with Zod schemas per constitution requirements.
- **TR-005**: The recipient search MUST debounce API calls (300ms recommended).

### Key Entities *(if feature involves data)*

- **Kudo**: The main entity — contains sender, recipient, title (danh hiệu), message body (rich text), hashtags, images, anonymous flag, timestamps.
- **User/Colleague**: Referenced as sender and recipient. Searchable by name.
- **Hashtag**: Tag entity for categorization. Users can select from a pre-defined dropdown list OR type to create a new hashtag (chip). Created as a chip on input.
- **KudoImage**: Image attachment linked to a Kudo. Stored as URL references.

---

## State Management

### Local Component State (inside `WriteKudoModal`)

| State | Type | Initial Value | Description |
|-------|------|--------------|-------------|
| `selectedRecipient` | `User \| null` | `null` | Selected recipient from autocomplete |
| `recipientQuery` | `string` | `""` | Current search text for recipient field |
| `danhHieu` | `string` | `""` | Custom title/badge text (max 50 chars) |
| `editorContent` | `string` (HTML/JSON) | `""` | Rich-text message body (max 1000 chars) |
| `selectedHashtags` | `Hashtag[]` | `[]` | Array of selected hashtag objects (max 5) |
| `attachedImages` | `ImageAttachment[]` | `[]` | Array of uploaded image objects (max 5) |
| `isAnonymous` | `boolean` | `false` | Anonymous send toggle |
| `isSubmitting` | `boolean` | `false` | Loading state during form submission |
| `fieldErrors` | `Record<string, string>` | `{}` | Validation error messages per field |

### Derived State

| State | Derivation |
|-------|-----------|
| `isFormValid` | `selectedRecipient !== null && danhHieu.trim() !== "" && danhHieu.length <= 50 && editorContent.trim() !== "" && editorContent.length <= 1000 && selectedHashtags.length >= 1` |
| `canAddHashtag` | `selectedHashtags.length < 5` |
| `canAddImage` | `attachedImages.length < 5` |

### Loading & Error States

| State | Trigger | UI Behavior |
|-------|---------|-------------|
| Recipient search loading | Debounced API call in progress | Show spinner in dropdown |
| Image uploading | Image selected from file picker | Show progress indicator on thumbnail placeholder |
| Form submitting | "Gửi" clicked | Disable all fields, show spinner on submit button |
| Submission error | API returns error | Show error toast, re-enable form, keep all data |
| Submission success | API returns 200/201 | Show success toast, close modal |

### Global State

- **No global state required** — the modal is self-contained. On successful submission, the parent page (Homepage or Live board) should refetch/invalidate the kudos feed.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| /api/users/search | GET | Search colleagues by name for recipient and @mention autocomplete | Predicted |
| /api/kudos | POST | Create a new Kudo with all form data | Predicted |
| /api/kudos/upload-image | POST | Upload image attachment, return URL | Predicted |
| /api/hashtags | GET | List available hashtags for selection | Predicted |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully submit a Kudo with all required fields filled — 0 server-side validation errors for valid submissions.
- **SC-002**: Modal load time < 500ms; form submission response < 2s.
- **SC-003**: Image upload completes within 3s per image on a standard connection.
- **SC-004**: All interactive elements are keyboard-accessible and screen-reader compatible.

---

## Out of Scope

- Editing or deleting a Kudo after submission
- Notification system for the recipient (handled separately)
- Kudo feed display and filtering (separate screen/spec)
- Admin moderation of Kudos content
- Bulk Kudo sending to multiple recipients

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`)
- [ ] Database design completed (`.momorph/database.sql`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)

---

## Notes

- The design uses Montserrat font family throughout, which aligns with the overall SAA 2025 design system.
- The modal background color (#FFF8E1) is a warm cream/yellow tone consistent with the SAA brand.
- The "Tiêu chuẩn cộng đồng" (Community Standards) link in the toolbar should navigate to a community guidelines page.
- The "Danh hiệu" field serves as a custom title/badge that displays as the Kudo's headline — e.g., "Người truyền động lực cho tôi" (The person who inspires me).
- Rich-text content should be stored as sanitized HTML or a structured format (e.g., Tiptap JSON).
