import Link from "next/link";
import LoginForm from "./ui/login-form";
import { Providers } from "./providers";

export default function Home() {
  return (
    <Providers>
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl mb-8">Bienvenido a AYNI</h1>
          <LoginForm />
          <Link href="/dashboard" className="inline-block text-white py-3 px-6 rounded-lg text-xl hover:bg-custom transition-colors duration-300">
            Ir al dashboard
          </Link>
        </div>
      </main>
    </Providers>
  );
}