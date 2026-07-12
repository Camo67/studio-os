'use client';

import React, { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  as?: 'input' | 'select' | 'textarea';
}

export function FormField({ label, type = 'text', value, onChange, placeholder, required, options, as = 'input' }: FormFieldProps) {
  const baseClass = "w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary";
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      {as === 'select' ? (
        <select value={value} onChange={onChange} className={baseClass} required={required}>
          <option value="">Select...</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : as === 'textarea' ? (
        <textarea value={value} onChange={onChange} className={baseClass} placeholder={placeholder} required={required} rows={3} />
      ) : (
        <input type={type} value={value} onChange={onChange} className={baseClass} placeholder={placeholder} required={required} />
      )}
    </div>
  );
}

interface ButtonGroupProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  disabled?: boolean;
}

export function ButtonGroup({ onCancel, onSubmit, submitLabel = 'Create', disabled }: ButtonGroupProps) {
  return (
    <div className="flex justify-end gap-2 mt-6">
      <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700">Cancel</button>
      <button type="button" onClick={onSubmit} disabled={disabled} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed">{submitLabel}</button>
    </div>
  );
}