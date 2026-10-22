import React, { useState } from 'react';
import { PRODUCTS } from '../data/constants';

export default function ProductGrid({ selectedKey, inventory, onPickProduct }) {
  const [failedImages, setFailedImages] = useState({});

  const isAvailable = (key) => {
    if (!inventory[key]) return true;
    return inventory[key].isEnabled && inventory[key].quantity > 0;
  };

  const handleImageError = (key) => {
    setFailedImages((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <div className="boxes-container">
      <div className="boxes-grid">
        {Object.keys(PRODUCTS).map((key) => {
          const p = PRODUCTS[key];
          const on = isAvailable(key);
          const isSelected = selectedKey === key;
          const hasError = failedImages[key];

          return (
            <button
              key={key}
              className={`box-item ${isSelected ? 'on' : ''} ${!on ? 'off' : ''}`}
              style={{ '--c': p.color, gridArea: p.area }}
              disabled={!on}
              onClick={() => onPickProduct(key)}
            >
              <span className="thumb">
                {!hasError ? (
                  <img
                    src={`/images/${key}.png`}
                    alt={p.name}
                    onError={() => handleImageError(key)}
                  />
                ) : (
                  p.emoji
                )}
              </span>
              <span className="box-title">{p.name}</span>
              {!on && <span className="ribbon">SOLD OUT</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}