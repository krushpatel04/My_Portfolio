# Resume Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin and restructure the existing resume page (`app/page.tsx` → `Portfolio.tsx`) with the "Cosmic" color/type system, replacing the typewriter hero reveal and horizontal scroll-jacked Experience timeline with a calmer vertical layout of nebula-wash Hero + Wine Ash "hero cards" for Experience and Projects.

**Architecture:** Split the current monolithic `Portfolio.tsx` (473 lines: Nav + fixed/pinned Hero + horizontal-scroll timeline + Projects, all in one file) into five focused components — `Nav`, `Hero`, `ExperienceSection`/`ExperienceCard`, `ProjectsSection`/`ProjectCard` — plus a shared `Tag`. `Portfolio.tsx` becomes a thin composition root. Colors and fonts are wired through the same CSS-custom-property + `next/font` pattern already used in this repo (no new state-management or styling library).

**Tech Stack:** Next.js 16 (App Router, static export), React 19, TypeScript 5 (strict), Tailwind CSS 4, Framer Motion (already a dependency), `next/font/google` + `next/font/local`.

## Global Constraints

- Do not change `next.config.ts` (`output: "export"`, `basePath`/`assetPrefix: "/My_Portfolio"`, `images.unoptimized: true`) or `package.json` dependencies — no new packages needed, everything used here (`framer-motion`, `next/font`) is already installed.
- There is no test suite in this repo. Every task's "done" signal is: `npm run lint` clean, `npx tsc --noEmit` clean, `npm run build` succeeds, and a manual check in `npm run dev`.
- Commit style in this repo is short, lowercase, casual (see `git log --oneline`) — match it. One commit per task.
- Current branch is `main`, working tree clean. Task 1 creates a feature branch `cosmic-redesign` before any other changes — do not commit this work directly to `main`.
- Colors and fonts below are exact values approved in `docs/superpowers/specs/2026-07-17-resume-page-redesign-design.md` — do not substitute different hexes or font weights.
- Dark theme (default) uses the Cosmic palette; light theme uses a new light counterpart derived in this plan (not in the original spec — approved separately: same violet-family hues, Cosmic itself becomes the light-mode text color). The nebula-wash decorative effect (cloud blooms + stars) is dark-only; it's hidden via CSS in light mode rather than redesigned.

---

### Task 1: Create feature branch, replace color tokens (dark + light) in `globals.css`

**Files:**
- Modify: `app/globals.css` (full token block replacement, lines 1–58)

**Interfaces:**
- Produces: the same 7 CSS custom properties the codebase already uses (`--bg`, `--fg`, `--body`, `--muted`, `--accent`, `--border`, `--card`), now pointing at Cosmic values instead of the old dark-green/gold theme. Every later task's inline `style={{ color: "var(--...)" }}` usage relies on these names being unchanged.

- [ ] **Step 1: Create the feature branch**

```bash
cd /Users/krushpatel/code/my-portfolio
git checkout -b cosmic-redesign
```

Expected: `Switched to a new branch 'cosmic-redesign'`.

- [ ] **Step 2: Replace the theme token block and remove the dead cursor-blink keyframe**

Replace the entire contents of `app/globals.css` with:

