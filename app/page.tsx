'use client';

import Link from "next/link";
import LoginForm from "./ui/login-form";
import { AppProps } from 'next/app';
import { AuthProvider } from "./context/authcontext";

export default function Home({Component, pageProps}: AppProps) {
  return (
    <AuthProvider>
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl mb-8">Bienvenido a AYNI</h1>
          <LoginForm {...pageProps}/>
          <Link href="/dashboard"className="inline-block text-white py-3 px-6 rounded-lg text-xl hover:bg-custom transition-colors duration-300">
              Ir al dashboard
          </Link>
        </div>
      </main>
    </AuthProvider>
  );
}
