import React from 'react';

export default function FoodCard({ item, onAddToCart }) {
  return (
    <div className="food-card">
      <div className="food-card-image-wrapper">
        <img src={item.image} alt={item.name} className="food-card-img" />
        <span className="category-badge">{item.category}</span>
      </div>
      <div className="food-card-body">
        <h3 className="food-card-title">{item.name}</h3>
        <p className="food-card-desc">{item.description}</p>
        <div className="food-card-footer">
          <span className="food-price">₱{item.price.toFixed(2)}</span>
          <button className="add-cart-btn" onClick={() => onAddToCart(item)}>
            + Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}