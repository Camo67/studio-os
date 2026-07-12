'use client';

import React, { useState } from 'react';
import { Modal, FormField, ButtonGroup } from '@/components/ui/Modal';

export default function Dashboard() {
  const [showDealModal, setShowDealModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  
  const [dealForm, setDealForm] = useState({ title: '', value: '', contact: '', stage: 'INQUIRY' });
  const [projectForm, setProjectForm] = useState({ title: '', deal: '', status: 'PLANNING' });
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', hats: [] as string[] });

  const handleCreateDeal = () => {
    console.log('Creating deal:', dealForm);
    alert('Deal created: ' + dealForm.title);
    setShowDealModal(false);
    setDealForm({ title: '', value: '', contact: '', stage: 'INQUIRY' });
  };

  const handleCreateProject = () => {
    console.log('Creating project:', projectForm);
    alert('Project created: ' + projectForm.title);
    setShowProjectModal(false);
    setProjectForm({ title: '', deal: '', status: 'PLANNING' });
  };

  const handleCreateContact = () => {
    console.log('Creating contact:', contactForm);
    alert('Contact created: ' + contactForm.name);
    setShowContactModal(false);
    setContactForm({ name: '', email: '', phone: '', hats: [] });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-400">Active Projects</h3>
          <p className="text-3xl font-bold text-primary">0</p>
        </div>
        <div className="bg-surface rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-400">Pipeline Value</h3>
          <p className="text-3xl font-bold text-accent">$0</p>
        </div>
        <div className="bg-surface rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-400">Pending Tasks</h3>
          <p className="text-3xl font-bold text-primary-light">0</p>
        </div>
        <div className="bg-surface rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-400">Team Members</h3>
          <p className="text-3xl font-bold text-accent-dark">0</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <button onClick={() => setShowDealModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
            + New Deal
          </button>
          <button onClick={() => setShowProjectModal(true)} className="bg-surface border border-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            + New Project
          </button>
          <button onClick={() => setShowContactModal(true)} className="bg-surface border border-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            + Add Contact
          </button>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="bg-surface rounded-lg shadow overflow-hidden">
          <div className="p-8 text-center text-gray-400">
            <p>No recent activity yet.</p>
            <p className="text-sm mt-2">Start by creating a deal or adding a contact.</p>
          </div>
        </div>
      </div>

      {/* New Deal Modal */}
      <Modal isOpen={showDealModal} onClose={() => setShowDealModal(false)} title="Create New Deal">
        <FormField label="Deal Title" value={dealForm.title} onChange={e => setDealForm({...dealForm, title: e.target.value})} placeholder="e.g., Corporate Brand Video" required />
        <FormField label="Deal Value ($)" type="number" value={dealForm.value} onChange={e => setDealForm({...dealForm, value: e.target.value})} placeholder="5000" required />
        <FormField label="Contact" value={dealForm.contact} onChange={e => setDealForm({...dealForm, contact: e.target.value})} placeholder="Client name" required />
        <FormField label="Stage" value={dealForm.stage} onChange={e => setDealForm({...dealForm, stage: e.target.value})} as="select" options={[
          { value: 'INQUIRY', label: 'Inquiry' },
          { value: 'QUALIFIED', label: 'Qualified' },
          { value: 'PROPOSAL', label: 'Proposal' },
          { value: 'NEGOTIATION', label: 'Negotiation' },
        ]} />
        <ButtonGroup onCancel={() => setShowDealModal(false)} onSubmit={handleCreateDeal} />
      </Modal>

      {/* New Project Modal */}
      <Modal isOpen={showProjectModal} onClose={() => setShowProjectModal(false)} title="Create New Project">
        <FormField label="Project Title" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} placeholder="e.g., Acme Brand Video" required />
        <FormField label="Related Deal" value={projectForm.deal} onChange={e => setProjectForm({...projectForm, deal: e.target.value})} placeholder="Deal name (optional)" />
        <FormField label="Status" value={projectForm.status} onChange={e => setProjectForm({...projectForm, status: e.target.value})} as="select" options={[
          { value: 'PLANNING', label: 'Planning' },
          { value: 'PRODUCTION', label: 'Production' },
          { value: 'POST_PRODUCTION', label: 'Post-Production' },
        ]} />
        <ButtonGroup onCancel={() => setShowProjectModal(false)} onSubmit={handleCreateProject} />
      </Modal>

      {/* New Contact Modal */}
      <Modal isOpen={showContactModal} onClose={() => setShowContactModal(false)} title="Add New Contact">
        <FormField label="Name" value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} placeholder="John Smith" required />
        <FormField label="Email" type="email" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} placeholder="john@example.com" />
        <FormField label="Phone" type="tel" value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} placeholder="555-0100" />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Hats (Roles)</label>
          <div className="flex gap-3 flex-wrap">
            {['LEAD', 'CLIENT', 'CREW', 'VENDOR', 'TALENT'].map(hat => (
              <label key={hat} className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-700">
                <input 
                  type="checkbox" 
                  checked={contactForm.hats.includes(hat)}
                  onChange={e => {
                    if (e.target.checked) {
                      setContactForm({...contactForm, hats: [...contactForm.hats, hat]});
                    } else {
                      setContactForm({...contactForm, hats: contactForm.hats.filter(h => h !== hat)});
                    }
                  }}
                  className="rounded text-primary"
                />
                <span className="text-sm text-gray-300">{hat}</span>
              </label>
            ))}
          </div>
        </div>
        <ButtonGroup onCancel={() => setShowContactModal(false)} onSubmit={handleCreateContact} />
      </Modal>
    </div>
  );
}