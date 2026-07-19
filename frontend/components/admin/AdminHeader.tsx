
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const AdminHeader: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('brokerless-token');
        navigate('/admin/login');
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive ? 'bg-[var(--color-primary)] text-white' : 'text-gray-600 hover:bg-gray-200'
        }`;

    return (
         <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    <h1 className="text-2xl font-bold text-[var(--color-dark)]">Admin Panel</h1>
                    <nav className="flex items-baseline space-x-4">
                        <NavLink to="/admin/dashboard" className={navLinkClasses}>Submissions</NavLink>
                        <NavLink to="/admin/settings" className={navLinkClasses}>Settings</NavLink>
                    </nav>
                </div>
                <button
                    onClick={handleLogout}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
                    style={{ background: 'var(--gradient-primary)' }}
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;
