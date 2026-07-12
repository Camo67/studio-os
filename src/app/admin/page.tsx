'use client';

import React, { useState } from 'react';
import { Modal, FormField, ButtonGroup } from '@/components/ui/Modal';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

type StudioSettings = {
  name: string;
  slug: string;
  hourlyRate: number;
  timezone: string;
};

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'settings' | 'billing'>('users');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'MEMBER' });
  const [settings, setSettings] = useState<StudioSettings>({
    name: '',
    slug: '',
    hourlyRate: 150,
    timezone: 'America/New_York',
  });

  const roleColors: Record<string, string> = {
    OWNER: 'bg-purple-500/20 text-purple-400',
    SALES: 'bg-primary/20 text-primary-light',
    PRODUCER: 'bg-green-500/20 text-green-400',
    CREW: 'bg-orange-500/20 text-orange-400',
    MARKETING: 'bg-pink-500/20 text-pink-400',
    FINANCE: 'bg-accent/20 text-accent',
    MEMBER: 'bg-gray-500/20 text-gray-400',
  };

  const handleInvite = () => {
    const newUser: User = {
      id: Date.now().toString(),
      ...form,
      status: 'active',
    };
    setUsers([...users, newUser]);
    setShowInviteModal(false);
    setForm({ name: '', email: '', role: 'MEMBER' });
  };

  const handleEditUser = (user: User) => {
    const newRole = prompt(`Change role for ${user.name}:`, user.role);
    if (newRole && ['OWNER', 'SALES', 'PRODUCER', 'CREW', 'MARKETING', 'FINANCE', 'MEMBER'].includes(newRole)) {
      setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    }
  };

  const handleRemoveUser = (id: string) => {
    if (confirm('Remove this team member?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleSaveSettings = () => {
    alert(`Settings saved!\n\nStudio: ${settings.name}\nSlug: ${settings.slug}\nRate: $${settings.hourlyRate}/hr\nTimezone: ${settings.timezone}`);
  };

  const handleManageSubscription = () => {
    alert('Opening subscription management...\n\nCurrent Plan: Studio OS Pro ($49/month)\nFeatures: Unlimited team members, all modules');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Studio Manager</h1>
        <span className="text-sm text-gray-400">Owner Access Only</span>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-700">
        {['users', 'settings', 'billing'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab as typeof activeTab)} className={`pb-3 px-4 font-medium transition-colors ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Team Members</h2>
            <button onClick={() => setShowInviteModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">+ Invite Member</button>
          </div>

          <div className="bg-surface rounded-lg shadow overflow-hidden">
            {users.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <p className="text-lg">No team members yet</p>
                <p className="text-sm mt-2">Invite your first team member.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-gray-700">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>{user.role}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{user.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleEditUser(user)} className="text-primary hover:text-primary-light mr-3">Edit Role</button>
                        <button onClick={() => handleRemoveUser(user.id)} className="text-danger hover:text-red-400">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-surface rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Studio Settings</h2>
          <div className="space-y-6">
            <FormField label="Studio Name" value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} placeholder="My Creative Studio" />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Studio URL Slug</label>
              <div className="flex items-center">
                <span className="text-gray-400 mr-2">studio-os.com/s/</span>
                <input type="text" value={settings.slug} onChange={e => setSettings({...settings, slug: e.target.value})} className="flex-1 bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="my-studio" />
              </div>
            </div>
            <FormField label="Default Hourly Rate ($)" type="number" value={settings.hourlyRate.toString()} onChange={e => setSettings({...settings, hourlyRate: parseFloat(e.target.value) || 0})} />
            <FormField label="Timezone" value={settings.timezone} onChange={e => setSettings({...settings, timezone: e.target.value})} as="select" options={[
              { value: 'America/New_York', label: 'Eastern Time' },
              { value: 'America/Chicago', label: 'Central Time' },
              { value: 'America/Denver', label: 'Mountain Time' },
              { value: 'America/Los_Angeles', label: 'Pacific Time' },
              { value: 'UTC', label: 'UTC' },
            ]} />
            <button onClick={handleSaveSettings} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">Save Changes</button>
          </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="bg-surface rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Billing & Subscription</h2>
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white">Studio OS Pro</h3>
                <p className="text-sm text-gray-400">$49/month • Unlimited team members</p>
              </div>
              <button onClick={handleManageSubscription} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">Manage Subscription</button>
            </div>
          </div>
          
          <h3 className="font-semibold text-white mb-4">Payment Method</h3>
          <div className="flex items-center gap-4 p-4 border border-gray-700 rounded-lg mb-6">
            <div className="w-12 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">VISA</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-white">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-400">Expires 12/2025</p>
            </div>
            <button onClick={() => alert('Opening payment method editor...')} className="text-primary hover:text-primary-light">Update</button>
          </div>

          <h3 className="font-semibold text-white mb-4">Recent Invoices</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-white">July 2026</p>
                <p className="text-sm text-gray-400">Studio OS Pro</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-white">$49.00</p>
                <p className="text-sm text-green-400">Paid</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite Team Member">
        <FormField label="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Smith" required />
        <FormField label="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@example.com" required />
        <FormField label="Role" value={form.role} onChange={e => setForm({...form, role: e.target.value})} as="select" options={[
          { value: 'MEMBER', label: 'Member' },
          { value: 'SALES', label: 'Sales' },
          { value: 'PRODUCER', label: 'Producer' },
          { value: 'CREW', label: 'Crew' },
          { value: 'MARKETING', label: 'Marketing' },
          { value: 'FINANCE', label: 'Finance' },
          { value: 'OWNER', label: 'Owner' },
        ]} />
        <ButtonGroup onCancel={() => setShowInviteModal(false)} onSubmit={handleInvite} submitLabel="Send Invite" />
      </Modal>
    </div>
  );
}