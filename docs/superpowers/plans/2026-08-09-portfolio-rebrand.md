# Portfolio Rebrand (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the scroll-jacked, viewport-height-bound layout with plain vertical sections on a new one-ground/one-accent dark palette, and give the family businesses their own section.

**Architecture:** `Portfolio.tsx` is currently a 482-line file holding the nav, hero, a scroll-driven horizontal Experience track, and Projects. It gets decomposed into focused components — `Header`, `Hero`, `JobCard`, `ExperienceSection`, `BusinessCard`, `BusinessesSection`, `ProjectCard`, `ProjectsSection`, `Footer` — with `Portfolio.tsx` left as a composition root. Each task builds a component **and swaps it into `Portfolio.tsx`**, so every task is independently visible in a browser rather than accumulating unwired code.

**Tech Stack:** Next.js 16.1.1 (App Router, `output: "export"`), React 19, Tailwind v4, TypeScript, framer-motion, lenis. Deployed to GitHub Pages on push to `main`.

**Spec:** `docs/superpowers/specs/2026-08-09-portfolio-rebrand-design.md`

## Global Constraints

- **Work on a branch**, not `main`. Create `rebrand-phase-1` at Task 1 and stay on it. Do not push; do not merge. Integration is a human decision after review.
- **THE HARD REQUIREMENT — plain document flow.** No `100vh` / `h-screen` on any content container, no `overflow: hidden` on any content wrapper, no `position: sticky` tracks, no scroll-driven horizontal translation, no scroll-linked scale/opacity/border-radius. Cards must grow to fit their content. This is the defect the whole rebrand exists to fix; a task that reintroduces any of it has failed regardless of how it looks.
- **Colour tokens, exact values:** ground `#14131A`, card `#23212C`, border `#332F40`, heading `#EDEAF2`, body `#B9B2C4`, muted `#948CA3`, accent `#D08FCB`.
- **Accent usage:** links, list marks, tag outlines only. Never on body text. Never as a background fill.
- **Dark only.** No light theme, no `ThemeToggle`, no `data-theme` attribute, no theme-restore script.
- **One typeface:** Satoshi (Regular 400, Bold 700) for everything, plus Tailwind's default `font-mono` stack for small meta labels. Do not add Melodrama, Bodoni Moda, Geist, or any other face.
- **Do not modify** `app/data/resume.ts` bullet text, `next.config.ts`, `.github/workflows/`, or anything under `.claude/`. The résumé content was just synced and is correct.
- **Do not touch the `cosmic-redesign` branch or its worktree.** It stays parked.
- **No new dependencies.**
- **This repo has NO test framework** — `package.json` defines only `dev`, `build`, `start`, `lint`. Do not add one. Verification is `npx eslint app`, `npm run build`, greps against `out/`, and headless-Chrome screenshots.
- **Do not run `npm run lint`** — it fails with ~11900 pre-existing problems from build artifacts under `.claude/worktrees/`. Use `npx eslint app`.
- Static assets in markup need the `/My_Portfolio` prefix (`next.config.ts` sets `basePath`), as `public/headShot.jpeg` → `/My_Portfolio/headShot.jpeg`.

## File structure

| File | Responsibility | Task |
|---|---|---|
| `app/globals.css` | Colour tokens, base body styles | 1 |
| `app/layout.tsx` | Satoshi via `next/font/local`, metadata, SmoothScroll | 2 |
| `app/data/resume.ts` | `experience`, **new** `business`, `projects` | 3 |
| `app/components/Tag.tsx` | **new** — one tag pill | 4 |
| `app/components/SectionHeading.tsx` | **new** — mono label + hairline rule | 4 |
| `app/components/PillLink.tsx` | restyled link pill | 4 |
| `app/components/Header.tsx` | **new** — fixed top bar | 5 |
| `app/components/Hero.tsx` | **new** — name, bio, headshot, links | 6 |
| `app/components/JobCard.tsx` | **new** — one Experience card | 7 |
| `app/components/ExperienceSection.tsx` | **new** — Experience section | 7 |
| `app/components/BusinessCard.tsx` | **new** — the Patel Family card | 8 |
| `app/components/BusinessesSection.tsx` | **new** — Businesses section | 8 |
| `app/components/ProjectCard.tsx` | **new** — one Project card | 9 |
| `app/components/ProjectsSection.tsx` | **new** — Projects section | 9 |
| `app/components/Footer.tsx` | **new** — minimal footer | 10 |
| `app/components/Portfolio.tsx` | composition root only | 10 |
| `app/components/TypeWriter.tsx` | **deleted** | 6 |
| `app/components/ThemeToggle.tsx` | **deleted** | 2 |
| `app/components/SmoothScroll.tsx` | unchanged (lenis smooth scroll, not scroll-jacking) | — |

---

### Task 1: Branch, colour tokens, remove the light theme

**Files:**
- Modify: `app/globals.css` (whole file)

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom properties on `:root` that every later task styles through — `--bg`, `--card`, `--border`, `--fg`, `--body`, `--muted`, `--accent`. **These seven names are the contract.** Later tasks reference them as `var(--bg)` etc. and must not invent new token names.

