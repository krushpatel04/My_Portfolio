"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      style={{ color: "var(--muted)" }}
      className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--border)] text-lg"
    >
      {dark ? "☀" : "☽"}
    </button>
  );
}
