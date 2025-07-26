import { useState, useEffect } from 'react';

// Custom hook to simulate loading states for demonstration
export function useLoading(duration = 2000) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return isLoading;
}

// Hook for managing multiple loading states
export function useMultipleLoading(sections = {}) {
  const [loadingStates, setLoadingStates] = useState(
    Object.keys(sections).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {})
  );

  useEffect(() => {
    Object.entries(sections).forEach(([key, duration]) => {
      const timer = setTimeout(() => {
        setLoadingStates(prev => ({
          ...prev,
          [key]: false
        }));
      }, duration);

      return () => clearTimeout(timer);
    });
  }, [sections]);

  return loadingStates;
}

// Hook for async data loading simulation
export function useAsyncLoading(asyncFunction, dependencies = []) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const result = await asyncFunction();
        
        if (isMounted) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { isLoading, data, error };
}