import React, { CSSProperties } from 'react';
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

export default AnimatedSection;
