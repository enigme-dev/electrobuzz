/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["assets.electrobuzz.id"],
  },
};

module.exports = nextConfig;
