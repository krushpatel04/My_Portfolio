"use client";

import { useState } from "react";
import Game from "./components/Game";
import Portfolio from "./components/Portfolio";

type Route = "choose" | "game" | "portfolio";

export default function Home() {
  const [route, setRoute] = useState<Route>("choose");

  if (route === "game")      return <Game onExit={() => setRoute("portfolio")} />;
  if (route === "portfolio") return <Portfolio />;

  return (
    <div
      style={{ background: "var(--bg)", color: "var(--fg)" }}
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
    >
      <p style={{ color: "var(--muted)" }} className="text-sm mb-2 tracking-wide">
        Welcome to the portfolio of
      </p>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2" style={{ color: "var(--fg)" }}>
        Krush Patel
      </h1>
      <p style={{ color: "var(--accent)" }} className="text-sm font-medium mb-12">
        Software Developer &middot; CS @ Ohio State
      </p>

      <p style={{ color: "var(--muted)" }} className="text-sm mb-8">
        How would you like to explore?
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setRoute("game")}
          style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
          className="group border px-8 py-4 rounded-xl text-sm font-medium transition-all hover:bg-[var(--accent)] hover:text-[var(--bg)] text-left"
        >
          <div className="font-semibold mb-1">✦ The Experience</div>
          <div style={{ color: "inherit" }} className="text-xs opacity-70">
            An interactive story
          </div>
        </button>

        <button
          onClick={() => setRoute("portfolio")}
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          className="group border px-8 py-4 rounded-xl text-sm font-medium transition-all hover:bg-[var(--card)] text-left"
        >
          <div className="font-semibold mb-1" style={{ color: "var(--fg)" }}>→ The Resume</div>
          <div className="text-xs opacity-70">
            Just the portfolio
          </div>
        </button>
      </div>
    </div>
  );
}
