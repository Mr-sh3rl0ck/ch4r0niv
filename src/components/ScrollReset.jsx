import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollReset — Automatically scrolls to top on every route change.
 * Eliminates the need for manual window.scrollTo in each page component.
 */
function ScrollReset() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force instant scroll to top on every route change
    // We temporarily disable smooth scroll, scroll immediately, then restore
    const htmlEl = document.documentElement;
    const prevBehavior = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    // Restore after one frame so subsequent user-initiated scrolls stay smooth
    requestAnimationFrame(() => {
      htmlEl.style.scrollBehavior = prevBehavior;
    });
  }, [pathname]);

  return null;
}

export default ScrollReset;
