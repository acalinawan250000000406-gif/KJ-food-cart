import React, { useEffect, useState } from 'react';

export default function Header({ cartCount, onOpenCart, onOpenAbout }) {
  const [bouncing, setBouncing] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    if (cartCount > 0) {
      setBouncing(true);
      const timer = setTimeout(() => setBouncing(false), 350);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  return (
    <>
      <header className="site-header">
        <div className="brand-container" onClick={onOpenAbout}>
          <div className="brand-logo-img">
            {!logoError ? (
              <img
                src="/images/logo.png"
                alt="Kenneth Jay's Food Cart Logo"
                onError={() => setLogoError(true)}
              />
            ) : (
              '🍦'
            )}
          </div>
          <div>
            <div className="brand-title">Kenneth Jay's Fun Food Carts!</div>
            <div className="brand-subtitle">Roxas Night Market, Davao City</div>
          </div>
        </div>

        <div className="header-right-tools">
          <button className="cart-circle-btn" onClick={onOpenCart} aria-label="Cart">
            🛒 <span className={`cart-count-badge ${bouncing ? 'bounce' : ''}`}>{cartCount}</span>
          </button>
          <button className="about-circle-btn" onClick={onOpenAbout} aria-label="About">
            About
          </button>
        </div>
      </header>

      <div className="bunting-banner"></div>
    </>
  );
}