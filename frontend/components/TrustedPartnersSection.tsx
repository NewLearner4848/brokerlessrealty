
import React from 'react';

const partners = [
    { name: 'Partner 1', logo: '/images/partner1.jpg' },
    { name: 'Partner 2', logo: '/images/partner2.jpg' },
    { name: 'Partner 3', logo: '/images/partner3.jpg' },
    { name: 'Partner 4', logo: '/images/partner4.jpg' },
    { name: 'Partner 5', logo: '/images/partner5.jpg' },
    { name: 'Partner 6', logo: '/images/partner6.jpg' },
    { name: 'Partner 7', logo: '/images/partner7.jpg' },
    { name: 'Partner 8', logo: '/images/partner8.jpg' },
    { name: 'Partner 10', logo: '/images/partner10.jpg' },
    { name: 'Partner 11', logo: '/images/partner11.jpg' },
    { name: 'Partner 12', logo: '/images/partner12.jpg' },
    { name: 'Partner 13', logo: '/images/partner13.jpg' },
    { name: 'Partner 14', logo: '/images/partner14.jpg' },
    { name: 'Partner 15', logo: '/images/partner15.jpg' },
];

const TrustedPartnersSection: React.FC = () => {
    return (
        <div className="w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <div className="flex w-max animate-scroll" style={{ animationDuration: '60s' }}>
                {[...partners, ...partners].map((partner, index) => (
                    <div key={index} className="flex-shrink-0 w-64 h-36 mx-8 flex items-center justify-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <img
                            className="max-h-full max-w-full object-contain"
                            src={partner.logo}
                            alt={partner.name}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrustedPartnersSection;
