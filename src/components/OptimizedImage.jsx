import React, { useState, useCallback } from 'react';

/**
 * OptimizedImage — Image component with lazy loading, async decoding,
 * and smooth fade-in to prevent the "loading piece by piece" effect.
 */
function OptimizedImage({ src, alt, className = '', style = {}, ...rest }) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <div className={`optimized-image-wrapper ${className}`} style={style}>
      {/* Skeleton placeholder visible until image loads */}
      {!loaded && <div className="optimized-image-skeleton" />}
      <img
        src={src}
        alt={alt || ''}
        loading="lazy"
        decoding="async"
        className={`optimized-image ${loaded ? 'loaded' : ''}`}
        onLoad={handleLoad}
        {...rest}
      />
    </div>
  );
}

export default OptimizedImage;
