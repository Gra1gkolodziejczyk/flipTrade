'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-provider';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Settings, LogOut, Menu, User } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const navigationItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'Historique des trades', href: '/history' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <header className="py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm">
                  FT
                </div>
                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  FlipTrade
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                    pathname === item.href
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-700 dark:text-gray-200'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <ThemeToggle />

              {isAuthenticated ? (
                <>
                  <div className="relative hidden md:block" ref={userMenuRef}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {user?.avatar && (
                        <>
                          <Image
                            // src={user?.avatar ?? '/avatar.jpg'}
                            src={'/avatar.jpg'}
                            alt="User"
                            width={28}
                            height={28}
                            className="rounded-full h-7 w-7"
                          />
                        </>
                      )}
                    </Button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.username}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.email}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Balance:{' '}
                            <span className="font-extrabold text-gray-900 dark:text-white">
                              {user?.balance?.toFixed(2) || '0.00'} €
                            </span>
                          </p>
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4 mr-3" />
                          Profil
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Paramètres
                        </Link>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Déconnexion
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="hidden md:flex items-center space-x-2">
                    <Link href="/sign-in">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                      >
                        Se connecter
                      </Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                      >
                        S&apos;inscrire
                      </Button>
                    </Link>
                  </div>
                </>
              )}

              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="w-9 h-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </nav>

          {isMobileMenuOpen && (
            <div className="md:hidden absolute left-0 right-0 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-b-lg border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-4">
                {navigationItems.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-4 py-2 rounded-md ${
                      pathname === item.href
                        ? 'bg-gray-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400'
                        : ''
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex items-center space-x-3 px-4 py-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/avatar.jpg" alt="User" />
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.username}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.balance?.toFixed(2) || '0.00'} €
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profil
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Paramètres
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Déconnexion
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                      <Link href="/sign-in">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-700 dark:text-gray-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Se connecter
                        </Button>
                      </Link>
                      <Link href="/sign-up">
                        <Button
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          S&apos;inscrire
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </header>
      </div>
    </div>
  );
}
