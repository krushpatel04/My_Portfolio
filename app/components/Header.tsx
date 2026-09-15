import Image from "next/image";
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
      {/* The mobile spacing (gap-2, nav px-1) is as tight as it is so the
          Resume icon stays on screen at 320px; at 375px there's room to spare. */}
      <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between gap-2 sm:gap-3">
        {/* Logo, divider, and nav share one left-hand group; a divider with
            the nav still centred would float alone in the gap. shrink-0 so
            that at 320px the group can't be squeezed and spill "About" over
            the Resume icon — overflow goes into the gutter instead. */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link href="/#top" className="shrink-0">
            {/* Krush's bonsai, recut from the black-on-cream original into
                --fg ink on clear, since black vanishes on this ground. Shipped
                at 3x (87x108); 29x36 is that same ratio, and it has to be —
                preflight's `height: auto` overrides a mismatched height. The
                src spells out basePath because next/image doesn't add it. */}
            <Image
              src="/My_Portfolio/logo.png"
              alt="Krush Patel, home"
              width={29}
              height={36}
              unoptimized
              priority
            />
          </Link>

          {/* ml-1 / sm:ml-3 match the nav items' own padding, so the rule sits
              optically centred between the tree and the first word. Hidden
              below 360px: it costs 13px, and at 320px there isn't 13px. */}
          <span
            aria-hidden
            style={{ background: "var(--muted)" }}
            className="hidden min-[360px]:block w-px h-5 shrink-0 ml-1 sm:ml-3 opacity-50"
          />

          <nav className="flex items-center gap-1 sm:gap-2">
            {SECTIONS.map((s) => (
              /* `/#hash` rather than `#hash`: from /about a bare hash resolves
                 against the current page and does nothing. next/link also
                 prepends basePath, which a hand-written <a> would not. */
              <Link
                key={s}
                href={`/#${s}`}
                style={{ color: "var(--body)" }}
                className="text-[11px] sm:text-sm px-1 sm:px-3 py-1.5 rounded-lg capitalize transition-colors hover:bg-[var(--card)] hover:text-[var(--fg)]"
              >
                {s}
              </Link>
            ))}
            <Link
              href="/about"
              style={{ color: "var(--body)" }}
              className="text-[11px] sm:text-sm px-1 sm:px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--card)] hover:text-[var(--fg)]"
            >
              About
            </Link>
          </nav>
        </div>

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
