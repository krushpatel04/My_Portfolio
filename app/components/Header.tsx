const SECTIONS = ["experience", "businesses", "projects"] as const;

/* The explicit type matters: without it TypeScript infers a union from the
 * array literal and `l.external` fails to compile on the two entries that
 * omit the key. */
const SOCIALS: { label: string; href: string; external?: boolean }[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/krush-patel-54324a2a5" },
  { label: "GitHub", href: "https://github.com/krushpatel04" },
  { label: "Email", href: "mailto:patel.5355@osu.edu", external: false },
];

export default function Header() {
  return (
    <header
      style={{ background: "var(--bg)", borderColor: "var(--border)" }}
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md"
    >
      <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between gap-3">
        <a
          href="#top"
          style={{ color: "var(--fg)" }}
          className="font-bold tracking-tight text-sm shrink-0"
        >
          kp
        </a>

        <nav className="flex items-center gap-1 sm:gap-2">
          {SECTIONS.map((s) => (
            <a
              key={s}
              href={`#${s}`}
              style={{ color: "var(--body)" }}
              className="text-[11px] sm:text-sm px-1.5 sm:px-3 py-1.5 rounded-lg capitalize transition-colors hover:bg-[var(--card)] hover:text-[var(--fg)]"
            >
              {s}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 shrink-0">
          <a
            href="/My_Portfolio/Krush-Patel-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--muted)" }}
            className="text-[11px] sm:text-xs px-2 py-1.5 rounded-lg transition-colors hover:bg-[var(--card)] hover:text-[var(--accent)]"
          >
            Resume
          </a>
          {SOCIALS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.external === false
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
              style={{ color: "var(--muted)" }}
              className="hidden sm:block text-xs px-2 py-1.5 rounded-lg transition-colors hover:bg-[var(--card)] hover:text-[var(--accent)]"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
