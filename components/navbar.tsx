'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrentUser } from '@/hooks/use-current-user';
import { UserButton } from './auth/user-button';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const { user } = useCurrentUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  let callbackUrl = pathname;

  if (searchParams.toString()) {
    callbackUrl += '?${searchParams.toString()}';
  }

  const loginHref = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Generate Recipes', href: '/generate' },
    { name: 'Saved Recipes', href: '/saved' },
    !user ? { name: 'Login', href: loginHref } : { name: 'User', href: '' },
  ];

  return (
    <motion.header
      className={`sticky top-0 z-50 w-full border-b ${isOpen ? 'bg-white' : 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <nav className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="flex items-center justify-between h-16">
          <div>
            <Link href="/" className="text-xl font-bold">
              PlatePilot
            </Link>
          </div>

          <div className="hidden md:flex  items-center space-x-4">
            {navItems.map((nav) =>
              nav.name === 'User' ? (
                <UserButton key={nav.name} />
              ) : (
                <Link
                  href={nav.href}
                  key={nav.name}
                  className="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {nav.name}
                </Link>
              ),
            )}
          </div>

          <div className="md:hidden">
            <button
              className="md:hidden transition-transform duration-300 hover:scale-110"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`md:hidden absolute top-full left-0 right-0 ${theme === 'light' ? 'bg-white' : 'bg-white'} shadow-md overflow-hidden py-4`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col space-y-4">
                {navItems.map((nav) =>
                  nav.name === 'User' ? (
                    <UserButton key={nav.name} />
                  ) : (
                    <Link
                      href={nav.href}
                      key={nav.name}
                      className="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      {nav.name}
                    </Link>
                  ),
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
