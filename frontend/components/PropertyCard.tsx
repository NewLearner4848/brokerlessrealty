import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../types';
import { API_BASE_URL } from '../config';

const LocationIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const BedIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
);
const BathIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" /></svg>
);
const AreaIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v4m0 0h-4m4 0l-5-5" /></svg>
);
const HeartIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
);
const PhoneIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
);

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
}

interface PropertyCardProps {
    property: Property;
    onContactClick: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onContactClick }) => {
  const imageUrl = (property.images && property.images.length > 0)
    ? (property.images[0].startsWith('http') ? property.images[0] : `${API_BASE_URL}${property.images[0]}`)
    : 'https://picsum.photos/800/600';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200/60 flex flex-col">
      <div className="relative">
        <img 
          className="w-full h-56 object-cover" 
          src={imageUrl} 
          alt={property.title} 
        />
        <div className="absolute top-3 left-3 flex flex-col items-start gap-2">
          <span className="bg-yellow-400 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-md">{property.type}</span>
          {property.savingsText && <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-md">{property.savingsText}</span>}
        </div>
        <button aria-label="Add to favorites" className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-colors duration-200">
          <HeartIcon />
        </button>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="font-bold text-lg text-gray-800 truncate" title={property.title}>{property.title}</h3>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <LocationIcon />
          <span>{property.address}, {property.city}</span>
        </div>
        
        <div className="flex items-baseline mt-4">
          <p className="text-2xl font-bold text-[var(--color-dark)]">{formatPrice(property.price)}</p>
          {property.originalPrice && <p className="text-gray-400 line-through ml-2 text-sm">{formatPrice(property.originalPrice)}</p>}
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm text-gray-700 border-t border-b border-gray-100 py-3 my-4">
            <div className="flex items-center"><BedIcon /><span>{property.bedrooms} Beds</span></div>
            <div className="flex items-center"><BathIcon /><span>{property.bathrooms} Baths</span></div>
            <div className="flex items-center"><AreaIcon /><span>{property.area} sq ft</span></div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {property.features.slice(0, 4).map(feature => (
            <span key={feature} className="bg-white border border-gray-300 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-full">{feature}</span>
          ))}
        </div>

        <div className="mt-auto flex justify-between items-center space-x-2 pt-2">
          <Link to={`/property/${property.id}`} className="flex-grow text-center bg-[var(--color-dark)] text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors">
            View Details
          </Link>
          <button onClick={() => onContactClick(property)} aria-label="Contact owner" className="p-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            <PhoneIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
