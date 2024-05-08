/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["assets.electrobuzz.id", "lh3.googleusercontent.com"],
  },
};

module.exports = nextConfig;