```css
@import "tailwindcss";

/* ── Cosmic (dark, default) ─────────────────────────────────────────────── */
:root {
  --bg:     #23212C;
  --fg:     #EDEAF2;
  --body:   rgba(237, 234, 242, 0.75);
  --muted:  rgba(237, 234, 242, 0.45);
  --accent: #E5BDDF;
  --border: rgba(237, 234, 242, 0.10);
  --card:   #32292F;
}

/* ── Cosmic (light) ──────────────────────────────────────────────────────── */
html[data-theme="light"] {
  --bg:     #F5F1F6;
  --fg:     #23212C;
  --body:   rgba(35, 33, 44, 0.75);
  --muted:  rgba(35, 33, 44, 0.45);
  --accent: #A0459B;
  --border: rgba(35, 33, 44, 0.10);
  --card:   #EFE8F1;
}

html {
  scroll-padding-top: 4.5rem;
}

body {
  background-color: var(--bg);
  color: var(--fg);
  font-family: var(--font-satoshi), Arial, sans-serif;
  overflow-x: hidden;
}

body.theme-ready {
  transition: background-color 0.2s ease, color 0.2s ease;
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

/* ── Hero nebula wash ────────────────────────────────────────────────────── */
.nebula-wash {
  position: relative;
}
.nebula-wash::before {
  content: "";
  position: absolute;
  inset: -10%;
  background:
    radial-gradient(38% 46% at 84% 8%, rgba(229, 189, 223, 0.30), transparent 70%),
    radial-gradient(46% 50% at 8% 96%, rgba(112, 76, 88, 0.42), transparent 72%),
    radial-gradient(55% 60% at 60% 60%, rgba(69, 58, 128, 0.24), transparent 75%),
    radial-gradient(30% 34% at 22% 20%, rgba(88, 70, 132, 0.20), transparent 70%);
  filter: blur(2px);
  pointer-events: none;
}
.nebula-wash::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1.6px 1.6px at 11% 22%, rgba(237, 234, 242, 0.9), transparent 60%),
    radial-gradient(1.2px 1.2px at 27% 68%, rgba(237, 234, 242, 0.7), transparent 60%),
    radial-gradient(1.6px 1.6px at 41% 12%, rgba(237, 234, 242, 0.8), transparent 60%),
    radial-gradient(1.2px 1.2px at 58% 45%, rgba(237, 234, 242, 0.6), transparent 60%),
    radial-gradient(1.8px 1.8px at 71% 24%, rgba(237, 234, 242, 0.85), transparent 60%),
    radial-gradient(1.2px 1.2px at 79% 70%, rgba(237, 234, 242, 0.6), transparent 60%),
    radial-gradient(1.4px 1.4px at 90% 38%, rgba(237, 234, 242, 0.75), transparent 60%),
    radial-gradient(1.2px 1.2px at 33% 88%, rgba(237, 234, 242, 0.55), transparent 60%),
    radial-gradient(1.6px 1.6px at 95% 88%, rgba(237, 234, 242, 0.7), transparent 60%),
    radial-gradient(1.2px 1.2px at 6% 55%, rgba(237, 234, 242, 0.5), transparent 60%);
  opacity: 0.9;
  pointer-events: none;
}
@media (prefers-reduced-motion: no-preference) {
  .nebula-wash::after { animation: twinkle 6s ease-in-out infinite; }
}
@keyframes twinkle {
  0%, 100% { opacity: 0.9; }
  50% { opacity: 0.55; }
}
/* The nebula wash is a dark-sky effect — hide it in light mode. Hero just
   sits on the flat --bg like every other section when light mode is active. */
html[data-theme="light"] .nebula-wash::before,
html[data-theme="light"] .nebula-wash::after {
  display: none;
}
```

This removes the old `@keyframes blink` / `.cursor-blink` rule (dead code once `TypeWriter` is deleted in Task 5) and the old dark-green/gold token values.

- [ ] **Step 3: Verify the build still succeeds**

The rest of the codebase still references the same 7 variable names, so nothing should break yet — this task only changes *values*, plus adds new unused-for-now CSS (`.nebula-wash`, `--font-satoshi` reference).

```bash
npm run build
```

