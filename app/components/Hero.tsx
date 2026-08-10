import Image from "next/image";

export default function Hero() {
  return (
    <section id="top" className="pt-28 pb-16">
      <div className="flex flex-col sm:flex-row items-start gap-8">
        <Image
          src="/My_Portfolio/headShot.jpeg"
          alt="Krush Patel"
          width={160}
          height={200}
          className="rounded-xl object-cover shrink-0"
          unoptimized
          priority
        />

        <div>
          <h1
            style={{ color: "var(--fg)" }}
            className="text-4xl sm:text-5xl font-bold tracking-tight leading-none mb-3"
          >
            Krush Patel
          </h1>

          <p
            style={{ color: "var(--accent)" }}
            className="text-base font-bold mb-4"
          >
            Software Developer &middot; CSE @ Ohio State
          </p>

          <p
            style={{ color: "var(--body)" }}
            className="text-sm leading-relaxed max-w-md"
          >
            Senior CSE student at OSU building software and managing multiple
            businesses. Currently a full-stack software developer Intern at IGS
            Energy and previously co-oped at Emerson. On the side I help manage
            my family businesses and have co-founded two startup finalists at
            OSU accelerators.
          </p>
        </div>
      </div>
    </section>
  );
}
