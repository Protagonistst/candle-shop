import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that scrolls to the top of the page on route changes
 * Uses multiple strategies to ensure proper scrolling behavior
 */
const RouterScrollToTop = () => {
  const { pathname } = useLocation();

  // Use useLayoutEffect to scroll before painting
  useLayoutEffect(() => {
    // Immediately scroll to top with no smooth behavior
    window.scrollTo(0, 0);
  }, [pathname]);
  
  // Use regular useEffect as a backup
  useEffect(() => {
    // Immediate scroll
    window.scrollTo(0, 0);
    
    // Also use a small delay to handle any potential race conditions
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
      
      // Try once more after all content likely loaded
      setTimeout(() => window.scrollTo(0, 0), 100);
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
};

export default RouterScrollToTop; 