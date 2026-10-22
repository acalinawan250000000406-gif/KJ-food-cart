import React from 'react';

export default function Toast({ message, onOpenCart }) {
  if (!message) return null;

  return (
    <div className="toast-bar">
      <span>{message}</span>
      {onOpenCart && (
        <button className="toast-view-cart" onClick={onOpenCart}>
          View Cart 🛒
        </button>
      )}
    </div>
  );
}