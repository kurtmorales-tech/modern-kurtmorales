# KurtMorales Modern Design System

## Brand Direction

Modern, sharp, fast, editorial portfolio style for a Las Vegas web designer/developer. The UI should feel premium but practical: high whitespace, crisp borders, restrained color, strong typography, and subtle motion.

## Tokens

Defined in `web/src/styles/global.css` using Tailwind v4 `@theme`.

| Token | Value | Use |
|---|---:|---|
| `--font-sans` | Inter | Body text, forms, navigation |
| `--font-display` | Space Grotesk | Hero headings and section titles |
| `--color-brand` | `#827169` | Primary CTA, accents, section emphasis |
| `--color-brand-light` | `#a08e84` | Dark-section accent, hover emphasis |
| `--color-brand-dark` | `#5e4f47` | Primary CTA hover |
| `--color-surface` | `#ffffff` | Cards and main surfaces |
| `--color-surface-alt` | `#fafaf9` | Alternating sections |
| `--color-steel` | `#64748b` | Muted copy |

## Layout Rules

- Max content width: `max-w-6xl`.
- Horizontal page padding: `px-6`.
- Large sections: `py-24` to `py-32`.
- Use `border-gray-100` section dividers.
- Prefer 2-column responsive layouts for narrative sections.
- Prefer 3-card grids for services, resources, templates, and projects.

## Component Patterns

### Cards

Use white background, subtle border, no heavy shadow by default.

```html
<div class="bg-white border border-gray-100 p-8 card-lift"></div>
```

### Primary CTA

```html
<a class="px-10 py-5 bg-brand text-white font-bold hover:bg-brand-dark transition-all duration-300 active:scale-[0.97]"></a>
```

### Secondary CTA

```html
<a class="px-10 py-5 border border-brand text-brand font-bold hover:bg-brand hover:text-white transition-all duration-300 active:scale-[0.97]"></a>
```

### Eyebrows

```html
<span class="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-6"></span>
```

## Motion

- Use scroll reveal classes from `global.css`: `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale`.
- Use short stagger delays: 60–120ms increments.
- Motion should enhance comprehension, not block access.

## Accessibility

- All pages should include `Header`, `Footer`, and `main#main-content`.
- Keep skip link in `Header.astro`.
- Interactive controls need visible focus states.
- Images must include alt text; CMS upload fields should include media alt.
- Avoid color-only meaning for status/badges.

## SEO / Resource Rules

- Every page should use `BaseLayout` title, description, and canonical.
- Use `/resources` for docs, meta-tag guidance, backlink planning, and launch support.
- Keep `/templates` dynamic via PayloadCMS with fallback data.

## Don'ts

- Do not add heavy gradients everywhere.
- Do not introduce unrelated neon colors.
- Do not use large shadows as the primary visual style.
- Do not ship interactive UI without keyboard/focus checks.
