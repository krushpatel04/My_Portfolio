import PillLink from "./PillLink";

export default function Footer() {
  return (
    <footer
      style={{ borderColor: "var(--border)" }}
      className="mt-24 pt-8 pb-16 border-t flex flex-col sm:flex-row sm:items-center gap-5 sm:justify-between"
    >
      <p style={{ color: "var(--muted)" }} className="font-mono text-[11px]">
        © 2026 Krush Patel
      </p>
      <div className="flex flex-wrap gap-3">
        <PillLink href="https://www.linkedin.com/in/krush-patel-54324a2a5">
          LinkedIn ↗
        </PillLink>
        <PillLink href="https://github.com/krushpatel04">GitHub ↗</PillLink>
        <PillLink href="mailto:patel.5355@osu.edu" external={false}>
          Email
        </PillLink>
      </div>
    </footer>
  );
}
