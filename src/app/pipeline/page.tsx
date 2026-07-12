'use client';

import React, { useState } from 'react';
import { Modal, FormField, ButtonGroup } from '@/components/ui/Modal';

const initialStages = [
  { id: 'INQUIRY', title: 'Inquiry', deals: [] },
  { id: 'QUALIFIED', title: 'Qualified', deals: [] },
  { id: 'PROPOSAL', title: 'Proposal', deals: [] },
  { id: 'NEGOTIATION', title: 'Negotiation', deals: [] },
  { id: 'WON', title: 'Won', deals: [] },
  { id: 'LOST', title: 'Lost', deals: [] },
];

type Deal = { id: string; title: string; value: number; contact: string };
type Stage = { id: string; title: string; deals: Deal[] };

export default function PipelinePage() {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [showModal, setShowModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState('INQUIRY');
  const [form, setForm] = useState({ title: '', value: '', contact: '' });

  const handleDragStart = (e: React.DragEvent, dealId: string, sourceStageId: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ dealId, sourceStageId }));
  };

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { dealId, sourceStageId } = data;
    if (sourceStageId === targetStageId) return;

    setStages(prevStages => {
      const newStages = JSON.parse(JSON.stringify(prevStages)) as Stage[];
      const sourceStage = newStages.find(s => s.id === sourceStageId)!;
      const dealIndex = sourceStage.deals.findIndex((d: Deal) => d.id === dealId);
      const [movedDeal] = sourceStage.deals.splice(dealIndex, 1);
      const targetStage = newStages.find(s => s.id === targetStageId)!;
      targetStage.deals.push(movedDeal);
      return newStages;
    });
  };

  const handleAddDeal = () => {
    const newDeal: Deal = {
      id: Date.now().toString(),
      title: form.title,
      value: parseFloat(form.value) || 0,
      contact: form.contact,
    };
    setStages(prev => prev.map(s => 
      s.id === selectedStage ? { ...s, deals: [...s.deals, newDeal] } : s
    ));
    setShowModal(false);
    setForm({ title: '', value: '', contact: '' });
  };

  const handleDeleteDeal = (dealId: string, stageId: string) => {
    setStages(prev => prev.map(s => 
      s.id === stageId ? { ...s, deals: s.deals.filter(d => d.id !== dealId) } : s
    ));
  };

  const totalValue = stages.reduce((acc, stage) => 
    acc + stage.deals.reduce((sum, deal) => sum + deal.value, 0), 0
  );

  return (
    <div className="flex h-full flex-col">
      <header className="bg-surface border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Sales Pipeline</h1>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Pipeline Value</p>
              <p className="text-2xl font-bold text-accent">${totalValue.toLocaleString()}</p>
            </div>
            <button onClick={() => { setSelectedStage('INQUIRY'); setShowModal(true); }} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
              + New Deal
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto p-6 bg-background/80">
        <div className="flex gap-6 h-full min-w-max">
          {stages.map(stage => (
            <div
              key={stage.id}
              className="w-80 bg-surface rounded-lg p-4 flex flex-col"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white">{stage.title}</h3>
                <span className="bg-primary/20 text-primary-light text-sm px-2 py-1 rounded-full">
                  {stage.deals.length}
                </span>
              </div>
              
              <div className="flex-1 space-y-3">
                {stage.deals.map(deal => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal.id, stage.id)}
                    className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700 cursor-move hover:border-primary transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-white">{deal.title}</h4>
                      <button onClick={() => handleDeleteDeal(deal.id, stage.id)} className="text-gray-500 hover:text-danger text-sm">×</button>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{deal.contact}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-lg font-bold text-accent">${deal.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                
                {stage.deals.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">No deals yet</div>
                )}
              </div>
              
              <button onClick={() => { setSelectedStage(stage.id); setShowModal(true); }} className="mt-4 w-full py-2 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-primary hover:text-primary transition-colors">
                + Add Deal
              </button>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Add Deal to ${selectedStage}`}>
        <FormField label="Deal Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g., Corporate Brand Video" required />
        <FormField label="Deal Value ($)" type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} placeholder="5000" required />
        <FormField label="Contact" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} placeholder="Client name" required />
        <ButtonGroup onCancel={() => setShowModal(false)} onSubmit={handleAddDeal} />
      </Modal>
    </div>
  );
}