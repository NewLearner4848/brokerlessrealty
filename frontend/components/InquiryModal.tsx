
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

interface InquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    inquiryType: 'Buy' | 'Rent' | 'Sell' | null;
}

const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, inquiryType }) => {
    const [rentUserType, setRentUserType] = useState<'owner' | 'tenant' | null>(null);

    const initialFormData = {
        // Common
        name: '',
        phone: '',
        email: '',
        location: '',
        budget: '',
        timeline: 'Immediate',
        // Owner specific
        propertyType: 'Apartment',
        propertyAddress: '',
        area: '',
        furnishingStatus: 'Furnished',
        availableFrom: '',
        // Tenant specific
        configuration: '1BHK',
        furnishingPreference: 'Furnished',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ status: 'success' | 'error' | null; message: string }>({ status: null, message: '' });

    // Reset form when modal opens or inquiry type changes
    useEffect(() => {
        if (isOpen) {
            setRentUserType(null);
            setFormData(initialFormData);
            setSubmitStatus({ status: null, message: '' });
        }
    }, [isOpen, inquiryType]);

    if (!isOpen || !inquiryType) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus({ status: null, message: '' });

        let url = '';
        let body: any = {};

        if (inquiryType === 'Rent' && rentUserType) {
            url = `${API_BASE_URL}/api/rent-inquiries`;
            body = {
                userType: rentUserType,
                fullName: formData.name,
                mobileNumber: formData.phone,
                email: formData.email,
                locationPreference: formData.location,
                budget: formData.budget,
                timeline: formData.timeline,
            };

            if (rentUserType === 'owner') {
                body.propertyType = formData.propertyType;
                body.propertyAddress = formData.propertyAddress;
                body.areaSqft = formData.area;
                body.furnishingStatus = formData.furnishingStatus;
                body.availableFrom = formData.availableFrom;
            } else { // tenant
                body.configuration = formData.configuration;
                body.furnishingPreference = formData.furnishingPreference;
            }
        } else if (inquiryType === 'Sell' || inquiryType === 'Buy') {
            url = `${API_BASE_URL}/api/contact`;
            const messagePayload = {
                inquiryType: inquiryType,
                fullName: formData.name,
                mobileNumber: formData.phone,
                email: formData.email,
                [inquiryType === 'Sell' ? 'expectedPrice' : 'maxBudget']: formData.budget,
                [inquiryType === 'Sell' ? 'propertyLocation' : 'preferredLocation']: formData.location,
            };
            body = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: JSON.stringify(messagePayload, null, 2),
            };
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'An error occurred.');
            
            setSubmitStatus({ status: 'success', message: 'Your inquiry has been sent successfully!' });
            setTimeout(onClose, 2500);

        } catch (error: any) {
            setSubmitStatus({ status: 'error', message: error.message || 'Failed to send message.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm";

    const BackButton = () => (
        <button
            type="button"
            onClick={() => setRentUserType(null)}
            className="absolute top-4 left-4 text-gray-500 hover:text-gray-800"
            aria-label="Go back"
        >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
    );

    const renderRentSelection = () => (
        <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">What would you like to do?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => setRentUserType('owner')} className="w-full sm:w-auto text-white font-bold px-8 py-3 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-[var(--color-dark)]">
                    Give on Rent
                </button>
                <button onClick={() => setRentUserType('tenant')} className="w-full sm:w-auto text-white font-bold px-8 py-3 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-[var(--color-secondary)]">
                    Take on Rent
                </button>
            </div>
        </div>
    );

    const renderRentForm = () => (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputStyle} required />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className={inputStyle} required />
                </div>
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Optional)</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location / Area Preference</label>
                <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className={inputStyle} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                        {rentUserType === 'owner' ? 'Expected Rent' : 'Max Budget'}
                    </label>
                    <input type="text" name="budget" id="budget" value={formData.budget} onChange={handleChange} className={inputStyle} required placeholder="e.g., 25,000" />
                </div>
                <div>
                    <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">Timeline</label>
                    <select name="timeline" id="timeline" value={formData.timeline} onChange={handleChange} className={inputStyle} required>
                        <option>Immediate</option>
                        <option>1–3 Months</option>
                        <option>Just Exploring</option>
                    </select>
                </div>
            </div>

            {/* Owner Specific Fields */}
            {rentUserType === 'owner' && (
                <>
                    <hr className="my-4"/>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">Property Type</label>
                            <select name="propertyType" id="propertyType" value={formData.propertyType} onChange={handleChange} className={inputStyle} required>
                                <option>Apartment</option>
                                <option>Villa</option>
                                <option>Commercial</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="furnishingStatus" className="block text-sm font-medium text-gray-700">Furnishing Status</label>
                            <select name="furnishingStatus" id="furnishingStatus" value={formData.furnishingStatus} onChange={handleChange} className={inputStyle} required>
                                <option>Furnished</option>
                                <option>Semi-furnished</option>
                                <option>Unfurnished</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="propertyAddress" className="block text-sm font-medium text-gray-700">Property Address</label>
                        <input type="text" name="propertyAddress" id="propertyAddress" value={formData.propertyAddress} onChange={handleChange} className={inputStyle} required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="area" className="block text-sm font-medium text-gray-700">Carpet / Built-up Area (sqft)</label>
                            <input type="number" name="area" id="area" value={formData.area} onChange={handleChange} className={inputStyle} required />
                        </div>
                        <div>
                            <label htmlFor="availableFrom" className="block text-sm font-medium text-gray-700">Available From</label>
                            <input type="date" name="availableFrom" id="availableFrom" value={formData.availableFrom} onChange={handleChange} className={inputStyle} required />
                        </div>
                    </div>
                </>
            )}

            {/* Tenant Specific Fields */}
            {rentUserType === 'tenant' && (
                <>
                    <hr className="my-4"/>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="configuration" className="block text-sm font-medium text-gray-700">Configuration</label>
                            <select name="configuration" id="configuration" value={formData.configuration} onChange={handleChange} className={inputStyle} required>
                                <option>1BHK</option>
                                <option>2BHK</option>
                                <option>3BHK</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="furnishingPreference" className="block text-sm font-medium text-gray-700">Furnishing Preference</label>
                            <select name="furnishingPreference" id="furnishingPreference" value={formData.furnishingPreference} onChange={handleChange} className={inputStyle} required>
                                <option>Furnished</option>
                                <option>Semi-furnished</option>
                                <option>Unfurnished</option>
                            </select>
                        </div>
                    </div>
                </>
            )}

            <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="text-white font-semibold py-2 px-4 rounded-lg shadow-md disabled:opacity-50" style={{ background: 'var(--gradient-primary)' }}>
                    {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                </button>
            </div>
        </form>
    );

    const renderBuySellForm = () => (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputStyle} required />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={inputStyle} required />
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className={inputStyle} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                        {inquiryType === 'Sell' ? 'Expected Price' : 'Max Budget'}
                    </label>
                    <input type="text" name="budget" id="budget" value={formData.budget} onChange={handleChange} className={inputStyle} required placeholder={inquiryType === 'Sell' ? 'e.g., 80 Lakhs' : 'e.g., 60 Lakhs'} />
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        {inquiryType === 'Sell' ? 'Property City/Area' : 'Preferred City/Area'}
                    </label>
                    <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className={inputStyle} required />
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="text-white font-semibold py-2 px-4 rounded-lg shadow-md disabled:opacity-50" style={{ background: 'var(--gradient-primary)' }}>
                    {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                </button>
            </div>
        </form>
    );

    let modalTitle = `${inquiryType} Inquiry`;
    if (inquiryType === 'Rent' && rentUserType) {
        modalTitle = rentUserType === 'owner' ? 'Give Property on Rent' : 'Take Property on Rent';
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="relative flex justify-between items-center p-4 border-b">
                    {inquiryType === 'Rent' && rentUserType && <BackButton />}
                    <h3 className="text-lg font-semibold text-gray-800 text-center w-full">{modalTitle}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-auto flex-shrink-0">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {submitStatus.status ? (
                        <div className={`text-center p-4 rounded-md text-sm ${submitStatus.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {submitStatus.message}
                        </div>
                    ) : (
                        <>
                            {(inquiryType === 'Sell' || inquiryType === 'Buy') && renderBuySellForm()}
                            {inquiryType === 'Rent' && !rentUserType && renderRentSelection()}
                            {inquiryType === 'Rent' && rentUserType && renderRentForm()}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InquiryModal;