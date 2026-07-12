'use client';

import React, { useState } from 'react';
import { Modal, FormField, ButtonGroup } from '@/components/ui/Modal';

type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  project: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', priority: 'MEDIUM', assignee: '', project: '' });

  const filteredTasks = filterStatus === 'ALL' ? tasks : tasks.filter(t => t.status === filterStatus);

  const statusColors: Record<string, string> = {
    TODO: 'bg-gray-500/20 text-gray-400',
    IN_PROGRESS: 'bg-primary/20 text-primary-light',
    REVIEW: 'bg-yellow-500/20 text-yellow-400',
    DONE: 'bg-green-500/20 text-green-400',
  };

  const priorityColors: Record<string, string> = {
    LOW: 'bg-gray-500/20 text-gray-400',
    MEDIUM: 'bg-yellow-500/20 text-yellow-400',
    HIGH: 'bg-orange-500/20 text-orange-400',
    URGENT: 'bg-danger/20 text-danger',
  };

  const handleAdd = () => {
    const newTask: Task = { id: Date.now().toString(), ...form, status: 'TODO' };
    setTasks([...tasks, newTask]);
    setShowModal(false);
    setForm({ title: '', priority: 'MEDIUM', assignee: '', project: '' });
  };

  const handleToggleStatus = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id !== id) return t;
      const statusFlow = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
      const currentIndex = statusFlow.indexOf(t.status);
      const nextStatus = statusFlow[(currentIndex + 1) % statusFlow.length];
      return { ...t, status: nextStatus };
    }));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this task?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Tasks</h1>
        <button onClick={() => setShowModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">+ New Task</button>
      </div>

      <div className="flex gap-2 mb-6">
        {['ALL', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].map(status => (
          <button key={status} onClick={() => setFilterStatus(status)} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterStatus === status ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            {status === 'ALL' ? 'All' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="bg-surface rounded-lg shadow overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-lg">No tasks yet</p>
            <p className="text-sm mt-2">Create a task to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {filteredTasks.map(task => (
              <div key={task.id} className="p-4 hover:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button onClick={() => handleToggleStatus(task.id)} className={`w-5 h-5 rounded border-2 flex items-center justify-center ${task.status === 'DONE' ? 'bg-green-500 border-green-500' : 'border-gray-500 hover:border-primary'}`}>
                      {task.status === 'DONE' && <span className="text-white text-xs">✓</span>}
                    </button>
                    <div className="flex-1">
                      <h3 className={`font-medium ${task.status === 'DONE' ? 'text-gray-500 line-through' : 'text-white'}`}>{task.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}>{task.status.replace('_', ' ')}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>{task.priority}</span>
                        {task.assignee && <span>→ {task.assignee}</span>}
                        {task.project && <span>📁 {task.project}</span>}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(task.id)} className="text-gray-500 hover:text-danger ml-4">×</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg shadow p-4 text-center">
          <p className="text-sm text-gray-400">To Do</p>
          <p className="text-2xl font-bold text-white">{tasks.filter(t => t.status === 'TODO').length}</p>
        </div>
        <div className="bg-surface rounded-lg shadow p-4 text-center">
          <p className="text-sm text-gray-400">In Progress</p>
          <p className="text-2xl font-bold text-primary">{tasks.filter(t => t.status === 'IN_PROGRESS').length}</p>
        </div>
        <div className="bg-surface rounded-lg shadow p-4 text-center">
          <p className="text-sm text-gray-400">Review</p>
          <p className="text-2xl font-bold text-yellow-400">{tasks.filter(t => t.status === 'REVIEW').length}</p>
        </div>
        <div className="bg-surface rounded-lg shadow p-4 text-center">
          <p className="text-sm text-gray-400">Done</p>
          <p className="text-2xl font-bold text-green-400">{tasks.filter(t => t.status === 'DONE').length}</p>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Task">
        <FormField label="Task Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g., Review color grading" required />
        <FormField label="Priority" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} as="select" options={[
          { value: 'LOW', label: 'Low' },
          { value: 'MEDIUM', label: 'Medium' },
          { value: 'HIGH', label: 'High' },
          { value: 'URGENT', label: 'Urgent' },
        ]} />
        <FormField label="Assignee" value={form.assignee} onChange={e => setForm({...form, assignee: e.target.value})} placeholder="Team member name" />
        <FormField label="Project" value={form.project} onChange={e => setForm({...form, project: e.target.value})} placeholder="Related project" />
        <ButtonGroup onCancel={() => setShowModal(false)} onSubmit={handleAdd} />
      </Modal>
    </div>
  );
}