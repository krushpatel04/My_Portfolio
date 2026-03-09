import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: isGithubActions ? "/My_Portfolio" : "",
  assetPrefix: isGithubActions ? "/My_Portfolio" : "",
};

export default nextConfig;
