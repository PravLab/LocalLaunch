const isDev = process.env.NODE_ENV === "development";

const baseConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    NEXT_PUBLIC_BASE_DOMAIN: process.env.NEXT_PUBLIC_BASE_DOMAIN,
  },
};

export default async () => {
  const { default: withPWA } = await import("next-pwa");
  return withPWA({
    ...baseConfig,
    pwa: {
      dest: "public",
      register: true,
      skipWaiting: true,
      disable: isDev,
    },
  });
};
