'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, LogOut, Sun, Moon, User, Search, Bell } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/', active: true },
    { name: 'Trades', href: '/trades', active: false },
    { name: 'Analytics', href: '/analytics', active: false },
    { name: 'Settings', href: '/settings', active: false },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-primary to-chart-1 text-primary-foreground shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo et branding */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur text-primary-foreground font-bold text-sm">
                FT
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-primary-foreground leading-tight">
                  FlipTrade
                </h1>
                <span className="text-xs text-primary-foreground/70 font-medium leading-none">
                  Trading Platform
                </span>
              </div>
            </div>
          </div>

          {/* Navigation centrale */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map(item => (
              <a
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary-foreground/80 relative ${
                  item.active
                    ? 'text-primary-foreground'
                    : 'text-primary-foreground/60'
                }`}
              >
                {item.name}
                {item.active && (
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-foreground rounded-full"></div>
                )}
              </a>
            ))}
          </nav>

          {/* Actions droite */}
          <div className="flex items-center space-x-3">
            {/* Recherche */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg w-8 h-8 hover:bg-white/10 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-lg w-8 h-8 hover:bg-white/10 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <Bell className="h-4 w-4" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-chart-4 rounded-full"></div>
            </Button>

            {/* Solde utilisateur */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-white/10 backdrop-blur border border-white/20 rounded-lg">
              <div className="w-1.5 h-1.5 bg-chart-4 rounded-full"></div>
              <span className="text-sm font-semibold text-primary-foreground">
                €12,350.75
              </span>
            </div>

            {/* Toggle thème */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg w-8 h-8 hover:bg-white/10 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Avatar et nom utilisateur */}
            <div className="relative flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 px-2 py-1 h-8 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Avatar className="h-6 w-6 border border-white/30">
                  <AvatarImage src="/avatar.jpg" alt="User" />
                  <AvatarFallback className="bg-white/20 text-primary-foreground font-semibold text-xs">
                    JD
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium text-primary-foreground">
                  J. Doe
                </span>
              </Button>

              {/* Dropdown menu utilisateur */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-10 w-56 rounded-xl bg-popover border border-border shadow-lg ring-1 ring-black/5 animate-in slide-in-from-top-2">
                  <div className="p-3 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatar.jpg" alt="User" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                          JD
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-popover-foreground">
                          John Doe
                        </p>
                        <p className="text-xs text-muted-foreground">
                          john@example.com
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <a
                      href="/profile"
                      className="flex items-center px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors rounded-lg mx-1"
                    >
                      <User className="h-4 w-4 mr-3 text-muted-foreground" />
                      Mon Profil
                    </a>
                    <a
                      href="/settings"
                      className="flex items-center px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors rounded-lg mx-1"
                    >
                      <Settings className="h-4 w-4 mr-3 text-muted-foreground" />
                      Paramètres
                    </a>
                    <div className="border-t border-border my-1"></div>
                    <button className="flex items-center w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors rounded-lg mx-1">
                      <LogOut className="h-4 w-4 mr-3" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
