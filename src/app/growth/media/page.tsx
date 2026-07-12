'use client';

import React, { useState } from 'react';

type MediaItem = {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
  uploadedAt: string;
  tags: string[];
  url?: string;
};

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filteredMedia = media.filter(item => {
    const matchesType = filter === 'all' || item.type === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleUpload = () => {
    // In production, this would open file picker
    const newMedia: MediaItem = {
      id: Date.now().toString(),
      name: `uploaded-file-${Date.now()}.jpg`,
      type: 'image',
      size: '2.4 MB',
      uploadedAt: new Date().toISOString().split('T')[0],
      tags: [],
    };
    setMedia([...media, newMedia]);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this media item?')) {
      setMedia(media.filter(m => m.id !== id));
    }
  };

  const typeIcons: Record<string, string> = {
    image: '🖼️',
    video: '🎬',
    document: '📄',
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Media Library</h1>
          <p className="text-gray-400">Upload, organize, and manage your content assets</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('grid')}
            className={`px-3 py-1 rounded-lg text-sm ${view === 'grid' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            ▦ Grid
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1 rounded-lg text-sm ${view === 'list' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            ☰ List
          </button>
          <button
            onClick={handleUpload}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            + Upload
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search media..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-surface border border-gray-700 text-white rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
        <div className="flex gap-2">
          {['all', 'image', 'video', 'document'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-lg text-sm ${filter === type ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid/List */}
      {filteredMedia.length === 0 ? (
        <div className="bg-surface rounded-lg p-12 text-center text-gray-400">
          <span className="text-4xl mb-4 block">📁</span>
          <p className="text-lg">No media files yet</p>
          <p className="text-sm mt-2">Upload images, videos, or documents to get started.</p>
          <button
            onClick={handleUpload}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            + Upload Your First File
          </button>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map(item => (
            <div key={item.id} className="bg-surface rounded-lg overflow-hidden group">
              <div className="aspect-square bg-gray-800 flex items-center justify-center">
                <span className="text-4xl">{typeIcons[item.type]}</span>
              </div>
              <div className="p-3">
                <p className="text-sm text-white truncate">{item.name}</p>
                <p className="text-xs text-gray-400">{item.size}</p>
                <div className="flex gap-1 mt-2">
                  {item.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-1 rounded">{tag}</span>
                  ))}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="mt-2 text-xs text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Tags</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Uploaded</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredMedia.map(item => (
                <tr key={item.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 text-sm text-white">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      {typeIcons[item.type]} {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{item.size}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {item.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-1 rounded">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{item.uploadedAt}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(item.id)} className="text-sm text-red-400 hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}