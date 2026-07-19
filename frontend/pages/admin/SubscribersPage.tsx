
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

interface Subscriber {
    id: number;
    email: string;
    created_at: string;
}

const SubscribersPage: React.FC = () => {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubscribers = async () => {
            const token = localStorage.getItem('brokerless-token');
            if (!token) {
                navigate('/admin/login');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/subscribers`, {
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
                    throw new Error('Failed to fetch subscribers');
                }

                const data: Subscriber[] = await response.json();
                setSubscribers(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscribers();
    }, [navigate]);

    return (
        <div>
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Newsletter Subscribers</h2>
                {isLoading && <p>Loading subscribers...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!isLoading && !error && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {subscribers.length > 0 ? subscribers.map((subscriber) => (
                                    <tr key={subscriber.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subscriber.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(subscriber.created_at).toLocaleString()}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={2} className="text-center py-4">No subscribers found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscribersPage;
