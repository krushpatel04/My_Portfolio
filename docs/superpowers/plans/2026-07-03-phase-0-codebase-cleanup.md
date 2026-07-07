# Phase 0 — Codebase Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Leave `my-portfolio` in a pristine, boring, maintainable state — no dead code, no duplicated styling patterns, no loose types, no lint warnings, no oversized assets, and the native OS cursor restored — before any Phase 1 design work starts.

**Architecture:** This is a small single-page Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 static site (`output: "export"`, deployed to GitHub Pages under basePath `/My_Portfolio`). There is no test suite. Every task's "done" signal is: `npm run lint` clean, `npx tsc --noEmit` clean, `npm run build` succeeds, and (for the two UI-visible tasks) a manual check in the browser dev server.

**Tech Stack:** Next.js 16, React 19, TypeScript 5 (strict), Tailwind CSS 4, Framer Motion, Lenis (smooth scroll), ESLint 9 (`eslint-config-next`).

## Global Constraints

- Do not change `next.config.ts` (`output: "export"`, `basePath`/`assetPrefix: "/My_Portfolio"`, `images.unoptimized: true`) — required for the existing GitHub Pages deploy workflow at `.github/workflows/deploy.yml`.
- No new dependencies. Only remove the one confirmed-unused one (`motion`).
- No visual/behavioral change to the shipped site except the two explicitly agreed changes: (1) remove the custom cursor and restore the native cursor, (2) remove the dead `#skills` nav link and the unused `skills` data export (user decision: "Remove for now" — a real Skills section is Phase 1 scope, not Phase 0).
- Commit style in this repo is short, lowercase, casual (see `git log --oneline`) — match it. One commit per task.
- Current branch is `scroll-redesign`, working tree clean as of plan creation — do not force-push, rebase, or touch git history.

---

### Task 1: Remove the custom cursor entirely

**Files:**
- Delete: `app/components/CustomCursor.tsx`
- Modify: `app/layout.tsx:5,38`
- Modify: `app/globals.css:40-43`

**Interfaces:** None — this is a pure removal, no other task depends on `CustomCursor`.

- [ ] **Step 1: Remove the CustomCursor import and usage from the layout**

In `app/layout.tsx`, remove line 5 (`import CustomCursor from "./components/CustomCursor";`) and remove the `<CustomCursor />` line inside `<SmoothScroll>`:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SmoothScroll>
          <div className="grain" aria-hidden="true" />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Delete the component file**

```bash
rm app/components/CustomCursor.tsx
```

- [ ] **Step 3: Remove the cursor-hiding CSS rule**

In `app/globals.css`, delete this block (currently lines 40-43):

```css
/* Hide default cursor on pointer devices when custom cursor is active */
@media (pointer: fine) {
  * { cursor: none !important; }
}
```

- [ ] **Step 4: Verify no references remain and the app still builds**

```bash
grep -rn "CustomCursor" app || echo "clean"
npm run lint
npm run build
```

Expected: `grep` prints only `clean`; lint has no `CustomCursor.tsx` entries; build succeeds.

- [ ] **Step 5: Manual browser check**

Run `npm run dev`, open the page, confirm the cursor is the normal OS arrow/pointer everywhere (nav links, project links, theme toggle) and no stray dot follows the mouse.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/globals.css
git rm app/components/CustomCursor.tsx
git commit -m "remove custom cursor, restore native OS cursor"
```

---

### Task 2: Remove dead code, unused assets, and the unused `motion` dependency

**Files:**
- Modify: `app/components/Portfolio.tsx:375` (nav links array)
- Modify: `app/data/resume.ts:91-95` (drop `skills` export)
- Delete: `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`
- Modify: `package.json` (drop `motion` dependency)

**Interfaces:** None — `skills` and the deleted SVGs are confirmed unreferenced anywhere in `app/` or `public/` usage (`grep` already run in audit; re-verified in Step 4 below).

- [ ] **Step 1: Remove the dead `#skills` nav link**

In `app/components/Portfolio.tsx`, change:

```tsx
{["experience", "projects", "skills"].map((s) => (
```

to:

