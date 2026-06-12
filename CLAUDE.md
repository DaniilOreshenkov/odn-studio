# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # install dependencies
npm run dev        # dev server (http://localhost:5173, also exposed on 0.0.0.0)
npm run build      # production build → dist/
npm run preview    # serve the dist/ build locally
```

No linter or test runner is configured. To verify CSS brace balance after edits:
```bash
node -e "const fs=require('fs'),c=fs.readFileSync('src/styles/main.css','utf8');console.log('open',c.match(/\{/g).length,'close',c.match(/\}/g).length)"
```

To verify SVG tag balance in index.html after editing inline SVGs:
```bash
node -e "const fs=require('fs'),h=fs.readFileSync('index.html','utf8');const o=(h.match(/<svg/g)||[]).length,c=(h.match(/<\/svg>/g)||[]).length;console.log(o===c?'OK':'MISMATCH',o,c)"
```

## Architecture

Single-page landing site: one `index.html`, one `src/styles/main.css`, one `src/scripts/main.js`. Vite is used only as a dev server + bundler — there are no JS modules or imports in the source.

### Theming and i18n

- **Dark/light theme**: `<html data-theme="light|dark">`. All colour values are CSS custom properties on `:root` / `[data-theme="dark"]` at the top of `main.css`. Never hardcode colours elsewhere.
- **Bilingual (RU/EN)**: every user-facing text node sits in an element with `data-ru="…" data-en="…"`. `setLang()` in `main.js` swaps `textContent` for all such elements. Default language is `ru`.

### Page sections (in DOM order)

`hero` → `marquee` → `services` → `advantages` (stats with `data-count` countup) → `process` → `portfolio` → `contact` → `footer`

### Process section — interactive tabs (`#process`)

Uses a custom "pint" component: `.pint-nav` contains `.pint-step` buttons; `.pint-panels` contains `.pint-panel` divs. `main.js` auto-advances every 5 s (pauses on hover). The active step gets `is-active`; the ticking progress bar is driven by the `is-ticking` class + CSS animation on `.pint-prog-fill`. Each panel contains a `.pint-vis` SVG illustration.

### Portfolio section — bento grid + inline SVGs

`.port-grid` is a 3-column CSS grid. Cards `p1` and `p5` span 2 columns (`grid-column:span 2`), the rest are 1 column. Each `.port` card has:
- `.ph` (position:absolute, inset:0) — contains a full-bleed inline `<svg>` mock-up
- `.port::after` — dark gradient overlay (transparent top → opaque bottom) so `.meta` text is always readable
- `.meta` — absolute, bottom-left, z-index:2 — title `.t`, description `.c`, `.tags`
- `.badge` — absolute, top-right

**SVG conventions:**
- Wide cards (p1, p5): `viewBox="0 0 720 360"`, `preserveAspectRatio="xMidYMid slice"`
- Standard cards (p2–p4, p6): `viewBox="0 0 360 270"`, same preserveAspectRatio
- All gradient/filter `id` values must use a card-specific prefix (`p1…`, `p2…`, etc.) because all SVGs live in the same HTML document and IDs must be unique globally
- Use `fill="#fff"` (not `rgba(255,255,255,0.x)`) for text that needs to be legible

**Editing SVGs safely:** the SVG content inside each `.ph` div is very long. Use a Node.js script to replace it programmatically rather than the Edit tool (which requires exact string matching). Locate each card's `<!-- pN — … -->` comment, then find the `.ph` div that follows it:

```js
function replacePh(html, portComment, newSVG) {
  const commentIdx = html.indexOf(portComment);
  const phOpen = '<div class="ph">';
  const phStart = html.indexOf(phOpen, commentIdx);
  const contentStart = phStart + phOpen.length;
  const phEnd = html.indexOf('</div>', contentStart);
  return html.slice(0, contentStart) + newSVG + html.slice(phEnd);
}
```

### JavaScript behaviour (main.js)

All interactive behaviour lives in a single `DOMContentLoaded` callback. Key pieces:

| Feature | How it works |
|---|---|
| Scroll reveal | `IntersectionObserver` adds `.in` to `.reveal` elements |
| Stat countup | `IntersectionObserver` + rAF on `.num[data-count]` |
| Loader | `#loader` gets `.done` on `window load` + 500 ms delay |
| Scroll progress bar | `#progress` width updated on `scroll` |
| Spotlight | `#spotlight` follows mouse via `mousemove` |
| Hero rotator | `#rotator` text cycles every 2.6 s with blur transition; words come from `wordsRU`/`wordsEN` |
| Marquee clone | `#mtrack` innerHTML doubled for seamless loop |
| 3D card tilt | `mousemove`/`mouseleave` on `.port` (desktop only, guarded by matchMedia) |
| Magnetic CTA | Same pattern on `.btn-primary` |
| Terminal | `#termBody` — typed intro animation, then interactive `<input>` with command map |
| Process tabs | `#pintNav` / `#pintPanels` — see Process section above |

`toggleTheme()`, `setLang()`, and `toggleMenu()` are attached to `window` so inline `onclick` handlers in the HTML can call them.

## Deployment

Vercel: connect GitHub repo, set **Build Command** `npm run build`, **Output Directory** `dist`. No env vars required.
