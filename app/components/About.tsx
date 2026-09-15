import Image from "next/image";

/* Masthead facts, set opposite the page title. Kept to things that are true
 * on the résumé — a location line would fit here too, but Krush splits time
 * between Columbus and the shops in Parma, so it is left off rather than
 * guessed. */
const FACTS: { label: string; href?: string }[] = [
  { label: "OSU ’27, CSE" },
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
              className="font-mono text-[12px] leading-snug"
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

        {/* Krush's own words, verbatim. The paragraph breaks are the only
            edit: as one block it ran ~14 lines in this column. */}
        <div
          style={{ color: "var(--body)" }}
          className="flex flex-col gap-4 text-base leading-[1.7]"
        >
          <p>
            Hey! I&rsquo;m Krush, a Computer Science and Engineering student at
            Ohio State. I&rsquo;m originally from the Cleveland area, which
            means I&rsquo;ve had plenty of practice getting my hopes up for our
            sports teams every season (and plenty of practice being let down).
          </p>
          <p>
            I don&rsquo;t sit still much, so outside of school and work,
            you&rsquo;ll find me on the slopes in the winter and on a soccer
            field in the summer. Most days I&rsquo;m lifting too. I&rsquo;m a
            huge car guy, so if you bring up cars, you might be stuck with me
            for a while lol.
          </p>
          <p>
            At night I&rsquo;m usually back to my gaming roots (Overwatch right
            now) or catching up on a show (currently Gen V). This year I&rsquo;m
            also playing fantasy football for the first time, so wish me luck!
          </p>
        </div>
      </div>
    </article>
  );
}