- [ ] **Step 1: Create the branch**

```bash
git checkout -b rebrand-phase-1
git status --short
```

Expected: on `rebrand-phase-1`, with pre-existing untracked `.claude/` and `app/fonts/` shown. Leave `.claude/` alone; `app/fonts/` gets committed in Task 2.

- [ ] **Step 2: Replace `app/globals.css` entirely**

The old file has a light theme block, a `blink` keyframe for the typewriter cursor, and a grain overlay. The light theme and the keyframe both go. The grain overlay stays — it is a texture, not scroll machinery.

```css
@import "tailwindcss";

/* ── Palette: one ground, one accent ─────────────────────────────────────
 * Ground and card are near-black violets; the accent is the cosmic spec's
 * Orchid, saturated so it reads as an accent rather than a second text
 * colour. Dark only by design — there is no light theme.
 * ------------------------------------------------------------------- */
:root {
  --bg:     #14131A;
  --card:   #23212C;
  --border: #332F40;
  --fg:     #EDEAF2;
  --body:   #B9B2C4;
  --muted:  #948CA3;
  --accent: #D08FCB;
}

html {
  scroll-padding-top: 5rem;
}

body {
  background-color: var(--bg);
  color: var(--fg);
  font-family: var(--font-satoshi), ui-sans-serif, system-ui, sans-serif;
  overflow-x: hidden;
}

/* Static grain overlay */
.grain {
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px;
  pointer-events: none;
  z-index: 4;
  opacity: 0.032;
}
```

Note `overflow-x: hidden` on `body` stays — that is a horizontal-overflow guard on the page root, not an `overflow:hidden` content wrapper, and it is not what the hard requirement forbids.

`--font-satoshi` does not exist yet; Task 2 defines it. Until then the fallback stack renders. That is expected and not a bug.

- [ ] **Step 3: Verify the build and the emitted tokens**

```bash
npm run build
CSS=$(ls out/_next/static/chunks/*.css | head -1)
grep -o '\-\-accent:#D08FCB\|--accent: #D08FCB' "$CSS"
grep -c 'data-theme' "$CSS"
grep -c 'blink' "$CSS"
```

Expected: the accent token is found; `data-theme` count is `0`; `blink` count is `0`. Non-zero on either of the last two means dead theme or typewriter CSS survived.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "swap palette to near-black violet + orchid, drop light theme

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Self-host Satoshi, drop Geist, remove the theme machinery

**Files:**
- Modify: `app/layout.tsx` (whole file)
- Add to git: `app/fonts/Satoshi-Regular.woff2`, `app/fonts/Satoshi-Bold.woff2`
- Delete: `app/components/ThemeToggle.tsx`

**Interfaces:**
- Consumes: `--font-satoshi` is referenced by `app/globals.css` from Task 1.
- Produces: the CSS variable `--font-satoshi` on `<body>`. No component imports the font directly; everything inherits from `body`.

- [ ] **Step 1: Confirm the font files are present**

```bash
ls -la app/fonts/
```

Expected: `Satoshi-Regular.woff2` (~25516 bytes) and `Satoshi-Bold.woff2` (~25328 bytes). `Melodrama-SemiBold.woff2` is also present — **do not commit it**; it is not used.

If the Satoshi files are missing, STOP and report NEEDS_CONTEXT rather than downloading substitutes.

- [ ] **Step 2: Replace `app/layout.tsx` entirely**

```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";

const satoshi = localFont({
  variable: "--font-satoshi",
  display: "swap",
  src: [
    { path: "./fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Krush Patel",
  description: "Software developer and CSE student at The Ohio State University.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${satoshi.variable} antialiased`}>
        <SmoothScroll>
          <div className="grain" aria-hidden="true" />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
```

Three removals to be deliberate about: the `Geist` / `Geist_Mono` imports (Satoshi replaces the sans; `font-mono` uses Tailwind's built-in stack), the inline `<head>` script that read `localStorage` and set `data-theme` (there is no light theme now), and `suppressHydrationWarning` (it existed only because that script mutated the DOM before hydration).

- [ ] **Step 3: Delete the theme toggle**

```bash
git rm app/components/ThemeToggle.tsx
grep -rn "ThemeToggle" app/ || echo "no references remain"
```

Expected: `Portfolio.tsx` still imports and renders it at this point, so the grep WILL find references and the build WILL fail. That is expected — fix it now by removing the import line and the `<ThemeToggle />` usage from `app/components/Portfolio.tsx`. Do not remove anything else from that file yet.

- [ ] **Step 4: Verify**

```bash
npx eslint app
npm run build
grep -rc "Geist" out/index.html
ls out/_next/static/media/ | head
```

Expected: eslint clean, build succeeds, `Geist` count is `0`, and the media directory lists two Satoshi `.woff2` files.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/fonts/Satoshi-Regular.woff2 app/fonts/Satoshi-Bold.woff2 app/components/Portfolio.tsx
git status --short app/fonts/
```

