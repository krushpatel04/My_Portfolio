export default function Tag({ label }: { label: string }) {
  return (
    <span
      style={{ color: "var(--accent)", borderColor: "color-mix(in srgb, var(--accent) 38%, transparent)" }}
      className="font-mono text-[10px] tracking-wide border rounded-full px-2 py-0.5"
    >
      {label}
    </span>
  );
}
