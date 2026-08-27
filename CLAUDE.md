# my-portfolio — working notes

Krush Patel's personal site. Next.js 16 (App Router), React 19, Tailwind v4,
TypeScript. Static export deployed to GitHub Pages.

**Live:** https://krushpatel04.github.io/My_Portfolio/
**Repo:** github.com/krushpatel04/My_Portfolio

## Deploying

`.github/workflows` builds and deploys on every push to `main`. There is **no
lint step in CI** — only `npm ci` and `npm run build`.

Pushing `main` publishes to a live public site that Krush sends to recruiters.
Do not push without being asked. Feature work goes on a branch, gets reviewed,
and Krush decides when it merges.

## Gotchas that have already cost real time

Read these before writing verification commands. Each one produced a false
result or a wasted cycle in a previous session.

**1. `npm run lint` is unusable.** It reports ~11900 problems, all from
minified build artifacts under `.claude/worktrees/cosmic-redesign/`, which
eslint's `globalIgnores` (config-relative) don't reach. Use **`npx eslint app`**.
Fixing this properly means adding `.claude/**` to `eslint.config.mjs`.

**2. Headless Chrome enforces a 500px minimum window width.** `--window-size=375`
lays the page out at 500px and then *crops the image to 375*, producing
screenshots that look exactly like clipped, overflowing text when the CSS is
fine. This caused a false Critical bug report. For narrow widths, render inside
an iframe of the target width instead:

```bash
cat > /tmp/f.html <<'HTML'
<body style="margin:0;background:#444">
<iframe src="/My_Portfolio/" style="width:375px;height:5200px;border:0;display:block"></iframe>
</body>
HTML
# serve the built out/ dir, then screenshot with --window-size=420,5200
```

Judge only the left 375px; the surround is the harness. Widths ≥500 are honest.

**3. Two counting traps in the built HTML.**
- The export is minified onto one line, so `grep -c` counts *lines* and returns
  1 no matter how many matches exist. A duplicated `<header>` passes.
- Next embeds an RSC hydration payload inside `<script>` that repeats **class
  strings and text content**, roughly doubling whole-file matches of those.
  Structural tags like `<header` are unaffected.

Count within rendered markup only:

```bash
mcount() { python3 -c "
import re,sys
h=open(sys.argv[2],encoding='utf-8').read()
m=h.split('<body',1)[1].split('<script',1)[0]
print(len(re.findall(re.escape(sys.argv[1]), m)))
" "$1" "$2"; }
```

**4. `basePath` is `/My_Portfolio`.** Internal *routes* must use `next/link`,
which applies the prefix automatically. Hand-written `<a>` and `next/image`
`src` do **not** — those need `/My_Portfolio/…` spelled out (see
`Header.tsx`'s Resume link and `About.tsx`'s headshot). Get this wrong and it
works perfectly in dev and 404s in production.

**5. `trailingSlash: true`.** Nested routes export as `about/index.html`, and
`/My_Portfolio/about` 308-redirects to `/about/`. That redirect is correct, not
an error.

**6. Tailwind preflight forces `img { height: auto }`.** A `next/image`
`height` that doesn't match the source's true aspect ratio is silently
overridden, so the browser reserves the wrong box and the page shifts on load.
The headshot is 320×480; it must be declared at that 2:3 ratio (currently
168×252). This shipped broken twice before anyone noticed.

**7. Apostrophes are HTML entities in the source** (`&rsquo;`), so grepping
built output for text containing them fails. Grep phrases without apostrophes.

## Hard constraint: plain document flow

**No `100vh`, `h-screen`, `overflow: hidden` wrappers, `position: sticky`
tracks, or `translateX` on content anywhere in `app/`.**

Why: the Experience section used to be a horizontal scroll-jacked track — cards
at `height:100%` with `justify-center` inside `position:sticky; height:100vh;
overflow:hidden`, with vertical scroll driving `translateX`. Nothing scrolled
inside a card, so content taller than the viewport was clipped at *both* ends
and unreachable. On a 375×667 phone the IGS Energy card lost ~87px off the top
and ~87px off the bottom. Cards must grow to fit their content.

Allowed exceptions, both deliberate: `body { overflow-x: hidden }` in
`globals.css` (page-root guard) and `Header`'s `position: fixed`.

Note that `overflow-x: hidden` **masks** horizontal overflow from `scrollWidth`
checks, so DOM probes cannot detect side-clipping. Only screenshots can.

## Design system

One ground, one accent. That restraint is the whole design; adding a second
accent breaks it.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#14131A` | page ground |
| `--card` | `#23212C` | card surface |
| `--border` | `#332F40` | hairlines |
| `--fg` | `#EDEAF2` | headings |
| `--body` | `#CFC8D8` | body text |
| `--muted` | `#948CA3` | meta/labels |
| `--accent` | `#D08FCB` | links, list marks, tag outlines |

Accent goes on links, list marks, and tag outlines only — never body text,
never a background fill. **Dark only**; there is no light theme and no
`ThemeToggle` (both were deliberately removed).

The three text steps are a deliberate ladder, measured in L*: `--fg` 93.1,
`--body` 81.6, `--muted` 59.6. Keep the gaps — closing them is what makes the
page go flat. `--fg` stays `#EDEAF2` rather than pure white: white is only
6.9 L* brighter, glares on this ground, and loses the violet cast.

