# About Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an `/about` page — the site's first subpage — and move the headshot from the homepage hero onto it.

**Architecture:** The site is currently a single route whose `Portfolio.tsx` composes the header, the content container, the sections, and the footer. A second page needs that chrome shared, so `Header`, `Footer`, and the `max-w-3xl` container move into `app/layout.tsx` and `Portfolio.tsx` is reduced to just the homepage's sections. The header's in-page anchors become `next/link` so they still work from a subpage, and `trailingSlash` is enabled so the exported nested route resolves on GitHub Pages.

**Tech Stack:** Next.js 16.1.1 (App Router, `output: "export"`), React 19, Tailwind v4, TypeScript. Deployed to GitHub Pages on push to `main`.

**Spec:** `docs/superpowers/specs/2026-08-13-portfolio-phase-2-design.md`

## Global Constraints

- **Work on a branch**, not `main`. Create `about-page` at Task 1 and stay on it. Do not push and do not merge — a human decides integration, and pushing `main` deploys to a live public website.
- **Plain document flow.** No `100vh`, `h-screen`, `overflow: hidden` wrappers, `position: sticky` tracks, or `translateX` anywhere in `app/`. (`body { overflow-x: hidden }` in `globals.css` is an allowed page-root guard, and `Header`'s `position: fixed` is pre-existing and stays.)
- Style only through the CSS custom properties: `var(--bg)`, `var(--card)`, `var(--border)`, `var(--fg)`, `var(--body)`, `var(--muted)`, `var(--accent)`. No hardcoded hex.
- **Heading hierarchy:** page `<h1>`, section `<h2>`, card `<h3>`. Do not skip levels — this was fixed in Phase 1 and must not regress.
- **Do not change** the Experience, Businesses, or Projects sections; the colour tokens; the typography; the card components; or `app/data/resume.ts`.
- **Do not make the Businesses card clickable** and do not add a `›` chevron anywhere. That was deliberately deferred; a link to a page that does not exist is the exact failure this plan avoids.
- No new dependencies.
- **This repo has NO test framework** — `package.json` defines only `dev`, `build`, `start`, `lint`. Do not add one. Verification is `npx eslint app`, `npx tsc --noEmit`, `npm run build`, greps against `out/`, and screenshots.
- **Do not run `npm run lint`** — it fails with ~11900 pre-existing problems from build artifacts under `.claude/worktrees/`. Use `npx eslint app`.
- **Never screenshot with `--window-size` below 500px.** Headless Chrome on this machine enforces a 500px minimum window width and crops the image to the requested size, making correct layouts look broken. This already caused one false bug report on this project. Use the iframe harness in Task 5.

## File structure

| File | Responsibility | Task |
|---|---|---|
| `next.config.ts` | adds `trailingSlash: true` | 1 |
| `app/layout.tsx` | Header + shared container + Footer around `{children}` | 1 |
| `app/components/Portfolio.tsx` | homepage sections only | 1 |
| `app/components/About.tsx` | **new** — the About page's markup and copy | 2 |
| `app/about/page.tsx` | **new** — route + page metadata | 2 |
| `app/components/Header.tsx` | `next/link` anchors + About item | 3 |
| `app/components/Hero.tsx` | headshot removed, bio widened | 4 |

---

### Task 1: Enable trailingSlash and move the shared chrome into the layout

**Files:**
- Modify: `next.config.ts`
- Modify: `app/layout.tsx`
- Modify: `app/components/Portfolio.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: every route now renders `Header`, a `max-w-3xl mx-auto px-5` container, `<main>`, and `Footer` automatically. Task 2's page component must therefore render **only** its own content — no header, no footer, no container, no `<main>`.

- [ ] **Step 1: Create the branch**

```bash
git checkout -b about-page
git status --short
```

Expected: on `about-page`. Pre-existing untracked `.claude/` and `app/fonts/Melodrama-SemiBold.woff2` will be listed — leave both alone.

- [ ] **Step 2: Add `trailingSlash` to `next.config.ts`**

Replace the file with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/My_Portfolio",
  assetPrefix: "/My_Portfolio",
  /* Emits nested routes as `about/index.html` rather than `about.html`, which
   * is what GitHub Pages resolves reliably. */
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 3: Move Header, the container, and Footer into `app/layout.tsx`**

In `app/layout.tsx`, add these two imports alongside the existing `SmoothScroll` import:

```tsx
import Header from "./components/Header";
import Footer from "./components/Footer";
```

Then replace the `<body>` contents. It currently reads:

```tsx
      <body className={`${satoshi.variable} antialiased`}>
        <SmoothScroll>
          <div className="grain" aria-hidden="true" />
          {children}
        </SmoothScroll>
      </body>
```

Replace with:

```tsx
      <body className={`${satoshi.variable} antialiased`}>
        <SmoothScroll>
          <div className="grain" aria-hidden="true" />
          {/* Header is fixed and full-width, and applies its own max-w-3xl to
              its inner bar — it must stay OUTSIDE the shared container or its
              background stops reaching the viewport edges. */}
          <Header />
          <div className="max-w-3xl mx-auto px-5">
            <main>{children}</main>
            {/* Outside <main> so it exposes a contentinfo landmark. */}
            <Footer />
          </div>
        </SmoothScroll>
      </body>
```

Do not change the `satoshi` font setup, the `metadata` export, or the `<html>` element.

- [ ] **Step 4: Reduce `app/components/Portfolio.tsx` to the homepage sections**

Replace the whole file with:

```tsx
import Hero from "./Hero";
import ExperienceSection from "./ExperienceSection";
import BusinessesSection from "./BusinessesSection";
import ProjectsSection from "./ProjectsSection";

export default function Portfolio() {
  return (
    <>
      <Hero />
      <ExperienceSection />
      <BusinessesSection />
      <ProjectsSection />
    </>
  );
}
```

The `Header`, `Footer`, `<main>`, and both container `<div>`s are gone — the layout owns them now. Leaving any of them here renders them twice.

- [ ] **Step 5: Verify the homepage is unchanged and chrome renders once**

**Two counting gotchas, both already handled below. Read before running.**

1. The exported HTML is minified onto essentially one line, so `grep -c`
   (which counts *lines*) returns `1` regardless of how many times a pattern
   occurs. A duplicated header would pass. Never use `grep -c` for counting here.
2. Next embeds an RSC hydration payload inside `<script>` tags that repeats
   **class strings and text content**. Counting those over the whole file
   roughly doubles them. Structural tags like `<header` are *not* affected —
   the payload encodes elements as JSON, not as literal tags.

So: tag counts are safe with `grep -o`, but class/text counts must be taken over
the rendered markup only. Define this helper once and reuse it in every task:

```bash
# Count occurrences of a literal string in the RENDERED MARKUP only,
# excluding Next's RSC hydration payload.
mcount() { python3 -c "
import re,sys
h=open(sys.argv[2],encoding='utf-8').read()
m=h.split('<body',1)[1].split('<script',1)[0]
print(len(re.findall(re.escape(sys.argv[1]), m)))
" "$1" "$2"; }
```

```bash
npx eslint app
npx tsc --noEmit
npm run build
ls out/index.html
mcount '<header' out/index.html
mcount '<footer' out/index.html
mcount '<main' out/index.html
mcount 'max-w-3xl mx-auto px-5' out/index.html
```

Expected: eslint and tsc clean; build succeeds; `out/index.html` exists; header, footer, and main each `1`. The container count is `2` — one for the header's inner bar, one for the shared container.

- [ ] **Step 6: Verify the export layout changed shape**

```bash
ls out/
```

Expected: `index.html` is still present at the top level. With `trailingSlash: true` the homepage stays `out/index.html`; only nested routes change shape, and there are none yet.

- [ ] **Step 7: Commit**

```bash
git add next.config.ts app/layout.tsx app/components/Portfolio.tsx
git commit -m "move header, footer, and content container into the layout

Enables trailingSlash so nested routes export as directories, and
hoists the shared chrome so a second page gets it for free.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Build the About page

**Files:**
- Create: `app/components/About.tsx`
- Create: `app/about/page.tsx`

**Interfaces:**
- Consumes: the layout from Task 1 — `Header`, `<main>`, the `max-w-3xl mx-auto px-5` container, and `Footer` are already provided. This component renders **only** its own content.
- Produces: the route `/about`. Task 3 adds the header link that points at it.

**Note on a transient state:** after this task the headshot appears on both the homepage hero and the About page. Task 4 removes it from the hero. That duplication is expected here and is not a defect to fix in this task.

- [ ] **Step 1: Create `app/components/About.tsx`**

The copy below is approved and must be used **verbatim** — it is the deliverable. Do not reword, condense, or "improve" it.

```tsx
import Image from "next/image";

export default function About() {
  return (
    <article className="pt-28 pb-16">
      <h1
        style={{ color: "var(--fg)" }}
        className="text-4xl sm:text-5xl font-bold tracking-tight leading-none"
      >
        About
      </h1>

      <Image
        src="/My_Portfolio/headShot.jpeg"
        alt="Krush Patel"
        width={160}
        height={200}
        className="rounded-xl object-cover mt-8"
        unoptimized
        priority
      />

      <div
        style={{ color: "var(--body)" }}
        className="mt-8 flex flex-col gap-4 text-sm leading-relaxed max-w-xl"
      >
        <p>
          I&rsquo;ve been running businesses since high school. Not helping out
          &mdash; scheduling, hiring, vendor calls, and fixing the POS when it
          goes down on a Saturday afternoon. There are three now: Big Creek
          Convenience, the corner store I grew up in; a Tropical Smoothie Cafe
          with about fifteen employees; and Signarama, a sign shop. Together
          they do $1.5M+ a year and employ more than twenty people.
        </p>
        <p>
          That&rsquo;s most of why I build software the way I do. I&rsquo;ve
          been the person stuck with the bad system &mdash; the spreadsheet four
          people edit at once, the process that only works because someone
          remembers it. So when I build something, I start with whoever has to
          use it.
        </p>
        <p>
          That&rsquo;s where both of my startups came from. For Aeigis, a
          firefighter safety tracker, I interviewed more than a dozen
          firefighters before writing any code and came away with letters of
          intent from two departments. For Parcel, I sat with insurance
          adjusters and watched how they actually put a claim packet together.
          Both made accelerator finals at Ohio State &mdash; Aeigis top 11 of
          60, Parcel top 6 of 50+ with $5,000 in funding.
        </p>
        <p>
          These days I&rsquo;m a full-stack developer at IGS Energy, working on
          the CRM their sales and service teams use every day &mdash; React and
          TypeScript on the front, ASP.NET Core and SQL Server behind it. Before
          that I co-oped at Emerson on an internal CRM serving 5,000+ employees.
          I graduate from Ohio State in May 2027 with a B.S. in Computer Science
          and Engineering.
        </p>
      </div>

      <h2
        style={{ color: "var(--fg)" }}
        className="text-2xl font-bold tracking-tight mt-14"
      >
        Outside of work
      </h2>

      <div
        style={{ color: "var(--body)" }}
        className="mt-6 flex flex-col gap-4 text-sm leading-relaxed max-w-xl"
      >
        <p>
          I don&rsquo;t sit still much. I lift regularly, ski in the winter, and
          I&rsquo;ll play just about anything &mdash; soccer, pickleball, or
          just go for a run. I&rsquo;m into cars, so a fair amount of my free
          time is spent driving somewhere, usually to one of the shops.
        </p>
        <p>I built my own PC and I game on it most nights.</p>
        <p>
          Right now I&rsquo;m working through Gen V. All-time it&rsquo;s Game of
          Thrones, then Avatar: The Last Airbender, then Peaky Blinders.
        </p>
      </div>
    </article>
  );
}
```

Two details that matter: `pt-28` clears the fixed header (the hero uses the same value), and `max-w-xl` keeps the prose at a readable measure rather than letting it run the full container width.

- [ ] **Step 2: Create `app/about/page.tsx`**

```tsx
import type { Metadata } from "next";
import About from "../components/About";

export const metadata: Metadata = {
  title: "About — Krush Patel",
  description:
    "Software developer and CSE student at Ohio State who has been running " +
    "three family businesses since 2019.",
};

export default function AboutPage() {
  return <About />;
}
```

This mirrors the existing `app/page.tsx` → `Portfolio` pattern: a thin route file that owns metadata, delegating markup to a component.

- [ ] **Step 3: Verify the route builds and exports as a directory**

```bash
npx eslint app
npx tsc --noEmit
npm run build
ls -la out/about/index.html
```

Expected: all clean, and `out/about/index.html` exists. If you instead find `out/about.html`, `trailingSlash` is not set — go back to Task 1 Step 2.

- [ ] **Step 4: Verify the page's content and chrome**

Use the `mcount` helper defined in Task 1 Step 5 — it counts within the rendered
markup only, excluding Next's RSC hydration payload, which otherwise inflates
every text match:

```bash
mcount() { python3 -c "
import re,sys
h=open(sys.argv[2],encoding='utf-8').read()
m=h.split('<body',1)[1].split('<script',1)[0]
print(len(re.findall(re.escape(sys.argv[1]), m)))
" "$1" "$2"; }

F=out/about/index.html
mcount 'running businesses since high school' $F
mcount 'Outside of work' $F
mcount 'Peaky Blinders' $F
mcount '<header' $F
mcount '<footer' $F
mcount '<h1' $F
mcount '<h2' $F
```

Expected: every value is `1`. Header and footer come from the layout, so `0`
means Task 1 regressed and `2` means About is rendering its own copy of the
chrome.

Note: apostrophes are written as `&rsquo;` in the source and Next may re-encode them, so grep for phrases without apostrophes — the phrases above are chosen for that reason.

- [ ] **Step 5: Verify it renders in the browser**

```bash
npm run dev
```

Open `http://localhost:3000/My_Portfolio/about` and confirm: the header and footer are present, the heading reads "About", the headshot renders, all four professional paragraphs and the three personal ones are there, and nothing is clipped. Stop the dev server when done.

- [ ] **Step 6: Commit**

```bash
git add app/components/About.tsx app/about/page.tsx
git commit -m "add the About page

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Header — About link and `next/link` section anchors

**Files:**
- Modify: `app/components/Header.tsx`

**Interfaces:**
- Consumes: the `/about` route from Task 2.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Convert the section anchors to `next/link` and add the About item**

In `app/components/Header.tsx`, add at the top:

```tsx
import Link from "next/link";
```

Then replace the `<nav>` block. It currently reads:

```tsx
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
```

Replace with:

```tsx
        <nav className="flex items-center gap-1 sm:gap-2">
          {SECTIONS.map((s) => (
            /* `/#hash` rather than `#hash`: from /about a bare hash resolves
               against the current page and does nothing. next/link also
               prepends basePath, which a hand-written <a> would not. */
            <Link
              key={s}
              href={`/#${s}`}
              style={{ color: "var(--body)" }}
              className="text-[11px] sm:text-sm px-1.5 sm:px-3 py-1.5 rounded-lg capitalize transition-colors hover:bg-[var(--card)] hover:text-[var(--fg)]"
            >
              {s}
            </Link>
          ))}
          <Link
            href="/about"
            style={{ color: "var(--body)" }}
            className="text-[11px] sm:text-sm px-1.5 sm:px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--card)] hover:text-[var(--fg)]"
          >
            About
          </Link>
        </nav>
```

The About link is a sibling after the map rather than a fourth entry in `SECTIONS`, because it is a route rather than an in-page hash. Like the section anchors it carries **no** `hidden` class — it stays visible at every width.

- [ ] **Step 2: Also convert the `kp` wordmark**

The wordmark currently links to `#top`, which does nothing from `/about`. Replace:

```tsx
        <a
          href="#top"
          style={{ color: "var(--fg)" }}
          className="font-bold tracking-tight text-sm shrink-0"
        >
          kp
        </a>
```

with:

```tsx
        <Link
          href="/#top"
          style={{ color: "var(--fg)" }}
          className="font-bold tracking-tight text-sm shrink-0"
        >
          kp
        </Link>
```

Leave the Resume link and the `SOCIALS` map as plain `<a>` elements — they point at a static asset and at external URLs respectively, neither of which `next/link` should handle.

- [ ] **Step 3: Verify the rendered hrefs carry the basePath**

```bash
npx eslint app
npx tsc --noEmit
npm run build
grep -o 'href="/My_Portfolio/#experience"' out/about/index.html
grep -o 'href="/My_Portfolio/#businesses"' out/about/index.html
grep -o 'href="/My_Portfolio/#projects"' out/about/index.html
grep -o 'href="/My_Portfolio/#top"' out/about/index.html
grep -o 'href="/My_Portfolio/about/"' out/index.html
```

Expected: each found. **This is the check that matters most in this task** — if any renders without the `/My_Portfolio` prefix it will 404 in production while working fine locally.

- [ ] **Step 4: Verify the About link is not hidden on mobile**

```bash
grep -o '<a[^>]*href="/My_Portfolio/about/"[^>]*>' out/index.html
```

Expected: the printed tag's `class` attribute does **not** contain `hidden`.

- [ ] **Step 5: Manual navigation check**

Run `npm run dev`, then from `http://localhost:3000/My_Portfolio/about`:
- click **Experience** — lands on the homepage scrolled to the Experience section
- click **kp** — lands on the homepage at the top
- from the homepage, click **About** — lands on `/about`

Stop the dev server when done.

- [ ] **Step 6: Commit**

```bash
git add app/components/Header.tsx
git commit -m "add About to the header, route section anchors through next/link

Bare #hash anchors do nothing from a subpage, and next/link is what
applies basePath to internal routes.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Move the headshot off the hero

**Files:**
- Modify: `app/components/Hero.tsx`

**Interfaces:**
- Consumes: the About page from Task 2, which is where the headshot now lives.
- Produces: nothing later tasks depend on. This is the last code task.

- [ ] **Step 1: Replace `app/components/Hero.tsx`**

The image and the flex wrapper that positioned it both go. The bio's cap widens from `max-w-md` to `max-w-xl`, because at `max-w-md` in a now-full-width column the text looks stranded.

```tsx
export default function Hero() {
  return (
    <section id="top" className="pt-28 pb-16">
      <h1
        style={{ color: "var(--fg)" }}
        className="text-4xl sm:text-5xl font-bold tracking-tight leading-none mb-3"
      >
        Krush Patel
      </h1>

      <p style={{ color: "var(--accent)" }} className="text-base font-bold mb-4">
        Software Developer &middot; CSE @ Ohio State
      </p>

      <p
        style={{ color: "var(--body)" }}
        className="text-sm leading-relaxed max-w-xl"
      >
        Senior CSE student at OSU building software and managing multiple
        businesses. Currently a full-stack software developer Intern at IGS
        Energy and previously co-oped at Emerson. On the side I help manage my
        family businesses and have co-founded two startup finalists at OSU
        accelerators.
      </p>
    </section>
  );
}
```

The `import Image from "next/image";` line is now unused and must be deleted — `npx eslint app` will fail if it is left behind.

- [ ] **Step 2: Verify the headshot appears exactly once across the site**

```bash
npx eslint app
npx tsc --noEmit
npm run build
mcount() { python3 -c "
import re,sys
h=open(sys.argv[2],encoding='utf-8').read()
m=h.split('<body',1)[1].split('<script',1)[0]
print(len(re.findall(re.escape(sys.argv[1]), m)))
" "$1" "$2"; }

echo -n "homepage headShot (want 0): "; mcount 'headShot' out/index.html
echo -n "about    headShot (want 1): "; mcount 'headShot' out/about/index.html
```

Expected: `0` and `1`. Anything above `0` on the homepage means the image was not removed; `0` on About means Task 2 regressed.

`mcount` matters here specifically: a raw grep over the whole file would find the
image path a second time inside Next's RSC payload and report `2` on About,
which looks like a duplicate render but isn't.

- [ ] **Step 3: Confirm the homepage h1 survived**

```bash
echo -n "homepage h1 (want 1): "; mcount '<h1' out/index.html
echo -n "name in markup:       "; mcount 'Krush Patel' out/index.html
```

Expected: exactly one `<h1>`, and the name present at least once. The hero's `<h1>` is the homepage's only one and the hierarchy must not regress.

- [ ] **Step 4: Commit**

```bash
git add app/components/Hero.tsx
git commit -m "move the headshot from the hero to the About page

The link-preview card already carries the face, so on the homepage the
photo was decoration. Bio widens to max-w-xl now that nothing sits
beside it.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Full verification

**Files:** none modified. This task only verifies.

**Interfaces:**
- Consumes: everything from Tasks 1–4.
- Produces: the screenshots and the report a human uses to decide whether to merge.

- [ ] **Step 1: Static sweep**

```bash
npx eslint app
npx tsc --noEmit
npm run build
echo "--- forbidden patterns ---"
grep -rn "100vh\|h-screen\|overflow-hidden\|overflow: *\"hidden\"\|position: *\"sticky\"\|translateX" app/components/ app/about/ || echo "CLEAN"
echo "--- routes ---"
ls out/index.html out/about/index.html
echo "--- chrome renders once per page ---"
mcount() { python3 -c "
import re,sys
h=open(sys.argv[2],encoding='utf-8').read()
m=h.split('<body',1)[1].split('<script',1)[0]
print(len(re.findall(re.escape(sys.argv[1]), m)))
" "$1" "$2"; }
for f in out/index.html out/about/index.html; do
  echo "$f  header=$(mcount '<header' $f) footer=$(mcount '<footer' $f) main=$(mcount '<main' $f)"
done
```

Expected: eslint and tsc clean, build succeeds, `CLEAN` printed, both routes exist, and every count is `1`.

Note `Header.tsx` contains `fixed top-0`, not `sticky`, so it is not matched by the grep and is not a violation.

- [ ] **Step 2: Confirm no dangling links**

```bash
grep -o 'href="/My_Portfolio/[^"#]*"' out/index.html | sort -u
```

Expected: every printed path corresponds to something that exists — `/My_Portfolio/about/`, `/My_Portfolio/Krush-Patel-Resume.pdf`, and nothing else route-like. In particular there must be **no** `/My_Portfolio/businesses/` link: that page was deliberately not built in this plan.

- [ ] **Step 3: Screenshots at three widths**

`--window-size` below 500px silently lies on this machine (500px floor, then crops), so 375 goes through an iframe harness.

```bash
npm run build
rm -rf /tmp/ab && mkdir -p /tmp/ab && cp -R out /tmp/ab/My_Portfolio
cat > /tmp/ab/home375.html <<'HTML'
<body style="margin:0;background:#444"><iframe src="/My_Portfolio/" style="width:375px;height:5200px;border:0;display:block"></iframe></body>
HTML
cat > /tmp/ab/about375.html <<'HTML'
<body style="margin:0;background:#444"><iframe src="/My_Portfolio/about/" style="width:375px;height:2400px;border:0;display:block"></iframe></body>
HTML
(python3 -m http.server 8940 --directory /tmp/ab > /dev/null 2>&1 &) ; sleep 2
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=420,5200 --virtual-time-budget=10000 --screenshot=/tmp/ab_home375.png "http://localhost:8940/home375.html"
"$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=420,2400 --virtual-time-budget=10000 --screenshot=/tmp/ab_about375.png "http://localhost:8940/about375.html"
"$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,2400 --virtual-time-budget=10000 --screenshot=/tmp/ab_about1200.png "http://localhost:8940/My_Portfolio/about/"
pkill -f "http.server 8940"
```

**Open all three PNGs and look at them.** In the 375px shots judge only the left 375px — the grey surround is the harness.

Confirm:
1. `ab_home375.png` — the hero is text-only (no photo), the bio is not stranded, and the header shows `kp · Experience · Businesses · Projects · About · Resume` with nothing cut off.
2. `ab_about375.png` — heading, headshot, all seven paragraphs, the "Outside of work" heading, and the footer all present and unclipped.
3. `ab_about1200.png` — prose is constrained to a readable measure rather than running the full container width.

- [ ] **Step 4: Report, do not push**

```bash
git log --oneline main..about-page
git status --short
```

Leave the branch local. **Do not push and do not merge** — pushing `main` deploys to the live site, and a human reviews the screenshots first.

---

## Notes for the implementer

- `/businesses`, the clickable Businesses card, and the `›` chevron are deliberately **not** in this plan. Their copy is drafted in the spec's "Deferred" section for a later phase. Do not build them.
- PC specs were postponed. The line "I built my own PC and I game on it most nights." ships as written — no parts list, no placeholder.
- If a step's expected output does not match, stop and report rather than adjusting the verification until it passes.
