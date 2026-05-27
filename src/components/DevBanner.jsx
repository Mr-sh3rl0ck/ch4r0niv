import { useState, useEffect } from 'react';

function DevBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) {
      document.body.classList.add('no-banner');
      document.documentElement.style.setProperty('--banner-height', '0px');
    } else {
      document.body.classList.remove('no-banner');
      document.documentElement.style.removeProperty('--banner-height');
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="dev-banner" id="dev-banner">
      <div className="dev-banner-track">
        <span className="dev-banner-text">
          <span className="dev-banner-tag">// BETA</span>
          Sitio en desarrollo activo — algunas secciones pueden estar incompletas
          <span className="dev-banner-sep">///</span>
          <span className="dev-banner-tag">// BETA</span>
          Sitio en desarrollo activo — algunas secciones pueden estar incompletas
          <span className="dev-banner-sep">///</span>
        </span>
      </div>
      <button
        className="dev-banner-close"
        onClick={() => setVisible(false)}
        aria-label="Cerrar aviso"
      >
        ✕
      </button>
    </div>
  );
}

export default DevBanner;

