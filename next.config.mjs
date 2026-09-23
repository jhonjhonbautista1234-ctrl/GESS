/** @type {import('next').NextConfig} */
const project = process.env.NEXT_PUBLIC_SUPABASE_URL;
const nextConfig = {
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
  images: { remotePatterns: project ? [{ protocol: "https", hostname: new URL(project).hostname, pathname: "/storage/v1/object/public/gess-media/**" }] : [] },
};

export default nextConfig;
