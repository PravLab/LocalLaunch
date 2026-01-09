const nextConfig = {
  images: {
    domains: ["ka7jrgzxc9m10i0t.public.blob.vercel-storage.com"],
  },
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },
};

export default nextConfig;
