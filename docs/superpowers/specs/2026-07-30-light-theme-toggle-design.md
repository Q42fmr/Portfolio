# Light theme toggle — design

Date: 2026-07-30
Status: approved

## Goal

Add a light theme to the portfolio site plus a header button that toggles
between the current dark theme and the new light theme, persisting the
choice across visits.

## Scope

**In scope:** `index.html` (uk) and `en/index.html` — the two full portfolio
pages with header/nav, hero, about, skills, projects, resume, contact,
project modal, footer.

**Out of scope (explicitly, per user decision):**
- `projects/*.html`, `en/projects/*.html` — standalone project detail pages.
  They link the shared `assets/css/style.css` but use no custom classes from
  it, so they are unaffected by the CSS-variable change below. They get a
  static `class="dark"` on `<html>` purely to pin `color-scheme: dark` (native
  scrollbar/form-control rendering) so they don't visually drift once the
  stylesheet's `:root` default becomes light. No toggle button is added
  there.
- `portfolio/*` demo folders (ecommerce-landing, portfolio-template,
  Assistant) — standalone demo mini-sites, don't link `style.css` at all.
  Untouched.

## Approach

Tailwind is loaded via the Play CDN with an inline `tailwind.config` already
present in both in-scope pages. Today every color utility class is a literal
dark-palette value (`bg-slate-950`, `text-slate-100`, `text-slate-300`, ...)
with no `dark:` variant anywhere — dark is implicitly the only theme.

Switch to Tailwind's `class`-strategy dark mode:

- `tailwind.config.darkMode = 'class'`.
- The site's **light** palette becomes the unprefixed (base) utility classes.
- The **existing dark** palette is preserved by adding a `dark:` variant with
  the current value to every color utility touched.
- Dark/light is toggled by adding/removing a `dark` class on `<html>`.

Default theme for a new visitor is **dark** (matches current identity).
Once a user picks a theme, it's remembered via `localStorage` under key
`theme` (`"dark" | "light"`).

## Anti-flash-of-wrong-theme

A small inline `<script>` runs at the very top of `<head>` (before the
Tailwind CDN script), synchronously setting the `dark` class on
`<html>` based on `localStorage.getItem('theme')`, defaulting to dark if
unset or unreadable (e.g. private browsing):

```html
<script>
  (function () {
    var stored = null;
    try { stored = localStorage.getItem('theme'); } catch (e) {}
    document.documentElement.classList.toggle('dark', stored !== 'light');
  })();
</script>
```

## Color class conversions (index.html / en/index.html only)

Every occurrence of these classes gets a light base + `dark:` variant.
Mapping (Tailwind slate scale, chosen for comparable contrast, not a
mechanical inversion):

| Current (dark-only) | New (light base / `dark:` variant) | Used for |
|---|---|---|
| `bg-slate-950` | `bg-white` / `dark:bg-slate-950` | page, modal panel bg |
| `bg-slate-950/95` | `bg-white/90` / `dark:bg-slate-950/95` | sticky header bg |
| `bg-slate-900/70` | `bg-slate-50` / `dark:bg-slate-900/70` | hero card bg |
| `bg-slate-900/60` | `bg-slate-50` / `dark:bg-slate-900/60` | resume article bg |
| `text-slate-100` | `text-slate-900` / `dark:text-slate-100` | headings, primary text |
| `text-slate-200` | `text-slate-700` / `dark:text-slate-200` | modal stack text |
| `text-slate-300` | `text-slate-600` / `dark:text-slate-300` | body copy |
| `text-slate-400` | `text-slate-500` / `dark:text-slate-400` | muted labels |
| `border-slate-800` | `border-slate-200` / `dark:border-slate-800` | header/card/footer borders |
| `border-slate-700` | `border-slate-300` / `dark:border-slate-700` | menu-toggle, GitHub link borders |
| `border-slate-600` | `border-slate-300` / `dark:border-slate-600` | CV download button border |
| `hover:text-slate-200` | `hover:text-slate-900` / `dark:hover:text-slate-200` | footer back-to-top |

Brand/accent colors (`text-brand`, `bg-brand`, `text-accent`, `hover:*`) are
unchanged — they read fine on both backgrounds.

## `assets/css/style.css` — CSS custom properties

