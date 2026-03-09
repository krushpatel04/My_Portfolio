"use client";

import { useState } from "react";
import Game from "./components/Game";
import Portfolio from "./components/Portfolio";

export default function Home() {
  const [showGame, setShowGame] = useState(true);

  return showGame
    ? <Game onExit={() => setShowGame(false)} />
    : <Portfolio />;
}
