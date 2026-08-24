import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/My_Portfolio",
  assetPrefix: "/My_Portfolio",
  /* Emits nested routes as `about/index.html` rather than `about.html`, which
   * is what GitHub Pages resolves reliably. */
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
