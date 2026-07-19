
import React from 'react';
import { Link } from 'react-router-dom';

interface Breadcrumb {
    name: string;
    path: string;
}

interface PageHeaderProps {
    title: string;
    subtitle: string;
    backgroundImage: string;
    breadcrumbs: Breadcrumb[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, backgroundImage, breadcrumbs }) => {
    return (
        <div className="relative bg-cover bg-center text-white py-24 lg:py-32" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 fade-in-up">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
                <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-300">
                    {subtitle}
                </p>
                <nav className="mt-8 text-sm font-medium flex justify-center" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        {breadcrumbs.map((crumb, index) => (
                            <li key={index} className="inline-flex items-center">
                                {index > 0 && (
                                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                    </svg>
                                )}
                                {index === breadcrumbs.length - 1 ? (
                                    <span className="text-white" aria-current="page">{crumb.name}</span>
                                ) : (
                                    <Link to={crumb.path} className="text-gray-300 hover:text-white transition-colors">
                                        {crumb.name}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>
        </div>
    );
};
export default PageHeader;
