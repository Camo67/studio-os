'use client';

import React, { useState } from 'react';
import { Modal, FormField, ButtonGroup } from '@/components/ui/Modal';

type Playbook = {
  id: string;
  title: string;
  description: string;
  stages: string[];
  estimatedDuration: string;
  teamSize: string;
};

export default function PlaybookPage() {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlaybook, setEditingPlaybook] = useState<Playbook | null>(null);
  const [form, setForm] = useState({ title: '', description: '', stages: '', estimatedDuration: '', teamSize: '' });

  const handleAdd = () => {
    const newPlaybook: Playbook = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      stages: form.stages.split(',').map(s => s.trim()).filter(Boolean),
      estimatedDuration: form.estimatedDuration,
      teamSize: form.teamSize,
    };
    setPlaybooks([...playbooks, newPlaybook]);
    setShowModal(false);
    setForm({ title: '', description: '', stages: '', estimatedDuration: '', teamSize: '' });
  };

  const handleEdit = (playbook: Playbook) => {
    setEditingPlaybook(playbook);
    setForm({
      title: playbook.title,
      description: playbook.description,
      stages: playbook.stages.join(', '),
      estimatedDuration: playbook.estimatedDuration,
      teamSize: playbook.teamSize,
    });
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    if (!editingPlaybook) return;
    setPlaybooks(playbooks.map(p => p.id === editingPlaybook.id ? {
      ...p,
      title: form.title,
      description: form.description,
      stages: form.stages.split(',').map(s => s.trim()).filter(Boolean),
      estimatedDuration: form.estimatedDuration,
      teamSize: form.teamSize,
    } : p));
    setShowEditModal(false);
    setEditingPlaybook(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this playbook?')) {
      setPlaybooks(playbooks.filter(p => p.id !== id));
    }
  };

  const handleUsePlaybook = (playbook: Playbook) => {
    alert(`Creating project from playbook: "${playbook.title}"\n\nStages: ${playbook.stages.join(' → ')}\nDuration: ${playbook.estimatedDuration}\nTeam: ${playbook.teamSize}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Playbook</h1>
        <button onClick={() => setShowModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">+ Create Playbook</button>
      </div>

      <p className="text-gray-400 mb-6">Your production playbooks define repeatable processes for consistent delivery.</p>

      {playbooks.length === 0 ? (
        <div className="bg-surface rounded-lg shadow p-12 text-center text-gray-400">
          <p className="text-lg">No playbooks yet</p>
          <p className="text-sm mt-2">Create a playbook to standardize your production process.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playbooks.map(playbook => (
            <div key={playbook.id} className="bg-surface rounded-lg shadow p-6 hover:border hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-white">{playbook.title}</h3>
                <button onClick={() => handleDelete(playbook.id)} className="text-gray-500 hover:text-danger">×</button>
              </div>
              <p className="text-sm text-gray-400 mb-4">{playbook.description}</p>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-400">
                  <span>Stages:</span>
                  <span className="font-medium text-white">{playbook.stages.length}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Duration:</span>
                  <span className="text-white">{playbook.estimatedDuration}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Team:</span>
                  <span className="text-white">{playbook.teamSize}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSelectedPlaybook(playbook)} className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm">View</button>
                <button onClick={() => handleEdit(playbook)} className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm">Edit</button>
                <button onClick={() => handleUsePlaybook(playbook)} className="flex-1 bg-accent text-black py-2 rounded-lg hover:bg-accent-dark transition-colors text-sm">Use</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {selectedPlaybook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">{selectedPlaybook.title}</h2>
              <button onClick={() => setSelectedPlaybook(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <p className="text-gray-400 mb-6">{selectedPlaybook.description}</p>
            <div className="mb-6">
              <h3 className="font-semibold text-white mb-3">Production Stages</h3>
              <div className="space-y-3">
                {selectedPlaybook.stages.map((stage, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">{index + 1}</div>
                    <div className="flex-1 bg-gray-800 rounded-lg p-3 text-white">{stage}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-400">Duration</p>
                <p className="text-lg font-bold text-white">{selectedPlaybook.estimatedDuration}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-400">Team Size</p>
                <p className="text-lg font-bold text-white">{selectedPlaybook.teamSize}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSelectedPlaybook(null)} className="flex-1 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700">Close</button>
              <button onClick={() => { handleUsePlaybook(selectedPlaybook); setSelectedPlaybook(null); }} className="flex-1 px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent-dark">Create Project</button>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Playbook">
        <FormField label="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g., Brand Video Production" required />
        <FormField label="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief description" as="textarea" />
        <FormField label="Stages (comma-separated)" value={form.stages} onChange={e => setForm({...form, stages: e.target.value})} placeholder="Discovery, Scripting, Production, Delivery" required />
        <FormField label="Estimated Duration" value={form.estimatedDuration} onChange={e => setForm({...form, estimatedDuration: e.target.value})} placeholder="4-6 weeks" />
        <FormField label="Team Size" value={form.teamSize} onChange={e => setForm({...form, teamSize: e.target.value})} placeholder="3-5 people" />
        <ButtonGroup onCancel={() => setShowModal(false)} onSubmit={handleAdd} />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Playbook">
        <FormField label="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        <FormField label="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} as="textarea" />
        <FormField label="Stages (comma-separated)" value={form.stages} onChange={e => setForm({...form, stages: e.target.value})} required />
        <FormField label="Estimated Duration" value={form.estimatedDuration} onChange={e => setForm({...form, estimatedDuration: e.target.value})} />
        <FormField label="Team Size" value={form.teamSize} onChange={e => setForm({...form, teamSize: e.target.value})} />
        <ButtonGroup onCancel={() => setShowEditModal(false)} onSubmit={handleUpdate} submitLabel="Update" />
      </Modal>
    </div>
  );
}