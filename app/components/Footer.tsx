import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer
      style={{ borderColor: "var(--border)" }}
      className="mt-24 pt-8 pb-16 border-t flex items-center justify-between gap-5"
    >
      <p style={{ color: "var(--muted)" }} className="font-mono text-[11px]">
        © 2026 Krush Patel
      </p>
      {/* -mr-2 cancels the last link's p-2, so the envelope's edge lines up
          with the rule above rather than sitting 8px short of it. */}
      <div className="flex items-center gap-1 -mr-2">
        <SocialLinks iconClassName="w-[19px] h-[19px]" />
      </div>
    </footer>
  );
}
