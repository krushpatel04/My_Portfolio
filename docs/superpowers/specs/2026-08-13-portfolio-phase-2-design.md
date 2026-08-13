# Portfolio Phase 2 — About + Businesses Detail

**Date:** 2026-08-13
**Status:** Approved, pending implementation plan

## Goal

Add the two pages deferred from the Phase 1 rebrand: an **About** page and a
**Businesses** detail page, plus the clickable-card affordance that leads to the
latter and the fourth header item that leads to the former.

## Context

Phase 1 shipped and is live at krushpatel04.github.io/My_Portfolio — a single
page with Experience, Businesses, and Projects sections in plain vertical flow.
It deliberately shipped no chevrons, no clickable cards, and no About nav item,
so nothing pointed at a page that did not exist. This spec builds those pages.

## Scope

**In scope:** `/about`, `/businesses`, the Businesses card becoming clickable,
About as a fourth header item, and the routing/navigation changes those require.

**Explicitly out of scope — deferred again, deliberately:**

- Detail pages for **Parcel** and **Aeigis**. Only résumé bullets exist for
  them; there is no story written. Their cards stay non-clickable.
- Detail pages for **projects**. Same reason.
- Any change to the Experience or Projects sections.
- Any change to the colour tokens, typography, or card visual language.

The detail-page pattern is built once here. Adding Parcel, Aeigis, or a project
later is data entry against an existing pattern, not a rebuild.

## Routing

Two new routes: `app/about/page.tsx` → `/about`, and
`app/businesses/page.tsx` → `/businesses`.

**Set `trailingSlash: true` in `next.config.ts`.** Without it, `output: "export"`
emits `out/about.html`; with it, `out/about/index.html`. The latter is the
reliable pattern for nested routes on GitHub Pages. The homepage is unaffected
either way.

## Navigation

The header gains a fourth item, **About**, linking to `/about`. Order:
Experience · Businesses · Projects · About. The section anchors stay first
because they are the primary content; About is the "learn more" tail.

**The section anchors must change from bare `<a href="#experience">` to
`next/link` with `href="/#experience"`.** Two reasons:

1. From `/about`, a bare `#experience` anchor resolves against the current page
   and does nothing.
2. `next/link` prepends the configured `basePath` automatically. A hand-written
   `<a href="/#experience">` would need `/My_Portfolio/#experience` spelled out,
   which is exactly the kind of thing that silently breaks.

The Resume link stays a plain `<a>` — it points at a static asset in `public/`,
not a route, so it keeps its explicit `/My_Portfolio/` prefix.

## Shared chrome

`Header` and `Footer` move out of `Portfolio.tsx` and into `app/layout.tsx`,
wrapping `{children}`. Every route then gets them automatically.

`Portfolio.tsx` is reduced to the homepage's sections only (Hero, Experience,
Businesses, Projects). The `max-w-3xl mx-auto px-5` content container also moves
to the layout so all three pages share one measure.

**Nesting matters here.** `Header` is `position: fixed` and spans the full
viewport width; it already applies its own `max-w-3xl mx-auto px-5` to its inner
bar. It must therefore sit **outside** the shared content container, not inside
it, or the bar gets double-constrained and the fixed background stops reaching
the viewport edges. The layout structure is:

```
<body>
  <Header />                                  {/* fixed, full width */}
  <div className="max-w-3xl mx-auto px-5">    {/* shared measure */}
    <main>{children}</main>
    <Footer />
  </div>
</body>
```

`Footer` sits inside the container but outside `<main>` — that placement was set
in Phase 1 so it exposes a `contentinfo` landmark, and it must be preserved.

## Clickable card pattern

Only `BusinessCard` becomes clickable in this phase.

- A `›` chevron in `var(--accent)` sits at the right of the card title,
  marking it as navigable. Cards without a destination get no chevron — absence
  is the signal that a card is terminal.
- On hover and focus, the card border brightens from `var(--border)` toward the
  accent. `JobCard` already has a hover border transition; this matches it.
- **Semantics:** the card title becomes the `<a>`, and a `::after` pseudo-element
  on that anchor is stretched over the whole card to extend the click target.
  Wrapping the entire card in an anchor is rejected — it makes screen readers
  announce the full bullet list and tag row as link text.
- The card is `position: relative` to contain that pseudo-element. This is a
  containing block for an absolutely positioned decoration, not a layout
  constraint, and does not violate the plain-document-flow rule.

## Data model

`app/data/resume.ts` gains a per-business structure:

```ts
export interface BusinessDetail {
  name: string;
  /** Short classifier shown under the name, e.g. "Independent retail". */
  kind: string;
  /** One or two paragraphs, in Krush's voice. */
  body: string[];
}

export const businessDetails: BusinessDetail[] = [ /* three entries */ ];
```

**`Business.names` is removed and derived instead.** `BusinessCard` renders
`businessDetails.map((b) => b.name)` rather than a separate hardcoded array.
Single source of truth — otherwise the card and the detail page can drift and
list different businesses.

## `/businesses` page

