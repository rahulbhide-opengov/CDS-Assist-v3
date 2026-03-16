# AI Experience Design — CDS Reference

Read this file when designing screens that involve AI assistants, chat interfaces, suggestions, generated content, confidence indicators, or automated workflows.

**Trigger keywords:** AI, assistant, agent, chat, conversational, OG Assist, suggest, recommend, generate, confidence, streaming, copilot, prompt

---

## Core Principles

1. **Transparency first.** Always show what the AI did and why. Never hide automation behind a magic result.
2. **User stays in control.** AI suggests — user confirms. No auto-applying changes without review.
3. **Graceful uncertainty.** When the AI isn't sure, say so. A confident-looking wrong answer is worse than an honest "I'm not sure."
4. **Explain, don't just execute.** Show reasoning alongside results so users can evaluate and learn.

---

## AI Response Patterns

### Streaming text response

For conversational AI (OG Assist chat):

```
Stack spacing={0}
├── Message Bubble (AI)
│   ├── Avatar: AI icon (sparkle/robot)    → 32px, primary.main background
│   ├── Typography variant="body1"          → text.primary
│   │   └── Content streams in token-by-token with blinking cursor
│   └── Stack direction="row" spacing={1} mt={1}
│       ├── IconButton size="small": ThumbUp   → action feedback
│       ├── IconButton size="small": ThumbDown
│       └── IconButton size="small": ContentCopy
```

### Structured output

For AI-generated tables, reports, or form fills:

```
Paper (elevation: card)
├── Stack direction="row" spacing={1} alignItems="center" mb={2}
│   ├── Chip size="small" icon={AutoAwesome}: "AI-generated"  → primary variant
│   └── Typography variant="caption" color="text.secondary":
│       "Review and edit before submitting"
├── Generated content (table, form fields, text block)
│   └── Each AI-filled field has a subtle left border: primary.main, 2px
└── Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}
    ├── Button variant="outlined": "Edit"
    └── Button variant="contained": "Accept"
```

### Thinking / processing indicator

While AI is working (before response starts):

```
Stack direction="row" spacing={1} alignItems="center" p={2}
├── CircularProgress size={20}              → primary.main
└── Typography variant="body2" color="text.secondary":
    "Analyzing your data..." (contextual message, not generic "Loading")
```

Contextual thinking messages:
- "Reading the document..."
- "Searching your records..."
- "Generating recommendations..."
- "Reviewing for accuracy..."

---

## Confidence Display

### Three-tier confidence model

| Level | Visual | Token | When to use |
|-------|--------|-------|-------------|
| High (>80%) | Solid chip, no qualifier | `success` | AI is confident in the result |
| Medium (50-80%) | Outlined chip + "Suggested" | `warning` | Plausible but needs review |
| Low (<50%) | Outlined chip + "Uncertain" | `text.secondary` | Best guess, likely needs correction |

### Implementation

```
Stack direction="row" spacing={1} alignItems="center"
├── Typography variant="body2": AI-generated value
└── Chip size="small" variant="outlined": confidence label
```

| Confidence | Chip label | Chip color | Icon |
|-----------|------------|-----------|------|
| High | "Confirmed" or no chip needed | `success` | CheckCircle |
| Medium | "Suggested" | `warning` | AutoAwesome |
| Low | "Needs review" | `default` | HelpOutline |

### Rules

- Never show raw confidence percentages to end users (too technical)
- Use the three-tier label system above
- Default to "Suggested" when uncertain about confidence level
- High-stakes fields (financial amounts, legal text) should always show as "Suggested" even at high confidence

---

## AI-Generated Content Indicators

Every piece of AI-generated content must be visually distinct from user-authored content.

### Visual markers

| Context | Marker | Implementation |
|---------|--------|---------------|
| Inline text | Sparkle icon + subtle background | `AutoAwesome` icon (16px) + `primary.50` bg |
| Generated card/section | "AI-generated" chip + left accent | Chip in header + 2px `primary.main` left border |
| Form field auto-filled by AI | Left accent border | 2px `primary.main` left border on the input |
| Chat message from AI | Avatar + name | AI avatar + "OG Assist" label |

### Badge pattern

```
Chip
  size="small"
  icon={<AutoAwesome sx={{ fontSize: 14 }} />}
  label="AI-generated"
  color="primary"
  variant="outlined"
```

---

## Review Workflow

The standard pattern for AI actions that affect data:

```
1. AI suggests    →  Show preview with "AI-generated" badge
2. User reviews   →  Editable fields, diff view for changes
3. User confirms  →  "Accept" / "Accept all" / "Edit and save"
4. System applies  →  Toast confirmation: "Changes applied"
```

