# Resume Page Redesign — Design Spec

**Date:** 2026-07-17
**Status:** Approved, pending implementation plan

## Goal

Apply a new visual identity ("Cosmic") to the existing resume page (Hero → Experience →
Projects), replacing the current interaction patterns (typewriter hero reveal,
horizontal scroll-jacked Experience timeline) with a calmer, card-based vertical layout
that actually uses the color/type system end-to-end instead of living only in a mockup.

## Scope

**In scope:** the existing single page at `/` — Nav, Hero, Experience, Projects.

**Explicitly out of scope (deferred to a later spec):** an "About" page and a
"Hobbies" page. These were discussed and shelved — the user wants to focus on the
resume page first. When they're picked back up, they'll get a persistent top nav
with equal-weight links (Work / About / Hobbies) per the earlier discussion, but
that nav change is not part of this spec — the current two-anchor nav
(Experience / Projects) stays as-is structurally, just re-skinned.

**Also out of scope:** updating `Krush Patel 3_1.pdf` (the resume PDF, which is
slightly behind `app/data/resume.ts` — missing the IGS Energy internship). Noted
here so it isn't lost, but it's a separate, unrelated task from this redesign.

## Design tokens

### Color

| Role | Name | Hex |
|---|---|---|
| Background | Cosmic | `#23212C` |
| Surface (cards) | Wine Ash | `#32292F` |
| Text | Starlight | `#EDEAF2` |
| Accent | Orchid | `#E5BDDF` |

Wine Ash is close in lightness to Cosmic but leans warm/rosy instead of violet —
close enough to read as "the same dark family," different enough that a Wine Ash
card reads as raised above the Cosmic page rather than looking like a separate
palette.

### Type

| Role | Font | Source | License |
|---|---|---|---|
| Hero name/headline | Bodoni Moda | Google Fonts | Free, SIL OFL, commercial use OK |
| Card headlines (company/project names) | Melodrama | Fontshare | Free, commercial use OK |
| Body / UI text | Satoshi | Fontshare | Free, commercial use OK |

Rationale for two display serifs: Bodoni Moda is reserved for the Hero's one-time
dramatic statement (high-contrast, fashion-editorial mood — the closest free
match found to the "Gallery" reference font the user liked, which is a $17+ paid
font). Melodrama is calmer and used for repeated card headlines (six Experience
cards, two-plus Project cards) — using Bodoni Moda's drama six times in a row
would dilute the Hero's impact. Satoshi carries all body copy and UI text
throughout.

Orchid is the only accent color — used for links, tech-tag outlines, and small
UI accents. It's built for dark grounds; it never sits behind or on top of body
text.

**Explored and dropped:** Kenoky, Coffekan, Zodiak, Boska, Gambetta, Italiana. All
were tried live during the color/type exploration but aren't part of the final
system. Recorded here so future-us doesn't wonder why font files for them exist
in scratch history.

## Page architecture

Single page, vertical scroll, four pieces in order: **Nav → Hero → Experience →
Projects.** No routing changes — this stays a static-export Next.js page like
today.

### Nav

Persistent fixed-top bar, functionally the same as today (logo + anchor links +
theme toggle), re-skinned:
- `kp` wordmark in Bodoni Moda
- "Experience" / "Projects" anchor links in Satoshi
- Theme toggle unchanged in behavior

### Hero

Full "nebula wash" treatment — Cosmic background, soft cloud-bloom gradient
(Orchid + Wine Ash + a faint indigo lift blooms), scattered/twinkling star field.
Content: name in Bodoni Moda (large), role/tagline and bio in Satoshi, headshot,
LinkedIn/GitHub/email pill links in Orchid.

**Interaction change:** drop the letter-by-letter typewriter effect — it reads as
a "terminal/code" gesture that doesn't match Bodoni Moda's editorial-fashion
mood. Replace with a simple staged fade/slide-in (name first, then bio+links a
beat later).

**Motion:** both the staged fade/slide-in and the star-twinkle animation must
respect `prefers-reduced-motion` — reduced-motion users get the fully-revealed
static state (no fade choreography, stars present but not animating), consistent
with how the twinkle was already built in the color/type exploration artifact.

### Experience

Vertical stack of cards, reverse-chronological (same order as today: IGS Energy
→ Emerson Software Developer → Emerson System Analyst → Parcel → Aeigis → Patel
Family Enterprises). No horizontal pan, no scroll-jack, no pinned/sticky track —
plain vertical flow, each card given room to breathe.

Each card:
- Flat **Wine Ash** background (not the animated nebula wash — that's reserved
  for the Hero so it stays the one "entrance" moment on the page)
- Company name in Melodrama
- Role, period, location, and bullets in Satoshi
- Tech-stack tags as small Orchid-outlined pills (re-skin of the existing `Tag`
  component)

### Projects

Same card language as Experience (Wine Ash surface, Melodrama name, Satoshi
body/date, Orchid-outlined tech tags) so the two sections read as one coherent
system. Differences are content-shape, not visual language:
- Prominent GitHub/Demo pill links in Orchid
- The 2D Zelda Style Game card gets a thumbnail/preview image (it has a YouTube
  demo) — Systems Programming Coursework has no link, so no thumbnail there

**Known trade-off, not a problem to solve now:** with only two projects today,
this section will look noticeably shorter than the six-deep Experience stack.
Acceptable for this spec; revisit if more projects get added later.

## Explicitly deferred / not part of this spec

- About page, Hobbies page, and the eventual equal-weight three-way nav
  (Work / About / Hobbies) that will connect them.
- Updating the resume PDF.
- Any change to `next.config.ts` static-export/basePath setup.
- Sourcing/licensing/self-hosting the actual Bodoni Moda, Melodrama, and Satoshi
  font files into the codebase (`next/font/google` covers Bodoni Moda; Melodrama
  and Satoshi are Fontshare fonts and will need self-hosting via `next/font/local`
  or a Fontshare-hosted `@font-face` — a build-time detail for the implementation
  plan, not a design decision).

## Extra color, not part of the core palette

| Name | Hex | CMYK | RGB |
|---|---|---|---|
| Teal Green | `#022E21` | 96, 0, 28, 82 | 2, 46, 33 |

Found while browsing for more colors. Sits in a different hue family (cool
green) than the violet/pink harmony Cosmic/Wine Ash/Orchid share, so it isn't
part of the Work-page token set above — using it there would fight the nebula
system rather than extend it. Recorded here in case it's useful later for
something deliberately separate, e.g. a distinct mood for the (deferred)
Hobbies page.
