

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

interface Contact {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    message: string;
    created_at: string;
}

const parseMessage = (message: string) => {
    try {
        const data = JSON.parse(message);
        if (typeof data === 'object' && data !== null) {
            const budget = data.budget || data.expectedPrice || data.maxBudget;
            const location = data.location || data.propertyLocation || data.preferredLocation;
            return {
                inquiryType: data.inquiryType || 'N/A',
                details: [
                    data.property ? `Property: ${data.property}` : null,
                    budget ? `Budget: ${budget}` : null,
                    location ? `Location: ${location}` : null,
                ].filter(Boolean).join('; ') || 'N/A',
                userMessage: data.userMessage || message,
            };
        }
    } catch (e) {
        // Not JSON
    }
    return {
        inquiryType: 'Legacy',
        details: 'N/A',
        userMessage: message,
    };
};


const DashboardPage: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContacts = async () => {
            const token = localStorage.getItem('brokerless-token');
            if (!token) {
                navigate('/admin/login');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/contact`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('brokerless-token');
                    navigate('/admin/login');
                    return;
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch contacts');
                }

                const data: Contact[] = await response.json();
                setContacts(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContacts();
    }, [navigate]);


    return (
        <div>
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Form Submissions</h2>
                {isLoading && <p>Loading contacts...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!isLoading && !error && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inquiry Type</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {contacts.length > 0 ? contacts.map((contact) => {
                                    const { inquiryType, details, userMessage } = parseMessage(contact.message);
                                    return (
                                        <tr key={contact.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contact.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.phone_number || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inquiryType}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={details}>{details}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500"><p className="max-w-xs truncate hover:whitespace-normal" title={userMessage}>{userMessage}</p></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(contact.created_at).toLocaleString()}</td>
                                        </tr>
                                    )
                                }) : (
                                    <tr><td colSpan={7} className="text-center py-4">No contacts found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;