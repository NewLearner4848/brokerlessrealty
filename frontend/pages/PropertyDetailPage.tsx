

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Property } from '../types';
import { API_BASE_URL } from '../config';

const ChevronLeft: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRight: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const ImageCarousel: React.FC<{ images: string[] }> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    if (!images || images.length === 0) {
        return (
             <div className="h-[500px] w-full m-auto relative group bg-gray-200 rounded-2xl flex items-center justify-center">
                <p className="text-gray-500">No Image Available</p>
            </div>
        )
    }

    const imageUrl = images[currentIndex].startsWith('http')
        ? images[currentIndex]
        : `${API_BASE_URL}${images[currentIndex]}`;

    return (
        <div className="h-[500px] w-full m-auto relative group">
            <div style={{ backgroundImage: `url(${imageUrl})` }} className="w-full h-full rounded-2xl bg-center bg-cover duration-500 shadow-xl"></div>
            {/* Left Arrow */}
            <div className="hidden group-hover:block absolute top-[50%] -translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/30 text-white cursor-pointer hover:bg-black/50 transition-colors">
                <button onClick={prevSlide} aria-label="Previous image"><ChevronLeft /></button>
            </div>
            {/* Right Arrow */}
            <div className="hidden group-hover:block absolute top-[50%] -translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/30 text-white cursor-pointer hover:bg-black/50 transition-colors">
                <button onClick={nextSlide} aria-label="Next image"><ChevronRight /></button>
            </div>
        </div>
    );
};

const formatPrice = (price?: number): string => {
    if (price === undefined || price === null) return 'N/A';
    const crore = 10000000;
    const lakh = 100000;
    if (price >= crore) {
        const value = (price / crore).toLocaleString('en-IN', { maximumFractionDigits: 2 });
        return `₹${value} Cr`;
    }
    if (price >= lakh) {
        const value = (price / lakh).toLocaleString('en-IN', { maximumFractionDigits: 2 });
        return `₹${value} Lakh`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
};

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ status: 'success' | 'error' | null; message: string }>({ status: null, message: '' });

  useEffect(() => {
    const fetchProperty = async () => {
        if (!id) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/properties/${id}`);
            if (response.status === 404) {
                setProperty(null);
                throw new Error('Property not found.');
            }
            if (!response.ok) {
                throw new Error('Failed to fetch property details.');
            }
            const data = await response.json();
            setProperty(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }
    
    fetchProperty();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ status: null, message: '' });
    
    const finalMessage = JSON.stringify({
        inquiryType: 'Property Inquiry',
        property: `${property?.title} (ID: ${property?.id})`,
        userMessage: formData.message,
    });
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: finalMessage,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'An error occurred.');
      
      setSubmitStatus({ status: 'success', message: data.message });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error: any) {
      setSubmitStatus({ status: 'error', message: error.message || 'Failed to send message.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-20">Loading property details...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }
  
  if (!property) {
    return <div className="text-center py-20">Property not found.</div>;
  }
  
  const inputStyle = "w-full border border-gray-300 rounded-md py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]";

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[var(--color-dark)]">{property.title}</h1>
          <p className="mt-2 text-xl text-gray-500">{property.address}, {property.city}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
                <ImageCarousel images={property.images} />

                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-[var(--color-dark)]">About this property</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed">{property.description}</p>
                </div>

                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-[var(--color-dark)]">Features</h2>
                    <ul className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-gray-700">
                        {property.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                                <svg className="h-5 w-5 text-[var(--color-primary)] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="sticky top-28 bg-gray-50 p-8 rounded-xl shadow-lg border border-gray-200/80">
                    <p className="text-4xl font-extrabold text-[var(--color-primary)]">{formatPrice(property.price)}</p>
                    <div className="mt-6 grid grid-cols-3 gap-4 text-center border-t border-b border-gray-200 py-4">
                        <div><p className="font-bold text-2xl text-[var(--color-dark)]">{property.bedrooms}</p><p className="text-sm text-gray-500">Beds</p></div>
                        <div><p className="font-bold text-2xl text-[var(--color-dark)]">{property.bathrooms}</p><p className="text-sm text-gray-500">Baths</p></div>
                        <div><p className="font-bold text-2xl text-[var(--color-dark)]">{property.area}</p><p className="text-sm text-gray-500">sqft</p></div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-[var(--color-dark)] mt-8 mb-4">Request Information</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required className={inputStyle}/>
                            <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required className={inputStyle}/>
                            <input type="tel" name="phone" placeholder="Your Phone" value={formData.phone} onChange={handleChange} required className={inputStyle}/>
                            <textarea name="message" placeholder="Your Message" rows={4} value={formData.message} onChange={handleChange} required className={inputStyle}></textarea>
                            <button type="submit" disabled={isSubmitting} className="w-full text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow disabled:opacity-50" style={{background: 'var(--gradient-primary)'}}>
                                {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                            </button>
                             {submitStatus.status && (
                                <div className={`text-center p-3 rounded-md text-sm ${submitStatus.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {submitStatus.message}
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;