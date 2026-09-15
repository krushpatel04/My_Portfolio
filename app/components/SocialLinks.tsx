import { GitHubIcon, LinkedInIcon, MailIcon } from "./Icons";

/* One list for the header and the footer, so the two can't drift apart.
 *
 * The explicit type matters: without it TypeScript infers a union from the
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
export const ICON_LINK =
  "p-2 rounded-lg transition-colors hover:bg-[var(--card)] hover:text-[var(--accent)]";

export default function SocialLinks({
  linkClassName = "",
  iconClassName,
}: {
  linkClassName?: string;
  iconClassName: string;
}) {
  return (
    <>
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
          className={`${linkClassName} ${ICON_LINK}`}
        >
          <Icon className={iconClassName} />
        </a>
      ))}
    </>
  );
}
