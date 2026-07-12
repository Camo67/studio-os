'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CRMPage() {
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState({
    leads: 0,
    opportunities: 0,
    customers: 0,
    pipelineValue: 0,
  });

  useEffect(() => {
    // Check if Frappe is configured
    const config = localStorage.getItem('frappe-config');
    if (config) {
      setConnected(true);
      // In production, fetch real stats from Frappe API
      setStats({
        leads: 24,
        opportunities: 12,
        customers: 8,
        pipelineValue: 125000,
      });
    }
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">CRM</h1>
          <p className="text-gray-400">Customer Relationship Management powered by Frappe/ERPNext</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${connected ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
            {connected ? 'Connected to Frappe' : 'Not Connected'}
          </div>
          <Link href="/crm/settings" className="bg-surface border border-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm">
            ⚙️ Settings
          </Link>
        </div>
      </div>

      {/* Connection Banner */}
      {!connected && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔗</span>
              <div>
                <h3 className="font-bold text-white">Connect to Frappe/ERPNext</h3>
                <p className="text-sm text-gray-400">Set up your Frappe instance to sync CRM data</p>
              </div>
            </div>
            <Link href="/crm/settings" className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors">
              Configure Now
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link href="/crm/leads" className="bg-surface rounded-lg p-6 hover:border hover:border-primary transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">🎯</span>
            <span className="text-2xl font-bold text-primary">{stats.leads}</span>
          </div>
          <h3 className="font-bold text-white">Leads</h3>
          <p className="text-sm text-gray-400">Potential customers</p>
        </Link>

        <Link href="/crm/opportunities" className="bg-surface rounded-lg p-6 hover:border hover:border-accent transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">💰</span>
            <span className="text-2xl font-bold text-accent">{stats.opportunities}</span>
          </div>
          <h3 className="font-bold text-white">Opportunities</h3>
          <p className="text-sm text-gray-400">Active deals</p>
        </Link>

        <Link href="/crm/customers" className="bg-surface rounded-lg p-6 hover:border hover:border-green-500 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">👥</span>
            <span className="text-2xl font-bold text-green-400">{stats.customers}</span>
          </div>
          <h3 className="font-bold text-white">Customers</h3>
          <p className="text-sm text-gray-400">Active accounts</p>
        </Link>

        <div className="bg-surface rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">📈</span>
            <span className="text-2xl font-bold text-purple-400">${stats.pipelineValue.toLocaleString()}</span>
          </div>
          <h3 className="font-bold text-white">Pipeline Value</h3>
          <p className="text-sm text-gray-400">Total opportunity value</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface rounded-lg p-6">
          <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/crm/leads" className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <span className="text-xl">➕</span>
              <div>
                <p className="font-medium text-white">New Lead</p>
                <p className="text-xs text-gray-400">Capture a new potential customer</p>
              </div>
            </Link>
            <Link href="/crm/opportunities" className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <span className="text-xl">💼</span>
              <div>
                <p className="font-medium text-white">New Opportunity</p>
                <p className="text-xs text-gray-400">Create a sales deal</p>
              </div>
            </Link>
            <Link href="/crm/contacts" className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <span className="text-xl">👤</span>
              <div>
                <p className="font-medium text-white">Add Contact</p>
                <p className="text-xs text-gray-400">Add a new contact record</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-surface rounded-lg p-6">
          <h2 className="text-lg font-bold text-white mb-4">CRM Workflow</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div className="flex-1 bg-gray-800 rounded-lg p-3">
                <p className="font-medium text-white text-sm">Lead</p>
                <p className="text-xs text-gray-400">Capture potential customer</p>
              </div>
              <span className="text-gray-500">→</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div className="flex-1 bg-gray-800 rounded-lg p-3">
                <p className="font-medium text-white text-sm">Opportunity</p>
                <p className="text-xs text-gray-400">Track sales deal</p>
              </div>
              <span className="text-gray-500">→</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div className="flex-1 bg-gray-800 rounded-lg p-3">
                <p className="font-medium text-white text-sm">Customer</p>
                <p className="text-xs text-gray-400">Convert to customer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}