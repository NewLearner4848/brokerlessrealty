import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

interface Settings {
    smtp_host: string;
    smtp_port: string;
    smtp_user: string;
    smtp_pass: string;
    receiver_email: string;
}

const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<Settings>({
        smtp_host: '',
        smtp_port: '',
        smtp_user: '',
        smtp_pass: '',
        receiver_email: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('brokerless-token');
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
                setSettings(prev => ({...prev, ...data}));

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        const token = localStorage.getItem('brokerless-token');

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
            
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsLoading(false);
        }
    };
    
    const inputStyle = "mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]";
    const labelStyle = "block text-sm font-medium text-gray-700";

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
             <h2 className="text-xl font-semibold text-gray-800 mb-2">Email Settings</h2>
             <p className="text-sm text-gray-500 mb-6">Configure the SMTP server for sending contact form notifications. Fields left blank will use environment variables on the server as a fallback, if available.</p>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="receiver_email" className={labelStyle}>Recipient Email</label>
                    <input type="email" name="receiver_email" id="receiver_email" value={settings.receiver_email} onChange={handleChange} className={inputStyle} placeholder="notifications@example.com" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="smtp_host" className={labelStyle}>SMTP Host</label>
                        <input type="text" name="smtp_host" id="smtp_host" value={settings.smtp_host} onChange={handleChange} className={inputStyle} placeholder="smtp.mailprovider.com" />
                    </div>
                    <div>
                        <label htmlFor="smtp_port" className={labelStyle}>SMTP Port</label>
                        <input type="text" name="smtp_port" id="smtp_port" value={settings.smtp_port} onChange={handleChange} className={inputStyle} placeholder="587" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="smtp_user" className={labelStyle}>SMTP Username</label>
                        <input type="text" name="smtp_user" id="smtp_user" value={settings.smtp_user} onChange={handleChange} className={inputStyle} placeholder="your-email@example.com" />
                    </div>
                    <div>
                        <label htmlFor="smtp_pass" className={labelStyle}>SMTP Password</label>
                        <input type="password" name="smtp_pass" id="smtp_pass" value={settings.smtp_pass} onChange={handleChange} className={inputStyle} placeholder="••••••••••••" />
                    </div>
                </div>

                {message && (
                    <div className={`text-center p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <div className="text-right">
                    <button type="submit" disabled={isLoading} className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white disabled:opacity-50" style={{ background: 'var(--gradient-primary)' }}>
                        {isLoading ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
             </form>
        </div>
    );
};

export default SettingsPage;