import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

interface RentInquiry {
    id: number;
    user_type: 'owner' | 'tenant';
    full_name: string;
    mobile_number: string;
    email?: string;
    location_preference: string;
    budget: string;
    timeline: string;
    property_type?: string;
    property_address?: string;
    area_sqft?: string;
    furnishing_status?: string;
    available_from?: string;
    configuration?: string;
    furnishing_preference?: string;
    created_at: string;
}

const RentInquiriesPage: React.FC = () => {
    const [inquiries, setInquiries] = useState<RentInquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInquiries = async () => {
            const token = localStorage.getItem('brokerless-token');
            if (!token) {
                navigate('/admin/login');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/rent-inquiries`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('brokerless-token');
                    navigate('/admin/login');
                    return;
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch rent inquiries');
                }

                const data: RentInquiry[] = await response.json();
                setInquiries(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInquiries();
    }, [navigate]);

    const THead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{children}</th>
    );
    const TData: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{children || 'N/A'}</td>
    );

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Rent Inquiries</h2>
            {isLoading && <p>Loading inquiries...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && !error && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <THead>Received</THead>
                                <THead>User Type</THead>
                                <THead>Name</THead>
                                <THead>Mobile</THead>
                                <THead>Email</THead>
                                <THead>Location</THead>
                                <THead>Budget</THead>
                                <THead>Timeline</THead>
                                <THead>Prop. Type</THead>
                                <THead>Prop. Address</THead>
                                <THead>Area (sqft)</THead>
                                <THead>Furnishing</THead>
                                <THead>Available From</THead>
                                <THead>Configuration</THead>
                                <THead>Furn. Preference</THead>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {inquiries.length > 0 ? inquiries.map((item) => (
                                <tr key={item.id}>
                                    <TData>{new Date(item.created_at).toLocaleString()}</TData>
                                    <TData><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.user_type === 'owner' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{item.user_type}</span></TData>
                                    <TData>{item.full_name}</TData>
                                    <TData>{item.mobile_number}</TData>
                                    <TData>{item.email}</TData>
                                    <TData>{item.location_preference}</TData>
                                    <TData>{item.budget}</TData>
                                    <TData>{item.timeline}</TData>
                                    <TData>{item.property_type}</TData>
                                    <TData>{item.property_address}</TData>
                                    <TData>{item.area_sqft}</TData>
                                    <TData>{item.furnishing_status}</TData>
                                    <TData>{item.available_from}</TData>
                                    <TData>{item.configuration}</TData>
                                    <TData>{item.furnishing_preference}</TData>
                                </tr>
                            )) : (
                                <tr><td colSpan={15} className="text-center py-4">No rent inquiries found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RentInquiriesPage;
