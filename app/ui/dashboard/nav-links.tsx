'use client';
import { UserGroupIcon, HomeIcon, CalendarDaysIcon, PlusIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useState } from 'react';

interface NavLink {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  sublinks?: NavLink[];
}

const links: NavLink[] = [
  { name: 'Inicio', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Pacientes',
    href: '',
    icon: UserGroupIcon,
    sublinks: [
      { name: 'Nuevo Paciente', href: '/dashboard/patients/add', icon: PlusIcon },
      { name: 'Lista de Pacientes', href: '/dashboard/patients/list', icon: ListBulletIcon },
    ],
  },
  { name: 'Citas', href: '/dashboard/appointments', icon: CalendarDaysIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [showSublinks, setShowSublinks] = useState<string | null>(null);

  const toggleSublinks = (link: NavLink) => {
    if (link.sublinks) {
      setShowSublinks(showSublinks === link.href ? null : link.href);
    }
  };

  return (
    <div className="relative">
      <div className="bg-transparent text-white p-3">
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <div key={link.name}>
              <Link
                href={link.href}
                className={clsx(
                  'flex h-[48px] items-center justify-center gap-2 text-orange rounded-md p-3 text-sm font-medium transition duration-300 hover:bg-contrast1 hover:text-orange md:flex-none md:justify-start md:p-2 md:px-3',
                  {
                    'text-orange bg-contrast2': pathname === link.href,
                  }
                )}
                onClick={() => toggleSublinks(link)}
              >
                <LinkIcon className="w-6" />
                <p className="hidden md:block">{link.name}</p>
              </Link>
              {showSublinks === link.href && link.sublinks && (
                <div className="ml-6">
                  {link.sublinks.map((sublink) => (
                    <Link
                      key={sublink.name}
                      href={sublink.href}
                      className={clsx(
                        'flex h-[36px] mt-2 items-center gap-2 rounded-md p-3 text-orange text-sm font-medium transition duration-300 hover:bg-contrast1 hover:text-orange md:justify-start md:p-2 md:px-5',
                        {
                          'text-orange bg-contrast1': pathname === sublink.href,
                        }
                      )}
                    >
                      <sublink.icon className="w-6" />
                      <p className="hidden md:block">{sublink.name}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>


  );
}