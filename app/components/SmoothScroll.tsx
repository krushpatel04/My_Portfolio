"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    /* stopInertiaOnNavigate: clicking an internal link cancels any wheel or
       trackpad momentum still in flight. Without it, Lenis ignores native
       scrolls while easing (isScrolling === "smooth") and drags the page back
       to its old target — a nav click within ~1s of a swipe jumped to the
       section, then slid ~450px past it. */
    const lenis = new Lenis({ duration: 1.2, stopInertiaOnNavigate: true });

    /* Forward Lenis scroll ticks as native scroll events so framer-motion's
       useScroll (and any window scroll listeners) receive updates. */
    lenis.on("scroll", () => {
      window.dispatchEvent(new Event("scroll", { bubbles: false }));
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
