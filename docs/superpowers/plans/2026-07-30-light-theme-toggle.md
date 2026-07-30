# Light Theme Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a light theme to `index.html` and `en/index.html` plus a header button that toggles between dark (default) and light, persisted in `localStorage`.

**Architecture:** Tailwind Play CDN `darkMode: 'class'`. Light becomes the base (unprefixed) utility classes; the current dark look is preserved via `dark:`-prefixed variants, toggled by a `dark` class on `<html>`. Custom CSS classes in `assets/css/style.css` move from hardcoded `rgb()` to CSS custom properties, light values under `:root`, dark values under `:root.dark`.

**Tech Stack:** Static HTML, Tailwind Play CDN (no build step), vanilla JS, plain CSS. No test runner exists in this repo — verification is browser-driven per task.

## Global Constraints

- Scope is `index.html` and `en/index.html` only. `projects/*.html`, `en/projects/*.html`, and `portfolio/*` demo folders are NOT getting a toggle; the two project-detail-page groups get a static `class="dark"` pin so their look doesn't drift (see Task 5).
- Default theme for a visitor with no stored preference is **dark**. No `prefers-color-scheme` detection.
- Theme choice persists via `localStorage` key `theme` (`"dark"` or `"light"`).
- No new dependencies, no build step. Keep edits to the four files below plus the six out-of-scope HTML files (attribute-only change).
- Follow the mapping in `docs/superpowers/specs/2026-07-30-light-theme-toggle-design.md` exactly — do not invent different shades.

---

### Task 1: CSS custom properties in `assets/css/style.css`

**Files:**
- Modify: `assets/css/style.css:1-3` (root block), and the custom classes `.nav-link`, `.hero-card`, `.skill-badge`, `.project-card`, `.project-screen`, `.project-screen-label`, `.project-modal-backdrop`, `.project-modal-panel`, `.project-modal-close`, `.form-field`, `.form-field:focus`.

**Interfaces:**
- Produces: CSS custom properties `--surface-1`, `--surface-2`, `--surface-3`, `--border-1`, `--border-2`, `--text-1`, `--text-2`, `--text-3`, `--nav-link`, `--modal-backdrop` (each an `R G B` triplet, no commas, for use in `rgb(var(--x))` / `rgb(var(--x) / <alpha>)`), scoped light by default and dark under `:root.dark`. Task 3/4 rely on `:root.dark` being the selector toggled by the `dark` class Tailwind also uses.

- [ ] **Step 1: Replace the `:root` block (lines 1-3) with tokens**

Current:
```css
:root {
  color-scheme: dark;
}
```

New:
```css
:root {
  color-scheme: light;
  --surface-1: 255 255 255;
  --surface-2: 248 250 252;
  --surface-3: 241 245 249;
  --border-1: 226 232 240;
  --border-2: 203 213 225;
  --text-1: 15 23 42;
  --text-2: 71 85 105;
  --text-3: 100 116 139;
  --nav-link: 100 116 139;
  --modal-backdrop: 226 232 240;
}

:root.dark {
  color-scheme: dark;
  --surface-1: 2 6 23;
  --surface-2: 15 23 42;
  --surface-3: 30 41 59;
  --border-1: 30 41 59;
  --border-2: 51 65 85;
  --text-1: 241 245 249;
  --text-2: 203 213 225;
  --text-3: 148 163 184;
  --nav-link: 148 163 184;
  --modal-backdrop: 2 6 23;
}
```

- [ ] **Step 2: Convert `.nav-link` to tokens**

Current:
```css
.nav-link {
  color: rgb(148 163 184);
  transition: color 0.2s ease;
}
```

New:
```css
.nav-link {
  color: rgb(var(--nav-link));
  transition: color 0.2s ease;
}
```

- [ ] **Step 3: Convert `.skill-badge` to tokens**

