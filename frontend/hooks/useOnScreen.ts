
import { useState, useEffect, useRef, RefObject } from 'react';

interface ObserverOptions {
    threshold?: number;
    triggerOnce?: boolean;
}

const useOnScreen = (options: ObserverOptions = { threshold: 0.1, triggerOnce: true }): [RefObject<HTMLDivElement | null>, boolean] => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (options.triggerOnce && ref.current) {
                        observer.unobserve(ref.current);
                    }
                } else {
                    if (!options.triggerOnce) {
                        setIsVisible(false);
                    }
                }
            },
            { threshold: options.threshold }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, options]);

    return [ref, isVisible];
};

export default useOnScreen;
