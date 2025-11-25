import { useEffect, useState } from 'react';

interface ViewportSize {
  width: number;
  height: number;
}

const getInitialSize = (): ViewportSize => {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }
  return { width: window.innerWidth, height: window.innerHeight };
};

export const useViewport = () => {
  const [size, setSize] = useState<ViewportSize>(getInitialSize);

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return size;
};