Expected: build succeeds (the `--font-satoshi` variable isn't defined until Task 2, but an undefined CSS custom property just falls through to the `Arial, sans-serif` fallback in the `font-family` list — not a build error).

- [ ] **Step 4: Manual browser check**

Run `npm run dev`, open the page. Confirm the background is now the dark violet-black Cosmic color (not the old dark green) and text is off-white. Toggle the theme button — confirm it switches to a light lavender-white background with dark violet-black text. (Layout/fonts will still look like the old site — that's expected, this task is colors only. The hero's typewriter cursor will also stop blinking, since this step removes the `.cursor-blink` keyframe it depends on — that's expected too, not a regression; `TypeWriter` itself is deleted in Task 5.)

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "swap dark-green/gold theme for cosmic palette (dark + light)"
```

---

### Task 2: Self-host Satoshi + Melodrama, wire up Bodoni Moda, drop Geist

**Files:**
- Create: `app/fonts/Satoshi-Regular.woff2`, `app/fonts/Satoshi-Bold.woff2`, `app/fonts/Melodrama-SemiBold.woff2` (binary font files, downloaded)
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: three CSS custom properties for font-family — `--font-title` (Bodoni Moda, bold, for the Hero name), `--font-headline` (Melodrama, semibold, for Experience/Project card titles), `--font-satoshi` (Satoshi, regular+bold, for body/UI text — already wired as the `body` font-family default in Task 1). All later tasks reference these three variable names in `fontFamily` inline styles or via the `body` default.

- [ ] **Step 1: Create the fonts directory and download the three font files**

```bash
cd /Users/krushpatel/code/my-portfolio
mkdir -p app/fonts
curl -sL -o app/fonts/Satoshi-Regular.woff2 "https://cdn.fontshare.com/wf/TTX2Z3BF3P6Y5BQT3IV2VNOK6FL22KUT/7QYRJOI3JIMYHGY6CH7SOIFRQLZOLNJ6/KFIAZD4RUMEZIYV6FQ3T3GP5PDBDB6JY.woff2"
curl -sL -o app/fonts/Satoshi-Bold.woff2 "https://cdn.fontshare.com/wf/LAFFD4SDUCDVQEXFPDC7C53EQ4ZELWQI/PXCT3G6LO6ICM5I3NTYENYPWJAECAWDD/GHM6WVH6MILNYOOCXHXB5GTSGNTMGXZR.woff2"
curl -sL -o app/fonts/Melodrama-SemiBold.woff2 "https://cdn.fontshare.com/wf/RGK7K2PP2EWABN5ERL63PXQAGP7NCSUY/ZH4IXREE3YFPELFWVIUAZCBEHFSFDVYI/XC5RR3MD6B42AUH542IHY2IQVYBKHWES.woff2"
```

- [ ] **Step 2: Verify all three files downloaded correctly**

```bash
file app/fonts/*.woff2
```

Expected: all three lines say `Web Open Font Format (Version 2), TrueType`. If any file is HTML/text instead (a failed download), re-run its `curl` command — Fontshare's CDN paths are content-addressed and permanent, so a retry should succeed.

- [ ] **Step 3: Replace the font setup in `app/layout.tsx`**

Replace the full contents of `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Bodoni_Moda } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";

const bodoniModa = Bodoni_Moda({
  variable: "--font-title",
  weight: "700",
  subsets: ["latin"],
});

const satoshi = localFont({
  src: [
    { path: "./fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
});

const melodrama = localFont({
  src: "./fonts/Melodrama-SemiBold.woff2",
  weight: "600",
  variable: "--font-headline",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem('theme');const prefersLight=window.matchMedia('(prefers-color-scheme: light)').matches;if(t==='light'||(t===null&&prefersLight)){document.documentElement.setAttribute('data-theme','light')}}catch(e){}requestAnimationFrame(()=>document.body.classList.add('theme-ready'));`,
          }}
        />
      </head>
      <body
        className={`${bodoniModa.variable} ${satoshi.variable} ${melodrama.variable} antialiased`}
      >
        <SmoothScroll>
          <div className="grain" aria-hidden="true" />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
```

This drops `Geist`/`Geist_Mono` entirely (the `font-mono` Tailwind class used elsewhere in `Portfolio.tsx` was never actually wired to Geist Mono in the first place — there's no `@theme` block mapping it in `globals.css` and no `tailwind.config` file, so it was silently falling back to Tailwind's generic monospace stack. Task 4 and 6/7 drop the `font-mono` class from the components that used it, since the new type system has no monospace role.)

- [ ] **Step 4: Verify the build**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Expected: no type errors, no lint errors. If `Bodoni_Moda` isn't a recognized export from `next/font/google`, TypeScript/the build will fail immediately with an "has no exported member" error — if that happens, check `node_modules/next/font/google/index.d.ts` for the exact export name (Google Fonts names with spaces become underscores, e.g. "Bodoni Moda" → `Bodoni_Moda`; this has been verified against the same pattern the repo already uses for `Geist_Mono`, but confirm against the installed `next@16.1.1` if it fails).

- [ ] **Step 5: Manual browser check**

Run `npm run dev`, open dev tools → Network tab, reload. Confirm `Satoshi-Regular.woff2`, `Satoshi-Bold.woff2`, and `Melodrama-SemiBold.woff2` load (200 status), plus a Bodoni Moda `.woff2` from Google's font CDN (or self-hosted by Next — `next/font/google` self-hosts at build time, so it'll be served from your own origin, not `fonts.gstatic.com`). Page will still visually look like the old layout — these fonts aren't applied to any element yet, only loaded.

- [ ] **Step 6: Commit**

```bash
git add app/fonts app/layout.tsx
git commit -m "self-host satoshi + melodrama, wire up bodoni moda, drop geist"
```

---

### Task 3: Extract the shared `Tag` component

**Files:**
- Create: `app/components/Tag.tsx`
- Modify: `app/components/Portfolio.tsx:17-30` (remove inline `Tag`, add import — temporary; this whole file gets replaced in Task 8, but keeping the build green at every step matters)

**Interfaces:**
- Produces: `Tag({ label }: { label: string })`, default export from `app/components/Tag.tsx`. Used by `ExperienceCard` (Task 6) and `ProjectCard` (Task 7).

The existing inline `Tag` used `background: var(--card)` — fine when it sat directly on the page background, but Tasks 6/7 place `Tag` *inside* Wine Ash (`var(--card)`) cards, where a `var(--card)`-colored pill would be invisible against its own container. Fix the background to `var(--bg)` instead (Cosmic against Wine Ash — same subtle-but-real distinction the rest of the palette already relies on), and drop `font-mono` (no monospace role in the new type system; Satoshi is already the `body` default).

- [ ] **Step 1: Create `app/components/Tag.tsx`**

```tsx
export default function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        background: "var(--bg)",
        color: "var(--muted)",
        border: "1px solid var(--border)",
      }}
      className="text-xs px-2 py-0.5 rounded-md"
    >
      {label}
    </span>
  );
}
```

- [ ] **Step 2: Remove the inline `Tag` function from `Portfolio.tsx` and import the new one**

In `app/components/Portfolio.tsx`, delete lines 17–30 (the `function Tag({ label }...) {...}` block) and add near the top imports:

```tsx
import Tag from "./Tag";
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Expected: no errors — `Tag` is used identically to before, just imported instead of defined inline.

- [ ] **Step 4: Manual browser check**

Run `npm run dev`. Confirm the tech-stack tag pills under each Experience/Project entry still render (they'll look slightly different — no `font-mono` — that's expected).

- [ ] **Step 5: Commit**

```bash
git add app/components/Tag.tsx app/components/Portfolio.tsx
git commit -m "extract Tag into its own component, fix bg contrast for card use"
```

---

### Task 4: Build the `Nav` component

**Files:**
- Create: `app/components/Nav.tsx`
- Modify: `app/components/Portfolio.tsx` (remove inline `<nav>` JSX, render `<Nav />` instead)

**Interfaces:**
- Produces: `Nav()`, default export from `app/components/Nav.tsx`, no props (identical anchor targets `#experience`/`#projects` as today — those sections still exist further down the page).

- [ ] **Step 1: Create `app/components/Nav.tsx`**

```tsx
"use client";

import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  return (
    <nav
      style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--accent)",
        borderBottom: "1px solid var(--accent)",
      }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
    >
      <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
        <a
          href="#"
          style={{ color: "var(--accent)", fontFamily: "var(--font-title)" }}
          className="tracking-tight text-lg"
        >
          kp
        </a>
        <div className="flex items-center gap-1">
          {["experience", "projects"].map((s) => (
            <a
              key={s}
              href={`#${s}`}
              style={{ color: "var(--muted)" }}
              className="hidden sm:block text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--card)] capitalize"
            >
              {s}
            </a>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Replace the inline `<nav>` block in `Portfolio.tsx`**

In `app/components/Portfolio.tsx`, delete the entire `{/* ── Navbar ── */}` `<nav>...</nav>` block (currently lines ~332–363), and in the JSX where it was, render:

```tsx
<Nav />
```

Add the import near the top:

```tsx
import Nav from "./Nav";
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

- [ ] **Step 4: Manual browser check**

Run `npm run dev`. Confirm the nav bar renders fixed at top, the `kp` wordmark is now in the Bodoni Moda serif (visibly different from the surrounding sans-serif text), "Experience"/"Projects" links scroll to their sections, and the theme toggle still works.

- [ ] **Step 5: Commit**

```bash
git add app/components/Nav.tsx app/components/Portfolio.tsx
git commit -m "extract Nav into its own component, set Bodoni Moda wordmark"
```

---

### Task 5: Build the `Hero` component (nebula wash, Bodoni title, fade-in reveal)

**Files:**
- Create: `app/components/Hero.tsx`
- Delete: `app/components/TypeWriter.tsx`
- Modify: `app/components/Portfolio.tsx` (remove the fixed/pinned hero block, the `phase`/`spacerRef`/`useScroll`/`useTransform` logic, and the 100vh spacer div; render `<Hero />` instead)

**Interfaces:**
- Produces: `Hero()`, default export from `app/components/Hero.tsx`, no props.
- Consumes: `PillLink` from `./PillLink` (unchanged), the `.nebula-wash` CSS class from Task 1, `--font-title` from Task 2.

This is the biggest visual change: the old hero was `position: fixed` and scaled/faded via `useScroll`/`useTransform` as the horizontal timeline scrolled up underneath it — a mechanism tightly coupled to the horizontal-scroll-jack architecture. Since Task 6 removes that architecture, Hero becomes a normal in-document-flow section. The typewriter reveal is replaced with a two-stage Framer Motion fade-in (name, then bio+links), gated by `useReducedMotion()`.

- [ ] **Step 1: Delete `TypeWriter.tsx`**

```bash
rm app/components/TypeWriter.tsx
```

- [ ] **Step 2: Create `app/components/Hero.tsx`**

```tsx
"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import PillLink from "./PillLink";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="hero" className="nebula-wash" style={{ background: "var(--bg)" }}>
      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-40 pb-32">
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ color: "var(--fg)", fontFamily: "var(--font-title)" }}
          className="text-5xl sm:text-7xl font-bold tracking-tight leading-tight"
        >
          Krush Patel
        </motion.h1>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: reduceMotion ? 0 : 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="mt-10 flex flex-col sm:flex-row items-start gap-8"
        >
          <div className="shrink-0">
            <Image
              src="/My_Portfolio/headShot.jpeg"
              alt="Krush Patel"
              width={160}
              height={200}
              className="rounded-xl object-cover"
              unoptimized
            />
          </div>
          <div>
            <p style={{ color: "var(--accent)" }} className="text-base font-semibold mb-3">
              Software Developer &middot; CSE @ Ohio State
            </p>
            <p style={{ color: "var(--body)" }} className="text-sm leading-relaxed mb-6 max-w-sm">
              Senior CSE student at OSU building software and managing
              multiple businesses. Currently a full-stack software
              developer Intern at IGS Energy and previously co-oped at
              Emerson. On the side I help manage my family businesses and
              have co-founded two startup finalists at OSU accelerators.
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
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Strip the old hero mechanism out of `Portfolio.tsx`**

In `app/components/Portfolio.tsx`, remove:
- The `phase`/`setPhase` state and `spacerRef`
- The `scrollYProgress`/`heroScale`/`heroOpacity`/`heroBorderRadius` `useScroll`/`useTransform` block
- The entire `<motion.section style={{ position: "fixed", ... }}>...</motion.section>` fixed-hero JSX block
- The `<div ref={spacerRef} style={{ height: "100vh" }} />` spacer
- The `TypeWriter` import (file no longer exists)

Add the import:

```tsx
import Hero from "./Hero";
```

And render `<Hero />` where the old fixed hero block was (directly after `<Nav />`).

Keep the `useEffect` that resets scroll position on mount (`window.history.scrollRestoration = "manual"; window.scrollTo(0, 0);`) — that's independent of the pinned-hero mechanism and still useful for a normal scrolling page.

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Expected: no errors. (`HorizontalTimeline`/`ExperienceCard` below the Hero in `Portfolio.tsx` still reference the old `experience` horizontal-pan code at this point — that's fine, Task 6 replaces it next. The page will build and run with a new Hero on top of the still-old horizontal timeline underneath.)

- [ ] **Step 5: Manual browser check**

Run `npm run dev`. Confirm: the Hero shows "Krush Patel" in Bodoni Moda, fading/sliding in on load (name first, then photo+bio+links a half-second later), against the dark nebula wash with visible soft color blooms and a faint twinkling star field. Toggle the theme to light — confirm the nebula wash disappears and Hero shows as a plain light section. In system settings, enable "reduce motion" (macOS: System Settings → Accessibility → Display → Reduce Motion), reload — confirm content appears immediately with no fade/slide and stars are static (not twinkling).

- [ ] **Step 6: Commit**

```bash
git add app/components/Hero.tsx app/components/Portfolio.tsx
git rm app/components/TypeWriter.tsx
git commit -m "replace typewriter/pinned hero with nebula-wash Hero + fade-in"
```

---

### Task 6: Build `ExperienceCard` + `ExperienceSection` (vertical Wine Ash cards)

**Files:**
- Create: `app/components/ExperienceCard.tsx`
- Create: `app/components/ExperienceSection.tsx`
- Modify: `app/components/Portfolio.tsx` (remove `HorizontalTimeline`/old `ExperienceCard`/`Tag` re-export leftovers, render `<ExperienceSection />`)

**Interfaces:**
- Consumes: `Job` type and `experience` array from `../data/resume` (unchanged), `Tag` from `./Tag` (Task 3).
- Produces: `ExperienceCard({ job }: { job: Job })` and `ExperienceSection()`, default exports from their respective files.

This removes the `HorizontalTimeline` component entirely (the `wrapperRef`/`trackRef`/`progBarRef`/`requestAnimationFrame` scroll-pin mechanism) in favor of a plain vertical stack. Per the approved design: company name in Melodrama, everything else in Satoshi (the `body` default), Wine Ash (`var(--card)`) surface, no index number (that was tied to the old paginated "01/06" feel).

- [ ] **Step 1: Create `app/components/ExperienceCard.tsx`**

```tsx
import { Job } from "../data/resume";
import Tag from "./Tag";

export default function ExperienceCard({ job }: { job: Job }) {
  return (
    <div className="rounded-2xl p-8 sm:p-10" style={{ background: "var(--card)" }}>
      <p style={{ color: "var(--muted)" }} className="text-xs mb-4 tracking-widest uppercase">
        {job.period}
      </p>
      <h3
        style={{ color: "var(--fg)", fontFamily: "var(--font-headline)" }}
        className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight mb-3"
      >
        {job.company}
      </h3>
      <p className="text-sm mb-6">
        <span style={{ color: "var(--accent)" }}>{job.role}</span>
        <span style={{ color: "var(--muted)" }}>&ensp;&middot;&ensp;{job.location}</span>
      </p>
      {job.tech.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {job.tech.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      )}
      <ul className="space-y-3">
        {job.bullets.map((b, i) => (
          <li
            key={i}
            style={{ color: "var(--body)" }}
            className="text-sm leading-relaxed flex gap-3 max-w-2xl"
          >
            <span style={{ color: "var(--accent)" }} className="mt-1.5 shrink-0 text-xs">
              ▸
            </span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/components/ExperienceSection.tsx`**

```tsx
import { experience } from "../data/resume";
import ExperienceCard from "./ExperienceCard";

export default function ExperienceSection() {
  return (
    <section id="experience" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto px-6 py-24">
        <p style={{ color: "var(--muted)" }} className="text-xs mb-12 tracking-widest uppercase">
          Experience
        </p>
        <div className="space-y-6">
          {experience.map((job, i) => (
            <ExperienceCard key={i} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Remove the old horizontal-timeline code from `Portfolio.tsx`**

In `app/components/Portfolio.tsx`, delete:
- The entire `ExperienceCard` function (the horizontal-pan version, `width: "100vw"` card)
- The entire `HorizontalTimeline` function (wrapper/track/progress-bar scroll-pin logic)
- The `<HorizontalTimeline />` render call

Add the import and render `<ExperienceSection />` in its place:

```tsx
import ExperienceSection from "./ExperienceSection";
```

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

- [ ] **Step 5: Manual browser check**

Run `npm run dev`, scroll to the Experience section. Confirm all 6 jobs render as vertically stacked cards (IGS Energy → Emerson Software Developer → Emerson System Analyst → Parcel → Aeigis → Patel Family Enterprises), each with a Wine Ash background visibly distinct from the Cosmic page background, company name in the Melodrama serif, tech tags visible against the card (not blending in), and bullets readable. No horizontal scrolling or scroll-jacking — normal vertical scroll only.

- [ ] **Step 6: Commit**

```bash
git add app/components/ExperienceCard.tsx app/components/ExperienceSection.tsx app/components/Portfolio.tsx
git commit -m "replace horizontal scroll-jack timeline with vertical Experience cards"
```

---

### Task 7: Build `ProjectCard` + `ProjectsSection` (Wine Ash cards, YouTube thumbnail)

**Files:**
- Create: `app/components/ProjectCard.tsx`
- Create: `app/components/ProjectsSection.tsx`
- Modify: `app/components/Portfolio.tsx` (remove the old `ProjectsSection`, render the new one)

**Interfaces:**
- Consumes: `Project` type and `projects` array from `../data/resume` (unchanged), `Tag` from `./Tag`, `PillLink` from `./PillLink`.
- Produces: `ProjectCard({ proj }: { proj: Project })` and `ProjectsSection()`, default exports.

Same card visual language as Experience (Wine Ash surface, Melodrama name, Satoshi body). The 2D Zelda Style Game project has a YouTube demo (`https://youtu.be/J4wWH2GWCQ4`) — rather than requiring a new image asset, derive its thumbnail directly from YouTube's predictable thumbnail URL pattern (`https://img.youtube.com/vi/<video-id>/hqdefault.jpg`). Systems Programming Coursework has no `youtube` link, so it gets no thumbnail.

- [ ] **Step 1: Create `app/components/ProjectCard.tsx`**

```tsx
import { Project } from "../data/resume";
import Tag from "./Tag";
import PillLink from "./PillLink";

function youTubeThumbnail(youtubeUrl?: string): string | null {
  if (!youtubeUrl) return null;
  const match = youtubeUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

export default function ProjectCard({ proj }: { proj: Project }) {
  const thumbnail = youTubeThumbnail(proj.youtube);

  return (
    <div className="rounded-2xl p-8 sm:p-10" style={{ background: "var(--card)" }}>
      {thumbnail && (
        // eslint-disable-next-line @next/next/no-img-element -- external
        // YouTube thumbnail; images.unoptimized is already true for this
        // static-export site, so next/image provides no benefit here.
        <img
          src={thumbnail}
          alt={`${proj.name} demo thumbnail`}
          className="w-full aspect-video object-cover rounded-lg mb-6"
        />
      )}
      <p style={{ color: "var(--muted)" }} className="text-xs mb-3 tracking-widest uppercase">
        {proj.date}
      </p>
      <h3
        style={{ color: "var(--fg)", fontFamily: "var(--font-headline)" }}
        className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight mb-4"
      >
        {proj.name}
      </h3>
      {proj.tech.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {proj.tech.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      )}
      <p style={{ color: "var(--body)" }} className="text-sm leading-relaxed mb-6 max-w-2xl">
        {proj.description}
      </p>
      <div className="flex flex-wrap gap-3">
        {proj.link && <PillLink href={proj.link}>GitHub ↗</PillLink>}
        {proj.youtube && <PillLink href={proj.youtube}>Demo ↗</PillLink>}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/components/ProjectsSection.tsx`**

```tsx
import { projects } from "../data/resume";
import ProjectCard from "./ProjectCard";

export default function ProjectsSection() {
  return (
    <section id="projects" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto px-6 py-24 pb-32">
        <p style={{ color: "var(--muted)" }} className="text-xs mb-12 tracking-widest uppercase">
          Projects
        </p>
        <div className="space-y-6">
          {projects.map((proj, i) => (
            <ProjectCard key={i} proj={proj} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Remove the old `ProjectsSection` from `Portfolio.tsx` and use the new one**

In `app/components/Portfolio.tsx`, delete the entire old `ProjectsSection` function (the one importing `PillLink` inline and mapping `projects` with the old markup), and replace the `<ProjectsSection />` render call's import:

```tsx
import ProjectsSection from "./ProjectsSection";
```

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

- [ ] **Step 5: Manual browser check**

Run `npm run dev`, scroll to Projects. Confirm both projects render as Wine Ash cards matching Experience's visual language. The "2D Zelda Style Game" card shows a YouTube thumbnail image above its content; "Systems Programming Coursework" has no thumbnail (no `youtube` link) but still renders correctly. Click "Demo ↗" on the Zelda project — confirm it opens the YouTube video in a new tab.

- [ ] **Step 6: Commit**

```bash
git add app/components/ProjectCard.tsx app/components/ProjectsSection.tsx app/components/Portfolio.tsx
git commit -m "restyle Projects as Wine Ash cards with YouTube thumbnail for Zelda project"
```

---

### Task 8: Slim `Portfolio.tsx` to a composition root, final verification

**Files:**
- Modify: `app/components/Portfolio.tsx` (should now just compose the four pieces)

**Interfaces:** None — this task only removes now-dead code; no new interfaces.

By this point `Portfolio.tsx` should have no remaining inline section logic — every piece was extracted in Tasks 3–7. This task confirms that and does a final cleanup pass (unused imports like `framer-motion`'s `useScroll`/`useTransform` if any got missed, unused `useState`/`useRef` if the `phase` state removal in Task 5 left stragglers).

- [ ] **Step 1: Replace `Portfolio.tsx` with the final composition root**

```tsx
"use client";

import { useEffect } from "react";
import Nav from "./Nav";
import Hero from "./Hero";
import ExperienceSection from "./ExperienceSection";
import ProjectsSection from "./ProjectsSection";

export default function Portfolio() {
  /* Prevent browser from restoring the previous scroll position on reload */
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Nav />
      <Hero />
      <ExperienceSection />
      <ProjectsSection />
    </>
  );
}
```

- [ ] **Step 2: Confirm no other file still imports the deleted `TypeWriter`**

```bash
grep -rn "TypeWriter\|HorizontalTimeline" app || echo "clean"
```

Expected: `clean`.

- [ ] **Step 3: Full lint, type-check, and build**

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Expected: 0 lint errors/warnings, no type errors, build succeeds, `out/` regenerated.

- [ ] **Step 4: Full manual browser walkthrough**

Run `npm run dev` and check, in both dark and light theme:
- Nav: `kp` wordmark in Bodoni Moda, Experience/Projects links scroll correctly, theme toggle works with no flash of the wrong theme on reload.
- Hero: nebula wash with cloud blooms + twinkling stars in dark mode, plain flat section in light mode; name fades/slides in, then photo+bio+links; headshot displays sharp; all 3 pill links (LinkedIn, GitHub, email) work.
- Experience: 6 jobs, vertical stack, Wine Ash cards, Melodrama company names, tags visible, bullets readable.
- Projects: 2 projects, same card language, Zelda thumbnail loads and links to YouTube, Coursework project has no thumbnail and no broken image.
- Reduced motion (macOS: System Settings → Accessibility → Display → Reduce Motion): Hero content appears without fade/slide, stars are static.
- Resize to a narrow (mobile-width) viewport: confirm cards, nav, and Hero all reflow sensibly with no horizontal overflow.

- [ ] **Step 5: Confirm working tree is clean**

```bash
git status
```

Expected: `nothing to commit, working tree clean` (everything committed in Tasks 1–7; this task's `Portfolio.tsx` change needs its own commit below first).

- [ ] **Step 6: Commit**

```bash
git add app/components/Portfolio.tsx
git commit -m "slim Portfolio.tsx to a composition root"
```

- [ ] **Step 7: Push the branch and note next steps**

```bash
git push -u origin cosmic-redesign
```

Do **not** merge to `main` or open a PR as part of this plan — that's a decision for the user once they've reviewed the deployed preview / local build themselves.
