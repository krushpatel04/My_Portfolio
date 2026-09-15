export default function Hero() {
  return (
    <section id="top" className="pt-28 pb-16">
      <h1
        style={{ color: "var(--fg)" }}
        className="text-4xl sm:text-5xl font-bold tracking-tight leading-none mb-3"
      >
        Krush Patel
      </h1>

      <p style={{ color: "var(--accent)" }} className="text-base font-bold mb-4">
        Software Developer &middot; CSE @ Ohio State
      </p>

      <p
        style={{ color: "var(--body)" }}
        className="text-base leading-[1.7] max-w-xl"
      >
        I&rsquo;m a senior studying Computer Science and Engineering at Ohio
        State. I&rsquo;m a full-stack software developer intern at IGS Energy,
        where I work on the internal CRM the company&rsquo;s sales and service
        teams rely on, and I previously completed a software development co-op
        at Emerson. I&rsquo;ve also helped run my family&rsquo;s three
        businesses since 2019 and co-founded two startups that went through OSU
        accelerator programs.
      </p>
    </section>
  );
}
