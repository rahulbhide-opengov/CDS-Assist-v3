# Data Visualization — CDS Reference

Read this file when the design involves charts, graphs, KPIs, metrics, trends, or analytics dashboards.

**Trigger keywords:** dashboard, chart, graph, KPI, metric, trend, analytics, sparkline, donut, bar chart, line chart, visualization

---

## Chart Type Selection

Pick the simplest chart that answers the user's question. Never use a complex chart when a simpler one works.

| User question | Chart type | When to avoid |
|--------------|-----------|---------------|
| "How much of the total?" | Donut / Pie (max 5 segments) | >5 categories — use horizontal bar instead |
| "How does it change over time?" | Line chart | <3 data points — use a table instead |
| "Compare amounts across categories" | Horizontal bar | >15 categories — paginate or group |
| "Compare two time series" | Multi-line (max 3 lines) | >3 lines — split into small multiples |
| "Show distribution" | Histogram or box plot | Small datasets (<20 points) — use table |
| "Quick trend at a glance" | Sparkline (inline, no axes) | When precision matters — use a full chart |
| "Single key number" | KPI card (no chart needed) | When context/comparison is needed — add sparkline |

### Forbidden chart types

- No 3D charts (ever — distorts data perception)
- No dual y-axes (confuses scale comparison — use two separate charts)
- No radar/spider charts (hard to read, poor accessibility)
- No gauge/speedometer charts (use a progress bar or KPI card)

---

## CDS Data Color Palette

Use these colors in order for multi-series data. All pairs pass WCAG AA contrast against white backgrounds.

| Series | Hex | CDS Token | Use |
|--------|-----|-----------|-----|
| 1 (primary) | `#4b3fff` | `primary.main` | First/most important series |
| 2 | `#0288d1` | `info.main` | Second series |
| 3 | `#2e7d32` | `success.main` | Third series |
| 4 | `#ed6c02` | `warning.main` | Fourth series |
| 5 | `#546574` | `secondary.main` | Fifth series |
| 6 | `#d32f2f` | `error.main` | Sixth series (or reserved for negative) |

### Semantic color rules

| Meaning | Color | Token |
|---------|-------|-------|
| Positive / up / growth | Green | `success.main` |
| Negative / down / decline | Red | `error.main` |
| Neutral / no change | Grey | `text.secondary` |
| Target / benchmark | Dashed line | `secondary.main` |
| Projected / forecast | Dotted line, reduced opacity | `primary.main` at 40% |

Never rely on color alone — always pair with an icon (arrow up/down), label, or pattern.

---

## KPI Card Anatomy

```
Paper (elevation: card)
├── Typography caption: "Total Revenue"          → text.secondary
├── Typography h3: "$2.4M"                       → text.primary
├── Stack direction="row" spacing={1}
│   ├── Chip size="small": "+12.5%"             → success.main (or error)
│   │   └── Icon: ArrowUpward (or ArrowDownward)
│   └── Typography caption: "vs last quarter"    → text.secondary
└── Sparkline (optional, 48px height)            → primary.main
```

### Token usage

| Element | Token |
|---------|-------|
| Card background | `background.paper` |
| Metric label | `text.secondary`, variant: `caption` |
| Metric value | `text.primary`, variant: `h3` |
| Positive trend chip | `success` color prop |
| Negative trend chip | `error` color prop |
| Neutral trend chip | `secondary` color prop |
| Sparkline color | `primary.main` |
| Card elevation | `card` shadow token |
| Card padding | `spacing(3)` (12px) |
| Card border radius | 4px (CDS default) |

### KPI card sizing

| Breakpoint | Cards per row | Card min-width |
|-----------|--------------|----------------|
| Desktop (1440) | 4 | 280px |
| Tablet (768) | 2 | 300px |
| Mobile (390) | 1 | full width |

Use `Grid` with `xs={12} sm={6} md={3}` for responsive KPI card rows.

---

## Chart Container Rules

### Standard chart frame

```
Paper (elevation: card)
├── Stack direction="row" justifyContent="space-between" alignItems="center"
│   ├── Typography variant="h5": chart title     → text.primary
│   └── Actions: [filter dropdown, time range toggle]
├── Divider                                       → divider token
├── Chart area (min-height: 300px desktop, 200px mobile)
└── Legend (below chart, horizontal wrap)
```

### Typography in charts

| Element | CDS Variant | Size | Weight |
|---------|------------|------|--------|
| Chart title | `h5` | 16px | 600 |
| Axis labels | `caption` | 12px | 500 |
| Axis tick values | `body2` | 12px | 400 |
| Tooltip header | `subtitle2` | 14px | 500 |
| Tooltip values | `body2` | 12px | 400 |
| Legend labels | `caption` | 12px | 500 |
| Data labels (if shown) | `caption` | 12px | 500 |

### Axis rules

- Y-axis: always start at 0 for bar charts (line charts may use auto-scale)
- Include units in axis label ("Revenue ($K)", "Users (thousands)")
- Max 5-7 tick marks on any axis
- Gridlines: light grey (`grey.200`) horizontal only, no vertical gridlines
- Axis lines: `divider` color token

---

## Chart States

| State | What to show |
|-------|-------------|
| Loading | Skeleton rectangle matching chart dimensions |
| Error | Alert severity="error" with retry button |
| Empty | Illustration + "No data for this period" + suggestion to adjust filters |
| Partial | Render available data + info banner "Some data may be incomplete" |
| Single point | Show the value as a KPI card, not a chart with one data point |

---

## Responsive Behavior

| Breakpoint | Behavior |
|-----------|----------|
| Desktop (1440) | Charts side-by-side in Grid (md=8 + md=4 or md=6 + md=6) |
| Tablet (768) | Charts stack vertically, full width. Reduce chart height to 240px. |
| Mobile (390) | Charts stack, full width, 200px height. Legends below, wrapped. Tooltips on tap instead of hover. |

### Mobile-specific rules

- Replace hover tooltips with tap-to-reveal
- Collapse filter bar into a "Filters" button that opens a bottom sheet
- Simplify axis labels (abbreviate months: "Jan" not "January")
- Hide secondary Y-axis data; show as a separate chart below

---

## Accessibility Checklist

- Every chart must have an `aria-label` describing its purpose ("Revenue trend over the last 12 months")
- Provide a data table alternative (visually hidden or toggled) for screen readers
- Never rely on color alone: use patterns, labels, or shapes to differentiate series
- Minimum contrast ratio for data elements: 3:1 against background
- Announce trend direction in text ("Revenue increased 12.5% vs last quarter"), not just visually
- Interactive charts: keyboard navigable (arrow keys to move between data points)
