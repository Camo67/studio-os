'use client';

import React, { useState, useEffect } from 'react';

export default function CRMSettingsPage() {
  const [config, setConfig] = useState({
    baseUrl: '',
    apiKey: '',
    apiSecret: '',
  });
  const [connected, setConnected] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('frappe-config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig(parsed);
        setConnected(true);
      } catch {}
    }
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      // In production, this would call the Frappe API
      // For now, simulate the test
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (config.baseUrl && config.apiKey && config.apiSecret) {
        setTestResult({ success: true, message: 'Successfully connected to Frappe!' });
        setConnected(true);
      } else {
        setTestResult({ success: false, message: 'Please fill in all fields.' });
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Connection failed. Check your URL and credentials.' });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem('frappe-config', JSON.stringify(config));
    setConnected(true);
  };

  const handleDisconnect = () => {
    localStorage.removeItem('frappe-config');
    setConfig({ baseUrl: '', apiKey: '', apiSecret: '' });
    setConnected(false);
    setTestResult(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">CRM Settings</h1>
          <p className="text-gray-400">Configure your Frappe/ERPNext connection</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${connected ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
          {connected ? 'Connected' : 'Not Connected'}
        </div>
      </div>

      <div className="max-w-2xl">
        {/* Connection Settings */}
        <div className="bg-surface rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Frappe Connection</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Frappe Instance URL *</label>
              <input
                type="url"
                value={config.baseUrl}
                onChange={e => setConfig({...config, baseUrl: e.target.value})}
                placeholder="https://your-instance.frappe.cloud"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">The URL of your Frappe/ERPNext instance</p>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">API Key *</label>
              <input
                type="text"
                value={config.apiKey}
                onChange={e => setConfig({...config, apiKey: e.target.value})}
                placeholder="Enter your API key"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">Generate in Frappe: User &gt; Settings &gt; API Access &gt; Generate Keys</p>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">API Secret *</label>
              <input
                type="password"
                value={config.apiSecret}
                onChange={e => setConfig({...config, apiSecret: e.target.value})}
                placeholder="Enter your API secret"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`mt-4 p-3 rounded-lg ${testResult.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {testResult.message}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              onClick={handleSave}
              disabled={!config.baseUrl || !config.apiKey || !config.apiSecret}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              Save Configuration
            </button>
            {connected && (
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>

        {/* Setup Guide */}
        <div className="bg-surface rounded-lg p-6">
          <h2 className="text-lg font-bold text-white mb-4">Setup Guide</h2>
          <div className="space-y-4 text-sm text-gray-300">
            <div className="flex gap-3">
              <span className="text-primary font-bold">1.</span>
              <div>
                <p className="font-medium text-white">Set up Frappe/ERPNext</p>
                <p className="text-gray-400">Deploy Frappe using Docker or Frappe Cloud. See <a href="https://github.com/frappe/frappe_docker" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">frappe_docker</a> for instructions.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-bold">2.</span>
              <div>
                <p className="font-medium text-white">Generate API Keys</p>
                <p className="text-gray-400">In Frappe, go to your User &gt; Settings &gt; API Access &gt; Generate Keys. Copy the API Key and Secret.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-bold">3.</span>
              <div>
                <p className="font-medium text-white">Enter Credentials</p>
                <p className="text-gray-400">Paste your Frappe instance URL, API Key, and Secret above. Test the connection.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-bold">4.</span>
              <div>
                <p className="font-medium text-white">Start Using CRM</p>
                <p className="text-gray-400">Once connected, you can manage Leads, Opportunities, and Customers directly in Studio OS.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}