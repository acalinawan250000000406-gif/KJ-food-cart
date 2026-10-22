import React from 'react';
import FoodCard from './FoodCard';

export default function FoodList({ items, onAddToCart }) {
  if (items.length === 0) {
    return (
      <div className="no-results">
        <p className="no-results-emoji">🥪</p>
        <h3>No food items found</h3>
        <p>Try searching for something else or switch categories.</p>
      </div>
    );
  }

  return (
    <div className="food-grid">
      {items.map((item) => (
        <FoodCard key={item.id} item={item} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}