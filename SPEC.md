# Spec: Space Tourism Website (Frontend Mentor)

**Status:** Draft — awaiting approval
**Date:** 2026-11-11

## Objective

Build the Frontend Mentor *Space Tourism* multi-page site (a Scrimba / Kevin Powell
collaboration) to a fidelity that matches the provided design.

- **Who it's for:** a prospective space tourist browsing a fictional operator's site.
- **What we're building:** 12 static HTML pages sharing one header/nav, one stylesheet and
  one small script.
- **Success:** every page renders like the design at the three target widths, every
  interactive element works with mouse *and* keyboard, and the site clears an
  accessibility and performance bar.
- **Secondary objective:** practice. This project exists to level up HTML/CSS/JS, so
  explicit structure, readable CSS and real accessibility work matter as much as the
  pixels.

## Scope

The starter ships **one HTML file per sub-item**, so the "tabs" in the design are real
links between pages. 12 pages total:

| Group | Pages | Shared content | Varies per page |
| --- | --- | --- | --- |
| Home | `index.html` | header, hero | — |
| Destination | `destination-moon.html`, `destination-mars.html`, `destination-europa.html`, `destination-titan.html` | header, heading, tab list | planet image, name, description, distance, travel time |
| Crew | `crew-commander.html`, `crew-mission-specialist.html`, `crew-pilot.html`, `crew-flight-engineer.html` | header, heading, dot list | photo, role, name, bio |
| Technology | `technology-vehicle.html`, `technology-spaceport.html`, `technology-capsule.html` | header, heading, number list | image (portrait/landscape), name, description |

**Out of scope:** build step, JS framework, CMS/API, the `data.json` runtime path, i18n,
analytics, backend.

## Tech Stack

- HTML5, semantic elements, no templating (no build step ⇒ the header is duplicated per page)
- CSS3 with custom properties; **no preprocessor**
- Vanilla JS, one classic `<script defer>` file for the mobile nav (no ES modules, so
  `file://` keeps working)
- No package manager, no bundler, no framework
- Fonts: Bellefair (400), Barlow Condensed (400/700), Barlow (400) — **not shipped with the
  starter**, loaded from the Google Fonts CDN with `preconnect` + `display=swap`
- Images: the 38 assets shipped with the starter

## Commands

There is no build step. Commands are for serving and checking only.

```
# Serve locally (pick one)
python -m http.server 8000          # then http://localhost:8000
# or: VS Code "Live Server" extension
# or: just double-click index.html   (works — no fetch, no modules)

# Validate markup (optional, needs Node)
npx --yes html-validate "*.html"

# Lighthouse
# Chrome DevTools -> Lighthouse -> Performance / Accessibility / Best Practices / SEO
```

## Project Structure

```
space-tourism-website/
├── index.html                  # Home
├── destination-{moon,mars,europa,titan}.html
├── crew-{commander,flight-engineer,mission-specialist,pilot}.html
├── technology-{vehicle,spaceport,capsule}.html
├── style.css                   # ALL styles, numbered sections, tokens in :root
├── js/
│   └── nav.js                  # mobile hamburger / overlay panel
├── assets/                     # 38 images from the starter (do not edit)
├── design/
│   ├── space-tourism-website.fig   # the provided design file (git-ignored)
│   ├── DESIGN-SPEC.md              # decoded tokens, components and per-screen geometry
│   └── README.md                   # Frontend Mentor's note about the design file
├── data.json                   # starter extra; unused here (kept for reference)
├── preview.jpg                 # design preview used by the README
├── README.md / README-template.md
├── .gitignore
├── SPEC.md                     # this file
└── tasks/                      # local working notes (git-ignored, not published)
```

## Code Style

Tokens first, then a numbered cascade that gets more specific downwards — the same
convention the QR project uses, so no rule ever needs `!important`.

```css
/* 1. Design tokens */
:root {
  --clr-dark: #0b0d17;
  --clr-light: #d0d6f9;
  --clr-white: #ffffff;

  --font-display: "Bellefair", serif;
  --font-condensed: "Barlow Condensed", sans-serif;
  --font-body: "Barlow", sans-serif;

  --tracking-wide: 2.7px;
  --radius-full: 50%;
}

/* 2. Reset */
/* 3. Base / typography */
/* 4. Layout utilities */
/* 5. Header + nav */
/* 6. Components (buttons, tabs, dots, numbers) */
/* 7. Pages: home, destination, crew, technology */
/* 8. Media queries (tablet 48em, desktop 75em) */
```

Conventions:

- BEM-ish class names (`header__nav`, `tabs__link`, `dots__item`) as in the QR project.
- Class names describe role, not appearance.
- No inline styles, no `!important`.
- Mobile-first: base styles are the mobile design; `@media (min-width: 48em)` and
  `@media (min-width: 75em)` layer on the tablet and desktop designs.
- The active nav item and the active tab/dot/number are marked in the HTML of each page
  (there is no server or router to compute them).

## Testing Strategy

No automated test runner: the project has no build step, and adding one is an explicit
"ask first" decision (see Boundaries).

Verification is therefore a fixed manual protocol, run before a task is marked done:

