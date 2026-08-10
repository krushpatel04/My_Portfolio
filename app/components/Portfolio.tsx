"use client";

import { useState, useRef, useEffect } from "react";
import { experience, projects, Job } from "../data/resume";
import PillLink from "./PillLink";
import Header from "./Header";
import Hero from "./Hero";

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

/* ─── Horizontal timeline ───────────────────────────────────────────────── */

function ExperienceCard({
  job,
  index,
}: {
  job: Job;
  index: number;
}) {
  return (
    /* Each card is exactly 100vw wide inside the N×100vw flex track */
    <div
      style={{ width: "100vw", height: "100%", flexShrink: 0 }}
      className="flex flex-col justify-center"
    >
      <div className="max-w-2xl mx-auto px-6 w-full">
        {/* Index + period */}
        <p
          style={{ color: "var(--body)" }}
          className="text-xs font-mono mb-6 tracking-widest uppercase"
        >
          {String(index + 1).padStart(2, "0")} &middot; {job.period}
        </p>

        {/* Company */}
        <h2
          style={{ color: "var(--fg)" }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-none mb-3"
        >
          {job.company}
        </h2>

        {/* Role + location */}
        <p className="text-sm mb-8">
          <span style={{ color: "var(--accent)" }}>{job.role}</span>
          <span style={{ color: "var(--muted)" }}>&ensp;&middot;&ensp;{job.location}</span>
        </p>

        {/* Tech tags */}
        {job.tech.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {job.tech.map((t) => (
              <Tag key={t} label={t} />
            ))}
          </div>
        )}

        {/* Bullets */}
        <ul className="space-y-4">
          {job.bullets.map((b, i) => (
            <li
              key={i}
              style={{ color: "var(--body)" }}
              className="text-sm leading-relaxed flex gap-3 max-w-lg"
            >
              <span
                style={{ color: "var(--accent)" }}
                className="mt-1.5 shrink-0 text-xs"
              >
                ▸
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function HorizontalTimeline() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progBarRef = useRef<HTMLDivElement>(null);
  const N = experience.length;
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    let rafId: number;
    let lastCard = -1;

    function tick() {
      const wrapper = wrapperRef.current;
      const track = trackRef.current;
      if (!wrapper || !track) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const { top } = wrapper.getBoundingClientRect();
      const scrollable = wrapper.offsetHeight - window.innerHeight;

      if (scrollable > 0) {
        const p = Math.min(1, Math.max(0, -top / scrollable));
        track.style.transform = `translateX(${-(p * (N - 1) * 100) / N}%)`;

        if (progBarRef.current) {
          progBarRef.current.style.transform = `scaleX(${p})`;
        }

        const card = Math.round(p * (N - 1));
        if (card !== lastCard) {
          lastCard = card;
          setActiveCard(card);
        }
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [N]);

  return (
    /* Tall wrapper — acts as the scroll track */
    <div
      ref={wrapperRef}
      style={{
        height: `${N * 100}vh`,
        position: "relative",
        zIndex: 3,
        background: "var(--bg)",
      }}
    >
      {/*
       * Sticky container: pins to viewport top while the wrapper scrolls.
       * overflow:hidden clips off-screen cards (no horizontal page overflow).
       * zIndex is inherited from the wrapper's stacking context (z=3).
       */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Horizontal flex track — transform driven directly by RAF */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            flexDirection: "row",
            width: `${N * 100}vw`,
            height: "100%",
            willChange: "transform",
          }}
        >
          {experience.map((job, i) => (
            <ExperienceCard key={i} job={job} index={i} />
          ))}
        </div>

        {/* ── Bottom HUD: counter + gold progress bar ──────────────────── */}
        <div style={{ position: "absolute", bottom: 32, left: 0, right: 0 }}>
          <div className="max-w-2xl mx-auto px-6">
            <div className="flex items-center justify-between mb-3">
              <span
                style={{ color: "var(--muted)" }}
                className="text-xs font-mono tabular-nums"
              >
                {String(activeCard + 1).padStart(2, "0")}&nbsp;/&nbsp;
                {String(N).padStart(2, "0")}
              </span>
              <span
                style={{ color: "var(--muted)" }}
                className="text-xs tracking-wide"
              >
                scroll to navigate
              </span>
            </div>
            <div
              style={{
                height: "1px",
                background: "var(--border)",
                position: "relative",
              }}
            >
              <div
                ref={progBarRef}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "var(--accent)",
                  transform: "scaleX(0)",
                  transformOrigin: "left",
                  willChange: "transform",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
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

      {/*
       * Horizontal experience timeline.
       * Its sticky inner (zIndex:3) slides up from beneath the hero as the
       * spacer is consumed, then takes over the screen and pans through all
       * experience cards as the user scrolls down.
       */}
      <HorizontalTimeline />
      <ProjectsSection />
    </>
  );
}
