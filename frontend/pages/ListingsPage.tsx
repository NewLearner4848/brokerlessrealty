import React, { useState, useMemo, useEffect, CSSProperties } from 'react';
import PropertyCard from '../components/PropertyCard';
import { Property } from '../types';
import ContactOwnerModal from '../components/ContactOwnerModal';
import PageHeader from '../components/PageHeader';
import AnimatedSection from '../components/AnimatedSection';
import { API_BASE_URL } from '../config';

const ListingsPage: React.FC = () => {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('All');
  const maxPrice = 50000000; // 5 Crores
  const [priceRange, setPriceRange] = useState(maxPrice);
  const [bedrooms, setBedrooms] = useState('Any');
  const [sortBy, setSortBy] = useState('default');
  
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/properties`);
        if (!response.ok) {
          throw new Error('Failed to fetch properties.');
        }
        const data = await response.json();
        setAllProperties(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);
  
  const handleContactClick = (property: Property) => {
    setSelectedProperty(property);
    setIsContactModalOpen(true);
  };

  const filteredProperties = useMemo(() => {
    let result: Property[] = allProperties
      .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.city.toLowerCase().includes(searchTerm.toLowerCase()) || p.address.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(p => propertyType === 'All' || p.type === propertyType)
      .filter(p => p.price <= priceRange)
      .filter(p => bedrooms === 'Any' || p.bedrooms >= parseInt(bedrooms));

    switch (sortBy) {
        case 'price-asc':
            result.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            result.sort((a, b) => b.price - a.price);
            break;
        default:
            break;
    }
    
    return result;
  }, [allProperties, searchTerm, propertyType, priceRange, bedrooms, sortBy]);

  const inputStyle = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm";
  const labelStyle = "block text-sm font-medium text-gray-700";
  
  const formatPriceLabel = (price: number): string => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} Lakh`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <>
      <PageHeader
        title="Our Properties"
        subtitle="Explore our curated collection of homes, apartments, and villas."
        backgroundImage="/images/listing.avif"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Properties', path: '/properties' }
        ]}
      />
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Filters */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <label htmlFor="search" className={labelStyle}>Search</label>
              <input type="text" id="search" placeholder="City, Address..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={inputStyle}/>
            </div>
            <div>
              <label htmlFor="type" className={labelStyle}>Type</label>
              <select id="type" value={propertyType} onChange={e => setPropertyType(e.target.value)} className={inputStyle}>
                <option>All</option>
                <option>House</option>
                <option>Apartment</option>
                <option>Condo</option>
                <option>Land</option>
                <option>Villa</option>
                <option>Heritage House</option>
              </select>
            </div>
            <div>
              <label htmlFor="price" className={labelStyle}>Max Price: {formatPriceLabel(priceRange)}</label>
              <input type="range" id="price" min="500000" max={maxPrice} step="500000" value={priceRange} onChange={e => setPriceRange(parseInt(e.target.value))} className="mt-4 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"/>
            </div>
            <div>
              <label htmlFor="bedrooms" className={labelStyle}>Bedrooms</label>
              <select id="bedrooms" value={bedrooms} onChange={e => setBedrooms(e.target.value)} className={inputStyle}>
                <option>Any</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>
            <div>
              <label htmlFor="sort" className={labelStyle}>Sort By</label>
              <select id="sort" value={sortBy} onChange={e => setSortBy(e.target.value)} className={inputStyle}>
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          <div className="mb-8">
              <p className="text-lg font-semibold text-gray-800">{filteredProperties.length} Properties Found</p>
          </div>

          {/* Listings Grid */}
          {isLoading && <p>Loading properties...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!isLoading && !error && (
              <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              {filteredProperties.length > 0 ? (
                  filteredProperties.map((property, index) => (
                    <AnimatedSection key={property.id} style={{ transitionDelay: `${index * 50}ms` }}>
                      <PropertyCard property={property} onContactClick={handleContactClick} />
                    </AnimatedSection>
                  ))
              ) : (
                  <div className="lg:col-span-3 md:col-span-2 text-center py-16">
                      <h3 className="text-2xl font-semibold text-gray-700">No Properties Found</h3>
                      <p className="text-gray-500 mt-2">Try adjusting your search filters to find what you're looking for.</p>
                  </div>
              )}
              </div>
          )}
        </div>
      </div>
      <ContactOwnerModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        property={selectedProperty}
      />
    </>
  );
};

export default ListingsPage;