`git status` must still show `Melodrama-SemiBold.woff2` as untracked (`??`). If it appears as staged (`A`), unstage it with `git restore --staged app/fonts/Melodrama-SemiBold.woff2` — the rebrand uses one typeface and that file must not enter the repo.

```bash
git commit -m "self-host satoshi, drop geist and the light-theme script

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Split Patel Family Enterprises into its own data export

**Files:**
- Modify: `app/data/resume.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: **`export interface Business`** with fields `company: string`, `role: string`, `period: string`, `location: string`, `names: string[]`, `bullets: string[]`, `tags: string[]`; and **`export const business: Business`**. Task 8 imports `{ business }`. The `experience` array loses its last element and keeps its existing `Job` type unchanged.

- [ ] **Step 1: Remove the Patel Family Enterprises entry from `experience`**

Delete this entire object — it is the last element of the `experience` array:

```ts
  {
    company: "Patel Family Enterprises",
    role: "Owner/Operations Manager",
    period: "Jan 2019 – Present",
    location: "Parma, OH",
    tech: [],
    bullets: [
      "Oversee daily operations across 3 family-owned franchise and retail businesses generating $1.5M+ in combined annual revenue, managing 20+ employees across scheduling, vendor relations, POS systems, and inventory management",
    ],
  },
```

`experience` now holds five entries: IGS Energy, Emerson (Software Developer), Emerson (System Analyst), Parcel, Aeigis. Do not reorder them. Do not touch their content.

- [ ] **Step 2: Add the `Business` interface and `business` export**

Insert this immediately after the closing `];` of the `experience` array and before `export interface Project`:

```ts
export interface Business {
  company: string;
  role: string;
  period: string;
  location: string;
  /** The individual businesses, kept as structured data — the Phase 2
   *  detail page needs them separately, not as a pre-joined string. */
  names: string[];
  bullets: string[];
  tags: string[];
}

export const business: Business = {
  company: "Patel Family Enterprises",
  role: "Owner / Operations Manager",
  period: "Jan 2019 – Present",
  location: "Parma, OH",
  names: ["Big Creek Convenience", "Tropical Smoothie Cafe", "Signarama"],
  bullets: [
    "Independent retail, a food-service franchise, and a B2B sign shop: three operating models, $1.5M+ combined annual revenue, 20+ employees.",
    "Oversee daily operations across all three — scheduling, hiring, vendor relations, POS systems, and inventory.",
  ],
  tags: ["Retail", "Franchise", "Operations", "Hiring", "P&L"],
};
```

Copy these strings verbatim. Note `Owner / Operations Manager` here has spaces around the slash (the résumé array used `Owner/Operations Manager`); that is intentional for display. The period uses an en dash `–` (U+2013).

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
npm run build
grep -c "Patel Family Enterprises" out/index.html
```

Expected: type-check clean, build succeeds, and the grep returns `0` — the card is no longer rendered anywhere, because nothing imports `business` yet. Task 8 brings it back. A non-zero count here means the entry was copied rather than moved.

- [ ] **Step 4: Commit**

```bash
git add app/data/resume.ts
git commit -m "split patel family enterprises out of experience into its own export

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Shared primitives — Tag, SectionHeading, restyled PillLink

**Files:**
- Create: `app/components/Tag.tsx`
- Create: `app/components/SectionHeading.tsx`
- Modify: `app/components/PillLink.tsx`

**Interfaces:**
- Consumes: the seven CSS tokens from Task 1.
- Produces three components used by Tasks 5–10:
  - `Tag({ label }: { label: string })`
  - `SectionHeading({ id, label }: { id: string; label: string })` — renders the mono uppercase label plus a hairline rule, and **carries the section's anchor `id`**
  - `PillLink({ href, external?, children })` — signature unchanged from today

- [ ] **Step 1: Create `app/components/Tag.tsx`**

```tsx
export default function Tag({ label }: { label: string }) {
  return (
    <span
      style={{ color: "var(--accent)", borderColor: "color-mix(in srgb, var(--accent) 38%, transparent)" }}
      className="font-mono text-[10px] tracking-wide border rounded-full px-2 py-0.5"
    >
      {label}
    </span>
  );
}
```

- [ ] **Step 2: Create `app/components/SectionHeading.tsx`**

```tsx
export default function SectionHeading({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  return (
    <div id={id} className="scroll-mt-20">
      <p
        style={{ color: "var(--muted)" }}
        className="font-mono text-[11px] tracking-[0.14em] uppercase"
      >
        {label}
      </p>
      <hr style={{ borderColor: "var(--border)" }} className="mt-3 border-t" />
    </div>
  );
}
```

The `id` lives here so the header's anchor links land on the section label rather than mid-card. `scroll-mt-20` keeps the fixed header from covering it.

- [ ] **Step 3: Replace `app/components/PillLink.tsx`**

Same props and behaviour; restyled for the new tokens.

```tsx
export default function PillLink({
  href,
  external = true,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={{ color: "var(--accent)", borderColor: "var(--border)" }}
      className="text-sm border px-4 py-1.5 rounded-full transition-colors hover:bg-[var(--card)]"
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npx eslint app
npx tsc --noEmit
npm run build
```

