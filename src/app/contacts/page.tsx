'use client';

import React, { useState } from 'react';
import { Modal, FormField, ButtonGroup } from '@/components/ui/Modal';

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  hats: string[];
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [filterHat, setFilterHat] = useState<string>('ALL');
  const [form, setForm] = useState({ name: '', email: '', phone: '', hats: [] as string[] });

  const filteredContacts = filterHat === 'ALL' ? contacts : contacts.filter(c => c.hats.includes(filterHat));

  const hatColors: Record<string, string> = {
    LEAD: 'bg-blue-500/20 text-blue-400',
    CLIENT: 'bg-green-500/20 text-green-400',
    CREW: 'bg-purple-500/20 text-purple-400',
    VENDOR: 'bg-orange-500/20 text-orange-400',
    TALENT: 'bg-pink-500/20 text-pink-400',
  };

  const handleAdd = () => {
    const newContact: Contact = { id: Date.now().toString(), ...form };
    setContacts([...contacts, newContact]);
    setShowAddModal(false);
    setForm({ name: '', email: '', phone: '', hats: [] });
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setForm({ name: contact.name, email: contact.email, phone: contact.phone, hats: contact.hats });
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    if (!editingContact) return;
    setContacts(contacts.map(c => c.id === editingContact.id ? { ...c, ...form } : c));
    setShowEditModal(false);
    setEditingContact(null);
    setForm({ name: '', email: '', phone: '', hats: [] });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this contact?')) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  const toggleHat = (hat: string) => {
    setForm(prev => ({
      ...prev,
      hats: prev.hats.includes(hat) ? prev.hats.filter(h => h !== hat) : [...prev.hats, hat]
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Contacts</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">+ Add Contact</button>
      </div>

      <div className="flex gap-2 mb-6">
        {['ALL', 'LEAD', 'CLIENT', 'CREW', 'VENDOR', 'TALENT'].map(hat => (
          <button key={hat} onClick={() => setFilterHat(hat)} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterHat === hat ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            {hat}
          </button>
        ))}
      </div>

      <div className="bg-surface rounded-lg shadow overflow-hidden">
        {filteredContacts.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-lg">No contacts yet</p>
            <p className="text-sm mt-2">Add your first contact to get started.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Hats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-gray-700">
              {filteredContacts.map(contact => (
                <tr key={contact.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{contact.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{contact.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{contact.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1 flex-wrap">
                      {contact.hats.map(hat => (
                        <span key={hat} className={`px-2 py-1 rounded-full text-xs font-medium ${hatColors[hat]}`}>{hat}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(contact)} className="text-primary hover:text-primary-light mr-3">Edit</button>
                    <button onClick={() => handleDelete(contact.id)} className="text-danger hover:text-red-400">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Contact">
        <FormField label="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Smith" required />
        <FormField label="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@example.com" />
        <FormField label="Phone" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="555-0100" />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Hats (Roles)</label>
          <div className="flex gap-3 flex-wrap">
            {['LEAD', 'CLIENT', 'CREW', 'VENDOR', 'TALENT'].map(hat => (
              <label key={hat} className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-700">
                <input type="checkbox" checked={form.hats.includes(hat)} onChange={() => toggleHat(hat)} className="rounded text-primary" />
                <span className="text-sm text-gray-300">{hat}</span>
              </label>
            ))}
          </div>
        </div>
        <ButtonGroup onCancel={() => setShowAddModal(false)} onSubmit={handleAdd} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Contact">
        <FormField label="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <FormField label="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <FormField label="Phone" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Hats (Roles)</label>
          <div className="flex gap-3 flex-wrap">
            {['LEAD', 'CLIENT', 'CREW', 'VENDOR', 'TALENT'].map(hat => (
              <label key={hat} className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-700">
                <input type="checkbox" checked={form.hats.includes(hat)} onChange={() => toggleHat(hat)} className="rounded text-primary" />
                <span className="text-sm text-gray-300">{hat}</span>
              </label>
            ))}
          </div>
        </div>
        <ButtonGroup onCancel={() => setShowEditModal(false)} onSubmit={handleUpdate} submitLabel="Update" />
      </Modal>
    </div>
  );
}