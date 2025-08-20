const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  images: {
    domains: ["ka7jrgzxc9m10i0t.public.blob.vercel-storage.com"],
  },
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    NEXT_PUBLIC_BASE_DOMAIN: process.env.NEXT_PUBLIC_BASE_DOMAIN,
  },
};

// 👇 async wrapper needed in .mjs
export default async function config() {
  const { default: withPWA } = await import("next-pwa");

  return withPWA({
    ...nextConfig,
    pwa: {
      dest: "public",
      register: true,
      skipWaiting: true,
      disable: isDev,
    },
  });
}
