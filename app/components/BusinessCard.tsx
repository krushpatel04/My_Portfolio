import type { Business } from "../data/resume";
import Tag from "./Tag";

export default function BusinessCard({ item }: { item: Business }) {
  return (
    <article
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
      className="border rounded-xl p-5 sm:p-6"
    >
      <h3
        style={{ color: "var(--fg)" }}
        className="text-lg font-bold tracking-tight leading-snug"
      >
        {item.company}
      </h3>

      <p
        style={{ color: "var(--muted)" }}
        className="font-mono text-[10px] tracking-[0.09em] uppercase mt-2"
      >
        {item.role} &middot; {item.location} &middot; {item.period}
      </p>

      <ul className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 mt-4">
        {item.names.map((name, i) => (
          <li key={name} className="flex items-center gap-2.5">
            {i > 0 && (
              <span
                aria-hidden="true"
                style={{ background: "var(--accent)" }}
                className="block w-[3px] h-[3px] rounded-full"
              />
            )}
            <span
              style={{ color: "var(--fg)" }}
              className="text-sm font-bold"
            >
              {name}
            </span>
          </li>
        ))}
      </ul>

      <ul className="mt-4 flex flex-col gap-2.5">
        {item.bullets.map((b, i) => (
          <li
            key={i}
            style={{ color: "var(--body)" }}
            className="text-sm leading-relaxed flex gap-2.5"
          >
            <span style={{ color: "var(--accent)" }} className="shrink-0">
              &mdash;
            </span>
            {b}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1.5 mt-4">
        {item.tags.map((t) => (
          <Tag key={t} label={t} />
        ))}
      </div>
    </article>
  );
}
