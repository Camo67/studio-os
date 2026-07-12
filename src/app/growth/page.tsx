'use client';

import React from 'react';
import Link from 'next/link';

const growthModules = [
  {
    title: 'Broadcast',
    description: 'Schedule and publish content across all your social channels',
    icon: '📡',
    href: '/growth/broadcast',
    color: 'bg-primary/10 border-primary/30',
    stats: { scheduled: 0, published: 0, drafts: 0 },
  },
  {
    title: 'Connectors',
    description: 'Connect your social media accounts and platforms',
    icon: '🔗',
    href: '/growth/connectors',
    color: 'bg-accent/10 border-accent/30',
    stats: { connected: 0, total: 35 },
  },
  {
    title: 'Media Library',
    description: 'Upload, organize, and manage your content assets',
    icon: '🖼️',
    href: '/growth/media',
    color: 'bg-green-500/10 border-green-500/30',
    stats: { images: 0, videos: 0 },
  },
  {
    title: 'Analytics',
    description: 'Track engagement and performance across platforms',
    icon: '📊',
    href: '/growth/analytics',
    color: 'bg-purple-500/10 border-purple-500/30',
    stats: { followers: 0, engagement: '0%' },
  },
  {
    title: 'Website',
    description: 'Build and manage your public marketing site',
    icon: '🌐',
    href: '/growth/website',
    color: 'bg-cyan-500/10 border-cyan-500/30',
    stats: { visitors: 0, posts: 0 },
  },
  {
    title: 'Marketing Links',
    description: 'Trackable links with source/referral attribution',
    icon: '📎',
    href: '/growth/links',
    color: 'bg-orange-500/10 border-orange-500/30',
    stats: { clicks: 0, conversions: 0 },
  },
];

export default function GrowthPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Growth</h1>
        <p className="text-gray-400">Manage your content, social media, and marketing in one place.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {growthModules.map((module) => (
          <Link
            key={module.title}
            href={module.href}
            className={`block p-6 rounded-lg border transition-all hover:scale-[1.02] ${module.color}`}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{module.icon}</span>
            </div>
            <h3 className="font-bold text-white text-lg mb-1">{module.title}</h3>
            <p className="text-gray-400 text-sm mb-4">{module.description}</p>
            
            <div className="flex gap-4 text-xs text-gray-500">
              {Object.entries(module.stats).map(([key, value]) => (
                <span key={key}>
                  <span className="text-white font-medium">{value}</span> {key}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 bg-surface rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-4">Quick Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">0</p>
            <p className="text-sm text-gray-400">Posts This Week</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-accent">0</p>
            <p className="text-sm text-gray-400">Total Reach</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">0%</p>
            <p className="text-sm text-gray-400">Engagement Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">0</p>
            <p className="text-sm text-gray-400">New Followers</p>
          </div>
        </div>
      </div>
    </div>
  );
}