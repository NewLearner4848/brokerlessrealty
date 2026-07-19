
import React, { useState, Fragment } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import Logo from '../Logo';

const DashboardIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const PropertyIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const SubscriberIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const SettingsIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const KeyIcon = () => <svg className="h-6 w-6" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 016-6h4a6 6 0 016 6z" /></svg>

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('brokerless-token');
        navigate('/admin/login');
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
        isActive ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
    }`;

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
             <div className="h-20 flex items-center justify-center flex-shrink-0 px-4 bg-white border-b">
                 <Logo />
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                <NavLink to="/admin/dashboard" className={navLinkClasses} onClick={() => setSidebarOpen(false)}>
                    <DashboardIcon /><span className="ml-3">Submissions</span>
                </NavLink>
                <NavLink to="/admin/properties" className={navLinkClasses} onClick={() => setSidebarOpen(false)}>
                    <PropertyIcon /><span className="ml-3">Properties</span>
                </NavLink>
                <NavLink to="/admin/rent-inquiries" className={navLinkClasses} onClick={() => setSidebarOpen(false)}>
                    <KeyIcon /><span className="ml-3">Rent Inquiries</span>
                </NavLink>
                <NavLink to="/admin/subscribers" className={navLinkClasses} onClick={() => setSidebarOpen(false)}>
                    <SubscriberIcon /><span className="ml-3">Subscribers</span>
                </NavLink>
                <NavLink to="/admin/settings" className={navLinkClasses} onClick={() => setSidebarOpen(false)}>
                    <SettingsIcon /><span className="ml-3">Settings</span>
                </NavLink>
            </nav>
            <div className="px-4 py-4 border-t">
                <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-200">
                    <LogoutIcon /><span className="ml-3">Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 flex z-40 lg:hidden">
                    <div className="fixed inset-0 bg-black/60" aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button onClick={() => setSidebarOpen(false)} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                <span className="sr-only">Close sidebar</span>
                                <svg className="h-6 w-6 text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <SidebarContent />
                    </div>
                    <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
                </div>
            )}

            {/* Static sidebar for desktop */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
                    <SidebarContent />
                </div>
            </div>

            <div className="flex-1 overflow-auto focus:outline-none">
                 <header className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:hidden">
                    <button onClick={() => setSidebarOpen(true)} className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-600">
                        <span className="sr-only">Open sidebar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                    </button>
                     <div className="flex-1 px-4 flex justify-between items-center">
                        <h1 className="text-xl font-bold text-[var(--color-dark)]">Admin Panel</h1>
                    </div>
                </header>
                <main className="flex-1 relative z-0 overflow-y-auto py-6 px-4 sm:px-6 lg:px-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;