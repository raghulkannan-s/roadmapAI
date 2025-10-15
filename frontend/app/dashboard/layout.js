'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useAuthStore from '@/store/auth';

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser({
        provider_id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      });
    }
  }, [session, status, setUser]);

  return <>{children}</>;
}
