import React, { useState, useEffect } from 'react';
import useOnScreen from '../hooks/useOnScreen';

const Counter: React.FC<{ end: number, duration?: number, isInView: boolean }> = ({ end, duration = 2000, isInView }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [end, duration, isInView]);

    return <span className="text-4xl md:text-5xl font-extrabold text-white">{count.toLocaleString()}+</span>;
};

const StatsSection: React.FC = () => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.5, triggerOnce: true });

    return (
        <div ref={ref} className="py-20" style={{backgroundColor: 'var(--color-primary)'}}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                    <div>
                        <Counter end={100} isInView={isVisible} />
                        <p className="mt-2 text-lg font-medium opacity-90">Customers</p>
                    </div>
                    <div>
                        <Counter end={100} isInView={isVisible} />
                        <p className="mt-2 text-lg font-medium opacity-90">New Builder Properties</p>
                    </div>
                    <div>
                        <Counter end={50} isInView={isVisible} />
                        <p className="mt-2 text-lg font-medium opacity-90">A Grade Developers</p>
                    </div>
                    <div>
                        <Counter end={10} isInView={isVisible} />
                        <p className="mt-2 text-lg font-medium opacity-90">Years of Experience</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsSection;