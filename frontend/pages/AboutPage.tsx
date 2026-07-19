

import React from 'react';
import AnimatedSection from '../components/AnimatedSection';
import PageHeader from '../components/PageHeader';

const AboutSection: React.FC = () => {
    const IconWrapper: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${className}`}>
            {children}
        </div>
    );

    const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; text: string; delay?: string, iconBgClass?: string }> = ({ icon, title, text, delay = '0s', iconBgClass = 'bg-[var(--color-primary)]' }) => (
         <AnimatedSection className="bg-white p-6 rounded-lg border border-gray-200/80 shadow-sm" style={{ transitionDelay: delay }}>
            <div className="flex flex-col items-center text-center">
                <div className={`flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full text-white ${iconBgClass}`}>
                    {icon}
                </div>
                <h3 className="mt-4 text-lg font-bold text-[var(--color-dark)]">{title}</h3>
                <p className="mt-1 text-sm text-gray-500 leading-relaxed">{text}</p>
            </div>
        </AnimatedSection>
    );
    
    // Icons for the right side cards
    const VerifiedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944L12 22l9-1.056A12.02 12.02 0 0021.618 8.984z" /></svg>;
    const DirectContactIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    const MarketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
    const TrustedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

    // Icons for the left side text features
    const CommissionIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944L12 22l9-1.056A12.02 12.02 0 0021.618 8.984z" /></svg>;
    const SupportIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

    return (
        <div className="py-24 bg-gray-50" id="about-section">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Column */}
                    <AnimatedSection>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-dark)] tracking-tight">Why Choose Brokerless Realty?</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            We're revolutionizing the Indian real estate market by connecting property buyers directly with owners. Our mission is to make property transactions transparent, affordable, and hassle-free for every Indian family.
                        </p>
                        <div className="mt-8 space-y-6">
                            <div className="flex">
                                <IconWrapper className="bg-[var(--color-primary)]/10">
                                    <CommissionIcon className="text-[var(--color-primary)]" />
                                </IconWrapper>
                                <div className="ml-4">
                                    <h3 className="text-lg font-bold text-[var(--color-dark)]">Zero Broker Commission</h3>
                                    <p className="mt-1 text-gray-500">Save 1-3% of property value by dealing directly with owners. No hidden charges, no broker fees.</p>
                                </div>
                            </div>
                            <div className="flex">
                                <IconWrapper className="bg-[var(--color-secondary)]/10">
                                    <SupportIcon className="text-[var(--color-secondary)]" />
                                </IconWrapper>
                                <div className="ml-4">
                                    <h3 className="text-lg font-bold text-[var(--color-dark)]">Personalized Support</h3>
                                    <p className="mt-1 text-gray-500">Our expert team provides guidance throughout your property journey in Hindi, English, and regional languages.</p>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Right Column */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FeatureCard 
                            icon={<VerifiedIcon />} 
                            title="Verified Properties" 
                            text="Every property is thoroughly verified with legal documentation and ownership details." 
                            iconBgClass="bg-[var(--color-primary)]"
                        />
                        <FeatureCard 
                            icon={<DirectContactIcon />} 
                            title="Direct Owner Contact" 
                            text="Connect directly with property owners, eliminating middleman complications and extra costs." 
                            delay="100ms"
                             iconBgClass="bg-[var(--color-secondary)]"
                        />
                        <FeatureCard 
                            icon={<MarketIcon />} 
                            title="Market Intelligence" 
                            text="Get real-time market insights and fair pricing to make informed decisions." 
                            delay="200ms"
                            iconBgClass="bg-indigo-500"
                        />
                         <FeatureCard 
                            icon={<TrustedIcon />} 
                            title="Trusted Platform" 
                            text="India’s most trusted broker-free property platform with thousands of successful transactions." 
                            delay="300ms"
                            iconBgClass="bg-[var(--color-primary)]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const AboutPage: React.FC = () => {
    const whatMakesUsDifferentFeatures = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
            title: "BrokerLess",
            description: "We connect you directly with buyers, sellers, and renters. No commissions, no third parties, just real people talking to each other. Our platform is built on transparency and direct communication."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
            title: "Simple Technology",
            description: "Our tools make creating listings, searching for properties, and connecting with others incredibly easy — whether you’re tech-savvy or brand new to the world of online real estate. We focus on a clean, intuitive user experience."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.97l-2.7 5.4M7 20v-5a2 2 0 00-2-2H4a2 2 0 00-2 2v5" /></svg>,
            title: "Fair for All",
            description: "From the bustling big cities to the quietest small towns, we are committed to helping every Indian access a fair and open platform that puts people first, not profit margins. We believe in leveling the playing field for everyone."
        }
    ];

  return (
    <div className="bg-white">
      <PageHeader
        title="About Brokerless Realty"
        subtitle="The realty platform where people come before profits, and you’re always at the heart of every property move."
        backgroundImage="/images/about.avif"
        breadcrumbs={[
            { name: 'Home', path: '/' },
            { name: 'About Us', path: '/about' }
        ]}
      />

      {/* Our Story Section */}
       <div className="py-20 sm:py-28 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
               <AnimatedSection className="lg:order-last">
                  <img src="/images/about.avif" alt="Couple happily moving into a new home" className="rounded-xl shadow-xl w-full h-full object-cover" />
              </AnimatedSection>
              <AnimatedSection>
                  <h2 className="section-title !text-3xl !md:text-4xl text-left !max-w-full">Our Story</h2>
                  <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                     We were once frustrated buyers and sellers ourselves, tired of navigating complex deals, hidden costs, and unclear fees. We knew there had to be a better, more direct way. So we decided to build it and change the game for good.
                  </p>
                   <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                      Brokerless Realty exists because we believe everyone deserves a smart, straightforward, and honest way to find property. Our mission is to remove the barriers and eliminate the middlemen standing between you and your new home or next investment.
                  </p>
              </AnimatedSection>
          </div>
      </div>
      
      {/* We Put People First Section */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                <div className="relative lg:pr-8">
                    <AnimatedSection>
                        <img
                            className="rounded-xl shadow-2xl w-full h-auto"
                            src="/images/about.avif"
                            alt="A group of people relaxing on a jeep at sunset"
                        />
                    </AnimatedSection>
                </div>
                <div className="relative mt-12 lg:mt-0 lg:-ml-20">
                    <AnimatedSection>
                        <div className="bg-white p-8 sm:p-12 rounded-xl shadow-2xl">
                            <h2 className="section-title !text-3xl !md:text-4xl text-left !max-w-full">
                            We Put People First.
                            </h2>
                            <p className="mt-6 text-gray-600 leading-relaxed text-lg">
                            Welcome to Brokerless Realty — the realty platform where people come before profits, and you’re always at the heart of every property move. This commitment means we take the time to listen and truly understand what matters most to you. Whether you're buying your first home or selling a long-held property, our team is by your side, offering expert guidance and unwavering support. We are here to navigate the complexities for you, ensuring a smooth and positive experience every step of the way.
                            </p>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </div>
      </section>

       {/* What Makes Us Different Section */}
      <div className="bg-white py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center">
                <h2 className="section-title">What Makes Us Different?</h2>
            </AnimatedSection>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                {whatMakesUsDifferentFeatures.map((feature, index) => (
                    <AnimatedSection key={index} className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200/80 shadow-md" style={{ transitionDelay: `${index * 100}ms` }}>
                         <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                            {feature.icon}
                        </div>
                        <h3 className="mt-6 text-xl font-bold text-[var(--color-dark)]">{feature.title}</h3>
                        <p className="mt-2 text-gray-600">{feature.description}</p>
                    </AnimatedSection>
                ))}
            </div>
        </div>
      </div>
      
    </div>
  );
};

export default AboutPage;
