export default function SectionHeading({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  return (
    <div id={id} className="scroll-mt-20">
      <p
        style={{ color: "var(--muted)" }}
        className="font-mono text-[11px] tracking-[0.14em] uppercase"
      >
        {label}
      </p>
      <hr style={{ borderColor: "var(--border)" }} className="mt-3 border-t" />
    </div>
  );
}
