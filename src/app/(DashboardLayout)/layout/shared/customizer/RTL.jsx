import React, { useEffect } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';

const RTL = ({ children, direction }) => {
  useEffect(() => {
    // ✅ Update the <html> tag directly instead of just document.dir
    document.documentElement.setAttribute('dir', direction);
  }, [direction]);

  if (direction === 'rtl') {
    // ✅ Only create the cache when RTL is actually needed
    const rtlCache = createCache({
      key: 'mui-rtl',
      prepend: true,
      stylisPlugins: [rtlPlugin],
    });

    return <CacheProvider value={rtlCache}>{children}</CacheProvider>;
  }

  // ✅ For LTR, just render normally — no RTL cache
  return <>{children}</>;
};

export default RTL;
