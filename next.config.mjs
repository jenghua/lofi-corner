/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/lofi-corner",
  assetPrefix: "/lofi-corner/",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
