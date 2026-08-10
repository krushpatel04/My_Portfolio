import type { Project } from "../data/resume";
import Tag from "./Tag";
import PillLink from "./PillLink";

export default function ProjectCard({ project }: { project: Project }) {
  const hasLinks = Boolean(project.link || project.youtube);

  return (
    <article
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
      className="border rounded-xl p-5 sm:p-6"
    >
      {/* Same title/meta split as JobCard, with only a date on the right. */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-5">
        <h3
          style={{ color: "var(--fg)" }}
          className="text-lg font-bold tracking-tight leading-snug min-w-0"
        >
          {project.name}
        </h3>

        <p
          style={{ color: "var(--muted)" }}
          className="font-mono text-[10px] tracking-[0.09em] uppercase mt-2 sm:mt-0 sm:text-right shrink-0"
        >
          {project.date}
        </p>
      </div>

      {project.tech.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tech.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      )}

      <p
        style={{ color: "var(--body)" }}
        className="text-sm leading-relaxed mt-4"
      >
        {project.description}
      </p>

      {hasLinks && (
        <div className="flex flex-wrap gap-3 mt-5">
          {project.link && <PillLink href={project.link}>GitHub ↗</PillLink>}
          {project.youtube && (
            <PillLink href={project.youtube}>Demo ↗</PillLink>
          )}
        </div>
      )}
    </article>
  );
}
