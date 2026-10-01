import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 requires an explicit allowlist. The default served quality is 75,
    // which visibly softens photographs, so 90 is allowed for image use.
    qualities: [75, 90],
  },
};

export default nextConfig;
