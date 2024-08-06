'use client';
import SideNav from '@/app/ui/dashboard/sidenav';
import { AuthProvider } from '@/app/context/authcontext';
import { useState } from 'react';


export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-first">
        <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-first">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:bg-gray-600"
                onClick={() => setSidebarOpen(false)}
              >
              </button>
            </div>
            <SideNav onClose={() => setSidebarOpen(false)} />
          </div>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
          </div>
        </div>

        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 bg-second">
            <SideNav onClose={() => {}} />
          </div>
        </div>

        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <div className="md:hidden p-1">
            <button
              className="p-2 rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(true)}
            >
            </button>
          </div>
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}