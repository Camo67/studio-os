'use client';

import React, { useState } from 'react';

type Opportunity = {
  id: string;
  name: string;
  party: string;
  amount: number;
  stage: string;
  probability: number;
  expectedClosing: string;
  owner: string;
  created: string;
};

const stages = [
  { id: 'Prospecting', color: 'bg-blue-500/20 text-blue-400' },
  { id: 'Qualification', color: 'bg-cyan-500/20 text-cyan-400' },
  { id: 'Proposal', color: 'bg-yellow-500/20 text-yellow-400' },
  { id: 'Negotiation', color: 'bg-orange-500/20 text-orange-400' },
  { id: 'Closed Won', color: 'bg-green-500/20 text-green-400' },
  { id: 'Closed Lost', color: 'bg-red-500/20 text-red-400' },
];

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState<'pipeline' | 'list'>('pipeline');
  const [form, setForm] = useState({
    name: '', party: '', amount: '', stage: 'Prospecting', probability: '50', expectedClosing: '', owner: '',
  });

  const handleAdd = () => {
    const newOpp: Opportunity = {
      id: Date.now().toString(),
      name: form.name,
      party: form.party,
      amount: parseFloat(form.amount) || 0,
      stage: form.stage,
      probability: parseInt(form.probability) || 50,
      expectedClosing: form.expectedClosing,
      owner: form.owner,
      created: new Date().toISOString().split('T')[0],
    };
    setOpportunities([...opportunities, newOpp]);
    setShowModal(false);
    setForm({ name: '', party: '', amount: '', stage: 'Prospecting', probability: '50', expectedClosing: '', owner: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this opportunity?')) {
      setOpportunities(opportunities.filter(o => o.id !== id));
    }
  };

  const handleMoveStage = (id: string, newStage: string) => {
    setOpportunities(opportunities.map(o => o.id === id ? { ...o, stage: newStage } : o));
  };

  const getStageOpportunities = (stage: string) => opportunities.filter(o => o.stage === stage);
  const getStageValue = (stage: string) => getStageOpportunities(stage).reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Opportunities</h1>
          <p className="text-gray-400">Track your sales pipeline and deals</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('pipeline')} className={`px-3 py-1 rounded-lg text-sm ${view === 'pipeline' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}>
            📊 Pipeline
          </button>
          <button onClick={() => setView('list')} className={`px-3 py-1 rounded-lg text-sm ${view === 'list' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}>
            ☰ List
          </button>
          <button onClick={() => setShowModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
            + New Opportunity
          </button>
        </div>
      </div>

      {/* Pipeline Summary */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {stages.map(stage => (
          <div key={stage.id} className="flex-shrink-0 bg-surface rounded-lg p-3 min-w-[150px]">
            <p className="text-xs text-gray-400 mb-1">{stage.id}</p>
            <p className="text-lg font-bold text-white">{getStageOpportunities(stage.id).length}</p>
            <p className="text-xs text-gray-500">${getStageValue(stage.id).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {view === 'pipeline' ? (
        /* Pipeline View */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map(stage => (
            <div key={stage.id} className="flex-shrink-0 w-72">
              <div className={`flex items-center justify-between mb-3 p-2 rounded-lg ${stage.color}`}>
                <span className="font-bold text-sm">{stage.id}</span>
                <span className="text-xs">{getStageOpportunities(stage.id).length}</span>
              </div>
              <div className="space-y-3 min-h-[200px]">
                {getStageOpportunities(stage.id).map(opp => (
                  <div key={opp.id} className="bg-surface rounded-lg p-4 border border-gray-700 hover:border-primary transition-colors">
                    <h4 className="font-bold text-white text-sm mb-2">{opp.name}</h4>
                    <p className="text-xs text-gray-400 mb-2">{opp.party}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-accent font-bold">${opp.amount.toLocaleString()}</span>
                      <span className="text-xs text-gray-500">{opp.probability}%</span>
                    </div>
                    <div className="flex gap-1 mt-3">
                      {stage.id !== 'Closed Won' && stage.id !== 'Closed Lost' && (
                        <>
                          {stages.filter(s => s.id !== stage.id && s.id !== 'Closed Lost').map(s => (
                            <button key={s.id} onClick={() => handleMoveStage(opp.id, s.id)}
                              className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded hover:bg-gray-600">
                              → {s.id}
                            </button>
                          ))}
                        </>
                      )}
                      <button onClick={() => handleDelete(opp.id)} className="text-xs text-red-400 hover:text-red-300 ml-auto">×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-surface rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Party</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Stage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Probability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {opportunities.map(opp => (
                <tr key={opp.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 text-white font-medium">{opp.name}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{opp.party}</td>
                  <td className="px-6 py-4 text-accent font-medium">${opp.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded ${stages.find(s => s.id === opp.stage)?.color || ''}`}>
                      {opp.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{opp.probability}%</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button onClick={() => handleDelete(opp.id)} className="text-red-400 hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {opportunities.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              <span className="text-4xl mb-4 block">💰</span>
              <p className="text-lg">No opportunities yet</p>
              <p className="text-sm mt-2">Create your first deal to start tracking.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">New Opportunity</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Opportunity Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Party (Lead/Customer)</label>
                <input type="text" value={form.party} onChange={e => setForm({...form, party: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Amount ($)</label>
                  <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Probability (%)</label>
                  <input type="number" value={form.probability} onChange={e => setForm({...form, probability: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Stage</label>
                <select value={form.stage} onChange={e => setForm({...form, stage: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                  {stages.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Expected Closing</label>
                <input type="date" value={form.expectedClosing} onChange={e => setForm({...form, expectedClosing: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700">Cancel</button>
              <button onClick={handleAdd} disabled={!form.name.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">
                Create Opportunity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}