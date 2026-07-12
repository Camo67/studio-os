'use client';

import React, { useState } from 'react';
import { Modal, FormField, ButtonGroup } from '@/components/ui/Modal';

type Project = {
  id: string;
  title: string;
  status: string;
  deal: string;
  crew: string[];
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState({ title: '', deal: '', status: 'PLANNING' });

  const statusColors: Record<string, string> = {
    PLANNING: 'bg-yellow-500/20 text-yellow-400',
    PRODUCTION: 'bg-primary/20 text-primary-light',
    POST_PRODUCTION: 'bg-purple-500/20 text-purple-400',
    COMPLETED: 'bg-green-500/20 text-green-400',
    ARCHIVED: 'bg-gray-500/20 text-gray-400',
  };

  const handleAdd = () => {
    const newProject: Project = { id: Date.now().toString(), ...form, crew: [] };
    setProjects([...projects, newProject]);
    setShowModal(false);
    setForm({ title: '', deal: '', status: 'PLANNING' });
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setForm({ title: project.title, deal: project.deal, status: project.status });
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    if (!editingProject) return;
    setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...form } : p));
    setShowEditModal(false);
    setEditingProject(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleView = (project: Project) => {
    alert(`Project: ${project.title}\nStatus: ${project.status}\nDeal: ${project.deal || 'None'}\nCrew: ${project.crew.length > 0 ? project.crew.join(', ') : 'None assigned'}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <div className="flex gap-2">
          <button onClick={() => setView('list')} className={`px-3 py-1 rounded-lg text-sm font-medium ${view === 'list' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}>List</button>
          <button onClick={() => setView('grid')} className={`px-3 py-1 rounded-lg text-sm font-medium ${view === 'grid' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}>Grid</button>
          <button onClick={() => setShowModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors ml-2">+ New Project</button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-surface rounded-lg shadow p-12 text-center text-gray-400">
          <p className="text-lg">No projects yet</p>
          <p className="text-sm mt-2">Create a project from a won deal or start one manually.</p>
        </div>
      ) : view === 'list' ? (
        <div className="bg-surface rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Deal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Crew</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-gray-700">
              {projects.map(project => (
                <tr key={project.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{project.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>{project.status.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{project.deal || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{project.crew.length > 0 ? project.crew.join(', ') : '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleView(project)} className="text-accent hover:text-accent-dark mr-3">View</button>
                    <button onClick={() => handleEdit(project)} className="text-primary hover:text-primary-light mr-3">Edit</button>
                    <button onClick={() => handleDelete(project.id)} className="text-danger hover:text-red-400">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-surface rounded-lg shadow p-6 hover:border hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-white">{project.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>{project.status.replace('_', ' ')}</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">From: {project.deal || 'None'}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">Crew: {project.crew.length > 0 ? project.crew.join(', ') : 'None'}</div>
                <div className="flex gap-2">
                  <button onClick={() => handleView(project)} className="text-accent hover:text-accent-dark text-sm">View</button>
                  <button onClick={() => handleEdit(project)} className="text-primary hover:text-primary-light text-sm">Edit</button>
                  <button onClick={() => handleDelete(project.id)} className="text-danger hover:text-red-400 text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Project">
        <FormField label="Project Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g., Acme Brand Video" required />
        <FormField label="Related Deal" value={form.deal} onChange={e => setForm({...form, deal: e.target.value})} placeholder="Deal name (optional)" />
        <FormField label="Status" value={form.status} onChange={e => setForm({...form, status: e.target.value})} as="select" options={[
          { value: 'PLANNING', label: 'Planning' },
          { value: 'PRODUCTION', label: 'Production' },
          { value: 'POST_PRODUCTION', label: 'Post-Production' },
          { value: 'COMPLETED', label: 'Completed' },
        ]} />
        <ButtonGroup onCancel={() => setShowModal(false)} onSubmit={handleAdd} />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Project">
        <FormField label="Project Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        <FormField label="Related Deal" value={form.deal} onChange={e => setForm({...form, deal: e.target.value})} />
        <FormField label="Status" value={form.status} onChange={e => setForm({...form, status: e.target.value})} as="select" options={[
          { value: 'PLANNING', label: 'Planning' },
          { value: 'PRODUCTION', label: 'Production' },
          { value: 'POST_PRODUCTION', label: 'Post-Production' },
          { value: 'COMPLETED', label: 'Completed' },
          { value: 'ARCHIVED', label: 'Archived' },
        ]} />
        <ButtonGroup onCancel={() => setShowEditModal(false)} onSubmit={handleUpdate} submitLabel="Update" />
      </Modal>
    </div>
  );
}