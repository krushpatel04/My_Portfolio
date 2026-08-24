import Image from "next/image";

export default function About() {
  return (
    <article className="pt-28 pb-16">
      <h1
        style={{ color: "var(--fg)" }}
        className="text-4xl sm:text-5xl font-bold tracking-tight leading-none"
      >
        About
      </h1>

      <Image
        src="/My_Portfolio/headShot.jpeg"
        alt="Krush Patel"
        width={160}
        height={200}
        className="rounded-xl object-cover mt-8"
        unoptimized
        priority
      />

      <div
        style={{ color: "var(--body)" }}
        className="mt-8 flex flex-col gap-4 text-sm leading-relaxed max-w-xl"
      >
        <p>
          I&rsquo;ve been running businesses since high school. Not helping out
          &mdash; scheduling, hiring, vendor calls, and fixing the POS when it
          goes down on a Saturday afternoon. There are three now: Big Creek
          Convenience, the corner store I grew up in; a Tropical Smoothie Cafe
          with about fifteen employees; and Signarama, a sign shop. Together
          they do $1.5M+ a year and employ more than twenty people.
        </p>
        <p>
          That&rsquo;s most of why I build software the way I do. I&rsquo;ve
          been the person stuck with the bad system &mdash; the spreadsheet four
          people edit at once, the process that only works because someone
          remembers it. So when I build something, I start with whoever has to
          use it.
        </p>
        <p>
          That&rsquo;s where both of my startups came from. For Aeigis, a
          firefighter safety tracker, I interviewed more than a dozen
          firefighters before writing any code and came away with letters of
          intent from two departments. For Parcel, I sat with insurance
          adjusters and watched how they actually put a claim packet together.
          Both made accelerator finals at Ohio State &mdash; Aeigis top 11 of
          60, Parcel top 6 of 50+ with $5,000 in funding.
        </p>
        <p>
          These days I&rsquo;m a full-stack developer at IGS Energy, working on
          the CRM their sales and service teams use every day &mdash; React and
          TypeScript on the front, ASP.NET Core and SQL Server behind it. Before
          that I co-oped at Emerson on an internal CRM serving 5,000+ employees.
          I graduate from Ohio State in May 2027 with a B.S. in Computer Science
          and Engineering.
        </p>
      </div>

      <h2
        style={{ color: "var(--fg)" }}
        className="text-2xl font-bold tracking-tight mt-14"
      >
        Outside of work
      </h2>

      <div
        style={{ color: "var(--body)" }}
        className="mt-6 flex flex-col gap-4 text-sm leading-relaxed max-w-xl"
      >
        <p>
          I don&rsquo;t sit still much. I lift regularly, ski in the winter, and
          I&rsquo;ll play just about anything &mdash; soccer, pickleball, or
          just go for a run. I&rsquo;m into cars, so a fair amount of my free
          time is spent driving somewhere, usually to one of the shops.
        </p>
        <p>I built my own PC and I game on it most nights.</p>
        <p>
          Right now I&rsquo;m working through Gen V. All-time it&rsquo;s Game of
          Thrones, then Avatar: The Last Airbender, then Peaky Blinders.
        </p>
      </div>
    </article>
  );
}
