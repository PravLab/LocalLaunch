// app/providers.js
'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function AuthProvider({ children }) {
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_IN') {
          const urlParams = new URLSearchParams(window.location.search);
          const redirectTo = urlParams.get('redirectTo');
          if (redirectTo) router.push(redirectTo);
        }
      }
    );
    return () => subscription?.unsubscribe();
  }, [router]);

  return <>{children}</>;
}