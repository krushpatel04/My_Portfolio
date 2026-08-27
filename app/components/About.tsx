import Image from "next/image";

/* Masthead facts, set opposite the page title. Kept to things that are true
 * on the résumé — a location line would fit here too, but Krush splits time
 * between Columbus and the shops in Parma, so it is left off rather than
 * guessed. */
const FACTS: { label: string; href?: string }[] = [
  { label: "OSU ’27, CSE" },
  { label: "IGS Energy" },
  { label: "patel.5355@osu.edu", href: "mailto:patel.5355@osu.edu" },
];

export default function About() {
  return (
    <article className="pt-28 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
        <h1
          style={{ color: "var(--fg)" }}
          className="text-4xl sm:text-5xl font-bold tracking-tight leading-none"
        >
          About
        </h1>

        {/* pt-1.5 optically aligns the first line with the cap height of the
            title, which `items-start` alone sets slightly too high. */}
        <ul className="flex flex-col gap-1.5 sm:pt-1.5 sm:text-right">
          {FACTS.map((f) => (
            <li
              key={f.label}
              style={{ color: "var(--muted)" }}
              className="font-mono text-[11px] leading-snug"
            >
              {f.href ? (
                <a
                  href={f.href}
                  style={{ color: "var(--accent)" }}
                  className="border-b border-transparent transition-colors hover:border-[var(--accent)]"
                >
                  {f.label}
                </a>
              ) : (
                f.label
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Two columns on desktop, one on mobile. Plain grid in normal document
          flow; both columns grow to fit their content. */}
      <div className="mt-9 grid grid-cols-1 sm:grid-cols-[168px_1fr] gap-7 sm:gap-10 items-start">
        <div>
          <Image
            src="/My_Portfolio/headShot.jpeg"
            alt="Krush Patel"
            /* 168x252 is the source's true 2:3 ratio (320x480). Tailwind
             * preflight forces `img { height: auto }`, so a mismatched height
             * attribute reserves the wrong box and shifts the page on load. */
            width={168}
            height={252}
            className="rounded-xl"
            unoptimized
            priority
          />
        </div>

        <div className="flex flex-col gap-9">
          <div
            style={{ color: "var(--body)" }}
            className="flex flex-col gap-4 text-sm leading-relaxed"
          >
            <p>
              Hi! I&rsquo;m Krush, an undergrad CSE student at The Ohio State
              University and a full-stack developer at IGS Energy, working on
              the CRM their sales and service teams use every day.
            </p>
            <p>
              I&rsquo;ve also been running my family&rsquo;s three businesses
              since 2019 &mdash; a corner store, a Tropical Smoothie Cafe, and a
              sign shop. That&rsquo;s most of why I build software the way I do:
              I&rsquo;ve been the person stuck with the bad system, so I start
              with whoever has to use it.
            </p>
          </div>

          <div className="flex flex-col gap-4.5">
            <h2
              style={{ color: "var(--fg)" }}
              className="text-2xl font-bold tracking-tight"
            >
              Outside of work
            </h2>
            <div
              style={{ color: "var(--body)" }}
              className="flex flex-col gap-4 text-sm leading-relaxed"
            >
              <p>
                I don&rsquo;t sit still much. I lift, I ski in the winter, and
                I&rsquo;ll play just about anything you put in front of me.
                I&rsquo;m into cars, I built the PC I game on most nights, and
                right now I&rsquo;m working through Gen V.
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
