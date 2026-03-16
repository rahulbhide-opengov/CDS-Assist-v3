# UX Copywriting — CDS Reference

Read this file when creating or reviewing UI labels, headings, descriptions, error messages, empty states, tooltips, or any user-facing text.

**Trigger keywords:** label, copy, text, heading, description, error message, empty state, tooltip, placeholder, help text, button text, notification

---

## Gov Tone Principles

All text in government SaaS products follows these rules:

1. **Active voice, present tense.** "The system saves your changes" — not "Your changes will be saved by the system."
2. **Plain language.** Target 8th-grade reading level. Avoid jargon, acronyms (unless universally known), and legalese.
3. **Direct address.** Use "you" and "your" — not "the user" or "one."
4. **Be specific.** "Save draft" — not "Submit." "Export as CSV" — not "Download."
5. **No exclamation marks.** Professional, calm tone. Urgency comes from placement and color, not punctuation.
6. **Sentence case everywhere.** "Create new report" — not "Create New Report." Exception: product names and proper nouns.

---

## Headings

### Page titles

- Action-oriented: verb + noun when possible ("Manage users", "Review submissions")
- For overview pages: noun is fine ("Dashboard", "Reports")
- Max 3-4 words
- CDS variant: `h4` (20px/600) for page titles inside `CDSPageHeader`

### Section titles

- Describe the content group, not decoration ("Contact information", "Recent activity")
- CDS variant: `h5` (16px/600) or `h6` (14px/600)
- Never use section titles alone — always follow with content or an empty state

### Card/widget titles

- Short noun phrase ("Revenue", "Active users", "Pending approvals")
- CDS variant: `h6` or `subtitle1` depending on hierarchy level

---

## Button Labels

### Rules

- Always a **specific verb** (or verb + object): "Save draft", "Submit application", "Export CSV"
- Never generic: ~~"OK"~~, ~~"Click here"~~, ~~"Submit"~~ (submit what?), ~~"Yes"~~
- Max 2-3 words for primary actions, up to 4 for secondary
- Destructive actions must name what's being destroyed: "Delete report" — not "Delete"

### Common patterns

| Action | Label | Variant |
|--------|-------|---------|
| Create new item | "Create [item]" | `contained` primary |
| Save without publishing | "Save draft" | `contained` primary |
| Submit for review | "Submit for review" | `contained` primary |
| Cancel ongoing action | "Cancel" | `outlined` secondary |
| Delete item | "Delete [item]" | `outlined` error |
| Navigate back | "Back" or "Back to [list]" | `text` secondary |
| Export data | "Export" or "Export as CSV" | `outlined` secondary |
| Add to list | "Add [item]" | `text` primary or `outlined` primary |
| Dismiss notification | "Dismiss" | `text` secondary |
| Retry failed action | "Try again" | `contained` primary |

### Dialog button order

- Destructive dialogs: secondary action left ("Cancel"), destructive right ("Delete report")
- Confirmation dialogs: secondary action left ("Cancel"), primary right ("Confirm")
- Always use `color="error"` for destructive actions

---

## Error Messages

### Formula: What happened + How to fix it

Every error message has two parts:

1. **What went wrong** (brief, no blame)
2. **What the user can do** (specific action)

### Patterns

| Scenario | Bad | Good |
|----------|-----|------|
| Required field | "This field is required" | "Enter a name to continue" |
| Invalid email | "Invalid email" | "Enter a valid email address (e.g., jane@city.gov)" |
| Server error | "Error 500" | "Something went wrong. Try again, or contact support if this continues." |
| Permission denied | "Access denied" | "You don't have permission to edit this report. Contact your admin." |
| Upload failed | "Upload error" | "This file couldn't be uploaded. Check that it's under 10 MB and in PDF or DOCX format." |
| Timeout | "Request timeout" | "This is taking longer than expected. Try again." |
| Duplicate entry | "Duplicate found" | "A report with this name already exists. Use a different name." |

### Rules

- Never blame the user: ~~"You entered an invalid email"~~ → "Enter a valid email address"
- Never use error codes alone: ~~"Error 422"~~ → human-readable message
- Inline validation errors appear below the field in `error.main` color, variant `caption`
- Toast/snackbar errors for system issues (network, server)
- Alert component for page-level errors

---

## Empty States

### Formula: What will appear here + How to get started

```
Stack alignItems="center" spacing={2} py={6}
├── Illustration or Icon (48px, secondary.main)
├── Typography variant="h6": "No [items] yet"
├── Typography variant="body2" color="text.secondary":
│   "When you create [items], they'll appear here."
└── Button variant="contained": "Create first [item]"
```

### Variations

| Context | Heading | Description | Action |
|---------|---------|-------------|--------|
| First-time (no data exists) | "No reports yet" | "Create your first report to get started." | "Create report" |
| Filtered to nothing | "No results found" | "Try adjusting your filters or search terms." | "Clear filters" |
| Search with no match | "No results for '[query]'" | "Check your spelling or try a broader search." | (none — keep search active) |
| Permission restricted | "You don't have access" | "Contact your admin to request access to [feature]." | "Request access" |

---

## Placeholder Text

- Show a **format example**, not an instruction
- Good: `jane@city.gov` — Bad: `Enter your email address`
- Good: `(555) 123-4567` — Bad: `Type your phone number`
- Good: `Search by name or ID...` — Bad: `Enter search query`
- Placeholder text disappears on focus — never put critical info here

---

## Help Text & Tooltips

### When to use which

| Need | Use | Implementation |
|------|-----|---------------|
| Always-visible context for a field | Help text | `FormHelperText` below the field |
| Supplemental info (non-critical) | Tooltip | `Tooltip` on info icon next to label |
| Complex explanation | Inline expandable | "Learn more" link or collapsible section |

### Help text rules

- One sentence max
- Below the input field
- Variant: `caption`, color: `text.secondary`
- Example: "This name will appear on all public-facing reports."

### Tooltip rules

- Max 2 short sentences
- Triggered by hover (desktop) or tap (mobile) on an info icon (`InfoOutlined`)
- Never put critical or required information in a tooltip — it's easily missed

---

## Character Limits

| Element | Max characters | Guidance |
|---------|---------------|----------|
| Page title | 40 | Concise, action-oriented |
| Section heading | 50 | Descriptive noun phrase |
| Button label | 25 | Verb + object |
| Table column header | 20 | Abbreviate if needed ("Dept" not "Department") |
| Tooltip | 120 | 1-2 sentences |
| Help text | 80 | 1 sentence |
| Error message | 120 | What happened + how to fix |
| Empty state heading | 30 | "No [items] yet" |
| Empty state description | 80 | What will appear + how to start |
| Snackbar message | 60 | Brief confirmation or error |
| Placeholder text | 30 | Format example |

---

## Accessibility & Copy

- `aria-label` must match or closely describe the visible label. If a button shows "Save draft", the `aria-label` should be "Save draft" — not "Click to save the current document as a draft."
- Icon-only buttons always require `aria-label`: e.g., `<IconButton aria-label="Delete row">`
- Error messages must be associated with their field via `aria-describedby` (MUI handles this with `error` and `helperText` props)
- Status changes announced to screen readers: use `aria-live="polite"` for non-critical updates, `aria-live="assertive"` for errors
- Avoid using "above" / "below" / "left" / "right" — screen reader users have no spatial context
