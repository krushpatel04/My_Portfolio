import type { Job } from "../data/resume";
import Tag from "./Tag";

export default function JobCard({ job }: { job: Job }) {
  return (
    <article
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
      className="border rounded-xl p-5 sm:p-6"
    >
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
        {job.role} &middot; {job.location} &middot; {job.period}
      </p>

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
