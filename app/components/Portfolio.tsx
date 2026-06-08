"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { experience, projects } from "../data/resume";
import ThemeToggle from "./ThemeToggle";
import TypeWriter from "./TypeWriter";

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
  total,
}: {
  job: (typeof experience)[0];
  index: number;
  total: number;
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
            <ExperienceCard key={i} job={job} index={i} total={N} />
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
  const [phase, setPhase] = useState<"typing" | "revealed">("typing");
  const spacerRef = useRef<HTMLDivElement>(null);

  /* Prevent browser from restoring the previous scroll position on reload */
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  /*
   * Hero push-back: driven by the 100vh spacer.
   * offset ["start start", "end start"]:
   *   progress = 0  →  spacer top   at viewport top  (scroll = 0)
   *   progress = 1  →  spacer bottom at viewport top  (scroll = 100vh)
   */
  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const heroBorderRadius = useTransform(scrollYProgress, [0, 1], ["0px", "12px"]);

  return (
    <>
      {/* ── Navbar ──────────────────────────────────────────────────────── */}
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
            style={{ color: "var(--accent)" }}
            className="font-semibold tracking-tight text-sm"
          >
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

      {/* ── Fixed Hero ──────────────────────────────────────────────────── */}
      {/*
       * position:fixed keeps it at viewport position 0,0 always.
       * zIndex:2 sits below the horizontal timeline (zIndex:3), so the
       * timeline slides up naturally from underneath as you scroll.
       */}
      <motion.section
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          scale: heroScale,
          opacity: heroOpacity,
          borderRadius: heroBorderRadius,
          background: "var(--bg)",
          overflow: "hidden",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="max-w-2xl mx-auto px-6 w-full"
          style={{ paddingTop: "calc(50vh - 3rem)" }}
        >
          <motion.div
            animate={{ y: phase === "revealed" ? -90 : 0 }}
            transition={{ duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1
              style={{ color: "var(--fg)" }}
              className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight"
            >
              <TypeWriter
                onDone={() => setTimeout(() => setPhase("revealed"), 1500)}
              />
            </h1>

            {phase === "revealed" && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] }}
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
                  <p
                    style={{ color: "var(--accent)" }}
                    className="text-base font-semibold mb-3"
                  >
                    Software Developer &middot; CSE @ Ohio State
                  </p>
                  <p
                    style={{ color: "var(--body)" }}
                    className="text-sm leading-relaxed mb-6 max-w-sm"
                  >
                    Senior CSE student at OSU building software and managing
                    multiple businesses. Currently a full-stack software
                    developer Intern at IGS Energy and previously co-oped at
                    Emerson. On the side I help manage my family businesses and
                    have co-founded two startup finalists at OSU accelerators.
                  </p>
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
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* ── Document flow ────────────────────────────────────────────────── */}

      {/*
       * Hero spacer (100vh): gives the fixed hero "space" in the document
       * and drives scrollYProgress for the push-back animation.
       */}
      <div ref={spacerRef} style={{ height: "100vh" }} />

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
