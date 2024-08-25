'use client';

import { AuthProvider, useAuth } from "./context/authcontext";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const publicRoutes = ['/'];

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && !publicRoutes.includes(pathname)) {
        router.push('/');
      } else if (user && pathname === '/') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return <>{children}</>;
}

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RouteGuard>
        {children}
      </RouteGuard>
    </AuthProvider>
  );
}