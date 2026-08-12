import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";

const satoshi = localFont({
  variable: "--font-satoshi",
  display: "swap",
  src: [
    { path: "./fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
});

const SITE = "https://krushpatel04.github.io/My_Portfolio";

/* Shown under the title in link previews — worth carrying the things that
 * actually differentiate, not just the job title. */
const DESCRIPTION =
  "Senior CSE student at Ohio State. Full-stack developer at IGS Energy, " +
  "co-founder of two OSU accelerator finalists, and operator of three " +
  "family businesses.";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE}/`),
  title: "Krush Patel — Software Developer",
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: `${SITE}/`,
    siteName: "Krush Patel",
    title: "Krush Patel — Software Developer",
    description: DESCRIPTION,
    /* Absolute on purpose: metadataBase resolution against a URL that has a
     * path is easy to get wrong, and a broken OG image fails silently. */
    images: [
      {
        url: `${SITE}/og.png`,
        width: 1200,
        height: 630,
        alt: "Krush Patel — Software Developer, CSE @ Ohio State",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krush Patel — Software Developer",
    description: DESCRIPTION,
    images: [`${SITE}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${satoshi.variable} antialiased`}>
        <SmoothScroll>
          <div className="grain" aria-hidden="true" />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
