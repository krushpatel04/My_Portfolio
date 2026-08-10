import { projects } from "../data/resume";
import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";

export default function ProjectsSection() {
  return (
    <section className="pt-16" aria-labelledby="projects-label">
      <SectionHeading id="projects" label="Projects" />
      <div className="mt-8 flex flex-col gap-5">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  );
}
