"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import TypeWriter from "./TypeWriter";

/* ─── Data ─────────────────────────────────────────────────────────────── */

const experience = [
  {
    company: "Emerson",
    role: "Software Developer (Co-op)",
    period: "Jan 2026 – Present",
    location: "Elyria, OH",
    tech: ["C#", ".NET", "Vue.js", "SQL Server", "Azure", "Git"],
    bullets: [
      "Enhanced an internal enterprise CRM used by 5,000+ employees, delivering full-stack improvements, resolving production issues, and streamlining case management and lead-tracking workflows.",
      "Implemented backend business logic and version-controlled database changes, including SQL schema updates, stored procedures, and Entity Framework migrations to ensure data integrity and reliable deployments.",
      "Built automation workflows and scheduled processes for case lifecycle management and customer feedback notifications, contributing to stable releases through .NET unit testing and CI pipeline validation.",
    ],
  },
  {
    company: "Emerson",
    role: "System Analyst (Co-op)",
    period: "Jan 2026 – Present",
    location: "Elyria, OH",
    tech: [],
    bullets: [
      "Led discovery and workflow analysis for an internal CRM enhancement project, replacing spreadsheet-based promo tracking with structured case fields, streamlining redemption processing by ~50%.",
      "Defined data requirements and collaborated on UI mockups through stakeholder interviews, standardizing redemption entry for a team of 12+ customer representatives.",
      "Improved reporting and decision-making by structuring redemption data for direct DOMO analytics integration, supporting visibility for hundreds of monthly promotions.",
    ],
  },
  {
    company: "Aeigis",
    role: "Co-Founder",
    period: "Jan 2025 – Mar 2025",
    location: "Columbus, OH",
    tech: ["Node.js", "TypeScript", "C#"],
    bullets: [
      "Selected as finalist (top 11 of 60) in OSU's President's Buckeye Accelerator for a firefighter safety tracking solution.",
      "Led discovery and validation by interviewing 12+ firefighters; secured letters of intent from two fire departments.",
      "Coordinated development of a prototype and pitch deck, presenting to investors to support funding and deployment.",
    ],
  },
  {
    company: "Parcel",
    role: "Co-Founder",
    period: "Aug 2025 – Nov 2025",
    location: "Columbus, OH",
    tech: ["Node.js", "TypeScript"],
    bullets: [
      "Finalist (top 6 of 50+ teams) and $5,000 funding recipient in OSU's Best of Student Startups accelerator.",
      "Built a web-based workflow application enabling insurance adjusters to centralize documentation, auto-generate templates, and share complete claim packets in one click.",
      "Led customer discovery with insurance adjusters to validate workflow inefficiencies and define product requirements.",
    ],
  },
  {
    company: "Big Creek Convenience Store",
    role: "Manager",
    period: "Jan 2019 – Dec 2025",
    location: "Parma, OH",
    tech: [],
    bullets: [
      "Managed operations across multiple family-run retail and franchise businesses with $1.5M gross revenue, leading staff, overseeing finances, implementing POS systems, and managing vendor relationships and inventory.",
    ],
  },
];

const projects = [
  {
    name: "2D Zelda Style Game",
    tech: ["C#", "MonoGame", "C", "Arduino", "ESP32"],
    date: "Dec 2025",
    description:
      "A fully playable recreation of the first Legend of Zelda dungeon built in a 5-person agile team using Jira and Git. Implemented HUD systems, map/mini-map rendering, and sprite-based gameplay mechanics. Also built a physical ESP32 controller in Arduino/C for real-time serial input.",
    link: "https://github.com/LiamG5/sprint0",
  },
  {
    name: "Systems Programming Coursework",
    tech: ["C", "x86-64 Assembly", "GDB"],
    date: "Jan 2025",
    description:
      "Built multi-file C programs processing structured records using file I/O and structs. Debugged low-level behavior with GDB while applying x86-64 calling conventions and stack alignment.",
    link: null,
  },
];

const skills: Record<string, string[]> = {
  Languages: ["C#", "Java", "C", "JavaScript", "TypeScript", "Python", "SQL", "T-SQL", "HTML/CSS"],
  "Frameworks & Libraries": ["Node.js", "Vue.js", ".NET", "Next.js", "MonoGame", "JUnit", "Make", "GDB"],
  "Dev Tools": ["Git/GitHub", "Linux/WSL", "Visual Studio", "VS Code", "SSMS", "Jira", "Azure"],
};

/* ─── Sub-components ────────────────────────────────────────────────────── */

function Tag({ label }: { label: string }) {
  return (
    <span
      style={{ background: "var(--card)", color: "var(--muted)", border: "1px solid var(--border)" }}
      className="text-xs px-2 py-0.5 rounded-md font-mono"
    >
      {label}
    </span>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      style={{ color: "var(--accent)" }}
      className="text-xs font-semibold uppercase tracking-widest mb-8"
    >
      {children}
    </h2>
  );
}

/* ─── Main component ────────────────────────────────────────────────────── */

