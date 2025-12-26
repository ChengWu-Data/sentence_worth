import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  allowedDevOrigins: ["http://localhost:3000", "http://192.168.0.115:3000"],
};

export default nextConfig;
