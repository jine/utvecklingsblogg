import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    output: "standalone",
    images: {
        // Allow local uploaded images to be served
        // Since these are user uploads, we can't optimize them at build time
        unoptimized: true,
    },
};

export default nextConfig;
