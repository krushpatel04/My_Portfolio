"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { experience, projects, skills } from "../data/resume";
import ThemeToggle from "./ThemeToggle";
import TypeWriter from "./TypeWriter";

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

/* ─── Resume sections ───────────────────────────────────────────────────── */

function ExperienceSection() {
  return (
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
  );
}

function ProjectsSection() {
  return (
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
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--accent)" }}
                      className="text-xs transition-opacity hover:opacity-70"
                    >
                      GitHub ↗
                    </a>
                  )}
                  {p.youtube && (
                    <a
                      href={p.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--accent)" }}
                      className="text-xs transition-opacity hover:opacity-70"
                    >
                      Watch ↗
                    </a>
                  )}
                </div>
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
  );
}

function EducationSection() {
  return (
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
  );
}

function SkillsSection() {
  return (
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
  );
}

/* ─── Main component ────────────────────────────────────────────────────── */

export default function Portfolio() {
  const [phase, setPhase] = useState<"typing" | "revealed">("typing");

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

        {/* ── Typing intro ────────────────────────────────────────────────── */}
        <motion.section
          layout
          transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
          className={phase === "typing" ? "min-h-screen flex flex-col justify-center" : "pt-28"}
        >
          <motion.h1
            layout
            transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
            style={{ color: "var(--fg)" }}
            className="text-5xl sm:text-7xl font-bold tracking-tight leading-tight"
          >
            <TypeWriter onDone={() => setTimeout(() => setPhase("revealed"), 1500)} />
          </motion.h1>
        </motion.section>

        {/* ── Resume content ──────────────────────────────────────────────── */}
        {phase === "revealed" && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Hero info */}
            <div className="pt-6 pb-16">
              <p style={{ color: "var(--accent)" }} className="text-base font-medium mb-4">
                Software Developer &middot; CSE @ Ohio State
              </p>
              <p style={{ color: "var(--muted)" }} className="text-sm leading-relaxed mb-8 max-w-lg">
                Senior CSE student at OSU building software and managing multiple businesses. Currently a full-stack
                software developer Intern at IGS Energy and previously co-oped at Emerson. On the side I help manage my family businesses and have co-founded two startup finalists at
                OSU accelerators.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
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
              </div>
            </div>

            <hr style={{ borderColor: "var(--border)" }} className="mb-16" />
            <ExperienceSection />
            <hr style={{ borderColor: "var(--border)" }} className="mb-16" />
            <ProjectsSection />
            <hr style={{ borderColor: "var(--border)" }} className="mb-16" />
            <EducationSection />
            <hr style={{ borderColor: "var(--border)" }} className="mb-16" />
            <SkillsSection />

            <p style={{ color: "var(--muted)" }} className="text-xs text-center">
              Krush Patel &copy; {new Date().getFullYear()} &middot; Built with Next.js
            </p>
          </motion.div>
        )}

      </main>
    </>
  );
}