```tsx
{["experience", "projects"].map((s) => (
```

- [ ] **Step 2: Remove the unused `skills` export**

In `app/data/resume.ts`, delete the trailing block (currently lines 91-95):

```ts
export const skills: Record<string, string[]> = {
  Languages: ["C#", "Java", "C", "JavaScript", "TypeScript", "Python", "SQL", "T-SQL", "HTML/CSS"],
  "Frameworks & Libraries": ["Node.js", "Vue.js", ".NET", "Next.js", "MonoGame", "JUnit", "Make", "GDB"],
  "Dev Tools": ["Git/GitHub", "Linux/WSL", "Visual Studio", "VS Code", "SSMS", "Jira", "Azure"],
};
```

- [ ] **Step 3: Delete the unused boilerplate SVGs**

These are leftover `create-next-app` defaults, never referenced anywhere:

```bash
git rm public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
```

- [ ] **Step 4: Remove the unused `motion` package**

`package.json` lists both `framer-motion` and `motion` as dependencies, but only `framer-motion` is ever imported (confirmed via `grep -rn "from \"motion\|from \"framer-motion\"" app`). Remove `motion`:

```bash
npm uninstall motion
```

This updates both `package.json` and `package-lock.json`.

- [ ] **Step 5: Verify nothing references the removed items**

```bash
grep -rn "skills" app/components/Portfolio.tsx app/data/resume.ts || echo "clean"
grep -rn "from \"motion\"" app || echo "clean"
ls public
```

