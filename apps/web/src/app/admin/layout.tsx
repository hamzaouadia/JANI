"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Building2, Package, Activity, BarChart3, Settings, Menu, X, type LucideIcon } from 'lucide-react';

type NavigationItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Farms', href: '/admin/farms', icon: Building2 },
  { name: 'Exporters', href: '/admin/exporters', icon: Package },
  { name: 'Traceability', href: '/admin/traceability', icon: Activity },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex h-16 items-center px-6 border-b">
          <span className="text-xl font-bold text-green-600">JANI Admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {navigation.map(item => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href} className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${active ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <Icon className={`mr-3 h-5 w-5 ${active ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile sidebar toggle */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
          <span className="text-lg font-semibold text-green-600">JANI Admin</span>
          <button onClick={() => setOpen(!open)} className="text-gray-600">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {open && (
          <div className="px-2 py-4 bg-white border-b">
            {navigation.map(item => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href} className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50">
                  <div className="flex items-center gap-3"><Icon className="h-5 w-5" />{item.name}</div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">{navigation.find(n => n.href === pathname)?.name || 'Admin'}</h2>
            </div>
            <div className="text-sm text-gray-500">Welcome, Admin</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
