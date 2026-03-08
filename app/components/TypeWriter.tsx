"use client";

import { useState, useEffect, useRef } from "react";

const FULL_TEXT = "Hello, I'm Krush!";
const TYPE_SPEED = 110;       // ms per character
const START_DELAY = 1400;     // pause before first keystroke
const MID_PAUSE = 500;        // pause between "Hello," and "I'm Krush!"
const PAUSE_AT = 7;           // character index to pause at ("Hello, ")

export default function TypeWriter({ onDone }: { onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let i = 0;

    const typeNext = () => {
      if (i >= FULL_TEXT.length) {
        onDoneRef.current?.();
        return;
      }
      i++;
      setDisplayed(FULL_TEXT.slice(0, i));
      const delay = i === PAUSE_AT ? MID_PAUSE : TYPE_SPEED;
      timerRef.current = setTimeout(typeNext, delay);
    };

    timerRef.current = setTimeout(typeNext, START_DELAY);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <span>
      {displayed}
      <span className="cursor-blink" style={{ color: "var(--accent)", marginLeft: "2px" }}>
        |
      </span>
    </span>
  );
}
