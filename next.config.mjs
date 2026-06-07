/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(isGithubPages && {
    basePath: "/lofi-corner",
    assetPrefix: "/lofi-corner/",
  }),
};

export default nextConfig;
