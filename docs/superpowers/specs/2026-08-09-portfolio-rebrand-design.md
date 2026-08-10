# Portfolio Rebrand — Design Spec

**Date:** 2026-08-09
**Status:** Approved, pending implementation plan

## Goal

Replace the scroll-jacked, viewport-height-bound layout with a calm, sectioned,
ordinary-scrolling site, and apply a disciplined one-ground/one-accent colour
system. Add a Businesses section that gives the family businesses the weight
they deserve.

This is the "rebrand" that was deliberately sequenced *after* the content update
shipped on 2026-08-09 (commits `99a54ba`..`3a1e922`).

## Context

- The live site's Experience section is a horizontal track: cards are
  `height:100%` with `justify-center` inside a `position:sticky; height:100vh;
  overflow:hidden` container (`app/components/Portfolio.tsx:44-45` and
  `:164-167`). Nothing scrolls inside a card — vertical scroll drives horizontal
  translation instead.
- **This is a live defect.** Measured with headless Chrome against the real CSS
  bundle: the IGS Energy card is ~840px tall at 375px width versus a 667px
  iPhone SE viewport, so ~87px is clipped off the top and ~87px off the bottom,
  unreachable. Desktop measures fine (~640px content vs 760px viewport). It was
  knowingly shipped and deferred to this rebrand.
- A completed `cosmic-redesign` branch (14 commits, at `0617094`) has been
  parked since 2026-08-09. It is **not** the basis for this work, but its
  self-hosted font files and its palette are raided below.
- The reference the user brought is `tanishmakadia.com`, a friend's site. Its
  discipline is being borrowed; its identity is not. Concretely: that site's
  entire palette is Tailwind's slate ramp (`#020617` ground) plus one sky-blue
  accent. The lesson taken is *one neutral ramp, one accent* — not the specific
  colours, and not the two-column sticky layout.

## Non-goals

- Copying the reference site's look. Different ground hue, different accent,
  different layout structure.
- Any change to `app/data/resume.ts` content. It was just synced to the résumé
  PDF and is correct.
- Touching the `cosmic-redesign` branch. It stays parked.
- Changing `next.config.ts` static-export/basePath setup.

## Scope: this spec is Phase 1 of two

**Phase 1 (this spec):** the visual system, the layout restructure, the header,
and the three sections on one page.

**Phase 2 (separate spec, later):** the About page, the per-entity detail pages,
and the clickable-card affordances that lead to them.

**Why split here:** the detail pages need writing that does not exist yet —
three businesses, Parcel, Aeigis, plus some projects. Shipping chevrons and
"read more" links in Phase 1 would produce dead ends. Phase 1 therefore ships
**no clickable cards, no chevrons, and no About nav item**, so there is nothing
on the page that goes nowhere.

**Consequence to accept:** the header in Phase 1 is three items (Experience /
Businesses / Projects), not four. About joins the header in Phase 2, together
with the page it points at. If the About copy gets written before Phase 1
implementation starts, it can move into Phase 1 — that is a small change, not a
re-plan.

## Design tokens

### Colour

One ground, one accent. This is the whole system.

| Role | Hex | Origin |
|---|---|---|
| Ground | `#14131A` | New — near-black violet |
| Card surface | `#23212C` | "Cosmic", demoted from ground to surface |
| Hairline / border | `#332F40` | New |
| Heading text | `#EDEAF2` | "Starlight", unchanged |
| Body text | `#B9B2C4` | New |
| Muted / meta text | `#948CA3` | New |
| Accent | `#D08FCB` | "Orchid" at the same hue, saturated for presence |

**Why the parked palette shifted down a step.** Cosmic `#23212C` was originally
specced as the background, but it is too light to be the near-black ground the
user wants. As a card surface on `#14131A` it gives a 1.16:1 raise — visible as
"lifted" without becoming a separate colour. **Wine Ash `#32292F` is retired**;
Cosmic now does that job.

**Why Orchid was saturated.** The original `#E5BDDF` scores 9.56:1 on the card —
high contrast, but as a very light low-saturation pink it reads as *a second
text colour* rather than an accent. Chevrons and tag outlines in it look like
faded text instead of interactive elements. `#D08FCB` holds the hue and fixes
that.

**Measured contrast** (WCAG, computed not estimated):