Structure: page title, one-line intro carrying the combined numbers, then a
section per business, then a back-link to the homepage.

Reuses the existing card surface and type treatment so it reads as the same
site.

### Copy (draft — edit at review)

**Title:** Patel Family Enterprises
**Intro:** Three businesses in Parma, Ohio — independent retail, a food-service
franchise, and a B2B sign shop. $1.5M+ in combined annual revenue and 20+
employees. I've been running them since 2019.

---

**Big Creek Convenience** — *Independent retail*

> The one I grew up in. It's a small corner store, and it's where I learned
> everything else. I've done every job in it — register, ordering, vendors,
> inventory, closing up on a night nobody wants to work.
>
> It's not a big business, but it's the reason I understand the rest of them.

**Tropical Smoothie Cafe** — *Franchise · ~15 employees*

> Manager, crew member, owner — whatever the day needs. I've hired and trained
> a good portion of the team, and I still work the line when we're short.
>
> Running a franchise means operating inside someone else's system: their
> standards, their supply chain, their reporting. Learning to work well inside
> constraints you didn't choose turns out to be useful in software too.

**Signarama** — *Franchise · B2B*

> The newest of the three, and the most different. We make signs and
> promotional products — vinyl for walls and vehicles, banners, flags, yard
> signs, channel letters.
>
> It's the only one of the three that's business-to-business, which means real
> quotes, real deadlines, and customers who need a thing made by a date.

## `/about` page

Structure: casual photo, professional half, personal half.

### Copy (draft — edit at review)

> I've been running businesses since high school. Not helping out — scheduling,
> hiring, vendor calls, and fixing the POS when it goes down on a Saturday
> afternoon. There are three now: Big Creek Convenience, the corner store I grew
> up in; a Tropical Smoothie Cafe with about fifteen employees; and Signarama, a
> sign shop. Together they do $1.5M+ a year and employ more than twenty people.
>
> That's most of why I build software the way I do. I've been the person stuck
> with the bad system — the spreadsheet four people edit at once, the process
> that only works because someone remembers it. So when I build something, I
> start with whoever has to use it.
>
> That's where both of my startups came from. For Aeigis, a firefighter safety
> tracker, I interviewed more than a dozen firefighters before writing any code
> and came away with letters of intent from two departments. For Parcel, I sat
> with insurance adjusters and watched how they actually put a claim packet
> together. Both made accelerator finals at Ohio State — Aeigis top 11 of 60,
> Parcel top 6 of 50+ with $5,000 in funding.
>
> These days I'm a full-stack developer at IGS Energy, working on the CRM their
> sales and service teams use every day — React and TypeScript on the front,
> ASP.NET Core and SQL Server behind it. Before that I co-oped at Emerson on an
> internal CRM serving 5,000+ employees. I graduate from Ohio State in May 2027
> with a B.S. in Computer Science and Engineering.

**Outside of work**

> I don't sit still much. I lift regularly, ski in the winter, and I'll play
> just about anything — soccer, pickleball, or just go for a run. I'm into cars,
> so a fair amount of my free time is spent driving somewhere, usually to one of
> the shops.
>
> I built my own PC and I game on it most nights. [PC SPECS — see open items]
>
> Right now I'm working through Gen V. All-time it's Game of Thrones, then
> Avatar: The Last Airbender, then Peaky Blinders.

## Open items and their defaults

These are pending user input. Each has a defined fallback so implementation is
never blocked:

1. **Casual photo.** If not supplied before implementation, the About page ships
   **with no photo**. It does not fall back to the hero headshot (repetitive for
   anyone arriving from the homepage) and does not use a placeholder image.
2. **PC specs.** If not supplied, the sentence ships as "I built my own PC and I
   game on it most nights." with the specs clause removed entirely — no empty
   list, no "TBD".

## Verification

- `npx eslint app`, `npx tsc --noEmit`, `npm run build` all clean.
- `out/about/index.html` and `out/businesses/index.html` both exist.
- From `/about`, every header section link navigates to the homepage and scrolls
  to the right section — verify the rendered `href` carries `/My_Portfolio/`.
- The Businesses card's chevron is present and its title is a link to
  `/My_Portfolio/businesses/`; the Experience and Projects cards have no chevron
  and no link.
- All three pages render Header and Footer once each — not zero, not twice.
- Plain document flow preserved: no `100vh`, `h-screen`, `overflow:hidden`
  wrapper, sticky track, or `translateX` anywhere in `app/`.
- **Narrow-width check via the iframe harness, not `--window-size` below 500px**
  — headless Chrome enforces a 500px minimum window width and crops the
  screenshot, which has already produced one false bug report on this project.

## Deferred to a later phase

- Parcel, Aeigis, and project detail pages.
- Follow-ups carried from Phase 1, still unaddressed: `framer-motion` is an
  unused dependency; `app/fonts/Melodrama-SemiBold.woff2` is untracked but not
  gitignored; `npm run lint` is unusable repo-wide because the parked
  `cosmic-redesign` worktree lives inside the repo where eslint's
  `globalIgnores` do not reach.
