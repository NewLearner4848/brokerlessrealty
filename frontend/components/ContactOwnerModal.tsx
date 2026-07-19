

import React, { useState } from 'react';
import { Property } from '../types';
import { API_BASE_URL } from '../config';

interface ContactOwnerModalProps {
    isOpen: boolean;
    onClose: () => void;
    property: Property | null;
}

const ContactOwnerModal: React.FC<ContactOwnerModalProps> = ({ isOpen, onClose, property }) => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ status: 'success' | 'error' | null; message: string }>({ status: null, message: '' });

    if (!isOpen || !property) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus({ status: null, message: '' });

        const finalMessage = JSON.stringify({
            inquiryType: 'Buy',
            property: `${property.title} (ID: ${property.id})`,
            userMessage: formData.message
        });
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: finalMessage
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'An error occurred.');
            
            setSubmitStatus({ status: 'success', message: 'Your inquiry has been sent!' });
            setFormData({ name: '', email: '', phone: '', message: '' });
            setTimeout(onClose, 2000); // Close modal after 2 seconds on success

        } catch (error: any) {
            setSubmitStatus({ status: 'error', message: error.message || 'Failed to send message.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Contact Owner</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <p className="text-sm text-gray-600 mb-4">You are inquiring about: <strong className="text-gray-800">{property.title}</strong></p>
                    {submitStatus.status ? (
                        <div className={`text-center p-4 rounded-md text-sm ${submitStatus.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {submitStatus.message}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyle} required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputStyle} required />
                            </div>
                             <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputStyle} required />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} rows={3} className={inputStyle} required />
                            </div>
                            <div className="flex justify-end space-x-3 pt-2">
                                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="text-white font-semibold py-2 px-4 rounded-lg shadow-md disabled:opacity-50" style={{ background: 'var(--gradient-primary)' }}>
                                    {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactOwnerModal;