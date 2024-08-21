'use client';

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useAuth } from '@/app/context/authcontext'
import { useState } from 'react';

export default function LoginForm() {
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email, password);
    login(email, password);
  };

  if (loading) return <p className="text-primary text-center py-4">Cargando...</p>;

  if (user) return <p className="text-primary text-center py-4">Bienvenido: {user.username}</p>;

  return (
    <form className="max-w-md mx-auto space-y-3 bg-first p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
      <div className="flex-1 rounded-lg bg-second px-6 pb-4 pt-8">
        <h1 className={`mb-6 text-2xl text-primary text-center`}>
          Ingrese sus credenciales
        </h1>
        <div className="w-full space-y-4">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-primary"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                id="email"
                type="email"
                name="email"
                placeholder="Ingrese su email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 peer-focus:text-blue-500" />
            </div>
          </div>
          <div>
            <label
              className="mb-2 block text-sm font-medium text-primary"
              htmlFor="password"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                id="password"
                type="password"
                name="password"
                placeholder="Ingrese su contraseña"
                required
                onChange={(e) => setPassword(e.target.value)}
                minLength={4}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 peer-focus:text-blue-500" />
            </div>
          </div>
        </div>
        <LoginButton />
        <div className="flex h-8 items-end space-x-1">
          {/* Add form errors here */}
        </div>
      </div>
    </form>
  );
}

function LoginButton() {
  return (
    <Button className="mt-6 w-full bg-orange py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105" type="submit">
      Ingresar <ArrowRightIcon className="ml-2 h-5 w-5 inline" />
    </Button>
  );
}