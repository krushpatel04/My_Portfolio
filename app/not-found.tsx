import Link from "next/link";

export default function NotFound() {
  return (
    <section className="pt-28 pb-16">
      <h1
        style={{ color: "var(--fg)" }}
        className="text-4xl sm:text-5xl font-bold tracking-tight leading-none mb-3"
      >
        Page not found
      </h1>

      <p
        style={{ color: "var(--body)" }}
        className="text-sm leading-relaxed max-w-xl mb-6"
      >
        The page you&rsquo;re looking for doesn&rsquo;t exist.{" "}
        <Link
          href="/"
          style={{ color: "var(--accent)" }}
          className="font-bold hover:underline"
        >
          Go back home
        </Link>
        .
      </p>
    </section>
  );
}
