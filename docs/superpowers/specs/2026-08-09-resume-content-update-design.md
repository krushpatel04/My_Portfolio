# Resume Content Update — Design Spec

**Date:** 2026-08-09
**Status:** Approved, pending implementation plan

## Goal

Bring the live site's resume content in sync with Krush's current resume PDF
(`8_6_26.pdf`, dated 8/6/26), and give visitors a way to download that PDF.

This is a **content-only** update against the current live design on `main`. No
theme, layout, or component changes.

## Context

Three things were true at the start of this work and shaped the scope:

1. The live site (krushpatel04.github.io/My_Portfolio) runs the current `main`
   design — confirmed by its CSS bundle still shipping Geist and the `blink`
   typewriter keyframe. The user considers this design fine for now.
2. A completed redesign sits unmerged on the `cosmic-redesign` branch (14
   commits, clean tree, builds successfully). It is **parked**, not shipped and
   not deleted. It is out of scope here and must not be touched.
3. A visual rebrand — vibe, color, theme, transitions — is planned as a separate
   project *after* this content update. Deliberately sequenced that way so
   content work doesn't get blocked behind design exploration again.

## Scope

**In scope:** `app/data/resume.ts` content, a downloadable resume PDF in
`public/`, and a nav link to it.

**Out of scope:**
- The `cosmic-redesign` branch — leave it parked and untouched.
- Any theme, palette, typography, layout, or animation change.
- The Projects section. Projects stay on the site as-is even though they no
  longer appear on the resume PDF. This is intentional: the site is allowed to
  carry more than the resume does.
- Emerson (both roles) and Aeigis — their resume content is unchanged.
- The hero bio copy.

## Decisions

### No Education section

The resume lists OSU, B.S. CSE, GPA 3.6/4.0, Aug 2023 – May 2027. It will **not**
get a section on the site — the hero already reads "Software Developer · CSE @
Ohio State," and the downloadable PDF carries the grad date and GPA for anyone
who wants that depth.

### No Skills section

The resume has a Languages / Frameworks / Tools block. It will **not** be added.
A skills section was deliberately removed in commit `4288c92`; that decision
stands. Per-job tech tags remain the site's only tech signal.

### Per-job tech tags DO get updated

Distinct from the above: the `tech` arrays on individual job entries are content,
not a skills section, and they get synced. This matters most for IGS Energy,
whose card currently advertises Vue.js on a role that is now React.

### Emerson stays as two cards

The resume PDF groups both Emerson roles under a single header. The site keeps
them as two separate cards — they are genuinely different roles (Software
Developer, System Analyst) and the site has room to give each one space.

### PDF is renamed on the way in

`8_6_26.pdf` ships as `public/Krush-Patel-Resume.pdf`. The source filename reads
as a scratch file; the download name is what a recruiter sees on their disk.

### Resume link lives in the nav

The link goes in the nav bar alongside the existing Experience / Projects
anchors, so it stays visible for the entire scroll. Not in the hero pill links.

## Changes

### 1. `app/data/resume.ts` — IGS Energy

`tech` becomes:

```
["C#", ".NET", "React", "TypeScript", "Python/FastAPI", "SSMS",
 "Azure DevOps", "Playwright", "Octopus", "HubSpot"]
```

Both existing bullets are **replaced** (not appended to) by these four:

1. Delivered full-stack features for Choice 360, IGS Energy's core customer CRM,
   spanning a React 18/TypeScript frontend, ASP.NET Core 10 backend, and SQL
   Server migration repo with coordinated branching and deploy ordering.
2. Built a contract parser at a company hackathon after learning from a director
   that signed contracts were never recorded, extracting fields into a database
   that can be cross checked against upstream systems, then pitched it to
   leadership.
3. Built interactive dashboards from Jira and Octopus Deploy history that gave
   the team visibility into its own support load and release cadence, surfacing
   where ticket volume was avoidable and how much of the release cycle was
   unplanned.
4. Removed 5,100+ lines of dead legacy code across two systems, an abandoned
   HubSpot contact-sync subsystem and a retired feature-flag path, sequencing
   flag deletion across two application deployments so legacy paths couldn't
   reactivate.

The old bullets (Playwright E2E framework validation, Confluence documentation)
are dropped — they are not on the current resume.

### 2. `app/data/resume.ts` — Patel Family Enterprises

- `role`: `"Manager"` → `"Owner/Operations Manager"`
- `period`: `"Jan 2019 – Dec 2025"` → `"Jan 2019 – Present"`

Bullet, location, and tech are unchanged.

Note: this makes two entries read "– Present" (IGS Energy and Patel Family
Enterprises). That is accurate and expected. Reverse-chronological ordering of
the array is unchanged.

### 3. `app/data/resume.ts` — Parcel

Bullet 1 → "Placed top 6 of 50+ teams and secured $5,000 in funding through OSU's
Best of Student Startups accelerator."

Bullet 2 gains a new ending → "Built a web-based workflow application enabling
adjusters to centralize documentation, auto-generate templates, and share
complete claim packets in one click, improving speed, reducing reporting errors,
and streamlining field workflows."

Bullet 3, tech, role, period, and location are unchanged.

### 4. `public/Krush-Patel-Resume.pdf`

Copy `~/Downloads/8_6_26.pdf` to `public/Krush-Patel-Resume.pdf`.

### 5. Nav link

Add a "Resume" link to the nav bar in `app/components/Portfolio.tsx` (the `<nav>`
at line 333), alongside the Experience and Projects anchors.

Two properties of the existing nav constrain how this is done:

- The Experience/Projects links are generated by mapping over
  `["experience", "projects"]` with `href={`#${s}`}`. The Resume link **cannot**
  be a third entry in that array — it needs a different `href` shape and a
  `target`. It is added as a sibling element after the map instead.
- Those mapped links are `hidden sm:block`, so they do not render on mobile at
  all. The Resume link must **not** copy that class — it is the one nav item
  that should stay visible at every breakpoint, since downloading the resume is
  the highest-value action on the page. Otherwise the PDF becomes unreachable
  for phone visitors, which is a large share of traffic from a link in a bio.

Link details:

- `href` is `/My_Portfolio/Krush-Patel-Resume.pdf`. `next.config.ts` sets
  `basePath: "/My_Portfolio"` unconditionally, so the prefix is written
  explicitly — the same pattern the headshot already uses
  (`src="/My_Portfolio/headShot.jpeg"`). This resolves correctly in local dev
  too, since dev also serves under the basePath.
- Opens in a new tab (`target="_blank"`, `rel="noopener noreferrer"`) — it is an
  external document, not an in-page anchor like the other two nav links.
- Otherwise styled to match the existing nav links (same size, padding, radius,
  hover treatment). It may use `var(--accent)` rather than `var(--muted)` to
  distinguish it as the one action among navigation anchors; this is a judgment
  call for implementation, not a fixed requirement.

## Verification

- `npm run build` succeeds (static export).
- `npm run lint` passes.
- Manual check: IGS card shows four new bullets and the new tech tags; Patel card
  shows "Owner/Operations Manager" and "Jan 2019 – Present"; Parcel bullets read
  as specified.
- Manual check: the nav Resume link opens the PDF in a new tab, both in local dev
  and in the built `out/` export.
- Projects section is visually unchanged.

## Rollout

Commit to `main` and push. The GitHub Pages workflow (`.github/workflows`)
deploys on push to `main`, so pushing publishes the update.

## What comes next (not this spec)

A rebrand — vibe, color, theme, transitions — as its own brainstorm and spec.
The parked `cosmic-redesign` branch is available to raid for ideas or code at
that point, but the rebrand is not obligated to use it.
