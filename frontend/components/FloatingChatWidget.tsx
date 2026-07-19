

import React, { useState } from 'react';
import QuickChatModal from './QuickChatModal';

// Redefined icons to accept className prop for flexible sizing
const ChatIcon = ({ className = "h-6 w-6" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const WhatsAppIcon = ({ className = "h-6 w-6" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24"><path fill="currentColor" d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.296-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>;
const FacebookIcon = ({ className = "h-6 w-6" }: { className?: string }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"/></svg>;
const TwitterIcon = ({ className = "h-6 w-6" }: { className?: string }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.793 4.649-.65.176-1.336.213-2.033.188.606 1.922 2.36 3.226 4.401 3.251-1.621 1.276-3.666 2.03-5.88 2.03-.38 0-.755-.022-1.124-.067 2.094 1.344 4.585 2.126 7.24 2.126 8.683 0 13.44-7.256 13.44-13.442 0-.204-.005-.407-.014-.61a9.61 9.61 0 002.35-2.44z"/></svg>;
const InstagramIcon = ({ className = "h-6 w-6" }: { className?: string }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44c0-.795-.645-1.44-1.441-1.44z"/></svg>;
const LinkedInIcon = ({ className = "h-6 w-6" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24"><path fill="currentColor" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
const PlusIcon = ({ className = "h-8 w-8" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;

const FabIconContainer: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
    if (isOpen) {
        return (
            <div className="transition-transform duration-300 ease-in-out rotate-45">
                <PlusIcon />
            </div>
        );
    }
    const iconClassName = "w-4 h-4 text-white/90";
    return (
        <div className="relative w-10 h-10">
            <div className="absolute top-0 left-0"><ChatIcon className={iconClassName} /></div>
            <div className="absolute top-0 right-0"><WhatsAppIcon className={iconClassName} /></div>
            <div className="absolute bottom-0 left-0"><FacebookIcon className={iconClassName} /></div>
            <div className="absolute bottom-0 right-0"><InstagramIcon className={iconClassName} /></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><TwitterIcon className={iconClassName} /></div>
        </div>
    );
};


const FloatingChatWidget: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const openChatModal = () => {
        setIsChatModalOpen(true);
        setIsMenuOpen(false);
    };

    const menuItems: { Icon: React.FC<{className?: string}>, label: string, action: () => void, bg: string, hover: string }[] = [
        { Icon: ChatIcon, label: "Quick Chat", action: openChatModal, bg: "bg-blue-500", hover: "hover:bg-blue-600" },
        { Icon: WhatsAppIcon, label: "WhatsApp", action: () => window.open("https://wa.me/918668273859", "_blank"), bg: "bg-green-500", hover: "hover:bg-green-600" },
        { Icon: FacebookIcon, label: "Facebook", action: () => window.open("https://www.facebook.com/share/1JV3PPz1Av/", "_blank"), bg: "bg-blue-800", hover: "hover:bg-blue-900" },
        { Icon: InstagramIcon, label: "Instagram", action: () => window.open("https://www.instagram.com/brokerlessrealty?igsh=c2NtcXEwMndhd3ln", "_blank"), bg: "bg-pink-600", hover: "hover:bg-pink-700" },
        { Icon: LinkedInIcon, label: "LinkedIn", action: () => window.open("https://www.linkedin.com/company/brokerless-realty/", "_blank"), bg: "bg-sky-700", hover: "hover:bg-sky-800" },
    ];
    
    return (
        <>
            <div className="fixed bottom-36 md:bottom-32 right-6 z-50">
                 <div className="relative w-16 h-16">
                    {/* Speed Dial Menu Items */}
                    {menuItems.map(({ Icon, label, action, bg, hover }, index) => (
                         <div 
                            key={label} 
                            className="group absolute top-1 right-1"
                            style={{
                                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                transitionDelay: isMenuOpen ? `${60 + index * 40}ms` : `${(menuItems.length - index - 1) * 30}ms`,
                                transform: isMenuOpen ? `translateY(-${(index * 4.25) + 4.25}rem) scale(1)` : 'translateY(0) scale(0)',
                                opacity: isMenuOpen ? 1 : 0,
                                transformOrigin: 'center',
                            }}
                         >
                            <button
                                onClick={action}
                                aria-label={label}
                                tabIndex={isMenuOpen ? 0 : -1}
                                className={`${bg} ${hover} text-white w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-transform duration-200 transform hover:scale-110`}
                            >
                                <Icon className="h-7 w-7" />
                            </button>
                             <span className="absolute right-full mr-4 px-3 py-1.5 text-sm font-semibold text-white bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                {label}
                            </span>
                        </div>
                    ))}
                    
                    {/* Main FAB */}
                    <button
                        onClick={toggleMenu}
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle contact menu"
                        className="absolute z-10 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
                        style={{ background: 'var(--gradient-primary)' }}
                    >
                        <FabIconContainer isOpen={isMenuOpen} />
                    </button>
                </div>
            </div>
            <QuickChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} />
        </>
    );
};

export default FloatingChatWidget;
