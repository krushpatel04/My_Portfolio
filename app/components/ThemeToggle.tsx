"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") !== "light");
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    if (html.getAttribute("data-theme") === "light") {
      html.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
      setDark(true);
    } else {
      html.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      setDark(false);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{ color: "var(--muted)" }}
      className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--card)] text-lg"
    >
      {dark ? "☀" : "☽"}
    </button>
  );
}
