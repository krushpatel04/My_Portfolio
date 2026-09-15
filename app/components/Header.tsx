import Link from "next/link";
import { ResumeIcon } from "./Icons";
import SocialLinks, { ICON_LINK } from "./SocialLinks";

const SECTIONS = ["experience", "businesses", "projects"] as const;

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
          {/* Hidden on mobile — they don't fit beside the nav. The footer
              carries them at every width. */}
          <SocialLinks
            linkClassName="hidden sm:block"
            iconClassName="w-[17px] h-[17px]"
          />
        </div>
      </div>
    </header>
  );
}
