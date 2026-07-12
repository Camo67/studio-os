'use client';

import React, { useState } from 'react';
import { Modal, FormField, ButtonGroup } from '@/components/ui/Modal';

type Post = {
  id: string;
  content: string;
  platforms: string[];
  scheduledDate: string;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  media?: string[];
};

const platformColors: Record<string, string> = {
  twitter: 'bg-black text-white',
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  facebook: 'bg-blue-600 text-white',
  linkedin: 'bg-blue-700 text-white',
  tiktok: 'bg-black text-white',
  youtube: 'bg-red-600 text-white',
  threads: 'bg-black text-white',
  pinterest: 'bg-red-500 text-white',
  discord: 'bg-indigo-600 text-white',
  slack: 'bg-purple-600 text-white',
  reddit: 'bg-orange-600 text-white',
  mastodon: 'bg-blue-500 text-white',
};

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-400',
  scheduled: 'bg-yellow-500/20 text-yellow-400',
  published: 'bg-green-500/20 text-green-400',
  failed: 'bg-red-500/20 text-red-400',
};

export default function BroadcastPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [form, setForm] = useState({
    content: '',
    platforms: [] as string[],
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '09:00',
  });

  const allPlatforms = ['twitter', 'instagram', 'facebook', 'linkedin', 'tiktok', 'youtube', 'threads', 'pinterest', 'discord', 'slack', 'reddit', 'mastodon'];

  const handleCreatePost = () => {
    const newPost: Post = {
      id: Date.now().toString(),
      content: form.content,
      platforms: form.platforms,
      scheduledDate: form.scheduledDate,
      scheduledTime: form.scheduledTime,
      status: 'scheduled',
    };
    setPosts([...posts, newPost]);
    setShowModal(false);
    setForm({ content: '', platforms: [], scheduledDate: new Date().toISOString().split('T')[0], scheduledTime: '09:00' });
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
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            + New Post
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
                  onClick={() => setSelectedDate(dateStr)}
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
                          <span key={p} className={`text-xs px-2 py-0.5 rounded ${platformColors[p] || 'bg-gray-600 text-white'}`}>
                            {p}
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

      {/* Create Post Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Post">
        <FormField
          label="Content"
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}
          placeholder="What do you want to share?"
          as="textarea"
          required
        />
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Platforms</label>
          <div className="grid grid-cols-3 gap-2">
            {allPlatforms.map(platform => (
              <label
                key={platform}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                  form.platforms.includes(platform)
                    ? 'bg-primary/20 border border-primary'
                    : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.platforms.includes(platform)}
                  onChange={e => {
                    if (e.target.checked) {
                      setForm({ ...form, platforms: [...form.platforms, platform] });
                    } else {
                      setForm({ ...form, platforms: form.platforms.filter(p => p !== platform) });
                    }
                  }}
                  className="rounded text-primary"
                />
                <span className="text-sm text-gray-300 capitalize">{platform}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Date"
            type="date"
            value={form.scheduledDate}
            onChange={e => setForm({ ...form, scheduledDate: e.target.value })}
            required
          />
          <FormField
            label="Time"
            type="time"
            value={form.scheduledTime}
            onChange={e => setForm({ ...form, scheduledTime: e.target.value })}
            required
          />
        </div>

        <ButtonGroup
          onCancel={() => setShowModal(false)}
          onSubmit={handleCreatePost}
          submitLabel="Schedule Post"
        />
      </Modal>
    </div>
  );
}