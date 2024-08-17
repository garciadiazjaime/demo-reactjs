/** @type {import('next').NextConfig} */
import "dotenv/config";

const nextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
};

export default nextConfig;
