# Portfolio Phase 2 — About Page

**Date:** 2026-08-13
**Status:** Approved, pending implementation plan

## Goal

Add an **About** page — the first subpage on the site — and move the headshot
off the homepage hero onto it.

## Context

Phase 1 shipped and is live at krushpatel04.github.io/My_Portfolio: a single
page with Experience, Businesses, and Projects sections in plain vertical flow.
It deliberately shipped no About nav item and no clickable cards, so nothing
pointed at a page that did not exist.

This spec was originally scoped as About **plus** a `/businesses` detail page
plus clickable cards. It was narrowed to About alone: the businesses page needs
no new infrastructure once About exists, so building it later costs almost
nothing, while building both now doubles the review surface.

## Scope

**In scope:**

- `/about` route and page
- About as a fourth header item
- The routing, navigation, and shared-chrome changes that having any second
  page requires
- Moving `headShot.jpeg` from the hero to the About page

**Explicitly out of scope, deferred to a later phase:**

- The `/businesses` detail page. **Its copy is already drafted — see
  "Deferred: /businesses copy" at the end of this document.** Do not lose it.
- Making the Businesses card clickable, the `›` chevron affordance, and the
  `businessDetails` data model that would back it. The card stays exactly as it
  is today: not clickable, pointing nowhere, dangling nothing.
- Detail pages for Parcel, Aeigis, and projects. No story is written for them.
- Any change to the Experience or Projects sections, the colour tokens, the
  typography, or the card visual language.

## Routing

One new route: `app/about/page.tsx` → `/about`.

**Set `trailingSlash: true` in `next.config.ts`.** Without it, `output: "export"`
emits `out/about.html`; with it, `out/about/index.html`. The latter is the
reliable pattern for nested routes on GitHub Pages. The homepage is unaffected
either way.

## Navigation

The header gains a fourth item, **About**, linking to `/about`. Order:
Experience · Businesses · Projects · About — the section anchors stay first
because they are the primary content; About is the "learn more" tail.

**The three section anchors must change from bare `<a href="#experience">` to
`next/link` with `href="/#experience"`.** Two reasons:

1. From `/about`, a bare `#experience` anchor resolves against the current page
   and does nothing.
2. `next/link` prepends the configured `basePath` automatically. A hand-written
   `<a href="/#experience">` would need `/My_Portfolio/#experience` spelled out,
   which is exactly the kind of thing that breaks silently in production.

The Resume link stays a plain `<a>` — it points at a static asset in `public/`,
not a route, so it keeps its explicit `/My_Portfolio/` prefix.

## Shared chrome

`Header` and `Footer` move out of `Portfolio.tsx` into `app/layout.tsx`,
wrapping `{children}`, so every route gets them automatically. `Portfolio.tsx`
is reduced to the homepage's sections only (Hero, Experience, Businesses,
Projects). The `max-w-3xl mx-auto px-5` content container also moves to the
layout so both pages share one measure.

**Nesting matters here.** `Header` is `position: fixed` and spans the full
viewport width; it already applies its own `max-w-3xl mx-auto px-5` to its inner
bar. It must sit **outside** the shared content container, or the bar gets
double-constrained and its fixed background stops reaching the viewport edges.
The layout structure is:

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
in Phase 1 so it exposes a `contentinfo` landmark, and must be preserved.

## The headshot moves

`public/headShot.jpeg` is **removed from `Hero.tsx` and used on `/about`
instead.** Same asset, one location — no new image, no second copy.

Rationale: the OG link-preview card already carries the face, so a recruiter's
first impression includes it either way. On the homepage the photo is
decoration; on About it is content. This also matches the reference site
(`tanishmakadia.com`), whose hero is purely typographic.

**Consequent hero change:** the hero currently lays out as
`flex flex-col sm:flex-row items-start gap-8` with the image beside a text
column whose bio is capped at `max-w-md`. With the image gone the flex wrapper
is unnecessary, and the bio cap widens to `max-w-xl` — at `max-w-md` in a
full-width column the text looks stranded. Vertical padding stays as is; the
hero shortens on its own because its height was being set by the 200px image
rather than by the text.

## `/about` page

Structure: page heading, headshot, professional half, personal half.

The photo uses the same `/My_Portfolio/headShot.jpeg` path and the same
`next/image` treatment the hero used (160×200, `rounded-xl`, `unoptimized`).

Section headings on the page use `<h2>`, matching the heading hierarchy
established in Phase 1 (page `<h1>`, section `<h2>`, card titles `<h3>`).

### Copy — professional half

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

### Copy — personal half, under an "Outside of work" heading

> I don't sit still much. I lift regularly, ski in the winter, and I'll play
> just about anything — soccer, pickleball, or just go for a run. I'm into cars,
> so a fair amount of my free time is spent driving somewhere, usually to one of
> the shops.
>
> I built my own PC and I game on it most nights.
>
> Right now I'm working through Gen V. All-time it's Game of Thrones, then
> Avatar: The Last Airbender, then Peaky Blinders.

**PC specs are deliberately not included.** They were discussed and postponed;
the sentence above ships as written, with no parts list and no placeholder. If
specs are supplied later, they extend that sentence — a one-line change.

## Verification

- `npx eslint app`, `npx tsc --noEmit`, `npm run build` all clean.
- `out/about/index.html` exists and renders the full About copy.
- From `/about`, every header section link navigates to the homepage and scrolls
  to the right section. Verify the **rendered** `href` carries `/My_Portfolio/`
  — this is the failure mode `next/link` exists to prevent.
- `headShot.jpeg` is referenced **exactly once** across the built site: in
  `out/about/index.html`, not in `out/index.html`. Grep both.
- Both pages render Header and Footer exactly once each — not zero, not twice.
- The homepage is otherwise unchanged: Experience, Businesses, and Projects
  sections identical, Businesses card still not clickable.
- Plain document flow preserved: no `100vh`, `h-screen`, `overflow:hidden`
  wrapper, sticky track, or `translateX` anywhere in `app/`.
- **Narrow-width check via the iframe harness, not `--window-size` below 500px**
  — headless Chrome enforces a 500px minimum window width and crops the
  screenshot, which has already produced one false bug report on this project.

## Deferred: `/businesses` copy

Drafted and approved in conversation; kept here so the writing is not lost when
this page is eventually built. Structure would be a page title, an intro line
carrying the combined numbers, a section per business, and a back-link home.

**Intro:** Three businesses in Parma, Ohio — independent retail, a food-service
franchise, and a B2B sign shop. $1.5M+ in combined annual revenue and 20+
employees. I've been running them since 2019.

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

## Other deferred follow-ups

Carried from Phase 1, still unaddressed and still not blocking:

- `framer-motion` is an unused dependency.
- `app/fonts/Melodrama-SemiBold.woff2` is untracked but not gitignored, so a
  future `git add -A` would commit a font the site does not use.
- `npm run lint` is unusable repo-wide because the parked `cosmic-redesign`
  worktree lives inside the repo where eslint's `globalIgnores` do not reach.
