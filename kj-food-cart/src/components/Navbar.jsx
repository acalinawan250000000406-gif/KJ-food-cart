import React from 'react';

export default function Navbar({ cartCount, onOpenCart }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="brand">
          <span className="logo-icon">🍔</span>
          <h1>KJ's Food Cart</h1>
        </div>
        <button className="cart-btn" onClick={onOpenCart} aria-label="Open Cart">
          <span className="cart-icon">🛒</span>
          <span className="cart-text">Cart</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>
    </header>
  );
}