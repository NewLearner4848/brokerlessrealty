
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';

const FacebookIcon = () => <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"/></svg>;
const TwitterIcon = () => <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.793 4.649-.65.176-1.336.213-2.033.188.606 1.922 2.36 3.226 4.401 3.251-1.621 1.276-3.666 2.03-5.88 2.03-.38 0-.755-.022-1.124-.067 2.094 1.344 4.585 2.126 7.24 2.126 8.683 0 13.44-7.256 13.44-13.442 0-.204-.005-.407-.014-.61a9.61 9.61 0 002.35-2.44z"/></svg>;
const InstagramIcon = () => <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44c0-.795-.645-1.44-1.441-1.44z"/></svg>;
const LinkedInIcon = () => <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;

const TopBar = () => (
    <div style={{backgroundColor: 'var(--color-dark)'}} className="text-white text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <span><a href="tel:+918668273859" className="hover:text-[var(--color-primary)] transition-colors">+91-8668273859</a></span>
                    <span className="hidden sm:inline">|</span>
                    <span className="hidden sm:inline"><a href="mailto:support@brokerlessrealty.com" className="hover:text-[var(--color-primary)] transition-colors">support@brokerlessrealty.com</a></span>
                     <span className="hidden sm:inline">|</span>
                    <span className="hidden sm:inline">B1204, VTP BelAir, Mahalunge, 411045</span>
                </div>
                <div className="flex items-center space-x-4">
                    <a href="https://www.facebook.com/share/1JV3PPz1Av/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-[var(--color-primary)] transition-colors"><FacebookIcon /></a>
                    <a href="https://www.instagram.com/brokerlessrealty?igsh=c2NtcXEwMndhd3ln" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[var(--color-primary)] transition-colors"><InstagramIcon /></a>
                    <a href="https://www.linkedin.com/company/brokerless-realty/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[var(--color-primary)] transition-colors"><LinkedInIcon /></a>
                </div>
            </div>
        </div>
    </div>
);

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `relative px-1 py-2 text-sm font-medium transition-colors duration-300 group ${
      isActive
        ? 'text-[var(--color-primary)]'
        : 'text-gray-700 hover:text-[var(--color-primary)]'
    }`;
  
  const hashLinkClasses = `relative px-1 py-2 text-sm font-medium transition-colors duration-300 group text-gray-700 hover:text-[var(--color-primary)]`;

  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
      isActive
        ? 'text-white bg-[var(--color-primary)]'
        : 'text-gray-700 hover:bg-gray-200'
    }`;
    
  const mobileHashLinkClasses = `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 text-gray-700 hover:bg-gray-200`;

  const NavLinkUnderline = () => <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>;


  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <TopBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-36">
          
          {/* Mobile Header: Logo on left, burger on right */}
          <div className="flex-1 flex items-center justify-between md:hidden">
            <div className="flex-shrink-0">
              <NavLink to="/"><Logo /></NavLink>
            </div>
            <div className="-mr-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-[var(--color-dark)] hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[var(--color-primary)]"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Header: Split nav, centered logo */}
          <div className="hidden md:flex items-center justify-between w-full">
            {/* Left Nav */}
            <nav className="flex-1 flex justify-end space-x-8">
              <NavLink to="/" className={navLinkClasses} end>Home<NavLinkUnderline /></NavLink>
              <NavLink to="/properties" className={navLinkClasses}>Properties<NavLinkUnderline /></NavLink>
              <NavLink to="/#services-section" className={hashLinkClasses}>Services<NavLinkUnderline /></NavLink>
            </nav>
            
            {/* Centered Logo */}
            <div className="px-8">
              <NavLink to="/" aria-label="Brokerless Realty Home">
                <Logo />
              </NavLink>
            </div>

            {/* Right Nav */}
            <nav className="flex-1 flex justify-start space-x-8">
                <NavLink to="/blog" className={navLinkClasses}>Blog<NavLinkUnderline /></NavLink>
                <NavLink to="/#testimonials-section" className={hashLinkClasses}>Testimonials<NavLinkUnderline /></NavLink>
                <NavLink to="/about" className={navLinkClasses}>About Us<NavLinkUnderline /></NavLink>
                <NavLink to="/contact" className={navLinkClasses}>Contact<NavLinkUnderline /></NavLink>
            </nav>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={mobileNavLinkClasses} onClick={()=>setIsOpen(false)} end>Home</NavLink>
            <NavLink to="/properties" className={mobileNavLinkClasses} onClick={()=>setIsOpen(false)}>Properties</NavLink>
            <NavLink to="/blog" className={mobileNavLinkClasses} onClick={()=>setIsOpen(false)}>Blog</NavLink>
            <NavLink to="/#services-section" className={mobileHashLinkClasses} onClick={()=>setIsOpen(false)}>Services</NavLink>
            <NavLink to="/#testimonials-section" className={mobileHashLinkClasses} onClick={()=>setIsOpen(false)}>Testimonials</NavLink>
            <NavLink to="/about" className={mobileNavLinkClasses} onClick={()=>setIsOpen(false)}>About Us</NavLink>
            <NavLink to="/contact" className={mobileNavLinkClasses} onClick={()=>setIsOpen(false)}>Contact</NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
