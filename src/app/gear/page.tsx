'use client';

import React, { useState } from 'react';
import { Modal, FormField, ButtonGroup } from '@/components/ui/Modal';

type GearItem = {
  id: string;
  name: string;
  status: string;
  category: string;
  lastChecked: string;
  checkedOutTo?: string;
};

export default function GearPage() {
  const [gear, setGear] = useState<GearItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', status: 'AVAILABLE' });

  const filteredGear = filterStatus === 'ALL' ? gear : gear.filter(g => g.status === filterStatus);

  const statusColors: Record<string, string> = {
    AVAILABLE: 'bg-green-500/20 text-green-400',
    CHECKED_OUT: 'bg-orange-500/20 text-orange-400',
    MAINTENANCE: 'bg-danger/20 text-danger',
    RETIRED: 'bg-gray-500/20 text-gray-400',
  };

  const handleAdd = () => {
    const newItem: GearItem = {
      id: Date.now().toString(),
      ...form,
      lastChecked: new Date().toISOString().split('T')[0],
    };
    setGear([...gear, newItem]);
    setShowModal(false);
    setForm({ name: '', category: '', status: 'AVAILABLE' });
  };

  const handleCheckOut = (id: string) => {
    const name = prompt('Check out to whom?');
    if (name) {
      setGear(gear.map(g => g.id === id ? { ...g, status: 'CHECKED_OUT', checkedOutTo: name } : g));
    }
  };

  const handleReturn = (id: string) => {
    setGear(gear.map(g => g.id === id ? { ...g, status: 'AVAILABLE', checkedOutTo: undefined } : g));
  };

  const handleMaintenance = (id: string) => {
    setGear(gear.map(g => g.id === id ? { ...g, status: 'MAINTENANCE' } : g));
  };

  const handleMarkAvailable = (id: string) => {
    setGear(gear.map(g => g.id === id ? { ...g, status: 'AVAILABLE', lastChecked: new Date().toISOString().split('T')[0] } : g));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this gear item?')) {
      setGear(gear.filter(g => g.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Gear Cage</h1>
        <button onClick={() => setShowModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">+ Add Gear</button>
      </div>

      <div className="flex gap-2 mb-6">
        {['ALL', 'AVAILABLE', 'CHECKED_OUT', 'MAINTENANCE'].map(status => (
          <button key={status} onClick={() => setFilterStatus(status)} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterStatus === status ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            {status === 'ALL' ? 'All' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {filteredGear.length === 0 ? (
        <div className="bg-surface rounded-lg shadow p-12 text-center text-gray-400">
          <p className="text-lg">No gear items yet</p>
          <p className="text-sm mt-2">Add equipment to track inventory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGear.map(item => (
            <div key={item.id} className="bg-surface rounded-lg shadow p-6 hover:border hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-white">{item.name}</h3>
                  <p className="text-sm text-gray-400">{item.category}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>{item.status.replace('_', ' ')}</span>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-400">
                  <span>Last Checked:</span>
                  <span className="text-white">{item.lastChecked}</span>
                </div>
                {item.checkedOutTo && (
                  <div className="flex justify-between text-gray-400">
                    <span>Checked Out To:</span>
                    <span className="font-medium text-white">{item.checkedOutTo}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {item.status === 'AVAILABLE' && (
                  <button onClick={() => handleCheckOut(item.id)} className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm">Check Out</button>
                )}
                {item.status === 'CHECKED_OUT' && (
                  <button onClick={() => handleReturn(item.id)} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">Return</button>
                )}
                {item.status === 'MAINTENANCE' && (
                  <button onClick={() => handleMarkAvailable(item.id)} className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm">Mark Available</button>
                )}
                <button onClick={() => handleDelete(item.id)} className="px-3 py-2 text-gray-400 hover:text-danger">×</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Gear Item">
        <FormField label="Item Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g., Sony A7S III" required />
        <FormField label="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} as="select" options={[
          { value: 'Camera', label: 'Camera' },
          { value: 'Lens', label: 'Lens' },
          { value: 'Lighting', label: 'Lighting' },
          { value: 'Audio', label: 'Audio' },
          { value: 'Stabilizer', label: 'Stabilizer' },
          { value: 'Recorder', label: 'Recorder' },
          { value: 'Other', label: 'Other' },
        ]} />
        <FormField label="Status" value={form.status} onChange={e => setForm({...form, status: e.target.value})} as="select" options={[
          { value: 'AVAILABLE', label: 'Available' },
          { value: 'MAINTENANCE', label: 'In Maintenance' },
        ]} />
        <ButtonGroup onCancel={() => setShowModal(false)} onSubmit={handleAdd} />
      </Modal>
    </div>
  );
}