'use client';

import { AuthProvider } from "./context/authcontext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}