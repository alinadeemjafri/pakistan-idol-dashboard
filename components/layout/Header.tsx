'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Calendar, Home, List, Play, Tv, Users, Settings, User, Upload, Menu, X } from 'lucide-react';
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
  { name: 'Import', href: '/import', icon: Upload },
];

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 lg:h-24">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3 lg:space-x-4">
                <div className="w-12 h-12 lg:w-16 lg:h-16 relative">
                  <Image
                    src="/logo.png"
                    alt="Pakistan Idol Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-900 font-bold text-lg lg:text-2xl">Pakistan Idol</span>
                  <span className="text-slate-600 text-sm lg:text-base font-medium">2025 Dashboard</span>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex space-x-2">
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
            {user && (
              <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <span className="text-slate-900 text-sm font-medium block">
                    {user.name}
                  </span>
                  <span className="text-slate-500 text-xs">
                    {user.role}
                  </span>
                </div>
                {user.role === 'Editor' && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-primary hover:bg-primary/5 p-2">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
                <Link href="/logout">
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-primary hover:bg-primary/5 px-3 py-2">
                    <span className="hidden sm:inline">Logout</span>
                    <span className="sm:hidden">Exit</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden pb-4">
          <nav className="flex space-x-2 overflow-x-auto px-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
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
      </header>
    </>
  );
}