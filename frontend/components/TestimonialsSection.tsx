

import React, { CSSProperties, useState, useEffect, useCallback } from 'react';
import useOnScreen from '../hooks/useOnScreen';

const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string; style?: CSSProperties }> = ({ children, className, style }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1, triggerOnce: true });
    return (
        <div
            ref={ref}
            className={`${className} transition-all ease-out duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={style}
        >
            {children}
        </div>
    );
};


const TestimonialsSection: React.FC = () => {
    const testimonials = [
        {
            name: "Mr Rathi.",
            clientImage: "/images/client1.jpeg",
            message: "Buying a home felt overwhelming, but you broke it down into manageable steps, making the entire process smooth and stress-free.",
        },
        {
            name: "Ranjit Nedungadi.",
            clientImage: "/images/client2.jpeg",
            message: "I really appreciated your honest advice and the accurate information you provided about each property, which helped me make a well-informed decision.",
        },
        {
            name: "Rahul Parmar",
            clientImage: "/images/client3.jpeg",
            message: "You made the complex process of buying a home so much clearer. I always knew what to expect, and you were always available to answer my questions.",
        },
        {
            name: "Mr Vikrant",
            clientImage: "/images/client4.jpg",
        },
        {
            name: "Mr Bokil",
            clientImage: "/images/client5.jpg",
        },
        {
            name: "Mr Sourabh Zope",
            clientImage: "/images/client6.jpg",
        },
        {
            name: "Mr Naik",
            clientImage: "/images/client7.jpg",
        },
        {
            name: "Mr Gyan Sahani",
            clientImage: "/images/client8.jpg",
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const totalSlides = testimonials.length;

    const prevSlide = () => {
        setCurrentIndex(prev => (prev === 0 ? totalSlides - 1 : prev - 1));
    };

    const nextSlide = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % totalSlides);
    }, [totalSlides]);

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };
    
    useEffect(() => {
        const sliderInterval = setInterval(nextSlide, 5000);
        return () => clearInterval(sliderInterval);
    }, [nextSlide]);
    
    const QuoteIcon = () => (
        <svg className="w-10 h-10 text-gray-200 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
            <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
        </svg>
    );

    return (
        <div id="testimonials-section" className="bg-white py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection className="text-center">
                    <h2 className="section-title">What Our Clients Say</h2>
                    <p className="section-subtitle">
                        Hundreds of families have trusted us to find their dream home. Here's what they have to say.
                    </p>
                </AnimatedSection>
                
                <div className="mt-16 relative max-w-3xl mx-auto">
                    <div className="overflow-hidden">
                        <div 
                            className="flex transition-transform ease-out duration-500"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {testimonials.map((testimonial: any, index: number) => (
                                <div key={index} className="flex-shrink-0 w-full p-2">
                                    {testimonial.message ? (
                                        <div className="bg-gray-50 rounded-xl border border-gray-200/80 shadow-lg flex flex-col md:flex-row overflow-hidden md:h-96">
                                            <div className="md:w-2/5 flex-shrink-0 bg-black">
                                                <img src={testimonial.clientImage} alt={testimonial.name} className="w-full h-56 md:h-full object-contain" />
                                            </div>
                                            <div className="p-8 flex flex-col text-left overflow-y-auto">
                                                <QuoteIcon />
                                                <p className="text-gray-600 italic my-4 flex-grow text-md">
                                                   "{testimonial.message}"
                                                </p>
                                                <div className="mt-auto pt-4 border-t border-gray-200/80 flex-shrink-0">
                                                    <p className="font-bold text-lg text-[var(--color-dark)]">{testimonial.name}</p>
                                                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 rounded-xl border border-gray-200/80 shadow-lg overflow-hidden relative h-96">
                                            <img src={testimonial.clientImage} alt={testimonial.name} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end">
                                                <div className="p-6">
                                                    <p className="font-bold text-xl text-white drop-shadow-md">{testimonial.name}</p>
                                                    {testimonial.location && <p className="text-sm text-gray-200 drop-shadow-md">{testimonial.location}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Controls */}
                    <button 
                        onClick={prevSlide} 
                        aria-label="Previous testimonial"
                        className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-16 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button 
                        onClick={nextSlide} 
                        aria-label="Next testimonial"
                        className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-16 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>

                    {/* Dots */}
                    <div className="flex justify-center mt-8 space-x-2">
                        {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                            <button
                                key={slideIndex}
                                onClick={() => goToSlide(slideIndex)}
                                className={`h-3 w-3 rounded-full transition-colors duration-200 ${currentIndex === slideIndex ? 'bg-[var(--color-primary)]' : 'bg-gray-300 hover:bg-gray-400'}`}
                                aria-label={`Go to slide ${slideIndex + 1}`}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestimonialsSection;