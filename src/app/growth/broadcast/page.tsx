'use client';

import React, { useState } from 'react';

type Post = {
  id: string;
  content: string;
  platforms: string[];
  scheduledDate: string;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  media?: string[];
  tags?: string[];
};

const platformConfig: Record<string, { icon: string; color: string; maxChars: number }> = {
  twitter: { icon: '🐦', color: 'bg-black', maxChars: 280 },
  instagram: { icon: '📷', color: 'bg-gradient-to-r from-purple-500 to-pink-500', maxChars: 2200 },
  facebook: { icon: '📘', color: 'bg-blue-600', maxChars: 63206 },
  linkedin: { icon: '💼', color: 'bg-blue-700', maxChars: 3000 },
  tiktok: { icon: '🎵', color: 'bg-black', maxChars: 2200 },
  youtube: { icon: '📺', color: 'bg-red-600', maxChars: 5000 },
  threads: { icon: '🧵', color: 'bg-black', maxChars: 500 },
  pinterest: { icon: '📌', color: 'bg-red-500', maxChars: 500 },
  discord: { icon: '🎮', color: 'bg-indigo-600', maxChars: 2000 },
  slack: { icon: '💬', color: 'bg-purple-600', maxChars: 40000 },
  reddit: { icon: '🔴', color: 'bg-orange-600', maxChars: 40000 },
  mastodon: { icon: '🐘', color: 'bg-blue-500', maxChars: 500 },
};

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-400',
  scheduled: 'bg-yellow-500/20 text-yellow-400',
  published: 'bg-green-500/20 text-green-400',
  failed: 'bg-red-500/20 text-red-400',
};

