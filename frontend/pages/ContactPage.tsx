
import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { API_BASE_URL } from '../config';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Buy',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ status: 'success' | 'error' | null; message: string }>({
    status: null,
    message: '',
  });

  const inputStyle = "py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] border-gray-300 rounded-md";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ status: null, message: '' });

    const finalMessage = JSON.stringify({
        inquiryType: formData.inquiryType,
        userMessage: formData.message,
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: finalMessage
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred.');
      }

      setSubmitStatus({ status: 'success', message: data.message });
      setFormData({ name: '', email: '', phone: '', inquiryType: 'Buy', message: '' });
    } catch (error: any) {
      setSubmitStatus({ status: 'error', message: error.message || 'Failed to send message. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
     <div className="bg-white">
      <PageHeader
        title="Get In Touch"
        subtitle="Have questions? We'd love to hear from you. Reach out and we'll get back to you shortly."
        backgroundImage="/images/contact.avif"
        breadcrumbs={[
            { name: 'Home', path: '/' },
            { name: 'Contact Us', path: '/contact' }
        ]}
      />

      <div className="bg-gray-50">
        <div className="max-w-6xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-x-0">
            {/* Contact Form */}
            <div className="py-10 px-6 sm:p-10 lg:p-12">
              <h3 className="text-2xl font-bold text-[var(--color-dark)]">Send us a Message</h3>
              <p className="mt-2 text-sm text-gray-500">We'll get back to you as soon as possible.</p>
              <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="sr-only">Full name</label>
                  <input type="text" name="name" id="name" placeholder="Full name" value={formData.name} onChange={handleChange} required autoComplete="name" className={inputStyle} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input id="email" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required autoComplete="email" className={inputStyle} />
                </div>
                 <div className="sm:col-span-2">
                  <label htmlFor="phone" className="sr-only">Phone Number</label>
                  <input type="tel" name="phone" id="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required autoComplete="tel" className={inputStyle} />
                </div>
                <div className="sm:col-span-2">
                  <div className="grid grid-cols-3 gap-3">
                    {['Buy', 'Sell', 'Rent'].map((option) => (
                      <div key={option}>
                        <input
                          type="radio"
                          id={`inquiryType-${option}`}
                          name="inquiryType"
                          value={option}
                          checked={formData.inquiryType === option}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <label
                          htmlFor={`inquiryType-${option}`}
                          className="block w-full text-center py-3 px-2 text-sm sm:px-4 rounded-md border border-gray-300 cursor-pointer transition-colors duration-200 peer-checked:bg-[var(--color-primary)] peer-checked:text-white peer-checked:border-[var(--color-primary)] hover:bg-gray-50"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="sr-only">Message</label>
                  <textarea id="message" name="message" rows={4} placeholder="Message" value={formData.message} onChange={handleChange} required className={inputStyle}></textarea>
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" disabled={isSubmitting} className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-md text-base font-medium text-white hover:shadow-lg transition-shadow disabled:opacity-50" style={{background: 'var(--gradient-primary)'}}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
                {submitStatus.status && (
                  <div className={`sm:col-span-2 text-center p-3 rounded-md text-sm ${submitStatus.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {submitStatus.message}
                  </div>
                )}
              </form>
            </div>
            {/* Contact Info */}
            <div className="relative p-6 sm:p-10 lg:p-12 bg-gray-50 border-l border-gray-100">
              <h3 className="text-2xl font-bold text-[var(--color-dark)]">Contact Information</h3>
              <div className="mt-8 space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-teal-100 text-[var(--color-primary)]"><svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
                  <div className="ml-4">
                    <p className="text-lg font-semibold text-gray-800">Our Address</p>
                    <p className="text-gray-600">B1204, VTP BelAir, Mahalunge, 411045</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-teal-100 text-[var(--color-primary)]"><svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div>
                  <div className="ml-4">
                    <p className="text-lg font-semibold text-gray-800">Call Us</p>
                    <a href="tel:+918668273859" className="text-gray-600 hover:text-[var(--color-primary)]">+91-8668273859</a>
                  </div>
                </div>
                <div className="flex items-start">
                   <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-teal-100 text-[var(--color-primary)]"><svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                  <div className="ml-4">
                    <p className="text-lg font-semibold text-gray-800">Email Us</p>
                    <a href="mailto:support@brokerlessrealty.com" className="text-gray-600 hover:text-[var(--color-primary)]">support@brokerlessrealty.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