Current:
```css
.skill-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 0.75rem;
  border: 1px solid rgb(51 65 85);
  background: rgba(15, 23, 42, 0.7);
  padding: 0.7rem 0.9rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgb(226 232 240);
}
```

New:
```css
.skill-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 0.75rem;
  border: 1px solid rgb(var(--border-2));
  background: rgb(var(--surface-3) / 0.7);
  padding: 0.7rem 0.9rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgb(var(--text-1));
}
```

- [ ] **Step 4: Convert `.project-card` to tokens**

Current:
```css
.project-card {
  border: 1px solid rgb(51 65 85);
  background: rgba(15, 23, 42, 0.6);
  border-radius: 0.9rem;
  padding: 1.25rem;
  transition: border-color 0.25s ease, transform 0.25s ease;
}
```

New:
```css
.project-card {
  border: 1px solid rgb(var(--border-2));
  background: rgb(var(--surface-3) / 0.6);
  border-radius: 0.9rem;
  padding: 1.25rem;
  transition: border-color 0.25s ease, transform 0.25s ease;
}
```

(`.project-card:hover` keeps its literal teal `rgb(20 184 166)` — brand accent, unchanged on both themes.)

- [ ] **Step 5: Convert `.project-screen` and `.project-screen-label` to tokens**

Current:
```css
.project-screen {
  position: absolute;
  border: 1px solid rgb(51 65 85);
  border-radius: 0.75rem;
  background:
    radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.35), transparent 45%),
    radial-gradient(circle at 70% 30%, rgba(20, 184, 166, 0.28), transparent 42%),
    linear-gradient(160deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.82));
  box-shadow: 0 16px 26px -18px rgba(8, 47, 73, 0.9);
}
```

New:
```css
.project-screen {
  position: absolute;
  border: 1px solid rgb(var(--border-2));
  border-radius: 0.75rem;
  background:
    radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.35), transparent 45%),
    radial-gradient(circle at 70% 30%, rgba(20, 184, 166, 0.28), transparent 42%),
    linear-gradient(160deg, rgb(var(--surface-2) / 0.95), rgb(var(--surface-3) / 0.82));
  box-shadow: 0 16px 26px -18px rgba(8, 47, 73, 0.35);
}
```

