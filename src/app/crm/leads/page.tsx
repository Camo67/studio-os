'use client';

import React, { useState } from 'react';

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  source: string;
  owner: string;
  created: string;
};

const statusOptions = ['Lead', 'Open', 'Replied', 'Opportunity', 'Quotation', 'Converted', 'Lost'];
const statusColors: Record<string, string> = {
  Lead: 'bg-blue-500/20 text-blue-400',
  Open: 'bg-green-500/20 text-green-400',
  Replied: 'bg-yellow-500/20 text-yellow-400',
  Opportunity: 'bg-purple-500/20 text-purple-400',
  Quotation: 'bg-orange-500/20 text-orange-400',
  Converted: 'bg-green-500/20 text-green-400',
  Lost: 'bg-red-500/20 text-red-400',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', status: 'Lead', source: 'Web', owner: '',
  });

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = filter === 'ALL' || lead.status === filter;
    const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAdd = () => {
    const newLead: Lead = {
      id: Date.now().toString(),
      ...form,
      created: new Date().toISOString().split('T')[0],
    };
    setLeads([...leads, newLead]);
    setShowModal(false);
    setForm({ name: '', email: '', phone: '', company: '', status: 'Lead', source: 'Web', owner: '' });
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setForm({ name: lead.name, email: lead.email, phone: lead.phone, company: lead.company, status: lead.status, source: lead.source, owner: lead.owner });
    setShowModal(true);
  };

  const handleUpdate = () => {
    if (!editingLead) return;
    setLeads(leads.map(l => l.id === editingLead.id ? { ...l, ...form } : l));
    setShowModal(false);
    setEditingLead(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this lead?')) {
      setLeads(leads.filter(l => l.id !== id));
    }
  };

  const handleConvert = (lead: Lead) => {
    setLeads(leads.map(l => l.id === lead.id ? { ...l, status: 'Converted' } : l));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-gray-400">Manage potential customers and track their journey</p>
        </div>
        <button onClick={() => { setEditingLead(null); setShowModal(true); }} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
          + New Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <input type="text" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-surface border border-gray-700 text-white rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary" />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="bg-surface border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="ALL">All Status</option>
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-surface rounded-lg overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <span className="text-4xl mb-4 block">🎯</span>
            <p className="text-lg">No leads yet</p>
            <p className="text-sm mt-2">Add your first lead to get started.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 text-white font-medium">{lead.name}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{lead.email}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{lead.company}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded ${statusColors[lead.status] || 'bg-gray-500/20 text-gray-400'}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{lead.source}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button onClick={() => handleEdit(lead)} className="text-primary hover:text-primary-light mr-3">Edit</button>
                    <button onClick={() => handleConvert(lead)} className="text-green-400 hover:text-green-300 mr-3">Convert</button>
                    <button onClick={() => handleDelete(lead.id)} className="text-red-400 hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">{editingLead ? 'Edit Lead' : 'New Lead'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Company</label>
                <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Source</label>
                  <select value={form.source} onChange={e => setForm({...form, source: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                    {['Web', 'Referral', 'Cold Call', 'Advertisement', 'Email', 'Social Media', 'Walk In'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700">Cancel</button>
              <button onClick={editingLead ? handleUpdate : handleAdd} disabled={!form.name.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">
                {editingLead ? 'Update' : 'Create Lead'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}