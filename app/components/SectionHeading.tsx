export default function SectionHeading({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  const labelId = `${id}-label`;

  return (
    /* No scroll-margin here: `html { scroll-padding-top: 5rem }` already
       clears the 56px header. The two used to stack, landing headings 160px
       down instead of 80. */
    <div id={id}>
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
