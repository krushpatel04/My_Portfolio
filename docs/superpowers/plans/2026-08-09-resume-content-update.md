# Resume Content Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sync the site's resume content to Krush's 8/6/26 resume PDF, ship that PDF as a download, and link it from the nav.

**Architecture:** Content-only change against the existing design on `main`. Three job entries in a single data file are edited, one static asset is added to `public/`, and one link is added to the existing `<nav>`. No new components, no new dependencies, no theme or layout changes.

**Tech Stack:** Next.js 16.1.1 (App Router, static export via `output: "export"`), React 19, TypeScript, Tailwind v4, framer-motion. Deployed to GitHub Pages by `.github/workflows` on push to `main`.

**Spec:** `docs/superpowers/specs/2026-08-09-resume-content-update-design.md`

## Global Constraints

- Work directly on `main`. Do **not** create a feature branch — this is a small content change and the repo's spec/plan docs are already committed straight to `main`.
- Do **not** touch the `cosmic-redesign` branch or its worktree at `.claude/worktrees/cosmic-redesign`. It is parked.
- Do **not** change the theme, palette, typography, layout, or animations.
- Do **not** add an Education section or a Skills section.
- Do **not** modify the Projects section, the Emerson entries, the Aeigis entry, or the hero bio copy.
- **This project has no test framework.** `package.json` defines only `dev`, `build`, `start`, and `lint`. Do not add Jest, Vitest, or Playwright — that is out of scope. Verification is `npm run build`, `npm run lint`, and grep against the generated `out/` directory.
- `next.config.ts` sets `basePath: "/My_Portfolio"` unconditionally. Static asset URLs in markup must be written with that prefix explicitly, e.g. `/My_Portfolio/headShot.jpeg`. This applies in local dev too.
- Bullet strings in `app/data/resume.ts` must be copied **verbatim** from this plan. They are transcribed from the resume PDF and must match it exactly — including `5,100+`, `$5,000`, `React 18/TypeScript`, and `ASP.NET Core 10`.
- Period strings use an en dash (`–`, U+2013), not a hyphen. Match the surrounding entries.

---

### Task 1: Sync the three changed job entries in `app/data/resume.ts`

**Files:**
- Modify: `app/data/resume.ts` (IGS Energy entry at lines 11–21; Parcel bullets at lines 50–54; Patel Family Enterprises at lines 69–71)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: no new exports. The existing `experience: Job[]` export and the `Job` interface (`company`, `role`, `period`, `location`, `tech: string[]`, `bullets: string[]`) are unchanged in shape. Later tasks do not depend on this task.

- [ ] **Step 1: Replace the IGS Energy entry**

Find this block (it is the first entry in the `experience` array):

```ts
  {
    company: "IGS Energy",
    role: "Software Developer (Intern)",
    period: "May 2026 – Present",
    location: "Dublin, OH",
    tech: ["C#", ".NET", "Vue.js", "SQL Server", "Azure"],
    bullets: [
      "Contributed to Choice 360, IGS Energy's core CRM platform used by hundreds of sales reps and customer service agents, resolving production bugs and investigating HubSpot data flows to support an active acquisition with Scana Energy.",
      "Validated a local Playwright E2E testing framework enabling developers to target local, INT, or QA environments with selective test runs, and documented the full setup in Confluence for team-wide adoption.",
    ],
  },
```

Replace it with:

```ts
  {
    company: "IGS Energy",
    role: "Software Developer (Intern)",
    period: "May 2026 – Present",
    location: "Dublin, OH",
    tech: [
      "C#",
      ".NET",
      "React",
      "TypeScript",
      "Python/FastAPI",
      "SSMS",
      "Azure DevOps",
      "Playwright",
      "Octopus",
      "HubSpot",
    ],
    bullets: [
      "Delivered full-stack features for Choice 360, IGS Energy's core customer CRM, spanning a React 18/TypeScript frontend, ASP.NET Core 10 backend, and SQL Server migration repo with coordinated branching and deploy ordering.",
      "Built a contract parser at a company hackathon after learning from a director that signed contracts were never recorded, extracting fields into a database that can be cross checked against upstream systems, then pitched it to leadership.",
      "Built interactive dashboards from Jira and Octopus Deploy history that gave the team visibility into its own support load and release cadence, surfacing where ticket volume was avoidable and how much of the release cycle was unplanned.",
      "Removed 5,100+ lines of dead legacy code across two systems, an abandoned HubSpot contact-sync subsystem and a retired feature-flag path, sequencing flag deletion across two application deployments so legacy paths couldn't reactivate.",
    ],
  },
```

Both old bullets are gone, replaced by four new ones. `company`, `role`, `period`, and `location` are unchanged.

- [ ] **Step 2: Replace the Parcel bullets**

