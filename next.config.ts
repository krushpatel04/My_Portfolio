import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/My_Portfolio",
  assetPrefix: "/My_Portfolio",
  images: { unoptimized: true },
};

export default nextConfig;
