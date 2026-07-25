import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

interface Settings {
  smtp_host: string;
  smtp_port: string;
  smtp_user: string;
  smtp_pass: string;
  receiver_email: string;
  api_key?: string;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'crm' | 'smtp'>('crm');
  const [settings, setSettings] = useState<Settings>({
    smtp_host: '',
    smtp_port: '',
    smtp_user: '',
    smtp_pass: '',
    receiver_email: '',
    api_key: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isRegeneratingKey, setIsRegeneratingKey] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCodeTab, setCopiedCodeTab] = useState<string | null>(null);
  const [codeLanguage, setCodeLanguage] = useState<'curl' | 'js' | 'python'>('curl');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();

  const getAuthToken = () => localStorage.getItem('brokerless-token') || '';

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      const token = getAuthToken();
      if (!token) {
        navigate('/admin/login');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/settings`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('brokerless-token');
          navigate('/admin/login');
          return;
        }

        if (!response.ok) throw new Error('Failed to fetch settings.');

        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
      } catch (error: any) {
        setMessage({ type: 'error', text: error.message });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSmtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    const token = getAuthToken();

    try {
      const response = await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update settings.');

      setMessage({ type: 'success', text: 'Email settings updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateApiKey = async () => {
    if (!window.confirm('Are you sure you want to regenerate your API key? Any CRM system using the current key will lose access until updated.')) {
      return;
    }

    setIsRegeneratingKey(true);
    setMessage(null);
    const token = getAuthToken();

    try {
      const res = await fetch(`${API_BASE_URL}/api/settings/api-key/regenerate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to regenerate API key');

      setSettings(prev => ({ ...prev, api_key: data.api_key }));
      setMessage({ type: 'success', text: 'API Key regenerated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error regenerating API Key' });
    } finally {
      setIsRegeneratingKey(false);
    }
  };

  const copyToClipboard = (text: string, type: 'key' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 3000);
    } else {
      setCopiedCodeTab(codeLanguage);
      setTimeout(() => setCopiedCodeTab(null), 3000);
    }
  };

  const currentApiKey = settings.api_key || 'bk_live_loading_key...';

  // Code snippets for CRM integration
  const codeSnippets = {
    curl: `curl -X GET "${API_BASE_URL}/api/crm/all" \\\n  -H "x-api-key: ${currentApiKey}"`,
    js: `// Fetch all leads & inquiries into CRM using JavaScript / Node.js
fetch("${API_BASE_URL}/api/crm/all", {
  method: "GET",
  headers: {
    "x-api-key": "${currentApiKey}"
  }
})
.then(res => res.json())
.then(data => console.log("CRM Payload:", data));`,
    python: `# Fetch all leads & inquiries into CRM using Python
import requests

url = "${API_BASE_URL}/api/crm/all"
headers = {
    "x-api-key": "${currentApiKey}"
}

response = requests.get(url, headers=headers)
crm_data = response.json()
print("Total Leads:", crm_data['summary']['totalLeads'])`
  };

  const inputStyle = "mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-[#009688] focus:border-[#009688]";
  const labelStyle = "block text-xs font-bold text-gray-700";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Settings & Integrations</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your CRM API Access Keys, data endpoints, and SMTP server configuration.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 bg-gray-100 p-1.5 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('crm')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'crm' ? 'bg-white text-[#009688] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🔑 API & CRM Access
          </button>
          <button
            onClick={() => setActiveTab('smtp')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'smtp' ? 'bg-white text-[#009688] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ✉️ Email SMTP
          </button>
        </div>
      </div>

      {/* Global Message Banner */}
      {message && (
        <div className={`p-4 rounded-xl text-xs font-medium border ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* TAB 1: API Key & CRM Integration */}
      {activeTab === 'crm' && (
        <div className="space-y-6">
          {/* API Key Box */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#009688]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 016-6h4a6 6 0 016 6z" />
                  </svg>
                  Admin CRM API Key
                </h3>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md uppercase">
                  Active
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Use this Secret API Key to securely pull submissions, property leads, rent inquiries, and subscribers into your external CRM (RiffCRM, Salesforce, HubSpot, or custom webhook).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-grow">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  readOnly
                  value={currentApiKey}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs text-gray-900 focus:outline-none pr-20"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-800 font-semibold px-2 py-1 bg-white rounded-md border border-gray-200"
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </button>
              </div>

              <button
                onClick={() => copyToClipboard(currentApiKey, 'key')}
                className="px-5 py-3 bg-[#009688] hover:bg-[#00796B] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center flex-shrink-0"
              >
                {copiedKey ? '✓ Copied!' : 'Copy API Key'}
              </button>

              <button
                onClick={handleRegenerateApiKey}
                disabled={isRegeneratingKey}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors flex-shrink-0 disabled:opacity-50"
              >
                {isRegeneratingKey ? 'Regenerating...' : 'Regenerate'}
              </button>
            </div>
          </div>

          {/* CRM Endpoints Reference Table */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900">CRM Data Fetch Endpoints</h3>
            <p className="text-xs text-gray-500">
              Pass your API key in the header <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-800">x-api-key: {currentApiKey.slice(0, 12)}...</code> or as query parameter <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-800">?api_key=...</code> to fetch JSON data.
            </p>

            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 uppercase font-semibold text-[10px]">
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Endpoint</th>
                    <th className="py-3 px-4">Data Returned</th>
                    <th className="py-3 px-4 text-right">Quick Test</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50/70">
                    <td className="py-3 px-4"><span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded">GET</span></td>
                    <td className="py-3 px-4 font-mono font-semibold text-gray-900">/api/crm/all</td>
                    <td className="py-3 px-4 text-gray-600">Unified Sync: Leads, Rent Inquiries, Subscribers & Properties</td>
                    <td className="py-3 px-4 text-right">
                      <a href={`${API_BASE_URL}/api/crm/all?api_key=${currentApiKey}`} target="_blank" rel="noreferrer" className="text-[#009688] font-bold hover:underline">Test ↗</a>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/70">
                    <td className="py-3 px-4"><span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded">GET</span></td>
                    <td className="py-3 px-4 font-mono font-semibold text-gray-900">/api/crm/leads</td>
                    <td className="py-3 px-4 text-gray-600">Contact Form Submissions (Name, Email, Phone, Message)</td>
                    <td className="py-3 px-4 text-right">
                      <a href={`${API_BASE_URL}/api/crm/leads?api_key=${currentApiKey}`} target="_blank" rel="noreferrer" className="text-[#009688] font-bold hover:underline">Test ↗</a>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/70">
                    <td className="py-3 px-4"><span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded">GET</span></td>
                    <td className="py-3 px-4 font-mono font-semibold text-gray-900">/api/crm/rent-inquiries</td>
                    <td className="py-3 px-4 text-gray-600">Rental Inquiries (Tenant & Landlord requirements)</td>
                    <td className="py-3 px-4 text-right">
                      <a href={`${API_BASE_URL}/api/crm/rent-inquiries?api_key=${currentApiKey}`} target="_blank" rel="noreferrer" className="text-[#009688] font-bold hover:underline">Test ↗</a>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/70">
                    <td className="py-3 px-4"><span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded">GET</span></td>
                    <td className="py-3 px-4 font-mono font-semibold text-gray-900">/api/crm/subscribers</td>
                    <td className="py-3 px-4 text-gray-600">Newsletter Email Subscribers list</td>
                    <td className="py-3 px-4 text-right">
                      <a href={`${API_BASE_URL}/api/crm/subscribers?api_key=${currentApiKey}`} target="_blank" rel="noreferrer" className="text-[#009688] font-bold hover:underline">Test ↗</a>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/70">
                    <td className="py-3 px-4"><span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded">GET</span></td>
                    <td className="py-3 px-4 font-mono font-semibold text-gray-900">/api/crm/properties</td>
                    <td className="py-3 px-4 text-gray-600">All Property Listings & pricing data</td>
                    <td className="py-3 px-4 text-right">
                      <a href={`${API_BASE_URL}/api/crm/properties?api_key=${currentApiKey}`} target="_blank" rel="noreferrer" className="text-[#009688] font-bold hover:underline">Test ↗</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Code Snippets for CRM Integration */}
          <div className="bg-gray-900 text-gray-100 p-6 sm:p-8 rounded-2xl shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">CRM Integration Code Generator</h3>
                <p className="text-xs text-gray-400">Copy pre-formatted code snippets to connect RiffCRM, Python scripts, or Zapier.</p>
              </div>

              <div className="flex items-center space-x-2 bg-gray-800 p-1 rounded-lg">
                {(['curl', 'js', 'python'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setCodeLanguage(lang)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      codeLanguage === lang ? 'bg-[#009688] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {lang === 'curl' ? 'cURL' : lang === 'js' ? 'Node.js / JS' : 'Python'}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative bg-gray-950 p-4 rounded-xl border border-gray-800 font-mono text-xs text-emerald-400 overflow-x-auto">
              <button
                onClick={() => copyToClipboard(codeSnippets[codeLanguage], 'code')}
                className="absolute top-3 right-3 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-md text-[11px] font-sans font-bold transition-all"
              >
                {copiedCodeTab === codeLanguage ? '✓ Copied Code!' : 'Copy Code'}
              </button>
              <pre className="whitespace-pre">{codeSnippets[codeLanguage]}</pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SMTP Email Settings */}
      {activeTab === 'smtp' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">SMTP Email Server Settings</h2>
            <p className="text-xs text-gray-500 mt-1">
              Configure your outbound SMTP mail server to dispatch email notifications whenever a user submits a contact form.
            </p>
          </div>

          <form onSubmit={handleSmtpSubmit} className="space-y-4">
            <div>
              <label htmlFor="receiver_email" className={labelStyle}>Notification Recipient Email</label>
              <input
                type="email"
                name="receiver_email"
                id="receiver_email"
                value={settings.receiver_email}
                onChange={handleChange}
                className={inputStyle}
                placeholder="admin@brokerlessrealty.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="smtp_host" className={labelStyle}>SMTP Host</label>
                <input
                  type="text"
                  name="smtp_host"
                  id="smtp_host"
                  value={settings.smtp_host}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div>
                <label htmlFor="smtp_port" className={labelStyle}>SMTP Port</label>
                <input
                  type="text"
                  name="smtp_port"
                  id="smtp_port"
                  value={settings.smtp_port}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="587"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="smtp_user" className={labelStyle}>SMTP Username</label>
                <input
                  type="text"
                  name="smtp_user"
                  id="smtp_user"
                  value={settings.smtp_user}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="your-smtp-email@gmail.com"
                />
              </div>
              <div>
                <label htmlFor="smtp_pass" className={labelStyle}>SMTP Password / App Password</label>
                <input
                  type="password"
                  name="smtp_pass"
                  id="smtp_pass"
                  value={settings.smtp_pass}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 text-right">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-[#009688] hover:bg-[#00796B] text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Email Settings'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;