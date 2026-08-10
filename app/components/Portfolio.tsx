"use client";

import Header from "./Header";
import Hero from "./Hero";
import ExperienceSection from "./ExperienceSection";
import BusinessesSection from "./BusinessesSection";
import ProjectsSection from "./ProjectsSection";

/* ─── Main component ────────────────────────────────────────────────────── */

export default function Portfolio() {
  return (
    <>
      <Header />

      <Hero />

      <ExperienceSection />
      <BusinessesSection />
      <ProjectsSection />
    </>
  );
}