Find this block (inside the `Parcel` entry):

```ts
    bullets: [
      "Finalist (top 6 of 50+ teams) and $5,000 funding recipient in OSU's Best of Student Startups accelerator.",
      "Built a web-based workflow application enabling insurance adjusters to centralize documentation, auto-generate templates, and share complete claim packets in one click.",
      "Led customer discovery with insurance adjusters to validate workflow inefficiencies and define product requirements.",
    ],
```

Replace it with:

```ts
    bullets: [
      "Placed top 6 of 50+ teams and secured $5,000 in funding through OSU's Best of Student Startups accelerator.",
      "Built a web-based workflow application enabling adjusters to centralize documentation, auto-generate templates, and share complete claim packets in one click, improving speed, reducing reporting errors, and streamlining field workflows.",
      "Led customer discovery with insurance adjusters to validate workflow inefficiencies and define product requirements.",
    ],
```

Three changes: bullet 1 is rephrased; bullet 2 drops the word "insurance" before "adjusters" and gains the "improving speed, reducing reporting errors, and streamlining field workflows" ending; bullet 3 is untouched. Parcel's `tech`, `role`, `period`, and `location` are untouched.

- [ ] **Step 3: Update the Patel Family Enterprises role and period**

Find:

```ts
    company: "Patel Family Enterprises",
    role: "Manager",
    period: "Jan 2019 – Dec 2025",
```

Replace with:

```ts
    company: "Patel Family Enterprises",
    role: "Owner/Operations Manager",
    period: "Jan 2019 – Present",
```

Its `location`, `tech`, and `bullets` are untouched. It is expected and correct that two entries now read "– Present" (IGS Energy and this one). Do not reorder the array.

- [ ] **Step 4: Verify the file type-checks and the site builds**

Run:

```bash
npm run lint && npm run build
```

Expected: lint reports no errors, and the build ends with a route table listing `/` and `/_not-found` as static. If TypeScript complains, the most likely cause is a missing comma or an unescaped apostrophe — note that these strings are double-quoted and contain apostrophes (`IGS Energy's`, `OSU's`, `couldn't`, `its own`), which is valid TypeScript and needs no escaping.

- [ ] **Step 5: Confirm the new content actually rendered into the export**

Run:

```bash
grep -c "5,100+ lines of dead legacy code" out/index.html
grep -c "Owner/Operations Manager" out/index.html
grep -c "Placed top 6 of 50+ teams" out/index.html
grep -c "Playwright E2E testing framework" out/index.html
```

Expected: `1`, `1`, `1`, and `0`. The last one is the removed IGS bullet — a non-zero count there means the old content is still being rendered.

- [ ] **Step 6: Manual browser check**

Run `npm run dev` and open `http://localhost:3000/My_Portfolio`. Scroll to Experience and confirm:
- The IGS Energy card shows four bullets and tech tags including React, Python/FastAPI, Octopus, and HubSpot — and no longer shows Vue.js.
- The Patel Family Enterprises card reads "Owner/Operations Manager" and "Jan 2019 – Present".
- The Parcel card's second bullet ends with "streamlining field workflows."
- Emerson, Aeigis, and the Projects section look exactly as before.

Stop the dev server when done.

- [ ] **Step 7: Commit**

```bash
git add app/data/resume.ts
git commit -m "sync resume content to 8/6/26 resume

IGS Energy gets four new bullets and corrected tech tags (React, not
Vue.js). Patel Family Enterprises becomes Owner/Operations Manager and
is ongoing. Parcel bullets 1 and 2 rephrased.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Ship the resume PDF as a downloadable static asset

**Files:**
- Create: `public/Krush-Patel-Resume.pdf` (copied from `~/Downloads/8_6_26.pdf`)

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: the asset URL `/My_Portfolio/Krush-Patel-Resume.pdf`, which Task 3 links to. That exact string is what Task 3 must use.

- [ ] **Step 1: Copy the PDF into `public/` under its shipping name**

```bash
cp ~/Downloads/8_6_26.pdf public/Krush-Patel-Resume.pdf
```

The rename is deliberate — `8_6_26.pdf` reads as a scratch file, and the filename is what lands on a recruiter's disk when they download it.

- [ ] **Step 2: Verify the copy is intact**

```bash
ls -la public/Krush-Patel-Resume.pdf
file public/Krush-Patel-Resume.pdf
```

Expected: roughly 109 KB (109288 bytes), and `file` reports `PDF document`. A size near zero or a `file` result other than PDF means the copy failed.

- [ ] **Step 3: Confirm it lands in the static export**

```bash
npm run build && ls -la out/Krush-Patel-Resume.pdf
```

Expected: the file exists in `out/` at the same size. Next copies `public/` into `out/` verbatim during export; if it is missing here, it will 404 in production.

- [ ] **Step 4: Confirm it is served in dev at the basePath'd URL**

Start the dev server (`npm run dev`), then in a second shell:

```bash
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" \
  http://localhost:3000/My_Portfolio/Krush-Patel-Resume.pdf
