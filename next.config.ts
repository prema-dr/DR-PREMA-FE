import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Admin uploads (service, blog, gallery, testimonial, video images) are served from Cloudinary.
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
