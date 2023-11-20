import { useEffect, useState } from 'react';

interface WindowSize {
  width: number;
  height: number;
  cols: number;
}

// This was taken from https://usehooks.com/useWindowSize/
export default function useWindowSize(): WindowSize {
  const isClient = typeof window === 'object';

  const getCols = (width: number): number => {
    if (width > 1300) {
      return 4;
    }
    if (width < 1300 && width > 900) {
      return 3;
    }
    if (width < 900 && width > 600) {
      return 2;
    } else {
      return 1;
    }
  };

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
      cols: getCols(window.innerWidth),
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect((): (() => void) => {
    if (!isClient) {
      return;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