Expected: both greps print only `clean`; `public` now contains only `favicon.ico` and `headShot.jpeg` (plus nothing else you didn't delete).

- [ ] **Step 6: Confirm build and lint still pass**

```bash
npm run lint
npm run build
```

- [ ] **Step 7: Commit**

```bash
git add app/components/Portfolio.tsx app/data/resume.ts package.json package-lock.json
git rm public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
git commit -m "remove dead skills link/data, unused SVGs, and unused motion dep"
```

---

### Task 3: Fix the unused `total` prop lint warning

**Files:**
- Modify: `app/components/Portfolio.tsx:33-41,183`

**Interfaces:**
- Consumes: nothing new.
- Produces: `ExperienceCard` now takes only `{ job: Job; index: number }` (see Task 4, which introduces the `Job` type — do this task first if executing out of order, since Task 4 also touches this same function signature).

`npm run lint` currently reports: `'total' is defined but never used` at `Portfolio.tsx:36`.

- [ ] **Step 1: Remove the unused `total` param from `ExperienceCard`**

Change:

```tsx
function ExperienceCard({
  job,
  index,
  total,
}: {
  job: (typeof experience)[0];
  index: number;
  total: number;
}) {
```

to:

```tsx
function ExperienceCard({
  job,
  index,
}: {
  job: (typeof experience)[0];
  index: number;
}) {
```

(The `job: (typeof experience)[0]` type here is replaced with `job: Job` in Task 4 — if doing both tasks, land Task 4's type change on top of this signature.)

- [ ] **Step 2: Remove the `total={N}` prop at the call site**

In `HorizontalTimeline`, change:

```tsx
{experience.map((job, i) => (
  <ExperienceCard key={i} job={job} index={i} total={N} />
))}
```

to:

```tsx
{experience.map((job, i) => (
  <ExperienceCard key={i} job={job} index={i} />
))}
```

- [ ] **Step 3: Verify the lint warning is gone**

```bash
npm run lint
```

Expected: no `'total' is defined but never used` warning.

- [ ] **Step 4: Commit**

```bash
git add app/components/Portfolio.tsx
git commit -m "drop unused total prop from ExperienceCard"
```

---

### Task 4: Add explicit `Job`/`Project` types and remove the type-cast hack

**Files:**
- Modify: `app/data/resume.ts` (add interfaces, type the two arrays)
- Modify: `app/components/Portfolio.tsx:33-41,304-317` (use `Job` type, drop the cast)

**Interfaces:**
- Produces: `Job` and `Project` interfaces exported from `app/data/resume.ts`, used by `app/components/Portfolio.tsx`.

Today `projects` is an inferred union of two differently-shaped object literals (one has `youtube`, the other doesn't), which forces this cast in `ProjectsSection`:

```tsx
{"youtube" in proj && (proj as { youtube: string }).youtube && (
```

Giving both arrays real interfaces removes the cast and satisfies `tsconfig.json`'s `strict: true` cleanly instead of working around it.

- [ ] **Step 1: Add interfaces and type the arrays in `app/data/resume.ts`**

At the top of the file, before `export const experience = [`, add:

```ts
export interface Job {
  company: string;
  role: string;
  period: string;
  location: string;
  tech: string[];
  bullets: string[];
}
```

Change `export const experience = [` to `export const experience: Job[] = [`.

Before `export const projects = [`, add:

```ts
export interface Project {
  name: string;
  tech: string[];
  date: string;
  description: string;
  link?: string | null;
  youtube?: string;
}
```

Change `export const projects = [` to `export const projects: Project[] = [`.

Leave the `skills` export removal from Task 2 as-is (don't reintroduce it).

While in this file, also fix the broken indentation on the first `experience` entry (inconsistent with every other entry in the array — 3-space brace, 2-space first property instead of the 2-space/4-space pattern used everywhere else):

```ts
   {
  company: "IGS Energy",
    role: "Software Developer (Intern)",
```

to:

```ts
  {
    company: "IGS Energy",
    role: "Software Developer (Intern)",
```

- [ ] **Step 2: Use `Job` in `ExperienceCard` and import it**

In `app/components/Portfolio.tsx`, add `Job` to the existing import:

```tsx
import { experience, projects, Job } from "../data/resume";
```

Change the `ExperienceCard` prop type (as left by Task 3) from:

```tsx
function ExperienceCard({
  job,
  index,
}: {
  job: (typeof experience)[0];
  index: number;
}) {
```

to:

```tsx
function ExperienceCard({
  job,
  index,
}: {
  job: Job;
  index: number;
}) {
```

- [ ] **Step 3: Remove the cast in `ProjectsSection`**

Change:

```tsx
{"youtube" in proj && (proj as { youtube: string }).youtube && (
  <a
    href={(proj as { youtube: string }).youtube}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: "var(--accent)",
      borderColor: "var(--border)",
    }}
    className="text-sm border px-4 py-1.5 rounded-lg transition-opacity hover:opacity-70"
  >
    Demo ↗
  </a>
)}
```

to:

```tsx
{proj.youtube && (
  <a
    href={proj.youtube}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: "var(--accent)",
      borderColor: "var(--border)",
    }}
    className="text-sm border px-4 py-1.5 rounded-lg transition-opacity hover:opacity-70"
  >
    Demo ↗
  </a>
)}
```

(This block gets replaced again by Task 5's `PillLink` extraction — land Task 5 after this one.)

- [ ] **Step 4: Type-check and build**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Expected: no type errors, no lint warnings, build succeeds.

- [ ] **Step 5: Commit**

```bash
git add app/data/resume.ts app/components/Portfolio.tsx
git commit -m "add explicit Job/Project types, drop youtube cast"
```

---

### Task 5: Extract the duplicated "pill link" pattern into a shared component

**Files:**
- Create: `app/components/PillLink.tsx`
- Modify: `app/components/Portfolio.tsx` (5 call sites: LinkedIn, GitHub, email in the hero; GitHub, Demo in `ProjectsSection`)

**Interfaces:**
- Produces: `PillLink({ href, external?, children }): JSX.Element`, default export from `app/components/PillLink.tsx`. `external` defaults to `true` (adds `target="_blank" rel="noopener noreferrer"`); pass `external={false}` for the `mailto:` link, which shouldn't open in a new tab context.

The same visual pattern — `border px-4 py-1.5 rounded-lg transition-opacity hover:opacity-70` with `color: var(--accent)` / `borderColor: var(--border)` — is hand-written 5 times across the hero's LinkedIn/GitHub/email links and `ProjectsSection`'s GitHub/Demo links. Consolidate into one component.

- [ ] **Step 1: Create `app/components/PillLink.tsx`**

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
      className="text-sm border px-4 py-1.5 rounded-lg transition-opacity hover:opacity-70"
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 2: Import it in `Portfolio.tsx`**

```tsx
import PillLink from "./PillLink";
```

- [ ] **Step 3: Replace the 3 hero links**

Change:

```tsx
<div className="flex flex-wrap gap-3 text-sm">
  <a
    href="https://www.linkedin.com/in/krush-patel-54324a2a5"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: "var(--accent)",
      borderColor: "var(--border)",
    }}
    className="border px-4 py-1.5 rounded-lg transition-opacity hover:opacity-70"
  >
    LinkedIn ↗
  </a>
  <a
    href="https://github.com/krushpatel04"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: "var(--accent)",
      borderColor: "var(--border)",
    }}
    className="border px-4 py-1.5 rounded-lg transition-opacity hover:opacity-70"
  >
    GitHub ↗
  </a>
  <a
    href="mailto:patel.5355@osu.edu"
    style={{
      color: "var(--accent)",
      borderColor: "var(--border)",
    }}
    className="border px-4 py-1.5 rounded-lg transition-opacity hover:opacity-70"
  >
    patel.5355@osu.edu
  </a>
</div>
```

to:

```tsx
<div className="flex flex-wrap gap-3">
  <PillLink href="https://www.linkedin.com/in/krush-patel-54324a2a5">
    LinkedIn ↗
  </PillLink>
  <PillLink href="https://github.com/krushpatel04">GitHub ↗</PillLink>
  <PillLink href="mailto:patel.5355@osu.edu" external={false}>
    patel.5355@osu.edu
  </PillLink>
</div>
```

- [ ] **Step 4: Replace the 2 `ProjectsSection` links**

Change:

```tsx
<div className="flex flex-wrap gap-3">
  {proj.link && (
    <a
      href={proj.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "var(--accent)",
        borderColor: "var(--border)",
      }}
      className="text-sm border px-4 py-1.5 rounded-lg transition-opacity hover:opacity-70"
    >
      GitHub ↗
    </a>
  )}
  {proj.youtube && (
    <a
      href={proj.youtube}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "var(--accent)",
        borderColor: "var(--border)",
      }}
      className="text-sm border px-4 py-1.5 rounded-lg transition-opacity hover:opacity-70"
    >
      Demo ↗
    </a>
  )}
</div>
```

to:

```tsx
<div className="flex flex-wrap gap-3">
  {proj.link && <PillLink href={proj.link}>GitHub ↗</PillLink>}
  {proj.youtube && <PillLink href={proj.youtube}>Demo ↗</PillLink>}
</div>
```

- [ ] **Step 5: Verify and build**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

- [ ] **Step 6: Manual browser check**

Run `npm run dev`. Confirm all 5 links still render identically (pill border, gold accent color, hover opacity fade) and still open in the right place: LinkedIn/GitHub/project links in a new tab, the email link launches the mail client without a stray blank tab.

- [ ] **Step 7: Commit**

```bash
git add app/components/PillLink.tsx app/components/Portfolio.tsx
git commit -m "extract duplicated pill-link markup into PillLink component"
```

---

### Task 6: Fix the `ThemeToggle` lint error

**Files:**
- Modify: `app/components/ThemeToggle.tsx:8-10`

**Interfaces:** None — behavior is unchanged, only the lint suppression is added with justification.

`npm run lint` currently reports a real error here:

```
error  Error: Calling setState synchronously within an effect can trigger cascading renders
```

This one is a deliberate, correct pattern, not a bug: `app/layout.tsx`'s inline `<script>` sets `data-theme` on `<html>` before hydration to prevent a flash of the wrong theme. `ThemeToggle` reads that DOM attribute after mount specifically so its `dark` state reflects the same theme the anti-flash script already applied — the whole point is that this read happens post-hydration, so a blanket "don't setState in an effect" rule doesn't apply here. Silence it locally with an explanatory comment rather than restructuring working, correct code.

- [ ] **Step 1: Add a scoped, explained lint disable**

Change:

```tsx
useEffect(() => {
  setDark(document.documentElement.getAttribute("data-theme") !== "light");
}, []);
```

to:

```tsx
useEffect(() => {
  // The inline script in layout.tsx sets data-theme on <html> pre-hydration
  // to avoid a flash of the wrong theme. Reading it here, post-mount, is
  // intentional — it syncs this component's state with that already-applied
  // theme rather than duplicating the anti-flash logic.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setDark(document.documentElement.getAttribute("data-theme") !== "light");
}, []);
```

- [ ] **Step 2: Verify the lint error is gone**

```bash
npm run lint
```

Expected: 0 errors, 0 warnings.

- [ ] **Step 3: Manual browser check**

Run `npm run dev`. Toggle the theme button a few times; confirm it still switches between sun/moon icons and light/dark theme correctly, and reload the page in both themes to confirm no flash of the wrong theme on load.

- [ ] **Step 4: Commit**

```bash
git add app/components/ThemeToggle.tsx
git commit -m "silence justified set-state-in-effect lint error in ThemeToggle"
```

---

### Task 7: Downscale the oversized hero headshot

**Files:**
- Modify (binary): `public/headShot.jpeg`

**Interfaces:** None — same file path, same usage in `Portfolio.tsx:439`.

`public/headShot.jpeg` is a native 725×1086 camera-resolution JPEG (~228 KB), but it's only ever displayed at `width={160} height={200}` (`app/components/Portfolio.tsx:441-442`) with `unoptimized` set on the `<Image>` (required because `images.unoptimized: true` for static export) — meaning Next.js does **not** resize it, the full 228 KB ships as-is. Downscale it to roughly 2x the display size (enough for retina, no more) and recompress.

- [ ] **Step 1: Resize and recompress in place using `sips` (built into macOS)**

```bash
cd /Users/krushpatel/code/my-portfolio
sips -Z 480 -s formatOptions 80 public/headShot.jpeg
```

`-Z 480` scales the image so its longest side is 480px (roughly 2x the 200px display height, enough headroom for retina without shipping full camera resolution). `-s formatOptions 80` sets JPEG quality to 80.

- [ ] **Step 2: Verify the new size**

```bash
ls -la public/headShot.jpeg
file public/headShot.jpeg
```

Expected: file size dropped substantially from ~228 KB (aim for well under 50 KB), dimensions roughly 320×480.

- [ ] **Step 3: Manual browser check**

Run `npm run dev`, load the page, let the hero reveal animation play, and confirm the headshot still looks sharp at its displayed 160×200 size with no visible compression artifacts.

- [ ] **Step 4: Commit**

```bash
git add public/headShot.jpeg
git commit -m "downscale oversized hero headshot for its actual display size"
```

---

### Task 8: Final full-repo verification

**Files:** None modified — this is a verification-only pass across everything done in Tasks 1-7.

- [ ] **Step 1: Full lint pass**

```bash
npm run lint
```

Expected: 0 errors, 0 warnings.

- [ ] **Step 2: Full type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Full static-export build (mirrors the GitHub Pages deploy workflow)**

```bash
npm run build
```

Expected: build succeeds, `out/` is regenerated with no errors.

- [ ] **Step 4: Confirm no leftover references to anything removed**

```bash
grep -rln "CustomCursor\|from \"motion\"\|skills" app || echo "clean"
```

Expected: `clean` (the string `skills` should no longer appear as an identifier; if this greps a false positive like a comment, inspect it manually rather than assuming failure).

- [ ] **Step 5: Full manual browser walkthrough**

Run `npm run dev`, open in the browser, and check:
- Native cursor everywhere, no custom dot.
- Nav bar shows only "experience" and "projects" (no "skills"), both scroll-links still work.
- Theme toggle switches correctly, no flash on reload in either theme.
- All 5 pill links (LinkedIn, GitHub, email, project GitHub, project demo) render and behave correctly.
- Headshot displays sharp, no artifacts.
- Horizontal experience timeline and scroll-driven hero animation behave exactly as before (no regression from the type/prop changes in Tasks 3-4).

- [ ] **Step 6: Confirm working tree is clean**

```bash
git status
```

Expected: `nothing to commit, working tree clean` — every task committed in Tasks 1-7.