| Pair | Ratio | AA |
|---|---|---|
| Heading `#EDEAF2` on card `#23212C` | 13.32:1 | pass |
| Body `#B9B2C4` on card | 7.72:1 | pass |
| Muted `#948CA3` on card | 4.93:1 | pass |
| Accent `#D08FCB` on card | 6.39:1 | pass |
| Accent `#D08FCB` on ground | 7.45:1 | pass |

**Accent usage rule.** The accent appears only on: links, list marks, tag
outlines, and (in Phase 2) chevrons. Never on body text. Never as a background
fill. If a new element seems to want the accent, it probably wants weight or
spacing instead.

**No light theme.** The site ships dark-only and `ThemeToggle.tsx` is removed
along with the `html[data-theme="light"]` token block in `globals.css`. Rationale:
the simplicity thesis, and a second theme doubles every colour decision and every
contrast check for a site whose owner has chosen dark. *Reversible decision — if
the toggle should stay, both themes get defined properly rather than inverted.*

### Type

One family, weights for hierarchy, plus a mono for small meta labels. This is
the typographic equivalent of one-ramp-one-accent.

| Role | Face |
|---|---|
| Everything (headings, body, UI) | Satoshi — Regular 400 and Bold 700 |
| Meta lines (dates, locations, tag pills) | system mono stack |

Satoshi is already self-hosted on the parked `cosmic-redesign` branch and the
`.woff2` files are sitting untracked in `app/fonts/` on `main`
(`Satoshi-Regular.woff2`, `Satoshi-Bold.woff2`). Those get committed and wired
via `next/font/local`.

**Melodrama and Bodoni Moda are dropped.** The cosmic spec used three faces —
two display serifs plus a body sans. Three faces contradicts the simplicity this
rebrand is built on. `Melodrama-SemiBold.woff2` is not committed.

The mono stack is `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` —
no webfont, no extra download.

## Page architecture

### Header

Fixed top bar, three zones:

- **Far left:** `kp` wordmark (Satoshi Bold), links to `/`
- **Centre:** `Experience` · `Businesses` · `Projects` — anchor links to the
  three sections. (`About` joins here in Phase 2.)
- **Far right:** social links — LinkedIn, GitHub, email

**Mobile:** the centre anchors **stay visible**, at a smaller size and tighter
spacing — they do not collapse into a hamburger or disclosure, and they must not
simply disappear the way today's `hidden sm:block` anchors do. Three short words
fit on a 375px bar; a disclosure menu is machinery this doesn't need. If space is
genuinely too tight, the social links on the far right drop to icons before any
section anchor is touched.

**Forward-compatibility note for Phase 2:** once About is a real page, the three
section anchors must be written as `/#experience` rather than `#experience`, or
they will do nothing when the user is already on `/about`. Phase 1 may use bare
anchors, but the implementer should be aware this changes.

### Page structure

One page, ordinary vertical scroll:

```
Header (fixed)
Hero
Experience   §  IGS · Emerson (SWE) · Emerson (Analyst) · Parcel · Aeigis
Businesses   §  Patel Family Enterprises
Projects     §  2D Zelda Style Game · Systems Programming Coursework
Footer
```

**Single column, centred, max-width content.** Not the reference site's
two-column sticky-identity layout — that is more machinery than this needs, and
the user asked for simplicity. *Reversible decision.*

**The hard requirement:** every section is normal document flow. No `100vh`
containers, no `overflow:hidden` on content wrappers, no sticky tracks, no
scroll-driven horizontal translation. Cards grow to fit their content. This is
what fixes the measured mobile clipping, and it is the single most important
structural requirement in this spec.

### Hero

A normal block at the top of the page — **not** full-viewport, not pinned, no
scroll-driven scale or opacity. Its height is whatever its content needs.

Contents, reusing what the current hero already has:

- Name, "Krush Patel", Satoshi Bold, largest type on the site
- One-line role/tagline: `Software Developer · CSE @ Ohio State`, accent colour
- The existing bio paragraph from `Portfolio.tsx`, body colour
- Headshot (`public/headShot.jpeg`)
- Link pills: LinkedIn, GitHub, email — these stay in the hero even though the
  header also carries socials; the header set is for people who scroll past

