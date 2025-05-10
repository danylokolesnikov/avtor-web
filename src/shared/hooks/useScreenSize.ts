import { useState, useEffect } from 'react';

type State = {
  width: number;
  height: number;
  md: boolean;
};

const getState = (): State => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 0;
  const height = typeof window !== 'undefined' ? window.innerHeight : 0;

  return { width, height, md: width <= 768 };
};

export function useScreenSize(debounceDelay = 200): State {
  const [windowSize, setWindowSize] = useState<State>(getState());

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowSize(getState());
      }, debounceDelay);
    };

    window.addEventListener('resize', handleResize);

    // Set initial size
    setWindowSize(getState());

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [debounceDelay]);

  return windowSize;
}
