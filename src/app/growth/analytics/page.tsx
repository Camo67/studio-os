'use client';

import React, { useState } from 'react';

const platforms = [
  { name: 'X (Twitter)', icon: '🐦', followers: 0, engagement: '0%', reach: 0, posts: 0 },
  { name: 'Instagram', icon: '📷', followers: 0, engagement: '0%', reach: 0, posts: 0 },
  { name: 'Facebook', icon: '📘', followers: 0, engagement: '0%', reach: 0, posts: 0 },
  { name: 'LinkedIn', icon: '💼', followers: 0, engagement: '0%', reach: 0, posts: 0 },
  { name: 'YouTube', icon: '📺', followers: 0, engagement: '0%', reach: 0, posts: 0 },
  { name: 'TikTok', icon: '🎵', followers: 0, engagement: '0%', reach: 0, posts: 0 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const totalFollowers = platforms.reduce((sum, p) => sum + p.followers, 0);
  const totalReach = platforms.reduce((sum, p) => sum + p.reach, 0);
  const totalPosts = platforms.reduce((sum, p) => sum + p.posts, 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400">Track engagement and performance across platforms</p>
        </div>
        <select
          value={timeRange}
          onChange={e => setTimeRange(e.target.value)}
          className="bg-surface border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-1">Total Followers</p>
          <p className="text-3xl font-bold text-white">{totalFollowers.toLocaleString()}</p>
          <p className="text-xs text-green-400 mt-1">+0% from last period</p>
        </div>
        <div className="bg-surface rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-1">Total Reach</p>
          <p className="text-3xl font-bold text-primary">{totalReach.toLocaleString()}</p>
          <p className="text-xs text-green-400 mt-1">+0% from last period</p>
        </div>
        <div className="bg-surface rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-1">Engagement Rate</p>
          <p className="text-3xl font-bold text-accent">0%</p>
          <p className="text-xs text-gray-400 mt-1">No data yet</p>
        </div>
        <div className="bg-surface rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-1">Total Posts</p>
          <p className="text-3xl font-bold text-green-400">{totalPosts}</p>
          <p className="text-xs text-gray-400 mt-1">Published this period</p>
        </div>
      </div>

      {/* Platform Performance */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Platform Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map(platform => (
            <div
              key={platform.name}
              className={`bg-surface rounded-lg p-4 border cursor-pointer transition-colors ${
                selectedPlatform === platform.name
                  ? 'border-primary'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => setSelectedPlatform(platform.name)}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{platform.icon}</span>
                <h3 className="font-bold text-white">{platform.name}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Followers</p>
                  <p className="text-white font-medium">{platform.followers.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Engagement</p>
                  <p className="text-white font-medium">{platform.engagement}</p>
                </div>
                <div>
                  <p className="text-gray-400">Reach</p>
                  <p className="text-white font-medium">{platform.reach.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Posts</p>
                  <p className="text-white font-medium">{platform.posts}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Posts */}
      <div className="bg-surface rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-4">Top Performing Posts</h2>
        <div className="text-center text-gray-400 py-8">
          <span className="text-4xl mb-4 block">📊</span>
          <p>No analytics data yet.</p>
          <p className="text-sm mt-2">Publish some posts to see performance metrics.</p>
        </div>
      </div>
    </div>
  );
}