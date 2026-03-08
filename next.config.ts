import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: "/My_Portfolio",
  assetPrefix: "/My_Portfolio",
};

export default nextConfig;
