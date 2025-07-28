import { useState, useEffect, useRef } from 'react';

export function useScrollAnimation(threshold = 0.1, triggerOnce = true) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { 
        threshold,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully visible
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, triggerOnce]);

  return [elementRef, isVisible];
}

export function useStaggeredAnimation(count, delay = 100) {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const elementRefs = useRef([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = elementRefs.current.indexOf(entry.target);
          if (entry.isIntersecting && index !== -1) {
            setTimeout(() => {
              setVisibleItems(prev => new Set(prev).add(index));
            }, index * delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elementRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [count, delay]);

  const setRef = (index) => (el) => {
    elementRefs.current[index] = el;
  };

  return [setRef, visibleItems];
}