```

Expected: `200 application/pdf`. A `404` means the file is not in `public/` or the basePath prefix is wrong. Stop the dev server when done.

- [ ] **Step 5: Commit**

```bash
git add public/Krush-Patel-Resume.pdf
git commit -m "add downloadable resume PDF

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Add the Resume link to the nav

**Files:**
- Modify: `app/components/Portfolio.tsx` (the `<nav>` block at lines 333–363; specifically the `<div className="flex items-center gap-1">` at line 349)

**Interfaces:**
- Consumes: the asset URL `/My_Portfolio/Krush-Patel-Resume.pdf` produced by Task 2. Task 2 must be complete first, or the link will 404.
- Produces: nothing other tasks depend on. This is the last task.

**Why this isn't a one-line change:** the existing Experience/Projects links are generated by mapping over `["experience", "projects"]` and share a single `href={`#${s}`}` shape. The Resume link needs a different `href`, a `target`, and different visibility rules, so it is added as a sibling after the map rather than as a third array entry.

- [ ] **Step 1: Add the link element**

Find this block in `app/components/Portfolio.tsx`:

```tsx
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
```

Replace it with:

```tsx
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
            <a
              href="/My_Portfolio/Krush-Patel-Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)" }}
              className="text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--card)]"
            >
              Resume
            </a>
            <ThemeToggle />
          </div>
```

Three deliberate differences from the mapped links:

1. **No `hidden sm:block`.** The mapped anchors do not render on mobile at all. The Resume link must stay visible at every breakpoint — downloading the resume is the highest-value action on the page, and a large share of traffic from a link in a bio is on a phone.
2. **`var(--accent)` instead of `var(--muted)`.** It is the one action among navigation anchors, so it gets more weight.
3. **`target="_blank"` with `rel="noopener noreferrer"`.** It is an external document, not an in-page anchor. `rel` is required whenever `target="_blank"` is used.

- [ ] **Step 2: Verify lint and build**

```bash
npm run lint && npm run build
```

Expected: no lint errors, build succeeds.

- [ ] **Step 3: Confirm the link is in the exported HTML with the right href**

```bash
grep -o 'href="/My_Portfolio/Krush-Patel-Resume.pdf"' out/index.html
grep -o 'rel="noopener noreferrer"' out/index.html | head -1
```

Expected: the first prints the href once. The second prints `rel="noopener noreferrer"`. If the href renders without the `/My_Portfolio` prefix, the link will 404 on GitHub Pages.

- [ ] **Step 4: Manual browser check, including mobile width**

Run `npm run dev` and open `http://localhost:3000/My_Portfolio`.
- Confirm "Resume" appears in the nav in the accent color, and clicking it opens the PDF in a new tab showing the 8/6/26 resume.
- Narrow the window below the `sm` breakpoint (under 640px) or use device emulation. Confirm "Resume" is **still visible** while Experience and Projects correctly disappear.
- Toggle the theme and confirm the link is legible in both light and dark.

Stop the dev server when done.

- [ ] **Step 5: Confirm nothing else changed**

```bash
git status --short
git diff --stat HEAD
```

Expected: only `app/components/Portfolio.tsx` is modified. Untracked `.claude/` and `app/fonts/` entries may be present — these predate this work; leave them alone and do not commit them.

- [ ] **Step 6: Commit**

```bash
git add app/components/Portfolio.tsx
git commit -m "link the resume PDF from the nav

Added as a sibling to the mapped anchors rather than a third array
entry, since it needs an external href and target. Deliberately not
hidden on mobile, unlike the section anchors.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

- [ ] **Step 7: Push and confirm the deploy**

```bash
git push origin main
```

This triggers `.github/workflows` → build → deploy to GitHub Pages. Then confirm the live site picked it up (allow a couple of minutes for the workflow):

```bash
gh run list --limit 1
curl -s https://krushpatel04.github.io/My_Portfolio/ | grep -c "Owner/Operations Manager"
curl -s -o /dev/null -w "%{http_code}\n" \
  https://krushpatel04.github.io/My_Portfolio/Krush-Patel-Resume.pdf
```

Expected: the workflow run shows `completed`/`success`, the grep prints `1`, and the PDF request returns `200`. Until the workflow finishes, the grep will print `0` — re-check rather than assuming failure.

---

## Notes for the implementer

- The site's live design is intentionally being left alone. A visual rebrand is planned as a separate project after this.
- A finished redesign exists on the `cosmic-redesign` branch. It is parked on purpose. Do not merge it, do not delete it, do not cherry-pick from it.
