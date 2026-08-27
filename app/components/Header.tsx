import Link from "next/link";
import { GitHubIcon, LinkedInIcon, MailIcon, ResumeIcon } from "./Icons";

const SECTIONS = ["experience", "businesses", "projects"] as const;

/* The explicit type matters: without it TypeScript infers a union from the
 * array literal and `l.external` fails to compile on the two entries that
 * omit the key. */
const SOCIALS: {
  label: string;
  href: string;
  external?: boolean;
  Icon: (p: { className?: string }) => React.JSX.Element;
}[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/krush-patel-54324a2a5",
    Icon: LinkedInIcon,
  },
  { label: "GitHub", href: "https://github.com/krushpatel04", Icon: GitHubIcon },
  {
    label: "Email",
    href: "mailto:patel.5355@osu.edu",
    external: false,
    Icon: MailIcon,
  },
];

/* The icons carry no text, so the accessible name comes from `aria-label` and
 * the pointer affordance from `title`. The glyph itself is aria-hidden. */
const ICON_LINK =
  "p-2 rounded-lg transition-colors hover:bg-[var(--card)] hover:text-[var(--accent)]";

export default function Header() {
  return (
    <header
      style={{ background: "var(--bg)", borderColor: "var(--border)" }}
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md"
    >
      <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between gap-3">
        <Link
          href="/#top"
          style={{ color: "var(--fg)" }}
          className="font-bold tracking-tight text-sm shrink-0"
        >
          kp
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {SECTIONS.map((s) => (
            /* `/#hash` rather than `#hash`: from /about a bare hash resolves
               against the current page and does nothing. next/link also
               prepends basePath, which a hand-written <a> would not. */
            <Link
              key={s}
              href={`/#${s}`}
              style={{ color: "var(--body)" }}
              className="text-[11px] sm:text-sm px-1.5 sm:px-3 py-1.5 rounded-lg capitalize transition-colors hover:bg-[var(--card)] hover:text-[var(--fg)]"
            >
              {s}
            </Link>
          ))}
          <Link
            href="/about"
            style={{ color: "var(--body)" }}
            className="text-[11px] sm:text-sm px-1.5 sm:px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--card)] hover:text-[var(--fg)]"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-1 shrink-0">
          <a
            href="/My_Portfolio/Krush-Patel-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Resume (PDF, opens in a new tab)"
            title="Resume"
            style={{ color: "var(--muted)" }}
            className={ICON_LINK}
          >
            <ResumeIcon className="w-[17px] h-[17px]" />
          </a>
          {SOCIALS.map(({ label, href, external, Icon }) => (
            <a
              key={label}
              href={href}
              {...(external === false
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
              aria-label={
                external === false ? label : `${label} (opens in a new tab)`
              }
              title={label}
              style={{ color: "var(--muted)" }}
              className={`hidden sm:block ${ICON_LINK}`}
            >
              <Icon className="w-[17px] h-[17px]" />
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
