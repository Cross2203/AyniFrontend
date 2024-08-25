import Link from "next/link";
import LoginForm from "./ui/login-form";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl mb-8">Bienvenido a AYNI</h1>
        <LoginForm />
      </div>
    </main>
  );
}