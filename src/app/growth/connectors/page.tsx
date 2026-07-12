'use client';

import React, { useState } from 'react';

type Connector = {
  id: string;
  name: string;
  icon: string;
  category: string;
  connected: boolean;
  description: string;
};

const connectors: Connector[] = [
  // Major Social
  { id: 'twitter', name: 'X (Twitter)', icon: '🐦', category: 'Social Media', connected: false, description: 'Post tweets, threads, and engage with your audience' },
  { id: 'instagram', name: 'Instagram', icon: '📷', category: 'Social Media', connected: false, description: 'Share photos, stories, and reels' },
  { id: 'facebook', name: 'Facebook', icon: '📘', category: 'Social Media', connected: false, description: 'Post to pages and groups' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', category: 'Social Media', connected: false, description: 'Professional networking and company pages' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', category: 'Social Media', connected: false, description: 'Short-form video content' },
  { id: 'youtube', name: 'YouTube', icon: '📺', category: 'Social Media', connected: false, description: 'Video uploads and community posts' },
  { id: 'threads', name: 'Threads', icon: '🧵', category: 'Social Media', connected: false, description: 'Meta\'s text-based social network' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌', category: 'Social Media', connected: false, description: 'Visual discovery and pin boards' },
  
  // Messaging
  { id: 'discord', name: 'Discord', icon: '🎮', category: 'Messaging', connected: false, description: 'Community servers and channels' },
  { id: 'slack', name: 'Slack', icon: '💬', category: 'Messaging', connected: false, description: 'Workspace channels and DMs' },
  { id: 'telegram', name: 'Telegram', icon: '📱', category: 'Messaging', connected: false, description: 'Channels and group messaging' },
  
  // Fediverse
  { id: 'mastodon', name: 'Mastodon', icon: '🐘', category: 'Fediverse', connected: false, description: 'Decentralized social networking' },
  { id: 'bluesky', name: 'Bluesky', icon: '🦋', category: 'Fediverse', connected: false, description: 'AT Protocol social network' },
  { id: 'reddit', name: 'Reddit', icon: '🔴', category: 'Community', connected: false, description: 'Subreddit posts and comments' },
  
  // Blogging
  { id: 'medium', name: 'Medium', icon: '✍️', category: 'Blogging', connected: false, description: 'Long-form articles and stories' },
  { id: 'devto', name: 'Dev.to', icon: '👨‍💻', category: 'Blogging', connected: false, description: 'Developer community articles' },
  { id: 'hashnode', name: 'Hashnode', icon: '💻', category: 'Blogging', connected: false, description: 'Developer blogging platform' },
  { id: 'wordpress', name: 'WordPress', icon: '📰', category: 'Blogging', connected: false, description: 'CMS and blog publishing' },
  { id: 'tumblr', name: 'Tumblr', icon: '📝', category: 'Blogging', connected: false, description: 'Microblogging and social' },
  
  // Business
  { id: 'gmb', name: 'Google Business', icon: '📍', category: 'Business', connected: false, description: 'Google Business Profile posts' },
  
  // Streaming
  { id: 'twitch', name: 'Twitch', icon: '🎮', category: 'Streaming', connected: false, description: 'Live streaming platform' },
  
  // Newsletter
  { id: 'listmonk', name: 'Listmonk', icon: '📧', category: 'Newsletter', connected: false, description: 'Self-hosted newsletter' },
];

const categories = ['All', ...new Set(connectors.map(c => c.category))];

export default function ConnectorsPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());

  const filteredConnectors = connectors.filter(c => {
    const matchesCategory = filter === 'All' || c.category === filter;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleConnect = (id: string) => {
    // In production, this would open OAuth flow
    alert(`Connecting to ${connectors.find(c => c.id === id)?.name}...\n\nIn production, this would open the OAuth authorization flow.`);
    setConnectedIds(new Set([...connectedIds, id]));
  };

  const handleDisconnect = (id: string) => {
    if (confirm('Disconnect this platform?')) {
      const newSet = new Set(connectedIds);
      newSet.delete(id);
      setConnectedIds(newSet);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Connectors</h1>
          <p className="text-gray-400">Connect your social media accounts and platforms</p>
        </div>
        <div className="flex items-center gap-2 bg-surface rounded-lg px-4 py-2">
          <span className="text-primary font-bold">{connectedIds.size}</span>
          <span className="text-gray-400 text-sm">/ {connectors.length} connected</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search connectors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-surface border border-gray-700 text-white rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="bg-surface border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Connected Section */}
      {connectedIds.size > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Connected</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectors.filter(c => connectedIds.has(c.id)).map(connector => (
              <div key={connector.id} className="bg-surface rounded-lg p-4 border border-green-500/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{connector.icon}</span>
                    <div>
                      <h3 className="font-bold text-white">{connector.name}</h3>
                      <span className="text-xs text-green-400">✓ Connected</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDisconnect(connector.id)}
                    className="text-gray-400 hover:text-red-400 text-sm"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Connectors */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Available Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConnectors.filter(c => !connectedIds.has(c.id)).map(connector => (
            <div key={connector.id} className="bg-surface rounded-lg p-4 border border-gray-700 hover:border-primary transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{connector.icon}</span>
                  <div>
                    <h3 className="font-bold text-white">{connector.name}</h3>
                    <span className="text-xs text-gray-400">{connector.category}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-3 mb-4">{connector.description}</p>
              <button
                onClick={() => handleConnect(connector.id)}
                className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}