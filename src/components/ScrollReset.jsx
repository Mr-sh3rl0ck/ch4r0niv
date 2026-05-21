import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollReset — Automatically scrolls to top on every route change.
 * Eliminates the need for manual window.scrollTo in each page component.
 */
function ScrollReset() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Override global smooth scroll behavior temporarily for instant route transitions
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    
    const timeoutId = setTimeout(() => {
      document.documentElement.style.scrollBehavior = '';
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}

export default ScrollReset;
