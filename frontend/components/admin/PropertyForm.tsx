import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Property } from '../../types';
import { API_BASE_URL } from '../../config';

type FormDataState = Omit<Property, 'id' | 'created_at' | 'price' | 'bedrooms' | 'bathrooms' | 'area'> & {
    price: number | string;
    bedrooms: number | string;
    bathrooms: number | string;
    area: number | string;
};


interface PropertyFormProps {
    initialData?: Property | null;
    onSubmit: (data: FormData) => void;
    onCancel: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<FormDataState>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        originalPrice: initialData?.originalPrice,
        savingsText: initialData?.savingsText || '',
        address: initialData?.address || '',
        city: initialData?.city || '',
        type: initialData?.type || 'House',
        bedrooms: initialData?.bedrooms || '',
        bathrooms: initialData?.bathrooms || '',
        area: initialData?.area || '',
        features: initialData?.features || [],
        images: initialData?.images || [],
        isFeatured: initialData?.isFeatured || false,
    });

    const [imageFiles, setImageFiles] = useState<FileList | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target;
        const name = target.name;

        if (target instanceof HTMLInputElement && target.type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: target.checked }));
        } else {
            const value = target.value;
            if (name === 'features') {
                setFormData(prev => ({ ...prev, [name]: value.split(',').map(item => item.trim()).filter(Boolean) }));
            } else {
                setFormData(prev => ({ ...prev, [name]: value }));
            }
        }
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        const fd = new FormData();

        // Append all fields from state.
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'images') {
                // Handled below
                return;
            }
            if (key === 'features') {
                fd.append(key, (value as string[]).join(','));
                return;
            }
             if (key === 'isFeatured') {
                fd.append(key, String(value));
                return;
            }
            if (value !== null && value !== undefined) {
                 fd.append(key, String(value));
            }
        });

        // Append new image files if they exist
        if (imageFiles && imageFiles.length > 0) {
            for (let i = 0; i < imageFiles.length; i++) {
                fd.append('images', imageFiles[i]);
            }
        } else if (initialData) {
            // If editing and no new files, append existing image URLs as a JSON string
            fd.append('images', JSON.stringify(formData.images));
        }
        
        onSubmit(fd);
    };
    
    const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm";
    const labelStyle = "block text-sm font-medium text-gray-700";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className={labelStyle}>Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputStyle} required />
            </div>
            <div>
                <label htmlFor="description" className={labelStyle}>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className={inputStyle} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="price" className={labelStyle}>Price</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className={inputStyle} required />
                </div>
                 <div>
                    <label htmlFor="originalPrice" className={labelStyle}>Original Price (Optional)</label>
                    <input type="number" name="originalPrice" value={formData.originalPrice || ''} onChange={handleChange} className={inputStyle} />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="savingsText" className={labelStyle}>Savings Text (Optional)</label>
                    <input type="text" name="savingsText" value={formData.savingsText || ''} onChange={handleChange} className={inputStyle} placeholder="e.g. Save 15 Lakhs" />
                </div>
                <div>
                    <label htmlFor="type" className={labelStyle}>Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className={inputStyle}>
                        <option>House</option>
                        <option>Apartment</option>
                        <option>Condo</option>
                        <option>Land</option>
                        <option>Villa</option>
                        <option>Heritage House</option>
                    </select>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="address" className={labelStyle}>Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className={inputStyle} required />
                </div>
                <div>
                    <label htmlFor="city" className={labelStyle}>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputStyle} required />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="bedrooms" className={labelStyle}>Bedrooms</label>
                    <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className={inputStyle} required />
                </div>
                <div>
                    <label htmlFor="bathrooms" className={labelStyle}>Bathrooms</label>
                    <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className={inputStyle} required />
                </div>
                 <div>
                    <label htmlFor="area" className={labelStyle}>Area (sqft)</label>
                    <input type="number" name="area" value={formData.area} onChange={handleChange} className={inputStyle} required />
                </div>
            </div>
             <div>
                <label htmlFor="features" className={labelStyle}>Features (comma-separated)</label>
                <textarea name="features" value={formData.features.join(', ')} onChange={handleChange} rows={2} className={inputStyle} />
            </div>
             <div>
                <label className={labelStyle}>Current Images</label>
                <div className="mt-1 flex flex-wrap gap-2 p-2 bg-gray-50 border rounded-md min-h-[6rem]">
                    {(formData.images || []).map((img, index) => (
                        <img key={index} src={img.startsWith('http') ? img : `${API_BASE_URL}${img}`} alt={`Property image ${index + 1}`} className="h-20 w-20 object-cover rounded-md shadow-sm" />
                    ))}
                    {(formData.images || []).length === 0 && <p className="text-sm text-gray-500 self-center">No images.</p>}
                </div>
            </div>
             <div>
                <label htmlFor="image-upload" className={labelStyle}>Upload New Images (replaces all existing)</label>
                <input 
                    id="image-upload"
                    type="file" 
                    name="images" 
                    multiple 
                    accept="image/png, image/jpeg, image/gif, image/webp"
                    onChange={(e) => setImageFiles(e.target.files)} 
                    className={`${inputStyle} p-0 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer`} 
                />
            </div>
            <div className="flex items-center">
                <input type="checkbox" name="isFeatured" id="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"/>
                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">Mark as Featured</label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                <button type="submit" className="text-white font-semibold py-2 px-4 rounded-lg shadow-md" style={{ background: 'var(--gradient-primary)' }}>Save Property</button>
            </div>
        </form>
    );
};

export default PropertyForm;