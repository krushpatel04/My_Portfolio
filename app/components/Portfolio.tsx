import Header from "./Header";
import Hero from "./Hero";
import ExperienceSection from "./ExperienceSection";
import BusinessesSection from "./BusinessesSection";
import ProjectsSection from "./ProjectsSection";
import Footer from "./Footer";

export default function Portfolio() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-5">
        <Hero />
        <ExperienceSection />
        <BusinessesSection />
        <ProjectsSection />
        <Footer />
      </main>
    </>
  );
}
