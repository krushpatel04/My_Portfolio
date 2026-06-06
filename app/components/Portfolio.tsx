"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { experience } from "../data/resume";
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
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── IGS Section ───────────────────────────────────────────────────────── */

function IGSSection() {
  const igs = experience[0];

  return (
    <section
      id="experience"
      style={{
        position: "relative",
        zIndex: 3,
        background: "var(--bg)",
        minHeight: "100vh",
      }}
    >
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-32">

        <Reveal>
          <p style={{ color: "var(--accent)" }} className="text-xs font-semibold uppercase tracking-widest mb-8">
            Experience
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <h2
            style={{ color: "var(--fg)" }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-3"
          >
            {igs.company}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-10">
            <span style={{ color: "var(--body)" }} className="text-base">{igs.role}</span>
            <span style={{ color: "var(--border)" }}>·</span>
            <span style={{ color: "var(--muted)" }} className="text-sm">{igs.period}</span>
            <span style={{ color: "var(--border)" }}>·</span>
            <span style={{ color: "var(--muted)" }} className="text-sm">{igs.location}</span>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="flex flex-wrap gap-2 mb-12">
            {igs.tech.map((t) => <Tag key={t} label={t} />)}
          </div>
        </Reveal>

        <ul className="space-y-6">
          {igs.bullets.map((b, i) => (
            <Reveal key={i} delay={0.18 + i * 0.07}>
              <li style={{ color: "var(--body)" }} className="text-sm leading-relaxed flex gap-3">
                <span style={{ color: "var(--accent)" }} className="mt-1.5 shrink-0 text-xs">▸</span>
                {b}
              </li>
            </Reveal>
          ))}
        </ul>

      </div>
    </section>
  );
}

/* ─── Main component ────────────────────────────────────────────────────── */

export default function Portfolio() {
  const [phase, setPhase] = useState<"typing" | "revealed">("typing");
  const spacerRef = useRef<HTMLDivElement>(null);

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

      {/* ── Fixed Hero ──────────────────────────────────────────────────── */}
      <motion.section
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
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
        <div className="max-w-2xl mx-auto px-6 w-full" style={{ paddingTop: "calc(50vh - 3rem)" }}>
          <motion.div
            animate={{ y: phase === "revealed" ? -90 : 0 }}
            transition={{ duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1
              style={{ color: "var(--fg)" }}
              className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight"
            >
              <TypeWriter onDone={() => setTimeout(() => setPhase("revealed"), 1500)} />
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
                    src="/headShot.jpeg"
                    alt="Krush Patel"
                    width={160}
                    height={200}
                    className="rounded-xl object-cover"
                  />
                </div>
                <div>
                  <p style={{ color: "var(--accent)" }} className="text-base font-semibold mb-3">
                    Software Developer &middot; CSE @ Ohio State
                  </p>
                  <p style={{ color: "var(--body)" }} className="text-sm leading-relaxed mb-6 max-w-sm">
                    Senior CSE student at OSU building software and managing multiple businesses. Currently a
                    full-stack software developer Intern at IGS Energy and previously co-oped at Emerson. On the
                    side I help manage my family businesses and have co-founded two startup finalists at OSU
                    accelerators.
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
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* ── Document flow ────────────────────────────────────────────────── */}

      {/* Spacer: takes the hero's place in flow and drives the scroll animation.
          scrollYProgress on this div goes 0→1 as the user scrolls 0→100vh. */}
      <div ref={spacerRef} style={{ height: "100vh" }} />

      {/* IGS section slides up naturally underneath the receding hero card. */}
      <IGSSection />
    </>
  );
}