export default function BroadcastPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showComposer, setShowComposer] = useState(false);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  
  // Composer state
  const [composerContent, setComposerContent] = useState('');
  const [composerPlatforms, setComposerPlatforms] = useState<string[]>([]);
  const [composerDate, setComposerDate] = useState(new Date().toISOString().split('T')[0]);
  const [composerTime, setComposerTime] = useState('09:00');
  const [composerTags, setComposerTags] = useState<string[]>([]);
  const [composerTagInput, setComposerTagInput] = useState('');
  const [activePreview, setActivePreview] = useState<string>('twitter');

  const handleCreatePost = () => {
    if (!composerContent.trim() || composerPlatforms.length === 0) return;
    
    const newPost: Post = {
      id: Date.now().toString(),
      content: composerContent,
      platforms: composerPlatforms,
      scheduledDate: composerDate,
      scheduledTime: composerTime,
      status: 'scheduled',
      tags: composerTags,
    };
    setPosts([...posts, newPost]);
    setShowComposer(false);
    resetComposer();
  };

  const handleSaveDraft = () => {
    if (!composerContent.trim()) return;
    
    const newPost: Post = {
      id: Date.now().toString(),
      content: composerContent,
      platforms: composerPlatforms,
      scheduledDate: composerDate,
      scheduledTime: composerTime,
      status: 'draft',
      tags: composerTags,
    };
    setPosts([...posts, newPost]);
    setShowComposer(false);
    resetComposer();
  };

  const resetComposer = () => {
    setComposerContent('');
    setComposerPlatforms([]);
    setComposerDate(new Date().toISOString().split('T')[0]);
    setComposerTime('09:00');
    setComposerTags([]);
    setComposerTagInput('');
  };

  const handleAddTag = () => {
    if (composerTagInput.trim() && !composerTags.includes(composerTagInput.trim())) {
      setComposerTags([...composerTags, composerTagInput.trim()]);
      setComposerTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setComposerTags(composerTags.filter(t => t !== tag));
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Delete this post?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handlePublishNow = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, status: 'published' } : p));
  };

  const getPostsForDate = (date: string) => posts.filter(p => p.scheduledDate === date);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDay: firstDay.getDay() };
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const getCharCount = (platform: string) => {
    const max = platformConfig[platform]?.maxChars || 2000;
    return { current: composerContent.length, max, percent: (composerContent.length / max) * 100 };
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Broadcast</h1>
          <p className="text-gray-400">Schedule and publish content across all your social channels</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('calendar')}
            className={`px-3 py-1 rounded-lg text-sm ${view === 'calendar' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            📅 Calendar
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1 rounded-lg text-sm ${view === 'list' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            📋 List
          </button>
          <button
            onClick={() => setShowComposer(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            ✏️ Create Post
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-surface rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-white">{posts.length}</p>
          <p className="text-xs text-gray-400">Total Posts</p>
        </div>
        <div className="bg-surface rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">{posts.filter(p => p.status === 'scheduled').length}</p>
          <p className="text-xs text-gray-400">Scheduled</p>
        </div>
        <div className="bg-surface rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{posts.filter(p => p.status === 'published').length}</p>
          <p className="text-xs text-gray-400">Published</p>
        </div>
        <div className="bg-surface rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-400">{posts.filter(p => p.status === 'draft').length}</p>
          <p className="text-xs text-gray-400">Drafts</p>
        </div>
      </div>

      {view === 'calendar' ? (
        /* Calendar View */
        <div className="bg-surface rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-700 rounded-lg text-white">←</button>
            <h2 className="text-xl font-bold text-white">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-700 rounded-lg text-white">→</button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startingDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square p-2" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayPosts = getPostsForDate(dateStr);
              const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();

              return (
                <div
                  key={day}
                  className={`aspect-square p-2 rounded-lg border cursor-pointer transition-colors ${
                    isToday ? 'border-primary bg-primary/10' : 'border-gray-700 hover:bg-gray-700'
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : 'text-white'}`}>{day}</div>
                  <div className="space-y-1">
                    {dayPosts.slice(0, 2).map(post => (
                      <div key={post.id} className={`text-xs text-white px-1 py-0.5 rounded truncate ${statusColors[post.status]}`}>
                        {post.content.substring(0, 20)}...
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-surface rounded-lg overflow-hidden">
          {posts.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <p className="text-lg">No posts scheduled</p>
              <p className="text-sm mt-2">Create your first post to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {posts.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate) || a.scheduledTime.localeCompare(b.scheduledTime)).map(post => (
                <div key={post.id} className="p-4 hover:bg-gray-800">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white mb-2">{post.content}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {post.platforms.map(p => (
                          <span key={p} className={`text-xs px-2 py-0.5 rounded ${platformConfig[p]?.color || 'bg-gray-600'} text-white`}>
                            {platformConfig[p]?.icon} {p}
                          </span>
                        ))}
                        <span className={`text-xs px-2 py-0.5 rounded ${statusColors[post.status]}`}>
                          {post.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-400">{post.scheduledDate}</p>
                      <p className="text-sm text-gray-400">{post.scheduledTime}</p>
                      <div className="flex gap-2 mt-2">
                        {post.status === 'scheduled' && (
                          <button onClick={() => handlePublishNow(post.id)} className="text-xs text-green-400 hover:text-green-300">Publish Now</button>
                        )}
                        <button onClick={() => handleDeletePost(post.id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Create Post</h2>
              <button onClick={() => setShowComposer(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Left: Editor */}
              <div className="flex-1 p-4 overflow-y-auto">
                {/* Platform Selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Publish to</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(platformConfig).map(([id, config]) => (
                      <button
                        key={id}
                        onClick={() => {
                          if (composerPlatforms.includes(id)) {
                            setComposerPlatforms(composerPlatforms.filter(p => p !== id));
                          } else {
                            setComposerPlatforms([...composerPlatforms, id]);
                          }
                        }}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
                          composerPlatforms.includes(id)
                            ? `${config.color} text-white ring-2 ring-primary`
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <span>{config.icon}</span>
                        <span className="capitalize">{id}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Area */}
                <div className="mb-4">
                  <textarea
                    value={composerContent}
                    onChange={e => setComposerContent(e.target.value)}
                    placeholder="What do you want to share?"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  
                  {/* Character Count */}
                  {composerPlatforms.length > 0 && (
                    <div className="flex gap-4 mt-2">
                      {composerPlatforms.slice(0, 3).map(platform => {
                        const chars = getCharCount(platform);
                        return (
                          <div key={platform} className="flex items-center gap-2 text-xs">
                            <span>{platformConfig[platform]?.icon}</span>
                            <span className={chars.percent > 100 ? 'text-red-400' : chars.percent > 80 ? 'text-yellow-400' : 'text-gray-400'}>
                              {chars.current}/{chars.max}
                            </span>
                            <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all ${chars.percent > 100 ? 'bg-red-500' : chars.percent > 80 ? 'bg-yellow-500' : 'bg-primary'}`}
                                style={{ width: `${Math.min(chars.percent, 100)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Media Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Media</label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-gray-600 transition-colors cursor-pointer">
                    <span className="text-3xl mb-2 block">📎</span>
                    <p className="text-gray-400 text-sm">Drop files here or click to upload</p>
                    <p className="text-gray-500 text-xs mt-1">Images, videos, or documents</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={composerTagInput}
                      onChange={e => setComposerTagInput(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleAddTag()}
                      placeholder="Add tag..."
                      className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={handleAddTag}
                      className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600"
                    >
                      Add
                    </button>
                  </div>
                  {composerTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {composerTags.map(tag => (
                        <span key={tag} className="bg-primary/20 text-primary px-2 py-1 rounded text-sm flex items-center gap-1">
                          #{tag}
                          <button onClick={() => handleRemoveTag(tag)} className="hover:text-white">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Schedule */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                    <input
                      type="date"
                      value={composerDate}
                      onChange={e => setComposerDate(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                    <input
                      type="time"
                      value={composerTime}
                      onChange={e => setComposerTime(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Preview */}
              <div className="w-80 border-l border-gray-700 p-4 bg-gray-900/50">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Preview</h3>
                
                {/* Preview Platform Tabs */}
                <div className="flex gap-1 mb-4 overflow-x-auto">
                  {composerPlatforms.map(platform => (
                    <button
                      key={platform}
                      onClick={() => setActivePreview(platform)}
                      className={`px-2 py-1 rounded text-xs ${
                        activePreview === platform ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {platformConfig[platform]?.icon}
                    </button>
                  ))}
                </div>

                {/* Preview Card */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">S</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Studio OS</p>
                      <p className="text-gray-400 text-xs">@studioos</p>
                    </div>
                  </div>
                  <p className="text-white text-sm whitespace-pre-wrap">{composerContent || 'Your post content will appear here...'}</p>
                  {composerTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {composerTags.map(tag => (
                        <span key={tag} className="text-primary text-xs">#{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-700 text-gray-400 text-xs">
                    <span>💬 0</span>
                    <span>🔄 0</span>
                    <span>❤️ 0</span>
                    <span>📊 0</span>
                  </div>
                </div>

                {/* Schedule Info */}
                <div className="mt-4 bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Scheduled for</p>
                  <p className="text-white text-sm">{new Date(composerDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {composerTime}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <button
                  onClick={handleSaveDraft}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Save Draft
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowComposer(false)}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!composerContent.trim() || composerPlatforms.length === 0}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Schedule Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}