export default function Portfolio() {
  const [typingDone, setTypingDone] = useState(false);

  return (
    <>
      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav
        style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--border)" }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      >
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="#" style={{ color: "var(--accent)" }} className="font-semibold tracking-tight text-sm">
            kp
          </a>
          <div className="flex items-center gap-1">
            {["experience", "projects", "skills"].map((s) => (
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

      <main className="max-w-2xl mx-auto px-6 pb-24">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col justify-center pt-14 pb-16">
          <h1
            style={{ color: "var(--fg)" }}
            className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight"
          >
            <TypeWriter onDone={() => setTypingDone(true)} />
          </h1>

          <motion.p
            style={{ color: "var(--accent)" }}
            className="text-base font-medium mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={typingDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Software Developer &middot; CSE @ Ohio State
          </motion.p>

          <motion.p
            style={{ color: "var(--muted)" }}
            className="text-sm leading-relaxed mb-8 max-w-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={typingDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            Junior CSE student at OSU building software and hardware projects. Currently a full-stack
            software developer co-op at Emerson and previously co-founded two startup finalists at
            OSU accelerators.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3 text-sm"
            initial={{ opacity: 0, y: 12 }}
            animate={typingDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <a
              href="https://www.linkedin.com/in/krush-patel-54324a2a5"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)", borderColor: "var(--border)" }}
              className="border px-4 py-1.5 rounded-lg transition-opacity hover:opacity-70"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://github.com/krushpatel04"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)", borderColor: "var(--border)" }}
              className="border px-4 py-1.5 rounded-lg transition-opacity hover:opacity-70"
            >
              GitHub ↗
            </a>
            <a
              href="mailto:patel.5355@osu.edu"
              style={{ color: "var(--accent)", borderColor: "var(--border)" }}
              className="border px-4 py-1.5 rounded-lg transition-opacity hover:opacity-70"
            >
              patel.5355@osu.edu
            </a>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
            initial={{ opacity: 0 }}
            animate={typingDone ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.div
              style={{ background: "var(--accent)" }}
              className="w-0.5 h-8 rounded-full origin-top"
              animate={{ scaleY: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </section>

        <hr style={{ borderColor: "var(--border)" }} className="mb-16" />

        {/* ── Experience ────────────────────────────────────────────────── */}
        <section className="mb-16">
          <Reveal>
            <SectionHeading id="experience">Experience</SectionHeading>
          </Reveal>
          <div className="space-y-10">
            {experience.map((job, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                    <div>
                      <span className="font-semibold text-sm" style={{ color: "var(--fg)" }}>
                        {job.company}
                      </span>
                      <span style={{ color: "var(--muted)" }} className="text-sm">
                        {" "}— {job.role}
                      </span>
                    </div>
                    <span style={{ color: "var(--muted)" }} className="text-xs shrink-0">
                      {job.period} &middot; {job.location}
                    </span>
                  </div>
                  {job.tech.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {job.tech.map((t) => <Tag key={t} label={t} />)}
                    </div>
                  )}
                  <ul className="space-y-2">
                    {job.bullets.map((b, j) => (
                      <li key={j} style={{ color: "var(--muted)" }} className="text-sm leading-relaxed flex gap-2">
                        <span style={{ color: "var(--accent)" }} className="mt-1.5 shrink-0 text-xs">▸</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <hr style={{ borderColor: "var(--border)" }} className="mb-16" />

        {/* ── Projects ──────────────────────────────────────────────────── */}
        <section className="mb-16">
          <Reveal>
            <SectionHeading id="projects">Projects</SectionHeading>
          </Reveal>
          <div className="grid gap-4">
            {projects.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div
                  style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                  className="rounded-xl p-5 transition-transform duration-150 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: "var(--fg)" }}>{p.name}</h3>
                      <span style={{ color: "var(--muted)" }} className="text-xs">{p.date}</span>
                    </div>
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--accent)" }}
                        className="text-xs shrink-0 transition-opacity hover:opacity-70 mt-0.5"
                      >
                        GitHub ↗
                      </a>
                    )}
                  </div>
                  <p style={{ color: "var(--muted)" }} className="text-sm leading-relaxed mb-3">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tech.map((t) => <Tag key={t} label={t} />)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <hr style={{ borderColor: "var(--border)" }} className="mb-16" />

        {/* ── Education ─────────────────────────────────────────────────── */}
        <section className="mb-16">
          <Reveal>
            <SectionHeading id="education">Education</SectionHeading>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <div>
                <span className="font-semibold text-sm" style={{ color: "var(--fg)" }}>
                  The Ohio State University
                </span>
                <span style={{ color: "var(--muted)" }} className="text-sm"> — Columbus, OH</span>
              </div>
              <span style={{ color: "var(--muted)" }} className="text-xs shrink-0">Aug 2023 – May 2027</span>
            </div>
            <p style={{ color: "var(--muted)" }} className="text-sm mt-1.5">
              B.S. Computer Science and Engineering &middot;{" "}
              <span style={{ color: "var(--accent)" }} className="font-medium">GPA 3.6 / 4.0</span>
            </p>
          </Reveal>
        </section>

        <hr style={{ borderColor: "var(--border)" }} className="mb-16" />

        {/* ── Skills ────────────────────────────────────────────────────── */}
        <section className="mb-20">
          <Reveal>
            <SectionHeading id="skills">Skills</SectionHeading>
          </Reveal>
          <div className="space-y-5">
            {Object.entries(skills).map(([category, items], i) => (
              <Reveal key={category} delay={i * 0.08}>
                <div>
                  <p style={{ color: "var(--fg)" }} className="text-xs font-semibold mb-2 uppercase tracking-wide">
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((s) => <Tag key={s} label={s} />)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Footer */}
        <p style={{ color: "var(--muted)" }} className="text-xs text-center">
          Krush Patel &copy; {new Date().getFullYear()} &middot; Built with Next.js
        </p>
      </main>
    </>
  );
}
