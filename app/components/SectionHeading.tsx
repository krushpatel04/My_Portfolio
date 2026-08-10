export default function SectionHeading({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  const labelId = `${id}-label`;

  return (
    <div id={id} className="scroll-mt-20">
      <h2
        id={labelId}
        style={{ color: "var(--muted)" }}
        className="font-mono text-[11px] tracking-[0.14em] uppercase"
      >
        {label}
      </h2>
      <hr style={{ borderColor: "var(--border)" }} className="mt-3 border-t" />
    </div>
  );
}
