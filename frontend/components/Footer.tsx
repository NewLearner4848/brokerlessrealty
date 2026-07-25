
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import Logo from './Logo';

const LocationIcon = () => <svg className="h-5 w-5 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const PhoneIcon = () => <svg className="h-5 w-5 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const EmailIcon = () => <svg className="h-5 w-5 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

const SocialIcon: React.FC<{ children: React.ReactNode, href: string, ariaLabel: string }> = ({ children, href, ariaLabel }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className="text-gray-600 hover:text-[var(--color-secondary)] transition-colors duration-300">
        {children}
    </a>
);

const FacebookIcon = () => <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"/></svg>;
const InstagramIcon = () => <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44c0-.795-.645-1.44-1.441-1.44z"/></svg>;
const LinkedInIcon = () => <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;


const Footer: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [subscribeStatus, setSubscribeStatus] = useState<{ status: 'success' | 'error' | null; message: string }>({
        status: null,
        message: '',
    });

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubscribing(true);
        setSubscribeStatus({ status: null, message: '' });

        try {
            const response = await fetch(`${API_BASE_URL}/api/subscribers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'An error occurred.');
            }
            setSubscribeStatus({ status: 'success', message: data.message });
            setEmail('');
        } catch (error: any) {
            setSubscribeStatus({ status: 'error', message: error.message });
        } finally {
            setIsSubscribing(false);
            setTimeout(() => setSubscribeStatus({ status: null, message: '' }), 4000);
        }
    };

    const FooterLink: React.FC<{children: React.ReactNode, to?: string}> = ({children, to}) => (
        <li>
            {to ? (
                <Link to={to} className="text-gray-600 hover:text-[var(--color-dark)] transition-colors text-sm">{children}</Link>
            ) : (
                <a href="#" className="text-gray-600 hover:text-[var(--color-dark)] transition-colors text-sm">{children}</a>
            )}
        </li>
    );

  return (
    <footer style={{backgroundColor: '#FFEDFA'}} className="text-gray-800">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        
        {/* Row 1: Logo and Tagline */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-4 text-center sm:text-left mb-12 border-b border-gray-200 pb-10">
          <Link to="/" aria-label="Brokerless Realty Home" className="inline-block flex-shrink-0">
            <Logo />
          </Link>
          <p className="text-xl md:text-2xl font-semibold text-gray-600 max-w-md">
            More Than a Transaction, It's Your Journey, Your Story -- BrokerLess!
          </p>
        </div>

        {/* Row 2: Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          
          {/* Column 1: Contact Info */}
          <div className="space-y-6">
            <h3 className="font-semibold text-[var(--color-dark)] tracking-wider">Get in Touch</h3>
             <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex items-start"><LocationIcon /><span>B1204, VTP BelAir, Mahalunge, 411045</span></li>
                <li className="flex items-center"><PhoneIcon /><a href="tel:+918668273859" className="hover:text-[var(--color-dark)]">+91-8668273859</a></li>
                <li className="flex items-center"><EmailIcon /><a href="mailto:support@brokerlessrealty.com" className="hover:text-[var(--color-dark)]">support@brokerlessrealty.com</a></li>
            </ul>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-[var(--color-dark)] tracking-wider">Quick Links</h3>
            <div className="flex gap-12">
              <ul className="mt-4 space-y-3">
                <FooterLink to="/properties">Properties in Mumbai</FooterLink>
                <FooterLink to="/properties">Properties in Delhi NCR</FooterLink>
                <FooterLink to="/properties">Properties in Bangalore</FooterLink>
                <FooterLink to="/properties">Properties in Pune</FooterLink>
              </ul>
              <ul className="mt-4 space-y-3">
                  <FooterLink to="/blog">Blog & Articles</FooterLink>
                  <FooterLink to="/about">About Us</FooterLink>
                  <FooterLink to="/contact">Contact Us</FooterLink>
                  <FooterLink to="/properties">Apartments & Villas</FooterLink>
              </ul>
            </div>
          </div>

          {/* Column 3: Newsletter & Social */}
          <div>
            <h3 className="font-semibold text-[var(--color-dark)] tracking-wider">Stay Updated</h3>
            <p className="mt-4 text-sm text-gray-600">
                Get the latest property listings and market insights delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex flex-col sm:flex-row gap-2">
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                    type="email"
                    id="email-address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="w-full px-4 py-2 text-gray-900 bg-white/90 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                    placeholder="Enter your email"
                />
                <button
                    type="submit"
                    disabled={isSubscribing}
                    className="px-4 py-2 bg-[var(--color-secondary)] text-white font-semibold rounded-md hover:bg-[var(--color-secondary-light)] transition-colors disabled:opacity-70"
                >
                    {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
            </form>
            {subscribeStatus.message && (
                <p className={`mt-2 text-sm ${subscribeStatus.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {subscribeStatus.message}
                </p>
            )}
             <div className="mt-6 flex space-x-5">
              <SocialIcon href="https://www.facebook.com/share/1JV3PPz1Av/" ariaLabel="Facebook"><FacebookIcon /></SocialIcon>
              <SocialIcon href="https://www.instagram.com/brokerlessrealty?igsh=c2NtcXEwMndhd3ln" ariaLabel="Instagram"><InstagramIcon /></SocialIcon>
              <SocialIcon href="https://www.linkedin.com/company/brokerless-realty/" ariaLabel="LinkedIn"><LinkedInIcon /></SocialIcon>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 text-center sm:text-left">&copy; {new Date().getFullYear()} Brokerless Realty. All rights reserved.</p>
          <p className="text-sm text-gray-500 text-center sm:text-right">
                Designed & Developed by <a href="https://riffasservices.in" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-dark)] font-semibold">Riffas Services</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
