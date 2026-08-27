/* Hand-authored line icons, sized by the parent's font-size via `1em` and
 * inked with `currentColor`, so they inherit the header's existing colour and
 * hover states instead of carrying their own. No icon dependency: four glyphs
 * is not worth a package, and there is already one unused one in here.
 *
 * All four share a 24x24 box and a 2 stroke so they read as one set. */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" />
      <line x1="7.5" y1="10.5" x2="7.5" y2="17" />
      <circle cx="7.5" cy="7.2" r="0.6" fill="currentColor" stroke="none" />
      <path d="M11.5 17v-3.4a2.6 2.6 0 0 1 5.2 0V17" />
      <line x1="11.5" y1="10.5" x2="11.5" y2="17" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3.5 7 7.34 5.13a2 2 0 0 0 2.32 0L20.5 7" />
    </svg>
  );
}

/* A page with a folded corner and lines of text — the conventional "document"
 * glyph. A download arrow was the other candidate, but the resume link opens
 * the PDF in a new tab rather than downloading it, so the arrow would promise
 * the wrong thing. */
export function ResumeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M14 2.5H7A2.5 2.5 0 0 0 4.5 5v14A2.5 2.5 0 0 0 7 21.5h10a2.5 2.5 0 0 0 2.5-2.5V8z" />
      <path d="M14 2.5V8h5.5" />
      <line x1="8.5" y1="12.5" x2="14.5" y2="12.5" />
      <line x1="8.5" y1="16.5" x2="15.5" y2="16.5" />
    </svg>
  );
}
