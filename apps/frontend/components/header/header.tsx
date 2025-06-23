'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  User,
} from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Acheter', href: '/buy', icon: TrendingUp },
    { name: 'Vendre', href: '/sell', icon: TrendingDown },
    { name: 'Historique', href: '/history', icon: BarChart3 },
  ];

  return (
    <header className="top-0 z-50 w-full border-b bg-white dark:bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo et nom de l'application */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold text-sm">
                FT
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                FlipTrade
              </h1>
            </div>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map(item => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Button>
              );
            })}
          </nav>

          {/* Actions droite */}
          <div className="flex items-center space-x-2">
            {/* Toggle thème */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-9 h-9"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Menu utilisateur */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="rounded-full w-9 h-9"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/avatar.jpg" alt="User" />
                  <AvatarFallback>
                    <User className="h-4 w-4 text-white dark:text-black" />
                  </AvatarFallback>
                </Avatar>
              </Button>

              {/* Dropdown menu utilisateur */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-background border shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <a
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profil
                    </a>
                    <a
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Paramètres
                    </a>
                    <div className="border-t my-1"></div>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-accent">
                      <LogOut className="h-4 w-4 mr-3" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Menu mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden rounded-full w-9 h-9"
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map(item => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className="justify-start flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