1. **Markup/CSS:** W3C validators, zero errors.
2. **Keyboard:** reach and operate every nav link, tab, dot and number with Tab /
   Shift+Tab / Enter / Space; visible focus everywhere.
3. **Responsive:** check the page at 375, 768 and 1440 px, plus a 320 px floor.
4. **Console:** zero errors or warnings in DevTools.
5. **Lighthouse:** accessibility / best practices / SEO ≥ 95, performance ≥ 90 on a
   local serve.

**Optional later:** add Playwright smoke tests (one per page group: page loads, nav works,
tabs navigate). Separate, opt-in phase.

## Boundaries

- **Always:** validate markup before marking a task done; keep every interactive element
  keyboard-operable with a visible focus style; keep contrast at WCAG AA or better; verify
  at 375 / 768 / 1440 before calling a page finished; keep the header markup identical
  across the 12 pages except for the active state.
- **Ask first:** adding any npm dependency, build step or bundler; changing a design token
  away from the design; splitting `style.css`; renaming or moving files; introducing a
  templating/includes mechanism.
- **Never:** use `!important`; use inline styles; edit, crop or recompress the provided
  images; commit secrets; drop content to make a layout fit.

## Success Criteria

1. All 12 pages exist and are reachable through the header nav.
2. At 375, 768 and 1440 px each page matches the design — layout, type scale, spacing and
   colour — with no horizontal overflow at any width from 320 to 1920 px.
3. The mobile hamburger opens and closes the nav panel; Escape closes it; focus is not
   trapped or lost.
4. Every tab, dot and number is a real link that navigates to its page, shows a visible
   active state on that page, and has a visible hover **and** focus state.
5. Lighthouse accessibility, best practices and SEO ≥ 95; performance ≥ 90; zero console
   errors on any page.
6. All text meets WCAG AA contrast.
7. No `!important`, no inline styles, no console errors.

## Design Tokens (confirmed from the Figma file)

Extracted by decoding `design/space-tourism-website.fig` (a `fig-kiwi` archive, version 70)
with a `kiwi-schema` parser. Full per-screen geometry lives in
[`design/DESIGN-SPEC.md`](design/DESIGN-SPEC.md); this is the summary.

| Token | Value |
| --- | --- |
| Dark | `#0B0D17` (hsl(230 35% 7%)) |
| Light blue | `#D0D6F9` (hsl(231 77% 90%)) |
| White | `#FFFFFF` |
| Display font | Bellefair Regular 400 |
| Condensed font | Barlow Condensed Regular 400 / Bold 700 |
| Body font | Barlow Regular 400 |

Type scale, with the line heights measured from the screens:

| Role | Family | Size | Line height | Tracking | Case |
| --- | --- | --- | --- | --- | --- |
| Home title (desktop/tablet) | Bellefair | 150px | 1.1 | 0 | — |
| Home title (mobile) | Bellefair | 80px | 1.15 | 0 | — |
| Destination name | Bellefair | 100px | 1.1 | 0 | — |
| Crew role / Technology name | Bellefair | 56px | 1.15 | 0 | UPPER |
| Crew name (mobile) | Bellefair | 24px | 1.15 | 0 | UPPER |
| Subheading 1 (stats value) | Bellefair | 28px | 1.15 | 0 | UPPER |
| Section title ("01 Pick your…") | Barlow Condensed | 28px | 1.2 | 4.725px | UPPER |
| H5 (home tagline) | Barlow Condensed | 28px | 1.2 | 4.725px | UPPER |
| Subheading 2 (stats label) | Barlow Condensed | 14px | 1.2 | 2.3625px | UPPER |
| Nav / tabs | Barlow Condensed | 16px | 1.2 | 2.7px | UPPER |
| Body | Barlow | 18px | 1.8 | 0 | — |
| Body (mobile) | Barlow | 15px | 1.8 | 0 | — |

Breakpoints: `48em` (tablet) and `75em` (desktop). Screen frames in the design are
1440×1024 (desktop), 768×1024 (tablet) and 375×812/880 (mobile).

Component specs (nav bar, EXPLORE button, tabs, dots, numbered pagination) are in
`design/DESIGN-SPEC.md` → Components.

## Resolved Decisions

| Question | Decision |
| --- | --- |
| Mentor mode or full implementation? | **Full implementation** — the agent writes the code following this plan; the user reviews. The starter's mentor `AGENTS.md` is therefore **not** copied into the project (it forbids complete solutions and would conflict). |
| Testing depth | **Manual protocol** (validators + Lighthouse + keyboard walkthrough + 3 widths). No test runner, no dependencies. Playwright stays out of scope. |
| Fonts | **Google Fonts CDN** with `preconnect` and `display=swap`. Self-hosting can be revisited in the performance task (Task 9) if the metrics ask for it. |
| CSS file count | **One `style.css`** with numbered sections, for a predictable cascade. Revisit only if it passes ~1200 lines. |
| Design file | **Used.** `design/space-tourism-website.fig` is kept in the project (git-ignored) and decoded into `design/DESIGN-SPEC.md`, which is the source of truth for every colour, size and position. |

## Open Questions

None. The design file resolved the last one.