(Box-shadow alpha reduced from `0.9` to `0.35` — the shadow reads fine on a dark backdrop at high alpha but would look like a black smear on a light card; this is the one deliberate deviation from a literal token swap, called out here so it isn't mistaken for a mapping bug.)

Current:
```css
.project-screen-label {
  display: inline-block;
  margin: 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  padding: 0.15rem 0.55rem;
  font-size: 0.65rem;
  color: rgb(203 213 225);
}
```

New:
```css
.project-screen-label {
  display: inline-block;
  margin: 0.6rem;
  border-radius: 999px;
  border: 1px solid rgb(var(--nav-link) / 0.45);
  padding: 0.15rem 0.55rem;
  font-size: 0.65rem;
  color: rgb(var(--text-2));
}
```

- [ ] **Step 6: Convert `.project-modal-backdrop`, `.project-modal-panel`, `.project-modal-close` to tokens**

Current:
```css
.project-modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(2, 6, 23, 0.82);
}
```

New:
```css
.project-modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgb(var(--modal-backdrop) / 0.82);
}
```

Current:
```css
.project-modal-panel {
  position: relative;
  z-index: 1;
  margin: 5vh auto;
  width: min(700px, calc(100vw - 2rem));
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgb(51 65 85);
  border-radius: 1rem;
  background: rgb(15 23 42);
  padding: 1.25rem 1.25rem 1.5rem;
}
```

New:
```css
.project-modal-panel {
  position: relative;
  z-index: 1;
  margin: 5vh auto;
  width: min(700px, calc(100vw - 2rem));
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgb(var(--border-2));
  border-radius: 1rem;
  background: rgb(var(--surface-2));
  padding: 1.25rem 1.25rem 1.5rem;
}
```

Current:
```css
.project-modal-close {
  position: absolute;
  right: 0.8rem;
  top: 0.8rem;
  border: 1px solid rgb(71 85 105);
  border-radius: 0.5rem;
  width: 2rem;
  height: 2rem;
  color: rgb(226 232 240);
}
```

New:
```css
.project-modal-close {
  position: absolute;
  right: 0.8rem;
  top: 0.8rem;
  border: 1px solid rgb(var(--border-2));
  border-radius: 0.5rem;
  width: 2rem;
  height: 2rem;
  color: rgb(var(--text-1));
}
```

- [ ] **Step 7: Convert `.form-field` and `.form-field:focus` to tokens**

Current:
```css
.form-field {
  width: 100%;
  border-radius: 0.6rem;
  border: 1px solid rgb(71 85 105);
  background: rgba(2, 6, 23, 0.75);
  padding: 0.65rem 0.8rem;
  color: rgb(241 245 249);
  outline: none;
  transition: border-color 0.2s ease;
}

.form-field:focus {
  border-color: rgb(37 99 235);
}
```

New:
```css
.form-field {
  width: 100%;
  border-radius: 0.6rem;
  border: 1px solid rgb(var(--border-2));
  background: rgb(var(--surface-1) / 0.75);
  padding: 0.65rem 0.8rem;
  color: rgb(var(--text-1));
  outline: none;
  transition: border-color 0.2s ease;
}

.form-field:focus {
  border-color: rgb(37 99 235);
}
```

- [ ] **Step 8: Verify by reading the file back**

Run: read `assets/css/style.css` and confirm no raw `rgb(15 23 42)`, `rgb(51 65 85)`, `rgba(15, 23, 42, ...)`, `rgb(2 6 23)`, `rgb(148 163 184)`, `rgb(226 232 240)`, `rgb(203 213 225)`, `rgb(241 245 249)`, `rgb(71 85 105)` remain in the classes touched above. `rgba(37, 99, 235, ...)`, `rgba(20, 184, 166, ...)`, `rgb(37 99 235)`, `rgb(20 184 166)` (brand/accent) are expected to remain untouched.
Expected: only brand/accent literals remain; every slate literal is gone from the touched rules.

- [ ] **Step 9: Commit**

```bash
git add assets/css/style.css
git commit -m "style: drive theme colors via CSS custom properties"
```

---

### Task 2: Theme toggle logic in `assets/js/main.js`

**Files:**
- Modify: `assets/js/main.js` (add near the top, after existing `const` element lookups around line 15; modify the contact-form success handler around line 240-241).

**Interfaces:**
- Consumes: a button with `id="theme-toggle"` on `<html>`'s document (added in Task 3/4). Absence is handled gracefully (no-op) so this task doesn't hard-depend on Task 3/4 landing first.
- Produces: click handler that toggles `dark` class on `document.documentElement` and persists `theme` in `localStorage`. No exported functions — this is a top-level script like the rest of `main.js`.

- [ ] **Step 1: Add theme toggle constants and handler**

Insert after line 16 (`const isEnglish = document.documentElement.lang === "en";`):

```js
const THEME_KEY = "theme";
const themeToggle = document.getElementById("theme-toggle");
const rootEl = document.documentElement;

function setStoredTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    /* localStorage unavailable (private mode, etc.) */
  }
}

if (themeToggle) {
  themeToggle.setAttribute("aria-pressed", String(rootEl.classList.contains("dark")));
  themeToggle.addEventListener("click", () => {
    const nextIsDark = !rootEl.classList.contains("dark");
    rootEl.classList.toggle("dark", nextIsDark);
    themeToggle.setAttribute("aria-pressed", String(nextIsDark));
    setStoredTheme(nextIsDark ? "dark" : "light");
  });
}
```

- [ ] **Step 2: Fix contact-form success feedback color for light mode**

Current (around line 240-241):
```js
    feedback.classList.remove("text-rose-300");
    feedback.classList.add("text-emerald-300");
```

New:
```js
    feedback.classList.remove("text-rose-600", "dark:text-rose-300");
    feedback.classList.add("text-emerald-600", "dark:text-emerald-300");
```

(Task 3/4 will change the feedback element's initial class from `text-rose-300` to `text-rose-600 dark:text-rose-300` so the error state also has light-mode contrast — see Task 3 Step 2 / Task 4 Step 2.)

- [ ] **Step 3: Manual sanity check**

Run: read `assets/js/main.js:1-30` and `:235-245` to confirm both edits landed and no syntax typos (matching braces, semicolons consistent with file style).
Expected: `themeToggle` block present near top; `classList.remove`/`add` calls use the four-class-name form above.

- [ ] **Step 4: Commit**

```bash
git add assets/js/main.js
git commit -m "feat: add theme toggle click handler"
```

---

### Task 3: Wire up `index.html` (Ukrainian)

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `:root.dark` tokens from Task 1, `#theme-toggle` handler from Task 2.
- Produces: `dark` class managed on `<html>`; button `id="theme-toggle"` for Task 2 to bind to.

- [ ] **Step 1: Add `darkMode: 'class'` to the Tailwind config**

Current (lines 20-31):
```html
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              brand: "#2563eb",
              accent: "#14b8a6"
            }
          }
        }
      };
    </script>
```

New:
```html
    <script>
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              brand: "#2563eb",
              accent: "#14b8a6"
            }
          }
        }
      };
    </script>
```

- [ ] **Step 2: Add the anti-flash inline script and update the `<body>` tag**

Insert immediately before the `<script src="https://cdn.tailwindcss.com"></script>` line (line 19), i.e. as the first script in `<head>`:

```html
    <script>
      (function () {
        var stored = null;
        try {
          stored = localStorage.getItem("theme");
        } catch (e) {}
        document.documentElement.classList.toggle("dark", stored !== "light");
      })();
    </script>
```

Change the `<body>` tag (line 34) from:
```html
  <body class="bg-slate-950 text-slate-100 antialiased">
```
to:
```html
  <body class="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased">
```

- [ ] **Step 3: Insert the theme-toggle button in the header**

Insert between the logo link (line 37) and the `#menu-toggle` button (starts line 38):

```html
        <button
          id="theme-toggle"
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-300 text-slate-600 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-300"
          aria-label="Перемкнути тему"
          aria-pressed="true"
        >
          <svg class="block h-4 w-4 dark:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
          </svg>
          <svg class="hidden h-4 w-4 dark:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"></path>
          </svg>
        </button>
```

The first `<svg>` (circle + rays = sun) is `block dark:hidden` — visible only in light mode. The second `<svg>` (crescent = moon) is `hidden dark:block` — visible only in dark mode. Each icon depicts the theme currently active, not the action the click performs.

- [ ] **Step 4: Run the mechanical color-class conversion**

This single pass replaces every bare slate/rose/emerald color token in `index.html`'s body with its light-base + `dark:`-variant pair, per the design spec's mapping table. Run via the `eval` tool (Python), not by hand-editing each occurrence:

```python
import re

path = "index.html"
text = open(path, encoding="utf-8").read()

# Ordered: more specific (slash-suffixed) tokens before their bare prefix.
replacements = [
    ("bg-slate-950/95", "bg-white/90 dark:bg-slate-950/95"),
    ("bg-slate-900/70", "bg-slate-50 dark:bg-slate-900/70"),
    ("bg-slate-900/60", "bg-slate-50 dark:bg-slate-900/60"),
    ("bg-slate-950", "bg-white dark:bg-slate-950"),
    ("hover:text-slate-200", "hover:text-slate-900 dark:hover:text-slate-200"),
    ("text-slate-100", "text-slate-900 dark:text-slate-100"),
    ("text-slate-200", "text-slate-700 dark:text-slate-200"),
    ("text-slate-300", "text-slate-600 dark:text-slate-300"),
    ("text-slate-400", "text-slate-500 dark:text-slate-400"),
    ("border-slate-800", "border-slate-200 dark:border-slate-800"),
    ("border-slate-700", "border-slate-300 dark:border-slate-700"),
    ("border-slate-600", "border-slate-300 dark:border-slate-600"),
    ("text-rose-300", "text-rose-600 dark:text-rose-300"),
]

pattern = re.compile("|".join(re.escape(old) for old, _ in replacements))
lookup = dict(replacements)
count = 0

def _sub(match):
    global count
    count += 1
    return lookup[match.group(0)]

# Skip the <body> tag and header button already hand-edited in Steps 2-3:
# re.sub over the whole file is safe here because those two spots were edited
# to their FINAL light/dark form already, and none of the bare tokens above
# appear as standalone tokens inside an already-inserted "dark:xxx" pair
# (matches are found in original text order, left to right, non-overlapping).
text = pattern.sub(_sub, text)
open(path, "w", encoding="utf-8").write(text)
print(f"replacements applied: {count}")
```

Expected output: `replacements applied: 33` (count is illustrative — the exact number depends on final occurrence counts; what matters is the run completes without error and the number is greater than 0).

**IMPORTANT:** Run Step 2 and Step 3 (the hand-edits to `<body>` and the header button) *before* this script, OR run this script first and then apply steps 2-3 by hand — do not apply Step 2/3's hand-written snippets a second time after the script runs, since the script does not touch text inside `<script>` tags differently than body text (it's a plain string replace across the whole file). If Steps 2-3 are done first, their inserted text already contains `dark:` pairs and will NOT be double-processed, because each token in the replacement list is matched once, left-to-right, in original-file order, per the `re.sub` single pass. Recommended order: **Step 2 and 3 first, then Step 4.**

- [ ] **Step 5: Verify no bare tokens remain**

```python
import re
text = open("index.html", encoding="utf-8").read()
bare_pattern = re.compile(
    r'(?<!dark:)(?<!-)\b(?:bg-slate-950(?!/)|bg-slate-900/(?:70|60)(?!\s*dark)|text-slate-(?:100|200|300|400)\b|border-slate-(?:800|700|600)\b|text-rose-300\b)'
)
# Simple heuristic check: every occurrence of a bare-mapped token should be
# immediately preceded somewhere on the same class="..." by a "dark:" pair.
# Easiest concrete check: count occurrences of "dark:bg-slate-950" etc. and
# confirm they equal the count of the base classes.
for token in ["bg-slate-950", "text-slate-100", "text-slate-300", "text-slate-400",
              "border-slate-800", "border-slate-700", "border-slate-600", "text-rose-300"]:
    total = len(re.findall(re.escape(token), text))
    darked = len(re.findall("dark:" + re.escape(token), text))
    print(token, "total:", total, "dark-prefixed:", darked)
```

Expected: for every token, `total == darked` (every occurrence is the `dark:`-prefixed one; the light-base replacement introduced a *different* class name, e.g. `bg-white`, so it doesn't count toward `total`).

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: add light theme support and toggle button to index.html"
```

---

### Task 4: Wire up `en/index.html` (English)

**Files:**
- Modify: `en/index.html`

**Interfaces:**
- Consumes: `:root.dark` tokens from Task 1, `#theme-toggle` handler from Task 2.
- Produces: `dark` class managed on `en/index.html`'s `<html>`; button `id="theme-toggle"` for Task 2's handler to bind to. `aria-label` text is `"Toggle theme"` (English copy, distinct from the Ukrainian page's `"Перемкнути тему"`).

- [ ] **Step 1: Add `darkMode: 'class'` to the Tailwind config**

Current (`en/index.html` lines 23-34):
```html
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              brand: "#2563eb",
              accent: "#14b8a6"
            }
          }
        }
      };
    </script>
```

New:
```html
    <script>
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              brand: "#2563eb",
              accent: "#14b8a6"
            }
          }
        }
      };
    </script>
```

- [ ] **Step 2: Add the anti-flash inline script and update `<body>`**

Insert immediately before `en/index.html` line 22 (`<script src="https://cdn.tailwindcss.com"></script>`), i.e. as the first script in `<head>`:

```html
    <script>
      (function () {
        var stored = null;
        try {
          stored = localStorage.getItem("theme");
        } catch (e) {}
        document.documentElement.classList.toggle("dark", stored !== "light");
      })();
    </script>
```

`<body>` tag change (line 37), from:
```html
  <body class="bg-slate-950 text-slate-100 antialiased">
```
to:
```html
  <body class="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased">
```

- [ ] **Step 3: Insert the theme-toggle button in the header**

Insert between the logo link (line 40: `<a href="#hero" class="text-lg font-semibold tracking-tight">Alexandr Portfolio</a>`) and the `#menu-toggle` button (starts line 41):

```html
        <button
          id="theme-toggle"
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-300 text-slate-600 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-300"
          aria-label="Toggle theme"
          aria-pressed="true"
        >
          <svg class="block h-4 w-4 dark:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
          </svg>
          <svg class="hidden h-4 w-4 dark:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"></path>
          </svg>
        </button>
```

Same sun/moon visibility rule as Task 3 Step 3: sun (`block dark:hidden`) shows in light mode, moon (`hidden dark:block`) shows in dark mode.

- [ ] **Step 4: Run the mechanical color-class conversion**

Run Steps 2-3 first (so their inserted `dark:` pairs aren't re-matched), then run this Python script via the `eval` tool:

```python
import re

path = "en/index.html"
text = open(path, encoding="utf-8").read()

replacements = [
    ("bg-slate-950/95", "bg-white/90 dark:bg-slate-950/95"),
    ("bg-slate-900/70", "bg-slate-50 dark:bg-slate-900/70"),
    ("bg-slate-900/60", "bg-slate-50 dark:bg-slate-900/60"),
    ("bg-slate-950", "bg-white dark:bg-slate-950"),
    ("hover:text-slate-200", "hover:text-slate-900 dark:hover:text-slate-200"),
    ("text-slate-100", "text-slate-900 dark:text-slate-100"),
    ("text-slate-200", "text-slate-700 dark:text-slate-200"),
    ("text-slate-300", "text-slate-600 dark:text-slate-300"),
    ("text-slate-400", "text-slate-500 dark:text-slate-400"),
    ("border-slate-800", "border-slate-200 dark:border-slate-800"),
    ("border-slate-700", "border-slate-300 dark:border-slate-700"),
    ("border-slate-600", "border-slate-300 dark:border-slate-600"),
    ("text-rose-300", "text-rose-600 dark:text-rose-300"),
]

pattern = re.compile("|".join(re.escape(old) for old, _ in replacements))
lookup = dict(replacements)
count = 0

def _sub(match):
    global count
    count += 1
    return lookup[match.group(0)]

text = pattern.sub(_sub, text)
open(path, "w", encoding="utf-8").write(text)
print(f"replacements applied: {count}")
```

Expected: script completes without error, `replacements applied` is greater than 0.

- [ ] **Step 5: Verify no bare tokens remain**

```python
import re
text = open("en/index.html", encoding="utf-8").read()
for token in ["bg-slate-950", "text-slate-100", "text-slate-300", "text-slate-400",
              "border-slate-800", "border-slate-700", "border-slate-600", "text-rose-300"]:
    total = len(re.findall(re.escape(token), text))
    darked = len(re.findall("dark:" + re.escape(token), text))
    print(token, "total:", total, "dark-prefixed:", darked)
```

Expected: `total == darked` for every token.

- [ ] **Step 6: Commit**

```bash
git add en/index.html
git commit -m "feat: add light theme support and toggle button to en/index.html"
```

---

### Task 5: Pin out-of-scope project pages to dark

**Files:**
- Modify: `projects/assistant.html:2`, `projects/ecommerce-landing.html:2`, `projects/portfolio-template.html:2`, `en/projects/assistant.html:2`, `en/projects/ecommerce-landing.html:2`, `en/projects/portfolio-template.html:2`

**Interfaces:**
- None — these pages get no toggle, no JS wiring, no color-class changes. Only the root `<html>` tag's `class` attribute changes so `:root.dark` tokens in `assets/css/style.css` (Task 1) keep applying to them, preserving `color-scheme: dark` for native form/scrollbar rendering.

- [ ] **Step 1: Add `class="dark"` to each of the six `<html>` tags**

For the three Ukrainian pages, change:
```html
<html lang="uk">
```
to:
```html
<html lang="uk" class="dark">
```

For the three English pages, change:
```html
<html lang="en">
```
to:
```html
<html lang="en" class="dark">
```

(Apply individually to each of the six files listed above — every one currently starts `<html lang="uk">` or `<html lang="en">` on line 2.)

- [ ] **Step 2: Verify**

```bash
grep -l 'class="dark"' projects/*.html en/projects/*.html
```
Expected: all six file paths printed.

- [ ] **Step 3: Commit**

```bash
git add projects/*.html en/projects/*.html
git commit -m "chore: pin project detail pages to dark color-scheme"
```

---

### Task 6: End-to-end manual verification

**Files:** none (verification only).

**Interfaces:** none.

- [ ] **Step 1: Verify default dark load (uk)**

Open `index.html` in a browser with a clean profile / cleared `localStorage` for the origin (or use a private window). Confirm: page renders dark (matches pre-change appearance), header shows a moon icon in the toggle button, no flash of light theme before dark applies.

- [ ] **Step 2: Verify toggle to light (uk)**

Click the theme-toggle button. Confirm: page switches to light theme instantly — header, hero, about, skills badges, projects grid cards (open one via click to check the modal), resume cards, contact form fields, footer all render with readable light-mode colors (no white-on-white or dark-on-dark text). Icon swaps to sun. `aria-pressed` is now `"false"` (inspect via devtools).

- [ ] **Step 3: Verify persistence (uk)**

Reload the page. Confirm: light theme persists (no flash of dark before light applies), toggle button still shows sun icon.

- [ ] **Step 4: Verify mobile layout (uk)**

Resize viewport below the `md` breakpoint (or use devtools device toolbar). Confirm: theme-toggle button is visible and functional in the mobile header layout (outside the collapsible menu), hamburger menu still opens/closes correctly next to it.

- [ ] **Step 5: Repeat Steps 1-4 for `en/index.html`**

Same checks, confirm English copy is unaffected and `aria-label="Toggle theme"` reads correctly via devtools accessibility panel.

- [ ] **Step 6: Verify contact form success/error colors in both themes**

In light mode, submit the contact form with all fields empty → confirm the "required fields" message is legible red (`text-rose-600`). Fill in a valid name/email/message → confirm the success message is legible green (`text-emerald-600`). Switch to dark mode and repeat — confirm original `text-rose-300` / `text-emerald-300` colors still show.

- [ ] **Step 7: Verify out-of-scope pages are unaffected**

Open `projects/assistant.html` (or any of the other five pinned pages). Confirm: still renders dark exactly as before this change, no toggle button present.

- [ ] **Step 8: Final check — no leftover bare tokens**

```bash
grep -rn 'class="[^"]*\bbg-slate-950\b[^"]*"' index.html en/index.html | grep -v 'dark:bg-slate-950'
```
Expected: no output (empty) — confirms Task 3/4 Step 5's verification holds after all edits landed together.
