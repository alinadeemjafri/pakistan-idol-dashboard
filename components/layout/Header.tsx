'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Calendar, Home, List, Play, Tv, Users, Settings, User } from 'lucide-react';
import { AuthUser } from '@/lib/auth';

interface HeaderProps {
  user: AuthUser | null;
}

const navigation = [
  { name: 'Today', href: '/', icon: Home },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Episodes', href: '/episodes', icon: List },
  { name: 'Contestants', href: '/contestants', icon: User },
  { name: 'Recording', href: '/recording', icon: Play },
  { name: 'Airing', href: '/airing', icon: Tv },
];

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-4">
              <div className="w-12 h-12 relative">
                <Image
                  src="/logo.png"
                  alt="Pakistan Idol Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-slate-900 font-bold text-xl">Pakistan Idol</span>
                <span className="text-slate-600 text-sm font-medium">2025 Dashboard</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-slate-600 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className="text-slate-900 text-sm font-medium block">
                    {user.name}
                  </span>
                  <span className="text-slate-500 text-xs">
                    {user.role}
                  </span>
                </div>
                {user.role === 'Editor' && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-primary hover:bg-primary/5">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
                <form action="/api/auth/logout" method="post">
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-primary hover:bg-primary/5" type="submit">
                    Logout
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <nav className="flex space-x-1 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-slate-600 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