Custom classes (`.nav-link`, `.hero-card`, `.skill-badge`, `.project-card`,
`.project-screen*`, `.project-modal*`, `.form-field`) currently hardcode
`rgb()`/`rgba()` dark values. Replace with CSS variables:

```css
:root {
  color-scheme: light;
  --surface-1: 255 255 255;   /* page/modal bg */
  --surface-2: 248 250 252;   /* card bg (slate-50) */
  --surface-3: 241 245 249;   /* skill badge bg (slate-100) */
  --border-1: 226 232 240;    /* slate-200 */
  --border-2: 203 213 225;    /* slate-300 */
  --text-1: 15 23 42;         /* slate-900 primary */
  --text-2: 71 85 105;        /* slate-600 secondary */
  --text-3: 100 116 139;      /* slate-500 muted */
  --nav-link: 100 116 139;
  --modal-backdrop: 226 232 240;
}

:root.dark {
  color-scheme: dark;
  --surface-1: 2 6 23;        /* slate-950 */
  --surface-2: 15 23 42;      /* slate-900 */
  --surface-3: 30 41 59;      /* slate-800 */
  --border-1: 30 41 59;       /* slate-800 */
  --border-2: 51 65 85;       /* slate-700 */
  --text-1: 241 245 249;      /* slate-100 */
  --text-2: 203 213 225;      /* slate-300 */
  --text-3: 148 163 184;      /* slate-400 */
  --nav-link: 148 163 184;
  --modal-backdrop: 2 6 23;
}
```

Each affected rule switches its literal `rgb()`/`rgba()` to
`rgb(var(--token))` / `rgb(var(--token) / <alpha>)`, preserving today's exact
dark-mode visuals under `:root.dark` and defining a matching light look under
plain `:root`. Gradients inside `.project-screen` (brand/accent radial
glows) are left as-is — they work on both backgrounds; only the base
`linear-gradient` dark wash becomes token-driven so it lightens in light
mode.

## Toggle button

One button in the header bar (shared by desktop and mobile layouts — it's
outside the collapsible `#mobile-menu`, so it's always visible regardless of
viewport), placed between the logo link and the existing `#menu-toggle`
hamburger button:

```html
<button
  id="theme-toggle"
  type="button"
  class="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-300 text-slate-600 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-300"
  aria-label="Перемкнути тему" <!-- "Toggle theme" in en/index.html -->
  aria-pressed="true"
>
  <svg class="hidden h-4 w-4 dark:block" ...><!-- moon --></svg>
  <svg class="block h-4 w-4 dark:hidden" ...><!-- sun --></svg>
</button>
```

Icon swap is pure CSS (`dark:hidden` / `hidden dark:block`) — no JS DOM
manipulation for the icon itself. `aria-pressed` reflects whether dark mode
is currently active, kept in sync by the toggle handler and on initial load.

## JS (`assets/js/main.js`)

```js
const THEME_KEY = "theme";
const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;

function setStoredTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    /* localStorage unavailable (private mode, etc.) */
  }
}

if (themeToggle) {
  themeToggle.setAttribute("aria-pressed", String(root.classList.contains("dark")));
  themeToggle.addEventListener("click", () => {
    const nextIsDark = !root.classList.contains("dark");
    root.classList.toggle("dark", nextIsDark);
    themeToggle.setAttribute("aria-pressed", String(nextIsDark));
    setStoredTheme(nextIsDark ? "dark" : "light");
  });
}
```

No cross-tab sync, no system-preference (`prefers-color-scheme`) listener —
explicitly rejected by the user in favor of a fixed dark default.

## Testing / verification

No build step (Tailwind Play CDN, static HTML/CSS/JS) — verification is
manual/browser-driven:

1. Load `index.html` fresh (no `localStorage` entry) → dark theme, no flash.
2. Click toggle → page switches to light theme instantly, all sections
   (hero, about, skills, projects grid, resume, contact, project modal,
   footer) readable with adequate contrast, icon swaps to sun/moon
   correctly, `aria-pressed` updates.
3. Reload → theme choice persists (localStorage).
4. Repeat for `en/index.html`.
5. Open a project modal in light mode → modal panel, backdrop, and text use
   the light tokens correctly.
6. Load `projects/assistant.html` (or any project detail / demo page) →
   still renders dark, unaffected by the toggle or the CSS variable change.
