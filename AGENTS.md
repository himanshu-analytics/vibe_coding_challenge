# AGENTS.md

This file provides guidance to agents (i.e., ADAL) when working with code in this repository.

---

## TL;DR

This is a **visual landing-page cloning challenge** for TribeTask — a household chore management SaaS. Two separate Next.js 16 projects exist (`landing_page` v1 and `landing_page_v2` v2) with different themes, fonts, and section completeness. The goal is to clone/build the TribeTask landing page to match the visual reference in `ref_screenshot.png`.

---

## Essential Commands

Both projects are independent — **always `cd` into the project directory first**.

```bash
# Dev server (runs on :3000 by default)
cd landing_page && npm run dev
cd landing_page_v2 && npm run dev

# Run both simultaneously — specify ports
cd landing_page && npm run dev -- --port 3000
cd landing_page_v2 && npm run dev -- --port 3001

# Build + lint
npm run build
npm run lint

# Install deps after adding packages
npm install <package>
```

> **Gotcha**: Both projects have separate `node_modules`. Running `npm install` at the repo root does nothing — install in each subdirectory.

> **Gotcha**: No test suite configured in either project. `npm test` will fail.

---

## Project Comparison

| | `landing_page` (v1) | `landing_page_v2` (v2) |
|---|---|---|
| **Theme** | Light (`#F6F4EE` bg, `#001B10` text, `#066F41` green) | Dark (`#0d0f14` bg, `#6EE7B7` accent) |
| **Fonts** | Hanken Grotesk (sans) + Libre Caslon Text (serif/italic) | DM Sans (body) + Sora (headings) |
| **Extra libs** | `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge` | None beyond Next.js |
| **Sections** | Navbar, Hero, Features, WhoItsFor (4, no Footer) | Hero, SocialProof, Features, HowItWorks, WhoItsFor, Testimonials, Pricing, CTA (8 + Navbar/Footer) |
| **Navbar/Footer location** | Inside `page.tsx` | In `layout.tsx` (wraps all pages) |

---

## Architecture & Non-Obvious Relationships

### Tailwind v4 Syntax (Breaking Change from v3)

Both projects use **Tailwind CSS v4** — the config system is completely different:

```css
/* globals.css — v4 syntax */
@import "tailwindcss";        /* NOT @tailwind base/components/utilities */

@theme {
  --color-brand-dark: #001B10;
  --color-brand-green: #066F41;
  --font-sans: var(--font-hanken), ui-sans-serif, ...;
}
```

- CSS variables declared in `@theme {}` **automatically become Tailwind utilities**: `bg-brand-dark`, `text-brand-green`, `text-accent`, etc.
- No `tailwind.config.js` exists or is needed — all customization lives in `globals.css`.
- Standard v3 `theme.extend` patterns do NOT work here.

### Font Loading Pattern

Fonts are loaded in `layout.tsx` via `next/font/google` and injected as CSS variables:

```tsx
// v1: Hanken Grotesk → --font-hanken → font-sans utility
// v2: DM Sans → --font-dm-sans → font-sans utility
//     Sora   → --font-sora
```

To use a font in a component: `className="font-sans"` (body) or `className="font-serif italic"` (v1 serif accent).

### v2 Layout Wrapping

In v2, `Navbar` and `Footer` are mounted in `layout.tsx` — **do not add them again inside page sections**. All 8 section components in `page.tsx` sit between the layout's nav and footer automatically.

### Component Location Convention

```
src/components/
  layout/     → Navbar.tsx, Footer.tsx (chrome, appears on every page)
  sections/   → Hero.tsx, Features.tsx, etc. (full-width page blocks)
  ui/         → Reusable primitives (Button, Card, Badge)
```

Section components are imported directly into `page.tsx` and rendered in order top-to-bottom — no routing, no dynamic loading.

---

## Reference Materials

| File | Purpose |
|---|---|
| `ref_screenshot.png` | **Primary visual target** — what the final page should look like |
| `tribetask-landing.html` | Static HTML reference for copy/structure extraction |
| `website-clone-guide.md` | Full visual-cloning methodology (6-step recipe) |
| `AGENTS.md.bak` | Product requirements / domain spec (TribeTask feature definitions, DB schema, RLS policies) |

---

## Visual Cloning Workflow (Critical for this Project)

See `website-clone-guide.md` for the full recipe. Key shortcuts:

### Screenshot Comparison (Always Use Absolute Paths)

```bash
# Stitch reference + local side-by-side for comparison
python3 -c "
from PIL import Image
i1 = Image.open('/Users/hims/bootcamp/vibe_coding_challenge/ref_screenshot.png')
i2 = Image.open('/Users/hims/bootcamp/vibe_coding_challenge/local_latest.png')
h = min(i1.height, i2.height)
i1 = i1.resize((int(i1.width * h / i1.height), h))
i2 = i2.resize((int(i2.width * h / i2.height), h))
dst = Image.new('RGB', (i1.width + i2.width, h))
dst.paste(i1, (0, 0)); dst.paste(i2, (i1.width, 0))
dst.save('/Users/hims/bootcamp/vibe_coding_challenge/combined.png')
"
```

### Multi-Tab Browser Management

When comparing reference site and local dev in separate browser tabs:
1. `mcp_chrome-devtools_list_pages` → get pageIds
2. `mcp_chrome-devtools_select_page(pageId=X)` → explicitly focus tab before screenshot
3. **Never assume the active tab** — always select explicitly or you'll screenshot the wrong page

### Extracting Exact CSS Tokens

```javascript
// In mcp_chrome-devtools_evaluate_script — targeted extraction only
() => {
  const el = document.querySelector('h1');
  const s = window.getComputedStyle(el);
  return { color: s.color, fontSize: s.fontSize, letterSpacing: s.letterSpacing, lineHeight: s.lineHeight };
}
```

> **Gotcha**: Do NOT call full `getComputedStyle` — returns 500+ properties and overwhelms context.

### When an Effect Looks Too Complex

Run the background media detector before guessing with CSS:

```javascript
() => {
  const bgs = [];
  document.querySelectorAll('*').forEach(el => {
    const s = window.getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if ((s.position === 'fixed' || s.position === 'absolute') &&
        r.width >= window.innerWidth * 0.8 && r.height >= window.innerHeight * 0.5 &&
        el.tagName !== 'BODY') {
      bgs.push({ tag: el.tagName, html: el.outerHTML.substring(0, 300) });
    }
  });
  return JSON.stringify(bgs, null, 2);
}
```

Result tells you if it's a `<video>` (drop the URL in), `<canvas>` (use React Three Fiber + GLSL), or layered CSS divs.

---

## Key Gotchas

- **Framer Motion is only in v1** — if adding scroll/entrance animations to v2, run `npm install framer-motion` in `landing_page_v2/` first.
- **`lucide-react` is only in v1** — same applies for icons in v2.
- **v2 has no `ui/` components yet** — nothing reusable lives there; build Button/Card there if adding interactivity.
- **Font variable names differ between projects**: v1 uses `--font-hanken` / `--font-libre`, v2 uses `--font-dm-sans` / `--font-sora`. Do not mix these across projects.
- **Both projects have separate `.git` repos** — commits in `landing_page/` don't appear in `landing_page_v2/` and vice versa.
- **Tailwind color utilities mirror `@theme` variable names exactly**: `--color-brand-dark` → `bg-brand-dark`, `--color-accent` → `bg-accent`. The `--color-` prefix is stripped automatically.
- **Scrollbar/overflow**: v2 `globals.css` sets `overflow-x: hidden` on body — account for this when debugging horizontal layout issues.
<END_OF_CONTENT>}}]