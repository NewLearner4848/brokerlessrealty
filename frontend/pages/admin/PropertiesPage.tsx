import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '../../types';
import Modal from '../../components/admin/Modal';
import PropertyForm from '../../components/admin/PropertyForm';
import { API_BASE_URL } from '../../config';

const PropertiesPage: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);

    const fetchProperties = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/properties`);
            if (!response.ok) throw new Error('Failed to fetch properties');
            const data = await response.json();

            // Fix: Parse JSON string fields into arrays for frontend consumption
            const parsedData = data.map((prop: any) => ({
                ...prop,
                features: typeof prop.features === 'string' ? JSON.parse(prop.features) : (prop.features || []),
                images: typeof prop.images === 'string' ? JSON.parse(prop.images) : (prop.images || []),
            }));

            setProperties(parsedData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);
    
    const handleAddNew = () => {
        setEditingProperty(null);
        setIsModalOpen(true);
    };
    
    const handleEdit = (property: Property) => {
        setEditingProperty(property);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this property?')) return;

        const token = localStorage.getItem('brokerless-token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to delete property');
            fetchProperties(); // Refresh list
        } catch (err: any) {
            setError(err.message);
        }
    };
    
    const handleFormSubmit = async (formData: FormData) => {
        const token = localStorage.getItem('brokerless-token');
        const url = editingProperty
            ? `${API_BASE_URL}/api/properties/${editingProperty.id}`
            : `${API_BASE_URL}/api/properties`;
        const method = editingProperty ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    // Content-Type is not set, browser handles it for FormData
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
             if (response.status === 401 || response.status === 403) {
                navigate('/admin/login');
                return;
            }
            if (!response.ok) {
                 const errData = await response.json();
                 throw new Error(errData.message || `Failed to ${editingProperty ? 'update' : 'create'} property`);
            }

            setIsModalOpen(false);
            fetchProperties(); // Refresh list
        } catch (err: any) {
            setError(err.message);
            alert(`Error: ${err.message}`); // Show error to user
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Property Management</h1>
                <button
                    onClick={handleAddNew}
                    className="text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    style={{ background: 'var(--gradient-primary)' }}
                >
                    + Add Property
                </button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                 <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading && <tr><td colSpan={5} className="text-center py-4">Loading...</td></tr>}
                        {error && <tr><td colSpan={5} className="text-center py-4 text-red-500">{error}</td></tr>}
                        {!isLoading && !error && properties.map(prop => (
                            <tr key={prop.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prop.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prop.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${prop.price.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prop.isFeatured ? 'Yes' : 'No'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button onClick={() => handleEdit(prop)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                    <button onClick={() => handleDelete(prop.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProperty ? 'Edit Property' : 'Add New Property'}>
                <PropertyForm 
                    onSubmit={handleFormSubmit} 
                    onCancel={() => setIsModalOpen(false)} 
                    initialData={editingProperty}
                />
            </Modal>
        </div>
    );
};

export default PropertiesPage;