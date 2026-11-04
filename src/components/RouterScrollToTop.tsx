import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Resets scroll position on every route change (query-string changes keep their position). */
const RouterScrollToTop = () => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

export default RouterScrollToTop;
