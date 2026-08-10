import type { Job } from "../data/resume";
import Tag from "./Tag";

export default function JobCard({ job }: { job: Job }) {
  return (
    <article
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
      className="border rounded-xl p-5 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-5">
        <div className="min-w-0">
          <h3
            style={{ color: "var(--fg)" }}
            className="text-lg font-bold tracking-tight leading-snug"
          >
            {job.company}
          </h3>

          <p
            style={{ color: "var(--muted)" }}
            className="font-mono text-[10px] tracking-[0.09em] uppercase mt-2"
          >
            {job.role}
          </p>
        </div>

        {/* Stacks under the title on phones, becomes a right-hand column at sm+,
            mirroring the résumé PDF's company-left / dates-right layout. */}
        <p
          style={{ color: "var(--muted)" }}
          className="font-mono text-[10px] tracking-[0.09em] uppercase mt-1 sm:mt-0 sm:text-right shrink-0"
        >
          <span className="sm:block">{job.period}</span>
          <span className="sm:hidden"> &middot; </span>
          <span className="sm:block">{job.location}</span>
        </p>
      </div>

      {job.tech.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {job.tech.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      )}

      <ul className="mt-4 flex flex-col gap-2.5">
        {job.bullets.map((b, i) => (
          <li
            key={i}
            style={{ color: "var(--body)" }}
            className="text-sm leading-relaxed flex gap-2.5"
          >
            <span aria-hidden="true" style={{ color: "var(--accent)" }} className="shrink-0">
              &mdash;
            </span>
            {b}
          </li>
        ))}
      </ul>
    </article>
  );
}
