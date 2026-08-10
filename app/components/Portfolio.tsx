"use client";

import { projects } from "../data/resume";
import PillLink from "./PillLink";
import Header from "./Header";
import Hero from "./Hero";
import ExperienceSection from "./ExperienceSection";

/* ─── Shared primitives ─────────────────────────────────────────────────── */

function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        background: "var(--card)",
        color: "var(--muted)",
        border: "1px solid var(--border)",
      }}
      className="text-xs px-2 py-0.5 rounded-md font-mono"
    >
      {label}
    </span>
  );
}

/* ─── Projects section ──────────────────────────────────────────────────── */

function ProjectsSection() {
  return (
    <section
      id="projects"
      style={{
        background: "var(--bg)",
        minHeight: "100vh",
        position: "relative",
        zIndex: 3,
      }}
    >
      <div className="max-w-2xl mx-auto px-6 pt-24 pb-32">
        <p
          style={{ color: "var(--body)" }}
          className="text-xs font-mono mb-12 tracking-widest uppercase"
        >
          Projects
        </p>

        <div className="space-y-24">
          {projects.map((proj, i) => (
            <div key={i}>
              {/* Name */}
              <h2
                style={{ color: "var(--fg)" }}
                className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-none mb-2"
              >
                {proj.name}
              </h2>

              {/* Date */}
              <p
                style={{ color: "var(--muted)" }}
                className="text-xs font-mono mb-5"
              >
                {proj.date}
              </p>

              {/* Tech tags */}
              {proj.tech.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {proj.tech.map((t) => (
                    <Tag key={t} label={t} />
                  ))}
                </div>
              )}

              {/* Description */}
              <p
                style={{ color: "var(--body)" }}
                className="text-sm leading-relaxed mb-6 max-w-lg"
              >
                {proj.description}
              </p>

              {/* Links */}
              <div className="flex flex-wrap gap-3">
                {proj.link && <PillLink href={proj.link}>GitHub ↗</PillLink>}
                {proj.youtube && (
                  <PillLink href={proj.youtube}>Demo ↗</PillLink>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Main component ────────────────────────────────────────────────────── */

export default function Portfolio() {
  return (
    <>
      <Header />

      <Hero />

      <ExperienceSection />
      <ProjectsSection />
    </>
  );
}
