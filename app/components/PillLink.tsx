export default function PillLink({
  href,
  external = true,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={{ color: "var(--accent)", borderColor: "var(--border)" }}
      className="text-sm border px-4 py-1.5 rounded-full transition-colors hover:bg-[var(--card)]"
    >
      {children}
    </a>
  );
}
