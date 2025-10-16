/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "img.youtube.com"],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