Typeface: **Satoshi** (400/700), self-hosted via `next/font/local`, plus
Tailwind's `font-mono` stack for small meta labels. One typeface is deliberate —
an earlier three-face design was scrapped.

**There is no Medium or SemiBold**, so `font-weight: 500` silently resolves to
400, and 700 across a paragraph reads as shouting. To make text feel heavier,
reach for **size, leading, or contrast** — not weight.

Heading hierarchy: page `<h1>` → section `<h2>` → card `<h3>`. Do not skip
levels; this was fixed once already.

## Layout

`app/layout.tsx` owns the chrome for every route:

```
<Header />                                  {/* fixed, full width */}
<div className="max-w-3xl mx-auto px-5">
  <main>{children}</main>
  <Footer />                                {/* outside <main> for contentinfo */}
</div>
```

`Header` must stay **outside** the container — it applies its own `max-w-3xl`
to its inner bar, and nesting double-constrains it. Page components render only
their own content; adding a `<main>` or container renders it twice.

Routes: `/` (`Portfolio.tsx` → Hero, Experience, Businesses, Projects),
`/about` (masthead: `h1` "About" opposite a right-aligned mono facts stack;
then a plain `168px 1fr` grid, photo left and prose right, collapsing to one
column below `sm`), and `not-found.tsx`. That last one exists because hoisting the chrome
wrapped Next's built-in 404 boundary, which injects `body{background:#fff}` and
beat the site stylesheet.

Header nav: section anchors and About are visible at **every** width; the
social links are the ones that carry `hidden sm:block`. That asymmetry is
deliberate — section anchors used to vanish on mobile and that was a bug.

Resume, LinkedIn, GitHub, and Email are **icons**, not text — four hand-authored
inline SVGs in `app/components/Icons.tsx`, one 24×24 box and a 2 stroke,
`currentColor` so they inherit the header's hover. No icon package. Because
they carry no text, each link needs an `aria-label` and a `title`, and the svg
stays `aria-hidden`. Icons bought ~35px at 375px and the three socials would
need ~99px, so they still don't fit on mobile; the footer keeps text labels.

## Content

`app/data/resume.ts` exports `experience: Job[]`, `business: Business`, and
`projects: Project[]`. It is synced to Krush's résumé PDF
(`public/Krush-Patel-Resume.pdf`) — treat its strings as verbatim transcriptions
and don't reword them.

The Businesses section is the site's differentiator: three family businesses
(Big Creek Convenience, Tropical Smoothie Cafe, Signarama), $1.5M+ combined,
20+ employees, run since 2019. It was buried as one bullet in the last
Experience card until it was promoted to its own section.

## Testing

**There is no test framework and adding one is out of scope.** `package.json`
defines only `dev`, `build`, `start`, `lint`. Verification is:

```
npx eslint app && npx tsc --noEmit && npm run build
```

plus greps against `out/` and screenshots. Judge test evidence by that standard.

## Specs and plans

`docs/superpowers/specs/` and `docs/superpowers/plans/`. Recent work, newest
first:

- `2026-08-27-about-page-redesign-design.md` — the current `/about` layout,
  the header icons, and the type/contrast rules above
- `2026-08-13-portfolio-phase-2-design.md` — About page. **Also contains
  drafted, approved copy for a `/businesses` detail page under "Deferred" —
  don't lose it.**
- `2026-08-09-portfolio-rebrand-design.md` — the current visual system
- `2026-08-09-resume-content-update-design.md` — résumé sync + PDF

## Deferred work

**Waiting on Krush:** his own About and Hero copy. The text on `/about`
today is a placeholder written to be short and personable; the numbers it
dropped are all still in `app/data/resume.ts`. Swapping it in is a drop-in
edit with no structural work. A location line would also fit in the masthead
facts — left off rather than guessed, since it's Columbus for OSU and Parma
for the shops.

**Next feature:** the `/businesses` detail page. Copy is already written (see
above). Needs no new infrastructure now that `/about` proved the pattern —
mostly a route, a `businessDetails` data structure, and making the Businesses
card clickable with a `›` chevron. Detail pages for Parcel, Aeigis, and the
projects are further out; no story is written for them yet.

**Small cleanups, none urgent:**
- `framer-motion` is an unused dependency.
- `app/fonts/Melodrama-SemiBold.woff2` is untracked but not gitignored — a
  `git add -A` would commit a font the site doesn't use. Stage files by name.
- `.claude/worktrees/cosmic-redesign` is a parked, now-superseded branch living
  inside the repo. It is the source of the lint breakage above and is safe to
  delete. The `rebrand-phase-1` and `about-page` branches are merged and dead.
- `/about` has no `openGraph` block, so sharing that URL shows the homepage's
  card. Fine (same person, same site) but ~8 lines to fix properly.
- No `aria-current` on the active nav item.
- Anchors land ~160px down because `scroll-padding-top: 5rem` and `scroll-mt-20`
  stack under a 56px header.

## Working with Krush

He decides fast and doesn't want option surveys — give a recommendation. His
failure mode is accumulating finished-but-unshipped design work, so sequence
shippable things first and keep visual exploration bounded and separate. The
palette is seven CSS variables; changing it later is cheap, so don't let colour
decisions block structural work.
