# Kurt Morales — Design Specification
> Minimal dark theme · Centered hero · High contrast

---

## Typography

### Font Stack

| Role | Font | Weight | Source |
|------|------|--------|--------|
| Display / Headings | `Syne` | 700 | Google Fonts |
| Body / UI | `DM Sans` | 300, 400, 500 | Google Fonts |
| Mono / Code | `JetBrains Mono` | 400 | Google Fonts |

```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono&display=swap');
```

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `--text-hero` | 72px | 700 | 1.0 | Hero headline |
| `--text-xl` | 32px | 700 | 1.2 | Section headings |
| `--text-lg` | 20px | 400 | 1.5 | Sub-headings |
| `--text-base` | 15px | 300 | 1.7 | Body copy |
| `--text-sm` | 12px | 500 | 1.4 | Labels, badges, caps |

### Rules

- Letter spacing: `-0.04em` on hero, `-0.02em` on headings, `0.08em` on uppercase labels
- Never use `font-weight: 600` or `700` on body text
- Uppercase labels always paired with `letter-spacing: 0.08em`
- Max line length: `60ch` for body copy

---

## Color

### Palette

```css
:root {
  /* Backgrounds */
  --bg-base:        #0e0c14;   /* Page background */
  --bg-surface:     #13111a;   /* Nav, cards */
  --bg-elevated:    #1a1825;   /* Hover states, inputs */

  /* Text */
  --text-primary:   #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.45);
  --text-muted:     rgba(255, 255, 255, 0.22);

  /* Brand */
  --accent:         #f97316;   /* Orange — CTAs, highlights */
  --accent-hover:   #ea6c0a;
  --accent-glow:    rgba(249, 115, 22, 0.15);

  /* Semantic */
  --color-live:     #22c55e;   /* Available badge dot */

  /* Borders */
  --border-subtle:  rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.12);
}
```

### Usage Rules

- `--accent` is reserved for **one** primary CTA per section only
- No colored text except `--accent` on select headings
- Borders are always `rgba` — never solid opaque lines
- Backgrounds must layer: `--bg-base` → `--bg-surface` → `--bg-elevated`

---

## Layout

### Grid

```css
:root {
  --max-width:   1100px;
  --gutter:      40px;       /* Desktop side padding */
  --gutter-sm:   20px;       /* Mobile side padding */
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--gutter);
}
```

### Spacing Scale

```css
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-6:   24px
--space-8:   32px
--space-12:  48px
--space-16:  64px
--space-24:  96px
```

### Breakpoints

| Name | Width | Behavior |
|------|-------|----------|
| `sm` | 480px | Single column |
| `md` | 768px | Nav collapses |
| `lg` | 1024px | Full layout |

---

## Navigation

### Structure

```
[Logo]                    [Nav Links]                    [Actions]
Kurt · Morales    Home  Services  Projects  |  Blog  About    Contact  ☀
```

### Specs

- Height: `64px`
- Background: `--bg-surface` with `backdrop-filter: blur(12px)` for sticky
- Bottom border: `1px solid var(--border-subtle)`
- Logo: `Syne 700`, 16px, white + orange
- Nav links: `DM Sans 400`, 13px, `--text-secondary` default, `--text-primary` on hover/active
- Link padding: `6px 12px`, `border-radius: 6px`
- Hover background: `rgba(255,255,255,0.05)`
- Divider between link groups: `1px solid var(--border-subtle)`, height `16px`
- Contact button: `--accent` fill, `border-radius: 20px`, `padding: 8px 18px`
- Position: `sticky top: 0`, `z-index: 100`

---

## Hero Section

### Layout

```
┌─────────────────────────────────────────┐
│                                         │
│          ● AVAILABLE FOR PROJECTS       │
│                                         │
│       Purposeful design.                │
│       Fast performance.                 │
│                                         │
│    High-performance web experiences     │
│    focused on clarity & conversion.     │
│                                         │
│      [ Let's Talk ]  [ Portfolio ]      │
│                                         │
└─────────────────────────────────────────┘
```

### Specs

- Alignment: `text-align: center`
- Vertical padding: `120px` top / `100px` bottom
- Max content width: `680px`, centered with `margin: 0 auto`
- Headline: `Syne 700`, 72px, `-0.04em` letter spacing
- Hero alternates white/orange on key words — never full orange
- Subtext: `DM Sans 300`, 15px, `--text-secondary`, max `56ch`
- CTA row: `display: flex; gap: 12px; justify-content: center`
- Badge: pill shape, `border: 1px solid var(--border-default)`, `border-radius: 20px`
- Background: subtle radial gradient — purple top-right, orange bottom-center, very low opacity (`0.12–0.18`)

### CTA Buttons

| Button | Style |
|--------|-------|
| Primary | `--accent` fill · white text · `border-radius: 24px` · `padding: 13px 28px` |
| Secondary | Transparent · `border: 1px solid var(--border-default)` · white text |

---

## Components

### Badge / Status Pill
```css
border: 1px solid var(--border-default);
border-radius: 20px;
padding: 5px 14px 5px 10px;
font-size: 11px;
font-weight: 500;
letter-spacing: 0.08em;
text-transform: uppercase;
color: var(--text-secondary);
```

### Cards
```css
background: var(--bg-surface);
border: 1px solid var(--border-subtle);
border-radius: 12px;
padding: 24px;
```

### Dividers
```css
border: none;
border-top: 1px solid var(--border-subtle);
```

---

## Motion

- Default transition: `all 0.15s ease`
- Hover scale on buttons: `transform: scale(0.97)` on `:active`
- Page load: staggered fade-up on hero elements (`opacity 0→1`, `translateY 16px→0`)
- No looping animations — motion is purposeful, not decorative

---

## Principles

1. **Restraint over decoration** — every element earns its place
2. **One accent** — orange is used sparingly; diluting it weakens the brand
3. **Whitespace is structure** — generous padding replaces decorative dividers
4. **Hierarchy through size** — avoid using color to create hierarchy; use scale
5. **Mobile-first** — design at 375px, enhance upward