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
        className="text-sm leading-relaxed max-w-xl"
      >
        Senior CSE student at OSU building software and managing multiple
        businesses. Currently a full-stack software developer Intern at IGS
        Energy and previously co-oped at Emerson. On the side I help manage my
        family businesses and have co-founded two startup finalists at OSU
        accelerators.
      </p>
    </section>
  );
}
