"use client"
import { useState } from 'react';
import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AyniLogo from '@/app/ui/ayni-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/authcontext';

interface SideNavProps {
  onClose: () => void;
}

export default function SideNav({ onClose }: SideNavProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="flex flex-col px-3 py-4 md:px-2 h-full bg-first">
      <div className="absolute left-64 top-0 h-full border-r-2 border-orange"></div>
      <Link
        className="mb-2 flex h-20 items-end justify-start p-4 md:h-40"
        href="/"
      >
        <div className="w-32 md:w-40">
          <AyniLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow md:block"></div>
        <form>
          <button
            type="button"
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md text-orange p-3 text-sm font-medium hover:bg-contrast1 hover:text-orange md:flex-none md:justify-start md:p-2 md:px-3"
            onClick={handleSignOut}
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}