**Removed from the hero:** the typewriter reveal (`TypeWriter.tsx` is deleted),
the `100vh` spacer, and the scroll-driven `heroScale` / `heroOpacity` /
`heroBorderRadius` transforms in `Portfolio.tsx`. A single quiet fade-in on load
is acceptable; nothing tied to scroll position.

### Footer

Minimal: name, year, and the same three link pills. No sitemap columns — there
are three sections and they are all one scroll away.

### Sections

Each section opens with a small uppercase mono label (`EXPERIENCE`) and a
hairline rule. Sections are separated by generous vertical space, not by boxes.

**Experience** — reverse-chronological, from `experience` in `app/data/resume.ts`,
minus Patel Family Enterprises: IGS Energy, Emerson (Software Developer),
Emerson (System Analyst), Parcel, Aeigis. The two Emerson roles stay as two
separate cards.

**Businesses** — one card, Patel Family Enterprises, described below.

**Projects** — from `projects` in `app/data/resume.ts`, unchanged content.

### Card language

One card component shape across all three sections:

- Card surface `#23212C`, 1px `#332F40` hairline, ~10px radius
- Title in Satoshi Bold, heading colour
- Meta line in mono, uppercase, muted: role · location · period
- Bullets, body colour, accent-coloured `—` marks
- Tag pills: mono, accent text, accent outline at ~38% opacity

Differences between sections are content shape, not visual language.

### The Businesses card

This is the centrepiece of the rebrand and the thing no other CS-student
portfolio has. Its content:

> **Patel Family Enterprises**
> Owner / Operations Manager · Parma, OH · Jan 2019 – Present
>
> Big Creek Convenience · Tropical Smoothie Cafe · Signarama
>
> — Independent retail, a food-service franchise, and a B2B sign shop: three
>   operating models, $1.5M+ combined annual revenue, 20+ employees.
> — Oversee daily operations across all three — scheduling, hiring, vendor
>   relations, POS systems, and inventory.
>
> Tags: Retail · Franchise · Operations · Hiring · P&L

The three business names appear **on the card face**, separated by
accent-coloured dots. This is deliberate: it makes a one-card section read as
substantial, and it means Phase 1 ships something complete rather than a
placeholder waiting on Phase 2's detail page.

**Data model change.** Patel Family Enterprises moves out of the `experience`
array into its own export in `app/data/resume.ts` — it is no longer rendered as
an Experience card. A `businesses` export (or a single `business` object) carries
the company, role, period, location, the three business names, bullets, and tags.
The three names are structured data, not a pre-joined string, because Phase 2's
detail page needs them individually.

**Reference material for Phase 2's detail page** (captured here so it is not
lost — the user supplied it in conversation, and it is better material than
anything on the résumé):

- **Big Creek Convenience** — retail, a small corner store, and the one he grew
  up in. "This is my roots… I've done anything and everything there is to do."
- **Tropical Smoothie Cafe** — franchise, ~15 employees, several of whom he has
  hired and trained. Works as "manager, crew member, owner, all of it."
- **Signarama** — franchise, newest, a sign shop: vinyl for walls and vehicles,
  banners, flags, yard signs, channel letters, promotional items.

## Verification

- `npx eslint app` clean. (`npm run lint` is unusable repo-wide — ~11900
  pre-existing problems from build artifacts under `.claude/worktrees/`. Not
  this spec's problem; see the follow-up below.)
- `npm run build` succeeds and static-exports.
- **Mobile clipping regression check, required.** Render the built page at
  375×667 and confirm the full IGS Energy card — first line through last bullet
  — is present and reachable. This is the defect the rebrand exists to fix, so
  it gets an explicit gate rather than a visual glance. Headless Chrome works
  for this: `--headless=new --window-size=375,667 --screenshot`.
- Confirm no `100vh`, no `overflow:hidden`, and no sticky track remains on any
  content container.
- Every section reachable from the header on a 375px-wide viewport.

## Deferred, deliberately

- **Phase 2:** About page, per-entity detail pages, clickable cards + chevrons,
  the fourth header item.
- The `cosmic-redesign` branch stays parked. After this ships it is almost
  certainly dead and can be deleted, but that is not this spec's call.
- **Follow-up, unrelated:** add `.claude/**` to `eslint.config.mjs`'s
  `globalIgnores` so `npm run lint` becomes usable again.
