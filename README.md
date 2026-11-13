# Frontend Mentor - Space tourism website solution

This is a solution to the [Space tourism website challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/space-tourism-multipage-website-gRWj1URZ3).
Twelve static pages, one stylesheet and one small script, built from the Figma file that
ships with the challenge.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [Running it locally](#running-it-locally)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- View the optimal layout on a phone, a tablet and a desktop
- Navigate between the 12 pages from the header, and between the items of each section
  from the tabs, dots and numbered circles
- See a hover state and a visible keyboard focus state on every interactive element
- Open and close the mobile navigation panel, including with the `Escape` key
- Read every page with a screen reader: landmarks, headings in order, accurate names for
  links and images, and contrast at WCAG AA or better

The site has 12 pages: home, four destinations (Moon, Mars, Europa, Titan), four crew
members and three technologies. Each of those items is a real page, so the "tabs" in the
design are ordinary links — no client-side routing, no content swapping.

The starter's `data.json` is left in place for reference but is not used: the content is
already in the markup, so nothing is fetched at runtime. (Its image paths point at
`./assets/...` folders that do not exist in this flat `assets/` layout anyway.)

### Links

- Solution URL: [github.com/vicxxsotop-rgb/space-tourism-website](https://github.com/vicxxsotop-rgb/space-tourism-website)
- Live Site URL: [vicxxsotop-rgb.github.io/space-tourism-website](https://vicxxsotop-rgb.github.io/space-tourism-website/)

## Running it locally

There is no build step, no dependency and no package manager:

```text
Open index.html in a browser.
```

That works because the page uses a classic `<script defer>` rather than ES modules, so the
mobile menu also works from the local filesystem (`file://`). If you prefer a server — for
example to test how the fonts and images behave over HTTP — any static server does, from
the project root:

```bash
npx serve .
# or
python -m http.server 8000
```

## My process

I treated the Figma file as the source of truth and measured it before writing CSS. The
`.fig` is a `fig-kiwi` archive, so I decoded it into a geometry document (frame sizes,
positions, type sizes, colours, letter-spacing) and used that instead of eyeballing the
screens. Two things came out of it that are easy to miss by eye:

- The navigation's active/hover indicator is the **bottom 3px of a full-height item**, not
  an underline under the text. The bar is 96px on tablet and 136px on desktop, and the
  rule sits on its bottom edge.
- The mobile menu panel is 254px wide, has 133px of top padding before the first item and
  uses `rgba(11,13,23,0.15)` plus `backdrop-filter: blur(80px)`.

From there I worked mobile-first: tokens and reset first, then base typography, layout
utilities, header, components and finally the page sections, with the tablet (`48em`) and
desktop (`75em`) rules last so they always win without `!important`. The stylesheet is one
file with eight numbered sections; the 41 design tokens live in `:root`. Every fluid value
uses `clamp()` or `min()` with the design value as the maximum, so the design holds at its
own widths and degrades gracefully below 375px instead of overflowing.

The mobile panel is driven by a single piece of state: `nav.js` flips only
`aria-expanded` on the button (plus the scroll-lock class), and the stylesheet reads that
attribute to slide the panel in. Because the visual state is derived from the ARIA state,
they cannot disagree. Two details make the interaction behave like an app rather than a CSS
demo: `Escape` closes the panel and returns focus to the button, and `overflow: hidden` on
`html` stops the page behind the panel from scrolling.

I measured the result instead of trusting it. Each page was rendered in a fresh same-origin
iframe at 375, 768 and 1440px (and swept from 320 to 1920) and compared with the decoded
geometry. That caught a real bug: with the nav links only as tall as their text, the glass
bar was 19.2px tall and the active rule sat under the text instead of on the bar's edge.

The last pass was accessibility. A skip link is the first tab stop on every page, `main`
carries `id="main" tabindex="-1"`, `aria-current="page"` marks the active page in the
header and the active item in each section, and every styled list keeps its list semantics
with `role="list"` (Safari drops them when `list-style: none` is used). Touch targets are
44px wherever the layout allows — the crew dots can only reach 26px before they collide —
using invisible `::before` areas that do not move a pixel.

### Built with

- Semantic HTML5: `header` / `main` / `nav` landmarks, one `h1` per page, an `h2` naming
  the current item on the inner pages
- CSS custom properties for all colours, type sizes, spacing and radii
- Flexbox and CSS Grid
- `clamp()` / `min()` for fluid type and spacing
- Mobile-first CSS, two breakpoints (`48em`, `75em`)
- BEM-style class names (`home__hero`, `header__link`, `destination__info`)
- `<picture>` with `media` for the art-directed technology images
- One 64-line vanilla script (`js/nav.js`) for the mobile menu, no framework
- Google Fonts (Barlow Condensed 400/700, Barlow 400, Bellefair 400) via CDN with
  `preconnect` and `display=swap`
- W3C HTML and CSS validators, Lighthouse, and the keyboard as the test suite

### What I learned

**Let the ARIA state drive the visuals.** Instead of toggling an `.is-open` class to show
the panel, the stylesheet keys off `aria-expanded` itself, so there is one source of truth:

```css
.header__toggle[aria-expanded="true"] ~ .header__nav {
  transform: translateX(0);
  visibility: visible;
}
```

**A 44px target does not have to move the design.** The crew dots are 10px circles with a
16px gap, so they can only grow to 26px before they collide. The rest use a pseudo-element
that extends the hit area without touching layout:

```css
.technology__number::before {
  content: "";
  position: absolute;
  inset: -0.1875rem; /* 38px padding box + 3px each side = 44px */
}
```

**Measure the design, then measure the page.** Comparing frame geometry taught me that
"looks right" and "is right" are different things: the nav bar bug above was invisible in a
quick look but obvious in a measurement (the links were 19.2px tall and their rule sat under
the text, while the decoded component said the rule was the bottom of a 96/136px cell).

**Performance is mostly about not doing things.** The pages score 97–100 on Lighthouse with
zero total blocking time because there is no framework, no build step and one small script.
The remaining cost is the Google Fonts stylesheet (a third-party render-blocking request),
which is a conscious trade-off, noted below.

### Continued development

- **Self-host the fonts.** Lighthouse estimates 830–900ms of render-blocking time from the
  Google Fonts stylesheet on a throttled connection. Four WOFF2 files served from the same
  origin would remove that round trip; the design would not change.
- **Optional smoke tests.** One Playwright test per page group (page loads, nav works, a
  tab navigates) would lock in the behaviour the manual protocol checks today.

### Useful resources

- [MDN Web Docs](https://developer.mozilla.org/) — the reference for `clamp()`,
  `backdrop-filter`, `aria-current` and everything else used here.
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) — used to verify
  the text colours instead of guessing.
- [W3C Nu HTML Checker](https://validator.w3.org/nu/) and the
  [W3C CSS Validator](https://jigsaw.w3.org/css-validator/) — zero errors on all 12 pages.
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview) — the performance and
  accessibility numbers in this README come from it.
- [Kevin Powell's Scrimba course](https://scrimba.com/learn/spacetravel) — the companion
  course for this challenge, useful for comparing approaches to the same design.

### AI Collaboration

I used **OpenCode** as a research assistant to read the design file and to work through
questions and problems — not to write the site. The HTML, `style.css` and `js/nav.js` in
this repository were written by me.

- **What I used the assistant for:** decoding the `.fig` into `design/DESIGN-SPEC.md`
  (frame sizes, type scale, colours, letter-spacing), answering questions about how the
  Figma file is organised, and talking through specific problems such as the nav bar's
  height and the focus ring at the edge of the header.
- **What I decided:** the static multi-page approach (the tabs are links, not client-side
  tabs), one shared stylesheet, mobile-first CSS with two breakpoints, and the Google Fonts
  CDN instead of self-hosting.
- **What worked well:** having the decoded geometry to check my own measurements against.
  When the design and the rendered page disagreed, the spec settled the question instead of
  guesswork.
- **What stayed with me:** the implementation, the visual judgement against the design, and
  the decision to stop optimising once the site cleared its performance bar instead of
  chasing a perfect score.

## Author

- GitHub - [@vicxxsotop-rgb](https://github.com/vicxxsotop-rgb)
- Frontend Mentor - [@vicxxsotop-rgb](https://www.frontendmentor.io/profile/vicxxsotop-rgb)

## Acknowledgments

Thanks to [Frontend Mentor](https://www.frontendmentor.io) for the challenge and the
starter files, and to Scrimba and Kevin Powell for the companion course.
