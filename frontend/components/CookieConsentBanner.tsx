
import React, { useState, useEffect } from 'react';

const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }
    return null;
};

const setCookie = (name: string, value: string, days: number) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/; SameSite=Lax";
};

const CookieConsentBanner: React.FC = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Delay the check slightly to avoid flicker on load
        const timer = setTimeout(() => {
            const consentCookie = getCookie('cookiesAccepted');
            if (consentCookie === null) {
                setShowBanner(true);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleAccept = () => {
        setCookie('cookiesAccepted', 'true', 365);
        setShowBanner(false);
    };

    const handleReject = () => {
        setCookie('cookiesAccepted', 'false', 365);
        setShowBanner(false);
    };

    if (!showBanner) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm p-4 z-[100] animate-slide-up">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
                <p className="text-white text-sm text-center md:text-left">
                    This site uses cookies to enhance your experience. By clicking "Accept Cookies", you agree to our use of cookies.
                </p>
                <div className="flex-shrink-0 flex items-center gap-4">
                    <button 
                        onClick={handleReject}
                        className="text-sm text-gray-300 hover:text-white hover:underline transition-colors"
                    >
                        Reject Cookies
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-5 py-2 text-sm font-semibold text-white rounded-md transition-colors hover:bg-[var(--color-primary-dark)]"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        Accept Cookies
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsentBanner;