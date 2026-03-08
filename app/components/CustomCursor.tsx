"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const x = useSpring(mouseX, { stiffness: 350, damping: 28 });
  const y = useSpring(mouseY, { stiffness: 350, damping: 28 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      className="fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[9999] mix-blend-difference bg-white"
    />
  );
}
