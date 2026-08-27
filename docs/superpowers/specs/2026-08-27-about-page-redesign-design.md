# About Page Redesign — Layout, Icons, and Type

**Date:** 2026-08-27
**Status:** Implemented on `about-left-rail`. Copy is placeholder pending Krush's rewrite.

## Goal

Fix the `/about` page, which read as three disconnected blocks, and shorten the
copy so the page stops being a second résumé.

## The problem

The page shipped in Phase 2 stacked three full-width blocks separated by
identical gaps: an `About` `<h1>` at 48px, a 160px headshot alone in a 768px
column, then the prose. The photo had nothing at its shoulder, so its height
read as empty space, and the least interesting word on the page was the
loudest thing on it. Nothing was broken; nothing was grouped either.

The copy had the second problem: ~330 words, most of them accolades and
metrics that already appear on Experience, Projects, Businesses, and the
résumé PDF.

## Process

Four layouts were mocked as a standalone HTML study — real tokens, real
Satoshi, real photo, real 768px measure — rather than described:

- **A** Name up top, photo beside the intro (the June 2026 hero, rebuilt)
- **B** Masthead split, photo top-right
- **C** Photo set into the text with a float
- **D** Left rail, two columns

Krush chose **D**. A second study then compared four type treatments; he chose
the middle one (16px, brighter body) and asked for icon stroke 2.

## What shipped

### Layout

`<h1>` is `About`. A masthead row sets it opposite a right-aligned stack of
three mono facts (`OSU '27, CSE` / `IGS Energy` / email), which stacks under
the title below `sm`. Below that, a plain `168px 1fr` grid: photo left, prose
right, collapsing to one column below `sm`.

The facts started under the photo in the rail and moved to the masthead
because the rail read as bottom-heavy against the title.

**No sticky rail, no fixed heights** — both columns grow to fit, per the
standing plain-document-flow constraint.

### Header icons

`app/components/Icons.tsx` is new: four hand-authored inline SVGs (Resume,
LinkedIn, GitHub, Mail) replacing the header's text labels. One 24×24 box and
a 2 stroke across all four so they read as a set, inked with `currentColor` so
they inherit the header's muted → accent hover.

No icon dependency — four glyphs don't justify a package, and there is already
one unused dependency in here.

Resume is a page-with-folded-corner. **A download arrow was rejected** because
the link opens the PDF in a new tab rather than downloading it, so the arrow
would promise the wrong action.

Each link carries an `aria-label` (the outbound three say "opens in a new
tab") and a `title`; the glyph itself is `aria-hidden`. Padding is `p-2` for a
real touch target.

**Socials stay `hidden sm:block`.** Icons freed ~35px at 375px; three more
would need ~99px. They still don't fit. The footer keeps its text labels,
which means the names are spelled out somewhere on every page.

### Type

Satoshi is self-hosted from exactly two files, **400 and 700**. There is no
Medium or SemiBold, so `font-weight: 500` silently resolves to 400.
"Thicker" body text therefore has three levers — size, leading, contrast — and
**weight is not one of them.** 700 across a paragraph reads as shouting and
flattens the page, since the headings can no longer outrank the body.

Contrast does the work weight would:

| | hex | L* | vs `--bg` |
|---|---|---|---|
| `--fg` headings | `#EDEAF2` | 93.1 | 15.5:1 |
| `--body` (was `#B9B2C4`, L* 73.6) | `#CFC8D8` | 81.6 | 11.3:1 |
| `--muted` meta | `#948CA3` | 59.6 | 5.8:1 |

The top gap narrows from 19.5 to 11.5 L* and still separates cleanly.

**Headings stay `#EDEAF2` rather than going pure white.** Pure white is only
6.9 L* brighter — barely perceptible — but it glares on this ground and loses
the violet cast that ties it to the background.

`--body` is a palette token, so this brightened body copy **site-wide**: the
hero bio, job and project card bullets, the footer. Deliberate — one ground
and one ladder is the whole design, and a one-off colour on a single page
would break it. Reverting is one value in `globals.css`.

Size is per-component and **scoped to `/about`**, where the content is prose
rather than dense cards: body 14 → 16px, leading 1.625 → 1.7, section headings
24 → 26px, mono meta 11 → 12px.

### Image dimensions

The headshot declared `height={200}` while Tailwind preflight's
`img { height: auto }` overrode it, so the browser reserved a box ~40px
shorter than what painted — a layout shift on every load, and `object-cover`
never cropped anything. Now `168×252`, the source's true 2:3 ratio (320×480),
with `object-cover` dropped. **This bug predates the redesign**; it was in the
hero version before the photo ever moved.

## Copy

Cut from ~330 words to ~110. Removed: the Aeigis and Parcel placements (top 11
of 60, top 6 of 50+, $5,000), the Emerson co-op and its 5,000+ employees, the
$1.5M+ / 20+ employees figures, the tech stack list, the graduation date, and
the sports/TV inventory. All of it still lives in `app/data/resume.ts` and on
the pages a recruiter reads for it.

Kept: one line on what he does now, one on the businesses, the one idea that
explains him as an engineer, and three specifics with a pulse.

**This copy is placeholder.** Krush is writing his own About and Hero text.

## Verification

`npx eslint app`, `npx tsc --noEmit`, `npm run build` clean. Plus:

- `headShot` referenced exactly once site-wide, in `out/about/index.html`
- header / footer / main once each on both routes
- heading order `h1` → `h2`, no skipped levels
- four header `<svg>`s, all `aria-hidden`, all four accessible names present
- résumé href keeps its `/My_Portfolio/` prefix
- plain-document-flow guard grep over `app/` empty
- screenshots at 900px and a **true 375px via the iframe harness**, not
  `--window-size` below 500

Two claims were corrected during the type study after being computed rather
than asserted: the contrast ratios (9.7:1 → 9:1, 12.4:1 → 11.3:1) and the
stroke-weight threshold (the LinkedIn counters close up at 2.25, not above 2).

## Still open

- **Krush's own About and Hero copy.** Drop-in replacement; no structural work.
- A location line would fit in the masthead facts. Left off rather than
  guessed — Columbus for OSU, Parma for the shops.
- `/businesses` detail page, copy already drafted in the Phase 2 spec.
