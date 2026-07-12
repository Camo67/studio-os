'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NavItem {
  name: string;
  href: string;
  icon: string;
  ownerOnly?: boolean;
}

const navigation: Record<string, NavItem[]> = {
  Overview: [
    { name: 'Dashboard', href: '/', icon: '🏠' },
    { name: 'Knowledge base', href: '/knowledge', icon: '📚' },
  ],
  CRM: [
    { name: 'Contacts', href: '/contacts', icon: '👤' },
    { name: 'Pipeline', href: '/pipeline', icon: '📊' },
    { name: 'Playbook', href: '/playbook', icon: '🧠' },
  ],
  Work: [
    { name: 'Projects', href: '/projects', icon: '🎬' },
    { name: 'Graph View', href: '/graph', icon: '🕸️' },
    { name: 'Tasks', href: '/tasks', icon: '✅' },
    { name: 'Calendar', href: '/calendar', icon: '📅' },
    { name: 'Gear cage', href: '/gear', icon: '📦' },
    { name: 'Studio Clock', href: '/clock', icon: '⏱️' },
  ],
  Growth: [
    { name: 'Overview', href: '/growth', icon: '📈' },
    { name: 'Broadcast', href: '/growth/broadcast', icon: '📡' },
    { name: 'Connectors', href: '/growth/connectors', icon: '🔗' },
    { name: 'Media Library', href: '/growth/media', icon: '🖼️' },
    { name: 'Analytics', href: '/growth/analytics', icon: '📊' },
  ],
  Commerce: [
    { name: 'Store', href: '/store', icon: '🛍️' },
  ],
  Admin: [
    { name: 'Manager', href: '/admin', icon: '⚙️', ownerOnly: true },
  ],
};

interface SidebarProps {
  userRole?: string;
}

export default function Sidebar({ userRole = 'MEMBER' }: SidebarProps) {
  return (
    <div className="w-64 bg-surface h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700 flex items-center gap-3">
        <Image
          src="/images/logo.jpg"
          alt="Studio OS Logo"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <span className="text-xl font-bold tracking-tight text-white">STUDIO OS</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        {Object.entries(navigation).map(([category, items]) => (
          <div key={category} className="mb-6">
            <h3 className="px-3 text-xs font-semibold text-primary-light uppercase tracking-wider">
              {category}
            </h3>
            <ul className="mt-2 space-y-1">
              {items.map((item) => {
                if (item.ownerOnly && userRole !== 'OWNER') return null;
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-primary/20 hover:text-white transition-colors"
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition-colors">
          <span className="text-xl">✦</span> Ask Kyra
        </button>
      </div>
    </div>
  );
}