Expected: all clean. Nothing renders differently yet — `Tag` and `SectionHeading` are not yet imported anywhere, and that is fine.

- [ ] **Step 5: Commit**

```bash
git add app/components/Tag.tsx app/components/SectionHeading.tsx app/components/PillLink.tsx
git commit -m "add Tag and SectionHeading primitives, restyle PillLink

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Header

**Files:**
- Create: `app/components/Header.tsx`
- Modify: `app/components/Portfolio.tsx` (remove the inline `<nav>` block, render `<Header />`)

**Interfaces:**
- Consumes: tokens from Task 1.
- Produces: `Header()` — no props. Renders a fixed top bar.

- [ ] **Step 1: Create `app/components/Header.tsx`**

```tsx
const SECTIONS = ["experience", "businesses", "projects"] as const;

/* The explicit type matters: without it TypeScript infers a union from the
 * array literal and `l.external` fails to compile on the two entries that
 * omit the key. */
const SOCIALS: { label: string; href: string; external?: boolean }[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/krush-patel-54324a2a5" },
  { label: "GitHub", href: "https://github.com/krushpatel04" },
  { label: "Email", href: "mailto:patel.5355@osu.edu", external: false },
];

export default function Header() {
  return (
    <header
      style={{ background: "var(--bg)", borderColor: "var(--border)" }}
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md"
    >
      <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between gap-3">
        <a
          href="#top"
          style={{ color: "var(--fg)" }}
          className="font-bold tracking-tight text-sm shrink-0"
        >
          kp
        </a>

        <nav className="flex items-center gap-1 sm:gap-2">
          {SECTIONS.map((s) => (
            <a
              key={s}
              href={`#${s}`}
              style={{ color: "var(--body)" }}
              className="text-[11px] sm:text-sm px-1.5 sm:px-3 py-1.5 rounded-lg capitalize transition-colors hover:bg-[var(--card)] hover:text-[var(--fg)]"
            >
              {s}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 shrink-0">
          {SOCIALS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.external === false
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
              style={{ color: "var(--muted)" }}
              className="hidden sm:block text-xs px-2 py-1.5 rounded-lg transition-colors hover:bg-[var(--card)] hover:text-[var(--accent)]"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
```

**The section anchors deliberately have no `hidden` class** — they stay visible at every width, at a smaller size below `sm`. The *social* links are the ones that drop on mobile (`hidden sm:block`), because the hero carries the same three links. Do not "fix" this asymmetry; it is the spec's stated priority order.

- [ ] **Step 2: Wire it into `Portfolio.tsx`**

Add `import Header from "./Header";` alongside the other imports. Delete the entire inline `<nav> … </nav>` block (it begins at roughly line 333 with `<nav` and ends with `</nav>`) and render `<Header />` in its place.

- [ ] **Step 3: Verify, including mobile visibility**

```bash
npx eslint app
npm run build
grep -o 'href="#experience"' out/index.html
grep -o 'href="#businesses"' out/index.html
grep -o 'href="#projects"' out/index.html
```

Expected: each found once. Then confirm the section anchors are not hidden — extract the header markup and check no anchor whose `href` starts with `#` carries the `hidden` class:

```bash
grep -o '<a[^>]*href="#experience"[^>]*>' out/index.html
```

Expected: the printed tag's `class` attribute must NOT contain the word `hidden`. If it does, the wrong element got the mobile class.

- [ ] **Step 4: Commit**

```bash
git add app/components/Header.tsx app/components/Portfolio.tsx
git commit -m "extract Header with three always-visible section anchors

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Hero — remove the typewriter and every scroll-linked transform

**Files:**
- Create: `app/components/Hero.tsx`
- Delete: `app/components/TypeWriter.tsx`
- Modify: `app/components/Portfolio.tsx` (remove the hero section, the `100vh` spacer, and all `useScroll`/`useTransform` hero machinery)

**Interfaces:**
- Consumes: `PillLink` from Task 4.
- Produces: `Hero()` — no props.

- [ ] **Step 1: Create `app/components/Hero.tsx`**

Height is whatever the content needs. No `100vh`, no pinning, no scroll linkage.

```tsx
import Image from "next/image";
import PillLink from "./PillLink";

export default function Hero() {
  return (
    <section id="top" className="pt-28 pb-16">
      <div className="flex flex-col sm:flex-row items-start gap-8">
        <Image
          src="/My_Portfolio/headShot.jpeg"
          alt="Krush Patel"
          width={160}
          height={200}
          className="rounded-xl object-cover shrink-0"
          unoptimized
          priority
        />

        <div>
          <h1
            style={{ color: "var(--fg)" }}
            className="text-4xl sm:text-5xl font-bold tracking-tight leading-none mb-3"
          >
            Krush Patel
          </h1>

          <p
            style={{ color: "var(--accent)" }}
            className="text-base font-bold mb-4"
          >
            Software Developer &middot; CSE @ Ohio State
          </p>

          <p
            style={{ color: "var(--body)" }}
            className="text-sm leading-relaxed mb-6 max-w-md"
          >
            Senior CSE student at OSU building software and managing multiple
            businesses. Currently a full-stack software developer Intern at IGS
            Energy and previously co-oped at Emerson. On the side I help manage
            my family businesses and have co-founded two startup finalists at
            OSU accelerators.
          </p>

          <div className="flex flex-wrap gap-3">
            <PillLink href="https://www.linkedin.com/in/krush-patel-54324a2a5">
              LinkedIn ↗
            </PillLink>
            <PillLink href="https://github.com/krushpatel04">GitHub ↗</PillLink>
            <PillLink href="mailto:patel.5355@osu.edu" external={false}>
              patel.5355@osu.edu
            </PillLink>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Delete the typewriter**

```bash
git rm app/components/TypeWriter.tsx
```

- [ ] **Step 3: Strip the hero machinery out of `Portfolio.tsx`**

Remove all of the following from `app/components/Portfolio.tsx`:

- the `TypeWriter` import
- the `phase` state (`const [phase, setPhase] = useState<"typing" | "revealed">("typing")`) and every reference to it
- `spacerRef` and its `<div ref={spacerRef} style={{ height: "100vh" }} />` spacer
- the `useScroll({ target: spacerRef, … })` call
- `heroScale`, `heroOpacity`, `heroBorderRadius` and every place they are applied
- the entire old hero `<motion.section>` block, replaced by `<Hero />`
- the `useEffect` that sets `window.history.scrollRestoration = "manual"` and calls `window.scrollTo(0, 0)` — it exists only to make the pinned-hero choreography start cleanly, and with plain flow it fights normal anchor navigation

Add `import Hero from "./Hero";`. Remove now-unused imports (`useState`, `useRef`, `useEffect`, `useScroll`, `useTransform`, `Image`, `PillLink`) **only if nothing else in the file still uses them** — the Experience track in Task 7 still needs some. Let `npx eslint app` tell you which are genuinely unused.

- [ ] **Step 4: Verify no scroll-linked hero remains**

```bash
npx eslint app
npm run build
grep -c "TypeWriter" out/index.html
grep -rn "heroScale\|heroOpacity\|heroBorderRadius\|scrollRestoration" app/ || echo "hero machinery gone"
grep -o 'Krush Patel' out/index.html | head -1
```

Expected: `TypeWriter` count `0`; the grep over `app/` prints "hero machinery gone"; the name renders.

- [ ] **Step 5: Commit**

```bash
git add -A app/components/
git commit -m "replace pinned typewriter hero with a plain flow Hero

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Experience — delete the horizontal track, build vertical cards

**This is the task the rebrand exists for.** The current Experience section is the `position:sticky; height:100vh; overflow:hidden` container with a `translateX`-driven flex track. All of it goes.

**Files:**
- Create: `app/components/JobCard.tsx`
- Create: `app/components/ExperienceSection.tsx`
- Modify: `app/components/Portfolio.tsx` (delete the track, render `<ExperienceSection />`)

**Interfaces:**
- Consumes: `Job` and `experience` from `app/data/resume.ts`; `Tag` and `SectionHeading` from Task 4.
- Produces: `JobCard({ job }: { job: Job })` and `ExperienceSection()`.

- [ ] **Step 1: Create `app/components/JobCard.tsx`**

```tsx
import type { Job } from "../data/resume";
import Tag from "./Tag";

export default function JobCard({ job }: { job: Job }) {
  return (
    <article
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
      className="border rounded-xl p-5 sm:p-6"
    >
      <h3
        style={{ color: "var(--fg)" }}
        className="text-lg font-bold tracking-tight leading-snug"
      >
        {job.company}
      </h3>

      <p
        style={{ color: "var(--muted)" }}
        className="font-mono text-[10px] tracking-[0.09em] uppercase mt-2"
      >
        {job.role} &middot; {job.location} &middot; {job.period}
      </p>

      {job.tech.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {job.tech.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      )}

      <ul className="mt-4 flex flex-col gap-2.5">
        {job.bullets.map((b, i) => (
          <li
            key={i}
            style={{ color: "var(--body)" }}
            className="text-sm leading-relaxed flex gap-2.5"
          >
            <span style={{ color: "var(--accent)" }} className="shrink-0">
              &mdash;
            </span>
            {b}
          </li>
        ))}
      </ul>
    </article>
  );
}
```

No fixed height, no `overflow`, no truncation. The card is as tall as its content.

- [ ] **Step 2: Create `app/components/ExperienceSection.tsx`**

```tsx
import { experience } from "../data/resume";
import SectionHeading from "./SectionHeading";
import JobCard from "./JobCard";

export default function ExperienceSection() {
  return (
    <section className="pt-16">
      <SectionHeading id="experience" label="Experience" />
      <div className="mt-8 flex flex-col gap-5">
        {experience.map((job, i) => (
          <JobCard key={`${job.company}-${i}`} job={job} />
        ))}
      </div>
    </section>
  );
}
```

The key includes the index because `experience` contains two entries with `company: "Emerson"`.

- [ ] **Step 3: Delete the entire horizontal track from `Portfolio.tsx`**

Remove all of the following:

- the old `ExperienceCard` function (the one with `style={{ width: "100vw", height: "100%", flexShrink: 0 }}`)
- the old inline `Tag` function, if one remains — `Tag` now lives in its own file
- the `track` ref and the `track.style.transform = \`translateX(...)\`` effect
- the wrapper with `position: "sticky"`, `height: "100vh"`, `overflow: "hidden"`
- any remaining `useScroll` / `useTransform` / `useRef` / `useEffect` used only by that track
- the "scroll to navigate" affordance text

Add `import ExperienceSection from "./ExperienceSection";` and render `<ExperienceSection />` in its place.

- [ ] **Step 4: Verify the forbidden patterns are gone**

```bash
npx eslint app
grep -rn "100vh\|h-screen\|overflow: *\"hidden\"\|overflow-hidden\|position: *\"sticky\"\|sticky top-\|translateX" app/components/
```

**Expected at this point: exactly ONE hit**, and it must be `minHeight: "100vh"` inside the old `ProjectsSection` function still living in `Portfolio.tsx`. That block is deleted in Task 9 — leave it alone here.

**Anything else printing is a failure of this task** and must be removed before continuing: no `100vh` on any Experience markup, no `overflow:hidden` wrapper, no sticky track, no `translateX`. This is the hard requirement.

To confirm the one remaining hit is the expected one and nothing Experience-related survived:

```bash
grep -rn "100vh\|h-screen\|overflow-hidden\|sticky\|translateX" app/components/JobCard.tsx app/components/ExperienceSection.tsx || echo "EXPERIENCE CLEAN"
```

Expected: `EXPERIENCE CLEAN`.

(`overflow-x: hidden` in `globals.css` on `body` is allowed and is not matched by these greps, which only scan `app/components/`.)

- [ ] **Step 5: Verify the mobile clipping defect is actually fixed**

This is the regression gate. Build, serve the static export, and screenshot at phone width.

The window is 375 wide (iPhone SE) but 4000 tall on purpose: the point is no longer "does it fit in 667px" — with plain document flow the page simply scrolls, so viewport height is irrelevant. The tall capture proves the card renders **complete and unclipped**, which is what actually broke before.

```bash
npm run build
mkdir -p /tmp/serve && rm -rf /tmp/serve/My_Portfolio && cp -R out /tmp/serve/My_Portfolio
(python3 -m http.server 8901 --directory /tmp/serve > /dev/null 2>&1 &)
sleep 2
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
  --window-size=375,4000 --virtual-time-budget=8000 \
  --screenshot=/tmp/rebrand_mobile.png \
  "http://localhost:8901/My_Portfolio/"
pkill -f "http.server 8901"
```

Then **open `/tmp/rebrand_mobile.png` and look at it.** Confirm the IGS Energy card shows its heading, its meta line, all ten tech tags, and all four bullets — ending with "…so legacy paths couldn't reactivate." — with nothing cut off at either end. On the live site today that card loses ~87px off the top and ~87px off the bottom; here it must be complete.

Also confirm from the DOM that nothing is clipped:

```bash
grep -c "legacy paths couldn't reactivate" out/index.html
```

Expected: `1`.

If any part of the card is missing in the screenshot, STOP and report — do not proceed to Task 8.

- [ ] **Step 6: Commit**

```bash
git add -A app/components/
git commit -m "replace the 100vh horizontal experience track with vertical cards

Fixes the measured mobile clipping: cards are now plain document flow
and grow to fit their content.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: Businesses section

**Files:**
- Create: `app/components/BusinessCard.tsx`
- Create: `app/components/BusinessesSection.tsx`
- Modify: `app/components/Portfolio.tsx` (render `<BusinessesSection />` between Experience and Projects)

**Interfaces:**
- Consumes: `business` and `Business` from `app/data/resume.ts` (Task 3); `Tag`, `SectionHeading` (Task 4).
- Produces: `BusinessCard({ item }: { item: Business })` and `BusinessesSection()`.

- [ ] **Step 1: Create `app/components/BusinessCard.tsx`**

The three business names sit on the card face, separated by accent dots. That is what makes a one-card section read as substantial.

```tsx
import type { Business } from "../data/resume";
import Tag from "./Tag";

export default function BusinessCard({ item }: { item: Business }) {
  return (
    <article
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
      className="border rounded-xl p-5 sm:p-6"
    >
      <h3
        style={{ color: "var(--fg)" }}
        className="text-lg font-bold tracking-tight leading-snug"
      >
        {item.company}
      </h3>

      <p
        style={{ color: "var(--muted)" }}
        className="font-mono text-[10px] tracking-[0.09em] uppercase mt-2"
      >
        {item.role} &middot; {item.location} &middot; {item.period}
      </p>

      <ul className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 mt-4">
        {item.names.map((name, i) => (
          <li key={name} className="flex items-center gap-2.5">
            {i > 0 && (
              <span
                aria-hidden="true"
                style={{ background: "var(--accent)" }}
                className="block w-[3px] h-[3px] rounded-full"
              />
            )}
            <span
              style={{ color: "var(--fg)" }}
              className="text-sm font-bold"
            >
              {name}
            </span>
          </li>
        ))}
      </ul>

      <ul className="mt-4 flex flex-col gap-2.5">
        {item.bullets.map((b, i) => (
          <li
            key={i}
            style={{ color: "var(--body)" }}
            className="text-sm leading-relaxed flex gap-2.5"
          >
            <span style={{ color: "var(--accent)" }} className="shrink-0">
              &mdash;
            </span>
            {b}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1.5 mt-4">
        {item.tags.map((t) => (
          <Tag key={t} label={t} />
        ))}
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Create `app/components/BusinessesSection.tsx`**

```tsx
import { business } from "../data/resume";
import SectionHeading from "./SectionHeading";
import BusinessCard from "./BusinessCard";

export default function BusinessesSection() {
  return (
    <section className="pt-16">
      <SectionHeading id="businesses" label="Businesses" />
      <div className="mt-8">
        <BusinessCard item={business} />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire it into `Portfolio.tsx`**

Add `import BusinessesSection from "./BusinessesSection";` and render `<BusinessesSection />` **between** `<ExperienceSection />` and the Projects section.

- [ ] **Step 4: Verify**

```bash
npx eslint app
npm run build
grep -c "Big Creek Convenience" out/index.html
grep -c "Tropical Smoothie Cafe" out/index.html
grep -c "Signarama" out/index.html
grep -c "Patel Family Enterprises" out/index.html
```

Expected: `1` for each. Also confirm the section is reachable: the header's `#businesses` link and `SectionHeading`'s `id="businesses"` must match — `grep -c 'id="businesses"' out/index.html` should return `1`.

- [ ] **Step 5: Commit**

```bash
git add app/components/BusinessCard.tsx app/components/BusinessesSection.tsx app/components/Portfolio.tsx
git commit -m "add Businesses section with the three named businesses on the card

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 9: Projects section

**Files:**
- Create: `app/components/ProjectCard.tsx`
- Create: `app/components/ProjectsSection.tsx`
- Modify: `app/components/Portfolio.tsx` (delete the old `ProjectsSection` function, render the new one)

**Interfaces:**
- Consumes: `Project` and `projects` from `app/data/resume.ts`; `Tag`, `SectionHeading` (Task 4); `PillLink` (Task 4).
- Produces: `ProjectCard({ project }: { project: Project })` and `ProjectsSection()`.

- [ ] **Step 1: Create `app/components/ProjectCard.tsx`**

Same card language as `JobCard` — the two sections must read as one system.

```tsx
import type { Project } from "../data/resume";
import Tag from "./Tag";
import PillLink from "./PillLink";

export default function ProjectCard({ project }: { project: Project }) {
  const hasLinks = Boolean(project.link || project.youtube);

  return (
    <article
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
      className="border rounded-xl p-5 sm:p-6"
    >
      <h3
        style={{ color: "var(--fg)" }}
        className="text-lg font-bold tracking-tight leading-snug"
      >
        {project.name}
      </h3>

      <p
        style={{ color: "var(--muted)" }}
        className="font-mono text-[10px] tracking-[0.09em] uppercase mt-2"
      >
        {project.date}
      </p>

      {project.tech.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tech.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      )}

      <p
        style={{ color: "var(--body)" }}
        className="text-sm leading-relaxed mt-4"
      >
        {project.description}
      </p>

      {hasLinks && (
        <div className="flex flex-wrap gap-3 mt-5">
          {project.link && <PillLink href={project.link}>GitHub ↗</PillLink>}
          {project.youtube && <PillLink href={project.youtube}>Demo ↗</PillLink>}
        </div>
      )}
    </article>
  );
}
```

The `hasLinks` guard matters: `Systems Programming Coursework` has `link: null` and no `youtube`, so without it that card renders an empty flex row with stray margin.

- [ ] **Step 2: Create `app/components/ProjectsSection.tsx`**

```tsx
import { projects } from "../data/resume";
import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";

export default function ProjectsSection() {
  return (
    <section className="pt-16">
      <SectionHeading id="projects" label="Projects" />
      <div className="mt-8 flex flex-col gap-5">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Replace the old Projects section in `Portfolio.tsx`**

Delete the entire old `function ProjectsSection() { … }` defined inside `Portfolio.tsx` — the one whose `<section>` carries `minHeight: "100vh"`. Import the new one instead: `import ProjectsSection from "./ProjectsSection";`.

- [ ] **Step 4: Verify**

```bash
npx eslint app
npm run build
grep -c "2D Zelda Style Game" out/index.html
grep -c "Systems Programming Coursework" out/index.html
grep -rn "minHeight: *\"100vh\"" app/ || echo "no 100vh remains"
```

Expected: `1`, `1`, and "no 100vh remains".

- [ ] **Step 5: Commit**

```bash
git add app/components/ProjectCard.tsx app/components/ProjectsSection.tsx app/components/Portfolio.tsx
git commit -m "restyle Projects as cards matching the Experience card language

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 10: Footer, composition root, and the full verification gate

**Files:**
- Create: `app/components/Footer.tsx`
- Modify: `app/components/Portfolio.tsx` (reduce to a composition root)

**Interfaces:**
- Consumes: every component from Tasks 5–9.
- Produces: `Footer()` and the final `Portfolio()`.

- [ ] **Step 1: Create `app/components/Footer.tsx`**

```tsx
import PillLink from "./PillLink";

export default function Footer() {
  return (
    <footer
      style={{ borderColor: "var(--border)" }}
      className="mt-24 pt-8 pb-16 border-t flex flex-col sm:flex-row sm:items-center gap-5 sm:justify-between"
    >
      <p style={{ color: "var(--muted)" }} className="font-mono text-[11px]">
        © 2026 Krush Patel
      </p>
      <div className="flex flex-wrap gap-3">
        <PillLink href="https://www.linkedin.com/in/krush-patel-54324a2a5">
          LinkedIn ↗
        </PillLink>
        <PillLink href="https://github.com/krushpatel04">GitHub ↗</PillLink>
        <PillLink href="mailto:patel.5355@osu.edu" external={false}>
          Email
        </PillLink>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Replace `app/components/Portfolio.tsx` entirely**

By now it should already be close to this. Make it exactly this — a composition root with no state, no refs, no effects, no scroll logic.

```tsx
import Header from "./Header";
import Hero from "./Hero";
import ExperienceSection from "./ExperienceSection";
import BusinessesSection from "./BusinessesSection";
import ProjectsSection from "./ProjectsSection";
import Footer from "./Footer";

export default function Portfolio() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-5">
        <Hero />
        <ExperienceSection />
        <BusinessesSection />
        <ProjectsSection />
        <Footer />
      </main>
    </>
  );
}
```

If the file still carries a `"use client"` directive and nothing in it needs client-side behaviour, remove it — every component in this tree is now a server component. `SmoothScroll` in `layout.tsx` keeps its own `"use client"`.

- [ ] **Step 3: Confirm the file actually shrank**

```bash
wc -l app/components/Portfolio.tsx
```

Expected: under 25 lines, down from 482.

- [ ] **Step 4: Full static verification**

```bash
npx eslint app
npx tsc --noEmit
npm run build
echo "--- forbidden patterns in components ---"
grep -rn "100vh\|h-screen\|overflow-hidden\|overflow: *\"hidden\"\|position: *\"sticky\"\|sticky top-\|translateX\|useScroll\|useTransform" app/components/ || echo "CLEAN"
echo "--- dead files ---"
ls app/components/TypeWriter.tsx app/components/ThemeToggle.tsx 2>&1 | grep -c "No such file"
echo "--- content present ---"
for s in "Krush Patel" "IGS Energy" "Big Creek Convenience" "Tropical Smoothie Cafe" "Signarama" "2D Zelda Style Game"; do
  printf "%-28s %s\n" "$s" "$(grep -c "$s" out/index.html)"
done
```

Expected: eslint and tsc clean; build succeeds; `CLEAN` printed; dead-file count `2`; every content string count ≥ `1`.

- [ ] **Step 5: Visual verification at three widths**

```bash
npm run build
mkdir -p /tmp/serve && rm -rf /tmp/serve/My_Portfolio && cp -R out /tmp/serve/My_Portfolio
(python3 -m http.server 8902 --directory /tmp/serve > /dev/null 2>&1 &)
sleep 2
for w in 375 768 1440; do
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --window-size=$w,4200 --virtual-time-budget=8000 \
    --screenshot=/tmp/rebrand_$w.png \
    "http://localhost:8902/My_Portfolio/"
done
pkill -f "http.server 8902"
```

**Open all three PNGs and check each:**

1. **375px** — the header shows `kp` plus all three section words, none cut off. The full IGS card is present including all four bullets. Nothing is clipped anywhere.
2. **768px** — social links have appeared in the header.
3. **1440px** — content is centred and constrained, not stretched edge to edge.

On every width confirm: the Businesses card shows all three business names; the Systems Programming Coursework card has no empty link row; nothing is unreadable against the background.

- [ ] **Step 6: Commit**

```bash
git add app/components/Footer.tsx app/components/Portfolio.tsx
git commit -m "add Footer and reduce Portfolio to a composition root

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

- [ ] **Step 7: Report, do not push**

```bash
git log --oneline main..rebrand-phase-1
git status --short
```

Leave the branch local. **Do not push and do not merge** — a human decides integration after reviewing the screenshots, and pushing `main` deploys straight to the live site.

---

## Notes for the implementer

- Phase 2 — the About page, per-entity detail pages, and clickable cards with chevrons — is deliberately **not** in this plan. Do not add chevrons, "read more" links, or an About nav item; they would point at pages that do not exist.
- The `cosmic-redesign` branch and `.claude/worktrees/` are parked. Do not merge, cherry-pick, or delete.
- If a step's expected output does not match, stop and report rather than adjusting the verification to pass.
