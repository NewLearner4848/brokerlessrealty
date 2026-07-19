import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = (): null => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there is no hash in the URL, scroll to the top of the page.
    // Pages with hash links (like the homepage sections) will handle their own scrolling.
    if (hash === '') {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