### Review UI

```
Paper (elevation: card)
├── Typography variant="h6": "Review AI suggestions"
├── Alert severity="info" variant="outlined":
│   "OG Assist generated these changes. Review before applying."
├── Diff/preview area
│   ├── For each change:
│   │   ├── Typography variant="caption": field label
│   │   ├── Stack direction="row" spacing={2}
│   │   │   ├── Typography sx={{ textDecoration: 'line-through' }}: old value
│   │   │   └── Typography color="primary": new value
│   │   └── Checkbox: "Accept this change"
└── Stack direction="row" justifyContent="flex-end" spacing={2}
    ├── Button variant="text": "Reject all"
    ├── Button variant="outlined": "Accept selected"
    └── Button variant="contained": "Accept all"
```

---

## Error & Fallback Patterns

| Scenario | Display | Recovery |
|----------|---------|----------|
| AI can't generate a response | Alert: "I couldn't complete this request. Try rephrasing or providing more details." | Show suggested prompts |
| Low-confidence result | Show result + "Needs review" badge + explanation | Editable by user |
| AI service unavailable | Alert: "AI features are temporarily unavailable. You can continue manually." | Manual fallback always available |
| Rate limited | Alert: "You've reached the AI request limit. Try again in [time]." | Show countdown |
| Partial result | Show what was generated + warning: "This response may be incomplete." | "Regenerate" button |

### Critical rule: Manual fallback always exists

Every AI-powered feature must have a manual path. If AI is unavailable, the user can still accomplish the task (it just takes more effort). Never create AI-only workflows with no fallback.

---

## Conversational UI Components

### Chat message layout

```
Stack spacing={2} p={2}
├── Message (user)
│   ├── Stack direction="row-reverse" spacing={1}
│   │   ├── Avatar: user initials                → 32px
│   │   └── Paper sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2 }}
│   │       └── Typography variant="body1": user message
│   └── Typography variant="caption" textAlign="right": timestamp
├── Message (AI)
│   ├── Stack direction="row" spacing={1}
│   │   ├── Avatar: AI sparkle icon               → 32px, primary.main bg
│   │   └── Paper sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, border: 1, borderColor: 'divider' }}
│   │       └── Typography variant="body1": AI response (supports markdown)
│   └── Typography variant="caption": timestamp
```

### Input area

```
Paper elevation={2} sx={{ p: 1, position: 'sticky', bottom: 0 }}
├── TextField
│   fullWidth
│   multiline
│   maxRows={4}
│   placeholder="Ask OG Assist..."
│   InputProps={{ endAdornment: <IconButton><Send /></IconButton> }}
└── Stack direction="row" spacing={1} mt={1} (optional suggested prompts)
    ├── Chip variant="outlined" size="small" clickable: "Summarize this page"
    ├── Chip variant="outlined" size="small" clickable: "Find similar records"
    └── Chip variant="outlined" size="small" clickable: "Draft a response"
```

### Suggested prompts

Show when the conversation is empty or after an AI response to guide the user:

- Max 3-4 suggestions
- Use Chip components with `variant="outlined"` and `clickable`
- Label should be a complete action: "Summarize this page" — not "Summary"

---

## Loading States for AI Content

| Content type | Loading pattern |
|-------------|----------------|
| Streaming text | Blinking cursor at end of partial text |
| Structured data (table, list) | Skeleton matching expected layout (3-5 rows) |
| Single value (form fill) | Skeleton text in the field + shimmer |
| Card/section | Full skeleton card outline |
| Chat response | Typing indicator (three animated dots) in AI message bubble |

---

## Token Usage

| Element | Token |
|---------|-------|
| AI message background | `background.paper` with `divider` border |
| User message background | `grey.100` |
| AI avatar background | `primary.main` |
| AI-generated badge | `primary` color, outlined variant |
| Confidence: high | `success` color |
| Confidence: medium | `warning` color |
| Confidence: uncertain | `secondary` or `default` |
| Thinking indicator | `primary.main` spinner, `text.secondary` text |
| AI accent border | `primary.main`, 2px left border |
| Chat input area | `background.paper`, elevation 2 |

---

## Accessibility for AI Features

- Streaming text: use `aria-live="polite"` on the message container so screen readers announce new content
- AI-generated badges: ensure "AI-generated" text is readable, not just icon-based
- Confidence indicators: include the level in text ("Suggested — medium confidence"), not just color
- Thinking/loading states: announce via `aria-live`: "OG Assist is generating a response"
- Chat input: label the input field with `aria-label="Message OG Assist"`
- Keyboard navigation: Enter to send, Shift+Enter for newline, Escape to close chat panel
