
import React, { CSSProperties, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ContactOwnerModal from '../components/ContactOwnerModal';
import PropertyCard from '../components/PropertyCard';
import StatsSection from '../components/StatsSection';
import { API_BASE_URL } from '../config';
import { Property } from '../types';
import AnimatedSection from '../components/AnimatedSection';
import TestimonialsSection from '../components/TestimonialsSection';
import TrustedPartnersSection from '../components/TrustedPartnersSection';
import InquiryModal from '../components/InquiryModal';

const HeroSection: React.FC<{ onInquiryClick: (type: 'Buy' | 'Rent' | 'Sell') => void }> = ({ onInquiryClick }) => {
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
      <div 
        className="relative bg-cover bg-center text-white pb-32" 
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        <div className="relative min-h-[500px] md:min-h-[600px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center z-10">
          
          <div className={`transition-all ease-out duration-700 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="font-charm text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight" >
              "More Than a Transaction, It's Your Journey, Your Story -- BrokerLess!"
            </h1>
          </div>
          
          <div className={`mt-10 w-full max-w-2xl flex flex-col sm:flex-row justify-center items-center gap-4 transition-all ease-out duration-700 delay-200 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button 
              onClick={() => onInquiryClick('Buy')}
              className="w-full sm:w-auto text-white font-bold px-8 py-3 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              style={{ backgroundColor: '#009688' }} // Teal
            >
              Buy Property
            </button>
            <button 
              onClick={() => onInquiryClick('Sell')}
              className="w-full sm:w-auto text-white font-bold px-8 py-3 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              style={{ backgroundColor: '#0F1C3F' }} // Blue
            >
              Sell Property
            </button>
            <button 
              onClick={() => onInquiryClick('Rent')}
              className="w-full sm:w-auto text-white font-bold px-8 py-3 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              style={{ backgroundColor: '#C2185B' }} // Magenta
            >
              Rent Property
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full">
            <div 
                className="absolute bottom-0 left-0 w-full h-32 bg-white" 
                style={{clipPath: 'polygon(0% 100%, 100% 100%, 100% 20%, 50% 70%, 0 20%)', transform: 'translateY(1px)'}}>
            </div>
        </div>
      </div>
    );
};

const FeaturedListings: React.FC<{ onContactClick: (property: Property) => void }> = ({ onContactClick }) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFeaturedProperties = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/properties?featured=true`);
                if (!response.ok) {
                    throw new Error('Failed to fetch properties.');
                }
                const data = await response.json();
                setProperties(data.slice(0, 3));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFeaturedProperties();
    }, []);

    return (
        <div className="py-24 bg-gray-50" id="featured-listings">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection className="text-center">
                     <h2 className="section-title">Featured Properties</h2>
                    <p className="section-subtitle">
                        Handpicked premium properties across India. Save lakhs by dealing directly with owners.
                    </p>
                </AnimatedSection>
                <div className="mt-16 grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                    {isLoading && <p>Loading properties...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!isLoading && !error && properties.map((property, index) => (
                        <AnimatedSection key={property.id} style={{ transitionDelay: `${index * 150}ms`}}>
                            <PropertyCard property={property} onContactClick={onContactClick} />
                        </AnimatedSection>
                    ))}
                </div>
                <AnimatedSection className="mt-16 text-center">
                    <Link to="/properties" className="bg-transparent border border-[var(--color-secondary)] text-[var(--color-secondary)] font-semibold py-2.5 px-8 rounded-lg text-base hover:bg-[var(--color-secondary)] hover:text-white transition-all duration-300 inline-block">
                        View All Properties
                    </Link>
                </AnimatedSection>
            </div>
        </div>
    );
}

const HowItWorksSection: React.FC = () => {
    const steps = [
        {
            number: '01',
            title: 'Evaluate Property',
            description: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.',
        },
        {
            number: '02',
            title: 'Meet your property specialist',
            description: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.',
        },
        {
            number: '03',
            title: 'Close the Deal',
            description: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.',
        },
        {
            number: '04',
            title: 'Have Your Property',
            description: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.',
        },
    ];

    const CheckIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );

    return (
        <div className="relative bg-white pt-24 pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="overflow-hidden lg:grid lg:grid-cols-2 lg:gap-0">
                    {/* Left Column: How it works */}
                    <div 
                        style={{ 
                            backgroundColor: 'var(--color-dark)',
                        }} 
                        className="text-white p-10 sm:p-16 flex flex-col justify-center lg:[clip-path:polygon(0%_0%,_100%_0%,_100%_100%,_0%_90%)]"
                    >
                        <AnimatedSection>
                            <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">Work Flow</p>
                            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">How it works</h2>
                            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
                                {steps.map((step) => (
                                    <div key={step.number}>
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full text-white text-xl font-bold" style={{ backgroundColor: 'var(--color-secondary)' }}>
                                                {step.number}
                                            </div>
                                            <h3 className="ml-4 text-lg font-semibold">{step.title}</h3>
                                        </div>
                                        <p className="mt-4 text-gray-300 text-sm leading-relaxed">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        </AnimatedSection>
                    </div>

                    {/* Right Column: Why Choose Brokerless */}
                    <div 
                        className="p-10 sm:p-16 flex flex-col justify-center lg:[clip-path:polygon(0%_0%,_100%_0%,_100%_90%,_0%_100%)]"
                        style={{ backgroundColor: '#FFEDFA' }}
                    >
                        <AnimatedSection>
                            <h2 className="text-3xl font-extrabold text-[var(--color-dark)] tracking-tight sm:text-4xl">Why Choose Brokerless?</h2>
                            <p className="mt-4 text-lg text-gray-600">
                                We're revolutionizing Indian real estate by connecting you directly with owners, making property transactions transparent, affordable, and hassle-free.
                            </p>
                            <ul className="mt-8 space-y-6">
                                <li className="flex">
                                    <div className="flex-shrink-0"><CheckIcon /></div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-bold text-[var(--color-dark)]">Zero Broker Commission</h4>
                                        <p className="mt-1 text-gray-600">Save lakhs by dealing directly. No hidden charges, no broker fees.</p>
                                    </div>
                                </li>
                                <li className="flex">
                                    <div className="flex-shrink-0"><CheckIcon /></div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-bold text-[var(--color-dark)]">Verified Properties</h4>
                                        <p className="mt-1 text-gray-600">Every property is thoroughly checked for legal and ownership details.</p>
                                    </div>
                                </li>
                                <li className="flex">
                                    <div className="flex-shrink-0"><CheckIcon /></div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-bold text-[var(--color-dark)]">Personalized Support</h4>
                                        <p className="mt-1 text-gray-600">Our expert team provides guidance throughout your property journey.</p>
                                    </div>
                                </li>
                                 <li className="flex">
                                    <div className="flex-shrink-0"><CheckIcon /></div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-bold text-[var(--color-dark)]">Direct Owner Contact</h4>
                                        <p className="mt-1 text-gray-600">Connect with owners without middleman complications and extra costs.</p>
                                    </div>
                                </li>
                            </ul>
                        </AnimatedSection>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ServicesSection: React.FC = () => {
    const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.25 10.25l7.5-6.25 7.5 6.25v7.5a2 2 0 01-2 2h-11a2 2 0 01-2-2v-7.5z" /></svg>;
    const DocumentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    const CalculatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5h.01" /></svg>;
    const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
    const PeopleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h4a2 2 0 012 2v1m-4 0h4" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

    const colorPalette = [
        { iconBg: 'bg-[var(--color-primary)]/10', iconText: 'text-[var(--color-primary)]', bullet: 'bg-[var(--color-primary)]' },
        { iconBg: 'bg-[var(--color-secondary)]/10', iconText: 'text-[var(--color-secondary)]', bullet: 'bg-[var(--color-secondary)]' },
        { iconBg: 'bg-indigo-100', iconText: 'text-indigo-600', bullet: 'bg-indigo-500' },
    ];

    const services = [
        { icon: <SearchIcon />, title: "Property Discovery", description: "Advanced search filters to find your perfect home based on location, budget, and preferences.", features: ["Smart Filters", "Location Intelligence", "Price Comparison", "Verified Listings"], colorClasses: colorPalette[0] },
        { icon: <DocumentIcon />, title: "Legal Documentation", description: "Complete assistance with property documentation, verification, and legal formalities.", features: ["Document Verification", "Title Check", "Legal Consultation", "Registration Support"], colorClasses: colorPalette[1] },
        { icon: <CalculatorIcon />, title: "Finance & Loans", description: "Connect with trusted banks and NBFCs for the best home loan rates and quick approvals.", features: ["Loan Comparison", "EMI Calculator", "Pre-approval", "Rate Negotiation"], colorClasses: colorPalette[2] },
        { icon: <ShieldIcon />, title: "Property Inspection", description: "Professional property inspection services to ensure quality and identify potential issues.", features: ["Quality Check", "Structure Analysis", "Amenity Verification", "Detailed Report"], colorClasses: colorPalette[0] },
        { icon: <PeopleIcon />, title: "Owner Verification", description: "Thorough background checks on property owners to ensure legitimate transactions.", features: ["Identity Verification", "Ownership Check", "Background Screening", "Trust Score"], colorClasses: colorPalette[1] },
        { icon: <ChartIcon />, title: "Market Analysis", description: "Real-time market insights and property valuation to help you make informed decisions.", features: ["Price Trends", "Market Reports", "Valuation Service", "Investment Analysis"], colorClasses: colorPalette[2] },
    ];

    const ServiceCard: React.FC<{ service: typeof services[0], delay: string }> = ({ service, delay }) => (
        <AnimatedSection 
            className="bg-white p-8 rounded-xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
            style={{ transitionDelay: delay }}
        >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${service.colorClasses.iconBg} ${service.colorClasses.iconText}`}>
                {service.icon}
            </div>
            <h3 className="mt-6 text-xl font-bold text-[var(--color-dark)]">{service.title}</h3>
            <p className="mt-2 text-gray-600 leading-relaxed">{service.description}</p>
            <ul className="mt-6 space-y-3">
                {service.features.map(feature => (
                    <li key={feature} className="flex items-center text-sm">
                        <span className={`h-2 w-2 rounded-full mr-3 flex-shrink-0 ${service.colorClasses.bullet}`}></span>
                        <span className="text-gray-700">{feature}</span>
                    </li>
                ))}
            </ul>
        </AnimatedSection>
    );

    return (
        <div id="services-section" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection className="text-center">
                    <h2 className="section-title">Our Services</h2>
                    <p className="section-subtitle">
                        Complete real estate solutions designed for the Indian market. From property discovery to final registration, we're with you every step of the way.
                    </p>
                </AnimatedSection>
                <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <ServiceCard key={service.title} service={service} delay={`${index * 100}ms`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const CtaSection: React.FC = () => {
    const CtaHomeIcon = () => (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
    );
    const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;

    return (
        <div className="relative bg-cover bg-center bg-fixed" style={{backgroundImage: "url('/images/listing.avif')"}}>
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
                <AnimatedSection>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 sm:p-16 text-center shadow-2xl border border-white/20">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-white/10 rounded-full text-white">
                                <CtaHomeIcon />
                            </div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white">Ready to Find Your Dream Home?</h2>
                        <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-100">
                            Join hundreds of happy families who found their perfect home through Brokerless Realty. Start your journey today with zero broker fees.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                            <Link to="/properties" className="text-white font-bold px-6 py-3 rounded-lg flex items-center justify-center hover:bg-[var(--color-secondary-light)] transition-colors shadow-lg w-full sm:w-auto" style={{backgroundColor: 'var(--color-secondary)'}}>
                                <SearchIcon/>
                                Start Property Search
                            </Link>
                             <input
                                type="text"
                                placeholder="Enter location..."
                                className="bg-white/90 text-gray-900 placeholder:text-gray-500 rounded-lg px-6 py-3 w-full sm:w-auto sm:min-w-[250px] border border-transparent focus:ring-2 focus:ring-white"
                            />
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
};


const HomePage: React.FC = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const location = useLocation();

  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryType, setInquiryType] = useState<'Buy' | 'Rent' | 'Sell' | null>(null);

  const handleInquiryClick = (type: 'Buy' | 'Rent' | 'Sell') => {
      setInquiryType(type);
      setIsInquiryModalOpen(true);
  };

  useEffect(() => {
    // Smooth scroll to section if hash exists
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location.hash]);

  const handleContactClick = (property: Property) => {
      setSelectedProperty(property);
      setIsContactModalOpen(true);
  };
  return (
    <div>
      <HeroSection onInquiryClick={handleInquiryClick} />
      <FeaturedListings onContactClick={handleContactClick} />
      <HowItWorksSection />
      <ServicesSection />
      <StatsSection />
      <TestimonialsSection />
      <div className="bg-gray-50 py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <AnimatedSection className="text-center max-w-4xl">
                     <h2 className="section-title">Our Trusted Partners</h2>
                     <p className="section-subtitle">
                        We collaborate with the best in the industry to bring you seamless and reliable real estate services.
                    </p>
                </AnimatedSection>
                 <AnimatedSection className="mt-16 w-full">
                    <TrustedPartnersSection />
                </AnimatedSection>
            </div>
        </div>
      <CtaSection />
      <ContactOwnerModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        property={selectedProperty}
      />
       <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        inquiryType={inquiryType}
      />
    </div>
  );
};

export default HomePage;