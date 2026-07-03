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
      className="text-sm border px-4 py-1.5 rounded-lg transition-opacity hover:opacity-70"
    >
      {children}
    </a>
  );
}
