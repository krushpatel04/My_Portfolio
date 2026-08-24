import type { Metadata } from "next";
import About from "../components/About";

export const metadata: Metadata = {
  title: "About — Krush Patel",
  description:
    "Software developer and CSE student at Ohio State who has been running " +
    "three family businesses since 2019.",
};

export default function AboutPage() {
  return <About />;
}
